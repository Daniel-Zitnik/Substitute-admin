// react
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Table, Button, Space, Modal } from 'antd';
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';
// interface
import type { SubstituteDataType as DataType, NameType, SelectType } from '../types/index';
import { Dayjs } from 'dayjs';
import type { TableColumnsType } from 'antd';
// componets
import { TheCalendar } from '../components/TheCalendar';
import { SubstituteEditForm } from '../components/SubstituteEditForm';

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
    const [data, setData] = useState<DataType[]>([]);
    // loading animation
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
    // date
    const [date, setDate] = useState<Dayjs>(getDate());
    let dateToPost = getDate().format('YYYY-MM-DD');
    // table
    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<DataType>();
    // edit form
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
                await fetchData();
            } catch (e) {
                console.error(e);
            }
        };

        fetchAll();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        // fetch data with correct date   
        const response = await fetch('/supl/www/api/getSubstitutes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ value: dateToPost }),
        });

        // extract & set data
        const responseJson: SubstituteApi[] = await response.json();
        setData(responseJson.map(({ id, ...rest }: SubstituteApi) => { return { key: id, ...rest }; }));
        setLoading(false);
    }

    const extractData = ({ name }: NameType) => {
        return {value: name, label: name};
    }

    const handleCalendarChange = (day: Dayjs) => {
        dateToPost = day.format('YYYY-MM-DD');
        setDate(day);
        fetchData();
    }

    const handleCreate = () => {
        setFormOpen(true);
    };

    const handleEdit = (item: DataType) => {
        setSelectedItem(item);
        setFormOpen(true);
    };

    const handleSave = async (values: DataType, action: string, id?: React.Key) => {
        setLoadingUpdate(true);
        // set date
        const dateProp = 'date';
        dateToPost = date.format('YYYY-MM-DD');
        values[dateProp] = dateToPost;

        try {
            // post new data
            const response = await fetch('/supl/www/api/setSubstitutes', {
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
            setFormOpen(false);
            setSelectedItem(undefined);
            // reload data
            fetchData();
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = (item: DataType) => {
        Modal.confirm({
            title: 'Opravdu chete smazat toto suplování?',
            content: 'Tato operace je nevratná.',
            okText: 'Ano',
            cancelText: 'Zrušit',
            onOk: async () => {
                try {
                    // post item id
                    const response = await fetch('/supl/www/api/setSubstitutes', {
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
                    fetchData();
                } catch (e) {
                    console.error(e);
                }
            },
        });
    };

    const handleFormClose = () => {
        setFormOpen(false);
        setSelectedItem(undefined);
    };

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
                    <FormOutlined onClick={() => handleEdit(record)} />
                    <DeleteOutlined onClick={() => handleDelete(record)} />
                </Space>
            ),
        },
    ];

    // template
    return (
        <div>
            <TheCalendar onCalendarChange={handleCalendarChange} date={date}/>
            {formOpen && <SubstituteEditForm data={selectedItem} onClose={handleFormClose} onSave={handleSave} teachers={teachersSelect} classes={classesSelect} loading={loadingUpdate} />}
            <Table dataSource={data} columns={columns} loading={loading} pagination={false} rowClassName={(record: DataType) => record.highlighted == 1 ? 'highlited-row' : ''} />
            <Button type='primary' onClick={handleCreate}>Přidat</Button>
        </div>
    )
}

export default Edit