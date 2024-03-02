// react
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
// interface
import type { SubstituteDataType, AddonDataType, NameType } from '../types/index';
import { Dayjs } from 'dayjs';
import { ColumnFilterItem } from 'antd/es/table/interface';
// componets
import { TheCalendar } from '../components/TheCalendar';
import { SubstituteTable } from '../components/SubstituteTable';
import { AddonTable } from '../components/AddonTable';

type Props = {}

type SubstituteApi = {
    id: number;
    date: string;
    missing: string;
    substitute: string;
    class: string;
    lesson: string;
    subject: string;
    classroom: string;
    note: string;
    highlighted: number;
}

type AddonApi = {
    id: number;
    date: string;
    text: string;
    type: number;
}

export const Home = (props: Props) => {
    // get right date
    const getDate = () => {
        let selectDay = dayjs().day();
        const currentHour = dayjs().hour();
    
        currentHour >= 16 && selectDay ++;
        // set to monday if it's saturday or sunday
        if (selectDay == 0 || selectDay == 6) {
            selectDay = 1;
        }
    
        return dayjs().day(selectDay) as Dayjs;
    }

    // data
    const [substituteData, setSubstituteData] = useState<SubstituteDataType[]>([]);
    const [teachers, setTeachers] = useState<ColumnFilterItem[]>([]);
    const [classes, setClasses] = useState<ColumnFilterItem[]>([]);
    const [addonData, setAddonData] = useState<AddonDataType[]>([]);
    // loading animation
    const [substituteTableLoading, setSubstituteTableLoading] = useState<boolean>(true);
    const [addonTableLoading, setAddonTableLoading] = useState<boolean>(true);
    // date
    const [date, setDate] = useState<Dayjs>(getDate());
    let dateToPost = getDate().format('YYYY-MM-DD');

    // load data
    useEffect(() => {
        const fetchAll = async () => {
            try {
                // fetch teachers & classes
                const responseTeachers = await fetch('/supl/www/api/getTeachers');
                const responseClasses = await fetch('/supl/www/api/getClasses');

                let responseTeachersJson: NameType[] = await responseTeachers.json();
                let responseClassesJson: NameType[] = await responseClasses.json();

                // sort teachers by alphabet
                responseTeachersJson.sort(function (a, b) {
                    if (a.name < b.name) {
                        return -1;
                    }
                    if (a.name > b.name) {
                        return 1;
                    }
                    return 0;
                });

                setTeachers(responseTeachersJson.map(extractData));
                setClasses(responseClassesJson.map(extractData));
                // fetch tables data
                await fetchData('getSubstitutes');
                await fetchData('getAddons');
            } catch (e) {
                console.error(e);
            }
        };

        fetchAll();
    }, []);

    const extractData = ({ name }: NameType) => {
        return {text: name, value: name} as ColumnFilterItem;
    }

    const fetchData = async (url: string) => {
        // fetch data with correct date   
        const response = await fetch(`/supl/www/api/${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ value: dateToPost }),
        });

        // extract & set data
        if (url == 'getSubstitutes') {
            const responseJson: SubstituteApi[] = await response.json();
            setSubstituteData(responseJson.map(({ id, ...rest }: SubstituteApi) => { return { key: id, ...rest }; }));
            setSubstituteTableLoading(false);
        } else {
            const responseJson: AddonApi[] = await response.json();
            setAddonData(responseJson.map(({ id, ...rest }: AddonApi) => { return { key: id, ...rest }; }));
            setAddonTableLoading(false); 
        }
    }

    const handleCalendarChange = (day: Dayjs) => {
        dateToPost = day.format('YYYY-MM-DD');
        setDate(day);
        setSubstituteTableLoading(true);
        setAddonTableLoading(true);
        fetchData('getSubstitutes');
        fetchData('getAddons');
    }

    // template
    return (
        <div>
            <TheCalendar onCalendarChange={handleCalendarChange} date={date}/>
            <SubstituteTable data={substituteData} teachers={teachers} classes={classes} loading={substituteTableLoading} />
            <AddonTable data={addonData} loading={addonTableLoading} />
        </div>
    )
}