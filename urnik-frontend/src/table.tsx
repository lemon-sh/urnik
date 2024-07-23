import { Schedule, Interval, Lesson, isDivision, Division, isTeacher, Teacher, Room, ScheduleTypeKey, JSXElement } from "./types";

const tableHeaders = ["Nr", "Godz", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"] as const;

export function Table(schedule: Schedule, intervals: Interval[]) {
    return (
        <table>
            <thead>
                {tableHeaders.map(tableHeader =>
                    <th scope="col">{tableHeader}</th>
                )}
            </thead>
            <tbody>
                {createTableBody(schedule, intervals)}
            </tbody>
        </table>
    );
}

function createTableBody(schedule: Schedule, intervals: Interval[]) {
    let lessonContent: (lesson: Lesson) => JSXElement;
    const Anchor = (props: { type: ScheduleTypeKey, children: string }) =>
        <a href={`#/${props.type}/${encodeURIComponent(props.children)}`} class={props.type}>{props.children}</a>;

    const lesson = schedule[0]
    if (isDivision(lesson)) {
        lessonContent = (l) => <>
            <span class='p'>{l.subject}</span>
            {l.group ? `-${l.group}` : ""}
            <Anchor type='s'>{(l as Division).room}</Anchor>
            <Anchor type='n'>{(l as Division).teacher}</Anchor><br />
        </>;
    } else if (isTeacher(lesson)) {
        lessonContent = (l) => <>
            <Anchor type='o'>{(l as Teacher).division}</Anchor>
            {l.group ? `-${l.group}` : ""}
            <span class='p'>{l.subject}</span>
            <Anchor type='s'>{(l as Teacher).room}</Anchor><br />
        </>;
    } else {
        lessonContent = (l) => <>
            <Anchor type='o'>{(l as Room).division}</Anchor>
            {l.group ? `-${l.group}` : ""}
            <span class='p'>{l.subject}</span>
            <Anchor type='n'>{(l as Room).teacher}</Anchor><br />
        </>;
    }

    const maxIntervalId = schedule[schedule.length - 1].interval_id;
    const timetable: JSXElement[][] = Array.from(Array(maxIntervalId + 1), () => Array(5));

    for (const lesson of schedule) {
        timetable[lesson.interval_id][lesson.day] = lessonContent(lesson)
    }

    return timetable.map((timetableRow, i) => 
        <tr>
            <th scope="row">{i + 1}</th>
            <th scope="row">{intervals[i][0]} - {intervals[i][0]}</th>

            {timetableRow.map(lesson => 
                <td>{lesson}</td>
            )}
        </tr>
    );
}