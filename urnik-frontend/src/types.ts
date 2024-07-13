type Interval = readonly [string, string];

type Schedule = Readonly<{
    interval_id: number,
    day: number,
    subject: string,
    group?: string,
}>

type Grade = Schedule & Readonly<{
    room: string
    teacher: string,
}>

type Teacher = Schedule & Readonly<{
    room: string
    grade: string,
}>

type Room = Schedule & Readonly<{
    teacher: string
    grade: string,
}>