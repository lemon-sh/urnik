use std::{env, process};

pub struct Config {
	pub url: String,
	pub output: String,
	pub normalize_intervals: bool,
}

impl Config {
	pub fn from_cli() -> Self {
		let mut args = env::args();
		args.next().expect("expected at least one argument");

		let (mut url, mut output) = (None, None);
		let mut normalize_intervals = true;

		for arg in args {
			if let Some(flag) = arg.strip_prefix('-') {
				match flag {
					"d" => normalize_intervals = false,
					_ => {
						println!("Unknown flag '{arg}'\n{}", include_str!("usage.in"));
						process::exit(3);
					}
				}
				continue;
			}
			if url.is_none() {
				url = Some(arg)
			} else if output.is_none() {
				output = Some(arg)
			} else {
				println!("Invalid usage.\n{}", include_str!("usage.in"));
				process::exit(2);
			}
		}

		let (Some(url), Some(output)) = (url, output) else {
			println!("{}", include_str!("usage.in"));
			process::exit(1);
		};

		Self {
			url,
			output,
			normalize_intervals,
		}
	}
}
