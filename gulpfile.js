import gulp from 'gulp';
import mocha from './index.js';

export default function main() {
	return gulp.src('test/fixtures/fixture-pass.js', {read: false})
		.pipe(mocha());
}

