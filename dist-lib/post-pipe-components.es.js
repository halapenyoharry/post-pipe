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
function ee(e) {
	typeof e != "function" && (e = A(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = Array(o), c, l, u = 0; u < o; ++u) (c = a[u]) && (l = e.call(c, c.__data__, u, a)) && ("__data__" in c && (l.__data__ = c.__data__), s[u] = l);
	return new At(r, this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/array.js
function j(e) {
	return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
//#endregion
//#region node_modules/d3-selection/src/selectorAll.js
function M() {
	return [];
}
function N(e) {
	return e == null ? M : function() {
		return this.querySelectorAll(e);
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/selectAll.js
function te(e) {
	return function() {
		return j(e.apply(this, arguments));
	};
}
function P(e) {
	e = typeof e == "function" ? te(e) : N(e);
	for (var t = this._groups, n = t.length, r = [], i = [], a = 0; a < n; ++a) for (var o = t[a], s = o.length, c, l = 0; l < s; ++l) (c = o[l]) && (r.push(e.call(c, c.__data__, l, o)), i.push(c));
	return new At(r, i);
}
//#endregion
//#region node_modules/d3-selection/src/matcher.js
function F(e) {
	return function() {
		return this.matches(e);
	};
}
function I(e) {
	return function(t) {
		return t.matches(e);
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/selectChild.js
var L = Array.prototype.find;
function ne(e) {
	return function() {
		return L.call(this.children, e);
	};
}
function re() {
	return this.firstElementChild;
}
function ie(e) {
	return this.select(e == null ? re : ne(typeof e == "function" ? e : I(e)));
}
//#endregion
//#region node_modules/d3-selection/src/selection/selectChildren.js
var ae = Array.prototype.filter;
function R() {
	return Array.from(this.children);
}
function oe(e) {
	return function() {
		return ae.call(this.children, e);
	};
}
function se(e) {
	return this.selectAll(e == null ? R : oe(typeof e == "function" ? e : I(e)));
}
//#endregion
//#region node_modules/d3-selection/src/selection/filter.js
function ce(e) {
	typeof e != "function" && (e = F(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = [], c, l = 0; l < o; ++l) (c = a[l]) && e.call(c, c.__data__, l, a) && s.push(c);
	return new At(r, this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/selection/sparse.js
function z(e) {
	return Array(e.length);
}
//#endregion
//#region node_modules/d3-selection/src/selection/enter.js
function le() {
	return new At(this._enter || this._groups.map(z), this._parents);
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
	return new At(this._exit || this._groups.map(z), this._parents);
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
function we() {
	return Array.from(this);
}
//#endregion
//#region node_modules/d3-selection/src/selection/node.js
function Te() {
	for (var e = this._groups, t = 0, n = e.length; t < n; ++t) for (var r = e[t], i = 0, a = r.length; i < a; ++i) {
		var o = r[i];
		if (o) return o;
	}
	return null;
}
//#endregion
//#region node_modules/d3-selection/src/selection/size.js
function Ee() {
	let e = 0;
	for (let t of this) ++e;
	return e;
}
//#endregion
//#region node_modules/d3-selection/src/selection/empty.js
function De() {
	return !this.node();
}
//#endregion
//#region node_modules/d3-selection/src/selection/each.js
function Oe(e) {
	for (var t = this._groups, n = 0, r = t.length; n < r; ++n) for (var i = t[n], a = 0, o = i.length, s; a < o; ++a) (s = i[a]) && e.call(s, s.__data__, a, i);
	return this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/attr.js
function ke(e) {
	return function() {
		this.removeAttribute(e);
	};
}
function Ae(e) {
	return function() {
		this.removeAttributeNS(e.space, e.local);
	};
}
function je(e, t) {
	return function() {
		this.setAttribute(e, t);
	};
}
function Me(e, t) {
	return function() {
		this.setAttributeNS(e.space, e.local, t);
	};
}
function Ne(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
	};
}
function Pe(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
	};
}
function Fe(e, t) {
	var n = T(e);
	if (arguments.length < 2) {
		var r = this.node();
		return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
	}
	return this.each((t == null ? n.local ? Ae : ke : typeof t == "function" ? n.local ? Pe : Ne : n.local ? Me : je)(n, t));
}
//#endregion
//#region node_modules/d3-selection/src/window.js
function Ie(e) {
	return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
//#endregion
//#region node_modules/d3-selection/src/selection/style.js
function Le(e) {
	return function() {
		this.style.removeProperty(e);
	};
}
function Re(e, t, n) {
	return function() {
		this.style.setProperty(e, t, n);
	};
}
function ze(e, t, n) {
	return function() {
		var r = t.apply(this, arguments);
		r == null ? this.style.removeProperty(e) : this.style.setProperty(e, r, n);
	};
}
function Be(e, t, n) {
	return arguments.length > 1 ? this.each((t == null ? Le : typeof t == "function" ? ze : Re)(e, t, n ?? "")) : Ve(this.node(), e);
}
function Ve(e, t) {
	return e.style.getPropertyValue(t) || Ie(e).getComputedStyle(e, null).getPropertyValue(t);
}
//#endregion
//#region node_modules/d3-selection/src/selection/property.js
function He(e) {
	return function() {
		delete this[e];
	};
}
function Ue(e, t) {
	return function() {
		this[e] = t;
	};
}
function We(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? delete this[e] : this[e] = n;
	};
}
function Ge(e, t) {
	return arguments.length > 1 ? this.each((t == null ? He : typeof t == "function" ? We : Ue)(e, t)) : this.node()[e];
}
//#endregion
//#region node_modules/d3-selection/src/selection/classed.js
function Ke(e) {
	return e.trim().split(/^|\s+/);
}
function qe(e) {
	return e.classList || new Je(e);
}
function Je(e) {
	this._node = e, this._names = Ke(e.getAttribute("class") || "");
}
Je.prototype = {
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
function Ye(e, t) {
	for (var n = qe(e), r = -1, i = t.length; ++r < i;) n.add(t[r]);
}
function B(e, t) {
	for (var n = qe(e), r = -1, i = t.length; ++r < i;) n.remove(t[r]);
}
function Xe(e) {
	return function() {
		Ye(this, e);
	};
}
function Ze(e) {
	return function() {
		B(this, e);
	};
}
function Qe(e, t) {
	return function() {
		(t.apply(this, arguments) ? Ye : B)(this, e);
	};
}
function $e(e, t) {
	var n = Ke(e + "");
	if (arguments.length < 2) {
		for (var r = qe(this.node()), i = -1, a = n.length; ++i < a;) if (!r.contains(n[i])) return !1;
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
	var t = typeof e == "function" ? e : O(e);
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
	var n = typeof e == "function" ? e : O(e), r = t == null ? pt : typeof t == "function" ? t : A(t);
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
function gt() {
	return this.each(ht);
}
//#endregion
//#region node_modules/d3-selection/src/selection/clone.js
function _t() {
	var e = this.cloneNode(!1), t = this.parentNode;
	return t ? t.insertBefore(e, this.nextSibling) : e;
}
function vt() {
	var e = this.cloneNode(!0), t = this.parentNode;
	return t ? t.insertBefore(e, this.nextSibling) : e;
}
function yt(e) {
	return this.select(e ? vt : _t);
}
//#endregion
//#region node_modules/d3-selection/src/selection/datum.js
function bt(e) {
	return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
//#endregion
//#region node_modules/d3-selection/src/selection/on.js
function xt(e) {
	return function(t) {
		e.call(this, t, this.__data__);
	};
}
function St(e) {
	return e.trim().split(/^|\s+/).map(function(e) {
		var t = "", n = e.indexOf(".");
		return n >= 0 && (t = e.slice(n + 1), e = e.slice(0, n)), {
			type: e,
			name: t
		};
	});
}
function Ct(e) {
	return function() {
		var t = this.__on;
		if (t) {
			for (var n = 0, r = -1, i = t.length, a; n < i; ++n) a = t[n], (!e.type || a.type === e.type) && a.name === e.name ? this.removeEventListener(a.type, a.listener, a.options) : t[++r] = a;
			++r ? t.length = r : delete this.__on;
		}
	};
}
function V(e, t, n) {
	return function() {
		var r = this.__on, i, a = xt(t);
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
	var r = St(e + ""), i, a = r.length, o;
	if (arguments.length < 2) {
		var s = this.node().__on;
		if (s) {
			for (var c = 0, l = s.length, u; c < l; ++c) for (i = 0, u = s[c]; i < a; ++i) if ((o = r[i]).type === u.type && o.name === u.name) return u.value;
		}
		return;
	}
	for (s = t ? V : Ct, i = 0; i < a; ++i) this.each(s(r[i], t, n));
	return this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/dispatch.js
function Tt(e, t, n) {
	var r = Ie(e), i = r.CustomEvent;
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
var H = [null];
function At(e, t) {
	this._groups = e, this._parents = t;
}
function jt() {
	return new At([[document.documentElement]], H);
}
function Mt() {
	return this;
}
At.prototype = jt.prototype = {
	constructor: At,
	select: ee,
	selectAll: P,
	selectChild: ie,
	selectChildren: se,
	filter: ce,
	data: he,
	enter: le,
	exit: _e,
	join: ve,
	merge: ye,
	selection: Mt,
	order: be,
	sort: xe,
	call: Ce,
	nodes: we,
	node: Te,
	size: Ee,
	empty: De,
	each: Oe,
	attr: Fe,
	style: Be,
	property: Ge,
	classed: $e,
	text: rt,
	html: st,
	raise: lt,
	lower: dt,
	append: ft,
	insert: mt,
	remove: gt,
	clone: yt,
	datum: bt,
	on: wt,
	dispatch: Ot,
	[Symbol.iterator]: kt
};
//#endregion
//#region node_modules/d3-selection/src/select.js
function U(e) {
	return typeof e == "string" ? new At([[document.querySelector(e)]], [document.documentElement]) : new At([[e]], H);
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
function W(e, t) {
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
var Pt = { passive: !1 }, Ft = {
	capture: !0,
	passive: !1
};
function It(e) {
	e.stopImmediatePropagation();
}
function Lt(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region node_modules/d3-drag/src/nodrag.js
function Rt(e) {
	var t = e.document.documentElement, n = U(e).on("dragstart.drag", Lt, Ft);
	"onselectstart" in t ? n.on("selectstart.drag", Lt, Ft) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function zt(e, t) {
	var n = e.document.documentElement, r = U(e).on("dragstart.drag", null);
	t && (r.on("click.drag", Lt, Ft), setTimeout(function() {
		r.on("click.drag", null);
	}, 0)), "onselectstart" in n ? r.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
//#endregion
//#region node_modules/d3-drag/src/constant.js
var Bt = (e) => () => e;
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
		e.on("mousedown.drag", p).filter(r).on("touchstart.drag", g).on("touchmove.drag", _, Pt).on("touchend.drag touchcancel.drag", v).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	}
	function p(n, r) {
		if (!(u || !e.call(this, n, r))) {
			var i = b(this, t.call(this, n, r), n, r, "mouse");
			i && (U(n.view).on("mousemove.drag", m, Ft).on("mouseup.drag", h, Ft), Rt(n.view), It(n), l = !1, s = n.clientX, c = n.clientY, i("start", n));
		}
	}
	function m(e) {
		if (Lt(e), !l) {
			var t = e.clientX - s, n = e.clientY - c;
			l = t * t + n * n > d;
		}
		i.mouse("drag", e);
	}
	function h(e) {
		U(e.view).on("mousemove.drag mouseup.drag", null), zt(e.view, l), Lt(e), i.mouse("end", e);
	}
	function g(n, r) {
		if (e.call(this, n, r)) {
			var i = n.changedTouches, a = t.call(this, n, r), o = i.length, s, c;
			for (s = 0; s < o; ++s) (c = b(this, a, n, r, i[s].identifier, i[s])) && (It(n), c("start", n, i[s]));
		}
	}
	function _(e) {
		var t = e.changedTouches, n = t.length, r, a;
		for (r = 0; r < n; ++r) (a = i[t[r].identifier]) && (Lt(e), a("drag", e, t[r]));
	}
	function v(e) {
		var t = e.changedTouches, n = t.length, r, a;
		for (u && clearTimeout(u), u = setTimeout(function() {
			u = null;
		}, 500), r = 0; r < n; ++r) (a = i[t[r].identifier]) && (It(e), a("end", e, t[r]));
	}
	function b(e, t, r, s, c, l) {
		var u = a.copy(), d = W(l || r, t), p, m, h;
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
					d = W(l || a, t), _ = o;
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
		return arguments.length ? (e = typeof t == "function" ? t : Bt(!!t), f) : e;
	}, f.container = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : Bt(e), f) : t;
	}, f.subject = function(e) {
		return arguments.length ? (n = typeof e == "function" ? e : Bt(e), f) : n;
	}, f.touchable = function(e) {
		return arguments.length ? (r = typeof e == "function" ? e : Bt(!!e), f) : r;
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
function Jt(e, t) {
	var n = Object.create(e.prototype);
	for (var r in t) n[r] = t[r];
	return n;
}
//#endregion
//#region node_modules/d3-color/src/color.js
function Yt() {}
var Xt = .7, Zt = 1 / Xt, Qt = "\\s*([+-]?\\d+)\\s*", $t = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", en = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", tn = /^#([0-9a-f]{3,8})$/, nn = RegExp(`^rgb\\(${Qt},${Qt},${Qt}\\)$`), rn = RegExp(`^rgb\\(${en},${en},${en}\\)$`), an = RegExp(`^rgba\\(${Qt},${Qt},${Qt},${$t}\\)$`), on = RegExp(`^rgba\\(${en},${en},${en},${$t}\\)$`), sn = RegExp(`^hsl\\(${$t},${en},${en}\\)$`), cn = RegExp(`^hsla\\(${$t},${en},${en},${$t}\\)$`), ln = {
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
qt(Yt, mn, {
	copy(e) {
		return Object.assign(new this.constructor(), this, e);
	},
	displayable() {
		return this.rgb().displayable();
	},
	hex: un,
	formatHex: un,
	formatHex8: dn,
	formatHsl: fn,
	formatRgb: pn,
	toString: pn
});
function un() {
	return this.rgb().formatHex();
}
function dn() {
	return this.rgb().formatHex8();
}
function fn() {
	return Dn(this).formatHsl();
}
function pn() {
	return this.rgb().formatRgb();
}
function mn(e) {
	var t, n;
	return e = (e + "").trim().toLowerCase(), (t = tn.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? hn(t) : n === 3 ? new yn(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? gn(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? gn(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = nn.exec(e)) ? new yn(t[1], t[2], t[3], 1) : (t = rn.exec(e)) ? new yn(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = an.exec(e)) ? gn(t[1], t[2], t[3], t[4]) : (t = on.exec(e)) ? gn(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = sn.exec(e)) ? En(t[1], t[2] / 100, t[3] / 100, 1) : (t = cn.exec(e)) ? En(t[1], t[2] / 100, t[3] / 100, t[4]) : ln.hasOwnProperty(e) ? hn(ln[e]) : e === "transparent" ? new yn(NaN, NaN, NaN, 0) : null;
}
function hn(e) {
	return new yn(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function gn(e, t, n, r) {
	return r <= 0 && (e = t = n = NaN), new yn(e, t, n, r);
}
function _n(e) {
	return e instanceof Yt || (e = mn(e)), e ? (e = e.rgb(), new yn(e.r, e.g, e.b, e.opacity)) : new yn();
}
function vn(e, t, n, r) {
	return arguments.length === 1 ? _n(e) : new yn(e, t, n, r ?? 1);
}
function yn(e, t, n, r) {
	this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
qt(yn, vn, Jt(Yt, {
	brighter(e) {
		return e = e == null ? Zt : Zt ** +e, new yn(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? Xt : Xt ** +e, new yn(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	rgb() {
		return this;
	},
	clamp() {
		return new yn(wn(this.r), wn(this.g), wn(this.b), Cn(this.opacity));
	},
	displayable() {
		return -.5 <= this.r && this.r < 255.5 && -.5 <= this.g && this.g < 255.5 && -.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
	},
	hex: bn,
	formatHex: bn,
	formatHex8: xn,
	formatRgb: Sn,
	toString: Sn
}));
function bn() {
	return `#${Tn(this.r)}${Tn(this.g)}${Tn(this.b)}`;
}
function xn() {
	return `#${Tn(this.r)}${Tn(this.g)}${Tn(this.b)}${Tn((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Sn() {
	let e = Cn(this.opacity);
	return `${e === 1 ? "rgb(" : "rgba("}${wn(this.r)}, ${wn(this.g)}, ${wn(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function Cn(e) {
	return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function wn(e) {
	return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function Tn(e) {
	return e = wn(e), (e < 16 ? "0" : "") + e.toString(16);
}
function En(e, t, n, r) {
	return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new kn(e, t, n, r);
}
function Dn(e) {
	if (e instanceof kn) return new kn(e.h, e.s, e.l, e.opacity);
	if (e instanceof Yt || (e = mn(e)), !e) return new kn();
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
qt(kn, On, Jt(Yt, {
	brighter(e) {
		return e = e == null ? Zt : Zt ** +e, new kn(this.h, this.s, this.l * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? Xt : Xt ** +e, new kn(this.h, this.s, this.l * e, this.opacity);
	},
	rgb() {
		var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < .5 ? n : 1 - n) * t, i = 2 * n - r;
		return new yn(Mn(e >= 240 ? e - 240 : e + 120, i, r), Mn(e, i, r), Mn(e < 120 ? e + 240 : e - 120, i, r), this.opacity);
	},
	clamp() {
		return new kn(An(this.h), jn(this.s), jn(this.l), Cn(this.opacity));
	},
	displayable() {
		return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
	},
	formatHsl() {
		let e = Cn(this.opacity);
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
		var r = n((e = vn(e)).r, (t = vn(t)).r), i = n(e.g, t.g), a = n(e.b, t.b), o = Ln(e.opacity, t.opacity);
		return function(t) {
			return e.r = r(t), e.g = i(t), e.b = a(t), e.opacity = o(t), e + "";
		};
	}
	return r.gamma = e, r;
})(1);
//#endregion
//#region node_modules/d3-interpolate/src/number.js
function zn(e, t) {
	return e = +e, t = +t, function(n) {
		return e * (1 - n) + t * n;
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/string.js
var Bn = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Vn = new RegExp(Bn.source, "g");
function Hn(e) {
	return function() {
		return e;
	};
}
function Un(e) {
	return function(t) {
		return e(t) + "";
	};
}
function Wn(e, t) {
	var n = Bn.lastIndex = Vn.lastIndex = 0, r, i, a, o = -1, s = [], c = [];
	for (e += "", t += ""; (r = Bn.exec(e)) && (i = Vn.exec(t));) (a = i.index) > n && (a = t.slice(n, a), s[o] ? s[o] += a : s[++o] = a), (r = r[0]) === (i = i[0]) ? s[o] ? s[o] += i : s[++o] = i : (s[++o] = null, c.push({
		i: o,
		x: zn(r, i)
	})), n = Vn.lastIndex;
	return n < t.length && (a = t.slice(n), s[o] ? s[o] += a : s[++o] = a), s.length < 2 ? c[0] ? Un(c[0].x) : Hn(t) : (t = c.length, function(e) {
		for (var n = 0, r; n < t; ++n) s[(r = c[n]).i] = r.x(e);
		return s.join("");
	});
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/decompose.js
var Gn = 180 / Math.PI, Kn = {
	translateX: 0,
	translateY: 0,
	rotate: 0,
	skewX: 0,
	scaleX: 1,
	scaleY: 1
};
function qn(e, t, n, r, i, a) {
	var o, s, c;
	return (o = Math.sqrt(e * e + t * t)) && (e /= o, t /= o), (c = e * n + t * r) && (n -= e * c, r -= t * c), (s = Math.sqrt(n * n + r * r)) && (n /= s, r /= s, c /= s), e * r < t * n && (e = -e, t = -t, c = -c, o = -o), {
		translateX: i,
		translateY: a,
		rotate: Math.atan2(t, e) * Gn,
		skewX: Math.atan(c) * Gn,
		scaleX: o,
		scaleY: s
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/parse.js
var Jn;
function Yn(e) {
	let t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
	return t.isIdentity ? Kn : qn(t.a, t.b, t.c, t.d, t.e, t.f);
}
function Xn(e) {
	return e == null || (Jn ||= document.createElementNS("http://www.w3.org/2000/svg", "g"), Jn.setAttribute("transform", e), !(e = Jn.transform.baseVal.consolidate())) ? Kn : (e = e.matrix, qn(e.a, e.b, e.c, e.d, e.e, e.f));
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/index.js
function Zn(e, t, n, r) {
	function i(e) {
		return e.length ? e.pop() + " " : "";
	}
	function a(e, r, i, a, o, s) {
		if (e !== i || r !== a) {
			var c = o.push("translate(", null, t, null, n);
			s.push({
				i: c - 4,
				x: zn(e, i)
			}, {
				i: c - 2,
				x: zn(r, a)
			});
		} else (i || a) && o.push("translate(" + i + t + a + n);
	}
	function o(e, t, n, a) {
		e === t ? t && n.push(i(n) + "rotate(" + t + r) : (e - t > 180 ? t += 360 : t - e > 180 && (e += 360), a.push({
			i: n.push(i(n) + "rotate(", null, r) - 2,
			x: zn(e, t)
		}));
	}
	function s(e, t, n, a) {
		e === t ? t && n.push(i(n) + "skewX(" + t + r) : a.push({
			i: n.push(i(n) + "skewX(", null, r) - 2,
			x: zn(e, t)
		});
	}
	function c(e, t, n, r, a, o) {
		if (e !== n || t !== r) {
			var s = a.push(i(a) + "scale(", null, ",", null, ")");
			o.push({
				i: s - 4,
				x: zn(e, n)
			}, {
				i: s - 2,
				x: zn(t, r)
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
var Qn = Zn(Yn, "px, ", "px)", "deg)"), $n = Zn(Xn, ", ", ")", ")"), er = 1e-12;
function tr(e) {
	return ((e = Math.exp(e)) + 1 / e) / 2;
}
function nr(e) {
	return ((e = Math.exp(e)) - 1 / e) / 2;
}
function rr(e) {
	return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
var ir = (function e(t, n, r) {
	function i(e, i) {
		var a = e[0], o = e[1], s = e[2], c = i[0], l = i[1], u = i[2], d = c - a, f = l - o, p = d * d + f * f, m, h;
		if (p < er) h = Math.log(u / s) / t, m = function(e) {
			return [
				a + e * d,
				o + e * f,
				s * Math.exp(t * e * h)
			];
		};
		else {
			var g = Math.sqrt(p), _ = (u * u - s * s + r * p) / (2 * s * n * g), v = (u * u - s * s - r * p) / (2 * u * n * g), y = Math.log(Math.sqrt(_ * _ + 1) - _);
			h = (Math.log(Math.sqrt(v * v + 1) - v) - y) / t, m = function(e) {
				var r = e * h, i = tr(y), c = s / (n * g) * (i * rr(t * r + y) - nr(y));
				return [
					a + c * d,
					o + c * f,
					s * i / tr(t * r + y)
				];
			};
		}
		return m.duration = h * 1e3 * t / Math.SQRT2, m;
	}
	return i.rho = function(t) {
		var n = Math.max(.001, +t), r = n * n;
		return e(n, r, r * r);
	}, i;
})(Math.SQRT2, 2, 4), ar = 0, or = 0, sr = 0, cr = 1e3, lr, ur, dr = 0, fr = 0, pr = 0, mr = typeof performance == "object" && performance.now ? performance : Date, hr = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
	setTimeout(e, 17);
};
function gr() {
	return fr ||= (hr(_r), mr.now() + pr);
}
function _r() {
	fr = 0;
}
function vr() {
	this._call = this._time = this._next = null;
}
vr.prototype = yr.prototype = {
	constructor: vr,
	restart: function(e, t, n) {
		if (typeof e != "function") throw TypeError("callback is not a function");
		n = (n == null ? gr() : +n) + (t == null ? 0 : +t), !this._next && ur !== this && (ur ? ur._next = this : lr = this, ur = this), this._call = e, this._time = n, wr();
	},
	stop: function() {
		this._call && (this._call = null, this._time = Infinity, wr());
	}
};
function yr(e, t, n) {
	var r = new vr();
	return r.restart(e, t, n), r;
}
function br() {
	gr(), ++ar;
	for (var e = lr, t; e;) (t = fr - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
	--ar;
}
function xr() {
	fr = (dr = mr.now()) + pr, ar = or = 0;
	try {
		br();
	} finally {
		ar = 0, Cr(), fr = 0;
	}
}
function Sr() {
	var e = mr.now(), t = e - dr;
	t > cr && (pr -= t, dr = e);
}
function Cr() {
	for (var e, t = lr, n, r = Infinity; t;) t._call ? (r > t._time && (r = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : lr = n);
	ur = e, wr(r);
}
function wr(e) {
	ar || (or &&= clearTimeout(or), e - fr > 24 ? (e < Infinity && (or = setTimeout(xr, e - mr.now() - pr)), sr &&= clearInterval(sr)) : (sr ||= (dr = mr.now(), setInterval(Sr, cr)), ar = 1, hr(xr)));
}
//#endregion
//#region node_modules/d3-timer/src/timeout.js
function Tr(e, t, n) {
	var r = new vr();
	return t = t == null ? 0 : +t, r.restart((n) => {
		r.stop(), e(n + t);
	}, t, n), r;
}
//#endregion
//#region node_modules/d3-transition/src/transition/schedule.js
var Er = y("start", "end", "cancel", "interrupt"), Dr = [];
function Or(e, t, n, r, i, a) {
	var o = e.__transition;
	if (!o) e.__transition = {};
	else if (n in o) return;
	Mr(e, n, {
		name: t,
		index: r,
		group: i,
		on: Er,
		tween: Dr,
		time: a.time,
		delay: a.delay,
		duration: a.duration,
		ease: a.ease,
		timer: null,
		state: 0
	});
}
function kr(e, t) {
	var n = jr(e, t);
	if (n.state > 0) throw Error("too late; already scheduled");
	return n;
}
function Ar(e, t) {
	var n = jr(e, t);
	if (n.state > 3) throw Error("too late; already running");
	return n;
}
function jr(e, t) {
	var n = e.__transition;
	if (!n || !(n = n[t])) throw Error("transition not found");
	return n;
}
function Mr(e, t, n) {
	var r = e.__transition, i;
	r[t] = n, n.timer = yr(a, 0, n.time);
	function a(e) {
		n.state = 1, n.timer.restart(o, n.delay, n.time), n.delay <= e && o(e - n.delay);
	}
	function o(a) {
		var l, u, d, f;
		if (n.state !== 1) return c();
		for (l in r) if (f = r[l], f.name === n.name) {
			if (f.state === 3) return Tr(o);
			f.state === 4 ? (f.state = 6, f.timer.stop(), f.on.call("interrupt", e, e.__data__, f.index, f.group), delete r[l]) : +l < t && (f.state = 6, f.timer.stop(), f.on.call("cancel", e, e.__data__, f.index, f.group), delete r[l]);
		}
		if (Tr(function() {
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
function Nr(e, t) {
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
function Pr(e) {
	return this.each(function() {
		Nr(this, e);
	});
}
//#endregion
//#region node_modules/d3-transition/src/transition/tween.js
function Fr(e, t) {
	var n, r;
	return function() {
		var i = Ar(this, e), a = i.tween;
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
function Ir(e, t, n) {
	var r, i;
	if (typeof n != "function") throw Error();
	return function() {
		var a = Ar(this, e), o = a.tween;
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
function Lr(e, t) {
	var n = this._id;
	if (e += "", arguments.length < 2) {
		for (var r = jr(this.node(), n).tween, i = 0, a = r.length, o; i < a; ++i) if ((o = r[i]).name === e) return o.value;
		return null;
	}
	return this.each((t == null ? Fr : Ir)(n, e, t));
}
function Rr(e, t, n) {
	var r = e._id;
	return e.each(function() {
		var e = Ar(this, r);
		(e.value ||= {})[t] = n.apply(this, arguments);
	}), function(e) {
		return jr(e, r).value[t];
	};
}
//#endregion
//#region node_modules/d3-transition/src/transition/interpolate.js
function zr(e, t) {
	var n;
	return (typeof t == "number" ? zn : t instanceof mn ? Rn : (n = mn(t)) ? (t = n, Rn) : Wn)(e, t);
}
//#endregion
//#region node_modules/d3-transition/src/transition/attr.js
function Br(e) {
	return function() {
		this.removeAttribute(e);
	};
}
function Vr(e) {
	return function() {
		this.removeAttributeNS(e.space, e.local);
	};
}
function Hr(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = this.getAttribute(e);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function Ur(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = this.getAttributeNS(e.space, e.local);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function Wr(e, t, n) {
	var r, i, a;
	return function() {
		var o, s = n(this), c;
		return s == null ? void this.removeAttribute(e) : (o = this.getAttribute(e), c = s + "", o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s)));
	};
}
function Gr(e, t, n) {
	var r, i, a;
	return function() {
		var o, s = n(this), c;
		return s == null ? void this.removeAttributeNS(e.space, e.local) : (o = this.getAttributeNS(e.space, e.local), c = s + "", o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s)));
	};
}
function Kr(e, t) {
	var n = T(e), r = n === "transform" ? $n : zr;
	return this.attrTween(e, typeof t == "function" ? (n.local ? Gr : Wr)(n, r, Rr(this, "attr." + e, t)) : t == null ? (n.local ? Vr : Br)(n) : (n.local ? Ur : Hr)(n, r, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/attrTween.js
function qr(e, t) {
	return function(n) {
		this.setAttribute(e, t.call(this, n));
	};
}
function Jr(e, t) {
	return function(n) {
		this.setAttributeNS(e.space, e.local, t.call(this, n));
	};
}
function Yr(e, t) {
	var n, r;
	function i() {
		var i = t.apply(this, arguments);
		return i !== r && (n = (r = i) && Jr(e, i)), n;
	}
	return i._value = t, i;
}
function Xr(e, t) {
	var n, r;
	function i() {
		var i = t.apply(this, arguments);
		return i !== r && (n = (r = i) && qr(e, i)), n;
	}
	return i._value = t, i;
}
function Zr(e, t) {
	var n = "attr." + e;
	if (arguments.length < 2) return (n = this.tween(n)) && n._value;
	if (t == null) return this.tween(n, null);
	if (typeof t != "function") throw Error();
	var r = T(e);
	return this.tween(n, (r.local ? Yr : Xr)(r, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/delay.js
function Qr(e, t) {
	return function() {
		kr(this, e).delay = +t.apply(this, arguments);
	};
}
function $r(e, t) {
	return t = +t, function() {
		kr(this, e).delay = t;
	};
}
function ei(e) {
	var t = this._id;
	return arguments.length ? this.each((typeof e == "function" ? Qr : $r)(t, e)) : jr(this.node(), t).delay;
}
//#endregion
//#region node_modules/d3-transition/src/transition/duration.js
function ti(e, t) {
	return function() {
		Ar(this, e).duration = +t.apply(this, arguments);
	};
}
function ni(e, t) {
	return t = +t, function() {
		Ar(this, e).duration = t;
	};
}
function ri(e) {
	var t = this._id;
	return arguments.length ? this.each((typeof e == "function" ? ti : ni)(t, e)) : jr(this.node(), t).duration;
}
//#endregion
//#region node_modules/d3-transition/src/transition/ease.js
function ii(e, t) {
	if (typeof t != "function") throw Error();
	return function() {
		Ar(this, e).ease = t;
	};
}
function ai(e) {
	var t = this._id;
	return arguments.length ? this.each(ii(t, e)) : jr(this.node(), t).ease;
}
//#endregion
//#region node_modules/d3-transition/src/transition/easeVarying.js
function oi(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		if (typeof n != "function") throw Error();
		Ar(this, e).ease = n;
	};
}
function si(e) {
	if (typeof e != "function") throw Error();
	return this.each(oi(this._id, e));
}
//#endregion
//#region node_modules/d3-transition/src/transition/filter.js
function ci(e) {
	typeof e != "function" && (e = F(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = [], c, l = 0; l < o; ++l) (c = a[l]) && e.call(c, c.__data__, l, a) && s.push(c);
	return new Li(r, this._parents, this._name, this._id);
}
//#endregion
//#region node_modules/d3-transition/src/transition/merge.js
function li(e) {
	if (e._id !== this._id) throw Error();
	for (var t = this._groups, n = e._groups, r = t.length, i = n.length, a = Math.min(r, i), o = Array(r), s = 0; s < a; ++s) for (var c = t[s], l = n[s], u = c.length, d = o[s] = Array(u), f, p = 0; p < u; ++p) (f = c[p] || l[p]) && (d[p] = f);
	for (; s < r; ++s) o[s] = t[s];
	return new Li(o, this._parents, this._name, this._id);
}
//#endregion
//#region node_modules/d3-transition/src/transition/on.js
function ui(e) {
	return (e + "").trim().split(/^|\s+/).every(function(e) {
		var t = e.indexOf(".");
		return t >= 0 && (e = e.slice(0, t)), !e || e === "start";
	});
}
function di(e, t, n) {
	var r, i, a = ui(t) ? kr : Ar;
	return function() {
		var o = a(this, e), s = o.on;
		s !== r && (i = (r = s).copy()).on(t, n), o.on = i;
	};
}
function fi(e, t) {
	var n = this._id;
	return arguments.length < 2 ? jr(this.node(), n).on.on(e) : this.each(di(n, e, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/remove.js
function pi(e) {
	return function() {
		var t = this.parentNode;
		for (var n in this.__transition) if (+n !== e) return;
		t && t.removeChild(this);
	};
}
function mi() {
	return this.on("end.remove", pi(this._id));
}
//#endregion
//#region node_modules/d3-transition/src/transition/select.js
function hi(e) {
	var t = this._name, n = this._id;
	typeof e != "function" && (e = A(e));
	for (var r = this._groups, i = r.length, a = Array(i), o = 0; o < i; ++o) for (var s = r[o], c = s.length, l = a[o] = Array(c), u, d, f = 0; f < c; ++f) (u = s[f]) && (d = e.call(u, u.__data__, f, s)) && ("__data__" in u && (d.__data__ = u.__data__), l[f] = d, Or(l[f], t, n, f, l, jr(u, n)));
	return new Li(a, this._parents, t, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/selectAll.js
function gi(e) {
	var t = this._name, n = this._id;
	typeof e != "function" && (e = N(e));
	for (var r = this._groups, i = r.length, a = [], o = [], s = 0; s < i; ++s) for (var c = r[s], l = c.length, u, d = 0; d < l; ++d) if (u = c[d]) {
		for (var f = e.call(u, u.__data__, d, c), p, m = jr(u, n), h = 0, g = f.length; h < g; ++h) (p = f[h]) && Or(p, t, n, h, f, m);
		a.push(f), o.push(u);
	}
	return new Li(a, o, t, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/selection.js
var _i = jt.prototype.constructor;
function vi() {
	return new _i(this._groups, this._parents);
}
//#endregion
//#region node_modules/d3-transition/src/transition/style.js
function yi(e, t) {
	var n, r, i;
	return function() {
		var a = Ve(this, e), o = (this.style.removeProperty(e), Ve(this, e));
		return a === o ? null : a === n && o === r ? i : i = t(n = a, r = o);
	};
}
function bi(e) {
	return function() {
		this.style.removeProperty(e);
	};
}
function xi(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = Ve(this, e);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function Si(e, t, n) {
	var r, i, a;
	return function() {
		var o = Ve(this, e), s = n(this), c = s + "";
		return s ?? (c = s = (this.style.removeProperty(e), Ve(this, e))), o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s));
	};
}
function Ci(e, t) {
	var n, r, i, a = "style." + t, o = "end." + a, s;
	return function() {
		var c = Ar(this, e), l = c.on, u = c.value[a] == null ? s ||= bi(t) : void 0;
		(l !== n || i !== u) && (r = (n = l).copy()).on(o, i = u), c.on = r;
	};
}
function wi(e, t, n) {
	var r = (e += "") == "transform" ? Qn : zr;
	return t == null ? this.styleTween(e, yi(e, r)).on("end.style." + e, bi(e)) : typeof t == "function" ? this.styleTween(e, Si(e, r, Rr(this, "style." + e, t))).each(Ci(this._id, e)) : this.styleTween(e, xi(e, r, t), n).on("end.style." + e, null);
}
//#endregion
//#region node_modules/d3-transition/src/transition/styleTween.js
function Ti(e, t, n) {
	return function(r) {
		this.style.setProperty(e, t.call(this, r), n);
	};
}
function Ei(e, t, n) {
	var r, i;
	function a() {
		var a = t.apply(this, arguments);
		return a !== i && (r = (i = a) && Ti(e, a, n)), r;
	}
	return a._value = t, a;
}
function Di(e, t, n) {
	var r = "style." + (e += "");
	if (arguments.length < 2) return (r = this.tween(r)) && r._value;
	if (t == null) return this.tween(r, null);
	if (typeof t != "function") throw Error();
	return this.tween(r, Ei(e, t, n ?? ""));
}
//#endregion
//#region node_modules/d3-transition/src/transition/text.js
function Oi(e) {
	return function() {
		this.textContent = e;
	};
}
function ki(e) {
	return function() {
		var t = e(this);
		this.textContent = t ?? "";
	};
}
function Ai(e) {
	return this.tween("text", typeof e == "function" ? ki(Rr(this, "text", e)) : Oi(e == null ? "" : e + ""));
}
//#endregion
//#region node_modules/d3-transition/src/transition/textTween.js
function ji(e) {
	return function(t) {
		this.textContent = e.call(this, t);
	};
}
function Mi(e) {
	var t, n;
	function r() {
		var r = e.apply(this, arguments);
		return r !== n && (t = (n = r) && ji(r)), t;
	}
	return r._value = e, r;
}
function Ni(e) {
	var t = "text";
	if (arguments.length < 1) return (t = this.tween(t)) && t._value;
	if (e == null) return this.tween(t, null);
	if (typeof e != "function") throw Error();
	return this.tween(t, Mi(e));
}
//#endregion
//#region node_modules/d3-transition/src/transition/transition.js
function Pi() {
	for (var e = this._name, t = this._id, n = zi(), r = this._groups, i = r.length, a = 0; a < i; ++a) for (var o = r[a], s = o.length, c, l = 0; l < s; ++l) if (c = o[l]) {
		var u = jr(c, t);
		Or(c, e, n, l, o, {
			time: u.time + u.delay + u.duration,
			delay: 0,
			duration: u.duration,
			ease: u.ease
		});
	}
	return new Li(r, this._parents, e, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/end.js
function Fi() {
	var e, t, n = this, r = n._id, i = n.size();
	return new Promise(function(a, o) {
		var s = { value: o }, c = { value: function() {
			--i === 0 && a();
		} };
		n.each(function() {
			var n = Ar(this, r), i = n.on;
			i !== e && (t = (e = i).copy(), t._.cancel.push(s), t._.interrupt.push(s), t._.end.push(c)), n.on = t;
		}), i === 0 && a();
	});
}
//#endregion
//#region node_modules/d3-transition/src/transition/index.js
var Ii = 0;
function Li(e, t, n, r) {
	this._groups = e, this._parents = t, this._name = n, this._id = r;
}
function Ri(e) {
	return jt().transition(e);
}
function zi() {
	return ++Ii;
}
var Bi = jt.prototype;
Li.prototype = Ri.prototype = {
	constructor: Li,
	select: hi,
	selectAll: gi,
	selectChild: Bi.selectChild,
	selectChildren: Bi.selectChildren,
	filter: ci,
	merge: li,
	selection: vi,
	transition: Pi,
	call: Bi.call,
	nodes: Bi.nodes,
	node: Bi.node,
	size: Bi.size,
	empty: Bi.empty,
	each: Bi.each,
	on: fi,
	attr: Kr,
	attrTween: Zr,
	style: wi,
	styleTween: Di,
	text: Ai,
	textTween: Ni,
	remove: mi,
	tween: Lr,
	delay: ei,
	duration: ri,
	ease: ai,
	easeVarying: si,
	end: Fi,
	[Symbol.iterator]: Bi[Symbol.iterator]
};
//#endregion
//#region node_modules/d3-ease/src/cubic.js
function Vi(e) {
	return --e * e * e + 1;
}
function Hi(e) {
	return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
//#endregion
//#region node_modules/d3-transition/src/selection/transition.js
var Ui = {
	time: null,
	delay: 0,
	duration: 250,
	ease: Hi
};
function Wi(e, t) {
	for (var n; !(n = e.__transition) || !(n = n[t]);) if (!(e = e.parentNode)) throw Error(`transition ${t} not found`);
	return n;
}
function Gi(e) {
	var t, n;
	e instanceof Li ? (t = e._id, e = e._name) : (t = zi(), (n = Ui).time = gr(), e = e == null ? null : e + "");
	for (var r = this._groups, i = r.length, a = 0; a < i; ++a) for (var o = r[a], s = o.length, c, l = 0; l < s; ++l) (c = o[l]) && Or(c, e, t, l, o, n || Wi(c, t));
	return new Li(r, this._parents, e, t);
}
jt.prototype.interrupt = Pr, jt.prototype.transition = Gi;
//#endregion
//#region node_modules/d3-brush/src/brush.js
var { abs: Ki, max: qi, min: Ji } = Math;
["w", "e"].map(Yi), ["n", "s"].map(Yi), [
	"n",
	"w",
	"e",
	"s",
	"nw",
	"ne",
	"sw",
	"se"
].map(Yi);
function Yi(e) {
	return { type: e };
}
//#endregion
//#region node_modules/d3-path/src/path.js
var Xi = Math.PI, Zi = 2 * Xi, Qi = 1e-6, $i = Zi - Qi;
function ea(e) {
	this._ += e[0];
	for (let t = 1, n = e.length; t < n; ++t) this._ += arguments[t] + e[t];
}
function ta(e) {
	let t = Math.floor(e);
	if (!(t >= 0)) throw Error(`invalid digits: ${e}`);
	if (t > 15) return ea;
	let n = 10 ** t;
	return function(e) {
		this._ += e[0];
		for (let t = 1, r = e.length; t < r; ++t) this._ += Math.round(arguments[t] * n) / n + e[t];
	};
}
var na = class {
	constructor(e) {
		this._x0 = this._y0 = this._x1 = this._y1 = null, this._ = "", this._append = e == null ? ea : ta(e);
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
		else if (d > Qi) if (!(Math.abs(u * s - c * l) > Qi) || !i) this._append`L${this._x1 = e},${this._y1 = t}`;
		else {
			let f = n - a, p = r - o, m = s * s + c * c, h = f * f + p * p, g = Math.sqrt(m), _ = Math.sqrt(d), v = i * Math.tan((Xi - Math.acos((m + d - h) / (2 * g * _))) / 2), y = v / _, b = v / g;
			Math.abs(y - 1) > Qi && this._append`L${e + y * l},${t + y * u}`, this._append`A${i},${i},0,0,${+(u * f > l * p)},${this._x1 = e + b * s},${this._y1 = t + b * c}`;
		}
	}
	arc(e, t, n, r, i, a) {
		if (e = +e, t = +t, n = +n, a = !!a, n < 0) throw Error(`negative radius: ${n}`);
		let o = n * Math.cos(r), s = n * Math.sin(r), c = e + o, l = t + s, u = 1 ^ a, d = a ? r - i : i - r;
		this._x1 === null ? this._append`M${c},${l}` : (Math.abs(this._x1 - c) > Qi || Math.abs(this._y1 - l) > Qi) && this._append`L${c},${l}`, n && (d < 0 && (d = d % Zi + Zi), d > $i ? this._append`A${n},${n},0,1,${u},${e - o},${t - s}A${n},${n},0,1,${u},${this._x1 = c},${this._y1 = l}` : d > Qi && this._append`A${n},${n},0,${+(d >= Xi)},${u},${this._x1 = e + n * Math.cos(i)},${this._y1 = t + n * Math.sin(i)}`);
	}
	rect(e, t, n, r) {
		this._append`M${this._x0 = this._x1 = +e},${this._y0 = this._y1 = +t}h${n = +n}v${+r}h${-n}Z`;
	}
	toString() {
		return this._;
	}
};
function ra() {
	return new na();
}
ra.prototype = na.prototype;
//#endregion
//#region node_modules/d3-force/src/center.js
function ia(e, t) {
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
function aa(e) {
	let t = +this._x.call(null, e), n = +this._y.call(null, e);
	return oa(this.cover(t, n), t, n, e);
}
function oa(e, t, n, r) {
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
function sa(e) {
	var t, n, r = e.length, i, a, o = Array(r), s = Array(r), c = Infinity, l = Infinity, u = -Infinity, d = -Infinity;
	for (n = 0; n < r; ++n) isNaN(i = +this._x.call(null, t = e[n])) || isNaN(a = +this._y.call(null, t)) || (o[n] = i, s[n] = a, i < c && (c = i), i > u && (u = i), a < l && (l = a), a > d && (d = a));
	if (c > u || l > d) return this;
	for (this.cover(c, l).cover(u, d), n = 0; n < r; ++n) oa(this, o[n], s[n], e[n]);
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/cover.js
function ca(e, t) {
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
function la() {
	var e = [];
	return this.visit(function(t) {
		if (!t.length) do
			e.push(t.data);
		while (t = t.next);
	}), e;
}
//#endregion
//#region node_modules/d3-quadtree/src/extent.js
function ua(e) {
	return arguments.length ? this.cover(+e[0][0], +e[0][1]).cover(+e[1][0], +e[1][1]) : isNaN(this._x0) ? void 0 : [[this._x0, this._y0], [this._x1, this._y1]];
}
//#endregion
//#region node_modules/d3-quadtree/src/quad.js
function da(e, t, n, r, i) {
	this.node = e, this.x0 = t, this.y0 = n, this.x1 = r, this.y1 = i;
}
//#endregion
//#region node_modules/d3-quadtree/src/find.js
function fa(e, t, n) {
	var r, i = this._x0, a = this._y0, o, s, c, l, u = this._x1, d = this._y1, f = [], p = this._root, m, h;
	for (p && f.push(new da(p, i, a, u, d)), n == null ? n = Infinity : (i = e - n, a = t - n, u = e + n, d = t + n, n *= n); m = f.pop();) if (!(!(p = m.node) || (o = m.x0) > u || (s = m.y0) > d || (c = m.x1) < i || (l = m.y1) < a)) if (p.length) {
		var g = (o + c) / 2, _ = (s + l) / 2;
		f.push(new da(p[3], g, _, c, l), new da(p[2], o, _, g, l), new da(p[1], g, s, c, _), new da(p[0], o, s, g, _)), (h = (t >= _) << 1 | e >= g) && (m = f[f.length - 1], f[f.length - 1] = f[f.length - 1 - h], f[f.length - 1 - h] = m);
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
function pa(e) {
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
function ma(e) {
	for (var t = 0, n = e.length; t < n; ++t) this.remove(e[t]);
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/root.js
function ha() {
	return this._root;
}
//#endregion
//#region node_modules/d3-quadtree/src/size.js
function ga() {
	var e = 0;
	return this.visit(function(t) {
		if (!t.length) do
			++e;
		while (t = t.next);
	}), e;
}
//#endregion
//#region node_modules/d3-quadtree/src/visit.js
function _a(e) {
	var t = [], n, r = this._root, i, a, o, s, c;
	for (r && t.push(new da(r, this._x0, this._y0, this._x1, this._y1)); n = t.pop();) if (!e(r = n.node, a = n.x0, o = n.y0, s = n.x1, c = n.y1) && r.length) {
		var l = (a + s) / 2, u = (o + c) / 2;
		(i = r[3]) && t.push(new da(i, l, u, s, c)), (i = r[2]) && t.push(new da(i, a, u, l, c)), (i = r[1]) && t.push(new da(i, l, o, s, u)), (i = r[0]) && t.push(new da(i, a, o, l, u));
	}
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/visitAfter.js
function va(e) {
	var t = [], n = [], r;
	for (this._root && t.push(new da(this._root, this._x0, this._y0, this._x1, this._y1)); r = t.pop();) {
		var i = r.node;
		if (i.length) {
			var a, o = r.x0, s = r.y0, c = r.x1, l = r.y1, u = (o + c) / 2, d = (s + l) / 2;
			(a = i[0]) && t.push(new da(a, o, s, u, d)), (a = i[1]) && t.push(new da(a, u, s, c, d)), (a = i[2]) && t.push(new da(a, o, d, u, l)), (a = i[3]) && t.push(new da(a, u, d, c, l));
		}
		n.push(r);
	}
	for (; r = n.pop();) e(r.node, r.x0, r.y0, r.x1, r.y1);
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/x.js
function ya(e) {
	return e[0];
}
function ba(e) {
	return arguments.length ? (this._x = e, this) : this._x;
}
//#endregion
//#region node_modules/d3-quadtree/src/y.js
function xa(e) {
	return e[1];
}
function Sa(e) {
	return arguments.length ? (this._y = e, this) : this._y;
}
//#endregion
//#region node_modules/d3-quadtree/src/quadtree.js
function Ca(e, t, n) {
	var r = new wa(t ?? ya, n ?? xa, NaN, NaN, NaN, NaN);
	return e == null ? r : r.addAll(e);
}
function wa(e, t, n, r, i, a) {
	this._x = e, this._y = t, this._x0 = n, this._y0 = r, this._x1 = i, this._y1 = a, this._root = void 0;
}
function Ta(e) {
	for (var t = { data: e.data }, n = t; e = e.next;) n = n.next = { data: e.data };
	return t;
}
var Ea = Ca.prototype = wa.prototype;
Ea.copy = function() {
	var e = new wa(this._x, this._y, this._x0, this._y0, this._x1, this._y1), t = this._root, n, r;
	if (!t) return e;
	if (!t.length) return e._root = Ta(t), e;
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
	}) : t.target[i] = Ta(r));
	return e;
}, Ea.add = aa, Ea.addAll = sa, Ea.cover = ca, Ea.data = la, Ea.extent = ua, Ea.find = fa, Ea.remove = pa, Ea.removeAll = ma, Ea.root = ha, Ea.size = ga, Ea.visit = _a, Ea.visitAfter = va, Ea.x = ba, Ea.y = Sa;
//#endregion
//#region node_modules/d3-force/src/constant.js
function Da(e) {
	return function() {
		return e;
	};
}
//#endregion
//#region node_modules/d3-force/src/jiggle.js
function Oa(e) {
	return (e() - .5) * 1e-6;
}
//#endregion
//#region node_modules/d3-force/src/collide.js
function ka(e) {
	return e.x + e.vx;
}
function Aa(e) {
	return e.y + e.vy;
}
function ja(e) {
	var t, n, r, i = 1, a = 1;
	typeof e != "function" && (e = Da(e == null ? 1 : +e));
	function o() {
		for (var e, o = t.length, c, l, u, d, f, p, m = 0; m < a; ++m) for (c = Ca(t, ka, Aa).visitAfter(s), e = 0; e < o; ++e) l = t[e], f = n[l.index], p = f * f, u = l.x + l.vx, d = l.y + l.vy, c.visit(h);
		function h(e, t, n, a, o) {
			var s = e.data, c = e.r, m = f + c;
			if (s) {
				if (s.index > l.index) {
					var h = u - s.x - s.vx, g = d - s.y - s.vy, _ = h * h + g * g;
					_ < m * m && (h === 0 && (h = Oa(r), _ += h * h), g === 0 && (g = Oa(r), _ += g * g), _ = (m - (_ = Math.sqrt(_))) / _ * i, l.vx += (h *= _) * (m = (c *= c) / (p + c)), l.vy += (g *= _) * m, s.vx -= h * (m = 1 - m), s.vy -= g * m);
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
		return arguments.length ? (e = typeof t == "function" ? t : Da(+t), c(), o) : e;
	}, o;
}
//#endregion
//#region node_modules/d3-force/src/link.js
function Ma(e) {
	return e.index;
}
function Na(e, t) {
	var n = e.get(t);
	if (!n) throw Error("node not found: " + t);
	return n;
}
function Pa(e) {
	var t = Ma, n = d, r, i = Da(30), a, o, s, c, l, u = 1;
	e ??= [];
	function d(e) {
		return 1 / Math.min(s[e.source.index], s[e.target.index]);
	}
	function f(t) {
		for (var n = 0, i = e.length; n < u; ++n) for (var o = 0, s, d, f, p, m, h, g; o < i; ++o) s = e[o], d = s.source, f = s.target, p = f.x + f.vx - d.x - d.vx || Oa(l), m = f.y + f.vy - d.y - d.vy || Oa(l), h = Math.sqrt(p * p + m * m), h = (h - a[o]) / h * t * r[o], p *= h, m *= h, f.vx -= p * (g = c[o]), f.vy -= m * g, d.vx += p * (g = 1 - g), d.vy += m * g;
	}
	function p() {
		if (o) {
			var n, i = o.length, l = e.length, u = new Map(o.map((e, n) => [t(e, n, o), e])), d;
			for (n = 0, s = Array(i); n < l; ++n) d = e[n], d.index = n, typeof d.source != "object" && (d.source = Na(u, d.source)), typeof d.target != "object" && (d.target = Na(u, d.target)), s[d.source.index] = (s[d.source.index] || 0) + 1, s[d.target.index] = (s[d.target.index] || 0) + 1;
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
		return arguments.length ? (n = typeof e == "function" ? e : Da(+e), m(), f) : n;
	}, f.distance = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : Da(+e), h(), f) : i;
	}, f;
}
//#endregion
//#region node_modules/d3-force/src/lcg.js
var Fa = 1664525, Ia = 1013904223, La = 4294967296;
function Ra() {
	let e = 1;
	return () => (e = (Fa * e + Ia) % La) / La;
}
//#endregion
//#region node_modules/d3-force/src/simulation.js
function za(e) {
	return e.x;
}
function Ba(e) {
	return e.y;
}
var Va = 10, Ha = Math.PI * (3 - Math.sqrt(5));
function Ua(e) {
	var t, n = 1, r = .001, i = 1 - r ** (1 / 300), a = 0, o = .6, s = /* @__PURE__ */ new Map(), c = yr(d), l = y("tick", "end"), u = Ra();
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
				var i = Va * Math.sqrt(.5 + t), a = t * Ha;
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
function Wa() {
	var e, t, n, r, i = Da(-30), a, o = 1, s = Infinity, c = .81;
	function l(n) {
		var i, a = e.length, o = Ca(e, za, Ba).visitAfter(d);
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
		if (p * p / c < m) return m < s && (d === 0 && (d = Oa(n), m += d * d), f === 0 && (f = Oa(n), m += f * f), m < o && (m = Math.sqrt(o * m)), t.vx += d * e.value * r / m, t.vy += f * e.value * r / m), !0;
		if (!(e.length || m >= s)) {
			(e.data !== t || e.next) && (d === 0 && (d = Oa(n), m += d * d), f === 0 && (f = Oa(n), m += f * f), m < o && (m = Math.sqrt(o * m)));
			do
				e.data !== t && (p = a[e.data.index] * r / m, t.vx += d * p, t.vy += f * p);
			while (e = e.next);
		}
	}
	return l.initialize = function(t, r) {
		e = t, n = r, u();
	}, l.strength = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : Da(+e), u(), l) : i;
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
function Ga(e) {
	for (var t = -1, n = e.length, r = 0, i = 0, a, o = e[n - 1], s, c = 0; ++t < n;) a = o, o = e[t], c += s = a[0] * o[1] - o[0] * a[1], r += (a[0] + o[0]) * s, i += (a[1] + o[1]) * s;
	return c *= 3, [r / c, i / c];
}
//#endregion
//#region node_modules/d3-polygon/src/cross.js
function Ka(e, t, n) {
	return (t[0] - e[0]) * (n[1] - e[1]) - (t[1] - e[1]) * (n[0] - e[0]);
}
//#endregion
//#region node_modules/d3-polygon/src/hull.js
function qa(e, t) {
	return e[0] - t[0] || e[1] - t[1];
}
function Ja(e) {
	let t = e.length, n = [0, 1], r = 2, i;
	for (i = 2; i < t; ++i) {
		for (; r > 1 && Ka(e[n[r - 2]], e[n[r - 1]], e[i]) <= 0;) --r;
		n[r++] = i;
	}
	return n.slice(0, r);
}
function Ya(e) {
	if ((n = e.length) < 3) return null;
	var t, n, r = Array(n), i = Array(n);
	for (t = 0; t < n; ++t) r[t] = [
		+e[t][0],
		+e[t][1],
		t
	];
	for (r.sort(qa), t = 0; t < n; ++t) i[t] = [r[t][0], -r[t][1]];
	var a = Ja(r), o = Ja(i), s = o[0] === a[0], c = o[o.length - 1] === a[a.length - 1], l = [];
	for (t = a.length - 1; t >= 0; --t) l.push(e[r[a[t]][2]]);
	for (t = +s; t < o.length - c; ++t) l.push(e[r[o[t]][2]]);
	return l;
}
//#endregion
//#region node_modules/d3-shape/src/constant.js
function Xa(e) {
	return function() {
		return e;
	};
}
var Za = Math.PI;
Za / 2, 2 * Za;
//#endregion
//#region node_modules/d3-shape/src/path.js
function Qa(e) {
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
	}, () => new na(t);
}
Array.prototype.slice;
function $a(e) {
	return typeof e == "object" && "length" in e ? e : Array.from(e);
}
//#endregion
//#region node_modules/d3-shape/src/curve/linear.js
function eo(e) {
	this._context = e;
}
eo.prototype = {
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
function to(e) {
	return new eo(e);
}
//#endregion
//#region node_modules/d3-shape/src/point.js
function no(e) {
	return e[0];
}
function ro(e) {
	return e[1];
}
//#endregion
//#region node_modules/d3-shape/src/line.js
function io(e, t) {
	var n = Xa(!0), r = null, i = to, a = null, o = Qa(s);
	e = typeof e == "function" ? e : e === void 0 ? no : Xa(e), t = typeof t == "function" ? t : t === void 0 ? ro : Xa(t);
	function s(s) {
		var c, l = (s = $a(s)).length, u, d = !1, f;
		for (r ?? (a = i(f = o())), c = 0; c <= l; ++c) !(c < l && n(u = s[c], c, s)) === d && ((d = !d) ? a.lineStart() : a.lineEnd()), d && a.point(+e(u, c, s), +t(u, c, s));
		if (f) return a = null, f + "" || null;
	}
	return s.x = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : Xa(+t), s) : e;
	}, s.y = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : Xa(+e), s) : t;
	}, s.defined = function(e) {
		return arguments.length ? (n = typeof e == "function" ? e : Xa(!!e), s) : n;
	}, s.curve = function(e) {
		return arguments.length ? (i = e, r != null && (a = i(r)), s) : i;
	}, s.context = function(e) {
		return arguments.length ? (e == null ? r = a = null : a = i(r = e), s) : r;
	}, s;
}
//#endregion
//#region node_modules/d3-shape/src/noop.js
function ao() {}
//#endregion
//#region node_modules/d3-shape/src/curve/cardinal.js
function oo(e, t, n) {
	e._context.bezierCurveTo(e._x1 + e._k * (e._x2 - e._x0), e._y1 + e._k * (e._y2 - e._y0), e._x2 + e._k * (e._x1 - t), e._y2 + e._k * (e._y1 - n), e._x2, e._y2);
}
function so(e, t) {
	this._context = e, this._k = (1 - t) / 6;
}
so.prototype = {
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
				oo(this, this._x1, this._y1);
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
				oo(this, e, t);
				break;
		}
		this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
}, (function e(t) {
	function n(e) {
		return new so(e, t);
	}
	return n.tension = function(t) {
		return e(+t);
	}, n;
})(0);
//#endregion
//#region node_modules/d3-shape/src/curve/cardinalClosed.js
function co(e, t) {
	this._context = e, this._k = (1 - t) / 6;
}
co.prototype = {
	areaStart: ao,
	areaEnd: ao,
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
				oo(this, e, t);
				break;
		}
		this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
}, (function e(t) {
	function n(e) {
		return new co(e, t);
	}
	return n.tension = function(t) {
		return e(+t);
	}, n;
})(0);
//#endregion
//#region node_modules/d3-shape/src/curve/catmullRom.js
function lo(e, t, n) {
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
function uo(e, t) {
	this._context = e, this._alpha = t;
}
uo.prototype = {
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
				lo(this, e, t);
				break;
		}
		this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
}, (function e(t) {
	function n(e) {
		return t ? new uo(e, t) : new so(e, 0);
	}
	return n.alpha = function(t) {
		return e(+t);
	}, n;
})(.5);
//#endregion
//#region node_modules/d3-shape/src/curve/catmullRomClosed.js
function fo(e, t) {
	this._context = e, this._alpha = t;
}
fo.prototype = {
	areaStart: ao,
	areaEnd: ao,
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
				lo(this, e, t);
				break;
		}
		this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
};
var po = (function e(t) {
	function n(e) {
		return t ? new fo(e, t) : new co(e, 0);
	}
	return n.alpha = function(t) {
		return e(+t);
	}, n;
})(.5), mo = (e) => () => e;
//#endregion
//#region node_modules/d3-zoom/src/event.js
function ho(e, { sourceEvent: t, target: n, transform: r, dispatch: i }) {
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
function go(e, t, n) {
	this.k = e, this.x = t, this.y = n;
}
go.prototype = {
	constructor: go,
	scale: function(e) {
		return e === 1 ? this : new go(this.k * e, this.x, this.y);
	},
	translate: function(e, t) {
		return e === 0 & t === 0 ? this : new go(this.k, this.x + this.k * e, this.y + this.k * t);
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
var _o = new go(1, 0, 0);
vo.prototype = go.prototype;
function vo(e) {
	for (; !e.__zoom;) if (!(e = e.parentNode)) return _o;
	return e.__zoom;
}
//#endregion
//#region node_modules/d3-zoom/src/noevent.js
function yo(e) {
	e.stopImmediatePropagation();
}
function bo(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region node_modules/d3-zoom/src/zoom.js
function xo(e) {
	return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function So() {
	var e = this;
	return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function Co() {
	return this.__zoom || _o;
}
function wo(e) {
	return -e.deltaY * (e.deltaMode === 1 ? .05 : e.deltaMode ? 1 : .002) * (e.ctrlKey ? 10 : 1);
}
function To() {
	return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Eo(e, t, n) {
	var r = e.invertX(t[0][0]) - n[0][0], i = e.invertX(t[1][0]) - n[1][0], a = e.invertY(t[0][1]) - n[0][1], o = e.invertY(t[1][1]) - n[1][1];
	return e.translate(i > r ? (r + i) / 2 : Math.min(0, r) || Math.max(0, i), o > a ? (a + o) / 2 : Math.min(0, a) || Math.max(0, o));
}
function Do() {
	var e = xo, t = So, n = Eo, r = wo, i = To, a = [0, Infinity], o = [[-Infinity, -Infinity], [Infinity, Infinity]], s = 250, c = ir, l = y("start", "zoom", "end"), u, d, f, p = 500, m = 150, h = 0, g = 10;
	function _(e) {
		e.property("__zoom", Co).on("wheel.zoom", T, { passive: !1 }).on("mousedown.zoom", E).on("dblclick.zoom", D).filter(i).on("touchstart.zoom", O).on("touchmove.zoom", k).on("touchend.zoom touchcancel.zoom", A).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	}
	_.transform = function(e, t, n, r) {
		var i = e.selection ? e.selection() : e;
		i.property("__zoom", Co), e === i ? i.interrupt().each(function() {
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
			return n(_o.translate(c[0], c[1]).scale(s.k).translate(typeof r == "function" ? -r.apply(this, arguments) : -r, typeof i == "function" ? -i.apply(this, arguments) : -i), e, o);
		}, a, s);
	};
	function v(e, t) {
		return t = Math.max(a[0], Math.min(a[1], t)), t === e.k ? e : new go(t, e.x, e.y);
	}
	function b(e, t, n) {
		var r = t[0] - n[0] * e.k, i = t[1] - n[1] * e.k;
		return r === e.x && i === e.y ? e : new go(e.k, r, i);
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
					e = new go(n, l[0] - t[0] * n, l[1] - t[1] * n);
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
			l.call(e, this.that, new ho(e, {
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
		var s = C(this, i).event(t), c = this.__zoom, l = Math.max(a[0], Math.min(a[1], c.k * 2 ** r.apply(this, arguments))), u = W(t);
		if (s.wheel) (s.mouse[0][0] !== u[0] || s.mouse[0][1] !== u[1]) && (s.mouse[1] = c.invert(s.mouse[0] = u)), clearTimeout(s.wheel);
		else if (c.k === l) return;
		else s.mouse = [u, c.invert(u)], Nr(this), s.start();
		bo(t), s.wheel = setTimeout(d, m), s.zoom("mouse", n(b(v(c, l), s.mouse[0], s.mouse[1]), s.extent, o));
		function d() {
			s.wheel = null, s.end();
		}
	}
	function E(t, ...r) {
		if (f || !e.apply(this, arguments)) return;
		var i = t.currentTarget, a = C(this, r, !0).event(t), s = U(t.view).on("mousemove.zoom", d, !0).on("mouseup.zoom", p, !0), c = W(t, i), l = t.clientX, u = t.clientY;
		Rt(t.view), yo(t), a.mouse = [c, this.__zoom.invert(c)], Nr(this), a.start();
		function d(e) {
			if (bo(e), !a.moved) {
				var t = e.clientX - l, r = e.clientY - u;
				a.moved = t * t + r * r > h;
			}
			a.event(e).zoom("mouse", n(b(a.that.__zoom, a.mouse[0] = W(e, i), a.mouse[1]), a.extent, o));
		}
		function p(e) {
			s.on("mousemove.zoom mouseup.zoom", null), zt(e.view, a.moved), bo(e), a.event(e).end();
		}
	}
	function D(r, ...i) {
		if (e.apply(this, arguments)) {
			var a = this.__zoom, c = W(r.changedTouches ? r.changedTouches[0] : r, this), l = a.invert(c), u = a.k * (r.shiftKey ? .5 : 2), d = n(b(v(a, u), c, l), t.apply(this, i), o);
			bo(r), s > 0 ? U(this).transition().duration(s).call(S, d, c, r) : U(this).call(_.transform, d, c, r);
		}
	}
	function O(t, ...n) {
		if (e.apply(this, arguments)) {
			var r = t.touches, i = r.length, a = C(this, n, t.changedTouches.length === i).event(t), o, s, c, l;
			for (yo(t), s = 0; s < i; ++s) c = r[s], l = W(c, this), l = [
				l,
				this.__zoom.invert(l),
				c.identifier
			], a.touch0 ? !a.touch1 && a.touch0[2] !== l[2] && (a.touch1 = l, a.taps = 0) : (a.touch0 = l, o = !0, a.taps = 1 + !!u);
			u &&= clearTimeout(u), o && (a.taps < 2 && (d = l[0], u = setTimeout(function() {
				u = null;
			}, p)), Nr(this), a.start());
		}
	}
	function k(e, ...t) {
		if (this.__zooming) {
			var r = C(this, t).event(e), i = e.changedTouches, a = i.length, s, c, l, u;
			for (bo(e), s = 0; s < a; ++s) c = i[s], l = W(c, this), r.touch0 && r.touch0[2] === c.identifier ? r.touch0[0] = l : r.touch1 && r.touch1[2] === c.identifier && (r.touch1[0] = l);
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
			for (yo(e), f && clearTimeout(f), f = setTimeout(function() {
				f = null;
			}, p), a = 0; a < i; ++a) o = r[a], n.touch0 && n.touch0[2] === o.identifier ? delete n.touch0 : n.touch1 && n.touch1[2] === o.identifier && delete n.touch1;
			if (n.touch1 && !n.touch0 && (n.touch0 = n.touch1, delete n.touch1), n.touch0) n.touch0[1] = this.__zoom.invert(n.touch0[0]);
			else if (n.end(), n.taps === 2 && (o = W(o, this), Math.hypot(d[0] - o[0], d[1] - o[1]) < g)) {
				var s = U(this).on("dblclick.zoom");
				s && s.apply(this, arguments);
			}
		}
	}
	return _.wheelDelta = function(e) {
		return arguments.length ? (r = typeof e == "function" ? e : mo(+e), _) : r;
	}, _.filter = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : mo(!!t), _) : e;
	}, _.touchable = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : mo(!!e), _) : i;
	}, _.extent = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : mo([[+e[0][0], +e[0][1]], [+e[1][0], +e[1][1]]]), _) : t;
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
var Oo = {
	graphContainer: "_graphContainer_f264b_3",
	flowSingleDot: "_flowSingleDot_f264b_1"
}, ko = /* @__PURE__ */ m(((e, t) => {
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
})), Ao = (/* @__PURE__ */ m(((e, t) => {
	var { hashString: n, rng: r } = ko(), i = (e) => (Math.round(e * 10) / 10).toString();
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
})))(), G = {
	card: "_card_1nwir_5",
	draft: "_draft_1nwir_24",
	published: "_published_1nwir_28",
	pinned: "_pinned_1nwir_32",
	marker: "_marker_1nwir_37",
	title: "_title_1nwir_46",
	titleCentered: "_titleCentered_1nwir_57",
	titleInline: "_titleInline_1nwir_73",
	preview: "_preview_1nwir_83",
	scroll: "_scroll_1nwir_93",
	full: "_full_1nwir_109",
	popout: "_popout_1nwir_126",
	imageCard: "_imageCard_1nwir_145",
	imageFrame: "_imageFrame_1nwir_156",
	imageCaption: "_imageCaption_1nwir_173",
	scrollFull: "_scrollFull_1nwir_184",
	titleScrolling: "_titleScrolling_1nwir_188",
	imageMark: "_imageMark_1nwir_200",
	bookmarkMark: "_bookmarkMark_1nwir_214",
	bookmarkCount: "_bookmarkCount_1nwir_233",
	readersMark: "_readersMark_1nwir_242",
	glow: "_glow_1nwir_264",
	cardTitle: "_cardTitle_1nwir_274",
	resizeGrip: "_resizeGrip_1nwir_280",
	cardCenter: "_cardCenter_1nwir_324",
	cardSubtitle: "_cardSubtitle_1nwir_344",
	readBar: "_readBar_1nwir_390",
	readFill: "_readFill_1nwir_401",
	readMark: "_readMark_1nwir_408",
	complete: "_complete_1nwir_418",
	sketchBorder: "_sketchBorder_1nwir_428",
	sketchMain: "_sketchMain_1nwir_441",
	sketchGhost: "_sketchGhost_1nwir_442",
	linkCard: "_linkCard_1nwir_469",
	linkHover: "_linkHover_1nwir_477",
	linkTitle: "_linkTitle_1nwir_481",
	linkSubtitle: "_linkSubtitle_1nwir_488",
	linkBlurb: "_linkBlurb_1nwir_495",
	linkOut: "_linkOut_1nwir_505"
}, jo = {
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
}, Mo = 140, No = 80, Po = 700, Fo = 700;
function Io({ width: e, height: t, zoomScale: n = 1, onResize: i, onResizeEnd: a }) {
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
			t.includes("e") && (d = a + c), t.includes("w") && (d = a - c), t.includes("s") && (f = o + l), t.includes("n") && (f = o - l), d = Math.max(Mo, Math.min(Po, Math.round(d))), f = Math.max(No, Math.min(Fo, Math.round(f))), i && i({
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
		className: o ? jo.resizing : void 0,
		children: [
			/* @__PURE__ */ f("div", {
				className: `${jo.handle} ${jo.handleN}`,
				onPointerDown: (e) => d("n", e),
				title: "Drag to resize height"
			}),
			/* @__PURE__ */ f("div", {
				className: `${jo.handle} ${jo.handleS}`,
				onPointerDown: (e) => d("s", e),
				title: "Drag to resize height"
			}),
			/* @__PURE__ */ f("div", {
				className: `${jo.handle} ${jo.handleW}`,
				onPointerDown: (e) => d("w", e),
				title: "Drag to resize width"
			}),
			/* @__PURE__ */ f("div", {
				className: `${jo.handle} ${jo.handleE}`,
				onPointerDown: (e) => d("e", e),
				title: "Drag to resize width"
			}),
			/* @__PURE__ */ f("div", {
				className: `${jo.handle} ${jo.handleNW}`,
				onPointerDown: (e) => d("nw", e),
				title: "Drag to resize"
			}),
			/* @__PURE__ */ f("div", {
				className: `${jo.handle} ${jo.handleNE}`,
				onPointerDown: (e) => d("ne", e),
				title: "Drag to resize"
			}),
			/* @__PURE__ */ f("div", {
				className: `${jo.handle} ${jo.handleSW}`,
				onPointerDown: (e) => d("sw", e),
				title: "Drag to resize"
			}),
			/* @__PURE__ */ f("div", {
				className: `${jo.handle} ${jo.handleSE}`,
				onPointerDown: (e) => d("se", e),
				title: "Drag to resize"
			})
		]
	});
}
//#endregion
//#region src/components/NodeView/TextView/TextView.jsx
var Lo = (/* @__PURE__ */ m(((e, t) => {
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
})))(), Ro = /* @__PURE__ */ new Map();
function zo(e, t, n, r) {
	let i = `${e}|${Math.round(t)}|${Math.round(n)}|${r}`, a = Ro.get(i);
	return a || (Ro.size > 400 && Ro.clear(), a = (0, Ao.roughRect)(t, n, r, e), Ro.set(i, a)), a;
}
function Bo({ article: e, width: t, height: n, viewState: r, fullContent: i, onResize: a, cardSettings: o }) {
	let { hovered: s = !1, pinned: c = !1, lod: l = "full", zoomScale: u = 1 } = r || {}, d = s || c, m = c && !!i, h = !(e._status === "published" || e._status === "bloomed" || e.syndication && e.syndication.canonical), g = e.containerColor || e.color || e._source && e._source.color, _ = r?.contributionCount || 0, v = r?.bookmarkCount ?? (Array.isArray(r?.bookmarks) ? r.bookmarks.length : Array.isArray(e?.bookmarks) ? e.bookmarks.length : 0);
	if (e.kind === "image" && e.image) return /* @__PURE__ */ f(Go, {
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
	if (e.kind === "link" && e.link) return /* @__PURE__ */ f(Wo, {
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
		G.card,
		C && G.complete,
		g && !c && G.glow,
		h ? G.draft : G.published,
		d && G.expanded,
		c && G.pinned,
		r.lod === "marker" && !d && G.marker
	].filter(Boolean).join(" "), T = r.lod !== "marker", E = o?.cornerRadius == null ? 10 : o.cornerRadius, D = r.lod === "marker" && !d || !t || !n ? null : zo(e.id || e.title || "", t, n, E);
	return /* @__PURE__ */ p("div", {
		className: w,
		"data-pp-card": !0,
		style: {
			width: t,
			height: n,
			background: y,
			...o?.cornerRadius != null && !(r.lod === "marker" && !d) ? { borderRadius: o.cornerRadius } : {},
			...g && !c ? { "--nv-src": g } : {}
		},
		children: [
			D && /* @__PURE__ */ p("svg", {
				className: G.sketchBorder,
				viewBox: `0 0 ${t} ${n}`,
				preserveAspectRatio: "none",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ f("path", {
					className: G.sketchGhost,
					d: D.ghost
				}), /* @__PURE__ */ f("path", {
					className: G.sketchMain,
					d: D.main
				})]
			}),
			v > 0 && /* @__PURE__ */ p("div", {
				className: G.bookmarkMark,
				title: v === 1 ? "1 bookmark" : `${v} bookmarks`,
				children: [/* @__PURE__ */ f("svg", {
					viewBox: "0 0 16 16",
					width: "12",
					height: "12",
					fill: "currentColor",
					children: /* @__PURE__ */ f("path", { d: "M3 2v12l5-3 5 3V2z" })
				}), v > 1 && /* @__PURE__ */ f("span", {
					className: G.bookmarkCount,
					children: v
				})]
			}),
			_ > 0 && T && /* @__PURE__ */ p("div", {
				className: G.readersMark,
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
				className: G.imageMark,
				style: {
					backgroundImage: `url('${e.image}')`,
					...o?.imageMarkSize ? {
						width: o.imageMarkSize,
						height: o.imageMarkSize
					} : {}
				},
				title: "has an image"
			}),
			/* @__PURE__ */ f(Uo, {
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
				className: G.readBar,
				role: "progressbar",
				"aria-label": "Read",
				"aria-valuemin": 0,
				"aria-valuemax": 100,
				"aria-valuenow": Math.round((C ? 1 : S) * 100),
				"data-read-progress": C ? "done" : Math.round(S * 100),
				children: /* @__PURE__ */ f("div", {
					className: G.readFill,
					style: { width: `${(C ? 1 : S) * 100}%` }
				})
			}),
			T && C && /* @__PURE__ */ f("div", {
				className: G.readMark,
				title: "Read to the end",
				"aria-hidden": "true",
				children: "✓"
			}),
			c && /* @__PURE__ */ f(Ko, {}),
			T && /* @__PURE__ */ f(Io, {
				width: t,
				height: n,
				zoomScale: u,
				onResize: a
			})
		]
	});
}
function Vo(e, t, n, r = {}) {
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
var Ho = 260;
function Uo({ article: e, width: t, height: n, bandHeight: r = 0, viewState: i, expanded: a, useFullArticle: o, fullContent: s, cardSettings: c }) {
	if (a) {
		let t = o ? s : e.description || "", r = e.title || e.label;
		return n && n < Ho ? /* @__PURE__ */ p("div", {
			className: `${G.scroll} ${G.scrollFull} ${o ? G.full : ""} rp-scroll`,
			children: [/* @__PURE__ */ f("div", {
				className: G.titleScrolling,
				children: r
			}), t && /* @__PURE__ */ f("div", { dangerouslySetInnerHTML: { __html: t } })]
		}) : /* @__PURE__ */ p(d, { children: [/* @__PURE__ */ f("div", {
			className: G.title,
			children: r
		}), t && /* @__PURE__ */ f("div", {
			className: `${G.scroll} ${o ? G.full : ""} rp-scroll`,
			dangerouslySetInnerHTML: { __html: t }
		})] });
	}
	if (i.lod === "marker") return null;
	let l = c?.subtitle || typeof window < "u" && window.SETTINGS?.graph?.card?.subtitle, u = null;
	if (l && e.series_part != null && e.series_part !== "") {
		let t = e.series_part, n = (0, Lo.numberToLowercaseWords)(t);
		u = l.replace(/\{n\}/g, String(t)).replace(/\{n_words\}/g, n);
	}
	let m = i.lod === "slug" ? e.label || e.labelMedium || e.title || "" : e.title || e.label, h = Vo(m, t, u ? n - 30 : n, {
		min: c?.labelMinFontSize ?? 14,
		max: c?.labelMaxFontSize ?? 26,
		lineHeight: 1.05,
		pad: 8
	}), g = Math.max(11, Math.round(h * .62));
	return /* @__PURE__ */ p("div", {
		className: G.cardCenter,
		children: [/* @__PURE__ */ f("div", {
			className: G.cardTitle,
			style: { fontSize: `${h}px` },
			children: m
		}), u && /* @__PURE__ */ f("div", {
			className: G.cardSubtitle,
			style: { fontSize: `${g}px` },
			children: u
		})]
	});
}
function Wo({ article: e, width: t, height: n, viewState: r, cardSettings: i, sourceColor: a, isDraft: o, bgColor: s }) {
	let c = r.lod === "marker" && !r.hovered && !r.pinned, l = i?.cornerRadius == null ? 10 : i.cornerRadius, u = c || !t || !n ? null : zo(e.id || e.title || "", t, n, l), m = e.title || e.label || "", h = e.description || "", g = e.subtitle || "", _ = Vo(m, t, Math.max(30, (n || 0) * (h ? .42 : .8)), {
		min: Math.min(13, i?.labelMinFontSize ?? 13),
		max: Math.min(20, i?.labelMaxFontSize ?? 20),
		lineHeight: 1.1,
		pad: 8
	});
	return /* @__PURE__ */ p("div", {
		className: [
			G.card,
			o ? G.draft : G.published,
			G.linkCard,
			a && G.glow,
			r.hovered && G.linkHover,
			c && G.marker
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
			className: G.sketchBorder,
			viewBox: `0 0 ${t} ${n}`,
			preserveAspectRatio: "none",
			"aria-hidden": "true",
			children: [/* @__PURE__ */ f("path", {
				className: G.sketchGhost,
				d: u.ghost
			}), /* @__PURE__ */ f("path", {
				className: G.sketchMain,
				d: u.main
			})]
		}), !c && /* @__PURE__ */ p(d, { children: [
			/* @__PURE__ */ f("div", {
				className: G.linkTitle,
				style: { fontSize: `${_}px` },
				"data-link-title": !0,
				children: m
			}),
			g && /* @__PURE__ */ f("div", {
				className: G.linkSubtitle,
				"data-link-subtitle": !0,
				children: g
			}),
			h && /* @__PURE__ */ f("div", {
				className: G.linkBlurb,
				"data-link-blurb": !0,
				children: h
			}),
			/* @__PURE__ */ f("span", {
				className: G.linkOut,
				"data-link-out": !0,
				"aria-hidden": "true",
				children: "↗"
			})
		] })]
	});
}
function Go({ article: e, width: t, height: n, pinned: r, hovered: i, isDraft: a, zoomScale: o, bookmarkCount: s = 0, onResize: c }) {
	let l = [
		G.imageCard,
		a ? G.draft : G.published,
		r && G.pinned
	].filter(Boolean).join(" "), u = n - 24;
	return /* @__PURE__ */ p("div", {
		className: l,
		style: {
			width: t,
			height: n
		},
		children: [
			s > 0 && /* @__PURE__ */ p("div", {
				className: G.bookmarkMark,
				title: s === 1 ? "1 bookmark" : `${s} bookmarks`,
				children: [/* @__PURE__ */ f("svg", {
					viewBox: "0 0 16 16",
					width: "12",
					height: "12",
					fill: "currentColor",
					children: /* @__PURE__ */ f("path", { d: "M3 2v12l5-3 5 3V2z" })
				}), s > 1 && /* @__PURE__ */ f("span", {
					className: G.bookmarkCount,
					children: s
				})]
			}),
			/* @__PURE__ */ f("div", {
				className: G.imageFrame,
				style: {
					width: t,
					height: u,
					backgroundImage: `url('${e.image}')`
				}
			}),
			/* @__PURE__ */ f("div", {
				className: G.imageCaption,
				children: e.short_title || e.title || e.label
			}),
			r && /* @__PURE__ */ f(Ko, {}),
			/* @__PURE__ */ f(Io, {
				width: t,
				height: n,
				zoomScale: o,
				onResize: c
			})
		]
	});
}
function Ko() {
	return /* @__PURE__ */ f("div", {
		"data-popout": "1",
		title: "Open in reader",
		className: G.popout,
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
var qo = {
	text: Bo,
	essay: Bo,
	fragment: Bo,
	multi: Bo,
	image: Bo,
	"podcast-episode": Bo,
	video: Bo,
	link: Bo
};
function Jo(e, t = {}) {
	return {
		...qo,
		...t
	}[e] || Bo;
}
//#endregion
//#region src/components/GraphViewer/layouts.js
var Yo = /* @__PURE__ */ m(((e, t) => {
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
})), Xo = /* @__PURE__ */ m(((e, t) => {
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
	function l({ containers: e, members: t, labelSize: r, macroSize: l, closed: u, options: d = {} }) {
		let f = d.spacing == null ? 20 : d.spacing, p = d.gap == null ? 16 : d.gap, m = d.padding || (() => 40), h = d.mode === "scatter" || d.mode === "ring" ? d.mode : "path", g = u || /* @__PURE__ */ new Set(), _ = new Map(e.map((e) => [e.id, e])), v = new Map(e.map((e) => [e.id, []]));
		e.forEach((e, t) => {
			e.parent && v.has(e.parent) && v.get(e.parent).push({
				c: e,
				index: t
			});
		});
		function y(e, u, _) {
			if (_.has(e.id)) return null;
			_.add(e.id);
			let b = (e) => {
				let n = [...(t.get(e) || []).map((e) => e.id)];
				for (let { c: t } of v.get(e) || []) n.push(...b(t.id));
				return n;
			};
			if (g.has(e.id)) {
				let t = l && l(e) || {
					w: 260,
					h: 90
				}, n = o(0, 0, t.w, t.h), r = new Map(b(e.id).map((e) => [e, {
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
			let x = [];
			for (let { c: t, index: n } of v.get(e.id) || []) {
				let e = y(t, u + 1, _);
				e && (e.nodes.size === 0 && !g.has(t.id) || x.push({
					kind: "container",
					id: t.id,
					sub: e,
					w: e.box.x1 - e.box.x0,
					h: e.box.y1 - e.box.y0,
					order: Number.isFinite(t.order) ? t.order : null,
					index: -1e4 + n
				}));
			}
			(t.get(e.id) || []).forEach((e, t) => {
				x.push({
					kind: "node",
					id: e.id,
					w: e.w,
					h: e.h,
					order: e.order,
					date: e.date,
					index: t
				});
			}), x.sort(c);
			let S = r(e, u) || {
				w: 160,
				h: 60
			}, C = o(0, 0, S.w, S.h), w = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), E = [], D = null;
			if (x.length) {
				let e = x[0], t = S.h / 2 + p + e.h / 2, r = (e) => !a(e, C, p) && !E.some((t) => a(e, t, f)), s = x.some((e) => e.kind === "container"), c = x.some((e) => Number.isFinite(e.order)), l = s ? h === "scatter" ? "scatter" : "beside" : h === "ring" ? "ring" : h === "scatter" ? "scatter" : c ? "path" : "scatter", u = [];
				if (l === "path") {
					let e = d.direction === "inward";
					e && x.reverse();
					let t = S.h / 2 + p + x[0].h / 2, n = Math.max(...x.map((e) => Math.max(e.w, e.h))), a = d.startRadius == null ? n * .65 : d.startRadius, s = t + a, c = -Math.PI / 2, l = (e) => {
						let t = a * Math.exp(i * (e - c));
						return {
							x: 0 + t * Math.cos(e),
							y: s + t * Math.sin(e)
						};
					};
					D = {
						cx: 0,
						cy: s,
						a,
						b: i
					};
					let f = c;
					if (x.forEach((e, n) => {
						let s = {
							x: 0,
							y: t
						};
						if (n > 0) for (let t = 0; t < 2e5; t++) {
							let t = a * Math.exp(i * (f - c));
							if (f += 3 / (t * Math.sqrt(1 + i * i)), s = l(f), r(o(s.x, s.y, e.w, e.h))) break;
						}
						u.push(s), E.push(o(s.x, s.y, e.w, e.h));
					}), e) {
						x.reverse(), u.reverse(), E.reverse();
						for (let e of u) e.x = -e.x;
						for (let e of E) {
							let t = -e.x1;
							e.x1 = -e.x0, e.x0 = t;
						}
						D = {
							...D,
							mirrored: !0,
							inward: !0
						};
					}
				} else if (l === "ring") {
					let e = Math.max(...x.map((e) => Math.hypot(e.w, e.h))), t = x.length, n = Math.max(t > 1 ? t * (e + f) / (2 * Math.PI) : 0, Math.hypot(S.w, S.h) / 2 + e / 2 + p);
					for (let e = 0; e < 400; e++) {
						u.length = 0, E.length = 0;
						let e = !0;
						if (x.forEach((i, a) => {
							let s = -Math.PI / 2 + a / t * 2 * Math.PI, c = {
								x: n * Math.cos(s),
								y: 0 + n * Math.sin(s)
							}, l = o(c.x, c.y, i.w, i.h);
							r(l) || (e = !1), u.push(c), E.push(l);
						}), e) break;
						n += 8;
					}
				} else if (l === "beside") {
					u.push({
						x: 0,
						y: t
					}), E.push(o(0, t, e.w, e.h));
					let n = Math.max(C.x1, 0 + e.w / 2), r = Math.min(C.x0, 0 - e.w / 2), i = t + e.h / 2;
					x.slice(1).forEach((e, t) => {
						let a = -i / 2;
						a + e.h > i && (a = -e.h / 3);
						let s = a + e.h / 2, c;
						t % 2 == 0 ? (c = n + f * 2 + e.w / 2, n = c + e.w / 2) : (c = r - f * 2 - e.w / 2, r = c - e.w / 2), i = Math.max(i, a + e.h), u.push({
							x: c,
							y: s
						}), E.push(o(c, s, e.w, e.h));
					});
				} else {
					let e = x.reduce((e, t) => e + Math.hypot(t.w, t.h), 0) / x.length / 2 + f;
					x.forEach((i, a) => {
						let s = 0, c = t;
						if (a > 0) {
							let l = a * n, u = Math.cos(l), d = Math.sin(l), f = e * Math.sqrt(a);
							for (let e = 0; e < 2e3 && (s = 0 + u * f, c = t + d * f, !r(o(s, c, i.w, i.h))); e++) f += 8;
						}
						u.push({
							x: s,
							y: c
						}), E.push(o(s, c, i.w, i.h));
					});
				}
				x.forEach((e, t) => {
					let n = u[t].x, r = u[t].y;
					if (e.kind === "node") w.set(e.id, {
						x: n,
						y: r
					});
					else {
						let t = n - (e.sub.box.x0 + e.sub.box.x1) / 2, i = r - (e.sub.box.y0 + e.sub.box.y1) / 2;
						for (let [n, r] of e.sub.nodes) w.set(n, {
							x: r.x + t,
							y: r.y + i
						});
						for (let [n, r] of e.sub.containers) {
							let e = (e) => ({
								x0: e.x0 + t,
								y0: e.y0 + i,
								x1: e.x1 + t,
								y1: e.y1 + i
							});
							T.set(n, {
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
			let O = m(e, u) * 1.25, k = E.length ? s([C, ...E]) : C, A = {
				x0: k.x0 - O,
				y0: k.y0 - O,
				x1: k.x1 + O,
				y1: k.y1 + O
			};
			return T.set(e.id, {
				label: C,
				box: A,
				center: {
					x: 0,
					y: 0
				},
				closed: !1,
				spiral: D
			}), {
				box: A,
				nodes: w,
				containers: T
			};
		}
		let b = e.filter((e) => !e.parent || !_.has(e.parent)).map((e) => e.id), x = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map();
		for (let e of b) {
			let t = y(_.get(e), 0, /* @__PURE__ */ new Set());
			if (t) {
				for (let [n, r] of t.nodes) x.has(n) || x.set(n, {
					root: e,
					x: r.x,
					y: r.y
				});
				for (let [n, r] of t.containers) S.set(n, {
					root: e,
					...r
				});
			}
		}
		return {
			roots: b,
			nodes: x,
			containers: S
		};
	}
	t.exports = {
		containerLayout: l,
		rectsOverlap: a,
		compareUnits: c
	};
})), Zo = /* @__PURE__ */ m(((e, t) => {
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
})), Qo = /* @__PURE__ */ m(((e, t) => {
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
})), $o = /* @__PURE__ */ m(((e, t) => {
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
	t.exports = {
		closedMemberSet: n,
		edgeHidden: i,
		initiallyClosed: a
	};
})), es = /* @__PURE__ */ m(((e, t) => {
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
})), ts = /* @__PURE__ */ m(((e, t) => {
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
})), ns = /* @__PURE__ */ m(((e, t) => {
	var n = [
		"enabled",
		"mode",
		"spacing",
		"startRadius",
		"direction",
		"strength"
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
		if (!e || typeof e != "object") return null;
		let t = Object.keys(e).filter((t) => e[t] && Number.isFinite(Number(e[t].x)) && Number.isFinite(Number(e[t].y))).sort();
		return t.length ? t.map((t) => [
			t,
			Number(e[t].x),
			Number(e[t].y)
		]) : null;
	}
	function o(e, { anchors: t } = {}) {
		let o = e || {}, s = Number.isFinite(Number(o.layoutVersion)) && o.layoutVersion !== null && o.layoutVersion !== "" ? Number(o.layoutVersion) : 1, c = o.card || {}, l = {
			v: s,
			spiral: i(o.spiral, n),
			card: i(c, ["width", "height"]),
			sim: i(o.simulation, r)
		}, u = a(t);
		return u && (l.anchors = u), JSON.stringify(l);
	}
	function s(e) {
		let t = 2166136261;
		for (let n = 0; n < e.length; n += 1) t ^= e.charCodeAt(n), t = Math.imul(t, 16777619) >>> 0;
		return t.toString(36);
	}
	function c(e, t, n) {
		return `${e}@${s(o(t, n))}`;
	}
	t.exports = {
		layoutKey: c,
		layoutSignature: o
	};
})), rs = /* @__PURE__ */ m(((e, t) => {
	var { rootShape: n, rng: r, hashString: i } = ko(), a = {
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
})), is = /* @__PURE__ */ m(((e, t) => {
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
})), as = /* @__PURE__ */ m(((e, t) => {
	var { TIMES_OF_DAY: n, sceneMonth: r } = is(), i = {
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
})), os = /* @__PURE__ */ m(((e, t) => {
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
})), ss = /* @__PURE__ */ m(((e, t) => {
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
})), cs = Yo(), ls = Xo(), us = Zo(), ds = Qo(), fs = $o(), ps = es(), ms = ts(), hs = ko(), gs = ns(), _s = rs(), vs = as(), ys = os(), bs = ss(), xs = () => typeof window < "u" ? window.SETTINGS : null;
function Ss(e, t = {}) {
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
			link: (0, bs.isLinkItem)(r) ? (0, bs.linkOf)(r) : "",
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
function Cs(e, t, n) {
	let r = (e) => e && e.type === "article" && e._source && n.has(e._source.id), i = (e) => !!(e && (e._closedHidden || r(e)));
	e.selectAll(".node").style("display", (e) => i(e) ? "none" : null), t.selectAll(".node-card").style("display", (e) => i(e) ? "none" : null), e.selectAll(".link, .link-hit").style("display", (e) => {
		let t = typeof e.source == "object" ? e.source : null, n = typeof e.target == "object" ? e.target : null;
		return i(t) || i(n) ? "none" : null;
	});
}
function ws(e, t, n) {
	if (!n) {
		t.selectAll(".node-card").classed("dimmed", !1), e.selectAll(".node").classed("dimmed", !1), e.selectAll(".link").classed("dimmed", !1);
		return;
	}
	t.selectAll(".node-card").classed("dimmed", (e) => !n.has(e.id)), e.selectAll(".node").classed("dimmed", (e) => e.type === "article" ? !n.has(e.id) : !1), e.selectAll(".link").classed("dimmed", (e) => {
		let t = typeof e.source == "object" ? e.source.id : e.source, r = typeof e.target == "object" ? e.target.id : e.target;
		return !n.has(t) && !n.has(r);
	});
}
function Ts(e) {
	let t = {};
	for (let n of e && e.containers || []) {
		let e = (0, _s.fraction)(n.anchor);
		e && (t[n.id] = e);
	}
	return t;
}
function Es(e) {
	return e && (e.labelPosition === "top" || e.labelPosition === "hidden") ? e.labelPosition : "center";
}
var Ds = .35, Os = .6;
function ks(e) {
	return e < Ds ? "marker" : e < Os ? "title" : "full";
}
function As(e) {
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
function js({ feedData: e, onNodeSelect: n, hiddenSources: i, filteredArticleIds: a, viewState: o, layout: l = "force", timeAxis: d, graphSettings: p, colorOverrides: m, apiRef: v, onNodeFocus: y, contributions: b }) {
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
	}, E = s(null), D = s(null), O = s(null), k = s(n);
	r(() => {
		k.current = n;
	}, [n]);
	let A = s(y);
	r(() => {
		A.current = y;
	}, [y]);
	let ee = s(null), j = (e) => {
		ee.current = e ? e.id : null, A.current && A.current(e ? e.originalItem || e : null);
	}, M = s(o);
	r(() => {
		M.current = o;
	}, [o]);
	let N = As(S);
	S.glowPadding;
	let te = s(null), P = s(l), F = s(!1), I = s(null), L = s(null), ne = s(null), re = s(null), ie = s(b || []), ae = s(null), R = (e) => e.originalItem && e.originalItem.id || e.id, oe = s({
		settings: null,
		feed: null,
		keys: /* @__PURE__ */ new Map()
	}), se = (t) => {
		let n = oe.current;
		return (n.settings !== p || n.feed !== e) && (n.settings = p, n.feed = e, n.keys = /* @__PURE__ */ new Map()), n.keys.has(t) || n.keys.set(t, (0, gs.layoutKey)(t, p, { anchors: Ts(e) }) + "::"), n.keys.get(t);
	}, ce = (e) => se(P.current) + R(e), z = s(/* @__PURE__ */ new Set()), le = s(null), ue = s(1), de = s("full"), fe = s(/* @__PURE__ */ new Set());
	r(() => {
		fe.current = i instanceof Set ? i : new Set(i || []), !(!D.current || !O.current) && Cs(D.current, U(O.current), fe.current);
	}, [i]), r(() => {
		if (!(!E.current || !m)) for (let [e, t] of Object.entries(m)) t && E.current.style.setProperty(e, t);
	}, [m]);
	let [pe, me] = c(0);
	r(() => {
		if (!o) return;
		let e = o.historyVersion || 0;
		return o.subscribe(() => {
			let t = o.historyVersion || 0;
			t !== e && (e = t, me(t));
		});
	}, [o]), r(() => {
		if (o) return o.subscribe(() => {
			ne.current && ne.current(), re.current && re.current(), ae.current && ae.current();
		});
	}, [o]), r(() => {
		ie.current = b || [], ne.current && ne.current(), ae.current && ae.current({ rebuild: !0 });
	}, [b]), r(() => {
		!D.current || !O.current || ws(D.current, U(O.current), a);
	}, [a]), r(() => {
		if (!e || !E.current) return;
		let n = E.current, r = n.clientWidth, i = n.clientHeight, a = getComputedStyle(n), o = Ss(e, {
			tagColor: a.getPropertyValue("--gv-tag-color").trim() || "#f39c12",
			topologyColor: a.getPropertyValue("--gv-topology-color").trim() || "#9b59b6",
			placeholderColor: a.getPropertyValue("--gv-placeholder-color").trim() || "#7f8c8d",
			visibleLayers: Array.isArray(x.visibleLayers) ? x.visibleLayers : ["sequence"]
		});
		U(n).selectAll("svg").remove(), U(n).selectAll(".cards-layer").remove();
		let s = U(n).append("svg").attr("width", r).attr("height", i).style("position", "absolute").style("inset", "0").style("pointer-events", "all");
		D.current = s;
		let c = s.append("defs");
		c.append("marker").attr("id", "sequence-arrow").attr("viewBox", "0 0 10 10").attr("refX", 8).attr("refY", 5).attr("markerWidth", 7).attr("markerHeight", 7).attr("orient", "auto").append("path").attr("d", "M 0 1.5 L 8 5 L 0 8.5 z").attr("fill", "var(--gv-accent, #d4af37)");
		let l = U(n).append("div").attr("class", "cards-layer").style("position", "absolute").style("left", "0").style("top", "0").style("width", "100%").style("height", "100%").style("pointer-events", "none");
		O.current = l.node();
		let d = l.append("div").attr("class", "cards-transform").style("transform-origin", "0 0").style("position", "absolute").style("left", "0").style("top", "0").style("width", "0").style("height", "0").style("overflow", "visible"), f = s.append("g"), m = !1, y = !!x.initialFocus && x.initialFocus !== "all", b = x.initialFocusMinScale == null ? .4 : x.initialFocusMinScale, w = 0, A = null, F = 0, oe = !1, pe = !1, me = null, he = {
			x: 0,
			y: 0,
			k: 1
		}, ge = () => w ? ` rotate(${-w})` : "", _e = (e) => (0, ds.rotatedView)(e, A, w);
		function ve(e) {
			he = _e(e), f.attr("transform", `translate(${he.x},${he.y}) rotate(${w}) scale(${he.k})`), d && d.style("transform", `translate3d(${he.x}px, ${he.y}px, 0px) rotate(${w}deg) scale(${he.k})`), n && n.style.setProperty("--gv-unrot", `${-w}deg`), F !== w && (F = w, oe && pr());
		}
		let ye = (e, t) => (0, ds.viewToScreen)(he, w, e, t), be = Do().on("zoom", (e) => {
			e.sourceEvent && (m = !0, y = !1), ve(e.transform);
			let t = e.transform.k;
			ue.current = t, Rn && Vn(), L.current && L.current(), oe && tn();
			let n = ks(t);
			n !== de.current && (de.current = n, ir(), fr());
		});
		s.call(be).on("dblclick.zoom", null);
		let xe = (e) => {
			let t = e.touches[0], n = e.touches[1];
			return Math.atan2(n.clientY - t.clientY, n.clientX - t.clientX) * 180 / Math.PI;
		}, Se = (e) => {
			let t = n.getBoundingClientRect(), r = e.touches[0], i = e.touches[1];
			return [(r.clientX + i.clientX) / 2 - t.left, (r.clientY + i.clientY) / 2 - t.top];
		}, Ce = (e) => {
			if (e.touches.length !== 2) return;
			let [t, n] = Se(e);
			A = {
				theta0: w,
				a0: xe(e),
				mx: t,
				my: n,
				started: !1
			};
		}, we = (e) => {
			if (!A || e.touches.length !== 2) return;
			let [t, n] = Se(e);
			A.mx = t, A.my = n;
			let r = (0, ds.angleDelta)(xe(e), A.a0);
			if (!A.started) {
				if (Math.abs(r) < 10) return;
				A.started = !0, A.a0 = xe(e);
				return;
			}
			w = (0, ds.normalizeAngle)(A.theta0 + r);
		}, Te = (e) => {
			if (!A || e.touches.length >= 2) return;
			let t = _e(vo(s.node()));
			A = null, s.call(be.transform, _o.translate(t.x, t.y).scale(t.k));
		};
		n.addEventListener("touchstart", Ce, {
			capture: !0,
			passive: !0
		}), n.addEventListener("touchmove", we, {
			capture: !0,
			passive: !0
		}), n.addEventListener("touchend", Te, {
			capture: !0,
			passive: !0
		}), n.addEventListener("touchcancel", Te, {
			capture: !0,
			passive: !0
		});
		function Ee({ repaint: e = !0 } = {}) {
			if (!w && !A) return;
			A = null;
			let t = vo(s.node()), n = r / 2, a = i / 2, o = (0, ds.screenToView)(he, w, n, a);
			w = 0, e && s.call(be.transform, _o.translate(n - o[0] * t.k, a - o[1] * t.k).scale(t.k));
		}
		let De = (0, ps.createTapGate)({
			ms: Number.isFinite(x.doubleTapMs) ? x.doubleTapMs : 250,
			px: 32
		});
		function Oe(e) {
			let t = e && e.changedTouches && e.changedTouches.length ? e.changedTouches[0] : e, a = n.getBoundingClientRect();
			return !t || !Number.isFinite(t.clientX) ? [r / 2, i / 2] : [t.clientX - a.left, t.clientY - a.top];
		}
		function ke(e, t, n) {
			m = !0, y = !1, s.transition("tap-zoom").duration(320).ease(Vi).call(be.scaleBy, n, [e, t]);
		}
		function Ae(e, t, n) {
			let [r, i] = Oe(e), a = !!(e && e.shiftKey);
			De.tap(r, i, t, n || (() => ke(r, i, a ? .5 : 2)));
		}
		let je = null, Me = null, Ne = (e) => {
			if (e.touches.length === 2) {
				let [t, n] = Se(e);
				je = {
					t: Date.now(),
					x: t,
					y: n,
					moved: !1
				};
			} else e.touches.length > 2 && (je = null);
		}, Pe = (e) => {
			if (!je || e.touches.length !== 2) return;
			let [t, n] = Se(e);
			Math.hypot(t - je.x, n - je.y) > 14 && (je.moved = !0);
		}, Fe = (e) => {
			if (!je || e.touches.length > 0) return;
			let t = je;
			je = null;
			let n = Date.now();
			t.moved || n - t.t > 350 || (Me && n - Me.t <= 450 && Math.hypot(t.x - Me.x, t.y - Me.y) <= 60 ? (Me = null, ke(t.x, t.y, .5)) : Me = {
				t: n,
				x: t.x,
				y: t.y
			});
		};
		n.addEventListener("touchstart", Ne, {
			capture: !0,
			passive: !0
		}), n.addEventListener("touchmove", Pe, {
			capture: !0,
			passive: !0
		}), n.addEventListener("touchend", Fe, {
			capture: !0,
			passive: !0
		});
		let Ie = !1;
		if (M.current && (Ie = (0, cs.layoutIsDegenerate)(o.nodes.map((e) => M.current.nodeState(ce(e))).filter((e) => e && Number.isFinite(e.x) && Number.isFinite(e.y)), N({
			hovered: !1,
			pinned: !1
		}))), M.current && !Ie) for (let e of o.nodes) {
			let t = M.current.nodeState(ce(e)), n = M.current.nodeState(R(e));
			t && typeof t.x == "number" && typeof t.y == "number" && (e.x = t.x, e.y = t.y, t.auto || (e.fx = t.x, e.fy = t.y)), n && typeof n.w == "number" && typeof n.h == "number" && (e._size = {
				width: n.w,
				height: n.h
			});
		}
		if (z.current = /* @__PURE__ */ new Set(), M.current) for (let e of o.nodes) {
			let t = M.current.nodeState(R(e));
			e.type === "article" && !e.link && t && t.pinned && z.current.add(e.id);
		}
		if (M.current && Ie) for (let e of o.nodes) {
			let t = M.current.nodeState(R(e));
			t && typeof t.w == "number" && typeof t.h == "number" && (e._size = {
				width: t.w,
				height: t.h
			});
		}
		let Le = Ua().force("link", Pa().id((e) => e.id).distance(T.linkDistance)).force("charge", Wa().strength(T.chargeStrength)).force("collide", ja().radius((e) => (e._r || (e.type === "article" ? Math.hypot(S.width, S.height) / 2 : e.size / 2)) + T.collidePadding).strength(1).iterations(3)).force("center", ia(r / 2, i / 2)).velocityDecay(T.velocityDecay).alphaDecay(T.alphaDecay), Re = () => {
			I.current && I.current(), E.current && (r = E.current.clientWidth, i = E.current.clientHeight, s.attr("width", r).attr("height", i));
		};
		window.addEventListener("resize", Re);
		let ze = s.append("g").attr("class", "time-axis-layer"), Be = f.append("g").attr("class", "roots-layer").attr("aria-hidden", "true").style("pointer-events", "none"), Ve = f.append("g").attr("class", "containers-layer"), He = /* @__PURE__ */ new Map(), Ue = /* @__PURE__ */ new Map();
		for (let e of o.containers || []) He.set(e.id, /* @__PURE__ */ new Set()), Ue.set(e.id, /* @__PURE__ */ new Set());
		for (let e of o.containmentEdges || []) He.has(e.source) && He.has(e.target) ? He.get(e.source).add(e.target) : Ue.has(e.source) && Ue.get(e.source).add(e.target);
		let We = /* @__PURE__ */ new Map();
		function Ge(e, t) {
			if (!t && We.has(e)) return We.get(e);
			let n = t || /* @__PURE__ */ new Set();
			if (n.has(e)) return [];
			n.add(e);
			let r = Array.from(Ue.get(e) || []), i = Array.from(He.get(e) || []).flatMap((e) => Ge(e, n)), a = Array.from(new Set([...r, ...i]));
			return t || We.set(e, a), a;
		}
		let Ke = [...o.containers || []].sort((e, t) => t.parent === e.id ? -1 : +(e.parent === t.id)), qe = Ve.selectAll(".container-group").data(Ke, (e) => e.id).enter().append("g").attr("class", "container-group").attr("data-container-id", (e) => e.id);
		qe.append("path").attr("class", "container-hull").attr("fill", (e) => e.fill || "rgba(212, 175, 55, 0.03)").attr("stroke", (e) => e.stroke || "rgba(212, 175, 55, 0.45)").attr("stroke-width", (e) => e.strokeWidth || 1.5).attr("stroke-dasharray", (e) => e.strokeDasharray || (e.parent ? null : "6 6")), qe.append("path").attr("class", "container-hull-ghost").attr("stroke", (e) => e.stroke || "rgba(212, 175, 55, 0.45)");
		let Je = typeof document < "u" && document.documentElement.getAttribute("data-pp-theme") === "sketchbook", Ye = () => (0, fs.initiallyClosed)(e.containers || [], x), B = new Set(Ye()), Xe = /* @__PURE__ */ new Map(), Ze = /* @__PURE__ */ new Map(), Qe = 1.05, $e = (0, us.showContainerCount)(x);
		function et(e) {
			let t = (e.label || e.id).split(/\s+/), n = [], r = "";
			for (let e of t) r ? r.length + 1 + e.length > 15 ? (n.push(r), r = e) : r += " " + e : r = e;
			return r && n.push(r), n;
		}
		let tt = .42, nt = .2, rt = (e) => e.status ? String(e.status) : "";
		function it(e) {
			let t = et(e).length, n = rt(e) ? nt + tt * 1.3 : 0;
			return {
				n: t,
				statusH: n,
				total: t * Qe + n
			};
		}
		function at(e, t) {
			let n = et(t), { n: r, total: i } = it(t), a = -i / 2;
			e.selectAll("*").remove(), n.forEach((t, n) => {
				e.append("tspan").attr("class", "label-line").attr("x", 0).attr("y", `${a + (n + .5) * Qe}em`).text(t), $e && n === r - 1 && e.append("tspan").attr("class", "label-count").attr("font-weight", "500").attr("dx", "12px").attr("font-size", "0.5em").text("");
			});
			let o = rt(t);
			if (o) {
				let t = a + r * Qe + nt + tt * 1.3 / 2;
				e.append("tspan").attr("class", "label-status").attr("x", 0).attr("font-size", `${tt}em`).attr("font-weight", "500").attr("letter-spacing", "0.02em").attr("y", `${t / tt}em`).text(o);
			}
		}
		let ot = typeof document < "u" ? document.createElement("canvas").getContext("2d") : null;
		function st() {
			return typeof document > "u" ? "'Atkinson', sans-serif" : getComputedStyle(document.documentElement).getPropertyValue("--pp-title-font").trim() || "'Atkinson', sans-serif";
		}
		function ct(e, t, n) {
			let r = e.length * t * .05;
			return ot ? (ot.font = `${Je ? 400 : n} ${t}px ${st()}`, ot.measureText(e).width * 1.06 + r) : e.length * t * .6 + r;
		}
		function lt(e, t) {
			let n = et(e), r = $e ? ct(" 000", t * .5, 500) + 12 : 0, i = rt(e), a = Math.max(...n.map((e, i) => ct(e, t, 700) + (i === n.length - 1 ? r : 0)), i ? ct(i, t * tt, 500) : 0), o = it(e).total * t + .3 * t;
			return {
				w: a + 24,
				h: o + 12
			};
		}
		function ut(e) {
			return e.badgeColor || e.color || e.stroke || "#d4af37";
		}
		let dt = qe.append("g").attr("class", "container-badge").attr("data-container-top", (e) => e.parent ? null : "").style("touch-action", "manipulation");
		dt.append("rect").attr("class", "container-badge-hit").attr("fill", "transparent").attr("pointer-events", "all");
		let ft = dt.append("text").attr("class", "container-badge-text").attr("text-anchor", "middle").attr("dominant-baseline", "central").style("user-select", "none").attr("fill", (e) => ut(e)).attr("opacity", .55).attr("font-size", (e) => e.parent ? "52px" : "64px");
		ft.each(function(e) {
			at(U(this), e);
		});
		function pt() {
			if (typeof document > "u") return;
			let e = typeof window < "u" ? window.SETTINGS : null, t = document.documentElement.getAttribute("data-pp-mode") || "dark", n = getComputedStyle(document.body).backgroundColor, r = !n || /rgba\([^)]*,\s*0\)$/.test(n) || n === "transparent", i = (0, vs.allBackgrounds)((0, vs.config)(e), t, r ? null : n);
			ft.each(function(e) {
				let t = (0, vs.legibleOn)(ut(e), i, { opacity: .55 });
				U(this).attr("fill", t.color).attr("opacity", t.opacity);
			});
		}
		pt();
		function mt() {
			pt();
			let e = document.documentElement.getAttribute("data-pp-theme") === "sketchbook";
			if (e === Je) return;
			Je = e;
			let t = () => {
				oe && (xn(), pr());
			};
			document.fonts && document.fonts.load ? document.fonts.load(`48px ${st()}`).then(t, t) : t();
		}
		let ht = typeof MutationObserver < "u" ? new MutationObserver(mt) : null;
		Je && typeof document < "u" && document.fonts && document.fonts.load && document.fonts.load(`48px ${st()}`).then(() => {
			!oe || !D.current || (xn(), pr());
		}, () => {}), ht && ht.observe(document.documentElement, {
			attributes: !0,
			attributeFilter: ["data-pp-mode", "data-pp-theme"]
		});
		let gt = qe.append("g").attr("class", "container-macro-node").style("display", "none").style("touch-action", "manipulation");
		gt.append("path").attr("class", "container-macro-bg").style("fill", (e) => `color-mix(in srgb, ${ut(e)} 16%, var(--pp-macro-base, #151826))`).attr("stroke", (e) => ut(e)).attr("stroke-width", 2.2).style("filter", (e) => `drop-shadow(0 0 18px color-mix(in srgb, ${ut(e)} 45%, transparent))`);
		let _t = Math.round((S.labelMaxFontSize || 26) * 1.6), vt = gt.append("text").attr("class", "container-macro-text").attr("text-anchor", "middle").attr("dominant-baseline", "central").attr("fill", (e) => ut(e)).attr("font-size", (e) => `${e.parent ? _t : Math.round(_t * 1.25)}px`).attr("font-family", "'Atkinson', sans-serif").attr("font-weight", "700").attr("letter-spacing", "-0.02em"), yt = io().curve(po.alpha(.5));
		function bt(e, t, n) {
			let r = 0;
			for (let t = 0; t < e.length; t++) r = r * 31 + e.charCodeAt(t) >>> 0;
			let i = () => (r = r * 1664525 + 1013904223 >>> 0, r / 4294967296), a = [];
			for (let e = 0; e < 14; e++) {
				let r = e / 14 * Math.PI * 2, o = Math.cos(r), s = Math.sin(r), c = 2 / 2.8, l = 1 + (i() - .5) * .08;
				a.push([Math.sign(o) * Math.abs(o) ** +c * t * l, Math.sign(s) * Math.abs(s) ** +c * n * l]);
			}
			return yt(a);
		}
		vt.each(function(e) {
			at(U(this), e);
		});
		function xt() {
			gt.each(function(e) {
				let t = U(this), n = parseFloat(t.select(".container-macro-text").attr("font-size")) || _t, r = lt(e, n), i = Math.max(S.width * 1.5, r.w + n * 1.4), a = Math.max(S.height * 1.5, r.h + n * 1.4);
				t.select(".container-macro-bg").attr("d", bt(e.id, i / 2, a / 2)), e._macroHalfW = i / 2, e._macroHalfH = a / 2;
			});
		}
		xt();
		function St({ isCollapsed: e }) {
			return Kt().clickDistance(5).filter((e) => !(e.ctrlKey || e.button !== void 0 && e.button !== 0)).on("start", function(e, t) {
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
				let r = e.x - n.lastX, i = e.y - n.lastY;
				n.lastX = e.x, n.lastY = e.y, n.totalMove += Math.hypot(r, i);
				let a = Ge(t.id);
				for (let e of a) {
					let t = V.get(e);
					t && (t.x += r, t.y += i, t.fx = t.x, t.fy = t.y, M.current && M.current.setNodePosition(ce(t), t.x, t.y, { transient: !0 }));
				}
				pr(), L.current && L.current();
			}).on("end", function(t, n) {
				let r = U(this).datum()._dragState;
				if (delete U(this).datum()._dragState, (r ? r.totalMove : 0) >= 4) {
					Vt = !1;
					let e = Ge(n.id);
					if (pe) {
						let t = new Set(e);
						for (let e of W.keys()) {
							let n = Ge(e);
							n.length && n.every((e) => t.has(e)) && Gt(e);
						}
					}
					let t = M.current;
					for (let n of e) {
						let e = V.get(n);
						e && (e.fx = e.x, e.fy = e.y, t && t.setNodePosition(ce(e), e.x, e.y, { transient: !0 }));
					}
					t && t.commit(), pr();
				} else {
					let r = () => {
						e ? vn([n.id], !0) : vn([n.id], B.has(n.id));
					};
					(p.collapseGesture || "tap") === "doubletap" ? Ae(t.sourceEvent, () => {}, r) : Ae(t.sourceEvent, r);
				}
			});
		}
		dt.call(St({ isCollapsed: !1 })), gt.call(St({ isCollapsed: !0 })), dt.on("click", (e) => e.stopPropagation()), gt.on("click", (e) => e.stopPropagation());
		let Ct = io().curve(po.alpha(.5)), V = new Map(o.nodes.map((e) => [e.id, e])), wt = new Map((o.containers || []).map((e) => [e.id, e])), Tt = (e) => {
			let t = 0, n = e.parent;
			for (; n && wt.has(n) && t < 20;) t++, n = wt.get(n).parent;
			return t;
		}, Et = p.labelSize && p.labelSize.min || 32, Dt = p.labelSize && p.labelSize.max || 96, Ot = p.labelSize && p.labelSize.nestedScale || .75, kt = () => {
			let e = /* @__PURE__ */ new Map();
			for (let t of o.containers || []) e.set(t.id, Array.from(Ue.get(t.id) || []).map((e) => V.get(e)).filter(Boolean).map((e) => ({
				id: e.id,
				w: e._size && e._size.width || (e.type === "article" ? S.width : e.size),
				h: e._size && e._size.height || (e.type === "article" ? S.height : e.size),
				order: Number.isFinite(e.series_part) ? e.series_part : null,
				date: e.date || ""
			})));
			return e;
		}, H = {
			roots: [],
			nodes: /* @__PURE__ */ new Map(),
			containers: /* @__PURE__ */ new Map()
		};
		function At() {
			if (!o.containers || o.containers.length === 0) return;
			let e = kt(), t = () => (0, ls.containerLayout)({
				containers: o.containers,
				members: e,
				closed: B,
				labelSize: (e) => lt(e, e._fs || Et),
				macroSize: (e) => ({
					w: (e._macroHalfW || 130) * 2,
					h: (e._macroHalfH || 45) * 2
				}),
				options: {
					spacing: p.spiral?.spacing ?? 20,
					mode: P.current === "radial" ? "ring" : p.spiral?.mode || "path",
					startRadius: p.spiral?.startRadius,
					direction: p.spiral?.direction,
					gap: 28,
					padding: (e) => e.padding == null ? e.parent ? 42 : 75 : e.padding
				}
			});
			for (let e of o.containers) e._fs = Et;
			let n = t();
			for (let e of o.containers) {
				let t = n.containers.get(e.id), r = t ? t.box.x1 - t.box.x0 : 0, i = Dt * Ot ** +Tt(e);
				e._fs = Math.max(Et, Math.min(Math.max(Et, i), r / 8));
			}
			n = t(), H = n;
		}
		function jt(e) {
			if (pe && Ft()) {
				let t = 0, n = 0, r = 0;
				for (let i of W.keys()) {
					let a = H.containers.get(i);
					if (!a || a.root !== e) continue;
					let o = Mt(i);
					o && (t += o.x, n += o.y, r++);
				}
				if (r) return {
					x: t / r,
					y: n / r
				};
			}
			let t = 0, n = 0, r = 0;
			for (let [i, a] of H.nodes) {
				if (a.root !== e) continue;
				let o = V.get(i);
				!o || !Number.isFinite(o.x) || !Number.isFinite(o.y) || (t += o.x - a.x, n += o.y - a.y, r++);
			}
			return r ? {
				x: t / r,
				y: n / r
			} : null;
		}
		function Mt(e) {
			let t = 0, n = 0, r = 0;
			for (let i of Ge(e)) {
				let e = H.nodes.get(i), a = V.get(i);
				!e || !a || !Number.isFinite(a.x) || !Number.isFinite(a.y) || (t += a.x - e.x, n += a.y - e.y, r++);
			}
			return r ? {
				x: t / r,
				y: n / r
			} : null;
		}
		let Nt = () => p.spiral?.enabled !== !1 && (P.current === "force" || P.current === "radial"), W = new Map(Object.entries(Ts(e)).filter(([e]) => wt.has(e))), Pt = typeof window < "u" && window.PostPipeCoverFrame || null, Ft = () => W.size > 0 && !!(Pt && Pt.art) && Nt() && P.current === "force" && H.containers.size > 0, It = /* @__PURE__ */ new Map();
		for (let e of [...W.keys()].sort((e, t) => Tt(wt.get(t)) - Tt(wt.get(e)))) for (let t of Ge(e)) It.has(t) || It.set(t, e);
		pe = !0;
		function Lt(e) {
			let t = H.containers.get(e), n = t && Mt(e);
			return n ? {
				x: n.x + t.center.x,
				y: n.y + t.center.y
			} : null;
		}
		function Rt() {
			if (!E.current) return {
				x: 0,
				y: 0
			};
			let e = E.current.getBoundingClientRect(), t = typeof window < "u" && window.PostPipeCover && window.PostPipeCover.shift || 0;
			return {
				x: e.left,
				y: e.top - t
			};
		}
		function zt() {
			let e = /* @__PURE__ */ new Map();
			if (!Ft()) return e;
			let t = (0, _s.homeView)(b), n = Rt();
			for (let [r, i] of W) e.set(r, (0, _s.anchorWorld)(i, Pt.art, t, n));
			return e;
		}
		let Bt = /* @__PURE__ */ new Set(), Vt = !1, Ht = (e) => se(P.current) + e, Ut = /* @__PURE__ */ new Set();
		function Wt(e) {
			let t = M.current;
			if (!t) return Ut.has(e);
			let n = t.nodeState(Ht(e));
			return !!(n && !n.auto && Number.isFinite(n.x));
		}
		function Gt(e) {
			let t = Lt(e), n = M.current;
			n && t ? n.setNodePosition(Ht(e), t.x, t.y, { transient: !0 }) : Ut.add(e);
		}
		let qt = /* @__PURE__ */ new Map();
		for (let e of W.keys()) {
			let t = M.current;
			if (t && Wt(e)) {
				let n = t.nodeState(Ht(e));
				for (let t of Ge(e)) {
					if (It.get(t) !== e) continue;
					let n = V.get(t);
					n && Number.isFinite(n.x) && Number.isFinite(n.y) && (n.fx = n.x, n.fy = n.y);
				}
				qt.set(e, {
					x: n.x,
					y: n.y
				});
			} else Bt.add(e);
		}
		function Jt(e) {
			for (let [t, n] of e) {
				let e = Lt(t);
				if (!n || !e) continue;
				let r = n.x - e.x, i = n.y - e.y;
				for (let e of Ge(t)) {
					let t = V.get(e);
					!t || !Number.isFinite(t.x) || !Number.isFinite(t.y) || (t.x += r, t.y += i, t.fx = t.x, t.fy = t.y, t.vx = 0, t.vy = 0);
				}
			}
		}
		function Yt(e = [...W.keys()]) {
			if (!Ft()) return !1;
			let t = zt();
			Jt(e.map((e) => [e, t.get(e)]));
			for (let t of e) Bt.delete(t);
			return e.length, W.size, !0;
		}
		function Xt() {
			return qt.size ? (Jt([...qt]), qt.clear(), !0) : !1;
		}
		let Zt = () => W.size ? [...W.keys()] : (o.containers || []).filter((e) => e.parent && !wt.get(e.parent)?.parent).map((e) => e.id), Qt = /* @__PURE__ */ new WeakMap();
		function $t(e) {
			let t = e.getAttribute("d") || "", n = Qt.get(e);
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
			return Qt.set(e, {
				d: t,
				pts: r
			}), r;
		}
		function en() {
			let e = [];
			if (!oe) return {
				containers: e,
				k: ue.current,
				homeK: me
			};
			for (let t of Zt()) {
				let n = qe.filter((e) => e.id === t), r = n.node();
				if (!r || r.style.display === "none") continue;
				let i = B.has(t), a = n.select(i ? ".container-macro-bg" : ".container-hull").node();
				if (!a || !i && a.style.display === "none") continue;
				let o = $t(a), s = a.getScreenCTM();
				if (!s || o.length < 3) continue;
				let c = o.map(([e, t]) => ({
					x: s.a * e + s.c * t + s.e,
					y: s.b * e + s.d * t + s.f
				})), l = 0, u = 0;
				for (let e of c) l += e.x, u += e.y;
				e.push({
					id: t,
					closed: i,
					hull: c,
					centre: {
						x: l / c.length,
						y: u / c.length
					}
				});
			}
			return {
				containers: e,
				k: ue.current,
				homeK: me
			};
		}
		function tn() {
			typeof window > "u" || window.dispatchEvent(new CustomEvent("graph:world"));
		}
		typeof window < "u" && (window.PostPipeGraphWorld = { snapshot: en });
		function nn() {
			function e(e) {
				if (!Nt() || P.current !== "force") return;
				let t = p.spiral?.strength ?? .35, n = /* @__PURE__ */ new Map();
				if (Ft()) for (let e of W.keys()) n.set(e, Mt(e));
				for (let r of H.roots) {
					let i = jt(r);
					for (let [a, o] of H.nodes) {
						if (o.root !== r) continue;
						let s = V.get(a);
						if (!s || !Number.isFinite(s.x)) continue;
						let c = It.get(a), l = c && n.get(c) || i;
						l && (s.vx += (l.x + o.x - s.x) * t * e, s.vy += (l.y + o.y - s.y) * t * e);
					}
				}
			}
			return e.initialize = function() {}, e;
		}
		function rn() {
			let e = [], t = (e) => e.type === "article" ? Math.hypot(e._size?.width || S.width, e._size?.height || S.height) / 2 : e._r || (e.size || 60) / 2;
			function n(n) {
				if (!o.containers || o.containers.length === 0) return;
				let r = [];
				for (let e of H.roots) {
					let t = H.containers.get(e), n = jt(e);
					if (!t || !n) continue;
					let i = Ge(e).map((e) => V.get(e)).filter((e) => e && Number.isFinite(e.x));
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
				let s = new Set(H.nodes.keys()), c = (e.length ? e : o.nodes).filter((e) => !s.has(e.id) && Number.isFinite(e.x));
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
		o.containers && o.containers.length > 0 && (At(), Le.force("containerSeparation", rn()), Le.force("containerLayout", nn()));
		let an = /* @__PURE__ */ new Set(), on = (e) => (H.nodes.get(e) || {}).root || null, sn = (e) => typeof e == "object" ? e.id : e;
		function cn() {
			an = /* @__PURE__ */ new Set();
			for (let e of B) for (let t of Ge(e)) an.add(t);
			Le.force("collide").radius((e) => an.has(e.id) ? 0 : H.nodes.has(e.id) && e.type === "article" ? Math.min(e._size?.width || S.width, e._size?.height || S.height) / 2 : (e._r || (e.type === "article" ? Math.hypot(S.width, S.height) / 2 : e.size / 2)) + T.collidePadding), Le.force("charge").strength((e) => an.has(e.id) ? 0 : H.nodes.has(e.id) ? T.chargeStrength * .05 : T.chargeStrength);
		}
		if (H.nodes.size > 0) {
			cn();
			let e = Le.force("link"), t = e.strength();
			e.strength((e) => {
				let n = on(sn(e.source));
				return n && n === on(sn(e.target)) ? 0 : t(e);
			});
		}
		function ln(e) {
			let t = r / 2;
			for (let n of H.roots) {
				let a = H.containers.get(n);
				if (!a) continue;
				let o = a.box.x1 - a.box.x0, s = t - (a.box.x0 + a.box.x1) / 2 + (t === r / 2 ? 0 : o / 2), c = i / 2 - (a.box.y0 + a.box.y1) / 2;
				for (let [t, r] of H.nodes) {
					if (r.root !== n) continue;
					let i = V.get(t);
					i && (e || !Number.isFinite(i.x) || !Number.isFinite(i.y)) && (i.x = s + r.x, i.y = c + r.y, i.vx = 0, i.vy = 0);
				}
				t += (t === r / 2 ? o / 2 : o) + 200;
			}
		}
		H.nodes.size > 0 && ln(Ie);
		function un() {
			if (!o.containers || o.containers.length === 0 || (At(), cn(), H.nodes.size === 0)) return null;
			let e = {}, t = 0;
			for (let n of H.roots) {
				let r = H.containers.get(n);
				if (!r) continue;
				let i = t - r.box.x0, a = -(r.box.y0 + r.box.y1) / 2;
				for (let [t, r] of H.nodes) r.root === n && (e[t] = {
					x: i + r.x,
					y: a + r.y
				});
				t += r.box.x1 - r.box.x0 + 200;
			}
			let n = o.nodes.filter((e) => !H.nodes.has(e.id));
			if (n.length) {
				let r = (0, cs.radialLayout)(n, {
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
		function dn() {
			!o.containers || o.containers.length === 0 || (At(), cn());
		}
		function fn(e) {
			let t = e.parent, n = 0;
			for (; t && n++ < 20;) {
				if (B.has(t)) return !0;
				t = wt.get(t)?.parent;
			}
			return !1;
		}
		function pn() {
			if (Ke.length === 0) return;
			tn();
			let e = Nt() && H.containers.size > 0, t = (t) => {
				let n = e ? H.containers.get(t.id) : null, r = n ? Mt(t.id) : null;
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
				let r = Ge(e.id).map((e) => V.get(e)).filter((e) => e && Number.isFinite(e.x));
				return r.length ? {
					x: _(r, (e) => e.x),
					y: _(r, (e) => e.y)
				} : null;
			};
			qe.each(function(e) {
				let r = U(this), i = Ge(e.id).map((e) => V.get(e)).filter((e) => e && Number.isFinite(e.x) && Number.isFinite(e.y));
				if (i.length === 0 || fn(e)) {
					r.style("display", "none"), Ze.delete(e.id);
					return;
				}
				let a = B.has(e.id), o = e._fs || 52, s = t(e);
				if (a) {
					let t = n(e);
					Xe.set(e.id, t), Ze.set(e.id, t), r.style("display", null), r.select(".container-hull").style("display", "none"), r.select(".container-hull-ghost").attr("d", ""), r.select(".container-badge").style("display", "none"), r.select(".container-macro-node").style("display", null).attr("transform", `translate(${t.x}, ${t.y})${ge()}`).select(".label-count").text((0, us.containerCountText)(x, i.length));
					return;
				}
				let c = _(i, (e) => e.x), l = _(i, (e) => e.y);
				Xe.set(e.id, {
					x: c,
					y: l
				}), r.style("display", null), r.select(".container-macro-node").style("display", "none"), r.select(".container-hull").style("display", null), r.select(".container-badge").style("display", null);
				let u = [], d = e.padding || (e.parent ? 42 : 75);
				for (let t of He.get(e.id) || []) {
					if (!B.has(t)) continue;
					let e = wt.get(t), r = e && n(e);
					if (!r) continue;
					let i = (e._macroHalfW || 130) + d / 2, a = (e._macroHalfH || 45) + d / 2;
					u.push([r.x - i, r.y - a], [r.x + i, r.y - a], [r.x + i, r.y + a], [r.x - i, r.y + a]);
				}
				let f = i.filter((e) => {
					for (let t of B) if (Ge(t).includes(e.id)) return !1;
					return !0;
				});
				for (let e of f) {
					let t = e._size?.width || (e.type === "article" ? S.width : e.size), n = e._size?.height || (e.type === "article" ? S.height : e.size), r = t / 2 + d, i = n / 2 + d;
					u.push([e.x - r, e.y - i], [e.x + r, e.y - i], [e.x + r, e.y + i], [e.x - r, e.y + i]);
				}
				let p = Es(e), m = null;
				if (s) {
					let n = d / 2, r = [], i = (e) => {
						for (let n of He.get(e) || []) {
							if (B.has(n)) continue;
							let e = wt.get(n), a = e && t(e);
							a && Es(e) !== "hidden" && r.push({
								L: a.info.label,
								off: a.off
							}), i(n);
						}
					};
					i(e.id);
					for (let { L: e, off: t } of r) u.push([t.x + e.x0 - n, t.y + e.y0 - n], [t.x + e.x1 + n, t.y + e.y0 - n], [t.x + e.x1 + n, t.y + e.y1 + n], [t.x + e.x0 - n, t.y + e.y1 + n]);
					let a = s.info.label;
					m = {
						x: s.off.x + (a.x0 + a.x1) / 2,
						y: s.off.y + (a.y0 + a.y1) / 2
					}, p === "center" && u.push([s.off.x + a.x0 - n, s.off.y + a.y0 - n], [s.off.x + a.x1 + n, s.off.y + a.y0 - n], [s.off.x + a.x1 + n, s.off.y + a.y1 + n], [s.off.x + a.x0 - n, s.off.y + a.y1 + n]);
				}
				if (u.length === 0) {
					r.select(".container-hull-ghost").attr("d", ""), r.select(".container-hull").style("display", "none"), r.select(".container-badge").style("display", "none");
					return;
				}
				let v = Ya(u);
				if (!v || v.length < 3) return;
				r.select(".container-hull").attr("d", Ct(v)), r.select(".container-hull-ghost").attr("d", Je ? Ct((0, Ao.jitterPoints)(v, e.id, 3.5)) : "");
				let y = r.select(".container-badge");
				y.attr("data-label-position", p), y.select(".label-count").text((0, us.containerCountText)(x, i.length));
				let b = (t) => {
					let n = lt(e, t);
					y.select(".container-badge-hit").attr("x", -n.w / 2).attr("y", -n.h / 2).attr("width", n.w).attr("height", n.h);
				};
				if (p === "hidden") {
					y.style("display", "none"), Ze.set(e.id, m || {
						x: _(v, (e) => e[0]),
						y: _(v, (e) => e[1])
					});
					return;
				}
				if (p === "top") {
					let t = m ? o : Math.max(Et, Math.min(Dt, (h(v, (e) => e[0]) - g(v, (e) => e[0])) / 8)), n = lt(e, t), r = g(v, (e) => e[1]), i = {
						x: (g(v, (e) => e[0]) + h(v, (e) => e[0])) / 2,
						y: r + d * .5 + n.h / 2
					};
					y.select(".container-badge-text").attr("font-size", `${t}px`), b(t), y.attr("transform", `translate(${i.x}, ${i.y})${ge()}`), Ze.set(e.id, i);
					return;
				}
				if (m) {
					y.select(".container-badge-text").attr("font-size", `${o}px`), b(o), y.attr("transform", `translate(${m.x}, ${m.y})${ge()}`), Ze.set(e.id, m);
					return;
				}
				let C = Math.min(...v.map((e) => e[1])), w = Math.max(...v.map((e) => e[1])), T = Math.min(...v.map((e) => e[0])), E = Math.max(...v.map((e) => e[0])), D = Math.max(Et, Math.min(Dt, (E - T) / 8));
				y.select(".container-badge-text").attr("font-size", `${D}px`), b(D);
				let O = Ga(v), k = Number.isFinite(O[0]) ? O[0] : _(v, (e) => e[0]);
				y.attr("transform", `translate(${k}, ${C + (w - C) / 3})${ge()}`), Ze.set(e.id, {
					x: k,
					y: C + (w - C) / 3
				});
			});
		}
		let mn = /* @__PURE__ */ new Set();
		function hn() {
			mn = (0, fs.closedMemberSet)(B, Ge);
			for (let e of o.nodes) e._closedHidden = mn.has(e.id);
			Qn && Qn.style("display", (e) => mn.has(e.id) ? "none" : null), Wn.style("display", (e) => mn.has(e.id) ? "none" : null);
			let e = (e) => (0, fs.edgeHidden)(e, mn) ? "none" : null;
			kn.style("display", e), jn.style("display", e), On.style("display", e), Pn.style("display", e), Rn && (0, fs.edgeHidden)(Rn, mn) && Un();
		}
		function gn() {
			hn(), xn(), pn(), pr();
		}
		function _n() {
			return Object.fromEntries((o.containers || []).map((e) => [e.id, B.has(e.id) ? "closed" : "open"]));
		}
		function vn(e, t) {
			let n = !1;
			for (let r of e) wt.has(r) && (t && B.has(r) && (B.delete(r), n = !0), !t && !B.has(r) && (B.add(r), n = !0));
			return n ? (gn(), typeof window < "u" && window.dispatchEvent(new CustomEvent("graph:containers-changed", { detail: _n() })), !0) : !1;
		}
		let yn = () => (o.containers || []).map((e) => e.id), bn = {
			openContainer: (e) => vn([e], !0),
			closeContainer: (e) => vn([e], !1),
			toggleContainer: (e) => vn([e], B.has(e)),
			openAllContainers: () => vn(yn(), !0),
			closeAllContainers: () => vn(yn(), !1),
			getContainerState: _n
		};
		v && (v.current = bn);
		function xn() {
			if (!o.containers || o.containers.length === 0) return;
			let e = new Map(H.roots.map((e) => [e, jt(e)])), t = /* @__PURE__ */ new Map();
			if (Ft()) {
				let e = zt();
				for (let n of W.keys()) {
					let r = Wt(n) ? Lt(n) : e.get(n) || Lt(n);
					r && t.set(n, r);
				}
			}
			if (xt(), At(), cn(), !Nt()) return;
			let n = [];
			for (let [e, r] of H.nodes) {
				let i = V.get(e), a = It.get(e);
				if (!i || !Number.isFinite(i.x) || !a || !t.has(a)) continue;
				let o = t.get(a), s = H.containers.get(a);
				n.push({
					n: i,
					x0: i.x,
					y0: i.y,
					x1: o.x - s.center.x + r.x,
					y1: o.y - s.center.y + r.y
				});
			}
			if (!Rr && !n.length) {
				Le.alpha(Math.max(Le.alpha(), .3)).restart();
				return;
			}
			for (let [r, i] of H.nodes) {
				let a = V.get(r), o = e.get(i.root), s = It.get(r);
				s && t.has(s) || !a || !o || !Number.isFinite(a.x) || n.push({
					n: a,
					x0: a.x,
					y0: a.y,
					x1: o.x + i.x,
					y1: o.y + i.y
				});
			}
			Ri("container-relayout").duration(600).ease(Hi).tween("container-relayout", () => (e) => {
				for (let t of n) t.n.x = t.x0 + (t.x1 - t.x0) * e, t.n.y = t.y0 + (t.y1 - t.y0) * e, t.n.fx = t.n.x, t.n.fy = t.n.y;
				pr(), L.current && L.current();
			}).on("end", () => {
				m || Ir({ animate: !0 });
			});
		}
		function Sn(e) {
			let t = le.current === e.id, n = z.current.has(e.id), r = ks(ue.current);
			if (r === "marker" && !t && !n) return {
				w: 8,
				h: 8
			};
			let i = e._size || N({
				hovered: t,
				pinned: n,
				lod: r
			});
			return {
				w: i.width / 2,
				h: i.height / 2
			};
		}
		function Cn(e) {
			let t = typeof e.source == "object" ? e.source.x : 0, n = typeof e.source == "object" ? e.source.y : 0, r = typeof e.target == "object" ? e.target.x : 0, i = typeof e.target == "object" ? e.target.y : 0, a = typeof e.source == "object" ? e.source.id : e.source, o = typeof e.target == "object" ? e.target.id : e.target;
			if ((0, fs.edgeHidden)(e, mn)) return {
				x1: 0,
				y1: 0,
				x2: 0,
				y2: 0,
				hidden: !0
			};
			let s = null, c = null;
			for (let e of B) {
				let t = Ge(e);
				t.includes(a) && (s = e), t.includes(o) && (c = e);
			}
			if (s && s === c) return {
				x1: 0,
				y1: 0,
				x2: 0,
				y2: 0,
				hidden: !0
			};
			if (s) {
				let e = Xe.get(s);
				e && (t = e.x, n = e.y);
			}
			if (c) {
				let e = Xe.get(c);
				e && (r = e.x, i = e.y);
			}
			if (e.layer !== "sequence") return {
				x1: t,
				y1: n,
				x2: r,
				y2: i,
				hidden: !1
			};
			let l = r - t, u = i - n, d = Math.hypot(l, u);
			if (d < 40) return {
				x1: t,
				y1: n,
				x2: r,
				y2: i,
				hidden: !1
			};
			let f = l / d, p = u / d, m = Sn(e.source), h = s ? 90 : m.w + 4, g = s ? 45 : m.h + 4, _ = Math.min(Math.abs(f) > 1e-4 ? h / Math.abs(f) : Infinity, Math.abs(p) > 1e-4 ? g / Math.abs(p) : Infinity), v = Sn(e.target), y = c ? 90 : v.w + 4, b = c ? 45 : v.h + 4, x = Math.min(Math.abs(f) > 1e-4 ? y / Math.abs(f) : Infinity, Math.abs(p) > 1e-4 ? b / Math.abs(p) : Infinity);
			return d <= _ + x ? {
				x1: t,
				y1: n,
				x2: r,
				y2: i,
				hidden: !1
			} : {
				x1: t + f * _,
				y1: n + p * _,
				x2: r - f * x,
				y2: i - p * x,
				hidden: !1
			};
		}
		function wn(e, t) {
			if (t.hidden) return "";
			if (e.layer !== "sequence") return `M ${t.x1} ${t.y1} L ${t.x2} ${t.y2}`;
			let n = t.x2 - t.x1, r = t.y2 - t.y1, i = Math.hypot(n, r);
			if (i < 2) return `M ${t.x1} ${t.y1} L ${t.x2} ${t.y2}`;
			let a = (t.x1 + t.x2) / 2, o = (t.y1 + t.y2) / 2, s = -r / i, c = n / i, l = Math.min(48, i * .12), u = a + s * l, d = o + c * l;
			return `M ${t.x1} ${t.y1} Q ${u} ${d} ${t.x2} ${t.y2}`;
		}
		let Tn = /* @__PURE__ */ new Map();
		function En(e) {
			if (!Tn.has(e)) {
				let t = "edge-arrow-" + Tn.size;
				c.append("marker").attr("id", t).attr("viewBox", "0 0 10 10").attr("refX", 9).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 13).attr("markerHeight", 13).attr("orient", "auto").append("path").attr("d", "M 0 1 L 10 5 L 0 9 z").style("fill", e).style("fill-opacity", .75), Tn.set(e, t);
			}
			return Tn.get(e);
		}
		let Dn = (e) => {
			if (e.layer !== "sequence") return "#8a8f9c";
			let t = typeof e.source == "object" ? e.source.id : e.source;
			return V.get(t)?.containerColor || "var(--gv-accent, #d4af37)";
		}, On = f.insert("g", ".containers-layer").attr("class", "link-hits").selectAll(".link-hit").data(o.links).enter().append("path").attr("class", "link-hit").attr("fill", "none").style("stroke", "transparent").style("stroke-width", "16px").style("pointer-events", "stroke").style("cursor", "default"), kn = f.selectAll(".link").data(o.links).enter().append("path").attr("class", (e) => [
			"link",
			e.layer ? `link-${e.layer}` : "",
			e.role ? `link-role-${e.role}` : ""
		].filter(Boolean).join(" ")).attr("fill", "none").attr("data-label", (e) => e.label).attr("marker-end", (e) => e.directed ? `url(#${En(Dn(e))})` : null).style("stroke", (e) => e.layer === "sequence" ? Dn(e) : null).style("stroke-opacity", (e) => e.layer === "sequence" ? .45 : null), An = f.append("g").attr("class", "readers-layer").style("display", "none"), jn = f.selectAll(".link-ghost").data(o.links).enter().insert("path", ".link-sequence-pulse").attr("class", "link-ghost").style("stroke", (e) => Dn(e)), Mn = (e) => `${sn(e.source)}>${sn(e.target)}`;
		function Nn() {
			jn.attr("d", (e) => Je && e._path ? (0, Ao.ghostOf)(e._path, Mn(e)) : "");
		}
		let Pn = f.selectAll(".link-sequence-pulse").data(o.links.filter((e) => e.layer === "sequence")).enter().append("path").attr("class", "link-sequence-pulse").attr("fill", "none").attr("pathLength", 100).style("stroke", (e) => {
			let t = typeof e.source == "object" ? e.source.id : e.source;
			return V.get(t)?.containerColor || "#ffe066";
		}).style("filter", (e) => {
			let t = typeof e.source == "object" ? e.source.id : e.source;
			return `drop-shadow(0 0 4px ${V.get(t)?.containerColor || "#ffd700"})`;
		}), Fn = f.append("g").attr("class", "edge-label").style("pointer-events", "none").style("display", "none"), In = Fn.append("rect").attr("fill", "rgba(15, 17, 26, 0.88)").attr("stroke-opacity", .6), Ln = Fn.append("text").attr("text-anchor", "middle").attr("dominant-baseline", "central").attr("font-family", "'Atkinson', sans-serif").attr("font-weight", 600).attr("letter-spacing", "0.04em"), Rn = null, zn = null, Bn = null;
		function Vn() {
			if (!Rn || !zn) return;
			let e = zn.getTotalLength ? zn.getTotalLength() : 0;
			if (!e) {
				Fn.style("display", "none");
				return;
			}
			let t = zn.getPointAtLength(e / 2), n = ue.current || 1, r = 13 / n, i = Dn(Rn);
			Ln.attr("font-size", r).style("fill", i).text(Rn.label);
			let a = (Rn.label.length * .62 + 1.4) * r, o = r * 1.7;
			In.attr("x", -a / 2).attr("y", -o / 2).attr("width", a).attr("height", o).attr("rx", o / 2).style("stroke", i).attr("stroke-width", 1 / n), Fn.attr("transform", `translate(${t.x}, ${t.y})${ge()}`).style("display", null);
		}
		function Hn(e, t) {
			clearTimeout(Bn), Bn = null, Rn = e, zn = t, Vn();
		}
		function Un() {
			clearTimeout(Bn), Bn = null, Rn = null, zn = null, Fn.style("display", "none");
		}
		On.on("mouseenter", function(e, t) {
			Hn(t, this);
		}).on("mouseleave", () => {
			Bn || Un();
		}).on("click", function(e, t) {
			e.stopPropagation();
			let n = this;
			Ae(e, () => {
				Hn(t, n), Bn = setTimeout(() => {
					Bn = null, Un();
				}, 2500);
			});
		});
		let Wn = f.selectAll(".node").data(o.nodes).enter().append("g").attr("class", "node"), Gn = Kt().clickDistance(5).container(() => f.node()).filter((e) => {
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
				let n = t._size || N({
					hovered: le.current === t.id,
					pinned: z.current.has(t.id)
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
				}, rr(t), M.current && M.current.setNodeSize(R(t), t._size.width, t._size.height, { transient: !0 }), pn();
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
			t.x = e.x, t.y = e.y, t.fx = e.x, t.fy = e.y, M.current && M.current.setNodePosition(R(t), e.x, e.y, { transient: !0 }), Wn.filter((e) => e.id === t.id).attr("transform", "translate(" + e.x + "," + e.y + ")" + ge()), Qn && Qn.filter((e) => e.id === t.id).style("transform", `translate3d(${e.x}px, ${e.y}px, 0px) rotate(var(--gv-unrot, 0deg))`), L.current && L.current(), kn.each(function(e) {
				let n = typeof e.source == "object" ? e.source.id : e.source, r = typeof e.target == "object" ? e.target.id : e.target;
				(n === t.id || r === t.id) && (e._path = wn(e, Cn(e)), U(this).attr("d", e._path));
			}), On.attr("d", (e) => e._path || ""), Nn(), Un(), Pn.each(function(e) {
				let n = typeof e.source == "object" ? e.source.id : e.source, r = typeof e.target == "object" ? e.target.id : e.target;
				if (n === t.id || r === t.id) {
					let t = Cn(e);
					U(this).attr("d", wn(e, t));
				}
			}), pn();
		}).on("end", (e, t) => {
			let n = M.current;
			if (t._resizing) {
				t._resizing = !1, n && n.commit(), pn();
				return;
			}
			t.fx = t.x, t.fy = t.y, t._dragMoved && (n && (n.setNodePosition(ce(t), t.x, t.y, { transient: !0 }), n.commit()), pn());
		});
		Wn.call(Gn);
		let Kn = s.append("text").style("font-family", "'Atkinson', sans-serif").style("visibility", "hidden"), qn = typeof document < "u" ? document.createElement("canvas").getContext("2d") : null;
		function Jn(e, t) {
			if (!qn) return {
				width: e.length * t * .5,
				ascent: t * .7,
				descent: t * .2
			};
			qn.font = "500 " + t + "px 'Atkinson', sans-serif";
			let n = qn.measureText(e);
			return {
				width: n.actualBoundingBoxLeft + n.actualBoundingBoxRight,
				ascent: n.actualBoundingBoxAscent,
				descent: n.actualBoundingBoxDescent
			};
		}
		let Yn = [];
		function Xn(e) {
			let { d: t, textEl: n, rectEl: r, lines: i, fontSize: a, lineH: o } = e, s = i.map((e) => Jn(e, a)), c = i.map((e, t) => t * o), l = Math.min(...c.map((e, t) => e - s[t].ascent)), u = Math.max(...c.map((e, t) => e + s[t].descent)), d = -(l + u) / 2, f = l + d, p = u + d, m = Math.max(...s.map((e) => e.width));
			n.selectAll("tspan").each(function(e, t) {
				U(this).attr("y", c[t] + d);
			}), r.attr("x", -m / 2 - C.padding).attr("y", f - C.padding).attr("width", m + C.padding * 2).attr("height", p - f + C.padding * 2), t._r = Math.hypot(m + C.padding * 2, p - f + C.padding * 2) / 2;
		}
		Wn.each(function(e) {
			let t = U(this);
			if (e.type !== "article") {
				let n = C.fontSize, r = C.padding, i = C.maxWidth, a = C.maxLines;
				Kn.style("font-size", n + "px").style("font-weight", "500");
				let o = (e) => (Kn.text(e), Kn.node().getComputedTextLength()), s = e.label.split(/(?<=-)|\s+/).filter(Boolean), c = (e) => e.join("").replace(/\s+$/, "").trim(), l = [e.label];
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
				Yn.push(f), Xn(f);
			} else {
				let t = N({
					hovered: !1,
					pinned: !1
				});
				e._r = Math.hypot(t.width, t.height) / 2;
			}
		}), Kn.remove(), typeof document < "u" && document.fonts && document.fonts.ready && document.fonts.ready.then(() => {
			Yn.forEach(Xn);
		}).catch(() => {});
		let Zn = /* @__PURE__ */ new Map(), Qn = d.selectAll(".node-card").data(o.nodes.filter((e) => e.type === "article")), $n = Qn.enter().append("div").attr("class", "node-card").style("position", "absolute").style("left", "0").style("top", "0").style("will-change", "transform").style("pointer-events", "auto").style("touch-action", "manipulation").call(Gn);
		Qn = Qn.merge($n), $n.filter((e) => !!e.link).attr("tabindex", 0).attr("role", "link").attr("data-link-node", "").attr("aria-label", (e) => [
			e.title,
			e.subtitle,
			e.description
		].filter(Boolean).join(". ")).on("keydown", (e, t) => {
			e.key === "Enter" && (e.preventDefault(), e.stopPropagation(), (0, bs.followLink)(t.originalItem || t, { settings: xs() }));
		}), $n.each(function(e) {
			let t = u(this);
			Zn.set(e.id, {
				root: t,
				wrapper: this,
				cardSelection: U(this)
			});
		});
		let er = null, tr = /* @__PURE__ */ new Map();
		function nr() {
			return er !== ie.current && (er = ie.current, tr = (0, ys.countsByChapter)(er)), tr;
		}
		function rr(e) {
			if (e.type !== "article") return;
			let n = Zn.get(e.id);
			if (!n) return;
			let r = le.current === e.id, i = z.current.has(e.id), a = ks(ue.current), o = N({
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
			let l = Jo(e.kind), u = M.current, d = u ? u.bookmarks(R(e)) : [], f = x.readingProgress !== !1 && u && u.readingProgress ? u.readingProgress(R(e)) : null, p = nr().get(e.id) || 0;
			n.root.render(t.createElement(l, {
				article: e,
				width: s,
				height: c,
				viewState: {
					hovered: r,
					pinned: i,
					lod: a,
					zoomScale: ue.current,
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
					}, n.wrapper.style.width = t + "px", n.wrapper.style.height = r + "px", n.wrapper.style.marginLeft = -t / 2 + "px", n.wrapper.style.marginTop = -r / 2 + "px", e._r = Math.max(t, r) / 2, rr(e);
				}
			}));
		}
		Qn.on("wheel", (e) => e.stopPropagation());
		function ir() {
			o.nodes.forEach((e) => {
				e.type === "article" && rr(e);
			});
		}
		ne.current = ir;
		let ar = /* @__PURE__ */ new Map();
		function or(e) {
			if ((e.originalItem && e.originalItem._posted) === "title") return e._fullContent = null, Promise.resolve();
			if (ar.has(e.id)) return e._fullContent = ar.get(e.id), Promise.resolve();
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
				ar.set(e.id, i), e._fullContent = i;
			}).catch(() => {
				ar.set(e.id, null), e._fullContent = null;
			});
		}
		ir(), z.current.forEach((e) => {
			let t = o.nodes.find((t) => t.id === e);
			t && (Qn.filter((t) => t.id === e).raise().style("z-index", 10), or(t).then(() => {
				z.current.has(e) && rr(t);
			}));
		}), Cs(s, l, fe.current), Qn.on("mouseover", (e, t) => {
			le.current !== t.id && (le.current = t.id, rr(t), e.currentTarget.style.zIndex = 10);
		}).on("mouseout", (e, t) => {
			let n = e.relatedTarget;
			n && e.currentTarget.contains(n) || le.current === t.id && (le.current = null, rr(t), e.currentTarget.style.zIndex = "");
		}).on("dblclick", (e, t) => {
			if (e.stopPropagation(), e.preventDefault(), t.link || Date.now() - sr < 300) return;
			let n = e.target;
			n && (n.dataset?.popout === "1" || n.closest?.("[data-popout=\"1\"]")) || (De.cancel(), cr(t));
		}).on("click", (e, t) => {
			if (t.link) {
				e.stopPropagation(), De.cancel(), (0, bs.followLink)(t.originalItem || t, { settings: xs() });
				return;
			}
			let n = e.target;
			if (n && (n.dataset?.popout === "1" || n.closest?.("[data-popout=\"1\"]"))) {
				e.stopPropagation(), k.current && k.current(t.originalItem || t), z.current.has(t.id) && (z.current.delete(t.id), M.current && M.current.setNodePinned(R(t), !1), le.current = null, rr(t), e.currentTarget.style.zIndex = "");
				return;
			}
			e.stopPropagation();
			let r = e.currentTarget;
			Ae(e, () => lr(t, r), () => cr(t));
		});
		let sr = 0;
		function cr(e) {
			sr = Date.now(), k.current && k.current(e.originalItem || e);
		}
		function lr(e, t) {
			z.current.has(e.id) ? (z.current.delete(e.id), M.current && M.current.setNodePinned(R(e), !1), rr(e), t.style.zIndex = "", ee.current === e.id && j(null)) : (z.current.add(e.id), j(e), M.current && M.current.setNodePinned(R(e), !0), rr(e), Wn.filter((t) => t.id === e.id).raise(), Qn.filter((t) => t.id === e.id).raise(), t.style.zIndex = 10, or(e).then(() => {
				z.current.has(e.id) && rr(e);
			}));
		}
		let ur = null;
		Wn.filter((e) => e.type !== "article").on("click", (e, t) => {
			e.stopPropagation(), Ae(e, () => dr(t));
		});
		function dr(e) {
			if (ur === e.id) ur = null, Wn.classed("dimmed", !1).classed("tag-active", !1), Qn.classed("dimmed", !1), kn.classed("highlighted", !1);
			else {
				ur = e.id;
				let t = new Set(o.links.filter((t) => {
					let n = typeof t.source == "object" ? t.source.id : t.source, r = typeof t.target == "object" ? t.target.id : t.target;
					return n === e.id || r === e.id;
				}).map((t) => {
					let n = typeof t.source == "object" ? t.source.id : t.source, r = typeof t.target == "object" ? t.target.id : t.target;
					return n === e.id ? r : n;
				}));
				t.add(e.id), Wn.classed("dimmed", (e) => !t.has(e.id)), Wn.classed("tag-active", (t) => t.id === e.id), Qn.classed("dimmed", (e) => !t.has(e.id)), kn.classed("highlighted", (t) => {
					let n = typeof t.source == "object" ? t.source.id : t.source, r = typeof t.target == "object" ? t.target.id : t.target;
					return n === e.id || r === e.id;
				});
			}
		}
		s.on("click", (e) => Ae(e, () => {
			Un(), ur && (ur = null, Wn.classed("dimmed", !1).classed("tag-active", !1), Qn.classed("dimmed", !1), kn.classed("highlighted", !1)), k.current && k.current(null);
		}));
		function fr() {
			kn.each(function(e) {
				e._path = wn(e, Cn(e)), U(this).attr("d", e._path);
			}), On.attr("d", (e) => e._path || ""), Pn.attr("d", (e) => e._path || ""), Nn(), Rn && Vn();
		}
		function pr() {
			fr(), Wn.attr("transform", (e) => "translate(" + e.x + "," + e.y + ")" + ge()), Qn && Qn.style("transform", (e) => `translate3d(${e.x}px, ${e.y}px, 0px) rotate(var(--gv-unrot, 0deg))`), pn(), re.current && re.current(), ae.current && ae.current();
		}
		function mr() {
			let e = M.current;
			return !!(e && e.preference && e.preference("readers") === !0);
		}
		let hr = [];
		function gr() {
			An.selectAll("*").remove(), hr = (0, ys.connectionEdges)(ie.current).map((e) => {
				let t = V.get(e.source), n = V.get(e.target);
				if (!t || !n) return null;
				let r = An.append("g").attr("class", "readers-edge").attr("data-readers-edge", e.id);
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
		function _r({ rebuild: e = !1 } = {}) {
			e && gr();
			let t = mr();
			if (An.style("display", t && hr.length ? null : "none").attr("data-on", t ? "true" : "false"), t) for (let e of hr) {
				let t = Cn(e.l), n = t.hidden ? "" : `M ${t.x1} ${t.y1} L ${t.x2} ${t.y2}`;
				e.line.attr("d", n);
			}
		}
		ae.current = _r, gr();
		let vr = x.roots ? x.roots === !0 ? {} : x.roots : null, yr = [], br = null, xr = !1;
		if (vr) {
			let e = /* @__PURE__ */ new Map();
			for (let [t, n] of Ue) for (let r of n) e.set(r, t);
			let t = o.links.filter((e) => e.layer === "sequence").map((e) => ({
				source: sn(e.source),
				target: sn(e.target)
			})), n = (o.containers || []).find((e) => !e.parent), r = String(vr.seed || n && n.id || "roots");
			yr = (0, hs.rootSegments)({
				containers: o.containers || [],
				memberOf: e,
				sequence: t
			}).map((e) => {
				let t = Be.append("g").attr("class", "root").attr("data-root", e.key).style("display", "none");
				return {
					...e,
					shape: (0, hs.rootShape)(r + "|" + e.key),
					el: t,
					main: t.append("path").attr("class", "root-main").attr("fill", "none").attr("vector-effect", "non-scaling-stroke"),
					fine: t.append("path").attr("class", "root-fine").attr("fill", "none").attr("vector-effect", "non-scaling-stroke"),
					state: "hidden"
				};
			});
		}
		function Sr(e) {
			if (e.node) {
				let t = V.get(e.node);
				return !t || !Number.isFinite(t.x) || mn.has(t.id) || t._source && fe.current.has(t._source.id) ? null : {
					x: t.x,
					y: t.y
				};
			}
			return Ze.get(e.container) || null;
		}
		function Cr(e) {
			let t = M.current;
			if (!t || !t.readingProgress) return "hidden";
			let n = (e) => {
				let n = V.get(e);
				return n ? t.readingProgress(R(n)) : {
					seen: !1,
					done: !1
				};
			};
			if (e.node) {
				let t = n(e.node);
				return t.done ? "done" : t.seen || t.max > 0 ? "seen" : "hidden";
			}
			let r = Ge(e.container).map(n);
			return !r.length || !r.some((e) => e.seen || e.max > 0) ? "hidden" : r.every((e) => e.done) ? "done" : "seen";
		}
		function wr() {
			if (br = null, yr.length) {
				for (let e of yr) {
					let t = Cr(e.reach), n = Sr(e.from), r = Sr(e.to);
					if (t === "hidden" || !n || !r) {
						e.el.style("display", "none"), t === "hidden" && (e.state = "hidden");
						continue;
					}
					let i = (0, hs.rootPath)(n, r, e.shape);
					if (e.main.attr("d", i.main), e.fine.attr("d", i.fine), e.el.style("display", null).attr("data-state", t), e.state === "hidden" && xr) {
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
				xr = !0;
			}
		}
		function Tr() {
			!yr.length || br || (br = typeof requestAnimationFrame < "u" ? requestAnimationFrame(wr) : setTimeout(wr, 16));
		}
		re.current = vr ? Tr : null;
		let Er = !1;
		te.current = {
			data: o,
			nodes: Wn,
			articleNodes: Qn,
			links: kn,
			applyPositions: pr,
			svg: s,
			zoom: be,
			fitToViewport: Ir,
			simulation: Le,
			axisLayer: ze,
			g: f,
			updateContainers: pn,
			ringTargets: un,
			recomputeContainers: dn,
			toScreen: ye
		}, oe = !0;
		function Dr() {
			if (Pt = typeof window < "u" && window.PostPipeCoverFrame || null, !Ft()) return;
			Le.force("center", null);
			let e = [...W.keys()].filter((e) => Bt.has(e) || !Wt(e)), t = Xt();
			e.length && Yt(e), (e.length || t) && pr(), m || Fr(!1);
		}
		window.addEventListener("postpipe:cover-frame", Dr), Dr();
		let Or = !1, kr = new Map(o.nodes.map((e) => [e.id, e]));
		function Ar() {
			if (Or || P.current !== "force") return !1;
			let e = [];
			for (let t of o.nodes) {
				if (t.type !== "article" || !z.current.has(t.id) || t._closedHidden || !Number.isFinite(t.x) || !Number.isFinite(t.y)) continue;
				let n = t._size || N({
					hovered: !1,
					pinned: !0
				});
				e.push({
					id: t.id,
					x: t.x,
					y: t.y,
					w: n.width,
					h: n.height
				});
			}
			if (e.length < 2) return !1;
			let t = (0, ms.separateOpen)(e, { gap: 12 });
			for (let [e, n] of t) {
				let t = kr.get(e);
				t && (t.x = n.x, t.y = n.y, t.vx = 0, t.vy = 0, t.fx != null && (t.fx = n.x), t.fy != null && (t.fy = n.y));
			}
			return t.size > 0;
		}
		let jr = 0;
		Le.nodes(o.nodes).on("tick", () => {
			Ar(), pr(), Er ||= Ir({ initialZoomOut: !0 }), L.current && L.current(), ++jr, I.current && jr % 25 == 0 && I.current();
		}), Le.force("link").links(o.links), Ar(), Er ||= Ir({ initialZoomOut: !0 }), pr();
		function Mr() {
			if (!Nt() || H.roots.length === 0) return null;
			let e = [], t = Ft();
			if (t) for (let t of W.keys()) {
				let n = H.containers.get(t), r = n && Mt(t);
				!r || fn(wt.get(t)) || e.push({
					x0: r.x + n.box.x0,
					y0: r.y + n.box.y0,
					x1: r.x + n.box.x1,
					y1: r.y + n.box.y1
				});
			}
			for (let n of H.roots) {
				let r = H.containers.get(n), i = jt(n);
				!r || !i || t && Ge(n).every((e) => It.has(e)) || Ge(n).every((e) => fe.current.has(V.get(e)?._source?.id)) || e.push({
					x0: i.x + r.box.x0,
					y0: i.y + r.box.y0,
					x1: i.x + r.box.x1,
					y1: i.y + r.box.y1
				});
			}
			for (let t of o.nodes) {
				if (t.type !== "article" || H.nodes.has(t.id) || !Number.isFinite(t.x) || t._source && fe.current.has(t._source.id)) continue;
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
		function Nr() {
			if (!y || !Nt()) return null;
			let e = x.initialFocus, t = H.containers.get(e), n = wt.get(e);
			if (!t || !n || B.has(e) || fn(n)) return null;
			let r = Mt(e);
			if (!r) return null;
			let i = {
				x0: r.x + t.box.x0,
				y0: r.y + t.box.y0,
				x1: r.x + t.box.x1,
				y1: r.y + t.box.y1
			}, a = H.containers.get(t.root), o = a && jt(t.root), s = o ? {
				x0: o.x + a.box.x0,
				y0: o.y + a.box.y0,
				x1: o.x + a.box.x1,
				y1: o.y + a.box.y1
			} : null, c = (e, t) => {
				if (!e) return e;
				let n = { ...e };
				for (let e of Ge(t)) {
					let t = V.get(e);
					if (!t || t.type !== "article" || t._closedHidden || !Number.isFinite(t.x) || !Number.isFinite(t.y)) continue;
					let r = t._size || N({
						hovered: !1,
						pinned: z.current.has(t.id)
					});
					n.x0 = Math.min(n.x0, t.x - r.width / 2), n.x1 = Math.max(n.x1, t.x + r.width / 2), n.y0 = Math.min(n.y0, t.y - r.height / 2), n.y1 = Math.max(n.y1, t.y + r.height / 2);
				}
				return n;
			};
			return {
				box: c(i, e),
				root: c(s, t.root)
			};
		}
		function Pr(e) {
			let t = {
				top: 0,
				bottom: 0
			};
			if (typeof document > "u" || !E.current) return t;
			let n = E.current.getBoundingClientRect(), r = 0, i = 0;
			for (let t of document.querySelectorAll("[data-feeds], [data-settings-gear], [data-rights], [data-toolbar]")) {
				let a = t.getBoundingClientRect();
				!a.width || !a.height || (a.top >= n.top + e / 2 ? i = Math.max(i, n.top + e - a.top) : a.bottom <= n.top + e / 2 && (r = Math.max(r, a.bottom - n.top)));
			}
			return {
				top: Math.max(0, Math.min(e / 4, r)),
				bottom: Math.max(0, Math.min(e / 3, i))
			};
		}
		function Fr(e) {
			let t = (0, _s.homeView)(b), n = _o.translate(t.x, t.y).scale(t.k);
			return me = t.k, Ee({ repaint: !1 }), e ? s.transition().duration(750).call(be.transform, n) : s.call(be.transform, n), tn(), !0;
		}
		function Ir({ animate: e = !1, initialZoomOut: t = !1, focus: n = !0 } = {}) {
			if (n && Ft()) return Fr(e);
			let r = Lr({
				animate: e,
				initialZoomOut: t,
				focus: n
			});
			return r && n && (me = r, tn()), !!r;
		}
		function Lr({ animate: e = !1, initialZoomOut: t = !1, focus: n = !0 } = {}) {
			let r = Mr();
			if (r) {
				let t = E.current ? E.current.clientWidth : window.innerWidth, i = E.current ? E.current.clientHeight : window.innerHeight;
				if (t < 50 || i < 50) return !1;
				let a = Pr(i);
				i -= a.top + a.bottom;
				let o = (e) => Math.min((t - 48) / Math.max(e.x1 - e.x0, 1), (i - 48) / Math.max(e.y1 - e.y0, 1), 1), c = n ? Nr() : null, l = r, u = o(r), d = !1;
				c && (u = o(c.box), l = c.box, c.root && o(c.root) >= Math.min(u, b) ? (l = c.root, u = o(c.root)) : u < b && (u = b, d = (c.box.y1 - c.box.y0) * u > i - 48)), u = Math.max(u, .04);
				let f = (l.x0 + l.x1) / 2, p = d ? Math.max(a.top + 24, 56) - l.y0 * u : a.top + i / 2 - (l.y0 + l.y1) / 2 * u, m = _o.translate(t / 2 - f * u, p).scale(u);
				return Ee({ repaint: !1 }), e ? s.transition().duration(750).call(be.transform, m) : s.call(be.transform, m), m.k;
			}
			let i = o.nodes.filter((e) => e.type === "article");
			if (i.length < 2) return !1;
			let a = (e) => {
				let t = [...e].sort((e, t) => e - t), n = Math.floor(t.length / 2);
				return t.length % 2 ? t[n] : (t[n - 1] + t[n]) / 2;
			}, c = (e) => {
				let t = [...e].sort((e, t) => e - t);
				return [t[Math.floor(t.length * .1)], t[Math.ceil(t.length * .9) - 1]];
			}, l = i.map((e) => e.x), u = i.map((e) => e.y), [d, f] = c(l), [p, m] = c(u), h = d - 140, g = f + 140, _ = p - 140, v = m + 140, y = a(l), x = a(u), S = E.current ? E.current.clientWidth : window.innerWidth, C = E.current ? E.current.clientHeight : window.innerHeight;
			if (S < 50 && (S = window.innerWidth), C < 50 && (C = window.innerHeight), S < 50 || C < 50) return !1;
			let w = .2, T = Pr(C), D = Math.max(50, C - T.top - T.bottom), O = Math.max(Math.min(S / Math.max(g - h, 1), D / Math.max(v - _, 1), 1), w);
			t && (Ie ? O = w * .85 : O *= .85);
			let k = S / 2 - y * O, A = T.top + D / 2 - x * O, ee = _o.translate(k, A).scale(O);
			return Ee({ repaint: !1 }), e ? s.transition().duration(750).call(be.transform, ee) : s.call(be.transform, ee), ee.k;
		}
		let Rr = !1;
		B.size && (hn(), pn()), Le.on("end", () => {
			if (Rr = !0, P.current !== "force" || (Ar() && pr(), Or = !0, o.nodes.forEach((e) => {
				e.fx = e.x, e.fy = e.y, e._forcePos = {
					x: e.x,
					y: e.y
				};
			}), m || Ir({ animate: !0 }), (0, cs.layoutIsDegenerate)(o.nodes, N({
				hovered: !1,
				pinned: !1
			})))) return;
			let e = M.current;
			if (e) for (let t of o.nodes) !t.pinned && t._forcePos && e.setNodePosition(se("force") + R(t), t.x, t.y, { silent: !0 });
			I.current && I.current();
		});
		let zr = () => {
			if (!document.hidden) {
				if (!Rr) {
					Le.alpha(.8).restart();
					return;
				}
				Er ||= Ir({ initialZoomOut: !0 });
			}
		};
		document.addEventListener("visibilitychange", zr);
		let Br = () => {
			y = !1, Ir({
				animate: !0,
				focus: !1
			});
		}, Vr = () => {
			o.nodes.forEach((e) => {
				e.fx = null, e.fy = null, delete e._forcePos;
			});
			let e = M.current;
			if (e) for (let t of o.nodes) {
				let n = ce(t);
				e.nodeState(n) && e.setNodePosition(n, t.x, t.y, { silent: !0 });
			}
			Le.alpha(.8).restart();
		}, Hr = () => {
			let e = N({
				hovered: !1,
				pinned: !1
			});
			o.nodes.forEach((e) => {
				delete e._size;
			});
			let t = M.current;
			if (t) for (let n of o.nodes) t.setNodeSize(R(n), e.width, e.height, { silent: !0 });
			pr();
		}, Ur = () => {
			let e = M.current;
			e && e.resetLayout && e.resetLayout(), Ee({ repaint: !1 }), o.nodes.forEach((e) => {
				e.fx = null, e.fy = null, delete e._forcePos;
			}), Ft() && (Yt(), pr()), Le.alpha(.8).restart(), Ir({ animate: !0 });
		}, Wr = () => {
			let e = M.current;
			e && e.resetLayout && e.resetLayout(), k.current && k.current(null), j(null), Un(), ur = null, le.current = null, Wn.classed("dimmed", !1).classed("tag-active", !1), Qn.classed("dimmed", !1).style("z-index", null), kn.classed("highlighted", !1), z.current.clear(), o.nodes.forEach((e) => {
				delete e._size, delete e._customWidth, delete e._customHeight, delete e._forcePos, e.fx = null, e.fy = null;
			}), B.clear();
			for (let e of Ye()) B.add(e);
			Ut.clear(), Ee({ repaint: !1 }), m = !1, y = !!x.initialFocus && x.initialFocus !== "all", ir(), hn(), typeof window < "u" && window.dispatchEvent(new CustomEvent("graph:containers-changed", { detail: _n() })), o.containers && o.containers.length && Nt() ? (Ft() && Yt(), xn(), pn(), pr(), Ir({ animate: !0 })) : (Le.alpha(.8).restart(), Ir({ animate: !0 }));
		};
		window.addEventListener("graph:reset-all", Wr), window.addEventListener("graph:zoom-to-fit", Br), window.addEventListener("graph:unpin-all", Vr), window.addEventListener("graph:reset-sizes", Hr), window.addEventListener("graph:reset-layout", Ur);
		let Gr = {
			"graph:open-container": (e) => bn.openContainer(e.detail && e.detail.id),
			"graph:close-container": (e) => bn.closeContainer(e.detail && e.detail.id),
			"graph:toggle-container": (e) => bn.toggleContainer(e.detail && e.detail.id),
			"graph:open-all-containers": () => bn.openAllContainers(),
			"graph:close-all-containers": () => bn.closeAllContainers()
		};
		for (let [e, t] of Object.entries(Gr)) window.addEventListener(e, t);
		return () => {
			ne.current = null, re.current = null, ae.current = null, br && typeof cancelAnimationFrame < "u" && cancelAnimationFrame(br), ht && ht.disconnect(), Le.stop(), document.removeEventListener("visibilitychange", zr), window.removeEventListener("resize", Re), n.removeEventListener("touchstart", Ce, { capture: !0 }), n.removeEventListener("touchmove", we, { capture: !0 }), n.removeEventListener("touchend", Te, { capture: !0 }), n.removeEventListener("touchcancel", Te, { capture: !0 }), n.removeEventListener("touchstart", Ne, { capture: !0 }), n.removeEventListener("touchmove", Pe, { capture: !0 }), n.removeEventListener("touchend", Fe, { capture: !0 }), De.cancel(), window.removeEventListener("graph:reset-all", Wr), window.removeEventListener("postpipe:cover-frame", Dr), window.PostPipeGraphWorld && window.PostPipeGraphWorld.snapshot === en && delete window.PostPipeGraphWorld, window.removeEventListener("graph:zoom-to-fit", Br), window.removeEventListener("graph:unpin-all", Vr), window.removeEventListener("graph:reset-sizes", Hr), window.removeEventListener("graph:reset-layout", Ur);
			for (let [e, t] of Object.entries(Gr)) window.removeEventListener(e, t);
			v && v.current === bn && (v.current = null), Zn.forEach(({ root: e }) => {
				queueMicrotask(() => e.unmount());
			}), Zn.clear();
		};
	}, [e, pe]), r(() => {
		let e = te.current;
		if (!e || !e.axisLayer) return;
		let t = d || {}, n = () => he(e, t);
		I.current = t.on ? n : null, n();
	}, [
		d,
		l,
		e,
		pe
	]);
	function he(e, t) {
		if (e.axisLayer.selectAll("*").remove(), L.current = null, !t.on) {
			F.current = !1;
			return;
		}
		let n = E.current, r = n ? n.clientWidth : window.innerWidth, i = n ? n.clientHeight : window.innerHeight;
		if (r < 60 || i < 60) return;
		let a = t.dock || w.dock, o = a === "left" || a === "right", s = w.endPadding, c = Number.isFinite(t.offset) ? t.offset : w.inset, l = a === "right" ? r - c : a === "bottom" ? i - c : c, u = Math.max((o ? i : r) - s * 2, 120), d = o ? {
			x: l,
			y: s
		} : {
			x: s,
			y: l
		}, f = (0, cs.dimensionAxisGeometry)(e.data.nodes, {
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
			let t = vo(e.svg.node());
			h.forEach(({ node: n, anchor: r, line: i }) => {
				i.style("display", n._closedHidden ? "none" : null);
				let a = e.toScreen ? e.toScreen(n.x, n.y) : t.apply([n.x, n.y]);
				i.attr("x1", r.x).attr("y1", r.y).attr("x2", a[0]).attr("y2", a[1]);
			});
		}
		L.current = g, g();
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
			if (S !== null && C && M.current) {
				let e = a === "right" || a === "bottom" ? c - C : c + C;
				M.current.setTimeAxis({
					offset: Math.max(20, e),
					moved: !0
				});
			}
			S = null;
		}));
	}
	return r(() => {
		P.current = l;
		let e = te.current;
		if (!e) return;
		let t = M.current, n = N({
			hovered: !1,
			pinned: !1
		});
		if (e.recomputeContainers && e.recomputeContainers(), l === "force" && e.data.nodes.filter((e) => {
			let n = t && t.nodeState(se("force") + R(e));
			return n && !n.auto || e._forcePos;
		}).length < e.data.nodes.length * .5) {
			e.data.nodes.forEach((e) => {
				let n = t && t.nodeState(se("force") + R(e));
				n && !n.auto ? (e.fx = n.x, e.fy = n.y) : (e.fx = null, e.fy = null);
			}), e.simulation.alpha(1).restart();
			return;
		}
		let r = l === "force" ? Object.fromEntries(e.data.nodes.map((e) => [e.id, e._forcePos || t && t.nodeState(se("force") + R(e)) || {
			x: e.x,
			y: e.y
		}])) : l === "radial" && e.ringTargets && e.ringTargets() || (0, cs.computeLayout)(l, e.data.nodes, {
			cardW: n.width,
			cardH: n.height
		});
		if (!r) return;
		let i = new Map(e.data.nodes.map((e) => [e.id, {
			x: e.x,
			y: e.y
		}]));
		e.data.nodes.forEach((e) => {
			let n = t && t.nodeState(se(l) + R(e)), i = n && typeof n.x == "number" && !n.auto ? {
				x: n.x,
				y: n.y
			} : r[e.id];
			i && (e.targetX = i.x, e.targetY = i.y, e.fx = i.x, e.fy = i.y, t && !(n && !n.auto) && t.setNodePosition(se(l) + R(e), i.x, i.y, { silent: !0 }));
		});
		let a = Hi;
		Ri().duration(760).ease(a).tween("layout-transition", () => {
			let t = e.data.nodes.map((e) => {
				let t = i.get(e.id) || {
					x: e.x,
					y: e.y
				}, n = typeof e.targetX == "number" ? e.targetX : e.x, r = typeof e.targetY == "number" ? e.targetY : e.y, a = zn(t.x, n), o = zn(t.y, r);
				return (t) => {
					e.x = a(t), e.y = o(t);
				};
			});
			return (n) => {
				for (let e = 0; e < t.length; e++) t[e](n);
				e.applyPositions(), L.current && L.current();
			};
		}).on("end", () => {
			e.data.nodes.forEach((e) => {
				typeof e.targetX == "number" && (e.x = e.targetX), typeof e.targetY == "number" && (e.y = e.targetY), delete e.targetX, delete e.targetY;
			}), e.applyPositions(), L.current && L.current();
		});
		let o = setTimeout(() => {
			I.current && I.current(), e.fitToViewport && e.fitToViewport();
		}, 800);
		return () => clearTimeout(o);
	}, [l]), /* @__PURE__ */ f("div", {
		ref: E,
		className: Oo.graphContainer,
		"data-graph-root": !0
	});
}
var K = {
	overlay: "_overlay_12756_4",
	open: "_open_12756_16",
	panel: "_panel_12756_30",
	minimized: "_minimized_12756_67",
	wide: "_wide_12756_74",
	toolbar: "_toolbar_12756_93",
	dragGrip: "_dragGrip_12756_110",
	windowControls: "_windowControls_12756_118",
	restorePill: "_restorePill_12756_124",
	popIn: "_popIn_12756_1",
	pillIcon: "_pillIcon_12756_153",
	pillLabel: "_pillLabel_12756_157",
	pillTitle: "_pillTitle_12756_163",
	pillAuthor: "_pillAuthor_12756_173",
	pillAction: "_pillAction_12756_179",
	toolbarGroup: "_toolbarGroup_12756_194",
	ttsMount: "_ttsMount_12756_203",
	toolbarSeparator: "_toolbarSeparator_12756_215",
	toolbarSpacer: "_toolbarSpacer_12756_222",
	tb: "_tb_12756_238",
	tbLabeled: "_tbLabeled_12756_261",
	tbText: "_tbText_12756_267",
	active: "_active_12756_273",
	closeBtn: "_closeBtn_12756_278",
	tbTooltip: "_tbTooltip_12756_293",
	syndLink: "_syndLink_12756_315",
	canonical: "_canonical_12756_333",
	progress: "_progress_12756_349",
	progressFill: "_progressFill_12756_358",
	progressSide: "_progressSide_12756_365",
	frontmatterPanel: "_frontmatterPanel_12756_383",
	fmRow: "_fmRow_12756_397",
	fmLabel: "_fmLabel_12756_404",
	fmValue: "_fmValue_12756_413",
	fmTag: "_fmTag_12756_417",
	fmSyndLink: "_fmSyndLink_12756_427",
	body: "_body_12756_437",
	articleHeader: "_articleHeader_12756_486",
	articleKicker: "_articleKicker_12756_490",
	articleTitle: "_articleTitle_12756_498",
	articleByline: "_articleByline_12756_506",
	articleMeta: "_articleMeta_12756_521",
	rightsLine: "_rightsLine_12756_526",
	copyToast: "_copyToast_12756_535",
	show: "_show_12756_551",
	bookmarkRibbon: "_bookmarkRibbon_12756_556",
	ribbonTooltip: "_ribbonTooltip_12756_579",
	inlineNoteForm: "_inlineNoteForm_12756_605",
	inlineNoteInput: "_inlineNoteInput_12756_611",
	marksPanel: "_marksPanel_12756_627",
	marksHeader: "_marksHeader_12756_636",
	marksList: "_marksList_12756_648",
	markItem: "_markItem_12756_654",
	markBody: "_markBody_12756_671",
	markQuote: "_markQuote_12756_677",
	markNote: "_markNote_12756_684",
	markNoteEmpty: "_markNoteEmpty_12756_693",
	markNoteInput: "_markNoteInput_12756_698",
	markActions: "_markActions_12756_710",
	markBtn: "_markBtn_12756_717",
	markBtnDanger: "_markBtnDanger_12756_737",
	marksListPanel: "_marksListPanel_12756_743",
	inlineNotePanel: "_inlineNotePanel_12756_753",
	noteInput: "_noteInput_12756_759",
	marksLegend: "_marksLegend_12756_775",
	markMain: "_markMain_12756_787",
	markTitle: "_markTitle_12756_792",
	noMarks: "_noMarks_12756_818",
	following: "_following_12756_860",
	navTop: "_navTop_12756_915",
	navBottom: "_navBottom_12756_916",
	navItem: "_navItem_12756_924",
	navDir: "_navDir_12756_941",
	navTitle: "_navTitle_12756_947",
	navBig: "_navBig_12756_951",
	navLocked: "_navLocked_12756_959",
	navStatus: "_navStatus_12756_961",
	turnOut_next: "_turnOut_next_12756_969",
	ppTurnOutNext: "_ppTurnOutNext_12756_1",
	turnOut_prev: "_turnOut_prev_12756_970",
	ppTurnOutPrev: "_ppTurnOutPrev_12756_1",
	turnIn_next: "_turnIn_next_12756_971",
	ppTurnInNext: "_ppTurnInNext_12756_1",
	turnIn_prev: "_turnIn_prev_12756_972",
	ppTurnInPrev: "_ppTurnInPrev_12756_1",
	notYet: "_notYet_12756_982",
	notYetTitle: "_notYetTitle_12756_989",
	notYetStatus: "_notYetStatus_12756_990"
}, Ms = {
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
}, Ns = /* @__PURE__ */ m(((e, t) => {
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
})), Ps = /* @__PURE__ */ m(((e, t) => {
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
	var a = {
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
	function o(e) {
		let t = ["default", ...(e && e.reader && Array.isArray(e.reader.fonts) ? e.reader.fonts : ["default", "opendyslexic"]).filter((e) => e !== "default" && a[e])];
		return [...new Set(t)].map((e) => a[e]);
	}
	t.exports = {
		progressBarMode: r,
		allowDownload: i,
		readerFonts: o,
		READER_FONTS: a,
		PROGRESS_BARS: n
	};
})), Fs = /* @__PURE__ */ m(((e, t) => {
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
})), Is = Ns(), Ls = Ps(), Rs = Fs(), zs = "p, li, blockquote, h1, h2, h3, h4, h5, h6, dd, dt, figcaption, td, th", Bs = "pp-follow-sentence", Vs = "pp-follow-word", Hs = "pp-follow-block", Us = () => typeof CSS < "u" && CSS.highlights && typeof Highlight < "u";
function Ws(e, t) {
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
function Gs(e) {
	let t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT, { acceptNode(e) {
		let t = e.parentElement;
		return t && t.closest(".bookmarkRibbon, [aria-hidden=\"true\"]") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
	} }), r;
	for (; r = n.nextNode();) t.push(r);
	return t;
}
function Ks(e, t, n, r) {
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
function qs(e) {
	Us() && (CSS.highlights.delete(Bs), CSS.highlights.delete(Vs)), e && (e.querySelectorAll("." + Hs).forEach((e) => e.classList.remove(Hs)), delete e.dataset.followSentence, delete e.dataset.followWord);
}
function Js(e, t, n) {
	let r = Ws(t, n);
	if (!r || !e.contains(r.node)) return null;
	let i = r.node.nodeType === 3 ? r.node.parentElement : r.node, a = i && i.closest(zs);
	if (!a || !e.contains(a)) return null;
	let o = Gs(a);
	if (!o.length) return null;
	let s = [], c = "", l = null;
	for (let e of o) s.push(c.length), e === r.node && (l = c.length + r.offset), c += e.nodeValue;
	if (l === null) return null;
	let u = (0, Rs.spanAt)(c, l);
	if (!u) return null;
	qs(e);
	let d = c.slice(u.sentence[0], u.sentence[1]), f = u.word ? c.slice(u.word[0], u.word[1]) : "";
	return Us() ? (CSS.highlights.set(Bs, new Highlight(Ks(o, s, u.sentence[0], u.sentence[1]))), u.word && CSS.highlights.set(Vs, new Highlight(Ks(o, s, u.word[0], u.word[1])))) : a.classList.add(Hs), e.dataset.followSentence = d, e.dataset.followWord = f, {
		sentence: d,
		word: f
	};
}
function Ys(e) {
	let t = !1, n = 0, r = null, i = () => {
		n = 0, r && Js(e, r.x, r.y);
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
		n && cancelAnimationFrame(n), e.removeEventListener("pointerdown", o), e.removeEventListener("pointermove", s), window.removeEventListener("pointerup", c), window.removeEventListener("pointercancel", c), qs(e);
	};
}
//#endregion
//#region src/components/ReaderPanel/boldStartHtml.js
var Xs = (/* @__PURE__ */ m(((e, t) => {
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
})))(), Zs = new Set([
	"SCRIPT",
	"STYLE",
	"CODE",
	"PRE",
	"KBD",
	"SAMP",
	"svg"
]);
function Qs(e) {
	if (!e || typeof DOMParser > "u") return e;
	let t = new DOMParser().parseFromString(`<div id="pp-bs-root">${e}</div>`, "text/html"), n = t.getElementById("pp-bs-root"), r = t.createTreeWalker(n, NodeFilter.SHOW_TEXT, { acceptNode(e) {
		for (let t = e.parentElement; t && t !== n; t = t.parentElement) if (Zs.has(t.tagName)) return NodeFilter.FILTER_REJECT;
		return /[\p{L}]/u.test(e.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
	} }), i = [], a;
	for (; a = r.nextNode();) i.push(a);
	for (let e of i) {
		let n = t.createDocumentFragment();
		for (let r of (0, Xs.boldStartSegments)(e.nodeValue)) if (r.bold) {
			let e = t.createElement("b");
			e.className = "pp-bs", e.textContent = r.text, n.appendChild(e);
		} else n.appendChild(t.createTextNode(r.text));
		e.parentNode.replaceChild(n, e);
	}
	return n.innerHTML;
}
//#endregion
//#region src/lib/rights.js
var $s = /* @__PURE__ */ m(((e, t) => {
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
		let t = r(e);
		return t ? `<footer class="pp-rights" data-rights>${n(t)}</footer>` : "";
	}
	t.exports = {
		rightsLine: r,
		rightsMeta: i,
		rightsFooterHtml: a
	};
})), ec = /* @__PURE__ */ m(((e, t) => {
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
})), tc = $s(), nc = ec(), q = {
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
}, rc = "pp-contrib-passage", ic = () => typeof CSS < "u" && CSS.highlights && typeof Highlight < "u";
function ac(e) {
	if (!e) return "";
	let t = new Date(e.length === 10 ? `${e}T00:00:00` : e);
	return isNaN(t) ? "" : t.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	});
}
function oc(e, t) {
	let n = String(e || "").replace(/\s+/g, " ").trim();
	return n.length > t ? n.slice(0, t - 1).trimEnd() + "…" : n;
}
function sc(e, t, n) {
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
function cc({ article: e, contributions: t, config: n, feedData: i, textRef: o, textKey: s, onOpenChapter: l, children: u }) {
	let m = (0, ys.slugOf)(e), h = a(() => (0, ys.forChapter)(t, m), [t, m]), [g, _] = c(null), [v, y] = c({}), b = a(() => {
		let e = /* @__PURE__ */ new Map();
		for (let t of i && i.items || []) e.set((0, ys.slugOf)(t), t);
		return e;
	}, [i]);
	r(() => {
		_(null);
		let e = setTimeout(() => {
			let e = o && o.current, t = e ? Array.from(e.querySelectorAll("p")) : [], n = t.map((e) => e.textContent), r = {};
			for (let e of h) e.quote && (r[e.id] = t.length ? (0, ys.resolveQuote)(n, e.quote) : null);
			y(r);
		}, 80);
		return () => clearTimeout(e);
	}, [
		h,
		e,
		s
	]), r(() => () => {
		ic() && CSS.highlights.delete(rc);
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
		let a = sc(r, t.offset, t.length);
		n.querySelectorAll("[data-contrib-passage]").forEach((e) => e.removeAttribute("data-contrib-passage")), r.setAttribute("data-contrib-passage", e.id), a && ic() && CSS.highlights.set(rc, new Highlight(a)), setTimeout(() => {
			r.getAttribute("data-contrib-passage") === e.id && r.removeAttribute("data-contrib-passage"), ic() && CSS.highlights.delete(rc);
		}, 4e3);
	};
	if (!h.length && !u && !(n && n.submit)) return null;
	let S = (e) => {
		if (!e.quote) return null;
		let t = v[e.id];
		return t ? /* @__PURE__ */ p("div", {
			className: q.quote,
			"data-contrib-anchor": "found",
			children: [/* @__PURE__ */ p("span", {
				className: q.quoteText,
				children: [
					"“",
					oc(e.quote.exact, 140),
					"”"
				]
			}), /* @__PURE__ */ f("button", {
				type: "button",
				className: q.linkBtn,
				onClick: () => x(e),
				"data-contrib-show": !0,
				children: "Show the passage"
			})]
		}) : t === null ? /* @__PURE__ */ f("div", {
			className: q.fallback,
			"data-contrib-anchor": "fallback",
			children: "This was about a passage that isn’t in the chapter as it reads now, so it stays with the chapter as a whole."
		}) : null;
	}, C = (e) => /* @__PURE__ */ p("div", {
		className: q.byline,
		children: [
			/* @__PURE__ */ f("span", {
				className: q.author,
				children: e.author
			}),
			ac(e.created) && /* @__PURE__ */ p("span", {
				className: q.date,
				children: [" · ", ac(e.created)]
			}),
			e.test && /* @__PURE__ */ f("span", {
				className: q.testTag,
				children: " · test"
			})
		]
	});
	return /* @__PURE__ */ p("aside", {
		className: q.section,
		"aria-label": "From readers",
		"data-contributions": !0,
		"data-pp-not-text": !0,
		children: [
			/* @__PURE__ */ p("div", {
				className: q.head,
				children: [/* @__PURE__ */ f("div", {
					className: q.title,
					children: "From readers"
				}), /* @__PURE__ */ f("div", {
					className: q.note,
					children: "Not part of the book. Written by readers, with their names."
				})]
			}),
			h.length === 0 && /* @__PURE__ */ f("div", {
				className: q.empty,
				children: "Nothing from readers on this chapter yet."
			}),
			/* @__PURE__ */ f("ul", {
				className: q.list,
				children: h.map((e) => /* @__PURE__ */ p("li", {
					className: q.item,
					"data-contrib": e.id,
					"data-contrib-type": e.type,
					children: [
						/* @__PURE__ */ f("div", {
							className: q.kind,
							children: e.type === "essay" ? "Essay" : e.type === "art" ? "Art" : e.type === "connection" ? "Connection" : "Comment"
						}),
						e.title && /* @__PURE__ */ f("div", {
							className: q.itemTitle,
							children: e.title
						}),
						C(e),
						S(e),
						e.type === "comment" && (0, ys.paragraphsOf)(e.body).map((e, t) => /* @__PURE__ */ f("div", {
							className: q.para,
							children: e
						}, t)),
						e.type === "connection" && (() => {
							let t = e.chapter === m ? e.to : e.chapter, n = b.get(t);
							return /* @__PURE__ */ p(d, { children: [/* @__PURE__ */ p("div", {
								className: q.para,
								children: [
									"Connects this chapter with",
									" ",
									n && l ? /* @__PURE__ */ f("button", {
										type: "button",
										className: q.linkBtn,
										onClick: () => l(n),
										"data-contrib-goto": t,
										children: n.title || t
									}) : n && n.title || t
								]
							}), (0, ys.paragraphsOf)(e.body).map((e, t) => /* @__PURE__ */ f("div", {
								className: q.para,
								children: e
							}, t))] });
						})(),
						e.type === "art" && /* @__PURE__ */ p("figure", {
							className: q.art,
							children: [/* @__PURE__ */ f("img", {
								src: (0, ys.assetUrl)(e.asset, n),
								alt: e.alt || `Art by ${e.author}`,
								loading: "lazy"
							}), e.body && /* @__PURE__ */ f("figcaption", {
								className: q.para,
								children: e.body
							})]
						}),
						e.type === "essay" && (() => {
							let t = (0, ys.paragraphsOf)(e.body), n = g === e.id;
							return /* @__PURE__ */ p("div", {
								className: q.essay,
								"data-contrib-essay": n ? "open" : "closed",
								children: [
									!n && /* @__PURE__ */ f("div", {
										className: q.para,
										children: oc(t[0] || "", 220)
									}),
									n && t.map((e, t) => /* @__PURE__ */ f("div", {
										className: q.para,
										children: e
									}, t)),
									/* @__PURE__ */ f("button", {
										type: "button",
										className: q.linkBtn,
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
			n && n.submit && /* @__PURE__ */ f(uc, {
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
function lc(e) {
	let t = typeof window < "u" && window.getSelection ? window.getSelection() : null;
	if (!t || t.isCollapsed || !t.rangeCount || !e) return null;
	let n = t.getRangeAt(0);
	if (!e.contains(n.commonAncestorContainer)) return null;
	let r = n.startContainer.nodeType === 1 ? n.startContainer : n.startContainer.parentElement, i = r && r.closest("p");
	if (!i || !e.contains(i) || !i.contains(n.endContainer)) return { error: "Choose a passage within one paragraph." };
	let a = document.createRange();
	a.setStart(i, 0), a.setEnd(n.startContainer, n.startOffset);
	let o = a.toString().length;
	return (0, ys.quoteFromSelection)(i.textContent, o, o + n.toString().length);
}
function uc({ article: e, chapter: t, config: n, feedData: i, textRef: a }) {
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
			let e = lc(a && a.current);
			e && T(e);
		};
		return document.addEventListener("selectionchange", e), () => document.removeEventListener("selectionchange", e);
	}, [o, a]);
	let k = (i && i.items || []).filter((e) => (0, ys.slugOf)(e) !== t && e._posted !== "title").map((e) => ({
		id: (0, ys.slugOf)(e),
		title: e.title || (0, ys.slugOf)(e)
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
		className: q.form,
		onSubmit: async (e) => {
			e.preventDefault();
			let t = A(), r = (0, ys.checkSubmission)(t, n);
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
				className: q.formTitle,
				children: "Add yours"
			}),
			/* @__PURE__ */ f("div", {
				className: q.note,
				children: "It is read before it appears here. Only the name you give is kept with it; nothing else about you is asked for or stored."
			}),
			/* @__PURE__ */ p("label", {
				className: q.field,
				children: [/* @__PURE__ */ f("span", { children: "Name to show" }), /* @__PURE__ */ f("input", {
					value: l,
					maxLength: O.name,
					onChange: (e) => u(e.target.value),
					autoComplete: "nickname",
					"data-contrib-field": "author"
				})]
			}),
			/* @__PURE__ */ p("label", {
				className: q.field,
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
				className: q.field,
				children: [/* @__PURE__ */ f("span", { children: "Title (optional)" }), /* @__PURE__ */ f("input", {
					value: g,
					maxLength: 140,
					onChange: (e) => _(e.target.value),
					"data-contrib-field": "title"
				})]
			}),
			m === "connection" && /* @__PURE__ */ p("label", {
				className: q.field,
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
				className: q.field,
				children: [/* @__PURE__ */ f("span", { children: m === "connection" ? "How they connect" : "Your words" }), /* @__PURE__ */ f("textarea", {
					value: v,
					maxLength: O.body,
					rows: m === "essay" ? 10 : 4,
					onChange: (e) => y(e.target.value),
					"data-contrib-field": "body"
				})]
			}),
			/* @__PURE__ */ f("div", {
				className: q.passage,
				children: S && !S.error ? /* @__PURE__ */ p(d, { children: [/* @__PURE__ */ p("span", {
					className: q.quoteText,
					children: [
						"About: “",
						oc(S.exact, 120),
						"”"
					]
				}), /* @__PURE__ */ f("button", {
					type: "button",
					className: q.linkBtn,
					onClick: () => C(null),
					children: "Not about a passage"
				})] }) : /* @__PURE__ */ p(d, { children: [/* @__PURE__ */ f("span", {
					className: q.note,
					children: S && S.error ? S.error : "To write about a passage, select it in the chapter, then:"
				}), /* @__PURE__ */ f("button", {
					type: "button",
					className: q.linkBtn,
					onMouseDown: (e) => e.preventDefault(),
					onClick: () => C(lc(a && a.current) || w || { error: "Select a passage in the chapter first." }),
					"data-contrib-use-selection": !0,
					children: "Use the passage I selected"
				})] })
			}),
			E.errors.length > 0 && /* @__PURE__ */ f("ul", {
				className: q.errors,
				role: "alert",
				children: E.errors.map((e, t) => /* @__PURE__ */ f("li", { children: e }, t))
			}),
			E.done && /* @__PURE__ */ f("div", {
				className: q.thanks,
				role: "status",
				"data-contrib-sent": !0,
				children: "Thank you. It will appear here once it has been read and approved."
			}),
			/* @__PURE__ */ p("div", {
				className: q.formActions,
				children: [/* @__PURE__ */ f("button", {
					type: "submit",
					className: q.addBtn,
					disabled: E.sending,
					"data-contrib-send": !0,
					children: E.sending ? "Sending…" : "Send"
				}), /* @__PURE__ */ f("button", {
					type: "button",
					className: q.linkBtn,
					onClick: () => s(!1),
					children: "Close"
				})]
			})
		]
	}) : /* @__PURE__ */ f("div", {
		className: q.addRow,
		children: /* @__PURE__ */ f("button", {
			type: "button",
			className: q.addBtn,
			onClick: () => s(!0),
			"data-contrib-add": !0,
			children: "Add yours"
		})
	});
}
//#endregion
//#region src/components/ReaderPanel/ReaderPanel.jsx
function dc({ article: e, onClose: t, settings: n, viewState: i, targetParagraph: o, feedData: l, onNavigate: u, contributions: m, contributionsConfig: h }) {
	let [g, _] = c(!1), [v, y] = c(!1), [b, x] = c(null), [S, C] = c(!1), [w, T] = c(""), [E, D] = c(0), [O, k] = c(!1), [A, ee] = c(!1), j = s(null), M = s(null), N = s(!1), te = s({
		mouseX: 0,
		mouseY: 0,
		posX: 0,
		posY: 0
	}), [P, F] = c(null), [I, L] = c(null), ne = s([]);
	r(() => {
		de.current && (clearTimeout(de.current), pe()), e ? (_(!0), y(!1), F(null), j.current && (j.current.scrollTop = 0), D(0), ue(e)) : (_(!1), y(!1), T(""), D(0), C(!1));
	}, [e]);
	let re = (e) => e ? e.originalItem && e.originalItem.id || e.id || e.url : null, ie = re(e), ae = i && ie ? i.bookmarks(ie) : [], R = !!(i && i.readerAid && i.readerAid("boldStart")), oe = a(() => R ? Qs(w) : w, [w, R]), se = a(() => ({ __html: oe }), [oe]), ce = (e) => {
		e.target.closest("button") || e.target.closest("a") || e.target.closest("input") || (N.current = !0, te.current = {
			mouseX: e.clientX,
			mouseY: e.clientY,
			posX: b ? b.x : 0,
			posY: b ? b.y : 0
		}, window.addEventListener("mousemove", z), window.addEventListener("mouseup", le));
	}, z = (e) => {
		if (!N.current) return;
		let t = e.clientX - te.current.mouseX, n = e.clientY - te.current.mouseY;
		x({
			x: te.current.posX + t,
			y: te.current.posY + n
		});
	}, le = () => {
		N.current = !1, window.removeEventListener("mousemove", z), window.removeEventListener("mouseup", le);
	}, ue = async (e) => {
		let t = e.kind || "essay";
		if (t === "placeholder" || e.substrate === "placeholder") {
			let t = e.series_part || e.title || "";
			T(`
        <div style="padding: 40px 24px; text-align: center; border: 1px dashed rgba(212, 175, 55, 0.35); border-radius: 12px; background: rgba(20, 24, 38, 0.6); margin-top: 24px;">
          <div style="font-size: 32px; margin-bottom: 12px; opacity: 0.9;">📖</div>
          <div style="font-size: 20px; font-weight: 600; color: var(--rp-accent, #d4af37); margin-bottom: 8px;">Chapter ${t}</div>
          <div style="font-size: 13px; color: var(--rp-text, #a8b2d1); opacity: 0.8; letter-spacing: 0.5px;">Act ${Number(t) >= 21 ? "3" : "2"} · In Progress</div>
        </div>
      `);
			return;
		}
		if (e._posted === "title") {
			let t = (0, nc.navStatus)(l, e) || "";
			T(`<div class="${K.notYet}" data-not-yet><div class="${K.notYetTitle}">${fc(e.title || "")}</div><div class="${K.notYetStatus}">${fc(t)}</div></div>`);
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
			a && a.remove(), i.querySelectorAll(".pp-rights").forEach((e) => e.remove()), T((i.querySelector("body") ? i.querySelector("body").innerHTML : r) + mc(e));
		} catch {
			T(pc(e, "Rendered article not yet published to GitHub Pages."));
		}
		else T(t === "image" ? (e.image ? `<img src="${e.image}" style="max-width:100%;height:auto;border-radius:4px;display:block;margin:0 auto;">` : "<p style=\"color:#666;\">No image resolved.</p>") + hc(e) : pc(e) + hc(e));
	}, de = s(null), fe = s(null), pe = () => {
		de.current = null;
		let e = j.current, t = fe.current;
		if (!e || !t || !i || !i.setReadingProgress) return;
		let n = e.scrollHeight - e.clientHeight;
		i.setReadingProgress(t, n > 0 ? e.scrollTop / n : 1);
	}, me = () => {
		if (j.current) {
			let { scrollTop: e, scrollHeight: t, clientHeight: n } = j.current, r = t - n, i = r > 0 ? e / r * 100 : 100;
			D(Math.max(0, Math.min(i, 100))), fe.current && (i >= 98 ? (clearTimeout(de.current), pe()) : de.current ||= setTimeout(pe, 350));
		}
	}, he = () => {
		if (!i || !e) return;
		let t = re(e), n = i.bookmarks(t);
		if (n.length) n.forEach((e) => i.removeBookmark(e.id));
		else {
			let n = ge(), r = j.current ? j.current.querySelectorAll("p") : [], a = n !== null && r[n] ? r[n].innerText.trim().split(/\s+/).slice(0, 8).join(" ") : "";
			i.addBookmark({
				item: t,
				para: n === null ? void 0 : n,
				quote: a,
				version: e.version
			});
		}
	}, ge = () => {
		if (!j.current) return null;
		let e = j.current.getBoundingClientRect(), t = j.current.querySelectorAll("p");
		for (let n = 0; n < t.length; n++) if (t[n].getBoundingClientRect().bottom > e.top + 10) return n;
		return null;
	}, _e = async () => {
		if (!e) return;
		let t = re(e), n = ge(), r = window.location.href.split("#")[0] + "#read=" + encodeURIComponent(t);
		n !== null && (r += "&p=" + n);
		try {
			await navigator.clipboard.writeText(r), k(!0), setTimeout(() => k(!1), 2e3);
		} catch (e) {
			console.error("Copy link failed:", e);
		}
	}, ve = (e) => {
		if (!j.current || e == null) return;
		let t = j.current.querySelectorAll("p");
		if (t[e]) {
			let n = j.current.getBoundingClientRect(), r = t[e].getBoundingClientRect();
			j.current.scrollTop += r.top - n.top - 20;
		}
	}, ye = async () => {
		if (!e || !j.current) return;
		let t = `${(n?.export?.license_header || "").replace("{{canonical_url}}", e.canonical_url || e.url)}\n\n---\n\n${j.current.innerText}`;
		try {
			await navigator.clipboard.writeText(t), k(!0), setTimeout(() => k(!1), 2e3);
		} catch (e) {
			console.error("Copy failed:", e);
		}
	}, be = () => {
		if (!e || !j.current || !(0, Ls.allowDownload)(n)) return;
		let t = `${(n?.export?.license_header || "").replace("{{canonical_url}}", e.canonical_url || e.url)}\n\n---\n\n${j.current.innerText}`, r = new Blob([t], { type: "text/markdown" }), i = document.createElement("a");
		i.href = URL.createObjectURL(r), i.download = `${(e.id || e.url).split("/").pop().replace(".html", "") || "article"}.md`, i.click(), URL.revokeObjectURL(i.href);
	}, xe = async (t) => {
		if (t.preventDefault(), e) try {
			await navigator.clipboard.writeText(e.canonical_url || e.url), k(!0), setTimeout(() => k(!1), 2e3);
		} catch (e) {
			console.error("Copy URL failed:", e);
		}
	};
	r(() => {
		if (clearTimeout(de.current), de.current = null, fe.current = null, !w || !e || e._posted === "title" || !i || !i.readingProgress) return;
		let t = re(e), n = setTimeout(() => {
			let e = j.current;
			if (!e) return;
			let n = i.readingProgress(t), r = e.scrollHeight - e.clientHeight;
			o == null && n.at > .02 && n.at < .98 && r > 0 && (e.scrollTop = n.at * r), fe.current = t, me(), r <= 0 && pe();
		}, 60);
		return () => clearTimeout(n);
	}, [w]), r(() => {
		w && o != null && j.current && setTimeout(() => {
			ve(o);
		}, 50);
	}, [w, o]);
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
				return (0, Is.resolveParagraph)(r, e.quote, t);
			}
		}
		return r;
	};
	r(() => {
		if (!i || !j.current) return;
		let t = e ? re(e) : null, n = i.bookmarks();
		if (j.current.querySelectorAll(".bookmarkRibbon").forEach((e) => e.remove()), t) {
			let r = n.find((e) => e.item === t);
			if (r) {
				let t = j.current.querySelectorAll("p"), n = Se(r, e, t);
				if (n !== null && t[n]) {
					let e = document.createElement("div");
					e.className = "bookmarkRibbon", e.setAttribute("aria-hidden", "true"), e.innerHTML = Ms.bookmark, e.style.position = "absolute", e.style.left = "-30px", e.style.top = "0", e.style.color = "var(--rp-accent)", e.style.width = "20px", e.style.height = "20px", t[n].style.position = "relative", t[n].appendChild(e);
				}
			}
		}
	}, [
		oe,
		i ? i.bookmarks() : null,
		e
	]);
	let Ce = !!(i && i.readerAid && i.readerAid("followAlong"));
	r(() => {
		if (!(!Ce || !j.current)) return Ys(j.current);
	}, [
		Ce,
		oe,
		e
	]);
	let we = a(() => e && l ? (0, nc.neighbours)(l, e.id) : {
		prev: [],
		next: []
	}, [e, l]), Te = () => typeof window < "u" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches, Ee = (e, t) => {
		if (!(!e || !u || !(0, nc.isReadable)(e))) {
			if (ne.current.forEach(clearTimeout), ne.current = [], Te()) {
				u(e);
				return;
			}
			F(t), ne.current.push(setTimeout(() => {
				L(t), u(e), ne.current.push(setTimeout(() => L(null), 520));
			}, 170));
		}
	}, De = (t) => {
		if (!e || !l) return;
		let n = (0, nc.step)(l, e.id, t);
		n && Ee(n, t);
	}, Oe = s(De);
	Oe.current = De, r(() => () => ne.current.forEach(clearTimeout), []);
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
		let e = j.current;
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
	if (Ae.current = he, r(() => {
		let e = () => {
			Ae.current && Ae.current();
		};
		return window.addEventListener("postpipe:reader-mark", e), () => window.removeEventListener("postpipe:reader-mark", e);
	}, []), !e) return null;
	let je = (e, t, n) => {
		let r = (0, nc.navStatus)(l, e), i = t === "next" ? "Next" : "Previous";
		return r ? /* @__PURE__ */ p("div", {
			className: `${K.navItem} ${K.navLocked} ${n ? K.navBig : ""}`,
			"data-reader-nav": t,
			"data-nav-status": !0,
			children: [
				/* @__PURE__ */ f("span", {
					className: K.navDir,
					children: i
				}),
				/* @__PURE__ */ f("span", {
					className: K.navTitle,
					children: e.title
				}),
				/* @__PURE__ */ f("span", {
					className: K.navStatus,
					children: r
				})
			]
		}, e.id) : /* @__PURE__ */ p("button", {
			className: `${K.navItem} ${n ? K.navBig : ""}`,
			"data-reader-nav": t,
			onClick: () => Ee(e, t),
			title: `${i}: ${e.title}`,
			children: [/* @__PURE__ */ p("span", {
				className: K.navDir,
				children: [
					t === "prev" ? "← " : "",
					i,
					t === "next" ? " →" : ""
				]
			}), /* @__PURE__ */ f("span", {
				className: K.navTitle,
				children: e.title
			})]
		}, e.id);
	}, Me = [e.date ? (/* @__PURE__ */ new Date(`${e.date}T00:00:00`)).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	}) : "", e.reading_time].filter(Boolean), Ne = (n?.author?.name || n?.author?.display || "harold young").toLowerCase(), Pe = n?.author?.url;
	e.authors && e.authors.length > 0 && e.authors[0].name ? (Ne = e.authors.map((e) => e.name).join(", ").toLowerCase(), Pe = e.authors[0].url || e.canonical_url || e.url) : e.author && (Ne = e.author.replace(/\s*\[humxn\]/i, "").trim().toLowerCase(), Pe = e.canonical_url || e.url);
	let Fe = (0, Lo.readerHeader)(n, e), Ie = (0, Ls.progressBarMode)(n), Le = (0, Ls.allowDownload)(n), Re = (0, tc.rightsLine)(n && n.rights);
	return /* @__PURE__ */ p(d, { children: [
		/* @__PURE__ */ f("div", {
			className: `${K.overlay} ${g && !v ? K.open : ""}`,
			onClick: t
		}),
		/* @__PURE__ */ p("div", {
			"data-reader-panel": !0,
			className: `${K.panel} ${g && !v ? K.open : ""} ${v ? K.minimized : ""} ${A ? K.wide : ""}`,
			style: b ? { transform: `translate3d(${b.x}px, ${b.y}px, 0px)` } : void 0,
			children: [
				Ie !== "none" && /* @__PURE__ */ f("div", {
					className: Ie === "side" ? K.progressSide : K.progress,
					role: "progressbar",
					"aria-label": "Reading progress",
					"aria-valuemin": 0,
					"aria-valuemax": 100,
					"aria-valuenow": Math.round(E),
					children: /* @__PURE__ */ f("div", {
						className: K.progressFill,
						style: Ie === "side" ? { height: `${E}%` } : { width: `${E}%` }
					})
				}),
				/* @__PURE__ */ p("div", {
					className: K.toolbar,
					onMouseDown: ce,
					onDoubleClick: () => x(null),
					title: "Drag toolbar to move window · Double-click to reset",
					children: [
						/* @__PURE__ */ f("div", {
							className: K.dragGrip,
							title: "Drag to move reading window",
							children: "⋮⋮"
						}),
						/* @__PURE__ */ f("div", {
							id: "tts-mount-point",
							className: `${K.toolbarGroup} ${K.ttsMount}`
						}),
						/* @__PURE__ */ f("div", { className: K.toolbarSeparator }),
						/* @__PURE__ */ f("div", { className: K.toolbarSeparator }),
						/* @__PURE__ */ p("div", {
							className: K.toolbarGroup,
							children: [/* @__PURE__ */ f("button", {
								className: `${K.tb} ${K.tbLabeled} ${ae.length > 0 ? K.active : ""}`,
								onClick: he,
								"aria-pressed": ae.length > 0,
								title: ae.length > 0 ? "Remove the bookmark in this chapter" : "Save the paragraph at the top of the reader",
								"data-bookmark-toggle": !0,
								dangerouslySetInnerHTML: { __html: `${Ms.bookmark}<span class="${K.tbText}">${ae.length > 0 ? "Marked" : "Mark here"}</span>` }
							}), /* @__PURE__ */ f("button", {
								className: `${K.tb} ${K.tbLabeled}`,
								onClick: () => window.dispatchEvent(new CustomEvent("postpipe:toggle-settings", { detail: {
									section: "place",
									open: !0
								} })),
								title: "Every place you have bookmarked, in the settings panel under Your place",
								"data-bookmark-list": !0,
								dangerouslySetInnerHTML: { __html: `${Ms.bookmarkList}<span class="${K.tbText}">Bookmarks</span>` }
							})]
						}),
						/* @__PURE__ */ f("div", { className: K.toolbarSeparator }),
						/* @__PURE__ */ f("div", {
							className: K.toolbarGroup,
							children: /* @__PURE__ */ f("button", {
								className: K.tb,
								onClick: _e,
								title: "Copy link to here",
								dangerouslySetInnerHTML: { __html: `${Ms.copy}<span class="${K.tbTooltip}">Link here</span>` }
							})
						}),
						/* @__PURE__ */ f("div", { className: K.toolbarSeparator }),
						/* @__PURE__ */ p("div", {
							className: K.toolbarGroup,
							children: [
								/* @__PURE__ */ f("button", {
									className: `${K.tb} ${S ? K.active : ""}`,
									onClick: () => C(!S),
									title: "Article details",
									dangerouslySetInnerHTML: { __html: `${Ms.info}<span class="${K.tbTooltip}">Details</span>` }
								}),
								Le && /* @__PURE__ */ f("button", {
									className: K.tb,
									onClick: be,
									title: "Export markdown",
									"data-reader-download": !0,
									dangerouslySetInnerHTML: { __html: `${Ms.download}<span class="${K.tbTooltip}">Export</span>` }
								}),
								/* @__PURE__ */ f("button", {
									className: K.tb,
									onClick: ye,
									title: "Copy to clipboard",
									dangerouslySetInnerHTML: { __html: `${Ms.copy}<span class="${K.tbTooltip}">Copy</span>` }
								}),
								/* @__PURE__ */ f("button", {
									className: `${K.tb} ${A ? K.active : ""}`,
									onClick: () => ee((e) => !e),
									title: A ? "Shrink reader" : "Widen reader",
									dangerouslySetInnerHTML: { __html: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">${A ? "<polyline points=\"15 3 21 3 21 9\"/><polyline points=\"9 21 3 21 3 15\"/><line x1=\"21\" y1=\"3\" x2=\"14\" y2=\"10\"/><line x1=\"3\" y1=\"21\" x2=\"10\" y2=\"14\"/>" : "<polyline points=\"3 9 3 3 9 3\"/><polyline points=\"21 15 21 21 15 21\"/><line x1=\"3\" y1=\"3\" x2=\"10\" y2=\"10\"/><line x1=\"21\" y1=\"21\" x2=\"14\" y2=\"14\"/>"}</svg><span class="${K.tbTooltip}">${A ? "Shrink" : "Widen"}</span>` }
								})
							]
						}),
						/* @__PURE__ */ f("div", { className: K.toolbarSeparator }),
						/* @__PURE__ */ p("div", {
							className: K.toolbarGroup,
							children: [/* @__PURE__ */ f("button", {
								className: `${K.tb} ${K.syndLink} ${K.canonical}`,
								onClick: xe,
								dangerouslySetInnerHTML: { __html: `${Ms.link}<span class="${K.tbTooltip}">Copy URL</span>` }
							}), Object.entries(e.syndication || {}).map(([e, t]) => {
								if (!t) return null;
								let r = n?.toolbar?.syndication_icons?.[e];
								return r ? /* @__PURE__ */ f("a", {
									href: t,
									target: "_blank",
									rel: "noopener noreferrer",
									className: `${K.tb} ${K.syndLink}`,
									dangerouslySetInnerHTML: { __html: `${Ms[r.icon] || Ms.globe}<span class="${K.tbTooltip}">${r.label}</span>` }
								}, e) : null;
							})]
						}),
						/* @__PURE__ */ f("div", { className: K.toolbarSpacer }),
						/* @__PURE__ */ p("div", {
							className: K.windowControls,
							children: [
								/* @__PURE__ */ f("button", {
									className: K.tb,
									onClick: () => window.dispatchEvent(new CustomEvent("postpipe:toggle-settings")),
									title: "Reading settings",
									"aria-label": "Reading settings",
									"data-reader-settings": !0,
									dangerouslySetInnerHTML: { __html: `${Ms.settings}<span class="${K.tbTooltip}">Settings</span>` }
								}),
								/* @__PURE__ */ f("button", {
									className: `${K.tb} ${K.minimizeBtn}`,
									onClick: () => y(!0),
									title: "Minimize reading window (turn off)",
									dangerouslySetInnerHTML: { __html: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="5" y1="12" x2="19" y2="12"/></svg><span class="${K.tbTooltip}">Minimize</span>` }
								}),
								/* @__PURE__ */ f("button", {
									className: `${K.tb} ${K.closeBtn}`,
									onClick: t,
									title: "Close reading window",
									dangerouslySetInnerHTML: { __html: `${Ms.close}<span class="${K.tbTooltip}">Close</span>` }
								})
							]
						})
					]
				}),
				S && /* @__PURE__ */ f(gc, {
					article: e,
					settings: n
				}),
				/* @__PURE__ */ p("div", {
					className: `${K.body} ${Ce ? K.following : ""} ${P ? K["turnOut_" + P] : ""} ${I ? K["turnIn_" + I] : ""}`,
					"data-tts-target": !0,
					"data-follow-along": Ce ? "on" : "off",
					ref: j,
					onScroll: me,
					children: [
						we.prev.length > 0 && /* @__PURE__ */ f("nav", {
							className: K.navTop,
							"aria-label": "Previous chapter",
							children: we.prev.map((e) => je(e, "prev", !1))
						}),
						/* @__PURE__ */ p("div", {
							className: K.articleHeader,
							children: [
								Fe.kicker && /* @__PURE__ */ f("div", {
									className: K.articleKicker,
									children: Fe.kicker
								}),
								/* @__PURE__ */ f("h1", {
									className: K.articleTitle,
									children: e.title || e.label
								}),
								Fe.byline && /* @__PURE__ */ p("div", {
									className: K.articleByline,
									children: ["by ", Pe ? /* @__PURE__ */ f("a", {
										href: Pe,
										target: "_blank",
										rel: "noopener noreferrer",
										children: Ne
									}) : Ne]
								}),
								Me.length > 0 && /* @__PURE__ */ f("div", {
									className: K.articleMeta,
									children: Me.join(" · ")
								}),
								e.kind && e.kind !== "essay" && /* @__PURE__ */ p("div", {
									className: K.articleMeta,
									style: {
										marginTop: 4,
										opacity: .7
									},
									children: ["substrate: ", e.kind]
								})
							]
						}),
						/* @__PURE__ */ f("div", {
							ref: M,
							"data-reader-text": !0,
							dangerouslySetInnerHTML: se
						}),
						w && (we.next.length > 0 || we.prev.length > 0) && /* @__PURE__ */ p("nav", {
							className: K.navBottom,
							"aria-label": "Next chapter",
							"data-reader-nav-bottom": !0,
							children: [we.next.map((e) => je(e, "next", !0)), we.next.length === 0 && we.prev.map((e) => je(e, "prev", !1))]
						}),
						Re && w && /* @__PURE__ */ f("footer", {
							className: K.rightsLine,
							"data-reader-rights": !0,
							children: Re
						}),
						h && w && e._posted !== "title" && /* @__PURE__ */ f(cc, {
							article: e,
							contributions: m || [],
							config: h,
							feedData: l,
							textRef: M,
							textKey: oe,
							onOpenChapter: (e) => Ee(e, "next")
						})
					]
				})
			]
		}),
		/* @__PURE__ */ f("div", {
			className: `${K.copyToast} ${O ? K.show : ""}`,
			children: "Copied to clipboard"
		}),
		v && e && /* @__PURE__ */ p("div", {
			className: K.restorePill,
			onClick: () => y(!1),
			title: "Bring reading window back",
			children: [
				/* @__PURE__ */ f("span", {
					className: K.pillIcon,
					children: "📖"
				}),
				/* @__PURE__ */ p("span", {
					className: K.pillLabel,
					children: [/* @__PURE__ */ f("span", {
						className: K.pillTitle,
						children: e.title || e.label
					}), /* @__PURE__ */ p("span", {
						className: K.pillAuthor,
						children: ["by ", Ne]
					})]
				}),
				/* @__PURE__ */ f("span", {
					className: K.pillAction,
					children: "Restore ↗"
				})
			]
		})
	] });
}
function fc(e) {
	return String(e).replace(/[&<>"']/g, (e) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;"
	})[e]);
}
function pc(e, t) {
	let n = t || `This substrate ("${e.kind || "unknown"}") is not yet renderable in the viewer.`, r = "<div style=\"padding:24px;border:1px dashed var(--rp-border);border-radius:6px;background:rgba(17,24,39,0.4);\">";
	r += `<p style="color:var(--rp-accent);font-weight:600;margin-bottom:8px;">${n}</p>`, e.todos && e.todos.length && (r += `<p style="color:#f39c12;font-size:13px;">Pending: ${e.todos.join(", ")}</p>`);
	let i = (e.url || e.id || "").split("/").pop().replace(".html", ""), a = e._source?.path || `chapters/${i}`;
	return r += `<p style="color:#888;font-size:13px;margin-top:12px;">The bundle exists at <code>${a}</code>.</p>`, r += "</div>", r;
}
function mc(e) {
	let t = e.forms && e.forms.companions || [];
	if (!t.length) return "";
	let n = "<div style=\"margin-top:32px;padding-top:24px;border-top:1px solid var(--rp-border);\">";
	return n += "<div style=\"color:var(--rp-accent);font-size:11px;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;\">also exists as</div>", n += `<div style="color:var(--rp-text);font-size:14px;">${t.map((e) => `<span class="${K.fmTag}">${e}</span>`).join(" ")}</div>`, n += "</div>", n;
}
function hc(e) {
	let t = [];
	if (e.seed && t.push(["seed", e.seed]), e.tldr && t.push(["tldr", e.tldr]), e.topology && e.topology.length && t.push(["topology", e.topology.join(" · ")]), e.energy && t.push(["energy", e.energy]), e.note && t.push(["note", e.note]), !t.length) return "";
	let n = "<div style=\"margin-top:32px;padding:20px;background:rgba(17,24,39,0.4);border-radius:6px;\">";
	for (let [e, r] of t) n += `<div class="${K.fmRow}"><span class="${K.fmLabel}">${e}</span><span class="${K.fmValue}">${r}</span></div>`;
	return n += "</div>", n;
}
function gc({ article: e, settings: n }) {
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
					className: K.fmTag,
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
					className: K.fmSyndLink,
					href: n,
					target: "_blank",
					rel: "noopener noreferrer",
					children: e
				}), r < i.length - 1 ? " · " : ""] }, e)) }));
				break;
			default: break;
		}
		return r ? (i = !0, /* @__PURE__ */ p("div", {
			className: K.fmRow,
			children: [/* @__PURE__ */ f("span", {
				className: K.fmLabel,
				children: n.replace(/_/g, " ")
			}), /* @__PURE__ */ f("span", {
				className: K.fmValue,
				children: r
			})]
		}, n)) : null;
	});
	return /* @__PURE__ */ f("div", {
		className: `${K.frontmatterPanel} ${K.open}`,
		children: i ? a : /* @__PURE__ */ f("div", {
			className: K.fmRow,
			children: /* @__PURE__ */ f("span", {
				className: K.fmValue,
				style: { color: "#666" },
				children: "No metadata available."
			})
		})
	});
}
var J = {
	ttsGroup: "_ttsGroup_nifhq_7",
	tb: "_tb_nifhq_19",
	tbTooltip: "_tbTooltip_nifhq_46",
	select: "_select_nifhq_68",
	params: "_params_nifhq_85",
	loadingBarContainer: "_loadingBarContainer_nifhq_133",
	loadingBarFill: "_loadingBarFill_nifhq_145",
	visualizer: "_visualizer_nifhq_151",
	bar: "_bar_nifhq_161",
	bounce: "_bounce_nifhq_1",
	errorToast: "_errorToast_nifhq_183",
	show: "_show_nifhq_198",
	statusBadge: "_statusBadge_nifhq_202",
	pulse: "_pulse_nifhq_1",
	error: "_error_nifhq_183",
	ttsSettings: "_ttsSettings_nifhq_226",
	settingRow: "_settingRow_nifhq_235",
	paramValue: "_paramValue_nifhq_264"
};
//#endregion
//#region src/components/TTS/TTS.jsx
function _c() {
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
function vc({ targetRef: e }) {
	let { T: t, state: n, engineProgress: r, errorMsg: i, statusMessage: a, isError: o, setStatusMessage: s, setIsError: c } = _c();
	return t ? /* @__PURE__ */ p("div", {
		className: J.ttsGroup,
		style: { position: "relative" },
		children: [
			n !== "playing" && /* @__PURE__ */ f("button", {
				className: J.tb,
				onClick: () => {
					!t || !e.current || (s(null), c(!1), t.play(e.current, { scrollContainer: e.current }));
				},
				title: "Play",
				dangerouslySetInnerHTML: { __html: `${Ms.play}<span class="${J.tbTooltip}">Play</span>` }
			}),
			n === "playing" && /* @__PURE__ */ f("button", {
				className: J.tb,
				onClick: () => {
					t && t.pause();
				},
				title: "Pause",
				dangerouslySetInnerHTML: { __html: `${Ms.pause}<span class="${J.tbTooltip}">Pause</span>` }
			}),
			(n === "playing" || n === "paused" || n === "loading") && /* @__PURE__ */ f("button", {
				className: J.tb,
				onClick: () => {
					t && t.stop();
				},
				title: "Stop",
				dangerouslySetInnerHTML: { __html: `${Ms.stop}<span class="${J.tbTooltip}">Stop</span>` }
			}),
			n === "loading" && r > 0 && /* @__PURE__ */ f("div", {
				className: J.loadingBarContainer,
				children: /* @__PURE__ */ f("div", {
					className: J.loadingBarFill,
					style: { width: `${r}%` }
				})
			}),
			n === "playing" && /* @__PURE__ */ p("div", {
				className: J.visualizer,
				children: [
					/* @__PURE__ */ f("div", { className: J.bar }),
					/* @__PURE__ */ f("div", { className: J.bar }),
					/* @__PURE__ */ f("div", { className: J.bar }),
					/* @__PURE__ */ f("div", { className: J.bar })
				]
			}),
			/* @__PURE__ */ f("div", {
				className: `${J.errorToast} ${i ? J.show : ""}`,
				children: i
			}),
			a && /* @__PURE__ */ f("span", {
				className: `${J.statusBadge} ${o ? J.error : ""}`,
				children: a
			})
		]
	}) : null;
}
function yc() {
	let { T: e, engines: t, selectedEngine: n, voices: r, selectedVoice: i, capabilities: a, params: o, handleEngineChange: s, handleVoiceChange: c, handleParamChange: l } = _c();
	return e ? /* @__PURE__ */ p("div", {
		className: J.ttsSettings,
		"data-tts-settings": !0,
		children: [
			t.length > 1 && /* @__PURE__ */ f("select", {
				className: J.select,
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
				className: J.settingRow,
				children: [/* @__PURE__ */ f("span", { children: "Voice" }), /* @__PURE__ */ f("select", {
					className: J.select,
					value: i,
					onChange: c,
					"data-tts-voice": !0,
					children: r.length ? r.map((e) => /* @__PURE__ */ f("option", {
						value: e.id,
						children: e.label
					}, e.id)) : /* @__PURE__ */ f("option", { children: "Loading..." })
				})]
			}),
			/* @__PURE__ */ f("div", {
				className: J.params,
				children: Object.entries(a).map(([e, t]) => !t || e === "voice" || e === "pitch" || e === "volume" ? null : t.type === "range" ? /* @__PURE__ */ p("label", {
					className: J.settingRow,
					title: `${t.label}: ${o[e]}`,
					children: [/* @__PURE__ */ p("span", { children: [
						t.label,
						" ",
						/* @__PURE__ */ p("span", {
							className: J.paramValue,
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
					className: J.settingRow,
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
	}) : null;
}
var Y = {
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
};
//#endregion
//#region src/components/Icon/Icon.jsx
function bc({ body: e, size: t = 16, className: n }) {
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
var xc = /* @__PURE__ */ m(((e, t) => {
	var n = (e) => `<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">${e}</g>`, r = {
		"undo-2": n("<path d=\"M9 14 4 9l5-5\"/><path d=\"M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11\"/>"),
		"redo-2": n("<path d=\"m15 14 5-5-5-5\"/><path d=\"M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13\"/>"),
		"rotate-ccw": n("<path d=\"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\"/><path d=\"M3 3v5h5\"/>"),
		hourglass: n("<path d=\"M5 22h14\"/><path d=\"M5 2h14\"/><path d=\"M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22\"/><path d=\"M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2\"/>"),
		settings: n("<path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/>"),
		check: n("<path d=\"M20 6 9 17l-5-5\"/>")
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
})), Sc = (/* @__PURE__ */ m(((e, t) => {
	var { siteIcon: n } = xc(), r = (e) => typeof e == "string" ? e.trim() : "";
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
			addFeed: t.addFeed !== !1
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
function Cc({ config: e }) {
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
		className: Y.subscribe,
		"data-top-subscribe-wrap": !0,
		children: [/* @__PURE__ */ f("button", {
			ref: g,
			type: "button",
			className: `${Y.pill} ${Y.pagePill} ${e.icon ? Y.iconOnly : ""} ${t ? Y.pillOn : ""}`,
			"aria-label": e.label,
			title: e.label,
			"aria-haspopup": "dialog",
			"aria-expanded": t,
			"data-top-subscribe": !0,
			"data-has-icon": e.icon ? "" : void 0,
			onClick: () => {
				m(null), n((e) => !e);
			},
			children: e.icon ? /* @__PURE__ */ f(bc, {
				body: e.icon,
				size: 15,
				className: Y.pillIcon
			}) : /* @__PURE__ */ f("span", {
				className: Y.title,
				children: e.label
			})
		}), t && /* @__PURE__ */ p("div", {
			ref: _,
			className: Y.subscribeSheet,
			role: "dialog",
			"aria-label": e.label,
			"data-top-subscribe-sheet": !0,
			children: [/* @__PURE__ */ p("form", {
				className: Y.subscribeForm,
				onSubmit: async (t) => {
					if (e.newTab || (t.preventDefault(), l)) return;
					u(!0), m(null);
					let n = await (0, Sc.subscribe)(e, a);
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
					className: Y.subscribeInput,
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
					className: Y.subscribeSubmit,
					disabled: l,
					"data-top-subscribe-submit": !0,
					children: e.label
				})]
			}), /* @__PURE__ */ f("p", {
				className: `${Y.subscribeMessage} ${d ? d.ok ? Y.subscribeOk : Y.subscribeError : ""}`,
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
function wc({ sources: e, hiddenSources: t, onToggleSource: n, viewState: a, showCount: o = !0, pages: c = [], onOpenPage: l, links: u = [], subscribe: d = null, showAddButton: m = !0, intro: h = "", controls: g = null }) {
	let _ = s(null), v = Array.isArray(c) && c.length > 0, y = Array.isArray(u) && u.length > 0, b = !!g;
	if (i(() => {
		b && _.current && Dc(_.current);
	}), r(() => {
		if (!b) return;
		let e = () => {
			_.current && Dc(_.current);
		};
		return window.addEventListener("resize", e), typeof document < "u" && document.fonts && document.fonts.ready && document.fonts.ready.then(e), () => window.removeEventListener("resize", e);
	}, [b]), (!e || e.length === 0) && !v && !y && !d && !h && !g) return null;
	let x = t || /* @__PURE__ */ new Set();
	return /* @__PURE__ */ p("div", {
		ref: _,
		className: Y.bar,
		"data-feeds": !0,
		children: [
			(e || []).map((e) => /* @__PURE__ */ f(Oc, {
				source: e,
				hidden: x.has(e.id),
				onToggle: () => n && n(e.id),
				viewState: a,
				showCount: o
			}, e.id)),
			v && c.map((e) => /* @__PURE__ */ p("button", {
				type: "button",
				className: `${Y.pill} ${Y.pagePill} ${e.icon && !e.showLabel ? Y.iconOnly : ""}`,
				"data-top-pages": !0,
				"data-top-page": e.id,
				"data-has-icon": e.icon ? "" : void 0,
				"aria-label": e.icon ? e.label : void 0,
				title: e.item && e.item.title ? e.item.title : e.label,
				onClick: () => l && l(e.item),
				children: [e.icon && /* @__PURE__ */ f(bc, {
					body: e.icon,
					size: 15,
					className: Y.pillIcon
				}), e.showLabel !== !1 && /* @__PURE__ */ f("span", {
					className: `${Y.title} ${Y.pageLabel}`,
					children: e.label
				})]
			}, e.id)),
			y && u.map((e) => /* @__PURE__ */ p("a", {
				href: e.href,
				className: `${Y.pill} ${Y.pagePill} ${Y.linkPill} ${e.icon && !e.showLabel ? Y.iconOnly : ""}`,
				"data-top-link": e.id,
				"data-has-icon": e.icon ? "" : void 0,
				"aria-label": e.label,
				title: e.label,
				...e.newTab ? {
					target: "_blank",
					rel: "noopener"
				} : {},
				children: [e.icon && /* @__PURE__ */ f(bc, {
					body: e.icon,
					size: 15,
					className: Y.pillIcon
				}), e.showLabel && /* @__PURE__ */ f("span", {
					className: `${Y.title} ${Y.pageLabel}`,
					children: e.label
				})]
			}, e.id)),
			d && /* @__PURE__ */ f(Cc, { config: d }),
			m !== !1 && /* @__PURE__ */ f(Mc, {}),
			g,
			h && /* @__PURE__ */ f("div", {
				className: Y.intro,
				"data-graph-intro": !0,
				dangerouslySetInnerHTML: { __html: h }
			})
		]
	});
}
function Tc(e) {
	return [...e.children].filter((e) => {
		if (e.matches("[data-graph-intro]")) return !1;
		let t = getComputedStyle(e).position;
		return t !== "fixed" && t !== "absolute" && e.getBoundingClientRect().width > 0;
	});
}
function Ec(e) {
	let t = Tc(e);
	if (t.length < 2) return !1;
	let n = t[0].getBoundingClientRect().top;
	return t.some((e) => Math.abs(e.getBoundingClientRect().top - n) > 2);
}
function Dc(e) {
	let t = ["data-fit-dots", "data-fit-icons"], n = e.querySelector("[data-source-pill]");
	for (let n of [...t, "data-fit-title"]) e.removeAttribute(n);
	n && (n.style.maxWidth = "");
	for (let n of t) {
		if (!Ec(e)) return;
		e.setAttribute(n, "");
	}
	if (!Ec(e) || !n) return;
	e.setAttribute("data-fit-title", "");
	let r = Tc(e), i = parseFloat(getComputedStyle(e).columnGap) || 0, a = r.reduce((e, t) => e + t.getBoundingClientRect().width, 0) + i * (r.length - 1) - e.clientWidth, o = n.getBoundingClientRect().width;
	n.style.maxWidth = `${Math.max(34, Math.floor(o - a - 1))}px`;
}
function Oc({ source: e, hidden: t, onToggle: n, viewState: r, showCount: i }) {
	let a = e.title || e.id, o = e.ok !== !1, s = r && r.sourceColor(e.id) || e.color;
	return /* @__PURE__ */ p("div", {
		className: `${Y.pill} ${t ? Y.hidden : ""} ${o ? "" : Y.failed}`,
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
			/* @__PURE__ */ f(jc, {
				color: s,
				sourceId: e.id,
				viewState: r
			}),
			/* @__PURE__ */ f("span", {
				className: Y.title,
				children: a
			}),
			i && /* @__PURE__ */ f("span", {
				className: Y.count,
				children: e.itemCount
			})
		]
	});
}
var kc = [
	"#e74c3c",
	"#e67e22",
	"#f1c40f",
	"#2ecc71",
	"#1abc9c",
	"#3498db",
	"#9b59b6",
	"#e84393"
], Ac = 650;
function jc({ color: e, sourceId: t, viewState: n }) {
	let [i, a] = c(!1), o = s(null);
	r(() => () => {
		o.current && clearTimeout(o.current);
	}, []);
	let l = (e) => {
		e.stopPropagation(), a(!0);
	}, u = (e) => {
		e && e.stopPropagation(), a(!1);
	}, m = () => {
		o.current = setTimeout(() => a(!0), Ac);
	}, h = () => {
		o.current &&= (clearTimeout(o.current), null);
	}, g = (e, r) => {
		r.stopPropagation(), n && n.setSourceColor(t, e), a(!1);
	}, _ = kc.length;
	return /* @__PURE__ */ p("span", {
		className: Y.dotWrap,
		onMouseEnter: m,
		onMouseLeave: h,
		onClick: l,
		onTouchEnd: l,
		children: [/* @__PURE__ */ f("span", {
			className: `${Y.dot} ${i ? Y.dotActive : ""}`,
			"aria-hidden": "true"
		}), i && /* @__PURE__ */ p(d, { children: [/* @__PURE__ */ f("span", {
			className: Y.ringBackdrop,
			onClick: u,
			onTouchEnd: u
		}), /* @__PURE__ */ f("span", {
			className: Y.ring,
			children: kc.map((t, n) => {
				let r = (_ === 1 ? 15 : 15 + n / (_ - 1) * 150) * Math.PI / 180, i = 30 * Math.cos(r), a = 30 * Math.sin(r);
				return /* @__PURE__ */ f("button", {
					type: "button",
					className: `${Y.swatch} ${t.toLowerCase() === String(e).toLowerCase() ? Y.swatchCurrent : ""}`,
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
function Mc() {
	let [e, t] = c(!1), [n, i] = c(""), [a, o] = c(null), l = s(null);
	r(() => {
		e && l.current && l.current.focus();
	}, [e]);
	let u = Pc(n), m = (e) => {
		e && e.preventDefault(), u && (o(n.trim()), i(""), t(!1));
	}, h = () => {
		i(""), t(!1);
	};
	return /* @__PURE__ */ p(d, { children: [e ? /* @__PURE__ */ p("form", {
		className: `${Y.pill} ${Y.addOpen}`,
		onSubmit: m,
		children: [
			/* @__PURE__ */ f("input", {
				ref: l,
				type: "url",
				placeholder: "paste a feed URL…",
				className: Y.addInput,
				value: n,
				onChange: (e) => i(e.target.value),
				onKeyDown: (e) => {
					e.key === "Escape" && h();
				}
			}),
			/* @__PURE__ */ f("button", {
				type: "button",
				className: Y.addClose,
				onClick: h,
				title: "Cancel",
				"aria-label": "Cancel",
				children: "×"
			}),
			/* @__PURE__ */ f("button", {
				type: "submit",
				className: `${Y.addSubmit} ${u ? Y.ready : ""}`,
				disabled: !u,
				title: u ? "Continue" : "Enter a URL first",
				"aria-label": "Add feed",
				children: "+"
			})
		]
	}) : /* @__PURE__ */ f("button", {
		className: `${Y.pill} ${Y.addPill}`,
		onClick: () => t(!0),
		title: "Add a feed",
		children: /* @__PURE__ */ f("span", {
			className: Y.plus,
			children: "+"
		})
	}), a && /* @__PURE__ */ f(Nc, {
		url: a,
		onDismiss: () => o(null)
	})] });
}
function Nc({ url: e, onDismiss: t }) {
	let [n, r] = c(""), i = Ic(e), a = `node add-feed.js ${Fc(e)}`, o = async (e, t) => {
		try {
			await navigator.clipboard.writeText(e), r(t), setTimeout(() => r((e) => e === t ? "" : e), 1500);
		} catch {}
	};
	return /* @__PURE__ */ p("div", {
		className: Y.resultPanel,
		children: [
			/* @__PURE__ */ f("button", {
				className: Y.resultClose,
				onClick: t,
				title: "Dismiss",
				"aria-label": "Dismiss",
				children: "×"
			}),
			/* @__PURE__ */ f("div", {
				className: Y.resultTitle,
				children: "Add this feed"
			}),
			/* @__PURE__ */ f("div", {
				className: Y.resultUrl,
				title: e,
				children: e
			}),
			/* @__PURE__ */ p("div", {
				className: Y.resultSection,
				children: [
					/* @__PURE__ */ f("div", {
						className: Y.resultLabel,
						children: "One-step (recommended)"
					}),
					/* @__PURE__ */ p("div", {
						className: Y.resultBox,
						children: [/* @__PURE__ */ f("code", {
							className: Y.code,
							children: a
						}), /* @__PURE__ */ f("button", {
							className: `${Y.copyBtn} ${n === "cli" ? Y.copied : ""}`,
							onClick: () => o(a, "cli"),
							children: n === "cli" ? "Copied" : "Copy"
						})]
					}),
					/* @__PURE__ */ f("div", {
						className: Y.resultHint,
						children: "Paste in your terminal — it appends to feeds.opml and rebuilds. Then refresh this page."
					})
				]
			}),
			/* @__PURE__ */ p("div", {
				className: Y.resultSection,
				children: [
					/* @__PURE__ */ f("div", {
						className: Y.resultLabel,
						children: "Or add manually"
					}),
					/* @__PURE__ */ p("div", {
						className: Y.resultBox,
						children: [/* @__PURE__ */ f("code", {
							className: Y.code,
							children: i
						}), /* @__PURE__ */ f("button", {
							className: `${Y.copyBtn} ${n === "opml" ? Y.copied : ""}`,
							onClick: () => o(i, "opml"),
							children: n === "opml" ? "Copied" : "Copy"
						})]
					}),
					/* @__PURE__ */ p("div", {
						className: Y.resultHint,
						children: [
							"Paste before ",
							/* @__PURE__ */ f("code", {
								className: Y.codeInline,
								children: "</body>"
							}),
							" ",
							"in feeds.opml, then run ",
							/* @__PURE__ */ f("code", {
								className: Y.codeInline,
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
function Pc(e) {
	let t = (e || "").trim();
	if (!t) return !1;
	try {
		let e = new URL(t);
		return e.protocol === "http:" || e.protocol === "https:";
	} catch {
		return !1;
	}
}
function Fc(e) {
	return `'${String(e).replace(/'/g, "'\\''")}'`;
}
function Ic(e) {
	let t = e.replace(/"/g, "&quot;");
	return `<outline text="${Lc(e)}" title="${Lc(e)}" xmlUrl="${t}"/>`;
}
function Lc(e) {
	try {
		return new URL(e).hostname.replace(/^www\./, "");
	} catch {
		return e;
	}
}
var X = {
	gearBtn: "_gearBtn_1no4h_17",
	backdrop: "_backdrop_1no4h_51",
	drawer: "_drawer_1no4h_58",
	ppSlideIn: "_ppSlideIn_1no4h_1",
	header: "_header_1no4h_86",
	title: "_title_1no4h_100",
	subject: "_subject_1no4h_105",
	closeBtn: "_closeBtn_1no4h_115",
	section: "_section_1no4h_129",
	sectionTitle: "_sectionTitle_1no4h_138",
	rowLabel: "_rowLabel_1no4h_147",
	choiceRow: "_choiceRow_1no4h_153",
	choices: "_choices_1no4h_161",
	choiceBtn: "_choiceBtn_1no4h_167",
	fontBtn: "_fontBtn_1no4h_168",
	resetBtn: "_resetBtn_1no4h_169",
	markActions: "_markActions_1no4h_170",
	presetBtn: "_presetBtn_1no4h_171",
	fontRow: "_fontRow_1no4h_184",
	aidOn: "_aidOn_1no4h_194",
	hint: "_hint_1no4h_199",
	hintLink: "_hintLink_1no4h_205",
	legend: "_legend_1no4h_209",
	aidList: "_aidList_1no4h_217",
	aidBtn: "_aidBtn_1no4h_223",
	aidLabel: "_aidLabel_1no4h_239",
	aidState: "_aidState_1no4h_247",
	aidHint: "_aidHint_1no4h_257",
	subjectBlock: "_subjectBlock_1no4h_264",
	subjectTitle: "_subjectTitle_1no4h_273",
	markItem: "_markItem_1no4h_278",
	markMain: "_markMain_1no4h_286",
	markTitle: "_markTitle_1no4h_291",
	markNote: "_markNote_1no4h_296",
	noteInput: "_noteInput_1no4h_308",
	noMarks: "_noMarks_1no4h_333",
	presetRow: "_presetRow_1no4h_339",
	presetActive: "_presetActive_1no4h_352",
	presetSwatches: "_presetSwatches_1no4h_357",
	miniSwatch: "_miniSwatch_1no4h_362",
	presetLabel: "_presetLabel_1no4h_369",
	fieldList: "_fieldList_1no4h_374",
	fieldRow: "_fieldRow_1no4h_380",
	fieldLabel: "_fieldLabel_1no4h_387",
	colorInput: "_colorInput_1no4h_392",
	hexLabel: "_hexLabel_1no4h_402",
	forgetBlock: "_forgetBlock_1no4h_416",
	forgetConfirm: "_forgetConfirm_1no4h_417"
}, Rc = /* @__PURE__ */ m(((e, t) => {
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
	t.exports = {
		bookmarkLabel: n,
		placedParagraph: r
	};
})), zc = /* @__PURE__ */ m(((e, t) => {
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
})), Bc = Rc(), Vc = zc(), Hc = xc(), Uc = {
	draft: "#555555",
	published: "#2ecc71",
	tag: "#f39c12",
	topology: "#9b59b6",
	placeholder: "#7f8c8d"
};
function Wc() {
	let e = typeof window < "u" && window.SETTINGS && window.SETTINGS.theme || {};
	return {
		...Uc,
		...e.node_draft ? { draft: e.node_draft } : {},
		...e.node_published ? { published: e.node_published } : {},
		...e.tag_color ? { tag: e.tag_color } : {}
	};
}
function Gc(e) {
	if (!e || !Array.isArray(e.items)) return null;
	let t = e.containers || [], n = (e) => t.some((t) => t.parent && t.tag && (e.tags || []).includes(t.tag)), r = /* @__PURE__ */ new Set(), i = new Set(e.items.map((e) => e.id));
	for (let t of e.items) n(t) || r.add(t._status === "published" ? "published" : "draft");
	for (let t of e.edges || []) t.layer === "tag" ? r.add("tag") : t.layer === "topology" ? r.add("topology") : t.layer === "authored" && !i.has(t.target) && r.add("placeholder");
	return r;
}
var Kc = Wc(), qc = [
	{
		id: "default",
		label: "Default",
		colors: Kc
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
], Jc = [
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
], Yc = [
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
function Xc({ on: e, onChange: t, label: n, hint: r, ...i }) {
	return /* @__PURE__ */ p("button", {
		className: `${X.aidBtn} ${e ? X.aidOn : ""}`,
		role: "switch",
		"aria-checked": e,
		onClick: () => t(!e),
		...i,
		children: [/* @__PURE__ */ p("span", {
			className: X.aidLabel,
			children: [n, /* @__PURE__ */ f("span", {
				className: X.aidState,
				children: e ? "on" : "off"
			})]
		}), r && /* @__PURE__ */ f("span", {
			className: X.aidHint,
			children: r
		})]
	});
}
function Zc({ viewState: e, aid: t, label: n, hint: r }) {
	return /* @__PURE__ */ f(Xc, {
		on: !!(e.readerAid && e.readerAid(t)),
		label: n,
		hint: r,
		"data-aid": t,
		onChange: (n) => e.setReaderAid && e.setReaderAid(t, n)
	});
}
function Qc({ label: e, options: t, value: n, onChange: r, name: i }) {
	return /* @__PURE__ */ p("div", {
		className: X.choiceRow,
		role: "radiogroup",
		"aria-label": e,
		"data-choice": i,
		children: [/* @__PURE__ */ f("span", {
			className: X.rowLabel,
			children: e
		}), /* @__PURE__ */ f("span", {
			className: X.choices,
			children: t.map((e) => /* @__PURE__ */ f("button", {
				role: "radio",
				"aria-checked": n === e.id,
				title: e.title || e.label,
				"data-value": e.id,
				className: `${X.choiceBtn} ${n === e.id ? X.aidOn : ""}`,
				style: e.style,
				onClick: () => r(e.id),
				children: e.label
			}, e.id))
		})]
	});
}
function $c({ id: e, title: t, children: n }) {
	return /* @__PURE__ */ p("section", {
		className: X.section,
		"data-section": e,
		"aria-labelledby": `pp-settings-${e}`,
		children: [/* @__PURE__ */ f("h2", {
			className: X.sectionTitle,
			id: `pp-settings-${e}`,
			children: t
		}), n]
	});
}
var el = (e, t) => {
	let n = e && Array.isArray(e.items) ? e.items.find((e) => e.id === t) : null;
	return n && n.title || "";
};
function tl(e, t) {
	return "#read=" + encodeURIComponent(e) + (t == null ? "" : "&p=" + t);
}
function nl({ b: e, feedData: t, viewState: n }) {
	let [r, i] = c(!1), a = (0, Bc.placedParagraph)(e, t && Array.isArray(t.items) ? t.items.find((t) => t.id === e.item) : null);
	return /* @__PURE__ */ p("div", {
		className: X.markItem,
		"data-bookmark-row": !0,
		children: [/* @__PURE__ */ p("div", {
			className: X.markMain,
			children: [/* @__PURE__ */ f("div", {
				className: X.markTitle,
				children: (0, Bc.bookmarkLabel)(e, el(t, e.item))
			}), r ? /* @__PURE__ */ f("input", {
				type: "text",
				value: e.note || "",
				onChange: (t) => n.setBookmarkNote(e.id, t.target.value),
				onBlur: () => i(!1),
				onKeyDown: (e) => {
					e.key === "Enter" && i(!1);
				},
				className: X.noteInput,
				"aria-label": "Note",
				autoFocus: !0
			}) : /* @__PURE__ */ f("button", {
				className: X.markNote,
				onClick: () => i(!0),
				children: e.note || /* @__PURE__ */ f("em", { children: "Add a note" })
			})]
		}), /* @__PURE__ */ p("div", {
			className: X.markActions,
			children: [
				/* @__PURE__ */ f("button", {
					onClick: () => {
						window.location.hash = tl(e.item, a);
					},
					title: "Go back to this place",
					children: "Jump"
				}),
				/* @__PURE__ */ f("button", {
					onClick: async () => {
						try {
							await navigator.clipboard.writeText(window.location.href.split("#")[0] + tl(e.item, a));
						} catch {}
					},
					title: "Copy a link to this place",
					children: "Copy link"
				}),
				/* @__PURE__ */ f("button", {
					onClick: () => n.removeBookmark(e.id),
					title: "Delete this bookmark",
					"aria-label": "Delete bookmark",
					children: "Delete"
				})
			]
		})]
	});
}
function rl({ viewState: e, feedData: t, subject: n, readerOpen: i }) {
	let [a, o] = c(!1), [l, u] = c(!1), [, m] = c(0), h = s(null), g = s(null);
	if (r(() => {
		if (e) return e.subscribe(() => m((e) => e + 1));
	}, [e]), r(() => {
		if (typeof document > "u" || !e) return;
		let t = e.paragraphIndent ? e.paragraphIndent() : !1, n = e.paragraphSpace ? e.paragraphSpace() : !0, r = document.documentElement;
		r.setAttribute("data-pp-indent", t ? "on" : "off"), r.setAttribute("data-pp-space", n ? "on" : "off"), r.removeAttribute("data-pp-paragraph"), r.setAttribute("data-pp-font", e.readerAid ? e.readerAid("font") : "default"), r.setAttribute("data-pp-size", e.readerAid ? e.readerAid("size") : "m");
	}), r(() => {
		let e = (e) => {
			let t = e && e.detail || {};
			g.current = t.section || null, o((e) => t.open ? !0 : !e);
		};
		return window.addEventListener("postpipe:toggle-settings", e), () => window.removeEventListener("postpipe:toggle-settings", e);
	}, []), r(() => {
		if (!a) return;
		let e = (e) => {
			e.key === "Escape" && (e.stopImmediatePropagation(), o(!1));
		};
		if (window.addEventListener("keydown", e, !0), u(!1), g.current && h.current) {
			let e = h.current.querySelector(`[data-section="${g.current}"]`);
			e && (h.current.scrollTop = e.offsetTop - 8), g.current = null;
		}
		return () => window.removeEventListener("keydown", e, !0);
	}, [a]), !e) return null;
	let _ = (0, Ls.readerFonts)(typeof window < "u" ? window.SETTINGS : null), v = e.readerAid ? e.readerAid("font") : "default", y = e.readerAid ? e.readerAid("size") : "m", b = {
		...Kc,
		...e.graphColors()
	}, x = e.colorProfileId(), S = Gc(t), C = S ? Jc.filter((e) => S.has(e.key)) : Jc, w = !!(t && Array.isArray(t.containers) && t.containers.length), T = typeof window < "u" && !!window.TTS, E = t && t.items || [], D = E.length === 0 || E.some((e) => !(0, bs.isLinkItem)(e)), O = n ? n.id : null, k = e.bookmarks(), A = O ? e.bookmarks(O) : [], ee = k.filter((e) => e.item !== O), j = n && n._posted !== "title", M = !!(n && i && i === O);
	return /* @__PURE__ */ p(d, { children: [/* @__PURE__ */ f("button", {
		className: X.gearBtn,
		onClick: () => o((e) => !e),
		title: "Settings",
		"aria-label": "Settings",
		"aria-expanded": a,
		"data-settings-gear": !0,
		children: /* @__PURE__ */ f(bc, {
			body: (0, Hc.iconBody)("settings"),
			size: 18
		})
	}), a && /* @__PURE__ */ p(d, { children: [/* @__PURE__ */ f("div", {
		className: X.backdrop,
		onClick: () => o(!1)
	}), /* @__PURE__ */ p("aside", {
		className: X.drawer,
		role: "dialog",
		"aria-label": "Settings",
		ref: h,
		"data-settings-panel": !0,
		children: [
			/* @__PURE__ */ p("div", {
				className: X.header,
				children: [
					/* @__PURE__ */ f("span", {
						className: X.title,
						children: "Settings"
					}),
					n && /* @__PURE__ */ f("span", {
						className: X.subject,
						"data-settings-subject": !0,
						children: n.title
					}),
					/* @__PURE__ */ f("button", {
						className: X.closeBtn,
						onClick: () => o(!1),
						"aria-label": "Close",
						children: "×"
					})
				]
			}),
			D && /* @__PURE__ */ p($c, {
				id: "reading",
				title: "Reading",
				children: [
					/* @__PURE__ */ f("div", {
						className: X.fontRow,
						role: "radiogroup",
						"aria-label": "Font",
						children: _.map((t) => /* @__PURE__ */ f("button", {
							role: "radio",
							"aria-checked": v === t.id,
							"data-font": t.id,
							className: `${X.fontBtn} ${v === t.id ? X.aidOn : ""}`,
							style: { fontFamily: t.family },
							onClick: () => e.setReaderAid && e.setReaderAid("font", t.id),
							children: t.label
						}, t.id))
					}),
					_.filter((e) => e.license).map((e) => /* @__PURE__ */ p("div", {
						className: X.hint,
						children: [
							e.label,
							" is under the ",
							/* @__PURE__ */ f("a", {
								className: X.hintLink,
								href: `./fonts/${e.license}`,
								target: "_blank",
								rel: "noopener",
								children: e.licenseName
							}),
							"."
						]
					}, e.id)),
					/* @__PURE__ */ f(Qc, {
						label: "Size",
						name: "size",
						options: Yc,
						value: y,
						onChange: (t) => e.setReaderAid("size", t)
					}),
					/* @__PURE__ */ p("div", {
						className: X.choiceRow,
						children: [/* @__PURE__ */ f("span", {
							className: X.rowLabel,
							children: "Paragraphs"
						}), /* @__PURE__ */ p("span", {
							className: X.choices,
							children: [/* @__PURE__ */ f("button", {
								className: `${X.choiceBtn} ${e.paragraphIndent() ? X.aidOn : ""}`,
								"aria-pressed": e.paragraphIndent(),
								onClick: () => e.setParagraphIndent(!e.paragraphIndent()),
								children: "Indent first line"
							}), /* @__PURE__ */ f("button", {
								className: `${X.choiceBtn} ${e.paragraphSpace() ? X.aidOn : ""}`,
								"aria-pressed": e.paragraphSpace(),
								onClick: () => e.setParagraphSpace(!e.paragraphSpace()),
								children: "Space between"
							})]
						})]
					}),
					/* @__PURE__ */ p("div", {
						className: X.aidList,
						children: [/* @__PURE__ */ f(Zc, {
							viewState: e,
							aid: "followAlong",
							label: "Highlighter: follow along",
							hint: "Tap or drag through the text to mark the sentence and word you are on."
						}), /* @__PURE__ */ f(Zc, {
							viewState: e,
							aid: "boldStart",
							label: "Bold word beginnings",
							hint: "The first part of each word is bold, to lead the eye. The text itself is unchanged."
						})]
					})
				]
			}),
			D && T && /* @__PURE__ */ p($c, {
				id: "listening",
				title: "Listening",
				children: [/* @__PURE__ */ f(yc, {}), /* @__PURE__ */ f("div", {
					className: X.hint,
					children: "Play and pause are in the reader."
				})]
			}),
			D && /* @__PURE__ */ p($c, {
				id: "place",
				title: "Your place",
				children: [
					/* @__PURE__ */ p("div", {
						className: X.legend,
						"data-bookmark-legend": !0,
						children: [
							/* @__PURE__ */ f("strong", { children: "Mark here" }),
							", in the reader, saves the paragraph at the top of the reader; a ribbon in the margin shows it, and tapping it again removes it. Each saved place below has ",
							/* @__PURE__ */ f("em", { children: "Jump" }),
							" (go back to it), ",
							/* @__PURE__ */ f("em", { children: "Copy link" }),
							" and ",
							/* @__PURE__ */ f("em", { children: "Delete" }),
							". Tap a note to write one."
						]
					}),
					n ? /* @__PURE__ */ p("div", {
						className: X.subjectBlock,
						"data-place-subject": !0,
						children: [
							/* @__PURE__ */ f("div", {
								className: X.subjectTitle,
								children: n.title
							}),
							j && e.readingProgress && (() => {
								let t = e.readingProgress(n.id), r = t.done ? "Read to the end" : t.max > 0 ? `Read ${Math.round(t.max * 100)}%` : t.seen ? "Opened" : "Not opened yet";
								return /* @__PURE__ */ f("div", {
									className: X.hint,
									"data-place-progress": !0,
									children: r
								});
							})(),
							/* @__PURE__ */ p("div", {
								className: X.choices,
								children: [j && !M && /* @__PURE__ */ f("button", {
									className: X.choiceBtn,
									onClick: () => {
										o(!1), window.location.hash = tl(n.id, null);
									},
									children: "Read"
								}), M && /* @__PURE__ */ f("button", {
									className: `${X.choiceBtn} ${A.length ? X.aidOn : ""}`,
									"aria-pressed": A.length > 0,
									"data-place-mark": !0,
									onClick: () => window.dispatchEvent(new CustomEvent("postpipe:reader-mark")),
									children: A.length ? "Marked" : "Mark here"
								})]
							}),
							A.map((n) => /* @__PURE__ */ f(nl, {
								b: n,
								feedData: t,
								viewState: e
							}, n.id)),
							A.length === 0 && /* @__PURE__ */ f("div", {
								className: X.hint,
								children: "No bookmarks in this one yet."
							})
						]
					}) : /* @__PURE__ */ f("div", {
						className: X.hint,
						children: "Open a chapter, or tap one on the graph, to see your place in it."
					}),
					ee.length > 0 && /* @__PURE__ */ p(d, { children: [/* @__PURE__ */ f("div", {
						className: X.rowLabel,
						children: n ? "Elsewhere" : "All bookmarks"
					}), ee.map((n) => /* @__PURE__ */ f(nl, {
						b: n,
						feedData: t,
						viewState: e
					}, n.id))] }),
					k.length === 0 && !n && /* @__PURE__ */ f("div", {
						className: X.noMarks,
						children: "No bookmarks yet."
					})
				]
			}),
			/* @__PURE__ */ p($c, {
				id: "view",
				title: "View",
				children: [
					(() => {
						let t = typeof window < "u" ? window.SETTINGS : null, n = (0, Vc.themeName)(t, e.preference("theme")), r = Vc.THEMES[n].modes, i = e.preference("mode");
						return /* @__PURE__ */ p(d, { children: [/* @__PURE__ */ f(Qc, {
							label: "Theme",
							name: "theme",
							options: Object.values(Vc.THEMES).map((e) => ({
								id: e.id,
								label: e.label
							})),
							value: n,
							onChange: (n) => e.setPreference("theme", n === (0, Vc.themeName)(t, null) ? null : n)
						}), r.length > 1 && /* @__PURE__ */ f(Qc, {
							label: "Mode",
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
							value: i && r.includes(i) ? i : "auto",
							onChange: (t) => e.setPreference("mode", t === "auto" ? null : t)
						})] });
					})(),
					(0, vs.config)(typeof window < "u" ? window.SETTINGS : null) && /* @__PURE__ */ f(Xc, {
						on: e.preference("timeOfDay") !== !1,
						onChange: (t) => e.setPreference("timeOfDay", t ? null : !1),
						label: "Time of day background",
						hint: "The page behind the graph takes on the light of the chapter's time of day, tinted by its season.",
						"data-pref": "timeOfDay"
					}),
					w && /* @__PURE__ */ p("div", {
						className: X.choiceRow,
						children: [/* @__PURE__ */ f("span", {
							className: X.rowLabel,
							children: "Containers"
						}), /* @__PURE__ */ p("span", {
							className: X.choices,
							children: [/* @__PURE__ */ f("button", {
								className: X.choiceBtn,
								onClick: () => window.dispatchEvent(new CustomEvent("graph:open-all-containers")),
								children: "Open all"
							}), /* @__PURE__ */ f("button", {
								className: X.choiceBtn,
								onClick: () => window.dispatchEvent(new CustomEvent("graph:close-all-containers")),
								children: "Close all"
							})]
						})]
					}),
					C.length > 0 && /* @__PURE__ */ p(d, { children: [
						/* @__PURE__ */ f("div", {
							className: X.rowLabel,
							children: "Colors"
						}),
						/* @__PURE__ */ f("div", {
							className: X.presetRow,
							children: qc.map((t) => /* @__PURE__ */ p("button", {
								className: `${X.presetBtn} ${x === t.id ? X.presetActive : ""}`,
								onClick: () => e.applyColorProfile(t.id, t.colors),
								title: t.label,
								children: [/* @__PURE__ */ f("span", {
									className: X.presetSwatches,
									children: C.map((e) => /* @__PURE__ */ f("span", {
										className: X.miniSwatch,
										style: { background: t.colors[e.key] }
									}, e.key))
								}), /* @__PURE__ */ f("span", {
									className: X.presetLabel,
									children: t.label
								})]
							}, t.id))
						}),
						/* @__PURE__ */ f("div", {
							className: X.fieldList,
							children: C.map((t) => /* @__PURE__ */ p("label", {
								className: X.fieldRow,
								children: [
									/* @__PURE__ */ f("span", {
										className: X.fieldLabel,
										children: t.label
									}),
									/* @__PURE__ */ f("input", {
										type: "color",
										className: X.colorInput,
										value: b[t.key],
										onChange: (n) => e.setGraphColor(t.key, n.target.value)
									}),
									/* @__PURE__ */ f("span", {
										className: X.hexLabel,
										children: b[t.key]
									})
								]
							}, t.key))
						})
					] }),
					/* @__PURE__ */ f("button", {
						className: X.resetBtn,
						"data-settings-reset": !0,
						title: "Layout, zoom, rotation, open and closed containers, selection and colors, back to how the site starts",
						onClick: () => {
							o(!1), C.length && e.applyColorProfile("default", Kc), window.dispatchEvent(new CustomEvent("graph:reset-all"));
						},
						children: "Reset the view"
					}),
					/* @__PURE__ */ p("div", {
						className: X.forgetBlock,
						"data-forget": !0,
						children: [/* @__PURE__ */ f("div", {
							className: X.hint,
							"data-forget-note": !0,
							children: "What you open, arrange, choose, mark and read here is kept on this device only. Reset the view keeps your notes and progress; Forget removes all of it."
						}), l ? /* @__PURE__ */ p("div", {
							className: X.forgetConfirm,
							role: "group",
							"aria-label": "Confirm forgetting",
							"data-forget-confirm": !0,
							children: [/* @__PURE__ */ f("div", {
								className: X.hint,
								children: "Remove your bookmarks and notes, reading progress, open cards, positions, and every choice made here, from this device? This can't be undone."
							}), /* @__PURE__ */ p("span", {
								className: X.choices,
								children: [/* @__PURE__ */ f("button", {
									className: X.resetBtn,
									"data-forget-yes": !0,
									onClick: async () => {
										u(!1), o(!1), e.forget && await e.forget(), window.dispatchEvent(new CustomEvent("postpipe:forgotten"));
									},
									children: "Forget"
								}), /* @__PURE__ */ f("button", {
									className: X.choiceBtn,
									"data-forget-no": !0,
									onClick: () => u(!1),
									children: "Keep it"
								})]
							})]
						}) : /* @__PURE__ */ f("button", {
							className: X.resetBtn,
							"data-forget-ask": !0,
							onClick: () => u(!0),
							children: "Forget my usage on this site"
						})]
					})
				]
			})
		]
	})] })] });
}
var Z = {
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
}, il = {
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
}, al = [
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
], ol = [
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
], sl = [
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
function cl({ config: e, onUpdate: t, onReset: i, visible: a = !0 }) {
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
		...il,
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
		let t = dl(e);
		navigator.clipboard.writeText(t).then(() => {
			m("Copied to clipboard"), setTimeout(() => m(null), 1800);
		}).catch(() => {
			g(!0);
		});
	}, [e]), A = n(() => {
		_.current && _.current.click();
	}, []), ee = n((e) => {
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
			className: `${Z.triggerBtn} ${o ? Z.open : ""}`,
			onClick: () => l((e) => !e),
			title: "Configure viewer",
			"aria-label": "Configure viewer",
			children: "⚡"
		}),
		o && /* @__PURE__ */ p(d, { children: [/* @__PURE__ */ f("div", {
			className: Z.backdrop,
			onClick: () => l(!1)
		}), /* @__PURE__ */ p("div", {
			className: Z.panel,
			role: "dialog",
			"aria-label": "Viewer Configuration",
			ref: y,
			onTouchStart: b,
			onTouchMove: x,
			onTouchEnd: S,
			children: [
				/* @__PURE__ */ p("div", {
					className: Z.header,
					children: [/* @__PURE__ */ f("span", {
						className: Z.panelTitle,
						children: "Viewer Configuration"
					}), /* @__PURE__ */ f("button", {
						className: Z.closeBtn,
						onClick: () => l(!1),
						"aria-label": "Close",
						children: "×"
					})]
				}),
				/* @__PURE__ */ p("div", {
					className: Z.section,
					children: [/* @__PURE__ */ f("div", {
						className: Z.sectionTitle,
						children: "Features"
					}), al.map((e) => /* @__PURE__ */ f(ll, {
						label: e.label,
						sub: e.sub,
						checked: C[e.key],
						onChange: (t) => T(e.key, t)
					}, e.key))]
				}),
				/* @__PURE__ */ p("div", {
					className: Z.section,
					children: [
						/* @__PURE__ */ f("div", {
							className: Z.sectionTitle,
							children: "Data"
						}),
						/* @__PURE__ */ f("div", {
							className: Z.textInputRow,
							children: /* @__PURE__ */ f("input", {
								type: "url",
								className: Z.textInput,
								placeholder: "Feed URL (default: ./feed.json)",
								value: e.feed || "",
								onChange: (e) => O(e.target.value)
							})
						}),
						/* @__PURE__ */ p("div", {
							className: Z.selectRow,
							children: [/* @__PURE__ */ f("span", {
								className: Z.toggleLabel,
								children: "Persistence"
							}), /* @__PURE__ */ f("select", {
								className: Z.select,
								value: e.persistence || "localStorage",
								onChange: (e) => D(e.target.value),
								children: sl.map((e) => /* @__PURE__ */ f("option", {
									value: e.value,
									children: e.label
								}, e.value))
							})]
						})
					]
				}),
				/* @__PURE__ */ p("div", {
					className: Z.section,
					children: [/* @__PURE__ */ f("div", {
						className: Z.sectionTitle,
						children: "Theme"
					}), ol.map((e) => /* @__PURE__ */ p("div", {
						className: Z.colorRow,
						children: [
							/* @__PURE__ */ f("span", {
								className: Z.colorLabel,
								children: e.label
							}),
							/* @__PURE__ */ f("input", {
								type: "color",
								className: Z.colorInput,
								value: w[e.key] || ul(e.key),
								onChange: (t) => E(e.key, t.target.value)
							}),
							/* @__PURE__ */ f("span", {
								className: Z.colorHex,
								children: w[e.key] || ul(e.key)
							})
						]
					}, e.key))]
				}),
				/* @__PURE__ */ p("div", {
					className: Z.section,
					children: [
						/* @__PURE__ */ f("div", {
							className: Z.sectionTitle,
							children: "Actions"
						}),
						/* @__PURE__ */ p("div", {
							className: Z.actions,
							children: [
								/* @__PURE__ */ f("button", {
									className: Z.actionBtnAccent,
									onClick: k,
									children: "Export Config"
								}),
								/* @__PURE__ */ f("button", {
									className: Z.actionBtn,
									onClick: A,
									children: "Import Config"
								}),
								/* @__PURE__ */ f("button", {
									className: Z.actionBtnDanger,
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
							onChange: ee
						}),
						h && /* @__PURE__ */ f("div", {
							className: Z.snippet,
							children: /* @__PURE__ */ f("code", {
								className: Z.snippetCode,
								children: dl(e)
							})
						}),
						!h && /* @__PURE__ */ f("button", {
							className: Z.actionBtn,
							onClick: () => g(!0),
							style: {
								marginTop: "6px",
								width: "100%"
							},
							children: "Show Embed Snippet"
						}),
						h && /* @__PURE__ */ f("button", {
							className: Z.actionBtn,
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
			className: Z.toast,
			children: u
		})
	] }) : null;
}
function ll({ label: e, sub: t, checked: n, onChange: r }) {
	return /* @__PURE__ */ p("div", {
		className: Z.toggleRow,
		children: [/* @__PURE__ */ p("span", {
			className: Z.toggleLabel,
			children: [e, t && /* @__PURE__ */ f("span", {
				className: Z.toggleSub,
				children: t
			})]
		}), /* @__PURE__ */ p("label", {
			className: Z.switch,
			children: [/* @__PURE__ */ f("input", {
				type: "checkbox",
				className: Z.switchInput,
				checked: n,
				onChange: (e) => r(e.target.checked)
			}), /* @__PURE__ */ f("span", { className: Z.switchTrack })]
		})]
	});
}
function ul(e) {
	return {
		bg: "#1a1a2e",
		surface: "#0a0e1a",
		accent: "#64ffda",
		text: "#a8b2d1",
		text_bright: "#ccd6f6"
	}[e] || "#888888";
}
function dl(e) {
	let t = {};
	if (e.feed && e.feed !== "./feed.json" && (t.feed = e.feed), e.persistence && e.persistence !== "localStorage" && (t.persistence = e.persistence), e.features) {
		let n = {};
		for (let [t, r] of Object.entries(e.features)) r !== il[t] && (n[t] = r);
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
var Q = {
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
}, fl = [
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
function pl(e) {
	return (e.url || e.id || "").split("/").pop().replace(".html", "");
}
function ml({ feedData: e, onFilterChange: t }) {
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
			let o = pl(e);
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
				monthName: fl[n],
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
		className: Q.timeOverlay,
		children: [/* @__PURE__ */ p("div", {
			className: Q.header,
			children: [/* @__PURE__ */ p("div", {
				className: Q.titleGroup,
				children: [/* @__PURE__ */ f("span", {
					className: Q.title,
					children: "Chronology"
				}), /* @__PURE__ */ f("span", {
					className: Q.rangeBadge,
					children: i.minYear === i.maxYear ? i.minYear : `${i.minYear}–${i.maxYear}`
				})]
			}), n && /* @__PURE__ */ f("button", {
				className: Q.clearBtn,
				onClick: () => {
					r(null), t && t(null, null);
				},
				title: "Show all posts",
				children: "Reset"
			})]
		}), /* @__PURE__ */ f("div", {
			className: Q.stackScroll,
			children: i.months.map((e, t) => {
				let r = n === e.key, a = e.articleSlugs.length === 0, c = i.months[t - 1], l = !c || c.year !== e.year;
				return /* @__PURE__ */ p("div", {
					className: `${Q.monthBox} ${a ? Q.emptyMonth : ""} ${r ? Q.activeMonth : ""}`,
					children: [/* @__PURE__ */ p("div", {
						className: Q.monthHeader,
						onClick: () => o(e),
						title: a ? "No articles published this month" : `Filter to ${e.monthName} ${e.year} (${e.articleSlugs.length})`,
						children: [/* @__PURE__ */ p("div", {
							className: Q.monthName,
							children: [e.monthName, l && /* @__PURE__ */ f("span", {
								className: Q.yearTag,
								children: e.year
							})]
						}), /* @__PURE__ */ f("div", {
							className: `${Q.monthMeta} ${e.articleSlugs.length > 0 ? Q.hasItems : ""}`,
							children: e.articleSlugs.length > 0 ? `${e.articleSlugs.length} post${e.articleSlugs.length > 1 ? "s" : ""}` : "0 posts"
						})]
					}), /* @__PURE__ */ p("div", {
						className: Q.branchArea,
						children: [/* @__PURE__ */ f("div", { className: Q.branchLine }), /* @__PURE__ */ f("div", {
							className: Q.weeksRow,
							children: e.weeks.map((t) => {
								let r = t.articleSlugs.length, i = n === t.id;
								return /* @__PURE__ */ p("div", {
									className: `${Q.weekPill} ${r > 0 ? Q.hasContent : ""} ${i ? Q.activeWeek : ""}`,
									onClick: (n) => s(n, t, e),
									title: r > 0 ? `${t.label}: ${r} post${r > 1 ? "s" : ""}` : `${t.label}: empty`,
									children: [/* @__PURE__ */ f("span", { children: t.label }), r > 0 && /* @__PURE__ */ f("span", {
										className: Q.weekBadge,
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
}, hl = /* @__PURE__ */ m(((e, t) => {
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
})), gl = /* @__PURE__ */ m(((e, t) => {
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
	function l({ dimensions: e = [], layers: t = [], axis: n = {}, preferences: i = {}, show: a = {}, layouts: s = [], layout: c, group: l = "dimensions" }) {
		let u = [], d = n.dimension || "time";
		if (a.dimensions !== !1) {
			for (let t of e) u.push({
				kind: "dimension",
				id: t.id,
				label: t.label,
				title: t.title,
				checked: !!n.on && d === t.id
			});
			for (let e of t) u.push({
				kind: "layer",
				id: e.id,
				label: e.label,
				title: e.title,
				checked: i[e.id] === !0
			});
			o(n) && u.push({
				kind: "granularity",
				value: n.granularity || "auto"
			}), u.push({ kind: "divider" });
		}
		for (let e of r) u.push({
			kind: "action",
			...e
		});
		return a.layout !== !1 && s.length && u.push({
			kind: "layout",
			options: s.map((e) => ({
				id: e.id,
				label: e.label,
				title: e.title,
				checked: c === e.id
			}))
		}), {
			heading: a.dimensions === !1 ? "view" : l,
			rows: u
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
})), _l = hl(), vl = gl(), yl = [{
	id: "force",
	label: "cluster",
	title: "Cluster: each container its own path"
}, {
	id: "radial",
	label: "ring",
	title: "Ring: each container its own ring"
}], bl = (e) => window.dispatchEvent(new CustomEvent(e));
function xl({ viewState: e, show: t = {}, layouts: n = yl, settings: r, layers: i = [], placement: a = "bottom" }) {
	return f(a === "top" ? Cl : Sl, {
		viewState: e,
		show: t,
		layouts: n,
		settings: r,
		layers: i
	});
}
function Sl({ viewState: e, show: t, layouts: n, settings: i, layers: a }) {
	let s = i || (typeof window < "u" ? window.SETTINGS : null), l = (0, _l.dimensionLabels)(s), u = (0, _l.dimensionGroupLabel)(s), m = u.charAt(0).toUpperCase() + u.slice(1), h = (0, _l.layerLabels)(s).filter((e) => a.includes(e.id)), [, g] = o((e) => e + 1, 0), [_, v] = c(!1);
	if (r(() => e ? e.subscribe(g) : void 0, [e]), r(() => {
		if (!_) return;
		let e = (e) => {
			e.key === "Escape" && v(!1);
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [_]), !e) return null;
	let y = t.history !== !1, b = t.layout !== !1, x = t.dimensions !== !1, S = e.state.layout, C = e.timeAxis(), w = C.dimension || "time", T = (t) => e.setTimeAxis((0, vl.toggleDimension)(C, t)), E = () => e.setTimeAxis({ granularity: (0, vl.nextGranularity)(C.granularity) }), D = (0, vl.hasGranularity)(C), O = /* @__PURE__ */ p(d, { children: [
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
					title: vl.RESET_TITLE,
					"data-toolbar-reset": !0,
					onClick: () => {
						v(!1), bl("graph:reset-all");
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
				children: vl.VIEW_ACTIONS.map((e) => /* @__PURE__ */ f("button", {
					className: $.action,
					title: e.title,
					onClick: () => {
						bl(e.event), v(!1);
					},
					children: e.label
				}, e.event))
			})]
		})]
	})] })] });
}
function Cl({ viewState: e, show: t, layouts: n, settings: i, layers: a }) {
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
	let x = t.history !== !1, S = (0, _l.dimensionGroupLabel)(l), C = (e) => e.charAt(0).toUpperCase() + e.slice(1), w = e.timeAxis(), T = (0, vl.menuModel)({
		dimensions: (0, _l.dimensionLabels)(l),
		layers: (0, _l.layerLabels)(l).filter((e) => a.includes(e.id)),
		axis: w,
		preferences: Object.fromEntries((0, _l.layerLabels)(l).map((t) => [t.id, e.preference(t.id)])),
		show: t,
		layouts: n,
		layout: e.state.layout,
		group: S
	}), E = C(T.heading);
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
				children: /* @__PURE__ */ f(bc, {
					body: (0, Hc.iconBody)("undo-2"),
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
				children: /* @__PURE__ */ f(bc, {
					body: (0, Hc.iconBody)("redo-2"),
					size: 15
				})
			})] }),
			/* @__PURE__ */ f("button", {
				type: "button",
				className: $.topIcon,
				title: vl.RESET_TITLE,
				"aria-label": "Reset",
				"data-toolbar-reset": !0,
				onClick: () => {
					h(!1), bl("graph:reset-all");
				},
				children: /* @__PURE__ */ f(bc, {
					body: (0, Hc.iconBody)("rotate-ccw"),
					size: 15
				})
			}),
			/* @__PURE__ */ f("button", {
				ref: _,
				type: "button",
				className: `${$.topIcon} ${m ? $.on : ""}`,
				title: `${E}: ${T.heading === "view" ? "view actions" : "which to show, and the view actions"}`,
				"aria-label": E,
				"aria-haspopup": "menu",
				"aria-expanded": m,
				"aria-controls": "pp-top-menu",
				"data-top-menu-button": !0,
				onClick: () => h((e) => !e),
				onKeyDown: (e) => {
					e.key === "ArrowDown" && !m && (e.preventDefault(), h(!0));
				},
				children: /* @__PURE__ */ f(bc, {
					body: (0, Hc.iconBody)("hourglass"),
					size: 15
				})
			}),
			m && /* @__PURE__ */ p("div", {
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
					let t = y(), n = (0, vl.menuMove)(t.indexOf(document.activeElement), e.key, t.length);
					n !== null && (e.preventDefault(), e.stopPropagation(), t[n].focus());
				},
				children: [/* @__PURE__ */ f("div", {
					id: "pp-top-menu-heading",
					role: "presentation",
					className: $.menuHeading,
					"data-group-label": !0,
					children: E
				}), T.rows.map((t, n) => {
					if (t.kind === "divider") return /* @__PURE__ */ f("div", {
						role: "separator",
						className: $.menuDivider
					}, `d${n}`);
					if (t.kind === "dimension" || t.kind === "layer") {
						let n = t.kind === "dimension" ? () => e.setTimeAxis((0, vl.toggleDimension)(w, t.id)) : () => e.setPreference(t.id, t.checked ? null : !0);
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
								children: t.checked && /* @__PURE__ */ f(bc, {
									body: (0, Hc.iconBody)("check"),
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
						onClick: () => e.setTimeAxis({ granularity: (0, vl.nextGranularity)(w.granularity) }),
						children: [
							/* @__PURE__ */ f("span", {
								className: $.menuCheck,
								"aria-hidden": "true"
							}),
							"bucket size · ",
							t.value
						]
					}, "granularity") : t.kind === "action" ? /* @__PURE__ */ p("button", {
						type: "button",
						role: "menuitem",
						className: $.menuItem,
						title: t.title,
						"data-menu-item": !0,
						"data-view-action": t.event,
						onClick: () => {
							bl(t.event), b(!0);
						},
						children: [/* @__PURE__ */ f("span", {
							className: $.menuCheck,
							"aria-hidden": "true"
						}), t.label]
					}, t.event) : t.kind === "layout" ? /* @__PURE__ */ f("div", {
						role: "group",
						"aria-label": "Layout",
						className: $.menuLayout,
						"data-group": "layout",
						children: t.options.map((t) => /* @__PURE__ */ f("button", {
							type: "button",
							role: "menuitemradio",
							"aria-checked": t.checked,
							title: t.title,
							className: `${$.menuSeg} ${t.checked ? $.on : ""}`,
							"data-menu-item": !0,
							"data-layout": t.id,
							onClick: () => {
								t.checked || e.setLayout(t.id);
							},
							children: t.label
						}, t.id))
					}, "layout") : null;
				})]
			})
		]
	});
}
//#endregion
//#region src/components/TimeOfDay/TimeOfDay.jsx
function wl() {
	let e = () => typeof document < "u" && document.documentElement.getAttribute("data-pp-mode") || "dark", [t, n] = c(e);
	return r(() => {
		let t = new MutationObserver(() => n(e()));
		return t.observe(document.documentElement, {
			attributes: !0,
			attributeFilter: ["data-pp-mode"]
		}), () => t.disconnect();
	}, []), t;
}
var Tl = {
	position: "fixed",
	inset: 0,
	zIndex: -1,
	pointerEvents: "none"
};
function El({ item: e, settings: t, viewState: n }) {
	let i = (0, vs.config)(t), [, a] = c(0);
	r(() => n ? n.subscribe(() => a((e) => e + 1)) : void 0, [n]);
	let o = wl(), l = !n || !n.preference || n.preference("timeOfDay") !== !1, u = i && l ? (0, vs.ambienceFor)(e, i, o) : null, p = u ? `${u.top}|${u.bottom}` : "", [m, h] = c([null, null]), [g, _] = c(0), v = s("");
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
			...Tl,
			background: e ? `linear-gradient(180deg, ${e.top} 0%, ${e.bottom} 100%)` : "transparent",
			opacity: t === g && e ? 1 : 0,
			transition: `opacity ${y}s ease-in-out`
		}
	}, t)) });
}
//#endregion
//#region src/components/Theme/Theme.jsx
var Dl = (/* @__PURE__ */ m(((e, t) => {
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
			case: "lower"
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
				size: Math.max(0, g(e.size, .05)),
				rise: g(e.rise, 0)
			}));
			t.length && n.push({
				x: g(e.x, 0),
				y: g(e.y, 0),
				spans: t
			});
		}
		return { lines: n };
	}
	function s(e) {
		if (!e || typeof e != "object") return null;
		let t = o(e.art), n = o(e.graph);
		if (!t.lines.length && !n.lines.length) return null;
		let a = (t.lines.length ? t : n).lines.map((e) => e.spans.map((e) => e.text).join("")).join(" "), s = _(e.font).trim();
		return {
			text: _(e.text).trim() || a.replace(/\s+/g, " ").trim(),
			font: s,
			family: s ? `'${s.replace(/'/g, "")}', ${i}` : i,
			color: _(e.color).trim(),
			opacity: v(g(e.opacity, r.opacity)),
			hideGraphTitle: e.hideGraphTitle !== !1,
			art: t,
			graph: n
		};
	}
	function c(e, t) {
		let { left: n = 0, top: r = 0, width: i = 1, height: a = 1 } = t || {};
		return { lines: (e && e.lines || []).map((e) => ({
			x: n + e.x * i,
			y: r + e.y * a,
			spans: e.spans.map((e) => ({
				text: e.text,
				size: e.size * i,
				rise: e.rise * i
			}))
		})) };
	}
	function l(e) {
		let t = e && typeof e == "object" ? e : {}, r = n.byline, i = t.opacity, a = i && typeof i == "object" ? {
			art: v(g(i.art, r.opacity.art)),
			graph: v(g(i.graph, r.opacity.graph))
		} : Number.isFinite(Number(i)) && i !== "" && i !== null ? {
			art: v(Number(i)),
			graph: v(Number(i))
		} : { ...r.opacity };
		return {
			text: _(t.text),
			href: _(t.href),
			opacity: a,
			size: Math.max(.01, Math.min(1, g(t.size, r.size))),
			gap: Math.max(0, Math.min(2, g(t.gap, r.gap))),
			minSize: Math.max(0, g(t.minSize, r.minSize)),
			case: t.case === "as-written" ? "as-written" : "lower"
		};
	}
	function u(e) {
		return !e || !e.text ? "" : e.case === "as-written" ? e.text : e.text.toLowerCase();
	}
	function d(e, t, n) {
		let r = e && e.lines || [];
		if (!r.length) return null;
		let i = r[r.length - 1], a = Math.max(...r.flatMap((e) => e.spans.map((e) => e.size))) * t.width;
		return {
			x: t.left + i.x * t.width,
			y: t.top + i.y * t.height + n.gap * a,
			size: Math.max(n.minSize, n.size * a),
			titleSize: a
		};
	}
	var f = {
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
	}, { reachConfig: p, backdropConfig: m, backdropOpacity: h } = rs(), g = (e, t) => e !== "" && e != null && Number.isFinite(Number(e)) ? Number(e) : t, _ = (e) => typeof e == "string" ? e : "", v = (e) => Math.max(0, Math.min(1, e)), y = (e) => typeof e == "string" && e.trim() && !/[;{}<>]/.test(e) ? e.trim() : "", b = (e, t, n) => e + (t - e) * n, x = (e) => {
		let t = v(e);
		return t * t * (3 - 2 * t);
	};
	function S(e) {
		if (e && typeof e == "object") {
			let t = v(g(e.textureFrom, .35));
			return {
				mode: e.mode === "paper" ? "paper" : "dark",
				sky: {
					top: y(e.top) || "#050505",
					bottom: y(e.bottom),
					textureFrom: t,
					colorFrom: v(g(e.colorFrom, t)),
					texture: Math.max(0, Math.min(3, g(e.texture, 1)))
				}
			};
		}
		return {
			mode: e === "paper" ? "paper" : "dark",
			sky: null
		};
	}
	function C(e) {
		if (!e || typeof e != "object") return null;
		let t = (e) => e === "" || e == null || !Number.isFinite(Number(e)) ? null : Math.max(0, Number(e)), n = t(e.art), r = t(e.graph);
		return n === null && r === null ? null : {
			art: n,
			graph: r
		};
	}
	function w(e) {
		let t = e && typeof e == "object" ? e.extra : void 0;
		return { extra: t === "" || t == null || !Number.isFinite(Number(t)) ? 16 : Math.max(0, Number(t)) };
	}
	var T = (e, t) => Math.max(12, Math.ceil((Number(e) || 0) + ((t && t.extra) ?? 16)));
	function E(e, t, n, r = 64) {
		for (let i = 0; i < n; i += 1) for (let a = 0, o = i * t * 4 + 3; a < t; a += 1, o += 4) if (e[o] >= r) return i / n;
		return 1;
	}
	function D(e) {
		let t = e && e.opening;
		if (!t || t.enabled !== !0 || t.mode !== void 0 && t.mode !== "two-state") return null;
		let r = t.art && typeof t.art == "object" ? t.art : {}, i = _(r.artState), a = _(r.graphState), o = _(r.full);
		if (!(i && a)) {
			if (!o) return null;
			i = o, a = "";
		}
		let c = t.graph && typeof t.graph == "object" ? t.graph : {}, u = S(t.ground);
		return {
			enabled: !0,
			mode: "two-state",
			art: {
				artState: i,
				graphState: a,
				full: o
			},
			alt: _(t.alt),
			ground: u.mode,
			sky: u.sky,
			graph: {
				artOffset: Math.max(0, Math.min(.95, g(c.artOffset, n.graph.artOffset))),
				artStateOpacity: v(g(c.artStateOpacity, n.graph.artStateOpacity))
			},
			top: C(t.top),
			grip: w(t.grip),
			backdrop: m(t),
			reach: p(t),
			byline: l(t.byline),
			startOn: [
				"remembered",
				"art",
				"graph"
			].includes(t.startOn) ? t.startOn : n.startOn,
			snapMs: Math.max(0, g(t.snapMs, n.snapMs)),
			title: s(t.title)
		};
	}
	function O(e, { stored: t, hash: n } = {}) {
		return !e || typeof n == "string" && n.startsWith("#read=") ? "graph" : e.startOn === "art" || e.startOn === "graph" ? e.startOn : a.includes(t) ? t : "art";
	}
	function k(e, { vw: t, vh: r, art: i, bottom: a = 0, zoom: o = null, controls: s = 0, ink: c = null } = {}, l = 0) {
		let u = v(l), d = f, p = Math.max(1, i && i.w || 1), m = Math.max(1, i && i.h || 1), _ = e && e.byline && e.byline.text ? d.bylineSpace : 0, y = Math.min(d.pad, r * .03), S = Math.max(y, a), C = e && e.top || null, w = v(g(c && c.art, 0)), T = c && Number.isFinite(c.graph) ? v(c.graph) : null, E = C && C.art !== null ? Math.max(0, s) + C.art : null, D = Math.max(1, r - (E === null ? y : E) - S - _), O = E === null ? m : m * Math.max(.05, 1 - w), k = Math.max(.01, Math.min(D / O, (t - 2 * y) / p)), ee = p * k, j = m * k, M = e && e.graph || n.graph, N = e && e.backdrop || n.backdrop, te = E === null ? y + Math.max(0, (D - j) / 2) : E - w * j, P = C && C.graph !== null && T !== null ? Math.min(te - 1, Math.max(0, s) + C.graph - T * j) : -M.artOffset * j, F = b(te, P, u), I = x((u - d.graphFrom) / (1 - d.graphFrom));
		return {
			p: u,
			vw: t,
			vh: r,
			art: {
				top: F,
				left: (t - ee) / 2,
				width: ee,
				height: j,
				scale: k,
				opacity: 1
			},
			roots: b(1, o ? h(N, o.k, o.homeK) : N.opacity, u),
			fade: {
				art: 1 - u,
				graph: u
			},
			artTop0: te,
			artTop1: P,
			travel: Math.max(1, te - P),
			graph: {
				opacity: I,
				shift: (1 - I) * d.rise * r
			},
			layer: {
				opacity: b(g(M.artStateOpacity, n.graph.artStateOpacity), 1, u),
				follow: F - P
			},
			ground: 1 - u,
			byline: A(e, {
				left: (t - ee) / 2,
				top: F,
				width: ee,
				height: j
			}, u, {
				x: t / 2,
				y: F + j + (_ - d.bylineSize * 1.3) / 2,
				size: d.bylineSize,
				opacity: v(1 - u * 2.5),
				align: "center",
				under: "art"
			})
		};
	}
	function A(e, t, n, r) {
		let i = e && e.title, a = e && e.byline;
		if (!i || !a || !a.text) return r;
		let o = d(i.art, t, a), s = d(i.graph, t, a), c = o || s, l = s || o;
		return {
			x: b(c.x, l.x, n),
			y: b(c.y, l.y, n),
			size: b(c.size, l.size, n),
			opacity: b(a.opacity.art, a.opacity.graph, n),
			align: "left",
			under: "title"
		};
	}
	var ee = (e) => 1 - (1 - e) ** 3, j = (e) => e < .5 ? 4 * e * e * e : 1 - (-2 * e + 2) ** 3 / 2;
	function M(e, { start: t = "art", reducedMotion: r = !1, travel: i = 600, now: o = () => Date.now(), frame: s = (e) => setTimeout(() => e(), 16), cancelFrame: c = (e) => clearTimeout(e), setTimer: l = setTimeout, clearTimer: u = clearTimeout, onChange: d = () => {}, onRest: p = () => {} } = {}) {
		let m = e ? e.snapMs : n.snapMs, h = +(t === "graph"), g = t === "graph" ? "graph" : "art", _ = g, y = null, x = null, S = 0, C = 0, w = null, T = Math.max(120, i), E = (e) => +(e === "graph"), D = (e) => e === "graph" ? "art" : "graph";
		function O(e, t) {
			let n = v(e);
			n === h && !(t && t.swap) || (h = n, d(h, t || {}));
		}
		function k() {
			y &&= (c(y.handle), null);
		}
		function A(e) {
			k(), g = e, _ = e, O(E(e)), C = o() + f.quietMs, p(e);
		}
		function M(e, { ease: t = ee } = {}) {
			k();
			let n = E(e);
			if (r) {
				N(e);
				return;
			}
			let i = h, a = Math.abs(n - i);
			if (a < 1e-4 || m === 0) {
				A(e);
				return;
			}
			let c = Math.max(f.minSnapMs, m * a), l = o();
			y = {
				target: e,
				handle: null
			};
			let u = () => {
				let r = Math.min(1, (o() - l) / c);
				if (O(b(i, n, t(r))), r >= 1) {
					y = null, A(e);
					return;
				}
				y.handle = s(u);
			};
			y.handle = s(u);
		}
		function N(e) {
			k(), !(g === e && h === E(e)) && (g = e, _ = e, h = E(e), d(h, {
				swap: !0,
				ms: f.reducedFadeMs
			}), C = o() + f.quietMs, p(e));
		}
		function te(e = 0) {
			let t = E(_), n = h - t, r = _, i = t === 0 ? 1 : -1;
			n * i > f.onward && (r = D(_)), e * i > f.flickPxPerMs && (r = D(_)), e * i < -f.flickPxPerMs && (r = _), M(r);
		}
		function P(e) {
			y || (_ = h >= 1 ? "graph" : h <= 0 ? "art" : _), k(), O(h + e);
		}
		function F(e, { instant: t = !1 } = {}) {
			return a.includes(e) ? t ? (A(e), !0) : g === e && h === E(e) && !y ? !1 : (M(e, { ease: j }), !0) : !1;
		}
		function I(e, { deltaMode: t = 0, where: n = "stage" } = {}) {
			let i = e * (t === 1 ? f.lineHeightPx : t === 2 ? T : 1);
			if (!i) return !1;
			let a = !y && (h === 0 || h === 1);
			if ((n === "graph" || n === "edge") && a && h === 1) {
				if (o() < C) return !0;
				if (!(n === "edge" && i < 0)) return !1;
			}
			if (r) {
				if (o() < C) return !0;
				if (S += i, Math.abs(S) >= f.reducedWheelPx) {
					let e = S > 0 ? "graph" : "art";
					S = 0, e !== g && N(e);
				}
				return !0;
			}
			return a && (h === 0 && i < 0 || h === 1 && i > 0) ? !0 : (P(i / T), x && u(x), x = l(() => {
				x = null, h > 0 && h < 1 ? te(0) : A(h >= 1 ? "graph" : "art");
			}, f.wheelIdleMs), !0);
		}
		function L(e, t = o()) {
			y && (_ = y.target === "graph" ? "art" : "graph", k()), w = {
				y: e,
				p: h,
				lastY: e,
				lastT: t,
				v: 0,
				total: 0
			}, S = 0;
		}
		function ne(e, t = o()) {
			if (!w) return !1;
			let n = w.lastY - e, i = Math.max(1, t - w.lastT);
			return w.v = n / i * .6 + .4 * w.v, w.lastY = e, w.lastT = t, w.total += n, r || O(w.p + (w.y - e) / T), !0;
		}
		function re(e = o()) {
			if (!w) return !1;
			let { v: t, total: n, lastT: i } = w;
			if (w = null, r) {
				if (Math.abs(n) >= f.reducedWheelPx) {
					let e = n > 0 ? "graph" : "art";
					e !== g && N(e);
				}
				return !0;
			}
			let a = e - i > 120 ? 0 : t;
			return h === 0 || h === 1 ? (A(h === 1 ? "graph" : "art"), !0) : (te(a), !0);
		}
		function ie(e) {
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
				return !!y || h > 0 && h < 1;
			},
			wheel: I,
			touchStart: L,
			touchMove: ne,
			touchEnd: re,
			key: ie,
			tapArt: () => F("graph"),
			tapTop: () => F("art"),
			go: F,
			resize(e) {
				T = Math.max(120, e);
			},
			dispose() {
				k(), x &&= (u(x), null);
			}
		};
	}
	function N(e) {
		return !e || e.altKey || e.ctrlKey || e.metaKey ? null : e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " || e.key === "Spacebar") && !e.shiftKey ? "down" : e.key === "ArrowUp" || e.key === "PageUp" ? "up" : null;
	}
	t.exports = {
		DEFAULTS: n,
		TUNING: f,
		STATES: a,
		TITLE_DEFAULTS: r,
		TITLE_FALLBACK: i,
		openingConfig: D,
		bylineConfig: l,
		bylineText: u,
		groundConfig: S,
		topConfig: C,
		gripConfig: w,
		gripHeight: T,
		firstInkRow: E,
		titleConfig: s,
		titleLayout: c,
		startState: O,
		coverGeometry: k,
		createCover: M,
		pageKey: N
	};
})))();
function Ol({ settings: e, viewState: t }) {
	let [, n] = c(0), i = typeof window < "u" && window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null, [a, o] = c(i ? i.matches : !0);
	r(() => t ? t.subscribe(() => n((e) => e + 1)) : void 0, [t]), r(() => {
		if (!i) return;
		let e = (e) => o(e.matches);
		return i.addEventListener ? i.addEventListener("change", e) : i.addListener(e), () => {
			i.removeEventListener ? i.removeEventListener("change", e) : i.removeListener(e);
		};
	}, []);
	let s = (0, Vc.themeName)(e, t && t.preference ? t.preference("theme") : null), l = (0, Vc.themeMode)(s, t && t.preference ? t.preference("mode") : null, a), u = (0, Dl.openingConfig)(e), d = u && u.ground === "dark" ? "dark" : l;
	return r(() => {
		let e = document.documentElement;
		e.getAttribute("data-pp-theme") !== s && e.setAttribute("data-pp-theme", s), e.getAttribute("data-pp-mode") !== d && e.setAttribute("data-pp-mode", d), e.getAttribute("data-pp-reader-mode") !== l && e.setAttribute("data-pp-reader-mode", l), e.style.colorScheme = d;
	}, [
		s,
		l,
		d
	]), null;
}
var kl = {
	cover: "_cover_knp9z_9",
	ground: "_ground_knp9z_18",
	groundTexture: "_groundTexture_knp9z_28",
	stage: "_stage_knp9z_46",
	art: "_art_knp9z_61",
	image: "_image_knp9z_75",
	reach: "_reach_knp9z_85",
	title: "_title_knp9z_115",
	alt: "_alt_knp9z_135",
	byline: "_byline_knp9z_147",
	bylineTitle: "_bylineTitle_knp9z_160",
	section: "_section_knp9z_179",
	handle: "_handle_knp9z_189",
	grip: "_grip_knp9z_186"
}, Al = () => typeof window < "u" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function jl(e) {
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
function Ml(e) {
	return new Promise((t) => {
		if (!e) {
			t(null);
			return;
		}
		let n = new Image();
		n.onload = () => {
			try {
				let e = Math.min(2048, n.naturalWidth), r = Math.max(1, Math.round(n.naturalHeight * e / n.naturalWidth)), i = document.createElement("canvas");
				i.width = e, i.height = r;
				let a = i.getContext("2d");
				a.drawImage(n, 0, 0, e, r), t((0, Dl.firstInkRow)(a.getImageData(0, 0, e, r).data, e, r));
			} catch {
				t(null);
			}
		}, n.onerror = () => t(null), n.src = e;
	});
}
function Nl(e) {
	if (typeof document > "u") return 0;
	let t = 0;
	for (let n of document.querySelectorAll("[data-feeds] > *, [data-top-pages], [data-settings-gear]")) {
		let r = n.getBoundingClientRect();
		!r.width || !r.height || r.top > e * .2 || (t = Math.max(t, r.bottom));
	}
	return t;
}
function Pl(e) {
	if (typeof document > "u") return 0;
	let t = 0;
	for (let n of document.querySelectorAll("[data-feeds] > *:not([data-graph-intro]), [data-settings-gear]")) {
		let r = n.getBoundingClientRect();
		!r.width || !r.height || r.top > e * .2 || getComputedStyle(n).position === "fixed" && !n.matches("[data-settings-gear]") || (t = Math.max(t, r.bottom));
	}
	return t;
}
var Fl = new Set([
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
function Il(e) {
	let t = e.target;
	return !!(t && t.nodeType === 1 && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || Fl.has(t.getAttribute("role")) || t.closest("[data-reader-panel], [role=\"dialog\"], [role=\"menu\"], [data-settings-panel]") || (e.key === " " || e.key === "Spacebar") && t.closest("button, a[href], summary, [role=\"button\"]")) || typeof window < "u" && window.location.hash.startsWith("#read=") || typeof document < "u" && document.querySelector("[data-settings-panel]"));
}
function Ll(e) {
	let t = typeof document < "u" && document.querySelector("[data-rights]");
	if (!t) return 0;
	let n = t.getBoundingClientRect();
	return n.height > 0 ? Math.max(0, e - n.top + 8) : 0;
}
var Rl = 8, zl = "http://www.w3.org/2000/svg";
function Bl(e, t, { reduced: n, seed: r }) {
	let i = /* @__PURE__ */ new Map(), a = n ? 0 : e.lagMs;
	function o(e, n, i) {
		let o = document.createElementNS(zl, "g");
		o.setAttribute("data-reach", e), o.setAttribute("data-reach-container", n), o.setAttribute("data-reach-tip", String(i));
		let s = document.createElementNS(zl, "path");
		s.setAttribute("class", "reach-main");
		let c = document.createElementNS(zl, "path");
		return c.setAttribute("class", "reach-fine"), o.append(s, c), o.style.visibility = "hidden", t.appendChild(o), {
			key: e,
			g: o,
			main: s,
			fine: c,
			shape: (0, _s.reachShape)(`${r}|${e}`),
			lag: (0, _s.createLag)(a),
			state: "new",
			timer: null
		};
	}
	function s(t) {
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
	function c(e) {
		e.timer && clearTimeout(e.timer), e.g.remove();
	}
	function l(n, { box: r, opacity: a, settledCover: l, world: u }) {
		if (t.style.opacity = String(a), !u || !r) return !1;
		let d = e.tips.map((e) => (0, _s.artPoint)(e, r)), f = /* @__PURE__ */ new Set(), p = !1;
		for (let t of u.containers) for (let r of (0, _s.reachFor)(d, t, e.perContainer, e.stopShort)) {
			let e = r.tip, c = `${t.id}|${e}`;
			f.add(c);
			let u = i.get(c);
			u || (u = o(c, t.id, e), i.set(c, u)), u.state === "new" || !l ? u.lag.jump(r.end) : u.lag.to(r.end, n);
			let m = u.lag.at(n);
			u.lag.settled(n) || (p = !0);
			let h = (0, _s.reachPath)(d[e], m, u.shape);
			u.main.setAttribute("d", h.main), u.fine.setAttribute("d", h.fine), u.g.setAttribute("data-target", `${r.end.x.toFixed(1)},${r.end.y.toFixed(1)}`), u.g.setAttribute("data-hit", `${r.hit.x.toFixed(1)},${r.hit.y.toFixed(1)}`), u.state === "new" && a > .05 && s(u);
		}
		for (let [e, t] of i) f.has(e) || (c(t), i.delete(e));
		return p;
	}
	return {
		draw: l,
		dispose() {
			for (let e of i.values()) c(e);
			i.clear();
		}
	};
}
function Vl({ layout: e, size: t, which: n, opacity: r }) {
	let i = (0, Dl.titleLayout)(e, {
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
function Hl(e, t) {
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
function Ul(e) {
	if (!e) return;
	let t = e.bottom || "var(--sk-paper, var(--bg, #2a2a2e))";
	return {
		backgroundColor: e.top,
		backgroundImage: `linear-gradient(to bottom, ${e.top} 0%, ${e.top} ${(e.colorFrom * 100).toFixed(1)}%, ${t} 100%)`
	};
}
function Wl(e) {
	let t = `linear-gradient(to bottom, transparent 0%, transparent ${(e * 100).toFixed(1)}%, #000 100%)`;
	return {
		WebkitMaskImage: t,
		maskImage: t
	};
}
function Gl({ title: e, size: t, start: n, refs: r }) {
	return !e || !t ? null : /* @__PURE__ */ p("svg", {
		className: kl.title,
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
			children: /* @__PURE__ */ f(Vl, {
				layout: e.art,
				size: t,
				which: "art",
				opacity: +(n === "art")
			})
		}), /* @__PURE__ */ f("g", {
			ref: r.graph,
			children: /* @__PURE__ */ f(Vl, {
				layout: e.graph,
				size: t,
				which: "graph",
				opacity: n === "art" ? 0 : 1
			})
		})]
	});
}
function Kl({ config: e, viewState: t, children: n }) {
	let o = s(null), l = s(null), u = s(null), m = s(null), h = s(null), g = s(null), _ = s(null), v = s(null), y = s(null), b = s(null), x = s(null), S = s(0), C = s(null), w = s(null), T = s(null), E = s(null), D = s(null), O = s(null), k = s(null), A = s(null), ee = s(() => !1), [j, M] = c(null), N = s(null), te = s(0), P = a(Al, []), F = a(() => (0, Dl.startState)(e, {
		stored: t && t.openingState ? t.openingState() : null,
		hash: typeof window < "u" ? window.location.hash : ""
	}), [e, t]);
	r(() => {
		let t = !0, n = e.top ? Promise.all([Ml(e.art.artState), Ml(e.art.graphState || e.art.artState)]) : Promise.resolve([null, null]);
		return Promise.all([jl(e.art.artState), n]).then(([e, [n, r]]) => {
			t && (N.current = {
				art: n,
				graph: r
			}, M(e || {
				w: 1,
				h: 2
			}));
		}), () => {
			t = !1;
		};
	}, [e]);
	let I = (t) => {
		let n = window.innerWidth, r = window.innerHeight;
		return (0, Dl.coverGeometry)(e, {
			vw: n,
			vh: r,
			art: A.current || {
				w: 1,
				h: 2
			},
			bottom: Ll(r),
			zoom: b.current,
			controls: te.current,
			ink: N.current
		}, t);
	}, L = () => {
		C.current = null;
		let t = window.PostPipeGraphWorld ? window.PostPipeGraphWorld.snapshot() : null;
		t && t.k > 0 && t.homeK > 0 && (b.current = {
			k: t.k,
			homeK: t.homeK
		});
		let n = k.current;
		if (!n) return;
		let r = I(n.p);
		x.current = r, ie(r);
		let i = y.current;
		if (!i || !A.current) return;
		let a = b.current ? (0, _s.backdropOpacity)(e.backdrop, b.current.k, b.current.homeK) : e.backdrop.opacity;
		i.draw(performance.now(), {
			box: r.art,
			world: t,
			opacity: r.layer.opacity * a,
			settledCover: n.p >= 1 && !n.moving
		}) && ne();
	}, ne = () => {
		C.current ||= requestAnimationFrame(() => re.current());
	}, re = s(L);
	re.current = L;
	let ie = (e) => {
		let t = g.current;
		t ? t.style.opacity = String(e.fade.graph * e.roots) : h.current && (h.current.style.opacity = String(e.roots)), _.current && (_.current.style.opacity = String(e.fade.graph));
	}, ae = () => {
		if (!A.current) return;
		let e = I(1);
		window.PostPipeCoverFrame = {
			art: {
				left: e.art.left,
				top: e.art.top,
				width: e.art.width,
				height: e.art.height
			},
			natural: { ...A.current }
		}, window.dispatchEvent(new CustomEvent("postpipe:cover-frame"));
	}, R = s(ae);
	R.current = ae;
	let oe = (e) => {
		let t = I(e), n = k.current, r = n && n.moving ? "moving" : e >= 1 ? "graph" : e <= 0 ? "art" : "moving", i = document.documentElement;
		i.style.setProperty("--pp-cover-p", String(t.p)), i.setAttribute("data-pp-cover", r);
		let a = m.current;
		a && (a.style.width = `${t.art.width}px`, a.style.height = `${t.art.height}px`, a.style.transform = `translate3d(${t.art.left}px, ${t.art.top}px, 0)`, a.style.opacity = A.current ? String(t.art.opacity) : "0"), x.current = t, g.current && h.current && (h.current.style.opacity = String(t.fade.art)), ie(t);
		let o = w.current && w.current.firstChild, s = T.current && T.current.firstChild;
		o && (o.style.opacity = String(t.fade.art)), s && (s.style.opacity = String(t.fade.graph)), l.current && (l.current.style.opacity = String(t.ground));
		let c = E.current;
		if (c) {
			c.style.left = `${t.byline.x}px`, c.style.top = `${t.byline.y}px`, c.style.fontSize = `${t.byline.size}px`, c.style.opacity = A.current ? String(t.byline.opacity) : "0", c.setAttribute("data-cover-byline", t.byline.under);
			let e = t.byline.under === "title" ? r !== "moving" : t.byline.opacity > .5;
			c.style.pointerEvents = e ? "auto" : "none", c.tabIndex = t.byline.under === "title" ? e ? 0 : -1 : r === "art" ? 0 : -1;
		}
		let d = u.current;
		d && (d.setAttribute("data-cover-state", r), d.tabIndex = r === "art" ? 0 : -1);
		let f = D.current;
		if (f) {
			let e = r === "graph";
			S.current = e ? 0 : t.layer.follow, f.style.pointerEvents = e ? "" : "none";
			for (let n of f.children) {
				if (n.matches("[data-feeds], [data-top-bar], [data-cover-handle]")) continue;
				let i = n.matches("[data-graph-root]");
				n.style.opacity = e ? "" : String(i ? t.layer.opacity : t.graph.opacity), n.style.transform = e ? "" : i ? `translate3d(0, ${t.layer.follow}px, 0)` : `translate3d(0, ${t.graph.shift}px, 0)`, n.inert = r === "art", r === "art" ? n.setAttribute("aria-hidden", "true") : n.removeAttribute("aria-hidden");
			}
			for (let t of f.querySelectorAll("[data-top-graph-controls]")) t.inert = !e;
		}
		let p = O.current;
		p && (p.style.opacity = String(t.graph.opacity), p.style.pointerEvents = r === "graph" ? "auto" : "none", p.tabIndex = r === "graph" ? 0 : -1), ne();
	}, se = s(oe);
	se.current = oe, r(() => {
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
		if (!j) return;
		A.current = j, te.current = e.top ? Nl(window.innerHeight) : 0;
		let t = k.current;
		t && (t.resize(I(0).travel), se.current(t.p)), R.current();
		let n = !0;
		return e.top && document.fonts && document.fonts.ready && document.fonts.ready.then(() => {
			let e = Nl(window.innerHeight);
			if (!n || Math.abs(e - te.current) < .5) return;
			te.current = e;
			let t = k.current;
			t && (t.resize(I(0).travel), se.current(t.p)), R.current();
		}), () => {
			n = !1;
		};
	}, [j]), r(() => {
		e.reach && v.current && (y.current = Bl(e.reach, v.current, {
			reduced: P,
			seed: e.art.graphState || e.art.artState
		}));
		let t = () => ne();
		return window.addEventListener("graph:world", t), ne(), () => {
			window.removeEventListener("graph:world", t), C.current && cancelAnimationFrame(C.current), C.current = null, y.current && y.current.dispose(), y.current = null, window.PostPipeCoverFrame && delete window.PostPipeCoverFrame;
		};
	}, [e, P]), i(() => {
		let n = null, r = (0, Dl.createCover)(e, {
			start: F,
			reducedMotion: P,
			travel: I(0).travel,
			frame: (e) => requestAnimationFrame(e),
			cancelFrame: (e) => cancelAnimationFrame(e),
			onChange(e, t) {
				if (t && t.swap) {
					let r = Math.round((t.ms || Dl.TUNING.reducedFadeMs) / 2), i = [o.current, D.current].filter(Boolean);
					for (let e of i) e.style.transition = `opacity ${r}ms linear`, e.style.opacity = "0";
					n && clearTimeout(n);
					let a = Date.now(), s = () => {
						let t = o.current;
						if ((t ? Number(getComputedStyle(t).opacity) : 0) > .02 && Date.now() - a < r * 4) {
							n = setTimeout(s, 16);
							return;
						}
						se.current(e);
						for (let e of i) e.style.opacity = "1";
						n = setTimeout(() => {
							for (let e of i) e.style.transition = "";
							D.current && (D.current.style.opacity = ""), n = null;
						}, r + 20);
					};
					n = setTimeout(s, r);
					return;
				}
				se.current(e);
			},
			onRest(e) {
				n || se.current(r.p), t && t.setOpeningState && (t.setOpeningState(e), t.flush && t.flush()), window.dispatchEvent(new CustomEvent("postpipe:cover", { detail: { state: e } }));
			}
		});
		k.current = r, se.current(r.p), t && t.setOpeningState && t.setOpeningState(r.rest), window.PostPipeCover = {
			get state() {
				return r.moving ? "moving" : r.rest;
			},
			get p() {
				return r.p;
			},
			get shift() {
				return S.current;
			},
			go: (e, t) => r.go(e, t)
		};
		let i = () => {
			let t = O.current;
			t && (t.style.height = `calc(env(safe-area-inset-top, 0px) + ${(0, Dl.gripHeight)(Pl(window.innerHeight), e.grip)}px)`);
		};
		i();
		let a = requestAnimationFrame(i);
		document.fonts && document.fonts.ready && document.fonts.ready.then(i);
		let s = () => {
			i(), e.top && (te.current = Nl(window.innerHeight)), r.resize(I(0).travel), se.current(r.p), R.current();
		};
		window.addEventListener("resize", s);
		let c = D.current, l = u.current, d = O.current, f = (e) => {
			let t = e.target;
			return !t || !t.closest ? null : d && d.contains(t) ? "edge" : l && l.contains(t) ? "stage" : E.current && E.current.contains(t) ? r.p < 1 || r.moving ? "stage" : "graph" : !c || !c.contains(t) ? null : r.moving || r.p < 1 ? "stage" : e.clientY <= Dl.TUNING.edgePx ? "edge" : "graph";
		}, p = (e) => {
			if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
			let t = f(e);
			t && (e.ctrlKey && t === "graph" || r.wheel(e.deltaY, {
				deltaMode: e.deltaMode,
				where: t
			}) && (e.preventDefault(), e.stopPropagation()));
		};
		window.addEventListener("wheel", p, {
			capture: !0,
			passive: !1
		});
		let m = (e) => {
			let t = (0, Dl.pageKey)(e);
			!t || e.defaultPrevented || Il(e) || r.key(t) && e.preventDefault();
		};
		window.addEventListener("keydown", m);
		let h = () => {
			window.location.hash.startsWith("#read=") && r.go("graph");
		};
		window.addEventListener("hashchange", h);
		let g = null, _ = 0;
		ee.current = () => Date.now() - _ < 500;
		let v = (e) => {
			e.touches.length === 1 && (e.target.closest && e.target.closest("[data-cover-byline]") || (g = {
				y: e.touches[0].clientY,
				moved: 0
			}, r.touchStart(e.touches[0].clientY, e.timeStamp || Date.now())));
		}, y = (e) => {
			g && (e.preventDefault(), g.moved = Math.max(g.moved, Math.abs(e.touches[0].clientY - g.y)), r.touchMove(e.touches[0].clientY, e.timeStamp || Date.now()));
		}, b = (e) => {
			g && (g.moved >= Rl && (_ = Date.now()), g = null, r.touchEnd(e.timeStamp || Date.now()));
		}, x = null, C = (e) => {
			if (!(e.pointerType !== "mouse" || e.button !== 0)) {
				x = {
					y: e.clientY,
					moved: 0
				};
				try {
					d.setPointerCapture(e.pointerId);
				} catch {}
				r.touchStart(e.clientY, e.timeStamp || Date.now());
			}
		}, w = (e) => {
			x && (x.moved = Math.max(x.moved, Math.abs(e.clientY - x.y)), x.moved >= Rl && r.touchMove(e.clientY, e.timeStamp || Date.now()));
		}, T = (e) => {
			x && (x.moved >= Rl && (_ = Date.now()), x = null, r.touchEnd(e.timeStamp || Date.now()));
		};
		d && (d.addEventListener("pointerdown", C), d.addEventListener("pointermove", w), d.addEventListener("pointerup", T), d.addEventListener("pointercancel", T));
		let A = [l, d].filter(Boolean);
		for (let e of A) e.addEventListener("touchstart", v, { passive: !0 }), e.addEventListener("touchmove", y, { passive: !1 }), e.addEventListener("touchend", b), e.addEventListener("touchcancel", b);
		return () => {
			r.dispose(), cancelAnimationFrame(a), d && (d.removeEventListener("pointerdown", C), d.removeEventListener("pointermove", w), d.removeEventListener("pointerup", T), d.removeEventListener("pointercancel", T)), n && clearTimeout(n), window.removeEventListener("resize", s), window.removeEventListener("wheel", p, { capture: !0 }), window.removeEventListener("keydown", m), window.removeEventListener("hashchange", h);
			for (let e of A) e.removeEventListener("touchstart", v), e.removeEventListener("touchmove", y), e.removeEventListener("touchend", b), e.removeEventListener("touchcancel", b);
			document.documentElement.removeAttribute("data-pp-cover"), document.documentElement.style.removeProperty("--pp-cover-p"), window.PostPipeCover && window.PostPipeCover.go && delete window.PostPipeCover, k.current = null;
		};
	}, [
		e,
		P,
		F,
		t
	]);
	let ce = (e) => {
		let t = k.current;
		!t || ee.current() || (e === "graph" ? t.tapArt() : t.tapTop());
	}, z = F === "art";
	return /* @__PURE__ */ p(d, { children: [
		/* @__PURE__ */ p("div", {
			ref: o,
			className: kl.cover,
			"data-cover": !0,
			"data-ground": e.ground,
			children: [
				/* @__PURE__ */ f("div", {
					ref: l,
					className: kl.ground,
					"data-cover-ground": !0,
					"data-sky": e.sky ? "" : void 0,
					style: {
						opacity: +!!z,
						...Ul(e.sky)
					},
					children: e.sky && e.sky.texture > 0 && /* @__PURE__ */ f("div", {
						className: kl.groundTexture,
						"data-cover-ground-texture": !0,
						style: {
							opacity: e.sky.texture,
							...Wl(e.sky.textureFrom)
						}
					})
				}),
				/* @__PURE__ */ p("div", {
					ref: u,
					className: kl.stage,
					role: "button",
					tabIndex: z ? 0 : -1,
					"aria-label": "Show the graph",
					"data-cover-stage": !0,
					"data-cover-state": F,
					onClick: (e) => {
						e.target.closest && e.target.closest("[data-cover-byline]") || k.current && k.current.p < .5 && ce("graph");
					},
					onKeyDown: (e) => {
						e.target === e.currentTarget && (e.key === "Enter" || e.key === " " || e.key === "Spacebar") && (e.preventDefault(), e.stopPropagation(), ce("graph"));
					},
					children: [/* @__PURE__ */ p("div", {
						ref: m,
						className: kl.art,
						"data-cover-art": !0,
						style: { opacity: 0 },
						children: [
							/* @__PURE__ */ f("img", {
								ref: h,
								className: kl.image,
								src: e.art.artState,
								alt: "",
								draggable: "false",
								"data-cover-image": "art",
								style: e.art.graphState ? { opacity: +!!z } : void 0
							}),
							e.art.graphState && /* @__PURE__ */ f("img", {
								ref: g,
								className: kl.image,
								src: e.art.graphState,
								alt: "",
								draggable: "false",
								"data-cover-image": "graph",
								style: {
									opacity: z ? 0 : e.backdrop.opacity,
									...Hl(e.backdrop.keepAbove, "below")
								}
							}),
							e.art.graphState && e.backdrop.keepAbove > 0 && /* @__PURE__ */ f("img", {
								ref: _,
								className: kl.image,
								src: e.art.graphState,
								alt: "",
								draggable: "false",
								"data-cover-image": "graph-keep",
								style: {
									opacity: +!z,
									...Hl(e.backdrop.keepAbove, "above")
								}
							}),
							/* @__PURE__ */ f(Gl, {
								title: e.title,
								size: j,
								start: F,
								refs: {
									art: w,
									graph: T
								}
							})
						]
					}), e.alt && /* @__PURE__ */ f("span", {
						className: kl.alt,
						role: "img",
						"aria-label": e.alt,
						"data-cover-alt": !0
					})]
				}),
				e.reach && /* @__PURE__ */ f("svg", {
					ref: v,
					className: kl.reach,
					"aria-hidden": "true",
					"data-cover-reach": !0,
					style: { opacity: 0 }
				})
			]
		}),
		/* @__PURE__ */ p("div", {
			ref: D,
			className: kl.section,
			"data-cover-section": !0,
			style: z ? { pointerEvents: "none" } : void 0,
			children: [n, /* @__PURE__ */ f("button", {
				ref: O,
				type: "button",
				className: kl.handle,
				"aria-label": "Show the cover",
				title: "Show the cover",
				"data-cover-handle": !0,
				tabIndex: z ? -1 : 0,
				style: {
					opacity: +!z,
					pointerEvents: z ? "none" : "auto"
				},
				onClick: () => ce("art"),
				children: /* @__PURE__ */ f("span", {
					className: kl.grip,
					"aria-hidden": "true"
				})
			})]
		}),
		e.byline.text && /* @__PURE__ */ f("a", {
			ref: E,
			className: `${kl.byline} ${e.title ? kl.bylineTitle : ""}`,
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
			children: (0, Dl.bylineText)(e.byline)
		})
	] });
}
function ql({ settings: e, viewState: t, children: n }) {
	let r = a(() => (0, Dl.openingConfig)(e), [e]);
	return r ? /* @__PURE__ */ f(Kl, {
		config: r,
		viewState: t,
		children: n
	}) : /* @__PURE__ */ f(d, { children: n });
}
//#endregion
//#region src/components/Contributions/useContributions.js
function Jl(e, t) {
	let n = JSON.stringify(e && e.contributions || null), i = a(() => (0, ys.contributionsConfig)(e), [n]), [o, s] = c(null);
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
	let l = a(() => i && o ? (0, ys.visibleContributions)(o, {
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
		layers: a(() => (0, ys.connectionEdges)(l).length ? ["readers"] : [], [l])
	};
}
//#endregion
var Yl = bs.followLink, Xl = Sc.graphFeed, Zl = bs.isLinkItem, Ql = bs.linkOf, $l = Sc.resolvePages, eu = vl.toolbarConfig, tu = Sc.topBarConfig;
export { cl as ConfigPanel, wc as FeedZ, js as GraphViewer, ql as Opening, e as React, l as ReactDOM, dc as ReaderPanel, rl as Settings, vc as TTS, Ol as Theme, El as TimeOfDay, ml as TimeOverlay, xl as Toolbar, Yl as followLink, Xl as graphFeed, Zl as isLinkItem, Ql as linkOf, $l as resolvePages, eu as toolbarConfig, tu as topBarConfig, Jl as useContributions };
