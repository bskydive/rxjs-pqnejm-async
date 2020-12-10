/* eslint-disable no-console */

// const source = of('World').pipe(map((x) => `Hello ${x}!`));

// source.subscribe(console.log);


/**
 * provide system timestamp for browser and node
 */
function getMsec() {
	if (typeof window !== 'undefined') {
		//browser
		return window['performance'].now();
	}
	if (typeof process !== 'undefined') {
		//node
		return global['process'].hrtime()[0];
	}
}

function sumLoop(index: number, count: number): number {
	let start = getMsec();
	let stop = getMsec();
	let result = 0;

	if (isLogStart) {
		console.log(`syncTaskLoopStart\tSTART\t№${index},\tstart:${start}`);
	}

	for (let i = 0; i < count; i++) {
		result++;
	}

	stop = getMsec();
	console.log(`syncTaskLoopStart\tSTOP\t№${index},\tstop:${stop},\tduration: ${(stop - start) / 1000}`);

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
		console.log(`createPromise\tSTOP\t№${index},\tstop:${stop},\tduration: ${(stop - start) / 1000}`);
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
		console.log(`resolvePromise\tSTOP\t№${index},\tstop:${stop},\tduration: ${(stop - start) / 1000}`);
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
				`resolvePromise\tSTOP\t№${index},\tstop:${stop},\tduration: ${(stop - start) / 1000}`
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
		console.log(`asyncTimeout\tSTOP\t№${index},\tstop:${stop},\tduration: ${(stop - start) / 1000}`);
	}, delay);
}

function syncTask(index: number) {
	let start = getMsec();
	let stop = getMsec();

	if (isLogStart) {
		console.log(`syncTaskStart\tSTART\t№${index},\tstart:${start}`);
	}

	// console.log(`syncTaskStart\tSTOP\t№${index},\tstop:${stop},\tduration: ${(stop - start) / 1000}`);
}

let isLogStart = true;
let taskQueue: Function[];
let ps: Promise<any>;

//=========================================================================================
//=========================================================================================
//=========================================================================================

/* 
console.log(1),
	console.log(1),
	const promise = new Promise(resolve => {​​​​​​​​ resolve() }​​​​​​​​),
	promise.then(() => {​​​​​​​​ setTimeout(() => {​​​​​​​​ console.log(2); }​​​​​​​​) }​​​​​​​​),
	setTimeout(() => {​​​​​​​​ console.log(3); }​​​​​​​​, 500),
	setImmediate(() => {​​​​​​​​ console.log(4); }​​​​​​​​),
	setTimeout(() => {​​​​​​​​ console.log(5); }​​​​​​​​, 0),
	promise.then(() => {​​​​​​​​ console.log(6); }​​​​​​​​),
	console.log(7),
*/

syncTask(0);
ps = createPromise$(1);
resolvePromiseTimeout$(2, ps, 0);
resolvePromiseTimeout$(3, ps, 500);
asyncTimeout$(4, 500);
asyncTimeout$(5, 0);
resolvePromise$(6, ps);
syncTask(7);
