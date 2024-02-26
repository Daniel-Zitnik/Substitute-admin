// main data
export type SubstituteDataType = {
    key: React.Key;
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

// addon data
export type AddonDataType = {
    key: React.Key;
    date: string;
    text: string;
    type: number;
}

// for classes & teachers
export type NameType = {
    key: React.Key;
    name: string;
}

export type SelectType = {
    value: string;
    label: string;
}