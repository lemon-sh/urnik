import { render } from "preact";
import { Table } from "./table";
import { getSchedule } from "./timetable";
import { Timetable, ToolPath, SchedulePath, Path, schedulePaths, toolPaths, toolNames, scheduleNames } from "./types";

export function SetPage(timetable: Timetable, path: ToolPath): void;
export function SetPage(timetable: Timetable, path: SchedulePath, id: string): void;
export function SetPage(timetable: Timetable, path: Path, id?: string): void {
    let content = <></>;
    let toolName: ToolPath = '';

    if (schedulePaths.includes(path)) {
        if (!id) {
            resetHash(`id cannot be empty in ${scheduleNames[path]} (${path})`);
            return;
        };

        const schedule = getSchedule(timetable, path, id);
        if (!schedule) {
            resetHash(`id "${id}" doesn't exist in ${scheduleNames[path]} (${path})`);
            return;
        }

        localStorage.setItem("schedule", `${path}/${id}`);

        content = Table(schedule, timetable.intervals);
    } else {
        toolName = path;
        switch (path) {
            case "":
                const schedule = localStorage.getItem("schedule")?.split('/');

                const hash = schedule ?? ['o', Object.keys(timetable.schedules.divisions)[0]];
                SetPage(timetable, hash[0] as SchedulePath, hash[1]);

                history.replaceState({}, '', `#/${hash[0]}/${hash[1]}`);
                return;
            case "stats":
                break;
            case "findfreeroom":
                break;
            default:
                const _exhaustiveCheck: never = path;
                return _exhaustiveCheck;
        }
    }

    render(<>
        <main>{content}</main>
        <nav>
            {toolPaths.map((ToolPath) => 
                ToolPath === toolName 
                    ? <span key={ToolPath}>{toolNames[ToolPath]}</span>
                    : <a key={ToolPath} href={`#/${ToolPath}`} >{toolNames[ToolPath]}</a>
            )}
        </nav>
    </>, document.body);
}

export function resetHash(error?: string) {
    history.replaceState({}, '', "#/");
    window.dispatchEvent(new HashChangeEvent("hashchange"));

    if (error) {
        console.error(error);
    }
}