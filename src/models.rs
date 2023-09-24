use std::collections::HashMap;

use serde::Serialize;

#[derive(Serialize)]
pub struct ScheduleSet {
	pub intervals: Vec<(String, String)>,
	pub divisions: HashMap<String, Vec<Class>>,
	pub rooms: HashMap<String, Vec<Class>>,
	pub teachers: HashMap<String, Vec<Class>>,
}

#[derive(Serialize)]
pub struct Class {
	pub interval_id: usize,
	pub day: usize,
	pub subject: Option<String>,
	#[serde(skip_serializing_if = "Option::is_none")]
	pub division: Option<String>,
	#[serde(skip_serializing_if = "Option::is_none")]
	pub group: Option<String>,
	#[serde(skip_serializing_if = "Option::is_none")]
	pub teacher: Option<String>,
	#[serde(skip_serializing_if = "Option::is_none")]
	pub room: Option<String>,
}
