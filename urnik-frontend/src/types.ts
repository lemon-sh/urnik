import { JSXInternal } from "preact/src/jsx";

export type Interval = readonly [string, string];

export interface ILesson {
    interval_id: number,
    day: number,
    subject: string,
    group?: string,
}

export type Division = Readonly<ILesson & {
    room: string,
    teacher: string,
}>

export type Teacher = Readonly<ILesson & {
    room: string,
    division: string,
}>

export type Room = Readonly<ILesson & {
    teacher: string,
    division: string,
}>

export type Lesson = Division | Teacher | Room;
export type Schedule = Lesson[];

export function isDivision(lesson: Lesson): lesson is Division {
    let division = lesson as Division;
    return division.room !== undefined && division.teacher !== undefined;
}

export function isTeacher(lesson: Lesson): lesson is Teacher {
    let teacher = lesson as Teacher;
    return teacher.room !== undefined && teacher.division !== undefined;
}

export function isRoom(lesson: Lesson): lesson is Room {
    let room = lesson as Room;
    return room.teacher !== undefined && room.division !== undefined;
}

export type Timetable = {
    intervals: Interval[];
    schedules: {
        divisions: { [division: string]: Division[] },
        teachers: { [teacher: string]: Teacher[] },
        rooms: { [room: string]: Room[] },
    }
}

export const schedulePaths = ['o', 'n', 's'] as const;
export type SchedulePath = typeof schedulePaths[number];

export function isSchedulePath(key: string): key is SchedulePath {
    return schedulePaths.includes(key)
}

export const scheduleNames: Record<SchedulePath, keyof Timetable["schedules"]> = {
    o: "divisions",
    n: "teachers",
    s: "rooms"
} as const;

export const toolPaths = ["", "stats", "findfreeroom"] as const;
export type ToolPath = typeof toolPaths[number];

export function isToolPath(path: string): path is ToolPath {
    return toolPaths.includes(path);
}

export const toolNames: Record<ToolPath, string> = {
    "": "plan",
    "stats": "statystyki",
    "findfreeroom": "wolny pokój"
} as const;

export type Path = SchedulePath | ToolPath;
export function isPath(path: string): path is Path {
    return isSchedulePath(path) || isToolPath(path);
}

export type JSXElement = JSXInternal.Element;

declare global {
    interface ReadonlyArray<T> {
        // source: https://github.com/microsoft/TypeScript/issues/31018#issuecomment-1293212735
        includes(searchElement: unknown, fromIndex?: number): searchElement is T;
    }
}