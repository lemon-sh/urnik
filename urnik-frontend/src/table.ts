const tableHeaders = ["Nr", "Godz", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"] as const;

function createTable() {
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

function modifyTable(table: HTMLTableElement, schedule: Schedule, intervals: Interval[]): void {
    let tBody = table.tBodies[0];
    tBody.innerHTML = '';

    for (let i = 0; i <= schedule[schedule.length - 1].interval_id + 1; i++) {
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
    const toSpan = (str: string, className: string) => `<span class="${className}">${str}</span>`;
    const toAnchor = (type: string, str: string, className: string) => `<a href="#/${type}/${encodeURIComponent(str)} class="${className}">${str}</a>`;

    let lesson = schedule[0]
    if (isDivision(lesson)) {
        lessonContent = (l) => 
            `${toSpan(l.subject, 'p')} 
            ${l.group ? `-${l.group}` : ""} 
            ${toAnchor('o', (l as Division).room, 's')} 
            ${toAnchor('o', (l as Division).teacher, 'n')}`;
    } else if (isTeacher(lesson)) {
        lessonContent = (l) => 
            `${toAnchor('n', (l as Teacher).division, 'o')} 
            ${l.group ? `-${l.group}` : ""} 
            ${toSpan(l.subject, 'p')} 
            ${toAnchor('n', (l as Teacher).room, 's')}`;
    } else {
        lessonContent = (l) => 
            `${toAnchor('s', (l as Room).division, 'o')}
            ${l.group ? `-${l.group}` : ""} 
            ${toSpan(l.subject, 'p')} 
            ${toAnchor('s', (l as Room).teacher, 's')}`;
    } 

    for (lesson of schedule) {
        tBody.rows[lesson.interval_id].cells[lesson.day + 2].innerHTML += lessonContent(lesson);
    }
}