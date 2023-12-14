use std::collections::HashMap;

use serde::Serialize;

#[derive(Serialize)]
pub struct ScheduleSet {
	pub intervals: Vec<(String, String)>,
	pub schedules: HashMap<String, Vec<Lesson>>,
}

#[derive(Serialize)]
pub struct Lesson {
	pub interval_id: usize,
	pub day: usize,
	pub subject: String,
	pub group: Option<String>,
	pub teacher: String,
	pub room: String,
}
