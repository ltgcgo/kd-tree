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

let palettePool = [];
const paletteBrowser = $e("#palette-browser");
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
	for (let colour of palettePool) {
		let colourElement = document.createElement("div");
		colourElement.className = "cell demo-colour-square-small";
		colourElement.style.background = `rgb(${colour.join(", ")})`;
		paletteBrowser.appendChild(colourElement);
	};
};
self.gImportPaste = async () => {
	let inputData = prompt("Paste your palette here in hexadecimal format.").replaceAll(",", " ").split(" ");
	while (palettePool.length) {
		palettePool.pop();
	};
	while (paletteBrowser.children.length) {
		paletteBrowser.children[0].remove();
	};
	importPaletteFromString(inputData);
	console.debug(palettePool);
};

setInterval(async () => {
	let startTime = performance.now();
	colourBoxSelected.style.backgroundColor = `rgb(${colourValue.join(", ")})`;
	for (let index = 0; index < 3; index ++) {
		colourDisplay[index].innerText = colourValue[index];
		colourInput[index].value = colourValue[index];
	};
	colourDisplay[4].innerText = `${performance.now() - startTime}`.substring(0, 3);
}, 40);

importPaletteFromString(`000 a00 0a0 a70 00a a0a 0aa aaa 555 f55 5f5 ff5 55f f5f 5ff fff`.split(" "));

Alpine.start();
