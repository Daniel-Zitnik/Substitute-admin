// react
import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
// interface
import type { TableColumnsType } from 'antd';
import type { DataType, NameType } from '../types/index';
import { ColumnFilterItem } from 'antd/es/table/interface';
import { log } from 'console';

type Props = {}

export const Home = (props: Props) => {
    // data
    const [data, setData] = useState<DataType[]>([]);
    const [teachers, setTeachers] = useState<ColumnFilterItem[]>([]);
    const [classes, setClasses] = useState<ColumnFilterItem[]>([]);
    // loading animation
    const [loading, setLoading] = useState<boolean>(true);

    // load data
    useEffect(() => {
        const jsonFiles = ['./json/main.json', './json/teachers.json', './json/classes.json'];
        
        Promise.all(jsonFiles.map(file => fetch(file).then(res => res.json())))
            .then(dataArray => {
                setData(dataArray[0]);
                setTeachers(dataArray[1].map(extractData));
                setClasses(dataArray[2].map(extractData));
                setLoading(false);
            })
            .catch(e => {
                console.error(e);
                setLoading(false);
            });
    }, []);

    const extractData = ({ name }: NameType) => {
        return {text: name, value: name} as ColumnFilterItem;
    }

    // table structure
    const columns: TableColumnsType<DataType> = [
        {
            title: 'Chybějící',
            dataIndex: 'missing',
            key: 'missing',
            filters: teachers,
            onFilter: (value: React.Key | boolean, record: DataType) => (typeof value === 'string') ? record.missing === value : true,
        },
        {
            title: 'Třída',
            dataIndex: 'class',
            key: 'class',
            filters: classes,
            onFilter: (value: React.Key | boolean, record: DataType) => (typeof value === 'string') ? record.class === value : true,
        },
        {
            title: 'Hodina',
            dataIndex: 'lesson',
            key: 'lesson',
            sorter: (a, b) => a.lesson - b.lesson,
        },
        {
            title: 'Předmět',
            dataIndex: 'subject',
            key: 'subject',
        },
        {
            title: 'Učebna',
            dataIndex: 'classroom',
            key: 'classroom',
        },
        {
            title: 'Supluje',
            dataIndex: 'substitute',
            key: 'substitute',
            filters: teachers,
            onFilter: (value: React.Key | boolean, record: DataType) => (typeof value === 'string') ? record.substitute === value : true,
        },
        {
            title: 'Poznámka',
            dataIndex: 'note',
            key: 'note',
        },
    ];

    // template
    return (
        <div>
            <Table dataSource={data} columns={columns} loading={loading} />
        </div>
    )
}

export default Home