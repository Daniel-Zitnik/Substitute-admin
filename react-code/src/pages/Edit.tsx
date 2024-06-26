// react
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Button, Modal } from 'antd';
// interface
import type { SubstituteDataType, AddonDataType, NameType, SelectType } from '../types/index';
import { Dayjs } from 'dayjs';
// componets
import { TheCalendar } from '../components/TheCalendar';
import { SubstituteEditTable } from '../components/SubstituteEditTable';
import { SubstituteEditForm } from '../components/SubstituteEditForm';
import { AddonEditTable } from '../components/AddonEditTable';
import { AddonEditForm } from '../components/AddonEditForm';
// style
import '../style/dashboard.less';

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

type AddonApi = {
    id: number;
    date: string;
    text: string;
    type: number;
}

export const Edit = (props: Props) => {
    // get right date
    const getDate = () => { 
        let selectDate;
        const currentDay = dayjs().day();
        const currentHour = dayjs().hour();
    
        if (currentDay == 5 && currentHour >= 16 || currentDay == 6 || currentDay == 7) {
            // set to monday if it's saturday or sunday
            selectDate = dayjs().startOf('week').add(1, 'week').day(1);
        } else if (currentHour >= 16) {
            // set to next day if it's after 4pm
            selectDate = dayjs().add(1, 'day');
        } else {
            selectDate = dayjs();
        }
    
        return selectDate as Dayjs;
    }

    // data
    const [substituteData, setSubstituteData] = useState<SubstituteDataType[]>([]);
    const [addonData, setAddonData] = useState<AddonDataType[]>([]);
    // loading animation
    const [substituteTableLoading, setSubstituteTableLoading] = useState<boolean>(true);
    const [addonTableLoading, setAddonTableLoading] = useState<boolean>(true);
    const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
    // date
    const [date, setDate] = useState<Dayjs>(getDate());
    let dateToPost = getDate().format('YYYY-MM-DD');
    // substitute table
    const [substituteFormOpen, setSubstituteFormOpen] = useState<boolean>(false);
    const [selectedSubstituteItem, setSelectedSubstituteItem] = useState<SubstituteDataType>();
    // addon table
    const [addonFormOpen, setAddonFormOpen] = useState<boolean>(false);
    const [selectedAddonItem, setSelectedAddonItem] = useState<AddonDataType>();
    // edit substitute form
    const [missingsSelect, setMissingsSelect] = useState<SelectType[]>([]);
    const [classesSelect, setClassesSelect] = useState<SelectType[]>([]);
    const [substitutesSelect, setSubstitutesSelect] = useState<SelectType[]>([]);

    // load data
    useEffect(() => {
        document.title = 'Editace | Suplování';
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

        // fetch data
        const fetchAll = async () => {
            try {
                // fetch teachers & classes
                const responseTeachers = await fetch('/supl/www/api/getTeachers');
                const responseClasses = await fetch('/supl/www/api/getClasses');

                let responseTeachersJson: NameType[] = await responseTeachers.json();
                let responseClassesJson: NameType[] = await responseClasses.json();

                // sort teachers by alphabet
                responseTeachersJson.sort(function (a, b) {
                    if (a.name < b.name) {
                        return -1;
                    }
                    if (a.name > b.name) {
                        return 1;
                    }
                    return 0;
                });

                let substitute: SelectType[] = [{ value: 'odpadá', label: 'odpadá' }, { value: 'oběd', label: 'oběd' }, { value: 'samostatná práce', label: 'samostatná práce' }];
                substitute.push(...responseTeachersJson.map(extractData));

                setMissingsSelect (responseTeachersJson.map(extractData));
                setClassesSelect (responseClassesJson.map(extractData));
                setSubstitutesSelect (substitute);
                // fetch tables data
                await fetchData('getSubstitutes');
                await fetchData('getAddons');             
            } catch (e) {
                console.error(e);
            }
        };

        checkLoginStatus();
    }, []);

    const fetchData = async (url: string) => {
        // fetch data with correct date   
        const response = await fetch(`/supl/www/api/${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ value: dateToPost }),
        });

        // extract & set data
        if (url == 'getSubstitutes') {
            const responseJson: SubstituteApi[] = await response.json();
            setSubstituteData(responseJson.map(({ id, ...rest }: SubstituteApi) => { return { key: id, ...rest }; }));
            setSubstituteTableLoading(false);
        } else {
            const responseJson: AddonApi[] = await response.json();
            setAddonData(responseJson.map(({ id, ...rest }: AddonApi) => { return { key: id, ...rest }; }));
            setAddonTableLoading(false); 
        }
    }

    const extractData = ({ name }: NameType) => {
        return {value: name, label: name};
    }

    const handleCalendarChange = (day: Dayjs) => {
        dateToPost = day.format('YYYY-MM-DD');
        setDate(day);
        setSubstituteTableLoading(true);
        setAddonTableLoading(true);
        fetchData('getSubstitutes');
        fetchData('getAddons');  
    }

    const handleEditSubstitute = (item: SubstituteDataType) => {
        setSelectedSubstituteItem(item);
        setSubstituteFormOpen(true);
    };

    const handleEditAddon = (item: AddonDataType) => {
        setSelectedAddonItem(item);
        setAddonFormOpen(true);
    };

    const handleSave = async (which: string, values: SubstituteDataType | AddonDataType, action: string, id?: React.Key) => {
        setLoadingUpdate(true);
        // set date
        const dateProp = 'date';
        dateToPost = date.format('YYYY-MM-DD');
        values[dateProp] = dateToPost;

        try {
            // post new data
            const response = await fetch(`/supl/www/api/${which == 'substitute' ? 'setSubstitute' : 'setAddon'}`, {
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
            if (which == 'substitute') {
                setSubstituteFormOpen(false);
                setSelectedSubstituteItem(undefined);
                // reload data
                fetchData('getSubstitutes');
            } else {
                setAddonFormOpen(false);
                setSelectedAddonItem(undefined);
                // reload data
                fetchData('getAddons');
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = (which: string, item: SubstituteDataType | AddonDataType) => {
        Modal.confirm({
            title: `Opravdu chete smazat ${which == 'substitute' ? 'toto suplování' : 'tuto poznámku'}?`,
            content: 'Tato operace je nevratná.',
            okText: 'Ano',
            cancelText: 'Zrušit',
            onOk: async () => {
                dateToPost = date.format('YYYY-MM-DD');

                try {
                    // post item id
                    const response = await fetch(`/supl/www/api/${which == 'substitute' ? 'setSubstitute' : 'setAddon'}`, {
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
                    fetchData(`${which == 'substitute' ? 'getSubstitutes' : 'getAddons'}`);
                } catch (e) {
                    console.error(e);
                }
            },
        });
    };

    const handleSubstituteFormClose = () => {
        setSubstituteFormOpen(false);
        setSelectedSubstituteItem(undefined);
    };

    const handleAddonFormClose = () => {
        setAddonFormOpen(false);
        setSelectedAddonItem(undefined);
    };

    // template
    return (
        <div className='edit'>
            <TheCalendar 
                onCalendarChange={handleCalendarChange} 
                date={date}
            />

            <div className="tables">
                {substituteFormOpen && <SubstituteEditForm
                    data={selectedSubstituteItem} 
                    onClose={handleSubstituteFormClose} 
                    onSave={handleSave} 
                    missings={missingsSelect} 
                    classes={classesSelect} 
                    substitutes={substitutesSelect} 
                    loading={loadingUpdate} 
                />}
                <div className='table-header top'>
                    <h2>Suplování</h2>
                    <Button 
                        className='btn' 
                        type='primary' 
                        onClick={() => setSubstituteFormOpen(true)}
                    >
                        Přidat
                    </Button>
                </div>
                <SubstituteEditTable 
                    data={substituteData} 
                    loading={substituteTableLoading} 
                    onEdit={handleEditSubstitute} 
                    onDelete={handleDelete} 
                />

                {addonFormOpen && <AddonEditForm 
                    data={selectedAddonItem} 
                    onClose={handleAddonFormClose} 
                    onSave={handleSave} 
                    loading={loadingUpdate} 
                />}
                <div className='table-header'>
                    <h2>Poznámky</h2>
                    <Button 
                        className='btn' 
                        type='primary' 
                        onClick={() => setAddonFormOpen(true)}
                    >
                        Přidat
                    </Button>
                </div>
                <AddonEditTable 
                    data={addonData} 
                    loading={addonTableLoading} 
                    onEdit={handleEditAddon} 
                    onDelete={handleDelete} 
                />
            </div>
        </div>
    )
}