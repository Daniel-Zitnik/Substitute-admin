// react
import React from 'react';
import { Button, Form, Input, Modal } from 'antd';
// interface
import type { NameType } from '../types/index';

type Props = {
    which: string;
    data?: NameType;
    onClose: () => void;
    onSave: (which: string, values: NameType, action: string, id?: React.Key) => void;
    loading: boolean;
}

export const ConfigForm = (props: Props) => {
    // props
    const { which, data, onClose, onSave, loading } = props;
    // form data
    const [form] = Form.useForm();
    // action
    const action = data ? 'edit' : 'create';

    const handleSave = () => {
        form
            .validateFields()
            .then(values => {
                if (data) {
                    // edit
                    onSave(which, values, action, data.key);
                } else {
                    // create
                    onSave(which, values, action);
                }
            })
            .catch(e => {
                console.error(e);
            });
    }

    return (
        <div>
            <Modal
                title={action == 'create' ? `Přidat ${which == 'teachers' ? 'učitele' : 'třídu'}` : `Editovat ${which == 'teachers' ? 'učitele' : 'třídu'}`}
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
                    <Form.Item label="Jméno" name="name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}