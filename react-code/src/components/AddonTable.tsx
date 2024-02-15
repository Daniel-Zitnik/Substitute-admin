// react
import React from 'react'
import { Table } from 'antd';
// interface
import type { TableColumnsType } from 'antd';
import type { AddonDataType as DataType } from '../types/index';

type Props = {
    data: DataType[],
    loading: boolean
}

export const AddonTable = (props: Props) => {
    // data
    const { data, loading } = props;
    // sort data
    const noteData: DataType[] = [];
    data.forEach (a => a.type == 1 && noteData.push(a));
    const classData: DataType[] = [];
    data.forEach (a => a.type == 2 && classData.push(a));
    const watchData: DataType[] = [];
    data.forEach (a => a.type == 3 && watchData.push(a));
    // table structure
    const noteColumns: TableColumnsType<DataType> = [
        {
            title: 'Poznámky',
            dataIndex: 'text',
            key: 'key',
        }
    ];

    const classColumns: TableColumnsType<DataType> = [
        {
            title: 'Náhradní učebny',
            dataIndex: 'text',
            key: 'key',
        }
    ];

    const watchColumns: TableColumnsType<DataType> = [
        {
            title: 'Suplování dohledů',
            dataIndex: 'text',
            key: 'key',
        }
    ];

    // template
    return (
        <div>
            <Table dataSource={noteData} columns={noteColumns} loading={loading} pagination={false} />
            <Table dataSource={classData} columns={classColumns} loading={loading} pagination={false} />
            <Table dataSource={watchData} columns={watchColumns} loading={loading} pagination={false} />
        </div>
    )
}