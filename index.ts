/* eslint-disable no-console */

// const source = of('World').pipe(map((x) => `Hello ${x}!`));

// source.subscribe(console.log);

/**
 * provide system timestamp for browser(msec) and node(nanosec)
 */
function getMsec(): bigint {
	if (typeof window !== 'undefined') {
		//browser
		return BigInt(window['performance'].now());
	}
	if (typeof process !== 'undefined') {
		//node nanoseconds
		return global['process'].hrtime.bigint();
	}
}

/**
 * provide system timestamp difference for browser(msec) and node(nanosec)
 */
function getSecDiff(start: bigint, stop: bigint): bigint {
	if (typeof window !== 'undefined') {
		//browser
		return (stop - start) / 1000n;
	}
	if (typeof process !== 'undefined') {
		//node nanoseconds
		return (stop - start) / 1000000000n;
	}
}

function sumLoop(index: number, count: number): number {
	let start = getMsec();
	let stop = getMsec();
	let result = 0;

	if (isLogStart) {
		console.log(`sumLoopStart\tSTART\t№${index},\tstart:${start}`);
	}

	for (let i = 0; i < count; i++) {
		result++;
	}

	stop = getMsec();
	console.log(
		`sumLoopStart\tSTOP\t№${index},\tstop:${stop},\tduration: ${getSecDiff(start, stop)}`
	);

	return result;
}

function createPromise$(index: number): Promise<any> {
	let start = getMsec();
	let stop = getMsec();
	let result = null;

	if (isLogStart) {
		console.log(`createPromise\tSTART\t№${index},\tstart:${start}`);
	}

	result = new Promise((resolve, reject) => {
		stop = getMsec();
		console.log(
			`createPromise\tSTOP\t№${index},\tstop:${stop},\tduration: ${getSecDiff(start, stop)}`
		);
		resolve(true);
	});

	return result;
}

function resolvePromise$(index: number, promise: Promise<any>) {
	let start = getMsec();
	let stop = getMsec();

	if (isLogStart) {
		console.log(`resolvePromise\tSTART\t№${index},\tstart:${start}`);
	}

	promise.then(() => {
		stop = getMsec();
		console.log(
			`resolvePromise\tSTOP\t№${index},\tstop:${stop},\tduration: ${getSecDiff(start, stop)}`
		);
	});
}

function resolvePromiseTimeout$(index: number, promise: Promise<any>, delay: number) {
	let start = getMsec();
	let stop = getMsec();

	if (isLogStart) {
		console.log(`resolvePromise\tSTART\t№${index},\tstart:${start},\tdelay:${delay}`);
	}

	promise.then(() => {
		setTimeout(() => {
			stop = getMsec();
			console.log(
				`resolvePromise\tSTOP\t№${index},\tstop:${stop},\tduration: ${getSecDiff(
					start,
					stop
				)},\tdelay:${delay}`
			);
		}, delay);
	});
}

function asyncTimeout$(index: number, delay: number): unknown {
	let start = getMsec();
	let stop = getMsec();

	if (isLogStart) {
		console.log(`asyncTimeout\tSTART\t№${index},\tstart:${start},\tdelay: ${delay}`);
	}

	return setTimeout(() => {
		stop = getMsec();
		console.log(
			`asyncTimeout\tSTOP\t№${index},\tstop:${stop},\tduration: ${getSecDiff(
				start,
				stop
			)},\tdelay: ${delay}`
		);
	}, delay);
}

function syncTask(index: number) {
	let start = getMsec();
	let stop = getMsec();

	console.log(`syncTaskStart\tSTART\t№${index},\tstart:${start}`);
	// console.log(`syncTaskStart\tSTOP\t№${index},\tstop:${stop},\tduration: ${getSecDiff(start,stop)}`);
}

let isLogStart = true;
let taskQueue: Function[];
let ps: Promise<any>;

//=========================================================================================
//=========================================================================================
//=========================================================================================

/* 
	console.log(1),
	const promise = new Promise(resolve => {​​​​​​​​ resolve() }​​​​​​​​),
	promise.then(() => {​​​​​​​​ setTimeout(() => {​​​​​​​​ console.log(2); }​​​​​​​​) }​​​​​​​​),
	setTimeout(() => {​​​​​​​​ console.log(3); }​​​​​​​​, 500),
	setImmediate(() => {​​​​​​​​ console.log(4); }​​​​​​​​),
	setTimeout(() => {​​​​​​​​ console.log(5); }​​​​​​​​, 0),
	promise.then(() => {​​​​​​​​ console.log(6); }​​​​​​​​),
	console.log(7),
*/

sumLoop(1, 10000000000);
ps = createPromise$(2);
resolvePromiseTimeout$(3, ps, 0);
resolvePromiseTimeout$(4, ps, 100);
asyncTimeout$(5, 100);
asyncTimeout$(6, 0);
resolvePromise$(7, ps);
syncTask(8);
