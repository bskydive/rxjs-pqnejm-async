import { Observable } from 'rxjs';

/* eslint-disable no-console */

// const source = of('World').pipe(map((x) => `Hello ${x}!`));

// source.subscribe(console.log);

/**
 * provide system timestamp for browser(msec) and node(nanosec)
 */
function getMsec(): bigint {
	if (typeof window !== 'undefined') {
		//browser
		return BigInt(window['performance'].now()
			.toFixed() // in chrome: Uncaught RangeError: The number 14.20999999754713 cannot be converted to a BigInt because it is not an integer
		); 
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


//=========================================================================================
//====================================== RUNNER ===========================================
//=========================================================================================

let taskQueue: Function[];
let ps: Promise<any>;

/**
 * just code
 * output
 // firefox
	1
	7
	6
	5
	2
	3
 // node
	1
	7
	6
	5
	2
	4
	3

	1
	7
	6
	4
	5
	2
	3

	1
	7
	6
	5
	4
	2
	3
	*/
// prettier-ignore
function runExampleSimple() {
	console.log(1);
	const promise = new Promise(resolve => {​​​​​​​​ resolve(null) }​​​​​​​​);
	promise.then(() => {​​​​​​​​ setTimeout(() => {​​​​​​​​ console.log(2); }​​​​​​​​) }​​​​​​​​);
	setTimeout(() => {​​​​​​​​ console.log(3); }​​​​​​​​, 500);
	if (typeof process !== 'undefined') {  // node
		setImmediate(() => {​​​​​​​​ console.log(4); }​​​​​​​​);
	}
	setTimeout(() => {​​​​​​​​ console.log(5); }​​​​​​​​, 0);
	promise.then(() => {​​​​​​​​ console.log(6); }​​​​​​​​);
	console.log(7);
}

/**
 * with time logging
 * output
 // firefox

	//let isLogStart = true;

	Freezing file:///home/bsk/doc/idea_work/bskydive/rxjs-pqnejm-async/index.html DocumentFreezer.js:81:15
		sendSyncMessage suspend #0/1 SyncMessage.js:226:19
	Unfreezing file:///home/bsk/doc/idea_work/bskydive/rxjs-pqnejm-async/index.html DocumentFreezer.js:97:15
		sendSyncMessage finalizing SyncMessage.js:244:19
		sendSyncMessage resume #0/0 - 76ms SyncMessage.js:235:19
		sendSyncMessage finalizing SyncMessage.js:244:19

	sumLoopStart	START	№1, 	start:119
	sumLoopStart	STOP	№1, 	stop:7214,	duration: 7
	createPromise	START	№2, 	start:7214
	createPromise	STOP	№2, 	stop:7215,	duration: 0
	resolvePromise	START	№3, 	start:7215, 				delay:0
	resolvePromise	START	№4, 	start:7215, 				delay:100
	asyncTimeout	START	№5, 	start:7215, 				delay: 100
	asyncTimeout	START	№6, 	start:7215, 				delay: 0
	resolvePromise	START	№7, 	start:7215
	syncTaskStart	START	№8, 	start:7215
	resolvePromise	STOP	№7, 	stop:7215,	duration: 0
	asyncTimeout	STOP	№6, 	stop:7228,	duration: 0,	delay: 0
	resolvePromise	STOP	№3, 	stop:7228,	duration: 0,	delay:0
	asyncTimeout	STOP	№5, 	stop:7315,	duration: 0,	delay: 100
	resolvePromise	STOP	№4, 	stop:7316,	duration: 0,	delay:100


	//let isLogStart = false;

	Freezing file:///home/bsk/doc/idea_work/bskydive/rxjs-pqnejm-async/index.html DocumentFreezer.js:81:15
		sendSyncMessage suspend #0/1 SyncMessage.js:226:19
	Unfreezing file:///home/bsk/doc/idea_work/bskydive/rxjs-pqnejm-async/index.html DocumentFreezer.js:97:15
		sendSyncMessage finalizing SyncMessage.js:244:19
		sendSyncMessage resume #0/0 - 60ms SyncMessage.js:235:19
		sendSyncMessage finalizing SyncMessage.js:244:19

	sumLoopStart	STOP	№1, 	stop:7120,	duration: 7 		
	createPromise	STOP	№2, 	stop:7121,	duration: 0 		
	syncTaskStart	START	№8, 	start:7121						
	resolvePromise	STOP	№7, 	stop:7121,	duration: 0 		
	asyncTimeout	STOP	№6, 	stop:7135,	duration: 0,	delay: 0
	resolvePromise	STOP	№3, 	stop:7135,	duration: 0,	delay:0
	asyncTimeout	STOP	№5, 	stop:7220,	duration: 0,	delay: 100
	resolvePromise	STOP	№4, 	stop:7222,	duration: 0,	delay:100

 // chrome

	//let isLogStart = true;

	sumLoopStart	START	№1, 	start:23							
	sumLoopStart	STOP	№1, 	stop:6922,	duration: 6				
	createPromise	START	№2, 	start:6922							
	createPromise	STOP	№2, 	stop:6922,	duration: 0				
	resolvePromise	START	№3, 	start:6923,					delay:0	
	resolvePromise	START	№4, 	start:6923,					delay:100
	asyncTimeout	START	№5, 	start:6923,					delay: 100
	asyncTimeout	START	№6, 	start:6923,					delay: 0
	resolvePromise	START	№7, 	start:6923							
	syncTaskStart	START	№8, 	start:6923							
	resolvePromise	STOP	№7, 	stop:6923,	duration: 0				
	asyncTimeout	STOP	№6, 	stop:6924,	duration: 0,	delay: 0
	resolvePromise	STOP	№3, 	stop:6925,	duration: 0,	delay:0	
	asyncTimeout	STOP	№5, 	stop:7023,	duration: 0,	delay: 100
	resolvePromise	STOP	№4, 	stop:7023,	duration: 0,	delay:100

	//let isLogStart = false;
	sumLoopStart	STOP	№1, 	stop:6938,	duration: 6
	createPromise	STOP	№2, 	stop:6938,	duration: 0
	syncTaskStart	START	№8, 	start:6938			
	resolvePromise	STOP	№7, 	stop:6938,	duration: 0
	asyncTimeout	STOP	№6, 	stop:6939,	duration: 0,	delay: 0
	resolvePromise	STOP	№3, 	stop:6939,	duration: 0,	delay:0	
	asyncTimeout	STOP	№5, 	stop:7038,	duration: 0,	delay: 100
	resolvePromise	STOP	№4, 	stop:7038,	duration: 0,	delay:100

 // node

	// let isLogStart = true;

	sumLoopStart    START   №1,     start:19601489889960
	sumLoopStart    STOP    №1,     stop:19608610821399,    duration: 7
	createPromise   START   №2,     start:19608611139578
	createPromise   STOP    №2,     stop:19608611191338,    duration: 0
	resolvePromise  START   №3,     start:19608611237798,   delay:0
	resolvePromise  START   №4,     start:19608611261678,   delay:100
	asyncTimeout    START   №5,     start:19608611305208,   delay: 100
	asyncTimeout    START   №6,     start:19608611635178,   delay: 0
	resolvePromise  START   №7,     start:19608611738468
	syncTaskStart   START   №8,     start:19608611779628
	resolvePromise  STOP    №7,     stop:19608612112808,    duration: 0
	asyncTimeout    STOP    №6,     stop:19608612353548,    duration: 0,    delay: 0
	resolvePromise  STOP    №3,     stop:19608613528687,    duration: 0,    delay:0
	asyncTimeout    STOP    №5,     stop:19608711770460,    duration: 0,    delay: 100
	resolvePromise  STOP    №4,     stop:19608713000009,    duration: 0,    delay:100

	//let isLogStart = false;

	sumLoopStart    STOP    №1,     stop:19160621265246,    duration: 7
	createPromise   STOP    №2,     stop:19160624643124,    duration: 0
	syncTaskStart   START   №8,     start:19160625139793
	resolvePromise  STOP    №7,     stop:19160625437413,    duration: 0
	asyncTimeout    STOP    №6,     stop:19160626731622,    duration: 0,    delay: 0
	resolvePromise  STOP    №3,     stop:19160626804962,    duration: 0,    delay:0
	asyncTimeout    STOP    №5,     stop:19160725069085,    duration: 0,    delay: 100
	resolvePromise  STOP    №4,     stop:19160725195275,    duration: 0,    delay:100
	*/
function runExampleLog() {
	sumLoop(1, 10000000000);
	ps = createPromise$(2);
	resolvePromiseTimeout$(3, ps, 0);
	resolvePromiseTimeout$(4, ps, 100);
	asyncTimeout$(5, 100);
	asyncTimeout$(6, 0);
	resolvePromise$(7, ps);
	syncTask(8);
}



/**
 *
 * output:
// firefox
Freezing file:///home/bsk/doc/idea_work/bskydive/rxjs-pqnejm-async/index.html DocumentFreezer.js:81:15
sendSyncMessage suspend #0/1 SyncMessage.js:226:19
Unfreezing file:///home/bsk/doc/idea_work/bskydive/rxjs-pqnejm-async/index.html DocumentFreezer.js:97:15
sendSyncMessage finalizing SyncMessage.js:244:19
sendSyncMessage resume #0/0 - 47ms SyncMessage.js:235:19
sendSyncMessage finalizing SyncMessage.js:244:19

1
2
3
4
1.1
2.1
3.1
1.2
2.2
1.3

//chrome
1
2
3
4
1.1
2.1
3.1
1.2
2.2
1.3

 // node
	1
	2
	3
	4
	1.1
	2.1
	3.1
	1.2
	2.2
	1.3

	queue:

	p = new Promise((resolve) => { console.log(1); resolve(null); })
	p = new Promise((resolve) => { console.log(2); resolve(null); })
	p = new Promise((resolve) => { console.log(3); resolve(null); })
	p = setTimeout(() => { console.log(4) }, 0);
	.then(() => { setTimeout(() => { console.log(1.1) }, 0); })
	.then(() => { setTimeout(() => { console.log(2.1) }, 0); })
	.then(() => { setTimeout(() => { console.log(3.1) }, 0); });
	.then(() => { setTimeout(() => { console.log(2.2) }, 0); })
	.then(() => { setTimeout(() => { console.log(3.2) }, 0); });
 */
// prettier-ignore
function runExampleNested() {
	let p;

	p = new Promise((resolve) => { console.log(1); resolve(null); })
		.then(() => { setTimeout(() => { console.log(1.1) }, 0); })
		.then(() => { setTimeout(() => { console.log(1.2) }, 0); })
		.then(() => { setTimeout(() => { console.log(1.3) }, 0); });
	p = new Promise((resolve) => { console.log(2); resolve(null); })
		.then(() => { setTimeout(() => { console.log(2.1) }, 0); })
		.then(() => { setTimeout(() => { console.log(2.2) }, 0); });
	p = new Promise((resolve) => { console.log(3); resolve(null); })
		.then(() => { setTimeout(() => { console.log(3.1) }, 0); });
	p = setTimeout(() => { console.log(4) }, 0);
}


//=========================================================================================
//====================================== CONFIG ===========================================
//=========================================================================================

let isLogStart = false;

// runExampleSimple();
// runExampleLog();
runExampleNested();
