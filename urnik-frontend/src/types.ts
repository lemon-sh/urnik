import { JSXInternal } from "preact/src/jsx";

export type Interval = {
	id: number;
	begin: string;
	end: string;
};

export interface ILesson {
	interval_id: number;
	day: number;
	subject: string;
	group?: string;
}

export type DivisionLesson = Readonly<
	ILesson & {
		room: string;
		teacher: string;
	}
>;

export type TeacherLesson = Readonly<
	ILesson & {
		room: string;
		division: string;
	}
>;

export type RoomLesson = Readonly<
	ILesson & {
		teacher: string;
		division: string;
	}
>;

export type Lesson = DivisionLesson | TeacherLesson | RoomLesson;
export type Schedule = Lesson[];

export function isDivision(lesson: Lesson): lesson is DivisionLesson {
	let division = lesson as DivisionLesson;
	return division.room !== undefined && division.teacher !== undefined;
}

export function isTeacher(lesson: Lesson): lesson is TeacherLesson {
	let teacher = lesson as TeacherLesson;
	return teacher.room !== undefined && teacher.division !== undefined;
}

export function isRoom(lesson: Lesson): lesson is RoomLesson {
	let room = lesson as RoomLesson;
	return room.teacher !== undefined && room.division !== undefined;
}

export type Timetable = {
	intervals: Interval[];
	schedules: {
		divisions: { [division: string]: DivisionLesson[] };
		teachers: { [teacher: string]: TeacherLesson[] };
		rooms: { [room: string]: RoomLesson[] };
	};
};

export const schedulePaths = ["o", "n", "s"] as const;
export type SchedulePath = (typeof schedulePaths)[number];

export function isSchedulePath(key: string): key is SchedulePath {
	return schedulePaths.includes(key);
}

export const scheduleNames: Record<SchedulePath, keyof Timetable["schedules"]> =
	{
		o: "divisions",
		n: "teachers",
		s: "rooms",
	} as const;

export const pagePaths = ["", "stats", "findfreeroom"] as const;
export type PagePath = (typeof pagePaths)[number];

export function isPagePath(path: string): path is PagePath {
	return pagePaths.includes(path);
}

export const pageNames: Record<PagePath, string> = {
	"": "plan",
	stats: "statystyki",
	findfreeroom: "wolny pokój",
} as const;

export type Path = SchedulePath | PagePath;
export function isPath(path: string): path is Path {
	return isSchedulePath(path) || isPagePath(path);
}

export type JSXElement = JSXInternal.Element;

declare global {
	interface ReadonlyArray<T> {
		// source: https://github.com/microsoft/TypeScript/issues/31018#issuecomment-1293212735
		includes(searchElement: unknown, fromIndex?: number): searchElement is T;
	}
}
