use std::collections::HashMap;

use serde::Serialize;

#[derive(Serialize)]
pub struct ScheduleSet {
	pub intervals: IntervalSet,
	pub schedules: HashMap<String, Vec<Lesson>>,
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

	pub fn insert(&mut self, id: usize, range: (String, String)) {
		if id >= self.0.len() {
			self.0.resize(id + 1, None);
		}
		self.0[id] = Some(range);
	}
}
