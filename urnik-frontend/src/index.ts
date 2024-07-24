import { resetHash, SetPage } from "./page";
import { createTimetable } from "./timetable";
import { isToolPath, isScheduleTypeKey } from "./types";
import './style.scss';

(async() => {
    const timetable = await createTimetable(new URL("./urnik.json", location.origin + location.pathname));

    const onHashChangeEvent = () => {
        const hash = location.hash.split('/')
            .filter(i => i) // <= removes empty strings
            .map(i => decodeURIComponent(i)); 

        if (hash.length === 2 && isToolPath(hash[1])) {
            SetPage(timetable, hash[1]);
        } else if (hash.length === 3 && isScheduleTypeKey(hash[1])) {
            SetPage(timetable, hash[1], hash[2]);
        } else {
            resetHash();
        }
    }

    onHashChangeEvent();
    window.addEventListener("hashchange", onHashChangeEvent);
})()