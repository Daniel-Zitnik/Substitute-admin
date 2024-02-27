// react
import React from 'react'
import { Table, Space } from 'antd';
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';
// interface
import type { TableColumnsType } from 'antd';
import type { SubstituteDataType as DataType } from '../types/index';
// style
import './style.css';

type Props = {
    data: DataType[],
    loading: boolean,
    onEdit: (record: DataType) => void;
    onDelete: (which: string, record: DataType) => void;
}

export const SubstituteEditTable = (props: Props) => {
    // data
    const { data, loading, onEdit, onDelete } = props;
    // table structure
    const columns: TableColumnsType<DataType> = [
        {
            title: 'Chybějící',
            dataIndex: 'missing',
            key: 'missing',
        },
        {
            title: 'Třída',
            dataIndex: 'class',
            key: 'class',
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
        },
        {
            title: 'Poznámka',
            dataIndex: 'note',
            key: 'note',
        },
        {
            title: 'Upravit',
            key: 'action',
            align: 'center',
            width: 100,
            render: (_, record) => (
                <Space size="large">
                    <FormOutlined onClick={() => onEdit(record)} />
                    <DeleteOutlined onClick={() => onDelete('substitute', record)} />
                </Space>
            ),
        },
    ];

    // template
    return (
        <Table dataSource={data} columns={columns} loading={loading} pagination={false} rowClassName={(record: DataType) => record.highlighted == 1 ? 'highlited-row' : ''} />
    )
}