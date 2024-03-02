// react
import dayjs from 'dayjs';
import React from 'react';
import { Calendar } from 'antd';
import type { CalendarProps } from 'antd';
import { SelectInfo } from 'antd/es/calendar/generateCalendar';
// types
import { Dayjs } from 'dayjs';
// style
import '../style/style.less';

type Props = {
    onCalendarChange: (day: Dayjs) => void;
    date: Dayjs;
}

export const TheCalendar = (props: Props) => {
    const wrapperStyle: React.CSSProperties = {
        width: 300,
        border: `1px solid #000`,
        borderRadius: `10px`,
    };

    const onCalendarChange = (day: Dayjs) => {
        props.onCalendarChange(day);
    };

    return (
        <div style={wrapperStyle}>
            <Calendar defaultValue={props.date} fullscreen={false} onSelect={onCalendarChange} />
        </div>
    )
}