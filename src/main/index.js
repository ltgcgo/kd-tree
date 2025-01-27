"use strict";

import {
	KDTree
} from "../kd-tree/index.mjs";
import {
	Alpine
} from "../../libs/alpine@alpinejs/alpine.min.js";
import {
	$e
} from "../../libs/lightfelt@ltgcgo/main/quickPath.js";

// The script loaded by the demo page

// Input handlers
const colourValue = new Uint8Array(3);
const colourBoxSelected = $e("#display-selected");
const colourBoxNearest = $e("#display-matched");
const colourInput = [
	$e("#input-colour-0"),
	$e("#input-colour-1"),
	$e("#input-colour-2")
];
const colourDisplay = [
	$e("#value-colour-0"),
	$e("#value-colour-1"),
	$e("#value-colour-2"),
	$e("#value-colour-3"),
	$e("#value-colour-4")
];
self.gInputPos = async function (ev, index) {
	let realX = ev.layerX - ev.srcElement.offsetLeft;
	let realWidth = ev.srcElement.offsetWidth;
	let computedValue = Math.floor((ev.srcElement.max + 1) * (realX / realWidth));
	colourValue[index] = computedValue;
	//console.debug(ev, index);
};

const dim3Prop = [0, 1, 2];
const dim3Dist = (a, b) => {
	let sum = 0;
	for (let e of dim3Prop) {
		let diff = a[e] - b[e];
		sum += diff * diff;
	};
	return sum;
	//return Math.sqrt(sum);
};

let palettePool = [];
const paletteBrowser = $e("#palette-browser");
const chooseColourFromPalette = function (ev) {
	this.colour.forEach((e, i) => {
		colourValue[i] = e;
	});
};
let importPaletteFromString = (inputData) => {
	for (let e of inputData) {
		let modified = 0, colourValue = new Uint8Array(3);
		switch ((e.length * 86) >> 8) {
			case 1: {
				for (let i = 0; i < 3; i ++) {
					colourValue[i] = parseInt(`0x${e[i]}`) * 17;
					modified += 2;
				};
				break;
			};
			case 2: {
				for (let i = 0; i < 6; i ++) {
					colourValue[i >> 1] |= parseInt(`0x${e[i]}`) << ((1 ^ (i & 1)) << 2);
					modified ++;
				};
				break;
			};
		};
		if (modified == 6) {
			palettePool.push(colourValue);
		};
	};
	if (self.colourTree) {
		delete self.colourTree;
	};
	for (let colour of palettePool) {
		let colourElement = document.createElement("div");
		colourElement.className = "cell demo-colour-square-small";
		colourElement.style.background = `rgb(${colour.join(", ")})`;
		colourElement.colour = colour;
		colourElement.addEventListener("mouseup", chooseColourFromPalette);
		paletteBrowser.appendChild(colourElement);
	};
	self.colourTree = new KDTree(palettePool, dim3Dist, dim3Prop);
};
self.gImportPaste = async () => {
	let inputData = prompt("Paste your palette here in hexadecimal format.").replaceAll(",", " ").replaceAll("\n", " ").split(" ");
	while (palettePool.length) {
		palettePool.pop();
	};
	while (paletteBrowser.children.length) {
		paletteBrowser.children[0].remove();
	};
	importPaletteFromString(inputData);
	console.debug(palettePool);
};

let weightedTime = 0;
setInterval(async () => {
	colourBoxSelected.style.backgroundColor = `rgb(${colourValue.join(", ")})`;
	for (let index = 0; index < 3; index ++) {
		colourDisplay[index].innerText = colourValue[index];
		colourInput[index].value = colourValue[index];
	};
	let startTime = performance.now();
	let pickedResult = self.colourTree?.nearest(colourValue, 1, 65025)[0];
	weightedTime = weightedTime * 0.975 + (performance.now() - startTime) * 0.025;
	colourDisplay[4].innerText = `${weightedTime}`.substring(0, 4);
	colourDisplay[4].title = `${weightedTime}`.substring(0, 8);
	if (pickedResult[0]) {
		colourDisplay[3].innerText = `${Math.sqrt(pickedResult[1])}`.substring(0, 4);
		colourBoxNearest.style.backgroundColor = `rgb(${pickedResult[0].join(", ")})`;
	};
}, 40);

importPaletteFromString(`000 a00 0a0 a70 00a a0a 0aa aaa 555 f55 5f5 ff5 55f f5f 5ff fff`.split(" "));

Alpine.start();
