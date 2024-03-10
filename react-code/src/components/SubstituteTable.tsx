// react
import React from 'react'
import { ConfigProvider, Table } from 'antd';
// interface
import type { TableColumnsType, TablePaginationConfig } from 'antd';
import type { SubstituteDataType as DataType } from '../types/index';
import { ColumnFilterItem, FilterValue, SortOrder, SorterResult } from 'antd/es/table/interface';
// style


type Props = {
    data: DataType[];
    teachers: ColumnFilterItem[];
    classes: ColumnFilterItem[];
    loading: boolean;
}

type TableFilters = {
    class: FilterValue | null;
    missing: FilterValue | null;
    substitute: FilterValue | null;
    lesson: SortOrder | undefined;
}

export const SubstituteTable = (props: Props) => {
    // get local storage data
    const getLocalStorageData = () => {
        const gotData = localStorage.getItem('substituteTableFilters');
        if (gotData !== null) {
            return JSON.parse(gotData) as TableFilters;
        } else {
            const filtersObject = {
                class: null,
                missing: null,
                substitute: null,
                lesson: undefined,
            }

            localStorage.setItem( 'substituteTableFilters', JSON.stringify(filtersObject) );
            return filtersObject as TableFilters;
        }
    }
    // data
    const { data, teachers, classes, loading } = props;
    // filters
    const filters: TableFilters = getLocalStorageData();
    // filter change
    const handleTableChange = (pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>, sorter: SorterResult<DataType> | SorterResult<DataType>[]) => {
        if (Array.isArray(sorter) == false) {
            localStorage.setItem( 'substituteTableFilters', JSON.stringify({ ...filters, lesson: sorter.order }) );
        }
    };
    // change no data text
    const customEmpty = () => (
        <div style={{ textAlign: 'center' }}>
            <p>Žádné suplování</p>
        </div>
    );
    // table structure
    const columns: TableColumnsType<DataType> = [
        {
            title: 'Chybějící',
            dataIndex: 'missing',
            key: 'missing',
            filters: teachers,
            onFilter: (value: React.Key | boolean, record: DataType) => (typeof value === 'string') ? record.missing === value : true,
            defaultFilteredValue: filters.missing,
        },
        {
            title: 'Třída',
            dataIndex: 'class',
            key: 'class',
            filters: classes,
            onFilter: (value: React.Key | boolean, record: DataType) => (typeof value === 'string') ? record.class === value : true,
            defaultFilteredValue: filters.class,
        },
        {
            title: 'Hodina',
            dataIndex: 'lesson',
            key: 'lesson',
            defaultSortOrder: filters.lesson,
            sorter: (a, b) => parseInt(a.lesson.charAt(0)) - parseInt(b.lesson.charAt(0)),
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
            defaultFilteredValue: filters.substitute,
        },
        {
            title: 'Poznámka',
            dataIndex: 'note',
            key: 'note',
        },
    ];

    // template
    return (
        <div className='substitute-table'>
            <div className='table-wrapper'>
                <ConfigProvider renderEmpty={customEmpty}>
                    <Table
                        dataSource={data} 
                        columns={columns} 
                        onChange={handleTableChange} 
                        loading={loading} 
                        pagination={false} 
                        rowClassName={(record: DataType) => record.highlighted == 1 ? 'highlited-row' : ''}
                        sticky={true}
                    />
                </ConfigProvider>
            </div>
        </div>
    )
}