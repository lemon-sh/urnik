use std::{collections::HashMap, fs::File, io::BufWriter};

use color_eyre::eyre::bail;
use config::Config;
use models::{Lesson, ScheduleSet};
use schedule_fetch::ScheduleFetch;

use crate::models::IntervalSet;

mod config;
mod models;
mod schedule_fetch;
mod textutils;

fn main() -> color_eyre::Result<()> {
	color_eyre::install()?;

	let cfg = Config::cli();

	let mut schedule_fetch = ScheduleFetch::new(cfg.url);

	let mut intervals = IntervalSet::new();
	let mut schedules: HashMap<String, Vec<Lesson>> = HashMap::new();

	eprint!("Demoralizing... *");

	while let Some(schedule) = schedule_fetch.next()? {
		let Some(division) = textutils::between_once(&schedule, "\"tytulnapis\">", "</span>")
		else {
			bail!("Couldn't find the division name");
		};
		let division = division.strip_suffix('.').unwrap_or(division);
		eprint!("{division} ");
		let rows = textutils::between(&schedule, "<tr>", "</tr>");
		let Some(class_rows) = rows.get(2..rows.len() - 3) else {
			bail!("Couldn't extract class rows from the timetable");
		};
		let schedule_entry = schedules.entry(division.to_string()).or_default();
		for row in class_rows {
			let Some(interval_id) = textutils::between_once(row, "\"nr\">", "</td>") else {
				bail!("Couldn't extract the interval number from the timetable");
			};
			let Ok(interval_id) = interval_id.parse::<usize>() else {
				bail!("Invalid interval number: {interval_id}");
			};

			if !intervals.contains(interval_id) {
				let Some(interval) = textutils::between_once(row, "\"g\">", "</td>") else {
					bail!("Couldn't extract the interval from the timetable");
				};
				let Some((interval_start, interval_end)) = interval.split_once('-') else {
					bail!("Invalid interval format: {interval}");
				};
				intervals.insert(
					interval_id,
					(interval_start.trim().into(), interval_end.trim().into()),
				);
			}

			for (day, hour) in textutils::between(row, "\"l\">", "</td>")
				.into_iter()
				.enumerate()
			{
				if hour.trim() == "&nbsp;" {
					continue;
				}
				for class in hour.split("<br>") {
					let mut p_spans = textutils::between(class, "\"p\">", "</span>").into_iter();
					let Some(subject) = p_spans.next() else {
						schedule_entry.push(Lesson {
							interval_id,
							day,
							subject: class.into(),
							..Default::default()
						});
						continue;
					};

					let (subject, group_from_subject) =
						if let Some((subject, group)) = subject.split_once('-') {
							(subject, Some(group))
						} else {
							(subject, None)
						};

					let teacher = if let Some(teacher_alt) = p_spans.next() {
						teacher_alt
					} else if let Some(teacher) = textutils::between_once(class, "\"n\">", "</") {
						teacher
					} else {
						bail!("Couldn't extract the teacher from the timetable");
					};

					let Some(room) = textutils::between_once(class, "\"s\">", "</") else {
						bail!("Couldn't extract the room from the timetable");
					};

					let group = if let Some(group_from_subject) = group_from_subject {
						Some(group_from_subject.to_string())
					} else {
						textutils::between_once(class, "</span>-", " ").map(ToString::to_string)
					};

					schedule_entry.push(Lesson {
						interval_id,
						day,
						subject: subject.into(),
						teacher: Some(teacher.into()),
						room: Some(room.into()),
						group,
					});
				}
			}
		}
		eprint!("*");
	}
	eprintln!(".\nSerializing...");

	let schedule_set = ScheduleSet {
		intervals,
		schedules,
	};

	serde_json::to_writer(BufWriter::new(File::create(cfg.output)?), &schedule_set)?;
	eprintln!("Done.");
	Ok(())
}
