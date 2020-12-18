
// Let's get hold of those elements

let outer = document.querySelector('.outer');
let inner = document.querySelector('.inner');

// Let's listen for attribute changes on the
// outer element
new MutationObserver(function () {
	console.log('mutate');
}).observe(outer, {
	attributes: true,
});

// Here's a click listener…
function onClick() {
	console.log('click');

	setTimeout(function () {
		console.log('timeout');
	}, 0);

	Promise.resolve().then(function () {
		console.log('promise');
	});

	// mutate
	outer.setAttribute('data-random', Math.random().toString());
}

// …which we'll attach to both elements
inner.addEventListener('click', onClick);
outer.addEventListener('click', onClick);

// ========================================================================
// ========================================================================
// ========================================================================

// inner.dispatchEvent(new Event('click'));
inner.dispatchEvent(new CustomEvent('click', {bubbles: true}));



/* 
// js dispatch event
click
promise
mutate
timeout

// js dispatch bubbled event
click
click
promise
mutate
promise
timeout
timeout

// manual DOM click
	// firefox
	click
	promise
	mutate
	click
	promise
	mutate
	timeout
	timeout

	// chrome
	click
	promise
	mutate
	click
	promise
	mutate
	timeout
	timeout
*/