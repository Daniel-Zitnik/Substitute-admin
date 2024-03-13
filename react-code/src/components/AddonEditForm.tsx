// react
import React from 'react';
import { Button, Form, Input, Modal, Select } from 'antd';
// interface
import type { AddonDataType as DataType } from '../types/index';
// text area
const { TextArea } = Input;

type Props = {
    data?: DataType;
    onClose: () => void;
    onSave: (which: string, values: DataType, action: string, id?: React.Key) => void;
    loading: boolean;
}

export const AddonEditForm = (props: Props) => {
    // props
    const { data, onClose, onSave, loading } = props;
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
                    onSave('addon', values, action, data.key);
                } else {
                    // create
                    onSave('addon', values, action);
                }
            })
            .catch(e => {
                console.error(e);
            });
    }

    return (
        <div>
            <Modal
                title={action == 'create' ? 'Přidat poznámky' : 'Editace poznámek'}
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
                    <Form.Item label="Typ poznámky" name="type" rules={[{ required: true }]}>
                        <Select
                            options={[
                                { value: 1, label: 'Poznámka' },
                                { value: 2, label: 'Náhradní učebna' },
                                { value: 3, label: 'Suplování dohledu' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label="Text" name="text" rules={[{ required: true }]}>
                        <TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}