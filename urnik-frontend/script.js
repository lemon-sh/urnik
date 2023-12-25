let intervals, schedules, numberOffset = 0;
console.time("fetch");
fetch("/urnik-demoralizer/output.json")
    .then(response => response.json())
    .then(json => {
        intervals = json.intervals;        
        schedules = json.schedules;

        if (!intervals[0]) {
            numberOffset = 1;
            intervals.shift();
        }

        schedules = { "grades": schedules }
        schedules.teachers = {}
        schedules.rooms = {}
        
        for (grade in schedules.grades) {
            for (data of schedules.grades[grade]) {
                schedules.teachers[data.teacher] ??= [];
                schedules.teachers[data.teacher].push({
                    "interval_id": data.interval_id,
                    "day": data.day,
                    "subject": data.subject,
                    "grade": grade,
                    "group": data.group,
                    "room": data.room
                });
                
                schedules.rooms[data.room] ??= [];
                schedules.rooms[data.room].push({
                    "interval_id": data.interval_id,
                    "day": data.day,
                    "subject": data.subject,
                    "grade": grade,
                    "group": data.group,
                    "teacher": data.teacher
                });
            }
        }

        let sortNames = (obj, sort) => Object.keys(obj).sort(sort).reduce(
            (r, k) => (r[k] = obj[k], r), {}
        );
        schedules.teachers = sortNames(schedules.teachers, (a, b) => a.localeCompare(b, "pl"));
        schedules.rooms = sortNames(schedules.rooms);

        let sortTime = (a, b) => a.interval_id - b.interval_id || a.day - b.day;
        for (teacher in schedules.teachers) {
            schedules.teachers[teacher].sort(sortTime)
        }

        for (room in schedules.rooms) {
            schedules.rooms[room].sort(sortTime)
        }

        let page = new URL(location).searchParams.get("p");
        if (page) {
            insertTable(page);
        }
        
        console.timeEnd("fetch");
    })
    .catch(console.error);


history.replaceState({page: new URL(location).searchParams.get("p")}, "")
addEventListener("popstate", (e) => {
    insertTable(e.state.page);
});

let anchors = document.getElementsByTagName("a");
for (anchor of anchors) {
    convertAnchor(anchor);
}

function convertAnchor(anchor) {
    let page = new URL(anchor.href).searchParams.get('p');
    if (!page) return;

    anchor.addEventListener("click", (e) => {
        e.preventDefault();

        history.pushState({page: page}, "", `?p=${encodeURIComponent(page)}`);
        insertTable(page);
    });
}

let tableHeaders = ["Nr", "Godz", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"];
let table = document.createElement("table");
let THead = table.createTHead();
for (header of tableHeaders) {
    let th = document.createElement("th");
    th.textContent = header;
    THead.appendChild(th);
}
let TBody = table.createTBody();

function insertTable(page) {
    if (!page) {
        table.remove();
        return;
    }

    let {lessons, scheduleType} = pageSearch(page);
    if (!lessons) {
        table.remove()
        return;
    };

    TBody.innerHTML = "";
    for (let i = 0; i <= lessons[lessons.length - 1].interval_id; i++) {
        let newRow = TBody.insertRow();
        
        let th = document.createElement("th");
        newRow.appendChild(th.cloneNode());
        newRow.appendChild(th);

        for (let i = 0; i < tableHeaders.length - 2; i++) {
            newRow.insertCell();
        }

        newRow.cells[0].textContent = i + numberOffset;
        newRow.cells[1].textContent = `${intervals[i][0]} - ${intervals[i][1]}`;
    }

    let lessonContent;
    let toSpan = (el, className) => `<span class="${className}">${el}</span>`;
    let toAnchor = (el, className) => `<a href="?p=${encodeURIComponent(el)}" class="${className}">${el}</a>`;
    switch (scheduleType) {
        case "grades":
            lessonContent = (l) => 
                `${toSpan(l.subject, 'p')}${l.group ? `-${l.group}` : ""} ${toAnchor(l.room, 's')} ${toAnchor(l.teacher, 'n')}<br>`;
            break;
        case "teachers":
            lessonContent = (l) => 
                `${toAnchor(l.grade, 'o')}${l.group ? `-${l.group}` : ""} ${toSpan(l.subject, 'p')} ${toAnchor(l.room, 's')}<br>`;
            break;
        case "rooms":
            lessonContent = (l) => 
                `${toAnchor(l.grade, 'o')}${l.group ? `-${l.group}` : ""} ${toSpan(l.subject, 'p')} ${toAnchor(l.teacher, 's')}<br>`;
            break;
        default:
            console.error("???")
    }

    for (lesson of lessons) {
        TBody.rows[lesson.interval_id].cells[lesson.day + 2].innerHTML += lessonContent(lesson);
    }

    let tableAnchors = table.getElementsByTagName("a");
    for (anchor of tableAnchors) {
        convertAnchor(anchor);
    }
    
    document.body.appendChild(table);
}

function pageSearch(page) {
    for (scheduleType in schedules) {
        if (schedules[scheduleType][page] === undefined) continue;

        return { lessons: schedules[scheduleType][page], scheduleType } ; 
    }

    console.error(`Page "${page}" not found`);
    return { undefined, undefined }
}