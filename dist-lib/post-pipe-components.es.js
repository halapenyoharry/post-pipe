import * as e from "react";
import t, { useCallback as n, useEffect as r, useLayoutEffect as i, useMemo as a, useReducer as o, useRef as s, useState as c } from "react";
import * as l from "react-dom/client";
import { createRoot as u } from "react-dom/client";
import { Fragment as d, jsx as f, jsxs as p } from "react/jsx-runtime";
//#region \0rolldown/runtime.js
var m = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports);
//#endregion
//#region node_modules/d3-array/src/max.js
function h(e, t) {
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
function g(e, t) {
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
function _(e, t) {
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
var v = { value: () => {} };
function y() {
	for (var e = 0, t = arguments.length, n = {}, r; e < t; ++e) {
		if (!(r = arguments[e] + "") || r in n || /[\s.]/.test(r)) throw Error("illegal type: " + r);
		n[r] = [];
	}
	return new b(n);
}
function b(e) {
	this._ = e;
}
function x(e, t) {
	return e.trim().split(/^|\s+/).map(function(e) {
		var n = "", r = e.indexOf(".");
		if (r >= 0 && (n = e.slice(r + 1), e = e.slice(0, r)), e && !t.hasOwnProperty(e)) throw Error("unknown type: " + e);
		return {
			type: e,
			name: n
		};
	});
}
b.prototype = y.prototype = {
	constructor: b,
	on: function(e, t) {
		var n = this._, r = x(e + "", n), i, a = -1, o = r.length;
		if (arguments.length < 2) {
			for (; ++a < o;) if ((i = (e = r[a]).type) && (i = S(n[i], e.name))) return i;
			return;
		}
		if (t != null && typeof t != "function") throw Error("invalid callback: " + t);
		for (; ++a < o;) if (i = (e = r[a]).type) n[i] = C(n[i], e.name, t);
		else if (t == null) for (i in n) n[i] = C(n[i], e.name, null);
		return this;
	},
	copy: function() {
		var e = {}, t = this._;
		for (var n in t) e[n] = t[n].slice();
		return new b(e);
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
function S(e, t) {
	for (var n = 0, r = e.length, i; n < r; ++n) if ((i = e[n]).name === t) return i.value;
}
function C(e, t, n) {
	for (var r = 0, i = e.length; r < i; ++r) if (e[r].name === t) {
		e[r] = v, e = e.slice(0, r).concat(e.slice(r + 1));
		break;
	}
	return n != null && e.push({
		name: t,
		value: n
	}), e;
}
var w = {
	svg: "http://www.w3.org/2000/svg",
	xhtml: "http://www.w3.org/1999/xhtml",
	xlink: "http://www.w3.org/1999/xlink",
	xml: "http://www.w3.org/XML/1998/namespace",
	xmlns: "http://www.w3.org/2000/xmlns/"
};
//#endregion
//#region node_modules/d3-selection/src/namespace.js
function T(e) {
	var t = e += "", n = t.indexOf(":");
	return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), w.hasOwnProperty(t) ? {
		space: w[t],
		local: e
	} : e;
}
//#endregion
//#region node_modules/d3-selection/src/creator.js
function E(e) {
	return function() {
		var t = this.ownerDocument, n = this.namespaceURI;
		return n === "http://www.w3.org/1999/xhtml" && t.documentElement.namespaceURI === "http://www.w3.org/1999/xhtml" ? t.createElement(e) : t.createElementNS(n, e);
	};
}
function D(e) {
	return function() {
		return this.ownerDocument.createElementNS(e.space, e.local);
	};
}
function O(e) {
	var t = T(e);
	return (t.local ? D : E)(t);
}
//#endregion
//#region node_modules/d3-selection/src/selector.js
function k() {}
function A(e) {
	return e == null ? k : function() {
		return this.querySelector(e);
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/select.js
function j(e) {
	typeof e != "function" && (e = A(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = Array(o), c, l, u = 0; u < o; ++u) (c = a[u]) && (l = e.call(c, c.__data__, u, a)) && ("__data__" in c && (l.__data__ = c.__data__), s[u] = l);
	return new At(r, this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/array.js
function M(e) {
	return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
//#endregion
//#region node_modules/d3-selection/src/selectorAll.js
function N() {
	return [];
}
function P(e) {
	return e == null ? N : function() {
		return this.querySelectorAll(e);
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/selectAll.js
function F(e) {
	return function() {
		return M(e.apply(this, arguments));
	};
}
function I(e) {
	e = typeof e == "function" ? F(e) : P(e);
	for (var t = this._groups, n = t.length, r = [], i = [], a = 0; a < n; ++a) for (var o = t[a], s = o.length, c, l = 0; l < s; ++l) (c = o[l]) && (r.push(e.call(c, c.__data__, l, o)), i.push(c));
	return new At(r, i);
}
//#endregion
//#region node_modules/d3-selection/src/matcher.js
function L(e) {
	return function() {
		return this.matches(e);
	};
}
function R(e) {
	return function(t) {
		return t.matches(e);
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/selectChild.js
var z = Array.prototype.find;
function B(e) {
	return function() {
		return z.call(this.children, e);
	};
}
function ee() {
	return this.firstElementChild;
}
function te(e) {
	return this.select(e == null ? ee : B(typeof e == "function" ? e : R(e)));
}
//#endregion
//#region node_modules/d3-selection/src/selection/selectChildren.js
var ne = Array.prototype.filter;
function re() {
	return Array.from(this.children);
}
function ie(e) {
	return function() {
		return ne.call(this.children, e);
	};
}
function V(e) {
	return this.selectAll(e == null ? re : ie(typeof e == "function" ? e : R(e)));
}
//#endregion
//#region node_modules/d3-selection/src/selection/filter.js
function ae(e) {
	typeof e != "function" && (e = L(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = [], c, l = 0; l < o; ++l) (c = a[l]) && e.call(c, c.__data__, l, a) && s.push(c);
	return new At(r, this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/selection/sparse.js
function oe(e) {
	return Array(e.length);
}
//#endregion
//#region node_modules/d3-selection/src/selection/enter.js
function se() {
	return new At(this._enter || this._groups.map(oe), this._parents);
}
function H(e, t) {
	this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
H.prototype = {
	constructor: H,
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
function ce(e) {
	return function() {
		return e;
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/data.js
function le(e, t, n, r, i, a) {
	for (var o = 0, s, c = t.length, l = a.length; o < l; ++o) (s = t[o]) ? (s.__data__ = a[o], r[o] = s) : n[o] = new H(e, a[o]);
	for (; o < c; ++o) (s = t[o]) && (i[o] = s);
}
function ue(e, t, n, r, i, a, o) {
	var s, c, l = /* @__PURE__ */ new Map(), u = t.length, d = a.length, f = Array(u), p;
	for (s = 0; s < u; ++s) (c = t[s]) && (f[s] = p = o.call(c, c.__data__, s, t) + "", l.has(p) ? i[s] = c : l.set(p, c));
	for (s = 0; s < d; ++s) p = o.call(e, a[s], s, a) + "", (c = l.get(p)) ? (r[s] = c, c.__data__ = a[s], l.delete(p)) : n[s] = new H(e, a[s]);
	for (s = 0; s < u; ++s) (c = t[s]) && l.get(f[s]) === c && (i[s] = c);
}
function de(e) {
	return e.__data__;
}
function fe(e, t) {
	if (!arguments.length) return Array.from(this, de);
	var n = t ? ue : le, r = this._parents, i = this._groups;
	typeof e != "function" && (e = ce(e));
	for (var a = i.length, o = Array(a), s = Array(a), c = Array(a), l = 0; l < a; ++l) {
		var u = r[l], d = i[l], f = d.length, p = pe(e.call(u, u && u.__data__, l, r)), m = p.length, h = s[l] = Array(m), g = o[l] = Array(m);
		n(u, d, h, g, c[l] = Array(f), p, t);
		for (var _ = 0, v = 0, y, b; _ < m; ++_) if (y = h[_]) {
			for (_ >= v && (v = _ + 1); !(b = g[v]) && ++v < m;);
			y._next = b || null;
		}
	}
	return o = new At(o, r), o._enter = s, o._exit = c, o;
}
function pe(e) {
	return typeof e == "object" && "length" in e ? e : Array.from(e);
}
//#endregion
//#region node_modules/d3-selection/src/selection/exit.js
function me() {
	return new At(this._exit || this._groups.map(oe), this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/selection/join.js
function he(e, t, n) {
	var r = this.enter(), i = this, a = this.exit();
	return typeof e == "function" ? (r = e(r), r &&= r.selection()) : r = r.append(e + ""), t != null && (i = t(i), i &&= i.selection()), n == null ? a.remove() : n(a), r && i ? r.merge(i).order() : i;
}
//#endregion
//#region node_modules/d3-selection/src/selection/merge.js
function ge(e) {
	for (var t = e.selection ? e.selection() : e, n = this._groups, r = t._groups, i = n.length, a = r.length, o = Math.min(i, a), s = Array(i), c = 0; c < o; ++c) for (var l = n[c], u = r[c], d = l.length, f = s[c] = Array(d), p, m = 0; m < d; ++m) (p = l[m] || u[m]) && (f[m] = p);
	for (; c < i; ++c) s[c] = n[c];
	return new At(s, this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/selection/order.js
function _e() {
	for (var e = this._groups, t = -1, n = e.length; ++t < n;) for (var r = e[t], i = r.length - 1, a = r[i], o; --i >= 0;) (o = r[i]) && (a && o.compareDocumentPosition(a) ^ 4 && a.parentNode.insertBefore(o, a), a = o);
	return this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/sort.js
function ve(e) {
	e ||= ye;
	function t(t, n) {
		return t && n ? e(t.__data__, n.__data__) : !t - !n;
	}
	for (var n = this._groups, r = n.length, i = Array(r), a = 0; a < r; ++a) {
		for (var o = n[a], s = o.length, c = i[a] = Array(s), l, u = 0; u < s; ++u) (l = o[u]) && (c[u] = l);
		c.sort(t);
	}
	return new At(i, this._parents).order();
}
function ye(e, t) {
	return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
//#endregion
//#region node_modules/d3-selection/src/selection/call.js
function be() {
	var e = arguments[0];
	return arguments[0] = this, e.apply(null, arguments), this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/nodes.js
function xe() {
	return Array.from(this);
}
//#endregion
//#region node_modules/d3-selection/src/selection/node.js
function Se() {
	for (var e = this._groups, t = 0, n = e.length; t < n; ++t) for (var r = e[t], i = 0, a = r.length; i < a; ++i) {
		var o = r[i];
		if (o) return o;
	}
	return null;
}
//#endregion
//#region node_modules/d3-selection/src/selection/size.js
function Ce() {
	let e = 0;
	for (let t of this) ++e;
	return e;
}
//#endregion
//#region node_modules/d3-selection/src/selection/empty.js
function we() {
	return !this.node();
}
//#endregion
//#region node_modules/d3-selection/src/selection/each.js
function Te(e) {
	for (var t = this._groups, n = 0, r = t.length; n < r; ++n) for (var i = t[n], a = 0, o = i.length, s; a < o; ++a) (s = i[a]) && e.call(s, s.__data__, a, i);
	return this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/attr.js
function Ee(e) {
	return function() {
		this.removeAttribute(e);
	};
}
function De(e) {
	return function() {
		this.removeAttributeNS(e.space, e.local);
	};
}
function Oe(e, t) {
	return function() {
		this.setAttribute(e, t);
	};
}
function ke(e, t) {
	return function() {
		this.setAttributeNS(e.space, e.local, t);
	};
}
function Ae(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
	};
}
function je(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
	};
}
function Me(e, t) {
	var n = T(e);
	if (arguments.length < 2) {
		var r = this.node();
		return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
	}
	return this.each((t == null ? n.local ? De : Ee : typeof t == "function" ? n.local ? je : Ae : n.local ? ke : Oe)(n, t));
}
//#endregion
//#region node_modules/d3-selection/src/window.js
function Ne(e) {
	return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
//#endregion
//#region node_modules/d3-selection/src/selection/style.js
function Pe(e) {
	return function() {
		this.style.removeProperty(e);
	};
}
function Fe(e, t, n) {
	return function() {
		this.style.setProperty(e, t, n);
	};
}
function Ie(e, t, n) {
	return function() {
		var r = t.apply(this, arguments);
		r == null ? this.style.removeProperty(e) : this.style.setProperty(e, r, n);
	};
}
function Le(e, t, n) {
	return arguments.length > 1 ? this.each((t == null ? Pe : typeof t == "function" ? Ie : Fe)(e, t, n ?? "")) : Re(this.node(), e);
}
function Re(e, t) {
	return e.style.getPropertyValue(t) || Ne(e).getComputedStyle(e, null).getPropertyValue(t);
}
//#endregion
//#region node_modules/d3-selection/src/selection/property.js
function ze(e) {
	return function() {
		delete this[e];
	};
}
function Be(e, t) {
	return function() {
		this[e] = t;
	};
}
function Ve(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? delete this[e] : this[e] = n;
	};
}
function He(e, t) {
	return arguments.length > 1 ? this.each((t == null ? ze : typeof t == "function" ? Ve : Be)(e, t)) : this.node()[e];
}
//#endregion
//#region node_modules/d3-selection/src/selection/classed.js
function Ue(e) {
	return e.trim().split(/^|\s+/);
}
function We(e) {
	return e.classList || new Ge(e);
}
function Ge(e) {
	this._node = e, this._names = Ue(e.getAttribute("class") || "");
}
Ge.prototype = {
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
function Ke(e, t) {
	for (var n = We(e), r = -1, i = t.length; ++r < i;) n.add(t[r]);
}
function qe(e, t) {
	for (var n = We(e), r = -1, i = t.length; ++r < i;) n.remove(t[r]);
}
function Je(e) {
	return function() {
		Ke(this, e);
	};
}
function Ye(e) {
	return function() {
		qe(this, e);
	};
}
function Xe(e, t) {
	return function() {
		(t.apply(this, arguments) ? Ke : qe)(this, e);
	};
}
function Ze(e, t) {
	var n = Ue(e + "");
	if (arguments.length < 2) {
		for (var r = We(this.node()), i = -1, a = n.length; ++i < a;) if (!r.contains(n[i])) return !1;
		return !0;
	}
	return this.each((typeof t == "function" ? Xe : t ? Je : Ye)(n, t));
}
//#endregion
//#region node_modules/d3-selection/src/selection/text.js
function Qe() {
	this.textContent = "";
}
function $e(e) {
	return function() {
		this.textContent = e;
	};
}
function et(e) {
	return function() {
		var t = e.apply(this, arguments);
		this.textContent = t ?? "";
	};
}
function tt(e) {
	return arguments.length ? this.each(e == null ? Qe : (typeof e == "function" ? et : $e)(e)) : this.node().textContent;
}
//#endregion
//#region node_modules/d3-selection/src/selection/html.js
function nt() {
	this.innerHTML = "";
}
function rt(e) {
	return function() {
		this.innerHTML = e;
	};
}
function it(e) {
	return function() {
		var t = e.apply(this, arguments);
		this.innerHTML = t ?? "";
	};
}
function at(e) {
	return arguments.length ? this.each(e == null ? nt : (typeof e == "function" ? it : rt)(e)) : this.node().innerHTML;
}
//#endregion
//#region node_modules/d3-selection/src/selection/raise.js
function ot() {
	this.nextSibling && this.parentNode.appendChild(this);
}
function st() {
	return this.each(ot);
}
//#endregion
//#region node_modules/d3-selection/src/selection/lower.js
function ct() {
	this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function lt() {
	return this.each(ct);
}
//#endregion
//#region node_modules/d3-selection/src/selection/append.js
function ut(e) {
	var t = typeof e == "function" ? e : O(e);
	return this.select(function() {
		return this.appendChild(t.apply(this, arguments));
	});
}
//#endregion
//#region node_modules/d3-selection/src/selection/insert.js
function dt() {
	return null;
}
function ft(e, t) {
	var n = typeof e == "function" ? e : O(e), r = t == null ? dt : typeof t == "function" ? t : A(t);
	return this.select(function() {
		return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
	});
}
//#endregion
//#region node_modules/d3-selection/src/selection/remove.js
function pt() {
	var e = this.parentNode;
	e && e.removeChild(this);
}
function mt() {
	return this.each(pt);
}
//#endregion
//#region node_modules/d3-selection/src/selection/clone.js
function ht() {
	var e = this.cloneNode(!1), t = this.parentNode;
	return t ? t.insertBefore(e, this.nextSibling) : e;
}
function gt() {
	var e = this.cloneNode(!0), t = this.parentNode;
	return t ? t.insertBefore(e, this.nextSibling) : e;
}
function _t(e) {
	return this.select(e ? gt : ht);
}
//#endregion
//#region node_modules/d3-selection/src/selection/datum.js
function vt(e) {
	return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
//#endregion
//#region node_modules/d3-selection/src/selection/on.js
function yt(e) {
	return function(t) {
		e.call(this, t, this.__data__);
	};
}
function bt(e) {
	return e.trim().split(/^|\s+/).map(function(e) {
		var t = "", n = e.indexOf(".");
		return n >= 0 && (t = e.slice(n + 1), e = e.slice(0, n)), {
			type: e,
			name: t
		};
	});
}
function xt(e) {
	return function() {
		var t = this.__on;
		if (t) {
			for (var n = 0, r = -1, i = t.length, a; n < i; ++n) a = t[n], (!e.type || a.type === e.type) && a.name === e.name ? this.removeEventListener(a.type, a.listener, a.options) : t[++r] = a;
			++r ? t.length = r : delete this.__on;
		}
	};
}
function St(e, t, n) {
	return function() {
		var r = this.__on, i, a = yt(t);
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
function Ct(e, t, n) {
	var r = bt(e + ""), i, a = r.length, o;
	if (arguments.length < 2) {
		var s = this.node().__on;
		if (s) {
			for (var c = 0, l = s.length, u; c < l; ++c) for (i = 0, u = s[c]; i < a; ++i) if ((o = r[i]).type === u.type && o.name === u.name) return u.value;
		}
		return;
	}
	for (s = t ? St : xt, i = 0; i < a; ++i) this.each(s(r[i], t, n));
	return this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/dispatch.js
function wt(e, t, n) {
	var r = Ne(e), i = r.CustomEvent;
	typeof i == "function" ? i = new i(t, n) : (i = r.document.createEvent("Event"), n ? (i.initEvent(t, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(t, !1, !1)), e.dispatchEvent(i);
}
function Tt(e, t) {
	return function() {
		return wt(this, e, t);
	};
}
function Et(e, t) {
	return function() {
		return wt(this, e, t.apply(this, arguments));
	};
}
function Dt(e, t) {
	return this.each((typeof t == "function" ? Et : Tt)(e, t));
}
//#endregion
//#region node_modules/d3-selection/src/selection/iterator.js
function* Ot() {
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
	select: j,
	selectAll: I,
	selectChild: te,
	selectChildren: V,
	filter: ae,
	data: fe,
	enter: se,
	exit: me,
	join: he,
	merge: ge,
	selection: Mt,
	order: _e,
	sort: ve,
	call: be,
	nodes: xe,
	node: Se,
	size: Ce,
	empty: we,
	each: Te,
	attr: Me,
	style: Le,
	property: He,
	classed: Ze,
	text: tt,
	html: at,
	raise: st,
	lower: lt,
	append: ut,
	insert: ft,
	remove: mt,
	clone: _t,
	datum: vt,
	on: Ct,
	dispatch: Dt,
	[Symbol.iterator]: Ot
};
//#endregion
//#region node_modules/d3-selection/src/select.js
function U(e) {
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
	var t = e.document.documentElement, n = U(e).on("dragstart.drag", Rt, It);
	"onselectstart" in t ? n.on("selectstart.drag", Rt, It) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function Bt(e, t) {
	var n = e.document.documentElement, r = U(e).on("dragstart.drag", null);
	t && (r.on("click.drag", Rt, It), setTimeout(function() {
		r.on("click.drag", null);
	}, 0)), "onselectstart" in n ? r.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
//#endregion
//#region node_modules/d3-drag/src/constant.js
var W = (e) => () => e;
//#endregion
//#region node_modules/d3-drag/src/event.js
function Vt(e, { sourceEvent: t, subject: n, target: r, identifier: i, active: a, x: o, y: s, dx: c, dy: l, dispatch: u }) {
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
Vt.prototype.on = function() {
	var e = this._.on.apply(this._, arguments);
	return e === this._ ? this : e;
};
//#endregion
//#region node_modules/d3-drag/src/drag.js
function Ht(e) {
	return !e.ctrlKey && !e.button;
}
function Ut() {
	return this.parentNode;
}
function Wt(e, t) {
	return t ?? {
		x: e.x,
		y: e.y
	};
}
function Gt() {
	return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Kt() {
	var e = Ht, t = Ut, n = Wt, r = Gt, i = {}, a = y("start", "drag", "end"), o = 0, s, c, l, u, d = 0;
	function f(e) {
		e.on("mousedown.drag", p).filter(r).on("touchstart.drag", g).on("touchmove.drag", _, Ft).on("touchend.drag touchcancel.drag", v).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	}
	function p(n, r) {
		if (!(u || !e.call(this, n, r))) {
			var i = b(this, t.call(this, n, r), n, r, "mouse");
			i && (U(n.view).on("mousemove.drag", m, It).on("mouseup.drag", h, It), zt(n.view), Lt(n), l = !1, s = n.clientX, c = n.clientY, i("start", n));
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
		U(e.view).on("mousemove.drag mouseup.drag", null), Bt(e.view, l), Rt(e), i.mouse("end", e);
	}
	function g(n, r) {
		if (e.call(this, n, r)) {
			var i = n.changedTouches, a = t.call(this, n, r), o = i.length, s, c;
			for (s = 0; s < o; ++s) (c = b(this, a, n, r, i[s].identifier, i[s])) && (Lt(n), c("start", n, i[s]));
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
	function b(e, t, r, s, c, l) {
		var u = a.copy(), d = Pt(l || r, t), p, m, h;
		if ((h = n.call(e, new Vt("beforestart", {
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
			u.call(r, e, new Vt(r, {
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
		return arguments.length ? (e = typeof t == "function" ? t : W(!!t), f) : e;
	}, f.container = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : W(e), f) : t;
	}, f.subject = function(e) {
		return arguments.length ? (n = typeof e == "function" ? e : W(e), f) : n;
	}, f.touchable = function(e) {
		return arguments.length ? (r = typeof e == "function" ? e : W(!!e), f) : r;
	}, f.on = function() {
		var e = a.on.apply(a, arguments);
		return e === a ? f : e;
	}, f.clickDistance = function(e) {
		return arguments.length ? (d = (e = +e) * e, f) : Math.sqrt(d);
	}, f;
}
//#endregion
//#region node_modules/d3-color/src/define.js
function qt(e, t, n) {
	e.prototype = t.prototype = n, n.constructor = e;
}
function G(e, t) {
	var n = Object.create(e.prototype);
	for (var r in t) n[r] = t[r];
	return n;
}
//#endregion
//#region node_modules/d3-color/src/color.js
function Jt() {}
var Yt = .7, Xt = 1 / Yt, Zt = "\\s*([+-]?\\d+)\\s*", Qt = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", $t = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", en = /^#([0-9a-f]{3,8})$/, tn = RegExp(`^rgb\\(${Zt},${Zt},${Zt}\\)$`), nn = RegExp(`^rgb\\(${$t},${$t},${$t}\\)$`), rn = RegExp(`^rgba\\(${Zt},${Zt},${Zt},${Qt}\\)$`), an = RegExp(`^rgba\\(${$t},${$t},${$t},${Qt}\\)$`), on = RegExp(`^hsl\\(${Qt},${$t},${$t}\\)$`), sn = RegExp(`^hsla\\(${Qt},${$t},${$t},${Qt}\\)$`), cn = {
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
qt(Jt, pn, {
	copy(e) {
		return Object.assign(new this.constructor(), this, e);
	},
	displayable() {
		return this.rgb().displayable();
	},
	hex: ln,
	formatHex: ln,
	formatHex8: un,
	formatHsl: dn,
	formatRgb: fn,
	toString: fn
});
function ln() {
	return this.rgb().formatHex();
}
function un() {
	return this.rgb().formatHex8();
}
function dn() {
	return En(this).formatHsl();
}
function fn() {
	return this.rgb().formatRgb();
}
function pn(e) {
	var t, n;
	return e = (e + "").trim().toLowerCase(), (t = en.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? mn(t) : n === 3 ? new vn(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? hn(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? hn(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = tn.exec(e)) ? new vn(t[1], t[2], t[3], 1) : (t = nn.exec(e)) ? new vn(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = rn.exec(e)) ? hn(t[1], t[2], t[3], t[4]) : (t = an.exec(e)) ? hn(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = on.exec(e)) ? Tn(t[1], t[2] / 100, t[3] / 100, 1) : (t = sn.exec(e)) ? Tn(t[1], t[2] / 100, t[3] / 100, t[4]) : cn.hasOwnProperty(e) ? mn(cn[e]) : e === "transparent" ? new vn(NaN, NaN, NaN, 0) : null;
}
function mn(e) {
	return new vn(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function hn(e, t, n, r) {
	return r <= 0 && (e = t = n = NaN), new vn(e, t, n, r);
}
function gn(e) {
	return e instanceof Jt || (e = pn(e)), e ? (e = e.rgb(), new vn(e.r, e.g, e.b, e.opacity)) : new vn();
}
function _n(e, t, n, r) {
	return arguments.length === 1 ? gn(e) : new vn(e, t, n, r ?? 1);
}
function vn(e, t, n, r) {
	this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
qt(vn, _n, G(Jt, {
	brighter(e) {
		return e = e == null ? Xt : Xt ** +e, new vn(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? Yt : Yt ** +e, new vn(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	rgb() {
		return this;
	},
	clamp() {
		return new vn(Cn(this.r), Cn(this.g), Cn(this.b), Sn(this.opacity));
	},
	displayable() {
		return -.5 <= this.r && this.r < 255.5 && -.5 <= this.g && this.g < 255.5 && -.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
	},
	hex: yn,
	formatHex: yn,
	formatHex8: bn,
	formatRgb: xn,
	toString: xn
}));
function yn() {
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
	if (e instanceof Jt || (e = pn(e)), !e) return new On();
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
qt(On, Dn, G(Jt, {
	brighter(e) {
		return e = e == null ? Xt : Xt ** +e, new On(this.h, this.s, this.l * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? Yt : Yt ** +e, new On(this.h, this.s, this.l * e, this.opacity);
	},
	rgb() {
		var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < .5 ? n : 1 - n) * t, i = 2 * n - r;
		return new vn(jn(e >= 240 ? e - 240 : e + 120, i, r), jn(e, i, r), jn(e < 120 ? e + 240 : e - 120, i, r), this.opacity);
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
		var r = n((e = _n(e)).r, (t = _n(t)).r), i = n(e.g, t.g), a = n(e.b, t.b), o = In(e.opacity, t.opacity);
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
	return t == null || n === "boolean" ? Mn(t) : (n === "number" ? Hn : n === "string" ? (r = pn(t)) ? (t = r, Ln) : Jn : t instanceof pn ? Ln : t instanceof Date ? Vn : zn(t) ? Rn : Array.isArray(t) ? Bn : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? Un : Hn)(e, t);
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
var jr = y("start", "end", "cancel", "interrupt"), Mr = [];
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
	return (typeof t == "number" ? Hn : t instanceof pn ? Ln : (n = pn(t)) ? (t = n, Ln) : Jn)(e, t);
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
	var n = T(e), r = n === "transform" ? ir : Wr;
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
	var r = T(e);
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
	typeof e != "function" && (e = L(e));
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
	typeof e != "function" && (e = A(e));
	for (var r = this._groups, i = r.length, a = Array(i), o = 0; o < i; ++o) for (var s = r[o], c = s.length, l = a[o] = Array(c), u, d, f = 0; f < c; ++f) (u = s[f]) && (d = e.call(u, u.__data__, f, s)) && ("__data__" in u && (d.__data__ = u.__data__), l[f] = d, Nr(l[f], t, n, f, l, Ir(u, n)));
	return new Hi(a, this._parents, t, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/selectAll.js
function xi(e) {
	var t = this._name, n = this._id;
	typeof e != "function" && (e = P(e));
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
		var a = Re(this, e), o = (this.style.removeProperty(e), Re(this, e));
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
		var o = Re(this, e);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function Di(e, t, n) {
	var r, i, a;
	return function() {
		var o = Re(this, e), s = n(this), c = s + "";
		return s ?? (c = s = (this.style.removeProperty(e), Re(this, e))), o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s));
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
	var t, n = 1, r = .001, i = 1 - r ** (1 / 300), a = 0, o = .6, s = /* @__PURE__ */ new Map(), c = wr(d), l = y("tick", "end"), u = Ua();
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
	var e = Ao, t = jo, n = Fo, r = No, i = Po, a = [0, Infinity], o = [[-Infinity, -Infinity], [Infinity, Infinity]], s = 250, c = lr, l = y("start", "zoom", "end"), u, d, f, p = 500, m = 150, h = 0, g = 10;
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
			return n(b(v(a, l), s, c), e, o);
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
	function b(e, t, n) {
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
			var t = U(this.that).datum();
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
		ko(t), s.wheel = setTimeout(d, m), s.zoom("mouse", n(b(v(c, l), s.mouse[0], s.mouse[1]), s.extent, o));
		function d() {
			s.wheel = null, s.end();
		}
	}
	function E(t, ...r) {
		if (f || !e.apply(this, arguments)) return;
		var i = t.currentTarget, a = C(this, r, !0).event(t), s = U(t.view).on("mousemove.zoom", d, !0).on("mouseup.zoom", p, !0), c = Pt(t, i), l = t.clientX, u = t.clientY;
		zt(t.view), Oo(t), a.mouse = [c, this.__zoom.invert(c)], Rr(this), a.start();
		function d(e) {
			if (ko(e), !a.moved) {
				var t = e.clientX - l, r = e.clientY - u;
				a.moved = t * t + r * r > h;
			}
			a.event(e).zoom("mouse", n(b(a.that.__zoom, a.mouse[0] = Pt(e, i), a.mouse[1]), a.extent, o));
		}
		function p(e) {
			s.on("mousemove.zoom mouseup.zoom", null), Bt(e.view, a.moved), ko(e), a.event(e).end();
		}
	}
	function D(r, ...i) {
		if (e.apply(this, arguments)) {
			var a = this.__zoom, c = Pt(r.changedTouches ? r.changedTouches[0] : r, this), l = a.invert(c), u = a.k * (r.shiftKey ? .5 : 2), d = n(b(v(a, u), c, l), t.apply(this, i), o);
			ko(r), s > 0 ? U(this).transition().duration(s).call(S, d, c, r) : U(this).call(_.transform, d, c, r);
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
			r.zoom("touch", n(b(c, l, u), r.extent, o));
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
				var s = U(this).on("dblclick.zoom");
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
	graphContainer: "_graphContainer_f264b_3",
	flowSingleDot: "_flowSingleDot_f264b_1"
}, Ro = /* @__PURE__ */ m(((e, t) => {
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
})), zo = (/* @__PURE__ */ m(((e, t) => {
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
})))(), K = {
	card: "_card_p3qh2_5",
	draft: "_draft_p3qh2_24",
	published: "_published_p3qh2_28",
	pinned: "_pinned_p3qh2_32",
	marker: "_marker_p3qh2_37",
	title: "_title_p3qh2_46",
	titleCentered: "_titleCentered_p3qh2_57",
	titleInline: "_titleInline_p3qh2_73",
	preview: "_preview_p3qh2_83",
	scroll: "_scroll_p3qh2_93",
	full: "_full_p3qh2_109",
	popout: "_popout_p3qh2_126",
	imageCard: "_imageCard_p3qh2_145",
	imageFrame: "_imageFrame_p3qh2_156",
	imageCaption: "_imageCaption_p3qh2_173",
	scrollFull: "_scrollFull_p3qh2_184",
	titleScrolling: "_titleScrolling_p3qh2_188",
	imageMark: "_imageMark_p3qh2_200",
	bookmarkMark: "_bookmarkMark_p3qh2_214",
	bookmarkCount: "_bookmarkCount_p3qh2_233",
	readersMark: "_readersMark_p3qh2_242",
	glow: "_glow_p3qh2_264",
	cardTitle: "_cardTitle_p3qh2_274",
	resizeGrip: "_resizeGrip_p3qh2_280",
	cardCenter: "_cardCenter_p3qh2_324",
	cardSubtitle: "_cardSubtitle_p3qh2_344",
	readBar: "_readBar_p3qh2_390",
	readFill: "_readFill_p3qh2_401",
	readMark: "_readMark_p3qh2_408",
	complete: "_complete_p3qh2_418",
	sketchBorder: "_sketchBorder_p3qh2_428",
	sketchMain: "_sketchMain_p3qh2_441",
	sketchGhost: "_sketchGhost_p3qh2_442",
	linkCard: "_linkCard_p3qh2_469",
	linkHover: "_linkHover_p3qh2_477",
	linkTitle: "_linkTitle_p3qh2_481",
	linkSubtitle: "_linkSubtitle_p3qh2_488",
	linkBlurb: "_linkBlurb_p3qh2_495",
	linkOut: "_linkOut_p3qh2_505"
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
	}, []), /* @__PURE__ */ p("div", {
		className: o ? Bo.resizing : void 0,
		children: [
			/* @__PURE__ */ f("div", {
				className: `${Bo.handle} ${Bo.handleN}`,
				onPointerDown: (e) => d("n", e),
				title: "Drag to resize height"
			}),
			/* @__PURE__ */ f("div", {
				className: `${Bo.handle} ${Bo.handleS}`,
				onPointerDown: (e) => d("s", e),
				title: "Drag to resize height"
			}),
			/* @__PURE__ */ f("div", {
				className: `${Bo.handle} ${Bo.handleW}`,
				onPointerDown: (e) => d("w", e),
				title: "Drag to resize width"
			}),
			/* @__PURE__ */ f("div", {
				className: `${Bo.handle} ${Bo.handleE}`,
				onPointerDown: (e) => d("e", e),
				title: "Drag to resize width"
			}),
			/* @__PURE__ */ f("div", {
				className: `${Bo.handle} ${Bo.handleNW}`,
				onPointerDown: (e) => d("nw", e),
				title: "Drag to resize"
			}),
			/* @__PURE__ */ f("div", {
				className: `${Bo.handle} ${Bo.handleNE}`,
				onPointerDown: (e) => d("ne", e),
				title: "Drag to resize"
			}),
			/* @__PURE__ */ f("div", {
				className: `${Bo.handle} ${Bo.handleSW}`,
				onPointerDown: (e) => d("sw", e),
				title: "Drag to resize"
			}),
			/* @__PURE__ */ f("div", {
				className: `${Bo.handle} ${Bo.handleSE}`,
				onPointerDown: (e) => d("se", e),
				title: "Drag to resize"
			})
		]
	});
}
//#endregion
//#region src/components/NodeView/TextView/TextView.jsx
var Ko = (/* @__PURE__ */ m(((e, t) => {
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
function Yo({ article: e, width: t, height: n, viewState: r, fullContent: i, onResize: a, cardSettings: o }) {
	let { hovered: s = !1, pinned: c = !1, lod: l = "full", zoomScale: u = 1 } = r || {}, d = s || c, m = c && !!i, h = !(e._status === "published" || e._status === "bloomed" || e.syndication && e.syndication.canonical), g = e.containerColor || e.color || e._source && e._source.color, _ = r?.contributionCount || 0, v = r?.bookmarkCount ?? (Array.isArray(r?.bookmarks) ? r.bookmarks.length : Array.isArray(e?.bookmarks) ? e.bookmarks.length : 0);
	if (e.kind === "image" && e.image) return /* @__PURE__ */ f(es, {
		article: e,
		width: t,
		height: n,
		pinned: c,
		hovered: s,
		isDraft: h,
		zoomScale: u,
		bookmarkCount: v,
		onResize: a
	});
	let y = (e._source && e._source.prominence || e.originalItem && e.originalItem._source && e.originalItem._source.prominence || "secondary") === "primary" ? h ? "#24304a" : "#1e3a5f" : "#23232f";
	if (e.kind === "link" && e.link) return /* @__PURE__ */ f($o, {
		article: e,
		width: t,
		height: n,
		viewState: r,
		cardSettings: o,
		sourceColor: g,
		isDraft: h,
		bgColor: y
	});
	let b = !!e.image, x = r && r.progress, S = x ? Math.max(0, Math.min(1, x.max || 0)) : 0, C = !!(x && x.done), w = [
		K.card,
		C && K.complete,
		g && !c && K.glow,
		h ? K.draft : K.published,
		d && K.expanded,
		c && K.pinned,
		r.lod === "marker" && !d && K.marker
	].filter(Boolean).join(" "), T = r.lod !== "marker", E = o?.cornerRadius == null ? 10 : o.cornerRadius, D = r.lod === "marker" && !d || !t || !n ? null : Jo(e.id || e.title || "", t, n, E);
	return /* @__PURE__ */ p("div", {
		className: w,
		"data-pp-card": !0,
		style: {
			width: t,
			height: n,
			background: y,
			...o?.cornerRadius != null && !(r.lod === "marker" && !d) ? { borderRadius: o.cornerRadius } : {},
			...g && !c ? { "--nv-src": g } : {},
			...g && !c && e.containerColor ? { "--nv-outline": `var(--pp-node-color, ${g})` } : {}
		},
		children: [
			D && /* @__PURE__ */ p("svg", {
				className: K.sketchBorder,
				viewBox: `0 0 ${t} ${n}`,
				preserveAspectRatio: "none",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ f("path", {
					className: K.sketchGhost,
					d: D.ghost
				}), /* @__PURE__ */ f("path", {
					className: K.sketchMain,
					d: D.main
				})]
			}),
			v > 0 && /* @__PURE__ */ p("div", {
				className: K.bookmarkMark,
				title: v === 1 ? "1 bookmark" : `${v} bookmarks`,
				children: [/* @__PURE__ */ f("svg", {
					viewBox: "0 0 16 16",
					width: "12",
					height: "12",
					fill: "currentColor",
					children: /* @__PURE__ */ f("path", { d: "M3 2v12l5-3 5 3V2z" })
				}), v > 1 && /* @__PURE__ */ f("span", {
					className: K.bookmarkCount,
					children: v
				})]
			}),
			_ > 0 && T && /* @__PURE__ */ p("div", {
				className: K.readersMark,
				title: _ === 1 ? "1 from readers" : `${_} from readers`,
				"aria-label": _ === 1 ? "1 from readers" : `${_} from readers`,
				"data-contrib-count": _,
				children: [/* @__PURE__ */ f("svg", {
					viewBox: "0 0 16 16",
					width: "11",
					height: "11",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "1.6",
					"aria-hidden": "true",
					children: /* @__PURE__ */ f("path", {
						d: "M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2z",
						strokeLinejoin: "round"
					})
				}), /* @__PURE__ */ f("span", { children: _ })]
			}),
			b && /* @__PURE__ */ f("div", {
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
			/* @__PURE__ */ f(Qo, {
				article: e,
				width: t,
				height: n - 0,
				bandHeight: 0,
				viewState: r,
				expanded: d,
				useFullArticle: m,
				fullContent: i,
				cardSettings: o
			}),
			T && (S > 0 || C) && /* @__PURE__ */ f("div", {
				className: K.readBar,
				role: "progressbar",
				"aria-label": "Read",
				"aria-valuemin": 0,
				"aria-valuemax": 100,
				"aria-valuenow": Math.round((C ? 1 : S) * 100),
				"data-read-progress": C ? "done" : Math.round(S * 100),
				children: /* @__PURE__ */ f("div", {
					className: K.readFill,
					style: { width: `${(C ? 1 : S) * 100}%` }
				})
			}),
			T && C && /* @__PURE__ */ f("div", {
				className: K.readMark,
				title: "Read to the end",
				"aria-hidden": "true",
				children: "✓"
			}),
			c && /* @__PURE__ */ f(ts, {}),
			T && /* @__PURE__ */ f(Go, {
				width: t,
				height: n,
				zoomScale: u,
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
		return n && n < Zo ? /* @__PURE__ */ p("div", {
			className: `${K.scroll} ${K.scrollFull} ${o ? K.full : ""} rp-scroll`,
			children: [/* @__PURE__ */ f("div", {
				className: K.titleScrolling,
				children: r
			}), t && /* @__PURE__ */ f("div", { dangerouslySetInnerHTML: { __html: t } })]
		}) : /* @__PURE__ */ p(d, { children: [/* @__PURE__ */ f("div", {
			className: K.title,
			children: r
		}), t && /* @__PURE__ */ f("div", {
			className: `${K.scroll} ${o ? K.full : ""} rp-scroll`,
			dangerouslySetInnerHTML: { __html: t }
		})] });
	}
	if (i.lod === "marker") return null;
	let l = c?.subtitle || typeof window < "u" && window.SETTINGS?.graph?.card?.subtitle, u = null;
	if (l && e.series_part != null && e.series_part !== "") {
		let t = e.series_part, n = (0, Ko.numberToLowercaseWords)(t);
		u = l.replace(/\{n\}/g, String(t)).replace(/\{n_words\}/g, n);
	}
	let m = i.lod === "slug" ? e.label || e.labelMedium || e.title || "" : e.title || e.label, h = Xo(m, t, u ? n - 30 : n, {
		min: c?.labelMinFontSize ?? 14,
		max: c?.labelMaxFontSize ?? 26,
		lineHeight: 1.05,
		pad: 8
	}), g = Math.max(11, Math.round(h * .62));
	return /* @__PURE__ */ p("div", {
		className: K.cardCenter,
		children: [/* @__PURE__ */ f("div", {
			className: K.cardTitle,
			style: { fontSize: `${h}px` },
			children: m
		}), u && /* @__PURE__ */ f("div", {
			className: K.cardSubtitle,
			style: { fontSize: `${g}px` },
			children: u
		})]
	});
}
function $o({ article: e, width: t, height: n, viewState: r, cardSettings: i, sourceColor: a, isDraft: o, bgColor: s }) {
	let c = r.lod === "marker" && !r.hovered && !r.pinned, l = i?.cornerRadius == null ? 10 : i.cornerRadius, u = c || !t || !n ? null : Jo(e.id || e.title || "", t, n, l), m = e.title || e.label || "", h = e.description || "", g = e.subtitle || "", _ = Xo(m, t, Math.max(30, (n || 0) * (h ? .42 : .8)), {
		min: Math.min(13, i?.labelMinFontSize ?? 13),
		max: Math.min(20, i?.labelMaxFontSize ?? 20),
		lineHeight: 1.1,
		pad: 8
	});
	return /* @__PURE__ */ p("div", {
		className: [
			K.card,
			o ? K.draft : K.published,
			K.linkCard,
			a && K.glow,
			r.hovered && K.linkHover,
			c && K.marker
		].filter(Boolean).join(" "),
		"data-pp-card": !0,
		"data-link-card": !0,
		style: {
			width: t,
			height: n,
			background: s,
			...i?.cornerRadius != null && !c ? { borderRadius: i.cornerRadius } : {},
			...a ? { "--nv-src": a } : {}
		},
		children: [u && /* @__PURE__ */ p("svg", {
			className: K.sketchBorder,
			viewBox: `0 0 ${t} ${n}`,
			preserveAspectRatio: "none",
			"aria-hidden": "true",
			children: [/* @__PURE__ */ f("path", {
				className: K.sketchGhost,
				d: u.ghost
			}), /* @__PURE__ */ f("path", {
				className: K.sketchMain,
				d: u.main
			})]
		}), !c && /* @__PURE__ */ p(d, { children: [
			/* @__PURE__ */ f("div", {
				className: K.linkTitle,
				style: { fontSize: `${_}px` },
				"data-link-title": !0,
				children: m
			}),
			g && /* @__PURE__ */ f("div", {
				className: K.linkSubtitle,
				"data-link-subtitle": !0,
				children: g
			}),
			h && /* @__PURE__ */ f("div", {
				className: K.linkBlurb,
				"data-link-blurb": !0,
				children: h
			}),
			/* @__PURE__ */ f("span", {
				className: K.linkOut,
				"data-link-out": !0,
				"aria-hidden": "true",
				children: "↗"
			})
		] })]
	});
}
function es({ article: e, width: t, height: n, pinned: r, hovered: i, isDraft: a, zoomScale: o, bookmarkCount: s = 0, onResize: c }) {
	let l = [
		K.imageCard,
		a ? K.draft : K.published,
		r && K.pinned
	].filter(Boolean).join(" "), u = n - 24;
	return /* @__PURE__ */ p("div", {
		className: l,
		style: {
			width: t,
			height: n
		},
		children: [
			s > 0 && /* @__PURE__ */ p("div", {
				className: K.bookmarkMark,
				title: s === 1 ? "1 bookmark" : `${s} bookmarks`,
				children: [/* @__PURE__ */ f("svg", {
					viewBox: "0 0 16 16",
					width: "12",
					height: "12",
					fill: "currentColor",
					children: /* @__PURE__ */ f("path", { d: "M3 2v12l5-3 5 3V2z" })
				}), s > 1 && /* @__PURE__ */ f("span", {
					className: K.bookmarkCount,
					children: s
				})]
			}),
			/* @__PURE__ */ f("div", {
				className: K.imageFrame,
				style: {
					width: t,
					height: u,
					backgroundImage: `url('${e.image}')`
				}
			}),
			/* @__PURE__ */ f("div", {
				className: K.imageCaption,
				children: e.short_title || e.title || e.label
			}),
			r && /* @__PURE__ */ f(ts, {}),
			/* @__PURE__ */ f(Go, {
				width: t,
				height: n,
				zoomScale: o,
				onResize: c
			})
		]
	});
}
function ts() {
	return /* @__PURE__ */ f("div", {
		"data-popout": "1",
		title: "Open in reader",
		className: K.popout,
		children: /* @__PURE__ */ p("svg", {
			"data-popout": "1",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2.2",
			width: "13",
			height: "13",
			style: { pointerEvents: "none" },
			children: [
				/* @__PURE__ */ f("path", { d: "M14 3h7v7" }),
				/* @__PURE__ */ f("path", { d: "M21 3l-9 9" }),
				/* @__PURE__ */ f("path", { d: "M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" })
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
var is = /* @__PURE__ */ m(((e, t) => {
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
})), as = /* @__PURE__ */ m(((e, t) => {
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
})), os = /* @__PURE__ */ m(((e, t) => {
	var n = (e) => typeof e == "string" && e.trim() ? e.trim() : "", r = (e) => e !== "" && e != null && Number.isFinite(Number(e)) ? Math.max(0, Math.min(1, Number(e))) : null;
	function i(e) {
		return e && (e.badgeColor || e.color || e.stroke) || "#d4af37";
	}
	function a(e) {
		let t = n(e).replace(/'/g, "");
		return t ? `'${t}', sans-serif` : null;
	}
	function o(e, t) {
		let o = e && e.look && typeof e.look == "object" ? e.look : {}, s = t && n(t.color) ? t : null, c = i(e), l = n(s ? s.color : o.fill), u = n(s ? s.color : o.stroke), d = l ? r(s ? s.fillOpacity : o.fillOpacity) : null, f = u || c;
		return {
			closed: {
				fill: l || `color-mix(in srgb, ${c} 16%, var(--pp-macro-base, #151826))`,
				fillOpacity: d,
				stroke: f,
				glow: f === "none" ? null : f
			},
			open: {
				fill: l || e && e.fill || "rgba(212, 175, 55, 0.03)",
				fillOpacity: d,
				stroke: u || e && e.stroke || "rgba(212, 175, 55, 0.45)"
			},
			label: {
				face: a(o.labelFace),
				color: (s ? n(s.labelColor) || n(s.color) : n(o.labelColor)) || null
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
})), ss = /* @__PURE__ */ m(((e, t) => {
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
})), cs = /* @__PURE__ */ m(((e, t) => {
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
})), ls = /* @__PURE__ */ m(((e, t) => {
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
})), us = /* @__PURE__ */ m(((e, t) => {
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
})), ds = /* @__PURE__ */ m(((e, t) => {
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
})), fs = /* @__PURE__ */ m(((e, t) => {
	var { zoomAbout: n, fitRatioAbout: r } = ds();
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
})), ps = /* @__PURE__ */ m(((e, t) => {
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
})), ms = /* @__PURE__ */ m(((e, t) => {
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
})), hs = /* @__PURE__ */ m(((e, t) => {
	function n({ ms: e = 250, px: t = 32, now: n = () => Date.now(), setTimer: r = setTimeout, clearTimer: i = clearTimeout } = {}) {
		let a = null;
		function o(o, s, c, l) {
			let u = n();
			if (a && u - a.t <= e && Math.hypot(o - a.x, s - a.y) <= t) return i(a.timer), a = null, l && l(), "double";
			if (a) {
				i(a.timer);
				let e = a.run;
				a = null, e();
			}
			let d = {
				t: u,
				x: o,
				y: s,
				run: c
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
})), gs = /* @__PURE__ */ m(((e, t) => {
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
})), _s = /* @__PURE__ */ m(((e, t) => {
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
})), vs = /* @__PURE__ */ m(((e, t) => {
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
})), ys = /* @__PURE__ */ m(((e, t) => {
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
})), bs = /* @__PURE__ */ m(((e, t) => {
	var { TIMES_OF_DAY: n, sceneMonth: r } = ys(), i = {
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
})), xs = /* @__PURE__ */ m(((e, t) => {
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
})), Ss = /* @__PURE__ */ m(((e, t) => {
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
})), Cs = /* @__PURE__ */ m(((e, t) => {
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
})), ws = is(), Ts = as(), Es = os(), Ds = ss(), Os = cs(), ks = ls(), As = us(), js = ds(), Ms = fs(), Ns = ps(), Ps = ms(), Fs = hs(), Is = gs(), Ls = Ro(), Rs = _s(), zs = vs(), Bs = bs(), Vs = xs(), Hs = Ss(), Us = Cs(), Ws = () => typeof window < "u" ? window.SETTINGS : null;
function Gs(e, t = {}) {
	let n = [], r = [], i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map(), s = new Set(t.visibleLayers || ["sequence"]), c = t.tagColor || "#f39c12", l = t.topologyColor || "#9b59b6", u = t.placeholderColor || "#7f8c8d";
	for (let r of e.items) {
		let i = r.url.split("/").pop().replace(".html", ""), s = r._status || "draft";
		o.set(r.id, i), a.add(i);
		let c = null, l = e.containers || t.containment || [];
		for (let e of l) if (e.parent && e.tag && (r.tags || []).includes(e.tag)) {
			c = e.badgeColor || e.color || e.stroke;
			break;
		}
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
			series: r.series || "",
			series_part: r.series_part ?? null,
			timeline: r.timeline || null,
			commit_times: r.commit_times || [],
			license: r.license || "",
			canonical_url: r.canonical_url || r.url,
			syndication: r.syndication || {},
			size: 60,
			containerColor: c,
			color: c || (s === "published" ? "var(--nv-published)" : "var(--nv-draft)"),
			kind: r.kind || "essay",
			substrate: r.substrate || "essay",
			seed: r.seed || "",
			topology: r.topology || [],
			energy: r.energy || "",
			connected_to: r.connected_to || [],
			forms: r.forms || {},
			note: r.note || "",
			todos: r.todos || [],
			link: (0, Hs.isLinkItem)(r) ? (0, Hs.linkOf)(r) : "",
			subtitle: r.subtitle || "",
			_source: r._source || null,
			originalItem: r
		});
	}
	function d(e) {
		return e.startsWith("tag:") || e.startsWith("topology:") ? e : o.get(e) || e;
	}
	let f = [];
	for (let t of e.edges || []) {
		if (t.layer === "containment" || t.role === "contains") {
			f.push({
				source: t.source,
				target: d(t.target),
				attrs: t.attrs || {}
			});
			continue;
		}
		if (!s.has(t.layer)) continue;
		let e = d(t.source), n = d(t.target);
		t.layer === "tag" && !i.has(n) ? i.set(n, {
			id: n,
			label: n.slice(4),
			type: "tag",
			size: 30,
			color: c
		}) : t.layer === "topology" && !i.has(n) ? i.set(n, {
			id: n,
			label: n.slice(9),
			type: "topology",
			size: 30,
			color: l
		}) : t.layer === "authored" && !a.has(n) && !i.has(n) && i.set(n, {
			id: n,
			label: n,
			type: "placeholder",
			size: 40,
			color: u
		});
		let o = t.label || t.attrs && t.attrs.label || t.role || t.layer;
		r.push({
			source: e,
			target: n,
			directed: !!t.directed,
			role: t.role,
			layer: t.layer,
			label: o
		});
	}
	n.push(...i.values());
	let p = e.containers || t.containment || [];
	if (p.length === 0 && f.length > 0) {
		let e = /* @__PURE__ */ new Map();
		for (let t of f) if (!a.has(t.source) && !e.has(t.source)) {
			let n = t.attrs?.label || t.source.replace(/^container:/, "").replace(/^tag:/, "").replace(/-/g, " ");
			e.set(t.source, {
				id: t.source,
				label: n.toUpperCase(),
				parent: t.attrs?.parent || null
			});
		}
		p = Array.from(e.values());
	}
	return {
		nodes: n,
		links: r,
		containmentEdges: f,
		containers: p
	};
}
function Ks(e, t, n) {
	let r = (e) => e && e.type === "article" && e._source && n.has(e._source.id), i = (e) => !!(e && (e._closedHidden || r(e)));
	e.selectAll(".node").style("display", (e) => i(e) ? "none" : null), t.selectAll(".node-card").style("display", (e) => i(e) ? "none" : null), e.selectAll(".link, .link-hit").style("display", (e) => {
		let t = typeof e.source == "object" ? e.source : null, n = typeof e.target == "object" ? e.target : null;
		return i(t) || i(n) ? "none" : null;
	});
}
function qs(e, t, n) {
	if (!n) {
		t.selectAll(".node-card").classed("dimmed", !1), e.selectAll(".node").classed("dimmed", !1), e.selectAll(".link").classed("dimmed", !1);
		return;
	}
	t.selectAll(".node-card").classed("dimmed", (e) => !n.has(e.id)), e.selectAll(".node").classed("dimmed", (e) => e.type === "article" ? !n.has(e.id) : !1), e.selectAll(".link").classed("dimmed", (e) => {
		let t = typeof e.source == "object" ? e.source.id : e.source, r = typeof e.target == "object" ? e.target.id : e.target;
		return !n.has(t) && !n.has(r);
	});
}
function Js(e) {
	let t = {};
	for (let n of e && e.containers || []) {
		let e = (0, zs.fraction)(n.anchor);
		e && (t[n.id] = e);
	}
	return t;
}
function Ys(e) {
	let t = {};
	for (let n of e && e.containers || []) {
		let e = {};
		n.layout && (e.layout = n.layout), n.hang && typeof n.hang == "object" && (e.hang = n.hang), n.spiral && typeof n.spiral == "object" && (e.spiral = n.spiral), (n.hull === !1 || n.hull && typeof n.hull == "object") && (e.hull = n.hull), Object.keys(e).length && (t[n.id] = e);
	}
	return t;
}
function Xs(e) {
	return e && (e.labelPosition === "top" || e.labelPosition === "hidden") ? e.labelPosition : "center";
}
var Zs = .35, Qs = .6;
function $s(e) {
	return e < Zs ? "marker" : e < Qs ? "title" : "full";
}
function ec(e) {
	return function({ hovered: t, pinned: n, lod: r }) {
		return n ? {
			width: e.pinnedWidth,
			height: e.pinnedHeight
		} : t ? {
			width: e.hoverWidth,
			height: e.hoverHeight
		} : r === "marker" ? {
			width: 16,
			height: 16
		} : {
			width: e.width,
			height: e.height
		};
	};
}
function tc({ feedData: e, onNodeSelect: n, hiddenSources: i, filteredArticleIds: a, viewState: o, layout: l = "force", timeAxis: d, graphSettings: p, colorOverrides: m, apiRef: v, onNodeFocus: y, contributions: b }) {
	let x = p || {}, S = {
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
		...x.card || {}
	}, C = {
		fontSize: 22,
		padding: 11,
		maxWidth: 150,
		maxLines: 3,
		cornerRadius: 9,
		opacity: .7,
		...x.tag || {}
	}, w = {
		dock: "left",
		inset: 54,
		endPadding: 70,
		connectorOpacity: .45,
		connectorWidth: 1.6,
		spineOpacity: .55,
		spineWidth: 3,
		tickFontSize: 13,
		...x.timeAxis || {}
	}, T = {
		linkDistance: 160,
		chargeStrength: -500,
		collidePadding: 10,
		velocityDecay: .7,
		alphaDecay: .028,
		...x.simulation || {}
	}, E = (e) => {
		let t = e && e.hull && typeof e.hull == "object" ? Number(e.hull.padding) : NaN;
		if (Number.isFinite(t)) return t;
		let n = x.hull && typeof x.hull == "object" ? Number(x.hull.padding) : NaN;
		return Number.isFinite(n) ? n : (0, Ts.containerLayoutOf)(e, x) === "hang" ? S.width / 2 : e && e.padding != null ? e.padding : e && e.parent ? 42 : 75;
	}, D = s(null), O = s(null), k = s(null), A = s(n);
	r(() => {
		A.current = n;
	}, [n]);
	let j = s(y);
	r(() => {
		j.current = y;
	}, [y]);
	let M = s(null), N = (e) => {
		M.current = e ? e.id : null, j.current && j.current(e ? e.originalItem || e : null);
	}, P = s(o);
	r(() => {
		P.current = o;
	}, [o]);
	let F = ec(S);
	S.glowPadding;
	let I = s(null), L = s(l), R = s(!1), z = s(null), B = s(null), ee = s(null), te = s(null), ne = s(null), re = s(b || []), ie = s(null), V = (e) => e.originalItem && e.originalItem.id || e.id, ae = s({
		settings: null,
		feed: null,
		keys: /* @__PURE__ */ new Map()
	}), oe = (t) => {
		let n = ae.current;
		return (n.settings !== p || n.feed !== e) && (n.settings = p, n.feed = e, n.keys = /* @__PURE__ */ new Map()), n.keys.has(t) || n.keys.set(t, (0, Rs.layoutKey)(t, p, {
			anchors: Js(e),
			layouts: Ys(e)
		}) + "::"), n.keys.get(t);
	}, se = (e) => oe(L.current) + V(e), H = s(/* @__PURE__ */ new Set()), ce = s(null), le = s(1), ue = s("full"), de = s(/* @__PURE__ */ new Set());
	r(() => {
		de.current = i instanceof Set ? i : new Set(i || []), !(!O.current || !k.current) && Ks(O.current, U(k.current), de.current);
	}, [i]), r(() => {
		if (!(!D.current || !m)) for (let [e, t] of Object.entries(m)) t && D.current.style.setProperty(e, t);
	}, [m]);
	let [fe, pe] = c(0);
	r(() => {
		if (!o) return;
		let e = o.historyVersion || 0;
		return o.subscribe(() => {
			let t = o.historyVersion || 0;
			t !== e && (e = t, pe(t));
		});
	}, [o]), r(() => {
		if (o) return o.subscribe(() => {
			ee.current && ee.current(), te.current && te.current(), ie.current && ie.current(), ne.current && ne.current();
		});
	}, [o]), r(() => {
		re.current = b || [], ee.current && ee.current(), ie.current && ie.current({ rebuild: !0 });
	}, [b]), r(() => {
		!O.current || !k.current || qs(O.current, U(k.current), a);
	}, [a]), r(() => {
		if (!e || !D.current) return;
		let n = D.current, r = n.clientWidth, i = n.clientHeight, a = getComputedStyle(n), o = Gs(e, {
			tagColor: a.getPropertyValue("--gv-tag-color").trim() || "#f39c12",
			topologyColor: a.getPropertyValue("--gv-topology-color").trim() || "#9b59b6",
			placeholderColor: a.getPropertyValue("--gv-placeholder-color").trim() || "#7f8c8d",
			visibleLayers: Array.isArray(x.visibleLayers) ? x.visibleLayers : ["sequence"]
		});
		U(n).selectAll("svg").remove(), U(n).selectAll(".cards-layer").remove();
		let s = U(n).append("svg").attr("width", r).attr("height", i).style("position", "absolute").style("inset", "0").style("pointer-events", "all");
		O.current = s;
		let c = s.append("defs");
		c.append("marker").attr("id", "sequence-arrow").attr("viewBox", "0 0 10 10").attr("refX", 8).attr("refY", 5).attr("markerWidth", 7).attr("markerHeight", 7).attr("orient", "auto").append("path").attr("d", "M 0 1.5 L 8 5 L 0 8.5 z").attr("fill", "var(--gv-accent, #d4af37)");
		let l = U(n).append("div").attr("class", "cards-layer").style("position", "absolute").style("left", "0").style("top", "0").style("width", "100%").style("height", "100%").style("pointer-events", "none");
		k.current = l.node();
		let d = l.append("div").attr("class", "cards-transform").style("transform-origin", "0 0").style("position", "absolute").style("left", "0").style("top", "0").style("width", "0").style("height", "0").style("overflow", "visible"), f = s.append("g"), m = !1, y = !!x.initialFocus && x.initialFocus !== "all", b = x.initialFocusMinScale == null ? .4 : x.initialFocusMinScale, w = (0, Ns.minCardScale)(x.initialScale, S.width), j = (0, Ns.homeScale)(b, x.initialScale, S.width), R = 0, ae = null, fe = 0, pe = !1, me = !1, he = null, ge = {
			x: 0,
			y: 0,
			k: 1
		}, _e = () => R ? ` rotate(${-R})` : "", ve = (e) => (0, As.rotatedView)(e, ae, R);
		function ye(e) {
			ge = ve(e), f.attr("transform", `translate(${ge.x},${ge.y}) rotate(${R}) scale(${ge.k})`), d && d.style("transform", `translate3d(${ge.x}px, ${ge.y}px, 0px) rotate(${R}deg) scale(${ge.k})`), n && n.style.setProperty("--gv-unrot", `${-R}deg`), fe !== R && (fe = R, pe && ei());
		}
		let be = (e, t) => (0, As.viewToScreen)(ge, R, e, t), xe = Io().on("zoom", (e) => {
			e.sourceEvent && (m = !0, y = !1), ye(e.transform);
			let t = e.transform.k;
			le.current = t, pe && Ce && dn() && ei(), pe && ri(), Tr && Or(), B.current && B.current(), pe && Bn();
			let n = $s(t);
			n !== ue.current && (ue.current = n, Gr(), $r());
		}), Se = (0, js.zoomPivotMode)(x) === "art", Ce = (0, Ms.zoomModeOf)(x) === "grow-in-place", we = () => {
			if (!Se || typeof window > "u") return null;
			let e = window.PostPipeCoverFrame;
			if (!e || !e.art || !e.zoomPivot) return null;
			let t = (0, zs.artPoint)(e.zoomPivot, e.art), n = D.current ? D.current.getBoundingClientRect() : {
				left: 0,
				top: 0
			}, r = window.PostPipeCover && window.PostPipeCover.shift || 0;
			return [t.x - n.left, t.y - (n.top - r)];
		};
		if (Se || Ce) {
			let e = xe.constrain();
			xe.constrain((t, n, r) => {
				let i = Do(s.node());
				if (dn()) {
					let e = pn(), n = (0, Ms.growConstrain)(i, t, e[0], e[1], bn());
					t = Eo.translate(n.x, n.y).scale(n.k);
				} else {
					let e = we();
					if (e) {
						let n = (0, js.repivot)(i, t, e[0], e[1]);
						t = Eo.translate(n.x, n.y).scale(n.k);
					}
				}
				return e(t, n, r);
			}), xe.interpolate(Yn);
		}
		s.call(xe).on("dblclick.zoom", null);
		let Te = (e) => {
			let t = e.touches[0], n = e.touches[1];
			return Math.atan2(n.clientY - t.clientY, n.clientX - t.clientX) * 180 / Math.PI;
		}, Ee = (e) => {
			let t = n.getBoundingClientRect(), r = e.touches[0], i = e.touches[1];
			return [(r.clientX + i.clientX) / 2 - t.left, (r.clientY + i.clientY) / 2 - t.top];
		}, De = (e) => {
			if (e.touches.length !== 2) return;
			let [t, n] = Ee(e);
			ae = {
				theta0: R,
				a0: Te(e),
				mx: t,
				my: n,
				started: !1
			};
		}, Oe = (e) => {
			if (!ae || e.touches.length !== 2) return;
			let [t, n] = Ee(e);
			ae.mx = t, ae.my = n;
			let r = (0, As.angleDelta)(Te(e), ae.a0);
			if (!ae.started) {
				if (Math.abs(r) < 10) return;
				ae.started = !0, ae.a0 = Te(e);
				return;
			}
			R = (0, As.normalizeAngle)(ae.theta0 + r);
		}, ke = (e) => {
			if (!ae || e.touches.length >= 2) return;
			let t = ve(Do(s.node()));
			ae = null, s.call(xe.transform, Eo.translate(t.x, t.y).scale(t.k));
		};
		n.addEventListener("touchstart", De, {
			capture: !0,
			passive: !0
		}), n.addEventListener("touchmove", Oe, {
			capture: !0,
			passive: !0
		}), n.addEventListener("touchend", ke, {
			capture: !0,
			passive: !0
		}), n.addEventListener("touchcancel", ke, {
			capture: !0,
			passive: !0
		});
		function Ae({ repaint: e = !0 } = {}) {
			if (!R && !ae) return;
			ae = null;
			let t = Do(s.node()), n = r / 2, a = i / 2, o = (0, As.screenToView)(ge, R, n, a);
			R = 0, e && s.call(xe.transform, Eo.translate(n - o[0] * t.k, a - o[1] * t.k).scale(t.k));
		}
		let je = (0, Fs.createTapGate)({
			ms: Number.isFinite(x.doubleTapMs) ? x.doubleTapMs : 250,
			px: 32
		});
		function Me(e) {
			let t = e && e.changedTouches && e.changedTouches.length ? e.changedTouches[0] : e, a = n.getBoundingClientRect();
			return !t || !Number.isFinite(t.clientX) ? [r / 2, i / 2] : [t.clientX - a.left, t.clientY - a.top];
		}
		function Ne(e, t, n) {
			m = !0, y = !1, s.transition("tap-zoom").duration(320).ease(Ki).call(xe.scaleBy, n, [e, t]);
		}
		function Pe(e, t, n) {
			let [r, i] = Me(e), a = !!(e && e.shiftKey);
			je.tap(r, i, t, n || (() => Ne(r, i, a ? .5 : 2)));
		}
		let Fe = null, Ie = null, Le = (e) => {
			if (e.touches.length === 2) {
				let [t, n] = Ee(e);
				Fe = {
					t: Date.now(),
					x: t,
					y: n,
					moved: !1
				};
			} else e.touches.length > 2 && (Fe = null);
		}, Re = (e) => {
			if (!Fe || e.touches.length !== 2) return;
			let [t, n] = Ee(e);
			Math.hypot(t - Fe.x, n - Fe.y) > 14 && (Fe.moved = !0);
		}, ze = (e) => {
			if (!Fe || e.touches.length > 0) return;
			let t = Fe;
			Fe = null;
			let n = Date.now();
			t.moved || n - t.t > 350 || (Ie && n - Ie.t <= 450 && Math.hypot(t.x - Ie.x, t.y - Ie.y) <= 60 ? (Ie = null, Ne(t.x, t.y, .5)) : Ie = {
				t: n,
				x: t.x,
				y: t.y
			});
		};
		n.addEventListener("touchstart", Le, {
			capture: !0,
			passive: !0
		}), n.addEventListener("touchmove", Re, {
			capture: !0,
			passive: !0
		}), n.addEventListener("touchend", ze, {
			capture: !0,
			passive: !0
		});
		let Be = !1;
		if (P.current && (Be = (0, ws.layoutIsDegenerate)(o.nodes.map((e) => P.current.nodeState(se(e))).filter((e) => e && Number.isFinite(e.x) && Number.isFinite(e.y)), F({
			hovered: !1,
			pinned: !1
		}))), P.current && !Be) for (let e of o.nodes) {
			let t = P.current.nodeState(se(e)), n = P.current.nodeState(V(e));
			t && typeof t.x == "number" && typeof t.y == "number" && (e.x = t.x, e.y = t.y, t.auto || (e.fx = t.x, e.fy = t.y)), n && typeof n.w == "number" && typeof n.h == "number" && (e._size = {
				width: n.w,
				height: n.h
			});
		}
		if (H.current = /* @__PURE__ */ new Set(), P.current) for (let e of o.nodes) {
			let t = P.current.nodeState(V(e));
			e.type === "article" && !e.link && t && t.pinned && H.current.add(e.id);
		}
		if (P.current && Be) for (let e of o.nodes) {
			let t = P.current.nodeState(V(e));
			t && typeof t.w == "number" && typeof t.h == "number" && (e._size = {
				width: t.w,
				height: t.h
			});
		}
		let Ve = Ja().force("link", za().id((e) => e.id).distance(T.linkDistance)).force("charge", Ya().strength(T.chargeStrength)).force("collide", Ia().radius((e) => (e._r || (e.type === "article" ? Math.hypot(S.width, S.height) / 2 : e.size / 2)) + T.collidePadding).strength(1).iterations(3)).force("center", la(r / 2, i / 2)).velocityDecay(T.velocityDecay).alphaDecay(T.alphaDecay), He = () => {
			z.current && z.current(), D.current && (r = D.current.clientWidth, i = D.current.clientHeight, s.attr("width", r).attr("height", i));
		};
		window.addEventListener("resize", He);
		let Ue = s.append("g").attr("class", "time-axis-layer"), We = f.append("g").attr("class", "roots-layer").attr("aria-hidden", "true").style("pointer-events", "none"), Ge = f.append("g").attr("class", "containers-layer"), Ke = /* @__PURE__ */ new Map(), qe = /* @__PURE__ */ new Map();
		for (let e of o.containers || []) Ke.set(e.id, /* @__PURE__ */ new Set()), qe.set(e.id, /* @__PURE__ */ new Set());
		for (let e of o.containmentEdges || []) Ke.has(e.source) && Ke.has(e.target) ? Ke.get(e.source).add(e.target) : qe.has(e.source) && qe.get(e.source).add(e.target);
		let Je = /* @__PURE__ */ new Map();
		function Ye(e, t) {
			if (!t && Je.has(e)) return Je.get(e);
			let n = t || /* @__PURE__ */ new Set();
			if (n.has(e)) return [];
			n.add(e);
			let r = Array.from(qe.get(e) || []), i = Array.from(Ke.get(e) || []).flatMap((e) => Ye(e, n)), a = Array.from(new Set([...r, ...i]));
			return t || Je.set(e, a), a;
		}
		let Xe = [...o.containers || []].sort((e, t) => t.parent === e.id ? -1 : +(e.parent === t.id)), Ze = Ge.selectAll(".container-group").data(Xe, (e) => e.id).enter().append("g").attr("class", "container-group").attr("data-container-id", (e) => e.id), Qe = () => {
			let e = P.current;
			return e && e.preference ? e.preference("nodePalette") : null;
		}, $e = (0, Ds.nodePaletteFor)(x, Qe()), et = (e) => e && e._look || (0, Es.containerLook)(e, $e);
		for (let e of o.containers || []) e._look = (0, Es.containerLook)(e, $e);
		let tt = () => {
			$e ? n.style.setProperty("--pp-node-color", $e.color) : n.style.removeProperty("--pp-node-color");
		};
		tt(), Ze.append("path").attr("class", "container-hull").attr("stroke-width", (e) => e.strokeWidth || 1.5).attr("stroke-dasharray", (e) => e.strokeDasharray || (e.parent ? null : "6 6")), Ze.append("path").attr("class", "container-hull-ghost");
		let nt = typeof document < "u" && document.documentElement.getAttribute("data-pp-theme") === "sketchbook", rt = () => (0, Ps.initiallyClosed)(e.containers || [], x), it = new Set(rt()), at = /* @__PURE__ */ new Map(), ot = /* @__PURE__ */ new Map(), st = 1.05, ct = (0, ks.showContainerCount)(x);
		function lt(e) {
			let t = (e.label || e.id).split(/\s+/), n = [], r = "";
			for (let e of t) r ? r.length + 1 + e.length > 15 ? (n.push(r), r = e) : r += " " + e : r = e;
			return r && n.push(r), n;
		}
		let ut = .42, dt = .2, ft = (e) => e.status ? String(e.status) : "";
		function pt(e, t = {}) {
			let n = lt(e).length, r = ft(e) && t.status !== !1 ? dt + ut * 1.3 : 0;
			return {
				n,
				statusH: r,
				total: n * st + r
			};
		}
		function mt(e, t, n = {}) {
			let r = lt(t), { n: i, total: a } = pt(t, n), o = -a / 2;
			e.selectAll("*").remove(), r.forEach((t, n) => {
				e.append("tspan").attr("class", "label-line").attr("x", 0).attr("y", `${o + (n + .5) * st}em`).text(t), ct && n === i - 1 && e.append("tspan").attr("class", "label-count").attr("font-weight", "500").attr("dx", "12px").attr("font-size", "0.5em").text("");
			});
			let s = n.status === !1 ? "" : ft(t);
			if (s) {
				let t = o + i * st + dt + ut * 1.3 / 2;
				e.append("tspan").attr("class", "label-status").attr("x", 0).attr("font-size", `${ut}em`).attr("font-weight", "500").attr("letter-spacing", "0.02em").attr("y", `${t / ut}em`).text(s);
			}
		}
		let ht = typeof document < "u" ? document.createElement("canvas").getContext("2d") : null;
		function gt() {
			return typeof document > "u" ? "'Atkinson', sans-serif" : getComputedStyle(document.documentElement).getPropertyValue("--pp-title-font").trim() || "'Atkinson', sans-serif";
		}
		function _t(e, t, n, r) {
			let i = r ? 0 : e.length * t * .05;
			return ht ? (ht.font = r ? `400 ${t}px ${r}` : `${nt ? 400 : n} ${t}px ${gt()}`, ht.measureText(e).width * 1.06 + i) : e.length * t * .6 + i;
		}
		function vt(e, t, n = {}) {
			let r = lt(e), i = ct ? _t(" 000", t * .5, 500, n.family) + 12 : 0, a = n.status === !1 ? "" : ft(e), o = Math.max(...r.map((e, a) => _t(e, t, 700, n.family) + (a === r.length - 1 ? i : 0)), a ? _t(a, t * ut, 500, n.family) : 0), s = pt(e, n).total * t + .3 * t;
			return {
				w: o + 24,
				h: s + 12
			};
		}
		function yt(e) {
			return e.badgeColor || e.color || e.stroke || "#d4af37";
		}
		let bt = Ze.append("g").attr("class", "container-badge").attr("data-container-top", (e) => e.parent ? null : "").style("touch-action", "manipulation");
		bt.append("rect").attr("class", "container-badge-hit").attr("fill", "transparent").attr("pointer-events", "all");
		let xt = bt.append("text").attr("class", "container-badge-text").attr("text-anchor", "middle").attr("dominant-baseline", "central").style("user-select", "none").attr("fill", (e) => yt(e)).attr("opacity", .55).attr("font-size", (e) => e.parent ? "52px" : "64px");
		xt.each(function(e) {
			mt(U(this), e);
		});
		let St = (e) => et(e).label.face;
		function Ct() {
			if (typeof document > "u") return;
			let e = typeof window < "u" ? window.SETTINGS : null, t = document.documentElement.getAttribute("data-pp-mode") || "dark", n = getComputedStyle(document.body).backgroundColor, r = !n || /rgba\([^)]*,\s*0\)$/.test(n) || n === "transparent", i = (0, Bs.allBackgrounds)((0, Bs.config)(e), t, r ? null : n);
			xt.each(function(e) {
				let t = et(e).label.color, n = t ? {
					color: t,
					opacity: 1
				} : (0, Bs.legibleOn)(yt(e), i, { opacity: .55 });
				U(this).attr("fill", n.color).attr("opacity", n.opacity);
			});
		}
		Ct();
		function wt() {
			Ct();
			let e = document.documentElement.getAttribute("data-pp-theme") === "sketchbook";
			if (e === nt) return;
			nt = e;
			let t = () => {
				pe && (cr(), ei());
			};
			document.fonts && document.fonts.load ? document.fonts.load(`48px ${gt()}`).then(t, t) : t();
		}
		let Tt = typeof MutationObserver < "u" ? new MutationObserver(wt) : null;
		nt && typeof document < "u" && document.fonts && document.fonts.load && document.fonts.load(`48px ${gt()}`).then(() => {
			!pe || !O.current || (cr(), ei());
		}, () => {}), Tt && Tt.observe(document.documentElement, {
			attributes: !0,
			attributeFilter: ["data-pp-mode", "data-pp-theme"]
		});
		let Et = Ze.append("g").attr("class", "container-macro-node").style("display", "none").style("touch-action", "manipulation"), Dt = (0, Ts.closedPillOf)(x);
		Et.append("path").attr("class", "container-macro-bg").attr("stroke-width", 2.2);
		let Ot = (0, Ts.closedPillScaleOf)(x), kt = Dt.labelSize || Math.round((S.labelMaxFontSize || 26) * 1.6), At = Et.append("text").attr("class", "container-macro-text").attr("text-anchor", "middle").attr("dominant-baseline", "central").attr("font-size", (e) => `${e.parent ? kt : Math.round(kt * 1.25)}px`).attr("font-family", "'Atkinson', sans-serif").attr("font-weight", "700").attr("letter-spacing", "-0.02em");
		function jt() {
			Ze.select(".container-hull").style("fill", (e) => et(e).open.fill).style("fill-opacity", (e) => et(e).open.fillOpacity).style("stroke", (e) => et(e).open.stroke), Ze.select(".container-hull-ghost").style("stroke", (e) => et(e).open.stroke), Ze.select(".container-macro-bg").style("fill", (e) => et(e).closed.fill).style("fill-opacity", (e) => et(e).closed.fillOpacity).style("stroke", (e) => et(e).closed.stroke).style("filter", (e) => et(e).closed.glow ? `drop-shadow(0 0 18px color-mix(in srgb, ${et(e).closed.glow} 45%, transparent))` : "none");
			for (let e of [At, xt]) e.style("font-family", (e) => St(e)).style("font-weight", (e) => St(e) ? "400" : null).style("letter-spacing", (e) => St(e) ? "0" : null);
			At.attr("fill", (e) => et(e).label.color || yt(e)), Ct();
		}
		jt(), ne.current = () => {
			let e = (0, Ds.nodePaletteFor)(x, Qe());
			if ((e && e.id) !== ($e && $e.id)) {
				$e = e;
				for (let e of o.containers || []) e._look = (0, Es.containerLook)(e, $e);
				jt(), tt();
			}
		};
		let Mt = lo().curve(So.alpha(.5));
		function Nt(e, t, n) {
			let r = 0;
			for (let t = 0; t < e.length; t++) r = r * 31 + e.charCodeAt(t) >>> 0;
			let i = () => (r = r * 1664525 + 1013904223 >>> 0, r / 4294967296);
			if (Dt.shape === "blob") return Mt(Pt(i, t, n));
			let a = [];
			for (let e = 0; e < 14; e++) {
				let r = e / 14 * Math.PI * 2, o = Math.cos(r), s = Math.sin(r), c = 2 / 2.8, l = 1 + (i() - .5) * .08;
				a.push([Math.sign(o) * Math.abs(o) ** +c * t * l, Math.sign(s) * Math.abs(s) ** +c * n * l]);
			}
			return Mt(a);
		}
		function Pt(e, t, n) {
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
		At.each(function(e) {
			mt(U(this), e, {
				status: Dt.status,
				family: St(e)
			});
		});
		let Ft = [...new Set((o.containers || []).map(St).filter(Boolean))];
		Ft.length && typeof document < "u" && document.fonts && document.fonts.load && Promise.all(Ft.map((e) => document.fonts.load(`48px ${e}`))).then(() => {
			!pe || !O.current || (cr(), ei());
		}, () => {});
		function It() {
			Et.each(function(e) {
				let t = U(this), n = parseFloat(t.select(".container-macro-text").attr("font-size")) || kt, r = vt(e, n, {
					status: Dt.status,
					family: St(e)
				}), i = Math.max(S.width * 1.5, r.w + n * 1.4), a = Math.max(S.height * 1.5, r.h + n * 1.4);
				t.select(".container-macro-bg").attr("d", Nt(e.id, i / 2, a / 2)), e._macroHalfW = i / 2 * Ot, e._macroHalfH = a / 2 * Ot;
			});
		}
		It();
		function Lt({ isCollapsed: e }) {
			return Kt().clickDistance(5).container(() => f.node()).filter((e) => !(e.ctrlKey || e.button !== void 0 && e.button !== 0)).on("start", function(e, t) {
				e.sourceEvent && e.sourceEvent.stopPropagation();
				let n = e.x, r = e.y;
				U(this).datum()._dragState = {
					startX: n,
					startY: r,
					lastX: n,
					lastY: r,
					totalMove: 0
				};
			}).on("drag", function(e, t) {
				let n = U(this).datum()._dragState;
				if (!n) return;
				let r = dn() ? ge.k / he : 1, i = (e.x - n.lastX) * r, a = (e.y - n.lastY) * r;
				n.lastX = e.x, n.lastY = e.y, n.totalMove += Math.hypot(i, a) / r;
				let o = Ye(t.id);
				if (!n.carried) {
					let e = new Set(o);
					n.carried = [...tn.keys()].filter((t) => {
						let n = Ye(t);
						return n.length && n.every((t) => e.has(t));
					});
				}
				for (let e of n.carried) {
					let t = mn(e);
					t && ln.set(e, {
						x: t.x + i,
						y: t.y + a
					});
				}
				for (let e of o) {
					let t = W.get(e);
					t && (t.x += i, t.y += a, t.fx = t.x, t.fy = t.y, P.current && P.current.setNodePosition(se(t), t.x, t.y, { transient: !0 }));
				}
				ei(), B.current && B.current();
			}).on("end", function(t, n) {
				let r = U(this).datum()._dragState;
				if (delete U(this).datum()._dragState, (r ? r.totalMove : 0) >= 4) {
					Cn = !1;
					let e = Ye(n.id);
					if (me) {
						let t = new Set(e);
						for (let e of tn.keys()) {
							let n = Ye(e);
							n.length && n.every((e) => t.has(e)) && Dn(e);
						}
					}
					let t = P.current;
					for (let n of e) {
						let e = W.get(n);
						e && (e.fx = e.x, e.fy = e.y, t && t.setNodePosition(se(e), e.x, e.y, { transient: !0 }));
					}
					t && t.commit(), ei();
				} else {
					let r = () => {
						e ? rr([n.id], !0) : rr([n.id], it.has(n.id));
					};
					(p.collapseGesture || "tap") === "doubletap" ? Pe(t.sourceEvent, () => {}, r) : Pe(t.sourceEvent, r);
				}
			});
		}
		bt.call(Lt({ isCollapsed: !1 })), Et.call(Lt({ isCollapsed: !0 })), bt.on("click", (e) => e.stopPropagation()), Et.on("click", (e) => e.stopPropagation());
		let Rt = lo().curve(So.alpha(.5)), zt = lo().curve(ho);
		function Bt(e, t) {
			let n = [], r = Math.max(8, t);
			for (let t = 0; t < e.length; t++) {
				let i = e[t], a = e[(t + 1) % e.length];
				n.push(i);
				let o = Math.hypot(a[0] - i[0], a[1] - i[1]), s = Math.floor(o / r);
				for (let e = 1; e < s; e++) n.push([i[0] + (a[0] - i[0]) * e / s, i[1] + (a[1] - i[1]) * e / s]);
			}
			return n;
		}
		let W = new Map(o.nodes.map((e) => [e.id, e])), Vt = new Map((o.containers || []).map((e) => [e.id, e])), Ht = (e) => {
			let t = 0, n = e.parent;
			for (; n && Vt.has(n) && t < 20;) t++, n = Vt.get(n).parent;
			return t;
		}, Ut = p.labelSize && p.labelSize.min || 32, Wt = p.labelSize && p.labelSize.max || 96, Gt = p.labelSize && p.labelSize.nestedScale || .75, qt = () => {
			let e = /* @__PURE__ */ new Map();
			for (let t of o.containers || []) e.set(t.id, Array.from(qe.get(t.id) || []).map((e) => W.get(e)).filter(Boolean).map((e) => ({
				id: e.id,
				w: e._size && e._size.width || (e.type === "article" ? S.width : e.size),
				h: e._size && e._size.height || (e.type === "article" ? S.height : e.size),
				order: Number.isFinite(e.series_part) ? e.series_part : null,
				date: e.date || ""
			})));
			return e;
		}, G = {
			roots: [],
			nodes: /* @__PURE__ */ new Map(),
			containers: /* @__PURE__ */ new Map()
		};
		function Jt() {
			if (!o.containers || o.containers.length === 0) return;
			let e = qt(), t = () => (0, Ts.containerLayout)({
				containers: o.containers,
				members: e,
				closed: it,
				labelSize: (e) => vt(e, e._fs || Ut, { family: St(e) }),
				macroSize: (e) => ({
					w: (e._macroHalfW || 130) * 2,
					h: (e._macroHalfH || 45) * 2
				}),
				options: {
					spacing: p.spiral?.spacing ?? 20,
					mode: L.current === "radial" ? "ring" : p.spiral?.mode || "path",
					startRadius: p.spiral?.startRadius,
					direction: p.spiral?.direction,
					gap: 28,
					padding: E,
					layoutOf: (e) => L.current === "force" ? (0, Ts.containerLayoutOf)(e, x) : null,
					hangOf: (e) => ({
						...x.hang || {},
						...e.hang || {}
					}),
					spiralOf: Yt
				}
			});
			for (let e of o.containers) e._fs = Ut;
			let n = t();
			for (let e of o.containers) {
				let t = n.containers.get(e.id), r = t ? t.box.x1 - t.box.x0 : 0, i = Wt * Gt ** +Ht(e);
				if (e._fs = Math.max(Ut, Math.min(Math.max(Ut, i), r / 8)), t && t.hang) {
					let n = S.width + t.hang.gap;
					for (let t = 0; t < 40 && e._fs > Ut && vt(e, e._fs, { family: St(e) }).w > n; t++) e._fs = Math.max(Ut, e._fs * .92);
				}
			}
			n = t(), G = n;
			for (let e of o.nodes) {
				let t = G.nodes.get(e.id);
				e._cardScale = t && t.scale > 0 ? t.scale : 1;
			}
		}
		function Yt(e) {
			let t = {
				...x.spiral || {},
				...e && e.spiral || {}
			};
			return {
				...t,
				keepBelowY: Xt(e, t)
			};
		}
		function Xt(e, t) {
			if (t.keepBelow !== "crown" || !e || !tn.has(e.id) || !(nn && nn.art && Number.isFinite(nn.crownY)) || L.current !== "force") return null;
			let n = (0, zs.homeView)(j), r = sn(), i = (0, zs.anchorWorld)(tn.get(e.id), nn.art, n, r);
			return (0, zs.anchorWorld)({
				x: .5,
				y: nn.crownY
			}, nn.art, n, r).y - i.y;
		}
		let Zt = () => [x.spiral, ...(o.containers || []).map((e) => e.spiral)].some((e) => e && e.keepBelow === "crown");
		function Qt(e) {
			if (me && rn()) {
				let t = 0, n = 0, r = 0;
				for (let i of tn.keys()) {
					let a = G.containers.get(i);
					if (!a || a.root !== e) continue;
					let o = $t(i);
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
		function $t(e) {
			let t = 0, n = 0, r = 0;
			for (let i of Ye(e)) {
				let e = G.nodes.get(i), a = W.get(i);
				!e || !a || !Number.isFinite(a.x) || !Number.isFinite(a.y) || (t += a.x - e.x, n += a.y - e.y, r++);
			}
			return r ? {
				x: t / r,
				y: n / r
			} : null;
		}
		let en = () => p.spiral?.enabled !== !1 && (L.current === "force" || L.current === "radial"), tn = new Map(Object.entries(Js(e)).filter(([e]) => Vt.has(e))), nn = typeof window < "u" && window.PostPipeCoverFrame || null, rn = () => tn.size > 0 && !!(nn && nn.art) && en() && L.current === "force" && G.containers.size > 0, an = /* @__PURE__ */ new Map();
		for (let e of [...tn.keys()].sort((e, t) => Ht(Vt.get(t)) - Ht(Vt.get(e)))) for (let t of Ye(e)) an.has(t) || an.set(t, e);
		me = !0;
		function on(e) {
			let t = G.containers.get(e), n = t && $t(e);
			return n ? {
				x: n.x + t.center.x,
				y: n.y + t.center.y
			} : null;
		}
		function sn() {
			if (!D.current) return {
				x: 0,
				y: 0
			};
			let e = D.current.getBoundingClientRect(), t = typeof window < "u" && window.PostPipeCover && window.PostPipeCover.shift || 0;
			return {
				x: e.left,
				y: e.top - t
			};
		}
		function cn() {
			let e = /* @__PURE__ */ new Map();
			if (!rn()) return e;
			let t = (0, zs.homeView)(j), n = sn();
			for (let [r, i] of tn) e.set(r, (0, zs.anchorWorld)(i, nn.art, t, n));
			return e;
		}
		let ln = /* @__PURE__ */ new Map(), un = /* @__PURE__ */ new Map();
		function dn() {
			return Ce && he > 0 && rn();
		}
		function fn() {
			let e = he > 0 ? he : j, t = we() || [r / 2, i / 2], n = (0, zs.homeView)(e);
			return {
				x: (t[0] - n.x) / e,
				y: (t[1] - n.y) / e
			};
		}
		function pn() {
			let e = fn(), t = Do(s.node());
			return [t.x + t.k * e.x, t.y + t.k * e.y];
		}
		let mn = (e) => ln.get(e) || on(e);
		function hn() {
			if (un = /* @__PURE__ */ new Map(), !dn()) return;
			let e = ge.k / he;
			if (Math.abs(e - 1) < 1e-9) return;
			let t = fn();
			for (let n of tn.keys()) {
				let r = mn(n);
				r && un.set(n, (0, Ms.growShift)(r, t, e));
			}
		}
		let gn = {
			x: 0,
			y: 0
		}, _n = (e) => un.size && e && un.get(an.get(e.id)) || gn;
		function vn(e) {
			if (!un.size || !e) return gn;
			let t = e;
			for (let e = 0; t && e < 20; e++) {
				let e = un.get(t.id);
				if (e) return e;
				t = t.parent ? Vt.get(t.parent) : null;
			}
			return gn;
		}
		let yn = (e) => {
			let t = _n(e);
			return t === gn ? e : {
				x: e.x + t.x,
				y: e.y + t.y
			};
		};
		function bn(e) {
			if (!dn() || !(0, Ms.growCapOn)(x)) return Infinity;
			let t = [];
			for (let n of tn.keys()) {
				let r = G.containers.get(n), i = Vt.get(n);
				if (!r || !i || Zn(i)) continue;
				let a = e && e.get(n) || mn(n);
				if (!a) continue;
				let o = a.x - r.center.x, s = a.y - r.center.y, c = it.has(n) ? 0 : .75 * jn;
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
			return he * (0, Ms.growCap)(t, {
				gap: 16,
				homeK: he
			});
		}
		function xn(e) {
			if (!dn()) return;
			let t = bn(e);
			ge.k > t + 1e-9 && Mi(t / ge.k);
		}
		let Sn = /* @__PURE__ */ new Set(), Cn = !1, wn = (e) => oe(L.current) + e, Tn = /* @__PURE__ */ new Set();
		function En(e) {
			let t = P.current;
			if (!t) return Tn.has(e);
			let n = t.nodeState(wn(e));
			return !!(n && !n.auto && Number.isFinite(n.x));
		}
		function Dn(e) {
			let t = on(e), n = P.current;
			n && t ? n.setNodePosition(wn(e), t.x, t.y, { transient: !0 }) : Tn.add(e);
		}
		let On = /* @__PURE__ */ new Map();
		for (let e of tn.keys()) {
			let t = P.current;
			if (t && En(e)) {
				let n = t.nodeState(wn(e));
				for (let t of Ye(e)) {
					if (an.get(t) !== e) continue;
					let n = W.get(t);
					n && Number.isFinite(n.x) && Number.isFinite(n.y) && (n.fx = n.x, n.fy = n.y);
				}
				On.set(e, {
					x: n.x,
					y: n.y
				});
			} else Sn.add(e);
		}
		function kn(e) {
			for (let [t, n] of e) {
				let e = on(t);
				if (!n || !e) continue;
				tn.has(t) && ln.set(t, {
					x: n.x,
					y: n.y
				});
				let r = n.x - e.x, i = n.y - e.y;
				for (let e of Ye(t)) {
					let t = W.get(e);
					!t || !Number.isFinite(t.x) || !Number.isFinite(t.y) || (t.x += r, t.y += i, t.fx = t.x, t.fy = t.y, t.vx = 0, t.vy = 0);
				}
			}
		}
		function An(e) {
			let t = $t(e);
			if (t) for (let n of Ye(e)) {
				if (an.get(n) !== e) continue;
				let r = G.nodes.get(n), i = W.get(n);
				!r || !i || !Number.isFinite(i.x) || !Number.isFinite(i.y) || (i.x = t.x + r.x, i.y = t.y + r.y, i.vx = 0, i.vy = 0);
			}
		}
		let jn = Number.isFinite(Number(x.hull && x.hull.padding)) ? Number(x.hull.padding) : 24;
		function Mn(e) {
			if (!rn()) return e;
			let t = [];
			for (let n of tn.keys()) {
				let r = G.containers.get(n), i = e.get(n) || on(n);
				if (!r || !i) continue;
				let a = i.x - r.center.x, o = i.y - r.center.y, s = it.has(n) ? 0 : .75 * jn;
				t.push({
					id: n,
					box: {
						x0: r.box.x0 + a - s,
						y0: r.box.y0 + o - s,
						x1: r.box.x1 + a + s,
						y1: r.box.y1 + o + s
					},
					open: !it.has(n),
					fixed: En(n),
					towards: Yt(Vt.get(n)).openTowards
				});
			}
			let n = (0, Os.actsApart)(t, { gap: 16 / j });
			if (!n.size) return e;
			let r = new Map(e);
			for (let [e, t] of n) {
				let n = r.get(e) || on(e);
				n && r.set(e, {
					x: n.x + t.dx,
					y: n.y + t.dy
				});
			}
			return r;
		}
		function Nn(e = [...tn.keys()]) {
			if (!rn()) return !1;
			let t = Mn(cn());
			kn(e.map((e) => [e, t.get(e)]));
			for (let t of e) Sn.delete(t);
			return e.length, tn.size, !0;
		}
		function Pn() {
			return On.size ? (kn([...On]), On.clear(), !0) : !1;
		}
		let Fn = () => tn.size ? [...tn.keys()] : (o.containers || []).filter((e) => e.parent && !Vt.get(e.parent)?.parent).map((e) => e.id), In = /* @__PURE__ */ new WeakMap();
		function Ln(e) {
			let t = e.getAttribute("d") || "", n = In.get(e);
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
			return In.set(e, {
				d: t,
				pts: r
			}), r;
		}
		function Rn(e, t, n) {
			if (!t) return on(e);
			let r = n.select(".container-macro-node").node(), i = n.node(), a = r && r.getScreenCTM ? r.getScreenCTM() : null, o = i && i.getScreenCTM ? i.getScreenCTM() : null;
			if (!a || !o) return on(e);
			let s = o.inverse();
			return {
				x: s.a * a.e + s.c * a.f + s.e,
				y: s.b * a.e + s.d * a.f + s.f
			};
		}
		function zn() {
			let e = [];
			if (!pe) return {
				containers: e,
				k: le.current,
				homeK: he,
				moving: !1
			};
			let t = rn() ? cn() : null, n = !1;
			for (let r of Fn()) {
				let i = Ze.filter((e) => e.id === r), a = i.node();
				if (!a || a.style.display === "none") continue;
				let o = it.has(r), s = i.select(o ? ".container-macro-bg" : ".container-hull").node();
				if (!s || !o && s.style.display === "none") continue;
				let c = Ln(s), l = s.getScreenCTM();
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
					let e = t.get(r), a = Rn(r, o, i);
					a && e && (p.drift = {
						x: a.x - e.x,
						y: a.y - e.y
					});
					let s = on(r);
					a && s && Math.hypot(a.x - s.x, a.y - s.y) > .25 && (n = !0);
				}
				e.push(p);
			}
			return {
				containers: e,
				k: le.current,
				homeK: he,
				moving: n
			};
		}
		function Bn() {
			typeof window > "u" || window.dispatchEvent(new CustomEvent("graph:world"));
		}
		typeof window < "u" && (window.PostPipeGraphWorld = { snapshot: zn });
		function Vn() {
			function e(e) {
				if (!en() || L.current !== "force") return;
				let t = p.spiral?.strength ?? .35, n = /* @__PURE__ */ new Map();
				if (rn()) for (let e of tn.keys()) n.set(e, $t(e));
				for (let r of G.roots) {
					let i = Qt(r);
					for (let [a, o] of G.nodes) {
						if (o.root !== r) continue;
						let s = W.get(a);
						if (!s || !Number.isFinite(s.x)) continue;
						let c = an.get(a), l = c && n.get(c) || i;
						l && (s.vx += (l.x + o.x - s.x) * t * e, s.vy += (l.y + o.y - s.y) * t * e);
					}
				}
			}
			return e.initialize = function() {}, e;
		}
		function Hn() {
			let e = [], t = (e) => e.type === "article" ? Math.hypot(e._size?.width || S.width, e._size?.height || S.height) / 2 * (e._cardScale || 1) : e._r || (e.size || 60) / 2;
			function n(n) {
				if (!o.containers || o.containers.length === 0) return;
				let r = [];
				for (let e of G.roots) {
					let t = G.containers.get(e), n = Qt(e);
					if (!t || !n) continue;
					let i = Ye(e).map((e) => W.get(e)).filter((e) => e && Number.isFinite(e.x));
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
				}, a = p.containerSpacing === void 0 ? -20 : p.containerSpacing;
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
		o.containers && o.containers.length > 0 && (Jt(), Ve.force("containerSeparation", Hn()), Ve.force("containerLayout", Vn()));
		let Un = /* @__PURE__ */ new Set(), Wn = (e) => (G.nodes.get(e) || {}).root || null, Gn = (e) => typeof e == "object" ? e.id : e;
		function Kn() {
			Un = /* @__PURE__ */ new Set();
			for (let e of it) for (let t of Ye(e)) Un.add(t);
			Ve.force("collide").radius((e) => Un.has(e.id) ? 0 : G.nodes.has(e.id) && e.type === "article" ? Math.min(e._size?.width || S.width, e._size?.height || S.height) / 2 * (e._cardScale || 1) : (e._r || (e.type === "article" ? Math.hypot(S.width, S.height) / 2 : e.size / 2)) + T.collidePadding), Ve.force("charge").strength((e) => Un.has(e.id) ? 0 : G.nodes.has(e.id) ? T.chargeStrength * .05 : T.chargeStrength);
		}
		if (G.nodes.size > 0) {
			Kn();
			let e = Ve.force("link"), t = e.strength();
			e.strength((e) => {
				let n = Wn(Gn(e.source));
				return n && n === Wn(Gn(e.target)) ? 0 : t(e);
			});
		}
		function qn(e) {
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
		G.nodes.size > 0 && qn(Be);
		function Jn() {
			if (!o.containers || o.containers.length === 0 || (Jt(), Kn(), G.nodes.size === 0)) return null;
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
			let n = o.nodes.filter((e) => !G.nodes.has(e.id));
			if (n.length) {
				let r = (0, ws.radialLayout)(n, {
					cardW: S.width,
					cardH: S.height
				}), i = Object.values(r).map((e) => e.x), a = i.length ? t + S.width - Math.min(...i) : t;
				for (let [t, n] of Object.entries(r)) e[t] = {
					x: n.x + a,
					y: n.y
				};
			}
			return e;
		}
		function Xn() {
			!o.containers || o.containers.length === 0 || (Jt(), Kn());
		}
		function Zn(e) {
			let t = e.parent, n = 0;
			for (; t && n++ < 20;) {
				if (it.has(t)) return !0;
				t = Vt.get(t)?.parent;
			}
			return !1;
		}
		function Qn() {
			if (Xe.length === 0) return;
			hn(), Bn();
			let e = en() && G.containers.size > 0, t = (t) => {
				let n = e ? G.containers.get(t.id) : null, r = n ? $t(t.id) : null;
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
				let r = Ye(e.id).map((e) => W.get(e)).filter((e) => e && Number.isFinite(e.x));
				return r.length ? {
					x: _(r, (e) => e.x),
					y: _(r, (e) => e.y)
				} : null;
			};
			Ze.each(function(e) {
				let r = U(this), i = Ye(e.id).map((e) => W.get(e)).filter((e) => e && Number.isFinite(e.x) && Number.isFinite(e.y));
				if (i.length === 0 || Zn(e)) {
					r.style("display", "none"), ot.delete(e.id);
					return;
				}
				let a = it.has(e.id), o = e._fs || 52, s = t(e), c = vn(e);
				r.attr("transform", c.x || c.y ? `translate(${c.x}, ${c.y})` : null);
				let l = (e) => e && (c.x || c.y) ? {
					x: e.x + c.x,
					y: e.y + c.y
				} : e, u = (e) => {
					let t = yn(e);
					return {
						x: t.x - c.x,
						y: t.y - c.y
					};
				};
				if (a) {
					let t = n(e);
					at.set(e.id, l(t)), ot.set(e.id, l(t)), r.style("display", null), r.select(".container-hull").style("display", "none"), r.select(".container-hull-ghost").attr("d", ""), r.select(".container-badge").style("display", "none"), r.select(".container-macro-node").style("display", null).attr("transform", `translate(${t.x}, ${t.y})${_e()}${Ot === 1 ? "" : ` scale(${Ot})`}`).select(".label-count").text((0, ks.containerCountText)(x, i.length));
					return;
				}
				let d = _(i, (e) => yn(e).x), f = _(i, (e) => yn(e).y);
				at.set(e.id, {
					x: d,
					y: f
				}), r.style("display", null), r.select(".container-macro-node").style("display", "none"), r.select(".container-hull").style("display", null), r.select(".container-badge").style("display", null);
				let p = [], m = E(e);
				for (let t of Ke.get(e.id) || []) {
					if (!it.has(t)) continue;
					let e = Vt.get(t), r = e && n(e);
					if (!r) continue;
					let i = vn(e), a = {
						x: r.x + i.x - c.x,
						y: r.y + i.y - c.y
					}, o = (e._macroHalfW || 130) + m / 2, s = (e._macroHalfH || 45) + m / 2;
					p.push([a.x - o, a.y - s], [a.x + o, a.y - s], [a.x + o, a.y + s], [a.x - o, a.y + s]);
				}
				let v = i.filter((e) => {
					for (let t of it) if (Ye(t).includes(e.id)) return !1;
					return !0;
				});
				for (let e of v) {
					let t = e._cardScale || 1, n = (e._size?.width || (e.type === "article" ? S.width : e.size)) * t, r = (e._size?.height || (e.type === "article" ? S.height : e.size)) * t, i = n / 2 + m, a = r / 2 + m, o = u(e);
					p.push([o.x - i, o.y - a], [o.x + i, o.y - a], [o.x + i, o.y + a], [o.x - i, o.y + a]);
				}
				let y = Xs(e), b = null;
				if (s) {
					let n = m / 2, r = [], i = (e) => {
						for (let n of Ke.get(e) || []) {
							if (it.has(n)) continue;
							let e = Vt.get(n), a = e && t(e), o = e ? vn(e) : gn;
							a && Xs(e) !== "hidden" && r.push({
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
				let C = eo(p);
				if (!C || C.length < 3) return;
				let w = !!(s && s.info.hang);
				w && (C = Bt(C, m / 2));
				let T = w ? zt : Rt;
				(0, Ts.hullDrawn)(e) ? (r.select(".container-hull").style("display", null).attr("d", T(C)), r.select(".container-hull-ghost").attr("d", nt ? T((0, zo.jitterPoints)(C, e.id, 3.5)) : "")) : (r.select(".container-hull").style("display", "none").attr("d", ""), r.select(".container-hull-ghost").attr("d", ""));
				let D = r.select(".container-badge");
				D.attr("data-label-position", y), D.select(".label-count").text((0, ks.containerCountText)(x, i.length));
				let O = (t) => {
					let n = vt(e, t, { family: St(e) });
					D.select(".container-badge-hit").attr("x", -n.w / 2).attr("y", -n.h / 2).attr("width", n.w).attr("height", n.h);
				};
				if (y === "hidden") {
					D.style("display", "none"), ot.set(e.id, l(b || {
						x: _(C, (e) => e[0]),
						y: _(C, (e) => e[1])
					}));
					return;
				}
				if (y === "top") {
					let t = b ? o : Math.max(Ut, Math.min(Wt, (h(C, (e) => e[0]) - g(C, (e) => e[0])) / 8)), n = vt(e, t, { family: St(e) }), r = g(C, (e) => e[1]), i = {
						x: (g(C, (e) => e[0]) + h(C, (e) => e[0])) / 2,
						y: r + m * .5 + n.h / 2
					};
					D.select(".container-badge-text").attr("font-size", `${t}px`), O(t), D.attr("transform", `translate(${i.x}, ${i.y})${_e()}`), ot.set(e.id, l(i));
					return;
				}
				if (b) {
					D.select(".container-badge-text").attr("font-size", `${o}px`), O(o), D.attr("transform", `translate(${b.x}, ${b.y})${_e()}`), ot.set(e.id, l(b));
					return;
				}
				let k = Math.min(...C.map((e) => e[1])), A = Math.max(...C.map((e) => e[1])), j = Math.min(...C.map((e) => e[0])), M = Math.max(...C.map((e) => e[0])), N = Math.max(Ut, Math.min(Wt, (M - j) / 8));
				D.select(".container-badge-text").attr("font-size", `${N}px`), O(N);
				let P = Xa(C), F = Number.isFinite(P[0]) ? P[0] : _(C, (e) => e[0]);
				D.attr("transform", `translate(${F}, ${k + (A - k) / 3})${_e()}`), ot.set(e.id, l({
					x: F,
					y: k + (A - k) / 3
				}));
			});
		}
		let $n = /* @__PURE__ */ new Set();
		function er() {
			$n = (0, Ps.closedMemberSet)(it, Ye);
			for (let e of o.nodes) e._closedHidden = $n.has(e.id);
			zr && zr.style("display", (e) => $n.has(e.id) ? "none" : null), jr.style("display", (e) => $n.has(e.id) ? "none" : null);
			let e = (e) => (0, Ps.edgeHidden)(e, $n) ? "none" : null;
			gr.style("display", e), vr.style("display", e), hr.style("display", e), xr.style("display", e), Tr && (0, Ps.edgeHidden)(Tr, $n) && Ar();
		}
		function tr() {
			er(), cr(), Qn(), ei();
		}
		function nr() {
			return Object.fromEntries((o.containers || []).map((e) => [e.id, it.has(e.id) ? "closed" : "open"]));
		}
		function rr(e, t) {
			return ir(t ? { open: e } : { close: e });
		}
		function ir({ open: e = [], close: t = [] }) {
			let n = !1;
			for (let t of e) Vt.has(t) && it.has(t) && (it.delete(t), n = !0);
			for (let e of t) Vt.has(e) && !it.has(e) && (it.add(e), n = !0);
			return n ? (tr(), xn(sr), typeof window < "u" && window.dispatchEvent(new CustomEvent("graph:containers-changed", { detail: nr() })), !0) : !1;
		}
		let ar = () => (o.containers || []).map((e) => e.id), or = {
			openContainer: (e) => rr([e], !0),
			closeContainer: (e) => rr([e], !1),
			toggleContainer: (e) => rr([e], it.has(e)),
			openAllContainers: () => rr(ar(), !0),
			closeAllContainers: () => ir((0, Ps.closeAllPlan)(o.containers)),
			getContainerState: nr
		};
		v && (v.current = or);
		let sr = null;
		function cr() {
			if (!o.containers || o.containers.length === 0) return;
			let e = new Map(G.roots.map((e) => [e, Qt(e)])), t = /* @__PURE__ */ new Map();
			if (rn()) {
				let e = cn();
				for (let n of tn.keys()) {
					let r = En(n) ? on(n) : e.get(n) || on(n);
					r && t.set(n, r);
				}
			}
			if (It(), Jt(), Kn(), rn() && (t = Mn(t)), !en()) return;
			let n = [];
			for (let [e, r] of t) {
				let t = mn(e);
				n.push({
					cId: e,
					x0: t ? t.x : r.x,
					y0: t ? t.y : r.y,
					x1: r.x,
					y1: r.y
				});
			}
			let r = (e) => {
				for (let t of n) ln.set(t.cId, {
					x: t.x0 + (t.x1 - t.x0) * e,
					y: t.y0 + (t.y1 - t.y0) * e
				});
			};
			sr = t;
			let i = [];
			for (let [e, n] of G.nodes) {
				let r = W.get(e), a = an.get(e);
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
			if (!ki && !i.length) {
				r(1), Ve.alpha(Math.max(Ve.alpha(), .3)).restart();
				return;
			}
			for (let [n, r] of G.nodes) {
				let a = W.get(n), o = e.get(r.root), s = an.get(n);
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
				r(e), ei(), B.current && B.current();
			}).on("end", () => {
				m || Di({ animate: !0 });
			});
		}
		function lr(e) {
			let t = ce.current === e.id, n = H.current.has(e.id), r = $s(le.current);
			if (r === "marker" && !t && !n) return {
				w: 8,
				h: 8
			};
			let i = e._size || F({
				hovered: t,
				pinned: n,
				lod: r
			}), a = e._cardScale || 1;
			return {
				w: i.width / 2 * a,
				h: i.height / 2 * a
			};
		}
		function ur(e) {
			let t = typeof e.source == "object" ? yn(e.source) : null, n = typeof e.target == "object" ? yn(e.target) : null, r = t ? t.x : 0, i = t ? t.y : 0, a = n ? n.x : 0, o = n ? n.y : 0, s = typeof e.source == "object" ? e.source.id : e.source, c = typeof e.target == "object" ? e.target.id : e.target;
			if ((0, Ps.edgeHidden)(e, $n)) return {
				x1: 0,
				y1: 0,
				x2: 0,
				y2: 0,
				hidden: !0
			};
			let l = null, u = null;
			for (let e of it) {
				let t = Ye(e);
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
				let e = at.get(l);
				e && (r = e.x, i = e.y);
			}
			if (u) {
				let e = at.get(u);
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
			let m = d / p, h = f / p, g = lr(e.source), _ = l ? 90 : g.w + 4, v = l ? 45 : g.h + 4, y = Math.min(Math.abs(m) > 1e-4 ? _ / Math.abs(m) : Infinity, Math.abs(h) > 1e-4 ? v / Math.abs(h) : Infinity), b = lr(e.target), x = u ? 90 : b.w + 4, S = u ? 45 : b.h + 4, C = Math.min(Math.abs(m) > 1e-4 ? x / Math.abs(m) : Infinity, Math.abs(h) > 1e-4 ? S / Math.abs(h) : Infinity);
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
		function dr(e, t) {
			if (t.hidden) return "";
			if (e.layer !== "sequence") return `M ${t.x1} ${t.y1} L ${t.x2} ${t.y2}`;
			let n = t.x2 - t.x1, r = t.y2 - t.y1, i = Math.hypot(n, r);
			if (i < 2) return `M ${t.x1} ${t.y1} L ${t.x2} ${t.y2}`;
			let a = (t.x1 + t.x2) / 2, o = (t.y1 + t.y2) / 2, s = -r / i, c = n / i, l = Math.min(48, i * .12), u = a + s * l, d = o + c * l;
			return `M ${t.x1} ${t.y1} Q ${u} ${d} ${t.x2} ${t.y2}`;
		}
		let fr = /* @__PURE__ */ new Map();
		function pr(e) {
			if (!fr.has(e)) {
				let t = "edge-arrow-" + fr.size;
				c.append("marker").attr("id", t).attr("viewBox", "0 0 10 10").attr("refX", 9).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 13).attr("markerHeight", 13).attr("orient", "auto").append("path").attr("d", "M 0 1 L 10 5 L 0 9 z").style("fill", e).style("fill-opacity", .75), fr.set(e, t);
			}
			return fr.get(e);
		}
		let mr = (e) => {
			if (e.layer !== "sequence") return "#8a8f9c";
			let t = typeof e.source == "object" ? e.source.id : e.source;
			return W.get(t)?.containerColor || "var(--gv-accent, #d4af37)";
		}, hr = f.insert("g", ".containers-layer").attr("class", "link-hits").selectAll(".link-hit").data(o.links).enter().append("path").attr("class", "link-hit").attr("fill", "none").style("stroke", "transparent").style("stroke-width", "16px").style("pointer-events", "stroke").style("cursor", "default"), gr = f.selectAll(".link").data(o.links).enter().append("path").attr("class", (e) => [
			"link",
			e.layer ? `link-${e.layer}` : "",
			e.role ? `link-role-${e.role}` : ""
		].filter(Boolean).join(" ")).attr("fill", "none").attr("data-label", (e) => e.label).attr("marker-end", (e) => e.directed ? `url(#${pr(mr(e))})` : null).style("stroke", (e) => e.layer === "sequence" ? mr(e) : null).style("stroke-opacity", (e) => e.layer === "sequence" ? .45 : null), _r = f.append("g").attr("class", "readers-layer").style("display", "none"), vr = f.selectAll(".link-ghost").data(o.links).enter().insert("path", ".link-sequence-pulse").attr("class", "link-ghost").style("stroke", (e) => mr(e)), yr = (e) => `${Gn(e.source)}>${Gn(e.target)}`;
		function br() {
			vr.attr("d", (e) => nt && e._path ? (0, zo.ghostOf)(e._path, yr(e)) : "");
		}
		let xr = f.selectAll(".link-sequence-pulse").data(o.links.filter((e) => e.layer === "sequence")).enter().append("path").attr("class", "link-sequence-pulse").attr("fill", "none").attr("pathLength", 100).style("stroke", (e) => {
			let t = typeof e.source == "object" ? e.source.id : e.source;
			return W.get(t)?.containerColor || "#ffe066";
		}).style("filter", (e) => {
			let t = typeof e.source == "object" ? e.source.id : e.source;
			return `drop-shadow(0 0 4px ${W.get(t)?.containerColor || "#ffd700"})`;
		}), Sr = f.append("g").attr("class", "edge-label").style("pointer-events", "none").style("display", "none"), Cr = Sr.append("rect").attr("fill", "rgba(15, 17, 26, 0.88)").attr("stroke-opacity", .6), wr = Sr.append("text").attr("text-anchor", "middle").attr("dominant-baseline", "central").attr("font-family", "'Atkinson', sans-serif").attr("font-weight", 600).attr("letter-spacing", "0.04em"), Tr = null, Er = null, Dr = null;
		function Or() {
			if (!Tr || !Er) return;
			let e = Er.getTotalLength ? Er.getTotalLength() : 0;
			if (!e) {
				Sr.style("display", "none");
				return;
			}
			let t = Er.getPointAtLength(e / 2), n = le.current || 1, r = 13 / n, i = mr(Tr);
			wr.attr("font-size", r).style("fill", i).text(Tr.label);
			let a = (Tr.label.length * .62 + 1.4) * r, o = r * 1.7;
			Cr.attr("x", -a / 2).attr("y", -o / 2).attr("width", a).attr("height", o).attr("rx", o / 2).style("stroke", i).attr("stroke-width", 1 / n), Sr.attr("transform", `translate(${t.x}, ${t.y})${_e()}`).style("display", null);
		}
		function kr(e, t) {
			clearTimeout(Dr), Dr = null, Tr = e, Er = t, Or();
		}
		function Ar() {
			clearTimeout(Dr), Dr = null, Tr = null, Er = null, Sr.style("display", "none");
		}
		hr.on("mouseenter", function(e, t) {
			kr(t, this);
		}).on("mouseleave", () => {
			Dr || Ar();
		}).on("click", function(e, t) {
			e.stopPropagation();
			let n = this;
			Pe(e, () => {
				kr(t, n), Dr = setTimeout(() => {
					Dr = null, Ar();
				}, 2500);
			});
		});
		let jr = f.selectAll(".node").data(o.nodes).enter().append("g").attr("class", "node"), Mr = Kt().clickDistance(5).container(() => f.node()).filter((e) => {
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
			let n = e.sourceEvent && e.sourceEvent.target;
			if (t._resizing = !!(n && n.closest && n.closest("[data-resize=\"1\"]")), t._resizing) {
				let n = t._size || F({
					hovered: ce.current === t.id,
					pinned: H.current.has(t.id)
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
					width: r(n.w + (e.x - n.x) * 2, S.minWidth, S.maxWidth),
					height: r(n.h + (e.y - n.y) * 2, S.minHeight, S.maxHeight)
				}, Wr(t), P.current && P.current.setNodeSize(V(t), t._size.width, t._size.height, { transient: !0 }), Qn();
				return;
			}
			if (!t._dragMoved) {
				let n = t._dragFrom || {
					x: e.x,
					y: e.y
				};
				if (Math.hypot(e.x - n.x, e.y - n.y) < 5) return;
				t._dragMoved = !0;
			}
			t.x = e.x, t.y = e.y, t.fx = e.x, t.fy = e.y, P.current && P.current.setNodePosition(V(t), e.x, e.y, { transient: !0 });
			let n = yn(t);
			jr.filter((e) => e.id === t.id).attr("transform", "translate(" + n.x + "," + n.y + ")" + _e()), zr && zr.filter((e) => e.id === t.id).style("transform", `translate3d(${n.x}px, ${n.y}px, 0px) rotate(var(--gv-unrot, 0deg))${t._cardScale && t._cardScale !== 1 ? ` scale(${t._cardScale})` : ""}`), B.current && B.current(), gr.each(function(e) {
				let n = typeof e.source == "object" ? e.source.id : e.source, r = typeof e.target == "object" ? e.target.id : e.target;
				(n === t.id || r === t.id) && (e._path = dr(e, ur(e)), U(this).attr("d", e._path));
			}), hr.attr("d", (e) => e._path || ""), br(), Ar(), xr.each(function(e) {
				let n = typeof e.source == "object" ? e.source.id : e.source, r = typeof e.target == "object" ? e.target.id : e.target;
				if (n === t.id || r === t.id) {
					let t = ur(e);
					U(this).attr("d", dr(e, t));
				}
			}), Qn();
		}).on("end", (e, t) => {
			let n = P.current;
			if (t._resizing) {
				t._resizing = !1, n && n.commit(), Qn();
				return;
			}
			t.fx = t.x, t.fy = t.y, t._dragMoved && (n && (n.setNodePosition(se(t), t.x, t.y, { transient: !0 }), n.commit()), Qn());
		});
		jr.call(Mr);
		let Nr = s.append("text").style("font-family", "'Atkinson', sans-serif").style("visibility", "hidden"), Pr = typeof document < "u" ? document.createElement("canvas").getContext("2d") : null;
		function Fr(e, t) {
			if (!Pr) return {
				width: e.length * t * .5,
				ascent: t * .7,
				descent: t * .2
			};
			Pr.font = "500 " + t + "px 'Atkinson', sans-serif";
			let n = Pr.measureText(e);
			return {
				width: n.actualBoundingBoxLeft + n.actualBoundingBoxRight,
				ascent: n.actualBoundingBoxAscent,
				descent: n.actualBoundingBoxDescent
			};
		}
		let Ir = [];
		function Lr(e) {
			let { d: t, textEl: n, rectEl: r, lines: i, fontSize: a, lineH: o } = e, s = i.map((e) => Fr(e, a)), c = i.map((e, t) => t * o), l = Math.min(...c.map((e, t) => e - s[t].ascent)), u = Math.max(...c.map((e, t) => e + s[t].descent)), d = -(l + u) / 2, f = l + d, p = u + d, m = Math.max(...s.map((e) => e.width));
			n.selectAll("tspan").each(function(e, t) {
				U(this).attr("y", c[t] + d);
			}), r.attr("x", -m / 2 - C.padding).attr("y", f - C.padding).attr("width", m + C.padding * 2).attr("height", p - f + C.padding * 2), t._r = Math.hypot(m + C.padding * 2, p - f + C.padding * 2) / 2;
		}
		jr.each(function(e) {
			let t = U(this);
			if (e.type !== "article") {
				let n = C.fontSize, r = C.padding, i = C.maxWidth, a = C.maxLines;
				Nr.style("font-size", n + "px").style("font-weight", "500");
				let o = (e) => (Nr.text(e), Nr.node().getComputedTextLength()), s = e.label.split(/(?<=-)|\s+/).filter(Boolean), c = (e) => e.join("").replace(/\s+$/, "").trim(), l = [e.label];
				if (o(e.label) + r * 2 > i && s.length > 1) {
					l = [];
					let e = [];
					for (let t of s) {
						let n = [...e, t];
						e.length && o(c(n)) + r * 2 > i ? (l.push(c(e)), e = [t]) : e = n;
					}
					if (e.length && l.push(c(e)), l.length === 2) {
						let e = 1, t = Infinity;
						for (let n = 1; n < s.length; n++) {
							let r = Math.max(o(c(s.slice(0, n))), o(c(s.slice(n))));
							r < t && (t = r, e = n);
						}
						l = [c(s.slice(0, e)), c(s.slice(e))];
					}
					l.length > a && (l = l.slice(0, a - 1).concat([l.slice(a - 1).join(" ")]));
				}
				let u = l.length > 1 ? n * 1 : n * 1.1, d = t.append("text").attr("text-anchor", "middle").attr("fill", "#1a1a2e").style("font-family", "'Atkinson', sans-serif").style("font-size", n + "px").style("font-weight", "500").style("pointer-events", "none");
				l.forEach((e) => {
					d.append("tspan").attr("x", 0).text(e);
				});
				let f = {
					d: e,
					textEl: d,
					rectEl: t.insert("rect", "text").attr("rx", C.cornerRadius).attr("ry", C.cornerRadius).attr("fill", "var(--gv-" + (e.type === "tag" ? "tag-color" : e.type === "topology" ? "topology-color" : "placeholder-color") + ")").attr("opacity", C.opacity),
					lines: l,
					fontSize: n,
					lineH: u
				};
				Ir.push(f), Lr(f);
			} else {
				let t = F({
					hovered: !1,
					pinned: !1
				});
				e._r = Math.hypot(t.width, t.height) / 2;
			}
		}), Nr.remove(), typeof document < "u" && document.fonts && document.fonts.ready && document.fonts.ready.then(() => {
			Ir.forEach(Lr);
		}).catch(() => {});
		let Rr = /* @__PURE__ */ new Map(), zr = d.selectAll(".node-card").data(o.nodes.filter((e) => e.type === "article")), Br = zr.enter().append("div").attr("class", "node-card").style("position", "absolute").style("left", "0").style("top", "0").style("will-change", "transform").style("pointer-events", "auto").style("touch-action", "manipulation").call(Mr);
		zr = zr.merge(Br), Br.filter((e) => !!e.link).attr("tabindex", 0).attr("role", "link").attr("data-link-node", "").attr("aria-label", (e) => [
			e.title,
			e.subtitle,
			e.description
		].filter(Boolean).join(". ")).on("keydown", (e, t) => {
			e.key === "Enter" && (e.preventDefault(), e.stopPropagation(), (0, Hs.followLink)(t.originalItem || t, { settings: Ws() }));
		}), Br.each(function(e) {
			let t = u(this);
			Rr.set(e.id, {
				root: t,
				wrapper: this,
				cardSelection: U(this)
			});
		});
		let Vr = null, Hr = /* @__PURE__ */ new Map();
		function Ur() {
			return Vr !== re.current && (Vr = re.current, Hr = (0, Vs.countsByChapter)(Vr)), Hr;
		}
		function Wr(e) {
			if (e.type !== "article") return;
			let n = Rr.get(e.id);
			if (!n) return;
			let r = ce.current === e.id, i = H.current.has(e.id), a = $s(le.current), o = F({
				hovered: r,
				pinned: i,
				lod: a
			}), s, c;
			if (a === "marker" && !r && !i) s = o.width, c = o.height;
			else {
				let t = e._size || (e._customWidth && e._customHeight ? {
					width: e._customWidth,
					height: e._customHeight
				} : null);
				s = t ? t.width : o.width, c = t ? t.height : o.height;
			}
			n.wrapper.style.width = s + "px", n.wrapper.style.height = c + "px", n.wrapper.style.marginLeft = -s / 2 + "px", n.wrapper.style.marginTop = -c / 2 + "px";
			let l = rs(e.kind), u = P.current, d = u ? u.bookmarks(V(e)) : [], f = x.readingProgress !== !1 && u && u.readingProgress ? u.readingProgress(V(e)) : null, p = Ur().get(e.id) || 0;
			n.root.render(t.createElement(l, {
				article: e,
				width: s,
				height: c,
				viewState: {
					hovered: r,
					pinned: i,
					lod: a,
					zoomScale: le.current,
					bookmarks: d,
					bookmarkCount: d.length,
					progress: f,
					contributionCount: p
				},
				fullContent: e._fullContent || null,
				cardSettings: S,
				onResize: ({ width: t, height: r }) => {
					e._customWidth = t, e._customHeight = r, e._size = {
						width: t,
						height: r
					}, n.wrapper.style.width = t + "px", n.wrapper.style.height = r + "px", n.wrapper.style.marginLeft = -t / 2 + "px", n.wrapper.style.marginTop = -r / 2 + "px", e._r = Math.max(t, r) / 2, Wr(e);
				}
			}));
		}
		zr.on("wheel", (e) => e.stopPropagation());
		function Gr() {
			o.nodes.forEach((e) => {
				e.type === "article" && Wr(e);
			});
		}
		ee.current = Gr;
		let Kr = /* @__PURE__ */ new Map();
		function qr(e) {
			if ((e.originalItem && e.originalItem._posted) === "title") return e._fullContent = null, Promise.resolve();
			if (Kr.has(e.id)) return e._fullContent = Kr.get(e.id), Promise.resolve();
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
				Kr.set(e.id, i), e._fullContent = i;
			}).catch(() => {
				Kr.set(e.id, null), e._fullContent = null;
			});
		}
		Gr(), H.current.forEach((e) => {
			let t = o.nodes.find((t) => t.id === e);
			t && (zr.filter((t) => t.id === e).raise().style("z-index", 10), qr(t).then(() => {
				H.current.has(e) && Wr(t);
			}));
		}), Ks(s, l, de.current), zr.on("mouseover", (e, t) => {
			ce.current !== t.id && (ce.current = t.id, Wr(t), e.currentTarget.style.zIndex = 10);
		}).on("mouseout", (e, t) => {
			let n = e.relatedTarget;
			n && e.currentTarget.contains(n) || ce.current === t.id && (ce.current = null, Wr(t), e.currentTarget.style.zIndex = "");
		}).on("dblclick", (e, t) => {
			if (e.stopPropagation(), e.preventDefault(), t.link || Date.now() - Jr < 300) return;
			let n = e.target;
			n && (n.dataset?.popout === "1" || n.closest?.("[data-popout=\"1\"]")) || (je.cancel(), Yr(t));
		}).on("click", (e, t) => {
			if (t.link) {
				e.stopPropagation(), je.cancel(), (0, Hs.followLink)(t.originalItem || t, { settings: Ws() });
				return;
			}
			let n = e.target;
			if (n && (n.dataset?.popout === "1" || n.closest?.("[data-popout=\"1\"]"))) {
				e.stopPropagation(), A.current && A.current(t.originalItem || t), H.current.has(t.id) && (H.current.delete(t.id), P.current && P.current.setNodePinned(V(t), !1), ce.current = null, Wr(t), e.currentTarget.style.zIndex = "");
				return;
			}
			e.stopPropagation();
			let r = e.currentTarget;
			Pe(e, () => Xr(t, r), () => Yr(t));
		});
		let Jr = 0;
		function Yr(e) {
			Jr = Date.now(), A.current && A.current(e.originalItem || e);
		}
		function Xr(e, t) {
			H.current.has(e.id) ? (H.current.delete(e.id), P.current && P.current.setNodePinned(V(e), !1), Wr(e), t.style.zIndex = "", M.current === e.id && N(null)) : (H.current.add(e.id), N(e), P.current && P.current.setNodePinned(V(e), !0), Wr(e), jr.filter((t) => t.id === e.id).raise(), zr.filter((t) => t.id === e.id).raise(), t.style.zIndex = 10, qr(e).then(() => {
				H.current.has(e.id) && Wr(e);
			}));
		}
		let Zr = null;
		jr.filter((e) => e.type !== "article").on("click", (e, t) => {
			e.stopPropagation(), Pe(e, () => Qr(t));
		});
		function Qr(e) {
			if (Zr === e.id) Zr = null, jr.classed("dimmed", !1).classed("tag-active", !1), zr.classed("dimmed", !1), gr.classed("highlighted", !1);
			else {
				Zr = e.id;
				let t = new Set(o.links.filter((t) => {
					let n = typeof t.source == "object" ? t.source.id : t.source, r = typeof t.target == "object" ? t.target.id : t.target;
					return n === e.id || r === e.id;
				}).map((t) => {
					let n = typeof t.source == "object" ? t.source.id : t.source, r = typeof t.target == "object" ? t.target.id : t.target;
					return n === e.id ? r : n;
				}));
				t.add(e.id), jr.classed("dimmed", (e) => !t.has(e.id)), jr.classed("tag-active", (t) => t.id === e.id), zr.classed("dimmed", (e) => !t.has(e.id)), gr.classed("highlighted", (t) => {
					let n = typeof t.source == "object" ? t.source.id : t.source, r = typeof t.target == "object" ? t.target.id : t.target;
					return n === e.id || r === e.id;
				});
			}
		}
		s.on("click", (e) => Pe(e, () => {
			Ar(), Zr && (Zr = null, jr.classed("dimmed", !1).classed("tag-active", !1), zr.classed("dimmed", !1), gr.classed("highlighted", !1)), A.current && A.current(null);
		}));
		function $r() {
			gr.each(function(e) {
				e._path = dr(e, ur(e)), U(this).attr("d", e._path);
			}), hr.attr("d", (e) => e._path || ""), xr.attr("d", (e) => e._path || ""), br(), Tr && Or();
		}
		function ei() {
			hn(), $r(), jr.attr("transform", (e) => {
				let t = yn(e);
				return "translate(" + t.x + "," + t.y + ")" + _e();
			}), zr && zr.style("transform", (e) => {
				let t = yn(e);
				return `translate3d(${t.x}px, ${t.y}px, 0px) rotate(var(--gv-unrot, 0deg))${e._cardScale && e._cardScale !== 1 ? ` scale(${e._cardScale})` : ""}`;
			}), Qn(), te.current && te.current(), ie.current && ie.current(), ri();
		}
		let ti = null;
		function ni() {
			if (ti = null, typeof document > "u") return;
			let e = document.querySelector("[data-rights][data-rights-position=\"bottom-edge\"]");
			if (!e) return;
			let t = [];
			zr && zr.each(function(e) {
				e._closedHidden || this.style.display === "none" || t.push(this.getBoundingClientRect());
			});
			let n = (0, Us.rightsOverCards)(e.getBoundingClientRect(), t);
			n !== e.hasAttribute("data-rights-over") && e.toggleAttribute("data-rights-over", n);
		}
		function ri() {
			ti || typeof requestAnimationFrame > "u" || (ti = requestAnimationFrame(ni));
		}
		function ii() {
			let e = P.current;
			return !!(e && e.preference && e.preference("readers") === !0);
		}
		let ai = [];
		function oi() {
			_r.selectAll("*").remove(), ai = (0, Vs.connectionEdges)(re.current).map((e) => {
				let t = W.get(e.source), n = W.get(e.target);
				if (!t || !n) return null;
				let r = _r.append("g").attr("class", "readers-edge").attr("data-readers-edge", e.id);
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
		function si({ rebuild: e = !1 } = {}) {
			e && oi();
			let t = ii();
			if (_r.style("display", t && ai.length ? null : "none").attr("data-on", t ? "true" : "false"), t) for (let e of ai) {
				let t = ur(e.l), n = t.hidden ? "" : `M ${t.x1} ${t.y1} L ${t.x2} ${t.y2}`;
				e.line.attr("d", n);
			}
		}
		ie.current = si, oi();
		let ci = x.roots ? x.roots === !0 ? {} : x.roots : null, li = [], ui = null, di = !1;
		if (ci) {
			let e = /* @__PURE__ */ new Map();
			for (let [t, n] of qe) for (let r of n) e.set(r, t);
			let t = o.links.filter((e) => e.layer === "sequence").map((e) => ({
				source: Gn(e.source),
				target: Gn(e.target)
			})), n = (o.containers || []).find((e) => !e.parent), r = String(ci.seed || n && n.id || "roots");
			li = (0, Ls.rootSegments)({
				containers: o.containers || [],
				memberOf: e,
				sequence: t
			}).map((e) => {
				let t = We.append("g").attr("class", "root").attr("data-root", e.key).style("display", "none");
				return {
					...e,
					shape: (0, Ls.rootShape)(r + "|" + e.key),
					el: t,
					main: t.append("path").attr("class", "root-main").attr("fill", "none").attr("vector-effect", "non-scaling-stroke"),
					fine: t.append("path").attr("class", "root-fine").attr("fill", "none").attr("vector-effect", "non-scaling-stroke"),
					state: "hidden"
				};
			});
		}
		function fi(e) {
			if (e.node) {
				let t = W.get(e.node);
				if (!t || !Number.isFinite(t.x) || $n.has(t.id) || t._source && de.current.has(t._source.id)) return null;
				let n = yn(t);
				return {
					x: n.x,
					y: n.y
				};
			}
			return ot.get(e.container) || null;
		}
		function pi(e) {
			let t = P.current;
			if (!t || !t.readingProgress) return "hidden";
			let n = (e) => {
				let n = W.get(e);
				return n ? t.readingProgress(V(n)) : {
					seen: !1,
					done: !1
				};
			};
			if (e.node) {
				let t = n(e.node);
				return t.done ? "done" : t.seen || t.max > 0 ? "seen" : "hidden";
			}
			let r = Ye(e.container).map(n);
			return !r.length || !r.some((e) => e.seen || e.max > 0) ? "hidden" : r.every((e) => e.done) ? "done" : "seen";
		}
		function mi() {
			if (ui = null, li.length) {
				for (let e of li) {
					let t = pi(e.reach), n = fi(e.from), r = fi(e.to);
					if (t === "hidden" || !n || !r) {
						e.el.style("display", "none"), t === "hidden" && (e.state = "hidden");
						continue;
					}
					let i = (0, Ls.rootPath)(n, r, e.shape);
					if (e.main.attr("d", i.main), e.fine.attr("d", i.fine), e.el.style("display", null).attr("data-state", t), e.state === "hidden" && di) {
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
				di = !0;
			}
		}
		function hi() {
			!li.length || ui || (ui = typeof requestAnimationFrame < "u" ? requestAnimationFrame(mi) : setTimeout(mi, 16));
		}
		te.current = ci ? hi : null;
		let gi = !1;
		I.current = {
			data: o,
			nodes: jr,
			articleNodes: zr,
			links: gr,
			applyPositions: ei,
			svg: s,
			zoom: xe,
			fitToViewport: Di,
			simulation: Ve,
			axisLayer: Ue,
			g: f,
			updateContainers: Qn,
			ringTargets: Jn,
			recomputeContainers: Xn,
			toScreen: be,
			drawnAt: yn
		}, pe = !0;
		function _i() {
			if (nn = typeof window < "u" && window.PostPipeCoverFrame || null, !rn()) return;
			Ve.force("center", null);
			let e = [...tn.keys()].filter((e) => Sn.has(e) || !En(e));
			if (Zt()) {
				Jt(), Kn();
				for (let t of e) An(t);
			}
			let t = Pn();
			e.length && Nn(e), (e.length || t) && ei(), m || Ei(!1);
		}
		window.addEventListener("postpipe:cover-frame", _i), _i();
		let vi = () => ri();
		window.addEventListener("postpipe:cover", vi), window.addEventListener("resize", vi);
		let yi = !1, bi = new Map(o.nodes.map((e) => [e.id, e]));
		function xi() {
			if (yi || L.current !== "force") return !1;
			let e = [];
			for (let t of o.nodes) {
				if (t.type !== "article" || !H.current.has(t.id) || t._closedHidden || !Number.isFinite(t.x) || !Number.isFinite(t.y)) continue;
				let n = t._size || F({
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
			let t = (0, Is.separateOpen)(e, { gap: 12 });
			for (let [e, n] of t) {
				let t = bi.get(e);
				t && (t.x = n.x, t.y = n.y, t.vx = 0, t.vy = 0, t.fx != null && (t.fx = n.x), t.fy != null && (t.fy = n.y));
			}
			return t.size > 0;
		}
		let Si = 0;
		Ve.nodes(o.nodes).on("tick", () => {
			xi(), ei(), gi ||= Di({ initialZoomOut: !0 }), B.current && B.current(), ++Si, z.current && Si % 25 == 0 && z.current();
		}), Ve.force("link").links(o.links), xi(), gi ||= Di({ initialZoomOut: !0 }), ei();
		function Ci() {
			if (!en() || G.roots.length === 0) return null;
			let e = [], t = rn();
			if (t) for (let t of tn.keys()) {
				let n = G.containers.get(t), r = n && $t(t);
				!r || Zn(Vt.get(t)) || e.push({
					x0: r.x + n.box.x0,
					y0: r.y + n.box.y0,
					x1: r.x + n.box.x1,
					y1: r.y + n.box.y1
				});
			}
			for (let n of G.roots) {
				let r = G.containers.get(n), i = Qt(n);
				!r || !i || t && Ye(n).every((e) => an.has(e)) || Ye(n).every((e) => de.current.has(W.get(e)?._source?.id)) || e.push({
					x0: i.x + r.box.x0,
					y0: i.y + r.box.y0,
					x1: i.x + r.box.x1,
					y1: i.y + r.box.y1
				});
			}
			for (let t of o.nodes) {
				if (t.type !== "article" || G.nodes.has(t.id) || !Number.isFinite(t.x) || t._source && de.current.has(t._source.id)) continue;
				let n = (t._size?.width || S.width) / 2, r = (t._size?.height || S.height) / 2;
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
		function wi() {
			if (!y || !en()) return null;
			let e = x.initialFocus, t = G.containers.get(e), n = Vt.get(e);
			if (!t || !n || it.has(e) || Zn(n)) return null;
			let r = $t(e);
			if (!r) return null;
			let i = {
				x0: r.x + t.box.x0,
				y0: r.y + t.box.y0,
				x1: r.x + t.box.x1,
				y1: r.y + t.box.y1
			}, a = G.containers.get(t.root), o = a && Qt(t.root), s = o ? {
				x0: o.x + a.box.x0,
				y0: o.y + a.box.y0,
				x1: o.x + a.box.x1,
				y1: o.y + a.box.y1
			} : null, c = (e, t) => {
				if (!e) return e;
				let n = { ...e };
				for (let e of Ye(t)) {
					let t = W.get(e);
					if (!t || t.type !== "article" || t._closedHidden || !Number.isFinite(t.x) || !Number.isFinite(t.y)) continue;
					let r = t._size || F({
						hovered: !1,
						pinned: H.current.has(t.id)
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
		function Ti(e) {
			let t = {
				top: 0,
				bottom: 0
			};
			if (typeof document > "u" || !D.current) return t;
			let n = D.current.getBoundingClientRect(), r = 0, i = 0;
			for (let t of document.querySelectorAll("[data-feeds], [data-settings-gear], [data-rights], [data-toolbar]")) {
				let a = t.getBoundingClientRect();
				!a.width || !a.height || (a.top >= n.top + e / 2 ? i = Math.max(i, n.top + e - a.top) : a.bottom <= n.top + e / 2 && (r = Math.max(r, a.bottom - n.top)));
			}
			return {
				top: Math.max(0, Math.min(e / 4, r)),
				bottom: Math.max(0, Math.min(e / 3, i))
			};
		}
		function Ei(e) {
			let t = (0, zs.homeView)(j), n = Eo.translate(t.x, t.y).scale(t.k);
			he = t.k, Ae({ repaint: !1 });
			let r = dn() ? pn() : we();
			return e ? s.transition().duration(750).call(xe.transform, n, r || void 0) : s.call(xe.transform, n), Bn(), !0;
		}
		function Di({ animate: e = !1, initialZoomOut: t = !1, focus: n = !0 } = {}) {
			if (n && rn()) return Ei(e);
			let r = Oi({
				animate: e,
				initialZoomOut: t,
				focus: n
			});
			return r && n && (he = r, Bn()), !!r;
		}
		function Oi({ animate: e = !1, initialZoomOut: t = !1, focus: n = !0 } = {}) {
			let r = Ci();
			if (r) {
				let t = D.current ? D.current.clientWidth : window.innerWidth, i = D.current ? D.current.clientHeight : window.innerHeight;
				if (t < 50 || i < 50) return !1;
				let a = Ti(i);
				i -= a.top + a.bottom;
				let o = (e) => Math.min((t - 48) / Math.max(e.x1 - e.x0, 1), (i - 48) / Math.max(e.y1 - e.y0, 1), 1), c = n ? wi() : null, l = r, u = o(r), d = !1;
				c && (u = o(c.box), l = c.box, c.root && o(c.root) >= Math.min(u, b) ? (l = c.root, u = o(c.root)) : u < b && (u = b, d = (c.box.y1 - c.box.y0) * u > i - 48), u < w && (u = w, l = c.box, d = (c.box.y1 - c.box.y0) * u > i - 48)), u = Math.max(u, .04);
				let f = (l.x0 + l.x1) / 2, p = d ? Math.max(a.top + 24, 56) - l.y0 * u : a.top + i / 2 - (l.y0 + l.y1) / 2 * u, m = Eo.translate(t / 2 - f * u, p).scale(u);
				return Ae({ repaint: !1 }), e ? s.transition().duration(750).call(xe.transform, m) : s.call(xe.transform, m), m.k;
			}
			let i = o.nodes.filter((e) => e.type === "article");
			if (i.length < 2) return !1;
			let a = (e) => {
				let t = [...e].sort((e, t) => e - t), n = Math.floor(t.length / 2);
				return t.length % 2 ? t[n] : (t[n - 1] + t[n]) / 2;
			}, c = (e) => {
				let t = [...e].sort((e, t) => e - t);
				return [t[Math.floor(t.length * .1)], t[Math.ceil(t.length * .9) - 1]];
			}, l = i.map((e) => e.x), u = i.map((e) => e.y), [d, f] = c(l), [p, m] = c(u), h = d - 140, g = f + 140, _ = p - 140, v = m + 140, y = a(l), x = a(u), S = D.current ? D.current.clientWidth : window.innerWidth, C = D.current ? D.current.clientHeight : window.innerHeight;
			if (S < 50 && (S = window.innerWidth), C < 50 && (C = window.innerHeight), S < 50 || C < 50) return !1;
			let T = .2, E = Ti(C), O = Math.max(50, C - E.top - E.bottom), k = Math.max(Math.min(S / Math.max(g - h, 1), O / Math.max(v - _, 1), 1), T);
			t && (Be ? k = T * .85 : k *= .85);
			let A = S / 2 - y * k, j = E.top + O / 2 - x * k, M = Eo.translate(A, j).scale(k);
			return Ae({ repaint: !1 }), e ? s.transition().duration(750).call(xe.transform, M) : s.call(xe.transform, M), M.k;
		}
		let ki = !1;
		it.size && (er(), Qn()), Ve.on("end", () => {
			if (ki = !0, L.current !== "force" || (xi() && ei(), yi = !0, o.nodes.forEach((e) => {
				e.fx = e.x, e.fy = e.y, e._forcePos = {
					x: e.x,
					y: e.y
				};
			}), m || Di({ animate: !0 }), (0, ws.layoutIsDegenerate)(o.nodes, F({
				hovered: !1,
				pinned: !1
			})))) return;
			let e = P.current;
			if (e) for (let t of o.nodes) !t.pinned && t._forcePos && e.setNodePosition(oe("force") + V(t), t.x, t.y, { silent: !0 });
			z.current && z.current();
		});
		let Ai = () => {
			if (!document.hidden) {
				if (!ki) {
					Ve.alpha(.8).restart();
					return;
				}
				gi ||= Di({ initialZoomOut: !0 });
			}
		};
		document.addEventListener("visibilitychange", Ai);
		let ji = () => dn() ? pn() : we() || [r / 2, i / 2];
		function Mi(e, t = !0) {
			if (!Number.isFinite(e) || e <= 0) return;
			let n = Do(s.node()), r = Math.max(.04, Math.min(8, n.k * e));
			if (r > n.k && dn() && (r = Math.min(r, Math.max(n.k, bn()))), Math.abs(r - n.k) <= 1e-9 * n.k) return;
			let [i, a] = ji(), o = (0, js.zoomAbout)(n, r / n.k, i, a), c = Eo.translate(o.x, o.y).scale(o.k);
			m = !0, y = !1, t ? s.transition("key-zoom").duration(260).ease(Ki).call(xe.transform, c, [i, a]) : s.call(xe.transform, c);
		}
		let Ni = () => {
			y = !1;
			let e = Ci() || Pi(), t = Ti(i), n = {
				x0: 24,
				y0: t.top + 24,
				x1: r - 24,
				y1: i - t.bottom - 24
			};
			if (dn()) {
				let e = D.current ? D.current.getBoundingClientRect() : {
					left: 0,
					top: 0
				}, t = [];
				for (let n of tn.keys()) {
					let r = Vt.get(n);
					if (!r || Zn(r)) continue;
					let i = Ze.filter((e) => e.id === n).select(it.has(n) ? ".container-macro-bg" : ".container-hull").node();
					if (!i || !(i.getAttribute("d") || "").length) continue;
					let a = i.getBoundingClientRect();
					if (!a.width || !a.height) continue;
					let o = mn(n);
					if (!o) continue;
					let s = vn(r);
					t.push({
						box: {
							x0: a.left - e.left,
							y0: a.top - e.top,
							x1: a.right - e.left,
							y1: a.bottom - e.top
						},
						at: (() => {
							let e = be(o.x + s.x, o.y + s.y);
							return {
								x: e[0],
								y: e[1]
							};
						})()
					});
				}
				let r = (0, Ms.growFitRatio)(t, n);
				if (r && r > .02) {
					Mi(r);
					return;
				}
				Ei(!0);
				return;
			}
			if (e) {
				let t = [
					[e.x0, e.y0],
					[e.x1, e.y0],
					[e.x0, e.y1],
					[e.x1, e.y1]
				].map(([e, t]) => be(e, t)), r = {
					x0: Math.min(...t.map((e) => e[0])),
					x1: Math.max(...t.map((e) => e[0])),
					y0: Math.min(...t.map((e) => e[1])),
					y1: Math.max(...t.map((e) => e[1]))
				}, [i, a] = ji(), o = (0, js.fitRatioAbout)(r, i, a, n);
				if (o && o > .02) {
					Mi(o);
					return;
				}
			}
			Di({
				animate: !0,
				focus: !1
			});
		};
		function Pi() {
			let e = o.nodes.filter((e) => !e._closedHidden && Number.isFinite(e.x));
			return e.length ? {
				x0: g(e, (e) => e.x) - 40,
				y0: g(e, (e) => e.y) - 40,
				x1: h(e, (e) => e.x) + 40,
				y1: h(e, (e) => e.y) + 40
			} : null;
		}
		let Fi = (e) => {
			if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
			let t = e.target;
			if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) || typeof window < "u" && window.PostPipeCover && window.PostPipeCover.state && window.PostPipeCover.state !== "graph" || document.querySelector("[data-settings-panel]")) return;
			let n = e.key === "+" || e.key === "=", r = e.key === "-" || e.key === "_";
			!n && !r || (e.preventDefault(), Mi(n ? 1.25 : .8));
		};
		window.addEventListener("keydown", Fi);
		let Ii = () => {
			o.nodes.forEach((e) => {
				e.fx = null, e.fy = null, delete e._forcePos;
			});
			let e = P.current;
			if (e) for (let t of o.nodes) {
				let n = se(t);
				e.nodeState(n) && e.setNodePosition(n, t.x, t.y, { silent: !0 });
			}
			Ve.alpha(.8).restart();
		}, Li = () => {
			let e = F({
				hovered: !1,
				pinned: !1
			});
			o.nodes.forEach((e) => {
				delete e._size;
			});
			let t = P.current;
			if (t) for (let n of o.nodes) t.setNodeSize(V(n), e.width, e.height, { silent: !0 });
			ei();
		}, Ri = () => {
			let e = P.current;
			e && e.resetLayout && e.resetLayout(), Ae({ repaint: !1 }), o.nodes.forEach((e) => {
				e.fx = null, e.fy = null, delete e._forcePos;
			}), rn() && (Nn(), ei()), Ve.alpha(.8).restart(), Di({ animate: !0 });
		}, zi = () => {
			let e = P.current;
			e && e.resetLayout && e.resetLayout(), A.current && A.current(null), N(null), Ar(), Zr = null, ce.current = null, jr.classed("dimmed", !1).classed("tag-active", !1), zr.classed("dimmed", !1).style("z-index", null), gr.classed("highlighted", !1), H.current.clear(), o.nodes.forEach((e) => {
				delete e._size, delete e._customWidth, delete e._customHeight, delete e._forcePos, e.fx = null, e.fy = null;
			}), it.clear();
			for (let e of rt()) it.add(e);
			Tn.clear(), Ae({ repaint: !1 }), m = !1, y = !!x.initialFocus && x.initialFocus !== "all", Gr(), er(), typeof window < "u" && window.dispatchEvent(new CustomEvent("graph:containers-changed", { detail: nr() })), o.containers && o.containers.length && en() ? (rn() && Nn(), cr(), Qn(), ei(), Di({ animate: !0 })) : (Ve.alpha(.8).restart(), Di({ animate: !0 }));
		};
		window.addEventListener("graph:reset-all", zi), window.addEventListener("graph:zoom-to-fit", Ni), window.addEventListener("graph:unpin-all", Ii), window.addEventListener("graph:reset-sizes", Li), window.addEventListener("graph:reset-layout", Ri);
		let Bi = {
			"graph:open-container": (e) => or.openContainer(e.detail && e.detail.id),
			"graph:close-container": (e) => or.closeContainer(e.detail && e.detail.id),
			"graph:toggle-container": (e) => or.toggleContainer(e.detail && e.detail.id),
			"graph:open-all-containers": () => or.openAllContainers(),
			"graph:close-all-containers": () => or.closeAllContainers()
		};
		for (let [e, t] of Object.entries(Bi)) window.addEventListener(e, t);
		return () => {
			ee.current = null, te.current = null, ne.current = null, ie.current = null, ui && typeof cancelAnimationFrame < "u" && cancelAnimationFrame(ui), Tt && Tt.disconnect(), Ve.stop(), document.removeEventListener("visibilitychange", Ai), window.removeEventListener("resize", He), n.removeEventListener("touchstart", De, { capture: !0 }), n.removeEventListener("touchmove", Oe, { capture: !0 }), n.removeEventListener("touchend", ke, { capture: !0 }), n.removeEventListener("touchcancel", ke, { capture: !0 }), n.removeEventListener("touchstart", Le, { capture: !0 }), n.removeEventListener("touchmove", Re, { capture: !0 }), n.removeEventListener("touchend", ze, { capture: !0 }), je.cancel(), window.removeEventListener("graph:reset-all", zi), window.removeEventListener("postpipe:cover-frame", _i), window.removeEventListener("postpipe:cover", vi), window.removeEventListener("resize", vi), ti && typeof cancelAnimationFrame < "u" && cancelAnimationFrame(ti), window.PostPipeGraphWorld && window.PostPipeGraphWorld.snapshot === zn && delete window.PostPipeGraphWorld, window.removeEventListener("graph:zoom-to-fit", Ni), window.removeEventListener("keydown", Fi), window.removeEventListener("graph:unpin-all", Ii), window.removeEventListener("graph:reset-sizes", Li), window.removeEventListener("graph:reset-layout", Ri);
			for (let [e, t] of Object.entries(Bi)) window.removeEventListener(e, t);
			v && v.current === or && (v.current = null), Rr.forEach(({ root: e }) => {
				queueMicrotask(() => e.unmount());
			}), Rr.clear();
		};
	}, [e, fe]), r(() => {
		let e = I.current;
		if (!e || !e.axisLayer) return;
		let t = d || {}, n = () => me(e, t);
		z.current = t.on ? n : null, n();
	}, [
		d,
		l,
		e,
		fe
	]);
	function me(e, t) {
		if (e.axisLayer.selectAll("*").remove(), B.current = null, !t.on) {
			R.current = !1;
			return;
		}
		let n = D.current, r = n ? n.clientWidth : window.innerWidth, i = n ? n.clientHeight : window.innerHeight;
		if (r < 60 || i < 60) return;
		let a = t.dock || w.dock, o = a === "left" || a === "right", s = w.endPadding, c = Number.isFinite(t.offset) ? t.offset : w.inset, l = a === "right" ? r - c : a === "bottom" ? i - c : c, u = Math.max((o ? i : r) - s * 2, 120), d = o ? {
			x: l,
			y: s
		} : {
			x: s,
			y: l
		}, f = (0, ws.dimensionAxisGeometry)(e.data.nodes, {
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
				let n = m.append("line").attr("class", "time-connector").attr("data-node", e.id).attr("x1", t.x).attr("y1", t.y).attr("stroke", e._source && e._source.color || "#7f8ea3").attr("stroke-width", w.connectorWidth).attr("stroke-opacity", w.connectorOpacity);
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
		_.append("rect").attr("x", o ? l - 34 / 2 : 0).attr("y", o ? 0 : l - 34 / 2).attr("width", o ? 34 : r).attr("height", o ? i : 34).attr("fill", "rgba(18,20,28,0.82)"), _.append("line").attr("x1", f.from.x).attr("y1", f.from.y).attr("x2", f.to.x).attr("y2", f.to.y).attr("stroke", "rgba(255,255,255," + w.spineOpacity + ")").attr("stroke-width", w.spineWidth);
		let v = w.tickFontSize, y = f.ticks.length > 1 ? Math.hypot(f.ticks[1].x - f.ticks[0].x, f.ticks[1].y - f.ticks[0].y) : Infinity, b = o ? v * 1.7 : v * 4.2, x = Math.max(1, Math.ceil(b / Math.max(y, 1)));
		f.ticks.forEach((e, t) => {
			_.append("line").attr("x1", e.x).attr("y1", e.y).attr("x2", e.x + (o ? 9 : 0)).attr("y2", e.y + (o ? 0 : -9)).attr("stroke", "rgba(255,255,255,0.45)").attr("stroke-width", 1.5), t % x === 0 && _.append("text").attr("x", e.x + (o ? 13 : 0)).attr("y", e.y + (o ? 0 : -14)).attr("text-anchor", o ? "start" : "middle").attr("dominant-baseline", o ? "central" : "auto").style("font-family", "'Atkinson', sans-serif").style("font-size", v + "px").style("fill", "rgba(255,255,255,0.62)").style("pointer-events", "none").text(e.label);
		});
		let S = null, C = 0;
		_.call(Kt().on("start", (e) => {
			S = o ? e.x : e.y, C = 0;
		}).on("drag", (e) => {
			S !== null && (C = (o ? e.x : e.y) - S, _.attr("transform", o ? "translate(" + C + ",0)" : "translate(0," + C + ")"), m.selectAll("line").attr(o ? "x1" : "y1", function() {
				return Number(U(this).attr(o ? "x1" : "y1"));
			}), h.forEach(({ anchor: e, line: t }) => {
				o ? t.attr("x1", e.x + C) : t.attr("y1", e.y + C);
			}));
		}).on("end", () => {
			if (S !== null && C && P.current) {
				let e = a === "right" || a === "bottom" ? c - C : c + C;
				P.current.setTimeAxis({
					offset: Math.max(20, e),
					moved: !0
				});
			}
			S = null;
		}));
	}
	return r(() => {
		L.current = l;
		let e = I.current;
		if (!e) return;
		let t = P.current, n = F({
			hovered: !1,
			pinned: !1
		});
		if (e.recomputeContainers && e.recomputeContainers(), l === "force" && e.data.nodes.filter((e) => {
			let n = t && t.nodeState(oe("force") + V(e));
			return n && !n.auto || e._forcePos;
		}).length < e.data.nodes.length * .5) {
			e.data.nodes.forEach((e) => {
				let n = t && t.nodeState(oe("force") + V(e));
				n && !n.auto ? (e.fx = n.x, e.fy = n.y) : (e.fx = null, e.fy = null);
			}), e.simulation.alpha(1).restart();
			return;
		}
		let r = l === "force" ? Object.fromEntries(e.data.nodes.map((e) => [e.id, e._forcePos || t && t.nodeState(oe("force") + V(e)) || {
			x: e.x,
			y: e.y
		}])) : l === "radial" && e.ringTargets && e.ringTargets() || (0, ws.computeLayout)(l, e.data.nodes, {
			cardW: n.width,
			cardH: n.height
		});
		if (!r) return;
		let i = new Map(e.data.nodes.map((e) => [e.id, {
			x: e.x,
			y: e.y
		}]));
		e.data.nodes.forEach((e) => {
			let n = t && t.nodeState(oe(l) + V(e)), i = n && typeof n.x == "number" && !n.auto ? {
				x: n.x,
				y: n.y
			} : r[e.id];
			i && (e.targetX = i.x, e.targetY = i.y, e.fx = i.x, e.fy = i.y, t && !(n && !n.auto) && t.setNodePosition(oe(l) + V(e), i.x, i.y, { silent: !0 }));
		});
		let a = qi;
		Ui().duration(760).ease(a).tween("layout-transition", () => {
			let t = e.data.nodes.map((e) => {
				let t = i.get(e.id) || {
					x: e.x,
					y: e.y
				}, n = typeof e.targetX == "number" ? e.targetX : e.x, r = typeof e.targetY == "number" ? e.targetY : e.y, a = Hn(t.x, n), o = Hn(t.y, r);
				return (t) => {
					e.x = a(t), e.y = o(t);
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
		let o = setTimeout(() => {
			z.current && z.current(), e.fitToViewport && e.fitToViewport();
		}, 800);
		return () => clearTimeout(o);
	}, [l]), /* @__PURE__ */ f("div", {
		ref: D,
		className: Lo.graphContainer,
		"data-graph-root": !0
	});
}
var q = {
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
}, nc = {
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
}, rc = /* @__PURE__ */ m(((e, t) => {
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
})), ic = /* @__PURE__ */ m(((e, t) => {
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
})), ac = /* @__PURE__ */ m(((e, t) => {
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
})), oc = rc(), sc = ic(), cc = ac(), lc = (e, t) => {
	let n = e && Array.isArray(e.items) ? e.items.find((e) => e.id === t) : null;
	return n && n.title || "";
}, uc = (e, t) => "#read=" + encodeURIComponent(e) + (t == null ? "" : "&p=" + t);
function dc({ b: e, feedData: t, viewState: n }) {
	let [r, i] = c(!1), a = (0, cc.placedParagraph)(e, t && Array.isArray(t.items) ? t.items.find((t) => t.id === e.item) : null);
	return /* @__PURE__ */ p("div", {
		className: q.bmRow,
		"data-bookmark-row": !0,
		children: [/* @__PURE__ */ p("div", {
			className: q.bmMain,
			children: [/* @__PURE__ */ f("div", {
				className: q.bmTitle,
				children: (0, cc.bookmarkLabel)(e, lc(t, e.item))
			}), r ? /* @__PURE__ */ f("input", {
				type: "text",
				value: e.note || "",
				onChange: (t) => n.setBookmarkNote(e.id, t.target.value),
				onBlur: () => i(!1),
				onKeyDown: (e) => {
					e.key === "Enter" && i(!1);
				},
				className: q.bmNoteInput,
				"aria-label": "Note",
				autoFocus: !0
			}) : /* @__PURE__ */ f("button", {
				className: q.bmNote,
				onClick: () => i(!0),
				children: e.note || /* @__PURE__ */ f("em", { children: "Add a note" })
			})]
		}), /* @__PURE__ */ p("div", {
			className: q.bmActions,
			children: [
				/* @__PURE__ */ f("button", {
					onClick: () => {
						window.location.hash = uc(e.item, a);
					},
					title: "Go back to this place",
					children: "Jump"
				}),
				/* @__PURE__ */ f("button", {
					onClick: async () => {
						try {
							await navigator.clipboard.writeText(window.location.href.split("#")[0] + uc(e.item, a));
						} catch {}
					},
					title: "Copy a link to this place",
					children: "Copy link"
				}),
				/* @__PURE__ */ f("button", {
					onClick: () => n.removeBookmark(e.id),
					title: "Delete this bookmark",
					children: "Delete"
				})
			]
		})]
	});
}
function fc({ viewState: e, feedData: t, itemId: n }) {
	if (!e) return null;
	let r = e.bookmarks(), i = r.filter((e) => e.item === n), a = r.filter((e) => e.item !== n);
	return /* @__PURE__ */ p("div", {
		className: q.bmList,
		"data-bookmarks-list": !0,
		children: [[...i, ...a].map((n) => /* @__PURE__ */ f(dc, {
			b: n,
			feedData: t,
			viewState: e
		}, n.id)), r.length === 0 && /* @__PURE__ */ f("div", {
			className: q.bmEmpty,
			children: "No bookmarks yet."
		})]
	});
}
//#endregion
//#region src/components/Icon/Icon.jsx
function pc({ body: e, size: t = 16, className: n }) {
	return e ? /* @__PURE__ */ f("svg", {
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
var mc = /* @__PURE__ */ m(((e, t) => {
	var n = (e) => `<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">${e}</g>`, r = {
		"undo-2": n("<path d=\"M9 14 4 9l5-5\"/><path d=\"M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11\"/>"),
		"redo-2": n("<path d=\"m15 14 5-5-5-5\"/><path d=\"M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13\"/>"),
		"rotate-ccw": n("<path d=\"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\"/><path d=\"M3 3v5h5\"/>"),
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
})), hc = /* @__PURE__ */ m(((e, t) => {
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
})), gc = mc(), _c = hc(), vc = "p, li, blockquote, h1, h2, h3, h4, h5, h6, dd, dt, figcaption, td, th", yc = "pp-follow-sentence", bc = "pp-follow-word", xc = "pp-follow-block", Sc = () => typeof CSS < "u" && CSS.highlights && typeof Highlight < "u";
function Cc(e, t) {
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
function wc(e) {
	let t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT, { acceptNode(e) {
		let t = e.parentElement;
		return t && t.closest(".bookmarkRibbon, [aria-hidden=\"true\"]") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
	} }), r;
	for (; r = n.nextNode();) t.push(r);
	return t;
}
function Tc(e, t, n, r) {
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
function Ec(e) {
	Sc() && (CSS.highlights.delete(yc), CSS.highlights.delete(bc)), e && (e.querySelectorAll("." + xc).forEach((e) => e.classList.remove(xc)), delete e.dataset.followSentence, delete e.dataset.followWord);
}
function Dc(e, t, n) {
	let r = Cc(t, n);
	if (!r || !e.contains(r.node)) return null;
	let i = r.node.nodeType === 3 ? r.node.parentElement : r.node, a = i && i.closest(vc);
	if (!a || !e.contains(a)) return null;
	let o = wc(a);
	if (!o.length) return null;
	let s = [], c = "", l = null;
	for (let e of o) s.push(c.length), e === r.node && (l = c.length + r.offset), c += e.nodeValue;
	if (l === null) return null;
	let u = (0, _c.spanAt)(c, l);
	if (!u) return null;
	Ec(e);
	let d = c.slice(u.sentence[0], u.sentence[1]), f = u.word ? c.slice(u.word[0], u.word[1]) : "";
	return Sc() ? (CSS.highlights.set(yc, new Highlight(Tc(o, s, u.sentence[0], u.sentence[1]))), u.word && CSS.highlights.set(bc, new Highlight(Tc(o, s, u.word[0], u.word[1])))) : a.classList.add(xc), e.dataset.followSentence = d, e.dataset.followWord = f, {
		sentence: d,
		word: f
	};
}
function Oc(e) {
	let t = !1, n = 0, r = null, i = () => {
		n = 0, r && Dc(e, r.x, r.y);
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
		n && cancelAnimationFrame(n), e.removeEventListener("pointerdown", o), e.removeEventListener("pointermove", s), window.removeEventListener("pointerup", c), window.removeEventListener("pointercancel", c), Ec(e);
	};
}
//#endregion
//#region src/components/ReaderPanel/boldStartHtml.js
var kc = (/* @__PURE__ */ m(((e, t) => {
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
})))(), Ac = new Set([
	"SCRIPT",
	"STYLE",
	"CODE",
	"PRE",
	"KBD",
	"SAMP",
	"svg"
]);
function jc(e) {
	if (!e || typeof DOMParser > "u") return e;
	let t = new DOMParser().parseFromString(`<div id="pp-bs-root">${e}</div>`, "text/html"), n = t.getElementById("pp-bs-root"), r = t.createTreeWalker(n, NodeFilter.SHOW_TEXT, { acceptNode(e) {
		for (let t = e.parentElement; t && t !== n; t = t.parentElement) if (Ac.has(t.tagName)) return NodeFilter.FILTER_REJECT;
		return /[\p{L}]/u.test(e.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
	} }), i = [], a;
	for (; a = r.nextNode();) i.push(a);
	for (let e of i) {
		let n = t.createDocumentFragment();
		for (let r of (0, kc.boldStartSegments)(e.nodeValue)) if (r.bold) {
			let e = t.createElement("b");
			e.className = "pp-bs", e.textContent = r.text, n.appendChild(e);
		} else n.appendChild(t.createTextNode(r.text));
		e.parentNode.replaceChild(n, e);
	}
	return n.innerHTML;
}
//#endregion
//#region src/components/ReaderPanel/Contributions.module.css
var Mc = (/* @__PURE__ */ m(((e, t) => {
	function n(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of e && e.items || []) t.set(n.id, n);
		return t;
	}
	function r(e) {
		return !!e && e._posted !== "title";
	}
	function i(e, t, n = "not yet published") {
		if (r(t)) return null;
		let i = e && e.containers || [], a = new Map(i.map((e) => [e.id, e])), o = (e) => {
			let t = 0, n = e.parent;
			for (; n && a.has(n) && t < 20;) t++, n = a.get(n).parent;
			return t;
		}, s = i.filter((e) => e.tag && (t.tags || []).includes(e.tag)).sort((e, t) => o(t) - o(e)).find((e) => e.status);
		return s ? String(s.status) : n;
	}
	function a(e, t) {
		let r = n(e), i = [], a = [];
		for (let n of e && e.edges || []) n.layer === "sequence" && (n.source === t && r.has(n.target) && a.push(r.get(n.target)), n.target === t && r.has(n.source) && i.push(r.get(n.source)));
		return {
			prev: i,
			next: a
		};
	}
	function o(e, t, n) {
		let { prev: i, next: o } = a(e, t);
		return (n === "prev" ? i : o).find(r) || null;
	}
	t.exports = {
		neighbours: a,
		navStatus: i,
		isReadable: r,
		step: o
	};
})))(), J = {
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
}, Nc = "pp-contrib-passage", Pc = () => typeof CSS < "u" && CSS.highlights && typeof Highlight < "u";
function Fc(e) {
	if (!e) return "";
	let t = new Date(e.length === 10 ? `${e}T00:00:00` : e);
	return isNaN(t) ? "" : t.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	});
}
function Ic(e, t) {
	let n = String(e || "").replace(/\s+/g, " ").trim();
	return n.length > t ? n.slice(0, t - 1).trimEnd() + "…" : n;
}
function Lc(e, t, n) {
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
function Rc({ article: e, contributions: t, config: n, feedData: i, textRef: o, textKey: s, onOpenChapter: l, children: u }) {
	let m = (0, Vs.slugOf)(e), h = a(() => (0, Vs.forChapter)(t, m), [t, m]), [g, _] = c(null), [v, y] = c({}), b = a(() => {
		let e = /* @__PURE__ */ new Map();
		for (let t of i && i.items || []) e.set((0, Vs.slugOf)(t), t);
		return e;
	}, [i]);
	r(() => {
		_(null);
		let e = setTimeout(() => {
			let e = o && o.current, t = e ? Array.from(e.querySelectorAll("p")) : [], n = t.map((e) => e.textContent), r = {};
			for (let e of h) e.quote && (r[e.id] = t.length ? (0, Vs.resolveQuote)(n, e.quote) : null);
			y(r);
		}, 80);
		return () => clearTimeout(e);
	}, [
		h,
		e,
		s
	]), r(() => () => {
		Pc() && CSS.highlights.delete(Nc);
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
		let a = Lc(r, t.offset, t.length);
		n.querySelectorAll("[data-contrib-passage]").forEach((e) => e.removeAttribute("data-contrib-passage")), r.setAttribute("data-contrib-passage", e.id), a && Pc() && CSS.highlights.set(Nc, new Highlight(a)), setTimeout(() => {
			r.getAttribute("data-contrib-passage") === e.id && r.removeAttribute("data-contrib-passage"), Pc() && CSS.highlights.delete(Nc);
		}, 4e3);
	};
	if (!h.length && !u && !(n && n.submit)) return null;
	let S = (e) => {
		if (!e.quote) return null;
		let t = v[e.id];
		return t ? /* @__PURE__ */ p("div", {
			className: J.quote,
			"data-contrib-anchor": "found",
			children: [/* @__PURE__ */ p("span", {
				className: J.quoteText,
				children: [
					"“",
					Ic(e.quote.exact, 140),
					"”"
				]
			}), /* @__PURE__ */ f("button", {
				type: "button",
				className: J.linkBtn,
				onClick: () => x(e),
				"data-contrib-show": !0,
				children: "Show the passage"
			})]
		}) : t === null ? /* @__PURE__ */ f("div", {
			className: J.fallback,
			"data-contrib-anchor": "fallback",
			children: "This was about a passage that isn’t in the chapter as it reads now, so it stays with the chapter as a whole."
		}) : null;
	}, C = (e) => /* @__PURE__ */ p("div", {
		className: J.byline,
		children: [
			/* @__PURE__ */ f("span", {
				className: J.author,
				children: e.author
			}),
			Fc(e.created) && /* @__PURE__ */ p("span", {
				className: J.date,
				children: [" · ", Fc(e.created)]
			}),
			e.test && /* @__PURE__ */ f("span", {
				className: J.testTag,
				children: " · test"
			})
		]
	});
	return /* @__PURE__ */ p("aside", {
		className: J.section,
		"aria-label": "From readers",
		"data-contributions": !0,
		"data-pp-not-text": !0,
		children: [
			/* @__PURE__ */ p("div", {
				className: J.head,
				children: [/* @__PURE__ */ f("div", {
					className: J.title,
					children: "From readers"
				}), /* @__PURE__ */ f("div", {
					className: J.note,
					children: "Not part of the book. Written by readers, with their names."
				})]
			}),
			h.length === 0 && /* @__PURE__ */ f("div", {
				className: J.empty,
				children: "Nothing from readers on this chapter yet."
			}),
			/* @__PURE__ */ f("ul", {
				className: J.list,
				children: h.map((e) => /* @__PURE__ */ p("li", {
					className: J.item,
					"data-contrib": e.id,
					"data-contrib-type": e.type,
					children: [
						/* @__PURE__ */ f("div", {
							className: J.kind,
							children: e.type === "essay" ? "Essay" : e.type === "art" ? "Art" : e.type === "connection" ? "Connection" : "Comment"
						}),
						e.title && /* @__PURE__ */ f("div", {
							className: J.itemTitle,
							children: e.title
						}),
						C(e),
						S(e),
						e.type === "comment" && (0, Vs.paragraphsOf)(e.body).map((e, t) => /* @__PURE__ */ f("div", {
							className: J.para,
							children: e
						}, t)),
						e.type === "connection" && (() => {
							let t = e.chapter === m ? e.to : e.chapter, n = b.get(t);
							return /* @__PURE__ */ p(d, { children: [/* @__PURE__ */ p("div", {
								className: J.para,
								children: [
									"Connects this chapter with",
									" ",
									n && l ? /* @__PURE__ */ f("button", {
										type: "button",
										className: J.linkBtn,
										onClick: () => l(n),
										"data-contrib-goto": t,
										children: n.title || t
									}) : n && n.title || t
								]
							}), (0, Vs.paragraphsOf)(e.body).map((e, t) => /* @__PURE__ */ f("div", {
								className: J.para,
								children: e
							}, t))] });
						})(),
						e.type === "art" && /* @__PURE__ */ p("figure", {
							className: J.art,
							children: [/* @__PURE__ */ f("img", {
								src: (0, Vs.assetUrl)(e.asset, n),
								alt: e.alt || `Art by ${e.author}`,
								loading: "lazy"
							}), e.body && /* @__PURE__ */ f("figcaption", {
								className: J.para,
								children: e.body
							})]
						}),
						e.type === "essay" && (() => {
							let t = (0, Vs.paragraphsOf)(e.body), n = g === e.id;
							return /* @__PURE__ */ p("div", {
								className: J.essay,
								"data-contrib-essay": n ? "open" : "closed",
								children: [
									!n && /* @__PURE__ */ f("div", {
										className: J.para,
										children: Ic(t[0] || "", 220)
									}),
									n && t.map((e, t) => /* @__PURE__ */ f("div", {
										className: J.para,
										children: e
									}, t)),
									/* @__PURE__ */ f("button", {
										type: "button",
										className: J.linkBtn,
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
			n && n.submit && /* @__PURE__ */ f(Bc, {
				article: e,
				chapter: m,
				config: n,
				feedData: i,
				textRef: o
			}),
			u
		]
	});
}
function zc(e) {
	let t = typeof window < "u" && window.getSelection ? window.getSelection() : null;
	if (!t || t.isCollapsed || !t.rangeCount || !e) return null;
	let n = t.getRangeAt(0);
	if (!e.contains(n.commonAncestorContainer)) return null;
	let r = n.startContainer.nodeType === 1 ? n.startContainer : n.startContainer.parentElement, i = r && r.closest("p");
	if (!i || !e.contains(i) || !i.contains(n.endContainer)) return { error: "Choose a passage within one paragraph." };
	let a = document.createRange();
	a.setStart(i, 0), a.setEnd(n.startContainer, n.startOffset);
	let o = a.toString().length;
	return (0, Vs.quoteFromSelection)(i.textContent, o, o + n.toString().length);
}
function Bc({ article: e, chapter: t, config: n, feedData: i, textRef: a }) {
	let [o, s] = c(!1), [l, u] = c(""), [m, h] = c("comment"), [g, _] = c(""), [v, y] = c(""), [b, x] = c(""), [S, C] = c(null), [w, T] = c(null), [E, D] = c({
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
			let e = zc(a && a.current);
			e && T(e);
		};
		return document.addEventListener("selectionchange", e), () => document.removeEventListener("selectionchange", e);
	}, [o, a]);
	let k = (i && i.items || []).filter((e) => (0, Vs.slugOf)(e) !== t && e._posted !== "title").map((e) => ({
		id: (0, Vs.slugOf)(e),
		title: e.title || (0, Vs.slugOf)(e)
	})), A = () => ({
		author: l.trim(),
		type: m,
		...m === "essay" && g.trim() ? { title: g.trim() } : {},
		body: v,
		anchor: {
			chapter: t,
			...S && !S.error ? S : {}
		},
		...m === "connection" ? { to: b } : {}
	});
	return o ? /* @__PURE__ */ p("form", {
		className: J.form,
		onSubmit: async (e) => {
			e.preventDefault();
			let t = A(), r = (0, Vs.checkSubmission)(t, n);
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
			/* @__PURE__ */ f("div", {
				className: J.formTitle,
				children: "Add yours"
			}),
			/* @__PURE__ */ f("div", {
				className: J.note,
				children: "It is read before it appears here. Only the name you give is kept with it; nothing else about you is asked for or stored."
			}),
			/* @__PURE__ */ p("label", {
				className: J.field,
				children: [/* @__PURE__ */ f("span", { children: "Name to show" }), /* @__PURE__ */ f("input", {
					value: l,
					maxLength: O.name,
					onChange: (e) => u(e.target.value),
					autoComplete: "nickname",
					"data-contrib-field": "author"
				})]
			}),
			/* @__PURE__ */ p("label", {
				className: J.field,
				children: [/* @__PURE__ */ f("span", { children: "What it is" }), /* @__PURE__ */ p("select", {
					value: m,
					onChange: (e) => h(e.target.value),
					"data-contrib-field": "type",
					children: [
						/* @__PURE__ */ f("option", {
							value: "comment",
							children: "A comment"
						}),
						/* @__PURE__ */ f("option", {
							value: "essay",
							children: "An essay"
						}),
						/* @__PURE__ */ f("option", {
							value: "connection",
							children: "A connection to another chapter"
						})
					]
				})]
			}),
			m === "essay" && /* @__PURE__ */ p("label", {
				className: J.field,
				children: [/* @__PURE__ */ f("span", { children: "Title (optional)" }), /* @__PURE__ */ f("input", {
					value: g,
					maxLength: 140,
					onChange: (e) => _(e.target.value),
					"data-contrib-field": "title"
				})]
			}),
			m === "connection" && /* @__PURE__ */ p("label", {
				className: J.field,
				children: [/* @__PURE__ */ f("span", { children: "The other chapter" }), /* @__PURE__ */ p("select", {
					value: b,
					onChange: (e) => x(e.target.value),
					"data-contrib-field": "to",
					children: [/* @__PURE__ */ f("option", {
						value: "",
						children: "Choose…"
					}), k.map((e) => /* @__PURE__ */ f("option", {
						value: e.id,
						children: e.title
					}, e.id))]
				})]
			}),
			/* @__PURE__ */ p("label", {
				className: J.field,
				children: [/* @__PURE__ */ f("span", { children: m === "connection" ? "How they connect" : "Your words" }), /* @__PURE__ */ f("textarea", {
					value: v,
					maxLength: O.body,
					rows: m === "essay" ? 10 : 4,
					onChange: (e) => y(e.target.value),
					"data-contrib-field": "body"
				})]
			}),
			/* @__PURE__ */ f("div", {
				className: J.passage,
				children: S && !S.error ? /* @__PURE__ */ p(d, { children: [/* @__PURE__ */ p("span", {
					className: J.quoteText,
					children: [
						"About: “",
						Ic(S.exact, 120),
						"”"
					]
				}), /* @__PURE__ */ f("button", {
					type: "button",
					className: J.linkBtn,
					onClick: () => C(null),
					children: "Not about a passage"
				})] }) : /* @__PURE__ */ p(d, { children: [/* @__PURE__ */ f("span", {
					className: J.note,
					children: S && S.error ? S.error : "To write about a passage, select it in the chapter, then:"
				}), /* @__PURE__ */ f("button", {
					type: "button",
					className: J.linkBtn,
					onMouseDown: (e) => e.preventDefault(),
					onClick: () => C(zc(a && a.current) || w || { error: "Select a passage in the chapter first." }),
					"data-contrib-use-selection": !0,
					children: "Use the passage I selected"
				})] })
			}),
			E.errors.length > 0 && /* @__PURE__ */ f("ul", {
				className: J.errors,
				role: "alert",
				children: E.errors.map((e, t) => /* @__PURE__ */ f("li", { children: e }, t))
			}),
			E.done && /* @__PURE__ */ f("div", {
				className: J.thanks,
				role: "status",
				"data-contrib-sent": !0,
				children: "Thank you. It will appear here once it has been read and approved."
			}),
			/* @__PURE__ */ p("div", {
				className: J.formActions,
				children: [/* @__PURE__ */ f("button", {
					type: "submit",
					className: J.addBtn,
					disabled: E.sending,
					"data-contrib-send": !0,
					children: E.sending ? "Sending…" : "Send"
				}), /* @__PURE__ */ f("button", {
					type: "button",
					className: J.linkBtn,
					onClick: () => s(!1),
					children: "Close"
				})]
			})
		]
	}) : /* @__PURE__ */ f("div", {
		className: J.addRow,
		children: /* @__PURE__ */ f("button", {
			type: "button",
			className: J.addBtn,
			onClick: () => s(!0),
			"data-contrib-add": !0,
			children: "Add yours"
		})
	});
}
//#endregion
//#region src/components/ReaderPanel/ReaderPanel.jsx
function Vc({ article: e, onClose: t, settings: n, viewState: i, targetParagraph: o, feedData: l, onNavigate: u, contributions: m, contributionsConfig: h }) {
	let [g, _] = c(!1), [v, y] = c(!1), [b, x] = c(null), [S, C] = c(!1), [w, T] = c(!1), [E, D] = c(""), [O, k] = c(0), [A, j] = c(!1), [M, N] = c(!1), [P, F] = c(!1), I = s(null), L = s(null), R = s(null), z = s(!1), B = s({
		mouseX: 0,
		mouseY: 0,
		posX: 0,
		posY: 0
	}), [ee, te] = c(null), [ne, re] = c(null), ie = s([]);
	r(() => {
		pe.current && (clearTimeout(pe.current), he()), e ? (_(!0), y(!1), te(null), L.current && (L.current.scrollTop = 0), k(0), fe(e)) : (_(!1), y(!1), D(""), k(0), C(!1));
	}, [e]);
	let V = (e) => e ? e.originalItem && e.originalItem.id || e.id || e.url : null, ae = V(e), oe = i && ae ? i.bookmarks(ae) : [], se = !!(i && i.readerAid && i.readerAid("boldStart")), H = a(() => se ? jc(E) : E, [E, se]), ce = a(() => ({ __html: H }), [H]), le = (e) => {
		e.target.closest("button") || e.target.closest("a") || e.target.closest("input") || (z.current = !0, B.current = {
			mouseX: e.clientX,
			mouseY: e.clientY,
			posX: b ? b.x : 0,
			posY: b ? b.y : 0
		}, window.addEventListener("mousemove", ue), window.addEventListener("mouseup", de));
	}, ue = (e) => {
		if (!z.current) return;
		let t = e.clientX - B.current.mouseX, n = e.clientY - B.current.mouseY;
		x({
			x: B.current.posX + t,
			y: B.current.posY + n
		});
	}, de = () => {
		z.current = !1, window.removeEventListener("mousemove", ue), window.removeEventListener("mouseup", de);
	}, fe = async (e) => {
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
			let t = (0, Mc.navStatus)(l, e) || "";
			D(`<div class="${q.notYet}" data-not-yet><div class="${q.notYetTitle}">${Hc(e.title || "")}</div><div class="${q.notYetStatus}">${Hc(t)}</div></div>`);
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
			a && a.remove(), i.querySelectorAll(".pp-rights").forEach((e) => e.remove()), D((i.querySelector("body") ? i.querySelector("body").innerHTML : r) + Wc(e));
		} catch {
			D(Uc(e, "Rendered article not yet published to GitHub Pages."));
		}
		else D(t === "image" ? (e.image ? `<img src="${e.image}" style="max-width:100%;height:auto;border-radius:4px;display:block;margin:0 auto;">` : "<p style=\"color:#666;\">No image resolved.</p>") + Gc(e) : Uc(e) + Gc(e));
	}, pe = s(null), me = s(null), he = () => {
		pe.current = null;
		let e = L.current, t = me.current;
		if (!e || !t || !i || !i.setReadingProgress) return;
		let n = e.scrollHeight - e.clientHeight;
		i.setReadingProgress(t, n > 0 ? e.scrollTop / n : 1);
	}, ge = () => {
		if (L.current) {
			let { scrollTop: e, scrollHeight: t, clientHeight: n } = L.current, r = t - n, i = r > 0 ? e / r * 100 : 100;
			k(Math.max(0, Math.min(i, 100))), me.current && (i >= 98 ? (clearTimeout(pe.current), he()) : pe.current ||= setTimeout(he, 350));
		}
	}, _e = () => {
		if (!i || !e) return;
		let t = V(e), n = i.bookmarks(t), r = ve(), a = (0, cc.bookmarkTap)(n, r);
		if (n.forEach((e) => i.removeBookmark(e.id)), a === "set") {
			let n = L.current ? L.current.querySelectorAll("p") : [], a = r !== null && n[r] ? n[r].innerText.trim().split(/\s+/).slice(0, 8).join(" ") : "";
			i.addBookmark({
				item: t,
				para: r === null ? void 0 : r,
				quote: a,
				version: e.version
			});
		}
	}, ve = () => {
		if (!L.current) return null;
		let e = L.current.getBoundingClientRect(), t = L.current.querySelectorAll("p");
		for (let n = 0; n < t.length; n++) if (t[n].getBoundingClientRect().bottom > e.top + 10) return n;
		return null;
	}, ye = async () => {
		if (!e) return;
		let t = V(e), n = ve(), r = window.location.href.split("#")[0] + "#read=" + encodeURIComponent(t);
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
	let be = (e) => {
		if (!L.current || e == null) return;
		let t = L.current.querySelectorAll("p");
		if (t[e]) {
			let n = L.current.getBoundingClientRect(), r = t[e].getBoundingClientRect();
			L.current.scrollTop += r.top - n.top - 20;
		}
	}, xe = () => {
		if (!e || !L.current || !(0, sc.allowDownload)(n)) return;
		let t = `${(n?.export?.license_header || "").replace("{{canonical_url}}", e.canonical_url || e.url)}\n\n---\n\n${L.current.innerText}`, r = new Blob([t], { type: "text/markdown" }), i = document.createElement("a");
		i.href = URL.createObjectURL(r), i.download = `${(e.id || e.url).split("/").pop().replace(".html", "") || "article"}.md`, i.click(), URL.revokeObjectURL(i.href);
	};
	r(() => {
		if (clearTimeout(pe.current), pe.current = null, me.current = null, !E || !e || e._posted === "title" || !i || !i.readingProgress) return;
		let t = V(e), n = setTimeout(() => {
			let e = L.current;
			if (!e) return;
			let n = i.readingProgress(t), r = e.scrollHeight - e.clientHeight;
			o == null && n.at > .02 && n.at < .98 && r > 0 && (e.scrollTop = n.at * r), me.current = t, ge(), r <= 0 && he();
		}, 60);
		return () => clearTimeout(n);
	}, [E]), r(() => {
		E && o != null && L.current && setTimeout(() => {
			be(o);
		}, 50);
	}, [E, o]);
	let Se = (e, t, n) => {
		let r = e.para === void 0 ? e.paragraph : e.para;
		if (r == null) return null;
		if (e.version && t.version && e.version !== t.version) {
			if (t.version_maps && t.version_maps[e.version]) {
				let n = t.version_maps[e.version][r];
				if (n !== void 0 && n !== -1) return n;
			}
			if (e.quote) {
				let t = Array.from(n).map((e) => e.innerText);
				return (0, oc.resolveParagraph)(r, e.quote, t);
			}
		}
		return r;
	};
	r(() => {
		if (!i || !L.current) return;
		let t = e ? V(e) : null, n = i.bookmarks();
		if (L.current.querySelectorAll(".bookmarkRibbon").forEach((e) => e.remove()), t) {
			let r = n.find((e) => e.item === t);
			if (r) {
				let t = L.current.querySelectorAll("p"), n = Se(r, e, t);
				if (n !== null && t[n]) {
					let e = document.createElement("div");
					e.className = "bookmarkRibbon", e.setAttribute("aria-hidden", "true"), e.innerHTML = nc.bookmark, e.style.position = "absolute", e.style.left = "-30px", e.style.top = "0", e.style.color = "var(--rp-accent)", e.style.width = "20px", e.style.height = "20px", t[n].style.position = "relative", t[n].appendChild(e);
				}
			}
		}
	}, [
		H,
		i ? i.bookmarks() : null,
		e
	]);
	let Ce = !!(i && i.readerAid && i.readerAid("followAlong"));
	r(() => {
		if (!(!Ce || !L.current)) return Oc(L.current);
	}, [
		Ce,
		H,
		e
	]);
	let we = a(() => e && l ? (0, Mc.neighbours)(l, e.id) : {
		prev: [],
		next: []
	}, [e, l]), Te = () => typeof window < "u" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches, Ee = (e, t) => {
		if (!(!e || !u || !(0, Mc.isReadable)(e))) {
			if (ie.current.forEach(clearTimeout), ie.current = [], Te()) {
				u(e);
				return;
			}
			te(t), ie.current.push(setTimeout(() => {
				re(t), u(e), ie.current.push(setTimeout(() => re(null), 520));
			}, 170));
		}
	}, De = (t) => {
		if (!e || !l) return;
		let n = (0, Mc.step)(l, e.id, t);
		n && Ee(n, t);
	}, Oe = s(De);
	Oe.current = De, r(() => () => ie.current.forEach(clearTimeout), []);
	let ke = !!e && g && !v;
	r(() => {
		if (!ke) return;
		let e = (e) => {
			if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
			let t = e.target;
			t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) || (e.key === "ArrowRight" && (e.preventDefault(), Oe.current("next")), e.key === "ArrowLeft" && (e.preventDefault(), Oe.current("prev")));
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [ke]), r(() => {
		let e = L.current;
		if (!ke || !e) return;
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
			o && !o.isCollapsed && String(o).trim() || Ce && n.onText || Oe.current(i < 0 ? "next" : "prev");
		}, i = () => {
			t = null;
		};
		return e.addEventListener("touchstart", n, { passive: !0 }), e.addEventListener("touchend", r, { passive: !0 }), e.addEventListener("touchcancel", i, { passive: !0 }), () => {
			e.removeEventListener("touchstart", n), e.removeEventListener("touchend", r), e.removeEventListener("touchcancel", i);
		};
	}, [ke, Ce]);
	let Ae = s(null);
	if (Ae.current = _e, r(() => {
		let e = () => {
			Ae.current && Ae.current();
		};
		return window.addEventListener("postpipe:reader-mark", e), () => window.removeEventListener("postpipe:reader-mark", e);
	}, []), !e) return null;
	let je = (e, t) => {
		let n = (0, Mc.navStatus)(l, e), r = /* @__PURE__ */ f(pc, {
			body: (0, gc.iconBody)(t === "next" ? "arrow-right" : "arrow-left"),
			size: 16,
			className: q.navArrow
		}), i = t === "next" ? /* @__PURE__ */ p(d, { children: [/* @__PURE__ */ f("span", {
			className: q.navTitle,
			children: e.title
		}), r] }) : /* @__PURE__ */ p(d, { children: [r, /* @__PURE__ */ f("span", {
			className: q.navTitle,
			children: e.title
		})] });
		return n ? /* @__PURE__ */ p("div", {
			className: `${q.navItem} ${q.navLocked} ${t === "next" ? q.navNext : ""}`,
			"data-reader-nav": t,
			"data-nav-status": !0,
			children: [/* @__PURE__ */ f("span", {
				className: q.navLine,
				children: i
			}), /* @__PURE__ */ f("span", {
				className: q.navStatus,
				children: n
			})]
		}, e.id) : /* @__PURE__ */ f("button", {
			className: `${q.navItem} ${t === "next" ? q.navNext : ""}`,
			"data-reader-nav": t,
			onClick: () => Ee(e, t),
			title: e.title,
			children: /* @__PURE__ */ f("span", {
				className: q.navLine,
				children: i
			})
		}, e.id);
	}, Me = (e) => (we.prev.length > 0 || we.next.length > 0) && /* @__PURE__ */ p("nav", {
		className: e === "top" ? q.navTop : q.navBottom,
		"aria-label": "Chapters either side",
		"data-reader-nav-row": e,
		...e === "bottom" ? { "data-reader-nav-bottom": "" } : {},
		children: [/* @__PURE__ */ f("span", {
			className: q.navSide,
			children: we.prev.map((e) => je(e, "prev"))
		}), /* @__PURE__ */ f("span", {
			className: `${q.navSide} ${q.navSideNext}`,
			children: we.next.map((e) => je(e, "next"))
		})]
	}), Ne = [e.date ? (/* @__PURE__ */ new Date(`${e.date}T00:00:00`)).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	}) : "", e.reading_time].filter(Boolean), Pe = (n?.author?.name || n?.author?.display || "harold young").toLowerCase(), Fe = n?.author?.url;
	e.authors && e.authors.length > 0 && e.authors[0].name ? (Pe = e.authors.map((e) => e.name).join(", ").toLowerCase(), Fe = e.authors[0].url || e.canonical_url || e.url) : e.author && (Pe = e.author.replace(/\s*\[humxn\]/i, "").trim().toLowerCase(), Fe = e.canonical_url || e.url);
	let Ie = (0, Ko.readerHeader)(n, e), Le = (0, sc.progressBarMode)(n), Re = (0, sc.allowDownload)(n), ze = (0, Us.rightsLine)(n && n.rights);
	return /* @__PURE__ */ p(d, { children: [
		/* @__PURE__ */ f("div", {
			className: `${q.overlay} ${g && !v ? q.open : ""}`,
			onClick: t
		}),
		/* @__PURE__ */ p("div", {
			"data-reader-panel": !0,
			className: `${q.panel} ${g && !v ? q.open : ""} ${v ? q.minimized : ""} ${A ? q.wide : ""} ${M ? q.full : ""}`,
			style: b ? { transform: `translate3d(${b.x}px, ${b.y}px, 0px)` } : void 0,
			children: [
				Le !== "none" && /* @__PURE__ */ f("div", {
					className: Le === "side" ? q.progressSide : q.progress,
					role: "progressbar",
					"aria-label": "Reading progress",
					"aria-valuemin": 0,
					"aria-valuemax": 100,
					"aria-valuenow": Math.round(O),
					children: /* @__PURE__ */ f("div", {
						className: q.progressFill,
						style: Le === "side" ? { height: `${O}%` } : { width: `${O}%` }
					})
				}),
				/* @__PURE__ */ p("div", {
					className: q.toolbar,
					onMouseDown: le,
					onDoubleClick: () => x(null),
					title: "Drag to move the reader · Double-click to put it back",
					"data-reader-header": !0,
					children: [
						/* @__PURE__ */ f("div", {
							className: q.dragGrip,
							"aria-hidden": "true",
							children: "⋮⋮"
						}),
						/* @__PURE__ */ f("div", {
							id: "tts-mount-point",
							className: `${q.toolbarGroup} ${q.ttsMount}`
						}),
						/* @__PURE__ */ p("div", {
							className: q.toolbarGroup,
							children: [
								/* @__PURE__ */ p("button", {
									className: `${q.tb} ${q.tbLabeled} ${oe.length > 0 ? q.active : ""}`,
									onClick: _e,
									"aria-pressed": oe.length > 0,
									title: oe.length > 0 ? "Bookmark the paragraph at the top (it replaces this chapter's bookmark), or take it away where it is" : "Bookmark the paragraph at the top of the reader",
									"data-bookmark-toggle": !0,
									children: [/* @__PURE__ */ f(pc, {
										body: (0, gc.iconBody)("bookmark"),
										size: 17
									}), /* @__PURE__ */ f("span", {
										className: q.tbText,
										children: "Bookmark"
									})]
								}),
								(0, sc.bookmarksList)(n) && /* @__PURE__ */ f("button", {
									className: `${q.tb} ${w ? q.active : ""}`,
									onClick: () => T((e) => !e),
									"aria-expanded": w,
									title: "Every place you have bookmarked",
									"aria-label": "Bookmarks",
									"data-bookmark-list": !0,
									children: /* @__PURE__ */ f(pc, {
										body: (0, gc.iconBody)("list"),
										size: 17
									})
								}),
								/* @__PURE__ */ f("button", {
									className: q.tb,
									onClick: ye,
									title: "Copy a link to here",
									"aria-label": "Copy a link to here",
									"data-reader-link": !0,
									children: /* @__PURE__ */ f(pc, {
										body: (0, gc.iconBody)("link"),
										size: 17
									})
								}),
								P && /* @__PURE__ */ f("span", {
									className: q.copied,
									role: "status",
									"data-reader-copied": !0,
									children: "copied"
								}),
								/* @__PURE__ */ f("button", {
									className: `${q.tb} ${S ? q.active : ""}`,
									onClick: () => C(!S),
									title: "Details",
									"aria-label": "Details",
									"aria-pressed": S,
									"data-reader-details": !0,
									children: /* @__PURE__ */ f(pc, {
										body: (0, gc.iconBody)("info"),
										size: 17
									})
								}),
								Re && /* @__PURE__ */ f("button", {
									className: q.tb,
									onClick: xe,
									title: "Download",
									"aria-label": "Download",
									"data-reader-download": !0,
									children: /* @__PURE__ */ f(pc, {
										body: (0, gc.iconBody)("download"),
										size: 17
									})
								}),
								Object.entries(e.syndication || {}).map(([e, t]) => {
									if (!t) return null;
									let r = n?.toolbar?.syndication_icons?.[e];
									return r ? /* @__PURE__ */ f("a", {
										href: t,
										target: "_blank",
										rel: "noopener noreferrer",
										className: `${q.tb} ${q.syndLink}`,
										title: r.label,
										"aria-label": r.label,
										dangerouslySetInnerHTML: { __html: nc[r.icon] || nc.globe }
									}, e) : null;
								})
							]
						}),
						/* @__PURE__ */ f("div", { className: q.toolbarSpacer }),
						/* @__PURE__ */ p("div", {
							className: q.windowControls,
							"data-reader-window": !0,
							children: [
								/* @__PURE__ */ f("button", {
									className: q.tb,
									onClick: () => window.dispatchEvent(new CustomEvent("postpipe:toggle-settings", { detail: { where: "reader" } })),
									title: "Reading settings",
									"aria-label": "Reading settings",
									"data-reader-settings": !0,
									children: /* @__PURE__ */ f(pc, {
										body: (0, gc.iconBody)("sliders-horizontal"),
										size: 17
									})
								}),
								/* @__PURE__ */ f("button", {
									className: `${q.tb} ${q.growBtn} ${A ? q.active : ""}`,
									onClick: () => j((e) => !e),
									"aria-pressed": A,
									title: A ? "Narrower" : "Wider",
									"aria-label": A ? "Narrower" : "Wider",
									"data-reader-grow": !0,
									children: /* @__PURE__ */ f(pc, {
										body: (0, gc.iconBody)("move-horizontal"),
										size: 17
									})
								}),
								/* @__PURE__ */ f("button", {
									className: `${q.tb} ${M ? q.active : ""}`,
									onClick: () => {
										N((e) => !e), x(null);
									},
									"aria-pressed": M,
									title: M ? "Back to the side" : "Fill the window",
									"aria-label": M ? "Back to the side" : "Fill the window",
									"data-reader-expand": !0,
									children: /* @__PURE__ */ f(pc, {
										body: (0, gc.iconBody)(M ? "minimize-2" : "maximize-2"),
										size: 17
									})
								}),
								/* @__PURE__ */ f("button", {
									className: q.tb,
									onClick: () => y(!0),
									title: "Minimise the reader",
									"aria-label": "Minimise the reader",
									"data-reader-minimise": !0,
									children: /* @__PURE__ */ f(pc, {
										body: (0, gc.iconBody)("minus"),
										size: 17
									})
								})
							]
						})
					]
				}),
				/* @__PURE__ */ f("button", {
					className: q.closeX,
					onClick: t,
					title: "Close the reader",
					"aria-label": "Close the reader",
					"data-reader-close": !0,
					children: /* @__PURE__ */ f(pc, {
						body: (0, gc.iconBody)("x"),
						size: 20
					})
				}),
				S && /* @__PURE__ */ f(Kc, {
					article: e,
					settings: n
				}),
				w && (0, sc.bookmarksList)(n) && /* @__PURE__ */ f(fc, {
					viewState: i,
					feedData: l,
					itemId: ae
				}),
				/* @__PURE__ */ p("div", {
					className: `${q.body} ${Ce ? q.following : ""} ${ee ? q["turnOut_" + ee] : ""} ${ne ? q["turnIn_" + ne] : ""}`,
					"data-tts-target": !0,
					"data-follow-along": Ce ? "on" : "off",
					ref: L,
					onScroll: ge,
					children: [
						Me("top"),
						/* @__PURE__ */ p("div", {
							className: q.articleHeader,
							children: [
								Ie.kicker && /* @__PURE__ */ f("div", {
									className: q.articleKicker,
									children: Ie.kicker
								}),
								/* @__PURE__ */ f("h1", {
									className: q.articleTitle,
									children: e.title || e.label
								}),
								Ie.byline && /* @__PURE__ */ p("div", {
									className: q.articleByline,
									children: ["by ", Fe ? /* @__PURE__ */ f("a", {
										href: Fe,
										target: "_blank",
										rel: "noopener noreferrer",
										children: Pe
									}) : Pe]
								}),
								Ne.length > 0 && /* @__PURE__ */ f("div", {
									className: q.articleMeta,
									children: Ne.join(" · ")
								}),
								e.kind && e.kind !== "essay" && /* @__PURE__ */ p("div", {
									className: q.articleMeta,
									style: {
										marginTop: 4,
										opacity: .7
									},
									children: ["substrate: ", e.kind]
								})
							]
						}),
						/* @__PURE__ */ f("div", {
							ref: R,
							"data-reader-text": !0,
							dangerouslySetInnerHTML: ce
						}),
						E && Me("bottom"),
						ze && E && /* @__PURE__ */ f("footer", {
							className: q.rightsLine,
							"data-reader-rights": !0,
							children: ze
						}),
						h && E && e._posted !== "title" && /* @__PURE__ */ f(Rc, {
							article: e,
							contributions: m || [],
							config: h,
							feedData: l,
							textRef: R,
							textKey: H,
							onOpenChapter: (e) => Ee(e, "next")
						})
					]
				})
			]
		}),
		v && e && /* @__PURE__ */ p("div", {
			className: q.restorePill,
			onClick: () => y(!1),
			title: "Bring reading window back",
			children: [
				/* @__PURE__ */ f("span", {
					className: q.pillIcon,
					children: /* @__PURE__ */ f(pc, {
						body: (0, gc.iconBody)("bookmark"),
						size: 18
					})
				}),
				/* @__PURE__ */ p("span", {
					className: q.pillLabel,
					children: [/* @__PURE__ */ f("span", {
						className: q.pillTitle,
						children: e.title || e.label
					}), /* @__PURE__ */ p("span", {
						className: q.pillAuthor,
						children: ["by ", Pe]
					})]
				}),
				/* @__PURE__ */ f("span", {
					className: q.pillAction,
					children: "Restore"
				})
			]
		})
	] });
}
function Hc(e) {
	return String(e).replace(/[&<>"']/g, (e) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;"
	})[e]);
}
function Uc(e, t) {
	let n = t || `This substrate ("${e.kind || "unknown"}") is not yet renderable in the viewer.`, r = "<div style=\"padding:24px;border:1px dashed var(--rp-border);border-radius:6px;background:rgba(17,24,39,0.4);\">";
	r += `<p style="color:var(--rp-accent);font-weight:600;margin-bottom:8px;">${n}</p>`, e.todos && e.todos.length && (r += `<p style="color:#f39c12;font-size:13px;">Pending: ${e.todos.join(", ")}</p>`);
	let i = (e.url || e.id || "").split("/").pop().replace(".html", ""), a = e._source?.path || `chapters/${i}`;
	return r += `<p style="color:#888;font-size:13px;margin-top:12px;">The bundle exists at <code>${a}</code>.</p>`, r += "</div>", r;
}
function Wc(e) {
	let t = e.forms && e.forms.companions || [];
	if (!t.length) return "";
	let n = "<div style=\"margin-top:32px;padding-top:24px;border-top:1px solid var(--rp-border);\">";
	return n += "<div style=\"color:var(--rp-accent);font-size:11px;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;\">also exists as</div>", n += `<div style="color:var(--rp-text);font-size:14px;">${t.map((e) => `<span class="${q.fmTag}">${e}</span>`).join(" ")}</div>`, n += "</div>", n;
}
function Gc(e) {
	let t = [];
	if (e.seed && t.push(["seed", e.seed]), e.tldr && t.push(["tldr", e.tldr]), e.topology && e.topology.length && t.push(["topology", e.topology.join(" · ")]), e.energy && t.push(["energy", e.energy]), e.note && t.push(["note", e.note]), !t.length) return "";
	let n = "<div style=\"margin-top:32px;padding:20px;background:rgba(17,24,39,0.4);border-radius:6px;\">";
	for (let [e, r] of t) n += `<div class="${q.fmRow}"><span class="${q.fmLabel}">${e}</span><span class="${q.fmValue}">${r}</span></div>`;
	return n += "</div>", n;
}
function Kc({ article: e, settings: n }) {
	let r = n?.frontmatter_display || [], i = !1, a = r.map((n) => {
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
				e.tags && e.tags.length && (r = /* @__PURE__ */ f(d, { children: e.tags.map((e) => /* @__PURE__ */ f("span", {
					className: q.fmTag,
					children: e
				}, e)) }));
				break;
			case "series":
				r = e.series || "";
				break;
			case "license":
				r = e.license || "";
				break;
			case "syndication":
				let n = e.syndication || {}, i = Object.entries(n).filter(([, e]) => e);
				i.length && (r = /* @__PURE__ */ f(d, { children: i.map(([e, n], r) => /* @__PURE__ */ p(t.Fragment, { children: [/* @__PURE__ */ f("a", {
					className: q.fmSyndLink,
					href: n,
					target: "_blank",
					rel: "noopener noreferrer",
					children: e
				}), r < i.length - 1 ? " · " : ""] }, e)) }));
				break;
			default: break;
		}
		return r ? (i = !0, /* @__PURE__ */ p("div", {
			className: q.fmRow,
			children: [/* @__PURE__ */ f("span", {
				className: q.fmLabel,
				children: n.replace(/_/g, " ")
			}), /* @__PURE__ */ f("span", {
				className: q.fmValue,
				children: r
			})]
		}, n)) : null;
	});
	return /* @__PURE__ */ f("div", {
		className: `${q.frontmatterPanel} ${q.open}`,
		children: i ? a : /* @__PURE__ */ f("div", {
			className: q.fmRow,
			children: /* @__PURE__ */ f("span", {
				className: q.fmValue,
				style: { color: "#666" },
				children: "No metadata available."
			})
		})
	});
}
var Y = {
	ttsGroup: "_ttsGroup_lceyk_7",
	tb: "_tb_lceyk_19",
	tbTooltip: "_tbTooltip_lceyk_46",
	select: "_select_lceyk_68",
	params: "_params_lceyk_85",
	loadingBarContainer: "_loadingBarContainer_lceyk_133",
	loadingBarFill: "_loadingBarFill_lceyk_145",
	visualizer: "_visualizer_lceyk_151",
	bar: "_bar_lceyk_161",
	bounce: "_bounce_lceyk_1",
	errorToast: "_errorToast_lceyk_183",
	show: "_show_lceyk_198",
	statusBadge: "_statusBadge_lceyk_202",
	pulse: "_pulse_lceyk_1",
	error: "_error_lceyk_183",
	ttsSettings: "_ttsSettings_lceyk_226",
	settingRow: "_settingRow_lceyk_235",
	paramValue: "_paramValue_lceyk_264"
};
//#endregion
//#region src/components/TTS/TTS.jsx
function qc() {
	let [e, t] = c(null), [n, i] = c("stopped"), [a, o] = c([]), [s, l] = c(""), [u, d] = c([]), [f, p] = c(""), [m, h] = c({}), [g, _] = c({}), [v, y] = c(0), [b, x] = c(""), [S, C] = c(null), [w, T] = c(!1);
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
				let r = e.get("voice");
				(!r || t.length && !t.some((e) => e.id === r)) && (r = n.voice.default || t[0] && t[0].id), r && (e.set("voice", r), p(r));
			} else r[i] = e.get(i) === void 0 ? n[i].default : e.get(i);
			_(r);
		};
		return e.on("state", n), e.on("capabilitiesChanged", u), e.on("engineProgress", r), e.on("loadingProgress", a), e.on("error", s), c(), u(), window.speechSynthesis && window.speechSynthesis.addEventListener("voiceschanged", u), () => {
			e.off && (e.off("state", n), e.off("capabilitiesChanged", u), e.off("engineProgress", r), e.off("loadingProgress", a), e.off("error", s)), window.speechSynthesis && window.speechSynthesis.removeEventListener("voiceschanged", u);
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
		handleEngineChange: (t) => {
			if (!e) return;
			let n = t.target.value;
			e.select(n), l(n), C(null), T(!1), d(e.voices()), h(e.capabilities());
		},
		handleVoiceChange: (t) => {
			if (!e) return;
			let n = t.target.value;
			e.set("voice", n), p(n);
		},
		handleParamChange: (t, n) => {
			e && (e.set(t, n), _((e) => ({
				...e,
				[t]: n
			})));
		}
	};
}
function Jc({ targetRef: e }) {
	let { T: t, state: n, engineProgress: r, errorMsg: i, statusMessage: a, isError: o, setStatusMessage: s, setIsError: c } = qc();
	return t ? /* @__PURE__ */ p("div", {
		className: Y.ttsGroup,
		style: { position: "relative" },
		children: [
			n !== "playing" && /* @__PURE__ */ f("button", {
				className: Y.tb,
				onClick: () => {
					!t || !e.current || (s(null), c(!1), t.play(e.current, { scrollContainer: e.current }));
				},
				title: "Play",
				dangerouslySetInnerHTML: { __html: `${nc.play}<span class="${Y.tbTooltip}">Play</span>` }
			}),
			n === "playing" && /* @__PURE__ */ f("button", {
				className: Y.tb,
				onClick: () => {
					t && t.pause();
				},
				title: "Pause",
				dangerouslySetInnerHTML: { __html: `${nc.pause}<span class="${Y.tbTooltip}">Pause</span>` }
			}),
			(n === "playing" || n === "paused" || n === "loading") && /* @__PURE__ */ f("button", {
				className: Y.tb,
				onClick: () => {
					t && t.stop();
				},
				title: "Stop",
				dangerouslySetInnerHTML: { __html: `${nc.stop}<span class="${Y.tbTooltip}">Stop</span>` }
			}),
			n === "loading" && r > 0 && /* @__PURE__ */ f("div", {
				className: Y.loadingBarContainer,
				children: /* @__PURE__ */ f("div", {
					className: Y.loadingBarFill,
					style: { width: `${r}%` }
				})
			}),
			n === "playing" && /* @__PURE__ */ p("div", {
				className: Y.visualizer,
				children: [
					/* @__PURE__ */ f("div", { className: Y.bar }),
					/* @__PURE__ */ f("div", { className: Y.bar }),
					/* @__PURE__ */ f("div", { className: Y.bar }),
					/* @__PURE__ */ f("div", { className: Y.bar })
				]
			}),
			/* @__PURE__ */ f("div", {
				className: `${Y.errorToast} ${i ? Y.show : ""}`,
				children: i
			}),
			a && /* @__PURE__ */ f("span", {
				className: `${Y.statusBadge} ${o ? Y.error : ""}`,
				children: a
			})
		]
	}) : null;
}
function Yc() {
	let { T: e, engines: t, selectedEngine: n, voices: r, selectedVoice: i, capabilities: a, params: o, handleEngineChange: s, handleVoiceChange: c, handleParamChange: l } = qc();
	if (!e) return null;
	let u = typeof window < "u" && window.PPVoices && window.TTS_CONFIG ? window.PPVoices.languageName(window.TTS_CONFIG.lang || "en") : "English", d = typeof window < "u" && window.speechSynthesis && window.speechSynthesis.getVoices().length > 0;
	return /* @__PURE__ */ p("div", {
		className: Y.ttsSettings,
		"data-tts-settings": !0,
		children: [
			t.length > 1 && /* @__PURE__ */ f("select", {
				className: Y.select,
				style: { maxWidth: 110 },
				value: n,
				onChange: s,
				title: "TTS Engine",
				children: t.map((e) => /* @__PURE__ */ f("option", {
					value: e.id,
					children: e.label
				}, e.id))
			}),
			/* @__PURE__ */ p("label", {
				className: Y.settingRow,
				children: [/* @__PURE__ */ f("span", { children: "Voice" }), /* @__PURE__ */ f("select", {
					className: Y.select,
					value: i,
					onChange: c,
					title: `Voices on this device for ${u}`,
					"data-tts-voice": !0,
					children: r.length ? r.map((e) => /* @__PURE__ */ f("option", {
						value: e.id,
						children: e.label
					}, e.id)) : /* @__PURE__ */ f("option", { children: d ? `No ${u} voice on this device` : "Loading..." })
				})]
			}),
			/* @__PURE__ */ f("div", {
				className: Y.params,
				children: Object.entries(a).map(([e, t]) => !t || e === "voice" || e === "pitch" || e === "volume" ? null : t.type === "range" ? /* @__PURE__ */ p("label", {
					className: Y.settingRow,
					title: `${t.label}: ${o[e]}`,
					children: [/* @__PURE__ */ p("span", { children: [
						t.label,
						" ",
						/* @__PURE__ */ p("span", {
							className: Y.paramValue,
							children: [Number(o[e] ?? t.default).toFixed(1), "×"]
						})
					] }), /* @__PURE__ */ f("input", {
						"data-tts-param": e,
						type: "range",
						min: t.min,
						max: t.max,
						step: t.step || .1,
						value: o[e] ?? t.default,
						onChange: (t) => l(e, parseFloat(t.target.value))
					})]
				}, e) : t.type === "select" ? /* @__PURE__ */ p("label", {
					className: Y.settingRow,
					children: [/* @__PURE__ */ f("span", { children: t.label }), /* @__PURE__ */ f("select", {
						value: o[e] ?? t.default,
						onChange: (t) => l(e, t.target.value),
						children: t.options.map((e) => /* @__PURE__ */ f("option", {
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
	bar: "_bar_5m33t_6",
	pill: "_pill_5m33t_20",
	title: "_title_5m33t_61",
	count: "_count_5m33t_62",
	pagePill: "_pagePill_5m33t_84",
	pillIcon: "_pillIcon_5m33t_95",
	iconOnly: "_iconOnly_5m33t_100",
	subscribe: "_subscribe_5m33t_110",
	pillOn: "_pillOn_5m33t_118",
	subscribeSheet: "_subscribeSheet_5m33t_122",
	subscribeForm: "_subscribeForm_5m33t_144",
	subscribeInput: "_subscribeInput_5m33t_150",
	subscribeSubmit: "_subscribeSubmit_5m33t_163",
	subscribeMessage: "_subscribeMessage_5m33t_181",
	subscribeOk: "_subscribeOk_5m33t_192",
	subscribeError: "_subscribeError_5m33t_196",
	pageLabel: "_pageLabel_5m33t_205",
	hidden: "_hidden_5m33t_219",
	failed: "_failed_5m33t_227",
	dot: "_dot_5m33t_227",
	dotWrap: "_dotWrap_5m33t_236",
	dotActive: "_dotActive_5m33t_272",
	ringBackdrop: "_ringBackdrop_5m33t_277",
	ring: "_ring_5m33t_277",
	swatch: "_swatch_5m33t_293",
	swatchCurrent: "_swatchCurrent_5m33t_313",
	addPill: "_addPill_5m33t_334",
	plus: "_plus_5m33t_340",
	addOpen: "_addOpen_5m33t_351",
	addInput: "_addInput_5m33t_358",
	addClose: "_addClose_5m33t_375",
	addSubmit: "_addSubmit_5m33t_391",
	ready: "_ready_5m33t_412",
	resultPanel: "_resultPanel_5m33t_423",
	resultClose: "_resultClose_5m33t_445",
	resultTitle: "_resultTitle_5m33t_460",
	resultUrl: "_resultUrl_5m33t_467",
	resultSection: "_resultSection_5m33t_476",
	resultLabel: "_resultLabel_5m33t_483",
	resultBox: "_resultBox_5m33t_492",
	code: "_code_5m33t_502",
	codeInline: "_codeInline_5m33t_512",
	copyBtn: "_copyBtn_5m33t_521",
	copied: "_copied_5m33t_538",
	resultHint: "_resultHint_5m33t_544",
	intro: "_intro_5m33t_555"
}, Xc = (/* @__PURE__ */ m(((e, t) => {
	var { siteIcon: n } = mc(), r = (e) => typeof e == "string" ? e.trim() : "";
	function i(e) {
		let t = r(e);
		return t ? /^(https?:|mailto:)/i.test(t) ? t : /^[a-z][a-z0-9+.-]*:/i.test(t) ? "" : t : "";
	}
	function a(e) {
		let t = e && e.topBar && typeof e.topBar == "object" ? e.topBar : {};
		return {
			pages: (Array.isArray(t.pages) ? t.pages : []).filter((e) => e && typeof e == "object" && r(e.id)).map((e) => {
				let t = n(e.icon);
				return {
					id: r(e.id),
					label: r(e.label) || r(e.id),
					hideFromGraph: e.hideFromGraph === !0,
					icon: t,
					showLabel: !t || e.showLabel !== !1
				};
			}),
			links: (Array.isArray(t.links) ? t.links : []).filter((e) => e && typeof e == "object" && i(e.href) && (r(e.label) || r(e.id))).map((e, t) => {
				let a = n(e.icon), o = r(e.label) || r(e.id);
				return {
					id: r(e.id) || `link-${t + 1}`,
					label: o,
					href: i(e.href),
					icon: a,
					newTab: e.newTab === !0,
					showLabel: !a || e.showLabel === !0
				};
			}),
			subscribe: s(t.subscribe),
			addFeed: t.addFeed !== !1,
			showSourcePills: t.showSourcePills !== !1
		};
	}
	var o = {
		method: "POST",
		field: "email",
		label: "Subscribe",
		placeholder: "Email address",
		thanks: "Thank you.",
		error: "Something went wrong. Please try again."
	};
	function s(e) {
		if (!e || typeof e != "object") return null;
		let t = i(e.action);
		if (!t || /^mailto:/i.test(t)) return null;
		let a = r(e.method).toUpperCase();
		return {
			action: t,
			method: /^(POST|PUT|PATCH)$/.test(a) ? a : o.method,
			field: r(e.field) || o.field,
			label: r(e.label) || o.label,
			icon: n(e.icon),
			placeholder: r(e.placeholder) || o.placeholder,
			thanks: r(e.thanks) || o.thanks,
			error: r(e.error) || o.error,
			newTab: e.newTab === !0
		};
	}
	function c(e, t, n) {
		return t >= 200 && t < 300 ? {
			ok: !0,
			message: e.thanks
		} : {
			ok: !1,
			message: (n && typeof n == "object" && typeof n.error == "string" ? n.error.trim() : "") || e.error
		};
	}
	async function l(e, t, n) {
		let r = n || (typeof fetch < "u" ? fetch : null);
		if (!e || !r) return {
			ok: !1,
			message: e && e.error || o.error
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
		return c(e, i.status, a);
	}
	var u = (e) => String(e && (e.url || e.id) || "").split("/").pop().replace(/\.html$/, "");
	function d(e, t) {
		let n = e || [];
		return n.find((e) => e && e.id === t) || n.find((e) => e && u(e) === t) || null;
	}
	function f(e, t) {
		return (e && e.pages || []).map((e) => ({
			...e,
			item: d(t, e.id)
		})).filter((e) => e.item);
	}
	function p(e, t) {
		if (!e) return e;
		let n = new Set(f(t, e.items).filter((e) => e.hideFromGraph).map((e) => e.item.id));
		if (!n.size) return e;
		let r = new Set((e.items || []).filter((e) => n.has(e.id)).map((e) => e.url).filter(Boolean)), i = (e) => n.has(e) || r.has(e);
		return {
			...e,
			items: (e.items || []).filter((e) => !n.has(e.id)),
			edges: (e.edges || []).filter((e) => !i(e.source) && !i(e.target))
		};
	}
	t.exports = {
		topBarConfig: a,
		findItem: d,
		resolvePages: f,
		graphFeed: p,
		slugOf: u,
		safeHref: i,
		subscribeConfig: s,
		subscribeResult: c,
		subscribe: l
	};
})))();
function Zc({ config: e }) {
	let [t, n] = c(!1), [a, o] = c(""), [l, u] = c(!1), [d, m] = c(null), h = s(null), g = s(null), _ = s(null), v = s(null), y = (e) => {
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
	}, [t]), /* @__PURE__ */ p("div", {
		ref: h,
		className: X.subscribe,
		"data-top-subscribe-wrap": !0,
		children: [/* @__PURE__ */ f("button", {
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
				m(null), n((e) => !e);
			},
			children: e.icon ? /* @__PURE__ */ f(pc, {
				body: e.icon,
				size: 15,
				className: X.pillIcon
			}) : /* @__PURE__ */ f("span", {
				className: X.title,
				children: e.label
			})
		}), t && /* @__PURE__ */ p("div", {
			ref: _,
			className: X.subscribeSheet,
			role: "dialog",
			"aria-label": e.label,
			"data-top-subscribe-sheet": !0,
			children: [/* @__PURE__ */ p("form", {
				className: X.subscribeForm,
				onSubmit: async (t) => {
					if (e.newTab || (t.preventDefault(), l)) return;
					u(!0), m(null);
					let n = await (0, Xc.subscribe)(e, a);
					u(!1), m(n), n.ok && o("");
				},
				...e.newTab ? {
					action: e.action,
					method: "post",
					target: "_blank",
					rel: "noopener"
				} : {},
				children: [/* @__PURE__ */ f("input", {
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
				}), /* @__PURE__ */ f("button", {
					type: "submit",
					className: X.subscribeSubmit,
					disabled: l,
					"data-top-subscribe-submit": !0,
					children: e.label
				})]
			}), /* @__PURE__ */ f("p", {
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
//#region src/components/FeedZ/FeedZ.jsx
function Qc({ sources: e, hiddenSources: t, onToggleSource: n, viewState: a, showCount: o = !0, pages: c = [], onOpenPage: l, links: u = [], subscribe: d = null, showAddButton: m = !0, intro: h = "", controls: g = null, showSources: _ = !0 }) {
	let v = s(null), y = Array.isArray(c) && c.length > 0, b = Array.isArray(u) && u.length > 0, x = !!g;
	if (i(() => {
		x && v.current && tl(v.current);
	}), r(() => {
		if (!x) return;
		let e = () => {
			v.current && tl(v.current);
		};
		return window.addEventListener("resize", e), typeof document < "u" && document.fonts && document.fonts.ready && document.fonts.ready.then(e), () => window.removeEventListener("resize", e);
	}, [x]), _ === !1 && (e = []), (!e || e.length === 0) && !y && !b && !d && !h && !g) return null;
	let S = t || /* @__PURE__ */ new Set();
	return /* @__PURE__ */ p("div", {
		ref: v,
		className: X.bar,
		"data-feeds": !0,
		children: [
			(e || []).map((e) => /* @__PURE__ */ f(nl, {
				source: e,
				hidden: S.has(e.id),
				onToggle: () => n && n(e.id),
				viewState: a,
				showCount: o
			}, e.id)),
			y && c.map((e) => /* @__PURE__ */ p("button", {
				type: "button",
				className: `${X.pill} ${X.pagePill} ${e.icon && !e.showLabel ? X.iconOnly : ""}`,
				"data-top-pages": !0,
				"data-top-page": e.id,
				"data-has-icon": e.icon ? "" : void 0,
				"aria-label": e.icon ? e.label : void 0,
				title: e.item && e.item.title ? e.item.title : e.label,
				onClick: () => l && l(e.item),
				children: [e.icon && /* @__PURE__ */ f(pc, {
					body: e.icon,
					size: 15,
					className: X.pillIcon
				}), e.showLabel !== !1 && /* @__PURE__ */ f("span", {
					className: `${X.title} ${X.pageLabel}`,
					children: e.label
				})]
			}, e.id)),
			b && u.map((e) => /* @__PURE__ */ p("a", {
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
				children: [e.icon && /* @__PURE__ */ f(pc, {
					body: e.icon,
					size: 15,
					className: X.pillIcon
				}), e.showLabel && /* @__PURE__ */ f("span", {
					className: `${X.title} ${X.pageLabel}`,
					children: e.label
				})]
			}, e.id)),
			d && /* @__PURE__ */ f(Zc, { config: d }),
			m !== !1 && /* @__PURE__ */ f(ol, {}),
			g,
			h && /* @__PURE__ */ f("div", {
				className: X.intro,
				"data-graph-intro": !0,
				dangerouslySetInnerHTML: { __html: h }
			})
		]
	});
}
function $c(e) {
	return [...e.children].filter((e) => {
		if (e.matches("[data-graph-intro]")) return !1;
		let t = getComputedStyle(e).position;
		return t !== "fixed" && t !== "absolute" && e.getBoundingClientRect().width > 0;
	});
}
function el(e) {
	let t = $c(e);
	if (t.length < 2) return !1;
	let n = t[0].getBoundingClientRect().top;
	return t.some((e) => Math.abs(e.getBoundingClientRect().top - n) > 2);
}
function tl(e) {
	let t = ["data-fit-dots", "data-fit-icons"], n = e.querySelector("[data-source-pill]");
	for (let n of [...t, "data-fit-title"]) e.removeAttribute(n);
	n && (n.style.maxWidth = "");
	for (let n of t) {
		if (!el(e)) return;
		e.setAttribute(n, "");
	}
	if (!el(e) || !n) return;
	e.setAttribute("data-fit-title", "");
	let r = $c(e), i = parseFloat(getComputedStyle(e).columnGap) || 0, a = r.reduce((e, t) => e + t.getBoundingClientRect().width, 0) + i * (r.length - 1) - e.clientWidth, o = n.getBoundingClientRect().width;
	n.style.maxWidth = `${Math.max(34, Math.floor(o - a - 1))}px`;
}
function nl({ source: e, hidden: t, onToggle: n, viewState: r, showCount: i }) {
	let a = e.title || e.id, o = e.ok !== !1, s = r && r.sourceColor(e.id) || e.color;
	return /* @__PURE__ */ p("div", {
		className: `${X.pill} ${t ? X.hidden : ""} ${o ? "" : X.failed}`,
		"data-source-pill": !0,
		onClick: n,
		onKeyDown: (e) => {
			(e.key === "Enter" || e.key === " ") && (e.preventDefault(), n());
		},
		role: "button",
		tabIndex: 0,
		title: t ? `Show ${a}` : `Hide ${a}`,
		style: { "--pill-color": s },
		children: [
			/* @__PURE__ */ f(al, {
				color: s,
				sourceId: e.id,
				viewState: r
			}),
			/* @__PURE__ */ f("span", {
				className: X.title,
				children: a
			}),
			i && /* @__PURE__ */ f("span", {
				className: X.count,
				children: e.itemCount
			})
		]
	});
}
var rl = [
	"#e74c3c",
	"#e67e22",
	"#f1c40f",
	"#2ecc71",
	"#1abc9c",
	"#3498db",
	"#9b59b6",
	"#e84393"
], il = 650;
function al({ color: e, sourceId: t, viewState: n }) {
	let [i, a] = c(!1), o = s(null);
	r(() => () => {
		o.current && clearTimeout(o.current);
	}, []);
	let l = (e) => {
		e.stopPropagation(), a(!0);
	}, u = (e) => {
		e && e.stopPropagation(), a(!1);
	}, m = () => {
		o.current = setTimeout(() => a(!0), il);
	}, h = () => {
		o.current &&= (clearTimeout(o.current), null);
	}, g = (e, r) => {
		r.stopPropagation(), n && n.setSourceColor(t, e), a(!1);
	}, _ = rl.length;
	return /* @__PURE__ */ p("span", {
		className: X.dotWrap,
		onMouseEnter: m,
		onMouseLeave: h,
		onClick: l,
		onTouchEnd: l,
		children: [/* @__PURE__ */ f("span", {
			className: `${X.dot} ${i ? X.dotActive : ""}`,
			"aria-hidden": "true"
		}), i && /* @__PURE__ */ p(d, { children: [/* @__PURE__ */ f("span", {
			className: X.ringBackdrop,
			onClick: u,
			onTouchEnd: u
		}), /* @__PURE__ */ f("span", {
			className: X.ring,
			children: rl.map((t, n) => {
				let r = (_ === 1 ? 15 : 15 + n / (_ - 1) * 150) * Math.PI / 180, i = 30 * Math.cos(r), a = 30 * Math.sin(r);
				return /* @__PURE__ */ f("button", {
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
function ol() {
	let [e, t] = c(!1), [n, i] = c(""), [a, o] = c(null), l = s(null);
	r(() => {
		e && l.current && l.current.focus();
	}, [e]);
	let u = cl(n), m = (e) => {
		e && e.preventDefault(), u && (o(n.trim()), i(""), t(!1));
	}, h = () => {
		i(""), t(!1);
	};
	return /* @__PURE__ */ p(d, { children: [e ? /* @__PURE__ */ p("form", {
		className: `${X.pill} ${X.addOpen}`,
		onSubmit: m,
		children: [
			/* @__PURE__ */ f("input", {
				ref: l,
				type: "url",
				placeholder: "paste a feed URL…",
				className: X.addInput,
				value: n,
				onChange: (e) => i(e.target.value),
				onKeyDown: (e) => {
					e.key === "Escape" && h();
				}
			}),
			/* @__PURE__ */ f("button", {
				type: "button",
				className: X.addClose,
				onClick: h,
				title: "Cancel",
				"aria-label": "Cancel",
				children: "×"
			}),
			/* @__PURE__ */ f("button", {
				type: "submit",
				className: `${X.addSubmit} ${u ? X.ready : ""}`,
				disabled: !u,
				title: u ? "Continue" : "Enter a URL first",
				"aria-label": "Add feed",
				children: "+"
			})
		]
	}) : /* @__PURE__ */ f("button", {
		className: `${X.pill} ${X.addPill}`,
		onClick: () => t(!0),
		title: "Add a feed",
		children: /* @__PURE__ */ f("span", {
			className: X.plus,
			children: "+"
		})
	}), a && /* @__PURE__ */ f(sl, {
		url: a,
		onDismiss: () => o(null)
	})] });
}
function sl({ url: e, onDismiss: t }) {
	let [n, r] = c(""), i = ul(e), a = `node add-feed.js ${ll(e)}`, o = async (e, t) => {
		try {
			await navigator.clipboard.writeText(e), r(t), setTimeout(() => r((e) => e === t ? "" : e), 1500);
		} catch {}
	};
	return /* @__PURE__ */ p("div", {
		className: X.resultPanel,
		children: [
			/* @__PURE__ */ f("button", {
				className: X.resultClose,
				onClick: t,
				title: "Dismiss",
				"aria-label": "Dismiss",
				children: "×"
			}),
			/* @__PURE__ */ f("div", {
				className: X.resultTitle,
				children: "Add this feed"
			}),
			/* @__PURE__ */ f("div", {
				className: X.resultUrl,
				title: e,
				children: e
			}),
			/* @__PURE__ */ p("div", {
				className: X.resultSection,
				children: [
					/* @__PURE__ */ f("div", {
						className: X.resultLabel,
						children: "One-step (recommended)"
					}),
					/* @__PURE__ */ p("div", {
						className: X.resultBox,
						children: [/* @__PURE__ */ f("code", {
							className: X.code,
							children: a
						}), /* @__PURE__ */ f("button", {
							className: `${X.copyBtn} ${n === "cli" ? X.copied : ""}`,
							onClick: () => o(a, "cli"),
							children: n === "cli" ? "Copied" : "Copy"
						})]
					}),
					/* @__PURE__ */ f("div", {
						className: X.resultHint,
						children: "Paste in your terminal — it appends to feeds.opml and rebuilds. Then refresh this page."
					})
				]
			}),
			/* @__PURE__ */ p("div", {
				className: X.resultSection,
				children: [
					/* @__PURE__ */ f("div", {
						className: X.resultLabel,
						children: "Or add manually"
					}),
					/* @__PURE__ */ p("div", {
						className: X.resultBox,
						children: [/* @__PURE__ */ f("code", {
							className: X.code,
							children: i
						}), /* @__PURE__ */ f("button", {
							className: `${X.copyBtn} ${n === "opml" ? X.copied : ""}`,
							onClick: () => o(i, "opml"),
							children: n === "opml" ? "Copied" : "Copy"
						})]
					}),
					/* @__PURE__ */ p("div", {
						className: X.resultHint,
						children: [
							"Paste before ",
							/* @__PURE__ */ f("code", {
								className: X.codeInline,
								children: "</body>"
							}),
							" ",
							"in feeds.opml, then run ",
							/* @__PURE__ */ f("code", {
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
function cl(e) {
	let t = (e || "").trim();
	if (!t) return !1;
	try {
		let e = new URL(t);
		return e.protocol === "http:" || e.protocol === "https:";
	} catch {
		return !1;
	}
}
function ll(e) {
	return `'${String(e).replace(/'/g, "'\\''")}'`;
}
function ul(e) {
	let t = e.replace(/"/g, "&quot;");
	return `<outline text="${dl(e)}" title="${dl(e)}" xmlUrl="${t}"/>`;
}
function dl(e) {
	try {
		return new URL(e).hostname.replace(/^www\./, "");
	} catch {
		return e;
	}
}
var Z = {
	gearBtn: "_gearBtn_1fjvk_17",
	backdrop: "_backdrop_1fjvk_51",
	drawer: "_drawer_1fjvk_58",
	ppSlideIn: "_ppSlideIn_1fjvk_1",
	header: "_header_1fjvk_86",
	title: "_title_1fjvk_100",
	subject: "_subject_1fjvk_105",
	closeBtn: "_closeBtn_1fjvk_115",
	section: "_section_1fjvk_129",
	sectionTitle: "_sectionTitle_1fjvk_138",
	rowLabel: "_rowLabel_1fjvk_147",
	choiceRow: "_choiceRow_1fjvk_153",
	choices: "_choices_1fjvk_161",
	choiceBtn: "_choiceBtn_1fjvk_167",
	fontBtn: "_fontBtn_1fjvk_168",
	resetBtn: "_resetBtn_1fjvk_169",
	markActions: "_markActions_1fjvk_170",
	presetBtn: "_presetBtn_1fjvk_171",
	fontRow: "_fontRow_1fjvk_184",
	aidOn: "_aidOn_1fjvk_194",
	hint: "_hint_1fjvk_199",
	hintLink: "_hintLink_1fjvk_205",
	legend: "_legend_1fjvk_209",
	aidList: "_aidList_1fjvk_217",
	aidBtn: "_aidBtn_1fjvk_223",
	aidLabel: "_aidLabel_1fjvk_239",
	aidState: "_aidState_1fjvk_247",
	aidHint: "_aidHint_1fjvk_257",
	subjectBlock: "_subjectBlock_1fjvk_264",
	subjectTitle: "_subjectTitle_1fjvk_273",
	markItem: "_markItem_1fjvk_278",
	markMain: "_markMain_1fjvk_286",
	markTitle: "_markTitle_1fjvk_291",
	markNote: "_markNote_1fjvk_296",
	noteInput: "_noteInput_1fjvk_308",
	noMarks: "_noMarks_1fjvk_333",
	presetRow: "_presetRow_1fjvk_339",
	presetActive: "_presetActive_1fjvk_352",
	presetSwatches: "_presetSwatches_1fjvk_357",
	miniSwatch: "_miniSwatch_1fjvk_362",
	paletteSwatch: "_paletteSwatch_1fjvk_371",
	presetLabel: "_presetLabel_1fjvk_382",
	fieldList: "_fieldList_1fjvk_387",
	fieldRow: "_fieldRow_1fjvk_393",
	fieldLabel: "_fieldLabel_1fjvk_400",
	colorInput: "_colorInput_1fjvk_405",
	hexLabel: "_hexLabel_1fjvk_415",
	forgetBlock: "_forgetBlock_1fjvk_429",
	forgetConfirm: "_forgetConfirm_1fjvk_430"
}, fl = /* @__PURE__ */ m(((e, t) => {
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
	function i(e, t, r) {
		let i = (n[e] || n.default).modes;
		return t && i.includes(t) ? t : i.length === 1 ? i[0] : r ? "dark" : "light";
	}
	t.exports = {
		THEMES: n,
		themeName: r,
		themeMode: i
	};
})), pl = /* @__PURE__ */ m(((e, t) => {
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
	}, { reachConfig: m, backdropConfig: h, backdropOpacity: g } = vs(), _ = (e, t) => e !== "" && e != null && Number.isFinite(Number(e)) ? Number(e) : t, v = (e) => typeof e == "string" ? e : "", y = (e) => Math.max(0, Math.min(1, e)), b = (e) => typeof e == "string" && e.trim() && !/[;{}<>]/.test(e) ? e.trim() : "", x = (e, t, n) => n === 1 ? t : e + (t - e) * n, S = (e) => {
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
	function R(e, t, n) {
		return e ? t == null ? 0 : Math.max(0, Math.min(1, (n - t) / L)) : 1;
	}
	function z(e, { stored: t, hash: n } = {}) {
		return !e || typeof n == "string" && n.startsWith("#read=") ? "graph" : e.startOn === "art" || e.startOn === "graph" ? e.startOn : a.includes(t) ? t : "art";
	}
	function B(e, { vw: t, vh: r, art: i, bottom: a = 0, zoom: o = null, controls: s = 0, ink: c = null, perPx: l = null } = {}, u = 0) {
		let d = y(u), f = p, m = Math.max(1, i && i.w || 1), h = Math.max(1, i && i.h || 1), v = e && e.byline && e.byline.text ? f.bylineSpace : 0, b = Math.min(f.pad, r * .03), C = Math.max(b, a), w = e && e.top || null, T = e && e.topBarInArt === !1 ? 0 : Math.max(0, s), E = y(_(c && c.art, 0)), D = c && Number.isFinite(c.graph) ? y(c.graph) : null, O = w && w.art !== null ? T + w.art : null, k = Math.max(1, r - (O === null ? b : O) - C - v), A = O === null ? h : h * Math.max(.05, 1 - E), j = e && e.graph || n.graph, M = e && e.backdrop || n.backdrop, N = Math.max(.01, Math.min(k / A, (t - 2 * b) / m)), P = (t - m * N) / 2, F = e && Number.isFinite(e.crownY) ? e.crownY : 1;
		if (e && e.fit === "width") {
			let n = c && c.bush || {
				l: 0,
				r: 1
			}, i = (t - 2 * Math.min(_(e.sideMargin, 0), t * .25)) / (Math.max(.01, n.r - n.l) * m), a = O === null ? b : O, o = (r - C - a) / (Math.max(.05, F - E) * h);
			N = Math.max(.01, Math.min(i, o)), P = t / 2 - (n.l + n.r) / 2 * m * N;
		}
		let I = O === null ? b + Math.max(0, (k - h * N) / 2) : O - E * h * N, L = N, R = P;
		if (j.rootsFit === "width") {
			let e = c && c.roots || {
				l: 0,
				r: 1
			}, n = t / (Math.max(.01, e.r - e.l) * m), i = Math.max(0, s) + (w && w.graph !== null ? w.graph : 0), a = c && Number.isFinite(c.bottom) ? y(c.bottom) : 1, o = Math.max(0, _(j.footRoom, 0)), l = (r - C - o - i) / (Math.max(.05, a - (D === null ? 0 : D)) * h);
			L = Math.max(.01, Math.min(n, l)), R = t / 2 - (e.l + e.r) / 2 * m * L;
		}
		let z = w && w.graph !== null && D !== null ? Math.min(I - 1, Math.max(0, s) + w.graph - D * h * L) : -j.artOffset * (h * L), B = x(N, L, d), te = m * B, ne = h * B, re = x(I, z, d), ie = x(P, R, d), V = S((d - f.graphFrom) / (1 - f.graphFrom));
		return {
			p: d,
			vw: t,
			vh: r,
			art: {
				top: re,
				left: ie,
				width: te,
				height: ne,
				scale: B,
				opacity: 1
			},
			roots: x(1, o ? g(M, o.k, o.homeK) : M.opacity, d),
			fade: {
				art: 1 - d,
				graph: d
			},
			artTop0: I,
			artTop1: z,
			travel: Math.max(1, I - z),
			graph: {
				opacity: V,
				shift: (1 - V) * f.rise * r
			},
			layer: {
				opacity: x(_(j.artStateOpacity, n.graph.artStateOpacity), 1, d),
				follow: re - z
			},
			ground: 1 - d,
			byline: ee(e, {
				left: ie,
				top: re,
				width: te,
				height: ne
			}, d, l, {
				x: t / 2,
				y: re + ne + (v - f.bylineSize * 1.3) / 2,
				size: f.bylineSize,
				opacity: y(1 - d * 2.5),
				align: "center",
				under: "art"
			})
		};
	}
	function ee(e, t, n, r, i) {
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
	var te = (e) => 1 - (1 - e) ** 3, ne = (e) => e < .5 ? 4 * e * e * e : 1 - (-2 * e + 2) ** 3 / 2;
	function re(e, { start: t = "art", reducedMotion: r = !1, travel: i = 600, now: o = () => Date.now(), frame: s = (e) => setTimeout(() => e(), 16), cancelFrame: c = (e) => clearTimeout(e), setTimer: l = setTimeout, clearTimer: u = clearTimeout, onChange: d = () => {}, onRest: f = () => {} } = {}) {
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
		function j(e, { ease: t = te } = {}) {
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
			return a.includes(e) ? t ? (A(e), !0) : g === e && h === E(e) && !v ? !1 : (j(e, { ease: ne }), !0) : !1;
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
		function R(e, t = o()) {
			if (!w) return !1;
			let n = w.lastY - e, i = Math.max(1, t - w.lastT);
			return w.v = n / i * .6 + .4 * w.v, w.lastY = e, w.lastT = t, w.total += n, r || O(w.p + (w.y - e) / T), !0;
		}
		function z(e = o()) {
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
		function B(e) {
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
			touchMove: R,
			touchEnd: z,
			key: B,
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
	function ie(e) {
		return !e || e.altKey || e.ctrlKey || e.metaKey ? null : e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " || e.key === "Spacebar") && !e.shiftKey ? "down" : e.key === "ArrowUp" || e.key === "PageUp" ? "up" : null;
	}
	t.exports = {
		REVEAL_MS: L,
		revealFactor: R,
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
		startState: z,
		coverGeometry: B,
		createCover: re,
		pageKey: ie
	};
})), ml = /* @__PURE__ */ m(((e, t) => {
	var { openingConfig: n } = pl(), r = [
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
})), hl = /* @__PURE__ */ m(((e, t) => {
	var n = [
		"auto",
		"day",
		"week",
		"month",
		"year"
	], r = [
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
	], i = "Reset: layout, zoom, rotation, open and closed containers, and selection, back to how the site starts (Undo brings the arrangement back)";
	function a(e, t) {
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
	var o = (e) => !!(e && e.on && (e.dimension === "chronology" || e.dimension === "commits"));
	function s(e, t) {
		let n = e && e.dimension || "time";
		return e && e.on && n === t ? { on: !1 } : {
			on: !0,
			dimension: t
		};
	}
	function c(e) {
		return n[(n.indexOf(e || "auto") + 1) % n.length];
	}
	function l({ dimensions: e = [], layers: t = [], axis: n = {}, preferences: r = {}, show: i = {}, group: a = "dimensions" }) {
		let s = [], c = n.dimension || "time";
		if (i.dimensions !== !1) {
			for (let t of e) s.push({
				kind: "dimension",
				id: t.id,
				label: t.label,
				title: t.title,
				checked: !!n.on && c === t.id
			});
			for (let e of t) s.push({
				kind: "layer",
				id: e.id,
				label: e.label,
				title: e.title,
				checked: r[e.id] === !0
			});
			o(n) && s.push({
				kind: "granularity",
				value: n.granularity || "auto"
			});
		}
		return {
			heading: a,
			rows: s
		};
	}
	function u(e, t, n) {
		if (!n) return null;
		let r = Number.isInteger(e) && e >= 0 ? e : -1;
		return t === "ArrowDown" ? (r + 1) % n : t === "ArrowUp" ? r <= 0 ? n - 1 : r - 1 : t === "Home" ? 0 : t === "End" ? n - 1 : null;
	}
	t.exports = {
		GRANULARITIES: n,
		VIEW_ACTIONS: r,
		RESET_TITLE: i,
		toolbarConfig: a,
		hasGranularity: o,
		toggleDimension: s,
		nextGranularity: c,
		menuModel: l,
		menuMove: u
	};
})), gl = /* @__PURE__ */ m(((e, t) => {
	function n(e) {
		if (!e || !Array.isArray(e.items)) return null;
		let t = e.containers || [], n = (e) => t.some((t) => t.parent && t.tag && (e.tags || []).includes(t.tag)), r = /* @__PURE__ */ new Set(), i = new Set(e.items.map((e) => e.id));
		for (let t of e.items) n(t) || r.add(t._status === "published" ? "published" : "draft");
		for (let t of e.edges || []) t.layer === "tag" ? r.add("tag") : t.layer === "topology" ? r.add("topology") : t.layer === "authored" && !i.has(t.target) && r.add("placeholder");
		return r;
	}
	t.exports = { colorKeysInUse: n };
})), _l = fl(), vl = ml(), yl = hl(), bl = gl(), xl = {
	draft: "#555555",
	published: "#2ecc71",
	tag: "#f39c12",
	topology: "#9b59b6",
	placeholder: "#7f8c8d"
};
function Sl() {
	let e = typeof window < "u" && window.SETTINGS && window.SETTINGS.theme || {};
	return {
		...xl,
		...e.node_draft ? { draft: e.node_draft } : {},
		...e.node_published ? { published: e.node_published } : {},
		...e.tag_color ? { tag: e.tag_color } : {}
	};
}
var Cl = Sl(), wl = [
	{
		id: "default",
		label: "Default",
		colors: Cl
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
], Tl = [
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
], El = [
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
function Dl({ on: e, onChange: t, label: n, hint: r, ...i }) {
	return /* @__PURE__ */ p("button", {
		className: `${Z.aidBtn} ${e ? Z.aidOn : ""}`,
		role: "switch",
		"aria-checked": e,
		onClick: () => t(!e),
		...i,
		children: [/* @__PURE__ */ p("span", {
			className: Z.aidLabel,
			children: [n, /* @__PURE__ */ f("span", {
				className: Z.aidState,
				children: e ? "on" : "off"
			})]
		}), r && /* @__PURE__ */ f("span", {
			className: Z.aidHint,
			children: r
		})]
	});
}
function Ol({ viewState: e, aid: t, label: n, hint: r }) {
	return /* @__PURE__ */ f(Dl, {
		on: !!(e.readerAid && e.readerAid(t)),
		label: n,
		hint: r,
		"data-aid": t,
		onChange: (n) => e.setReaderAid && e.setReaderAid(t, n)
	});
}
function kl({ label: e, options: t, value: n, onChange: r, name: i }) {
	return /* @__PURE__ */ p("div", {
		className: Z.choiceRow,
		role: "radiogroup",
		"aria-label": e,
		"data-choice": i,
		children: [/* @__PURE__ */ f("span", {
			className: Z.rowLabel,
			children: e
		}), /* @__PURE__ */ f("span", {
			className: Z.choices,
			children: t.map((e) => /* @__PURE__ */ f("button", {
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
function Al({ id: e, title: t, children: n }) {
	return /* @__PURE__ */ p("section", {
		className: Z.section,
		"data-section": e,
		"aria-labelledby": `pp-settings-${e}`,
		children: [/* @__PURE__ */ f("h2", {
			className: Z.sectionTitle,
			id: `pp-settings-${e}`,
			children: t
		}), n]
	});
}
var jl = (e) => window.dispatchEvent(new CustomEvent(e));
function Ml(e) {
	return (e && e.graph && typeof e.graph.containersName == "string" ? e.graph.containersName.trim() : "") || "containers";
}
function Nl({ className: e, size: t = 15, ...n }) {
	let [i, a] = c(!1);
	return r(() => {
		let e = (e) => a(!!(e.detail && e.detail.where === "graph" && e.detail.open));
		return window.addEventListener("postpipe:settings-state", e), () => window.removeEventListener("postpipe:settings-state", e);
	}, []), /* @__PURE__ */ f("button", {
		type: "button",
		className: e,
		onClick: () => window.dispatchEvent(new CustomEvent("postpipe:toggle-settings", { detail: { where: "graph" } })),
		title: "Things to change",
		"aria-label": "Things to change",
		"aria-expanded": i,
		...n,
		children: /* @__PURE__ */ f(pc, {
			body: (0, gc.iconBody)("sliders-horizontal"),
			size: t
		})
	});
}
function Pl({ viewState: e, feedData: t, subject: n, readerOpen: i, where: a = "graph", ownButton: o }) {
	let l = (0, vl.whereOf)(a), [u, m] = c(!1), [h, g] = c(!1), [, _] = c(0), v = s(null), y = s(null), b = typeof window < "u" ? window.SETTINGS : null;
	if (r(() => {
		if (e) return e.subscribe(() => _((e) => e + 1));
	}, [e]), r(() => {
		if (typeof document > "u" || !e || l !== "reader") return;
		let t = e.paragraphIndent ? e.paragraphIndent() : !1, n = e.paragraphSpace ? e.paragraphSpace() : !0, r = document.documentElement;
		r.setAttribute("data-pp-indent", t ? "on" : "off"), r.setAttribute("data-pp-space", n ? "on" : "off"), r.removeAttribute("data-pp-paragraph"), r.setAttribute("data-pp-font", e.readerAid ? e.readerAid("font") : "default"), r.setAttribute("data-pp-size", e.readerAid ? e.readerAid("size") : "m");
	}), r(() => {
		let e = (e) => {
			let t = e && e.detail || {};
			if ((0, vl.whereOf)(t.where) !== l) {
				m(!1);
				return;
			}
			y.current = t.section || null, m((e) => t.open ? !0 : !e);
		};
		return window.addEventListener("postpipe:toggle-settings", e), () => window.removeEventListener("postpipe:toggle-settings", e);
	}, [l]), r(() => {
		if (window.dispatchEvent(new CustomEvent("postpipe:settings-state", { detail: {
			where: l,
			open: u
		} })), !u) return;
		let e = (e) => {
			e.key === "Escape" && (e.stopImmediatePropagation(), m(!1));
		};
		if (window.addEventListener("keydown", e, !0), g(!1), y.current && v.current) {
			let e = v.current.querySelector(`[data-section="${y.current}"]`);
			e && (v.current.scrollTop = e.offsetTop - 8), y.current = null;
		}
		return () => window.removeEventListener("keydown", e, !0);
	}, [u]), !e) return null;
	let x = o === void 0 ? l === "graph" && (0, yl.toolbarConfig)(b).position !== "top" : o, S = (0, sc.readerFonts)(b), C = e.readerAid ? e.readerAid("font") : "default", w = e.readerAid ? e.readerAid("size") : "m", T = {
		...Cl,
		...e.graphColors()
	}, E = e.colorProfileId(), D = (0, bl.colorKeysInUse)((0, Xc.graphFeed)(t, (0, Xc.topBarConfig)(b))), O = D ? Tl.filter((e) => D.has(e.key)) : Tl, k = !!(t && Array.isArray(t.containers) && t.containers.length), A = typeof window < "u" && !!window.TTS, j = t && t.items || [], M = j.length === 0 || j.some((e) => !(0, Hs.isLinkItem)(e)), N = (0, _l.themeName)(b, e.preference("theme")), P = _l.THEMES[N].modes, F = e.preference("mode"), I = (0, vl.panelGroups)(l, {
		settings: b,
		readable: M,
		voice: A,
		modes: P.length
	}), L = (0, yl.toolbarConfig)(b), R = Ml(b), z = (0, Ds.nodePalettesOf)(b && b.graph), B = (z.find((t) => t.id === e.preference("nodePalette")) || z[0] || {}).id, ee = P.length > 1 && /* @__PURE__ */ f(kl, {
		label: l === "reader" ? "Light or dark" : "Mode",
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
		value: F && P.includes(F) ? F : "auto",
		onChange: (t) => e.setPreference("mode", t === "auto" ? null : t)
	}), te = {
		look: () => /* @__PURE__ */ p(d, { children: [
			/* @__PURE__ */ f(kl, {
				label: "Theme",
				name: "theme",
				options: Object.values(_l.THEMES).map((e) => ({
					id: e.id,
					label: e.label
				})),
				value: N,
				onChange: (t) => e.setPreference("theme", t === (0, _l.themeName)(b, null) ? null : t)
			}),
			!(0, vl.modeInReader)(b) && ee,
			(0, Bs.config)(b) && /* @__PURE__ */ f(Dl, {
				on: e.preference("timeOfDay") !== !1,
				onChange: (t) => e.setPreference("timeOfDay", t ? null : !1),
				label: "narrative time of day background",
				"data-pref": "timeOfDay"
			}),
			z.length >= 2 && /* @__PURE__ */ p("div", {
				className: Z.choiceRow,
				role: "radiogroup",
				"aria-label": "node colour",
				"data-choice": "nodePalette",
				children: [/* @__PURE__ */ f("span", {
					className: Z.rowLabel,
					children: "node colour"
				}), /* @__PURE__ */ f("span", {
					className: Z.choices,
					children: z.map((t, n) => /* @__PURE__ */ p("button", {
						role: "radio",
						"aria-checked": B === t.id,
						title: t.label,
						"data-value": t.id,
						className: `${Z.choiceBtn} ${B === t.id ? Z.aidOn : ""}`,
						onClick: () => e.setPreference("nodePalette", n === 0 ? null : t.id),
						children: [/* @__PURE__ */ f("span", {
							className: Z.paletteSwatch,
							"data-palette-swatch": t.id,
							"aria-hidden": "true",
							style: {
								borderColor: t.color,
								background: t.fillOpacity === null ? t.color : `color-mix(in srgb, ${t.color} ${Math.round(t.fillOpacity * 100)}%, transparent)`
							}
						}), t.label]
					}, t.id))
				})]
			}),
			O.length > 0 && /* @__PURE__ */ p(d, { children: [
				/* @__PURE__ */ f("div", {
					className: Z.rowLabel,
					children: "Colors"
				}),
				/* @__PURE__ */ f("div", {
					className: Z.presetRow,
					children: wl.map((t) => /* @__PURE__ */ p("button", {
						className: `${Z.presetBtn} ${E === t.id ? Z.presetActive : ""}`,
						onClick: () => e.applyColorProfile(t.id, t.colors),
						title: t.label,
						children: [/* @__PURE__ */ f("span", {
							className: Z.presetSwatches,
							children: O.map((e) => /* @__PURE__ */ f("span", {
								className: Z.miniSwatch,
								style: { background: t.colors[e.key] }
							}, e.key))
						}), /* @__PURE__ */ f("span", {
							className: Z.presetLabel,
							children: t.label
						})]
					}, t.id))
				}),
				/* @__PURE__ */ f("div", {
					className: Z.fieldList,
					children: O.map((t) => /* @__PURE__ */ p("label", {
						className: Z.fieldRow,
						children: [
							/* @__PURE__ */ f("span", {
								className: Z.fieldLabel,
								children: t.label
							}),
							/* @__PURE__ */ f("input", {
								type: "color",
								className: Z.colorInput,
								value: T[t.key],
								onChange: (n) => e.setGraphColor(t.key, n.target.value)
							}),
							/* @__PURE__ */ f("span", {
								className: Z.hexLabel,
								children: T[t.key]
							})
						]
					}, t.key))
				})
			] })
		] }),
		view: () => /* @__PURE__ */ p(d, { children: [/* @__PURE__ */ p("span", {
			className: Z.choices,
			"data-view-actions": !0,
			children: [
				/* @__PURE__ */ f("button", {
					className: Z.choiceBtn,
					"data-view-action": "graph:zoom-to-fit",
					title: "Every node on the screen, zoomed about its middle",
					onClick: () => jl("graph:zoom-to-fit"),
					children: "Zoom to fit"
				}),
				k && /* @__PURE__ */ p(d, { children: [/* @__PURE__ */ p("button", {
					className: Z.choiceBtn,
					"data-view-action": "graph:close-all-containers",
					onClick: () => jl("graph:close-all-containers"),
					children: ["Close all ", R]
				}), /* @__PURE__ */ p("button", {
					className: Z.choiceBtn,
					"data-view-action": "graph:open-all-containers",
					onClick: () => jl("graph:open-all-containers"),
					children: ["Open all ", R]
				})] }),
				yl.VIEW_ACTIONS.filter((e) => e.event !== "graph:zoom-to-fit").map((e) => /* @__PURE__ */ f("button", {
					className: Z.choiceBtn,
					"data-view-action": e.event,
					title: e.title,
					onClick: () => jl(e.event),
					children: e.label
				}, e.event))
			]
		}), L.show.layout && /* @__PURE__ */ f(kl, {
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
		})] }),
		memory: () => /* @__PURE__ */ p(d, { children: [/* @__PURE__ */ f("button", {
			className: Z.resetBtn,
			"data-settings-reset": !0,
			title: "Layout, zoom, rotation, open and closed containers, selection and colors, back to how the site starts",
			onClick: () => {
				m(!1), O.length && e.applyColorProfile("default", Cl), jl("graph:reset-all");
			},
			children: "Reset the view"
		}), /* @__PURE__ */ p("div", {
			className: Z.forgetBlock,
			"data-forget": !0,
			children: [/* @__PURE__ */ f("div", {
				className: Z.hint,
				"data-forget-note": !0,
				children: "What you open, arrange, choose, mark and read here is kept on this device only. Reset the view keeps your bookmarks and progress; Forget removes all of it."
			}), h ? /* @__PURE__ */ p("div", {
				className: Z.forgetConfirm,
				role: "group",
				"aria-label": "Confirm forgetting",
				"data-forget-confirm": !0,
				children: [/* @__PURE__ */ f("div", {
					className: Z.hint,
					children: "Remove your bookmarks and notes, reading progress, open cards, positions, and every choice made here, from this device? This can't be undone."
				}), /* @__PURE__ */ p("span", {
					className: Z.choices,
					children: [/* @__PURE__ */ f("button", {
						className: Z.resetBtn,
						"data-forget-yes": !0,
						onClick: async () => {
							g(!1), m(!1), e.forget && await e.forget(), window.dispatchEvent(new CustomEvent("postpipe:forgotten"));
						},
						children: "Forget"
					}), /* @__PURE__ */ f("button", {
						className: Z.choiceBtn,
						"data-forget-no": !0,
						onClick: () => g(!1),
						children: "Keep it"
					})]
				})]
			}) : /* @__PURE__ */ f("button", {
				className: Z.resetBtn,
				"data-forget-ask": !0,
				onClick: () => g(!0),
				children: "Forget my usage on this site"
			})]
		})] }),
		reading: () => /* @__PURE__ */ p(d, { children: [
			/* @__PURE__ */ f("div", {
				className: Z.fontRow,
				role: "radiogroup",
				"aria-label": "Font",
				children: S.map((t) => /* @__PURE__ */ f("button", {
					role: "radio",
					"aria-checked": C === t.id,
					"data-font": t.id,
					className: `${Z.fontBtn} ${C === t.id ? Z.aidOn : ""}`,
					style: { fontFamily: t.family },
					onClick: () => e.setReaderAid && e.setReaderAid("font", t.id),
					children: t.label
				}, t.id))
			}),
			S.filter((e) => e.license).map((e) => /* @__PURE__ */ p("div", {
				className: Z.hint,
				children: [
					e.label,
					" is under the ",
					/* @__PURE__ */ f("a", {
						className: Z.hintLink,
						href: `./fonts/${e.license}`,
						target: "_blank",
						rel: "noopener",
						children: e.licenseName
					}),
					"."
				]
			}, e.id)),
			/* @__PURE__ */ f(kl, {
				label: "Size",
				name: "size",
				options: El,
				value: w,
				onChange: (t) => e.setReaderAid("size", t)
			}),
			/* @__PURE__ */ p("div", {
				className: Z.choiceRow,
				children: [/* @__PURE__ */ f("span", {
					className: Z.rowLabel,
					children: "Paragraphs"
				}), /* @__PURE__ */ p("span", {
					className: Z.choices,
					children: [/* @__PURE__ */ f("button", {
						className: `${Z.choiceBtn} ${e.paragraphIndent() ? Z.aidOn : ""}`,
						"aria-pressed": e.paragraphIndent(),
						onClick: () => e.setParagraphIndent(!e.paragraphIndent()),
						children: "Indent first line"
					}), /* @__PURE__ */ f("button", {
						className: `${Z.choiceBtn} ${e.paragraphSpace() ? Z.aidOn : ""}`,
						"aria-pressed": e.paragraphSpace(),
						onClick: () => e.setParagraphSpace(!e.paragraphSpace()),
						children: "Space between"
					})]
				})]
			}),
			/* @__PURE__ */ p("div", {
				className: Z.aidList,
				children: [/* @__PURE__ */ f(Ol, {
					viewState: e,
					aid: "followAlong",
					label: "Highlighter: follow along",
					hint: "Tap or drag through the text to mark the sentence and word you are on."
				}), /* @__PURE__ */ f(Ol, {
					viewState: e,
					aid: "boldStart",
					label: "Bold word beginnings",
					hint: "The first part of each word is bold, to lead the eye. The text itself is unchanged."
				})]
			})
		] }),
		paper: () => ee,
		listening: () => /* @__PURE__ */ p(d, { children: [/* @__PURE__ */ f(Yc, {}), /* @__PURE__ */ f("div", {
			className: Z.hint,
			children: "Play and pause are in the reader."
		})] })
	};
	return /* @__PURE__ */ p(d, { children: [x && /* @__PURE__ */ f(Nl, {
		className: Z.gearBtn,
		size: 18,
		"aria-expanded": u,
		"data-settings-gear": !0
	}), u && /* @__PURE__ */ p(d, { children: [/* @__PURE__ */ f("div", {
		className: Z.backdrop,
		onClick: () => m(!1)
	}), /* @__PURE__ */ p("aside", {
		className: Z.drawer,
		role: "dialog",
		"aria-label": (0, vl.panelTitle)(b, l),
		ref: v,
		"data-settings-panel": l,
		children: [/* @__PURE__ */ p("div", {
			className: Z.header,
			children: [
				/* @__PURE__ */ f("span", {
					className: Z.title,
					children: (0, vl.panelTitle)(b, l)
				}),
				l === "reader" && n && /* @__PURE__ */ f("span", {
					className: Z.subject,
					"data-settings-subject": !0,
					children: n.title
				}),
				/* @__PURE__ */ f("button", {
					className: Z.closeBtn,
					onClick: () => m(!1),
					"aria-label": "Close",
					children: /* @__PURE__ */ f(pc, {
						body: (0, gc.iconBody)("x"),
						size: 18
					})
				})
			]
		}), I.map((e) => /* @__PURE__ */ f(Al, {
			id: e.id,
			title: e.title,
			children: te[e.id]()
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
}, Fl = {
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
}, Il = [
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
], Ll = [
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
], Rl = [
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
function zl({ config: e, onUpdate: t, onReset: i, visible: a = !0 }) {
	let [o, l] = c(!1), [u, m] = c(null), [h, g] = c(!1), _ = s(null), v = s(null), y = s(null), b = (e) => {
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
		...Fl,
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
		let t = Hl(e);
		navigator.clipboard.writeText(t).then(() => {
			m("Copied to clipboard"), setTimeout(() => m(null), 1800);
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
				t(JSON.parse(e.target.result)), m("Config imported"), setTimeout(() => m(null), 1800);
			} catch {
				m("Invalid JSON"), setTimeout(() => m(null), 2500);
			}
		}, r.readAsText(n), e.target.value = "";
	}, [t]);
	return a ? /* @__PURE__ */ p(d, { children: [
		/* @__PURE__ */ f("button", {
			className: `${Q.triggerBtn} ${o ? Q.open : ""}`,
			onClick: () => l((e) => !e),
			title: "Configure viewer",
			"aria-label": "Configure viewer",
			children: "⚡"
		}),
		o && /* @__PURE__ */ p(d, { children: [/* @__PURE__ */ f("div", {
			className: Q.backdrop,
			onClick: () => l(!1)
		}), /* @__PURE__ */ p("div", {
			className: Q.panel,
			role: "dialog",
			"aria-label": "Viewer Configuration",
			ref: y,
			onTouchStart: b,
			onTouchMove: x,
			onTouchEnd: S,
			children: [
				/* @__PURE__ */ p("div", {
					className: Q.header,
					children: [/* @__PURE__ */ f("span", {
						className: Q.panelTitle,
						children: "Viewer Configuration"
					}), /* @__PURE__ */ f("button", {
						className: Q.closeBtn,
						onClick: () => l(!1),
						"aria-label": "Close",
						children: "×"
					})]
				}),
				/* @__PURE__ */ p("div", {
					className: Q.section,
					children: [/* @__PURE__ */ f("div", {
						className: Q.sectionTitle,
						children: "Features"
					}), Il.map((e) => /* @__PURE__ */ f(Bl, {
						label: e.label,
						sub: e.sub,
						checked: C[e.key],
						onChange: (t) => T(e.key, t)
					}, e.key))]
				}),
				/* @__PURE__ */ p("div", {
					className: Q.section,
					children: [
						/* @__PURE__ */ f("div", {
							className: Q.sectionTitle,
							children: "Data"
						}),
						/* @__PURE__ */ f("div", {
							className: Q.textInputRow,
							children: /* @__PURE__ */ f("input", {
								type: "url",
								className: Q.textInput,
								placeholder: "Feed URL (default: ./feed.json)",
								value: e.feed || "",
								onChange: (e) => O(e.target.value)
							})
						}),
						/* @__PURE__ */ p("div", {
							className: Q.selectRow,
							children: [/* @__PURE__ */ f("span", {
								className: Q.toggleLabel,
								children: "Persistence"
							}), /* @__PURE__ */ f("select", {
								className: Q.select,
								value: e.persistence || "localStorage",
								onChange: (e) => D(e.target.value),
								children: Rl.map((e) => /* @__PURE__ */ f("option", {
									value: e.value,
									children: e.label
								}, e.value))
							})]
						})
					]
				}),
				/* @__PURE__ */ p("div", {
					className: Q.section,
					children: [/* @__PURE__ */ f("div", {
						className: Q.sectionTitle,
						children: "Theme"
					}), Ll.map((e) => /* @__PURE__ */ p("div", {
						className: Q.colorRow,
						children: [
							/* @__PURE__ */ f("span", {
								className: Q.colorLabel,
								children: e.label
							}),
							/* @__PURE__ */ f("input", {
								type: "color",
								className: Q.colorInput,
								value: w[e.key] || Vl(e.key),
								onChange: (t) => E(e.key, t.target.value)
							}),
							/* @__PURE__ */ f("span", {
								className: Q.colorHex,
								children: w[e.key] || Vl(e.key)
							})
						]
					}, e.key))]
				}),
				/* @__PURE__ */ p("div", {
					className: Q.section,
					children: [
						/* @__PURE__ */ f("div", {
							className: Q.sectionTitle,
							children: "Actions"
						}),
						/* @__PURE__ */ p("div", {
							className: Q.actions,
							children: [
								/* @__PURE__ */ f("button", {
									className: Q.actionBtnAccent,
									onClick: k,
									children: "Export Config"
								}),
								/* @__PURE__ */ f("button", {
									className: Q.actionBtn,
									onClick: A,
									children: "Import Config"
								}),
								/* @__PURE__ */ f("button", {
									className: Q.actionBtnDanger,
									onClick: i,
									children: "Reset All"
								})
							]
						}),
						/* @__PURE__ */ f("input", {
							ref: _,
							type: "file",
							accept: ".json",
							style: { display: "none" },
							onChange: j
						}),
						h && /* @__PURE__ */ f("div", {
							className: Q.snippet,
							children: /* @__PURE__ */ f("code", {
								className: Q.snippetCode,
								children: Hl(e)
							})
						}),
						!h && /* @__PURE__ */ f("button", {
							className: Q.actionBtn,
							onClick: () => g(!0),
							style: {
								marginTop: "6px",
								width: "100%"
							},
							children: "Show Embed Snippet"
						}),
						h && /* @__PURE__ */ f("button", {
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
		u && /* @__PURE__ */ f("div", {
			className: Q.toast,
			children: u
		})
	] }) : null;
}
function Bl({ label: e, sub: t, checked: n, onChange: r }) {
	return /* @__PURE__ */ p("div", {
		className: Q.toggleRow,
		children: [/* @__PURE__ */ p("span", {
			className: Q.toggleLabel,
			children: [e, t && /* @__PURE__ */ f("span", {
				className: Q.toggleSub,
				children: t
			})]
		}), /* @__PURE__ */ p("label", {
			className: Q.switch,
			children: [/* @__PURE__ */ f("input", {
				type: "checkbox",
				className: Q.switchInput,
				checked: n,
				onChange: (e) => r(e.target.checked)
			}), /* @__PURE__ */ f("span", { className: Q.switchTrack })]
		})]
	});
}
function Vl(e) {
	return {
		bg: "#1a1a2e",
		surface: "#0a0e1a",
		accent: "#64ffda",
		text: "#a8b2d1",
		text_bright: "#ccd6f6"
	}[e] || "#888888";
}
function Hl(e) {
	let t = {};
	if (e.feed && e.feed !== "./feed.json" && (t.feed = e.feed), e.persistence && e.persistence !== "localStorage" && (t.persistence = e.persistence), e.features) {
		let n = {};
		for (let [t, r] of Object.entries(e.features)) r !== Fl[t] && (n[t] = r);
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
var Ul = {
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
}, Wl = [
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
function Gl(e) {
	return (e.url || e.id || "").split("/").pop().replace(".html", "");
}
function Kl({ feedData: e, onFilterChange: t }) {
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
			let o = Gl(e);
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
				monthName: Wl[n],
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
	return /* @__PURE__ */ p("div", {
		className: Ul.timeOverlay,
		children: [/* @__PURE__ */ p("div", {
			className: Ul.header,
			children: [/* @__PURE__ */ p("div", {
				className: Ul.titleGroup,
				children: [/* @__PURE__ */ f("span", {
					className: Ul.title,
					children: "Chronology"
				}), /* @__PURE__ */ f("span", {
					className: Ul.rangeBadge,
					children: i.minYear === i.maxYear ? i.minYear : `${i.minYear}–${i.maxYear}`
				})]
			}), n && /* @__PURE__ */ f("button", {
				className: Ul.clearBtn,
				onClick: () => {
					r(null), t && t(null, null);
				},
				title: "Show all posts",
				children: "Reset"
			})]
		}), /* @__PURE__ */ f("div", {
			className: Ul.stackScroll,
			children: i.months.map((e, t) => {
				let r = n === e.key, a = e.articleSlugs.length === 0, c = i.months[t - 1], l = !c || c.year !== e.year;
				return /* @__PURE__ */ p("div", {
					className: `${Ul.monthBox} ${a ? Ul.emptyMonth : ""} ${r ? Ul.activeMonth : ""}`,
					children: [/* @__PURE__ */ p("div", {
						className: Ul.monthHeader,
						onClick: () => o(e),
						title: a ? "No articles published this month" : `Filter to ${e.monthName} ${e.year} (${e.articleSlugs.length})`,
						children: [/* @__PURE__ */ p("div", {
							className: Ul.monthName,
							children: [e.monthName, l && /* @__PURE__ */ f("span", {
								className: Ul.yearTag,
								children: e.year
							})]
						}), /* @__PURE__ */ f("div", {
							className: `${Ul.monthMeta} ${e.articleSlugs.length > 0 ? Ul.hasItems : ""}`,
							children: e.articleSlugs.length > 0 ? `${e.articleSlugs.length} post${e.articleSlugs.length > 1 ? "s" : ""}` : "0 posts"
						})]
					}), /* @__PURE__ */ p("div", {
						className: Ul.branchArea,
						children: [/* @__PURE__ */ f("div", { className: Ul.branchLine }), /* @__PURE__ */ f("div", {
							className: Ul.weeksRow,
							children: e.weeks.map((t) => {
								let r = t.articleSlugs.length, i = n === t.id;
								return /* @__PURE__ */ p("div", {
									className: `${Ul.weekPill} ${r > 0 ? Ul.hasContent : ""} ${i ? Ul.activeWeek : ""}`,
									onClick: (n) => s(n, t, e),
									title: r > 0 ? `${t.label}: ${r} post${r > 1 ? "s" : ""}` : `${t.label}: empty`,
									children: [/* @__PURE__ */ f("span", { children: t.label }), r > 0 && /* @__PURE__ */ f("span", {
										className: Ul.weekBadge,
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
	bar: "_bar_1auuo_4",
	group: "_group_1auuo_17",
	spacer: "_spacer_1auuo_31",
	label: "_label_1auuo_36",
	seg: "_seg_1auuo_44",
	icon: "_icon_1auuo_45",
	action: "_action_1auuo_46",
	on: "_on_1auuo_75",
	moreMark: "_moreMark_1auuo_89",
	backdrop: "_backdrop_1auuo_96",
	sheet: "_sheet_1auuo_103",
	sectionTitle: "_sectionTitle_1auuo_124",
	wrapRow: "_wrapRow_1auuo_132",
	narrowOnly: "_narrowOnly_1auuo_146",
	wideOnly: "_wideOnly_1auuo_151",
	moreText: "_moreText_1auuo_170",
	more: "_more_1auuo_89",
	layer: "_layer_1auuo_191",
	top: "_top_1auuo_197",
	topIcon: "_topIcon_1auuo_215",
	menu: "_menu_1auuo_253",
	menuHeading: "_menuHeading_1auuo_276",
	menuItem: "_menuItem_1auuo_284",
	menuCheck: "_menuCheck_1auuo_308",
	menuSeg: "_menuSeg_1auuo_324",
	menuDivider: "_menuDivider_1auuo_336",
	menuLayout: "_menuLayout_1auuo_342"
}, ql = (/* @__PURE__ */ m(((e, t) => {
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
})))(), Jl = [{
	id: "force",
	label: "cluster",
	title: "Cluster: each container its own path"
}, {
	id: "radial",
	label: "ring",
	title: "Ring: each container its own ring"
}], Yl = (e) => window.dispatchEvent(new CustomEvent(e));
function Xl({ viewState: e, show: t = {}, layouts: n = Jl, settings: r, layers: i = [], placement: a = "bottom" }) {
	return f(a === "top" ? Ql : Zl, {
		viewState: e,
		show: t,
		layouts: n,
		settings: r,
		layers: i
	});
}
function Zl({ viewState: e, show: t, layouts: n, settings: i, layers: a }) {
	let s = i || (typeof window < "u" ? window.SETTINGS : null), l = (0, ql.dimensionLabels)(s), u = (0, ql.dimensionGroupLabel)(s), m = u.charAt(0).toUpperCase() + u.slice(1), h = (0, ql.layerLabels)(s).filter((e) => a.includes(e.id)), [, g] = o((e) => e + 1, 0), [_, v] = c(!1);
	if (r(() => e ? e.subscribe(g) : void 0, [e]), r(() => {
		if (!_) return;
		let e = (e) => {
			e.key === "Escape" && v(!1);
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [_]), !e) return null;
	let y = t.history !== !1, b = t.layout !== !1, x = t.dimensions !== !1, S = e.state.layout, C = e.timeAxis(), w = C.dimension || "time", T = (t) => e.setTimeAxis((0, yl.toggleDimension)(C, t)), E = () => e.setTimeAxis({ granularity: (0, yl.nextGranularity)(C.granularity) }), D = (0, yl.hasGranularity)(C), O = /* @__PURE__ */ p(d, { children: [
		l.map((e) => {
			let t = C.on && w === e.id;
			return /* @__PURE__ */ f("button", {
				className: `${$.seg} ${t ? $.on : ""}`,
				"aria-pressed": t,
				title: e.title,
				onClick: () => T(e.id),
				children: e.label
			}, e.id);
		}),
		h.map((t) => {
			let n = e.preference(t.id) === !0;
			return /* @__PURE__ */ f("button", {
				className: `${$.seg} ${$.layer} ${n ? $.on : ""}`,
				"aria-pressed": n,
				title: t.title,
				"data-dimension": t.id,
				onClick: () => e.setPreference(t.id, n ? null : !0),
				children: t.label
			}, t.id);
		}),
		D && /* @__PURE__ */ p("button", {
			className: $.seg,
			title: "Bucket size: auto, day, week, month, year",
			onClick: E,
			children: ["· ", C.granularity || "auto"]
		})
	] });
	return /* @__PURE__ */ p(d, { children: [/* @__PURE__ */ p("div", {
		className: $.bar,
		role: "toolbar",
		"aria-label": "Graph controls",
		"data-toolbar": !0,
		children: [
			y && /* @__PURE__ */ p("div", {
				className: $.group,
				"data-group": "history",
				children: [/* @__PURE__ */ f("button", {
					className: $.icon,
					title: "Undo (Cmd+Z)",
					"aria-label": "Undo",
					disabled: !e.canUndo,
					onClick: () => e.undo(),
					children: "↩"
				}), /* @__PURE__ */ f("button", {
					className: $.icon,
					title: "Redo (Cmd+Shift+Z)",
					"aria-label": "Redo",
					disabled: !e.canRedo,
					onClick: () => e.redo(),
					children: "↪"
				})]
			}),
			b && /* @__PURE__ */ p("div", {
				className: $.group,
				"data-group": "layout",
				role: "radiogroup",
				"aria-label": "Layout",
				children: [/* @__PURE__ */ f("span", {
					className: $.label,
					children: "layout"
				}), n.map((t) => {
					let n = S === t.id;
					return /* @__PURE__ */ f("button", {
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
			x && /* @__PURE__ */ p("div", {
				className: `${$.group} ${$.wideOnly}`,
				"data-group": "dimensions",
				"aria-label": m,
				children: [/* @__PURE__ */ f("span", {
					className: $.label,
					"data-group-label": !0,
					children: u
				}), O]
			}),
			/* @__PURE__ */ f("div", { className: $.spacer }),
			/* @__PURE__ */ p("div", {
				className: $.group,
				"data-group": "view",
				children: [/* @__PURE__ */ f("button", {
					className: $.seg,
					title: yl.RESET_TITLE,
					"data-toolbar-reset": !0,
					onClick: () => {
						v(!1), Yl("graph:reset-all");
					},
					children: "Reset"
				}), /* @__PURE__ */ p("button", {
					className: `${$.seg} ${$.more} ${_ ? $.on : ""}`,
					"aria-expanded": _,
					"aria-controls": "pp-toolbar-more",
					title: `More: ${u} and view actions`,
					"aria-label": "More",
					"data-toolbar-more": !0,
					onClick: () => v((e) => !e),
					children: [/* @__PURE__ */ f("span", {
						className: $.moreText,
						children: "More "
					}), /* @__PURE__ */ f("span", {
						"aria-hidden": "true",
						className: $.moreMark,
						children: _ ? "▾" : "▴"
					})]
				})]
			})
		]
	}), _ && /* @__PURE__ */ p(d, { children: [/* @__PURE__ */ f("div", {
		className: $.backdrop,
		onClick: () => v(!1)
	}), /* @__PURE__ */ p("div", {
		className: $.sheet,
		id: "pp-toolbar-more",
		role: "dialog",
		"aria-label": "More graph controls",
		"data-toolbar-sheet": !0,
		children: [x && /* @__PURE__ */ p("div", {
			className: `${$.section} ${$.narrowOnly}`,
			children: [/* @__PURE__ */ f("div", {
				className: $.sectionTitle,
				"data-group-label": !0,
				children: m
			}), /* @__PURE__ */ f("div", {
				className: $.wrapRow,
				children: O
			})]
		}), /* @__PURE__ */ p("div", {
			className: $.section,
			children: [/* @__PURE__ */ f("div", {
				className: $.sectionTitle,
				children: "View"
			}), /* @__PURE__ */ f("div", {
				className: $.wrapRow,
				children: yl.VIEW_ACTIONS.map((e) => /* @__PURE__ */ f("button", {
					className: $.action,
					title: e.title,
					onClick: () => {
						Yl(e.event), v(!1);
					},
					children: e.label
				}, e.event))
			})]
		})]
	})] })] });
}
function Ql({ viewState: e, show: t, layouts: n, settings: i, layers: a }) {
	let l = i || (typeof window < "u" ? window.SETTINGS : null), [, u] = o((e) => e + 1, 0), [m, h] = c(!1), g = s(null), _ = s(null), v = s(null);
	r(() => e ? e.subscribe(u) : void 0, [e]);
	let y = () => v.current ? [...v.current.querySelectorAll("[data-menu-item]")] : [], b = (e) => {
		h(!1), e && _.current && _.current.focus();
	};
	if (r(() => {
		if (!m) return;
		let e = y()[0];
		e && e.focus({ preventScroll: !0 });
		let t = (e) => {
			g.current && !g.current.contains(e.target) && h(!1);
		}, n = (e) => {
			e.key !== "Escape" || v.current && v.current.contains(e.target) || (e.preventDefault(), e.stopImmediatePropagation(), b(!0));
		};
		return document.addEventListener("pointerdown", t, !0), window.addEventListener("keydown", n, !0), () => {
			document.removeEventListener("pointerdown", t, !0), window.removeEventListener("keydown", n, !0);
		};
	}, [m]), !e) return null;
	let x = t.history !== !1, S = (0, ql.dimensionGroupLabel)(l), C = (e) => e.charAt(0).toUpperCase() + e.slice(1), w = e.timeAxis(), T = (0, yl.menuModel)({
		dimensions: (0, ql.dimensionLabels)(l),
		layers: (0, ql.layerLabels)(l).filter((e) => a.includes(e.id)),
		axis: w,
		preferences: Object.fromEntries((0, ql.layerLabels)(l).map((t) => [t.id, e.preference(t.id)])),
		show: t,
		group: S
	}), E = T.rows.length > 0, D = C(T.heading);
	return /* @__PURE__ */ p("div", {
		ref: g,
		className: $.top,
		role: "group",
		"aria-label": "Graph controls",
		"data-top-graph-controls": !0,
		children: [
			x && /* @__PURE__ */ p(d, { children: [/* @__PURE__ */ f("button", {
				type: "button",
				className: $.topIcon,
				title: "Undo (Cmd+Z)",
				"aria-label": "Undo",
				"data-top-undo": !0,
				disabled: !e.canUndo,
				onClick: () => e.undo(),
				children: /* @__PURE__ */ f(pc, {
					body: (0, gc.iconBody)("undo-2"),
					size: 15
				})
			}), /* @__PURE__ */ f("button", {
				type: "button",
				className: $.topIcon,
				title: "Redo (Cmd+Shift+Z)",
				"aria-label": "Redo",
				"data-top-redo": !0,
				disabled: !e.canRedo,
				onClick: () => e.redo(),
				children: /* @__PURE__ */ f(pc, {
					body: (0, gc.iconBody)("redo-2"),
					size: 15
				})
			})] }),
			/* @__PURE__ */ f("button", {
				type: "button",
				className: $.topIcon,
				title: yl.RESET_TITLE,
				"aria-label": "Reset",
				"data-toolbar-reset": !0,
				onClick: () => {
					h(!1), Yl("graph:reset-all");
				},
				children: /* @__PURE__ */ f(pc, {
					body: (0, gc.iconBody)("rotate-ccw"),
					size: 15
				})
			}),
			E && /* @__PURE__ */ p(d, { children: [/* @__PURE__ */ f("button", {
				ref: _,
				type: "button",
				className: `${$.topIcon} ${m ? $.on : ""}`,
				title: `${D}: which to show`,
				"aria-label": D,
				"aria-haspopup": "menu",
				"aria-expanded": m,
				"aria-controls": "pp-top-menu",
				"data-top-menu-button": !0,
				onClick: () => h((e) => !e),
				onKeyDown: (e) => {
					e.key === "ArrowDown" && !m && (e.preventDefault(), h(!0));
				},
				children: /* @__PURE__ */ f(pc, {
					body: (0, gc.iconBody)("hourglass"),
					size: 15
				})
			}), m && /* @__PURE__ */ p("div", {
				ref: v,
				id: "pp-top-menu",
				className: $.menu,
				role: "menu",
				"aria-labelledby": "pp-top-menu-heading",
				"data-top-menu": !0,
				onKeyDown: (e) => {
					if (e.key === "Escape") {
						e.preventDefault(), e.stopPropagation(), b(!0);
						return;
					}
					if (e.key === "Tab") {
						h(!1);
						return;
					}
					let t = y(), n = (0, yl.menuMove)(t.indexOf(document.activeElement), e.key, t.length);
					n !== null && (e.preventDefault(), e.stopPropagation(), t[n].focus());
				},
				children: [/* @__PURE__ */ f("div", {
					id: "pp-top-menu-heading",
					role: "presentation",
					className: $.menuHeading,
					"data-group-label": !0,
					children: D
				}), T.rows.map((t, n) => {
					if (t.kind === "dimension" || t.kind === "layer") {
						let n = t.kind === "dimension" ? () => e.setTimeAxis((0, yl.toggleDimension)(w, t.id)) : () => e.setPreference(t.id, t.checked ? null : !0);
						return /* @__PURE__ */ p("button", {
							type: "button",
							role: "menuitemcheckbox",
							"aria-checked": t.checked,
							title: t.title,
							className: `${$.menuItem} ${t.kind === "layer" ? $.layer : ""}`,
							"data-menu-item": !0,
							"data-dimension": t.id,
							onClick: n,
							children: [/* @__PURE__ */ f("span", {
								className: $.menuCheck,
								"aria-hidden": "true",
								children: t.checked && /* @__PURE__ */ f(pc, {
									body: (0, gc.iconBody)("check"),
									size: 14
								})
							}), t.label]
						}, t.id);
					}
					return t.kind === "granularity" ? /* @__PURE__ */ p("button", {
						type: "button",
						role: "menuitem",
						className: $.menuItem,
						title: "Bucket size: auto, day, week, month, year",
						"data-menu-item": !0,
						"data-granularity": !0,
						onClick: () => e.setTimeAxis({ granularity: (0, yl.nextGranularity)(w.granularity) }),
						children: [
							/* @__PURE__ */ f("span", {
								className: $.menuCheck,
								"aria-hidden": "true"
							}),
							"bucket size · ",
							t.value
						]
					}, "granularity") : null;
				})]
			})] }),
			/* @__PURE__ */ f(Nl, {
				className: $.topIcon,
				"data-settings-open": !0
			})
		]
	});
}
//#endregion
//#region src/components/TimeOfDay/TimeOfDay.jsx
function $l() {
	let e = () => typeof document < "u" && document.documentElement.getAttribute("data-pp-mode") || "dark", [t, n] = c(e);
	return r(() => {
		let t = new MutationObserver(() => n(e()));
		return t.observe(document.documentElement, {
			attributes: !0,
			attributeFilter: ["data-pp-mode"]
		}), () => t.disconnect();
	}, []), t;
}
var eu = {
	position: "fixed",
	inset: 0,
	zIndex: -1,
	pointerEvents: "none"
};
function tu({ item: e, settings: t, viewState: n }) {
	let i = (0, Bs.config)(t), [, a] = c(0);
	r(() => n ? n.subscribe(() => a((e) => e + 1)) : void 0, [n]);
	let o = $l(), l = !n || !n.preference || n.preference("timeOfDay") !== !1, u = i && l ? (0, Bs.ambienceFor)(e, i, o) : null, p = u ? `${u.top}|${u.bottom}` : "", [m, h] = c([null, null]), [g, _] = c(0), v = s("");
	if (r(() => {
		if (p === v.current) return;
		v.current = p;
		let e = 1 - g;
		h((t) => {
			let n = t.slice();
			return n[e] = u, n;
		});
		let t = requestAnimationFrame(() => requestAnimationFrame(() => _(e)));
		return () => cancelAnimationFrame(t);
	}, [p]), r(() => {
		let e = document.documentElement;
		u ? (e.setAttribute("data-pp-tod", u.time), u.season ? e.setAttribute("data-pp-season", u.season) : e.removeAttribute("data-pp-season")) : (e.removeAttribute("data-pp-tod"), e.removeAttribute("data-pp-season"));
	}, [p]), !i) return null;
	let y = i.transitionSeconds;
	return /* @__PURE__ */ f(d, { children: m.map((e, t) => /* @__PURE__ */ f("div", {
		"aria-hidden": "true",
		"data-tod-layer": t === g && e ? "front" : "back",
		"data-tod-time": e ? e.time : "",
		style: {
			...eu,
			background: e ? `linear-gradient(180deg, ${e.top} 0%, ${e.bottom} 100%)` : "transparent",
			opacity: t === g && e ? 1 : 0,
			transition: `opacity ${y}s ease-in-out`
		}
	}, t)) });
}
//#endregion
//#region src/components/Theme/Theme.jsx
var nu = pl();
function ru({ settings: e, viewState: t }) {
	let [, n] = c(0), i = typeof window < "u" && window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null, [a, o] = c(i ? i.matches : !0);
	r(() => t ? t.subscribe(() => n((e) => e + 1)) : void 0, [t]), r(() => {
		if (!i) return;
		let e = (e) => o(e.matches);
		return i.addEventListener ? i.addEventListener("change", e) : i.addListener(e), () => {
			i.removeEventListener ? i.removeEventListener("change", e) : i.removeListener(e);
		};
	}, []);
	let s = (0, _l.themeName)(e, t && t.preference ? t.preference("theme") : null), l = (0, _l.themeMode)(s, t && t.preference ? t.preference("mode") : null, a), u = (0, nu.openingConfig)(e), d = u && u.ground === "dark" ? "dark" : l;
	return r(() => {
		let e = document.documentElement;
		e.getAttribute("data-pp-theme") !== s && e.setAttribute("data-pp-theme", s), e.getAttribute("data-pp-mode") !== d && e.setAttribute("data-pp-mode", d), e.getAttribute("data-pp-reader-mode") !== l && e.setAttribute("data-pp-reader-mode", l), e.style.colorScheme = d;
	}, [
		s,
		l,
		d
	]), null;
}
var iu = {
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
}, au = (/* @__PURE__ */ m(((e, t) => {
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
})))(), ou = () => typeof window < "u" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function su(e) {
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
function cu(e, t) {
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
					top: (0, nu.firstInkRow)(s, e, i),
					bottom: (0, nu.lastInkRow)(s, e, i),
					above: (0, nu.inkSpan)(s, e, i, 0, c),
					below: c < 1 ? (0, nu.widestInkRow)(s, e, i, c, 1) : null
				});
			} catch {
				n(null);
			}
		}, r.onerror = () => n(null), r.src = e;
	});
}
function lu(e) {
	if (typeof document > "u") return 0;
	let t = 0;
	for (let n of document.querySelectorAll("[data-feeds] > *, [data-top-pages], [data-settings-gear]")) {
		let r = n.getBoundingClientRect();
		!r.width || !r.height || r.top > e * .2 || (t = Math.max(t, r.bottom));
	}
	return t;
}
function uu(e) {
	if (typeof document > "u") return 0;
	let t = 0;
	for (let n of document.querySelectorAll("[data-feeds] > *:not([data-graph-intro]), [data-settings-gear]")) {
		let r = n.getBoundingClientRect();
		!r.width || !r.height || r.top > e * .2 || getComputedStyle(n).position === "fixed" && !n.matches("[data-settings-gear]") || (t = Math.max(t, r.bottom));
	}
	return t;
}
var du = new Set([
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
function fu(e) {
	let t = e.target;
	return !!(t && t.nodeType === 1 && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || du.has(t.getAttribute("role")) || t.closest("[data-reader-panel], [role=\"dialog\"], [role=\"menu\"], [data-settings-panel]") || (e.key === " " || e.key === "Spacebar") && t.closest("button, a[href], summary, [role=\"button\"]")) || typeof window < "u" && window.location.hash.startsWith("#read=") || typeof document < "u" && document.querySelector("[data-settings-panel]"));
}
function pu(e) {
	let t = typeof document < "u" && document.querySelector("[data-rights]");
	if (!t || t.getAttribute("data-rights-position") === "bottom-edge") return 0;
	let n = t.getBoundingClientRect();
	return n.height > 0 ? Math.max(0, e - n.top + 8) : 0;
}
var mu = 8, hu = "http://www.w3.org/2000/svg";
function gu(e, t, { reduced: n, seed: r, skip: i = () => null }) {
	let a = /* @__PURE__ */ new Map(), o = n ? 0 : e.lagMs;
	function s(e, n, i) {
		let a = document.createElementNS(hu, "g");
		a.setAttribute("data-reach", e), a.setAttribute("data-reach-container", n), a.setAttribute("data-reach-tip", String(i));
		let s = document.createElementNS(hu, "path");
		s.setAttribute("class", "reach-main");
		let c = document.createElementNS(hu, "path");
		return c.setAttribute("class", "reach-fine"), a.append(s, c), a.style.visibility = "hidden", t.appendChild(a), {
			key: e,
			g: a,
			main: s,
			fine: c,
			shape: (0, zs.reachShape)(`${r}|${e}`),
			lag: (0, zs.createLag)(o),
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
		let f = e.tips.map((e) => (0, zs.artPoint)(e, r)), p = /* @__PURE__ */ new Set(), m = !1, h = i();
		for (let t of d.containers) if (!(h && h.has(t.id))) for (let r of (0, zs.reachFor)(f, t, e.perContainer, e.stopShort)) {
			let e = r.tip, i = `${t.id}|${e}`;
			p.add(i);
			let l = a.get(i);
			l || (l = s(i, t.id, e), a.set(i, l)), l.state === "new" || !u ? l.lag.jump(r.end) : l.lag.to(r.end, n);
			let d = l.lag.at(n);
			l.lag.settled(n) || (m = !0);
			let h = (0, zs.reachPath)(f[e], d, l.shape);
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
function _u(e, t, n) {
	let r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
	for (let [e, r] of n) for (let n of r) for (let r of t.chains.get(n) || []) r.tip === n && i.set(r.e, e);
	let a = document.createDocumentFragment();
	for (let e of t.edges) {
		let t = e.parts.map((t, n) => {
			let r = document.createElementNS(hu, "path");
			return r.setAttribute("d", (0, au.pathD)(t.pts)), r.setAttribute("stroke", t.stroke || "#e4e1db"), r.setAttribute("stroke-width", String(t.width)), r.setAttribute("data-e", String(e.e)), r.setAttribute("data-part", String(n)), e.tip && r.setAttribute("data-tip", e.tip), i.has(e.e) && r.setAttribute("data-act-root", i.get(e.e)), a.appendChild(r), r;
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
			let a = (0, au.bentRoots)(t, n, e);
			for (let [e, t] of a) {
				let n = r.get(e);
				n && t.forEach((e, t) => {
					n[t] && n[t].setAttribute("d", (0, au.pathD)(e));
				});
			}
		},
		dispose() {
			for (let e of r.values()) for (let t of e) t.remove();
			r.clear();
		}
	};
}
function vu({ layout: e, size: t, which: n, opacity: r }) {
	let i = (0, nu.titleLayout)(e, {
		left: 0,
		top: 0,
		width: t.w,
		height: t.h
	}).lines;
	return i.length ? /* @__PURE__ */ f("g", {
		"data-cover-title": n,
		style: { opacity: r },
		children: i.map((e, t) => {
			let n = 0;
			return /* @__PURE__ */ f("text", {
				x: e.x,
				y: e.y,
				"data-cover-title-line": t,
				xmlSpace: "preserve",
				children: e.spans.map((e, t) => {
					let r = n - e.rise;
					return n = e.rise, /* @__PURE__ */ f("tspan", {
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
function yu(e, t) {
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
function bu(e) {
	if (!e) return;
	let t = e.bottom || "var(--sk-paper, var(--bg, #2a2a2e))";
	return {
		backgroundColor: e.top,
		backgroundImage: `linear-gradient(to bottom, ${e.top} 0%, ${e.top} ${(e.colorFrom * 100).toFixed(1)}%, ${t} 100%)`
	};
}
function xu(e) {
	let t = `linear-gradient(to bottom, transparent 0%, transparent ${(e * 100).toFixed(1)}%, #000 100%)`;
	return {
		WebkitMaskImage: t,
		maskImage: t
	};
}
function Su({ title: e, size: t, start: n, refs: r }) {
	return !e || !t ? null : /* @__PURE__ */ p("svg", {
		className: iu.title,
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
		children: [/* @__PURE__ */ f("g", {
			ref: r.art,
			children: /* @__PURE__ */ f(vu, {
				layout: e.art,
				size: t,
				which: "art",
				opacity: +(n === "art")
			})
		}), /* @__PURE__ */ f("g", {
			ref: r.graph,
			children: /* @__PURE__ */ f(vu, {
				layout: e.graph,
				size: t,
				which: "graph",
				opacity: n === "art" ? 0 : 1
			})
		})]
	});
}
function Cu({ config: e, viewState: t, children: n }) {
	let o = s(null), l = s(null), u = s(null), m = s(null), h = s(null), g = s(null), _ = s(null), v = s(null), y = s(null), b = s(null), x = s(null), S = s(null), C = s(null), w = s(null), T = s(0), E = s(null), D = s(null), O = s(null), k = s(null), A = s(null), j = s(null), M = s(null), N = s(null), P = s(null), F = s(() => !1), [I, L] = c(null), R = s(null), z = s(0), B = a(ou, []), ee = a(() => (0, nu.startState)(e, {
		stored: t && t.openingState ? t.openingState() : null,
		hash: typeof window < "u" ? window.location.hash : ""
	}), [e, t]), te = !!(e.graph && e.graph.hiddenUntilMove) && ee === "art", ne = s({ at: null }), re = () => (0, nu.revealFactor)(te, ne.current.at, performance.now()), ie = () => {
		if (!te || ne.current.at !== null) return;
		ne.current.at = performance.now(), document.documentElement.setAttribute("data-pp-cover-acts", "shown");
		let e = () => {
			N.current && !V.current && Se.current(N.current.p), re() < 1 && requestAnimationFrame(e);
		};
		requestAnimationFrame(e);
	}, V = s(!1), ae = s(ie);
	ae.current = ie, r(() => {
		let t = !0, n = e.top || e.fit === "width" || e.graph.rootsFit === "width" ? Promise.all([cu(e.art.artState, e.crownY), cu(e.art.graphState || e.art.artState, e.crownY)]) : Promise.resolve([null, null]);
		return Promise.all([su(e.art.artState), n]).then(([e, [n, r]]) => {
			t && (R.current = {
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
	let [oe, se] = c(e.title), H = s(e.title);
	H.current = oe;
	let ce = s(null), le = (t) => {
		let n = window.innerWidth, r = window.innerHeight;
		return (0, nu.coverGeometry)(H.current === e.title ? e : {
			...e,
			title: H.current
		}, {
			vw: n,
			vh: r,
			art: P.current || {
				w: 1,
				h: 2
			},
			bottom: pu(r),
			zoom: C.current,
			controls: z.current,
			ink: R.current,
			perPx: ce.current
		}, t);
	}, ue = () => {
		E.current = null;
		let t = window.PostPipeGraphWorld ? window.PostPipeGraphWorld.snapshot() : null;
		t && t.k > 0 && t.homeK > 0 && (C.current = {
			k: t.k,
			homeK: t.homeK
		});
		let n = N.current;
		if (!n) return;
		let r = le(n.p);
		w.current = r, pe(r);
		let i = x.current;
		if (i && t && t.homeK > 0 && P.current) {
			let n = le(1), r = P.current.w / Math.max(1, n.art.width), a = /* @__PURE__ */ new Map();
			for (let e of t.containers) e.drift && i.acts.has(e.id) && a.set(e.id, {
				dx: e.drift.x * t.homeK * r,
				dy: e.drift.y * t.homeK * r
			});
			S.current ||= (0, au.createFollow)(B ? 0 : e.art.rootsFollowMs);
			let o = S.current;
			i.draw.bend(o.step(a, performance.now())), (!o.settled() || t.moving) && de();
		}
		let a = y.current;
		if (!a || !P.current) return;
		if (ye.current) {
			v.current && (v.current.style.opacity = "0");
			return;
		}
		let o = C.current ? (0, zs.backdropOpacity)(e.backdrop, C.current.k, C.current.homeK) : e.backdrop.opacity;
		a.draw(performance.now(), {
			box: r.art,
			world: t,
			opacity: r.layer.opacity * o * re(),
			settledCover: n.p >= 1 && !n.moving
		}) && de();
	}, de = () => {
		E.current ||= requestAnimationFrame(() => fe.current());
	}, fe = s(ue);
	fe.current = ue;
	let pe = (t) => {
		let n = g.current, r = (0, nu.rootsBrightnessAt)(e, t.p), i = r === 1 ? "" : `brightness(${r.toFixed(3)})`;
		b.current && b.current.style.filter !== i && (b.current.style.filter = i), n && n.style.filter !== i && (n.style.filter = i), x.current && b.current ? (b.current.style.opacity = String(t.fade.graph * t.roots), n && (n.style.opacity = "0")) : n ? n.style.opacity = String(t.fade.graph * t.roots) : h.current && (h.current.style.opacity = String(t.roots)), _.current && (_.current.style.opacity = String(t.fade.graph));
	}, me = () => {
		let t = uu(window.innerHeight), n = M.current;
		n && (n.style.height = `calc(env(safe-area-inset-top, 0px) + ${Math.ceil(t + 8)}px)`);
		let r = j.current;
		if (!r) return;
		let i = `calc(env(safe-area-inset-top, 0px) + ${(0, nu.gripHeight)(t, e.grip)}px)`;
		if (e.returnAbove === "crown" && P.current) {
			let t = le(1), n = t.art.top + e.crownY * t.art.height;
			r.style.height = `max(${i}, ${Math.max(0, Math.round(n))}px)`, r.setAttribute("data-cover-handle-to", "crown");
		} else r.style.height = i;
	}, he = s(me);
	he.current = me;
	let ge = () => {
		let e = M.current, t = e ? e.getBoundingClientRect().bottom : 0;
		return Math.max(lu(window.innerHeight), t);
	}, _e = () => {
		if (!P.current) return;
		me();
		let t = le(1);
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
	}, ve = s(_e);
	ve.current = _e;
	let ye = s(!1), be = (e, t, n) => {
		let r = t === "art" && n.layer.opacity === 0 && !!window.PostPipeGraphWorld;
		ye.current = r;
		for (let t of e.children) t.style.display = r ? "none" : "";
	}, xe = (t) => {
		let n = le(t), r = N.current, i = r && r.moving ? "moving" : t >= 1 ? "graph" : t <= 0 ? "art" : "moving", a = document.documentElement;
		a.style.setProperty("--pp-cover-p", String(n.p)), a.setAttribute("data-pp-cover", i), e.topBarInArt || a.setAttribute("data-pp-cover-bar", i === "graph" ? "shown" : "hidden");
		let o = m.current;
		o && (o.style.width = `${n.art.width}px`, o.style.height = `${n.art.height}px`, o.style.transform = `translate3d(${n.art.left}px, ${n.art.top}px, 0)`, o.style.opacity = P.current ? String(n.art.opacity) : "0"), w.current = n, g.current && h.current && (h.current.style.opacity = String(n.fade.art)), pe(n);
		let s = D.current && D.current.firstChild, c = O.current && O.current.firstChild;
		s && (s.style.opacity = String(n.fade.art)), c && (c.style.opacity = String(n.fade.graph)), l.current && (l.current.style.opacity = String(n.ground));
		let d = k.current;
		if (d) {
			d.style.left = `${n.byline.x}px`, d.style.top = `${n.byline.y}px`, d.style.fontSize = `${n.byline.size}px`, d.style.opacity = P.current ? String(n.byline.opacity) : "0", d.setAttribute("data-cover-byline", n.byline.under);
			let e = n.byline.under === "title" ? i !== "moving" : n.byline.opacity > .5;
			d.style.pointerEvents = e ? "auto" : "none", d.tabIndex = n.byline.under === "title" ? e ? 0 : -1 : i === "art" ? 0 : -1;
		}
		let f = u.current;
		f && (f.setAttribute("data-cover-state", i), f.tabIndex = i === "art" ? 0 : -1);
		let p = A.current;
		if (p) {
			let e = i === "graph";
			T.current = e ? 0 : n.layer.follow, p.style.pointerEvents = e ? "" : "none";
			for (let t of p.children) {
				if (t.matches("[data-feeds], [data-top-bar], [data-top-band], [data-cover-handle]")) continue;
				let r = t.matches("[data-graph-root]");
				r && be(t, i, n);
				let a = r ? re() : 1;
				t.style.opacity = e && a >= 1 ? "" : String(e ? a : r ? n.layer.opacity * a : n.graph.opacity), t.style.transform = e ? "" : r ? `translate3d(0, ${n.layer.follow}px, 0)` : `translate3d(0, ${n.graph.shift}px, 0)`, t.inert = i === "art", i === "art" ? t.setAttribute("aria-hidden", "true") : t.removeAttribute("aria-hidden");
			}
			for (let t of p.querySelectorAll("[data-top-graph-controls]")) t.inert = !e;
		}
		let _ = j.current;
		_ && (_.style.opacity = String(n.graph.opacity), _.style.pointerEvents = i === "graph" ? "auto" : "none", _.tabIndex = i === "graph" ? 0 : -1), de();
	}, Se = s(xe);
	Se.current = xe, r(() => {
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
		P.current = I, me(), z.current = e.top ? ge() : 0;
		let t = N.current;
		t && (t.resize(le(0).travel), Se.current(t.p)), ve.current();
		let n = !0;
		return e.top && document.fonts && document.fonts.ready && document.fonts.ready.then(() => {
			me();
			let e = ge();
			if (!n || Math.abs(e - z.current) < .5) return;
			z.current = e;
			let t = N.current;
			t && (t.resize(le(0).travel), Se.current(t.p)), ve.current();
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
			se((e) => (0, nu.fitTitle)(e, {
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
				t.remove(), r > 0 && (ce.current = r / 100);
			}
		};
		return (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(r)), () => {
			t = !1;
		};
	}, [I, e]), i(() => {
		if (oe === e.title) return;
		let t = N.current;
		t && Se.current(t.p), ve.current();
	}, [oe]), r(() => {
		let t = e.art.rootsVector;
		if (!t || !I || typeof fetch > "u") return;
		let n = !0, r = null;
		return fetch(t).then((e) => e.ok ? e.text() : "").then((t) => {
			let i = b.current, a = (0, au.rootsModel)((0, au.parseRoots)(t));
			if (!n || !i || !a) return;
			let o = (0, au.actRoots)(a, e.acts);
			r = _u(i, a, o), x.current = {
				draw: r,
				acts: new Set(o.keys())
			}, i.setAttribute("data-roots-vector", "ready");
			let s = N.current;
			s && Se.current(s.p);
		}).catch(() => {}), () => {
			n = !1, r && r.dispose(), x.current = null;
		};
	}, [e, I]), r(() => {
		e.reach && v.current && (y.current = gu(e.reach, v.current, {
			reduced: B,
			seed: e.art.graphState || e.art.artState,
			skip: () => x.current ? x.current.acts : null
		}));
		let t = () => {
			let e = N.current;
			e && !e.moving && e.p === 0 && !ye.current && Se.current(e.p), de();
		};
		return window.addEventListener("graph:world", t), de(), () => {
			window.removeEventListener("graph:world", t), E.current && cancelAnimationFrame(E.current), E.current = null, y.current && y.current.dispose(), y.current = null, window.PostPipeCoverFrame && delete window.PostPipeCoverFrame;
		};
	}, [e, B]), i(() => {
		let n = null, r = (0, nu.createCover)(e, {
			start: ee,
			reducedMotion: B,
			travel: le(0).travel,
			frame: (e) => requestAnimationFrame(e),
			cancelFrame: (e) => cancelAnimationFrame(e),
			onChange(e, t) {
				if ((e > 0 || t && t.swap) && ae.current(), t && t.swap) {
					let r = Math.round((t.ms || nu.TUNING.reducedFadeMs) / 2);
					V.current = !0;
					let i = [o.current, A.current].filter(Boolean);
					for (let e of i) e.style.transition = `opacity ${r}ms linear`, e.style.opacity = "0";
					n && clearTimeout(n);
					let a = Date.now(), s = () => {
						let t = o.current;
						if ((t ? Number(getComputedStyle(t).opacity) : 0) > .02 && Date.now() - a < r * 4) {
							n = setTimeout(s, 16);
							return;
						}
						V.current = !1, Se.current(e);
						for (let e of i) e.style.opacity = "1";
						n = setTimeout(() => {
							for (let e of i) e.style.transition = "";
							A.current && (A.current.style.opacity = ""), n = null;
						}, r + 20);
					};
					n = setTimeout(s, r);
					return;
				}
				Se.current(e);
			},
			onRest(e) {
				n || Se.current(r.p), t && t.setOpeningState && (t.setOpeningState(e), t.flush && t.flush()), window.dispatchEvent(new CustomEvent("postpipe:cover", { detail: { state: e } }));
			}
		});
		N.current = r, Se.current(r.p), t && t.setOpeningState && t.setOpeningState(r.rest), window.PostPipeCover = {
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
				return re();
			},
			go: (e, t) => r.go(e, t)
		};
		let i = () => he.current();
		i();
		let a = requestAnimationFrame(i);
		document.fonts && document.fonts.ready && document.fonts.ready.then(i);
		let s = () => {
			i(), e.top && (z.current = ge()), r.resize(le(0).travel), Se.current(r.p), ve.current();
		};
		window.addEventListener("resize", s);
		let c = A.current, l = u.current, d = j.current, f = (e) => {
			let t = e.target;
			return !t || !t.closest ? null : d && d.contains(t) ? "edge" : l && l.contains(t) ? "stage" : k.current && k.current.contains(t) ? r.p < 1 || r.moving ? "stage" : "graph" : !c || !c.contains(t) ? null : r.moving || r.p < 1 ? "stage" : e.clientY <= p() ? "edge" : "graph";
		}, p = () => {
			if (e.returnAbove !== "crown" || !P.current) return nu.TUNING.edgePx;
			let t = le(1);
			return Math.max(nu.TUNING.edgePx, t.art.top + e.crownY * t.art.height);
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
			e.deltaY > 0 && ae.current();
		}, _ = () => ae.current(), v = (e) => {
			h(e.target) || ae.current();
		};
		te && (window.addEventListener("wheel", g, {
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
			let t = (0, nu.pageKey)(e);
			!t || e.defaultPrevented || fu(e) || r.key(t) && e.preventDefault();
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
			x && (x.moved >= mu && (S = Date.now()), x = null, r.touchEnd(e.timeStamp || Date.now()));
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
			D && (D.moved = Math.max(D.moved, Math.abs(e.clientY - D.y)), D.moved >= mu && r.touchMove(e.clientY, e.timeStamp || Date.now()));
		}, I = (e) => {
			D && (D.moved >= mu && (S = Date.now()), D = null, r.touchEnd(e.timeStamp || Date.now()));
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
		B,
		ee,
		t
	]);
	let Ce = (e) => {
		let t = N.current;
		!t || F.current() || (e === "graph" ? t.tapArt() : t.tapTop());
	}, we = ee === "art";
	return /* @__PURE__ */ p(d, { children: [
		/* @__PURE__ */ p("div", {
			ref: o,
			className: iu.cover,
			"data-cover": !0,
			"data-ground": e.ground,
			children: [
				/* @__PURE__ */ f("div", {
					ref: l,
					className: iu.ground,
					"data-cover-ground": !0,
					"data-sky": e.sky ? "" : void 0,
					style: {
						opacity: +!!we,
						...bu(e.sky)
					},
					children: e.sky && e.sky.texture > 0 && /* @__PURE__ */ f("div", {
						className: iu.groundTexture,
						"data-cover-ground-texture": !0,
						style: {
							opacity: e.sky.texture,
							...xu(e.sky.textureFrom)
						}
					})
				}),
				/* @__PURE__ */ p("div", {
					ref: u,
					className: iu.stage,
					role: "button",
					tabIndex: we ? 0 : -1,
					"aria-label": "Show the graph",
					"data-cover-stage": !0,
					"data-cover-state": ee,
					onClick: (e) => {
						e.target.closest && e.target.closest("[data-cover-byline]") || N.current && N.current.p < .5 && Ce("graph");
					},
					onKeyDown: (e) => {
						e.target === e.currentTarget && (e.key === "Enter" || e.key === " " || e.key === "Spacebar") && (e.preventDefault(), e.stopPropagation(), Ce("graph"));
					},
					children: [/* @__PURE__ */ p("div", {
						ref: m,
						className: iu.art,
						"data-cover-art": !0,
						style: { opacity: 0 },
						children: [
							/* @__PURE__ */ f("img", {
								ref: h,
								className: iu.image,
								src: e.art.artState,
								alt: "",
								draggable: "false",
								"data-cover-image": "art",
								style: e.art.graphState ? { opacity: +!!we } : void 0
							}),
							e.art.graphState && /* @__PURE__ */ f("img", {
								ref: g,
								className: iu.image,
								src: e.art.graphState,
								alt: "",
								draggable: "false",
								"data-cover-image": "graph",
								style: {
									opacity: we ? 0 : e.backdrop.opacity,
									...yu(e.backdrop.keepAbove, "below")
								}
							}),
							e.art.graphState && e.backdrop.keepAbove > 0 && /* @__PURE__ */ f("img", {
								ref: _,
								className: iu.image,
								src: e.art.graphState,
								alt: "",
								draggable: "false",
								"data-cover-image": "graph-keep",
								style: {
									opacity: +!we,
									...yu(e.backdrop.keepAbove, "above")
								}
							}),
							e.art.rootsVector && /* @__PURE__ */ f("svg", {
								ref: b,
								className: iu.roots,
								"aria-hidden": "true",
								"data-roots-vector": "loading",
								preserveAspectRatio: "none",
								viewBox: I ? `0 0 ${I.w} ${I.h}` : void 0,
								style: {
									opacity: 0,
									...yu(e.backdrop.keepAbove, "below")
								}
							}),
							/* @__PURE__ */ f(Su, {
								title: oe,
								size: I,
								start: ee,
								refs: {
									art: D,
									graph: O
								}
							})
						]
					}), e.alt && /* @__PURE__ */ f("span", {
						className: iu.alt,
						role: "img",
						"aria-label": e.alt,
						"data-cover-alt": !0
					})]
				}),
				e.reach && /* @__PURE__ */ f("svg", {
					ref: v,
					className: iu.reach,
					"aria-hidden": "true",
					"data-cover-reach": !0,
					style: { opacity: 0 }
				})
			]
		}),
		/* @__PURE__ */ p("div", {
			ref: A,
			className: iu.section,
			"data-cover-section": !0,
			style: we ? { pointerEvents: "none" } : void 0,
			children: [
				n,
				e.band && /* @__PURE__ */ f("div", {
					ref: M,
					className: iu.band,
					"data-top-band": !0,
					"aria-hidden": "true",
					style: { background: e.band.color }
				}),
				/* @__PURE__ */ f("button", {
					ref: j,
					type: "button",
					className: iu.handle,
					"aria-label": "Show the cover",
					title: "Show the cover",
					"data-cover-handle": !0,
					tabIndex: we ? -1 : 0,
					style: {
						opacity: +!we,
						pointerEvents: we ? "none" : "auto"
					},
					onClick: () => Ce("art"),
					children: /* @__PURE__ */ f("span", {
						className: iu.grip,
						"aria-hidden": "true"
					})
				})
			]
		}),
		e.byline.text && /* @__PURE__ */ f("a", {
			ref: k,
			className: `${iu.byline} ${e.title ? iu.bylineTitle : ""}`,
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
			children: (0, nu.bylineText)(e.byline)
		})
	] });
}
function wu({ settings: e, viewState: t, children: n }) {
	let r = a(() => (0, nu.openingConfig)(e), [e]);
	return r ? /* @__PURE__ */ f(Cu, {
		config: r,
		viewState: t,
		children: n
	}) : /* @__PURE__ */ f(d, { children: n });
}
//#endregion
//#region src/components/Contributions/useContributions.js
function Tu(e, t) {
	let n = JSON.stringify(e && e.contributions || null), i = a(() => (0, Vs.contributionsConfig)(e), [n]), [o, s] = c(null);
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
	let l = a(() => i && o ? (0, Vs.visibleContributions)(o, {
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
		layers: a(() => (0, Vs.connectionEdges)(l).length ? ["readers"] : [], [l])
	};
}
//#endregion
var Eu = Hs.followLink, Du = Xc.graphFeed, Ou = Hs.isLinkItem, ku = Hs.linkOf, Au = Xc.resolvePages, ju = yl.toolbarConfig, Mu = Xc.topBarConfig;
export { zl as ConfigPanel, Qc as FeedZ, tc as GraphViewer, wu as Opening, e as React, l as ReactDOM, Vc as ReaderPanel, Pl as Settings, Jc as TTS, ru as Theme, tu as TimeOfDay, Kl as TimeOverlay, Xl as Toolbar, Eu as followLink, Du as graphFeed, Ou as isLinkItem, ku as linkOf, Au as resolvePages, ju as toolbarConfig, Mu as topBarConfig, Tu as useContributions };
