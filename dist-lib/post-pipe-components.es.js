import * as e from "react";
import t, { useCallback as n, useEffect as r, useMemo as i, useReducer as a, useRef as o, useState as s } from "react";
import * as c from "react-dom/client";
import { createRoot as l } from "react-dom/client";
import { Fragment as u, jsx as d, jsxs as f } from "react/jsx-runtime";
//#region \0rolldown/runtime.js
var p = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports);
//#endregion
//#region node_modules/d3-array/src/mean.js
function m(e, t) {
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
var h = { value: () => {} };
function g() {
	for (var e = 0, t = arguments.length, n = {}, r; e < t; ++e) {
		if (!(r = arguments[e] + "") || r in n || /[\s.]/.test(r)) throw Error("illegal type: " + r);
		n[r] = [];
	}
	return new _(n);
}
function _(e) {
	this._ = e;
}
function v(e, t) {
	return e.trim().split(/^|\s+/).map(function(e) {
		var n = "", r = e.indexOf(".");
		if (r >= 0 && (n = e.slice(r + 1), e = e.slice(0, r)), e && !t.hasOwnProperty(e)) throw Error("unknown type: " + e);
		return {
			type: e,
			name: n
		};
	});
}
_.prototype = g.prototype = {
	constructor: _,
	on: function(e, t) {
		var n = this._, r = v(e + "", n), i, a = -1, o = r.length;
		if (arguments.length < 2) {
			for (; ++a < o;) if ((i = (e = r[a]).type) && (i = y(n[i], e.name))) return i;
			return;
		}
		if (t != null && typeof t != "function") throw Error("invalid callback: " + t);
		for (; ++a < o;) if (i = (e = r[a]).type) n[i] = b(n[i], e.name, t);
		else if (t == null) for (i in n) n[i] = b(n[i], e.name, null);
		return this;
	},
	copy: function() {
		var e = {}, t = this._;
		for (var n in t) e[n] = t[n].slice();
		return new _(e);
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
function y(e, t) {
	for (var n = 0, r = e.length, i; n < r; ++n) if ((i = e[n]).name === t) return i.value;
}
function b(e, t, n) {
	for (var r = 0, i = e.length; r < i; ++r) if (e[r].name === t) {
		e[r] = h, e = e.slice(0, r).concat(e.slice(r + 1));
		break;
	}
	return n != null && e.push({
		name: t,
		value: n
	}), e;
}
var x = {
	svg: "http://www.w3.org/2000/svg",
	xhtml: "http://www.w3.org/1999/xhtml",
	xlink: "http://www.w3.org/1999/xlink",
	xml: "http://www.w3.org/XML/1998/namespace",
	xmlns: "http://www.w3.org/2000/xmlns/"
};
//#endregion
//#region node_modules/d3-selection/src/namespace.js
function S(e) {
	var t = e += "", n = t.indexOf(":");
	return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), x.hasOwnProperty(t) ? {
		space: x[t],
		local: e
	} : e;
}
//#endregion
//#region node_modules/d3-selection/src/creator.js
function C(e) {
	return function() {
		var t = this.ownerDocument, n = this.namespaceURI;
		return n === "http://www.w3.org/1999/xhtml" && t.documentElement.namespaceURI === "http://www.w3.org/1999/xhtml" ? t.createElement(e) : t.createElementNS(n, e);
	};
}
function w(e) {
	return function() {
		return this.ownerDocument.createElementNS(e.space, e.local);
	};
}
function T(e) {
	var t = S(e);
	return (t.local ? w : C)(t);
}
//#endregion
//#region node_modules/d3-selection/src/selector.js
function E() {}
function D(e) {
	return e == null ? E : function() {
		return this.querySelector(e);
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/select.js
function O(e) {
	typeof e != "function" && (e = D(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = Array(o), c, l, u = 0; u < o; ++u) (c = a[u]) && (l = e.call(c, c.__data__, u, a)) && ("__data__" in c && (l.__data__ = c.__data__), s[u] = l);
	return new kt(r, this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/array.js
function k(e) {
	return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
//#endregion
//#region node_modules/d3-selection/src/selectorAll.js
function A() {
	return [];
}
function ee(e) {
	return e == null ? A : function() {
		return this.querySelectorAll(e);
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/selectAll.js
function te(e) {
	return function() {
		return k(e.apply(this, arguments));
	};
}
function j(e) {
	e = typeof e == "function" ? te(e) : ee(e);
	for (var t = this._groups, n = t.length, r = [], i = [], a = 0; a < n; ++a) for (var o = t[a], s = o.length, c, l = 0; l < s; ++l) (c = o[l]) && (r.push(e.call(c, c.__data__, l, o)), i.push(c));
	return new kt(r, i);
}
//#endregion
//#region node_modules/d3-selection/src/matcher.js
function ne(e) {
	return function() {
		return this.matches(e);
	};
}
function M(e) {
	return function(t) {
		return t.matches(e);
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/selectChild.js
var re = Array.prototype.find;
function ie(e) {
	return function() {
		return re.call(this.children, e);
	};
}
function N() {
	return this.firstElementChild;
}
function ae(e) {
	return this.select(e == null ? N : ie(typeof e == "function" ? e : M(e)));
}
//#endregion
//#region node_modules/d3-selection/src/selection/selectChildren.js
var P = Array.prototype.filter;
function oe() {
	return Array.from(this.children);
}
function se(e) {
	return function() {
		return P.call(this.children, e);
	};
}
function ce(e) {
	return this.selectAll(e == null ? oe : se(typeof e == "function" ? e : M(e)));
}
//#endregion
//#region node_modules/d3-selection/src/selection/filter.js
function le(e) {
	typeof e != "function" && (e = ne(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = [], c, l = 0; l < o; ++l) (c = a[l]) && e.call(c, c.__data__, l, a) && s.push(c);
	return new kt(r, this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/selection/sparse.js
function F(e) {
	return Array(e.length);
}
//#endregion
//#region node_modules/d3-selection/src/selection/enter.js
function ue() {
	return new kt(this._enter || this._groups.map(F), this._parents);
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
function ge(e, t) {
	if (!arguments.length) return Array.from(this, he);
	var n = t ? me : pe, r = this._parents, i = this._groups;
	typeof e != "function" && (e = fe(e));
	for (var a = i.length, o = Array(a), s = Array(a), c = Array(a), l = 0; l < a; ++l) {
		var u = r[l], d = i[l], f = d.length, p = _e(e.call(u, u && u.__data__, l, r)), m = p.length, h = s[l] = Array(m), g = o[l] = Array(m);
		n(u, d, h, g, c[l] = Array(f), p, t);
		for (var _ = 0, v = 0, y, b; _ < m; ++_) if (y = h[_]) {
			for (_ >= v && (v = _ + 1); !(b = g[v]) && ++v < m;);
			y._next = b || null;
		}
	}
	return o = new kt(o, r), o._enter = s, o._exit = c, o;
}
function _e(e) {
	return typeof e == "object" && "length" in e ? e : Array.from(e);
}
//#endregion
//#region node_modules/d3-selection/src/selection/exit.js
function ve() {
	return new kt(this._exit || this._groups.map(F), this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/selection/join.js
function ye(e, t, n) {
	var r = this.enter(), i = this, a = this.exit();
	return typeof e == "function" ? (r = e(r), r &&= r.selection()) : r = r.append(e + ""), t != null && (i = t(i), i &&= i.selection()), n == null ? a.remove() : n(a), r && i ? r.merge(i).order() : i;
}
//#endregion
//#region node_modules/d3-selection/src/selection/merge.js
function be(e) {
	for (var t = e.selection ? e.selection() : e, n = this._groups, r = t._groups, i = n.length, a = r.length, o = Math.min(i, a), s = Array(i), c = 0; c < o; ++c) for (var l = n[c], u = r[c], d = l.length, f = s[c] = Array(d), p, m = 0; m < d; ++m) (p = l[m] || u[m]) && (f[m] = p);
	for (; c < i; ++c) s[c] = n[c];
	return new kt(s, this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/selection/order.js
function xe() {
	for (var e = this._groups, t = -1, n = e.length; ++t < n;) for (var r = e[t], i = r.length - 1, a = r[i], o; --i >= 0;) (o = r[i]) && (a && o.compareDocumentPosition(a) ^ 4 && a.parentNode.insertBefore(o, a), a = o);
	return this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/sort.js
function Se(e) {
	e ||= Ce;
	function t(t, n) {
		return t && n ? e(t.__data__, n.__data__) : !t - !n;
	}
	for (var n = this._groups, r = n.length, i = Array(r), a = 0; a < r; ++a) {
		for (var o = n[a], s = o.length, c = i[a] = Array(s), l, u = 0; u < s; ++u) (l = o[u]) && (c[u] = l);
		c.sort(t);
	}
	return new kt(i, this._parents).order();
}
function Ce(e, t) {
	return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
//#endregion
//#region node_modules/d3-selection/src/selection/call.js
function we() {
	var e = arguments[0];
	return arguments[0] = this, e.apply(null, arguments), this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/nodes.js
function Te() {
	return Array.from(this);
}
//#endregion
//#region node_modules/d3-selection/src/selection/node.js
function Ee() {
	for (var e = this._groups, t = 0, n = e.length; t < n; ++t) for (var r = e[t], i = 0, a = r.length; i < a; ++i) {
		var o = r[i];
		if (o) return o;
	}
	return null;
}
//#endregion
//#region node_modules/d3-selection/src/selection/size.js
function De() {
	let e = 0;
	for (let t of this) ++e;
	return e;
}
//#endregion
//#region node_modules/d3-selection/src/selection/empty.js
function Oe() {
	return !this.node();
}
//#endregion
//#region node_modules/d3-selection/src/selection/each.js
function ke(e) {
	for (var t = this._groups, n = 0, r = t.length; n < r; ++n) for (var i = t[n], a = 0, o = i.length, s; a < o; ++a) (s = i[a]) && e.call(s, s.__data__, a, i);
	return this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/attr.js
function Ae(e) {
	return function() {
		this.removeAttribute(e);
	};
}
function je(e) {
	return function() {
		this.removeAttributeNS(e.space, e.local);
	};
}
function Me(e, t) {
	return function() {
		this.setAttribute(e, t);
	};
}
function Ne(e, t) {
	return function() {
		this.setAttributeNS(e.space, e.local, t);
	};
}
function I(e, t) {
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
	var n = S(e);
	if (arguments.length < 2) {
		var r = this.node();
		return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
	}
	return this.each((t == null ? n.local ? je : Ae : typeof t == "function" ? n.local ? Pe : I : n.local ? Ne : Me)(n, t));
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
	return arguments.length > 1 ? this.each((t == null ? Le : typeof t == "function" ? ze : Re)(e, t, n ?? "")) : L(this.node(), e);
}
function L(e, t) {
	return e.style.getPropertyValue(t) || Ie(e).getComputedStyle(e, null).getPropertyValue(t);
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
function R(e) {
	return e.trim().split(/^|\s+/);
}
function Ge(e) {
	return e.classList || new Ke(e);
}
function Ke(e) {
	this._node = e, this._names = R(e.getAttribute("class") || "");
}
Ke.prototype = {
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
function qe(e, t) {
	for (var n = Ge(e), r = -1, i = t.length; ++r < i;) n.add(t[r]);
}
function Je(e, t) {
	for (var n = Ge(e), r = -1, i = t.length; ++r < i;) n.remove(t[r]);
}
function Ye(e) {
	return function() {
		qe(this, e);
	};
}
function Xe(e) {
	return function() {
		Je(this, e);
	};
}
function Ze(e, t) {
	return function() {
		(t.apply(this, arguments) ? qe : Je)(this, e);
	};
}
function Qe(e, t) {
	var n = R(e + "");
	if (arguments.length < 2) {
		for (var r = Ge(this.node()), i = -1, a = n.length; ++i < a;) if (!r.contains(n[i])) return !1;
		return !0;
	}
	return this.each((typeof t == "function" ? Ze : t ? Ye : Xe)(n, t));
}
//#endregion
//#region node_modules/d3-selection/src/selection/text.js
function $e() {
	this.textContent = "";
}
function et(e) {
	return function() {
		this.textContent = e;
	};
}
function tt(e) {
	return function() {
		var t = e.apply(this, arguments);
		this.textContent = t ?? "";
	};
}
function nt(e) {
	return arguments.length ? this.each(e == null ? $e : (typeof e == "function" ? tt : et)(e)) : this.node().textContent;
}
//#endregion
//#region node_modules/d3-selection/src/selection/html.js
function rt() {
	this.innerHTML = "";
}
function it(e) {
	return function() {
		this.innerHTML = e;
	};
}
function at(e) {
	return function() {
		var t = e.apply(this, arguments);
		this.innerHTML = t ?? "";
	};
}
function ot(e) {
	return arguments.length ? this.each(e == null ? rt : (typeof e == "function" ? at : it)(e)) : this.node().innerHTML;
}
//#endregion
//#region node_modules/d3-selection/src/selection/raise.js
function st() {
	this.nextSibling && this.parentNode.appendChild(this);
}
function ct() {
	return this.each(st);
}
//#endregion
//#region node_modules/d3-selection/src/selection/lower.js
function lt() {
	this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function ut() {
	return this.each(lt);
}
//#endregion
//#region node_modules/d3-selection/src/selection/append.js
function dt(e) {
	var t = typeof e == "function" ? e : T(e);
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
	var n = typeof e == "function" ? e : T(e), r = t == null ? ft : typeof t == "function" ? t : D(t);
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
function z(e) {
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
	var r = Ie(e), i = r.CustomEvent;
	typeof i == "function" ? i = new i(t, n) : (i = r.document.createEvent("Event"), n ? (i.initEvent(t, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(t, !1, !1)), e.dispatchEvent(i);
}
function B(e, t) {
	return function() {
		return wt(this, e, t);
	};
}
function Tt(e, t) {
	return function() {
		return wt(this, e, t.apply(this, arguments));
	};
}
function Et(e, t) {
	return this.each((typeof t == "function" ? Tt : B)(e, t));
}
//#endregion
//#region node_modules/d3-selection/src/selection/iterator.js
function* Dt() {
	for (var e = this._groups, t = 0, n = e.length; t < n; ++t) for (var r = e[t], i = 0, a = r.length, o; i < a; ++i) (o = r[i]) && (yield o);
}
//#endregion
//#region node_modules/d3-selection/src/selection/index.js
var Ot = [null];
function kt(e, t) {
	this._groups = e, this._parents = t;
}
function At() {
	return new kt([[document.documentElement]], Ot);
}
function jt() {
	return this;
}
kt.prototype = At.prototype = {
	constructor: kt,
	select: O,
	selectAll: j,
	selectChild: ae,
	selectChildren: ce,
	filter: le,
	data: ge,
	enter: ue,
	exit: ve,
	join: ye,
	merge: be,
	selection: jt,
	order: xe,
	sort: Se,
	call: we,
	nodes: Te,
	node: Ee,
	size: De,
	empty: Oe,
	each: ke,
	attr: Fe,
	style: Be,
	property: We,
	classed: Qe,
	text: nt,
	html: ot,
	raise: ct,
	lower: ut,
	append: dt,
	insert: pt,
	remove: ht,
	clone: vt,
	datum: z,
	on: Ct,
	dispatch: Et,
	[Symbol.iterator]: Dt
};
//#endregion
//#region node_modules/d3-selection/src/select.js
function V(e) {
	return typeof e == "string" ? new kt([[document.querySelector(e)]], [document.documentElement]) : new kt([[e]], Ot);
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
function H(e, t) {
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
var Nt = { passive: !1 }, Pt = {
	capture: !0,
	passive: !1
};
function Ft(e) {
	e.stopImmediatePropagation();
}
function It(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region node_modules/d3-drag/src/nodrag.js
function Lt(e) {
	var t = e.document.documentElement, n = V(e).on("dragstart.drag", It, Pt);
	"onselectstart" in t ? n.on("selectstart.drag", It, Pt) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function Rt(e, t) {
	var n = e.document.documentElement, r = V(e).on("dragstart.drag", null);
	t && (r.on("click.drag", It, Pt), setTimeout(function() {
		r.on("click.drag", null);
	}, 0)), "onselectstart" in n ? r.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
//#endregion
//#region node_modules/d3-drag/src/constant.js
var zt = (e) => () => e;
//#endregion
//#region node_modules/d3-drag/src/event.js
function Bt(e, { sourceEvent: t, subject: n, target: r, identifier: i, active: a, x: o, y: s, dx: c, dy: l, dispatch: u }) {
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
Bt.prototype.on = function() {
	var e = this._.on.apply(this._, arguments);
	return e === this._ ? this : e;
};
//#endregion
//#region node_modules/d3-drag/src/drag.js
function Vt(e) {
	return !e.ctrlKey && !e.button;
}
function Ht() {
	return this.parentNode;
}
function Ut(e, t) {
	return t ?? {
		x: e.x,
		y: e.y
	};
}
function Wt() {
	return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Gt() {
	var e = Vt, t = Ht, n = Ut, r = Wt, i = {}, a = g("start", "drag", "end"), o = 0, s, c, l, u, d = 0;
	function f(e) {
		e.on("mousedown.drag", p).filter(r).on("touchstart.drag", _).on("touchmove.drag", v, Nt).on("touchend.drag touchcancel.drag", y).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	}
	function p(n, r) {
		if (!(u || !e.call(this, n, r))) {
			var i = b(this, t.call(this, n, r), n, r, "mouse");
			i && (V(n.view).on("mousemove.drag", m, Pt).on("mouseup.drag", h, Pt), Lt(n.view), Ft(n), l = !1, s = n.clientX, c = n.clientY, i("start", n));
		}
	}
	function m(e) {
		if (It(e), !l) {
			var t = e.clientX - s, n = e.clientY - c;
			l = t * t + n * n > d;
		}
		i.mouse("drag", e);
	}
	function h(e) {
		V(e.view).on("mousemove.drag mouseup.drag", null), Rt(e.view, l), It(e), i.mouse("end", e);
	}
	function _(n, r) {
		if (e.call(this, n, r)) {
			var i = n.changedTouches, a = t.call(this, n, r), o = i.length, s, c;
			for (s = 0; s < o; ++s) (c = b(this, a, n, r, i[s].identifier, i[s])) && (Ft(n), c("start", n, i[s]));
		}
	}
	function v(e) {
		var t = e.changedTouches, n = t.length, r, a;
		for (r = 0; r < n; ++r) (a = i[t[r].identifier]) && (It(e), a("drag", e, t[r]));
	}
	function y(e) {
		var t = e.changedTouches, n = t.length, r, a;
		for (u && clearTimeout(u), u = setTimeout(function() {
			u = null;
		}, 500), r = 0; r < n; ++r) (a = i[t[r].identifier]) && (Ft(e), a("end", e, t[r]));
	}
	function b(e, t, r, s, c, l) {
		var u = a.copy(), d = H(l || r, t), p, m, h;
		if ((h = n.call(e, new Bt("beforestart", {
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
					d = H(l || a, t), _ = o;
					break;
			}
			u.call(r, e, new Bt(r, {
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
		return arguments.length ? (e = typeof t == "function" ? t : zt(!!t), f) : e;
	}, f.container = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : zt(e), f) : t;
	}, f.subject = function(e) {
		return arguments.length ? (n = typeof e == "function" ? e : zt(e), f) : n;
	}, f.touchable = function(e) {
		return arguments.length ? (r = typeof e == "function" ? e : zt(!!e), f) : r;
	}, f.on = function() {
		var e = a.on.apply(a, arguments);
		return e === a ? f : e;
	}, f.clickDistance = function(e) {
		return arguments.length ? (d = (e = +e) * e, f) : Math.sqrt(d);
	}, f;
}
//#endregion
//#region node_modules/d3-color/src/define.js
function Kt(e, t, n) {
	e.prototype = t.prototype = n, n.constructor = e;
}
function qt(e, t) {
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
Kt(Jt, pn, {
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
	return wn(this).formatHsl();
}
function fn() {
	return this.rgb().formatRgb();
}
function pn(e) {
	var t, n;
	return e = (e + "").trim().toLowerCase(), (t = en.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? mn(t) : n === 3 ? new U(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? hn(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? hn(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = tn.exec(e)) ? new U(t[1], t[2], t[3], 1) : (t = nn.exec(e)) ? new U(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = rn.exec(e)) ? hn(t[1], t[2], t[3], t[4]) : (t = an.exec(e)) ? hn(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = on.exec(e)) ? Cn(t[1], t[2] / 100, t[3] / 100, 1) : (t = sn.exec(e)) ? Cn(t[1], t[2] / 100, t[3] / 100, t[4]) : cn.hasOwnProperty(e) ? mn(cn[e]) : e === "transparent" ? new U(NaN, NaN, NaN, 0) : null;
}
function mn(e) {
	return new U(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function hn(e, t, n, r) {
	return r <= 0 && (e = t = n = NaN), new U(e, t, n, r);
}
function gn(e) {
	return e instanceof Jt || (e = pn(e)), e ? (e = e.rgb(), new U(e.r, e.g, e.b, e.opacity)) : new U();
}
function _n(e, t, n, r) {
	return arguments.length === 1 ? gn(e) : new U(e, t, n, r ?? 1);
}
function U(e, t, n, r) {
	this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
Kt(U, _n, qt(Jt, {
	brighter(e) {
		return e = e == null ? Xt : Xt ** +e, new U(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? Yt : Yt ** +e, new U(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	rgb() {
		return this;
	},
	clamp() {
		return new U(Sn(this.r), Sn(this.g), Sn(this.b), xn(this.opacity));
	},
	displayable() {
		return -.5 <= this.r && this.r < 255.5 && -.5 <= this.g && this.g < 255.5 && -.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
	},
	hex: vn,
	formatHex: vn,
	formatHex8: yn,
	formatRgb: bn,
	toString: bn
}));
function vn() {
	return `#${W(this.r)}${W(this.g)}${W(this.b)}`;
}
function yn() {
	return `#${W(this.r)}${W(this.g)}${W(this.b)}${W((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function bn() {
	let e = xn(this.opacity);
	return `${e === 1 ? "rgb(" : "rgba("}${Sn(this.r)}, ${Sn(this.g)}, ${Sn(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function xn(e) {
	return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function Sn(e) {
	return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function W(e) {
	return e = Sn(e), (e < 16 ? "0" : "") + e.toString(16);
}
function Cn(e, t, n, r) {
	return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new En(e, t, n, r);
}
function wn(e) {
	if (e instanceof En) return new En(e.h, e.s, e.l, e.opacity);
	if (e instanceof Jt || (e = pn(e)), !e) return new En();
	if (e instanceof En) return e;
	e = e.rgb();
	var t = e.r / 255, n = e.g / 255, r = e.b / 255, i = Math.min(t, n, r), a = Math.max(t, n, r), o = NaN, s = a - i, c = (a + i) / 2;
	return s ? (o = t === a ? (n - r) / s + (n < r) * 6 : n === a ? (r - t) / s + 2 : (t - n) / s + 4, s /= c < .5 ? a + i : 2 - a - i, o *= 60) : s = c > 0 && c < 1 ? 0 : o, new En(o, s, c, e.opacity);
}
function Tn(e, t, n, r) {
	return arguments.length === 1 ? wn(e) : new En(e, t, n, r ?? 1);
}
function En(e, t, n, r) {
	this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
Kt(En, Tn, qt(Jt, {
	brighter(e) {
		return e = e == null ? Xt : Xt ** +e, new En(this.h, this.s, this.l * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? Yt : Yt ** +e, new En(this.h, this.s, this.l * e, this.opacity);
	},
	rgb() {
		var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < .5 ? n : 1 - n) * t, i = 2 * n - r;
		return new U(kn(e >= 240 ? e - 240 : e + 120, i, r), kn(e, i, r), kn(e < 120 ? e + 240 : e - 120, i, r), this.opacity);
	},
	clamp() {
		return new En(Dn(this.h), On(this.s), On(this.l), xn(this.opacity));
	},
	displayable() {
		return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
	},
	formatHsl() {
		let e = xn(this.opacity);
		return `${e === 1 ? "hsl(" : "hsla("}${Dn(this.h)}, ${On(this.s) * 100}%, ${On(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
	}
}));
function Dn(e) {
	return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function On(e) {
	return Math.max(0, Math.min(1, e || 0));
}
function kn(e, t, n) {
	return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
//#endregion
//#region node_modules/d3-interpolate/src/constant.js
var An = (e) => () => e;
//#endregion
//#region node_modules/d3-interpolate/src/color.js
function jn(e, t) {
	return function(n) {
		return e + n * t;
	};
}
function Mn(e, t, n) {
	return e **= +n, t = t ** +n - e, n = 1 / n, function(r) {
		return (e + r * t) ** +n;
	};
}
function Nn(e) {
	return (e = +e) == 1 ? Pn : function(t, n) {
		return n - t ? Mn(t, n, e) : An(isNaN(t) ? n : t);
	};
}
function Pn(e, t) {
	var n = t - e;
	return n ? jn(e, n) : An(isNaN(e) ? t : e);
}
//#endregion
//#region node_modules/d3-interpolate/src/rgb.js
var Fn = (function e(t) {
	var n = Nn(t);
	function r(e, t) {
		var r = n((e = _n(e)).r, (t = _n(t)).r), i = n(e.g, t.g), a = n(e.b, t.b), o = Pn(e.opacity, t.opacity);
		return function(t) {
			return e.r = r(t), e.g = i(t), e.b = a(t), e.opacity = o(t), e + "";
		};
	}
	return r.gamma = e, r;
})(1);
//#endregion
//#region node_modules/d3-interpolate/src/number.js
function In(e, t) {
	return e = +e, t = +t, function(n) {
		return e * (1 - n) + t * n;
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/string.js
var Ln = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Rn = new RegExp(Ln.source, "g");
function zn(e) {
	return function() {
		return e;
	};
}
function Bn(e) {
	return function(t) {
		return e(t) + "";
	};
}
function Vn(e, t) {
	var n = Ln.lastIndex = Rn.lastIndex = 0, r, i, a, o = -1, s = [], c = [];
	for (e += "", t += ""; (r = Ln.exec(e)) && (i = Rn.exec(t));) (a = i.index) > n && (a = t.slice(n, a), s[o] ? s[o] += a : s[++o] = a), (r = r[0]) === (i = i[0]) ? s[o] ? s[o] += i : s[++o] = i : (s[++o] = null, c.push({
		i: o,
		x: In(r, i)
	})), n = Rn.lastIndex;
	return n < t.length && (a = t.slice(n), s[o] ? s[o] += a : s[++o] = a), s.length < 2 ? c[0] ? Bn(c[0].x) : zn(t) : (t = c.length, function(e) {
		for (var n = 0, r; n < t; ++n) s[(r = c[n]).i] = r.x(e);
		return s.join("");
	});
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/decompose.js
var Hn = 180 / Math.PI, Un = {
	translateX: 0,
	translateY: 0,
	rotate: 0,
	skewX: 0,
	scaleX: 1,
	scaleY: 1
};
function Wn(e, t, n, r, i, a) {
	var o, s, c;
	return (o = Math.sqrt(e * e + t * t)) && (e /= o, t /= o), (c = e * n + t * r) && (n -= e * c, r -= t * c), (s = Math.sqrt(n * n + r * r)) && (n /= s, r /= s, c /= s), e * r < t * n && (e = -e, t = -t, c = -c, o = -o), {
		translateX: i,
		translateY: a,
		rotate: Math.atan2(t, e) * Hn,
		skewX: Math.atan(c) * Hn,
		scaleX: o,
		scaleY: s
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/parse.js
var Gn;
function Kn(e) {
	let t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
	return t.isIdentity ? Un : Wn(t.a, t.b, t.c, t.d, t.e, t.f);
}
function qn(e) {
	return e == null || (Gn ||= document.createElementNS("http://www.w3.org/2000/svg", "g"), Gn.setAttribute("transform", e), !(e = Gn.transform.baseVal.consolidate())) ? Un : (e = e.matrix, Wn(e.a, e.b, e.c, e.d, e.e, e.f));
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/index.js
function Jn(e, t, n, r) {
	function i(e) {
		return e.length ? e.pop() + " " : "";
	}
	function a(e, r, i, a, o, s) {
		if (e !== i || r !== a) {
			var c = o.push("translate(", null, t, null, n);
			s.push({
				i: c - 4,
				x: In(e, i)
			}, {
				i: c - 2,
				x: In(r, a)
			});
		} else (i || a) && o.push("translate(" + i + t + a + n);
	}
	function o(e, t, n, a) {
		e === t ? t && n.push(i(n) + "rotate(" + t + r) : (e - t > 180 ? t += 360 : t - e > 180 && (e += 360), a.push({
			i: n.push(i(n) + "rotate(", null, r) - 2,
			x: In(e, t)
		}));
	}
	function s(e, t, n, a) {
		e === t ? t && n.push(i(n) + "skewX(" + t + r) : a.push({
			i: n.push(i(n) + "skewX(", null, r) - 2,
			x: In(e, t)
		});
	}
	function c(e, t, n, r, a, o) {
		if (e !== n || t !== r) {
			var s = a.push(i(a) + "scale(", null, ",", null, ")");
			o.push({
				i: s - 4,
				x: In(e, n)
			}, {
				i: s - 2,
				x: In(t, r)
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
var Yn = Jn(Kn, "px, ", "px)", "deg)"), Xn = Jn(qn, ", ", ")", ")"), Zn = 1e-12;
function Qn(e) {
	return ((e = Math.exp(e)) + 1 / e) / 2;
}
function $n(e) {
	return ((e = Math.exp(e)) - 1 / e) / 2;
}
function er(e) {
	return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
var tr = (function e(t, n, r) {
	function i(e, i) {
		var a = e[0], o = e[1], s = e[2], c = i[0], l = i[1], u = i[2], d = c - a, f = l - o, p = d * d + f * f, m, h;
		if (p < Zn) h = Math.log(u / s) / t, m = function(e) {
			return [
				a + e * d,
				o + e * f,
				s * Math.exp(t * e * h)
			];
		};
		else {
			var g = Math.sqrt(p), _ = (u * u - s * s + r * p) / (2 * s * n * g), v = (u * u - s * s - r * p) / (2 * u * n * g), y = Math.log(Math.sqrt(_ * _ + 1) - _);
			h = (Math.log(Math.sqrt(v * v + 1) - v) - y) / t, m = function(e) {
				var r = e * h, i = Qn(y), c = s / (n * g) * (i * er(t * r + y) - $n(y));
				return [
					a + c * d,
					o + c * f,
					s * i / Qn(t * r + y)
				];
			};
		}
		return m.duration = h * 1e3 * t / Math.SQRT2, m;
	}
	return i.rho = function(t) {
		var n = Math.max(.001, +t), r = n * n;
		return e(n, r, r * r);
	}, i;
})(Math.SQRT2, 2, 4), nr = 0, rr = 0, ir = 0, ar = 1e3, or, sr, cr = 0, lr = 0, ur = 0, dr = typeof performance == "object" && performance.now ? performance : Date, fr = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
	setTimeout(e, 17);
};
function pr() {
	return lr ||= (fr(mr), dr.now() + ur);
}
function mr() {
	lr = 0;
}
function hr() {
	this._call = this._time = this._next = null;
}
hr.prototype = gr.prototype = {
	constructor: hr,
	restart: function(e, t, n) {
		if (typeof e != "function") throw TypeError("callback is not a function");
		n = (n == null ? pr() : +n) + (t == null ? 0 : +t), !this._next && sr !== this && (sr ? sr._next = this : or = this, sr = this), this._call = e, this._time = n, xr();
	},
	stop: function() {
		this._call && (this._call = null, this._time = Infinity, xr());
	}
};
function gr(e, t, n) {
	var r = new hr();
	return r.restart(e, t, n), r;
}
function _r() {
	pr(), ++nr;
	for (var e = or, t; e;) (t = lr - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
	--nr;
}
function vr() {
	lr = (cr = dr.now()) + ur, nr = rr = 0;
	try {
		_r();
	} finally {
		nr = 0, br(), lr = 0;
	}
}
function yr() {
	var e = dr.now(), t = e - cr;
	t > ar && (ur -= t, cr = e);
}
function br() {
	for (var e, t = or, n, r = Infinity; t;) t._call ? (r > t._time && (r = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : or = n);
	sr = e, xr(r);
}
function xr(e) {
	nr || (rr &&= clearTimeout(rr), e - lr > 24 ? (e < Infinity && (rr = setTimeout(vr, e - dr.now() - ur)), ir &&= clearInterval(ir)) : (ir ||= (cr = dr.now(), setInterval(yr, ar)), nr = 1, fr(vr)));
}
//#endregion
//#region node_modules/d3-timer/src/timeout.js
function Sr(e, t, n) {
	var r = new hr();
	return t = t == null ? 0 : +t, r.restart((n) => {
		r.stop(), e(n + t);
	}, t, n), r;
}
//#endregion
//#region node_modules/d3-transition/src/transition/schedule.js
var Cr = g("start", "end", "cancel", "interrupt"), wr = [];
function Tr(e, t, n, r, i, a) {
	var o = e.__transition;
	if (!o) e.__transition = {};
	else if (n in o) return;
	kr(e, n, {
		name: t,
		index: r,
		group: i,
		on: Cr,
		tween: wr,
		time: a.time,
		delay: a.delay,
		duration: a.duration,
		ease: a.ease,
		timer: null,
		state: 0
	});
}
function Er(e, t) {
	var n = Or(e, t);
	if (n.state > 0) throw Error("too late; already scheduled");
	return n;
}
function Dr(e, t) {
	var n = Or(e, t);
	if (n.state > 3) throw Error("too late; already running");
	return n;
}
function Or(e, t) {
	var n = e.__transition;
	if (!n || !(n = n[t])) throw Error("transition not found");
	return n;
}
function kr(e, t, n) {
	var r = e.__transition, i;
	r[t] = n, n.timer = gr(a, 0, n.time);
	function a(e) {
		n.state = 1, n.timer.restart(o, n.delay, n.time), n.delay <= e && o(e - n.delay);
	}
	function o(a) {
		var l, u, d, f;
		if (n.state !== 1) return c();
		for (l in r) if (f = r[l], f.name === n.name) {
			if (f.state === 3) return Sr(o);
			f.state === 4 ? (f.state = 6, f.timer.stop(), f.on.call("interrupt", e, e.__data__, f.index, f.group), delete r[l]) : +l < t && (f.state = 6, f.timer.stop(), f.on.call("cancel", e, e.__data__, f.index, f.group), delete r[l]);
		}
		if (Sr(function() {
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
function Ar(e, t) {
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
function jr(e) {
	return this.each(function() {
		Ar(this, e);
	});
}
//#endregion
//#region node_modules/d3-transition/src/transition/tween.js
function Mr(e, t) {
	var n, r;
	return function() {
		var i = Dr(this, e), a = i.tween;
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
function Nr(e, t, n) {
	var r, i;
	if (typeof n != "function") throw Error();
	return function() {
		var a = Dr(this, e), o = a.tween;
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
function Pr(e, t) {
	var n = this._id;
	if (e += "", arguments.length < 2) {
		for (var r = Or(this.node(), n).tween, i = 0, a = r.length, o; i < a; ++i) if ((o = r[i]).name === e) return o.value;
		return null;
	}
	return this.each((t == null ? Mr : Nr)(n, e, t));
}
function Fr(e, t, n) {
	var r = e._id;
	return e.each(function() {
		var e = Dr(this, r);
		(e.value ||= {})[t] = n.apply(this, arguments);
	}), function(e) {
		return Or(e, r).value[t];
	};
}
//#endregion
//#region node_modules/d3-transition/src/transition/interpolate.js
function Ir(e, t) {
	var n;
	return (typeof t == "number" ? In : t instanceof pn ? Fn : (n = pn(t)) ? (t = n, Fn) : Vn)(e, t);
}
//#endregion
//#region node_modules/d3-transition/src/transition/attr.js
function Lr(e) {
	return function() {
		this.removeAttribute(e);
	};
}
function Rr(e) {
	return function() {
		this.removeAttributeNS(e.space, e.local);
	};
}
function zr(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = this.getAttribute(e);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function Br(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = this.getAttributeNS(e.space, e.local);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function Vr(e, t, n) {
	var r, i, a;
	return function() {
		var o, s = n(this), c;
		return s == null ? void this.removeAttribute(e) : (o = this.getAttribute(e), c = s + "", o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s)));
	};
}
function Hr(e, t, n) {
	var r, i, a;
	return function() {
		var o, s = n(this), c;
		return s == null ? void this.removeAttributeNS(e.space, e.local) : (o = this.getAttributeNS(e.space, e.local), c = s + "", o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s)));
	};
}
function Ur(e, t) {
	var n = S(e), r = n === "transform" ? Xn : Ir;
	return this.attrTween(e, typeof t == "function" ? (n.local ? Hr : Vr)(n, r, Fr(this, "attr." + e, t)) : t == null ? (n.local ? Rr : Lr)(n) : (n.local ? Br : zr)(n, r, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/attrTween.js
function Wr(e, t) {
	return function(n) {
		this.setAttribute(e, t.call(this, n));
	};
}
function Gr(e, t) {
	return function(n) {
		this.setAttributeNS(e.space, e.local, t.call(this, n));
	};
}
function Kr(e, t) {
	var n, r;
	function i() {
		var i = t.apply(this, arguments);
		return i !== r && (n = (r = i) && Gr(e, i)), n;
	}
	return i._value = t, i;
}
function qr(e, t) {
	var n, r;
	function i() {
		var i = t.apply(this, arguments);
		return i !== r && (n = (r = i) && Wr(e, i)), n;
	}
	return i._value = t, i;
}
function Jr(e, t) {
	var n = "attr." + e;
	if (arguments.length < 2) return (n = this.tween(n)) && n._value;
	if (t == null) return this.tween(n, null);
	if (typeof t != "function") throw Error();
	var r = S(e);
	return this.tween(n, (r.local ? Kr : qr)(r, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/delay.js
function Yr(e, t) {
	return function() {
		Er(this, e).delay = +t.apply(this, arguments);
	};
}
function Xr(e, t) {
	return t = +t, function() {
		Er(this, e).delay = t;
	};
}
function Zr(e) {
	var t = this._id;
	return arguments.length ? this.each((typeof e == "function" ? Yr : Xr)(t, e)) : Or(this.node(), t).delay;
}
//#endregion
//#region node_modules/d3-transition/src/transition/duration.js
function Qr(e, t) {
	return function() {
		Dr(this, e).duration = +t.apply(this, arguments);
	};
}
function $r(e, t) {
	return t = +t, function() {
		Dr(this, e).duration = t;
	};
}
function ei(e) {
	var t = this._id;
	return arguments.length ? this.each((typeof e == "function" ? Qr : $r)(t, e)) : Or(this.node(), t).duration;
}
//#endregion
//#region node_modules/d3-transition/src/transition/ease.js
function ti(e, t) {
	if (typeof t != "function") throw Error();
	return function() {
		Dr(this, e).ease = t;
	};
}
function ni(e) {
	var t = this._id;
	return arguments.length ? this.each(ti(t, e)) : Or(this.node(), t).ease;
}
//#endregion
//#region node_modules/d3-transition/src/transition/easeVarying.js
function ri(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		if (typeof n != "function") throw Error();
		Dr(this, e).ease = n;
	};
}
function ii(e) {
	if (typeof e != "function") throw Error();
	return this.each(ri(this._id, e));
}
//#endregion
//#region node_modules/d3-transition/src/transition/filter.js
function ai(e) {
	typeof e != "function" && (e = ne(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = [], c, l = 0; l < o; ++l) (c = a[l]) && e.call(c, c.__data__, l, a) && s.push(c);
	return new Pi(r, this._parents, this._name, this._id);
}
//#endregion
//#region node_modules/d3-transition/src/transition/merge.js
function oi(e) {
	if (e._id !== this._id) throw Error();
	for (var t = this._groups, n = e._groups, r = t.length, i = n.length, a = Math.min(r, i), o = Array(r), s = 0; s < a; ++s) for (var c = t[s], l = n[s], u = c.length, d = o[s] = Array(u), f, p = 0; p < u; ++p) (f = c[p] || l[p]) && (d[p] = f);
	for (; s < r; ++s) o[s] = t[s];
	return new Pi(o, this._parents, this._name, this._id);
}
//#endregion
//#region node_modules/d3-transition/src/transition/on.js
function si(e) {
	return (e + "").trim().split(/^|\s+/).every(function(e) {
		var t = e.indexOf(".");
		return t >= 0 && (e = e.slice(0, t)), !e || e === "start";
	});
}
function ci(e, t, n) {
	var r, i, a = si(t) ? Er : Dr;
	return function() {
		var o = a(this, e), s = o.on;
		s !== r && (i = (r = s).copy()).on(t, n), o.on = i;
	};
}
function li(e, t) {
	var n = this._id;
	return arguments.length < 2 ? Or(this.node(), n).on.on(e) : this.each(ci(n, e, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/remove.js
function ui(e) {
	return function() {
		var t = this.parentNode;
		for (var n in this.__transition) if (+n !== e) return;
		t && t.removeChild(this);
	};
}
function di() {
	return this.on("end.remove", ui(this._id));
}
//#endregion
//#region node_modules/d3-transition/src/transition/select.js
function fi(e) {
	var t = this._name, n = this._id;
	typeof e != "function" && (e = D(e));
	for (var r = this._groups, i = r.length, a = Array(i), o = 0; o < i; ++o) for (var s = r[o], c = s.length, l = a[o] = Array(c), u, d, f = 0; f < c; ++f) (u = s[f]) && (d = e.call(u, u.__data__, f, s)) && ("__data__" in u && (d.__data__ = u.__data__), l[f] = d, Tr(l[f], t, n, f, l, Or(u, n)));
	return new Pi(a, this._parents, t, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/selectAll.js
function pi(e) {
	var t = this._name, n = this._id;
	typeof e != "function" && (e = ee(e));
	for (var r = this._groups, i = r.length, a = [], o = [], s = 0; s < i; ++s) for (var c = r[s], l = c.length, u, d = 0; d < l; ++d) if (u = c[d]) {
		for (var f = e.call(u, u.__data__, d, c), p, m = Or(u, n), h = 0, g = f.length; h < g; ++h) (p = f[h]) && Tr(p, t, n, h, f, m);
		a.push(f), o.push(u);
	}
	return new Pi(a, o, t, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/selection.js
var mi = At.prototype.constructor;
function hi() {
	return new mi(this._groups, this._parents);
}
//#endregion
//#region node_modules/d3-transition/src/transition/style.js
function gi(e, t) {
	var n, r, i;
	return function() {
		var a = L(this, e), o = (this.style.removeProperty(e), L(this, e));
		return a === o ? null : a === n && o === r ? i : i = t(n = a, r = o);
	};
}
function _i(e) {
	return function() {
		this.style.removeProperty(e);
	};
}
function vi(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = L(this, e);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function yi(e, t, n) {
	var r, i, a;
	return function() {
		var o = L(this, e), s = n(this), c = s + "";
		return s ?? (c = s = (this.style.removeProperty(e), L(this, e))), o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s));
	};
}
function bi(e, t) {
	var n, r, i, a = "style." + t, o = "end." + a, s;
	return function() {
		var c = Dr(this, e), l = c.on, u = c.value[a] == null ? s ||= _i(t) : void 0;
		(l !== n || i !== u) && (r = (n = l).copy()).on(o, i = u), c.on = r;
	};
}
function xi(e, t, n) {
	var r = (e += "") == "transform" ? Yn : Ir;
	return t == null ? this.styleTween(e, gi(e, r)).on("end.style." + e, _i(e)) : typeof t == "function" ? this.styleTween(e, yi(e, r, Fr(this, "style." + e, t))).each(bi(this._id, e)) : this.styleTween(e, vi(e, r, t), n).on("end.style." + e, null);
}
//#endregion
//#region node_modules/d3-transition/src/transition/styleTween.js
function Si(e, t, n) {
	return function(r) {
		this.style.setProperty(e, t.call(this, r), n);
	};
}
function Ci(e, t, n) {
	var r, i;
	function a() {
		var a = t.apply(this, arguments);
		return a !== i && (r = (i = a) && Si(e, a, n)), r;
	}
	return a._value = t, a;
}
function wi(e, t, n) {
	var r = "style." + (e += "");
	if (arguments.length < 2) return (r = this.tween(r)) && r._value;
	if (t == null) return this.tween(r, null);
	if (typeof t != "function") throw Error();
	return this.tween(r, Ci(e, t, n ?? ""));
}
//#endregion
//#region node_modules/d3-transition/src/transition/text.js
function Ti(e) {
	return function() {
		this.textContent = e;
	};
}
function Ei(e) {
	return function() {
		var t = e(this);
		this.textContent = t ?? "";
	};
}
function Di(e) {
	return this.tween("text", typeof e == "function" ? Ei(Fr(this, "text", e)) : Ti(e == null ? "" : e + ""));
}
//#endregion
//#region node_modules/d3-transition/src/transition/textTween.js
function Oi(e) {
	return function(t) {
		this.textContent = e.call(this, t);
	};
}
function ki(e) {
	var t, n;
	function r() {
		var r = e.apply(this, arguments);
		return r !== n && (t = (n = r) && Oi(r)), t;
	}
	return r._value = e, r;
}
function Ai(e) {
	var t = "text";
	if (arguments.length < 1) return (t = this.tween(t)) && t._value;
	if (e == null) return this.tween(t, null);
	if (typeof e != "function") throw Error();
	return this.tween(t, ki(e));
}
//#endregion
//#region node_modules/d3-transition/src/transition/transition.js
function ji() {
	for (var e = this._name, t = this._id, n = Ii(), r = this._groups, i = r.length, a = 0; a < i; ++a) for (var o = r[a], s = o.length, c, l = 0; l < s; ++l) if (c = o[l]) {
		var u = Or(c, t);
		Tr(c, e, n, l, o, {
			time: u.time + u.delay + u.duration,
			delay: 0,
			duration: u.duration,
			ease: u.ease
		});
	}
	return new Pi(r, this._parents, e, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/end.js
function Mi() {
	var e, t, n = this, r = n._id, i = n.size();
	return new Promise(function(a, o) {
		var s = { value: o }, c = { value: function() {
			--i === 0 && a();
		} };
		n.each(function() {
			var n = Dr(this, r), i = n.on;
			i !== e && (t = (e = i).copy(), t._.cancel.push(s), t._.interrupt.push(s), t._.end.push(c)), n.on = t;
		}), i === 0 && a();
	});
}
//#endregion
//#region node_modules/d3-transition/src/transition/index.js
var Ni = 0;
function Pi(e, t, n, r) {
	this._groups = e, this._parents = t, this._name = n, this._id = r;
}
function Fi(e) {
	return At().transition(e);
}
function Ii() {
	return ++Ni;
}
var Li = At.prototype;
Pi.prototype = Fi.prototype = {
	constructor: Pi,
	select: fi,
	selectAll: pi,
	selectChild: Li.selectChild,
	selectChildren: Li.selectChildren,
	filter: ai,
	merge: oi,
	selection: hi,
	transition: ji,
	call: Li.call,
	nodes: Li.nodes,
	node: Li.node,
	size: Li.size,
	empty: Li.empty,
	each: Li.each,
	on: li,
	attr: Ur,
	attrTween: Jr,
	style: xi,
	styleTween: wi,
	text: Di,
	textTween: Ai,
	remove: di,
	tween: Pr,
	delay: Zr,
	duration: ei,
	ease: ni,
	easeVarying: ii,
	end: Mi,
	[Symbol.iterator]: Li[Symbol.iterator]
};
//#endregion
//#region node_modules/d3-ease/src/cubic.js
function Ri(e) {
	return --e * e * e + 1;
}
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
	e instanceof Pi ? (t = e._id, e = e._name) : (t = Ii(), (n = Bi).time = pr(), e = e == null ? null : e + "");
	for (var r = this._groups, i = r.length, a = 0; a < i; ++a) for (var o = r[a], s = o.length, c, l = 0; l < s; ++l) (c = o[l]) && Tr(c, e, t, l, o, n || Vi(c, t));
	return new Pi(r, this._parents, e, t);
}
At.prototype.interrupt = jr, At.prototype.transition = Hi;
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
function ca(e, t, n, r, i) {
	this.node = e, this.x0 = t, this.y0 = n, this.x1 = r, this.y1 = i;
}
//#endregion
//#region node_modules/d3-quadtree/src/find.js
function la(e, t, n) {
	var r, i = this._x0, a = this._y0, o, s, c, l, u = this._x1, d = this._y1, f = [], p = this._root, m, h;
	for (p && f.push(new ca(p, i, a, u, d)), n == null ? n = Infinity : (i = e - n, a = t - n, u = e + n, d = t + n, n *= n); m = f.pop();) if (!(!(p = m.node) || (o = m.x0) > u || (s = m.y0) > d || (c = m.x1) < i || (l = m.y1) < a)) if (p.length) {
		var g = (o + c) / 2, _ = (s + l) / 2;
		f.push(new ca(p[3], g, _, c, l), new ca(p[2], o, _, g, l), new ca(p[1], g, s, c, _), new ca(p[0], o, s, g, _)), (h = (t >= _) << 1 | e >= g) && (m = f[f.length - 1], f[f.length - 1] = f[f.length - 1 - h], f[f.length - 1 - h] = m);
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
function ua(e) {
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
function da(e) {
	for (var t = 0, n = e.length; t < n; ++t) this.remove(e[t]);
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/root.js
function fa() {
	return this._root;
}
//#endregion
//#region node_modules/d3-quadtree/src/size.js
function pa() {
	var e = 0;
	return this.visit(function(t) {
		if (!t.length) do
			++e;
		while (t = t.next);
	}), e;
}
//#endregion
//#region node_modules/d3-quadtree/src/visit.js
function ma(e) {
	var t = [], n, r = this._root, i, a, o, s, c;
	for (r && t.push(new ca(r, this._x0, this._y0, this._x1, this._y1)); n = t.pop();) if (!e(r = n.node, a = n.x0, o = n.y0, s = n.x1, c = n.y1) && r.length) {
		var l = (a + s) / 2, u = (o + c) / 2;
		(i = r[3]) && t.push(new ca(i, l, u, s, c)), (i = r[2]) && t.push(new ca(i, a, u, l, c)), (i = r[1]) && t.push(new ca(i, l, o, s, u)), (i = r[0]) && t.push(new ca(i, a, o, l, u));
	}
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/visitAfter.js
function ha(e) {
	var t = [], n = [], r;
	for (this._root && t.push(new ca(this._root, this._x0, this._y0, this._x1, this._y1)); r = t.pop();) {
		var i = r.node;
		if (i.length) {
			var a, o = r.x0, s = r.y0, c = r.x1, l = r.y1, u = (o + c) / 2, d = (s + l) / 2;
			(a = i[0]) && t.push(new ca(a, o, s, u, d)), (a = i[1]) && t.push(new ca(a, u, s, c, d)), (a = i[2]) && t.push(new ca(a, o, d, u, l)), (a = i[3]) && t.push(new ca(a, u, d, c, l));
		}
		n.push(r);
	}
	for (; r = n.pop();) e(r.node, r.x0, r.y0, r.x1, r.y1);
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/x.js
function ga(e) {
	return e[0];
}
function _a(e) {
	return arguments.length ? (this._x = e, this) : this._x;
}
//#endregion
//#region node_modules/d3-quadtree/src/y.js
function va(e) {
	return e[1];
}
function ya(e) {
	return arguments.length ? (this._y = e, this) : this._y;
}
//#endregion
//#region node_modules/d3-quadtree/src/quadtree.js
function ba(e, t, n) {
	var r = new xa(t ?? ga, n ?? va, NaN, NaN, NaN, NaN);
	return e == null ? r : r.addAll(e);
}
function xa(e, t, n, r, i, a) {
	this._x = e, this._y = t, this._x0 = n, this._y0 = r, this._x1 = i, this._y1 = a, this._root = void 0;
}
function Sa(e) {
	for (var t = { data: e.data }, n = t; e = e.next;) n = n.next = { data: e.data };
	return t;
}
var Ca = ba.prototype = xa.prototype;
Ca.copy = function() {
	var e = new xa(this._x, this._y, this._x0, this._y0, this._x1, this._y1), t = this._root, n, r;
	if (!t) return e;
	if (!t.length) return e._root = Sa(t), e;
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
	}) : t.target[i] = Sa(r));
	return e;
}, Ca.add = na, Ca.addAll = ia, Ca.cover = aa, Ca.data = oa, Ca.extent = sa, Ca.find = la, Ca.remove = ua, Ca.removeAll = da, Ca.root = fa, Ca.size = pa, Ca.visit = ma, Ca.visitAfter = ha, Ca.x = _a, Ca.y = ya;
//#endregion
//#region node_modules/d3-force/src/constant.js
function wa(e) {
	return function() {
		return e;
	};
}
//#endregion
//#region node_modules/d3-force/src/jiggle.js
function Ta(e) {
	return (e() - .5) * 1e-6;
}
//#endregion
//#region node_modules/d3-force/src/collide.js
function Ea(e) {
	return e.x + e.vx;
}
function Da(e) {
	return e.y + e.vy;
}
function Oa(e) {
	var t, n, r, i = 1, a = 1;
	typeof e != "function" && (e = wa(e == null ? 1 : +e));
	function o() {
		for (var e, o = t.length, c, l, u, d, f, p, m = 0; m < a; ++m) for (c = ba(t, Ea, Da).visitAfter(s), e = 0; e < o; ++e) l = t[e], f = n[l.index], p = f * f, u = l.x + l.vx, d = l.y + l.vy, c.visit(h);
		function h(e, t, n, a, o) {
			var s = e.data, c = e.r, m = f + c;
			if (s) {
				if (s.index > l.index) {
					var h = u - s.x - s.vx, g = d - s.y - s.vy, _ = h * h + g * g;
					_ < m * m && (h === 0 && (h = Ta(r), _ += h * h), g === 0 && (g = Ta(r), _ += g * g), _ = (m - (_ = Math.sqrt(_))) / _ * i, l.vx += (h *= _) * (m = (c *= c) / (p + c)), l.vy += (g *= _) * m, s.vx -= h * (m = 1 - m), s.vy -= g * m);
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
		return arguments.length ? (e = typeof t == "function" ? t : wa(+t), c(), o) : e;
	}, o;
}
//#endregion
//#region node_modules/d3-force/src/link.js
function ka(e) {
	return e.index;
}
function Aa(e, t) {
	var n = e.get(t);
	if (!n) throw Error("node not found: " + t);
	return n;
}
function ja(e) {
	var t = ka, n = d, r, i = wa(30), a, o, s, c, l, u = 1;
	e ??= [];
	function d(e) {
		return 1 / Math.min(s[e.source.index], s[e.target.index]);
	}
	function f(t) {
		for (var n = 0, i = e.length; n < u; ++n) for (var o = 0, s, d, f, p, m, h, g; o < i; ++o) s = e[o], d = s.source, f = s.target, p = f.x + f.vx - d.x - d.vx || Ta(l), m = f.y + f.vy - d.y - d.vy || Ta(l), h = Math.sqrt(p * p + m * m), h = (h - a[o]) / h * t * r[o], p *= h, m *= h, f.vx -= p * (g = c[o]), f.vy -= m * g, d.vx += p * (g = 1 - g), d.vy += m * g;
	}
	function p() {
		if (o) {
			var n, i = o.length, l = e.length, u = new Map(o.map((e, n) => [t(e, n, o), e])), d;
			for (n = 0, s = Array(i); n < l; ++n) d = e[n], d.index = n, typeof d.source != "object" && (d.source = Aa(u, d.source)), typeof d.target != "object" && (d.target = Aa(u, d.target)), s[d.source.index] = (s[d.source.index] || 0) + 1, s[d.target.index] = (s[d.target.index] || 0) + 1;
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
		return arguments.length ? (n = typeof e == "function" ? e : wa(+e), m(), f) : n;
	}, f.distance = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : wa(+e), h(), f) : i;
	}, f;
}
//#endregion
//#region node_modules/d3-force/src/lcg.js
var Ma = 1664525, Na = 1013904223, Pa = 4294967296;
function Fa() {
	let e = 1;
	return () => (e = (Ma * e + Na) % Pa) / Pa;
}
//#endregion
//#region node_modules/d3-force/src/simulation.js
function Ia(e) {
	return e.x;
}
function La(e) {
	return e.y;
}
var Ra = 10, za = Math.PI * (3 - Math.sqrt(5));
function Ba(e) {
	var t, n = 1, r = .001, i = 1 - r ** (1 / 300), a = 0, o = .6, s = /* @__PURE__ */ new Map(), c = gr(d), l = g("tick", "end"), u = Fa();
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
				var i = Ra * Math.sqrt(.5 + t), a = t * za;
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
function Va() {
	var e, t, n, r, i = wa(-30), a, o = 1, s = Infinity, c = .81;
	function l(n) {
		var i, a = e.length, o = ba(e, Ia, La).visitAfter(d);
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
		if (p * p / c < m) return m < s && (d === 0 && (d = Ta(n), m += d * d), f === 0 && (f = Ta(n), m += f * f), m < o && (m = Math.sqrt(o * m)), t.vx += d * e.value * r / m, t.vy += f * e.value * r / m), !0;
		if (!(e.length || m >= s)) {
			(e.data !== t || e.next) && (d === 0 && (d = Ta(n), m += d * d), f === 0 && (f = Ta(n), m += f * f), m < o && (m = Math.sqrt(o * m)));
			do
				e.data !== t && (p = a[e.data.index] * r / m, t.vx += d * p, t.vy += f * p);
			while (e = e.next);
		}
	}
	return l.initialize = function(t, r) {
		e = t, n = r, u();
	}, l.strength = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : wa(+e), u(), l) : i;
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
function Ha(e) {
	for (var t = -1, n = e.length, r = 0, i = 0, a, o = e[n - 1], s, c = 0; ++t < n;) a = o, o = e[t], c += s = a[0] * o[1] - o[0] * a[1], r += (a[0] + o[0]) * s, i += (a[1] + o[1]) * s;
	return c *= 3, [r / c, i / c];
}
//#endregion
//#region node_modules/d3-polygon/src/cross.js
function Ua(e, t, n) {
	return (t[0] - e[0]) * (n[1] - e[1]) - (t[1] - e[1]) * (n[0] - e[0]);
}
//#endregion
//#region node_modules/d3-polygon/src/hull.js
function Wa(e, t) {
	return e[0] - t[0] || e[1] - t[1];
}
function Ga(e) {
	let t = e.length, n = [0, 1], r = 2, i;
	for (i = 2; i < t; ++i) {
		for (; r > 1 && Ua(e[n[r - 2]], e[n[r - 1]], e[i]) <= 0;) --r;
		n[r++] = i;
	}
	return n.slice(0, r);
}
function Ka(e) {
	if ((n = e.length) < 3) return null;
	var t, n, r = Array(n), i = Array(n);
	for (t = 0; t < n; ++t) r[t] = [
		+e[t][0],
		+e[t][1],
		t
	];
	for (r.sort(Wa), t = 0; t < n; ++t) i[t] = [r[t][0], -r[t][1]];
	var a = Ga(r), o = Ga(i), s = o[0] === a[0], c = o[o.length - 1] === a[a.length - 1], l = [];
	for (t = a.length - 1; t >= 0; --t) l.push(e[r[a[t]][2]]);
	for (t = +s; t < o.length - c; ++t) l.push(e[r[o[t]][2]]);
	return l;
}
//#endregion
//#region node_modules/d3-shape/src/constant.js
function qa(e) {
	return function() {
		return e;
	};
}
var Ja = Math.PI;
Ja / 2, 2 * Ja;
//#endregion
//#region node_modules/d3-shape/src/path.js
function Ya(e) {
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
function Xa(e) {
	return typeof e == "object" && "length" in e ? e : Array.from(e);
}
//#endregion
//#region node_modules/d3-shape/src/curve/linear.js
function Za(e) {
	this._context = e;
}
Za.prototype = {
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
function Qa(e) {
	return new Za(e);
}
//#endregion
//#region node_modules/d3-shape/src/point.js
function $a(e) {
	return e[0];
}
function eo(e) {
	return e[1];
}
//#endregion
//#region node_modules/d3-shape/src/line.js
function to(e, t) {
	var n = qa(!0), r = null, i = Qa, a = null, o = Ya(s);
	e = typeof e == "function" ? e : e === void 0 ? $a : qa(e), t = typeof t == "function" ? t : t === void 0 ? eo : qa(t);
	function s(s) {
		var c, l = (s = Xa(s)).length, u, d = !1, f;
		for (r ?? (a = i(f = o())), c = 0; c <= l; ++c) !(c < l && n(u = s[c], c, s)) === d && ((d = !d) ? a.lineStart() : a.lineEnd()), d && a.point(+e(u, c, s), +t(u, c, s));
		if (f) return a = null, f + "" || null;
	}
	return s.x = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : qa(+t), s) : e;
	}, s.y = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : qa(+e), s) : t;
	}, s.defined = function(e) {
		return arguments.length ? (n = typeof e == "function" ? e : qa(!!e), s) : n;
	}, s.curve = function(e) {
		return arguments.length ? (i = e, r != null && (a = i(r)), s) : i;
	}, s.context = function(e) {
		return arguments.length ? (e == null ? r = a = null : a = i(r = e), s) : r;
	}, s;
}
//#endregion
//#region node_modules/d3-shape/src/noop.js
function no() {}
//#endregion
//#region node_modules/d3-shape/src/curve/cardinal.js
function ro(e, t, n) {
	e._context.bezierCurveTo(e._x1 + e._k * (e._x2 - e._x0), e._y1 + e._k * (e._y2 - e._y0), e._x2 + e._k * (e._x1 - t), e._y2 + e._k * (e._y1 - n), e._x2, e._y2);
}
function io(e, t) {
	this._context = e, this._k = (1 - t) / 6;
}
io.prototype = {
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
				ro(this, this._x1, this._y1);
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
				ro(this, e, t);
				break;
		}
		this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
}, (function e(t) {
	function n(e) {
		return new io(e, t);
	}
	return n.tension = function(t) {
		return e(+t);
	}, n;
})(0);
//#endregion
//#region node_modules/d3-shape/src/curve/cardinalClosed.js
function ao(e, t) {
	this._context = e, this._k = (1 - t) / 6;
}
ao.prototype = {
	areaStart: no,
	areaEnd: no,
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
				ro(this, e, t);
				break;
		}
		this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
}, (function e(t) {
	function n(e) {
		return new ao(e, t);
	}
	return n.tension = function(t) {
		return e(+t);
	}, n;
})(0);
//#endregion
//#region node_modules/d3-shape/src/curve/catmullRom.js
function oo(e, t, n) {
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
function so(e, t) {
	this._context = e, this._alpha = t;
}
so.prototype = {
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
				oo(this, e, t);
				break;
		}
		this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
}, (function e(t) {
	function n(e) {
		return t ? new so(e, t) : new io(e, 0);
	}
	return n.alpha = function(t) {
		return e(+t);
	}, n;
})(.5);
//#endregion
//#region node_modules/d3-shape/src/curve/catmullRomClosed.js
function co(e, t) {
	this._context = e, this._alpha = t;
}
co.prototype = {
	areaStart: no,
	areaEnd: no,
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
				oo(this, e, t);
				break;
		}
		this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
};
var lo = (function e(t) {
	function n(e) {
		return t ? new co(e, t) : new ao(e, 0);
	}
	return n.alpha = function(t) {
		return e(+t);
	}, n;
})(.5), uo = (e) => () => e;
//#endregion
//#region node_modules/d3-zoom/src/event.js
function fo(e, { sourceEvent: t, target: n, transform: r, dispatch: i }) {
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
function po(e, t, n) {
	this.k = e, this.x = t, this.y = n;
}
po.prototype = {
	constructor: po,
	scale: function(e) {
		return e === 1 ? this : new po(this.k * e, this.x, this.y);
	},
	translate: function(e, t) {
		return e === 0 & t === 0 ? this : new po(this.k, this.x + this.k * e, this.y + this.k * t);
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
var mo = new po(1, 0, 0);
ho.prototype = po.prototype;
function ho(e) {
	for (; !e.__zoom;) if (!(e = e.parentNode)) return mo;
	return e.__zoom;
}
//#endregion
//#region node_modules/d3-zoom/src/noevent.js
function go(e) {
	e.stopImmediatePropagation();
}
function _o(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region node_modules/d3-zoom/src/zoom.js
function vo(e) {
	return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function yo() {
	var e = this;
	return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function bo() {
	return this.__zoom || mo;
}
function xo(e) {
	return -e.deltaY * (e.deltaMode === 1 ? .05 : e.deltaMode ? 1 : .002) * (e.ctrlKey ? 10 : 1);
}
function So() {
	return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Co(e, t, n) {
	var r = e.invertX(t[0][0]) - n[0][0], i = e.invertX(t[1][0]) - n[1][0], a = e.invertY(t[0][1]) - n[0][1], o = e.invertY(t[1][1]) - n[1][1];
	return e.translate(i > r ? (r + i) / 2 : Math.min(0, r) || Math.max(0, i), o > a ? (a + o) / 2 : Math.min(0, a) || Math.max(0, o));
}
function wo() {
	var e = vo, t = yo, n = Co, r = xo, i = So, a = [0, Infinity], o = [[-Infinity, -Infinity], [Infinity, Infinity]], s = 250, c = tr, l = g("start", "zoom", "end"), u, d, f, p = 500, m = 150, h = 0, _ = 10;
	function v(e) {
		e.property("__zoom", bo).on("wheel.zoom", T, { passive: !1 }).on("mousedown.zoom", E).on("dblclick.zoom", D).filter(i).on("touchstart.zoom", O).on("touchmove.zoom", k).on("touchend.zoom touchcancel.zoom", A).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	}
	v.transform = function(e, t, n, r) {
		var i = e.selection ? e.selection() : e;
		i.property("__zoom", bo), e === i ? i.interrupt().each(function() {
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
			return n(mo.translate(c[0], c[1]).scale(s.k).translate(typeof r == "function" ? -r.apply(this, arguments) : -r, typeof i == "function" ? -i.apply(this, arguments) : -i), e, o);
		}, a, s);
	};
	function y(e, t) {
		return t = Math.max(a[0], Math.min(a[1], t)), t === e.k ? e : new po(t, e.x, e.y);
	}
	function b(e, t, n) {
		var r = t[0] - n[0] * e.k, i = t[1] - n[1] * e.k;
		return r === e.x && i === e.y ? e : new po(e.k, r, i);
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
					e = new po(n, l[0] - t[0] * n, l[1] - t[1] * n);
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
			var t = V(this.that).datum();
			l.call(e, this.that, new fo(e, {
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
		var s = C(this, i).event(t), c = this.__zoom, l = Math.max(a[0], Math.min(a[1], c.k * 2 ** r.apply(this, arguments))), u = H(t);
		if (s.wheel) (s.mouse[0][0] !== u[0] || s.mouse[0][1] !== u[1]) && (s.mouse[1] = c.invert(s.mouse[0] = u)), clearTimeout(s.wheel);
		else if (c.k === l) return;
		else s.mouse = [u, c.invert(u)], Ar(this), s.start();
		_o(t), s.wheel = setTimeout(d, m), s.zoom("mouse", n(b(y(c, l), s.mouse[0], s.mouse[1]), s.extent, o));
		function d() {
			s.wheel = null, s.end();
		}
	}
	function E(t, ...r) {
		if (f || !e.apply(this, arguments)) return;
		var i = t.currentTarget, a = C(this, r, !0).event(t), s = V(t.view).on("mousemove.zoom", d, !0).on("mouseup.zoom", p, !0), c = H(t, i), l = t.clientX, u = t.clientY;
		Lt(t.view), go(t), a.mouse = [c, this.__zoom.invert(c)], Ar(this), a.start();
		function d(e) {
			if (_o(e), !a.moved) {
				var t = e.clientX - l, r = e.clientY - u;
				a.moved = t * t + r * r > h;
			}
			a.event(e).zoom("mouse", n(b(a.that.__zoom, a.mouse[0] = H(e, i), a.mouse[1]), a.extent, o));
		}
		function p(e) {
			s.on("mousemove.zoom mouseup.zoom", null), Rt(e.view, a.moved), _o(e), a.event(e).end();
		}
	}
	function D(r, ...i) {
		if (e.apply(this, arguments)) {
			var a = this.__zoom, c = H(r.changedTouches ? r.changedTouches[0] : r, this), l = a.invert(c), u = a.k * (r.shiftKey ? .5 : 2), d = n(b(y(a, u), c, l), t.apply(this, i), o);
			_o(r), s > 0 ? V(this).transition().duration(s).call(S, d, c, r) : V(this).call(v.transform, d, c, r);
		}
	}
	function O(t, ...n) {
		if (e.apply(this, arguments)) {
			var r = t.touches, i = r.length, a = C(this, n, t.changedTouches.length === i).event(t), o, s, c, l;
			for (go(t), s = 0; s < i; ++s) c = r[s], l = H(c, this), l = [
				l,
				this.__zoom.invert(l),
				c.identifier
			], a.touch0 ? !a.touch1 && a.touch0[2] !== l[2] && (a.touch1 = l, a.taps = 0) : (a.touch0 = l, o = !0, a.taps = 1 + !!u);
			u &&= clearTimeout(u), o && (a.taps < 2 && (d = l[0], u = setTimeout(function() {
				u = null;
			}, p)), Ar(this), a.start());
		}
	}
	function k(e, ...t) {
		if (this.__zooming) {
			var r = C(this, t).event(e), i = e.changedTouches, a = i.length, s, c, l, u;
			for (_o(e), s = 0; s < a; ++s) c = i[s], l = H(c, this), r.touch0 && r.touch0[2] === c.identifier ? r.touch0[0] = l : r.touch1 && r.touch1[2] === c.identifier && (r.touch1[0] = l);
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
			for (go(e), f && clearTimeout(f), f = setTimeout(function() {
				f = null;
			}, p), a = 0; a < i; ++a) o = r[a], n.touch0 && n.touch0[2] === o.identifier ? delete n.touch0 : n.touch1 && n.touch1[2] === o.identifier && delete n.touch1;
			if (n.touch1 && !n.touch0 && (n.touch0 = n.touch1, delete n.touch1), n.touch0) n.touch0[1] = this.__zoom.invert(n.touch0[0]);
			else if (n.end(), n.taps === 2 && (o = H(o, this), Math.hypot(d[0] - o[0], d[1] - o[1]) < _)) {
				var s = V(this).on("dblclick.zoom");
				s && s.apply(this, arguments);
			}
		}
	}
	return v.wheelDelta = function(e) {
		return arguments.length ? (r = typeof e == "function" ? e : uo(+e), v) : r;
	}, v.filter = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : uo(!!t), v) : e;
	}, v.touchable = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : uo(!!e), v) : i;
	}, v.extent = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : uo([[+e[0][0], +e[0][1]], [+e[1][0], +e[1][1]]]), v) : t;
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
		return arguments.length ? (h = (e = +e) * e, v) : Math.sqrt(h);
	}, v.tapDistance = function(e) {
		return arguments.length ? (_ = +e, v) : _;
	}, v;
}
var To = {
	graphContainer: "_graphContainer_y2psv_3",
	flowSingleDot: "_flowSingleDot_y2psv_1"
}, Eo = /* @__PURE__ */ p(((e, t) => {
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
})), Do = (/* @__PURE__ */ p(((e, t) => {
	var { hashString: n, rng: r } = Eo(), i = (e) => (Math.round(e * 10) / 10).toString();
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
	card: "_card_gkc6j_5",
	draft: "_draft_gkc6j_24",
	published: "_published_gkc6j_28",
	pinned: "_pinned_gkc6j_32",
	marker: "_marker_gkc6j_37",
	title: "_title_gkc6j_46",
	titleCentered: "_titleCentered_gkc6j_57",
	titleInline: "_titleInline_gkc6j_73",
	preview: "_preview_gkc6j_83",
	scroll: "_scroll_gkc6j_93",
	full: "_full_gkc6j_109",
	popout: "_popout_gkc6j_126",
	imageCard: "_imageCard_gkc6j_145",
	imageFrame: "_imageFrame_gkc6j_156",
	imageCaption: "_imageCaption_gkc6j_173",
	scrollFull: "_scrollFull_gkc6j_184",
	titleScrolling: "_titleScrolling_gkc6j_188",
	imageMark: "_imageMark_gkc6j_200",
	bookmarkMark: "_bookmarkMark_gkc6j_214",
	bookmarkCount: "_bookmarkCount_gkc6j_233",
	glow: "_glow_gkc6j_244",
	cardTitle: "_cardTitle_gkc6j_254",
	resizeGrip: "_resizeGrip_gkc6j_260",
	cardCenter: "_cardCenter_gkc6j_304",
	cardSubtitle: "_cardSubtitle_gkc6j_324",
	readBar: "_readBar_gkc6j_370",
	readFill: "_readFill_gkc6j_381",
	readMark: "_readMark_gkc6j_388",
	complete: "_complete_gkc6j_398",
	sketchBorder: "_sketchBorder_gkc6j_408",
	sketchMain: "_sketchMain_gkc6j_421",
	sketchGhost: "_sketchGhost_gkc6j_422"
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
}, Oo = 140, ko = 80, Ao = 700, jo = 700;
function Mo({ width: e, height: t, zoomScale: n = 1, onResize: i, onResizeEnd: a }) {
	let [c, l] = s(!1), u = o(null), p = (r, o) => {
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
			t.includes("e") && (d = a + c), t.includes("w") && (d = a - c), t.includes("s") && (f = o + l), t.includes("n") && (f = o - l), d = Math.max(Oo, Math.min(Ao, Math.round(d))), f = Math.max(ko, Math.min(jo, Math.round(f))), i && i({
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
	}, []), /* @__PURE__ */ f("div", {
		className: c ? K.resizing : void 0,
		children: [
			/* @__PURE__ */ d("div", {
				className: `${K.handle} ${K.handleN}`,
				onPointerDown: (e) => p("n", e),
				title: "Drag to resize height"
			}),
			/* @__PURE__ */ d("div", {
				className: `${K.handle} ${K.handleS}`,
				onPointerDown: (e) => p("s", e),
				title: "Drag to resize height"
			}),
			/* @__PURE__ */ d("div", {
				className: `${K.handle} ${K.handleW}`,
				onPointerDown: (e) => p("w", e),
				title: "Drag to resize width"
			}),
			/* @__PURE__ */ d("div", {
				className: `${K.handle} ${K.handleE}`,
				onPointerDown: (e) => p("e", e),
				title: "Drag to resize width"
			}),
			/* @__PURE__ */ d("div", {
				className: `${K.handle} ${K.handleNW}`,
				onPointerDown: (e) => p("nw", e),
				title: "Drag to resize"
			}),
			/* @__PURE__ */ d("div", {
				className: `${K.handle} ${K.handleNE}`,
				onPointerDown: (e) => p("ne", e),
				title: "Drag to resize"
			}),
			/* @__PURE__ */ d("div", {
				className: `${K.handle} ${K.handleSW}`,
				onPointerDown: (e) => p("sw", e),
				title: "Drag to resize"
			}),
			/* @__PURE__ */ d("div", {
				className: `${K.handle} ${K.handleSE}`,
				onPointerDown: (e) => p("se", e),
				title: "Drag to resize"
			})
		]
	});
}
//#endregion
//#region src/components/NodeView/TextView/TextView.jsx
var No = (/* @__PURE__ */ p(((e, t) => {
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
})))(), Po = /* @__PURE__ */ new Map();
function Fo(e, t, n, r) {
	let i = `${e}|${Math.round(t)}|${Math.round(n)}|${r}`, a = Po.get(i);
	return a || (Po.size > 400 && Po.clear(), a = (0, Do.roughRect)(t, n, r, e), Po.set(i, a)), a;
}
function Io({ article: e, width: t, height: n, viewState: r, fullContent: i, onResize: a, cardSettings: o }) {
	let { hovered: s = !1, pinned: c = !1, lod: l = "full", zoomScale: u = 1 } = r || {}, p = s || c, m = c && !!i, h = !(e._status === "published" || e._status === "bloomed" || e.syndication && e.syndication.canonical), g = e.containerColor || e.color || e._source && e._source.color, _ = r?.bookmarkCount ?? (Array.isArray(r?.bookmarks) ? r.bookmarks.length : Array.isArray(e?.bookmarks) ? e.bookmarks.length : 0);
	if (e.kind === "image" && e.image) return /* @__PURE__ */ d(Bo, {
		article: e,
		width: t,
		height: n,
		pinned: c,
		hovered: s,
		isDraft: h,
		zoomScale: u,
		bookmarkCount: _,
		onResize: a
	});
	let v = (e._source && e._source.prominence || e.originalItem && e.originalItem._source && e.originalItem._source.prominence || "secondary") === "primary" ? h ? "#24304a" : "#1e3a5f" : "#23232f", y = !!e.image, b = r && r.progress, x = b ? Math.max(0, Math.min(1, b.max || 0)) : 0, S = !!(b && b.done), C = [
		G.card,
		S && G.complete,
		g && !c && G.glow,
		h ? G.draft : G.published,
		p && G.expanded,
		c && G.pinned,
		r.lod === "marker" && !p && G.marker
	].filter(Boolean).join(" "), w = r.lod !== "marker", T = o?.cornerRadius == null ? 10 : o.cornerRadius, E = r.lod === "marker" && !p || !t || !n ? null : Fo(e.id || e.title || "", t, n, T);
	return /* @__PURE__ */ f("div", {
		className: C,
		"data-pp-card": !0,
		style: {
			width: t,
			height: n,
			background: v,
			...o?.cornerRadius != null && !(r.lod === "marker" && !p) ? { borderRadius: o.cornerRadius } : {},
			...g && !c ? { "--nv-src": g } : {}
		},
		children: [
			E && /* @__PURE__ */ f("svg", {
				className: G.sketchBorder,
				viewBox: `0 0 ${t} ${n}`,
				preserveAspectRatio: "none",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ d("path", {
					className: G.sketchGhost,
					d: E.ghost
				}), /* @__PURE__ */ d("path", {
					className: G.sketchMain,
					d: E.main
				})]
			}),
			_ > 0 && /* @__PURE__ */ f("div", {
				className: G.bookmarkMark,
				title: _ === 1 ? "1 bookmark" : `${_} bookmarks`,
				children: [/* @__PURE__ */ d("svg", {
					viewBox: "0 0 16 16",
					width: "12",
					height: "12",
					fill: "currentColor",
					children: /* @__PURE__ */ d("path", { d: "M3 2v12l5-3 5 3V2z" })
				}), _ > 1 && /* @__PURE__ */ d("span", {
					className: G.bookmarkCount,
					children: _
				})]
			}),
			y && /* @__PURE__ */ d("div", {
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
			/* @__PURE__ */ d(zo, {
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
			w && (x > 0 || S) && /* @__PURE__ */ d("div", {
				className: G.readBar,
				role: "progressbar",
				"aria-label": "Read",
				"aria-valuemin": 0,
				"aria-valuemax": 100,
				"aria-valuenow": Math.round((S ? 1 : x) * 100),
				"data-read-progress": S ? "done" : Math.round(x * 100),
				children: /* @__PURE__ */ d("div", {
					className: G.readFill,
					style: { width: `${(S ? 1 : x) * 100}%` }
				})
			}),
			w && S && /* @__PURE__ */ d("div", {
				className: G.readMark,
				title: "Read to the end",
				"aria-hidden": "true",
				children: "✓"
			}),
			c && /* @__PURE__ */ d(Vo, {}),
			w && /* @__PURE__ */ d(Mo, {
				width: t,
				height: n,
				zoomScale: u,
				onResize: a
			})
		]
	});
}
function Lo(e, t, n, r = {}) {
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
var Ro = 260;
function zo({ article: e, width: t, height: n, bandHeight: r = 0, viewState: i, expanded: a, useFullArticle: o, fullContent: s, cardSettings: c }) {
	if (a) {
		let t = o ? s : e.description || "", r = e.title || e.label;
		return n && n < Ro ? /* @__PURE__ */ f("div", {
			className: `${G.scroll} ${G.scrollFull} ${o ? G.full : ""} rp-scroll`,
			children: [/* @__PURE__ */ d("div", {
				className: G.titleScrolling,
				children: r
			}), t && /* @__PURE__ */ d("div", { dangerouslySetInnerHTML: { __html: t } })]
		}) : /* @__PURE__ */ f(u, { children: [/* @__PURE__ */ d("div", {
			className: G.title,
			children: r
		}), t && /* @__PURE__ */ d("div", {
			className: `${G.scroll} ${o ? G.full : ""} rp-scroll`,
			dangerouslySetInnerHTML: { __html: t }
		})] });
	}
	if (i.lod === "marker") return null;
	let l = c?.subtitle || typeof window < "u" && window.SETTINGS?.graph?.card?.subtitle, p = null;
	if (l && e.series_part != null && e.series_part !== "") {
		let t = e.series_part, n = (0, No.numberToLowercaseWords)(t);
		p = l.replace(/\{n\}/g, String(t)).replace(/\{n_words\}/g, n);
	}
	let m = i.lod === "slug" ? e.label || e.labelMedium || e.title || "" : e.title || e.label, h = Lo(m, t, p ? n - 30 : n, {
		min: c?.labelMinFontSize ?? 14,
		max: c?.labelMaxFontSize ?? 26,
		lineHeight: 1.05,
		pad: 8
	}), g = Math.max(11, Math.round(h * .62));
	return /* @__PURE__ */ f("div", {
		className: G.cardCenter,
		children: [/* @__PURE__ */ d("div", {
			className: G.cardTitle,
			style: { fontSize: `${h}px` },
			children: m
		}), p && /* @__PURE__ */ d("div", {
			className: G.cardSubtitle,
			style: { fontSize: `${g}px` },
			children: p
		})]
	});
}
function Bo({ article: e, width: t, height: n, pinned: r, hovered: i, isDraft: a, zoomScale: o, bookmarkCount: s = 0, onResize: c }) {
	let l = [
		G.imageCard,
		a ? G.draft : G.published,
		r && G.pinned
	].filter(Boolean).join(" "), u = n - 24;
	return /* @__PURE__ */ f("div", {
		className: l,
		style: {
			width: t,
			height: n
		},
		children: [
			s > 0 && /* @__PURE__ */ f("div", {
				className: G.bookmarkMark,
				title: s === 1 ? "1 bookmark" : `${s} bookmarks`,
				children: [/* @__PURE__ */ d("svg", {
					viewBox: "0 0 16 16",
					width: "12",
					height: "12",
					fill: "currentColor",
					children: /* @__PURE__ */ d("path", { d: "M3 2v12l5-3 5 3V2z" })
				}), s > 1 && /* @__PURE__ */ d("span", {
					className: G.bookmarkCount,
					children: s
				})]
			}),
			/* @__PURE__ */ d("div", {
				className: G.imageFrame,
				style: {
					width: t,
					height: u,
					backgroundImage: `url('${e.image}')`
				}
			}),
			/* @__PURE__ */ d("div", {
				className: G.imageCaption,
				children: e.short_title || e.title || e.label
			}),
			r && /* @__PURE__ */ d(Vo, {}),
			/* @__PURE__ */ d(Mo, {
				width: t,
				height: n,
				zoomScale: o,
				onResize: c
			})
		]
	});
}
function Vo() {
	return /* @__PURE__ */ d("div", {
		"data-popout": "1",
		title: "Open in reader",
		className: G.popout,
		children: /* @__PURE__ */ f("svg", {
			"data-popout": "1",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2.2",
			width: "13",
			height: "13",
			style: { pointerEvents: "none" },
			children: [
				/* @__PURE__ */ d("path", { d: "M14 3h7v7" }),
				/* @__PURE__ */ d("path", { d: "M21 3l-9 9" }),
				/* @__PURE__ */ d("path", { d: "M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" })
			]
		})
	});
}
//#endregion
//#region src/components/NodeView/registry.js
var Ho = {
	text: Io,
	essay: Io,
	fragment: Io,
	multi: Io,
	image: Io,
	"podcast-episode": Io,
	video: Io
};
function Uo(e, t = {}) {
	return {
		...Ho,
		...t
	}[e] || Io;
}
//#endregion
//#region src/components/GraphViewer/layouts.js
var Wo = /* @__PURE__ */ p(((e, t) => {
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
})), Go = /* @__PURE__ */ p(((e, t) => {
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
					let e = Math.max(...x.map((e) => Math.max(e.w, e.h))), n = d.startRadius == null ? e * .65 : d.startRadius, a = t + n, s = -Math.PI / 2, c = (e) => {
						let t = n * Math.exp(i * (e - s));
						return {
							x: 0 + t * Math.cos(e),
							y: a + t * Math.sin(e)
						};
					};
					D = {
						cx: 0,
						cy: a,
						a: n,
						b: i
					};
					let l = s;
					x.forEach((e, a) => {
						let d = {
							x: 0,
							y: t
						};
						if (a > 0) for (let t = 0; t < 2e5; t++) {
							let t = n * Math.exp(i * (l - s));
							if (l += 3 / (t * Math.sqrt(1 + i * i)), d = c(l), r(o(d.x, d.y, e.w, e.h))) break;
						}
						u.push(d), E.push(o(d.x, d.y, e.w, e.h));
					});
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
})), Ko = /* @__PURE__ */ p(((e, t) => {
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
})), qo = /* @__PURE__ */ p(((e, t) => {
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
})), Jo = /* @__PURE__ */ p(((e, t) => {
	function n(e, t) {
		let n = /* @__PURE__ */ new Set();
		for (let r of e) for (let e of t(r) || []) n.add(e);
		return n;
	}
	var r = (e) => e && typeof e == "object" ? e.id : e;
	function i(e, t) {
		return t.has(r(e.source)) || t.has(r(e.target));
	}
	t.exports = {
		closedMemberSet: n,
		edgeHidden: i
	};
})), Yo = /* @__PURE__ */ p(((e, t) => {
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
})), Xo = /* @__PURE__ */ p(((e, t) => {
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
})), Zo = /* @__PURE__ */ p(((e, t) => {
	var { TIMES_OF_DAY: n, sceneMonth: r } = Xo(), i = {
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
})), Qo = Wo(), $o = Go(), es = Ko(), ts = qo(), ns = Jo(), rs = Yo(), is = Eo(), as = Zo();
function os(e, t = {}) {
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
function ss(e, t, n) {
	let r = (e) => e && e.type === "article" && e._source && n.has(e._source.id);
	e.selectAll(".node").style("display", (e) => r(e) ? "none" : null), t.selectAll(".node-card").style("display", (e) => r(e) ? "none" : null), e.selectAll(".link, .link-hit").style("display", (e) => {
		let t = typeof e.source == "object" ? e.source : null, n = typeof e.target == "object" ? e.target : null;
		return r(t) || r(n) ? "none" : null;
	});
}
function cs(e, t, n) {
	if (!n) {
		t.selectAll(".node-card").classed("dimmed", !1), e.selectAll(".node").classed("dimmed", !1), e.selectAll(".link").classed("dimmed", !1);
		return;
	}
	t.selectAll(".node-card").classed("dimmed", (e) => !n.has(e.id)), e.selectAll(".node").classed("dimmed", (e) => e.type === "article" ? !n.has(e.id) : !1), e.selectAll(".link").classed("dimmed", (e) => {
		let t = typeof e.source == "object" ? e.source.id : e.source, r = typeof e.target == "object" ? e.target.id : e.target;
		return !n.has(t) && !n.has(r);
	});
}
var ls = .35, us = .6;
function ds(e) {
	return e < ls ? "marker" : e < us ? "title" : "full";
}
function fs(e) {
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
function ps({ feedData: e, onNodeSelect: n, hiddenSources: i, filteredArticleIds: a, viewState: s, layout: c = "force", timeAxis: u, graphSettings: f, colorOverrides: p, apiRef: h, onNodeFocus: g }) {
	let _ = f || {}, v = {
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
		..._.card || {}
	}, y = {
		fontSize: 22,
		padding: 11,
		maxWidth: 150,
		maxLines: 3,
		cornerRadius: 9,
		opacity: .7,
		..._.tag || {}
	}, b = {
		dock: "left",
		inset: 54,
		endPadding: 70,
		connectorOpacity: .45,
		connectorWidth: 1.6,
		spineOpacity: .55,
		spineWidth: 3,
		tickFontSize: 13,
		..._.timeAxis || {}
	}, x = {
		linkDistance: 160,
		chargeStrength: -500,
		collidePadding: 10,
		velocityDecay: .7,
		alphaDecay: .028,
		..._.simulation || {}
	}, S = o(null), C = o(null), w = o(null), T = o(n);
	r(() => {
		T.current = n;
	}, [n]);
	let E = o(g);
	r(() => {
		E.current = g;
	}, [g]);
	let D = o(null), O = (e) => {
		D.current = e ? e.id : null, E.current && E.current(e ? e.originalItem || e : null);
	}, k = o(s);
	r(() => {
		k.current = s;
	}, [s]);
	let A = fs(v);
	v.glowPadding;
	let ee = o(null), te = o(c), j = o(!1), ne = o(null), M = o(null), re = o(null), ie = o(null), N = (e) => e.originalItem && e.originalItem.id || e.id, ae = (e) => te.current + "::" + N(e), P = o(/* @__PURE__ */ new Set()), oe = o(null), se = o(1), ce = o("full"), le = o(/* @__PURE__ */ new Set());
	r(() => {
		le.current = i instanceof Set ? i : new Set(i || []), !(!C.current || !w.current) && ss(C.current, V(w.current), le.current);
	}, [i]), r(() => {
		if (!(!S.current || !p)) for (let [e, t] of Object.entries(p)) t && S.current.style.setProperty(e, t);
	}, [p]), r(() => {
		if (s) return s.subscribe(() => {
			re.current && re.current(), ie.current && ie.current();
		});
	}, [s]), r(() => {
		!C.current || !w.current || cs(C.current, V(w.current), a);
	}, [a]), r(() => {
		if (!e || !S.current) return;
		let n = S.current, r = n.clientWidth, i = n.clientHeight, a = getComputedStyle(n), o = os(e, {
			tagColor: a.getPropertyValue("--gv-tag-color").trim() || "#f39c12",
			topologyColor: a.getPropertyValue("--gv-topology-color").trim() || "#9b59b6",
			placeholderColor: a.getPropertyValue("--gv-placeholder-color").trim() || "#7f8c8d",
			visibleLayers: Array.isArray(_.visibleLayers) ? _.visibleLayers : ["sequence"]
		});
		V(n).selectAll("svg").remove(), V(n).selectAll(".cards-layer").remove();
		let s = V(n).append("svg").attr("width", r).attr("height", i).style("position", "absolute").style("inset", "0").style("pointer-events", "all");
		C.current = s;
		let c = s.append("defs");
		c.append("marker").attr("id", "sequence-arrow").attr("viewBox", "0 0 10 10").attr("refX", 8).attr("refY", 5).attr("markerWidth", 7).attr("markerHeight", 7).attr("orient", "auto").append("path").attr("d", "M 0 1.5 L 8 5 L 0 8.5 z").attr("fill", "var(--gv-accent, #d4af37)");
		let u = V(n).append("div").attr("class", "cards-layer").style("position", "absolute").style("left", "0").style("top", "0").style("width", "100%").style("height", "100%").style("pointer-events", "none");
		w.current = u.node();
		let d = u.append("div").attr("class", "cards-transform").style("transform-origin", "0 0").style("position", "absolute").style("left", "0").style("top", "0").style("width", "0").style("height", "0").style("overflow", "visible"), p = s.append("g"), g = !1, b = !!_.initialFocus && _.initialFocus !== "all", E = _.initialFocusMinScale == null ? .4 : _.initialFocusMinScale, j = 0, F = null, ue = 0, de = !1, fe = {
			x: 0,
			y: 0,
			k: 1
		}, pe = () => j ? ` rotate(${-j})` : "", me = (e) => (0, ts.rotatedView)(e, F, j);
		function he(e) {
			fe = me(e), p.attr("transform", `translate(${fe.x},${fe.y}) rotate(${j}) scale(${fe.k})`), d && d.style("transform", `translate3d(${fe.x}px, ${fe.y}px, 0px) rotate(${j}deg) scale(${fe.k})`), n && n.style.setProperty("--gv-unrot", `${-j}deg`), ue !== j && (ue = j, de && Mn());
		}
		let ge = (e, t) => (0, ts.viewToScreen)(fe, j, e, t), _e = wo().on("zoom", (e) => {
			e.sourceEvent && (g = !0, b = !1), he(e.transform);
			let t = e.transform.k;
			se.current = t, un && pn(), M.current && M.current();
			let n = ds(t);
			n !== ce.current && (ce.current = n, Tn(), jn());
		});
		s.call(_e).on("dblclick.zoom", null);
		let ve = (e) => {
			let t = e.touches[0], n = e.touches[1];
			return Math.atan2(n.clientY - t.clientY, n.clientX - t.clientX) * 180 / Math.PI;
		}, ye = (e) => {
			let t = n.getBoundingClientRect(), r = e.touches[0], i = e.touches[1];
			return [(r.clientX + i.clientX) / 2 - t.left, (r.clientY + i.clientY) / 2 - t.top];
		}, be = (e) => {
			if (e.touches.length !== 2) return;
			let [t, n] = ye(e);
			F = {
				theta0: j,
				a0: ve(e),
				mx: t,
				my: n,
				started: !1
			};
		}, xe = (e) => {
			if (!F || e.touches.length !== 2) return;
			let [t, n] = ye(e);
			F.mx = t, F.my = n;
			let r = (0, ts.angleDelta)(ve(e), F.a0);
			if (!F.started) {
				if (Math.abs(r) < 10) return;
				F.started = !0, F.a0 = ve(e);
				return;
			}
			j = (0, ts.normalizeAngle)(F.theta0 + r);
		}, Se = (e) => {
			if (!F || e.touches.length >= 2) return;
			let t = me(ho(s.node()));
			F = null, s.call(_e.transform, mo.translate(t.x, t.y).scale(t.k));
		};
		n.addEventListener("touchstart", be, {
			capture: !0,
			passive: !0
		}), n.addEventListener("touchmove", xe, {
			capture: !0,
			passive: !0
		}), n.addEventListener("touchend", Se, {
			capture: !0,
			passive: !0
		}), n.addEventListener("touchcancel", Se, {
			capture: !0,
			passive: !0
		});
		function Ce({ repaint: e = !0 } = {}) {
			if (!j && !F) return;
			F = null;
			let t = ho(s.node()), n = r / 2, a = i / 2, o = (0, ts.screenToView)(fe, j, n, a);
			j = 0, e && s.call(_e.transform, mo.translate(n - o[0] * t.k, a - o[1] * t.k).scale(t.k));
		}
		let we = (0, rs.createTapGate)({
			ms: Number.isFinite(_.doubleTapMs) ? _.doubleTapMs : 250,
			px: 32
		});
		function Te(e) {
			let t = e && e.changedTouches && e.changedTouches.length ? e.changedTouches[0] : e, a = n.getBoundingClientRect();
			return !t || !Number.isFinite(t.clientX) ? [r / 2, i / 2] : [t.clientX - a.left, t.clientY - a.top];
		}
		function Ee(e, t, n) {
			g = !0, b = !1, s.transition("tap-zoom").duration(320).ease(Ri).call(_e.scaleBy, n, [e, t]);
		}
		function De(e, t, n) {
			let [r, i] = Te(e), a = !!(e && e.shiftKey);
			we.tap(r, i, t, n || (() => Ee(r, i, a ? .5 : 2)));
		}
		let Oe = null, ke = null, Ae = (e) => {
			if (e.touches.length === 2) {
				let [t, n] = ye(e);
				Oe = {
					t: Date.now(),
					x: t,
					y: n,
					moved: !1
				};
			} else e.touches.length > 2 && (Oe = null);
		}, je = (e) => {
			if (!Oe || e.touches.length !== 2) return;
			let [t, n] = ye(e);
			Math.hypot(t - Oe.x, n - Oe.y) > 14 && (Oe.moved = !0);
		}, Me = (e) => {
			if (!Oe || e.touches.length > 0) return;
			let t = Oe;
			Oe = null;
			let n = Date.now();
			t.moved || n - t.t > 350 || (ke && n - ke.t <= 450 && Math.hypot(t.x - ke.x, t.y - ke.y) <= 60 ? (ke = null, Ee(t.x, t.y, .5)) : ke = {
				t: n,
				x: t.x,
				y: t.y
			});
		};
		n.addEventListener("touchstart", Ae, {
			capture: !0,
			passive: !0
		}), n.addEventListener("touchmove", je, {
			capture: !0,
			passive: !0
		}), n.addEventListener("touchend", Me, {
			capture: !0,
			passive: !0
		});
		let Ne = !1;
		if (k.current && (Ne = (0, Qo.layoutIsDegenerate)(o.nodes.map((e) => k.current.nodeState(ae(e))).filter((e) => e && Number.isFinite(e.x) && Number.isFinite(e.y)), A({
			hovered: !1,
			pinned: !1
		}))), k.current && !Ne) for (let e of o.nodes) {
			let t = k.current.nodeState(ae(e)), n = k.current.nodeState(N(e));
			t && typeof t.x == "number" && typeof t.y == "number" && (e.x = t.x, e.y = t.y, t.auto || (e.fx = t.x, e.fy = t.y)), n && typeof n.w == "number" && typeof n.h == "number" && (e._size = {
				width: n.w,
				height: n.h
			});
		}
		if (P.current = /* @__PURE__ */ new Set(), k.current) for (let e of o.nodes) {
			let t = k.current.nodeState(N(e));
			e.type === "article" && t && t.pinned && P.current.add(e.id);
		}
		if (k.current && Ne) for (let e of o.nodes) {
			let t = k.current.nodeState(N(e));
			t && typeof t.w == "number" && typeof t.h == "number" && (e._size = {
				width: t.w,
				height: t.h
			});
		}
		let I = Ba().force("link", ja().id((e) => e.id).distance(x.linkDistance)).force("charge", Va().strength(x.chargeStrength)).force("collide", Oa().radius((e) => (e._r || (e.type === "article" ? Math.hypot(v.width, v.height) / 2 : e.size / 2)) + x.collidePadding).strength(1).iterations(3)).force("center", ta(r / 2, i / 2)).velocityDecay(x.velocityDecay).alphaDecay(x.alphaDecay), Pe = () => {
			ne.current && ne.current(), S.current && (r = S.current.clientWidth, i = S.current.clientHeight, s.attr("width", r).attr("height", i));
		};
		window.addEventListener("resize", Pe);
		let Fe = s.append("g").attr("class", "time-axis-layer"), Ie = p.append("g").attr("class", "roots-layer").attr("aria-hidden", "true").style("pointer-events", "none"), Le = p.append("g").attr("class", "containers-layer"), Re = /* @__PURE__ */ new Map(), ze = /* @__PURE__ */ new Map();
		for (let e of o.containers || []) Re.set(e.id, /* @__PURE__ */ new Set()), ze.set(e.id, /* @__PURE__ */ new Set());
		for (let e of o.containmentEdges || []) Re.has(e.source) && Re.has(e.target) ? Re.get(e.source).add(e.target) : ze.has(e.source) && ze.get(e.source).add(e.target);
		let Be = /* @__PURE__ */ new Map();
		function L(e, t) {
			if (!t && Be.has(e)) return Be.get(e);
			let n = t || /* @__PURE__ */ new Set();
			if (n.has(e)) return [];
			n.add(e);
			let r = Array.from(ze.get(e) || []), i = Array.from(Re.get(e) || []).flatMap((e) => L(e, n)), a = Array.from(new Set([...r, ...i]));
			return t || Be.set(e, a), a;
		}
		let Ve = [...o.containers || []].sort((e, t) => t.parent === e.id ? -1 : +(e.parent === t.id)), He = Le.selectAll(".container-group").data(Ve, (e) => e.id).enter().append("g").attr("class", "container-group").attr("data-container-id", (e) => e.id);
		He.append("path").attr("class", "container-hull").attr("fill", (e) => e.fill || "rgba(212, 175, 55, 0.03)").attr("stroke", (e) => e.stroke || "rgba(212, 175, 55, 0.45)").attr("stroke-width", (e) => e.strokeWidth || 1.5).attr("stroke-dasharray", (e) => e.strokeDasharray || (e.parent ? null : "6 6")), He.append("path").attr("class", "container-hull-ghost").attr("stroke", (e) => e.stroke || "rgba(212, 175, 55, 0.45)");
		let Ue = typeof document < "u" && document.documentElement.getAttribute("data-pp-theme") === "sketchbook", We = () => _.initialCollapsed === "all" ? (e.containers || []).map((e) => e.id) : Array.isArray(_.initialCollapsed) ? _.initialCollapsed : [], R = new Set(We()), Ge = /* @__PURE__ */ new Map(), Ke = /* @__PURE__ */ new Map(), qe = 1.05, Je = (0, es.showContainerCount)(_);
		function Ye(e) {
			let t = (e.label || e.id).split(/\s+/), n = [], r = "";
			for (let e of t) r ? r.length + 1 + e.length > 15 ? (n.push(r), r = e) : r += " " + e : r = e;
			return r && n.push(r), n;
		}
		let Xe = .42, Ze = .2, Qe = (e) => e.status ? String(e.status) : "";
		function $e(e) {
			let t = Ye(e).length, n = Qe(e) ? Ze + Xe * 1.3 : 0;
			return {
				n: t,
				statusH: n,
				total: t * qe + n
			};
		}
		function et(e, t) {
			let n = Ye(t), { n: r, total: i } = $e(t), a = -i / 2;
			e.selectAll("*").remove(), n.forEach((t, n) => {
				e.append("tspan").attr("class", "label-line").attr("x", 0).attr("y", `${a + (n + .5) * qe}em`).text(t), Je && n === r - 1 && e.append("tspan").attr("class", "label-count").attr("font-weight", "500").attr("dx", "12px").attr("font-size", "0.5em").text("");
			});
			let o = Qe(t);
			if (o) {
				let t = a + r * qe + Ze + Xe * 1.3 / 2;
				e.append("tspan").attr("class", "label-status").attr("x", 0).attr("font-size", `${Xe}em`).attr("font-weight", "500").attr("letter-spacing", "0.02em").attr("y", `${t / Xe}em`).text(o);
			}
		}
		let tt = typeof document < "u" ? document.createElement("canvas").getContext("2d") : null;
		function nt() {
			return typeof document > "u" ? "'Atkinson', sans-serif" : getComputedStyle(document.documentElement).getPropertyValue("--pp-title-font").trim() || "'Atkinson', sans-serif";
		}
		function rt(e, t, n) {
			let r = e.length * t * .05;
			return tt ? (tt.font = `${Ue ? 400 : n} ${t}px ${nt()}`, tt.measureText(e).width * 1.06 + r) : e.length * t * .6 + r;
		}
		function it(e, t) {
			let n = Ye(e), r = Je ? rt(" 000", t * .5, 500) + 12 : 0, i = Qe(e), a = Math.max(...n.map((e, i) => rt(e, t, 700) + (i === n.length - 1 ? r : 0)), i ? rt(i, t * Xe, 500) : 0), o = $e(e).total * t + .3 * t;
			return {
				w: a + 24,
				h: o + 12
			};
		}
		function at(e) {
			return e.badgeColor || e.color || e.stroke || "#d4af37";
		}
		let ot = He.append("g").attr("class", "container-badge").style("touch-action", "manipulation");
		ot.append("rect").attr("class", "container-badge-hit").attr("fill", "transparent").attr("pointer-events", "all");
		let st = ot.append("text").attr("class", "container-badge-text").attr("text-anchor", "middle").attr("dominant-baseline", "central").style("user-select", "none").attr("fill", (e) => at(e)).attr("opacity", .55).attr("font-size", (e) => e.parent ? "52px" : "64px");
		st.each(function(e) {
			et(V(this), e);
		});
		function ct() {
			if (typeof document > "u") return;
			let e = typeof window < "u" ? window.SETTINGS : null, t = document.documentElement.getAttribute("data-pp-mode") || "dark", n = getComputedStyle(document.body).backgroundColor, r = !n || /rgba\([^)]*,\s*0\)$/.test(n) || n === "transparent", i = (0, as.allBackgrounds)((0, as.config)(e), t, r ? null : n);
			st.each(function(e) {
				let t = (0, as.legibleOn)(at(e), i, { opacity: .55 });
				V(this).attr("fill", t.color).attr("opacity", t.opacity);
			});
		}
		ct();
		function lt() {
			ct();
			let e = document.documentElement.getAttribute("data-pp-theme") === "sketchbook";
			if (e === Ue) return;
			Ue = e;
			let t = () => {
				de && (qt(), Mn());
			};
			document.fonts && document.fonts.load ? document.fonts.load(`48px ${nt()}`).then(t, t) : t();
		}
		let ut = typeof MutationObserver < "u" ? new MutationObserver(lt) : null;
		Ue && typeof document < "u" && document.fonts && document.fonts.load && document.fonts.load(`48px ${nt()}`).then(() => {
			!de || !C.current || (qt(), Mn());
		}, () => {}), ut && ut.observe(document.documentElement, {
			attributes: !0,
			attributeFilter: ["data-pp-mode", "data-pp-theme"]
		});
		let dt = He.append("g").attr("class", "container-macro-node").style("display", "none").style("touch-action", "manipulation");
		dt.append("path").attr("class", "container-macro-bg").style("fill", (e) => `color-mix(in srgb, ${at(e)} 16%, var(--pp-macro-base, #151826))`).attr("stroke", (e) => at(e)).attr("stroke-width", 2.2).style("filter", (e) => `drop-shadow(0 0 18px color-mix(in srgb, ${at(e)} 45%, transparent))`);
		let ft = Math.round((v.labelMaxFontSize || 26) * 1.6), pt = dt.append("text").attr("class", "container-macro-text").attr("text-anchor", "middle").attr("dominant-baseline", "central").attr("fill", (e) => at(e)).attr("font-size", (e) => `${e.parent ? ft : Math.round(ft * 1.25)}px`).attr("font-family", "'Atkinson', sans-serif").attr("font-weight", "700").attr("letter-spacing", "-0.02em"), mt = to().curve(lo.alpha(.5));
		function ht(e, t, n) {
			let r = 0;
			for (let t = 0; t < e.length; t++) r = r * 31 + e.charCodeAt(t) >>> 0;
			let i = () => (r = r * 1664525 + 1013904223 >>> 0, r / 4294967296), a = [];
			for (let e = 0; e < 14; e++) {
				let r = e / 14 * Math.PI * 2, o = Math.cos(r), s = Math.sin(r), c = 2 / 2.8, l = 1 + (i() - .5) * .08;
				a.push([Math.sign(o) * Math.abs(o) ** +c * t * l, Math.sign(s) * Math.abs(s) ** +c * n * l]);
			}
			return mt(a);
		}
		pt.each(function(e) {
			et(V(this), e);
		});
		function gt() {
			dt.each(function(e) {
				let t = V(this), n = parseFloat(t.select(".container-macro-text").attr("font-size")) || ft, r = it(e, n), i = Math.max(v.width * 1.5, r.w + n * 1.4), a = Math.max(v.height * 1.5, r.h + n * 1.4);
				t.select(".container-macro-bg").attr("d", ht(e.id, i / 2, a / 2)), e._macroHalfW = i / 2, e._macroHalfH = a / 2;
			});
		}
		gt();
		function _t({ isCollapsed: e }) {
			return Gt().clickDistance(5).filter((e) => !(e.ctrlKey || e.button !== void 0 && e.button !== 0)).on("start", function(e, t) {
				e.sourceEvent && e.sourceEvent.stopPropagation();
				let n = e.x, r = e.y;
				V(this).datum()._dragState = {
					startX: n,
					startY: r,
					lastX: n,
					lastY: r,
					totalMove: 0
				};
			}).on("drag", function(e, t) {
				let n = V(this).datum()._dragState;
				if (!n) return;
				let r = e.x - n.lastX, i = e.y - n.lastY;
				n.lastX = e.x, n.lastY = e.y, n.totalMove += Math.hypot(r, i);
				let a = L(t.id);
				for (let e of a) {
					let t = z.get(e);
					t && (t.x += r, t.y += i, t.fx = t.x, t.fy = t.y, k.current && k.current.setNodePosition(ae(t), t.x, t.y, { transient: !0 }));
				}
				Mn(), M.current && M.current();
			}).on("end", function(t, n) {
				let r = V(this).datum()._dragState;
				if (delete V(this).datum()._dragState, (r ? r.totalMove : 0) >= 4) {
					let e = L(n.id), t = k.current;
					for (let n of e) {
						let e = z.get(n);
						e && (e.fx = e.x, e.fy = e.y, t && t.setNodePosition(ae(e), e.x, e.y, { transient: !0 }));
					}
					t && t.commit(), Mn();
				} else {
					let r = () => {
						e ? Ut([n.id], !0) : Ut([n.id], R.has(n.id));
					};
					(f.collapseGesture || "tap") === "doubletap" ? De(t.sourceEvent, () => {}, r) : De(t.sourceEvent, r);
				}
			});
		}
		ot.call(_t({ isCollapsed: !1 })), dt.call(_t({ isCollapsed: !0 })), ot.on("click", (e) => e.stopPropagation()), dt.on("click", (e) => e.stopPropagation());
		let vt = to().curve(lo.alpha(.5)), z = new Map(o.nodes.map((e) => [e.id, e])), yt = new Map((o.containers || []).map((e) => [e.id, e])), bt = (e) => {
			let t = 0, n = e.parent;
			for (; n && yt.has(n) && t < 20;) t++, n = yt.get(n).parent;
			return t;
		}, xt = f.labelSize && f.labelSize.min || 32, St = f.labelSize && f.labelSize.max || 96, Ct = f.labelSize && f.labelSize.nestedScale || .75, wt = () => {
			let e = /* @__PURE__ */ new Map();
			for (let t of o.containers || []) e.set(t.id, Array.from(ze.get(t.id) || []).map((e) => z.get(e)).filter(Boolean).map((e) => ({
				id: e.id,
				w: e._size && e._size.width || (e.type === "article" ? v.width : e.size),
				h: e._size && e._size.height || (e.type === "article" ? v.height : e.size),
				order: Number.isFinite(e.series_part) ? e.series_part : null,
				date: e.date || ""
			})));
			return e;
		}, B = {
			roots: [],
			nodes: /* @__PURE__ */ new Map(),
			containers: /* @__PURE__ */ new Map()
		};
		function Tt() {
			if (!o.containers || o.containers.length === 0) return;
			let e = wt(), t = () => (0, $o.containerLayout)({
				containers: o.containers,
				members: e,
				closed: R,
				labelSize: (e) => it(e, e._fs || xt),
				macroSize: (e) => ({
					w: (e._macroHalfW || 130) * 2,
					h: (e._macroHalfH || 45) * 2
				}),
				options: {
					spacing: f.spiral?.spacing ?? 20,
					mode: te.current === "radial" ? "ring" : f.spiral?.mode || "path",
					startRadius: f.spiral?.startRadius,
					gap: 28,
					padding: (e) => e.padding == null ? e.parent ? 42 : 75 : e.padding
				}
			});
			for (let e of o.containers) e._fs = xt;
			let n = t();
			for (let e of o.containers) {
				let t = n.containers.get(e.id), r = t ? t.box.x1 - t.box.x0 : 0, i = St * Ct ** +bt(e);
				e._fs = Math.max(xt, Math.min(Math.max(xt, i), r / 8));
			}
			n = t(), B = n;
		}
		function Et(e) {
			let t = 0, n = 0, r = 0;
			for (let [i, a] of B.nodes) {
				if (a.root !== e) continue;
				let o = z.get(i);
				!o || !Number.isFinite(o.x) || !Number.isFinite(o.y) || (t += o.x - a.x, n += o.y - a.y, r++);
			}
			return r ? {
				x: t / r,
				y: n / r
			} : null;
		}
		function Dt(e) {
			let t = 0, n = 0, r = 0;
			for (let i of L(e)) {
				let e = B.nodes.get(i), a = z.get(i);
				!e || !a || !Number.isFinite(a.x) || !Number.isFinite(a.y) || (t += a.x - e.x, n += a.y - e.y, r++);
			}
			return r ? {
				x: t / r,
				y: n / r
			} : null;
		}
		let Ot = () => f.spiral?.enabled !== !1 && (te.current === "force" || te.current === "radial");
		function kt() {
			function e(e) {
				if (!Ot() || te.current !== "force") return;
				let t = f.spiral?.strength ?? .35;
				for (let n of B.roots) {
					let r = Et(n);
					if (r) for (let [i, a] of B.nodes) {
						if (a.root !== n) continue;
						let o = z.get(i);
						!o || !Number.isFinite(o.x) || (o.vx += (r.x + a.x - o.x) * t * e, o.vy += (r.y + a.y - o.y) * t * e);
					}
				}
			}
			return e.initialize = function() {}, e;
		}
		function At() {
			let e = [], t = (e) => e.type === "article" ? Math.hypot(e._size?.width || v.width, e._size?.height || v.height) / 2 : e._r || (e.size || 60) / 2;
			function n(n) {
				if (!o.containers || o.containers.length === 0) return;
				let r = [];
				for (let e of B.roots) {
					let t = B.containers.get(e), n = Et(e);
					if (!t || !n) continue;
					let i = L(e).map((e) => z.get(e)).filter((e) => e && Number.isFinite(e.x));
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
				}, a = f.containerSpacing === void 0 ? -20 : f.containerSpacing;
				for (let e = 0; e < r.length; e++) for (let t = e + 1; t < r.length; t++) {
					let n = r[e], o = r[t], s = o.x - n.x, c = o.y - n.y;
					i(s, c, Math.hypot(s, c), n.r + o.r + a, (e, t) => {
						for (let r of n.members) r.vx -= e, r.vy -= t;
						for (let n of o.members) n.vx += e, n.vy += t;
					});
				}
				let s = new Set(B.nodes.keys()), c = (e.length ? e : o.nodes).filter((e) => !s.has(e.id) && Number.isFinite(e.x));
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
		o.containers && o.containers.length > 0 && (Tt(), I.force("containerSeparation", At()), I.force("containerLayout", kt()));
		let jt = /* @__PURE__ */ new Set(), Mt = (e) => (B.nodes.get(e) || {}).root || null, H = (e) => typeof e == "object" ? e.id : e;
		function Nt() {
			jt = /* @__PURE__ */ new Set();
			for (let e of R) for (let t of L(e)) jt.add(t);
			I.force("collide").radius((e) => jt.has(e.id) ? 0 : B.nodes.has(e.id) && e.type === "article" ? Math.min(e._size?.width || v.width, e._size?.height || v.height) / 2 : (e._r || (e.type === "article" ? Math.hypot(v.width, v.height) / 2 : e.size / 2)) + x.collidePadding), I.force("charge").strength((e) => jt.has(e.id) ? 0 : B.nodes.has(e.id) ? x.chargeStrength * .05 : x.chargeStrength);
		}
		if (B.nodes.size > 0) {
			Nt();
			let e = I.force("link"), t = e.strength();
			e.strength((e) => {
				let n = Mt(H(e.source));
				return n && n === Mt(H(e.target)) ? 0 : t(e);
			});
		}
		function Pt(e) {
			let t = r / 2;
			for (let n of B.roots) {
				let a = B.containers.get(n);
				if (!a) continue;
				let o = a.box.x1 - a.box.x0, s = t - (a.box.x0 + a.box.x1) / 2 + (t === r / 2 ? 0 : o / 2), c = i / 2 - (a.box.y0 + a.box.y1) / 2;
				for (let [t, r] of B.nodes) {
					if (r.root !== n) continue;
					let i = z.get(t);
					i && (e || !Number.isFinite(i.x) || !Number.isFinite(i.y)) && (i.x = s + r.x, i.y = c + r.y, i.vx = 0, i.vy = 0);
				}
				t += (t === r / 2 ? o / 2 : o) + 200;
			}
		}
		B.nodes.size > 0 && Pt(Ne);
		function Ft() {
			if (!o.containers || o.containers.length === 0 || (Tt(), Nt(), B.nodes.size === 0)) return null;
			let e = {}, t = 0;
			for (let n of B.roots) {
				let r = B.containers.get(n);
				if (!r) continue;
				let i = t - r.box.x0, a = -(r.box.y0 + r.box.y1) / 2;
				for (let [t, r] of B.nodes) r.root === n && (e[t] = {
					x: i + r.x,
					y: a + r.y
				});
				t += r.box.x1 - r.box.x0 + 200;
			}
			let n = o.nodes.filter((e) => !B.nodes.has(e.id));
			if (n.length) {
				let r = (0, Qo.radialLayout)(n, {
					cardW: v.width,
					cardH: v.height
				}), i = Object.values(r).map((e) => e.x), a = i.length ? t + v.width - Math.min(...i) : t;
				for (let [t, n] of Object.entries(r)) e[t] = {
					x: n.x + a,
					y: n.y
				};
			}
			return e;
		}
		function It() {
			!o.containers || o.containers.length === 0 || (Tt(), Nt());
		}
		function Lt(e) {
			let t = e.parent, n = 0;
			for (; t && n++ < 20;) {
				if (R.has(t)) return !0;
				t = yt.get(t)?.parent;
			}
			return !1;
		}
		function Rt() {
			if (Ve.length === 0) return;
			let e = Ot() && B.containers.size > 0, t = (t) => {
				let n = e ? B.containers.get(t.id) : null, r = n ? Dt(t.id) : null;
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
				let r = L(e.id).map((e) => z.get(e)).filter((e) => e && Number.isFinite(e.x));
				return r.length ? {
					x: m(r, (e) => e.x),
					y: m(r, (e) => e.y)
				} : null;
			};
			He.each(function(e) {
				let r = V(this), i = L(e.id).map((e) => z.get(e)).filter((e) => e && Number.isFinite(e.x) && Number.isFinite(e.y));
				if (i.length === 0 || Lt(e)) {
					r.style("display", "none"), Ke.delete(e.id);
					return;
				}
				let a = R.has(e.id), o = e._fs || 52, s = t(e);
				if (a) {
					let t = n(e);
					Ge.set(e.id, t), Ke.set(e.id, t), r.style("display", null), r.select(".container-hull").style("display", "none"), r.select(".container-hull-ghost").attr("d", ""), r.select(".container-badge").style("display", "none"), r.select(".container-macro-node").style("display", null).attr("transform", `translate(${t.x}, ${t.y})${pe()}`).select(".label-count").text((0, es.containerCountText)(_, i.length));
					return;
				}
				let c = m(i, (e) => e.x), l = m(i, (e) => e.y);
				Ge.set(e.id, {
					x: c,
					y: l
				}), r.style("display", null), r.select(".container-macro-node").style("display", "none"), r.select(".container-hull").style("display", null), r.select(".container-badge").style("display", null);
				let u = [], d = e.padding || (e.parent ? 42 : 75);
				for (let t of Re.get(e.id) || []) {
					if (!R.has(t)) continue;
					let e = yt.get(t), r = e && n(e);
					if (!r) continue;
					let i = (e._macroHalfW || 130) + d / 2, a = (e._macroHalfH || 45) + d / 2;
					u.push([r.x - i, r.y - a], [r.x + i, r.y - a], [r.x + i, r.y + a], [r.x - i, r.y + a]);
				}
				let f = i.filter((e) => {
					for (let t of R) if (L(t).includes(e.id)) return !1;
					return !0;
				});
				for (let e of f) {
					let t = e._size?.width || (e.type === "article" ? v.width : e.size), n = e._size?.height || (e.type === "article" ? v.height : e.size), r = t / 2 + d, i = n / 2 + d;
					u.push([e.x - r, e.y - i], [e.x + r, e.y - i], [e.x + r, e.y + i], [e.x - r, e.y + i]);
				}
				let p = null;
				if (s) {
					let t = d / 2, n = [], r = (e) => {
						for (let t of Re.get(e) || []) {
							if (R.has(t)) continue;
							let e = B.containers.get(t);
							e && n.push(e.label), r(t);
						}
					};
					r(e.id);
					for (let e of n) u.push([s.off.x + e.x0 - t, s.off.y + e.y0 - t], [s.off.x + e.x1 + t, s.off.y + e.y0 - t], [s.off.x + e.x1 + t, s.off.y + e.y1 + t], [s.off.x + e.x0 - t, s.off.y + e.y1 + t]);
					let i = s.info.label;
					p = {
						x: s.off.x + (i.x0 + i.x1) / 2,
						y: s.off.y + (i.y0 + i.y1) / 2
					}, u.push([s.off.x + i.x0 - t, s.off.y + i.y0 - t], [s.off.x + i.x1 + t, s.off.y + i.y0 - t], [s.off.x + i.x1 + t, s.off.y + i.y1 + t], [s.off.x + i.x0 - t, s.off.y + i.y1 + t]);
				}
				if (u.length === 0) {
					r.select(".container-hull-ghost").attr("d", ""), r.select(".container-hull").style("display", "none"), r.select(".container-badge").style("display", "none");
					return;
				}
				let h = Ka(u);
				if (!h || h.length < 3) return;
				r.select(".container-hull").attr("d", vt(h)), r.select(".container-hull-ghost").attr("d", Ue ? vt((0, Do.jitterPoints)(h, e.id, 3.5)) : "");
				let g = r.select(".container-badge");
				g.select(".label-count").text((0, es.containerCountText)(_, i.length));
				let y = (t) => {
					let n = it(e, t);
					g.select(".container-badge-hit").attr("x", -n.w / 2).attr("y", -n.h / 2).attr("width", n.w).attr("height", n.h);
				};
				if (p) {
					g.select(".container-badge-text").attr("font-size", `${o}px`), y(o), g.attr("transform", `translate(${p.x}, ${p.y})${pe()}`), Ke.set(e.id, p);
					return;
				}
				let b = Math.min(...h.map((e) => e[1])), x = Math.max(...h.map((e) => e[1])), S = Math.min(...h.map((e) => e[0])), C = Math.max(...h.map((e) => e[0])), w = Math.max(xt, Math.min(St, (C - S) / 8));
				g.select(".container-badge-text").attr("font-size", `${w}px`), y(w);
				let T = Ha(h), E = Number.isFinite(T[0]) ? T[0] : m(h, (e) => e[0]);
				g.attr("transform", `translate(${E}, ${b + (x - b) / 3})${pe()}`), Ke.set(e.id, {
					x: E,
					y: b + (x - b) / 3
				});
			});
		}
		let zt = /* @__PURE__ */ new Set();
		function Bt() {
			zt = (0, ns.closedMemberSet)(R, L);
			for (let e of o.nodes) e._closedHidden = zt.has(e.id);
			W && W.style("display", (e) => zt.has(e.id) ? "none" : null), gn.style("display", (e) => zt.has(e.id) ? "none" : null);
			let e = (e) => (0, ns.edgeHidden)(e, zt) ? "none" : null;
			tn.style("display", e), nn.style("display", e), en.style("display", e), on.style("display", e), un && (0, ns.edgeHidden)(un, zt) && hn();
		}
		function Vt() {
			Bt(), qt(), Rt(), Mn();
		}
		function Ht() {
			return Object.fromEntries((o.containers || []).map((e) => [e.id, R.has(e.id) ? "closed" : "open"]));
		}
		function Ut(e, t) {
			let n = !1;
			for (let r of e) yt.has(r) && (t && R.has(r) && (R.delete(r), n = !0), !t && !R.has(r) && (R.add(r), n = !0));
			return n ? (Vt(), typeof window < "u" && window.dispatchEvent(new CustomEvent("graph:containers-changed", { detail: Ht() })), !0) : !1;
		}
		let Wt = () => (o.containers || []).map((e) => e.id), Kt = {
			openContainer: (e) => Ut([e], !0),
			closeContainer: (e) => Ut([e], !1),
			toggleContainer: (e) => Ut([e], R.has(e)),
			openAllContainers: () => Ut(Wt(), !0),
			closeAllContainers: () => Ut(Wt(), !1),
			getContainerState: Ht
		};
		h && (h.current = Kt);
		function qt() {
			if (!o.containers || o.containers.length === 0) return;
			let e = new Map(B.roots.map((e) => [e, Et(e)]));
			if (gt(), Tt(), Nt(), !Ot()) return;
			if (!Kn) {
				I.alpha(Math.max(I.alpha(), .3)).restart();
				return;
			}
			let t = [];
			for (let [n, r] of B.nodes) {
				let i = z.get(n), a = e.get(r.root);
				!i || !a || !Number.isFinite(i.x) || t.push({
					n: i,
					x0: i.x,
					y0: i.y,
					x1: a.x + r.x,
					y1: a.y + r.y
				});
			}
			Fi("container-relayout").duration(600).ease(zi).tween("container-relayout", () => (e) => {
				for (let n of t) n.n.x = n.x0 + (n.x1 - n.x0) * e, n.n.y = n.y0 + (n.y1 - n.y0) * e, n.n.fx = n.n.x, n.n.fy = n.n.y;
				Mn(), M.current && M.current();
			}).on("end", () => {
				g || Gn({ animate: !0 });
			});
		}
		function Jt(e) {
			let t = oe.current === e.id, n = P.current.has(e.id), r = ds(se.current);
			if (r === "marker" && !t && !n) return {
				w: 8,
				h: 8
			};
			let i = e._size || A({
				hovered: t,
				pinned: n,
				lod: r
			});
			return {
				w: i.width / 2,
				h: i.height / 2
			};
		}
		function Yt(e) {
			let t = typeof e.source == "object" ? e.source.x : 0, n = typeof e.source == "object" ? e.source.y : 0, r = typeof e.target == "object" ? e.target.x : 0, i = typeof e.target == "object" ? e.target.y : 0, a = typeof e.source == "object" ? e.source.id : e.source, o = typeof e.target == "object" ? e.target.id : e.target;
			if ((0, ns.edgeHidden)(e, zt)) return {
				x1: 0,
				y1: 0,
				x2: 0,
				y2: 0,
				hidden: !0
			};
			let s = null, c = null;
			for (let e of R) {
				let t = L(e);
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
				let e = Ge.get(s);
				e && (t = e.x, n = e.y);
			}
			if (c) {
				let e = Ge.get(c);
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
			let f = l / d, p = u / d, m = Jt(e.source), h = s ? 90 : m.w + 4, g = s ? 45 : m.h + 4, _ = Math.min(Math.abs(f) > 1e-4 ? h / Math.abs(f) : Infinity, Math.abs(p) > 1e-4 ? g / Math.abs(p) : Infinity), v = Jt(e.target), y = c ? 90 : v.w + 4, b = c ? 45 : v.h + 4, x = Math.min(Math.abs(f) > 1e-4 ? y / Math.abs(f) : Infinity, Math.abs(p) > 1e-4 ? b / Math.abs(p) : Infinity);
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
		function Xt(e, t) {
			if (t.hidden) return "";
			if (e.layer !== "sequence") return `M ${t.x1} ${t.y1} L ${t.x2} ${t.y2}`;
			let n = t.x2 - t.x1, r = t.y2 - t.y1, i = Math.hypot(n, r);
			if (i < 2) return `M ${t.x1} ${t.y1} L ${t.x2} ${t.y2}`;
			let a = (t.x1 + t.x2) / 2, o = (t.y1 + t.y2) / 2, s = -r / i, c = n / i, l = Math.min(48, i * .12), u = a + s * l, d = o + c * l;
			return `M ${t.x1} ${t.y1} Q ${u} ${d} ${t.x2} ${t.y2}`;
		}
		let Zt = /* @__PURE__ */ new Map();
		function Qt(e) {
			if (!Zt.has(e)) {
				let t = "edge-arrow-" + Zt.size;
				c.append("marker").attr("id", t).attr("viewBox", "0 0 10 10").attr("refX", 9).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 13).attr("markerHeight", 13).attr("orient", "auto").append("path").attr("d", "M 0 1 L 10 5 L 0 9 z").style("fill", e).style("fill-opacity", .75), Zt.set(e, t);
			}
			return Zt.get(e);
		}
		let $t = (e) => {
			if (e.layer !== "sequence") return "#8a8f9c";
			let t = typeof e.source == "object" ? e.source.id : e.source;
			return z.get(t)?.containerColor || "var(--gv-accent, #d4af37)";
		}, en = p.insert("g", ".containers-layer").attr("class", "link-hits").selectAll(".link-hit").data(o.links).enter().append("path").attr("class", "link-hit").attr("fill", "none").style("stroke", "transparent").style("stroke-width", "16px").style("pointer-events", "stroke").style("cursor", "default"), tn = p.selectAll(".link").data(o.links).enter().append("path").attr("class", (e) => [
			"link",
			e.layer ? `link-${e.layer}` : "",
			e.role ? `link-role-${e.role}` : ""
		].filter(Boolean).join(" ")).attr("fill", "none").attr("data-label", (e) => e.label).attr("marker-end", (e) => e.directed ? `url(#${Qt($t(e))})` : null).style("stroke", (e) => e.layer === "sequence" ? $t(e) : null).style("stroke-opacity", (e) => e.layer === "sequence" ? .45 : null), nn = p.selectAll(".link-ghost").data(o.links).enter().insert("path", ".link-sequence-pulse").attr("class", "link-ghost").style("stroke", (e) => $t(e)), rn = (e) => `${H(e.source)}>${H(e.target)}`;
		function an() {
			nn.attr("d", (e) => Ue && e._path ? (0, Do.ghostOf)(e._path, rn(e)) : "");
		}
		let on = p.selectAll(".link-sequence-pulse").data(o.links.filter((e) => e.layer === "sequence")).enter().append("path").attr("class", "link-sequence-pulse").attr("fill", "none").attr("pathLength", 100).style("stroke", (e) => {
			let t = typeof e.source == "object" ? e.source.id : e.source;
			return z.get(t)?.containerColor || "#ffe066";
		}).style("filter", (e) => {
			let t = typeof e.source == "object" ? e.source.id : e.source;
			return `drop-shadow(0 0 4px ${z.get(t)?.containerColor || "#ffd700"})`;
		}), sn = p.append("g").attr("class", "edge-label").style("pointer-events", "none").style("display", "none"), cn = sn.append("rect").attr("fill", "rgba(15, 17, 26, 0.88)").attr("stroke-opacity", .6), ln = sn.append("text").attr("text-anchor", "middle").attr("dominant-baseline", "central").attr("font-family", "'Atkinson', sans-serif").attr("font-weight", 600).attr("letter-spacing", "0.04em"), un = null, dn = null, fn = null;
		function pn() {
			if (!un || !dn) return;
			let e = dn.getTotalLength ? dn.getTotalLength() : 0;
			if (!e) {
				sn.style("display", "none");
				return;
			}
			let t = dn.getPointAtLength(e / 2), n = se.current || 1, r = 13 / n, i = $t(un);
			ln.attr("font-size", r).style("fill", i).text(un.label);
			let a = (un.label.length * .62 + 1.4) * r, o = r * 1.7;
			cn.attr("x", -a / 2).attr("y", -o / 2).attr("width", a).attr("height", o).attr("rx", o / 2).style("stroke", i).attr("stroke-width", 1 / n), sn.attr("transform", `translate(${t.x}, ${t.y})${pe()}`).style("display", null);
		}
		function mn(e, t) {
			clearTimeout(fn), fn = null, un = e, dn = t, pn();
		}
		function hn() {
			clearTimeout(fn), fn = null, un = null, dn = null, sn.style("display", "none");
		}
		en.on("mouseenter", function(e, t) {
			mn(t, this);
		}).on("mouseleave", () => {
			fn || hn();
		}).on("click", function(e, t) {
			e.stopPropagation();
			let n = this;
			De(e, () => {
				mn(t, n), fn = setTimeout(() => {
					fn = null, hn();
				}, 2500);
			});
		});
		let gn = p.selectAll(".node").data(o.nodes).enter().append("g").attr("class", "node"), _n = Gt().clickDistance(5).container(() => p.node()).filter((e) => {
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
				let n = t._size || A({
					hovered: oe.current === t.id,
					pinned: P.current.has(t.id)
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
					width: r(n.w + (e.x - n.x) * 2, v.minWidth, v.maxWidth),
					height: r(n.h + (e.y - n.y) * 2, v.minHeight, v.maxHeight)
				}, wn(t), k.current && k.current.setNodeSize(N(t), t._size.width, t._size.height, { transient: !0 }), Rt();
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
			t.x = e.x, t.y = e.y, t.fx = e.x, t.fy = e.y, k.current && k.current.setNodePosition(N(t), e.x, e.y, { transient: !0 }), gn.filter((e) => e.id === t.id).attr("transform", "translate(" + e.x + "," + e.y + ")" + pe()), W && W.filter((e) => e.id === t.id).style("transform", `translate3d(${e.x}px, ${e.y}px, 0px) rotate(var(--gv-unrot, 0deg))`), M.current && M.current(), tn.each(function(e) {
				let n = typeof e.source == "object" ? e.source.id : e.source, r = typeof e.target == "object" ? e.target.id : e.target;
				(n === t.id || r === t.id) && (e._path = Xt(e, Yt(e)), V(this).attr("d", e._path));
			}), en.attr("d", (e) => e._path || ""), an(), hn(), on.each(function(e) {
				let n = typeof e.source == "object" ? e.source.id : e.source, r = typeof e.target == "object" ? e.target.id : e.target;
				if (n === t.id || r === t.id) {
					let t = Yt(e);
					V(this).attr("d", Xt(e, t));
				}
			}), Rt();
		}).on("end", (e, t) => {
			let n = k.current;
			if (t._resizing) {
				t._resizing = !1, n && n.commit(), Rt();
				return;
			}
			t.fx = t.x, t.fy = t.y, t._dragMoved && (n && (n.setNodePosition(ae(t), t.x, t.y, { transient: !0 }), n.commit()), Rt());
		});
		gn.call(_n);
		let U = s.append("text").style("font-family", "'Atkinson', sans-serif").style("visibility", "hidden"), vn = typeof document < "u" ? document.createElement("canvas").getContext("2d") : null;
		function yn(e, t) {
			if (!vn) return {
				width: e.length * t * .5,
				ascent: t * .7,
				descent: t * .2
			};
			vn.font = "500 " + t + "px 'Atkinson', sans-serif";
			let n = vn.measureText(e);
			return {
				width: n.actualBoundingBoxLeft + n.actualBoundingBoxRight,
				ascent: n.actualBoundingBoxAscent,
				descent: n.actualBoundingBoxDescent
			};
		}
		let bn = [];
		function xn(e) {
			let { d: t, textEl: n, rectEl: r, lines: i, fontSize: a, lineH: o } = e, s = i.map((e) => yn(e, a)), c = i.map((e, t) => t * o), l = Math.min(...c.map((e, t) => e - s[t].ascent)), u = Math.max(...c.map((e, t) => e + s[t].descent)), d = -(l + u) / 2, f = l + d, p = u + d, m = Math.max(...s.map((e) => e.width));
			n.selectAll("tspan").each(function(e, t) {
				V(this).attr("y", c[t] + d);
			}), r.attr("x", -m / 2 - y.padding).attr("y", f - y.padding).attr("width", m + y.padding * 2).attr("height", p - f + y.padding * 2), t._r = Math.hypot(m + y.padding * 2, p - f + y.padding * 2) / 2;
		}
		gn.each(function(e) {
			let t = V(this);
			if (e.type !== "article") {
				let n = y.fontSize, r = y.padding, i = y.maxWidth, a = y.maxLines;
				U.style("font-size", n + "px").style("font-weight", "500");
				let o = (e) => (U.text(e), U.node().getComputedTextLength()), s = e.label.split(/(?<=-)|\s+/).filter(Boolean), c = (e) => e.join("").replace(/\s+$/, "").trim(), l = [e.label];
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
					rectEl: t.insert("rect", "text").attr("rx", y.cornerRadius).attr("ry", y.cornerRadius).attr("fill", "var(--gv-" + (e.type === "tag" ? "tag-color" : e.type === "topology" ? "topology-color" : "placeholder-color") + ")").attr("opacity", y.opacity),
					lines: l,
					fontSize: n,
					lineH: u
				};
				bn.push(f), xn(f);
			} else {
				let t = A({
					hovered: !1,
					pinned: !1
				});
				e._r = Math.hypot(t.width, t.height) / 2;
			}
		}), U.remove(), typeof document < "u" && document.fonts && document.fonts.ready && document.fonts.ready.then(() => {
			bn.forEach(xn);
		}).catch(() => {});
		let Sn = /* @__PURE__ */ new Map(), W = d.selectAll(".node-card").data(o.nodes.filter((e) => e.type === "article")), Cn = W.enter().append("div").attr("class", "node-card").style("position", "absolute").style("left", "0").style("top", "0").style("will-change", "transform").style("pointer-events", "auto").style("touch-action", "manipulation").call(_n);
		W = W.merge(Cn), Cn.each(function(e) {
			let t = l(this);
			Sn.set(e.id, {
				root: t,
				wrapper: this,
				cardSelection: V(this)
			});
		});
		function wn(e) {
			if (e.type !== "article") return;
			let n = Sn.get(e.id);
			if (!n) return;
			let r = oe.current === e.id, i = P.current.has(e.id), a = ds(se.current), o = A({
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
			let l = Uo(e.kind), u = k.current, d = u ? u.bookmarks(N(e)) : [], f = _.readingProgress !== !1 && u && u.readingProgress ? u.readingProgress(N(e)) : null;
			n.root.render(t.createElement(l, {
				article: e,
				width: s,
				height: c,
				viewState: {
					hovered: r,
					pinned: i,
					lod: a,
					zoomScale: se.current,
					bookmarks: d,
					bookmarkCount: d.length,
					progress: f
				},
				fullContent: e._fullContent || null,
				cardSettings: v,
				onResize: ({ width: t, height: r }) => {
					e._customWidth = t, e._customHeight = r, e._size = {
						width: t,
						height: r
					}, n.wrapper.style.width = t + "px", n.wrapper.style.height = r + "px", n.wrapper.style.marginLeft = -t / 2 + "px", n.wrapper.style.marginTop = -r / 2 + "px", e._r = Math.max(t, r) / 2, wn(e);
				}
			}));
		}
		W.on("wheel", (e) => e.stopPropagation());
		function Tn() {
			o.nodes.forEach((e) => {
				e.type === "article" && wn(e);
			});
		}
		re.current = Tn;
		let En = /* @__PURE__ */ new Map();
		function Dn(e) {
			if ((e.originalItem && e.originalItem._posted) === "title") return e._fullContent = null, Promise.resolve();
			if (En.has(e.id)) return e._fullContent = En.get(e.id), Promise.resolve();
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
				En.set(e.id, i), e._fullContent = i;
			}).catch(() => {
				En.set(e.id, null), e._fullContent = null;
			});
		}
		Tn(), P.current.forEach((e) => {
			let t = o.nodes.find((t) => t.id === e);
			t && (W.filter((t) => t.id === e).raise().style("z-index", 10), Dn(t).then(() => {
				P.current.has(e) && wn(t);
			}));
		}), ss(s, u, le.current), W.on("mouseover", (e, t) => {
			oe.current !== t.id && (oe.current = t.id, wn(t), e.currentTarget.style.zIndex = 10);
		}).on("mouseout", (e, t) => {
			let n = e.relatedTarget;
			n && e.currentTarget.contains(n) || oe.current === t.id && (oe.current = null, wn(t), e.currentTarget.style.zIndex = "");
		}).on("dblclick", (e) => {
			e.stopPropagation(), e.preventDefault();
		}).on("click", (e, t) => {
			let n = e.target;
			if (n && (n.dataset?.popout === "1" || n.closest?.("[data-popout=\"1\"]"))) {
				e.stopPropagation(), T.current && T.current(t.originalItem || t), P.current.has(t.id) && (P.current.delete(t.id), k.current && k.current.setNodePinned(N(t), !1), oe.current = null, wn(t), e.currentTarget.style.zIndex = "");
				return;
			}
			e.stopPropagation();
			let r = e.currentTarget;
			De(e, () => On(t, r));
		});
		function On(e, t) {
			P.current.has(e.id) ? (P.current.delete(e.id), k.current && k.current.setNodePinned(N(e), !1), wn(e), t.style.zIndex = "", D.current === e.id && O(null)) : (P.current.add(e.id), O(e), k.current && k.current.setNodePinned(N(e), !0), wn(e), gn.filter((t) => t.id === e.id).raise(), W.filter((t) => t.id === e.id).raise(), t.style.zIndex = 10, Dn(e).then(() => {
				P.current.has(e.id) && wn(e);
			}));
		}
		let kn = null;
		gn.filter((e) => e.type !== "article").on("click", (e, t) => {
			e.stopPropagation(), De(e, () => An(t));
		});
		function An(e) {
			if (kn === e.id) kn = null, gn.classed("dimmed", !1).classed("tag-active", !1), W.classed("dimmed", !1), tn.classed("highlighted", !1);
			else {
				kn = e.id;
				let t = new Set(o.links.filter((t) => {
					let n = typeof t.source == "object" ? t.source.id : t.source, r = typeof t.target == "object" ? t.target.id : t.target;
					return n === e.id || r === e.id;
				}).map((t) => {
					let n = typeof t.source == "object" ? t.source.id : t.source, r = typeof t.target == "object" ? t.target.id : t.target;
					return n === e.id ? r : n;
				}));
				t.add(e.id), gn.classed("dimmed", (e) => !t.has(e.id)), gn.classed("tag-active", (t) => t.id === e.id), W.classed("dimmed", (e) => !t.has(e.id)), tn.classed("highlighted", (t) => {
					let n = typeof t.source == "object" ? t.source.id : t.source, r = typeof t.target == "object" ? t.target.id : t.target;
					return n === e.id || r === e.id;
				});
			}
		}
		s.on("click", (e) => De(e, () => {
			hn(), kn && (kn = null, gn.classed("dimmed", !1).classed("tag-active", !1), W.classed("dimmed", !1), tn.classed("highlighted", !1)), T.current && T.current(null);
		}));
		function jn() {
			tn.each(function(e) {
				e._path = Xt(e, Yt(e)), V(this).attr("d", e._path);
			}), en.attr("d", (e) => e._path || ""), on.attr("d", (e) => e._path || ""), an(), un && pn();
		}
		function Mn() {
			jn(), gn.attr("transform", (e) => "translate(" + e.x + "," + e.y + ")" + pe()), W && W.style("transform", (e) => `translate3d(${e.x}px, ${e.y}px, 0px) rotate(var(--gv-unrot, 0deg))`), Rt(), ie.current && ie.current();
		}
		let Nn = _.roots ? _.roots === !0 ? {} : _.roots : null, Pn = [], Fn = null, In = !1;
		if (Nn) {
			let e = /* @__PURE__ */ new Map();
			for (let [t, n] of ze) for (let r of n) e.set(r, t);
			let t = o.links.filter((e) => e.layer === "sequence").map((e) => ({
				source: H(e.source),
				target: H(e.target)
			})), n = (o.containers || []).find((e) => !e.parent), r = String(Nn.seed || n && n.id || "roots");
			Pn = (0, is.rootSegments)({
				containers: o.containers || [],
				memberOf: e,
				sequence: t
			}).map((e) => {
				let t = Ie.append("g").attr("class", "root").attr("data-root", e.key).style("display", "none");
				return {
					...e,
					shape: (0, is.rootShape)(r + "|" + e.key),
					el: t,
					main: t.append("path").attr("class", "root-main").attr("fill", "none").attr("vector-effect", "non-scaling-stroke"),
					fine: t.append("path").attr("class", "root-fine").attr("fill", "none").attr("vector-effect", "non-scaling-stroke"),
					state: "hidden"
				};
			});
		}
		function Ln(e) {
			if (e.node) {
				let t = z.get(e.node);
				return !t || !Number.isFinite(t.x) || zt.has(t.id) || t._source && le.current.has(t._source.id) ? null : {
					x: t.x,
					y: t.y
				};
			}
			return Ke.get(e.container) || null;
		}
		function Rn(e) {
			let t = k.current;
			if (!t || !t.readingProgress) return "hidden";
			let n = (e) => {
				let n = z.get(e);
				return n ? t.readingProgress(N(n)) : {
					seen: !1,
					done: !1
				};
			};
			if (e.node) {
				let t = n(e.node);
				return t.done ? "done" : t.seen || t.max > 0 ? "seen" : "hidden";
			}
			let r = L(e.container).map(n);
			return !r.length || !r.some((e) => e.seen || e.max > 0) ? "hidden" : r.every((e) => e.done) ? "done" : "seen";
		}
		function zn() {
			if (Fn = null, Pn.length) {
				for (let e of Pn) {
					let t = Rn(e.reach), n = Ln(e.from), r = Ln(e.to);
					if (t === "hidden" || !n || !r) {
						e.el.style("display", "none"), t === "hidden" && (e.state = "hidden");
						continue;
					}
					let i = (0, is.rootPath)(n, r, e.shape);
					if (e.main.attr("d", i.main), e.fine.attr("d", i.fine), e.el.style("display", null).attr("data-state", t), e.state === "hidden" && In) {
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
				In = !0;
			}
		}
		function Bn() {
			!Pn.length || Fn || (Fn = typeof requestAnimationFrame < "u" ? requestAnimationFrame(zn) : setTimeout(zn, 16));
		}
		ie.current = Nn ? Bn : null;
		let Vn = !1;
		ee.current = {
			data: o,
			nodes: gn,
			articleNodes: W,
			links: tn,
			applyPositions: Mn,
			svg: s,
			zoom: _e,
			fitToViewport: Gn,
			simulation: I,
			axisLayer: Fe,
			g: p,
			updateContainers: Rt,
			ringTargets: Ft,
			recomputeContainers: It,
			toScreen: ge
		}, de = !0;
		let Hn = 0;
		I.nodes(o.nodes).on("tick", () => {
			Mn(), Vn ||= Gn({ initialZoomOut: !0 }), M.current && M.current(), ++Hn, ne.current && Hn % 25 == 0 && ne.current();
		}), I.force("link").links(o.links), Vn ||= Gn({ initialZoomOut: !0 }), Mn();
		function Un() {
			if (!Ot() || B.roots.length === 0) return null;
			let e = [];
			for (let t of B.roots) {
				let n = B.containers.get(t), r = Et(t);
				!n || !r || L(t).every((e) => le.current.has(z.get(e)?._source?.id)) || e.push({
					x0: r.x + n.box.x0,
					y0: r.y + n.box.y0,
					x1: r.x + n.box.x1,
					y1: r.y + n.box.y1
				});
			}
			for (let t of o.nodes) {
				if (t.type !== "article" || B.nodes.has(t.id) || !Number.isFinite(t.x) || t._source && le.current.has(t._source.id)) continue;
				let n = (t._size?.width || v.width) / 2, r = (t._size?.height || v.height) / 2;
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
		function Wn() {
			if (!b || !Ot()) return null;
			let e = _.initialFocus, t = B.containers.get(e), n = yt.get(e);
			if (!t || !n || R.has(e) || Lt(n)) return null;
			let r = Dt(e);
			if (!r) return null;
			let i = {
				x0: r.x + t.box.x0,
				y0: r.y + t.box.y0,
				x1: r.x + t.box.x1,
				y1: r.y + t.box.y1
			}, a = B.containers.get(t.root), o = a && Et(t.root);
			return {
				box: i,
				root: o ? {
					x0: o.x + a.box.x0,
					y0: o.y + a.box.y0,
					x1: o.x + a.box.x1,
					y1: o.y + a.box.y1
				} : null
			};
		}
		function Gn({ animate: e = !1, initialZoomOut: t = !1, focus: n = !0 } = {}) {
			let r = Un();
			if (r) {
				let t = S.current ? S.current.clientWidth : window.innerWidth, i = S.current ? S.current.clientHeight : window.innerHeight;
				if (t < 50 || i < 50) return !1;
				let a = (e) => Math.min((t - 48) / Math.max(e.x1 - e.x0, 1), (i - 48) / Math.max(e.y1 - e.y0, 1), 1), o = n ? Wn() : null, c = r, l = a(r), u = !1;
				o && (l = a(o.box), c = o.box, o.root && a(o.root) >= Math.min(l, E) ? (c = o.root, l = a(o.root)) : l < E && (l = E, u = (o.box.y1 - o.box.y0) * l > i - 48)), l = Math.max(l, .04);
				let d = (c.x0 + c.x1) / 2, f = u ? 56 - c.y0 * l : i / 2 - (c.y0 + c.y1) / 2 * l, p = mo.translate(t / 2 - d * l, f).scale(l);
				return Ce({ repaint: !1 }), e ? s.transition().duration(750).call(_e.transform, p) : s.call(_e.transform, p), !0;
			}
			let i = o.nodes.filter((e) => e.type === "article");
			if (i.length < 2) return !1;
			let a = (e) => {
				let t = [...e].sort((e, t) => e - t), n = Math.floor(t.length / 2);
				return t.length % 2 ? t[n] : (t[n - 1] + t[n]) / 2;
			}, c = (e) => {
				let t = [...e].sort((e, t) => e - t);
				return [t[Math.floor(t.length * .1)], t[Math.ceil(t.length * .9) - 1]];
			}, l = i.map((e) => e.x), u = i.map((e) => e.y), [d, f] = c(l), [p, m] = c(u), h = d - 140, g = f + 140, _ = p - 140, v = m + 140, y = a(l), b = a(u), x = S.current ? S.current.clientWidth : window.innerWidth, C = S.current ? S.current.clientHeight : window.innerHeight;
			if (x < 50 && (x = window.innerWidth), C < 50 && (C = window.innerHeight), x < 50 || C < 50) return !1;
			let w = .2, T = Math.max(Math.min(x / Math.max(g - h, 1), C / Math.max(v - _, 1), 1), w);
			t && (Ne ? T = w * .85 : T *= .85);
			let D = x / 2 - y * T, O = C / 2 - b * T, k = mo.translate(D, O).scale(T);
			return Ce({ repaint: !1 }), e ? s.transition().duration(750).call(_e.transform, k) : s.call(_e.transform, k), !0;
		}
		let Kn = !1;
		R.size && (Bt(), Rt()), I.on("end", () => {
			if (Kn = !0, te.current !== "force" || (o.nodes.forEach((e) => {
				e.fx = e.x, e.fy = e.y, e._forcePos = {
					x: e.x,
					y: e.y
				};
			}), !g && Un() && Gn({ animate: !0 }), (0, Qo.layoutIsDegenerate)(o.nodes, A({
				hovered: !1,
				pinned: !1
			})))) return;
			let e = k.current;
			if (e) for (let t of o.nodes) !t.pinned && t._forcePos && e.setNodePosition("force::" + N(t), t.x, t.y, { silent: !0 });
			ne.current && ne.current();
		});
		let qn = () => {
			if (!document.hidden) {
				if (!Kn) {
					I.alpha(.8).restart();
					return;
				}
				Vn ||= Gn({ initialZoomOut: !0 });
			}
		};
		document.addEventListener("visibilitychange", qn);
		let Jn = () => {
			b = !1, Gn({
				animate: !0,
				focus: !1
			});
		}, Yn = () => {
			o.nodes.forEach((e) => {
				e.fx = null, e.fy = null, delete e._forcePos;
			});
			let e = k.current;
			if (e) for (let t of o.nodes) {
				let n = ae(t);
				e.nodeState(n) && e.setNodePosition(n, t.x, t.y, { silent: !0 });
			}
			I.alpha(.8).restart();
		}, Xn = () => {
			let e = A({
				hovered: !1,
				pinned: !1
			});
			o.nodes.forEach((e) => {
				delete e._size;
			});
			let t = k.current;
			if (t) for (let n of o.nodes) t.setNodeSize(N(n), e.width, e.height, { silent: !0 });
			Mn();
		}, Zn = () => {
			let e = k.current;
			e && e.resetLayout && e.resetLayout(), Ce({ repaint: !1 }), o.nodes.forEach((e) => {
				e.fx = null, e.fy = null, delete e._forcePos;
			}), I.alpha(.8).restart(), Gn({ animate: !0 });
		}, Qn = () => {
			let e = k.current;
			e && e.resetLayout && e.resetLayout(), T.current && T.current(null), O(null), hn(), kn = null, oe.current = null, gn.classed("dimmed", !1).classed("tag-active", !1), W.classed("dimmed", !1).style("z-index", null), tn.classed("highlighted", !1), P.current.clear(), o.nodes.forEach((e) => {
				delete e._size, delete e._customWidth, delete e._customHeight, delete e._forcePos, e.fx = null, e.fy = null;
			}), R.clear();
			for (let e of We()) R.add(e);
			Ce({ repaint: !1 }), g = !1, b = !!_.initialFocus && _.initialFocus !== "all", Tn(), Bt(), typeof window < "u" && window.dispatchEvent(new CustomEvent("graph:containers-changed", { detail: Ht() })), o.containers && o.containers.length && Ot() ? (qt(), Rt(), Mn(), Gn({ animate: !0 })) : (I.alpha(.8).restart(), Gn({ animate: !0 }));
		};
		window.addEventListener("graph:reset-all", Qn), window.addEventListener("graph:zoom-to-fit", Jn), window.addEventListener("graph:unpin-all", Yn), window.addEventListener("graph:reset-sizes", Xn), window.addEventListener("graph:reset-layout", Zn);
		let $n = {
			"graph:open-container": (e) => Kt.openContainer(e.detail && e.detail.id),
			"graph:close-container": (e) => Kt.closeContainer(e.detail && e.detail.id),
			"graph:toggle-container": (e) => Kt.toggleContainer(e.detail && e.detail.id),
			"graph:open-all-containers": () => Kt.openAllContainers(),
			"graph:close-all-containers": () => Kt.closeAllContainers()
		};
		for (let [e, t] of Object.entries($n)) window.addEventListener(e, t);
		return () => {
			re.current = null, ie.current = null, Fn && typeof cancelAnimationFrame < "u" && cancelAnimationFrame(Fn), ut && ut.disconnect(), I.stop(), document.removeEventListener("visibilitychange", qn), window.removeEventListener("resize", Pe), n.removeEventListener("touchstart", be, { capture: !0 }), n.removeEventListener("touchmove", xe, { capture: !0 }), n.removeEventListener("touchend", Se, { capture: !0 }), n.removeEventListener("touchcancel", Se, { capture: !0 }), n.removeEventListener("touchstart", Ae, { capture: !0 }), n.removeEventListener("touchmove", je, { capture: !0 }), n.removeEventListener("touchend", Me, { capture: !0 }), we.cancel(), window.removeEventListener("graph:reset-all", Qn), window.removeEventListener("graph:zoom-to-fit", Jn), window.removeEventListener("graph:unpin-all", Yn), window.removeEventListener("graph:reset-sizes", Xn), window.removeEventListener("graph:reset-layout", Zn);
			for (let [e, t] of Object.entries($n)) window.removeEventListener(e, t);
			h && h.current === Kt && (h.current = null), Sn.forEach(({ root: e }) => {
				queueMicrotask(() => e.unmount());
			}), Sn.clear();
		};
	}, [e]), r(() => {
		let e = ee.current;
		if (!e || !e.axisLayer) return;
		let t = u || {}, n = () => F(e, t);
		ne.current = t.on ? n : null, n();
	}, [
		u,
		c,
		e
	]);
	function F(e, t) {
		if (e.axisLayer.selectAll("*").remove(), M.current = null, !t.on) {
			j.current = !1;
			return;
		}
		let n = S.current, r = n ? n.clientWidth : window.innerWidth, i = n ? n.clientHeight : window.innerHeight;
		if (r < 60 || i < 60) return;
		let a = t.dock || b.dock, o = a === "left" || a === "right", s = b.endPadding, c = Number.isFinite(t.offset) ? t.offset : b.inset, l = a === "right" ? r - c : a === "bottom" ? i - c : c, u = Math.max((o ? i : r) - s * 2, 120), d = o ? {
			x: l,
			y: s
		} : {
			x: s,
			y: l
		}, f = (0, Qo.dimensionAxisGeometry)(e.data.nodes, {
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
				let n = m.append("line").attr("class", "time-connector").attr("data-node", e.id).attr("x1", t.x).attr("y1", t.y).attr("stroke", e._source && e._source.color || "#7f8ea3").attr("stroke-width", b.connectorWidth).attr("stroke-opacity", b.connectorOpacity);
				h.push({
					node: e,
					anchor: t,
					line: n
				});
			});
		});
		function g() {
			let t = ho(e.svg.node());
			h.forEach(({ node: n, anchor: r, line: i }) => {
				i.style("display", n._closedHidden ? "none" : null);
				let a = e.toScreen ? e.toScreen(n.x, n.y) : t.apply([n.x, n.y]);
				i.attr("x1", r.x).attr("y1", r.y).attr("x2", a[0]).attr("y2", a[1]);
			});
		}
		M.current = g, g();
		let _ = p.append("g").attr("class", "time-spine").style("cursor", o ? "ew-resize" : "ns-resize");
		_.append("rect").attr("x", o ? l - 34 / 2 : 0).attr("y", o ? 0 : l - 34 / 2).attr("width", o ? 34 : r).attr("height", o ? i : 34).attr("fill", "rgba(18,20,28,0.82)"), _.append("line").attr("x1", f.from.x).attr("y1", f.from.y).attr("x2", f.to.x).attr("y2", f.to.y).attr("stroke", "rgba(255,255,255," + b.spineOpacity + ")").attr("stroke-width", b.spineWidth);
		let v = b.tickFontSize, y = f.ticks.length > 1 ? Math.hypot(f.ticks[1].x - f.ticks[0].x, f.ticks[1].y - f.ticks[0].y) : Infinity, x = o ? v * 1.7 : v * 4.2, C = Math.max(1, Math.ceil(x / Math.max(y, 1)));
		f.ticks.forEach((e, t) => {
			_.append("line").attr("x1", e.x).attr("y1", e.y).attr("x2", e.x + (o ? 9 : 0)).attr("y2", e.y + (o ? 0 : -9)).attr("stroke", "rgba(255,255,255,0.45)").attr("stroke-width", 1.5), t % C === 0 && _.append("text").attr("x", e.x + (o ? 13 : 0)).attr("y", e.y + (o ? 0 : -14)).attr("text-anchor", o ? "start" : "middle").attr("dominant-baseline", o ? "central" : "auto").style("font-family", "'Atkinson', sans-serif").style("font-size", v + "px").style("fill", "rgba(255,255,255,0.62)").style("pointer-events", "none").text(e.label);
		});
		let w = null, T = 0;
		_.call(Gt().on("start", (e) => {
			w = o ? e.x : e.y, T = 0;
		}).on("drag", (e) => {
			w !== null && (T = (o ? e.x : e.y) - w, _.attr("transform", o ? "translate(" + T + ",0)" : "translate(0," + T + ")"), m.selectAll("line").attr(o ? "x1" : "y1", function() {
				return Number(V(this).attr(o ? "x1" : "y1"));
			}), h.forEach(({ anchor: e, line: t }) => {
				o ? t.attr("x1", e.x + T) : t.attr("y1", e.y + T);
			}));
		}).on("end", () => {
			if (w !== null && T && k.current) {
				let e = a === "right" || a === "bottom" ? c - T : c + T;
				k.current.setTimeAxis({
					offset: Math.max(20, e),
					moved: !0
				});
			}
			w = null;
		}));
	}
	return r(() => {
		te.current = c;
		let e = ee.current;
		if (!e) return;
		let t = k.current, n = A({
			hovered: !1,
			pinned: !1
		});
		if (e.recomputeContainers && e.recomputeContainers(), c === "force" && e.data.nodes.filter((e) => {
			let n = t && t.nodeState("force::" + N(e));
			return n && !n.auto || e._forcePos;
		}).length < e.data.nodes.length * .5) {
			e.data.nodes.forEach((e) => {
				let n = t && t.nodeState("force::" + N(e));
				n && !n.auto ? (e.fx = n.x, e.fy = n.y) : (e.fx = null, e.fy = null);
			}), e.simulation.alpha(1).restart();
			return;
		}
		let r = c === "force" ? Object.fromEntries(e.data.nodes.map((e) => [e.id, e._forcePos || t && t.nodeState("force::" + N(e)) || {
			x: e.x,
			y: e.y
		}])) : c === "radial" && e.ringTargets && e.ringTargets() || (0, Qo.computeLayout)(c, e.data.nodes, {
			cardW: n.width,
			cardH: n.height
		});
		if (!r) return;
		let i = new Map(e.data.nodes.map((e) => [e.id, {
			x: e.x,
			y: e.y
		}]));
		e.data.nodes.forEach((e) => {
			let n = t && t.nodeState(c + "::" + N(e)), i = n && typeof n.x == "number" && !n.auto ? {
				x: n.x,
				y: n.y
			} : r[e.id];
			i && (e.targetX = i.x, e.targetY = i.y, e.fx = i.x, e.fy = i.y, t && !(n && !n.auto) && t.setNodePosition(c + "::" + N(e), i.x, i.y, { silent: !0 }));
		});
		let a = zi;
		Fi().duration(760).ease(a).tween("layout-transition", () => {
			let t = e.data.nodes.map((e) => {
				let t = i.get(e.id) || {
					x: e.x,
					y: e.y
				}, n = typeof e.targetX == "number" ? e.targetX : e.x, r = typeof e.targetY == "number" ? e.targetY : e.y, a = In(t.x, n), o = In(t.y, r);
				return (t) => {
					e.x = a(t), e.y = o(t);
				};
			});
			return (n) => {
				for (let e = 0; e < t.length; e++) t[e](n);
				e.applyPositions(), M.current && M.current();
			};
		}).on("end", () => {
			e.data.nodes.forEach((e) => {
				typeof e.targetX == "number" && (e.x = e.targetX), typeof e.targetY == "number" && (e.y = e.targetY), delete e.targetX, delete e.targetY;
			}), e.applyPositions(), M.current && M.current();
		});
		let o = setTimeout(() => {
			ne.current && ne.current(), e.fitToViewport && e.fitToViewport();
		}, 800);
		return () => clearTimeout(o);
	}, [c]), /* @__PURE__ */ d("div", {
		ref: S,
		className: To.graphContainer
	});
}
var q = {
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
}, ms = {
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
}, hs = /* @__PURE__ */ p(((e, t) => {
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
})), gs = /* @__PURE__ */ p(((e, t) => {
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
})), _s = /* @__PURE__ */ p(((e, t) => {
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
})), vs = hs(), ys = gs(), bs = _s(), xs = "p, li, blockquote, h1, h2, h3, h4, h5, h6, dd, dt, figcaption, td, th", Ss = "pp-follow-sentence", Cs = "pp-follow-word", ws = "pp-follow-block", Ts = () => typeof CSS < "u" && CSS.highlights && typeof Highlight < "u";
function Es(e, t) {
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
function Ds(e) {
	let t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT, { acceptNode(e) {
		let t = e.parentElement;
		return t && t.closest(".bookmarkRibbon, [aria-hidden=\"true\"]") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
	} }), r;
	for (; r = n.nextNode();) t.push(r);
	return t;
}
function Os(e, t, n, r) {
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
function ks(e) {
	Ts() && (CSS.highlights.delete(Ss), CSS.highlights.delete(Cs)), e && (e.querySelectorAll("." + ws).forEach((e) => e.classList.remove(ws)), delete e.dataset.followSentence, delete e.dataset.followWord);
}
function As(e, t, n) {
	let r = Es(t, n);
	if (!r || !e.contains(r.node)) return null;
	let i = r.node.nodeType === 3 ? r.node.parentElement : r.node, a = i && i.closest(xs);
	if (!a || !e.contains(a)) return null;
	let o = Ds(a);
	if (!o.length) return null;
	let s = [], c = "", l = null;
	for (let e of o) s.push(c.length), e === r.node && (l = c.length + r.offset), c += e.nodeValue;
	if (l === null) return null;
	let u = (0, bs.spanAt)(c, l);
	if (!u) return null;
	ks(e);
	let d = c.slice(u.sentence[0], u.sentence[1]), f = u.word ? c.slice(u.word[0], u.word[1]) : "";
	return Ts() ? (CSS.highlights.set(Ss, new Highlight(Os(o, s, u.sentence[0], u.sentence[1]))), u.word && CSS.highlights.set(Cs, new Highlight(Os(o, s, u.word[0], u.word[1])))) : a.classList.add(ws), e.dataset.followSentence = d, e.dataset.followWord = f, {
		sentence: d,
		word: f
	};
}
function js(e) {
	let t = !1, n = 0, r = null, i = () => {
		n = 0, r && As(e, r.x, r.y);
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
		n && cancelAnimationFrame(n), e.removeEventListener("pointerdown", o), e.removeEventListener("pointermove", s), window.removeEventListener("pointerup", c), window.removeEventListener("pointercancel", c), ks(e);
	};
}
//#endregion
//#region src/components/ReaderPanel/boldStartHtml.js
var Ms = (/* @__PURE__ */ p(((e, t) => {
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
})))(), Ns = new Set([
	"SCRIPT",
	"STYLE",
	"CODE",
	"PRE",
	"KBD",
	"SAMP",
	"svg"
]);
function Ps(e) {
	if (!e || typeof DOMParser > "u") return e;
	let t = new DOMParser().parseFromString(`<div id="pp-bs-root">${e}</div>`, "text/html"), n = t.getElementById("pp-bs-root"), r = t.createTreeWalker(n, NodeFilter.SHOW_TEXT, { acceptNode(e) {
		for (let t = e.parentElement; t && t !== n; t = t.parentElement) if (Ns.has(t.tagName)) return NodeFilter.FILTER_REJECT;
		return /[\p{L}]/u.test(e.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
	} }), i = [], a;
	for (; a = r.nextNode();) i.push(a);
	for (let e of i) {
		let n = t.createDocumentFragment();
		for (let r of (0, Ms.boldStartSegments)(e.nodeValue)) if (r.bold) {
			let e = t.createElement("b");
			e.className = "pp-bs", e.textContent = r.text, n.appendChild(e);
		} else n.appendChild(t.createTextNode(r.text));
		e.parentNode.replaceChild(n, e);
	}
	return n.innerHTML;
}
//#endregion
//#region src/lib/rights.js
var Fs = /* @__PURE__ */ p(((e, t) => {
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
})), Is = /* @__PURE__ */ p(((e, t) => {
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
})), Ls = Fs(), Rs = Is();
function zs({ article: e, onClose: t, settings: n, viewState: a, targetParagraph: c, feedData: l, onNavigate: p }) {
	let [m, h] = s(!1), [g, _] = s(!1), [v, y] = s(null), [b, x] = s(!1), [S, C] = s(""), [w, T] = s(0), [E, D] = s(!1), [O, k] = s(!1), A = o(null), ee = o(!1), te = o({
		mouseX: 0,
		mouseY: 0,
		posX: 0,
		posY: 0
	}), [j, ne] = s(null), [M, re] = s(null), ie = o([]);
	r(() => {
		de.current && (clearTimeout(de.current), pe()), e ? (h(!0), _(!1), ne(null), A.current && (A.current.scrollTop = 0), T(0), ue(e)) : (h(!1), _(!1), C(""), T(0), x(!1));
	}, [e]);
	let N = (e) => e ? e.originalItem && e.originalItem.id || e.id || e.url : null, ae = N(e), P = a && ae ? a.bookmarks(ae) : [], oe = !!(a && a.readerAid && a.readerAid("boldStart")), se = i(() => oe ? Ps(S) : S, [S, oe]), ce = (e) => {
		e.target.closest("button") || e.target.closest("a") || e.target.closest("input") || (ee.current = !0, te.current = {
			mouseX: e.clientX,
			mouseY: e.clientY,
			posX: v ? v.x : 0,
			posY: v ? v.y : 0
		}, window.addEventListener("mousemove", le), window.addEventListener("mouseup", F));
	}, le = (e) => {
		if (!ee.current) return;
		let t = e.clientX - te.current.mouseX, n = e.clientY - te.current.mouseY;
		y({
			x: te.current.posX + t,
			y: te.current.posY + n
		});
	}, F = () => {
		ee.current = !1, window.removeEventListener("mousemove", le), window.removeEventListener("mouseup", F);
	}, ue = async (e) => {
		let t = e.kind || "essay";
		if (t === "placeholder" || e.substrate === "placeholder") {
			let t = e.series_part || e.title || "";
			C(`
        <div style="padding: 40px 24px; text-align: center; border: 1px dashed rgba(212, 175, 55, 0.35); border-radius: 12px; background: rgba(20, 24, 38, 0.6); margin-top: 24px;">
          <div style="font-size: 32px; margin-bottom: 12px; opacity: 0.9;">📖</div>
          <div style="font-size: 20px; font-weight: 600; color: var(--rp-accent, #d4af37); margin-bottom: 8px;">Chapter ${t}</div>
          <div style="font-size: 13px; color: var(--rp-text, #a8b2d1); opacity: 0.8; letter-spacing: 0.5px;">Act ${Number(t) >= 21 ? "3" : "2"} · In Progress</div>
        </div>
      `);
			return;
		}
		if (e._posted === "title") {
			let t = (0, Rs.navStatus)(l, e) || "";
			C(`<div class="${q.notYet}" data-not-yet><div class="${q.notYetTitle}">${Bs(e.title || "")}</div><div class="${q.notYetStatus}">${Bs(t)}</div></div>`);
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
			a && a.remove(), i.querySelectorAll(".pp-rights").forEach((e) => e.remove()), C((i.querySelector("body") ? i.querySelector("body").innerHTML : r) + Hs(e));
		} catch {
			C(Vs(e, "Rendered article not yet published to GitHub Pages."));
		}
		else C(t === "image" ? (e.image ? `<img src="${e.image}" style="max-width:100%;height:auto;border-radius:4px;display:block;margin:0 auto;">` : "<p style=\"color:#666;\">No image resolved.</p>") + Us(e) : Vs(e) + Us(e));
	}, de = o(null), fe = o(null), pe = () => {
		de.current = null;
		let e = A.current, t = fe.current;
		if (!e || !t || !a || !a.setReadingProgress) return;
		let n = e.scrollHeight - e.clientHeight;
		a.setReadingProgress(t, n > 0 ? e.scrollTop / n : 1);
	}, me = () => {
		if (A.current) {
			let { scrollTop: e, scrollHeight: t, clientHeight: n } = A.current, r = t - n, i = r > 0 ? e / r * 100 : 100;
			T(Math.max(0, Math.min(i, 100))), fe.current && (i >= 98 ? (clearTimeout(de.current), pe()) : de.current ||= setTimeout(pe, 350));
		}
	}, he = () => {
		if (!a || !e) return;
		let t = N(e), n = a.bookmarks(t);
		if (n.length) n.forEach((e) => a.removeBookmark(e.id));
		else {
			let n = ge(), r = A.current ? A.current.querySelectorAll("p") : [], i = n !== null && r[n] ? r[n].innerText.trim().split(/\s+/).slice(0, 8).join(" ") : "";
			a.addBookmark({
				item: t,
				para: n === null ? void 0 : n,
				quote: i,
				version: e.version
			});
		}
	}, ge = () => {
		if (!A.current) return null;
		let e = A.current.getBoundingClientRect(), t = A.current.querySelectorAll("p");
		for (let n = 0; n < t.length; n++) if (t[n].getBoundingClientRect().bottom > e.top + 10) return n;
		return null;
	}, _e = async () => {
		if (!e) return;
		let t = N(e), n = ge(), r = window.location.href.split("#")[0] + "#read=" + encodeURIComponent(t);
		n !== null && (r += "&p=" + n);
		try {
			await navigator.clipboard.writeText(r), D(!0), setTimeout(() => D(!1), 2e3);
		} catch (e) {
			console.error("Copy link failed:", e);
		}
	}, ve = (e) => {
		if (!A.current || e == null) return;
		let t = A.current.querySelectorAll("p");
		if (t[e]) {
			let n = A.current.getBoundingClientRect(), r = t[e].getBoundingClientRect();
			A.current.scrollTop += r.top - n.top - 20;
		}
	}, ye = async () => {
		if (!e || !A.current) return;
		let t = `${(n?.export?.license_header || "").replace("{{canonical_url}}", e.canonical_url || e.url)}\n\n---\n\n${A.current.innerText}`;
		try {
			await navigator.clipboard.writeText(t), D(!0), setTimeout(() => D(!1), 2e3);
		} catch (e) {
			console.error("Copy failed:", e);
		}
	}, be = () => {
		if (!e || !A.current || !(0, ys.allowDownload)(n)) return;
		let t = `${(n?.export?.license_header || "").replace("{{canonical_url}}", e.canonical_url || e.url)}\n\n---\n\n${A.current.innerText}`, r = new Blob([t], { type: "text/markdown" }), i = document.createElement("a");
		i.href = URL.createObjectURL(r), i.download = `${(e.id || e.url).split("/").pop().replace(".html", "") || "article"}.md`, i.click(), URL.revokeObjectURL(i.href);
	}, xe = async (t) => {
		if (t.preventDefault(), e) try {
			await navigator.clipboard.writeText(e.canonical_url || e.url), D(!0), setTimeout(() => D(!1), 2e3);
		} catch (e) {
			console.error("Copy URL failed:", e);
		}
	};
	r(() => {
		if (clearTimeout(de.current), de.current = null, fe.current = null, !S || !e || e._posted === "title" || !a || !a.readingProgress) return;
		let t = N(e), n = setTimeout(() => {
			let e = A.current;
			if (!e) return;
			let n = a.readingProgress(t), r = e.scrollHeight - e.clientHeight;
			c == null && n.at > .02 && n.at < .98 && r > 0 && (e.scrollTop = n.at * r), fe.current = t, me(), r <= 0 && pe();
		}, 60);
		return () => clearTimeout(n);
	}, [S]), r(() => {
		S && c != null && A.current && setTimeout(() => {
			ve(c);
		}, 50);
	}, [S, c]);
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
				return (0, vs.resolveParagraph)(r, e.quote, t);
			}
		}
		return r;
	};
	r(() => {
		if (!a || !A.current) return;
		let t = e ? N(e) : null, n = a.bookmarks();
		if (A.current.querySelectorAll(".bookmarkRibbon").forEach((e) => e.remove()), t) {
			let r = n.find((e) => e.item === t);
			if (r) {
				let t = A.current.querySelectorAll("p"), n = Se(r, e, t);
				if (n !== null && t[n]) {
					let e = document.createElement("div");
					e.className = "bookmarkRibbon", e.setAttribute("aria-hidden", "true"), e.innerHTML = ms.bookmark, e.style.position = "absolute", e.style.left = "-30px", e.style.top = "0", e.style.color = "var(--rp-accent)", e.style.width = "20px", e.style.height = "20px", t[n].style.position = "relative", t[n].appendChild(e);
				}
			}
		}
	}, [
		se,
		a ? a.bookmarks() : null,
		e
	]);
	let Ce = !!(a && a.readerAid && a.readerAid("followAlong"));
	r(() => {
		if (!(!Ce || !A.current)) return js(A.current);
	}, [
		Ce,
		se,
		e
	]);
	let we = i(() => e && l ? (0, Rs.neighbours)(l, e.id) : {
		prev: [],
		next: []
	}, [e, l]), Te = () => typeof window < "u" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches, Ee = (e, t) => {
		if (!(!e || !p || !(0, Rs.isReadable)(e))) {
			if (ie.current.forEach(clearTimeout), ie.current = [], Te()) {
				p(e);
				return;
			}
			ne(t), ie.current.push(setTimeout(() => {
				re(t), p(e), ie.current.push(setTimeout(() => re(null), 520));
			}, 170));
		}
	}, De = (t) => {
		if (!e || !l) return;
		let n = (0, Rs.step)(l, e.id, t);
		n && Ee(n, t);
	}, Oe = o(De);
	Oe.current = De, r(() => () => ie.current.forEach(clearTimeout), []);
	let ke = !!e && m && !g;
	r(() => {
		if (!ke) return;
		let e = (e) => {
			if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
			let t = e.target;
			t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) || (e.key === "ArrowRight" && (e.preventDefault(), Oe.current("next")), e.key === "ArrowLeft" && (e.preventDefault(), Oe.current("prev")));
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [ke]), r(() => {
		let e = A.current;
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
	let Ae = o(null);
	if (Ae.current = he, r(() => {
		let e = () => {
			Ae.current && Ae.current();
		};
		return window.addEventListener("postpipe:reader-mark", e), () => window.removeEventListener("postpipe:reader-mark", e);
	}, []), !e) return null;
	let je = (e, t, n) => {
		let r = (0, Rs.navStatus)(l, e), i = t === "next" ? "Next" : "Previous";
		return r ? /* @__PURE__ */ f("div", {
			className: `${q.navItem} ${q.navLocked} ${n ? q.navBig : ""}`,
			"data-reader-nav": t,
			"data-nav-status": !0,
			children: [
				/* @__PURE__ */ d("span", {
					className: q.navDir,
					children: i
				}),
				/* @__PURE__ */ d("span", {
					className: q.navTitle,
					children: e.title
				}),
				/* @__PURE__ */ d("span", {
					className: q.navStatus,
					children: r
				})
			]
		}, e.id) : /* @__PURE__ */ f("button", {
			className: `${q.navItem} ${n ? q.navBig : ""}`,
			"data-reader-nav": t,
			onClick: () => Ee(e, t),
			title: `${i}: ${e.title}`,
			children: [/* @__PURE__ */ f("span", {
				className: q.navDir,
				children: [
					t === "prev" ? "← " : "",
					i,
					t === "next" ? " →" : ""
				]
			}), /* @__PURE__ */ d("span", {
				className: q.navTitle,
				children: e.title
			})]
		}, e.id);
	}, Me = [e.date ? (/* @__PURE__ */ new Date(`${e.date}T00:00:00`)).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	}) : "", e.reading_time].filter(Boolean), Ne = (n?.author?.name || n?.author?.display || "harold young").toLowerCase(), I = n?.author?.url;
	e.authors && e.authors.length > 0 && e.authors[0].name ? (Ne = e.authors.map((e) => e.name).join(", ").toLowerCase(), I = e.authors[0].url || e.canonical_url || e.url) : e.author && (Ne = e.author.replace(/\s*\[humxn\]/i, "").trim().toLowerCase(), I = e.canonical_url || e.url);
	let Pe = (0, No.readerHeader)(n, e), Fe = (0, ys.progressBarMode)(n), Ie = (0, ys.allowDownload)(n), Le = (0, Ls.rightsLine)(n && n.rights);
	return /* @__PURE__ */ f(u, { children: [
		/* @__PURE__ */ d("div", {
			className: `${q.overlay} ${m && !g ? q.open : ""}`,
			onClick: t
		}),
		/* @__PURE__ */ f("div", {
			className: `${q.panel} ${m && !g ? q.open : ""} ${g ? q.minimized : ""} ${O ? q.wide : ""}`,
			style: v ? { transform: `translate3d(${v.x}px, ${v.y}px, 0px)` } : void 0,
			children: [
				Fe !== "none" && /* @__PURE__ */ d("div", {
					className: Fe === "side" ? q.progressSide : q.progress,
					role: "progressbar",
					"aria-label": "Reading progress",
					"aria-valuemin": 0,
					"aria-valuemax": 100,
					"aria-valuenow": Math.round(w),
					children: /* @__PURE__ */ d("div", {
						className: q.progressFill,
						style: Fe === "side" ? { height: `${w}%` } : { width: `${w}%` }
					})
				}),
				/* @__PURE__ */ f("div", {
					className: q.toolbar,
					onMouseDown: ce,
					onDoubleClick: () => y(null),
					title: "Drag toolbar to move window · Double-click to reset",
					children: [
						/* @__PURE__ */ d("div", {
							className: q.dragGrip,
							title: "Drag to move reading window",
							children: "⋮⋮"
						}),
						/* @__PURE__ */ d("div", {
							id: "tts-mount-point",
							className: `${q.toolbarGroup} ${q.ttsMount}`
						}),
						/* @__PURE__ */ d("div", { className: q.toolbarSeparator }),
						/* @__PURE__ */ d("div", { className: q.toolbarSeparator }),
						/* @__PURE__ */ f("div", {
							className: q.toolbarGroup,
							children: [/* @__PURE__ */ d("button", {
								className: `${q.tb} ${q.tbLabeled} ${P.length > 0 ? q.active : ""}`,
								onClick: he,
								"aria-pressed": P.length > 0,
								title: P.length > 0 ? "Remove the bookmark in this chapter" : "Save the paragraph at the top of the reader",
								"data-bookmark-toggle": !0,
								dangerouslySetInnerHTML: { __html: `${ms.bookmark}<span class="${q.tbText}">${P.length > 0 ? "Marked" : "Mark here"}</span>` }
							}), /* @__PURE__ */ d("button", {
								className: `${q.tb} ${q.tbLabeled}`,
								onClick: () => window.dispatchEvent(new CustomEvent("postpipe:toggle-settings", { detail: {
									section: "place",
									open: !0
								} })),
								title: "Every place you have bookmarked, in the settings panel under Your place",
								"data-bookmark-list": !0,
								dangerouslySetInnerHTML: { __html: `${ms.bookmarkList}<span class="${q.tbText}">Bookmarks</span>` }
							})]
						}),
						/* @__PURE__ */ d("div", { className: q.toolbarSeparator }),
						/* @__PURE__ */ d("div", {
							className: q.toolbarGroup,
							children: /* @__PURE__ */ d("button", {
								className: q.tb,
								onClick: _e,
								title: "Copy link to here",
								dangerouslySetInnerHTML: { __html: `${ms.copy}<span class="${q.tbTooltip}">Link here</span>` }
							})
						}),
						/* @__PURE__ */ d("div", { className: q.toolbarSeparator }),
						/* @__PURE__ */ f("div", {
							className: q.toolbarGroup,
							children: [
								/* @__PURE__ */ d("button", {
									className: `${q.tb} ${b ? q.active : ""}`,
									onClick: () => x(!b),
									title: "Article details",
									dangerouslySetInnerHTML: { __html: `${ms.info}<span class="${q.tbTooltip}">Details</span>` }
								}),
								Ie && /* @__PURE__ */ d("button", {
									className: q.tb,
									onClick: be,
									title: "Export markdown",
									"data-reader-download": !0,
									dangerouslySetInnerHTML: { __html: `${ms.download}<span class="${q.tbTooltip}">Export</span>` }
								}),
								/* @__PURE__ */ d("button", {
									className: q.tb,
									onClick: ye,
									title: "Copy to clipboard",
									dangerouslySetInnerHTML: { __html: `${ms.copy}<span class="${q.tbTooltip}">Copy</span>` }
								}),
								/* @__PURE__ */ d("button", {
									className: `${q.tb} ${O ? q.active : ""}`,
									onClick: () => k((e) => !e),
									title: O ? "Shrink reader" : "Widen reader",
									dangerouslySetInnerHTML: { __html: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">${O ? "<polyline points=\"15 3 21 3 21 9\"/><polyline points=\"9 21 3 21 3 15\"/><line x1=\"21\" y1=\"3\" x2=\"14\" y2=\"10\"/><line x1=\"3\" y1=\"21\" x2=\"10\" y2=\"14\"/>" : "<polyline points=\"3 9 3 3 9 3\"/><polyline points=\"21 15 21 21 15 21\"/><line x1=\"3\" y1=\"3\" x2=\"10\" y2=\"10\"/><line x1=\"21\" y1=\"21\" x2=\"14\" y2=\"14\"/>"}</svg><span class="${q.tbTooltip}">${O ? "Shrink" : "Widen"}</span>` }
								})
							]
						}),
						/* @__PURE__ */ d("div", { className: q.toolbarSeparator }),
						/* @__PURE__ */ f("div", {
							className: q.toolbarGroup,
							children: [/* @__PURE__ */ d("button", {
								className: `${q.tb} ${q.syndLink} ${q.canonical}`,
								onClick: xe,
								dangerouslySetInnerHTML: { __html: `${ms.link}<span class="${q.tbTooltip}">Copy URL</span>` }
							}), Object.entries(e.syndication || {}).map(([e, t]) => {
								if (!t) return null;
								let r = n?.toolbar?.syndication_icons?.[e];
								return r ? /* @__PURE__ */ d("a", {
									href: t,
									target: "_blank",
									rel: "noopener noreferrer",
									className: `${q.tb} ${q.syndLink}`,
									dangerouslySetInnerHTML: { __html: `${ms[r.icon] || ms.globe}<span class="${q.tbTooltip}">${r.label}</span>` }
								}, e) : null;
							})]
						}),
						/* @__PURE__ */ d("div", { className: q.toolbarSpacer }),
						/* @__PURE__ */ f("div", {
							className: q.windowControls,
							children: [
								/* @__PURE__ */ d("button", {
									className: q.tb,
									onClick: () => window.dispatchEvent(new CustomEvent("postpipe:toggle-settings")),
									title: "Reading settings",
									"aria-label": "Reading settings",
									"data-reader-settings": !0,
									dangerouslySetInnerHTML: { __html: `${ms.settings}<span class="${q.tbTooltip}">Settings</span>` }
								}),
								/* @__PURE__ */ d("button", {
									className: `${q.tb} ${q.minimizeBtn}`,
									onClick: () => _(!0),
									title: "Minimize reading window (turn off)",
									dangerouslySetInnerHTML: { __html: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="5" y1="12" x2="19" y2="12"/></svg><span class="${q.tbTooltip}">Minimize</span>` }
								}),
								/* @__PURE__ */ d("button", {
									className: `${q.tb} ${q.closeBtn}`,
									onClick: t,
									title: "Close reading window",
									dangerouslySetInnerHTML: { __html: `${ms.close}<span class="${q.tbTooltip}">Close</span>` }
								})
							]
						})
					]
				}),
				b && /* @__PURE__ */ d(Ws, {
					article: e,
					settings: n
				}),
				/* @__PURE__ */ f("div", {
					className: `${q.body} ${Ce ? q.following : ""} ${j ? q["turnOut_" + j] : ""} ${M ? q["turnIn_" + M] : ""}`,
					"data-tts-target": !0,
					"data-follow-along": Ce ? "on" : "off",
					ref: A,
					onScroll: me,
					children: [
						we.prev.length > 0 && /* @__PURE__ */ d("nav", {
							className: q.navTop,
							"aria-label": "Previous chapter",
							children: we.prev.map((e) => je(e, "prev", !1))
						}),
						/* @__PURE__ */ f("div", {
							className: q.articleHeader,
							children: [
								Pe.kicker && /* @__PURE__ */ d("div", {
									className: q.articleKicker,
									children: Pe.kicker
								}),
								/* @__PURE__ */ d("h1", {
									className: q.articleTitle,
									children: e.title || e.label
								}),
								Pe.byline && /* @__PURE__ */ f("div", {
									className: q.articleByline,
									children: ["by ", I ? /* @__PURE__ */ d("a", {
										href: I,
										target: "_blank",
										rel: "noopener noreferrer",
										children: Ne
									}) : Ne]
								}),
								Me.length > 0 && /* @__PURE__ */ d("div", {
									className: q.articleMeta,
									children: Me.join(" · ")
								}),
								e.kind && e.kind !== "essay" && /* @__PURE__ */ f("div", {
									className: q.articleMeta,
									style: {
										marginTop: 4,
										opacity: .7
									},
									children: ["substrate: ", e.kind]
								})
							]
						}),
						/* @__PURE__ */ d("div", { dangerouslySetInnerHTML: { __html: se } }),
						S && (we.next.length > 0 || we.prev.length > 0) && /* @__PURE__ */ f("nav", {
							className: q.navBottom,
							"aria-label": "Next chapter",
							"data-reader-nav-bottom": !0,
							children: [we.next.map((e) => je(e, "next", !0)), we.next.length === 0 && we.prev.map((e) => je(e, "prev", !1))]
						}),
						Le && S && /* @__PURE__ */ d("footer", {
							className: q.rightsLine,
							"data-reader-rights": !0,
							children: Le
						})
					]
				})
			]
		}),
		/* @__PURE__ */ d("div", {
			className: `${q.copyToast} ${E ? q.show : ""}`,
			children: "Copied to clipboard"
		}),
		g && e && /* @__PURE__ */ f("div", {
			className: q.restorePill,
			onClick: () => _(!1),
			title: "Bring reading window back",
			children: [
				/* @__PURE__ */ d("span", {
					className: q.pillIcon,
					children: "📖"
				}),
				/* @__PURE__ */ f("span", {
					className: q.pillLabel,
					children: [/* @__PURE__ */ d("span", {
						className: q.pillTitle,
						children: e.title || e.label
					}), /* @__PURE__ */ f("span", {
						className: q.pillAuthor,
						children: ["by ", Ne]
					})]
				}),
				/* @__PURE__ */ d("span", {
					className: q.pillAction,
					children: "Restore ↗"
				})
			]
		})
	] });
}
function Bs(e) {
	return String(e).replace(/[&<>"']/g, (e) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;"
	})[e]);
}
function Vs(e, t) {
	let n = t || `This substrate ("${e.kind || "unknown"}") is not yet renderable in the viewer.`, r = "<div style=\"padding:24px;border:1px dashed var(--rp-border);border-radius:6px;background:rgba(17,24,39,0.4);\">";
	r += `<p style="color:var(--rp-accent);font-weight:600;margin-bottom:8px;">${n}</p>`, e.todos && e.todos.length && (r += `<p style="color:#f39c12;font-size:13px;">Pending: ${e.todos.join(", ")}</p>`);
	let i = (e.url || e.id || "").split("/").pop().replace(".html", ""), a = e._source?.path || `chapters/${i}`;
	return r += `<p style="color:#888;font-size:13px;margin-top:12px;">The bundle exists at <code>${a}</code>.</p>`, r += "</div>", r;
}
function Hs(e) {
	let t = e.forms && e.forms.companions || [];
	if (!t.length) return "";
	let n = "<div style=\"margin-top:32px;padding-top:24px;border-top:1px solid var(--rp-border);\">";
	return n += "<div style=\"color:var(--rp-accent);font-size:11px;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;\">also exists as</div>", n += `<div style="color:var(--rp-text);font-size:14px;">${t.map((e) => `<span class="${q.fmTag}">${e}</span>`).join(" ")}</div>`, n += "</div>", n;
}
function Us(e) {
	let t = [];
	if (e.seed && t.push(["seed", e.seed]), e.tldr && t.push(["tldr", e.tldr]), e.topology && e.topology.length && t.push(["topology", e.topology.join(" · ")]), e.energy && t.push(["energy", e.energy]), e.note && t.push(["note", e.note]), !t.length) return "";
	let n = "<div style=\"margin-top:32px;padding:20px;background:rgba(17,24,39,0.4);border-radius:6px;\">";
	for (let [e, r] of t) n += `<div class="${q.fmRow}"><span class="${q.fmLabel}">${e}</span><span class="${q.fmValue}">${r}</span></div>`;
	return n += "</div>", n;
}
function Ws({ article: e, settings: n }) {
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
				e.tags && e.tags.length && (r = /* @__PURE__ */ d(u, { children: e.tags.map((e) => /* @__PURE__ */ d("span", {
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
				i.length && (r = /* @__PURE__ */ d(u, { children: i.map(([e, n], r) => /* @__PURE__ */ f(t.Fragment, { children: [/* @__PURE__ */ d("a", {
					className: q.fmSyndLink,
					href: n,
					target: "_blank",
					rel: "noopener noreferrer",
					children: e
				}), r < i.length - 1 ? " · " : ""] }, e)) }));
				break;
			default: break;
		}
		return r ? (i = !0, /* @__PURE__ */ f("div", {
			className: q.fmRow,
			children: [/* @__PURE__ */ d("span", {
				className: q.fmLabel,
				children: n.replace(/_/g, " ")
			}), /* @__PURE__ */ d("span", {
				className: q.fmValue,
				children: r
			})]
		}, n)) : null;
	});
	return /* @__PURE__ */ d("div", {
		className: `${q.frontmatterPanel} ${q.open}`,
		children: i ? a : /* @__PURE__ */ d("div", {
			className: q.fmRow,
			children: /* @__PURE__ */ d("span", {
				className: q.fmValue,
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
function Gs() {
	let [e, t] = s(null), [n, i] = s("stopped"), [a, o] = s([]), [c, l] = s(""), [u, d] = s([]), [f, p] = s(""), [m, h] = s({}), [g, _] = s({}), [v, y] = s(0), [b, x] = s(""), [S, C] = s(null), [w, T] = s(!1);
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
		selectedEngine: c,
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
function Ks({ targetRef: e }) {
	let { T: t, state: n, engineProgress: r, errorMsg: i, statusMessage: a, isError: o, setStatusMessage: s, setIsError: c } = Gs();
	return t ? /* @__PURE__ */ f("div", {
		className: J.ttsGroup,
		style: { position: "relative" },
		children: [
			n !== "playing" && /* @__PURE__ */ d("button", {
				className: J.tb,
				onClick: () => {
					!t || !e.current || (s(null), c(!1), t.play(e.current, { scrollContainer: e.current }));
				},
				title: "Play",
				dangerouslySetInnerHTML: { __html: `${ms.play}<span class="${J.tbTooltip}">Play</span>` }
			}),
			n === "playing" && /* @__PURE__ */ d("button", {
				className: J.tb,
				onClick: () => {
					t && t.pause();
				},
				title: "Pause",
				dangerouslySetInnerHTML: { __html: `${ms.pause}<span class="${J.tbTooltip}">Pause</span>` }
			}),
			(n === "playing" || n === "paused" || n === "loading") && /* @__PURE__ */ d("button", {
				className: J.tb,
				onClick: () => {
					t && t.stop();
				},
				title: "Stop",
				dangerouslySetInnerHTML: { __html: `${ms.stop}<span class="${J.tbTooltip}">Stop</span>` }
			}),
			n === "loading" && r > 0 && /* @__PURE__ */ d("div", {
				className: J.loadingBarContainer,
				children: /* @__PURE__ */ d("div", {
					className: J.loadingBarFill,
					style: { width: `${r}%` }
				})
			}),
			n === "playing" && /* @__PURE__ */ f("div", {
				className: J.visualizer,
				children: [
					/* @__PURE__ */ d("div", { className: J.bar }),
					/* @__PURE__ */ d("div", { className: J.bar }),
					/* @__PURE__ */ d("div", { className: J.bar }),
					/* @__PURE__ */ d("div", { className: J.bar })
				]
			}),
			/* @__PURE__ */ d("div", {
				className: `${J.errorToast} ${i ? J.show : ""}`,
				children: i
			}),
			a && /* @__PURE__ */ d("span", {
				className: `${J.statusBadge} ${o ? J.error : ""}`,
				children: a
			})
		]
	}) : null;
}
function qs() {
	let { T: e, engines: t, selectedEngine: n, voices: r, selectedVoice: i, capabilities: a, params: o, handleEngineChange: s, handleVoiceChange: c, handleParamChange: l } = Gs();
	return e ? /* @__PURE__ */ f("div", {
		className: J.ttsSettings,
		"data-tts-settings": !0,
		children: [
			t.length > 1 && /* @__PURE__ */ d("select", {
				className: J.select,
				style: { maxWidth: 110 },
				value: n,
				onChange: s,
				title: "TTS Engine",
				children: t.map((e) => /* @__PURE__ */ d("option", {
					value: e.id,
					children: e.label
				}, e.id))
			}),
			/* @__PURE__ */ f("label", {
				className: J.settingRow,
				children: [/* @__PURE__ */ d("span", { children: "Voice" }), /* @__PURE__ */ d("select", {
					className: J.select,
					value: i,
					onChange: c,
					"data-tts-voice": !0,
					children: r.length ? r.map((e) => /* @__PURE__ */ d("option", {
						value: e.id,
						children: e.label
					}, e.id)) : /* @__PURE__ */ d("option", { children: "Loading..." })
				})]
			}),
			/* @__PURE__ */ d("div", {
				className: J.params,
				children: Object.entries(a).map(([e, t]) => !t || e === "voice" || e === "pitch" || e === "volume" ? null : t.type === "range" ? /* @__PURE__ */ f("label", {
					className: J.settingRow,
					title: `${t.label}: ${o[e]}`,
					children: [/* @__PURE__ */ f("span", { children: [
						t.label,
						" ",
						/* @__PURE__ */ f("span", {
							className: J.paramValue,
							children: [Number(o[e] ?? t.default).toFixed(1), "×"]
						})
					] }), /* @__PURE__ */ d("input", {
						"data-tts-param": e,
						type: "range",
						min: t.min,
						max: t.max,
						step: t.step || .1,
						value: o[e] ?? t.default,
						onChange: (t) => l(e, parseFloat(t.target.value))
					})]
				}, e) : t.type === "select" ? /* @__PURE__ */ f("label", {
					className: J.settingRow,
					children: [/* @__PURE__ */ d("span", { children: t.label }), /* @__PURE__ */ d("select", {
						value: o[e] ?? t.default,
						onChange: (t) => l(e, t.target.value),
						children: t.options.map((e) => /* @__PURE__ */ d("option", {
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
	bar: "_bar_qv86c_6",
	pill: "_pill_qv86c_20",
	hidden: "_hidden_qv86c_59",
	title: "_title_qv86c_63",
	failed: "_failed_qv86c_67",
	dot: "_dot_qv86c_67",
	dotWrap: "_dotWrap_qv86c_76",
	dotActive: "_dotActive_qv86c_112",
	ringBackdrop: "_ringBackdrop_qv86c_117",
	ring: "_ring_qv86c_117",
	swatch: "_swatch_qv86c_133",
	swatchCurrent: "_swatchCurrent_qv86c_153",
	count: "_count_qv86c_165",
	addPill: "_addPill_qv86c_174",
	plus: "_plus_qv86c_180",
	addOpen: "_addOpen_qv86c_191",
	addInput: "_addInput_qv86c_198",
	addClose: "_addClose_qv86c_215",
	addSubmit: "_addSubmit_qv86c_231",
	ready: "_ready_qv86c_252",
	resultPanel: "_resultPanel_qv86c_263",
	resultClose: "_resultClose_qv86c_285",
	resultTitle: "_resultTitle_qv86c_300",
	resultUrl: "_resultUrl_qv86c_307",
	resultSection: "_resultSection_qv86c_316",
	resultLabel: "_resultLabel_qv86c_323",
	resultBox: "_resultBox_qv86c_332",
	code: "_code_qv86c_342",
	codeInline: "_codeInline_qv86c_352",
	copyBtn: "_copyBtn_qv86c_361",
	copied: "_copied_qv86c_378",
	resultHint: "_resultHint_qv86c_384"
};
//#endregion
//#region src/components/FeedZ/FeedZ.jsx
function Js({ sources: e, hiddenSources: t, onToggleSource: n, viewState: r, showCount: i = !0 }) {
	if (!e || e.length === 0) return null;
	let a = t || /* @__PURE__ */ new Set();
	return /* @__PURE__ */ f("div", {
		className: Y.bar,
		children: [e.map((e) => /* @__PURE__ */ d(Ys, {
			source: e,
			hidden: a.has(e.id),
			onToggle: () => n && n(e.id),
			viewState: r,
			showCount: i
		}, e.id)), /* @__PURE__ */ d($s, {})]
	});
}
function Ys({ source: e, hidden: t, onToggle: n, viewState: r, showCount: i }) {
	let a = e.title || e.id, o = e.ok !== !1, s = r && r.sourceColor(e.id) || e.color;
	return /* @__PURE__ */ f("div", {
		className: `${Y.pill} ${t ? Y.hidden : ""} ${o ? "" : Y.failed}`,
		onClick: n,
		onKeyDown: (e) => {
			(e.key === "Enter" || e.key === " ") && (e.preventDefault(), n());
		},
		role: "button",
		tabIndex: 0,
		title: t ? `Show ${a}` : `Hide ${a}`,
		style: { "--pill-color": s },
		children: [
			/* @__PURE__ */ d(Qs, {
				color: s,
				sourceId: e.id,
				viewState: r
			}),
			/* @__PURE__ */ d("span", {
				className: Y.title,
				children: a
			}),
			i && /* @__PURE__ */ d("span", {
				className: Y.count,
				children: e.itemCount
			})
		]
	});
}
var Xs = [
	"#e74c3c",
	"#e67e22",
	"#f1c40f",
	"#2ecc71",
	"#1abc9c",
	"#3498db",
	"#9b59b6",
	"#e84393"
], Zs = 650;
function Qs({ color: e, sourceId: t, viewState: n }) {
	let [i, a] = s(!1), c = o(null);
	r(() => () => {
		c.current && clearTimeout(c.current);
	}, []);
	let l = (e) => {
		e.stopPropagation(), a(!0);
	}, p = (e) => {
		e && e.stopPropagation(), a(!1);
	}, m = () => {
		c.current = setTimeout(() => a(!0), Zs);
	}, h = () => {
		c.current &&= (clearTimeout(c.current), null);
	}, g = (e, r) => {
		r.stopPropagation(), n && n.setSourceColor(t, e), a(!1);
	}, _ = Xs.length;
	return /* @__PURE__ */ f("span", {
		className: Y.dotWrap,
		onMouseEnter: m,
		onMouseLeave: h,
		onClick: l,
		onTouchEnd: l,
		children: [/* @__PURE__ */ d("span", {
			className: `${Y.dot} ${i ? Y.dotActive : ""}`,
			"aria-hidden": "true"
		}), i && /* @__PURE__ */ f(u, { children: [/* @__PURE__ */ d("span", {
			className: Y.ringBackdrop,
			onClick: p,
			onTouchEnd: p
		}), /* @__PURE__ */ d("span", {
			className: Y.ring,
			children: Xs.map((t, n) => {
				let r = (_ === 1 ? 15 : 15 + n / (_ - 1) * 150) * Math.PI / 180, i = 30 * Math.cos(r), a = 30 * Math.sin(r);
				return /* @__PURE__ */ d("button", {
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
function $s() {
	let [e, t] = s(!1), [n, i] = s(""), [a, c] = s(null), l = o(null);
	r(() => {
		e && l.current && l.current.focus();
	}, [e]);
	let p = tc(n), m = (e) => {
		e && e.preventDefault(), p && (c(n.trim()), i(""), t(!1));
	}, h = () => {
		i(""), t(!1);
	};
	return /* @__PURE__ */ f(u, { children: [e ? /* @__PURE__ */ f("form", {
		className: `${Y.pill} ${Y.addOpen}`,
		onSubmit: m,
		children: [
			/* @__PURE__ */ d("input", {
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
			/* @__PURE__ */ d("button", {
				type: "button",
				className: Y.addClose,
				onClick: h,
				title: "Cancel",
				"aria-label": "Cancel",
				children: "×"
			}),
			/* @__PURE__ */ d("button", {
				type: "submit",
				className: `${Y.addSubmit} ${p ? Y.ready : ""}`,
				disabled: !p,
				title: p ? "Continue" : "Enter a URL first",
				"aria-label": "Add feed",
				children: "+"
			})
		]
	}) : /* @__PURE__ */ d("button", {
		className: `${Y.pill} ${Y.addPill}`,
		onClick: () => t(!0),
		title: "Add a feed",
		children: /* @__PURE__ */ d("span", {
			className: Y.plus,
			children: "+"
		})
	}), a && /* @__PURE__ */ d(ec, {
		url: a,
		onDismiss: () => c(null)
	})] });
}
function ec({ url: e, onDismiss: t }) {
	let [n, r] = s(""), i = rc(e), a = `node add-feed.js ${nc(e)}`, o = async (e, t) => {
		try {
			await navigator.clipboard.writeText(e), r(t), setTimeout(() => r((e) => e === t ? "" : e), 1500);
		} catch {}
	};
	return /* @__PURE__ */ f("div", {
		className: Y.resultPanel,
		children: [
			/* @__PURE__ */ d("button", {
				className: Y.resultClose,
				onClick: t,
				title: "Dismiss",
				"aria-label": "Dismiss",
				children: "×"
			}),
			/* @__PURE__ */ d("div", {
				className: Y.resultTitle,
				children: "Add this feed"
			}),
			/* @__PURE__ */ d("div", {
				className: Y.resultUrl,
				title: e,
				children: e
			}),
			/* @__PURE__ */ f("div", {
				className: Y.resultSection,
				children: [
					/* @__PURE__ */ d("div", {
						className: Y.resultLabel,
						children: "One-step (recommended)"
					}),
					/* @__PURE__ */ f("div", {
						className: Y.resultBox,
						children: [/* @__PURE__ */ d("code", {
							className: Y.code,
							children: a
						}), /* @__PURE__ */ d("button", {
							className: `${Y.copyBtn} ${n === "cli" ? Y.copied : ""}`,
							onClick: () => o(a, "cli"),
							children: n === "cli" ? "Copied" : "Copy"
						})]
					}),
					/* @__PURE__ */ d("div", {
						className: Y.resultHint,
						children: "Paste in your terminal — it appends to feeds.opml and rebuilds. Then refresh this page."
					})
				]
			}),
			/* @__PURE__ */ f("div", {
				className: Y.resultSection,
				children: [
					/* @__PURE__ */ d("div", {
						className: Y.resultLabel,
						children: "Or add manually"
					}),
					/* @__PURE__ */ f("div", {
						className: Y.resultBox,
						children: [/* @__PURE__ */ d("code", {
							className: Y.code,
							children: i
						}), /* @__PURE__ */ d("button", {
							className: `${Y.copyBtn} ${n === "opml" ? Y.copied : ""}`,
							onClick: () => o(i, "opml"),
							children: n === "opml" ? "Copied" : "Copy"
						})]
					}),
					/* @__PURE__ */ f("div", {
						className: Y.resultHint,
						children: [
							"Paste before ",
							/* @__PURE__ */ d("code", {
								className: Y.codeInline,
								children: "</body>"
							}),
							" ",
							"in feeds.opml, then run ",
							/* @__PURE__ */ d("code", {
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
function tc(e) {
	let t = (e || "").trim();
	if (!t) return !1;
	try {
		let e = new URL(t);
		return e.protocol === "http:" || e.protocol === "https:";
	} catch {
		return !1;
	}
}
function nc(e) {
	return `'${String(e).replace(/'/g, "'\\''")}'`;
}
function rc(e) {
	let t = e.replace(/"/g, "&quot;");
	return `<outline text="${ic(e)}" title="${ic(e)}" xmlUrl="${t}"/>`;
}
function ic(e) {
	try {
		return new URL(e).hostname.replace(/^www\./, "");
	} catch {
		return e;
	}
}
var X = {
	gearBtn: "_gearBtn_ofy97_17",
	backdrop: "_backdrop_ofy97_47",
	drawer: "_drawer_ofy97_54",
	ppSlideIn: "_ppSlideIn_ofy97_1",
	header: "_header_ofy97_82",
	title: "_title_ofy97_96",
	subject: "_subject_ofy97_101",
	closeBtn: "_closeBtn_ofy97_111",
	section: "_section_ofy97_125",
	sectionTitle: "_sectionTitle_ofy97_134",
	rowLabel: "_rowLabel_ofy97_143",
	choiceRow: "_choiceRow_ofy97_149",
	choices: "_choices_ofy97_157",
	choiceBtn: "_choiceBtn_ofy97_163",
	fontBtn: "_fontBtn_ofy97_164",
	resetBtn: "_resetBtn_ofy97_165",
	markActions: "_markActions_ofy97_166",
	presetBtn: "_presetBtn_ofy97_167",
	fontRow: "_fontRow_ofy97_180",
	aidOn: "_aidOn_ofy97_190",
	hint: "_hint_ofy97_195",
	hintLink: "_hintLink_ofy97_201",
	legend: "_legend_ofy97_205",
	aidList: "_aidList_ofy97_213",
	aidBtn: "_aidBtn_ofy97_219",
	aidLabel: "_aidLabel_ofy97_235",
	aidState: "_aidState_ofy97_243",
	aidHint: "_aidHint_ofy97_253",
	subjectBlock: "_subjectBlock_ofy97_260",
	subjectTitle: "_subjectTitle_ofy97_269",
	markItem: "_markItem_ofy97_274",
	markMain: "_markMain_ofy97_282",
	markTitle: "_markTitle_ofy97_287",
	markNote: "_markNote_ofy97_292",
	noteInput: "_noteInput_ofy97_304",
	noMarks: "_noMarks_ofy97_329",
	presetRow: "_presetRow_ofy97_335",
	presetActive: "_presetActive_ofy97_348",
	presetSwatches: "_presetSwatches_ofy97_353",
	miniSwatch: "_miniSwatch_ofy97_358",
	presetLabel: "_presetLabel_ofy97_365",
	fieldList: "_fieldList_ofy97_370",
	fieldRow: "_fieldRow_ofy97_376",
	fieldLabel: "_fieldLabel_ofy97_383",
	colorInput: "_colorInput_ofy97_388",
	hexLabel: "_hexLabel_ofy97_398"
}, ac = /* @__PURE__ */ p(((e, t) => {
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
})), oc = /* @__PURE__ */ p(((e, t) => {
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
})), sc = ac(), cc = oc(), lc = {
	draft: "#555555",
	published: "#2ecc71",
	tag: "#f39c12",
	topology: "#9b59b6",
	placeholder: "#7f8c8d"
};
function uc() {
	let e = typeof window < "u" && window.SETTINGS && window.SETTINGS.theme || {};
	return {
		...lc,
		...e.node_draft ? { draft: e.node_draft } : {},
		...e.node_published ? { published: e.node_published } : {},
		...e.tag_color ? { tag: e.tag_color } : {}
	};
}
function dc(e) {
	if (!e || !Array.isArray(e.items)) return null;
	let t = e.containers || [], n = (e) => t.some((t) => t.parent && t.tag && (e.tags || []).includes(t.tag)), r = /* @__PURE__ */ new Set(), i = new Set(e.items.map((e) => e.id));
	for (let t of e.items) n(t) || r.add(t._status === "published" ? "published" : "draft");
	for (let t of e.edges || []) t.layer === "tag" ? r.add("tag") : t.layer === "topology" ? r.add("topology") : t.layer === "authored" && !i.has(t.target) && r.add("placeholder");
	return r;
}
var fc = uc(), pc = [
	{
		id: "default",
		label: "Default",
		colors: fc
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
], mc = [
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
], hc = [
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
function gc({ on: e, onChange: t, label: n, hint: r, ...i }) {
	return /* @__PURE__ */ f("button", {
		className: `${X.aidBtn} ${e ? X.aidOn : ""}`,
		role: "switch",
		"aria-checked": e,
		onClick: () => t(!e),
		...i,
		children: [/* @__PURE__ */ f("span", {
			className: X.aidLabel,
			children: [n, /* @__PURE__ */ d("span", {
				className: X.aidState,
				children: e ? "on" : "off"
			})]
		}), r && /* @__PURE__ */ d("span", {
			className: X.aidHint,
			children: r
		})]
	});
}
function _c({ viewState: e, aid: t, label: n, hint: r }) {
	return /* @__PURE__ */ d(gc, {
		on: !!(e.readerAid && e.readerAid(t)),
		label: n,
		hint: r,
		"data-aid": t,
		onChange: (n) => e.setReaderAid && e.setReaderAid(t, n)
	});
}
function vc({ label: e, options: t, value: n, onChange: r, name: i }) {
	return /* @__PURE__ */ f("div", {
		className: X.choiceRow,
		role: "radiogroup",
		"aria-label": e,
		"data-choice": i,
		children: [/* @__PURE__ */ d("span", {
			className: X.rowLabel,
			children: e
		}), /* @__PURE__ */ d("span", {
			className: X.choices,
			children: t.map((e) => /* @__PURE__ */ d("button", {
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
function yc({ id: e, title: t, children: n }) {
	return /* @__PURE__ */ f("section", {
		className: X.section,
		"data-section": e,
		"aria-labelledby": `pp-settings-${e}`,
		children: [/* @__PURE__ */ d("h2", {
			className: X.sectionTitle,
			id: `pp-settings-${e}`,
			children: t
		}), n]
	});
}
var bc = (e, t) => {
	let n = e && Array.isArray(e.items) ? e.items.find((e) => e.id === t) : null;
	return n && n.title || "";
};
function xc(e, t) {
	return "#read=" + encodeURIComponent(e) + (t == null ? "" : "&p=" + t);
}
function Sc({ b: e, feedData: t, viewState: n }) {
	let [r, i] = s(!1), a = (0, sc.placedParagraph)(e, t && Array.isArray(t.items) ? t.items.find((t) => t.id === e.item) : null);
	return /* @__PURE__ */ f("div", {
		className: X.markItem,
		"data-bookmark-row": !0,
		children: [/* @__PURE__ */ f("div", {
			className: X.markMain,
			children: [/* @__PURE__ */ d("div", {
				className: X.markTitle,
				children: (0, sc.bookmarkLabel)(e, bc(t, e.item))
			}), r ? /* @__PURE__ */ d("input", {
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
			}) : /* @__PURE__ */ d("button", {
				className: X.markNote,
				onClick: () => i(!0),
				children: e.note || /* @__PURE__ */ d("em", { children: "Add a note" })
			})]
		}), /* @__PURE__ */ f("div", {
			className: X.markActions,
			children: [
				/* @__PURE__ */ d("button", {
					onClick: () => {
						window.location.hash = xc(e.item, a);
					},
					title: "Go back to this place",
					children: "Jump"
				}),
				/* @__PURE__ */ d("button", {
					onClick: async () => {
						try {
							await navigator.clipboard.writeText(window.location.href.split("#")[0] + xc(e.item, a));
						} catch {}
					},
					title: "Copy a link to this place",
					children: "Copy link"
				}),
				/* @__PURE__ */ d("button", {
					onClick: () => n.removeBookmark(e.id),
					title: "Delete this bookmark",
					"aria-label": "Delete bookmark",
					children: "Delete"
				})
			]
		})]
	});
}
function Cc({ viewState: e, feedData: t, subject: n, readerOpen: i }) {
	let [a, c] = s(!1), [, l] = s(0), p = o(null), m = o(null);
	if (r(() => {
		if (e) return e.subscribe(() => l((e) => e + 1));
	}, [e]), r(() => {
		if (typeof document > "u" || !e) return;
		let t = e.paragraphIndent ? e.paragraphIndent() : !1, n = e.paragraphSpace ? e.paragraphSpace() : !0, r = document.documentElement;
		r.setAttribute("data-pp-indent", t ? "on" : "off"), r.setAttribute("data-pp-space", n ? "on" : "off"), r.removeAttribute("data-pp-paragraph"), r.setAttribute("data-pp-font", e.readerAid ? e.readerAid("font") : "default"), r.setAttribute("data-pp-size", e.readerAid ? e.readerAid("size") : "m");
	}), r(() => {
		let e = (e) => {
			let t = e && e.detail || {};
			m.current = t.section || null, c((e) => t.open ? !0 : !e);
		};
		return window.addEventListener("postpipe:toggle-settings", e), () => window.removeEventListener("postpipe:toggle-settings", e);
	}, []), r(() => {
		if (!a) return;
		let e = (e) => {
			e.key === "Escape" && c(!1);
		};
		if (window.addEventListener("keydown", e), m.current && p.current) {
			let e = p.current.querySelector(`[data-section="${m.current}"]`);
			e && (p.current.scrollTop = e.offsetTop - 8), m.current = null;
		}
		return () => window.removeEventListener("keydown", e);
	}, [a]), !e) return null;
	let h = (0, ys.readerFonts)(typeof window < "u" ? window.SETTINGS : null), g = e.readerAid ? e.readerAid("font") : "default", _ = e.readerAid ? e.readerAid("size") : "m", v = {
		...fc,
		...e.graphColors()
	}, y = e.colorProfileId(), b = dc(t), x = b ? mc.filter((e) => b.has(e.key)) : mc, S = !!(t && Array.isArray(t.containers) && t.containers.length), C = typeof window < "u" && !!window.TTS, w = n ? n.id : null, T = e.bookmarks(), E = w ? e.bookmarks(w) : [], D = T.filter((e) => e.item !== w), O = n && n._posted !== "title", k = !!(n && i && i === w);
	return /* @__PURE__ */ f(u, { children: [/* @__PURE__ */ d("button", {
		className: X.gearBtn,
		onClick: () => c((e) => !e),
		title: "Settings",
		"aria-label": "Settings",
		"aria-expanded": a,
		"data-settings-gear": !0,
		children: "⚙"
	}), a && /* @__PURE__ */ f(u, { children: [/* @__PURE__ */ d("div", {
		className: X.backdrop,
		onClick: () => c(!1)
	}), /* @__PURE__ */ f("aside", {
		className: X.drawer,
		role: "dialog",
		"aria-label": "Settings",
		ref: p,
		"data-settings-panel": !0,
		children: [
			/* @__PURE__ */ f("div", {
				className: X.header,
				children: [
					/* @__PURE__ */ d("span", {
						className: X.title,
						children: "Settings"
					}),
					n && /* @__PURE__ */ d("span", {
						className: X.subject,
						"data-settings-subject": !0,
						children: n.title
					}),
					/* @__PURE__ */ d("button", {
						className: X.closeBtn,
						onClick: () => c(!1),
						"aria-label": "Close",
						children: "×"
					})
				]
			}),
			/* @__PURE__ */ f(yc, {
				id: "reading",
				title: "Reading",
				children: [
					/* @__PURE__ */ d("div", {
						className: X.fontRow,
						role: "radiogroup",
						"aria-label": "Font",
						children: h.map((t) => /* @__PURE__ */ d("button", {
							role: "radio",
							"aria-checked": g === t.id,
							"data-font": t.id,
							className: `${X.fontBtn} ${g === t.id ? X.aidOn : ""}`,
							style: { fontFamily: t.family },
							onClick: () => e.setReaderAid && e.setReaderAid("font", t.id),
							children: t.label
						}, t.id))
					}),
					h.filter((e) => e.license).map((e) => /* @__PURE__ */ f("div", {
						className: X.hint,
						children: [
							e.label,
							" is under the ",
							/* @__PURE__ */ d("a", {
								className: X.hintLink,
								href: `./fonts/${e.license}`,
								target: "_blank",
								rel: "noopener",
								children: e.licenseName
							}),
							"."
						]
					}, e.id)),
					/* @__PURE__ */ d(vc, {
						label: "Size",
						name: "size",
						options: hc,
						value: _,
						onChange: (t) => e.setReaderAid("size", t)
					}),
					/* @__PURE__ */ f("div", {
						className: X.choiceRow,
						children: [/* @__PURE__ */ d("span", {
							className: X.rowLabel,
							children: "Paragraphs"
						}), /* @__PURE__ */ f("span", {
							className: X.choices,
							children: [/* @__PURE__ */ d("button", {
								className: `${X.choiceBtn} ${e.paragraphIndent() ? X.aidOn : ""}`,
								"aria-pressed": e.paragraphIndent(),
								onClick: () => e.setParagraphIndent(!e.paragraphIndent()),
								children: "Indent first line"
							}), /* @__PURE__ */ d("button", {
								className: `${X.choiceBtn} ${e.paragraphSpace() ? X.aidOn : ""}`,
								"aria-pressed": e.paragraphSpace(),
								onClick: () => e.setParagraphSpace(!e.paragraphSpace()),
								children: "Space between"
							})]
						})]
					}),
					/* @__PURE__ */ f("div", {
						className: X.aidList,
						children: [/* @__PURE__ */ d(_c, {
							viewState: e,
							aid: "followAlong",
							label: "Highlighter: follow along",
							hint: "Tap or drag through the text to mark the sentence and word you are on."
						}), /* @__PURE__ */ d(_c, {
							viewState: e,
							aid: "boldStart",
							label: "Bold word beginnings",
							hint: "The first part of each word is bold, to lead the eye. The text itself is unchanged."
						})]
					})
				]
			}),
			C && /* @__PURE__ */ f(yc, {
				id: "listening",
				title: "Listening",
				children: [/* @__PURE__ */ d(qs, {}), /* @__PURE__ */ d("div", {
					className: X.hint,
					children: "Play and pause are in the reader."
				})]
			}),
			/* @__PURE__ */ f(yc, {
				id: "place",
				title: "Your place",
				children: [
					/* @__PURE__ */ f("div", {
						className: X.legend,
						"data-bookmark-legend": !0,
						children: [
							/* @__PURE__ */ d("strong", { children: "Mark here" }),
							", in the reader, saves the paragraph at the top of the reader; a ribbon in the margin shows it, and tapping it again removes it. Each saved place below has ",
							/* @__PURE__ */ d("em", { children: "Jump" }),
							" (go back to it), ",
							/* @__PURE__ */ d("em", { children: "Copy link" }),
							" and ",
							/* @__PURE__ */ d("em", { children: "Delete" }),
							". Tap a note to write one."
						]
					}),
					n ? /* @__PURE__ */ f("div", {
						className: X.subjectBlock,
						"data-place-subject": !0,
						children: [
							/* @__PURE__ */ d("div", {
								className: X.subjectTitle,
								children: n.title
							}),
							O && e.readingProgress && (() => {
								let t = e.readingProgress(n.id), r = t.done ? "Read to the end" : t.max > 0 ? `Read ${Math.round(t.max * 100)}%` : t.seen ? "Opened" : "Not opened yet";
								return /* @__PURE__ */ d("div", {
									className: X.hint,
									"data-place-progress": !0,
									children: r
								});
							})(),
							/* @__PURE__ */ f("div", {
								className: X.choices,
								children: [O && !k && /* @__PURE__ */ d("button", {
									className: X.choiceBtn,
									onClick: () => {
										c(!1), window.location.hash = xc(n.id, null);
									},
									children: "Read"
								}), k && /* @__PURE__ */ d("button", {
									className: `${X.choiceBtn} ${E.length ? X.aidOn : ""}`,
									"aria-pressed": E.length > 0,
									"data-place-mark": !0,
									onClick: () => window.dispatchEvent(new CustomEvent("postpipe:reader-mark")),
									children: E.length ? "Marked" : "Mark here"
								})]
							}),
							E.map((n) => /* @__PURE__ */ d(Sc, {
								b: n,
								feedData: t,
								viewState: e
							}, n.id)),
							E.length === 0 && /* @__PURE__ */ d("div", {
								className: X.hint,
								children: "No bookmarks in this one yet."
							})
						]
					}) : /* @__PURE__ */ d("div", {
						className: X.hint,
						children: "Open a chapter, or tap one on the graph, to see your place in it."
					}),
					D.length > 0 && /* @__PURE__ */ f(u, { children: [/* @__PURE__ */ d("div", {
						className: X.rowLabel,
						children: n ? "Elsewhere" : "All bookmarks"
					}), D.map((n) => /* @__PURE__ */ d(Sc, {
						b: n,
						feedData: t,
						viewState: e
					}, n.id))] }),
					T.length === 0 && !n && /* @__PURE__ */ d("div", {
						className: X.noMarks,
						children: "No bookmarks yet."
					})
				]
			}),
			/* @__PURE__ */ f(yc, {
				id: "view",
				title: "View",
				children: [
					(() => {
						let t = typeof window < "u" ? window.SETTINGS : null, n = (0, cc.themeName)(t, e.preference("theme")), r = cc.THEMES[n].modes, i = e.preference("mode");
						return /* @__PURE__ */ f(u, { children: [/* @__PURE__ */ d(vc, {
							label: "Theme",
							name: "theme",
							options: Object.values(cc.THEMES).map((e) => ({
								id: e.id,
								label: e.label
							})),
							value: n,
							onChange: (n) => e.setPreference("theme", n === (0, cc.themeName)(t, null) ? null : n)
						}), r.length > 1 && /* @__PURE__ */ d(vc, {
							label: "Light",
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
					(0, as.config)(typeof window < "u" ? window.SETTINGS : null) && /* @__PURE__ */ d(gc, {
						on: e.preference("timeOfDay") !== !1,
						onChange: (t) => e.setPreference("timeOfDay", t ? null : !1),
						label: "Time of day background",
						hint: "The page behind the graph takes on the light of the chapter's time of day, tinted by its season.",
						"data-pref": "timeOfDay"
					}),
					S && /* @__PURE__ */ f("div", {
						className: X.choiceRow,
						children: [/* @__PURE__ */ d("span", {
							className: X.rowLabel,
							children: "Containers"
						}), /* @__PURE__ */ f("span", {
							className: X.choices,
							children: [/* @__PURE__ */ d("button", {
								className: X.choiceBtn,
								onClick: () => window.dispatchEvent(new CustomEvent("graph:open-all-containers")),
								children: "Open all"
							}), /* @__PURE__ */ d("button", {
								className: X.choiceBtn,
								onClick: () => window.dispatchEvent(new CustomEvent("graph:close-all-containers")),
								children: "Close all"
							})]
						})]
					}),
					x.length > 0 && /* @__PURE__ */ f(u, { children: [
						/* @__PURE__ */ d("div", {
							className: X.rowLabel,
							children: "Colors"
						}),
						/* @__PURE__ */ d("div", {
							className: X.presetRow,
							children: pc.map((t) => /* @__PURE__ */ f("button", {
								className: `${X.presetBtn} ${y === t.id ? X.presetActive : ""}`,
								onClick: () => e.applyColorProfile(t.id, t.colors),
								title: t.label,
								children: [/* @__PURE__ */ d("span", {
									className: X.presetSwatches,
									children: x.map((e) => /* @__PURE__ */ d("span", {
										className: X.miniSwatch,
										style: { background: t.colors[e.key] }
									}, e.key))
								}), /* @__PURE__ */ d("span", {
									className: X.presetLabel,
									children: t.label
								})]
							}, t.id))
						}),
						/* @__PURE__ */ d("div", {
							className: X.fieldList,
							children: x.map((t) => /* @__PURE__ */ f("label", {
								className: X.fieldRow,
								children: [
									/* @__PURE__ */ d("span", {
										className: X.fieldLabel,
										children: t.label
									}),
									/* @__PURE__ */ d("input", {
										type: "color",
										className: X.colorInput,
										value: v[t.key],
										onChange: (n) => e.setGraphColor(t.key, n.target.value)
									}),
									/* @__PURE__ */ d("span", {
										className: X.hexLabel,
										children: v[t.key]
									})
								]
							}, t.key))
						})
					] }),
					/* @__PURE__ */ d("button", {
						className: X.resetBtn,
						"data-settings-reset": !0,
						title: "Layout, zoom, rotation, open and closed containers, selection and colors, back to how the site starts",
						onClick: () => {
							c(!1), x.length && e.applyColorProfile("default", fc), window.dispatchEvent(new CustomEvent("graph:reset-all"));
						},
						children: "Reset the view"
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
}, wc = {
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
}, Tc = [
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
], Ec = [
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
], Dc = [
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
function Oc({ config: e, onUpdate: t, onReset: i, visible: a = !0 }) {
	let [c, l] = s(!1), [p, m] = s(null), [h, g] = s(!1), _ = o(null), v = o(null), y = o(null), b = (e) => {
		v.current = e.touches[0].clientY;
	}, x = (e) => {
		if (v.current === null) return;
		let t = e.touches[0].clientY - v.current;
		y.current && y.current.scrollTop > 0 || t > 80 && (l(!1), v.current = null);
	}, S = () => {
		v.current = null;
	};
	r(() => {
		if (!c) return;
		let e = (e) => {
			e.key === "Escape" && l(!1);
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [c]);
	let C = {
		...wc,
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
		let t = jc(e);
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
	return a ? /* @__PURE__ */ f(u, { children: [
		/* @__PURE__ */ d("button", {
			className: `${Z.triggerBtn} ${c ? Z.open : ""}`,
			onClick: () => l((e) => !e),
			title: "Configure viewer",
			"aria-label": "Configure viewer",
			children: "⚡"
		}),
		c && /* @__PURE__ */ f(u, { children: [/* @__PURE__ */ d("div", {
			className: Z.backdrop,
			onClick: () => l(!1)
		}), /* @__PURE__ */ f("div", {
			className: Z.panel,
			role: "dialog",
			"aria-label": "Viewer Configuration",
			ref: y,
			onTouchStart: b,
			onTouchMove: x,
			onTouchEnd: S,
			children: [
				/* @__PURE__ */ f("div", {
					className: Z.header,
					children: [/* @__PURE__ */ d("span", {
						className: Z.panelTitle,
						children: "Viewer Configuration"
					}), /* @__PURE__ */ d("button", {
						className: Z.closeBtn,
						onClick: () => l(!1),
						"aria-label": "Close",
						children: "×"
					})]
				}),
				/* @__PURE__ */ f("div", {
					className: Z.section,
					children: [/* @__PURE__ */ d("div", {
						className: Z.sectionTitle,
						children: "Features"
					}), Tc.map((e) => /* @__PURE__ */ d(kc, {
						label: e.label,
						sub: e.sub,
						checked: C[e.key],
						onChange: (t) => T(e.key, t)
					}, e.key))]
				}),
				/* @__PURE__ */ f("div", {
					className: Z.section,
					children: [
						/* @__PURE__ */ d("div", {
							className: Z.sectionTitle,
							children: "Data"
						}),
						/* @__PURE__ */ d("div", {
							className: Z.textInputRow,
							children: /* @__PURE__ */ d("input", {
								type: "url",
								className: Z.textInput,
								placeholder: "Feed URL (default: ./feed.json)",
								value: e.feed || "",
								onChange: (e) => O(e.target.value)
							})
						}),
						/* @__PURE__ */ f("div", {
							className: Z.selectRow,
							children: [/* @__PURE__ */ d("span", {
								className: Z.toggleLabel,
								children: "Persistence"
							}), /* @__PURE__ */ d("select", {
								className: Z.select,
								value: e.persistence || "localStorage",
								onChange: (e) => D(e.target.value),
								children: Dc.map((e) => /* @__PURE__ */ d("option", {
									value: e.value,
									children: e.label
								}, e.value))
							})]
						})
					]
				}),
				/* @__PURE__ */ f("div", {
					className: Z.section,
					children: [/* @__PURE__ */ d("div", {
						className: Z.sectionTitle,
						children: "Theme"
					}), Ec.map((e) => /* @__PURE__ */ f("div", {
						className: Z.colorRow,
						children: [
							/* @__PURE__ */ d("span", {
								className: Z.colorLabel,
								children: e.label
							}),
							/* @__PURE__ */ d("input", {
								type: "color",
								className: Z.colorInput,
								value: w[e.key] || Ac(e.key),
								onChange: (t) => E(e.key, t.target.value)
							}),
							/* @__PURE__ */ d("span", {
								className: Z.colorHex,
								children: w[e.key] || Ac(e.key)
							})
						]
					}, e.key))]
				}),
				/* @__PURE__ */ f("div", {
					className: Z.section,
					children: [
						/* @__PURE__ */ d("div", {
							className: Z.sectionTitle,
							children: "Actions"
						}),
						/* @__PURE__ */ f("div", {
							className: Z.actions,
							children: [
								/* @__PURE__ */ d("button", {
									className: Z.actionBtnAccent,
									onClick: k,
									children: "Export Config"
								}),
								/* @__PURE__ */ d("button", {
									className: Z.actionBtn,
									onClick: A,
									children: "Import Config"
								}),
								/* @__PURE__ */ d("button", {
									className: Z.actionBtnDanger,
									onClick: i,
									children: "Reset All"
								})
							]
						}),
						/* @__PURE__ */ d("input", {
							ref: _,
							type: "file",
							accept: ".json",
							style: { display: "none" },
							onChange: ee
						}),
						h && /* @__PURE__ */ d("div", {
							className: Z.snippet,
							children: /* @__PURE__ */ d("code", {
								className: Z.snippetCode,
								children: jc(e)
							})
						}),
						!h && /* @__PURE__ */ d("button", {
							className: Z.actionBtn,
							onClick: () => g(!0),
							style: {
								marginTop: "6px",
								width: "100%"
							},
							children: "Show Embed Snippet"
						}),
						h && /* @__PURE__ */ d("button", {
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
		p && /* @__PURE__ */ d("div", {
			className: Z.toast,
			children: p
		})
	] }) : null;
}
function kc({ label: e, sub: t, checked: n, onChange: r }) {
	return /* @__PURE__ */ f("div", {
		className: Z.toggleRow,
		children: [/* @__PURE__ */ f("span", {
			className: Z.toggleLabel,
			children: [e, t && /* @__PURE__ */ d("span", {
				className: Z.toggleSub,
				children: t
			})]
		}), /* @__PURE__ */ f("label", {
			className: Z.switch,
			children: [/* @__PURE__ */ d("input", {
				type: "checkbox",
				className: Z.switchInput,
				checked: n,
				onChange: (e) => r(e.target.checked)
			}), /* @__PURE__ */ d("span", { className: Z.switchTrack })]
		})]
	});
}
function Ac(e) {
	return {
		bg: "#1a1a2e",
		surface: "#0a0e1a",
		accent: "#64ffda",
		text: "#a8b2d1",
		text_bright: "#ccd6f6"
	}[e] || "#888888";
}
function jc(e) {
	let t = {};
	if (e.feed && e.feed !== "./feed.json" && (t.feed = e.feed), e.persistence && e.persistence !== "localStorage" && (t.persistence = e.persistence), e.features) {
		let n = {};
		for (let [t, r] of Object.entries(e.features)) r !== wc[t] && (n[t] = r);
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
}, Mc = [
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
function Nc(e) {
	return (e.url || e.id || "").split("/").pop().replace(".html", "");
}
function Pc({ feedData: e, onFilterChange: t }) {
	let [n, r] = s(null), a = i(() => {
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
			let o = Nc(e);
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
				monthName: Mc[n],
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
	let o = (e) => {
		e.articleSlugs.length !== 0 && (n === e.key ? (r(null), t && t(null, null)) : (r(e.key), t && t(new Set(e.articleSlugs), `${e.monthName} ${e.year}`)));
	}, c = (e, i, a) => {
		e.stopPropagation(), i.articleSlugs.length !== 0 && (n === i.id ? (r(null), t && t(null, null)) : (r(i.id), t && t(new Set(i.articleSlugs), `${a.monthName} ${i.label}`)));
	};
	return /* @__PURE__ */ f("div", {
		className: Q.timeOverlay,
		children: [/* @__PURE__ */ f("div", {
			className: Q.header,
			children: [/* @__PURE__ */ f("div", {
				className: Q.titleGroup,
				children: [/* @__PURE__ */ d("span", {
					className: Q.title,
					children: "Chronology"
				}), /* @__PURE__ */ d("span", {
					className: Q.rangeBadge,
					children: a.minYear === a.maxYear ? a.minYear : `${a.minYear}–${a.maxYear}`
				})]
			}), n && /* @__PURE__ */ d("button", {
				className: Q.clearBtn,
				onClick: () => {
					r(null), t && t(null, null);
				},
				title: "Show all posts",
				children: "Reset"
			})]
		}), /* @__PURE__ */ d("div", {
			className: Q.stackScroll,
			children: a.months.map((e, t) => {
				let r = n === e.key, i = e.articleSlugs.length === 0, s = a.months[t - 1], l = !s || s.year !== e.year;
				return /* @__PURE__ */ f("div", {
					className: `${Q.monthBox} ${i ? Q.emptyMonth : ""} ${r ? Q.activeMonth : ""}`,
					children: [/* @__PURE__ */ f("div", {
						className: Q.monthHeader,
						onClick: () => o(e),
						title: i ? "No articles published this month" : `Filter to ${e.monthName} ${e.year} (${e.articleSlugs.length})`,
						children: [/* @__PURE__ */ f("div", {
							className: Q.monthName,
							children: [e.monthName, l && /* @__PURE__ */ d("span", {
								className: Q.yearTag,
								children: e.year
							})]
						}), /* @__PURE__ */ d("div", {
							className: `${Q.monthMeta} ${e.articleSlugs.length > 0 ? Q.hasItems : ""}`,
							children: e.articleSlugs.length > 0 ? `${e.articleSlugs.length} post${e.articleSlugs.length > 1 ? "s" : ""}` : "0 posts"
						})]
					}), /* @__PURE__ */ f("div", {
						className: Q.branchArea,
						children: [/* @__PURE__ */ d("div", { className: Q.branchLine }), /* @__PURE__ */ d("div", {
							className: Q.weeksRow,
							children: e.weeks.map((t) => {
								let r = t.articleSlugs.length, i = n === t.id;
								return /* @__PURE__ */ f("div", {
									className: `${Q.weekPill} ${r > 0 ? Q.hasContent : ""} ${i ? Q.activeWeek : ""}`,
									onClick: (n) => c(n, t, e),
									title: r > 0 ? `${t.label}: ${r} post${r > 1 ? "s" : ""}` : `${t.label}: empty`,
									children: [/* @__PURE__ */ d("span", { children: t.label }), r > 0 && /* @__PURE__ */ d("span", {
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
	bar: "_bar_8ulv5_4",
	group: "_group_8ulv5_17",
	spacer: "_spacer_8ulv5_31",
	label: "_label_8ulv5_36",
	seg: "_seg_8ulv5_44",
	icon: "_icon_8ulv5_45",
	action: "_action_8ulv5_46",
	on: "_on_8ulv5_75",
	moreMark: "_moreMark_8ulv5_89",
	backdrop: "_backdrop_8ulv5_96",
	sheet: "_sheet_8ulv5_103",
	sectionTitle: "_sectionTitle_8ulv5_124",
	wrapRow: "_wrapRow_8ulv5_132",
	narrowOnly: "_narrowOnly_8ulv5_146",
	wideOnly: "_wideOnly_8ulv5_151",
	moreText: "_moreText_8ulv5_170",
	more: "_more_8ulv5_89"
}, Fc = (/* @__PURE__ */ p(((e, t) => {
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
	], r = {
		time: (e) => `${e}: the date each piece was published`,
		commits: (e) => `Edit history: one link per bucket of ${e}`,
		narrative: (e) => `${e}: reading order, 0 to 1`,
		chronology: (e) => `${e}: position in story-world time`
	};
	function i(e) {
		let t = e && e.dimensions && e.dimensions.labels || {};
		return n.map((e) => {
			let n = t[e.id];
			if (typeof n == "string" && n.trim()) {
				let t = n.trim();
				return {
					...e,
					label: t,
					title: r[e.id](t)
				};
			}
			if (n && typeof n == "object") {
				let t = n.label && String(n.label).trim() || e.label, i = n.title && String(n.title).trim() || (t === e.label ? e.title : r[e.id](t));
				return {
					...e,
					label: t,
					title: i
				};
			}
			return { ...e };
		});
	}
	t.exports = {
		dimensionLabels: i,
		DIMENSIONS: n
	};
})))(), Ic = [{
	id: "force",
	label: "cluster",
	title: "Cluster: each container its own path"
}, {
	id: "radial",
	label: "ring",
	title: "Ring: each container its own ring"
}], Lc = [
	"auto",
	"day",
	"week",
	"month",
	"year"
], Rc = [
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
], zc = (e) => window.dispatchEvent(new CustomEvent(e));
function Bc({ viewState: e, show: t = {}, layouts: n = Ic, settings: i }) {
	let o = (0, Fc.dimensionLabels)(i || (typeof window < "u" ? window.SETTINGS : null)), [, c] = a((e) => e + 1, 0), [l, p] = s(!1);
	if (r(() => e ? e.subscribe(c) : void 0, [e]), r(() => {
		if (!l) return;
		let e = (e) => {
			e.key === "Escape" && p(!1);
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [l]), !e) return null;
	let m = t.history !== !1, h = t.layout !== !1, g = t.dimensions !== !1, _ = e.state.layout, v = e.timeAxis(), y = v.dimension || "time", b = (t) => {
		v.on && y === t ? e.setTimeAxis({ on: !1 }) : e.setTimeAxis({
			on: !0,
			dimension: t
		});
	}, x = () => {
		let t = Lc.indexOf(v.granularity || "auto");
		e.setTimeAxis({ granularity: Lc[(t + 1) % Lc.length] });
	}, S = v.on && (v.dimension === "chronology" || v.dimension === "commits"), C = /* @__PURE__ */ f(u, { children: [o.map((e) => {
		let t = v.on && y === e.id;
		return /* @__PURE__ */ d("button", {
			className: `${$.seg} ${t ? $.on : ""}`,
			"aria-pressed": t,
			title: e.title,
			onClick: () => b(e.id),
			children: e.label
		}, e.id);
	}), S && /* @__PURE__ */ f("button", {
		className: $.seg,
		title: "Bucket size: auto, day, week, month, year",
		onClick: x,
		children: ["· ", v.granularity || "auto"]
	})] });
	return /* @__PURE__ */ f(u, { children: [/* @__PURE__ */ f("div", {
		className: $.bar,
		role: "toolbar",
		"aria-label": "Graph controls",
		"data-toolbar": !0,
		children: [
			m && /* @__PURE__ */ f("div", {
				className: $.group,
				"data-group": "history",
				children: [/* @__PURE__ */ d("button", {
					className: $.icon,
					title: "Undo (Cmd+Z)",
					"aria-label": "Undo",
					disabled: !e.canUndo,
					onClick: () => e.undo(),
					children: "↩"
				}), /* @__PURE__ */ d("button", {
					className: $.icon,
					title: "Redo (Cmd+Shift+Z)",
					"aria-label": "Redo",
					disabled: !e.canRedo,
					onClick: () => e.redo(),
					children: "↪"
				})]
			}),
			h && /* @__PURE__ */ f("div", {
				className: $.group,
				"data-group": "layout",
				role: "radiogroup",
				"aria-label": "Layout",
				children: [/* @__PURE__ */ d("span", {
					className: $.label,
					children: "layout"
				}), n.map((t) => {
					let n = _ === t.id;
					return /* @__PURE__ */ d("button", {
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
			g && /* @__PURE__ */ f("div", {
				className: `${$.group} ${$.wideOnly}`,
				"data-group": "dimensions",
				"aria-label": "Dimensions",
				children: [/* @__PURE__ */ d("span", {
					className: $.label,
					children: "dimensions"
				}), C]
			}),
			/* @__PURE__ */ d("div", { className: $.spacer }),
			/* @__PURE__ */ f("div", {
				className: $.group,
				"data-group": "view",
				children: [/* @__PURE__ */ d("button", {
					className: $.seg,
					title: "Reset: layout, zoom, rotation, open and closed containers, and selection, back to how the site starts (Undo brings the arrangement back)",
					"data-toolbar-reset": !0,
					onClick: () => {
						p(!1), zc("graph:reset-all");
					},
					children: "Reset"
				}), /* @__PURE__ */ f("button", {
					className: `${$.seg} ${$.more} ${l ? $.on : ""}`,
					"aria-expanded": l,
					"aria-controls": "pp-toolbar-more",
					title: "More: dimensions and view actions",
					"aria-label": "More",
					"data-toolbar-more": !0,
					onClick: () => p((e) => !e),
					children: [/* @__PURE__ */ d("span", {
						className: $.moreText,
						children: "More "
					}), /* @__PURE__ */ d("span", {
						"aria-hidden": "true",
						className: $.moreMark,
						children: l ? "▾" : "▴"
					})]
				})]
			})
		]
	}), l && /* @__PURE__ */ f(u, { children: [/* @__PURE__ */ d("div", {
		className: $.backdrop,
		onClick: () => p(!1)
	}), /* @__PURE__ */ f("div", {
		className: $.sheet,
		id: "pp-toolbar-more",
		role: "dialog",
		"aria-label": "More graph controls",
		"data-toolbar-sheet": !0,
		children: [g && /* @__PURE__ */ f("div", {
			className: `${$.section} ${$.narrowOnly}`,
			children: [/* @__PURE__ */ d("div", {
				className: $.sectionTitle,
				children: "Dimensions"
			}), /* @__PURE__ */ d("div", {
				className: $.wrapRow,
				children: C
			})]
		}), /* @__PURE__ */ f("div", {
			className: $.section,
			children: [/* @__PURE__ */ d("div", {
				className: $.sectionTitle,
				children: "View"
			}), /* @__PURE__ */ d("div", {
				className: $.wrapRow,
				children: Rc.map((e) => /* @__PURE__ */ d("button", {
					className: $.action,
					title: e.title,
					onClick: () => {
						zc(e.event), p(!1);
					},
					children: e.label
				}, e.event))
			})]
		})]
	})] })] });
}
//#endregion
//#region src/components/TimeOfDay/TimeOfDay.jsx
function Vc() {
	let e = () => typeof document < "u" && document.documentElement.getAttribute("data-pp-mode") || "dark", [t, n] = s(e);
	return r(() => {
		let t = new MutationObserver(() => n(e()));
		return t.observe(document.documentElement, {
			attributes: !0,
			attributeFilter: ["data-pp-mode"]
		}), () => t.disconnect();
	}, []), t;
}
var Hc = {
	position: "fixed",
	inset: 0,
	zIndex: -1,
	pointerEvents: "none"
};
function Uc({ item: e, settings: t, viewState: n }) {
	let i = (0, as.config)(t), [, a] = s(0);
	r(() => n ? n.subscribe(() => a((e) => e + 1)) : void 0, [n]);
	let c = Vc(), l = !n || !n.preference || n.preference("timeOfDay") !== !1, f = i && l ? (0, as.ambienceFor)(e, i, c) : null, p = f ? `${f.top}|${f.bottom}` : "", [m, h] = s([null, null]), [g, _] = s(0), v = o("");
	if (r(() => {
		if (p === v.current) return;
		v.current = p;
		let e = 1 - g;
		h((t) => {
			let n = t.slice();
			return n[e] = f, n;
		});
		let t = requestAnimationFrame(() => requestAnimationFrame(() => _(e)));
		return () => cancelAnimationFrame(t);
	}, [p]), r(() => {
		let e = document.documentElement;
		f ? (e.setAttribute("data-pp-tod", f.time), f.season ? e.setAttribute("data-pp-season", f.season) : e.removeAttribute("data-pp-season")) : (e.removeAttribute("data-pp-tod"), e.removeAttribute("data-pp-season"));
	}, [p]), !i) return null;
	let y = i.transitionSeconds;
	return /* @__PURE__ */ d(u, { children: m.map((e, t) => /* @__PURE__ */ d("div", {
		"aria-hidden": "true",
		"data-tod-layer": t === g && e ? "front" : "back",
		"data-tod-time": e ? e.time : "",
		style: {
			...Hc,
			background: e ? `linear-gradient(180deg, ${e.top} 0%, ${e.bottom} 100%)` : "transparent",
			opacity: t === g && e ? 1 : 0,
			transition: `opacity ${y}s ease-in-out`
		}
	}, t)) });
}
//#endregion
//#region src/components/Theme/Theme.jsx
function Wc({ settings: e, viewState: t }) {
	let [, n] = s(0), i = typeof window < "u" && window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null, [a, o] = s(i ? i.matches : !0);
	r(() => t ? t.subscribe(() => n((e) => e + 1)) : void 0, [t]), r(() => {
		if (!i) return;
		let e = (e) => o(e.matches);
		return i.addEventListener ? i.addEventListener("change", e) : i.addListener(e), () => {
			i.removeEventListener ? i.removeEventListener("change", e) : i.removeListener(e);
		};
	}, []);
	let c = (0, cc.themeName)(e, t && t.preference ? t.preference("theme") : null), l = (0, cc.themeMode)(c, t && t.preference ? t.preference("mode") : null, a);
	return r(() => {
		let e = document.documentElement;
		e.getAttribute("data-pp-theme") !== c && e.setAttribute("data-pp-theme", c), e.getAttribute("data-pp-mode") !== l && e.setAttribute("data-pp-mode", l), e.style.colorScheme = l;
	}, [c, l]), null;
}
//#endregion
export { Oc as ConfigPanel, Js as FeedZ, ps as GraphViewer, e as React, c as ReactDOM, zs as ReaderPanel, Cc as Settings, Ks as TTS, Wc as Theme, Uc as TimeOfDay, Pc as TimeOverlay, Bc as Toolbar };
