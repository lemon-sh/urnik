(async () => {
    const timetable = await createTimetable(new URL("urnik-demoralizer/output.json", location.origin));
    const table = createTable();

    const onHashChangeEvent = () => {
        const hash = location.hash.split('/').filter(i => i); // <= this removes empty strings do not remove it istg
        console.log(hash);
        if (hash.length === 2) {
            SetPage(timetable, hash[1] as Exclude<Path, ScheduleTypeKey>);
        } else if (hash.length === 3) {
            SetPage(timetable, hash[1] as ScheduleTypeKey, hash[2], table);
        } else {
            location.hash = '/';
            return;
        }
    }

    onHashChangeEvent();
    window.addEventListener("HashChangeEvent", onHashChangeEvent);
})()