import * as e from "react";
import t, { useCallback as n, useEffect as r, useLayoutEffect as i, useMemo as a, useReducer as o, useRef as s, useState as c } from "react";
import * as l from "react-dom/client";
import { createRoot as u } from "react-dom/client";
import { flushSync as d } from "react-dom";
import { Fragment as f, jsx as p, jsxs as m } from "react/jsx-runtime";
//#region \0rolldown/runtime.js
var h = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports);
//#endregion
//#region node_modules/d3-array/src/max.js
function g(e, t) {
	let n;
	if (t === void 0) for (let t of e) t != null && (n < t || n === void 0 && t >= t) && (n = t);
	else {
		let r = -1;
		for (let i of e) (i = t(i, ++r, e)) != null && (n < i || n === void 0 && i >= i) && (n = i);
	}
	return n;
}
//#endregion
//#region node_modules/d3-array/src/min.js
function _(e, t) {
	let n;
	if (t === void 0) for (let t of e) t != null && (n > t || n === void 0 && t >= t) && (n = t);
	else {
		let r = -1;
		for (let i of e) (i = t(i, ++r, e)) != null && (n > i || n === void 0 && i >= i) && (n = i);
	}
	return n;
}
//#endregion
//#region node_modules/d3-array/src/mean.js
function v(e, t) {
	let n = 0, r = 0;
	if (t === void 0) for (let t of e) t != null && (t = +t) >= t && (++n, r += t);
	else {
		let i = -1;
		for (let a of e) (a = t(a, ++i, e)) != null && (a = +a) >= a && (++n, r += a);
	}
	if (n) return r / n;
}
//#endregion
//#region node_modules/d3-dispatch/src/dispatch.js
var y = { value: () => {} };
function b() {
	for (var e = 0, t = arguments.length, n = {}, r; e < t; ++e) {
		if (!(r = arguments[e] + "") || r in n || /[\s.]/.test(r)) throw Error("illegal type: " + r);
		n[r] = [];
	}
	return new x(n);
}
function x(e) {
	this._ = e;
}
function S(e, t) {
	return e.trim().split(/^|\s+/).map(function(e) {
		var n = "", r = e.indexOf(".");
		if (r >= 0 && (n = e.slice(r + 1), e = e.slice(0, r)), e && !t.hasOwnProperty(e)) throw Error("unknown type: " + e);
		return {
			type: e,
			name: n
		};
	});
}
x.prototype = b.prototype = {
	constructor: x,
	on: function(e, t) {
		var n = this._, r = S(e + "", n), i, a = -1, o = r.length;
		if (arguments.length < 2) {
			for (; ++a < o;) if ((i = (e = r[a]).type) && (i = C(n[i], e.name))) return i;
			return;
		}
		if (t != null && typeof t != "function") throw Error("invalid callback: " + t);
		for (; ++a < o;) if (i = (e = r[a]).type) n[i] = w(n[i], e.name, t);
		else if (t == null) for (i in n) n[i] = w(n[i], e.name, null);
		return this;
	},
	copy: function() {
		var e = {}, t = this._;
		for (var n in t) e[n] = t[n].slice();
		return new x(e);
	},
	call: function(e, t) {
		if ((i = arguments.length - 2) > 0) for (var n = Array(i), r = 0, i, a; r < i; ++r) n[r] = arguments[r + 2];
		if (!this._.hasOwnProperty(e)) throw Error("unknown type: " + e);
		for (a = this._[e], r = 0, i = a.length; r < i; ++r) a[r].value.apply(t, n);
	},
	apply: function(e, t, n) {
		if (!this._.hasOwnProperty(e)) throw Error("unknown type: " + e);
		for (var r = this._[e], i = 0, a = r.length; i < a; ++i) r[i].value.apply(t, n);
	}
};
function C(e, t) {
	for (var n = 0, r = e.length, i; n < r; ++n) if ((i = e[n]).name === t) return i.value;
}
function w(e, t, n) {
	for (var r = 0, i = e.length; r < i; ++r) if (e[r].name === t) {
		e[r] = y, e = e.slice(0, r).concat(e.slice(r + 1));
		break;
	}
	return n != null && e.push({
		name: t,
		value: n
	}), e;
}
var T = {
	svg: "http://www.w3.org/2000/svg",
	xhtml: "http://www.w3.org/1999/xhtml",
	xlink: "http://www.w3.org/1999/xlink",
	xml: "http://www.w3.org/XML/1998/namespace",
	xmlns: "http://www.w3.org/2000/xmlns/"
};
//#endregion
//#region node_modules/d3-selection/src/namespace.js
function E(e) {
	var t = e += "", n = t.indexOf(":");
	return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), T.hasOwnProperty(t) ? {
		space: T[t],
		local: e
	} : e;
}
//#endregion
//#region node_modules/d3-selection/src/creator.js
function D(e) {
	return function() {
		var t = this.ownerDocument, n = this.namespaceURI;
		return n === "http://www.w3.org/1999/xhtml" && t.documentElement.namespaceURI === "http://www.w3.org/1999/xhtml" ? t.createElement(e) : t.createElementNS(n, e);
	};
}
function O(e) {
	return function() {
		return this.ownerDocument.createElementNS(e.space, e.local);
	};
}
function k(e) {
	var t = E(e);
	return (t.local ? O : D)(t);
}
//#endregion
//#region node_modules/d3-selection/src/selector.js
function A() {}
function j(e) {
	return e == null ? A : function() {
		return this.querySelector(e);
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/select.js
function M(e) {
	typeof e != "function" && (e = j(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = Array(o), c, l, u = 0; u < o; ++u) (c = a[u]) && (l = e.call(c, c.__data__, u, a)) && ("__data__" in c && (l.__data__ = c.__data__), s[u] = l);
	return new jt(r, this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/array.js
function N(e) {
	return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
//#endregion
//#region node_modules/d3-selection/src/selectorAll.js
function P() {
	return [];
}
function F(e) {
	return e == null ? P : function() {
		return this.querySelectorAll(e);
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/selectAll.js
function I(e) {
	return function() {
		return N(e.apply(this, arguments));
	};
}
function L(e) {
	e = typeof e == "function" ? I(e) : F(e);
	for (var t = this._groups, n = t.length, r = [], i = [], a = 0; a < n; ++a) for (var o = t[a], s = o.length, c, l = 0; l < s; ++l) (c = o[l]) && (r.push(e.call(c, c.__data__, l, o)), i.push(c));
	return new jt(r, i);
}
//#endregion
//#region node_modules/d3-selection/src/matcher.js
function ee(e) {
	return function() {
		return this.matches(e);
	};
}
function te(e) {
	return function(t) {
		return t.matches(e);
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/selectChild.js
var ne = Array.prototype.find;
function re(e) {
	return function() {
		return ne.call(this.children, e);
	};
}
function ie() {
	return this.firstElementChild;
}
function ae(e) {
	return this.select(e == null ? ie : re(typeof e == "function" ? e : te(e)));
}
//#endregion
//#region node_modules/d3-selection/src/selection/selectChildren.js
var R = Array.prototype.filter;
function oe() {
	return Array.from(this.children);
}
function se(e) {
	return function() {
		return R.call(this.children, e);
	};
}
function z(e) {
	return this.selectAll(e == null ? oe : se(typeof e == "function" ? e : te(e)));
}
//#endregion
//#region node_modules/d3-selection/src/selection/filter.js
function ce(e) {
	typeof e != "function" && (e = ee(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = [], c, l = 0; l < o; ++l) (c = a[l]) && e.call(c, c.__data__, l, a) && s.push(c);
	return new jt(r, this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/selection/sparse.js
function le(e) {
	return Array(e.length);
}
//#endregion
//#region node_modules/d3-selection/src/selection/enter.js
function ue() {
	return new jt(this._enter || this._groups.map(le), this._parents);
}
function de(e, t) {
	this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
de.prototype = {
	constructor: de,
	appendChild: function(e) {
		return this._parent.insertBefore(e, this._next);
	},
	insertBefore: function(e, t) {
		return this._parent.insertBefore(e, t);
	},
	querySelector: function(e) {
		return this._parent.querySelector(e);
	},
	querySelectorAll: function(e) {
		return this._parent.querySelectorAll(e);
	}
};
//#endregion
//#region node_modules/d3-selection/src/constant.js
function fe(e) {
	return function() {
		return e;
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/data.js
function pe(e, t, n, r, i, a) {
	for (var o = 0, s, c = t.length, l = a.length; o < l; ++o) (s = t[o]) ? (s.__data__ = a[o], r[o] = s) : n[o] = new de(e, a[o]);
	for (; o < c; ++o) (s = t[o]) && (i[o] = s);
}
function me(e, t, n, r, i, a, o) {
	var s, c, l = /* @__PURE__ */ new Map(), u = t.length, d = a.length, f = Array(u), p;
	for (s = 0; s < u; ++s) (c = t[s]) && (f[s] = p = o.call(c, c.__data__, s, t) + "", l.has(p) ? i[s] = c : l.set(p, c));
	for (s = 0; s < d; ++s) p = o.call(e, a[s], s, a) + "", (c = l.get(p)) ? (r[s] = c, c.__data__ = a[s], l.delete(p)) : n[s] = new de(e, a[s]);
	for (s = 0; s < u; ++s) (c = t[s]) && l.get(f[s]) === c && (i[s] = c);
}
function he(e) {
	return e.__data__;
}
function B(e, t) {
	if (!arguments.length) return Array.from(this, he);
	var n = t ? me : pe, r = this._parents, i = this._groups;
	typeof e != "function" && (e = fe(e));
	for (var a = i.length, o = Array(a), s = Array(a), c = Array(a), l = 0; l < a; ++l) {
		var u = r[l], d = i[l], f = d.length, p = ge(e.call(u, u && u.__data__, l, r)), m = p.length, h = s[l] = Array(m), g = o[l] = Array(m);
		n(u, d, h, g, c[l] = Array(f), p, t);
		for (var _ = 0, v = 0, y, b; _ < m; ++_) if (y = h[_]) {
			for (_ >= v && (v = _ + 1); !(b = g[v]) && ++v < m;);
			y._next = b || null;
		}
	}
	return o = new jt(o, r), o._enter = s, o._exit = c, o;
}
function ge(e) {
	return typeof e == "object" && "length" in e ? e : Array.from(e);
}
//#endregion
//#region node_modules/d3-selection/src/selection/exit.js
function _e() {
	return new jt(this._exit || this._groups.map(le), this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/selection/join.js
function ve(e, t, n) {
	var r = this.enter(), i = this, a = this.exit();
	return typeof e == "function" ? (r = e(r), r &&= r.selection()) : r = r.append(e + ""), t != null && (i = t(i), i &&= i.selection()), n == null ? a.remove() : n(a), r && i ? r.merge(i).order() : i;
}
//#endregion
//#region node_modules/d3-selection/src/selection/merge.js
function ye(e) {
	for (var t = e.selection ? e.selection() : e, n = this._groups, r = t._groups, i = n.length, a = r.length, o = Math.min(i, a), s = Array(i), c = 0; c < o; ++c) for (var l = n[c], u = r[c], d = l.length, f = s[c] = Array(d), p, m = 0; m < d; ++m) (p = l[m] || u[m]) && (f[m] = p);
	for (; c < i; ++c) s[c] = n[c];
	return new jt(s, this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/selection/order.js
function be() {
	for (var e = this._groups, t = -1, n = e.length; ++t < n;) for (var r = e[t], i = r.length - 1, a = r[i], o; --i >= 0;) (o = r[i]) && (a && o.compareDocumentPosition(a) ^ 4 && a.parentNode.insertBefore(o, a), a = o);
	return this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/sort.js
function xe(e) {
	e ||= Se;
	function t(t, n) {
		return t && n ? e(t.__data__, n.__data__) : !t - !n;
	}
	for (var n = this._groups, r = n.length, i = Array(r), a = 0; a < r; ++a) {
		for (var o = n[a], s = o.length, c = i[a] = Array(s), l, u = 0; u < s; ++u) (l = o[u]) && (c[u] = l);
		c.sort(t);
	}
	return new jt(i, this._parents).order();
}
function Se(e, t) {
	return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
//#endregion
//#region node_modules/d3-selection/src/selection/call.js
function Ce() {
	var e = arguments[0];
	return arguments[0] = this, e.apply(null, arguments), this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/nodes.js
function V() {
	return Array.from(this);
}
//#endregion
//#region node_modules/d3-selection/src/selection/node.js
function we() {
	for (var e = this._groups, t = 0, n = e.length; t < n; ++t) for (var r = e[t], i = 0, a = r.length; i < a; ++i) {
		var o = r[i];
		if (o) return o;
	}
	return null;
}
//#endregion
//#region node_modules/d3-selection/src/selection/size.js
function Te() {
	let e = 0;
	for (let t of this) ++e;
	return e;
}
//#endregion
//#region node_modules/d3-selection/src/selection/empty.js
function Ee() {
	return !this.node();
}
//#endregion
//#region node_modules/d3-selection/src/selection/each.js
function De(e) {
	for (var t = this._groups, n = 0, r = t.length; n < r; ++n) for (var i = t[n], a = 0, o = i.length, s; a < o; ++a) (s = i[a]) && e.call(s, s.__data__, a, i);
	return this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/attr.js
function Oe(e) {
	return function() {
		this.removeAttribute(e);
	};
}
function ke(e) {
	return function() {
		this.removeAttributeNS(e.space, e.local);
	};
}
function Ae(e, t) {
	return function() {
		this.setAttribute(e, t);
	};
}
function je(e, t) {
	return function() {
		this.setAttributeNS(e.space, e.local, t);
	};
}
function Me(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
	};
}
function Ne(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
	};
}
function Pe(e, t) {
	var n = E(e);
	if (arguments.length < 2) {
		var r = this.node();
		return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
	}
	return this.each((t == null ? n.local ? ke : Oe : typeof t == "function" ? n.local ? Ne : Me : n.local ? je : Ae)(n, t));
}
//#endregion
//#region node_modules/d3-selection/src/window.js
function Fe(e) {
	return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
//#endregion
//#region node_modules/d3-selection/src/selection/style.js
function Ie(e) {
	return function() {
		this.style.removeProperty(e);
	};
}
function Le(e, t, n) {
	return function() {
		this.style.setProperty(e, t, n);
	};
}
function Re(e, t, n) {
	return function() {
		var r = t.apply(this, arguments);
		r == null ? this.style.removeProperty(e) : this.style.setProperty(e, r, n);
	};
}
function ze(e, t, n) {
	return arguments.length > 1 ? this.each((t == null ? Ie : typeof t == "function" ? Re : Le)(e, t, n ?? "")) : Be(this.node(), e);
}
function Be(e, t) {
	return e.style.getPropertyValue(t) || Fe(e).getComputedStyle(e, null).getPropertyValue(t);
}
//#endregion
//#region node_modules/d3-selection/src/selection/property.js
function Ve(e) {
	return function() {
		delete this[e];
	};
}
function He(e, t) {
	return function() {
		this[e] = t;
	};
}
function Ue(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? delete this[e] : this[e] = n;
	};
}
function We(e, t) {
	return arguments.length > 1 ? this.each((t == null ? Ve : typeof t == "function" ? Ue : He)(e, t)) : this.node()[e];
}
//#endregion
//#region node_modules/d3-selection/src/selection/classed.js
function Ge(e) {
	return e.trim().split(/^|\s+/);
}
function Ke(e) {
	return e.classList || new qe(e);
}
function qe(e) {
	this._node = e, this._names = Ge(e.getAttribute("class") || "");
}
qe.prototype = {
	add: function(e) {
		this._names.indexOf(e) < 0 && (this._names.push(e), this._node.setAttribute("class", this._names.join(" ")));
	},
	remove: function(e) {
		var t = this._names.indexOf(e);
		t >= 0 && (this._names.splice(t, 1), this._node.setAttribute("class", this._names.join(" ")));
	},
	contains: function(e) {
		return this._names.indexOf(e) >= 0;
	}
};
function Je(e, t) {
	for (var n = Ke(e), r = -1, i = t.length; ++r < i;) n.add(t[r]);
}
function Ye(e, t) {
	for (var n = Ke(e), r = -1, i = t.length; ++r < i;) n.remove(t[r]);
}
function Xe(e) {
	return function() {
		Je(this, e);
	};
}
function Ze(e) {
	return function() {
		Ye(this, e);
	};
}
function Qe(e, t) {
	return function() {
		(t.apply(this, arguments) ? Je : Ye)(this, e);
	};
}
function $e(e, t) {
	var n = Ge(e + "");
	if (arguments.length < 2) {
		for (var r = Ke(this.node()), i = -1, a = n.length; ++i < a;) if (!r.contains(n[i])) return !1;
		return !0;
	}
	return this.each((typeof t == "function" ? Qe : t ? Xe : Ze)(n, t));
}
//#endregion
//#region node_modules/d3-selection/src/selection/text.js
function et() {
	this.textContent = "";
}
function tt(e) {
	return function() {
		this.textContent = e;
	};
}
function nt(e) {
	return function() {
		var t = e.apply(this, arguments);
		this.textContent = t ?? "";
	};
}
function rt(e) {
	return arguments.length ? this.each(e == null ? et : (typeof e == "function" ? nt : tt)(e)) : this.node().textContent;
}
//#endregion
//#region node_modules/d3-selection/src/selection/html.js
function it() {
	this.innerHTML = "";
}
function at(e) {
	return function() {
		this.innerHTML = e;
	};
}
function ot(e) {
	return function() {
		var t = e.apply(this, arguments);
		this.innerHTML = t ?? "";
	};
}
function st(e) {
	return arguments.length ? this.each(e == null ? it : (typeof e == "function" ? ot : at)(e)) : this.node().innerHTML;
}
//#endregion
//#region node_modules/d3-selection/src/selection/raise.js
function ct() {
	this.nextSibling && this.parentNode.appendChild(this);
}
function lt() {
	return this.each(ct);
}
//#endregion
//#region node_modules/d3-selection/src/selection/lower.js
function ut() {
	this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function dt() {
	return this.each(ut);
}
//#endregion
//#region node_modules/d3-selection/src/selection/append.js
function ft(e) {
	var t = typeof e == "function" ? e : k(e);
	return this.select(function() {
		return this.appendChild(t.apply(this, arguments));
	});
}
//#endregion
//#region node_modules/d3-selection/src/selection/insert.js
function pt() {
	return null;
}
function mt(e, t) {
	var n = typeof e == "function" ? e : k(e), r = t == null ? pt : typeof t == "function" ? t : j(t);
	return this.select(function() {
		return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
	});
}
//#endregion
//#region node_modules/d3-selection/src/selection/remove.js
function ht() {
	var e = this.parentNode;
	e && e.removeChild(this);
}
function H() {
	return this.each(ht);
}
//#endregion
//#region node_modules/d3-selection/src/selection/clone.js
function gt() {
	var e = this.cloneNode(!1), t = this.parentNode;
	return t ? t.insertBefore(e, this.nextSibling) : e;
}
function _t() {
	var e = this.cloneNode(!0), t = this.parentNode;
	return t ? t.insertBefore(e, this.nextSibling) : e;
}
function vt(e) {
	return this.select(e ? _t : gt);
}
//#endregion
//#region node_modules/d3-selection/src/selection/datum.js
function yt(e) {
	return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
//#endregion
//#region node_modules/d3-selection/src/selection/on.js
function bt(e) {
	return function(t) {
		e.call(this, t, this.__data__);
	};
}
function xt(e) {
	return e.trim().split(/^|\s+/).map(function(e) {
		var t = "", n = e.indexOf(".");
		return n >= 0 && (t = e.slice(n + 1), e = e.slice(0, n)), {
			type: e,
			name: t
		};
	});
}
function St(e) {
	return function() {
		var t = this.__on;
		if (t) {
			for (var n = 0, r = -1, i = t.length, a; n < i; ++n) a = t[n], (!e.type || a.type === e.type) && a.name === e.name ? this.removeEventListener(a.type, a.listener, a.options) : t[++r] = a;
			++r ? t.length = r : delete this.__on;
		}
	};
}
function Ct(e, t, n) {
	return function() {
		var r = this.__on, i, a = bt(t);
		if (r) {
			for (var o = 0, s = r.length; o < s; ++o) if ((i = r[o]).type === e.type && i.name === e.name) {
				this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, i.listener = a, i.options = n), i.value = t;
				return;
			}
		}
		this.addEventListener(e.type, a, n), i = {
			type: e.type,
			name: e.name,
			value: t,
			listener: a,
			options: n
		}, r ? r.push(i) : this.__on = [i];
	};
}
function wt(e, t, n) {
	var r = xt(e + ""), i, a = r.length, o;
	if (arguments.length < 2) {
		var s = this.node().__on;
		if (s) {
			for (var c = 0, l = s.length, u; c < l; ++c) for (i = 0, u = s[c]; i < a; ++i) if ((o = r[i]).type === u.type && o.name === u.name) return u.value;
		}
		return;
	}
	for (s = t ? Ct : St, i = 0; i < a; ++i) this.each(s(r[i], t, n));
	return this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/dispatch.js
function Tt(e, t, n) {
	var r = Fe(e), i = r.CustomEvent;
	typeof i == "function" ? i = new i(t, n) : (i = r.document.createEvent("Event"), n ? (i.initEvent(t, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(t, !1, !1)), e.dispatchEvent(i);
}
function Et(e, t) {
	return function() {
		return Tt(this, e, t);
	};
}
function Dt(e, t) {
	return function() {
		return Tt(this, e, t.apply(this, arguments));
	};
}
function Ot(e, t) {
	return this.each((typeof t == "function" ? Dt : Et)(e, t));
}
//#endregion
//#region node_modules/d3-selection/src/selection/iterator.js
function* kt() {
	for (var e = this._groups, t = 0, n = e.length; t < n; ++t) for (var r = e[t], i = 0, a = r.length, o; i < a; ++i) (o = r[i]) && (yield o);
}
//#endregion
//#region node_modules/d3-selection/src/selection/index.js
var At = [null];
function jt(e, t) {
	this._groups = e, this._parents = t;
}
function Mt() {
	return new jt([[document.documentElement]], At);
}
function Nt() {
	return this;
}
jt.prototype = Mt.prototype = {
	constructor: jt,
	select: M,
	selectAll: L,
	selectChild: ae,
	selectChildren: z,
	filter: ce,
	data: B,
	enter: ue,
	exit: _e,
	join: ve,
	merge: ye,
	selection: Nt,
	order: be,
	sort: xe,
	call: Ce,
	nodes: V,
	node: we,
	size: Te,
	empty: Ee,
	each: De,
	attr: Pe,
	style: ze,
	property: We,
	classed: $e,
	text: rt,
	html: st,
	raise: lt,
	lower: dt,
	append: ft,
	insert: mt,
	remove: H,
	clone: vt,
	datum: yt,
	on: wt,
	dispatch: Ot,
	[Symbol.iterator]: kt
};
//#endregion
//#region node_modules/d3-selection/src/select.js
function U(e) {
	return typeof e == "string" ? new jt([[document.querySelector(e)]], [document.documentElement]) : new jt([[e]], At);
}
//#endregion
//#region node_modules/d3-selection/src/sourceEvent.js
function Pt(e) {
	let t;
	for (; t = e.sourceEvent;) e = t;
	return e;
}
//#endregion
//#region node_modules/d3-selection/src/pointer.js
function Ft(e, t) {
	if (e = Pt(e), t === void 0 && (t = e.currentTarget), t) {
		var n = t.ownerSVGElement || t;
		if (n.createSVGPoint) {
			var r = n.createSVGPoint();
			return r.x = e.clientX, r.y = e.clientY, r = r.matrixTransform(t.getScreenCTM().inverse()), [r.x, r.y];
		}
		if (t.getBoundingClientRect) {
			var i = t.getBoundingClientRect();
			return [e.clientX - i.left - t.clientLeft, e.clientY - i.top - t.clientTop];
		}
	}
	return [e.pageX, e.pageY];
}
//#endregion
//#region node_modules/d3-drag/src/noevent.js
var It = { passive: !1 }, Lt = {
	capture: !0,
	passive: !1
};
function Rt(e) {
	e.stopImmediatePropagation();
}
function zt(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region node_modules/d3-drag/src/nodrag.js
function Bt(e) {
	var t = e.document.documentElement, n = U(e).on("dragstart.drag", zt, Lt);
	"onselectstart" in t ? n.on("selectstart.drag", zt, Lt) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function Vt(e, t) {
	var n = e.document.documentElement, r = U(e).on("dragstart.drag", null);
	t && (r.on("click.drag", zt, Lt), setTimeout(function() {
		r.on("click.drag", null);
	}, 0)), "onselectstart" in n ? r.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
//#endregion
//#region node_modules/d3-drag/src/constant.js
var Ht = (e) => () => e;
//#endregion
//#region node_modules/d3-drag/src/event.js
function Ut(e, { sourceEvent: t, subject: n, target: r, identifier: i, active: a, x: o, y: s, dx: c, dy: l, dispatch: u }) {
	Object.defineProperties(this, {
		type: {
			value: e,
			enumerable: !0,
			configurable: !0
		},
		sourceEvent: {
			value: t,
			enumerable: !0,
			configurable: !0
		},
		subject: {
			value: n,
			enumerable: !0,
			configurable: !0
		},
		target: {
			value: r,
			enumerable: !0,
			configurable: !0
		},
		identifier: {
			value: i,
			enumerable: !0,
			configurable: !0
		},
		active: {
			value: a,
			enumerable: !0,
			configurable: !0
		},
		x: {
			value: o,
			enumerable: !0,
			configurable: !0
		},
		y: {
			value: s,
			enumerable: !0,
			configurable: !0
		},
		dx: {
			value: c,
			enumerable: !0,
			configurable: !0
		},
		dy: {
			value: l,
			enumerable: !0,
			configurable: !0
		},
		_: { value: u }
	});
}
Ut.prototype.on = function() {
	var e = this._.on.apply(this._, arguments);
	return e === this._ ? this : e;
};
//#endregion
//#region node_modules/d3-drag/src/drag.js
function Wt(e) {
	return !e.ctrlKey && !e.button;
}
function Gt() {
	return this.parentNode;
}
function Kt(e, t) {
	return t ?? {
		x: e.x,
		y: e.y
	};
}
function qt() {
	return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Jt() {
	var e = Wt, t = Gt, n = Kt, r = qt, i = {}, a = b("start", "drag", "end"), o = 0, s, c, l, u, d = 0;
	function f(e) {
		e.on("mousedown.drag", p).filter(r).on("touchstart.drag", g).on("touchmove.drag", _, It).on("touchend.drag touchcancel.drag", v).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	}
	function p(n, r) {
		if (!(u || !e.call(this, n, r))) {
			var i = y(this, t.call(this, n, r), n, r, "mouse");
			i && (U(n.view).on("mousemove.drag", m, Lt).on("mouseup.drag", h, Lt), Bt(n.view), Rt(n), l = !1, s = n.clientX, c = n.clientY, i("start", n));
		}
	}
	function m(e) {
		if (zt(e), !l) {
			var t = e.clientX - s, n = e.clientY - c;
			l = t * t + n * n > d;
		}
		i.mouse("drag", e);
	}
	function h(e) {
		U(e.view).on("mousemove.drag mouseup.drag", null), Vt(e.view, l), zt(e), i.mouse("end", e);
	}
	function g(n, r) {
		if (e.call(this, n, r)) {
			var i = n.changedTouches, a = t.call(this, n, r), o = i.length, s, c;
			for (s = 0; s < o; ++s) (c = y(this, a, n, r, i[s].identifier, i[s])) && (Rt(n), c("start", n, i[s]));
		}
	}
	function _(e) {
		var t = e.changedTouches, n = t.length, r, a;
		for (r = 0; r < n; ++r) (a = i[t[r].identifier]) && (zt(e), a("drag", e, t[r]));
	}
	function v(e) {
		var t = e.changedTouches, n = t.length, r, a;
		for (u && clearTimeout(u), u = setTimeout(function() {
			u = null;
		}, 500), r = 0; r < n; ++r) (a = i[t[r].identifier]) && (Rt(e), a("end", e, t[r]));
	}
	function y(e, t, r, s, c, l) {
		var u = a.copy(), d = Ft(l || r, t), p, m, h;
		if ((h = n.call(e, new Ut("beforestart", {
			sourceEvent: r,
			target: f,
			identifier: c,
			active: o,
			x: d[0],
			y: d[1],
			dx: 0,
			dy: 0,
			dispatch: u
		}), s)) != null) return p = h.x - d[0] || 0, m = h.y - d[1] || 0, function n(r, a, l) {
			var g = d, _;
			switch (r) {
				case "start":
					i[c] = n, _ = o++;
					break;
				case "end": delete i[c], --o;
				case "drag":
					d = Ft(l || a, t), _ = o;
					break;
			}
			u.call(r, e, new Ut(r, {
				sourceEvent: a,
				subject: h,
				target: f,
				identifier: c,
				active: _,
				x: d[0] + p,
				y: d[1] + m,
				dx: d[0] - g[0],
				dy: d[1] - g[1],
				dispatch: u
			}), s);
		};
	}
	return f.filter = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : Ht(!!t), f) : e;
	}, f.container = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : Ht(e), f) : t;
	}, f.subject = function(e) {
		return arguments.length ? (n = typeof e == "function" ? e : Ht(e), f) : n;
	}, f.touchable = function(e) {
		return arguments.length ? (r = typeof e == "function" ? e : Ht(!!e), f) : r;
	}, f.on = function() {
		var e = a.on.apply(a, arguments);
		return e === a ? f : e;
	}, f.clickDistance = function(e) {
		return arguments.length ? (d = (e = +e) * e, f) : Math.sqrt(d);
	}, f;
}
//#endregion
//#region node_modules/d3-color/src/define.js
function Yt(e, t, n) {
	e.prototype = t.prototype = n, n.constructor = e;
}
function Xt(e, t) {
	var n = Object.create(e.prototype);
	for (var r in t) n[r] = t[r];
	return n;
}
//#endregion
//#region node_modules/d3-color/src/color.js
function Zt() {}
var Qt = .7, $t = 1 / Qt, en = "\\s*([+-]?\\d+)\\s*", tn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", nn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", rn = /^#([0-9a-f]{3,8})$/, an = RegExp(`^rgb\\(${en},${en},${en}\\)$`), on = RegExp(`^rgb\\(${nn},${nn},${nn}\\)$`), sn = RegExp(`^rgba\\(${en},${en},${en},${tn}\\)$`), cn = RegExp(`^rgba\\(${nn},${nn},${nn},${tn}\\)$`), ln = RegExp(`^hsl\\(${tn},${nn},${nn}\\)$`), un = RegExp(`^hsla\\(${tn},${nn},${nn},${tn}\\)$`), dn = {
	aliceblue: 15792383,
	antiquewhite: 16444375,
	aqua: 65535,
	aquamarine: 8388564,
	azure: 15794175,
	beige: 16119260,
	bisque: 16770244,
	black: 0,
	blanchedalmond: 16772045,
	blue: 255,
	blueviolet: 9055202,
	brown: 10824234,
	burlywood: 14596231,
	cadetblue: 6266528,
	chartreuse: 8388352,
	chocolate: 13789470,
	coral: 16744272,
	cornflowerblue: 6591981,
	cornsilk: 16775388,
	crimson: 14423100,
	cyan: 65535,
	darkblue: 139,
	darkcyan: 35723,
	darkgoldenrod: 12092939,
	darkgray: 11119017,
	darkgreen: 25600,
	darkgrey: 11119017,
	darkkhaki: 12433259,
	darkmagenta: 9109643,
	darkolivegreen: 5597999,
	darkorange: 16747520,
	darkorchid: 10040012,
	darkred: 9109504,
	darksalmon: 15308410,
	darkseagreen: 9419919,
	darkslateblue: 4734347,
	darkslategray: 3100495,
	darkslategrey: 3100495,
	darkturquoise: 52945,
	darkviolet: 9699539,
	deeppink: 16716947,
	deepskyblue: 49151,
	dimgray: 6908265,
	dimgrey: 6908265,
	dodgerblue: 2003199,
	firebrick: 11674146,
	floralwhite: 16775920,
	forestgreen: 2263842,
	fuchsia: 16711935,
	gainsboro: 14474460,
	ghostwhite: 16316671,
	gold: 16766720,
	goldenrod: 14329120,
	gray: 8421504,
	green: 32768,
	greenyellow: 11403055,
	grey: 8421504,
	honeydew: 15794160,
	hotpink: 16738740,
	indianred: 13458524,
	indigo: 4915330,
	ivory: 16777200,
	khaki: 15787660,
	lavender: 15132410,
	lavenderblush: 16773365,
	lawngreen: 8190976,
	lemonchiffon: 16775885,
	lightblue: 11393254,
	lightcoral: 15761536,
	lightcyan: 14745599,
	lightgoldenrodyellow: 16448210,
	lightgray: 13882323,
	lightgreen: 9498256,
	lightgrey: 13882323,
	lightpink: 16758465,
	lightsalmon: 16752762,
	lightseagreen: 2142890,
	lightskyblue: 8900346,
	lightslategray: 7833753,
	lightslategrey: 7833753,
	lightsteelblue: 11584734,
	lightyellow: 16777184,
	lime: 65280,
	limegreen: 3329330,
	linen: 16445670,
	magenta: 16711935,
	maroon: 8388608,
	mediumaquamarine: 6737322,
	mediumblue: 205,
	mediumorchid: 12211667,
	mediumpurple: 9662683,
	mediumseagreen: 3978097,
	mediumslateblue: 8087790,
	mediumspringgreen: 64154,
	mediumturquoise: 4772300,
	mediumvioletred: 13047173,
	midnightblue: 1644912,
	mintcream: 16121850,
	mistyrose: 16770273,
	moccasin: 16770229,
	navajowhite: 16768685,
	navy: 128,
	oldlace: 16643558,
	olive: 8421376,
	olivedrab: 7048739,
	orange: 16753920,
	orangered: 16729344,
	orchid: 14315734,
	palegoldenrod: 15657130,
	palegreen: 10025880,
	paleturquoise: 11529966,
	palevioletred: 14381203,
	papayawhip: 16773077,
	peachpuff: 16767673,
	peru: 13468991,
	pink: 16761035,
	plum: 14524637,
	powderblue: 11591910,
	purple: 8388736,
	rebeccapurple: 6697881,
	red: 16711680,
	rosybrown: 12357519,
	royalblue: 4286945,
	saddlebrown: 9127187,
	salmon: 16416882,
	sandybrown: 16032864,
	seagreen: 3050327,
	seashell: 16774638,
	sienna: 10506797,
	silver: 12632256,
	skyblue: 8900331,
	slateblue: 6970061,
	slategray: 7372944,
	slategrey: 7372944,
	snow: 16775930,
	springgreen: 65407,
	steelblue: 4620980,
	tan: 13808780,
	teal: 32896,
	thistle: 14204888,
	tomato: 16737095,
	turquoise: 4251856,
	violet: 15631086,
	wheat: 16113331,
	white: 16777215,
	whitesmoke: 16119285,
	yellow: 16776960,
	yellowgreen: 10145074
};
Yt(Zt, gn, {
	copy(e) {
		return Object.assign(new this.constructor(), this, e);
	},
	displayable() {
		return this.rgb().displayable();
	},
	hex: fn,
	formatHex: fn,
	formatHex8: pn,
	formatHsl: mn,
	formatRgb: hn,
	toString: hn
});
function fn() {
	return this.rgb().formatHex();
}
function pn() {
	return this.rgb().formatHex8();
}
function mn() {
	return Dn(this).formatHsl();
}
function hn() {
	return this.rgb().formatRgb();
}
function gn(e) {
	var t, n;
	return e = (e + "").trim().toLowerCase(), (t = rn.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? _n(t) : n === 3 ? new bn(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? vn(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? vn(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = an.exec(e)) ? new bn(t[1], t[2], t[3], 1) : (t = on.exec(e)) ? new bn(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = sn.exec(e)) ? vn(t[1], t[2], t[3], t[4]) : (t = cn.exec(e)) ? vn(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = ln.exec(e)) ? En(t[1], t[2] / 100, t[3] / 100, 1) : (t = un.exec(e)) ? En(t[1], t[2] / 100, t[3] / 100, t[4]) : dn.hasOwnProperty(e) ? _n(dn[e]) : e === "transparent" ? new bn(NaN, NaN, NaN, 0) : null;
}
function _n(e) {
	return new bn(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function vn(e, t, n, r) {
	return r <= 0 && (e = t = n = NaN), new bn(e, t, n, r);
}
function W(e) {
	return e instanceof Zt || (e = gn(e)), e ? (e = e.rgb(), new bn(e.r, e.g, e.b, e.opacity)) : new bn();
}
function yn(e, t, n, r) {
	return arguments.length === 1 ? W(e) : new bn(e, t, n, r ?? 1);
}
function bn(e, t, n, r) {
	this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
Yt(bn, yn, Xt(Zt, {
	brighter(e) {
		return e = e == null ? $t : $t ** +e, new bn(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? Qt : Qt ** +e, new bn(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	rgb() {
		return this;
	},
	clamp() {
		return new bn(G(this.r), G(this.g), G(this.b), wn(this.opacity));
	},
	displayable() {
		return -.5 <= this.r && this.r < 255.5 && -.5 <= this.g && this.g < 255.5 && -.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
	},
	hex: xn,
	formatHex: xn,
	formatHex8: Sn,
	formatRgb: Cn,
	toString: Cn
}));
function xn() {
	return `#${Tn(this.r)}${Tn(this.g)}${Tn(this.b)}`;
}
function Sn() {
	return `#${Tn(this.r)}${Tn(this.g)}${Tn(this.b)}${Tn((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Cn() {
	let e = wn(this.opacity);
	return `${e === 1 ? "rgb(" : "rgba("}${G(this.r)}, ${G(this.g)}, ${G(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function wn(e) {
	return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function G(e) {
	return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function Tn(e) {
	return e = G(e), (e < 16 ? "0" : "") + e.toString(16);
}
function En(e, t, n, r) {
	return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new kn(e, t, n, r);
}
function Dn(e) {
	if (e instanceof kn) return new kn(e.h, e.s, e.l, e.opacity);
	if (e instanceof Zt || (e = gn(e)), !e) return new kn();
	if (e instanceof kn) return e;
	e = e.rgb();
	var t = e.r / 255, n = e.g / 255, r = e.b / 255, i = Math.min(t, n, r), a = Math.max(t, n, r), o = NaN, s = a - i, c = (a + i) / 2;
	return s ? (o = t === a ? (n - r) / s + (n < r) * 6 : n === a ? (r - t) / s + 2 : (t - n) / s + 4, s /= c < .5 ? a + i : 2 - a - i, o *= 60) : s = c > 0 && c < 1 ? 0 : o, new kn(o, s, c, e.opacity);
}
function On(e, t, n, r) {
	return arguments.length === 1 ? Dn(e) : new kn(e, t, n, r ?? 1);
}
function kn(e, t, n, r) {
	this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
Yt(kn, On, Xt(Zt, {
	brighter(e) {
		return e = e == null ? $t : $t ** +e, new kn(this.h, this.s, this.l * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? Qt : Qt ** +e, new kn(this.h, this.s, this.l * e, this.opacity);
	},
	rgb() {
		var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < .5 ? n : 1 - n) * t, i = 2 * n - r;
		return new bn(Mn(e >= 240 ? e - 240 : e + 120, i, r), Mn(e, i, r), Mn(e < 120 ? e + 240 : e - 120, i, r), this.opacity);
	},
	clamp() {
		return new kn(An(this.h), jn(this.s), jn(this.l), wn(this.opacity));
	},
	displayable() {
		return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
	},
	formatHsl() {
		let e = wn(this.opacity);
		return `${e === 1 ? "hsl(" : "hsla("}${An(this.h)}, ${jn(this.s) * 100}%, ${jn(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
	}
}));
function An(e) {
	return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function jn(e) {
	return Math.max(0, Math.min(1, e || 0));
}
function Mn(e, t, n) {
	return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
//#endregion
//#region node_modules/d3-interpolate/src/constant.js
var Nn = (e) => () => e;
//#endregion
//#region node_modules/d3-interpolate/src/color.js
function Pn(e, t) {
	return function(n) {
		return e + n * t;
	};
}
function Fn(e, t, n) {
	return e **= +n, t = t ** +n - e, n = 1 / n, function(r) {
		return (e + r * t) ** +n;
	};
}
function In(e) {
	return (e = +e) == 1 ? Ln : function(t, n) {
		return n - t ? Fn(t, n, e) : Nn(isNaN(t) ? n : t);
	};
}
function Ln(e, t) {
	var n = t - e;
	return n ? Pn(e, n) : Nn(isNaN(e) ? t : e);
}
//#endregion
//#region node_modules/d3-interpolate/src/rgb.js
var Rn = (function e(t) {
	var n = In(t);
	function r(e, t) {
		var r = n((e = yn(e)).r, (t = yn(t)).r), i = n(e.g, t.g), a = n(e.b, t.b), o = Ln(e.opacity, t.opacity);
		return function(t) {
			return e.r = r(t), e.g = i(t), e.b = a(t), e.opacity = o(t), e + "";
		};
	}
	return r.gamma = e, r;
})(1);
//#endregion
//#region node_modules/d3-interpolate/src/numberArray.js
function zn(e, t) {
	t ||= [];
	var n = e ? Math.min(t.length, e.length) : 0, r = t.slice(), i;
	return function(a) {
		for (i = 0; i < n; ++i) r[i] = e[i] * (1 - a) + t[i] * a;
		return r;
	};
}
function Bn(e) {
	return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
//#endregion
//#region node_modules/d3-interpolate/src/array.js
function Vn(e, t) {
	var n = t ? t.length : 0, r = e ? Math.min(n, e.length) : 0, i = Array(r), a = Array(n), o;
	for (o = 0; o < r; ++o) i[o] = Xn(e[o], t[o]);
	for (; o < n; ++o) a[o] = t[o];
	return function(e) {
		for (o = 0; o < r; ++o) a[o] = i[o](e);
		return a;
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/date.js
function Hn(e, t) {
	var n = /* @__PURE__ */ new Date();
	return e = +e, t = +t, function(r) {
		return n.setTime(e * (1 - r) + t * r), n;
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/number.js
function Un(e, t) {
	return e = +e, t = +t, function(n) {
		return e * (1 - n) + t * n;
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/object.js
function Wn(e, t) {
	var n = {}, r = {}, i;
	for (i in (typeof e != "object" || !e) && (e = {}), (typeof t != "object" || !t) && (t = {}), t) i in e ? n[i] = Xn(e[i], t[i]) : r[i] = t[i];
	return function(e) {
		for (i in n) r[i] = n[i](e);
		return r;
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/string.js
var Gn = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Kn = new RegExp(Gn.source, "g");
function qn(e) {
	return function() {
		return e;
	};
}
function Jn(e) {
	return function(t) {
		return e(t) + "";
	};
}
function Yn(e, t) {
	var n = Gn.lastIndex = Kn.lastIndex = 0, r, i, a, o = -1, s = [], c = [];
	for (e += "", t += ""; (r = Gn.exec(e)) && (i = Kn.exec(t));) (a = i.index) > n && (a = t.slice(n, a), s[o] ? s[o] += a : s[++o] = a), (r = r[0]) === (i = i[0]) ? s[o] ? s[o] += i : s[++o] = i : (s[++o] = null, c.push({
		i: o,
		x: Un(r, i)
	})), n = Kn.lastIndex;
	return n < t.length && (a = t.slice(n), s[o] ? s[o] += a : s[++o] = a), s.length < 2 ? c[0] ? Jn(c[0].x) : qn(t) : (t = c.length, function(e) {
		for (var n = 0, r; n < t; ++n) s[(r = c[n]).i] = r.x(e);
		return s.join("");
	});
}
//#endregion
//#region node_modules/d3-interpolate/src/value.js
function Xn(e, t) {
	var n = typeof t, r;
	return t == null || n === "boolean" ? Nn(t) : (n === "number" ? Un : n === "string" ? (r = gn(t)) ? (t = r, Rn) : Yn : t instanceof gn ? Rn : t instanceof Date ? Hn : Bn(t) ? zn : Array.isArray(t) ? Vn : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? Wn : Un)(e, t);
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/decompose.js
var Zn = 180 / Math.PI, Qn = {
	translateX: 0,
	translateY: 0,
	rotate: 0,
	skewX: 0,
	scaleX: 1,
	scaleY: 1
};
function $n(e, t, n, r, i, a) {
	var o, s, c;
	return (o = Math.sqrt(e * e + t * t)) && (e /= o, t /= o), (c = e * n + t * r) && (n -= e * c, r -= t * c), (s = Math.sqrt(n * n + r * r)) && (n /= s, r /= s, c /= s), e * r < t * n && (e = -e, t = -t, c = -c, o = -o), {
		translateX: i,
		translateY: a,
		rotate: Math.atan2(t, e) * Zn,
		skewX: Math.atan(c) * Zn,
		scaleX: o,
		scaleY: s
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/parse.js
var er;
function tr(e) {
	let t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
	return t.isIdentity ? Qn : $n(t.a, t.b, t.c, t.d, t.e, t.f);
}
function nr(e) {
	return e == null || (er ||= document.createElementNS("http://www.w3.org/2000/svg", "g"), er.setAttribute("transform", e), !(e = er.transform.baseVal.consolidate())) ? Qn : (e = e.matrix, $n(e.a, e.b, e.c, e.d, e.e, e.f));
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/index.js
function rr(e, t, n, r) {
	function i(e) {
		return e.length ? e.pop() + " " : "";
	}
	function a(e, r, i, a, o, s) {
		if (e !== i || r !== a) {
			var c = o.push("translate(", null, t, null, n);
			s.push({
				i: c - 4,
				x: Un(e, i)
			}, {
				i: c - 2,
				x: Un(r, a)
			});
		} else (i || a) && o.push("translate(" + i + t + a + n);
	}
	function o(e, t, n, a) {
		e === t ? t && n.push(i(n) + "rotate(" + t + r) : (e - t > 180 ? t += 360 : t - e > 180 && (e += 360), a.push({
			i: n.push(i(n) + "rotate(", null, r) - 2,
			x: Un(e, t)
		}));
	}
	function s(e, t, n, a) {
		e === t ? t && n.push(i(n) + "skewX(" + t + r) : a.push({
			i: n.push(i(n) + "skewX(", null, r) - 2,
			x: Un(e, t)
		});
	}
	function c(e, t, n, r, a, o) {
		if (e !== n || t !== r) {
			var s = a.push(i(a) + "scale(", null, ",", null, ")");
			o.push({
				i: s - 4,
				x: Un(e, n)
			}, {
				i: s - 2,
				x: Un(t, r)
			});
		} else (n !== 1 || r !== 1) && a.push(i(a) + "scale(" + n + "," + r + ")");
	}
	return function(t, n) {
		var r = [], i = [];
		return t = e(t), n = e(n), a(t.translateX, t.translateY, n.translateX, n.translateY, r, i), o(t.rotate, n.rotate, r, i), s(t.skewX, n.skewX, r, i), c(t.scaleX, t.scaleY, n.scaleX, n.scaleY, r, i), t = n = null, function(e) {
			for (var t = -1, n = i.length, a; ++t < n;) r[(a = i[t]).i] = a.x(e);
			return r.join("");
		};
	};
}
var ir = rr(tr, "px, ", "px)", "deg)"), ar = rr(nr, ", ", ")", ")"), or = 1e-12;
function sr(e) {
	return ((e = Math.exp(e)) + 1 / e) / 2;
}
function cr(e) {
	return ((e = Math.exp(e)) - 1 / e) / 2;
}
function lr(e) {
	return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
var ur = (function e(t, n, r) {
	function i(e, i) {
		var a = e[0], o = e[1], s = e[2], c = i[0], l = i[1], u = i[2], d = c - a, f = l - o, p = d * d + f * f, m, h;
		if (p < or) h = Math.log(u / s) / t, m = function(e) {
			return [
				a + e * d,
				o + e * f,
				s * Math.exp(t * e * h)
			];
		};
		else {
			var g = Math.sqrt(p), _ = (u * u - s * s + r * p) / (2 * s * n * g), v = (u * u - s * s - r * p) / (2 * u * n * g), y = Math.log(Math.sqrt(_ * _ + 1) - _);
			h = (Math.log(Math.sqrt(v * v + 1) - v) - y) / t, m = function(e) {
				var r = e * h, i = sr(y), c = s / (n * g) * (i * lr(t * r + y) - cr(y));
				return [
					a + c * d,
					o + c * f,
					s * i / sr(t * r + y)
				];
			};
		}
		return m.duration = h * 1e3 * t / Math.SQRT2, m;
	}
	return i.rho = function(t) {
		var n = Math.max(.001, +t), r = n * n;
		return e(n, r, r * r);
	}, i;
})(Math.SQRT2, 2, 4), dr = 0, fr = 0, pr = 0, mr = 1e3, hr, gr, _r = 0, vr = 0, yr = 0, br = typeof performance == "object" && performance.now ? performance : Date, xr = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
	setTimeout(e, 17);
};
function Sr() {
	return vr ||= (xr(Cr), br.now() + yr);
}
function Cr() {
	vr = 0;
}
function wr() {
	this._call = this._time = this._next = null;
}
wr.prototype = Tr.prototype = {
	constructor: wr,
	restart: function(e, t, n) {
		if (typeof e != "function") throw TypeError("callback is not a function");
		n = (n == null ? Sr() : +n) + (t == null ? 0 : +t), !this._next && gr !== this && (gr ? gr._next = this : hr = this, gr = this), this._call = e, this._time = n, Ar();
	},
	stop: function() {
		this._call && (this._call = null, this._time = Infinity, Ar());
	}
};
function Tr(e, t, n) {
	var r = new wr();
	return r.restart(e, t, n), r;
}
function Er() {
	Sr(), ++dr;
	for (var e = hr, t; e;) (t = vr - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
	--dr;
}
function Dr() {
	vr = (_r = br.now()) + yr, dr = fr = 0;
	try {
		Er();
	} finally {
		dr = 0, kr(), vr = 0;
	}
}
function Or() {
	var e = br.now(), t = e - _r;
	t > mr && (yr -= t, _r = e);
}
function kr() {
	for (var e, t = hr, n, r = Infinity; t;) t._call ? (r > t._time && (r = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : hr = n);
	gr = e, Ar(r);
}
function Ar(e) {
	dr || (fr &&= clearTimeout(fr), e - vr > 24 ? (e < Infinity && (fr = setTimeout(Dr, e - br.now() - yr)), pr &&= clearInterval(pr)) : (pr ||= (_r = br.now(), setInterval(Or, mr)), dr = 1, xr(Dr)));
}
//#endregion
//#region node_modules/d3-timer/src/timeout.js
function jr(e, t, n) {
	var r = new wr();
	return t = t == null ? 0 : +t, r.restart((n) => {
		r.stop(), e(n + t);
	}, t, n), r;
}
//#endregion
//#region node_modules/d3-transition/src/transition/schedule.js
var Mr = b("start", "end", "cancel", "interrupt"), Nr = [];
function Pr(e, t, n, r, i, a) {
	var o = e.__transition;
	if (!o) e.__transition = {};
	else if (n in o) return;
	Rr(e, n, {
		name: t,
		index: r,
		group: i,
		on: Mr,
		tween: Nr,
		time: a.time,
		delay: a.delay,
		duration: a.duration,
		ease: a.ease,
		timer: null,
		state: 0
	});
}
function Fr(e, t) {
	var n = Lr(e, t);
	if (n.state > 0) throw Error("too late; already scheduled");
	return n;
}
function Ir(e, t) {
	var n = Lr(e, t);
	if (n.state > 3) throw Error("too late; already running");
	return n;
}
function Lr(e, t) {
	var n = e.__transition;
	if (!n || !(n = n[t])) throw Error("transition not found");
	return n;
}
function Rr(e, t, n) {
	var r = e.__transition, i;
	r[t] = n, n.timer = Tr(a, 0, n.time);
	function a(e) {
		n.state = 1, n.timer.restart(o, n.delay, n.time), n.delay <= e && o(e - n.delay);
	}
	function o(a) {
		var l, u, d, f;
		if (n.state !== 1) return c();
		for (l in r) if (f = r[l], f.name === n.name) {
			if (f.state === 3) return jr(o);
			f.state === 4 ? (f.state = 6, f.timer.stop(), f.on.call("interrupt", e, e.__data__, f.index, f.group), delete r[l]) : +l < t && (f.state = 6, f.timer.stop(), f.on.call("cancel", e, e.__data__, f.index, f.group), delete r[l]);
		}
		if (jr(function() {
			n.state === 3 && (n.state = 4, n.timer.restart(s, n.delay, n.time), s(a));
		}), n.state = 2, n.on.call("start", e, e.__data__, n.index, n.group), n.state === 2) {
			for (n.state = 3, i = Array(d = n.tween.length), l = 0, u = -1; l < d; ++l) (f = n.tween[l].value.call(e, e.__data__, n.index, n.group)) && (i[++u] = f);
			i.length = u + 1;
		}
	}
	function s(t) {
		for (var r = t < n.duration ? n.ease.call(null, t / n.duration) : (n.timer.restart(c), n.state = 5, 1), a = -1, o = i.length; ++a < o;) i[a].call(e, r);
		n.state === 5 && (n.on.call("end", e, e.__data__, n.index, n.group), c());
	}
	function c() {
		for (var i in n.state = 6, n.timer.stop(), delete r[t], r) return;
		delete e.__transition;
	}
}
//#endregion
//#region node_modules/d3-transition/src/interrupt.js
function zr(e, t) {
	var n = e.__transition, r, i, a = !0, o;
	if (n) {
		for (o in t = t == null ? null : t + "", n) {
			if ((r = n[o]).name !== t) {
				a = !1;
				continue;
			}
			i = r.state > 2 && r.state < 5, r.state = 6, r.timer.stop(), r.on.call(i ? "interrupt" : "cancel", e, e.__data__, r.index, r.group), delete n[o];
		}
		a && delete e.__transition;
	}
}
//#endregion
//#region node_modules/d3-transition/src/selection/interrupt.js
function Br(e) {
	return this.each(function() {
		zr(this, e);
	});
}
//#endregion
//#region node_modules/d3-transition/src/transition/tween.js
function Vr(e, t) {
	var n, r;
	return function() {
		var i = Ir(this, e), a = i.tween;
		if (a !== n) {
			r = n = a;
			for (var o = 0, s = r.length; o < s; ++o) if (r[o].name === t) {
				r = r.slice(), r.splice(o, 1);
				break;
			}
		}
		i.tween = r;
	};
}
function Hr(e, t, n) {
	var r, i;
	if (typeof n != "function") throw Error();
	return function() {
		var a = Ir(this, e), o = a.tween;
		if (o !== r) {
			i = (r = o).slice();
			for (var s = {
				name: t,
				value: n
			}, c = 0, l = i.length; c < l; ++c) if (i[c].name === t) {
				i[c] = s;
				break;
			}
			c === l && i.push(s);
		}
		a.tween = i;
	};
}
function Ur(e, t) {
	var n = this._id;
	if (e += "", arguments.length < 2) {
		for (var r = Lr(this.node(), n).tween, i = 0, a = r.length, o; i < a; ++i) if ((o = r[i]).name === e) return o.value;
		return null;
	}
	return this.each((t == null ? Vr : Hr)(n, e, t));
}
function Wr(e, t, n) {
	var r = e._id;
	return e.each(function() {
		var e = Ir(this, r);
		(e.value ||= {})[t] = n.apply(this, arguments);
	}), function(e) {
		return Lr(e, r).value[t];
	};
}
//#endregion
//#region node_modules/d3-transition/src/transition/interpolate.js
function Gr(e, t) {
	var n;
	return (typeof t == "number" ? Un : t instanceof gn ? Rn : (n = gn(t)) ? (t = n, Rn) : Yn)(e, t);
}
//#endregion
//#region node_modules/d3-transition/src/transition/attr.js
function Kr(e) {
	return function() {
		this.removeAttribute(e);
	};
}
function qr(e) {
	return function() {
		this.removeAttributeNS(e.space, e.local);
	};
}
function Jr(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = this.getAttribute(e);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function Yr(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = this.getAttributeNS(e.space, e.local);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function Xr(e, t, n) {
	var r, i, a;
	return function() {
		var o, s = n(this), c;
		return s == null ? void this.removeAttribute(e) : (o = this.getAttribute(e), c = s + "", o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s)));
	};
}
function Zr(e, t, n) {
	var r, i, a;
	return function() {
		var o, s = n(this), c;
		return s == null ? void this.removeAttributeNS(e.space, e.local) : (o = this.getAttributeNS(e.space, e.local), c = s + "", o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s)));
	};
}
function Qr(e, t) {
	var n = E(e), r = n === "transform" ? ar : Gr;
	return this.attrTween(e, typeof t == "function" ? (n.local ? Zr : Xr)(n, r, Wr(this, "attr." + e, t)) : t == null ? (n.local ? qr : Kr)(n) : (n.local ? Yr : Jr)(n, r, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/attrTween.js
function $r(e, t) {
	return function(n) {
		this.setAttribute(e, t.call(this, n));
	};
}
function ei(e, t) {
	return function(n) {
		this.setAttributeNS(e.space, e.local, t.call(this, n));
	};
}
function ti(e, t) {
	var n, r;
	function i() {
		var i = t.apply(this, arguments);
		return i !== r && (n = (r = i) && ei(e, i)), n;
	}
	return i._value = t, i;
}
function ni(e, t) {
	var n, r;
	function i() {
		var i = t.apply(this, arguments);
		return i !== r && (n = (r = i) && $r(e, i)), n;
	}
	return i._value = t, i;
}
function ri(e, t) {
	var n = "attr." + e;
	if (arguments.length < 2) return (n = this.tween(n)) && n._value;
	if (t == null) return this.tween(n, null);
	if (typeof t != "function") throw Error();
	var r = E(e);
	return this.tween(n, (r.local ? ti : ni)(r, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/delay.js
function ii(e, t) {
	return function() {
		Fr(this, e).delay = +t.apply(this, arguments);
	};
}
function ai(e, t) {
	return t = +t, function() {
		Fr(this, e).delay = t;
	};
}
function oi(e) {
	var t = this._id;
	return arguments.length ? this.each((typeof e == "function" ? ii : ai)(t, e)) : Lr(this.node(), t).delay;
}
//#endregion
//#region node_modules/d3-transition/src/transition/duration.js
function si(e, t) {
	return function() {
		Ir(this, e).duration = +t.apply(this, arguments);
	};
}
function ci(e, t) {
	return t = +t, function() {
		Ir(this, e).duration = t;
	};
}
function li(e) {
	var t = this._id;
	return arguments.length ? this.each((typeof e == "function" ? si : ci)(t, e)) : Lr(this.node(), t).duration;
}
//#endregion
//#region node_modules/d3-transition/src/transition/ease.js
function ui(e, t) {
	if (typeof t != "function") throw Error();
	return function() {
		Ir(this, e).ease = t;
	};
}
function di(e) {
	var t = this._id;
	return arguments.length ? this.each(ui(t, e)) : Lr(this.node(), t).ease;
}
//#endregion
//#region node_modules/d3-transition/src/transition/easeVarying.js
function fi(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		if (typeof n != "function") throw Error();
		Ir(this, e).ease = n;
	};
}
function pi(e) {
	if (typeof e != "function") throw Error();
	return this.each(fi(this._id, e));
}
//#endregion
//#region node_modules/d3-transition/src/transition/filter.js
function mi(e) {
	typeof e != "function" && (e = ee(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = [], c, l = 0; l < o; ++l) (c = a[l]) && e.call(c, c.__data__, l, a) && s.push(c);
	return new Ui(r, this._parents, this._name, this._id);
}
//#endregion
//#region node_modules/d3-transition/src/transition/merge.js
function hi(e) {
	if (e._id !== this._id) throw Error();
	for (var t = this._groups, n = e._groups, r = t.length, i = n.length, a = Math.min(r, i), o = Array(r), s = 0; s < a; ++s) for (var c = t[s], l = n[s], u = c.length, d = o[s] = Array(u), f, p = 0; p < u; ++p) (f = c[p] || l[p]) && (d[p] = f);
	for (; s < r; ++s) o[s] = t[s];
	return new Ui(o, this._parents, this._name, this._id);
}
//#endregion
//#region node_modules/d3-transition/src/transition/on.js
function gi(e) {
	return (e + "").trim().split(/^|\s+/).every(function(e) {
		var t = e.indexOf(".");
		return t >= 0 && (e = e.slice(0, t)), !e || e === "start";
	});
}
function _i(e, t, n) {
	var r, i, a = gi(t) ? Fr : Ir;
	return function() {
		var o = a(this, e), s = o.on;
		s !== r && (i = (r = s).copy()).on(t, n), o.on = i;
	};
}
function vi(e, t) {
	var n = this._id;
	return arguments.length < 2 ? Lr(this.node(), n).on.on(e) : this.each(_i(n, e, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/remove.js
function yi(e) {
	return function() {
		var t = this.parentNode;
		for (var n in this.__transition) if (+n !== e) return;
		t && t.removeChild(this);
	};
}
function bi() {
	return this.on("end.remove", yi(this._id));
}
//#endregion
//#region node_modules/d3-transition/src/transition/select.js
function xi(e) {
	var t = this._name, n = this._id;
	typeof e != "function" && (e = j(e));
	for (var r = this._groups, i = r.length, a = Array(i), o = 0; o < i; ++o) for (var s = r[o], c = s.length, l = a[o] = Array(c), u, d, f = 0; f < c; ++f) (u = s[f]) && (d = e.call(u, u.__data__, f, s)) && ("__data__" in u && (d.__data__ = u.__data__), l[f] = d, Pr(l[f], t, n, f, l, Lr(u, n)));
	return new Ui(a, this._parents, t, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/selectAll.js
function Si(e) {
	var t = this._name, n = this._id;
	typeof e != "function" && (e = F(e));
	for (var r = this._groups, i = r.length, a = [], o = [], s = 0; s < i; ++s) for (var c = r[s], l = c.length, u, d = 0; d < l; ++d) if (u = c[d]) {
		for (var f = e.call(u, u.__data__, d, c), p, m = Lr(u, n), h = 0, g = f.length; h < g; ++h) (p = f[h]) && Pr(p, t, n, h, f, m);
		a.push(f), o.push(u);
	}
	return new Ui(a, o, t, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/selection.js
var Ci = Mt.prototype.constructor;
function wi() {
	return new Ci(this._groups, this._parents);
}
//#endregion
//#region node_modules/d3-transition/src/transition/style.js
function Ti(e, t) {
	var n, r, i;
	return function() {
		var a = Be(this, e), o = (this.style.removeProperty(e), Be(this, e));
		return a === o ? null : a === n && o === r ? i : i = t(n = a, r = o);
	};
}
function Ei(e) {
	return function() {
		this.style.removeProperty(e);
	};
}
function Di(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = Be(this, e);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function Oi(e, t, n) {
	var r, i, a;
	return function() {
		var o = Be(this, e), s = n(this), c = s + "";
		return s ?? (c = s = (this.style.removeProperty(e), Be(this, e))), o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s));
	};
}
function ki(e, t) {
	var n, r, i, a = "style." + t, o = "end." + a, s;
	return function() {
		var c = Ir(this, e), l = c.on, u = c.value[a] == null ? s ||= Ei(t) : void 0;
		(l !== n || i !== u) && (r = (n = l).copy()).on(o, i = u), c.on = r;
	};
}
function Ai(e, t, n) {
	var r = (e += "") == "transform" ? ir : Gr;
	return t == null ? this.styleTween(e, Ti(e, r)).on("end.style." + e, Ei(e)) : typeof t == "function" ? this.styleTween(e, Oi(e, r, Wr(this, "style." + e, t))).each(ki(this._id, e)) : this.styleTween(e, Di(e, r, t), n).on("end.style." + e, null);
}
//#endregion
//#region node_modules/d3-transition/src/transition/styleTween.js
function ji(e, t, n) {
	return function(r) {
		this.style.setProperty(e, t.call(this, r), n);
	};
}
function Mi(e, t, n) {
	var r, i;
	function a() {
		var a = t.apply(this, arguments);
		return a !== i && (r = (i = a) && ji(e, a, n)), r;
	}
	return a._value = t, a;
}
function Ni(e, t, n) {
	var r = "style." + (e += "");
	if (arguments.length < 2) return (r = this.tween(r)) && r._value;
	if (t == null) return this.tween(r, null);
	if (typeof t != "function") throw Error();
	return this.tween(r, Mi(e, t, n ?? ""));
}
//#endregion
//#region node_modules/d3-transition/src/transition/text.js
function Pi(e) {
	return function() {
		this.textContent = e;
	};
}
function Fi(e) {
	return function() {
		var t = e(this);
		this.textContent = t ?? "";
	};
}
function Ii(e) {
	return this.tween("text", typeof e == "function" ? Fi(Wr(this, "text", e)) : Pi(e == null ? "" : e + ""));
}
//#endregion
//#region node_modules/d3-transition/src/transition/textTween.js
function Li(e) {
	return function(t) {
		this.textContent = e.call(this, t);
	};
}
function Ri(e) {
	var t, n;
	function r() {
		var r = e.apply(this, arguments);
		return r !== n && (t = (n = r) && Li(r)), t;
	}
	return r._value = e, r;
}
function zi(e) {
	var t = "text";
	if (arguments.length < 1) return (t = this.tween(t)) && t._value;
	if (e == null) return this.tween(t, null);
	if (typeof e != "function") throw Error();
	return this.tween(t, Ri(e));
}
//#endregion
//#region node_modules/d3-transition/src/transition/transition.js
function Bi() {
	for (var e = this._name, t = this._id, n = Gi(), r = this._groups, i = r.length, a = 0; a < i; ++a) for (var o = r[a], s = o.length, c, l = 0; l < s; ++l) if (c = o[l]) {
		var u = Lr(c, t);
		Pr(c, e, n, l, o, {
			time: u.time + u.delay + u.duration,
			delay: 0,
			duration: u.duration,
			ease: u.ease
		});
	}
	return new Ui(r, this._parents, e, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/end.js
function Vi() {
	var e, t, n = this, r = n._id, i = n.size();
	return new Promise(function(a, o) {
		var s = { value: o }, c = { value: function() {
			--i === 0 && a();
		} };
		n.each(function() {
			var n = Ir(this, r), i = n.on;
			i !== e && (t = (e = i).copy(), t._.cancel.push(s), t._.interrupt.push(s), t._.end.push(c)), n.on = t;
		}), i === 0 && a();
	});
}
//#endregion
//#region node_modules/d3-transition/src/transition/index.js
var Hi = 0;
function Ui(e, t, n, r) {
	this._groups = e, this._parents = t, this._name = n, this._id = r;
}
function Wi(e) {
	return Mt().transition(e);
}
function Gi() {
	return ++Hi;
}
var Ki = Mt.prototype;
Ui.prototype = Wi.prototype = {
	constructor: Ui,
	select: xi,
	selectAll: Si,
	selectChild: Ki.selectChild,
	selectChildren: Ki.selectChildren,
	filter: mi,
	merge: hi,
	selection: wi,
	transition: Bi,
	call: Ki.call,
	nodes: Ki.nodes,
	node: Ki.node,
	size: Ki.size,
	empty: Ki.empty,
	each: Ki.each,
	on: vi,
	attr: Qr,
	attrTween: ri,
	style: Ai,
	styleTween: Ni,
	text: Ii,
	textTween: zi,
	remove: bi,
	tween: Ur,
	delay: oi,
	duration: li,
	ease: di,
	easeVarying: pi,
	end: Vi,
	[Symbol.iterator]: Ki[Symbol.iterator]
};
//#endregion
//#region node_modules/d3-ease/src/cubic.js
function qi(e) {
	return --e * e * e + 1;
}
function Ji(e) {
	return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
//#endregion
//#region node_modules/d3-transition/src/selection/transition.js
var Yi = {
	time: null,
	delay: 0,
	duration: 250,
	ease: Ji
};
function Xi(e, t) {
	for (var n; !(n = e.__transition) || !(n = n[t]);) if (!(e = e.parentNode)) throw Error(`transition ${t} not found`);
	return n;
}
function Zi(e) {
	var t, n;
	e instanceof Ui ? (t = e._id, e = e._name) : (t = Gi(), (n = Yi).time = Sr(), e = e == null ? null : e + "");
	for (var r = this._groups, i = r.length, a = 0; a < i; ++a) for (var o = r[a], s = o.length, c, l = 0; l < s; ++l) (c = o[l]) && Pr(c, e, t, l, o, n || Xi(c, t));
	return new Ui(r, this._parents, e, t);
}
Mt.prototype.interrupt = Br, Mt.prototype.transition = Zi;
//#endregion
//#region node_modules/d3-brush/src/brush.js
var { abs: Qi, max: $i, min: ea } = Math;
["w", "e"].map(ta), ["n", "s"].map(ta), [
	"n",
	"w",
	"e",
	"s",
	"nw",
	"ne",
	"sw",
	"se"
].map(ta);
function ta(e) {
	return { type: e };
}
//#endregion
//#region node_modules/d3-path/src/path.js
var na = Math.PI, ra = 2 * na, ia = 1e-6, aa = ra - ia;
function oa(e) {
	this._ += e[0];
	for (let t = 1, n = e.length; t < n; ++t) this._ += arguments[t] + e[t];
}
function sa(e) {
	let t = Math.floor(e);
	if (!(t >= 0)) throw Error(`invalid digits: ${e}`);
	if (t > 15) return oa;
	let n = 10 ** t;
	return function(e) {
		this._ += e[0];
		for (let t = 1, r = e.length; t < r; ++t) this._ += Math.round(arguments[t] * n) / n + e[t];
	};
}
var ca = class {
	constructor(e) {
		this._x0 = this._y0 = this._x1 = this._y1 = null, this._ = "", this._append = e == null ? oa : sa(e);
	}
	moveTo(e, t) {
		this._append`M${this._x0 = this._x1 = +e},${this._y0 = this._y1 = +t}`;
	}
	closePath() {
		this._x1 !== null && (this._x1 = this._x0, this._y1 = this._y0, this._append`Z`);
	}
	lineTo(e, t) {
		this._append`L${this._x1 = +e},${this._y1 = +t}`;
	}
	quadraticCurveTo(e, t, n, r) {
		this._append`Q${+e},${+t},${this._x1 = +n},${this._y1 = +r}`;
	}
	bezierCurveTo(e, t, n, r, i, a) {
		this._append`C${+e},${+t},${+n},${+r},${this._x1 = +i},${this._y1 = +a}`;
	}
	arcTo(e, t, n, r, i) {
		if (e = +e, t = +t, n = +n, r = +r, i = +i, i < 0) throw Error(`negative radius: ${i}`);
		let a = this._x1, o = this._y1, s = n - e, c = r - t, l = a - e, u = o - t, d = l * l + u * u;
		if (this._x1 === null) this._append`M${this._x1 = e},${this._y1 = t}`;
		else if (d > ia) if (!(Math.abs(u * s - c * l) > ia) || !i) this._append`L${this._x1 = e},${this._y1 = t}`;
		else {
			let f = n - a, p = r - o, m = s * s + c * c, h = f * f + p * p, g = Math.sqrt(m), _ = Math.sqrt(d), v = i * Math.tan((na - Math.acos((m + d - h) / (2 * g * _))) / 2), y = v / _, b = v / g;
			Math.abs(y - 1) > ia && this._append`L${e + y * l},${t + y * u}`, this._append`A${i},${i},0,0,${+(u * f > l * p)},${this._x1 = e + b * s},${this._y1 = t + b * c}`;
		}
	}
	arc(e, t, n, r, i, a) {
		if (e = +e, t = +t, n = +n, a = !!a, n < 0) throw Error(`negative radius: ${n}`);
		let o = n * Math.cos(r), s = n * Math.sin(r), c = e + o, l = t + s, u = 1 ^ a, d = a ? r - i : i - r;
		this._x1 === null ? this._append`M${c},${l}` : (Math.abs(this._x1 - c) > ia || Math.abs(this._y1 - l) > ia) && this._append`L${c},${l}`, n && (d < 0 && (d = d % ra + ra), d > aa ? this._append`A${n},${n},0,1,${u},${e - o},${t - s}A${n},${n},0,1,${u},${this._x1 = c},${this._y1 = l}` : d > ia && this._append`A${n},${n},0,${+(d >= na)},${u},${this._x1 = e + n * Math.cos(i)},${this._y1 = t + n * Math.sin(i)}`);
	}
	rect(e, t, n, r) {
		this._append`M${this._x0 = this._x1 = +e},${this._y0 = this._y1 = +t}h${n = +n}v${+r}h${-n}Z`;
	}
	toString() {
		return this._;
	}
};
function la() {
	return new ca();
}
la.prototype = ca.prototype;
//#endregion
//#region node_modules/d3-force/src/center.js
function ua(e, t) {
	var n, r = 1;
	e ??= 0, t ??= 0;
	function i() {
		var i, a = n.length, o, s = 0, c = 0;
		for (i = 0; i < a; ++i) o = n[i], s += o.x, c += o.y;
		for (s = (s / a - e) * r, c = (c / a - t) * r, i = 0; i < a; ++i) o = n[i], o.x -= s, o.y -= c;
	}
	return i.initialize = function(e) {
		n = e;
	}, i.x = function(t) {
		return arguments.length ? (e = +t, i) : e;
	}, i.y = function(e) {
		return arguments.length ? (t = +e, i) : t;
	}, i.strength = function(e) {
		return arguments.length ? (r = +e, i) : r;
	}, i;
}
//#endregion
//#region node_modules/d3-quadtree/src/add.js
function da(e) {
	let t = +this._x.call(null, e), n = +this._y.call(null, e);
	return fa(this.cover(t, n), t, n, e);
}
function fa(e, t, n, r) {
	if (isNaN(t) || isNaN(n)) return e;
	var i, a = e._root, o = { data: r }, s = e._x0, c = e._y0, l = e._x1, u = e._y1, d, f, p, m, h, g, _, v;
	if (!a) return e._root = o, e;
	for (; a.length;) if ((h = t >= (d = (s + l) / 2)) ? s = d : l = d, (g = n >= (f = (c + u) / 2)) ? c = f : u = f, i = a, !(a = a[_ = g << 1 | h])) return i[_] = o, e;
	if (p = +e._x.call(null, a.data), m = +e._y.call(null, a.data), t === p && n === m) return o.next = a, i ? i[_] = o : e._root = o, e;
	do
		i = i ? i[_] = [
			,
			,
			,
			,
		] : e._root = [
			,
			,
			,
			,
		], (h = t >= (d = (s + l) / 2)) ? s = d : l = d, (g = n >= (f = (c + u) / 2)) ? c = f : u = f;
	while ((_ = g << 1 | h) == (v = (m >= f) << 1 | p >= d));
	return i[v] = a, i[_] = o, e;
}
function pa(e) {
	var t, n, r = e.length, i, a, o = Array(r), s = Array(r), c = Infinity, l = Infinity, u = -Infinity, d = -Infinity;
	for (n = 0; n < r; ++n) isNaN(i = +this._x.call(null, t = e[n])) || isNaN(a = +this._y.call(null, t)) || (o[n] = i, s[n] = a, i < c && (c = i), i > u && (u = i), a < l && (l = a), a > d && (d = a));
	if (c > u || l > d) return this;
	for (this.cover(c, l).cover(u, d), n = 0; n < r; ++n) fa(this, o[n], s[n], e[n]);
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/cover.js
function ma(e, t) {
	if (isNaN(e = +e) || isNaN(t = +t)) return this;
	var n = this._x0, r = this._y0, i = this._x1, a = this._y1;
	if (isNaN(n)) i = (n = Math.floor(e)) + 1, a = (r = Math.floor(t)) + 1;
	else {
		for (var o = i - n || 1, s = this._root, c, l; n > e || e >= i || r > t || t >= a;) switch (l = (t < r) << 1 | e < n, c = [
			,
			,
			,
			,
		], c[l] = s, s = c, o *= 2, l) {
			case 0:
				i = n + o, a = r + o;
				break;
			case 1:
				n = i - o, a = r + o;
				break;
			case 2:
				i = n + o, r = a - o;
				break;
			case 3:
				n = i - o, r = a - o;
				break;
		}
		this._root && this._root.length && (this._root = s);
	}
	return this._x0 = n, this._y0 = r, this._x1 = i, this._y1 = a, this;
}
//#endregion
//#region node_modules/d3-quadtree/src/data.js
function ha() {
	var e = [];
	return this.visit(function(t) {
		if (!t.length) do
			e.push(t.data);
		while (t = t.next);
	}), e;
}
//#endregion
//#region node_modules/d3-quadtree/src/extent.js
function ga(e) {
	return arguments.length ? this.cover(+e[0][0], +e[0][1]).cover(+e[1][0], +e[1][1]) : isNaN(this._x0) ? void 0 : [[this._x0, this._y0], [this._x1, this._y1]];
}
//#endregion
//#region node_modules/d3-quadtree/src/quad.js
function _a(e, t, n, r, i) {
	this.node = e, this.x0 = t, this.y0 = n, this.x1 = r, this.y1 = i;
}
//#endregion
//#region node_modules/d3-quadtree/src/find.js
function va(e, t, n) {
	var r, i = this._x0, a = this._y0, o, s, c, l, u = this._x1, d = this._y1, f = [], p = this._root, m, h;
	for (p && f.push(new _a(p, i, a, u, d)), n == null ? n = Infinity : (i = e - n, a = t - n, u = e + n, d = t + n, n *= n); m = f.pop();) if (!(!(p = m.node) || (o = m.x0) > u || (s = m.y0) > d || (c = m.x1) < i || (l = m.y1) < a)) if (p.length) {
		var g = (o + c) / 2, _ = (s + l) / 2;
		f.push(new _a(p[3], g, _, c, l), new _a(p[2], o, _, g, l), new _a(p[1], g, s, c, _), new _a(p[0], o, s, g, _)), (h = (t >= _) << 1 | e >= g) && (m = f[f.length - 1], f[f.length - 1] = f[f.length - 1 - h], f[f.length - 1 - h] = m);
	} else {
		var v = e - +this._x.call(null, p.data), y = t - +this._y.call(null, p.data), b = v * v + y * y;
		if (b < n) {
			var x = Math.sqrt(n = b);
			i = e - x, a = t - x, u = e + x, d = t + x, r = p.data;
		}
	}
	return r;
}
//#endregion
//#region node_modules/d3-quadtree/src/remove.js
function ya(e) {
	if (isNaN(u = +this._x.call(null, e)) || isNaN(d = +this._y.call(null, e))) return this;
	var t, n = this._root, r, i, a, o = this._x0, s = this._y0, c = this._x1, l = this._y1, u, d, f, p, m, h, g, _;
	if (!n) return this;
	if (n.length) for (;;) {
		if ((m = u >= (f = (o + c) / 2)) ? o = f : c = f, (h = d >= (p = (s + l) / 2)) ? s = p : l = p, t = n, !(n = n[g = h << 1 | m])) return this;
		if (!n.length) break;
		(t[g + 1 & 3] || t[g + 2 & 3] || t[g + 3 & 3]) && (r = t, _ = g);
	}
	for (; n.data !== e;) if (i = n, !(n = n.next)) return this;
	return (a = n.next) && delete n.next, i ? (a ? i.next = a : delete i.next, this) : t ? (a ? t[g] = a : delete t[g], (n = t[0] || t[1] || t[2] || t[3]) && n === (t[3] || t[2] || t[1] || t[0]) && !n.length && (r ? r[_] = n : this._root = n), this) : (this._root = a, this);
}
function ba(e) {
	for (var t = 0, n = e.length; t < n; ++t) this.remove(e[t]);
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/root.js
function xa() {
	return this._root;
}
//#endregion
//#region node_modules/d3-quadtree/src/size.js
function Sa() {
	var e = 0;
	return this.visit(function(t) {
		if (!t.length) do
			++e;
		while (t = t.next);
	}), e;
}
//#endregion
//#region node_modules/d3-quadtree/src/visit.js
function Ca(e) {
	var t = [], n, r = this._root, i, a, o, s, c;
	for (r && t.push(new _a(r, this._x0, this._y0, this._x1, this._y1)); n = t.pop();) if (!e(r = n.node, a = n.x0, o = n.y0, s = n.x1, c = n.y1) && r.length) {
		var l = (a + s) / 2, u = (o + c) / 2;
		(i = r[3]) && t.push(new _a(i, l, u, s, c)), (i = r[2]) && t.push(new _a(i, a, u, l, c)), (i = r[1]) && t.push(new _a(i, l, o, s, u)), (i = r[0]) && t.push(new _a(i, a, o, l, u));
	}
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/visitAfter.js
function wa(e) {
	var t = [], n = [], r;
	for (this._root && t.push(new _a(this._root, this._x0, this._y0, this._x1, this._y1)); r = t.pop();) {
		var i = r.node;
		if (i.length) {
			var a, o = r.x0, s = r.y0, c = r.x1, l = r.y1, u = (o + c) / 2, d = (s + l) / 2;
			(a = i[0]) && t.push(new _a(a, o, s, u, d)), (a = i[1]) && t.push(new _a(a, u, s, c, d)), (a = i[2]) && t.push(new _a(a, o, d, u, l)), (a = i[3]) && t.push(new _a(a, u, d, c, l));
		}
		n.push(r);
	}
	for (; r = n.pop();) e(r.node, r.x0, r.y0, r.x1, r.y1);
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/x.js
function Ta(e) {
	return e[0];
}
function Ea(e) {
	return arguments.length ? (this._x = e, this) : this._x;
}
//#endregion
//#region node_modules/d3-quadtree/src/y.js
function Da(e) {
	return e[1];
}
function Oa(e) {
	return arguments.length ? (this._y = e, this) : this._y;
}
//#endregion
//#region node_modules/d3-quadtree/src/quadtree.js
function ka(e, t, n) {
	var r = new Aa(t ?? Ta, n ?? Da, NaN, NaN, NaN, NaN);
	return e == null ? r : r.addAll(e);
}
function Aa(e, t, n, r, i, a) {
	this._x = e, this._y = t, this._x0 = n, this._y0 = r, this._x1 = i, this._y1 = a, this._root = void 0;
}
function ja(e) {
	for (var t = { data: e.data }, n = t; e = e.next;) n = n.next = { data: e.data };
	return t;
}
var Ma = ka.prototype = Aa.prototype;
Ma.copy = function() {
	var e = new Aa(this._x, this._y, this._x0, this._y0, this._x1, this._y1), t = this._root, n, r;
	if (!t) return e;
	if (!t.length) return e._root = ja(t), e;
	for (n = [{
		source: t,
		target: e._root = [
			,
			,
			,
			,
		]
	}]; t = n.pop();) for (var i = 0; i < 4; ++i) (r = t.source[i]) && (r.length ? n.push({
		source: r,
		target: t.target[i] = [
			,
			,
			,
			,
		]
	}) : t.target[i] = ja(r));
	return e;
}, Ma.add = da, Ma.addAll = pa, Ma.cover = ma, Ma.data = ha, Ma.extent = ga, Ma.find = va, Ma.remove = ya, Ma.removeAll = ba, Ma.root = xa, Ma.size = Sa, Ma.visit = Ca, Ma.visitAfter = wa, Ma.x = Ea, Ma.y = Oa;
//#endregion
//#region node_modules/d3-force/src/constant.js
function Na(e) {
	return function() {
		return e;
	};
}
//#endregion
//#region node_modules/d3-force/src/jiggle.js
function Pa(e) {
	return (e() - .5) * 1e-6;
}
//#endregion
//#region node_modules/d3-force/src/collide.js
function Fa(e) {
	return e.x + e.vx;
}
function Ia(e) {
	return e.y + e.vy;
}
function La(e) {
	var t, n, r, i = 1, a = 1;
	typeof e != "function" && (e = Na(e == null ? 1 : +e));
	function o() {
		for (var e, o = t.length, c, l, u, d, f, p, m = 0; m < a; ++m) for (c = ka(t, Fa, Ia).visitAfter(s), e = 0; e < o; ++e) l = t[e], f = n[l.index], p = f * f, u = l.x + l.vx, d = l.y + l.vy, c.visit(h);
		function h(e, t, n, a, o) {
			var s = e.data, c = e.r, m = f + c;
			if (s) {
				if (s.index > l.index) {
					var h = u - s.x - s.vx, g = d - s.y - s.vy, _ = h * h + g * g;
					_ < m * m && (h === 0 && (h = Pa(r), _ += h * h), g === 0 && (g = Pa(r), _ += g * g), _ = (m - (_ = Math.sqrt(_))) / _ * i, l.vx += (h *= _) * (m = (c *= c) / (p + c)), l.vy += (g *= _) * m, s.vx -= h * (m = 1 - m), s.vy -= g * m);
				}
				return;
			}
			return t > u + m || a < u - m || n > d + m || o < d - m;
		}
	}
	function s(e) {
		if (e.data) return e.r = n[e.data.index];
		for (var t = e.r = 0; t < 4; ++t) e[t] && e[t].r > e.r && (e.r = e[t].r);
	}
	function c() {
		if (t) {
			var r, i = t.length, a;
			for (n = Array(i), r = 0; r < i; ++r) a = t[r], n[a.index] = +e(a, r, t);
		}
	}
	return o.initialize = function(e, n) {
		t = e, r = n, c();
	}, o.iterations = function(e) {
		return arguments.length ? (a = +e, o) : a;
	}, o.strength = function(e) {
		return arguments.length ? (i = +e, o) : i;
	}, o.radius = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : Na(+t), c(), o) : e;
	}, o;
}
//#endregion
//#region node_modules/d3-force/src/link.js
function Ra(e) {
	return e.index;
}
function za(e, t) {
	var n = e.get(t);
	if (!n) throw Error("node not found: " + t);
	return n;
}
function Ba(e) {
	var t = Ra, n = d, r, i = Na(30), a, o, s, c, l, u = 1;
	e ??= [];
	function d(e) {
		return 1 / Math.min(s[e.source.index], s[e.target.index]);
	}
	function f(t) {
		for (var n = 0, i = e.length; n < u; ++n) for (var o = 0, s, d, f, p, m, h, g; o < i; ++o) s = e[o], d = s.source, f = s.target, p = f.x + f.vx - d.x - d.vx || Pa(l), m = f.y + f.vy - d.y - d.vy || Pa(l), h = Math.sqrt(p * p + m * m), h = (h - a[o]) / h * t * r[o], p *= h, m *= h, f.vx -= p * (g = c[o]), f.vy -= m * g, d.vx += p * (g = 1 - g), d.vy += m * g;
	}
	function p() {
		if (o) {
			var n, i = o.length, l = e.length, u = new Map(o.map((e, n) => [t(e, n, o), e])), d;
			for (n = 0, s = Array(i); n < l; ++n) d = e[n], d.index = n, typeof d.source != "object" && (d.source = za(u, d.source)), typeof d.target != "object" && (d.target = za(u, d.target)), s[d.source.index] = (s[d.source.index] || 0) + 1, s[d.target.index] = (s[d.target.index] || 0) + 1;
			for (n = 0, c = Array(l); n < l; ++n) d = e[n], c[n] = s[d.source.index] / (s[d.source.index] + s[d.target.index]);
			r = Array(l), m(), a = Array(l), h();
		}
	}
	function m() {
		if (o) for (var t = 0, i = e.length; t < i; ++t) r[t] = +n(e[t], t, e);
	}
	function h() {
		if (o) for (var t = 0, n = e.length; t < n; ++t) a[t] = +i(e[t], t, e);
	}
	return f.initialize = function(e, t) {
		o = e, l = t, p();
	}, f.links = function(t) {
		return arguments.length ? (e = t, p(), f) : e;
	}, f.id = function(e) {
		return arguments.length ? (t = e, f) : t;
	}, f.iterations = function(e) {
		return arguments.length ? (u = +e, f) : u;
	}, f.strength = function(e) {
		return arguments.length ? (n = typeof e == "function" ? e : Na(+e), m(), f) : n;
	}, f.distance = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : Na(+e), h(), f) : i;
	}, f;
}
//#endregion
//#region node_modules/d3-force/src/lcg.js
var Va = 1664525, Ha = 1013904223, Ua = 4294967296;
function Wa() {
	let e = 1;
	return () => (e = (Va * e + Ha) % Ua) / Ua;
}
//#endregion
//#region node_modules/d3-force/src/simulation.js
function Ga(e) {
	return e.x;
}
function Ka(e) {
	return e.y;
}
var qa = 10, Ja = Math.PI * (3 - Math.sqrt(5));
function Ya(e) {
	var t, n = 1, r = .001, i = 1 - r ** (1 / 300), a = 0, o = .6, s = /* @__PURE__ */ new Map(), c = Tr(d), l = b("tick", "end"), u = Wa();
	e ??= [];
	function d() {
		f(), l.call("tick", t), n < r && (c.stop(), l.call("end", t));
	}
	function f(r) {
		var c, l = e.length, u;
		r === void 0 && (r = 1);
		for (var d = 0; d < r; ++d) for (n += (a - n) * i, s.forEach(function(e) {
			e(n);
		}), c = 0; c < l; ++c) u = e[c], u.fx == null ? u.x += u.vx *= o : (u.x = u.fx, u.vx = 0), u.fy == null ? u.y += u.vy *= o : (u.y = u.fy, u.vy = 0);
		return t;
	}
	function p() {
		for (var t = 0, n = e.length, r; t < n; ++t) {
			if (r = e[t], r.index = t, r.fx != null && (r.x = r.fx), r.fy != null && (r.y = r.fy), isNaN(r.x) || isNaN(r.y)) {
				var i = qa * Math.sqrt(.5 + t), a = t * Ja;
				r.x = i * Math.cos(a), r.y = i * Math.sin(a);
			}
			(isNaN(r.vx) || isNaN(r.vy)) && (r.vx = r.vy = 0);
		}
	}
	function m(t) {
		return t.initialize && t.initialize(e, u), t;
	}
	return p(), t = {
		tick: f,
		restart: function() {
			return c.restart(d), t;
		},
		stop: function() {
			return c.stop(), t;
		},
		nodes: function(n) {
			return arguments.length ? (e = n, p(), s.forEach(m), t) : e;
		},
		alpha: function(e) {
			return arguments.length ? (n = +e, t) : n;
		},
		alphaMin: function(e) {
			return arguments.length ? (r = +e, t) : r;
		},
		alphaDecay: function(e) {
			return arguments.length ? (i = +e, t) : +i;
		},
		alphaTarget: function(e) {
			return arguments.length ? (a = +e, t) : a;
		},
		velocityDecay: function(e) {
			return arguments.length ? (o = 1 - e, t) : 1 - o;
		},
		randomSource: function(e) {
			return arguments.length ? (u = e, s.forEach(m), t) : u;
		},
		force: function(e, n) {
			return arguments.length > 1 ? (n == null ? s.delete(e) : s.set(e, m(n)), t) : s.get(e);
		},
		find: function(t, n, r) {
			var i = 0, a = e.length, o, s, c, l, u;
			for (r == null ? r = Infinity : r *= r, i = 0; i < a; ++i) l = e[i], o = t - l.x, s = n - l.y, c = o * o + s * s, c < r && (u = l, r = c);
			return u;
		},
		on: function(e, n) {
			return arguments.length > 1 ? (l.on(e, n), t) : l.on(e);
		}
	};
}
//#endregion
//#region node_modules/d3-force/src/manyBody.js
function Xa() {
	var e, t, n, r, i = Na(-30), a, o = 1, s = Infinity, c = .81;
	function l(n) {
		var i, a = e.length, o = ka(e, Ga, Ka).visitAfter(d);
		for (r = n, i = 0; i < a; ++i) t = e[i], o.visit(f);
	}
	function u() {
		if (e) {
			var t, n = e.length, r;
			for (a = Array(n), t = 0; t < n; ++t) r = e[t], a[r.index] = +i(r, t, e);
		}
	}
	function d(e) {
		var t = 0, n, r, i = 0, o, s, c;
		if (e.length) {
			for (o = s = c = 0; c < 4; ++c) (n = e[c]) && (r = Math.abs(n.value)) && (t += n.value, i += r, o += r * n.x, s += r * n.y);
			e.x = o / i, e.y = s / i;
		} else {
			n = e, n.x = n.data.x, n.y = n.data.y;
			do
				t += a[n.data.index];
			while (n = n.next);
		}
		e.value = t;
	}
	function f(e, i, l, u) {
		if (!e.value) return !0;
		var d = e.x - t.x, f = e.y - t.y, p = u - i, m = d * d + f * f;
		if (p * p / c < m) return m < s && (d === 0 && (d = Pa(n), m += d * d), f === 0 && (f = Pa(n), m += f * f), m < o && (m = Math.sqrt(o * m)), t.vx += d * e.value * r / m, t.vy += f * e.value * r / m), !0;
		if (!(e.length || m >= s)) {
			(e.data !== t || e.next) && (d === 0 && (d = Pa(n), m += d * d), f === 0 && (f = Pa(n), m += f * f), m < o && (m = Math.sqrt(o * m)));
			do
				e.data !== t && (p = a[e.data.index] * r / m, t.vx += d * p, t.vy += f * p);
			while (e = e.next);
		}
	}
	return l.initialize = function(t, r) {
		e = t, n = r, u();
	}, l.strength = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : Na(+e), u(), l) : i;
	}, l.distanceMin = function(e) {
		return arguments.length ? (o = e * e, l) : Math.sqrt(o);
	}, l.distanceMax = function(e) {
		return arguments.length ? (s = e * e, l) : Math.sqrt(s);
	}, l.theta = function(e) {
		return arguments.length ? (c = e * e, l) : Math.sqrt(c);
	}, l;
}
//#endregion
//#region node_modules/d3-polygon/src/centroid.js
function Za(e) {
	for (var t = -1, n = e.length, r = 0, i = 0, a, o = e[n - 1], s, c = 0; ++t < n;) a = o, o = e[t], c += s = a[0] * o[1] - o[0] * a[1], r += (a[0] + o[0]) * s, i += (a[1] + o[1]) * s;
	return c *= 3, [r / c, i / c];
}
//#endregion
//#region node_modules/d3-polygon/src/cross.js
function Qa(e, t, n) {
	return (t[0] - e[0]) * (n[1] - e[1]) - (t[1] - e[1]) * (n[0] - e[0]);
}
//#endregion
//#region node_modules/d3-polygon/src/hull.js
function $a(e, t) {
	return e[0] - t[0] || e[1] - t[1];
}
function eo(e) {
	let t = e.length, n = [0, 1], r = 2, i;
	for (i = 2; i < t; ++i) {
		for (; r > 1 && Qa(e[n[r - 2]], e[n[r - 1]], e[i]) <= 0;) --r;
		n[r++] = i;
	}
	return n.slice(0, r);
}
function to(e) {
	if ((n = e.length) < 3) return null;
	var t, n, r = Array(n), i = Array(n);
	for (t = 0; t < n; ++t) r[t] = [
		+e[t][0],
		+e[t][1],
		t
	];
	for (r.sort($a), t = 0; t < n; ++t) i[t] = [r[t][0], -r[t][1]];
	var a = eo(r), o = eo(i), s = o[0] === a[0], c = o[o.length - 1] === a[a.length - 1], l = [];
	for (t = a.length - 1; t >= 0; --t) l.push(e[r[a[t]][2]]);
	for (t = +s; t < o.length - c; ++t) l.push(e[r[o[t]][2]]);
	return l;
}
//#endregion
//#region node_modules/d3-shape/src/constant.js
function no(e) {
	return function() {
		return e;
	};
}
var ro = Math.PI;
ro / 2, 2 * ro;
//#endregion
//#region node_modules/d3-shape/src/path.js
function io(e) {
	let t = 3;
	return e.digits = function(n) {
		if (!arguments.length) return t;
		if (n == null) t = null;
		else {
			let e = Math.floor(n);
			if (!(e >= 0)) throw RangeError(`invalid digits: ${n}`);
			t = e;
		}
		return e;
	}, () => new ca(t);
}
Array.prototype.slice;
function ao(e) {
	return typeof e == "object" && "length" in e ? e : Array.from(e);
}
//#endregion
//#region node_modules/d3-shape/src/curve/linear.js
function oo(e) {
	this._context = e;
}
oo.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._point = 0;
	},
	lineEnd: function() {
		(this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
				break;
			case 1: this._point = 2;
			default:
				this._context.lineTo(e, t);
				break;
		}
	}
};
function so(e) {
	return new oo(e);
}
//#endregion
//#region node_modules/d3-shape/src/point.js
function co(e) {
	return e[0];
}
function lo(e) {
	return e[1];
}
//#endregion
//#region node_modules/d3-shape/src/line.js
function uo(e, t) {
	var n = no(!0), r = null, i = so, a = null, o = io(s);
	e = typeof e == "function" ? e : e === void 0 ? co : no(e), t = typeof t == "function" ? t : t === void 0 ? lo : no(t);
	function s(s) {
		var c, l = (s = ao(s)).length, u, d = !1, f;
		for (r ?? (a = i(f = o())), c = 0; c <= l; ++c) !(c < l && n(u = s[c], c, s)) === d && ((d = !d) ? a.lineStart() : a.lineEnd()), d && a.point(+e(u, c, s), +t(u, c, s));
		if (f) return a = null, f + "" || null;
	}
	return s.x = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : no(+t), s) : e;
	}, s.y = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : no(+e), s) : t;
	}, s.defined = function(e) {
		return arguments.length ? (n = typeof e == "function" ? e : no(!!e), s) : n;
	}, s.curve = function(e) {
		return arguments.length ? (i = e, r != null && (a = i(r)), s) : i;
	}, s.context = function(e) {
		return arguments.length ? (e == null ? r = a = null : a = i(r = e), s) : r;
	}, s;
}
//#endregion
//#region node_modules/d3-shape/src/noop.js
function fo() {}
//#endregion
//#region node_modules/d3-shape/src/curve/basis.js
function po(e, t, n) {
	e._context.bezierCurveTo((2 * e._x0 + e._x1) / 3, (2 * e._y0 + e._y1) / 3, (e._x0 + 2 * e._x1) / 3, (e._y0 + 2 * e._y1) / 3, (e._x0 + 4 * e._x1 + t) / 6, (e._y0 + 4 * e._y1 + n) / 6);
}
function mo(e) {
	this._context = e;
}
mo.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._y0 = this._y1 = NaN, this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 3: po(this, this._x1, this._y1);
			case 2:
				this._context.lineTo(this._x1, this._y1);
				break;
		}
		(this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
				break;
			case 1:
				this._point = 2;
				break;
			case 2: this._point = 3, this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6);
			default:
				po(this, e, t);
				break;
		}
		this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
	}
};
//#endregion
//#region node_modules/d3-shape/src/curve/basisClosed.js
function ho(e) {
	this._context = e;
}
ho.prototype = {
	areaStart: fo,
	areaEnd: fo,
	lineStart: function() {
		this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = NaN, this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 1:
				this._context.moveTo(this._x2, this._y2), this._context.closePath();
				break;
			case 2:
				this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3), this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3), this._context.closePath();
				break;
			case 3:
				this.point(this._x2, this._y2), this.point(this._x3, this._y3), this.point(this._x4, this._y4);
				break;
		}
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._x2 = e, this._y2 = t;
				break;
			case 1:
				this._point = 2, this._x3 = e, this._y3 = t;
				break;
			case 2:
				this._point = 3, this._x4 = e, this._y4 = t, this._context.moveTo((this._x0 + 4 * this._x1 + e) / 6, (this._y0 + 4 * this._y1 + t) / 6);
				break;
			default:
				po(this, e, t);
				break;
		}
		this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
	}
};
function go(e) {
	return new ho(e);
}
//#endregion
//#region node_modules/d3-shape/src/curve/cardinal.js
function _o(e, t, n) {
	e._context.bezierCurveTo(e._x1 + e._k * (e._x2 - e._x0), e._y1 + e._k * (e._y2 - e._y0), e._x2 + e._k * (e._x1 - t), e._y2 + e._k * (e._y1 - n), e._x2, e._y2);
}
function vo(e, t) {
	this._context = e, this._k = (1 - t) / 6;
}
vo.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 2:
				this._context.lineTo(this._x2, this._y2);
				break;
			case 3:
				_o(this, this._x1, this._y1);
				break;
		}
		(this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
				break;
			case 1:
				this._point = 2, this._x1 = e, this._y1 = t;
				break;
			case 2: this._point = 3;
			default:
				_o(this, e, t);
				break;
		}
		this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
}, (function e(t) {
	function n(e) {
		return new vo(e, t);
	}
	return n.tension = function(t) {
		return e(+t);
	}, n;
})(0);
//#endregion
//#region node_modules/d3-shape/src/curve/cardinalClosed.js
function yo(e, t) {
	this._context = e, this._k = (1 - t) / 6;
}
yo.prototype = {
	areaStart: fo,
	areaEnd: fo,
	lineStart: function() {
		this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN, this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 1:
				this._context.moveTo(this._x3, this._y3), this._context.closePath();
				break;
			case 2:
				this._context.lineTo(this._x3, this._y3), this._context.closePath();
				break;
			case 3:
				this.point(this._x3, this._y3), this.point(this._x4, this._y4), this.point(this._x5, this._y5);
				break;
		}
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._x3 = e, this._y3 = t;
				break;
			case 1:
				this._point = 2, this._context.moveTo(this._x4 = e, this._y4 = t);
				break;
			case 2:
				this._point = 3, this._x5 = e, this._y5 = t;
				break;
			default:
				_o(this, e, t);
				break;
		}
		this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
}, (function e(t) {
	function n(e) {
		return new yo(e, t);
	}
	return n.tension = function(t) {
		return e(+t);
	}, n;
})(0);
//#endregion
//#region node_modules/d3-shape/src/curve/catmullRom.js
function bo(e, t, n) {
	var r = e._x1, i = e._y1, a = e._x2, o = e._y2;
	if (e._l01_a > 1e-12) {
		var s = 2 * e._l01_2a + 3 * e._l01_a * e._l12_a + e._l12_2a, c = 3 * e._l01_a * (e._l01_a + e._l12_a);
		r = (r * s - e._x0 * e._l12_2a + e._x2 * e._l01_2a) / c, i = (i * s - e._y0 * e._l12_2a + e._y2 * e._l01_2a) / c;
	}
	if (e._l23_a > 1e-12) {
		var l = 2 * e._l23_2a + 3 * e._l23_a * e._l12_a + e._l12_2a, u = 3 * e._l23_a * (e._l23_a + e._l12_a);
		a = (a * l + e._x1 * e._l23_2a - t * e._l12_2a) / u, o = (o * l + e._y1 * e._l23_2a - n * e._l12_2a) / u;
	}
	e._context.bezierCurveTo(r, i, a, o, e._x2, e._y2);
}
function xo(e, t) {
	this._context = e, this._alpha = t;
}
xo.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 2:
				this._context.lineTo(this._x2, this._y2);
				break;
			case 3:
				this.point(this._x2, this._y2);
				break;
		}
		(this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		if (e = +e, t = +t, this._point) {
			var n = this._x2 - e, r = this._y2 - t;
			this._l23_a = Math.sqrt(this._l23_2a = (n * n + r * r) ** +this._alpha);
		}
		switch (this._point) {
			case 0:
				this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
				break;
			case 1:
				this._point = 2;
				break;
			case 2: this._point = 3;
			default:
				bo(this, e, t);
				break;
		}
		this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
}, (function e(t) {
	function n(e) {
		return t ? new xo(e, t) : new vo(e, 0);
	}
	return n.alpha = function(t) {
		return e(+t);
	}, n;
})(.5);
//#endregion
//#region node_modules/d3-shape/src/curve/catmullRomClosed.js
function So(e, t) {
	this._context = e, this._alpha = t;
}
So.prototype = {
	areaStart: fo,
	areaEnd: fo,
	lineStart: function() {
		this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN, this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 1:
				this._context.moveTo(this._x3, this._y3), this._context.closePath();
				break;
			case 2:
				this._context.lineTo(this._x3, this._y3), this._context.closePath();
				break;
			case 3:
				this.point(this._x3, this._y3), this.point(this._x4, this._y4), this.point(this._x5, this._y5);
				break;
		}
	},
	point: function(e, t) {
		if (e = +e, t = +t, this._point) {
			var n = this._x2 - e, r = this._y2 - t;
			this._l23_a = Math.sqrt(this._l23_2a = (n * n + r * r) ** +this._alpha);
		}
		switch (this._point) {
			case 0:
				this._point = 1, this._x3 = e, this._y3 = t;
				break;
			case 1:
				this._point = 2, this._context.moveTo(this._x4 = e, this._y4 = t);
				break;
			case 2:
				this._point = 3, this._x5 = e, this._y5 = t;
				break;
			default:
				bo(this, e, t);
				break;
		}
		this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
};
var Co = (function e(t) {
	function n(e) {
		return t ? new So(e, t) : new yo(e, 0);
	}
	return n.alpha = function(t) {
		return e(+t);
	}, n;
})(.5), wo = (e) => () => e;
//#endregion
//#region node_modules/d3-zoom/src/event.js
function To(e, { sourceEvent: t, target: n, transform: r, dispatch: i }) {
	Object.defineProperties(this, {
		type: {
			value: e,
			enumerable: !0,
			configurable: !0
		},
		sourceEvent: {
			value: t,
			enumerable: !0,
			configurable: !0
		},
		target: {
			value: n,
			enumerable: !0,
			configurable: !0
		},
		transform: {
			value: r,
			enumerable: !0,
			configurable: !0
		},
		_: { value: i }
	});
}
//#endregion
//#region node_modules/d3-zoom/src/transform.js
function Eo(e, t, n) {
	this.k = e, this.x = t, this.y = n;
}
Eo.prototype = {
	constructor: Eo,
	scale: function(e) {
		return e === 1 ? this : new Eo(this.k * e, this.x, this.y);
	},
	translate: function(e, t) {
		return e === 0 & t === 0 ? this : new Eo(this.k, this.x + this.k * e, this.y + this.k * t);
	},
	apply: function(e) {
		return [e[0] * this.k + this.x, e[1] * this.k + this.y];
	},
	applyX: function(e) {
		return e * this.k + this.x;
	},
	applyY: function(e) {
		return e * this.k + this.y;
	},
	invert: function(e) {
		return [(e[0] - this.x) / this.k, (e[1] - this.y) / this.k];
	},
	invertX: function(e) {
		return (e - this.x) / this.k;
	},
	invertY: function(e) {
		return (e - this.y) / this.k;
	},
	rescaleX: function(e) {
		return e.copy().domain(e.range().map(this.invertX, this).map(e.invert, e));
	},
	rescaleY: function(e) {
		return e.copy().domain(e.range().map(this.invertY, this).map(e.invert, e));
	},
	toString: function() {
		return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
	}
};
var Do = new Eo(1, 0, 0);
Oo.prototype = Eo.prototype;
function Oo(e) {
	for (; !e.__zoom;) if (!(e = e.parentNode)) return Do;
	return e.__zoom;
}
//#endregion
//#region node_modules/d3-zoom/src/noevent.js
function ko(e) {
	e.stopImmediatePropagation();
}
function Ao(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region node_modules/d3-zoom/src/zoom.js
function jo(e) {
	return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function Mo() {
	var e = this;
	return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function No() {
	return this.__zoom || Do;
}
function Po(e) {
	return -e.deltaY * (e.deltaMode === 1 ? .05 : e.deltaMode ? 1 : .002) * (e.ctrlKey ? 10 : 1);
}
function Fo() {
	return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Io(e, t, n) {
	var r = e.invertX(t[0][0]) - n[0][0], i = e.invertX(t[1][0]) - n[1][0], a = e.invertY(t[0][1]) - n[0][1], o = e.invertY(t[1][1]) - n[1][1];
	return e.translate(i > r ? (r + i) / 2 : Math.min(0, r) || Math.max(0, i), o > a ? (a + o) / 2 : Math.min(0, a) || Math.max(0, o));
}
function Lo() {
	var e = jo, t = Mo, n = Io, r = Po, i = Fo, a = [0, Infinity], o = [[-Infinity, -Infinity], [Infinity, Infinity]], s = 250, c = ur, l = b("start", "zoom", "end"), u, d, f, p = 500, m = 150, h = 0, g = 10;
	function _(e) {
		e.property("__zoom", No).on("wheel.zoom", T, { passive: !1 }).on("mousedown.zoom", E).on("dblclick.zoom", D).filter(i).on("touchstart.zoom", O).on("touchmove.zoom", k).on("touchend.zoom touchcancel.zoom", A).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	}
	_.transform = function(e, t, n, r) {
		var i = e.selection ? e.selection() : e;
		i.property("__zoom", No), e === i ? i.interrupt().each(function() {
			C(this, arguments).event(r).start().zoom(null, typeof t == "function" ? t.apply(this, arguments) : t).end();
		}) : S(e, t, n, r);
	}, _.scaleBy = function(e, t, n, r) {
		_.scaleTo(e, function() {
			return this.__zoom.k * (typeof t == "function" ? t.apply(this, arguments) : t);
		}, n, r);
	}, _.scaleTo = function(e, r, i, a) {
		_.transform(e, function() {
			var e = t.apply(this, arguments), a = this.__zoom, s = i == null ? x(e) : typeof i == "function" ? i.apply(this, arguments) : i, c = a.invert(s), l = typeof r == "function" ? r.apply(this, arguments) : r;
			return n(y(v(a, l), s, c), e, o);
		}, i, a);
	}, _.translateBy = function(e, r, i, a) {
		_.transform(e, function() {
			return n(this.__zoom.translate(typeof r == "function" ? r.apply(this, arguments) : r, typeof i == "function" ? i.apply(this, arguments) : i), t.apply(this, arguments), o);
		}, null, a);
	}, _.translateTo = function(e, r, i, a, s) {
		_.transform(e, function() {
			var e = t.apply(this, arguments), s = this.__zoom, c = a == null ? x(e) : typeof a == "function" ? a.apply(this, arguments) : a;
			return n(Do.translate(c[0], c[1]).scale(s.k).translate(typeof r == "function" ? -r.apply(this, arguments) : -r, typeof i == "function" ? -i.apply(this, arguments) : -i), e, o);
		}, a, s);
	};
	function v(e, t) {
		return t = Math.max(a[0], Math.min(a[1], t)), t === e.k ? e : new Eo(t, e.x, e.y);
	}
	function y(e, t, n) {
		var r = t[0] - n[0] * e.k, i = t[1] - n[1] * e.k;
		return r === e.x && i === e.y ? e : new Eo(e.k, r, i);
	}
	function x(e) {
		return [(+e[0][0] + +e[1][0]) / 2, (+e[0][1] + +e[1][1]) / 2];
	}
	function S(e, n, r, i) {
		e.on("start.zoom", function() {
			C(this, arguments).event(i).start();
		}).on("interrupt.zoom end.zoom", function() {
			C(this, arguments).event(i).end();
		}).tween("zoom", function() {
			var e = this, a = arguments, o = C(e, a).event(i), s = t.apply(e, a), l = r == null ? x(s) : typeof r == "function" ? r.apply(e, a) : r, u = Math.max(s[1][0] - s[0][0], s[1][1] - s[0][1]), d = e.__zoom, f = typeof n == "function" ? n.apply(e, a) : n, p = c(d.invert(l).concat(u / d.k), f.invert(l).concat(u / f.k));
			return function(e) {
				if (e === 1) e = f;
				else {
					var t = p(e), n = u / t[2];
					e = new Eo(n, l[0] - t[0] * n, l[1] - t[1] * n);
				}
				o.zoom(null, e);
			};
		});
	}
	function C(e, t, n) {
		return !n && e.__zooming || new w(e, t);
	}
	function w(e, n) {
		this.that = e, this.args = n, this.active = 0, this.sourceEvent = null, this.extent = t.apply(e, n), this.taps = 0;
	}
	w.prototype = {
		event: function(e) {
			return e && (this.sourceEvent = e), this;
		},
		start: function() {
			return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
		},
		zoom: function(e, t) {
			return this.mouse && e !== "mouse" && (this.mouse[1] = t.invert(this.mouse[0])), this.touch0 && e !== "touch" && (this.touch0[1] = t.invert(this.touch0[0])), this.touch1 && e !== "touch" && (this.touch1[1] = t.invert(this.touch1[0])), this.that.__zoom = t, this.emit("zoom"), this;
		},
		end: function() {
			return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
		},
		emit: function(e) {
			var t = U(this.that).datum();
			l.call(e, this.that, new To(e, {
				sourceEvent: this.sourceEvent,
				target: _,
				type: e,
				transform: this.that.__zoom,
				dispatch: l
			}), t);
		}
	};
	function T(t, ...i) {
		if (!e.apply(this, arguments)) return;
		var s = C(this, i).event(t), c = this.__zoom, l = Math.max(a[0], Math.min(a[1], c.k * 2 ** r.apply(this, arguments))), u = Ft(t);
		if (s.wheel) (s.mouse[0][0] !== u[0] || s.mouse[0][1] !== u[1]) && (s.mouse[1] = c.invert(s.mouse[0] = u)), clearTimeout(s.wheel);
		else if (c.k === l) return;
		else s.mouse = [u, c.invert(u)], zr(this), s.start();
		Ao(t), s.wheel = setTimeout(d, m), s.zoom("mouse", n(y(v(c, l), s.mouse[0], s.mouse[1]), s.extent, o));
		function d() {
			s.wheel = null, s.end();
		}
	}
	function E(t, ...r) {
		if (f || !e.apply(this, arguments)) return;
		var i = t.currentTarget, a = C(this, r, !0).event(t), s = U(t.view).on("mousemove.zoom", d, !0).on("mouseup.zoom", p, !0), c = Ft(t, i), l = t.clientX, u = t.clientY;
		Bt(t.view), ko(t), a.mouse = [c, this.__zoom.invert(c)], zr(this), a.start();
		function d(e) {
			if (Ao(e), !a.moved) {
				var t = e.clientX - l, r = e.clientY - u;
				a.moved = t * t + r * r > h;
			}
			a.event(e).zoom("mouse", n(y(a.that.__zoom, a.mouse[0] = Ft(e, i), a.mouse[1]), a.extent, o));
		}
		function p(e) {
			s.on("mousemove.zoom mouseup.zoom", null), Vt(e.view, a.moved), Ao(e), a.event(e).end();
		}
	}
	function D(r, ...i) {
		if (e.apply(this, arguments)) {
			var a = this.__zoom, c = Ft(r.changedTouches ? r.changedTouches[0] : r, this), l = a.invert(c), u = a.k * (r.shiftKey ? .5 : 2), d = n(y(v(a, u), c, l), t.apply(this, i), o);
			Ao(r), s > 0 ? U(this).transition().duration(s).call(S, d, c, r) : U(this).call(_.transform, d, c, r);
		}
	}
	function O(t, ...n) {
		if (e.apply(this, arguments)) {
			var r = t.touches, i = r.length, a = C(this, n, t.changedTouches.length === i).event(t), o, s, c, l;
			for (ko(t), s = 0; s < i; ++s) c = r[s], l = Ft(c, this), l = [
				l,
				this.__zoom.invert(l),
				c.identifier
			], a.touch0 ? !a.touch1 && a.touch0[2] !== l[2] && (a.touch1 = l, a.taps = 0) : (a.touch0 = l, o = !0, a.taps = 1 + !!u);
			u &&= clearTimeout(u), o && (a.taps < 2 && (d = l[0], u = setTimeout(function() {
				u = null;
			}, p)), zr(this), a.start());
		}
	}
	function k(e, ...t) {
		if (this.__zooming) {
			var r = C(this, t).event(e), i = e.changedTouches, a = i.length, s, c, l, u;
			for (Ao(e), s = 0; s < a; ++s) c = i[s], l = Ft(c, this), r.touch0 && r.touch0[2] === c.identifier ? r.touch0[0] = l : r.touch1 && r.touch1[2] === c.identifier && (r.touch1[0] = l);
			if (c = r.that.__zoom, r.touch1) {
				var d = r.touch0[0], f = r.touch0[1], p = r.touch1[0], m = r.touch1[1], h = (h = p[0] - d[0]) * h + (h = p[1] - d[1]) * h, g = (g = m[0] - f[0]) * g + (g = m[1] - f[1]) * g;
				c = v(c, Math.sqrt(h / g)), l = [(d[0] + p[0]) / 2, (d[1] + p[1]) / 2], u = [(f[0] + m[0]) / 2, (f[1] + m[1]) / 2];
			} else if (r.touch0) l = r.touch0[0], u = r.touch0[1];
			else return;
			r.zoom("touch", n(y(c, l, u), r.extent, o));
		}
	}
	function A(e, ...t) {
		if (this.__zooming) {
			var n = C(this, t).event(e), r = e.changedTouches, i = r.length, a, o;
			for (ko(e), f && clearTimeout(f), f = setTimeout(function() {
				f = null;
			}, p), a = 0; a < i; ++a) o = r[a], n.touch0 && n.touch0[2] === o.identifier ? delete n.touch0 : n.touch1 && n.touch1[2] === o.identifier && delete n.touch1;
			if (n.touch1 && !n.touch0 && (n.touch0 = n.touch1, delete n.touch1), n.touch0) n.touch0[1] = this.__zoom.invert(n.touch0[0]);
			else if (n.end(), n.taps === 2 && (o = Ft(o, this), Math.hypot(d[0] - o[0], d[1] - o[1]) < g)) {
				var s = U(this).on("dblclick.zoom");
				s && s.apply(this, arguments);
			}
		}
	}
	return _.wheelDelta = function(e) {
		return arguments.length ? (r = typeof e == "function" ? e : wo(+e), _) : r;
	}, _.filter = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : wo(!!t), _) : e;
	}, _.touchable = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : wo(!!e), _) : i;
	}, _.extent = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : wo([[+e[0][0], +e[0][1]], [+e[1][0], +e[1][1]]]), _) : t;
	}, _.scaleExtent = function(e) {
		return arguments.length ? (a[0] = +e[0], a[1] = +e[1], _) : [a[0], a[1]];
	}, _.translateExtent = function(e) {
		return arguments.length ? (o[0][0] = +e[0][0], o[1][0] = +e[1][0], o[0][1] = +e[0][1], o[1][1] = +e[1][1], _) : [[o[0][0], o[0][1]], [o[1][0], o[1][1]]];
	}, _.constrain = function(e) {
		return arguments.length ? (n = e, _) : n;
	}, _.duration = function(e) {
		return arguments.length ? (s = +e, _) : s;
	}, _.interpolate = function(e) {
		return arguments.length ? (c = e, _) : c;
	}, _.on = function() {
		var e = l.on.apply(l, arguments);
		return e === l ? _ : e;
	}, _.clickDistance = function(e) {
		return arguments.length ? (h = (e = +e) * e, _) : Math.sqrt(h);
	}, _.tapDistance = function(e) {
		return arguments.length ? (g = +e, _) : g;
	}, _;
}
var Ro = {
	graphContainer: "_graphContainer_1f4el_3",
	flowSingleDot: "_flowSingleDot_1f4el_1"
}, zo = /* @__PURE__ */ h(((e, t) => {
	function n(e) {
		let t = 2166136261;
		for (let n = 0; n < e.length; n++) t ^= e.charCodeAt(n), t = Math.imul(t, 16777619) >>> 0;
		return t >>> 0;
	}
	function r(e) {
		let t = e >>> 0;
		return function() {
			t = t + 1831565813 >>> 0;
			let e = t;
			return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
		};
	}
	function i(e) {
		let t = r(n(String(e))), i = (e, n) => e + (n - e) * t(), a = [{
			amp: i(.03, .07),
			freq: i(.6, 1.2),
			phase: i(0, Math.PI * 2)
		}, {
			amp: i(.01, .03),
			freq: i(2, 3.5),
			phase: i(0, Math.PI * 2)
		}], o = Array.from({ length: 24 }, () => i(-1, 1)), s = [], c = 2 + Math.floor(t() * 3);
		for (let e = 0; e < c; e++) {
			let e = t() < .5 ? -1 : 1, n = {
				t: i(.12, .88),
				angle: e * i(.45, 1.1),
				length: i(.12, .3),
				bend: i(-.5, .5),
				width: i(.45, .7),
				forks: []
			}, r = t() < .6 ? 1 + Math.floor(t() * 2) : 0;
			for (let e = 0; e < r; e++) n.forks.push({
				t: i(.35, .8),
				angle: (t() < .5 ? -1 : 1) * i(.4, .9),
				length: i(.35, .6)
			});
			s.push(n);
		}
		return {
			waves: a,
			grain: o,
			branches: s
		};
	}
	var a = (e) => (Math.round(e * 10) / 10).toString();
	function o(e, t, n, r) {
		let i = t.x - e.x, a = t.y - e.y, o = Math.hypot(i, a) || 1, s = -a / o, c = i / o, l = [];
		for (let t = 0; t <= r; t++) {
			let u = t / r, d = Math.sin(Math.PI * u), f = 0;
			for (let e of n.waves) f += e.amp * Math.sin(e.freq * Math.PI * 2 * u + e.phase);
			f = f * d * o + n.grain[t % n.grain.length] * Math.min(2.2, o * .006) * d, l.push([e.x + i * u + s * f, e.y + a * u + c * f]);
		}
		return l;
	}
	function s(e) {
		if (!e.length) return "";
		let t = `M${a(e[0][0])} ${a(e[0][1])}`;
		for (let n = 1; n < e.length; n++) t += `L${a(e[n][0])} ${a(e[n][1])}`;
		return t;
	}
	function c(e, t, n, r, i, a = 6) {
		let o = [], s = t + n, c = e[0], l = e[1];
		o.push([c, l]);
		let u = r / a;
		for (let e = 1; e <= a; e++) s += i / a, c += Math.cos(s) * u, l += Math.sin(s) * u, o.push([c, l]);
		return o;
	}
	function l(e, t, n) {
		if (!e || !t || !Number.isFinite(e.x) || !Number.isFinite(t.x)) return {
			main: "",
			fine: ""
		};
		let r = Math.hypot(t.x - e.x, t.y - e.y);
		if (r < 4) return {
			main: "",
			fine: ""
		};
		let i = Math.max(8, Math.min(48, Math.round(r / 16))), a = o(e, t, n, i), l = Math.atan2(t.y - e.y, t.x - e.x), u = "";
		for (let e of n.branches) {
			let t = a[Math.round(e.t * i)], n = Math.min(Math.max(e.length * r, 44), 220), o = c(t, l, e.angle, n, e.bend);
			u += s(o);
			for (let t of e.forks) {
				let r = o[Math.round(t.t * (o.length - 1))], i = l + e.angle + e.bend * t.t;
				u += s(c(r, i, t.angle, n * t.length, e.bend * .5, 4));
			}
		}
		return {
			main: s(a),
			fine: u
		};
	}
	function u({ containers: e = [], memberOf: t = /* @__PURE__ */ new Map(), sequence: n = [] }) {
		let r = [];
		for (let t of e) t.parent && r.push({
			key: `c:${t.parent}>${t.id}`,
			from: { container: t.parent },
			to: { container: t.id },
			reach: { container: t.id }
		});
		let i = new Set(n.map((e) => e.target)), a = /* @__PURE__ */ new Set();
		for (let e of n) i.has(e.source) || a.add(e.source);
		for (let e of a) {
			let n = t.get(e);
			n && r.push({
				key: `s:${n}>${e}`,
				from: { container: n },
				to: { node: e },
				reach: { node: e }
			});
		}
		for (let e of n) r.push({
			key: `e:${e.source}>${e.target}`,
			from: { node: e.source },
			to: { node: e.target },
			reach: { node: e.target }
		});
		return r;
	}
	t.exports = {
		hashString: n,
		rng: r,
		rootShape: i,
		rootPath: l,
		rootSegments: u
	};
})), Bo = (/* @__PURE__ */ h(((e, t) => {
	var { hashString: n, rng: r } = zo(), i = (e) => (Math.round(e * 10) / 10).toString();
	function a(e, t, n, r = 12) {
		n = Math.max(0, Math.min(n, e / 2, t / 2));
		let i = [], a = (e, t, n, a) => {
			let o = Math.max(1, Math.round(Math.hypot(n - e, a - t) / r));
			for (let r = 0; r < o; r++) i.push([e + (n - e) * r / o, t + (a - t) * r / o]);
		}, o = (e, t, a) => {
			let o = Math.max(2, Math.round(Math.PI / 2 * n / r));
			for (let r = 0; r < o; r++) {
				let s = a + Math.PI / 2 * r / o;
				i.push([e + Math.cos(s) * n, t + Math.sin(s) * n]);
			}
		};
		return a(n, 0, e - n, 0), o(e - n, n, -Math.PI / 2), a(e, n, e, t - n), o(e - n, t - n, 0), a(e - n, t, n, t), o(n, t - n, Math.PI / 2), a(0, t - n, 0, n), o(n, n, Math.PI), i;
	}
	function o(e, t, o, s, { inset: c = 1.5, wobble: l = .9 } = {}) {
		let u = r(n(String(s))), d = a(e - c * 2, t - c * 2, o).map(([e, t]) => [e + c, t + c]), f = (e, t, n) => {
			let r = d.length, i = [];
			for (let a = 0; a <= r + n; a++) {
				let [n, o] = d[(t + a) % r];
				i.push([n + (u() - .5) * 2 * e, o + (u() - .5) * 2 * e]);
			}
			return i;
		}, p = (e) => e.map((e, t) => `${t ? "L" : "M"}${i(e[0])} ${i(e[1])}`).join("");
		return {
			main: p(f(l, 0, 2)),
			ghost: p(f(l * 1.8, Math.floor(u() * d.length), 1))
		};
	}
	function s(e, t) {
		if (!e) return "";
		let a = String(e).match(/-?\d+(?:\.\d+)?(?:e-?\d+)?/gi);
		if (!a || a.length < 4) return "";
		let o = a.map(Number), s = r(n(String(t))), c = (e) => (s() - .5) * 2 * e, [l, u] = [o[0], o[1]], [d, f] = [o[o.length - 2], o[o.length - 1]], p = Math.hypot(d - l, f - u) || 1, m = -(f - u) / p, h = (d - l) / p, g = c(Math.min(6, p * .03)), _ = (o.length >= 6 ? o[2] : (l + d) / 2) + m * g, v = (o.length >= 6 ? o[3] : (u + f) / 2) + h * g;
		return `M${i(l + c(1.5))} ${i(u + c(1.5))}Q${i(_)} ${i(v)} ${i(d + c(1.5))} ${i(f + c(1.5))}`;
	}
	function c(e, t, i = 3) {
		let a = r(n(String(t))), o = [];
		return e.map((e, t) => {
			for (; o.length <= t;) o.push([(a() - .5) * 2 * i, (a() - .5) * 2 * i]);
			return [e[0] + o[t][0], e[1] + o[t][1]];
		});
	}
	t.exports = {
		roughRect: o,
		ghostOf: s,
		jitterPoints: c,
		roundedRectPoints: a
	};
})))(), K = {
	card: "_card_1anbf_5",
	draft: "_draft_1anbf_24",
	published: "_published_1anbf_28",
	pinned: "_pinned_1anbf_32",
	title: "_title_1anbf_40",
	titleCentered: "_titleCentered_1anbf_51",
	titleInline: "_titleInline_1anbf_67",
	preview: "_preview_1anbf_77",
	scroll: "_scroll_1anbf_87",
	full: "_full_1anbf_103",
	listening: "_listening_1anbf_110",
	popout: "_popout_1anbf_133",
	imageCard: "_imageCard_1anbf_152",
	imageFrame: "_imageFrame_1anbf_163",
	imageCaption: "_imageCaption_1anbf_180",
	scrollFull: "_scrollFull_1anbf_191",
	titleScrolling: "_titleScrolling_1anbf_195",
	imageMark: "_imageMark_1anbf_207",
	bookmarkMark: "_bookmarkMark_1anbf_221",
	bookmarkCount: "_bookmarkCount_1anbf_240",
	readersMark: "_readersMark_1anbf_249",
	glow: "_glow_1anbf_271",
	cardTitle: "_cardTitle_1anbf_281",
	resizeGrip: "_resizeGrip_1anbf_287",
	cardCenter: "_cardCenter_1anbf_331",
	cardSubtitle: "_cardSubtitle_1anbf_351",
	readBar: "_readBar_1anbf_397",
	readFill: "_readFill_1anbf_408",
	readMark: "_readMark_1anbf_415",
	complete: "_complete_1anbf_425",
	sketchBorder: "_sketchBorder_1anbf_435",
	sketchMain: "_sketchMain_1anbf_448",
	sketchGhost: "_sketchGhost_1anbf_449",
	linkCard: "_linkCard_1anbf_476",
	linkHover: "_linkHover_1anbf_484",
	linkTitle: "_linkTitle_1anbf_488",
	linkSubtitle: "_linkSubtitle_1anbf_495",
	linkBlurb: "_linkBlurb_1anbf_502",
	linkOut: "_linkOut_1anbf_512"
}, Vo = {
	handle: "_handle_11op8_1",
	resizing: "_resizing_11op8_11",
	handleN: "_handleN_11op8_16",
	handleS: "_handleS_11op8_24",
	handleW: "_handleW_11op8_32",
	handleE: "_handleE_11op8_40",
	handleNW: "_handleNW_11op8_49",
	handleNE: "_handleNE_11op8_57",
	handleSW: "_handleSW_11op8_65",
	handleSE: "_handleSE_11op8_73"
}, Ho = 140, Uo = 80, Wo = 700, Go = 700;
function Ko({ width: e, height: t, zoomScale: n = 1, onResize: i, onResizeEnd: a }) {
	let [o, l] = c(!1), u = s(null), d = (r, o) => {
		o.stopPropagation(), o.preventDefault(), l(!0), u.current = {
			direction: r,
			startX: o.clientX,
			startY: o.clientY,
			startW: e,
			startH: t,
			scale: n > 0 ? n : 1
		};
		let s = (e) => {
			if (!u.current) return;
			let { direction: t, startX: n, startY: r, startW: a, startH: o, scale: s } = u.current, c = (e.clientX - n) / s, l = (e.clientY - r) / s, d = a, f = o;
			t.includes("e") && (d = a + c), t.includes("w") && (d = a - c), t.includes("s") && (f = o + l), t.includes("n") && (f = o - l), d = Math.max(Ho, Math.min(Wo, Math.round(d))), f = Math.max(Uo, Math.min(Go, Math.round(f))), i && i({
				width: d,
				height: f
			});
		}, c = (e) => {
			window.removeEventListener("pointermove", s), window.removeEventListener("pointerup", c), document.body.style.cursor = "", l(!1), u.current = null, a && a();
		}, d = {
			nw: "nwse-resize",
			ne: "nesw-resize",
			sw: "nesw-resize",
			se: "nwse-resize",
			n: "ns-resize",
			s: "ns-resize",
			w: "ew-resize",
			e: "ew-resize"
		};
		document.body.style.cursor = d[r] || "nwse-resize", window.addEventListener("pointermove", s), window.addEventListener("pointerup", c);
	};
	return r(() => () => {
		document.body.style.cursor = "";
	}, []), /* @__PURE__ */ m("div", {
		className: o ? Vo.resizing : void 0,
		children: [
			/* @__PURE__ */ p("div", {
				className: `${Vo.handle} ${Vo.handleN}`,
				onPointerDown: (e) => d("n", e),
				title: "Drag to resize height"
			}),
			/* @__PURE__ */ p("div", {
				className: `${Vo.handle} ${Vo.handleS}`,
				onPointerDown: (e) => d("s", e),
				title: "Drag to resize height"
			}),
			/* @__PURE__ */ p("div", {
				className: `${Vo.handle} ${Vo.handleW}`,
				onPointerDown: (e) => d("w", e),
				title: "Drag to resize width"
			}),
			/* @__PURE__ */ p("div", {
				className: `${Vo.handle} ${Vo.handleE}`,
				onPointerDown: (e) => d("e", e),
				title: "Drag to resize width"
			}),
			/* @__PURE__ */ p("div", {
				className: `${Vo.handle} ${Vo.handleNW}`,
				onPointerDown: (e) => d("nw", e),
				title: "Drag to resize"
			}),
			/* @__PURE__ */ p("div", {
				className: `${Vo.handle} ${Vo.handleNE}`,
				onPointerDown: (e) => d("ne", e),
				title: "Drag to resize"
			}),
			/* @__PURE__ */ p("div", {
				className: `${Vo.handle} ${Vo.handleSW}`,
				onPointerDown: (e) => d("sw", e),
				title: "Drag to resize"
			}),
			/* @__PURE__ */ p("div", {
				className: `${Vo.handle} ${Vo.handleSE}`,
				onPointerDown: (e) => d("se", e),
				title: "Drag to resize"
			})
		]
	});
}
//#endregion
//#region src/components/TTS/TTS.module.css
var qo = (/* @__PURE__ */ h(((e, t) => {
	var n = [
		"zero",
		"one",
		"two",
		"three",
		"four",
		"five",
		"six",
		"seven",
		"eight",
		"nine",
		"ten",
		"eleven",
		"twelve",
		"thirteen",
		"fourteen",
		"fifteen",
		"sixteen",
		"seventeen",
		"eighteen",
		"nineteen"
	], r = [
		"",
		"",
		"twenty",
		"thirty",
		"forty",
		"fifty",
		"sixty",
		"seventy",
		"eighty",
		"ninety"
	];
	function i(e) {
		let t = parseInt(e, 10);
		if (isNaN(t) || t < 0 || t > 99) return String(e);
		if (t < 20) return n[t];
		let i = t % 10;
		return r[Math.floor(t / 10)] + (i ? `-${n[i]}` : "");
	}
	function a(e) {
		return e && e.charAt(0).toUpperCase() + e.slice(1);
	}
	function o(e, t) {
		let n = t && t.series_part != null && t.series_part !== "" ? t.series_part : null, r = e && e.author && (e.author.display || e.author.name) || "";
		return {
			n: n == null ? "" : String(n),
			n_words: n == null ? "" : i(n),
			N_words: n == null ? "" : a(i(n)),
			book: e && e.site && e.site.title || "",
			author: r,
			title: t && (t.title || t.label) || ""
		};
	}
	function s(e, t) {
		let n = !1, r = String(e).replace(/\{(\w+)\}/g, (e, r) => {
			let i = t[r];
			return i == null || i === "" ? (n = !0, "") : i;
		});
		return n ? null : r.trim();
	}
	function c(e, t) {
		let n = e && e.reader && e.reader.header || {}, r = o(e, t), i = null;
		if (n.kicker) {
			let e = (Array.isArray(n.kicker) ? n.kicker : [n.kicker]).map((e) => s(e, r)).filter(Boolean);
			e.length && (i = e.join(n.separator == null ? " — " : n.separator));
		}
		return {
			kicker: i,
			byline: n.byline !== !1
		};
	}
	t.exports = {
		readerHeader: c,
		numberToLowercaseWords: i
	};
})))(), q = {
	ttsGroup: "_ttsGroup_13j86_7",
	tb: "_tb_13j86_19",
	tbTooltip: "_tbTooltip_13j86_46",
	select: "_select_13j86_68",
	params: "_params_13j86_85",
	loadingBarContainer: "_loadingBarContainer_13j86_133",
	loadingBarFill: "_loadingBarFill_13j86_145",
	visualizer: "_visualizer_13j86_151",
	bar: "_bar_13j86_161",
	bounce: "_bounce_13j86_1",
	errorToast: "_errorToast_13j86_183",
	show: "_show_13j86_198",
	statusBadge: "_statusBadge_13j86_202",
	pulse: "_pulse_13j86_1",
	error: "_error_13j86_183",
	ttsSettings: "_ttsSettings_13j86_226",
	settingRow: "_settingRow_13j86_235",
	paramValue: "_paramValue_13j86_264",
	fallbackNote: "_fallbackNote_13j86_275",
	cardStrip: "_cardStrip_13j86_285",
	tbSmall: "_tbSmall_13j86_295",
	cardSelect: "_cardSelect_13j86_303",
	cardSpeed: "_cardSpeed_13j86_311"
}, Jo = {
	play: "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><polygon points=\"5,3 19,12 5,21\"/></svg>",
	pause: "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><rect x=\"5\" y=\"3\" width=\"4\" height=\"18\"/><rect x=\"15\" y=\"3\" width=\"4\" height=\"18\"/></svg>",
	stop: "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"2\"/></svg>",
	close: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\"/><line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\"/></svg>",
	info: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><line x1=\"12\" y1=\"16\" x2=\"12\" y2=\"12\"/><line x1=\"12\" y1=\"8\" x2=\"12.01\" y2=\"8\"/></svg>",
	download: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/><polyline points=\"7,10 12,15 17,10\"/><line x1=\"12\" y1=\"15\" x2=\"12\" y2=\"3\"/></svg>",
	copy: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"/><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"/></svg>",
	link: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\"/><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\"/></svg>",
	globe: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\"/><path d=\"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z\"/></svg>",
	medium: "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z\"/></svg>",
	substack: "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z\"/></svg>",
	youtube: "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z\"/><polygon fill=\"#fff\" points=\"9.545,15.568 15.818,12 9.545,8.432\"/></svg>",
	bookmark: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z\"/></svg>",
	bookmarkList: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z\"/><line x1=\"9\" y1=\"8\" x2=\"15\" y2=\"8\"/><line x1=\"9\" y1=\"12\" x2=\"13\" y2=\"12\"/></svg>",
	linkHere: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\"/><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\"/><polyline points=\"4 4 4 9 9 9\"/></svg>",
	trash: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"3 6 5 6 21 6\"/><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"/></svg>",
	settings: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"4\" y1=\"6\" x2=\"20\" y2=\"6\"/><line x1=\"4\" y1=\"12\" x2=\"20\" y2=\"12\"/><line x1=\"4\" y1=\"18\" x2=\"20\" y2=\"18\"/><circle cx=\"9\" cy=\"6\" r=\"2\" fill=\"currentColor\"/><circle cx=\"15\" cy=\"12\" r=\"2\" fill=\"currentColor\"/><circle cx=\"7\" cy=\"18\" r=\"2\" fill=\"currentColor\"/></svg>"
}, Yo = (/* @__PURE__ */ h(((e, t) => {
	function n(e) {
		return !(e && e.cards && e.cards.listen === !1);
	}
	function r(e, t) {
		if (!e || !t || !(typeof e.target == "function" && e.target() === t)) return "off";
		let n = typeof e.state == "function" ? e.state() : "stopped";
		return n === "stopped" ? "off" : n;
	}
	function i(e, t, n) {
		if (!e || !t) return null;
		let i = r(e, t);
		return i === "playing" || i === "loading" ? (e.pause(), "pause") : i === "paused" ? (e.resume(), "resume") : (e.play(t, Object.assign({ scrollContainer: t }, n || {})), "play");
	}
	function a(e, t) {
		return r(e, t) === "off" ? !1 : (e.stop(), !0);
	}
	t.exports = {
		listenInCard: n,
		listenState: r,
		toggleListen: i,
		stopListening: a
	};
})))();
function Xo() {
	let [e, t] = c(null), [n, i] = c("stopped"), [a, o] = c(null), [s, l] = c([]), [u, d] = c(""), [f, p] = c([]), [m, h] = c(""), [g, _] = c({}), [v, y] = c({}), [b, x] = c(0), [S, C] = c(""), [w, T] = c(null), [E, D] = c(!1), [O, k] = c("");
	return r(() => {
		if (!window.TTS) return;
		let e = window.TTS;
		t(e);
		let n = (t) => {
			i(t), o(e.target ? e.target() : null), t !== "loading" && x(0), (t === "playing" || t === "stopped") && (E || T(null));
		}, r = (e) => x(e * 100), a = ({ engine: e, progress: t }) => {
			t && t.status === "progress" && t.progress !== void 0 ? T(`Loading ${e}: ${Math.round(t.progress * 100)}%`) : t && t.status && T(`Loading ${e}...`);
		}, s = (e) => {
			let t = e && (e.error || e.message || String(e)), n = e && e.engine;
			C(t || "TTS error"), D(!0), T(`${n || "TTS"} error: ${t || "Playback failed"}`), setTimeout(() => {
				C(""), T(null), D(!1);
			}, 5e3);
		}, c = () => {
			l(e.engines()), d(e.selected());
		}, u = () => {
			let t = e.voices();
			p(t);
			let n = e.capabilities();
			_(n);
			let r = {};
			for (let i of Object.keys(n)) if (i === "voice") {
				let r = e.get("voice"), i = e.lastFallback ? e.lastFallback() : null;
				i && i.to && i.to.engine === e.selected() && (i.to.voice || null) === (r || null) ? h(r || "") : ((!r || t.length && !t.some((e) => e.id === r)) && (r = n.voice.default || t[0] && t[0].id), r && (e.set("voice", r), h(r)));
			} else r[i] = e.get(i) === void 0 ? n[i].default : e.get(i);
			y(r);
		}, f = (e) => {
			c(), u(), k(e && e.note || "");
		}, m = (e) => {
			!e || !e.key || (e.key === "voice" ? h(e.value || "") : y((t) => t[e.key] === e.value ? t : {
				...t,
				[e.key]: e.value
			}));
		};
		e.on("state", n), e.on("paramChanged", m), e.on("capabilitiesChanged", u), e.on("engineProgress", r), e.on("loadingProgress", a), e.on("error", s), e.on("fallback", f), c(), u(), e.state && n(e.state());
		let g = e.lastFallback ? e.lastFallback() : null;
		return g && g.note && k(g.note), window.speechSynthesis && window.speechSynthesis.addEventListener("voiceschanged", u), () => {
			e.off && (e.off("state", n), e.off("paramChanged", m), e.off("capabilitiesChanged", u), e.off("engineProgress", r), e.off("loadingProgress", a), e.off("error", s), e.off("fallback", f)), window.speechSynthesis && window.speechSynthesis.removeEventListener("voiceschanged", u);
		};
	}, []), {
		T: e,
		state: n,
		target: a,
		engines: s,
		selectedEngine: u,
		voices: f,
		selectedVoice: m,
		capabilities: g,
		params: v,
		engineProgress: b,
		errorMsg: S,
		statusMessage: w,
		isError: E,
		setStatusMessage: T,
		setIsError: D,
		fallbackNote: O,
		handleEngineChange: (t) => {
			if (!e) return;
			let n = t.target.value;
			e.select(n), d(n), T(null), D(!1), k(""), p(e.voices()), _(e.capabilities());
		},
		handleVoiceChange: (t) => {
			if (!e) return;
			let n = t.target.value;
			e.clearFallback && e.clearFallback(), k(""), e.set("voice", n || void 0), h(n);
		},
		handleParamChange: (t, n) => {
			e && (e.set(t, n), y((e) => ({
				...e,
				[t]: n
			})));
		}
	};
}
function Zo({ targetRef: e }) {
	let { T: t, state: n, engineProgress: r, errorMsg: i, statusMessage: a, isError: o, setStatusMessage: s, setIsError: c } = Xo();
	return t ? /* @__PURE__ */ m("div", {
		className: q.ttsGroup,
		style: { position: "relative" },
		children: [
			n !== "playing" && /* @__PURE__ */ p("button", {
				className: q.tb,
				onClick: () => {
					if (!(!t || !e.current)) {
						if (s(null), c(!1), n === "paused" && t.resume) {
							t.resume();
							return;
						}
						t.play(e.current, { scrollContainer: e.current });
					}
				},
				title: "Play",
				dangerouslySetInnerHTML: { __html: `${Jo.play}<span class="${q.tbTooltip}">Play</span>` }
			}),
			n === "playing" && /* @__PURE__ */ p("button", {
				className: q.tb,
				onClick: () => {
					t && t.pause();
				},
				title: "Pause",
				dangerouslySetInnerHTML: { __html: `${Jo.pause}<span class="${q.tbTooltip}">Pause</span>` }
			}),
			(n === "playing" || n === "paused" || n === "loading") && /* @__PURE__ */ p("button", {
				className: q.tb,
				onClick: () => {
					t && t.stop();
				},
				title: "Stop",
				dangerouslySetInnerHTML: { __html: `${Jo.stop}<span class="${q.tbTooltip}">Stop</span>` }
			}),
			n === "loading" && r > 0 && /* @__PURE__ */ p("div", {
				className: q.loadingBarContainer,
				children: /* @__PURE__ */ p("div", {
					className: q.loadingBarFill,
					style: { width: `${r}%` }
				})
			}),
			n === "playing" && /* @__PURE__ */ m("div", {
				className: q.visualizer,
				children: [
					/* @__PURE__ */ p("div", { className: q.bar }),
					/* @__PURE__ */ p("div", { className: q.bar }),
					/* @__PURE__ */ p("div", { className: q.bar }),
					/* @__PURE__ */ p("div", { className: q.bar })
				]
			}),
			/* @__PURE__ */ p("div", {
				className: `${q.errorToast} ${i ? q.show : ""}`,
				children: i
			}),
			a && /* @__PURE__ */ p("span", {
				className: `${q.statusBadge} ${o ? q.error : ""}`,
				children: a
			})
		]
	}) : null;
}
function Qo() {
	let { T: e, engines: t, selectedEngine: n, voices: r, selectedVoice: i, capabilities: a, params: o, fallbackNote: s, handleEngineChange: c, handleVoiceChange: l, handleParamChange: u } = Xo();
	if (!e) return null;
	let d = typeof window < "u" ? window.PPVoices : null, f = typeof window < "u" && window.TTS_CONFIG && window.TTS_CONFIG.lang || "en", h = s && !r.some((e) => e.id === i) ? /* @__PURE__ */ p("option", {
		value: i,
		children: i || "This device's own voice"
	}, "pp-fallback-voice") : null;
	return /* @__PURE__ */ m("div", {
		className: q.ttsSettings,
		"data-tts-settings": !0,
		children: [
			t.length > 1 && /* @__PURE__ */ p("select", {
				className: q.select,
				style: { maxWidth: 110 },
				value: n,
				onChange: c,
				title: "TTS Engine",
				children: t.map((e) => /* @__PURE__ */ p("option", {
					value: e.id,
					children: e.label
				}, e.id))
			}),
			/* @__PURE__ */ m("label", {
				className: q.settingRow,
				children: [/* @__PURE__ */ p("span", { children: "Voice" }), /* @__PURE__ */ p("select", {
					className: q.select,
					value: i,
					onChange: l,
					title: "Voices on this device",
					"data-tts-voice": !0,
					children: (() => {
						if (!r.length) return h || /* @__PURE__ */ p("option", { children: "Loading..." });
						let e = (e) => /* @__PURE__ */ p("option", {
							value: e.id,
							children: e.label
						}, e.id), t = d && d.voiceGroups ? d.voiceGroups(r, { lang: f }) : [];
						return t.length < 2 ? [h, ...r.map(e)] : [h, ...t.map((t) => /* @__PURE__ */ p("optgroup", {
							label: t.label,
							children: t.voices.map(e)
						}, t.label))];
					})()
				})]
			}),
			s && /* @__PURE__ */ p("div", {
				className: q.fallbackNote,
				role: "status",
				"data-tts-fallback-note": !0,
				children: s
			}),
			/* @__PURE__ */ p("div", {
				className: q.params,
				children: Object.entries(a).map(([e, t]) => !t || e === "voice" || e === "pitch" || e === "volume" ? null : t.type === "range" ? /* @__PURE__ */ m("label", {
					className: q.settingRow,
					title: `${t.label}: ${o[e]}`,
					children: [/* @__PURE__ */ m("span", { children: [
						t.label,
						" ",
						/* @__PURE__ */ m("span", {
							className: q.paramValue,
							children: [Number(o[e] ?? t.default).toFixed(1), "×"]
						})
					] }), /* @__PURE__ */ p("input", {
						"data-tts-param": e,
						type: "range",
						min: t.min,
						max: t.max,
						step: t.step || .1,
						value: o[e] ?? t.default,
						onChange: (t) => u(e, parseFloat(t.target.value))
					})]
				}, e) : t.type === "select" ? /* @__PURE__ */ m("label", {
					className: q.settingRow,
					children: [/* @__PURE__ */ p("span", { children: t.label }), /* @__PURE__ */ p("select", {
						value: o[e] ?? t.default,
						onChange: (t) => u(e, t.target.value),
						children: t.options.map((e) => /* @__PURE__ */ p("option", {
							value: e.value,
							children: e.label
						}, e.value))
					})]
				}, e) : null)
			})
		]
	});
}
function $o() {
	let { T: e, state: n, target: r, voices: i, selectedVoice: a, capabilities: o, params: s, handleVoiceChange: c, handleParamChange: l } = Xo(), u = t.useRef(null);
	if (!e) return null;
	let d = () => {
		let e = u.current && u.current.closest("[data-pp-card]");
		return e ? e.querySelector(".rp-scroll") : null;
	}, f = u.current ? d() : null, h = f && r === f ? n === "stopped" ? "off" : n : "off", g = (e) => {
		e.stopPropagation();
	}, _ = (t) => {
		g(t), (0, Yo.toggleListen)(e, d());
	}, v = (t) => {
		g(t), (0, Yo.stopListening)(e, d());
	}, y = o && o.speed, b = (e, t) => ({ __html: `${Jo[e]}<span class="${q.tbTooltip}">${t}</span>` });
	return /* @__PURE__ */ m("div", {
		ref: u,
		className: q.cardStrip,
		"data-pp-listen": !0,
		"data-pp-listen-state": h,
		onClick: g,
		onDoubleClick: g,
		onPointerDown: g,
		onMouseDown: g,
		onTouchStart: g,
		children: [
			h === "playing" || h === "loading" ? /* @__PURE__ */ p("button", {
				type: "button",
				className: `${q.tb} ${q.tbSmall}`,
				onClick: _,
				title: "Pause",
				"aria-label": "Pause",
				"data-pp-listen-play": !0,
				dangerouslySetInnerHTML: b("pause", "Pause")
			}) : /* @__PURE__ */ p("button", {
				type: "button",
				className: `${q.tb} ${q.tbSmall}`,
				onClick: _,
				title: h === "paused" ? "Play" : "Listen",
				"aria-label": h === "paused" ? "Play" : "Listen",
				"data-pp-listen-play": !0,
				dangerouslySetInnerHTML: b("play", h === "paused" ? "Play" : "Listen")
			}),
			h !== "off" && /* @__PURE__ */ p("button", {
				type: "button",
				className: `${q.tb} ${q.tbSmall}`,
				onClick: v,
				title: "Stop",
				"aria-label": "Stop",
				"data-pp-listen-stop": !0,
				dangerouslySetInnerHTML: b("stop", "Stop")
			}),
			i.length > 0 && /* @__PURE__ */ m("select", {
				className: `${q.select} ${q.cardSelect}`,
				value: a,
				onChange: c,
				title: "Voice",
				"aria-label": "Voice",
				"data-pp-listen-voice": !0,
				children: [!i.some((e) => e.id === a) && /* @__PURE__ */ p("option", {
					value: a,
					children: a || "This device's own voice"
				}), i.map((e) => /* @__PURE__ */ p("option", {
					value: e.id,
					children: e.label
				}, e.id))]
			}),
			y && y.type === "range" && /* @__PURE__ */ m("label", {
				className: q.cardSpeed,
				title: `${y.label}: ${Number(s.speed ?? y.default).toFixed(1)}×`,
				children: [/* @__PURE__ */ p("input", {
					type: "range",
					min: y.min,
					max: y.max,
					step: y.step || .1,
					value: s.speed ?? y.default,
					onChange: (e) => l("speed", parseFloat(e.target.value)),
					"aria-label": y.label,
					"data-pp-listen-speed": !0
				}), /* @__PURE__ */ m("span", {
					className: q.paramValue,
					children: [Number(s.speed ?? y.default).toFixed(1), "×"]
				})]
			})
		]
	});
}
//#endregion
//#region src/components/NodeView/TextView/TextView.jsx
var es = /* @__PURE__ */ new Map();
function ts(e, t, n, r) {
	let i = `${e}|${Math.round(t)}|${Math.round(n)}|${r}`, a = es.get(i);
	return a || (es.size > 400 && es.clear(), a = (0, Bo.roughRect)(t, n, r, e), es.set(i, a)), a;
}
function ns({ article: e, width: t, height: n, viewState: r, fullContent: i, onResize: a, cardSettings: o, sourceColor: s, listen: c = !0 }) {
	let { hovered: l = !1, pinned: u = !1, lod: d = "full", zoomScale: f = 1 } = r || {}, h = l || u, g = u && !!i, _ = u && c !== !1, v = !(e._status === "published" || e._status === "bloomed" || e.syndication && e.syndication.canonical), y = e.containerColor || s || e._source && e._source.color || (v ? "var(--nv-draft)" : "var(--nv-published)"), b = r?.contributionCount || 0, x = r?.bookmarkCount ?? (Array.isArray(r?.bookmarks) ? r.bookmarks.length : Array.isArray(e?.bookmarks) ? e.bookmarks.length : 0);
	if (e.kind === "image" && e.image) return /* @__PURE__ */ p(ss, {
		article: e,
		width: t,
		height: n,
		pinned: u,
		hovered: l,
		isDraft: v,
		zoomScale: f,
		bookmarkCount: x,
		onResize: a
	});
	let S = (e._source && e._source.prominence || e.originalItem && e.originalItem._source && e.originalItem._source.prominence || "secondary") === "primary" ? v ? "#24304a" : "#1e3a5f" : "#23232f";
	if (e.kind === "link" && e.link) return /* @__PURE__ */ p(os, {
		article: e,
		width: t,
		height: n,
		viewState: r,
		cardSettings: o,
		sourceColor: y,
		isDraft: v,
		bgColor: S
	});
	let C = !!e.image, w = r && r.progress, T = w ? Math.max(0, Math.min(1, w.max || 0)) : 0, E = !!(w && w.done), D = [
		K.card,
		E && K.complete,
		y && !u && K.glow,
		v ? K.draft : K.published,
		h && K.expanded,
		u && K.pinned,
		_ && K.listening
	].filter(Boolean).join(" "), O = o?.cornerRadius == null ? 10 : o.cornerRadius, k = !t || !n ? null : ts(e.id || e.title || "", t, n, O);
	return /* @__PURE__ */ m("div", {
		className: D,
		"data-pp-card": !0,
		style: {
			width: t,
			height: n,
			background: S,
			...o?.cornerRadius == null ? {} : { borderRadius: o.cornerRadius },
			...y && !u ? { "--nv-src": y } : {},
			...y && !u && e.containerColor ? { "--nv-outline": `var(--pp-node-color, ${y})` } : {}
		},
		children: [
			k && /* @__PURE__ */ m("svg", {
				className: K.sketchBorder,
				viewBox: `0 0 ${t} ${n}`,
				preserveAspectRatio: "none",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ p("path", {
					className: K.sketchGhost,
					d: k.ghost
				}), /* @__PURE__ */ p("path", {
					className: K.sketchMain,
					d: k.main
				})]
			}),
			x > 0 && /* @__PURE__ */ m("div", {
				className: K.bookmarkMark,
				title: x === 1 ? "1 bookmark" : `${x} bookmarks`,
				children: [/* @__PURE__ */ p("svg", {
					viewBox: "0 0 16 16",
					width: "12",
					height: "12",
					fill: "currentColor",
					children: /* @__PURE__ */ p("path", { d: "M3 2v12l5-3 5 3V2z" })
				}), x > 1 && /* @__PURE__ */ p("span", {
					className: K.bookmarkCount,
					children: x
				})]
			}),
			b > 0 && /* @__PURE__ */ m("div", {
				className: K.readersMark,
				title: b === 1 ? "1 from readers" : `${b} from readers`,
				"aria-label": b === 1 ? "1 from readers" : `${b} from readers`,
				"data-contrib-count": b,
				children: [/* @__PURE__ */ p("svg", {
					viewBox: "0 0 16 16",
					width: "11",
					height: "11",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "1.6",
					"aria-hidden": "true",
					children: /* @__PURE__ */ p("path", {
						d: "M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2z",
						strokeLinejoin: "round"
					})
				}), /* @__PURE__ */ p("span", { children: b })]
			}),
			C && /* @__PURE__ */ p("div", {
				className: K.imageMark,
				style: {
					backgroundImage: `url('${e.image}')`,
					...o?.imageMarkSize ? {
						width: o.imageMarkSize,
						height: o.imageMarkSize
					} : {}
				},
				title: "has an image"
			}),
			/* @__PURE__ */ p(as, {
				article: e,
				width: t,
				height: n - 0,
				bandHeight: 0,
				viewState: r,
				expanded: h,
				useFullArticle: g,
				fullContent: i,
				cardSettings: o,
				listening: _
			}),
			(T > 0 || E) && /* @__PURE__ */ p("div", {
				className: K.readBar,
				role: "progressbar",
				"aria-label": "Read",
				"aria-valuemin": 0,
				"aria-valuemax": 100,
				"aria-valuenow": Math.round((E ? 1 : T) * 100),
				"data-read-progress": E ? "done" : Math.round(T * 100),
				children: /* @__PURE__ */ p("div", {
					className: K.readFill,
					style: { width: `${(E ? 1 : T) * 100}%` }
				})
			}),
			E && /* @__PURE__ */ p("div", {
				className: K.readMark,
				title: "Read to the end",
				"aria-hidden": "true",
				children: "✓"
			}),
			u && /* @__PURE__ */ p(cs, {}),
			a && /* @__PURE__ */ p(Ko, {
				width: t,
				height: n,
				zoomScale: f,
				onResize: a
			})
		]
	});
}
function rs(e, t, n, r = {}) {
	let { min: i = 14, max: a = 36, lineHeight: o = 1.22, charRatio: s = .52, pad: c = 10, maxLines: l = 4 } = r, u = String(e || "").trim().split(/\s+/).filter(Boolean);
	if (!u.length || !t || !n) return i;
	let d = Math.max(t - c * 2, 8), f = Math.max(n - c * 2, 8), p = i;
	for (let e = 1; e <= Math.min(l, u.length); e++) {
		let t = Math.ceil(u.length / e), n = 0, r = 0;
		for (let e = 0; e < u.length; e += t) n = Math.max(n, u.slice(e, e + t).join(" ").length), r++;
		let i = d / Math.max(n * s, 1), a = f / Math.max(r * o, 1);
		p = Math.max(p, Math.min(i, a));
	}
	return Math.round(Math.max(i, Math.min(a, p)));
}
var is = 260;
function as({ article: e, width: t, height: n, bandHeight: r = 0, viewState: i, expanded: a, useFullArticle: o, fullContent: s, cardSettings: c, listening: l = !1 }) {
	if (a) {
		let t = o ? s : e.description || "", r = e.title || e.label;
		return n && n < is ? /* @__PURE__ */ m(f, { children: [l && /* @__PURE__ */ p($o, {}), /* @__PURE__ */ m("div", {
			className: `${K.scroll} ${K.scrollFull} ${o ? K.full : ""} rp-scroll`,
			children: [/* @__PURE__ */ p("div", {
				className: K.titleScrolling,
				"data-card-title": !0,
				children: r
			}), t && /* @__PURE__ */ p("div", { dangerouslySetInnerHTML: { __html: t } })]
		})] }) : /* @__PURE__ */ m(f, { children: [
			/* @__PURE__ */ p("div", {
				className: K.title,
				"data-card-title": !0,
				children: r
			}),
			l && /* @__PURE__ */ p($o, {}),
			t && /* @__PURE__ */ p("div", {
				className: `${K.scroll} ${o ? K.full : ""} rp-scroll`,
				dangerouslySetInnerHTML: { __html: t }
			})
		] });
	}
	let u = c?.subtitle || typeof window < "u" && window.SETTINGS?.graph?.card?.subtitle, d = null;
	if (u && e.series_part != null && e.series_part !== "") {
		let t = e.series_part, n = (0, qo.numberToLowercaseWords)(t);
		d = u.replace(/\{n\}/g, String(t)).replace(/\{n_words\}/g, n);
	}
	let h = i.lod === "slug" ? e.label || e.labelMedium || e.title || "" : e.title || e.label, g = rs(h, t, d ? n - 30 : n, {
		min: c?.labelMinFontSize ?? 14,
		max: c?.labelMaxFontSize ?? 26,
		lineHeight: 1.05,
		pad: 8
	}), _ = Math.max(11, Math.round(g * .62));
	return /* @__PURE__ */ m("div", {
		className: K.cardCenter,
		children: [/* @__PURE__ */ p("div", {
			className: K.cardTitle,
			style: { fontSize: `${g}px` },
			"data-card-title": !0,
			children: h
		}), d && /* @__PURE__ */ p("div", {
			className: K.cardSubtitle,
			style: { fontSize: `${_}px` },
			children: d
		})]
	});
}
function os({ article: e, width: t, height: n, viewState: r, cardSettings: i, sourceColor: a, isDraft: o, bgColor: s }) {
	let c = i?.cornerRadius == null ? 10 : i.cornerRadius, l = !t || !n ? null : ts(e.id || e.title || "", t, n, c), u = e.title || e.label || "", d = e.description || "", f = e.subtitle || "", h = rs(u, t, Math.max(30, (n || 0) * (d ? .42 : .8)), {
		min: Math.min(13, i?.labelMinFontSize ?? 13),
		max: Math.min(20, i?.labelMaxFontSize ?? 20),
		lineHeight: 1.1,
		pad: 8
	});
	return /* @__PURE__ */ m("div", {
		className: [
			K.card,
			o ? K.draft : K.published,
			K.linkCard,
			a && K.glow,
			r.hovered && K.linkHover
		].filter(Boolean).join(" "),
		"data-pp-card": !0,
		"data-link-card": !0,
		style: {
			width: t,
			height: n,
			background: s,
			...i?.cornerRadius == null ? {} : { borderRadius: i.cornerRadius },
			...a ? { "--nv-src": a } : {}
		},
		children: [
			l && /* @__PURE__ */ m("svg", {
				className: K.sketchBorder,
				viewBox: `0 0 ${t} ${n}`,
				preserveAspectRatio: "none",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ p("path", {
					className: K.sketchGhost,
					d: l.ghost
				}), /* @__PURE__ */ p("path", {
					className: K.sketchMain,
					d: l.main
				})]
			}),
			/* @__PURE__ */ p("div", {
				className: K.linkTitle,
				style: { fontSize: `${h}px` },
				"data-link-title": !0,
				children: u
			}),
			f && /* @__PURE__ */ p("div", {
				className: K.linkSubtitle,
				"data-link-subtitle": !0,
				children: f
			}),
			d && /* @__PURE__ */ p("div", {
				className: K.linkBlurb,
				"data-link-blurb": !0,
				children: d
			}),
			/* @__PURE__ */ p("span", {
				className: K.linkOut,
				"data-link-out": !0,
				"aria-hidden": "true",
				children: "↗"
			})
		]
	});
}
function ss({ article: e, width: t, height: n, pinned: r, hovered: i, isDraft: a, zoomScale: o, bookmarkCount: s = 0, onResize: c }) {
	let l = [
		K.imageCard,
		a ? K.draft : K.published,
		r && K.pinned
	].filter(Boolean).join(" "), u = n - 24;
	return /* @__PURE__ */ m("div", {
		className: l,
		style: {
			width: t,
			height: n
		},
		children: [
			s > 0 && /* @__PURE__ */ m("div", {
				className: K.bookmarkMark,
				title: s === 1 ? "1 bookmark" : `${s} bookmarks`,
				children: [/* @__PURE__ */ p("svg", {
					viewBox: "0 0 16 16",
					width: "12",
					height: "12",
					fill: "currentColor",
					children: /* @__PURE__ */ p("path", { d: "M3 2v12l5-3 5 3V2z" })
				}), s > 1 && /* @__PURE__ */ p("span", {
					className: K.bookmarkCount,
					children: s
				})]
			}),
			/* @__PURE__ */ p("div", {
				className: K.imageFrame,
				style: {
					width: t,
					height: u,
					backgroundImage: `url('${e.image}')`
				}
			}),
			/* @__PURE__ */ p("div", {
				className: K.imageCaption,
				"data-card-title": !0,
				children: e.short_title || e.title || e.label
			}),
			r && /* @__PURE__ */ p(cs, {}),
			c && /* @__PURE__ */ p(Ko, {
				width: t,
				height: n,
				zoomScale: o,
				onResize: c
			})
		]
	});
}
function cs() {
	return /* @__PURE__ */ p("div", {
		"data-popout": "1",
		title: "Open in reader",
		className: K.popout,
		children: /* @__PURE__ */ m("svg", {
			"data-popout": "1",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2.2",
			width: "13",
			height: "13",
			style: { pointerEvents: "none" },
			children: [
				/* @__PURE__ */ p("path", { d: "M14 3h7v7" }),
				/* @__PURE__ */ p("path", { d: "M21 3l-9 9" }),
				/* @__PURE__ */ p("path", { d: "M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" })
			]
		})
	});
}
//#endregion
//#region src/components/NodeView/registry.js
var ls = {
	text: ns,
	essay: ns,
	fragment: ns,
	multi: ns,
	image: ns,
	"podcast-episode": ns,
	video: ns,
	link: ns
};
function us(e, t = {}) {
	return {
		...ls,
		...t
	}[e] || ns;
}
//#endregion
//#region src/components/GraphViewer/layouts.js
var ds = /* @__PURE__ */ h(((e, t) => {
	var n = {
		width: 180,
		height: 140
	};
	function r(e) {
		return {
			articles: e.filter((e) => e.type === "article"),
			tags: e.filter((e) => e.type !== "article")
		};
	}
	function i(e, t = {}) {
		let { cardW: i = n.width, cardH: a = n.height, gap: o = 28, flatten: s = .62, maxRings: c = 4 } = t, { articles: l, tags: u } = r(e), d = {};
		if (!l.length) return d;
		let f = [...l].sort((e, t) => {
			let n = e._source && e._source.title || "", r = t._source && t._source.title || "";
			return n === r ? String(e.date || "").localeCompare(String(t.date || "")) : n < r ? -1 : 1;
		}), p = (i + o) * 1.14, m = (a + o) / s, h = (e) => {
			let t = e * s, n = (e - t) ** 2 / (e + t) ** 2;
			return Math.PI * (e + t) * (1 + 3 * n / (10 + Math.sqrt(4 - 3 * n)));
		}, g = Math.max(1, Math.min(c, Math.ceil(f.length / 26))), _ = (e) => [...Array(g)].map((t, n) => e + n * m), v = (e) => _(e).reduce((e, t) => e + Math.floor(h(t) / p), 0), y = i, b = i;
		for (; v(b) < f.length && b < 1e6;) b *= 1.6;
		for (let e = 0; e < 40; e++) {
			let e = (y + b) / 2;
			v(e) >= f.length ? b = e : y = e;
		}
		let x = b, S = _(x), C = S.map(h), w = C.reduce((e, t) => e + t, 0), T = C.map((e) => Math.floor(e / w * f.length)), E = T.reduce((e, t) => e + t, 0);
		for (let e = T.length - 1; E < f.length; e = (e - 1 + T.length) % T.length) T[e]++, E++;
		let D = 0;
		S.forEach((e, t) => {
			let n = e * s, r = f.slice(D, D + T[t]);
			if (D += T[t], !r.length) return;
			let i = 1024, a = [0];
			for (let t = 1; t <= i; t++) {
				let r = (t - 1) / i * 2 * Math.PI, o = t / i * 2 * Math.PI;
				a.push(a[t - 1] + Math.hypot(e * (Math.cos(o) - Math.cos(r)), n * (Math.sin(o) - Math.sin(r))));
			}
			let o = a[i], c = (e) => {
				let t = 0, n = i;
				for (; t < n;) {
					let r = t + n >> 1;
					a[r] < e ? t = r + 1 : n = r;
				}
				return t / i * 2 * Math.PI;
			}, l = t % 2 * (o / r.length) * .5;
			r.forEach((t, i) => {
				let a = c((i / r.length * o + l) % o);
				d[t.id] = {
					x: e * Math.cos(a),
					y: n * Math.sin(a)
				};
			});
		});
		let O = Math.max(x - i * .75, i * .5), k = Math.PI * (3 - Math.sqrt(5));
		return u.forEach((e, t) => {
			let n = (u.length === 1 ? 0 : Math.sqrt(t / (u.length - 1))) * O, r = t * k;
			d[e.id] = {
				x: n * Math.cos(r),
				y: n * Math.sin(r) * s
			};
		}), d;
	}
	function a(e, { span: t = 4200, minAdvance: n = 22, compression: r = .25 } = {}) {
		let i = [...new Set(e)].sort((e, t) => e - t), a = /* @__PURE__ */ new Map(), o = 0;
		i.forEach((e, t) => {
			t > 0 && (o += Math.max(n, (e - i[t - 1]) ** +r)), a.set(e, o);
		});
		let s = Math.max(o, 1);
		return {
			position: (e) => {
				if (a.has(e)) return a.get(e) / s * t;
				if (!i.length || e <= i[0]) return 0;
				if (e >= i[i.length - 1]) return t;
				let n = 0, r = i.length - 1;
				for (; r - n > 1;) {
					let t = n + r >> 1;
					i[t] <= e ? n = t : r = t;
				}
				let o = i[n], c = i[r], l = (e - o) / Math.max(c - o, 1);
				return (a.get(o) + (a.get(c) - a.get(o)) * l) / s * t;
			},
			times: i,
			span: t
		};
	}
	function o(e, t = {}) {
		let { cardW: i = n.width, cardH: a = n.height, gap: o = 24, span: s = 4200 } = t, { articles: c, tags: l } = r(e), u = {};
		if (!c.length) return u;
		let d = (e) => {
			let t = Date.parse(e.date || "");
			return Number.isNaN(t) ? null : t;
		}, f = c.filter((e) => d(e) !== null), p = c.filter((e) => d(e) === null), m = i * .12, h = [...new Set(f.map(d))].sort((e, t) => e - t), g = /* @__PURE__ */ new Map(), _ = 0;
		h.forEach((e, t) => {
			if (t > 0) {
				let n = e - h[t - 1];
				_ += Math.max(m, n ** .25);
			}
			g.set(e, _);
		});
		let v = Math.max(_, 1), y = [], b = (e, t) => {
			let n = t - i / 2, r = y.findIndex((e) => n > e + o);
			r === -1 && (r = y.length, y.push(-Infinity)), y[r] = t + i / 2, u[e.id] = {
				x: t,
				y: r * (a + o)
			};
		};
		[...f].sort((e, t) => d(e) - d(t)).forEach((e) => b(e, g.get(d(e)) / v * s));
		let x = -s * .12;
		p.forEach((e, t) => {
			let n = Math.floor(t / 4), r = t % 4;
			u[e.id] = {
				x: x - n * (i + o) - i,
				y: r * (a + o)
			};
		});
		let S = -(a * 2.2), C = 0, w = 0;
		return l.forEach((e) => {
			let t = (e._r ? e._r * 1.6 : 90) + o;
			C + t > s && (C = 0, w++), u[e.id] = {
				x: C,
				y: S - a * .55 * w
			}, C += t;
		}), u;
	}
	function s(e, t, n = .3) {
		let r = (e || []).filter((e) => e && Number.isFinite(e.x) && Number.isFinite(e.y));
		if (r.length <= 8) return !1;
		let i = (e) => {
			let t = [...e].sort((e, t) => e - t), n = t[Math.floor(t.length * .1)];
			return t[Math.ceil(t.length * .9) - 1] - n;
		}, a = r.map((e) => e.x), o = r.map((e) => e.y);
		return i(a) * i(o) < r.length * .8 * t.width * t.height * n;
	}
	function c(e, t = {}) {
		let { orientation: n = "ltr", origin: r = {
			x: 0,
			y: 0
		}, length: i = 4200 } = t, o = (e) => {
			let t = Date.parse(e.date || "");
			return Number.isNaN(t) ? null : t;
		}, s = (e || []).filter((e) => e.type === "article" && o(e) !== null);
		if (s.length < 2) return null;
		let c = a(s.map(o), { span: i }), l = {
			ltr: {
				x: 1,
				y: 0
			},
			rtl: {
				x: -1,
				y: 0
			},
			ttb: {
				x: 0,
				y: 1
			},
			btt: {
				x: 0,
				y: -1
			}
		}[n] || {
			x: 1,
			y: 0
		}, u = (e) => ({
			x: r.x + l.x * e,
			y: r.y + l.y * e
		}), d = {};
		s.forEach((e) => {
			d[e.id] = u(c.position(o(e)));
		});
		let f = c.times[0], p = c.times[c.times.length - 1], m = p - f < 365.25 * 24 * 3600 * 1e3 * 2, h = [], g = new Date(f);
		g.setUTCDate(1), g.setUTCHours(0, 0, 0, 0), m || g.setUTCMonth(0);
		for (let e = 0; e < 400; e++) {
			let e = g.getTime();
			if (e > p) break;
			e >= f && h.push({
				t: e,
				label: m ? g.toLocaleDateString("en", {
					month: "short",
					year: "2-digit",
					timeZone: "UTC"
				}) : String(g.getUTCFullYear()),
				...u(c.position(e))
			}), m ? g.setUTCMonth(g.getUTCMonth() + 1) : g.setUTCFullYear(g.getUTCFullYear() + 1);
		}
		return {
			orientation: n,
			vertical: l.x === 0,
			from: u(0),
			to: u(i),
			ticks: h,
			anchors: d
		};
	}
	function l(e, t = "start") {
		if (!e || typeof e != "string") return null;
		let n = e.trim();
		if (n.endsWith("?") && (n = n.slice(0, -1).trim()), !n) return null;
		let [r, i] = n.split("T"), a = r.split("-"), o = a[0], s = a[1], c = a[2];
		if (!o || /^X+$/i.test(o)) return null;
		let l = parseInt(o, 10);
		if (!Number.isFinite(l)) return null;
		let u;
		if (!s || /^X+$/i.test(s)) u = t === "start" ? 1 : 12;
		else if (u = parseInt(s, 10), !Number.isFinite(u)) return null;
		let d = (e, t) => new Date(Date.UTC(e, t, 0)).getUTCDate(), f;
		if (!c || /^X+$/i.test(c)) f = t === "start" ? 1 : d(l, u);
		else if (f = parseInt(c, 10), !Number.isFinite(f)) return null;
		let p = 0, m = 0;
		if (i) {
			let e = i.split(":");
			p = parseInt(e[0], 10) || 0, m = parseInt(e[1], 10) || 0;
		} else t === "start" ? (p = 0, m = 0) : (p = 23, m = 59);
		return Date.UTC(l, u - 1, f, p, m, 0, 0);
	}
	function u(e, t = "time") {
		let n = /* @__PURE__ */ new Map(), r = (e || []).filter((e) => e && e.type === "article");
		if (t === "time") {
			for (let e of r) if (e.date) {
				let t = Date.parse(e.date);
				Number.isFinite(t) && n.set(e.id, [{
					start: t,
					end: t
				}]);
			}
		} else if (t === "commits") {
			for (let e of r) if (Array.isArray(e.commit_times)) {
				let t = [];
				for (let n of e.commit_times) {
					let e = Date.parse(n);
					Number.isFinite(e) && t.push({
						start: e,
						end: e
					});
				}
				t.length > 0 && n.set(e.id, t);
			}
		} else if (t === "chronology") for (let e of r) {
			let t = e.timeline && e.timeline.calendar_time;
			if (t) {
				if (t.span) {
					let r = t.span.start, i = t.span.end;
					if (!r) continue;
					let a = l(r, "start");
					if (a === null) continue;
					let o;
					i ? (o = l(i, "end"), o === null && (o = l(r, "end"))) : o = l(r, "end"), o === null && (o = a), n.set(e.id, [{
						start: a,
						end: o
					}]);
				} else if (t.date) {
					let r = l(t.date, "start");
					if (r === null) continue;
					let i = l(t.date, "end") ?? r;
					n.set(e.id, [{
						start: r,
						end: i
					}]);
				}
			}
		}
		else if (t === "narrative") {
			let e = /* @__PURE__ */ new Map();
			for (let t of r) if (t.series && typeof t.series_part == "number") {
				let n = e.get(t.series) || 0;
				t.series_part > n && e.set(t.series, t.series_part);
			}
			for (let t of r) {
				let r = null, i = !1, a = t.timeline && t.timeline.narrative_position, o = (a == null ? "" : String(a).trim()).match(/^(\d+)/);
				if (o) {
					let e = o[1], t = 10 ** e.length - 1;
					r = t === 0 ? 0 : parseInt(e, 10) / t;
				} else if (typeof t.series_part == "number") {
					i = !0;
					let n = e.get(t.series) || 1;
					r = n === 1 ? 0 : (t.series_part - 1) / (n - 1);
				}
				if (r !== null && Number.isFinite(r)) {
					let e = {
						start: r,
						end: r
					};
					i && (e._series_part = t.series_part), n.set(t.id, [e]);
				}
			}
		}
		return n;
	}
	function d(e, t) {
		let n = new Date(e);
		if (t === "day") return Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate());
		if (t === "week") {
			let e = (n.getUTCDay() + 6) % 7, t = new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate() - e));
			return Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate());
		}
		return t === "month" ? Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), 1) : t === "year" ? Date.UTC(n.getUTCFullYear(), 0, 1) : e;
	}
	function f(e, t) {
		let n = new Date(e);
		return t === "day" ? Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate() + 1) : t === "week" ? Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate() + 7) : t === "month" ? Date.UTC(n.getUTCFullYear(), n.getUTCMonth() + 1, 1) : t === "year" ? Date.UTC(n.getUTCFullYear() + 1, 0, 1) : e + 1;
	}
	function p(e, t, n) {
		let r = Math.min(e, t), i = Math.max(e, t), a = d(r, n), o = d(i, n), s = [], c = a;
		for (; c <= o;) s.push(c), c = f(c, n);
		return s;
	}
	function m(e, t) {
		let n = new Date(e);
		return t === "day" ? `${n.toLocaleDateString("en", {
			month: "short",
			timeZone: "UTC"
		})} ${n.getUTCDate()}` : t === "week" ? `wk ${n.toLocaleDateString("en", {
			month: "short",
			timeZone: "UTC"
		})} ${n.getUTCDate()}` : t === "month" ? `${n.toLocaleDateString("en", {
			month: "short",
			timeZone: "UTC"
		})} '${String(n.getUTCFullYear()).slice(-2)}` : String(n.getUTCFullYear());
	}
	function h(e, t = {}) {
		let n = t.dimension || "time", { orientation: r = "ltr", origin: i = {
			x: 0,
			y: 0
		}, length: o = 4200, granularity: s = "auto" } = t, l = {
			ltr: {
				x: 1,
				y: 0
			},
			rtl: {
				x: -1,
				y: 0
			},
			ttb: {
				x: 0,
				y: 1
			},
			btt: {
				x: 0,
				y: -1
			}
		}[r] || {
			x: 1,
			y: 0
		}, d = (e) => ({
			x: i.x + l.x * e,
			y: i.y + l.y * e
		});
		if (n === "time") {
			let n = c(e, t);
			if (!n) return null;
			let r = {};
			for (let [e, t] of Object.entries(n.anchors)) r[e] = [t];
			return {
				orientation: n.orientation,
				vertical: n.vertical,
				from: n.from,
				to: n.to,
				ticks: n.ticks,
				anchors: r
			};
		}
		let f = u(e, n);
		if (f.size < 2) return null;
		if (n === "narrative") {
			let e = {}, t = /* @__PURE__ */ new Map();
			for (let [n, r] of f.entries()) {
				let i = [];
				for (let e of r) {
					let n = e.start, r = n * o;
					if (i.push(d(r)), !t.has(n)) if (e._series_part !== void 0) t.set(n, String(e._series_part));
					else {
						let e = Math.round(n * 100);
						t.set(n, `${e}%`);
					}
				}
				i.length > 0 && (e[n] = i);
			}
			if (Object.keys(e).length < 2) return null;
			let n = [...t.entries()].sort((e, t) => e[0] - t[0]).map(([e, t]) => ({
				t: e,
				label: t,
				...d(e * o)
			}));
			return {
				orientation: r,
				vertical: l.x === 0,
				from: d(0),
				to: d(o),
				ticks: n,
				anchors: e
			};
		}
		let h = [
			"day",
			"week",
			"month",
			"year"
		];
		function g(e) {
			let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
			for (let [r, i] of f.entries()) {
				let a = /* @__PURE__ */ new Set();
				for (let t of i) {
					let n = p(t.start, t.end, e);
					for (let e of n) a.add(e);
				}
				let o = [...a].sort((e, t) => e - t), s = o.length > 12 ? [o[0], o[o.length - 1]] : o;
				t.set(r, s);
				for (let e of s) n.add(e);
			}
			return {
				unit: e,
				nodeBucketsMap: t,
				allBuckets: n
			};
		}
		let _ = s, v;
		if (s === "auto") {
			for (let e of h) {
				let t = g(e);
				if (t.allBuckets.size <= 60) {
					_ = e, v = t;
					break;
				}
			}
			v ||= (_ = "year", g("year"));
		} else v = g(s);
		let { nodeBucketsMap: y, allBuckets: b } = v, x = [...b].sort((e, t) => e - t);
		if (x.length === 0) return null;
		let S = a(x, { span: o }), C = {};
		for (let [e, t] of y.entries()) t.length > 0 && (C[e] = t.map((e) => d(S.position(e))));
		if (Object.keys(C).length < 2) return null;
		let w = x.map((e) => ({
			t: e,
			label: m(e, _),
			...d(S.position(e))
		}));
		return {
			orientation: r,
			vertical: l.x === 0,
			from: d(0),
			to: d(o),
			ticks: w,
			anchors: C
		};
	}
	var g = {
		force: null,
		radial: i,
		timeline: o
	};
	function _() {
		return Object.keys(g);
	}
	function v(e, t, n) {
		let r = g[e];
		return r ? r(t, n) : null;
	}
	t.exports = {
		radialLayout: i,
		timelineLayout: o,
		computeLayout: v,
		layoutNames: _,
		layoutIsDegenerate: s,
		timeAxisGeometry: c,
		dimensionAxisGeometry: h,
		dimensionIntervals: u,
		parseLooseDate: l,
		compressedTimeScale: a,
		LAYOUTS: g
	};
})), fs = /* @__PURE__ */ h(((e, t) => {
	var n = Math.PI / 180 * 137.508, r = (1 + Math.sqrt(5)) / 2, i = Math.log(r) / (Math.PI / 2);
	function a(e, t, n = 0) {
		return e.x0 < t.x1 + n && t.x0 < e.x1 + n && e.y0 < t.y1 + n && t.y0 < e.y1 + n;
	}
	function o(e, t, n, r) {
		return {
			x0: e - n / 2,
			y0: t - r / 2,
			x1: e + n / 2,
			y1: t + r / 2
		};
	}
	function s(e) {
		return {
			x0: Math.min(...e.map((e) => e.x0)),
			y0: Math.min(...e.map((e) => e.y0)),
			x1: Math.max(...e.map((e) => e.x1)),
			y1: Math.max(...e.map((e) => e.y1))
		};
	}
	function c(e, t) {
		let n = Number.isFinite(e.order) ? e.order : null, r = Number.isFinite(t.order) ? t.order : null;
		if (n !== null && r !== null && n !== r) return n - r;
		if (n !== null && r === null) return -1;
		if (n === null && r !== null) return 1;
		let i = Date.parse(e.date || "") || 0, a = Date.parse(t.date || "") || 0;
		return i === a ? e.index - t.index : i - a;
	}
	function l(e, t) {
		return (e && e.layout || t && t.containerLayout) === "hang" ? "hang" : null;
	}
	function u(e) {
		return !(e && e.hull === !1);
	}
	function d(e) {
		let t = Number(e && e.closedPillScale);
		return Number.isFinite(t) && t > 0 ? t : 1;
	}
	function f(e) {
		let t = e && e.closedPill && typeof e.closedPill == "object" ? e.closedPill : {}, n = Number(t.labelSize);
		return {
			shape: t.shape === "blob" ? "blob" : "soft",
			status: t.status !== !1,
			labelSize: t.labelSize !== null && t.labelSize !== "" && Number.isFinite(n) && n > 0 ? n : null
		};
	}
	var p = {
		down: Math.PI / 2,
		"down-right": Math.PI / 4,
		"down-left": 3 * Math.PI / 4
	};
	function m(e) {
		let t = e && typeof e == "object" ? e : {}, n = (e) => e !== null && e !== "" && e !== void 0 && Number.isFinite(Number(e)) ? Number(e) : null, r = n(t.cardScale), i = n(t.spacing);
		return {
			anchorEnd: t.anchorEnd === "outer" ? "outer" : "center",
			openTowards: Object.prototype.hasOwnProperty.call(p, t.openTowards) ? t.openTowards : "down",
			keepBelowY: n(t.keepBelowY),
			cardScale: r !== null && r > 0 ? r : 1,
			spacing: i !== null && i >= 0 ? i : null
		};
	}
	function h(e, t) {
		let n = (e - t) % (2 * Math.PI);
		return n <= -Math.PI && (n += 2 * Math.PI), n > Math.PI && (n -= 2 * Math.PI), n;
	}
	var g = [
		"down",
		"down-left",
		"down-right"
	];
	function _(e) {
		let t = e && typeof e == "object" ? e : {}, n = Math.max(1, Math.round(Number(t.columns) || 2)), r = Number.isFinite(Number(t.gap)) && t.gap !== null && t.gap !== "" ? Math.max(0, Number(t.gap)) : 12;
		return {
			direction: g.includes(t.direction) ? t.direction : "down",
			firstAt: t.firstAt === "top" ? "top" : "bottom",
			columns: n,
			gap: r
		};
	}
	function v(e, t) {
		return e <= 0 ? 0 : t <= 1 ? e : Math.max(Math.ceil(e / t), Math.ceil(.6 * e / (t - 1)));
	}
	function y(e, t, n = {}) {
		let r = {
			..._(n),
			pad: n.pad == null ? 40 : n.pad,
			labelGap: n.labelGap == null ? 12 : n.labelGap
		}, i = e.length, a = i ? Math.max(...e.map((e) => e.w)) : 0, o = i ? Math.max(...e.map((e) => e.h)) : 0, s = Math.max(1, Math.min(r.columns, i || 1)), c = v(i, s), l = [];
		for (let e = 0; e < s && l.length < i; e++) for (let t = 0; t < c && l.length < i; t++) l.push({
			col: e,
			row: e % 2 == 0 ? t : c - 1 - t
		});
		let u = (e) => r.firstAt === "bottom" ? l[i - 1 - e] : l[e], d = i ? Math.max(...l.map((e) => e.col)) + 1 : 1, f = r.direction === "down-left" ? -1 : 1, p = a + r.gap, m = o + r.gap, h = r.direction === "down" ? -f * ((d - 1) * p) / 2 : r.direction === "down-right" ? r.pad + a / 2 : -(r.pad + a / 2), g = (e) => h + f * e * p, y = d - 1, b = l.filter((e) => e.col === y).map((e) => e.row), x = (y > 0 ? Math.min(...b) : 0) * m - r.gap, S = Math.min(g(0), g(y)) - a / 2, C = Math.max(g(0), g(y)) + a / 2, w = a + r.gap, T = y > 0 && t.w <= w && t.h <= x, E = r.pad, D;
		if (T) {
			let e = r.pad + x / 2, n = g(y);
			D = {
				x0: n - t.w / 2,
				y0: e - t.h / 2,
				x1: n + t.w / 2,
				y1: e + t.h / 2
			};
		} else {
			let e = i ? (S + C) / 2 : 0, n = r.pad / 2;
			D = {
				x0: e - t.w / 2,
				y0: n,
				x1: e + t.w / 2,
				y1: n + t.h
			}, E = Math.max(r.pad, D.y1 + r.labelGap);
		}
		return {
			positions: e.map((e, t) => {
				let n = u(t);
				return {
					x: g(n.col),
					y: E + n.row * m + o / 2
				};
			}),
			label: D,
			rows: c,
			columns: d,
			slots: e.map((e, t) => u(t)),
			labelBeside: T
		};
	}
	function b({ containers: e, members: t, labelSize: r, macroSize: l, closed: u, options: d = {} }) {
		let f = d.spacing == null ? 20 : d.spacing, g = d.gap == null ? 16 : d.gap, v = d.padding || (() => 40), b = d.mode === "scatter" || d.mode === "ring" ? d.mode : "path", x = u || /* @__PURE__ */ new Set(), S = new Map(e.map((e) => [e.id, e])), C = new Map(e.map((e) => [e.id, []]));
		e.forEach((e, t) => {
			e.parent && C.has(e.parent) && C.get(e.parent).push({
				c: e,
				index: t
			});
		});
		function w(e, u, S) {
			if (S.has(e.id)) return null;
			S.add(e.id);
			let T = (e) => {
				let n = [...(t.get(e) || []).map((e) => e.id)];
				for (let { c: t } of C.get(e) || []) n.push(...T(t.id));
				return n;
			};
			if (x.has(e.id)) {
				let t = l && l(e) || {
					w: 260,
					h: 90
				}, n = o(0, 0, t.w, t.h), r = new Map(T(e.id).map((e) => [e, {
					x: 0,
					y: 0
				}])), i = {
					label: n,
					box: n,
					center: {
						x: 0,
						y: 0
					},
					closed: !0
				};
				return {
					box: n,
					nodes: r,
					containers: new Map([[e.id, i]])
				};
			}
			let E = [];
			for (let { c: t, index: n } of C.get(e.id) || []) {
				let e = w(t, u + 1, S);
				e && (e.nodes.size === 0 && !x.has(t.id) || E.push({
					kind: "container",
					id: t.id,
					sub: e,
					w: e.box.x1 - e.box.x0,
					h: e.box.y1 - e.box.y0,
					order: Number.isFinite(t.order) ? t.order : null,
					index: -1e4 + n
				}));
			}
			let D = m(d.spiralOf ? d.spiralOf(e) : null), O = D.spacing === null ? f : D.spacing;
			(t.get(e.id) || []).forEach((e, t) => {
				E.push({
					kind: "node",
					id: e.id,
					w: e.w * D.cardScale,
					h: e.h * D.cardScale,
					scale: D.cardScale,
					order: e.order,
					date: e.date,
					index: t
				});
			}), E.sort(c);
			let k = r(e, u) || {
				w: 160,
				h: 60
			};
			if (d.layoutOf && d.layoutOf(e) === "hang" && E.every((e) => e.kind === "node")) {
				let t = v(e, u), n = _(d.hangOf ? d.hangOf(e) : null), r = y(E, k, {
					...n,
					pad: t,
					labelGap: g / 2
				}), i = /* @__PURE__ */ new Map(), a = E.map((e, t) => (i.set(e.id, {
					x: r.positions[t].x,
					y: r.positions[t].y,
					scale: e.scale
				}), o(r.positions[t].x, r.positions[t].y, e.w, e.h))), c = a.length ? s([r.label, ...a]) : r.label, l = t * 1.25, f = {
					x0: c.x0 - l,
					y0: 0,
					x1: c.x1 + l,
					y1: c.y1 + l
				}, p = {
					label: r.label,
					box: f,
					center: {
						x: 0,
						y: 0
					},
					closed: !1,
					spiral: null,
					hang: {
						...n,
						pad: t,
						rows: r.rows,
						columns: r.columns,
						labelBeside: r.labelBeside
					}
				};
				return {
					box: f,
					nodes: i,
					containers: new Map([[e.id, p]])
				};
			}
			let A = o(0, 0, k.w, k.h), j = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), N = [], P = null;
			if (E.length) {
				let t = E[0], r = k.h / 2 + g + t.h / 2, s = (e) => !a(e, A, g) && !N.some((t) => a(e, t, O)), c = E.some((e) => e.kind === "container"), l = E.some((e) => Number.isFinite(e.order)), m = c ? b === "scatter" ? "scatter" : "beside" : b === "ring" ? "ring" : b === "scatter" ? "scatter" : l ? "path" : "scatter", _ = [];
				if (m === "path") {
					let t = d.direction === "inward", n = t ? E.slice().reverse() : E, r = k.h / 2 + g + n[0].h / 2, s = Math.max(...n.map((e) => Math.max(e.w, e.h))), c = d.startRadius == null ? s * .65 : d.startRadius, l = -Math.PI / 2, f = (e) => {
						let s = Math.cos(e), u = Math.sin(e), d = (e, t) => ({
							x: e * s - t * u,
							y: e * u + t * s
						}), f = d(0, c), p = 0 + f.x, m = r + f.y, h = (e) => {
							let t = c * Math.exp(i * (e - l)), n = d(Math.cos(e), Math.sin(e));
							return {
								x: p + t * n.x,
								y: m + t * n.y
							};
						}, _ = [], v = [], y = (e) => !a(e, A, g) && !v.some((t) => a(e, t, O)), b = l;
						n.forEach((e, t) => {
							let n = {
								x: 0,
								y: r
							};
							if (t > 0) for (let t = 0; t < 2e5; t++) {
								let t = c * Math.exp(i * (b - l));
								if (b += 3 / (t * Math.sqrt(1 + i * i)), n = h(b), y(o(n.x, n.y, e.w, e.h))) break;
							}
							_.push(n), v.push(o(n.x, n.y, e.w, e.h));
						});
						let x = {
							cx: p,
							cy: m,
							a: c,
							b: i,
							theta: e
						};
						if (t) {
							_.reverse(), v.reverse();
							for (let e of _) e.x = -e.x;
							for (let e of v) {
								let t = -e.x1;
								e.x1 = -e.x0, e.x0 = t;
							}
							x = {
								...x,
								cx: -x.cx,
								mirrored: !0,
								inward: !0
							};
						}
						return {
							pos: _,
							rects: v,
							sp: x
						};
					}, m = (e) => {
						let t = e.pos[0], n = e.pos[e.pos.length - 1];
						return Math.atan2(t.y - n.y, t.x - n.x);
					}, y = D.anchorEnd === "outer", b = (e) => {
						let t = f(e), n = t.pos[t.pos.length - 1], r = y ? -n.x : 0, i = y ? -n.y : 0;
						return {
							...t,
							dx: r,
							dy: i
						};
					}, x = 0, S = b(x);
					if (y && n.length > 1) {
						let e = p[D.openTowards], n = t ? -1 : 1, r = (t) => Math.abs(h(e, m(t)));
						for (let t = 0; t < 16; t++) {
							let t = h(e, m(S));
							if (Math.abs(t) < .002) break;
							x += n * t, S = b(x);
						}
						if (r(S) >= .002) {
							let e = {
								theta: x,
								res: S
							}, t = (t) => {
								let n = b(t);
								r(n) < r(e.res) && (e = {
									theta: t,
									res: n
								});
							};
							for (let e = 0; e < 120; e++) t(e * Math.PI / 60);
							for (let n = Math.PI / 60; n > 5e-4; n /= 3) {
								let r = e.theta;
								for (let e = -3; e <= 3; e++) t(r + e * n / 3);
							}
							x = e.theta, S = e.res;
						}
						let i = h(e, m(S));
						if (Math.abs(i) >= .002 && Math.abs(i) < 15 * Math.PI / 180) {
							let e = S.pos[S.pos.length - 1], t = (t) => {
								let n = Math.cos(t), r = Math.sin(t), i = (t) => ({
									x: e.x + (t.x - e.x) * n - (t.y - e.y) * r,
									y: e.y + (t.x - e.x) * r + (t.y - e.y) * n
								}), s = S.pos.map(i), c = S.rects.map((e, t) => o(s[t].x, s[t].y, e.x1 - e.x0, e.y1 - e.y0)), l = i({
									x: (A.x0 + A.x1) / 2,
									y: (A.y0 + A.y1) / 2
								}), u = o(l.x, l.y, A.x1 - A.x0, A.y1 - A.y0), d = i({
									x: S.sp.cx,
									y: S.sp.cy
								});
								return c.every((e, t) => !a(e, u, g / 2) && c.every((n, r) => r <= t || !a(e, n, O / 4))) ? {
									...S,
									pos: s,
									rects: c,
									lab: u,
									sp: {
										...S.sp,
										cx: d.x,
										cy: d.y
									}
								} : null;
							}, n = 0, r = 1, s = t(i);
							if (!s) for (let e = 0; e < 12; e++) {
								let e = (n + r) / 2, a = t(i * e);
								a ? (n = e, s = a) : r = e;
							}
							s && (S = s);
						}
					}
					let C = 0;
					if (D.keepBelowY !== null) {
						let t = v(e, u) * 1.25, n = (e) => Math.min((e.lab || A).y0, ...e.rects.map((e) => e.y0)) + e.dy - t;
						if (n(S) < D.keepBelowY) {
							let e = null;
							for (let t = 1; t <= 18 && !e; t++) for (let r of [1, -1]) {
								let i = b(x + r * t * (Math.PI / 36));
								if (n(i) >= D.keepBelowY) {
									e = i;
									break;
								}
							}
							e ? S = e : C = D.keepBelowY - n(S);
						}
					}
					let w = S.dx, T = S.dy + C;
					S.pos.forEach((e, t) => {
						_[t] = {
							x: e.x + w,
							y: e.y + T
						};
					}), S.rects.forEach((e) => N.push({
						x0: e.x0 + w,
						y0: e.y0 + T,
						x1: e.x1 + w,
						y1: e.y1 + T
					}));
					let j = S.lab || A;
					A = {
						x0: j.x0 + w,
						y0: j.y0 + T,
						x1: j.x1 + w,
						y1: j.y1 + T
					}, P = {
						...S.sp,
						cx: S.sp.cx + w,
						cy: S.sp.cy + T
					}, y && (P = {
						...P,
						anchorEnd: "outer",
						openTowards: D.openTowards,
						drop: C
					});
				} else if (m === "ring") {
					let e = Math.max(...E.map((e) => Math.hypot(e.w, e.h))), t = E.length, n = Math.max(t > 1 ? t * (e + f) / (2 * Math.PI) : 0, Math.hypot(k.w, k.h) / 2 + e / 2 + g);
					for (let e = 0; e < 400; e++) {
						_.length = 0, N.length = 0;
						let e = !0;
						if (E.forEach((r, i) => {
							let a = -Math.PI / 2 + i / t * 2 * Math.PI, c = {
								x: n * Math.cos(a),
								y: 0 + n * Math.sin(a)
							}, l = o(c.x, c.y, r.w, r.h);
							s(l) || (e = !1), _.push(c), N.push(l);
						}), e) break;
						n += 8;
					}
				} else if (m === "beside") {
					_.push({
						x: 0,
						y: r
					}), N.push(o(0, r, t.w, t.h));
					let e = Math.max(A.x1, 0 + t.w / 2), n = Math.min(A.x0, 0 - t.w / 2), i = r + t.h / 2;
					E.slice(1).forEach((t, r) => {
						let a = -i / 2;
						a + t.h > i && (a = -t.h / 3);
						let s = a + t.h / 2, c;
						r % 2 == 0 ? (c = e + f * 2 + t.w / 2, e = c + t.w / 2) : (c = n - f * 2 - t.w / 2, n = c - t.w / 2), i = Math.max(i, a + t.h), _.push({
							x: c,
							y: s
						}), N.push(o(c, s, t.w, t.h));
					});
				} else {
					let e = E.reduce((e, t) => e + Math.hypot(t.w, t.h), 0) / E.length / 2 + f;
					E.forEach((t, i) => {
						let a = 0, c = r;
						if (i > 0) {
							let l = i * n, u = Math.cos(l), d = Math.sin(l), f = e * Math.sqrt(i);
							for (let e = 0; e < 2e3 && (a = 0 + u * f, c = r + d * f, !s(o(a, c, t.w, t.h))); e++) f += 8;
						}
						_.push({
							x: a,
							y: c
						}), N.push(o(a, c, t.w, t.h));
					});
				}
				E.forEach((e, t) => {
					let n = _[t].x, r = _[t].y;
					if (e.kind === "node") j.set(e.id, {
						x: n,
						y: r,
						scale: e.scale
					});
					else {
						let t = n - (e.sub.box.x0 + e.sub.box.x1) / 2, i = r - (e.sub.box.y0 + e.sub.box.y1) / 2;
						for (let [n, r] of e.sub.nodes) j.set(n, {
							x: r.x + t,
							y: r.y + i,
							scale: r.scale
						});
						for (let [n, r] of e.sub.containers) {
							let e = (e) => ({
								x0: e.x0 + t,
								y0: e.y0 + i,
								x1: e.x1 + t,
								y1: e.y1 + i
							});
							M.set(n, {
								...r,
								label: e(r.label),
								box: e(r.box),
								center: {
									x: r.center.x + t,
									y: r.center.y + i
								},
								spiral: r.spiral ? {
									...r.spiral,
									cx: r.spiral.cx + t,
									cy: r.spiral.cy + i
								} : r.spiral
							});
						}
					}
				});
			}
			let F = v(e, u) * 1.25, I = N.length ? s([A, ...N]) : A, L = {
				x0: I.x0 - F,
				y0: I.y0 - F,
				x1: I.x1 + F,
				y1: I.y1 + F
			};
			return M.set(e.id, {
				label: A,
				box: L,
				center: {
					x: 0,
					y: 0
				},
				closed: !1,
				spiral: P
			}), {
				box: L,
				nodes: j,
				containers: M
			};
		}
		let T = e.filter((e) => !e.parent || !S.has(e.parent)).map((e) => e.id), E = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map();
		for (let e of T) {
			let t = w(S.get(e), 0, /* @__PURE__ */ new Set());
			if (t) {
				for (let [n, r] of t.nodes) E.has(n) || E.set(n, {
					root: e,
					x: r.x,
					y: r.y,
					scale: r.scale || 1
				});
				for (let [n, r] of t.containers) D.set(n, {
					root: e,
					...r
				});
			}
		}
		return {
			roots: T,
			nodes: E,
			containers: D
		};
	}
	t.exports = {
		containerLayout: b,
		rectsOverlap: a,
		compareUnits: c,
		hangChain: y,
		hangOptions: _,
		hangRows: v,
		spiralOptions: m,
		containerLayoutOf: l,
		hullDrawn: u,
		closedPillScaleOf: d,
		closedPillOf: f
	};
})), ps = /* @__PURE__ */ h(((e, t) => {
	var n = (e) => typeof e == "string" && e.trim() ? e.trim() : "", r = (e) => e !== "" && e != null && Number.isFinite(Number(e)) ? Math.max(0, Math.min(1, Number(e))) : null;
	function i(e) {
		return e && (e.badgeColor || e.color || e.stroke) || "#d4af37";
	}
	function a(e) {
		let t = n(e).replace(/'/g, "");
		return t ? `'${t}', sans-serif` : null;
	}
	function o(e, t) {
		let o = e && e.look && typeof e.look == "object" ? e.look : {}, s = t && n(t.color) ? t : null, c = !!s && n(s.color).toLowerCase() === "none", l = i(e), u = c ? "transparent" : n(s ? s.color : o.fill), d = c ? "none" : n(s ? s.color : o.stroke), f = c ? 0 : u ? r(s ? s.fillOpacity : o.fillOpacity) : null, p = d || l;
		return {
			closed: {
				fill: u || `color-mix(in srgb, ${l} 16%, var(--pp-macro-base, #151826))`,
				fillOpacity: f,
				stroke: p,
				glow: p === "none" ? null : p
			},
			open: {
				fill: u || e && e.fill || "rgba(212, 175, 55, 0.03)",
				fillOpacity: f,
				stroke: d || e && e.stroke || "rgba(212, 175, 55, 0.45)"
			},
			label: {
				face: a(o.labelFace),
				color: (c ? n(s.labelColor) || n(o.labelColor) : s ? n(s.labelColor) || n(s.color) : n(o.labelColor)) || null
			}
		};
	}
	function s(e) {
		let t = e && typeof e == "object" ? e : {}, i = {};
		n(t.fill) && (i.fill = n(t.fill));
		let a = r(t.fillOpacity);
		return a !== null && (i.fillOpacity = a), n(t.stroke) && (i.stroke = n(t.stroke)), n(t.labelFace) && (i.labelFace = n(t.labelFace)), n(t.labelColor) && (i.labelColor = n(t.labelColor)), Object.keys(i).length ? i : null;
	}
	t.exports = {
		containerLook: o,
		containerColor: i,
		faceFamily: a,
		lookFromSettings: s
	};
})), ms = /* @__PURE__ */ h(((e, t) => {
	var n = (e) => typeof e == "string" && e.trim() && !/[;{}<>]/.test(e) ? e.trim() : "";
	function r(e) {
		let t = e && Array.isArray(e.nodePalettes) ? e.nodePalettes : [], r = /* @__PURE__ */ new Set(), i = [];
		for (let e of t) {
			if (!e || typeof e != "object") continue;
			let t = n(e.id), a = n(e.color);
			if (!t || !a || r.has(t)) continue;
			r.add(t);
			let o = Number(e.fillOpacity);
			i.push({
				id: t,
				label: n(e.label) || t,
				color: a,
				fillOpacity: e.fillOpacity !== null && e.fillOpacity !== "" && Number.isFinite(o) ? Math.max(0, Math.min(1, o)) : null,
				labelColor: n(e.labelColor)
			});
		}
		return i;
	}
	function i(e, t) {
		let n = r(e);
		return n.length ? n.find((e) => e.id === t) || n[0] : null;
	}
	t.exports = {
		nodePalettesOf: r,
		nodePaletteFor: i
	};
})), hs = /* @__PURE__ */ h(((e, t) => {
	var n = {
		linkDistance: 160,
		chargeStrength: -500,
		collidePadding: 10
	}, r = {
		width: 180,
		height: 140
	}, i = {
		linkDistance: 1.6,
		chargeStrength: 1.6,
		collidePadding: 2
	}, a = {
		linkDistance: .45,
		chargeStrength: .35
	}, o = .25, s = (e, t) => Number.isFinite(Number(e)) ? Number(e) : t;
	function c(e) {
		if (e == null || e === "") return .5;
		let t = Number(e);
		return Number.isFinite(t) ? Math.max(0, Math.min(1, t)) : .5;
	}
	function l(e, t, n, r) {
		return r <= .5 ? e + (t - e) * (r / .5) : t + (n - t) * ((r - .5) / .5);
	}
	function u(e, t, u) {
		let d = e && typeof e == "object" ? e : {}, f = u && typeof u == "object" ? u : {}, p = c(t), m = s(d.linkDistance, n.linkDistance), h = s(d.chargeStrength, n.chargeStrength), g = s(d.collidePadding, n.collidePadding), _ = Math.min(s(f.width, r.width), s(f.height, r.height));
		return {
			linkDistance: l(m * i.linkDistance, m, m * a.linkDistance, p),
			chargeStrength: l(h * i.chargeStrength, h, h * a.chargeStrength, p),
			collidePadding: l(g * i.collidePadding, g, -_ * o, p)
		};
	}
	t.exports = {
		tightened: u,
		clampTightness: c,
		LOOSE: i,
		TIGHT: a,
		TIGHT_OVERLAP: o
	};
})), gs = /* @__PURE__ */ h(((e, t) => {
	var n = 864e5, r = ["uniform", "weighted"], i = [
		"none",
		"sqrt",
		"log"
	], a = ["calendar", "session"], o = "edgeWeights", s = "degreePenalty", c = Object.freeze({
		mode: "weighted",
		degreePenalty: "sqrt",
		recencyClock: "calendar",
		recencyHalfLifeDays: 365,
		recencyFloor: .2,
		distanceSpread: 1,
		weights: Object.freeze({
			tag: 1,
			broader: 1,
			related: 1,
			closeMatch: 1,
			broadMatch: 1,
			relatedMatch: 1,
			exactMatch: 1,
			authored: 1,
			topology: 1
		})
	});
	function l(e) {
		return e != null && e !== "" && typeof e != "boolean" && Number.isFinite(Number(e));
	}
	function u(e) {
		return e == null || e === "" || typeof e == "boolean" ? NaN : typeof e == "number" ? Number.isFinite(e) ? e : NaN : typeof e == "string" ? Date.parse(e) : NaN;
	}
	function d(e, t) {
		let n = l(e) && Number(e) > 0 ? Number(e) : 0;
		return t === "none" ? n : t === "log" ? Math.log1p(n) : Math.sqrt(n);
	}
	function f(e, t, r = {}) {
		let i = r && typeof r == "object" ? r : {};
		if (i.clock === "session") {
			if (!l(i.rankIndex) || !l(i.count)) return 0;
			let e = Number(i.rankIndex), t = Number(i.count);
			return e < 0 || t <= 0 || e >= t ? 0 : t > 1 ? 1 - e / (t - 1) : 1;
		}
		let a = u(e), o = u(t);
		if (!Number.isFinite(a) || !Number.isFinite(o)) return 0;
		let s = l(i.halfLifeDays) && Number(i.halfLifeDays) > 0 ? Number(i.halfLifeDays) : c.recencyHalfLifeDays;
		return .5 ** (Math.max(0, o - a) / n / s);
	}
	function p(e) {
		return e && typeof e == "object" ? e.id : e;
	}
	function m(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of e || []) {
			if (!n || n.layer === "containment" || n.role === "contains") continue;
			let e = p(n.source), r = p(n.target);
			typeof e == "string" && e && t.set(e, (t.get(e) || 0) + 1), typeof r == "string" && r && r !== e && t.set(r, (t.get(r) || 0) + 1);
		}
		return t;
	}
	function h(e) {
		if (!e || typeof e != "object" || Array.isArray(e)) return {};
		if (e.graph && typeof e.graph == "object" && !Array.isArray(e.graph)) {
			let t = e.graph.edgeWeights;
			return t && typeof t == "object" && !Array.isArray(t) ? t : {};
		}
		return e.edgeWeights && typeof e.edgeWeights == "object" && !Array.isArray(e.edgeWeights) ? e.edgeWeights : e;
	}
	function g(e) {
		let t = h(e), n = r.includes(t.mode) ? t.mode : c.mode, o = i.includes(t.degreePenalty) ? t.degreePenalty : c.degreePenalty, s = a.includes(t.recencyClock) ? t.recencyClock : c.recencyClock, u = l(t.recencyHalfLifeDays) && Number(t.recencyHalfLifeDays) > 0 ? Number(t.recencyHalfLifeDays) : c.recencyHalfLifeDays, d = l(t.recencyFloor) && Number(t.recencyFloor) >= 0 && Number(t.recencyFloor) <= 1 ? Number(t.recencyFloor) : c.recencyFloor, f = l(t.distanceSpread) && Number(t.distanceSpread) >= 0 ? Number(t.distanceSpread) : c.distanceSpread, p = { ...c.weights };
		if (t.weights && typeof t.weights == "object" && !Array.isArray(t.weights)) for (let [e, n] of Object.entries(t.weights)) e.startsWith("_") || l(n) && (p[e] = Math.max(0, Number(n)));
		return {
			mode: n,
			degreePenalty: o,
			recencyClock: s,
			recencyHalfLifeDays: u,
			recencyFloor: d,
			distanceSpread: f,
			weights: p
		};
	}
	function _(e) {
		return typeof e == "string" && (e.startsWith("tag:") || e.startsWith("topology:") || e.startsWith("reference:") || e.startsWith("container:"));
	}
	function v(e, t) {
		if (!(!e || t == null)) {
			if (e instanceof Map) return e.get(t);
			if (typeof e == "object" && t in e) return e[t];
		}
	}
	function y(e, t, n) {
		if (n) return n;
		if (!t || !e) return null;
		let r = v(e.nodeById, t) ?? v(e.nodes, t) ?? v(e.cards, t);
		if (r && typeof r == "object") return r;
		if (Array.isArray(e.nodes)) {
			let n = e.nodes.find((e) => e && e.id === t);
			if (n) return n;
		}
		if (Array.isArray(e.cards)) {
			let n = e.cards.find((e) => e && e.id === t);
			if (n) return n;
		}
		return null;
	}
	function b(e) {
		return !e || typeof e != "object" ? null : e.originalItem && typeof e.originalItem.date_published == "string" && e.originalItem.date_published ? e.originalItem.date_published : typeof e.date_published == "string" && e.date_published ? e.date_published : typeof e.date == "string" && e.date ? e.date : null;
	}
	function x(e, t, n) {
		let r = null, i = (e) => {
			let t = u(e);
			Number.isFinite(t) && (r === null || t > r) && (r = t);
		};
		if (e.dates instanceof Map) for (let t of e.dates.values()) i(t);
		else if (e.dates && typeof e.dates == "object") for (let t of Object.values(e.dates)) i(t);
		let a = [
			e.cards,
			e.nodes,
			e.items
		];
		for (let e of a) if (Array.isArray(e)) for (let t of e) i(b(t));
		else if (e instanceof Map) for (let t of e.values()) i(b(t));
		return i(b(t)), i(b(n)), r;
	}
	function S(e, t = {}) {
		let n = t && typeof t == "object" ? t : {}, r = g(n.settings || n.edgeWeights || n), i = e && l(e.weight) ? Number(e.weight) : e && e.attrs && l(e.attrs.weight) ? Number(e.attrs.weight) : NaN, a = Number.isFinite(i) && i > 0 ? Math.min(1, i) : 1, o = e && e.source && typeof e.source == "object" ? e.source : null, s = e && e.target && typeof e.target == "object" ? e.target : null, c = o ? o.id : e ? e.source : null, u = s ? s.id : e ? e.target : null, p = y(n, c, o), h = y(n, u, s), S = n.degrees || (Array.isArray(n.edges) ? m(n.edges) : null), C = (e, t) => {
			if (!S) return 0;
			let n = v(S, e);
			if (l(n)) return Number(n);
			let r = v(S, t && t.originalItem && t.originalItem.id);
			return l(r) ? Number(r) : 0;
		}, w = d(C(c, p), r.degreePenalty), T = d(C(u, h), r.degreePenalty), E = Math.sqrt(w * T), D = E > 0 ? 1 / E : 1, O = (e, t) => t && typeof t.type == "string" ? t.type === "article" || t.type === "card" : n.cardIds instanceof Set ? n.cardIds.has(e) : typeof e == "string" && !!e && !_(e), k = n.newestMs === void 0 ? x(n, p, h) : n.newestMs, A = n.ranks || n.sessionRank || null, j = l(n.count) ? Number(n.count) : l(n.cardCount) ? Number(n.cardCount) : A instanceof Map ? A.size : Array.isArray(n.cards) ? n.cards.length : void 0, M = (e, t) => {
			let i = v(n.recencyById, e);
			if (l(i)) return Math.max(0, Math.min(1, Number(i)));
			let a = t && t.originalItem && t.originalItem.id, o = v(n.dates, e) ?? v(n.dates, a) ?? b(t), s = v(A, e) ?? v(A, a) ?? (t && (t.rankIndex ?? t.index));
			return f(o, k, {
				clock: r.recencyClock,
				halfLifeDays: r.recencyHalfLifeDays,
				rankIndex: s,
				count: j
			});
		}, N = O(c, p), P = O(u, h), F = 1;
		N && P ? F = (M(c, p) + M(u, h)) / 2 : N ? F = M(c, p) : P && (F = M(u, h));
		let I = r.recencyFloor + (1 - r.recencyFloor) * F, L = e && (e.layer === "reference" && (e.refType || e.attrs && e.attrs.type) || e.layer || e.refType || ""), ee = 1;
		return L && l(r.weights[L]) ? ee = Math.max(0, Number(r.weights[L])) : e && e.layer && l(r.weights[e.layer]) && (ee = Math.max(0, Number(r.weights[e.layer]))), {
			eff: a * D * I * ee,
			raw: a,
			degreeFactor: D,
			recencyFactor: I,
			typeWeight: ee
		};
	}
	function C(e) {
		return !l(e) || Number(e) <= 0 ? 0 : Math.min(1, Number(e));
	}
	function w(e, t, n, r = c.distanceSpread) {
		let i = l(n) && Number(n) > 0 ? Number(n) : 160, a = l(r) && Number(r) >= 0 ? Number(r) : c.distanceSpread;
		if (!l(t) || Number(t) <= 0) return i;
		let o = Number(t);
		return i * (1 + a * (1 - (l(e) ? Math.max(0, Math.min(o, Number(e))) : 0) / o));
	}
	function T(e, t) {
		if (!t || typeof t != "object") return "";
		let n = e && (e.layer === "reference" && (e.refType || e.attrs && e.attrs.type) || e.layer || e.refType) || "edge", r = Number(t.eff || 0).toFixed(2), i = Number(t.raw ?? 1).toFixed(2), a = Number(t.degreeFactor ?? 1).toFixed(2), o = Number(t.recencyFactor ?? 1).toFixed(2), s = Number(t.typeWeight ?? 1);
		return `pull ${r}: weight ${i} × degree ${a} × recency ${o} × ${n} ${Number.isInteger(s) ? String(s) : s.toFixed(2)}`;
	}
	t.exports = {
		EDGE_WEIGHT_DEFAULTS: c,
		EDGE_WEIGHT_MODES: r,
		DEGREE_PENALTIES: i,
		RECENCY_CLOCKS: a,
		MODE_PREF: o,
		PENALTY_PREF: s,
		penalty: d,
		recencyX: f,
		degreesOf: m,
		effectiveWeight: S,
		linkStrength: C,
		linkDistance: w,
		normaliseEdgeWeights: g,
		edgeWeightLine: T
	};
})), _s = /* @__PURE__ */ h(((e, t) => {
	var n = {
		down: [0, 1],
		"down-right": [Math.SQRT1_2, Math.SQRT1_2],
		"down-left": [-Math.SQRT1_2, Math.SQRT1_2]
	};
	function r(e, t, n) {
		return e.x0 < t.x1 + n && t.x0 < e.x1 + n && e.y0 < t.y1 + n && t.y0 < e.y1 + n;
	}
	var i = (e, t, n) => ({
		x0: e.x0 + t,
		y0: e.y0 + n,
		x1: e.x1 + t,
		y1: e.y1 + n
	});
	function a(e, { gap: t = 16 } = {}) {
		let a = e.map((e) => ({
			...e,
			box: { ...e.box }
		})), o = /* @__PURE__ */ new Map();
		for (let e of a) {
			if (!e.open || e.fixed) continue;
			let [s, c] = n[e.towards] || n.down, l = a.filter((t) => t !== e), u = (n) => {
				let a = i(e.box, s * n, c * n);
				return l.some((e) => r(a, e.box, t));
			};
			if (!u(0)) continue;
			let d = Math.max(e.box.x1 - e.box.x0, e.box.y1 - e.box.y0), f = Math.max(1, d / 32), p = 0;
			for (let e = 0; e < 4096 && u(p); e++) p += f;
			let m = Math.max(0, p - f), h = p;
			for (let e = 0; e < 24; e++) {
				let e = (m + h) / 2;
				u(e) ? m = e : h = e;
			}
			let g = s * h, _ = c * h;
			e.box = i(e.box, g, _), o.set(e.id, {
				dx: g,
				dy: _
			});
		}
		return o;
	}
	t.exports = {
		actsApart: a,
		boxesMeet: r,
		TOWARDS: n
	};
})), vs = /* @__PURE__ */ h(((e, t) => {
	function n(e) {
		return !e || e.containerCount !== !1;
	}
	function r(e, t) {
		return n(e) ? ` ${t}` : "";
	}
	t.exports = {
		showContainerCount: n,
		containerCountText: r
	};
})), ys = /* @__PURE__ */ h(((e, t) => {
	var n = Math.PI / 180;
	function r(e) {
		let t = ((e + 180) % 360 + 360) % 360 - 180;
		return t === -180 && (t = 180), t;
	}
	function i(e, t) {
		return r(e - t);
	}
	function a(e, t, r) {
		if (!t || r === t.theta0) return {
			x: e.x,
			y: e.y,
			k: e.k
		};
		let i = (r - t.theta0) * n, a = Math.cos(i), o = Math.sin(i), s = t.mx - e.x, c = t.my - e.y;
		return {
			x: t.mx - (a * s - o * c),
			y: t.my - (o * s + a * c),
			k: e.k
		};
	}
	function o(e, t, r, i) {
		let a = t * n, o = Math.cos(a), s = Math.sin(a), c = r * e.k, l = i * e.k;
		return [e.x + o * c - s * l, e.y + s * c + o * l];
	}
	function s(e, t, r, i) {
		let a = -t * n, o = Math.cos(a), s = Math.sin(a), c = (r - e.x) / e.k, l = (i - e.y) / e.k;
		return [o * c - s * l, s * c + o * l];
	}
	t.exports = {
		normalizeAngle: r,
		angleDelta: i,
		rotatedView: a,
		viewToScreen: o,
		screenToView: s
	};
})), bs = /* @__PURE__ */ h(((e, t) => {
	function n(e, t, n, r) {
		let i = e.k * t;
		return {
			x: n - (n - e.x) * t,
			y: r - (r - e.y) * t,
			k: i
		};
	}
	function r(e, t, n, r) {
		if (!e || !(e.x1 > e.x0) || !(e.y1 > e.y0) || t < r.x0 || t > r.x1 || n < r.y0 || n > r.y1) return null;
		let i = Infinity, a = (e, t) => {
			t > 1e-9 && (i = Math.min(i, e / t));
		};
		return a(t - r.x0, t - e.x0), a(r.x1 - t, e.x1 - t), a(n - r.y0, n - e.y0), a(r.y1 - n, e.y1 - n), Number.isFinite(i) ? i : null;
	}
	function i(e, t, r, i) {
		return !e || !t || !(e.k > 0) || !(t.k > 0) || Math.abs(t.k - e.k) <= 1e-9 * e.k ? t : n(e, t.k / e.k, r, i);
	}
	function a(e) {
		return e && e.zoomPivot === "art" ? "art" : "pointer";
	}
	t.exports = {
		zoomAbout: n,
		fitRatioAbout: r,
		repivot: i,
		zoomPivotMode: a
	};
})), xs = /* @__PURE__ */ h(((e, t) => {
	var { zoomAbout: n, fitRatioAbout: r } = bs();
	function i(e) {
		return e && e.zoomMode === "grow-in-place" ? "grow-in-place" : "geometric";
	}
	function a(e) {
		return !(e && e.growCap === !1);
	}
	function o(e, t, n) {
		if (!e || !t || !(n > 0)) return {
			x: 0,
			y: 0
		};
		let r = 1 / n - 1;
		return r === 0 ? {
			x: 0,
			y: 0
		} : {
			x: r * (e.x - t.x),
			y: r * (e.y - t.y)
		};
	}
	function s(e, t, r, i, a = Infinity) {
		if (!e || !t || !(e.k > 0) || !(t.k > 0) || Math.abs(t.k - e.k) <= 1e-9 * e.k) return t;
		let o = t.k;
		return o > e.k && o > a && (o = Math.max(e.k, a)), Math.abs(o - e.k) <= 1e-9 * e.k ? {
			x: e.x,
			y: e.y,
			k: e.k
		} : n(e, o / e.k, r, i);
	}
	function c(e, { gap: t = 16, homeK: n = 1, floor: r = 1 } = {}) {
		let i = t / (n > 0 ? n : 1), a = Infinity, o = (e || []).filter((e) => e && e.centre && e.box);
		for (let e = 0; e < o.length; e++) for (let t = e + 1; t < o.length; t++) {
			let n = o[e], r = o[t], s = (e, t, n, r, a, o) => {
				let s = r - e + (t - a), c = t - e - i;
				return s > 1e-9 ? c / s : -Infinity;
			}, c = n.centre.x, l = r.centre.x, u = n.centre.y, d = r.centre.y, f = c <= l ? s(c, l, n.box.x0, n.box.x1, r.box.x0, r.box.x1) : s(l, c, r.box.x0, r.box.x1, n.box.x0, n.box.x1), p = u <= d ? s(u, d, n.box.y0, n.box.y1, r.box.y0, r.box.y1) : s(d, u, r.box.y0, r.box.y1, n.box.y0, n.box.y1);
			a = Math.min(a, Math.max(f, p));
		}
		return Math.max(r, a);
	}
	function l(e, t) {
		let n = Infinity;
		for (let i of e || []) {
			if (!i || !i.box || !i.at) continue;
			let e = r(i.box, i.at.x, i.at.y, t);
			e !== null && (n = Math.min(n, e));
		}
		return Number.isFinite(n) ? n : null;
	}
	t.exports = {
		zoomModeOf: i,
		growCapOn: a,
		growShift: o,
		growConstrain: s,
		growCap: c,
		growFitRatio: l
	};
})), Ss = /* @__PURE__ */ h(((e, t) => {
	function n(e, t) {
		let n = Number(e && e.minCardWidthPx);
		return !Number.isFinite(n) || n <= 0 || !(t > 0) ? 0 : n / t;
	}
	function r(e, t, r) {
		return Math.max(e, n(t, r));
	}
	t.exports = {
		minCardScale: n,
		homeScale: r
	};
})), Cs = /* @__PURE__ */ h(((e, t) => {
	function n(e, t) {
		let n = /* @__PURE__ */ new Set();
		for (let r of e) for (let e of t(r) || []) n.add(e);
		return n;
	}
	var r = (e) => e && typeof e == "object" ? e.id : e;
	function i(e, t) {
		return t.has(r(e.source)) || t.has(r(e.target));
	}
	function a(e, t) {
		let n = e || [], r = t || {};
		if (r.containersStart === "open") return [];
		if (r.containersStart === "closed") {
			let e = n.filter((e) => e.parent);
			return (e.length ? e : n).map((e) => e.id);
		}
		return r.initialCollapsed === "all" ? n.map((e) => e.id) : Array.isArray(r.initialCollapsed) ? r.initialCollapsed.slice() : [];
	}
	function o(e) {
		let t = e || [], n = t.filter((e) => e.parent), r = (n.length ? n : t).map((e) => e.id), i = new Set(r);
		return {
			close: r,
			open: t.filter((e) => !i.has(e.id)).map((e) => e.id)
		};
	}
	t.exports = {
		closedMemberSet: n,
		edgeHidden: i,
		initiallyClosed: a,
		closeAllPlan: o
	};
})), ws = /* @__PURE__ */ h(((e, t) => {
	function n({ ms: e = 250, px: t = 32, now: n = () => Date.now(), setTimer: r = setTimeout, clearTimer: i = clearTimeout } = {}) {
		let a = null;
		function o(o, s, c, l) {
			let u = n();
			if (a && u - a.t <= e && Math.hypot(o - a.x, s - a.y) <= t) {
				i(a.timer);
				let e = a.double;
				a = null;
				let t = e || l;
				return t && t(), "double";
			}
			if (a) {
				i(a.timer);
				let e = a.run;
				a = null, e();
			}
			let d = {
				t: u,
				x: o,
				y: s,
				run: c,
				double: l
			};
			return d.timer = r(() => {
				a === d && (a = null), c();
			}, e), a = d, "pending";
		}
		function s() {
			a && i(a.timer), a = null;
		}
		return {
			tap: o,
			cancel: s
		};
	}
	t.exports = { createTapGate: n };
})), Ts = /* @__PURE__ */ h(((e, t) => {
	var n = [
		"container",
		"node",
		"node.readable",
		"space"
	], r = ["node", "node.readable"], i = {
		none: {
			kind: "any",
			targets: n,
			does: "Nothing."
		},
		"container.toggle": {
			kind: "press",
			targets: ["container"],
			does: "Opens a closed container, or closes an open one."
		},
		"view.zoomInStep": {
			kind: "press",
			targets: n,
			does: "Zooms in one step, the step of the + key (1.25 times), about the point every zoom keeps still (the cover art's pivot when the site has one, else the middle of the screen)."
		},
		"view.zoomAtPoint": {
			kind: "press",
			targets: n,
			does: "Zooms in about 2 times at the point tapped (out, with shift held); where every zoom is about the cover art's pivot, about the pivot."
		},
		"node.zoomToReadable": {
			kind: "press",
			targets: r,
			does: "Zooms in until the card's title renders at graph.readablePx CSS px or more (default 16), in the site's zoom mode; when that would take the card off the screen, the view also pans so the card stays under the finger."
		},
		"node.openReader": {
			kind: "press",
			targets: r,
			does: "Opens the reader on the card's piece."
		},
		"node.select": {
			kind: "press",
			targets: r,
			does: "Opens or closes the card in place (its text inside it) and makes it the card the panel acts on; the reader stays as it is."
		},
		"node.listen": {
			kind: "press",
			targets: r,
			does: "Reads the card's text aloud in the voice and at the speed the panel has, from its start; on the card being read, pauses; on the card paused in, reads on. A closed card opens first. What the play button in an open card does (settings.cards.listen)."
		},
		"node.stopListening": {
			kind: "press",
			targets: r,
			does: "Ends the reading when it is this card's; nothing otherwise. What the stop button in an open card does."
		},
		"node.move": {
			kind: "drag",
			targets: [
				"container",
				"node",
				"node.readable"
			],
			does: "Moves the card, or the container with all it holds, with the pointer or the finger."
		},
		"node.resize": {
			kind: "drag",
			targets: r,
			does: "A drag that starts on a card's edge or corner changes its size. Only while it is bound do the cards have edges to drag, and the panel \"Reset sizes\"."
		},
		"view.pan": {
			kind: "drag",
			targets: ["space"],
			does: "Moves the whole view with the pointer or the finger."
		},
		"view.deselect": {
			kind: "press",
			targets: n,
			does: "Closes the reader, takes off a highlighted tag and hides an edge's name."
		}
	}, a = [
		"container",
		"node",
		"node.readable",
		"space"
	], o = [
		"tap",
		"doubletap",
		"drag",
		"longpress"
	], s = (e) => e === "drag" ? "drag" : "press";
	function c(e) {
		let t = !!e && e.collapseGesture === "doubletap";
		return [
			t ? {
				target: "container",
				gesture: "doubletap",
				action: "container.toggle"
			} : {
				target: "container",
				gesture: "tap",
				action: "container.toggle"
			},
			...t ? [] : [{
				target: "container",
				gesture: "doubletap",
				action: "view.zoomAtPoint"
			}],
			{
				target: "container",
				gesture: "drag",
				action: "node.move"
			},
			{
				target: "node",
				gesture: "tap",
				action: "node.select"
			},
			{
				target: "node",
				gesture: "doubletap",
				action: "node.openReader"
			},
			{
				target: "node",
				gesture: "drag",
				action: "node.move"
			},
			{
				target: "node",
				gesture: "drag",
				action: "node.resize"
			},
			{
				target: "space",
				gesture: "tap",
				action: "view.deselect"
			},
			{
				target: "space",
				gesture: "doubletap",
				action: "view.zoomAtPoint"
			},
			{
				target: "space",
				gesture: "drag",
				action: "view.pan"
			}
		];
	}
	var l = /* @__PURE__ */ new Set();
	function u(e) {
		l.has(e) || (l.add(e), typeof console < "u" && console.warn && console.warn(e));
	}
	function d(e, t) {
		if (!e || typeof e != "object") return null;
		let { target: n, gesture: r, action: c } = e;
		if (!a.includes(n) || !o.includes(r)) return t(`graph.bindings: no target "${n}" or gesture "${r}"; the row is left out (targets: ${a.join(", ")}; gestures: ${o.join(", ")})`), null;
		let l = i[c];
		return l ? l.kind !== "any" && l.kind !== s(r) || !l.targets.includes(n) ? (t(`graph.bindings: "${c}" cannot answer a ${r} on ${n}; it does nothing there`), {
			target: n,
			gesture: r,
			action: "none"
		}) : {
			target: n,
			gesture: r,
			action: c
		} : (t(`graph.bindings: no action "${c}"; ${n} ${r} does nothing (see docs/ACTIONS.md)`), {
			target: n,
			gesture: r,
			action: "none"
		});
	}
	function f(e, { warn: t = u } = {}) {
		let n = c(e), r = e && Array.isArray(e.bindings) ? e.bindings : null;
		if (!r) return n;
		let i = r.map((e) => d(e, t)).filter(Boolean), a = new Set(i.map((e) => `${e.target} ${e.gesture}`)), o = new Set(i.map((e) => e.action).filter((e) => e !== "none"));
		return n.filter((e) => !a.has(`${e.target} ${e.gesture}`) && !o.has(e.action)).concat(i);
	}
	function p(e, t, n, { edge: r = !1 } = {}) {
		let i = (t) => (e || []).filter((e) => e.target === t && e.gesture === n), a = i(t);
		if (!a.length && t === "node.readable" && (a = i("node")), n === "drag") {
			if (r && a.some((e) => e.action === "node.resize")) return "node.resize";
			a = a.filter((e) => e.action !== "node.resize");
		}
		return a.length ? a[a.length - 1].action : "none";
	}
	function m(e, t) {
		return (e || []).some((e) => e.action === t);
	}
	function h(e, t) {
		return (e || []).some((e) => e.gesture === t && e.action !== "none");
	}
	function g(e) {
		return m(f(e), "node.resize");
	}
	t.exports = {
		ACTIONS: i,
		TARGETS: a,
		GESTURES: o,
		defaultBindings: c,
		bindingsOf: f,
		resolve: p,
		isBound: m,
		usesGesture: h,
		resizeOn: g
	};
})), Es = /* @__PURE__ */ h(((e, t) => {
	function n(e) {
		let t = Number(e && e.readablePx);
		return Number.isFinite(t) && t > 0 ? t : 16;
	}
	function r(e, t, n = 1) {
		return !(e > 0) || !(t > 0) ? 0 : e * t * (n > 0 ? n : 1);
	}
	function i(e, t, n, r = Infinity) {
		return !(e > 0) || !(t > 0) || !(n > 0) ? e : Math.min(r, Math.max(e, n / t * e * 1.000001));
	}
	function a({ finger: e, before: t, after: n, ratio: r, half: i, area: a }) {
		if (n.x - i.w >= a.x0 && n.x + i.w <= a.x1 && n.y - i.h >= a.y0 && n.y + i.h <= a.y1 || !e || !t) return {
			x: 0,
			y: 0
		};
		let o = r > 0 ? r : 1;
		return {
			x: e.x - (n.x + (e.x - t.x) * o),
			y: e.y - (n.y + (e.y - t.y) * o)
		};
	}
	t.exports = {
		readablePxOf: n,
		titleScreenPx: r,
		readableZoom: i,
		keepUnderFinger: a
	};
})), Ds = /* @__PURE__ */ h(((e, t) => {
	var n = .6;
	function r(e) {
		return e < n ? "title" : "full";
	}
	function i(e) {
		return function({ hovered: t, pinned: n } = {}) {
			return n ? {
				width: e.pinnedWidth,
				height: e.pinnedHeight
			} : t ? {
				width: e.hoverWidth,
				height: e.hoverHeight
			} : {
				width: e.width,
				height: e.height
			};
		};
	}
	t.exports = {
		LOD_TITLE: n,
		getLOD: r,
		makeCardSizeFor: i
	};
})), Os = /* @__PURE__ */ h(((e, t) => {
	function n(e, { gap: t = 12, maxRounds: n = 200 } = {}) {
		let r = e.map((e) => ({ ...e })), i = /* @__PURE__ */ new Map();
		for (let e = 0; e < n; e++) {
			let e = !1;
			for (let n = 0; n < r.length; n++) for (let a = n + 1; a < r.length; a++) {
				let o = r[n], s = r[a], c = (o.w + s.w) / 2 + t - Math.abs(o.x - s.x), l = (o.h + s.h) / 2 + t - Math.abs(o.y - s.y);
				if (!(c <= 0 || l <= 0)) {
					if (e = !0, c < l) {
						let e = o.x < s.x || o.x === s.x && n < a ? -1 : 1;
						o.x += e * c / 2, s.x -= e * c / 2;
					} else {
						let e = o.y < s.y || o.y === s.y && n < a ? -1 : 1;
						o.y += e * l / 2, s.y -= e * l / 2;
					}
					i.set(o.id, o), i.set(s.id, s);
				}
			}
			if (!e) break;
		}
		let a = /* @__PURE__ */ new Map();
		for (let [e, t] of i) a.set(e, {
			x: t.x,
			y: t.y
		});
		return a;
	}
	function r(e, t = 0) {
		let n = 0;
		for (let r = 0; r < e.length; r++) for (let i = r + 1; i < e.length; i++) {
			let a = e[r], o = e[i];
			Math.abs(a.x - o.x) < (a.w + o.w) / 2 + t && Math.abs(a.y - o.y) < (a.h + o.h) / 2 + t && n++;
		}
		return n;
	}
	t.exports = {
		separateOpen: n,
		overlappingPairs: r
	};
})), ks = /* @__PURE__ */ h(((e, t) => {
	var { EDGE_WEIGHT_DEFAULTS: n, normaliseEdgeWeights: r } = gs(), i = [
		"enabled",
		"mode",
		"spacing",
		"startRadius",
		"direction",
		"strength",
		"anchorEnd",
		"openTowards",
		"keepBelow",
		"cardScale"
	], a = [
		"linkDistance",
		"chargeStrength",
		"collidePadding"
	];
	function o(e, t) {
		let n = {};
		if (!e || typeof e != "object") return n;
		for (let r of t) e[r] !== void 0 && e[r] !== null && (n[r] = e[r]);
		return n;
	}
	function s(e) {
		let t = o(e, i);
		return t.anchorEnd === "center" && delete t.anchorEnd, t.openTowards === "down" && delete t.openTowards, Number(t.cardScale) === 1 && delete t.cardScale, t;
	}
	function c(e) {
		if (!e || typeof e != "object") return null;
		let t = Object.keys(e).filter((t) => e[t] && Number.isFinite(Number(e[t].x)) && Number.isFinite(Number(e[t].y))).sort();
		return t.length ? t.map((t) => [
			t,
			Number(e[t].x),
			Number(e[t].y)
		]) : null;
	}
	function l(e) {
		if (!e || typeof e != "object") return null;
		let t = Object.keys(e).filter((t) => e[t] && Object.keys(e[t]).length).sort();
		return t.length ? t.map((t) => [t, e[t]]) : null;
	}
	function u(e, t) {
		let i = e && typeof e == "object" && !Array.isArray(e) ? e : {}, a = t && typeof t == "object" && !Array.isArray(t) ? t : {}, o = r({
			...i,
			...a,
			weights: {
				...i.weights && typeof i.weights == "object" && !Array.isArray(i.weights) ? i.weights : {},
				...a.weights && typeof a.weights == "object" && !Array.isArray(a.weights) ? a.weights : {}
			}
		}), s = {};
		if (o.mode !== n.mode && (s.mode = o.mode), o.mode === "weighted") {
			o.degreePenalty !== n.degreePenalty && (s.degreePenalty = o.degreePenalty), o.recencyClock !== n.recencyClock && (s.recencyClock = o.recencyClock), o.recencyHalfLifeDays !== n.recencyHalfLifeDays && (s.recencyHalfLifeDays = o.recencyHalfLifeDays), o.recencyFloor !== n.recencyFloor && (s.recencyFloor = o.recencyFloor), o.distanceSpread !== n.distanceSpread && (s.distanceSpread = o.distanceSpread);
			let e = {};
			for (let t of Object.keys(o.weights).sort()) {
				let r = t in n.weights ? n.weights[t] : 1;
				o.weights[t] !== r && (e[t] = o.weights[t]);
			}
			Object.keys(e).length && (s.weights = e);
		}
		return Object.keys(s).length ? s : null;
	}
	function d(e, { anchors: t, layouts: n, edgeWeights: r } = {}) {
		let i = e || {}, d = Number.isFinite(Number(i.layoutVersion)) && i.layoutVersion !== null && i.layoutVersion !== "" ? Number(i.layoutVersion) : 1, f = i.card || {}, p = {
			v: d,
			spiral: s(i.spiral),
			card: o(f, ["width", "height"]),
			sim: o(i.simulation, a)
		}, m = c(t);
		m && (p.anchors = m), i.containerLayout && (p.containerLayout = i.containerLayout), i.hang && typeof i.hang == "object" && (p.hang = o(i.hang, [
			"direction",
			"firstAt",
			"columns",
			"gap"
		])), i.hull && typeof i.hull == "object" && i.hull.padding != null && (p.hullPadding = i.hull.padding);
		let h = l(n);
		h && (p.layouts = h);
		let g = u(i.edgeWeights, r);
		return g && (p.edgeWeights = g), JSON.stringify(p);
	}
	function f(e) {
		let t = 2166136261;
		for (let n = 0; n < e.length; n += 1) t ^= e.charCodeAt(n), t = Math.imul(t, 16777619) >>> 0;
		return t.toString(36);
	}
	function p(e, t, n) {
		return `${e}@${f(d(t, n))}`;
	}
	t.exports = {
		layoutKey: p,
		layoutSignature: d
	};
})), As = /* @__PURE__ */ h(((e, t) => {
	var { rootShape: n, rng: r, hashString: i } = zo(), a = {
		enabled: !1,
		tips: [],
		perContainer: 3,
		stopShort: 18,
		lagMs: 600,
		drawMs: 1800
	}, o = {
		opacity: 1,
		opacityZoomedIn: .3,
		zoomForFloor: 2.5,
		keepAbove: 0
	}, s = (e, t) => e !== "" && e != null && Number.isFinite(Number(e)) ? Number(e) : t, c = (e) => Math.max(0, Math.min(1, e)), l = (e) => {
		let t = c(e);
		return t * t * (3 - 2 * t);
	};
	function u(e) {
		if (!e || typeof e != "object") return null;
		let t = s(e.x, NaN), n = s(e.y, NaN);
		return Number.isFinite(t) && Number.isFinite(n) ? {
			x: t,
			y: n
		} : null;
	}
	function d(e) {
		let t = e && e.reach;
		if (!t || t.enabled !== !0) return null;
		let n = (Array.isArray(t.tips) ? t.tips : []).map(u).filter(Boolean);
		return n.length ? {
			enabled: !0,
			tips: n,
			perContainer: Math.max(1, Math.round(s(t.perContainer, a.perContainer))),
			stopShort: Math.max(0, s(t.stopShort, a.stopShort)),
			lagMs: Math.max(0, s(t.lagMs, a.lagMs)),
			drawMs: Math.max(0, s(t.drawMs, a.drawMs))
		} : null;
	}
	function f(e) {
		let t = e && e.backdrop && typeof e.backdrop == "object" ? e.backdrop : {}, n = e && e.graph && e.graph.artOpacity;
		return {
			opacity: c(s(t.opacity, s(n, o.opacity))),
			opacityZoomedIn: c(s(t.opacityZoomedIn, o.opacityZoomedIn)),
			zoomForFloor: Math.max(1.01, s(t.zoomForFloor, o.zoomForFloor)),
			keepAbove: c(s(t.keepAbove, o.keepAbove))
		};
	}
	function p(e, t, n) {
		let r = e || o;
		if (!(t > 0) || !(n > 0)) return r.opacity;
		let i = t / n;
		if (i <= 1) return r.opacity;
		let a = l((i - 1) / (r.zoomForFloor - 1));
		return r.opacity + (r.opacityZoomedIn - r.opacity) * a;
	}
	function m(e, t) {
		return {
			x: t.left + e.x * t.width,
			y: t.top + e.y * t.height
		};
	}
	function h(e, t, n, r = {
		x: 0,
		y: 0
	}) {
		let i = m(e, t);
		return {
			x: (i.x - r.x - n.x) / n.k,
			y: (i.y - r.y - n.y) / n.k
		};
	}
	function g(e) {
		return {
			x: 0,
			y: 0,
			k: e
		};
	}
	function _(e, t, n) {
		return e.map((e, n) => ({
			i: n,
			d: Math.hypot(e.x - t.x, e.y - t.y)
		})).sort((e, t) => e.d - t.d || e.i - t.i).slice(0, Math.max(0, n)).map((e) => e.i);
	}
	function v(e, t) {
		let n = !1;
		for (let r = 0, i = t.length - 1; r < t.length; i = r++) {
			let a = t[r], o = t[i];
			a.y > e.y != o.y > e.y && e.x < (o.x - a.x) * (e.y - a.y) / (o.y - a.y) + a.x && (n = !n);
		}
		return n;
	}
	function y(e, t, n) {
		let r = t.x - e.x, i = t.y - e.y, a = null;
		for (let t = 0, o = n.length - 1; t < n.length; o = t++) {
			let s = n[o], c = n[t], l = c.x - s.x, u = c.y - s.y, d = r * u - i * l;
			if (Math.abs(d) < 1e-9) continue;
			let f = ((s.x - e.x) * u - (s.y - e.y) * l) / d, p = ((s.x - e.x) * i - (s.y - e.y) * r) / d;
			f >= 0 && f <= 1 && p >= 0 && p <= 1 && (!a || f < a.t) && (a = {
				x: e.x + r * f,
				y: e.y + i * f,
				t: f
			});
		}
		return a;
	}
	var b = 4;
	function x(e, t, n, r) {
		if (!n || n.length < 3 || v(e, n)) return null;
		let i = y(e, t, n);
		if (!i) return null;
		let a = Math.hypot(i.x - e.x, i.y - e.y);
		if (a - r < b) return null;
		let o = (a - r) / a;
		return {
			end: {
				x: e.x + (i.x - e.x) * o,
				y: e.y + (i.y - e.y) * o
			},
			hit: i,
			length: a - r
		};
	}
	function S(e, t, n, r) {
		let i = [];
		for (let a of _(e, t.centre, e.length)) {
			if (i.length >= n) break;
			let o = x(e[a], t.centre, t.hull, r);
			o && i.push({
				tip: a,
				...o
			});
		}
		return i;
	}
	var C = (e) => 1 - (1 - c(e)) ** 3;
	function w(e, { ease: t = C, epsilon: n = .25 } = {}) {
		let r = null, i = null, a = 0, o = (n) => {
			if (!i) return null;
			if (!r || e <= 0) return {
				x: i.x,
				y: i.y
			};
			let o = t((n - a) / e);
			return {
				x: r.x + (i.x - r.x) * o,
				y: r.y + (i.y - r.y) * o
			};
		};
		return {
			to(e, t) {
				if (e) {
					if (!i) {
						i = {
							x: e.x,
							y: e.y
						}, r = null;
						return;
					}
					Math.hypot(e.x - i.x, e.y - i.y) < n || (r = o(t), i = {
						x: e.x,
						y: e.y
					}, a = t);
				}
			},
			at: o,
			settled(t) {
				return !i || !r || e <= 0 || t - a >= e;
			},
			jump(e) {
				i = e ? {
					x: e.x,
					y: e.y
				} : null, r = null;
			}
		};
	}
	var T = (e) => (Math.round(e * 10) / 10).toString();
	function E(e) {
		if (!e.length) return "";
		let t = `M${T(e[0][0])} ${T(e[0][1])}`;
		for (let n = 1; n < e.length; n++) t += `L${T(e[n][0])} ${T(e[n][1])}`;
		return t;
	}
	function D(e) {
		let t = n(e), a = r(i(String(e) + "|forks")), o = (e, t) => e + (t - e) * a(), s = [], c = 2 + Math.floor(a() * 2);
		for (let e = 0; e < c; e++) {
			let e = {
				t: o(.18, .7),
				angle: (a() < .5 ? -1 : 1) * o(.28, .62),
				length: o(.16, .34),
				bend: o(-.35, .35),
				twig: a() < .5 ? {
					t: o(.4, .75),
					angle: (a() < .5 ? -1 : 1) * o(.35, .7),
					length: o(.3, .55)
				} : null
			};
			s.push(e);
		}
		return {
			waves: t.waves,
			grain: t.grain,
			forks: s
		};
	}
	function O(e, t, n, r) {
		let i = t.x - e.x, a = t.y - e.y, o = Math.hypot(i, a) || 1, s = -a / o, c = i / o, l = [];
		for (let t = 0; t <= r; t++) {
			let u = t / r, d = Math.sin(Math.PI * u), f = 0;
			for (let e of n.waves) f += e.amp * Math.sin(e.freq * Math.PI * 2 * u + e.phase);
			f = f * d * o * .8 + n.grain[t % n.grain.length] * Math.min(1.6, o * .005) * d, l.push([e.x + i * u + s * f, e.y + a * u + c * f]);
		}
		return l;
	}
	function k(e, t, n, r, i, a) {
		let o = [[e[0], e[1]]], s = t + n, c = e[0], l = e[1], u = r / a;
		for (let e = 1; e <= a; e++) s += i / a, c += Math.cos(s) * u, l += Math.sin(s) * u, o.push([c, l]);
		return o;
	}
	function A(e, t, n) {
		if (!e || !t || !Number.isFinite(e.x) || !Number.isFinite(t.x)) return {
			main: "",
			fine: ""
		};
		let r = Math.hypot(t.x - e.x, t.y - e.y);
		if (r < b) return {
			main: "",
			fine: ""
		};
		let i = Math.max(8, Math.min(40, Math.round(r / 12))), a = O(e, t, n, i), o = Math.atan2(t.y - e.y, t.x - e.x), s = "";
		for (let e of n.forks) {
			let t = a[Math.round(e.t * i)], n = (1 - e.t) * r * .85, c = Math.cos(Math.abs(e.angle)) || 1, l = Math.max(0, Math.min(e.length * r, n / c, 160));
			if (l < 6) continue;
			let u = k(t, o, e.angle, l, e.bend * .5, 5);
			if (s += E(u), e.twig) {
				let t = u[Math.round(e.twig.t * (u.length - 1))], n = l * e.twig.length * (1 - e.twig.t);
				n >= 4 && (s += E(k(t, o + e.angle, e.twig.angle * .6, n, 0, 3)));
			}
		}
		return {
			main: E(a),
			fine: s
		};
	}
	t.exports = {
		REACH_DEFAULTS: a,
		BACKDROP_DEFAULTS: o,
		reachConfig: d,
		backdropConfig: f,
		backdropOpacity: p,
		fraction: u,
		artPoint: m,
		anchorWorld: h,
		homeView: g,
		nearestTips: _,
		reachFor: S,
		insidePolygon: v,
		rayHit: y,
		reachEnd: x,
		createLag: w,
		reachShape: D,
		reachPath: A
	};
})), js = /* @__PURE__ */ h(((e, t) => {
	var n = [
		"dawn",
		"morning",
		"midday",
		"afternoon",
		"dusk",
		"evening",
		"night",
		"late-night"
	];
	function r(e) {
		return e == null ? "" : String(e).trim();
	}
	function i(...e) {
		let t = {
			time_of_day: "",
			date: "",
			place: ""
		};
		for (let n of e) {
			if (!n || typeof n != "object") continue;
			let e = n.scene && typeof n.scene == "object" ? {
				...n,
				...n.scene
			} : n;
			for (let n of Object.keys(t)) !t[n] && r(e[n]) && (t[n] = r(e[n]));
		}
		if (t.time_of_day) {
			let e = t.time_of_day.toLowerCase().replace(/\s+/g, "-");
			t.time_of_day = n.includes(e) ? e : "";
		}
		return t.time_of_day || t.date || t.place ? t : null;
	}
	function a(e) {
		let t = /^(?:\d{4}|X{4})-(\d{2})/.exec(r(e));
		if (!t) return null;
		let n = Number(t[1]);
		return n >= 1 && n <= 12 ? n : null;
	}
	t.exports = {
		sceneFrom: i,
		sceneMonth: a,
		TIMES_OF_DAY: n
	};
})), Ms = /* @__PURE__ */ h(((e, t) => {
	var { TIMES_OF_DAY: n, sceneMonth: r } = js(), i = {
		dawn: {
			dark: ["#262036", "#38283a"],
			light: ["#f6e7e1", "#efe3d6"]
		},
		morning: {
			dark: ["#1b2838", "#26323e"],
			light: ["#f6f0df", "#eef0e4"]
		},
		midday: {
			dark: ["#1d2b38", "#22323a"],
			light: ["#f8f5e9", "#f1efe3"]
		},
		afternoon: {
			dark: ["#28282e", "#352c22"],
			light: ["#f6ecd7", "#efe1c8"]
		},
		dusk: {
			dark: ["#2a1e32", "#3a241e"],
			light: ["#f0dfd6", "#e9d4c3"]
		},
		evening: {
			dark: ["#1a1c32", "#281f34"],
			light: ["#e7e2e8", "#ded8dd"]
		},
		night: {
			dark: ["#0d1020", "#141a2c"],
			light: ["#dcdee6", "#d2d5df"]
		},
		"late-night": {
			dark: ["#07080f", "#0d0f18"],
			light: ["#d0d3dc", "#c7cad4"]
		}
	}, a = {
		winter: "#5878b8",
		spring: "#5f9a5a",
		summer: "#d8963a",
		autumn: "#b8602e"
	}, o = {
		dark: "#a8b2d1",
		light: "#2b2722"
	}, s = {
		dark: "#a3abc4",
		light: "#4d463d"
	};
	function c(e) {
		let t = e && e.theme && e.theme.timeOfDay;
		if (!t) return null;
		let n = t === !0 ? {} : t;
		if (n.enabled === !1) return null;
		let r = { ...i };
		for (let [e, t] of Object.entries(n.palettes || {})) r[e] = {
			...r[e] || {},
			...t
		};
		return {
			transitionSeconds: Number.isFinite(n.transitionSeconds) ? n.transitionSeconds : 4,
			seasonTint: Number.isFinite(n.seasonTint) ? n.seasonTint : .1,
			hemisphere: n.hemisphere === "south" ? "south" : "north",
			palettes: r,
			seasons: {
				...a,
				...n.seasons || {}
			},
			text: {
				...o,
				...n.text || {}
			},
			quiet: {
				...s,
				...n.quiet || {}
			}
		};
	}
	function l(e, t = "north") {
		if (!e) return null;
		let n = e <= 2 || e === 12 ? "winter" : e <= 5 ? "spring" : e <= 8 ? "summer" : "autumn";
		return t === "south" ? {
			winter: "summer",
			summer: "winter",
			spring: "autumn",
			autumn: "spring"
		}[n] : n;
	}
	function u(e) {
		let t = String(e).trim(), n = /^rgba?\(([^)]+)\)/.exec(t);
		if (n) return n[1].split(",").slice(0, 3).map((e) => Number(e.trim()));
		let r = t.replace("#", ""), i = r.length === 3 ? r.split("").map((e) => e + e).join("") : r;
		return [
			0,
			2,
			4
		].map((e) => parseInt(i.slice(e, e + 2), 16));
	}
	function d(e) {
		return "#" + e.map((e) => Math.max(0, Math.min(255, Math.round(e))).toString(16).padStart(2, "0")).join("");
	}
	function f(e, t, n) {
		let r = u(e), i = u(t);
		return d(r.map((e, t) => e + (i[t] - e) * n));
	}
	function p(e) {
		let [t, n, r] = u(e).map((e) => {
			let t = e / 255;
			return t <= .03928 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
		});
		return .2126 * t + .7152 * n + .0722 * r;
	}
	function m(e, t) {
		let n = p(e), r = p(t);
		return (Math.max(n, r) + .05) / (Math.min(n, r) + .05);
	}
	function h(e, t, { target: n = 3, opacity: r = .55 } = {}) {
		let i = (t || []).filter(Boolean).map((e) => d(u(e))), a = d(u(e));
		if (!i.length) return {
			color: a,
			opacity: r
		};
		let o = (e, t) => Math.min(...i.map((n) => m(f(n, e, t), n)));
		for (let e = r; e <= 1.0001; e += .05) if (o(a, Math.min(e, 1)) >= n) return {
			color: a,
			opacity: Math.round(Math.min(e, 1) * 100) / 100
		};
		let s = i.reduce((e, t) => e + +(p(t) < .18), 0) > i.length / 2 ? "#ffffff" : "#000000";
		for (let e = .05; e <= 1.0001; e += .05) {
			let t = f(a, s, Math.min(e, 1));
			if (o(t, 1) >= n) return {
				color: t,
				opacity: 1
			};
		}
		return {
			color: s,
			opacity: 1
		};
	}
	function g(e, t, r) {
		let i = r ? [r] : [];
		if (!e) return i;
		for (let r of n) for (let n of [
			"",
			"2030-01-15",
			"2030-04-15",
			"2030-07-15",
			"2030-10-15"
		]) {
			let a = _({ scene: {
				time_of_day: r,
				date: n
			} }, e, t);
			a && i.push(a.top, a.bottom);
		}
		return i;
	}
	function _(e, t, i = "dark") {
		if (!t || !e) return null;
		let a = e.scene || {}, o = n.includes(a.time_of_day) ? a.time_of_day : null;
		if (!o) return null;
		let s = t.palettes[o] && (t.palettes[o][i] || t.palettes[o].dark);
		if (!s) return null;
		let c = l(r(a.date), t.hemisphere), u = c && t.seasons[c] ? (e) => f(e, t.seasons[c], t.seasonTint) : (e) => e;
		return {
			time: o,
			season: c,
			mode: i,
			top: u(s[0]),
			bottom: u(s[1])
		};
	}
	t.exports = {
		config: c,
		ambienceFor: _,
		seasonOf: l,
		contrast: m,
		mix: f,
		luminance: p,
		legibleOn: h,
		allBackgrounds: g,
		PALETTES: i,
		SEASONS: a,
		TEXT: o,
		QUIET: s
	};
})), Ns = /* @__PURE__ */ h(((e, t) => {
	var n = [
		"essay",
		"comment",
		"art",
		"connection"
	], r = {
		src: "./contributions.json",
		submit: !1,
		showTest: !1,
		endpoint: "./api/contributions",
		assetBase: "./contributions/assets/",
		limits: {
			name: 60,
			body: 8e3,
			exact: 400
		}
	};
	function i(e) {
		let t = e && e.contributions;
		if (!t || t.enabled === !1) return null;
		let n = typeof t == "object" ? t : {};
		return {
			...r,
			...n,
			submit: n.submit === !0,
			showTest: n.showTest === !0,
			limits: {
				...r.limits,
				...n.limits || {}
			}
		};
	}
	function a(e) {
		let t = e && (e.url || e.id) || "";
		return String(t).split("/").pop().replace(/\.html?$/, "");
	}
	function o(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of e || []) t.set(a(n), n), n.id && t.set(String(n.id), n);
		return t;
	}
	var s = (e) => typeof e == "string" ? e : "";
	function c(e) {
		let t = s(e);
		return !t || t.length > 200 || /^[a-z][a-z0-9+.-]*:/i.test(t) || t.startsWith("/") || t.startsWith("\\") || t.split(/[\\/]/).some((e) => e === ".." || e === "." || e === "") ? !1 : /^[A-Za-z0-9][A-Za-z0-9/_-]*\.(png|jpe?g|webp|gif|avif)$/i.test(t);
	}
	function l(e, t) {
		return (t && t.assetBase || r.assetBase).replace(/\/?$/, "/") + e;
	}
	function u(e, { items: t, showTest: r = !1 } = {}) {
		let i = Array.isArray(e) ? e : e && Array.isArray(e.contributions) ? e.contributions : [], l = t ? o(t) : null, u = (e) => !l || l.has(s(e)), d = [], f = /* @__PURE__ */ new Set();
		for (let e of i) {
			if (!e || typeof e != "object" || e.status !== "approved" || e.test === !0 && !r || !n.includes(e.type)) continue;
			let t = s(e.id);
			if (!t || f.has(t)) continue;
			let i = e.anchor && typeof e.anchor == "object" ? e.anchor : {}, o = s(i.chapter);
			if (!o || !u(o) || e.type === "connection" && (!s(e.to) || !u(e.to) || s(e.to) === o) || e.type === "art" && !c(e.asset) || e.type !== "art" && !s(e.body).trim()) continue;
			f.add(t);
			let p = (e) => l ? a(l.get(e)) : e;
			d.push({
				id: t,
				type: e.type,
				author: s(e.author).trim() || "A reader",
				created: s(e.created),
				test: e.test === !0,
				chapter: p(o),
				to: e.type === "connection" ? p(s(e.to)) : null,
				quote: s(i.exact).trim() ? {
					exact: s(i.exact),
					prefix: s(i.prefix),
					suffix: s(i.suffix)
				} : null,
				title: s(e.title).trim().slice(0, 140),
				body: s(e.body),
				asset: e.type === "art" ? e.asset : null,
				alt: s(e.alt)
			});
		}
		return d;
	}
	function d(e, t) {
		return (e || []).filter((e) => e.chapter === t || e.type === "connection" && e.to === t);
	}
	function f(e) {
		let t = /* @__PURE__ */ new Map(), n = (e) => t.set(e, (t.get(e) || 0) + 1);
		for (let t of e || []) n(t.chapter), t.type === "connection" && t.to && n(t.to);
		return t;
	}
	function p(e) {
		return (e || []).filter((e) => e.type === "connection").map((e) => ({
			id: e.id,
			source: e.chapter,
			target: e.to,
			layer: "contribution",
			label: e.body,
			author: e.author
		}));
	}
	var m = (e) => String(e || "").replace(/\s+/g, " ");
	function h(e, t) {
		let n = [];
		if (!t) return n;
		let r = e.indexOf(t);
		for (; r !== -1;) n.push(r), r = e.indexOf(t, r + 1);
		return n;
	}
	function g(e, t) {
		if (!t || !m(t.exact).trim()) return null;
		let n = m(t.exact).trim(), r = m(t.prefix).trim(), i = m(t.suffix).trim(), a = (e || []).map((e) => m(e)), o = [], s = "";
		a.forEach((e, t) => {
			o.push(s.length), s += e + (t < a.length - 1 ? "\n" : "");
		});
		let c = h(s, n).filter((e) => !s.slice(e, e + n.length).includes("\n"));
		if (!c.length) return null;
		let l = (e) => {
			let t = 0;
			return r && s.slice(Math.max(0, e - r.length - 2), e).replace(/\n/g, " ").trim().endsWith(r) && (t += 1), i && s.slice(e + n.length, e + n.length + i.length + 2).replace(/\n/g, " ").trim().startsWith(i) && (t += 1), t;
		}, u = c[0];
		if (c.length > 1) {
			let e = c.map((e) => ({
				i: e,
				s: l(e)
			})).sort((e, t) => t.s - e.s);
			if (e[0].s === 0 || e[0].s === e[1].s) return null;
			u = e[0].i;
		}
		let d = 0;
		for (; d + 1 < o.length && o[d + 1] <= u;) d++;
		return {
			para: d,
			offset: u - o[d],
			length: n.length
		};
	}
	function _(e) {
		return String(e || "").replace(/\r\n?/g, "\n").split(/\n\s*\n/).map((e) => e.trim()).filter(Boolean);
	}
	function v(e, t, n, r = 5) {
		let i = String(e || ""), a = i.slice(t, n).trim();
		if (!a) return null;
		let o = i.slice(0, t).trim().split(/\s+/).filter(Boolean), s = i.slice(n).trim().split(/\s+/).filter(Boolean);
		return {
			exact: a,
			prefix: o.slice(-r).join(" "),
			suffix: s.slice(0, r).join(" ")
		};
	}
	function y(e, t) {
		let n = {
			...r.limits,
			...t && t.limits || {}
		}, i = [], a = s(e && e.author).trim(), o = s(e && e.type), c = s(e && e.body);
		a || i.push("A name to show is needed."), a.length > n.name && i.push(`The name can be at most ${n.name} characters.`), [
			"essay",
			"comment",
			"connection"
		].includes(o) || i.push("Choose essay, comment or connection."), c.trim() || i.push("Write something first."), c.length > n.body && i.push(`At most ${n.body} characters.`);
		let l = e && e.anchor || {};
		return s(l.chapter) || i.push("Which chapter is this about?"), l.exact && s(l.exact).length > n.exact && i.push(`The passage can be at most ${n.exact} characters.`), o === "connection" && (!s(e.to) || e.to === l.chapter) && i.push("Choose the other chapter."), i;
	}
	t.exports = {
		TYPES: n,
		DEFAULTS: r,
		contributionsConfig: i,
		slugOf: a,
		isOwnAsset: c,
		assetUrl: l,
		visibleContributions: u,
		forChapter: d,
		countsByChapter: f,
		connectionEdges: p,
		resolveQuote: g,
		paragraphsOf: _,
		quoteFromSelection: v,
		checkSubmission: y
	};
})), Ps = /* @__PURE__ */ h(((e, t) => {
	var n = (e) => typeof e == "string" ? e.trim() : "";
	function r(e) {
		return !e || typeof e != "object" ? "" : n(e.link) || n(e.external_url);
	}
	function i(e) {
		return !e || typeof e != "object" ? "" : n(e.summary) || n(e.blurb);
	}
	function a(e) {
		return typeof e == "string" && /\S/.test(e);
	}
	function o({ link: e, body: t } = {}) {
		return !!n(e) && !a(t);
	}
	function s(e) {
		if (!e || typeof e != "object") return !1;
		let t = e.originalItem || e;
		return t.kind === "link" && !!l(t);
	}
	function c(e) {
		return !!(e && n(e.external_url)) && !a(e.content_html) && !a(e.content_text);
	}
	function l(e) {
		if (!e || typeof e != "object") return "";
		let t = e.originalItem || e;
		return n(t.external_url) || n(t.link);
	}
	function u(e) {
		let t = e && e.graph && e.graph.links && e.graph.links.newTab;
		return t === "always" || t === "never" ? t : "external";
	}
	function d(e, t) {
		try {
			return new URL(e, t).href;
		} catch {
			return e;
		}
	}
	function f(e, { mode: t = "external", base: n = "" } = {}) {
		if (t === "always") return "_blank";
		if (t === "never") return "_self";
		let r, i;
		try {
			i = new URL(n), r = new URL(e, i);
		} catch {
			return /^[a-z][a-z0-9+.-]*:/i.test(String(e || "")) ? "_blank" : "_self";
		}
		return r.origin === i.origin ? "_self" : "_blank";
	}
	function p(e, { settings: t = null, win: n = typeof window < "u" ? window : null } = {}) {
		let r = l(e);
		if (!r || !n) return null;
		let i = n.document && n.document.baseURI || n.location && n.location.href || "", a = d(r, i), o = f(r, {
			mode: u(t || n.SETTINGS),
			base: i
		});
		return o === "_blank" ? n.open(a, "_blank", "noopener") : n.location.assign(a), {
			href: a,
			target: o
		};
	}
	var m = (e) => String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
	function h({ title: e = "", href: t = "", blurb: n = "", head: r = "" } = {}) {
		let i = m(e), a = m(t);
		return `<!doctype html>\n<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${i}</title><meta http-equiv="refresh" content="0; url=${a}"><link rel="canonical" href="${a}">${r ? "\n" + r : ""}</head><body><h1>${i}</h1>${n ? `\n<p>${m(n)}</p>` : ""}\n<p><a href="${a}">${a}</a></p></body></html>\n`;
	}
	function g(e) {
		let t = e && e.graph && e.graph.intro;
		return typeof t == "string" ? n(t) ? {
			text: t.trim(),
			format: "plain"
		} : null : t && typeof t == "object" && n(t.text) ? {
			text: t.text.trim(),
			format: t.format === "markdown" ? "markdown" : "plain"
		} : null;
	}
	function _(e, t) {
		return e ? e.format === "markdown" && typeof t == "function" ? String(t(e.text)).replace(/<script[\s\S]*?<\/script>/gi, "").replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "").trim() : e.text.split(/\n\s*\n/).map((e) => `<p>${m(e.trim()).replace(/\n/g, "<br>")}</p>`).join("") : "";
	}
	t.exports = {
		linkFromFrontMatter: r,
		blurbFromFrontMatter: i,
		hasBodyText: a,
		isLinkContent: o,
		isLinkItem: s,
		isLinkFeedItem: c,
		linkOf: l,
		newTabMode: u,
		resolveLink: d,
		linkTarget: f,
		followLink: p,
		redirectPage: h,
		introConfig: g,
		introHtml: _
	};
})), Fs = /* @__PURE__ */ h(((e, t) => {
	function n(e) {
		return String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
	}
	function r(e) {
		if (!e || !e.holder) return null;
		let t = `© ${e.year ? e.year + " " : ""}${e.holder}.`, n = (e.statement || "").trim();
		return e.noAiTraining && !/train/i.test(n) && (n = (n ? n + " " : "") + "Not to be used to train any machine-learning system."), n ? `${t} ${n}` : t;
	}
	function i(e) {
		if (!e || !e.holder) return "";
		let t = `<meta name="copyright" content="${n(`${e.holder}${e.year ? " " + e.year : ""}`)}">`;
		return e.noAiTraining && (t += "\n<meta name=\"robots\" content=\"noai, noimageai\">"), t;
	}
	function a(e) {
		return e && e.position === "bottom-edge" ? "bottom-edge" : null;
	}
	function o(e) {
		let t = r(e), i = a(e);
		return t ? `<footer class="pp-rights" data-rights${i ? ` data-rights-position="${i}"` : ""}>${n(t)}</footer>` : "";
	}
	function s(e, t) {
		return !e || !(e.right > e.left) || !(e.bottom > e.top) ? !1 : (t || []).some((t) => t && t.right > t.left && t.bottom > t.top && t.left < e.right && e.left < t.right && t.top < e.bottom && e.top < t.bottom);
	}
	t.exports = {
		rightsLine: r,
		rightsMeta: i,
		rightsFooterHtml: o,
		rightsPosition: a,
		rightsOverCards: s
	};
})), Is = /* @__PURE__ */ h(((e, t) => {
	var n = [
		["freq", "frequency"],
		["cover", "coverage"],
		["trust", "trust"],
		["quality", "quality"]
	];
	function r(e) {
		if (!e || typeof e != "object") return [];
		let t = /* @__PURE__ */ new Map();
		if (Array.isArray(e)) for (let n of e) typeof n == "string" && n && t.set(n, (t.get(n) || 0) + 1);
		else for (let [n, r] of Object.entries(e)) {
			let e = Number(r);
			n && Number.isFinite(e) && e > 0 && t.set(n, (t.get(n) || 0) + e);
		}
		return Array.from(t.entries()).map(([e, t]) => ({
			label: e,
			count: t
		})).sort((e, t) => t.count - e.count);
	}
	function i(e, t) {
		let n = Object.keys(e || {});
		if (!t || !t.length) return n;
		let r = new Set(n), i = [];
		for (let e of t) r.has(e) && (i.push(e), r.delete(e));
		for (let e of n) r.has(e) && i.push(e);
		return i;
	}
	function a(e, t) {
		return !e || e.length === 0 ? !1 : e.length > 1 ? !0 : e[0].spellings.some((e) => e.label !== t);
	}
	function o(e, t, n = []) {
		if (!e) return n;
		if (Array.isArray(e)) {
			for (let r of e) o(r, t, n);
			return n;
		}
		if (typeof e != "object") return n;
		let r = e._references || e.originalItem && e.originalItem._references || e.references;
		if (Array.isArray(r)) {
			for (let e of r) o(e, t, n);
			return n;
		}
		if (Array.isArray(e.items)) {
			for (let r of e.items) o(r, t, n);
			return n;
		}
		if (e.forms && typeof e.forms == "object") {
			if (e.type && e.type !== "tag" || e.value !== void 0 && e.value !== t && e.concept !== t) return n;
			n.push(e);
		}
		return n;
	}
	function s(e, t, n) {
		let s = o(e, t);
		if (!s.length) return null;
		let c = typeof s[0].value == "string" && s[0].value ? s[0].value : t, l = [...n || []], u = {};
		for (let e of s) {
			if (Array.isArray(e.systems)) for (let t of e.systems) typeof t == "string" && t && !l.includes(t) && l.push(t);
			for (let [t, n] of Object.entries(e.forms || {})) if (t) if (l.includes(t) || l.push(t), u[t] || (u[t] = {}), Array.isArray(n)) for (let e of n) typeof e == "string" && e && (u[t][e] = (u[t][e] || 0) + 1);
			else if (n && typeof n == "object") for (let [e, r] of Object.entries(n)) {
				let n = Number(r);
				e && Number.isFinite(n) && n > 0 && (u[t][e] = (u[t][e] || 0) + n);
			}
			else typeof n == "string" && n && (u[t][n] = (u[t][n] || 0) + 1);
		}
		let d = [];
		for (let e of i(u, l)) {
			let t = r(u[e]);
			t.length && d.push({
				system: e,
				spellings: t
			});
		}
		return a(d, c) ? {
			canonical: c,
			pinned: !1,
			discovered: !1,
			items: s.length,
			forms: d,
			rank: []
		} : null;
	}
	function c(e, t, n) {
		let o = t;
		if (!o || typeof o != "string") return null;
		let c = null, l = n;
		e && typeof e == "object" && !Array.isArray(e) ? e.concepts && typeof e.concepts == "object" ? c = e : e._rtagz && typeof e._rtagz == "object" ? (c = e._rtagz, l === void 0 && e.items && (l = e.items)) : l === void 0 && (l = e) : l === void 0 && e !== void 0 && (l = e);
		let u = c && c.systems && typeof c.systems == "object" ? Object.keys(c.systems) : [];
		if (c && c.concepts) {
			let e = Array.isArray(c.concepts) ? c.concepts : null, t;
			if (t = e ? e.find((e) => e && e.id === o) || e.find((e) => e && e.canonical === o) : c.concepts[o] || Object.values(c.concepts).find((e) => e && typeof e == "object" && e.id === o), !t || typeof t != "object") return null;
			let n = typeof t.canonical == "string" && t.canonical ? t.canonical : o, s = t.forms && typeof t.forms == "object" ? t.forms : {}, l = [];
			for (let e of i(s, u)) {
				let t = r(s[e]);
				t.length && l.push({
					system: e,
					spellings: t
				});
			}
			let d = (t.prefLabel && typeof t.prefLabel == "object" ? Object.values(t.prefLabel) : []).some((e) => typeof e == "string" && e && e !== n), f = Array.isArray(t.mappings) && t.mappings.length > 0;
			if (!a(l, n) && !d && !f) return null;
			let p = Array.isArray(t.rank) ? t.rank.map((e) => ({
				label: e.label,
				score: e.score,
				parts: e.parts ? { ...e.parts } : {}
			})) : [], m = {
				canonical: n,
				pinned: !!t.pinned,
				discovered: !!t.discovered,
				items: typeof t.items == "number" ? t.items : 0,
				forms: l,
				rank: p
			};
			if (typeof t.id == "string" && t.id && (m.id = t.id), Array.isArray(t.inScheme) && t.inScheme.length && (m.inScheme = [...t.inScheme]), t.prefLabel && typeof t.prefLabel == "object" && Object.keys(t.prefLabel).length && (m.prefLabel = { ...t.prefLabel }), t.altLabel && typeof t.altLabel == "object" && Object.keys(t.altLabel).length) {
				m.altLabel = {};
				for (let [e, n] of Object.entries(t.altLabel)) m.altLabel[e] = Array.isArray(n) ? [...n] : n;
			}
			return Array.isArray(t.broader) && t.broader.length && (m.broader = [...t.broader]), Array.isArray(t.mappings) && t.mappings.length && (m.mappings = t.mappings.map((e) => e && typeof e == "object" ? { ...e } : e)), m;
		}
		return l == null ? null : s(l, o, u);
	}
	function l(e) {
		let t = Array.isArray(e) ? e[0] : e, r = t && t.parts && typeof t.parts == "object" ? t.parts : null;
		if (!r) return null;
		let i = null, a = -Infinity;
		for (let [e, t] of n) {
			let n = Number(r[e]);
			Number.isFinite(n) && n > a && (a = n, i = t);
		}
		return i;
	}
	function u(e) {
		return !e || typeof e != "object" || Array.isArray(e) ? null : e._rtagz && typeof e._rtagz == "object" ? e._rtagz : e;
	}
	function d(e, t) {
		let n = (e && Array.isArray(e.schemes) ? e.schemes : []).find((e) => e && e.id === t);
		return n && typeof n.label == "string" && n.label ? n.label : t;
	}
	function f(e, t) {
		let n = (e && Array.isArray(e.concepts) ? e.concepts : []).find((e) => e && e.id === t);
		if (n && typeof n.canonical == "string" && n.canonical) return n.canonical;
		let r = e && e.external && typeof e.external == "object" ? e.external[t] : null;
		if (r) {
			let n = typeof r.scheme == "string" && r.scheme ? r.scheme : typeof t == "string" && t.includes(":") ? t.slice(0, t.indexOf(":")) : "", i = "";
			if (typeof r.prefLabel == "string" ? i = r.prefLabel : r.prefLabel && typeof r.prefLabel == "object" && (i = typeof r.prefLabel[n] == "string" ? r.prefLabel[n] : Object.values(r.prefLabel).find((e) => typeof e == "string" && e) || ""), i) return n ? `${i} (${d(e, n)})` : i;
		}
		return String(t);
	}
	function p(e, { rtagz: t, members: n } = {}) {
		let r = [];
		if (e && Array.isArray(e.forms)) for (let t of e.forms) r.push(`${t.system} writes ${(t.spellings || []).map((e) => e.label).join(", ")}`);
		let i = e && r.length ? l(e.rank) : null;
		i && r.push(`named by ${i}`);
		let a = u(t);
		if (e && e.prefLabel && typeof e.prefLabel == "object") {
			let t = [
				"site",
				...Array.isArray(e.inScheme) ? e.inScheme : [],
				...Object.keys(e.prefLabel)
			], n = /* @__PURE__ */ new Set();
			for (let i of t) {
				if (n.has(i)) continue;
				n.add(i);
				let t = e.prefLabel[i];
				typeof t == "string" && t && r.push(`in ${d(a, i)}: ${t}`);
			}
		}
		if (e && Array.isArray(e.mappings)) for (let t of e.mappings) {
			if (!t || typeof t.type != "string" || typeof t.target != "string") continue;
			let e = typeof t.weight == "number" && Number.isFinite(t.weight) ? ` · weight ${t.weight}` : "";
			r.push(`${t.type} ${f(a, t.target)}${e}`);
		}
		let o = Array.isArray(n) ? n.filter((e) => typeof e == "string" && e) : [];
		return o.length > 1 && r.push(`stands for ${o.join(", ")}`), r;
	}
	t.exports = {
		tagForms: c,
		winningPart: l,
		tagFormsLines: p
	};
})), Ls = /* @__PURE__ */ h(((e, t) => {
	var n = "site", r = "discovered", i = [
		"force",
		"radial",
		"timeline"
	], a = "tag:", o = "concept:";
	function s(e) {
		return !e || typeof e != "object" || Array.isArray(e) ? null : e._rtagz && typeof e._rtagz == "object" && !Array.isArray(e._rtagz) ? e._rtagz : Array.isArray(e.concepts) || Array.isArray(e.schemes) ? e : null;
	}
	function c(e) {
		let t = s(e);
		return !t || !Array.isArray(t.schemes) ? [] : t.schemes.filter((e) => e && typeof e == "object" && typeof e.id == "string" && e.id);
	}
	var l = /* @__PURE__ */ new WeakMap();
	function u(e) {
		if (l.has(e)) return l.get(e);
		let t = /* @__PURE__ */ new Map();
		for (let n of Array.isArray(e.concepts) ? e.concepts : []) !n || typeof n != "object" || typeof n.id == "string" && n.id && !t.has(n.id) && t.set(n.id, n);
		let n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
		for (let t of c(e)) n.set(t.id, t), typeof t.sourceId == "string" && t.sourceId && !r.has(t.sourceId) && r.set(t.sourceId, t.id);
		let i = e.systems && typeof e.systems == "object" && !Array.isArray(e.systems) ? e.systems : {};
		for (let [e, t] of Object.entries(i)) t && typeof t.sourceId == "string" && t.sourceId && !r.has(t.sourceId) && r.set(t.sourceId, e);
		let a = {
			byId: t,
			schemes: n,
			systems: i,
			sourceToScheme: r,
			external: e.external && typeof e.external == "object" && !Array.isArray(e.external) ? e.external : {}
		};
		return l.set(e, a), a;
	}
	function d(e, t) {
		let n = e.external[t];
		if (n && typeof n.scheme == "string" && n.scheme) return n.scheme;
		if (n && typeof n.inScheme == "string" && n.inScheme) return n.inScheme;
		if (n && Array.isArray(n.inScheme) && typeof n.inScheme[0] == "string") return n.inScheme[0];
		let r = typeof t == "string" ? t.indexOf(":") : -1;
		return r > 0 ? t.slice(0, r) : "";
	}
	function f(e, t) {
		if (t === n || t === r) return !1;
		let i = e.schemes.get(t);
		return i && typeof i.kind == "string" ? i.kind === "external" : i || Object.prototype.hasOwnProperty.call(e.systems, t) ? !1 : Object.keys(e.external).some((n) => d(e, n) === t);
	}
	function p(e, t, n) {
		let r = e.external[t];
		return r ? typeof r.prefLabel == "string" ? r.prefLabel : r.prefLabel && typeof r.prefLabel == "object" ? typeof r.prefLabel[n] == "string" ? r.prefLabel[n] : Object.values(r.prefLabel).find((e) => typeof e == "string" && e) || "" : "" : "";
	}
	function m(e, t) {
		let n = e.external[t];
		if (!n || !Array.isArray(n.broader)) return null;
		for (let t of n.broader) if (typeof t == "string" && t && e.external[t]) return t;
		return null;
	}
	function h(e, t, n) {
		let r = Array.isArray(t.mappings) ? t.mappings : [];
		for (let t of ["exactMatch", "broadMatch"]) for (let i of r) if (!(!i || i.type !== t || typeof i.target != "string" || !i.target) && d(e, i.target) === n) return i.target;
		return null;
	}
	function g(e, t) {
		return t === n ? !0 : Array.isArray(e.inScheme) ? e.inScheme.includes(t) : t === r ? e.discovered === !0 : !!(e.forms && typeof e.forms == "object" && e.forms[t]);
	}
	function _(e, t) {
		let r = e.prefLabel && typeof e.prefLabel == "object" ? e.prefLabel[t] : void 0;
		return typeof r == "string" && r ? r : t === n && typeof e.canonical == "string" && e.canonical ? e.canonical : "";
	}
	function v(e, t, n) {
		let r = Array.isArray(t.broader) ? t.broader : [];
		for (let t of r) {
			let r = typeof t == "string" ? e.byId.get(t) : null;
			if (r && g(r, n)) return r;
		}
		return null;
	}
	function y(e, t) {
		let n = /* @__PURE__ */ new Map();
		for (let r of Array.isArray(t) ? t : []) {
			if (typeof r != "string" || !r) continue;
			let t = e.sourceToScheme.get(r) || r;
			n.set(t, (n.get(t) || 0) + 1);
		}
		let r = null;
		for (let [e, t] of n) (!r || t > r.n || t === r.n && e < r.scheme) && (r = {
			scheme: e,
			n: t
		});
		return r ? r.scheme : null;
	}
	function b(e, t, i, a, o) {
		let s = [n], c = y(e, a);
		c && c !== i && s.push(c), s.push(r);
		for (let e of s) {
			if (e === i) continue;
			let n = _(t, e);
			if (n) return {
				label: n,
				scheme: e,
				fallback: !0,
				groupId: o
			};
		}
		let l = typeof t.canonical == "string" && t.canonical ? t.canonical : null;
		return {
			label: l,
			scheme: l ? n : null,
			fallback: !0,
			groupId: o
		};
	}
	function x(e) {
		let t = Number(e);
		return !Number.isFinite(t) || t <= 0 ? 0 : Math.floor(t);
	}
	function S(e, t, { scheme: r, depth: i, systems: a } = {}) {
		let o = typeof r == "string" && r ? r : n, c = x(i), l = s(e);
		if (!l || typeof t != "string" || !t) return {
			label: null,
			scheme: null,
			fallback: !1,
			groupId: t || null
		};
		let d = u(l), g = d.byId.get(t);
		if (!g) return {
			label: null,
			scheme: null,
			fallback: !1,
			groupId: t
		};
		if (f(d, o)) {
			let e = h(d, g, o);
			if (e) {
				let t = e;
				for (let e = 0; e < c; e++) {
					let e = m(d, t);
					if (!e) break;
					t = e;
				}
				let n = p(d, t, o);
				if (n) return {
					label: n,
					scheme: o,
					fallback: !1,
					groupId: t
				};
			}
			return b(d, g, o, a, t);
		}
		let y = g;
		for (let e = 0; e < c; e++) {
			let e = v(d, y, o);
			if (!e) break;
			y = e;
		}
		let S = _(y, o);
		return S ? {
			label: S,
			scheme: o,
			fallback: !1,
			groupId: y.id
		} : b(d, y, o, a, y.id);
	}
	function C(e, t, { scheme: n, depth: r } = {}) {
		let i = /* @__PURE__ */ new Map();
		for (let a of Array.isArray(t) ? t : []) {
			if (typeof a != "string" || !a || i.has(a)) continue;
			let t = S(e, a, {
				scheme: n,
				depth: r
			});
			i.set(a, t.groupId || a);
		}
		return i;
	}
	function w(e, t) {
		let n = [], r = /* @__PURE__ */ new Set(), s = [""];
		if (typeof t == "function") for (let e of i) {
			let n = t(e);
			typeof n == "string" && !s.includes(n) && s.push(n);
		}
		for (let t of Array.isArray(e) ? e : []) {
			if (!t || t.type !== "tag" || typeof t.concept != "string" || !t.concept) continue;
			let e = [];
			for (let n of [t.label, t.previousLabel]) typeof n == "string" && n && !e.includes(n) && e.push(n);
			for (let i of e) for (let e of s) {
				let s = e + a + i, c = e + o + t.concept, l = s + "\0" + c;
				r.has(l) || (r.add(l), n.push([s, c]));
			}
		}
		return n;
	}
	t.exports = {
		SITE_SCHEME: n,
		DISCOVERED_SCHEME: r,
		LAYOUTS: i,
		schemesOf: c,
		labelFor: S,
		groupsFor: C,
		migrationPairs: w
	};
})), Rs = /* @__PURE__ */ h(((e, t) => {
	function n(e) {
		if (typeof e != "string") return null;
		let t = e.trim().toLowerCase(), n = t.match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/);
		if (n) {
			let e = n[1];
			return e.length <= 4 && (e = e.split("").map((e) => e + e).join("")), [
				0,
				2,
				4
			].map((t) => parseInt(e.slice(t, t + 2), 16) / 255);
		}
		if (n = t.match(/^rgba?\(\s*([^,\s/]+)\s*[,\s]\s*([^,\s/]+)\s*[,\s]\s*([^,\s/)]+)/), n) {
			let e = (e) => e.endsWith("%") ? parseFloat(e) / 100 : parseFloat(e) / 255, t = [
				e(n[1]),
				e(n[2]),
				e(n[3])
			];
			return t.every(Number.isFinite) ? t.map(r) : null;
		}
		if (n = t.match(/^hsla?\(\s*([^,\s/]+)\s*[,\s]\s*([^,\s/]+)%?\s*[,\s]\s*([^,\s/)]+)%?/), n) {
			let e = parseFloat(n[1]), t = parseFloat(n[2]) / 100, a = parseFloat(n[3]) / 100;
			return [
				e,
				t,
				a
			].every(Number.isFinite) ? i((e % 360 + 360) % 360, r(t), r(a)) : null;
		}
		return null;
	}
	function r(e) {
		return Math.min(1, Math.max(0, e));
	}
	function i(e, t, n) {
		let r = (1 - Math.abs(2 * n - 1)) * t, i = e / 60, a = r * (1 - Math.abs(i % 2 - 1)), o = 0, s = 0, c = 0;
		i < 1 ? [o, s, c] = [
			r,
			a,
			0
		] : i < 2 ? [o, s, c] = [
			a,
			r,
			0
		] : i < 3 ? [o, s, c] = [
			0,
			r,
			a
		] : i < 4 ? [o, s, c] = [
			0,
			a,
			r
		] : i < 5 ? [o, s, c] = [
			a,
			0,
			r
		] : [o, s, c] = [
			r,
			0,
			a
		];
		let l = n - r / 2;
		return [
			o + l,
			s + l,
			c + l
		];
	}
	var a = (e) => e <= .04045 ? e / 12.92 : ((e + .055) / 1.055) ** 2.4, o = (e) => e <= .0031308 ? 12.92 * e : 1.055 * e ** (1 / 2.4) - .055;
	function s([e, t, n]) {
		let r = a(e), i = a(t), o = a(n), s = Math.cbrt(.4122214708 * r + .5363325363 * i + .0514459929 * o), c = Math.cbrt(.2119034982 * r + .6806995451 * i + .1073969566 * o), l = Math.cbrt(.0883024619 * r + .2817188376 * i + .6299787005 * o);
		return [
			.2104542553 * s + .793617785 * c - .0040720468 * l,
			1.9779984951 * s - 2.428592205 * c + .4505937099 * l,
			.0259040371 * s + .7827717662 * c - .808675766 * l
		];
	}
	function c([e, t, n]) {
		let i = (e + .3963377774 * t + .2158037573 * n) ** 3, a = (e - .1055613458 * t - .0638541728 * n) ** 3, s = (e - .0894841775 * t - 1.291485548 * n) ** 3;
		return [
			4.0767416621 * i - 3.3077115913 * a + .2309699292 * s,
			-1.2684380046 * i + 2.6097574011 * a - .3413193965 * s,
			-.0041960863 * i - .7034186147 * a + 1.707614701 * s
		].map((e) => r(o(r(e))));
	}
	function l(e) {
		return "#" + e.map((e) => Math.round(e * 255).toString(16).padStart(2, "0")).join("");
	}
	function u(e, t) {
		let r = n(t), i = 0, a = 0, o = 0, u = 0;
		for (let t of e || []) {
			let e = t && Number.isFinite(t.weight) ? t.weight : 1;
			if (e <= 0) continue;
			let c = n(t && t.color) || r;
			if (!c) continue;
			let [l, d, f] = s(c);
			i += l * e, a += d * e, o += f * e, u += e;
		}
		return u ? l(c([
			i / u,
			a / u,
			o / u
		])) : null;
	}
	t.exports = {
		blendColors: u,
		parseColor: n,
		rgbToOklab: s,
		oklabToRgb: c,
		toHex: l
	};
})), zs = /* @__PURE__ */ h(((e, t) => {
	var n = .32;
	function r(e, t = n) {
		let r = e.deltaMode === 1 ? .05 : e.deltaMode ? 1 : .002, i = -e.deltaY * r * (e.ctrlKey ? 10 : 1);
		return Number.isFinite(i) ? Math.max(-t, Math.min(t, i)) : 0;
	}
	t.exports = {
		wheelDelta: r,
		WHEEL_STEP_MAX: n
	};
})), Bs = /* @__PURE__ */ h(((e, t) => {
	var n = "minTagPieces";
	function r(e, t) {
		let n = Number.isFinite(Number(t)) ? Math.max(1, Math.floor(Number(t))) : 1;
		if (e == null || e === "") return 1;
		let r = Number(e);
		return Number.isFinite(r) ? Math.max(1, Math.min(n, Math.round(r))) : 1;
	}
	var i = (e) => e && typeof e == "object" ? e.id : e;
	function a(e, t) {
		let n = e instanceof Map ? e : new Map(e || []), r = /* @__PURE__ */ new Map(), a = t ? [...t] : [...n.keys()];
		for (let e of a) {
			let t = n.get(e) || [], a = /* @__PURE__ */ new Set();
			for (let e of t) {
				let t = i(e);
				t != null && a.add(t);
			}
			r.set(e, a.size);
		}
		return r;
	}
	function o(e, t) {
		let n = /* @__PURE__ */ new Set(), r = Number(t);
		if (!Number.isFinite(r) || r <= 1) return n;
		for (let [t, i] of e) i < r && n.add(t);
		return n;
	}
	function s(e, t) {
		let n = e instanceof Map ? [...e.values()] : [...e || []], i = n.reduce((e, t) => t > e ? t : e, 0), a = r(t, i);
		return {
			min: a,
			max: i,
			shown: a <= 1 ? n.length : n.filter((e) => e >= a).length,
			total: n.length
		};
	}
	function c(e) {
		return `Hide tagz on fewer than ${e} ${Number(e) === 1 ? "card" : "cards"}`;
	}
	function l(e) {
		let t = e && Array.isArray(e.items) ? e.items : [], n = e && Array.isArray(e.edges) ? e.edges : [], r = new Set(t.map((e) => e && e.id)), i = (e) => typeof e == "string" && e.startsWith("tag:"), o = /* @__PURE__ */ new Map();
		for (let e of n) {
			if (!e || e.layer !== "tag") continue;
			let t = i(e.target) ? e.target : i(e.source) ? e.source : null, n = t === e.target ? e.source : e.target;
			!t || !r.has(n) || (o.has(t) || o.set(t, []), o.get(t).push(n));
		}
		return a(o);
	}
	t.exports = {
		PREF: n,
		clampMinPieces: r,
		pieceCounts: a,
		tagsBelow: o,
		minPiecesSummary: s,
		minPiecesLabel: c,
		pieceCountsFromFeed: l
	};
})), Vs = /* @__PURE__ */ h(((e, t) => {
	function n(e, t = 48) {
		let n = String(e || "").split(/\s+/).filter(Boolean), r = [], i = "";
		for (let e of n) i ? i.length + 1 + e.length <= t ? i += " " + e : (r.push(i), i = e) : i = e;
		return i && r.push(i), r;
	}
	var r = (e) => `"${e}"`, i = "\0", a = (e) => typeof e == "object" && e ? JSON.stringify(e) : String(e);
	function o(e) {
		if (!e || typeof e != "object") return e == null ? "" : String(e);
		switch (e.type) {
			case "category": return `the tag ${r(e.label)}${e.scheme ? ` written in ${e.scheme}` : ""}`;
			case "text":
				if (typeof e.phrase == "string") {
					let t = typeof e.count == "number" ? `, ${e.count}×` : "";
					return `${r(e.phrase)} in the text${t}${e.inTitle ? ", in the title" : ""}`;
				}
				if (typeof e.cosine == "number") return `texts alike, cosine ${e.cosine}`;
				break;
			case "cooccurrence": return typeof e.items == "number" ? `${e.items} items carrying both` : "items carrying both";
			case "stem": return e.key ? `the shared words ${r(e.key)}` : "shared words";
			case "signal": return `the ${e.name} signal${typeof e.score == "number" ? ` ${e.score}` : ""}`;
			case "seed": return "a seed list";
			case "override": return e.note ? `an override (${e.note})` : "an override";
			default: break;
		}
		let t = Object.entries(e).filter(([e]) => e !== "type").map(([e, t]) => `${e} ${a(t)}`);
		return [e.type, ...t].filter(Boolean).join(" ");
	}
	function s(e, { width: t = 48 } = {}) {
		let r = [];
		if (!e || typeof e != "object") return r;
		let s = e.wasDerivedFrom, c = (Array.isArray(s) ? s : s && typeof s == "object" ? [s] : []).map(o).filter(Boolean);
		c.length && r.push(...n(`derived from: ${c.join("; ")}`, t));
		let l = e.wasGeneratedBy;
		if (l && typeof l == "object" && typeof l.activity == "string" && l.activity) {
			let e = l.parameters && typeof l.parameters == "object" ? Object.entries(l.parameters).filter(([, e]) => e != null).map(([e, t]) => `${e}${i}${a(t).replace(/\s+/g, i)}`) : [];
			r.push(...n(`generated by: ${l.activity}${e.length ? `, with ${e.join(", ")}` : ""}`, t).map((e) => e.split(i).join(" ")));
		}
		return r;
	}
	function c(e, { width: t = 48 } = {}) {
		let r = e && (e.label || e.attrs && e.attrs.label || e.role || e.layer) || "", i = e && e.attrs, a = [String(r)], o = i && typeof i.why == "string" ? i.why : "";
		return o && a.push(...n(o, t)), a.push(...s(i, { width: t })), a.join("\n");
	}
	t.exports = {
		wrapText: n,
		evidencePhrase: o,
		provenanceLines: s,
		tagEdgeLabel: c
	};
})), Hs = /* @__PURE__ */ h(((e, t) => {
	var { wrapText: n, provenanceLines: r } = Vs(), i = [
		"broader",
		"broadMatch",
		"related",
		"relatedMatch",
		"closeMatch",
		"exactMatch"
	], a = new Set(i), o = new Set(["broader", "broadMatch"]), s = 5, c = "foldedRelatives", l = ["bubble", "omit"], u = (e) => e === "omit" ? "omit" : "bubble", d = (e) => typeof e == "string" && e.startsWith("tag:");
	function f(e) {
		return !!(e && a.has(e.layer) && d(e.source) && d(e.target) && e.source !== e.target);
	}
	var p = (e) => {
		let t = e && e.attrs ? Number(e.attrs.weight) : NaN;
		return Number.isFinite(t) ? t : null;
	};
	function m(e, t, { visible: n, limit: r = s } = {}) {
		let i = /* @__PURE__ */ new Map();
		if (!t) return {
			relatives: [],
			total: 0,
			more: 0
		};
		for (let r of e || []) {
			if (!r || !a.has(r.layer)) continue;
			let e = typeof r.source == "object" && r.source ? r.source.id : r.source, s = typeof r.target == "object" && r.target ? r.target.id : r.target;
			if (e === s) continue;
			let c = e === t ? s : s === t ? e : null;
			if (c == null || typeof n == "function" && !n(c)) continue;
			i.has(c) || i.set(c, {
				id: c,
				weight: null,
				relations: [],
				broader: null
			});
			let l = i.get(c);
			l.relations.push(r);
			let u = p(r);
			u !== null && (l.weight === null || u > l.weight) && (l.weight = u), l.broader === null && (r.directed || o.has(r.layer)) && (l.broader = s);
		}
		let c = [...i.values()].sort((e, t) => e.weight === t.weight ? e.id < t.id ? -1 : +(e.id > t.id) : e.weight === null ? 1 : t.weight === null ? -1 : t.weight - e.weight);
		for (let e of c) e.relations.sort((e, t) => {
			let n = p(e), r = p(t);
			return n === r ? 0 : n === null ? 1 : r === null ? -1 : r - n;
		});
		let l = Number.isFinite(r) ? Math.max(0, Math.floor(r)) : c.length, u = c.slice(0, l);
		return {
			relatives: u,
			total: c.length,
			more: c.length - u.length
		};
	}
	var h = (e, t) => e.weight === t.weight ? 0 : e.weight === null ? 1 : t.weight === null ? -1 : t.weight - e.weight;
	function g(e, t, { visible: n, present: r, limit: i = s, bubbleOf: a, folded: o = "bubble" } = {}) {
		let c = (e) => typeof r != "function" || !!r(e);
		if (!t || !c(t)) return {
			from: null,
			relatives: [],
			total: 0,
			more: 0
		};
		let l = (e) => {
			let t = typeof a == "function" ? a(e) : null;
			return typeof t == "string" && t ? t : e;
		}, d = l(t), f = u(o) === "omit", g = (e, n) => e === null ? null : e === t ? d : n, _ = /* @__PURE__ */ new Map();
		for (let r of m(e, t, { limit: Infinity }).relatives) {
			if (!c(r.id)) continue;
			let e = l(r.id);
			e !== d && (e !== r.id && f || typeof n == "function" && !n(e) || (_.has(e) || _.set(e, []), _.get(e).push(r)));
		}
		let v = [];
		for (let [e, t] of _) {
			if (t.length === 1 && t[0].id === e) {
				let n = t[0], r = g(n.broader, e);
				v.push(r === n.broader ? n : {
					...n,
					broader: r
				});
				continue;
			}
			let n = new Set(t.map((t) => g(t.broader, e)).filter((e) => e !== null));
			v.push({
				id: e,
				weight: t[0].weight,
				relations: t.flatMap((e) => e.relations).map((e) => ({
					r: e,
					weight: p(e)
				})).sort(h).map((e) => e.r),
				broader: n.size === 1 ? [...n][0] : null,
				members: t
			});
		}
		v.sort((e, t) => h(e, t) || (e.id < t.id ? -1 : +(e.id > t.id)));
		let y = Number.isFinite(i) ? Math.max(0, Math.floor(i)) : v.length, b = v.slice(0, y);
		return {
			from: d,
			relatives: b,
			total: v.length,
			more: v.length - b.length
		};
	}
	function _(e, { width: t = 48 } = {}) {
		let i = [];
		for (let a of e || []) {
			if (!a) continue;
			let e = p(a);
			i.push(e === null ? String(a.layer) : `${a.layer} · weight ${e}`);
			let o = a.attrs && typeof a.attrs.why == "string" ? a.attrs.why : "";
			o && i.push(...n(o, t)), i.push(...r(a.attrs, { width: t }));
		}
		return i.join("\n");
	}
	var v = (e) => d(e) ? e.slice(4) : String(e);
	function y(e, { width: t = 48, nameOf: i = v } = {}) {
		if (!e) return "";
		if (!Array.isArray(e.members)) return _(e.relations, { width: t });
		let a = [];
		for (let o of e.members) {
			if (!o) continue;
			let e = i(o.id);
			for (let i of o.relations || []) {
				if (!i) continue;
				let o = p(i);
				a.push(...n(`${e} · ${o === null ? i.layer : `${i.layer} · weight ${o}`}`, t));
				let s = i.attrs && typeof i.attrs.why == "string" ? i.attrs.why : "";
				s && a.push(...n(s, t)), a.push(...r(i.attrs, { width: t }));
			}
		}
		return a.join("\n");
	}
	t.exports = {
		RELATION_LAYERS: i,
		STRONGEST: s,
		FOLDED_PREF: c,
		FOLDED_CHOICES: l,
		foldedChoice: u,
		isRelationEdge: f,
		relativesOf: m,
		drawnRelativesOf: g,
		relationLabel: _,
		relativeLabel: y,
		wrapText: n
	};
})), Us = /* @__PURE__ */ h(((e, t) => {
	var n = (e) => typeof e == "string" && e !== "";
	function r(e, t) {
		let r = e && Array.isArray(e._references) ? e._references : null;
		if (!r) return null;
		let i = r.find((e) => e && e.type === "tag" && e.value === t);
		return i && n(i.concept) ? i.concept : null;
	}
	function i(e, t) {
		return !e || !t ? !1 : n(e.concept) && (Array.isArray(t._references) ? t._references : []).some((t) => t && t.type === "tag" && t.concept === e.concept) ? !0 : n(e.tag) && Array.isArray(t.tags) && t.tags.includes(e.tag);
	}
	function a(e, t, n, i) {
		let a = n && n.get(t);
		if (a) return a;
		if (!i || i.size === 0) return;
		let o = r(e, t);
		return o ? i.get(o) : void 0;
	}
	t.exports = {
		containerHas: i,
		containerOfTag: a,
		conceptOfTag: r
	};
})), Ws = /* @__PURE__ */ h(((e, t) => {
	function n(e, t) {
		if (!e || typeof e != "object") return [];
		if (Array.isArray(e[t])) return e[t];
		let n = e.originalItem;
		return n && typeof n == "object" && Array.isArray(n[t]) ? n[t] : [];
	}
	function r(e) {
		return typeof e == "string" ? e === "" ? null : e : typeof e == "number" && Number.isFinite(e) ? String(e) : null;
	}
	function i(e) {
		let t = [];
		for (let i of n(e, "_references")) {
			if (!i || typeof i != "object" || i.type !== "tag") continue;
			let e = r(i.value);
			e !== null && t.push(e === i.value ? i : {
				...i,
				value: e
			});
		}
		if (t.length) return t;
		let i = [];
		for (let t of n(e, "tags")) {
			let e = r(t);
			e !== null && i.push({
				type: "tag",
				value: e
			});
		}
		return i;
	}
	t.exports = { tagReferences: i };
})), Gs = /* @__PURE__ */ h(((e, t) => {
	var n = "minSourceRatio", r = 1.6, i = 1, a = .1;
	function o(e) {
		return typeof e == "number" && Number.isFinite(e) ? e : null;
	}
	var s = (e) => Math.round(e * 10) / 10, c = (e) => Math.floor(e * 10 + 1e-9) / 10, l = (e) => {
		let t = e && e.wasGeneratedBy;
		return t && t.parameters && typeof t.parameters == "object" ? t.parameters : null;
	};
	function u(e) {
		let t = e && Array.isArray(e.edges) ? e.edges : [], n = Infinity, a = -Infinity, s = Infinity, u = null;
		for (let e of t) {
			if (!e || e.layer !== "tag" || !e.attrs) continue;
			let t = o(e.attrs.sourceRatio);
			if (t === null) continue;
			t < n && (n = t), t > a && (a = t);
			let r = l(e.attrs);
			if (r) {
				let e = o(r.sourceRatioFloor);
				e !== null && e < s && (s = e);
				let t = o(r.sourceCoherenceRatio);
				u === null && t !== null && t > 0 && (u = t);
			}
		}
		if (a === -Infinity) return {
			has: !1,
			lo: i,
			hi: r,
			bar: r
		};
		let d = u === null ? r : u, f = Math.min(Math.max(i, c(Number.isFinite(s) ? s : n)), d);
		return {
			has: !0,
			lo: f,
			hi: Math.max(c(a), f, d),
			bar: d
		};
	}
	function d(e, t) {
		if (!t || !t.has) return null;
		if (e == null || e === "") return t.bar;
		let n = Number(e);
		return Number.isFinite(n) ? Math.max(t.lo, Math.min(t.hi, s(n))) : t.bar;
	}
	function f(e, t) {
		if (t == null) return !0;
		let n = o(e);
		return n === null || n >= t - 1e-9;
	}
	var p = (e, t) => `${e}\u0000${t}`;
	function m(e, t) {
		let n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
		for (let s of e || []) s && (r.add(s.tag), a.add(s.bubble), f(s.ratio, t) && (n.add(p(s.piece, s.bubble)), i.add(s.tag), o.add(s.bubble)));
		return {
			pairs: n,
			hiddenTags: new Set([...r].filter((e) => !i.has(e))),
			hiddenBubbles: new Set([...a].filter((e) => !o.has(e)))
		};
	}
	function h(e) {
		let t = e ? Number(e.lo) : NaN, n = e ? Number(e.hi) : NaN;
		return !(t > 0) || !(n > t) ? 1 : Math.max(1e3, Math.ceil(20 * n * Math.log(n / t)));
	}
	function g(e, t) {
		let n = Number(t.lo), r = Number(t.hi), i = h(t), a = Number(e);
		return !(r > n) || !Number.isFinite(a) || a <= 0 ? n : a >= i ? r : Math.max(n, Math.min(r, s(n * (r / n) ** +(a / i))));
	}
	function _(e, t) {
		let n = Number(t.lo), r = Number(t.hi), i = h(t), a = Number(e);
		return !(r > n) || !Number.isFinite(a) || a <= n ? 0 : a >= r ? i : Math.round(i * Math.log(a / n) / Math.log(r / n));
	}
	t.exports = {
		PREF: n,
		DEFAULT_BAR: r,
		LOWEST: i,
		STEP: a,
		ratioOf: o,
		ratioRange: u,
		clampRatio: d,
		ratioShows: f,
		shownAt: m,
		pairKey: p,
		ratioText: (e) => e != null && e !== "" && Number.isFinite(Number(e)) ? Number(e).toFixed(1) : "",
		travelLength: h,
		ratioAt: g,
		positionOf: _
	};
})), Ks = /* @__PURE__ */ h(((e, t) => {
	function n(e) {
		return e.url.split("/").pop().replace(".html", "");
	}
	var { containerOfTag: r } = Us(), { tagReferences: i } = Ws();
	function a(e) {
		let t = Array.isArray(e && e._references) ? e._references : e && e.originalItem && Array.isArray(e.originalItem._references) ? e.originalItem._references : [], n = [];
		for (let e of t) {
			if (!e || typeof e != "object") continue;
			let t = typeof e.type == "string" ? e.type.trim() : "", r = typeof e.value == "string" ? e.value.trim() : "";
			if (!t || t === "tag" || !r) continue;
			let i = {
				type: t,
				value: r,
				weight: typeof e.weight == "number" && Number.isFinite(e.weight) ? e.weight : 1
			};
			typeof e.label == "string" && e.label.trim() && (i.label = e.label.trim()), typeof e.origin == "string" && e.origin.trim() && (i.origin = e.origin.trim()), typeof e.concept == "string" && e.concept.trim() && (i.concept = e.concept.trim()), e.why !== void 0 && e.why !== null && (i.why = e.why), e.wasDerivedFrom !== void 0 && e.wasDerivedFrom !== null && (i.wasDerivedFrom = e.wasDerivedFrom), e.wasGeneratedBy !== void 0 && e.wasGeneratedBy !== null && (i.wasGeneratedBy = e.wasGeneratedBy), typeof e.sourceRatio == "number" && Number.isFinite(e.sourceRatio) && (i.sourceRatio = e.sourceRatio), e.directed !== void 0 && (i.directed = !!e.directed), typeof e.role == "string" && e.role.trim() && (i.role = e.role.trim()), typeof e.layer == "string" && e.layer.trim() && (i.layer = e.layer.trim()), n.push(i);
		}
		return n;
	}
	function o(e, t = {}) {
		let o = [], c = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Set();
		for (let t of e) c.set(n(t), t.id), t && t.id && l.add(t.id);
		let u = (e) => c.get(e) || e, d = t.containment || [], f = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map();
		for (let e of d) e.tag && f.set(e.tag, e), typeof e.concept == "string" && e.concept && !p.has(e.concept) && p.set(e.concept, e);
		for (let e of d) e.parent && o.push({
			source: e.parent,
			target: e.id,
			directed: !0,
			role: "contains",
			layer: "containment",
			attrs: {
				parent: e.parent,
				child: e.id,
				label: e.label || e.id
			}
		});
		let m = /* @__PURE__ */ new Map();
		for (let t of e) {
			let e = t.id;
			for (let n of t.connected_to || []) o.push({
				source: e,
				target: u(n),
				directed: !0,
				role: "connected_to",
				layer: "authored",
				attrs: { resolved: c.has(n) }
			});
			let n = [];
			for (let a of i(t)) {
				let i = a.value, s = r(t, i, f, p);
				if (s) n.includes(s) || n.push(s);
				else {
					let t = {
						source: e,
						target: `tag:${i}`,
						directed: !1,
						role: "tagged",
						layer: "tag"
					};
					a.concept !== void 0 && a.weight !== void 0 && a.origin !== void 0 && (t.attrs = {
						concept: a.concept,
						weight: a.weight,
						origin: a.origin
					}, a.why !== void 0 && a.why !== null && (t.attrs.why = a.why), a.wasDerivedFrom !== void 0 && a.wasDerivedFrom !== null && (t.attrs.wasDerivedFrom = a.wasDerivedFrom), a.wasGeneratedBy !== void 0 && a.wasGeneratedBy !== null && (t.attrs.wasGeneratedBy = a.wasGeneratedBy), typeof a.sourceRatio == "number" && Number.isFinite(a.sourceRatio) && (t.attrs.sourceRatio = a.sourceRatio)), o.push(t);
				}
			}
			if (n.length > 0) {
				let t = new Set(n.map((e) => e.parent).filter(Boolean)), r = n.filter((e) => !t.has(e.id))[0] || n[0];
				o.push({
					source: r.id,
					target: e,
					directed: !0,
					role: "contains",
					layer: "containment",
					attrs: {
						container: r.id,
						label: r.label || r.id
					}
				});
			}
			for (let n of t.topology || []) o.push({
				source: e,
				target: `topology:${n}`,
				directed: !1,
				role: "exhibits",
				layer: "topology"
			});
			for (let n of a(t)) {
				let t = c.has(n.value) ? c.get(n.value) : l.has(n.value) || n.value.startsWith(`${n.type}:`) ? n.value : `${n.type}:${n.value}`, r = {
					type: n.type,
					value: n.value,
					weight: n.weight
				};
				n.label !== void 0 && (r.label = n.label), n.origin !== void 0 && (r.origin = n.origin), n.concept !== void 0 && (r.concept = n.concept), n.why !== void 0 && (r.why = n.why), n.wasDerivedFrom !== void 0 && (r.wasDerivedFrom = n.wasDerivedFrom), n.wasGeneratedBy !== void 0 && (r.wasGeneratedBy = n.wasGeneratedBy), n.sourceRatio !== void 0 && (r.sourceRatio = n.sourceRatio), o.push({
					source: e,
					target: t,
					directed: !!n.directed,
					role: n.role || n.type,
					layer: n.layer || "reference",
					attrs: r
				});
			}
			t.series && (m.has(t.series) || m.set(t.series, []), m.get(t.series).push(t));
		}
		for (let [e, t] of m) {
			t.sort((e, t) => (Number(e.series_part) || 0) - (Number(t.series_part) || 0));
			for (let n = 0; n < t.length - 1; n++) o.push({
				source: t[n].id,
				target: t[n + 1].id,
				directed: !0,
				role: "next",
				layer: "sequence",
				attrs: {
					series: e,
					from_part: t[n].series_part,
					to_part: t[n + 1].series_part
				}
			});
		}
		return s(o);
	}
	function s(e) {
		let t = (e, t) => e < t ? e + "\0" + t : t + "\0" + e, n = /* @__PURE__ */ new Map();
		for (let r of e) r.layer === "sequence" && n.set(t(r.source, r.target), r);
		return n.size === 0 ? e : e.filter((e) => {
			if (e.layer !== "authored") return !0;
			let r = n.get(t(e.source, e.target));
			if (!r) return !0;
			let i = e.source === r.source ? "forward" : "backward";
			return r.attrs.authored = [...new Set([...r.attrs.authored || [], i])], !1;
		});
	}
	function c(e) {
		if (!e) return "";
		if (e.label) return e.label;
		if (e.attrs && e.attrs.label) return e.attrs.label;
		let t = e.attrs && typeof e.attrs.type == "string" && e.attrs.type || e.role || e.layer || "reference", n = e.attrs && typeof e.attrs.weight == "number" && Number.isFinite(e.attrs.weight) ? e.attrs.weight : 1;
		return `${t}${n === 1 ? "" : ` (${n})`}${e.attrs && typeof e.attrs.why == "string" && e.attrs.why ? `\n${e.attrs.why}` : ""}`;
	}
	t.exports = {
		buildEdges: o,
		slugOf: n,
		nonTagReferences: a,
		referenceEdgeLabel: c
	};
})), qs = /* @__PURE__ */ h(((e, t) => {
	var n = "showTags";
	function r(e) {
		if (!e || typeof e != "object") return !1;
		let t = e.graph && typeof e.graph == "object" ? e.graph : e, n = t.tag && typeof t.tag == "object" ? t.tag : null;
		return !!(n && n.show === !0);
	}
	function i(e, t) {
		return e === !0 || e === !1 ? e : r(t);
	}
	function a(e, t) {
		let n = !!e;
		return n === r(t) ? null : n;
	}
	t.exports = {
		PREF: n,
		siteShowsTags: r,
		showTagsChosen: i,
		showTagsPrefFor: a
	};
})), Js = ds(), Ys = fs(), Xs = ps(), Zs = ms(), Qs = hs(), $s = gs(), ec = _s(), tc = vs(), nc = ys(), rc = bs(), ic = xs(), ac = Ss(), oc = Cs(), sc = ws(), cc = Ts(), lc = Es(), uc = Ds(), dc = Os(), fc = zo(), pc = ks(), mc = As(), hc = Ms(), gc = Ns(), _c = Ps(), vc = Fs(), yc = Is(), bc = Ls(), xc = Rs(), Sc = zs(), Cc = Bs(), wc = Hs(), Tc = Vs(), Ec = Us(), Dc = Ws(), Oc = Gs(), kc = Ks(), Ac = qs(), jc = () => typeof window < "u" ? window.SETTINGS : null;
function Mc(e, t = {}) {
	let n = [], r = [], i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map(), s = new Set(t.visibleLayers || ["sequence"]), c = t.tagColor || "#f39c12", l = t.topologyColor || "#9b59b6", u = t.placeholderColor || "#7f8c8d", d = /* @__PURE__ */ new Map(), f = e._rtagz && Array.isArray(e._rtagz.concepts) ? e._rtagz.concepts : [];
	for (let e of f) e && typeof e.id == "string" && e.ledger && typeof e.ledger.previousLabel == "string" && e.ledger.previousLabel && d.set(e.id, e.ledger.previousLabel);
	let p = /* @__PURE__ */ new Map();
	for (let t of e._sources || []) t && t.id && Number(t.cardScale) > 0 && p.set(t.id, Number(t.cardScale));
	for (let r of e.items) {
		let i = r.url.split("/").pop().replace(".html", "");
		o.set(r.id, i), a.add(i);
		let s = null, c = e.containers || t.containment || [];
		for (let e of c) if (e.parent && e.tag && (0, Ec.containerHas)(e, r)) {
			s = e.badgeColor || e.color || e.stroke;
			break;
		}
		let l = Number(r._source && r._source.cardScale) || r._source && p.get(r._source.id) || 1, u = Number.isFinite(l) && l > 0 ? l : 1;
		n.push({
			id: i,
			label: r.labels && r.labels.short || i,
			labelMedium: r.labels && r.labels.medium || i,
			labelFull: r.title || i,
			title: r.title,
			short_title: r.short_title || "",
			type: "article",
			url: r.url,
			description: r.summary || "",
			tldr: r.tldr || "",
			image: r.image || "",
			date: r.date_published ? r.date_published.split("T")[0] : "",
			reading_time: r.reading_time || "",
			tags: (0, Dc.tagReferences)(r).map((e) => e.value),
			_references: Array.isArray(r._references) ? r._references : [],
			series: r.series || "",
			series_part: r.series_part ?? null,
			timeline: r.timeline || null,
			commit_times: r.commit_times || [],
			license: r.license || "",
			canonical_url: r.canonical_url || r.url,
			syndication: r.syndication || {},
			size: 60,
			containerColor: s,
			color: s || null,
			kind: r.kind || "essay",
			substrate: r.substrate || "essay",
			seed: r.seed || "",
			topology: r.topology || [],
			energy: r.energy || "",
			connected_to: r.connected_to || [],
			forms: r.forms || {},
			note: r.note || "",
			todos: r.todos || [],
			link: (0, _c.isLinkItem)(r) ? (0, _c.linkOf)(r) : "",
			subtitle: r.subtitle || "",
			_source: r._source || null,
			_sourceCardScale: u,
			_cardScale: u,
			originalItem: r
		});
	}
	function m(e) {
		return e.startsWith("tag:") || e.startsWith("topology:") ? e : o.get(e) || e;
	}
	let h = [], g = [], _ = [...e.edges || []], v = new Set(_.filter((e) => e && e.layer === "reference" && e.attrs && e.attrs.type && e.attrs.value).map((e) => `${e.source}\u0000${e.attrs.type}\u0000${e.attrs.value}`));
	for (let t of e.items) for (let e of (0, kc.nonTagReferences)(t)) {
		let n = `${t.id}\u0000${e.type}\u0000${e.value}`;
		if (v.has(n)) continue;
		v.add(n);
		let r = a.has(e.value) ? e.value : o.has(e.value) ? o.get(e.value) : e.value.startsWith(`${e.type}:`) ? e.value : `${e.type}:${e.value}`;
		_.push({
			source: t.id,
			target: r,
			directed: !!e.directed,
			role: e.role || e.type,
			layer: e.layer || "reference",
			attrs: { ...e }
		});
	}
	for (let e of _) {
		if (e.layer === "containment" || e.role === "contains") {
			h.push({
				source: e.source,
				target: m(e.target),
				attrs: e.attrs || {}
			});
			continue;
		}
		if ((0, wc.isRelationEdge)(e)) {
			g.push({
				source: e.source,
				target: e.target,
				directed: !!e.directed,
				layer: e.layer,
				attrs: e.attrs || {}
			});
			continue;
		}
		let t = e.attrs && typeof e.attrs.type == "string" && e.attrs.type !== "tag" ? e.attrs.type : null, n = e.layer === "reference" || !!t;
		if (!(s.has(e.layer) || n && (s.has("reference") || t && s.has(t) || s.has("tag")))) continue;
		let o = m(e.source), f = m(e.target);
		if (e.layer === "tag" && !i.has(f)) {
			let t = e.attrs && typeof e.attrs.concept == "string" && e.attrs.concept ? e.attrs.concept : null, n = {
				id: f,
				label: f.slice(4),
				type: "tag",
				size: 30,
				color: c,
				concept: t,
				systems: []
			};
			t && d.has(t) && (n.previousLabel = d.get(t)), i.set(f, n);
		} else if (e.layer === "topology" && !i.has(f)) i.set(f, {
			id: f,
			label: f.slice(9),
			type: "topology",
			size: 30,
			color: l
		});
		else if (n && !a.has(f) && !i.has(f)) {
			let n = t ? `${t}:` : "reference:", r = e.attrs && e.attrs.label || e.attrs && e.attrs.value || (f.startsWith(n) ? f.slice(n.length) : f);
			i.set(f, {
				id: f,
				label: r,
				type: "reference",
				refType: t || e.role || "reference",
				size: 30,
				color: l
			});
		} else e.layer === "authored" && !a.has(f) && !i.has(f) && i.set(f, {
			id: f,
			label: f,
			type: "placeholder",
			size: 40,
			color: u
		});
		let p = e.attrs && typeof e.attrs.weight == "number" && Number.isFinite(e.attrs.weight) ? e.attrs.weight : 1, _ = e.layer === "tag" ? (0, Tc.tagEdgeLabel)(e) : n ? (0, kc.referenceEdgeLabel)(e) : e.label || e.attrs && e.attrs.label || e.role || e.layer, v = {
			source: o,
			target: f,
			directed: !!e.directed,
			role: e.role,
			layer: e.layer,
			label: _,
			_baseLabel: _,
			weight: p
		};
		if (t && (v.refType = t), e.attrs && (v.attrs = e.attrs), e.layer === "tag" && e.attrs) {
			let t = (0, Oc.ratioOf)(e.attrs.sourceRatio);
			t !== null && (v.sourceRatio = t);
		}
		r.push(v);
	}
	let y = new Map(n.map((e) => [e.id, e._source && e._source.id]));
	for (let e of r) {
		if (e.layer !== "tag") continue;
		let t = i.get(e.target);
		if (!t || t.type !== "tag") continue;
		let n = y.get(e.source);
		n && t.systems.push(n);
	}
	n.push(...i.values());
	let b = new Set(n.map((e) => e.id));
	for (let e = r.length - 1; e >= 0; e--) (!b.has(r[e].source) || !b.has(r[e].target)) && r.splice(e, 1);
	let x = new Set(n.filter((e) => e.type === "tag").map((e) => e.id));
	for (let e = g.length - 1; e >= 0; e--) (!x.has(g[e].source) || !x.has(g[e].target)) && g.splice(e, 1);
	let S = e.containers || t.containment || [];
	if (S.length === 0 && h.length > 0) {
		let e = /* @__PURE__ */ new Map();
		for (let t of h) if (!a.has(t.source) && !e.has(t.source)) {
			let n = t.attrs?.label || t.source.replace(/^container:/, "").replace(/^tag:/, "").replace(/-/g, " ");
			e.set(t.source, {
				id: t.source,
				label: n.toUpperCase(),
				parent: t.attrs?.parent || null
			});
		}
		S = Array.from(e.values());
	}
	let C = (0, $s.degreesOf)(_.map((e) => e && {
		...e,
		source: m(e.source),
		target: m(e.target)
	}));
	for (let [e, t] of o) C.has(t) && !C.has(e) && C.set(e, C.get(t));
	return {
		nodes: n,
		links: r,
		containmentEdges: h,
		containers: S,
		relations: g,
		degrees: C
	};
}
function Nc(e) {
	let t = 0, n = 0, r = 0;
	for (let i of e || []) !i || !Number.isFinite(i.x) || !Number.isFinite(i.y) || (t += 1, n += i.x, r += i.y);
	return t ? {
		x: n / t,
		y: r / t
	} : null;
}
function Pc(e, t) {
	let n = e && e._source;
	return n && (t && t(n.id) || n.color) || null;
}
function Fc(e) {
	let t = /* @__PURE__ */ new Map();
	return e.selectAll(".node").each((e) => {
		e && t.set(e.id, e);
	}), t;
}
function Ic(e, t) {
	let n = [];
	for (let r of e || []) {
		if (!r || r.layer !== "tag") continue;
		let e = typeof r.source == "object" ? r.source : t.get(r.source), i = typeof r.target == "object" ? r.target : t.get(r.target), a = i && i.type === "tag" ? i : e && e.type === "tag" ? e : null, o = a === i ? e : i;
		if (!a || !o || o.type !== "article") continue;
		let s = r._origTarget !== void 0 && r._origTarget !== null ? typeof r._origTarget == "object" ? r._origTarget.id : r._origTarget : a.id;
		n.push({
			piece: o.id,
			bubble: a.id,
			tag: s,
			ratio: r.sourceRatio === void 0 ? null : r.sourceRatio,
			link: r,
			pieceNode: o,
			bubbleNode: a
		});
	}
	return n;
}
function Lc(e, t = null) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) r.link._dupByGroup || t && !t.pairs.has((0, Oc.pairKey)(r.piece, r.bubble)) || (n.has(r.bubble) || n.set(r.bubble, []), n.get(r.bubble).push(r.pieceNode));
	return n;
}
function Rc(e, t, n, r) {
	let i = e.selectAll(".node").filter((e) => !!(e && e.type === "tag" && !e._groupedInto));
	if (i.empty()) return;
	let a = null;
	typeof getComputedStyle == "function" && (a = getComputedStyle(e.node()).getPropertyValue("--gv-tag-color").trim() || null), i.select("rect").attr("fill", (e) => (0, xc.blendColors)((t.get(e.id) || []).filter((e) => !n(e)).map((e) => ({
		color: Pc(e, r),
		weight: 1
	})), a || e.color) || "var(--gv-tag-color)");
}
function zc(e, t = {}) {
	if (typeof window > "u") return;
	let n = [...e.values()].sort((e, t) => e - t), r = `${n.join(",")}|${Object.keys(t).sort().map((e) => `${e}=${t[e]}`).join("\0")}`, i = window.PostPipeGraphTags;
	i && i.sig === r || (window.PostPipeGraphTags = {
		sig: r,
		counts: n,
		byTag: t
	}, window.dispatchEvent(new CustomEvent("graph:tag-counts", { detail: {
		counts: n,
		byTag: t
	} })));
}
function Bc(e, t, n, r, i, a = null) {
	let o = (e) => !!(e && e.type === "article" && e._source && n.has(e._source.id)), s = Fc(e), c = Ic(e.selectAll(".link").data(), s), l = a == null ? null : (0, Oc.shownAt)(c, a), u = Lc(c, l), d = new Set(l ? l.hiddenBubbles : []);
	for (let [e, t] of u) t.length && t.every(o) && d.add(e);
	let f = [];
	for (let e of s.values()) e.type === "tag" && !e._groupedInto && !(l && l.hiddenBubbles.has(e.id)) && f.push(e.id);
	let p = (0, Cc.pieceCounts)(u, f), m = 0;
	for (let e of p.values()) e > m && (m = e);
	for (let e of (0, Cc.tagsBelow)(p, (0, Cc.clampMinPieces)(i, m))) d.add(e);
	let h = {};
	for (let e of s.values()) {
		if (e.type !== "tag") continue;
		let t = e._groupedInto || e.id;
		h[e.id] = l && l.hiddenTags.has(e.id) ? 0 : p.get(t) || 0;
	}
	zc(p, h);
	let g = /* @__PURE__ */ new Set();
	if (l) for (let e of c) l.pairs.has((0, Oc.pairKey)(e.piece, e.bubble)) || g.add(e.link);
	let _ = (e) => !!(e && (e._closedHidden || e._groupedInto || o(e) || e.type === "tag" && d.has(e.id)));
	e.selectAll(".node").style("display", (e) => _(e) ? "none" : null), t.selectAll(".node-card").style("display", (e) => _(e) ? "none" : null), e.selectAll(".link, .link-hit").style("display", (e) => {
		let t = typeof e.source == "object" ? e.source : s.get(e.source), n = typeof e.target == "object" ? e.target : s.get(e.target);
		return e._dupByGroup || g.has(e) || _(t) || _(n) ? "none" : null;
	}), Rc(e, u, o, r);
}
function Vc(e, t, n, r = null) {
	if (!n) {
		t.selectAll(".node-card").classed("dimmed", !1), e.selectAll(".node").classed("dimmed", !1), e.selectAll(".link").classed("dimmed", !1);
		return;
	}
	t.selectAll(".node-card").classed("dimmed", (e) => !n.has(e.id));
	let i = Ic(e.selectAll(".link").data(), Fc(e)), a = Lc(i, r == null ? null : (0, Oc.shownAt)(i, r));
	e.selectAll(".node").classed("dimmed", (e) => {
		if (e.type === "article") return !n.has(e.id);
		if (e.type === "tag") {
			if (e._groupedInto) return !1;
			let t = a.get(e.id);
			return !!(t && t.length) && !t.some((e) => n.has(e.id));
		}
		return !1;
	}), e.selectAll(".link").classed("dimmed", (e) => {
		let t = typeof e.source == "object" ? e.source.id : e.source, r = typeof e.target == "object" ? e.target.id : e.target;
		return !n.has(t) && !n.has(r);
	});
}
function Hc(e) {
	let t = {};
	for (let n of e && e.containers || []) {
		let e = (0, mc.fraction)(n.anchor);
		e && (t[n.id] = e);
	}
	return t;
}
function Uc(e) {
	let t = {};
	for (let n of e && e.containers || []) {
		let e = {};
		n.layout && (e.layout = n.layout), n.hang && typeof n.hang == "object" && (e.hang = n.hang), n.spiral && typeof n.spiral == "object" && (e.spiral = n.spiral), (n.hull === !1 || n.hull && typeof n.hull == "object") && (e.hull = n.hull), Object.keys(e).length && (t[n.id] = e);
	}
	return t;
}
function Wc(e) {
	return e && (e.labelPosition === "top" || e.labelPosition === "hidden") ? e.labelPosition : "center";
}
function Gc({ feedData: e, onNodeSelect: n, hiddenSources: i, filteredArticleIds: a, viewState: o, layout: l, view: f, timeAxis: m, graphSettings: h, colorOverrides: y, apiRef: b, onNodeFocus: x, contributions: S }) {
	let C = f && f.props && typeof f.props.layout == "string" && f.props.layout || l || "force", w = h || {}, T = {
		width: 180,
		height: 140,
		hoverWidth: 200,
		hoverHeight: 160,
		pinnedWidth: 230,
		pinnedHeight: 190,
		minWidth: 110,
		minHeight: 80,
		maxWidth: 620,
		maxHeight: 520,
		glowPadding: 16,
		...w.card || {}
	}, E = {
		fontSize: 22,
		padding: 11,
		maxWidth: 150,
		maxLines: 3,
		cornerRadius: 9,
		opacity: .7,
		...w.tag || {}
	}, D = {
		dock: "left",
		inset: 54,
		endPadding: 70,
		connectorOpacity: .45,
		connectorWidth: 1.6,
		spineOpacity: .55,
		spineWidth: 3,
		tickFontSize: 13,
		...w.timeAxis || {}
	}, O = {
		linkDistance: 160,
		chargeStrength: -500,
		collidePadding: 10,
		velocityDecay: .7,
		alphaDecay: .028,
		...w.simulation || {}
	}, k = (e) => {
		let t = e && e.hull && typeof e.hull == "object" ? Number(e.hull.padding) : NaN;
		if (Number.isFinite(t)) return t;
		let n = w.hull && typeof w.hull == "object" ? Number(w.hull.padding) : NaN;
		return Number.isFinite(n) ? n : (0, Ys.containerLayoutOf)(e, w) === "hang" ? T.width / 2 : e && e.padding != null ? e.padding : e && e.parent ? 42 : 75;
	}, A = s(null), j = s(null), M = s(null), N = s(n);
	r(() => {
		N.current = n;
	}, [n]);
	let P = s(x);
	r(() => {
		P.current = x;
	}, [x]);
	let F = s(null), I = (e) => {
		F.current = e ? e.id : null, P.current && P.current(e ? e.originalItem || e : null);
	}, L = s(o);
	r(() => {
		L.current = o;
	}, [o]);
	let ee = (e) => {
		let t = L.current;
		return t && typeof t.sourceColor == "function" && t.sourceColor(e) || null;
	}, te = () => {
		let e = L.current;
		return e && e.preference ? e.preference(Cc.PREF) : null;
	}, ne = s(null);
	(!ne.current || ne.current.feed !== e) && (ne.current = {
		feed: e,
		range: (0, Oc.ratioRange)(e)
	});
	let re = () => {
		let e = L.current;
		return (0, Oc.clampRatio)(e && e.preference ? e.preference(Oc.PREF) : null, ne.current.range);
	}, ie = (0, uc.makeCardSizeFor)(T);
	T.glowPadding;
	let ae = s(null), R = s(C), oe = s(!1), se = s(null), z = s(null), ce = s(null), le = s(null), ue = s(null), de = s(null), fe = s(null), pe = s(null), me = s(null), he = () => {
		let e = L.current, t = e && e.preference ? e.preference($s.MODE_PREF) : null, n = e && e.preference ? e.preference($s.PENALTY_PREF) : null;
		return (0, $s.normaliseEdgeWeights)({
			...w.edgeWeights || {},
			...t ? { mode: t } : {},
			...n ? { degreePenalty: n } : {}
		});
	}, B = () => {
		let e = L.current;
		return (0, Ac.showTagsChosen)(e && e.preference ? e.preference(Ac.PREF) : null, { graph: w });
	}, ge = () => {
		j.current && j.current.classed("tags-hidden", !B());
	}, _e = s(S || []), ve = s(null), ye = s(null), be = (e) => e._groupKey || (e.type === "tag" && e.concept ? "concept:" + e.concept : e.originalItem && e.originalItem.id || e.id), xe = s({
		settings: null,
		feed: null,
		ewSig: null,
		keys: /* @__PURE__ */ new Map()
	}), Se = (t) => {
		let n = xe.current, r = he(), i = `${r.mode}:${r.degreePenalty}`;
		return (n.settings !== h || n.feed !== e || n.ewSig !== i) && (n.settings = h, n.feed = e, n.ewSig = i, n.keys = /* @__PURE__ */ new Map()), n.keys.has(t) || n.keys.set(t, (0, pc.layoutKey)(t, h, {
			anchors: Hc(e),
			layouts: Uc(e),
			edgeWeights: {
				mode: r.mode,
				degreePenalty: r.degreePenalty
			}
		}) + "::"), n.keys.get(t);
	}, Ce = (e) => Se(R.current) + be(e), V = s(/* @__PURE__ */ new Set()), we = s(null), Te = s(1), Ee = s("full"), De = s(/* @__PURE__ */ new Set()), Oe = s(null), ke = s(null);
	r(() => {
		i instanceof Set ? De.current = i : Array.isArray(i) ? De.current = new Set(i) : De.current = new Set((e && e._sources || []).filter((e) => e && e.defaultHidden).map((e) => e.id)), !(!j.current || !M.current) && (Bc(j.current, U(M.current), De.current, ee, te(), re()), ye.current && ye.current());
	}, [i, e]), r(() => {
		if (!(!A.current || !y)) for (let [e, t] of Object.entries(y)) t && A.current.style.setProperty(e, t);
	}, [y]);
	let [Ae, je] = c(0);
	r(() => {
		if (!o) return;
		let e = o.historyVersion || 0;
		return o.subscribe(() => {
			let t = o.historyVersion || 0;
			t !== e && (e = t, je(t));
		});
	}, [o]), r(() => {
		if (o) return o.subscribe(() => {
			if (ce.current && ce.current(), le.current && le.current(), ve.current && ve.current(), de.current && de.current(), ue.current && ue.current(), pe.current && pe.current(), me.current && me.current(), ge(), j.current && M.current) {
				Bc(j.current, U(M.current), De.current, ee, te(), re());
				let e = re();
				Oe.current && e !== ke.current && (ke.current = e, Vc(j.current, U(M.current), Oe.current, e));
			}
			ye.current && ye.current();
		});
	}, [o]), r(() => {
		_e.current = S || [], ce.current && ce.current(), ve.current && ve.current({ rebuild: !0 });
	}, [S]), r(() => {
		Oe.current = a || null, !(!j.current || !M.current) && (ke.current = re(), Vc(j.current, U(M.current), a, ke.current));
	}, [a]), r(() => {
		if (!e || !A.current) return;
		let n = A.current, r = n.clientWidth, i = n.clientHeight, a = getComputedStyle(n), o = Mc(e, {
			tagColor: a.getPropertyValue("--gv-tag-color").trim() || "#f39c12",
			topologyColor: a.getPropertyValue("--gv-topology-color").trim() || "#9b59b6",
			placeholderColor: a.getPropertyValue("--gv-placeholder-color").trim() || "#7f8c8d",
			visibleLayers: Array.isArray(w.visibleLayers) ? w.visibleLayers : ["sequence"]
		}), s = (0, cc.bindingsOf)(w), c = (e, t, n) => (0, cc.resolve)(s, e, t, n), l = (0, cc.isBound)(s, "node.resize"), f = (0, Yo.listenInCard)(typeof window < "u" ? window.SETTINGS : null);
		U(n).selectAll("svg").remove(), U(n).selectAll(".cards-layer").remove();
		let p = U(n).append("svg").attr("width", r).attr("height", i).style("position", "absolute").style("inset", "0").style("pointer-events", "all");
		j.current = p, ge();
		let m = p.append("defs");
		m.append("marker").attr("id", "sequence-arrow").attr("viewBox", "0 0 10 10").attr("refX", 8).attr("refY", 5).attr("markerWidth", 7).attr("markerHeight", 7).attr("orient", "auto").append("path").attr("d", "M 0 1.5 L 8 5 L 0 8.5 z").attr("fill", "var(--gv-accent, #d4af37)"), m.append("marker").attr("id", "relation-arrow").attr("class", "relation-arrow").attr("viewBox", "0 0 10 10").attr("refX", 9).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11).attr("markerHeight", 11).attr("orient", "auto").append("path").attr("d", "M 0 1 L 10 5 L 0 9 z");
		let y = U(n).append("div").attr("class", "cards-layer").style("position", "absolute").style("left", "0").style("top", "0").style("width", "100%").style("height", "100%").style("pointer-events", "none");
		M.current = y.node();
		let x = y.append("div").attr("class", "cards-transform").style("transform-origin", "0 0").style("position", "absolute").style("left", "0").style("top", "0").style("width", "0").style("height", "0").style("overflow", "visible"), S = p.append("g"), C = !1, D = !!w.initialFocus && w.initialFocus !== "all", P = w.initialFocusMinScale == null ? .4 : w.initialFocusMinScale, ne = (0, ac.minCardScale)(w.initialScale, T.width), oe = (0, ac.homeScale)(P, w.initialScale, T.width), B = L.current && typeof L.current.rotation == "function" ? L.current.rotation() : 0, xe = null, Oe = 0, ke = !1, Ae = !1, je = null, Me = {
			x: 0,
			y: 0,
			k: 1
		}, Ne = () => B ? ` rotate(${-B})` : "", Pe = (e) => (0, nc.rotatedView)(e, xe, B);
		function Fe(e) {
			Me = Pe(e), S.attr("transform", `translate(${Me.x},${Me.y}) rotate(${B}) scale(${Me.k})`), x && x.style("transform", `translate3d(${Me.x}px, ${Me.y}px, 0px) rotate(${B}deg) scale(${Me.k})`), n && n.style.setProperty("--gv-unrot", `${-B}deg`), Oe !== B && (Oe = B, ke && ba());
		}
		let Ie = (e, t) => (0, nc.viewToScreen)(Me, B, e, t), Le = Lo().wheelDelta(Sc.wheelDelta).on("zoom", (e) => {
			e.sourceEvent && (C = !0, D = !1), Fe(e.transform);
			let t = e.transform.k;
			Te.current = t, ke && ze && Vn() && ba(), ke && Ca(), hi && vi(), ye.current && ye.current({ paintOnly: !0 }), z.current && z.current(), ke && _r();
			let n = (0, uc.getLOD)(t);
			n !== Ee.current && (Ee.current = n, Gi(), ya());
		}), Re = (0, rc.zoomPivotMode)(w) === "art", ze = (0, ic.zoomModeOf)(w) === "grow-in-place", Be = () => {
			if (!Re || typeof window > "u") return null;
			let e = window.PostPipeCoverFrame;
			if (!e || !e.art || !e.zoomPivot) return null;
			let t = (0, mc.artPoint)(e.zoomPivot, e.art), n = A.current ? A.current.getBoundingClientRect() : {
				left: 0,
				top: 0
			}, r = window.PostPipeCover && window.PostPipeCover.shift || 0;
			return [t.x - n.left, t.y - (n.top - r)];
		};
		if (Re || ze) {
			let e = Le.constrain();
			Le.constrain((t, n, r) => {
				let i = Oo(p.node());
				if (Vn()) {
					let e = Un(), n = (0, ic.growConstrain)(i, t, e[0], e[1], Zn());
					t = Do.translate(n.x, n.y).scale(n.k);
				} else {
					let e = Be();
					if (e) {
						let n = (0, rc.repivot)(i, t, e[0], e[1]);
						t = Do.translate(n.x, n.y).scale(n.k);
					}
				}
				return e(t, n, r);
			}), Le.interpolate(Xn);
		}
		if (c("space", "drag") !== "view.pan") {
			let e = Le.constrain();
			Le.constrain((t, n, r) => {
				let i = Oo(p.node());
				return Math.abs(t.k - i.k) <= 1e-9 * i.k ? i : e(t, n, r);
			});
		}
		p.call(Le).on("dblclick.zoom", null);
		let Ve = (e) => {
			let t = e.touches[0], n = e.touches[1];
			return Math.atan2(n.clientY - t.clientY, n.clientX - t.clientX) * 180 / Math.PI;
		}, He = (e) => {
			let t = n.getBoundingClientRect(), r = e.touches[0], i = e.touches[1];
			return [(r.clientX + i.clientX) / 2 - t.left, (r.clientY + i.clientY) / 2 - t.top];
		}, Ue = (e) => {
			if (e.touches.length !== 2) return;
			let [t, n] = He(e);
			xe = {
				theta0: B,
				a0: Ve(e),
				mx: t,
				my: n,
				started: !1
			};
		}, We = (e) => {
			if (!xe || e.touches.length !== 2) return;
			let [t, n] = He(e);
			xe.mx = t, xe.my = n;
			let r = (0, nc.angleDelta)(Ve(e), xe.a0);
			if (!xe.started) {
				if (Math.abs(r) < 10) return;
				xe.started = !0, xe.a0 = Ve(e), C = !0, D = !1;
				return;
			}
			B = (0, nc.normalizeAngle)(xe.theta0 + r), L.current && typeof L.current.setRotation == "function" && L.current.setRotation(B, { transient: !0 });
		}, Ge = (e) => {
			if (!xe || e.touches.length >= 2) return;
			let t = xe.started, n = Pe(Oo(p.node()));
			xe = null, t && L.current && typeof L.current.setRotation == "function" && (L.current.setRotation(B, { transient: !0 }), L.current.commit()), p.call(Le.transform, Do.translate(n.x, n.y).scale(n.k));
		};
		n.addEventListener("touchstart", Ue, {
			capture: !0,
			passive: !0
		}), n.addEventListener("touchmove", We, {
			capture: !0,
			passive: !0
		}), n.addEventListener("touchend", Ge, {
			capture: !0,
			passive: !0
		}), n.addEventListener("touchcancel", Ge, {
			capture: !0,
			passive: !0
		});
		function Ke({ repaint: e = !0, record: t = !1 } = {}) {
			if (!B && !xe) return;
			xe = null;
			let n = Oo(p.node()), a = r / 2, o = i / 2, s = (0, nc.screenToView)(Me, B, a, o);
			B = 0, t && L.current && typeof L.current.setRotation == "function" && L.current.setRotation(0), e && p.call(Le.transform, Do.translate(a - s[0] * n.k, o - s[1] * n.k).scale(n.k));
		}
		function qe(e, t = {}) {
			switch (e) {
				case "container.toggle":
					t.c && hn(t.c, t.closedNode);
					return;
				case "view.zoomInStep":
					zo(Fo);
					return;
				case "view.zoomAtPoint":
					Qe(t.x, t.y, t.shift ? .5 : 2);
					return;
				case "node.zoomToReadable":
					t.d && ia(t.d, t.x, t.y);
					return;
				case "node.openReader":
					t.d && aa(t.d);
					return;
				case "node.select":
					t.d && t.cardEl && oa(t.d, t.cardEl);
					return;
				case "node.listen":
					t.d && t.cardEl && sa(t.d, t.cardEl);
					return;
				case "node.stopListening":
					t.d && t.cardEl && ca(t.cardEl);
					return;
				case "view.deselect":
					va();
					return;
				default:
			}
		}
		let Je = Number.isFinite(w.doubleTapMs) ? w.doubleTapMs : 250, Ye = (0, sc.createTapGate)({
			ms: Je,
			px: 32
		});
		function Xe(e) {
			let t = e && e.changedTouches && e.changedTouches.length ? e.changedTouches[0] : e, a = n.getBoundingClientRect();
			return !t || !Number.isFinite(t.clientX) ? [r / 2, i / 2] : [t.clientX - a.left, t.clientY - a.top];
		}
		function Ze(e) {
			let [t, n] = Xe(e);
			return {
				x: t,
				y: n,
				shift: !!(e && e.shiftKey)
			};
		}
		function Qe(e, t, n) {
			C = !0, D = !1, p.transition("tap-zoom").duration(320).ease(qi).call(Le.scaleBy, n, [e, t]);
		}
		function $e(e, t, n) {
			let r = Ze(e), i = n || (() => qe(c("space", "doubletap"), r));
			Ye.tap(r.x, r.y, t, () => {
				tt(r), i();
			});
		}
		let et = null;
		function tt(e) {
			et = {
				t: Date.now(),
				x: e.x,
				y: e.y
			};
		}
		let nt = (e) => {
			if (!et) return;
			if (Date.now() - et.t > 450) {
				et = null;
				return;
			}
			let [t, n] = Xe(e);
			Math.hypot(t - et.x, n - et.y) > 32 || (e.type === "dblclick" && (et = null), e.stopPropagation(), e.preventDefault());
		};
		n.addEventListener("click", nt, !0), n.addEventListener("dblclick", nt, !0);
		let rt = null, it = null, at = (e) => {
			if (e.touches.length === 2) {
				let [t, n] = He(e);
				rt = {
					t: Date.now(),
					x: t,
					y: n,
					moved: !1
				};
			} else e.touches.length > 2 && (rt = null);
		}, ot = (e) => {
			if (!rt || e.touches.length !== 2) return;
			let [t, n] = He(e);
			Math.hypot(t - rt.x, n - rt.y) > 14 && (rt.moved = !0);
		}, st = (e) => {
			if (!rt || e.touches.length > 0) return;
			let t = rt;
			rt = null;
			let n = Date.now();
			t.moved || n - t.t > 350 || (it && n - it.t <= 450 && Math.hypot(t.x - it.x, t.y - it.y) <= 60 ? (it = null, Qe(t.x, t.y, .5)) : it = {
				t: n,
				x: t.x,
				y: t.y
			});
		};
		n.addEventListener("touchstart", at, {
			capture: !0,
			passive: !0
		}), n.addEventListener("touchmove", ot, {
			capture: !0,
			passive: !0
		}), n.addEventListener("touchend", st, {
			capture: !0,
			passive: !0
		});
		let ct = 0, lt = () => Date.now() - ct < 800, ut = (() => {
			if (!(0, cc.usesGesture)(s, "longpress")) return () => {};
			let e = Number.isFinite(w.longPressMs) ? w.longPressMs : 500, t = null, r = () => {
				t && clearTimeout(t.timer), t = null;
			}, i = (e) => {
				let t = e && e.closest && e.closest(".node-card");
				if (t) {
					let e = t.__data__;
					return e && !e.link ? {
						target: "node",
						ctx: {
							d: e,
							cardEl: t
						}
					} : null;
				}
				let n = e && e.closest && e.closest(".container-macro-node"), r = !n && e && e.closest && e.closest(".container-badge");
				return n || r ? {
					target: "container",
					ctx: {
						c: (n || r).__data__,
						closedNode: !!n
					}
				} : e && e.closest && e.closest("svg") === p.node() ? {
					target: "space",
					ctx: {}
				} : null;
			}, a = (n) => {
				if (r(), n.isPrimary === !1 || n.button !== void 0 && n.button !== 0) return;
				let a = i(n.target);
				if (!a) return;
				let o = Ze(n);
				t = {
					id: n.pointerId,
					cx: n.clientX,
					cy: n.clientY,
					timer: setTimeout(() => {
						t = null, ct = Date.now(), Ye.cancel(), qe(c(a.ctx.d ? na(a.ctx.d) : a.target, "longpress"), {
							...a.ctx,
							...o
						});
					}, e)
				};
			}, o = (e) => {
				t && e.pointerId === t.id && Math.hypot(e.clientX - t.cx, e.clientY - t.cy) > 8 && r();
			}, l = (e) => {
				t && e.pointerId === t.id && r();
			}, u = (e) => {
				lt() && (ct = 0, e.stopPropagation(), e.preventDefault());
			};
			return n.addEventListener("pointerdown", a, !0), n.addEventListener("pointermove", o, !0), n.addEventListener("pointerup", l, !0), n.addEventListener("pointercancel", l, !0), n.addEventListener("click", u, !0), () => {
				r(), n.removeEventListener("pointerdown", a, !0), n.removeEventListener("pointermove", o, !0), n.removeEventListener("pointerup", l, !0), n.removeEventListener("pointercancel", l, !0), n.removeEventListener("click", u, !0);
			};
		})();
		if (L.current && typeof L.current.migrateNodeKeys == "function" && fe.current !== e) {
			fe.current = e;
			let t = (0, bc.migrationPairs)(o.nodes, Se);
			t.length && L.current.migrateNodeKeys(t);
		}
		let dt = !1;
		if (L.current && (dt = (0, Js.layoutIsDegenerate)(o.nodes.map((e) => L.current.nodeState(Ce(e))).filter((e) => e && Number.isFinite(e.x) && Number.isFinite(e.y)), ie({
			hovered: !1,
			pinned: !1
		}))), L.current && !dt) {
			for (let e of o.nodes) {
				let t = L.current.nodeState(Ce(e)), n = L.current.nodeState(be(e));
				t && typeof t.x == "number" && typeof t.y == "number" && (e.x = t.x, e.y = t.y, t.auto || (e.fx = t.x, e.fy = t.y)), l && n && typeof n.w == "number" && typeof n.h == "number" && (e._size = {
					width: n.w,
					height: n.h
				});
			}
			if (R.current === "force" && o.nodes.some((e) => e.type === "tag" && e.concept)) {
				let e = new Map(o.nodes.map((e) => [e.id, e])), t = /* @__PURE__ */ new Map();
				for (let n of o.links) {
					if (n.layer !== "tag") continue;
					let r = typeof n.target == "object" ? n.target.id : n.target, i = e.get(typeof n.source == "object" ? n.source.id : n.source);
					!i || i.type !== "article" || (t.has(r) || t.set(r, []), t.get(r).push(i));
				}
				for (let e of o.nodes) {
					if (e.type !== "tag" || !e.concept) continue;
					let n = L.current.nodeState(Ce(e));
					if (n && Number.isFinite(n.x) && Number.isFinite(n.y)) continue;
					let r = Nc((t.get(e.id) || []).map((e) => L.current.nodeState(Ce(e))));
					r && (e.x = r.x, e.y = r.y);
				}
			}
		}
		if (V.current = /* @__PURE__ */ new Set(), L.current) for (let e of o.nodes) {
			let t = L.current.nodeState(be(e));
			e.type === "article" && !e.link && t && t.pinned && V.current.add(e.id);
		}
		if (L.current && dt) for (let e of o.nodes) {
			let t = L.current.nodeState(be(e));
			l && t && typeof t.w == "number" && typeof t.h == "number" && (e._size = {
				width: t.w,
				height: t.h
			});
		}
		let ft = () => {
			let e = L.current;
			return e && e.preference ? e.preference("tightness") : null;
		}, pt = (0, Qs.tightened)(O, ft(), T), mt = (e) => e._groupedInto ? 0 : Math.max(0, (e._r || (e.type === "article" ? Math.hypot(T.width, T.height) / 2 : e.size / 2)) + pt.collidePadding), ht = (e) => e._groupedInto ? 0 : pt.chargeStrength, H = Ya().force("link", Ba().id((e) => e.id).distance(pt.linkDistance)).force("charge", Xa().strength(ht)).force("collide", La().radius(mt).strength(1).iterations(3)).force("center", ua(r / 2, i / 2)).velocityDecay(O.velocityDecay).alphaDecay(O.alphaDecay), gt = () => {
			se.current && se.current(), A.current && (r = A.current.clientWidth, i = A.current.clientHeight, p.attr("width", r).attr("height", i));
		};
		window.addEventListener("resize", gt);
		let _t = p.append("g").attr("class", "time-axis-layer"), vt = S.append("g").attr("class", "roots-layer").attr("aria-hidden", "true").style("pointer-events", "none"), yt = S.append("g").attr("class", "containers-layer"), bt = /* @__PURE__ */ new Map(), xt = /* @__PURE__ */ new Map();
		for (let e of o.containers || []) bt.set(e.id, /* @__PURE__ */ new Set()), xt.set(e.id, /* @__PURE__ */ new Set());
		for (let e of o.containmentEdges || []) bt.has(e.source) && bt.has(e.target) ? bt.get(e.source).add(e.target) : xt.has(e.source) && xt.get(e.source).add(e.target);
		let St = /* @__PURE__ */ new Map();
		function Ct(e, t) {
			if (!t && St.has(e)) return St.get(e);
			let n = t || /* @__PURE__ */ new Set();
			if (n.has(e)) return [];
			n.add(e);
			let r = Array.from(xt.get(e) || []), i = Array.from(bt.get(e) || []).flatMap((e) => Ct(e, n)), a = Array.from(new Set([...r, ...i]));
			return t || St.set(e, a), a;
		}
		let wt = [...o.containers || []].sort((e, t) => t.parent === e.id ? -1 : +(e.parent === t.id)), Tt = yt.selectAll(".container-group").data(wt, (e) => e.id).enter().append("g").attr("class", "container-group").attr("data-container-id", (e) => e.id), Et = () => {
			let e = L.current;
			return e && e.preference ? e.preference("nodePalette") : null;
		}, Dt = (0, Zs.nodePaletteFor)(w, Et()), Ot = (e) => e && e._look || (0, Xs.containerLook)(e, Dt);
		for (let e of o.containers || []) e._look = (0, Xs.containerLook)(e, Dt);
		let kt = () => {
			Dt && String(Dt.color).toLowerCase() !== "none" ? n.style.setProperty("--pp-node-color", Dt.color) : n.style.removeProperty("--pp-node-color");
		};
		kt(), Tt.append("path").attr("class", "container-hull").attr("stroke-width", (e) => e.strokeWidth || 1.5).attr("stroke-dasharray", (e) => e.strokeDasharray || (e.parent ? null : "6 6")), Tt.append("path").attr("class", "container-hull-ghost");
		let At = typeof document < "u" && document.documentElement.getAttribute("data-pp-theme") === "sketchbook", jt = () => (0, oc.initiallyClosed)(e.containers || [], w), Mt = new Set((e.containers || []).map((e) => e.id)), Nt = new Set(jt());
		if (L.current && typeof L.current.containerState == "function") for (let [e, t] of Object.entries(L.current.containerState())) t === "closed" && Mt.has(e) ? Nt.add(e) : t === "open" && Nt.delete(e);
		let Pt = /* @__PURE__ */ new Map(), Ft = /* @__PURE__ */ new Map(), It = 1.05, Lt = (0, tc.showContainerCount)(w);
		function Rt(e) {
			let t = (e.label || e.id).split(/\s+/), n = [], r = "";
			for (let e of t) r ? r.length + 1 + e.length > 15 ? (n.push(r), r = e) : r += " " + e : r = e;
			return r && n.push(r), n;
		}
		let zt = .42, Bt = .2, Vt = (e) => e.status ? String(e.status) : "";
		function Ht(e, t = {}) {
			let n = Rt(e).length, r = Vt(e) && t.status !== !1 ? Bt + zt * 1.3 : 0;
			return {
				n,
				statusH: r,
				total: n * It + r
			};
		}
		function Ut(e, t, n = {}) {
			let r = Rt(t), { n: i, total: a } = Ht(t, n), o = -a / 2;
			e.selectAll("*").remove(), r.forEach((t, n) => {
				e.append("tspan").attr("class", "label-line").attr("x", 0).attr("y", `${o + (n + .5) * It}em`).text(t), Lt && n === i - 1 && e.append("tspan").attr("class", "label-count").attr("font-weight", "500").attr("dx", "12px").attr("font-size", "0.5em").text("");
			});
			let s = n.status === !1 ? "" : Vt(t);
			if (s) {
				let t = o + i * It + Bt + zt * 1.3 / 2;
				e.append("tspan").attr("class", "label-status").attr("x", 0).attr("font-size", `${zt}em`).attr("font-weight", "500").attr("letter-spacing", "0.02em").attr("y", `${t / zt}em`).text(s);
			}
		}
		let Wt = typeof document < "u" ? document.createElement("canvas").getContext("2d") : null;
		function Gt() {
			return typeof document > "u" ? "'Atkinson', sans-serif" : getComputedStyle(document.documentElement).getPropertyValue("--pp-title-font").trim() || "'Atkinson', sans-serif";
		}
		function Kt(e, t, n, r) {
			let i = r ? 0 : e.length * t * .05;
			return Wt ? (Wt.font = r ? `400 ${t}px ${r}` : `${At ? 400 : n} ${t}px ${Gt()}`, Wt.measureText(e).width * 1.06 + i) : e.length * t * .6 + i;
		}
		function qt(e, t, n = {}) {
			let r = Rt(e), i = Lt ? Kt(" 000", t * .5, 500, n.family) + 12 : 0, a = n.status === !1 ? "" : Vt(e), o = Math.max(...r.map((e, a) => Kt(e, t, 700, n.family) + (a === r.length - 1 ? i : 0)), a ? Kt(a, t * zt, 500, n.family) : 0), s = Ht(e, n).total * t + .3 * t;
			return {
				w: o + 24,
				h: s + 12
			};
		}
		function Yt(e) {
			return e.badgeColor || e.color || e.stroke || "#d4af37";
		}
		let Xt = Tt.append("g").attr("class", "container-badge").attr("data-container-top", (e) => e.parent ? null : "").style("touch-action", "manipulation");
		Xt.append("rect").attr("class", "container-badge-hit").attr("fill", "transparent").attr("pointer-events", "all");
		let Zt = Xt.append("text").attr("class", "container-badge-text").attr("text-anchor", "middle").attr("dominant-baseline", "central").style("user-select", "none").attr("fill", (e) => Yt(e)).attr("opacity", .55).attr("font-size", (e) => e.parent ? "52px" : "64px");
		Zt.each(function(e) {
			Ut(U(this), e);
		});
		let Qt = (e) => Ot(e).label.face;
		function $t() {
			if (typeof document > "u") return;
			let e = typeof window < "u" ? window.SETTINGS : null, t = document.documentElement.getAttribute("data-pp-mode") || "dark", n = getComputedStyle(document.body).backgroundColor, r = !n || /rgba\([^)]*,\s*0\)$/.test(n) || n === "transparent", i = (0, hc.allBackgrounds)((0, hc.config)(e), t, r ? null : n);
			Zt.each(function(e) {
				let t = Ot(e).label.color, n = t ? {
					color: t,
					opacity: 1
				} : (0, hc.legibleOn)(Yt(e), i, { opacity: .55 });
				U(this).attr("fill", n.color).attr("opacity", n.opacity);
			});
		}
		$t();
		function en() {
			$t();
			let e = document.documentElement.getAttribute("data-pp-theme") === "sketchbook";
			if (e === At) return;
			At = e;
			let t = () => {
				ke && (Yr(), ba());
			};
			document.fonts && document.fonts.load ? document.fonts.load(`48px ${Gt()}`).then(t, t) : t();
		}
		let tn = typeof MutationObserver < "u" ? new MutationObserver(en) : null;
		At && typeof document < "u" && document.fonts && document.fonts.load && document.fonts.load(`48px ${Gt()}`).then(() => {
			!ke || !j.current || (Yr(), ba());
		}, () => {}), tn && tn.observe(document.documentElement, {
			attributes: !0,
			attributeFilter: ["data-pp-mode", "data-pp-theme"]
		});
		let nn = Tt.append("g").attr("class", "container-macro-node").style("display", "none").style("touch-action", "manipulation"), rn = (0, Ys.closedPillOf)(w);
		nn.append("path").attr("class", "container-macro-bg").attr("stroke-width", 2.2);
		let an = (0, Ys.closedPillScaleOf)(w), on = rn.labelSize || Math.round((T.labelMaxFontSize || 26) * 1.6), sn = nn.append("text").attr("class", "container-macro-text").attr("text-anchor", "middle").attr("dominant-baseline", "central").attr("font-size", (e) => `${e.parent ? on : Math.round(on * 1.25)}px`).attr("font-family", "'Atkinson', sans-serif").attr("font-weight", "700").attr("letter-spacing", "-0.02em");
		function cn() {
			Tt.select(".container-hull").style("fill", (e) => Ot(e).open.fill).style("fill-opacity", (e) => Ot(e).open.fillOpacity).style("stroke", (e) => Ot(e).open.stroke), Tt.select(".container-hull-ghost").style("stroke", (e) => Ot(e).open.stroke), Tt.select(".container-macro-bg").style("fill", (e) => Ot(e).closed.fill).style("fill-opacity", (e) => Ot(e).closed.fillOpacity).style("stroke", (e) => Ot(e).closed.stroke).style("filter", (e) => Ot(e).closed.glow ? `drop-shadow(0 0 18px color-mix(in srgb, ${Ot(e).closed.glow} 45%, transparent))` : "none");
			for (let e of [sn, Zt]) e.style("font-family", (e) => Qt(e)).style("font-weight", (e) => Qt(e) ? "400" : null).style("letter-spacing", (e) => Qt(e) ? "0" : null);
			sn.attr("fill", (e) => Ot(e).label.color || Yt(e)), $t();
		}
		cn(), ue.current = () => {
			let e = (0, Zs.nodePaletteFor)(w, Et());
			if ((e && e.id) !== (Dt && Dt.id)) {
				Dt = e;
				for (let e of o.containers || []) e._look = (0, Xs.containerLook)(e, Dt);
				cn(), kt();
			}
		};
		let ln = uo().curve(Co.alpha(.5));
		function un(e, t, n) {
			let r = 0;
			for (let t = 0; t < e.length; t++) r = r * 31 + e.charCodeAt(t) >>> 0;
			let i = () => (r = r * 1664525 + 1013904223 >>> 0, r / 4294967296);
			if (rn.shape === "blob") return ln(dn(i, t, n));
			let a = [];
			for (let e = 0; e < 14; e++) {
				let r = e / 14 * Math.PI * 2, o = Math.cos(r), s = Math.sin(r), c = 2 / 2.8, l = 1 + (i() - .5) * .08;
				a.push([Math.sign(o) * Math.abs(o) ** +c * t * l, Math.sign(s) * Math.abs(s) ** +c * n * l]);
			}
			return ln(a);
		}
		function dn(e, t, n) {
			let r = [], i = e() * Math.PI * 2;
			for (let t = 0; t < 8; t++) {
				let n = i + (t + (e() - .5) * .5) / 8 * Math.PI * 2, a = .86 + e() * .14;
				r.push([Math.cos(n) * a, Math.sin(n) * a]);
			}
			let a = r.map((e) => e[0]), o = r.map((e) => e[1]), s = t / Math.max(...a.map(Math.abs)), c = n / Math.max(...o.map(Math.abs)), l = [];
			for (let e = 0; e < 8; e++) {
				let t = r[e], n = r[(e + 1) % 8], i = (e) => [(t[0] + (n[0] - t[0]) * e) * s, (t[1] + (n[1] - t[1]) * e) * c];
				l.push(i(.16), i(.5), i(.84));
			}
			return l;
		}
		sn.each(function(e) {
			Ut(U(this), e, {
				status: rn.status,
				family: Qt(e)
			});
		});
		let fn = [...new Set((o.containers || []).map(Qt).filter(Boolean))];
		fn.length && typeof document < "u" && document.fonts && document.fonts.load && Promise.all(fn.map((e) => document.fonts.load(`48px ${e}`))).then(() => {
			!ke || !j.current || (Yr(), ba());
		}, () => {});
		function pn() {
			nn.each(function(e) {
				let t = U(this), n = parseFloat(t.select(".container-macro-text").attr("font-size")) || on, r = qt(e, n, {
					status: rn.status,
					family: Qt(e)
				}), i = Math.max(T.width * 1.5, r.w + n * 1.4), a = Math.max(T.height * 1.5, r.h + n * 1.4);
				t.select(".container-macro-bg").attr("d", un(e.id, i / 2, a / 2)), e._macroHalfW = i / 2 * an, e._macroHalfH = a / 2 * an;
			});
		}
		pn();
		function mn({ isCollapsed: e }) {
			return Jt().clickDistance(5).container(() => S.node()).filter((e) => !(e.ctrlKey || e.button !== void 0 && e.button !== 0)).on("start", function(e, t) {
				e.sourceEvent && e.sourceEvent.stopPropagation();
				let n = e.x, r = e.y;
				U(this).datum()._dragState = {
					startX: n,
					startY: r,
					lastX: n,
					lastY: r,
					totalMove: 0,
					moves: c("container", "drag") === "node.move"
				};
			}).on("drag", function(e, t) {
				let n = U(this).datum()._dragState;
				if (!n) return;
				let r = e.x - n.lastX, i = e.y - n.lastY;
				if (n.lastX = e.x, n.lastY = e.y, n.totalMove += Math.hypot(r, i), !n.moves) return;
				let a = Vn() ? Me.k / je : 1, o = r * a, s = i * a, c = Ct(t.id);
				if (!n.carried) {
					let e = new Set(c);
					n.carried = [...Mn.keys()].filter((t) => {
						let n = Ct(t);
						return n.length && n.every((t) => e.has(t));
					});
				}
				for (let e of n.carried) {
					let t = Wn(e);
					t && zn.set(e, {
						x: t.x + o,
						y: t.y + s
					});
				}
				for (let e of c) {
					let t = W.get(e);
					t && (t.x += o, t.y += s, t.fx = t.x, t.fy = t.y, L.current && L.current.setNodePosition(Ce(t), t.x, t.y, { transient: !0 }));
				}
				ba(), z.current && z.current();
			}).on("end", function(t, n) {
				let r = U(this).datum()._dragState;
				if (delete U(this).datum()._dragState, (r ? r.totalMove : 0) >= 4) {
					if (!r.moves) return;
					er = !1;
					let e = Ct(n.id);
					if (Ae) {
						let t = new Set(e);
						for (let e of Mn.keys()) {
							let n = Ct(e);
							n.length && n.every((e) => t.has(e)) && ir(e);
						}
					}
					let t = L.current;
					for (let n of e) {
						let e = W.get(n);
						e && (e.fx = e.x, e.fy = e.y, t && t.setNodePosition(Ce(e), e.x, e.y, { transient: !0 }));
					}
					t && t.commit(), ba();
				} else {
					if (lt()) return;
					let r = {
						c: n,
						closedNode: e,
						...Ze(t.sourceEvent)
					};
					$e(t.sourceEvent, () => qe(c("container", "tap"), r), () => qe(c("container", "doubletap"), r));
				}
			});
		}
		function hn(e, t) {
			t ? Wr([e.id], !0) : Wr([e.id], Nt.has(e.id));
		}
		Xt.call(mn({ isCollapsed: !1 })), nn.call(mn({ isCollapsed: !0 })), Xt.on("click", (e) => e.stopPropagation()), nn.on("click", (e) => e.stopPropagation());
		let gn = uo().curve(Co.alpha(.5)), _n = uo().curve(go);
		function vn(e, t) {
			let n = [], r = Math.max(8, t);
			for (let t = 0; t < e.length; t++) {
				let i = e[t], a = e[(t + 1) % e.length];
				n.push(i);
				let o = Math.hypot(a[0] - i[0], a[1] - i[1]), s = Math.floor(o / r);
				for (let e = 1; e < s; e++) n.push([i[0] + (a[0] - i[0]) * e / s, i[1] + (a[1] - i[1]) * e / s]);
			}
			return n;
		}
		let W = new Map(o.nodes.map((e) => [e.id, e])), yn = new Map((o.containers || []).map((e) => [e.id, e])), bn = (e) => {
			let t = 0, n = e.parent;
			for (; n && yn.has(n) && t < 20;) t++, n = yn.get(n).parent;
			return t;
		}, xn = h.labelSize && h.labelSize.min || 32, Sn = h.labelSize && h.labelSize.max || 96, Cn = h.labelSize && h.labelSize.nestedScale || .75, wn = () => {
			let e = /* @__PURE__ */ new Map();
			for (let t of o.containers || []) e.set(t.id, Array.from(xt.get(t.id) || []).map((e) => W.get(e)).filter(Boolean).map((e) => ({
				id: e.id,
				w: e._size && e._size.width || (e.type === "article" ? T.width : e.size),
				h: e._size && e._size.height || (e.type === "article" ? T.height : e.size),
				order: Number.isFinite(e.series_part) ? e.series_part : null,
				date: e.date || ""
			})));
			return e;
		}, G = {
			roots: [],
			nodes: /* @__PURE__ */ new Map(),
			containers: /* @__PURE__ */ new Map()
		};
		function Tn() {
			if (!o.containers || o.containers.length === 0) return;
			let e = wn(), t = () => (0, Ys.containerLayout)({
				containers: o.containers,
				members: e,
				closed: Nt,
				labelSize: (e) => qt(e, e._fs || xn, { family: Qt(e) }),
				macroSize: (e) => ({
					w: (e._macroHalfW || 130) * 2,
					h: (e._macroHalfH || 45) * 2
				}),
				options: {
					spacing: h.spiral?.spacing ?? 20,
					mode: R.current === "radial" ? "ring" : h.spiral?.mode || "path",
					startRadius: h.spiral?.startRadius,
					direction: h.spiral?.direction,
					gap: 28,
					padding: k,
					layoutOf: (e) => R.current === "force" ? (0, Ys.containerLayoutOf)(e, w) : null,
					hangOf: (e) => ({
						...w.hang || {},
						...e.hang || {}
					}),
					spiralOf: En
				}
			});
			for (let e of o.containers) e._fs = xn;
			let n = t();
			for (let e of o.containers) {
				let t = n.containers.get(e.id), r = t ? t.box.x1 - t.box.x0 : 0, i = Sn * Cn ** +bn(e);
				if (e._fs = Math.max(xn, Math.min(Math.max(xn, i), r / 8)), t && t.hang) {
					let n = T.width + t.hang.gap;
					for (let t = 0; t < 40 && e._fs > xn && qt(e, e._fs, { family: Qt(e) }).w > n; t++) e._fs = Math.max(xn, e._fs * .92);
				}
			}
			n = t(), G = n;
			for (let e of o.nodes) {
				let t = G.nodes.get(e.id);
				e._cardScale = (t && t.scale > 0 ? t.scale : 1) * (e._sourceCardScale > 0 ? e._sourceCardScale : 1);
			}
		}
		function En(e) {
			let t = {
				...w.spiral || {},
				...e && e.spiral || {}
			};
			return {
				...t,
				keepBelowY: Dn(e, t)
			};
		}
		function Dn(e, t) {
			if (t.keepBelow !== "crown" || !e || !Mn.has(e.id) || !(Nn && Nn.art && Number.isFinite(Nn.crownY)) || R.current !== "force") return null;
			let n = (0, mc.homeView)(oe), r = Ln(), i = (0, mc.anchorWorld)(Mn.get(e.id), Nn.art, n, r);
			return (0, mc.anchorWorld)({
				x: .5,
				y: Nn.crownY
			}, Nn.art, n, r).y - i.y;
		}
		let On = () => [w.spiral, ...(o.containers || []).map((e) => e.spiral)].some((e) => e && e.keepBelow === "crown");
		function kn(e) {
			if (Ae && Pn()) {
				let t = 0, n = 0, r = 0;
				for (let i of Mn.keys()) {
					let a = G.containers.get(i);
					if (!a || a.root !== e) continue;
					let o = An(i);
					o && (t += o.x, n += o.y, r++);
				}
				if (r) return {
					x: t / r,
					y: n / r
				};
			}
			let t = 0, n = 0, r = 0;
			for (let [i, a] of G.nodes) {
				if (a.root !== e) continue;
				let o = W.get(i);
				!o || !Number.isFinite(o.x) || !Number.isFinite(o.y) || (t += o.x - a.x, n += o.y - a.y, r++);
			}
			return r ? {
				x: t / r,
				y: n / r
			} : null;
		}
		function An(e) {
			let t = 0, n = 0, r = 0;
			for (let i of Ct(e)) {
				let e = G.nodes.get(i), a = W.get(i);
				!e || !a || !Number.isFinite(a.x) || !Number.isFinite(a.y) || (t += a.x - e.x, n += a.y - e.y, r++);
			}
			return r ? {
				x: t / r,
				y: n / r
			} : null;
		}
		let jn = () => h.spiral?.enabled !== !1 && (R.current === "force" || R.current === "radial"), Mn = new Map(Object.entries(Hc(e)).filter(([e]) => yn.has(e))), Nn = typeof window < "u" && window.PostPipeCoverFrame || null, Pn = () => Mn.size > 0 && !!(Nn && Nn.art) && jn() && R.current === "force" && G.containers.size > 0, Fn = /* @__PURE__ */ new Map();
		for (let e of [...Mn.keys()].sort((e, t) => bn(yn.get(t)) - bn(yn.get(e)))) for (let t of Ct(e)) Fn.has(t) || Fn.set(t, e);
		Ae = !0;
		function In(e) {
			let t = G.containers.get(e), n = t && An(e);
			return n ? {
				x: n.x + t.center.x,
				y: n.y + t.center.y
			} : null;
		}
		function Ln() {
			if (!A.current) return {
				x: 0,
				y: 0
			};
			let e = A.current.getBoundingClientRect(), t = typeof window < "u" && window.PostPipeCover && window.PostPipeCover.shift || 0;
			return {
				x: e.left,
				y: e.top - t
			};
		}
		function Rn() {
			let e = /* @__PURE__ */ new Map();
			if (!Pn()) return e;
			let t = (0, mc.homeView)(oe), n = Ln();
			for (let [r, i] of Mn) e.set(r, (0, mc.anchorWorld)(i, Nn.art, t, n));
			return e;
		}
		let zn = /* @__PURE__ */ new Map(), Bn = /* @__PURE__ */ new Map();
		function Vn() {
			return ze && je > 0 && Pn();
		}
		function Hn() {
			let e = je > 0 ? je : oe, t = Be() || [r / 2, i / 2], n = (0, mc.homeView)(e);
			return {
				x: (t[0] - n.x) / e,
				y: (t[1] - n.y) / e
			};
		}
		function Un() {
			let e = Hn(), t = Oo(p.node());
			return [t.x + t.k * e.x, t.y + t.k * e.y];
		}
		let Wn = (e) => zn.get(e) || In(e);
		function Gn() {
			if (Bn = /* @__PURE__ */ new Map(), !Vn()) return;
			let e = Me.k / je;
			if (Math.abs(e - 1) < 1e-9) return;
			let t = Hn();
			for (let n of Mn.keys()) {
				let r = Wn(n);
				r && Bn.set(n, (0, ic.growShift)(r, t, e));
			}
		}
		let Kn = {
			x: 0,
			y: 0
		}, qn = (e) => Bn.size && e && Bn.get(Fn.get(e.id)) || Kn;
		function Jn(e) {
			if (!Bn.size || !e) return Kn;
			let t = e;
			for (let e = 0; t && e < 20; e++) {
				let e = Bn.get(t.id);
				if (e) return e;
				t = t.parent ? yn.get(t.parent) : null;
			}
			return Kn;
		}
		let Yn = (e) => {
			let t = qn(e);
			return t === Kn ? e : {
				x: e.x + t.x,
				y: e.y + t.y
			};
		};
		function Zn(e) {
			if (!Vn() || !(0, ic.growCapOn)(w)) return Infinity;
			let t = [];
			for (let n of Mn.keys()) {
				let r = G.containers.get(n), i = yn.get(n);
				if (!r || !i || Rr(i)) continue;
				let a = e && e.get(n) || Wn(n);
				if (!a) continue;
				let o = a.x - r.center.x, s = a.y - r.center.y, c = Nt.has(n) ? 0 : .75 * cr;
				t.push({
					id: n,
					centre: a,
					box: {
						x0: r.box.x0 + o - c,
						y0: r.box.y0 + s - c,
						x1: r.box.x1 + o + c,
						y1: r.box.y1 + s + c
					}
				});
			}
			return je * (0, ic.growCap)(t, {
				gap: 16,
				homeK: je
			});
		}
		function Qn(e) {
			if (!Vn()) return;
			let t = Zn(e);
			Me.k > t + 1e-9 && zo(t / Me.k);
		}
		let $n = /* @__PURE__ */ new Set(), er = !1, tr = (e) => Se(R.current) + e, nr = /* @__PURE__ */ new Set();
		function rr(e) {
			let t = L.current;
			if (!t) return nr.has(e);
			let n = t.nodeState(tr(e));
			return !!(n && !n.auto && Number.isFinite(n.x));
		}
		function ir(e) {
			let t = In(e), n = L.current;
			n && t ? n.setNodePosition(tr(e), t.x, t.y, { transient: !0 }) : nr.add(e);
		}
		let ar = /* @__PURE__ */ new Map();
		for (let e of Mn.keys()) {
			let t = L.current;
			if (t && rr(e)) {
				let n = t.nodeState(tr(e));
				for (let t of Ct(e)) {
					if (Fn.get(t) !== e) continue;
					let n = W.get(t);
					n && Number.isFinite(n.x) && Number.isFinite(n.y) && (n.fx = n.x, n.fy = n.y);
				}
				ar.set(e, {
					x: n.x,
					y: n.y
				});
			} else $n.add(e);
		}
		function or(e) {
			for (let [t, n] of e) {
				let e = In(t);
				if (!n || !e) continue;
				Mn.has(t) && zn.set(t, {
					x: n.x,
					y: n.y
				});
				let r = n.x - e.x, i = n.y - e.y;
				for (let e of Ct(t)) {
					let t = W.get(e);
					!t || !Number.isFinite(t.x) || !Number.isFinite(t.y) || (t.x += r, t.y += i, t.fx = t.x, t.fy = t.y, t.vx = 0, t.vy = 0);
				}
			}
		}
		function sr(e) {
			let t = An(e);
			if (t) for (let n of Ct(e)) {
				if (Fn.get(n) !== e) continue;
				let r = G.nodes.get(n), i = W.get(n);
				!r || !i || !Number.isFinite(i.x) || !Number.isFinite(i.y) || (i.x = t.x + r.x, i.y = t.y + r.y, i.vx = 0, i.vy = 0);
			}
		}
		let cr = Number.isFinite(Number(w.hull && w.hull.padding)) ? Number(w.hull.padding) : 24;
		function lr(e) {
			if (!Pn()) return e;
			let t = [];
			for (let n of Mn.keys()) {
				let r = G.containers.get(n), i = e.get(n) || In(n);
				if (!r || !i) continue;
				let a = i.x - r.center.x, o = i.y - r.center.y, s = Nt.has(n) ? 0 : .75 * cr;
				t.push({
					id: n,
					box: {
						x0: r.box.x0 + a - s,
						y0: r.box.y0 + o - s,
						x1: r.box.x1 + a + s,
						y1: r.box.y1 + o + s
					},
					open: !Nt.has(n),
					fixed: rr(n),
					towards: En(yn.get(n)).openTowards
				});
			}
			let n = (0, ec.actsApart)(t, { gap: 16 / oe });
			if (!n.size) return e;
			let r = new Map(e);
			for (let [e, t] of n) {
				let n = r.get(e) || In(e);
				n && r.set(e, {
					x: n.x + t.dx,
					y: n.y + t.dy
				});
			}
			return r;
		}
		function ur(e = [...Mn.keys()]) {
			if (!Pn()) return !1;
			let t = lr(Rn());
			or(e.map((e) => [e, t.get(e)]));
			for (let t of e) $n.delete(t);
			return e.length, Mn.size, !0;
		}
		function dr() {
			return ar.size ? (or([...ar]), ar.clear(), !0) : !1;
		}
		let fr = () => Mn.size ? [...Mn.keys()] : (o.containers || []).filter((e) => e.parent && !yn.get(e.parent)?.parent).map((e) => e.id), pr = /* @__PURE__ */ new WeakMap();
		function mr(e) {
			let t = e.getAttribute("d") || "", n = pr.get(e);
			if (n && n.d === t) return n.pts;
			let r = [];
			try {
				let t = e.getTotalLength();
				for (let n = 0; n < 72; n++) {
					let i = e.getPointAtLength(t * n / 72);
					r.push([i.x, i.y]);
				}
			} catch {
				r = [];
			}
			return pr.set(e, {
				d: t,
				pts: r
			}), r;
		}
		function hr(e, t, n) {
			if (!t) return In(e);
			let r = n.select(".container-macro-node").node(), i = n.node(), a = r && r.getScreenCTM ? r.getScreenCTM() : null, o = i && i.getScreenCTM ? i.getScreenCTM() : null;
			if (!a || !o) return In(e);
			let s = o.inverse();
			return {
				x: s.a * a.e + s.c * a.f + s.e,
				y: s.b * a.e + s.d * a.f + s.f
			};
		}
		function gr() {
			let e = [];
			if (!ke) return {
				containers: e,
				k: Te.current,
				homeK: je,
				moving: !1
			};
			let t = Pn() ? Rn() : null, n = !1;
			for (let r of fr()) {
				let i = Tt.filter((e) => e.id === r), a = i.node();
				if (!a || a.style.display === "none") continue;
				let o = Nt.has(r), s = i.select(o ? ".container-macro-bg" : ".container-hull").node();
				if (!s || !o && s.style.display === "none") continue;
				let c = mr(s), l = s.getScreenCTM();
				if (!l || c.length < 3) continue;
				let u = c.map(([e, t]) => ({
					x: l.a * e + l.c * t + l.e,
					y: l.b * e + l.d * t + l.f
				})), d = 0, f = 0;
				for (let e of u) d += e.x, f += e.y;
				let p = {
					id: r,
					closed: o,
					hull: u,
					centre: {
						x: d / u.length,
						y: f / u.length
					}
				};
				if (t && t.has(r)) {
					let e = t.get(r), a = hr(r, o, i);
					a && e && (p.drift = {
						x: a.x - e.x,
						y: a.y - e.y
					});
					let s = In(r);
					a && s && Math.hypot(a.x - s.x, a.y - s.y) > .25 && (n = !0);
				}
				e.push(p);
			}
			return {
				containers: e,
				k: Te.current,
				homeK: je,
				moving: n
			};
		}
		function _r() {
			typeof window > "u" || window.dispatchEvent(new CustomEvent("graph:world"));
		}
		typeof window < "u" && (window.PostPipeGraphWorld = { snapshot: gr });
		function vr() {
			function e(e) {
				if (!jn() || R.current !== "force") return;
				let t = h.spiral?.strength ?? .35, n = /* @__PURE__ */ new Map();
				if (Pn()) for (let e of Mn.keys()) n.set(e, An(e));
				for (let r of G.roots) {
					let i = kn(r);
					for (let [a, o] of G.nodes) {
						if (o.root !== r) continue;
						let s = W.get(a);
						if (!s || !Number.isFinite(s.x)) continue;
						let c = Fn.get(a), l = c && n.get(c) || i;
						l && (s.vx += (l.x + o.x - s.x) * t * e, s.vy += (l.y + o.y - s.y) * t * e);
					}
				}
			}
			return e.initialize = function() {}, e;
		}
		function yr() {
			let e = [], t = (e) => e.type === "article" ? Math.hypot(e._size?.width || T.width, e._size?.height || T.height) / 2 * (e._cardScale || 1) : e._r || (e.size || 60) / 2;
			function n(n) {
				if (!o.containers || o.containers.length === 0) return;
				let r = [];
				for (let e of G.roots) {
					let t = G.containers.get(e), n = kn(e);
					if (!t || !n) continue;
					let i = Ct(e).map((e) => W.get(e)).filter((e) => e && Number.isFinite(e.x));
					r.push({
						x: n.x + (t.box.x0 + t.box.x1) / 2,
						y: n.y + (t.box.y0 + t.box.y1) / 2,
						r: Math.hypot(t.box.x1 - t.box.x0, t.box.y1 - t.box.y0) / 2,
						members: i
					});
				}
				let i = (e, t, r, i, a) => {
					if (r >= i) return;
					let o = i - r, s = r > 1e-4 ? e / r : 1, c = r > 1e-4 ? t / r : 0;
					a(s * o * n * .5, c * o * n * .5);
				}, a = h.containerSpacing === void 0 ? -20 : h.containerSpacing;
				for (let e = 0; e < r.length; e++) for (let t = e + 1; t < r.length; t++) {
					let n = r[e], o = r[t], s = o.x - n.x, c = o.y - n.y;
					i(s, c, Math.hypot(s, c), n.r + o.r + a, (e, t) => {
						for (let r of n.members) r.vx -= e, r.vy -= t;
						for (let n of o.members) n.vx += e, n.vy += t;
					});
				}
				let s = new Set(G.nodes.keys()), c = (e.length ? e : o.nodes).filter((e) => !s.has(e.id) && Number.isFinite(e.x));
				for (let e of r) for (let n of c) {
					let r = n.x - e.x, a = n.y - e.y;
					i(r, a, Math.hypot(r, a), e.r + t(n), (t, r) => {
						n.vx += t, n.vy += r;
						for (let n of e.members) n.vx -= t * .2, n.vy -= r * .2;
					});
				}
			}
			return n.initialize = (t) => {
				e = t;
			}, n;
		}
		o.containers && o.containers.length > 0 && (Tn(), H.force("containerSeparation", yr()), H.force("containerLayout", vr()));
		let br = /* @__PURE__ */ new Set(), xr = (e) => (G.nodes.get(e) || {}).root || null, Sr = (e) => typeof e == "object" ? e.id : e;
		function Cr() {
			br = /* @__PURE__ */ new Set();
			for (let e of Nt) for (let t of Ct(e)) br.add(t);
			H.force("collide").radius((e) => br.has(e.id) || e._groupedInto ? 0 : G.nodes.has(e.id) && e.type === "article" ? Math.min(e._size?.width || T.width, e._size?.height || T.height) / 2 * (e._cardScale || 1) : mt(e)), H.force("charge").strength((e) => br.has(e.id) || e._groupedInto ? 0 : G.nodes.has(e.id) ? pt.chargeStrength * .05 : pt.chargeStrength);
		}
		G.nodes.size > 0 && Cr();
		let wr = H.force("link"), Tr = wr.strength(), Er = (e && e.items || []).filter((e) => e && typeof e.id == "string"), Dr = null, Or = /* @__PURE__ */ new Map();
		Er.forEach((e, t) => {
			Or.set(e.id, t);
			let n = e.date_published ? Date.parse(e.date_published) : NaN;
			Number.isFinite(n) && (Dr === null || n > Dr) && (Dr = n);
		});
		let kr = {
			degrees: o.degrees,
			nodeById: W,
			newestMs: Dr,
			ranks: Or,
			count: Er.length
		}, Ar = he(), jr = o.links, Mr = 0;
		function Nr() {
			Ar.mode === "weighted" ? (wr.distance((e) => (0, $s.linkDistance)(e._edgeWeight ? e._edgeWeight.eff : 0, Mr, pt.linkDistance, Ar.distanceSpread)), wr.strength((e) => {
				if (G.nodes.size > 0) {
					let t = xr(Sr(e.source));
					if (t && t === xr(Sr(e.target))) return 0;
				}
				return (0, $s.linkStrength)(e._edgeWeight ? e._edgeWeight.eff : 0);
			})) : (wr.distance(pt.linkDistance), wr.strength(G.nodes.size > 0 ? (e) => {
				let t = xr(Sr(e.source));
				return t && t === xr(Sr(e.target)) ? 0 : Tr(e);
			} : Tr));
		}
		function Pr(e, { setLinks: t = !0 } = {}) {
			e && (jr = e), Ar = he();
			let n = {
				...kr,
				settings: Ar
			};
			for (let e of o.links) {
				let t = (0, $s.effectiveWeight)(e, n);
				e._edgeWeight = t;
				let r = e._baseLabel === void 0 ? e.label || "" : e._baseLabel;
				e.label = Ar.mode === "weighted" ? r ? `${r}\n${(0, $s.edgeWeightLine)(e, t)}` : (0, $s.edgeWeightLine)(e, t) : r;
			}
			Mr = 0;
			for (let e of jr) e._edgeWeight && e._edgeWeight.eff > Mr && (Mr = e._edgeWeight.eff);
			t && (wr.links(jr), Nr());
		}
		Pr(o.links, { setLinks: !1 }), pe.current = () => {
			let e = (0, Qs.tightened)(O, ft(), T);
			e.linkDistance === pt.linkDistance && e.chargeStrength === pt.chargeStrength && e.collidePadding === pt.collidePadding || (pt = e, Nr(), G.nodes.size > 0 ? Cr() : (H.force("charge").strength(ht), H.force("collide").radius(mt)), R.current === "force" && H.alpha(Math.max(H.alpha(), .3)).restart());
		}, me.current = () => {
			let e = he();
			e.mode === Ar.mode && e.degreePenalty === Ar.degreePenalty || (Pr(jr), ii.attr("data-label", (e) => e.label), R.current === "force" && H.alpha(Math.max(H.alpha(), .3)).restart());
		};
		function Fr(e) {
			let t = r / 2;
			for (let n of G.roots) {
				let a = G.containers.get(n);
				if (!a) continue;
				let o = a.box.x1 - a.box.x0, s = t - (a.box.x0 + a.box.x1) / 2 + (t === r / 2 ? 0 : o / 2), c = i / 2 - (a.box.y0 + a.box.y1) / 2;
				for (let [t, r] of G.nodes) {
					if (r.root !== n) continue;
					let i = W.get(t);
					i && (e || !Number.isFinite(i.x) || !Number.isFinite(i.y)) && (i.x = s + r.x, i.y = c + r.y, i.vx = 0, i.vy = 0);
				}
				t += (t === r / 2 ? o / 2 : o) + 200;
			}
		}
		G.nodes.size > 0 && Fr(dt);
		function Ir() {
			if (!o.containers || o.containers.length === 0 || (Tn(), Cr(), G.nodes.size === 0)) return null;
			let e = {}, t = 0;
			for (let n of G.roots) {
				let r = G.containers.get(n);
				if (!r) continue;
				let i = t - r.box.x0, a = -(r.box.y0 + r.box.y1) / 2;
				for (let [t, r] of G.nodes) r.root === n && (e[t] = {
					x: i + r.x,
					y: a + r.y
				});
				t += r.box.x1 - r.box.x0 + 200;
			}
			let n = o.nodes.filter((e) => !G.nodes.has(e.id) && !e._groupedInto);
			if (n.length) {
				let r = (0, Js.radialLayout)(n, {
					cardW: T.width,
					cardH: T.height
				}), i = Object.values(r).map((e) => e.x), a = i.length ? t + T.width - Math.min(...i) : t;
				for (let [t, n] of Object.entries(r)) e[t] = {
					x: n.x + a,
					y: n.y
				};
			}
			return e;
		}
		function Lr() {
			!o.containers || o.containers.length === 0 || (Tn(), Cr());
		}
		function Rr(e) {
			let t = e.parent, n = 0;
			for (; t && n++ < 20;) {
				if (Nt.has(t)) return !0;
				t = yn.get(t)?.parent;
			}
			return !1;
		}
		function zr() {
			if (wt.length === 0) return;
			Gn(), _r();
			let e = jn() && G.containers.size > 0, t = (t) => {
				let n = e ? G.containers.get(t.id) : null, r = n ? An(t.id) : null;
				return n && r ? {
					info: n,
					off: r
				} : null;
			}, n = (e) => {
				let n = t(e);
				if (n) return {
					x: n.off.x + n.info.center.x,
					y: n.off.y + n.info.center.y
				};
				let r = Ct(e.id).map((e) => W.get(e)).filter((e) => e && Number.isFinite(e.x));
				return r.length ? {
					x: v(r, (e) => e.x),
					y: v(r, (e) => e.y)
				} : null;
			};
			Tt.each(function(e) {
				let r = U(this), i = Ct(e.id).map((e) => W.get(e)).filter((e) => e && Number.isFinite(e.x) && Number.isFinite(e.y));
				if (i.length === 0 || Rr(e)) {
					r.style("display", "none"), Ft.delete(e.id);
					return;
				}
				let a = Nt.has(e.id), o = e._fs || 52, s = t(e), c = Jn(e);
				r.attr("transform", c.x || c.y ? `translate(${c.x}, ${c.y})` : null);
				let l = (e) => e && (c.x || c.y) ? {
					x: e.x + c.x,
					y: e.y + c.y
				} : e, u = (e) => {
					let t = Yn(e);
					return {
						x: t.x - c.x,
						y: t.y - c.y
					};
				};
				if (a) {
					let t = n(e);
					Pt.set(e.id, l(t)), Ft.set(e.id, l(t)), r.style("display", null), r.select(".container-hull").style("display", "none"), r.select(".container-hull-ghost").attr("d", ""), r.select(".container-badge").style("display", "none"), r.select(".container-macro-node").style("display", null).attr("transform", `translate(${t.x}, ${t.y})${Ne()}${an === 1 ? "" : ` scale(${an})`}`).select(".label-count").text((0, tc.containerCountText)(w, i.length));
					return;
				}
				let d = v(i, (e) => Yn(e).x), f = v(i, (e) => Yn(e).y);
				Pt.set(e.id, {
					x: d,
					y: f
				}), r.style("display", null), r.select(".container-macro-node").style("display", "none"), r.select(".container-hull").style("display", null), r.select(".container-badge").style("display", null);
				let p = [], m = k(e);
				for (let t of bt.get(e.id) || []) {
					if (!Nt.has(t)) continue;
					let e = yn.get(t), r = e && n(e);
					if (!r) continue;
					let i = Jn(e), a = {
						x: r.x + i.x - c.x,
						y: r.y + i.y - c.y
					}, o = (e._macroHalfW || 130) + m / 2, s = (e._macroHalfH || 45) + m / 2;
					p.push([a.x - o, a.y - s], [a.x + o, a.y - s], [a.x + o, a.y + s], [a.x - o, a.y + s]);
				}
				let h = i.filter((e) => {
					for (let t of Nt) if (Ct(t).includes(e.id)) return !1;
					return !0;
				});
				for (let e of h) {
					let t = e._cardScale || 1, n = (e._size?.width || (e.type === "article" ? T.width : e.size)) * t, r = (e._size?.height || (e.type === "article" ? T.height : e.size)) * t, i = n / 2 + m, a = r / 2 + m, o = u(e);
					p.push([o.x - i, o.y - a], [o.x + i, o.y - a], [o.x + i, o.y + a], [o.x - i, o.y + a]);
				}
				let y = Wc(e), b = null;
				if (s) {
					let n = m / 2, r = [], i = (e) => {
						for (let n of bt.get(e) || []) {
							if (Nt.has(n)) continue;
							let e = yn.get(n), a = e && t(e), o = e ? Jn(e) : Kn;
							a && Wc(e) !== "hidden" && r.push({
								L: a.info.label,
								off: {
									x: a.off.x + o.x - c.x,
									y: a.off.y + o.y - c.y
								}
							}), i(n);
						}
					};
					i(e.id);
					for (let { L: e, off: t } of r) p.push([t.x + e.x0 - n, t.y + e.y0 - n], [t.x + e.x1 + n, t.y + e.y0 - n], [t.x + e.x1 + n, t.y + e.y1 + n], [t.x + e.x0 - n, t.y + e.y1 + n]);
					let a = s.info.label;
					b = {
						x: s.off.x + (a.x0 + a.x1) / 2,
						y: s.off.y + (a.y0 + a.y1) / 2
					}, y === "center" && p.push([s.off.x + a.x0 - n, s.off.y + a.y0 - n], [s.off.x + a.x1 + n, s.off.y + a.y0 - n], [s.off.x + a.x1 + n, s.off.y + a.y1 + n], [s.off.x + a.x0 - n, s.off.y + a.y1 + n]);
				}
				if (p.length === 0) {
					r.select(".container-hull-ghost").attr("d", ""), r.select(".container-hull").style("display", "none"), r.select(".container-badge").style("display", "none");
					return;
				}
				let x = to(p);
				if (!x || x.length < 3) return;
				let S = !!(s && s.info.hang);
				S && (x = vn(x, m / 2));
				let C = S ? _n : gn;
				(0, Ys.hullDrawn)(e) ? (r.select(".container-hull").style("display", null).attr("d", C(x)), r.select(".container-hull-ghost").attr("d", At ? C((0, Bo.jitterPoints)(x, e.id, 3.5)) : "")) : (r.select(".container-hull").style("display", "none").attr("d", ""), r.select(".container-hull-ghost").attr("d", ""));
				let E = r.select(".container-badge");
				E.attr("data-label-position", y), E.select(".label-count").text((0, tc.containerCountText)(w, i.length));
				let D = (t) => {
					let n = qt(e, t, { family: Qt(e) });
					E.select(".container-badge-hit").attr("x", -n.w / 2).attr("y", -n.h / 2).attr("width", n.w).attr("height", n.h);
				};
				if (y === "hidden") {
					E.style("display", "none"), Ft.set(e.id, l(b || {
						x: v(x, (e) => e[0]),
						y: v(x, (e) => e[1])
					}));
					return;
				}
				if (y === "top") {
					let t = b ? o : Math.max(xn, Math.min(Sn, (g(x, (e) => e[0]) - _(x, (e) => e[0])) / 8)), n = qt(e, t, { family: Qt(e) }), r = _(x, (e) => e[1]), i = {
						x: (_(x, (e) => e[0]) + g(x, (e) => e[0])) / 2,
						y: r + m * .5 + n.h / 2
					};
					E.select(".container-badge-text").attr("font-size", `${t}px`), D(t), E.attr("transform", `translate(${i.x}, ${i.y})${Ne()}`), Ft.set(e.id, l(i));
					return;
				}
				if (b) {
					E.select(".container-badge-text").attr("font-size", `${o}px`), D(o), E.attr("transform", `translate(${b.x}, ${b.y})${Ne()}`), Ft.set(e.id, l(b));
					return;
				}
				let O = Math.min(...x.map((e) => e[1])), A = Math.max(...x.map((e) => e[1])), j = Math.min(...x.map((e) => e[0])), M = Math.max(...x.map((e) => e[0])), N = Math.max(xn, Math.min(Sn, (M - j) / 8));
				E.select(".container-badge-text").attr("font-size", `${N}px`), D(N);
				let P = Za(x), F = Number.isFinite(P[0]) ? P[0] : v(x, (e) => e[0]);
				E.attr("transform", `translate(${F}, ${O + (A - O) / 3})${Ne()}`), Ft.set(e.id, l({
					x: F,
					y: O + (A - O) / 3
				}));
			});
		}
		let Br = /* @__PURE__ */ new Set();
		function Vr() {
			Br = (0, oc.closedMemberSet)(Nt, Ct);
			for (let e of o.nodes) e._closedHidden = Br.has(e.id);
			Ri && Ri.style("display", (e) => Br.has(e.id) ? "none" : null), Ci.style("display", (e) => Br.has(e.id) ? "none" : null);
			let e = (e) => (0, oc.edgeHidden)(e, Br) ? "none" : null;
			ii.style("display", e), ci.style("display", e), ri.style("display", e), di.style("display", e), hi && (0, oc.edgeHidden)(hi, Br) && Si();
		}
		function Hr() {
			Vr(), Yr(), zr(), ba();
		}
		function Ur() {
			return Object.fromEntries((o.containers || []).map((e) => [e.id, Nt.has(e.id) ? "closed" : "open"]));
		}
		function Wr(e, t) {
			return Gr(t ? { open: e } : { close: e });
		}
		function Gr({ open: e = [], close: t = [] }) {
			let n = [], r = [];
			for (let t of e) yn.has(t) && Nt.has(t) && (Nt.delete(t), n.push(t));
			for (let e of t) yn.has(e) && !Nt.has(e) && (Nt.add(e), r.push(e));
			return !n.length && !r.length ? !1 : (L.current && typeof L.current.setContainers == "function" && L.current.setContainers({
				open: n,
				close: r
			}), Hr(), Qn(Jr), typeof window < "u" && window.dispatchEvent(new CustomEvent("graph:containers-changed", { detail: Ur() })), !0);
		}
		let Kr = () => (o.containers || []).map((e) => e.id), qr = {
			openContainer: (e) => Wr([e], !0),
			closeContainer: (e) => Wr([e], !1),
			toggleContainer: (e) => Wr([e], Nt.has(e)),
			openAllContainers: () => Wr(Kr(), !0),
			closeAllContainers: () => Gr((0, oc.closeAllPlan)(o.containers)),
			getContainerState: Ur
		};
		b && (b.current = qr);
		let Jr = null;
		function Yr() {
			if (!o.containers || o.containers.length === 0) return;
			let e = new Map(G.roots.map((e) => [e, kn(e)])), t = /* @__PURE__ */ new Map();
			if (Pn()) {
				let e = Rn();
				for (let n of Mn.keys()) {
					let r = rr(n) ? In(n) : e.get(n) || In(n);
					r && t.set(n, r);
				}
			}
			if (pn(), Tn(), Cr(), Pn() && (t = lr(t)), !jn()) return;
			let n = [];
			for (let [e, r] of t) {
				let t = Wn(e);
				n.push({
					cId: e,
					x0: t ? t.x : r.x,
					y0: t ? t.y : r.y,
					x1: r.x,
					y1: r.y
				});
			}
			let r = (e) => {
				for (let t of n) zn.set(t.cId, {
					x: t.x0 + (t.x1 - t.x0) * e,
					y: t.y0 + (t.y1 - t.y0) * e
				});
			};
			Jr = t;
			let i = [];
			for (let [e, n] of G.nodes) {
				let r = W.get(e), a = Fn.get(e);
				if (!r || !Number.isFinite(r.x) || !a || !t.has(a)) continue;
				let o = t.get(a), s = G.containers.get(a);
				s && i.push({
					n: r,
					x0: r.x,
					y0: r.y,
					x1: o.x - s.center.x + n.x,
					y1: o.y - s.center.y + n.y
				});
			}
			if (!No && !i.length) {
				r(1), H.alpha(Math.max(H.alpha(), .3)).restart();
				return;
			}
			for (let [n, r] of G.nodes) {
				let a = W.get(n), o = e.get(r.root), s = Fn.get(n);
				s && t.has(s) || !a || !o || !Number.isFinite(a.x) || i.push({
					n: a,
					x0: a.x,
					y0: a.y,
					x1: o.x + r.x,
					y1: o.y + r.y
				});
			}
			Wi("container-relayout").duration(600).ease(Ji).tween("container-relayout", () => (e) => {
				for (let t of i) t.n.x = t.x0 + (t.x1 - t.x0) * e, t.n.y = t.y0 + (t.y1 - t.y0) * e, t.n.fx = t.n.x, t.n.fy = t.n.y;
				r(e), ba(), z.current && z.current();
			}).on("end", () => {
				C || jo({ animate: !0 });
			});
		}
		function Xr(e) {
			let t = we.current === e.id, n = V.current.has(e.id), r = e._size || ie({
				hovered: t,
				pinned: n
			}), i = e._cardScale || 1;
			return {
				w: r.width / 2 * i,
				h: r.height / 2 * i
			};
		}
		function Zr(e) {
			let t = typeof e.source == "object" ? Yn(e.source) : null, n = typeof e.target == "object" ? Yn(e.target) : null, r = t ? t.x : 0, i = t ? t.y : 0, a = n ? n.x : 0, o = n ? n.y : 0, s = typeof e.source == "object" ? e.source.id : e.source, c = typeof e.target == "object" ? e.target.id : e.target;
			if ((0, oc.edgeHidden)(e, Br)) return {
				x1: 0,
				y1: 0,
				x2: 0,
				y2: 0,
				hidden: !0
			};
			let l = null, u = null;
			for (let e of Nt) {
				let t = Ct(e);
				t.includes(s) && (l = e), t.includes(c) && (u = e);
			}
			if (l && l === u) return {
				x1: 0,
				y1: 0,
				x2: 0,
				y2: 0,
				hidden: !0
			};
			if (l) {
				let e = Pt.get(l);
				e && (r = e.x, i = e.y);
			}
			if (u) {
				let e = Pt.get(u);
				e && (a = e.x, o = e.y);
			}
			if (e.layer !== "sequence") return {
				x1: r,
				y1: i,
				x2: a,
				y2: o,
				hidden: !1
			};
			let d = a - r, f = o - i, p = Math.hypot(d, f);
			if (p < 40) return {
				x1: r,
				y1: i,
				x2: a,
				y2: o,
				hidden: !1
			};
			let m = d / p, h = f / p, g = Xr(e.source), _ = l ? 90 : g.w + 4, v = l ? 45 : g.h + 4, y = Math.min(Math.abs(m) > 1e-4 ? _ / Math.abs(m) : Infinity, Math.abs(h) > 1e-4 ? v / Math.abs(h) : Infinity), b = Xr(e.target), x = u ? 90 : b.w + 4, S = u ? 45 : b.h + 4, C = Math.min(Math.abs(m) > 1e-4 ? x / Math.abs(m) : Infinity, Math.abs(h) > 1e-4 ? S / Math.abs(h) : Infinity);
			return p <= y + C ? {
				x1: r,
				y1: i,
				x2: a,
				y2: o,
				hidden: !1
			} : {
				x1: r + m * y,
				y1: i + h * y,
				x2: a - m * C,
				y2: o - h * C,
				hidden: !1
			};
		}
		function Qr(e, t) {
			if (t.hidden) return "";
			if (e.layer !== "sequence") return `M ${t.x1} ${t.y1} L ${t.x2} ${t.y2}`;
			let n = t.x2 - t.x1, r = t.y2 - t.y1, i = Math.hypot(n, r);
			if (i < 2) return `M ${t.x1} ${t.y1} L ${t.x2} ${t.y2}`;
			let a = (t.x1 + t.x2) / 2, o = (t.y1 + t.y2) / 2, s = -r / i, c = n / i, l = Math.min(48, i * .12), u = a + s * l, d = o + c * l;
			return `M ${t.x1} ${t.y1} Q ${u} ${d} ${t.x2} ${t.y2}`;
		}
		let $r = /* @__PURE__ */ new Map();
		function ei(e) {
			if (!$r.has(e)) {
				let t = "edge-arrow-" + $r.size;
				m.append("marker").attr("id", t).attr("viewBox", "0 0 10 10").attr("refX", 9).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 13).attr("markerHeight", 13).attr("orient", "auto").append("path").attr("d", "M 0 1 L 10 5 L 0 9 z").style("fill", e).style("fill-opacity", .75), $r.set(e, t);
			}
			return $r.get(e);
		}
		let ti = (e) => {
			if (e.layer !== "sequence") return "#8a8f9c";
			let t = typeof e.source == "object" ? e.source.id : e.source;
			return W.get(t)?.containerColor || "var(--gv-accent, #d4af37)";
		}, ni = (e) => {
			let t = W.get(Sr(e.source)), n = W.get(Sr(e.target));
			return !!(t && t.type === "tag" || n && n.type === "tag");
		}, ri = S.insert("g", ".containers-layer").attr("class", "link-hits").selectAll(".link-hit").data(o.links).enter().append("path").attr("class", (e) => ni(e) ? "link-hit link-to-tag" : "link-hit").attr("fill", "none").style("stroke", "transparent").style("stroke-width", "16px").style("pointer-events", "stroke").style("cursor", "default"), ii = S.selectAll(".link").data(o.links).enter().append("path").attr("class", (e) => [
			"link",
			e.layer ? `link-${e.layer}` : "",
			e.role ? `link-role-${e.role}` : "",
			ni(e) ? "link-to-tag" : ""
		].filter(Boolean).join(" ")).attr("fill", "none").attr("data-label", (e) => e.label).attr("marker-end", (e) => e.directed ? `url(#${ei(ti(e))})` : null).style("stroke", (e) => e.layer === "sequence" ? ti(e) : null).style("stroke-opacity", (e) => e.layer === "sequence" ? .45 : null), ai = S.append("g").attr("class", "readers-layer").style("display", "none"), oi = S.append("g").attr("class", "relations-layer").style("display", "none"), si = S.insert("g", ".containers-layer").attr("class", "relation-hits"), ci = S.selectAll(".link-ghost").data(o.links).enter().insert("path", ".link-sequence-pulse").attr("class", (e) => ni(e) ? "link-ghost link-to-tag" : "link-ghost").style("stroke", (e) => ti(e)), li = (e) => `${Sr(e.source)}>${Sr(e.target)}`;
		function ui() {
			ci.attr("d", (e) => At && e._path ? (0, Bo.ghostOf)(e._path, li(e)) : "");
		}
		let di = S.selectAll(".link-sequence-pulse").data(o.links.filter((e) => e.layer === "sequence")).enter().append("path").attr("class", "link-sequence-pulse").attr("fill", "none").attr("pathLength", 100).style("stroke", (e) => {
			let t = typeof e.source == "object" ? e.source.id : e.source;
			return W.get(t)?.containerColor || "#ffe066";
		}).style("filter", (e) => {
			let t = typeof e.source == "object" ? e.source.id : e.source;
			return `drop-shadow(0 0 4px ${W.get(t)?.containerColor || "#ffd700"})`;
		}), fi = S.append("g").attr("class", "edge-label").style("pointer-events", "none").style("display", "none"), pi = fi.append("rect").attr("fill", "rgba(15, 17, 26, 0.88)").attr("stroke-opacity", .6), mi = fi.append("text").attr("text-anchor", "middle").attr("dominant-baseline", "central").attr("font-family", "'Atkinson', sans-serif").attr("font-weight", 600).attr("letter-spacing", "0.04em"), hi = null, gi = null, _i = null;
		function vi() {
			if (!hi || !gi) return;
			let e = gi.getTotalLength ? gi.getTotalLength() : 0;
			if (!e) {
				fi.style("display", "none");
				return;
			}
			let t = gi.getPointAtLength(e / 2), n = Te.current || 1, r = 13 / n, i = ti(hi), a = String(hi.label).split("\n");
			if (a.length > 1) {
				let e = r * 1.35;
				mi.attr("font-size", r).style("fill", i).text(null), a.forEach((t, n) => {
					mi.append("tspan").attr("x", 0).attr("y", (n - (a.length - 1) / 2) * e).text(t);
				});
				let o = (a.reduce((e, t) => Math.max(e, t.length), 0) * .62 + 1.4) * r, s = e * a.length + r * .7;
				pi.attr("x", -o / 2).attr("y", -s / 2).attr("width", o).attr("height", s).attr("rx", r * .6).style("stroke", i).attr("stroke-width", 1 / n), fi.attr("transform", `translate(${t.x}, ${t.y})${Ne()}`).style("display", null);
				return;
			}
			mi.attr("font-size", r).style("fill", i).text(hi.label);
			let o = (hi.label.length * .62 + 1.4) * r, s = r * 1.7;
			pi.attr("x", -o / 2).attr("y", -s / 2).attr("width", o).attr("height", s).attr("rx", s / 2).style("stroke", i).attr("stroke-width", 1 / n), fi.attr("transform", `translate(${t.x}, ${t.y})${Ne()}`).style("display", null);
		}
		let yi = !1;
		function bi(e, t) {
			clearTimeout(_i), _i = null, hi = e, gi = t, e && (e.layer === "relation" || String(e.label).includes("\n")) ? (fi.raise(), yi = !0) : xi(), vi();
		}
		function xi() {
			if (!yi) return;
			yi = !1;
			let e = S.node().querySelector(":scope > .node");
			e && S.node().insertBefore(fi.node(), e);
		}
		function Si() {
			clearTimeout(_i), _i = null, hi = null, gi = null, fi.style("display", "none"), xi();
		}
		ri.on("mouseenter", function(e, t) {
			bi(t, this);
		}).on("mouseleave", () => {
			_i || Si();
		}).on("click", function(e, t) {
			e.stopPropagation();
			let n = this;
			$e(e, () => {
				bi(t, n), _i = setTimeout(() => {
					_i = null, Si();
				}, 2500);
			});
		});
		let Ci = S.selectAll(".node").data(o.nodes).enter().append("g").attr("class", (e) => e.type === "tag" ? "node node-tag" : "node"), wi = S.append("g").attr("class", "relation-more").attr("role", "button").style("display", "none").style("cursor", "pointer");
		wi.append("rect").attr("class", "relation-more-bg"), wi.append("text").attr("class", "relation-more-text").attr("text-anchor", "middle").attr("dominant-baseline", "central");
		let Ti = Jt().clickDistance(5).container(() => S.node()).filter((e) => {
			if (e.ctrlKey || e.button !== void 0 && e.button !== 0) return !1;
			let t = e.target;
			return !(t && t.closest && t.closest("[data-pp-listen]") || (e.pointerType === "touch" || e.type === "touchstart") && t && t.closest && t.closest(".rp-scroll"));
		}).on("start", (e, t) => {
			e.sourceEvent && e.sourceEvent.stopPropagation(), t.fx = t.x, t.fy = t.y, t._dragFrom = {
				x: e.x,
				y: e.y
			}, t._dragMoved = !1;
			let n = e.sourceEvent && e.sourceEvent.target, r = !!(n && n.closest && n.closest("[data-resize=\"1\"]")), i = t.type === "article" ? c(na(t), "drag", { edge: r }) : "node.move";
			if (t._dragMoves = i === "node.move", t._resizing = i === "node.resize", t._resizing) {
				let n = t._size || ie({
					hovered: we.current === t.id,
					pinned: V.current.has(t.id)
				});
				t._resizeFrom = {
					w: n.width,
					h: n.height,
					x: e.x,
					y: e.y
				};
			}
		}).on("drag", (e, t) => {
			if (t._resizing) {
				let n = t._resizeFrom, r = (e, t, n) => Math.max(t, Math.min(n, e));
				t._size = {
					width: r(n.w + (e.x - n.x) * 2, T.minWidth, T.maxWidth),
					height: r(n.h + (e.y - n.y) * 2, T.minHeight, T.maxHeight)
				}, Ui(t), L.current && L.current.setNodeSize(be(t), t._size.width, t._size.height, { transient: !0 }), zr();
				return;
			}
			if (!t._dragMoves) return;
			if (!t._dragMoved) {
				let n = t._dragFrom || {
					x: e.x,
					y: e.y
				};
				if (Math.hypot(e.x - n.x, e.y - n.y) < 5) return;
				t._dragMoved = !0;
			}
			t.x = e.x, t.y = e.y, t.fx = e.x, t.fy = e.y, L.current && L.current.setNodePosition(be(t), e.x, e.y, { transient: !0 });
			let n = Yn(t);
			Ci.filter((e) => e.id === t.id).attr("transform", "translate(" + n.x + "," + n.y + ")" + Ne()), Ri && Ri.filter((e) => e.id === t.id).style("transform", `translate3d(${n.x}px, ${n.y}px, 0px) rotate(var(--gv-unrot, 0deg))${t._cardScale && t._cardScale !== 1 ? ` scale(${t._cardScale})` : ""}`), z.current && z.current(), ii.each(function(e) {
				let n = typeof e.source == "object" ? e.source.id : e.source, r = typeof e.target == "object" ? e.target.id : e.target;
				(n === t.id || r === t.id) && (e._path = Qr(e, Zr(e)), U(this).attr("d", e._path));
			}), ri.attr("d", (e) => e._path || ""), ui(), Si(), di.each(function(e) {
				let n = typeof e.source == "object" ? e.source.id : e.source, r = typeof e.target == "object" ? e.target.id : e.target;
				if (n === t.id || r === t.id) {
					let t = Zr(e);
					U(this).attr("d", Qr(e, t));
				}
			}), zr();
		}).on("end", (e, t) => {
			let n = L.current;
			if (t._resizing) {
				t._resizing = !1, n && n.commit(), zr();
				return;
			}
			t.fx = t.x, t.fy = t.y, t._dragMoved && (n && (n.setNodePosition(Ce(t), t.x, t.y, { transient: !0 }), n.commit()), zr());
		});
		Ci.call(Ti);
		let Ei = p.append("text").style("font-family", "'Atkinson', sans-serif").style("visibility", "hidden"), Di = "'Atkinson', sans-serif", Oi = typeof document < "u" ? document.createElement("canvas").getContext("2d") : null;
		function ki(e, t) {
			if (!Oi) return {
				width: e.length * t * .5,
				ascent: t * .7,
				descent: t * .2
			};
			Oi.font = "500 " + t + "px 'Atkinson', sans-serif";
			let n = Oi.measureText(e);
			return {
				width: n.actualBoundingBoxLeft + n.actualBoundingBoxRight,
				ascent: n.actualBoundingBoxAscent,
				descent: n.actualBoundingBoxDescent
			};
		}
		let Ai = [];
		function ji(e) {
			let { d: t, textEl: n, rectEl: r, lines: i, fontSize: a, lineH: o } = e, s = i.map((e) => ki(e, a)), c = i.map((e, t) => t * o), l = Math.min(...c.map((e, t) => e - s[t].ascent)), u = Math.max(...c.map((e, t) => e + s[t].descent)), d = -(l + u) / 2, f = l + d, p = u + d, m = Math.max(...s.map((e) => e.width));
			if (n.selectAll("tspan").each(function(e, t) {
				U(this).attr("y", c[t] + d);
			}), r.attr("x", -m / 2 - E.padding).attr("y", f - E.padding).attr("width", m + E.padding * 2).attr("height", p - f + E.padding * 2), e.formsEl) {
				let t = m / 2 + E.padding + 8;
				e.formsEl.attr("x", t), e.formsEl.selectAll("tspan").attr("x", t);
			}
			t._r = Math.hypot(m + E.padding * 2, p - f + E.padding * 2) / 2;
		}
		function Mi(e, t) {
			let n = E.padding, r = E.maxWidth, i = E.maxLines, a = e.split(/(?<=-)|\s+/).filter(Boolean), o = (e) => e.join("").replace(/\s+$/, "").trim(), s = [e];
			if (t(e) + n * 2 > r && a.length > 1) {
				s = [];
				let e = [];
				for (let i of a) {
					let a = [...e, i];
					e.length && t(o(a)) + n * 2 > r ? (s.push(o(e)), e = [i]) : e = a;
				}
				if (e.length && s.push(o(e)), s.length === 2) {
					let e = 1, n = Infinity;
					for (let r = 1; r < a.length; r++) {
						let i = Math.max(t(o(a.slice(0, r))), t(o(a.slice(r))));
						i < n && (n = i, e = r);
					}
					s = [o(a.slice(0, e)), o(a.slice(e))];
				}
				s.length > i && (s = s.slice(0, i - 1).concat([s.slice(i - 1).join(" ")]));
			}
			return s;
		}
		let Ni = (e, t) => e.length > 1 ? t * 1 : t * 1.1;
		function Pi() {
			let e = p.append("text").style("font-family", Di).style("visibility", "hidden").style("font-size", E.fontSize + "px").style("font-weight", "500");
			return {
				widthOf: (t) => (e.text(t), e.node().getComputedTextLength()),
				remove: () => e.remove()
			};
		}
		let Fi = (e) => {
			if (!e._groupKey) return null;
			let t = o.nodes.filter((t) => t._groupedInto === e.id);
			return t.length ? [e, ...t].map((e) => e.label) : null;
		};
		function Ii(t, n, r) {
			let i = n.type === "tag" ? (0, yc.tagFormsLines)((0, yc.tagForms)(e._rtagz, n.concept || n.label, e.items), {
				rtagz: e._rtagz,
				members: Fi(n)
			}) : [];
			if (!i.length) return null;
			let a = Math.round(r * .65), o = a * 1.25, s = t.append("text").attr("class", "tag-forms").attr("text-anchor", "start").attr("dominant-baseline", "central").style("font-family", Di).style("font-size", a + "px").style("font-weight", "500").style("fill", "var(--text, #ccc)").style("pointer-events", "none").style("display", "none");
			return i.forEach((e, t) => {
				s.append("tspan").attr("y", (t - (i.length - 1) / 2) * o).text(e);
			}), s;
		}
		Ci.each(function(e) {
			let t = U(this);
			if (e.type !== "article") {
				let n = E.fontSize;
				Ei.style("font-size", n + "px").style("font-weight", "500");
				let r = Mi(e.label, (e) => (Ei.text(e), Ei.node().getComputedTextLength())), i = Ni(r, n), a = t.append("text").attr("text-anchor", "middle").attr("fill", "#1a1a2e").style("font-family", Di).style("font-size", n + "px").style("font-weight", "500").style("pointer-events", "none");
				r.forEach((e) => {
					a.append("tspan").attr("x", 0).text(e);
				});
				let o = {
					d: e,
					el: t,
					textEl: a,
					rectEl: t.insert("rect", "text").attr("rx", E.cornerRadius).attr("ry", E.cornerRadius).attr("fill", "var(--gv-" + (e.type === "tag" ? "tag-color" : e.type === "topology" ? "topology-color" : "placeholder-color") + ")").attr("opacity", E.opacity),
					formsEl: Ii(t, e, n),
					lines: r,
					fontSize: n,
					lineH: i
				};
				Ai.push(o), ji(o);
			} else {
				let t = ie({
					hovered: !1,
					pinned: !1
				});
				e._r = Math.hypot(t.width, t.height) / 2;
			}
		}), Ei.remove(), typeof document < "u" && document.fonts && document.fonts.ready && document.fonts.ready.then(() => {
			Ai.forEach(ji);
		}).catch(() => {});
		let Li = /* @__PURE__ */ new Map(), Ri = x.selectAll(".node-card").data(o.nodes.filter((e) => e.type === "article")), zi = Ri.enter().append("div").attr("class", "node-card").style("position", "absolute").style("left", "0").style("top", "0").style("will-change", "transform").style("pointer-events", "auto").style("touch-action", "manipulation").call(Ti);
		Ri = Ri.merge(zi), zi.filter((e) => !!e.link).attr("tabindex", 0).attr("role", "link").attr("data-link-node", "").attr("aria-label", (e) => [
			e.title,
			e.subtitle,
			e.description
		].filter(Boolean).join(". ")).on("keydown", (e, t) => {
			e.key === "Enter" && (e.preventDefault(), e.stopPropagation(), (0, _c.followLink)(t.originalItem || t, { settings: jc() }));
		}), zi.each(function(e) {
			let t = u(this);
			Li.set(e.id, {
				root: t,
				wrapper: this,
				cardSelection: U(this)
			});
		});
		let Bi = null, Vi = /* @__PURE__ */ new Map();
		function Hi() {
			return Bi !== _e.current && (Bi = _e.current, Vi = (0, gc.countsByChapter)(Bi)), Vi;
		}
		function Ui(e) {
			if (e.type !== "article") return;
			let n = Li.get(e.id);
			if (!n) return;
			let r = we.current === e.id, i = V.current.has(e.id), a = (0, uc.getLOD)(Te.current), o = ie({
				hovered: r,
				pinned: i
			}), s = e._size || (e._customWidth && e._customHeight ? {
				width: e._customWidth,
				height: e._customHeight
			} : null), c = s ? s.width : o.width, u = s ? s.height : o.height;
			n.wrapper.style.width = c + "px", n.wrapper.style.height = u + "px", n.wrapper.style.marginLeft = -c / 2 + "px", n.wrapper.style.marginTop = -u / 2 + "px";
			let d = us(e.kind), p = L.current, m = p ? p.bookmarks(be(e)) : [], h = w.readingProgress !== !1 && p && p.readingProgress ? p.readingProgress(be(e)) : null, g = Hi().get(e.id) || 0;
			n.root.render(t.createElement(d, {
				article: e,
				sourceColor: Pc(e, ee),
				width: c,
				height: u,
				viewState: {
					hovered: r,
					pinned: i,
					lod: a,
					zoomScale: Te.current,
					bookmarks: m,
					bookmarkCount: m.length,
					progress: h,
					contributionCount: g
				},
				fullContent: e._fullContent || null,
				cardSettings: T,
				listen: f,
				onResize: l ? ({ width: t, height: r }) => {
					e._customWidth = t, e._customHeight = r, e._size = {
						width: t,
						height: r
					}, n.wrapper.style.width = t + "px", n.wrapper.style.height = r + "px", n.wrapper.style.marginLeft = -t / 2 + "px", n.wrapper.style.marginTop = -r / 2 + "px", e._r = Math.max(t, r) / 2, Ui(e);
				} : void 0
			}));
		}
		Ri.on("wheel", (e) => e.stopPropagation());
		function Gi() {
			o.nodes.forEach((e) => {
				e.type === "article" && Ui(e);
			});
		}
		ce.current = Gi;
		let Ki = /* @__PURE__ */ new Map(), Yi = /* @__PURE__ */ new Map();
		function Xi(e) {
			if ((e.originalItem && e.originalItem._posted) === "title") return e._fullContent = null, Promise.resolve();
			if (Ki.has(e.id)) return e._fullContent = Ki.get(e.id), Promise.resolve();
			if (Yi.has(e.id)) return Yi.get(e.id);
			let t = (e.url || "").split("/").pop(), n = (async () => {
				let n;
				try {
					!(e.url && new URL(e.url, window.location.href).origin === window.location.origin) && t && (n = await fetch("./" + t));
				} catch {}
				if (!n || !n.ok) try {
					n = await fetch(e.url);
				} catch {}
				if ((!n || !n.ok) && t && (n = await fetch("./" + t)), !n || !n.ok) throw Error("HTTP " + (n ? n.status : "failed"));
				return n.text();
			})().then((t) => {
				let n = new DOMParser().parseFromString(t, "text/html"), r = n.querySelector("h1");
				r && r.remove(), n.querySelectorAll(".pp-rights").forEach((e) => e.remove());
				let i = n.querySelector("body") ? n.querySelector("body").innerHTML : t;
				Ki.set(e.id, i), e._fullContent = i;
			}).catch(() => {
				Ki.set(e.id, null), e._fullContent = null;
			}).then(() => {
				Yi.delete(e.id);
			});
			return Yi.set(e.id, n), n;
		}
		Gi(), V.current.forEach((e) => {
			let t = o.nodes.find((t) => t.id === e);
			t && (Ri.filter((t) => t.id === e).raise().style("z-index", 10), Xi(t).then(() => {
				V.current.has(e) && Ui(t);
			}));
		}), Bc(p, y, De.current, ee, te(), re()), Ri.on("mouseover", (e, t) => {
			we.current !== t.id && (we.current = t.id, Ui(t), e.currentTarget.style.zIndex = 10);
		}).on("mouseout", (e, t) => {
			let n = e.relatedTarget;
			n && e.currentTarget.contains(n) || we.current === t.id && (we.current = null, Ui(t), e.currentTarget.style.zIndex = "");
		}).on("dblclick", (e, t) => {
			if (e.stopPropagation(), e.preventDefault(), t.link || Date.now() - Zi < 300) return;
			let n = e.target;
			n && (n.dataset?.popout === "1" || n.closest?.("[data-popout=\"1\"]")) || n && n.closest?.("[data-pp-listen]") || (Ye.cancel(), Qi(t, e.currentTarget, Ze(e)));
		}).on("click", (e, t) => {
			if (t.link) {
				e.stopPropagation(), Ye.cancel(), (0, _c.followLink)(t.originalItem || t, { settings: jc() });
				return;
			}
			let n = e.target;
			if (n && n.closest?.("[data-pp-listen]")) {
				e.stopPropagation(), Ye.cancel();
				return;
			}
			if (n && (n.dataset?.popout === "1" || n.closest?.("[data-popout=\"1\"]"))) {
				e.stopPropagation(), N.current && N.current(t.originalItem || t), V.current.has(t.id) && (V.current.delete(t.id), L.current && L.current.setNodePinned(be(t), !1), we.current = null, Ui(t), e.currentTarget.style.zIndex = "");
				return;
			}
			e.stopPropagation();
			let r = e.currentTarget, i = Ze(e);
			$e(e, () => qe(c(na(t), "tap"), {
				d: t,
				cardEl: r,
				...i
			}), () => Qi(t, r, i));
		});
		let Zi = 0;
		function Qi(e, t, n) {
			Zi = Date.now(), qe(c(na(e), "doubletap"), {
				d: e,
				cardEl: t,
				...n
			});
		}
		let $i = (0, lc.readablePxOf)(w);
		function ea(e) {
			let t = Li.get(e.id);
			if (!t) return 0;
			try {
				d(() => Ui(e));
			} catch {}
			let n = t.wrapper.querySelector("[data-card-title]");
			return n && parseFloat(getComputedStyle(n).fontSize) || 0;
		}
		let ta = (e) => (0, lc.titleScreenPx)(ea(e), Me.k, e._cardScale || 1), na = (e) => ta(e) >= $i ? "node.readable" : "node";
		function ra(e, t) {
			let n = {
				x: e.x,
				y: e.y
			}, r = Vn() ? Fn.get(e.id) : null, i = r && Mn.has(r) ? Wn(r) : null;
			if (i && je > 0) {
				let e = (0, ic.growShift)(i, Hn(), t.k / je);
				n = {
					x: n.x + e.x,
					y: n.y + e.y
				};
			}
			let a = (0, nc.viewToScreen)(t, B, n.x, n.y);
			return {
				x: a[0],
				y: a[1]
			};
		}
		function ia(e, t, n, a = 0) {
			let o = Li.get(e.id);
			if (!o || a > 2) return;
			let s = e._cardScale || 1, c = ea(e) || (Number.isFinite(T.labelMinFontSize) ? T.labelMinFontSize : 14), l = Oo(p.node()), u = (0, lc.readableZoom)(l.k, (0, lc.titleScreenPx)(c, l.k, s), $i, Io);
			if (Vn() && (u = Math.min(u, Math.max(l.k, Zn()))), !(u > l.k * 1.000000001)) return;
			let [d, f] = Ro(), m = (0, rc.zoomAbout)(l, u / l.k, d, f), h = parseFloat(o.wrapper.style.width) || T.width, g = parseFloat(o.wrapper.style.height) || T.height, _ = ko(i), v = (0, lc.keepUnderFinger)({
				finger: Number.isFinite(t) && Number.isFinite(n) ? {
					x: t,
					y: n
				} : null,
				before: ra(e, l),
				after: ra(e, m),
				ratio: u / l.k,
				half: {
					w: h / 2 * u * s,
					h: g / 2 * u * s
				},
				area: {
					x0: 0,
					y0: _.top,
					x1: r,
					y1: i - _.bottom
				}
			}), y = Do.translate(m.x + v.x, m.y + v.y).scale(m.k);
			C = !0, D = !1, p.transition("key-zoom").duration(320).ease(qi).call(Le.transform, y, [d, f]).on("end", () => setTimeout(() => {
				ta(e) < $i && ia(e, t, n, a + 1);
			}, 80));
		}
		function aa(e) {
			Zi = Date.now(), N.current && N.current(e.originalItem || e);
		}
		function oa(e, t) {
			V.current.has(e.id) ? (V.current.delete(e.id), L.current && L.current.setNodePinned(be(e), !1), Ui(e), t.style.zIndex = "", F.current === e.id && I(null)) : (V.current.add(e.id), I(e), L.current && L.current.setNodePinned(be(e), !0), Ui(e), Ci.filter((t) => t.id === e.id).raise(), Ri.filter((t) => t.id === e.id).raise(), t.style.zIndex = 10, Xi(e).then(() => {
				V.current.has(e.id) && Ui(e);
			}));
		}
		function sa(e, t) {
			let n = typeof window < "u" ? window.TTS : null;
			if (!n || e.link || e.type !== "article") return;
			let r = () => t.querySelector(".rp-scroll");
			if (V.current.has(e.id)) {
				(0, Yo.toggleListen)(n, r());
				return;
			}
			oa(e, t), Xi(e).then(() => {
				V.current.has(e.id) && (d(() => Ui(e)), (0, Yo.toggleListen)(n, r()));
			});
		}
		function ca(e) {
			let t = typeof window < "u" ? window.TTS : null;
			t && (0, Yo.stopListening)(t, e.querySelector(".rp-scroll"));
		}
		let la = null, da = null, fa = null;
		function pa() {
			Ci.select(".tag-forms").style("display", (e) => e && (e.id === la || e.id === fa) ? null : "none");
		}
		Ci.filter((e) => e.type === "tag").on("mouseenter", (e, t) => {
			fa = t.id, pa();
		}).on("mouseleave", (e, t) => {
			fa === t.id && (fa = null, pa());
		}), Ci.filter((e) => e.type !== "article").on("click", (e, t) => {
			e.stopPropagation(), $e(e, () => ma(t));
		});
		function ma(e, { chosen: t = null } = {}) {
			let n = t ? t.id : e.id, r = la === e.id && (!t || da === n);
			la = r ? null : e.id, da = r ? null : n, Aa = !1, Ua({ force: !0 }), pa(), _a();
		}
		function ha() {
			if (!la) {
				Ci.classed("dimmed", !1).classed("tag-active", !1), Ri.classed("dimmed", !1), ii.classed("highlighted", !1), ga(null);
				return;
			}
			let e = la, t = new Set(o.links.filter((t) => {
				let n = typeof t.source == "object" ? t.source.id : t.source, r = typeof t.target == "object" ? t.target.id : t.target;
				return n === e || r === e;
			}).map((t) => {
				let n = typeof t.source == "object" ? t.source.id : t.source, r = typeof t.target == "object" ? t.target.id : t.target;
				return n === e ? r : n;
			}));
			t.add(e);
			for (let e of ja) t.add(e.id);
			Ci.classed("dimmed", (e) => !t.has(e.id)), Ci.classed("tag-active", (t) => t.id === e), Ri.classed("dimmed", (e) => !t.has(e.id)), ii.classed("highlighted", (t) => {
				let n = typeof t.source == "object" ? t.source.id : t.source, r = typeof t.target == "object" ? t.target.id : t.target;
				return n === e || r === e;
			}), ga(new Set([e, ...ja.map((e) => e.id)]));
		}
		function ga(e) {
			let t = (t) => !!(e && e.has(t));
			Ci.classed("tag-shown", (e) => e.type === "tag" && t(e.id)), S.selectAll(".link-to-tag").classed("link-tag-shown", (e) => {
				let n = W.get(Sr(e.source)), r = W.get(Sr(e.target)), i = (e) => !e || e.type !== "tag" || t(e.id);
				return i(n) && i(r);
			});
		}
		function _a() {
			typeof window > "u" || window.dispatchEvent(new CustomEvent("graph:tag-changed", { detail: { id: la } }));
		}
		p.on("click", (e) => {
			let t = Ze(e);
			$e(e, () => qe(c("space", "tap"), t));
		});
		function va() {
			Si(), la && (la = null, da = null, Aa = !1, Ua({ force: !0 }), pa(), _a()), N.current && N.current(null);
		}
		function ya() {
			ii.each(function(e) {
				e._path = Qr(e, Zr(e)), U(this).attr("d", e._path);
			}), ri.attr("d", (e) => e._path || ""), di.attr("d", (e) => e._path || ""), ui(), hi && vi();
		}
		function ba() {
			Gn(), ya(), Ci.attr("transform", (e) => {
				let t = Yn(e);
				return "translate(" + t.x + "," + t.y + ")" + Ne();
			}), Ri && Ri.style("transform", (e) => {
				let t = Yn(e);
				return `translate3d(${t.x}px, ${t.y}px, 0px) rotate(var(--gv-unrot, 0deg))${e._cardScale && e._cardScale !== 1 ? ` scale(${e._cardScale})` : ""}`;
			}), zr(), le.current && le.current(), ve.current && ve.current(), ye.current && ye.current({ paintOnly: !0 }), Ca();
		}
		let xa = null;
		function Sa() {
			if (xa = null, typeof document > "u") return;
			let e = document.querySelector("[data-rights][data-rights-position=\"bottom-edge\"]");
			if (!e) return;
			let t = [];
			Ri && Ri.each(function(e) {
				e._closedHidden || this.style.display === "none" || t.push(this.getBoundingClientRect());
			});
			let n = (0, vc.rightsOverCards)(e.getBoundingClientRect(), t);
			n !== e.hasAttribute("data-rights-over") && e.toggleAttribute("data-rights-over", n);
		}
		function Ca() {
			xa || typeof requestAnimationFrame > "u" || (xa = requestAnimationFrame(Sa));
		}
		function wa() {
			let e = L.current;
			return !!(e && e.preference && e.preference("readers") === !0);
		}
		let Ta = [];
		function Ea() {
			ai.selectAll("*").remove(), Ta = (0, gc.connectionEdges)(_e.current).map((e) => {
				let t = W.get(e.source), n = W.get(e.target);
				if (!t || !n) return null;
				let r = ai.append("g").attr("class", "readers-edge").attr("data-readers-edge", e.id);
				return r.append("title").text(`From a reader, ${e.author}: ${e.label}`), {
					...e,
					l: {
						source: t,
						target: n,
						layer: "contribution"
					},
					el: r,
					line: r.append("path").attr("class", "readers-line link-contribution").attr("fill", "none").attr("data-label", e.label)
				};
			}).filter(Boolean);
		}
		function Da({ rebuild: e = !1 } = {}) {
			e && Ea();
			let t = wa();
			if (ai.style("display", t && Ta.length ? null : "none").attr("data-on", t ? "true" : "false"), t) for (let e of Ta) {
				let t = Zr(e.l), n = t.hidden ? "" : `M ${t.x1} ${t.y1} L ${t.x2} ${t.y2}`;
				e.line.attr("d", n);
			}
		}
		ve.current = Da, Ea();
		let Oa = /* @__PURE__ */ new Map();
		Ci.each(function(e) {
			Oa.set(e.id, this);
		});
		let ka = new Map(Ai.map((e) => [e.d.id, e])), Aa = !1, ja = [], Ma = "";
		function Na(e) {
			let t = W.get(e);
			if (!t || t.type !== "tag" || t._groupedInto) return !1;
			let n = Oa.get(e);
			return !!(n && n.style.display !== "none");
		}
		function Pa(e) {
			let t = W.get(e);
			return t && t._groupedInto ? t._groupedInto : e;
		}
		function Fa() {
			let e = L.current;
			return (0, wc.foldedChoice)(e && e.preference ? e.preference(wc.FOLDED_PREF) : null);
		}
		function Ia() {
			let e = re();
			return e === null ? null : (0, Oc.shownAt)(Ic(o.links, W), e).hiddenTags;
		}
		function Ra() {
			let e = da || la;
			if (!e || !o.relations.length || !Na(Pa(e))) return null;
			let t = Ia();
			return (0, wc.drawnRelativesOf)(o.relations, e, {
				visible: Na,
				present: t ? (e) => !t.has(e) : void 0,
				bubbleOf: Pa,
				folded: Fa(),
				limit: Aa ? Infinity : wc.STRONGEST
			});
		}
		function za(e, t, n) {
			let r = ka.get(e);
			if (!r) return 0;
			let i = (Number(r.rectEl.attr("width")) || 0) / 2 + 2, a = (Number(r.rectEl.attr("height")) || 0) / 2 + 2, o = B * Math.PI / 180, s = t * Math.cos(o) - n * Math.sin(o), c = t * Math.sin(o) + n * Math.cos(o);
			return Math.min(Math.abs(s) > 1e-4 ? i / Math.abs(s) : Infinity, Math.abs(c) > 1e-4 ? a / Math.abs(c) : Infinity);
		}
		function Va(e) {
			if (hi && hi.layer === "relation" && Si(), oi.selectAll("*").remove(), si.selectAll("*").remove(), ja = [], wi.style("display", "none"), !e || !e.relatives.length) {
				oi.style("display", "none");
				return;
			}
			oi.style("display", null);
			for (let t of e.relatives) {
				let n = t.broader === e.from ? t.id : e.from, r = n === e.from ? t.id : e.from, i = [...new Set(t.relations.map((e) => e.layer))], a = {
					source: W.get(n),
					target: W.get(r),
					layer: "relation",
					directed: t.broader !== null,
					label: (0, wc.relativeLabel)(t)
				}, o = oi.append("path").attr("class", ["relation-line", ...i.map((e) => `relation-${e}`)].join(" ")).attr("fill", "none").attr("data-relation", t.id).attr("data-relation-types", i.join(" ")).attr("data-relation-folded", t.members ? t.members.map((e) => e.id).join("|") : null).attr("marker-end", a.directed ? "url(#relation-arrow)" : null), s = si.append("path").attr("class", "relation-hit").attr("fill", "none").attr("data-relation", t.id).style("stroke", "transparent").style("stroke-width", "16px").style("pointer-events", "stroke").style("cursor", "default").on("mouseenter", function() {
					bi(a, this);
				}).on("mouseleave", () => {
					_i || Si();
				}).on("click", function(e) {
					e.stopPropagation();
					let t = this;
					$e(e, () => {
						bi(a, t), _i = setTimeout(() => {
							_i = null, Si();
						}, 2500);
					});
				});
				ja.push({
					id: t.id,
					l: a,
					line: o,
					hit: s
				});
			}
			let t = Aa ? Math.max(0, e.total - wc.STRONGEST) : e.more;
			t > 0 && (wi.attr("data-relation-more", Aa ? "all" : "strongest").attr("aria-expanded", Aa ? "true" : "false").attr("aria-label", Aa ? `${wc.STRONGEST} related tags` : `${e.total} related tags`).style("display", null), wi.select("text").text(`${Aa ? "−" : "+"}${t}`));
		}
		function Ha() {
			if (!ja.length) return;
			for (let e of ja) {
				let t = e.l.source, n = e.l.target, r = "";
				if (t && n) {
					let e = Yn(t), i = Yn(n), a = i.x - e.x, o = i.y - e.y, s = Math.hypot(a, o);
					if (s > 1) {
						let c = a / s, l = o / s, u = za(t.id, c, l), d = za(n.id, c, l);
						s > u + d + 2 && (r = `M ${e.x + c * u} ${e.y + l * u} L ${i.x - c * d} ${i.y - l * d}`);
					}
				}
				e.line.attr("d", r), e.hit.attr("d", r);
			}
			let e = la ? W.get(la) : null;
			if (e && wi.style("display") !== "none") {
				let t = Te.current || 1, n = ka.get(e.id), r = Math.max(E.fontSize * .6, 12 / t), i = (wi.select("text").text().length * .62 + 1.6) * r, a = r * 1.6, o = (n ? (Number(n.rectEl.attr("y")) || 0) + (Number(n.rectEl.attr("height")) || 0) : E.fontSize) + a / 2 + 4 / t;
				wi.select("rect").attr("x", -i / 2).attr("y", -a / 2).attr("width", i).attr("height", a).attr("rx", a / 2).attr("stroke-width", 1 / t), wi.select("text").attr("font-size", r);
				let s = Yn(e);
				wi.attr("transform", `translate(${s.x}, ${s.y})${Ne()} translate(0, ${o})`);
			}
			hi && hi.layer === "relation" && vi();
		}
		function Ua({ force: e = !1, paintOnly: t = !1 } = {}) {
			if (e || !t) {
				da && Pa(da) !== la && (la = Pa(da), pa(), _a());
				let t = Ra(), n = t ? [
					la,
					da,
					Aa ? "all" : "strongest",
					t.more,
					...t.relatives.map((e) => `${e.id}>${e.broader || ""}${e.members ? `=${e.members.map((e) => e.id).join(",")}` : ""}`)
				].join("\0") : "";
				(e || n !== Ma) && (Ma = n, Va(t), ha());
			}
			Ha();
		}
		function Wa(e) {
			e && (e.stopPropagation(), e.preventDefault()), Aa = !Aa, Ua({ force: !0 });
		}
		wi.attr("tabindex", 0).on("click", (e) => Wa(e)).on("dblclick", (e) => {
			e.stopPropagation(), e.preventDefault();
		}).on("keydown", (e) => {
			(e.key === "Enter" || e.key === " ") && Wa(e);
		}), ye.current = Ua;
		let Ga = w.roots ? w.roots === !0 ? {} : w.roots : null, Ka = [], qa = null, Ja = !1;
		if (Ga) {
			let e = /* @__PURE__ */ new Map();
			for (let [t, n] of xt) for (let r of n) e.set(r, t);
			let t = o.links.filter((e) => e.layer === "sequence").map((e) => ({
				source: Sr(e.source),
				target: Sr(e.target)
			})), n = (o.containers || []).find((e) => !e.parent), r = String(Ga.seed || n && n.id || "roots");
			Ka = (0, fc.rootSegments)({
				containers: o.containers || [],
				memberOf: e,
				sequence: t
			}).map((e) => {
				let t = vt.append("g").attr("class", "root").attr("data-root", e.key).style("display", "none");
				return {
					...e,
					shape: (0, fc.rootShape)(r + "|" + e.key),
					el: t,
					main: t.append("path").attr("class", "root-main").attr("fill", "none").attr("vector-effect", "non-scaling-stroke"),
					fine: t.append("path").attr("class", "root-fine").attr("fill", "none").attr("vector-effect", "non-scaling-stroke"),
					state: "hidden"
				};
			});
		}
		function Qa(e) {
			if (e.node) {
				let t = W.get(e.node);
				if (!t || !Number.isFinite(t.x) || Br.has(t.id) || t._source && De.current.has(t._source.id)) return null;
				let n = Yn(t);
				return {
					x: n.x,
					y: n.y
				};
			}
			return Ft.get(e.container) || null;
		}
		function $a(e) {
			let t = L.current;
			if (!t || !t.readingProgress) return "hidden";
			let n = (e) => {
				let n = W.get(e);
				return n ? t.readingProgress(be(n)) : {
					seen: !1,
					done: !1
				};
			};
			if (e.node) {
				let t = n(e.node);
				return t.done ? "done" : t.seen || t.max > 0 ? "seen" : "hidden";
			}
			let r = Ct(e.container).map(n);
			return !r.length || !r.some((e) => e.seen || e.max > 0) ? "hidden" : r.every((e) => e.done) ? "done" : "seen";
		}
		function eo() {
			if (qa = null, Ka.length) {
				for (let e of Ka) {
					let t = $a(e.reach), n = Qa(e.from), r = Qa(e.to);
					if (t === "hidden" || !n || !r) {
						e.el.style("display", "none"), t === "hidden" && (e.state = "hidden");
						continue;
					}
					let i = (0, fc.rootPath)(n, r, e.shape);
					if (e.main.attr("d", i.main), e.fine.attr("d", i.fine), e.el.style("display", null).attr("data-state", t), e.state === "hidden" && Ja) {
						for (let t of [e.main, e.fine]) {
							t.attr("pathLength", 1).style("stroke-dasharray", "1 1").style("stroke-dashoffset", 1).style("transition", "none");
							let e = t.node();
							e && e.getBoundingClientRect(), t.style("transition", "stroke-dashoffset 1.8s ease-out").style("stroke-dashoffset", 0);
						}
						setTimeout(() => {
							for (let t of [e.main, e.fine]) t.attr("pathLength", null).style("stroke-dasharray", null).style("stroke-dashoffset", null).style("transition", null);
						}, 1900);
					}
					e.state = t;
				}
				Ja = !0;
			}
		}
		function no() {
			!Ka.length || qa || (qa = typeof requestAnimationFrame < "u" ? requestAnimationFrame(eo) : setTimeout(eo, 16));
		}
		le.current = Ga ? no : null;
		let ro = !1;
		ae.current = {
			data: o,
			nodes: Ci,
			articleNodes: Ri,
			links: ii,
			applyPositions: ba,
			svg: p,
			zoom: Le,
			fitToViewport: jo,
			simulation: H,
			axisLayer: _t,
			g: S,
			updateContainers: zr,
			ringTargets: Ir,
			recomputeContainers: Lr,
			toScreen: Ie,
			drawnAt: Yn
		}, ke = !0;
		function io() {
			if (Nn = typeof window < "u" && window.PostPipeCoverFrame || null, !Pn()) return;
			H.force("center", null);
			let e = [...Mn.keys()].filter((e) => $n.has(e) || !rr(e));
			if (On()) {
				Tn(), Cr();
				for (let t of e) sr(t);
			}
			let t = dr();
			e.length && ur(e), (e.length || t) && ba(), C || Ao(!1);
		}
		window.addEventListener("postpipe:cover-frame", io), io();
		let ao = () => Ca();
		window.addEventListener("postpipe:cover", ao), window.addEventListener("resize", ao);
		let oo = !1, so = new Map(o.nodes.map((e) => [e.id, e]));
		function co() {
			if (oo || R.current !== "force") return !1;
			let e = [];
			for (let t of o.nodes) {
				if (t.type !== "article" || !V.current.has(t.id) || t._closedHidden || !Number.isFinite(t.x) || !Number.isFinite(t.y)) continue;
				let n = t._size || ie({
					hovered: !1,
					pinned: !0
				}), r = t._cardScale || 1;
				e.push({
					id: t.id,
					x: t.x,
					y: t.y,
					w: n.width * r,
					h: n.height * r
				});
			}
			if (e.length < 2) return !1;
			let t = (0, dc.separateOpen)(e, { gap: 12 });
			for (let [e, n] of t) {
				let t = so.get(e);
				t && (t.x = n.x, t.y = n.y, t.vx = 0, t.vy = 0, t.fx != null && (t.fx = n.x), t.fy != null && (t.fy = n.y));
			}
			return t.size > 0;
		}
		let lo = 0;
		H.nodes(o.nodes).on("tick", () => {
			co(), ba(), ro ||= jo({ initialZoomOut: !0 }), z.current && z.current(), ++lo, se.current && lo % 25 == 0 && se.current();
		}), Pr(o.links);
		let fo = e && e._rtagz, po = Ai.filter((e) => e.d.type === "tag" && e.d.concept), mo = o.links.filter((e) => e.layer === "tag"), ho = {
			scheme: bc.SITE_SCHEME,
			depth: 0
		}, _o = new Set((0, bc.schemesOf)(e).map((e) => e.id)), vo = () => {
			let e = L.current, t = e && e.preference ? e.preference("conceptScheme") : null, n = e && e.preference ? Number(e.preference("broaderDepth")) : 0;
			return {
				scheme: typeof t == "string" && t && _o.has(t) ? t : bc.SITE_SCHEME,
				depth: Number.isFinite(n) ? Math.max(0, Math.min(2, Math.round(n))) : 0
			};
		}, yo = (e) => Number.isFinite(e) && e > 0 ? e : 0;
		function bo(e, t, n) {
			let { d: r, el: i, textEl: a, fontSize: o } = e, s = t || r.label, c = (Fi(r) || []).join("\0");
			if (r._shownLabel === s && !!e.fallback == !!n && e.membersKey === c) return;
			e.membersKey = c, r._shownLabel = s, e.fallback = !!n;
			let l = Pi(), u = Mi(s, l.widthOf);
			l.remove(), a.selectAll("tspan").remove(), u.forEach((e) => {
				a.append("tspan").attr("x", 0).text(e);
			}), e.lines = u, e.lineH = Ni(u, o), i.classed("tag-fallback", e.fallback), e.formsEl && e.formsEl.remove(), e.formsEl = Ii(i, r, o), ji(e);
		}
		let xo = (e) => mo.filter((t) => Sr(t._origTarget || t.target) === e).length;
		function So() {
			let e = !1, t = R.current === "force", n = L.current;
			for (let e of mo) e._origTarget !== void 0 && (e.target = e._origTarget, delete e._origTarget, delete e._dupByGroup);
			for (let r of o.nodes) {
				let i = !1;
				if (r._groupedInto && (e = !0, i = !0, delete r._groupedInto, r._groupSaved && (t && (r.fx = r._groupSaved.fx, r.fy = r._groupSaved.fy), delete r._groupSaved)), r._groupKey && (e = !0, i = !0, delete r._groupKey, r._preGroupPos)) {
					let e = r._preGroupPos;
					t && (r.x = e.x, r.y = e.y, r.fx = e.fx, r.fy = e.fy), delete r._preGroupPos;
				}
				if (i && !t && n && n.nodeState) {
					let e = n.nodeState(Ce(r));
					e && Number.isFinite(e.x) && Number.isFinite(e.y) && (r.x = e.x, r.y = e.y, r.fx = e.x, r.fy = e.y);
				}
			}
			return e;
		}
		function wo({ scheme: e, depth: t }) {
			if (!po.length) return;
			let n = So(), r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
			for (let n of po) {
				let a = (0, bc.labelFor)(fo, n.d.concept, {
					scheme: e,
					depth: t,
					systems: n.d.systems
				});
				r.set(n.d.id, a);
				let o = a.groupId || n.d.concept;
				i.has(o) || i.set(o, []), i.get(o).push(n.d);
			}
			let a = !1, s = L.current;
			for (let [e, n] of yo(t) > 0 ? i : []) {
				if (n.length === 1 && n[0].concept === e) continue;
				a = !0;
				let t = n.filter((t) => t.concept === e), r = (t.length ? t : n).slice().sort((e, t) => xo(t.id) - xo(e.id) || (e.id < t.id ? -1 : +(e.id > t.id)))[0];
				r._preGroupPos = {
					x: r.x,
					y: r.y,
					fx: r.fx,
					fy: r.fy
				}, r._groupKey = "concept:" + e;
				let i = s && s.nodeState ? s.nodeState(Se(R.current) + r._groupKey) : null;
				if (i && Number.isFinite(i.x) && Number.isFinite(i.y)) r.x = i.x, r.y = i.y, (!i.auto || r.fx != null) && (r.fx = i.x, r.fy = i.y);
				else {
					let e = Nc(n);
					e && (r.x = e.x, r.y = e.y, r.fx != null && (r.fx = e.x, r.fy = e.y));
				}
				let o = new Set(mo.filter((e) => Sr(e.target) === r.id).map((e) => Sr(e.source)));
				for (let e of n) if (e !== r) {
					e._groupedInto = r.id, e._groupSaved = {
						fx: e.fx,
						fy: e.fy
					}, e.fx = e.x, e.fy = e.y;
					for (let t of mo) {
						if (Sr(t.target) !== e.id) continue;
						t._origTarget = t.target, t.target = r;
						let n = Sr(t.source);
						o.has(n) ? t._dupByGroup = !0 : o.add(n);
					}
				}
			}
			for (let e of po) {
				if (e.d._groupedInto) continue;
				let t = r.get(e.d.id);
				bo(e, t.label, t.fallback && t.label);
			}
			n || a ? (Pr(o.links.filter((e) => !e._dupByGroup)), ii.attr("data-label", (e) => e.label), H.force("charge").strength(H.force("charge").strength()), H.force("collide").radius(H.force("collide").radius()), Bc(p, y, De.current, ee, te(), re()), ba(), H.alpha(Math.max(H.alpha(), .3)).restart()) : (H.force("collide").radius(H.force("collide").radius()), ba());
		}
		if (de.current = () => {
			let e = vo();
			e.scheme === ho.scheme && e.depth === ho.depth || (ho = e, wo(e));
		}, po.length) {
			let e = vo();
			(e.scheme !== bc.SITE_SCHEME || e.depth !== 0) && (ho = e, wo(e));
		}
		co(), ro ||= jo({ initialZoomOut: !0 }), ba();
		function To() {
			if (!jn() || G.roots.length === 0) return null;
			let e = [], t = Pn();
			if (t) for (let t of Mn.keys()) {
				let n = G.containers.get(t), r = n && An(t);
				!r || Rr(yn.get(t)) || e.push({
					x0: r.x + n.box.x0,
					y0: r.y + n.box.y0,
					x1: r.x + n.box.x1,
					y1: r.y + n.box.y1
				});
			}
			for (let n of G.roots) {
				let r = G.containers.get(n), i = kn(n);
				!r || !i || t && Ct(n).every((e) => Fn.has(e)) || Ct(n).every((e) => De.current.has(W.get(e)?._source?.id)) || e.push({
					x0: i.x + r.box.x0,
					y0: i.y + r.box.y0,
					x1: i.x + r.box.x1,
					y1: i.y + r.box.y1
				});
			}
			for (let t of o.nodes) {
				if (t.type !== "article" || G.nodes.has(t.id) || !Number.isFinite(t.x) || t._source && De.current.has(t._source.id)) continue;
				let n = (t._size?.width || T.width) / 2, r = (t._size?.height || T.height) / 2;
				e.push({
					x0: t.x - n,
					y0: t.y - r,
					x1: t.x + n,
					y1: t.y + r
				});
			}
			return e.length ? {
				x0: Math.min(...e.map((e) => e.x0)),
				y0: Math.min(...e.map((e) => e.y0)),
				x1: Math.max(...e.map((e) => e.x1)),
				y1: Math.max(...e.map((e) => e.y1))
			} : null;
		}
		function Eo() {
			if (!D || !jn()) return null;
			let e = w.initialFocus, t = G.containers.get(e), n = yn.get(e);
			if (!t || !n || Nt.has(e) || Rr(n)) return null;
			let r = An(e);
			if (!r) return null;
			let i = {
				x0: r.x + t.box.x0,
				y0: r.y + t.box.y0,
				x1: r.x + t.box.x1,
				y1: r.y + t.box.y1
			}, a = G.containers.get(t.root), o = a && kn(t.root), s = o ? {
				x0: o.x + a.box.x0,
				y0: o.y + a.box.y0,
				x1: o.x + a.box.x1,
				y1: o.y + a.box.y1
			} : null, c = (e, t) => {
				if (!e) return e;
				let n = { ...e };
				for (let e of Ct(t)) {
					let t = W.get(e);
					if (!t || t.type !== "article" || t._closedHidden || !Number.isFinite(t.x) || !Number.isFinite(t.y)) continue;
					let r = t._size || ie({
						hovered: !1,
						pinned: V.current.has(t.id)
					}), i = t._cardScale || 1, a = r.width / 2 * i, o = r.height / 2 * i;
					n.x0 = Math.min(n.x0, t.x - a), n.x1 = Math.max(n.x1, t.x + a), n.y0 = Math.min(n.y0, t.y - o), n.y1 = Math.max(n.y1, t.y + o);
				}
				return n;
			};
			return {
				box: c(i, e),
				root: c(s, t.root)
			};
		}
		function ko(e) {
			let t = {
				top: 0,
				bottom: 0
			};
			if (typeof document > "u" || !A.current) return t;
			let n = A.current.getBoundingClientRect(), r = 0, i = 0;
			for (let t of document.querySelectorAll("[data-feeds], [data-settings-gear], [data-rights], [data-toolbar]")) {
				let a = t.getBoundingClientRect();
				!a.width || !a.height || (a.top >= n.top + e / 2 ? i = Math.max(i, n.top + e - a.top) : a.bottom <= n.top + e / 2 && (r = Math.max(r, a.bottom - n.top)));
			}
			return {
				top: Math.max(0, Math.min(e / 4, r)),
				bottom: Math.max(0, Math.min(e / 3, i))
			};
		}
		function Ao(e, { resetRot: t = !1, recordRot: n = !1 } = {}) {
			let r = (0, mc.homeView)(oe), i = Do.translate(r.x, r.y).scale(r.k);
			je = r.k, t && Ke({
				repaint: !1,
				record: n
			});
			let a = Vn() ? Un() : Be();
			return e ? p.transition().duration(750).call(Le.transform, i, a || void 0) : p.call(Le.transform, i), _r(), !0;
		}
		function jo({ animate: e = !1, initialZoomOut: t = !1, focus: n = !0, resetRot: r = !1, recordRot: i = !1 } = {}) {
			if (n && Pn()) return Ao(e, {
				resetRot: r,
				recordRot: i
			});
			let a = Mo({
				animate: e,
				initialZoomOut: t,
				focus: n,
				resetRot: r,
				recordRot: i
			});
			return a && n && (je = a, _r()), !!a;
		}
		function Mo({ animate: e = !1, initialZoomOut: t = !1, focus: n = !0, resetRot: r = !1, recordRot: i = !1 } = {}) {
			let a = To();
			if (a) {
				let t = A.current ? A.current.clientWidth : window.innerWidth, o = A.current ? A.current.clientHeight : window.innerHeight;
				if (t < 50 || o < 50) return !1;
				let s = ko(o);
				o -= s.top + s.bottom;
				let c = (e) => Math.min((t - 48) / Math.max(e.x1 - e.x0, 1), (o - 48) / Math.max(e.y1 - e.y0, 1), 1), l = n ? Eo() : null, u = a, d = c(a), f = !1;
				l && (d = c(l.box), u = l.box, l.root && c(l.root) >= Math.min(d, P) ? (u = l.root, d = c(l.root)) : d < P && (d = P, f = (l.box.y1 - l.box.y0) * d > o - 48), d < ne && (d = ne, u = l.box, f = (l.box.y1 - l.box.y0) * d > o - 48)), d = Math.max(d, .04);
				let m = (u.x0 + u.x1) / 2, h = f ? Math.max(s.top + 24, 56) - u.y0 * d : s.top + o / 2 - (u.y0 + u.y1) / 2 * d, g = Do.translate(t / 2 - m * d, h).scale(d);
				return r && Ke({
					repaint: !1,
					record: i
				}), e ? p.transition().duration(750).call(Le.transform, g) : p.call(Le.transform, g), g.k;
			}
			let s = o.nodes.filter((e) => e.type === "article");
			if (s.length < 2) return !1;
			let c = (e) => {
				let t = [...e].sort((e, t) => e - t), n = Math.floor(t.length / 2);
				return t.length % 2 ? t[n] : (t[n - 1] + t[n]) / 2;
			}, l = (e) => {
				let t = [...e].sort((e, t) => e - t);
				return [t[Math.floor(t.length * .1)], t[Math.ceil(t.length * .9) - 1]];
			}, u = s.map((e) => e.x), d = s.map((e) => e.y), [f, m] = l(u), [h, g] = l(d), _ = f - 140, v = m + 140, y = h - 140, b = g + 140, x = c(u), S = c(d), C = A.current ? A.current.clientWidth : window.innerWidth, w = A.current ? A.current.clientHeight : window.innerHeight;
			if (C < 50 && (C = window.innerWidth), w < 50 && (w = window.innerHeight), C < 50 || w < 50) return !1;
			let T = .2, E = ko(w), D = Math.max(50, w - E.top - E.bottom), O = Math.max(Math.min(C / Math.max(v - _, 1), D / Math.max(b - y, 1), 1), T);
			t && (dt ? O = T * .85 : O *= .85);
			let k = C / 2 - x * O, j = E.top + D / 2 - S * O, M = Do.translate(k, j).scale(O);
			return r && Ke({
				repaint: !1,
				record: i
			}), e ? p.transition().duration(750).call(Le.transform, M) : p.call(Le.transform, M), M.k;
		}
		let No = !1;
		Nt.size && (Vr(), zr()), H.on("end", () => {
			if (No = !0, R.current !== "force" || (co() && ba(), oo = !0, o.nodes.forEach((e) => {
				e.fx = e.x, e.fy = e.y, e._forcePos = {
					x: e.x,
					y: e.y
				};
			}), C || jo({ animate: !0 }), (0, Js.layoutIsDegenerate)(o.nodes, ie({
				hovered: !1,
				pinned: !1
			})))) return;
			let e = L.current;
			if (e) for (let t of o.nodes) !t.pinned && t._forcePos && e.setNodePosition(Se("force") + be(t), t.x, t.y, { silent: !0 });
			se.current && se.current();
		});
		let Po = () => {
			if (!document.hidden) {
				if (!No) {
					H.alpha(.8).restart();
					return;
				}
				ro ||= jo({ initialZoomOut: !0 });
			}
		};
		document.addEventListener("visibilitychange", Po);
		let Fo = 1.25, Io = 8, Ro = () => Vn() ? Un() : Be() || [r / 2, i / 2];
		function zo(e, t = !0) {
			if (!Number.isFinite(e) || e <= 0) return;
			let n = Oo(p.node()), r = Math.max(.04, Math.min(8, n.k * e));
			if (r > n.k && Vn() && (r = Math.min(r, Math.max(n.k, Zn()))), Math.abs(r - n.k) <= 1e-9 * n.k) return;
			let [i, a] = Ro(), o = (0, rc.zoomAbout)(n, r / n.k, i, a), s = Do.translate(o.x, o.y).scale(o.k);
			C = !0, D = !1, t ? p.transition("key-zoom").duration(260).ease(qi).call(Le.transform, s, [i, a]) : p.call(Le.transform, s);
		}
		let K = () => {
			D = !1;
			let e = To() || Vo(), t = ko(i), n = {
				x0: 24,
				y0: t.top + 24,
				x1: r - 24,
				y1: i - t.bottom - 24
			};
			if (Vn()) {
				let e = A.current ? A.current.getBoundingClientRect() : {
					left: 0,
					top: 0
				}, t = [];
				for (let n of Mn.keys()) {
					let r = yn.get(n);
					if (!r || Rr(r)) continue;
					let i = Tt.filter((e) => e.id === n).select(Nt.has(n) ? ".container-macro-bg" : ".container-hull").node();
					if (!i || !(i.getAttribute("d") || "").length) continue;
					let a = i.getBoundingClientRect();
					if (!a.width || !a.height) continue;
					let o = Wn(n);
					if (!o) continue;
					let s = Jn(r);
					t.push({
						box: {
							x0: a.left - e.left,
							y0: a.top - e.top,
							x1: a.right - e.left,
							y1: a.bottom - e.top
						},
						at: (() => {
							let e = Ie(o.x + s.x, o.y + s.y);
							return {
								x: e[0],
								y: e[1]
							};
						})()
					});
				}
				let r = (0, ic.growFitRatio)(t, n);
				if (r && r > .02) {
					zo(r);
					return;
				}
				Ao(!0, {
					resetRot: !0,
					recordRot: !0
				});
				return;
			}
			if (e) {
				let t = [
					[e.x0, e.y0],
					[e.x1, e.y0],
					[e.x0, e.y1],
					[e.x1, e.y1]
				].map(([e, t]) => Ie(e, t)), r = {
					x0: Math.min(...t.map((e) => e[0])),
					x1: Math.max(...t.map((e) => e[0])),
					y0: Math.min(...t.map((e) => e[1])),
					y1: Math.max(...t.map((e) => e[1]))
				}, [i, a] = Ro(), o = (0, rc.fitRatioAbout)(r, i, a, n);
				if (o && o > .02) {
					zo(o);
					return;
				}
			}
			jo({
				animate: !0,
				focus: !1,
				resetRot: !0,
				recordRot: !0
			});
		};
		function Vo() {
			let e = o.nodes.filter((e) => !e._closedHidden && Number.isFinite(e.x));
			return e.length ? {
				x0: _(e, (e) => e.x) - 40,
				y0: _(e, (e) => e.y) - 40,
				x1: g(e, (e) => e.x) + 40,
				y1: g(e, (e) => e.y) + 40
			} : null;
		}
		let Ho = (e) => {
			if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
			let t = e.target;
			if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) || typeof window < "u" && window.PostPipeCover && window.PostPipeCover.state && window.PostPipeCover.state !== "graph" || document.querySelector("[data-settings-panel]")) return;
			let n = e.key === "+" || e.key === "=", r = e.key === "-" || e.key === "_";
			!n && !r || (e.preventDefault(), zo(n ? Fo : 1 / Fo));
		};
		window.addEventListener("keydown", Ho);
		let Uo = () => {
			o.nodes.forEach((e) => {
				if (e._groupedInto) {
					e._groupSaved &&= {
						fx: null,
						fy: null
					};
					return;
				}
				e.fx = null, e.fy = null, delete e._forcePos;
			});
			let e = L.current;
			if (e) for (let t of o.nodes) {
				let n = Ce(t);
				e.nodeState(n) && e.setNodePosition(n, t.x, t.y, { silent: !0 });
			}
			H.alpha(.8).restart();
		}, Wo = () => {
			let e = ie({
				hovered: !1,
				pinned: !1
			});
			o.nodes.forEach((e) => {
				delete e._size;
			});
			let t = L.current;
			if (t) for (let n of o.nodes) t.setNodeSize(be(n), e.width, e.height, { silent: !0 });
			ba();
		}, Go = () => {
			let e = L.current;
			e && e.resetLayout && e.resetLayout(), Ke({ repaint: !1 }), o.nodes.forEach((e) => {
				e.fx = null, e.fy = null, delete e._forcePos;
			}), Pn() && (ur(), ba()), H.alpha(.8).restart(), jo({ animate: !0 });
		}, Ko = () => {
			let e = L.current;
			e && e.resetLayout && e.resetLayout({ prefs: [Ac.PREF] }), N.current && N.current(null), I(null), Si(), la = null, da = null, Aa = !1, Ua({ force: !0 }), fa = null, we.current = null, Ci.classed("dimmed", !1).classed("tag-active", !1), pa(), _a(), Ri.classed("dimmed", !1).style("z-index", null), ii.classed("highlighted", !1), V.current.clear(), o.nodes.forEach((e) => {
				delete e._size, delete e._customWidth, delete e._customHeight, delete e._forcePos, e.fx = null, e.fy = null;
			}), Nt.clear();
			for (let e of jt()) Nt.add(e);
			nr.clear(), Ke({ repaint: !1 }), C = !1, D = !!w.initialFocus && w.initialFocus !== "all", Gi(), Vr(), typeof window < "u" && window.dispatchEvent(new CustomEvent("graph:containers-changed", { detail: Ur() })), o.containers && o.containers.length && jn() ? (Pn() && ur(), Yr(), zr(), ba(), jo({ animate: !0 })) : (H.alpha(.8).restart(), jo({ animate: !0 }));
		}, qo = (e) => {
			let t = e && e.detail ? e.detail.id : null, n = o.nodes.find((e) => e.type === "tag" && e.id === t), a = n;
			if (n && n._groupedInto && (n = o.nodes.find((e) => e.id === n._groupedInto) || n), !n || (ma(n, { chosen: a }), la !== n.id || !Number.isFinite(n.x) || !Number.isFinite(n.y))) return;
			let s = Yn(n), [c, l] = Ie(s.x, s.y), u = ko(i);
			if (c >= 24 && c <= r - 24 && l >= u.top + 24 && l <= i - u.bottom - 24) return;
			let d = Oo(p.node()), f = r / 2 - c, m = (u.top + (i - u.bottom)) / 2 - l;
			C = !0, D = !1, p.transition("key-zoom").duration(320).ease(qi).call(Le.transform, Do.translate(d.x + f, d.y + m).scale(d.k));
		};
		window.addEventListener("graph:reset-all", Ko), window.addEventListener("graph:select-tag", qo), window.addEventListener("graph:zoom-to-fit", K), window.addEventListener("graph:unpin-all", Uo), window.addEventListener("graph:reset-sizes", Wo), window.addEventListener("graph:reset-layout", Go);
		let q = {
			"graph:open-container": (e) => qr.openContainer(e.detail && e.detail.id),
			"graph:close-container": (e) => qr.closeContainer(e.detail && e.detail.id),
			"graph:toggle-container": (e) => qr.toggleContainer(e.detail && e.detail.id),
			"graph:open-all-containers": () => qr.openAllContainers(),
			"graph:close-all-containers": () => qr.closeAllContainers()
		};
		for (let [e, t] of Object.entries(q)) window.addEventListener(e, t);
		return () => {
			ce.current = null, le.current = null, ue.current = null, de.current = null, pe.current = null, me.current = null, ve.current = null, ye.current = null, typeof window < "u" && delete window.PostPipeGraphTags, qa && typeof cancelAnimationFrame < "u" && cancelAnimationFrame(qa), tn && tn.disconnect(), H.stop(), document.removeEventListener("visibilitychange", Po), window.removeEventListener("resize", gt), n.removeEventListener("touchstart", Ue, { capture: !0 }), n.removeEventListener("touchmove", We, { capture: !0 }), n.removeEventListener("touchend", Ge, { capture: !0 }), n.removeEventListener("touchcancel", Ge, { capture: !0 }), n.removeEventListener("touchstart", at, { capture: !0 }), n.removeEventListener("touchmove", ot, { capture: !0 }), n.removeEventListener("touchend", st, { capture: !0 }), ut(), n.removeEventListener("click", nt, !0), n.removeEventListener("dblclick", nt, !0), Ye.cancel(), window.removeEventListener("graph:reset-all", Ko), window.removeEventListener("graph:select-tag", qo), window.removeEventListener("postpipe:cover-frame", io), window.removeEventListener("postpipe:cover", ao), window.removeEventListener("resize", ao), xa && typeof cancelAnimationFrame < "u" && cancelAnimationFrame(xa), window.PostPipeGraphWorld && window.PostPipeGraphWorld.snapshot === gr && delete window.PostPipeGraphWorld, window.removeEventListener("graph:zoom-to-fit", K), window.removeEventListener("keydown", Ho), window.removeEventListener("graph:unpin-all", Uo), window.removeEventListener("graph:reset-sizes", Wo), window.removeEventListener("graph:reset-layout", Go);
			for (let [e, t] of Object.entries(q)) window.removeEventListener(e, t);
			b && b.current === qr && (b.current = null), Li.forEach(({ root: e }) => {
				queueMicrotask(() => e.unmount());
			}), Li.clear();
		};
	}, [e, Ae]), r(() => {
		let e = ae.current;
		if (!e || !e.axisLayer) return;
		let t = m || {}, n = () => Me(e, t);
		se.current = t.on ? n : null, n();
	}, [
		m,
		C,
		e,
		Ae
	]);
	function Me(e, t) {
		if (e.axisLayer.selectAll("*").remove(), z.current = null, !t.on) {
			oe.current = !1;
			return;
		}
		let n = A.current, r = n ? n.clientWidth : window.innerWidth, i = n ? n.clientHeight : window.innerHeight;
		if (r < 60 || i < 60) return;
		let a = t.dock || D.dock, o = a === "left" || a === "right", s = D.endPadding, c = Number.isFinite(t.offset) ? t.offset : D.inset, l = a === "right" ? r - c : a === "bottom" ? i - c : c, u = Math.max((o ? i : r) - s * 2, 120), d = o ? {
			x: l,
			y: s
		} : {
			x: s,
			y: l
		}, f = (0, Js.dimensionAxisGeometry)(e.data.nodes, {
			orientation: o ? "ttb" : "ltr",
			origin: d,
			length: u,
			dimension: t.dimension || "time",
			granularity: t.granularity || "auto"
		});
		if (!f) return;
		let p = e.axisLayer.append("g").attr("class", "time-axis"), m = p.append("g").attr("class", "time-connectors"), h = [];
		e.data.nodes.forEach((e) => {
			let t = f.anchors[e.id];
			!t || !t.length || t.forEach((t) => {
				let n = m.append("line").attr("class", "time-connector").attr("data-node", e.id).attr("x1", t.x).attr("y1", t.y).attr("stroke", e._source && e._source.color || "#7f8ea3").attr("stroke-width", D.connectorWidth).attr("stroke-opacity", D.connectorOpacity);
				h.push({
					node: e,
					anchor: t,
					line: n
				});
			});
		});
		function g() {
			let t = Oo(e.svg.node());
			h.forEach(({ node: n, anchor: r, line: i }) => {
				i.style("display", n._closedHidden ? "none" : null);
				let a = e.drawnAt ? e.drawnAt(n) : n, o = e.toScreen ? e.toScreen(a.x, a.y) : t.apply([a.x, a.y]);
				i.attr("x1", r.x).attr("y1", r.y).attr("x2", o[0]).attr("y2", o[1]);
			});
		}
		z.current = g, g();
		let _ = p.append("g").attr("class", "time-spine").style("cursor", o ? "ew-resize" : "ns-resize");
		_.append("rect").attr("x", o ? l - 34 / 2 : 0).attr("y", o ? 0 : l - 34 / 2).attr("width", o ? 34 : r).attr("height", o ? i : 34).attr("fill", "rgba(18,20,28,0.82)"), _.append("line").attr("x1", f.from.x).attr("y1", f.from.y).attr("x2", f.to.x).attr("y2", f.to.y).attr("stroke", "rgba(255,255,255," + D.spineOpacity + ")").attr("stroke-width", D.spineWidth);
		let v = D.tickFontSize, y = f.ticks.length > 1 ? Math.hypot(f.ticks[1].x - f.ticks[0].x, f.ticks[1].y - f.ticks[0].y) : Infinity, b = o ? v * 1.7 : v * 4.2, x = Math.max(1, Math.ceil(b / Math.max(y, 1)));
		f.ticks.forEach((e, t) => {
			_.append("line").attr("x1", e.x).attr("y1", e.y).attr("x2", e.x + (o ? 9 : 0)).attr("y2", e.y + (o ? 0 : -9)).attr("stroke", "rgba(255,255,255,0.45)").attr("stroke-width", 1.5), t % x === 0 && _.append("text").attr("x", e.x + (o ? 13 : 0)).attr("y", e.y + (o ? 0 : -14)).attr("text-anchor", o ? "start" : "middle").attr("dominant-baseline", o ? "central" : "auto").style("font-family", "'Atkinson', sans-serif").style("font-size", v + "px").style("fill", "rgba(255,255,255,0.62)").style("pointer-events", "none").text(e.label);
		});
		let S = null, C = 0;
		_.call(Jt().on("start", (e) => {
			S = o ? e.x : e.y, C = 0;
		}).on("drag", (e) => {
			S !== null && (C = (o ? e.x : e.y) - S, _.attr("transform", o ? "translate(" + C + ",0)" : "translate(0," + C + ")"), m.selectAll("line").attr(o ? "x1" : "y1", function() {
				return Number(U(this).attr(o ? "x1" : "y1"));
			}), h.forEach(({ anchor: e, line: t }) => {
				o ? t.attr("x1", e.x + C) : t.attr("y1", e.y + C);
			}));
		}).on("end", () => {
			if (S !== null && C && L.current) {
				let e = a === "right" || a === "bottom" ? c - C : c + C;
				L.current.setTimeAxis({
					offset: Math.max(20, e),
					moved: !0
				});
			}
			S = null;
		}));
	}
	return r(() => {
		R.current = C;
		let e = ae.current;
		if (!e) return;
		let t = L.current, n = ie({
			hovered: !1,
			pinned: !1
		});
		if (e.recomputeContainers && e.recomputeContainers(), C === "force" && e.data.nodes.filter((e) => {
			let n = t && t.nodeState(Se("force") + be(e));
			return n && !n.auto || e._forcePos;
		}).length < e.data.nodes.length * .5) {
			e.data.nodes.forEach((e) => {
				let n = t && t.nodeState(Se("force") + be(e));
				n && !n.auto ? (e.fx = n.x, e.fy = n.y) : (e.fx = null, e.fy = null);
			}), e.simulation.alpha(1).restart();
			return;
		}
		let r = e.data.nodes.filter((e) => !e._groupedInto), i = C === "force" ? Object.fromEntries(r.map((e) => [e.id, e._forcePos || t && t.nodeState(Se("force") + be(e)) || {
			x: e.x,
			y: e.y
		}])) : C === "radial" && e.ringTargets && e.ringTargets() || (0, Js.computeLayout)(C, r, {
			cardW: n.width,
			cardH: n.height
		});
		if (!i) return;
		let a = new Map(e.data.nodes.map((e) => [e.id, {
			x: e.x,
			y: e.y
		}]));
		r.forEach((e) => {
			let n = t && t.nodeState(Se(C) + be(e)), r = n && typeof n.x == "number" && !n.auto ? {
				x: n.x,
				y: n.y
			} : i[e.id];
			r && (e.targetX = r.x, e.targetY = r.y, e.fx = r.x, e.fy = r.y, t && !(n && !n.auto) && t.setNodePosition(Se(C) + be(e), r.x, r.y, { silent: !0 }));
		});
		let o = Ji;
		Wi().duration(760).ease(o).tween("layout-transition", () => {
			let t = e.data.nodes.map((e) => {
				let t = a.get(e.id) || {
					x: e.x,
					y: e.y
				}, n = typeof e.targetX == "number" ? e.targetX : e.x, r = typeof e.targetY == "number" ? e.targetY : e.y, i = Un(t.x, n), o = Un(t.y, r);
				return (t) => {
					e.x = i(t), e.y = o(t);
				};
			});
			return (n) => {
				for (let e = 0; e < t.length; e++) t[e](n);
				e.applyPositions(), z.current && z.current();
			};
		}).on("end", () => {
			e.data.nodes.forEach((e) => {
				typeof e.targetX == "number" && (e.x = e.targetX), typeof e.targetY == "number" && (e.y = e.targetY), delete e.targetX, delete e.targetY;
			}), e.applyPositions(), z.current && z.current();
		});
		let s = setTimeout(() => {
			se.current && se.current(), e.fitToViewport && e.fitToViewport();
		}, 800);
		return () => clearTimeout(s);
	}, [C]), /* @__PURE__ */ p("div", {
		ref: A,
		className: Ro.graphContainer,
		"data-graph-root": !0
	});
}
var J = {
	overlay: "_overlay_1l6bt_4",
	open: "_open_1l6bt_16",
	panel: "_panel_1l6bt_30",
	minimized: "_minimized_1l6bt_67",
	wide: "_wide_1l6bt_74",
	full: "_full_1l6bt_79",
	tb: "_tb_1l6bt_92",
	growBtn: "_growBtn_1l6bt_92",
	toolbar: "_toolbar_1l6bt_107",
	dragGrip: "_dragGrip_1l6bt_124",
	windowControls: "_windowControls_1l6bt_132",
	restorePill: "_restorePill_1l6bt_138",
	popIn: "_popIn_1l6bt_1",
	pillIcon: "_pillIcon_1l6bt_167",
	pillLabel: "_pillLabel_1l6bt_171",
	pillTitle: "_pillTitle_1l6bt_177",
	pillAuthor: "_pillAuthor_1l6bt_187",
	pillAction: "_pillAction_1l6bt_193",
	toolbarGroup: "_toolbarGroup_1l6bt_208",
	ttsMount: "_ttsMount_1l6bt_217",
	toolbarSeparator: "_toolbarSeparator_1l6bt_229",
	toolbarSpacer: "_toolbarSpacer_1l6bt_236",
	closeX: "_closeX_1l6bt_276",
	navItem: "_navItem_1l6bt_277",
	tbLabeled: "_tbLabeled_1l6bt_283",
	tbText: "_tbText_1l6bt_289",
	active: "_active_1l6bt_295",
	copied: "_copied_1l6bt_300",
	tbTooltip: "_tbTooltip_1l6bt_332",
	syndLink: "_syndLink_1l6bt_354",
	canonical: "_canonical_1l6bt_372",
	progress: "_progress_1l6bt_388",
	progressFill: "_progressFill_1l6bt_397",
	progressSide: "_progressSide_1l6bt_404",
	frontmatterPanel: "_frontmatterPanel_1l6bt_422",
	fmRow: "_fmRow_1l6bt_436",
	fmLabel: "_fmLabel_1l6bt_443",
	fmValue: "_fmValue_1l6bt_452",
	fmTag: "_fmTag_1l6bt_456",
	fmUntagged: "_fmUntagged_1l6bt_467",
	fmSyndLink: "_fmSyndLink_1l6bt_474",
	body: "_body_1l6bt_484",
	articleHeader: "_articleHeader_1l6bt_533",
	articleKicker: "_articleKicker_1l6bt_537",
	articleTitle: "_articleTitle_1l6bt_545",
	articleByline: "_articleByline_1l6bt_553",
	articleMeta: "_articleMeta_1l6bt_568",
	rightsLine: "_rightsLine_1l6bt_573",
	copyToast: "_copyToast_1l6bt_582",
	show: "_show_1l6bt_598",
	bookmarkRibbon: "_bookmarkRibbon_1l6bt_603",
	ribbonTooltip: "_ribbonTooltip_1l6bt_626",
	inlineNoteForm: "_inlineNoteForm_1l6bt_652",
	inlineNoteInput: "_inlineNoteInput_1l6bt_658",
	marksPanel: "_marksPanel_1l6bt_674",
	marksHeader: "_marksHeader_1l6bt_683",
	marksList: "_marksList_1l6bt_695",
	markItem: "_markItem_1l6bt_701",
	markBody: "_markBody_1l6bt_718",
	markQuote: "_markQuote_1l6bt_724",
	markNote: "_markNote_1l6bt_731",
	markNoteEmpty: "_markNoteEmpty_1l6bt_740",
	markNoteInput: "_markNoteInput_1l6bt_745",
	markActions: "_markActions_1l6bt_757",
	markBtn: "_markBtn_1l6bt_764",
	markBtnDanger: "_markBtnDanger_1l6bt_784",
	marksListPanel: "_marksListPanel_1l6bt_790",
	inlineNotePanel: "_inlineNotePanel_1l6bt_800",
	noteInput: "_noteInput_1l6bt_806",
	marksLegend: "_marksLegend_1l6bt_822",
	markMain: "_markMain_1l6bt_834",
	markTitle: "_markTitle_1l6bt_839",
	noMarks: "_noMarks_1l6bt_865",
	following: "_following_1l6bt_907",
	navTop: "_navTop_1l6bt_964",
	navBottom: "_navBottom_1l6bt_965",
	navSide: "_navSide_1l6bt_973",
	navSideNext: "_navSideNext_1l6bt_974",
	navNext: "_navNext_1l6bt_993",
	navLine: "_navLine_1l6bt_994",
	navArrow: "_navArrow_1l6bt_995",
	navTitle: "_navTitle_1l6bt_996",
	navLocked: "_navLocked_1l6bt_1001",
	navStatus: "_navStatus_1l6bt_1003",
	turnOut_next: "_turnOut_next_1l6bt_1011",
	ppTurnOutNext: "_ppTurnOutNext_1l6bt_1",
	turnOut_prev: "_turnOut_prev_1l6bt_1012",
	ppTurnOutPrev: "_ppTurnOutPrev_1l6bt_1",
	turnIn_next: "_turnIn_next_1l6bt_1013",
	ppTurnInNext: "_ppTurnInNext_1l6bt_1",
	turnIn_prev: "_turnIn_prev_1l6bt_1014",
	ppTurnInPrev: "_ppTurnInPrev_1l6bt_1",
	notYet: "_notYet_1l6bt_1024",
	notYetTitle: "_notYetTitle_1l6bt_1031",
	notYetStatus: "_notYetStatus_1l6bt_1032",
	bmList: "_bmList_1l6bt_1060",
	bmRow: "_bmRow_1l6bt_1072",
	bmMain: "_bmMain_1l6bt_1073",
	bmTitle: "_bmTitle_1l6bt_1074",
	bmNote: "_bmNote_1l6bt_1075",
	bmNoteInput: "_bmNoteInput_1l6bt_1076",
	bmActions: "_bmActions_1l6bt_1077",
	bmEmpty: "_bmEmpty_1l6bt_1080"
}, Kc = /* @__PURE__ */ h(((e, t) => {
	function n(e) {
		return typeof e == "string" ? e.toLowerCase().replace(/[\p{P}\p{S}]/gu, "").replace(/\s+/g, " ").trim() : "";
	}
	function r(e, { para: t, quote: r } = {}) {
		if (!Array.isArray(e) || e.length === 0) return 0;
		let i = typeof t == "number" ? t : parseInt(t, 10) || 0, a = n(r);
		if (a.length > 0) {
			if (i >= 0 && i < e.length && n(e[i]).startsWith(a)) return i;
			for (let t = 0; t < e.length; t++) if (n(e[t]).startsWith(a)) return t;
		}
		return Math.max(0, Math.min(i, e.length - 1));
	}
	t.exports = {
		resolveParagraph: r,
		normalize: n
	}, typeof window < "u" && (window.resolveParagraph = r);
})), qc = /* @__PURE__ */ h(((e, t) => {
	function n(e) {
		return e && (e._source || e.originalItem && e.originalItem._source) || null;
	}
	function r(e) {
		return e.canonical_url || e.url || null;
	}
	function i(e, t) {
		if (!t) return null;
		let i = Array.isArray(t.authors) ? t.authors.filter((e) => e && e.name) : [];
		if (i.length) return {
			name: i.map((e) => String(e.name).trim()).join(", ").toLowerCase(),
			url: i[0].url || r(t)
		};
		if (t.author && String(t.author).trim()) return {
			name: String(t.author).trim().toLowerCase(),
			url: r(t)
		};
		let a = n(t);
		if (!a || a.type === "local") {
			let t = e && e.author, n = (t && (t.name || t.display) || "").trim().toLowerCase();
			return n ? {
				name: n,
				url: t && t.url || null
			} : null;
		}
		let o = (a.title || "").trim();
		return o ? {
			name: o,
			url: r(t)
		} : null;
	}
	t.exports = { byline: i };
})), Jc = /* @__PURE__ */ h(((e, t) => {
	var n = [
		"top",
		"side",
		"none"
	];
	function r(e) {
		let t = e && e.reader && e.reader.progressBar;
		return n.includes(t) ? t : "top";
	}
	function i(e) {
		return !(e && e.reader && e.reader.allowDownload === !1);
	}
	function a(e) {
		return !(e && e.reader && e.reader.bookmarksList === !1);
	}
	var o = {
		default: {
			id: "default",
			label: "Atkinson Hyperlegible",
			family: "'Atkinson', sans-serif"
		},
		opendyslexic: {
			id: "opendyslexic",
			label: "OpenDyslexic",
			family: "'OpenDyslexic', 'Atkinson', sans-serif",
			file: "OpenDyslexic-Regular.woff2",
			files: [
				{
					file: "OpenDyslexic-Regular.woff2",
					format: "woff2",
					weight: "normal",
					style: "normal"
				},
				{
					file: "OpenDyslexic-Bold.woff2",
					format: "woff2",
					weight: "bold",
					style: "normal"
				},
				{
					file: "OpenDyslexic-Italic.otf",
					format: "opentype",
					weight: "normal",
					style: "italic"
				},
				{
					file: "OpenDyslexic-BoldItalic.otf",
					format: "opentype",
					weight: "bold",
					style: "italic"
				}
			],
			license: "OpenDyslexic-OFL.txt",
			licenseName: "SIL Open Font License 1.1"
		}
	};
	function s(e) {
		let t = ["default", ...(e && e.reader && Array.isArray(e.reader.fonts) ? e.reader.fonts : ["default", "opendyslexic"]).filter((e) => e !== "default" && o[e])];
		return [...new Set(t)].map((e) => o[e]);
	}
	t.exports = {
		progressBarMode: r,
		allowDownload: i,
		bookmarksList: a,
		readerFonts: s,
		READER_FONTS: o,
		PROGRESS_BARS: n
	};
})), Yc = /* @__PURE__ */ h(((e, t) => {
	function n(e, t) {
		let n = t || decodeURIComponent(String(e.item || "").split("/").pop().replace(/\.html$/, "")).replace(/[-_]+/g, " "), r = e.para === void 0 ? e.paragraph : e.para;
		return [n, e.quote ? `“${e.quote}…”` : r == null ? "" : `paragraph ${Number(r) + 1}`].filter(Boolean).join(" · ");
	}
	function r(e, t) {
		let n = e.para === void 0 ? e.paragraph : e.para;
		if (n == null) return null;
		if (t && e.version && t.version && e.version !== t.version) {
			let r = t.version_maps && t.version_maps[e.version];
			if (r) {
				let e = r[n];
				if (e !== void 0 && e !== -1) return e;
			}
		}
		return n;
	}
	function i(e, t) {
		let n = Array.isArray(e) ? e : [], r = (e) => e.para === void 0 ? e.paragraph : e.para;
		return n.length && t != null && n.every((e) => r(e) === t) ? "remove" : "set";
	}
	t.exports = {
		bookmarkTap: i,
		bookmarkLabel: n,
		placedParagraph: r
	};
})), Xc = Kc(), Zc = qc(), Qc = Jc(), $c = Yc(), el = (e, t) => {
	let n = e && Array.isArray(e.items) ? e.items.find((e) => e.id === t) : null;
	return n && n.title || "";
}, tl = (e, t) => "#read=" + encodeURIComponent(e) + (t == null ? "" : "&p=" + t);
function nl({ b: e, feedData: t, viewState: n }) {
	let [r, i] = c(!1), a = (0, $c.placedParagraph)(e, t && Array.isArray(t.items) ? t.items.find((t) => t.id === e.item) : null);
	return /* @__PURE__ */ m("div", {
		className: J.bmRow,
		"data-bookmark-row": !0,
		children: [/* @__PURE__ */ m("div", {
			className: J.bmMain,
			children: [/* @__PURE__ */ p("div", {
				className: J.bmTitle,
				children: (0, $c.bookmarkLabel)(e, el(t, e.item))
			}), r ? /* @__PURE__ */ p("input", {
				type: "text",
				value: e.note || "",
				onChange: (t) => n.setBookmarkNote(e.id, t.target.value),
				onBlur: () => i(!1),
				onKeyDown: (e) => {
					e.key === "Enter" && i(!1);
				},
				className: J.bmNoteInput,
				"aria-label": "Note",
				autoFocus: !0
			}) : /* @__PURE__ */ p("button", {
				className: J.bmNote,
				onClick: () => i(!0),
				children: e.note || /* @__PURE__ */ p("em", { children: "Add a note" })
			})]
		}), /* @__PURE__ */ m("div", {
			className: J.bmActions,
			children: [
				/* @__PURE__ */ p("button", {
					onClick: () => {
						window.location.hash = tl(e.item, a);
					},
					title: "Go back to this place",
					children: "Jump"
				}),
				/* @__PURE__ */ p("button", {
					onClick: async () => {
						try {
							await navigator.clipboard.writeText(window.location.href.split("#")[0] + tl(e.item, a));
						} catch {}
					},
					title: "Copy a link to this place",
					children: "Copy link"
				}),
				/* @__PURE__ */ p("button", {
					onClick: () => n.removeBookmark(e.id),
					title: "Delete this bookmark",
					children: "Delete"
				})
			]
		})]
	});
}
function rl({ viewState: e, feedData: t, itemId: n }) {
	if (!e) return null;
	let r = e.bookmarks(), i = r.filter((e) => e.item === n), a = r.filter((e) => e.item !== n);
	return /* @__PURE__ */ m("div", {
		className: J.bmList,
		"data-bookmarks-list": !0,
		children: [[...i, ...a].map((n) => /* @__PURE__ */ p(nl, {
			b: n,
			feedData: t,
			viewState: e
		}, n.id)), r.length === 0 && /* @__PURE__ */ p("div", {
			className: J.bmEmpty,
			children: "No bookmarks yet."
		})]
	});
}
//#endregion
//#region src/components/Icon/Icon.jsx
function il({ body: e, size: t = 16, className: n }) {
	return e ? /* @__PURE__ */ p("svg", {
		className: n,
		viewBox: "0 0 24 24",
		width: t,
		height: t,
		"aria-hidden": "true",
		focusable: "false",
		"data-icon": !0,
		dangerouslySetInnerHTML: { __html: e }
	}) : null;
}
//#endregion
//#region src/lib/icons.js
var al = /* @__PURE__ */ h(((e, t) => {
	var n = (e) => `<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">${e}</g>`, r = {
		"undo-2": n("<path d=\"M9 14 4 9l5-5\"/><path d=\"M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11\"/>"),
		"redo-2": n("<path d=\"m15 14 5-5-5-5\"/><path d=\"M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13\"/>"),
		"rotate-ccw": n("<path d=\"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\"/><path d=\"M3 3v5h5\"/>"),
		tag: n("<path d=\"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z\"/><circle cx=\"7.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\"/>"),
		hourglass: n("<path d=\"M5 22h14\"/><path d=\"M5 2h14\"/><path d=\"M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22\"/><path d=\"M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2\"/>"),
		settings: n("<path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/>"),
		check: n("<path d=\"M20 6 9 17l-5-5\"/>"),
		"sliders-horizontal": n("<line x1=\"21\" x2=\"14\" y1=\"4\" y2=\"4\"/><line x1=\"10\" x2=\"3\" y1=\"4\" y2=\"4\"/><line x1=\"21\" x2=\"12\" y1=\"12\" y2=\"12\"/><line x1=\"8\" x2=\"3\" y1=\"12\" y2=\"12\"/><line x1=\"21\" x2=\"16\" y1=\"20\" y2=\"20\"/><line x1=\"12\" x2=\"3\" y1=\"20\" y2=\"20\"/><line x1=\"14\" x2=\"14\" y1=\"2\" y2=\"6\"/><line x1=\"8\" x2=\"8\" y1=\"10\" y2=\"14\"/><line x1=\"16\" x2=\"16\" y1=\"18\" y2=\"22\"/>"),
		x: n("<path d=\"M18 6 6 18\"/><path d=\"m6 6 12 12\"/>"),
		link: n("<path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\"/><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\"/>"),
		"arrow-left": n("<path d=\"m12 19-7-7 7-7\"/><path d=\"M19 12H5\"/>"),
		"arrow-right": n("<path d=\"M5 12h14\"/><path d=\"m12 5 7 7-7 7\"/>"),
		bookmark: n("<path d=\"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z\"/>"),
		"maximize-2": n("<path d=\"M15 3h6v6\"/><path d=\"m21 3-7 7\"/><path d=\"m3 21 7-7\"/><path d=\"M9 21H3v-6\"/>"),
		"minimize-2": n("<path d=\"m14 10 7-7\"/><path d=\"M20 10h-6V4\"/><path d=\"m3 21 7-7\"/><path d=\"M4 14h6v6\"/>"),
		minus: n("<path d=\"M5 12h14\"/>"),
		"move-horizontal": n("<path d=\"m18 8 4 4-4 4\"/><path d=\"M2 12h20\"/><path d=\"m6 8-4 4 4 4\"/>"),
		list: n("<path d=\"M3 12h.01\"/><path d=\"M3 18h.01\"/><path d=\"M3 6h.01\"/><path d=\"M8 12h13\"/><path d=\"M8 18h13\"/><path d=\"M8 6h13\"/>"),
		info: n("<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 16v-4\"/><path d=\"M12 8h.01\"/>"),
		download: n("<path d=\"M12 15V3\"/><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/><path d=\"m7 10 5 5 5-5\"/>")
	}, i = (e) => r[e] || "";
	function a(e) {
		if (typeof e != "string") return "";
		let t = e.trim();
		if (!t || t.indexOf("<") < 0) return "";
		let n = t.match(/^<svg\b[^>]*>([\s\S]*)<\/svg>$/i);
		return n && (t = n[1].trim()), /<\s*(script|foreignObject|iframe)\b/i.test(t) || /\son\w+\s*=/i.test(t) || /javascript:/i.test(t) ? "" : t;
	}
	t.exports = {
		ICONS: r,
		iconBody: i,
		siteIcon: a
	};
})), ol = /* @__PURE__ */ h(((e, t) => {
	var n = /[^.!?…]*(?:[.!?…]+["'”’»)\]]*|$)/g, r = /[\p{L}\p{M}\p{N}'’-]/u;
	function i(e) {
		let t = [];
		n.lastIndex = 0;
		let r;
		for (; (r = n.exec(e)) !== null;) {
			if (r[0].length === 0) {
				if (n.lastIndex++, n.lastIndex > e.length) break;
				continue;
			}
			let i = r.index, a = r.index + r[0].length;
			for (; i < a && /\s/.test(e[i]);) i++;
			for (; a > i && /\s/.test(e[a - 1]);) a--;
			a > i && t.push([i, a]);
		}
		return t;
	}
	function a(e, t) {
		let n = Math.max(0, Math.min(t, e.length - 1));
		if (!r.test(e[n] || "")) if (n > 0 && r.test(e[n - 1])) --n;
		else return null;
		let i = n, a = n + 1;
		for (; i > 0 && r.test(e[i - 1]);) i--;
		for (; a < e.length && r.test(e[a]);) a++;
		for (; a > i && /['’-]/.test(e[a - 1]);) a--;
		for (; i < a && /['’-]/.test(e[i]);) i++;
		return a > i ? [i, a] : null;
	}
	function o(e, t) {
		if (!e) return null;
		let n = i(e);
		if (!n.length) return null;
		let r = n.find(([e, n]) => t >= e && t < n);
		return r ||= n.filter(([e]) => e <= t).pop() || n[0], {
			sentence: r,
			word: a(e, t)
		};
	}
	t.exports = {
		sentenceSpans: i,
		wordAt: a,
		spanAt: o
	};
})), sl = al(), cl = ol(), ll = "p, li, blockquote, h1, h2, h3, h4, h5, h6, dd, dt, figcaption, td, th", ul = "pp-follow-sentence", dl = "pp-follow-word", fl = "pp-follow-block", pl = () => typeof CSS < "u" && CSS.highlights && typeof Highlight < "u";
function ml(e, t) {
	if (document.caretPositionFromPoint) {
		let n = document.caretPositionFromPoint(e, t);
		if (n && n.offsetNode) return {
			node: n.offsetNode,
			offset: n.offset
		};
	}
	if (document.caretRangeFromPoint) {
		let n = document.caretRangeFromPoint(e, t);
		if (n) return {
			node: n.startContainer,
			offset: n.startOffset
		};
	}
	return null;
}
function hl(e) {
	let t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT, { acceptNode(e) {
		let t = e.parentElement;
		return t && t.closest(".bookmarkRibbon, [aria-hidden=\"true\"]") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
	} }), r;
	for (; r = n.nextNode();) t.push(r);
	return t;
}
function gl(e, t, n, r) {
	let i = (n, r) => {
		for (let i = 0; i < e.length; i++) {
			let a = e[i].nodeValue.length;
			if (n < t[i] + a || r && n === t[i] + a) return [e[i], n - t[i]];
		}
		let i = e[e.length - 1];
		return [i, i.nodeValue.length];
	}, a = document.createRange(), [o, s] = i(n, !1), [c, l] = i(r, !0);
	return a.setStart(o, s), a.setEnd(c, l), a;
}
function _l(e) {
	pl() && (CSS.highlights.delete(ul), CSS.highlights.delete(dl)), e && (e.querySelectorAll("." + fl).forEach((e) => e.classList.remove(fl)), delete e.dataset.followSentence, delete e.dataset.followWord);
}
function vl(e, t, n) {
	let r = ml(t, n);
	if (!r || !e.contains(r.node)) return null;
	let i = r.node.nodeType === 3 ? r.node.parentElement : r.node, a = i && i.closest(ll);
	if (!a || !e.contains(a)) return null;
	let o = hl(a);
	if (!o.length) return null;
	let s = [], c = "", l = null;
	for (let e of o) s.push(c.length), e === r.node && (l = c.length + r.offset), c += e.nodeValue;
	if (l === null) return null;
	let u = (0, cl.spanAt)(c, l);
	if (!u) return null;
	_l(e);
	let d = c.slice(u.sentence[0], u.sentence[1]), f = u.word ? c.slice(u.word[0], u.word[1]) : "";
	return pl() ? (CSS.highlights.set(ul, new Highlight(gl(o, s, u.sentence[0], u.sentence[1]))), u.word && CSS.highlights.set(dl, new Highlight(gl(o, s, u.word[0], u.word[1])))) : a.classList.add(fl), e.dataset.followSentence = d, e.dataset.followWord = f, {
		sentence: d,
		word: f
	};
}
function yl(e) {
	let t = !1, n = 0, r = null, i = () => {
		n = 0, r && vl(e, r.x, r.y);
	}, a = (e) => {
		r = {
			x: e.clientX,
			y: e.clientY
		}, n ||= requestAnimationFrame(i);
	}, o = (e) => {
		e.button > 0 || e.target.closest && e.target.closest("a, button, input, select, textarea") || (t = !0, a(e));
	}, s = (e) => {
		t && a(e);
	}, c = () => {
		t = !1;
	};
	return e.addEventListener("pointerdown", o), e.addEventListener("pointermove", s), window.addEventListener("pointerup", c), window.addEventListener("pointercancel", c), () => {
		n && cancelAnimationFrame(n), e.removeEventListener("pointerdown", o), e.removeEventListener("pointermove", s), window.removeEventListener("pointerup", c), window.removeEventListener("pointercancel", c), _l(e);
	};
}
//#endregion
//#region src/components/ReaderPanel/boldStartHtml.js
var bl = (/* @__PURE__ */ h(((e, t) => {
	var n = /[\p{L}\p{M}]+(?:['’][\p{L}\p{M}]+)*/gu;
	function r(e) {
		return e <= 0 ? 0 : Math.max(1, Math.round(e / 2));
	}
	function i(e) {
		let t = [], i = 0, a = (e, n) => {
			if (!e) return;
			let r = t[t.length - 1];
			r && r.bold === n ? r.text += e : t.push({
				text: e,
				bold: n
			});
		};
		n.lastIndex = 0;
		let o;
		for (; (o = n.exec(e)) !== null;) {
			a(e.slice(i, o.index), !1);
			let t = r(o[0].length);
			a(o[0].slice(0, t), !0), a(o[0].slice(t), !1), i = o.index + o[0].length;
		}
		return a(e.slice(i), !1), t;
	}
	t.exports = {
		boldLength: r,
		boldStartSegments: i
	};
})))(), xl = new Set([
	"SCRIPT",
	"STYLE",
	"CODE",
	"PRE",
	"KBD",
	"SAMP",
	"svg"
]);
function Sl(e) {
	if (!e || typeof DOMParser > "u") return e;
	let t = new DOMParser().parseFromString(`<div id="pp-bs-root">${e}</div>`, "text/html"), n = t.getElementById("pp-bs-root"), r = t.createTreeWalker(n, NodeFilter.SHOW_TEXT, { acceptNode(e) {
		for (let t = e.parentElement; t && t !== n; t = t.parentElement) if (xl.has(t.tagName)) return NodeFilter.FILTER_REJECT;
		return /[\p{L}]/u.test(e.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
	} }), i = [], a;
	for (; a = r.nextNode();) i.push(a);
	for (let e of i) {
		let n = t.createDocumentFragment();
		for (let r of (0, bl.boldStartSegments)(e.nodeValue)) if (r.bold) {
			let e = t.createElement("b");
			e.className = "pp-bs", e.textContent = r.text, n.appendChild(e);
		} else n.appendChild(t.createTextNode(r.text));
		e.parentNode.replaceChild(n, e);
	}
	return n.innerHTML;
}
//#endregion
//#region src/components/ReaderPanel/Contributions.module.css
var Cl = (/* @__PURE__ */ h(((e, t) => {
	var { containerHas: n } = Us();
	function r(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of e && e.items || []) t.set(n.id, n);
		return t;
	}
	function i(e) {
		return !!e && e._posted !== "title";
	}
	function a(e, t, r = "not yet published") {
		if (i(t)) return null;
		let a = e && e.containers || [], o = new Map(a.map((e) => [e.id, e])), s = (e) => {
			let t = 0, n = e.parent;
			for (; n && o.has(n) && t < 20;) t++, n = o.get(n).parent;
			return t;
		}, c = a.filter((e) => e.tag && n(e, t)).sort((e, t) => s(t) - s(e)).find((e) => e.status);
		return c ? String(c.status) : r;
	}
	function o(e, t) {
		let n = r(e), i = [], a = [];
		for (let r of e && e.edges || []) r.layer === "sequence" && (r.source === t && n.has(r.target) && a.push(n.get(r.target)), r.target === t && n.has(r.source) && i.push(n.get(r.source)));
		return {
			prev: i,
			next: a
		};
	}
	function s(e, t, n) {
		let { prev: r, next: a } = o(e, t);
		return (n === "prev" ? r : a).find(i) || null;
	}
	t.exports = {
		neighbours: o,
		navStatus: a,
		isReadable: i,
		step: s
	};
})))(), Y = {
	section: "_section_kyr82_3",
	head: "_head_kyr82_15",
	title: "_title_kyr82_16",
	note: "_note_kyr82_23",
	empty: "_empty_kyr82_23",
	list: "_list_kyr82_25",
	item: "_item_kyr82_26",
	kind: "_kind_kyr82_31",
	itemTitle: "_itemTitle_kyr82_37",
	byline: "_byline_kyr82_38",
	author: "_author_kyr82_39",
	date: "_date_kyr82_40",
	testTag: "_testTag_kyr82_40",
	para: "_para_kyr82_42",
	quote: "_quote_kyr82_48",
	quoteText: "_quoteText_kyr82_54",
	fallback: "_fallback_kyr82_56",
	linkBtn: "_linkBtn_kyr82_63",
	art: "_art_kyr82_76",
	addRow: "_addRow_kyr82_95",
	addBtn: "_addBtn_kyr82_96",
	form: "_form_kyr82_107",
	formTitle: "_formTitle_kyr82_114",
	field: "_field_kyr82_115",
	passage: "_passage_kyr82_130",
	errors: "_errors_kyr82_131",
	thanks: "_thanks_kyr82_132",
	formActions: "_formActions_kyr82_133"
}, wl = "pp-contrib-passage", Tl = () => typeof CSS < "u" && CSS.highlights && typeof Highlight < "u";
function El(e) {
	if (!e) return "";
	let t = new Date(e.length === 10 ? `${e}T00:00:00` : e);
	return isNaN(t) ? "" : t.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	});
}
function Dl(e, t) {
	let n = String(e || "").replace(/\s+/g, " ").trim();
	return n.length > t ? n.slice(0, t - 1).trimEnd() + "…" : n;
}
function Ol(e, t, n) {
	let r = document.createTreeWalker(e, NodeFilter.SHOW_TEXT, { acceptNode(e) {
		let t = e.parentElement;
		return t && t.closest(".bookmarkRibbon, [aria-hidden=\"true\"]") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
	} }), i = document.createRange(), a = 0, o = !1, s = !1, c, l = t + n;
	for (; c = r.nextNode();) {
		let e = c.nodeValue;
		for (let n = 0; n < e.length; n++) {
			let r = /\s/.test(e[n]);
			if (!(r && o) && (o = r, !s && a === t && (i.setStart(c, n), s = !0), a++, s && a === l)) return i.setEnd(c, n + 1), i;
		}
	}
	return s ? i : null;
}
function kl({ article: e, contributions: t, config: n, feedData: i, textRef: o, textKey: s, onOpenChapter: l, children: u }) {
	let d = (0, gc.slugOf)(e), h = a(() => (0, gc.forChapter)(t, d), [t, d]), [g, _] = c(null), [v, y] = c({}), b = a(() => {
		let e = /* @__PURE__ */ new Map();
		for (let t of i && i.items || []) e.set((0, gc.slugOf)(t), t);
		return e;
	}, [i]);
	r(() => {
		_(null);
		let e = setTimeout(() => {
			let e = o && o.current, t = e ? Array.from(e.querySelectorAll("p")) : [], n = t.map((e) => e.textContent), r = {};
			for (let e of h) e.quote && (r[e.id] = t.length ? (0, gc.resolveQuote)(n, e.quote) : null);
			y(r);
		}, 80);
		return () => clearTimeout(e);
	}, [
		h,
		e,
		s
	]), r(() => () => {
		Tl() && CSS.highlights.delete(wl);
	}, [e]);
	let x = (e) => {
		let t = v[e.id], n = o && o.current;
		if (!t || !n) return;
		let r = n.querySelectorAll("p")[t.para];
		if (!r) return;
		let i = n.closest("[data-tts-target]");
		if (i) {
			let e = r.getBoundingClientRect().top - i.getBoundingClientRect().top;
			i.scrollTop += e - 40;
		}
		let a = Ol(r, t.offset, t.length);
		n.querySelectorAll("[data-contrib-passage]").forEach((e) => e.removeAttribute("data-contrib-passage")), r.setAttribute("data-contrib-passage", e.id), a && Tl() && CSS.highlights.set(wl, new Highlight(a)), setTimeout(() => {
			r.getAttribute("data-contrib-passage") === e.id && r.removeAttribute("data-contrib-passage"), Tl() && CSS.highlights.delete(wl);
		}, 4e3);
	};
	if (!h.length && !u && !(n && n.submit)) return null;
	let S = (e) => {
		if (!e.quote) return null;
		let t = v[e.id];
		return t ? /* @__PURE__ */ m("div", {
			className: Y.quote,
			"data-contrib-anchor": "found",
			children: [/* @__PURE__ */ m("span", {
				className: Y.quoteText,
				children: [
					"“",
					Dl(e.quote.exact, 140),
					"”"
				]
			}), /* @__PURE__ */ p("button", {
				type: "button",
				className: Y.linkBtn,
				onClick: () => x(e),
				"data-contrib-show": !0,
				children: "Show the passage"
			})]
		}) : t === null ? /* @__PURE__ */ p("div", {
			className: Y.fallback,
			"data-contrib-anchor": "fallback",
			children: "This was about a passage that isn’t in the chapter as it reads now, so it stays with the chapter as a whole."
		}) : null;
	}, C = (e) => /* @__PURE__ */ m("div", {
		className: Y.byline,
		children: [
			/* @__PURE__ */ p("span", {
				className: Y.author,
				children: e.author
			}),
			El(e.created) && /* @__PURE__ */ m("span", {
				className: Y.date,
				children: [" · ", El(e.created)]
			}),
			e.test && /* @__PURE__ */ p("span", {
				className: Y.testTag,
				children: " · test"
			})
		]
	});
	return /* @__PURE__ */ m("aside", {
		className: Y.section,
		"aria-label": "From readers",
		"data-contributions": !0,
		"data-pp-not-text": !0,
		children: [
			/* @__PURE__ */ m("div", {
				className: Y.head,
				children: [/* @__PURE__ */ p("div", {
					className: Y.title,
					children: "From readers"
				}), /* @__PURE__ */ p("div", {
					className: Y.note,
					children: "Not part of the book. Written by readers, with their names."
				})]
			}),
			h.length === 0 && /* @__PURE__ */ p("div", {
				className: Y.empty,
				children: "Nothing from readers on this chapter yet."
			}),
			/* @__PURE__ */ p("ul", {
				className: Y.list,
				children: h.map((e) => /* @__PURE__ */ m("li", {
					className: Y.item,
					"data-contrib": e.id,
					"data-contrib-type": e.type,
					children: [
						/* @__PURE__ */ p("div", {
							className: Y.kind,
							children: e.type === "essay" ? "Essay" : e.type === "art" ? "Art" : e.type === "connection" ? "Connection" : "Comment"
						}),
						e.title && /* @__PURE__ */ p("div", {
							className: Y.itemTitle,
							children: e.title
						}),
						C(e),
						S(e),
						e.type === "comment" && (0, gc.paragraphsOf)(e.body).map((e, t) => /* @__PURE__ */ p("div", {
							className: Y.para,
							children: e
						}, t)),
						e.type === "connection" && (() => {
							let t = e.chapter === d ? e.to : e.chapter, n = b.get(t);
							return /* @__PURE__ */ m(f, { children: [/* @__PURE__ */ m("div", {
								className: Y.para,
								children: [
									"Connects this chapter with",
									" ",
									n && l ? /* @__PURE__ */ p("button", {
										type: "button",
										className: Y.linkBtn,
										onClick: () => l(n),
										"data-contrib-goto": t,
										children: n.title || t
									}) : n && n.title || t
								]
							}), (0, gc.paragraphsOf)(e.body).map((e, t) => /* @__PURE__ */ p("div", {
								className: Y.para,
								children: e
							}, t))] });
						})(),
						e.type === "art" && /* @__PURE__ */ m("figure", {
							className: Y.art,
							children: [/* @__PURE__ */ p("img", {
								src: (0, gc.assetUrl)(e.asset, n),
								alt: e.alt || `Art by ${e.author}`,
								loading: "lazy"
							}), e.body && /* @__PURE__ */ p("figcaption", {
								className: Y.para,
								children: e.body
							})]
						}),
						e.type === "essay" && (() => {
							let t = (0, gc.paragraphsOf)(e.body), n = g === e.id;
							return /* @__PURE__ */ m("div", {
								className: Y.essay,
								"data-contrib-essay": n ? "open" : "closed",
								children: [
									!n && /* @__PURE__ */ p("div", {
										className: Y.para,
										children: Dl(t[0] || "", 220)
									}),
									n && t.map((e, t) => /* @__PURE__ */ p("div", {
										className: Y.para,
										children: e
									}, t)),
									/* @__PURE__ */ p("button", {
										type: "button",
										className: Y.linkBtn,
										"aria-expanded": n,
										onClick: () => _(n ? null : e.id),
										"data-contrib-open": !0,
										children: n ? "Close the essay" : "Read the essay"
									})
								]
							});
						})()
					]
				}, e.id))
			}),
			n && n.submit && /* @__PURE__ */ p(jl, {
				article: e,
				chapter: d,
				config: n,
				feedData: i,
				textRef: o
			}),
			u
		]
	});
}
function Al(e) {
	let t = typeof window < "u" && window.getSelection ? window.getSelection() : null;
	if (!t || t.isCollapsed || !t.rangeCount || !e) return null;
	let n = t.getRangeAt(0);
	if (!e.contains(n.commonAncestorContainer)) return null;
	let r = n.startContainer.nodeType === 1 ? n.startContainer : n.startContainer.parentElement, i = r && r.closest("p");
	if (!i || !e.contains(i) || !i.contains(n.endContainer)) return { error: "Choose a passage within one paragraph." };
	let a = document.createRange();
	a.setStart(i, 0), a.setEnd(n.startContainer, n.startOffset);
	let o = a.toString().length;
	return (0, gc.quoteFromSelection)(i.textContent, o, o + n.toString().length);
}
function jl({ article: e, chapter: t, config: n, feedData: i, textRef: a }) {
	let [o, s] = c(!1), [l, u] = c(""), [d, h] = c("comment"), [g, _] = c(""), [v, y] = c(""), [b, x] = c(""), [S, C] = c(null), [w, T] = c(null), [E, D] = c({
		sending: !1,
		errors: [],
		done: !1
	}), O = n.limits || {};
	r(() => {
		C(null), T(null), D({
			sending: !1,
			errors: [],
			done: !1
		});
	}, [t]), r(() => {
		if (!o) return;
		let e = () => {
			let e = Al(a && a.current);
			e && T(e);
		};
		return document.addEventListener("selectionchange", e), () => document.removeEventListener("selectionchange", e);
	}, [o, a]);
	let k = (i && i.items || []).filter((e) => (0, gc.slugOf)(e) !== t && e._posted !== "title").map((e) => ({
		id: (0, gc.slugOf)(e),
		title: e.title || (0, gc.slugOf)(e)
	})), A = () => ({
		author: l.trim(),
		type: d,
		...d === "essay" && g.trim() ? { title: g.trim() } : {},
		body: v,
		anchor: {
			chapter: t,
			...S && !S.error ? S : {}
		},
		...d === "connection" ? { to: b } : {}
	});
	return o ? /* @__PURE__ */ m("form", {
		className: Y.form,
		onSubmit: async (e) => {
			e.preventDefault();
			let t = A(), r = (0, gc.checkSubmission)(t, n);
			if (r.length) {
				D({
					sending: !1,
					errors: r,
					done: !1
				});
				return;
			}
			D({
				sending: !0,
				errors: [],
				done: !1
			});
			try {
				let e = await fetch(n.endpoint, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(t)
				}), r = await e.json().catch(() => ({}));
				if (!e.ok) {
					D({
						sending: !1,
						errors: r.errors || [r.error || "It could not be sent just now. Please try again later."],
						done: !1
					});
					return;
				}
				y(""), _(""), C(null), D({
					sending: !1,
					errors: [],
					done: !0
				});
			} catch {
				D({
					sending: !1,
					errors: ["It could not be sent just now. Please try again later."],
					done: !1
				});
			}
		},
		"data-contrib-form": !0,
		noValidate: !0,
		children: [
			/* @__PURE__ */ p("div", {
				className: Y.formTitle,
				children: "Add yours"
			}),
			/* @__PURE__ */ p("div", {
				className: Y.note,
				children: "It is read before it appears here. Only the name you give is kept with it; nothing else about you is asked for or stored."
			}),
			/* @__PURE__ */ m("label", {
				className: Y.field,
				children: [/* @__PURE__ */ p("span", { children: "Name to show" }), /* @__PURE__ */ p("input", {
					value: l,
					maxLength: O.name,
					onChange: (e) => u(e.target.value),
					autoComplete: "nickname",
					"data-contrib-field": "author"
				})]
			}),
			/* @__PURE__ */ m("label", {
				className: Y.field,
				children: [/* @__PURE__ */ p("span", { children: "What it is" }), /* @__PURE__ */ m("select", {
					value: d,
					onChange: (e) => h(e.target.value),
					"data-contrib-field": "type",
					children: [
						/* @__PURE__ */ p("option", {
							value: "comment",
							children: "A comment"
						}),
						/* @__PURE__ */ p("option", {
							value: "essay",
							children: "An essay"
						}),
						/* @__PURE__ */ p("option", {
							value: "connection",
							children: "A connection to another chapter"
						})
					]
				})]
			}),
			d === "essay" && /* @__PURE__ */ m("label", {
				className: Y.field,
				children: [/* @__PURE__ */ p("span", { children: "Title (optional)" }), /* @__PURE__ */ p("input", {
					value: g,
					maxLength: 140,
					onChange: (e) => _(e.target.value),
					"data-contrib-field": "title"
				})]
			}),
			d === "connection" && /* @__PURE__ */ m("label", {
				className: Y.field,
				children: [/* @__PURE__ */ p("span", { children: "The other chapter" }), /* @__PURE__ */ m("select", {
					value: b,
					onChange: (e) => x(e.target.value),
					"data-contrib-field": "to",
					children: [/* @__PURE__ */ p("option", {
						value: "",
						children: "Choose…"
					}), k.map((e) => /* @__PURE__ */ p("option", {
						value: e.id,
						children: e.title
					}, e.id))]
				})]
			}),
			/* @__PURE__ */ m("label", {
				className: Y.field,
				children: [/* @__PURE__ */ p("span", { children: d === "connection" ? "How they connect" : "Your words" }), /* @__PURE__ */ p("textarea", {
					value: v,
					maxLength: O.body,
					rows: d === "essay" ? 10 : 4,
					onChange: (e) => y(e.target.value),
					"data-contrib-field": "body"
				})]
			}),
			/* @__PURE__ */ p("div", {
				className: Y.passage,
				children: S && !S.error ? /* @__PURE__ */ m(f, { children: [/* @__PURE__ */ m("span", {
					className: Y.quoteText,
					children: [
						"About: “",
						Dl(S.exact, 120),
						"”"
					]
				}), /* @__PURE__ */ p("button", {
					type: "button",
					className: Y.linkBtn,
					onClick: () => C(null),
					children: "Not about a passage"
				})] }) : /* @__PURE__ */ m(f, { children: [/* @__PURE__ */ p("span", {
					className: Y.note,
					children: S && S.error ? S.error : "To write about a passage, select it in the chapter, then:"
				}), /* @__PURE__ */ p("button", {
					type: "button",
					className: Y.linkBtn,
					onMouseDown: (e) => e.preventDefault(),
					onClick: () => C(Al(a && a.current) || w || { error: "Select a passage in the chapter first." }),
					"data-contrib-use-selection": !0,
					children: "Use the passage I selected"
				})] })
			}),
			E.errors.length > 0 && /* @__PURE__ */ p("ul", {
				className: Y.errors,
				role: "alert",
				children: E.errors.map((e, t) => /* @__PURE__ */ p("li", { children: e }, t))
			}),
			E.done && /* @__PURE__ */ p("div", {
				className: Y.thanks,
				role: "status",
				"data-contrib-sent": !0,
				children: "Thank you. It will appear here once it has been read and approved."
			}),
			/* @__PURE__ */ m("div", {
				className: Y.formActions,
				children: [/* @__PURE__ */ p("button", {
					type: "submit",
					className: Y.addBtn,
					disabled: E.sending,
					"data-contrib-send": !0,
					children: E.sending ? "Sending…" : "Send"
				}), /* @__PURE__ */ p("button", {
					type: "button",
					className: Y.linkBtn,
					onClick: () => s(!1),
					children: "Close"
				})]
			})
		]
	}) : /* @__PURE__ */ p("div", {
		className: Y.addRow,
		children: /* @__PURE__ */ p("button", {
			type: "button",
			className: Y.addBtn,
			onClick: () => s(!0),
			"data-contrib-add": !0,
			children: "Add yours"
		})
	});
}
//#endregion
//#region src/components/ReaderPanel/ReaderPanel.jsx
var Ml = (/* @__PURE__ */ h(((e, t) => {
	var n = "source gave none, discovery off", r = "source gave none, nothing recurred", i = "emerge found no concept", a = "source gave none, every phrase refused", o = (e) => `source gave none, candidates queued (${e})`, s = new Set([
		"noRecurring",
		"noCandidate",
		"nearCopy"
	]);
	function c(e, { discover: t = !1, emerge: c = !0 } = {}) {
		let l = e && typeof e == "object" ? e : {}, u = Array.isArray(l.reasons) ? l.reasons.filter((e) => typeof e == "string" && e) : typeof l.reason == "string" && l.reason ? [l.reason] : [];
		if (!t || u.includes("noDiscovery")) return n;
		let d = l.candidates && typeof l.candidates == "object" && Array.isArray(l.candidates.queued) ? l.candidates.queued.length : 0;
		return d > 0 ? o(d) : u.length && u.every((e) => s.has(e)) || t === "queue" && !u.length ? r : c ? i : u.length ? a : r;
	}
	function l(e) {
		if (!e || typeof e != "object") return null;
		if (typeof e.untaggedBecause == "string" && e.untaggedBecause) return e.untaggedBecause;
		let t = e.originalItem;
		return t && typeof t == "object" && typeof t.untaggedBecause == "string" && t.untaggedBecause ? t.untaggedBecause : null;
	}
	t.exports = {
		untaggedBecause: c,
		untaggedBecauseOf: l
	};
})))();
function Nl({ article: e, onClose: t, settings: n, viewState: i, targetParagraph: o, feedData: l, onNavigate: u, contributions: d, contributionsConfig: h }) {
	let [g, _] = c(!1), [v, y] = c(!1), [b, x] = c(null), [S, C] = c(!1), [w, T] = c(!1), [E, D] = c(""), [O, k] = c(0), [A, j] = c(!1), [M, N] = c(!1), [P, F] = c(!1), I = s(null), L = s(null), ee = s(null), te = s(!1), ne = s({
		mouseX: 0,
		mouseY: 0,
		posX: 0,
		posY: 0
	}), [re, ie] = c(null), [ae, R] = c(null), oe = s([]);
	r(() => {
		B.current && (clearTimeout(B.current), _e()), e ? (_(!0), y(!1), ie(null), L.current && (L.current.scrollTop = 0), k(0), he(e)) : (_(!1), y(!1), D(""), k(0), C(!1));
	}, [e]);
	let se = (e) => e ? e.originalItem && e.originalItem.id || e.id || e.url : null, z = se(e), ce = i && z ? i.bookmarks(z) : [], le = !!(i && i.readerAid && i.readerAid("boldStart")), ue = a(() => le ? Sl(E) : E, [E, le]), de = a(() => ({ __html: ue }), [ue]), fe = (e) => {
		e.target.closest("button") || e.target.closest("a") || e.target.closest("input") || (te.current = !0, ne.current = {
			mouseX: e.clientX,
			mouseY: e.clientY,
			posX: b ? b.x : 0,
			posY: b ? b.y : 0
		}, window.addEventListener("mousemove", pe), window.addEventListener("mouseup", me));
	}, pe = (e) => {
		if (!te.current) return;
		let t = e.clientX - ne.current.mouseX, n = e.clientY - ne.current.mouseY;
		x({
			x: ne.current.posX + t,
			y: ne.current.posY + n
		});
	}, me = () => {
		te.current = !1, window.removeEventListener("mousemove", pe), window.removeEventListener("mouseup", me);
	}, he = async (e) => {
		let t = e.kind || "essay";
		if (t === "placeholder" || e.substrate === "placeholder") {
			let t = e.series_part || e.title || "";
			D(`
        <div style="padding: 40px 24px; text-align: center; border: 1px dashed rgba(212, 175, 55, 0.35); border-radius: 12px; background: rgba(20, 24, 38, 0.6); margin-top: 24px;">
          <div style="font-size: 20px; font-weight: 600; color: var(--rp-accent, #d4af37); margin-bottom: 8px;">Chapter ${t}</div>
          <div style="font-size: 13px; color: var(--rp-text, #a8b2d1); opacity: 0.8; letter-spacing: 0.5px;">Act ${Number(t) >= 21 ? "3" : "2"} · In Progress</div>
        </div>
      `);
			return;
		}
		if (e._posted === "title") {
			let t = (0, Cl.navStatus)(l, e) || "";
			D(`<div class="${J.notYet}" data-not-yet><div class="${J.notYetTitle}">${Pl(e.title || "")}</div><div class="${J.notYetStatus}">${Pl(t)}</div></div>`);
			return;
		}
		if (Il(e)) {
			D(Rl(e));
			return;
		}
		if (t === "essay" || t === "multi") try {
			let t = (e.url || "").split("/").pop(), n;
			try {
				!(e.url && new URL(e.url, window.location.href).origin === window.location.origin) && t && (n = await fetch("./" + t));
			} catch {}
			if (!n || !n.ok) try {
				n = await fetch(e.url);
			} catch {}
			if ((!n || !n.ok) && t && (n = await fetch("./" + t)), !n || !n.ok) throw Error("HTTP " + (n ? n.status : "failed"));
			let r = await n.text(), i = new DOMParser().parseFromString(r, "text/html"), a = i.querySelector("h1");
			a && a.remove(), i.querySelectorAll(".pp-rights").forEach((e) => e.remove()), D((i.querySelector("body") ? i.querySelector("body").innerHTML : r) + Bl(e));
		} catch {
			D(zl(e, "Rendered article not yet published to GitHub Pages."));
		}
		else D(t === "image" ? (e.image ? `<img src="${e.image}" style="max-width:100%;height:auto;border-radius:4px;display:block;margin:0 auto;">` : "<p style=\"color:#666;\">No image resolved.</p>") + Vl(e) : zl(e) + Vl(e));
	}, B = s(null), ge = s(null), _e = () => {
		B.current = null;
		let e = L.current, t = ge.current;
		if (!e || !t || !i || !i.setReadingProgress) return;
		let n = e.scrollHeight - e.clientHeight;
		i.setReadingProgress(t, n > 0 ? e.scrollTop / n : 1);
	}, ve = () => {
		if (L.current) {
			let { scrollTop: e, scrollHeight: t, clientHeight: n } = L.current, r = t - n, i = r > 0 ? e / r * 100 : 100;
			k(Math.max(0, Math.min(i, 100))), ge.current && (i >= 98 ? (clearTimeout(B.current), _e()) : B.current ||= setTimeout(_e, 350));
		}
	}, ye = () => {
		if (!i || !e) return;
		let t = se(e), n = i.bookmarks(t), r = be(), a = (0, $c.bookmarkTap)(n, r);
		if (n.forEach((e) => i.removeBookmark(e.id)), a === "set") {
			let n = L.current ? L.current.querySelectorAll("p") : [], a = r !== null && n[r] ? n[r].innerText.trim().split(/\s+/).slice(0, 8).join(" ") : "";
			i.addBookmark({
				item: t,
				para: r === null ? void 0 : r,
				quote: a,
				version: e.version
			});
		}
	}, be = () => {
		if (!L.current) return null;
		let e = L.current.getBoundingClientRect(), t = L.current.querySelectorAll("p");
		for (let n = 0; n < t.length; n++) if (t[n].getBoundingClientRect().bottom > e.top + 10) return n;
		return null;
	}, xe = async () => {
		if (!e) return;
		let t = se(e), n = be(), r = window.location.href.split("#")[0] + "#read=" + encodeURIComponent(t);
		n !== null && (r += "&p=" + n);
		try {
			await navigator.clipboard.writeText(r);
		} catch (e) {
			console.error("Copy link failed:", e);
			return;
		}
		F(!0), clearTimeout(I.current), I.current = setTimeout(() => F(!1), 1e3);
	};
	r(() => () => clearTimeout(I.current), []);
	let Se = (e) => {
		if (!L.current || e == null) return;
		let t = L.current.querySelectorAll("p");
		if (t[e]) {
			let n = L.current.getBoundingClientRect(), r = t[e].getBoundingClientRect();
			L.current.scrollTop += r.top - n.top - 20;
		}
	}, Ce = () => {
		if (!e || !L.current || !(0, Qc.allowDownload)(n)) return;
		let t = `${(n?.export?.license_header || "").replace("{{canonical_url}}", e.canonical_url || e.url)}\n\n---\n\n${L.current.innerText}`, r = new Blob([t], { type: "text/markdown" }), i = document.createElement("a");
		i.href = URL.createObjectURL(r), i.download = `${(e.id || e.url).split("/").pop().replace(".html", "") || "article"}.md`, i.click(), URL.revokeObjectURL(i.href);
	};
	r(() => {
		if (clearTimeout(B.current), B.current = null, ge.current = null, !E || !e || e._posted === "title" || !i || !i.readingProgress) return;
		let t = se(e), n = setTimeout(() => {
			let e = L.current;
			if (!e) return;
			let n = i.readingProgress(t), r = e.scrollHeight - e.clientHeight;
			o == null && n.at > .02 && n.at < .98 && r > 0 && (e.scrollTop = n.at * r), ge.current = t, ve(), r <= 0 && _e();
		}, 60);
		return () => clearTimeout(n);
	}, [E]), r(() => {
		E && o != null && L.current && setTimeout(() => {
			Se(o);
		}, 50);
	}, [E, o]);
	let V = (e, t, n) => {
		let r = e.para === void 0 ? e.paragraph : e.para;
		if (r == null) return null;
		if (e.version && t.version && e.version !== t.version) {
			if (t.version_maps && t.version_maps[e.version]) {
				let n = t.version_maps[e.version][r];
				if (n !== void 0 && n !== -1) return n;
			}
			if (e.quote) {
				let t = Array.from(n).map((e) => e.innerText);
				return (0, Xc.resolveParagraph)(r, e.quote, t);
			}
		}
		return r;
	};
	r(() => {
		if (!i || !L.current) return;
		let t = e ? se(e) : null, n = i.bookmarks();
		if (L.current.querySelectorAll(".bookmarkRibbon").forEach((e) => e.remove()), t) {
			let r = n.find((e) => e.item === t);
			if (r) {
				let t = L.current.querySelectorAll("p"), n = V(r, e, t);
				if (n !== null && t[n]) {
					let e = document.createElement("div");
					e.className = "bookmarkRibbon", e.setAttribute("aria-hidden", "true"), e.innerHTML = Jo.bookmark, e.style.position = "absolute", e.style.left = "-30px", e.style.top = "0", e.style.color = "var(--rp-accent)", e.style.width = "20px", e.style.height = "20px", t[n].style.position = "relative", t[n].appendChild(e);
				}
			}
		}
	}, [
		ue,
		i ? i.bookmarks() : null,
		e
	]);
	let we = !!(i && i.readerAid && i.readerAid("followAlong"));
	r(() => {
		if (!(!we || !L.current)) return yl(L.current);
	}, [
		we,
		ue,
		e
	]);
	let Te = a(() => e && l ? (0, Cl.neighbours)(l, e.id) : {
		prev: [],
		next: []
	}, [e, l]), Ee = () => typeof window < "u" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches, De = (e, t) => {
		if (!(!e || !u || !(0, Cl.isReadable)(e))) {
			if (oe.current.forEach(clearTimeout), oe.current = [], Ee()) {
				u(e);
				return;
			}
			ie(t), oe.current.push(setTimeout(() => {
				R(t), u(e), oe.current.push(setTimeout(() => R(null), 520));
			}, 170));
		}
	}, Oe = (t) => {
		if (!e || !l) return;
		let n = (0, Cl.step)(l, e.id, t);
		n && De(n, t);
	}, ke = s(Oe);
	ke.current = Oe, r(() => () => oe.current.forEach(clearTimeout), []);
	let Ae = !!e && g && !v;
	r(() => {
		if (!Ae) return;
		let e = (e) => {
			if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
			let t = e.target;
			t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) || (e.key === "ArrowRight" && (e.preventDefault(), ke.current("next")), e.key === "ArrowLeft" && (e.preventDefault(), ke.current("prev")));
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [Ae]), r(() => {
		let e = L.current;
		if (!Ae || !e) return;
		let t = null, n = (e) => {
			if (e.touches.length !== 1) {
				t = null;
				return;
			}
			let n = e.touches[0], r = !!(e.target && e.target.closest && e.target.closest("p, li, blockquote"));
			t = {
				x: n.clientX,
				y: n.clientY,
				t: Date.now(),
				onText: r
			};
		}, r = (e) => {
			if (!t) return;
			let n = t;
			t = null;
			let r = e.changedTouches && e.changedTouches[0];
			if (!r) return;
			let i = r.clientX - n.x, a = r.clientY - n.y;
			if (Date.now() - n.t > 700 || Math.abs(i) < 70 || Math.abs(a) > Math.abs(i) * .5) return;
			let o = window.getSelection && window.getSelection();
			o && !o.isCollapsed && String(o).trim() || we && n.onText || ke.current(i < 0 ? "next" : "prev");
		}, i = () => {
			t = null;
		};
		return e.addEventListener("touchstart", n, { passive: !0 }), e.addEventListener("touchend", r, { passive: !0 }), e.addEventListener("touchcancel", i, { passive: !0 }), () => {
			e.removeEventListener("touchstart", n), e.removeEventListener("touchend", r), e.removeEventListener("touchcancel", i);
		};
	}, [Ae, we]);
	let je = s(null);
	if (je.current = ye, r(() => {
		let e = () => {
			je.current && je.current();
		};
		return window.addEventListener("postpipe:reader-mark", e), () => window.removeEventListener("postpipe:reader-mark", e);
	}, []), !e) return null;
	let Me = (e, t) => {
		let n = (0, Cl.navStatus)(l, e), r = /* @__PURE__ */ p(il, {
			body: (0, sl.iconBody)(t === "next" ? "arrow-right" : "arrow-left"),
			size: 16,
			className: J.navArrow
		}), i = t === "next" ? /* @__PURE__ */ m(f, { children: [/* @__PURE__ */ p("span", {
			className: J.navTitle,
			children: e.title
		}), r] }) : /* @__PURE__ */ m(f, { children: [r, /* @__PURE__ */ p("span", {
			className: J.navTitle,
			children: e.title
		})] });
		return n ? /* @__PURE__ */ m("div", {
			className: `${J.navItem} ${J.navLocked} ${t === "next" ? J.navNext : ""}`,
			"data-reader-nav": t,
			"data-nav-status": !0,
			children: [/* @__PURE__ */ p("span", {
				className: J.navLine,
				children: i
			}), /* @__PURE__ */ p("span", {
				className: J.navStatus,
				children: n
			})]
		}, e.id) : /* @__PURE__ */ p("button", {
			className: `${J.navItem} ${t === "next" ? J.navNext : ""}`,
			"data-reader-nav": t,
			onClick: () => De(e, t),
			title: e.title,
			children: /* @__PURE__ */ p("span", {
				className: J.navLine,
				children: i
			})
		}, e.id);
	}, Ne = (e) => (Te.prev.length > 0 || Te.next.length > 0) && /* @__PURE__ */ m("nav", {
		className: e === "top" ? J.navTop : J.navBottom,
		"aria-label": "Chapters either side",
		"data-reader-nav-row": e,
		...e === "bottom" ? { "data-reader-nav-bottom": "" } : {},
		children: [/* @__PURE__ */ p("span", {
			className: J.navSide,
			children: Te.prev.map((e) => Me(e, "prev"))
		}), /* @__PURE__ */ p("span", {
			className: `${J.navSide} ${J.navSideNext}`,
			children: Te.next.map((e) => Me(e, "next"))
		})]
	}), Pe = [e.date ? (/* @__PURE__ */ new Date(`${e.date}T00:00:00`)).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	}) : "", e.reading_time].filter(Boolean), Fe = (0, Zc.byline)(n, e), Ie = Fe ? Fe.name : "", Le = Fe ? Fe.url : null, Re = (0, qo.readerHeader)(n, e), ze = (0, Qc.progressBarMode)(n), Be = (0, Qc.allowDownload)(n), Ve = (0, vc.rightsLine)(n && n.rights), He = (0, kc.nonTagReferences)(e);
	return /* @__PURE__ */ m(f, { children: [
		/* @__PURE__ */ p("div", {
			className: `${J.overlay} ${g && !v ? J.open : ""}`,
			onClick: t
		}),
		/* @__PURE__ */ m("div", {
			"data-reader-panel": !0,
			className: `${J.panel} ${g && !v ? J.open : ""} ${v ? J.minimized : ""} ${A ? J.wide : ""} ${M ? J.full : ""}`,
			style: b ? { transform: `translate3d(${b.x}px, ${b.y}px, 0px)` } : void 0,
			children: [
				ze !== "none" && /* @__PURE__ */ p("div", {
					className: ze === "side" ? J.progressSide : J.progress,
					role: "progressbar",
					"aria-label": "Reading progress",
					"aria-valuemin": 0,
					"aria-valuemax": 100,
					"aria-valuenow": Math.round(O),
					children: /* @__PURE__ */ p("div", {
						className: J.progressFill,
						style: ze === "side" ? { height: `${O}%` } : { width: `${O}%` }
					})
				}),
				/* @__PURE__ */ m("div", {
					className: J.toolbar,
					onMouseDown: fe,
					onDoubleClick: () => x(null),
					title: "Drag to move the reader · Double-click to put it back",
					"data-reader-header": !0,
					children: [
						/* @__PURE__ */ p("div", {
							className: J.dragGrip,
							"aria-hidden": "true",
							children: "⋮⋮"
						}),
						/* @__PURE__ */ p("div", {
							id: "tts-mount-point",
							className: `${J.toolbarGroup} ${J.ttsMount}`
						}),
						/* @__PURE__ */ m("div", {
							className: J.toolbarGroup,
							children: [
								/* @__PURE__ */ m("button", {
									className: `${J.tb} ${J.tbLabeled} ${ce.length > 0 ? J.active : ""}`,
									onClick: ye,
									"aria-pressed": ce.length > 0,
									title: ce.length > 0 ? "Bookmark the paragraph at the top (it replaces this chapter's bookmark), or take it away where it is" : "Bookmark the paragraph at the top of the reader",
									"data-bookmark-toggle": !0,
									children: [/* @__PURE__ */ p(il, {
										body: (0, sl.iconBody)("bookmark"),
										size: 17
									}), /* @__PURE__ */ p("span", {
										className: J.tbText,
										children: "Bookmark"
									})]
								}),
								(0, Qc.bookmarksList)(n) && /* @__PURE__ */ p("button", {
									className: `${J.tb} ${w ? J.active : ""}`,
									onClick: () => T((e) => !e),
									"aria-expanded": w,
									title: "Every place you have bookmarked",
									"aria-label": "Bookmarks",
									"data-bookmark-list": !0,
									children: /* @__PURE__ */ p(il, {
										body: (0, sl.iconBody)("list"),
										size: 17
									})
								}),
								/* @__PURE__ */ p("button", {
									className: J.tb,
									onClick: xe,
									title: "Copy a link to here",
									"aria-label": "Copy a link to here",
									"data-reader-link": !0,
									children: /* @__PURE__ */ p(il, {
										body: (0, sl.iconBody)("link"),
										size: 17
									})
								}),
								P && /* @__PURE__ */ p("span", {
									className: J.copied,
									role: "status",
									"data-reader-copied": !0,
									children: "copied"
								}),
								/* @__PURE__ */ p("button", {
									className: `${J.tb} ${S ? J.active : ""}`,
									onClick: () => C(!S),
									title: "Details",
									"aria-label": "Details",
									"aria-pressed": S,
									"data-reader-details": !0,
									children: /* @__PURE__ */ p(il, {
										body: (0, sl.iconBody)("info"),
										size: 17
									})
								}),
								Be && /* @__PURE__ */ p("button", {
									className: J.tb,
									onClick: Ce,
									title: "Download",
									"aria-label": "Download",
									"data-reader-download": !0,
									children: /* @__PURE__ */ p(il, {
										body: (0, sl.iconBody)("download"),
										size: 17
									})
								}),
								Object.entries(e.syndication || {}).map(([e, t]) => {
									if (!t) return null;
									let r = n?.toolbar?.syndication_icons?.[e];
									return r ? /* @__PURE__ */ p("a", {
										href: t,
										target: "_blank",
										rel: "noopener noreferrer",
										className: `${J.tb} ${J.syndLink}`,
										title: r.label,
										"aria-label": r.label,
										dangerouslySetInnerHTML: { __html: Jo[r.icon] || Jo.globe }
									}, e) : null;
								})
							]
						}),
						/* @__PURE__ */ p("div", { className: J.toolbarSpacer }),
						/* @__PURE__ */ m("div", {
							className: J.windowControls,
							"data-reader-window": !0,
							children: [
								/* @__PURE__ */ p("button", {
									className: J.tb,
									onClick: () => window.dispatchEvent(new CustomEvent("postpipe:toggle-settings", { detail: { where: "reader" } })),
									title: "Reading settings",
									"aria-label": "Reading settings",
									"data-reader-settings": !0,
									children: /* @__PURE__ */ p(il, {
										body: (0, sl.iconBody)("sliders-horizontal"),
										size: 17
									})
								}),
								/* @__PURE__ */ p("button", {
									className: `${J.tb} ${J.growBtn} ${A ? J.active : ""}`,
									onClick: () => j((e) => !e),
									"aria-pressed": A,
									title: A ? "Narrower" : "Wider",
									"aria-label": A ? "Narrower" : "Wider",
									"data-reader-grow": !0,
									children: /* @__PURE__ */ p(il, {
										body: (0, sl.iconBody)("move-horizontal"),
										size: 17
									})
								}),
								/* @__PURE__ */ p("button", {
									className: `${J.tb} ${M ? J.active : ""}`,
									onClick: () => {
										N((e) => !e), x(null);
									},
									"aria-pressed": M,
									title: M ? "Back to the side" : "Fill the window",
									"aria-label": M ? "Back to the side" : "Fill the window",
									"data-reader-expand": !0,
									children: /* @__PURE__ */ p(il, {
										body: (0, sl.iconBody)(M ? "minimize-2" : "maximize-2"),
										size: 17
									})
								}),
								/* @__PURE__ */ p("button", {
									className: J.tb,
									onClick: () => y(!0),
									title: "Minimise the reader",
									"aria-label": "Minimise the reader",
									"data-reader-minimise": !0,
									children: /* @__PURE__ */ p(il, {
										body: (0, sl.iconBody)("minus"),
										size: 17
									})
								})
							]
						})
					]
				}),
				/* @__PURE__ */ p("button", {
					className: J.closeX,
					onClick: t,
					title: "Close the reader",
					"aria-label": "Close the reader",
					"data-reader-close": !0,
					children: /* @__PURE__ */ p(il, {
						body: (0, sl.iconBody)("x"),
						size: 20
					})
				}),
				S && /* @__PURE__ */ p(Hl, {
					article: e,
					settings: n
				}),
				w && (0, Qc.bookmarksList)(n) && /* @__PURE__ */ p(rl, {
					viewState: i,
					feedData: l,
					itemId: z
				}),
				/* @__PURE__ */ m("div", {
					className: `${J.body} ${we ? J.following : ""} ${re ? J["turnOut_" + re] : ""} ${ae ? J["turnIn_" + ae] : ""}`,
					"data-tts-target": !0,
					"data-follow-along": we ? "on" : "off",
					ref: L,
					onScroll: ve,
					children: [
						Ne("top"),
						/* @__PURE__ */ m("div", {
							className: J.articleHeader,
							children: [
								Re.kicker && /* @__PURE__ */ p("div", {
									className: J.articleKicker,
									children: Re.kicker
								}),
								/* @__PURE__ */ p("h1", {
									className: J.articleTitle,
									children: e.title || e.label
								}),
								Re.byline && Ie && /* @__PURE__ */ m("div", {
									className: J.articleByline,
									children: ["by ", Le ? /* @__PURE__ */ p("a", {
										href: Le,
										target: "_blank",
										rel: "noopener noreferrer",
										children: Ie
									}) : Ie]
								}),
								Pe.length > 0 && /* @__PURE__ */ p("div", {
									className: J.articleMeta,
									children: Pe.join(" · ")
								})
							]
						}),
						/* @__PURE__ */ p("div", {
							ref: ee,
							"data-reader-text": !0,
							dangerouslySetInnerHTML: de
						}),
						He.length > 0 && E && e._posted !== "title" && /* @__PURE__ */ m("div", {
							style: {
								marginTop: 24,
								paddingTop: 16,
								borderTop: "1px solid var(--rp-border)"
							},
							"data-reader-references": !0,
							children: [/* @__PURE__ */ p("div", {
								style: {
									color: "var(--rp-accent)",
									fontSize: 11,
									textTransform: "uppercase",
									letterSpacing: "0.05em",
									marginBottom: 8
								},
								children: "references"
							}), /* @__PURE__ */ p("div", {
								style: {
									display: "flex",
									flexWrap: "wrap",
									gap: 6
								},
								children: He.map((e, t) => /* @__PURE__ */ m("span", {
									className: J.fmTag,
									"data-reference-type": e.type,
									"data-reference-weight": e.weight,
									title: e.why || `${e.type}: ${e.value}${e.weight === 1 ? "" : ` (${e.weight})`}`,
									children: [
										e.type,
										": ",
										e.label || e.value,
										e.weight === 1 ? "" : ` (${e.weight})`
									]
								}, `${e.type}:${e.value}:${t}`))
							})]
						}),
						E && Ne("bottom"),
						Ve && E && /* @__PURE__ */ p("footer", {
							className: J.rightsLine,
							"data-reader-rights": !0,
							children: Ve
						}),
						h && E && e._posted !== "title" && /* @__PURE__ */ p(kl, {
							article: e,
							contributions: d || [],
							config: h,
							feedData: l,
							textRef: ee,
							textKey: ue,
							onOpenChapter: (e) => De(e, "next")
						})
					]
				})
			]
		}),
		v && e && /* @__PURE__ */ m("div", {
			className: J.restorePill,
			onClick: () => y(!1),
			title: "Bring reading window back",
			children: [
				/* @__PURE__ */ p("span", {
					className: J.pillIcon,
					children: /* @__PURE__ */ p(il, {
						body: (0, sl.iconBody)("bookmark"),
						size: 18
					})
				}),
				/* @__PURE__ */ m("span", {
					className: J.pillLabel,
					children: [/* @__PURE__ */ p("span", {
						className: J.pillTitle,
						children: e.title || e.label
					}), Ie && /* @__PURE__ */ m("span", {
						className: J.pillAuthor,
						children: ["by ", Ie]
					})]
				}),
				/* @__PURE__ */ p("span", {
					className: J.pillAction,
					children: "Restore"
				})
			]
		})
	] });
}
function Pl(e) {
	return String(e).replace(/[&<>"']/g, (e) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;"
	})[e]);
}
function Fl(e) {
	return e._source || e.originalItem && e.originalItem._source || null;
}
function Il(e) {
	let t = Fl(e);
	return t ? t.type !== "local" : (e.kind === "text" || e.kind === "link") && typeof e.content_html == "string";
}
function Ll(e) {
	let t = new DOMParser().parseFromString(String(e), "text/html");
	t.querySelectorAll("script, style, iframe, object, embed, link, meta, form, noscript").forEach((e) => e.remove()), t.querySelectorAll("*").forEach((e) => {
		for (let t of Array.from(e.attributes)) {
			let n = t.name.toLowerCase();
			(n.startsWith("on") || (n === "href" || n === "src" || n === "xlink:href") && /^\s*javascript:/i.test(t.value)) && e.removeAttribute(t.name);
		}
	});
	let n = t.querySelector("body");
	return n ? n.innerHTML : "";
}
function Rl(e) {
	let t = "";
	if (typeof e.content_html == "string" && e.content_html.trim()) {
		let n = Ll(e.content_html);
		t += /<(p|div|ul|ol|h[1-6]|blockquote|pre|table|figure|section|article)\b/i.test(n) ? n : `<p>${n}</p>`;
	} else (e.tldr || e.summary) && (t += `<p>${Pl(e.tldr || e.summary)}</p>`);
	let n = e.canonical_url || e.url || "";
	if (n) {
		let r = Fl(e), i = r && r.title || "";
		if (!i) try {
			i = new URL(n).hostname;
		} catch {
			i = "";
		}
		t += `<p data-reader-link-out><a href="${Pl(n)}" target="_blank" rel="noopener noreferrer">Read the whole piece${i ? " at " + Pl(i) : ""}</a></p>`;
	}
	return t;
}
function zl(e, t) {
	let n = t || `This substrate ("${e.kind || "unknown"}") is not yet renderable in the viewer.`, r = "<div style=\"padding:24px;border:1px dashed var(--rp-border);border-radius:6px;background:rgba(17,24,39,0.4);\">";
	r += `<p style="color:var(--rp-accent);font-weight:600;margin-bottom:8px;">${n}</p>`, e.todos && e.todos.length && (r += `<p style="color:#f39c12;font-size:13px;">Pending: ${e.todos.join(", ")}</p>`);
	let i = (e.url || e.id || "").split("/").pop().replace(".html", ""), a = e._source?.path || `chapters/${i}`;
	return r += `<p style="color:#888;font-size:13px;margin-top:12px;">The bundle exists at <code>${a}</code>.</p>`, r += "</div>", r;
}
function Bl(e) {
	let t = e.forms && e.forms.companions || [];
	if (!t.length) return "";
	let n = "<div style=\"margin-top:32px;padding-top:24px;border-top:1px solid var(--rp-border);\">";
	return n += "<div style=\"color:var(--rp-accent);font-size:11px;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;\">also exists as</div>", n += `<div style="color:var(--rp-text);font-size:14px;">${t.map((e) => `<span class="${J.fmTag}">${e}</span>`).join(" ")}</div>`, n += "</div>", n;
}
function Vl(e) {
	let t = [];
	if (e.seed && t.push(["seed", e.seed]), e.tldr && t.push(["tldr", e.tldr]), e.topology && e.topology.length && t.push(["topology", e.topology.join(" · ")]), e.energy && t.push(["energy", e.energy]), e.note && t.push(["note", e.note]), !t.length) return "";
	let n = "<div style=\"margin-top:32px;padding:20px;background:rgba(17,24,39,0.4);border-radius:6px;\">";
	for (let [e, r] of t) n += `<div class="${J.fmRow}"><span class="${J.fmLabel}">${e}</span><span class="${J.fmValue}">${r}</span></div>`;
	return n += "</div>", n;
}
function Hl({ article: e, settings: n }) {
	let r = n?.frontmatter_display || [], i = (0, kc.nonTagReferences)(e), a = i.length && !r.includes("references") ? [...r, "references"] : r, o = !1, s = a.map((n) => {
		let r = "";
		switch (n) {
			case "publish_date":
				e.date && (r = (/* @__PURE__ */ new Date(`${e.date}T00:00:00`)).toLocaleDateString("en-US", {
					year: "numeric",
					month: "long",
					day: "numeric"
				}));
				break;
			case "updated_date":
				e.updated_date && (r = e.updated_date);
				break;
			case "reading_time":
				r = e.reading_time || "";
				break;
			case "tags": {
				let t = (0, Dc.tagReferences)(e);
				if (t.length) r = /* @__PURE__ */ p(f, { children: t.map((e) => /* @__PURE__ */ p("span", {
					className: J.fmTag,
					"data-concept": typeof e.concept == "string" && e.concept ? e.concept : void 0,
					"data-origin": typeof e.origin == "string" && e.origin ? e.origin : void 0,
					"data-weight": typeof e.weight == "number" && Number.isFinite(e.weight) ? e.weight : void 0,
					title: typeof e.why == "string" && e.why ? [...(0, Tc.wrapText)(e.why), ...(0, Tc.provenanceLines)(e)].join("\n") : void 0,
					children: e.value
				}, e.value)) });
				else {
					let t = (0, Ml.untaggedBecauseOf)(e);
					t && (r = /* @__PURE__ */ p("span", {
						className: J.fmUntagged,
						"data-untagged-because": !0,
						children: t
					}));
				}
				break;
			}
			case "references":
				i.length && (r = /* @__PURE__ */ p(f, { children: i.map((e, t) => /* @__PURE__ */ m("span", {
					className: J.fmTag,
					"data-reference-type": e.type,
					"data-reference-weight": e.weight,
					title: e.why || `${e.type}: ${e.value}${e.weight === 1 ? "" : ` (${e.weight})`}`,
					children: [
						e.type,
						": ",
						e.label || e.value,
						e.weight === 1 ? "" : ` (${e.weight})`
					]
				}, `${e.type}:${e.value}:${t}`)) }));
				break;
			case "series":
				r = e.series || "";
				break;
			case "license":
				r = e.license || "";
				break;
			case "syndication":
				let n = e.syndication || {}, a = Object.entries(n).filter(([, e]) => e);
				a.length && (r = /* @__PURE__ */ p(f, { children: a.map(([e, n], r) => /* @__PURE__ */ m(t.Fragment, { children: [/* @__PURE__ */ p("a", {
					className: J.fmSyndLink,
					href: n,
					target: "_blank",
					rel: "noopener noreferrer",
					children: e
				}), r < a.length - 1 ? " · " : ""] }, e)) }));
				break;
			default: break;
		}
		return r ? (o = !0, /* @__PURE__ */ m("div", {
			className: J.fmRow,
			children: [/* @__PURE__ */ p("span", {
				className: J.fmLabel,
				children: n.replace(/_/g, " ")
			}), /* @__PURE__ */ p("span", {
				className: J.fmValue,
				children: r
			})]
		}, n)) : null;
	});
	return /* @__PURE__ */ p("div", {
		className: `${J.frontmatterPanel} ${J.open}`,
		children: o ? s : /* @__PURE__ */ p("div", {
			className: J.fmRow,
			children: /* @__PURE__ */ p("span", {
				className: J.fmValue,
				style: { color: "#666" },
				children: "No metadata available."
			})
		})
	});
}
var X = {
	bar: "_bar_sdfpt_6",
	pill: "_pill_sdfpt_20",
	title: "_title_sdfpt_61",
	count: "_count_sdfpt_62",
	pagePill: "_pagePill_sdfpt_84",
	folderPill: "_folderPill_sdfpt_92",
	folderPrefix: "_folderPrefix_sdfpt_100",
	pillIcon: "_pillIcon_sdfpt_108",
	iconOnly: "_iconOnly_sdfpt_113",
	subscribe: "_subscribe_sdfpt_123",
	pillOn: "_pillOn_sdfpt_131",
	views: "_views_sdfpt_135",
	subscribeSheet: "_subscribeSheet_sdfpt_144",
	subscribeForm: "_subscribeForm_sdfpt_166",
	subscribeInput: "_subscribeInput_sdfpt_172",
	subscribeSubmit: "_subscribeSubmit_sdfpt_185",
	subscribeMessage: "_subscribeMessage_sdfpt_203",
	subscribeOk: "_subscribeOk_sdfpt_214",
	subscribeError: "_subscribeError_sdfpt_218",
	pageLabel: "_pageLabel_sdfpt_227",
	hidden: "_hidden_sdfpt_241",
	failed: "_failed_sdfpt_249",
	dot: "_dot_sdfpt_249",
	staleMark: "_staleMark_sdfpt_262",
	staleAge: "_staleAge_sdfpt_261",
	dotWrap: "_dotWrap_sdfpt_285",
	dotActive: "_dotActive_sdfpt_321",
	ringBackdrop: "_ringBackdrop_sdfpt_326",
	ring: "_ring_sdfpt_326",
	swatch: "_swatch_sdfpt_342",
	swatchCurrent: "_swatchCurrent_sdfpt_362",
	addPill: "_addPill_sdfpt_383",
	plus: "_plus_sdfpt_389",
	addOpen: "_addOpen_sdfpt_400",
	addInput: "_addInput_sdfpt_407",
	addClose: "_addClose_sdfpt_424",
	addSubmit: "_addSubmit_sdfpt_440",
	ready: "_ready_sdfpt_461",
	resultPanel: "_resultPanel_sdfpt_472",
	resultClose: "_resultClose_sdfpt_494",
	resultTitle: "_resultTitle_sdfpt_509",
	resultUrl: "_resultUrl_sdfpt_516",
	resultSection: "_resultSection_sdfpt_525",
	resultLabel: "_resultLabel_sdfpt_532",
	resultBox: "_resultBox_sdfpt_541",
	code: "_code_sdfpt_551",
	codeInline: "_codeInline_sdfpt_561",
	copyBtn: "_copyBtn_sdfpt_570",
	copied: "_copied_sdfpt_587",
	resultHint: "_resultHint_sdfpt_593",
	intro: "_intro_sdfpt_604",
	resultLink: "_resultLink_sdfpt_640"
}, Ul = (/* @__PURE__ */ h(((e, t) => {
	var { siteIcon: n } = al(), { isLinkItem: r } = Ps(), i = (e) => typeof e == "string" ? e.trim() : "";
	function a(e) {
		let t = i(e);
		return t ? /^(https?:|mailto:)/i.test(t) ? t : /^[a-z][a-z0-9+.-]*:/i.test(t) ? "" : t : "";
	}
	function o(e) {
		let t = e && e.topBar && typeof e.topBar == "object" ? e.topBar : {};
		return {
			pages: (Array.isArray(t.pages) ? t.pages : []).filter((e) => e && typeof e == "object" && i(e.id)).map((e) => {
				let t = n(e.icon);
				return {
					id: i(e.id),
					label: i(e.label) || i(e.id),
					hideFromGraph: e.hideFromGraph === !0,
					icon: t,
					showLabel: !t || e.showLabel !== !1
				};
			}),
			links: (Array.isArray(t.links) ? t.links : []).filter((e) => e && typeof e == "object" && a(e.href) && (i(e.label) || i(e.id))).map((e, t) => {
				let r = n(e.icon), o = i(e.label) || i(e.id);
				return {
					id: i(e.id) || `link-${t + 1}`,
					label: o,
					href: a(e.href),
					icon: r,
					newTab: e.newTab === !0,
					showLabel: !r || e.showLabel === !0
				};
			}),
			subscribe: d(t.subscribe),
			addFeed: t.addFeed !== !1,
			showSourcePills: t.showSourcePills !== !1,
			resume: s(t.resume),
			order: Array.isArray(t.order) ? t.order.map(i).filter(Boolean) : []
		};
	}
	function s(e) {
		if (!e || typeof e != "object") return null;
		let t = n(e.icon);
		return {
			id: "resume",
			label: i(e.label) || "read",
			icon: t,
			showLabel: !t || e.showLabel === !0,
			start: i(e.start)
		};
	}
	function c(e) {
		let t = e || {}, n = [];
		t.resume && n.push("resume");
		for (let e of t.pages || []) n.push(`page:${e.id}`);
		for (let e of t.links || []) n.push(`link:${e.id}`);
		t.subscribe && n.push("subscribe");
		let r = (e) => e === "resume" || e === "subscribe" ? e : n.includes(`page:${e}`) ? `page:${e}` : n.includes(`link:${e}`) ? `link:${e}` : null, i = [];
		for (let e of t.order || []) {
			let t = r(e);
			t && n.includes(t) && !i.includes(t) && i.push(t);
		}
		for (let e of n) i.includes(e) || i.push(e);
		return i;
	}
	function l(e, t, n) {
		let i = Array.isArray(e) ? e : [], a = new Set((n && n.pages || []).map((e) => e.id)), o = (e) => a.has(e.id) || a.has(m(e)), s = (e) => r(e), c = i.filter((e) => e && e.id && !o(e) && !s(e)), l = t && typeof t == "object" ? t : {}, u = null, d = -Infinity;
		for (let e of c) {
			let t = l[e.id];
			if (!t) continue;
			let n = Number(t.max) > 0 || Number(t.at) > 0 || Number(t.scroll) > 0, r = Number(t.t);
			n && Number.isFinite(r) && r > d && (d = r, u = e);
		}
		if (u) return u;
		let f = n && n.resume && n.resume.start;
		if (f) {
			let e = c.find((e) => e.id === f || m(e) === f);
			if (e) return e;
		}
		return c[0] || null;
	}
	var u = {
		method: "POST",
		field: "email",
		label: "Subscribe",
		placeholder: "Email address",
		thanks: "Thank you.",
		error: "Something went wrong. Please try again."
	};
	function d(e) {
		if (!e || typeof e != "object") return null;
		let t = a(e.action);
		if (!t || /^mailto:/i.test(t)) return null;
		let r = i(e.method).toUpperCase();
		return {
			action: t,
			method: /^(POST|PUT|PATCH)$/.test(r) ? r : u.method,
			field: i(e.field) || u.field,
			label: i(e.label) || u.label,
			icon: n(e.icon),
			placeholder: i(e.placeholder) || u.placeholder,
			thanks: i(e.thanks) || u.thanks,
			error: i(e.error) || u.error,
			newTab: e.newTab === !0
		};
	}
	function f(e, t, n) {
		return t >= 200 && t < 300 ? {
			ok: !0,
			message: e.thanks
		} : {
			ok: !1,
			message: (n && typeof n == "object" && typeof n.error == "string" ? n.error.trim() : "") || e.error
		};
	}
	async function p(e, t, n) {
		let r = n || (typeof fetch < "u" ? fetch : null);
		if (!e || !r) return {
			ok: !1,
			message: e && e.error || u.error
		};
		let i;
		try {
			i = await r(e.action, {
				method: e.method,
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json"
				},
				body: JSON.stringify({ [e.field]: String(t || "").trim() })
			});
		} catch {
			return {
				ok: !1,
				message: e.error
			};
		}
		let a = null;
		try {
			a = await i.json();
		} catch {
			a = null;
		}
		return f(e, i.status, a);
	}
	var m = (e) => String(e && (e.url || e.id) || "").split("/").pop().replace(/\.html$/, "");
	function h(e, t) {
		let n = e || [];
		return n.find((e) => e && e.id === t) || n.find((e) => e && m(e) === t) || null;
	}
	function g(e, t) {
		return (e && e.pages || []).map((e) => ({
			...e,
			item: h(t, e.id)
		})).filter((e) => e.item);
	}
	function _(e, t) {
		if (!e) return e;
		let n = new Set(g(t, e.items).filter((e) => e.hideFromGraph).map((e) => e.item.id));
		if (!n.size) return e;
		let r = new Set((e.items || []).filter((e) => n.has(e.id)).map((e) => e.url).filter(Boolean)), i = (e) => n.has(e) || r.has(e);
		return {
			...e,
			items: (e.items || []).filter((e) => !n.has(e.id)),
			edges: (e.edges || []).filter((e) => !i(e.source) && !i(e.target))
		};
	}
	t.exports = {
		topBarConfig: o,
		findItem: h,
		resolvePages: g,
		graphFeed: _,
		slugOf: m,
		safeHref: a,
		subscribeConfig: d,
		subscribeResult: f,
		subscribe: p,
		resumeConfig: s,
		topBarOrder: c,
		resumeTarget: l
	};
})))();
function Wl({ config: e }) {
	let [t, n] = c(!1), [a, o] = c(""), [l, u] = c(!1), [d, f] = c(null), h = s(null), g = s(null), _ = s(null), v = s(null), y = (e) => {
		n(!1), e && g.current && g.current.focus();
	};
	return i(() => {
		if (!t || !_.current) return;
		let e = g.current ? g.current.getBoundingClientRect().bottom : 36, n = document.querySelector("[data-settings-gear]");
		n && (e = Math.max(e, n.getBoundingClientRect().bottom)), _.current.style.top = `${Math.round(e + 8)}px`, v.current && v.current.focus({ preventScroll: !0 });
	}, [t]), r(() => {
		if (!t) return;
		let e = (e) => {
			h.current && !h.current.contains(e.target) && n(!1);
		}, r = (e) => {
			e.key === "Escape" && (e.preventDefault(), e.stopImmediatePropagation(), y(!0));
		};
		return document.addEventListener("pointerdown", e, !0), window.addEventListener("keydown", r, !0), () => {
			document.removeEventListener("pointerdown", e, !0), window.removeEventListener("keydown", r, !0);
		};
	}, [t]), /* @__PURE__ */ m("div", {
		ref: h,
		className: X.subscribe,
		"data-top-subscribe-wrap": !0,
		children: [/* @__PURE__ */ p("button", {
			ref: g,
			type: "button",
			className: `${X.pill} ${X.pagePill} ${e.icon ? X.iconOnly : ""} ${t ? X.pillOn : ""}`,
			"aria-label": e.label,
			title: e.label,
			"aria-haspopup": "dialog",
			"aria-expanded": t,
			"data-top-subscribe": !0,
			"data-has-icon": e.icon ? "" : void 0,
			onClick: () => {
				f(null), n((e) => !e);
			},
			children: e.icon ? /* @__PURE__ */ p(il, {
				body: e.icon,
				size: 15,
				className: X.pillIcon
			}) : /* @__PURE__ */ p("span", {
				className: X.title,
				children: e.label
			})
		}), t && /* @__PURE__ */ m("div", {
			ref: _,
			className: X.subscribeSheet,
			role: "dialog",
			"aria-label": e.label,
			"data-top-subscribe-sheet": !0,
			children: [/* @__PURE__ */ m("form", {
				className: X.subscribeForm,
				onSubmit: async (t) => {
					if (e.newTab || (t.preventDefault(), l)) return;
					u(!0), f(null);
					let n = await (0, Ul.subscribe)(e, a);
					u(!1), f(n), n.ok && o("");
				},
				...e.newTab ? {
					action: e.action,
					method: "post",
					target: "_blank",
					rel: "noopener"
				} : {},
				children: [/* @__PURE__ */ p("input", {
					ref: v,
					className: X.subscribeInput,
					type: "email",
					name: e.field,
					required: !0,
					autoComplete: "email",
					placeholder: e.placeholder,
					"aria-label": e.placeholder,
					value: a,
					onChange: (e) => o(e.target.value)
				}), /* @__PURE__ */ p("button", {
					type: "submit",
					className: X.subscribeSubmit,
					disabled: l,
					"data-top-subscribe-submit": !0,
					children: e.label
				})]
			}), /* @__PURE__ */ p("p", {
				className: `${X.subscribeMessage} ${d ? d.ok ? X.subscribeOk : X.subscribeError : ""}`,
				role: "status",
				"aria-live": "polite",
				"data-top-subscribe-message": !0,
				children: d ? d.message : ""
			})]
		})]
	});
}
//#endregion
//#region src/lib/sourceStatus.js
var Gl = /* @__PURE__ */ h(((e, t) => {
	var n = 3600 * 1e3, r = 24 * n, i = (e, t) => `${e} ${t}${e === 1 ? "" : "s"}`;
	function a(e, t = Date.now()) {
		let a = Date.parse(e), o = t instanceof Date ? t.getTime() : Number(t);
		if (!Number.isFinite(a) || !Number.isFinite(o)) return null;
		let s = Math.max(0, o - a);
		if (s < n) return {
			ms: s,
			short: "<1h",
			long: "less than an hour old"
		};
		if (s < 2 * r) {
			let e = Math.floor(s / n);
			return {
				ms: s,
				short: `${e}h`,
				long: `${i(e, "hour")} old`
			};
		}
		if (s < 14 * r) {
			let e = Math.floor(s / r);
			return {
				ms: s,
				short: `${e}d`,
				long: `${i(e, "day")} old`
			};
		}
		if (s < 60 * r) {
			let e = Math.floor(s / (7 * r));
			return {
				ms: s,
				short: `${e}w`,
				long: `${i(e, "week")} old`
			};
		}
		let c = Math.floor(s / (30 * r));
		return {
			ms: s,
			short: `${c}mo`,
			long: `${i(c, "month")} old`
		};
	}
	function o(e) {
		let t = Date.parse(e);
		if (!Number.isFinite(t)) return null;
		let n = new Date(t), r = (e) => String(e).padStart(2, "0");
		return `${n.getFullYear()}-${r(n.getMonth() + 1)}-${r(n.getDate())}`;
	}
	function s(e, t = Date.now()) {
		if (!e || typeof e != "object") return null;
		let n = typeof e.error == "string" && e.error.trim() ? e.error.trim() : "", r = n ? ` (${n})` : "";
		if (e.stale === !0) {
			let n = o(e.copyDate), i = a(e.copyDate, t);
			return {
				kind: "stale",
				date: n,
				age: i,
				note: `Not fetched for this build${r}; these cards are from ${n ? `the copy of ${n}${i ? `, ${i.long}` : ""}` : "an earlier copy"}`
			};
		}
		return e.ok === !1 ? {
			kind: "failed",
			date: null,
			age: null,
			note: `Not fetched for this build${r}, and there is no earlier copy`
		} : null;
	}
	t.exports = {
		sourceStatus: s,
		copyAge: a,
		copyDay: o
	};
})), Kl = /* @__PURE__ */ h(((e, t) => {
	var n = new Set([
		"application/rss+xml",
		"application/atom+xml",
		"application/feed+json"
	]);
	function r(e) {
		return !e || typeof e != "object" ? !0 : !(e.topBar && typeof e.topBar == "object" && e.topBar.autodiscover === !1 || e.autodiscover === !1);
	}
	function i(e) {
		let t = {}, n = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g, r;
		for (; (r = n.exec(e)) !== null;) {
			let e = r[1].toLowerCase();
			t[e] = r[2] === void 0 ? r[3] === void 0 ? r[4] : r[3] : r[2];
		}
		return t;
	}
	function a(e) {
		return String(e || "").replace(/&amp;/gi, "&").replace(/&#38;/g, "&").replace(/&#x26;/gi, "&").replace(/&quot;/gi, "\"").replace(/&#39;/g, "'");
	}
	function o(e) {
		if (typeof e != "string") return !1;
		let t = e.slice(0, 65536).trimStart();
		return !t || /^<\?xml\b[^>]*>?\s*<(rss|feed|rdf:RDF)\b/i.test(t) || /^<(rss|feed|rdf:RDF)\b/i.test(t) || t.startsWith("{") ? !1 : /<(?:!doctype\s+html|html|head|link)\b/i.test(t);
	}
	function s(e, t) {
		if (!o(e) || !t) return null;
		let r = e.slice(0, 65536), s = /<link\b[^>]*>/gi, c;
		for (; (c = s.exec(r)) !== null;) {
			let e = i(c[0]);
			if (!String(e.rel || "").toLowerCase().trim().split(/\s+/).includes("alternate")) continue;
			let r = String(e.type || "").toLowerCase().split(";")[0].trim();
			if (!n.has(r)) continue;
			let o = a(e.href || "").trim();
			if (o) try {
				let e = new URL(o, t);
				if (e.protocol === "http:" || e.protocol === "https:") return e.href;
			} catch {}
		}
		return null;
	}
	async function c(e, t = {}) {
		let n = typeof e == "string" ? e.trim() : "";
		if (!n || t.autodiscover === !1) return n;
		let r = t.fetchImpl || (typeof fetch < "u" ? fetch : null);
		if (typeof r != "function") return n;
		try {
			let e = await r(n, { headers: { Accept: "text/html,application/xhtml+xml,*/*;q=0.8" } }), t = "", i = n;
			if (typeof e == "string") t = e;
			else if (e && typeof e == "object") {
				if (e.ok === !1) return n;
				typeof e.url == "string" && e.url && (i = e.url), typeof e.text == "function" ? t = await e.text() : typeof e.body == "string" && (t = e.body);
			}
			return s(t, i) || n;
		} catch {
			return n;
		}
	}
	function l(e) {
		if (!o(e)) return "";
		let t = e.slice(0, 65536), n = /<meta\b[^>]*>/gi, r;
		for (; (r = n.exec(t)) !== null;) {
			let e = i(r[0]), t = String(e.property || e.name || "").toLowerCase();
			if ((t === "og:title" || t === "twitter:title") && e.content) return a(e.content).trim();
		}
		let s = /<title\b[^>]*>([\s\S]*?)<\/title>/i.exec(t);
		return s ? a(s[1]).replace(/\s+/g, " ").trim() : "";
	}
	async function u(e, t = {}) {
		let n = typeof e == "string" ? e.trim() : "", r = {
			url: n,
			kind: "unknown",
			title: ""
		};
		if (!n || t.autodiscover === !1) return r;
		let i = t.fetchImpl || (typeof fetch < "u" ? fetch : null);
		if (typeof i != "function") return r;
		try {
			let e = await i(n, { headers: { Accept: "text/html,application/xhtml+xml,*/*;q=0.8" } }), t = "", a = n;
			if (typeof e == "string") t = e;
			else if (e && typeof e == "object") {
				if (e.ok === !1) return r;
				typeof e.url == "string" && e.url && (a = e.url), typeof e.text == "function" ? t = await e.text() : typeof e.body == "string" && (t = e.body);
			}
			let c = s(t, a);
			return c ? {
				url: c,
				kind: "feed",
				title: ""
			} : o(t) ? {
				url: n,
				kind: "page",
				title: l(t)
			} : r;
		} catch {
			return r;
		}
	}
	t.exports = {
		FEED_MIME_TYPES: n,
		autodiscoverEnabled: r,
		parseAlternateFeedLink: s,
		parsePageTitle: l,
		discoverFeedUrl: c,
		discoverSource: u
	};
})), ql = /* @__PURE__ */ h(((e, t) => {
	function n(e) {
		try {
			return new URL(e).hostname.replace(/^www\./, "");
		} catch {
			return e;
		}
	}
	function r(e) {
		return String(e).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
	}
	function i(e) {
		return `'${String(e).replace(/'/g, "'\\''")}'`;
	}
	function a(e) {
		let t = e.replace(/"/g, "&quot;");
		return `<outline text="${n(e)}" title="${n(e)}" xmlUrl="${t}"/>`;
	}
	function o(e, t) {
		let i = r((t || "").trim() || n(e));
		return `<outline text="${i}" title="${i}" type="page" xmlUrl="${r(e)}"/>`;
	}
	function s(e, t = "feed", n) {
		let r = ["node add-feed.js", i(e)];
		return t === "page" && (r.push("--type=page"), n && n.trim() && r.push(`--title=${i(n.trim())}`)), r.join(" ");
	}
	t.exports = {
		urlToLabel: n,
		shell: i,
		buildOutline: a,
		buildPageOutline: o,
		buildCommand: s
	};
})), Jl = /* @__PURE__ */ h(((e, t) => {
	function n(e) {
		return typeof e == "string" ? e.split("/").map((e) => e.trim()).filter(Boolean).join("/") : "";
	}
	function r(e) {
		return !e || typeof e != "object" ? !1 : !!(e.topBar && typeof e.topBar == "object" && e.topBar.groupByFolder === !0 || e.groupByFolder === !0);
	}
	function i(e) {
		let t = n(e);
		if (!t) return [];
		let r = t.split("/"), i = [];
		for (let e = 0; e < r.length; e++) i.push(r.slice(0, e + 1).join("/"));
		return i;
	}
	function a(e, t) {
		let r = n(t);
		if (!r) return !0;
		let i = n(e && e.folder);
		return i === r || i.startsWith(r + "/");
	}
	function o(e, t) {
		let r = Array.isArray(e) ? e : [], i = n(t);
		return i ? r.filter((e) => a(e, i)) : r.slice();
	}
	function s(e) {
		let t = Array.isArray(e) ? e : [], r = /* @__PURE__ */ new Map();
		for (let e of t) {
			if (!e) continue;
			let t = n(e.folder);
			if (!r.has(t)) {
				let e = t ? t.split("/") : [];
				r.set(t, {
					folder: t,
					label: e.length ? e[e.length - 1] : "",
					depth: e.length,
					sources: [],
					itemCount: 0
				});
			}
			let i = r.get(t);
			i.sources.push(e), i.itemCount += Number(e.itemCount) || 0;
		}
		return Array.from(r.values());
	}
	function c(e, t, n) {
		let r = n instanceof Set ? n : new Set(Array.isArray(n) ? n : []), i = o(e, t);
		return i.length > 0 && i.every((e) => r.has(e.id)) ? {
			action: "show",
			ids: i.map((e) => e.id)
		} : {
			action: "hide",
			ids: i.filter((e) => !r.has(e.id)).map((e) => e.id)
		};
	}
	t.exports = {
		normalizeFolder: n,
		groupByFolderEnabled: r,
		folderAncestors: i,
		matchesFolderFilter: a,
		filterSourcesByFolder: o,
		groupSourcesByFolder: s,
		toggleFolderSources: c
	};
})), Yl = Gl(), Xl = Kl(), Zl = ql(), Ql = Jl();
function $l({ sources: e, hiddenSources: n, onToggleSource: a, viewState: o, showCount: c = !0, pages: l = [], onOpenPage: u, links: d = [], subscribe: f = null, resume: h = null, onResume: g, order: _ = null, showAddButton: v = !0, intro: y = "", controls: b = null, showSources: x = !0, staleAge: S = !1, autodiscover: C = !0, groupByFolder: w = !1, views: T = [], currentView: E = null, onSelectView: D }) {
	let O = s(null), k = Array.isArray(l) && l.length > 0, A = Array.isArray(d) && d.length > 0, j = Array.isArray(T) ? T.filter((e) => e && e.id) : [], M = j.length > 1, N = !!b;
	if (i(() => {
		N && O.current && nu(O.current);
	}), r(() => {
		if (!N) return;
		let e = () => {
			O.current && nu(O.current);
		};
		return window.addEventListener("resize", e), typeof document < "u" && document.fonts && document.fonts.ready && document.fonts.ready.then(e), () => window.removeEventListener("resize", e);
	}, [N]), x === !1 && (e = []), (!e || e.length === 0) && !k && !A && !f && !h && !y && !b && !M) return null;
	let P = n || /* @__PURE__ */ new Set(), F = Array.isArray(_) && _.length ? _ : [
		...h ? ["resume"] : [],
		...k ? l.map((e) => `page:${e.id}`) : [],
		...A ? d.map((e) => `link:${e.id}`) : [],
		...f ? ["subscribe"] : []
	], I = (e) => /* @__PURE__ */ m("button", {
		type: "button",
		className: `${X.pill} ${X.pagePill} ${e.icon && !e.showLabel ? X.iconOnly : ""}`,
		"data-top-pages": !0,
		"data-top-page": e.id,
		"data-has-icon": e.icon ? "" : void 0,
		"aria-label": e.icon ? e.label : void 0,
		title: e.item && e.item.title ? e.item.title : e.label,
		onClick: () => u && u(e.item),
		children: [e.icon && /* @__PURE__ */ p(il, {
			body: e.icon,
			size: 15,
			className: X.pillIcon
		}), e.showLabel !== !1 && /* @__PURE__ */ p("span", {
			className: `${X.title} ${X.pageLabel}`,
			children: e.label
		})]
	}, e.id), L = (e) => /* @__PURE__ */ m("a", {
		href: e.href,
		className: `${X.pill} ${X.pagePill} ${X.linkPill} ${e.icon && !e.showLabel ? X.iconOnly : ""}`,
		"data-top-link": e.id,
		"data-has-icon": e.icon ? "" : void 0,
		"aria-label": e.label,
		title: e.label,
		...e.newTab ? {
			target: "_blank",
			rel: "noopener"
		} : {},
		children: [e.icon && /* @__PURE__ */ p(il, {
			body: e.icon,
			size: 15,
			className: X.pillIcon
		}), e.showLabel && /* @__PURE__ */ p("span", {
			className: `${X.title} ${X.pageLabel}`,
			children: e.label
		})]
	}, e.id), ee = () => h ? /* @__PURE__ */ m("button", {
		type: "button",
		className: `${X.pill} ${X.pagePill} ${h.icon && !h.showLabel ? X.iconOnly : ""}`,
		"data-top-resume": !0,
		"data-has-icon": h.icon ? "" : void 0,
		"aria-label": h.label,
		title: h.label,
		onClick: () => g && g(),
		children: [h.icon && /* @__PURE__ */ p(il, {
			body: h.icon,
			size: 15,
			className: X.pillIcon
		}), h.showLabel && /* @__PURE__ */ p("span", {
			className: `${X.title} ${X.pageLabel}`,
			children: h.label
		})]
	}, "resume") : null, te = () => M ? /* @__PURE__ */ p("span", {
		className: X.views,
		"data-top-views": !0,
		role: "group",
		"aria-label": "View",
		children: j.map((e) => {
			let t = e.id === E;
			return /* @__PURE__ */ p("button", {
				type: "button",
				className: `${X.pill} ${X.pagePill} ${t ? X.pillOn : ""}`,
				"data-top-view": e.id,
				"aria-pressed": t,
				title: e.label || e.id,
				onClick: () => {
					!t && D && D(e.id);
				},
				children: /* @__PURE__ */ p("span", {
					className: `${X.title} ${X.pageLabel}`,
					children: e.label || e.id
				})
			}, e.id);
		})
	}, "views") : null, ne = (e) => /* @__PURE__ */ p(iu, {
		source: e,
		hidden: P.has(e.id),
		onToggle: () => a && a(e.id),
		viewState: o,
		showCount: c,
		staleAge: S
	}, e.id), re = (t) => {
		if (!a) return;
		let { ids: n } = (0, Ql.toggleFolderSources)(e || [], t, P);
		for (let e of n) a(e);
	};
	return /* @__PURE__ */ m("div", {
		ref: O,
		className: X.bar,
		"data-feeds": !0,
		children: [
			w ? (0, Ql.groupSourcesByFolder)(e || []).map((e) => /* @__PURE__ */ m(t.Fragment, { children: [e.folder && /* @__PURE__ */ p(ru, {
				group: e,
				allHidden: e.sources.length > 0 && e.sources.every((e) => P.has(e.id)),
				onToggle: () => re(e.folder),
				showCount: c
			}), e.sources.map(ne)] }, e.folder || "__root__")) : (e || []).map(ne),
			F.map((e) => {
				if (e === "resume") return ee();
				if (e === "subscribe") return f ? /* @__PURE__ */ p(Wl, { config: f }, "subscribe") : null;
				if (e.startsWith("page:")) {
					let t = l.find((t) => `page:${t.id}` === e);
					return t ? I(t) : null;
				}
				if (e.startsWith("link:")) {
					let t = d.find((t) => `link:${t.id}` === e);
					return t ? L(t) : null;
				}
				return null;
			}),
			te(),
			v !== !1 && /* @__PURE__ */ p(cu, { autodiscover: C }),
			b,
			y && /* @__PURE__ */ p("div", {
				className: X.intro,
				"data-graph-intro": !0,
				dangerouslySetInnerHTML: { __html: y }
			})
		]
	});
}
function eu(e) {
	return [...e.children].filter((e) => {
		if (e.matches("[data-graph-intro]")) return !1;
		let t = getComputedStyle(e).position;
		return t !== "fixed" && t !== "absolute" && e.getBoundingClientRect().width > 0;
	});
}
function tu(e) {
	let t = eu(e);
	if (t.length < 2) return !1;
	let n = t[0].getBoundingClientRect().top;
	return t.some((e) => Math.abs(e.getBoundingClientRect().top - n) > 2);
}
function nu(e) {
	let t = ["data-fit-dots", "data-fit-icons"], n = e.querySelector("[data-source-pill]");
	for (let n of [...t, "data-fit-title"]) e.removeAttribute(n);
	n && (n.style.maxWidth = "");
	for (let n of t) {
		if (!tu(e)) return;
		e.setAttribute(n, "");
	}
	if (!tu(e) || !n) return;
	e.setAttribute("data-fit-title", "");
	let r = eu(e), i = parseFloat(getComputedStyle(e).columnGap) || 0, a = r.reduce((e, t) => e + t.getBoundingClientRect().width, 0) + i * (r.length - 1) - e.clientWidth, o = n.getBoundingClientRect().width;
	n.style.maxWidth = `${Math.max(34, Math.floor(o - a - 1))}px`;
}
function ru({ group: e, allHidden: t, onToggle: n, showCount: r }) {
	let i = t ? `Show ${e.folder}` : `Hide ${e.folder}`;
	return /* @__PURE__ */ m("button", {
		type: "button",
		className: `${X.pill} ${X.folderPill} ${t ? X.hidden : ""}`,
		"data-source-folder": e.folder,
		onClick: n,
		title: i,
		children: [
			/* @__PURE__ */ p("span", {
				className: X.folderPrefix,
				"aria-hidden": "true",
				children: "/"
			}),
			/* @__PURE__ */ p("span", {
				className: X.title,
				children: e.folder
			}),
			r && /* @__PURE__ */ p("span", {
				className: X.count,
				children: e.itemCount
			})
		]
	});
}
function iu({ source: e, hidden: t, onToggle: n, viewState: r, showCount: i, staleAge: a }) {
	let o = e.title || e.id, s = (0, Yl.sourceStatus)(e), c = !!(s && s.kind === "failed"), l = !!(s && s.kind === "stale"), u = r && r.sourceColor(e.id) || e.color, d = t ? `Show ${o}` : `Hide ${o}`;
	return /* @__PURE__ */ m("div", {
		className: `${X.pill} ${t ? X.hidden : ""} ${c ? X.failed : ""}`,
		"data-source-pill": !0,
		"data-source-stale": l ? "" : void 0,
		"data-source-failed": c ? "" : void 0,
		onClick: n,
		onKeyDown: (e) => {
			(e.key === "Enter" || e.key === " ") && (e.preventDefault(), n());
		},
		role: "button",
		tabIndex: 0,
		title: s ? `${d} · ${s.note}` : d,
		style: { "--pill-color": u },
		children: [
			/* @__PURE__ */ p(su, {
				color: u,
				sourceId: e.id,
				viewState: r
			}),
			/* @__PURE__ */ p("span", {
				className: X.title,
				children: o
			}),
			i && /* @__PURE__ */ p("span", {
				className: X.count,
				children: e.itemCount
			}),
			l && /* @__PURE__ */ m("span", {
				className: X.staleMark,
				"data-stale-mark": !0,
				title: s.note,
				role: "img",
				"aria-label": s.age ? `not fetched, the copy is ${s.age.long}` : "not fetched, an earlier copy",
				children: [/* @__PURE__ */ p("span", {
					"aria-hidden": "true",
					children: "!"
				}), a && s.age && /* @__PURE__ */ p("span", {
					className: X.staleAge,
					"aria-hidden": "true",
					"data-stale-age": !0,
					children: s.age.short
				})]
			})
		]
	});
}
var au = [
	"#e74c3c",
	"#e67e22",
	"#f1c40f",
	"#2ecc71",
	"#1abc9c",
	"#3498db",
	"#9b59b6",
	"#e84393"
], ou = 650;
function su({ color: e, sourceId: t, viewState: n }) {
	let [i, a] = c(!1), o = s(null);
	r(() => () => {
		o.current && clearTimeout(o.current);
	}, []);
	let l = (e) => {
		e.stopPropagation(), a(!0);
	}, u = (e) => {
		e && e.stopPropagation(), a(!1);
	}, d = () => {
		o.current = setTimeout(() => a(!0), ou);
	}, h = () => {
		o.current &&= (clearTimeout(o.current), null);
	}, g = (e, r) => {
		r.stopPropagation(), n && n.setSourceColor(t, e), a(!1);
	}, _ = au.length;
	return /* @__PURE__ */ m("span", {
		className: X.dotWrap,
		onMouseEnter: d,
		onMouseLeave: h,
		onClick: l,
		onTouchEnd: l,
		children: [/* @__PURE__ */ p("span", {
			className: `${X.dot} ${i ? X.dotActive : ""}`,
			"aria-hidden": "true"
		}), i && /* @__PURE__ */ m(f, { children: [/* @__PURE__ */ p("span", {
			className: X.ringBackdrop,
			onClick: u,
			onTouchEnd: u
		}), /* @__PURE__ */ p("span", {
			className: X.ring,
			children: au.map((t, n) => {
				let r = (_ === 1 ? 15 : 15 + n / (_ - 1) * 150) * Math.PI / 180, i = 30 * Math.cos(r), a = 30 * Math.sin(r);
				return /* @__PURE__ */ p("button", {
					type: "button",
					className: `${X.swatch} ${t.toLowerCase() === String(e).toLowerCase() ? X.swatchCurrent : ""}`,
					style: {
						left: i - 8 + "px",
						top: a - 8 + "px",
						background: t
					},
					onClick: (e) => g(t, e),
					title: t
				}, t);
			})
		})] })]
	});
}
function cu({ autodiscover: e = !0 }) {
	let [t, n] = c(!1), [i, a] = c(""), [o, l] = c(null), [u, d] = c("feed"), [h, g] = c(""), _ = s(null);
	r(() => {
		t && _.current && _.current.focus();
	}, [t]);
	let v = uu(i), y = (t) => {
		if (t && t.preventDefault(), !v) return;
		let r = i.trim();
		l(r), d("feed"), g(""), a(""), n(!1), e !== !1 && (0, Xl.discoverSource)(r, { autodiscover: !0 }).then((e) => {
			e && (e.kind === "feed" && e.url && e.url !== r ? l((t) => t === r ? e.url : t) : e.kind === "page" && l((t) => (t === r && (d("page"), g(e.title || "")), t)));
		});
	}, b = () => {
		a(""), n(!1);
	};
	return /* @__PURE__ */ m(f, { children: [t ? /* @__PURE__ */ m("form", {
		className: `${X.pill} ${X.addOpen}`,
		onSubmit: y,
		children: [
			/* @__PURE__ */ p("input", {
				ref: _,
				type: "url",
				placeholder: "paste a feed URL…",
				className: X.addInput,
				value: i,
				onChange: (e) => a(e.target.value),
				onKeyDown: (e) => {
					e.key === "Escape" && b();
				}
			}),
			/* @__PURE__ */ p("button", {
				type: "button",
				className: X.addClose,
				onClick: b,
				title: "Cancel",
				"aria-label": "Cancel",
				children: "×"
			}),
			/* @__PURE__ */ p("button", {
				type: "submit",
				className: `${X.addSubmit} ${v ? X.ready : ""}`,
				disabled: !v,
				title: v ? "Continue" : "Enter a URL first",
				"aria-label": "Add feed",
				children: "+"
			})
		]
	}) : /* @__PURE__ */ p("button", {
		className: `${X.pill} ${X.addPill}`,
		onClick: () => n(!0),
		title: "Add a feed",
		children: /* @__PURE__ */ p("span", {
			className: X.plus,
			children: "+"
		})
	}), o && /* @__PURE__ */ p(lu, {
		url: o,
		kind: u,
		pageTitle: h,
		onKind: d,
		onDismiss: () => l(null)
	})] });
}
function lu({ url: e, kind: t = "feed", pageTitle: n = "", onKind: r, onDismiss: i }) {
	let [a, o] = c(""), s = t === "page", l = s ? (0, Zl.buildPageOutline)(e, n) : (0, Zl.buildOutline)(e), u = (0, Zl.buildCommand)(e, s ? "page" : "feed", n), d = async (e, t) => {
		try {
			await navigator.clipboard.writeText(e), o(t), setTimeout(() => o((e) => e === t ? "" : e), 1500);
		} catch {}
	};
	return /* @__PURE__ */ m("div", {
		className: X.resultPanel,
		children: [
			/* @__PURE__ */ p("button", {
				className: X.resultClose,
				onClick: i,
				title: "Dismiss",
				"aria-label": "Dismiss",
				children: "×"
			}),
			/* @__PURE__ */ p("div", {
				className: X.resultTitle,
				"data-add-kind": s ? "page" : "feed",
				children: s ? "Add this page" : "Add this feed"
			}),
			/* @__PURE__ */ p("div", {
				className: X.resultUrl,
				title: e,
				children: e
			}),
			s && /* @__PURE__ */ m("div", {
				className: X.resultHint,
				"data-add-no-feed": !0,
				children: ["No feed was found at this address, so it is listed as one page: one card, in its place by its tags.", typeof r == "function" && /* @__PURE__ */ m(f, { children: [" ", /* @__PURE__ */ p("button", {
					type: "button",
					className: X.resultLink,
					onClick: () => r("feed"),
					children: "Add it as a feed anyway"
				})] })]
			}),
			/* @__PURE__ */ m("div", {
				className: X.resultSection,
				children: [
					/* @__PURE__ */ p("div", {
						className: X.resultLabel,
						children: "One-step (recommended)"
					}),
					/* @__PURE__ */ m("div", {
						className: X.resultBox,
						children: [/* @__PURE__ */ p("code", {
							className: X.code,
							children: u
						}), /* @__PURE__ */ p("button", {
							className: `${X.copyBtn} ${a === "cli" ? X.copied : ""}`,
							onClick: () => d(u, "cli"),
							children: a === "cli" ? "Copied" : "Copy"
						})]
					}),
					/* @__PURE__ */ p("div", {
						className: X.resultHint,
						children: "Paste in your terminal — it appends to feeds.opml and rebuilds. Then refresh this page."
					})
				]
			}),
			/* @__PURE__ */ m("div", {
				className: X.resultSection,
				children: [
					/* @__PURE__ */ p("div", {
						className: X.resultLabel,
						children: "Or add manually"
					}),
					/* @__PURE__ */ m("div", {
						className: X.resultBox,
						children: [/* @__PURE__ */ p("code", {
							className: X.code,
							children: l
						}), /* @__PURE__ */ p("button", {
							className: `${X.copyBtn} ${a === "opml" ? X.copied : ""}`,
							onClick: () => d(l, "opml"),
							children: a === "opml" ? "Copied" : "Copy"
						})]
					}),
					/* @__PURE__ */ m("div", {
						className: X.resultHint,
						children: [
							"Paste before ",
							/* @__PURE__ */ p("code", {
								className: X.codeInline,
								children: "</body>"
							}),
							" ",
							"in feeds.opml, then run ",
							/* @__PURE__ */ p("code", {
								className: X.codeInline,
								children: "node generate-index.js"
							}),
							"."
						]
					})
				]
			})
		]
	});
}
function uu(e) {
	let t = (e || "").trim();
	if (!t) return !1;
	try {
		let e = new URL(t);
		return e.protocol === "http:" || e.protocol === "https:";
	} catch {
		return !1;
	}
}
var Z = {
	gearBtn: "_gearBtn_1alfr_17",
	backdrop: "_backdrop_1alfr_51",
	drawer: "_drawer_1alfr_58",
	ppSlideIn: "_ppSlideIn_1alfr_1",
	header: "_header_1alfr_86",
	title: "_title_1alfr_100",
	subject: "_subject_1alfr_105",
	closeBtn: "_closeBtn_1alfr_115",
	section: "_section_1alfr_129",
	sectionTitle: "_sectionTitle_1alfr_138",
	rowLabel: "_rowLabel_1alfr_147",
	choiceRow: "_choiceRow_1alfr_153",
	choices: "_choices_1alfr_161",
	rangeRow: "_rangeRow_1alfr_168",
	rangeEnd: "_rangeEnd_1alfr_176",
	rowLabelLine: "_rowLabelLine_1alfr_184",
	steadyCount: "_steadyCount_1alfr_191",
	range: "_range_1alfr_168",
	choiceBtn: "_choiceBtn_1alfr_227",
	fontBtn: "_fontBtn_1alfr_228",
	resetBtn: "_resetBtn_1alfr_229",
	markActions: "_markActions_1alfr_230",
	presetBtn: "_presetBtn_1alfr_231",
	fontRow: "_fontRow_1alfr_244",
	aidOn: "_aidOn_1alfr_254",
	hint: "_hint_1alfr_259",
	hintLink: "_hintLink_1alfr_265",
	legend: "_legend_1alfr_269",
	aidList: "_aidList_1alfr_277",
	aidBtn: "_aidBtn_1alfr_283",
	aidLabel: "_aidLabel_1alfr_299",
	aidState: "_aidState_1alfr_307",
	aidHint: "_aidHint_1alfr_317",
	subjectBlock: "_subjectBlock_1alfr_324",
	subjectTitle: "_subjectTitle_1alfr_333",
	markItem: "_markItem_1alfr_338",
	markMain: "_markMain_1alfr_346",
	markTitle: "_markTitle_1alfr_351",
	markNote: "_markNote_1alfr_356",
	noteInput: "_noteInput_1alfr_368",
	noMarks: "_noMarks_1alfr_393",
	presetRow: "_presetRow_1alfr_399",
	presetActive: "_presetActive_1alfr_412",
	presetSwatches: "_presetSwatches_1alfr_417",
	miniSwatch: "_miniSwatch_1alfr_422",
	paletteSwatch: "_paletteSwatch_1alfr_431",
	presetLabel: "_presetLabel_1alfr_442",
	fieldList: "_fieldList_1alfr_447",
	fieldRow: "_fieldRow_1alfr_453",
	fieldLabel: "_fieldLabel_1alfr_460",
	colorInput: "_colorInput_1alfr_465",
	hexLabel: "_hexLabel_1alfr_475",
	forgetBlock: "_forgetBlock_1alfr_489",
	forgetConfirm: "_forgetConfirm_1alfr_490"
}, du = /* @__PURE__ */ h(((e, t) => {
	var n = {
		default: {
			id: "default",
			label: "Default",
			modes: ["dark"]
		},
		sketchbook: {
			id: "sketchbook",
			label: "Sketchbook",
			modes: ["light", "dark"]
		}
	};
	function r(e, t) {
		if (t && n[t]) return t;
		let r = e && e.theme && e.theme.name;
		return n[r] ? r : "default";
	}
	function i(e, t, r, i) {
		let a = (n[e] || n.default).modes;
		return t && a.includes(t) ? t : a.length === 1 ? a[0] : i && a.includes(i) ? i : r ? "dark" : "light";
	}
	t.exports = {
		THEMES: n,
		themeName: r,
		themeMode: i
	};
})), fu = /* @__PURE__ */ h(((e, t) => {
	var n = {
		enabled: !1,
		mode: "two-state",
		art: {
			artState: "",
			graphState: "",
			full: ""
		},
		alt: "",
		ground: "dark",
		graph: {
			artOffset: .33,
			artStateOpacity: .6
		},
		top: null,
		backdrop: {
			opacity: 1,
			opacityZoomedIn: .3,
			zoomForFloor: 2.5,
			keepAbove: 0
		},
		reach: {
			enabled: !1,
			tips: [],
			perContainer: 3,
			stopShort: 18,
			lagMs: 600,
			drawMs: 1800
		},
		byline: {
			text: "",
			href: "",
			opacity: {
				art: .35,
				graph: .56
			},
			size: .25,
			gap: .3,
			minSize: 0,
			case: "lower",
			graphScale: null
		},
		startOn: "remembered",
		snapMs: 420,
		title: null
	}, r = {
		text: "",
		font: "",
		color: "",
		opacity: 1,
		hideGraphTitle: !0
	}, i = "'Arial Black', Impact, sans-serif", a = ["art", "graph"];
	function o(e) {
		let t = e && Array.isArray(e.lines) ? e.lines : [], n = [];
		for (let e of t) {
			if (!e || typeof e != "object") continue;
			let t = (Array.isArray(e.spans) ? e.spans : []).filter((e) => e && typeof e.text == "string" && e.text !== "").map((e) => ({
				text: e.text,
				size: Math.max(0, _(e.size, .05)),
				rise: _(e.rise, 0)
			}));
			if (!t.length) continue;
			let r = _(e.width, NaN);
			n.push({
				x: _(e.x, 0),
				y: _(e.y, 0),
				spans: t,
				width: Number.isFinite(r) && r > 0 ? r : null
			});
		}
		return { lines: n };
	}
	function s(e) {
		if (!e || typeof e != "object") return null;
		let t = o(e.art), n = o(e.graph);
		if (!t.lines.length && !n.lines.length) return null;
		let a = (t.lines.length ? t : n).lines.map((e) => e.spans.map((e) => e.text).join("")).join(" "), s = v(e.font).trim();
		return {
			text: v(e.text).trim() || a.replace(/\s+/g, " ").trim(),
			font: s,
			family: s ? `'${s.replace(/'/g, "")}', ${i}` : i,
			color: v(e.color).trim(),
			opacity: y(_(e.opacity, r.opacity)),
			hideGraphTitle: e.hideGraphTitle !== !1,
			fit: e.fit === "width" ? "width" : null,
			art: t,
			graph: n
		};
	}
	function c(e, t, n) {
		if (!e || e.fit !== "width" || !t) return e;
		let r = (e, t) => ({ lines: e.lines.map((e, r) => {
			let i = t && t[r];
			if (!e.width || !(i > 0)) return e;
			let a = e.width * n / i;
			return {
				...e,
				spans: e.spans.map((e) => ({
					...e,
					size: e.size * a
				}))
			};
		}) });
		return {
			...e,
			art: r(e.art, t.art),
			graph: r(e.graph, t.graph)
		};
	}
	function l(e, t) {
		let { left: n = 0, top: r = 0, width: i = 1, height: a = 1 } = t || {};
		return { lines: (e && e.lines || []).map((e) => ({
			x: n + e.x * i,
			y: r + e.y * a,
			width: e.width ? e.width * i : null,
			spans: e.spans.map((e) => ({
				text: e.text,
				size: e.size * i,
				rise: e.rise * i
			}))
		})) };
	}
	function u(e) {
		let t = e && typeof e == "object" ? e : {}, r = n.byline, i = t.opacity, a = i && typeof i == "object" ? {
			art: y(_(i.art, r.opacity.art)),
			graph: y(_(i.graph, r.opacity.graph))
		} : Number.isFinite(Number(i)) && i !== "" && i !== null ? {
			art: y(Number(i)),
			graph: y(Number(i))
		} : { ...r.opacity };
		return {
			text: v(t.text),
			href: v(t.href),
			opacity: a,
			size: Math.max(.01, Math.min(1, _(t.size, r.size))),
			gap: Math.max(0, Math.min(2, _(t.gap, r.gap))),
			minSize: Math.max(0, _(t.minSize, r.minSize)),
			case: t.case === "as-written" ? "as-written" : "lower",
			graphScale: Number.isFinite(Number(t.graphScale)) && t.graphScale !== null && t.graphScale !== "" && Number(t.graphScale) > 0 ? Math.min(1, Number(t.graphScale)) : null
		};
	}
	function d(e) {
		return !e || !e.text ? "" : e.case === "as-written" ? e.text : e.text.toLowerCase();
	}
	function f(e, t, n, r, i = null) {
		let a = e && e.lines || [];
		if (!a.length) return null;
		let o = a[a.length - 1], s = Math.max(...a.flatMap((e) => e.spans.map((e) => e.size))) * t.width, c = Math.max(...o.spans.map((e) => e.size)) * t.width, l = !i && r > 0 && o.width ? o.width * t.width / r : null;
		return {
			x: t.left + o.x * t.width,
			y: t.top + o.y * t.height + n.gap * (l ? c : s),
			size: i ? Math.max(n.minSize, i * s) : l || Math.max(n.minSize, n.size * s),
			titleSize: s
		};
	}
	var p = {
		pad: 16,
		bylineSpace: 52,
		bylineSize: 20,
		rise: .18,
		graphFrom: .2,
		wheelIdleMs: 140,
		lineHeightPx: 40,
		onward: .22,
		flickPxPerMs: .35,
		minSnapMs: 140,
		quietMs: 380,
		edgePx: 28,
		reducedFadeMs: 200,
		reducedWheelPx: 40
	}, { reachConfig: m, backdropConfig: h, backdropOpacity: g } = As(), _ = (e, t) => e !== "" && e != null && Number.isFinite(Number(e)) ? Number(e) : t, v = (e) => typeof e == "string" ? e : "", y = (e) => Math.max(0, Math.min(1, e)), b = (e) => typeof e == "string" && e.trim() && !/[;{}<>]/.test(e) ? e.trim() : "", x = (e, t, n) => n === 1 ? t : e + (t - e) * n, S = (e) => {
		let t = y(e);
		return t * t * (3 - 2 * t);
	};
	function C(e) {
		if (e && typeof e == "object") {
			let t = y(_(e.textureFrom, .35));
			return {
				mode: e.mode === "paper" ? "paper" : "dark",
				sky: {
					top: b(e.top) || "#050505",
					bottom: b(e.bottom),
					textureFrom: t,
					colorFrom: y(_(e.colorFrom, t)),
					texture: Math.max(0, Math.min(3, _(e.texture, 1)))
				}
			};
		}
		return {
			mode: e === "paper" ? "paper" : "dark",
			sky: null
		};
	}
	function w(e) {
		if (!e || typeof e != "object") return null;
		let t = (e) => e === "" || e == null || !Number.isFinite(Number(e)) ? null : Math.max(0, Number(e)), n = t(e.art), r = t(e.graph);
		return n === null && r === null ? null : {
			art: n,
			graph: r
		};
	}
	function T(e) {
		let t = e && typeof e == "object" ? e.extra : void 0;
		return { extra: t === "" || t == null || !Number.isFinite(Number(t)) ? 16 : Math.max(0, Number(t)) };
	}
	var E = (e, t) => Math.max(12, Math.ceil((Number(e) || 0) + ((t && t.extra) ?? 16)));
	function D(e, t, n, r = 64) {
		for (let i = 0; i < n; i += 1) for (let a = 0, o = i * t * 4 + 3; a < t; a += 1, o += 4) if (e[o] >= r) return i / n;
		return 1;
	}
	function O(e, t, n, r = 64) {
		for (let i = n - 1; i >= 0; --i) for (let a = 0, o = i * t * 4 + 3; a < t; a += 1, o += 4) if (e[o] >= r) return (i + 1) / n;
		return 0;
	}
	function k(e, t, n, r = 0, i = 1, a = 64) {
		let o = Math.max(0, Math.floor(r * n)), s = Math.min(n, Math.ceil(i * n)), c = t, l = -1;
		for (let n = o; n < s; n += 1) for (let r = 0, i = n * t * 4 + 3; r < t; r += 1, i += 4) e[i] >= a && (r < c && (c = r), r > l && (l = r));
		return l < 0 ? null : {
			l: c / t,
			r: (l + 1) / t
		};
	}
	function A(e, t, n, r = 0, i = 1, a = 64) {
		let o = Math.max(0, Math.floor(r * n)), s = Math.min(n, Math.ceil(i * n)), c = null;
		for (let n = o; n < s; n += 1) {
			let r = -1, i = -1;
			for (let o = 0, s = n * t * 4 + 3; o < t; o += 1, s += 4) e[s] >= a && (r < 0 && (r = o), i = o);
			r >= 0 && (!c || i - r > c.r - c.l) && (c = {
				l: r,
				r: i,
				y: n
			});
		}
		return c && {
			l: c.l / t,
			r: (c.r + 1) / t,
			y: c.y / n
		};
	}
	function j(e) {
		let t = e && e.opening;
		if (!t || t.enabled !== !0 || t.mode !== void 0 && t.mode !== "two-state") return null;
		let r = t.art && typeof t.art == "object" ? t.art : {}, i = v(r.artState), a = v(r.graphState), o = v(r.full);
		if (!(i && a)) {
			if (!o) return null;
			i = o, a = "";
		}
		let c = t.graph && typeof t.graph == "object" ? t.graph : {}, l = C(t.ground);
		return {
			enabled: !0,
			mode: "two-state",
			art: {
				artState: i,
				graphState: a,
				full: o,
				rootsVector: a ? v(r.rootsVector) : "",
				rootsFollowMs: Math.max(0, Math.min(2e3, _(r.rootsFollowMs, 0)))
			},
			acts: M(e.containers),
			alt: v(t.alt),
			ground: l.mode,
			sky: l.sky,
			graph: {
				artOffset: Math.max(0, Math.min(.95, _(c.artOffset, n.graph.artOffset))),
				artStateOpacity: y(_(c.artStateOpacity, n.graph.artStateOpacity)),
				hiddenUntilMove: c.hiddenUntilMove === !0,
				rootsFit: c.rootsFit === "width" ? "width" : null,
				rootsBrightness: Math.max(0, Math.min(2, _(c.rootsBrightness, 1))),
				footRoom: Math.max(0, _(c.footRoom, 0))
			},
			fit: t.fit === "width" ? "width" : "height",
			sideMargin: Math.max(0, _(t.sideMargin, 0)),
			returnAbove: t.returnAbove === "crown" && F(t.crownY) !== null ? "crown" : null,
			topBarInArt: t.topBarInArt === !0,
			band: N(e.topBar && e.topBar.band),
			top: w(t.top),
			grip: T(t.grip),
			backdrop: h(t),
			reach: m(t),
			byline: u(t.byline),
			startOn: [
				"remembered",
				"art",
				"graph"
			].includes(t.startOn) ? t.startOn : n.startOn,
			snapMs: Math.max(0, _(t.snapMs, n.snapMs)),
			title: s(t.title),
			crownY: F(t.crownY),
			zoomPivot: P(t.zoomPivot)
		};
	}
	function M(e) {
		if (!e || typeof e != "object") return [];
		let t = [];
		for (let [n, r] of Object.entries(e)) {
			if (!r || typeof r != "object" || n.startsWith("_")) continue;
			let e = r.anchor && Number.isFinite(Number(r.anchor.x)) && Number.isFinite(Number(r.anchor.y)) ? {
				x: Number(r.anchor.x),
				y: Number(r.anchor.y)
			} : null, i = Array.isArray(r.rootTips) ? r.rootTips.filter((e) => typeof e == "string" && e) : null;
			!e && !i || t.push({
				id: n.startsWith("container:") ? n : `container:${n}`,
				anchor: e,
				rootTips: i
			});
		}
		return t;
	}
	function N(e) {
		let t = e && typeof e == "object" ? b(e.color) : "";
		return t ? { color: t } : null;
	}
	function P(e) {
		if (!e || typeof e != "object") return null;
		let t = _(e.x, NaN), n = _(e.y, NaN);
		return Number.isFinite(t) && Number.isFinite(n) ? {
			x: t,
			y: n
		} : null;
	}
	function F(e) {
		let t = _(e, NaN);
		return Number.isFinite(t) && t >= 0 && t <= 1 ? t : null;
	}
	function I(e, t) {
		return x(1, e && e.graph && Number.isFinite(e.graph.rootsBrightness) ? e.graph.rootsBrightness : 1, y(t));
	}
	var L = 300;
	function ee(e, t, n) {
		return e ? t == null ? 0 : Math.max(0, Math.min(1, (n - t) / L)) : 1;
	}
	function te(e, { stored: t, hash: n } = {}) {
		return !e || typeof n == "string" && n.startsWith("#read=") ? "graph" : e.startOn === "art" || e.startOn === "graph" ? e.startOn : a.includes(t) ? t : "art";
	}
	function ne(e, { vw: t, vh: r, art: i, bottom: a = 0, zoom: o = null, controls: s = 0, ink: c = null, perPx: l = null } = {}, u = 0) {
		let d = y(u), f = p, m = Math.max(1, i && i.w || 1), h = Math.max(1, i && i.h || 1), v = e && e.byline && e.byline.text ? f.bylineSpace : 0, b = Math.min(f.pad, r * .03), C = Math.max(b, a), w = e && e.top || null, T = e && e.topBarInArt === !1 ? 0 : Math.max(0, s), E = y(_(c && c.art, 0)), D = c && Number.isFinite(c.graph) ? y(c.graph) : null, O = w && w.art !== null ? T + w.art : null, k = Math.max(1, r - (O === null ? b : O) - C - v), A = O === null ? h : h * Math.max(.05, 1 - E), j = e && e.graph || n.graph, M = e && e.backdrop || n.backdrop, N = Math.max(.01, Math.min(k / A, (t - 2 * b) / m)), P = (t - m * N) / 2, F = e && Number.isFinite(e.crownY) ? e.crownY : 1;
		if (e && e.fit === "width") {
			let n = c && c.bush || {
				l: 0,
				r: 1
			}, i = (t - 2 * Math.min(_(e.sideMargin, 0), t * .25)) / (Math.max(.01, n.r - n.l) * m), a = O === null ? b : O, o = (r - C - a) / (Math.max(.05, F - E) * h);
			N = Math.max(.01, Math.min(i, o)), P = t / 2 - (n.l + n.r) / 2 * m * N;
		}
		let I = O === null ? b + Math.max(0, (k - h * N) / 2) : O - E * h * N, L = N, ee = P;
		if (j.rootsFit === "width") {
			let e = c && c.roots || {
				l: 0,
				r: 1
			}, n = t / (Math.max(.01, e.r - e.l) * m), i = Math.max(0, s) + (w && w.graph !== null ? w.graph : 0), a = c && Number.isFinite(c.bottom) ? y(c.bottom) : 1, o = Math.max(0, _(j.footRoom, 0)), l = (r - C - o - i) / (Math.max(.05, a - (D === null ? 0 : D)) * h);
			L = Math.max(.01, Math.min(n, l)), ee = t / 2 - (e.l + e.r) / 2 * m * L;
		}
		let te = w && w.graph !== null && D !== null ? Math.min(I - 1, Math.max(0, s) + w.graph - D * h * L) : -j.artOffset * (h * L), ne = x(N, L, d), ie = m * ne, ae = h * ne, R = x(I, te, d), oe = x(P, ee, d), se = S((d - f.graphFrom) / (1 - f.graphFrom));
		return {
			p: d,
			vw: t,
			vh: r,
			art: {
				top: R,
				left: oe,
				width: ie,
				height: ae,
				scale: ne,
				opacity: 1
			},
			roots: x(1, o ? g(M, o.k, o.homeK) : M.opacity, d),
			fade: {
				art: 1 - d,
				graph: d
			},
			artTop0: I,
			artTop1: te,
			travel: Math.max(1, I - te),
			graph: {
				opacity: se,
				shift: (1 - se) * f.rise * r
			},
			layer: {
				opacity: x(_(j.artStateOpacity, n.graph.artStateOpacity), 1, d),
				follow: R - te
			},
			ground: 1 - d,
			byline: re(e, {
				left: oe,
				top: R,
				width: ie,
				height: ae
			}, d, l, {
				x: t / 2,
				y: R + ae + (v - f.bylineSize * 1.3) / 2,
				size: f.bylineSize,
				opacity: y(1 - d * 2.5),
				align: "center",
				under: "art"
			})
		};
	}
	function re(e, t, n, r, i) {
		let a = e && e.title, o = e && e.byline;
		if (!a || !o || !o.text) return i;
		let s = a.fit === "width" ? r : null, c = f(a.art, t, o, s), l = f(a.graph, t, o, s, o.graphScale), u = c || l, d = l || c;
		return {
			x: x(u.x, d.x, n),
			y: x(u.y, d.y, n),
			size: x(u.size, d.size, n),
			opacity: x(o.opacity.art, o.opacity.graph, n),
			align: "left",
			under: "title"
		};
	}
	var ie = (e) => 1 - (1 - e) ** 3, ae = (e) => e < .5 ? 4 * e * e * e : 1 - (-2 * e + 2) ** 3 / 2;
	function R(e, { start: t = "art", reducedMotion: r = !1, travel: i = 600, now: o = () => Date.now(), frame: s = (e) => setTimeout(() => e(), 16), cancelFrame: c = (e) => clearTimeout(e), setTimer: l = setTimeout, clearTimer: u = clearTimeout, onChange: d = () => {}, onRest: f = () => {} } = {}) {
		let m = e ? e.snapMs : n.snapMs, h = +(t === "graph"), g = t === "graph" ? "graph" : "art", _ = g, v = null, b = null, S = 0, C = 0, w = null, T = Math.max(120, i), E = (e) => +(e === "graph"), D = (e) => e === "graph" ? "art" : "graph";
		function O(e, t) {
			let n = y(e);
			n === h && !(t && t.swap) || (h = n, d(h, t || {}));
		}
		function k() {
			v &&= (c(v.handle), null);
		}
		function A(e) {
			k(), g = e, _ = e, O(E(e)), C = o() + p.quietMs, f(e);
		}
		function j(e, { ease: t = ie } = {}) {
			k();
			let n = E(e);
			if (r) {
				M(e);
				return;
			}
			let i = h, a = Math.abs(n - i);
			if (a < 1e-4 || m === 0) {
				A(e);
				return;
			}
			let c = Math.max(p.minSnapMs, m * a), l = o();
			v = {
				target: e,
				handle: null
			};
			let u = () => {
				let r = Math.min(1, (o() - l) / c);
				if (O(x(i, n, t(r))), r >= 1) {
					v = null, A(e);
					return;
				}
				v.handle = s(u);
			};
			v.handle = s(u);
		}
		function M(e) {
			k(), !(g === e && h === E(e)) && (g = e, _ = e, h = E(e), d(h, {
				swap: !0,
				ms: p.reducedFadeMs
			}), C = o() + p.quietMs, f(e));
		}
		function N(e = 0) {
			let t = E(_), n = h - t, r = _, i = t === 0 ? 1 : -1;
			n * i > p.onward && (r = D(_)), e * i > p.flickPxPerMs && (r = D(_)), e * i < -p.flickPxPerMs && (r = _), j(r);
		}
		function P(e) {
			v || (_ = h >= 1 ? "graph" : h <= 0 ? "art" : _), k(), O(h + e);
		}
		function F(e, { instant: t = !1 } = {}) {
			return a.includes(e) ? t ? (A(e), !0) : g === e && h === E(e) && !v ? !1 : (j(e, { ease: ae }), !0) : !1;
		}
		function I(e, { deltaMode: t = 0, where: n = "stage" } = {}) {
			let i = e * (t === 1 ? p.lineHeightPx : t === 2 ? T : 1);
			if (!i) return !1;
			let a = !v && (h === 0 || h === 1);
			if ((n === "graph" || n === "edge") && a && h === 1) {
				if (o() < C) return !0;
				if (!(n === "edge" && i < 0)) return !1;
			}
			if (r) {
				if (o() < C) return !0;
				if (S += i, Math.abs(S) >= p.reducedWheelPx) {
					let e = S > 0 ? "graph" : "art";
					S = 0, e !== g && M(e);
				}
				return !0;
			}
			return a && (h === 0 && i < 0 || h === 1 && i > 0) ? !0 : (P(i / T), b && u(b), b = l(() => {
				b = null, h > 0 && h < 1 ? N(0) : A(h >= 1 ? "graph" : "art");
			}, p.wheelIdleMs), !0);
		}
		function L(e, t = o()) {
			v && (_ = v.target === "graph" ? "art" : "graph", k()), w = {
				y: e,
				p: h,
				lastY: e,
				lastT: t,
				v: 0,
				total: 0
			}, S = 0;
		}
		function ee(e, t = o()) {
			if (!w) return !1;
			let n = w.lastY - e, i = Math.max(1, t - w.lastT);
			return w.v = n / i * .6 + .4 * w.v, w.lastY = e, w.lastT = t, w.total += n, r || O(w.p + (w.y - e) / T), !0;
		}
		function te(e = o()) {
			if (!w) return !1;
			let { v: t, total: n, lastT: i } = w;
			if (w = null, r) {
				if (Math.abs(n) >= p.reducedWheelPx) {
					let e = n > 0 ? "graph" : "art";
					e !== g && M(e);
				}
				return !0;
			}
			let a = e - i > 120 ? 0 : t;
			return h === 0 || h === 1 ? (A(h === 1 ? "graph" : "art"), !0) : (N(a), !0);
		}
		function ne(e) {
			return e === "down" ? F("graph") : e === "up" ? F("art") : !1;
		}
		return {
			get p() {
				return h;
			},
			get rest() {
				return g;
			},
			get moving() {
				return !!v || h > 0 && h < 1;
			},
			wheel: I,
			touchStart: L,
			touchMove: ee,
			touchEnd: te,
			key: ne,
			tapArt: () => F("graph"),
			tapTop: () => F("art"),
			go: F,
			resize(e) {
				T = Math.max(120, e);
			},
			dispose() {
				k(), b &&= (u(b), null);
			}
		};
	}
	function oe(e) {
		return !e || e.altKey || e.ctrlKey || e.metaKey ? null : e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " || e.key === "Spacebar") && !e.shiftKey ? "down" : e.key === "ArrowUp" || e.key === "PageUp" ? "up" : null;
	}
	t.exports = {
		REVEAL_MS: L,
		revealFactor: ee,
		rootsBrightnessAt: I,
		DEFAULTS: n,
		TUNING: p,
		STATES: a,
		TITLE_DEFAULTS: r,
		TITLE_FALLBACK: i,
		openingConfig: j,
		bylineConfig: u,
		bylineText: d,
		groundConfig: C,
		topConfig: w,
		gripConfig: T,
		gripHeight: E,
		firstInkRow: D,
		lastInkRow: O,
		inkSpan: k,
		widestInkRow: A,
		titleConfig: s,
		titleLayout: l,
		fitTitle: c,
		startState: te,
		coverGeometry: ne,
		createCover: R,
		pageKey: oe
	};
})), pu = /* @__PURE__ */ h(((e, t) => {
	var { openingConfig: n } = fu(), r = [
		{
			id: "look",
			where: "graph",
			title: "Look"
		},
		{
			id: "view",
			where: "graph",
			title: "View"
		},
		{
			id: "memory",
			where: "graph",
			title: "What this device remembers"
		},
		{
			id: "reading",
			where: "reader",
			title: "Reading"
		},
		{
			id: "paper",
			where: "reader",
			title: "Paper"
		},
		{
			id: "listening",
			where: "reader",
			title: "Listening"
		}
	], i = {
		graph: "Things to change",
		reader: "Reading"
	}, a = (e) => e === "reader" ? "reader" : "graph";
	function o(e, t) {
		let n = a(t), r = e && e.panels && e.panels[n];
		return r && typeof r.title == "string" && r.title.trim() ? r.title.trim() : i[n];
	}
	function s(e) {
		let t = n(e);
		return !!(t && t.ground === "dark");
	}
	function c(e, { settings: t = null, readable: n = !0, voice: i = !1, modes: o = 1 } = {}) {
		let c = a(e), l = s(t);
		return r.filter((e) => e.where === c ? e.id === "reading" ? n : e.id === "listening" ? n && i : e.id === "paper" ? n && l && o > 1 : !0 : !1);
	}
	t.exports = {
		GROUPS: r,
		panelTitle: o,
		panelGroups: c,
		modeInReader: s,
		whereOf: a
	};
})), mu = /* @__PURE__ */ h(((e, t) => {
	var { resizeOn: n } = Ts(), r = [
		"auto",
		"day",
		"week",
		"month",
		"year"
	], i = [
		{
			event: "graph:zoom-to-fit",
			label: "Zoom to fit",
			title: "Frame every node"
		},
		{
			event: "graph:unpin-all",
			label: "Unpin all",
			title: "Release every dragged node"
		},
		{
			event: "graph:reset-sizes",
			label: "Reset sizes",
			title: "Return every card to its default size"
		}
	];
	function a(e) {
		let t = e && e.graph && typeof e.graph == "object" ? e.graph : {};
		return i.filter((e) => e.event !== "graph:reset-sizes" || n(t));
	}
	var o = "Reset: layout, zoom, rotation, open and closed containers, and selection, back to how the site starts (Undo brings the arrangement back)";
	function s(e, t) {
		let n = e && e.toolbar && typeof e.toolbar == "object" ? e.toolbar : {}, r = n.show && typeof n.show == "object" ? n.show : {}, i = t || {};
		return {
			position: n.position === "top" ? "top" : "bottom",
			show: {
				history: r.history !== !1 && i.undoRedo !== !1,
				layout: r.layout !== !1 && i.layoutControls !== !1,
				dimensions: r.dimensions !== !1 && i.dimensions !== !1
			}
		};
	}
	var c = (e) => !!(e && e.on && (e.dimension === "chronology" || e.dimension === "commits"));
	function l(e, t) {
		let n = e && e.dimension || "time";
		return e && e.on && n === t ? { on: !1 } : {
			on: !0,
			dimension: t
		};
	}
	function u(e) {
		return r[(r.indexOf(e || "auto") + 1) % r.length];
	}
	function d({ dimensions: e = [], layers: t = [], axis: n = {}, preferences: r = {}, show: i = {}, group: a = "dimensions" }) {
		let o = [], s = n.dimension || "time";
		if (i.dimensions !== !1) {
			for (let t of e) o.push({
				kind: "dimension",
				id: t.id,
				label: t.label,
				title: t.title,
				checked: !!n.on && s === t.id
			});
			for (let e of t) o.push({
				kind: "layer",
				id: e.id,
				label: e.label,
				title: e.title,
				checked: r[e.id] === !0
			});
			c(n) && o.push({
				kind: "granularity",
				value: n.granularity || "auto"
			});
		}
		return {
			heading: a,
			rows: o
		};
	}
	function f(e, t, n) {
		if (!n) return null;
		let r = Number.isInteger(e) && e >= 0 ? e : -1;
		return t === "ArrowDown" ? (r + 1) % n : t === "ArrowUp" ? r <= 0 ? n - 1 : r - 1 : t === "Home" ? 0 : t === "End" ? n - 1 : null;
	}
	t.exports = {
		GRANULARITIES: r,
		VIEW_ACTIONS: i,
		viewActionsFor: a,
		RESET_TITLE: o,
		toolbarConfig: s,
		hasGranularity: c,
		toggleDimension: l,
		nextGranularity: u,
		menuModel: d,
		menuMove: f
	};
})), hu = /* @__PURE__ */ h(((e, t) => {
	var { containerHas: n } = Us();
	function r(e) {
		if (!e || !Array.isArray(e.items)) return null;
		let t = e.containers || [], r = (e) => t.some((t) => t.parent && t.tag && n(t, e)), i = /* @__PURE__ */ new Set(), a = new Set(e.items.map((e) => e.id));
		for (let t of e.items) r(t) || i.add(t._status === "published" ? "published" : "draft");
		for (let t of e.edges || []) t.layer === "tag" ? i.add("tag") : t.layer === "topology" ? i.add("topology") : t.layer === "authored" && !a.has(t.target) && i.add("placeholder");
		return i;
	}
	t.exports = { colorKeysInUse: r };
})), gu = /* @__PURE__ */ h(((e, t) => {
	var { blendColors: n } = Rs(), { clampMinPieces: r } = Bs(), i = 20;
	function a(e, t) {
		return (t && Array.isArray(t.visibleLayers) ? t.visibleLayers : ["sequence"]).includes("tag") ? (e && Array.isArray(e.edges) ? e.edges : []).some((e) => e && e.layer === "tag") : !1;
	}
	function o(e, { hiddenSources: t, sourceColorOf: i, fallbackColor: a, minPieces: o = null, tagCounts: s = null, maxPieces: c = null } = {}) {
		let l = e && Array.isArray(e.items) ? e.items : [], u = e && Array.isArray(e.edges) ? e.edges : [], d = e && Array.isArray(e._sources) ? e._sources : [], f = t instanceof Set ? t : new Set(t || []), p = new Map(l.map((e) => [e.id, e])), m = new Map(d.map((e) => [e.id, e])), h = /* @__PURE__ */ new Map();
		for (let e of u) {
			if (!e || e.layer !== "tag") continue;
			let t = (e) => typeof e == "string" && e.startsWith("tag:"), n = t(e.target) ? e.target : t(e.source) ? e.source : null, r = n === e.target ? e.source : e.target;
			!n || !p.has(r) || (h.has(n) || h.set(n, /* @__PURE__ */ new Set()), h.get(n).add(r));
		}
		let g = (e) => e && e._source && e._source.id || null, _ = (e) => {
			let t = g(e);
			if (!t) return null;
			let n = typeof i == "function" ? i(t) : null, r = m.get(t) || e._source;
			return n || r && r.color || null;
		}, v = s instanceof Map ? s : s && typeof s == "object" ? new Map(Object.entries(s)) : null, y = (e) => {
			let t = v && v.has(e) ? Number(v.get(e)) : NaN;
			return Number.isFinite(t) ? t : h.get(e).size;
		}, b = Number(c);
		if (c == null || !Number.isFinite(b)) {
			b = 0;
			for (let e of v ? v.values() : [...h.values()].map((e) => e.size)) Number(e) > b && (b = Number(e));
		}
		let x = r(o, b), S = [];
		for (let [e, t] of h) {
			let r = y(e);
			if (r < 1 || x > 1 && r < x) continue;
			let i = [...t].map((e) => p.get(e)).filter((e) => !f.has(g(e)));
			if (!i.length) continue;
			let o = /* @__PURE__ */ new Map();
			for (let e of i) {
				let t = g(e), n = t || "";
				if (!o.has(n)) {
					let r = t ? m.get(t) || e._source : null;
					o.set(n, {
						sourceId: t,
						title: r && (r.title || r.id) || "",
						count: 0
					});
				}
				o.get(n).count += 1;
			}
			let s = [...o.values()].sort((e, t) => t.count - e.count || e.title.localeCompare(t.title));
			S.push({
				id: e,
				label: e.slice(4),
				count: i.length,
				pieces: r,
				color: n(i.map((e) => ({
					color: _(e),
					weight: 1
				})), a),
				contributors: s
			});
		}
		return S.sort((e, t) => t.pieces - e.pieces || e.label.localeCompare(t.label, void 0, { sensitivity: "base" }) || e.label.localeCompare(t.label)), S;
	}
	function s(e, t) {
		let n = String(t || "").trim().toLowerCase();
		return n ? e.filter((e) => e.label.toLowerCase().includes(n)) : e;
	}
	function c(e) {
		let t = [], n = Number.isFinite(e.pieces) ? e.pieces : e.count;
		Number.isFinite(n) && t.push(`${n} ${n === 1 ? "card" : "cards"}`), e.color && t.push(e.color);
		let r = (e.contributors || []).filter((e) => e.title).map((e) => `${e.title} ${e.count}`);
		return r.length && t.push(r.join(", ")), t.join(" · ");
	}
	t.exports = {
		SEARCH_FROM: i,
		hasTagNodes: a,
		tagListModel: o,
		filterTagRows: s,
		tagRowTitle: c
	};
})), _u = du(), vu = pu(), yu = mu(), bu = hu(), xu = gu(), Su = {
	draft: "#555555",
	published: "#2ecc71",
	tag: "#f39c12",
	topology: "#9b59b6",
	placeholder: "#7f8c8d"
};
function Cu() {
	let e = typeof window < "u" && window.SETTINGS && window.SETTINGS.theme || {};
	return {
		...Su,
		...e.node_draft ? { draft: e.node_draft } : {},
		...e.node_published ? { published: e.node_published } : {},
		...e.tag_color ? { tag: e.tag_color } : {}
	};
}
var wu = Cu(), Tu = [
	{
		id: "default",
		label: "Default",
		colors: wu
	},
	{
		id: "highContrast",
		label: "High Contrast",
		colors: {
			draft: "#8a8a8a",
			published: "#00ff9d",
			tag: "#ffb700",
			topology: "#c77dff",
			placeholder: "#b0b0b0"
		}
	},
	{
		id: "warm",
		label: "Warm",
		colors: {
			draft: "#6b5b4f",
			published: "#e07a5f",
			tag: "#f2cc8f",
			topology: "#d88c9a",
			placeholder: "#9c8b7a"
		}
	},
	{
		id: "cool",
		label: "Cool",
		colors: {
			draft: "#4a6fa5",
			published: "#00d4ff",
			tag: "#5eead4",
			topology: "#818cf8",
			placeholder: "#64748b"
		}
	}
], Eu = [
	{
		key: "draft",
		label: "Draft"
	},
	{
		key: "published",
		label: "Published"
	},
	{
		key: "tag",
		label: "Tags"
	},
	{
		key: "topology",
		label: "Topology"
	},
	{
		key: "placeholder",
		label: "Placeholder"
	}
], Du = [
	{
		id: "s",
		label: "S",
		title: "Small text"
	},
	{
		id: "m",
		label: "M",
		title: "Medium text"
	},
	{
		id: "l",
		label: "L",
		title: "Large text"
	},
	{
		id: "xl",
		label: "XL",
		title: "Extra large text"
	}
];
function Ou({ on: e, onChange: t, label: n, hint: r, ...i }) {
	return /* @__PURE__ */ m("button", {
		className: `${Z.aidBtn} ${e ? Z.aidOn : ""}`,
		role: "switch",
		"aria-checked": e,
		onClick: () => t(!e),
		...i,
		children: [/* @__PURE__ */ m("span", {
			className: Z.aidLabel,
			children: [n, /* @__PURE__ */ p("span", {
				className: Z.aidState,
				children: e ? "on" : "off"
			})]
		}), r && /* @__PURE__ */ p("span", {
			className: Z.aidHint,
			children: r
		})]
	});
}
function ku({ viewState: e, aid: t, label: n, hint: r }) {
	return /* @__PURE__ */ p(Ou, {
		on: !!(e.readerAid && e.readerAid(t)),
		label: n,
		hint: r,
		"data-aid": t,
		onChange: (n) => e.setReaderAid && e.setReaderAid(t, n)
	});
}
function Au({ label: e, options: t, value: n, onChange: r, name: i }) {
	return /* @__PURE__ */ m("div", {
		className: Z.choiceRow,
		role: "radiogroup",
		"aria-label": e,
		"data-choice": i,
		children: [/* @__PURE__ */ p("span", {
			className: Z.rowLabel,
			children: e
		}), /* @__PURE__ */ p("span", {
			className: Z.choices,
			children: t.map((e) => /* @__PURE__ */ p("button", {
				role: "radio",
				"aria-checked": n === e.id,
				title: e.title || e.label,
				"data-value": e.id,
				className: `${Z.choiceBtn} ${n === e.id ? Z.aidOn : ""}`,
				style: e.style,
				onClick: () => r(e.id),
				children: e.label
			}, e.id))
		})]
	});
}
function ju({ id: e, title: t, children: n }) {
	return /* @__PURE__ */ m("section", {
		className: Z.section,
		"data-section": e,
		"aria-labelledby": `pp-settings-${e}`,
		children: [/* @__PURE__ */ p("h2", {
			className: Z.sectionTitle,
			id: `pp-settings-${e}`,
			children: t
		}), n]
	});
}
var Mu = (e) => window.dispatchEvent(new CustomEvent(e));
function Nu(e) {
	return (e && e.graph && typeof e.graph.containersName == "string" ? e.graph.containersName.trim() : "") || "containers";
}
function Pu({ className: e, size: t = 15, ...n }) {
	let [i, a] = c(!1);
	return r(() => {
		let e = (e) => a(!!(e.detail && e.detail.where === "graph" && e.detail.open));
		return window.addEventListener("postpipe:settings-state", e), () => window.removeEventListener("postpipe:settings-state", e);
	}, []), /* @__PURE__ */ p("button", {
		type: "button",
		className: e,
		onClick: () => window.dispatchEvent(new CustomEvent("postpipe:toggle-settings", { detail: { where: "graph" } })),
		title: "Things to change",
		"aria-label": "Things to change",
		"aria-expanded": i,
		...n,
		children: /* @__PURE__ */ p(il, {
			body: (0, sl.iconBody)("sliders-horizontal"),
			size: t
		})
	});
}
function Fu({ viewState: e, feedData: t, subject: n, readerOpen: i, where: o = "graph", ownButton: l, schemes: u }) {
	let d = (0, vu.whereOf)(o), [h, g] = c(!1), [_, v] = c(!1), [, y] = c(0), b = s(null), x = s(null), S = typeof window < "u" ? window.SETTINGS : null;
	r(() => {
		if (e) return e.subscribe(() => y((e) => e + 1));
	}, [e]);
	let [C, w] = c(() => typeof window < "u" && window.PostPipeGraphTags ? window.PostPipeGraphTags.counts : null);
	r(() => {
		if (d !== "graph") return;
		window.PostPipeGraphTags && w(window.PostPipeGraphTags.counts);
		let e = (e) => w(e && e.detail && Array.isArray(e.detail.counts) ? e.detail.counts : null);
		return window.addEventListener("graph:tag-counts", e), () => window.removeEventListener("graph:tag-counts", e);
	}, [d]);
	let T = a(() => !!(t && Array.isArray(t.edges) && t.edges.some(wc.isRelationEdge)), [t]), E = a(() => (0, Oc.ratioRange)(t), [t]);
	if (r(() => {
		if (typeof document > "u" || !e || d !== "reader") return;
		let t = e.paragraphIndent ? e.paragraphIndent() : !1, n = e.paragraphSpace ? e.paragraphSpace() : !0, r = document.documentElement;
		r.setAttribute("data-pp-indent", t ? "on" : "off"), r.setAttribute("data-pp-space", n ? "on" : "off"), r.removeAttribute("data-pp-paragraph"), r.setAttribute("data-pp-font", e.readerAid ? e.readerAid("font") : "default"), r.setAttribute("data-pp-size", e.readerAid ? e.readerAid("size") : "m");
	}), r(() => {
		let e = (e) => {
			let t = e && e.detail || {};
			if ((0, vu.whereOf)(t.where) !== d) {
				g(!1);
				return;
			}
			x.current = t.section || null, g((e) => t.open ? !0 : !e);
		};
		return window.addEventListener("postpipe:toggle-settings", e), () => window.removeEventListener("postpipe:toggle-settings", e);
	}, [d]), r(() => {
		if (window.dispatchEvent(new CustomEvent("postpipe:settings-state", { detail: {
			where: d,
			open: h
		} })), !h) return;
		let e = (e) => {
			e.key === "Escape" && (e.stopImmediatePropagation(), g(!1));
		};
		if (window.addEventListener("keydown", e, !0), v(!1), x.current && b.current) {
			let e = b.current.querySelector(`[data-section="${x.current}"]`);
			e && (b.current.scrollTop = e.offsetTop - 8), x.current = null;
		}
		return () => window.removeEventListener("keydown", e, !0);
	}, [h]), !e) return null;
	let D = l === void 0 ? d === "graph" && (0, yu.toolbarConfig)(S).position !== "top" : l, O = (0, Qc.readerFonts)(S), k = e.readerAid ? e.readerAid("font") : "default", A = e.readerAid ? e.readerAid("size") : "m", j = {
		...wu,
		...e.graphColors()
	}, M = e.colorProfileId(), N = (0, bu.colorKeysInUse)((0, Ul.graphFeed)(t, (0, Ul.topBarConfig)(S))), P = N ? Eu.filter((e) => N.has(e.key)) : Eu, F = !!(t && Array.isArray(t.containers) && t.containers.length), I = typeof window < "u" && !!window.TTS, L = t && t.items || [], ee = L.length === 0 || L.some((e) => !(0, _c.isLinkItem)(e)), te = (0, _u.themeName)(S, e.preference("theme")), ne = _u.THEMES[te].modes, re = e.preference("mode"), ie = (0, vu.panelGroups)(d, {
		settings: S,
		readable: ee,
		voice: I,
		modes: ne.length
	}), ae = (0, yu.toolbarConfig)(S), R = Nu(S), oe = (0, Zs.nodePalettesOf)(S && S.graph), se = (oe.find((t) => t.id === e.preference("nodePalette")) || oe[0] || {}).id, z = Array.isArray(u) ? u : (0, bc.schemesOf)(t), ce = (z.find((e) => e.kind === "site") || { id: bc.SITE_SCHEME }).id, le = e.preference("conceptScheme"), ue = typeof le == "string" && z.some((e) => e.id === le) ? le : ce, de = Number(e.preference("broaderDepth")), fe = Number.isFinite(de) ? Math.max(0, Math.min(2, Math.round(de))) : 0, pe = (0, Cc.minPiecesSummary)(d === "graph" ? C || ((0, xu.hasTagNodes)(t, S && S.graph) ? [...(0, Cc.pieceCountsFromFeed)((0, Ul.graphFeed)(t, (0, Ul.topBarConfig)(S))).values()] : []) : [], e.preference(Cc.PREF)), me = E.has ? (0, Oc.clampRatio)(e.preference(Oc.PREF), E) : null, he = (t) => e.setPreference(Oc.PREF, Math.abs(t - E.bar) < 1e-9 ? null : t), B = {
		ArrowRight: 1,
		ArrowUp: 1,
		ArrowLeft: -1,
		ArrowDown: -1
	}, ge = (0, $s.normaliseEdgeWeights)(S && S.graph && S.graph.edgeWeights), _e = e.preference($s.MODE_PREF), ve = $s.EDGE_WEIGHT_MODES.includes(_e) ? _e : ge.mode, ye = e.preference($s.PENALTY_PREF), be = $s.DEGREE_PENALTIES.includes(ye) ? ye : ge.degreePenalty, xe = ne.length > 1 && /* @__PURE__ */ p(Au, {
		label: d === "reader" ? "Light or dark" : "Mode",
		name: "mode",
		options: [
			{
				id: "auto",
				label: "Auto",
				title: "Follow this device"
			},
			{
				id: "light",
				label: "Light"
			},
			{
				id: "dark",
				label: "Dark"
			}
		],
		value: re && ne.includes(re) ? re : "auto",
		onChange: (t) => e.setPreference("mode", t === "auto" ? null : t)
	}), Se = {
		look: () => /* @__PURE__ */ m(f, { children: [
			/* @__PURE__ */ p(Au, {
				label: "Theme",
				name: "theme",
				options: Object.values(_u.THEMES).map((e) => ({
					id: e.id,
					label: e.label
				})),
				value: te,
				onChange: (t) => e.setPreference("theme", t === (0, _u.themeName)(S, null) ? null : t)
			}),
			!(0, vu.modeInReader)(S) && xe,
			(0, hc.config)(S) && /* @__PURE__ */ p(Ou, {
				on: e.preference("timeOfDay") !== !1,
				onChange: (t) => e.setPreference("timeOfDay", t ? null : !1),
				label: "narrative time of day background",
				"data-pref": "timeOfDay"
			}),
			oe.length >= 2 && /* @__PURE__ */ m("div", {
				className: Z.choiceRow,
				role: "radiogroup",
				"aria-label": "node colour",
				"data-choice": "nodePalette",
				children: [/* @__PURE__ */ p("span", {
					className: Z.rowLabel,
					children: "node colour"
				}), /* @__PURE__ */ p("span", {
					className: Z.choices,
					children: oe.map((t, n) => /* @__PURE__ */ m("button", {
						role: "radio",
						"aria-checked": se === t.id,
						title: t.label,
						"data-value": t.id,
						className: `${Z.choiceBtn} ${se === t.id ? Z.aidOn : ""}`,
						onClick: () => e.setPreference("nodePalette", n === 0 ? null : t.id),
						children: [/* @__PURE__ */ p("span", {
							className: Z.paletteSwatch,
							"data-palette-swatch": t.id,
							"aria-hidden": "true",
							style: String(t.color).toLowerCase() === "none" ? {
								borderColor: "currentColor",
								borderStyle: "dashed",
								background: "transparent"
							} : {
								borderColor: t.color,
								background: t.fillOpacity === null ? t.color : `color-mix(in srgb, ${t.color} ${Math.round(t.fillOpacity * 100)}%, transparent)`
							}
						}), t.label]
					}, t.id))
				})]
			}),
			P.length > 0 && /* @__PURE__ */ m(f, { children: [
				/* @__PURE__ */ p("div", {
					className: Z.rowLabel,
					children: "Colors"
				}),
				/* @__PURE__ */ p("div", {
					className: Z.presetRow,
					children: Tu.map((t) => /* @__PURE__ */ m("button", {
						className: `${Z.presetBtn} ${M === t.id ? Z.presetActive : ""}`,
						onClick: () => e.applyColorProfile(t.id, t.colors),
						title: t.label,
						children: [/* @__PURE__ */ p("span", {
							className: Z.presetSwatches,
							children: P.map((e) => /* @__PURE__ */ p("span", {
								className: Z.miniSwatch,
								style: { background: t.colors[e.key] }
							}, e.key))
						}), /* @__PURE__ */ p("span", {
							className: Z.presetLabel,
							children: t.label
						})]
					}, t.id))
				}),
				/* @__PURE__ */ p("div", {
					className: Z.fieldList,
					children: P.map((t) => /* @__PURE__ */ m("label", {
						className: Z.fieldRow,
						children: [
							/* @__PURE__ */ p("span", {
								className: Z.fieldLabel,
								children: t.label
							}),
							/* @__PURE__ */ p("input", {
								type: "color",
								className: Z.colorInput,
								value: j[t.key],
								onChange: (n) => e.setGraphColor(t.key, n.target.value)
							}),
							/* @__PURE__ */ p("span", {
								className: Z.hexLabel,
								children: j[t.key]
							})
						]
					}, t.key))
				})
			] })
		] }),
		view: () => /* @__PURE__ */ m(f, { children: [
			/* @__PURE__ */ m("span", {
				className: Z.choices,
				"data-view-actions": !0,
				children: [
					/* @__PURE__ */ p("button", {
						className: Z.choiceBtn,
						"data-view-action": "graph:zoom-to-fit",
						title: "Every node on the screen, zoomed about its middle",
						onClick: () => Mu("graph:zoom-to-fit"),
						children: "Zoom to fit"
					}),
					F && /* @__PURE__ */ m(f, { children: [/* @__PURE__ */ m("button", {
						className: Z.choiceBtn,
						"data-view-action": "graph:close-all-containers",
						onClick: () => Mu("graph:close-all-containers"),
						children: ["Close all ", R]
					}), /* @__PURE__ */ m("button", {
						className: Z.choiceBtn,
						"data-view-action": "graph:open-all-containers",
						onClick: () => Mu("graph:open-all-containers"),
						children: ["Open all ", R]
					})] }),
					(0, yu.viewActionsFor)(S).filter((e) => e.event !== "graph:zoom-to-fit").map((e) => /* @__PURE__ */ p("button", {
						className: Z.choiceBtn,
						"data-view-action": e.event,
						title: e.title,
						onClick: () => Mu(e.event),
						children: e.label
					}, e.event))
				]
			}),
			ae.show.layout && /* @__PURE__ */ p(Au, {
				label: "Layout",
				name: "layout",
				options: [{
					id: "force",
					label: "cluster",
					title: "Cluster: each container its own path"
				}, {
					id: "radial",
					label: "ring",
					title: "Ring: each container its own ring"
				}],
				value: e.state.layout,
				onChange: (t) => e.setLayout(t)
			}),
			ae.show.layout && /* @__PURE__ */ m("label", {
				className: Z.choiceRow,
				"data-pref": "tightness",
				title: "How close the cards sit in cluster. At the tight end they may overlap a little.",
				children: [/* @__PURE__ */ p("span", {
					className: Z.rowLabel,
					children: "Tightness"
				}), /* @__PURE__ */ m("span", {
					className: Z.rangeRow,
					children: [
						/* @__PURE__ */ p("span", {
							className: Z.rangeEnd,
							"aria-hidden": "true",
							children: "loose"
						}),
						/* @__PURE__ */ p("input", {
							type: "range",
							className: Z.range,
							min: "0",
							max: "1",
							step: "0.05",
							"aria-label": "Tightness, from loose to tight",
							value: (0, Qs.clampTightness)(e.preference("tightness")),
							onChange: (t) => {
								let n = (0, Qs.clampTightness)(t.target.value);
								e.setPreference("tightness", n === .5 ? null : n);
							}
						}),
						/* @__PURE__ */ p("span", {
							className: Z.rangeEnd,
							"aria-hidden": "true",
							children: "tight"
						})
					]
				})]
			}),
			ae.show.layout && /* @__PURE__ */ p(Au, {
				label: "Edge weights",
				name: $s.MODE_PREF,
				options: [{
					id: "uniform",
					label: "uniform",
					title: "One link distance and D3's default strength for every link."
				}, {
					id: "weighted",
					label: "weighted",
					title: "Each link's strength and distance follow its weight, endpoint degrees and card recency."
				}],
				value: ve,
				onChange: (t) => e.setPreference($s.MODE_PREF, t === ge.mode ? null : t)
			}),
			ae.show.layout && ve === "weighted" && /* @__PURE__ */ p(Au, {
				label: "Degree penalty",
				name: $s.PENALTY_PREF,
				options: [
					{
						id: "none",
						label: "none",
						title: "Divide by each endpoint degree as it is (n)."
					},
					{
						id: "sqrt",
						label: "√",
						title: "Divide by the square root of each endpoint degree (√n)."
					},
					{
						id: "log",
						label: "log",
						title: "Divide by log(1 + n) of each endpoint degree."
					}
				],
				value: be,
				onChange: (t) => e.setPreference($s.PENALTY_PREF, t === ge.degreePenalty ? null : t)
			}),
			d === "graph" && (0, xu.hasTagNodes)(t, S && S.graph) && /* @__PURE__ */ p(Ou, {
				on: (0, Ac.showTagsChosen)(e.preference(Ac.PREF), S),
				onChange: (t) => e.setPreference(Ac.PREF, (0, Ac.showTagsPrefFor)(t, S)),
				label: "Show tagz on the graph",
				hint: "Off, the cards still sit by the tagz they share.",
				"data-pref": Ac.PREF
			}),
			pe.max > 1 && /* @__PURE__ */ m("label", {
				className: Z.choiceRow,
				"data-pref": Cc.PREF,
				title: "Tagz on fewer cards than this are hidden.",
				children: [
					/* @__PURE__ */ p("span", {
						className: `${Z.rowLabel} ${Z.rowLabelLine}`,
						"data-min-pieces-label": !0,
						children: (0, Cc.minPiecesLabel)(pe.min)
					}),
					/* @__PURE__ */ m("span", {
						className: Z.rangeRow,
						children: [
							/* @__PURE__ */ p("span", {
								className: Z.rangeEnd,
								"aria-hidden": "true",
								children: "1"
							}),
							/* @__PURE__ */ p("input", {
								type: "range",
								className: Z.range,
								min: "1",
								max: pe.max,
								step: "1",
								"aria-label": `Hide tagz on fewer than this many cards, from 1 to ${pe.max}`,
								"aria-valuetext": `${pe.min} ${pe.min === 1 ? "card" : "cards"}: ${pe.shown} of ${pe.total} tagz`,
								value: pe.min,
								onChange: (t) => {
									let n = Math.round(Number(t.target.value));
									e.setPreference(Cc.PREF, Number.isFinite(n) && n > 1 ? n : null);
								}
							}),
							/* @__PURE__ */ p("span", {
								className: Z.rangeEnd,
								"aria-hidden": "true",
								children: pe.max
							})
						]
					}),
					/* @__PURE__ */ m("output", {
						className: Z.rangeEnd,
						"data-tag-count": !0,
						"aria-live": "polite",
						children: [
							/* @__PURE__ */ p("span", {
								className: Z.steadyCount,
								style: { minWidth: `${String(pe.total).length}ch` },
								children: pe.shown
							}),
							" of ",
							pe.total,
							" tagz"
						]
					})
				]
			}),
			d === "graph" && E.has && /* @__PURE__ */ m("label", {
				className: Z.choiceRow,
				"data-pref": Oc.PREF,
				title: `Discovered tagz under this ratio are hidden; tagz a person wrote always show. The build's own bar is ${(0, Oc.ratioText)(E.bar)}.`,
				children: [
					/* @__PURE__ */ p("span", {
						className: `${Z.rowLabel} ${Z.rowLabelLine}`,
						"data-source-ratio-label": !0,
						children: "Source coherence ratio"
					}),
					/* @__PURE__ */ m("span", {
						className: Z.rangeRow,
						children: [
							/* @__PURE__ */ p("span", {
								className: Z.rangeEnd,
								"aria-hidden": "true",
								children: (0, Oc.ratioText)(E.lo)
							}),
							/* @__PURE__ */ p("input", {
								type: "range",
								className: Z.range,
								min: "0",
								max: (0, Oc.travelLength)(E),
								step: "1",
								"aria-label": `Source coherence ratio, from ${(0, Oc.ratioText)(E.lo)} to ${(0, Oc.ratioText)(E.hi)}`,
								"aria-valuetext": (0, Oc.ratioText)(me),
								"data-ratio": (0, Oc.ratioText)(me),
								value: (0, Oc.positionOf)(me, E),
								onChange: (e) => he((0, Oc.ratioAt)(e.target.value, E)),
								onKeyDown: (e) => {
									let t = B[e.key];
									t && (e.preventDefault(), he((0, Oc.clampRatio)(me + t * Oc.STEP, E)));
								}
							}),
							/* @__PURE__ */ p("span", {
								className: Z.rangeEnd,
								"aria-hidden": "true",
								children: (0, Oc.ratioText)(E.hi)
							})
						]
					}),
					/* @__PURE__ */ p("output", {
						className: Z.rangeEnd,
						"data-source-ratio": !0,
						"aria-live": "polite",
						children: (0, Oc.ratioText)(me)
					})
				]
			}),
			z.length > 1 && /* @__PURE__ */ p(Au, {
				label: "Scheme",
				name: "conceptScheme",
				options: z.map((e) => ({
					id: e.id,
					label: e.label || e.id,
					title: e.kind === "external" && e.license ? `${e.label || e.id} (${e.license})` : e.label || e.id
				})),
				value: ue,
				onChange: (t) => e.setPreference("conceptScheme", t === ce ? null : t)
			}),
			z.length > 1 && /* @__PURE__ */ p(Au, {
				label: "Depth",
				name: "broaderDepth",
				options: [
					{
						id: "0",
						label: "0",
						title: "Each tag as it is"
					},
					{
						id: "1",
						label: "1",
						title: "Tags read one step up, by their broader concept"
					},
					{
						id: "2",
						label: "2",
						title: "Tags read two steps up"
					}
				],
				value: String(fe),
				onChange: (t) => e.setPreference("broaderDepth", t === "0" ? null : Number(t))
			}),
			z.length > 1 && fe > 0 && T && /* @__PURE__ */ p(Au, {
				label: "Lines to folded tagz",
				name: wc.FOLDED_PREF,
				options: [{
					id: "bubble",
					label: "to their bubble",
					title: "Lines to related tagz folded into broader ones go to the bubble that shows them"
				}, {
					id: "omit",
					label: "left out",
					title: "No lines to related tagz folded into broader ones"
				}],
				value: (0, wc.foldedChoice)(e.preference(wc.FOLDED_PREF)),
				onChange: (t) => e.setPreference(wc.FOLDED_PREF, t === "bubble" ? null : t)
			})
		] }),
		memory: () => /* @__PURE__ */ m(f, { children: [/* @__PURE__ */ p("button", {
			className: Z.resetBtn,
			"data-settings-reset": !0,
			title: "Layout, zoom, rotation, open and closed containers, selection, showing tagz and colors, back to how the site starts",
			onClick: () => {
				g(!1), P.length && e.applyColorProfile("default", wu), Mu("graph:reset-all");
			},
			children: "Reset the view"
		}), /* @__PURE__ */ m("div", {
			className: Z.forgetBlock,
			"data-forget": !0,
			children: [/* @__PURE__ */ p("div", {
				className: Z.hint,
				"data-forget-note": !0,
				children: "What you open, arrange, choose, mark and read here is kept on this device only. Reset the view keeps your bookmarks and progress; Forget removes all of it."
			}), _ ? /* @__PURE__ */ m("div", {
				className: Z.forgetConfirm,
				role: "group",
				"aria-label": "Confirm forgetting",
				"data-forget-confirm": !0,
				children: [/* @__PURE__ */ p("div", {
					className: Z.hint,
					children: "Remove your bookmarks and notes, reading progress, open cards, positions, and every choice made here, from this device? This can't be undone."
				}), /* @__PURE__ */ m("span", {
					className: Z.choices,
					children: [/* @__PURE__ */ p("button", {
						className: Z.resetBtn,
						"data-forget-yes": !0,
						onClick: async () => {
							v(!1), g(!1), e.forget && await e.forget(), window.dispatchEvent(new CustomEvent("postpipe:forgotten"));
						},
						children: "Forget"
					}), /* @__PURE__ */ p("button", {
						className: Z.choiceBtn,
						"data-forget-no": !0,
						onClick: () => v(!1),
						children: "Keep it"
					})]
				})]
			}) : /* @__PURE__ */ p("button", {
				className: Z.resetBtn,
				"data-forget-ask": !0,
				onClick: () => v(!0),
				children: "Forget my usage on this site"
			})]
		})] }),
		reading: () => /* @__PURE__ */ m(f, { children: [
			/* @__PURE__ */ p("div", {
				className: Z.fontRow,
				role: "radiogroup",
				"aria-label": "Font",
				children: O.map((t) => /* @__PURE__ */ p("button", {
					role: "radio",
					"aria-checked": k === t.id,
					"data-font": t.id,
					className: `${Z.fontBtn} ${k === t.id ? Z.aidOn : ""}`,
					style: { fontFamily: t.family },
					onClick: () => e.setReaderAid && e.setReaderAid("font", t.id),
					children: t.label
				}, t.id))
			}),
			O.filter((e) => e.license).map((e) => /* @__PURE__ */ m("div", {
				className: Z.hint,
				children: [
					e.label,
					" is under the ",
					/* @__PURE__ */ p("a", {
						className: Z.hintLink,
						href: `./fonts/${e.license}`,
						target: "_blank",
						rel: "noopener",
						children: e.licenseName
					}),
					"."
				]
			}, e.id)),
			/* @__PURE__ */ p(Au, {
				label: "Size",
				name: "size",
				options: Du,
				value: A,
				onChange: (t) => e.setReaderAid("size", t)
			}),
			/* @__PURE__ */ m("div", {
				className: Z.choiceRow,
				children: [/* @__PURE__ */ p("span", {
					className: Z.rowLabel,
					children: "Paragraphs"
				}), /* @__PURE__ */ m("span", {
					className: Z.choices,
					children: [/* @__PURE__ */ p("button", {
						className: `${Z.choiceBtn} ${e.paragraphIndent() ? Z.aidOn : ""}`,
						"aria-pressed": e.paragraphIndent(),
						onClick: () => e.setParagraphIndent(!e.paragraphIndent()),
						children: "Indent first line"
					}), /* @__PURE__ */ p("button", {
						className: `${Z.choiceBtn} ${e.paragraphSpace() ? Z.aidOn : ""}`,
						"aria-pressed": e.paragraphSpace(),
						onClick: () => e.setParagraphSpace(!e.paragraphSpace()),
						children: "Space between"
					})]
				})]
			}),
			/* @__PURE__ */ m("div", {
				className: Z.aidList,
				children: [/* @__PURE__ */ p(ku, {
					viewState: e,
					aid: "followAlong",
					label: "Highlighter: follow along",
					hint: "Tap or drag through the text to mark the sentence and word you are on."
				}), /* @__PURE__ */ p(ku, {
					viewState: e,
					aid: "boldStart",
					label: "Bold word beginnings",
					hint: "The first part of each word is bold, to lead the eye. The text itself is unchanged."
				})]
			})
		] }),
		paper: () => xe,
		listening: () => /* @__PURE__ */ m(f, { children: [/* @__PURE__ */ p(Qo, {}), /* @__PURE__ */ p("div", {
			className: Z.hint,
			children: "Play and pause are in the reader."
		})] })
	};
	return /* @__PURE__ */ m(f, { children: [D && /* @__PURE__ */ p(Pu, {
		className: Z.gearBtn,
		size: 18,
		"aria-expanded": h,
		"data-settings-gear": !0
	}), h && /* @__PURE__ */ m(f, { children: [/* @__PURE__ */ p("div", {
		className: Z.backdrop,
		onClick: () => g(!1)
	}), /* @__PURE__ */ m("aside", {
		className: Z.drawer,
		role: "dialog",
		"aria-label": (0, vu.panelTitle)(S, d),
		ref: b,
		"data-settings-panel": d,
		children: [/* @__PURE__ */ m("div", {
			className: Z.header,
			children: [
				/* @__PURE__ */ p("span", {
					className: Z.title,
					children: (0, vu.panelTitle)(S, d)
				}),
				d === "reader" && n && /* @__PURE__ */ p("span", {
					className: Z.subject,
					"data-settings-subject": !0,
					children: n.title
				}),
				/* @__PURE__ */ p("button", {
					className: Z.closeBtn,
					onClick: () => g(!1),
					"aria-label": "Close",
					children: /* @__PURE__ */ p(il, {
						body: (0, sl.iconBody)("x"),
						size: 18
					})
				})
			]
		}), ie.map((e) => /* @__PURE__ */ p(ju, {
			id: e.id,
			title: e.title,
			children: Se[e.id]()
		}, e.id))]
	})] })] });
}
var Q = {
	triggerBtn: "_triggerBtn_1f7ti_11",
	open: "_open_1f7ti_39",
	backdrop: "_backdrop_1f7ti_46",
	panel: "_panel_1f7ti_55",
	panelIn: "_panelIn_1f7ti_1",
	header: "_header_1f7ti_100",
	panelTitle: "_panelTitle_1f7ti_108",
	closeBtn: "_closeBtn_1f7ti_114",
	section: "_section_1f7ti_135",
	sectionTitle: "_sectionTitle_1f7ti_143",
	toggleRow: "_toggleRow_1f7ti_153",
	toggleLabel: "_toggleLabel_1f7ti_161",
	toggleSub: "_toggleSub_1f7ti_167",
	switch: "_switch_1f7ti_175",
	switchInput: "_switchInput_1f7ti_183",
	switchTrack: "_switchTrack_1f7ti_190",
	colorRow: "_colorRow_1f7ti_222",
	colorLabel: "_colorLabel_1f7ti_229",
	colorInput: "_colorInput_1f7ti_235",
	colorHex: "_colorHex_1f7ti_247",
	textInputRow: "_textInputRow_1f7ti_255",
	textInput: "_textInput_1f7ti_255",
	selectRow: "_selectRow_1f7ti_279",
	select: "_select_1f7ti_279",
	actions: "_actions_1f7ti_302",
	actionBtn: "_actionBtn_1f7ti_309",
	actionBtnAccent: "_actionBtnAccent_1f7ti_328 _actionBtn_1f7ti_309",
	actionBtnDanger: "_actionBtnDanger_1f7ti_338 _actionBtn_1f7ti_309",
	snippet: "_snippet_1f7ti_350",
	snippetCode: "_snippetCode_1f7ti_359",
	toast: "_toast_1f7ti_368",
	toastIn: "_toastIn_1f7ti_1",
	slideUp: "_slideUp_1f7ti_1"
}, Iu = {
	readerPanel: !0,
	tts: !0,
	feedBar: !0,
	addFeed: !0,
	layoutControls: !0,
	dimensions: !0,
	undoRedo: !0,
	colorSettings: !0,
	configPanel: !0,
	keyboardShortcuts: !0
}, Lu = [
	{
		key: "readerPanel",
		label: "Reader Panel",
		sub: "Click a node to read the full article"
	},
	{
		key: "tts",
		label: "Text-to-Speech",
		sub: "Read-aloud toolbar inside the reader"
	},
	{
		key: "feedBar",
		label: "Feed Sources Bar",
		sub: "Pill bar to show/hide feed sources"
	},
	{
		key: "addFeed",
		label: "Add Feed (+)",
		sub: "Button to add new RSS/Atom/JSON feeds"
	},
	{
		key: "layoutControls",
		label: "Layout Controls",
		sub: "Cluster / ring layout picker"
	},
	{
		key: "dimensions",
		label: "Dimensions",
		sub: "Time, narrative, chronology overlays"
	},
	{
		key: "undoRedo",
		label: "Undo / Redo",
		sub: "History controls for arrangement"
	},
	{
		key: "colorSettings",
		label: "Color Settings",
		sub: "Graph color scheme (gear icon)"
	},
	{
		key: "keyboardShortcuts",
		label: "Keyboard Shortcuts",
		sub: "Cmd+Z undo, escape to close, etc."
	}
], Ru = [
	{
		key: "bg",
		label: "Background"
	},
	{
		key: "surface",
		label: "Surface"
	},
	{
		key: "accent",
		label: "Accent"
	},
	{
		key: "text",
		label: "Text"
	},
	{
		key: "text_bright",
		label: "Text Bright"
	}
], zu = [
	{
		value: "localStorage",
		label: "Browser (localStorage)"
	},
	{
		value: "memory",
		label: "Session only (memory)"
	},
	{
		value: "none",
		label: "Disabled"
	}
];
function Bu({ config: e, onUpdate: t, onReset: i, visible: a = !0 }) {
	let [o, l] = c(!1), [u, d] = c(null), [h, g] = c(!1), _ = s(null), v = s(null), y = s(null), b = (e) => {
		v.current = e.touches[0].clientY;
	}, x = (e) => {
		if (v.current === null) return;
		let t = e.touches[0].clientY - v.current;
		y.current && y.current.scrollTop > 0 || t > 80 && (l(!1), v.current = null);
	}, S = () => {
		v.current = null;
	};
	r(() => {
		if (!o) return;
		let e = (e) => {
			e.key === "Escape" && l(!1);
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [o]);
	let C = {
		...Iu,
		...e.features || {}
	}, w = e.theme || {}, T = n((e, n) => {
		t({ features: {
			...C,
			[e]: n
		} });
	}, [C, t]), E = n((e, n) => {
		t({ theme: {
			...w,
			[e]: n
		} });
	}, [w, t]), D = n((e) => {
		t({ persistence: e });
	}, [t]), O = n((e) => {
		t({ feed: e || void 0 });
	}, [t]), k = n(() => {
		let t = Uu(e);
		navigator.clipboard.writeText(t).then(() => {
			d("Copied to clipboard"), setTimeout(() => d(null), 1800);
		}).catch(() => {
			g(!0);
		});
	}, [e]), A = n(() => {
		_.current && _.current.click();
	}, []), j = n((e) => {
		let n = e.target.files[0];
		if (!n) return;
		let r = new FileReader();
		r.onload = (e) => {
			try {
				t(JSON.parse(e.target.result)), d("Config imported"), setTimeout(() => d(null), 1800);
			} catch {
				d("Invalid JSON"), setTimeout(() => d(null), 2500);
			}
		}, r.readAsText(n), e.target.value = "";
	}, [t]);
	return a ? /* @__PURE__ */ m(f, { children: [
		/* @__PURE__ */ p("button", {
			className: `${Q.triggerBtn} ${o ? Q.open : ""}`,
			onClick: () => l((e) => !e),
			title: "Configure viewer",
			"aria-label": "Configure viewer",
			children: "⚡"
		}),
		o && /* @__PURE__ */ m(f, { children: [/* @__PURE__ */ p("div", {
			className: Q.backdrop,
			onClick: () => l(!1)
		}), /* @__PURE__ */ m("div", {
			className: Q.panel,
			role: "dialog",
			"aria-label": "Viewer Configuration",
			ref: y,
			onTouchStart: b,
			onTouchMove: x,
			onTouchEnd: S,
			children: [
				/* @__PURE__ */ m("div", {
					className: Q.header,
					children: [/* @__PURE__ */ p("span", {
						className: Q.panelTitle,
						children: "Viewer Configuration"
					}), /* @__PURE__ */ p("button", {
						className: Q.closeBtn,
						onClick: () => l(!1),
						"aria-label": "Close",
						children: "×"
					})]
				}),
				/* @__PURE__ */ m("div", {
					className: Q.section,
					children: [/* @__PURE__ */ p("div", {
						className: Q.sectionTitle,
						children: "Features"
					}), Lu.map((e) => /* @__PURE__ */ p(Vu, {
						label: e.label,
						sub: e.sub,
						checked: C[e.key],
						onChange: (t) => T(e.key, t)
					}, e.key))]
				}),
				/* @__PURE__ */ m("div", {
					className: Q.section,
					children: [
						/* @__PURE__ */ p("div", {
							className: Q.sectionTitle,
							children: "Data"
						}),
						/* @__PURE__ */ p("div", {
							className: Q.textInputRow,
							children: /* @__PURE__ */ p("input", {
								type: "url",
								className: Q.textInput,
								placeholder: "Feed URL (default: ./feed.json)",
								value: e.feed || "",
								onChange: (e) => O(e.target.value)
							})
						}),
						/* @__PURE__ */ m("div", {
							className: Q.selectRow,
							children: [/* @__PURE__ */ p("span", {
								className: Q.toggleLabel,
								children: "Persistence"
							}), /* @__PURE__ */ p("select", {
								className: Q.select,
								value: e.persistence || "localStorage",
								onChange: (e) => D(e.target.value),
								children: zu.map((e) => /* @__PURE__ */ p("option", {
									value: e.value,
									children: e.label
								}, e.value))
							})]
						})
					]
				}),
				/* @__PURE__ */ m("div", {
					className: Q.section,
					children: [/* @__PURE__ */ p("div", {
						className: Q.sectionTitle,
						children: "Theme"
					}), Ru.map((e) => /* @__PURE__ */ m("div", {
						className: Q.colorRow,
						children: [
							/* @__PURE__ */ p("span", {
								className: Q.colorLabel,
								children: e.label
							}),
							/* @__PURE__ */ p("input", {
								type: "color",
								className: Q.colorInput,
								value: w[e.key] || Hu(e.key),
								onChange: (t) => E(e.key, t.target.value)
							}),
							/* @__PURE__ */ p("span", {
								className: Q.colorHex,
								children: w[e.key] || Hu(e.key)
							})
						]
					}, e.key))]
				}),
				/* @__PURE__ */ m("div", {
					className: Q.section,
					children: [
						/* @__PURE__ */ p("div", {
							className: Q.sectionTitle,
							children: "Actions"
						}),
						/* @__PURE__ */ m("div", {
							className: Q.actions,
							children: [
								/* @__PURE__ */ p("button", {
									className: Q.actionBtnAccent,
									onClick: k,
									children: "Export Config"
								}),
								/* @__PURE__ */ p("button", {
									className: Q.actionBtn,
									onClick: A,
									children: "Import Config"
								}),
								/* @__PURE__ */ p("button", {
									className: Q.actionBtnDanger,
									onClick: i,
									children: "Reset All"
								})
							]
						}),
						/* @__PURE__ */ p("input", {
							ref: _,
							type: "file",
							accept: ".json",
							style: { display: "none" },
							onChange: j
						}),
						h && /* @__PURE__ */ p("div", {
							className: Q.snippet,
							children: /* @__PURE__ */ p("code", {
								className: Q.snippetCode,
								children: Uu(e)
							})
						}),
						!h && /* @__PURE__ */ p("button", {
							className: Q.actionBtn,
							onClick: () => g(!0),
							style: {
								marginTop: "6px",
								width: "100%"
							},
							children: "Show Embed Snippet"
						}),
						h && /* @__PURE__ */ p("button", {
							className: Q.actionBtn,
							onClick: () => g(!1),
							style: {
								marginTop: "4px",
								width: "100%"
							},
							children: "Hide Snippet"
						})
					]
				})
			]
		})] }),
		u && /* @__PURE__ */ p("div", {
			className: Q.toast,
			children: u
		})
	] }) : null;
}
function Vu({ label: e, sub: t, checked: n, onChange: r }) {
	return /* @__PURE__ */ m("div", {
		className: Q.toggleRow,
		children: [/* @__PURE__ */ m("span", {
			className: Q.toggleLabel,
			children: [e, t && /* @__PURE__ */ p("span", {
				className: Q.toggleSub,
				children: t
			})]
		}), /* @__PURE__ */ m("label", {
			className: Q.switch,
			children: [/* @__PURE__ */ p("input", {
				type: "checkbox",
				className: Q.switchInput,
				checked: n,
				onChange: (e) => r(e.target.checked)
			}), /* @__PURE__ */ p("span", { className: Q.switchTrack })]
		})]
	});
}
function Hu(e) {
	return {
		bg: "#1a1a2e",
		surface: "#0a0e1a",
		accent: "#64ffda",
		text: "#a8b2d1",
		text_bright: "#ccd6f6"
	}[e] || "#888888";
}
function Uu(e) {
	let t = {};
	if (e.feed && e.feed !== "./feed.json" && (t.feed = e.feed), e.persistence && e.persistence !== "localStorage" && (t.persistence = e.persistence), e.features) {
		let n = {};
		for (let [t, r] of Object.entries(e.features)) r !== Iu[t] && (n[t] = r);
		Object.keys(n).length && (t.features = n);
	}
	return e.theme && Object.keys(e.theme).length && (t.theme = e.theme), [
		"<div id=\"post-pipe\"></div>",
		"<script src=\"post-pipe.embed.js\"><\/script>",
		"<script>",
		`  PostPipe.init('#post-pipe', {${Object.keys(t).length ? "\n    " + JSON.stringify(t, null, 2).split("\n").join("\n    ") + "\n  " : ""}});`,
		"<\/script>"
	].join("\n");
}
var Wu = {
	timeOverlay: "_timeOverlay_1mhyj_1",
	header: "_header_1mhyj_24",
	titleGroup: "_titleGroup_1mhyj_36",
	title: "_title_1mhyj_36",
	rangeBadge: "_rangeBadge_1mhyj_50",
	clearBtn: "_clearBtn_1mhyj_56",
	stackScroll: "_stackScroll_1mhyj_72",
	monthBox: "_monthBox_1mhyj_95",
	emptyMonth: "_emptyMonth_1mhyj_106",
	activeMonth: "_activeMonth_1mhyj_111",
	monthHeader: "_monthHeader_1mhyj_122",
	monthName: "_monthName_1mhyj_130",
	yearTag: "_yearTag_1mhyj_140",
	monthMeta: "_monthMeta_1mhyj_146",
	hasItems: "_hasItems_1mhyj_152",
	branchArea: "_branchArea_1mhyj_158",
	branchLine: "_branchLine_1mhyj_166",
	weeksRow: "_weeksRow_1mhyj_175",
	weekPill: "_weekPill_1mhyj_182",
	hasContent: "_hasContent_1mhyj_197",
	activeWeek: "_activeWeek_1mhyj_210",
	weekBadge: "_weekBadge_1mhyj_217"
}, Gu = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
];
function Ku(e) {
	return (e.url || e.id || "").split("/").pop().replace(".html", "");
}
function qu({ feedData: e, onFilterChange: t }) {
	let [n, r] = c(null), i = a(() => {
		if (!e || !e.items || !e.items.length) return {
			months: [],
			totalItems: 0,
			minYear: null,
			maxYear: null
		};
		let t = [], n = null, r = null;
		if (e.items.forEach((e) => {
			let i = e.date_published || e.date;
			if (!i) return;
			let a = new Date(i);
			if (isNaN(a.getTime())) return;
			let o = Ku(e);
			t.push({
				item: e,
				date: a,
				slug: o
			}), (!n || a < n) && (n = a), (!r || a > r) && (r = a);
		}), !n || !r) return {
			months: [],
			totalItems: 0,
			minYear: null,
			maxYear: null
		};
		let i = n.getFullYear(), a = n.getMonth(), o = r.getFullYear(), s = r.getMonth(), c = [], l = new Date(i, a, 1), u = new Date(o, s, 1);
		for (; l <= u;) {
			let e = l.getFullYear(), n = l.getMonth(), r = `${e}-${String(n + 1).padStart(2, "0")}`, i = [
				{
					label: "Wk 1",
					id: `${r}-w1`,
					range: [1, 7],
					articleSlugs: []
				},
				{
					label: "Wk 2",
					id: `${r}-w2`,
					range: [8, 14],
					articleSlugs: []
				},
				{
					label: "Wk 3",
					id: `${r}-w3`,
					range: [15, 21],
					articleSlugs: []
				},
				{
					label: "Wk 4",
					id: `${r}-w4`,
					range: [22, 28],
					articleSlugs: []
				},
				{
					label: "Wk 5",
					id: `${r}-w5`,
					range: [29, 31],
					articleSlugs: []
				}
			], a = [];
			t.forEach(({ date: t, slug: r }) => {
				if (t.getFullYear() === e && t.getMonth() === n) {
					a.push(r);
					let e = t.getDate(), n = i.find((t) => e >= t.range[0] && e <= t.range[1]);
					n && n.articleSlugs.push(r);
				}
			}), c.push({
				key: r,
				year: e,
				monthIndex: n,
				monthName: Gu[n],
				articleSlugs: a,
				weeks: i
			}), l = new Date(l.getFullYear(), l.getMonth() + 1, 1);
		}
		return c.reverse(), {
			months: c,
			totalItems: t.length,
			minYear: i,
			maxYear: o
		};
	}, [e]);
	if (!i.months.length) return null;
	let o = (e) => {
		e.articleSlugs.length !== 0 && (n === e.key ? (r(null), t && t(null, null)) : (r(e.key), t && t(new Set(e.articleSlugs), `${e.monthName} ${e.year}`)));
	}, s = (e, i, a) => {
		e.stopPropagation(), i.articleSlugs.length !== 0 && (n === i.id ? (r(null), t && t(null, null)) : (r(i.id), t && t(new Set(i.articleSlugs), `${a.monthName} ${i.label}`)));
	};
	return /* @__PURE__ */ m("div", {
		className: Wu.timeOverlay,
		children: [/* @__PURE__ */ m("div", {
			className: Wu.header,
			children: [/* @__PURE__ */ m("div", {
				className: Wu.titleGroup,
				children: [/* @__PURE__ */ p("span", {
					className: Wu.title,
					children: "Chronology"
				}), /* @__PURE__ */ p("span", {
					className: Wu.rangeBadge,
					children: i.minYear === i.maxYear ? i.minYear : `${i.minYear}–${i.maxYear}`
				})]
			}), n && /* @__PURE__ */ p("button", {
				className: Wu.clearBtn,
				onClick: () => {
					r(null), t && t(null, null);
				},
				title: "Show all posts",
				children: "Reset"
			})]
		}), /* @__PURE__ */ p("div", {
			className: Wu.stackScroll,
			children: i.months.map((e, t) => {
				let r = n === e.key, a = e.articleSlugs.length === 0, c = i.months[t - 1], l = !c || c.year !== e.year;
				return /* @__PURE__ */ m("div", {
					className: `${Wu.monthBox} ${a ? Wu.emptyMonth : ""} ${r ? Wu.activeMonth : ""}`,
					children: [/* @__PURE__ */ m("div", {
						className: Wu.monthHeader,
						onClick: () => o(e),
						title: a ? "No articles published this month" : `Filter to ${e.monthName} ${e.year} (${e.articleSlugs.length})`,
						children: [/* @__PURE__ */ m("div", {
							className: Wu.monthName,
							children: [e.monthName, l && /* @__PURE__ */ p("span", {
								className: Wu.yearTag,
								children: e.year
							})]
						}), /* @__PURE__ */ p("div", {
							className: `${Wu.monthMeta} ${e.articleSlugs.length > 0 ? Wu.hasItems : ""}`,
							children: e.articleSlugs.length > 0 ? `${e.articleSlugs.length} post${e.articleSlugs.length > 1 ? "s" : ""}` : "0 posts"
						})]
					}), /* @__PURE__ */ m("div", {
						className: Wu.branchArea,
						children: [/* @__PURE__ */ p("div", { className: Wu.branchLine }), /* @__PURE__ */ p("div", {
							className: Wu.weeksRow,
							children: e.weeks.map((t) => {
								let r = t.articleSlugs.length, i = n === t.id;
								return /* @__PURE__ */ m("div", {
									className: `${Wu.weekPill} ${r > 0 ? Wu.hasContent : ""} ${i ? Wu.activeWeek : ""}`,
									onClick: (n) => s(n, t, e),
									title: r > 0 ? `${t.label}: ${r} post${r > 1 ? "s" : ""}` : `${t.label}: empty`,
									children: [/* @__PURE__ */ p("span", { children: t.label }), r > 0 && /* @__PURE__ */ p("span", {
										className: Wu.weekBadge,
										children: r
									})]
								}, t.id);
							})
						})]
					})]
				}, e.key);
			})
		})]
	});
}
var $ = {
	bar: "_bar_1cq89_4",
	group: "_group_1cq89_17",
	spacer: "_spacer_1cq89_31",
	label: "_label_1cq89_36",
	seg: "_seg_1cq89_44",
	icon: "_icon_1cq89_45",
	action: "_action_1cq89_46",
	on: "_on_1cq89_75",
	moreMark: "_moreMark_1cq89_89",
	backdrop: "_backdrop_1cq89_96",
	sheet: "_sheet_1cq89_103",
	sectionTitle: "_sectionTitle_1cq89_124",
	wrapRow: "_wrapRow_1cq89_132",
	narrowOnly: "_narrowOnly_1cq89_146",
	wideOnly: "_wideOnly_1cq89_151",
	moreText: "_moreText_1cq89_170",
	more: "_more_1cq89_89",
	layer: "_layer_1cq89_191",
	top: "_top_1cq89_197",
	topIcon: "_topIcon_1cq89_215",
	menu: "_menu_1cq89_253",
	menuHeading: "_menuHeading_1cq89_276",
	menuItem: "_menuItem_1cq89_284",
	menuCheck: "_menuCheck_1cq89_308",
	menuSeg: "_menuSeg_1cq89_324",
	menuDivider: "_menuDivider_1cq89_336",
	menuLayout: "_menuLayout_1cq89_342",
	tagMenu: "_tagMenu_1cq89_364",
	menuSearch: "_menuSearch_1cq89_368",
	tagRows: "_tagRows_1cq89_386",
	tagSwatch: "_tagSwatch_1cq89_401",
	tagLabel: "_tagLabel_1cq89_409",
	tagCount: "_tagCount_1cq89_416",
	menuEmpty: "_menuEmpty_1cq89_422"
}, Ju = (/* @__PURE__ */ h(((e, t) => {
	var n = [
		{
			id: "time",
			label: "published",
			title: "Published date"
		},
		{
			id: "commits",
			label: "commits",
			title: "Edit history: one link per commit bucket"
		},
		{
			id: "narrative",
			label: "narrative",
			title: "Narrative position: reading order, 0 to 1"
		},
		{
			id: "chronology",
			label: "chronology",
			title: "Chronological position in story-world time"
		}
	], r = [{
		id: "readers",
		label: "readers",
		title: "Readers' connections: links readers drew between chapters (not the book's own)"
	}], i = {
		readers: (e) => `${e}: links readers drew between chapters (not the book's own)`,
		time: (e) => `${e}: the date each piece was published`,
		commits: (e) => `Edit history: one link per bucket of ${e}`,
		narrative: (e) => `${e}: reading order, 0 to 1`,
		chronology: (e) => `${e}: position in story-world time`
	};
	function a(e, t = n) {
		let r = e && e.dimensions && e.dimensions.labels || {};
		return t.map((e) => {
			let t = r[e.id];
			if (typeof t == "string" && t.trim()) {
				let n = t.trim();
				return {
					...e,
					label: n,
					title: i[e.id](n)
				};
			}
			if (t && typeof t == "object") {
				let n = t.label && String(t.label).trim() || e.label, r = t.title && String(t.title).trim() || (n === e.label ? e.title : i[e.id](n));
				return {
					...e,
					label: n,
					title: r
				};
			}
			return { ...e };
		});
	}
	var o = (e) => a(e, r), s = "dimensions";
	function c(e) {
		let t = e && e.dimensions && e.dimensions.groupLabel;
		return typeof t == "string" && t.trim() ? t.trim() : s;
	}
	t.exports = {
		dimensionLabels: a,
		layerLabels: o,
		dimensionGroupLabel: c,
		DIMENSIONS: n,
		LAYERS: r,
		GROUP_LABEL: s
	};
})))(), Yu = [{
	id: "force",
	label: "cluster",
	title: "Cluster: each container its own path"
}, {
	id: "radial",
	label: "ring",
	title: "Ring: each container its own ring"
}], Xu = (e, t) => window.dispatchEvent(new CustomEvent(e, t === void 0 ? void 0 : { detail: t }));
function Zu({ viewState: e, show: t = {}, layouts: n = Yu, settings: r, layers: i = [], placement: a = "bottom", feedData: o = null, hiddenSources: s = null }) {
	return a === "top" ? /* @__PURE__ */ p($u, {
		viewState: e,
		show: t,
		layouts: n,
		settings: r,
		layers: i,
		feedData: o,
		hiddenSources: s
	}) : /* @__PURE__ */ p(Qu, {
		viewState: e,
		show: t,
		layouts: n,
		settings: r,
		layers: i
	});
}
function Qu({ viewState: e, show: t, layouts: n, settings: i, layers: a }) {
	let s = i || (typeof window < "u" ? window.SETTINGS : null), l = (0, Ju.dimensionLabels)(s), u = (0, Ju.dimensionGroupLabel)(s), d = u.charAt(0).toUpperCase() + u.slice(1), h = (0, Ju.layerLabels)(s).filter((e) => a.includes(e.id)), [, g] = o((e) => e + 1, 0), [_, v] = c(!1);
	if (r(() => e ? e.subscribe(g) : void 0, [e]), r(() => {
		if (!_) return;
		let e = (e) => {
			e.key === "Escape" && v(!1);
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [_]), !e) return null;
	let y = t.history !== !1, b = t.layout !== !1, x = t.dimensions !== !1, S = e.state.layout, C = e.timeAxis(), w = C.dimension || "time", T = (t) => e.setTimeAxis((0, yu.toggleDimension)(C, t)), E = () => e.setTimeAxis({ granularity: (0, yu.nextGranularity)(C.granularity) }), D = (0, yu.hasGranularity)(C), O = /* @__PURE__ */ m(f, { children: [
		l.map((e) => {
			let t = C.on && w === e.id;
			return /* @__PURE__ */ p("button", {
				className: `${$.seg} ${t ? $.on : ""}`,
				"aria-pressed": t,
				title: e.title,
				onClick: () => T(e.id),
				children: e.label
			}, e.id);
		}),
		h.map((t) => {
			let n = e.preference(t.id) === !0;
			return /* @__PURE__ */ p("button", {
				className: `${$.seg} ${$.layer} ${n ? $.on : ""}`,
				"aria-pressed": n,
				title: t.title,
				"data-dimension": t.id,
				onClick: () => e.setPreference(t.id, n ? null : !0),
				children: t.label
			}, t.id);
		}),
		D && /* @__PURE__ */ m("button", {
			className: $.seg,
			title: "Bucket size: auto, day, week, month, year",
			onClick: E,
			children: ["· ", C.granularity || "auto"]
		})
	] });
	return /* @__PURE__ */ m(f, { children: [/* @__PURE__ */ m("div", {
		className: $.bar,
		role: "toolbar",
		"aria-label": "Graph controls",
		"data-toolbar": !0,
		children: [
			y && /* @__PURE__ */ m("div", {
				className: $.group,
				"data-group": "history",
				children: [/* @__PURE__ */ p("button", {
					className: $.icon,
					title: "Undo (Cmd+Z)",
					"aria-label": "Undo",
					disabled: !e.canUndo,
					onClick: () => e.undo(),
					children: "↩"
				}), /* @__PURE__ */ p("button", {
					className: $.icon,
					title: "Redo (Cmd+Shift+Z)",
					"aria-label": "Redo",
					disabled: !e.canRedo,
					onClick: () => e.redo(),
					children: "↪"
				})]
			}),
			b && /* @__PURE__ */ m("div", {
				className: $.group,
				"data-group": "layout",
				role: "radiogroup",
				"aria-label": "Layout",
				children: [/* @__PURE__ */ p("span", {
					className: $.label,
					children: "layout"
				}), n.map((t) => {
					let n = S === t.id;
					return /* @__PURE__ */ p("button", {
						className: `${$.seg} ${n ? $.on : ""}`,
						role: "radio",
						"aria-checked": n,
						title: t.title,
						onClick: () => {
							n || e.setLayout(t.id);
						},
						children: t.label
					}, t.id);
				})]
			}),
			x && /* @__PURE__ */ m("div", {
				className: `${$.group} ${$.wideOnly}`,
				"data-group": "dimensions",
				"aria-label": d,
				children: [/* @__PURE__ */ p("span", {
					className: $.label,
					"data-group-label": !0,
					children: u
				}), O]
			}),
			/* @__PURE__ */ p("div", { className: $.spacer }),
			/* @__PURE__ */ m("div", {
				className: $.group,
				"data-group": "view",
				children: [/* @__PURE__ */ p("button", {
					className: $.seg,
					title: yu.RESET_TITLE,
					"data-toolbar-reset": !0,
					onClick: () => {
						v(!1), Xu("graph:reset-all");
					},
					children: "Reset"
				}), /* @__PURE__ */ m("button", {
					className: `${$.seg} ${$.more} ${_ ? $.on : ""}`,
					"aria-expanded": _,
					"aria-controls": "pp-toolbar-more",
					title: `More: ${u} and view actions`,
					"aria-label": "More",
					"data-toolbar-more": !0,
					onClick: () => v((e) => !e),
					children: [/* @__PURE__ */ p("span", {
						className: $.moreText,
						children: "More "
					}), /* @__PURE__ */ p("span", {
						"aria-hidden": "true",
						className: $.moreMark,
						children: _ ? "▾" : "▴"
					})]
				})]
			})
		]
	}), _ && /* @__PURE__ */ m(f, { children: [/* @__PURE__ */ p("div", {
		className: $.backdrop,
		onClick: () => v(!1)
	}), /* @__PURE__ */ m("div", {
		className: $.sheet,
		id: "pp-toolbar-more",
		role: "dialog",
		"aria-label": "More graph controls",
		"data-toolbar-sheet": !0,
		children: [x && /* @__PURE__ */ m("div", {
			className: `${$.section} ${$.narrowOnly}`,
			children: [/* @__PURE__ */ p("div", {
				className: $.sectionTitle,
				"data-group-label": !0,
				children: d
			}), /* @__PURE__ */ p("div", {
				className: $.wrapRow,
				children: O
			})]
		}), /* @__PURE__ */ m("div", {
			className: $.section,
			children: [/* @__PURE__ */ p("div", {
				className: $.sectionTitle,
				children: "View"
			}), /* @__PURE__ */ p("div", {
				className: $.wrapRow,
				children: (0, yu.viewActionsFor)(s).map((e) => /* @__PURE__ */ p("button", {
					className: $.action,
					title: e.title,
					onClick: () => {
						Xu(e.event), v(!1);
					},
					children: e.label
				}, e.event))
			})]
		})]
	})] })] });
}
function $u({ viewState: e, show: t, layouts: n, settings: i, layers: a, feedData: l, hiddenSources: u }) {
	let d = i || (typeof window < "u" ? window.SETTINGS : null), [, h] = o((e) => e + 1, 0), [g, _] = c(null), [v, y] = c(""), [b, x] = c(null), S = s(null), C = s(null), w = s(null), T = s(null);
	r(() => e ? e.subscribe(h) : void 0, [e]), r(() => {
		let e = (e) => x(e.detail && e.detail.id ? e.detail.id : null);
		return window.addEventListener("graph:tag-changed", e), () => window.removeEventListener("graph:tag-changed", e);
	}, []);
	let [E, D] = c(() => typeof window < "u" && window.PostPipeGraphTags || null);
	r(() => {
		let e = () => D(window.PostPipeGraphTags || null);
		return e(), window.addEventListener("graph:tag-counts", e), () => window.removeEventListener("graph:tag-counts", e);
	}, []);
	let O = () => T.current ? [...T.current.querySelectorAll("[data-menu-item]")] : [], k = (e) => {
		let t = g === "tags" ? w.current : C.current;
		_(null), e && t && t.focus();
	};
	if (r(() => {
		if (!g) return;
		let e = (T.current ? T.current.querySelector("[data-menu-search]") : null) || O()[0];
		e && e.focus({ preventScroll: !0 });
		let t = (e) => {
			S.current && !S.current.contains(e.target) && _(null);
		}, n = (e) => {
			e.key !== "Escape" || T.current && T.current.contains(e.target) || (e.preventDefault(), e.stopImmediatePropagation(), k(!0));
		};
		return document.addEventListener("pointerdown", t, !0), window.addEventListener("keydown", n, !0), () => {
			document.removeEventListener("pointerdown", t, !0), window.removeEventListener("keydown", n, !0);
		};
	}, [g]), !e) return null;
	let A = t.history !== !1, j = (0, Ju.dimensionGroupLabel)(d), M = (e) => e.charAt(0).toUpperCase() + e.slice(1), N = e.timeAxis(), P = (0, yu.menuModel)({
		dimensions: (0, Ju.dimensionLabels)(d),
		layers: (0, Ju.layerLabels)(d).filter((e) => a.includes(e.id)),
		axis: N,
		preferences: Object.fromEntries((0, Ju.layerLabels)(d).map((t) => [t.id, e.preference(t.id)])),
		show: t,
		group: j
	}), F = P.rows.length > 0, I = M(P.heading), L = (0, xu.hasTagNodes)(l, d && d.graph), ee = [];
	if (L && g === "tags") {
		let t = typeof document < "u" ? document.querySelector("[data-graph-root]") || document.documentElement : null, n = t && typeof getComputedStyle == "function" && getComputedStyle(t).getPropertyValue("--gv-tag-color").trim() || null, r = E && Array.isArray(E.counts) ? E.counts.reduce((e, t) => Number.isFinite(Number(t)) && Number(t) > e ? Number(t) : e, -1) : -1;
		ee = (0, xu.tagListModel)(l, {
			hiddenSources: u || e.state && e.state.hiddenSources || [],
			sourceColorOf: (t) => typeof e.sourceColor == "function" ? e.sourceColor(t) : null,
			fallbackColor: n,
			minPieces: typeof e.preference == "function" ? e.preference(Cc.PREF) : null,
			tagCounts: E && E.byTag && typeof E.byTag == "object" ? E.byTag : null,
			maxPieces: r >= 0 ? r : null
		});
	}
	let te = (0, xu.filterTagRows)(ee, v), ne = ee.length > xu.SEARCH_FROM, re = () => {
		y(""), _((e) => e === "tags" ? null : "tags");
	}, ie = (e) => {
		if (e.key === "Escape") {
			e.preventDefault(), e.stopPropagation(), k(!0);
			return;
		}
		if (e.key === "Tab") {
			_(null);
			return;
		}
		if (e.target && typeof e.target.matches == "function" && e.target.matches("[data-menu-search]") && e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
		let t = O(), n = (0, yu.menuMove)(t.indexOf(document.activeElement), e.key, t.length);
		n !== null && (e.preventDefault(), e.stopPropagation(), t[n].focus());
	};
	return /* @__PURE__ */ m("div", {
		ref: S,
		className: $.top,
		role: "group",
		"aria-label": "Graph controls",
		"data-top-graph-controls": !0,
		children: [
			A && /* @__PURE__ */ m(f, { children: [/* @__PURE__ */ p("button", {
				type: "button",
				className: $.topIcon,
				title: "Undo (Cmd+Z)",
				"aria-label": "Undo",
				"data-top-undo": !0,
				disabled: !e.canUndo,
				onClick: () => e.undo(),
				children: /* @__PURE__ */ p(il, {
					body: (0, sl.iconBody)("undo-2"),
					size: 15
				})
			}), /* @__PURE__ */ p("button", {
				type: "button",
				className: $.topIcon,
				title: "Redo (Cmd+Shift+Z)",
				"aria-label": "Redo",
				"data-top-redo": !0,
				disabled: !e.canRedo,
				onClick: () => e.redo(),
				children: /* @__PURE__ */ p(il, {
					body: (0, sl.iconBody)("redo-2"),
					size: 15
				})
			})] }),
			/* @__PURE__ */ p("button", {
				type: "button",
				className: $.topIcon,
				title: yu.RESET_TITLE,
				"aria-label": "Reset",
				"data-toolbar-reset": !0,
				onClick: () => {
					_(null), Xu("graph:reset-all");
				},
				children: /* @__PURE__ */ p(il, {
					body: (0, sl.iconBody)("rotate-ccw"),
					size: 15
				})
			}),
			F && /* @__PURE__ */ m(f, { children: [/* @__PURE__ */ p("button", {
				ref: C,
				type: "button",
				className: `${$.topIcon} ${g === "dimensions" ? $.on : ""}`,
				title: `${I}: which to show`,
				"aria-label": I,
				"aria-haspopup": "menu",
				"aria-expanded": g === "dimensions",
				"aria-controls": "pp-top-menu",
				"data-top-menu-button": !0,
				onClick: () => _((e) => e === "dimensions" ? null : "dimensions"),
				onKeyDown: (e) => {
					e.key === "ArrowDown" && g !== "dimensions" && (e.preventDefault(), _("dimensions"));
				},
				children: /* @__PURE__ */ p(il, {
					body: (0, sl.iconBody)("hourglass"),
					size: 15
				})
			}), g === "dimensions" && /* @__PURE__ */ m("div", {
				ref: T,
				id: "pp-top-menu",
				className: $.menu,
				role: "menu",
				"aria-labelledby": "pp-top-menu-heading",
				"data-top-menu": !0,
				onKeyDown: ie,
				children: [/* @__PURE__ */ p("div", {
					id: "pp-top-menu-heading",
					role: "presentation",
					className: $.menuHeading,
					"data-group-label": !0,
					children: I
				}), P.rows.map((t, n) => {
					if (t.kind === "dimension" || t.kind === "layer") {
						let n = t.kind === "dimension" ? () => e.setTimeAxis((0, yu.toggleDimension)(N, t.id)) : () => e.setPreference(t.id, t.checked ? null : !0);
						return /* @__PURE__ */ m("button", {
							type: "button",
							role: "menuitemcheckbox",
							"aria-checked": t.checked,
							title: t.title,
							className: `${$.menuItem} ${t.kind === "layer" ? $.layer : ""}`,
							"data-menu-item": !0,
							"data-dimension": t.id,
							onClick: n,
							children: [/* @__PURE__ */ p("span", {
								className: $.menuCheck,
								"aria-hidden": "true",
								children: t.checked && /* @__PURE__ */ p(il, {
									body: (0, sl.iconBody)("check"),
									size: 14
								})
							}), t.label]
						}, t.id);
					}
					return t.kind === "granularity" ? /* @__PURE__ */ m("button", {
						type: "button",
						role: "menuitem",
						className: $.menuItem,
						title: "Bucket size: auto, day, week, month, year",
						"data-menu-item": !0,
						"data-granularity": !0,
						onClick: () => e.setTimeAxis({ granularity: (0, yu.nextGranularity)(N.granularity) }),
						children: [
							/* @__PURE__ */ p("span", {
								className: $.menuCheck,
								"aria-hidden": "true"
							}),
							"bucket size · ",
							t.value
						]
					}, "granularity") : null;
				})]
			})] }),
			L && /* @__PURE__ */ m(f, { children: [/* @__PURE__ */ p("button", {
				ref: w,
				type: "button",
				className: `${$.topIcon} ${g === "tags" ? $.on : ""}`,
				title: "Tagz",
				"aria-label": "Tagz",
				"aria-haspopup": "dialog",
				"aria-expanded": g === "tags",
				"aria-controls": "pp-top-tags",
				"data-top-tags-button": !0,
				onClick: re,
				onKeyDown: (e) => {
					e.key === "ArrowDown" && g !== "tags" && (e.preventDefault(), re());
				},
				children: /* @__PURE__ */ p(il, {
					body: (0, sl.iconBody)("tag"),
					size: 15
				})
			}), g === "tags" && /* @__PURE__ */ m("div", {
				ref: T,
				id: "pp-top-tags",
				className: `${$.menu} ${$.tagMenu}`,
				role: "dialog",
				"aria-label": "Tagz",
				"data-top-tags": !0,
				onKeyDown: ie,
				children: [
					/* @__PURE__ */ p("div", {
						role: "presentation",
						className: $.menuHeading,
						children: "Tagz"
					}),
					ne && /* @__PURE__ */ p("input", {
						type: "search",
						className: $.menuSearch,
						placeholder: "find a tag",
						"aria-label": "Find a tag",
						value: v,
						onChange: (e) => y(e.target.value),
						"data-menu-search": !0
					}),
					/* @__PURE__ */ p("div", {
						role: "listbox",
						"aria-label": "Tagz, the most cards first",
						className: $.tagRows,
						children: te.map((e) => {
							let t = b === e.id;
							return /* @__PURE__ */ m("button", {
								type: "button",
								role: "option",
								"aria-selected": t,
								title: (0, xu.tagRowTitle)(e),
								className: $.menuItem,
								"data-menu-item": !0,
								"data-tag": e.id,
								onClick: () => Xu("graph:select-tag", { id: e.id }),
								children: [
									/* @__PURE__ */ p("span", {
										className: $.menuCheck,
										"aria-hidden": "true",
										children: t && /* @__PURE__ */ p(il, {
											body: (0, sl.iconBody)("check"),
											size: 14
										})
									}),
									/* @__PURE__ */ p("span", {
										className: $.tagSwatch,
										"aria-hidden": "true",
										style: { background: e.color || "var(--gv-tag-color)" }
									}),
									/* @__PURE__ */ p("span", {
										className: $.tagLabel,
										children: e.label
									}),
									/* @__PURE__ */ p("span", {
										className: $.tagCount,
										children: e.pieces
									})
								]
							}, e.id);
						})
					}),
					!te.length && /* @__PURE__ */ p("div", {
						className: $.menuEmpty,
						children: "none"
					})
				]
			})] }),
			/* @__PURE__ */ p(Pu, {
				className: $.topIcon,
				"data-settings-open": !0
			})
		]
	});
}
//#endregion
//#region src/components/TimeOfDay/TimeOfDay.jsx
function ed() {
	let e = () => typeof document < "u" && document.documentElement.getAttribute("data-pp-mode") || "dark", [t, n] = c(e);
	return r(() => {
		let t = new MutationObserver(() => n(e()));
		return t.observe(document.documentElement, {
			attributes: !0,
			attributeFilter: ["data-pp-mode"]
		}), () => t.disconnect();
	}, []), t;
}
var td = {
	position: "fixed",
	inset: 0,
	zIndex: -1,
	pointerEvents: "none"
};
function nd({ item: e, settings: t, viewState: n }) {
	let i = (0, hc.config)(t), [, a] = c(0);
	r(() => n ? n.subscribe(() => a((e) => e + 1)) : void 0, [n]);
	let o = ed(), l = !n || !n.preference || n.preference("timeOfDay") !== !1, u = i && l ? (0, hc.ambienceFor)(e, i, o) : null, d = u ? `${u.top}|${u.bottom}` : "", [m, h] = c([null, null]), [g, _] = c(0), v = s("");
	if (r(() => {
		if (d === v.current) return;
		v.current = d;
		let e = 1 - g;
		h((t) => {
			let n = t.slice();
			return n[e] = u, n;
		});
		let t = requestAnimationFrame(() => requestAnimationFrame(() => _(e)));
		return () => cancelAnimationFrame(t);
	}, [d]), r(() => {
		let e = document.documentElement;
		u ? (e.setAttribute("data-pp-tod", u.time), u.season ? e.setAttribute("data-pp-season", u.season) : e.removeAttribute("data-pp-season")) : (e.removeAttribute("data-pp-tod"), e.removeAttribute("data-pp-season"));
	}, [d]), !i) return null;
	let y = i.transitionSeconds;
	return /* @__PURE__ */ p(f, { children: m.map((e, t) => /* @__PURE__ */ p("div", {
		"aria-hidden": "true",
		"data-tod-layer": t === g && e ? "front" : "back",
		"data-tod-time": e ? e.time : "",
		style: {
			...td,
			background: e ? `linear-gradient(180deg, ${e.top} 0%, ${e.bottom} 100%)` : "transparent",
			opacity: t === g && e ? 1 : 0,
			transition: `opacity ${y}s ease-in-out`
		}
	}, t)) });
}
//#endregion
//#region src/components/Theme/Theme.jsx
var rd = fu();
function id({ settings: e, viewState: t }) {
	let [, n] = c(0), i = typeof window < "u" && window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null, [a, o] = c(i ? i.matches : !0);
	r(() => t ? t.subscribe(() => n((e) => e + 1)) : void 0, [t]), r(() => {
		if (!i) return;
		let e = (e) => o(e.matches);
		return i.addEventListener ? i.addEventListener("change", e) : i.addListener(e), () => {
			i.removeEventListener ? i.removeEventListener("change", e) : i.removeListener(e);
		};
	}, []);
	let s = (0, _u.themeName)(e, t && t.preference ? t.preference("theme") : null), l = e && e.theme && e.theme.mode, u = (0, _u.themeMode)(s, t && t.preference ? t.preference("mode") : null, a, l), d = (0, rd.openingConfig)(e), f = d && d.ground === "dark" ? "dark" : u;
	return r(() => {
		let e = document.documentElement;
		e.getAttribute("data-pp-theme") !== s && e.setAttribute("data-pp-theme", s), e.getAttribute("data-pp-mode") !== f && e.setAttribute("data-pp-mode", f), e.getAttribute("data-pp-reader-mode") !== u && e.setAttribute("data-pp-reader-mode", u), e.style.colorScheme = f;
	}, [
		s,
		u,
		f
	]), null;
}
var ad = {
	cover: "_cover_1tvum_9",
	ground: "_ground_1tvum_18",
	groundTexture: "_groundTexture_1tvum_28",
	stage: "_stage_1tvum_46",
	art: "_art_1tvum_61",
	image: "_image_1tvum_75",
	roots: "_roots_1tvum_85",
	reach: "_reach_1tvum_100",
	title: "_title_1tvum_130",
	alt: "_alt_1tvum_150",
	byline: "_byline_1tvum_162",
	bylineTitle: "_bylineTitle_1tvum_175",
	band: "_band_1tvum_211",
	section: "_section_1tvum_225",
	handle: "_handle_1tvum_235",
	grip: "_grip_1tvum_232"
}, od = (/* @__PURE__ */ h(((e, t) => {
	var n = (e, t) => {
		let n = RegExp(`\\s${t}="([^"]*)"`).exec(e);
		return n ? n[1] : null;
	};
	function r(e) {
		let t = (e || "").match(/-?\d+(?:\.\d+)?(?:e-?\d+)?/gi) || [], n = [];
		for (let e = 0; e + 1 < t.length; e += 2) n.push([Number(t[e]), Number(t[e + 1])]);
		return n;
	}
	function i(e) {
		if (typeof e != "string" || !/<svg[\s>]/.test(e)) return null;
		let t = /<svg[^>]*>/.exec(e)[0], i = (n(t, "viewBox") || "").split(/[\s,]+/).map(Number), a = i.length === 4 && i[2] > 0 ? i[2] : Number(n(t, "width")) || 0, o = i.length === 4 && i[3] > 0 ? i[3] : Number(n(t, "height")) || 0, s = /* @__PURE__ */ new Map();
		for (let t of e.matchAll(/<path\b[^>]*>/g)) {
			let e = t[0], i = n(e, "data-e");
			if (i === null) continue;
			let a = s.get(i);
			a || (a = {
				e: Number(i),
				a: Number(n(e, "data-a")),
				b: Number(n(e, "data-b")),
				tip: n(e, "data-tip"),
				loop: n(e, "data-loop") !== null,
				free: n(e, "data-free") !== null,
				parts: []
			}, s.set(i, a)), a.parts.push({
				i: Number(n(e, "data-part")) || 0,
				pts: r(n(e, "d")),
				width: Number(n(e, "stroke-width")) || 1,
				stroke: n(e, "stroke") || ""
			});
		}
		let c = [...s.values()];
		for (let e of c) e.parts.sort((e, t) => e.i - t.i);
		let l = /* @__PURE__ */ new Map();
		for (let t of e.matchAll(/<circle\b[^>]*>/g)) {
			let e = n(t[0], "data-tip");
			e && l.set(e, {
				x: Number(n(t[0], "cx")),
				y: Number(n(t[0], "cy")),
				node: Number(n(t[0], "data-node"))
			});
		}
		return !a || !o || !c.length ? null : {
			w: a,
			h: o,
			edges: c,
			tips: l
		};
	}
	var a = (e) => e.reduce((t, n, r) => r ? t + Math.hypot(n[0] - e[r - 1][0], n[1] - e[r - 1][1]) : 0, 0);
	function o(e) {
		if (!e) return null;
		let t = /* @__PURE__ */ new Map();
		for (let n of e.edges) n.length = n.parts.reduce((e, t) => e + a(t.pts), 0), !n.loop && !n.free && !t.has(n.b) && t.set(n.b, n);
		let n = /* @__PURE__ */ new Map();
		for (let t of e.edges) t.loop || t.free || (n.has(t.a) || n.set(t.a, []), n.get(t.a).push(t));
		let r = [], i = [0], o = new Set([0]);
		for (; i.length;) {
			let e = i.shift();
			for (let t of n.get(e) || []) r.push(t), o.has(t.b) || (o.add(t.b), i.push(t.b));
		}
		let s = (e) => {
			let n = [], r = e;
			for (let e = 0; e < 1e5 && r !== 0; e++) {
				let e = t.get(r);
				if (!e) return null;
				n.push(e), r = e.a;
			}
			return r === 0 ? n.reverse() : null;
		}, c = /* @__PURE__ */ new Map();
		for (let [t, n] of e.tips) {
			let r = s(Number.isFinite(n.node) ? n.node : (e.edges.find((e) => e.tip === t) || {}).b);
			r && r.length && c.set(t, r);
		}
		return {
			...e,
			order: r,
			chains: c
		};
	}
	function s(e, t) {
		let n = null, r = Infinity;
		for (let [i, a] of e.tips) {
			if (!e.chains.has(i)) continue;
			let o = Math.hypot(a.x - t.x, a.y - t.y);
			o < r && (r = o, n = i);
		}
		return n;
	}
	function c(e, t) {
		let n = /* @__PURE__ */ new Map();
		if (!e) return n;
		for (let r of t || []) {
			let t = Array.isArray(r.rootTips) ? r.rootTips.filter((t) => e.chains.has(t)) : [];
			if (t.length) {
				n.set(r.id, t);
				continue;
			}
			if (!r.anchor) continue;
			let i = s(e, {
				x: r.anchor.x * e.w,
				y: r.anchor.y * e.h
			});
			i && n.set(r.id, [i]);
		}
		return n;
	}
	var l = (e) => {
		let t = Math.max(0, Math.min(1, (e - 2 / 3) * 3));
		return t * t * (3 - 2 * t);
	};
	function u(e, t, n) {
		let r = /* @__PURE__ */ new Map();
		if (!e) return r;
		let i = new Map(e.edges.map((e) => [e.e, e.parts.map((e) => e.pts.map(() => [0, 0]))])), a = !1;
		for (let [r, o] of t) {
			let t = n && n.get(r);
			if (!t || Math.abs(t.dx) < .01 && Math.abs(t.dy) < .01) continue;
			a = !0;
			let s = /* @__PURE__ */ new Map(), c = new Map([[0, 0]]);
			for (let t of o) {
				let n = e.chains.get(t);
				if (!n) continue;
				let r = n.reduce((e, t) => e + t.length, 0) || 1, i = 0;
				for (let e of n) {
					let t = s.get(e.e) || e.parts.map((e) => e.pts.map(() => 0));
					e.parts.forEach((e, n) => {
						e.pts.forEach((a, o) => {
							o > 0 && (i += Math.hypot(a[0] - e.pts[o - 1][0], a[1] - e.pts[o - 1][1])), t[n][o] = Math.max(t[n][o], l(i / r));
						});
					}), s.set(e.e, t), c.set(e.b, Math.max(c.get(e.b) || 0, l(i / r)));
				}
			}
			let u = new Map([[0, 0]]);
			for (let n of e.order) {
				let e = s.get(n.e), r = i.get(n.e);
				if (e) e.forEach((e, n) => e.forEach((e, i) => {
					r[n][i][0] += e * t.dx, r[n][i][1] += e * t.dy;
				})), u.set(n.b, c.get(n.b) || 0);
				else {
					let e = u.get(n.a) || 0;
					e && r.forEach((n) => n.forEach((n) => {
						n[0] += e * t.dx, n[1] += e * t.dy;
					})), u.has(n.b) || u.set(n.b, e);
				}
			}
			for (let n of e.edges) {
				if (!n.loop) continue;
				let e = u.get(n.a) || 0, r = u.get(n.b) || 0;
				if (!e && !r) continue;
				let a = n.length || 1, o = 0, s = i.get(n.e);
				n.parts.forEach((n, i) => n.pts.forEach((c, l) => {
					l > 0 && (o += Math.hypot(c[0] - n.pts[l - 1][0], c[1] - n.pts[l - 1][1]));
					let u = e + (r - e) * (o / a);
					s[i][l][0] += u * t.dx, s[i][l][1] += u * t.dy;
				}));
			}
		}
		for (let t of e.edges) {
			let e = i.get(t.e), n = !a || e.every((e) => e.every((e) => e[0] === 0 && e[1] === 0));
			r.set(t.e, n ? t.parts.map((e) => e.pts) : t.parts.map((t, n) => t.pts.map((t, r) => [t[0] + e[n][r][0], t[1] + e[n][r][1]])));
		}
		return r;
	}
	var d = (e) => e.length ? "M" + e.map(([e, t]) => `${Math.round(e * 10) / 10},${Math.round(t * 10) / 10}`).join("L") : "";
	function f(e) {
		let t = e > 0 ? 2 / e : 0, n = /* @__PURE__ */ new Map(), r = null, i = !0, a = .1;
		function o(e, o) {
			let s = r === null ? 0 : Math.max(0, Math.min(250, o - r));
			r = o;
			let c = /* @__PURE__ */ new Map();
			i = !0;
			let l = new Set([...n.keys(), ...e ? e.keys() : []]);
			for (let r of l) {
				let o = e && e.get(r) || {
					dx: 0,
					dy: 0
				}, l = n.get(r);
				if (!l || !t) l = {
					x: o.dx,
					y: o.dy,
					vx: 0,
					vy: 0
				};
				else if (s > 0) {
					let e = Math.exp(-t * s), n = (n, r, i) => {
						let a = n - i, o = r + t * a;
						return [i + (a + o * s) * e, (r - t * o * s) * e];
					};
					[l.x, l.vx] = n(l.x, l.vx, o.dx), [l.y, l.vy] = n(l.y, l.vy, o.dy), Math.abs(l.x - o.dx) < a && Math.abs(l.y - o.dy) < a && Math.abs(l.vx) < a / 16 && Math.abs(l.vy) < a / 16 && (l = {
						x: o.dx,
						y: o.dy,
						vx: 0,
						vy: 0
					});
				}
				if ((l.x !== o.dx || l.y !== o.dy) && (i = !1), !(e && e.has(r)) && l.x === 0 && l.y === 0) {
					n.delete(r);
					continue;
				}
				n.set(r, l), c.set(r, {
					dx: l.x,
					dy: l.y
				});
			}
			return c;
		}
		return {
			step: o,
			settled: () => i,
			reset() {
				n.clear(), r = null, i = !0;
			}
		};
	}
	t.exports = {
		parseRoots: i,
		rootsModel: o,
		actRoots: c,
		nearestTip: s,
		bentRoots: u,
		pathD: d,
		easeRoot: l,
		createFollow: f
	};
})))(), sd = () => typeof window < "u" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function cd(e) {
	return new Promise((t) => {
		if (!e) {
			t(null);
			return;
		}
		let n = new Image();
		n.onload = () => t(n.naturalWidth > 0 ? {
			w: n.naturalWidth,
			h: n.naturalHeight
		} : null), n.onerror = () => t(null), n.src = e;
	});
}
function ld(e, t) {
	return new Promise((n) => {
		if (!e) {
			n(null);
			return;
		}
		let r = new Image();
		r.onload = () => {
			try {
				let e = Math.min(2048, r.naturalWidth), i = Math.max(1, Math.round(r.naturalHeight * e / r.naturalWidth)), a = document.createElement("canvas");
				a.width = e, a.height = i;
				let o = a.getContext("2d");
				o.drawImage(r, 0, 0, e, i);
				let s = o.getImageData(0, 0, e, i).data, c = t ?? 1;
				n({
					top: (0, rd.firstInkRow)(s, e, i),
					bottom: (0, rd.lastInkRow)(s, e, i),
					above: (0, rd.inkSpan)(s, e, i, 0, c),
					below: c < 1 ? (0, rd.widestInkRow)(s, e, i, c, 1) : null
				});
			} catch {
				n(null);
			}
		}, r.onerror = () => n(null), r.src = e;
	});
}
function ud(e) {
	if (typeof document > "u") return 0;
	let t = 0;
	for (let n of document.querySelectorAll("[data-feeds] > *, [data-top-pages], [data-settings-gear]")) {
		let r = n.getBoundingClientRect();
		!r.width || !r.height || r.top > e * .2 || (t = Math.max(t, r.bottom));
	}
	return t;
}
function dd(e) {
	if (typeof document > "u") return 0;
	let t = 0;
	for (let n of document.querySelectorAll("[data-feeds] > *:not([data-graph-intro]), [data-settings-gear]")) {
		let r = n.getBoundingClientRect();
		!r.width || !r.height || r.top > e * .2 || getComputedStyle(n).position === "fixed" && !n.matches("[data-settings-gear]") || (t = Math.max(t, r.bottom));
	}
	return t;
}
var fd = new Set([
	"radio",
	"slider",
	"listbox",
	"option",
	"menu",
	"menuitem",
	"menuitemcheckbox",
	"menuitemradio",
	"tab",
	"spinbutton",
	"textbox",
	"combobox"
]);
function pd(e) {
	let t = e.target;
	return !!(t && t.nodeType === 1 && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || fd.has(t.getAttribute("role")) || t.closest("[data-reader-panel], [role=\"dialog\"], [role=\"menu\"], [data-settings-panel]") || (e.key === " " || e.key === "Spacebar") && t.closest("button, a[href], summary, [role=\"button\"]")) || typeof window < "u" && window.location.hash.startsWith("#read=") || typeof document < "u" && document.querySelector("[data-settings-panel]"));
}
function md(e) {
	let t = typeof document < "u" && document.querySelector("[data-rights]");
	if (!t || t.getAttribute("data-rights-position") === "bottom-edge") return 0;
	let n = t.getBoundingClientRect();
	return n.height > 0 ? Math.max(0, e - n.top + 8) : 0;
}
var hd = 8, gd = "http://www.w3.org/2000/svg";
function _d(e, t, { reduced: n, seed: r, skip: i = () => null }) {
	let a = /* @__PURE__ */ new Map(), o = n ? 0 : e.lagMs;
	function s(e, n, i) {
		let a = document.createElementNS(gd, "g");
		a.setAttribute("data-reach", e), a.setAttribute("data-reach-container", n), a.setAttribute("data-reach-tip", String(i));
		let s = document.createElementNS(gd, "path");
		s.setAttribute("class", "reach-main");
		let c = document.createElementNS(gd, "path");
		return c.setAttribute("class", "reach-fine"), a.append(s, c), a.style.visibility = "hidden", t.appendChild(a), {
			key: e,
			g: a,
			main: s,
			fine: c,
			shape: (0, mc.reachShape)(`${r}|${e}`),
			lag: (0, mc.createLag)(o),
			state: "new",
			timer: null
		};
	}
	function c(t) {
		if (t.state = "drawn", t.g.style.visibility = "", n || !e.drawMs) {
			t.g.setAttribute("data-drawn", "drawn");
			return;
		}
		t.g.setAttribute("data-drawn", "drawing");
		for (let e of [t.main, t.fine]) e.setAttribute("pathLength", "1"), e.style.transition = "none", e.style.strokeDasharray = "1 1", e.style.strokeDashoffset = "1";
		t.main.getBoundingClientRect();
		for (let n of [t.main, t.fine]) n.style.transition = `stroke-dashoffset ${e.drawMs}ms cubic-bezier(0.25, 0.6, 0.35, 1)`, n.style.strokeDashoffset = "0";
		t.timer = setTimeout(() => {
			t.timer = null;
			for (let e of [t.main, t.fine]) e.removeAttribute("pathLength"), e.style.transition = "", e.style.strokeDasharray = "", e.style.strokeDashoffset = "";
			t.g.setAttribute("data-drawn", "drawn");
		}, e.drawMs + 60);
	}
	function l(e) {
		e.timer && clearTimeout(e.timer), e.g.remove();
	}
	function u(n, { box: r, opacity: o, settledCover: u, world: d }) {
		if (t.style.opacity = String(o), !d || !r) return !1;
		let f = e.tips.map((e) => (0, mc.artPoint)(e, r)), p = /* @__PURE__ */ new Set(), m = !1, h = i();
		for (let t of d.containers) if (!(h && h.has(t.id))) for (let r of (0, mc.reachFor)(f, t, e.perContainer, e.stopShort)) {
			let e = r.tip, i = `${t.id}|${e}`;
			p.add(i);
			let l = a.get(i);
			l || (l = s(i, t.id, e), a.set(i, l)), l.state === "new" || !u ? l.lag.jump(r.end) : l.lag.to(r.end, n);
			let d = l.lag.at(n);
			l.lag.settled(n) || (m = !0);
			let h = (0, mc.reachPath)(f[e], d, l.shape);
			l.main.setAttribute("d", h.main), l.fine.setAttribute("d", h.fine), l.g.setAttribute("data-target", `${r.end.x.toFixed(1)},${r.end.y.toFixed(1)}`), l.g.setAttribute("data-hit", `${r.hit.x.toFixed(1)},${r.hit.y.toFixed(1)}`), l.state === "new" && o > .05 && c(l);
		}
		for (let [e, t] of a) p.has(e) || (l(t), a.delete(e));
		return m;
	}
	return {
		draw: u,
		dispose() {
			for (let e of a.values()) l(e);
			a.clear();
		}
	};
}
function vd(e, t, n) {
	let r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
	for (let [e, r] of n) for (let n of r) for (let r of t.chains.get(n) || []) r.tip === n && i.set(r.e, e);
	let a = document.createDocumentFragment();
	for (let e of t.edges) {
		let t = e.parts.map((t, n) => {
			let r = document.createElementNS(gd, "path");
			return r.setAttribute("d", (0, od.pathD)(t.pts)), r.setAttribute("stroke", t.stroke || "#e4e1db"), r.setAttribute("stroke-width", String(t.width)), r.setAttribute("data-e", String(e.e)), r.setAttribute("data-part", String(n)), e.tip && r.setAttribute("data-tip", e.tip), i.has(e.e) && r.setAttribute("data-act-root", i.get(e.e)), a.appendChild(r), r;
		});
		r.set(e.e, t);
	}
	e.setAttribute("viewBox", `0 0 ${t.w} ${t.h}`), e.appendChild(a);
	let o = "";
	return {
		bend(e) {
			let i = [...e].map(([e, t]) => `${e}:${t.dx.toFixed(1)},${t.dy.toFixed(1)}`).join("|");
			if (i === o) return;
			o = i;
			let a = (0, od.bentRoots)(t, n, e);
			for (let [e, t] of a) {
				let n = r.get(e);
				n && t.forEach((e, t) => {
					n[t] && n[t].setAttribute("d", (0, od.pathD)(e));
				});
			}
		},
		dispose() {
			for (let e of r.values()) for (let t of e) t.remove();
			r.clear();
		}
	};
}
function yd({ layout: e, size: t, which: n, opacity: r }) {
	let i = (0, rd.titleLayout)(e, {
		left: 0,
		top: 0,
		width: t.w,
		height: t.h
	}).lines;
	return i.length ? /* @__PURE__ */ p("g", {
		"data-cover-title": n,
		style: { opacity: r },
		children: i.map((e, t) => {
			let n = 0;
			return /* @__PURE__ */ p("text", {
				x: e.x,
				y: e.y,
				"data-cover-title-line": t,
				xmlSpace: "preserve",
				children: e.spans.map((e, t) => {
					let r = n - e.rise;
					return n = e.rise, /* @__PURE__ */ p("tspan", {
						fontSize: e.size,
						dy: r || void 0,
						"data-cover-title-span": t,
						children: e.text
					}, t);
				})
			}, t);
		})
	}) : null;
}
function bd(e, t) {
	if (!(e > 0)) return;
	let n = Math.max(0, e * 100 - 1.5), r = Math.min(100, e * 100 + 1.5), i = t === "above" ? `linear-gradient(to bottom, #000 0%, #000 ${n}%, transparent ${r}%)` : `linear-gradient(to bottom, transparent 0%, transparent ${n}%, #000 ${r}%)`;
	return {
		WebkitMaskImage: i,
		maskImage: i,
		WebkitMaskSize: "100% 100%",
		maskSize: "100% 100%",
		WebkitMaskRepeat: "no-repeat",
		maskRepeat: "no-repeat"
	};
}
function xd(e) {
	if (!e) return;
	let t = e.bottom || "var(--sk-paper, var(--bg, #2a2a2e))";
	return {
		backgroundColor: e.top,
		backgroundImage: `linear-gradient(to bottom, ${e.top} 0%, ${e.top} ${(e.colorFrom * 100).toFixed(1)}%, ${t} 100%)`
	};
}
function Sd(e) {
	let t = `linear-gradient(to bottom, transparent 0%, transparent ${(e * 100).toFixed(1)}%, #000 100%)`;
	return {
		WebkitMaskImage: t,
		maskImage: t
	};
}
function Cd({ title: e, size: t, start: n, refs: r }) {
	return !e || !t ? null : /* @__PURE__ */ m("svg", {
		className: ad.title,
		viewBox: `0 0 ${t.w} ${t.h}`,
		preserveAspectRatio: "none",
		role: "heading",
		"aria-level": "1",
		"aria-label": e.text,
		"data-cover-title-svg": !0,
		style: {
			fontFamily: e.family,
			fill: e.color || "var(--pp-accent, var(--accent))",
			fillOpacity: e.opacity
		},
		children: [/* @__PURE__ */ p("g", {
			ref: r.art,
			children: /* @__PURE__ */ p(yd, {
				layout: e.art,
				size: t,
				which: "art",
				opacity: +(n === "art")
			})
		}), /* @__PURE__ */ p("g", {
			ref: r.graph,
			children: /* @__PURE__ */ p(yd, {
				layout: e.graph,
				size: t,
				which: "graph",
				opacity: n === "art" ? 0 : 1
			})
		})]
	});
}
function wd({ config: e, viewState: t, children: n }) {
	let o = s(null), l = s(null), u = s(null), d = s(null), h = s(null), g = s(null), _ = s(null), v = s(null), y = s(null), b = s(null), x = s(null), S = s(null), C = s(null), w = s(null), T = s(0), E = s(null), D = s(null), O = s(null), k = s(null), A = s(null), j = s(null), M = s(null), N = s(null), P = s(null), F = s(() => !1), [I, L] = c(null), ee = s(null), te = s(0), ne = a(sd, []), re = a(() => (0, rd.startState)(e, {
		stored: t && t.openingState ? t.openingState() : null,
		hash: typeof window < "u" ? window.location.hash : ""
	}), [e, t]), ie = !!(e.graph && e.graph.hiddenUntilMove) && re === "art", ae = s({ at: null }), R = () => (0, rd.revealFactor)(ie, ae.current.at, performance.now()), oe = () => {
		if (!ie || ae.current.at !== null) return;
		ae.current.at = performance.now(), document.documentElement.setAttribute("data-pp-cover-acts", "shown");
		let e = () => {
			N.current && !se.current && V.current(N.current.p), R() < 1 && requestAnimationFrame(e);
		};
		requestAnimationFrame(e);
	}, se = s(!1), z = s(oe);
	z.current = oe, r(() => {
		let t = !0, n = e.top || e.fit === "width" || e.graph.rootsFit === "width" ? Promise.all([ld(e.art.artState, e.crownY), ld(e.art.graphState || e.art.artState, e.crownY)]) : Promise.resolve([null, null]);
		return Promise.all([cd(e.art.artState), n]).then(([e, [n, r]]) => {
			t && (ee.current = {
				art: n ? n.top : null,
				graph: r ? r.top : null,
				bottom: r ? r.bottom : null,
				bush: n && n.above,
				roots: r && r.below
			}, L(e || {
				w: 1,
				h: 2
			}));
		}), () => {
			t = !1;
		};
	}, [e]);
	let [ce, le] = c(e.title), ue = s(e.title);
	ue.current = ce;
	let de = s(null), fe = (t) => {
		let n = window.innerWidth, r = window.innerHeight;
		return (0, rd.coverGeometry)(ue.current === e.title ? e : {
			...e,
			title: ue.current
		}, {
			vw: n,
			vh: r,
			art: P.current || {
				w: 1,
				h: 2
			},
			bottom: md(r),
			zoom: C.current,
			controls: te.current,
			ink: ee.current,
			perPx: de.current
		}, t);
	}, pe = () => {
		E.current = null;
		let t = window.PostPipeGraphWorld ? window.PostPipeGraphWorld.snapshot() : null;
		t && t.k > 0 && t.homeK > 0 && (C.current = {
			k: t.k,
			homeK: t.homeK
		});
		let n = N.current;
		if (!n) return;
		let r = fe(n.p);
		w.current = r, B(r);
		let i = x.current;
		if (i && t && t.homeK > 0 && P.current) {
			let n = fe(1), r = P.current.w / Math.max(1, n.art.width), a = /* @__PURE__ */ new Map();
			for (let e of t.containers) e.drift && i.acts.has(e.id) && a.set(e.id, {
				dx: e.drift.x * t.homeK * r,
				dy: e.drift.y * t.homeK * r
			});
			S.current ||= (0, od.createFollow)(ne ? 0 : e.art.rootsFollowMs);
			let o = S.current;
			i.draw.bend(o.step(a, performance.now())), (!o.settled() || t.moving) && me();
		}
		let a = y.current;
		if (!a || !P.current) return;
		if (xe.current) {
			v.current && (v.current.style.opacity = "0");
			return;
		}
		let o = C.current ? (0, mc.backdropOpacity)(e.backdrop, C.current.k, C.current.homeK) : e.backdrop.opacity;
		a.draw(performance.now(), {
			box: r.art,
			world: t,
			opacity: r.layer.opacity * o * R(),
			settledCover: n.p >= 1 && !n.moving
		}) && me();
	}, me = () => {
		E.current ||= requestAnimationFrame(() => he.current());
	}, he = s(pe);
	he.current = pe;
	let B = (t) => {
		let n = g.current, r = (0, rd.rootsBrightnessAt)(e, t.p), i = r === 1 ? "" : `brightness(${r.toFixed(3)})`;
		b.current && b.current.style.filter !== i && (b.current.style.filter = i), n && n.style.filter !== i && (n.style.filter = i), x.current && b.current ? (b.current.style.opacity = String(t.fade.graph * t.roots), n && (n.style.opacity = "0")) : n ? n.style.opacity = String(t.fade.graph * t.roots) : h.current && (h.current.style.opacity = String(t.roots)), _.current && (_.current.style.opacity = String(t.fade.graph));
	}, ge = () => {
		let t = dd(window.innerHeight), n = M.current;
		n && (n.style.height = `calc(env(safe-area-inset-top, 0px) + ${Math.ceil(t + 8)}px)`);
		let r = j.current;
		if (!r) return;
		let i = `calc(env(safe-area-inset-top, 0px) + ${(0, rd.gripHeight)(t, e.grip)}px)`;
		if (e.returnAbove === "crown" && P.current) {
			let t = fe(1), n = t.art.top + e.crownY * t.art.height;
			r.style.height = `max(${i}, ${Math.max(0, Math.round(n))}px)`, r.setAttribute("data-cover-handle-to", "crown");
		} else r.style.height = i;
	}, _e = s(ge);
	_e.current = ge;
	let ve = () => {
		let e = M.current, t = e ? e.getBoundingClientRect().bottom : 0;
		return Math.max(ud(window.innerHeight), t);
	}, ye = () => {
		if (!P.current) return;
		ge();
		let t = fe(1);
		window.PostPipeCoverFrame = {
			art: {
				left: t.art.left,
				top: t.art.top,
				width: t.art.width,
				height: t.art.height
			},
			natural: { ...P.current },
			crownY: e.crownY,
			zoomPivot: e.zoomPivot
		}, window.dispatchEvent(new CustomEvent("postpipe:cover-frame"));
	}, be = s(ye);
	be.current = ye;
	let xe = s(!1), Se = (e, t, n) => {
		let r = t === "art" && n.layer.opacity === 0 && !!window.PostPipeGraphWorld;
		xe.current = r;
		for (let t of e.children) t.style.display = r ? "none" : "";
	}, Ce = (t) => {
		let n = fe(t), r = N.current, i = r && r.moving ? "moving" : t >= 1 ? "graph" : t <= 0 ? "art" : "moving", a = document.documentElement;
		a.style.setProperty("--pp-cover-p", String(n.p)), a.setAttribute("data-pp-cover", i), e.topBarInArt || a.setAttribute("data-pp-cover-bar", i === "graph" ? "shown" : "hidden");
		let o = d.current;
		o && (o.style.width = `${n.art.width}px`, o.style.height = `${n.art.height}px`, o.style.transform = `translate3d(${n.art.left}px, ${n.art.top}px, 0)`, o.style.opacity = P.current ? String(n.art.opacity) : "0"), w.current = n, g.current && h.current && (h.current.style.opacity = String(n.fade.art)), B(n);
		let s = D.current && D.current.firstChild, c = O.current && O.current.firstChild;
		s && (s.style.opacity = String(n.fade.art)), c && (c.style.opacity = String(n.fade.graph)), l.current && (l.current.style.opacity = String(n.ground));
		let f = k.current;
		if (f) {
			f.style.left = `${n.byline.x}px`, f.style.top = `${n.byline.y}px`, f.style.fontSize = `${n.byline.size}px`, f.style.opacity = P.current ? String(n.byline.opacity) : "0", f.setAttribute("data-cover-byline", n.byline.under);
			let e = n.byline.under === "title" ? i !== "moving" : n.byline.opacity > .5;
			f.style.pointerEvents = e ? "auto" : "none", f.tabIndex = n.byline.under === "title" ? e ? 0 : -1 : i === "art" ? 0 : -1;
		}
		let p = u.current;
		p && (p.setAttribute("data-cover-state", i), p.tabIndex = i === "art" ? 0 : -1);
		let m = A.current;
		if (m) {
			let e = i === "graph";
			T.current = e ? 0 : n.layer.follow, m.style.pointerEvents = e ? "" : "none";
			for (let t of m.children) {
				if (t.matches("[data-feeds], [data-top-bar], [data-top-band], [data-cover-handle]")) continue;
				let r = t.matches("[data-graph-root]");
				r && Se(t, i, n);
				let a = r ? R() : 1;
				t.style.opacity = e && a >= 1 ? "" : String(e ? a : r ? n.layer.opacity * a : n.graph.opacity), t.style.transform = e ? "" : r ? `translate3d(0, ${n.layer.follow}px, 0)` : `translate3d(0, ${n.graph.shift}px, 0)`, t.inert = i === "art", i === "art" ? t.setAttribute("aria-hidden", "true") : t.removeAttribute("aria-hidden");
			}
			for (let t of m.querySelectorAll("[data-top-graph-controls]")) t.inert = !e;
		}
		let _ = j.current;
		_ && (_.style.opacity = String(n.graph.opacity), _.style.pointerEvents = i === "graph" ? "auto" : "none", _.tabIndex = i === "graph" ? 0 : -1), me();
	}, V = s(Ce);
	V.current = Ce, r(() => {
		if (!e.title || !e.title.hideGraphTitle) return;
		let t = document.documentElement;
		return t.setAttribute("data-pp-cover-title", ""), () => t.removeAttribute("data-pp-cover-title");
	}, [e]), r(() => {
		if (!e.sky) return;
		let t = document.documentElement;
		return t.setAttribute("data-pp-cover-sky", ""), t.style.setProperty("--pp-sky-from", `${(e.sky.textureFrom * 100).toFixed(1)}%`), () => {
			t.removeAttribute("data-pp-cover-sky"), t.style.removeProperty("--pp-sky-from");
		};
	}, [e]), i(() => {
		if (!I) return;
		P.current = I, ge(), te.current = e.top ? ve() : 0;
		let t = N.current;
		t && (t.resize(fe(0).travel), V.current(t.p)), be.current();
		let n = !0;
		return e.top && document.fonts && document.fonts.ready && document.fonts.ready.then(() => {
			ge();
			let e = ve();
			if (!n || Math.abs(e - te.current) < .5) return;
			te.current = e;
			let t = N.current;
			t && (t.resize(fe(0).travel), V.current(t.p)), be.current();
		}), () => {
			n = !1;
		};
	}, [I]), r(() => {
		if (!I || !e.title || e.title.fit !== "width") return;
		let t = !0, n = (e) => e.current ? [...e.current.querySelectorAll("[data-cover-title-line]")].map((e) => {
			try {
				return e.getComputedTextLength();
			} catch {
				return 0;
			}
		}) : [], r = () => {
			if (!t) return;
			le((e) => (0, rd.fitTitle)(e, {
				art: n(D),
				graph: n(O)
			}, I.w));
			let e = k.current;
			if (e) {
				let t = document.createElement("span"), n = getComputedStyle(e);
				t.textContent = e.textContent, Object.assign(t.style, {
					position: "absolute",
					left: "-10000px",
					top: "0",
					visibility: "hidden",
					whiteSpace: "nowrap",
					fontFamily: n.fontFamily,
					fontWeight: n.fontWeight,
					letterSpacing: n.letterSpacing,
					fontSize: "100px"
				}), document.body.appendChild(t);
				let r = t.getBoundingClientRect().width;
				t.remove(), r > 0 && (de.current = r / 100);
			}
		};
		return (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(r)), () => {
			t = !1;
		};
	}, [I, e]), i(() => {
		if (ce === e.title) return;
		let t = N.current;
		t && V.current(t.p), be.current();
	}, [ce]), r(() => {
		let t = e.art.rootsVector;
		if (!t || !I || typeof fetch > "u") return;
		let n = !0, r = null;
		return fetch(t).then((e) => e.ok ? e.text() : "").then((t) => {
			let i = b.current, a = (0, od.rootsModel)((0, od.parseRoots)(t));
			if (!n || !i || !a) return;
			let o = (0, od.actRoots)(a, e.acts);
			r = vd(i, a, o), x.current = {
				draw: r,
				acts: new Set(o.keys())
			}, i.setAttribute("data-roots-vector", "ready");
			let s = N.current;
			s && V.current(s.p);
		}).catch(() => {}), () => {
			n = !1, r && r.dispose(), x.current = null;
		};
	}, [e, I]), r(() => {
		e.reach && v.current && (y.current = _d(e.reach, v.current, {
			reduced: ne,
			seed: e.art.graphState || e.art.artState,
			skip: () => x.current ? x.current.acts : null
		}));
		let t = () => {
			let e = N.current;
			e && !e.moving && e.p === 0 && !xe.current && V.current(e.p), me();
		};
		return window.addEventListener("graph:world", t), me(), () => {
			window.removeEventListener("graph:world", t), E.current && cancelAnimationFrame(E.current), E.current = null, y.current && y.current.dispose(), y.current = null, window.PostPipeCoverFrame && delete window.PostPipeCoverFrame;
		};
	}, [e, ne]), i(() => {
		let n = null, r = (0, rd.createCover)(e, {
			start: re,
			reducedMotion: ne,
			travel: fe(0).travel,
			frame: (e) => requestAnimationFrame(e),
			cancelFrame: (e) => cancelAnimationFrame(e),
			onChange(e, t) {
				if ((e > 0 || t && t.swap) && z.current(), t && t.swap) {
					let r = Math.round((t.ms || rd.TUNING.reducedFadeMs) / 2);
					se.current = !0;
					let i = [o.current, A.current].filter(Boolean);
					for (let e of i) e.style.transition = `opacity ${r}ms linear`, e.style.opacity = "0";
					n && clearTimeout(n);
					let a = Date.now(), s = () => {
						let t = o.current;
						if ((t ? Number(getComputedStyle(t).opacity) : 0) > .02 && Date.now() - a < r * 4) {
							n = setTimeout(s, 16);
							return;
						}
						se.current = !1, V.current(e);
						for (let e of i) e.style.opacity = "1";
						n = setTimeout(() => {
							for (let e of i) e.style.transition = "";
							A.current && (A.current.style.opacity = ""), n = null;
						}, r + 20);
					};
					n = setTimeout(s, r);
					return;
				}
				V.current(e);
			},
			onRest(e) {
				n || V.current(r.p), t && t.setOpeningState && (t.setOpeningState(e), t.flush && t.flush()), window.dispatchEvent(new CustomEvent("postpipe:cover", { detail: { state: e } }));
			}
		});
		N.current = r, V.current(r.p), t && t.setOpeningState && t.setOpeningState(r.rest), window.PostPipeCover = {
			get state() {
				return r.moving ? "moving" : r.rest;
			},
			get p() {
				return r.p;
			},
			get shift() {
				return T.current;
			},
			get acts() {
				return R();
			},
			go: (e, t) => r.go(e, t)
		};
		let i = () => _e.current();
		i();
		let a = requestAnimationFrame(i);
		document.fonts && document.fonts.ready && document.fonts.ready.then(i);
		let s = () => {
			i(), e.top && (te.current = ve()), r.resize(fe(0).travel), V.current(r.p), be.current();
		};
		window.addEventListener("resize", s);
		let c = A.current, l = u.current, d = j.current, f = (e) => {
			let t = e.target;
			return !t || !t.closest ? null : d && d.contains(t) ? "edge" : l && l.contains(t) ? "stage" : k.current && k.current.contains(t) ? r.p < 1 || r.moving ? "stage" : "graph" : !c || !c.contains(t) ? null : r.moving || r.p < 1 ? "stage" : e.clientY <= p() ? "edge" : "graph";
		}, p = () => {
			if (e.returnAbove !== "crown" || !P.current) return rd.TUNING.edgePx;
			let t = fe(1);
			return Math.max(rd.TUNING.edgePx, t.art.top + e.crownY * t.art.height);
		}, m = (e) => {
			if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
			let t = f(e);
			t && (e.ctrlKey && t !== "stage" || r.wheel(e.deltaY, {
				deltaMode: e.deltaMode,
				where: t
			}) && (e.preventDefault(), e.stopPropagation()));
		};
		window.addEventListener("wheel", m, {
			capture: !0,
			passive: !1
		});
		let h = (e) => !!(e && e.closest && e.closest("[data-feeds], [data-top-bar]") && e.closest("button, a, input, select, [role=\"button\"], [role=\"menu\"], [role=\"menuitem\"], [role=\"menuitemcheckbox\"]")), g = (e) => {
			e.deltaY > 0 && z.current();
		}, _ = () => z.current(), v = (e) => {
			h(e.target) || z.current();
		};
		ie && (window.addEventListener("wheel", g, {
			capture: !0,
			passive: !0
		}), window.addEventListener("touchmove", _, {
			capture: !0,
			passive: !0
		}), window.addEventListener("pointerdown", v, {
			capture: !0,
			passive: !0
		}), document.documentElement.setAttribute("data-pp-cover-acts", "hidden"));
		let y = (e) => {
			let t = (0, rd.pageKey)(e);
			!t || e.defaultPrevented || pd(e) || r.key(t) && e.preventDefault();
		};
		window.addEventListener("keydown", y);
		let b = () => {
			window.location.hash.startsWith("#read=") && r.go("graph");
		};
		window.addEventListener("hashchange", b);
		let x = null, S = 0;
		F.current = () => Date.now() - S < 500;
		let C = (e) => {
			e.touches.length === 1 && (e.target.closest && e.target.closest("[data-cover-byline]") || (x = {
				y: e.touches[0].clientY,
				moved: 0
			}, r.touchStart(e.touches[0].clientY, e.timeStamp || Date.now())));
		}, w = (e) => {
			x && (e.preventDefault(), x.moved = Math.max(x.moved, Math.abs(e.touches[0].clientY - x.y)), r.touchMove(e.touches[0].clientY, e.timeStamp || Date.now()));
		}, E = (e) => {
			x && (x.moved >= hd && (S = Date.now()), x = null, r.touchEnd(e.timeStamp || Date.now()));
		}, D = null, O = (e) => {
			if (!(e.pointerType !== "mouse" || e.button !== 0)) {
				D = {
					y: e.clientY,
					moved: 0
				};
				try {
					d.setPointerCapture(e.pointerId);
				} catch {}
				r.touchStart(e.clientY, e.timeStamp || Date.now());
			}
		}, M = (e) => {
			D && (D.moved = Math.max(D.moved, Math.abs(e.clientY - D.y)), D.moved >= hd && r.touchMove(e.clientY, e.timeStamp || Date.now()));
		}, I = (e) => {
			D && (D.moved >= hd && (S = Date.now()), D = null, r.touchEnd(e.timeStamp || Date.now()));
		};
		d && (d.addEventListener("pointerdown", O), d.addEventListener("pointermove", M), d.addEventListener("pointerup", I), d.addEventListener("pointercancel", I));
		let L = [l, d].filter(Boolean);
		for (let e of L) e.addEventListener("touchstart", C, { passive: !0 }), e.addEventListener("touchmove", w, { passive: !1 }), e.addEventListener("touchend", E), e.addEventListener("touchcancel", E);
		return () => {
			r.dispose(), cancelAnimationFrame(a), d && (d.removeEventListener("pointerdown", O), d.removeEventListener("pointermove", M), d.removeEventListener("pointerup", I), d.removeEventListener("pointercancel", I)), n && clearTimeout(n), window.removeEventListener("resize", s), window.removeEventListener("wheel", m, { capture: !0 }), window.removeEventListener("wheel", g, { capture: !0 }), window.removeEventListener("touchmove", _, { capture: !0 }), window.removeEventListener("pointerdown", v, { capture: !0 }), document.documentElement.removeAttribute("data-pp-cover-acts"), window.removeEventListener("keydown", y), window.removeEventListener("hashchange", b);
			for (let e of L) e.removeEventListener("touchstart", C), e.removeEventListener("touchmove", w), e.removeEventListener("touchend", E), e.removeEventListener("touchcancel", E);
			document.documentElement.removeAttribute("data-pp-cover"), document.documentElement.style.removeProperty("--pp-cover-p"), window.PostPipeCover && window.PostPipeCover.go && delete window.PostPipeCover, N.current = null;
		};
	}, [
		e,
		ne,
		re,
		t
	]);
	let we = (e) => {
		let t = N.current;
		!t || F.current() || (e === "graph" ? t.tapArt() : t.tapTop());
	}, Te = re === "art";
	return /* @__PURE__ */ m(f, { children: [
		/* @__PURE__ */ m("div", {
			ref: o,
			className: ad.cover,
			"data-cover": !0,
			"data-ground": e.ground,
			children: [
				/* @__PURE__ */ p("div", {
					ref: l,
					className: ad.ground,
					"data-cover-ground": !0,
					"data-sky": e.sky ? "" : void 0,
					style: {
						opacity: +!!Te,
						...xd(e.sky)
					},
					children: e.sky && e.sky.texture > 0 && /* @__PURE__ */ p("div", {
						className: ad.groundTexture,
						"data-cover-ground-texture": !0,
						style: {
							opacity: e.sky.texture,
							...Sd(e.sky.textureFrom)
						}
					})
				}),
				/* @__PURE__ */ m("div", {
					ref: u,
					className: ad.stage,
					role: "button",
					tabIndex: Te ? 0 : -1,
					"aria-label": "Show the graph",
					"data-cover-stage": !0,
					"data-cover-state": re,
					onClick: (e) => {
						e.target.closest && e.target.closest("[data-cover-byline]") || N.current && N.current.p < .5 && we("graph");
					},
					onKeyDown: (e) => {
						e.target === e.currentTarget && (e.key === "Enter" || e.key === " " || e.key === "Spacebar") && (e.preventDefault(), e.stopPropagation(), we("graph"));
					},
					children: [/* @__PURE__ */ m("div", {
						ref: d,
						className: ad.art,
						"data-cover-art": !0,
						style: { opacity: 0 },
						children: [
							/* @__PURE__ */ p("img", {
								ref: h,
								className: ad.image,
								src: e.art.artState,
								alt: "",
								draggable: "false",
								"data-cover-image": "art",
								style: e.art.graphState ? { opacity: +!!Te } : void 0
							}),
							e.art.graphState && /* @__PURE__ */ p("img", {
								ref: g,
								className: ad.image,
								src: e.art.graphState,
								alt: "",
								draggable: "false",
								"data-cover-image": "graph",
								style: {
									opacity: Te ? 0 : e.backdrop.opacity,
									...bd(e.backdrop.keepAbove, "below")
								}
							}),
							e.art.graphState && e.backdrop.keepAbove > 0 && /* @__PURE__ */ p("img", {
								ref: _,
								className: ad.image,
								src: e.art.graphState,
								alt: "",
								draggable: "false",
								"data-cover-image": "graph-keep",
								style: {
									opacity: +!Te,
									...bd(e.backdrop.keepAbove, "above")
								}
							}),
							e.art.rootsVector && /* @__PURE__ */ p("svg", {
								ref: b,
								className: ad.roots,
								"aria-hidden": "true",
								"data-roots-vector": "loading",
								preserveAspectRatio: "none",
								viewBox: I ? `0 0 ${I.w} ${I.h}` : void 0,
								style: {
									opacity: 0,
									...bd(e.backdrop.keepAbove, "below")
								}
							}),
							/* @__PURE__ */ p(Cd, {
								title: ce,
								size: I,
								start: re,
								refs: {
									art: D,
									graph: O
								}
							})
						]
					}), e.alt && /* @__PURE__ */ p("span", {
						className: ad.alt,
						role: "img",
						"aria-label": e.alt,
						"data-cover-alt": !0
					})]
				}),
				e.reach && /* @__PURE__ */ p("svg", {
					ref: v,
					className: ad.reach,
					"aria-hidden": "true",
					"data-cover-reach": !0,
					style: { opacity: 0 }
				})
			]
		}),
		/* @__PURE__ */ m("div", {
			ref: A,
			className: ad.section,
			"data-cover-section": !0,
			style: Te ? { pointerEvents: "none" } : void 0,
			children: [
				n,
				e.band && /* @__PURE__ */ p("div", {
					ref: M,
					className: ad.band,
					"data-top-band": !0,
					"aria-hidden": "true",
					style: { background: e.band.color }
				}),
				/* @__PURE__ */ p("button", {
					ref: j,
					type: "button",
					className: ad.handle,
					"aria-label": "Show the cover",
					title: "Show the cover",
					"data-cover-handle": !0,
					tabIndex: Te ? -1 : 0,
					style: {
						opacity: +!Te,
						pointerEvents: Te ? "none" : "auto"
					},
					onClick: () => we("art"),
					children: /* @__PURE__ */ p("span", {
						className: ad.grip,
						"aria-hidden": "true"
					})
				})
			]
		}),
		e.byline.text && /* @__PURE__ */ p("a", {
			ref: k,
			className: `${ad.byline} ${e.title ? ad.bylineTitle : ""}`,
			href: e.byline.href || void 0,
			"data-cover-byline": e.title ? "title" : "art",
			style: {
				opacity: 0,
				...e.title ? {
					fontFamily: e.title.family,
					color: e.title.color || void 0
				} : null
			},
			onClick: (e) => e.stopPropagation(),
			children: (0, rd.bylineText)(e.byline)
		})
	] });
}
function Td({ settings: e, viewState: t, children: n }) {
	let r = a(() => (0, rd.openingConfig)(e), [e]);
	return r ? /* @__PURE__ */ p(wd, {
		config: r,
		viewState: t,
		children: n
	}) : /* @__PURE__ */ p(f, { children: n });
}
//#endregion
//#region src/components/Contributions/useContributions.js
function Ed(e, t) {
	let n = JSON.stringify(e && e.contributions || null), i = a(() => (0, gc.contributionsConfig)(e), [n]), [o, s] = c(null);
	r(() => {
		if (!i) return;
		let e = !0, t = i.src.includes("?") ? "&" : "?";
		return fetch(i.src + t + "v=" + Date.now()).then((e) => e.ok ? e.json() : null).then((t) => {
			e && s(t);
		}).catch(() => {
			e && s(null);
		}), () => {
			e = !1;
		};
	}, [i && i.src]);
	let l = a(() => i && o ? (0, gc.visibleContributions)(o, {
		items: t && t.items || [],
		showTest: i.showTest
	}) : [], [
		n,
		o,
		t
	]);
	return {
		config: i,
		list: l,
		layers: a(() => (0, gc.connectionEdges)(l).length ? ["readers"] : [], [l])
	};
}
//#endregion
//#region src/views/index.js
var Dd = (/* @__PURE__ */ h(((e, t) => {
	var n = ["cluster"], r = (e) => typeof e == "string" ? e.trim() : "";
	function i(e, t) {
		let n = Array.isArray(e) ? e : [], i = r(t);
		return i && n.find((e) => e && e.id === i) || null;
	}
	function a(e) {
		return e && e.props && typeof e.props.layout == "string" ? e.props.layout : "";
	}
	function o(e, t, a) {
		let o = typeof a == "function" ? a : typeof console < "u" && console.warn ? console.warn.bind(console) : () => {}, s = e && Array.isArray(e.views) ? e.views : [], c = [], l = [];
		for (let e of s) {
			let n = r(e);
			!n || c.includes(n) || l.includes(n) || (i(t, n) ? c.push(n) : l.push(n));
		}
		return l.length && o(`[post-pipe] settings.views: unknown view${l.length > 1 ? "s" : ""} skipped: ${l.join(", ")}`), (c.length ? c : n).map((e) => i(t, e)).filter(Boolean);
	}
	function s(e, t) {
		let n = typeof e == "string" ? e : "", r = n.startsWith("?") ? n.slice(1) : n, a = "";
		for (let e of r.split("&")) {
			let t = e.indexOf("=");
			if ((t < 0 ? e : e.slice(0, t)) === "view") {
				try {
					a = decodeURIComponent(t < 0 ? "" : e.slice(t + 1).replace(/\+/g, " "));
				} catch {
					a = "";
				}
				break;
			}
		}
		return i(t, a);
	}
	function c(e, t) {
		let n = Array.isArray(e) ? e.filter(Boolean) : [];
		if (!n.length) return null;
		let r = t && typeof t == "object" ? t : {}, o = typeof r.layout == "string" ? r.layout : "", s = i(n, r.view);
		return s ? !a(s) || !o || a(s) === o ? s : n.find((e) => a(e) === o) || s : n[0];
	}
	t.exports = {
		DEFAULT_VIEWS: n,
		viewById: i,
		viewLayout: a,
		siteViews: o,
		viewFromSearch: s,
		currentView: c
	};
})))(), Od = [{
	id: "cluster",
	label: "cluster",
	component: Gc,
	props: { layout: "force" }
}, {
	id: "ring",
	label: "ring",
	component: Gc,
	props: { layout: "radial" }
}];
function kd(e, t = Od, n) {
	return (0, Dd.siteViews)(e, t, n);
}
//#endregion
var Ad = Dd.currentView, jd = _c.followLink, Md = Ul.graphFeed, Nd = _c.isLinkItem, Pd = _c.linkOf, Fd = Ul.resolvePages, Id = Ul.resumeTarget, Ld = yu.toolbarConfig, Rd = Ul.topBarConfig, zd = Ul.topBarOrder, Bd = Dd.viewById, Vd = Dd.viewFromSearch, Hd = Dd.viewLayout;
export { Bu as ConfigPanel, $l as FeedZ, Gc as GraphViewer, Td as Opening, e as React, l as ReactDOM, Nl as ReaderPanel, Fu as Settings, Zo as TTS, id as Theme, nd as TimeOfDay, qu as TimeOverlay, Zu as Toolbar, Od as VIEWS, Ad as currentView, jd as followLink, Md as graphFeed, Nd as isLinkItem, Pd as linkOf, Fd as resolvePages, Id as resumeTarget, kd as siteViews, Ld as toolbarConfig, Rd as topBarConfig, zd as topBarOrder, Ed as useContributions, Bd as viewById, Vd as viewFromSearch, Hd as viewLayout };
