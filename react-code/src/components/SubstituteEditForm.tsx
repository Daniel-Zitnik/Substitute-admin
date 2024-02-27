// react
import React, { useState } from 'react';
import { Button, Form, Input, Modal, Select, Checkbox } from 'antd';
// interface
import type { SubstituteDataType as DataType, SelectType } from '../types/index';
// text form
const { TextArea } = Input;

type Props = {
    data?: DataType;
    onClose: () => void;
    onSave: (which: string, values: DataType, action: string, id?: React.Key) => void;
    teachers: SelectType[];
    classes: SelectType[];
    loading: boolean;
}

export const SubstituteEditForm = (props: Props) => {
    // props
    const { data, onClose, onSave, teachers, classes, loading } = props;
    // highlighted checkbox
    const [checked, setChecked] = useState(data?.highlighted === 1 ? true : false);
    // form data
    const [form] = Form.useForm();
    // action
    const action = data ? 'edit' : 'create';

    const handleCheckboxChange = () => {
        setChecked(!checked);
    }

    const handleSave = () => {
        form
            .validateFields()
            .then(values => {
                values.highlighted = checked;
                if (data) {
                    // edit
                    onSave('substitute', values, action, data.key);
                } else {
                    // create
                    onSave('substitute', values, action);
                }
            })
            .catch(e => {
                console.error(e);
            });
    }

    return (
        <div>
            <Modal
                title={action == 'create' ? 'Přidat suplování' : 'Editace suplování'}
                open={true}
                width={600}
                destroyOnClose
                onCancel={onClose}
                footer={[
                    <Button key="back" onClick={onClose}>
                        Storno
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleSave} loading={loading}>
                        Uložit
                    </Button>,
                ]}
            >
                <Form initialValues={data} form={form}>
                    <Form.Item label="Chybějící" name="missing" rules={[{ required: true }]}>
                        <Select
                            options={teachers}
                        />
                    </Form.Item>
                    <Form.Item label="Třída" name="class" rules={[{ required: true }]}>
                        <Select
                            options={classes}
                        />
                    </Form.Item>
                    <Form.Item label="Hodina" name="lesson" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Předmět" name="subject" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Učebna" name="classroom">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Supluje" name="substitute" rules={[{ required: true }]}>
                        <Select
                            options={teachers}
                        />
                    </Form.Item>
                    <Form.Item label="Poznámka" name="note">
                        <TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
                    </Form.Item>
                    <Form.Item label="Zvýraznit" name="highlighted">
                        <Checkbox checked={checked} onClick={handleCheckboxChange}/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}