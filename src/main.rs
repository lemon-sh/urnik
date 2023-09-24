use std::{
	collections::HashMap,
	env,
	fs::File,
	io::{BufWriter, Read},
	process,
};

use color_eyre::eyre::bail;
use mimalloc::MiMalloc;
use models::{Class, ScheduleSet};
use profile::Profile;
use schedule_fetch::ScheduleFetch;

mod models;
mod profile;
mod schedule_fetch;
mod textutils;

#[global_allocator]
static GLOBAL: MiMalloc = MiMalloc;

fn main() -> color_eyre::Result<()> {
	color_eyre::install()?;

	let mut args = env::args();
	let executable_name = args.next().unwrap_or_default();

	let Some(profile_path) = args.next() else {
		eprintln!("Usage: {executable_name} <path to profile>");
		process::exit(1);
	};

	let mut profile_str = String::new();
	File::open(profile_path)?.read_to_string(&mut profile_str)?;
	let profile: Profile = toml::from_str(&profile_str)?;

	let mut schedule_fetch = ScheduleFetch::new(profile.url);

	let mut intervals: Vec<(String, String)> = Vec::new();
	let mut divisions: HashMap<String, Vec<Class>> = HashMap::new();
	let mut rooms: HashMap<String, Vec<Class>> = HashMap::new();
	let mut teachers: HashMap<String, Vec<Class>> = HashMap::new();

	while let Some(schedule) = schedule_fetch.next()? {
		let Some(division) = textutils::between_once(&schedule, "\"tytulnapis\">", "</span>")
		else {
			bail!("Couldn't find the division name");
		};
		let division = division.strip_suffix('.').unwrap_or(division);
		eprintln!("{division}");
		let rows = textutils::between(&schedule, "<tr>", "</tr>");
		let Some(class_rows) = rows.get(2..rows.len() - 3) else {
			bail!("Couldn't extract class rows from the timetable");
		};
		let schedule_entry = divisions.entry(division.to_string()).or_default();
		for row in class_rows {
			let Some(interval_number) = textutils::between_once(row, "\"nr\">", "</td>") else {
				bail!("Couldn't extract the interval number from the timetable");
			};
			let Ok(interval_number) = interval_number.parse::<usize>() else {
				bail!("Invalid interval number: {interval_number}");
			};
			if interval_number == 0 {
				bail!("Invalid interval number: {interval_number}");
			}
			let interval_id = interval_number - 1;
			if interval_id == intervals.len() {
				let Some(interval) = textutils::between_once(row, "\"g\">", "</td>") else {
					bail!("Couldn't extract the interval from the timetable");
				};
				let Some((interval_start, interval_end)) = interval.split_once('-') else {
					bail!("Invalid interval format: {interval}");
				};
				intervals.push((interval_start.trim().into(), interval_end.trim().into()));
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
						bail!("Couldn't extract the subject from the timetable");
					};

					let (subject, group_from_subject) = if let Some((subject, group)) = subject.split_once("-") {
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
					} else if let Some(group_after_subject) = textutils::between_once(class, "</span>-", " ") {
						Some(group_after_subject.to_string())
					} else {
						None
					};

					schedule_entry.push(Class {
						interval_id, day,
						subject: Some(subject.into()),
						teacher: Some(teacher.into()),
						room: Some(room.into()),
						division: None,
						group: group.clone()
					});

					let teacher_entry = teachers.entry(teacher.into()).or_default();

					teacher_entry.push(Class {
						interval_id, day,
						subject: Some(subject.into()),
						teacher: None,
						room: Some(room.into()),
						division: Some(division.into()),
						group: group.clone()
					});

					let room_entry = rooms.entry(room.into()).or_default();

					room_entry.push(Class {
						interval_id, day,
						subject: Some(subject.into()),
						teacher: Some(teacher.into()),
						room: None,
						division: Some(division.into()),
						group: group.clone()
					});
				}
			}
		}
	}

	let schedule_set = ScheduleSet {
		intervals,
		divisions,
		rooms,
		teachers,
	};

	eprintln!("Serializing...");
	serde_json::to_writer(BufWriter::new(File::create(profile.output)?), &schedule_set)?;
	eprintln!("Done.");
	Ok(())
}
