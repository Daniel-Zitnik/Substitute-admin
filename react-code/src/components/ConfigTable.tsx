// react
import React from 'react'
import { Table, Space } from 'antd';
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';
// interface
import type { TableColumnsType } from 'antd';
import type { NameType } from '../types/index';
// style
import '../style/style.less';

type Props = {
    which: string;
    data: NameType[],
    loading: boolean,
    onEdit: (which: string, record: NameType) => void;
    onDelete: (which: string, record: NameType) => void;
}

export const ConfigTable = (props: Props) => {
    // data
    const { which, data, loading, onEdit, onDelete } = props;
    // table structure
    const columns: TableColumnsType<NameType> = [
        {
            title: `${which == 'teachers' ? 'Učitelé' : 'Třídy'}`,
            dataIndex: 'name',
            key: 'key',
        },
        {
            title: 'Upravit',
            key: 'action',
            align: 'center',
            width: 100,
            render: (_, record) => (
                <Space size="large">
                    <FormOutlined onClick={() => onEdit(which, record)} />
                    <DeleteOutlined onClick={() => onDelete(which, record)} />
                </Space>
            ),
        },
    ];

    // template
    return (
        <div>
            <Table dataSource={data} columns={columns} loading={loading} pagination={false} />
        </div>
    )
}