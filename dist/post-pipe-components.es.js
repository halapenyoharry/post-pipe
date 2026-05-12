import e, { useEffect as t, useRef as n, useState as r } from "react";
//#region \0rolldown/runtime.js
var i = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), a = /* @__PURE__ */ ((e) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(e, { get: (e, t) => (typeof require < "u" ? require : e)[t] }) : e)(function(e) {
	if (typeof require < "u") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + e + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
}), o = { value: () => {} };
function s() {
	for (var e = 0, t = arguments.length, n = {}, r; e < t; ++e) {
		if (!(r = arguments[e] + "") || r in n || /[\s.]/.test(r)) throw Error("illegal type: " + r);
		n[r] = [];
	}
	return new c(n);
}
function c(e) {
	this._ = e;
}
function l(e, t) {
	return e.trim().split(/^|\s+/).map(function(e) {
		var n = "", r = e.indexOf(".");
		if (r >= 0 && (n = e.slice(r + 1), e = e.slice(0, r)), e && !t.hasOwnProperty(e)) throw Error("unknown type: " + e);
		return {
			type: e,
			name: n
		};
	});
}
c.prototype = s.prototype = {
	constructor: c,
	on: function(e, t) {
		var n = this._, r = l(e + "", n), i, a = -1, o = r.length;
		if (arguments.length < 2) {
			for (; ++a < o;) if ((i = (e = r[a]).type) && (i = u(n[i], e.name))) return i;
			return;
		}
		if (t != null && typeof t != "function") throw Error("invalid callback: " + t);
		for (; ++a < o;) if (i = (e = r[a]).type) n[i] = d(n[i], e.name, t);
		else if (t == null) for (i in n) n[i] = d(n[i], e.name, null);
		return this;
	},
	copy: function() {
		var e = {}, t = this._;
		for (var n in t) e[n] = t[n].slice();
		return new c(e);
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
function u(e, t) {
	for (var n = 0, r = e.length, i; n < r; ++n) if ((i = e[n]).name === t) return i.value;
}
function d(e, t, n) {
	for (var r = 0, i = e.length; r < i; ++r) if (e[r].name === t) {
		e[r] = o, e = e.slice(0, r).concat(e.slice(r + 1));
		break;
	}
	return n != null && e.push({
		name: t,
		value: n
	}), e;
}
var f = {
	svg: "http://www.w3.org/2000/svg",
	xhtml: "http://www.w3.org/1999/xhtml",
	xlink: "http://www.w3.org/1999/xlink",
	xml: "http://www.w3.org/XML/1998/namespace",
	xmlns: "http://www.w3.org/2000/xmlns/"
};
//#endregion
//#region node_modules/d3-selection/src/namespace.js
function p(e) {
	var t = e += "", n = t.indexOf(":");
	return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), f.hasOwnProperty(t) ? {
		space: f[t],
		local: e
	} : e;
}
//#endregion
//#region node_modules/d3-selection/src/creator.js
function m(e) {
	return function() {
		var t = this.ownerDocument, n = this.namespaceURI;
		return n === "http://www.w3.org/1999/xhtml" && t.documentElement.namespaceURI === "http://www.w3.org/1999/xhtml" ? t.createElement(e) : t.createElementNS(n, e);
	};
}
function h(e) {
	return function() {
		return this.ownerDocument.createElementNS(e.space, e.local);
	};
}
function g(e) {
	var t = p(e);
	return (t.local ? h : m)(t);
}
//#endregion
//#region node_modules/d3-selection/src/selector.js
function _() {}
function v(e) {
	return e == null ? _ : function() {
		return this.querySelector(e);
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/select.js
function y(e) {
	typeof e != "function" && (e = v(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = Array(o), c, l, u = 0; u < o; ++u) (c = a[u]) && (l = e.call(c, c.__data__, u, a)) && ("__data__" in c && (l.__data__ = c.__data__), s[u] = l);
	return new E(r, this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/array.js
function b(e) {
	return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
//#endregion
//#region node_modules/d3-selection/src/selectorAll.js
function x() {
	return [];
}
function S(e) {
	return e == null ? x : function() {
		return this.querySelectorAll(e);
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/selectAll.js
function C(e) {
	return function() {
		return b(e.apply(this, arguments));
	};
}
function ee(e) {
	e = typeof e == "function" ? C(e) : S(e);
	for (var t = this._groups, n = t.length, r = [], i = [], a = 0; a < n; ++a) for (var o = t[a], s = o.length, c, l = 0; l < s; ++l) (c = o[l]) && (r.push(e.call(c, c.__data__, l, o)), i.push(c));
	return new E(r, i);
}
//#endregion
//#region node_modules/d3-selection/src/matcher.js
function te(e) {
	return function() {
		return this.matches(e);
	};
}
function ne(e) {
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
function ae() {
	return this.firstElementChild;
}
function oe(e) {
	return this.select(e == null ? ae : ie(typeof e == "function" ? e : ne(e)));
}
//#endregion
//#region node_modules/d3-selection/src/selection/selectChildren.js
var se = Array.prototype.filter;
function ce() {
	return Array.from(this.children);
}
function le(e) {
	return function() {
		return se.call(this.children, e);
	};
}
function ue(e) {
	return this.selectAll(e == null ? ce : le(typeof e == "function" ? e : ne(e)));
}
//#endregion
//#region node_modules/d3-selection/src/selection/filter.js
function de(e) {
	typeof e != "function" && (e = te(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = [], c, l = 0; l < o; ++l) (c = a[l]) && e.call(c, c.__data__, l, a) && s.push(c);
	return new E(r, this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/selection/sparse.js
function fe(e) {
	return Array(e.length);
}
//#endregion
//#region node_modules/d3-selection/src/selection/enter.js
function pe() {
	return new E(this._enter || this._groups.map(fe), this._parents);
}
function w(e, t) {
	this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
w.prototype = {
	constructor: w,
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
function me(e) {
	return function() {
		return e;
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/data.js
function he(e, t, n, r, i, a) {
	for (var o = 0, s, c = t.length, l = a.length; o < l; ++o) (s = t[o]) ? (s.__data__ = a[o], r[o] = s) : n[o] = new w(e, a[o]);
	for (; o < c; ++o) (s = t[o]) && (i[o] = s);
}
function ge(e, t, n, r, i, a, o) {
	var s, c, l = /* @__PURE__ */ new Map(), u = t.length, d = a.length, f = Array(u), p;
	for (s = 0; s < u; ++s) (c = t[s]) && (f[s] = p = o.call(c, c.__data__, s, t) + "", l.has(p) ? i[s] = c : l.set(p, c));
	for (s = 0; s < d; ++s) p = o.call(e, a[s], s, a) + "", (c = l.get(p)) ? (r[s] = c, c.__data__ = a[s], l.delete(p)) : n[s] = new w(e, a[s]);
	for (s = 0; s < u; ++s) (c = t[s]) && l.get(f[s]) === c && (i[s] = c);
}
function _e(e) {
	return e.__data__;
}
function ve(e, t) {
	if (!arguments.length) return Array.from(this, _e);
	var n = t ? ge : he, r = this._parents, i = this._groups;
	typeof e != "function" && (e = me(e));
	for (var a = i.length, o = Array(a), s = Array(a), c = Array(a), l = 0; l < a; ++l) {
		var u = r[l], d = i[l], f = d.length, p = ye(e.call(u, u && u.__data__, l, r)), m = p.length, h = s[l] = Array(m), g = o[l] = Array(m);
		n(u, d, h, g, c[l] = Array(f), p, t);
		for (var _ = 0, v = 0, y, b; _ < m; ++_) if (y = h[_]) {
			for (_ >= v && (v = _ + 1); !(b = g[v]) && ++v < m;);
			y._next = b || null;
		}
	}
	return o = new E(o, r), o._enter = s, o._exit = c, o;
}
function ye(e) {
	return typeof e == "object" && "length" in e ? e : Array.from(e);
}
//#endregion
//#region node_modules/d3-selection/src/selection/exit.js
function be() {
	return new E(this._exit || this._groups.map(fe), this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/selection/join.js
function xe(e, t, n) {
	var r = this.enter(), i = this, a = this.exit();
	return typeof e == "function" ? (r = e(r), r &&= r.selection()) : r = r.append(e + ""), t != null && (i = t(i), i &&= i.selection()), n == null ? a.remove() : n(a), r && i ? r.merge(i).order() : i;
}
//#endregion
//#region node_modules/d3-selection/src/selection/merge.js
function Se(e) {
	for (var t = e.selection ? e.selection() : e, n = this._groups, r = t._groups, i = n.length, a = r.length, o = Math.min(i, a), s = Array(i), c = 0; c < o; ++c) for (var l = n[c], u = r[c], d = l.length, f = s[c] = Array(d), p, m = 0; m < d; ++m) (p = l[m] || u[m]) && (f[m] = p);
	for (; c < i; ++c) s[c] = n[c];
	return new E(s, this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/selection/order.js
function Ce() {
	for (var e = this._groups, t = -1, n = e.length; ++t < n;) for (var r = e[t], i = r.length - 1, a = r[i], o; --i >= 0;) (o = r[i]) && (a && o.compareDocumentPosition(a) ^ 4 && a.parentNode.insertBefore(o, a), a = o);
	return this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/sort.js
function we(e) {
	e ||= Te;
	function t(t, n) {
		return t && n ? e(t.__data__, n.__data__) : !t - !n;
	}
	for (var n = this._groups, r = n.length, i = Array(r), a = 0; a < r; ++a) {
		for (var o = n[a], s = o.length, c = i[a] = Array(s), l, u = 0; u < s; ++u) (l = o[u]) && (c[u] = l);
		c.sort(t);
	}
	return new E(i, this._parents).order();
}
function Te(e, t) {
	return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
//#endregion
//#region node_modules/d3-selection/src/selection/call.js
function Ee() {
	var e = arguments[0];
	return arguments[0] = this, e.apply(null, arguments), this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/nodes.js
function De() {
	return Array.from(this);
}
//#endregion
//#region node_modules/d3-selection/src/selection/node.js
function Oe() {
	for (var e = this._groups, t = 0, n = e.length; t < n; ++t) for (var r = e[t], i = 0, a = r.length; i < a; ++i) {
		var o = r[i];
		if (o) return o;
	}
	return null;
}
//#endregion
//#region node_modules/d3-selection/src/selection/size.js
function ke() {
	let e = 0;
	for (let t of this) ++e;
	return e;
}
//#endregion
//#region node_modules/d3-selection/src/selection/empty.js
function Ae() {
	return !this.node();
}
//#endregion
//#region node_modules/d3-selection/src/selection/each.js
function je(e) {
	for (var t = this._groups, n = 0, r = t.length; n < r; ++n) for (var i = t[n], a = 0, o = i.length, s; a < o; ++a) (s = i[a]) && e.call(s, s.__data__, a, i);
	return this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/attr.js
function Me(e) {
	return function() {
		this.removeAttribute(e);
	};
}
function Ne(e) {
	return function() {
		this.removeAttributeNS(e.space, e.local);
	};
}
function Pe(e, t) {
	return function() {
		this.setAttribute(e, t);
	};
}
function Fe(e, t) {
	return function() {
		this.setAttributeNS(e.space, e.local, t);
	};
}
function Ie(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
	};
}
function Le(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
	};
}
function Re(e, t) {
	var n = p(e);
	if (arguments.length < 2) {
		var r = this.node();
		return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
	}
	return this.each((t == null ? n.local ? Ne : Me : typeof t == "function" ? n.local ? Le : Ie : n.local ? Fe : Pe)(n, t));
}
//#endregion
//#region node_modules/d3-selection/src/window.js
function ze(e) {
	return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
//#endregion
//#region node_modules/d3-selection/src/selection/style.js
function Be(e) {
	return function() {
		this.style.removeProperty(e);
	};
}
function Ve(e, t, n) {
	return function() {
		this.style.setProperty(e, t, n);
	};
}
function He(e, t, n) {
	return function() {
		var r = t.apply(this, arguments);
		r == null ? this.style.removeProperty(e) : this.style.setProperty(e, r, n);
	};
}
function Ue(e, t, n) {
	return arguments.length > 1 ? this.each((t == null ? Be : typeof t == "function" ? He : Ve)(e, t, n ?? "")) : T(this.node(), e);
}
function T(e, t) {
	return e.style.getPropertyValue(t) || ze(e).getComputedStyle(e, null).getPropertyValue(t);
}
//#endregion
//#region node_modules/d3-selection/src/selection/property.js
function We(e) {
	return function() {
		delete this[e];
	};
}
function Ge(e, t) {
	return function() {
		this[e] = t;
	};
}
function Ke(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? delete this[e] : this[e] = n;
	};
}
function qe(e, t) {
	return arguments.length > 1 ? this.each((t == null ? We : typeof t == "function" ? Ke : Ge)(e, t)) : this.node()[e];
}
//#endregion
//#region node_modules/d3-selection/src/selection/classed.js
function Je(e) {
	return e.trim().split(/^|\s+/);
}
function Ye(e) {
	return e.classList || new Xe(e);
}
function Xe(e) {
	this._node = e, this._names = Je(e.getAttribute("class") || "");
}
Xe.prototype = {
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
function Ze(e, t) {
	for (var n = Ye(e), r = -1, i = t.length; ++r < i;) n.add(t[r]);
}
function Qe(e, t) {
	for (var n = Ye(e), r = -1, i = t.length; ++r < i;) n.remove(t[r]);
}
function $e(e) {
	return function() {
		Ze(this, e);
	};
}
function et(e) {
	return function() {
		Qe(this, e);
	};
}
function tt(e, t) {
	return function() {
		(t.apply(this, arguments) ? Ze : Qe)(this, e);
	};
}
function nt(e, t) {
	var n = Je(e + "");
	if (arguments.length < 2) {
		for (var r = Ye(this.node()), i = -1, a = n.length; ++i < a;) if (!r.contains(n[i])) return !1;
		return !0;
	}
	return this.each((typeof t == "function" ? tt : t ? $e : et)(n, t));
}
//#endregion
//#region node_modules/d3-selection/src/selection/text.js
function rt() {
	this.textContent = "";
}
function it(e) {
	return function() {
		this.textContent = e;
	};
}
function at(e) {
	return function() {
		var t = e.apply(this, arguments);
		this.textContent = t ?? "";
	};
}
function ot(e) {
	return arguments.length ? this.each(e == null ? rt : (typeof e == "function" ? at : it)(e)) : this.node().textContent;
}
//#endregion
//#region node_modules/d3-selection/src/selection/html.js
function st() {
	this.innerHTML = "";
}
function ct(e) {
	return function() {
		this.innerHTML = e;
	};
}
function lt(e) {
	return function() {
		var t = e.apply(this, arguments);
		this.innerHTML = t ?? "";
	};
}
function ut(e) {
	return arguments.length ? this.each(e == null ? st : (typeof e == "function" ? lt : ct)(e)) : this.node().innerHTML;
}
//#endregion
//#region node_modules/d3-selection/src/selection/raise.js
function dt() {
	this.nextSibling && this.parentNode.appendChild(this);
}
function ft() {
	return this.each(dt);
}
//#endregion
//#region node_modules/d3-selection/src/selection/lower.js
function pt() {
	this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function mt() {
	return this.each(pt);
}
//#endregion
//#region node_modules/d3-selection/src/selection/append.js
function ht(e) {
	var t = typeof e == "function" ? e : g(e);
	return this.select(function() {
		return this.appendChild(t.apply(this, arguments));
	});
}
//#endregion
//#region node_modules/d3-selection/src/selection/insert.js
function gt() {
	return null;
}
function _t(e, t) {
	var n = typeof e == "function" ? e : g(e), r = t == null ? gt : typeof t == "function" ? t : v(t);
	return this.select(function() {
		return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
	});
}
//#endregion
//#region node_modules/d3-selection/src/selection/remove.js
function vt() {
	var e = this.parentNode;
	e && e.removeChild(this);
}
function yt() {
	return this.each(vt);
}
//#endregion
//#region node_modules/d3-selection/src/selection/clone.js
function bt() {
	var e = this.cloneNode(!1), t = this.parentNode;
	return t ? t.insertBefore(e, this.nextSibling) : e;
}
function xt() {
	var e = this.cloneNode(!0), t = this.parentNode;
	return t ? t.insertBefore(e, this.nextSibling) : e;
}
function St(e) {
	return this.select(e ? xt : bt);
}
//#endregion
//#region node_modules/d3-selection/src/selection/datum.js
function Ct(e) {
	return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
//#endregion
//#region node_modules/d3-selection/src/selection/on.js
function wt(e) {
	return function(t) {
		e.call(this, t, this.__data__);
	};
}
function Tt(e) {
	return e.trim().split(/^|\s+/).map(function(e) {
		var t = "", n = e.indexOf(".");
		return n >= 0 && (t = e.slice(n + 1), e = e.slice(0, n)), {
			type: e,
			name: t
		};
	});
}
function Et(e) {
	return function() {
		var t = this.__on;
		if (t) {
			for (var n = 0, r = -1, i = t.length, a; n < i; ++n) a = t[n], (!e.type || a.type === e.type) && a.name === e.name ? this.removeEventListener(a.type, a.listener, a.options) : t[++r] = a;
			++r ? t.length = r : delete this.__on;
		}
	};
}
function Dt(e, t, n) {
	return function() {
		var r = this.__on, i, a = wt(t);
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
function Ot(e, t, n) {
	var r = Tt(e + ""), i, a = r.length, o;
	if (arguments.length < 2) {
		var s = this.node().__on;
		if (s) {
			for (var c = 0, l = s.length, u; c < l; ++c) for (i = 0, u = s[c]; i < a; ++i) if ((o = r[i]).type === u.type && o.name === u.name) return u.value;
		}
		return;
	}
	for (s = t ? Dt : Et, i = 0; i < a; ++i) this.each(s(r[i], t, n));
	return this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/dispatch.js
function kt(e, t, n) {
	var r = ze(e), i = r.CustomEvent;
	typeof i == "function" ? i = new i(t, n) : (i = r.document.createEvent("Event"), n ? (i.initEvent(t, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(t, !1, !1)), e.dispatchEvent(i);
}
function At(e, t) {
	return function() {
		return kt(this, e, t);
	};
}
function jt(e, t) {
	return function() {
		return kt(this, e, t.apply(this, arguments));
	};
}
function Mt(e, t) {
	return this.each((typeof t == "function" ? jt : At)(e, t));
}
//#endregion
//#region node_modules/d3-selection/src/selection/iterator.js
function* Nt() {
	for (var e = this._groups, t = 0, n = e.length; t < n; ++t) for (var r = e[t], i = 0, a = r.length, o; i < a; ++i) (o = r[i]) && (yield o);
}
//#endregion
//#region node_modules/d3-selection/src/selection/index.js
var Pt = [null];
function E(e, t) {
	this._groups = e, this._parents = t;
}
function D() {
	return new E([[document.documentElement]], Pt);
}
function Ft() {
	return this;
}
E.prototype = D.prototype = {
	constructor: E,
	select: y,
	selectAll: ee,
	selectChild: oe,
	selectChildren: ue,
	filter: de,
	data: ve,
	enter: pe,
	exit: be,
	join: xe,
	merge: Se,
	selection: Ft,
	order: Ce,
	sort: we,
	call: Ee,
	nodes: De,
	node: Oe,
	size: ke,
	empty: Ae,
	each: je,
	attr: Re,
	style: Ue,
	property: qe,
	classed: nt,
	text: ot,
	html: ut,
	raise: ft,
	lower: mt,
	append: ht,
	insert: _t,
	remove: yt,
	clone: St,
	datum: Ct,
	on: Ot,
	dispatch: Mt,
	[Symbol.iterator]: Nt
};
//#endregion
//#region node_modules/d3-selection/src/select.js
function O(e) {
	return typeof e == "string" ? new E([[document.querySelector(e)]], [document.documentElement]) : new E([[e]], Pt);
}
//#endregion
//#region node_modules/d3-selection/src/sourceEvent.js
function It(e) {
	let t;
	for (; t = e.sourceEvent;) e = t;
	return e;
}
//#endregion
//#region node_modules/d3-selection/src/pointer.js
function k(e, t) {
	if (e = It(e), t === void 0 && (t = e.currentTarget), t) {
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
var Lt = { passive: !1 }, A = {
	capture: !0,
	passive: !1
};
function Rt(e) {
	e.stopImmediatePropagation();
}
function j(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region node_modules/d3-drag/src/nodrag.js
function zt(e) {
	var t = e.document.documentElement, n = O(e).on("dragstart.drag", j, A);
	"onselectstart" in t ? n.on("selectstart.drag", j, A) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function Bt(e, t) {
	var n = e.document.documentElement, r = O(e).on("dragstart.drag", null);
	t && (r.on("click.drag", j, A), setTimeout(function() {
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
	var e = Ut, t = Wt, n = Gt, r = Kt, i = {}, a = s("start", "drag", "end"), o = 0, c, l, u, d, f = 0;
	function p(e) {
		e.on("mousedown.drag", m).filter(r).on("touchstart.drag", _).on("touchmove.drag", v, Lt).on("touchend.drag touchcancel.drag", y).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	}
	function m(n, r) {
		if (!(d || !e.call(this, n, r))) {
			var i = b(this, t.call(this, n, r), n, r, "mouse");
			i && (O(n.view).on("mousemove.drag", h, A).on("mouseup.drag", g, A), zt(n.view), Rt(n), u = !1, c = n.clientX, l = n.clientY, i("start", n));
		}
	}
	function h(e) {
		if (j(e), !u) {
			var t = e.clientX - c, n = e.clientY - l;
			u = t * t + n * n > f;
		}
		i.mouse("drag", e);
	}
	function g(e) {
		O(e.view).on("mousemove.drag mouseup.drag", null), Bt(e.view, u), j(e), i.mouse("end", e);
	}
	function _(n, r) {
		if (e.call(this, n, r)) {
			var i = n.changedTouches, a = t.call(this, n, r), o = i.length, s, c;
			for (s = 0; s < o; ++s) (c = b(this, a, n, r, i[s].identifier, i[s])) && (Rt(n), c("start", n, i[s]));
		}
	}
	function v(e) {
		var t = e.changedTouches, n = t.length, r, a;
		for (r = 0; r < n; ++r) (a = i[t[r].identifier]) && (j(e), a("drag", e, t[r]));
	}
	function y(e) {
		var t = e.changedTouches, n = t.length, r, a;
		for (d && clearTimeout(d), d = setTimeout(function() {
			d = null;
		}, 500), r = 0; r < n; ++r) (a = i[t[r].identifier]) && (Rt(e), a("end", e, t[r]));
	}
	function b(e, t, r, s, c, l) {
		var u = a.copy(), d = k(l || r, t), f, m, h;
		if ((h = n.call(e, new Ht("beforestart", {
			sourceEvent: r,
			target: p,
			identifier: c,
			active: o,
			x: d[0],
			y: d[1],
			dx: 0,
			dy: 0,
			dispatch: u
		}), s)) != null) return f = h.x - d[0] || 0, m = h.y - d[1] || 0, function n(r, a, l) {
			var g = d, _;
			switch (r) {
				case "start":
					i[c] = n, _ = o++;
					break;
				case "end": delete i[c], --o;
				case "drag":
					d = k(l || a, t), _ = o;
					break;
			}
			u.call(r, e, new Ht(r, {
				sourceEvent: a,
				subject: h,
				target: p,
				identifier: c,
				active: _,
				x: d[0] + f,
				y: d[1] + m,
				dx: d[0] - g[0],
				dy: d[1] - g[1],
				dispatch: u
			}), s);
		};
	}
	return p.filter = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : Vt(!!t), p) : e;
	}, p.container = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : Vt(e), p) : t;
	}, p.subject = function(e) {
		return arguments.length ? (n = typeof e == "function" ? e : Vt(e), p) : n;
	}, p.touchable = function(e) {
		return arguments.length ? (r = typeof e == "function" ? e : Vt(!!e), p) : r;
	}, p.on = function() {
		var e = a.on.apply(a, arguments);
		return e === a ? p : e;
	}, p.clickDistance = function(e) {
		return arguments.length ? (f = (e = +e) * e, p) : Math.sqrt(f);
	}, p;
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
var Zt = .7, Qt = 1 / Zt, M = "\\s*([+-]?\\d+)\\s*", $t = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", N = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", en = /^#([0-9a-f]{3,8})$/, tn = RegExp(`^rgb\\(${M},${M},${M}\\)$`), nn = RegExp(`^rgb\\(${N},${N},${N}\\)$`), rn = RegExp(`^rgba\\(${M},${M},${M},${$t}\\)$`), an = RegExp(`^rgba\\(${N},${N},${N},${$t}\\)$`), on = RegExp(`^hsl\\(${$t},${N},${N}\\)$`), sn = RegExp(`^hsla\\(${$t},${N},${N},${$t}\\)$`), cn = {
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
Jt(Xt, pn, {
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
	return Cn(this).formatHsl();
}
function fn() {
	return this.rgb().formatRgb();
}
function pn(e) {
	var t, n;
	return e = (e + "").trim().toLowerCase(), (t = en.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? mn(t) : n === 3 ? new P(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? hn(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? hn(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = tn.exec(e)) ? new P(t[1], t[2], t[3], 1) : (t = nn.exec(e)) ? new P(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = rn.exec(e)) ? hn(t[1], t[2], t[3], t[4]) : (t = an.exec(e)) ? hn(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = on.exec(e)) ? Sn(t[1], t[2] / 100, t[3] / 100, 1) : (t = sn.exec(e)) ? Sn(t[1], t[2] / 100, t[3] / 100, t[4]) : cn.hasOwnProperty(e) ? mn(cn[e]) : e === "transparent" ? new P(NaN, NaN, NaN, 0) : null;
}
function mn(e) {
	return new P(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function hn(e, t, n, r) {
	return r <= 0 && (e = t = n = NaN), new P(e, t, n, r);
}
function gn(e) {
	return e instanceof Xt || (e = pn(e)), e ? (e = e.rgb(), new P(e.r, e.g, e.b, e.opacity)) : new P();
}
function _n(e, t, n, r) {
	return arguments.length === 1 ? gn(e) : new P(e, t, n, r ?? 1);
}
function P(e, t, n, r) {
	this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
Jt(P, _n, Yt(Xt, {
	brighter(e) {
		return e = e == null ? Qt : Qt ** +e, new P(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? Zt : Zt ** +e, new P(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	rgb() {
		return this;
	},
	clamp() {
		return new P(F(this.r), F(this.g), F(this.b), xn(this.opacity));
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
	return `#${I(this.r)}${I(this.g)}${I(this.b)}`;
}
function yn() {
	return `#${I(this.r)}${I(this.g)}${I(this.b)}${I((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function bn() {
	let e = xn(this.opacity);
	return `${e === 1 ? "rgb(" : "rgba("}${F(this.r)}, ${F(this.g)}, ${F(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function xn(e) {
	return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function F(e) {
	return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function I(e) {
	return e = F(e), (e < 16 ? "0" : "") + e.toString(16);
}
function Sn(e, t, n, r) {
	return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new L(e, t, n, r);
}
function Cn(e) {
	if (e instanceof L) return new L(e.h, e.s, e.l, e.opacity);
	if (e instanceof Xt || (e = pn(e)), !e) return new L();
	if (e instanceof L) return e;
	e = e.rgb();
	var t = e.r / 255, n = e.g / 255, r = e.b / 255, i = Math.min(t, n, r), a = Math.max(t, n, r), o = NaN, s = a - i, c = (a + i) / 2;
	return s ? (o = t === a ? (n - r) / s + (n < r) * 6 : n === a ? (r - t) / s + 2 : (t - n) / s + 4, s /= c < .5 ? a + i : 2 - a - i, o *= 60) : s = c > 0 && c < 1 ? 0 : o, new L(o, s, c, e.opacity);
}
function wn(e, t, n, r) {
	return arguments.length === 1 ? Cn(e) : new L(e, t, n, r ?? 1);
}
function L(e, t, n, r) {
	this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
Jt(L, wn, Yt(Xt, {
	brighter(e) {
		return e = e == null ? Qt : Qt ** +e, new L(this.h, this.s, this.l * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? Zt : Zt ** +e, new L(this.h, this.s, this.l * e, this.opacity);
	},
	rgb() {
		var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < .5 ? n : 1 - n) * t, i = 2 * n - r;
		return new P(Dn(e >= 240 ? e - 240 : e + 120, i, r), Dn(e, i, r), Dn(e < 120 ? e + 240 : e - 120, i, r), this.opacity);
	},
	clamp() {
		return new L(Tn(this.h), En(this.s), En(this.l), xn(this.opacity));
	},
	displayable() {
		return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
	},
	formatHsl() {
		let e = xn(this.opacity);
		return `${e === 1 ? "hsl(" : "hsla("}${Tn(this.h)}, ${En(this.s) * 100}%, ${En(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
	}
}));
function Tn(e) {
	return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function En(e) {
	return Math.max(0, Math.min(1, e || 0));
}
function Dn(e, t, n) {
	return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
//#endregion
//#region node_modules/d3-interpolate/src/constant.js
var On = (e) => () => e;
//#endregion
//#region node_modules/d3-interpolate/src/color.js
function kn(e, t) {
	return function(n) {
		return e + n * t;
	};
}
function An(e, t, n) {
	return e **= +n, t = t ** +n - e, n = 1 / n, function(r) {
		return (e + r * t) ** +n;
	};
}
function jn(e) {
	return (e = +e) == 1 ? Mn : function(t, n) {
		return n - t ? An(t, n, e) : On(isNaN(t) ? n : t);
	};
}
function Mn(e, t) {
	var n = t - e;
	return n ? kn(e, n) : On(isNaN(e) ? t : e);
}
//#endregion
//#region node_modules/d3-interpolate/src/rgb.js
var Nn = (function e(t) {
	var n = jn(t);
	function r(e, t) {
		var r = n((e = _n(e)).r, (t = _n(t)).r), i = n(e.g, t.g), a = n(e.b, t.b), o = Mn(e.opacity, t.opacity);
		return function(t) {
			return e.r = r(t), e.g = i(t), e.b = a(t), e.opacity = o(t), e + "";
		};
	}
	return r.gamma = e, r;
})(1);
//#endregion
//#region node_modules/d3-interpolate/src/number.js
function R(e, t) {
	return e = +e, t = +t, function(n) {
		return e * (1 - n) + t * n;
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/string.js
var Pn = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Fn = new RegExp(Pn.source, "g");
function In(e) {
	return function() {
		return e;
	};
}
function Ln(e) {
	return function(t) {
		return e(t) + "";
	};
}
function Rn(e, t) {
	var n = Pn.lastIndex = Fn.lastIndex = 0, r, i, a, o = -1, s = [], c = [];
	for (e += "", t += ""; (r = Pn.exec(e)) && (i = Fn.exec(t));) (a = i.index) > n && (a = t.slice(n, a), s[o] ? s[o] += a : s[++o] = a), (r = r[0]) === (i = i[0]) ? s[o] ? s[o] += i : s[++o] = i : (s[++o] = null, c.push({
		i: o,
		x: R(r, i)
	})), n = Fn.lastIndex;
	return n < t.length && (a = t.slice(n), s[o] ? s[o] += a : s[++o] = a), s.length < 2 ? c[0] ? Ln(c[0].x) : In(t) : (t = c.length, function(e) {
		for (var n = 0, r; n < t; ++n) s[(r = c[n]).i] = r.x(e);
		return s.join("");
	});
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/decompose.js
var zn = 180 / Math.PI, Bn = {
	translateX: 0,
	translateY: 0,
	rotate: 0,
	skewX: 0,
	scaleX: 1,
	scaleY: 1
};
function Vn(e, t, n, r, i, a) {
	var o, s, c;
	return (o = Math.sqrt(e * e + t * t)) && (e /= o, t /= o), (c = e * n + t * r) && (n -= e * c, r -= t * c), (s = Math.sqrt(n * n + r * r)) && (n /= s, r /= s, c /= s), e * r < t * n && (e = -e, t = -t, c = -c, o = -o), {
		translateX: i,
		translateY: a,
		rotate: Math.atan2(t, e) * zn,
		skewX: Math.atan(c) * zn,
		scaleX: o,
		scaleY: s
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/parse.js
var Hn;
function Un(e) {
	let t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
	return t.isIdentity ? Bn : Vn(t.a, t.b, t.c, t.d, t.e, t.f);
}
function Wn(e) {
	return e == null || (Hn ||= document.createElementNS("http://www.w3.org/2000/svg", "g"), Hn.setAttribute("transform", e), !(e = Hn.transform.baseVal.consolidate())) ? Bn : (e = e.matrix, Vn(e.a, e.b, e.c, e.d, e.e, e.f));
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/index.js
function Gn(e, t, n, r) {
	function i(e) {
		return e.length ? e.pop() + " " : "";
	}
	function a(e, r, i, a, o, s) {
		if (e !== i || r !== a) {
			var c = o.push("translate(", null, t, null, n);
			s.push({
				i: c - 4,
				x: R(e, i)
			}, {
				i: c - 2,
				x: R(r, a)
			});
		} else (i || a) && o.push("translate(" + i + t + a + n);
	}
	function o(e, t, n, a) {
		e === t ? t && n.push(i(n) + "rotate(" + t + r) : (e - t > 180 ? t += 360 : t - e > 180 && (e += 360), a.push({
			i: n.push(i(n) + "rotate(", null, r) - 2,
			x: R(e, t)
		}));
	}
	function s(e, t, n, a) {
		e === t ? t && n.push(i(n) + "skewX(" + t + r) : a.push({
			i: n.push(i(n) + "skewX(", null, r) - 2,
			x: R(e, t)
		});
	}
	function c(e, t, n, r, a, o) {
		if (e !== n || t !== r) {
			var s = a.push(i(a) + "scale(", null, ",", null, ")");
			o.push({
				i: s - 4,
				x: R(e, n)
			}, {
				i: s - 2,
				x: R(t, r)
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
var Kn = Gn(Un, "px, ", "px)", "deg)"), qn = Gn(Wn, ", ", ")", ")"), Jn = 1e-12;
function Yn(e) {
	return ((e = Math.exp(e)) + 1 / e) / 2;
}
function Xn(e) {
	return ((e = Math.exp(e)) - 1 / e) / 2;
}
function Zn(e) {
	return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
var Qn = (function e(t, n, r) {
	function i(e, i) {
		var a = e[0], o = e[1], s = e[2], c = i[0], l = i[1], u = i[2], d = c - a, f = l - o, p = d * d + f * f, m, h;
		if (p < Jn) h = Math.log(u / s) / t, m = function(e) {
			return [
				a + e * d,
				o + e * f,
				s * Math.exp(t * e * h)
			];
		};
		else {
			var g = Math.sqrt(p), _ = (u * u - s * s + r * p) / (2 * s * n * g), v = (u * u - s * s - r * p) / (2 * u * n * g), y = Math.log(Math.sqrt(_ * _ + 1) - _);
			h = (Math.log(Math.sqrt(v * v + 1) - v) - y) / t, m = function(e) {
				var r = e * h, i = Yn(y), c = s / (n * g) * (i * Zn(t * r + y) - Xn(y));
				return [
					a + c * d,
					o + c * f,
					s * i / Yn(t * r + y)
				];
			};
		}
		return m.duration = h * 1e3 * t / Math.SQRT2, m;
	}
	return i.rho = function(t) {
		var n = Math.max(.001, +t), r = n * n;
		return e(n, r, r * r);
	}, i;
})(Math.SQRT2, 2, 4), z = 0, $n = 0, er = 0, tr = 1e3, nr, rr, ir = 0, B = 0, ar = 0, or = typeof performance == "object" && performance.now ? performance : Date, sr = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
	setTimeout(e, 17);
};
function cr() {
	return B ||= (sr(lr), or.now() + ar);
}
function lr() {
	B = 0;
}
function ur() {
	this._call = this._time = this._next = null;
}
ur.prototype = dr.prototype = {
	constructor: ur,
	restart: function(e, t, n) {
		if (typeof e != "function") throw TypeError("callback is not a function");
		n = (n == null ? cr() : +n) + (t == null ? 0 : +t), !this._next && rr !== this && (rr ? rr._next = this : nr = this, rr = this), this._call = e, this._time = n, gr();
	},
	stop: function() {
		this._call && (this._call = null, this._time = Infinity, gr());
	}
};
function dr(e, t, n) {
	var r = new ur();
	return r.restart(e, t, n), r;
}
function fr() {
	cr(), ++z;
	for (var e = nr, t; e;) (t = B - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
	--z;
}
function pr() {
	B = (ir = or.now()) + ar, z = $n = 0;
	try {
		fr();
	} finally {
		z = 0, hr(), B = 0;
	}
}
function mr() {
	var e = or.now(), t = e - ir;
	t > tr && (ar -= t, ir = e);
}
function hr() {
	for (var e, t = nr, n, r = Infinity; t;) t._call ? (r > t._time && (r = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : nr = n);
	rr = e, gr(r);
}
function gr(e) {
	z || ($n &&= clearTimeout($n), e - B > 24 ? (e < Infinity && ($n = setTimeout(pr, e - or.now() - ar)), er &&= clearInterval(er)) : (er ||= (ir = or.now(), setInterval(mr, tr)), z = 1, sr(pr)));
}
//#endregion
//#region node_modules/d3-timer/src/timeout.js
function _r(e, t, n) {
	var r = new ur();
	return t = t == null ? 0 : +t, r.restart((n) => {
		r.stop(), e(n + t);
	}, t, n), r;
}
//#endregion
//#region node_modules/d3-transition/src/transition/schedule.js
var vr = s("start", "end", "cancel", "interrupt"), yr = [];
function br(e, t, n, r, i, a) {
	var o = e.__transition;
	if (!o) e.__transition = {};
	else if (n in o) return;
	Sr(e, n, {
		name: t,
		index: r,
		group: i,
		on: vr,
		tween: yr,
		time: a.time,
		delay: a.delay,
		duration: a.duration,
		ease: a.ease,
		timer: null,
		state: 0
	});
}
function xr(e, t) {
	var n = H(e, t);
	if (n.state > 0) throw Error("too late; already scheduled");
	return n;
}
function V(e, t) {
	var n = H(e, t);
	if (n.state > 3) throw Error("too late; already running");
	return n;
}
function H(e, t) {
	var n = e.__transition;
	if (!n || !(n = n[t])) throw Error("transition not found");
	return n;
}
function Sr(e, t, n) {
	var r = e.__transition, i;
	r[t] = n, n.timer = dr(a, 0, n.time);
	function a(e) {
		n.state = 1, n.timer.restart(o, n.delay, n.time), n.delay <= e && o(e - n.delay);
	}
	function o(a) {
		var l, u, d, f;
		if (n.state !== 1) return c();
		for (l in r) if (f = r[l], f.name === n.name) {
			if (f.state === 3) return _r(o);
			f.state === 4 ? (f.state = 6, f.timer.stop(), f.on.call("interrupt", e, e.__data__, f.index, f.group), delete r[l]) : +l < t && (f.state = 6, f.timer.stop(), f.on.call("cancel", e, e.__data__, f.index, f.group), delete r[l]);
		}
		if (_r(function() {
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
function Cr(e, t) {
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
function wr(e) {
	return this.each(function() {
		Cr(this, e);
	});
}
//#endregion
//#region node_modules/d3-transition/src/transition/tween.js
function Tr(e, t) {
	var n, r;
	return function() {
		var i = V(this, e), a = i.tween;
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
function Er(e, t, n) {
	var r, i;
	if (typeof n != "function") throw Error();
	return function() {
		var a = V(this, e), o = a.tween;
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
function Dr(e, t) {
	var n = this._id;
	if (e += "", arguments.length < 2) {
		for (var r = H(this.node(), n).tween, i = 0, a = r.length, o; i < a; ++i) if ((o = r[i]).name === e) return o.value;
		return null;
	}
	return this.each((t == null ? Tr : Er)(n, e, t));
}
function Or(e, t, n) {
	var r = e._id;
	return e.each(function() {
		var e = V(this, r);
		(e.value ||= {})[t] = n.apply(this, arguments);
	}), function(e) {
		return H(e, r).value[t];
	};
}
//#endregion
//#region node_modules/d3-transition/src/transition/interpolate.js
function kr(e, t) {
	var n;
	return (typeof t == "number" ? R : t instanceof pn ? Nn : (n = pn(t)) ? (t = n, Nn) : Rn)(e, t);
}
//#endregion
//#region node_modules/d3-transition/src/transition/attr.js
function Ar(e) {
	return function() {
		this.removeAttribute(e);
	};
}
function jr(e) {
	return function() {
		this.removeAttributeNS(e.space, e.local);
	};
}
function Mr(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = this.getAttribute(e);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function Nr(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = this.getAttributeNS(e.space, e.local);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function Pr(e, t, n) {
	var r, i, a;
	return function() {
		var o, s = n(this), c;
		return s == null ? void this.removeAttribute(e) : (o = this.getAttribute(e), c = s + "", o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s)));
	};
}
function Fr(e, t, n) {
	var r, i, a;
	return function() {
		var o, s = n(this), c;
		return s == null ? void this.removeAttributeNS(e.space, e.local) : (o = this.getAttributeNS(e.space, e.local), c = s + "", o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s)));
	};
}
function Ir(e, t) {
	var n = p(e), r = n === "transform" ? qn : kr;
	return this.attrTween(e, typeof t == "function" ? (n.local ? Fr : Pr)(n, r, Or(this, "attr." + e, t)) : t == null ? (n.local ? jr : Ar)(n) : (n.local ? Nr : Mr)(n, r, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/attrTween.js
function Lr(e, t) {
	return function(n) {
		this.setAttribute(e, t.call(this, n));
	};
}
function Rr(e, t) {
	return function(n) {
		this.setAttributeNS(e.space, e.local, t.call(this, n));
	};
}
function zr(e, t) {
	var n, r;
	function i() {
		var i = t.apply(this, arguments);
		return i !== r && (n = (r = i) && Rr(e, i)), n;
	}
	return i._value = t, i;
}
function Br(e, t) {
	var n, r;
	function i() {
		var i = t.apply(this, arguments);
		return i !== r && (n = (r = i) && Lr(e, i)), n;
	}
	return i._value = t, i;
}
function Vr(e, t) {
	var n = "attr." + e;
	if (arguments.length < 2) return (n = this.tween(n)) && n._value;
	if (t == null) return this.tween(n, null);
	if (typeof t != "function") throw Error();
	var r = p(e);
	return this.tween(n, (r.local ? zr : Br)(r, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/delay.js
function Hr(e, t) {
	return function() {
		xr(this, e).delay = +t.apply(this, arguments);
	};
}
function Ur(e, t) {
	return t = +t, function() {
		xr(this, e).delay = t;
	};
}
function Wr(e) {
	var t = this._id;
	return arguments.length ? this.each((typeof e == "function" ? Hr : Ur)(t, e)) : H(this.node(), t).delay;
}
//#endregion
//#region node_modules/d3-transition/src/transition/duration.js
function Gr(e, t) {
	return function() {
		V(this, e).duration = +t.apply(this, arguments);
	};
}
function Kr(e, t) {
	return t = +t, function() {
		V(this, e).duration = t;
	};
}
function qr(e) {
	var t = this._id;
	return arguments.length ? this.each((typeof e == "function" ? Gr : Kr)(t, e)) : H(this.node(), t).duration;
}
//#endregion
//#region node_modules/d3-transition/src/transition/ease.js
function Jr(e, t) {
	if (typeof t != "function") throw Error();
	return function() {
		V(this, e).ease = t;
	};
}
function Yr(e) {
	var t = this._id;
	return arguments.length ? this.each(Jr(t, e)) : H(this.node(), t).ease;
}
//#endregion
//#region node_modules/d3-transition/src/transition/easeVarying.js
function Xr(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		if (typeof n != "function") throw Error();
		V(this, e).ease = n;
	};
}
function Zr(e) {
	if (typeof e != "function") throw Error();
	return this.each(Xr(this._id, e));
}
//#endregion
//#region node_modules/d3-transition/src/transition/filter.js
function Qr(e) {
	typeof e != "function" && (e = te(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = [], c, l = 0; l < o; ++l) (c = a[l]) && e.call(c, c.__data__, l, a) && s.push(c);
	return new U(r, this._parents, this._name, this._id);
}
//#endregion
//#region node_modules/d3-transition/src/transition/merge.js
function $r(e) {
	if (e._id !== this._id) throw Error();
	for (var t = this._groups, n = e._groups, r = t.length, i = n.length, a = Math.min(r, i), o = Array(r), s = 0; s < a; ++s) for (var c = t[s], l = n[s], u = c.length, d = o[s] = Array(u), f, p = 0; p < u; ++p) (f = c[p] || l[p]) && (d[p] = f);
	for (; s < r; ++s) o[s] = t[s];
	return new U(o, this._parents, this._name, this._id);
}
//#endregion
//#region node_modules/d3-transition/src/transition/on.js
function ei(e) {
	return (e + "").trim().split(/^|\s+/).every(function(e) {
		var t = e.indexOf(".");
		return t >= 0 && (e = e.slice(0, t)), !e || e === "start";
	});
}
function ti(e, t, n) {
	var r, i, a = ei(t) ? xr : V;
	return function() {
		var o = a(this, e), s = o.on;
		s !== r && (i = (r = s).copy()).on(t, n), o.on = i;
	};
}
function ni(e, t) {
	var n = this._id;
	return arguments.length < 2 ? H(this.node(), n).on.on(e) : this.each(ti(n, e, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/remove.js
function ri(e) {
	return function() {
		var t = this.parentNode;
		for (var n in this.__transition) if (+n !== e) return;
		t && t.removeChild(this);
	};
}
function ii() {
	return this.on("end.remove", ri(this._id));
}
//#endregion
//#region node_modules/d3-transition/src/transition/select.js
function ai(e) {
	var t = this._name, n = this._id;
	typeof e != "function" && (e = v(e));
	for (var r = this._groups, i = r.length, a = Array(i), o = 0; o < i; ++o) for (var s = r[o], c = s.length, l = a[o] = Array(c), u, d, f = 0; f < c; ++f) (u = s[f]) && (d = e.call(u, u.__data__, f, s)) && ("__data__" in u && (d.__data__ = u.__data__), l[f] = d, br(l[f], t, n, f, l, H(u, n)));
	return new U(a, this._parents, t, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/selectAll.js
function oi(e) {
	var t = this._name, n = this._id;
	typeof e != "function" && (e = S(e));
	for (var r = this._groups, i = r.length, a = [], o = [], s = 0; s < i; ++s) for (var c = r[s], l = c.length, u, d = 0; d < l; ++d) if (u = c[d]) {
		for (var f = e.call(u, u.__data__, d, c), p, m = H(u, n), h = 0, g = f.length; h < g; ++h) (p = f[h]) && br(p, t, n, h, f, m);
		a.push(f), o.push(u);
	}
	return new U(a, o, t, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/selection.js
var si = D.prototype.constructor;
function ci() {
	return new si(this._groups, this._parents);
}
//#endregion
//#region node_modules/d3-transition/src/transition/style.js
function li(e, t) {
	var n, r, i;
	return function() {
		var a = T(this, e), o = (this.style.removeProperty(e), T(this, e));
		return a === o ? null : a === n && o === r ? i : i = t(n = a, r = o);
	};
}
function ui(e) {
	return function() {
		this.style.removeProperty(e);
	};
}
function di(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = T(this, e);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function fi(e, t, n) {
	var r, i, a;
	return function() {
		var o = T(this, e), s = n(this), c = s + "";
		return s ?? (c = s = (this.style.removeProperty(e), T(this, e))), o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s));
	};
}
function pi(e, t) {
	var n, r, i, a = "style." + t, o = "end." + a, s;
	return function() {
		var c = V(this, e), l = c.on, u = c.value[a] == null ? s ||= ui(t) : void 0;
		(l !== n || i !== u) && (r = (n = l).copy()).on(o, i = u), c.on = r;
	};
}
function mi(e, t, n) {
	var r = (e += "") == "transform" ? Kn : kr;
	return t == null ? this.styleTween(e, li(e, r)).on("end.style." + e, ui(e)) : typeof t == "function" ? this.styleTween(e, fi(e, r, Or(this, "style." + e, t))).each(pi(this._id, e)) : this.styleTween(e, di(e, r, t), n).on("end.style." + e, null);
}
//#endregion
//#region node_modules/d3-transition/src/transition/styleTween.js
function hi(e, t, n) {
	return function(r) {
		this.style.setProperty(e, t.call(this, r), n);
	};
}
function gi(e, t, n) {
	var r, i;
	function a() {
		var a = t.apply(this, arguments);
		return a !== i && (r = (i = a) && hi(e, a, n)), r;
	}
	return a._value = t, a;
}
function _i(e, t, n) {
	var r = "style." + (e += "");
	if (arguments.length < 2) return (r = this.tween(r)) && r._value;
	if (t == null) return this.tween(r, null);
	if (typeof t != "function") throw Error();
	return this.tween(r, gi(e, t, n ?? ""));
}
//#endregion
//#region node_modules/d3-transition/src/transition/text.js
function vi(e) {
	return function() {
		this.textContent = e;
	};
}
function yi(e) {
	return function() {
		var t = e(this);
		this.textContent = t ?? "";
	};
}
function bi(e) {
	return this.tween("text", typeof e == "function" ? yi(Or(this, "text", e)) : vi(e == null ? "" : e + ""));
}
//#endregion
//#region node_modules/d3-transition/src/transition/textTween.js
function xi(e) {
	return function(t) {
		this.textContent = e.call(this, t);
	};
}
function Si(e) {
	var t, n;
	function r() {
		var r = e.apply(this, arguments);
		return r !== n && (t = (n = r) && xi(r)), t;
	}
	return r._value = e, r;
}
function Ci(e) {
	var t = "text";
	if (arguments.length < 1) return (t = this.tween(t)) && t._value;
	if (e == null) return this.tween(t, null);
	if (typeof e != "function") throw Error();
	return this.tween(t, Si(e));
}
//#endregion
//#region node_modules/d3-transition/src/transition/transition.js
function wi() {
	for (var e = this._name, t = this._id, n = Oi(), r = this._groups, i = r.length, a = 0; a < i; ++a) for (var o = r[a], s = o.length, c, l = 0; l < s; ++l) if (c = o[l]) {
		var u = H(c, t);
		br(c, e, n, l, o, {
			time: u.time + u.delay + u.duration,
			delay: 0,
			duration: u.duration,
			ease: u.ease
		});
	}
	return new U(r, this._parents, e, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/end.js
function Ti() {
	var e, t, n = this, r = n._id, i = n.size();
	return new Promise(function(a, o) {
		var s = { value: o }, c = { value: function() {
			--i === 0 && a();
		} };
		n.each(function() {
			var n = V(this, r), i = n.on;
			i !== e && (t = (e = i).copy(), t._.cancel.push(s), t._.interrupt.push(s), t._.end.push(c)), n.on = t;
		}), i === 0 && a();
	});
}
//#endregion
//#region node_modules/d3-transition/src/transition/index.js
var Ei = 0;
function U(e, t, n, r) {
	this._groups = e, this._parents = t, this._name = n, this._id = r;
}
function Di(e) {
	return D().transition(e);
}
function Oi() {
	return ++Ei;
}
var W = D.prototype;
U.prototype = Di.prototype = {
	constructor: U,
	select: ai,
	selectAll: oi,
	selectChild: W.selectChild,
	selectChildren: W.selectChildren,
	filter: Qr,
	merge: $r,
	selection: ci,
	transition: wi,
	call: W.call,
	nodes: W.nodes,
	node: W.node,
	size: W.size,
	empty: W.empty,
	each: W.each,
	on: ni,
	attr: Ir,
	attrTween: Vr,
	style: mi,
	styleTween: _i,
	text: bi,
	textTween: Ci,
	remove: ii,
	tween: Dr,
	delay: Wr,
	duration: qr,
	ease: Yr,
	easeVarying: Zr,
	end: Ti,
	[Symbol.iterator]: W[Symbol.iterator]
};
//#endregion
//#region node_modules/d3-ease/src/cubic.js
function ki(e) {
	return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
//#endregion
//#region node_modules/d3-transition/src/selection/transition.js
var Ai = {
	time: null,
	delay: 0,
	duration: 250,
	ease: ki
};
function ji(e, t) {
	for (var n; !(n = e.__transition) || !(n = n[t]);) if (!(e = e.parentNode)) throw Error(`transition ${t} not found`);
	return n;
}
function Mi(e) {
	var t, n;
	e instanceof U ? (t = e._id, e = e._name) : (t = Oi(), (n = Ai).time = cr(), e = e == null ? null : e + "");
	for (var r = this._groups, i = r.length, a = 0; a < i; ++a) for (var o = r[a], s = o.length, c, l = 0; l < s; ++l) (c = o[l]) && br(c, e, t, l, o, n || ji(c, t));
	return new U(r, this._parents, e, t);
}
D.prototype.interrupt = wr, D.prototype.transition = Mi;
//#endregion
//#region node_modules/d3-brush/src/brush.js
var { abs: Ni, max: Pi, min: Fi } = Math;
["w", "e"].map(Ii), ["n", "s"].map(Ii), [
	"n",
	"w",
	"e",
	"s",
	"nw",
	"ne",
	"sw",
	"se"
].map(Ii);
function Ii(e) {
	return { type: e };
}
//#endregion
//#region node_modules/d3-force/src/center.js
function Li(e, t) {
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
function Ri(e) {
	let t = +this._x.call(null, e), n = +this._y.call(null, e);
	return zi(this.cover(t, n), t, n, e);
}
function zi(e, t, n, r) {
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
function Bi(e) {
	var t, n, r = e.length, i, a, o = Array(r), s = Array(r), c = Infinity, l = Infinity, u = -Infinity, d = -Infinity;
	for (n = 0; n < r; ++n) isNaN(i = +this._x.call(null, t = e[n])) || isNaN(a = +this._y.call(null, t)) || (o[n] = i, s[n] = a, i < c && (c = i), i > u && (u = i), a < l && (l = a), a > d && (d = a));
	if (c > u || l > d) return this;
	for (this.cover(c, l).cover(u, d), n = 0; n < r; ++n) zi(this, o[n], s[n], e[n]);
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/cover.js
function Vi(e, t) {
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
function Hi() {
	var e = [];
	return this.visit(function(t) {
		if (!t.length) do
			e.push(t.data);
		while (t = t.next);
	}), e;
}
//#endregion
//#region node_modules/d3-quadtree/src/extent.js
function Ui(e) {
	return arguments.length ? this.cover(+e[0][0], +e[0][1]).cover(+e[1][0], +e[1][1]) : isNaN(this._x0) ? void 0 : [[this._x0, this._y0], [this._x1, this._y1]];
}
//#endregion
//#region node_modules/d3-quadtree/src/quad.js
function G(e, t, n, r, i) {
	this.node = e, this.x0 = t, this.y0 = n, this.x1 = r, this.y1 = i;
}
//#endregion
//#region node_modules/d3-quadtree/src/find.js
function Wi(e, t, n) {
	var r, i = this._x0, a = this._y0, o, s, c, l, u = this._x1, d = this._y1, f = [], p = this._root, m, h;
	for (p && f.push(new G(p, i, a, u, d)), n == null ? n = Infinity : (i = e - n, a = t - n, u = e + n, d = t + n, n *= n); m = f.pop();) if (!(!(p = m.node) || (o = m.x0) > u || (s = m.y0) > d || (c = m.x1) < i || (l = m.y1) < a)) if (p.length) {
		var g = (o + c) / 2, _ = (s + l) / 2;
		f.push(new G(p[3], g, _, c, l), new G(p[2], o, _, g, l), new G(p[1], g, s, c, _), new G(p[0], o, s, g, _)), (h = (t >= _) << 1 | e >= g) && (m = f[f.length - 1], f[f.length - 1] = f[f.length - 1 - h], f[f.length - 1 - h] = m);
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
function Gi(e) {
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
function Ki(e) {
	for (var t = 0, n = e.length; t < n; ++t) this.remove(e[t]);
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/root.js
function qi() {
	return this._root;
}
//#endregion
//#region node_modules/d3-quadtree/src/size.js
function Ji() {
	var e = 0;
	return this.visit(function(t) {
		if (!t.length) do
			++e;
		while (t = t.next);
	}), e;
}
//#endregion
//#region node_modules/d3-quadtree/src/visit.js
function Yi(e) {
	var t = [], n, r = this._root, i, a, o, s, c;
	for (r && t.push(new G(r, this._x0, this._y0, this._x1, this._y1)); n = t.pop();) if (!e(r = n.node, a = n.x0, o = n.y0, s = n.x1, c = n.y1) && r.length) {
		var l = (a + s) / 2, u = (o + c) / 2;
		(i = r[3]) && t.push(new G(i, l, u, s, c)), (i = r[2]) && t.push(new G(i, a, u, l, c)), (i = r[1]) && t.push(new G(i, l, o, s, u)), (i = r[0]) && t.push(new G(i, a, o, l, u));
	}
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/visitAfter.js
function Xi(e) {
	var t = [], n = [], r;
	for (this._root && t.push(new G(this._root, this._x0, this._y0, this._x1, this._y1)); r = t.pop();) {
		var i = r.node;
		if (i.length) {
			var a, o = r.x0, s = r.y0, c = r.x1, l = r.y1, u = (o + c) / 2, d = (s + l) / 2;
			(a = i[0]) && t.push(new G(a, o, s, u, d)), (a = i[1]) && t.push(new G(a, u, s, c, d)), (a = i[2]) && t.push(new G(a, o, d, u, l)), (a = i[3]) && t.push(new G(a, u, d, c, l));
		}
		n.push(r);
	}
	for (; r = n.pop();) e(r.node, r.x0, r.y0, r.x1, r.y1);
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/x.js
function Zi(e) {
	return e[0];
}
function Qi(e) {
	return arguments.length ? (this._x = e, this) : this._x;
}
//#endregion
//#region node_modules/d3-quadtree/src/y.js
function $i(e) {
	return e[1];
}
function ea(e) {
	return arguments.length ? (this._y = e, this) : this._y;
}
//#endregion
//#region node_modules/d3-quadtree/src/quadtree.js
function ta(e, t, n) {
	var r = new na(t ?? Zi, n ?? $i, NaN, NaN, NaN, NaN);
	return e == null ? r : r.addAll(e);
}
function na(e, t, n, r, i, a) {
	this._x = e, this._y = t, this._x0 = n, this._y0 = r, this._x1 = i, this._y1 = a, this._root = void 0;
}
function ra(e) {
	for (var t = { data: e.data }, n = t; e = e.next;) n = n.next = { data: e.data };
	return t;
}
var K = ta.prototype = na.prototype;
K.copy = function() {
	var e = new na(this._x, this._y, this._x0, this._y0, this._x1, this._y1), t = this._root, n, r;
	if (!t) return e;
	if (!t.length) return e._root = ra(t), e;
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
	}) : t.target[i] = ra(r));
	return e;
}, K.add = Ri, K.addAll = Bi, K.cover = Vi, K.data = Hi, K.extent = Ui, K.find = Wi, K.remove = Gi, K.removeAll = Ki, K.root = qi, K.size = Ji, K.visit = Yi, K.visitAfter = Xi, K.x = Qi, K.y = ea;
//#endregion
//#region node_modules/d3-force/src/constant.js
function q(e) {
	return function() {
		return e;
	};
}
//#endregion
//#region node_modules/d3-force/src/jiggle.js
function J(e) {
	return (e() - .5) * 1e-6;
}
//#endregion
//#region node_modules/d3-force/src/collide.js
function ia(e) {
	return e.x + e.vx;
}
function aa(e) {
	return e.y + e.vy;
}
function oa(e) {
	var t, n, r, i = 1, a = 1;
	typeof e != "function" && (e = q(e == null ? 1 : +e));
	function o() {
		for (var e, o = t.length, c, l, u, d, f, p, m = 0; m < a; ++m) for (c = ta(t, ia, aa).visitAfter(s), e = 0; e < o; ++e) l = t[e], f = n[l.index], p = f * f, u = l.x + l.vx, d = l.y + l.vy, c.visit(h);
		function h(e, t, n, a, o) {
			var s = e.data, c = e.r, m = f + c;
			if (s) {
				if (s.index > l.index) {
					var h = u - s.x - s.vx, g = d - s.y - s.vy, _ = h * h + g * g;
					_ < m * m && (h === 0 && (h = J(r), _ += h * h), g === 0 && (g = J(r), _ += g * g), _ = (m - (_ = Math.sqrt(_))) / _ * i, l.vx += (h *= _) * (m = (c *= c) / (p + c)), l.vy += (g *= _) * m, s.vx -= h * (m = 1 - m), s.vy -= g * m);
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
		return arguments.length ? (e = typeof t == "function" ? t : q(+t), c(), o) : e;
	}, o;
}
//#endregion
//#region node_modules/d3-force/src/link.js
function sa(e) {
	return e.index;
}
function ca(e, t) {
	var n = e.get(t);
	if (!n) throw Error("node not found: " + t);
	return n;
}
function la(e) {
	var t = sa, n = d, r, i = q(30), a, o, s, c, l, u = 1;
	e ??= [];
	function d(e) {
		return 1 / Math.min(s[e.source.index], s[e.target.index]);
	}
	function f(t) {
		for (var n = 0, i = e.length; n < u; ++n) for (var o = 0, s, d, f, p, m, h, g; o < i; ++o) s = e[o], d = s.source, f = s.target, p = f.x + f.vx - d.x - d.vx || J(l), m = f.y + f.vy - d.y - d.vy || J(l), h = Math.sqrt(p * p + m * m), h = (h - a[o]) / h * t * r[o], p *= h, m *= h, f.vx -= p * (g = c[o]), f.vy -= m * g, d.vx += p * (g = 1 - g), d.vy += m * g;
	}
	function p() {
		if (o) {
			var n, i = o.length, l = e.length, u = new Map(o.map((e, n) => [t(e, n, o), e])), d;
			for (n = 0, s = Array(i); n < l; ++n) d = e[n], d.index = n, typeof d.source != "object" && (d.source = ca(u, d.source)), typeof d.target != "object" && (d.target = ca(u, d.target)), s[d.source.index] = (s[d.source.index] || 0) + 1, s[d.target.index] = (s[d.target.index] || 0) + 1;
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
		return arguments.length ? (n = typeof e == "function" ? e : q(+e), m(), f) : n;
	}, f.distance = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : q(+e), h(), f) : i;
	}, f;
}
//#endregion
//#region node_modules/d3-force/src/lcg.js
var ua = 1664525, da = 1013904223, fa = 4294967296;
function pa() {
	let e = 1;
	return () => (e = (ua * e + da) % fa) / fa;
}
//#endregion
//#region node_modules/d3-force/src/simulation.js
function ma(e) {
	return e.x;
}
function ha(e) {
	return e.y;
}
var ga = 10, _a = Math.PI * (3 - Math.sqrt(5));
function va(e) {
	var t, n = 1, r = .001, i = 1 - r ** (1 / 300), a = 0, o = .6, c = /* @__PURE__ */ new Map(), l = dr(f), u = s("tick", "end"), d = pa();
	e ??= [];
	function f() {
		p(), u.call("tick", t), n < r && (l.stop(), u.call("end", t));
	}
	function p(r) {
		var s, l = e.length, u;
		r === void 0 && (r = 1);
		for (var d = 0; d < r; ++d) for (n += (a - n) * i, c.forEach(function(e) {
			e(n);
		}), s = 0; s < l; ++s) u = e[s], u.fx == null ? u.x += u.vx *= o : (u.x = u.fx, u.vx = 0), u.fy == null ? u.y += u.vy *= o : (u.y = u.fy, u.vy = 0);
		return t;
	}
	function m() {
		for (var t = 0, n = e.length, r; t < n; ++t) {
			if (r = e[t], r.index = t, r.fx != null && (r.x = r.fx), r.fy != null && (r.y = r.fy), isNaN(r.x) || isNaN(r.y)) {
				var i = ga * Math.sqrt(.5 + t), a = t * _a;
				r.x = i * Math.cos(a), r.y = i * Math.sin(a);
			}
			(isNaN(r.vx) || isNaN(r.vy)) && (r.vx = r.vy = 0);
		}
	}
	function h(t) {
		return t.initialize && t.initialize(e, d), t;
	}
	return m(), t = {
		tick: p,
		restart: function() {
			return l.restart(f), t;
		},
		stop: function() {
			return l.stop(), t;
		},
		nodes: function(n) {
			return arguments.length ? (e = n, m(), c.forEach(h), t) : e;
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
			return arguments.length ? (d = e, c.forEach(h), t) : d;
		},
		force: function(e, n) {
			return arguments.length > 1 ? (n == null ? c.delete(e) : c.set(e, h(n)), t) : c.get(e);
		},
		find: function(t, n, r) {
			var i = 0, a = e.length, o, s, c, l, u;
			for (r == null ? r = Infinity : r *= r, i = 0; i < a; ++i) l = e[i], o = t - l.x, s = n - l.y, c = o * o + s * s, c < r && (u = l, r = c);
			return u;
		},
		on: function(e, n) {
			return arguments.length > 1 ? (u.on(e, n), t) : u.on(e);
		}
	};
}
//#endregion
//#region node_modules/d3-force/src/manyBody.js
function ya() {
	var e, t, n, r, i = q(-30), a, o = 1, s = Infinity, c = .81;
	function l(n) {
		var i, a = e.length, o = ta(e, ma, ha).visitAfter(d);
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
		if (p * p / c < m) return m < s && (d === 0 && (d = J(n), m += d * d), f === 0 && (f = J(n), m += f * f), m < o && (m = Math.sqrt(o * m)), t.vx += d * e.value * r / m, t.vy += f * e.value * r / m), !0;
		if (!(e.length || m >= s)) {
			(e.data !== t || e.next) && (d === 0 && (d = J(n), m += d * d), f === 0 && (f = J(n), m += f * f), m < o && (m = Math.sqrt(o * m)));
			do
				e.data !== t && (p = a[e.data.index] * r / m, t.vx += d * p, t.vy += f * p);
			while (e = e.next);
		}
	}
	return l.initialize = function(t, r) {
		e = t, n = r, u();
	}, l.strength = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : q(+e), u(), l) : i;
	}, l.distanceMin = function(e) {
		return arguments.length ? (o = e * e, l) : Math.sqrt(o);
	}, l.distanceMax = function(e) {
		return arguments.length ? (s = e * e, l) : Math.sqrt(s);
	}, l.theta = function(e) {
		return arguments.length ? (c = e * e, l) : Math.sqrt(c);
	}, l;
}
//#endregion
//#region node_modules/d3-force/src/x.js
function ba(e) {
	var t = q(.1), n, r, i;
	typeof e != "function" && (e = q(e == null ? 0 : +e));
	function a(e) {
		for (var t = 0, a = n.length, o; t < a; ++t) o = n[t], o.vx += (i[t] - o.x) * r[t] * e;
	}
	function o() {
		if (n) {
			var a, o = n.length;
			for (r = Array(o), i = Array(o), a = 0; a < o; ++a) r[a] = isNaN(i[a] = +e(n[a], a, n)) ? 0 : +t(n[a], a, n);
		}
	}
	return a.initialize = function(e) {
		n = e, o();
	}, a.strength = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : q(+e), o(), a) : t;
	}, a.x = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : q(+t), o(), a) : e;
	}, a;
}
//#endregion
//#region node_modules/d3-force/src/y.js
function xa(e) {
	var t = q(.1), n, r, i;
	typeof e != "function" && (e = q(e == null ? 0 : +e));
	function a(e) {
		for (var t = 0, a = n.length, o; t < a; ++t) o = n[t], o.vy += (i[t] - o.y) * r[t] * e;
	}
	function o() {
		if (n) {
			var a, o = n.length;
			for (r = Array(o), i = Array(o), a = 0; a < o; ++a) r[a] = isNaN(i[a] = +e(n[a], a, n)) ? 0 : +t(n[a], a, n);
		}
	}
	return a.initialize = function(e) {
		n = e, o();
	}, a.strength = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : q(+e), o(), a) : t;
	}, a.y = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : q(+t), o(), a) : e;
	}, a;
}
//#endregion
//#region node_modules/d3-zoom/src/constant.js
var Sa = (e) => () => e;
//#endregion
//#region node_modules/d3-zoom/src/event.js
function Ca(e, { sourceEvent: t, target: n, transform: r, dispatch: i }) {
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
function Y(e, t, n) {
	this.k = e, this.x = t, this.y = n;
}
Y.prototype = {
	constructor: Y,
	scale: function(e) {
		return e === 1 ? this : new Y(this.k * e, this.x, this.y);
	},
	translate: function(e, t) {
		return e === 0 & t === 0 ? this : new Y(this.k, this.x + this.k * e, this.y + this.k * t);
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
var wa = new Y(1, 0, 0);
Ta.prototype = Y.prototype;
function Ta(e) {
	for (; !e.__zoom;) if (!(e = e.parentNode)) return wa;
	return e.__zoom;
}
//#endregion
//#region node_modules/d3-zoom/src/noevent.js
function Ea(e) {
	e.stopImmediatePropagation();
}
function Da(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region node_modules/d3-zoom/src/zoom.js
function Oa(e) {
	return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function ka() {
	var e = this;
	return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function Aa() {
	return this.__zoom || wa;
}
function ja(e) {
	return -e.deltaY * (e.deltaMode === 1 ? .05 : e.deltaMode ? 1 : .002) * (e.ctrlKey ? 10 : 1);
}
function Ma() {
	return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Na(e, t, n) {
	var r = e.invertX(t[0][0]) - n[0][0], i = e.invertX(t[1][0]) - n[1][0], a = e.invertY(t[0][1]) - n[0][1], o = e.invertY(t[1][1]) - n[1][1];
	return e.translate(i > r ? (r + i) / 2 : Math.min(0, r) || Math.max(0, i), o > a ? (a + o) / 2 : Math.min(0, a) || Math.max(0, o));
}
function Pa() {
	var e = Oa, t = ka, n = Na, r = ja, i = Ma, a = [0, Infinity], o = [[-Infinity, -Infinity], [Infinity, Infinity]], c = 250, l = Qn, u = s("start", "zoom", "end"), d, f, p, m = 500, h = 150, g = 0, _ = 10;
	function v(e) {
		e.property("__zoom", Aa).on("wheel.zoom", te, { passive: !1 }).on("mousedown.zoom", ne).on("dblclick.zoom", re).filter(i).on("touchstart.zoom", ie).on("touchmove.zoom", ae).on("touchend.zoom touchcancel.zoom", oe).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	}
	v.transform = function(e, t, n, r) {
		var i = e.selection ? e.selection() : e;
		i.property("__zoom", Aa), e === i ? i.interrupt().each(function() {
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
			return n(wa.translate(c[0], c[1]).scale(s.k).translate(typeof r == "function" ? -r.apply(this, arguments) : -r, typeof i == "function" ? -i.apply(this, arguments) : -i), e, o);
		}, a, s);
	};
	function y(e, t) {
		return t = Math.max(a[0], Math.min(a[1], t)), t === e.k ? e : new Y(t, e.x, e.y);
	}
	function b(e, t, n) {
		var r = t[0] - n[0] * e.k, i = t[1] - n[1] * e.k;
		return r === e.x && i === e.y ? e : new Y(e.k, r, i);
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
			var e = this, a = arguments, o = C(e, a).event(i), s = t.apply(e, a), c = r == null ? x(s) : typeof r == "function" ? r.apply(e, a) : r, u = Math.max(s[1][0] - s[0][0], s[1][1] - s[0][1]), d = e.__zoom, f = typeof n == "function" ? n.apply(e, a) : n, p = l(d.invert(c).concat(u / d.k), f.invert(c).concat(u / f.k));
			return function(e) {
				if (e === 1) e = f;
				else {
					var t = p(e), n = u / t[2];
					e = new Y(n, c[0] - t[0] * n, c[1] - t[1] * n);
				}
				o.zoom(null, e);
			};
		});
	}
	function C(e, t, n) {
		return !n && e.__zooming || new ee(e, t);
	}
	function ee(e, n) {
		this.that = e, this.args = n, this.active = 0, this.sourceEvent = null, this.extent = t.apply(e, n), this.taps = 0;
	}
	ee.prototype = {
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
			var t = O(this.that).datum();
			u.call(e, this.that, new Ca(e, {
				sourceEvent: this.sourceEvent,
				target: v,
				type: e,
				transform: this.that.__zoom,
				dispatch: u
			}), t);
		}
	};
	function te(t, ...i) {
		if (!e.apply(this, arguments)) return;
		var s = C(this, i).event(t), c = this.__zoom, l = Math.max(a[0], Math.min(a[1], c.k * 2 ** r.apply(this, arguments))), u = k(t);
		if (s.wheel) (s.mouse[0][0] !== u[0] || s.mouse[0][1] !== u[1]) && (s.mouse[1] = c.invert(s.mouse[0] = u)), clearTimeout(s.wheel);
		else if (c.k === l) return;
		else s.mouse = [u, c.invert(u)], Cr(this), s.start();
		Da(t), s.wheel = setTimeout(d, h), s.zoom("mouse", n(b(y(c, l), s.mouse[0], s.mouse[1]), s.extent, o));
		function d() {
			s.wheel = null, s.end();
		}
	}
	function ne(t, ...r) {
		if (p || !e.apply(this, arguments)) return;
		var i = t.currentTarget, a = C(this, r, !0).event(t), s = O(t.view).on("mousemove.zoom", d, !0).on("mouseup.zoom", f, !0), c = k(t, i), l = t.clientX, u = t.clientY;
		zt(t.view), Ea(t), a.mouse = [c, this.__zoom.invert(c)], Cr(this), a.start();
		function d(e) {
			if (Da(e), !a.moved) {
				var t = e.clientX - l, r = e.clientY - u;
				a.moved = t * t + r * r > g;
			}
			a.event(e).zoom("mouse", n(b(a.that.__zoom, a.mouse[0] = k(e, i), a.mouse[1]), a.extent, o));
		}
		function f(e) {
			s.on("mousemove.zoom mouseup.zoom", null), Bt(e.view, a.moved), Da(e), a.event(e).end();
		}
	}
	function re(r, ...i) {
		if (e.apply(this, arguments)) {
			var a = this.__zoom, s = k(r.changedTouches ? r.changedTouches[0] : r, this), l = a.invert(s), u = a.k * (r.shiftKey ? .5 : 2), d = n(b(y(a, u), s, l), t.apply(this, i), o);
			Da(r), c > 0 ? O(this).transition().duration(c).call(S, d, s, r) : O(this).call(v.transform, d, s, r);
		}
	}
	function ie(t, ...n) {
		if (e.apply(this, arguments)) {
			var r = t.touches, i = r.length, a = C(this, n, t.changedTouches.length === i).event(t), o, s, c, l;
			for (Ea(t), s = 0; s < i; ++s) c = r[s], l = k(c, this), l = [
				l,
				this.__zoom.invert(l),
				c.identifier
			], a.touch0 ? !a.touch1 && a.touch0[2] !== l[2] && (a.touch1 = l, a.taps = 0) : (a.touch0 = l, o = !0, a.taps = 1 + !!d);
			d &&= clearTimeout(d), o && (a.taps < 2 && (f = l[0], d = setTimeout(function() {
				d = null;
			}, m)), Cr(this), a.start());
		}
	}
	function ae(e, ...t) {
		if (this.__zooming) {
			var r = C(this, t).event(e), i = e.changedTouches, a = i.length, s, c, l, u;
			for (Da(e), s = 0; s < a; ++s) c = i[s], l = k(c, this), r.touch0 && r.touch0[2] === c.identifier ? r.touch0[0] = l : r.touch1 && r.touch1[2] === c.identifier && (r.touch1[0] = l);
			if (c = r.that.__zoom, r.touch1) {
				var d = r.touch0[0], f = r.touch0[1], p = r.touch1[0], m = r.touch1[1], h = (h = p[0] - d[0]) * h + (h = p[1] - d[1]) * h, g = (g = m[0] - f[0]) * g + (g = m[1] - f[1]) * g;
				c = y(c, Math.sqrt(h / g)), l = [(d[0] + p[0]) / 2, (d[1] + p[1]) / 2], u = [(f[0] + m[0]) / 2, (f[1] + m[1]) / 2];
			} else if (r.touch0) l = r.touch0[0], u = r.touch0[1];
			else return;
			r.zoom("touch", n(b(c, l, u), r.extent, o));
		}
	}
	function oe(e, ...t) {
		if (this.__zooming) {
			var n = C(this, t).event(e), r = e.changedTouches, i = r.length, a, o;
			for (Ea(e), p && clearTimeout(p), p = setTimeout(function() {
				p = null;
			}, m), a = 0; a < i; ++a) o = r[a], n.touch0 && n.touch0[2] === o.identifier ? delete n.touch0 : n.touch1 && n.touch1[2] === o.identifier && delete n.touch1;
			if (n.touch1 && !n.touch0 && (n.touch0 = n.touch1, delete n.touch1), n.touch0) n.touch0[1] = this.__zoom.invert(n.touch0[0]);
			else if (n.end(), n.taps === 2 && (o = k(o, this), Math.hypot(f[0] - o[0], f[1] - o[1]) < _)) {
				var s = O(this).on("dblclick.zoom");
				s && s.apply(this, arguments);
			}
		}
	}
	return v.wheelDelta = function(e) {
		return arguments.length ? (r = typeof e == "function" ? e : Sa(+e), v) : r;
	}, v.filter = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : Sa(!!t), v) : e;
	}, v.touchable = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : Sa(!!e), v) : i;
	}, v.extent = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : Sa([[+e[0][0], +e[0][1]], [+e[1][0], +e[1][1]]]), v) : t;
	}, v.scaleExtent = function(e) {
		return arguments.length ? (a[0] = +e[0], a[1] = +e[1], v) : [a[0], a[1]];
	}, v.translateExtent = function(e) {
		return arguments.length ? (o[0][0] = +e[0][0], o[1][0] = +e[1][0], o[0][1] = +e[0][1], o[1][1] = +e[1][1], v) : [[o[0][0], o[0][1]], [o[1][0], o[1][1]]];
	}, v.constrain = function(e) {
		return arguments.length ? (n = e, v) : n;
	}, v.duration = function(e) {
		return arguments.length ? (c = +e, v) : c;
	}, v.interpolate = function(e) {
		return arguments.length ? (l = e, v) : l;
	}, v.on = function() {
		var e = u.on.apply(u, arguments);
		return e === u ? v : e;
	}, v.clickDistance = function(e) {
		return arguments.length ? (g = (e = +e) * e, v) : Math.sqrt(g);
	}, v.tapDistance = function(e) {
		return arguments.length ? (_ = +e, v) : _;
	}, v;
}
var Fa = {
	graphContainer: "_graphContainer_1dbdo_1",
	tooltip: "_tooltip_1dbdo_58",
	tooltipTitle: "_tooltipTitle_1dbdo_72",
	tooltipDesc: "_tooltipDesc_1dbdo_78",
	tooltipDate: "_tooltipDate_1dbdo_83"
}, Ia = /* @__PURE__ */ i(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
	function r(e, n, r) {
		var i = null;
		if (r !== void 0 && (i = "" + r), n.key !== void 0 && (i = "" + n.key), "key" in n) for (var a in r = {}, n) a !== "key" && (r[a] = n[a]);
		else r = n;
		return n = r.ref, {
			$$typeof: t,
			type: e,
			key: i,
			ref: n === void 0 ? null : n,
			props: r
		};
	}
	e.Fragment = n, e.jsx = r, e.jsxs = r;
})), La = /* @__PURE__ */ i(((e) => {
	process.env.NODE_ENV !== "production" && (function() {
		function t(e) {
			if (e == null) return null;
			if (typeof e == "function") return e.$$typeof === ae ? null : e.displayName || e.name || null;
			if (typeof e == "string") return e;
			switch (e) {
				case v: return "Fragment";
				case b: return "Profiler";
				case y: return "StrictMode";
				case ee: return "Suspense";
				case te: return "SuspenseList";
				case ie: return "Activity";
			}
			if (typeof e == "object") switch (typeof e.tag == "number" && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), e.$$typeof) {
				case _: return "Portal";
				case S: return e.displayName || "Context";
				case x: return (e._context.displayName || "Context") + ".Consumer";
				case C:
					var n = e.render;
					return e = e.displayName, e ||= (e = n.displayName || n.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
				case ne: return n = e.displayName || null, n === null ? t(e.type) || "Memo" : n;
				case re:
					n = e._payload, e = e._init;
					try {
						return t(e(n));
					} catch {}
			}
			return null;
		}
		function n(e) {
			return "" + e;
		}
		function r(e) {
			try {
				n(e);
				var t = !1;
			} catch {
				t = !0;
			}
			if (t) {
				t = console;
				var r = t.error, i = typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
				return r.call(t, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", i), n(e);
			}
		}
		function i(e) {
			if (e === v) return "<>";
			if (typeof e == "object" && e && e.$$typeof === re) return "<...>";
			try {
				var n = t(e);
				return n ? "<" + n + ">" : "<...>";
			} catch {
				return "<...>";
			}
		}
		function o() {
			var e = oe.A;
			return e === null ? null : e.getOwner();
		}
		function s() {
			return Error("react-stack-top-frame");
		}
		function c(e) {
			if (se.call(e, "key")) {
				var t = Object.getOwnPropertyDescriptor(e, "key").get;
				if (t && t.isReactWarning) return !1;
			}
			return e.key !== void 0;
		}
		function l(e, t) {
			function n() {
				ue || (ue = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", t));
			}
			n.isReactWarning = !0, Object.defineProperty(e, "key", {
				get: n,
				configurable: !0
			});
		}
		function u() {
			var e = t(this.type);
			return de[e] || (de[e] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release.")), e = this.props.ref, e === void 0 ? null : e;
		}
		function d(e, t, n, r, i, a) {
			var o = n.ref;
			return e = {
				$$typeof: g,
				type: e,
				key: t,
				props: n,
				_owner: r
			}, (o === void 0 ? null : o) === null ? Object.defineProperty(e, "ref", {
				enumerable: !1,
				value: null
			}) : Object.defineProperty(e, "ref", {
				enumerable: !1,
				get: u
			}), e._store = {}, Object.defineProperty(e._store, "validated", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: 0
			}), Object.defineProperty(e, "_debugInfo", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: null
			}), Object.defineProperty(e, "_debugStack", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: i
			}), Object.defineProperty(e, "_debugTask", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: a
			}), Object.freeze && (Object.freeze(e.props), Object.freeze(e)), e;
		}
		function f(e, n, i, a, s, u) {
			var f = n.children;
			if (f !== void 0) if (a) if (ce(f)) {
				for (a = 0; a < f.length; a++) p(f[a]);
				Object.freeze && Object.freeze(f);
			} else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
			else p(f);
			if (se.call(n, "key")) {
				f = t(e);
				var m = Object.keys(n).filter(function(e) {
					return e !== "key";
				});
				a = 0 < m.length ? "{key: someKey, " + m.join(": ..., ") + ": ...}" : "{key: someKey}", w[f + a] || (m = 0 < m.length ? "{" + m.join(": ..., ") + ": ...}" : "{}", console.error("A props object containing a \"key\" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />", a, f, m, f), w[f + a] = !0);
			}
			if (f = null, i !== void 0 && (r(i), f = "" + i), c(n) && (r(n.key), f = "" + n.key), "key" in n) for (var h in i = {}, n) h !== "key" && (i[h] = n[h]);
			else i = n;
			return f && l(i, typeof e == "function" ? e.displayName || e.name || "Unknown" : e), d(e, f, i, o(), s, u);
		}
		function p(e) {
			m(e) ? e._store && (e._store.validated = 1) : typeof e == "object" && e && e.$$typeof === re && (e._payload.status === "fulfilled" ? m(e._payload.value) && e._payload.value._store && (e._payload.value._store.validated = 1) : e._store && (e._store.validated = 1));
		}
		function m(e) {
			return typeof e == "object" && !!e && e.$$typeof === g;
		}
		var h = a("react"), g = Symbol.for("react.transitional.element"), _ = Symbol.for("react.portal"), v = Symbol.for("react.fragment"), y = Symbol.for("react.strict_mode"), b = Symbol.for("react.profiler"), x = Symbol.for("react.consumer"), S = Symbol.for("react.context"), C = Symbol.for("react.forward_ref"), ee = Symbol.for("react.suspense"), te = Symbol.for("react.suspense_list"), ne = Symbol.for("react.memo"), re = Symbol.for("react.lazy"), ie = Symbol.for("react.activity"), ae = Symbol.for("react.client.reference"), oe = h.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, se = Object.prototype.hasOwnProperty, ce = Array.isArray, le = console.createTask ? console.createTask : function() {
			return null;
		};
		h = { react_stack_bottom_frame: function(e) {
			return e();
		} };
		var ue, de = {}, fe = h.react_stack_bottom_frame.bind(h, s)(), pe = le(i(s)), w = {};
		e.Fragment = v, e.jsx = function(e, t, n) {
			var r = 1e4 > oe.recentlyCreatedOwnerStacks++;
			return f(e, t, n, !1, r ? Error("react-stack-top-frame") : fe, r ? le(i(e)) : pe);
		}, e.jsxs = function(e, t, n) {
			var r = 1e4 > oe.recentlyCreatedOwnerStacks++;
			return f(e, t, n, !0, r ? Error("react-stack-top-frame") : fe, r ? le(i(e)) : pe);
		};
	})();
})), X = (/* @__PURE__ */ i(((e, t) => {
	process.env.NODE_ENV === "production" ? t.exports = Ia() : t.exports = La();
})))();
function Ra(e, t = {}) {
	let n = [], r = [], i = /* @__PURE__ */ new Map(), a = t.nodeDraftColor || "#555", o = t.nodePublishedColor || "#2ecc71", s = t.tagColor || "#f39c12";
	for (let t of e.items) {
		let e = t.url.split("/").pop().replace(".html", ""), c = t._status || "draft";
		n.push({
			id: e,
			label: e,
			title: t.title,
			short_title: t.short_title || "",
			type: "article",
			url: t.url,
			description: t.summary || "",
			tldr: t.tldr || "",
			image: t.image || "",
			date: t.date_published ? t.date_published.split("T")[0] : "",
			reading_time: t.reading_time || "",
			tags: t.tags || [],
			series: t.series || "",
			license: t.license || "",
			canonical_url: t.canonical_url || t.url,
			syndication: t.syndication || {},
			size: 60,
			color: c === "published" ? o : a,
			kind: t.kind || "essay",
			substrate: t.substrate || "essay",
			seed: t.seed || "",
			topology: t.topology || [],
			energy: t.energy || "",
			connected_to: t.connected_to || [],
			forms: t.forms || {},
			note: t.note || "",
			todos: t.todos || [],
			originalItem: t
		});
		for (let n of t.tags || []) i.has(n) || i.set(n, {
			id: "tag:" + n,
			label: n,
			type: "tag",
			size: 30,
			color: s
		}), r.push({
			source: e,
			target: "tag:" + n
		});
	}
	return n.push(...i.values()), {
		nodes: n,
		links: r
	};
}
function za({ feedData: e, onNodeSelect: i }) {
	let a = n(null), o = n(null), s = n(null), c = n(null), l = n(null), [u, d] = r({
		show: !1,
		x: 0,
		y: 0,
		title: "",
		desc: "",
		date: ""
	});
	return t(() => {
		if (!e || !a.current) return;
		let t = a.current, n = t.clientWidth, r = t.clientHeight, o = getComputedStyle(t), u = {
			nodeDraftColor: o.getPropertyValue("--gv-node-draft").trim() || "#555",
			nodePublishedColor: o.getPropertyValue("--gv-node-published").trim() || "#2ecc71",
			tagColor: o.getPropertyValue("--gv-tag-color").trim() || "#f39c12"
		}, f = Ra(e, u);
		O(t).selectAll("svg").remove();
		let p = O(t).append("svg").attr("width", n).attr("height", r).call(Pa().on("zoom", (e) => {
			m.attr("transform", e.transform);
		})).on("dblclick.zoom", null);
		s.current = p;
		let m = p.append("g"), h = va().force("link", la().id((e) => e.id).distance(160)).force("charge", ya().strength(-500)).force("collide", oa().radius((e) => (e._r || e.size / 2) + 8).strength(.9)).force("center", Li(n / 2, r / 2)).velocityDecay(.85).alphaDecay(.05);
		c.current = h;
		let g = () => {
			a.current && (n = a.current.clientWidth, r = a.current.clientHeight, p.attr("width", n).attr("height", r), h.force("center", Li(n / 2, r / 2)), h.alpha(.1).restart());
		};
		window.addEventListener("resize", g), l.current = g;
		let _ = m.selectAll(".link").data(f.links).enter().append("line").attr("class", "link"), v = m.selectAll(".node").data(f.nodes).enter().append("g").attr("class", "node").call(qt().on("start", (e, t) => {
			e.active || h.alphaTarget(.3).restart(), t.fx = t.x, t.fy = t.y;
		}).on("drag", (e, t) => {
			t.fx = e.x, t.fy = e.y;
		}).on("end", (e, t) => {
			e.active || h.alphaTarget(0), t.fx = null, t.fy = null;
		})), y = p.append("text").style("font-family", "'Atkinson', sans-serif").style("visibility", "hidden");
		v.each(function(e) {
			let t = O(this);
			if (e.type === "tag") {
				y.style("font-size", "14px").style("font-weight", "400"), y.text(e.label);
				let n = y.node().getComputedTextLength() + 28, r = 35.599999999999994;
				t.append("rect").attr("x", -n / 2).attr("y", -r / 2).attr("width", n).attr("height", r).attr("rx", r / 2).attr("ry", r / 2).attr("fill", e.color).attr("opacity", .7), t.append("text").attr("text-anchor", "middle").attr("dominant-baseline", "central").attr("fill", "#1a1a2e").style("font-size", "14px").style("font-weight", "400").style("pointer-events", "none").text(e.label), e._r = Math.max(n, r) / 2;
			} else {
				let n = e.color === u.nodeDraftColor, r = n ? "#555" : u.nodePublishedColor;
				if (e.kind === "image" && e.image) t.append("foreignObject").attr("width", 180).attr("height", 204).attr("x", -180 / 2).attr("y", -180 / 2).append("xhtml:div").attr("xmlns", "http://www.w3.org/1999/xhtml").style("width", "180px").style("font-family", "'Atkinson', sans-serif").style("cursor", "pointer").html("<div style=\"width:180px;height:180px;background:#000 url('" + e.image + "') center/cover no-repeat;border:1.5px solid " + r + ";border-radius:4px;\"></div><div style=\"font-size:11px;color:rgba(255,255,255,0.6);text-align:center;margin-top:4px;line-height:1.2;\">" + (e.short_title || e.title || e.label) + "</div>"), e._r = 102;
				else {
					let i = n ? "#2a2a3e" : "#1e3a5f", a = e.image ? "linear-gradient(" + (n ? "rgba(42,42,62,0.85),rgba(42,42,62,0.85)" : "rgba(30,58,95,0.85),rgba(30,58,95,0.85)") + "), url('" + e.image + "')" : i, o = e.description || "";
					t.append("foreignObject").attr("width", 180).attr("height", 140).attr("x", -180 / 2).attr("y", -140 / 2).append("xhtml:div").attr("xmlns", "http://www.w3.org/1999/xhtml").style("width", "180px").style("height", "140px").style("background", a).style("background-size", "cover").style("background-position", "center").style("border", "1.5px solid " + r).style("border-radius", "4px").style("padding", "10px 12px").style("box-sizing", "border-box").style("overflow", "hidden").style("font-family", "'Atkinson', sans-serif").style("cursor", "pointer").html((() => {
						let t = o.length > 120 ? o.slice(0, 117) + "..." : o;
						return "<span style=\"font-size:15px;font-weight:700;color:#fff;line-height:1.3;\">" + (e.title || e.label) + "</span>" + (t ? "<br><span style=\"zoom:0.65;font-size:15px;color:rgba(255,255,255,0.35);line-height:1.3;font-style:italic;\">" + t + "</span>" : "");
					})()), e._r = 180 / 2;
				}
			}
		}), y.remove(), v.filter((e) => e.type === "article").on("click", (e, t) => {
			i && i(t.originalItem || t);
		}).on("mouseover", (e, t) => {
			d({
				show: !0,
				x: e.clientX + 16,
				y: e.clientY + 16,
				title: t.title || t.label,
				desc: t.description || "",
				date: t.date || ""
			});
		}).on("mousemove", (e) => {
			d((t) => ({
				...t,
				x: e.clientX + 16,
				y: e.clientY + 16
			}));
		}).on("mouseout", () => {
			d((e) => ({
				...e,
				show: !1
			}));
		});
		let b = null;
		return v.filter((e) => e.type === "tag").on("click", (e, t) => {
			if (e.stopPropagation(), b === t.id) b = null, v.classed("dimmed", !1).classed("tag-active", !1), _.classed("highlighted", !1), h.force("x", null).force("y", null), h.alpha(.4).restart();
			else {
				b = t.id;
				let e = new Set(f.links.filter((e) => {
					let n = typeof e.source == "object" ? e.source.id : e.source, r = typeof e.target == "object" ? e.target.id : e.target;
					return n === t.id || r === t.id;
				}).map((e) => {
					let n = typeof e.source == "object" ? e.source.id : e.source, r = typeof e.target == "object" ? e.target.id : e.target;
					return n === t.id ? r : n;
				}));
				e.add(t.id), v.classed("dimmed", (t) => !e.has(t.id)), v.classed("tag-active", (e) => e.id === t.id), _.classed("highlighted", (e) => {
					let n = typeof e.source == "object" ? e.source.id : e.source, r = typeof e.target == "object" ? e.target.id : e.target;
					return n === t.id || r === t.id;
				});
				let i = n / 2, a = r / 2;
				h.force("x", ba((t) => e.has(t.id) ? i : t.x < i ? i - 500 : i + 500).strength((t) => e.has(t.id) ? .3 : .15)).force("y", xa(a).strength((t) => e.has(t.id) ? .3 : .1)), h.alpha(.6).restart();
			}
		}), p.on("click", () => {
			b && (b = null, v.classed("dimmed", !1).classed("tag-active", !1), _.classed("highlighted", !1), h.force("x", null).force("y", null), h.alpha(.4).restart());
		}), h.nodes(f.nodes).on("tick", () => {
			_.attr("x1", (e) => e.source.x).attr("y1", (e) => e.source.y).attr("x2", (e) => e.target.x).attr("y2", (e) => e.target.y), v.attr("transform", (e) => "translate(" + e.x + "," + e.y + ")");
		}), h.force("link").links(f.links), () => {
			h.stop(), l.current && window.removeEventListener("resize", l.current);
		};
	}, [e, i]), /* @__PURE__ */ (0, X.jsxs)(X.Fragment, { children: [/* @__PURE__ */ (0, X.jsx)("div", {
		ref: a,
		className: Fa.graphContainer
	}), u.show && /* @__PURE__ */ (0, X.jsxs)("div", {
		ref: o,
		className: Fa.tooltip,
		style: {
			display: "block",
			left: u.x,
			top: u.y
		},
		children: [
			/* @__PURE__ */ (0, X.jsx)("div", {
				className: Fa.tooltipTitle,
				children: u.title
			}),
			/* @__PURE__ */ (0, X.jsx)("div", {
				className: Fa.tooltipDesc,
				children: u.desc
			}),
			/* @__PURE__ */ (0, X.jsx)("div", {
				className: Fa.tooltipDate,
				children: u.date
			})
		]
	})] });
}
var Z = {
	overlay: "_overlay_10whd_1",
	open: "_open_10whd_13",
	panel: "_panel_10whd_17",
	toolbar: "_toolbar_10whd_52",
	toolbarGroup: "_toolbarGroup_10whd_63",
	toolbarSeparator: "_toolbarSeparator_10whd_69",
	toolbarSpacer: "_toolbarSpacer_10whd_76",
	tb: "_tb_10whd_80",
	active: "_active_10whd_102",
	closeBtn: "_closeBtn_10whd_107",
	tbTooltip: "_tbTooltip_10whd_122",
	syndLink: "_syndLink_10whd_142",
	canonical: "_canonical_10whd_160",
	progress: "_progress_10whd_176",
	progressFill: "_progressFill_10whd_182",
	frontmatterPanel: "_frontmatterPanel_10whd_189",
	fmRow: "_fmRow_10whd_203",
	fmLabel: "_fmLabel_10whd_210",
	fmValue: "_fmValue_10whd_219",
	fmTag: "_fmTag_10whd_223",
	fmSyndLink: "_fmSyndLink_10whd_233",
	body: "_body_10whd_243",
	articleHeader: "_articleHeader_10whd_290",
	articleTitle: "_articleTitle_10whd_294",
	articleByline: "_articleByline_10whd_302",
	articleMeta: "_articleMeta_10whd_317",
	copyToast: "_copyToast_10whd_322",
	show: "_show_10whd_338"
}, Q = {
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
	youtube: "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z\"/><polygon fill=\"#fff\" points=\"9.545,15.568 15.818,12 9.545,8.432\"/></svg>"
};
//#endregion
//#region src/components/ReaderPanel/ReaderPanel.jsx
function Ba({ article: e, onClose: i, settings: a }) {
	let [o, s] = r(!1), [c, l] = r(!1), [u, d] = r(""), [f, p] = r(0), [m, h] = r(!1), g = n(null);
	t(() => {
		e ? (s(!0), _(e)) : (s(!1), d(""), p(0), l(!1));
	}, [e]);
	let _ = async (e) => {
		let t = e.kind || "essay";
		if (t === "essay" || t === "multi") try {
			let t = await fetch(e.url);
			if (!t.ok) throw Error("HTTP " + t.status);
			let n = await t.text(), r = new DOMParser().parseFromString(n, "text/html"), i = r.querySelector("h1");
			i && i.remove(), d((r.querySelector("body") ? r.querySelector("body").innerHTML : n) + Ha(e));
		} catch {
			d(Va(e, "Rendered article not yet published to GitHub Pages."));
		}
		else d(t === "image" ? (e.image ? `<img src="${e.image}" style="max-width:100%;height:auto;border-radius:4px;display:block;margin:0 auto;">` : "<p style=\"color:#666;\">No image resolved.</p>") + Ua(e) : Va(e) + Ua(e));
	}, v = () => {
		if (g.current) {
			let { scrollTop: e, scrollHeight: t, clientHeight: n } = g.current, r = e / (t - n) * 100;
			p(Math.min(r, 100));
		}
	}, y = async () => {
		if (!e || !g.current) return;
		let t = `${(a?.export?.license_header || "").replace("{{canonical_url}}", e.canonical_url || e.url)}\n\n---\n\n${g.current.innerText}`;
		try {
			await navigator.clipboard.writeText(t), h(!0), setTimeout(() => h(!1), 2e3);
		} catch (e) {
			console.error("Copy failed:", e);
		}
	}, b = () => {
		if (!e || !g.current) return;
		let t = `${(a?.export?.license_header || "").replace("{{canonical_url}}", e.canonical_url || e.url)}\n\n---\n\n${g.current.innerText}`, n = new Blob([t], { type: "text/markdown" }), r = document.createElement("a");
		r.href = URL.createObjectURL(n), r.download = `${(e.id || e.url).split("/").pop().replace(".html", "") || "article"}.md`, r.click(), URL.revokeObjectURL(r.href);
	}, x = async (t) => {
		if (t.preventDefault(), e) try {
			await navigator.clipboard.writeText(e.canonical_url || e.url), h(!0), setTimeout(() => h(!1), 2e3);
		} catch (e) {
			console.error("Copy URL failed:", e);
		}
	};
	if (!e) return null;
	let S = [e.date ? (/* @__PURE__ */ new Date(`${e.date}T00:00:00`)).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	}) : "", e.reading_time].filter(Boolean);
	return /* @__PURE__ */ (0, X.jsxs)(X.Fragment, { children: [
		/* @__PURE__ */ (0, X.jsx)("div", {
			className: `${Z.overlay} ${o ? Z.open : ""}`,
			onClick: i
		}),
		/* @__PURE__ */ (0, X.jsxs)("div", {
			className: `${Z.panel} ${o ? Z.open : ""}`,
			children: [
				/* @__PURE__ */ (0, X.jsxs)("div", {
					className: Z.toolbar,
					children: [
						/* @__PURE__ */ (0, X.jsx)("div", {
							id: "tts-mount-point",
							className: Z.toolbarGroup
						}),
						/* @__PURE__ */ (0, X.jsx)("div", { className: Z.toolbarSeparator }),
						/* @__PURE__ */ (0, X.jsxs)("div", {
							className: Z.toolbarGroup,
							children: [
								/* @__PURE__ */ (0, X.jsx)("button", {
									className: `${Z.tb} ${c ? Z.active : ""}`,
									onClick: () => l(!c),
									title: "Article details",
									dangerouslySetInnerHTML: { __html: `${Q.info}<span class="${Z.tbTooltip}">Details</span>` }
								}),
								/* @__PURE__ */ (0, X.jsx)("button", {
									className: Z.tb,
									onClick: b,
									title: "Export markdown",
									dangerouslySetInnerHTML: { __html: `${Q.download}<span class="${Z.tbTooltip}">Export</span>` }
								}),
								/* @__PURE__ */ (0, X.jsx)("button", {
									className: Z.tb,
									onClick: y,
									title: "Copy to clipboard",
									dangerouslySetInnerHTML: { __html: `${Q.copy}<span class="${Z.tbTooltip}">Copy</span>` }
								})
							]
						}),
						/* @__PURE__ */ (0, X.jsx)("div", { className: Z.toolbarSeparator }),
						/* @__PURE__ */ (0, X.jsxs)("div", {
							className: Z.toolbarGroup,
							children: [/* @__PURE__ */ (0, X.jsx)("button", {
								className: `${Z.tb} ${Z.syndLink} ${Z.canonical}`,
								onClick: x,
								dangerouslySetInnerHTML: { __html: `${Q.link}<span class="${Z.tbTooltip}">Copy URL</span>` }
							}), Object.entries(e.syndication || {}).map(([e, t]) => {
								if (!t) return null;
								let n = a?.toolbar?.syndication_icons?.[e];
								return n ? /* @__PURE__ */ (0, X.jsx)("a", {
									href: t,
									target: "_blank",
									rel: "noopener noreferrer",
									className: `${Z.tb} ${Z.syndLink}`,
									dangerouslySetInnerHTML: { __html: `${Q[n.icon] || Q.globe}<span class="${Z.tbTooltip}">${n.label}</span>` }
								}, e) : null;
							})]
						}),
						/* @__PURE__ */ (0, X.jsx)("div", { className: Z.toolbarSpacer }),
						/* @__PURE__ */ (0, X.jsx)("button", {
							className: `${Z.tb} ${Z.closeBtn}`,
							onClick: i,
							title: "Close",
							dangerouslySetInnerHTML: { __html: `${Q.close}<span class="${Z.tbTooltip}">Close</span>` }
						})
					]
				}),
				/* @__PURE__ */ (0, X.jsx)("div", {
					className: Z.progress,
					children: /* @__PURE__ */ (0, X.jsx)("div", {
						className: Z.progressFill,
						style: { width: `${f}%` }
					})
				}),
				c && /* @__PURE__ */ (0, X.jsx)(Wa, {
					article: e,
					settings: a
				}),
				/* @__PURE__ */ (0, X.jsxs)("div", {
					className: Z.body,
					ref: g,
					onScroll: v,
					children: [/* @__PURE__ */ (0, X.jsxs)("div", {
						className: Z.articleHeader,
						children: [
							/* @__PURE__ */ (0, X.jsx)("div", {
								className: Z.articleTitle,
								children: e.title || e.label
							}),
							/* @__PURE__ */ (0, X.jsxs)("div", {
								className: Z.articleByline,
								children: ["by ", /* @__PURE__ */ (0, X.jsx)("a", {
									href: a?.author?.url,
									target: "_blank",
									rel: "noopener noreferrer",
									children: a?.author?.display
								})]
							}),
							S.length > 0 && /* @__PURE__ */ (0, X.jsx)("div", {
								className: Z.articleMeta,
								children: S.join(" · ")
							}),
							e.kind && e.kind !== "essay" && /* @__PURE__ */ (0, X.jsxs)("div", {
								className: Z.articleMeta,
								style: {
									marginTop: 4,
									opacity: .7
								},
								children: ["substrate: ", e.kind]
							})
						]
					}), /* @__PURE__ */ (0, X.jsx)("div", { dangerouslySetInnerHTML: { __html: u } })]
				})
			]
		}),
		/* @__PURE__ */ (0, X.jsx)("div", {
			className: `${Z.copyToast} ${m ? Z.show : ""}`,
			children: "Copied to clipboard"
		})
	] });
}
function Va(e, t) {
	let n = t || `This substrate ("${e.kind || "unknown"}") is not yet renderable in the viewer.`, r = "<div style=\"padding:24px;border:1px dashed var(--rp-border);border-radius:6px;background:rgba(17,24,39,0.4);\">";
	return r += `<p style="color:var(--rp-accent);font-weight:600;margin-bottom:8px;">${n}</p>`, e.todos && e.todos.length && (r += `<p style="color:#f39c12;font-size:13px;">Pending: ${e.todos.join(", ")}</p>`), r += `<p style="color:#888;font-size:13px;margin-top:12px;">The folder exists at <code>~/Posts/${e.id}/</code>.</p>`, r += "</div>", r;
}
function Ha(e) {
	let t = e.forms && e.forms.companions || [];
	if (!t.length) return "";
	let n = "<div style=\"margin-top:32px;padding-top:24px;border-top:1px solid var(--rp-border);\">";
	return n += "<div style=\"color:var(--rp-accent);font-size:11px;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;\">also exists as</div>", n += `<div style="color:var(--rp-text);font-size:14px;">${t.map((e) => `<span class="${Z.fmTag}">${e}</span>`).join(" ")}</div>`, n += "</div>", n;
}
function Ua(e) {
	let t = [];
	if (e.seed && t.push(["seed", e.seed]), e.tldr && t.push(["tldr", e.tldr]), e.topology && e.topology.length && t.push(["topology", e.topology.join(" · ")]), e.energy && t.push(["energy", e.energy]), e.note && t.push(["note", e.note]), !t.length) return "";
	let n = "<div style=\"margin-top:32px;padding:20px;background:rgba(17,24,39,0.4);border-radius:6px;\">";
	for (let [e, r] of t) n += `<div class="${Z.fmRow}"><span class="${Z.fmLabel}">${e}</span><span class="${Z.fmValue}">${r}</span></div>`;
	return n += "</div>", n;
}
function Wa({ article: t, settings: n }) {
	let r = n?.frontmatter_display || [], i = !1, a = r.map((n) => {
		let r = "";
		switch (n) {
			case "publish_date":
				t.date && (r = (/* @__PURE__ */ new Date(`${t.date}T00:00:00`)).toLocaleDateString("en-US", {
					year: "numeric",
					month: "long",
					day: "numeric"
				}));
				break;
			case "updated_date":
				t.updated_date && (r = t.updated_date);
				break;
			case "reading_time":
				r = t.reading_time || "";
				break;
			case "tags":
				t.tags && t.tags.length && (r = /* @__PURE__ */ (0, X.jsx)(X.Fragment, { children: t.tags.map((e) => /* @__PURE__ */ (0, X.jsx)("span", {
					className: Z.fmTag,
					children: e
				}, e)) }));
				break;
			case "series":
				r = t.series || "";
				break;
			case "license":
				r = t.license || "";
				break;
			case "syndication":
				let n = t.syndication || {}, i = Object.entries(n).filter(([, e]) => e);
				i.length && (r = /* @__PURE__ */ (0, X.jsx)(X.Fragment, { children: i.map(([t, n], r) => /* @__PURE__ */ (0, X.jsxs)(e.Fragment, { children: [/* @__PURE__ */ (0, X.jsx)("a", {
					className: Z.fmSyndLink,
					href: n,
					target: "_blank",
					rel: "noopener noreferrer",
					children: t
				}), r < i.length - 1 ? " · " : ""] }, t)) }));
				break;
			default: break;
		}
		return r ? (i = !0, /* @__PURE__ */ (0, X.jsxs)("div", {
			className: Z.fmRow,
			children: [/* @__PURE__ */ (0, X.jsx)("span", {
				className: Z.fmLabel,
				children: n.replace(/_/g, " ")
			}), /* @__PURE__ */ (0, X.jsx)("span", {
				className: Z.fmValue,
				children: r
			})]
		}, n)) : null;
	});
	return /* @__PURE__ */ (0, X.jsx)("div", {
		className: `${Z.frontmatterPanel} ${Z.open}`,
		children: i ? a : /* @__PURE__ */ (0, X.jsx)("div", {
			className: Z.fmRow,
			children: /* @__PURE__ */ (0, X.jsx)("span", {
				className: Z.fmValue,
				style: { color: "#666" },
				children: "No metadata available."
			})
		})
	});
}
var $ = {
	ttsGroup: "_ttsGroup_18p74_1",
	tb: "_tb_18p74_12",
	tbTooltip: "_tbTooltip_18p74_39",
	select: "_select_18p74_59",
	params: "_params_18p74_76"
};
//#endregion
//#region src/components/TTS/TTS.jsx
function Ga({ targetRef: e }) {
	let [n, i] = r(null), [a, o] = r("stopped"), [s, c] = r([]), [l, u] = r(""), [d, f] = r([]), [p, m] = r(""), [h, g] = r({}), [_, v] = r({});
	t(() => {
		if (!window.TTS) return;
		let e = window.TTS;
		i(e);
		let t = (e) => o(e), n = () => {
			c(e.engines()), u(e.selected());
		}, r = () => {
			f(e.voices()), g(e.capabilities());
			let t = {}, n = e.capabilities();
			for (let r of Object.keys(n)) r === "voice" ? m(e.get("voice") || n.voice.default) : t[r] = e.get(r) === void 0 ? n[r].default : e.get(r);
			v(t);
		};
		return e.on("state", t), e.on("capabilitiesChanged", r), n(), r(), window.speechSynthesis && window.speechSynthesis.addEventListener("voiceschanged", r), () => {
			window.speechSynthesis && window.speechSynthesis.removeEventListener("voiceschanged", r);
		};
	}, []);
	let y = (e) => {
		if (!n) return;
		let t = e.target.value;
		n.select(t), u(t), f(n.voices()), g(n.capabilities());
	}, b = (e) => {
		if (!n) return;
		let t = e.target.value;
		n.set("voice", t), m(t);
	}, x = (e, t) => {
		n && (n.set(e, t), v((n) => ({
			...n,
			[e]: t
		})));
	};
	return n ? /* @__PURE__ */ (0, X.jsxs)("div", {
		className: $.ttsGroup,
		children: [
			a !== "playing" && /* @__PURE__ */ (0, X.jsx)("button", {
				className: $.tb,
				onClick: () => {
					!n || !e.current || n.play(e.current, { scrollContainer: e.current });
				},
				title: "Play",
				dangerouslySetInnerHTML: { __html: `${Q.play}<span class="${$.tbTooltip}">Play</span>` }
			}),
			a === "playing" && /* @__PURE__ */ (0, X.jsx)("button", {
				className: $.tb,
				onClick: () => {
					n && n.pause();
				},
				title: "Pause",
				dangerouslySetInnerHTML: { __html: `${Q.pause}<span class="${$.tbTooltip}">Pause</span>` }
			}),
			(a === "playing" || a === "paused" || a === "loading") && /* @__PURE__ */ (0, X.jsx)("button", {
				className: $.tb,
				onClick: () => {
					n && n.stop();
				},
				title: "Stop",
				dangerouslySetInnerHTML: { __html: `${Q.stop}<span class="${$.tbTooltip}">Stop</span>` }
			}),
			/* @__PURE__ */ (0, X.jsx)("select", {
				className: $.select,
				style: { maxWidth: 110 },
				value: l,
				onChange: y,
				title: "TTS Engine",
				children: s.map((e) => /* @__PURE__ */ (0, X.jsx)("option", {
					value: e.id,
					children: e.label
				}, e.id))
			}),
			/* @__PURE__ */ (0, X.jsx)("select", {
				className: $.select,
				value: p,
				onChange: b,
				title: "Voice",
				children: (() => {
					if (!d.length) return /* @__PURE__ */ (0, X.jsx)("option", { children: "Loading..." });
					if (d.some((e) => e.lang)) {
						let e = {};
						return d.forEach((t) => {
							let n = t.lang || "other";
							(e[n] = e[n] || []).push(t);
						}), Object.keys(e).sort().map((t) => /* @__PURE__ */ (0, X.jsx)("optgroup", {
							label: t,
							children: e[t].map((e) => /* @__PURE__ */ (0, X.jsx)("option", {
								value: e.id,
								children: e.label
							}, e.id))
						}, t));
					}
					return d.map((e) => /* @__PURE__ */ (0, X.jsx)("option", {
						value: e.id,
						children: e.label
					}, e.id));
				})()
			}),
			/* @__PURE__ */ (0, X.jsx)("div", {
				className: $.params,
				children: Object.entries(h).map(([e, t]) => !t || e === "voice" ? null : t.type === "range" ? /* @__PURE__ */ (0, X.jsxs)("label", {
					title: `${t.label}: ${_[e]}`,
					children: [t.label, /* @__PURE__ */ (0, X.jsx)("input", {
						type: "range",
						min: t.min,
						max: t.max,
						step: t.step || .1,
						value: _[e] ?? t.default,
						onChange: (t) => x(e, parseFloat(t.target.value))
					})]
				}, e) : t.type === "select" ? /* @__PURE__ */ (0, X.jsxs)("label", { children: [t.label, /* @__PURE__ */ (0, X.jsx)("select", {
					value: _[e] ?? t.default,
					onChange: (t) => x(e, t.target.value),
					children: t.options.map((e) => /* @__PURE__ */ (0, X.jsx)("option", {
						value: e.value,
						children: e.label
					}, e.value))
				})] }, e) : null)
			})
		]
	}) : null;
}
//#endregion
export { za as GraphViewer, Ba as ReaderPanel, Ga as TTS };
