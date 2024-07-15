import { modifyTable } from "./table";
import { getSchedule } from "./timetable";
import { Timetable, ToolPath, ScheduleTypeKey, Path } from "./types";

export function SetPage(timetable: Timetable, path: ToolPath): void;
export function SetPage(timetable: Timetable, path: ScheduleTypeKey, id: string, table: HTMLTableElement): void;
export function SetPage(timetable: Timetable, path: Path, id?: string, table?: HTMLTableElement): void {
    switch (path) {
        case "o":
        case "n":
        case "s":
            if (!id) throw new Error("id is empty");
            if (!table) throw new Error("table is empty");

            const schedule = getSchedule(timetable, path, id);
            if (!schedule) {
                resetHash(`id ${id} is incorrect`);
                return;
            }

            modifyTable(table, schedule, timetable.intervals);
            document.body.appendChild(table);
            break;
        case "stats":
            break;
        case "findfreeroom":
            break;
        default:
            const _exhaustiveCheck: never = path;
            return _exhaustiveCheck;
    }
}

export function resetHash(error?: string) {
    location.hash = '/';

    if (error) {
        console.error(error);
    }
}
