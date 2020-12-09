import { of } from "rxjs";
import { map } from "rxjs/operators";
let result = 0;

const source = of("World").pipe(map(x => `Hello ${x}!`));

source.subscribe(console.log);

console.log(1);

result = 0;
for (let i = 0; i < 100000000; i++) {result++;}
console.log("accumulator1:", result);

const promise = new Promise((resolve, reject) => {console.log("promise 1 resolved");resolve();});

promise.then(() => {setTimeout(() => {console.log(2);});});

setTimeout(() => {console.log(3);}, 500);

setTimeout(() => {console.log(5);}, 0);

promise.then(() => {console.log(6);});

result = 0;
for (let i = 0; i < 100000000; i++) {result++;}
console.log("accumulator2:", result);

console.log(7);

let a = performance.now();
let m = [];

for (let i = 0; i < 5000000; i++) {m.push(i);}

m.forEach((item, index) => {let j = 0;j += m[index];});

console.log(a, performance.now(), (performance.now() - a) / 1000);
//1206217 1206989 0.772
// for
a = performance.now();
m = [];
for (let i = 0; i < 5000000; i++) {
  m.push(i);
}
for (let i = 0; i < m.length; i++) {
  let j = 0;
  j += m[i];
}
console.log(a, performance.now(), (performance.now() - a) / 1000);
//1108951 1110126 1.175
