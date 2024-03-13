// react
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Button, Modal } from 'antd';
// interface
import type { NameType, SelectType } from '../types/index';
import { Dayjs } from 'dayjs';
// componets
import { ConfigTable } from '../components/ConfigTable';
import { ConfigForm } from '../components/ConfigForm';
// style
import '../style/dashboard.less';

type Props = {}

type ApiData = {
    id: number,
    name: string;
}

export const Config = (props: Props) => {
    // loading animation
    const [teachersTableLoading, setTeachersTableLoading] = useState<boolean>(true);
    const [classesTableLoading, setClassesTableLoading] = useState<boolean>(true);
    const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
    // form
    const [formOpen, setFormOpen] = useState<string>('no');
    const [selectedItem, setSelectedItem] = useState<NameType>();
    // data
    const [teachers, setTeachers] = useState<NameType[]>([]);
    const [classes, setClasses] = useState<NameType[]>([]);

    // load data
    useEffect(() => {
        // get user logged in status
        const checkLoginStatus = async () => {
            try {
                const response = await fetch('/supl/www/api/getLoginStatus');
                const data = await response.json();
                if (data.isLoggedIn) {
                    fetchAll();
                } else {
                    window.location.replace('http://localhost:8080/supl/www/sign/in');
                }
            } catch (e) {
                console.error(e);
            }
        };
        
        const fetchAll = async () => {
            try {
                // fetch tables data
                await fetchData('getTeachers');
                await fetchData('getClasses');             
            } catch (e) {
                console.error(e);
            }
        };

        checkLoginStatus();
    }, []);

    const fetchData = async (url: string) => {
        // fetch data with correct date   
        const response = await fetch(`/supl/www/api/${url}`);
        const responseJson: ApiData[] = await response.json();
        // extract & set data
        if (url == 'getTeachers') {
            setTeachers(responseJson.map(({ id, name }: ApiData) => { return { key: id, name }; }));
            setTeachersTableLoading(false);
        } else {
            setClasses(responseJson.map(({ id, name }: ApiData) => { return { key: id, name  }; }));
            setClassesTableLoading(false); 
        }
    }

    const handleEdit = (which: string, item: NameType) => {
        setSelectedItem(item);
        setFormOpen(which);
    };

    const handleSave = async (which: string, values: NameType, action: string, id?: React.Key) => {
        setLoadingUpdate(true);

        try {
            // post new data
            const response = await fetch(`/supl/www/api/${which == 'teachers' ? 'setTeacher' : 'setClass'}`, {
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
            setFormOpen('no');
            setSelectedItem(undefined);
            // reload data
            fetchData(`${which == 'teachers' ? 'getTeachers' : 'getClasses'}`);
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = (which: string, item: NameType) => {
        Modal.confirm({
            title: `Opravdu chete smazat ${which == 'teachers' ? 'tohoto učitele' : 'tuto třídu'}?`,
            content: 'Tato operace je nevratná.',
            okText: 'Ano',
            cancelText: 'Zrušit',
            onOk: async () => {
                try {
                    // post item id
                    const response = await fetch(`/supl/www/api/${which == 'teachers' ? 'setTeacher' : 'setClass'}`, {
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
                    fetchData(`${which == 'teachers' ? 'getTeachers' : 'getClasses'}`);
                } catch (e) {
                    console.error(e);
                }
            },
        });
    };

    const handleFormClose = () => {
        setFormOpen('no');
        setSelectedItem(undefined);
    };

    // template
    return (
        <div className='config'>
            {formOpen != 'no' && <ConfigForm 
                which={formOpen} 
                data={selectedItem} 
                onClose={handleFormClose} 
                onSave={handleSave} 
                loading={loadingUpdate} 
            />}

            <section className="teachers">
                <div className="table-header">
                    <h2>Učitelé</h2>
                    <Button
                        className='btn'
                        type='primary' 
                        onClick={() => setFormOpen('teachers')}
                    >
                        Přidat
                    </Button>
                </div>
                <ConfigTable 
                    which='teachers' 
                    data={teachers} 
                    loading={teachersTableLoading} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete} 
                />
            </section>

            <section className="classes">
                <div className="table-header">
                    <h2>Třídy</h2>
                    <Button
                        className='btn'
                        type='primary' 
                        onClick={() => setFormOpen('classes')}
                    >
                        Přidat
                    </Button>
                </div>
                <ConfigTable 
                    which='classes' 
                    data={classes} 
                    loading={classesTableLoading} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete} 
                />
            </section>
        </div>
    )
}