// main data
export type DataType = {
    key: React.Key;
    date: string;
    missing: string;
    substitute: string;
    class: string;
    lesson: number;
    subject: string;
    classroom: string;
    note: string;
    highlited: boolean;
}

// for classes & teachers
export type NameType = {
    key: React.Key;
    name: string;
}