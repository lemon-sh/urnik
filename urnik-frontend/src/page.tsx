import { render } from "preact";
import { createTable } from "./table";
import { getSchedule } from "./timetable";
import { Timetable, PagePath, SchedulePath, Path, schedulePaths, pagePaths, pageNames, scheduleNames } from "./types";

export function setPage(timetable: Timetable, path: PagePath): void;
export function setPage(timetable: Timetable, path: SchedulePath, id: string): void;
export function setPage(timetable: Timetable, path: Path, id?: string): void {
    let content = <></>;
    let currentPagePath: PagePath = '';

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

        content = createTable(schedule, timetable.intervals);
    } else {
        currentPagePath = path;
        switch (path) {
            case "":
                const schedule = localStorage.getItem("schedule")?.split('/');

                const hash = schedule ?? ['o', Object.keys(timetable.schedules.divisions)[0]];
                setPage(timetable, hash[0] as SchedulePath, hash[1]);

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
            {pagePaths.map((p) => 
                p === currentPagePath 
                    ? <span key={p}>{pageNames[p]}</span>
                    : <a key={p} href={`#/${p}`} >{pageNames[p]}</a>
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