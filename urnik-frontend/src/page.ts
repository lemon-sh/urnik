const Paths = ["stats", "findfreeroom"] as const;
type ToolPath = typeof Paths[number];
type Path = ScheduleTypeKey | ToolPath;

function isToolPath(path: string): path is ToolPath {
    return Paths.includes(path as ToolPath);
}

function SetPage(timetable: Timetable, path: ToolPath): void;
function SetPage(timetable: Timetable, path: ScheduleTypeKey, id: string, table: HTMLTableElement): void;
function SetPage(timetable: Timetable, path: Path, id?: string, table?: HTMLTableElement): void {
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

function resetHash(error?: string) {
    location.hash = '/';

    if (error) {
        console.error(error);
    }
}
