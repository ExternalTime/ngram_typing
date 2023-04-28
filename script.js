"use strict";

let status = document.getElementById("status");
let last_keypress = document.getElementById("last_keypress");
let last_time = document.getElementById("last_time");

let times = new Map();
let ngrams = [];
let time = [];
let max_bigram_speed = 400;

let target = "";

document.addEventListener("keydown", function(e) {
  if (e.key == "/" || e.key == "'")
    e.preventDefault();
  last_keypress.innerText = "last pressed key: " + e.key;
  if (target.charAt(time.length) !== e.key)
    return;
  time.push(e.timeStamp);
  if (time.length != target.length)
    return;
  let t0 = time.shift();
  let res = time.map(x => x - t0);
  time.length = 0;
  if (max_bigram_speed * (target.length - 1) < res.at(-1))
    return;
  if (!times.has(target))
    times.set(target, []);
  times.get(target).push(res);
  last_time.innerText = "last time: " + res.at(-1);
  next_ngram();
});

function next_ngram() {
  target = ngrams.pop();
  if (target === undefined) {
    target = "";
    status.innerText = "Done!";
    return;
  }
  status.innerText = "next word: " + target;
}

function import_test() {
  let imported = prompt("paste the testing plan here");
  if (imported === null) return;
  ngrams = eval?.(`"use strict";(${imported})`);
  next_ngram();
}

function export_data() {
  prompt(undefined, JSON.stringify(Array.from(times.entries())))
}

function* alphabet() {
    let x = 'a'.charCodeAt(0);
    do {
      yield String.fromCharCode(x);
    } while (x++ < 'z'.charCodeAt(0));
}

function bigrams() {
  let chars = [
    ...alphabet(),
    ';',
    ',',
    '.',
    '/',
  ];
  let bigrams = chars.flatMap(x => chars.map(y => x + y));
  for (let i = bigrams.length - 1; 0 < i; i--) {
    let j = Math.floor(Math.random() * i);
    [bigrams[i], bigrams[j]] = [bigrams[j], bigrams[i]];
  }
  ngrams = bigrams.flatMap(bigram => Array(4).fill(bigram));
  next_ngram();
}
