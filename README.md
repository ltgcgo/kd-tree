# KD Tree
🌲 KD Tree (k-dimentional tree) but updated. Forked from [ubilabs/kd-tree-javascript](https://github.com/ubilabs/kd-tree-javascript).

Documentation available at [kb.ltgc.cc](https://kb.ltgc.cc/kd-tree/).

## Example
```js
import {
	KDTree
} from "./kd-tree.mjs";

const points = [
	[0, 0, 0],
	[11, 45, 14],
	[191, 98, 10],
	[255, 255, 255]
];
const prop3Dim = [0, 1, 2];
const dist3Dim = (a, b) => {
	let sum = 0;
	for (let e of prop3Dim) {
		let diff = a[e] - b[e];
		sum += diff * diff;
	};
	return sum;
};

let exampleTree = new KDTree(points, dist3Dim, prop3Dim);
```
