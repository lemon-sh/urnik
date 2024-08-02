use std::{env, process};

pub struct Config {
	pub url: String,
	pub output: String,
}

impl Config {
	pub fn cli() -> Self {
		let mut args = env::args();
		let bin = args.next().expect("expected at least one argument");

		let (Some(url), Some(output)) = (args.next(), args.next()) else {
			eprintln!("Usage: {bin} <optivum url> <output json file>");
			process::exit(1);
		};

		Self {
			url,
			output,
		}
	}
}
