// from https://github.com/dbkaplun/euclidean-rhythm/blob/master/euclidean-rhythm.js

// The MIT License (MIT)

// Copyright (c) 2015 Dan Kaplun

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// ...with some modifications by Ben Swift

function compareArrays (a, b) {
  // TODO: optimize
  // we only care about the first element (the value), not the second (index)
  return JSON.stringify(a.map(x => x.val)) === JSON.stringify(b.map(x => x.val));
};

// https://stackoverflow.com/a/17428705
function transposeArray(a) {
  a[0].map((_, colIndex) => a.map(row => row[colIndex]));
}

// for "auto-animate in reveal.js reasons" we also assign each bit an index
// number, and keep track of them throughout the algorithm

function bjorklundLayers(k, n) {

  let groups = [];
  let layers = [];
  for (let i = 0; i < n; i++) groups.push([{val: Number(i < k), idx: i}]);
  layers.push(groups);

  let l;
  while (l = groups.length - 1) {
    let start = 0, first = groups[0];
    while (start < l && compareArrays(first, groups[start])) start++;
    if (start === l) break;

    let end = l, last = groups[l];
    while (end > 0 && compareArrays(last, groups[end])) end--;
    if (end === 0) break;

    let count = Math.min(start, l - end);


    groups = groups
      .slice(0, count)
      .map(function (group, i) { return group.concat(groups[l - i]); })
      .concat(groups.slice(count, -count));
    layers.push(groups);
  }
  layers.push([].concat.apply([], groups).map(x => [x]));
  return layers;
};

function euclid(k, n) {
  let layers = bjorklundLayers(k, n);
  // final layer is the end result
  return layers[layers.length-1];
}
