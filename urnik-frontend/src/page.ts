type Path = ScheduleTypeKey | "stats" | "findfreeroom";

function SetPage(timetable: Timetable, path: Exclude<Path, ScheduleTypeKey>): void;
function SetPage(timetable: Timetable, path: ScheduleTypeKey, id: string, table: HTMLTableElement): void;
function SetPage(timetable: Timetable, path: Path, id?: string, table?: HTMLTableElement): void {
    switch (path) {
        case "o":
        case "n":
        case "s":
            if (!id) throw new Error("id is empty");
            if (!table) throw new Error("table is empty");
            
            const schedule = getSchedule(timetable, path, id);
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
