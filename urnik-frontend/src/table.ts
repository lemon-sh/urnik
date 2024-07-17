import { Schedule, Interval, Lesson, isDivision, Division, isTeacher, Teacher, Room } from "./types";

const tableHeaders = ["Nr", "Godz", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"] as const;

export function createTable() {
    const table = document.createElement("table");
    const tHead = table.createTHead();
    for (const tableHeader of tableHeaders) {
        let th = document.createElement("th");
        th.textContent = tableHeader;
        tHead.appendChild(th);
    }

    table.createTBody();
    return table;
}

export function modifyTable(table: HTMLTableElement, schedule: Schedule, intervals: Interval[]): void {
    let tBody = table.tBodies[0];
    tBody.innerHTML = '';

    for (let i = 0; i < schedule[schedule.length - 1].interval_id + 1; i++) {
        const newRow = tBody.insertRow();

        const th = document.createElement("th");
        newRow.append(th.cloneNode(), th);

        for (let i = 0; i < tableHeaders.length; i++) {
            newRow.insertCell();
        }

        newRow.cells[0].textContent = String(i + 1);
        newRow.cells[1].textContent = `${intervals[i][0]} - ${intervals[i][1]}`;
    }

    let lessonContent: (lesson: Lesson) => string;
    const toSpan = (str: string, type: string) => `<span class="${type}">${str}</span>`;
    const toAnchor = (str: string, type: string) => `<a href="#/${type}/${encodeURIComponent(str)}" class="${type}">${str}</a>`;

    let lesson = schedule[0]
    if (isDivision(lesson)) {
        lessonContent = (l) => 
            `${toSpan(l.subject, 'p')} 
            ${l.group ? `-${l.group}` : ""} 
            ${toAnchor((l as Division).room, 's')} 
            ${toAnchor((l as Division).teacher, 'n')}<br>`;
    } else if (isTeacher(lesson)) {
        lessonContent = (l) =>
            `${toAnchor((l as Teacher).division, 'o')} 
            ${l.group ? `-${l.group}` : ""} 
            ${toSpan(l.subject, 'p')} 
            ${toAnchor((l as Teacher).room, 's')}<br>`;
    } else {
        lessonContent = (l) => 
            `${toAnchor((l as Room).division, 'o')} 
            ${l.group ? `-${l.group}` : ""} 
            ${toSpan(l.subject, 'p')} 
            ${toAnchor((l as Room).teacher, 'n')}<br>`;
    } 

    for (lesson of schedule) {
        tBody.rows[lesson.interval_id].cells[lesson.day + 2].innerHTML += lessonContent(lesson);
    }
}