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

/*
// firefox 

// node
sumLoopStart    START   №1,     start:22692215835052
sumLoopStart    STOP    №1,     stop:22699270876360,    duration: 7
createPromise   START   №2,     start:22699271186610
createPromise   STOP    №2,     stop:22699271237520,    duration: 0
resolvePromise  START   №3,     start:22699271284580,   delay:0
resolvePromise  START   №4,     start:22699271305930,   delay:100
asyncTimeout    START   №5,     start:22699271347840,   delay: 100
asyncTimeout    START   №6,     start:22699271671910,   delay: 0
resolvePromise  START   №7,     start:22699271776930
syncTaskStart   START   №8,     start:22699271814390
resolvePromise  STOP    №7,     stop:22699272133760,    duration: 0
asyncTimeout    STOP    №6,     stop:22699272371900,    duration: 0,    delay: 0
resolvePromise  STOP    №3,     stop:22699273545120,    duration: 0,    delay:0
asyncTimeout    STOP    №5,     stop:22699371773869,    duration: 0,    delay: 100
resolvePromise  STOP    №4,     stop:22699372988809,    duration: 0,    delay:100
*/


/*
let p;
p = new Promise((resolve) => {resolve(null);}).then(() => {setTimeout(() => {console.log(2)}, 0);}).then(() => {setTimeout(() => {console.log(3)}, 0);});
p = new Promise((resolve) => {resolve(null);}).then(() => {setTimeout(() => {console.log(4)}, 0);});
p = setTimeout(() => {console.log(5)}, 0);

output:
5
2
4
3

queue:
p = new Promise((resolve) => {resolve();})
p = new Promise((resolve) => {resolve();})
p = setTimeout(() => {console.log(5)}, 0);
.then(() => {setTimeout(() => {console.log(2)}, 0);})
.then(() => {setTimeout(() => {console.log(4)}, 0);});
.then(() => {setTimeout(() => {console.log(3)}, 0);});

*/
