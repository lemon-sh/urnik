import { resetHash, SetPage } from "./page";
import { createTimetable } from "./timetable";
import { isToolPath, isSchedulePath } from "./types";
import './style.scss';

(async () => {
    const timetable = await createTimetable(new URL("./urnik.json", location.origin + location.pathname));

    window.addEventListener("hashchange", () => {
        const hash = location.hash.split('/')
            .map(i => decodeURIComponent(i));

        if (hash.length === 1) {
            resetHash();
            return;
        }

        if (hash.length === 2 && isToolPath(hash[1])) {
            SetPage(timetable, hash[1]);
        } else if ((hash.length === 3 || hash.length === 2) && isSchedulePath(hash[1])) {
            SetPage(timetable, hash[1], hash[2]);
        } else {
            resetHash(location.hash + " doesn't exist");
        }
    });

    window.dispatchEvent(new HashChangeEvent("hashchange"));
})()