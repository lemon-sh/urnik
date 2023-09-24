use serde::Deserialize;

#[derive(Deserialize)]
pub struct Profile {
	pub url: String,
	pub output: String,
}
