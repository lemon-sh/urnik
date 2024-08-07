use std::fmt::Display;

use color_eyre::eyre::bail;
use ureq::Agent;

pub struct ScheduleFetch {
	prefix: String,
	pos: u32,
	http: Agent,
}

impl ScheduleFetch {
	pub fn new(url: impl Display) -> ScheduleFetch {
		ScheduleFetch {
			prefix: format!("{url}plany/o"),
			pos: 1,
			http: Agent::new(),
		}
	}

	pub fn next(&mut self) -> color_eyre::Result<Option<String>> {
		let url = format!("{}{}.html", self.prefix, self.pos);
		match self.http.get(&url).call() {
			Ok(response) => {
				let response = response.into_string()?;
				self.pos += 1;
				Ok(Some(response))
			}
			Err(ureq::Error::Status(404, _)) => Ok(None),
			Err(e) => bail!(e),
		}
	}
}
