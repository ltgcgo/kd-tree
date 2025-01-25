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

/*
	WARNING!
	The current code haven't received any rewrite yet.
*/

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

// Binary heap implementation from:
// http://eloquentjavascript.net/appendix2.html

function BinaryHeap(scoreFunction){
	this.content = [];
	this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
	push: function(element) {
		// Add the new element to the end of the array.
		this.content.push(element);
		// Allow it to bubble up.
		this.bubbleUp(this.content.length - 1);
	},

	pop: function() {
		// Store the first element so we can return it later.
		var result = this.content[0];
		// Get the element at the end of the array.
		var end = this.content.pop();
		// If there are any elements left, put the end element at the
		// start, and let it sink down.
		if (this.content.length > 0) {
			this.content[0] = end;
			this.sinkDown(0);
		}
		return result;
	},

	peek: function() {
		return this.content[0];
	},

	remove: function(node) {
		var len = this.content.length;
		// To remove a value, we must search through the array to find
		// it.
		for (var i = 0; i < len; i++) {
			if (this.content[i] == node) {
				// When it is found, the process seen in 'pop' is repeated
				// to fill up the hole.
				var end = this.content.pop();
				if (i != len - 1) {
					this.content[i] = end;
					if (this.scoreFunction(end) < this.scoreFunction(node))
						this.bubbleUp(i);
					else
						this.sinkDown(i);
				}
				return;
			}
		}
		throw new Error("Node not found.");
	},

	size: function() {
		return this.content.length;
	},

	bubbleUp: function(n) {
		// Fetch the element that has to be moved.
		var element = this.content[n];
		// When at 0, an element can not go up any further.
		while (n > 0) {
			// Compute the parent element's index, and fetch it.
			var parentN = Math.floor((n + 1) / 2) - 1,
					parent = this.content[parentN];
			// Swap the elements if the parent is greater.
			if (this.scoreFunction(element) < this.scoreFunction(parent)) {
				this.content[parentN] = element;
				this.content[n] = parent;
				// Update 'n' to continue at the new position.
				n = parentN;
			}
			// Found a parent that is less, no need to move it further.
			else {
				break;
			}
		}
	},

	sinkDown: function(n) {
		// Look up the target element and its score.
		var length = this.content.length,
				element = this.content[n],
				elemScore = this.scoreFunction(element);

		while(true) {
			// Compute the indices of the child elements.
			var child2N = (n + 1) * 2, child1N = child2N - 1;
			// This is used to store the new position of the element,
			// if any.
			var swap = null;
			// If the first child exists (is inside the array)...
			if (child1N < length) {
				// Look it up and compute its score.
				var child1 = this.content[child1N],
						child1Score = this.scoreFunction(child1);
				// If the score is less than our element's, we need to swap.
				if (child1Score < elemScore)
					swap = child1N;
			}
			// Do the same checks for the other child.
			if (child2N < length) {
				var child2 = this.content[child2N],
						child2Score = this.scoreFunction(child2);
				if (child2Score < (swap == null ? elemScore : child1Score)){
					swap = child2N;
				}
			}

			// If the element needs to be moved, swap it, and continue.
			if (swap != null) {
				this.content[n] = this.content[swap];
				this.content[swap] = element;
				n = swap;
			}
			// Otherwise, we are done.
			else {
				break;
			}
		}
	}
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
		let bestNodes = new BinaryHeap((e) => {
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
	BinaryHeap as KDTreeBinaryHeap
};
