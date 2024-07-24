import { render } from "preact";
import { Table } from "./table";
import { getSchedule } from "./timetable";
import { Timetable, ToolPath, ScheduleTypeKey, Path, ScheduleTypeKeys } from "./types";

export function SetPage(timetable: Timetable, path: ToolPath): void;
export function SetPage(timetable: Timetable, path: ScheduleTypeKey, id: string): void;
export function SetPage(timetable: Timetable, path: Path, id?: string): void {
    let content;

    if (ScheduleTypeKeys.includes(path)) {
        if (!id) throw new Error("id is empty");

        const schedule = getSchedule(timetable, path, id);
        if (!schedule) {
            resetHash(`id ${id} is incorrect`);
            return;
        }

        localStorage.setItem("schedule", `/${path}/${id}`);

        content = Table(schedule, timetable.intervals);
    } else {
        switch (path) {
            case "timetable":
                const schedule = localStorage.getItem("schedule");

                if (schedule) {
                    location.hash = schedule;
                    break;
                };

                location.hash = "/o/" + Object.keys(timetable.schedules.divisions)[0];
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

    render(content, document.body);
}

export function resetHash(error?: string) {
    history.replaceState({}, "", "#/")

    if (error) {
        console.error(error);
    }
}
