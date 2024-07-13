class Timetable {
    intervals: Interval[];
    schedules: {
        grades: { [grade: string]: Grade[] },
        teachers: { [teacher: string]: Teacher[] },
        rooms: { [room: string]: Room[] },
    }

    constructor(url?: URL) {
        this.intervals = [];
        this.schedules = { grades: {}, teachers: {}, rooms: {} };

        if (url) {
            this.setFrom(url);
        }
    }

    async setFrom(source: URL | Timetable) {
        if (source instanceof Timetable) {
            this.intervals = source.intervals;
            this.schedules = source.schedules;
            return;
        }

        const res = await fetch(source);
        const json = await res.json();

        this.intervals = json.intervals;
        this.schedules.grades = json.schedules;

        for (const grade in this.schedules.grades) {
            for (const lesson of this.schedules.grades[grade]) {
                this.schedules.teachers[lesson.teacher] ??= [];
                this.schedules.teachers[lesson.teacher].push({
                    "interval_id": lesson.interval_id,
                    "day": lesson.day,
                    "subject": lesson.subject,
                    "group": lesson.group,
                    "room": lesson.room,
                    "grade": grade,
                });

                this.schedules.rooms[lesson.room] ??= [];
                this.schedules.rooms[lesson.room].push({
                    "interval_id": lesson.interval_id,
                    "day": lesson.day,
                    "subject": lesson.subject,
                    "group": lesson.group,
                    "teacher": lesson.teacher,
                    "grade": grade,
                });
            }
        }
        
        const sortTime = <T extends Schedule>(a: T, b: T) => a.interval_id - b.interval_id || a.day - b.day;
        for (const teacher in this.schedules.teachers) {
            this.schedules.teachers[teacher].sort(sortTime)
        }

        for (const room in this.schedules.rooms) {
            this.schedules.rooms[room].sort(sortTime)
        } 
    }
}