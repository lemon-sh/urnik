pub fn between<'a>(input: &'a str, begin: &str, end: &str) -> Vec<&'a str> {
	let mut matches = Vec::new();
	let mut pos = 0;
	while let Some(mut begin_pos) = input[pos..].find(begin) {
		begin_pos += pos + begin.len();
		let Some(mut end_pos) = input[begin_pos..].find(end) else {
			matches.push(&input[begin_pos..]);
			return matches;
		};
		end_pos += begin_pos;
		matches.push(&input[begin_pos..end_pos]);
		pos = end_pos + end.len();
	}
	matches
}

pub fn between_once<'a>(input: &'a str, begin: &str, end: &str) -> Option<&'a str> {
	let begin_pos = input.find(begin)? + begin.len();
	if let Some(end_pos) = input[begin_pos..].find(end) {
		Some(&input[begin_pos..end_pos + begin_pos])
	} else {
		Some(&input[begin_pos..])
	}
}
