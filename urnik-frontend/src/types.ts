type Interval = readonly [string, string];

interface ILesson {
    interval_id: number,
    day: number,
    subject: string,
    group?: string,
}

type Division = Readonly<ILesson & {
    room: string
    teacher: string,
}>

type Teacher = Readonly<ILesson & {
    room: string
    division: string,
}>

type Room = Readonly<ILesson & {
    teacher: string
    division: string,
}>

type Lesson = Division | Teacher | Room;
type Schedule = Lesson[];

function isDivision(lesson: Lesson): lesson is Division {
    let division = lesson as Division;
    return division.room !== undefined && division.teacher !== undefined;
}

function isTeacher(lesson: Lesson): lesson is Teacher {
    let teacher = lesson as Teacher;
    return teacher.room !== undefined && teacher.division !== undefined;
}

function isRoom(lesson: Lesson): lesson is Room {
    let room = lesson as Room;
    return room.teacher !== undefined && room.division !== undefined;
}

type Timetable = {
    intervals: Interval[];
    schedules: {
        divisions: { [division: string]: Division[] },
        teachers: { [teacher: string]: Teacher[] },
        rooms: { [room: string]: Room[] },
    }
}

const ScheduleTypeKeys = ['o', 'n', 's'] as const;
type ScheduleTypeKey = typeof ScheduleTypeKeys[number];

const ScheduleType: Record<ScheduleTypeKey, string> = {
    o: "divisions",
    n: "teachers",
    s: "rooms"
} as const;

function assertScheduleTypeKey(key: string): asserts key is ScheduleTypeKey {
    if (!ScheduleTypeKeys.includes(key as ScheduleTypeKey)) {
        throw new Error(`${key} is not a valid ScheduleTypeKey`);
    }
}