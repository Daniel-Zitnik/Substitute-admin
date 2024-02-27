// react
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Button, Modal } from 'antd';
// interface
import type { SubstituteDataType, AddonDataType, NameType, SelectType } from '../types/index';
import { Dayjs } from 'dayjs';
// componets
import { TheCalendar } from '../components/TheCalendar';
import { SubstituteEditTable } from '../components/SubstituteEditTable';
import { SubstituteEditForm } from '../components/SubstituteEditForm';
import { AddonEditTable } from '../components/AddonEditTable';
import { AddonEditForm } from '../components/AddonEditForm';

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

export const Edit = (props: Props) => {
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
    const [addonData, setAddonData] = useState<AddonDataType[]>([]);
    // loading animation
    const [substituteTableLoading, setSubstituteTableLoading] = useState<boolean>(true);
    const [addonTableLoading, setAddonTableLoading] = useState<boolean>(true);
    const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
    // date
    const [date, setDate] = useState<Dayjs>(getDate());
    let dateToPost = getDate().format('YYYY-MM-DD');
    // substitute table
    const [substituteFormOpen, setSubstituteFormOpen] = useState<boolean>(false);
    const [selectedSubstituteItem, setSelectedSubstituteItem] = useState<SubstituteDataType>();
    // addon table
    const [addonFormOpen, setAddonFormOpen] = useState<boolean>(false);
    const [selectedAddonItem, setSelectedAddonItem] = useState<AddonDataType>();
    // edit substitute form
    const [teachersSelect, setTeachersSelect] = useState<SelectType[]>([]);
    const [classesSelect, setClassesSelect] = useState<SelectType[]>([]);

    // load data
    useEffect(() => {
        const fetchAll = async () => {
            try {
                // fetch teachers & classes
                const responseTeachers = await fetch('/supl/www/api/getTeachers');
                const responseClasses = await fetch('/supl/www/api/getClasses');

                const responseTeachersJson: NameType[] = await responseTeachers.json();
                const responseClassesJson: NameType[] = await responseClasses.json();

                setTeachersSelect (responseTeachersJson.map(extractData));
                setClassesSelect (responseClassesJson.map(extractData));
                // fetch tables data
                await fetchData('getSubstitutes');
                await fetchData('getAddons');             
            } catch (e) {
                console.error(e);
            }
        };

        fetchAll();
    }, []);

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

    const extractData = ({ name }: NameType) => {
        return {value: name, label: name};
    }

    const handleCalendarChange = (day: Dayjs) => {
        dateToPost = day.format('YYYY-MM-DD');
        setDate(day);
        setSubstituteTableLoading(true);
        setAddonTableLoading(true);
        fetchData('getSubstitutes');
        fetchData('getAddons');  
    }

    const handleEditSubstitute = (item: SubstituteDataType) => {
        setSelectedSubstituteItem(item);
        setSubstituteFormOpen(true);
    };

    const handleEditAddon = (item: AddonDataType) => {
        setSelectedAddonItem(item);
        setAddonFormOpen(true);
    };

    const handleSave = async (which: string, values: SubstituteDataType | AddonDataType, action: string, id?: React.Key) => {
        setLoadingUpdate(true);
        // set date
        const dateProp = 'date';
        dateToPost = date.format('YYYY-MM-DD');
        values[dateProp] = dateToPost;

        try {
            // post new data
            const response = await fetch(`/supl/www/api/${which == 'substitute' ? 'setSubstitute' : 'setAddon'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: action, value: values, id: id }),
            });

            // on error
            if (!response.status) {
                throw new Error('HTTP error');
            }

            // close form
            setLoadingUpdate(false);
            if (which == 'substitute') {
                setSubstituteFormOpen(false);
                setSelectedSubstituteItem(undefined);
                // reload data
                fetchData('getSubstitutes');
            } else {
                setAddonFormOpen(false);
                setSelectedAddonItem(undefined);
                // reload data
                fetchData('getAddons');
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = (which: string, item: SubstituteDataType | AddonDataType) => {
        Modal.confirm({
            title: `Opravdu chete smazat ${which == 'substitute' ? 'toto suplování' : 'tuto poznámku'}?`,
            content: 'Tato operace je nevratná.',
            okText: 'Ano',
            cancelText: 'Zrušit',
            onOk: async () => {
                dateToPost = date.format('YYYY-MM-DD');

                try {
                    // post item id
                    const response = await fetch(`/supl/www/api/${which == 'substitute' ? 'setSubstitute' : 'setAddon'}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ action: 'delete', value: null, id: item.key }),
                    });
        
                    // on error
                    if (!response.status) {
                        throw new Error('HTTP error');
                    }
                    
                    // reload data
                    fetchData(`${which == 'substitute' ? 'getSubstitutes' : 'getAddons'}`);
                } catch (e) {
                    console.error(e);
                }
            },
        });
    };

    const handleSubstituteFormClose = () => {
        setSubstituteFormOpen(false);
        setSelectedSubstituteItem(undefined);
    };

    const handleAddonFormClose = () => {
        setAddonFormOpen(false);
        setSelectedAddonItem(undefined);
    };

    // template
    return (
        <div>
            <TheCalendar onCalendarChange={handleCalendarChange} date={date}/>
            {substituteFormOpen && <SubstituteEditForm data={selectedSubstituteItem} onClose={handleSubstituteFormClose} onSave={handleSave} teachers={teachersSelect} classes={classesSelect} loading={loadingUpdate} />}
            <SubstituteEditTable data={substituteData} loading={substituteTableLoading} onEdit={handleEditSubstitute} onDelete={handleDelete} />
            <Button type='primary' onClick={() => setSubstituteFormOpen(true)}>Přidat</Button>
            {addonFormOpen && <AddonEditForm data={selectedAddonItem} onClose={handleAddonFormClose} onSave={handleSave} loading={loadingUpdate} />}
            <AddonEditTable data={addonData} loading={substituteTableLoading} onEdit={handleEditAddon} onDelete={handleDelete} />
            <Button type='primary' onClick={() => setAddonFormOpen(true)}>Přidat</Button>
        </div>
    )
}

export default Edit