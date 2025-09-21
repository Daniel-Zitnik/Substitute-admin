// react
import React from 'react';
import { DatePicker } from 'antd';
import locale from 'antd/es/date-picker/locale/cs_CZ';
import 'dayjs/locale/cs.js';
// types
import { Dayjs } from 'dayjs';
// style
import '../style/calendar.less';

type Props = {
    onCalendarChange: (day: Dayjs) => void;
    date: Dayjs;
}

export const TheCalendar = (props: Props) => {
    // disable satturday and sunday
    const disabledDates = (current: Dayjs) => {
        return current?.day() === 6 || current?.day() === 0;
    };
    
    const onCalendarChange = (day: Dayjs) => {
        props.onCalendarChange(day);
    };

    return (
        <div className='calendar'>
            <DatePicker
                className='date-picker'
                locale={locale} 
                defaultValue={props.date}
                format={'dddd - D.M. YYYY'}
                onChange={onCalendarChange}
                disabledDate={disabledDates}
                allowClear={false}
                inputReadOnly={true}
            />
        </div>
    )
}