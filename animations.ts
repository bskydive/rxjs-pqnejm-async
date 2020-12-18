function watchAttributesChange(el: HTMLElement, worker: Function) {
	new MutationObserver(worker()).observe(el, {
		attributes: true,
	});
}

function asyncWorker$(el: HTMLElement) {
	console.log('click');

	setTimeout(function () {
		console.log('timeout');
	}, 0);

	Promise.resolve().then(function () {
		console.log('promise');
	});

	// change attributes
	el.setAttribute('data-time', performance.now().toString());
}

function moveBlockLoopComputed(el: HTMLElement, speed: number, workload?: Function) {
	console.log('moveBlockLoopComputed');
	el.style.left = `${right}px`;
	for (let i = right; i > left; i = i - speed) {
		// console.log('d');
		setTimeout(() => {
			el.style.left = i.toString() + 'px';
			getComputedStyle(el, 'style');
			console.log(i);
			if (workload) {
				workload();
			}
		}, 1000 - i);
	}
}

function moveBlockLoopFramed(el: HTMLElement, speed: number, workload?: Function) {
	console.log('moveBlockLoopFramed');
	el.style.left = `${right}px`;
	for (let i = right; i > left; i = i - speed) {
		setTimeout(() => {
			wrapperFrameDouble(() => {
				el.style.left = i.toString() + 'px';

				console.log('moveBlockLoopFramed', i);
				if (workload) {
					workload();
				}
			});
		}, 1000 - i);
	}
}

function moveBlockTransition(el: HTMLElement) {
	
	wrapperFrameDouble(() => {
		el.style.transition = 'transform 1s ease-in-out';
		el.style.transform = `translateX(${right}px)`;
	});
	console.log('start transition');
	getComputedStyle(el, 'style.transform');
	wrapperFrameDouble(() => {
		el.style.transform = `translateX(${left}px)`;
	});
}

function wrapperFrame(workload: Function) {
	requestAnimationFrame(workload());
}

function wrapperFrameDouble(workload: Function) {
	requestAnimationFrame(() => requestAnimationFrame(workload()));
}

function addClickEventWorker(el: HTMLElement, worker: Function) {
	el.addEventListener('click', worker());
}

// ========================================================================
// ========================================================================
// ========================================================================
const left = 100;
const right = 700;

// const block = document.querySelector('.block');
const blockA: HTMLElement = document.querySelector('.block.a') as HTMLElement;
const blockB: HTMLElement = document.querySelector('.block.b') as HTMLElement;
const blockC: HTMLElement = document.querySelector('.block.c') as HTMLElement;

blockA.addEventListener('click', () => moveBlockLoopComputed(blockA, 10));
blockB.addEventListener('click', () => moveBlockLoopFramed(blockB, 10));
blockC.addEventListener('click', () => moveBlockTransition(blockC));

// block.addEventListener('click', () => moveBlockTransition(block));

// block.setAttribute('style', `transform:translateX(${500}px);transition:transform 1s ease-in-out`);

//block.dispatchEvent(new CustomEvent('click', {bubbles: true}));

/* 
// js dispatch event

// js dispatch bubbled event

// manual DOM click
	// firefox

	// chrome

*/
