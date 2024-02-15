// react
import React, { useState, useEffect } from 'react';
// interface
import type { SubstituteDataType, AddonDataType, NameType } from '../types/index';
import { ColumnFilterItem } from 'antd/es/table/interface';
// componets
import { TheCalendar } from '../components/TheCalendar';
import { SubstituteTable } from '../components/SubstituteTable';
import { AddonTable } from '../components/AddonTable';

type Props = {}

export const Home = (props: Props) => {
    // data
    const [substituteData, setSubstituteData] = useState<SubstituteDataType[]>([]);
    const [teachers, setTeachers] = useState<ColumnFilterItem[]>([]);
    const [classes, setClasses] = useState<ColumnFilterItem[]>([]);
    const [addonData, setAddonData] = useState<AddonDataType[]>([]);
    // loading animation
    const [substituteTableLoading, setSubstituteTableLoading] = useState<boolean>(true);
    const [addonTableLoading, setAddonTableLoading] = useState<boolean>(true);

    // load data
    useEffect(() => {
        const jsonFiles = ['./json/main.json', './json/teachers.json', './json/classes.json'];
        
        Promise.all(jsonFiles.map(file => fetch(file).then(res => res.json())))
            .then(dataArray => {
                setSubstituteData(dataArray[0]);
                setTeachers(dataArray[1].splice(2).map(extractData));
                setClasses(dataArray[2].map(extractData));
                setSubstituteTableLoading(false);
            })
            .catch(e => {
                console.error(e);
            });
        
        fetch('./json/addons.json')
            .then(res => res.json())
            .then(json => { setAddonData(json); setAddonTableLoading(false); })
            .catch(e => console.error(e));
    }, []);

    const extractData = ({ name }: NameType) => {
        return {text: name, value: name} as ColumnFilterItem;
    }

    // template
    return (
        <div>
            <TheCalendar />
            <SubstituteTable data={substituteData} teachers={teachers} classes={classes} loading={substituteTableLoading} />
            <AddonTable data={addonData} loading={addonTableLoading} />
        </div>
    )
}

export default Home