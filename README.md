# rxjs-pqnejm-async

* [Edit on StackBlitz ⚡️](https://stackblitz.com/edit/rxjs-pqnejm-async)
* async event loop practice playground
* Async event loop tasks runnable 
	* in the internet service: https://stackblitz.com/edit/rxjs-pqnejm-async
	* in the browser via opening local url `rxjs-pqnejm-async\index.html`
	* in the console:

	```bash
	# run in node
	npm run start
	# build and run in node
	npm run b
	# logfile for profiling
	npm run log
	```
* debug works in [vscode](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_multi-version-support)
* Configuration:
	* `let isLogStart = true;` - logs START timing events

* TODO add rxjs bundler
* TODO add unit tests

## toread

 * https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
 * https://nodejs.dev/learn/the-nodejs-event-loop
 * https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver