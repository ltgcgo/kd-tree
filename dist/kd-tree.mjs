"use strict";let k=class{left=null;right=null;obj;parent;dimension;constructor(c,r,s){let a=this;a.obj=c,a.parent=s,a.dimension=r}};function S(f){this.content=[],this.scoreFunction=f}S.prototype={push:function(f){this.content.push(f),this.bubbleUp(this.content.length-1)},pop:function(){let f=this.content[0],c=this.content.pop();return this.content.length>0&&(this.content[0]=c,this.sinkDown(0)),f},peek:function(){return this.content[0]},remove:function(f){for(let c=this.content.length,r=0;r<c;r++)if(this.content[r]==f){let s=this.content.pop();r!=c-1&&(this.content[r]=s,this.scoreFunction(s)<this.scoreFunction(f)?this.bubbleUp(r):this.sinkDown(r));return}throw new Error("Node not found.")},size:function(){return this.content.length},bubbleUp:function(f){for(let c=this.content[f];f>0;){let r=Math.floor((f+1)/2)-1,s=this.content[r];if(this.scoreFunction(c)<this.scoreFunction(s))this.content[r]=c,this.content[f]=s,f=r;else break}},sinkDown:function(f){for(let c=this.content.length,r=this.content[f],s=this.scoreFunction(r);;){let a=(f+1)*2,p=a-1,t=null;if(p<c){let n=this.content[p],l=this.scoreFunction(n);l<s&&(t=p)}if(a<c){let h=this.content[a],e=this.scoreFunction(h);e<(t==null?s:l)&&(t=a)}if(t!=null)this.content[f]=this.content[t],this.content[t]=r,f=t;else break}}};function O(f,c,r){let s=this;function a(t,n,l){let h=n%r.length,e,i;return t.length===0?null:t.length===1?new k(t[0],h,l):(t.sort(function(o,u){return o[r[h]]-u[r[h]]}),e=Math.floor(t.length/2),i=new k(t[e],h,l),i.left=a(t.slice(0,e),n+1,i),i.right=a(t.slice(e+1),n+1,i),i)}function p(t){s.root=t;function n(l){l.left&&(l.left.parent=l,n(l.left)),l.right&&(l.right.parent=l,n(l.right))}n(s.root)}Array.isArray(f)?this.root=a(f,0,null):p(f,c,r),this.toJSON=function(t){t||(t=this.root);let n=new k(t.obj,t.dimension,null);return t.left&&(n.left=s.toJSON(t.left)),t.right&&(n.right=s.toJSON(t.right)),n},this.insert=function(t){function n(i,o){if(i===null)return o;let u=r[i.dimension];return t[u]<i.obj[u]?n(i.left,i):n(i.right,i)}let l=n(this.root,null),h,e;if(l===null){this.root=new k(t,0,null);return}h=new k(t,(l.dimension+1)%r.length,l),e=r[l.dimension],t[e]<l.obj[e]?l.left=h:l.right=h},this.remove=function(t){let n;function l(e){if(e===null)return null;if(e.obj===t)return e;let i=r[e.dimension];return t[i]<e.obj[i]?l(e.left,e):l(e.right,e)}function h(e){let i,o,u;function b(j,v){let T,M,w,g,m;return j===null?null:(T=r[v],j.dimension===v?j.left!==null?b(j.left,v):j:(M=j.obj[T],w=b(j.left,v),g=b(j.right,v),m=j,w!==null&&w.obj[T]<M&&(m=w),g!==null&&g.obj[T]<m.obj[T]&&(m=g),m))}if(e.left===null&&e.right===null){if(e.parent===null){s.root=null;return}u=r[e.parent.dimension],e.obj[u]<e.parent.obj[u]?e.parent.left=null:e.parent.right=null;return}e.right!==null?(i=b(e.right,e.dimension),o=i.obj,h(i),e.obj=o):(i=b(e.left,e.dimension),o=i.obj,h(i),e.right=e.left,e.left=null,e.obj=o)}n=l(s.root),n!==null&&h(n)},this.nearest=function(t,n,l){let h,e,i;i=new S(function(u){return-u[1]});function o(u){let b,j=r[u.dimension],v=c(t,u.obj),T={},M,w,g;function m(D,F){i.push([D,F]),i.size()>n&&i.pop()}for(g=0;g<r.length;g+=1)g===u.dimension?T[r[g]]=t[r[g]]:T[r[g]]=u.obj[r[g]];if(M=c(T,u.obj),u.right===null&&u.left===null){(i.size()<n||v<i.peek()[1])&&m(u,v);return}u.right===null?b=u.left:u.left===null?b=u.right:t[j]<u.obj[j]?b=u.left:b=u.right,o(b),(i.size()<n||v<i.peek()[1])&&m(u,v),(i.size()<n||Math.abs(M)<i.peek()[1])&&(b===u.left?w=u.right:w=u.left,w!==null&&o(w))}if(l)for(h=0;h<n;h+=1)i.push([null,l]);for(s.root&&o(s.root),e=[],h=0;h<Math.min(n,i.content.length);h+=1)i.content[h][0]&&e.push([i.content[h][0].obj,i.content[h][1]]);return e},this.balanceFactor=function(){function t(l){return l===null?0:Math.max(t(l.left),t(l.right))+1}function n(l){return l===null?0:n(l.left)+n(l.right)+1}return t(s.root)/(Math.log(n(s.root))/Math.log(2))}}export{O as KDTree,S as KDTreeBinaryHeap};
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
