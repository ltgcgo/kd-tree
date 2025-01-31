/**
 * k-d Tree JavaScript - v1.1
 *
 * https://github.com/ubilabs/kd-tree-javascript
 * https://github.com/ltgcgo/kd-tree
 * https://codeberg.org/ltgc/kd-tree
 *
 * @author Mircea Pricop <pricop@ubilabs.net>, 2012
 * @author Martin Kleppe <kleppe@ubilabs.net>, 2012
 * @author Ubilabs http://ubilabs.net, 2012
 * @author Lumière Élevé <ble-m@ltgc.cc>, 2025
 * @author Lightingale Community https://ltgc.cc, 2025
 * @license MIT License <http://www.opensource.org/licenses/mit-license.php>
 */

"use strict";

// Binary heap implementation from http://eloquentjavascript.net/appendix2.html
// Rewritten to use the modern syntax

let KDBinaryHeap = class KDBinaryHeap {
	content = [];
	scoreFunction;
	push(element) {
		let upThis = this;
		upThis.content.push(element);
		upThis.bubbleUp(upThis.content.length - 1);
	};
	pop() {
		let upThis = this;
		let result = upThis.content[0];
		let end = upThis.content.pop();
		if (upThis.content.length > 0) {
			upThis.content[0] = end;
			upThis.sinkDown(0);
		};
		return result;
	};
	peek() {
		return this.content[0];
	};
	remove(node) {
		let upThis = this;
		let length = upThis.content.length;
		for (let i = 0; i < length; i ++) {
			if (upThis.content[i] == node) {
				let end = upThis.content.pop();
				if (i != length - 1) {
					upThis.content[i] = end;
					if (upThis.scoreFunction(end) < upThis.scoreFunction(node)) {
						upThis.bubbleUp(i);
					} else {
						upThis.sinkDown(i);
					};
				};
				return;
			};
		};
		throw(new Error(`The specified node was not found.`));
	};
	size() {
		return this.content.length;
	};
	bubbleUp(n) {
		let upThis = this;
		let element = upThis.content[n];
		while (n > 0) {
			let parentN = ((n + 1) >> 1) - 1,
				parent = upThis.content[parentN];
			if (upThis.scoreFunction(element) < upThis.scoreFunction(parent)) {
				upThis.content[parentN] = element;
				upThis.content[n] = parent;
				n = parentN;
			} else {
				break;
			};
		};
	};
	sinkDown(n) {
		let upThis = this;
		let length = upThis.content.length,
			element = upThis.content[n],
			score = upThis.scoreFunction(element);
		while (true) {
			let child2N = (n + 1) << 1,
				child1N = child2N - 1;
			let swap = null;
			if (child1N < length) {
				let child1 = upThis.content[child1N],
					child1Score = upThis.scoreFunction(child1);
				if (child1Score < score) {
					swap = child1N;
				};
			};
			if (child2N < length) {
				let child2 = upThis.content[child2N],
					child2Score = upThis.scoreFunction(child2);
				if (child2Score < score) {
					swap = child2N;
				};
			};
			if (swap != null) {
				upThis.content[n] = upThis.content[swap];
				upThis.content[swap] = element;
				n = swap;
			} else {
				break;
			};
		};
	};
	constructor(scoreFunction) {
		this.scoreFunction = scoreFunction;
	};
};

let TreeNode = class TreeNode {
	left = null;
	right = null;
	obj;
	parent;
	dimension;
	constructor(object, dimension, parent) {
		let upThis = this;
		upThis.obj = object;
		upThis.parent = parent;
		upThis.dimension = dimension;
	};
};

let KDTree = class KDTree {
	#dimensions;
	#metricFunction;
	root;
	get dimensions() {
		return this.#dimensions;
	};
	get metric() {
		return this.#metricFunction;
	};
	#buildTree(points, depth, parent) {
		let upThis = this;
		let dim = depth % upThis.#dimensions.length;
		if (points.length === 0) {
			return null;
		};
		if (points.length === 1) {
			return new TreeNode(points[0], dim, parent);
		};
		points.sort((a, b) => {
			return a[upThis.#dimensions[dim]] - b[upThis.#dimensions[dim]];
		});
		let median = points.length >> 1;
		let node = new TreeNode(points[median], dim, parent);
		node.left = upThis.#buildTree(points.slice(0, median), depth + 1, node);
		node.right = upThis.#buildTree(points.slice(median + 1), depth + 1, node);
		return node;
	};
	#restoreParent(root) {
		let upThis = this;
		if (root.left) {
			root.left.parent = root;
			upThis.#restoreParent(root.left);
		};
		if (root.right) {
			root.right.parent = root;
			upThis.#restoreParent(root.right);
		};
	};
	#loadTree(data) {
		this.root = data;
		this.#restoreParent(this.root);
	};
	#innerSearch(node, parent, point) {
		if (node === null) {
			return parent;
		};
		let dimension = dimensions[node.dimension];
		if (point[dimension] < node.obj[dimension]) {
			return upThis.#innerSearch(node.left, node, point);
		} else {
			return upThis.#innerSearch(node.right, node, point);
		};
	};
	#nodeSearch(node, point) {
		let upThis = this;
		if (node === null) {
			return null;
		};
		if (node.obj === point) {
			return node;
		};
		let dimension = upThis.#dimensions[node.dimension];
		if (point[dimension] < node.obj[dimension]) {
			return upThis.#nodeSearch(node.left, point);
		} else {
			return upThis.#nodeSearch(node.right, point);
		};
	};
	#findMin(node, dim) {
		let upThis = this;
		if (node === null) {
			return null;
		};
		let dimension = upThis.#dimensions[dim];
		if (node.dimension === dim) {
			if (node.left != null) {
				return upThis.#findMin(node.left, dim);
			};
			return node;
		};
		let own = node.obj[dimension];
		let left = upThis.#findMin(node.left, dim);
		let right = upThis.#findMin(node.right, dim);
		let min = node;
		if (left != null && left.obj[dimension] < own) {
			min = left;
		};
		if (right != null && right.obj[dimension] < min.obj[dimension]) {
			min = right;
		};
		return min;
	};
	#removeNode(node) {
		let upThis = this;
		if (node.left === null && node.right === null) {
			if (node.parent === null) {
				upThis.root = null;
				return;
			};
			let parentDimension = upThis.#dimensions[node.parent.dimension];
			if (node.obj[parentDimension] < node.parent.obj[parentDimension]) {
				node.parent.left = null;
			} else {
				node.parent.right = null;
			};
			return;
		};
		// If the right subtree isn't empty, swap with the minimum element on the node's dimension.
		// If it is empty, the left and right subtrees are swapped and same is done to both.
		if (node.right == null) {
			let nextNode = upThis.#findMin(node.left, node.dimension);
			let nextObj = nextNode.obj;
			upThis.#removeNode(nextNode);
			node.right = node.left;
			node.left = null;
			node.obj = nextObj;
		} else {
			let nextNode = upThis.#findMin(node.right, node.dimension);
			let nextObj = nextNode.obj;
			upThis.#removeNode(nextNode);
			node.obj = nextObj;
		};
	};
	#saveNode(node, distance, bestNodes, maxNodes) {
		bestNodes.push([node, distance]);
		if (bestNodes.size() > maxNodes) {
			bestNodes.pop();
		};
	};
	#nearestSearch(node, point, bestNodes, maxNodes) {
		let upThis = this;
		let dimension = upThis.#dimensions[node.dimension];
		let ownDistance = upThis.#metricFunction(point, node.obj);
		let linearPoint = [];
		for (let i = 0; i < upThis.#dimensions.length; i ++) {
			if (i === node.dimension) {
				linearPoint[upThis.#dimensions[i]] = point[upThis.#dimensions[i]];
			} else {
				linearPoint[upThis.#dimensions[i]] = node.obj[upThis.#dimensions[i]];
			};
		};
		let linearDistance = upThis.#metricFunction(linearPoint, node.obj);
		if (node.right === null && node.left === null) {
			if (bestNodes.size() < maxNodes || ownDistance < bestNodes.peek()[1]) {
				upThis.#saveNode(node, ownDistance, bestNodes, maxNodes);
			};
			return;
		};
		let bestChild;
		if (node.right === null) {
			bestChild = node.left;
		} else if (node.left === null) {
			bestChild = node.right;
		} else {
			if (point[dimension] < node.obj[dimension]) {
				bestChild = node.left;
			} else {
				bestChild = node.right;
			};
		};
		upThis.#nearestSearch(bestChild, point, bestNodes, maxNodes);
		if (
			bestNodes.size() < maxNodes ||
			ownDistance < bestNodes.peek()[1]
		) {
			upThis.#saveNode(node, ownDistance, bestNodes, maxNodes);
		};
		if (
			bestNodes.size() < maxNodes ||
			Math.abs(linearDistance) < bestNodes.peek()[1]
		) {
			let otherChild;
			if (bestChild === node.left) {
				otherChild = node.right;
			} else {
				otherChild = node.left;
			};
			if (otherChild != null) {
				upThis.#nearestSearch(otherChild, point, bestNodes, maxNodes)
			};
		};
	};
	#height(node) {
		if (node == null) {
			return 0;
		};
		return Math.max(this.#height(node.left), this.#height(node.right)) + 1;
	};
	#count(node) {
		if (node == null) {
			return 0;
		};
		return this.#count(node.left) + this.#count(node.right) + 1;
	};
	toJSON(src) {
		let upThis = this;
		if (!src) {
			src = upThis.root;
		};
		let dest = new TreeNode(src.obj, src.dimension, null);
		if (src.left) {
			dest.left = upThis.toJSON(src.left);
		};
		if (src.right) {
			dest.right = upThis.toJSON(src.right);
		};
		return dest;
	};
	insert(point) {
		let upThis = this;
		let insertPosition = upThis.#innerSearch(upThis.root, null, point);
		if (insertPosition === null) {
			upThis.root = new TreeNode(point, 0, null);
			return;
		};
		let newNode = new TreeNode(point, (insertPosition.dimension + 1) % upThis.#dimensions.length, insertPosition);
		let dimension = upThis.#dimensions[insertPosition.dimension];
		if (point[dimension] < insertPosition.obj[dimension]) {
			insertPosition.left = newNode;
		} else {
			insertPosition.right = newNode;
		};
	};
	remove(point) {
		let upThis = this;
		let node = upThis.#nodeSearch(upThis.root, point);
		if (node === null) {
			return;
		};
		upThis.#removeNode(node);
	};
	nearest(point, maxNodes, maxDist) {
		let bestNodes = new KDBinaryHeap((e) => {
			return -e[1];
		});
		if (maxDist) {
			for (let i = 0; i < maxNodes; i ++) {
				bestNodes.push([null, maxDist]);
			};
		};
		if (this.root) {
			this.#nearestSearch(this.root, point, bestNodes, maxNodes);
		};
		let result = [];
		for (let i = 0; i < Math.min(maxNodes, bestNodes.content.length); i ++) {
			if (bestNodes.content[i][0]) {
				result.push([bestNodes.content[i][0].obj, bestNodes.content[i][1]]);
			};
		};
		return result;
	};
	balanceFactor() {
		let upThis = this;
		return upThis.#height(upThis.root) / Math.log(upThis.#count(upThis.root)) / Math.LN2;
	};
	constructor(points, metric, dimensions) {
		let upThis = this;
		upThis.#dimensions = dimensions;
		upThis.#metricFunction = metric;
		// If the provided list of points is not an array, assume a pre-built tree is being loaded.
		if (Array.isArray(points)) {
			upThis.root = upThis.#buildTree(points, 0, null);
		} else {
			upThis.#loadTree(points, metric, dimensions);
		};
	};
};

export {
	KDTree,
	KDBinaryHeap
};
