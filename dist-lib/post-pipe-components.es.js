import * as e from "react";
import t, { useCallback as n, useEffect as r, useMemo as i, useRef as a, useState as o } from "react";
import * as s from "react-dom/client";
import { createRoot as c } from "react-dom/client";
import { Fragment as l, jsx as u, jsxs as d } from "react/jsx-runtime";
//#region \0rolldown/runtime.js
var f = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports);
//#endregion
//#region node_modules/d3-array/src/mean.js
function p(e, t) {
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
var m = { value: () => {} };
function h() {
	for (var e = 0, t = arguments.length, n = {}, r; e < t; ++e) {
		if (!(r = arguments[e] + "") || r in n || /[\s.]/.test(r)) throw Error("illegal type: " + r);
		n[r] = [];
	}
	return new g(n);
}
function g(e) {
	this._ = e;
}
function _(e, t) {
	return e.trim().split(/^|\s+/).map(function(e) {
		var n = "", r = e.indexOf(".");
		if (r >= 0 && (n = e.slice(r + 1), e = e.slice(0, r)), e && !t.hasOwnProperty(e)) throw Error("unknown type: " + e);
		return {
			type: e,
			name: n
		};
	});
}
g.prototype = h.prototype = {
	constructor: g,
	on: function(e, t) {
		var n = this._, r = _(e + "", n), i, a = -1, o = r.length;
		if (arguments.length < 2) {
			for (; ++a < o;) if ((i = (e = r[a]).type) && (i = v(n[i], e.name))) return i;
			return;
		}
		if (t != null && typeof t != "function") throw Error("invalid callback: " + t);
		for (; ++a < o;) if (i = (e = r[a]).type) n[i] = y(n[i], e.name, t);
		else if (t == null) for (i in n) n[i] = y(n[i], e.name, null);
		return this;
	},
	copy: function() {
		var e = {}, t = this._;
		for (var n in t) e[n] = t[n].slice();
		return new g(e);
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
function v(e, t) {
	for (var n = 0, r = e.length, i; n < r; ++n) if ((i = e[n]).name === t) return i.value;
}
function y(e, t, n) {
	for (var r = 0, i = e.length; r < i; ++r) if (e[r].name === t) {
		e[r] = m, e = e.slice(0, r).concat(e.slice(r + 1));
		break;
	}
	return n != null && e.push({
		name: t,
		value: n
	}), e;
}
var b = {
	svg: "http://www.w3.org/2000/svg",
	xhtml: "http://www.w3.org/1999/xhtml",
	xlink: "http://www.w3.org/1999/xlink",
	xml: "http://www.w3.org/XML/1998/namespace",
	xmlns: "http://www.w3.org/2000/xmlns/"
};
//#endregion
//#region node_modules/d3-selection/src/namespace.js
function x(e) {
	var t = e += "", n = t.indexOf(":");
	return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), b.hasOwnProperty(t) ? {
		space: b[t],
		local: e
	} : e;
}
//#endregion
//#region node_modules/d3-selection/src/creator.js
function S(e) {
	return function() {
		var t = this.ownerDocument, n = this.namespaceURI;
		return n === "http://www.w3.org/1999/xhtml" && t.documentElement.namespaceURI === "http://www.w3.org/1999/xhtml" ? t.createElement(e) : t.createElementNS(n, e);
	};
}
function C(e) {
	return function() {
		return this.ownerDocument.createElementNS(e.space, e.local);
	};
}
function w(e) {
	var t = x(e);
	return (t.local ? C : S)(t);
}
//#endregion
//#region node_modules/d3-selection/src/selector.js
function T() {}
function E(e) {
	return e == null ? T : function() {
		return this.querySelector(e);
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/select.js
function D(e) {
	typeof e != "function" && (e = E(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = Array(o), c, l, u = 0; u < o; ++u) (c = a[u]) && (l = e.call(c, c.__data__, u, a)) && ("__data__" in c && (l.__data__ = c.__data__), s[u] = l);
	return new z(r, this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/array.js
function O(e) {
	return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
//#endregion
//#region node_modules/d3-selection/src/selectorAll.js
function k() {
	return [];
}
function A(e) {
	return e == null ? k : function() {
		return this.querySelectorAll(e);
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/selectAll.js
function ee(e) {
	return function() {
		return O(e.apply(this, arguments));
	};
}
function j(e) {
	e = typeof e == "function" ? ee(e) : A(e);
	for (var t = this._groups, n = t.length, r = [], i = [], a = 0; a < n; ++a) for (var o = t[a], s = o.length, c, l = 0; l < s; ++l) (c = o[l]) && (r.push(e.call(c, c.__data__, l, o)), i.push(c));
	return new z(r, i);
}
//#endregion
//#region node_modules/d3-selection/src/matcher.js
function M(e) {
	return function() {
		return this.matches(e);
	};
}
function N(e) {
	return function(t) {
		return t.matches(e);
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/selectChild.js
var te = Array.prototype.find;
function ne(e) {
	return function() {
		return te.call(this.children, e);
	};
}
function re() {
	return this.firstElementChild;
}
function ie(e) {
	return this.select(e == null ? re : ne(typeof e == "function" ? e : N(e)));
}
//#endregion
//#region node_modules/d3-selection/src/selection/selectChildren.js
var ae = Array.prototype.filter;
function oe() {
	return Array.from(this.children);
}
function se(e) {
	return function() {
		return ae.call(this.children, e);
	};
}
function ce(e) {
	return this.selectAll(e == null ? oe : se(typeof e == "function" ? e : N(e)));
}
//#endregion
//#region node_modules/d3-selection/src/selection/filter.js
function le(e) {
	typeof e != "function" && (e = M(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = [], c, l = 0; l < o; ++l) (c = a[l]) && e.call(c, c.__data__, l, a) && s.push(c);
	return new z(r, this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/selection/sparse.js
function P(e) {
	return Array(e.length);
}
//#endregion
//#region node_modules/d3-selection/src/selection/enter.js
function ue() {
	return new z(this._enter || this._groups.map(P), this._parents);
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
function F(e) {
	return function() {
		return e;
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/data.js
function fe(e, t, n, r, i, a) {
	for (var o = 0, s, c = t.length, l = a.length; o < l; ++o) (s = t[o]) ? (s.__data__ = a[o], r[o] = s) : n[o] = new de(e, a[o]);
	for (; o < c; ++o) (s = t[o]) && (i[o] = s);
}
function pe(e, t, n, r, i, a, o) {
	var s, c, l = /* @__PURE__ */ new Map(), u = t.length, d = a.length, f = Array(u), p;
	for (s = 0; s < u; ++s) (c = t[s]) && (f[s] = p = o.call(c, c.__data__, s, t) + "", l.has(p) ? i[s] = c : l.set(p, c));
	for (s = 0; s < d; ++s) p = o.call(e, a[s], s, a) + "", (c = l.get(p)) ? (r[s] = c, c.__data__ = a[s], l.delete(p)) : n[s] = new de(e, a[s]);
	for (s = 0; s < u; ++s) (c = t[s]) && l.get(f[s]) === c && (i[s] = c);
}
function me(e) {
	return e.__data__;
}
function he(e, t) {
	if (!arguments.length) return Array.from(this, me);
	var n = t ? pe : fe, r = this._parents, i = this._groups;
	typeof e != "function" && (e = F(e));
	for (var a = i.length, o = Array(a), s = Array(a), c = Array(a), l = 0; l < a; ++l) {
		var u = r[l], d = i[l], f = d.length, p = ge(e.call(u, u && u.__data__, l, r)), m = p.length, h = s[l] = Array(m), g = o[l] = Array(m);
		n(u, d, h, g, c[l] = Array(f), p, t);
		for (var _ = 0, v = 0, y, b; _ < m; ++_) if (y = h[_]) {
			for (_ >= v && (v = _ + 1); !(b = g[v]) && ++v < m;);
			y._next = b || null;
		}
	}
	return o = new z(o, r), o._enter = s, o._exit = c, o;
}
function ge(e) {
	return typeof e == "object" && "length" in e ? e : Array.from(e);
}
//#endregion
//#region node_modules/d3-selection/src/selection/exit.js
function _e() {
	return new z(this._exit || this._groups.map(P), this._parents);
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
	return new z(s, this._parents);
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
	return new z(i, this._parents).order();
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
function I(e) {
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
	var n = x(e);
	if (arguments.length < 2) {
		var r = this.node();
		return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
	}
	return this.each((t == null ? n.local ? ke : Oe : typeof t == "function" ? n.local ? Ne : Me : n.local ? je : Ae)(n, t));
}
//#endregion
//#region node_modules/d3-selection/src/window.js
function L(e) {
	return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
//#endregion
//#region node_modules/d3-selection/src/selection/style.js
function Fe(e) {
	return function() {
		this.style.removeProperty(e);
	};
}
function R(e, t, n) {
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
	return arguments.length > 1 ? this.each((t == null ? Fe : typeof t == "function" ? Ie : R)(e, t, n ?? "")) : Re(this.node(), e);
}
function Re(e, t) {
	return e.style.getPropertyValue(t) || L(e).getComputedStyle(e, null).getPropertyValue(t);
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
	var t = typeof e == "function" ? e : w(e);
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
	var n = typeof e == "function" ? e : w(e), r = t == null ? dt : typeof t == "function" ? t : E(t);
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
	var r = L(e), i = r.CustomEvent;
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
function z(e, t) {
	this._groups = e, this._parents = t;
}
function At() {
	return new z([[document.documentElement]], kt);
}
function jt() {
	return this;
}
z.prototype = At.prototype = {
	constructor: z,
	select: D,
	selectAll: j,
	selectChild: ie,
	selectChildren: ce,
	filter: le,
	data: he,
	enter: ue,
	exit: _e,
	join: ve,
	merge: ye,
	selection: jt,
	order: be,
	sort: xe,
	call: Ce,
	nodes: we,
	node: Te,
	size: Ee,
	empty: De,
	each: I,
	attr: Pe,
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
function B(e) {
	return typeof e == "string" ? new z([[document.querySelector(e)]], [document.documentElement]) : new z([[e]], kt);
}
//#endregion
//#region node_modules/d3-selection/src/sourceEvent.js
function Mt(e) {
	let t;
	for (; t = e.sourceEvent;) e = t;
	return e;
}
//#endregion
//#region node_modules/d3-selection/src/pointer.js
function Nt(e, t) {
	if (e = Mt(e), t === void 0 && (t = e.currentTarget), t) {
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
	var t = e.document.documentElement, n = B(e).on("dragstart.drag", Lt, Ft);
	"onselectstart" in t ? n.on("selectstart.drag", Lt, Ft) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function zt(e, t) {
	var n = e.document.documentElement, r = B(e).on("dragstart.drag", null);
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
	var e = Ht, t = Ut, n = Wt, r = Gt, i = {}, a = h("start", "drag", "end"), o = 0, s, c, l, u, d = 0;
	function f(e) {
		e.on("mousedown.drag", p).filter(r).on("touchstart.drag", _).on("touchmove.drag", v, Pt).on("touchend.drag touchcancel.drag", y).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	}
	function p(n, r) {
		if (!(u || !e.call(this, n, r))) {
			var i = b(this, t.call(this, n, r), n, r, "mouse");
			i && (B(n.view).on("mousemove.drag", m, Ft).on("mouseup.drag", g, Ft), Rt(n.view), It(n), l = !1, s = n.clientX, c = n.clientY, i("start", n));
		}
	}
	function m(e) {
		if (Lt(e), !l) {
			var t = e.clientX - s, n = e.clientY - c;
			l = t * t + n * n > d;
		}
		i.mouse("drag", e);
	}
	function g(e) {
		B(e.view).on("mousemove.drag mouseup.drag", null), zt(e.view, l), Lt(e), i.mouse("end", e);
	}
	function _(n, r) {
		if (e.call(this, n, r)) {
			var i = n.changedTouches, a = t.call(this, n, r), o = i.length, s, c;
			for (s = 0; s < o; ++s) (c = b(this, a, n, r, i[s].identifier, i[s])) && (It(n), c("start", n, i[s]));
		}
	}
	function v(e) {
		var t = e.changedTouches, n = t.length, r, a;
		for (r = 0; r < n; ++r) (a = i[t[r].identifier]) && (Lt(e), a("drag", e, t[r]));
	}
	function y(e) {
		var t = e.changedTouches, n = t.length, r, a;
		for (u && clearTimeout(u), u = setTimeout(function() {
			u = null;
		}, 500), r = 0; r < n; ++r) (a = i[t[r].identifier]) && (It(e), a("end", e, t[r]));
	}
	function b(e, t, r, s, c, l) {
		var u = a.copy(), d = Nt(l || r, t), p, m, h;
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
					d = Nt(l || a, t), _ = o;
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
	return En(this).formatHsl();
}
function pn() {
	return this.rgb().formatRgb();
}
function mn(e) {
	var t, n;
	return e = (e + "").trim().toLowerCase(), (t = tn.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? hn(t) : n === 3 ? new V(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? gn(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? gn(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = nn.exec(e)) ? new V(t[1], t[2], t[3], 1) : (t = rn.exec(e)) ? new V(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = an.exec(e)) ? gn(t[1], t[2], t[3], t[4]) : (t = on.exec(e)) ? gn(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = sn.exec(e)) ? Tn(t[1], t[2] / 100, t[3] / 100, 1) : (t = cn.exec(e)) ? Tn(t[1], t[2] / 100, t[3] / 100, t[4]) : ln.hasOwnProperty(e) ? hn(ln[e]) : e === "transparent" ? new V(NaN, NaN, NaN, 0) : null;
}
function hn(e) {
	return new V(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function gn(e, t, n, r) {
	return r <= 0 && (e = t = n = NaN), new V(e, t, n, r);
}
function _n(e) {
	return e instanceof Yt || (e = mn(e)), e ? (e = e.rgb(), new V(e.r, e.g, e.b, e.opacity)) : new V();
}
function vn(e, t, n, r) {
	return arguments.length === 1 ? _n(e) : new V(e, t, n, r ?? 1);
}
function V(e, t, n, r) {
	this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
qt(V, vn, Jt(Yt, {
	brighter(e) {
		return e = e == null ? Zt : Zt ** +e, new V(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? Xt : Xt ** +e, new V(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	rgb() {
		return this;
	},
	clamp() {
		return new V(Cn(this.r), Cn(this.g), Cn(this.b), Sn(this.opacity));
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
	return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new H(e, t, n, r);
}
function En(e) {
	if (e instanceof H) return new H(e.h, e.s, e.l, e.opacity);
	if (e instanceof Yt || (e = mn(e)), !e) return new H();
	if (e instanceof H) return e;
	e = e.rgb();
	var t = e.r / 255, n = e.g / 255, r = e.b / 255, i = Math.min(t, n, r), a = Math.max(t, n, r), o = NaN, s = a - i, c = (a + i) / 2;
	return s ? (o = t === a ? (n - r) / s + (n < r) * 6 : n === a ? (r - t) / s + 2 : (t - n) / s + 4, s /= c < .5 ? a + i : 2 - a - i, o *= 60) : s = c > 0 && c < 1 ? 0 : o, new H(o, s, c, e.opacity);
}
function Dn(e, t, n, r) {
	return arguments.length === 1 ? En(e) : new H(e, t, n, r ?? 1);
}
function H(e, t, n, r) {
	this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
qt(H, Dn, Jt(Yt, {
	brighter(e) {
		return e = e == null ? Zt : Zt ** +e, new H(this.h, this.s, this.l * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? Xt : Xt ** +e, new H(this.h, this.s, this.l * e, this.opacity);
	},
	rgb() {
		var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < .5 ? n : 1 - n) * t, i = 2 * n - r;
		return new V(An(e >= 240 ? e - 240 : e + 120, i, r), An(e, i, r), An(e < 120 ? e + 240 : e - 120, i, r), this.opacity);
	},
	clamp() {
		return new H(On(this.h), kn(this.s), kn(this.l), Sn(this.opacity));
	},
	displayable() {
		return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
	},
	formatHsl() {
		let e = Sn(this.opacity);
		return `${e === 1 ? "hsl(" : "hsla("}${On(this.h)}, ${kn(this.s) * 100}%, ${kn(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
	}
}));
function On(e) {
	return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function kn(e) {
	return Math.max(0, Math.min(1, e || 0));
}
function An(e, t, n) {
	return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
//#endregion
//#region node_modules/d3-interpolate/src/constant.js
var jn = (e) => () => e;
//#endregion
//#region node_modules/d3-interpolate/src/color.js
function Mn(e, t) {
	return function(n) {
		return e + n * t;
	};
}
function Nn(e, t, n) {
	return e **= +n, t = t ** +n - e, n = 1 / n, function(r) {
		return (e + r * t) ** +n;
	};
}
function Pn(e) {
	return (e = +e) == 1 ? Fn : function(t, n) {
		return n - t ? Nn(t, n, e) : jn(isNaN(t) ? n : t);
	};
}
function Fn(e, t) {
	var n = t - e;
	return n ? Mn(e, n) : jn(isNaN(e) ? t : e);
}
//#endregion
//#region node_modules/d3-interpolate/src/rgb.js
var In = (function e(t) {
	var n = Pn(t);
	function r(e, t) {
		var r = n((e = vn(e)).r, (t = vn(t)).r), i = n(e.g, t.g), a = n(e.b, t.b), o = Fn(e.opacity, t.opacity);
		return function(t) {
			return e.r = r(t), e.g = i(t), e.b = a(t), e.opacity = o(t), e + "";
		};
	}
	return r.gamma = e, r;
})(1);
//#endregion
//#region node_modules/d3-interpolate/src/number.js
function Ln(e, t) {
	return e = +e, t = +t, function(n) {
		return e * (1 - n) + t * n;
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/string.js
var Rn = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, zn = new RegExp(Rn.source, "g");
function Bn(e) {
	return function() {
		return e;
	};
}
function Vn(e) {
	return function(t) {
		return e(t) + "";
	};
}
function Hn(e, t) {
	var n = Rn.lastIndex = zn.lastIndex = 0, r, i, a, o = -1, s = [], c = [];
	for (e += "", t += ""; (r = Rn.exec(e)) && (i = zn.exec(t));) (a = i.index) > n && (a = t.slice(n, a), s[o] ? s[o] += a : s[++o] = a), (r = r[0]) === (i = i[0]) ? s[o] ? s[o] += i : s[++o] = i : (s[++o] = null, c.push({
		i: o,
		x: Ln(r, i)
	})), n = zn.lastIndex;
	return n < t.length && (a = t.slice(n), s[o] ? s[o] += a : s[++o] = a), s.length < 2 ? c[0] ? Vn(c[0].x) : Bn(t) : (t = c.length, function(e) {
		for (var n = 0, r; n < t; ++n) s[(r = c[n]).i] = r.x(e);
		return s.join("");
	});
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/decompose.js
var Un = 180 / Math.PI, Wn = {
	translateX: 0,
	translateY: 0,
	rotate: 0,
	skewX: 0,
	scaleX: 1,
	scaleY: 1
};
function Gn(e, t, n, r, i, a) {
	var o, s, c;
	return (o = Math.sqrt(e * e + t * t)) && (e /= o, t /= o), (c = e * n + t * r) && (n -= e * c, r -= t * c), (s = Math.sqrt(n * n + r * r)) && (n /= s, r /= s, c /= s), e * r < t * n && (e = -e, t = -t, c = -c, o = -o), {
		translateX: i,
		translateY: a,
		rotate: Math.atan2(t, e) * Un,
		skewX: Math.atan(c) * Un,
		scaleX: o,
		scaleY: s
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/parse.js
var Kn;
function qn(e) {
	let t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
	return t.isIdentity ? Wn : Gn(t.a, t.b, t.c, t.d, t.e, t.f);
}
function Jn(e) {
	return e == null || (Kn ||= document.createElementNS("http://www.w3.org/2000/svg", "g"), Kn.setAttribute("transform", e), !(e = Kn.transform.baseVal.consolidate())) ? Wn : (e = e.matrix, Gn(e.a, e.b, e.c, e.d, e.e, e.f));
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/index.js
function Yn(e, t, n, r) {
	function i(e) {
		return e.length ? e.pop() + " " : "";
	}
	function a(e, r, i, a, o, s) {
		if (e !== i || r !== a) {
			var c = o.push("translate(", null, t, null, n);
			s.push({
				i: c - 4,
				x: Ln(e, i)
			}, {
				i: c - 2,
				x: Ln(r, a)
			});
		} else (i || a) && o.push("translate(" + i + t + a + n);
	}
	function o(e, t, n, a) {
		e === t ? t && n.push(i(n) + "rotate(" + t + r) : (e - t > 180 ? t += 360 : t - e > 180 && (e += 360), a.push({
			i: n.push(i(n) + "rotate(", null, r) - 2,
			x: Ln(e, t)
		}));
	}
	function s(e, t, n, a) {
		e === t ? t && n.push(i(n) + "skewX(" + t + r) : a.push({
			i: n.push(i(n) + "skewX(", null, r) - 2,
			x: Ln(e, t)
		});
	}
	function c(e, t, n, r, a, o) {
		if (e !== n || t !== r) {
			var s = a.push(i(a) + "scale(", null, ",", null, ")");
			o.push({
				i: s - 4,
				x: Ln(e, n)
			}, {
				i: s - 2,
				x: Ln(t, r)
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
var Xn = Yn(qn, "px, ", "px)", "deg)"), Zn = Yn(Jn, ", ", ")", ")"), Qn = 1e-12;
function $n(e) {
	return ((e = Math.exp(e)) + 1 / e) / 2;
}
function er(e) {
	return ((e = Math.exp(e)) - 1 / e) / 2;
}
function tr(e) {
	return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
var nr = (function e(t, n, r) {
	function i(e, i) {
		var a = e[0], o = e[1], s = e[2], c = i[0], l = i[1], u = i[2], d = c - a, f = l - o, p = d * d + f * f, m, h;
		if (p < Qn) h = Math.log(u / s) / t, m = function(e) {
			return [
				a + e * d,
				o + e * f,
				s * Math.exp(t * e * h)
			];
		};
		else {
			var g = Math.sqrt(p), _ = (u * u - s * s + r * p) / (2 * s * n * g), v = (u * u - s * s - r * p) / (2 * u * n * g), y = Math.log(Math.sqrt(_ * _ + 1) - _);
			h = (Math.log(Math.sqrt(v * v + 1) - v) - y) / t, m = function(e) {
				var r = e * h, i = $n(y), c = s / (n * g) * (i * tr(t * r + y) - er(y));
				return [
					a + c * d,
					o + c * f,
					s * i / $n(t * r + y)
				];
			};
		}
		return m.duration = h * 1e3 * t / Math.SQRT2, m;
	}
	return i.rho = function(t) {
		var n = Math.max(.001, +t), r = n * n;
		return e(n, r, r * r);
	}, i;
})(Math.SQRT2, 2, 4), rr = 0, ir = 0, ar = 0, or = 1e3, sr, cr, lr = 0, ur = 0, dr = 0, fr = typeof performance == "object" && performance.now ? performance : Date, pr = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
	setTimeout(e, 17);
};
function mr() {
	return ur ||= (pr(hr), fr.now() + dr);
}
function hr() {
	ur = 0;
}
function gr() {
	this._call = this._time = this._next = null;
}
gr.prototype = _r.prototype = {
	constructor: gr,
	restart: function(e, t, n) {
		if (typeof e != "function") throw TypeError("callback is not a function");
		n = (n == null ? mr() : +n) + (t == null ? 0 : +t), !this._next && cr !== this && (cr ? cr._next = this : sr = this, cr = this), this._call = e, this._time = n, Sr();
	},
	stop: function() {
		this._call && (this._call = null, this._time = Infinity, Sr());
	}
};
function _r(e, t, n) {
	var r = new gr();
	return r.restart(e, t, n), r;
}
function vr() {
	mr(), ++rr;
	for (var e = sr, t; e;) (t = ur - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
	--rr;
}
function yr() {
	ur = (lr = fr.now()) + dr, rr = ir = 0;
	try {
		vr();
	} finally {
		rr = 0, xr(), ur = 0;
	}
}
function br() {
	var e = fr.now(), t = e - lr;
	t > or && (dr -= t, lr = e);
}
function xr() {
	for (var e, t = sr, n, r = Infinity; t;) t._call ? (r > t._time && (r = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : sr = n);
	cr = e, Sr(r);
}
function Sr(e) {
	rr || (ir &&= clearTimeout(ir), e - ur > 24 ? (e < Infinity && (ir = setTimeout(yr, e - fr.now() - dr)), ar &&= clearInterval(ar)) : (ar ||= (lr = fr.now(), setInterval(br, or)), rr = 1, pr(yr)));
}
//#endregion
//#region node_modules/d3-timer/src/timeout.js
function Cr(e, t, n) {
	var r = new gr();
	return t = t == null ? 0 : +t, r.restart((n) => {
		r.stop(), e(n + t);
	}, t, n), r;
}
//#endregion
//#region node_modules/d3-transition/src/transition/schedule.js
var wr = h("start", "end", "cancel", "interrupt"), Tr = [];
function Er(e, t, n, r, i, a) {
	var o = e.__transition;
	if (!o) e.__transition = {};
	else if (n in o) return;
	Ar(e, n, {
		name: t,
		index: r,
		group: i,
		on: wr,
		tween: Tr,
		time: a.time,
		delay: a.delay,
		duration: a.duration,
		ease: a.ease,
		timer: null,
		state: 0
	});
}
function Dr(e, t) {
	var n = kr(e, t);
	if (n.state > 0) throw Error("too late; already scheduled");
	return n;
}
function Or(e, t) {
	var n = kr(e, t);
	if (n.state > 3) throw Error("too late; already running");
	return n;
}
function kr(e, t) {
	var n = e.__transition;
	if (!n || !(n = n[t])) throw Error("transition not found");
	return n;
}
function Ar(e, t, n) {
	var r = e.__transition, i;
	r[t] = n, n.timer = _r(a, 0, n.time);
	function a(e) {
		n.state = 1, n.timer.restart(o, n.delay, n.time), n.delay <= e && o(e - n.delay);
	}
	function o(a) {
		var l, u, d, f;
		if (n.state !== 1) return c();
		for (l in r) if (f = r[l], f.name === n.name) {
			if (f.state === 3) return Cr(o);
			f.state === 4 ? (f.state = 6, f.timer.stop(), f.on.call("interrupt", e, e.__data__, f.index, f.group), delete r[l]) : +l < t && (f.state = 6, f.timer.stop(), f.on.call("cancel", e, e.__data__, f.index, f.group), delete r[l]);
		}
		if (Cr(function() {
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
function jr(e, t) {
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
function Mr(e) {
	return this.each(function() {
		jr(this, e);
	});
}
//#endregion
//#region node_modules/d3-transition/src/transition/tween.js
function Nr(e, t) {
	var n, r;
	return function() {
		var i = Or(this, e), a = i.tween;
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
function Pr(e, t, n) {
	var r, i;
	if (typeof n != "function") throw Error();
	return function() {
		var a = Or(this, e), o = a.tween;
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
function Fr(e, t) {
	var n = this._id;
	if (e += "", arguments.length < 2) {
		for (var r = kr(this.node(), n).tween, i = 0, a = r.length, o; i < a; ++i) if ((o = r[i]).name === e) return o.value;
		return null;
	}
	return this.each((t == null ? Nr : Pr)(n, e, t));
}
function Ir(e, t, n) {
	var r = e._id;
	return e.each(function() {
		var e = Or(this, r);
		(e.value ||= {})[t] = n.apply(this, arguments);
	}), function(e) {
		return kr(e, r).value[t];
	};
}
//#endregion
//#region node_modules/d3-transition/src/transition/interpolate.js
function Lr(e, t) {
	var n;
	return (typeof t == "number" ? Ln : t instanceof mn ? In : (n = mn(t)) ? (t = n, In) : Hn)(e, t);
}
//#endregion
//#region node_modules/d3-transition/src/transition/attr.js
function Rr(e) {
	return function() {
		this.removeAttribute(e);
	};
}
function zr(e) {
	return function() {
		this.removeAttributeNS(e.space, e.local);
	};
}
function Br(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = this.getAttribute(e);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function Vr(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = this.getAttributeNS(e.space, e.local);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function Hr(e, t, n) {
	var r, i, a;
	return function() {
		var o, s = n(this), c;
		return s == null ? void this.removeAttribute(e) : (o = this.getAttribute(e), c = s + "", o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s)));
	};
}
function Ur(e, t, n) {
	var r, i, a;
	return function() {
		var o, s = n(this), c;
		return s == null ? void this.removeAttributeNS(e.space, e.local) : (o = this.getAttributeNS(e.space, e.local), c = s + "", o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s)));
	};
}
function Wr(e, t) {
	var n = x(e), r = n === "transform" ? Zn : Lr;
	return this.attrTween(e, typeof t == "function" ? (n.local ? Ur : Hr)(n, r, Ir(this, "attr." + e, t)) : t == null ? (n.local ? zr : Rr)(n) : (n.local ? Vr : Br)(n, r, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/attrTween.js
function Gr(e, t) {
	return function(n) {
		this.setAttribute(e, t.call(this, n));
	};
}
function Kr(e, t) {
	return function(n) {
		this.setAttributeNS(e.space, e.local, t.call(this, n));
	};
}
function qr(e, t) {
	var n, r;
	function i() {
		var i = t.apply(this, arguments);
		return i !== r && (n = (r = i) && Kr(e, i)), n;
	}
	return i._value = t, i;
}
function Jr(e, t) {
	var n, r;
	function i() {
		var i = t.apply(this, arguments);
		return i !== r && (n = (r = i) && Gr(e, i)), n;
	}
	return i._value = t, i;
}
function Yr(e, t) {
	var n = "attr." + e;
	if (arguments.length < 2) return (n = this.tween(n)) && n._value;
	if (t == null) return this.tween(n, null);
	if (typeof t != "function") throw Error();
	var r = x(e);
	return this.tween(n, (r.local ? qr : Jr)(r, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/delay.js
function Xr(e, t) {
	return function() {
		Dr(this, e).delay = +t.apply(this, arguments);
	};
}
function Zr(e, t) {
	return t = +t, function() {
		Dr(this, e).delay = t;
	};
}
function Qr(e) {
	var t = this._id;
	return arguments.length ? this.each((typeof e == "function" ? Xr : Zr)(t, e)) : kr(this.node(), t).delay;
}
//#endregion
//#region node_modules/d3-transition/src/transition/duration.js
function $r(e, t) {
	return function() {
		Or(this, e).duration = +t.apply(this, arguments);
	};
}
function ei(e, t) {
	return t = +t, function() {
		Or(this, e).duration = t;
	};
}
function ti(e) {
	var t = this._id;
	return arguments.length ? this.each((typeof e == "function" ? $r : ei)(t, e)) : kr(this.node(), t).duration;
}
//#endregion
//#region node_modules/d3-transition/src/transition/ease.js
function ni(e, t) {
	if (typeof t != "function") throw Error();
	return function() {
		Or(this, e).ease = t;
	};
}
function ri(e) {
	var t = this._id;
	return arguments.length ? this.each(ni(t, e)) : kr(this.node(), t).ease;
}
//#endregion
//#region node_modules/d3-transition/src/transition/easeVarying.js
function ii(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		if (typeof n != "function") throw Error();
		Or(this, e).ease = n;
	};
}
function ai(e) {
	if (typeof e != "function") throw Error();
	return this.each(ii(this._id, e));
}
//#endregion
//#region node_modules/d3-transition/src/transition/filter.js
function oi(e) {
	typeof e != "function" && (e = M(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = [], c, l = 0; l < o; ++l) (c = a[l]) && e.call(c, c.__data__, l, a) && s.push(c);
	return new Fi(r, this._parents, this._name, this._id);
}
//#endregion
//#region node_modules/d3-transition/src/transition/merge.js
function si(e) {
	if (e._id !== this._id) throw Error();
	for (var t = this._groups, n = e._groups, r = t.length, i = n.length, a = Math.min(r, i), o = Array(r), s = 0; s < a; ++s) for (var c = t[s], l = n[s], u = c.length, d = o[s] = Array(u), f, p = 0; p < u; ++p) (f = c[p] || l[p]) && (d[p] = f);
	for (; s < r; ++s) o[s] = t[s];
	return new Fi(o, this._parents, this._name, this._id);
}
//#endregion
//#region node_modules/d3-transition/src/transition/on.js
function ci(e) {
	return (e + "").trim().split(/^|\s+/).every(function(e) {
		var t = e.indexOf(".");
		return t >= 0 && (e = e.slice(0, t)), !e || e === "start";
	});
}
function li(e, t, n) {
	var r, i, a = ci(t) ? Dr : Or;
	return function() {
		var o = a(this, e), s = o.on;
		s !== r && (i = (r = s).copy()).on(t, n), o.on = i;
	};
}
function ui(e, t) {
	var n = this._id;
	return arguments.length < 2 ? kr(this.node(), n).on.on(e) : this.each(li(n, e, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/remove.js
function di(e) {
	return function() {
		var t = this.parentNode;
		for (var n in this.__transition) if (+n !== e) return;
		t && t.removeChild(this);
	};
}
function fi() {
	return this.on("end.remove", di(this._id));
}
//#endregion
//#region node_modules/d3-transition/src/transition/select.js
function pi(e) {
	var t = this._name, n = this._id;
	typeof e != "function" && (e = E(e));
	for (var r = this._groups, i = r.length, a = Array(i), o = 0; o < i; ++o) for (var s = r[o], c = s.length, l = a[o] = Array(c), u, d, f = 0; f < c; ++f) (u = s[f]) && (d = e.call(u, u.__data__, f, s)) && ("__data__" in u && (d.__data__ = u.__data__), l[f] = d, Er(l[f], t, n, f, l, kr(u, n)));
	return new Fi(a, this._parents, t, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/selectAll.js
function mi(e) {
	var t = this._name, n = this._id;
	typeof e != "function" && (e = A(e));
	for (var r = this._groups, i = r.length, a = [], o = [], s = 0; s < i; ++s) for (var c = r[s], l = c.length, u, d = 0; d < l; ++d) if (u = c[d]) {
		for (var f = e.call(u, u.__data__, d, c), p, m = kr(u, n), h = 0, g = f.length; h < g; ++h) (p = f[h]) && Er(p, t, n, h, f, m);
		a.push(f), o.push(u);
	}
	return new Fi(a, o, t, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/selection.js
var hi = At.prototype.constructor;
function gi() {
	return new hi(this._groups, this._parents);
}
//#endregion
//#region node_modules/d3-transition/src/transition/style.js
function _i(e, t) {
	var n, r, i;
	return function() {
		var a = Re(this, e), o = (this.style.removeProperty(e), Re(this, e));
		return a === o ? null : a === n && o === r ? i : i = t(n = a, r = o);
	};
}
function vi(e) {
	return function() {
		this.style.removeProperty(e);
	};
}
function yi(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = Re(this, e);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function bi(e, t, n) {
	var r, i, a;
	return function() {
		var o = Re(this, e), s = n(this), c = s + "";
		return s ?? (c = s = (this.style.removeProperty(e), Re(this, e))), o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s));
	};
}
function xi(e, t) {
	var n, r, i, a = "style." + t, o = "end." + a, s;
	return function() {
		var c = Or(this, e), l = c.on, u = c.value[a] == null ? s ||= vi(t) : void 0;
		(l !== n || i !== u) && (r = (n = l).copy()).on(o, i = u), c.on = r;
	};
}
function Si(e, t, n) {
	var r = (e += "") == "transform" ? Xn : Lr;
	return t == null ? this.styleTween(e, _i(e, r)).on("end.style." + e, vi(e)) : typeof t == "function" ? this.styleTween(e, bi(e, r, Ir(this, "style." + e, t))).each(xi(this._id, e)) : this.styleTween(e, yi(e, r, t), n).on("end.style." + e, null);
}
//#endregion
//#region node_modules/d3-transition/src/transition/styleTween.js
function Ci(e, t, n) {
	return function(r) {
		this.style.setProperty(e, t.call(this, r), n);
	};
}
function wi(e, t, n) {
	var r, i;
	function a() {
		var a = t.apply(this, arguments);
		return a !== i && (r = (i = a) && Ci(e, a, n)), r;
	}
	return a._value = t, a;
}
function Ti(e, t, n) {
	var r = "style." + (e += "");
	if (arguments.length < 2) return (r = this.tween(r)) && r._value;
	if (t == null) return this.tween(r, null);
	if (typeof t != "function") throw Error();
	return this.tween(r, wi(e, t, n ?? ""));
}
//#endregion
//#region node_modules/d3-transition/src/transition/text.js
function Ei(e) {
	return function() {
		this.textContent = e;
	};
}
function Di(e) {
	return function() {
		var t = e(this);
		this.textContent = t ?? "";
	};
}
function Oi(e) {
	return this.tween("text", typeof e == "function" ? Di(Ir(this, "text", e)) : Ei(e == null ? "" : e + ""));
}
//#endregion
//#region node_modules/d3-transition/src/transition/textTween.js
function ki(e) {
	return function(t) {
		this.textContent = e.call(this, t);
	};
}
function Ai(e) {
	var t, n;
	function r() {
		var r = e.apply(this, arguments);
		return r !== n && (t = (n = r) && ki(r)), t;
	}
	return r._value = e, r;
}
function ji(e) {
	var t = "text";
	if (arguments.length < 1) return (t = this.tween(t)) && t._value;
	if (e == null) return this.tween(t, null);
	if (typeof e != "function") throw Error();
	return this.tween(t, Ai(e));
}
//#endregion
//#region node_modules/d3-transition/src/transition/transition.js
function Mi() {
	for (var e = this._name, t = this._id, n = Li(), r = this._groups, i = r.length, a = 0; a < i; ++a) for (var o = r[a], s = o.length, c, l = 0; l < s; ++l) if (c = o[l]) {
		var u = kr(c, t);
		Er(c, e, n, l, o, {
			time: u.time + u.delay + u.duration,
			delay: 0,
			duration: u.duration,
			ease: u.ease
		});
	}
	return new Fi(r, this._parents, e, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/end.js
function Ni() {
	var e, t, n = this, r = n._id, i = n.size();
	return new Promise(function(a, o) {
		var s = { value: o }, c = { value: function() {
			--i === 0 && a();
		} };
		n.each(function() {
			var n = Or(this, r), i = n.on;
			i !== e && (t = (e = i).copy(), t._.cancel.push(s), t._.interrupt.push(s), t._.end.push(c)), n.on = t;
		}), i === 0 && a();
	});
}
//#endregion
//#region node_modules/d3-transition/src/transition/index.js
var Pi = 0;
function Fi(e, t, n, r) {
	this._groups = e, this._parents = t, this._name = n, this._id = r;
}
function Ii(e) {
	return At().transition(e);
}
function Li() {
	return ++Pi;
}
var Ri = At.prototype;
Fi.prototype = Ii.prototype = {
	constructor: Fi,
	select: pi,
	selectAll: mi,
	selectChild: Ri.selectChild,
	selectChildren: Ri.selectChildren,
	filter: oi,
	merge: si,
	selection: gi,
	transition: Mi,
	call: Ri.call,
	nodes: Ri.nodes,
	node: Ri.node,
	size: Ri.size,
	empty: Ri.empty,
	each: Ri.each,
	on: ui,
	attr: Wr,
	attrTween: Yr,
	style: Si,
	styleTween: Ti,
	text: Oi,
	textTween: ji,
	remove: fi,
	tween: Fr,
	delay: Qr,
	duration: ti,
	ease: ri,
	easeVarying: ai,
	end: Ni,
	[Symbol.iterator]: Ri[Symbol.iterator]
};
//#endregion
//#region node_modules/d3-ease/src/cubic.js
function zi(e) {
	return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
//#endregion
//#region node_modules/d3-transition/src/selection/transition.js
var Bi = {
	time: null,
	delay: 0,
	duration: 250,
	ease: zi
};
function Vi(e, t) {
	for (var n; !(n = e.__transition) || !(n = n[t]);) if (!(e = e.parentNode)) throw Error(`transition ${t} not found`);
	return n;
}
function Hi(e) {
	var t, n;
	e instanceof Fi ? (t = e._id, e = e._name) : (t = Li(), (n = Bi).time = mr(), e = e == null ? null : e + "");
	for (var r = this._groups, i = r.length, a = 0; a < i; ++a) for (var o = r[a], s = o.length, c, l = 0; l < s; ++l) (c = o[l]) && Er(c, e, t, l, o, n || Vi(c, t));
	return new Fi(r, this._parents, e, t);
}
At.prototype.interrupt = Mr, At.prototype.transition = Hi;
//#endregion
//#region node_modules/d3-brush/src/brush.js
var { abs: Ui, max: Wi, min: Gi } = Math;
["w", "e"].map(Ki), ["n", "s"].map(Ki), [
	"n",
	"w",
	"e",
	"s",
	"nw",
	"ne",
	"sw",
	"se"
].map(Ki);
function Ki(e) {
	return { type: e };
}
//#endregion
//#region node_modules/d3-path/src/path.js
var qi = Math.PI, Ji = 2 * qi, Yi = 1e-6, Xi = Ji - Yi;
function Zi(e) {
	this._ += e[0];
	for (let t = 1, n = e.length; t < n; ++t) this._ += arguments[t] + e[t];
}
function Qi(e) {
	let t = Math.floor(e);
	if (!(t >= 0)) throw Error(`invalid digits: ${e}`);
	if (t > 15) return Zi;
	let n = 10 ** t;
	return function(e) {
		this._ += e[0];
		for (let t = 1, r = e.length; t < r; ++t) this._ += Math.round(arguments[t] * n) / n + e[t];
	};
}
var $i = class {
	constructor(e) {
		this._x0 = this._y0 = this._x1 = this._y1 = null, this._ = "", this._append = e == null ? Zi : Qi(e);
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
		else if (d > Yi) if (!(Math.abs(u * s - c * l) > Yi) || !i) this._append`L${this._x1 = e},${this._y1 = t}`;
		else {
			let f = n - a, p = r - o, m = s * s + c * c, h = f * f + p * p, g = Math.sqrt(m), _ = Math.sqrt(d), v = i * Math.tan((qi - Math.acos((m + d - h) / (2 * g * _))) / 2), y = v / _, b = v / g;
			Math.abs(y - 1) > Yi && this._append`L${e + y * l},${t + y * u}`, this._append`A${i},${i},0,0,${+(u * f > l * p)},${this._x1 = e + b * s},${this._y1 = t + b * c}`;
		}
	}
	arc(e, t, n, r, i, a) {
		if (e = +e, t = +t, n = +n, a = !!a, n < 0) throw Error(`negative radius: ${n}`);
		let o = n * Math.cos(r), s = n * Math.sin(r), c = e + o, l = t + s, u = 1 ^ a, d = a ? r - i : i - r;
		this._x1 === null ? this._append`M${c},${l}` : (Math.abs(this._x1 - c) > Yi || Math.abs(this._y1 - l) > Yi) && this._append`L${c},${l}`, n && (d < 0 && (d = d % Ji + Ji), d > Xi ? this._append`A${n},${n},0,1,${u},${e - o},${t - s}A${n},${n},0,1,${u},${this._x1 = c},${this._y1 = l}` : d > Yi && this._append`A${n},${n},0,${+(d >= qi)},${u},${this._x1 = e + n * Math.cos(i)},${this._y1 = t + n * Math.sin(i)}`);
	}
	rect(e, t, n, r) {
		this._append`M${this._x0 = this._x1 = +e},${this._y0 = this._y1 = +t}h${n = +n}v${+r}h${-n}Z`;
	}
	toString() {
		return this._;
	}
};
function ea() {
	return new $i();
}
ea.prototype = $i.prototype;
//#endregion
//#region node_modules/d3-force/src/center.js
function ta(e, t) {
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
function na(e) {
	let t = +this._x.call(null, e), n = +this._y.call(null, e);
	return ra(this.cover(t, n), t, n, e);
}
function ra(e, t, n, r) {
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
function ia(e) {
	var t, n, r = e.length, i, a, o = Array(r), s = Array(r), c = Infinity, l = Infinity, u = -Infinity, d = -Infinity;
	for (n = 0; n < r; ++n) isNaN(i = +this._x.call(null, t = e[n])) || isNaN(a = +this._y.call(null, t)) || (o[n] = i, s[n] = a, i < c && (c = i), i > u && (u = i), a < l && (l = a), a > d && (d = a));
	if (c > u || l > d) return this;
	for (this.cover(c, l).cover(u, d), n = 0; n < r; ++n) ra(this, o[n], s[n], e[n]);
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/cover.js
function aa(e, t) {
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
function oa() {
	var e = [];
	return this.visit(function(t) {
		if (!t.length) do
			e.push(t.data);
		while (t = t.next);
	}), e;
}
//#endregion
//#region node_modules/d3-quadtree/src/extent.js
function sa(e) {
	return arguments.length ? this.cover(+e[0][0], +e[0][1]).cover(+e[1][0], +e[1][1]) : isNaN(this._x0) ? void 0 : [[this._x0, this._y0], [this._x1, this._y1]];
}
//#endregion
//#region node_modules/d3-quadtree/src/quad.js
function U(e, t, n, r, i) {
	this.node = e, this.x0 = t, this.y0 = n, this.x1 = r, this.y1 = i;
}
//#endregion
//#region node_modules/d3-quadtree/src/find.js
function ca(e, t, n) {
	var r, i = this._x0, a = this._y0, o, s, c, l, u = this._x1, d = this._y1, f = [], p = this._root, m, h;
	for (p && f.push(new U(p, i, a, u, d)), n == null ? n = Infinity : (i = e - n, a = t - n, u = e + n, d = t + n, n *= n); m = f.pop();) if (!(!(p = m.node) || (o = m.x0) > u || (s = m.y0) > d || (c = m.x1) < i || (l = m.y1) < a)) if (p.length) {
		var g = (o + c) / 2, _ = (s + l) / 2;
		f.push(new U(p[3], g, _, c, l), new U(p[2], o, _, g, l), new U(p[1], g, s, c, _), new U(p[0], o, s, g, _)), (h = (t >= _) << 1 | e >= g) && (m = f[f.length - 1], f[f.length - 1] = f[f.length - 1 - h], f[f.length - 1 - h] = m);
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
function la(e) {
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
function ua(e) {
	for (var t = 0, n = e.length; t < n; ++t) this.remove(e[t]);
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/root.js
function da() {
	return this._root;
}
//#endregion
//#region node_modules/d3-quadtree/src/size.js
function fa() {
	var e = 0;
	return this.visit(function(t) {
		if (!t.length) do
			++e;
		while (t = t.next);
	}), e;
}
//#endregion
//#region node_modules/d3-quadtree/src/visit.js
function pa(e) {
	var t = [], n, r = this._root, i, a, o, s, c;
	for (r && t.push(new U(r, this._x0, this._y0, this._x1, this._y1)); n = t.pop();) if (!e(r = n.node, a = n.x0, o = n.y0, s = n.x1, c = n.y1) && r.length) {
		var l = (a + s) / 2, u = (o + c) / 2;
		(i = r[3]) && t.push(new U(i, l, u, s, c)), (i = r[2]) && t.push(new U(i, a, u, l, c)), (i = r[1]) && t.push(new U(i, l, o, s, u)), (i = r[0]) && t.push(new U(i, a, o, l, u));
	}
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/visitAfter.js
function ma(e) {
	var t = [], n = [], r;
	for (this._root && t.push(new U(this._root, this._x0, this._y0, this._x1, this._y1)); r = t.pop();) {
		var i = r.node;
		if (i.length) {
			var a, o = r.x0, s = r.y0, c = r.x1, l = r.y1, u = (o + c) / 2, d = (s + l) / 2;
			(a = i[0]) && t.push(new U(a, o, s, u, d)), (a = i[1]) && t.push(new U(a, u, s, c, d)), (a = i[2]) && t.push(new U(a, o, d, u, l)), (a = i[3]) && t.push(new U(a, u, d, c, l));
		}
		n.push(r);
	}
	for (; r = n.pop();) e(r.node, r.x0, r.y0, r.x1, r.y1);
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/x.js
function ha(e) {
	return e[0];
}
function ga(e) {
	return arguments.length ? (this._x = e, this) : this._x;
}
//#endregion
//#region node_modules/d3-quadtree/src/y.js
function _a(e) {
	return e[1];
}
function va(e) {
	return arguments.length ? (this._y = e, this) : this._y;
}
//#endregion
//#region node_modules/d3-quadtree/src/quadtree.js
function ya(e, t, n) {
	var r = new ba(t ?? ha, n ?? _a, NaN, NaN, NaN, NaN);
	return e == null ? r : r.addAll(e);
}
function ba(e, t, n, r, i, a) {
	this._x = e, this._y = t, this._x0 = n, this._y0 = r, this._x1 = i, this._y1 = a, this._root = void 0;
}
function xa(e) {
	for (var t = { data: e.data }, n = t; e = e.next;) n = n.next = { data: e.data };
	return t;
}
var W = ya.prototype = ba.prototype;
W.copy = function() {
	var e = new ba(this._x, this._y, this._x0, this._y0, this._x1, this._y1), t = this._root, n, r;
	if (!t) return e;
	if (!t.length) return e._root = xa(t), e;
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
	}) : t.target[i] = xa(r));
	return e;
}, W.add = na, W.addAll = ia, W.cover = aa, W.data = oa, W.extent = sa, W.find = ca, W.remove = la, W.removeAll = ua, W.root = da, W.size = fa, W.visit = pa, W.visitAfter = ma, W.x = ga, W.y = va;
//#endregion
//#region node_modules/d3-force/src/constant.js
function Sa(e) {
	return function() {
		return e;
	};
}
//#endregion
//#region node_modules/d3-force/src/jiggle.js
function Ca(e) {
	return (e() - .5) * 1e-6;
}
//#endregion
//#region node_modules/d3-force/src/collide.js
function wa(e) {
	return e.x + e.vx;
}
function Ta(e) {
	return e.y + e.vy;
}
function Ea(e) {
	var t, n, r, i = 1, a = 1;
	typeof e != "function" && (e = Sa(e == null ? 1 : +e));
	function o() {
		for (var e, o = t.length, c, l, u, d, f, p, m = 0; m < a; ++m) for (c = ya(t, wa, Ta).visitAfter(s), e = 0; e < o; ++e) l = t[e], f = n[l.index], p = f * f, u = l.x + l.vx, d = l.y + l.vy, c.visit(h);
		function h(e, t, n, a, o) {
			var s = e.data, c = e.r, m = f + c;
			if (s) {
				if (s.index > l.index) {
					var h = u - s.x - s.vx, g = d - s.y - s.vy, _ = h * h + g * g;
					_ < m * m && (h === 0 && (h = Ca(r), _ += h * h), g === 0 && (g = Ca(r), _ += g * g), _ = (m - (_ = Math.sqrt(_))) / _ * i, l.vx += (h *= _) * (m = (c *= c) / (p + c)), l.vy += (g *= _) * m, s.vx -= h * (m = 1 - m), s.vy -= g * m);
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
		return arguments.length ? (e = typeof t == "function" ? t : Sa(+t), c(), o) : e;
	}, o;
}
//#endregion
//#region node_modules/d3-force/src/link.js
function Da(e) {
	return e.index;
}
function Oa(e, t) {
	var n = e.get(t);
	if (!n) throw Error("node not found: " + t);
	return n;
}
function ka(e) {
	var t = Da, n = d, r, i = Sa(30), a, o, s, c, l, u = 1;
	e ??= [];
	function d(e) {
		return 1 / Math.min(s[e.source.index], s[e.target.index]);
	}
	function f(t) {
		for (var n = 0, i = e.length; n < u; ++n) for (var o = 0, s, d, f, p, m, h, g; o < i; ++o) s = e[o], d = s.source, f = s.target, p = f.x + f.vx - d.x - d.vx || Ca(l), m = f.y + f.vy - d.y - d.vy || Ca(l), h = Math.sqrt(p * p + m * m), h = (h - a[o]) / h * t * r[o], p *= h, m *= h, f.vx -= p * (g = c[o]), f.vy -= m * g, d.vx += p * (g = 1 - g), d.vy += m * g;
	}
	function p() {
		if (o) {
			var n, i = o.length, l = e.length, u = new Map(o.map((e, n) => [t(e, n, o), e])), d;
			for (n = 0, s = Array(i); n < l; ++n) d = e[n], d.index = n, typeof d.source != "object" && (d.source = Oa(u, d.source)), typeof d.target != "object" && (d.target = Oa(u, d.target)), s[d.source.index] = (s[d.source.index] || 0) + 1, s[d.target.index] = (s[d.target.index] || 0) + 1;
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
		return arguments.length ? (n = typeof e == "function" ? e : Sa(+e), m(), f) : n;
	}, f.distance = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : Sa(+e), h(), f) : i;
	}, f;
}
//#endregion
//#region node_modules/d3-force/src/lcg.js
var Aa = 1664525, ja = 1013904223, Ma = 4294967296;
function Na() {
	let e = 1;
	return () => (e = (Aa * e + ja) % Ma) / Ma;
}
//#endregion
//#region node_modules/d3-force/src/simulation.js
function Pa(e) {
	return e.x;
}
function Fa(e) {
	return e.y;
}
var Ia = 10, La = Math.PI * (3 - Math.sqrt(5));
function Ra(e) {
	var t, n = 1, r = .001, i = 1 - r ** (1 / 300), a = 0, o = .6, s = /* @__PURE__ */ new Map(), c = _r(d), l = h("tick", "end"), u = Na();
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
				var i = Ia * Math.sqrt(.5 + t), a = t * La;
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
function za() {
	var e, t, n, r, i = Sa(-30), a, o = 1, s = Infinity, c = .81;
	function l(n) {
		var i, a = e.length, o = ya(e, Pa, Fa).visitAfter(d);
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
		if (p * p / c < m) return m < s && (d === 0 && (d = Ca(n), m += d * d), f === 0 && (f = Ca(n), m += f * f), m < o && (m = Math.sqrt(o * m)), t.vx += d * e.value * r / m, t.vy += f * e.value * r / m), !0;
		if (!(e.length || m >= s)) {
			(e.data !== t || e.next) && (d === 0 && (d = Ca(n), m += d * d), f === 0 && (f = Ca(n), m += f * f), m < o && (m = Math.sqrt(o * m)));
			do
				e.data !== t && (p = a[e.data.index] * r / m, t.vx += d * p, t.vy += f * p);
			while (e = e.next);
		}
	}
	return l.initialize = function(t, r) {
		e = t, n = r, u();
	}, l.strength = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : Sa(+e), u(), l) : i;
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
function Ba(e) {
	for (var t = -1, n = e.length, r = 0, i = 0, a, o = e[n - 1], s, c = 0; ++t < n;) a = o, o = e[t], c += s = a[0] * o[1] - o[0] * a[1], r += (a[0] + o[0]) * s, i += (a[1] + o[1]) * s;
	return c *= 3, [r / c, i / c];
}
//#endregion
//#region node_modules/d3-polygon/src/cross.js
function Va(e, t, n) {
	return (t[0] - e[0]) * (n[1] - e[1]) - (t[1] - e[1]) * (n[0] - e[0]);
}
//#endregion
//#region node_modules/d3-polygon/src/hull.js
function Ha(e, t) {
	return e[0] - t[0] || e[1] - t[1];
}
function Ua(e) {
	let t = e.length, n = [0, 1], r = 2, i;
	for (i = 2; i < t; ++i) {
		for (; r > 1 && Va(e[n[r - 2]], e[n[r - 1]], e[i]) <= 0;) --r;
		n[r++] = i;
	}
	return n.slice(0, r);
}
function Wa(e) {
	if ((n = e.length) < 3) return null;
	var t, n, r = Array(n), i = Array(n);
	for (t = 0; t < n; ++t) r[t] = [
		+e[t][0],
		+e[t][1],
		t
	];
	for (r.sort(Ha), t = 0; t < n; ++t) i[t] = [r[t][0], -r[t][1]];
	var a = Ua(r), o = Ua(i), s = o[0] === a[0], c = o[o.length - 1] === a[a.length - 1], l = [];
	for (t = a.length - 1; t >= 0; --t) l.push(e[r[a[t]][2]]);
	for (t = +s; t < o.length - c; ++t) l.push(e[r[o[t]][2]]);
	return l;
}
//#endregion
//#region node_modules/d3-shape/src/constant.js
function Ga(e) {
	return function() {
		return e;
	};
}
var Ka = Math.PI;
Ka / 2, 2 * Ka;
//#endregion
//#region node_modules/d3-shape/src/path.js
function qa(e) {
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
	}, () => new $i(t);
}
Array.prototype.slice;
function Ja(e) {
	return typeof e == "object" && "length" in e ? e : Array.from(e);
}
//#endregion
//#region node_modules/d3-shape/src/curve/linear.js
function Ya(e) {
	this._context = e;
}
Ya.prototype = {
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
function Xa(e) {
	return new Ya(e);
}
//#endregion
//#region node_modules/d3-shape/src/point.js
function Za(e) {
	return e[0];
}
function Qa(e) {
	return e[1];
}
//#endregion
//#region node_modules/d3-shape/src/line.js
function $a(e, t) {
	var n = Ga(!0), r = null, i = Xa, a = null, o = qa(s);
	e = typeof e == "function" ? e : e === void 0 ? Za : Ga(e), t = typeof t == "function" ? t : t === void 0 ? Qa : Ga(t);
	function s(s) {
		var c, l = (s = Ja(s)).length, u, d = !1, f;
		for (r ?? (a = i(f = o())), c = 0; c <= l; ++c) !(c < l && n(u = s[c], c, s)) === d && ((d = !d) ? a.lineStart() : a.lineEnd()), d && a.point(+e(u, c, s), +t(u, c, s));
		if (f) return a = null, f + "" || null;
	}
	return s.x = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : Ga(+t), s) : e;
	}, s.y = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : Ga(+e), s) : t;
	}, s.defined = function(e) {
		return arguments.length ? (n = typeof e == "function" ? e : Ga(!!e), s) : n;
	}, s.curve = function(e) {
		return arguments.length ? (i = e, r != null && (a = i(r)), s) : i;
	}, s.context = function(e) {
		return arguments.length ? (e == null ? r = a = null : a = i(r = e), s) : r;
	}, s;
}
//#endregion
//#region node_modules/d3-shape/src/noop.js
function eo() {}
//#endregion
//#region node_modules/d3-shape/src/curve/cardinal.js
function to(e, t, n) {
	e._context.bezierCurveTo(e._x1 + e._k * (e._x2 - e._x0), e._y1 + e._k * (e._y2 - e._y0), e._x2 + e._k * (e._x1 - t), e._y2 + e._k * (e._y1 - n), e._x2, e._y2);
}
function no(e, t) {
	this._context = e, this._k = (1 - t) / 6;
}
no.prototype = {
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
				to(this, this._x1, this._y1);
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
				to(this, e, t);
				break;
		}
		this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
}, (function e(t) {
	function n(e) {
		return new no(e, t);
	}
	return n.tension = function(t) {
		return e(+t);
	}, n;
})(0);
//#endregion
//#region node_modules/d3-shape/src/curve/cardinalClosed.js
function ro(e, t) {
	this._context = e, this._k = (1 - t) / 6;
}
ro.prototype = {
	areaStart: eo,
	areaEnd: eo,
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
				to(this, e, t);
				break;
		}
		this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
}, (function e(t) {
	function n(e) {
		return new ro(e, t);
	}
	return n.tension = function(t) {
		return e(+t);
	}, n;
})(0);
//#endregion
//#region node_modules/d3-shape/src/curve/catmullRom.js
function io(e, t, n) {
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
function ao(e, t) {
	this._context = e, this._alpha = t;
}
ao.prototype = {
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
				io(this, e, t);
				break;
		}
		this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
}, (function e(t) {
	function n(e) {
		return t ? new ao(e, t) : new no(e, 0);
	}
	return n.alpha = function(t) {
		return e(+t);
	}, n;
})(.5);
//#endregion
//#region node_modules/d3-shape/src/curve/catmullRomClosed.js
function oo(e, t) {
	this._context = e, this._alpha = t;
}
oo.prototype = {
	areaStart: eo,
	areaEnd: eo,
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
				io(this, e, t);
				break;
		}
		this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
};
var so = (function e(t) {
	function n(e) {
		return t ? new oo(e, t) : new ro(e, 0);
	}
	return n.alpha = function(t) {
		return e(+t);
	}, n;
})(.5), co = (e) => () => e;
//#endregion
//#region node_modules/d3-zoom/src/event.js
function lo(e, { sourceEvent: t, target: n, transform: r, dispatch: i }) {
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
function uo(e, t, n) {
	this.k = e, this.x = t, this.y = n;
}
uo.prototype = {
	constructor: uo,
	scale: function(e) {
		return e === 1 ? this : new uo(this.k * e, this.x, this.y);
	},
	translate: function(e, t) {
		return e === 0 & t === 0 ? this : new uo(this.k, this.x + this.k * e, this.y + this.k * t);
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
var fo = new uo(1, 0, 0);
po.prototype = uo.prototype;
function po(e) {
	for (; !e.__zoom;) if (!(e = e.parentNode)) return fo;
	return e.__zoom;
}
//#endregion
//#region node_modules/d3-zoom/src/noevent.js
function mo(e) {
	e.stopImmediatePropagation();
}
function ho(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region node_modules/d3-zoom/src/zoom.js
function go(e) {
	return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function _o() {
	var e = this;
	return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function vo() {
	return this.__zoom || fo;
}
function yo(e) {
	return -e.deltaY * (e.deltaMode === 1 ? .05 : e.deltaMode ? 1 : .002) * (e.ctrlKey ? 10 : 1);
}
function bo() {
	return navigator.maxTouchPoints || "ontouchstart" in this;
}
function xo(e, t, n) {
	var r = e.invertX(t[0][0]) - n[0][0], i = e.invertX(t[1][0]) - n[1][0], a = e.invertY(t[0][1]) - n[0][1], o = e.invertY(t[1][1]) - n[1][1];
	return e.translate(i > r ? (r + i) / 2 : Math.min(0, r) || Math.max(0, i), o > a ? (a + o) / 2 : Math.min(0, a) || Math.max(0, o));
}
function So() {
	var e = go, t = _o, n = xo, r = yo, i = bo, a = [0, Infinity], o = [[-Infinity, -Infinity], [Infinity, Infinity]], s = 250, c = nr, l = h("start", "zoom", "end"), u, d, f, p = 500, m = 150, g = 0, _ = 10;
	function v(e) {
		e.property("__zoom", vo).on("wheel.zoom", T, { passive: !1 }).on("mousedown.zoom", E).on("dblclick.zoom", D).filter(i).on("touchstart.zoom", O).on("touchmove.zoom", k).on("touchend.zoom touchcancel.zoom", A).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	}
	v.transform = function(e, t, n, r) {
		var i = e.selection ? e.selection() : e;
		i.property("__zoom", vo), e === i ? i.interrupt().each(function() {
			C(this, arguments).event(r).start().zoom(null, typeof t == "function" ? t.apply(this, arguments) : t).end();
		}) : S(e, t, n, r);
	}, v.scaleBy = function(e, t, n, r) {
		v.scaleTo(e, function() {
			return this.__zoom.k * (typeof t == "function" ? t.apply(this, arguments) : t);
		}, n, r);
	}, v.scaleTo = function(e, r, i, a) {
		v.transform(e, function() {
			var e = t.apply(this, arguments), a = this.__zoom, s = i == null ? x(e) : typeof i == "function" ? i.apply(this, arguments) : i, c = a.invert(s), l = typeof r == "function" ? r.apply(this, arguments) : r;
			return n(b(y(a, l), s, c), e, o);
		}, i, a);
	}, v.translateBy = function(e, r, i, a) {
		v.transform(e, function() {
			return n(this.__zoom.translate(typeof r == "function" ? r.apply(this, arguments) : r, typeof i == "function" ? i.apply(this, arguments) : i), t.apply(this, arguments), o);
		}, null, a);
	}, v.translateTo = function(e, r, i, a, s) {
		v.transform(e, function() {
			var e = t.apply(this, arguments), s = this.__zoom, c = a == null ? x(e) : typeof a == "function" ? a.apply(this, arguments) : a;
			return n(fo.translate(c[0], c[1]).scale(s.k).translate(typeof r == "function" ? -r.apply(this, arguments) : -r, typeof i == "function" ? -i.apply(this, arguments) : -i), e, o);
		}, a, s);
	};
	function y(e, t) {
		return t = Math.max(a[0], Math.min(a[1], t)), t === e.k ? e : new uo(t, e.x, e.y);
	}
	function b(e, t, n) {
		var r = t[0] - n[0] * e.k, i = t[1] - n[1] * e.k;
		return r === e.x && i === e.y ? e : new uo(e.k, r, i);
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
					e = new uo(n, l[0] - t[0] * n, l[1] - t[1] * n);
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
			var t = B(this.that).datum();
			l.call(e, this.that, new lo(e, {
				sourceEvent: this.sourceEvent,
				target: v,
				type: e,
				transform: this.that.__zoom,
				dispatch: l
			}), t);
		}
	};
	function T(t, ...i) {
		if (!e.apply(this, arguments)) return;
		var s = C(this, i).event(t), c = this.__zoom, l = Math.max(a[0], Math.min(a[1], c.k * 2 ** r.apply(this, arguments))), u = Nt(t);
		if (s.wheel) (s.mouse[0][0] !== u[0] || s.mouse[0][1] !== u[1]) && (s.mouse[1] = c.invert(s.mouse[0] = u)), clearTimeout(s.wheel);
		else if (c.k === l) return;
		else s.mouse = [u, c.invert(u)], jr(this), s.start();
		ho(t), s.wheel = setTimeout(d, m), s.zoom("mouse", n(b(y(c, l), s.mouse[0], s.mouse[1]), s.extent, o));
		function d() {
			s.wheel = null, s.end();
		}
	}
	function E(t, ...r) {
		if (f || !e.apply(this, arguments)) return;
		var i = t.currentTarget, a = C(this, r, !0).event(t), s = B(t.view).on("mousemove.zoom", d, !0).on("mouseup.zoom", p, !0), c = Nt(t, i), l = t.clientX, u = t.clientY;
		Rt(t.view), mo(t), a.mouse = [c, this.__zoom.invert(c)], jr(this), a.start();
		function d(e) {
			if (ho(e), !a.moved) {
				var t = e.clientX - l, r = e.clientY - u;
				a.moved = t * t + r * r > g;
			}
			a.event(e).zoom("mouse", n(b(a.that.__zoom, a.mouse[0] = Nt(e, i), a.mouse[1]), a.extent, o));
		}
		function p(e) {
			s.on("mousemove.zoom mouseup.zoom", null), zt(e.view, a.moved), ho(e), a.event(e).end();
		}
	}
	function D(r, ...i) {
		if (e.apply(this, arguments)) {
			var a = this.__zoom, c = Nt(r.changedTouches ? r.changedTouches[0] : r, this), l = a.invert(c), u = a.k * (r.shiftKey ? .5 : 2), d = n(b(y(a, u), c, l), t.apply(this, i), o);
			ho(r), s > 0 ? B(this).transition().duration(s).call(S, d, c, r) : B(this).call(v.transform, d, c, r);
		}
	}
	function O(t, ...n) {
		if (e.apply(this, arguments)) {
			var r = t.touches, i = r.length, a = C(this, n, t.changedTouches.length === i).event(t), o, s, c, l;
			for (mo(t), s = 0; s < i; ++s) c = r[s], l = Nt(c, this), l = [
				l,
				this.__zoom.invert(l),
				c.identifier
			], a.touch0 ? !a.touch1 && a.touch0[2] !== l[2] && (a.touch1 = l, a.taps = 0) : (a.touch0 = l, o = !0, a.taps = 1 + !!u);
			u &&= clearTimeout(u), o && (a.taps < 2 && (d = l[0], u = setTimeout(function() {
				u = null;
			}, p)), jr(this), a.start());
		}
	}
	function k(e, ...t) {
		if (this.__zooming) {
			var r = C(this, t).event(e), i = e.changedTouches, a = i.length, s, c, l, u;
			for (ho(e), s = 0; s < a; ++s) c = i[s], l = Nt(c, this), r.touch0 && r.touch0[2] === c.identifier ? r.touch0[0] = l : r.touch1 && r.touch1[2] === c.identifier && (r.touch1[0] = l);
			if (c = r.that.__zoom, r.touch1) {
				var d = r.touch0[0], f = r.touch0[1], p = r.touch1[0], m = r.touch1[1], h = (h = p[0] - d[0]) * h + (h = p[1] - d[1]) * h, g = (g = m[0] - f[0]) * g + (g = m[1] - f[1]) * g;
				c = y(c, Math.sqrt(h / g)), l = [(d[0] + p[0]) / 2, (d[1] + p[1]) / 2], u = [(f[0] + m[0]) / 2, (f[1] + m[1]) / 2];
			} else if (r.touch0) l = r.touch0[0], u = r.touch0[1];
			else return;
			r.zoom("touch", n(b(c, l, u), r.extent, o));
		}
	}
	function A(e, ...t) {
		if (this.__zooming) {
			var n = C(this, t).event(e), r = e.changedTouches, i = r.length, a, o;
			for (mo(e), f && clearTimeout(f), f = setTimeout(function() {
				f = null;
			}, p), a = 0; a < i; ++a) o = r[a], n.touch0 && n.touch0[2] === o.identifier ? delete n.touch0 : n.touch1 && n.touch1[2] === o.identifier && delete n.touch1;
			if (n.touch1 && !n.touch0 && (n.touch0 = n.touch1, delete n.touch1), n.touch0) n.touch0[1] = this.__zoom.invert(n.touch0[0]);
			else if (n.end(), n.taps === 2 && (o = Nt(o, this), Math.hypot(d[0] - o[0], d[1] - o[1]) < _)) {
				var s = B(this).on("dblclick.zoom");
				s && s.apply(this, arguments);
			}
		}
	}
	return v.wheelDelta = function(e) {
		return arguments.length ? (r = typeof e == "function" ? e : co(+e), v) : r;
	}, v.filter = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : co(!!t), v) : e;
	}, v.touchable = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : co(!!e), v) : i;
	}, v.extent = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : co([[+e[0][0], +e[0][1]], [+e[1][0], +e[1][1]]]), v) : t;
	}, v.scaleExtent = function(e) {
		return arguments.length ? (a[0] = +e[0], a[1] = +e[1], v) : [a[0], a[1]];
	}, v.translateExtent = function(e) {
		return arguments.length ? (o[0][0] = +e[0][0], o[1][0] = +e[1][0], o[0][1] = +e[0][1], o[1][1] = +e[1][1], v) : [[o[0][0], o[0][1]], [o[1][0], o[1][1]]];
	}, v.constrain = function(e) {
		return arguments.length ? (n = e, v) : n;
	}, v.duration = function(e) {
		return arguments.length ? (s = +e, v) : s;
	}, v.interpolate = function(e) {
		return arguments.length ? (c = e, v) : c;
	}, v.on = function() {
		var e = l.on.apply(l, arguments);
		return e === l ? v : e;
	}, v.clickDistance = function(e) {
		return arguments.length ? (g = (e = +e) * e, v) : Math.sqrt(g);
	}, v.tapDistance = function(e) {
		return arguments.length ? (_ = +e, v) : _;
	}, v;
}
var Co = {
	graphContainer: "_graphContainer_je06x_1",
	flowSingleDot: "_flowSingleDot_je06x_1"
}, G = {
	card: "_card_1t8zh_5",
	draft: "_draft_1t8zh_24",
	published: "_published_1t8zh_28",
	pinned: "_pinned_1t8zh_32",
	marker: "_marker_1t8zh_37",
	title: "_title_1t8zh_46",
	titleCentered: "_titleCentered_1t8zh_57",
	titleInline: "_titleInline_1t8zh_73",
	preview: "_preview_1t8zh_83",
	scroll: "_scroll_1t8zh_93",
	full: "_full_1t8zh_109",
	popout: "_popout_1t8zh_126",
	imageCard: "_imageCard_1t8zh_145",
	imageFrame: "_imageFrame_1t8zh_156",
	imageCaption: "_imageCaption_1t8zh_173",
	scrollFull: "_scrollFull_1t8zh_184",
	titleScrolling: "_titleScrolling_1t8zh_188",
	imageMark: "_imageMark_1t8zh_200",
	bookmarkMark: "_bookmarkMark_1t8zh_214",
	bookmarkCount: "_bookmarkCount_1t8zh_233",
	glow: "_glow_1t8zh_244",
	cardTitle: "_cardTitle_1t8zh_254",
	resizeGrip: "_resizeGrip_1t8zh_260",
	cardCenter: "_cardCenter_1t8zh_304",
	cardSubtitle: "_cardSubtitle_1t8zh_324"
}, K = {
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
}, wo = 140, To = 80, Eo = 700, Do = 700;
function Oo({ width: e, height: t, zoomScale: n = 1, onResize: i, onResizeEnd: s }) {
	let [c, l] = o(!1), f = a(null), p = (r, a) => {
		a.stopPropagation(), a.preventDefault(), l(!0), f.current = {
			direction: r,
			startX: a.clientX,
			startY: a.clientY,
			startW: e,
			startH: t,
			scale: n > 0 ? n : 1
		};
		let o = (e) => {
			if (!f.current) return;
			let { direction: t, startX: n, startY: r, startW: a, startH: o, scale: s } = f.current, c = (e.clientX - n) / s, l = (e.clientY - r) / s, u = a, d = o;
			t.includes("e") && (u = a + c), t.includes("w") && (u = a - c), t.includes("s") && (d = o + l), t.includes("n") && (d = o - l), u = Math.max(wo, Math.min(Eo, Math.round(u))), d = Math.max(To, Math.min(Do, Math.round(d))), i && i({
				width: u,
				height: d
			});
		}, c = (e) => {
			window.removeEventListener("pointermove", o), window.removeEventListener("pointerup", c), document.body.style.cursor = "", l(!1), f.current = null, s && s();
		}, u = {
			nw: "nwse-resize",
			ne: "nesw-resize",
			sw: "nesw-resize",
			se: "nwse-resize",
			n: "ns-resize",
			s: "ns-resize",
			w: "ew-resize",
			e: "ew-resize"
		};
		document.body.style.cursor = u[r] || "nwse-resize", window.addEventListener("pointermove", o), window.addEventListener("pointerup", c);
	};
	return r(() => () => {
		document.body.style.cursor = "";
	}, []), /* @__PURE__ */ d("div", {
		className: c ? K.resizing : void 0,
		children: [
			/* @__PURE__ */ u("div", {
				className: `${K.handle} ${K.handleN}`,
				onPointerDown: (e) => p("n", e),
				title: "Drag to resize height"
			}),
			/* @__PURE__ */ u("div", {
				className: `${K.handle} ${K.handleS}`,
				onPointerDown: (e) => p("s", e),
				title: "Drag to resize height"
			}),
			/* @__PURE__ */ u("div", {
				className: `${K.handle} ${K.handleW}`,
				onPointerDown: (e) => p("w", e),
				title: "Drag to resize width"
			}),
			/* @__PURE__ */ u("div", {
				className: `${K.handle} ${K.handleE}`,
				onPointerDown: (e) => p("e", e),
				title: "Drag to resize width"
			}),
			/* @__PURE__ */ u("div", {
				className: `${K.handle} ${K.handleNW}`,
				onPointerDown: (e) => p("nw", e),
				title: "Drag to resize"
			}),
			/* @__PURE__ */ u("div", {
				className: `${K.handle} ${K.handleNE}`,
				onPointerDown: (e) => p("ne", e),
				title: "Drag to resize"
			}),
			/* @__PURE__ */ u("div", {
				className: `${K.handle} ${K.handleSW}`,
				onPointerDown: (e) => p("sw", e),
				title: "Drag to resize"
			}),
			/* @__PURE__ */ u("div", {
				className: `${K.handle} ${K.handleSE}`,
				onPointerDown: (e) => p("se", e),
				title: "Drag to resize"
			})
		]
	});
}
//#endregion
//#region src/components/NodeView/TextView/TextView.jsx
function ko({ article: e, width: t, height: n, viewState: r, fullContent: i, onResize: a, cardSettings: o }) {
	let { hovered: s = !1, pinned: c = !1, lod: l = "full", zoomScale: f = 1 } = r || {}, p = s || c, m = c && !!i, h = !(e._status === "published" || e._status === "bloomed" || e.syndication && e.syndication.canonical), g = e.containerColor || e.color || e._source && e._source.color, _ = r?.bookmarkCount ?? (Array.isArray(r?.bookmarks) ? r.bookmarks.length : Array.isArray(e?.bookmarks) ? e.bookmarks.length : 0);
	if (e.kind === "image" && e.image) return /* @__PURE__ */ u(Io, {
		article: e,
		width: t,
		height: n,
		pinned: c,
		hovered: s,
		isDraft: h,
		zoomScale: f,
		bookmarkCount: _,
		onResize: a
	});
	let v = (e._source && e._source.prominence || e.originalItem && e.originalItem._source && e.originalItem._source.prominence || "secondary") === "primary" ? h ? "#24304a" : "#1e3a5f" : "#23232f", y = !!e.image, b = [
		G.card,
		g && !c && G.glow,
		h ? G.draft : G.published,
		p && G.expanded,
		c && G.pinned,
		r.lod === "marker" && !p && G.marker
	].filter(Boolean).join(" "), x = r.lod !== "marker";
	return /* @__PURE__ */ d("div", {
		className: b,
		style: {
			width: t,
			height: n,
			background: v,
			...g && !c ? { "--nv-src": g } : {}
		},
		children: [
			_ > 0 && /* @__PURE__ */ d("div", {
				className: G.bookmarkMark,
				title: _ === 1 ? "1 bookmark" : `${_} bookmarks`,
				children: [/* @__PURE__ */ u("svg", {
					viewBox: "0 0 16 16",
					width: "12",
					height: "12",
					fill: "currentColor",
					children: /* @__PURE__ */ u("path", { d: "M3 2v12l5-3 5 3V2z" })
				}), _ > 1 && /* @__PURE__ */ u("span", {
					className: G.bookmarkCount,
					children: _
				})]
			}),
			y && /* @__PURE__ */ u("div", {
				className: G.imageMark,
				style: { backgroundImage: `url('${e.image}')` },
				title: "has an image"
			}),
			/* @__PURE__ */ u(Fo, {
				article: e,
				width: t,
				height: n - 0,
				bandHeight: 0,
				viewState: r,
				expanded: p,
				useFullArticle: m,
				fullContent: i,
				cardSettings: o
			}),
			c && /* @__PURE__ */ u(Lo, {}),
			x && /* @__PURE__ */ u(Oo, {
				width: t,
				height: n,
				zoomScale: f,
				onResize: a
			})
		]
	});
}
function Ao(e, t, n, r = {}) {
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
var jo = 260, Mo = [
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
], No = [
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
function Po(e) {
	let t = parseInt(e, 10);
	if (isNaN(t) || t < 0 || t > 99) return String(e);
	if (t < 20) return Mo[t];
	let n = t % 10;
	return No[Math.floor(t / 10)] + (n ? `-${Mo[n]}` : "");
}
function Fo({ article: e, width: t, height: n, bandHeight: r = 0, viewState: i, expanded: a, useFullArticle: o, fullContent: s, cardSettings: c }) {
	if (a) {
		let t = o ? s : e.description || "", r = e.title || e.label;
		return n && n < jo ? /* @__PURE__ */ d("div", {
			className: `${G.scroll} ${G.scrollFull} ${o ? G.full : ""} rp-scroll`,
			children: [/* @__PURE__ */ u("div", {
				className: G.titleScrolling,
				children: r
			}), t && /* @__PURE__ */ u("div", { dangerouslySetInnerHTML: { __html: t } })]
		}) : /* @__PURE__ */ d(l, { children: [/* @__PURE__ */ u("div", {
			className: G.title,
			children: r
		}), t && /* @__PURE__ */ u("div", {
			className: `${G.scroll} ${o ? G.full : ""} rp-scroll`,
			dangerouslySetInnerHTML: { __html: t }
		})] });
	}
	if (i.lod === "marker") return null;
	let f = c?.subtitle || typeof window < "u" && window.SETTINGS?.graph?.card?.subtitle, p = null;
	if (f && e.series_part != null && e.series_part !== "") {
		let t = e.series_part, n = Po(t);
		p = f.replace(/\{n\}/g, String(t)).replace(/\{n_words\}/g, n);
	}
	let m = i.lod === "slug" ? e.label || e.labelMedium || e.title || "" : e.title || e.label, h = Ao(m, t, p ? n - 30 : n, {
		min: 14,
		max: 26,
		lineHeight: 1.05,
		pad: 8
	}), g = Math.max(11, Math.round(h * .62));
	return /* @__PURE__ */ d("div", {
		className: G.cardCenter,
		children: [/* @__PURE__ */ u("div", {
			className: G.cardTitle,
			style: { fontSize: `${h}px` },
			children: m
		}), p && /* @__PURE__ */ u("div", {
			className: G.cardSubtitle,
			style: { fontSize: `${g}px` },
			children: p
		})]
	});
}
function Io({ article: e, width: t, height: n, pinned: r, hovered: i, isDraft: a, zoomScale: o, bookmarkCount: s = 0, onResize: c }) {
	let l = [
		G.imageCard,
		a ? G.draft : G.published,
		r && G.pinned
	].filter(Boolean).join(" "), f = n - 24;
	return /* @__PURE__ */ d("div", {
		className: l,
		style: {
			width: t,
			height: n
		},
		children: [
			s > 0 && /* @__PURE__ */ d("div", {
				className: G.bookmarkMark,
				title: s === 1 ? "1 bookmark" : `${s} bookmarks`,
				children: [/* @__PURE__ */ u("svg", {
					viewBox: "0 0 16 16",
					width: "12",
					height: "12",
					fill: "currentColor",
					children: /* @__PURE__ */ u("path", { d: "M3 2v12l5-3 5 3V2z" })
				}), s > 1 && /* @__PURE__ */ u("span", {
					className: G.bookmarkCount,
					children: s
				})]
			}),
			/* @__PURE__ */ u("div", {
				className: G.imageFrame,
				style: {
					width: t,
					height: f,
					backgroundImage: `url('${e.image}')`
				}
			}),
			/* @__PURE__ */ u("div", {
				className: G.imageCaption,
				children: e.short_title || e.title || e.label
			}),
			r && /* @__PURE__ */ u(Lo, {}),
			/* @__PURE__ */ u(Oo, {
				width: t,
				height: n,
				zoomScale: o,
				onResize: c
			})
		]
	});
}
function Lo() {
	return /* @__PURE__ */ u("div", {
		"data-popout": "1",
		title: "Open in reader",
		className: G.popout,
		children: /* @__PURE__ */ d("svg", {
			"data-popout": "1",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2.2",
			width: "13",
			height: "13",
			style: { pointerEvents: "none" },
			children: [
				/* @__PURE__ */ u("path", { d: "M14 3h7v7" }),
				/* @__PURE__ */ u("path", { d: "M21 3l-9 9" }),
				/* @__PURE__ */ u("path", { d: "M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" })
			]
		})
	});
}
//#endregion
//#region src/components/NodeView/registry.js
var Ro = {
	text: ko,
	essay: ko,
	fragment: ko,
	multi: ko,
	image: ko,
	"podcast-episode": ko,
	video: ko
};
function zo(e, t = {}) {
	return {
		...Ro,
		...t
	}[e] || ko;
}
//#endregion
//#region src/components/GraphViewer/GraphViewer.jsx
var Bo = (/* @__PURE__ */ f(((e, t) => {
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
})))();
function Vo(e, t = {}) {
	let n = [], r = [], i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map(), s = t.nodeDraftColor || "#555", c = t.nodePublishedColor || "#2ecc71", l = t.tagColor || "#f39c12", u = t.topologyColor || "#9b59b6", d = t.placeholderColor || "#7f8c8d";
	for (let r of e.items) {
		let i = r.url.split("/").pop().replace(".html", ""), l = r._status || "draft";
		o.set(r.id, i), a.add(i);
		let u = null, d = e.containers || t.containment || [];
		for (let e of d) if (e.parent && e.tag && (r.tags || []).includes(e.tag)) {
			u = e.badgeColor || e.color || e.stroke;
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
			containerColor: u,
			color: u || (l === "published" ? c : s),
			kind: r.kind || "essay",
			substrate: r.substrate || "essay",
			seed: r.seed || "",
			topology: r.topology || [],
			energy: r.energy || "",
			connected_to: r.connected_to || [],
			forms: r.forms || {},
			note: r.note || "",
			todos: r.todos || [],
			_source: r._source || null,
			originalItem: r
		});
	}
	function f(e) {
		return e.startsWith("tag:") || e.startsWith("topology:") ? e : o.get(e) || e;
	}
	let p = [];
	for (let t of e.edges || []) {
		if (t.layer === "containment" || t.role === "contains") {
			p.push({
				source: t.source,
				target: f(t.target),
				attrs: t.attrs || {}
			});
			continue;
		}
		let e = f(t.source), n = f(t.target);
		t.layer === "tag" && !i.has(n) ? i.set(n, {
			id: n,
			label: n.slice(4),
			type: "tag",
			size: 30,
			color: l
		}) : t.layer === "topology" && !i.has(n) ? i.set(n, {
			id: n,
			label: n.slice(9),
			type: "topology",
			size: 30,
			color: u
		}) : t.layer === "authored" && !a.has(n) && !i.has(n) && i.set(n, {
			id: n,
			label: n,
			type: "placeholder",
			size: 40,
			color: d
		}), r.push({
			source: e,
			target: n,
			directed: !!t.directed,
			role: t.role,
			layer: t.layer
		});
	}
	n.push(...i.values());
	let m = e.containers || t.containment || [];
	if (m.length === 0 && p.length > 0) {
		let e = /* @__PURE__ */ new Map();
		for (let t of p) if (!a.has(t.source) && !e.has(t.source)) {
			let n = t.attrs?.label || t.source.replace(/^container:/, "").replace(/^tag:/, "").replace(/-/g, " ");
			e.set(t.source, {
				id: t.source,
				label: n.toUpperCase(),
				parent: t.attrs?.parent || null
			});
		}
		m = Array.from(e.values());
	}
	return {
		nodes: n,
		links: r,
		containmentEdges: p,
		containers: m
	};
}
function Ho(e, t, n) {
	let r = (e) => e && e.type === "article" && e._source && n.has(e._source.id);
	e.selectAll(".node").style("display", (e) => r(e) ? "none" : null), t.selectAll(".node-card").style("display", (e) => r(e) ? "none" : null), e.selectAll(".link").style("display", (e) => {
		let t = typeof e.source == "object" ? e.source : null, n = typeof e.target == "object" ? e.target : null;
		return r(t) || r(n) ? "none" : null;
	});
}
function Uo(e, t, n) {
	if (!n) {
		t.selectAll(".node-card").classed("dimmed", !1), e.selectAll(".node").classed("dimmed", !1), e.selectAll(".link").classed("dimmed", !1);
		return;
	}
	t.selectAll(".node-card").classed("dimmed", (e) => !n.has(e.id)), e.selectAll(".node").classed("dimmed", (e) => e.type === "article" ? !n.has(e.id) : !1), e.selectAll(".link").classed("dimmed", (e) => {
		let t = typeof e.source == "object" ? e.source.id : e.source, r = typeof e.target == "object" ? e.target.id : e.target;
		return !n.has(t) && !n.has(r);
	});
}
var Wo = .35, Go = .6;
function Ko(e) {
	return e < Wo ? "marker" : e < Go ? "title" : "full";
}
function qo(e) {
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
function Jo({ feedData: e, onNodeSelect: n, hiddenSources: i, filteredArticleIds: o, viewState: s, layout: l = "force", timeAxis: d, graphSettings: f, colorOverrides: m }) {
	let h = f || {}, g = {
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
		...h.card || {}
	}, _ = {
		fontSize: 22,
		padding: 11,
		maxWidth: 150,
		maxLines: 3,
		cornerRadius: 9,
		opacity: .7,
		...h.tag || {}
	}, v = {
		dock: "left",
		inset: 54,
		endPadding: 70,
		connectorOpacity: .45,
		connectorWidth: 1.6,
		spineOpacity: .55,
		spineWidth: 3,
		tickFontSize: 13,
		...h.timeAxis || {}
	}, y = {
		linkDistance: 160,
		chargeStrength: -500,
		collidePadding: 10,
		velocityDecay: .7,
		alphaDecay: .028,
		...h.simulation || {}
	}, b = a(null), x = a(null), S = a(null), C = a(n);
	r(() => {
		C.current = n;
	}, [n]);
	let w = a(s);
	r(() => {
		w.current = s;
	}, [s]);
	let T = qo(g);
	g.glowPadding;
	let E = a(null), D = a(l), O = a(!1), k = a(null), A = a(null), ee = a(null), j = (e) => e.originalItem && e.originalItem.id || e.id, M = (e) => D.current + "::" + j(e), N = a(/* @__PURE__ */ new Set()), te = a(null), ne = a(1), re = a("full"), ie = a(/* @__PURE__ */ new Set());
	r(() => {
		ie.current = i instanceof Set ? i : new Set(i || []), !(!x.current || !S.current) && Ho(x.current, B(S.current), ie.current);
	}, [i]), r(() => {
		if (!(!b.current || !m)) for (let [e, t] of Object.entries(m)) t && b.current.style.setProperty(e, t);
	}, [m]), r(() => {
		if (s) return s.subscribe(() => {
			ee.current && ee.current();
		});
	}, [s]), r(() => {
		!x.current || !S.current || Uo(x.current, B(S.current), o);
	}, [o]), r(() => {
		if (!e || !b.current) return;
		let n = b.current, r = n.clientWidth, i = n.clientHeight, a = getComputedStyle(n), o = Vo(e, {
			nodeDraftColor: a.getPropertyValue("--gv-node-draft").trim() || "#555",
			nodePublishedColor: a.getPropertyValue("--gv-node-published").trim() || "#2ecc71",
			tagColor: a.getPropertyValue("--gv-tag-color").trim() || "#f39c12",
			topologyColor: a.getPropertyValue("--gv-topology-color").trim() || "#9b59b6",
			placeholderColor: a.getPropertyValue("--gv-placeholder-color").trim() || "#7f8c8d"
		});
		B(n).selectAll("svg").remove(), B(n).selectAll(".cards-layer").remove();
		let s = B(n).append("svg").attr("width", r).attr("height", i).style("position", "absolute").style("inset", "0").style("pointer-events", "all");
		x.current = s, s.append("defs").append("marker").attr("id", "sequence-arrow").attr("viewBox", "0 0 10 10").attr("refX", 8).attr("refY", 5).attr("markerWidth", 7).attr("markerHeight", 7).attr("orient", "auto").append("path").attr("d", "M 0 1.5 L 8 5 L 0 8.5 z").attr("fill", "var(--gv-accent, #d4af37)");
		let l = B(n).append("div").attr("class", "cards-layer").style("position", "absolute").style("left", "0").style("top", "0").style("width", "100%").style("height", "100%").style("pointer-events", "none");
		S.current = l.node();
		let u = l.append("div").attr("class", "cards-transform").style("transform-origin", "0 0").style("position", "absolute").style("left", "0").style("top", "0").style("width", "0").style("height", "0").style("overflow", "visible"), d = s.append("g"), m = So().on("zoom", (e) => {
			d.attr("transform", e.transform), u && u.style("transform", `translate3d(${e.transform.x}px, ${e.transform.y}px, 0px) scale(${e.transform.k})`);
			let t = e.transform.k;
			ne.current = t, A.current && A.current();
			let n = Ko(t);
			n !== re.current && (re.current = n, Ie());
		});
		s.call(m).on("dblclick.zoom", null);
		let v = !1;
		if (w.current && (v = (0, Bo.layoutIsDegenerate)(o.nodes.map((e) => w.current.nodeState(M(e))).filter((e) => e && Number.isFinite(e.x) && Number.isFinite(e.y)), T({
			hovered: !1,
			pinned: !1
		}))), w.current && !v) for (let e of o.nodes) {
			let t = w.current.nodeState(M(e)), n = w.current.nodeState(j(e));
			t && typeof t.x == "number" && typeof t.y == "number" && (e.x = t.x, e.y = t.y, t.auto || (e.fx = t.x, e.fy = t.y)), n && typeof n.w == "number" && typeof n.h == "number" && (e._size = {
				width: n.w,
				height: n.h
			});
		}
		if (N.current = /* @__PURE__ */ new Set(), w.current) for (let e of o.nodes) {
			let t = w.current.nodeState(j(e));
			e.type === "article" && t && t.pinned && N.current.add(e.id);
		}
		if (w.current && v) for (let e of o.nodes) {
			let t = w.current.nodeState(j(e));
			t && typeof t.w == "number" && typeof t.h == "number" && (e._size = {
				width: t.w,
				height: t.h
			});
		}
		let O = Ra().force("link", ka().id((e) => e.id).distance(y.linkDistance)).force("charge", za().strength(y.chargeStrength)).force("collide", Ea().radius((e) => (e._r || (e.type === "article" ? Math.hypot(g.width, g.height) / 2 : e.size / 2)) + y.collidePadding).strength(1).iterations(3)).force("center", ta(r / 2, i / 2)).velocityDecay(y.velocityDecay).alphaDecay(y.alphaDecay), ae = () => {
			k.current && k.current(), b.current && (r = b.current.clientWidth, i = b.current.clientHeight, s.attr("width", r).attr("height", i));
		};
		window.addEventListener("resize", ae);
		let oe = s.append("g").attr("class", "time-axis-layer"), se = d.append("g").attr("class", "containers-layer"), ce = /* @__PURE__ */ new Map(), le = /* @__PURE__ */ new Map();
		for (let e of o.containers || []) ce.set(e.id, /* @__PURE__ */ new Set()), le.set(e.id, /* @__PURE__ */ new Set());
		for (let e of o.containmentEdges || []) ce.has(e.source) && ce.has(e.target) ? ce.get(e.source).add(e.target) : le.has(e.source) && le.get(e.source).add(e.target);
		function P(e, t = /* @__PURE__ */ new Set()) {
			if (t.has(e)) return [];
			t.add(e);
			let n = Array.from(le.get(e) || []), r = Array.from(ce.get(e) || []).flatMap((e) => P(e, t));
			return Array.from(new Set([...n, ...r]));
		}
		let ue = [...o.containers || []].sort((e, t) => t.parent === e.id ? -1 : +(e.parent === t.id)), de = se.selectAll(".container-group").data(ue, (e) => e.id).enter().append("g").attr("class", "container-group").attr("data-container-id", (e) => e.id);
		de.append("path").attr("class", "container-hull").attr("fill", (e) => e.fill || "rgba(212, 175, 55, 0.03)").attr("stroke", (e) => e.stroke || "rgba(212, 175, 55, 0.45)").attr("stroke-width", (e) => e.strokeWidth || 1.5).attr("stroke-dasharray", (e) => e.strokeDasharray || (e.parent ? null : "6 6"));
		let F = /* @__PURE__ */ new Set();
		h.initialCollapsed === "all" ? (e.containers || []).forEach((e) => F.add(e.id)) : Array.isArray(h.initialCollapsed) && h.initialCollapsed.forEach((e) => F.add(e));
		let fe = /* @__PURE__ */ new Map();
		function pe(e, t, n) {
			let r = (t.label || t.id).split(/\s+/), i = [], a = "";
			for (let e of r) a ? a.length + 1 + e.length > n ? (i.push(a), a = e) : a += " " + e : a = e;
			a && i.push(a), e.selectAll("*").remove();
			let o = i.length;
			i.forEach((t, n) => {
				let r = n === o - 1;
				e.append("tspan").attr("class", "label-line").attr("x", 0).attr("dy", n === 0 ? `-${(o - 1) * .5}em` : "1em").text(t), r && e.append("tspan").attr("class", "label-count").attr("font-weight", "500").attr("dx", "12px").attr("font-size", "0.5em").text("");
			});
		}
		function me(e) {
			return e.badgeColor || e.color || e.stroke || "#d4af37";
		}
		let he = de.append("g").attr("class", "container-badge").style("touch-action", "manipulation");
		he.append("text").attr("class", "container-badge-text").attr("text-anchor", "middle").attr("dominant-baseline", "central").style("user-select", "none").attr("fill", (e) => me(e)).attr("opacity", .55).attr("font-size", (e) => e.parent ? "52px" : "64px").each(function(e) {
			pe(B(this), e, 15);
		});
		let ge = de.append("g").attr("class", "container-macro-node").style("display", "none").style("touch-action", "manipulation");
		ge.append("rect").attr("class", "container-macro-bg").attr("rx", 40).attr("ry", 40).attr("fill", (e) => e.fill || "rgba(212, 175, 55, 0.08)").attr("stroke", (e) => me(e)).attr("stroke-width", 1.8).style("filter", "drop-shadow(0 10px 25px rgba(0, 0, 0, 0.6))"), ge.append("text").attr("class", "container-macro-text").attr("text-anchor", "middle").attr("dominant-baseline", "central").attr("fill", (e) => me(e)).attr("font-size", (e) => e.parent ? "52px" : "64px").attr("font-family", "'Atkinson', sans-serif").attr("font-weight", "700").attr("letter-spacing", "-0.02em").each(function(e) {
			pe(B(this), e, 15);
		});
		function _e() {
			ge.each(function(e) {
				let t = B(this), n = t.select(".container-macro-text").node(), r = e.parent ? 260 : 380, i = e.parent ? 90 : 110;
				if (n) try {
					let t = n.getBBox();
					if (t && t.width > 0) {
						let n = e.parent ? 28 : 36, a = e.parent ? 18 : 22;
						r = t.width + n * 2, i = t.height + a * 2;
					}
				} catch {}
				t.select(".container-macro-bg").attr("width", r).attr("height", i).attr("x", -r / 2).attr("y", -i / 2), e._macroHalfW = r / 2, e._macroHalfH = i / 2;
			});
		}
		_e();
		function ve({ isCollapsed: e }) {
			return Kt().clickDistance(5).filter((e) => !(e.ctrlKey || e.button !== void 0 && e.button !== 0)).on("start", function(e, t) {
				e.sourceEvent && e.sourceEvent.stopPropagation();
				let n = e.x, r = e.y;
				B(this).datum()._dragState = {
					startX: n,
					startY: r,
					lastX: n,
					lastY: r,
					totalMove: 0
				};
			}).on("drag", function(e, t) {
				let n = B(this).datum()._dragState;
				if (!n) return;
				let r = e.x - n.lastX, i = e.y - n.lastY;
				n.lastX = e.x, n.lastY = e.y, n.totalMove += Math.hypot(r, i);
				let a = P(t.id);
				for (let e of a) {
					let t = be.get(e);
					t && (t.x += r, t.y += i, t.fx = t.x, t.fy = t.y, w.current && w.current.setNodePosition(M(t), t.x, t.y, { transient: !0 }));
				}
				Be(), A.current && A.current();
			}).on("end", function(t, n) {
				let r = B(this).datum()._dragState;
				if (delete B(this).datum()._dragState, (r ? r.totalMove : 0) >= 4) {
					let e = P(n.id), t = w.current;
					for (let n of e) {
						let e = be.get(n);
						e && (e.fx = e.x, e.fy = e.y, t && t.setNodePosition(M(e), e.x, e.y, { transient: !0 }));
					}
					t && t.commit(), Be();
				} else {
					let t = Date.now(), r = n._lastTap || 0;
					(f.collapseGesture || "tap") === "doubletap" ? t - r < 400 ? (e || F.has(n.id) ? F.delete(n.id) : F.add(n.id), Ce(), n._lastTap = 0) : n._lastTap = t : (e || F.has(n.id) ? F.delete(n.id) : F.add(n.id), Ce());
				}
			});
		}
		he.call(ve({ isCollapsed: !1 })), ge.call(ve({ isCollapsed: !0 }));
		let ye = $a().curve(so.alpha(.5)), be = new Map(o.nodes.map((e) => [e.id, e]));
		function xe() {
			let e = [];
			function t(t) {
				if (!o.containers || o.containers.length === 0) return;
				let n = /* @__PURE__ */ new Map(), r = (e) => {
					if (e.type === "article") {
						let t = e._size?.width || g.width, n = e._size?.height || g.height;
						return Math.hypot(t, n) / 2;
					}
					return (e.size || 60) / 2;
				};
				for (let e of o.containers) {
					let t = P(e.id).map((e) => be.get(e)).filter((e) => e && Number.isFinite(e.x) && Number.isFinite(e.y));
					if (t.length === 0) continue;
					if (F.has(e.id)) {
						let r = p(t, (e) => e.x), i = p(t, (e) => e.y), a = e.padding == null ? 40 : e.padding, o = e._macroHalfW || 130, s = e._macroHalfH || 45, c = Math.hypot(o, s) + a;
						n.set(e.id, {
							x: r,
							y: i,
							r: c,
							isClosed: !0,
							members: t
						});
						continue;
					}
					let i = [];
					for (let t of ce.get(e.id) || []) if (F.has(t)) {
						let e = P(t).map((e) => be.get(e)).filter((e) => e && Number.isFinite(e.x) && Number.isFinite(e.y));
						if (e.length > 0) {
							let n = o.containers.find((e) => e.id === t), r = n?._macroHalfW || 130, a = n?._macroHalfH || 45;
							i.push({
								x: p(e, (e) => e.x),
								y: p(e, (e) => e.y),
								halfSize: Math.hypot(r, a)
							});
						}
					}
					for (let e of t) {
						let t = !1;
						for (let n of F) if (P(n).includes(e.id)) {
							t = !0;
							break;
						}
						t || i.push({
							x: e.x,
							y: e.y,
							halfSize: r(e)
						});
					}
					if (i.length === 0) continue;
					let a = p(i, (e) => e.x), s = p(i, (e) => e.y), c = e.padding == null ? 40 : e.padding, l = 0;
					for (let e of i) {
						let t = Math.hypot(e.x - a, e.y - s) + e.halfSize;
						t > l && (l = t);
					}
					let u = l + c, d = f.labelSize?.min || 32, m = f.labelSize?.max || 96;
					e._fs = Math.max(d, Math.min(m, u * 2 / 8)), n.set(e.id, {
						x: a,
						y: s,
						r: u,
						isClosed: !1,
						members: t
					});
				}
				for (let e = 0; e < o.containers.length; e++) for (let r = e + 1; r < o.containers.length; r++) {
					let i = o.containers[e], a = o.containers[r];
					if ((i.parent || null) !== (a.parent || null)) continue;
					let s = n.get(i.id), c = n.get(a.id);
					if (!s || !c) continue;
					let l = c.x - s.x, u = c.y - s.y, d = Math.hypot(l, u), p = f.containerSpacing === void 0 ? -20 : f.containerSpacing, m = s.r + c.r + p;
					if (d < m) {
						let e = m - d, n = d > 1e-4 ? l / d : Math.random() - .5 || 1, r = d > 1e-4 ? u / d : Math.random() - .5 || 0, i = Math.hypot(n, r);
						n /= i, r /= i;
						let a = e * t * .5, o = n * a, f = r * a;
						for (let e of s.members) e.vx -= o, e.vy -= f;
						for (let e of c.members) e.vx += o, e.vy += f;
					}
				}
				let i = /* @__PURE__ */ new Set();
				for (let e of o.containers) for (let t of P(e.id)) i.add(t);
				let a = (e.length ? e : o.nodes).filter((e) => !i.has(e.id) && Number.isFinite(e.x) && Number.isFinite(e.y)), s = o.containers.filter((e) => !e.parent);
				for (let e of s) {
					let i = n.get(e.id);
					if (i) for (let e of a) {
						let n = r(e), a = e.x - i.x, o = e.y - i.y, s = Math.hypot(a, o), c = i.r + n;
						if (s < c) {
							let n = c - s, r = s > 1e-4 ? a / s : Math.random() - .5 || 1, l = s > 1e-4 ? o / s : Math.random() - .5 || 0, u = Math.hypot(r, l);
							r /= u, l /= u;
							let d = n * t * .5, f = r * d, p = l * d;
							e.vx += f, e.vy += p;
							for (let e of i.members) e.vx -= f, e.vy -= p;
						}
					}
				}
			}
			return t.initialize = (t) => {
				e = t;
			}, t;
		}
		o.containers && o.containers.length > 0 && O.force("containerSeparation", xe());
		function Se() {
			ue.length !== 0 && de.each(function(e) {
				let t = B(this), n = P(e.id).map((e) => be.get(e)).filter((e) => e && Number.isFinite(e.x) && Number.isFinite(e.y));
				if (n.length === 0) {
					t.style("display", "none");
					return;
				}
				let r = p(n, (e) => e.x), i = p(n, (e) => e.y);
				fe.set(e.id, {
					x: r,
					y: i
				});
				let a = F.has(e.id), o = e._fs || 52;
				if (a) {
					t.style("display", null), t.select(".container-hull").style("display", "none"), t.select(".container-badge").style("display", "none"), t.select(".container-macro-text").attr("font-size", `${o}px`), t.select(".container-macro-node").style("display", null).attr("transform", `translate(${r}, ${i})`);
					return;
				}
				t.style("display", null), t.select(".container-macro-node").style("display", "none"), t.select(".container-hull").style("display", null), t.select(".container-badge").style("display", null);
				let s = [], c = !e.parent, l = e.padding || (c ? 75 : 42);
				for (let t of ce.get(e.id) || []) if (F.has(t)) {
					let e = fe.get(t);
					if (e) {
						let n = ue.find((e) => e.id === t), r = n?._macroHalfW || 130, i = n?._macroHalfH || 45;
						s.push([e.x - r, e.y - i], [e.x + r, e.y - i], [e.x + r, e.y + i], [e.x - r, e.y + i]);
					}
				}
				let u = n.filter((e) => {
					for (let t of F) if (P(t).includes(e.id)) return !1;
					return !0;
				});
				if (u.length === 0 && s.length === 0) {
					t.select(".container-hull").style("display", "none"), t.select(".container-badge").style("display", "none");
					return;
				}
				for (let e of u) {
					let t = e._size?.width || (e.type === "article" ? g.width : e.size), n = e._size?.height || (e.type === "article" ? g.height : e.size), r = t / 2 + l, i = n / 2 + l;
					s.push([e.x - r, e.y - i], [e.x + r, e.y - i], [e.x + r, e.y + i], [e.x - r, e.y + i]);
				}
				let d = Wa(s);
				if (!d || d.length < 3) return;
				let m = ye(d);
				t.select(".container-hull").attr("d", m);
				let h = Math.min(...d.map((e) => e[1])), _ = Math.max(...d.map((e) => e[1])), v = p(d, (e) => e[0]), y = Math.min(...d.map((e) => e[0])), b = Math.max(...d.map((e) => e[0])) - y, x = f.labelSize?.min || 32, S = f.labelSize?.max || 96, C = Math.max(x, Math.min(S, b / 8)), w = t.select(".container-badge");
				w.select(".container-badge-text").attr("font-size", `${C}px`), w.select(".label-count").text(` ${n.length}`);
				let T = Ba(d), E = Number.isFinite(T[0]) ? T[0] : v, D = h + (_ - h) / 3;
				w.attr("transform", `translate(${E}, ${D})`);
			});
		}
		function Ce() {
			let e = /* @__PURE__ */ new Set();
			for (let t of F) for (let n of P(t)) e.add(n);
			L && L.style("display", (t) => e.has(t.id) ? "none" : null), I.style("display", (t) => e.has(t.id) ? "none" : null), Se(), Be();
		}
		function we(e) {
			let t = typeof e.source == "object" ? e.source.x : 0, n = typeof e.source == "object" ? e.source.y : 0, r = typeof e.target == "object" ? e.target.x : 0, i = typeof e.target == "object" ? e.target.y : 0, a = typeof e.source == "object" ? e.source.id : e.source, o = typeof e.target == "object" ? e.target.id : e.target, s = null, c = null;
			for (let e of F) {
				let t = P(e);
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
				let e = fe.get(s);
				e && (t = e.x, n = e.y);
			}
			if (c) {
				let e = fe.get(c);
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
			let f = l / d, p = u / d, m = s ? 90 : (e.source._size?.width || g.width) / 2 + 4, h = s ? 45 : (e.source._size?.height || g.height) / 2 + 4, _ = Math.min(Math.abs(f) > 1e-4 ? m / Math.abs(f) : Infinity, Math.abs(p) > 1e-4 ? h / Math.abs(p) : Infinity), v = c ? 90 : (e.target._size?.width || g.width) / 2 + 4, y = c ? 45 : (e.target._size?.height || g.height) / 2 + 4, b = Math.min(Math.abs(f) > 1e-4 ? v / Math.abs(f) : Infinity, Math.abs(p) > 1e-4 ? y / Math.abs(p) : Infinity);
			return d <= _ + b ? {
				x1: t,
				y1: n,
				x2: r,
				y2: i,
				hidden: !1
			} : {
				x1: t + f * _,
				y1: n + p * _,
				x2: r - f * b,
				y2: i - p * b,
				hidden: !1
			};
		}
		function Te(e, t) {
			if (t.hidden) return "M 0 0";
			if (e.layer !== "sequence") return `M ${t.x1} ${t.y1} L ${t.x2} ${t.y2}`;
			let n = t.x2 - t.x1, r = t.y2 - t.y1, i = Math.hypot(n, r);
			if (i < 2) return `M ${t.x1} ${t.y1} L ${t.x2} ${t.y2}`;
			let a = (t.x1 + t.x2) / 2, o = (t.y1 + t.y2) / 2, s = -r / i, c = n / i, l = Math.min(80, Math.max(36, i * .22)), u = a + s * l, d = o + c * l;
			return `M ${t.x1} ${t.y1} Q ${u} ${d} ${t.x2} ${t.y2}`;
		}
		let Ee = d.selectAll(".link").data(o.links).enter().append("path").attr("class", (e) => [
			"link",
			e.layer ? `link-${e.layer}` : "",
			e.role ? `link-role-${e.role}` : ""
		].filter(Boolean).join(" ")).attr("fill", "none").style("stroke", (e) => {
			if (e.layer !== "sequence") return null;
			let t = typeof e.source == "object" ? e.source.id : e.source;
			return be.get(t)?.containerColor || "var(--gv-accent, #d4af37)";
		}).style("stroke-opacity", (e) => e.layer === "sequence" ? .45 : null), De = d.selectAll(".link-sequence-pulse").data(o.links.filter((e) => e.layer === "sequence")).enter().append("path").attr("class", "link-sequence-pulse").attr("fill", "none").attr("pathLength", 100).style("stroke", (e) => {
			let t = typeof e.source == "object" ? e.source.id : e.source;
			return be.get(t)?.containerColor || "#ffe066";
		}).style("filter", (e) => {
			let t = typeof e.source == "object" ? e.source.id : e.source;
			return `drop-shadow(0 0 4px ${be.get(t)?.containerColor || "#ffd700"})`;
		}), I = d.selectAll(".node").data(o.nodes).enter().append("g").attr("class", "node"), Oe = Kt().clickDistance(5).filter((e) => {
			if (e.ctrlKey || e.button !== void 0 && e.button !== 0) return !1;
			if (e.pointerType === "touch" || e.type === "touchstart") {
				let t = e.target;
				if (t && t.closest && t.closest(".rp-scroll")) return !1;
			}
			return !0;
		}).on("start", (e, t) => {
			e.sourceEvent && e.sourceEvent.stopPropagation(), t.fx = t.x, t.fy = t.y;
			let n = e.sourceEvent && e.sourceEvent.target;
			if (t._resizing = !!(n && n.closest && n.closest("[data-resize=\"1\"]")), t._resizing) {
				let n = t._size || T({
					hovered: te.current === t.id,
					pinned: N.current.has(t.id)
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
					width: r(n.w + (e.x - n.x) * 2, g.minWidth, g.maxWidth),
					height: r(n.h + (e.y - n.y) * 2, g.minHeight, g.maxHeight)
				}, R(t), w.current && w.current.setNodeSize(j(t), t._size.width, t._size.height, { transient: !0 }), Se();
				return;
			}
			t.x = e.x, t.y = e.y, t.fx = e.x, t.fy = e.y, w.current && w.current.setNodePosition(j(t), e.x, e.y, { transient: !0 }), I.filter((e) => e.id === t.id).attr("transform", "translate(" + e.x + "," + e.y + ")"), L && L.filter((e) => e.id === t.id).style("transform", `translate3d(${e.x}px, ${e.y}px, 0px)`), A.current && A.current(), Ee.each(function(e) {
				let n = typeof e.source == "object" ? e.source.id : e.source, r = typeof e.target == "object" ? e.target.id : e.target;
				if (n === t.id || r === t.id) {
					let t = we(e);
					B(this).attr("d", Te(e, t));
				}
			}), De.each(function(e) {
				let n = typeof e.source == "object" ? e.source.id : e.source, r = typeof e.target == "object" ? e.target.id : e.target;
				if (n === t.id || r === t.id) {
					let t = we(e);
					B(this).attr("d", Te(e, t));
				}
			}), Se();
		}).on("end", (e, t) => {
			let n = w.current;
			if (t._resizing) {
				t._resizing = !1, n && n.commit(), Se();
				return;
			}
			t.fx = t.x, t.fy = t.y, n && (n.setNodePosition(M(t), t.x, t.y, { transient: !0 }), n.commit()), Se();
		});
		I.call(Oe);
		let ke = s.append("text").style("font-family", "'Atkinson', sans-serif").style("visibility", "hidden"), Ae = typeof document < "u" ? document.createElement("canvas").getContext("2d") : null;
		function je(e, t) {
			if (!Ae) return {
				width: e.length * t * .5,
				ascent: t * .7,
				descent: t * .2
			};
			Ae.font = "500 " + t + "px 'Atkinson', sans-serif";
			let n = Ae.measureText(e);
			return {
				width: n.actualBoundingBoxLeft + n.actualBoundingBoxRight,
				ascent: n.actualBoundingBoxAscent,
				descent: n.actualBoundingBoxDescent
			};
		}
		let Me = [];
		function Ne(e) {
			let { d: t, textEl: n, rectEl: r, lines: i, fontSize: a, lineH: o } = e, s = i.map((e) => je(e, a)), c = i.map((e, t) => t * o), l = Math.min(...c.map((e, t) => e - s[t].ascent)), u = Math.max(...c.map((e, t) => e + s[t].descent)), d = -(l + u) / 2, f = l + d, p = u + d, m = Math.max(...s.map((e) => e.width));
			n.selectAll("tspan").each(function(e, t) {
				B(this).attr("y", c[t] + d);
			}), r.attr("x", -m / 2 - _.padding).attr("y", f - _.padding).attr("width", m + _.padding * 2).attr("height", p - f + _.padding * 2), t._r = Math.hypot(m + _.padding * 2, p - f + _.padding * 2) / 2;
		}
		I.each(function(e) {
			let t = B(this);
			if (e.type !== "article") {
				let n = _.fontSize, r = _.padding, i = _.maxWidth, a = _.maxLines;
				ke.style("font-size", n + "px").style("font-weight", "500");
				let o = (e) => (ke.text(e), ke.node().getComputedTextLength()), s = e.label.split(/(?<=-)|\s+/).filter(Boolean), c = (e) => e.join("").replace(/\s+$/, "").trim(), l = [e.label];
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
					rectEl: t.insert("rect", "text").attr("rx", _.cornerRadius).attr("ry", _.cornerRadius).attr("fill", "var(--gv-" + (e.type === "tag" ? "tag-color" : e.type === "topology" ? "topology-color" : "placeholder-color") + ")").attr("opacity", _.opacity),
					lines: l,
					fontSize: n,
					lineH: u
				};
				Me.push(f), Ne(f);
			} else {
				let t = T({
					hovered: !1,
					pinned: !1
				});
				e._r = Math.hypot(t.width, t.height) / 2;
			}
		}), ke.remove(), typeof document < "u" && document.fonts && document.fonts.ready && document.fonts.ready.then(() => {
			Me.forEach(Ne);
		}).catch(() => {});
		let Pe = /* @__PURE__ */ new Map(), L = u.selectAll(".node-card").data(o.nodes.filter((e) => e.type === "article")), Fe = L.enter().append("div").attr("class", "node-card").style("position", "absolute").style("left", "0").style("top", "0").style("will-change", "transform").style("pointer-events", "auto").call(Oe);
		L = L.merge(Fe), Fe.each(function(e) {
			let t = c(this);
			Pe.set(e.id, {
				root: t,
				wrapper: this,
				cardSelection: B(this)
			});
		});
		function R(e) {
			if (e.type !== "article") return;
			let n = Pe.get(e.id);
			if (!n) return;
			let r = te.current === e.id, i = N.current.has(e.id), a = Ko(ne.current), o = T({
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
			let l = zo(e.kind), u = w.current, d = u ? u.bookmarks(j(e)) : [];
			n.root.render(t.createElement(l, {
				article: e,
				width: s,
				height: c,
				viewState: {
					hovered: r,
					pinned: i,
					lod: a,
					zoomScale: ne.current,
					bookmarks: d,
					bookmarkCount: d.length
				},
				fullContent: e._fullContent || null,
				cardSettings: g,
				onResize: ({ width: t, height: r }) => {
					e._customWidth = t, e._customHeight = r, e._size = {
						width: t,
						height: r
					}, n.wrapper.style.width = t + "px", n.wrapper.style.height = r + "px", n.wrapper.style.marginLeft = -t / 2 + "px", n.wrapper.style.marginTop = -r / 2 + "px", e._r = Math.max(t, r) / 2, R(e);
				}
			}));
		}
		L.on("wheel", (e) => e.stopPropagation());
		function Ie() {
			o.nodes.forEach((e) => {
				e.type === "article" && R(e);
			});
		}
		ee.current = Ie;
		let Le = /* @__PURE__ */ new Map();
		function Re(e) {
			if (Le.has(e.id)) return e._fullContent = Le.get(e.id), Promise.resolve();
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
				r && r.remove();
				let i = n.querySelector("body") ? n.querySelector("body").innerHTML : t;
				Le.set(e.id, i), e._fullContent = i;
			}).catch(() => {
				Le.set(e.id, null), e._fullContent = null;
			});
		}
		Ie(), N.current.forEach((e) => {
			let t = o.nodes.find((t) => t.id === e);
			t && (L.filter((t) => t.id === e).raise().style("z-index", 10), Re(t).then(() => {
				N.current.has(e) && R(t);
			}));
		}), Ho(s, l, ie.current), L.on("mouseover", (e, t) => {
			te.current !== t.id && (te.current = t.id, R(t), e.currentTarget.style.zIndex = 10);
		}).on("mouseout", (e, t) => {
			let n = e.relatedTarget;
			n && e.currentTarget.contains(n) || te.current === t.id && (te.current = null, R(t), e.currentTarget.style.zIndex = "");
		}).on("dblclick", (e, t) => {
			e.stopPropagation(), e.preventDefault(), C.current && C.current(t.originalItem || t), N.current.delete(t.id), w.current && w.current.setNodePinned(j(t), !1), te.current = null, R(t);
		}).on("click", (e, t) => {
			let n = e.target;
			if (n && (n.dataset?.popout === "1" || n.closest?.("[data-popout=\"1\"]"))) {
				e.stopPropagation(), C.current && C.current(t.originalItem || t), N.current.has(t.id) && (N.current.delete(t.id), w.current && w.current.setNodePinned(j(t), !1), te.current = null, R(t), e.currentTarget.style.zIndex = "");
				return;
			}
			e.stopPropagation(), N.current.has(t.id) ? (N.current.delete(t.id), w.current && w.current.setNodePinned(j(t), !1), R(t), e.currentTarget.style.zIndex = "") : (N.current.add(t.id), w.current && w.current.setNodePinned(j(t), !0), R(t), I.filter((e) => e.id === t.id).raise(), L.filter((e) => e.id === t.id).raise(), e.currentTarget.style.zIndex = 10, Re(t).then(() => {
				N.current.has(t.id) && R(t);
			}));
		});
		let ze = null;
		I.filter((e) => e.type !== "article").on("click", (e, t) => {
			if (e.stopPropagation(), ze === t.id) ze = null, I.classed("dimmed", !1).classed("tag-active", !1), L.classed("dimmed", !1), Ee.classed("highlighted", !1);
			else {
				ze = t.id;
				let e = new Set(o.links.filter((e) => {
					let n = typeof e.source == "object" ? e.source.id : e.source, r = typeof e.target == "object" ? e.target.id : e.target;
					return n === t.id || r === t.id;
				}).map((e) => {
					let n = typeof e.source == "object" ? e.source.id : e.source, r = typeof e.target == "object" ? e.target.id : e.target;
					return n === t.id ? r : n;
				}));
				e.add(t.id), I.classed("dimmed", (t) => !e.has(t.id)), I.classed("tag-active", (e) => e.id === t.id), L.classed("dimmed", (t) => !e.has(t.id)), Ee.classed("highlighted", (e) => {
					let n = typeof e.source == "object" ? e.source.id : e.source, r = typeof e.target == "object" ? e.target.id : e.target;
					return n === t.id || r === t.id;
				});
			}
		}), s.on("click", () => {
			ze && (ze = null, I.classed("dimmed", !1).classed("tag-active", !1), L.classed("dimmed", !1), Ee.classed("highlighted", !1)), C.current && C.current(null);
		});
		function Be() {
			Ee.each(function(e) {
				let t = we(e);
				B(this).attr("d", Te(e, t));
			}), De.each(function(e) {
				let t = we(e);
				B(this).attr("d", Te(e, t));
			}), I.attr("transform", (e) => "translate(" + e.x + "," + e.y + ")"), L && L.style("transform", (e) => `translate3d(${e.x}px, ${e.y}px, 0px)`), Se();
		}
		let Ve = !1;
		E.current = {
			data: o,
			nodes: I,
			articleNodes: L,
			links: Ee,
			applyPositions: Be,
			svg: s,
			zoom: m,
			fitToViewport: Ue,
			simulation: O,
			axisLayer: oe,
			g: d,
			updateContainers: Se
		};
		let He = 0;
		O.nodes(o.nodes).on("tick", () => {
			Be(), Ve ||= Ue({ initialZoomOut: !0 }), A.current && A.current(), ++He, k.current && He % 25 == 0 && k.current();
		}), O.force("link").links(o.links), Ve ||= Ue({ initialZoomOut: !0 }), Be();
		function Ue({ animate: e = !1, initialZoomOut: t = !1 } = {}) {
			let n = o.nodes.filter((e) => e.type === "article");
			if (n.length < 2) return !1;
			let r = (e) => {
				let t = [...e].sort((e, t) => e - t), n = Math.floor(t.length / 2);
				return t.length % 2 ? t[n] : (t[n - 1] + t[n]) / 2;
			}, i = (e) => {
				let t = [...e].sort((e, t) => e - t);
				return [t[Math.floor(t.length * .1)], t[Math.ceil(t.length * .9) - 1]];
			}, a = n.map((e) => e.x), c = n.map((e) => e.y), [l, u] = i(a), [d, f] = i(c), p = l - 140, h = u + 140, g = d - 140, _ = f + 140, y = r(a), x = r(c), S = b.current ? b.current.clientWidth : window.innerWidth, C = b.current ? b.current.clientHeight : window.innerHeight;
			if (S < 50 && (S = window.innerWidth), C < 50 && (C = window.innerHeight), S < 50 || C < 50) return !1;
			let w = .2, T = Math.max(Math.min(S / Math.max(h - p, 1), C / Math.max(_ - g, 1), 1), w);
			t && (v ? T = w * .85 : T *= .85);
			let E = S / 2 - y * T, D = C / 2 - x * T, O = fo.translate(E, D).scale(T);
			return e ? s.transition().duration(750).call(m.transform, O) : s.call(m.transform, O), !0;
		}
		let We = !1;
		O.on("end", () => {
			if (We = !0, D.current !== "force" || (o.nodes.forEach((e) => {
				e.fx = e.x, e.fy = e.y, e._forcePos = {
					x: e.x,
					y: e.y
				};
			}), (0, Bo.layoutIsDegenerate)(o.nodes, T({
				hovered: !1,
				pinned: !1
			})))) return;
			let e = w.current;
			if (e) {
				let t = !1;
				for (let n of o.nodes) !n.pinned && n._forcePos && (e.setNodePosition("force::" + j(n), n.x, n.y, { silent: !0 }), t = !0);
				t && e.notify();
			}
			k.current && k.current();
		});
		let Ge = () => {
			if (!document.hidden) {
				if (!We) {
					O.alpha(.8).restart();
					return;
				}
				Ve ||= Ue({ initialZoomOut: !0 });
			}
		};
		document.addEventListener("visibilitychange", Ge);
		let Ke = () => {
			Ue({ animate: !0 });
		}, qe = () => {
			o.nodes.forEach((e) => {
				e.fx = null, e.fy = null, delete e._forcePos;
			});
			let e = w.current;
			if (e) for (let t of o.nodes) {
				let n = M(t);
				e.nodeState(n) && e.setNodePosition(n, t.x, t.y, { silent: !0 });
			}
			O.alpha(.8).restart();
		}, Je = () => {
			let e = T({
				hovered: !1,
				pinned: !1
			});
			o.nodes.forEach((e) => {
				delete e._size;
			});
			let t = w.current;
			if (t) for (let n of o.nodes) t.setNodeSize(j(n), e.width, e.height, { silent: !0 });
			Be();
		}, Ye = () => {
			let e = w.current;
			e && e.resetLayout && e.resetLayout(), o.nodes.forEach((e) => {
				e.fx = null, e.fy = null, delete e._forcePos;
			}), O.alpha(.8).restart(), Ue({ animate: !0 });
		};
		return window.addEventListener("graph:zoom-to-fit", Ke), window.addEventListener("graph:unpin-all", qe), window.addEventListener("graph:reset-sizes", Je), window.addEventListener("graph:reset-layout", Ye), () => {
			ee.current = null, O.stop(), document.removeEventListener("visibilitychange", Ge), window.removeEventListener("resize", ae), window.removeEventListener("graph:zoom-to-fit", Ke), window.removeEventListener("graph:unpin-all", qe), window.removeEventListener("graph:reset-sizes", Je), window.removeEventListener("graph:reset-layout", Ye), Pe.forEach(({ root: e }) => {
				queueMicrotask(() => e.unmount());
			}), Pe.clear();
		};
	}, [e]), r(() => {
		let e = E.current;
		if (!e || !e.axisLayer) return;
		let t = d || {}, n = () => ae(e, t);
		k.current = t.on ? n : null, n();
	}, [
		d,
		l,
		e
	]);
	function ae(e, t) {
		if (e.axisLayer.selectAll("*").remove(), A.current = null, !t.on) {
			O.current = !1;
			return;
		}
		let n = b.current, r = n ? n.clientWidth : window.innerWidth, i = n ? n.clientHeight : window.innerHeight;
		if (r < 60 || i < 60) return;
		let a = t.dock || v.dock, o = a === "left" || a === "right", s = v.endPadding, c = Number.isFinite(t.offset) ? t.offset : v.inset, l = a === "right" ? r - c : a === "bottom" ? i - c : c, u = Math.max((o ? i : r) - s * 2, 120), d = o ? {
			x: l,
			y: s
		} : {
			x: s,
			y: l
		}, f = (0, Bo.dimensionAxisGeometry)(e.data.nodes, {
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
				let n = m.append("line").attr("class", "time-connector").attr("data-node", e.id).attr("x1", t.x).attr("y1", t.y).attr("stroke", e._source && e._source.color || "#7f8ea3").attr("stroke-width", v.connectorWidth).attr("stroke-opacity", v.connectorOpacity);
				h.push({
					node: e,
					anchor: t,
					line: n
				});
			});
		});
		function g() {
			let t = po(e.svg.node());
			h.forEach(({ node: e, anchor: n, line: r }) => {
				let i = t.apply([e.x, e.y]);
				r.attr("x1", n.x).attr("y1", n.y).attr("x2", i[0]).attr("y2", i[1]);
			});
		}
		A.current = g, g();
		let _ = p.append("g").attr("class", "time-spine").style("cursor", o ? "ew-resize" : "ns-resize");
		_.append("rect").attr("x", o ? l - 34 / 2 : 0).attr("y", o ? 0 : l - 34 / 2).attr("width", o ? 34 : r).attr("height", o ? i : 34).attr("fill", "rgba(18,20,28,0.82)"), _.append("line").attr("x1", f.from.x).attr("y1", f.from.y).attr("x2", f.to.x).attr("y2", f.to.y).attr("stroke", "rgba(255,255,255," + v.spineOpacity + ")").attr("stroke-width", v.spineWidth);
		let y = v.tickFontSize, x = f.ticks.length > 1 ? Math.hypot(f.ticks[1].x - f.ticks[0].x, f.ticks[1].y - f.ticks[0].y) : Infinity, S = o ? y * 1.7 : y * 4.2, C = Math.max(1, Math.ceil(S / Math.max(x, 1)));
		f.ticks.forEach((e, t) => {
			_.append("line").attr("x1", e.x).attr("y1", e.y).attr("x2", e.x + (o ? 9 : 0)).attr("y2", e.y + (o ? 0 : -9)).attr("stroke", "rgba(255,255,255,0.45)").attr("stroke-width", 1.5), t % C === 0 && _.append("text").attr("x", e.x + (o ? 13 : 0)).attr("y", e.y + (o ? 0 : -14)).attr("text-anchor", o ? "start" : "middle").attr("dominant-baseline", o ? "central" : "auto").style("font-family", "'Atkinson', sans-serif").style("font-size", y + "px").style("fill", "rgba(255,255,255,0.62)").style("pointer-events", "none").text(e.label);
		});
		let T = null, E = 0;
		_.call(Kt().on("start", (e) => {
			T = o ? e.x : e.y, E = 0;
		}).on("drag", (e) => {
			T !== null && (E = (o ? e.x : e.y) - T, _.attr("transform", o ? "translate(" + E + ",0)" : "translate(0," + E + ")"), m.selectAll("line").attr(o ? "x1" : "y1", function() {
				return Number(B(this).attr(o ? "x1" : "y1"));
			}), h.forEach(({ anchor: e, line: t }) => {
				o ? t.attr("x1", e.x + E) : t.attr("y1", e.y + E);
			}));
		}).on("end", () => {
			if (T !== null && E && w.current) {
				let e = a === "right" || a === "bottom" ? c - E : c + E;
				w.current.setTimeAxis({
					offset: Math.max(20, e),
					moved: !0
				});
			}
			T = null;
		}));
	}
	return r(() => {
		D.current = l;
		let e = E.current;
		if (!e) return;
		let t = w.current, n = T({
			hovered: !1,
			pinned: !1
		});
		if (l === "force" && e.data.nodes.filter((e) => {
			let n = t && t.nodeState("force::" + j(e));
			return n && !n.auto || e._forcePos;
		}).length < e.data.nodes.length * .5) {
			e.data.nodes.forEach((e) => {
				let n = t && t.nodeState("force::" + j(e));
				n && !n.auto ? (e.fx = n.x, e.fy = n.y) : (e.fx = null, e.fy = null);
			}), e.simulation.alpha(1).restart();
			return;
		}
		let r = l === "force" ? Object.fromEntries(e.data.nodes.map((e) => [e.id, e._forcePos || t && t.nodeState("force::" + j(e)) || {
			x: e.x,
			y: e.y
		}])) : (0, Bo.computeLayout)(l, e.data.nodes, {
			cardW: n.width,
			cardH: n.height
		});
		if (!r) return;
		let i = new Map(e.data.nodes.map((e) => [e.id, {
			x: e.x,
			y: e.y
		}]));
		e.data.nodes.forEach((e) => {
			let n = t && t.nodeState(l + "::" + j(e)), i = n && typeof n.x == "number" && !n.auto ? {
				x: n.x,
				y: n.y
			} : r[e.id];
			i && (e.targetX = i.x, e.targetY = i.y, e.fx = i.x, e.fy = i.y, t && !(n && !n.auto) && t.setNodePosition(l + "::" + j(e), i.x, i.y, { silent: !0 }));
		});
		let a = zi;
		Ii().duration(760).ease(a).tween("layout-transition", () => {
			let t = e.data.nodes.map((e) => {
				let t = i.get(e.id) || {
					x: e.x,
					y: e.y
				}, n = typeof e.targetX == "number" ? e.targetX : e.x, r = typeof e.targetY == "number" ? e.targetY : e.y, a = Ln(t.x, n), o = Ln(t.y, r);
				return (t) => {
					e.x = a(t), e.y = o(t);
				};
			});
			return (n) => {
				for (let e = 0; e < t.length; e++) t[e](n);
				e.applyPositions(), A.current && A.current();
			};
		}).on("end", () => {
			e.data.nodes.forEach((e) => {
				typeof e.targetX == "number" && (e.x = e.targetX), typeof e.targetY == "number" && (e.y = e.targetY), delete e.targetX, delete e.targetY;
			}), e.applyPositions(), A.current && A.current();
		});
		let o = setTimeout(() => {
			k.current && k.current(), e.fitToViewport && e.fitToViewport();
		}, 800);
		return () => clearTimeout(o);
	}, [l]), /* @__PURE__ */ u("div", {
		ref: b,
		className: Co.graphContainer
	});
}
var q = {
	overlay: "_overlay_w58lt_4",
	open: "_open_w58lt_16",
	panel: "_panel_w58lt_20",
	minimized: "_minimized_w58lt_63",
	wide: "_wide_w58lt_70",
	toolbar: "_toolbar_w58lt_89",
	dragGrip: "_dragGrip_w58lt_106",
	windowControls: "_windowControls_w58lt_114",
	restorePill: "_restorePill_w58lt_120",
	popIn: "_popIn_w58lt_1",
	pillIcon: "_pillIcon_w58lt_149",
	pillLabel: "_pillLabel_w58lt_153",
	pillTitle: "_pillTitle_w58lt_159",
	pillAuthor: "_pillAuthor_w58lt_169",
	pillAction: "_pillAction_w58lt_175",
	toolbarGroup: "_toolbarGroup_w58lt_190",
	toolbarSeparator: "_toolbarSeparator_w58lt_196",
	toolbarSpacer: "_toolbarSpacer_w58lt_203",
	tb: "_tb_w58lt_207",
	active: "_active_w58lt_229",
	closeBtn: "_closeBtn_w58lt_234",
	tbTooltip: "_tbTooltip_w58lt_249",
	syndLink: "_syndLink_w58lt_269",
	canonical: "_canonical_w58lt_287",
	progress: "_progress_w58lt_303",
	progressFill: "_progressFill_w58lt_309",
	frontmatterPanel: "_frontmatterPanel_w58lt_316",
	fmRow: "_fmRow_w58lt_330",
	fmLabel: "_fmLabel_w58lt_337",
	fmValue: "_fmValue_w58lt_346",
	fmTag: "_fmTag_w58lt_350",
	fmSyndLink: "_fmSyndLink_w58lt_360",
	body: "_body_w58lt_370",
	articleHeader: "_articleHeader_w58lt_417",
	articleTitle: "_articleTitle_w58lt_421",
	articleByline: "_articleByline_w58lt_429",
	articleMeta: "_articleMeta_w58lt_444",
	copyToast: "_copyToast_w58lt_449",
	show: "_show_w58lt_465",
	bookmarkRibbon: "_bookmarkRibbon_w58lt_470",
	ribbonTooltip: "_ribbonTooltip_w58lt_493",
	inlineNoteForm: "_inlineNoteForm_w58lt_519",
	inlineNoteInput: "_inlineNoteInput_w58lt_525",
	marksPanel: "_marksPanel_w58lt_541",
	marksHeader: "_marksHeader_w58lt_550",
	marksList: "_marksList_w58lt_562",
	markItem: "_markItem_w58lt_568",
	markBody: "_markBody_w58lt_585",
	markQuote: "_markQuote_w58lt_591",
	markNote: "_markNote_w58lt_598",
	markNoteEmpty: "_markNoteEmpty_w58lt_607",
	markNoteInput: "_markNoteInput_w58lt_612",
	markActions: "_markActions_w58lt_624",
	markBtn: "_markBtn_w58lt_631",
	markBtnDanger: "_markBtnDanger_w58lt_651",
	noMarks: "_noMarks_w58lt_657"
}, J = {
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
	trash: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"3 6 5 6 21 6\"/><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"/></svg>"
}, Yo = (/* @__PURE__ */ f(((e, t) => {
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
})))();
function Xo({ article: e, onClose: t, settings: n, viewState: i, targetParagraph: s }) {
	let [c, f] = o(!1), [p, m] = o(!1), [h, g] = o(null), [_, v] = o(!1), [y, b] = o(""), [x, S] = o(0), [C, w] = o(!1), [T, E] = o(!1), D = a(null), O = a(!1), k = a({
		mouseX: 0,
		mouseY: 0,
		posX: 0,
		posY: 0
	}), [A, ee] = o(!1), [j, M] = o(null);
	r(() => {
		e ? (f(!0), m(!1), ee(!1), M(null), ie(e)) : (f(!1), m(!1), b(""), S(0), v(!1));
	}, [e]);
	let N = (t) => {
		if (!t) return null;
		let n = N(e);
		return i && i.bookmarks().find((e) => e.id === n), i && i.bookmarks(), t.originalItem && t.originalItem.id || t.id || t.url;
	}, te = (e) => {
		e.target.closest("button") || e.target.closest("a") || e.target.closest("input") || (O.current = !0, k.current = {
			mouseX: e.clientX,
			mouseY: e.clientY,
			posX: h ? h.x : 0,
			posY: h ? h.y : 0
		}, window.addEventListener("mousemove", ne), window.addEventListener("mouseup", re));
	}, ne = (e) => {
		if (!O.current) return;
		let t = e.clientX - k.current.mouseX, n = e.clientY - k.current.mouseY;
		g({
			x: k.current.posX + t,
			y: k.current.posY + n
		});
	}, re = () => {
		O.current = !1, window.removeEventListener("mousemove", ne), window.removeEventListener("mouseup", re);
	}, ie = async (e) => {
		let t = e.kind || "essay";
		if (t === "placeholder" || e.substrate === "placeholder") {
			let t = e.series_part || e.title || "";
			b(`
        <div style="padding: 40px 24px; text-align: center; border: 1px dashed rgba(212, 175, 55, 0.35); border-radius: 12px; background: rgba(20, 24, 38, 0.6); margin-top: 24px;">
          <div style="font-size: 32px; margin-bottom: 12px; opacity: 0.9;">📖</div>
          <div style="font-size: 20px; font-weight: 600; color: var(--rp-accent, #d4af37); margin-bottom: 8px;">Chapter ${t}</div>
          <div style="font-size: 13px; color: var(--rp-text, #a8b2d1); opacity: 0.8; letter-spacing: 0.5px;">Act ${Number(t) >= 21 ? "3" : "2"} · In Progress</div>
        </div>
      `);
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
			a && a.remove(), b((i.querySelector("body") ? i.querySelector("body").innerHTML : r) + Qo(e));
		} catch {
			b(Zo(e, "Rendered article not yet published to GitHub Pages."));
		}
		else b(t === "image" ? (e.image ? `<img src="${e.image}" style="max-width:100%;height:auto;border-radius:4px;display:block;margin:0 auto;">` : "<p style=\"color:#666;\">No image resolved.</p>") + $o(e) : Zo(e) + $o(e));
	}, ae = () => {
		if (D.current) {
			let { scrollTop: e, scrollHeight: t, clientHeight: n } = D.current, r = e / (t - n) * 100;
			S(Math.min(r, 100));
		}
	}, oe = () => {
		if (!i || !e) return;
		let t = N(e);
		if (i.bookmarks().some((e) => e.id === t)) i.removeBookmark(t);
		else {
			let n = se();
			i.addBookmark({
				item: t,
				para: n === null ? void 0 : n,
				version: e.version
			});
		}
	}, se = () => {
		if (!D.current) return null;
		let e = D.current.getBoundingClientRect(), t = D.current.querySelectorAll("p");
		for (let n = 0; n < t.length; n++) if (t[n].getBoundingClientRect().bottom > e.top + 10) return n;
		return null;
	}, ce = async () => {
		if (!e) return;
		let t = N(e), n = se(), r = window.location.href.split("#")[0] + "#read=" + encodeURIComponent(t);
		n !== null && (r += "&p=" + n);
		try {
			await navigator.clipboard.writeText(r), w(!0), setTimeout(() => w(!1), 2e3);
		} catch (e) {
			console.error("Copy link failed:", e);
		}
	}, le = (e) => {
		if (!D.current || e == null) return;
		let t = D.current.querySelectorAll("p");
		if (t[e]) {
			let n = D.current.getBoundingClientRect(), r = t[e].getBoundingClientRect();
			D.current.scrollTop += r.top - n.top - 20;
		}
	}, P = async (e, t) => {
		let n = window.location.href.split("#")[0] + "#read=" + encodeURIComponent(e);
		t != null && (n += "&p=" + t);
		try {
			await navigator.clipboard.writeText(n), w(!0), setTimeout(() => w(!1), 2e3);
		} catch (e) {
			console.error("Copy link failed:", e);
		}
	}, ue = async () => {
		if (!e || !D.current) return;
		let t = `${(n?.export?.license_header || "").replace("{{canonical_url}}", e.canonical_url || e.url)}\n\n---\n\n${D.current.innerText}`;
		try {
			await navigator.clipboard.writeText(t), w(!0), setTimeout(() => w(!1), 2e3);
		} catch (e) {
			console.error("Copy failed:", e);
		}
	}, de = () => {
		if (!e || !D.current) return;
		let t = `${(n?.export?.license_header || "").replace("{{canonical_url}}", e.canonical_url || e.url)}\n\n---\n\n${D.current.innerText}`, r = new Blob([t], { type: "text/markdown" }), i = document.createElement("a");
		i.href = URL.createObjectURL(r), i.download = `${(e.id || e.url).split("/").pop().replace(".html", "") || "article"}.md`, i.click(), URL.revokeObjectURL(i.href);
	}, F = async (t) => {
		if (t.preventDefault(), e) try {
			await navigator.clipboard.writeText(e.canonical_url || e.url), w(!0), setTimeout(() => w(!1), 2e3);
		} catch (e) {
			console.error("Copy URL failed:", e);
		}
	};
	if (r(() => {
		y && s != null && D.current && setTimeout(() => {
			le(s);
		}, 50);
	}, [y, s]), r(() => {
		if (!i || !D.current) return;
		let t = e ? N(e) : null, n = i.bookmarks(), r = (e, t, n) => {
			let r = e.para === void 0 ? e.paragraph : e.para;
			if (r == null) return null;
			if (e.version && t.version && e.version !== t.version) {
				if (t.version_maps && t.version_maps[e.version]) {
					let n = t.version_maps[e.version][r];
					if (n !== void 0 && n !== -1) return n;
				}
				if (e.quote) {
					let t = Array.from(n).map((e) => e.innerText);
					return (0, Yo.resolveParagraph)(r, e.quote, t);
				}
			}
			return r;
		};
		if (D.current.querySelectorAll(".bookmarkRibbon").forEach((e) => e.remove()), t) {
			let i = n.find((e) => e.id === t);
			if (i) {
				let t = D.current.querySelectorAll("p"), n = r(i, e, t);
				if (n !== null && t[n]) {
					let e = document.createElement("div");
					e.className = "bookmarkRibbon", e.setAttribute("aria-hidden", "true"), e.innerHTML = J.bookmark, e.style.position = "absolute", e.style.left = "-30px", e.style.top = "0", e.style.color = "var(--rp-accent)", e.style.width = "20px", e.style.height = "20px", t[n].style.position = "relative", t[n].appendChild(e);
				}
			}
		}
	}, [
		y,
		i ? i.bookmarks() : null,
		e
	]), !e) return null;
	let fe = [e.date ? (/* @__PURE__ */ new Date(`${e.date}T00:00:00`)).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	}) : "", e.reading_time].filter(Boolean), pe = (n?.author?.name || n?.author?.display || "harold young").toLowerCase(), me = n?.author?.url;
	return e.authors && e.authors.length > 0 && e.authors[0].name ? (pe = e.authors.map((e) => e.name).join(", ").toLowerCase(), me = e.authors[0].url || e.canonical_url || e.url) : e.author && (pe = e.author.replace(/\s*\[humxn\]/i, "").trim().toLowerCase(), me = e.canonical_url || e.url), /* @__PURE__ */ d(l, { children: [
		/* @__PURE__ */ u("div", {
			className: `${q.overlay} ${c && !p ? q.open : ""}`,
			onClick: t
		}),
		/* @__PURE__ */ d("div", {
			className: `${q.panel} ${c && !p ? q.open : ""} ${p ? q.minimized : ""} ${T ? q.wide : ""}`,
			style: h ? { transform: `translate3d(${h.x}px, ${h.y}px, 0px)` } : void 0,
			children: [
				/* @__PURE__ */ d("div", {
					className: q.toolbar,
					onMouseDown: te,
					onDoubleClick: () => g(null),
					title: "Drag toolbar to move window · Double-click to reset",
					children: [
						/* @__PURE__ */ u("div", {
							className: q.dragGrip,
							title: "Drag to move reading window",
							children: "⋮⋮"
						}),
						/* @__PURE__ */ u("div", {
							id: "tts-mount-point",
							className: q.toolbarGroup
						}),
						/* @__PURE__ */ u("div", { className: q.toolbarSeparator }),
						/* @__PURE__ */ u("div", { className: q.toolbarSeparator }),
						/* @__PURE__ */ d("div", {
							className: q.toolbarGroup,
							children: [/* @__PURE__ */ u("button", {
								className: `${q.tb} ${i && i.bookmarks().some((t) => t.id === N(e)) ? q.active : ""}`,
								onClick: oe,
								title: "Bookmark this position",
								dangerouslySetInnerHTML: { __html: `${i && i.bookmarks().some((t) => t.id === N(e)), J.bookmark}<span class="${q.tbTooltip}">Bookmark</span>` }
							}), /* @__PURE__ */ u("button", {
								className: `${q.tb} ${A ? q.active : ""}`,
								onClick: () => ee(!A),
								title: "View marks list",
								dangerouslySetInnerHTML: { __html: `${J.bookmarkList}<span class="${q.tbTooltip}">Marks list</span>` }
							})]
						}),
						/* @__PURE__ */ u("div", { className: q.toolbarSeparator }),
						/* @__PURE__ */ u("div", {
							className: q.toolbarGroup,
							children: /* @__PURE__ */ u("button", {
								className: q.tb,
								onClick: ce,
								title: "Copy link to here",
								dangerouslySetInnerHTML: { __html: `${J.copy}<span class="${q.tbTooltip}">Link here</span>` }
							})
						}),
						/* @__PURE__ */ u("div", { className: q.toolbarSeparator }),
						/* @__PURE__ */ d("div", {
							className: q.toolbarGroup,
							children: [
								/* @__PURE__ */ u("button", {
									className: `${q.tb} ${_ ? q.active : ""}`,
									onClick: () => v(!_),
									title: "Article details",
									dangerouslySetInnerHTML: { __html: `${J.info}<span class="${q.tbTooltip}">Details</span>` }
								}),
								/* @__PURE__ */ u("button", {
									className: q.tb,
									onClick: de,
									title: "Export markdown",
									dangerouslySetInnerHTML: { __html: `${J.download}<span class="${q.tbTooltip}">Export</span>` }
								}),
								/* @__PURE__ */ u("button", {
									className: q.tb,
									onClick: ue,
									title: "Copy to clipboard",
									dangerouslySetInnerHTML: { __html: `${J.copy}<span class="${q.tbTooltip}">Copy</span>` }
								}),
								/* @__PURE__ */ u("button", {
									className: `${q.tb} ${T ? q.active : ""}`,
									onClick: () => E((e) => !e),
									title: T ? "Shrink reader" : "Widen reader",
									dangerouslySetInnerHTML: { __html: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">${T ? "<polyline points=\"15 3 21 3 21 9\"/><polyline points=\"9 21 3 21 3 15\"/><line x1=\"21\" y1=\"3\" x2=\"14\" y2=\"10\"/><line x1=\"3\" y1=\"21\" x2=\"10\" y2=\"14\"/>" : "<polyline points=\"3 9 3 3 9 3\"/><polyline points=\"21 15 21 21 15 21\"/><line x1=\"3\" y1=\"3\" x2=\"10\" y2=\"10\"/><line x1=\"21\" y1=\"21\" x2=\"14\" y2=\"14\"/>"}</svg><span class="${q.tbTooltip}">${T ? "Shrink" : "Widen"}</span>` }
								})
							]
						}),
						/* @__PURE__ */ u("div", { className: q.toolbarSeparator }),
						/* @__PURE__ */ d("div", {
							className: q.toolbarGroup,
							children: [/* @__PURE__ */ u("button", {
								className: `${q.tb} ${q.syndLink} ${q.canonical}`,
								onClick: F,
								dangerouslySetInnerHTML: { __html: `${J.link}<span class="${q.tbTooltip}">Copy URL</span>` }
							}), Object.entries(e.syndication || {}).map(([e, t]) => {
								if (!t) return null;
								let r = n?.toolbar?.syndication_icons?.[e];
								return r ? /* @__PURE__ */ u("a", {
									href: t,
									target: "_blank",
									rel: "noopener noreferrer",
									className: `${q.tb} ${q.syndLink}`,
									dangerouslySetInnerHTML: { __html: `${J[r.icon] || J.globe}<span class="${q.tbTooltip}">${r.label}</span>` }
								}, e) : null;
							})]
						}),
						/* @__PURE__ */ u("div", { className: q.toolbarSpacer }),
						/* @__PURE__ */ d("div", {
							className: q.windowControls,
							children: [/* @__PURE__ */ u("button", {
								className: `${q.tb} ${q.minimizeBtn}`,
								onClick: () => m(!0),
								title: "Minimize reading window (turn off)",
								dangerouslySetInnerHTML: { __html: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="5" y1="12" x2="19" y2="12"/></svg><span class="${q.tbTooltip}">Minimize</span>` }
							}), /* @__PURE__ */ u("button", {
								className: `${q.tb} ${q.closeBtn}`,
								onClick: t,
								title: "Close reading window",
								dangerouslySetInnerHTML: { __html: `${J.close}<span class="${q.tbTooltip}">Close</span>` }
							})]
						})
					]
				}),
				/* @__PURE__ */ u("div", {
					className: q.progress,
					children: /* @__PURE__ */ u("div", {
						className: q.progressFill,
						style: { width: `${x}%` }
					})
				}),
				currentBookmark && /* @__PURE__ */ u("div", {
					className: q.inlineNotePanel,
					children: /* @__PURE__ */ u("input", {
						type: "text",
						placeholder: "Add an optional note to this bookmark...",
						value: currentBookmark.note || "",
						onChange: (e) => i.setBookmarkNote(pId, e.target.value),
						className: q.noteInput
					})
				}),
				A && /* @__PURE__ */ u("div", {
					className: q.marksListPanel,
					children: allBookmarks.length === 0 ? /* @__PURE__ */ u("div", {
						className: q.noMarks,
						children: "No bookmarks yet."
					}) : allBookmarks.map((t) => /* @__PURE__ */ d("div", {
						className: q.markItem,
						children: [/* @__PURE__ */ d("div", {
							className: q.markMain,
							children: [/* @__PURE__ */ u("div", {
								className: q.markTitle,
								children: t.id
							}), j === t.id ? /* @__PURE__ */ u("input", {
								type: "text",
								value: t.note || "",
								onChange: (e) => i.setBookmarkNote(t.id, e.target.value),
								onBlur: () => M(null),
								onKeyDown: (e) => {
									e.key === "Enter" && M(null);
								},
								className: q.noteInput,
								autoFocus: !0
							}) : /* @__PURE__ */ u("div", {
								className: q.markNote,
								onClick: () => M(t.id),
								children: t.note || /* @__PURE__ */ u("em", { children: "No note (click to add)" })
							})]
						}), /* @__PURE__ */ d("div", {
							className: q.markActions,
							children: [
								t.id === pId && t.paragraph !== void 0 && /* @__PURE__ */ u("button", {
									onClick: () => {
										let n = D.current?.querySelectorAll("p");
										le(n ? getPlacedBookmarkParagraph(t, e, n) : t.para === void 0 ? t.paragraph : t.para);
									},
									title: "Jump to paragraph",
									children: "Jump"
								}),
								/* @__PURE__ */ u("button", {
									onClick: () => {
										let n = D.current?.querySelectorAll("p"), r = n ? getPlacedBookmarkParagraph(t, e, n) : t.para === void 0 ? t.paragraph : t.para;
										P(t.id, r);
									},
									title: "Copy link",
									dangerouslySetInnerHTML: { __html: J.copy }
								}),
								/* @__PURE__ */ u("button", {
									onClick: () => i.removeBookmark(t.id),
									title: "Remove bookmark",
									dangerouslySetInnerHTML: { __html: J.trash }
								})
							]
						})]
					}, t.id))
				}),
				_ && /* @__PURE__ */ u(es, {
					article: e,
					settings: n
				}),
				/* @__PURE__ */ d("div", {
					className: q.body,
					"data-tts-target": !0,
					ref: D,
					onScroll: ae,
					children: [/* @__PURE__ */ d("div", {
						className: q.articleHeader,
						children: [
							/* @__PURE__ */ u("div", {
								className: q.articleTitle,
								children: e.title || e.label
							}),
							/* @__PURE__ */ d("div", {
								className: q.articleByline,
								children: ["by ", me ? /* @__PURE__ */ u("a", {
									href: me,
									target: "_blank",
									rel: "noopener noreferrer",
									children: pe
								}) : pe]
							}),
							fe.length > 0 && /* @__PURE__ */ u("div", {
								className: q.articleMeta,
								children: fe.join(" · ")
							}),
							e.kind && e.kind !== "essay" && /* @__PURE__ */ d("div", {
								className: q.articleMeta,
								style: {
									marginTop: 4,
									opacity: .7
								},
								children: ["substrate: ", e.kind]
							})
						]
					}), /* @__PURE__ */ u("div", { dangerouslySetInnerHTML: { __html: y } })]
				})
			]
		}),
		/* @__PURE__ */ u("div", {
			className: `${q.copyToast} ${C ? q.show : ""}`,
			children: "Copied to clipboard"
		}),
		p && e && /* @__PURE__ */ d("div", {
			className: q.restorePill,
			onClick: () => m(!1),
			title: "Bring reading window back",
			children: [
				/* @__PURE__ */ u("span", {
					className: q.pillIcon,
					children: "📖"
				}),
				/* @__PURE__ */ d("span", {
					className: q.pillLabel,
					children: [/* @__PURE__ */ u("span", {
						className: q.pillTitle,
						children: e.title || e.label
					}), /* @__PURE__ */ d("span", {
						className: q.pillAuthor,
						children: ["by ", pe]
					})]
				}),
				/* @__PURE__ */ u("span", {
					className: q.pillAction,
					children: "Restore ↗"
				})
			]
		})
	] });
}
function Zo(e, t) {
	let n = t || `This substrate ("${e.kind || "unknown"}") is not yet renderable in the viewer.`, r = "<div style=\"padding:24px;border:1px dashed var(--rp-border);border-radius:6px;background:rgba(17,24,39,0.4);\">";
	r += `<p style="color:var(--rp-accent);font-weight:600;margin-bottom:8px;">${n}</p>`, e.todos && e.todos.length && (r += `<p style="color:#f39c12;font-size:13px;">Pending: ${e.todos.join(", ")}</p>`);
	let i = (e.url || e.id || "").split("/").pop().replace(".html", ""), a = e._source?.path || `chapters/${i}`;
	return r += `<p style="color:#888;font-size:13px;margin-top:12px;">The bundle exists at <code>${a}</code>.</p>`, r += "</div>", r;
}
function Qo(e) {
	let t = e.forms && e.forms.companions || [];
	if (!t.length) return "";
	let n = "<div style=\"margin-top:32px;padding-top:24px;border-top:1px solid var(--rp-border);\">";
	return n += "<div style=\"color:var(--rp-accent);font-size:11px;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;\">also exists as</div>", n += `<div style="color:var(--rp-text);font-size:14px;">${t.map((e) => `<span class="${q.fmTag}">${e}</span>`).join(" ")}</div>`, n += "</div>", n;
}
function $o(e) {
	let t = [];
	if (e.seed && t.push(["seed", e.seed]), e.tldr && t.push(["tldr", e.tldr]), e.topology && e.topology.length && t.push(["topology", e.topology.join(" · ")]), e.energy && t.push(["energy", e.energy]), e.note && t.push(["note", e.note]), !t.length) return "";
	let n = "<div style=\"margin-top:32px;padding:20px;background:rgba(17,24,39,0.4);border-radius:6px;\">";
	for (let [e, r] of t) n += `<div class="${q.fmRow}"><span class="${q.fmLabel}">${e}</span><span class="${q.fmValue}">${r}</span></div>`;
	return n += "</div>", n;
}
function es({ article: e, settings: n }) {
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
				e.tags && e.tags.length && (r = /* @__PURE__ */ u(l, { children: e.tags.map((e) => /* @__PURE__ */ u("span", {
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
				i.length && (r = /* @__PURE__ */ u(l, { children: i.map(([e, n], r) => /* @__PURE__ */ d(t.Fragment, { children: [/* @__PURE__ */ u("a", {
					className: q.fmSyndLink,
					href: n,
					target: "_blank",
					rel: "noopener noreferrer",
					children: e
				}), r < i.length - 1 ? " · " : ""] }, e)) }));
				break;
			default: break;
		}
		return r ? (i = !0, /* @__PURE__ */ d("div", {
			className: q.fmRow,
			children: [/* @__PURE__ */ u("span", {
				className: q.fmLabel,
				children: n.replace(/_/g, " ")
			}), /* @__PURE__ */ u("span", {
				className: q.fmValue,
				children: r
			})]
		}, n)) : null;
	});
	return /* @__PURE__ */ u("div", {
		className: `${q.frontmatterPanel} ${q.open}`,
		children: i ? a : /* @__PURE__ */ u("div", {
			className: q.fmRow,
			children: /* @__PURE__ */ u("span", {
				className: q.fmValue,
				style: { color: "#666" },
				children: "No metadata available."
			})
		})
	});
}
var Y = {
	ttsGroup: "_ttsGroup_1d15s_1",
	tb: "_tb_1d15s_12",
	tbTooltip: "_tbTooltip_1d15s_39",
	select: "_select_1d15s_59",
	params: "_params_1d15s_76",
	loadingBarContainer: "_loadingBarContainer_1d15s_122",
	loadingBarFill: "_loadingBarFill_1d15s_134",
	visualizer: "_visualizer_1d15s_140",
	bar: "_bar_1d15s_150",
	bounce: "_bounce_1d15s_1",
	errorToast: "_errorToast_1d15s_172",
	show: "_show_1d15s_187",
	statusBadge: "_statusBadge_1d15s_191",
	pulse: "_pulse_1d15s_1",
	error: "_error_1d15s_172"
};
//#endregion
//#region src/components/TTS/TTS.jsx
function ts({ targetRef: e }) {
	let [t, n] = o(null), [i, a] = o("stopped"), [s, c] = o([]), [l, f] = o(""), [p, m] = o([]), [h, g] = o(""), [_, v] = o({}), [y, b] = o({}), [x, S] = o(0), [C, w] = o(""), [T, E] = o(null), [D, O] = o(!1);
	r(() => {
		if (!window.TTS) return;
		let e = window.TTS;
		n(e);
		let t = (e) => {
			a(e), e !== "loading" && S(0), (e === "playing" || e === "stopped") && (D || E(null));
		}, r = (e) => S(e * 100), i = ({ engine: e, progress: t }) => {
			t && t.status === "progress" && t.progress !== void 0 ? E(`Loading ${e}: ${Math.round(t.progress * 100)}%`) : t && t.status && E(`Loading ${e}...`);
		}, o = (e) => {
			let t = e && (e.error || e.message || String(e)), n = e && e.engine;
			w(t || "TTS error"), O(!0), E(`${n || "TTS"} error: ${t || "Playback failed"}`), setTimeout(() => {
				w(""), E(null), O(!1);
			}, 5e3);
		}, s = () => {
			c(e.engines()), f(e.selected());
		}, l = () => {
			let t = e.voices();
			m(t);
			let n = e.capabilities();
			v(n);
			let r = {};
			for (let i of Object.keys(n)) if (i === "voice") {
				let r = e.get("voice") || n.voice.default;
				if (!r && t.length) {
					let e = t.find((e) => /Google.*(?:US\s*)?English\s*7.*(?:Natural)?/i.test(e.id || e.label));
					e && (r = e.id);
				}
				r && (e.set("voice", r), g(r));
			} else r[i] = e.get(i) === void 0 ? n[i].default : e.get(i);
			b(r);
		};
		return e.on("state", t), e.on("capabilitiesChanged", l), e.on("engineProgress", r), e.on("loadingProgress", i), e.on("error", o), s(), l(), window.speechSynthesis && window.speechSynthesis.addEventListener("voiceschanged", l), () => {
			e.off && (e.off("state", t), e.off("capabilitiesChanged", l), e.off("engineProgress", r), e.off("loadingProgress", i), e.off("error", o)), window.speechSynthesis && window.speechSynthesis.removeEventListener("voiceschanged", l);
		};
	}, []);
	let k = (e) => {
		if (!t) return;
		let n = e.target.value;
		t.select(n), f(n), E(null), O(!1), m(t.voices()), v(t.capabilities());
	}, A = (e) => {
		if (!t) return;
		let n = e.target.value;
		t.set("voice", n), g(n);
	}, ee = (e, n) => {
		t && (t.set(e, n), b((t) => ({
			...t,
			[e]: n
		})));
	};
	return t ? /* @__PURE__ */ d("div", {
		className: Y.ttsGroup,
		style: { position: "relative" },
		children: [
			i !== "playing" && /* @__PURE__ */ u("button", {
				className: Y.tb,
				onClick: () => {
					!t || !e.current || (E(null), O(!1), t.play(e.current, { scrollContainer: e.current }));
				},
				title: "Play",
				dangerouslySetInnerHTML: { __html: `${J.play}<span class="${Y.tbTooltip}">Play</span>` }
			}),
			i === "playing" && /* @__PURE__ */ u("button", {
				className: Y.tb,
				onClick: () => {
					t && t.pause();
				},
				title: "Pause",
				dangerouslySetInnerHTML: { __html: `${J.pause}<span class="${Y.tbTooltip}">Pause</span>` }
			}),
			(i === "playing" || i === "paused" || i === "loading") && /* @__PURE__ */ u("button", {
				className: Y.tb,
				onClick: () => {
					t && t.stop();
				},
				title: "Stop",
				dangerouslySetInnerHTML: { __html: `${J.stop}<span class="${Y.tbTooltip}">Stop</span>` }
			}),
			i === "loading" && x > 0 && /* @__PURE__ */ u("div", {
				className: Y.loadingBarContainer,
				children: /* @__PURE__ */ u("div", {
					className: Y.loadingBarFill,
					style: { width: `${x}%` }
				})
			}),
			i === "playing" && /* @__PURE__ */ d("div", {
				className: Y.visualizer,
				children: [
					/* @__PURE__ */ u("div", { className: Y.bar }),
					/* @__PURE__ */ u("div", { className: Y.bar }),
					/* @__PURE__ */ u("div", { className: Y.bar }),
					/* @__PURE__ */ u("div", { className: Y.bar })
				]
			}),
			/* @__PURE__ */ u("div", {
				className: `${Y.errorToast} ${C ? Y.show : ""}`,
				children: C
			}),
			T && /* @__PURE__ */ u("span", {
				className: `${Y.statusBadge} ${D ? Y.error : ""}`,
				children: T
			}),
			/* @__PURE__ */ u("select", {
				className: Y.select,
				style: { maxWidth: 110 },
				value: l,
				onChange: k,
				title: "TTS Engine",
				children: s.map((e) => /* @__PURE__ */ u("option", {
					value: e.id,
					children: e.label
				}, e.id))
			}),
			/* @__PURE__ */ u("select", {
				className: Y.select,
				value: h,
				onChange: A,
				title: "Voice",
				children: (() => {
					if (!p.length) return /* @__PURE__ */ u("option", { children: "Loading..." });
					if (p.some((e) => e.lang)) {
						let e = {};
						return p.forEach((t) => {
							let n = t.lang || "other";
							(e[n] = e[n] || []).push(t);
						}), Object.keys(e).sort().map((t) => /* @__PURE__ */ u("optgroup", {
							label: t,
							children: e[t].map((e) => /* @__PURE__ */ u("option", {
								value: e.id,
								children: e.label
							}, e.id))
						}, t));
					}
					return p.map((e) => /* @__PURE__ */ u("option", {
						value: e.id,
						children: e.label
					}, e.id));
				})()
			}),
			/* @__PURE__ */ u("div", {
				className: Y.params,
				children: Object.entries(_).map(([e, t]) => !t || e === "voice" ? null : t.type === "range" ? /* @__PURE__ */ d("label", {
					title: `${t.label}: ${y[e]}`,
					children: [t.label, /* @__PURE__ */ u("input", {
						type: "range",
						min: t.min,
						max: t.max,
						step: t.step || .1,
						value: y[e] ?? t.default,
						onChange: (t) => ee(e, parseFloat(t.target.value))
					})]
				}, e) : t.type === "select" ? /* @__PURE__ */ d("label", { children: [t.label, /* @__PURE__ */ u("select", {
					value: y[e] ?? t.default,
					onChange: (t) => ee(e, t.target.value),
					children: t.options.map((e) => /* @__PURE__ */ u("option", {
						value: e.value,
						children: e.label
					}, e.value))
				})] }, e) : null)
			})
		]
	}) : null;
}
var X = {
	bar: "_bar_ova6y_6",
	pill: "_pill_ova6y_20",
	hidden: "_hidden_ova6y_59",
	title: "_title_ova6y_63",
	failed: "_failed_ova6y_67",
	dot: "_dot_ova6y_67",
	dotWrap: "_dotWrap_ova6y_76",
	dotActive: "_dotActive_ova6y_112",
	ringBackdrop: "_ringBackdrop_ova6y_117",
	ring: "_ring_ova6y_117",
	swatch: "_swatch_ova6y_133",
	swatchCurrent: "_swatchCurrent_ova6y_153",
	count: "_count_ova6y_165",
	addPill: "_addPill_ova6y_174",
	plus: "_plus_ova6y_180",
	addOpen: "_addOpen_ova6y_191",
	addInput: "_addInput_ova6y_198",
	addClose: "_addClose_ova6y_215",
	addSubmit: "_addSubmit_ova6y_231",
	ready: "_ready_ova6y_252",
	resultPanel: "_resultPanel_ova6y_263",
	resultClose: "_resultClose_ova6y_285",
	resultTitle: "_resultTitle_ova6y_300",
	resultUrl: "_resultUrl_ova6y_307",
	resultSection: "_resultSection_ova6y_316",
	resultLabel: "_resultLabel_ova6y_323",
	resultBox: "_resultBox_ova6y_332",
	code: "_code_ova6y_342",
	codeInline: "_codeInline_ova6y_352",
	copyBtn: "_copyBtn_ova6y_361",
	copied: "_copied_ova6y_378",
	resultHint: "_resultHint_ova6y_384"
};
//#endregion
//#region src/components/FeedZ/FeedZ.jsx
function ns({ sources: e, hiddenSources: t, onToggleSource: n, viewState: r }) {
	if (!e || e.length === 0) return null;
	let i = t || /* @__PURE__ */ new Set();
	return /* @__PURE__ */ d("div", {
		className: X.bar,
		children: [e.map((e) => /* @__PURE__ */ u(rs, {
			source: e,
			hidden: i.has(e.id),
			onToggle: () => n && n(e.id),
			viewState: r
		}, e.id)), /* @__PURE__ */ u(ss, {})]
	});
}
function rs({ source: e, hidden: t, onToggle: n, viewState: r }) {
	let i = e.title || e.id, a = e.ok !== !1, o = r && r.sourceColor(e.id) || e.color;
	return /* @__PURE__ */ d("div", {
		className: `${X.pill} ${t ? X.hidden : ""} ${a ? "" : X.failed}`,
		onClick: n,
		onKeyDown: (e) => {
			(e.key === "Enter" || e.key === " ") && (e.preventDefault(), n());
		},
		role: "button",
		tabIndex: 0,
		title: t ? `Show ${i}` : `Hide ${i}`,
		style: { "--pill-color": o },
		children: [
			/* @__PURE__ */ u(os, {
				color: o,
				sourceId: e.id,
				viewState: r
			}),
			/* @__PURE__ */ u("span", {
				className: X.title,
				children: i
			}),
			/* @__PURE__ */ u("span", {
				className: X.count,
				children: e.itemCount
			})
		]
	});
}
var is = [
	"#e74c3c",
	"#e67e22",
	"#f1c40f",
	"#2ecc71",
	"#1abc9c",
	"#3498db",
	"#9b59b6",
	"#e84393"
], as = 650;
function os({ color: e, sourceId: t, viewState: n }) {
	let [i, s] = o(!1), c = a(null);
	r(() => () => {
		c.current && clearTimeout(c.current);
	}, []);
	let f = (e) => {
		e.stopPropagation(), s(!0);
	}, p = (e) => {
		e && e.stopPropagation(), s(!1);
	}, m = () => {
		c.current = setTimeout(() => s(!0), as);
	}, h = () => {
		c.current &&= (clearTimeout(c.current), null);
	}, g = (e, r) => {
		r.stopPropagation(), n && n.setSourceColor(t, e), s(!1);
	}, _ = is.length;
	return /* @__PURE__ */ d("span", {
		className: X.dotWrap,
		onMouseEnter: m,
		onMouseLeave: h,
		onClick: f,
		onTouchEnd: f,
		children: [/* @__PURE__ */ u("span", {
			className: `${X.dot} ${i ? X.dotActive : ""}`,
			"aria-hidden": "true"
		}), i && /* @__PURE__ */ d(l, { children: [/* @__PURE__ */ u("span", {
			className: X.ringBackdrop,
			onClick: p,
			onTouchEnd: p
		}), /* @__PURE__ */ u("span", {
			className: X.ring,
			children: is.map((t, n) => {
				let r = (_ === 1 ? 15 : 15 + n / (_ - 1) * 150) * Math.PI / 180, i = 30 * Math.cos(r), a = 30 * Math.sin(r);
				return /* @__PURE__ */ u("button", {
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
function ss() {
	let [e, t] = o(!1), [n, i] = o(""), [s, c] = o(null), f = a(null);
	r(() => {
		e && f.current && f.current.focus();
	}, [e]);
	let p = ls(n), m = (e) => {
		e && e.preventDefault(), p && (c(n.trim()), i(""), t(!1));
	}, h = () => {
		i(""), t(!1);
	};
	return /* @__PURE__ */ d(l, { children: [e ? /* @__PURE__ */ d("form", {
		className: `${X.pill} ${X.addOpen}`,
		onSubmit: m,
		children: [
			/* @__PURE__ */ u("input", {
				ref: f,
				type: "url",
				placeholder: "paste a feed URL…",
				className: X.addInput,
				value: n,
				onChange: (e) => i(e.target.value),
				onKeyDown: (e) => {
					e.key === "Escape" && h();
				}
			}),
			/* @__PURE__ */ u("button", {
				type: "button",
				className: X.addClose,
				onClick: h,
				title: "Cancel",
				"aria-label": "Cancel",
				children: "×"
			}),
			/* @__PURE__ */ u("button", {
				type: "submit",
				className: `${X.addSubmit} ${p ? X.ready : ""}`,
				disabled: !p,
				title: p ? "Continue" : "Enter a URL first",
				"aria-label": "Add feed",
				children: "+"
			})
		]
	}) : /* @__PURE__ */ u("button", {
		className: `${X.pill} ${X.addPill}`,
		onClick: () => t(!0),
		title: "Add a feed",
		children: /* @__PURE__ */ u("span", {
			className: X.plus,
			children: "+"
		})
	}), s && /* @__PURE__ */ u(cs, {
		url: s,
		onDismiss: () => c(null)
	})] });
}
function cs({ url: e, onDismiss: t }) {
	let [n, r] = o(""), i = ds(e), a = `node add-feed.js ${us(e)}`, s = async (e, t) => {
		try {
			await navigator.clipboard.writeText(e), r(t), setTimeout(() => r((e) => e === t ? "" : e), 1500);
		} catch {}
	};
	return /* @__PURE__ */ d("div", {
		className: X.resultPanel,
		children: [
			/* @__PURE__ */ u("button", {
				className: X.resultClose,
				onClick: t,
				title: "Dismiss",
				"aria-label": "Dismiss",
				children: "×"
			}),
			/* @__PURE__ */ u("div", {
				className: X.resultTitle,
				children: "Add this feed"
			}),
			/* @__PURE__ */ u("div", {
				className: X.resultUrl,
				title: e,
				children: e
			}),
			/* @__PURE__ */ d("div", {
				className: X.resultSection,
				children: [
					/* @__PURE__ */ u("div", {
						className: X.resultLabel,
						children: "One-step (recommended)"
					}),
					/* @__PURE__ */ d("div", {
						className: X.resultBox,
						children: [/* @__PURE__ */ u("code", {
							className: X.code,
							children: a
						}), /* @__PURE__ */ u("button", {
							className: `${X.copyBtn} ${n === "cli" ? X.copied : ""}`,
							onClick: () => s(a, "cli"),
							children: n === "cli" ? "Copied" : "Copy"
						})]
					}),
					/* @__PURE__ */ u("div", {
						className: X.resultHint,
						children: "Paste in your terminal — it appends to feeds.opml and rebuilds. Then refresh this page."
					})
				]
			}),
			/* @__PURE__ */ d("div", {
				className: X.resultSection,
				children: [
					/* @__PURE__ */ u("div", {
						className: X.resultLabel,
						children: "Or add manually"
					}),
					/* @__PURE__ */ d("div", {
						className: X.resultBox,
						children: [/* @__PURE__ */ u("code", {
							className: X.code,
							children: i
						}), /* @__PURE__ */ u("button", {
							className: `${X.copyBtn} ${n === "opml" ? X.copied : ""}`,
							onClick: () => s(i, "opml"),
							children: n === "opml" ? "Copied" : "Copy"
						})]
					}),
					/* @__PURE__ */ d("div", {
						className: X.resultHint,
						children: [
							"Paste before ",
							/* @__PURE__ */ u("code", {
								className: X.codeInline,
								children: "</body>"
							}),
							" ",
							"in feeds.opml, then run ",
							/* @__PURE__ */ u("code", {
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
function ls(e) {
	let t = (e || "").trim();
	if (!t) return !1;
	try {
		let e = new URL(t);
		return e.protocol === "http:" || e.protocol === "https:";
	} catch {
		return !1;
	}
}
function us(e) {
	return `'${String(e).replace(/'/g, "'\\''")}'`;
}
function ds(e) {
	let t = e.replace(/"/g, "&quot;");
	return `<outline text="${fs(e)}" title="${fs(e)}" xmlUrl="${t}"/>`;
}
function fs(e) {
	try {
		return new URL(e).hostname.replace(/^www\./, "");
	} catch {
		return e;
	}
}
var Z = {
	gearBtn: "_gearBtn_16otb_6",
	backdrop: "_backdrop_16otb_36",
	popover: "_popover_16otb_43",
	header: "_header_16otb_61",
	title: "_title_16otb_68",
	closeBtn: "_closeBtn_16otb_74",
	presetRow: "_presetRow_16otb_86",
	presetBtn: "_presetBtn_16otb_93",
	presetActive: "_presetActive_16otb_110",
	presetSwatches: "_presetSwatches_16otb_115",
	miniSwatch: "_miniSwatch_16otb_120",
	presetLabel: "_presetLabel_16otb_127",
	hint: "_hint_16otb_132",
	fieldList: "_fieldList_16otb_139",
	fieldRow: "_fieldRow_16otb_146",
	fieldLabel: "_fieldLabel_16otb_153",
	colorInput: "_colorInput_16otb_159",
	hexLabel: "_hexLabel_16otb_169",
	resetBtn: "_resetBtn_16otb_177"
}, ps = {
	draft: "#555555",
	published: "#2ecc71",
	tag: "#f39c12",
	topology: "#9b59b6",
	placeholder: "#7f8c8d"
}, ms = [
	{
		id: "default",
		label: "Default",
		colors: ps
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
], hs = [
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
];
function gs({ viewState: e }) {
	let [t, n] = o(!1), [, i] = o(0);
	if (r(() => {
		if (e) return e.subscribe(() => i((e) => e + 1));
	}, [e]), r(() => {
		if (typeof document < "u") {
			let t = e.paragraphIndent ? e.paragraphIndent() : !1, n = e.paragraphSpace ? e.paragraphSpace() : !0;
			document.documentElement.setAttribute("data-pp-indent", t ? "on" : "off"), document.documentElement.setAttribute("data-pp-space", n ? "on" : "off"), document.documentElement.removeAttribute("data-pp-paragraph");
		}
	}), r(() => {
		if (!t) return;
		let e = (e) => {
			e.key === "Escape" && n(!1);
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [t]), !e) return null;
	let a = {
		...ps,
		...e.graphColors()
	}, s = e.colorProfileId();
	return /* @__PURE__ */ d(l, { children: [/* @__PURE__ */ u("button", {
		className: Z.gearBtn,
		onClick: () => n((e) => !e),
		title: "Settings",
		"aria-label": "Settings",
		children: "⚙"
	}), t && /* @__PURE__ */ d(l, { children: [/* @__PURE__ */ u("div", {
		className: Z.backdrop,
		onClick: () => n(!1)
	}), /* @__PURE__ */ d("div", {
		className: Z.popover,
		role: "dialog",
		"aria-label": "Settings",
		children: [
			/* @__PURE__ */ d("div", {
				className: Z.header,
				children: [/* @__PURE__ */ u("span", {
					className: Z.title,
					children: "Color Scheme"
				}), /* @__PURE__ */ u("button", {
					className: Z.closeBtn,
					onClick: () => n(!1),
					"aria-label": "Close",
					children: "×"
				})]
			}),
			/* @__PURE__ */ u("div", {
				className: Z.presetRow,
				children: ms.map((t) => /* @__PURE__ */ d("button", {
					className: `${Z.presetBtn} ${s === t.id ? Z.presetActive : ""}`,
					onClick: () => e.applyColorProfile(t.id, t.colors),
					title: t.label,
					children: [/* @__PURE__ */ u("span", {
						className: Z.presetSwatches,
						children: hs.map((e) => /* @__PURE__ */ u("span", {
							className: Z.miniSwatch,
							style: { background: t.colors[e.key] }
						}, e.key))
					}), /* @__PURE__ */ u("span", {
						className: Z.presetLabel,
						children: t.label
					})]
				}, t.id))
			}),
			/* @__PURE__ */ u("div", {
				className: Z.hint,
				children: "Pick a preset, then adjust any color below if you like."
			}),
			/* @__PURE__ */ u("div", {
				className: Z.fieldList,
				children: hs.map((t) => /* @__PURE__ */ d("label", {
					className: Z.fieldRow,
					children: [
						/* @__PURE__ */ u("span", {
							className: Z.fieldLabel,
							children: t.label
						}),
						/* @__PURE__ */ u("input", {
							type: "color",
							className: Z.colorInput,
							value: a[t.key],
							onChange: (n) => e.setGraphColor(t.key, n.target.value)
						}),
						/* @__PURE__ */ u("span", {
							className: Z.hexLabel,
							children: a[t.key]
						})
					]
				}, t.key))
			}),
			/* @__PURE__ */ u("div", {
				className: Z.hint,
				style: { marginTop: "14px" },
				children: "Paragraphs"
			}),
			/* @__PURE__ */ d("div", {
				style: {
					display: "flex",
					gap: "8px"
				},
				children: [/* @__PURE__ */ u("button", {
					className: Z.resetBtn,
					"aria-pressed": e.paragraphIndent ? e.paragraphIndent() : !1,
					style: e.paragraphIndent && e.paragraphIndent() ? {
						color: "#fff",
						borderColor: "rgba(255,255,255,0.6)"
					} : void 0,
					onClick: () => e.setParagraphIndent && e.setParagraphIndent(!e.paragraphIndent()),
					children: "Indent first line"
				}), /* @__PURE__ */ u("button", {
					className: Z.resetBtn,
					"aria-pressed": e.paragraphSpace ? e.paragraphSpace() : !0,
					style: e.paragraphSpace && e.paragraphSpace() ? {
						color: "#fff",
						borderColor: "rgba(255,255,255,0.6)"
					} : void 0,
					onClick: () => e.setParagraphSpace && e.setParagraphSpace(!e.paragraphSpace()),
					children: "Space between"
				})]
			}),
			/* @__PURE__ */ d("div", {
				style: {
					display: "flex",
					gap: "8px",
					marginTop: "12px"
				},
				children: [/* @__PURE__ */ u("button", {
					className: Z.resetBtn,
					onClick: () => e.applyColorProfile("default", ps),
					children: "Reset Colors"
				}), /* @__PURE__ */ u("button", {
					className: Z.resetBtn,
					style: {
						color: "#e74c3c",
						borderColor: "#e74c3c4d"
					},
					onClick: () => {
						confirm("Reset all node positions and layout arrangements?") && (e.resetLayout(), window.location.reload());
					},
					children: "Reset Layout"
				})]
			})
		]
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
}, _s = {
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
}, vs = [
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
], ys = [
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
], bs = [
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
function xs({ config: e, onUpdate: t, onReset: i, visible: s = !0 }) {
	let [c, f] = o(!1), [p, m] = o(null), [h, g] = o(!1), _ = a(null), v = a(null), y = a(null), b = (e) => {
		v.current = e.touches[0].clientY;
	}, x = (e) => {
		if (v.current === null) return;
		let t = e.touches[0].clientY - v.current;
		y.current && y.current.scrollTop > 0 || t > 80 && (f(!1), v.current = null);
	}, S = () => {
		v.current = null;
	};
	r(() => {
		if (!c) return;
		let e = (e) => {
			e.key === "Escape" && f(!1);
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [c]);
	let C = {
		..._s,
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
		let t = ws(e);
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
	return s ? /* @__PURE__ */ d(l, { children: [
		/* @__PURE__ */ u("button", {
			className: `${Q.triggerBtn} ${c ? Q.open : ""}`,
			onClick: () => f((e) => !e),
			title: "Configure viewer",
			"aria-label": "Configure viewer",
			children: "⚡"
		}),
		c && /* @__PURE__ */ d(l, { children: [/* @__PURE__ */ u("div", {
			className: Q.backdrop,
			onClick: () => f(!1)
		}), /* @__PURE__ */ d("div", {
			className: Q.panel,
			role: "dialog",
			"aria-label": "Viewer Configuration",
			ref: y,
			onTouchStart: b,
			onTouchMove: x,
			onTouchEnd: S,
			children: [
				/* @__PURE__ */ d("div", {
					className: Q.header,
					children: [/* @__PURE__ */ u("span", {
						className: Q.panelTitle,
						children: "Viewer Configuration"
					}), /* @__PURE__ */ u("button", {
						className: Q.closeBtn,
						onClick: () => f(!1),
						"aria-label": "Close",
						children: "×"
					})]
				}),
				/* @__PURE__ */ d("div", {
					className: Q.section,
					children: [/* @__PURE__ */ u("div", {
						className: Q.sectionTitle,
						children: "Features"
					}), vs.map((e) => /* @__PURE__ */ u(Ss, {
						label: e.label,
						sub: e.sub,
						checked: C[e.key],
						onChange: (t) => T(e.key, t)
					}, e.key))]
				}),
				/* @__PURE__ */ d("div", {
					className: Q.section,
					children: [
						/* @__PURE__ */ u("div", {
							className: Q.sectionTitle,
							children: "Data"
						}),
						/* @__PURE__ */ u("div", {
							className: Q.textInputRow,
							children: /* @__PURE__ */ u("input", {
								type: "url",
								className: Q.textInput,
								placeholder: "Feed URL (default: ./feed.json)",
								value: e.feed || "",
								onChange: (e) => O(e.target.value)
							})
						}),
						/* @__PURE__ */ d("div", {
							className: Q.selectRow,
							children: [/* @__PURE__ */ u("span", {
								className: Q.toggleLabel,
								children: "Persistence"
							}), /* @__PURE__ */ u("select", {
								className: Q.select,
								value: e.persistence || "localStorage",
								onChange: (e) => D(e.target.value),
								children: bs.map((e) => /* @__PURE__ */ u("option", {
									value: e.value,
									children: e.label
								}, e.value))
							})]
						})
					]
				}),
				/* @__PURE__ */ d("div", {
					className: Q.section,
					children: [/* @__PURE__ */ u("div", {
						className: Q.sectionTitle,
						children: "Theme"
					}), ys.map((e) => /* @__PURE__ */ d("div", {
						className: Q.colorRow,
						children: [
							/* @__PURE__ */ u("span", {
								className: Q.colorLabel,
								children: e.label
							}),
							/* @__PURE__ */ u("input", {
								type: "color",
								className: Q.colorInput,
								value: w[e.key] || Cs(e.key),
								onChange: (t) => E(e.key, t.target.value)
							}),
							/* @__PURE__ */ u("span", {
								className: Q.colorHex,
								children: w[e.key] || Cs(e.key)
							})
						]
					}, e.key))]
				}),
				/* @__PURE__ */ d("div", {
					className: Q.section,
					children: [
						/* @__PURE__ */ u("div", {
							className: Q.sectionTitle,
							children: "Actions"
						}),
						/* @__PURE__ */ d("div", {
							className: Q.actions,
							children: [
								/* @__PURE__ */ u("button", {
									className: Q.actionBtnAccent,
									onClick: k,
									children: "Export Config"
								}),
								/* @__PURE__ */ u("button", {
									className: Q.actionBtn,
									onClick: A,
									children: "Import Config"
								}),
								/* @__PURE__ */ u("button", {
									className: Q.actionBtnDanger,
									onClick: i,
									children: "Reset All"
								})
							]
						}),
						/* @__PURE__ */ u("input", {
							ref: _,
							type: "file",
							accept: ".json",
							style: { display: "none" },
							onChange: ee
						}),
						h && /* @__PURE__ */ u("div", {
							className: Q.snippet,
							children: /* @__PURE__ */ u("code", {
								className: Q.snippetCode,
								children: ws(e)
							})
						}),
						!h && /* @__PURE__ */ u("button", {
							className: Q.actionBtn,
							onClick: () => g(!0),
							style: {
								marginTop: "6px",
								width: "100%"
							},
							children: "Show Embed Snippet"
						}),
						h && /* @__PURE__ */ u("button", {
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
		p && /* @__PURE__ */ u("div", {
			className: Q.toast,
			children: p
		})
	] }) : null;
}
function Ss({ label: e, sub: t, checked: n, onChange: r }) {
	return /* @__PURE__ */ d("div", {
		className: Q.toggleRow,
		children: [/* @__PURE__ */ d("span", {
			className: Q.toggleLabel,
			children: [e, t && /* @__PURE__ */ u("span", {
				className: Q.toggleSub,
				children: t
			})]
		}), /* @__PURE__ */ d("label", {
			className: Q.switch,
			children: [/* @__PURE__ */ u("input", {
				type: "checkbox",
				className: Q.switchInput,
				checked: n,
				onChange: (e) => r(e.target.checked)
			}), /* @__PURE__ */ u("span", { className: Q.switchTrack })]
		})]
	});
}
function Cs(e) {
	return {
		bg: "#1a1a2e",
		surface: "#0a0e1a",
		accent: "#64ffda",
		text: "#a8b2d1",
		text_bright: "#ccd6f6"
	}[e] || "#888888";
}
function ws(e) {
	let t = {};
	if (e.feed && e.feed !== "./feed.json" && (t.feed = e.feed), e.persistence && e.persistence !== "localStorage" && (t.persistence = e.persistence), e.features) {
		let n = {};
		for (let [t, r] of Object.entries(e.features)) r !== _s[t] && (n[t] = r);
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
var $ = {
	timeOverlay: "_timeOverlay_1cgyi_1",
	header: "_header_1cgyi_24",
	titleGroup: "_titleGroup_1cgyi_36",
	title: "_title_1cgyi_36",
	rangeBadge: "_rangeBadge_1cgyi_50",
	clearBtn: "_clearBtn_1cgyi_56",
	stackScroll: "_stackScroll_1cgyi_72",
	monthBox: "_monthBox_1cgyi_95",
	emptyMonth: "_emptyMonth_1cgyi_106",
	activeMonth: "_activeMonth_1cgyi_111",
	monthHeader: "_monthHeader_1cgyi_122",
	monthName: "_monthName_1cgyi_130",
	yearTag: "_yearTag_1cgyi_140",
	monthMeta: "_monthMeta_1cgyi_146",
	hasItems: "_hasItems_1cgyi_152",
	branchArea: "_branchArea_1cgyi_158",
	branchLine: "_branchLine_1cgyi_166",
	weeksRow: "_weeksRow_1cgyi_175",
	weekPill: "_weekPill_1cgyi_182",
	hasContent: "_hasContent_1cgyi_197",
	activeWeek: "_activeWeek_1cgyi_210",
	weekBadge: "_weekBadge_1cgyi_217"
}, Ts = [
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
function Es(e) {
	return (e.url || e.id || "").split("/").pop().replace(".html", "");
}
function Ds({ feedData: e, onFilterChange: t }) {
	let [n, r] = o(null), a = i(() => {
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
			let o = Es(e);
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
				monthName: Ts[n],
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
	if (!a.months.length) return null;
	let s = (e) => {
		e.articleSlugs.length !== 0 && (n === e.key ? (r(null), t && t(null, null)) : (r(e.key), t && t(new Set(e.articleSlugs), `${e.monthName} ${e.year}`)));
	}, c = (e, i, a) => {
		e.stopPropagation(), i.articleSlugs.length !== 0 && (n === i.id ? (r(null), t && t(null, null)) : (r(i.id), t && t(new Set(i.articleSlugs), `${a.monthName} ${i.label}`)));
	};
	return /* @__PURE__ */ d("div", {
		className: $.timeOverlay,
		children: [/* @__PURE__ */ d("div", {
			className: $.header,
			children: [/* @__PURE__ */ d("div", {
				className: $.titleGroup,
				children: [/* @__PURE__ */ u("span", {
					className: $.title,
					children: "Chronology"
				}), /* @__PURE__ */ u("span", {
					className: $.rangeBadge,
					children: a.minYear === a.maxYear ? a.minYear : `${a.minYear}–${a.maxYear}`
				})]
			}), n && /* @__PURE__ */ u("button", {
				className: $.clearBtn,
				onClick: () => {
					r(null), t && t(null, null);
				},
				title: "Show all posts",
				children: "Reset"
			})]
		}), /* @__PURE__ */ u("div", {
			className: $.stackScroll,
			children: a.months.map((e, t) => {
				let r = n === e.key, i = e.articleSlugs.length === 0, o = a.months[t - 1], l = !o || o.year !== e.year;
				return /* @__PURE__ */ d("div", {
					className: `${$.monthBox} ${i ? $.emptyMonth : ""} ${r ? $.activeMonth : ""}`,
					children: [/* @__PURE__ */ d("div", {
						className: $.monthHeader,
						onClick: () => s(e),
						title: i ? "No articles published this month" : `Filter to ${e.monthName} ${e.year} (${e.articleSlugs.length})`,
						children: [/* @__PURE__ */ d("div", {
							className: $.monthName,
							children: [e.monthName, l && /* @__PURE__ */ u("span", {
								className: $.yearTag,
								children: e.year
							})]
						}), /* @__PURE__ */ u("div", {
							className: `${$.monthMeta} ${e.articleSlugs.length > 0 ? $.hasItems : ""}`,
							children: e.articleSlugs.length > 0 ? `${e.articleSlugs.length} post${e.articleSlugs.length > 1 ? "s" : ""}` : "0 posts"
						})]
					}), /* @__PURE__ */ d("div", {
						className: $.branchArea,
						children: [/* @__PURE__ */ u("div", { className: $.branchLine }), /* @__PURE__ */ u("div", {
							className: $.weeksRow,
							children: e.weeks.map((t) => {
								let r = t.articleSlugs.length, i = n === t.id;
								return /* @__PURE__ */ d("div", {
									className: `${$.weekPill} ${r > 0 ? $.hasContent : ""} ${i ? $.activeWeek : ""}`,
									onClick: (n) => c(n, t, e),
									title: r > 0 ? `${t.label}: ${r} post${r > 1 ? "s" : ""}` : `${t.label}: empty`,
									children: [/* @__PURE__ */ u("span", { children: t.label }), r > 0 && /* @__PURE__ */ u("span", {
										className: $.weekBadge,
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
//#endregion
export { xs as ConfigPanel, ns as FeedZ, Jo as GraphViewer, e as React, s as ReactDOM, Xo as ReaderPanel, gs as Settings, ts as TTS, Ds as TimeOverlay };
