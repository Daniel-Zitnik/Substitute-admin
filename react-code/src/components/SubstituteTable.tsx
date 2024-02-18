// react
import React from 'react'
import { Table } from 'antd';
// interface
import type { TableColumnsType } from 'antd';
import type { SubstituteDataType as DataType } from '../types/index';
import { ColumnFilterItem } from 'antd/es/table/interface';
// style
import './style.css';

type Props = {
    data: DataType[],
    teachers: ColumnFilterItem[],
    classes: ColumnFilterItem[],
    loading: boolean
}

export const SubstituteTable = (props: Props) => {
    // data
    const { data, teachers, classes, loading } = props;
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
        <Table dataSource={data} columns={columns} loading={loading} pagination={false} rowClassName={(record: DataType) => record.highlited == 1 ? 'highlited-row' : ''} />
    )
}