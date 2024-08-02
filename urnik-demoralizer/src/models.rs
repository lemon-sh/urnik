use std::collections::HashMap;

use serde::{
	ser::SerializeSeq,
	Serialize,
};

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

pub struct IntervalSet(Vec<Option<(String, String)>>);

#[derive(Serialize)]
struct Interval<'a> {
	id: usize,
	begin: &'a str,
	end: &'a str,
}

impl Serialize for IntervalSet {
	fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
	where
		S: serde::Serializer,
	{
		let mut seq = serializer.serialize_seq(None)?;
		let intervals_iter = self.0.iter().enumerate().filter_map(|(id, interval)| {
			interval
				.as_ref()
				.map(|(begin, end)| Interval { id, begin, end })
		});
		for interval in intervals_iter {
			seq.serialize_element(&interval)?;
		}
		seq.end()
	}
}

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
}
