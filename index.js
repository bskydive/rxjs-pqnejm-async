"use strict";
/* eslint-disable no-console */
var result = 0;
// const source = of('World').pipe(map((x) => `Hello ${x}!`));
// source.subscribe(console.log);
console.log(1);
result = 0;
for (var i = 0; i < 100000000; i++) {
    result++;
}
console.log('accumulator1:', result);
var promise = new Promise(function (resolve, reject) {
    console.log('promise 1 resolved');
    resolve(true);
});
promise.then(function () {
    setTimeout(function () {
        console.log(2);
    });
});
setTimeout(function () {
    console.log(3);
}, 500);
setTimeout(function () {
    console.log(5);
}, 0);
promise.then(function () {
    console.log(6);
});
result = 0;
for (var i = 0; i < 100000000; i++) {
    result++;
}
console.log('accumulator2:', result);
console.log(7);
var a = performance.now();
var m = [];
for (var i = 0; i < 5000000; i++) {
    m.push(i);
}
m.forEach(function (item, index) {
    var j = 0;
    j += m[index];
});
console.log(a, performance.now(), (performance.now() - a) / 1000);
//1206217 1206989 0.772
// for
a = performance.now();
m = [];
for (var i = 0; i < 5000000; i++) {
    m.push(i);
}
for (var i = 0; i < m.length; i++) {
    var j = 0;
    j += m[i];
}
console.log(a, performance.now(), (performance.now() - a) / 1000);
//1108951 1110126 1.175
