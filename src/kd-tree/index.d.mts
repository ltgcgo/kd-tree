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

/**
 * A k-dimensional tree.
 * ```js
 * import {
 * 	KDTree
 * } from "./kd-tree.mjs";
 *
 * const points = [
 * 	[0, 0, 0],
 * 	[11, 45, 14],
 * 	[191, 98, 10],
 * 	[255, 255, 255]
 * ];
 * const prop3Dim = [0, 1, 2];
 * const dist3Dim = (a, b) => {
 * 	let sum = 0;
 * 	for (let e of prop3Dim) {
 * 		let diff = a[e] - b[e];
 * 		sum += diff * diff;
 * 	};
 * 	return sum;
 * };
 *
 * let exampleTree = new KDTree(points, dist3Dim, prop3Dim);
 * ```
 @module
 */

/*
 * Node object of a k-dimensional tree.
 */
export class TreeNode {
	/** The left side of the node. */
	left: TreeNode;
	/** The right side of the node. */
	right: TreeNode;
	/** The referred-to object. */
	obj: any;
	/** The parent node of the node. */
	parent: TreeNode;
	/** The dimension specifier of this node. */
	dimension: Number;
	/**
	 @param object The referred-to object holding actual data.
	 @param dimension The dimension specifier of the node.
	 @param parent The parent of the node.
	 */
	constructor(object: any, dimension: Number, parent?: TreeNode);
}

/**
 * The k-dimensional tree.
 */
export class KDTree {
	/** The root of the k-d tree. */
	root: TreeNode;
	/** The dimension specifier array of the k-d tree. */
	get dimensions(): ArrayLike<Number>;
	/** The function used to measure distance. */
	get metric(): Function;
	/** Returns the serialized internal structure of the k-d tree. */
	toJSON(src?: TreeNode): object;
	/** Insert a point. */
	insert(point: ArrayLike<Number>): void;
	/** Remove a point. */
	remove(point: ArrayLike<Number>): void;
	/** Returns the nearest N points around the specified coordinate. */
	nearest(point: ArrayLike<Number>, maxNodes: Number, maxDist: Number): ArrayLike<ArrayLike<any>>;
	/** Returns the balance factor of the tree. */
	balanceFactor(): Number;
	/**
	* @param points All of the points to be put in the tree.
	* @param metric The distance measuring function.
	* @param dimensions The array containing the dimension specifiers.
	*/
	constructor(points: ArrayLike<ArrayLike<Number>>, metric: Function, dimensions: ArrayLike<Number>);
}

/**
 * Binary heap implementation from http://eloquentjavascript.net/appendix2.html . Rewritten into modern syntax.
 * I don't know how this specific implemention work yet, so no docs.
 */
export class KDBinaryHeap {}
