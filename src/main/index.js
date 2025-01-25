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
	$e("#value-colour-2")
];
self.gInputPos = async function (ev, index) {
	let realX = ev.layerX - ev.srcElement.offsetLeft;
	let realWidth = ev.srcElement.offsetWidth;
	let computedValue = Math.floor((ev.srcElement.max + 1) * (realX / realWidth));
	colourValue[index] = computedValue;
	//console.debug(ev, index);
};
setInterval(async () => {
	colourBoxSelected.style.backgroundColor = `rgb(${colourValue.join(", ")})`;
	for (let index = 0; index < 3; index ++) {
		colourDisplay[index].innerText = colourValue[index];
		colourInput[index].value = colourValue[index];
	};
}, 40);

Alpine.start();
