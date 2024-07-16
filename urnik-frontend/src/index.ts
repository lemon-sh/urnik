import { resetHash, SetPage } from "./page";
import { createTable } from "./table";
import { createTimetable } from "./timetable";
import { isToolPath, isScheduleTypeKey } from "./types";
import './style.scss';

(async () => {
    const timetable = await createTimetable(new URL("./urnik.json", location.origin + location.pathname));
    const table = createTable();

    const onHashChangeEvent = () => {
        const hash = location.hash.split('/').filter(i => i).map(i => decodeURIComponent(i)); // <= this filter removes empty strings do not remove it istg

        if (hash.length === 2 && isToolPath(hash[1])) {
            SetPage(timetable, hash[1]);
        } else if (hash.length === 3 && isScheduleTypeKey(hash[1])) {
            SetPage(timetable, hash[1], hash[2], table);
        } else {
            resetHash();
        }
    }

    onHashChangeEvent();
    window.addEventListener("hashchange", onHashChangeEvent);
})()
