use std::collections::HashMap;

use serde::Serialize;

#[derive(Serialize)]
pub struct ScheduleSet<'a> {
	intervals: &'a [Option<(String, String)>],
	schedules: HashMap<String, Vec<Lesson>>,
}

#[derive(Serialize, Default)]
pub struct Lesson {
	pub interval_id: usize,
	pub day: usize,
	pub subject: String,
	#[serde(skip_serializing_if = "Option::is_none")]
	pub group: Option<String>,
	#[serde(skip_serializing_if = "Option::is_none")]
	pub teacher: Option<String>,
	#[serde(skip_serializing_if = "Option::is_none")]
	pub room: Option<String>,
}

#[derive(Serialize)]
pub struct IntervalSet(Vec<Option<(String, String)>>);

impl IntervalSet {
	pub fn new() -> Self {
		Self(Vec::new())
	}

	pub fn contains(&self, id: usize) -> bool {
		matches!(self.0.get(id), Some(Some(_)))
	}

	pub fn insert(&mut self, id: usize, time_range: (String, String)) {
		if id >= self.0.len() {
			self.0.resize(id + 1, None);
		}
		self.0[id] = Some(time_range);
	}

	/// Gets the smallest interval ID
	fn min(&self) -> usize {
		let mut min = 0;
		for interval in &self.0 {
			if interval.is_some() {
				break;
			}
			min += 1
		}
		min
	}
}

impl<'a> ScheduleSet<'a> {
	/// Creates a new ScheduleSet
	///
	/// `normalize` - normalize intervals (i.e. always starting from 0)
	pub fn new_normalized(
		intervals: &'a IntervalSet,
		mut schedules: HashMap<String, Vec<Lesson>>,
		normalize: bool,
	) -> Self {
		if normalize {
			let interval_offset = intervals.min();
			for lesson in schedules.values_mut().flatten() {
				lesson.interval_id -= interval_offset;
			}
			Self {
				intervals: &intervals.0[interval_offset..],
				schedules,
			}
		} else {
			Self {
				intervals: &intervals.0,
				schedules,
			}
		}
	}
}
