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
	return new At(r, this._parents);
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
	return new At(r, i);
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
var R = Array.prototype.find;
function ne(e) {
	return function() {
		return R.call(this.children, e);
	};
}
function z() {
	return this.firstElementChild;
}
function re(e) {
	return this.select(e == null ? z : ne(typeof e == "function" ? e : te(e)));
}
//#endregion
//#region node_modules/d3-selection/src/selection/selectChildren.js
var ie = Array.prototype.filter;
function B() {
	return Array.from(this.children);
}
function ae(e) {
	return function() {
		return ie.call(this.children, e);
	};
}
function oe(e) {
	return this.selectAll(e == null ? B : ae(typeof e == "function" ? e : te(e)));
}
//#endregion
//#region node_modules/d3-selection/src/selection/filter.js
function se(e) {
	typeof e != "function" && (e = ee(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = [], c, l = 0; l < o; ++l) (c = a[l]) && e.call(c, c.__data__, l, a) && s.push(c);
	return new At(r, this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/selection/sparse.js
function ce(e) {
	return Array(e.length);
}
//#endregion
//#region node_modules/d3-selection/src/selection/enter.js
function le() {
	return new At(this._enter || this._groups.map(ce), this._parents);
}
function ue(e, t) {
	this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
ue.prototype = {
	constructor: ue,
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
function de(e) {
	return function() {
		return e;
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/data.js
function fe(e, t, n, r, i, a) {
	for (var o = 0, s, c = t.length, l = a.length; o < l; ++o) (s = t[o]) ? (s.__data__ = a[o], r[o] = s) : n[o] = new ue(e, a[o]);
	for (; o < c; ++o) (s = t[o]) && (i[o] = s);
}
function pe(e, t, n, r, i, a, o) {
	var s, c, l = /* @__PURE__ */ new Map(), u = t.length, d = a.length, f = Array(u), p;
	for (s = 0; s < u; ++s) (c = t[s]) && (f[s] = p = o.call(c, c.__data__, s, t) + "", l.has(p) ? i[s] = c : l.set(p, c));
	for (s = 0; s < d; ++s) p = o.call(e, a[s], s, a) + "", (c = l.get(p)) ? (r[s] = c, c.__data__ = a[s], l.delete(p)) : n[s] = new ue(e, a[s]);
	for (s = 0; s < u; ++s) (c = t[s]) && l.get(f[s]) === c && (i[s] = c);
}
function me(e) {
	return e.__data__;
}
function he(e, t) {
	if (!arguments.length) return Array.from(this, me);
	var n = t ? pe : fe, r = this._parents, i = this._groups;
	typeof e != "function" && (e = de(e));
	for (var a = i.length, o = Array(a), s = Array(a), c = Array(a), l = 0; l < a; ++l) {
		var u = r[l], d = i[l], f = d.length, p = ge(e.call(u, u && u.__data__, l, r)), m = p.length, h = s[l] = Array(m), g = o[l] = Array(m);
		n(u, d, h, g, c[l] = Array(f), p, t);
		for (var _ = 0, v = 0, y, b; _ < m; ++_) if (y = h[_]) {
			for (_ >= v && (v = _ + 1); !(b = g[v]) && ++v < m;);
			y._next = b || null;
		}
	}
	return o = new At(o, r), o._enter = s, o._exit = c, o;
}
function ge(e) {
	return typeof e == "object" && "length" in e ? e : Array.from(e);
}
//#endregion
//#region node_modules/d3-selection/src/selection/exit.js
function _e() {
	return new At(this._exit || this._groups.map(ce), this._parents);
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
	return new At(s, this._parents);
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
	return new At(i, this._parents).order();
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
function H(e) {
	var t = typeof e == "function" ? e : k(e);
	return this.select(function() {
		return this.appendChild(t.apply(this, arguments));
	});
}
//#endregion
//#region node_modules/d3-selection/src/selection/insert.js
function ft() {
	return null;
}
function pt(e, t) {
	var n = typeof e == "function" ? e : k(e), r = t == null ? ft : typeof t == "function" ? t : j(t);
	return this.select(function() {
		return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
	});
}
//#endregion
//#region node_modules/d3-selection/src/selection/remove.js
function mt() {
	var e = this.parentNode;
	e && e.removeChild(this);
}
function ht() {
	return this.each(mt);
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
function* U() {
	for (var e = this._groups, t = 0, n = e.length; t < n; ++t) for (var r = e[t], i = 0, a = r.length, o; i < a; ++i) (o = r[i]) && (yield o);
}
//#endregion
//#region node_modules/d3-selection/src/selection/index.js
var kt = [null];
function At(e, t) {
	this._groups = e, this._parents = t;
}
function jt() {
	return new At([[document.documentElement]], kt);
}
function Mt() {
	return this;
}
At.prototype = jt.prototype = {
	constructor: At,
	select: M,
	selectAll: L,
	selectChild: re,
	selectChildren: oe,
	filter: se,
	data: he,
	enter: le,
	exit: _e,
	join: ve,
	merge: ye,
	selection: Mt,
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
	append: H,
	insert: pt,
	remove: ht,
	clone: vt,
	datum: yt,
	on: wt,
	dispatch: Ot,
	[Symbol.iterator]: U
};
//#endregion
//#region node_modules/d3-selection/src/select.js
function W(e) {
	return typeof e == "string" ? new At([[document.querySelector(e)]], [document.documentElement]) : new At([[e]], kt);
}
//#endregion
//#region node_modules/d3-selection/src/sourceEvent.js
function Nt(e) {
	let t;
	for (; t = e.sourceEvent;) e = t;
	return e;
}
//#endregion
//#region node_modules/d3-selection/src/pointer.js
function Pt(e, t) {
	if (e = Nt(e), t === void 0 && (t = e.currentTarget), t) {
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
var Ft = { passive: !1 }, It = {
	capture: !0,
	passive: !1
};
function Lt(e) {
	e.stopImmediatePropagation();
}
function Rt(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region node_modules/d3-drag/src/nodrag.js
function zt(e) {
	var t = e.document.documentElement, n = W(e).on("dragstart.drag", Rt, It);
	"onselectstart" in t ? n.on("selectstart.drag", Rt, It) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function Bt(e, t) {
	var n = e.document.documentElement, r = W(e).on("dragstart.drag", null);
	t && (r.on("click.drag", Rt, It), setTimeout(function() {
		r.on("click.drag", null);
	}, 0)), "onselectstart" in n ? r.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
//#endregion
//#region node_modules/d3-drag/src/constant.js
var Vt = (e) => () => e;
//#endregion
//#region node_modules/d3-drag/src/event.js
function Ht(e, { sourceEvent: t, subject: n, target: r, identifier: i, active: a, x: o, y: s, dx: c, dy: l, dispatch: u }) {
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
Ht.prototype.on = function() {
	var e = this._.on.apply(this._, arguments);
	return e === this._ ? this : e;
};
//#endregion
//#region node_modules/d3-drag/src/drag.js
function Ut(e) {
	return !e.ctrlKey && !e.button;
}
function Wt() {
	return this.parentNode;
}
function Gt(e, t) {
	return t ?? {
		x: e.x,
		y: e.y
	};
}
function Kt() {
	return navigator.maxTouchPoints || "ontouchstart" in this;
}
function qt() {
	var e = Ut, t = Wt, n = Gt, r = Kt, i = {}, a = b("start", "drag", "end"), o = 0, s, c, l, u, d = 0;
	function f(e) {
		e.on("mousedown.drag", p).filter(r).on("touchstart.drag", g).on("touchmove.drag", _, Ft).on("touchend.drag touchcancel.drag", v).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	}
	function p(n, r) {
		if (!(u || !e.call(this, n, r))) {
			var i = y(this, t.call(this, n, r), n, r, "mouse");
			i && (W(n.view).on("mousemove.drag", m, It).on("mouseup.drag", h, It), zt(n.view), Lt(n), l = !1, s = n.clientX, c = n.clientY, i("start", n));
		}
	}
	function m(e) {
		if (Rt(e), !l) {
			var t = e.clientX - s, n = e.clientY - c;
			l = t * t + n * n > d;
		}
		i.mouse("drag", e);
	}
	function h(e) {
		W(e.view).on("mousemove.drag mouseup.drag", null), Bt(e.view, l), Rt(e), i.mouse("end", e);
	}
	function g(n, r) {
		if (e.call(this, n, r)) {
			var i = n.changedTouches, a = t.call(this, n, r), o = i.length, s, c;
			for (s = 0; s < o; ++s) (c = y(this, a, n, r, i[s].identifier, i[s])) && (Lt(n), c("start", n, i[s]));
		}
	}
	function _(e) {
		var t = e.changedTouches, n = t.length, r, a;
		for (r = 0; r < n; ++r) (a = i[t[r].identifier]) && (Rt(e), a("drag", e, t[r]));
	}
	function v(e) {
		var t = e.changedTouches, n = t.length, r, a;
		for (u && clearTimeout(u), u = setTimeout(function() {
			u = null;
		}, 500), r = 0; r < n; ++r) (a = i[t[r].identifier]) && (Lt(e), a("end", e, t[r]));
	}
	function y(e, t, r, s, c, l) {
		var u = a.copy(), d = Pt(l || r, t), p, m, h;
		if ((h = n.call(e, new Ht("beforestart", {
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
					d = Pt(l || a, t), _ = o;
					break;
			}
			u.call(r, e, new Ht(r, {
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
		return arguments.length ? (e = typeof t == "function" ? t : Vt(!!t), f) : e;
	}, f.container = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : Vt(e), f) : t;
	}, f.subject = function(e) {
		return arguments.length ? (n = typeof e == "function" ? e : Vt(e), f) : n;
	}, f.touchable = function(e) {
		return arguments.length ? (r = typeof e == "function" ? e : Vt(!!e), f) : r;
	}, f.on = function() {
		var e = a.on.apply(a, arguments);
		return e === a ? f : e;
	}, f.clickDistance = function(e) {
		return arguments.length ? (d = (e = +e) * e, f) : Math.sqrt(d);
	}, f;
}
//#endregion
//#region node_modules/d3-color/src/define.js
function Jt(e, t, n) {
	e.prototype = t.prototype = n, n.constructor = e;
}
function Yt(e, t) {
	var n = Object.create(e.prototype);
	for (var r in t) n[r] = t[r];
	return n;
}
//#endregion
//#region node_modules/d3-color/src/color.js
function Xt() {}
var Zt = .7, Qt = 1 / Zt, $t = "\\s*([+-]?\\d+)\\s*", en = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", tn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", nn = /^#([0-9a-f]{3,8})$/, rn = RegExp(`^rgb\\(${$t},${$t},${$t}\\)$`), an = RegExp(`^rgb\\(${tn},${tn},${tn}\\)$`), on = RegExp(`^rgba\\(${$t},${$t},${$t},${en}\\)$`), sn = RegExp(`^rgba\\(${tn},${tn},${tn},${en}\\)$`), cn = RegExp(`^hsl\\(${en},${tn},${tn}\\)$`), ln = RegExp(`^hsla\\(${en},${tn},${tn},${en}\\)$`), un = {
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
Jt(Xt, mn, {
	copy(e) {
		return Object.assign(new this.constructor(), this, e);
	},
	displayable() {
		return this.rgb().displayable();
	},
	hex: dn,
	formatHex: dn,
	formatHex8: fn,
	formatHsl: pn,
	formatRgb: G,
	toString: G
});
function dn() {
	return this.rgb().formatHex();
}
function fn() {
	return this.rgb().formatHex8();
}
function pn() {
	return En(this).formatHsl();
}
function G() {
	return this.rgb().formatRgb();
}
function mn(e) {
	var t, n;
	return e = (e + "").trim().toLowerCase(), (t = nn.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? hn(t) : n === 3 ? new yn(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? gn(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? gn(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = rn.exec(e)) ? new yn(t[1], t[2], t[3], 1) : (t = an.exec(e)) ? new yn(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = on.exec(e)) ? gn(t[1], t[2], t[3], t[4]) : (t = sn.exec(e)) ? gn(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = cn.exec(e)) ? Tn(t[1], t[2] / 100, t[3] / 100, 1) : (t = ln.exec(e)) ? Tn(t[1], t[2] / 100, t[3] / 100, t[4]) : un.hasOwnProperty(e) ? hn(un[e]) : e === "transparent" ? new yn(NaN, NaN, NaN, 0) : null;
}
function hn(e) {
	return new yn(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function gn(e, t, n, r) {
	return r <= 0 && (e = t = n = NaN), new yn(e, t, n, r);
}
function _n(e) {
	return e instanceof Xt || (e = mn(e)), e ? (e = e.rgb(), new yn(e.r, e.g, e.b, e.opacity)) : new yn();
}
function vn(e, t, n, r) {
	return arguments.length === 1 ? _n(e) : new yn(e, t, n, r ?? 1);
}
function yn(e, t, n, r) {
	this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
Jt(yn, vn, Yt(Xt, {
	brighter(e) {
		return e = e == null ? Qt : Qt ** +e, new yn(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? Zt : Zt ** +e, new yn(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	rgb() {
		return this;
	},
	clamp() {
		return new yn(Cn(this.r), Cn(this.g), Cn(this.b), Sn(this.opacity));
	},
	displayable() {
		return -.5 <= this.r && this.r < 255.5 && -.5 <= this.g && this.g < 255.5 && -.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
	},
	hex: K,
	formatHex: K,
	formatHex8: bn,
	formatRgb: xn,
	toString: xn
}));
function K() {
	return `#${wn(this.r)}${wn(this.g)}${wn(this.b)}`;
}
function bn() {
	return `#${wn(this.r)}${wn(this.g)}${wn(this.b)}${wn((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function xn() {
	let e = Sn(this.opacity);
	return `${e === 1 ? "rgb(" : "rgba("}${Cn(this.r)}, ${Cn(this.g)}, ${Cn(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function Sn(e) {
	return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function Cn(e) {
	return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function wn(e) {
	return e = Cn(e), (e < 16 ? "0" : "") + e.toString(16);
}
function Tn(e, t, n, r) {
	return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new On(e, t, n, r);
}
function En(e) {
	if (e instanceof On) return new On(e.h, e.s, e.l, e.opacity);
	if (e instanceof Xt || (e = mn(e)), !e) return new On();
	if (e instanceof On) return e;
	e = e.rgb();
	var t = e.r / 255, n = e.g / 255, r = e.b / 255, i = Math.min(t, n, r), a = Math.max(t, n, r), o = NaN, s = a - i, c = (a + i) / 2;
	return s ? (o = t === a ? (n - r) / s + (n < r) * 6 : n === a ? (r - t) / s + 2 : (t - n) / s + 4, s /= c < .5 ? a + i : 2 - a - i, o *= 60) : s = c > 0 && c < 1 ? 0 : o, new On(o, s, c, e.opacity);
}
function Dn(e, t, n, r) {
	return arguments.length === 1 ? En(e) : new On(e, t, n, r ?? 1);
}
function On(e, t, n, r) {
	this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
Jt(On, Dn, Yt(Xt, {
	brighter(e) {
		return e = e == null ? Qt : Qt ** +e, new On(this.h, this.s, this.l * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? Zt : Zt ** +e, new On(this.h, this.s, this.l * e, this.opacity);
	},
	rgb() {
		var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < .5 ? n : 1 - n) * t, i = 2 * n - r;
		return new yn(jn(e >= 240 ? e - 240 : e + 120, i, r), jn(e, i, r), jn(e < 120 ? e + 240 : e - 120, i, r), this.opacity);
	},
	clamp() {
		return new On(kn(this.h), An(this.s), An(this.l), Sn(this.opacity));
	},
	displayable() {
		return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
	},
	formatHsl() {
		let e = Sn(this.opacity);
		return `${e === 1 ? "hsl(" : "hsla("}${kn(this.h)}, ${An(this.s) * 100}%, ${An(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
	}
}));
function kn(e) {
	return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function An(e) {
	return Math.max(0, Math.min(1, e || 0));
}
function jn(e, t, n) {
	return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
//#endregion
//#region node_modules/d3-interpolate/src/constant.js
var Mn = (e) => () => e;
//#endregion
//#region node_modules/d3-interpolate/src/color.js
function Nn(e, t) {
	return function(n) {
		return e + n * t;
	};
}
function Pn(e, t, n) {
	return e **= +n, t = t ** +n - e, n = 1 / n, function(r) {
		return (e + r * t) ** +n;
	};
}
function Fn(e) {
	return (e = +e) == 1 ? In : function(t, n) {
		return n - t ? Pn(t, n, e) : Mn(isNaN(t) ? n : t);
	};
}
function In(e, t) {
	var n = t - e;
	return n ? Nn(e, n) : Mn(isNaN(e) ? t : e);
}
//#endregion
//#region node_modules/d3-interpolate/src/rgb.js
var Ln = (function e(t) {
	var n = Fn(t);
	function r(e, t) {
		var r = n((e = vn(e)).r, (t = vn(t)).r), i = n(e.g, t.g), a = n(e.b, t.b), o = In(e.opacity, t.opacity);
		return function(t) {
			return e.r = r(t), e.g = i(t), e.b = a(t), e.opacity = o(t), e + "";
		};
	}
	return r.gamma = e, r;
})(1);
//#endregion
//#region node_modules/d3-interpolate/src/numberArray.js
function Rn(e, t) {
	t ||= [];
	var n = e ? Math.min(t.length, e.length) : 0, r = t.slice(), i;
	return function(a) {
		for (i = 0; i < n; ++i) r[i] = e[i] * (1 - a) + t[i] * a;
		return r;
	};
}
function zn(e) {
	return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
//#endregion
//#region node_modules/d3-interpolate/src/array.js
function Bn(e, t) {
	var n = t ? t.length : 0, r = e ? Math.min(n, e.length) : 0, i = Array(r), a = Array(n), o;
	for (o = 0; o < r; ++o) i[o] = Yn(e[o], t[o]);
	for (; o < n; ++o) a[o] = t[o];
	return function(e) {
		for (o = 0; o < r; ++o) a[o] = i[o](e);
		return a;
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/date.js
function Vn(e, t) {
	var n = /* @__PURE__ */ new Date();
	return e = +e, t = +t, function(r) {
		return n.setTime(e * (1 - r) + t * r), n;
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/number.js
function Hn(e, t) {
	return e = +e, t = +t, function(n) {
		return e * (1 - n) + t * n;
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/object.js
function Un(e, t) {
	var n = {}, r = {}, i;
	for (i in (typeof e != "object" || !e) && (e = {}), (typeof t != "object" || !t) && (t = {}), t) i in e ? n[i] = Yn(e[i], t[i]) : r[i] = t[i];
	return function(e) {
		for (i in n) r[i] = n[i](e);
		return r;
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/string.js
var Wn = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Gn = new RegExp(Wn.source, "g");
function Kn(e) {
	return function() {
		return e;
	};
}
function qn(e) {
	return function(t) {
		return e(t) + "";
	};
}
function Jn(e, t) {
	var n = Wn.lastIndex = Gn.lastIndex = 0, r, i, a, o = -1, s = [], c = [];
	for (e += "", t += ""; (r = Wn.exec(e)) && (i = Gn.exec(t));) (a = i.index) > n && (a = t.slice(n, a), s[o] ? s[o] += a : s[++o] = a), (r = r[0]) === (i = i[0]) ? s[o] ? s[o] += i : s[++o] = i : (s[++o] = null, c.push({
		i: o,
		x: Hn(r, i)
	})), n = Gn.lastIndex;
	return n < t.length && (a = t.slice(n), s[o] ? s[o] += a : s[++o] = a), s.length < 2 ? c[0] ? qn(c[0].x) : Kn(t) : (t = c.length, function(e) {
		for (var n = 0, r; n < t; ++n) s[(r = c[n]).i] = r.x(e);
		return s.join("");
	});
}
//#endregion
//#region node_modules/d3-interpolate/src/value.js
function Yn(e, t) {
	var n = typeof t, r;
	return t == null || n === "boolean" ? Mn(t) : (n === "number" ? Hn : n === "string" ? (r = mn(t)) ? (t = r, Ln) : Jn : t instanceof mn ? Ln : t instanceof Date ? Vn : zn(t) ? Rn : Array.isArray(t) ? Bn : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? Un : Hn)(e, t);
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/decompose.js
var Xn = 180 / Math.PI, Zn = {
	translateX: 0,
	translateY: 0,
	rotate: 0,
	skewX: 0,
	scaleX: 1,
	scaleY: 1
};
function Qn(e, t, n, r, i, a) {
	var o, s, c;
	return (o = Math.sqrt(e * e + t * t)) && (e /= o, t /= o), (c = e * n + t * r) && (n -= e * c, r -= t * c), (s = Math.sqrt(n * n + r * r)) && (n /= s, r /= s, c /= s), e * r < t * n && (e = -e, t = -t, c = -c, o = -o), {
		translateX: i,
		translateY: a,
		rotate: Math.atan2(t, e) * Xn,
		skewX: Math.atan(c) * Xn,
		scaleX: o,
		scaleY: s
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/parse.js
var $n;
function er(e) {
	let t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
	return t.isIdentity ? Zn : Qn(t.a, t.b, t.c, t.d, t.e, t.f);
}
function tr(e) {
	return e == null || ($n ||= document.createElementNS("http://www.w3.org/2000/svg", "g"), $n.setAttribute("transform", e), !(e = $n.transform.baseVal.consolidate())) ? Zn : (e = e.matrix, Qn(e.a, e.b, e.c, e.d, e.e, e.f));
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/index.js
function nr(e, t, n, r) {
	function i(e) {
		return e.length ? e.pop() + " " : "";
	}
	function a(e, r, i, a, o, s) {
		if (e !== i || r !== a) {
			var c = o.push("translate(", null, t, null, n);
			s.push({
				i: c - 4,
				x: Hn(e, i)
			}, {
				i: c - 2,
				x: Hn(r, a)
			});
		} else (i || a) && o.push("translate(" + i + t + a + n);
	}
	function o(e, t, n, a) {
		e === t ? t && n.push(i(n) + "rotate(" + t + r) : (e - t > 180 ? t += 360 : t - e > 180 && (e += 360), a.push({
			i: n.push(i(n) + "rotate(", null, r) - 2,
			x: Hn(e, t)
		}));
	}
	function s(e, t, n, a) {
		e === t ? t && n.push(i(n) + "skewX(" + t + r) : a.push({
			i: n.push(i(n) + "skewX(", null, r) - 2,
			x: Hn(e, t)
		});
	}
	function c(e, t, n, r, a, o) {
		if (e !== n || t !== r) {
			var s = a.push(i(a) + "scale(", null, ",", null, ")");
			o.push({
				i: s - 4,
				x: Hn(e, n)
			}, {
				i: s - 2,
				x: Hn(t, r)
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
var rr = nr(er, "px, ", "px)", "deg)"), ir = nr(tr, ", ", ")", ")"), ar = 1e-12;
function or(e) {
	return ((e = Math.exp(e)) + 1 / e) / 2;
}
function sr(e) {
	return ((e = Math.exp(e)) - 1 / e) / 2;
}
function cr(e) {
	return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
var lr = (function e(t, n, r) {
	function i(e, i) {
		var a = e[0], o = e[1], s = e[2], c = i[0], l = i[1], u = i[2], d = c - a, f = l - o, p = d * d + f * f, m, h;
		if (p < ar) h = Math.log(u / s) / t, m = function(e) {
			return [
				a + e * d,
				o + e * f,
				s * Math.exp(t * e * h)
			];
		};
		else {
			var g = Math.sqrt(p), _ = (u * u - s * s + r * p) / (2 * s * n * g), v = (u * u - s * s - r * p) / (2 * u * n * g), y = Math.log(Math.sqrt(_ * _ + 1) - _);
			h = (Math.log(Math.sqrt(v * v + 1) - v) - y) / t, m = function(e) {
				var r = e * h, i = or(y), c = s / (n * g) * (i * cr(t * r + y) - sr(y));
				return [
					a + c * d,
					o + c * f,
					s * i / or(t * r + y)
				];
			};
		}
		return m.duration = h * 1e3 * t / Math.SQRT2, m;
	}
	return i.rho = function(t) {
		var n = Math.max(.001, +t), r = n * n;
		return e(n, r, r * r);
	}, i;
})(Math.SQRT2, 2, 4), ur = 0, dr = 0, fr = 0, pr = 1e3, mr, hr, gr = 0, _r = 0, vr = 0, yr = typeof performance == "object" && performance.now ? performance : Date, br = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
	setTimeout(e, 17);
};
function xr() {
	return _r ||= (br(Sr), yr.now() + vr);
}
function Sr() {
	_r = 0;
}
function Cr() {
	this._call = this._time = this._next = null;
}
Cr.prototype = wr.prototype = {
	constructor: Cr,
	restart: function(e, t, n) {
		if (typeof e != "function") throw TypeError("callback is not a function");
		n = (n == null ? xr() : +n) + (t == null ? 0 : +t), !this._next && hr !== this && (hr ? hr._next = this : mr = this, hr = this), this._call = e, this._time = n, kr();
	},
	stop: function() {
		this._call && (this._call = null, this._time = Infinity, kr());
	}
};
function wr(e, t, n) {
	var r = new Cr();
	return r.restart(e, t, n), r;
}
function Tr() {
	xr(), ++ur;
	for (var e = mr, t; e;) (t = _r - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
	--ur;
}
function Er() {
	_r = (gr = yr.now()) + vr, ur = dr = 0;
	try {
		Tr();
	} finally {
		ur = 0, Or(), _r = 0;
	}
}
function Dr() {
	var e = yr.now(), t = e - gr;
	t > pr && (vr -= t, gr = e);
}
function Or() {
	for (var e, t = mr, n, r = Infinity; t;) t._call ? (r > t._time && (r = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : mr = n);
	hr = e, kr(r);
}
function kr(e) {
	ur || (dr &&= clearTimeout(dr), e - _r > 24 ? (e < Infinity && (dr = setTimeout(Er, e - yr.now() - vr)), fr &&= clearInterval(fr)) : (fr ||= (gr = yr.now(), setInterval(Dr, pr)), ur = 1, br(Er)));
}
//#endregion
//#region node_modules/d3-timer/src/timeout.js
function Ar(e, t, n) {
	var r = new Cr();
	return t = t == null ? 0 : +t, r.restart((n) => {
		r.stop(), e(n + t);
	}, t, n), r;
}
//#endregion
//#region node_modules/d3-transition/src/transition/schedule.js
var jr = b("start", "end", "cancel", "interrupt"), Mr = [];
function Nr(e, t, n, r, i, a) {
	var o = e.__transition;
	if (!o) e.__transition = {};
	else if (n in o) return;
	Lr(e, n, {
		name: t,
		index: r,
		group: i,
		on: jr,
		tween: Mr,
		time: a.time,
		delay: a.delay,
		duration: a.duration,
		ease: a.ease,
		timer: null,
		state: 0
	});
}
function Pr(e, t) {
	var n = Ir(e, t);
	if (n.state > 0) throw Error("too late; already scheduled");
	return n;
}
function Fr(e, t) {
	var n = Ir(e, t);
	if (n.state > 3) throw Error("too late; already running");
	return n;
}
function Ir(e, t) {
	var n = e.__transition;
	if (!n || !(n = n[t])) throw Error("transition not found");
	return n;
}
function Lr(e, t, n) {
	var r = e.__transition, i;
	r[t] = n, n.timer = wr(a, 0, n.time);
	function a(e) {
		n.state = 1, n.timer.restart(o, n.delay, n.time), n.delay <= e && o(e - n.delay);
	}
	function o(a) {
		var l, u, d, f;
		if (n.state !== 1) return c();
		for (l in r) if (f = r[l], f.name === n.name) {
			if (f.state === 3) return Ar(o);
			f.state === 4 ? (f.state = 6, f.timer.stop(), f.on.call("interrupt", e, e.__data__, f.index, f.group), delete r[l]) : +l < t && (f.state = 6, f.timer.stop(), f.on.call("cancel", e, e.__data__, f.index, f.group), delete r[l]);
		}
		if (Ar(function() {
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
function Rr(e, t) {
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
function zr(e) {
	return this.each(function() {
		Rr(this, e);
	});
}
//#endregion
//#region node_modules/d3-transition/src/transition/tween.js
function Br(e, t) {
	var n, r;
	return function() {
		var i = Fr(this, e), a = i.tween;
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
function Vr(e, t, n) {
	var r, i;
	if (typeof n != "function") throw Error();
	return function() {
		var a = Fr(this, e), o = a.tween;
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
function Hr(e, t) {
	var n = this._id;
	if (e += "", arguments.length < 2) {
		for (var r = Ir(this.node(), n).tween, i = 0, a = r.length, o; i < a; ++i) if ((o = r[i]).name === e) return o.value;
		return null;
	}
	return this.each((t == null ? Br : Vr)(n, e, t));
}
function Ur(e, t, n) {
	var r = e._id;
	return e.each(function() {
		var e = Fr(this, r);
		(e.value ||= {})[t] = n.apply(this, arguments);
	}), function(e) {
		return Ir(e, r).value[t];
	};
}
//#endregion
//#region node_modules/d3-transition/src/transition/interpolate.js
function Wr(e, t) {
	var n;
	return (typeof t == "number" ? Hn : t instanceof mn ? Ln : (n = mn(t)) ? (t = n, Ln) : Jn)(e, t);
}
//#endregion
//#region node_modules/d3-transition/src/transition/attr.js
function Gr(e) {
	return function() {
		this.removeAttribute(e);
	};
}
function Kr(e) {
	return function() {
		this.removeAttributeNS(e.space, e.local);
	};
}
function qr(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = this.getAttribute(e);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function Jr(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = this.getAttributeNS(e.space, e.local);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function Yr(e, t, n) {
	var r, i, a;
	return function() {
		var o, s = n(this), c;
		return s == null ? void this.removeAttribute(e) : (o = this.getAttribute(e), c = s + "", o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s)));
	};
}
function Xr(e, t, n) {
	var r, i, a;
	return function() {
		var o, s = n(this), c;
		return s == null ? void this.removeAttributeNS(e.space, e.local) : (o = this.getAttributeNS(e.space, e.local), c = s + "", o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s)));
	};
}
function Zr(e, t) {
	var n = E(e), r = n === "transform" ? ir : Wr;
	return this.attrTween(e, typeof t == "function" ? (n.local ? Xr : Yr)(n, r, Ur(this, "attr." + e, t)) : t == null ? (n.local ? Kr : Gr)(n) : (n.local ? Jr : qr)(n, r, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/attrTween.js
function Qr(e, t) {
	return function(n) {
		this.setAttribute(e, t.call(this, n));
	};
}
function $r(e, t) {
	return function(n) {
		this.setAttributeNS(e.space, e.local, t.call(this, n));
	};
}
function ei(e, t) {
	var n, r;
	function i() {
		var i = t.apply(this, arguments);
		return i !== r && (n = (r = i) && $r(e, i)), n;
	}
	return i._value = t, i;
}
function ti(e, t) {
	var n, r;
	function i() {
		var i = t.apply(this, arguments);
		return i !== r && (n = (r = i) && Qr(e, i)), n;
	}
	return i._value = t, i;
}
function ni(e, t) {
	var n = "attr." + e;
	if (arguments.length < 2) return (n = this.tween(n)) && n._value;
	if (t == null) return this.tween(n, null);
	if (typeof t != "function") throw Error();
	var r = E(e);
	return this.tween(n, (r.local ? ei : ti)(r, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/delay.js
function ri(e, t) {
	return function() {
		Pr(this, e).delay = +t.apply(this, arguments);
	};
}
function ii(e, t) {
	return t = +t, function() {
		Pr(this, e).delay = t;
	};
}
function ai(e) {
	var t = this._id;
	return arguments.length ? this.each((typeof e == "function" ? ri : ii)(t, e)) : Ir(this.node(), t).delay;
}
//#endregion
//#region node_modules/d3-transition/src/transition/duration.js
function oi(e, t) {
	return function() {
		Fr(this, e).duration = +t.apply(this, arguments);
	};
}
function si(e, t) {
	return t = +t, function() {
		Fr(this, e).duration = t;
	};
}
function ci(e) {
	var t = this._id;
	return arguments.length ? this.each((typeof e == "function" ? oi : si)(t, e)) : Ir(this.node(), t).duration;
}
//#endregion
//#region node_modules/d3-transition/src/transition/ease.js
function li(e, t) {
	if (typeof t != "function") throw Error();
	return function() {
		Fr(this, e).ease = t;
	};
}
function ui(e) {
	var t = this._id;
	return arguments.length ? this.each(li(t, e)) : Ir(this.node(), t).ease;
}
//#endregion
//#region node_modules/d3-transition/src/transition/easeVarying.js
function di(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		if (typeof n != "function") throw Error();
		Fr(this, e).ease = n;
	};
}
function fi(e) {
	if (typeof e != "function") throw Error();
	return this.each(di(this._id, e));
}
//#endregion
//#region node_modules/d3-transition/src/transition/filter.js
function pi(e) {
	typeof e != "function" && (e = ee(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = [], c, l = 0; l < o; ++l) (c = a[l]) && e.call(c, c.__data__, l, a) && s.push(c);
	return new Hi(r, this._parents, this._name, this._id);
}
//#endregion
//#region node_modules/d3-transition/src/transition/merge.js
function mi(e) {
	if (e._id !== this._id) throw Error();
	for (var t = this._groups, n = e._groups, r = t.length, i = n.length, a = Math.min(r, i), o = Array(r), s = 0; s < a; ++s) for (var c = t[s], l = n[s], u = c.length, d = o[s] = Array(u), f, p = 0; p < u; ++p) (f = c[p] || l[p]) && (d[p] = f);
	for (; s < r; ++s) o[s] = t[s];
	return new Hi(o, this._parents, this._name, this._id);
}
//#endregion
//#region node_modules/d3-transition/src/transition/on.js
function hi(e) {
	return (e + "").trim().split(/^|\s+/).every(function(e) {
		var t = e.indexOf(".");
		return t >= 0 && (e = e.slice(0, t)), !e || e === "start";
	});
}
function gi(e, t, n) {
	var r, i, a = hi(t) ? Pr : Fr;
	return function() {
		var o = a(this, e), s = o.on;
		s !== r && (i = (r = s).copy()).on(t, n), o.on = i;
	};
}
function _i(e, t) {
	var n = this._id;
	return arguments.length < 2 ? Ir(this.node(), n).on.on(e) : this.each(gi(n, e, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/remove.js
function vi(e) {
	return function() {
		var t = this.parentNode;
		for (var n in this.__transition) if (+n !== e) return;
		t && t.removeChild(this);
	};
}
function yi() {
	return this.on("end.remove", vi(this._id));
}
//#endregion
//#region node_modules/d3-transition/src/transition/select.js
function bi(e) {
	var t = this._name, n = this._id;
	typeof e != "function" && (e = j(e));
	for (var r = this._groups, i = r.length, a = Array(i), o = 0; o < i; ++o) for (var s = r[o], c = s.length, l = a[o] = Array(c), u, d, f = 0; f < c; ++f) (u = s[f]) && (d = e.call(u, u.__data__, f, s)) && ("__data__" in u && (d.__data__ = u.__data__), l[f] = d, Nr(l[f], t, n, f, l, Ir(u, n)));
	return new Hi(a, this._parents, t, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/selectAll.js
function xi(e) {
	var t = this._name, n = this._id;
	typeof e != "function" && (e = F(e));
	for (var r = this._groups, i = r.length, a = [], o = [], s = 0; s < i; ++s) for (var c = r[s], l = c.length, u, d = 0; d < l; ++d) if (u = c[d]) {
		for (var f = e.call(u, u.__data__, d, c), p, m = Ir(u, n), h = 0, g = f.length; h < g; ++h) (p = f[h]) && Nr(p, t, n, h, f, m);
		a.push(f), o.push(u);
	}
	return new Hi(a, o, t, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/selection.js
var Si = jt.prototype.constructor;
function Ci() {
	return new Si(this._groups, this._parents);
}
//#endregion
//#region node_modules/d3-transition/src/transition/style.js
function wi(e, t) {
	var n, r, i;
	return function() {
		var a = Be(this, e), o = (this.style.removeProperty(e), Be(this, e));
		return a === o ? null : a === n && o === r ? i : i = t(n = a, r = o);
	};
}
function Ti(e) {
	return function() {
		this.style.removeProperty(e);
	};
}
function Ei(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = Be(this, e);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function Di(e, t, n) {
	var r, i, a;
	return function() {
		var o = Be(this, e), s = n(this), c = s + "";
		return s ?? (c = s = (this.style.removeProperty(e), Be(this, e))), o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s));
	};
}
function Oi(e, t) {
	var n, r, i, a = "style." + t, o = "end." + a, s;
	return function() {
		var c = Fr(this, e), l = c.on, u = c.value[a] == null ? s ||= Ti(t) : void 0;
		(l !== n || i !== u) && (r = (n = l).copy()).on(o, i = u), c.on = r;
	};
}
function ki(e, t, n) {
	var r = (e += "") == "transform" ? rr : Wr;
	return t == null ? this.styleTween(e, wi(e, r)).on("end.style." + e, Ti(e)) : typeof t == "function" ? this.styleTween(e, Di(e, r, Ur(this, "style." + e, t))).each(Oi(this._id, e)) : this.styleTween(e, Ei(e, r, t), n).on("end.style." + e, null);
}
//#endregion
//#region node_modules/d3-transition/src/transition/styleTween.js
function Ai(e, t, n) {
	return function(r) {
		this.style.setProperty(e, t.call(this, r), n);
	};
}
function ji(e, t, n) {
	var r, i;
	function a() {
		var a = t.apply(this, arguments);
		return a !== i && (r = (i = a) && Ai(e, a, n)), r;
	}
	return a._value = t, a;
}
function Mi(e, t, n) {
	var r = "style." + (e += "");
	if (arguments.length < 2) return (r = this.tween(r)) && r._value;
	if (t == null) return this.tween(r, null);
	if (typeof t != "function") throw Error();
	return this.tween(r, ji(e, t, n ?? ""));
}
//#endregion
//#region node_modules/d3-transition/src/transition/text.js
function Ni(e) {
	return function() {
		this.textContent = e;
	};
}
function Pi(e) {
	return function() {
		var t = e(this);
		this.textContent = t ?? "";
	};
}
function Fi(e) {
	return this.tween("text", typeof e == "function" ? Pi(Ur(this, "text", e)) : Ni(e == null ? "" : e + ""));
}
//#endregion
//#region node_modules/d3-transition/src/transition/textTween.js
function Ii(e) {
	return function(t) {
		this.textContent = e.call(this, t);
	};
}
function Li(e) {
	var t, n;
	function r() {
		var r = e.apply(this, arguments);
		return r !== n && (t = (n = r) && Ii(r)), t;
	}
	return r._value = e, r;
}
function Ri(e) {
	var t = "text";
	if (arguments.length < 1) return (t = this.tween(t)) && t._value;
	if (e == null) return this.tween(t, null);
	if (typeof e != "function") throw Error();
	return this.tween(t, Li(e));
}
//#endregion
//#region node_modules/d3-transition/src/transition/transition.js
function zi() {
	for (var e = this._name, t = this._id, n = Wi(), r = this._groups, i = r.length, a = 0; a < i; ++a) for (var o = r[a], s = o.length, c, l = 0; l < s; ++l) if (c = o[l]) {
		var u = Ir(c, t);
		Nr(c, e, n, l, o, {
			time: u.time + u.delay + u.duration,
			delay: 0,
			duration: u.duration,
			ease: u.ease
		});
	}
	return new Hi(r, this._parents, e, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/end.js
function Bi() {
	var e, t, n = this, r = n._id, i = n.size();
	return new Promise(function(a, o) {
		var s = { value: o }, c = { value: function() {
			--i === 0 && a();
		} };
		n.each(function() {
			var n = Fr(this, r), i = n.on;
			i !== e && (t = (e = i).copy(), t._.cancel.push(s), t._.interrupt.push(s), t._.end.push(c)), n.on = t;
		}), i === 0 && a();
	});
}
//#endregion
//#region node_modules/d3-transition/src/transition/index.js
var Vi = 0;
function Hi(e, t, n, r) {
	this._groups = e, this._parents = t, this._name = n, this._id = r;
}
function Ui(e) {
	return jt().transition(e);
}
function Wi() {
	return ++Vi;
}
var Gi = jt.prototype;
Hi.prototype = Ui.prototype = {
	constructor: Hi,
	select: bi,
	selectAll: xi,
	selectChild: Gi.selectChild,
	selectChildren: Gi.selectChildren,
	filter: pi,
	merge: mi,
	selection: Ci,
	transition: zi,
	call: Gi.call,
	nodes: Gi.nodes,
	node: Gi.node,
	size: Gi.size,
	empty: Gi.empty,
	each: Gi.each,
	on: _i,
	attr: Zr,
	attrTween: ni,
	style: ki,
	styleTween: Mi,
	text: Fi,
	textTween: Ri,
	remove: yi,
	tween: Hr,
	delay: ai,
	duration: ci,
	ease: ui,
	easeVarying: fi,
	end: Bi,
	[Symbol.iterator]: Gi[Symbol.iterator]
};
//#endregion
//#region node_modules/d3-ease/src/cubic.js
function Ki(e) {
	return --e * e * e + 1;
}
function qi(e) {
	return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
//#endregion
//#region node_modules/d3-transition/src/selection/transition.js
var Ji = {
	time: null,
	delay: 0,
	duration: 250,
	ease: qi
};
function Yi(e, t) {
	for (var n; !(n = e.__transition) || !(n = n[t]);) if (!(e = e.parentNode)) throw Error(`transition ${t} not found`);
	return n;
}
function Xi(e) {
	var t, n;
	e instanceof Hi ? (t = e._id, e = e._name) : (t = Wi(), (n = Ji).time = xr(), e = e == null ? null : e + "");
	for (var r = this._groups, i = r.length, a = 0; a < i; ++a) for (var o = r[a], s = o.length, c, l = 0; l < s; ++l) (c = o[l]) && Nr(c, e, t, l, o, n || Yi(c, t));
	return new Hi(r, this._parents, e, t);
}
jt.prototype.interrupt = zr, jt.prototype.transition = Xi;
//#endregion
//#region node_modules/d3-brush/src/brush.js
var { abs: Zi, max: Qi, min: $i } = Math;
["w", "e"].map(ea), ["n", "s"].map(ea), [
	"n",
	"w",
	"e",
	"s",
	"nw",
	"ne",
	"sw",
	"se"
].map(ea);
function ea(e) {
	return { type: e };
}
//#endregion
//#region node_modules/d3-path/src/path.js
var ta = Math.PI, na = 2 * ta, ra = 1e-6, ia = na - ra;
function aa(e) {
	this._ += e[0];
	for (let t = 1, n = e.length; t < n; ++t) this._ += arguments[t] + e[t];
}
function oa(e) {
	let t = Math.floor(e);
	if (!(t >= 0)) throw Error(`invalid digits: ${e}`);
	if (t > 15) return aa;
	let n = 10 ** t;
	return function(e) {
		this._ += e[0];
		for (let t = 1, r = e.length; t < r; ++t) this._ += Math.round(arguments[t] * n) / n + e[t];
	};
}
var sa = class {
	constructor(e) {
		this._x0 = this._y0 = this._x1 = this._y1 = null, this._ = "", this._append = e == null ? aa : oa(e);
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
		else if (d > ra) if (!(Math.abs(u * s - c * l) > ra) || !i) this._append`L${this._x1 = e},${this._y1 = t}`;
		else {
			let f = n - a, p = r - o, m = s * s + c * c, h = f * f + p * p, g = Math.sqrt(m), _ = Math.sqrt(d), v = i * Math.tan((ta - Math.acos((m + d - h) / (2 * g * _))) / 2), y = v / _, b = v / g;
			Math.abs(y - 1) > ra && this._append`L${e + y * l},${t + y * u}`, this._append`A${i},${i},0,0,${+(u * f > l * p)},${this._x1 = e + b * s},${this._y1 = t + b * c}`;
		}
	}
	arc(e, t, n, r, i, a) {
		if (e = +e, t = +t, n = +n, a = !!a, n < 0) throw Error(`negative radius: ${n}`);
		let o = n * Math.cos(r), s = n * Math.sin(r), c = e + o, l = t + s, u = 1 ^ a, d = a ? r - i : i - r;
		this._x1 === null ? this._append`M${c},${l}` : (Math.abs(this._x1 - c) > ra || Math.abs(this._y1 - l) > ra) && this._append`L${c},${l}`, n && (d < 0 && (d = d % na + na), d > ia ? this._append`A${n},${n},0,1,${u},${e - o},${t - s}A${n},${n},0,1,${u},${this._x1 = c},${this._y1 = l}` : d > ra && this._append`A${n},${n},0,${+(d >= ta)},${u},${this._x1 = e + n * Math.cos(i)},${this._y1 = t + n * Math.sin(i)}`);
	}
	rect(e, t, n, r) {
		this._append`M${this._x0 = this._x1 = +e},${this._y0 = this._y1 = +t}h${n = +n}v${+r}h${-n}Z`;
	}
	toString() {
		return this._;
	}
};
function ca() {
	return new sa();
}
ca.prototype = sa.prototype;
//#endregion
//#region node_modules/d3-force/src/center.js
function la(e, t) {
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
function ua(e) {
	let t = +this._x.call(null, e), n = +this._y.call(null, e);
	return da(this.cover(t, n), t, n, e);
}
function da(e, t, n, r) {
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
function fa(e) {
	var t, n, r = e.length, i, a, o = Array(r), s = Array(r), c = Infinity, l = Infinity, u = -Infinity, d = -Infinity;
	for (n = 0; n < r; ++n) isNaN(i = +this._x.call(null, t = e[n])) || isNaN(a = +this._y.call(null, t)) || (o[n] = i, s[n] = a, i < c && (c = i), i > u && (u = i), a < l && (l = a), a > d && (d = a));
	if (c > u || l > d) return this;
	for (this.cover(c, l).cover(u, d), n = 0; n < r; ++n) da(this, o[n], s[n], e[n]);
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/cover.js
function pa(e, t) {
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
function ma() {
	var e = [];
	return this.visit(function(t) {
		if (!t.length) do
			e.push(t.data);
		while (t = t.next);
	}), e;
}
//#endregion
//#region node_modules/d3-quadtree/src/extent.js
function ha(e) {
	return arguments.length ? this.cover(+e[0][0], +e[0][1]).cover(+e[1][0], +e[1][1]) : isNaN(this._x0) ? void 0 : [[this._x0, this._y0], [this._x1, this._y1]];
}
//#endregion
//#region node_modules/d3-quadtree/src/quad.js
function ga(e, t, n, r, i) {
	this.node = e, this.x0 = t, this.y0 = n, this.x1 = r, this.y1 = i;
}
//#endregion
//#region node_modules/d3-quadtree/src/find.js
function _a(e, t, n) {
	var r, i = this._x0, a = this._y0, o, s, c, l, u = this._x1, d = this._y1, f = [], p = this._root, m, h;
	for (p && f.push(new ga(p, i, a, u, d)), n == null ? n = Infinity : (i = e - n, a = t - n, u = e + n, d = t + n, n *= n); m = f.pop();) if (!(!(p = m.node) || (o = m.x0) > u || (s = m.y0) > d || (c = m.x1) < i || (l = m.y1) < a)) if (p.length) {
		var g = (o + c) / 2, _ = (s + l) / 2;
		f.push(new ga(p[3], g, _, c, l), new ga(p[2], o, _, g, l), new ga(p[1], g, s, c, _), new ga(p[0], o, s, g, _)), (h = (t >= _) << 1 | e >= g) && (m = f[f.length - 1], f[f.length - 1] = f[f.length - 1 - h], f[f.length - 1 - h] = m);
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
function va(e) {
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
function ya(e) {
	for (var t = 0, n = e.length; t < n; ++t) this.remove(e[t]);
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/root.js
function ba() {
	return this._root;
}
//#endregion
//#region node_modules/d3-quadtree/src/size.js
function xa() {
	var e = 0;
	return this.visit(function(t) {
		if (!t.length) do
			++e;
		while (t = t.next);
	}), e;
}
//#endregion
//#region node_modules/d3-quadtree/src/visit.js
function Sa(e) {
	var t = [], n, r = this._root, i, a, o, s, c;
	for (r && t.push(new ga(r, this._x0, this._y0, this._x1, this._y1)); n = t.pop();) if (!e(r = n.node, a = n.x0, o = n.y0, s = n.x1, c = n.y1) && r.length) {
		var l = (a + s) / 2, u = (o + c) / 2;
		(i = r[3]) && t.push(new ga(i, l, u, s, c)), (i = r[2]) && t.push(new ga(i, a, u, l, c)), (i = r[1]) && t.push(new ga(i, l, o, s, u)), (i = r[0]) && t.push(new ga(i, a, o, l, u));
	}
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/visitAfter.js
function Ca(e) {
	var t = [], n = [], r;
	for (this._root && t.push(new ga(this._root, this._x0, this._y0, this._x1, this._y1)); r = t.pop();) {
		var i = r.node;
		if (i.length) {
			var a, o = r.x0, s = r.y0, c = r.x1, l = r.y1, u = (o + c) / 2, d = (s + l) / 2;
			(a = i[0]) && t.push(new ga(a, o, s, u, d)), (a = i[1]) && t.push(new ga(a, u, s, c, d)), (a = i[2]) && t.push(new ga(a, o, d, u, l)), (a = i[3]) && t.push(new ga(a, u, d, c, l));
		}
		n.push(r);
	}
	for (; r = n.pop();) e(r.node, r.x0, r.y0, r.x1, r.y1);
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/x.js
function wa(e) {
	return e[0];
}
function Ta(e) {
	return arguments.length ? (this._x = e, this) : this._x;
}
//#endregion
//#region node_modules/d3-quadtree/src/y.js
function Ea(e) {
	return e[1];
}
function Da(e) {
	return arguments.length ? (this._y = e, this) : this._y;
}
//#endregion
//#region node_modules/d3-quadtree/src/quadtree.js
function Oa(e, t, n) {
	var r = new ka(t ?? wa, n ?? Ea, NaN, NaN, NaN, NaN);
	return e == null ? r : r.addAll(e);
}
function ka(e, t, n, r, i, a) {
	this._x = e, this._y = t, this._x0 = n, this._y0 = r, this._x1 = i, this._y1 = a, this._root = void 0;
}
function Aa(e) {
	for (var t = { data: e.data }, n = t; e = e.next;) n = n.next = { data: e.data };
	return t;
}
var ja = Oa.prototype = ka.prototype;
ja.copy = function() {
	var e = new ka(this._x, this._y, this._x0, this._y0, this._x1, this._y1), t = this._root, n, r;
	if (!t) return e;
	if (!t.length) return e._root = Aa(t), e;
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
	}) : t.target[i] = Aa(r));
	return e;
}, ja.add = ua, ja.addAll = fa, ja.cover = pa, ja.data = ma, ja.extent = ha, ja.find = _a, ja.remove = va, ja.removeAll = ya, ja.root = ba, ja.size = xa, ja.visit = Sa, ja.visitAfter = Ca, ja.x = Ta, ja.y = Da;
//#endregion
//#region node_modules/d3-force/src/constant.js
function Ma(e) {
	return function() {
		return e;
	};
}
//#endregion
//#region node_modules/d3-force/src/jiggle.js
function Na(e) {
	return (e() - .5) * 1e-6;
}
//#endregion
//#region node_modules/d3-force/src/collide.js
function Pa(e) {
	return e.x + e.vx;
}
function Fa(e) {
	return e.y + e.vy;
}
function Ia(e) {
	var t, n, r, i = 1, a = 1;
	typeof e != "function" && (e = Ma(e == null ? 1 : +e));
	function o() {
		for (var e, o = t.length, c, l, u, d, f, p, m = 0; m < a; ++m) for (c = Oa(t, Pa, Fa).visitAfter(s), e = 0; e < o; ++e) l = t[e], f = n[l.index], p = f * f, u = l.x + l.vx, d = l.y + l.vy, c.visit(h);
		function h(e, t, n, a, o) {
			var s = e.data, c = e.r, m = f + c;
			if (s) {
				if (s.index > l.index) {
					var h = u - s.x - s.vx, g = d - s.y - s.vy, _ = h * h + g * g;
					_ < m * m && (h === 0 && (h = Na(r), _ += h * h), g === 0 && (g = Na(r), _ += g * g), _ = (m - (_ = Math.sqrt(_))) / _ * i, l.vx += (h *= _) * (m = (c *= c) / (p + c)), l.vy += (g *= _) * m, s.vx -= h * (m = 1 - m), s.vy -= g * m);
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
		return arguments.length ? (e = typeof t == "function" ? t : Ma(+t), c(), o) : e;
	}, o;
}
//#endregion
//#region node_modules/d3-force/src/link.js
function La(e) {
	return e.index;
}
function Ra(e, t) {
	var n = e.get(t);
	if (!n) throw Error("node not found: " + t);
	return n;
}
function za(e) {
	var t = La, n = d, r, i = Ma(30), a, o, s, c, l, u = 1;
	e ??= [];
	function d(e) {
		return 1 / Math.min(s[e.source.index], s[e.target.index]);
	}
	function f(t) {
		for (var n = 0, i = e.length; n < u; ++n) for (var o = 0, s, d, f, p, m, h, g; o < i; ++o) s = e[o], d = s.source, f = s.target, p = f.x + f.vx - d.x - d.vx || Na(l), m = f.y + f.vy - d.y - d.vy || Na(l), h = Math.sqrt(p * p + m * m), h = (h - a[o]) / h * t * r[o], p *= h, m *= h, f.vx -= p * (g = c[o]), f.vy -= m * g, d.vx += p * (g = 1 - g), d.vy += m * g;
	}
	function p() {
		if (o) {
			var n, i = o.length, l = e.length, u = new Map(o.map((e, n) => [t(e, n, o), e])), d;
			for (n = 0, s = Array(i); n < l; ++n) d = e[n], d.index = n, typeof d.source != "object" && (d.source = Ra(u, d.source)), typeof d.target != "object" && (d.target = Ra(u, d.target)), s[d.source.index] = (s[d.source.index] || 0) + 1, s[d.target.index] = (s[d.target.index] || 0) + 1;
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
		return arguments.length ? (n = typeof e == "function" ? e : Ma(+e), m(), f) : n;
	}, f.distance = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : Ma(+e), h(), f) : i;
	}, f;
}
//#endregion
//#region node_modules/d3-force/src/lcg.js
var Ba = 1664525, Va = 1013904223, Ha = 4294967296;
function Ua() {
	let e = 1;
	return () => (e = (Ba * e + Va) % Ha) / Ha;
}
//#endregion
//#region node_modules/d3-force/src/simulation.js
function Wa(e) {
	return e.x;
}
function Ga(e) {
	return e.y;
}
var Ka = 10, qa = Math.PI * (3 - Math.sqrt(5));
function Ja(e) {
	var t, n = 1, r = .001, i = 1 - r ** (1 / 300), a = 0, o = .6, s = /* @__PURE__ */ new Map(), c = wr(d), l = b("tick", "end"), u = Ua();
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
				var i = Ka * Math.sqrt(.5 + t), a = t * qa;
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
function Ya() {
	var e, t, n, r, i = Ma(-30), a, o = 1, s = Infinity, c = .81;
	function l(n) {
		var i, a = e.length, o = Oa(e, Wa, Ga).visitAfter(d);
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
		if (p * p / c < m) return m < s && (d === 0 && (d = Na(n), m += d * d), f === 0 && (f = Na(n), m += f * f), m < o && (m = Math.sqrt(o * m)), t.vx += d * e.value * r / m, t.vy += f * e.value * r / m), !0;
		if (!(e.length || m >= s)) {
			(e.data !== t || e.next) && (d === 0 && (d = Na(n), m += d * d), f === 0 && (f = Na(n), m += f * f), m < o && (m = Math.sqrt(o * m)));
			do
				e.data !== t && (p = a[e.data.index] * r / m, t.vx += d * p, t.vy += f * p);
			while (e = e.next);
		}
	}
	return l.initialize = function(t, r) {
		e = t, n = r, u();
	}, l.strength = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : Ma(+e), u(), l) : i;
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
function Xa(e) {
	for (var t = -1, n = e.length, r = 0, i = 0, a, o = e[n - 1], s, c = 0; ++t < n;) a = o, o = e[t], c += s = a[0] * o[1] - o[0] * a[1], r += (a[0] + o[0]) * s, i += (a[1] + o[1]) * s;
	return c *= 3, [r / c, i / c];
}
//#endregion
//#region node_modules/d3-polygon/src/cross.js
function Za(e, t, n) {
	return (t[0] - e[0]) * (n[1] - e[1]) - (t[1] - e[1]) * (n[0] - e[0]);
}
//#endregion
//#region node_modules/d3-polygon/src/hull.js
function Qa(e, t) {
	return e[0] - t[0] || e[1] - t[1];
}
function $a(e) {
	let t = e.length, n = [0, 1], r = 2, i;
	for (i = 2; i < t; ++i) {
		for (; r > 1 && Za(e[n[r - 2]], e[n[r - 1]], e[i]) <= 0;) --r;
		n[r++] = i;
	}
	return n.slice(0, r);
}
function eo(e) {
	if ((n = e.length) < 3) return null;
	var t, n, r = Array(n), i = Array(n);
	for (t = 0; t < n; ++t) r[t] = [
		+e[t][0],
		+e[t][1],
		t
	];
	for (r.sort(Qa), t = 0; t < n; ++t) i[t] = [r[t][0], -r[t][1]];
	var a = $a(r), o = $a(i), s = o[0] === a[0], c = o[o.length - 1] === a[a.length - 1], l = [];
	for (t = a.length - 1; t >= 0; --t) l.push(e[r[a[t]][2]]);
	for (t = +s; t < o.length - c; ++t) l.push(e[r[o[t]][2]]);
	return l;
}
//#endregion
//#region node_modules/d3-shape/src/constant.js
function to(e) {
	return function() {
		return e;
	};
}
var no = Math.PI;
no / 2, 2 * no;
//#endregion
//#region node_modules/d3-shape/src/path.js
function ro(e) {
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
	}, () => new sa(t);
}
Array.prototype.slice;
function io(e) {
	return typeof e == "object" && "length" in e ? e : Array.from(e);
}
//#endregion
//#region node_modules/d3-shape/src/curve/linear.js
function ao(e) {
	this._context = e;
}
ao.prototype = {
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
function oo(e) {
	return new ao(e);
}
//#endregion
//#region node_modules/d3-shape/src/point.js
function so(e) {
	return e[0];
}
function co(e) {
	return e[1];
}
//#endregion
//#region node_modules/d3-shape/src/line.js
function lo(e, t) {
	var n = to(!0), r = null, i = oo, a = null, o = ro(s);
	e = typeof e == "function" ? e : e === void 0 ? so : to(e), t = typeof t == "function" ? t : t === void 0 ? co : to(t);
	function s(s) {
		var c, l = (s = io(s)).length, u, d = !1, f;
		for (r ?? (a = i(f = o())), c = 0; c <= l; ++c) !(c < l && n(u = s[c], c, s)) === d && ((d = !d) ? a.lineStart() : a.lineEnd()), d && a.point(+e(u, c, s), +t(u, c, s));
		if (f) return a = null, f + "" || null;
	}
	return s.x = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : to(+t), s) : e;
	}, s.y = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : to(+e), s) : t;
	}, s.defined = function(e) {
		return arguments.length ? (n = typeof e == "function" ? e : to(!!e), s) : n;
	}, s.curve = function(e) {
		return arguments.length ? (i = e, r != null && (a = i(r)), s) : i;
	}, s.context = function(e) {
		return arguments.length ? (e == null ? r = a = null : a = i(r = e), s) : r;
	}, s;
}
//#endregion
//#region node_modules/d3-shape/src/noop.js
function uo() {}
//#endregion
//#region node_modules/d3-shape/src/curve/basis.js
function fo(e, t, n) {
	e._context.bezierCurveTo((2 * e._x0 + e._x1) / 3, (2 * e._y0 + e._y1) / 3, (e._x0 + 2 * e._x1) / 3, (e._y0 + 2 * e._y1) / 3, (e._x0 + 4 * e._x1 + t) / 6, (e._y0 + 4 * e._y1 + n) / 6);
}
function po(e) {
	this._context = e;
}
po.prototype = {
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
			case 3: fo(this, this._x1, this._y1);
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
				fo(this, e, t);
				break;
		}
		this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
	}
};
//#endregion
//#region node_modules/d3-shape/src/curve/basisClosed.js
function mo(e) {
	this._context = e;
}
mo.prototype = {
	areaStart: uo,
	areaEnd: uo,
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
				fo(this, e, t);
				break;
		}
		this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
	}
};
function ho(e) {
	return new mo(e);
}
//#endregion
//#region node_modules/d3-shape/src/curve/cardinal.js
function go(e, t, n) {
	e._context.bezierCurveTo(e._x1 + e._k * (e._x2 - e._x0), e._y1 + e._k * (e._y2 - e._y0), e._x2 + e._k * (e._x1 - t), e._y2 + e._k * (e._y1 - n), e._x2, e._y2);
}
function _o(e, t) {
	this._context = e, this._k = (1 - t) / 6;
}
_o.prototype = {
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
				go(this, this._x1, this._y1);
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
				go(this, e, t);
				break;
		}
		this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
}, (function e(t) {
	function n(e) {
		return new _o(e, t);
	}
	return n.tension = function(t) {
		return e(+t);
	}, n;
})(0);
//#endregion
//#region node_modules/d3-shape/src/curve/cardinalClosed.js
function vo(e, t) {
	this._context = e, this._k = (1 - t) / 6;
}
vo.prototype = {
	areaStart: uo,
	areaEnd: uo,
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
				go(this, e, t);
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
//#region node_modules/d3-shape/src/curve/catmullRom.js
function yo(e, t, n) {
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
function bo(e, t) {
	this._context = e, this._alpha = t;
}
bo.prototype = {
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
				yo(this, e, t);
				break;
		}
		this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
}, (function e(t) {
	function n(e) {
		return t ? new bo(e, t) : new _o(e, 0);
	}
	return n.alpha = function(t) {
		return e(+t);
	}, n;
})(.5);
//#endregion
//#region node_modules/d3-shape/src/curve/catmullRomClosed.js
function xo(e, t) {
	this._context = e, this._alpha = t;
}
xo.prototype = {
	areaStart: uo,
	areaEnd: uo,
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
				yo(this, e, t);
				break;
		}
		this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
};
var So = (function e(t) {
	function n(e) {
		return t ? new xo(e, t) : new vo(e, 0);
	}
	return n.alpha = function(t) {
		return e(+t);
	}, n;
})(.5), Co = (e) => () => e;
//#endregion
//#region node_modules/d3-zoom/src/event.js
function wo(e, { sourceEvent: t, target: n, transform: r, dispatch: i }) {
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
function To(e, t, n) {
	this.k = e, this.x = t, this.y = n;
}
To.prototype = {
	constructor: To,
	scale: function(e) {
		return e === 1 ? this : new To(this.k * e, this.x, this.y);
	},
	translate: function(e, t) {
		return e === 0 & t === 0 ? this : new To(this.k, this.x + this.k * e, this.y + this.k * t);
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
var Eo = new To(1, 0, 0);
Do.prototype = To.prototype;
function Do(e) {
	for (; !e.__zoom;) if (!(e = e.parentNode)) return Eo;
	return e.__zoom;
}
//#endregion
//#region node_modules/d3-zoom/src/noevent.js
function Oo(e) {
	e.stopImmediatePropagation();
}
function ko(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region node_modules/d3-zoom/src/zoom.js
function Ao(e) {
	return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function jo() {
	var e = this;
	return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function Mo() {
	return this.__zoom || Eo;
}
function No(e) {
	return -e.deltaY * (e.deltaMode === 1 ? .05 : e.deltaMode ? 1 : .002) * (e.ctrlKey ? 10 : 1);
}
function Po() {
	return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Fo(e, t, n) {
	var r = e.invertX(t[0][0]) - n[0][0], i = e.invertX(t[1][0]) - n[1][0], a = e.invertY(t[0][1]) - n[0][1], o = e.invertY(t[1][1]) - n[1][1];
	return e.translate(i > r ? (r + i) / 2 : Math.min(0, r) || Math.max(0, i), o > a ? (a + o) / 2 : Math.min(0, a) || Math.max(0, o));
}
function Io() {
	var e = Ao, t = jo, n = Fo, r = No, i = Po, a = [0, Infinity], o = [[-Infinity, -Infinity], [Infinity, Infinity]], s = 250, c = lr, l = b("start", "zoom", "end"), u, d, f, p = 500, m = 150, h = 0, g = 10;
	function _(e) {
		e.property("__zoom", Mo).on("wheel.zoom", T, { passive: !1 }).on("mousedown.zoom", E).on("dblclick.zoom", D).filter(i).on("touchstart.zoom", O).on("touchmove.zoom", k).on("touchend.zoom touchcancel.zoom", A).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	}
	_.transform = function(e, t, n, r) {
		var i = e.selection ? e.selection() : e;
		i.property("__zoom", Mo), e === i ? i.interrupt().each(function() {
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
			return n(Eo.translate(c[0], c[1]).scale(s.k).translate(typeof r == "function" ? -r.apply(this, arguments) : -r, typeof i == "function" ? -i.apply(this, arguments) : -i), e, o);
		}, a, s);
	};
	function v(e, t) {
		return t = Math.max(a[0], Math.min(a[1], t)), t === e.k ? e : new To(t, e.x, e.y);
	}
	function y(e, t, n) {
		var r = t[0] - n[0] * e.k, i = t[1] - n[1] * e.k;
		return r === e.x && i === e.y ? e : new To(e.k, r, i);
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
					e = new To(n, l[0] - t[0] * n, l[1] - t[1] * n);
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
			var t = W(this.that).datum();
			l.call(e, this.that, new wo(e, {
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
		var s = C(this, i).event(t), c = this.__zoom, l = Math.max(a[0], Math.min(a[1], c.k * 2 ** r.apply(this, arguments))), u = Pt(t);
		if (s.wheel) (s.mouse[0][0] !== u[0] || s.mouse[0][1] !== u[1]) && (s.mouse[1] = c.invert(s.mouse[0] = u)), clearTimeout(s.wheel);
		else if (c.k === l) return;
		else s.mouse = [u, c.invert(u)], Rr(this), s.start();
		ko(t), s.wheel = setTimeout(d, m), s.zoom("mouse", n(y(v(c, l), s.mouse[0], s.mouse[1]), s.extent, o));
		function d() {
			s.wheel = null, s.end();
		}
	}
	function E(t, ...r) {
		if (f || !e.apply(this, arguments)) return;
		var i = t.currentTarget, a = C(this, r, !0).event(t), s = W(t.view).on("mousemove.zoom", d, !0).on("mouseup.zoom", p, !0), c = Pt(t, i), l = t.clientX, u = t.clientY;
		zt(t.view), Oo(t), a.mouse = [c, this.__zoom.invert(c)], Rr(this), a.start();
		function d(e) {
			if (ko(e), !a.moved) {
				var t = e.clientX - l, r = e.clientY - u;
				a.moved = t * t + r * r > h;
			}
			a.event(e).zoom("mouse", n(y(a.that.__zoom, a.mouse[0] = Pt(e, i), a.mouse[1]), a.extent, o));
		}
		function p(e) {
			s.on("mousemove.zoom mouseup.zoom", null), Bt(e.view, a.moved), ko(e), a.event(e).end();
		}
	}
	function D(r, ...i) {
		if (e.apply(this, arguments)) {
			var a = this.__zoom, c = Pt(r.changedTouches ? r.changedTouches[0] : r, this), l = a.invert(c), u = a.k * (r.shiftKey ? .5 : 2), d = n(y(v(a, u), c, l), t.apply(this, i), o);
			ko(r), s > 0 ? W(this).transition().duration(s).call(S, d, c, r) : W(this).call(_.transform, d, c, r);
		}
	}
	function O(t, ...n) {
		if (e.apply(this, arguments)) {
			var r = t.touches, i = r.length, a = C(this, n, t.changedTouches.length === i).event(t), o, s, c, l;
			for (Oo(t), s = 0; s < i; ++s) c = r[s], l = Pt(c, this), l = [
				l,
				this.__zoom.invert(l),
				c.identifier
			], a.touch0 ? !a.touch1 && a.touch0[2] !== l[2] && (a.touch1 = l, a.taps = 0) : (a.touch0 = l, o = !0, a.taps = 1 + !!u);
			u &&= clearTimeout(u), o && (a.taps < 2 && (d = l[0], u = setTimeout(function() {
				u = null;
			}, p)), Rr(this), a.start());
		}
	}
	function k(e, ...t) {
		if (this.__zooming) {
			var r = C(this, t).event(e), i = e.changedTouches, a = i.length, s, c, l, u;
			for (ko(e), s = 0; s < a; ++s) c = i[s], l = Pt(c, this), r.touch0 && r.touch0[2] === c.identifier ? r.touch0[0] = l : r.touch1 && r.touch1[2] === c.identifier && (r.touch1[0] = l);
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
			for (Oo(e), f && clearTimeout(f), f = setTimeout(function() {
				f = null;
			}, p), a = 0; a < i; ++a) o = r[a], n.touch0 && n.touch0[2] === o.identifier ? delete n.touch0 : n.touch1 && n.touch1[2] === o.identifier && delete n.touch1;
			if (n.touch1 && !n.touch0 && (n.touch0 = n.touch1, delete n.touch1), n.touch0) n.touch0[1] = this.__zoom.invert(n.touch0[0]);
			else if (n.end(), n.taps === 2 && (o = Pt(o, this), Math.hypot(d[0] - o[0], d[1] - o[1]) < g)) {
				var s = W(this).on("dblclick.zoom");
				s && s.apply(this, arguments);
			}
		}
	}
	return _.wheelDelta = function(e) {
		return arguments.length ? (r = typeof e == "function" ? e : Co(+e), _) : r;
	}, _.filter = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : Co(!!t), _) : e;
	}, _.touchable = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : Co(!!e), _) : i;
	}, _.extent = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : Co([[+e[0][0], +e[0][1]], [+e[1][0], +e[1][1]]]), _) : t;
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
var Lo = {
	graphContainer: "_graphContainer_1l2py_3",
	flowSingleDot: "_flowSingleDot_1l2py_1"
}, Ro = /* @__PURE__ */ h(((e, t) => {
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
})), zo = (/* @__PURE__ */ h(((e, t) => {
	var { hashString: n, rng: r } = Ro(), i = (e) => (Math.round(e * 10) / 10).toString();
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
})))(), q = {
	card: "_card_15bov_5",
	draft: "_draft_15bov_24",
	published: "_published_15bov_28",
	pinned: "_pinned_15bov_32",
	title: "_title_15bov_40",
	titleCentered: "_titleCentered_15bov_51",
	titleInline: "_titleInline_15bov_67",
	preview: "_preview_15bov_77",
	scroll: "_scroll_15bov_87",
	full: "_full_15bov_103",
	popout: "_popout_15bov_120",
	imageCard: "_imageCard_15bov_139",
	imageFrame: "_imageFrame_15bov_150",
	imageCaption: "_imageCaption_15bov_167",
	scrollFull: "_scrollFull_15bov_178",
	titleScrolling: "_titleScrolling_15bov_182",
	imageMark: "_imageMark_15bov_194",
	bookmarkMark: "_bookmarkMark_15bov_208",
	bookmarkCount: "_bookmarkCount_15bov_227",
	readersMark: "_readersMark_15bov_236",
	glow: "_glow_15bov_258",
	cardTitle: "_cardTitle_15bov_268",
	resizeGrip: "_resizeGrip_15bov_274",
	cardCenter: "_cardCenter_15bov_318",
	cardSubtitle: "_cardSubtitle_15bov_338",
	readBar: "_readBar_15bov_384",
	readFill: "_readFill_15bov_395",
	readMark: "_readMark_15bov_402",
	complete: "_complete_15bov_412",
	sketchBorder: "_sketchBorder_15bov_422",
	sketchMain: "_sketchMain_15bov_435",
	sketchGhost: "_sketchGhost_15bov_436",
	linkCard: "_linkCard_15bov_463",
	linkHover: "_linkHover_15bov_471",
	linkTitle: "_linkTitle_15bov_475",
	linkSubtitle: "_linkSubtitle_15bov_482",
	linkBlurb: "_linkBlurb_15bov_489",
	linkOut: "_linkOut_15bov_499"
}, Bo = {
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
}, Vo = 140, Ho = 80, Uo = 700, Wo = 700;
function Go({ width: e, height: t, zoomScale: n = 1, onResize: i, onResizeEnd: a }) {
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
			t.includes("e") && (d = a + c), t.includes("w") && (d = a - c), t.includes("s") && (f = o + l), t.includes("n") && (f = o - l), d = Math.max(Vo, Math.min(Uo, Math.round(d))), f = Math.max(Ho, Math.min(Wo, Math.round(f))), i && i({
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
		className: o ? Bo.resizing : void 0,
		children: [
			/* @__PURE__ */ p("div", {
				className: `${Bo.handle} ${Bo.handleN}`,
				onPointerDown: (e) => d("n", e),
				title: "Drag to resize height"
			}),
			/* @__PURE__ */ p("div", {
				className: `${Bo.handle} ${Bo.handleS}`,
				onPointerDown: (e) => d("s", e),
				title: "Drag to resize height"
			}),
			/* @__PURE__ */ p("div", {
				className: `${Bo.handle} ${Bo.handleW}`,
				onPointerDown: (e) => d("w", e),
				title: "Drag to resize width"
			}),
			/* @__PURE__ */ p("div", {
				className: `${Bo.handle} ${Bo.handleE}`,
				onPointerDown: (e) => d("e", e),
				title: "Drag to resize width"
			}),
			/* @__PURE__ */ p("div", {
				className: `${Bo.handle} ${Bo.handleNW}`,
				onPointerDown: (e) => d("nw", e),
				title: "Drag to resize"
			}),
			/* @__PURE__ */ p("div", {
				className: `${Bo.handle} ${Bo.handleNE}`,
				onPointerDown: (e) => d("ne", e),
				title: "Drag to resize"
			}),
			/* @__PURE__ */ p("div", {
				className: `${Bo.handle} ${Bo.handleSW}`,
				onPointerDown: (e) => d("sw", e),
				title: "Drag to resize"
			}),
			/* @__PURE__ */ p("div", {
				className: `${Bo.handle} ${Bo.handleSE}`,
				onPointerDown: (e) => d("se", e),
				title: "Drag to resize"
			})
		]
	});
}
//#endregion
//#region src/components/NodeView/TextView/TextView.jsx
var Ko = (/* @__PURE__ */ h(((e, t) => {
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
})))(), qo = /* @__PURE__ */ new Map();
function Jo(e, t, n, r) {
	let i = `${e}|${Math.round(t)}|${Math.round(n)}|${r}`, a = qo.get(i);
	return a || (qo.size > 400 && qo.clear(), a = (0, zo.roughRect)(t, n, r, e), qo.set(i, a)), a;
}
function Yo({ article: e, width: t, height: n, viewState: r, fullContent: i, onResize: a, cardSettings: o, sourceColor: s }) {
	let { hovered: c = !1, pinned: l = !1, lod: u = "full", zoomScale: d = 1 } = r || {}, f = c || l, h = l && !!i, g = !(e._status === "published" || e._status === "bloomed" || e.syndication && e.syndication.canonical), _ = e.containerColor || s || e._source && e._source.color || (g ? "var(--nv-draft)" : "var(--nv-published)"), v = r?.contributionCount || 0, y = r?.bookmarkCount ?? (Array.isArray(r?.bookmarks) ? r.bookmarks.length : Array.isArray(e?.bookmarks) ? e.bookmarks.length : 0);
	if (e.kind === "image" && e.image) return /* @__PURE__ */ p(es, {
		article: e,
		width: t,
		height: n,
		pinned: l,
		hovered: c,
		isDraft: g,
		zoomScale: d,
		bookmarkCount: y,
		onResize: a
	});
	let b = (e._source && e._source.prominence || e.originalItem && e.originalItem._source && e.originalItem._source.prominence || "secondary") === "primary" ? g ? "#24304a" : "#1e3a5f" : "#23232f";
	if (e.kind === "link" && e.link) return /* @__PURE__ */ p($o, {
		article: e,
		width: t,
		height: n,
		viewState: r,
		cardSettings: o,
		sourceColor: _,
		isDraft: g,
		bgColor: b
	});
	let x = !!e.image, S = r && r.progress, C = S ? Math.max(0, Math.min(1, S.max || 0)) : 0, w = !!(S && S.done), T = [
		q.card,
		w && q.complete,
		_ && !l && q.glow,
		g ? q.draft : q.published,
		f && q.expanded,
		l && q.pinned
	].filter(Boolean).join(" "), E = o?.cornerRadius == null ? 10 : o.cornerRadius, D = !t || !n ? null : Jo(e.id || e.title || "", t, n, E);
	return /* @__PURE__ */ m("div", {
		className: T,
		"data-pp-card": !0,
		style: {
			width: t,
			height: n,
			background: b,
			...o?.cornerRadius == null ? {} : { borderRadius: o.cornerRadius },
			..._ && !l ? { "--nv-src": _ } : {},
			..._ && !l && e.containerColor ? { "--nv-outline": `var(--pp-node-color, ${_})` } : {}
		},
		children: [
			D && /* @__PURE__ */ m("svg", {
				className: q.sketchBorder,
				viewBox: `0 0 ${t} ${n}`,
				preserveAspectRatio: "none",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ p("path", {
					className: q.sketchGhost,
					d: D.ghost
				}), /* @__PURE__ */ p("path", {
					className: q.sketchMain,
					d: D.main
				})]
			}),
			y > 0 && /* @__PURE__ */ m("div", {
				className: q.bookmarkMark,
				title: y === 1 ? "1 bookmark" : `${y} bookmarks`,
				children: [/* @__PURE__ */ p("svg", {
					viewBox: "0 0 16 16",
					width: "12",
					height: "12",
					fill: "currentColor",
					children: /* @__PURE__ */ p("path", { d: "M3 2v12l5-3 5 3V2z" })
				}), y > 1 && /* @__PURE__ */ p("span", {
					className: q.bookmarkCount,
					children: y
				})]
			}),
			v > 0 && /* @__PURE__ */ m("div", {
				className: q.readersMark,
				title: v === 1 ? "1 from readers" : `${v} from readers`,
				"aria-label": v === 1 ? "1 from readers" : `${v} from readers`,
				"data-contrib-count": v,
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
				}), /* @__PURE__ */ p("span", { children: v })]
			}),
			x && /* @__PURE__ */ p("div", {
				className: q.imageMark,
				style: {
					backgroundImage: `url('${e.image}')`,
					...o?.imageMarkSize ? {
						width: o.imageMarkSize,
						height: o.imageMarkSize
					} : {}
				},
				title: "has an image"
			}),
			/* @__PURE__ */ p(Qo, {
				article: e,
				width: t,
				height: n - 0,
				bandHeight: 0,
				viewState: r,
				expanded: f,
				useFullArticle: h,
				fullContent: i,
				cardSettings: o
			}),
			(C > 0 || w) && /* @__PURE__ */ p("div", {
				className: q.readBar,
				role: "progressbar",
				"aria-label": "Read",
				"aria-valuemin": 0,
				"aria-valuemax": 100,
				"aria-valuenow": Math.round((w ? 1 : C) * 100),
				"data-read-progress": w ? "done" : Math.round(C * 100),
				children: /* @__PURE__ */ p("div", {
					className: q.readFill,
					style: { width: `${(w ? 1 : C) * 100}%` }
				})
			}),
			w && /* @__PURE__ */ p("div", {
				className: q.readMark,
				title: "Read to the end",
				"aria-hidden": "true",
				children: "✓"
			}),
			l && /* @__PURE__ */ p(ts, {}),
			a && /* @__PURE__ */ p(Go, {
				width: t,
				height: n,
				zoomScale: d,
				onResize: a
			})
		]
	});
}
function Xo(e, t, n, r = {}) {
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
var Zo = 260;
function Qo({ article: e, width: t, height: n, bandHeight: r = 0, viewState: i, expanded: a, useFullArticle: o, fullContent: s, cardSettings: c }) {
	if (a) {
		let t = o ? s : e.description || "", r = e.title || e.label;
		return n && n < Zo ? /* @__PURE__ */ m("div", {
			className: `${q.scroll} ${q.scrollFull} ${o ? q.full : ""} rp-scroll`,
			children: [/* @__PURE__ */ p("div", {
				className: q.titleScrolling,
				"data-card-title": !0,
				children: r
			}), t && /* @__PURE__ */ p("div", { dangerouslySetInnerHTML: { __html: t } })]
		}) : /* @__PURE__ */ m(f, { children: [/* @__PURE__ */ p("div", {
			className: q.title,
			"data-card-title": !0,
			children: r
		}), t && /* @__PURE__ */ p("div", {
			className: `${q.scroll} ${o ? q.full : ""} rp-scroll`,
			dangerouslySetInnerHTML: { __html: t }
		})] });
	}
	let l = c?.subtitle || typeof window < "u" && window.SETTINGS?.graph?.card?.subtitle, u = null;
	if (l && e.series_part != null && e.series_part !== "") {
		let t = e.series_part, n = (0, Ko.numberToLowercaseWords)(t);
		u = l.replace(/\{n\}/g, String(t)).replace(/\{n_words\}/g, n);
	}
	let d = i.lod === "slug" ? e.label || e.labelMedium || e.title || "" : e.title || e.label, h = Xo(d, t, u ? n - 30 : n, {
		min: c?.labelMinFontSize ?? 14,
		max: c?.labelMaxFontSize ?? 26,
		lineHeight: 1.05,
		pad: 8
	}), g = Math.max(11, Math.round(h * .62));
	return /* @__PURE__ */ m("div", {
		className: q.cardCenter,
		children: [/* @__PURE__ */ p("div", {
			className: q.cardTitle,
			style: { fontSize: `${h}px` },
			"data-card-title": !0,
			children: d
		}), u && /* @__PURE__ */ p("div", {
			className: q.cardSubtitle,
			style: { fontSize: `${g}px` },
			children: u
		})]
	});
}
function $o({ article: e, width: t, height: n, viewState: r, cardSettings: i, sourceColor: a, isDraft: o, bgColor: s }) {
	let c = i?.cornerRadius == null ? 10 : i.cornerRadius, l = !t || !n ? null : Jo(e.id || e.title || "", t, n, c), u = e.title || e.label || "", d = e.description || "", f = e.subtitle || "", h = Xo(u, t, Math.max(30, (n || 0) * (d ? .42 : .8)), {
		min: Math.min(13, i?.labelMinFontSize ?? 13),
		max: Math.min(20, i?.labelMaxFontSize ?? 20),
		lineHeight: 1.1,
		pad: 8
	});
	return /* @__PURE__ */ m("div", {
		className: [
			q.card,
			o ? q.draft : q.published,
			q.linkCard,
			a && q.glow,
			r.hovered && q.linkHover
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
				className: q.sketchBorder,
				viewBox: `0 0 ${t} ${n}`,
				preserveAspectRatio: "none",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ p("path", {
					className: q.sketchGhost,
					d: l.ghost
				}), /* @__PURE__ */ p("path", {
					className: q.sketchMain,
					d: l.main
				})]
			}),
			/* @__PURE__ */ p("div", {
				className: q.linkTitle,
				style: { fontSize: `${h}px` },
				"data-link-title": !0,
				children: u
			}),
			f && /* @__PURE__ */ p("div", {
				className: q.linkSubtitle,
				"data-link-subtitle": !0,
				children: f
			}),
			d && /* @__PURE__ */ p("div", {
				className: q.linkBlurb,
				"data-link-blurb": !0,
				children: d
			}),
			/* @__PURE__ */ p("span", {
				className: q.linkOut,
				"data-link-out": !0,
				"aria-hidden": "true",
				children: "↗"
			})
		]
	});
}
function es({ article: e, width: t, height: n, pinned: r, hovered: i, isDraft: a, zoomScale: o, bookmarkCount: s = 0, onResize: c }) {
	let l = [
		q.imageCard,
		a ? q.draft : q.published,
		r && q.pinned
	].filter(Boolean).join(" "), u = n - 24;
	return /* @__PURE__ */ m("div", {
		className: l,
		style: {
			width: t,
			height: n
		},
		children: [
			s > 0 && /* @__PURE__ */ m("div", {
				className: q.bookmarkMark,
				title: s === 1 ? "1 bookmark" : `${s} bookmarks`,
				children: [/* @__PURE__ */ p("svg", {
					viewBox: "0 0 16 16",
					width: "12",
					height: "12",
					fill: "currentColor",
					children: /* @__PURE__ */ p("path", { d: "M3 2v12l5-3 5 3V2z" })
				}), s > 1 && /* @__PURE__ */ p("span", {
					className: q.bookmarkCount,
					children: s
				})]
			}),
			/* @__PURE__ */ p("div", {
				className: q.imageFrame,
				style: {
					width: t,
					height: u,
					backgroundImage: `url('${e.image}')`
				}
			}),
			/* @__PURE__ */ p("div", {
				className: q.imageCaption,
				"data-card-title": !0,
				children: e.short_title || e.title || e.label
			}),
			r && /* @__PURE__ */ p(ts, {}),
			c && /* @__PURE__ */ p(Go, {
				width: t,
				height: n,
				zoomScale: o,
				onResize: c
			})
		]
	});
}
function ts() {
	return /* @__PURE__ */ p("div", {
		"data-popout": "1",
		title: "Open in reader",
		className: q.popout,
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
var ns = {
	text: Yo,
	essay: Yo,
	fragment: Yo,
	multi: Yo,
	image: Yo,
	"podcast-episode": Yo,
	video: Yo,
	link: Yo
};
function rs(e, t = {}) {
	return {
		...ns,
		...t
	}[e] || Yo;
}
//#endregion
//#region src/components/GraphViewer/layouts.js
var is = /* @__PURE__ */ h(((e, t) => {
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
})), as = /* @__PURE__ */ h(((e, t) => {
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
})), os = /* @__PURE__ */ h(((e, t) => {
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
})), ss = /* @__PURE__ */ h(((e, t) => {
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
})), cs = /* @__PURE__ */ h(((e, t) => {
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
})), ls = /* @__PURE__ */ h(((e, t) => {
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
})), us = /* @__PURE__ */ h(((e, t) => {
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
})), ds = /* @__PURE__ */ h(((e, t) => {
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
})), fs = /* @__PURE__ */ h(((e, t) => {
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
})), ps = /* @__PURE__ */ h(((e, t) => {
	var { zoomAbout: n, fitRatioAbout: r } = fs();
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
})), ms = /* @__PURE__ */ h(((e, t) => {
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
})), hs = /* @__PURE__ */ h(((e, t) => {
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
})), gs = /* @__PURE__ */ h(((e, t) => {
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
})), _s = /* @__PURE__ */ h(((e, t) => {
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
})), vs = /* @__PURE__ */ h(((e, t) => {
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
})), ys = /* @__PURE__ */ h(((e, t) => {
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
})), bs = /* @__PURE__ */ h(((e, t) => {
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
})), xs = /* @__PURE__ */ h(((e, t) => {
	var n = [
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
	], r = [
		"linkDistance",
		"chargeStrength",
		"collidePadding"
	];
	function i(e, t) {
		let n = {};
		if (!e || typeof e != "object") return n;
		for (let r of t) e[r] !== void 0 && e[r] !== null && (n[r] = e[r]);
		return n;
	}
	function a(e) {
		let t = i(e, n);
		return t.anchorEnd === "center" && delete t.anchorEnd, t.openTowards === "down" && delete t.openTowards, Number(t.cardScale) === 1 && delete t.cardScale, t;
	}
	function o(e) {
		if (!e || typeof e != "object") return null;
		let t = Object.keys(e).filter((t) => e[t] && Number.isFinite(Number(e[t].x)) && Number.isFinite(Number(e[t].y))).sort();
		return t.length ? t.map((t) => [
			t,
			Number(e[t].x),
			Number(e[t].y)
		]) : null;
	}
	function s(e) {
		if (!e || typeof e != "object") return null;
		let t = Object.keys(e).filter((t) => e[t] && Object.keys(e[t]).length).sort();
		return t.length ? t.map((t) => [t, e[t]]) : null;
	}
	function c(e, { anchors: t, layouts: n } = {}) {
		let c = e || {}, l = Number.isFinite(Number(c.layoutVersion)) && c.layoutVersion !== null && c.layoutVersion !== "" ? Number(c.layoutVersion) : 1, u = c.card || {}, d = {
			v: l,
			spiral: a(c.spiral),
			card: i(u, ["width", "height"]),
			sim: i(c.simulation, r)
		}, f = o(t);
		f && (d.anchors = f), c.containerLayout && (d.containerLayout = c.containerLayout), c.hang && typeof c.hang == "object" && (d.hang = i(c.hang, [
			"direction",
			"firstAt",
			"columns",
			"gap"
		])), c.hull && typeof c.hull == "object" && c.hull.padding != null && (d.hullPadding = c.hull.padding);
		let p = s(n);
		return p && (d.layouts = p), JSON.stringify(d);
	}
	function l(e) {
		let t = 2166136261;
		for (let n = 0; n < e.length; n += 1) t ^= e.charCodeAt(n), t = Math.imul(t, 16777619) >>> 0;
		return t.toString(36);
	}
	function u(e, t, n) {
		return `${e}@${l(c(t, n))}`;
	}
	t.exports = {
		layoutKey: u,
		layoutSignature: c
	};
})), Ss = /* @__PURE__ */ h(((e, t) => {
	var { rootShape: n, rng: r, hashString: i } = Ro(), a = {
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
})), Cs = /* @__PURE__ */ h(((e, t) => {
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
})), ws = /* @__PURE__ */ h(((e, t) => {
	var { TIMES_OF_DAY: n, sceneMonth: r } = Cs(), i = {
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
})), Ts = /* @__PURE__ */ h(((e, t) => {
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
})), Es = /* @__PURE__ */ h(((e, t) => {
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
})), Ds = /* @__PURE__ */ h(((e, t) => {
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
})), Os = /* @__PURE__ */ h(((e, t) => {
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
})), ks = /* @__PURE__ */ h(((e, t) => {
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
})), As = /* @__PURE__ */ h(((e, t) => {
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
})), js = /* @__PURE__ */ h(((e, t) => {
	var n = .32;
	function r(e, t = n) {
		let r = e.deltaMode === 1 ? .05 : e.deltaMode ? 1 : .002, i = -e.deltaY * r * (e.ctrlKey ? 10 : 1);
		return Number.isFinite(i) ? Math.max(-t, Math.min(t, i)) : 0;
	}
	t.exports = {
		wheelDelta: r,
		WHEEL_STEP_MAX: n
	};
})), Ms = /* @__PURE__ */ h(((e, t) => {
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
})), Ns = /* @__PURE__ */ h(((e, t) => {
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
})), Ps = /* @__PURE__ */ h(((e, t) => {
	var { wrapText: n, provenanceLines: r } = Ns(), i = [
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
})), Fs = /* @__PURE__ */ h(((e, t) => {
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
})), Is = /* @__PURE__ */ h(((e, t) => {
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
})), Ls = /* @__PURE__ */ h(((e, t) => {
	function n(e) {
		return e.url.split("/").pop().replace(".html", "");
	}
	var { containerOfTag: r } = Fs();
	function i(e) {
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
	function a(e, t = {}) {
		let a = [], s = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Set();
		for (let t of e) s.set(n(t), t.id), t && t.id && c.add(t.id);
		let l = (e) => s.get(e) || e, u = t.containment || [], d = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map();
		for (let e of u) e.tag && d.set(e.tag, e), typeof e.concept == "string" && e.concept && !f.has(e.concept) && f.set(e.concept, e);
		for (let e of u) e.parent && a.push({
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
		let p = /* @__PURE__ */ new Map();
		for (let t of e) {
			let e = t.id;
			for (let n of t.connected_to || []) a.push({
				source: e,
				target: l(n),
				directed: !0,
				role: "connected_to",
				layer: "authored",
				attrs: { resolved: s.has(n) }
			});
			let n = [];
			for (let i of t.tags || []) {
				let o = r(t, i, d, f);
				if (o) n.includes(o) || n.push(o);
				else {
					let n = {
						source: e,
						target: `tag:${i}`,
						directed: !1,
						role: "tagged",
						layer: "tag"
					}, r = Array.isArray(t._references) ? t._references.find((e) => e && e.type === "tag" && e.value === i) : null;
					r && r.concept !== void 0 && r.weight !== void 0 && r.origin !== void 0 && (n.attrs = {
						concept: r.concept,
						weight: r.weight,
						origin: r.origin
					}, r.why !== void 0 && r.why !== null && (n.attrs.why = r.why), r.wasDerivedFrom !== void 0 && r.wasDerivedFrom !== null && (n.attrs.wasDerivedFrom = r.wasDerivedFrom), r.wasGeneratedBy !== void 0 && r.wasGeneratedBy !== null && (n.attrs.wasGeneratedBy = r.wasGeneratedBy), typeof r.sourceRatio == "number" && Number.isFinite(r.sourceRatio) && (n.attrs.sourceRatio = r.sourceRatio)), a.push(n);
				}
			}
			if (n.length > 0) {
				let t = new Set(n.map((e) => e.parent).filter(Boolean)), r = n.filter((e) => !t.has(e.id))[0] || n[0];
				a.push({
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
			for (let n of t.topology || []) a.push({
				source: e,
				target: `topology:${n}`,
				directed: !1,
				role: "exhibits",
				layer: "topology"
			});
			for (let n of i(t)) {
				let t = s.has(n.value) ? s.get(n.value) : c.has(n.value) || n.value.startsWith(`${n.type}:`) ? n.value : `${n.type}:${n.value}`, r = {
					type: n.type,
					value: n.value,
					weight: n.weight
				};
				n.label !== void 0 && (r.label = n.label), n.origin !== void 0 && (r.origin = n.origin), n.concept !== void 0 && (r.concept = n.concept), n.why !== void 0 && (r.why = n.why), n.wasDerivedFrom !== void 0 && (r.wasDerivedFrom = n.wasDerivedFrom), n.wasGeneratedBy !== void 0 && (r.wasGeneratedBy = n.wasGeneratedBy), n.sourceRatio !== void 0 && (r.sourceRatio = n.sourceRatio), a.push({
					source: e,
					target: t,
					directed: !!n.directed,
					role: n.role || n.type,
					layer: n.layer || "reference",
					attrs: r
				});
			}
			t.series && (p.has(t.series) || p.set(t.series, []), p.get(t.series).push(t));
		}
		for (let [e, t] of p) {
			t.sort((e, t) => (Number(e.series_part) || 0) - (Number(t.series_part) || 0));
			for (let n = 0; n < t.length - 1; n++) a.push({
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
		return o(a);
	}
	function o(e) {
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
	function s(e) {
		if (!e) return "";
		if (e.label) return e.label;
		if (e.attrs && e.attrs.label) return e.attrs.label;
		let t = e.attrs && typeof e.attrs.type == "string" && e.attrs.type || e.role || e.layer || "reference", n = e.attrs && typeof e.attrs.weight == "number" && Number.isFinite(e.attrs.weight) ? e.attrs.weight : 1;
		return `${t}${n === 1 ? "" : ` (${n})`}${e.attrs && typeof e.attrs.why == "string" && e.attrs.why ? `\n${e.attrs.why}` : ""}`;
	}
	t.exports = {
		buildEdges: a,
		slugOf: n,
		nonTagReferences: i,
		referenceEdgeLabel: s
	};
})), Rs = is(), zs = as(), Bs = os(), Vs = ss(), Hs = cs(), Us = ls(), Ws = us(), Gs = ds(), Ks = fs(), qs = ps(), Js = ms(), Ys = hs(), Xs = gs(), Zs = _s(), Qs = vs(), $s = ys(), ec = bs(), tc = Ro(), nc = xs(), rc = Ss(), ic = ws(), ac = Ts(), oc = Es(), sc = Ds(), cc = Os(), lc = ks(), uc = As(), dc = js(), fc = Ms(), pc = Ps(), mc = Ns(), hc = Fs(), gc = Is(), _c = Ls(), vc = () => typeof window < "u" ? window.SETTINGS : null;
function yc(e, t = {}) {
	let n = [], r = [], i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map(), s = new Set(t.visibleLayers || ["sequence"]), c = t.tagColor || "#f39c12", l = t.topologyColor || "#9b59b6", u = t.placeholderColor || "#7f8c8d", d = /* @__PURE__ */ new Map(), f = e._rtagz && Array.isArray(e._rtagz.concepts) ? e._rtagz.concepts : [];
	for (let e of f) e && typeof e.id == "string" && e.ledger && typeof e.ledger.previousLabel == "string" && e.ledger.previousLabel && d.set(e.id, e.ledger.previousLabel);
	let p = /* @__PURE__ */ new Map();
	for (let t of e._sources || []) t && t.id && Number(t.cardScale) > 0 && p.set(t.id, Number(t.cardScale));
	for (let r of e.items) {
		let i = r.url.split("/").pop().replace(".html", "");
		o.set(r.id, i), a.add(i);
		let s = null, c = e.containers || t.containment || [];
		for (let e of c) if (e.parent && e.tag && (0, hc.containerHas)(e, r)) {
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
			tags: r.tags || [],
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
			link: (0, oc.isLinkItem)(r) ? (0, oc.linkOf)(r) : "",
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
	for (let t of e.items) for (let e of (0, _c.nonTagReferences)(t)) {
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
		if ((0, pc.isRelationEdge)(e)) {
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
		let p = e.attrs && typeof e.attrs.weight == "number" && Number.isFinite(e.attrs.weight) ? e.attrs.weight : 1, _ = e.layer === "tag" ? (0, mc.tagEdgeLabel)(e) : n ? (0, _c.referenceEdgeLabel)(e) : e.label || e.attrs && e.attrs.label || e.role || e.layer, v = {
			source: o,
			target: f,
			directed: !!e.directed,
			role: e.role,
			layer: e.layer,
			label: _,
			weight: p
		};
		if (t && (v.refType = t), e.attrs && (v.attrs = e.attrs), e.layer === "tag" && e.attrs) {
			let t = (0, gc.ratioOf)(e.attrs.sourceRatio);
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
	return {
		nodes: n,
		links: r,
		containmentEdges: h,
		containers: S,
		relations: g
	};
}
function bc(e) {
	let t = 0, n = 0, r = 0;
	for (let i of e || []) !i || !Number.isFinite(i.x) || !Number.isFinite(i.y) || (t += 1, n += i.x, r += i.y);
	return t ? {
		x: n / t,
		y: r / t
	} : null;
}
function xc(e, t) {
	let n = e && e._source;
	return n && (t && t(n.id) || n.color) || null;
}
function Sc(e) {
	let t = /* @__PURE__ */ new Map();
	return e.selectAll(".node").each((e) => {
		e && t.set(e.id, e);
	}), t;
}
function Cc(e, t) {
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
function wc(e, t = null) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) r.link._dupByGroup || t && !t.pairs.has((0, gc.pairKey)(r.piece, r.bubble)) || (n.has(r.bubble) || n.set(r.bubble, []), n.get(r.bubble).push(r.pieceNode));
	return n;
}
function Tc(e, t, n, r) {
	let i = e.selectAll(".node").filter((e) => !!(e && e.type === "tag" && !e._groupedInto));
	if (i.empty()) return;
	let a = null;
	typeof getComputedStyle == "function" && (a = getComputedStyle(e.node()).getPropertyValue("--gv-tag-color").trim() || null), i.select("rect").attr("fill", (e) => (0, uc.blendColors)((t.get(e.id) || []).filter((e) => !n(e)).map((e) => ({
		color: xc(e, r),
		weight: 1
	})), a || e.color) || "var(--gv-tag-color)");
}
function Ec(e, t = {}) {
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
function Dc(e, t, n, r, i, a = null) {
	let o = (e) => !!(e && e.type === "article" && e._source && n.has(e._source.id)), s = Sc(e), c = Cc(e.selectAll(".link").data(), s), l = a == null ? null : (0, gc.shownAt)(c, a), u = wc(c, l), d = new Set(l ? l.hiddenBubbles : []);
	for (let [e, t] of u) t.length && t.every(o) && d.add(e);
	let f = [];
	for (let e of s.values()) e.type === "tag" && !e._groupedInto && !(l && l.hiddenBubbles.has(e.id)) && f.push(e.id);
	let p = (0, fc.pieceCounts)(u, f), m = 0;
	for (let e of p.values()) e > m && (m = e);
	for (let e of (0, fc.tagsBelow)(p, (0, fc.clampMinPieces)(i, m))) d.add(e);
	let h = {};
	for (let e of s.values()) {
		if (e.type !== "tag") continue;
		let t = e._groupedInto || e.id;
		h[e.id] = l && l.hiddenTags.has(e.id) ? 0 : p.get(t) || 0;
	}
	Ec(p, h);
	let g = /* @__PURE__ */ new Set();
	if (l) for (let e of c) l.pairs.has((0, gc.pairKey)(e.piece, e.bubble)) || g.add(e.link);
	let _ = (e) => !!(e && (e._closedHidden || e._groupedInto || o(e) || e.type === "tag" && d.has(e.id)));
	e.selectAll(".node").style("display", (e) => _(e) ? "none" : null), t.selectAll(".node-card").style("display", (e) => _(e) ? "none" : null), e.selectAll(".link, .link-hit").style("display", (e) => {
		let t = typeof e.source == "object" ? e.source : s.get(e.source), n = typeof e.target == "object" ? e.target : s.get(e.target);
		return e._dupByGroup || g.has(e) || _(t) || _(n) ? "none" : null;
	}), Tc(e, u, o, r);
}
function Oc(e, t, n, r = null) {
	if (!n) {
		t.selectAll(".node-card").classed("dimmed", !1), e.selectAll(".node").classed("dimmed", !1), e.selectAll(".link").classed("dimmed", !1);
		return;
	}
	t.selectAll(".node-card").classed("dimmed", (e) => !n.has(e.id));
	let i = Cc(e.selectAll(".link").data(), Sc(e)), a = wc(i, r == null ? null : (0, gc.shownAt)(i, r));
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
function kc(e) {
	let t = {};
	for (let n of e && e.containers || []) {
		let e = (0, rc.fraction)(n.anchor);
		e && (t[n.id] = e);
	}
	return t;
}
function Ac(e) {
	let t = {};
	for (let n of e && e.containers || []) {
		let e = {};
		n.layout && (e.layout = n.layout), n.hang && typeof n.hang == "object" && (e.hang = n.hang), n.spiral && typeof n.spiral == "object" && (e.spiral = n.spiral), (n.hull === !1 || n.hull && typeof n.hull == "object") && (e.hull = n.hull), Object.keys(e).length && (t[n.id] = e);
	}
	return t;
}
function jc(e) {
	return e && (e.labelPosition === "top" || e.labelPosition === "hidden") ? e.labelPosition : "center";
}
function Mc({ feedData: e, onNodeSelect: n, hiddenSources: i, filteredArticleIds: a, viewState: o, layout: l = "force", timeAxis: f, graphSettings: m, colorOverrides: h, apiRef: y, onNodeFocus: b, contributions: x }) {
	let S = m || {}, C = {
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
		...S.card || {}
	}, w = {
		fontSize: 22,
		padding: 11,
		maxWidth: 150,
		maxLines: 3,
		cornerRadius: 9,
		opacity: .7,
		...S.tag || {}
	}, T = {
		dock: "left",
		inset: 54,
		endPadding: 70,
		connectorOpacity: .45,
		connectorWidth: 1.6,
		spineOpacity: .55,
		spineWidth: 3,
		tickFontSize: 13,
		...S.timeAxis || {}
	}, E = {
		linkDistance: 160,
		chargeStrength: -500,
		collidePadding: 10,
		velocityDecay: .7,
		alphaDecay: .028,
		...S.simulation || {}
	}, D = (e) => {
		let t = e && e.hull && typeof e.hull == "object" ? Number(e.hull.padding) : NaN;
		if (Number.isFinite(t)) return t;
		let n = S.hull && typeof S.hull == "object" ? Number(S.hull.padding) : NaN;
		return Number.isFinite(n) ? n : (0, zs.containerLayoutOf)(e, S) === "hang" ? C.width / 2 : e && e.padding != null ? e.padding : e && e.parent ? 42 : 75;
	}, O = s(null), k = s(null), A = s(null), j = s(n);
	r(() => {
		j.current = n;
	}, [n]);
	let M = s(b);
	r(() => {
		M.current = b;
	}, [b]);
	let N = s(null), P = (e) => {
		N.current = e ? e.id : null, M.current && M.current(e ? e.originalItem || e : null);
	}, F = s(o);
	r(() => {
		F.current = o;
	}, [o]);
	let I = (e) => {
		let t = F.current;
		return t && typeof t.sourceColor == "function" && t.sourceColor(e) || null;
	}, L = () => {
		let e = F.current;
		return e && e.preference ? e.preference(fc.PREF) : null;
	}, ee = s(null);
	(!ee.current || ee.current.feed !== e) && (ee.current = {
		feed: e,
		range: (0, gc.ratioRange)(e)
	});
	let te = () => {
		let e = F.current;
		return (0, gc.clampRatio)(e && e.preference ? e.preference(gc.PREF) : null, ee.current.range);
	}, R = (0, $s.makeCardSizeFor)(C);
	C.glowPadding;
	let ne = s(null), z = s(l), re = s(!1), ie = s(null), B = s(null), ae = s(null), oe = s(null), se = s(null), ce = s(null), le = s(null), ue = s(null), de = s(x || []), fe = s(null), pe = s(null), me = (e) => e._groupKey || (e.type === "tag" && e.concept ? "concept:" + e.concept : e.originalItem && e.originalItem.id || e.id), he = s({
		settings: null,
		feed: null,
		keys: /* @__PURE__ */ new Map()
	}), ge = (t) => {
		let n = he.current;
		return (n.settings !== m || n.feed !== e) && (n.settings = m, n.feed = e, n.keys = /* @__PURE__ */ new Map()), n.keys.has(t) || n.keys.set(t, (0, nc.layoutKey)(t, m, {
			anchors: kc(e),
			layouts: Ac(e)
		}) + "::"), n.keys.get(t);
	}, _e = (e) => ge(z.current) + me(e), ve = s(/* @__PURE__ */ new Set()), ye = s(null), be = s(1), xe = s("full"), Se = s(/* @__PURE__ */ new Set()), Ce = s(null), V = s(null);
	r(() => {
		i instanceof Set ? Se.current = i : Array.isArray(i) ? Se.current = new Set(i) : Se.current = new Set((e && e._sources || []).filter((e) => e && e.defaultHidden).map((e) => e.id)), !(!k.current || !A.current) && (Dc(k.current, W(A.current), Se.current, I, L(), te()), pe.current && pe.current());
	}, [i, e]), r(() => {
		if (!(!O.current || !h)) for (let [e, t] of Object.entries(h)) t && O.current.style.setProperty(e, t);
	}, [h]);
	let [we, Te] = c(0);
	r(() => {
		if (!o) return;
		let e = o.historyVersion || 0;
		return o.subscribe(() => {
			let t = o.historyVersion || 0;
			t !== e && (e = t, Te(t));
		});
	}, [o]), r(() => {
		if (o) return o.subscribe(() => {
			if (ae.current && ae.current(), oe.current && oe.current(), fe.current && fe.current(), ce.current && ce.current(), se.current && se.current(), ue.current && ue.current(), k.current && A.current) {
				Dc(k.current, W(A.current), Se.current, I, L(), te());
				let e = te();
				Ce.current && e !== V.current && (V.current = e, Oc(k.current, W(A.current), Ce.current, e));
			}
			pe.current && pe.current();
		});
	}, [o]), r(() => {
		de.current = x || [], ae.current && ae.current(), fe.current && fe.current({ rebuild: !0 });
	}, [x]), r(() => {
		Ce.current = a || null, !(!k.current || !A.current) && (V.current = te(), Oc(k.current, W(A.current), a, V.current));
	}, [a]), r(() => {
		if (!e || !O.current) return;
		let n = O.current, r = n.clientWidth, i = n.clientHeight, a = getComputedStyle(n), o = yc(e, {
			tagColor: a.getPropertyValue("--gv-tag-color").trim() || "#f39c12",
			topologyColor: a.getPropertyValue("--gv-topology-color").trim() || "#9b59b6",
			placeholderColor: a.getPropertyValue("--gv-placeholder-color").trim() || "#7f8c8d",
			visibleLayers: Array.isArray(S.visibleLayers) ? S.visibleLayers : ["sequence"]
		}), s = (0, Zs.bindingsOf)(S), c = (e, t, n) => (0, Zs.resolve)(s, e, t, n), l = (0, Zs.isBound)(s, "node.resize");
		W(n).selectAll("svg").remove(), W(n).selectAll(".cards-layer").remove();
		let f = W(n).append("svg").attr("width", r).attr("height", i).style("position", "absolute").style("inset", "0").style("pointer-events", "all");
		k.current = f;
		let p = f.append("defs");
		p.append("marker").attr("id", "sequence-arrow").attr("viewBox", "0 0 10 10").attr("refX", 8).attr("refY", 5).attr("markerWidth", 7).attr("markerHeight", 7).attr("orient", "auto").append("path").attr("d", "M 0 1.5 L 8 5 L 0 8.5 z").attr("fill", "var(--gv-accent, #d4af37)"), p.append("marker").attr("id", "relation-arrow").attr("class", "relation-arrow").attr("viewBox", "0 0 10 10").attr("refX", 9).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11).attr("markerHeight", 11).attr("orient", "auto").append("path").attr("d", "M 0 1 L 10 5 L 0 9 z");
		let h = W(n).append("div").attr("class", "cards-layer").style("position", "absolute").style("left", "0").style("top", "0").style("width", "100%").style("height", "100%").style("pointer-events", "none");
		A.current = h.node();
		let b = h.append("div").attr("class", "cards-transform").style("transform-origin", "0 0").style("position", "absolute").style("left", "0").style("top", "0").style("width", "0").style("height", "0").style("overflow", "visible"), x = f.append("g"), T = !1, M = !!S.initialFocus && S.initialFocus !== "all", ee = S.initialFocusMinScale == null ? .4 : S.initialFocusMinScale, re = (0, Js.minCardScale)(S.initialScale, C.width), he = (0, Js.homeScale)(ee, S.initialScale, C.width), Ce = F.current && typeof F.current.rotation == "function" ? F.current.rotation() : 0, V = null, we = 0, Te = !1, Ee = !1, De = null, Oe = {
			x: 0,
			y: 0,
			k: 1
		}, ke = () => Ce ? ` rotate(${-Ce})` : "", Ae = (e) => (0, Gs.rotatedView)(e, V, Ce);
		function je(e) {
			Oe = Ae(e), x.attr("transform", `translate(${Oe.x},${Oe.y}) rotate(${Ce}) scale(${Oe.k})`), b && b.style("transform", `translate3d(${Oe.x}px, ${Oe.y}px, 0px) rotate(${Ce}deg) scale(${Oe.k})`), n && n.style.setProperty("--gv-unrot", `${-Ce}deg`), we !== Ce && (we = Ce, Te && Qi());
		}
		let Me = (e, t) => (0, Gs.viewToScreen)(Oe, Ce, e, t), Ne = Io().wheelDelta(dc.wheelDelta).on("zoom", (e) => {
			e.sourceEvent && (T = !0, M = !1), je(e.transform);
			let t = e.transform.k;
			be.current = t, Te && Fe && In() && Qi(), Te && ta(), Qr && ti(), pe.current && pe.current({ paintOnly: !0 }), B.current && B.current(), Te && fr();
			let n = (0, $s.getLOD)(t);
			n !== xe.current && (xe.current = n, Di(), Zi());
		}), Pe = (0, Ks.zoomPivotMode)(S) === "art", Fe = (0, qs.zoomModeOf)(S) === "grow-in-place", Ie = () => {
			if (!Pe || typeof window > "u") return null;
			let e = window.PostPipeCoverFrame;
			if (!e || !e.art || !e.zoomPivot) return null;
			let t = (0, rc.artPoint)(e.zoomPivot, e.art), n = O.current ? O.current.getBoundingClientRect() : {
				left: 0,
				top: 0
			}, r = window.PostPipeCover && window.PostPipeCover.shift || 0;
			return [t.x - n.left, t.y - (n.top - r)];
		};
		if (Pe || Fe) {
			let e = Ne.constrain();
			Ne.constrain((t, n, r) => {
				let i = Do(f.node());
				if (In()) {
					let e = Rn(), n = (0, qs.growConstrain)(i, t, e[0], e[1], Gn());
					t = Eo.translate(n.x, n.y).scale(n.k);
				} else {
					let e = Ie();
					if (e) {
						let n = (0, Ks.repivot)(i, t, e[0], e[1]);
						t = Eo.translate(n.x, n.y).scale(n.k);
					}
				}
				return e(t, n, r);
			}), Ne.interpolate(Yn);
		}
		if (c("space", "drag") !== "view.pan") {
			let e = Ne.constrain();
			Ne.constrain((t, n, r) => {
				let i = Do(f.node());
				return Math.abs(t.k - i.k) <= 1e-9 * i.k ? i : e(t, n, r);
			});
		}
		f.call(Ne).on("dblclick.zoom", null);
		let Le = (e) => {
			let t = e.touches[0], n = e.touches[1];
			return Math.atan2(n.clientY - t.clientY, n.clientX - t.clientX) * 180 / Math.PI;
		}, Re = (e) => {
			let t = n.getBoundingClientRect(), r = e.touches[0], i = e.touches[1];
			return [(r.clientX + i.clientX) / 2 - t.left, (r.clientY + i.clientY) / 2 - t.top];
		}, ze = (e) => {
			if (e.touches.length !== 2) return;
			let [t, n] = Re(e);
			V = {
				theta0: Ce,
				a0: Le(e),
				mx: t,
				my: n,
				started: !1
			};
		}, Be = (e) => {
			if (!V || e.touches.length !== 2) return;
			let [t, n] = Re(e);
			V.mx = t, V.my = n;
			let r = (0, Gs.angleDelta)(Le(e), V.a0);
			if (!V.started) {
				if (Math.abs(r) < 10) return;
				V.started = !0, V.a0 = Le(e), T = !0, M = !1;
				return;
			}
			Ce = (0, Gs.normalizeAngle)(V.theta0 + r), F.current && typeof F.current.setRotation == "function" && F.current.setRotation(Ce, { transient: !0 });
		}, Ve = (e) => {
			if (!V || e.touches.length >= 2) return;
			let t = V.started, n = Ae(Do(f.node()));
			V = null, t && F.current && typeof F.current.setRotation == "function" && (F.current.setRotation(Ce, { transient: !0 }), F.current.commit()), f.call(Ne.transform, Eo.translate(n.x, n.y).scale(n.k));
		};
		n.addEventListener("touchstart", ze, {
			capture: !0,
			passive: !0
		}), n.addEventListener("touchmove", Be, {
			capture: !0,
			passive: !0
		}), n.addEventListener("touchend", Ve, {
			capture: !0,
			passive: !0
		}), n.addEventListener("touchcancel", Ve, {
			capture: !0,
			passive: !0
		});
		function He({ repaint: e = !0, record: t = !1 } = {}) {
			if (!Ce && !V) return;
			V = null;
			let n = Do(f.node()), a = r / 2, o = i / 2, s = (0, Gs.screenToView)(Oe, Ce, a, o);
			Ce = 0, t && F.current && typeof F.current.setRotation == "function" && F.current.setRotation(0), e && f.call(Ne.transform, Eo.translate(a - s[0] * n.k, o - s[1] * n.k).scale(n.k));
		}
		function Ue(e, t = {}) {
			switch (e) {
				case "container.toggle":
					t.c && un(t.c, t.closedNode);
					return;
				case "view.zoomInStep":
					po(co);
					return;
				case "view.zoomAtPoint":
					Je(t.x, t.y, t.shift ? .5 : 2);
					return;
				case "node.zoomToReadable":
					t.d && Li(t.d, t.x, t.y);
					return;
				case "node.openReader":
					t.d && Ri(t.d);
					return;
				case "node.select":
					t.d && t.cardEl && zi(t.d, t.cardEl);
					return;
				case "view.deselect":
					Xi();
					return;
				default:
			}
		}
		let We = Number.isFinite(S.doubleTapMs) ? S.doubleTapMs : 250, Ge = (0, Xs.createTapGate)({
			ms: We,
			px: 32
		});
		function Ke(e) {
			let t = e && e.changedTouches && e.changedTouches.length ? e.changedTouches[0] : e, a = n.getBoundingClientRect();
			return !t || !Number.isFinite(t.clientX) ? [r / 2, i / 2] : [t.clientX - a.left, t.clientY - a.top];
		}
		function qe(e) {
			let [t, n] = Ke(e);
			return {
				x: t,
				y: n,
				shift: !!(e && e.shiftKey)
			};
		}
		function Je(e, t, n) {
			T = !0, M = !1, f.transition("tap-zoom").duration(320).ease(Ki).call(Ne.scaleBy, n, [e, t]);
		}
		function Ye(e, t, n) {
			let r = qe(e), i = n || (() => Ue(c("space", "doubletap"), r));
			Ge.tap(r.x, r.y, t, () => {
				Ze(r), i();
			});
		}
		let Xe = null;
		function Ze(e) {
			Xe = {
				t: Date.now(),
				x: e.x,
				y: e.y
			};
		}
		let Qe = (e) => {
			if (!Xe) return;
			if (Date.now() - Xe.t > 450) {
				Xe = null;
				return;
			}
			let [t, n] = Ke(e);
			Math.hypot(t - Xe.x, n - Xe.y) > 32 || (e.type === "dblclick" && (Xe = null), e.stopPropagation(), e.preventDefault());
		};
		n.addEventListener("click", Qe, !0), n.addEventListener("dblclick", Qe, !0);
		let $e = null, et = null, tt = (e) => {
			if (e.touches.length === 2) {
				let [t, n] = Re(e);
				$e = {
					t: Date.now(),
					x: t,
					y: n,
					moved: !1
				};
			} else e.touches.length > 2 && ($e = null);
		}, nt = (e) => {
			if (!$e || e.touches.length !== 2) return;
			let [t, n] = Re(e);
			Math.hypot(t - $e.x, n - $e.y) > 14 && ($e.moved = !0);
		}, rt = (e) => {
			if (!$e || e.touches.length > 0) return;
			let t = $e;
			$e = null;
			let n = Date.now();
			t.moved || n - t.t > 350 || (et && n - et.t <= 450 && Math.hypot(t.x - et.x, t.y - et.y) <= 60 ? (et = null, Je(t.x, t.y, .5)) : et = {
				t: n,
				x: t.x,
				y: t.y
			});
		};
		n.addEventListener("touchstart", tt, {
			capture: !0,
			passive: !0
		}), n.addEventListener("touchmove", nt, {
			capture: !0,
			passive: !0
		}), n.addEventListener("touchend", rt, {
			capture: !0,
			passive: !0
		});
		let it = 0, at = () => Date.now() - it < 800, ot = (() => {
			if (!(0, Zs.usesGesture)(s, "longpress")) return () => {};
			let e = Number.isFinite(S.longPressMs) ? S.longPressMs : 500, t = null, r = () => {
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
				} : e && e.closest && e.closest("svg") === f.node() ? {
					target: "space",
					ctx: {}
				} : null;
			}, a = (n) => {
				if (r(), n.isPrimary === !1 || n.button !== void 0 && n.button !== 0) return;
				let a = i(n.target);
				if (!a) return;
				let o = qe(n);
				t = {
					id: n.pointerId,
					cx: n.clientX,
					cy: n.clientY,
					timer: setTimeout(() => {
						t = null, it = Date.now(), Ge.cancel(), Ue(c(a.ctx.d ? Fi(a.ctx.d) : a.target, "longpress"), {
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
				at() && (it = 0, e.stopPropagation(), e.preventDefault());
			};
			return n.addEventListener("pointerdown", a, !0), n.addEventListener("pointermove", o, !0), n.addEventListener("pointerup", l, !0), n.addEventListener("pointercancel", l, !0), n.addEventListener("click", u, !0), () => {
				r(), n.removeEventListener("pointerdown", a, !0), n.removeEventListener("pointermove", o, !0), n.removeEventListener("pointerup", l, !0), n.removeEventListener("pointercancel", l, !0), n.removeEventListener("click", u, !0);
			};
		})();
		if (F.current && typeof F.current.migrateNodeKeys == "function" && le.current !== e) {
			le.current = e;
			let t = (0, lc.migrationPairs)(o.nodes, ge);
			t.length && F.current.migrateNodeKeys(t);
		}
		let st = !1;
		if (F.current && (st = (0, Rs.layoutIsDegenerate)(o.nodes.map((e) => F.current.nodeState(_e(e))).filter((e) => e && Number.isFinite(e.x) && Number.isFinite(e.y)), R({
			hovered: !1,
			pinned: !1
		}))), F.current && !st) {
			for (let e of o.nodes) {
				let t = F.current.nodeState(_e(e)), n = F.current.nodeState(me(e));
				t && typeof t.x == "number" && typeof t.y == "number" && (e.x = t.x, e.y = t.y, t.auto || (e.fx = t.x, e.fy = t.y)), l && n && typeof n.w == "number" && typeof n.h == "number" && (e._size = {
					width: n.w,
					height: n.h
				});
			}
			if (z.current === "force" && o.nodes.some((e) => e.type === "tag" && e.concept)) {
				let e = new Map(o.nodes.map((e) => [e.id, e])), t = /* @__PURE__ */ new Map();
				for (let n of o.links) {
					if (n.layer !== "tag") continue;
					let r = typeof n.target == "object" ? n.target.id : n.target, i = e.get(typeof n.source == "object" ? n.source.id : n.source);
					!i || i.type !== "article" || (t.has(r) || t.set(r, []), t.get(r).push(i));
				}
				for (let e of o.nodes) {
					if (e.type !== "tag" || !e.concept) continue;
					let n = F.current.nodeState(_e(e));
					if (n && Number.isFinite(n.x) && Number.isFinite(n.y)) continue;
					let r = bc((t.get(e.id) || []).map((e) => F.current.nodeState(_e(e))));
					r && (e.x = r.x, e.y = r.y);
				}
			}
		}
		if (ve.current = /* @__PURE__ */ new Set(), F.current) for (let e of o.nodes) {
			let t = F.current.nodeState(me(e));
			e.type === "article" && !e.link && t && t.pinned && ve.current.add(e.id);
		}
		if (F.current && st) for (let e of o.nodes) {
			let t = F.current.nodeState(me(e));
			l && t && typeof t.w == "number" && typeof t.h == "number" && (e._size = {
				width: t.w,
				height: t.h
			});
		}
		let ct = () => {
			let e = F.current;
			return e && e.preference ? e.preference("tightness") : null;
		}, lt = (0, Hs.tightened)(E, ct(), C), ut = (e) => e._groupedInto ? 0 : Math.max(0, (e._r || (e.type === "article" ? Math.hypot(C.width, C.height) / 2 : e.size / 2)) + lt.collidePadding), dt = (e) => e._groupedInto ? 0 : lt.chargeStrength, H = Ja().force("link", za().id((e) => e.id).distance(lt.linkDistance)).force("charge", Ya().strength(dt)).force("collide", Ia().radius(ut).strength(1).iterations(3)).force("center", la(r / 2, i / 2)).velocityDecay(E.velocityDecay).alphaDecay(E.alphaDecay), ft = () => {
			ie.current && ie.current(), O.current && (r = O.current.clientWidth, i = O.current.clientHeight, f.attr("width", r).attr("height", i));
		};
		window.addEventListener("resize", ft);
		let pt = f.append("g").attr("class", "time-axis-layer"), mt = x.append("g").attr("class", "roots-layer").attr("aria-hidden", "true").style("pointer-events", "none"), ht = x.append("g").attr("class", "containers-layer"), gt = /* @__PURE__ */ new Map(), _t = /* @__PURE__ */ new Map();
		for (let e of o.containers || []) gt.set(e.id, /* @__PURE__ */ new Set()), _t.set(e.id, /* @__PURE__ */ new Set());
		for (let e of o.containmentEdges || []) gt.has(e.source) && gt.has(e.target) ? gt.get(e.source).add(e.target) : _t.has(e.source) && _t.get(e.source).add(e.target);
		let vt = /* @__PURE__ */ new Map();
		function yt(e, t) {
			if (!t && vt.has(e)) return vt.get(e);
			let n = t || /* @__PURE__ */ new Set();
			if (n.has(e)) return [];
			n.add(e);
			let r = Array.from(_t.get(e) || []), i = Array.from(gt.get(e) || []).flatMap((e) => yt(e, n)), a = Array.from(new Set([...r, ...i]));
			return t || vt.set(e, a), a;
		}
		let bt = [...o.containers || []].sort((e, t) => t.parent === e.id ? -1 : +(e.parent === t.id)), xt = ht.selectAll(".container-group").data(bt, (e) => e.id).enter().append("g").attr("class", "container-group").attr("data-container-id", (e) => e.id), St = () => {
			let e = F.current;
			return e && e.preference ? e.preference("nodePalette") : null;
		}, Ct = (0, Vs.nodePaletteFor)(S, St()), wt = (e) => e && e._look || (0, Bs.containerLook)(e, Ct);
		for (let e of o.containers || []) e._look = (0, Bs.containerLook)(e, Ct);
		let Tt = () => {
			Ct && String(Ct.color).toLowerCase() !== "none" ? n.style.setProperty("--pp-node-color", Ct.color) : n.style.removeProperty("--pp-node-color");
		};
		Tt(), xt.append("path").attr("class", "container-hull").attr("stroke-width", (e) => e.strokeWidth || 1.5).attr("stroke-dasharray", (e) => e.strokeDasharray || (e.parent ? null : "6 6")), xt.append("path").attr("class", "container-hull-ghost");
		let Et = typeof document < "u" && document.documentElement.getAttribute("data-pp-theme") === "sketchbook", Dt = () => (0, Ys.initiallyClosed)(e.containers || [], S), Ot = new Set((e.containers || []).map((e) => e.id)), U = new Set(Dt());
		if (F.current && typeof F.current.containerState == "function") for (let [e, t] of Object.entries(F.current.containerState())) t === "closed" && Ot.has(e) ? U.add(e) : t === "open" && U.delete(e);
		let kt = /* @__PURE__ */ new Map(), At = /* @__PURE__ */ new Map(), jt = 1.05, Mt = (0, Ws.showContainerCount)(S);
		function Nt(e) {
			let t = (e.label || e.id).split(/\s+/), n = [], r = "";
			for (let e of t) r ? r.length + 1 + e.length > 15 ? (n.push(r), r = e) : r += " " + e : r = e;
			return r && n.push(r), n;
		}
		let Pt = .42, Ft = .2, It = (e) => e.status ? String(e.status) : "";
		function Lt(e, t = {}) {
			let n = Nt(e).length, r = It(e) && t.status !== !1 ? Ft + Pt * 1.3 : 0;
			return {
				n,
				statusH: r,
				total: n * jt + r
			};
		}
		function Rt(e, t, n = {}) {
			let r = Nt(t), { n: i, total: a } = Lt(t, n), o = -a / 2;
			e.selectAll("*").remove(), r.forEach((t, n) => {
				e.append("tspan").attr("class", "label-line").attr("x", 0).attr("y", `${o + (n + .5) * jt}em`).text(t), Mt && n === i - 1 && e.append("tspan").attr("class", "label-count").attr("font-weight", "500").attr("dx", "12px").attr("font-size", "0.5em").text("");
			});
			let s = n.status === !1 ? "" : It(t);
			if (s) {
				let t = o + i * jt + Ft + Pt * 1.3 / 2;
				e.append("tspan").attr("class", "label-status").attr("x", 0).attr("font-size", `${Pt}em`).attr("font-weight", "500").attr("letter-spacing", "0.02em").attr("y", `${t / Pt}em`).text(s);
			}
		}
		let zt = typeof document < "u" ? document.createElement("canvas").getContext("2d") : null;
		function Bt() {
			return typeof document > "u" ? "'Atkinson', sans-serif" : getComputedStyle(document.documentElement).getPropertyValue("--pp-title-font").trim() || "'Atkinson', sans-serif";
		}
		function Vt(e, t, n, r) {
			let i = r ? 0 : e.length * t * .05;
			return zt ? (zt.font = r ? `400 ${t}px ${r}` : `${Et ? 400 : n} ${t}px ${Bt()}`, zt.measureText(e).width * 1.06 + i) : e.length * t * .6 + i;
		}
		function Ht(e, t, n = {}) {
			let r = Nt(e), i = Mt ? Vt(" 000", t * .5, 500, n.family) + 12 : 0, a = n.status === !1 ? "" : It(e), o = Math.max(...r.map((e, a) => Vt(e, t, 700, n.family) + (a === r.length - 1 ? i : 0)), a ? Vt(a, t * Pt, 500, n.family) : 0), s = Lt(e, n).total * t + .3 * t;
			return {
				w: o + 24,
				h: s + 12
			};
		}
		function Ut(e) {
			return e.badgeColor || e.color || e.stroke || "#d4af37";
		}
		let Wt = xt.append("g").attr("class", "container-badge").attr("data-container-top", (e) => e.parent ? null : "").style("touch-action", "manipulation");
		Wt.append("rect").attr("class", "container-badge-hit").attr("fill", "transparent").attr("pointer-events", "all");
		let Gt = Wt.append("text").attr("class", "container-badge-text").attr("text-anchor", "middle").attr("dominant-baseline", "central").style("user-select", "none").attr("fill", (e) => Ut(e)).attr("opacity", .55).attr("font-size", (e) => e.parent ? "52px" : "64px");
		Gt.each(function(e) {
			Rt(W(this), e);
		});
		let Kt = (e) => wt(e).label.face;
		function Jt() {
			if (typeof document > "u") return;
			let e = typeof window < "u" ? window.SETTINGS : null, t = document.documentElement.getAttribute("data-pp-mode") || "dark", n = getComputedStyle(document.body).backgroundColor, r = !n || /rgba\([^)]*,\s*0\)$/.test(n) || n === "transparent", i = (0, ic.allBackgrounds)((0, ic.config)(e), t, r ? null : n);
			Gt.each(function(e) {
				let t = wt(e).label.color, n = t ? {
					color: t,
					opacity: 1
				} : (0, ic.legibleOn)(Ut(e), i, { opacity: .55 });
				W(this).attr("fill", n.color).attr("opacity", n.opacity);
			});
		}
		Jt();
		function Yt() {
			Jt();
			let e = document.documentElement.getAttribute("data-pp-theme") === "sketchbook";
			if (e === Et) return;
			Et = e;
			let t = () => {
				Te && (Nr(), Qi());
			};
			document.fonts && document.fonts.load ? document.fonts.load(`48px ${Bt()}`).then(t, t) : t();
		}
		let Xt = typeof MutationObserver < "u" ? new MutationObserver(Yt) : null;
		Et && typeof document < "u" && document.fonts && document.fonts.load && document.fonts.load(`48px ${Bt()}`).then(() => {
			!Te || !k.current || (Nr(), Qi());
		}, () => {}), Xt && Xt.observe(document.documentElement, {
			attributes: !0,
			attributeFilter: ["data-pp-mode", "data-pp-theme"]
		});
		let Zt = xt.append("g").attr("class", "container-macro-node").style("display", "none").style("touch-action", "manipulation"), Qt = (0, zs.closedPillOf)(S);
		Zt.append("path").attr("class", "container-macro-bg").attr("stroke-width", 2.2);
		let $t = (0, zs.closedPillScaleOf)(S), en = Qt.labelSize || Math.round((C.labelMaxFontSize || 26) * 1.6), tn = Zt.append("text").attr("class", "container-macro-text").attr("text-anchor", "middle").attr("dominant-baseline", "central").attr("font-size", (e) => `${e.parent ? en : Math.round(en * 1.25)}px`).attr("font-family", "'Atkinson', sans-serif").attr("font-weight", "700").attr("letter-spacing", "-0.02em");
		function nn() {
			xt.select(".container-hull").style("fill", (e) => wt(e).open.fill).style("fill-opacity", (e) => wt(e).open.fillOpacity).style("stroke", (e) => wt(e).open.stroke), xt.select(".container-hull-ghost").style("stroke", (e) => wt(e).open.stroke), xt.select(".container-macro-bg").style("fill", (e) => wt(e).closed.fill).style("fill-opacity", (e) => wt(e).closed.fillOpacity).style("stroke", (e) => wt(e).closed.stroke).style("filter", (e) => wt(e).closed.glow ? `drop-shadow(0 0 18px color-mix(in srgb, ${wt(e).closed.glow} 45%, transparent))` : "none");
			for (let e of [tn, Gt]) e.style("font-family", (e) => Kt(e)).style("font-weight", (e) => Kt(e) ? "400" : null).style("letter-spacing", (e) => Kt(e) ? "0" : null);
			tn.attr("fill", (e) => wt(e).label.color || Ut(e)), Jt();
		}
		nn(), se.current = () => {
			let e = (0, Vs.nodePaletteFor)(S, St());
			if ((e && e.id) !== (Ct && Ct.id)) {
				Ct = e;
				for (let e of o.containers || []) e._look = (0, Bs.containerLook)(e, Ct);
				nn(), Tt();
			}
		};
		let rn = lo().curve(So.alpha(.5));
		function an(e, t, n) {
			let r = 0;
			for (let t = 0; t < e.length; t++) r = r * 31 + e.charCodeAt(t) >>> 0;
			let i = () => (r = r * 1664525 + 1013904223 >>> 0, r / 4294967296);
			if (Qt.shape === "blob") return rn(on(i, t, n));
			let a = [];
			for (let e = 0; e < 14; e++) {
				let r = e / 14 * Math.PI * 2, o = Math.cos(r), s = Math.sin(r), c = 2 / 2.8, l = 1 + (i() - .5) * .08;
				a.push([Math.sign(o) * Math.abs(o) ** +c * t * l, Math.sign(s) * Math.abs(s) ** +c * n * l]);
			}
			return rn(a);
		}
		function on(e, t, n) {
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
		tn.each(function(e) {
			Rt(W(this), e, {
				status: Qt.status,
				family: Kt(e)
			});
		});
		let sn = [...new Set((o.containers || []).map(Kt).filter(Boolean))];
		sn.length && typeof document < "u" && document.fonts && document.fonts.load && Promise.all(sn.map((e) => document.fonts.load(`48px ${e}`))).then(() => {
			!Te || !k.current || (Nr(), Qi());
		}, () => {});
		function cn() {
			Zt.each(function(e) {
				let t = W(this), n = parseFloat(t.select(".container-macro-text").attr("font-size")) || en, r = Ht(e, n, {
					status: Qt.status,
					family: Kt(e)
				}), i = Math.max(C.width * 1.5, r.w + n * 1.4), a = Math.max(C.height * 1.5, r.h + n * 1.4);
				t.select(".container-macro-bg").attr("d", an(e.id, i / 2, a / 2)), e._macroHalfW = i / 2 * $t, e._macroHalfH = a / 2 * $t;
			});
		}
		cn();
		function ln({ isCollapsed: e }) {
			return qt().clickDistance(5).container(() => x.node()).filter((e) => !(e.ctrlKey || e.button !== void 0 && e.button !== 0)).on("start", function(e, t) {
				e.sourceEvent && e.sourceEvent.stopPropagation();
				let n = e.x, r = e.y;
				W(this).datum()._dragState = {
					startX: n,
					startY: r,
					lastX: n,
					lastY: r,
					totalMove: 0,
					moves: c("container", "drag") === "node.move"
				};
			}).on("drag", function(e, t) {
				let n = W(this).datum()._dragState;
				if (!n) return;
				let r = e.x - n.lastX, i = e.y - n.lastY;
				if (n.lastX = e.x, n.lastY = e.y, n.totalMove += Math.hypot(r, i), !n.moves) return;
				let a = In() ? Oe.k / De : 1, o = r * a, s = i * a, c = yt(t.id);
				if (!n.carried) {
					let e = new Set(c);
					n.carried = [...Dn.keys()].filter((t) => {
						let n = yt(t);
						return n.length && n.every((t) => e.has(t));
					});
				}
				for (let e of n.carried) {
					let t = zn(e);
					t && Pn.set(e, {
						x: t.x + o,
						y: t.y + s
					});
				}
				for (let e of c) {
					let t = G.get(e);
					t && (t.x += o, t.y += s, t.fx = t.x, t.fy = t.y, F.current && F.current.setNodePosition(_e(t), t.x, t.y, { transient: !0 }));
				}
				Qi(), B.current && B.current();
			}).on("end", function(t, n) {
				let r = W(this).datum()._dragState;
				if (delete W(this).datum()._dragState, (r ? r.totalMove : 0) >= 4) {
					if (!r.moves) return;
					Jn = !1;
					let e = yt(n.id);
					if (Ee) {
						let t = new Set(e);
						for (let e of Dn.keys()) {
							let n = yt(e);
							n.length && n.every((e) => t.has(e)) && $n(e);
						}
					}
					let t = F.current;
					for (let n of e) {
						let e = G.get(n);
						e && (e.fx = e.x, e.fy = e.y, t && t.setNodePosition(_e(e), e.x, e.y, { transient: !0 }));
					}
					t && t.commit(), Qi();
				} else {
					if (at()) return;
					let r = {
						c: n,
						closedNode: e,
						...qe(t.sourceEvent)
					};
					Ye(t.sourceEvent, () => Ue(c("container", "tap"), r), () => Ue(c("container", "doubletap"), r));
				}
			});
		}
		function un(e, t) {
			t ? Or([e.id], !0) : Or([e.id], U.has(e.id));
		}
		Wt.call(ln({ isCollapsed: !1 })), Zt.call(ln({ isCollapsed: !0 })), Wt.on("click", (e) => e.stopPropagation()), Zt.on("click", (e) => e.stopPropagation());
		let dn = lo().curve(So.alpha(.5)), fn = lo().curve(ho);
		function pn(e, t) {
			let n = [], r = Math.max(8, t);
			for (let t = 0; t < e.length; t++) {
				let i = e[t], a = e[(t + 1) % e.length];
				n.push(i);
				let o = Math.hypot(a[0] - i[0], a[1] - i[1]), s = Math.floor(o / r);
				for (let e = 1; e < s; e++) n.push([i[0] + (a[0] - i[0]) * e / s, i[1] + (a[1] - i[1]) * e / s]);
			}
			return n;
		}
		let G = new Map(o.nodes.map((e) => [e.id, e])), mn = new Map((o.containers || []).map((e) => [e.id, e])), hn = (e) => {
			let t = 0, n = e.parent;
			for (; n && mn.has(n) && t < 20;) t++, n = mn.get(n).parent;
			return t;
		}, gn = m.labelSize && m.labelSize.min || 32, _n = m.labelSize && m.labelSize.max || 96, vn = m.labelSize && m.labelSize.nestedScale || .75, yn = () => {
			let e = /* @__PURE__ */ new Map();
			for (let t of o.containers || []) e.set(t.id, Array.from(_t.get(t.id) || []).map((e) => G.get(e)).filter(Boolean).map((e) => ({
				id: e.id,
				w: e._size && e._size.width || (e.type === "article" ? C.width : e.size),
				h: e._size && e._size.height || (e.type === "article" ? C.height : e.size),
				order: Number.isFinite(e.series_part) ? e.series_part : null,
				date: e.date || ""
			})));
			return e;
		}, K = {
			roots: [],
			nodes: /* @__PURE__ */ new Map(),
			containers: /* @__PURE__ */ new Map()
		};
		function bn() {
			if (!o.containers || o.containers.length === 0) return;
			let e = yn(), t = () => (0, zs.containerLayout)({
				containers: o.containers,
				members: e,
				closed: U,
				labelSize: (e) => Ht(e, e._fs || gn, { family: Kt(e) }),
				macroSize: (e) => ({
					w: (e._macroHalfW || 130) * 2,
					h: (e._macroHalfH || 45) * 2
				}),
				options: {
					spacing: m.spiral?.spacing ?? 20,
					mode: z.current === "radial" ? "ring" : m.spiral?.mode || "path",
					startRadius: m.spiral?.startRadius,
					direction: m.spiral?.direction,
					gap: 28,
					padding: D,
					layoutOf: (e) => z.current === "force" ? (0, zs.containerLayoutOf)(e, S) : null,
					hangOf: (e) => ({
						...S.hang || {},
						...e.hang || {}
					}),
					spiralOf: xn
				}
			});
			for (let e of o.containers) e._fs = gn;
			let n = t();
			for (let e of o.containers) {
				let t = n.containers.get(e.id), r = t ? t.box.x1 - t.box.x0 : 0, i = _n * vn ** +hn(e);
				if (e._fs = Math.max(gn, Math.min(Math.max(gn, i), r / 8)), t && t.hang) {
					let n = C.width + t.hang.gap;
					for (let t = 0; t < 40 && e._fs > gn && Ht(e, e._fs, { family: Kt(e) }).w > n; t++) e._fs = Math.max(gn, e._fs * .92);
				}
			}
			n = t(), K = n;
			for (let e of o.nodes) {
				let t = K.nodes.get(e.id);
				e._cardScale = (t && t.scale > 0 ? t.scale : 1) * (e._sourceCardScale > 0 ? e._sourceCardScale : 1);
			}
		}
		function xn(e) {
			let t = {
				...S.spiral || {},
				...e && e.spiral || {}
			};
			return {
				...t,
				keepBelowY: Sn(e, t)
			};
		}
		function Sn(e, t) {
			if (t.keepBelow !== "crown" || !e || !Dn.has(e.id) || !(On && On.art && Number.isFinite(On.crownY)) || z.current !== "force") return null;
			let n = (0, rc.homeView)(he), r = Mn(), i = (0, rc.anchorWorld)(Dn.get(e.id), On.art, n, r);
			return (0, rc.anchorWorld)({
				x: .5,
				y: On.crownY
			}, On.art, n, r).y - i.y;
		}
		let Cn = () => [S.spiral, ...(o.containers || []).map((e) => e.spiral)].some((e) => e && e.keepBelow === "crown");
		function wn(e) {
			if (Ee && kn()) {
				let t = 0, n = 0, r = 0;
				for (let i of Dn.keys()) {
					let a = K.containers.get(i);
					if (!a || a.root !== e) continue;
					let o = Tn(i);
					o && (t += o.x, n += o.y, r++);
				}
				if (r) return {
					x: t / r,
					y: n / r
				};
			}
			let t = 0, n = 0, r = 0;
			for (let [i, a] of K.nodes) {
				if (a.root !== e) continue;
				let o = G.get(i);
				!o || !Number.isFinite(o.x) || !Number.isFinite(o.y) || (t += o.x - a.x, n += o.y - a.y, r++);
			}
			return r ? {
				x: t / r,
				y: n / r
			} : null;
		}
		function Tn(e) {
			let t = 0, n = 0, r = 0;
			for (let i of yt(e)) {
				let e = K.nodes.get(i), a = G.get(i);
				!e || !a || !Number.isFinite(a.x) || !Number.isFinite(a.y) || (t += a.x - e.x, n += a.y - e.y, r++);
			}
			return r ? {
				x: t / r,
				y: n / r
			} : null;
		}
		let En = () => m.spiral?.enabled !== !1 && (z.current === "force" || z.current === "radial"), Dn = new Map(Object.entries(kc(e)).filter(([e]) => mn.has(e))), On = typeof window < "u" && window.PostPipeCoverFrame || null, kn = () => Dn.size > 0 && !!(On && On.art) && En() && z.current === "force" && K.containers.size > 0, An = /* @__PURE__ */ new Map();
		for (let e of [...Dn.keys()].sort((e, t) => hn(mn.get(t)) - hn(mn.get(e)))) for (let t of yt(e)) An.has(t) || An.set(t, e);
		Ee = !0;
		function jn(e) {
			let t = K.containers.get(e), n = t && Tn(e);
			return n ? {
				x: n.x + t.center.x,
				y: n.y + t.center.y
			} : null;
		}
		function Mn() {
			if (!O.current) return {
				x: 0,
				y: 0
			};
			let e = O.current.getBoundingClientRect(), t = typeof window < "u" && window.PostPipeCover && window.PostPipeCover.shift || 0;
			return {
				x: e.left,
				y: e.top - t
			};
		}
		function Nn() {
			let e = /* @__PURE__ */ new Map();
			if (!kn()) return e;
			let t = (0, rc.homeView)(he), n = Mn();
			for (let [r, i] of Dn) e.set(r, (0, rc.anchorWorld)(i, On.art, t, n));
			return e;
		}
		let Pn = /* @__PURE__ */ new Map(), Fn = /* @__PURE__ */ new Map();
		function In() {
			return Fe && De > 0 && kn();
		}
		function Ln() {
			let e = De > 0 ? De : he, t = Ie() || [r / 2, i / 2], n = (0, rc.homeView)(e);
			return {
				x: (t[0] - n.x) / e,
				y: (t[1] - n.y) / e
			};
		}
		function Rn() {
			let e = Ln(), t = Do(f.node());
			return [t.x + t.k * e.x, t.y + t.k * e.y];
		}
		let zn = (e) => Pn.get(e) || jn(e);
		function Bn() {
			if (Fn = /* @__PURE__ */ new Map(), !In()) return;
			let e = Oe.k / De;
			if (Math.abs(e - 1) < 1e-9) return;
			let t = Ln();
			for (let n of Dn.keys()) {
				let r = zn(n);
				r && Fn.set(n, (0, qs.growShift)(r, t, e));
			}
		}
		let Vn = {
			x: 0,
			y: 0
		}, Hn = (e) => Fn.size && e && Fn.get(An.get(e.id)) || Vn;
		function Un(e) {
			if (!Fn.size || !e) return Vn;
			let t = e;
			for (let e = 0; t && e < 20; e++) {
				let e = Fn.get(t.id);
				if (e) return e;
				t = t.parent ? mn.get(t.parent) : null;
			}
			return Vn;
		}
		let Wn = (e) => {
			let t = Hn(e);
			return t === Vn ? e : {
				x: e.x + t.x,
				y: e.y + t.y
			};
		};
		function Gn(e) {
			if (!In() || !(0, qs.growCapOn)(S)) return Infinity;
			let t = [];
			for (let n of Dn.keys()) {
				let r = K.containers.get(n), i = mn.get(n);
				if (!r || !i || Sr(i)) continue;
				let a = e && e.get(n) || zn(n);
				if (!a) continue;
				let o = a.x - r.center.x, s = a.y - r.center.y, c = U.has(n) ? 0 : .75 * rr;
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
			return De * (0, qs.growCap)(t, {
				gap: 16,
				homeK: De
			});
		}
		function Kn(e) {
			if (!In()) return;
			let t = Gn(e);
			Oe.k > t + 1e-9 && po(t / Oe.k);
		}
		let qn = /* @__PURE__ */ new Set(), Jn = !1, Xn = (e) => ge(z.current) + e, Zn = /* @__PURE__ */ new Set();
		function Qn(e) {
			let t = F.current;
			if (!t) return Zn.has(e);
			let n = t.nodeState(Xn(e));
			return !!(n && !n.auto && Number.isFinite(n.x));
		}
		function $n(e) {
			let t = jn(e), n = F.current;
			n && t ? n.setNodePosition(Xn(e), t.x, t.y, { transient: !0 }) : Zn.add(e);
		}
		let er = /* @__PURE__ */ new Map();
		for (let e of Dn.keys()) {
			let t = F.current;
			if (t && Qn(e)) {
				let n = t.nodeState(Xn(e));
				for (let t of yt(e)) {
					if (An.get(t) !== e) continue;
					let n = G.get(t);
					n && Number.isFinite(n.x) && Number.isFinite(n.y) && (n.fx = n.x, n.fy = n.y);
				}
				er.set(e, {
					x: n.x,
					y: n.y
				});
			} else qn.add(e);
		}
		function tr(e) {
			for (let [t, n] of e) {
				let e = jn(t);
				if (!n || !e) continue;
				Dn.has(t) && Pn.set(t, {
					x: n.x,
					y: n.y
				});
				let r = n.x - e.x, i = n.y - e.y;
				for (let e of yt(t)) {
					let t = G.get(e);
					!t || !Number.isFinite(t.x) || !Number.isFinite(t.y) || (t.x += r, t.y += i, t.fx = t.x, t.fy = t.y, t.vx = 0, t.vy = 0);
				}
			}
		}
		function nr(e) {
			let t = Tn(e);
			if (t) for (let n of yt(e)) {
				if (An.get(n) !== e) continue;
				let r = K.nodes.get(n), i = G.get(n);
				!r || !i || !Number.isFinite(i.x) || !Number.isFinite(i.y) || (i.x = t.x + r.x, i.y = t.y + r.y, i.vx = 0, i.vy = 0);
			}
		}
		let rr = Number.isFinite(Number(S.hull && S.hull.padding)) ? Number(S.hull.padding) : 24;
		function ir(e) {
			if (!kn()) return e;
			let t = [];
			for (let n of Dn.keys()) {
				let r = K.containers.get(n), i = e.get(n) || jn(n);
				if (!r || !i) continue;
				let a = i.x - r.center.x, o = i.y - r.center.y, s = U.has(n) ? 0 : .75 * rr;
				t.push({
					id: n,
					box: {
						x0: r.box.x0 + a - s,
						y0: r.box.y0 + o - s,
						x1: r.box.x1 + a + s,
						y1: r.box.y1 + o + s
					},
					open: !U.has(n),
					fixed: Qn(n),
					towards: xn(mn.get(n)).openTowards
				});
			}
			let n = (0, Us.actsApart)(t, { gap: 16 / he });
			if (!n.size) return e;
			let r = new Map(e);
			for (let [e, t] of n) {
				let n = r.get(e) || jn(e);
				n && r.set(e, {
					x: n.x + t.dx,
					y: n.y + t.dy
				});
			}
			return r;
		}
		function ar(e = [...Dn.keys()]) {
			if (!kn()) return !1;
			let t = ir(Nn());
			tr(e.map((e) => [e, t.get(e)]));
			for (let t of e) qn.delete(t);
			return e.length, Dn.size, !0;
		}
		function or() {
			return er.size ? (tr([...er]), er.clear(), !0) : !1;
		}
		let sr = () => Dn.size ? [...Dn.keys()] : (o.containers || []).filter((e) => e.parent && !mn.get(e.parent)?.parent).map((e) => e.id), cr = /* @__PURE__ */ new WeakMap();
		function lr(e) {
			let t = e.getAttribute("d") || "", n = cr.get(e);
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
			return cr.set(e, {
				d: t,
				pts: r
			}), r;
		}
		function ur(e, t, n) {
			if (!t) return jn(e);
			let r = n.select(".container-macro-node").node(), i = n.node(), a = r && r.getScreenCTM ? r.getScreenCTM() : null, o = i && i.getScreenCTM ? i.getScreenCTM() : null;
			if (!a || !o) return jn(e);
			let s = o.inverse();
			return {
				x: s.a * a.e + s.c * a.f + s.e,
				y: s.b * a.e + s.d * a.f + s.f
			};
		}
		function dr() {
			let e = [];
			if (!Te) return {
				containers: e,
				k: be.current,
				homeK: De,
				moving: !1
			};
			let t = kn() ? Nn() : null, n = !1;
			for (let r of sr()) {
				let i = xt.filter((e) => e.id === r), a = i.node();
				if (!a || a.style.display === "none") continue;
				let o = U.has(r), s = i.select(o ? ".container-macro-bg" : ".container-hull").node();
				if (!s || !o && s.style.display === "none") continue;
				let c = lr(s), l = s.getScreenCTM();
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
					let e = t.get(r), a = ur(r, o, i);
					a && e && (p.drift = {
						x: a.x - e.x,
						y: a.y - e.y
					});
					let s = jn(r);
					a && s && Math.hypot(a.x - s.x, a.y - s.y) > .25 && (n = !0);
				}
				e.push(p);
			}
			return {
				containers: e,
				k: be.current,
				homeK: De,
				moving: n
			};
		}
		function fr() {
			typeof window > "u" || window.dispatchEvent(new CustomEvent("graph:world"));
		}
		typeof window < "u" && (window.PostPipeGraphWorld = { snapshot: dr });
		function pr() {
			function e(e) {
				if (!En() || z.current !== "force") return;
				let t = m.spiral?.strength ?? .35, n = /* @__PURE__ */ new Map();
				if (kn()) for (let e of Dn.keys()) n.set(e, Tn(e));
				for (let r of K.roots) {
					let i = wn(r);
					for (let [a, o] of K.nodes) {
						if (o.root !== r) continue;
						let s = G.get(a);
						if (!s || !Number.isFinite(s.x)) continue;
						let c = An.get(a), l = c && n.get(c) || i;
						l && (s.vx += (l.x + o.x - s.x) * t * e, s.vy += (l.y + o.y - s.y) * t * e);
					}
				}
			}
			return e.initialize = function() {}, e;
		}
		function mr() {
			let e = [], t = (e) => e.type === "article" ? Math.hypot(e._size?.width || C.width, e._size?.height || C.height) / 2 * (e._cardScale || 1) : e._r || (e.size || 60) / 2;
			function n(n) {
				if (!o.containers || o.containers.length === 0) return;
				let r = [];
				for (let e of K.roots) {
					let t = K.containers.get(e), n = wn(e);
					if (!t || !n) continue;
					let i = yt(e).map((e) => G.get(e)).filter((e) => e && Number.isFinite(e.x));
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
				}, a = m.containerSpacing === void 0 ? -20 : m.containerSpacing;
				for (let e = 0; e < r.length; e++) for (let t = e + 1; t < r.length; t++) {
					let n = r[e], o = r[t], s = o.x - n.x, c = o.y - n.y;
					i(s, c, Math.hypot(s, c), n.r + o.r + a, (e, t) => {
						for (let r of n.members) r.vx -= e, r.vy -= t;
						for (let n of o.members) n.vx += e, n.vy += t;
					});
				}
				let s = new Set(K.nodes.keys()), c = (e.length ? e : o.nodes).filter((e) => !s.has(e.id) && Number.isFinite(e.x));
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
		o.containers && o.containers.length > 0 && (bn(), H.force("containerSeparation", mr()), H.force("containerLayout", pr()));
		let hr = /* @__PURE__ */ new Set(), gr = (e) => (K.nodes.get(e) || {}).root || null, _r = (e) => typeof e == "object" ? e.id : e;
		function vr() {
			hr = /* @__PURE__ */ new Set();
			for (let e of U) for (let t of yt(e)) hr.add(t);
			H.force("collide").radius((e) => hr.has(e.id) || e._groupedInto ? 0 : K.nodes.has(e.id) && e.type === "article" ? Math.min(e._size?.width || C.width, e._size?.height || C.height) / 2 * (e._cardScale || 1) : ut(e)), H.force("charge").strength((e) => hr.has(e.id) || e._groupedInto ? 0 : K.nodes.has(e.id) ? lt.chargeStrength * .05 : lt.chargeStrength);
		}
		if (K.nodes.size > 0) {
			vr();
			let e = H.force("link"), t = e.strength();
			e.strength((e) => {
				let n = gr(_r(e.source));
				return n && n === gr(_r(e.target)) ? 0 : t(e);
			});
		}
		ue.current = () => {
			let e = (0, Hs.tightened)(E, ct(), C);
			e.linkDistance === lt.linkDistance && e.chargeStrength === lt.chargeStrength && e.collidePadding === lt.collidePadding || (lt = e, H.force("link").distance(lt.linkDistance), K.nodes.size > 0 ? vr() : (H.force("charge").strength(dt), H.force("collide").radius(ut)), z.current === "force" && H.alpha(Math.max(H.alpha(), .3)).restart());
		};
		function yr(e) {
			let t = r / 2;
			for (let n of K.roots) {
				let a = K.containers.get(n);
				if (!a) continue;
				let o = a.box.x1 - a.box.x0, s = t - (a.box.x0 + a.box.x1) / 2 + (t === r / 2 ? 0 : o / 2), c = i / 2 - (a.box.y0 + a.box.y1) / 2;
				for (let [t, r] of K.nodes) {
					if (r.root !== n) continue;
					let i = G.get(t);
					i && (e || !Number.isFinite(i.x) || !Number.isFinite(i.y)) && (i.x = s + r.x, i.y = c + r.y, i.vx = 0, i.vy = 0);
				}
				t += (t === r / 2 ? o / 2 : o) + 200;
			}
		}
		K.nodes.size > 0 && yr(st);
		function br() {
			if (!o.containers || o.containers.length === 0 || (bn(), vr(), K.nodes.size === 0)) return null;
			let e = {}, t = 0;
			for (let n of K.roots) {
				let r = K.containers.get(n);
				if (!r) continue;
				let i = t - r.box.x0, a = -(r.box.y0 + r.box.y1) / 2;
				for (let [t, r] of K.nodes) r.root === n && (e[t] = {
					x: i + r.x,
					y: a + r.y
				});
				t += r.box.x1 - r.box.x0 + 200;
			}
			let n = o.nodes.filter((e) => !K.nodes.has(e.id) && !e._groupedInto);
			if (n.length) {
				let r = (0, Rs.radialLayout)(n, {
					cardW: C.width,
					cardH: C.height
				}), i = Object.values(r).map((e) => e.x), a = i.length ? t + C.width - Math.min(...i) : t;
				for (let [t, n] of Object.entries(r)) e[t] = {
					x: n.x + a,
					y: n.y
				};
			}
			return e;
		}
		function xr() {
			!o.containers || o.containers.length === 0 || (bn(), vr());
		}
		function Sr(e) {
			let t = e.parent, n = 0;
			for (; t && n++ < 20;) {
				if (U.has(t)) return !0;
				t = mn.get(t)?.parent;
			}
			return !1;
		}
		function Cr() {
			if (bt.length === 0) return;
			Bn(), fr();
			let e = En() && K.containers.size > 0, t = (t) => {
				let n = e ? K.containers.get(t.id) : null, r = n ? Tn(t.id) : null;
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
				let r = yt(e.id).map((e) => G.get(e)).filter((e) => e && Number.isFinite(e.x));
				return r.length ? {
					x: v(r, (e) => e.x),
					y: v(r, (e) => e.y)
				} : null;
			};
			xt.each(function(e) {
				let r = W(this), i = yt(e.id).map((e) => G.get(e)).filter((e) => e && Number.isFinite(e.x) && Number.isFinite(e.y));
				if (i.length === 0 || Sr(e)) {
					r.style("display", "none"), At.delete(e.id);
					return;
				}
				let a = U.has(e.id), o = e._fs || 52, s = t(e), c = Un(e);
				r.attr("transform", c.x || c.y ? `translate(${c.x}, ${c.y})` : null);
				let l = (e) => e && (c.x || c.y) ? {
					x: e.x + c.x,
					y: e.y + c.y
				} : e, u = (e) => {
					let t = Wn(e);
					return {
						x: t.x - c.x,
						y: t.y - c.y
					};
				};
				if (a) {
					let t = n(e);
					kt.set(e.id, l(t)), At.set(e.id, l(t)), r.style("display", null), r.select(".container-hull").style("display", "none"), r.select(".container-hull-ghost").attr("d", ""), r.select(".container-badge").style("display", "none"), r.select(".container-macro-node").style("display", null).attr("transform", `translate(${t.x}, ${t.y})${ke()}${$t === 1 ? "" : ` scale(${$t})`}`).select(".label-count").text((0, Ws.containerCountText)(S, i.length));
					return;
				}
				let d = v(i, (e) => Wn(e).x), f = v(i, (e) => Wn(e).y);
				kt.set(e.id, {
					x: d,
					y: f
				}), r.style("display", null), r.select(".container-macro-node").style("display", "none"), r.select(".container-hull").style("display", null), r.select(".container-badge").style("display", null);
				let p = [], m = D(e);
				for (let t of gt.get(e.id) || []) {
					if (!U.has(t)) continue;
					let e = mn.get(t), r = e && n(e);
					if (!r) continue;
					let i = Un(e), a = {
						x: r.x + i.x - c.x,
						y: r.y + i.y - c.y
					}, o = (e._macroHalfW || 130) + m / 2, s = (e._macroHalfH || 45) + m / 2;
					p.push([a.x - o, a.y - s], [a.x + o, a.y - s], [a.x + o, a.y + s], [a.x - o, a.y + s]);
				}
				let h = i.filter((e) => {
					for (let t of U) if (yt(t).includes(e.id)) return !1;
					return !0;
				});
				for (let e of h) {
					let t = e._cardScale || 1, n = (e._size?.width || (e.type === "article" ? C.width : e.size)) * t, r = (e._size?.height || (e.type === "article" ? C.height : e.size)) * t, i = n / 2 + m, a = r / 2 + m, o = u(e);
					p.push([o.x - i, o.y - a], [o.x + i, o.y - a], [o.x + i, o.y + a], [o.x - i, o.y + a]);
				}
				let y = jc(e), b = null;
				if (s) {
					let n = m / 2, r = [], i = (e) => {
						for (let n of gt.get(e) || []) {
							if (U.has(n)) continue;
							let e = mn.get(n), a = e && t(e), o = e ? Un(e) : Vn;
							a && jc(e) !== "hidden" && r.push({
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
				let x = eo(p);
				if (!x || x.length < 3) return;
				let w = !!(s && s.info.hang);
				w && (x = pn(x, m / 2));
				let T = w ? fn : dn;
				(0, zs.hullDrawn)(e) ? (r.select(".container-hull").style("display", null).attr("d", T(x)), r.select(".container-hull-ghost").attr("d", Et ? T((0, zo.jitterPoints)(x, e.id, 3.5)) : "")) : (r.select(".container-hull").style("display", "none").attr("d", ""), r.select(".container-hull-ghost").attr("d", ""));
				let E = r.select(".container-badge");
				E.attr("data-label-position", y), E.select(".label-count").text((0, Ws.containerCountText)(S, i.length));
				let O = (t) => {
					let n = Ht(e, t, { family: Kt(e) });
					E.select(".container-badge-hit").attr("x", -n.w / 2).attr("y", -n.h / 2).attr("width", n.w).attr("height", n.h);
				};
				if (y === "hidden") {
					E.style("display", "none"), At.set(e.id, l(b || {
						x: v(x, (e) => e[0]),
						y: v(x, (e) => e[1])
					}));
					return;
				}
				if (y === "top") {
					let t = b ? o : Math.max(gn, Math.min(_n, (g(x, (e) => e[0]) - _(x, (e) => e[0])) / 8)), n = Ht(e, t, { family: Kt(e) }), r = _(x, (e) => e[1]), i = {
						x: (_(x, (e) => e[0]) + g(x, (e) => e[0])) / 2,
						y: r + m * .5 + n.h / 2
					};
					E.select(".container-badge-text").attr("font-size", `${t}px`), O(t), E.attr("transform", `translate(${i.x}, ${i.y})${ke()}`), At.set(e.id, l(i));
					return;
				}
				if (b) {
					E.select(".container-badge-text").attr("font-size", `${o}px`), O(o), E.attr("transform", `translate(${b.x}, ${b.y})${ke()}`), At.set(e.id, l(b));
					return;
				}
				let k = Math.min(...x.map((e) => e[1])), A = Math.max(...x.map((e) => e[1])), j = Math.min(...x.map((e) => e[0])), M = Math.max(...x.map((e) => e[0])), N = Math.max(gn, Math.min(_n, (M - j) / 8));
				E.select(".container-badge-text").attr("font-size", `${N}px`), O(N);
				let P = Xa(x), F = Number.isFinite(P[0]) ? P[0] : v(x, (e) => e[0]);
				E.attr("transform", `translate(${F}, ${k + (A - k) / 3})${ke()}`), At.set(e.id, l({
					x: F,
					y: k + (A - k) / 3
				}));
			});
		}
		let wr = /* @__PURE__ */ new Set();
		function Tr() {
			wr = (0, Ys.closedMemberSet)(U, yt);
			for (let e of o.nodes) e._closedHidden = wr.has(e.id);
			xi && xi.style("display", (e) => wr.has(e.id) ? "none" : null), oi.style("display", (e) => wr.has(e.id) ? "none" : null);
			let e = (e) => (0, Ys.edgeHidden)(e, wr) ? "none" : null;
			Vr.style("display", e), Gr.style("display", e), Br.style("display", e), Jr.style("display", e), Qr && (0, Ys.edgeHidden)(Qr, wr) && ai();
		}
		function Er() {
			Tr(), Nr(), Cr(), Qi();
		}
		function Dr() {
			return Object.fromEntries((o.containers || []).map((e) => [e.id, U.has(e.id) ? "closed" : "open"]));
		}
		function Or(e, t) {
			return kr(t ? { open: e } : { close: e });
		}
		function kr({ open: e = [], close: t = [] }) {
			let n = [], r = [];
			for (let t of e) mn.has(t) && U.has(t) && (U.delete(t), n.push(t));
			for (let e of t) mn.has(e) && !U.has(e) && (U.add(e), r.push(e));
			return !n.length && !r.length ? !1 : (F.current && typeof F.current.setContainers == "function" && F.current.setContainers({
				open: n,
				close: r
			}), Er(), Kn(Mr), typeof window < "u" && window.dispatchEvent(new CustomEvent("graph:containers-changed", { detail: Dr() })), !0);
		}
		let Ar = () => (o.containers || []).map((e) => e.id), jr = {
			openContainer: (e) => Or([e], !0),
			closeContainer: (e) => Or([e], !1),
			toggleContainer: (e) => Or([e], U.has(e)),
			openAllContainers: () => Or(Ar(), !0),
			closeAllContainers: () => kr((0, Ys.closeAllPlan)(o.containers)),
			getContainerState: Dr
		};
		y && (y.current = jr);
		let Mr = null;
		function Nr() {
			if (!o.containers || o.containers.length === 0) return;
			let e = new Map(K.roots.map((e) => [e, wn(e)])), t = /* @__PURE__ */ new Map();
			if (kn()) {
				let e = Nn();
				for (let n of Dn.keys()) {
					let r = Qn(n) ? jn(n) : e.get(n) || jn(n);
					r && t.set(n, r);
				}
			}
			if (cn(), bn(), vr(), kn() && (t = ir(t)), !En()) return;
			let n = [];
			for (let [e, r] of t) {
				let t = zn(e);
				n.push({
					cId: e,
					x0: t ? t.x : r.x,
					y0: t ? t.y : r.y,
					x1: r.x,
					y1: r.y
				});
			}
			let r = (e) => {
				for (let t of n) Pn.set(t.cId, {
					x: t.x0 + (t.x1 - t.x0) * e,
					y: t.y0 + (t.y1 - t.y0) * e
				});
			};
			Mr = t;
			let i = [];
			for (let [e, n] of K.nodes) {
				let r = G.get(e), a = An.get(e);
				if (!r || !Number.isFinite(r.x) || !a || !t.has(a)) continue;
				let o = t.get(a), s = K.containers.get(a);
				s && i.push({
					n: r,
					x0: r.x,
					y0: r.y,
					x1: o.x - s.center.x + n.x,
					y1: o.y - s.center.y + n.y
				});
			}
			if (!oo && !i.length) {
				r(1), H.alpha(Math.max(H.alpha(), .3)).restart();
				return;
			}
			for (let [n, r] of K.nodes) {
				let a = G.get(n), o = e.get(r.root), s = An.get(n);
				s && t.has(s) || !a || !o || !Number.isFinite(a.x) || i.push({
					n: a,
					x0: a.x,
					y0: a.y,
					x1: o.x + r.x,
					y1: o.y + r.y
				});
			}
			Ui("container-relayout").duration(600).ease(qi).tween("container-relayout", () => (e) => {
				for (let t of i) t.n.x = t.x0 + (t.x1 - t.x0) * e, t.n.y = t.y0 + (t.y1 - t.y0) * e, t.n.fx = t.n.x, t.n.fy = t.n.y;
				r(e), Qi(), B.current && B.current();
			}).on("end", () => {
				T || io({ animate: !0 });
			});
		}
		function Pr(e) {
			let t = ye.current === e.id, n = ve.current.has(e.id), r = e._size || R({
				hovered: t,
				pinned: n
			}), i = e._cardScale || 1;
			return {
				w: r.width / 2 * i,
				h: r.height / 2 * i
			};
		}
		function Fr(e) {
			let t = typeof e.source == "object" ? Wn(e.source) : null, n = typeof e.target == "object" ? Wn(e.target) : null, r = t ? t.x : 0, i = t ? t.y : 0, a = n ? n.x : 0, o = n ? n.y : 0, s = typeof e.source == "object" ? e.source.id : e.source, c = typeof e.target == "object" ? e.target.id : e.target;
			if ((0, Ys.edgeHidden)(e, wr)) return {
				x1: 0,
				y1: 0,
				x2: 0,
				y2: 0,
				hidden: !0
			};
			let l = null, u = null;
			for (let e of U) {
				let t = yt(e);
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
				let e = kt.get(l);
				e && (r = e.x, i = e.y);
			}
			if (u) {
				let e = kt.get(u);
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
			let m = d / p, h = f / p, g = Pr(e.source), _ = l ? 90 : g.w + 4, v = l ? 45 : g.h + 4, y = Math.min(Math.abs(m) > 1e-4 ? _ / Math.abs(m) : Infinity, Math.abs(h) > 1e-4 ? v / Math.abs(h) : Infinity), b = Pr(e.target), x = u ? 90 : b.w + 4, S = u ? 45 : b.h + 4, C = Math.min(Math.abs(m) > 1e-4 ? x / Math.abs(m) : Infinity, Math.abs(h) > 1e-4 ? S / Math.abs(h) : Infinity);
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
		function Ir(e, t) {
			if (t.hidden) return "";
			if (e.layer !== "sequence") return `M ${t.x1} ${t.y1} L ${t.x2} ${t.y2}`;
			let n = t.x2 - t.x1, r = t.y2 - t.y1, i = Math.hypot(n, r);
			if (i < 2) return `M ${t.x1} ${t.y1} L ${t.x2} ${t.y2}`;
			let a = (t.x1 + t.x2) / 2, o = (t.y1 + t.y2) / 2, s = -r / i, c = n / i, l = Math.min(48, i * .12), u = a + s * l, d = o + c * l;
			return `M ${t.x1} ${t.y1} Q ${u} ${d} ${t.x2} ${t.y2}`;
		}
		let Lr = /* @__PURE__ */ new Map();
		function Rr(e) {
			if (!Lr.has(e)) {
				let t = "edge-arrow-" + Lr.size;
				p.append("marker").attr("id", t).attr("viewBox", "0 0 10 10").attr("refX", 9).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 13).attr("markerHeight", 13).attr("orient", "auto").append("path").attr("d", "M 0 1 L 10 5 L 0 9 z").style("fill", e).style("fill-opacity", .75), Lr.set(e, t);
			}
			return Lr.get(e);
		}
		let zr = (e) => {
			if (e.layer !== "sequence") return "#8a8f9c";
			let t = typeof e.source == "object" ? e.source.id : e.source;
			return G.get(t)?.containerColor || "var(--gv-accent, #d4af37)";
		}, Br = x.insert("g", ".containers-layer").attr("class", "link-hits").selectAll(".link-hit").data(o.links).enter().append("path").attr("class", "link-hit").attr("fill", "none").style("stroke", "transparent").style("stroke-width", "16px").style("pointer-events", "stroke").style("cursor", "default"), Vr = x.selectAll(".link").data(o.links).enter().append("path").attr("class", (e) => [
			"link",
			e.layer ? `link-${e.layer}` : "",
			e.role ? `link-role-${e.role}` : ""
		].filter(Boolean).join(" ")).attr("fill", "none").attr("data-label", (e) => e.label).attr("marker-end", (e) => e.directed ? `url(#${Rr(zr(e))})` : null).style("stroke", (e) => e.layer === "sequence" ? zr(e) : null).style("stroke-opacity", (e) => e.layer === "sequence" ? .45 : null), Hr = x.append("g").attr("class", "readers-layer").style("display", "none"), Ur = x.append("g").attr("class", "relations-layer").style("display", "none"), Wr = x.insert("g", ".containers-layer").attr("class", "relation-hits"), Gr = x.selectAll(".link-ghost").data(o.links).enter().insert("path", ".link-sequence-pulse").attr("class", "link-ghost").style("stroke", (e) => zr(e)), Kr = (e) => `${_r(e.source)}>${_r(e.target)}`;
		function qr() {
			Gr.attr("d", (e) => Et && e._path ? (0, zo.ghostOf)(e._path, Kr(e)) : "");
		}
		let Jr = x.selectAll(".link-sequence-pulse").data(o.links.filter((e) => e.layer === "sequence")).enter().append("path").attr("class", "link-sequence-pulse").attr("fill", "none").attr("pathLength", 100).style("stroke", (e) => {
			let t = typeof e.source == "object" ? e.source.id : e.source;
			return G.get(t)?.containerColor || "#ffe066";
		}).style("filter", (e) => {
			let t = typeof e.source == "object" ? e.source.id : e.source;
			return `drop-shadow(0 0 4px ${G.get(t)?.containerColor || "#ffd700"})`;
		}), Yr = x.append("g").attr("class", "edge-label").style("pointer-events", "none").style("display", "none"), Xr = Yr.append("rect").attr("fill", "rgba(15, 17, 26, 0.88)").attr("stroke-opacity", .6), Zr = Yr.append("text").attr("text-anchor", "middle").attr("dominant-baseline", "central").attr("font-family", "'Atkinson', sans-serif").attr("font-weight", 600).attr("letter-spacing", "0.04em"), Qr = null, $r = null, ei = null;
		function ti() {
			if (!Qr || !$r) return;
			let e = $r.getTotalLength ? $r.getTotalLength() : 0;
			if (!e) {
				Yr.style("display", "none");
				return;
			}
			let t = $r.getPointAtLength(e / 2), n = be.current || 1, r = 13 / n, i = zr(Qr), a = String(Qr.label).split("\n");
			if (a.length > 1) {
				let e = r * 1.35;
				Zr.attr("font-size", r).style("fill", i).text(null), a.forEach((t, n) => {
					Zr.append("tspan").attr("x", 0).attr("y", (n - (a.length - 1) / 2) * e).text(t);
				});
				let o = (a.reduce((e, t) => Math.max(e, t.length), 0) * .62 + 1.4) * r, s = e * a.length + r * .7;
				Xr.attr("x", -o / 2).attr("y", -s / 2).attr("width", o).attr("height", s).attr("rx", r * .6).style("stroke", i).attr("stroke-width", 1 / n), Yr.attr("transform", `translate(${t.x}, ${t.y})${ke()}`).style("display", null);
				return;
			}
			Zr.attr("font-size", r).style("fill", i).text(Qr.label);
			let o = (Qr.label.length * .62 + 1.4) * r, s = r * 1.7;
			Xr.attr("x", -o / 2).attr("y", -s / 2).attr("width", o).attr("height", s).attr("rx", s / 2).style("stroke", i).attr("stroke-width", 1 / n), Yr.attr("transform", `translate(${t.x}, ${t.y})${ke()}`).style("display", null);
		}
		let ni = !1;
		function ri(e, t) {
			clearTimeout(ei), ei = null, Qr = e, $r = t, e && (e.layer === "relation" || String(e.label).includes("\n")) ? (Yr.raise(), ni = !0) : ii(), ti();
		}
		function ii() {
			if (!ni) return;
			ni = !1;
			let e = x.node().querySelector(":scope > .node");
			e && x.node().insertBefore(Yr.node(), e);
		}
		function ai() {
			clearTimeout(ei), ei = null, Qr = null, $r = null, Yr.style("display", "none"), ii();
		}
		Br.on("mouseenter", function(e, t) {
			ri(t, this);
		}).on("mouseleave", () => {
			ei || ai();
		}).on("click", function(e, t) {
			e.stopPropagation();
			let n = this;
			Ye(e, () => {
				ri(t, n), ei = setTimeout(() => {
					ei = null, ai();
				}, 2500);
			});
		});
		let oi = x.selectAll(".node").data(o.nodes).enter().append("g").attr("class", "node"), si = x.append("g").attr("class", "relation-more").attr("role", "button").style("display", "none").style("cursor", "pointer");
		si.append("rect").attr("class", "relation-more-bg"), si.append("text").attr("class", "relation-more-text").attr("text-anchor", "middle").attr("dominant-baseline", "central");
		let ci = qt().clickDistance(5).container(() => x.node()).filter((e) => {
			if (e.ctrlKey || e.button !== void 0 && e.button !== 0) return !1;
			if (e.pointerType === "touch" || e.type === "touchstart") {
				let t = e.target;
				if (t && t.closest && t.closest(".rp-scroll")) return !1;
			}
			return !0;
		}).on("start", (e, t) => {
			e.sourceEvent && e.sourceEvent.stopPropagation(), t.fx = t.x, t.fy = t.y, t._dragFrom = {
				x: e.x,
				y: e.y
			}, t._dragMoved = !1;
			let n = e.sourceEvent && e.sourceEvent.target, r = !!(n && n.closest && n.closest("[data-resize=\"1\"]")), i = t.type === "article" ? c(Fi(t), "drag", { edge: r }) : "node.move";
			if (t._dragMoves = i === "node.move", t._resizing = i === "node.resize", t._resizing) {
				let n = t._size || R({
					hovered: ye.current === t.id,
					pinned: ve.current.has(t.id)
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
					width: r(n.w + (e.x - n.x) * 2, C.minWidth, C.maxWidth),
					height: r(n.h + (e.y - n.y) * 2, C.minHeight, C.maxHeight)
				}, Ei(t), F.current && F.current.setNodeSize(me(t), t._size.width, t._size.height, { transient: !0 }), Cr();
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
			t.x = e.x, t.y = e.y, t.fx = e.x, t.fy = e.y, F.current && F.current.setNodePosition(me(t), e.x, e.y, { transient: !0 });
			let n = Wn(t);
			oi.filter((e) => e.id === t.id).attr("transform", "translate(" + n.x + "," + n.y + ")" + ke()), xi && xi.filter((e) => e.id === t.id).style("transform", `translate3d(${n.x}px, ${n.y}px, 0px) rotate(var(--gv-unrot, 0deg))${t._cardScale && t._cardScale !== 1 ? ` scale(${t._cardScale})` : ""}`), B.current && B.current(), Vr.each(function(e) {
				let n = typeof e.source == "object" ? e.source.id : e.source, r = typeof e.target == "object" ? e.target.id : e.target;
				(n === t.id || r === t.id) && (e._path = Ir(e, Fr(e)), W(this).attr("d", e._path));
			}), Br.attr("d", (e) => e._path || ""), qr(), ai(), Jr.each(function(e) {
				let n = typeof e.source == "object" ? e.source.id : e.source, r = typeof e.target == "object" ? e.target.id : e.target;
				if (n === t.id || r === t.id) {
					let t = Fr(e);
					W(this).attr("d", Ir(e, t));
				}
			}), Cr();
		}).on("end", (e, t) => {
			let n = F.current;
			if (t._resizing) {
				t._resizing = !1, n && n.commit(), Cr();
				return;
			}
			t.fx = t.x, t.fy = t.y, t._dragMoved && (n && (n.setNodePosition(_e(t), t.x, t.y, { transient: !0 }), n.commit()), Cr());
		});
		oi.call(ci);
		let li = f.append("text").style("font-family", "'Atkinson', sans-serif").style("visibility", "hidden"), ui = "'Atkinson', sans-serif", di = typeof document < "u" ? document.createElement("canvas").getContext("2d") : null;
		function fi(e, t) {
			if (!di) return {
				width: e.length * t * .5,
				ascent: t * .7,
				descent: t * .2
			};
			di.font = "500 " + t + "px 'Atkinson', sans-serif";
			let n = di.measureText(e);
			return {
				width: n.actualBoundingBoxLeft + n.actualBoundingBoxRight,
				ascent: n.actualBoundingBoxAscent,
				descent: n.actualBoundingBoxDescent
			};
		}
		let pi = [];
		function mi(e) {
			let { d: t, textEl: n, rectEl: r, lines: i, fontSize: a, lineH: o } = e, s = i.map((e) => fi(e, a)), c = i.map((e, t) => t * o), l = Math.min(...c.map((e, t) => e - s[t].ascent)), u = Math.max(...c.map((e, t) => e + s[t].descent)), d = -(l + u) / 2, f = l + d, p = u + d, m = Math.max(...s.map((e) => e.width));
			if (n.selectAll("tspan").each(function(e, t) {
				W(this).attr("y", c[t] + d);
			}), r.attr("x", -m / 2 - w.padding).attr("y", f - w.padding).attr("width", m + w.padding * 2).attr("height", p - f + w.padding * 2), e.formsEl) {
				let t = m / 2 + w.padding + 8;
				e.formsEl.attr("x", t), e.formsEl.selectAll("tspan").attr("x", t);
			}
			t._r = Math.hypot(m + w.padding * 2, p - f + w.padding * 2) / 2;
		}
		function hi(e, t) {
			let n = w.padding, r = w.maxWidth, i = w.maxLines, a = e.split(/(?<=-)|\s+/).filter(Boolean), o = (e) => e.join("").replace(/\s+$/, "").trim(), s = [e];
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
		let gi = (e, t) => e.length > 1 ? t * 1 : t * 1.1;
		function _i() {
			let e = f.append("text").style("font-family", ui).style("visibility", "hidden").style("font-size", w.fontSize + "px").style("font-weight", "500");
			return {
				widthOf: (t) => (e.text(t), e.node().getComputedTextLength()),
				remove: () => e.remove()
			};
		}
		let vi = (e) => {
			if (!e._groupKey) return null;
			let t = o.nodes.filter((t) => t._groupedInto === e.id);
			return t.length ? [e, ...t].map((e) => e.label) : null;
		};
		function yi(t, n, r) {
			let i = n.type === "tag" ? (0, cc.tagFormsLines)((0, cc.tagForms)(e._rtagz, n.concept || n.label, e.items), {
				rtagz: e._rtagz,
				members: vi(n)
			}) : [];
			if (!i.length) return null;
			let a = Math.round(r * .65), o = a * 1.25, s = t.append("text").attr("class", "tag-forms").attr("text-anchor", "start").attr("dominant-baseline", "central").style("font-family", ui).style("font-size", a + "px").style("font-weight", "500").style("fill", "var(--text, #ccc)").style("pointer-events", "none").style("display", "none");
			return i.forEach((e, t) => {
				s.append("tspan").attr("y", (t - (i.length - 1) / 2) * o).text(e);
			}), s;
		}
		oi.each(function(e) {
			let t = W(this);
			if (e.type !== "article") {
				let n = w.fontSize;
				li.style("font-size", n + "px").style("font-weight", "500");
				let r = hi(e.label, (e) => (li.text(e), li.node().getComputedTextLength())), i = gi(r, n), a = t.append("text").attr("text-anchor", "middle").attr("fill", "#1a1a2e").style("font-family", ui).style("font-size", n + "px").style("font-weight", "500").style("pointer-events", "none");
				r.forEach((e) => {
					a.append("tspan").attr("x", 0).text(e);
				});
				let o = {
					d: e,
					el: t,
					textEl: a,
					rectEl: t.insert("rect", "text").attr("rx", w.cornerRadius).attr("ry", w.cornerRadius).attr("fill", "var(--gv-" + (e.type === "tag" ? "tag-color" : e.type === "topology" ? "topology-color" : "placeholder-color") + ")").attr("opacity", w.opacity),
					formsEl: yi(t, e, n),
					lines: r,
					fontSize: n,
					lineH: i
				};
				pi.push(o), mi(o);
			} else {
				let t = R({
					hovered: !1,
					pinned: !1
				});
				e._r = Math.hypot(t.width, t.height) / 2;
			}
		}), li.remove(), typeof document < "u" && document.fonts && document.fonts.ready && document.fonts.ready.then(() => {
			pi.forEach(mi);
		}).catch(() => {});
		let bi = /* @__PURE__ */ new Map(), xi = b.selectAll(".node-card").data(o.nodes.filter((e) => e.type === "article")), Si = xi.enter().append("div").attr("class", "node-card").style("position", "absolute").style("left", "0").style("top", "0").style("will-change", "transform").style("pointer-events", "auto").style("touch-action", "manipulation").call(ci);
		xi = xi.merge(Si), Si.filter((e) => !!e.link).attr("tabindex", 0).attr("role", "link").attr("data-link-node", "").attr("aria-label", (e) => [
			e.title,
			e.subtitle,
			e.description
		].filter(Boolean).join(". ")).on("keydown", (e, t) => {
			e.key === "Enter" && (e.preventDefault(), e.stopPropagation(), (0, oc.followLink)(t.originalItem || t, { settings: vc() }));
		}), Si.each(function(e) {
			let t = u(this);
			bi.set(e.id, {
				root: t,
				wrapper: this,
				cardSelection: W(this)
			});
		});
		let Ci = null, wi = /* @__PURE__ */ new Map();
		function Ti() {
			return Ci !== de.current && (Ci = de.current, wi = (0, ac.countsByChapter)(Ci)), wi;
		}
		function Ei(e) {
			if (e.type !== "article") return;
			let n = bi.get(e.id);
			if (!n) return;
			let r = ye.current === e.id, i = ve.current.has(e.id), a = (0, $s.getLOD)(be.current), o = R({
				hovered: r,
				pinned: i
			}), s = e._size || (e._customWidth && e._customHeight ? {
				width: e._customWidth,
				height: e._customHeight
			} : null), c = s ? s.width : o.width, u = s ? s.height : o.height;
			n.wrapper.style.width = c + "px", n.wrapper.style.height = u + "px", n.wrapper.style.marginLeft = -c / 2 + "px", n.wrapper.style.marginTop = -u / 2 + "px";
			let d = rs(e.kind), f = F.current, p = f ? f.bookmarks(me(e)) : [], m = S.readingProgress !== !1 && f && f.readingProgress ? f.readingProgress(me(e)) : null, h = Ti().get(e.id) || 0;
			n.root.render(t.createElement(d, {
				article: e,
				sourceColor: xc(e, I),
				width: c,
				height: u,
				viewState: {
					hovered: r,
					pinned: i,
					lod: a,
					zoomScale: be.current,
					bookmarks: p,
					bookmarkCount: p.length,
					progress: m,
					contributionCount: h
				},
				fullContent: e._fullContent || null,
				cardSettings: C,
				onResize: l ? ({ width: t, height: r }) => {
					e._customWidth = t, e._customHeight = r, e._size = {
						width: t,
						height: r
					}, n.wrapper.style.width = t + "px", n.wrapper.style.height = r + "px", n.wrapper.style.marginLeft = -t / 2 + "px", n.wrapper.style.marginTop = -r / 2 + "px", e._r = Math.max(t, r) / 2, Ei(e);
				} : void 0
			}));
		}
		xi.on("wheel", (e) => e.stopPropagation());
		function Di() {
			o.nodes.forEach((e) => {
				e.type === "article" && Ei(e);
			});
		}
		ae.current = Di;
		let Oi = /* @__PURE__ */ new Map();
		function ki(e) {
			if ((e.originalItem && e.originalItem._posted) === "title") return e._fullContent = null, Promise.resolve();
			if (Oi.has(e.id)) return e._fullContent = Oi.get(e.id), Promise.resolve();
			let t = (e.url || "").split("/").pop();
			return (async () => {
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
				Oi.set(e.id, i), e._fullContent = i;
			}).catch(() => {
				Oi.set(e.id, null), e._fullContent = null;
			});
		}
		Di(), ve.current.forEach((e) => {
			let t = o.nodes.find((t) => t.id === e);
			t && (xi.filter((t) => t.id === e).raise().style("z-index", 10), ki(t).then(() => {
				ve.current.has(e) && Ei(t);
			}));
		}), Dc(f, h, Se.current, I, L(), te()), xi.on("mouseover", (e, t) => {
			ye.current !== t.id && (ye.current = t.id, Ei(t), e.currentTarget.style.zIndex = 10);
		}).on("mouseout", (e, t) => {
			let n = e.relatedTarget;
			n && e.currentTarget.contains(n) || ye.current === t.id && (ye.current = null, Ei(t), e.currentTarget.style.zIndex = "");
		}).on("dblclick", (e, t) => {
			if (e.stopPropagation(), e.preventDefault(), t.link || Date.now() - Ai < 300) return;
			let n = e.target;
			n && (n.dataset?.popout === "1" || n.closest?.("[data-popout=\"1\"]")) || (Ge.cancel(), ji(t, e.currentTarget, qe(e)));
		}).on("click", (e, t) => {
			if (t.link) {
				e.stopPropagation(), Ge.cancel(), (0, oc.followLink)(t.originalItem || t, { settings: vc() });
				return;
			}
			let n = e.target;
			if (n && (n.dataset?.popout === "1" || n.closest?.("[data-popout=\"1\"]"))) {
				e.stopPropagation(), j.current && j.current(t.originalItem || t), ve.current.has(t.id) && (ve.current.delete(t.id), F.current && F.current.setNodePinned(me(t), !1), ye.current = null, Ei(t), e.currentTarget.style.zIndex = "");
				return;
			}
			e.stopPropagation();
			let r = e.currentTarget, i = qe(e);
			Ye(e, () => Ue(c(Fi(t), "tap"), {
				d: t,
				cardEl: r,
				...i
			}), () => ji(t, r, i));
		});
		let Ai = 0;
		function ji(e, t, n) {
			Ai = Date.now(), Ue(c(Fi(e), "doubletap"), {
				d: e,
				cardEl: t,
				...n
			});
		}
		let Mi = (0, Qs.readablePxOf)(S);
		function Ni(e) {
			let t = bi.get(e.id);
			if (!t) return 0;
			try {
				d(() => Ei(e));
			} catch {}
			let n = t.wrapper.querySelector("[data-card-title]");
			return n && parseFloat(getComputedStyle(n).fontSize) || 0;
		}
		let Pi = (e) => (0, Qs.titleScreenPx)(Ni(e), Oe.k, e._cardScale || 1), Fi = (e) => Pi(e) >= Mi ? "node.readable" : "node";
		function Ii(e, t) {
			let n = {
				x: e.x,
				y: e.y
			}, r = In() ? An.get(e.id) : null, i = r && Dn.has(r) ? zn(r) : null;
			if (i && De > 0) {
				let e = (0, qs.growShift)(i, Ln(), t.k / De);
				n = {
					x: n.x + e.x,
					y: n.y + e.y
				};
			}
			let a = (0, Gs.viewToScreen)(t, Ce, n.x, n.y);
			return {
				x: a[0],
				y: a[1]
			};
		}
		function Li(e, t, n, a = 0) {
			let o = bi.get(e.id);
			if (!o || a > 2) return;
			let s = e._cardScale || 1, c = Ni(e) || (Number.isFinite(C.labelMinFontSize) ? C.labelMinFontSize : 14), l = Do(f.node()), u = (0, Qs.readableZoom)(l.k, (0, Qs.titleScreenPx)(c, l.k, s), Mi, uo);
			if (In() && (u = Math.min(u, Math.max(l.k, Gn()))), !(u > l.k * 1.000000001)) return;
			let [d, p] = fo(), m = (0, Ks.zoomAbout)(l, u / l.k, d, p), h = parseFloat(o.wrapper.style.width) || C.width, g = parseFloat(o.wrapper.style.height) || C.height, _ = no(i), v = (0, Qs.keepUnderFinger)({
				finger: Number.isFinite(t) && Number.isFinite(n) ? {
					x: t,
					y: n
				} : null,
				before: Ii(e, l),
				after: Ii(e, m),
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
			}), y = Eo.translate(m.x + v.x, m.y + v.y).scale(m.k);
			T = !0, M = !1, f.transition("key-zoom").duration(320).ease(Ki).call(Ne.transform, y, [d, p]).on("end", () => setTimeout(() => {
				Pi(e) < Mi && Li(e, t, n, a + 1);
			}, 80));
		}
		function Ri(e) {
			Ai = Date.now(), j.current && j.current(e.originalItem || e);
		}
		function zi(e, t) {
			ve.current.has(e.id) ? (ve.current.delete(e.id), F.current && F.current.setNodePinned(me(e), !1), Ei(e), t.style.zIndex = "", N.current === e.id && P(null)) : (ve.current.add(e.id), P(e), F.current && F.current.setNodePinned(me(e), !0), Ei(e), oi.filter((t) => t.id === e.id).raise(), xi.filter((t) => t.id === e.id).raise(), t.style.zIndex = 10, ki(e).then(() => {
				ve.current.has(e.id) && Ei(e);
			}));
		}
		let Bi = null, Vi = null, Hi = null;
		function Wi() {
			oi.select(".tag-forms").style("display", (e) => e && (e.id === Bi || e.id === Hi) ? null : "none");
		}
		oi.filter((e) => e.type === "tag").on("mouseenter", (e, t) => {
			Hi = t.id, Wi();
		}).on("mouseleave", (e, t) => {
			Hi === t.id && (Hi = null, Wi());
		}), oi.filter((e) => e.type !== "article").on("click", (e, t) => {
			e.stopPropagation(), Ye(e, () => Gi(t));
		});
		function Gi(e, { chosen: t = null } = {}) {
			let n = t ? t.id : e.id, r = Bi === e.id && (!t || Vi === n);
			Bi = r ? null : e.id, Vi = r ? null : n, ca = !1, ba({ force: !0 }), Wi(), Yi();
		}
		function Ji() {
			if (!Bi) {
				oi.classed("dimmed", !1).classed("tag-active", !1), xi.classed("dimmed", !1), Vr.classed("highlighted", !1);
				return;
			}
			let e = Bi, t = new Set(o.links.filter((t) => {
				let n = typeof t.source == "object" ? t.source.id : t.source, r = typeof t.target == "object" ? t.target.id : t.target;
				return n === e || r === e;
			}).map((t) => {
				let n = typeof t.source == "object" ? t.source.id : t.source, r = typeof t.target == "object" ? t.target.id : t.target;
				return n === e ? r : n;
			}));
			t.add(e);
			for (let e of ua) t.add(e.id);
			oi.classed("dimmed", (e) => !t.has(e.id)), oi.classed("tag-active", (t) => t.id === e), xi.classed("dimmed", (e) => !t.has(e.id)), Vr.classed("highlighted", (t) => {
				let n = typeof t.source == "object" ? t.source.id : t.source, r = typeof t.target == "object" ? t.target.id : t.target;
				return n === e || r === e;
			});
		}
		function Yi() {
			typeof window > "u" || window.dispatchEvent(new CustomEvent("graph:tag-changed", { detail: { id: Bi } }));
		}
		f.on("click", (e) => {
			let t = qe(e);
			Ye(e, () => Ue(c("space", "tap"), t));
		});
		function Xi() {
			ai(), Bi && (Bi = null, Vi = null, ca = !1, ba({ force: !0 }), Wi(), Yi()), j.current && j.current(null);
		}
		function Zi() {
			Vr.each(function(e) {
				e._path = Ir(e, Fr(e)), W(this).attr("d", e._path);
			}), Br.attr("d", (e) => e._path || ""), Jr.attr("d", (e) => e._path || ""), qr(), Qr && ti();
		}
		function Qi() {
			Bn(), Zi(), oi.attr("transform", (e) => {
				let t = Wn(e);
				return "translate(" + t.x + "," + t.y + ")" + ke();
			}), xi && xi.style("transform", (e) => {
				let t = Wn(e);
				return `translate3d(${t.x}px, ${t.y}px, 0px) rotate(var(--gv-unrot, 0deg))${e._cardScale && e._cardScale !== 1 ? ` scale(${e._cardScale})` : ""}`;
			}), Cr(), oe.current && oe.current(), fe.current && fe.current(), pe.current && pe.current({ paintOnly: !0 }), ta();
		}
		let $i = null;
		function ea() {
			if ($i = null, typeof document > "u") return;
			let e = document.querySelector("[data-rights][data-rights-position=\"bottom-edge\"]");
			if (!e) return;
			let t = [];
			xi && xi.each(function(e) {
				e._closedHidden || this.style.display === "none" || t.push(this.getBoundingClientRect());
			});
			let n = (0, sc.rightsOverCards)(e.getBoundingClientRect(), t);
			n !== e.hasAttribute("data-rights-over") && e.toggleAttribute("data-rights-over", n);
		}
		function ta() {
			$i || typeof requestAnimationFrame > "u" || ($i = requestAnimationFrame(ea));
		}
		function na() {
			let e = F.current;
			return !!(e && e.preference && e.preference("readers") === !0);
		}
		let ra = [];
		function ia() {
			Hr.selectAll("*").remove(), ra = (0, ac.connectionEdges)(de.current).map((e) => {
				let t = G.get(e.source), n = G.get(e.target);
				if (!t || !n) return null;
				let r = Hr.append("g").attr("class", "readers-edge").attr("data-readers-edge", e.id);
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
		function aa({ rebuild: e = !1 } = {}) {
			e && ia();
			let t = na();
			if (Hr.style("display", t && ra.length ? null : "none").attr("data-on", t ? "true" : "false"), t) for (let e of ra) {
				let t = Fr(e.l), n = t.hidden ? "" : `M ${t.x1} ${t.y1} L ${t.x2} ${t.y2}`;
				e.line.attr("d", n);
			}
		}
		fe.current = aa, ia();
		let oa = /* @__PURE__ */ new Map();
		oi.each(function(e) {
			oa.set(e.id, this);
		});
		let sa = new Map(pi.map((e) => [e.d.id, e])), ca = !1, ua = [], da = "";
		function fa(e) {
			let t = G.get(e);
			if (!t || t.type !== "tag" || t._groupedInto) return !1;
			let n = oa.get(e);
			return !!(n && n.style.display !== "none");
		}
		function pa(e) {
			let t = G.get(e);
			return t && t._groupedInto ? t._groupedInto : e;
		}
		function ma() {
			let e = F.current;
			return (0, pc.foldedChoice)(e && e.preference ? e.preference(pc.FOLDED_PREF) : null);
		}
		function ha() {
			let e = te();
			return e === null ? null : (0, gc.shownAt)(Cc(o.links, G), e).hiddenTags;
		}
		function ga() {
			let e = Vi || Bi;
			if (!e || !o.relations.length || !fa(pa(e))) return null;
			let t = ha();
			return (0, pc.drawnRelativesOf)(o.relations, e, {
				visible: fa,
				present: t ? (e) => !t.has(e) : void 0,
				bubbleOf: pa,
				folded: ma(),
				limit: ca ? Infinity : pc.STRONGEST
			});
		}
		function _a(e, t, n) {
			let r = sa.get(e);
			if (!r) return 0;
			let i = (Number(r.rectEl.attr("width")) || 0) / 2 + 2, a = (Number(r.rectEl.attr("height")) || 0) / 2 + 2, o = Ce * Math.PI / 180, s = t * Math.cos(o) - n * Math.sin(o), c = t * Math.sin(o) + n * Math.cos(o);
			return Math.min(Math.abs(s) > 1e-4 ? i / Math.abs(s) : Infinity, Math.abs(c) > 1e-4 ? a / Math.abs(c) : Infinity);
		}
		function va(e) {
			if (Qr && Qr.layer === "relation" && ai(), Ur.selectAll("*").remove(), Wr.selectAll("*").remove(), ua = [], si.style("display", "none"), !e || !e.relatives.length) {
				Ur.style("display", "none");
				return;
			}
			Ur.style("display", null);
			for (let t of e.relatives) {
				let n = t.broader === e.from ? t.id : e.from, r = n === e.from ? t.id : e.from, i = [...new Set(t.relations.map((e) => e.layer))], a = {
					source: G.get(n),
					target: G.get(r),
					layer: "relation",
					directed: t.broader !== null,
					label: (0, pc.relativeLabel)(t)
				}, o = Ur.append("path").attr("class", ["relation-line", ...i.map((e) => `relation-${e}`)].join(" ")).attr("fill", "none").attr("data-relation", t.id).attr("data-relation-types", i.join(" ")).attr("data-relation-folded", t.members ? t.members.map((e) => e.id).join("|") : null).attr("marker-end", a.directed ? "url(#relation-arrow)" : null), s = Wr.append("path").attr("class", "relation-hit").attr("fill", "none").attr("data-relation", t.id).style("stroke", "transparent").style("stroke-width", "16px").style("pointer-events", "stroke").style("cursor", "default").on("mouseenter", function() {
					ri(a, this);
				}).on("mouseleave", () => {
					ei || ai();
				}).on("click", function(e) {
					e.stopPropagation();
					let t = this;
					Ye(e, () => {
						ri(a, t), ei = setTimeout(() => {
							ei = null, ai();
						}, 2500);
					});
				});
				ua.push({
					id: t.id,
					l: a,
					line: o,
					hit: s
				});
			}
			let t = ca ? Math.max(0, e.total - pc.STRONGEST) : e.more;
			t > 0 && (si.attr("data-relation-more", ca ? "all" : "strongest").attr("aria-expanded", ca ? "true" : "false").attr("aria-label", ca ? `${pc.STRONGEST} related tags` : `${e.total} related tags`).style("display", null), si.select("text").text(`${ca ? "−" : "+"}${t}`));
		}
		function ya() {
			if (!ua.length) return;
			for (let e of ua) {
				let t = e.l.source, n = e.l.target, r = "";
				if (t && n) {
					let e = Wn(t), i = Wn(n), a = i.x - e.x, o = i.y - e.y, s = Math.hypot(a, o);
					if (s > 1) {
						let c = a / s, l = o / s, u = _a(t.id, c, l), d = _a(n.id, c, l);
						s > u + d + 2 && (r = `M ${e.x + c * u} ${e.y + l * u} L ${i.x - c * d} ${i.y - l * d}`);
					}
				}
				e.line.attr("d", r), e.hit.attr("d", r);
			}
			let e = Bi ? G.get(Bi) : null;
			if (e && si.style("display") !== "none") {
				let t = be.current || 1, n = sa.get(e.id), r = Math.max(w.fontSize * .6, 12 / t), i = (si.select("text").text().length * .62 + 1.6) * r, a = r * 1.6, o = (n ? (Number(n.rectEl.attr("y")) || 0) + (Number(n.rectEl.attr("height")) || 0) : w.fontSize) + a / 2 + 4 / t;
				si.select("rect").attr("x", -i / 2).attr("y", -a / 2).attr("width", i).attr("height", a).attr("rx", a / 2).attr("stroke-width", 1 / t), si.select("text").attr("font-size", r);
				let s = Wn(e);
				si.attr("transform", `translate(${s.x}, ${s.y})${ke()} translate(0, ${o})`);
			}
			Qr && Qr.layer === "relation" && ti();
		}
		function ba({ force: e = !1, paintOnly: t = !1 } = {}) {
			if (e || !t) {
				Vi && pa(Vi) !== Bi && (Bi = pa(Vi), Wi(), Yi());
				let t = ga(), n = t ? [
					Bi,
					Vi,
					ca ? "all" : "strongest",
					t.more,
					...t.relatives.map((e) => `${e.id}>${e.broader || ""}${e.members ? `=${e.members.map((e) => e.id).join(",")}` : ""}`)
				].join("\0") : "";
				(e || n !== da) && (da = n, va(t), Ji());
			}
			ya();
		}
		function xa(e) {
			e && (e.stopPropagation(), e.preventDefault()), ca = !ca, ba({ force: !0 });
		}
		si.attr("tabindex", 0).on("click", (e) => xa(e)).on("dblclick", (e) => {
			e.stopPropagation(), e.preventDefault();
		}).on("keydown", (e) => {
			(e.key === "Enter" || e.key === " ") && xa(e);
		}), pe.current = ba;
		let Sa = S.roots ? S.roots === !0 ? {} : S.roots : null, Ca = [], wa = null, Ta = !1;
		if (Sa) {
			let e = /* @__PURE__ */ new Map();
			for (let [t, n] of _t) for (let r of n) e.set(r, t);
			let t = o.links.filter((e) => e.layer === "sequence").map((e) => ({
				source: _r(e.source),
				target: _r(e.target)
			})), n = (o.containers || []).find((e) => !e.parent), r = String(Sa.seed || n && n.id || "roots");
			Ca = (0, tc.rootSegments)({
				containers: o.containers || [],
				memberOf: e,
				sequence: t
			}).map((e) => {
				let t = mt.append("g").attr("class", "root").attr("data-root", e.key).style("display", "none");
				return {
					...e,
					shape: (0, tc.rootShape)(r + "|" + e.key),
					el: t,
					main: t.append("path").attr("class", "root-main").attr("fill", "none").attr("vector-effect", "non-scaling-stroke"),
					fine: t.append("path").attr("class", "root-fine").attr("fill", "none").attr("vector-effect", "non-scaling-stroke"),
					state: "hidden"
				};
			});
		}
		function Ea(e) {
			if (e.node) {
				let t = G.get(e.node);
				if (!t || !Number.isFinite(t.x) || wr.has(t.id) || t._source && Se.current.has(t._source.id)) return null;
				let n = Wn(t);
				return {
					x: n.x,
					y: n.y
				};
			}
			return At.get(e.container) || null;
		}
		function Da(e) {
			let t = F.current;
			if (!t || !t.readingProgress) return "hidden";
			let n = (e) => {
				let n = G.get(e);
				return n ? t.readingProgress(me(n)) : {
					seen: !1,
					done: !1
				};
			};
			if (e.node) {
				let t = n(e.node);
				return t.done ? "done" : t.seen || t.max > 0 ? "seen" : "hidden";
			}
			let r = yt(e.container).map(n);
			return !r.length || !r.some((e) => e.seen || e.max > 0) ? "hidden" : r.every((e) => e.done) ? "done" : "seen";
		}
		function Oa() {
			if (wa = null, Ca.length) {
				for (let e of Ca) {
					let t = Da(e.reach), n = Ea(e.from), r = Ea(e.to);
					if (t === "hidden" || !n || !r) {
						e.el.style("display", "none"), t === "hidden" && (e.state = "hidden");
						continue;
					}
					let i = (0, tc.rootPath)(n, r, e.shape);
					if (e.main.attr("d", i.main), e.fine.attr("d", i.fine), e.el.style("display", null).attr("data-state", t), e.state === "hidden" && Ta) {
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
				Ta = !0;
			}
		}
		function ka() {
			!Ca.length || wa || (wa = typeof requestAnimationFrame < "u" ? requestAnimationFrame(Oa) : setTimeout(Oa, 16));
		}
		oe.current = Sa ? ka : null;
		let Aa = !1;
		ne.current = {
			data: o,
			nodes: oi,
			articleNodes: xi,
			links: Vr,
			applyPositions: Qi,
			svg: f,
			zoom: Ne,
			fitToViewport: io,
			simulation: H,
			axisLayer: pt,
			g: x,
			updateContainers: Cr,
			ringTargets: br,
			recomputeContainers: xr,
			toScreen: Me,
			drawnAt: Wn
		}, Te = !0;
		function ja() {
			if (On = typeof window < "u" && window.PostPipeCoverFrame || null, !kn()) return;
			H.force("center", null);
			let e = [...Dn.keys()].filter((e) => qn.has(e) || !Qn(e));
			if (Cn()) {
				bn(), vr();
				for (let t of e) nr(t);
			}
			let t = or();
			e.length && ar(e), (e.length || t) && Qi(), T || ro(!1);
		}
		window.addEventListener("postpipe:cover-frame", ja), ja();
		let Ma = () => ta();
		window.addEventListener("postpipe:cover", Ma), window.addEventListener("resize", Ma);
		let Na = !1, Pa = new Map(o.nodes.map((e) => [e.id, e]));
		function Fa() {
			if (Na || z.current !== "force") return !1;
			let e = [];
			for (let t of o.nodes) {
				if (t.type !== "article" || !ve.current.has(t.id) || t._closedHidden || !Number.isFinite(t.x) || !Number.isFinite(t.y)) continue;
				let n = t._size || R({
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
			let t = (0, ec.separateOpen)(e, { gap: 12 });
			for (let [e, n] of t) {
				let t = Pa.get(e);
				t && (t.x = n.x, t.y = n.y, t.vx = 0, t.vy = 0, t.fx != null && (t.fx = n.x), t.fy != null && (t.fy = n.y));
			}
			return t.size > 0;
		}
		let La = 0;
		H.nodes(o.nodes).on("tick", () => {
			Fa(), Qi(), Aa ||= io({ initialZoomOut: !0 }), B.current && B.current(), ++La, ie.current && La % 25 == 0 && ie.current();
		}), H.force("link").links(o.links);
		let Ra = e && e._rtagz, Ba = pi.filter((e) => e.d.type === "tag" && e.d.concept), Va = o.links.filter((e) => e.layer === "tag"), Ha = {
			scheme: lc.SITE_SCHEME,
			depth: 0
		}, Ua = new Set((0, lc.schemesOf)(e).map((e) => e.id)), Wa = () => {
			let e = F.current, t = e && e.preference ? e.preference("conceptScheme") : null, n = e && e.preference ? Number(e.preference("broaderDepth")) : 0;
			return {
				scheme: typeof t == "string" && t && Ua.has(t) ? t : lc.SITE_SCHEME,
				depth: Number.isFinite(n) ? Math.max(0, Math.min(2, Math.round(n))) : 0
			};
		}, Ga = (e) => Number.isFinite(e) && e > 0 ? e : 0;
		function Ka(e, t, n) {
			let { d: r, el: i, textEl: a, fontSize: o } = e, s = t || r.label, c = (vi(r) || []).join("\0");
			if (r._shownLabel === s && !!e.fallback == !!n && e.membersKey === c) return;
			e.membersKey = c, r._shownLabel = s, e.fallback = !!n;
			let l = _i(), u = hi(s, l.widthOf);
			l.remove(), a.selectAll("tspan").remove(), u.forEach((e) => {
				a.append("tspan").attr("x", 0).text(e);
			}), e.lines = u, e.lineH = gi(u, o), i.classed("tag-fallback", e.fallback), e.formsEl && e.formsEl.remove(), e.formsEl = yi(i, r, o), mi(e);
		}
		let qa = (e) => Va.filter((t) => _r(t._origTarget || t.target) === e).length;
		function Za() {
			let e = !1, t = z.current === "force", n = F.current;
			for (let e of Va) e._origTarget !== void 0 && (e.target = e._origTarget, delete e._origTarget, delete e._dupByGroup);
			for (let r of o.nodes) {
				let i = !1;
				if (r._groupedInto && (e = !0, i = !0, delete r._groupedInto, r._groupSaved && (t && (r.fx = r._groupSaved.fx, r.fy = r._groupSaved.fy), delete r._groupSaved)), r._groupKey && (e = !0, i = !0, delete r._groupKey, r._preGroupPos)) {
					let e = r._preGroupPos;
					t && (r.x = e.x, r.y = e.y, r.fx = e.fx, r.fy = e.fy), delete r._preGroupPos;
				}
				if (i && !t && n && n.nodeState) {
					let e = n.nodeState(_e(r));
					e && Number.isFinite(e.x) && Number.isFinite(e.y) && (r.x = e.x, r.y = e.y, r.fx = e.x, r.fy = e.y);
				}
			}
			return e;
		}
		function Qa({ scheme: e, depth: t }) {
			if (!Ba.length) return;
			let n = Za(), r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
			for (let n of Ba) {
				let a = (0, lc.labelFor)(Ra, n.d.concept, {
					scheme: e,
					depth: t,
					systems: n.d.systems
				});
				r.set(n.d.id, a);
				let o = a.groupId || n.d.concept;
				i.has(o) || i.set(o, []), i.get(o).push(n.d);
			}
			let a = !1, s = F.current;
			for (let [e, n] of Ga(t) > 0 ? i : []) {
				if (n.length === 1 && n[0].concept === e) continue;
				a = !0;
				let t = n.filter((t) => t.concept === e), r = (t.length ? t : n).slice().sort((e, t) => qa(t.id) - qa(e.id) || (e.id < t.id ? -1 : +(e.id > t.id)))[0];
				r._preGroupPos = {
					x: r.x,
					y: r.y,
					fx: r.fx,
					fy: r.fy
				}, r._groupKey = "concept:" + e;
				let i = s && s.nodeState ? s.nodeState(ge(z.current) + r._groupKey) : null;
				if (i && Number.isFinite(i.x) && Number.isFinite(i.y)) r.x = i.x, r.y = i.y, (!i.auto || r.fx != null) && (r.fx = i.x, r.fy = i.y);
				else {
					let e = bc(n);
					e && (r.x = e.x, r.y = e.y, r.fx != null && (r.fx = e.x, r.fy = e.y));
				}
				let o = new Set(Va.filter((e) => _r(e.target) === r.id).map((e) => _r(e.source)));
				for (let e of n) if (e !== r) {
					e._groupedInto = r.id, e._groupSaved = {
						fx: e.fx,
						fy: e.fy
					}, e.fx = e.x, e.fy = e.y;
					for (let t of Va) {
						if (_r(t.target) !== e.id) continue;
						t._origTarget = t.target, t.target = r;
						let n = _r(t.source);
						o.has(n) ? t._dupByGroup = !0 : o.add(n);
					}
				}
			}
			for (let e of Ba) {
				if (e.d._groupedInto) continue;
				let t = r.get(e.d.id);
				Ka(e, t.label, t.fallback && t.label);
			}
			n || a ? (H.force("link").links(o.links.filter((e) => !e._dupByGroup)), H.force("charge").strength(H.force("charge").strength()), H.force("collide").radius(H.force("collide").radius()), Dc(f, h, Se.current, I, L(), te()), Qi(), H.alpha(Math.max(H.alpha(), .3)).restart()) : (H.force("collide").radius(H.force("collide").radius()), Qi());
		}
		if (ce.current = () => {
			let e = Wa();
			e.scheme === Ha.scheme && e.depth === Ha.depth || (Ha = e, Qa(e));
		}, Ba.length) {
			let e = Wa();
			(e.scheme !== lc.SITE_SCHEME || e.depth !== 0) && (Ha = e, Qa(e));
		}
		Fa(), Aa ||= io({ initialZoomOut: !0 }), Qi();
		function $a() {
			if (!En() || K.roots.length === 0) return null;
			let e = [], t = kn();
			if (t) for (let t of Dn.keys()) {
				let n = K.containers.get(t), r = n && Tn(t);
				!r || Sr(mn.get(t)) || e.push({
					x0: r.x + n.box.x0,
					y0: r.y + n.box.y0,
					x1: r.x + n.box.x1,
					y1: r.y + n.box.y1
				});
			}
			for (let n of K.roots) {
				let r = K.containers.get(n), i = wn(n);
				!r || !i || t && yt(n).every((e) => An.has(e)) || yt(n).every((e) => Se.current.has(G.get(e)?._source?.id)) || e.push({
					x0: i.x + r.box.x0,
					y0: i.y + r.box.y0,
					x1: i.x + r.box.x1,
					y1: i.y + r.box.y1
				});
			}
			for (let t of o.nodes) {
				if (t.type !== "article" || K.nodes.has(t.id) || !Number.isFinite(t.x) || t._source && Se.current.has(t._source.id)) continue;
				let n = (t._size?.width || C.width) / 2, r = (t._size?.height || C.height) / 2;
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
		function to() {
			if (!M || !En()) return null;
			let e = S.initialFocus, t = K.containers.get(e), n = mn.get(e);
			if (!t || !n || U.has(e) || Sr(n)) return null;
			let r = Tn(e);
			if (!r) return null;
			let i = {
				x0: r.x + t.box.x0,
				y0: r.y + t.box.y0,
				x1: r.x + t.box.x1,
				y1: r.y + t.box.y1
			}, a = K.containers.get(t.root), o = a && wn(t.root), s = o ? {
				x0: o.x + a.box.x0,
				y0: o.y + a.box.y0,
				x1: o.x + a.box.x1,
				y1: o.y + a.box.y1
			} : null, c = (e, t) => {
				if (!e) return e;
				let n = { ...e };
				for (let e of yt(t)) {
					let t = G.get(e);
					if (!t || t.type !== "article" || t._closedHidden || !Number.isFinite(t.x) || !Number.isFinite(t.y)) continue;
					let r = t._size || R({
						hovered: !1,
						pinned: ve.current.has(t.id)
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
		function no(e) {
			let t = {
				top: 0,
				bottom: 0
			};
			if (typeof document > "u" || !O.current) return t;
			let n = O.current.getBoundingClientRect(), r = 0, i = 0;
			for (let t of document.querySelectorAll("[data-feeds], [data-settings-gear], [data-rights], [data-toolbar]")) {
				let a = t.getBoundingClientRect();
				!a.width || !a.height || (a.top >= n.top + e / 2 ? i = Math.max(i, n.top + e - a.top) : a.bottom <= n.top + e / 2 && (r = Math.max(r, a.bottom - n.top)));
			}
			return {
				top: Math.max(0, Math.min(e / 4, r)),
				bottom: Math.max(0, Math.min(e / 3, i))
			};
		}
		function ro(e, { resetRot: t = !1, recordRot: n = !1 } = {}) {
			let r = (0, rc.homeView)(he), i = Eo.translate(r.x, r.y).scale(r.k);
			De = r.k, t && He({
				repaint: !1,
				record: n
			});
			let a = In() ? Rn() : Ie();
			return e ? f.transition().duration(750).call(Ne.transform, i, a || void 0) : f.call(Ne.transform, i), fr(), !0;
		}
		function io({ animate: e = !1, initialZoomOut: t = !1, focus: n = !0, resetRot: r = !1, recordRot: i = !1 } = {}) {
			if (n && kn()) return ro(e, {
				resetRot: r,
				recordRot: i
			});
			let a = ao({
				animate: e,
				initialZoomOut: t,
				focus: n,
				resetRot: r,
				recordRot: i
			});
			return a && n && (De = a, fr()), !!a;
		}
		function ao({ animate: e = !1, initialZoomOut: t = !1, focus: n = !0, resetRot: r = !1, recordRot: i = !1 } = {}) {
			let a = $a();
			if (a) {
				let t = O.current ? O.current.clientWidth : window.innerWidth, o = O.current ? O.current.clientHeight : window.innerHeight;
				if (t < 50 || o < 50) return !1;
				let s = no(o);
				o -= s.top + s.bottom;
				let c = (e) => Math.min((t - 48) / Math.max(e.x1 - e.x0, 1), (o - 48) / Math.max(e.y1 - e.y0, 1), 1), l = n ? to() : null, u = a, d = c(a), p = !1;
				l && (d = c(l.box), u = l.box, l.root && c(l.root) >= Math.min(d, ee) ? (u = l.root, d = c(l.root)) : d < ee && (d = ee, p = (l.box.y1 - l.box.y0) * d > o - 48), d < re && (d = re, u = l.box, p = (l.box.y1 - l.box.y0) * d > o - 48)), d = Math.max(d, .04);
				let m = (u.x0 + u.x1) / 2, h = p ? Math.max(s.top + 24, 56) - u.y0 * d : s.top + o / 2 - (u.y0 + u.y1) / 2 * d, g = Eo.translate(t / 2 - m * d, h).scale(d);
				return r && He({
					repaint: !1,
					record: i
				}), e ? f.transition().duration(750).call(Ne.transform, g) : f.call(Ne.transform, g), g.k;
			}
			let s = o.nodes.filter((e) => e.type === "article");
			if (s.length < 2) return !1;
			let c = (e) => {
				let t = [...e].sort((e, t) => e - t), n = Math.floor(t.length / 2);
				return t.length % 2 ? t[n] : (t[n - 1] + t[n]) / 2;
			}, l = (e) => {
				let t = [...e].sort((e, t) => e - t);
				return [t[Math.floor(t.length * .1)], t[Math.ceil(t.length * .9) - 1]];
			}, u = s.map((e) => e.x), d = s.map((e) => e.y), [p, m] = l(u), [h, g] = l(d), _ = p - 140, v = m + 140, y = h - 140, b = g + 140, x = c(u), S = c(d), C = O.current ? O.current.clientWidth : window.innerWidth, w = O.current ? O.current.clientHeight : window.innerHeight;
			if (C < 50 && (C = window.innerWidth), w < 50 && (w = window.innerHeight), C < 50 || w < 50) return !1;
			let T = .2, E = no(w), D = Math.max(50, w - E.top - E.bottom), k = Math.max(Math.min(C / Math.max(v - _, 1), D / Math.max(b - y, 1), 1), T);
			t && (st ? k = T * .85 : k *= .85);
			let A = C / 2 - x * k, j = E.top + D / 2 - S * k, M = Eo.translate(A, j).scale(k);
			return r && He({
				repaint: !1,
				record: i
			}), e ? f.transition().duration(750).call(Ne.transform, M) : f.call(Ne.transform, M), M.k;
		}
		let oo = !1;
		U.size && (Tr(), Cr()), H.on("end", () => {
			if (oo = !0, z.current !== "force" || (Fa() && Qi(), Na = !0, o.nodes.forEach((e) => {
				e.fx = e.x, e.fy = e.y, e._forcePos = {
					x: e.x,
					y: e.y
				};
			}), T || io({ animate: !0 }), (0, Rs.layoutIsDegenerate)(o.nodes, R({
				hovered: !1,
				pinned: !1
			})))) return;
			let e = F.current;
			if (e) for (let t of o.nodes) !t.pinned && t._forcePos && e.setNodePosition(ge("force") + me(t), t.x, t.y, { silent: !0 });
			ie.current && ie.current();
		});
		let so = () => {
			if (!document.hidden) {
				if (!oo) {
					H.alpha(.8).restart();
					return;
				}
				Aa ||= io({ initialZoomOut: !0 });
			}
		};
		document.addEventListener("visibilitychange", so);
		let co = 1.25, uo = 8, fo = () => In() ? Rn() : Ie() || [r / 2, i / 2];
		function po(e, t = !0) {
			if (!Number.isFinite(e) || e <= 0) return;
			let n = Do(f.node()), r = Math.max(.04, Math.min(8, n.k * e));
			if (r > n.k && In() && (r = Math.min(r, Math.max(n.k, Gn()))), Math.abs(r - n.k) <= 1e-9 * n.k) return;
			let [i, a] = fo(), o = (0, Ks.zoomAbout)(n, r / n.k, i, a), s = Eo.translate(o.x, o.y).scale(o.k);
			T = !0, M = !1, t ? f.transition("key-zoom").duration(260).ease(Ki).call(Ne.transform, s, [i, a]) : f.call(Ne.transform, s);
		}
		let mo = () => {
			M = !1;
			let e = $a() || go(), t = no(i), n = {
				x0: 24,
				y0: t.top + 24,
				x1: r - 24,
				y1: i - t.bottom - 24
			};
			if (In()) {
				let e = O.current ? O.current.getBoundingClientRect() : {
					left: 0,
					top: 0
				}, t = [];
				for (let n of Dn.keys()) {
					let r = mn.get(n);
					if (!r || Sr(r)) continue;
					let i = xt.filter((e) => e.id === n).select(U.has(n) ? ".container-macro-bg" : ".container-hull").node();
					if (!i || !(i.getAttribute("d") || "").length) continue;
					let a = i.getBoundingClientRect();
					if (!a.width || !a.height) continue;
					let o = zn(n);
					if (!o) continue;
					let s = Un(r);
					t.push({
						box: {
							x0: a.left - e.left,
							y0: a.top - e.top,
							x1: a.right - e.left,
							y1: a.bottom - e.top
						},
						at: (() => {
							let e = Me(o.x + s.x, o.y + s.y);
							return {
								x: e[0],
								y: e[1]
							};
						})()
					});
				}
				let r = (0, qs.growFitRatio)(t, n);
				if (r && r > .02) {
					po(r);
					return;
				}
				ro(!0, {
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
				].map(([e, t]) => Me(e, t)), r = {
					x0: Math.min(...t.map((e) => e[0])),
					x1: Math.max(...t.map((e) => e[0])),
					y0: Math.min(...t.map((e) => e[1])),
					y1: Math.max(...t.map((e) => e[1]))
				}, [i, a] = fo(), o = (0, Ks.fitRatioAbout)(r, i, a, n);
				if (o && o > .02) {
					po(o);
					return;
				}
			}
			io({
				animate: !0,
				focus: !1,
				resetRot: !0,
				recordRot: !0
			});
		};
		function go() {
			let e = o.nodes.filter((e) => !e._closedHidden && Number.isFinite(e.x));
			return e.length ? {
				x0: _(e, (e) => e.x) - 40,
				y0: _(e, (e) => e.y) - 40,
				x1: g(e, (e) => e.x) + 40,
				y1: g(e, (e) => e.y) + 40
			} : null;
		}
		let _o = (e) => {
			if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
			let t = e.target;
			if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) || typeof window < "u" && window.PostPipeCover && window.PostPipeCover.state && window.PostPipeCover.state !== "graph" || document.querySelector("[data-settings-panel]")) return;
			let n = e.key === "+" || e.key === "=", r = e.key === "-" || e.key === "_";
			!n && !r || (e.preventDefault(), po(n ? co : 1 / co));
		};
		window.addEventListener("keydown", _o);
		let vo = () => {
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
			let e = F.current;
			if (e) for (let t of o.nodes) {
				let n = _e(t);
				e.nodeState(n) && e.setNodePosition(n, t.x, t.y, { silent: !0 });
			}
			H.alpha(.8).restart();
		}, yo = () => {
			let e = R({
				hovered: !1,
				pinned: !1
			});
			o.nodes.forEach((e) => {
				delete e._size;
			});
			let t = F.current;
			if (t) for (let n of o.nodes) t.setNodeSize(me(n), e.width, e.height, { silent: !0 });
			Qi();
		}, bo = () => {
			let e = F.current;
			e && e.resetLayout && e.resetLayout(), He({ repaint: !1 }), o.nodes.forEach((e) => {
				e.fx = null, e.fy = null, delete e._forcePos;
			}), kn() && (ar(), Qi()), H.alpha(.8).restart(), io({ animate: !0 });
		}, xo = () => {
			let e = F.current;
			e && e.resetLayout && e.resetLayout(), j.current && j.current(null), P(null), ai(), Bi = null, Vi = null, ca = !1, ba({ force: !0 }), Hi = null, ye.current = null, oi.classed("dimmed", !1).classed("tag-active", !1), Wi(), Yi(), xi.classed("dimmed", !1).style("z-index", null), Vr.classed("highlighted", !1), ve.current.clear(), o.nodes.forEach((e) => {
				delete e._size, delete e._customWidth, delete e._customHeight, delete e._forcePos, e.fx = null, e.fy = null;
			}), U.clear();
			for (let e of Dt()) U.add(e);
			Zn.clear(), He({ repaint: !1 }), T = !1, M = !!S.initialFocus && S.initialFocus !== "all", Di(), Tr(), typeof window < "u" && window.dispatchEvent(new CustomEvent("graph:containers-changed", { detail: Dr() })), o.containers && o.containers.length && En() ? (kn() && ar(), Nr(), Cr(), Qi(), io({ animate: !0 })) : (H.alpha(.8).restart(), io({ animate: !0 }));
		}, Co = (e) => {
			let t = e && e.detail ? e.detail.id : null, n = o.nodes.find((e) => e.type === "tag" && e.id === t), a = n;
			if (n && n._groupedInto && (n = o.nodes.find((e) => e.id === n._groupedInto) || n), !n || (Gi(n, { chosen: a }), Bi !== n.id || !Number.isFinite(n.x) || !Number.isFinite(n.y))) return;
			let s = Wn(n), [c, l] = Me(s.x, s.y), u = no(i);
			if (c >= 24 && c <= r - 24 && l >= u.top + 24 && l <= i - u.bottom - 24) return;
			let d = Do(f.node()), p = r / 2 - c, m = (u.top + (i - u.bottom)) / 2 - l;
			T = !0, M = !1, f.transition("key-zoom").duration(320).ease(Ki).call(Ne.transform, Eo.translate(d.x + p, d.y + m).scale(d.k));
		};
		window.addEventListener("graph:reset-all", xo), window.addEventListener("graph:select-tag", Co), window.addEventListener("graph:zoom-to-fit", mo), window.addEventListener("graph:unpin-all", vo), window.addEventListener("graph:reset-sizes", yo), window.addEventListener("graph:reset-layout", bo);
		let wo = {
			"graph:open-container": (e) => jr.openContainer(e.detail && e.detail.id),
			"graph:close-container": (e) => jr.closeContainer(e.detail && e.detail.id),
			"graph:toggle-container": (e) => jr.toggleContainer(e.detail && e.detail.id),
			"graph:open-all-containers": () => jr.openAllContainers(),
			"graph:close-all-containers": () => jr.closeAllContainers()
		};
		for (let [e, t] of Object.entries(wo)) window.addEventListener(e, t);
		return () => {
			ae.current = null, oe.current = null, se.current = null, ce.current = null, ue.current = null, fe.current = null, pe.current = null, typeof window < "u" && delete window.PostPipeGraphTags, wa && typeof cancelAnimationFrame < "u" && cancelAnimationFrame(wa), Xt && Xt.disconnect(), H.stop(), document.removeEventListener("visibilitychange", so), window.removeEventListener("resize", ft), n.removeEventListener("touchstart", ze, { capture: !0 }), n.removeEventListener("touchmove", Be, { capture: !0 }), n.removeEventListener("touchend", Ve, { capture: !0 }), n.removeEventListener("touchcancel", Ve, { capture: !0 }), n.removeEventListener("touchstart", tt, { capture: !0 }), n.removeEventListener("touchmove", nt, { capture: !0 }), n.removeEventListener("touchend", rt, { capture: !0 }), ot(), n.removeEventListener("click", Qe, !0), n.removeEventListener("dblclick", Qe, !0), Ge.cancel(), window.removeEventListener("graph:reset-all", xo), window.removeEventListener("graph:select-tag", Co), window.removeEventListener("postpipe:cover-frame", ja), window.removeEventListener("postpipe:cover", Ma), window.removeEventListener("resize", Ma), $i && typeof cancelAnimationFrame < "u" && cancelAnimationFrame($i), window.PostPipeGraphWorld && window.PostPipeGraphWorld.snapshot === dr && delete window.PostPipeGraphWorld, window.removeEventListener("graph:zoom-to-fit", mo), window.removeEventListener("keydown", _o), window.removeEventListener("graph:unpin-all", vo), window.removeEventListener("graph:reset-sizes", yo), window.removeEventListener("graph:reset-layout", bo);
			for (let [e, t] of Object.entries(wo)) window.removeEventListener(e, t);
			y && y.current === jr && (y.current = null), bi.forEach(({ root: e }) => {
				queueMicrotask(() => e.unmount());
			}), bi.clear();
		};
	}, [e, we]), r(() => {
		let e = ne.current;
		if (!e || !e.axisLayer) return;
		let t = f || {}, n = () => Ee(e, t);
		ie.current = t.on ? n : null, n();
	}, [
		f,
		l,
		e,
		we
	]);
	function Ee(e, t) {
		if (e.axisLayer.selectAll("*").remove(), B.current = null, !t.on) {
			re.current = !1;
			return;
		}
		let n = O.current, r = n ? n.clientWidth : window.innerWidth, i = n ? n.clientHeight : window.innerHeight;
		if (r < 60 || i < 60) return;
		let a = t.dock || T.dock, o = a === "left" || a === "right", s = T.endPadding, c = Number.isFinite(t.offset) ? t.offset : T.inset, l = a === "right" ? r - c : a === "bottom" ? i - c : c, u = Math.max((o ? i : r) - s * 2, 120), d = o ? {
			x: l,
			y: s
		} : {
			x: s,
			y: l
		}, f = (0, Rs.dimensionAxisGeometry)(e.data.nodes, {
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
				let n = m.append("line").attr("class", "time-connector").attr("data-node", e.id).attr("x1", t.x).attr("y1", t.y).attr("stroke", e._source && e._source.color || "#7f8ea3").attr("stroke-width", T.connectorWidth).attr("stroke-opacity", T.connectorOpacity);
				h.push({
					node: e,
					anchor: t,
					line: n
				});
			});
		});
		function g() {
			let t = Do(e.svg.node());
			h.forEach(({ node: n, anchor: r, line: i }) => {
				i.style("display", n._closedHidden ? "none" : null);
				let a = e.drawnAt ? e.drawnAt(n) : n, o = e.toScreen ? e.toScreen(a.x, a.y) : t.apply([a.x, a.y]);
				i.attr("x1", r.x).attr("y1", r.y).attr("x2", o[0]).attr("y2", o[1]);
			});
		}
		B.current = g, g();
		let _ = p.append("g").attr("class", "time-spine").style("cursor", o ? "ew-resize" : "ns-resize");
		_.append("rect").attr("x", o ? l - 34 / 2 : 0).attr("y", o ? 0 : l - 34 / 2).attr("width", o ? 34 : r).attr("height", o ? i : 34).attr("fill", "rgba(18,20,28,0.82)"), _.append("line").attr("x1", f.from.x).attr("y1", f.from.y).attr("x2", f.to.x).attr("y2", f.to.y).attr("stroke", "rgba(255,255,255," + T.spineOpacity + ")").attr("stroke-width", T.spineWidth);
		let v = T.tickFontSize, y = f.ticks.length > 1 ? Math.hypot(f.ticks[1].x - f.ticks[0].x, f.ticks[1].y - f.ticks[0].y) : Infinity, b = o ? v * 1.7 : v * 4.2, x = Math.max(1, Math.ceil(b / Math.max(y, 1)));
		f.ticks.forEach((e, t) => {
			_.append("line").attr("x1", e.x).attr("y1", e.y).attr("x2", e.x + (o ? 9 : 0)).attr("y2", e.y + (o ? 0 : -9)).attr("stroke", "rgba(255,255,255,0.45)").attr("stroke-width", 1.5), t % x === 0 && _.append("text").attr("x", e.x + (o ? 13 : 0)).attr("y", e.y + (o ? 0 : -14)).attr("text-anchor", o ? "start" : "middle").attr("dominant-baseline", o ? "central" : "auto").style("font-family", "'Atkinson', sans-serif").style("font-size", v + "px").style("fill", "rgba(255,255,255,0.62)").style("pointer-events", "none").text(e.label);
		});
		let S = null, C = 0;
		_.call(qt().on("start", (e) => {
			S = o ? e.x : e.y, C = 0;
		}).on("drag", (e) => {
			S !== null && (C = (o ? e.x : e.y) - S, _.attr("transform", o ? "translate(" + C + ",0)" : "translate(0," + C + ")"), m.selectAll("line").attr(o ? "x1" : "y1", function() {
				return Number(W(this).attr(o ? "x1" : "y1"));
			}), h.forEach(({ anchor: e, line: t }) => {
				o ? t.attr("x1", e.x + C) : t.attr("y1", e.y + C);
			}));
		}).on("end", () => {
			if (S !== null && C && F.current) {
				let e = a === "right" || a === "bottom" ? c - C : c + C;
				F.current.setTimeAxis({
					offset: Math.max(20, e),
					moved: !0
				});
			}
			S = null;
		}));
	}
	return r(() => {
		z.current = l;
		let e = ne.current;
		if (!e) return;
		let t = F.current, n = R({
			hovered: !1,
			pinned: !1
		});
		if (e.recomputeContainers && e.recomputeContainers(), l === "force" && e.data.nodes.filter((e) => {
			let n = t && t.nodeState(ge("force") + me(e));
			return n && !n.auto || e._forcePos;
		}).length < e.data.nodes.length * .5) {
			e.data.nodes.forEach((e) => {
				let n = t && t.nodeState(ge("force") + me(e));
				n && !n.auto ? (e.fx = n.x, e.fy = n.y) : (e.fx = null, e.fy = null);
			}), e.simulation.alpha(1).restart();
			return;
		}
		let r = e.data.nodes.filter((e) => !e._groupedInto), i = l === "force" ? Object.fromEntries(r.map((e) => [e.id, e._forcePos || t && t.nodeState(ge("force") + me(e)) || {
			x: e.x,
			y: e.y
		}])) : l === "radial" && e.ringTargets && e.ringTargets() || (0, Rs.computeLayout)(l, r, {
			cardW: n.width,
			cardH: n.height
		});
		if (!i) return;
		let a = new Map(e.data.nodes.map((e) => [e.id, {
			x: e.x,
			y: e.y
		}]));
		r.forEach((e) => {
			let n = t && t.nodeState(ge(l) + me(e)), r = n && typeof n.x == "number" && !n.auto ? {
				x: n.x,
				y: n.y
			} : i[e.id];
			r && (e.targetX = r.x, e.targetY = r.y, e.fx = r.x, e.fy = r.y, t && !(n && !n.auto) && t.setNodePosition(ge(l) + me(e), r.x, r.y, { silent: !0 }));
		});
		let o = qi;
		Ui().duration(760).ease(o).tween("layout-transition", () => {
			let t = e.data.nodes.map((e) => {
				let t = a.get(e.id) || {
					x: e.x,
					y: e.y
				}, n = typeof e.targetX == "number" ? e.targetX : e.x, r = typeof e.targetY == "number" ? e.targetY : e.y, i = Hn(t.x, n), o = Hn(t.y, r);
				return (t) => {
					e.x = i(t), e.y = o(t);
				};
			});
			return (n) => {
				for (let e = 0; e < t.length; e++) t[e](n);
				e.applyPositions(), B.current && B.current();
			};
		}).on("end", () => {
			e.data.nodes.forEach((e) => {
				typeof e.targetX == "number" && (e.x = e.targetX), typeof e.targetY == "number" && (e.y = e.targetY), delete e.targetX, delete e.targetY;
			}), e.applyPositions(), B.current && B.current();
		});
		let s = setTimeout(() => {
			ie.current && ie.current(), e.fitToViewport && e.fitToViewport();
		}, 800);
		return () => clearTimeout(s);
	}, [l]), /* @__PURE__ */ p("div", {
		ref: O,
		className: Lo.graphContainer,
		"data-graph-root": !0
	});
}
var J = {
	overlay: "_overlay_1csp2_4",
	open: "_open_1csp2_16",
	panel: "_panel_1csp2_30",
	minimized: "_minimized_1csp2_67",
	wide: "_wide_1csp2_74",
	full: "_full_1csp2_79",
	tb: "_tb_1csp2_92",
	growBtn: "_growBtn_1csp2_92",
	toolbar: "_toolbar_1csp2_107",
	dragGrip: "_dragGrip_1csp2_124",
	windowControls: "_windowControls_1csp2_132",
	restorePill: "_restorePill_1csp2_138",
	popIn: "_popIn_1csp2_1",
	pillIcon: "_pillIcon_1csp2_167",
	pillLabel: "_pillLabel_1csp2_171",
	pillTitle: "_pillTitle_1csp2_177",
	pillAuthor: "_pillAuthor_1csp2_187",
	pillAction: "_pillAction_1csp2_193",
	toolbarGroup: "_toolbarGroup_1csp2_208",
	ttsMount: "_ttsMount_1csp2_217",
	toolbarSeparator: "_toolbarSeparator_1csp2_229",
	toolbarSpacer: "_toolbarSpacer_1csp2_236",
	closeX: "_closeX_1csp2_276",
	navItem: "_navItem_1csp2_277",
	tbLabeled: "_tbLabeled_1csp2_283",
	tbText: "_tbText_1csp2_289",
	active: "_active_1csp2_295",
	copied: "_copied_1csp2_300",
	tbTooltip: "_tbTooltip_1csp2_332",
	syndLink: "_syndLink_1csp2_354",
	canonical: "_canonical_1csp2_372",
	progress: "_progress_1csp2_388",
	progressFill: "_progressFill_1csp2_397",
	progressSide: "_progressSide_1csp2_404",
	frontmatterPanel: "_frontmatterPanel_1csp2_422",
	fmRow: "_fmRow_1csp2_436",
	fmLabel: "_fmLabel_1csp2_443",
	fmValue: "_fmValue_1csp2_452",
	fmTag: "_fmTag_1csp2_456",
	fmSyndLink: "_fmSyndLink_1csp2_466",
	body: "_body_1csp2_476",
	articleHeader: "_articleHeader_1csp2_525",
	articleKicker: "_articleKicker_1csp2_529",
	articleTitle: "_articleTitle_1csp2_537",
	articleByline: "_articleByline_1csp2_545",
	articleMeta: "_articleMeta_1csp2_560",
	rightsLine: "_rightsLine_1csp2_565",
	copyToast: "_copyToast_1csp2_574",
	show: "_show_1csp2_590",
	bookmarkRibbon: "_bookmarkRibbon_1csp2_595",
	ribbonTooltip: "_ribbonTooltip_1csp2_618",
	inlineNoteForm: "_inlineNoteForm_1csp2_644",
	inlineNoteInput: "_inlineNoteInput_1csp2_650",
	marksPanel: "_marksPanel_1csp2_666",
	marksHeader: "_marksHeader_1csp2_675",
	marksList: "_marksList_1csp2_687",
	markItem: "_markItem_1csp2_693",
	markBody: "_markBody_1csp2_710",
	markQuote: "_markQuote_1csp2_716",
	markNote: "_markNote_1csp2_723",
	markNoteEmpty: "_markNoteEmpty_1csp2_732",
	markNoteInput: "_markNoteInput_1csp2_737",
	markActions: "_markActions_1csp2_749",
	markBtn: "_markBtn_1csp2_756",
	markBtnDanger: "_markBtnDanger_1csp2_776",
	marksListPanel: "_marksListPanel_1csp2_782",
	inlineNotePanel: "_inlineNotePanel_1csp2_792",
	noteInput: "_noteInput_1csp2_798",
	marksLegend: "_marksLegend_1csp2_814",
	markMain: "_markMain_1csp2_826",
	markTitle: "_markTitle_1csp2_831",
	noMarks: "_noMarks_1csp2_857",
	following: "_following_1csp2_899",
	navTop: "_navTop_1csp2_956",
	navBottom: "_navBottom_1csp2_957",
	navSide: "_navSide_1csp2_965",
	navSideNext: "_navSideNext_1csp2_966",
	navNext: "_navNext_1csp2_985",
	navLine: "_navLine_1csp2_986",
	navArrow: "_navArrow_1csp2_987",
	navTitle: "_navTitle_1csp2_988",
	navLocked: "_navLocked_1csp2_993",
	navStatus: "_navStatus_1csp2_995",
	turnOut_next: "_turnOut_next_1csp2_1003",
	ppTurnOutNext: "_ppTurnOutNext_1csp2_1",
	turnOut_prev: "_turnOut_prev_1csp2_1004",
	ppTurnOutPrev: "_ppTurnOutPrev_1csp2_1",
	turnIn_next: "_turnIn_next_1csp2_1005",
	ppTurnInNext: "_ppTurnInNext_1csp2_1",
	turnIn_prev: "_turnIn_prev_1csp2_1006",
	ppTurnInPrev: "_ppTurnInPrev_1csp2_1",
	notYet: "_notYet_1csp2_1016",
	notYetTitle: "_notYetTitle_1csp2_1023",
	notYetStatus: "_notYetStatus_1csp2_1024",
	bmList: "_bmList_1csp2_1052",
	bmRow: "_bmRow_1csp2_1064",
	bmMain: "_bmMain_1csp2_1065",
	bmTitle: "_bmTitle_1csp2_1066",
	bmNote: "_bmNote_1csp2_1067",
	bmNoteInput: "_bmNoteInput_1csp2_1068",
	bmActions: "_bmActions_1csp2_1069",
	bmEmpty: "_bmEmpty_1csp2_1072"
}, Nc = {
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
}, Pc = /* @__PURE__ */ h(((e, t) => {
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
})), Fc = /* @__PURE__ */ h(((e, t) => {
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
})), Ic = /* @__PURE__ */ h(((e, t) => {
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
})), Lc = /* @__PURE__ */ h(((e, t) => {
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
})), Rc = Pc(), zc = Fc(), Bc = Ic(), Vc = Lc(), Hc = (e, t) => {
	let n = e && Array.isArray(e.items) ? e.items.find((e) => e.id === t) : null;
	return n && n.title || "";
}, Uc = (e, t) => "#read=" + encodeURIComponent(e) + (t == null ? "" : "&p=" + t);
function Wc({ b: e, feedData: t, viewState: n }) {
	let [r, i] = c(!1), a = (0, Vc.placedParagraph)(e, t && Array.isArray(t.items) ? t.items.find((t) => t.id === e.item) : null);
	return /* @__PURE__ */ m("div", {
		className: J.bmRow,
		"data-bookmark-row": !0,
		children: [/* @__PURE__ */ m("div", {
			className: J.bmMain,
			children: [/* @__PURE__ */ p("div", {
				className: J.bmTitle,
				children: (0, Vc.bookmarkLabel)(e, Hc(t, e.item))
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
						window.location.hash = Uc(e.item, a);
					},
					title: "Go back to this place",
					children: "Jump"
				}),
				/* @__PURE__ */ p("button", {
					onClick: async () => {
						try {
							await navigator.clipboard.writeText(window.location.href.split("#")[0] + Uc(e.item, a));
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
function Gc({ viewState: e, feedData: t, itemId: n }) {
	if (!e) return null;
	let r = e.bookmarks(), i = r.filter((e) => e.item === n), a = r.filter((e) => e.item !== n);
	return /* @__PURE__ */ m("div", {
		className: J.bmList,
		"data-bookmarks-list": !0,
		children: [[...i, ...a].map((n) => /* @__PURE__ */ p(Wc, {
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
function Kc({ body: e, size: t = 16, className: n }) {
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
var qc = /* @__PURE__ */ h(((e, t) => {
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
})), Jc = /* @__PURE__ */ h(((e, t) => {
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
})), Yc = qc(), Xc = Jc(), Zc = "p, li, blockquote, h1, h2, h3, h4, h5, h6, dd, dt, figcaption, td, th", Qc = "pp-follow-sentence", $c = "pp-follow-word", el = "pp-follow-block", tl = () => typeof CSS < "u" && CSS.highlights && typeof Highlight < "u";
function nl(e, t) {
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
function rl(e) {
	let t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT, { acceptNode(e) {
		let t = e.parentElement;
		return t && t.closest(".bookmarkRibbon, [aria-hidden=\"true\"]") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
	} }), r;
	for (; r = n.nextNode();) t.push(r);
	return t;
}
function il(e, t, n, r) {
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
function al(e) {
	tl() && (CSS.highlights.delete(Qc), CSS.highlights.delete($c)), e && (e.querySelectorAll("." + el).forEach((e) => e.classList.remove(el)), delete e.dataset.followSentence, delete e.dataset.followWord);
}
function ol(e, t, n) {
	let r = nl(t, n);
	if (!r || !e.contains(r.node)) return null;
	let i = r.node.nodeType === 3 ? r.node.parentElement : r.node, a = i && i.closest(Zc);
	if (!a || !e.contains(a)) return null;
	let o = rl(a);
	if (!o.length) return null;
	let s = [], c = "", l = null;
	for (let e of o) s.push(c.length), e === r.node && (l = c.length + r.offset), c += e.nodeValue;
	if (l === null) return null;
	let u = (0, Xc.spanAt)(c, l);
	if (!u) return null;
	al(e);
	let d = c.slice(u.sentence[0], u.sentence[1]), f = u.word ? c.slice(u.word[0], u.word[1]) : "";
	return tl() ? (CSS.highlights.set(Qc, new Highlight(il(o, s, u.sentence[0], u.sentence[1]))), u.word && CSS.highlights.set($c, new Highlight(il(o, s, u.word[0], u.word[1])))) : a.classList.add(el), e.dataset.followSentence = d, e.dataset.followWord = f, {
		sentence: d,
		word: f
	};
}
function sl(e) {
	let t = !1, n = 0, r = null, i = () => {
		n = 0, r && ol(e, r.x, r.y);
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
		n && cancelAnimationFrame(n), e.removeEventListener("pointerdown", o), e.removeEventListener("pointermove", s), window.removeEventListener("pointerup", c), window.removeEventListener("pointercancel", c), al(e);
	};
}
//#endregion
//#region src/components/ReaderPanel/boldStartHtml.js
var cl = (/* @__PURE__ */ h(((e, t) => {
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
})))(), ll = new Set([
	"SCRIPT",
	"STYLE",
	"CODE",
	"PRE",
	"KBD",
	"SAMP",
	"svg"
]);
function ul(e) {
	if (!e || typeof DOMParser > "u") return e;
	let t = new DOMParser().parseFromString(`<div id="pp-bs-root">${e}</div>`, "text/html"), n = t.getElementById("pp-bs-root"), r = t.createTreeWalker(n, NodeFilter.SHOW_TEXT, { acceptNode(e) {
		for (let t = e.parentElement; t && t !== n; t = t.parentElement) if (ll.has(t.tagName)) return NodeFilter.FILTER_REJECT;
		return /[\p{L}]/u.test(e.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
	} }), i = [], a;
	for (; a = r.nextNode();) i.push(a);
	for (let e of i) {
		let n = t.createDocumentFragment();
		for (let r of (0, cl.boldStartSegments)(e.nodeValue)) if (r.bold) {
			let e = t.createElement("b");
			e.className = "pp-bs", e.textContent = r.text, n.appendChild(e);
		} else n.appendChild(t.createTextNode(r.text));
		e.parentNode.replaceChild(n, e);
	}
	return n.innerHTML;
}
//#endregion
//#region src/components/ReaderPanel/Contributions.module.css
var dl = (/* @__PURE__ */ h(((e, t) => {
	var { containerHas: n } = Fs();
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
}, fl = "pp-contrib-passage", pl = () => typeof CSS < "u" && CSS.highlights && typeof Highlight < "u";
function ml(e) {
	if (!e) return "";
	let t = new Date(e.length === 10 ? `${e}T00:00:00` : e);
	return isNaN(t) ? "" : t.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	});
}
function hl(e, t) {
	let n = String(e || "").replace(/\s+/g, " ").trim();
	return n.length > t ? n.slice(0, t - 1).trimEnd() + "…" : n;
}
function gl(e, t, n) {
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
function _l({ article: e, contributions: t, config: n, feedData: i, textRef: o, textKey: s, onOpenChapter: l, children: u }) {
	let d = (0, ac.slugOf)(e), h = a(() => (0, ac.forChapter)(t, d), [t, d]), [g, _] = c(null), [v, y] = c({}), b = a(() => {
		let e = /* @__PURE__ */ new Map();
		for (let t of i && i.items || []) e.set((0, ac.slugOf)(t), t);
		return e;
	}, [i]);
	r(() => {
		_(null);
		let e = setTimeout(() => {
			let e = o && o.current, t = e ? Array.from(e.querySelectorAll("p")) : [], n = t.map((e) => e.textContent), r = {};
			for (let e of h) e.quote && (r[e.id] = t.length ? (0, ac.resolveQuote)(n, e.quote) : null);
			y(r);
		}, 80);
		return () => clearTimeout(e);
	}, [
		h,
		e,
		s
	]), r(() => () => {
		pl() && CSS.highlights.delete(fl);
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
		let a = gl(r, t.offset, t.length);
		n.querySelectorAll("[data-contrib-passage]").forEach((e) => e.removeAttribute("data-contrib-passage")), r.setAttribute("data-contrib-passage", e.id), a && pl() && CSS.highlights.set(fl, new Highlight(a)), setTimeout(() => {
			r.getAttribute("data-contrib-passage") === e.id && r.removeAttribute("data-contrib-passage"), pl() && CSS.highlights.delete(fl);
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
					hl(e.quote.exact, 140),
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
			ml(e.created) && /* @__PURE__ */ m("span", {
				className: Y.date,
				children: [" · ", ml(e.created)]
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
						e.type === "comment" && (0, ac.paragraphsOf)(e.body).map((e, t) => /* @__PURE__ */ p("div", {
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
							}), (0, ac.paragraphsOf)(e.body).map((e, t) => /* @__PURE__ */ p("div", {
								className: Y.para,
								children: e
							}, t))] });
						})(),
						e.type === "art" && /* @__PURE__ */ m("figure", {
							className: Y.art,
							children: [/* @__PURE__ */ p("img", {
								src: (0, ac.assetUrl)(e.asset, n),
								alt: e.alt || `Art by ${e.author}`,
								loading: "lazy"
							}), e.body && /* @__PURE__ */ p("figcaption", {
								className: Y.para,
								children: e.body
							})]
						}),
						e.type === "essay" && (() => {
							let t = (0, ac.paragraphsOf)(e.body), n = g === e.id;
							return /* @__PURE__ */ m("div", {
								className: Y.essay,
								"data-contrib-essay": n ? "open" : "closed",
								children: [
									!n && /* @__PURE__ */ p("div", {
										className: Y.para,
										children: hl(t[0] || "", 220)
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
			n && n.submit && /* @__PURE__ */ p(yl, {
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
function vl(e) {
	let t = typeof window < "u" && window.getSelection ? window.getSelection() : null;
	if (!t || t.isCollapsed || !t.rangeCount || !e) return null;
	let n = t.getRangeAt(0);
	if (!e.contains(n.commonAncestorContainer)) return null;
	let r = n.startContainer.nodeType === 1 ? n.startContainer : n.startContainer.parentElement, i = r && r.closest("p");
	if (!i || !e.contains(i) || !i.contains(n.endContainer)) return { error: "Choose a passage within one paragraph." };
	let a = document.createRange();
	a.setStart(i, 0), a.setEnd(n.startContainer, n.startOffset);
	let o = a.toString().length;
	return (0, ac.quoteFromSelection)(i.textContent, o, o + n.toString().length);
}
function yl({ article: e, chapter: t, config: n, feedData: i, textRef: a }) {
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
			let e = vl(a && a.current);
			e && T(e);
		};
		return document.addEventListener("selectionchange", e), () => document.removeEventListener("selectionchange", e);
	}, [o, a]);
	let k = (i && i.items || []).filter((e) => (0, ac.slugOf)(e) !== t && e._posted !== "title").map((e) => ({
		id: (0, ac.slugOf)(e),
		title: e.title || (0, ac.slugOf)(e)
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
			let t = A(), r = (0, ac.checkSubmission)(t, n);
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
						hl(S.exact, 120),
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
					onClick: () => C(vl(a && a.current) || w || { error: "Select a passage in the chapter first." }),
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
function bl({ article: e, onClose: t, settings: n, viewState: i, targetParagraph: o, feedData: l, onNavigate: u, contributions: d, contributionsConfig: h }) {
	let [g, _] = c(!1), [v, y] = c(!1), [b, x] = c(null), [S, C] = c(!1), [w, T] = c(!1), [E, D] = c(""), [O, k] = c(0), [A, j] = c(!1), [M, N] = c(!1), [P, F] = c(!1), I = s(null), L = s(null), ee = s(null), te = s(!1), R = s({
		mouseX: 0,
		mouseY: 0,
		posX: 0,
		posY: 0
	}), [ne, z] = c(null), [re, ie] = c(null), B = s([]);
	r(() => {
		he.current && (clearTimeout(he.current), _e()), e ? (_(!0), y(!1), z(null), L.current && (L.current.scrollTop = 0), k(0), me(e)) : (_(!1), y(!1), D(""), k(0), C(!1));
	}, [e]);
	let ae = (e) => e ? e.originalItem && e.originalItem.id || e.id || e.url : null, oe = ae(e), se = i && oe ? i.bookmarks(oe) : [], ce = !!(i && i.readerAid && i.readerAid("boldStart")), le = a(() => ce ? ul(E) : E, [E, ce]), ue = a(() => ({ __html: le }), [le]), de = (e) => {
		e.target.closest("button") || e.target.closest("a") || e.target.closest("input") || (te.current = !0, R.current = {
			mouseX: e.clientX,
			mouseY: e.clientY,
			posX: b ? b.x : 0,
			posY: b ? b.y : 0
		}, window.addEventListener("mousemove", fe), window.addEventListener("mouseup", pe));
	}, fe = (e) => {
		if (!te.current) return;
		let t = e.clientX - R.current.mouseX, n = e.clientY - R.current.mouseY;
		x({
			x: R.current.posX + t,
			y: R.current.posY + n
		});
	}, pe = () => {
		te.current = !1, window.removeEventListener("mousemove", fe), window.removeEventListener("mouseup", pe);
	}, me = async (e) => {
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
			let t = (0, dl.navStatus)(l, e) || "";
			D(`<div class="${J.notYet}" data-not-yet><div class="${J.notYetTitle}">${xl(e.title || "")}</div><div class="${J.notYetStatus}">${xl(t)}</div></div>`);
			return;
		}
		if (Cl(e)) {
			D(Tl(e));
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
			a && a.remove(), i.querySelectorAll(".pp-rights").forEach((e) => e.remove()), D((i.querySelector("body") ? i.querySelector("body").innerHTML : r) + Dl(e));
		} catch {
			D(El(e, "Rendered article not yet published to GitHub Pages."));
		}
		else D(t === "image" ? (e.image ? `<img src="${e.image}" style="max-width:100%;height:auto;border-radius:4px;display:block;margin:0 auto;">` : "<p style=\"color:#666;\">No image resolved.</p>") + Ol(e) : El(e) + Ol(e));
	}, he = s(null), ge = s(null), _e = () => {
		he.current = null;
		let e = L.current, t = ge.current;
		if (!e || !t || !i || !i.setReadingProgress) return;
		let n = e.scrollHeight - e.clientHeight;
		i.setReadingProgress(t, n > 0 ? e.scrollTop / n : 1);
	}, ve = () => {
		if (L.current) {
			let { scrollTop: e, scrollHeight: t, clientHeight: n } = L.current, r = t - n, i = r > 0 ? e / r * 100 : 100;
			k(Math.max(0, Math.min(i, 100))), ge.current && (i >= 98 ? (clearTimeout(he.current), _e()) : he.current ||= setTimeout(_e, 350));
		}
	}, ye = () => {
		if (!i || !e) return;
		let t = ae(e), n = i.bookmarks(t), r = be(), a = (0, Vc.bookmarkTap)(n, r);
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
		let t = ae(e), n = be(), r = window.location.href.split("#")[0] + "#read=" + encodeURIComponent(t);
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
		if (!e || !L.current || !(0, Bc.allowDownload)(n)) return;
		let t = `${(n?.export?.license_header || "").replace("{{canonical_url}}", e.canonical_url || e.url)}\n\n---\n\n${L.current.innerText}`, r = new Blob([t], { type: "text/markdown" }), i = document.createElement("a");
		i.href = URL.createObjectURL(r), i.download = `${(e.id || e.url).split("/").pop().replace(".html", "") || "article"}.md`, i.click(), URL.revokeObjectURL(i.href);
	};
	r(() => {
		if (clearTimeout(he.current), he.current = null, ge.current = null, !E || !e || e._posted === "title" || !i || !i.readingProgress) return;
		let t = ae(e), n = setTimeout(() => {
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
				return (0, Rc.resolveParagraph)(r, e.quote, t);
			}
		}
		return r;
	};
	r(() => {
		if (!i || !L.current) return;
		let t = e ? ae(e) : null, n = i.bookmarks();
		if (L.current.querySelectorAll(".bookmarkRibbon").forEach((e) => e.remove()), t) {
			let r = n.find((e) => e.item === t);
			if (r) {
				let t = L.current.querySelectorAll("p"), n = V(r, e, t);
				if (n !== null && t[n]) {
					let e = document.createElement("div");
					e.className = "bookmarkRibbon", e.setAttribute("aria-hidden", "true"), e.innerHTML = Nc.bookmark, e.style.position = "absolute", e.style.left = "-30px", e.style.top = "0", e.style.color = "var(--rp-accent)", e.style.width = "20px", e.style.height = "20px", t[n].style.position = "relative", t[n].appendChild(e);
				}
			}
		}
	}, [
		le,
		i ? i.bookmarks() : null,
		e
	]);
	let we = !!(i && i.readerAid && i.readerAid("followAlong"));
	r(() => {
		if (!(!we || !L.current)) return sl(L.current);
	}, [
		we,
		le,
		e
	]);
	let Te = a(() => e && l ? (0, dl.neighbours)(l, e.id) : {
		prev: [],
		next: []
	}, [e, l]), Ee = () => typeof window < "u" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches, De = (e, t) => {
		if (!(!e || !u || !(0, dl.isReadable)(e))) {
			if (B.current.forEach(clearTimeout), B.current = [], Ee()) {
				u(e);
				return;
			}
			z(t), B.current.push(setTimeout(() => {
				ie(t), u(e), B.current.push(setTimeout(() => ie(null), 520));
			}, 170));
		}
	}, Oe = (t) => {
		if (!e || !l) return;
		let n = (0, dl.step)(l, e.id, t);
		n && De(n, t);
	}, ke = s(Oe);
	ke.current = Oe, r(() => () => B.current.forEach(clearTimeout), []);
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
		let n = (0, dl.navStatus)(l, e), r = /* @__PURE__ */ p(Kc, {
			body: (0, Yc.iconBody)(t === "next" ? "arrow-right" : "arrow-left"),
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
	}) : "", e.reading_time].filter(Boolean), Fe = (0, zc.byline)(n, e), Ie = Fe ? Fe.name : "", Le = Fe ? Fe.url : null, Re = (0, Ko.readerHeader)(n, e), ze = (0, Bc.progressBarMode)(n), Be = (0, Bc.allowDownload)(n), Ve = (0, sc.rightsLine)(n && n.rights), He = (0, _c.nonTagReferences)(e);
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
					onMouseDown: de,
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
									className: `${J.tb} ${J.tbLabeled} ${se.length > 0 ? J.active : ""}`,
									onClick: ye,
									"aria-pressed": se.length > 0,
									title: se.length > 0 ? "Bookmark the paragraph at the top (it replaces this chapter's bookmark), or take it away where it is" : "Bookmark the paragraph at the top of the reader",
									"data-bookmark-toggle": !0,
									children: [/* @__PURE__ */ p(Kc, {
										body: (0, Yc.iconBody)("bookmark"),
										size: 17
									}), /* @__PURE__ */ p("span", {
										className: J.tbText,
										children: "Bookmark"
									})]
								}),
								(0, Bc.bookmarksList)(n) && /* @__PURE__ */ p("button", {
									className: `${J.tb} ${w ? J.active : ""}`,
									onClick: () => T((e) => !e),
									"aria-expanded": w,
									title: "Every place you have bookmarked",
									"aria-label": "Bookmarks",
									"data-bookmark-list": !0,
									children: /* @__PURE__ */ p(Kc, {
										body: (0, Yc.iconBody)("list"),
										size: 17
									})
								}),
								/* @__PURE__ */ p("button", {
									className: J.tb,
									onClick: xe,
									title: "Copy a link to here",
									"aria-label": "Copy a link to here",
									"data-reader-link": !0,
									children: /* @__PURE__ */ p(Kc, {
										body: (0, Yc.iconBody)("link"),
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
									children: /* @__PURE__ */ p(Kc, {
										body: (0, Yc.iconBody)("info"),
										size: 17
									})
								}),
								Be && /* @__PURE__ */ p("button", {
									className: J.tb,
									onClick: Ce,
									title: "Download",
									"aria-label": "Download",
									"data-reader-download": !0,
									children: /* @__PURE__ */ p(Kc, {
										body: (0, Yc.iconBody)("download"),
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
										dangerouslySetInnerHTML: { __html: Nc[r.icon] || Nc.globe }
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
									children: /* @__PURE__ */ p(Kc, {
										body: (0, Yc.iconBody)("sliders-horizontal"),
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
									children: /* @__PURE__ */ p(Kc, {
										body: (0, Yc.iconBody)("move-horizontal"),
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
									children: /* @__PURE__ */ p(Kc, {
										body: (0, Yc.iconBody)(M ? "minimize-2" : "maximize-2"),
										size: 17
									})
								}),
								/* @__PURE__ */ p("button", {
									className: J.tb,
									onClick: () => y(!0),
									title: "Minimise the reader",
									"aria-label": "Minimise the reader",
									"data-reader-minimise": !0,
									children: /* @__PURE__ */ p(Kc, {
										body: (0, Yc.iconBody)("minus"),
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
					children: /* @__PURE__ */ p(Kc, {
						body: (0, Yc.iconBody)("x"),
						size: 20
					})
				}),
				S && /* @__PURE__ */ p(kl, {
					article: e,
					settings: n
				}),
				w && (0, Bc.bookmarksList)(n) && /* @__PURE__ */ p(Gc, {
					viewState: i,
					feedData: l,
					itemId: oe
				}),
				/* @__PURE__ */ m("div", {
					className: `${J.body} ${we ? J.following : ""} ${ne ? J["turnOut_" + ne] : ""} ${re ? J["turnIn_" + re] : ""}`,
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
							dangerouslySetInnerHTML: ue
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
						h && E && e._posted !== "title" && /* @__PURE__ */ p(_l, {
							article: e,
							contributions: d || [],
							config: h,
							feedData: l,
							textRef: ee,
							textKey: le,
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
					children: /* @__PURE__ */ p(Kc, {
						body: (0, Yc.iconBody)("bookmark"),
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
function xl(e) {
	return String(e).replace(/[&<>"']/g, (e) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;"
	})[e]);
}
function Sl(e) {
	return e._source || e.originalItem && e.originalItem._source || null;
}
function Cl(e) {
	let t = Sl(e);
	return t ? t.type !== "local" : (e.kind === "text" || e.kind === "link") && typeof e.content_html == "string";
}
function wl(e) {
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
function Tl(e) {
	let t = "";
	if (typeof e.content_html == "string" && e.content_html.trim()) {
		let n = wl(e.content_html);
		t += /<(p|div|ul|ol|h[1-6]|blockquote|pre|table|figure|section|article)\b/i.test(n) ? n : `<p>${n}</p>`;
	} else (e.tldr || e.summary) && (t += `<p>${xl(e.tldr || e.summary)}</p>`);
	let n = e.canonical_url || e.url || "";
	if (n) {
		let r = Sl(e), i = r && r.title || "";
		if (!i) try {
			i = new URL(n).hostname;
		} catch {
			i = "";
		}
		t += `<p data-reader-link-out><a href="${xl(n)}" target="_blank" rel="noopener noreferrer">Read the whole piece${i ? " at " + xl(i) : ""}</a></p>`;
	}
	return t;
}
function El(e, t) {
	let n = t || `This substrate ("${e.kind || "unknown"}") is not yet renderable in the viewer.`, r = "<div style=\"padding:24px;border:1px dashed var(--rp-border);border-radius:6px;background:rgba(17,24,39,0.4);\">";
	r += `<p style="color:var(--rp-accent);font-weight:600;margin-bottom:8px;">${n}</p>`, e.todos && e.todos.length && (r += `<p style="color:#f39c12;font-size:13px;">Pending: ${e.todos.join(", ")}</p>`);
	let i = (e.url || e.id || "").split("/").pop().replace(".html", ""), a = e._source?.path || `chapters/${i}`;
	return r += `<p style="color:#888;font-size:13px;margin-top:12px;">The bundle exists at <code>${a}</code>.</p>`, r += "</div>", r;
}
function Dl(e) {
	let t = e.forms && e.forms.companions || [];
	if (!t.length) return "";
	let n = "<div style=\"margin-top:32px;padding-top:24px;border-top:1px solid var(--rp-border);\">";
	return n += "<div style=\"color:var(--rp-accent);font-size:11px;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;\">also exists as</div>", n += `<div style="color:var(--rp-text);font-size:14px;">${t.map((e) => `<span class="${J.fmTag}">${e}</span>`).join(" ")}</div>`, n += "</div>", n;
}
function Ol(e) {
	let t = [];
	if (e.seed && t.push(["seed", e.seed]), e.tldr && t.push(["tldr", e.tldr]), e.topology && e.topology.length && t.push(["topology", e.topology.join(" · ")]), e.energy && t.push(["energy", e.energy]), e.note && t.push(["note", e.note]), !t.length) return "";
	let n = "<div style=\"margin-top:32px;padding:20px;background:rgba(17,24,39,0.4);border-radius:6px;\">";
	for (let [e, r] of t) n += `<div class="${J.fmRow}"><span class="${J.fmLabel}">${e}</span><span class="${J.fmValue}">${r}</span></div>`;
	return n += "</div>", n;
}
function kl({ article: e, settings: n }) {
	let r = n?.frontmatter_display || [], i = (0, _c.nonTagReferences)(e), a = i.length && !r.includes("references") ? [...r, "references"] : r, o = !1, s = a.map((n) => {
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
			case "tags":
				e.tags && e.tags.length && (r = /* @__PURE__ */ p(f, { children: e.tags.map((e) => /* @__PURE__ */ p("span", {
					className: J.fmTag,
					children: e
				}, e)) }));
				break;
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
var Al = {
	ttsGroup: "_ttsGroup_4kijf_7",
	tb: "_tb_4kijf_19",
	tbTooltip: "_tbTooltip_4kijf_46",
	select: "_select_4kijf_68",
	params: "_params_4kijf_85",
	loadingBarContainer: "_loadingBarContainer_4kijf_133",
	loadingBarFill: "_loadingBarFill_4kijf_145",
	visualizer: "_visualizer_4kijf_151",
	bar: "_bar_4kijf_161",
	bounce: "_bounce_4kijf_1",
	errorToast: "_errorToast_4kijf_183",
	show: "_show_4kijf_198",
	statusBadge: "_statusBadge_4kijf_202",
	pulse: "_pulse_4kijf_1",
	error: "_error_4kijf_183",
	ttsSettings: "_ttsSettings_4kijf_226",
	settingRow: "_settingRow_4kijf_235",
	paramValue: "_paramValue_4kijf_264",
	fallbackNote: "_fallbackNote_4kijf_275"
};
//#endregion
//#region src/components/TTS/TTS.jsx
function jl() {
	let [e, t] = c(null), [n, i] = c("stopped"), [a, o] = c([]), [s, l] = c(""), [u, d] = c([]), [f, p] = c(""), [m, h] = c({}), [g, _] = c({}), [v, y] = c(0), [b, x] = c(""), [S, C] = c(null), [w, T] = c(!1), [E, D] = c("");
	return r(() => {
		if (!window.TTS) return;
		let e = window.TTS;
		t(e);
		let n = (e) => {
			i(e), e !== "loading" && y(0), (e === "playing" || e === "stopped") && (w || C(null));
		}, r = (e) => y(e * 100), a = ({ engine: e, progress: t }) => {
			t && t.status === "progress" && t.progress !== void 0 ? C(`Loading ${e}: ${Math.round(t.progress * 100)}%`) : t && t.status && C(`Loading ${e}...`);
		}, s = (e) => {
			let t = e && (e.error || e.message || String(e)), n = e && e.engine;
			x(t || "TTS error"), T(!0), C(`${n || "TTS"} error: ${t || "Playback failed"}`), setTimeout(() => {
				x(""), C(null), T(!1);
			}, 5e3);
		}, c = () => {
			o(e.engines()), l(e.selected());
		}, u = () => {
			let t = e.voices();
			d(t);
			let n = e.capabilities();
			h(n);
			let r = {};
			for (let i of Object.keys(n)) if (i === "voice") {
				let r = e.get("voice"), i = e.lastFallback ? e.lastFallback() : null;
				i && i.to && i.to.engine === e.selected() && (i.to.voice || null) === (r || null) ? p(r || "") : ((!r || t.length && !t.some((e) => e.id === r)) && (r = n.voice.default || t[0] && t[0].id), r && (e.set("voice", r), p(r)));
			} else r[i] = e.get(i) === void 0 ? n[i].default : e.get(i);
			_(r);
		}, f = (e) => {
			c(), u(), D(e && e.note || "");
		};
		e.on("state", n), e.on("capabilitiesChanged", u), e.on("engineProgress", r), e.on("loadingProgress", a), e.on("error", s), e.on("fallback", f), c(), u();
		let m = e.lastFallback ? e.lastFallback() : null;
		return m && m.note && D(m.note), window.speechSynthesis && window.speechSynthesis.addEventListener("voiceschanged", u), () => {
			e.off && (e.off("state", n), e.off("capabilitiesChanged", u), e.off("engineProgress", r), e.off("loadingProgress", a), e.off("error", s), e.off("fallback", f)), window.speechSynthesis && window.speechSynthesis.removeEventListener("voiceschanged", u);
		};
	}, []), {
		T: e,
		state: n,
		engines: a,
		selectedEngine: s,
		voices: u,
		selectedVoice: f,
		capabilities: m,
		params: g,
		engineProgress: v,
		errorMsg: b,
		statusMessage: S,
		isError: w,
		setStatusMessage: C,
		setIsError: T,
		fallbackNote: E,
		handleEngineChange: (t) => {
			if (!e) return;
			let n = t.target.value;
			e.select(n), l(n), C(null), T(!1), D(""), d(e.voices()), h(e.capabilities());
		},
		handleVoiceChange: (t) => {
			if (!e) return;
			let n = t.target.value;
			e.clearFallback && e.clearFallback(), D(""), e.set("voice", n || void 0), p(n);
		},
		handleParamChange: (t, n) => {
			e && (e.set(t, n), _((e) => ({
				...e,
				[t]: n
			})));
		}
	};
}
function Ml({ targetRef: e }) {
	let { T: t, state: n, engineProgress: r, errorMsg: i, statusMessage: a, isError: o, setStatusMessage: s, setIsError: c } = jl();
	return t ? /* @__PURE__ */ m("div", {
		className: Al.ttsGroup,
		style: { position: "relative" },
		children: [
			n !== "playing" && /* @__PURE__ */ p("button", {
				className: Al.tb,
				onClick: () => {
					!t || !e.current || (s(null), c(!1), t.play(e.current, { scrollContainer: e.current }));
				},
				title: "Play",
				dangerouslySetInnerHTML: { __html: `${Nc.play}<span class="${Al.tbTooltip}">Play</span>` }
			}),
			n === "playing" && /* @__PURE__ */ p("button", {
				className: Al.tb,
				onClick: () => {
					t && t.pause();
				},
				title: "Pause",
				dangerouslySetInnerHTML: { __html: `${Nc.pause}<span class="${Al.tbTooltip}">Pause</span>` }
			}),
			(n === "playing" || n === "paused" || n === "loading") && /* @__PURE__ */ p("button", {
				className: Al.tb,
				onClick: () => {
					t && t.stop();
				},
				title: "Stop",
				dangerouslySetInnerHTML: { __html: `${Nc.stop}<span class="${Al.tbTooltip}">Stop</span>` }
			}),
			n === "loading" && r > 0 && /* @__PURE__ */ p("div", {
				className: Al.loadingBarContainer,
				children: /* @__PURE__ */ p("div", {
					className: Al.loadingBarFill,
					style: { width: `${r}%` }
				})
			}),
			n === "playing" && /* @__PURE__ */ m("div", {
				className: Al.visualizer,
				children: [
					/* @__PURE__ */ p("div", { className: Al.bar }),
					/* @__PURE__ */ p("div", { className: Al.bar }),
					/* @__PURE__ */ p("div", { className: Al.bar }),
					/* @__PURE__ */ p("div", { className: Al.bar })
				]
			}),
			/* @__PURE__ */ p("div", {
				className: `${Al.errorToast} ${i ? Al.show : ""}`,
				children: i
			}),
			a && /* @__PURE__ */ p("span", {
				className: `${Al.statusBadge} ${o ? Al.error : ""}`,
				children: a
			})
		]
	}) : null;
}
function Nl() {
	let { T: e, engines: t, selectedEngine: n, voices: r, selectedVoice: i, capabilities: a, params: o, fallbackNote: s, handleEngineChange: c, handleVoiceChange: l, handleParamChange: u } = jl();
	if (!e) return null;
	let d = typeof window < "u" ? window.PPVoices : null, f = typeof window < "u" && window.TTS_CONFIG && window.TTS_CONFIG.lang || "en", h = s && !r.some((e) => e.id === i) ? /* @__PURE__ */ p("option", {
		value: i,
		children: i || "This device's own voice"
	}, "pp-fallback-voice") : null;
	return /* @__PURE__ */ m("div", {
		className: Al.ttsSettings,
		"data-tts-settings": !0,
		children: [
			t.length > 1 && /* @__PURE__ */ p("select", {
				className: Al.select,
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
				className: Al.settingRow,
				children: [/* @__PURE__ */ p("span", { children: "Voice" }), /* @__PURE__ */ p("select", {
					className: Al.select,
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
				className: Al.fallbackNote,
				role: "status",
				"data-tts-fallback-note": !0,
				children: s
			}),
			/* @__PURE__ */ p("div", {
				className: Al.params,
				children: Object.entries(a).map(([e, t]) => !t || e === "voice" || e === "pitch" || e === "volume" ? null : t.type === "range" ? /* @__PURE__ */ m("label", {
					className: Al.settingRow,
					title: `${t.label}: ${o[e]}`,
					children: [/* @__PURE__ */ m("span", { children: [
						t.label,
						" ",
						/* @__PURE__ */ m("span", {
							className: Al.paramValue,
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
					className: Al.settingRow,
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
var X = {
	bar: "_bar_f1g2c_6",
	pill: "_pill_f1g2c_20",
	title: "_title_f1g2c_61",
	count: "_count_f1g2c_62",
	pagePill: "_pagePill_f1g2c_84",
	folderPill: "_folderPill_f1g2c_92",
	folderPrefix: "_folderPrefix_f1g2c_100",
	pillIcon: "_pillIcon_f1g2c_108",
	iconOnly: "_iconOnly_f1g2c_113",
	subscribe: "_subscribe_f1g2c_123",
	pillOn: "_pillOn_f1g2c_131",
	subscribeSheet: "_subscribeSheet_f1g2c_135",
	subscribeForm: "_subscribeForm_f1g2c_157",
	subscribeInput: "_subscribeInput_f1g2c_163",
	subscribeSubmit: "_subscribeSubmit_f1g2c_176",
	subscribeMessage: "_subscribeMessage_f1g2c_194",
	subscribeOk: "_subscribeOk_f1g2c_205",
	subscribeError: "_subscribeError_f1g2c_209",
	pageLabel: "_pageLabel_f1g2c_218",
	hidden: "_hidden_f1g2c_232",
	failed: "_failed_f1g2c_240",
	dot: "_dot_f1g2c_240",
	staleMark: "_staleMark_f1g2c_253",
	staleAge: "_staleAge_f1g2c_252",
	dotWrap: "_dotWrap_f1g2c_276",
	dotActive: "_dotActive_f1g2c_312",
	ringBackdrop: "_ringBackdrop_f1g2c_317",
	ring: "_ring_f1g2c_317",
	swatch: "_swatch_f1g2c_333",
	swatchCurrent: "_swatchCurrent_f1g2c_353",
	addPill: "_addPill_f1g2c_374",
	plus: "_plus_f1g2c_380",
	addOpen: "_addOpen_f1g2c_391",
	addInput: "_addInput_f1g2c_398",
	addClose: "_addClose_f1g2c_415",
	addSubmit: "_addSubmit_f1g2c_431",
	ready: "_ready_f1g2c_452",
	resultPanel: "_resultPanel_f1g2c_463",
	resultClose: "_resultClose_f1g2c_485",
	resultTitle: "_resultTitle_f1g2c_500",
	resultUrl: "_resultUrl_f1g2c_507",
	resultSection: "_resultSection_f1g2c_516",
	resultLabel: "_resultLabel_f1g2c_523",
	resultBox: "_resultBox_f1g2c_532",
	code: "_code_f1g2c_542",
	codeInline: "_codeInline_f1g2c_552",
	copyBtn: "_copyBtn_f1g2c_561",
	copied: "_copied_f1g2c_578",
	resultHint: "_resultHint_f1g2c_584",
	intro: "_intro_f1g2c_595"
}, Pl = (/* @__PURE__ */ h(((e, t) => {
	var { siteIcon: n } = qc(), { isLinkItem: r } = Es(), i = (e) => typeof e == "string" ? e.trim() : "";
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
function Fl({ config: e }) {
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
			children: e.icon ? /* @__PURE__ */ p(Kc, {
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
					let n = await (0, Pl.subscribe)(e, a);
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
var Il = /* @__PURE__ */ h(((e, t) => {
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
})), Ll = /* @__PURE__ */ h(((e, t) => {
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
	t.exports = {
		FEED_MIME_TYPES: n,
		autodiscoverEnabled: r,
		parseAlternateFeedLink: s,
		discoverFeedUrl: c
	};
})), Rl = /* @__PURE__ */ h(((e, t) => {
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
})), zl = Il(), Bl = Ll(), Vl = Rl();
function Hl({ sources: e, hiddenSources: n, onToggleSource: a, viewState: o, showCount: c = !0, pages: l = [], onOpenPage: u, links: d = [], subscribe: f = null, resume: h = null, onResume: g, order: _ = null, showAddButton: v = !0, intro: y = "", controls: b = null, showSources: x = !0, staleAge: S = !1, autodiscover: C = !0, groupByFolder: w = !1 }) {
	let T = s(null), E = Array.isArray(l) && l.length > 0, D = Array.isArray(d) && d.length > 0, O = !!b;
	if (i(() => {
		O && T.current && Gl(T.current);
	}), r(() => {
		if (!O) return;
		let e = () => {
			T.current && Gl(T.current);
		};
		return window.addEventListener("resize", e), typeof document < "u" && document.fonts && document.fonts.ready && document.fonts.ready.then(e), () => window.removeEventListener("resize", e);
	}, [O]), x === !1 && (e = []), (!e || e.length === 0) && !E && !D && !f && !h && !y && !b) return null;
	let k = n || /* @__PURE__ */ new Set(), A = Array.isArray(_) && _.length ? _ : [
		...h ? ["resume"] : [],
		...E ? l.map((e) => `page:${e.id}`) : [],
		...D ? d.map((e) => `link:${e.id}`) : [],
		...f ? ["subscribe"] : []
	], j = (e) => /* @__PURE__ */ m("button", {
		type: "button",
		className: `${X.pill} ${X.pagePill} ${e.icon && !e.showLabel ? X.iconOnly : ""}`,
		"data-top-pages": !0,
		"data-top-page": e.id,
		"data-has-icon": e.icon ? "" : void 0,
		"aria-label": e.icon ? e.label : void 0,
		title: e.item && e.item.title ? e.item.title : e.label,
		onClick: () => u && u(e.item),
		children: [e.icon && /* @__PURE__ */ p(Kc, {
			body: e.icon,
			size: 15,
			className: X.pillIcon
		}), e.showLabel !== !1 && /* @__PURE__ */ p("span", {
			className: `${X.title} ${X.pageLabel}`,
			children: e.label
		})]
	}, e.id), M = (e) => /* @__PURE__ */ m("a", {
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
		children: [e.icon && /* @__PURE__ */ p(Kc, {
			body: e.icon,
			size: 15,
			className: X.pillIcon
		}), e.showLabel && /* @__PURE__ */ p("span", {
			className: `${X.title} ${X.pageLabel}`,
			children: e.label
		})]
	}, e.id), N = () => h ? /* @__PURE__ */ m("button", {
		type: "button",
		className: `${X.pill} ${X.pagePill} ${h.icon && !h.showLabel ? X.iconOnly : ""}`,
		"data-top-resume": !0,
		"data-has-icon": h.icon ? "" : void 0,
		"aria-label": h.label,
		title: h.label,
		onClick: () => g && g(),
		children: [h.icon && /* @__PURE__ */ p(Kc, {
			body: h.icon,
			size: 15,
			className: X.pillIcon
		}), h.showLabel && /* @__PURE__ */ p("span", {
			className: `${X.title} ${X.pageLabel}`,
			children: h.label
		})]
	}, "resume") : null, P = (e) => /* @__PURE__ */ p(ql, {
		source: e,
		hidden: k.has(e.id),
		onToggle: () => a && a(e.id),
		viewState: o,
		showCount: c,
		staleAge: S
	}, e.id), F = (t) => {
		if (!a) return;
		let { ids: n } = (0, Vl.toggleFolderSources)(e || [], t, k);
		for (let e of n) a(e);
	};
	return /* @__PURE__ */ m("div", {
		ref: T,
		className: X.bar,
		"data-feeds": !0,
		children: [
			w ? (0, Vl.groupSourcesByFolder)(e || []).map((e) => /* @__PURE__ */ m(t.Fragment, { children: [e.folder && /* @__PURE__ */ p(Kl, {
				group: e,
				allHidden: e.sources.length > 0 && e.sources.every((e) => k.has(e.id)),
				onToggle: () => F(e.folder),
				showCount: c
			}), e.sources.map(P)] }, e.folder || "__root__")) : (e || []).map(P),
			A.map((e) => {
				if (e === "resume") return N();
				if (e === "subscribe") return f ? /* @__PURE__ */ p(Fl, { config: f }, "subscribe") : null;
				if (e.startsWith("page:")) {
					let t = l.find((t) => `page:${t.id}` === e);
					return t ? j(t) : null;
				}
				if (e.startsWith("link:")) {
					let t = d.find((t) => `link:${t.id}` === e);
					return t ? M(t) : null;
				}
				return null;
			}),
			v !== !1 && /* @__PURE__ */ p(Zl, { autodiscover: C }),
			b,
			y && /* @__PURE__ */ p("div", {
				className: X.intro,
				"data-graph-intro": !0,
				dangerouslySetInnerHTML: { __html: y }
			})
		]
	});
}
function Ul(e) {
	return [...e.children].filter((e) => {
		if (e.matches("[data-graph-intro]")) return !1;
		let t = getComputedStyle(e).position;
		return t !== "fixed" && t !== "absolute" && e.getBoundingClientRect().width > 0;
	});
}
function Wl(e) {
	let t = Ul(e);
	if (t.length < 2) return !1;
	let n = t[0].getBoundingClientRect().top;
	return t.some((e) => Math.abs(e.getBoundingClientRect().top - n) > 2);
}
function Gl(e) {
	let t = ["data-fit-dots", "data-fit-icons"], n = e.querySelector("[data-source-pill]");
	for (let n of [...t, "data-fit-title"]) e.removeAttribute(n);
	n && (n.style.maxWidth = "");
	for (let n of t) {
		if (!Wl(e)) return;
		e.setAttribute(n, "");
	}
	if (!Wl(e) || !n) return;
	e.setAttribute("data-fit-title", "");
	let r = Ul(e), i = parseFloat(getComputedStyle(e).columnGap) || 0, a = r.reduce((e, t) => e + t.getBoundingClientRect().width, 0) + i * (r.length - 1) - e.clientWidth, o = n.getBoundingClientRect().width;
	n.style.maxWidth = `${Math.max(34, Math.floor(o - a - 1))}px`;
}
function Kl({ group: e, allHidden: t, onToggle: n, showCount: r }) {
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
function ql({ source: e, hidden: t, onToggle: n, viewState: r, showCount: i, staleAge: a }) {
	let o = e.title || e.id, s = (0, zl.sourceStatus)(e), c = !!(s && s.kind === "failed"), l = !!(s && s.kind === "stale"), u = r && r.sourceColor(e.id) || e.color, d = t ? `Show ${o}` : `Hide ${o}`;
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
			/* @__PURE__ */ p(Xl, {
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
var Jl = [
	"#e74c3c",
	"#e67e22",
	"#f1c40f",
	"#2ecc71",
	"#1abc9c",
	"#3498db",
	"#9b59b6",
	"#e84393"
], Yl = 650;
function Xl({ color: e, sourceId: t, viewState: n }) {
	let [i, a] = c(!1), o = s(null);
	r(() => () => {
		o.current && clearTimeout(o.current);
	}, []);
	let l = (e) => {
		e.stopPropagation(), a(!0);
	}, u = (e) => {
		e && e.stopPropagation(), a(!1);
	}, d = () => {
		o.current = setTimeout(() => a(!0), Yl);
	}, h = () => {
		o.current &&= (clearTimeout(o.current), null);
	}, g = (e, r) => {
		r.stopPropagation(), n && n.setSourceColor(t, e), a(!1);
	}, _ = Jl.length;
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
			children: Jl.map((t, n) => {
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
function Zl({ autodiscover: e = !0 }) {
	let [t, n] = c(!1), [i, a] = c(""), [o, l] = c(null), u = s(null);
	r(() => {
		t && u.current && u.current.focus();
	}, [t]);
	let d = $l(i), h = (t) => {
		if (t && t.preventDefault(), !d) return;
		let r = i.trim();
		l(r), a(""), n(!1), e !== !1 && (0, Bl.discoverFeedUrl)(r, { autodiscover: !0 }).then((e) => {
			e && e !== r && l((t) => t === r ? e : t);
		});
	}, g = () => {
		a(""), n(!1);
	};
	return /* @__PURE__ */ m(f, { children: [t ? /* @__PURE__ */ m("form", {
		className: `${X.pill} ${X.addOpen}`,
		onSubmit: h,
		children: [
			/* @__PURE__ */ p("input", {
				ref: u,
				type: "url",
				placeholder: "paste a feed URL…",
				className: X.addInput,
				value: i,
				onChange: (e) => a(e.target.value),
				onKeyDown: (e) => {
					e.key === "Escape" && g();
				}
			}),
			/* @__PURE__ */ p("button", {
				type: "button",
				className: X.addClose,
				onClick: g,
				title: "Cancel",
				"aria-label": "Cancel",
				children: "×"
			}),
			/* @__PURE__ */ p("button", {
				type: "submit",
				className: `${X.addSubmit} ${d ? X.ready : ""}`,
				disabled: !d,
				title: d ? "Continue" : "Enter a URL first",
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
	}), o && /* @__PURE__ */ p(Ql, {
		url: o,
		onDismiss: () => l(null)
	})] });
}
function Ql({ url: e, onDismiss: t }) {
	let [n, r] = c(""), i = tu(e), a = `node add-feed.js ${eu(e)}`, o = async (e, t) => {
		try {
			await navigator.clipboard.writeText(e), r(t), setTimeout(() => r((e) => e === t ? "" : e), 1500);
		} catch {}
	};
	return /* @__PURE__ */ m("div", {
		className: X.resultPanel,
		children: [
			/* @__PURE__ */ p("button", {
				className: X.resultClose,
				onClick: t,
				title: "Dismiss",
				"aria-label": "Dismiss",
				children: "×"
			}),
			/* @__PURE__ */ p("div", {
				className: X.resultTitle,
				children: "Add this feed"
			}),
			/* @__PURE__ */ p("div", {
				className: X.resultUrl,
				title: e,
				children: e
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
							children: a
						}), /* @__PURE__ */ p("button", {
							className: `${X.copyBtn} ${n === "cli" ? X.copied : ""}`,
							onClick: () => o(a, "cli"),
							children: n === "cli" ? "Copied" : "Copy"
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
							children: i
						}), /* @__PURE__ */ p("button", {
							className: `${X.copyBtn} ${n === "opml" ? X.copied : ""}`,
							onClick: () => o(i, "opml"),
							children: n === "opml" ? "Copied" : "Copy"
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
function $l(e) {
	let t = (e || "").trim();
	if (!t) return !1;
	try {
		let e = new URL(t);
		return e.protocol === "http:" || e.protocol === "https:";
	} catch {
		return !1;
	}
}
function eu(e) {
	return `'${String(e).replace(/'/g, "'\\''")}'`;
}
function tu(e) {
	let t = e.replace(/"/g, "&quot;");
	return `<outline text="${nu(e)}" title="${nu(e)}" xmlUrl="${t}"/>`;
}
function nu(e) {
	try {
		return new URL(e).hostname.replace(/^www\./, "");
	} catch {
		return e;
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
}, ru = /* @__PURE__ */ h(((e, t) => {
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
})), iu = /* @__PURE__ */ h(((e, t) => {
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
	}, { reachConfig: m, backdropConfig: h, backdropOpacity: g } = Ss(), _ = (e, t) => e !== "" && e != null && Number.isFinite(Number(e)) ? Number(e) : t, v = (e) => typeof e == "string" ? e : "", y = (e) => Math.max(0, Math.min(1, e)), b = (e) => typeof e == "string" && e.trim() && !/[;{}<>]/.test(e) ? e.trim() : "", x = (e, t, n) => n === 1 ? t : e + (t - e) * n, S = (e) => {
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
	function R(e, { vw: t, vh: r, art: i, bottom: a = 0, zoom: o = null, controls: s = 0, ink: c = null, perPx: l = null } = {}, u = 0) {
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
		let te = w && w.graph !== null && D !== null ? Math.min(I - 1, Math.max(0, s) + w.graph - D * h * L) : -j.artOffset * (h * L), R = x(N, L, d), z = m * R, re = h * R, ie = x(I, te, d), B = x(P, ee, d), ae = S((d - f.graphFrom) / (1 - f.graphFrom));
		return {
			p: d,
			vw: t,
			vh: r,
			art: {
				top: ie,
				left: B,
				width: z,
				height: re,
				scale: R,
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
				opacity: ae,
				shift: (1 - ae) * f.rise * r
			},
			layer: {
				opacity: x(_(j.artStateOpacity, n.graph.artStateOpacity), 1, d),
				follow: ie - te
			},
			ground: 1 - d,
			byline: ne(e, {
				left: B,
				top: ie,
				width: z,
				height: re
			}, d, l, {
				x: t / 2,
				y: ie + re + (v - f.bylineSize * 1.3) / 2,
				size: f.bylineSize,
				opacity: y(1 - d * 2.5),
				align: "center",
				under: "art"
			})
		};
	}
	function ne(e, t, n, r, i) {
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
	var z = (e) => 1 - (1 - e) ** 3, re = (e) => e < .5 ? 4 * e * e * e : 1 - (-2 * e + 2) ** 3 / 2;
	function ie(e, { start: t = "art", reducedMotion: r = !1, travel: i = 600, now: o = () => Date.now(), frame: s = (e) => setTimeout(() => e(), 16), cancelFrame: c = (e) => clearTimeout(e), setTimer: l = setTimeout, clearTimer: u = clearTimeout, onChange: d = () => {}, onRest: f = () => {} } = {}) {
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
		function j(e, { ease: t = z } = {}) {
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
			return a.includes(e) ? t ? (A(e), !0) : g === e && h === E(e) && !v ? !1 : (j(e, { ease: re }), !0) : !1;
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
		function R(e) {
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
			key: R,
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
	function B(e) {
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
		coverGeometry: R,
		createCover: ie,
		pageKey: B
	};
})), au = /* @__PURE__ */ h(((e, t) => {
	var { openingConfig: n } = iu(), r = [
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
})), ou = /* @__PURE__ */ h(((e, t) => {
	var { resizeOn: n } = _s(), r = [
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
})), su = /* @__PURE__ */ h(((e, t) => {
	var { containerHas: n } = Fs();
	function r(e) {
		if (!e || !Array.isArray(e.items)) return null;
		let t = e.containers || [], r = (e) => t.some((t) => t.parent && t.tag && n(t, e)), i = /* @__PURE__ */ new Set(), a = new Set(e.items.map((e) => e.id));
		for (let t of e.items) r(t) || i.add(t._status === "published" ? "published" : "draft");
		for (let t of e.edges || []) t.layer === "tag" ? i.add("tag") : t.layer === "topology" ? i.add("topology") : t.layer === "authored" && !a.has(t.target) && i.add("placeholder");
		return i;
	}
	t.exports = { colorKeysInUse: r };
})), cu = /* @__PURE__ */ h(((e, t) => {
	var { blendColors: n } = As(), { clampMinPieces: r } = Ms(), i = 20;
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
})), lu = ru(), uu = au(), du = ou(), fu = su(), pu = cu(), mu = {
	draft: "#555555",
	published: "#2ecc71",
	tag: "#f39c12",
	topology: "#9b59b6",
	placeholder: "#7f8c8d"
};
function hu() {
	let e = typeof window < "u" && window.SETTINGS && window.SETTINGS.theme || {};
	return {
		...mu,
		...e.node_draft ? { draft: e.node_draft } : {},
		...e.node_published ? { published: e.node_published } : {},
		...e.tag_color ? { tag: e.tag_color } : {}
	};
}
var gu = hu(), _u = [
	{
		id: "default",
		label: "Default",
		colors: gu
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
], vu = [
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
], yu = [
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
function bu({ on: e, onChange: t, label: n, hint: r, ...i }) {
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
function xu({ viewState: e, aid: t, label: n, hint: r }) {
	return /* @__PURE__ */ p(bu, {
		on: !!(e.readerAid && e.readerAid(t)),
		label: n,
		hint: r,
		"data-aid": t,
		onChange: (n) => e.setReaderAid && e.setReaderAid(t, n)
	});
}
function Su({ label: e, options: t, value: n, onChange: r, name: i }) {
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
function Cu({ id: e, title: t, children: n }) {
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
var wu = (e) => window.dispatchEvent(new CustomEvent(e));
function Tu(e) {
	return (e && e.graph && typeof e.graph.containersName == "string" ? e.graph.containersName.trim() : "") || "containers";
}
function Eu({ className: e, size: t = 15, ...n }) {
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
		children: /* @__PURE__ */ p(Kc, {
			body: (0, Yc.iconBody)("sliders-horizontal"),
			size: t
		})
	});
}
function Du({ viewState: e, feedData: t, subject: n, readerOpen: i, where: o = "graph", ownButton: l, schemes: u }) {
	let d = (0, uu.whereOf)(o), [h, g] = c(!1), [_, v] = c(!1), [, y] = c(0), b = s(null), x = s(null), S = typeof window < "u" ? window.SETTINGS : null;
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
	let T = a(() => !!(t && Array.isArray(t.edges) && t.edges.some(pc.isRelationEdge)), [t]), E = a(() => (0, gc.ratioRange)(t), [t]);
	if (r(() => {
		if (typeof document > "u" || !e || d !== "reader") return;
		let t = e.paragraphIndent ? e.paragraphIndent() : !1, n = e.paragraphSpace ? e.paragraphSpace() : !0, r = document.documentElement;
		r.setAttribute("data-pp-indent", t ? "on" : "off"), r.setAttribute("data-pp-space", n ? "on" : "off"), r.removeAttribute("data-pp-paragraph"), r.setAttribute("data-pp-font", e.readerAid ? e.readerAid("font") : "default"), r.setAttribute("data-pp-size", e.readerAid ? e.readerAid("size") : "m");
	}), r(() => {
		let e = (e) => {
			let t = e && e.detail || {};
			if ((0, uu.whereOf)(t.where) !== d) {
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
	let D = l === void 0 ? d === "graph" && (0, du.toolbarConfig)(S).position !== "top" : l, O = (0, Bc.readerFonts)(S), k = e.readerAid ? e.readerAid("font") : "default", A = e.readerAid ? e.readerAid("size") : "m", j = {
		...gu,
		...e.graphColors()
	}, M = e.colorProfileId(), N = (0, fu.colorKeysInUse)((0, Pl.graphFeed)(t, (0, Pl.topBarConfig)(S))), P = N ? vu.filter((e) => N.has(e.key)) : vu, F = !!(t && Array.isArray(t.containers) && t.containers.length), I = typeof window < "u" && !!window.TTS, L = t && t.items || [], ee = L.length === 0 || L.some((e) => !(0, oc.isLinkItem)(e)), te = (0, lu.themeName)(S, e.preference("theme")), R = lu.THEMES[te].modes, ne = e.preference("mode"), z = (0, uu.panelGroups)(d, {
		settings: S,
		readable: ee,
		voice: I,
		modes: R.length
	}), re = (0, du.toolbarConfig)(S), ie = Tu(S), B = (0, Vs.nodePalettesOf)(S && S.graph), ae = (B.find((t) => t.id === e.preference("nodePalette")) || B[0] || {}).id, oe = Array.isArray(u) ? u : (0, lc.schemesOf)(t), se = (oe.find((e) => e.kind === "site") || { id: lc.SITE_SCHEME }).id, ce = e.preference("conceptScheme"), le = typeof ce == "string" && oe.some((e) => e.id === ce) ? ce : se, ue = Number(e.preference("broaderDepth")), de = Number.isFinite(ue) ? Math.max(0, Math.min(2, Math.round(ue))) : 0, fe = (0, fc.minPiecesSummary)(d === "graph" ? C || ((0, pu.hasTagNodes)(t, S && S.graph) ? [...(0, fc.pieceCountsFromFeed)((0, Pl.graphFeed)(t, (0, Pl.topBarConfig)(S))).values()] : []) : [], e.preference(fc.PREF)), pe = E.has ? (0, gc.clampRatio)(e.preference(gc.PREF), E) : null, me = (t) => e.setPreference(gc.PREF, Math.abs(t - E.bar) < 1e-9 ? null : t), he = {
		ArrowRight: 1,
		ArrowUp: 1,
		ArrowLeft: -1,
		ArrowDown: -1
	}, ge = R.length > 1 && /* @__PURE__ */ p(Su, {
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
		value: ne && R.includes(ne) ? ne : "auto",
		onChange: (t) => e.setPreference("mode", t === "auto" ? null : t)
	}), _e = {
		look: () => /* @__PURE__ */ m(f, { children: [
			/* @__PURE__ */ p(Su, {
				label: "Theme",
				name: "theme",
				options: Object.values(lu.THEMES).map((e) => ({
					id: e.id,
					label: e.label
				})),
				value: te,
				onChange: (t) => e.setPreference("theme", t === (0, lu.themeName)(S, null) ? null : t)
			}),
			!(0, uu.modeInReader)(S) && ge,
			(0, ic.config)(S) && /* @__PURE__ */ p(bu, {
				on: e.preference("timeOfDay") !== !1,
				onChange: (t) => e.setPreference("timeOfDay", t ? null : !1),
				label: "narrative time of day background",
				"data-pref": "timeOfDay"
			}),
			B.length >= 2 && /* @__PURE__ */ m("div", {
				className: Z.choiceRow,
				role: "radiogroup",
				"aria-label": "node colour",
				"data-choice": "nodePalette",
				children: [/* @__PURE__ */ p("span", {
					className: Z.rowLabel,
					children: "node colour"
				}), /* @__PURE__ */ p("span", {
					className: Z.choices,
					children: B.map((t, n) => /* @__PURE__ */ m("button", {
						role: "radio",
						"aria-checked": ae === t.id,
						title: t.label,
						"data-value": t.id,
						className: `${Z.choiceBtn} ${ae === t.id ? Z.aidOn : ""}`,
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
					children: _u.map((t) => /* @__PURE__ */ m("button", {
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
						onClick: () => wu("graph:zoom-to-fit"),
						children: "Zoom to fit"
					}),
					F && /* @__PURE__ */ m(f, { children: [/* @__PURE__ */ m("button", {
						className: Z.choiceBtn,
						"data-view-action": "graph:close-all-containers",
						onClick: () => wu("graph:close-all-containers"),
						children: ["Close all ", ie]
					}), /* @__PURE__ */ m("button", {
						className: Z.choiceBtn,
						"data-view-action": "graph:open-all-containers",
						onClick: () => wu("graph:open-all-containers"),
						children: ["Open all ", ie]
					})] }),
					(0, du.viewActionsFor)(S).filter((e) => e.event !== "graph:zoom-to-fit").map((e) => /* @__PURE__ */ p("button", {
						className: Z.choiceBtn,
						"data-view-action": e.event,
						title: e.title,
						onClick: () => wu(e.event),
						children: e.label
					}, e.event))
				]
			}),
			re.show.layout && /* @__PURE__ */ p(Su, {
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
			re.show.layout && /* @__PURE__ */ m("label", {
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
							value: (0, Hs.clampTightness)(e.preference("tightness")),
							onChange: (t) => {
								let n = (0, Hs.clampTightness)(t.target.value);
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
			fe.max > 1 && /* @__PURE__ */ m("label", {
				className: Z.choiceRow,
				"data-pref": fc.PREF,
				title: "Tagz on fewer cards than this are hidden.",
				children: [
					/* @__PURE__ */ p("span", {
						className: `${Z.rowLabel} ${Z.rowLabelLine}`,
						"data-min-pieces-label": !0,
						children: (0, fc.minPiecesLabel)(fe.min)
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
								max: fe.max,
								step: "1",
								"aria-label": `Hide tagz on fewer than this many cards, from 1 to ${fe.max}`,
								"aria-valuetext": `${fe.min} ${fe.min === 1 ? "card" : "cards"}: ${fe.shown} of ${fe.total} tagz`,
								value: fe.min,
								onChange: (t) => {
									let n = Math.round(Number(t.target.value));
									e.setPreference(fc.PREF, Number.isFinite(n) && n > 1 ? n : null);
								}
							}),
							/* @__PURE__ */ p("span", {
								className: Z.rangeEnd,
								"aria-hidden": "true",
								children: fe.max
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
								style: { minWidth: `${String(fe.total).length}ch` },
								children: fe.shown
							}),
							" of ",
							fe.total,
							" tagz"
						]
					})
				]
			}),
			d === "graph" && E.has && /* @__PURE__ */ m("label", {
				className: Z.choiceRow,
				"data-pref": gc.PREF,
				title: `Discovered tagz under this ratio are hidden; tagz a person wrote always show. The build's own bar is ${(0, gc.ratioText)(E.bar)}.`,
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
								children: (0, gc.ratioText)(E.lo)
							}),
							/* @__PURE__ */ p("input", {
								type: "range",
								className: Z.range,
								min: "0",
								max: (0, gc.travelLength)(E),
								step: "1",
								"aria-label": `Source coherence ratio, from ${(0, gc.ratioText)(E.lo)} to ${(0, gc.ratioText)(E.hi)}`,
								"aria-valuetext": (0, gc.ratioText)(pe),
								"data-ratio": (0, gc.ratioText)(pe),
								value: (0, gc.positionOf)(pe, E),
								onChange: (e) => me((0, gc.ratioAt)(e.target.value, E)),
								onKeyDown: (e) => {
									let t = he[e.key];
									t && (e.preventDefault(), me((0, gc.clampRatio)(pe + t * gc.STEP, E)));
								}
							}),
							/* @__PURE__ */ p("span", {
								className: Z.rangeEnd,
								"aria-hidden": "true",
								children: (0, gc.ratioText)(E.hi)
							})
						]
					}),
					/* @__PURE__ */ p("output", {
						className: Z.rangeEnd,
						"data-source-ratio": !0,
						"aria-live": "polite",
						children: (0, gc.ratioText)(pe)
					})
				]
			}),
			oe.length > 1 && /* @__PURE__ */ p(Su, {
				label: "Scheme",
				name: "conceptScheme",
				options: oe.map((e) => ({
					id: e.id,
					label: e.label || e.id,
					title: e.kind === "external" && e.license ? `${e.label || e.id} (${e.license})` : e.label || e.id
				})),
				value: le,
				onChange: (t) => e.setPreference("conceptScheme", t === se ? null : t)
			}),
			oe.length > 1 && /* @__PURE__ */ p(Su, {
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
				value: String(de),
				onChange: (t) => e.setPreference("broaderDepth", t === "0" ? null : Number(t))
			}),
			oe.length > 1 && de > 0 && T && /* @__PURE__ */ p(Su, {
				label: "Lines to folded tagz",
				name: pc.FOLDED_PREF,
				options: [{
					id: "bubble",
					label: "to their bubble",
					title: "Lines to related tagz folded into broader ones go to the bubble that shows them"
				}, {
					id: "omit",
					label: "left out",
					title: "No lines to related tagz folded into broader ones"
				}],
				value: (0, pc.foldedChoice)(e.preference(pc.FOLDED_PREF)),
				onChange: (t) => e.setPreference(pc.FOLDED_PREF, t === "bubble" ? null : t)
			})
		] }),
		memory: () => /* @__PURE__ */ m(f, { children: [/* @__PURE__ */ p("button", {
			className: Z.resetBtn,
			"data-settings-reset": !0,
			title: "Layout, zoom, rotation, open and closed containers, selection and colors, back to how the site starts",
			onClick: () => {
				g(!1), P.length && e.applyColorProfile("default", gu), wu("graph:reset-all");
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
			/* @__PURE__ */ p(Su, {
				label: "Size",
				name: "size",
				options: yu,
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
				children: [/* @__PURE__ */ p(xu, {
					viewState: e,
					aid: "followAlong",
					label: "Highlighter: follow along",
					hint: "Tap or drag through the text to mark the sentence and word you are on."
				}), /* @__PURE__ */ p(xu, {
					viewState: e,
					aid: "boldStart",
					label: "Bold word beginnings",
					hint: "The first part of each word is bold, to lead the eye. The text itself is unchanged."
				})]
			})
		] }),
		paper: () => ge,
		listening: () => /* @__PURE__ */ m(f, { children: [/* @__PURE__ */ p(Nl, {}), /* @__PURE__ */ p("div", {
			className: Z.hint,
			children: "Play and pause are in the reader."
		})] })
	};
	return /* @__PURE__ */ m(f, { children: [D && /* @__PURE__ */ p(Eu, {
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
		"aria-label": (0, uu.panelTitle)(S, d),
		ref: b,
		"data-settings-panel": d,
		children: [/* @__PURE__ */ m("div", {
			className: Z.header,
			children: [
				/* @__PURE__ */ p("span", {
					className: Z.title,
					children: (0, uu.panelTitle)(S, d)
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
					children: /* @__PURE__ */ p(Kc, {
						body: (0, Yc.iconBody)("x"),
						size: 18
					})
				})
			]
		}), z.map((e) => /* @__PURE__ */ p(Cu, {
			id: e.id,
			title: e.title,
			children: _e[e.id]()
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
}, Ou = {
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
}, ku = [
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
], Au = [
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
], ju = [
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
function Mu({ config: e, onUpdate: t, onReset: i, visible: a = !0 }) {
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
		...Ou,
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
		let t = Fu(e);
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
					}), ku.map((e) => /* @__PURE__ */ p(Nu, {
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
								children: ju.map((e) => /* @__PURE__ */ p("option", {
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
					}), Au.map((e) => /* @__PURE__ */ m("div", {
						className: Q.colorRow,
						children: [
							/* @__PURE__ */ p("span", {
								className: Q.colorLabel,
								children: e.label
							}),
							/* @__PURE__ */ p("input", {
								type: "color",
								className: Q.colorInput,
								value: w[e.key] || Pu(e.key),
								onChange: (t) => E(e.key, t.target.value)
							}),
							/* @__PURE__ */ p("span", {
								className: Q.colorHex,
								children: w[e.key] || Pu(e.key)
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
								children: Fu(e)
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
function Nu({ label: e, sub: t, checked: n, onChange: r }) {
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
function Pu(e) {
	return {
		bg: "#1a1a2e",
		surface: "#0a0e1a",
		accent: "#64ffda",
		text: "#a8b2d1",
		text_bright: "#ccd6f6"
	}[e] || "#888888";
}
function Fu(e) {
	let t = {};
	if (e.feed && e.feed !== "./feed.json" && (t.feed = e.feed), e.persistence && e.persistence !== "localStorage" && (t.persistence = e.persistence), e.features) {
		let n = {};
		for (let [t, r] of Object.entries(e.features)) r !== Ou[t] && (n[t] = r);
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
var Iu = {
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
}, Lu = [
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
function Ru(e) {
	return (e.url || e.id || "").split("/").pop().replace(".html", "");
}
function zu({ feedData: e, onFilterChange: t }) {
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
			let o = Ru(e);
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
				monthName: Lu[n],
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
		className: Iu.timeOverlay,
		children: [/* @__PURE__ */ m("div", {
			className: Iu.header,
			children: [/* @__PURE__ */ m("div", {
				className: Iu.titleGroup,
				children: [/* @__PURE__ */ p("span", {
					className: Iu.title,
					children: "Chronology"
				}), /* @__PURE__ */ p("span", {
					className: Iu.rangeBadge,
					children: i.minYear === i.maxYear ? i.minYear : `${i.minYear}–${i.maxYear}`
				})]
			}), n && /* @__PURE__ */ p("button", {
				className: Iu.clearBtn,
				onClick: () => {
					r(null), t && t(null, null);
				},
				title: "Show all posts",
				children: "Reset"
			})]
		}), /* @__PURE__ */ p("div", {
			className: Iu.stackScroll,
			children: i.months.map((e, t) => {
				let r = n === e.key, a = e.articleSlugs.length === 0, c = i.months[t - 1], l = !c || c.year !== e.year;
				return /* @__PURE__ */ m("div", {
					className: `${Iu.monthBox} ${a ? Iu.emptyMonth : ""} ${r ? Iu.activeMonth : ""}`,
					children: [/* @__PURE__ */ m("div", {
						className: Iu.monthHeader,
						onClick: () => o(e),
						title: a ? "No articles published this month" : `Filter to ${e.monthName} ${e.year} (${e.articleSlugs.length})`,
						children: [/* @__PURE__ */ m("div", {
							className: Iu.monthName,
							children: [e.monthName, l && /* @__PURE__ */ p("span", {
								className: Iu.yearTag,
								children: e.year
							})]
						}), /* @__PURE__ */ p("div", {
							className: `${Iu.monthMeta} ${e.articleSlugs.length > 0 ? Iu.hasItems : ""}`,
							children: e.articleSlugs.length > 0 ? `${e.articleSlugs.length} post${e.articleSlugs.length > 1 ? "s" : ""}` : "0 posts"
						})]
					}), /* @__PURE__ */ m("div", {
						className: Iu.branchArea,
						children: [/* @__PURE__ */ p("div", { className: Iu.branchLine }), /* @__PURE__ */ p("div", {
							className: Iu.weeksRow,
							children: e.weeks.map((t) => {
								let r = t.articleSlugs.length, i = n === t.id;
								return /* @__PURE__ */ m("div", {
									className: `${Iu.weekPill} ${r > 0 ? Iu.hasContent : ""} ${i ? Iu.activeWeek : ""}`,
									onClick: (n) => s(n, t, e),
									title: r > 0 ? `${t.label}: ${r} post${r > 1 ? "s" : ""}` : `${t.label}: empty`,
									children: [/* @__PURE__ */ p("span", { children: t.label }), r > 0 && /* @__PURE__ */ p("span", {
										className: Iu.weekBadge,
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
}, Bu = (/* @__PURE__ */ h(((e, t) => {
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
})))(), Vu = [{
	id: "force",
	label: "cluster",
	title: "Cluster: each container its own path"
}, {
	id: "radial",
	label: "ring",
	title: "Ring: each container its own ring"
}], Hu = (e, t) => window.dispatchEvent(new CustomEvent(e, t === void 0 ? void 0 : { detail: t }));
function Uu({ viewState: e, show: t = {}, layouts: n = Vu, settings: r, layers: i = [], placement: a = "bottom", feedData: o = null, hiddenSources: s = null }) {
	return a === "top" ? /* @__PURE__ */ p(Gu, {
		viewState: e,
		show: t,
		layouts: n,
		settings: r,
		layers: i,
		feedData: o,
		hiddenSources: s
	}) : /* @__PURE__ */ p(Wu, {
		viewState: e,
		show: t,
		layouts: n,
		settings: r,
		layers: i
	});
}
function Wu({ viewState: e, show: t, layouts: n, settings: i, layers: a }) {
	let s = i || (typeof window < "u" ? window.SETTINGS : null), l = (0, Bu.dimensionLabels)(s), u = (0, Bu.dimensionGroupLabel)(s), d = u.charAt(0).toUpperCase() + u.slice(1), h = (0, Bu.layerLabels)(s).filter((e) => a.includes(e.id)), [, g] = o((e) => e + 1, 0), [_, v] = c(!1);
	if (r(() => e ? e.subscribe(g) : void 0, [e]), r(() => {
		if (!_) return;
		let e = (e) => {
			e.key === "Escape" && v(!1);
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [_]), !e) return null;
	let y = t.history !== !1, b = t.layout !== !1, x = t.dimensions !== !1, S = e.state.layout, C = e.timeAxis(), w = C.dimension || "time", T = (t) => e.setTimeAxis((0, du.toggleDimension)(C, t)), E = () => e.setTimeAxis({ granularity: (0, du.nextGranularity)(C.granularity) }), D = (0, du.hasGranularity)(C), O = /* @__PURE__ */ m(f, { children: [
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
					title: du.RESET_TITLE,
					"data-toolbar-reset": !0,
					onClick: () => {
						v(!1), Hu("graph:reset-all");
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
				children: (0, du.viewActionsFor)(s).map((e) => /* @__PURE__ */ p("button", {
					className: $.action,
					title: e.title,
					onClick: () => {
						Hu(e.event), v(!1);
					},
					children: e.label
				}, e.event))
			})]
		})]
	})] })] });
}
function Gu({ viewState: e, show: t, layouts: n, settings: i, layers: a, feedData: l, hiddenSources: u }) {
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
	let A = t.history !== !1, j = (0, Bu.dimensionGroupLabel)(d), M = (e) => e.charAt(0).toUpperCase() + e.slice(1), N = e.timeAxis(), P = (0, du.menuModel)({
		dimensions: (0, Bu.dimensionLabels)(d),
		layers: (0, Bu.layerLabels)(d).filter((e) => a.includes(e.id)),
		axis: N,
		preferences: Object.fromEntries((0, Bu.layerLabels)(d).map((t) => [t.id, e.preference(t.id)])),
		show: t,
		group: j
	}), F = P.rows.length > 0, I = M(P.heading), L = (0, pu.hasTagNodes)(l, d && d.graph), ee = [];
	if (L && g === "tags") {
		let t = typeof document < "u" ? document.querySelector("[data-graph-root]") || document.documentElement : null, n = t && typeof getComputedStyle == "function" && getComputedStyle(t).getPropertyValue("--gv-tag-color").trim() || null, r = E && Array.isArray(E.counts) ? E.counts.reduce((e, t) => Number.isFinite(Number(t)) && Number(t) > e ? Number(t) : e, -1) : -1;
		ee = (0, pu.tagListModel)(l, {
			hiddenSources: u || e.state && e.state.hiddenSources || [],
			sourceColorOf: (t) => typeof e.sourceColor == "function" ? e.sourceColor(t) : null,
			fallbackColor: n,
			minPieces: typeof e.preference == "function" ? e.preference(fc.PREF) : null,
			tagCounts: E && E.byTag && typeof E.byTag == "object" ? E.byTag : null,
			maxPieces: r >= 0 ? r : null
		});
	}
	let te = (0, pu.filterTagRows)(ee, v), R = ee.length > pu.SEARCH_FROM, ne = () => {
		y(""), _((e) => e === "tags" ? null : "tags");
	}, z = (e) => {
		if (e.key === "Escape") {
			e.preventDefault(), e.stopPropagation(), k(!0);
			return;
		}
		if (e.key === "Tab") {
			_(null);
			return;
		}
		if (e.target && typeof e.target.matches == "function" && e.target.matches("[data-menu-search]") && e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
		let t = O(), n = (0, du.menuMove)(t.indexOf(document.activeElement), e.key, t.length);
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
				children: /* @__PURE__ */ p(Kc, {
					body: (0, Yc.iconBody)("undo-2"),
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
				children: /* @__PURE__ */ p(Kc, {
					body: (0, Yc.iconBody)("redo-2"),
					size: 15
				})
			})] }),
			/* @__PURE__ */ p("button", {
				type: "button",
				className: $.topIcon,
				title: du.RESET_TITLE,
				"aria-label": "Reset",
				"data-toolbar-reset": !0,
				onClick: () => {
					_(null), Hu("graph:reset-all");
				},
				children: /* @__PURE__ */ p(Kc, {
					body: (0, Yc.iconBody)("rotate-ccw"),
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
				children: /* @__PURE__ */ p(Kc, {
					body: (0, Yc.iconBody)("hourglass"),
					size: 15
				})
			}), g === "dimensions" && /* @__PURE__ */ m("div", {
				ref: T,
				id: "pp-top-menu",
				className: $.menu,
				role: "menu",
				"aria-labelledby": "pp-top-menu-heading",
				"data-top-menu": !0,
				onKeyDown: z,
				children: [/* @__PURE__ */ p("div", {
					id: "pp-top-menu-heading",
					role: "presentation",
					className: $.menuHeading,
					"data-group-label": !0,
					children: I
				}), P.rows.map((t, n) => {
					if (t.kind === "dimension" || t.kind === "layer") {
						let n = t.kind === "dimension" ? () => e.setTimeAxis((0, du.toggleDimension)(N, t.id)) : () => e.setPreference(t.id, t.checked ? null : !0);
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
								children: t.checked && /* @__PURE__ */ p(Kc, {
									body: (0, Yc.iconBody)("check"),
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
						onClick: () => e.setTimeAxis({ granularity: (0, du.nextGranularity)(N.granularity) }),
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
				onClick: ne,
				onKeyDown: (e) => {
					e.key === "ArrowDown" && g !== "tags" && (e.preventDefault(), ne());
				},
				children: /* @__PURE__ */ p(Kc, {
					body: (0, Yc.iconBody)("tag"),
					size: 15
				})
			}), g === "tags" && /* @__PURE__ */ m("div", {
				ref: T,
				id: "pp-top-tags",
				className: `${$.menu} ${$.tagMenu}`,
				role: "dialog",
				"aria-label": "Tagz",
				"data-top-tags": !0,
				onKeyDown: z,
				children: [
					/* @__PURE__ */ p("div", {
						role: "presentation",
						className: $.menuHeading,
						children: "Tagz"
					}),
					R && /* @__PURE__ */ p("input", {
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
								title: (0, pu.tagRowTitle)(e),
								className: $.menuItem,
								"data-menu-item": !0,
								"data-tag": e.id,
								onClick: () => Hu("graph:select-tag", { id: e.id }),
								children: [
									/* @__PURE__ */ p("span", {
										className: $.menuCheck,
										"aria-hidden": "true",
										children: t && /* @__PURE__ */ p(Kc, {
											body: (0, Yc.iconBody)("check"),
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
			/* @__PURE__ */ p(Eu, {
				className: $.topIcon,
				"data-settings-open": !0
			})
		]
	});
}
//#endregion
//#region src/components/TimeOfDay/TimeOfDay.jsx
function Ku() {
	let e = () => typeof document < "u" && document.documentElement.getAttribute("data-pp-mode") || "dark", [t, n] = c(e);
	return r(() => {
		let t = new MutationObserver(() => n(e()));
		return t.observe(document.documentElement, {
			attributes: !0,
			attributeFilter: ["data-pp-mode"]
		}), () => t.disconnect();
	}, []), t;
}
var qu = {
	position: "fixed",
	inset: 0,
	zIndex: -1,
	pointerEvents: "none"
};
function Ju({ item: e, settings: t, viewState: n }) {
	let i = (0, ic.config)(t), [, a] = c(0);
	r(() => n ? n.subscribe(() => a((e) => e + 1)) : void 0, [n]);
	let o = Ku(), l = !n || !n.preference || n.preference("timeOfDay") !== !1, u = i && l ? (0, ic.ambienceFor)(e, i, o) : null, d = u ? `${u.top}|${u.bottom}` : "", [m, h] = c([null, null]), [g, _] = c(0), v = s("");
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
			...qu,
			background: e ? `linear-gradient(180deg, ${e.top} 0%, ${e.bottom} 100%)` : "transparent",
			opacity: t === g && e ? 1 : 0,
			transition: `opacity ${y}s ease-in-out`
		}
	}, t)) });
}
//#endregion
//#region src/components/Theme/Theme.jsx
var Yu = iu();
function Xu({ settings: e, viewState: t }) {
	let [, n] = c(0), i = typeof window < "u" && window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null, [a, o] = c(i ? i.matches : !0);
	r(() => t ? t.subscribe(() => n((e) => e + 1)) : void 0, [t]), r(() => {
		if (!i) return;
		let e = (e) => o(e.matches);
		return i.addEventListener ? i.addEventListener("change", e) : i.addListener(e), () => {
			i.removeEventListener ? i.removeEventListener("change", e) : i.removeListener(e);
		};
	}, []);
	let s = (0, lu.themeName)(e, t && t.preference ? t.preference("theme") : null), l = e && e.theme && e.theme.mode, u = (0, lu.themeMode)(s, t && t.preference ? t.preference("mode") : null, a, l), d = (0, Yu.openingConfig)(e), f = d && d.ground === "dark" ? "dark" : u;
	return r(() => {
		let e = document.documentElement;
		e.getAttribute("data-pp-theme") !== s && e.setAttribute("data-pp-theme", s), e.getAttribute("data-pp-mode") !== f && e.setAttribute("data-pp-mode", f), e.getAttribute("data-pp-reader-mode") !== u && e.setAttribute("data-pp-reader-mode", u), e.style.colorScheme = f;
	}, [
		s,
		u,
		f
	]), null;
}
var Zu = {
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
}, Qu = (/* @__PURE__ */ h(((e, t) => {
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
})))(), $u = () => typeof window < "u" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function ed(e) {
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
function td(e, t) {
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
					top: (0, Yu.firstInkRow)(s, e, i),
					bottom: (0, Yu.lastInkRow)(s, e, i),
					above: (0, Yu.inkSpan)(s, e, i, 0, c),
					below: c < 1 ? (0, Yu.widestInkRow)(s, e, i, c, 1) : null
				});
			} catch {
				n(null);
			}
		}, r.onerror = () => n(null), r.src = e;
	});
}
function nd(e) {
	if (typeof document > "u") return 0;
	let t = 0;
	for (let n of document.querySelectorAll("[data-feeds] > *, [data-top-pages], [data-settings-gear]")) {
		let r = n.getBoundingClientRect();
		!r.width || !r.height || r.top > e * .2 || (t = Math.max(t, r.bottom));
	}
	return t;
}
function rd(e) {
	if (typeof document > "u") return 0;
	let t = 0;
	for (let n of document.querySelectorAll("[data-feeds] > *:not([data-graph-intro]), [data-settings-gear]")) {
		let r = n.getBoundingClientRect();
		!r.width || !r.height || r.top > e * .2 || getComputedStyle(n).position === "fixed" && !n.matches("[data-settings-gear]") || (t = Math.max(t, r.bottom));
	}
	return t;
}
var id = new Set([
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
function ad(e) {
	let t = e.target;
	return !!(t && t.nodeType === 1 && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || id.has(t.getAttribute("role")) || t.closest("[data-reader-panel], [role=\"dialog\"], [role=\"menu\"], [data-settings-panel]") || (e.key === " " || e.key === "Spacebar") && t.closest("button, a[href], summary, [role=\"button\"]")) || typeof window < "u" && window.location.hash.startsWith("#read=") || typeof document < "u" && document.querySelector("[data-settings-panel]"));
}
function od(e) {
	let t = typeof document < "u" && document.querySelector("[data-rights]");
	if (!t || t.getAttribute("data-rights-position") === "bottom-edge") return 0;
	let n = t.getBoundingClientRect();
	return n.height > 0 ? Math.max(0, e - n.top + 8) : 0;
}
var sd = 8, cd = "http://www.w3.org/2000/svg";
function ld(e, t, { reduced: n, seed: r, skip: i = () => null }) {
	let a = /* @__PURE__ */ new Map(), o = n ? 0 : e.lagMs;
	function s(e, n, i) {
		let a = document.createElementNS(cd, "g");
		a.setAttribute("data-reach", e), a.setAttribute("data-reach-container", n), a.setAttribute("data-reach-tip", String(i));
		let s = document.createElementNS(cd, "path");
		s.setAttribute("class", "reach-main");
		let c = document.createElementNS(cd, "path");
		return c.setAttribute("class", "reach-fine"), a.append(s, c), a.style.visibility = "hidden", t.appendChild(a), {
			key: e,
			g: a,
			main: s,
			fine: c,
			shape: (0, rc.reachShape)(`${r}|${e}`),
			lag: (0, rc.createLag)(o),
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
		let f = e.tips.map((e) => (0, rc.artPoint)(e, r)), p = /* @__PURE__ */ new Set(), m = !1, h = i();
		for (let t of d.containers) if (!(h && h.has(t.id))) for (let r of (0, rc.reachFor)(f, t, e.perContainer, e.stopShort)) {
			let e = r.tip, i = `${t.id}|${e}`;
			p.add(i);
			let l = a.get(i);
			l || (l = s(i, t.id, e), a.set(i, l)), l.state === "new" || !u ? l.lag.jump(r.end) : l.lag.to(r.end, n);
			let d = l.lag.at(n);
			l.lag.settled(n) || (m = !0);
			let h = (0, rc.reachPath)(f[e], d, l.shape);
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
function ud(e, t, n) {
	let r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
	for (let [e, r] of n) for (let n of r) for (let r of t.chains.get(n) || []) r.tip === n && i.set(r.e, e);
	let a = document.createDocumentFragment();
	for (let e of t.edges) {
		let t = e.parts.map((t, n) => {
			let r = document.createElementNS(cd, "path");
			return r.setAttribute("d", (0, Qu.pathD)(t.pts)), r.setAttribute("stroke", t.stroke || "#e4e1db"), r.setAttribute("stroke-width", String(t.width)), r.setAttribute("data-e", String(e.e)), r.setAttribute("data-part", String(n)), e.tip && r.setAttribute("data-tip", e.tip), i.has(e.e) && r.setAttribute("data-act-root", i.get(e.e)), a.appendChild(r), r;
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
			let a = (0, Qu.bentRoots)(t, n, e);
			for (let [e, t] of a) {
				let n = r.get(e);
				n && t.forEach((e, t) => {
					n[t] && n[t].setAttribute("d", (0, Qu.pathD)(e));
				});
			}
		},
		dispose() {
			for (let e of r.values()) for (let t of e) t.remove();
			r.clear();
		}
	};
}
function dd({ layout: e, size: t, which: n, opacity: r }) {
	let i = (0, Yu.titleLayout)(e, {
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
function fd(e, t) {
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
function pd(e) {
	if (!e) return;
	let t = e.bottom || "var(--sk-paper, var(--bg, #2a2a2e))";
	return {
		backgroundColor: e.top,
		backgroundImage: `linear-gradient(to bottom, ${e.top} 0%, ${e.top} ${(e.colorFrom * 100).toFixed(1)}%, ${t} 100%)`
	};
}
function md(e) {
	let t = `linear-gradient(to bottom, transparent 0%, transparent ${(e * 100).toFixed(1)}%, #000 100%)`;
	return {
		WebkitMaskImage: t,
		maskImage: t
	};
}
function hd({ title: e, size: t, start: n, refs: r }) {
	return !e || !t ? null : /* @__PURE__ */ m("svg", {
		className: Zu.title,
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
			children: /* @__PURE__ */ p(dd, {
				layout: e.art,
				size: t,
				which: "art",
				opacity: +(n === "art")
			})
		}), /* @__PURE__ */ p("g", {
			ref: r.graph,
			children: /* @__PURE__ */ p(dd, {
				layout: e.graph,
				size: t,
				which: "graph",
				opacity: n === "art" ? 0 : 1
			})
		})]
	});
}
function gd({ config: e, viewState: t, children: n }) {
	let o = s(null), l = s(null), u = s(null), d = s(null), h = s(null), g = s(null), _ = s(null), v = s(null), y = s(null), b = s(null), x = s(null), S = s(null), C = s(null), w = s(null), T = s(0), E = s(null), D = s(null), O = s(null), k = s(null), A = s(null), j = s(null), M = s(null), N = s(null), P = s(null), F = s(() => !1), [I, L] = c(null), ee = s(null), te = s(0), R = a($u, []), ne = a(() => (0, Yu.startState)(e, {
		stored: t && t.openingState ? t.openingState() : null,
		hash: typeof window < "u" ? window.location.hash : ""
	}), [e, t]), z = !!(e.graph && e.graph.hiddenUntilMove) && ne === "art", re = s({ at: null }), ie = () => (0, Yu.revealFactor)(z, re.current.at, performance.now()), B = () => {
		if (!z || re.current.at !== null) return;
		re.current.at = performance.now(), document.documentElement.setAttribute("data-pp-cover-acts", "shown");
		let e = () => {
			N.current && !ae.current && V.current(N.current.p), ie() < 1 && requestAnimationFrame(e);
		};
		requestAnimationFrame(e);
	}, ae = s(!1), oe = s(B);
	oe.current = B, r(() => {
		let t = !0, n = e.top || e.fit === "width" || e.graph.rootsFit === "width" ? Promise.all([td(e.art.artState, e.crownY), td(e.art.graphState || e.art.artState, e.crownY)]) : Promise.resolve([null, null]);
		return Promise.all([ed(e.art.artState), n]).then(([e, [n, r]]) => {
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
	let [se, ce] = c(e.title), le = s(e.title);
	le.current = se;
	let ue = s(null), de = (t) => {
		let n = window.innerWidth, r = window.innerHeight;
		return (0, Yu.coverGeometry)(le.current === e.title ? e : {
			...e,
			title: le.current
		}, {
			vw: n,
			vh: r,
			art: P.current || {
				w: 1,
				h: 2
			},
			bottom: od(r),
			zoom: C.current,
			controls: te.current,
			ink: ee.current,
			perPx: ue.current
		}, t);
	}, fe = () => {
		E.current = null;
		let t = window.PostPipeGraphWorld ? window.PostPipeGraphWorld.snapshot() : null;
		t && t.k > 0 && t.homeK > 0 && (C.current = {
			k: t.k,
			homeK: t.homeK
		});
		let n = N.current;
		if (!n) return;
		let r = de(n.p);
		w.current = r, he(r);
		let i = x.current;
		if (i && t && t.homeK > 0 && P.current) {
			let n = de(1), r = P.current.w / Math.max(1, n.art.width), a = /* @__PURE__ */ new Map();
			for (let e of t.containers) e.drift && i.acts.has(e.id) && a.set(e.id, {
				dx: e.drift.x * t.homeK * r,
				dy: e.drift.y * t.homeK * r
			});
			S.current ||= (0, Qu.createFollow)(R ? 0 : e.art.rootsFollowMs);
			let o = S.current;
			i.draw.bend(o.step(a, performance.now())), (!o.settled() || t.moving) && pe();
		}
		let a = y.current;
		if (!a || !P.current) return;
		if (xe.current) {
			v.current && (v.current.style.opacity = "0");
			return;
		}
		let o = C.current ? (0, rc.backdropOpacity)(e.backdrop, C.current.k, C.current.homeK) : e.backdrop.opacity;
		a.draw(performance.now(), {
			box: r.art,
			world: t,
			opacity: r.layer.opacity * o * ie(),
			settledCover: n.p >= 1 && !n.moving
		}) && pe();
	}, pe = () => {
		E.current ||= requestAnimationFrame(() => me.current());
	}, me = s(fe);
	me.current = fe;
	let he = (t) => {
		let n = g.current, r = (0, Yu.rootsBrightnessAt)(e, t.p), i = r === 1 ? "" : `brightness(${r.toFixed(3)})`;
		b.current && b.current.style.filter !== i && (b.current.style.filter = i), n && n.style.filter !== i && (n.style.filter = i), x.current && b.current ? (b.current.style.opacity = String(t.fade.graph * t.roots), n && (n.style.opacity = "0")) : n ? n.style.opacity = String(t.fade.graph * t.roots) : h.current && (h.current.style.opacity = String(t.roots)), _.current && (_.current.style.opacity = String(t.fade.graph));
	}, ge = () => {
		let t = rd(window.innerHeight), n = M.current;
		n && (n.style.height = `calc(env(safe-area-inset-top, 0px) + ${Math.ceil(t + 8)}px)`);
		let r = j.current;
		if (!r) return;
		let i = `calc(env(safe-area-inset-top, 0px) + ${(0, Yu.gripHeight)(t, e.grip)}px)`;
		if (e.returnAbove === "crown" && P.current) {
			let t = de(1), n = t.art.top + e.crownY * t.art.height;
			r.style.height = `max(${i}, ${Math.max(0, Math.round(n))}px)`, r.setAttribute("data-cover-handle-to", "crown");
		} else r.style.height = i;
	}, _e = s(ge);
	_e.current = ge;
	let ve = () => {
		let e = M.current, t = e ? e.getBoundingClientRect().bottom : 0;
		return Math.max(nd(window.innerHeight), t);
	}, ye = () => {
		if (!P.current) return;
		ge();
		let t = de(1);
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
		let n = de(t), r = N.current, i = r && r.moving ? "moving" : t >= 1 ? "graph" : t <= 0 ? "art" : "moving", a = document.documentElement;
		a.style.setProperty("--pp-cover-p", String(n.p)), a.setAttribute("data-pp-cover", i), e.topBarInArt || a.setAttribute("data-pp-cover-bar", i === "graph" ? "shown" : "hidden");
		let o = d.current;
		o && (o.style.width = `${n.art.width}px`, o.style.height = `${n.art.height}px`, o.style.transform = `translate3d(${n.art.left}px, ${n.art.top}px, 0)`, o.style.opacity = P.current ? String(n.art.opacity) : "0"), w.current = n, g.current && h.current && (h.current.style.opacity = String(n.fade.art)), he(n);
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
				let a = r ? ie() : 1;
				t.style.opacity = e && a >= 1 ? "" : String(e ? a : r ? n.layer.opacity * a : n.graph.opacity), t.style.transform = e ? "" : r ? `translate3d(0, ${n.layer.follow}px, 0)` : `translate3d(0, ${n.graph.shift}px, 0)`, t.inert = i === "art", i === "art" ? t.setAttribute("aria-hidden", "true") : t.removeAttribute("aria-hidden");
			}
			for (let t of m.querySelectorAll("[data-top-graph-controls]")) t.inert = !e;
		}
		let _ = j.current;
		_ && (_.style.opacity = String(n.graph.opacity), _.style.pointerEvents = i === "graph" ? "auto" : "none", _.tabIndex = i === "graph" ? 0 : -1), pe();
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
		t && (t.resize(de(0).travel), V.current(t.p)), be.current();
		let n = !0;
		return e.top && document.fonts && document.fonts.ready && document.fonts.ready.then(() => {
			ge();
			let e = ve();
			if (!n || Math.abs(e - te.current) < .5) return;
			te.current = e;
			let t = N.current;
			t && (t.resize(de(0).travel), V.current(t.p)), be.current();
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
			ce((e) => (0, Yu.fitTitle)(e, {
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
				t.remove(), r > 0 && (ue.current = r / 100);
			}
		};
		return (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(r)), () => {
			t = !1;
		};
	}, [I, e]), i(() => {
		if (se === e.title) return;
		let t = N.current;
		t && V.current(t.p), be.current();
	}, [se]), r(() => {
		let t = e.art.rootsVector;
		if (!t || !I || typeof fetch > "u") return;
		let n = !0, r = null;
		return fetch(t).then((e) => e.ok ? e.text() : "").then((t) => {
			let i = b.current, a = (0, Qu.rootsModel)((0, Qu.parseRoots)(t));
			if (!n || !i || !a) return;
			let o = (0, Qu.actRoots)(a, e.acts);
			r = ud(i, a, o), x.current = {
				draw: r,
				acts: new Set(o.keys())
			}, i.setAttribute("data-roots-vector", "ready");
			let s = N.current;
			s && V.current(s.p);
		}).catch(() => {}), () => {
			n = !1, r && r.dispose(), x.current = null;
		};
	}, [e, I]), r(() => {
		e.reach && v.current && (y.current = ld(e.reach, v.current, {
			reduced: R,
			seed: e.art.graphState || e.art.artState,
			skip: () => x.current ? x.current.acts : null
		}));
		let t = () => {
			let e = N.current;
			e && !e.moving && e.p === 0 && !xe.current && V.current(e.p), pe();
		};
		return window.addEventListener("graph:world", t), pe(), () => {
			window.removeEventListener("graph:world", t), E.current && cancelAnimationFrame(E.current), E.current = null, y.current && y.current.dispose(), y.current = null, window.PostPipeCoverFrame && delete window.PostPipeCoverFrame;
		};
	}, [e, R]), i(() => {
		let n = null, r = (0, Yu.createCover)(e, {
			start: ne,
			reducedMotion: R,
			travel: de(0).travel,
			frame: (e) => requestAnimationFrame(e),
			cancelFrame: (e) => cancelAnimationFrame(e),
			onChange(e, t) {
				if ((e > 0 || t && t.swap) && oe.current(), t && t.swap) {
					let r = Math.round((t.ms || Yu.TUNING.reducedFadeMs) / 2);
					ae.current = !0;
					let i = [o.current, A.current].filter(Boolean);
					for (let e of i) e.style.transition = `opacity ${r}ms linear`, e.style.opacity = "0";
					n && clearTimeout(n);
					let a = Date.now(), s = () => {
						let t = o.current;
						if ((t ? Number(getComputedStyle(t).opacity) : 0) > .02 && Date.now() - a < r * 4) {
							n = setTimeout(s, 16);
							return;
						}
						ae.current = !1, V.current(e);
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
				return ie();
			},
			go: (e, t) => r.go(e, t)
		};
		let i = () => _e.current();
		i();
		let a = requestAnimationFrame(i);
		document.fonts && document.fonts.ready && document.fonts.ready.then(i);
		let s = () => {
			i(), e.top && (te.current = ve()), r.resize(de(0).travel), V.current(r.p), be.current();
		};
		window.addEventListener("resize", s);
		let c = A.current, l = u.current, d = j.current, f = (e) => {
			let t = e.target;
			return !t || !t.closest ? null : d && d.contains(t) ? "edge" : l && l.contains(t) ? "stage" : k.current && k.current.contains(t) ? r.p < 1 || r.moving ? "stage" : "graph" : !c || !c.contains(t) ? null : r.moving || r.p < 1 ? "stage" : e.clientY <= p() ? "edge" : "graph";
		}, p = () => {
			if (e.returnAbove !== "crown" || !P.current) return Yu.TUNING.edgePx;
			let t = de(1);
			return Math.max(Yu.TUNING.edgePx, t.art.top + e.crownY * t.art.height);
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
			e.deltaY > 0 && oe.current();
		}, _ = () => oe.current(), v = (e) => {
			h(e.target) || oe.current();
		};
		z && (window.addEventListener("wheel", g, {
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
			let t = (0, Yu.pageKey)(e);
			!t || e.defaultPrevented || ad(e) || r.key(t) && e.preventDefault();
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
			x && (x.moved >= sd && (S = Date.now()), x = null, r.touchEnd(e.timeStamp || Date.now()));
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
			D && (D.moved = Math.max(D.moved, Math.abs(e.clientY - D.y)), D.moved >= sd && r.touchMove(e.clientY, e.timeStamp || Date.now()));
		}, I = (e) => {
			D && (D.moved >= sd && (S = Date.now()), D = null, r.touchEnd(e.timeStamp || Date.now()));
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
		R,
		ne,
		t
	]);
	let we = (e) => {
		let t = N.current;
		!t || F.current() || (e === "graph" ? t.tapArt() : t.tapTop());
	}, Te = ne === "art";
	return /* @__PURE__ */ m(f, { children: [
		/* @__PURE__ */ m("div", {
			ref: o,
			className: Zu.cover,
			"data-cover": !0,
			"data-ground": e.ground,
			children: [
				/* @__PURE__ */ p("div", {
					ref: l,
					className: Zu.ground,
					"data-cover-ground": !0,
					"data-sky": e.sky ? "" : void 0,
					style: {
						opacity: +!!Te,
						...pd(e.sky)
					},
					children: e.sky && e.sky.texture > 0 && /* @__PURE__ */ p("div", {
						className: Zu.groundTexture,
						"data-cover-ground-texture": !0,
						style: {
							opacity: e.sky.texture,
							...md(e.sky.textureFrom)
						}
					})
				}),
				/* @__PURE__ */ m("div", {
					ref: u,
					className: Zu.stage,
					role: "button",
					tabIndex: Te ? 0 : -1,
					"aria-label": "Show the graph",
					"data-cover-stage": !0,
					"data-cover-state": ne,
					onClick: (e) => {
						e.target.closest && e.target.closest("[data-cover-byline]") || N.current && N.current.p < .5 && we("graph");
					},
					onKeyDown: (e) => {
						e.target === e.currentTarget && (e.key === "Enter" || e.key === " " || e.key === "Spacebar") && (e.preventDefault(), e.stopPropagation(), we("graph"));
					},
					children: [/* @__PURE__ */ m("div", {
						ref: d,
						className: Zu.art,
						"data-cover-art": !0,
						style: { opacity: 0 },
						children: [
							/* @__PURE__ */ p("img", {
								ref: h,
								className: Zu.image,
								src: e.art.artState,
								alt: "",
								draggable: "false",
								"data-cover-image": "art",
								style: e.art.graphState ? { opacity: +!!Te } : void 0
							}),
							e.art.graphState && /* @__PURE__ */ p("img", {
								ref: g,
								className: Zu.image,
								src: e.art.graphState,
								alt: "",
								draggable: "false",
								"data-cover-image": "graph",
								style: {
									opacity: Te ? 0 : e.backdrop.opacity,
									...fd(e.backdrop.keepAbove, "below")
								}
							}),
							e.art.graphState && e.backdrop.keepAbove > 0 && /* @__PURE__ */ p("img", {
								ref: _,
								className: Zu.image,
								src: e.art.graphState,
								alt: "",
								draggable: "false",
								"data-cover-image": "graph-keep",
								style: {
									opacity: +!Te,
									...fd(e.backdrop.keepAbove, "above")
								}
							}),
							e.art.rootsVector && /* @__PURE__ */ p("svg", {
								ref: b,
								className: Zu.roots,
								"aria-hidden": "true",
								"data-roots-vector": "loading",
								preserveAspectRatio: "none",
								viewBox: I ? `0 0 ${I.w} ${I.h}` : void 0,
								style: {
									opacity: 0,
									...fd(e.backdrop.keepAbove, "below")
								}
							}),
							/* @__PURE__ */ p(hd, {
								title: se,
								size: I,
								start: ne,
								refs: {
									art: D,
									graph: O
								}
							})
						]
					}), e.alt && /* @__PURE__ */ p("span", {
						className: Zu.alt,
						role: "img",
						"aria-label": e.alt,
						"data-cover-alt": !0
					})]
				}),
				e.reach && /* @__PURE__ */ p("svg", {
					ref: v,
					className: Zu.reach,
					"aria-hidden": "true",
					"data-cover-reach": !0,
					style: { opacity: 0 }
				})
			]
		}),
		/* @__PURE__ */ m("div", {
			ref: A,
			className: Zu.section,
			"data-cover-section": !0,
			style: Te ? { pointerEvents: "none" } : void 0,
			children: [
				n,
				e.band && /* @__PURE__ */ p("div", {
					ref: M,
					className: Zu.band,
					"data-top-band": !0,
					"aria-hidden": "true",
					style: { background: e.band.color }
				}),
				/* @__PURE__ */ p("button", {
					ref: j,
					type: "button",
					className: Zu.handle,
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
						className: Zu.grip,
						"aria-hidden": "true"
					})
				})
			]
		}),
		e.byline.text && /* @__PURE__ */ p("a", {
			ref: k,
			className: `${Zu.byline} ${e.title ? Zu.bylineTitle : ""}`,
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
			children: (0, Yu.bylineText)(e.byline)
		})
	] });
}
function _d({ settings: e, viewState: t, children: n }) {
	let r = a(() => (0, Yu.openingConfig)(e), [e]);
	return r ? /* @__PURE__ */ p(gd, {
		config: r,
		viewState: t,
		children: n
	}) : /* @__PURE__ */ p(f, { children: n });
}
//#endregion
//#region src/components/Contributions/useContributions.js
function vd(e, t) {
	let n = JSON.stringify(e && e.contributions || null), i = a(() => (0, ac.contributionsConfig)(e), [n]), [o, s] = c(null);
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
	let l = a(() => i && o ? (0, ac.visibleContributions)(o, {
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
		layers: a(() => (0, ac.connectionEdges)(l).length ? ["readers"] : [], [l])
	};
}
//#endregion
var yd = oc.followLink, bd = Pl.graphFeed, xd = oc.isLinkItem, Sd = oc.linkOf, Cd = Pl.resolvePages, wd = Pl.resumeTarget, Td = du.toolbarConfig, Ed = Pl.topBarConfig, Dd = Pl.topBarOrder;
export { Mu as ConfigPanel, Hl as FeedZ, Mc as GraphViewer, _d as Opening, e as React, l as ReactDOM, bl as ReaderPanel, Du as Settings, Ml as TTS, Xu as Theme, Ju as TimeOfDay, zu as TimeOverlay, Uu as Toolbar, yd as followLink, bd as graphFeed, xd as isLinkItem, Sd as linkOf, Cd as resolvePages, wd as resumeTarget, Td as toolbarConfig, Ed as topBarConfig, Dd as topBarOrder, vd as useContributions };
