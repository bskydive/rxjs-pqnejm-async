
export class SomeSingletonClass {
	public text = '1';
}

/**
 * https://www.digitalocean.com/community/conceptual_articles/singleton-design-pattern-in-javascript
 */
// eslint-disable-next-line no-var
var singletonVar = (function () {
	var singletonVarInstance: any;

	function create() {
		function print() {
			console.log('singletonVarInstance', singletonVarInstance);
		}

		return {
			// public + private states and behaviors
			print: print,
		};
	}

	return {
		getInstance: function () {
			if (!singletonVarInstance) {
				singletonVarInstance = create();
			}
			return singletonVarInstance;
		},
	};

	function Singleton() {
		if (!singletonVarInstance) {
			singletonVarInstance = create();
		}
	}
})();

export function getSingleton<T>(Object1: any) {
	var instance: T;

	if (Object1?.constructor?.name && !instance) {
		instance = new Object1();
	}

	return instance;
}

export function getSingletonSymbol(object: Object) {
	var instance: Object;

	if (object?.constructor?.name && instance !== Symbol.for(object?.constructor?.name)) {
		
		instance = Symbol.for(object.constructor.name);
	}
}


/**
 * https://code.tutsplus.com/tutorials/how-to-implement-the-singleton-pattern-in-javascript-es6--cms-39927
 * https://www.digitalocean.com/community/tutorials/js-js-singletons
 */
export default class SingletonClass {
	private instance = null;

	constructor() {
		if (!this.instance) {
			this.instance = new SingletonClass();
		}

		return this.instance;
	}
}

function initSingletonDOM() {
	let button1 = document.querySelector('.button');

	function onClick1() {
		console.log('click');
	}

	button1.addEventListener('click', onClick1);
	// button.dispatchEvent(new CustomEvent('click', {bubbles: true}));
}

// initSingletonDOM();

let singletonInstance1 = getSingleton<SomeSingletonClass>(SomeSingletonClass);
singletonInstance1.text = '11';
console.log('singletonInstance1', singletonInstance1.text);
let singletonInstance2 = getSingleton<SomeSingletonClass>(SomeSingletonClass);
singletonInstance2.text = '22';
console.log('singletonInstance1', singletonInstance1.text);
console.log('singletonInstance2', singletonInstance2.text);
