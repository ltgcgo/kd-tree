"use strict";let D=class{left=null;right=null;obj;parent;dimension;constructor(o,r,s){let a=this;a.obj=o,a.parent=s,a.dimension=r}};function J(f,o,r){let s=this;function a(t,l,n){let h=l%r.length,e,i;return t.length===0?null:t.length===1?new D(t[0],h,n):(t.sort(function(g,u){return g[r[h]]-u[r[h]]}),e=Math.floor(t.length/2),i=new D(t[e],h,n),i.left=a(t.slice(0,e),l+1,i),i.right=a(t.slice(e+1),l+1,i),i)}function k(t){s.root=t;function l(n){n.left&&(n.left.parent=n,l(n.left)),n.right&&(n.right.parent=n,l(n.right))}l(s.root)}Array.isArray(f)?this.root=a(f,0,null):k(f,o,r),this.toJSON=function(t){t||(t=this.root);let l=new D(t.obj,t.dimension,null);return t.left&&(l.left=s.toJSON(t.left)),t.right&&(l.right=s.toJSON(t.right)),l},this.insert=function(t){function l(i,g){if(i===null)return g;let u=r[i.dimension];return t[u]<i.obj[u]?l(i.left,i):l(i.right,i)}let n=l(this.root,null),h,e;if(n===null){this.root=new D(t,0,null);return}h=new D(t,(n.dimension+1)%r.length,n),e=r[n.dimension],t[e]<n.obj[e]?n.left=h:n.right=h},this.remove=function(t){let l;function n(e){if(e===null)return null;if(e.obj===t)return e;let i=r[e.dimension];return t[i]<e.obj[i]?n(e.left,e):n(e.right,e)}function h(e){let i,g,u;function b(v,j){let T,S,w,c,m;return v===null?null:(T=r[j],v.dimension===j?v.left!==null?b(v.left,j):v:(S=v.obj[T],w=b(v.left,j),c=b(v.right,j),m=v,w!==null&&w.obj[T]<S&&(m=w),c!==null&&c.obj[T]<m.obj[T]&&(m=c),m))}if(e.left===null&&e.right===null){if(e.parent===null){s.root=null;return}u=r[e.parent.dimension],e.obj[u]<e.parent.obj[u]?e.parent.left=null:e.parent.right=null;return}e.right!==null?(i=b(e.right,e.dimension),g=i.obj,h(i),e.obj=g):(i=b(e.left,e.dimension),g=i.obj,h(i),e.right=e.left,e.left=null,e.obj=g)}l=n(s.root),l!==null&&h(l)},this.nearest=function(t,l,n){let h,e,i;i=new F(function(u){return-u[1]});function g(u){let b,v=r[u.dimension],j=o(t,u.obj),T={},S,w,c;function m(M,y){i.push([M,y]),i.size()>l&&i.pop()}for(c=0;c<r.length;c+=1)c===u.dimension?T[r[c]]=t[r[c]]:T[r[c]]=u.obj[r[c]];if(S=o(T,u.obj),u.right===null&&u.left===null){(i.size()<l||j<i.peek()[1])&&m(u,j);return}u.right===null?b=u.left:u.left===null?b=u.right:t[v]<u.obj[v]?b=u.left:b=u.right,g(b),(i.size()<l||j<i.peek()[1])&&m(u,j),(i.size()<l||Math.abs(S)<i.peek()[1])&&(b===u.left?w=u.right:w=u.left,w!==null&&g(w))}if(n)for(h=0;h<l;h+=1)i.push([null,n]);for(s.root&&g(s.root),e=[],h=0;h<Math.min(l,i.content.length);h+=1)i.content[h][0]&&e.push([i.content[h][0].obj,i.content[h][1]]);return e},this.balanceFactor=function(){function t(n){return n===null?0:Math.max(t(n.left),t(n.right))+1}function l(n){return n===null?0:l(n.left)+l(n.right)+1}return t(s.root)/(Math.log(l(s.root))/Math.log(2))}}function F(f){this.content=[],this.scoreFunction=f}F.prototype={push:function(f){this.content.push(f),this.bubbleUp(this.content.length-1)},pop:function(){let f=this.content[0],o=this.content.pop();return this.content.length>0&&(this.content[0]=o,this.sinkDown(0)),f},peek:function(){return this.content[0]},remove:function(f){for(let o=this.content.length,r=0;r<o;r++)if(this.content[r]==f){let s=this.content.pop();r!=o-1&&(this.content[r]=s,this.scoreFunction(s)<this.scoreFunction(f)?this.bubbleUp(r):this.sinkDown(r));return}throw new Error("Node not found.")},size:function(){return this.content.length},bubbleUp:function(f){for(let o=this.content[f];f>0;){let r=Math.floor((f+1)/2)-1,s=this.content[r];if(this.scoreFunction(o)<this.scoreFunction(s))this.content[r]=o,this.content[f]=s,f=r;else break}},sinkDown:function(f){for(let o=this.content.length,r=this.content[f],s=this.scoreFunction(r);;){let a=(f+1)*2,k=a-1,t=null;if(k<o){let l=this.content[k],n=this.scoreFunction(l);n<s&&(t=k)}if(a<o){let h=this.content[a],e=this.scoreFunction(h);e<(t==null?s:n)&&(t=a)}if(t!=null)this.content[f]=this.content[t],this.content[t]=r,f=t;else break}}};export{J as KDTree,F as KDTreeBinaryHeap};
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
