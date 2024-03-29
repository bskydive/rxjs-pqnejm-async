import { Observable, Subject } from 'rxjs';
import { take, map } from 'rxjs/operators';



let buttonDraft = document.querySelector('.button');

function onClickDraft() {
	console.log('click');
}

buttonDraft.addEventListener('click', onClickDraft);
// button.dispatchEvent(new CustomEvent('click', {bubbles: true}));


/**
 * Фабрика асинхронных исполнителей задач
 * concurrentFabric
 * @param Observable<any>[] requests
 * @param number concurrency
 * @returns Observable<any>[]
 * 
 * получает на вход массив потоков/задач и количество конкурентных/асинхронных исполнителей потоков
 * один исполнитель обрабатывает один поток
 * исполнитель сохраняет очерёдность результатов как во входящем массиве потоков/задач
 * 
 * Алгоритм:
 * создаём указатель ${srcTaskStartIndex} = 0 первого не выполненного задания
 * создаём массив ${running}[] = [] для индексов незавершённых задач
 * 
 * итерируем, пока указатель ${srcTaskStartIndex} < длинны входящей очереди источника задач
 * создаём ${free} = ${concurency} - ${running}.length количество свободных исполнителей на текущем шаге
 * резервируем ${free} пустых результатов в массиве результатов
 * сдвигаем указатель не выполненных задач ${srcTaskStartIndex} на +${free} для массива источника задач
 * создаём ${free} штук исполнителей, передаём им ${free} штук задач и индексов
 * каждый исполнитель получает индекс и задачу. после выполнения задачи исполнитель присваивает результат по индексу в массив с результатом
 * если не все исполнители завершили предыдущую задачу, передаём на следующую итерацию флаг занятости: уменьшаем количество ${free} свободных исполнителей, и добавляем в массив ${running}[] индексы незавершённых задач
 * убираем индекс из массива ${running}[], если в результирующем массиве по указанному индексу есть ненулевой результат
 * 

async function promiseAll(jobs,concurrency) {

for (let i=0; i<concurency; i++){
	const result = await jobs[i];
}

jobs = [......Promises];
concurrency = 5; 

flow:
th1: Promises(j1)
th2: Promises(j2->j7)
th3: Promises(j3->j6)
th4: Promises(j4->j8)
th5: Promises(j5->j9->j10->j11)
expected results [j1,j2,j3,j4,j5,j6,j7,j8,j9,j10,j11];

 */
export function concurrentFabric(srcTasks$: Observable<any>[], concurrency: number) {
	/**
	 * указатель первого не выполненного задания
	 */
	let srcTaskStartIndex = 0;

	/**
	 * массив ${}[] = [] для индексов незавершённых задач
	 */
	let runningTasks: any[] = [];

	/**
	 *  количество свободных исполнителей на текущем шаге
	 */
	let free = concurrency;

	/**
	 * массив результатов
	 */
	const result: Observable<any>[] = [];

	const avgTaskRunTime = 100;

	/**
	 * Конвейер исполнителей
	 */
	const setFabricRunners$: Subject<{ id: number; task$: Observable<any> }[]> = new Subject();

	const getFabricRunners$ = setFabricRunners$.asObservable().pipe(
		// каждый исполнитель получает индекс и задачу. после выполнения задачи исполнитель присваивает результат по индексу в массив с результатом
		map((tasks: { id: number; task$: Observable<any> }[]) => {
			console.log('tasks', tasks);

			tasks.forEach((task) => {
				// стартуем исполнителя
				task.task$.pipe(take(1)).subscribe((res) => {
					// выполняем задачу
					console.log('completed', res);

					// после выполнения убираем индекс из массива
					runningTasks.filter((index) => index !== task.id);

					// присваиваем результат по исходному индексу
					result[task.id] = res;
				});
			});
		})
	);

	// итерируем, пока указатель ${srcTaskStartIndex} < длинны входящей очереди источника задач
	while (srcTaskStartIndex < srcTasks$.length) {
		// наблюдаем через промежуток времени за освободившимися исполнителями
		setTimeout(() => {
			console.log('start')
			if (runningTasks.length < concurrency) {
				// если есть свободные исполнители

				free = concurrency - runningTasks.length;

				//резервируем ${free} пустых результатов в массиве результатов
				for (let i = 0; i < free; i++) {
					result.push(null);

					// добавляем в массив ${running}[] индексы незавершённых задач
					runningTasks.push({
						id: srcTaskStartIndex,
						task$: srcTasks$[srcTaskStartIndex],
					});

					// сдвигаем указатель не выполненных задач для массива источника задач
					srcTaskStartIndex++;
				}

				// создаём исполнителей, передаём им задачу и индекс
				setFabricRunners$.next(runningTasks);
			}
		}, avgTaskRunTime);
	}
};



