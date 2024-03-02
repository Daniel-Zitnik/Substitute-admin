// react
import React from 'react'
import { Table, Space } from 'antd';
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';
// interface
import type { TableColumnsType } from 'antd';
import type { AddonDataType as DataType } from '../types/index';
// style
import '../style/style.less';

type Props = {
    data: DataType[],
    loading: boolean,
    onEdit: (record: DataType) => void;
    onDelete: (which: string, record: DataType) => void;
}

export const AddonEditTable = (props: Props) => {
    // data
    const { data, loading, onEdit, onDelete } = props;
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
        },
        {
            title: 'Upravit',
            key: 'action',
            align: 'center',
            width: 100,
            render: (_, record) => (
                <Space size="large">
                    <FormOutlined onClick={() => onEdit(record)} />
                    <DeleteOutlined onClick={() => onDelete('addon', record)} />
                </Space>
            ),
        },
    ];

    const classColumns: TableColumnsType<DataType> = [
        {
            title: 'Náhradní učebny',
            dataIndex: 'text',
            key: 'key',
        },
        {
            title: 'Upravit',
            key: 'action',
            align: 'center',
            width: 100,
            render: (_, record) => (
                <Space size="large">
                    <FormOutlined onClick={() => onEdit(record)} />
                    <DeleteOutlined onClick={() => onDelete('addon', record)} />
                </Space>
            ),
        },
    ];

    const watchColumns: TableColumnsType<DataType> = [
        {
            title: 'Suplování dohledů',
            dataIndex: 'text',
            key: 'key',
        },
        {
            title: 'Upravit',
            key: 'action',
            align: 'center',
            width: 100,
            render: (_, record) => (
                <Space size="large">
                    <FormOutlined onClick={() => onEdit(record)} />
                    <DeleteOutlined onClick={() => onDelete('addon', record)} />
                </Space>
            ),
        },
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