export interface Show {
    id: number;
    name: string;
}

export interface Person {
    id: number;
    name: string;
    birthday: string;
}

export interface CastPerson {
    person: Person;
}
