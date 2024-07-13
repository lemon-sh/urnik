async function createTimetable(input?: URL | Timetable): Promise<Timetable> {
    const timetable: Timetable = {
        intervals: [],
        schedules: { divisions: {}, teachers: {}, rooms: {} }
    };

    if (!input) return timetable;

    if (!(input instanceof URL)) {
        timetable.intervals = input.intervals;
        timetable.schedules = input.schedules;
        return timetable;
    }

    const res = await fetch(input);
    const json = await res.json();

    timetable.intervals = json.intervals;
    timetable.schedules.divisions = json.schedules;

    for (const division in timetable.schedules.divisions) {
        for (const lesson of timetable.schedules.divisions[division]) {
            timetable.schedules.teachers[lesson.teacher] ??= [];
            timetable.schedules.teachers[lesson.teacher].push({
                "interval_id": lesson.interval_id,
                "day": lesson.day,
                "subject": lesson.subject,
                "group": lesson.group,
                "room": lesson.room,
                "division": division,
            });

            timetable.schedules.rooms[lesson.room] ??= [];
            timetable.schedules.rooms[lesson.room].push({
                "interval_id": lesson.interval_id,
                "day": lesson.day,
                "subject": lesson.subject,
                "group": lesson.group,
                "teacher": lesson.teacher,
                "division": division,
            });
        }
    }

    const sortTime = <T extends ILesson>(a: T, b: T) => a.interval_id - b.interval_id || a.day - b.day;
    for (const teacher in timetable.schedules.teachers) {
        timetable.schedules.teachers[teacher].sort(sortTime)
    }

    for (const room in timetable.schedules.rooms) {
        timetable.schedules.rooms[room].sort(sortTime)
    }

    return timetable;
}

function getSchedule(timetable: Timetable, scheduleTypeKey: ScheduleTypeKey, scheduleId: string): Schedule {
    const scheduleType = ScheduleType[scheduleTypeKey] as keyof typeof timetable.schedules;
    const schedule = timetable.schedules[scheduleType][scheduleId]
    if (schedule) {
        return schedule;
    }

    throw new Error(`ScheduleId ${scheduleId} is incorrect`);
}