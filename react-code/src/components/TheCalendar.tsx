// react
import dayjs from 'dayjs';
import React from 'react';
import { Calendar } from 'antd';
import type { CalendarProps } from 'antd';
import { SelectInfo } from 'antd/es/calendar/generateCalendar';
// types
import { Dayjs } from 'dayjs';
// style
import './style.css';

type Props = {}

const setDate = () => {
    let selectDay = dayjs().day();
    const currentHour = dayjs().hour();

    currentHour >= 16 && selectDay ++;

    return dayjs().day(selectDay);
}

const onCalendarChange = (day: Dayjs, info: SelectInfo) => {
    console.log('date changed');
};

export const TheCalendar = (props: Props) => {
    const wrapperStyle: React.CSSProperties = {
        width: 300,
        border: `1px solid #000`,
        borderRadius: `10px`,
    };

    return (
        <div style={wrapperStyle}>
            <Calendar defaultValue={setDate()} fullscreen={false} onSelect={onCalendarChange} />
        </div>
    )
}