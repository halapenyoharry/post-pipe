//#region \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), s = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, c = (n, r, a) => (a = n == null ? {} : e(i(n)), s(r || !n || !n.__esModule ? t(a, "default", {
	value: n,
	enumerable: !0
}) : a, n)), l = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), o = Symbol.for("react.consumer"), s = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), l = Symbol.for("react.suspense"), u = Symbol.for("react.memo"), d = Symbol.for("react.lazy"), f = Symbol.for("react.activity"), p = Symbol.iterator;
	function m(e) {
		return typeof e != "object" || !e ? null : (e = p && e[p] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var h = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	}, g = Object.assign, _ = {};
	function v(e, t, n) {
		this.props = e, this.context = t, this.refs = _, this.updater = n || h;
	}
	v.prototype.isReactComponent = {}, v.prototype.setState = function(e, t) {
		if (typeof e != "object" && typeof e != "function" && e != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, e, t, "setState");
	}, v.prototype.forceUpdate = function(e) {
		this.updater.enqueueForceUpdate(this, e, "forceUpdate");
	};
	function y() {}
	y.prototype = v.prototype;
	function b(e, t, n) {
		this.props = e, this.context = t, this.refs = _, this.updater = n || h;
	}
	var x = b.prototype = new y();
	x.constructor = b, g(x, v.prototype), x.isPureReactComponent = !0;
	var S = Array.isArray;
	function C() {}
	var w = {
		H: null,
		A: null,
		T: null,
		S: null
	}, T = Object.prototype.hasOwnProperty;
	function E(e, n, r) {
		var i = r.ref;
		return {
			$$typeof: t,
			type: e,
			key: n,
			ref: i === void 0 ? null : i,
			props: r
		};
	}
	function D(e, t) {
		return E(e.type, t, e.props);
	}
	function O(e) {
		return typeof e == "object" && !!e && e.$$typeof === t;
	}
	function k(e) {
		var t = {
			"=": "=0",
			":": "=2"
		};
		return "$" + e.replace(/[=:]/g, function(e) {
			return t[e];
		});
	}
	var ee = /\/+/g;
	function te(e, t) {
		return typeof e == "object" && e && e.key != null ? k("" + e.key) : t.toString(36);
	}
	function ne(e) {
		switch (e.status) {
			case "fulfilled": return e.value;
			case "rejected": throw e.reason;
			default: switch (typeof e.status == "string" ? e.then(C, C) : (e.status = "pending", e.then(function(t) {
				e.status === "pending" && (e.status = "fulfilled", e.value = t);
			}, function(t) {
				e.status === "pending" && (e.status = "rejected", e.reason = t);
			})), e.status) {
				case "fulfilled": return e.value;
				case "rejected": throw e.reason;
			}
		}
		throw e;
	}
	function re(e, r, i, a, o) {
		var s = typeof e;
		(s === "undefined" || s === "boolean") && (e = null);
		var c = !1;
		if (e === null) c = !0;
		else switch (s) {
			case "bigint":
			case "string":
			case "number":
				c = !0;
				break;
			case "object": switch (e.$$typeof) {
				case t:
				case n:
					c = !0;
					break;
				case d: return c = e._init, re(c(e._payload), r, i, a, o);
			}
		}
		if (c) return o = o(e), c = a === "" ? "." + te(e, 0) : a, S(o) ? (i = "", c != null && (i = c.replace(ee, "$&/") + "/"), re(o, r, i, "", function(e) {
			return e;
		})) : o != null && (O(o) && (o = D(o, i + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace(ee, "$&/") + "/") + c)), r.push(o)), 1;
		c = 0;
		var l = a === "" ? "." : a + ":";
		if (S(e)) for (var u = 0; u < e.length; u++) a = e[u], s = l + te(a, u), c += re(a, r, i, s, o);
		else if (u = m(e), typeof u == "function") for (e = u.call(e), u = 0; !(a = e.next()).done;) a = a.value, s = l + te(a, u++), c += re(a, r, i, s, o);
		else if (s === "object") {
			if (typeof e.then == "function") return re(ne(e), r, i, a, o);
			throw r = String(e), Error("Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead.");
		}
		return c;
	}
	function ie(e, t, n) {
		if (e == null) return e;
		var r = [], i = 0;
		return re(e, r, "", "", function(e) {
			return t.call(n, e, i++);
		}), r;
	}
	function A(e) {
		if (e._status === -1) {
			var t = e._result;
			t = t(), t.then(function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 1, e._result = t);
			}, function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 2, e._result = t);
			}), e._status === -1 && (e._status = 0, e._result = t);
		}
		if (e._status === 1) return e._result.default;
		throw e._result;
	}
	var j = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	}, M = {
		map: ie,
		forEach: function(e, t, n) {
			ie(e, function() {
				t.apply(this, arguments);
			}, n);
		},
		count: function(e) {
			var t = 0;
			return ie(e, function() {
				t++;
			}), t;
		},
		toArray: function(e) {
			return ie(e, function(e) {
				return e;
			}) || [];
		},
		only: function(e) {
			if (!O(e)) throw Error("React.Children.only expected to receive a single React element child.");
			return e;
		}
	};
	e.Activity = f, e.Children = M, e.Component = v, e.Fragment = r, e.Profiler = a, e.PureComponent = b, e.StrictMode = i, e.Suspense = l, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = w, e.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(e) {
			return w.H.useMemoCache(e);
		}
	}, e.cache = function(e) {
		return function() {
			return e.apply(null, arguments);
		};
	}, e.cacheSignal = function() {
		return null;
	}, e.cloneElement = function(e, t, n) {
		if (e == null) throw Error("The argument must be a React element, but you passed " + e + ".");
		var r = g({}, e.props), i = e.key;
		if (t != null) for (a in t.key !== void 0 && (i = "" + t.key), t) !T.call(t, a) || a === "key" || a === "__self" || a === "__source" || a === "ref" && t.ref === void 0 || (r[a] = t[a]);
		var a = arguments.length - 2;
		if (a === 1) r.children = n;
		else if (1 < a) {
			for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
			r.children = o;
		}
		return E(e.type, i, r);
	}, e.createContext = function(e) {
		return e = {
			$$typeof: s,
			_currentValue: e,
			_currentValue2: e,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		}, e.Provider = e, e.Consumer = {
			$$typeof: o,
			_context: e
		}, e;
	}, e.createElement = function(e, t, n) {
		var r, i = {}, a = null;
		if (t != null) for (r in t.key !== void 0 && (a = "" + t.key), t) T.call(t, r) && r !== "key" && r !== "__self" && r !== "__source" && (i[r] = t[r]);
		var o = arguments.length - 2;
		if (o === 1) i.children = n;
		else if (1 < o) {
			for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
			i.children = s;
		}
		if (e && e.defaultProps) for (r in o = e.defaultProps, o) i[r] === void 0 && (i[r] = o[r]);
		return E(e, a, i);
	}, e.createRef = function() {
		return { current: null };
	}, e.forwardRef = function(e) {
		return {
			$$typeof: c,
			render: e
		};
	}, e.isValidElement = O, e.lazy = function(e) {
		return {
			$$typeof: d,
			_payload: {
				_status: -1,
				_result: e
			},
			_init: A
		};
	}, e.memo = function(e, t) {
		return {
			$$typeof: u,
			type: e,
			compare: t === void 0 ? null : t
		};
	}, e.startTransition = function(e) {
		var t = w.T, n = {};
		w.T = n;
		try {
			var r = e(), i = w.S;
			i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && r.then(C, j);
		} catch (e) {
			j(e);
		} finally {
			t !== null && n.types !== null && (t.types = n.types), w.T = t;
		}
	}, e.unstable_useCacheRefresh = function() {
		return w.H.useCacheRefresh();
	}, e.use = function(e) {
		return w.H.use(e);
	}, e.useActionState = function(e, t, n) {
		return w.H.useActionState(e, t, n);
	}, e.useCallback = function(e, t) {
		return w.H.useCallback(e, t);
	}, e.useContext = function(e) {
		return w.H.useContext(e);
	}, e.useDebugValue = function() {}, e.useDeferredValue = function(e, t) {
		return w.H.useDeferredValue(e, t);
	}, e.useEffect = function(e, t) {
		return w.H.useEffect(e, t);
	}, e.useEffectEvent = function(e) {
		return w.H.useEffectEvent(e);
	}, e.useId = function() {
		return w.H.useId();
	}, e.useImperativeHandle = function(e, t, n) {
		return w.H.useImperativeHandle(e, t, n);
	}, e.useInsertionEffect = function(e, t) {
		return w.H.useInsertionEffect(e, t);
	}, e.useLayoutEffect = function(e, t) {
		return w.H.useLayoutEffect(e, t);
	}, e.useMemo = function(e, t) {
		return w.H.useMemo(e, t);
	}, e.useOptimistic = function(e, t) {
		return w.H.useOptimistic(e, t);
	}, e.useReducer = function(e, t, n) {
		return w.H.useReducer(e, t, n);
	}, e.useRef = function(e) {
		return w.H.useRef(e);
	}, e.useState = function(e) {
		return w.H.useState(e);
	}, e.useSyncExternalStore = function(e, t, n) {
		return w.H.useSyncExternalStore(e, t, n);
	}, e.useTransition = function() {
		return w.H.useTransition();
	}, e.version = "19.2.6";
})), u = /* @__PURE__ */ o(((e, t) => {
	t.exports = l();
})), d = /* @__PURE__ */ o(((e) => {
	function t(e, t) {
		var n = e.length;
		e.push(t);
		a: for (; 0 < n;) {
			var r = n - 1 >>> 1, a = e[r];
			if (0 < i(a, t)) e[r] = t, e[n] = a, n = r;
			else break a;
		}
	}
	function n(e) {
		return e.length === 0 ? null : e[0];
	}
	function r(e) {
		if (e.length === 0) return null;
		var t = e[0], n = e.pop();
		if (n !== t) {
			e[0] = n;
			a: for (var r = 0, a = e.length, o = a >>> 1; r < o;) {
				var s = 2 * (r + 1) - 1, c = e[s], l = s + 1, u = e[l];
				if (0 > i(c, n)) l < a && 0 > i(u, c) ? (e[r] = u, e[l] = n, r = l) : (e[r] = c, e[s] = n, r = s);
				else if (l < a && 0 > i(u, n)) e[r] = u, e[l] = n, r = l;
				else break a;
			}
		}
		return t;
	}
	function i(e, t) {
		var n = e.sortIndex - t.sortIndex;
		return n === 0 ? e.id - t.id : n;
	}
	if (e.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
		var a = performance;
		e.unstable_now = function() {
			return a.now();
		};
	} else {
		var o = Date, s = o.now();
		e.unstable_now = function() {
			return o.now() - s;
		};
	}
	var c = [], l = [], u = 1, d = null, f = 3, p = !1, m = !1, h = !1, g = !1, _ = typeof setTimeout == "function" ? setTimeout : null, v = typeof clearTimeout == "function" ? clearTimeout : null, y = typeof setImmediate < "u" ? setImmediate : null;
	function b(e) {
		for (var i = n(l); i !== null;) {
			if (i.callback === null) r(l);
			else if (i.startTime <= e) r(l), i.sortIndex = i.expirationTime, t(c, i);
			else break;
			i = n(l);
		}
	}
	function x(e) {
		if (h = !1, b(e), !m) if (n(c) !== null) m = !0, S || (S = !0, O());
		else {
			var t = n(l);
			t !== null && te(x, t.startTime - e);
		}
	}
	var S = !1, C = -1, w = 5, T = -1;
	function E() {
		return g ? !0 : !(e.unstable_now() - T < w);
	}
	function D() {
		if (g = !1, S) {
			var t = e.unstable_now();
			T = t;
			var i = !0;
			try {
				a: {
					m = !1, h && (h = !1, v(C), C = -1), p = !0;
					var a = f;
					try {
						b: {
							for (b(t), d = n(c); d !== null && !(d.expirationTime > t && E());) {
								var o = d.callback;
								if (typeof o == "function") {
									d.callback = null, f = d.priorityLevel;
									var s = o(d.expirationTime <= t);
									if (t = e.unstable_now(), typeof s == "function") {
										d.callback = s, b(t), i = !0;
										break b;
									}
									d === n(c) && r(c), b(t);
								} else r(c);
								d = n(c);
							}
							if (d !== null) i = !0;
							else {
								var u = n(l);
								u !== null && te(x, u.startTime - t), i = !1;
							}
						}
						break a;
					} finally {
						d = null, f = a, p = !1;
					}
					i = void 0;
				}
			} finally {
				i ? O() : S = !1;
			}
		}
	}
	var O;
	if (typeof y == "function") O = function() {
		y(D);
	};
	else if (typeof MessageChannel < "u") {
		var k = new MessageChannel(), ee = k.port2;
		k.port1.onmessage = D, O = function() {
			ee.postMessage(null);
		};
	} else O = function() {
		_(D, 0);
	};
	function te(t, n) {
		C = _(function() {
			t(e.unstable_now());
		}, n);
	}
	e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(e) {
		e.callback = null;
	}, e.unstable_forceFrameRate = function(e) {
		0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : w = 0 < e ? Math.floor(1e3 / e) : 5;
	}, e.unstable_getCurrentPriorityLevel = function() {
		return f;
	}, e.unstable_next = function(e) {
		switch (f) {
			case 1:
			case 2:
			case 3:
				var t = 3;
				break;
			default: t = f;
		}
		var n = f;
		f = t;
		try {
			return e();
		} finally {
			f = n;
		}
	}, e.unstable_requestPaint = function() {
		g = !0;
	}, e.unstable_runWithPriority = function(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5: break;
			default: e = 3;
		}
		var n = f;
		f = e;
		try {
			return t();
		} finally {
			f = n;
		}
	}, e.unstable_scheduleCallback = function(r, i, a) {
		var o = e.unstable_now();
		switch (typeof a == "object" && a ? (a = a.delay, a = typeof a == "number" && 0 < a ? o + a : o) : a = o, r) {
			case 1:
				var s = -1;
				break;
			case 2:
				s = 250;
				break;
			case 5:
				s = 1073741823;
				break;
			case 4:
				s = 1e4;
				break;
			default: s = 5e3;
		}
		return s = a + s, r = {
			id: u++,
			callback: i,
			priorityLevel: r,
			startTime: a,
			expirationTime: s,
			sortIndex: -1
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(C), C = -1) : h = !0, te(x, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, S || (S = !0, O()))), r;
	}, e.unstable_shouldYield = E, e.unstable_wrapCallback = function(e) {
		var t = f;
		return function() {
			var n = f;
			f = t;
			try {
				return e.apply(this, arguments);
			} finally {
				f = n;
			}
		};
	};
})), f = /* @__PURE__ */ o(((e, t) => {
	t.exports = d();
})), p = /* @__PURE__ */ o(((e) => {
	var t = u();
	function n(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function r() {}
	var i = {
		d: {
			f: r,
			r: function() {
				throw Error(n(522));
			},
			D: r,
			C: r,
			L: r,
			m: r,
			X: r,
			S: r,
			M: r
		},
		p: 0,
		findDOMNode: null
	}, a = Symbol.for("react.portal");
	function o(e, t, n) {
		var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
		return {
			$$typeof: a,
			key: r == null ? null : "" + r,
			children: e,
			containerInfo: t,
			implementation: n
		};
	}
	var s = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function c(e, t) {
		if (e === "font") return "";
		if (typeof t == "string") return t === "use-credentials" ? t : "";
	}
	e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i, e.createPortal = function(e, t) {
		var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
		if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11) throw Error(n(299));
		return o(e, t, null, r);
	}, e.flushSync = function(e) {
		var t = s.T, n = i.p;
		try {
			if (s.T = null, i.p = 2, e) return e();
		} finally {
			s.T = t, i.p = n, i.d.f();
		}
	}, e.preconnect = function(e, t) {
		typeof e == "string" && (t ? (t = t.crossOrigin, t = typeof t == "string" ? t === "use-credentials" ? t : "" : void 0) : t = null, i.d.C(e, t));
	}, e.prefetchDNS = function(e) {
		typeof e == "string" && i.d.D(e);
	}, e.preinit = function(e, t) {
		if (typeof e == "string" && t && typeof t.as == "string") {
			var n = t.as, r = c(n, t.crossOrigin), a = typeof t.integrity == "string" ? t.integrity : void 0, o = typeof t.fetchPriority == "string" ? t.fetchPriority : void 0;
			n === "style" ? i.d.S(e, typeof t.precedence == "string" ? t.precedence : void 0, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o
			}) : n === "script" && i.d.X(e, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0
			});
		}
	}, e.preinitModule = function(e, t) {
		if (typeof e == "string") if (typeof t == "object" && t) {
			if (t.as == null || t.as === "script") {
				var n = c(t.as, t.crossOrigin);
				i.d.M(e, {
					crossOrigin: n,
					integrity: typeof t.integrity == "string" ? t.integrity : void 0,
					nonce: typeof t.nonce == "string" ? t.nonce : void 0
				});
			}
		} else t ?? i.d.M(e);
	}, e.preload = function(e, t) {
		if (typeof e == "string" && typeof t == "object" && t && typeof t.as == "string") {
			var n = t.as, r = c(n, t.crossOrigin);
			i.d.L(e, n, {
				crossOrigin: r,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0,
				type: typeof t.type == "string" ? t.type : void 0,
				fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0,
				referrerPolicy: typeof t.referrerPolicy == "string" ? t.referrerPolicy : void 0,
				imageSrcSet: typeof t.imageSrcSet == "string" ? t.imageSrcSet : void 0,
				imageSizes: typeof t.imageSizes == "string" ? t.imageSizes : void 0,
				media: typeof t.media == "string" ? t.media : void 0
			});
		}
	}, e.preloadModule = function(e, t) {
		if (typeof e == "string") if (t) {
			var n = c(t.as, t.crossOrigin);
			i.d.m(e, {
				as: typeof t.as == "string" && t.as !== "script" ? t.as : void 0,
				crossOrigin: n,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0
			});
		} else i.d.m(e);
	}, e.requestFormReset = function(e) {
		i.d.r(e);
	}, e.unstable_batchedUpdates = function(e, t) {
		return e(t);
	}, e.useFormState = function(e, t, n) {
		return s.H.useFormState(e, t, n);
	}, e.useFormStatus = function() {
		return s.H.useHostTransitionStatus();
	}, e.version = "19.2.6";
})), m = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = p();
})), h = /* @__PURE__ */ o(((e) => {
	var t = f(), n = u(), r = m();
	function i(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function a(e) {
		return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
	}
	function o(e) {
		var t = e, n = e;
		if (e.alternate) for (; t.return;) t = t.return;
		else {
			e = t;
			do
				t = e, t.flags & 4098 && (n = t.return), e = t.return;
			while (e);
		}
		return t.tag === 3 ? n : null;
	}
	function s(e) {
		if (e.tag === 13) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function c(e) {
		if (e.tag === 31) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function l(e) {
		if (o(e) !== e) throw Error(i(188));
	}
	function d(e) {
		var t = e.alternate;
		if (!t) {
			if (t = o(e), t === null) throw Error(i(188));
			return t === e ? e : null;
		}
		for (var n = e, r = t;;) {
			var a = n.return;
			if (a === null) break;
			var s = a.alternate;
			if (s === null) {
				if (r = a.return, r !== null) {
					n = r;
					continue;
				}
				break;
			}
			if (a.child === s.child) {
				for (s = a.child; s;) {
					if (s === n) return l(a), e;
					if (s === r) return l(a), t;
					s = s.sibling;
				}
				throw Error(i(188));
			}
			if (n.return !== r.return) n = a, r = s;
			else {
				for (var c = !1, u = a.child; u;) {
					if (u === n) {
						c = !0, n = a, r = s;
						break;
					}
					if (u === r) {
						c = !0, r = a, n = s;
						break;
					}
					u = u.sibling;
				}
				if (!c) {
					for (u = s.child; u;) {
						if (u === n) {
							c = !0, n = s, r = a;
							break;
						}
						if (u === r) {
							c = !0, r = s, n = a;
							break;
						}
						u = u.sibling;
					}
					if (!c) throw Error(i(189));
				}
			}
			if (n.alternate !== r) throw Error(i(190));
		}
		if (n.tag !== 3) throw Error(i(188));
		return n.stateNode.current === n ? e : t;
	}
	function p(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e;
		for (e = e.child; e !== null;) {
			if (t = p(e), t !== null) return t;
			e = e.sibling;
		}
		return null;
	}
	var h = Object.assign, g = Symbol.for("react.element"), _ = Symbol.for("react.transitional.element"), v = Symbol.for("react.portal"), y = Symbol.for("react.fragment"), b = Symbol.for("react.strict_mode"), x = Symbol.for("react.profiler"), S = Symbol.for("react.consumer"), C = Symbol.for("react.context"), w = Symbol.for("react.forward_ref"), T = Symbol.for("react.suspense"), E = Symbol.for("react.suspense_list"), D = Symbol.for("react.memo"), O = Symbol.for("react.lazy"), k = Symbol.for("react.activity"), ee = Symbol.for("react.memo_cache_sentinel"), te = Symbol.iterator;
	function ne(e) {
		return typeof e != "object" || !e ? null : (e = te && e[te] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var re = Symbol.for("react.client.reference");
	function ie(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === re ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case y: return "Fragment";
			case x: return "Profiler";
			case b: return "StrictMode";
			case T: return "Suspense";
			case E: return "SuspenseList";
			case k: return "Activity";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case v: return "Portal";
			case C: return e.displayName || "Context";
			case S: return (e._context.displayName || "Context") + ".Consumer";
			case w:
				var t = e.render;
				return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case D: return t = e.displayName || null, t === null ? ie(e.type) || "Memo" : t;
			case O:
				t = e._payload, e = e._init;
				try {
					return ie(e(t));
				} catch {}
		}
		return null;
	}
	var A = Array.isArray, j = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, M = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ae = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, oe = [], se = -1;
	function ce(e) {
		return { current: e };
	}
	function N(e) {
		0 > se || (e.current = oe[se], oe[se] = null, se--);
	}
	function P(e, t) {
		se++, oe[se] = e.current, e.current = t;
	}
	var le = ce(null), ue = ce(null), de = ce(null), fe = ce(null);
	function pe(e, t) {
		switch (P(de, t), P(ue, e), P(le, null), t.nodeType) {
			case 9:
			case 11:
				e = (e = t.documentElement) && (e = e.namespaceURI) ? Vd(e) : 0;
				break;
			default: if (e = t.tagName, t = t.namespaceURI) t = Vd(t), e = Hd(t, e);
			else switch (e) {
				case "svg":
					e = 1;
					break;
				case "math":
					e = 2;
					break;
				default: e = 0;
			}
		}
		N(le), P(le, e);
	}
	function me() {
		N(le), N(ue), N(de);
	}
	function he(e) {
		e.memoizedState !== null && P(fe, e);
		var t = le.current, n = Hd(t, e.type);
		t !== n && (P(ue, e), P(le, n));
	}
	function ge(e) {
		ue.current === e && (N(le), N(ue)), fe.current === e && (N(fe), Qf._currentValue = ae);
	}
	var _e, ve;
	function ye(e) {
		if (_e === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			_e = t && t[1] || "", ve = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + _e + e + ve;
	}
	var be = !1;
	function xe(e, t) {
		if (!e || be) return "";
		be = !0;
		var n = Error.prepareStackTrace;
		Error.prepareStackTrace = void 0;
		try {
			var r = { DetermineComponentFrameRoot: function() {
				try {
					if (t) {
						var n = function() {
							throw Error();
						};
						if (Object.defineProperty(n.prototype, "props", { set: function() {
							throw Error();
						} }), typeof Reflect == "object" && Reflect.construct) {
							try {
								Reflect.construct(n, []);
							} catch (e) {
								var r = e;
							}
							Reflect.construct(e, [], n);
						} else {
							try {
								n.call();
							} catch (e) {
								r = e;
							}
							e.call(n.prototype);
						}
					} else {
						try {
							throw Error();
						} catch (e) {
							r = e;
						}
						(n = e()) && typeof n.catch == "function" && n.catch(function() {});
					}
				} catch (e) {
					if (e && r && typeof e.stack == "string") return [e.stack, r.stack];
				}
				return [null, null];
			} };
			r.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
			var i = Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot, "name");
			i && i.configurable && Object.defineProperty(r.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
			var a = r.DetermineComponentFrameRoot(), o = a[0], s = a[1];
			if (o && s) {
				var c = o.split("\n"), l = s.split("\n");
				for (i = r = 0; r < c.length && !c[r].includes("DetermineComponentFrameRoot");) r++;
				for (; i < l.length && !l[i].includes("DetermineComponentFrameRoot");) i++;
				if (r === c.length || i === l.length) for (r = c.length - 1, i = l.length - 1; 1 <= r && 0 <= i && c[r] !== l[i];) i--;
				for (; 1 <= r && 0 <= i; r--, i--) if (c[r] !== l[i]) {
					if (r !== 1 || i !== 1) do
						if (r--, i--, 0 > i || c[r] !== l[i]) {
							var u = "\n" + c[r].replace(" at new ", " at ");
							return e.displayName && u.includes("<anonymous>") && (u = u.replace("<anonymous>", e.displayName)), u;
						}
					while (1 <= r && 0 <= i);
					break;
				}
			}
		} finally {
			be = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? ye(n) : "";
	}
	function Se(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return ye(e.type);
			case 16: return ye("Lazy");
			case 13: return e.child !== t && t !== null ? ye("Suspense Fallback") : ye("Suspense");
			case 19: return ye("SuspenseList");
			case 0:
			case 15: return xe(e.type, !1);
			case 11: return xe(e.type.render, !1);
			case 1: return xe(e.type, !0);
			case 31: return ye("Activity");
			default: return "";
		}
	}
	function Ce(e) {
		try {
			var t = "", n = null;
			do
				t += Se(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var we = Object.prototype.hasOwnProperty, Te = t.unstable_scheduleCallback, Ee = t.unstable_cancelCallback, De = t.unstable_shouldYield, Oe = t.unstable_requestPaint, ke = t.unstable_now, Ae = t.unstable_getCurrentPriorityLevel, je = t.unstable_ImmediatePriority, Me = t.unstable_UserBlockingPriority, Ne = t.unstable_NormalPriority, Pe = t.unstable_LowPriority, Fe = t.unstable_IdlePriority, Ie = t.log, Le = t.unstable_setDisableYieldValue, Re = null, ze = null;
	function Be(e) {
		if (typeof Ie == "function" && Le(e), ze && typeof ze.setStrictMode == "function") try {
			ze.setStrictMode(Re, e);
		} catch {}
	}
	var F = Math.clz32 ? Math.clz32 : Ue, Ve = Math.log, He = Math.LN2;
	function Ue(e) {
		return e >>>= 0, e === 0 ? 32 : 31 - (Ve(e) / He | 0) | 0;
	}
	var We = 256, Ge = 262144, Ke = 4194304;
	function qe(e) {
		var t = e & 42;
		if (t !== 0) return t;
		switch (e & -e) {
			case 1: return 1;
			case 2: return 2;
			case 4: return 4;
			case 8: return 8;
			case 16: return 16;
			case 32: return 32;
			case 64: return 64;
			case 128: return 128;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072: return e & 261888;
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return e & 3932160;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return e & 62914560;
			case 67108864: return 67108864;
			case 134217728: return 134217728;
			case 268435456: return 268435456;
			case 536870912: return 536870912;
			case 1073741824: return 0;
			default: return e;
		}
	}
	function Je(e, t, n) {
		var r = e.pendingLanes;
		if (r === 0) return 0;
		var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
		e = e.warmLanes;
		var s = r & 134217727;
		return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = qe(n))) : i = qe(o) : i = qe(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = qe(n))) : i = qe(o)) : i = qe(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
	}
	function Ye(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function Xe(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 4:
			case 8:
			case 64: return t + 250;
			case 16:
			case 32:
			case 128:
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return t + 5e3;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return -1;
			case 67108864:
			case 134217728:
			case 268435456:
			case 536870912:
			case 1073741824: return -1;
			default: return -1;
		}
	}
	function Ze() {
		var e = Ke;
		return Ke <<= 1, !(Ke & 62914560) && (Ke = 4194304), e;
	}
	function Qe(e) {
		for (var t = [], n = 0; 31 > n; n++) t.push(e);
		return t;
	}
	function $e(e, t) {
		e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
	}
	function et(e, t, n, r, i, a) {
		var o = e.pendingLanes;
		e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
		var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
		for (n = o & ~n; 0 < n;) {
			var u = 31 - F(n), d = 1 << u;
			s[u] = 0, c[u] = -1;
			var f = l[u];
			if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
				var p = f[u];
				p !== null && (p.lane &= -536870913);
			}
			n &= ~d;
		}
		r !== 0 && tt(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
	}
	function tt(e, t, n) {
		e.pendingLanes |= t, e.suspendedLanes &= ~t;
		var r = 31 - F(t);
		e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
	}
	function nt(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - F(n), i = 1 << r;
			i & t | e[r] & t && (e[r] |= t), n &= ~i;
		}
	}
	function rt(e, t) {
		var n = t & -t;
		return n = n & 42 ? 1 : it(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
	}
	function it(e) {
		switch (e) {
			case 2:
				e = 1;
				break;
			case 8:
				e = 4;
				break;
			case 32:
				e = 16;
				break;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				e = 128;
				break;
			case 268435456:
				e = 134217728;
				break;
			default: e = 0;
		}
		return e;
	}
	function at(e) {
		return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
	}
	function ot() {
		var e = M.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : mp(e.type)) : e;
	}
	function st(e, t) {
		var n = M.p;
		try {
			return M.p = e, t();
		} finally {
			M.p = n;
		}
	}
	var ct = Math.random().toString(36).slice(2), lt = "__reactFiber$" + ct, ut = "__reactProps$" + ct, dt = "__reactContainer$" + ct, ft = "__reactEvents$" + ct, pt = "__reactListeners$" + ct, mt = "__reactHandles$" + ct, ht = "__reactResources$" + ct, gt = "__reactMarker$" + ct;
	function _t(e) {
		delete e[lt], delete e[ut], delete e[ft], delete e[pt], delete e[mt];
	}
	function vt(e) {
		var t = e[lt];
		if (t) return t;
		for (var n = e.parentNode; n;) {
			if (t = n[dt] || n[lt]) {
				if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = df(e); e !== null;) {
					if (n = e[lt]) return n;
					e = df(e);
				}
				return t;
			}
			e = n, n = e.parentNode;
		}
		return null;
	}
	function yt(e) {
		if (e = e[lt] || e[dt]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function bt(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(i(33));
	}
	function xt(e) {
		var t = e[ht];
		return t ||= e[ht] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}, t;
	}
	function St(e) {
		e[gt] = !0;
	}
	var Ct = /* @__PURE__ */ new Set(), wt = {};
	function Tt(e, t) {
		Et(e, t), Et(e + "Capture", t);
	}
	function Et(e, t) {
		for (wt[e] = t, e = 0; e < t.length; e++) Ct.add(t[e]);
	}
	var Dt = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Ot = {}, kt = {};
	function At(e) {
		return we.call(kt, e) ? !0 : we.call(Ot, e) ? !1 : Dt.test(e) ? kt[e] = !0 : (Ot[e] = !0, !1);
	}
	function jt(e, t, n) {
		if (At(t)) if (n === null) e.removeAttribute(t);
		else {
			switch (typeof n) {
				case "undefined":
				case "function":
				case "symbol":
					e.removeAttribute(t);
					return;
				case "boolean":
					var r = t.toLowerCase().slice(0, 5);
					if (r !== "data-" && r !== "aria-") {
						e.removeAttribute(t);
						return;
					}
			}
			e.setAttribute(t, "" + n);
		}
	}
	function Mt(e, t, n) {
		if (n === null) e.removeAttribute(t);
		else {
			switch (typeof n) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(t);
					return;
			}
			e.setAttribute(t, "" + n);
		}
	}
	function Nt(e, t, n, r) {
		if (r === null) e.removeAttribute(n);
		else {
			switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(n);
					return;
			}
			e.setAttributeNS(t, n, "" + r);
		}
	}
	function Pt(e) {
		switch (typeof e) {
			case "bigint":
			case "boolean":
			case "number":
			case "string":
			case "undefined": return e;
			case "object": return e;
			default: return "";
		}
	}
	function I(e) {
		var t = e.type;
		return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
	}
	function Ft(e, t, n) {
		var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
		if (!e.hasOwnProperty(t) && r !== void 0 && typeof r.get == "function" && typeof r.set == "function") {
			var i = r.get, a = r.set;
			return Object.defineProperty(e, t, {
				configurable: !0,
				get: function() {
					return i.call(this);
				},
				set: function(e) {
					n = "" + e, a.call(this, e);
				}
			}), Object.defineProperty(e, t, { enumerable: r.enumerable }), {
				getValue: function() {
					return n;
				},
				setValue: function(e) {
					n = "" + e;
				},
				stopTracking: function() {
					e._valueTracker = null, delete e[t];
				}
			};
		}
	}
	function It(e) {
		if (!e._valueTracker) {
			var t = I(e) ? "checked" : "value";
			e._valueTracker = Ft(e, t, "" + e[t]);
		}
	}
	function Lt(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = I(e) ? e.checked ? "true" : "false" : e.value), e = r, e === n ? !1 : (t.setValue(e), !0);
	}
	function Rt(e) {
		if (e ||= typeof document < "u" ? document : void 0, e === void 0) return null;
		try {
			return e.activeElement || e.body;
		} catch {
			return e.body;
		}
	}
	var zt = /[\n"\\]/g;
	function Bt(e) {
		return e.replace(zt, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function Vt(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Pt(t)) : e.value !== "" + Pt(t) && (e.value = "" + Pt(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : L(e, o, Pt(n)) : L(e, o, Pt(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + Pt(s) : e.removeAttribute("name");
	}
	function Ht(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				It(e);
				return;
			}
			n = n == null ? "" : "" + Pt(n), t = t == null ? n : "" + Pt(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r ??= i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), It(e);
	}
	function L(e, t, n) {
		t === "number" && Rt(e.ownerDocument) === e || e.defaultValue === "" + n || (e.defaultValue = "" + n);
	}
	function Ut(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + Pt(n), t = null, i = 0; i < e.length; i++) {
				if (e[i].value === n) {
					e[i].selected = !0, r && (e[i].defaultSelected = !0);
					return;
				}
				t !== null || e[i].disabled || (t = e[i]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function Wt(e, t, n) {
		if (t != null && (t = "" + Pt(t), t !== e.value && (e.value = t), n == null)) {
			e.defaultValue !== t && (e.defaultValue = t);
			return;
		}
		e.defaultValue = n == null ? "" : "" + Pt(n);
	}
	function Gt(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(i(92));
				if (A(r)) {
					if (1 < r.length) throw Error(i(93));
					r = r[0];
				}
				n = r;
			}
			n ??= "", t = n;
		}
		n = Pt(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), It(e);
	}
	function Kt(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var qt = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function Jt(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || qt.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function Yt(e, t, n) {
		if (t != null && typeof t != "object") throw Error(i(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "");
			for (var a in t) r = t[a], t.hasOwnProperty(a) && n[a] !== r && Jt(e, a, r);
		} else for (var o in t) t.hasOwnProperty(o) && Jt(e, o, t[o]);
	}
	function Xt(e) {
		if (e.indexOf("-") === -1) return !1;
		switch (e) {
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph": return !1;
			default: return !0;
		}
	}
	var Zt = new Map([
		["acceptCharset", "accept-charset"],
		["htmlFor", "for"],
		["httpEquiv", "http-equiv"],
		["crossOrigin", "crossorigin"],
		["accentHeight", "accent-height"],
		["alignmentBaseline", "alignment-baseline"],
		["arabicForm", "arabic-form"],
		["baselineShift", "baseline-shift"],
		["capHeight", "cap-height"],
		["clipPath", "clip-path"],
		["clipRule", "clip-rule"],
		["colorInterpolation", "color-interpolation"],
		["colorInterpolationFilters", "color-interpolation-filters"],
		["colorProfile", "color-profile"],
		["colorRendering", "color-rendering"],
		["dominantBaseline", "dominant-baseline"],
		["enableBackground", "enable-background"],
		["fillOpacity", "fill-opacity"],
		["fillRule", "fill-rule"],
		["floodColor", "flood-color"],
		["floodOpacity", "flood-opacity"],
		["fontFamily", "font-family"],
		["fontSize", "font-size"],
		["fontSizeAdjust", "font-size-adjust"],
		["fontStretch", "font-stretch"],
		["fontStyle", "font-style"],
		["fontVariant", "font-variant"],
		["fontWeight", "font-weight"],
		["glyphName", "glyph-name"],
		["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
		["glyphOrientationVertical", "glyph-orientation-vertical"],
		["horizAdvX", "horiz-adv-x"],
		["horizOriginX", "horiz-origin-x"],
		["imageRendering", "image-rendering"],
		["letterSpacing", "letter-spacing"],
		["lightingColor", "lighting-color"],
		["markerEnd", "marker-end"],
		["markerMid", "marker-mid"],
		["markerStart", "marker-start"],
		["overlinePosition", "overline-position"],
		["overlineThickness", "overline-thickness"],
		["paintOrder", "paint-order"],
		["panose-1", "panose-1"],
		["pointerEvents", "pointer-events"],
		["renderingIntent", "rendering-intent"],
		["shapeRendering", "shape-rendering"],
		["stopColor", "stop-color"],
		["stopOpacity", "stop-opacity"],
		["strikethroughPosition", "strikethrough-position"],
		["strikethroughThickness", "strikethrough-thickness"],
		["strokeDasharray", "stroke-dasharray"],
		["strokeDashoffset", "stroke-dashoffset"],
		["strokeLinecap", "stroke-linecap"],
		["strokeLinejoin", "stroke-linejoin"],
		["strokeMiterlimit", "stroke-miterlimit"],
		["strokeOpacity", "stroke-opacity"],
		["strokeWidth", "stroke-width"],
		["textAnchor", "text-anchor"],
		["textDecoration", "text-decoration"],
		["textRendering", "text-rendering"],
		["transformOrigin", "transform-origin"],
		["underlinePosition", "underline-position"],
		["underlineThickness", "underline-thickness"],
		["unicodeBidi", "unicode-bidi"],
		["unicodeRange", "unicode-range"],
		["unitsPerEm", "units-per-em"],
		["vAlphabetic", "v-alphabetic"],
		["vHanging", "v-hanging"],
		["vIdeographic", "v-ideographic"],
		["vMathematical", "v-mathematical"],
		["vectorEffect", "vector-effect"],
		["vertAdvY", "vert-adv-y"],
		["vertOriginX", "vert-origin-x"],
		["vertOriginY", "vert-origin-y"],
		["wordSpacing", "word-spacing"],
		["writingMode", "writing-mode"],
		["xmlnsXlink", "xmlns:xlink"],
		["xHeight", "x-height"]
	]), Qt = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function $t(e) {
		return Qt.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function en() {}
	var tn = null;
	function nn(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var rn = null, an = null;
	function on(e) {
		var t = yt(e);
		if (t && (e = t.stateNode)) {
			var n = e[ut] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (Vt(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + Bt("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var a = r[ut] || null;
								if (!a) throw Error(i(90));
								Vt(r, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && Lt(r);
					}
					break a;
				case "textarea":
					Wt(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && Ut(e, !!n.multiple, t, !1);
			}
		}
	}
	var sn = !1;
	function cn(e, t, n) {
		if (sn) return e(t, n);
		sn = !0;
		try {
			return e(t);
		} finally {
			if (sn = !1, (rn !== null || an !== null) && (vu(), rn && (t = rn, e = an, an = rn = null, on(t), e))) for (t = 0; t < e.length; t++) on(e[t]);
		}
	}
	function ln(e, t) {
		var n = e.stateNode;
		if (n === null) return null;
		var r = n[ut] || null;
		if (r === null) return null;
		n = r[t];
		a: switch (t) {
			case "onClick":
			case "onClickCapture":
			case "onDoubleClick":
			case "onDoubleClickCapture":
			case "onMouseDown":
			case "onMouseDownCapture":
			case "onMouseMove":
			case "onMouseMoveCapture":
			case "onMouseUp":
			case "onMouseUpCapture":
			case "onMouseEnter":
				(r = !r.disabled) || (e = e.type, r = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !r;
				break a;
			default: e = !1;
		}
		if (e) return null;
		if (n && typeof n != "function") throw Error(i(231, t, typeof n));
		return n;
	}
	var un = !(typeof window > "u" || window.document === void 0 || window.document.createElement === void 0), dn = !1;
	if (un) try {
		var fn = {};
		Object.defineProperty(fn, "passive", { get: function() {
			dn = !0;
		} }), window.addEventListener("test", fn, fn), window.removeEventListener("test", fn, fn);
	} catch {
		dn = !1;
	}
	var pn = null, mn = null, hn = null;
	function gn() {
		if (hn) return hn;
		var e, t = mn, n = t.length, r, i = "value" in pn ? pn.value : pn.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return hn = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function _n(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function vn() {
		return !0;
	}
	function yn() {
		return !1;
	}
	function bn(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? vn : yn, this.isPropagationStopped = yn, this;
		}
		return h(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = vn);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = vn);
			},
			persist: function() {},
			isPersistent: vn
		}), t;
	}
	var xn = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, Sn = bn(xn), Cn = h({}, xn, {
		view: 0,
		detail: 0
	}), wn = bn(Cn), Tn, En, Dn, On = h({}, Cn, {
		screenX: 0,
		screenY: 0,
		clientX: 0,
		clientY: 0,
		pageX: 0,
		pageY: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		getModifierState: zn,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== Dn && (Dn && e.type === "mousemove" ? (Tn = e.screenX - Dn.screenX, En = e.screenY - Dn.screenY) : En = Tn = 0, Dn = e), Tn);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : En;
		}
	}), kn = bn(On), An = bn(h({}, On, { dataTransfer: 0 })), jn = bn(h({}, Cn, { relatedTarget: 0 })), Mn = bn(h({}, xn, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Nn = bn(h({}, xn, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), Pn = bn(h({}, xn, { data: 0 })), Fn = {
		Esc: "Escape",
		Spacebar: " ",
		Left: "ArrowLeft",
		Up: "ArrowUp",
		Right: "ArrowRight",
		Down: "ArrowDown",
		Del: "Delete",
		Win: "OS",
		Menu: "ContextMenu",
		Apps: "ContextMenu",
		Scroll: "ScrollLock",
		MozPrintableKey: "Unidentified"
	}, In = {
		8: "Backspace",
		9: "Tab",
		12: "Clear",
		13: "Enter",
		16: "Shift",
		17: "Control",
		18: "Alt",
		19: "Pause",
		20: "CapsLock",
		27: "Escape",
		32: " ",
		33: "PageUp",
		34: "PageDown",
		35: "End",
		36: "Home",
		37: "ArrowLeft",
		38: "ArrowUp",
		39: "ArrowRight",
		40: "ArrowDown",
		45: "Insert",
		46: "Delete",
		112: "F1",
		113: "F2",
		114: "F3",
		115: "F4",
		116: "F5",
		117: "F6",
		118: "F7",
		119: "F8",
		120: "F9",
		121: "F10",
		122: "F11",
		123: "F12",
		144: "NumLock",
		145: "ScrollLock",
		224: "Meta"
	}, Ln = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function Rn(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = Ln[e]) ? !!t[e] : !1;
	}
	function zn() {
		return Rn;
	}
	var Bn = bn(h({}, Cn, {
		key: function(e) {
			if (e.key) {
				var t = Fn[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = _n(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? In[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: zn,
		charCode: function(e) {
			return e.type === "keypress" ? _n(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? _n(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), Vn = bn(h({}, On, {
		pointerId: 0,
		width: 0,
		height: 0,
		pressure: 0,
		tangentialPressure: 0,
		tiltX: 0,
		tiltY: 0,
		twist: 0,
		pointerType: 0,
		isPrimary: 0
	})), Hn = bn(h({}, Cn, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: zn
	})), Un = bn(h({}, xn, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Wn = bn(h({}, On, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), Gn = bn(h({}, xn, {
		newState: 0,
		oldState: 0
	})), Kn = [
		9,
		13,
		27,
		32
	], qn = un && "CompositionEvent" in window, Jn = null;
	un && "documentMode" in document && (Jn = document.documentMode);
	var Yn = un && "TextEvent" in window && !Jn, Xn = un && (!qn || Jn && 8 < Jn && 11 >= Jn), Zn = " ", Qn = !1;
	function $n(e, t) {
		switch (e) {
			case "keyup": return Kn.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function er(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var tr = !1;
	function nr(e, t) {
		switch (e) {
			case "compositionend": return er(t);
			case "keypress": return t.which === 32 ? (Qn = !0, Zn) : null;
			case "textInput": return e = t.data, e === Zn && Qn ? null : e;
			default: return null;
		}
	}
	function rr(e, t) {
		if (tr) return e === "compositionend" || !qn && $n(e, t) ? (e = gn(), hn = mn = pn = null, tr = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return Xn && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var ir = {
		color: !0,
		date: !0,
		datetime: !0,
		"datetime-local": !0,
		email: !0,
		month: !0,
		number: !0,
		password: !0,
		range: !0,
		search: !0,
		tel: !0,
		text: !0,
		time: !0,
		url: !0,
		week: !0
	};
	function ar(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!ir[e.type] : t === "textarea";
	}
	function or(e, t, n, r) {
		rn ? an ? an.push(r) : an = [r] : rn = r, t = Td(t, "onChange"), 0 < t.length && (n = new Sn("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var sr = null, cr = null;
	function lr(e) {
		vd(e, 0);
	}
	function ur(e) {
		if (Lt(bt(e))) return e;
	}
	function dr(e, t) {
		if (e === "change") return t;
	}
	var fr = !1;
	if (un) {
		var pr;
		if (un) {
			var mr = "oninput" in document;
			if (!mr) {
				var hr = document.createElement("div");
				hr.setAttribute("oninput", "return;"), mr = typeof hr.oninput == "function";
			}
			pr = mr;
		} else pr = !1;
		fr = pr && (!document.documentMode || 9 < document.documentMode);
	}
	function gr() {
		sr && (sr.detachEvent("onpropertychange", _r), cr = sr = null);
	}
	function _r(e) {
		if (e.propertyName === "value" && ur(cr)) {
			var t = [];
			or(t, cr, e, nn(e)), cn(lr, t);
		}
	}
	function vr(e, t, n) {
		e === "focusin" ? (gr(), sr = t, cr = n, sr.attachEvent("onpropertychange", _r)) : e === "focusout" && gr();
	}
	function yr(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return ur(cr);
	}
	function br(e, t) {
		if (e === "click") return ur(t);
	}
	function xr(e, t) {
		if (e === "input" || e === "change") return ur(t);
	}
	function Sr(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var Cr = typeof Object.is == "function" ? Object.is : Sr;
	function wr(e, t) {
		if (Cr(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!we.call(t, i) || !Cr(e[i], t[i])) return !1;
		}
		return !0;
	}
	function Tr(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function Er(e, t) {
		var n = Tr(e);
		e = 0;
		for (var r; n;) {
			if (n.nodeType === 3) {
				if (r = e + n.textContent.length, e <= t && r >= t) return {
					node: n,
					offset: t - e
				};
				e = r;
			}
			a: {
				for (; n;) {
					if (n.nextSibling) {
						n = n.nextSibling;
						break a;
					}
					n = n.parentNode;
				}
				n = void 0;
			}
			n = Tr(n);
		}
	}
	function Dr(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Dr(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function Or(e) {
		e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
		for (var t = Rt(e.document); t instanceof e.HTMLIFrameElement;) {
			try {
				var n = typeof t.contentWindow.location.href == "string";
			} catch {
				n = !1;
			}
			if (n) e = t.contentWindow;
			else break;
			t = Rt(e.document);
		}
		return t;
	}
	function kr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var Ar = un && "documentMode" in document && 11 >= document.documentMode, jr = null, Mr = null, Nr = null, Pr = !1;
	function Fr(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		Pr || jr == null || jr !== Rt(r) || (r = jr, "selectionStart" in r && kr(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), Nr && wr(Nr, r) || (Nr = r, r = Td(Mr, "onSelect"), 0 < r.length && (t = new Sn("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = jr)));
	}
	function Ir(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var Lr = {
		animationend: Ir("Animation", "AnimationEnd"),
		animationiteration: Ir("Animation", "AnimationIteration"),
		animationstart: Ir("Animation", "AnimationStart"),
		transitionrun: Ir("Transition", "TransitionRun"),
		transitionstart: Ir("Transition", "TransitionStart"),
		transitioncancel: Ir("Transition", "TransitionCancel"),
		transitionend: Ir("Transition", "TransitionEnd")
	}, Rr = {}, zr = {};
	un && (zr = document.createElement("div").style, "AnimationEvent" in window || (delete Lr.animationend.animation, delete Lr.animationiteration.animation, delete Lr.animationstart.animation), "TransitionEvent" in window || delete Lr.transitionend.transition);
	function Br(e) {
		if (Rr[e]) return Rr[e];
		if (!Lr[e]) return e;
		var t = Lr[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in zr) return Rr[e] = t[n];
		return e;
	}
	var Vr = Br("animationend"), Hr = Br("animationiteration"), Ur = Br("animationstart"), Wr = Br("transitionrun"), Gr = Br("transitionstart"), Kr = Br("transitioncancel"), qr = Br("transitionend"), Jr = /* @__PURE__ */ new Map(), Yr = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	Yr.push("scrollEnd");
	function Xr(e, t) {
		Jr.set(e, t), Tt(t, [e]);
	}
	var Zr = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	}, Qr = [], $r = 0, ei = 0;
	function ti() {
		for (var e = $r, t = ei = $r = 0; t < e;) {
			var n = Qr[t];
			Qr[t++] = null;
			var r = Qr[t];
			Qr[t++] = null;
			var i = Qr[t];
			Qr[t++] = null;
			var a = Qr[t];
			if (Qr[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && ai(n, i, a);
		}
	}
	function ni(e, t, n, r) {
		Qr[$r++] = e, Qr[$r++] = t, Qr[$r++] = n, Qr[$r++] = r, ei |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function ri(e, t, n, r) {
		return ni(e, t, n, r), oi(e);
	}
	function ii(e, t) {
		return ni(e, null, null, t), oi(e);
	}
	function ai(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - F(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function oi(e) {
		if (50 < lu) throw lu = 0, uu = null, Error(i(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var si = {};
	function ci(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function li(e, t, n, r) {
		return new ci(e, t, n, r);
	}
	function ui(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function di(e, t) {
		var n = e.alternate;
		return n === null ? (n = li(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 65011712, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function fi(e, t) {
		e.flags &= 65011714;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function pi(e, t, n, r, a, o) {
		var s = 0;
		if (r = e, typeof e == "function") ui(e) && (s = 1);
		else if (typeof e == "string") s = Uf(e, n, le.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (e) {
			case k: return e = li(31, n, t, a), e.elementType = k, e.lanes = o, e;
			case y: return mi(n.children, a, o, t);
			case b:
				s = 8, a |= 24;
				break;
			case x: return e = li(12, n, t, a | 2), e.elementType = x, e.lanes = o, e;
			case T: return e = li(13, n, t, a), e.elementType = T, e.lanes = o, e;
			case E: return e = li(19, n, t, a), e.elementType = E, e.lanes = o, e;
			default:
				if (typeof e == "object" && e) switch (e.$$typeof) {
					case C:
						s = 10;
						break a;
					case S:
						s = 9;
						break a;
					case w:
						s = 11;
						break a;
					case D:
						s = 14;
						break a;
					case O:
						s = 16, r = null;
						break a;
				}
				s = 29, n = Error(i(130, e === null ? "null" : typeof e, "")), r = null;
		}
		return t = li(s, n, t, a), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function mi(e, t, n, r) {
		return e = li(7, e, r, t), e.lanes = n, e;
	}
	function hi(e, t, n) {
		return e = li(6, e, null, t), e.lanes = n, e;
	}
	function gi(e) {
		var t = li(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function _i(e, t, n) {
		return t = li(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var vi = /* @__PURE__ */ new WeakMap();
	function yi(e, t) {
		if (typeof e == "object" && e) {
			var n = vi.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: Ce(t)
			}, vi.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: Ce(t)
		};
	}
	var bi = [], xi = 0, Si = null, Ci = 0, wi = [], Ti = 0, Ei = null, Di = 1, Oi = "";
	function ki(e, t) {
		bi[xi++] = Ci, bi[xi++] = Si, Si = e, Ci = t;
	}
	function Ai(e, t, n) {
		wi[Ti++] = Di, wi[Ti++] = Oi, wi[Ti++] = Ei, Ei = e;
		var r = Di;
		e = Oi;
		var i = 32 - F(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - F(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, Di = 1 << 32 - F(t) + i | n << i | r, Oi = a + e;
		} else Di = 1 << a | n << i | r, Oi = e;
	}
	function ji(e) {
		e.return !== null && (ki(e, 1), Ai(e, 1, 0));
	}
	function Mi(e) {
		for (; e === Si;) Si = bi[--xi], bi[xi] = null, Ci = bi[--xi], bi[xi] = null;
		for (; e === Ei;) Ei = wi[--Ti], wi[Ti] = null, Oi = wi[--Ti], wi[Ti] = null, Di = wi[--Ti], wi[Ti] = null;
	}
	function Ni(e, t) {
		wi[Ti++] = Di, wi[Ti++] = Oi, wi[Ti++] = Ei, Di = t.id, Oi = t.overflow, Ei = e;
	}
	var Pi = null, Fi = null, R = !1, Ii = null, Li = !1, Ri = Error(i(519));
	function zi(e) {
		throw Gi(yi(Error(i(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), Ri;
	}
	function Bi(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[lt] = e, t[ut] = r, n) {
			case "dialog":
				$("cancel", t), $("close", t);
				break;
			case "iframe":
			case "object":
			case "embed":
				$("load", t);
				break;
			case "video":
			case "audio":
				for (n = 0; n < gd.length; n++) $(gd[n], t);
				break;
			case "source":
				$("error", t);
				break;
			case "img":
			case "image":
			case "link":
				$("error", t), $("load", t);
				break;
			case "details":
				$("toggle", t);
				break;
			case "input":
				$("invalid", t), Ht(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				$("invalid", t);
				break;
			case "textarea": $("invalid", t), Gt(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || jd(t.textContent, n) ? (r.popover != null && ($("beforetoggle", t), $("toggle", t)), r.onScroll != null && $("scroll", t), r.onScrollEnd != null && $("scrollend", t), r.onClick != null && (t.onclick = en), t = !0) : t = !1, t || zi(e, !0);
	}
	function Vi(e) {
		for (Pi = e.return; Pi;) switch (Pi.tag) {
			case 5:
			case 31:
			case 13:
				Li = !1;
				return;
			case 27:
			case 3:
				Li = !0;
				return;
			default: Pi = Pi.return;
		}
	}
	function Hi(e) {
		if (e !== Pi) return !1;
		if (!R) return Vi(e), R = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = !(n !== "form" && n !== "button") || Ud(e.type, e.memoizedProps)), n = !n), n && Fi && zi(e), Vi(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			Fi = uf(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			Fi = uf(e);
		} else t === 27 ? (t = Fi, Zd(e.type) ? (e = lf, lf = null, Fi = e) : Fi = t) : Fi = Pi ? cf(e.stateNode.nextSibling) : null;
		return !0;
	}
	function Ui() {
		Fi = Pi = null, R = !1;
	}
	function Wi() {
		var e = Ii;
		return e !== null && (Yl === null ? Yl = e : Yl.push.apply(Yl, e), Ii = null), e;
	}
	function Gi(e) {
		Ii === null ? Ii = [e] : Ii.push(e);
	}
	var Ki = ce(null), qi = null, Ji = null;
	function Yi(e, t, n) {
		P(Ki, t._currentValue), t._currentValue = n;
	}
	function Xi(e) {
		e._currentValue = Ki.current, N(Ki);
	}
	function Zi(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function Qi(e, t, n, r) {
		var a = e.child;
		for (a !== null && (a.return = e); a !== null;) {
			var o = a.dependencies;
			if (o !== null) {
				var s = a.child;
				o = o.firstContext;
				a: for (; o !== null;) {
					var c = o;
					o = a;
					for (var l = 0; l < t.length; l++) if (c.context === t[l]) {
						o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), Zi(o.return, n, e), r || (s = null);
						break a;
					}
					o = c.next;
				}
			} else if (a.tag === 18) {
				if (s = a.return, s === null) throw Error(i(341));
				s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), Zi(s, n, e), s = null;
			} else s = a.child;
			if (s !== null) s.return = a;
			else for (s = a; s !== null;) {
				if (s === e) {
					s = null;
					break;
				}
				if (a = s.sibling, a !== null) {
					a.return = s.return, s = a;
					break;
				}
				s = s.return;
			}
			a = s;
		}
	}
	function $i(e, t, n, r) {
		e = null;
		for (var a = t, o = !1; a !== null;) {
			if (!o) {
				if (a.flags & 524288) o = !0;
				else if (a.flags & 262144) break;
			}
			if (a.tag === 10) {
				var s = a.alternate;
				if (s === null) throw Error(i(387));
				if (s = s.memoizedProps, s !== null) {
					var c = a.type;
					Cr(a.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (a === fe.current) {
				if (s = a.alternate, s === null) throw Error(i(387));
				s.memoizedState.memoizedState !== a.memoizedState.memoizedState && (e === null ? e = [Qf] : e.push(Qf));
			}
			a = a.return;
		}
		e !== null && Qi(t, e, n, r), t.flags |= 262144;
	}
	function ea(e) {
		for (e = e.firstContext; e !== null;) {
			if (!Cr(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function ta(e) {
		qi = e, Ji = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function na(e) {
		return ia(qi, e);
	}
	function ra(e, t) {
		return qi === null && ta(e), ia(e, t);
	}
	function ia(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, Ji === null) {
			if (e === null) throw Error(i(308));
			Ji = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else Ji = Ji.next = t;
		return n;
	}
	var aa = typeof AbortController < "u" ? AbortController : function() {
		var e = [], t = this.signal = {
			aborted: !1,
			addEventListener: function(t, n) {
				e.push(n);
			}
		};
		this.abort = function() {
			t.aborted = !0, e.forEach(function(e) {
				return e();
			});
		};
	}, oa = t.unstable_scheduleCallback, sa = t.unstable_NormalPriority, ca = {
		$$typeof: C,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function la() {
		return {
			controller: new aa(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function ua(e) {
		e.refCount--, e.refCount === 0 && oa(sa, function() {
			e.controller.abort();
		});
	}
	var da = null, fa = 0, pa = 0, ma = null;
	function ha(e, t) {
		if (da === null) {
			var n = da = [];
			fa = 0, pa = ud(), ma = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return fa++, t.then(ga, ga), t;
	}
	function ga() {
		if (--fa === 0 && da !== null) {
			ma !== null && (ma.status = "fulfilled");
			var e = da;
			da = null, pa = 0, ma = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function _a(e, t) {
		var n = [], r = {
			status: "pending",
			value: null,
			reason: null,
			then: function(e) {
				n.push(e);
			}
		};
		return e.then(function() {
			r.status = "fulfilled", r.value = t;
			for (var e = 0; e < n.length; e++) (0, n[e])(t);
		}, function(e) {
			for (r.status = "rejected", r.reason = e, e = 0; e < n.length; e++) (0, n[e])(void 0);
		}), r;
	}
	var va = j.S;
	j.S = function(e, t) {
		Ql = ke(), typeof t == "object" && t && typeof t.then == "function" && ha(e, t), va !== null && va(e, t);
	};
	var ya = ce(null);
	function ba() {
		var e = ya.current;
		return e === null ? Il.pooledCache : e;
	}
	function xa(e, t) {
		t === null ? P(ya, ya.current) : P(ya, t.pool);
	}
	function Sa() {
		var e = ba();
		return e === null ? null : {
			parent: ca._currentValue,
			pool: e
		};
	}
	var Ca = Error(i(460)), wa = Error(i(474)), Ta = Error(i(542)), Ea = { then: function() {} };
	function Da(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function Oa(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(en, en), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, Ma(e), e;
			default:
				if (typeof t.status == "string") t.then(en, en);
				else {
					if (e = Il, e !== null && 100 < e.shellSuspendCounter) throw Error(i(482));
					e = t, e.status = "pending", e.then(function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "fulfilled", n.value = e;
						}
					}, function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "rejected", n.reason = e;
						}
					});
				}
				switch (t.status) {
					case "fulfilled": return t.value;
					case "rejected": throw e = t.reason, Ma(e), e;
				}
				throw Aa = t, Ca;
		}
	}
	function ka(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (Aa = e, Ca) : e;
		}
	}
	var Aa = null;
	function ja() {
		if (Aa === null) throw Error(i(459));
		var e = Aa;
		return Aa = null, e;
	}
	function Ma(e) {
		if (e === Ca || e === Ta) throw Error(i(483));
	}
	var Na = null, Pa = 0;
	function Fa(e) {
		var t = Pa;
		return Pa += 1, Na === null && (Na = []), Oa(Na, e, t);
	}
	function Ia(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function La(e, t) {
		throw t.$$typeof === g ? Error(i(525)) : (e = Object.prototype.toString.call(t), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function Ra(e) {
		function t(t, n) {
			if (e) {
				var r = t.deletions;
				r === null ? (t.deletions = [n], t.flags |= 16) : r.push(n);
			}
		}
		function n(n, r) {
			if (!e) return null;
			for (; r !== null;) t(n, r), r = r.sibling;
			return null;
		}
		function r(e) {
			for (var t = /* @__PURE__ */ new Map(); e !== null;) e.key === null ? t.set(e.index, e) : t.set(e.key, e), e = e.sibling;
			return t;
		}
		function a(e, t) {
			return e = di(e, t), e.index = 0, e.sibling = null, e;
		}
		function o(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 67108866, n) : (r = r.index, r < n ? (t.flags |= 67108866, n) : r)) : (t.flags |= 1048576, n);
		}
		function s(t) {
			return e && t.alternate === null && (t.flags |= 67108866), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = hi(n, e.mode, r), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var i = n.type;
			return i === y ? d(e, t, n.props.children, r, n.key) : t !== null && (t.elementType === i || typeof i == "object" && i && i.$$typeof === O && ka(i) === t.type) ? (t = a(t, n.props), Ia(t, n), t.return = e, t) : (t = pi(n.type, n.key, n.props, null, e.mode, r), Ia(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = _i(n, e.mode, r), t.return = e, t) : (t = a(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, i) {
			return t === null || t.tag !== 7 ? (t = mi(n, e.mode, r, i), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = hi("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case _: return n = pi(t.type, t.key, t.props, null, e.mode, n), Ia(n, t), n.return = e, n;
					case v: return t = _i(t, e.mode, n), t.return = e, t;
					case O: return t = ka(t), f(e, t, n);
				}
				if (A(t) || ne(t)) return t = mi(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, Fa(t), n);
				if (t.$$typeof === C) return f(e, ra(e, t), n);
				La(e, t);
			}
			return null;
		}
		function p(e, t, n, r) {
			var i = t === null ? null : t.key;
			if (typeof n == "string" && n !== "" || typeof n == "number" || typeof n == "bigint") return i === null ? c(e, t, "" + n, r) : null;
			if (typeof n == "object" && n) {
				switch (n.$$typeof) {
					case _: return n.key === i ? l(e, t, n, r) : null;
					case v: return n.key === i ? u(e, t, n, r) : null;
					case O: return n = ka(n), p(e, t, n, r);
				}
				if (A(n) || ne(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, Fa(n), r);
				if (n.$$typeof === C) return p(e, t, ra(e, n), r);
				La(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case _: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case v: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case O: return r = ka(r), m(e, t, n, r, i);
				}
				if (A(r) || ne(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, Fa(r), i);
				if (r.$$typeof === C) return m(e, t, n, ra(t, r), i);
				La(t, r);
			}
			return null;
		}
		function h(i, a, s, c) {
			for (var l = null, u = null, d = a, h = a = 0, g = null; d !== null && h < s.length; h++) {
				d.index > h ? (g = d, d = null) : g = d.sibling;
				var _ = p(i, d, s[h], c);
				if (_ === null) {
					d === null && (d = g);
					break;
				}
				e && d && _.alternate === null && t(i, d), a = o(_, a, h), u === null ? l = _ : u.sibling = _, u = _, d = g;
			}
			if (h === s.length) return n(i, d), R && ki(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return R && ki(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && g.alternate !== null && d.delete(g.key === null ? h : g.key), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), R && ki(i, h), l;
		}
		function g(a, s, c, l) {
			if (c == null) throw Error(i(151));
			for (var u = null, d = null, h = s, g = s = 0, _ = null, v = c.next(); h !== null && !v.done; g++, v = c.next()) {
				h.index > g ? (_ = h, h = null) : _ = h.sibling;
				var y = p(a, h, v.value, l);
				if (y === null) {
					h === null && (h = _);
					break;
				}
				e && h && y.alternate === null && t(a, h), s = o(y, s, g), d === null ? u = y : d.sibling = y, d = y, h = _;
			}
			if (v.done) return n(a, h), R && ki(a, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(a, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return R && ki(a, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, a, g, v.value, l), v !== null && (e && v.alternate !== null && h.delete(v.key === null ? g : v.key), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(a, e);
			}), R && ki(a, g), u;
		}
		function b(e, r, o, c) {
			if (typeof o == "object" && o && o.type === y && o.key === null && (o = o.props.children), typeof o == "object" && o) {
				switch (o.$$typeof) {
					case _:
						a: {
							for (var l = o.key; r !== null;) {
								if (r.key === l) {
									if (l = o.type, l === y) {
										if (r.tag === 7) {
											n(e, r.sibling), c = a(r, o.props.children), c.return = e, e = c;
											break a;
										}
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === O && ka(l) === r.type) {
										n(e, r.sibling), c = a(r, o.props), Ia(c, o), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								} else t(e, r);
								r = r.sibling;
							}
							o.type === y ? (c = mi(o.props.children, e.mode, c, o.key), c.return = e, e = c) : (c = pi(o.type, o.key, o.props, null, e.mode, c), Ia(c, o), c.return = e, e = c);
						}
						return s(e);
					case v:
						a: {
							for (l = o.key; r !== null;) {
								if (r.key === l) if (r.tag === 4 && r.stateNode.containerInfo === o.containerInfo && r.stateNode.implementation === o.implementation) {
									n(e, r.sibling), c = a(r, o.children || []), c.return = e, e = c;
									break a;
								} else {
									n(e, r);
									break;
								}
								else t(e, r);
								r = r.sibling;
							}
							c = _i(o, e.mode, c), c.return = e, e = c;
						}
						return s(e);
					case O: return o = ka(o), b(e, r, o, c);
				}
				if (A(o)) return h(e, r, o, c);
				if (ne(o)) {
					if (l = ne(o), typeof l != "function") throw Error(i(150));
					return o = l.call(o), g(e, r, o, c);
				}
				if (typeof o.then == "function") return b(e, r, Fa(o), c);
				if (o.$$typeof === C) return b(e, r, ra(e, o), c);
				La(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = a(r, o), c.return = e, e = c) : (n(e, r), c = hi(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				Pa = 0;
				var i = b(e, t, n, r);
				return Na = null, i;
			} catch (t) {
				if (t === Ca || t === Ta) throw t;
				var a = li(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var za = Ra(!0), Ba = Ra(!1), Va = !1;
	function Ha(e) {
		e.updateQueue = {
			baseState: e.memoizedState,
			firstBaseUpdate: null,
			lastBaseUpdate: null,
			shared: {
				pending: null,
				lanes: 0,
				hiddenCallbacks: null
			},
			callbacks: null
		};
	}
	function Ua(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function Wa(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function Ga(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, Y & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = oi(e), ai(e, null, n), t;
		}
		return ni(e, r, t, n), oi(e);
	}
	function Ka(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, nt(e, n);
		}
	}
	function qa(e, t) {
		var n = e.updateQueue, r = e.alternate;
		if (r !== null && (r = r.updateQueue, n === r)) {
			var i = null, a = null;
			if (n = n.firstBaseUpdate, n !== null) {
				do {
					var o = {
						lane: n.lane,
						tag: n.tag,
						payload: n.payload,
						callback: null,
						next: null
					};
					a === null ? i = a = o : a = a.next = o, n = n.next;
				} while (n !== null);
				a === null ? i = a = t : a = a.next = t;
			} else i = a = t;
			n = {
				baseState: r.baseState,
				firstBaseUpdate: i,
				lastBaseUpdate: a,
				shared: r.shared,
				callbacks: r.callbacks
			}, e.updateQueue = n;
			return;
		}
		e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
	}
	var Ja = !1;
	function Ya() {
		if (Ja) {
			var e = ma;
			if (e !== null) throw e;
		}
	}
	function Xa(e, t, n, r) {
		Ja = !1;
		var i = e.updateQueue;
		Va = !1;
		var a = i.firstBaseUpdate, o = i.lastBaseUpdate, s = i.shared.pending;
		if (s !== null) {
			i.shared.pending = null;
			var c = s, l = c.next;
			c.next = null, o === null ? a = l : o.next = l, o = c;
			var u = e.alternate;
			u !== null && (u = u.updateQueue, s = u.lastBaseUpdate, s !== o && (s === null ? u.firstBaseUpdate = l : s.next = l, u.lastBaseUpdate = c));
		}
		if (a !== null) {
			var d = i.baseState;
			o = 0, u = l = c = null, s = a;
			do {
				var f = s.lane & -536870913, p = f !== s.lane;
				if (p ? (Z & f) === f : (r & f) === f) {
					f !== 0 && f === pa && (Ja = !0), u !== null && (u = u.next = {
						lane: 0,
						tag: s.tag,
						payload: s.payload,
						callback: null,
						next: null
					});
					a: {
						var m = e, g = s;
						f = t;
						var _ = n;
						switch (g.tag) {
							case 1:
								if (m = g.payload, typeof m == "function") {
									d = m.call(_, d, f);
									break a;
								}
								d = m;
								break a;
							case 3: m.flags = m.flags & -65537 | 128;
							case 0:
								if (m = g.payload, f = typeof m == "function" ? m.call(_, d, f) : m, f == null) break a;
								d = h({}, d, f);
								break a;
							case 2: Va = !0;
						}
					}
					f = s.callback, f !== null && (e.flags |= 64, p && (e.flags |= 8192), p = i.callbacks, p === null ? i.callbacks = [f] : p.push(f));
				} else p = {
					lane: f,
					tag: s.tag,
					payload: s.payload,
					callback: s.callback,
					next: null
				}, u === null ? (l = u = p, c = d) : u = u.next = p, o |= f;
				if (s = s.next, s === null) {
					if (s = i.shared.pending, s === null) break;
					p = s, s = p.next, p.next = null, i.lastBaseUpdate = p, i.shared.pending = null;
				}
			} while (1);
			u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), Ul |= o, e.lanes = o, e.memoizedState = d;
		}
	}
	function Za(e, t) {
		if (typeof e != "function") throw Error(i(191, e));
		e.call(t);
	}
	function Qa(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) Za(n[e], t);
	}
	var $a = ce(null), eo = ce(0);
	function to(e, t) {
		e = Vl, P(eo, e), P($a, t), Vl = e | t.baseLanes;
	}
	function no() {
		P(eo, Vl), P($a, $a.current);
	}
	function ro() {
		Vl = eo.current, N($a), N(eo);
	}
	var io = ce(null), ao = null;
	function oo(e) {
		var t = e.alternate;
		P(fo, fo.current & 1), P(io, e), ao === null && (t === null || $a.current !== null || t.memoizedState !== null) && (ao = e);
	}
	function so(e) {
		P(fo, fo.current), P(io, e), ao === null && (ao = e);
	}
	function co(e) {
		e.tag === 22 ? (P(fo, fo.current), P(io, e), ao === null && (ao = e)) : lo(e);
	}
	function lo() {
		P(fo, fo.current), P(io, io.current);
	}
	function uo(e) {
		N(io), ao === e && (ao = null), N(fo);
	}
	var fo = ce(0);
	function po(e) {
		for (var t = e; t !== null;) {
			if (t.tag === 13) {
				var n = t.memoizedState;
				if (n !== null && (n = n.dehydrated, n === null || af(n) || of(n))) return t;
			} else if (t.tag === 19 && (t.memoizedProps.revealOrder === "forwards" || t.memoizedProps.revealOrder === "backwards" || t.memoizedProps.revealOrder === "unstable_legacy-backwards" || t.memoizedProps.revealOrder === "together")) {
				if (t.flags & 128) return t;
			} else if (t.child !== null) {
				t.child.return = t, t = t.child;
				continue;
			}
			if (t === e) break;
			for (; t.sibling === null;) {
				if (t.return === null || t.return === e) return null;
				t = t.return;
			}
			t.sibling.return = t.return, t = t.sibling;
		}
		return null;
	}
	var mo = 0, z = null, B = null, ho = null, go = !1, _o = !1, vo = !1, yo = 0, bo = 0, xo = null, So = 0;
	function Co() {
		throw Error(i(321));
	}
	function wo(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!Cr(e[n], t[n])) return !1;
		return !0;
	}
	function To(e, t, n, r, i, a) {
		return mo = a, z = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, j.H = e === null || e.memoizedState === null ? zs : Bs, vo = !1, a = n(r, i), vo = !1, _o && (a = Do(t, n, r, i)), Eo(e), a;
	}
	function Eo(e) {
		j.H = U;
		var t = B !== null && B.next !== null;
		if (mo = 0, ho = B = z = null, go = !1, bo = 0, xo = null, t) throw Error(i(300));
		e === null || rc || (e = e.dependencies, e !== null && ea(e) && (rc = !0));
	}
	function Do(e, t, n, r) {
		z = e;
		var a = 0;
		do {
			if (_o && (xo = null), bo = 0, _o = !1, 25 <= a) throw Error(i(301));
			if (a += 1, ho = B = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			j.H = Vs, o = t(n, r);
		} while (_o);
		return o;
	}
	function Oo() {
		var e = j.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? Fo(t) : t, e = e.useState()[0], (B === null ? null : B.memoizedState) !== e && (z.flags |= 1024), t;
	}
	function ko() {
		var e = yo !== 0;
		return yo = 0, e;
	}
	function Ao(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function jo(e) {
		if (go) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			go = !1;
		}
		mo = 0, ho = B = z = null, _o = !1, bo = yo = 0, xo = null;
	}
	function Mo() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return ho === null ? z.memoizedState = ho = e : ho = ho.next = e, ho;
	}
	function No() {
		if (B === null) {
			var e = z.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = B.next;
		var t = ho === null ? z.memoizedState : ho.next;
		if (t !== null) ho = t, B = e;
		else {
			if (e === null) throw z.alternate === null ? Error(i(467)) : Error(i(310));
			B = e, e = {
				memoizedState: B.memoizedState,
				baseState: B.baseState,
				baseQueue: B.baseQueue,
				queue: B.queue,
				next: null
			}, ho === null ? z.memoizedState = ho = e : ho = ho.next = e;
		}
		return ho;
	}
	function Po() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function Fo(e) {
		var t = bo;
		return bo += 1, xo === null && (xo = []), e = Oa(xo, e, t), t = z, (ho === null ? t.memoizedState : ho.next) === null && (t = t.alternate, j.H = t === null || t.memoizedState === null ? zs : Bs), e;
	}
	function Io(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return Fo(e);
			if (e.$$typeof === C) return na(e);
		}
		throw Error(i(438, String(e)));
	}
	function Lo(e) {
		var t = null, n = z.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = z.alternate;
			r !== null && (r = r.updateQueue, r !== null && (r = r.memoCache, r != null && (t = {
				data: r.data.map(function(e) {
					return e.slice();
				}),
				index: 0
			})));
		}
		if (t ??= {
			data: [],
			index: 0
		}, n === null && (n = Po(), z.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = ee;
		return t.index++, n;
	}
	function Ro(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function zo(e) {
		return Bo(No(), B, e);
	}
	function Bo(e, t, n) {
		var r = e.queue;
		if (r === null) throw Error(i(311));
		r.lastRenderedReducer = n;
		var a = e.baseQueue, o = r.pending;
		if (o !== null) {
			if (a !== null) {
				var s = a.next;
				a.next = o.next, o.next = s;
			}
			t.baseQueue = a = o, r.pending = null;
		}
		if (o = e.baseState, a === null) e.memoizedState = o;
		else {
			t = a.next;
			var c = s = null, l = null, u = t, d = !1;
			do {
				var f = u.lane & -536870913;
				if (f === u.lane ? (mo & f) === f : (Z & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === pa && (d = !0);
					else if ((mo & p) === p) {
						u = u.next, p === pa && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, s = o) : l = l.next = f, z.lanes |= p, Ul |= p;
					f = u.action, vo && n(o, f), o = u.hasEagerState ? u.eagerState : n(o, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, s = o) : l = l.next = p, z.lanes |= f, Ul |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? s = o : l.next = c, !Cr(o, e.memoizedState) && (rc = !0, d && (n = ma, n !== null))) throw n;
			e.memoizedState = o, e.baseState = s, e.baseQueue = l, r.lastRenderedState = o;
		}
		return a === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function Vo(e) {
		var t = No(), n = t.queue;
		if (n === null) throw Error(i(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, a = n.pending, o = t.memoizedState;
		if (a !== null) {
			n.pending = null;
			var s = a = a.next;
			do
				o = e(o, s.action), s = s.next;
			while (s !== a);
			Cr(o, t.memoizedState) || (rc = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function V(e, t, n) {
		var r = z, a = No(), o = R;
		if (o) {
			if (n === void 0) throw Error(i(407));
			n = n();
		} else n = t();
		var s = !Cr((B || a).memoizedState, n);
		if (s && (a.memoizedState = n, rc = !0), a = a.queue, ds(Uo.bind(null, r, a, e), [e]), a.getSnapshot !== t || s || ho !== null && ho.memoizedState.tag & 1) {
			if (r.flags |= 2048, os(9, { destroy: void 0 }, Ho.bind(null, r, a, n, t), null), Il === null) throw Error(i(349));
			o || mo & 127 || H(r, t, n);
		}
		return n;
	}
	function H(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = z.updateQueue, t === null ? (t = Po(), z.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function Ho(e, t, n, r) {
		t.value = n, t.getSnapshot = r, Wo(t) && Go(e);
	}
	function Uo(e, t, n) {
		return n(function() {
			Wo(t) && Go(e);
		});
	}
	function Wo(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !Cr(e, n);
		} catch {
			return !0;
		}
	}
	function Go(e) {
		var t = ii(e, 2);
		t !== null && pu(t, e, 2);
	}
	function Ko(e) {
		var t = Mo();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), vo) {
				Be(!0);
				try {
					n();
				} finally {
					Be(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: Ro,
			lastRenderedState: e
		}, t;
	}
	function qo(e, t, n, r) {
		return e.baseState = n, Bo(e, B, typeof r == "function" ? r : Ro);
	}
	function Jo(e, t, n, r, a) {
		if (Is(e)) throw Error(i(485));
		if (e = t.action, e !== null) {
			var o = {
				payload: a,
				action: e,
				next: null,
				isTransition: !0,
				status: "pending",
				value: null,
				reason: null,
				listeners: [],
				then: function(e) {
					o.listeners.push(e);
				}
			};
			j.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, Yo(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function Yo(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = j.T, o = {};
			j.T = o;
			try {
				var s = n(i, r), c = j.S;
				c !== null && c(o, s), Xo(e, t, s);
			} catch (n) {
				Qo(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), j.T = a;
			}
		} else try {
			a = n(i, r), Xo(e, t, a);
		} catch (n) {
			Qo(e, t, n);
		}
	}
	function Xo(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			Zo(e, t, n);
		}, function(n) {
			return Qo(e, t, n);
		}) : Zo(e, t, n);
	}
	function Zo(e, t, n) {
		t.status = "fulfilled", t.value = n, $o(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, Yo(e, n)));
	}
	function Qo(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, $o(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function $o(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function es(e, t) {
		return t;
	}
	function ts(e, t) {
		if (R) {
			var n = Il.formState;
			if (n !== null) {
				a: {
					var r = z;
					if (R) {
						if (Fi) {
							b: {
								for (var i = Fi, a = Li; i.nodeType !== 8;) {
									if (!a) {
										i = null;
										break b;
									}
									if (i = cf(i.nextSibling), i === null) {
										i = null;
										break b;
									}
								}
								a = i.data, i = a === "F!" || a === "F" ? i : null;
							}
							if (i) {
								Fi = cf(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						zi(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = Mo(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: es,
			lastRenderedState: t
		}, n.queue = r, n = Ns.bind(null, z, r), r.dispatch = n, r = Ko(!1), a = Fs.bind(null, z, !1, r.queue), r = Mo(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = Jo.bind(null, z, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function ns(e) {
		return rs(No(), B, e);
	}
	function rs(e, t, n) {
		if (t = Bo(e, t, es)[0], e = zo(Ro)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = Fo(t);
		} catch (e) {
			throw e === Ca ? Ta : e;
		}
		else r = t;
		t = No();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (z.flags |= 2048, os(9, { destroy: void 0 }, is.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function is(e, t) {
		e.action = t;
	}
	function as(e) {
		var t = No(), n = B;
		if (n !== null) return rs(t, n, e);
		No(), t = t.memoizedState, n = No();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function os(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = z.updateQueue, t === null && (t = Po(), z.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function ss() {
		return No().memoizedState;
	}
	function cs(e, t, n, r) {
		var i = Mo();
		z.flags |= e, i.memoizedState = os(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function ls(e, t, n, r) {
		var i = No();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		B !== null && r !== null && wo(r, B.memoizedState.deps) ? i.memoizedState = os(t, a, n, r) : (z.flags |= e, i.memoizedState = os(1 | t, a, n, r));
	}
	function us(e, t) {
		cs(8390656, 8, e, t);
	}
	function ds(e, t) {
		ls(2048, 8, e, t);
	}
	function fs(e) {
		z.flags |= 4;
		var t = z.updateQueue;
		if (t === null) t = Po(), z.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function ps(e) {
		var t = No().memoizedState;
		return fs({
			ref: t,
			nextImpl: e
		}), function() {
			if (Y & 2) throw Error(i(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function ms(e, t) {
		return ls(4, 2, e, t);
	}
	function hs(e, t) {
		return ls(4, 4, e, t);
	}
	function gs(e, t) {
		if (typeof t == "function") {
			e = e();
			var n = t(e);
			return function() {
				typeof n == "function" ? n() : t(null);
			};
		}
		if (t != null) return e = e(), t.current = e, function() {
			t.current = null;
		};
	}
	function _s(e, t, n) {
		n = n == null ? null : n.concat([e]), ls(4, 4, gs.bind(null, t, e), n);
	}
	function vs() {}
	function ys(e, t) {
		var n = No();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && wo(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function bs(e, t) {
		var n = No();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && wo(t, r[1])) return r[0];
		if (r = e(), vo) {
			Be(!0);
			try {
				e();
			} finally {
				Be(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function xs(e, t, n) {
		return n === void 0 || mo & 1073741824 && !(Z & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = fu(), z.lanes |= e, Ul |= e, n);
	}
	function Ss(e, t, n, r) {
		return Cr(n, t) ? n : $a.current === null ? !(mo & 42) || mo & 1073741824 && !(Z & 261930) ? (rc = !0, e.memoizedState = n) : (e = fu(), z.lanes |= e, Ul |= e, t) : (e = xs(e, n, r), Cr(e, t) || (rc = !0), e);
	}
	function Cs(e, t, n, r, i) {
		var a = M.p;
		M.p = a !== 0 && 8 > a ? a : 8;
		var o = j.T, s = {};
		j.T = s, Fs(e, !1, t, n);
		try {
			var c = i(), l = j.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? Ps(e, t, _a(c, r), du(e)) : Ps(e, t, r, du(e));
		} catch (n) {
			Ps(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, du());
		} finally {
			M.p = a, o !== null && s.types !== null && (o.types = s.types), j.T = o;
		}
	}
	function ws() {}
	function Ts(e, t, n, r) {
		if (e.tag !== 5) throw Error(i(476));
		var a = Es(e).queue;
		Cs(e, a, t, ae, n === null ? ws : function() {
			return Ds(e), n(r);
		});
	}
	function Es(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: ae,
			baseState: ae,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: Ro,
				lastRenderedState: ae
			},
			next: null
		};
		var n = {};
		return t.next = {
			memoizedState: n,
			baseState: n,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: Ro,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function Ds(e) {
		var t = Es(e);
		t.next === null && (t = e.alternate.memoizedState), Ps(e, t.next.queue, {}, du());
	}
	function Os() {
		return na(Qf);
	}
	function ks() {
		return No().memoizedState;
	}
	function As() {
		return No().memoizedState;
	}
	function js(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = du();
					e = Wa(n);
					var r = Ga(t, e, n);
					r !== null && (pu(r, t, n), Ka(r, t, n)), t = { cache: la() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function Ms(e, t, n) {
		var r = du();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, Is(e) ? Ls(t, n) : (n = ri(e, t, n, r), n !== null && (pu(n, e, r), Rs(n, t, r)));
	}
	function Ns(e, t, n) {
		Ps(e, t, n, du());
	}
	function Ps(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (Is(e)) Ls(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, Cr(s, o)) return ni(e, t, i, 0), Il === null && ti(), !1;
			} catch {}
			if (n = ri(e, t, i, r), n !== null) return pu(n, e, r), Rs(n, t, r), !0;
		}
		return !1;
	}
	function Fs(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: ud(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, Is(e)) {
			if (t) throw Error(i(479));
		} else t = ri(e, n, r, 2), t !== null && pu(t, e, 2);
	}
	function Is(e) {
		var t = e.alternate;
		return e === z || t !== null && t === z;
	}
	function Ls(e, t) {
		_o = go = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function Rs(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, nt(e, n);
		}
	}
	var U = {
		readContext: na,
		use: Io,
		useCallback: Co,
		useContext: Co,
		useEffect: Co,
		useImperativeHandle: Co,
		useLayoutEffect: Co,
		useInsertionEffect: Co,
		useMemo: Co,
		useReducer: Co,
		useRef: Co,
		useState: Co,
		useDebugValue: Co,
		useDeferredValue: Co,
		useTransition: Co,
		useSyncExternalStore: Co,
		useId: Co,
		useHostTransitionStatus: Co,
		useFormState: Co,
		useActionState: Co,
		useOptimistic: Co,
		useMemoCache: Co,
		useCacheRefresh: Co
	};
	U.useEffectEvent = Co;
	var zs = {
		readContext: na,
		use: Io,
		useCallback: function(e, t) {
			return Mo().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: na,
		useEffect: us,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), cs(4194308, 4, gs.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return cs(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			cs(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = Mo();
			t = t === void 0 ? null : t;
			var r = e();
			if (vo) {
				Be(!0);
				try {
					e();
				} finally {
					Be(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = Mo();
			if (n !== void 0) {
				var i = n(t);
				if (vo) {
					Be(!0);
					try {
						n(t);
					} finally {
						Be(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = Ms.bind(null, z, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = Mo();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = Ko(e);
			var t = e.queue, n = Ns.bind(null, z, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: vs,
		useDeferredValue: function(e, t) {
			return xs(Mo(), e, t);
		},
		useTransition: function() {
			var e = Ko(!1);
			return e = Cs.bind(null, z, e.queue, !0, !1), Mo().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = z, a = Mo();
			if (R) {
				if (n === void 0) throw Error(i(407));
				n = n();
			} else {
				if (n = t(), Il === null) throw Error(i(349));
				Z & 127 || H(r, t, n);
			}
			a.memoizedState = n;
			var o = {
				value: n,
				getSnapshot: t
			};
			return a.queue = o, us(Uo.bind(null, r, o, e), [e]), r.flags |= 2048, os(9, { destroy: void 0 }, Ho.bind(null, r, o, n, t), null), n;
		},
		useId: function() {
			var e = Mo(), t = Il.identifierPrefix;
			if (R) {
				var n = Oi, r = Di;
				n = (r & ~(1 << 32 - F(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = yo++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = So++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: Os,
		useFormState: ts,
		useActionState: ts,
		useOptimistic: function(e) {
			var t = Mo();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = Fs.bind(null, z, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: Lo,
		useCacheRefresh: function() {
			return Mo().memoizedState = js.bind(null, z);
		},
		useEffectEvent: function(e) {
			var t = Mo(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (Y & 2) throw Error(i(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, Bs = {
		readContext: na,
		use: Io,
		useCallback: ys,
		useContext: na,
		useEffect: ds,
		useImperativeHandle: _s,
		useInsertionEffect: ms,
		useLayoutEffect: hs,
		useMemo: bs,
		useReducer: zo,
		useRef: ss,
		useState: function() {
			return zo(Ro);
		},
		useDebugValue: vs,
		useDeferredValue: function(e, t) {
			return Ss(No(), B.memoizedState, e, t);
		},
		useTransition: function() {
			var e = zo(Ro)[0], t = No().memoizedState;
			return [typeof e == "boolean" ? e : Fo(e), t];
		},
		useSyncExternalStore: V,
		useId: ks,
		useHostTransitionStatus: Os,
		useFormState: ns,
		useActionState: ns,
		useOptimistic: function(e, t) {
			return qo(No(), B, e, t);
		},
		useMemoCache: Lo,
		useCacheRefresh: As
	};
	Bs.useEffectEvent = ps;
	var Vs = {
		readContext: na,
		use: Io,
		useCallback: ys,
		useContext: na,
		useEffect: ds,
		useImperativeHandle: _s,
		useInsertionEffect: ms,
		useLayoutEffect: hs,
		useMemo: bs,
		useReducer: Vo,
		useRef: ss,
		useState: function() {
			return Vo(Ro);
		},
		useDebugValue: vs,
		useDeferredValue: function(e, t) {
			var n = No();
			return B === null ? xs(n, e, t) : Ss(n, B.memoizedState, e, t);
		},
		useTransition: function() {
			var e = Vo(Ro)[0], t = No().memoizedState;
			return [typeof e == "boolean" ? e : Fo(e), t];
		},
		useSyncExternalStore: V,
		useId: ks,
		useHostTransitionStatus: Os,
		useFormState: as,
		useActionState: as,
		useOptimistic: function(e, t) {
			var n = No();
			return B === null ? (n.baseState = e, [e, n.queue.dispatch]) : qo(n, B, e, t);
		},
		useMemoCache: Lo,
		useCacheRefresh: As
	};
	Vs.useEffectEvent = ps;
	function Hs(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : h({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var Us = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = du(), i = Wa(r);
			i.payload = t, n != null && (i.callback = n), t = Ga(e, i, r), t !== null && (pu(t, e, r), Ka(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = du(), i = Wa(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = Ga(e, i, r), t !== null && (pu(t, e, r), Ka(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = du(), r = Wa(n);
			r.tag = 2, t != null && (r.callback = t), t = Ga(e, r, n), t !== null && (pu(t, e, n), Ka(t, e, n));
		}
	};
	function Ws(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !wr(n, r) || !wr(i, a) : !0;
	}
	function Gs(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && Us.enqueueReplaceState(t, t.state, null);
	}
	function Ks(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = h({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function qs(e) {
		Zr(e);
	}
	function Js(e) {
		console.error(e);
	}
	function Ys(e) {
		Zr(e);
	}
	function Xs(e, t) {
		try {
			var n = e.onUncaughtError;
			n(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Zs(e, t, n) {
		try {
			var r = e.onCaughtError;
			r(n.value, {
				componentStack: n.stack,
				errorBoundary: t.tag === 1 ? t.stateNode : null
			});
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Qs(e, t, n) {
		return n = Wa(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			Xs(e, t);
		}, n;
	}
	function $s(e) {
		return e = Wa(e), e.tag = 3, e;
	}
	function ec(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				Zs(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			Zs(t, n, r), typeof i != "function" && (tu === null ? tu = new Set([this]) : tu.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function tc(e, t, n, r, a) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && $i(t, n, a, !0), n = io.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13: return ao === null ? Tu() : n.alternate === null && Hl === 0 && (Hl = 3), n.flags &= -257, n.flags |= 65536, n.lanes = a, r === Ea ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = new Set([r]) : t.add(r), Wu(e, r, a)), !1;
					case 22: return n.flags |= 65536, r === Ea ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = new Set([r]) : n.add(r)), Wu(e, r, a)), !1;
				}
				throw Error(i(435, n.tag));
			}
			return Wu(e, r, a), Tu(), !1;
		}
		if (R) return t = io.current, t === null ? (r !== Ri && (t = Error(i(423), { cause: r }), Gi(yi(t, n))), e = e.current.alternate, e.flags |= 65536, a &= -a, e.lanes |= a, r = yi(r, n), a = Qs(e.stateNode, r, a), qa(e, a), Hl !== 4 && (Hl = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = a, r !== Ri && (e = Error(i(422), { cause: r }), Gi(yi(e, n)))), !1;
		var o = Error(i(520), { cause: r });
		if (o = yi(o, n), Jl === null ? Jl = [o] : Jl.push(o), Hl !== 4 && (Hl = 2), t === null) return !0;
		r = yi(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = a & -a, n.lanes |= e, e = Qs(n.stateNode, r, e), qa(n, e), !1;
				case 1: if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (tu === null || !tu.has(o)))) return n.flags |= 65536, a &= -a, n.lanes |= a, a = $s(a), ec(a, e, n, r), qa(n, a), !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var nc = Error(i(461)), rc = !1;
	function ic(e, t, n, r) {
		t.child = e === null ? Ba(t, null, n, r) : za(t, e.child, n, r);
	}
	function ac(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return ta(t), r = To(e, t, n, o, a, i), s = ko(), e !== null && !rc ? (Ao(e, t, i), G(e, t, i)) : (R && s && ji(t), t.flags |= 1, ic(e, t, r, i), t.child);
	}
	function oc(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !ui(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, sc(e, t, a, r, i)) : (e = pi(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !Oc(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? wr : n, n(o, r) && e.ref === t.ref) return G(e, t, i);
		}
		return t.flags |= 1, e = di(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function sc(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (wr(a, r) && e.ref === t.ref) if (rc = !1, t.pendingProps = r = a, Oc(e, i)) e.flags & 131072 && (rc = !0);
			else return t.lanes = e.lanes, G(e, t, i);
		}
		return mc(e, t, n, r, i);
	}
	function cc(e, t, n, r) {
		var i = r.children, a = e === null ? null : e.memoizedState;
		if (e === null && t.stateNode === null && (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), r.mode === "hidden") {
			if (t.flags & 128) {
				if (a = a === null ? n : a.baseLanes | n, e !== null) {
					for (r = t.child = e.child, i = 0; r !== null;) i = i | r.lanes | r.childLanes, r = r.sibling;
					r = i & ~a;
				} else r = 0, t.child = null;
				return W(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && xa(t, a === null ? null : a.cachePool), a === null ? no() : to(t, a), co(t);
			else return r = t.lanes = 536870912, W(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && xa(t, null), no(), lo(t)) : (xa(t, a.cachePool), to(t, a), lo(t), t.memoizedState = null);
		return ic(e, t, i, n), t.child;
	}
	function lc(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function W(e, t, n, r, i) {
		var a = ba();
		return a = a === null ? null : {
			parent: ca._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && xa(t, null), no(), co(t), e !== null && $i(e, t, r, !0), t.childLanes = i, null;
	}
	function uc(e, t) {
		return t = Cc({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function dc(e, t, n) {
		return za(t, e.child, null, n), e = uc(t, t.pendingProps), e.flags |= 2, uo(t), t.memoizedState = null, e;
	}
	function fc(e, t, n) {
		var r = t.pendingProps, a = (t.flags & 128) != 0;
		if (t.flags &= -129, e === null) {
			if (R) {
				if (r.mode === "hidden") return e = uc(t, r), t.lanes = 536870912, lc(null, e);
				if (so(t), (e = Fi) ? (e = rf(e, Li), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Ei === null ? null : {
						id: Di,
						overflow: Oi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = gi(e), n.return = t, t.child = n, Pi = t, Fi = null)) : e = null, e === null) throw zi(t);
				return t.lanes = 536870912, null;
			}
			return uc(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (so(t), a) if (t.flags & 256) t.flags &= -257, t = dc(e, t, n);
			else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
			else throw Error(i(558));
			else if (rc || $i(e, t, n, !1), a = (n & e.childLanes) !== 0, rc || a) {
				if (r = Il, r !== null && (s = rt(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, ii(e, s), pu(r, e, s), nc;
				Tu(), t = dc(e, t, n);
			} else e = o.treeContext, Fi = cf(s.nextSibling), Pi = t, R = !0, Ii = null, Li = !1, e !== null && Ni(t, e), t = uc(t, r), t.flags |= 4096;
			return t;
		}
		return e = di(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function pc(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(i(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function mc(e, t, n, r, i) {
		return ta(t), n = To(e, t, n, r, void 0, i), r = ko(), e !== null && !rc ? (Ao(e, t, i), G(e, t, i)) : (R && r && ji(t), t.flags |= 1, ic(e, t, n, i), t.child);
	}
	function hc(e, t, n, r, i, a) {
		return ta(t), t.updateQueue = null, n = Do(t, r, n, i), Eo(e), r = ko(), e !== null && !rc ? (Ao(e, t, a), G(e, t, a)) : (R && r && ji(t), t.flags |= 1, ic(e, t, n, a), t.child);
	}
	function gc(e, t, n, r, i) {
		if (ta(t), t.stateNode === null) {
			var a = si, o = n.contextType;
			typeof o == "object" && o && (a = na(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = Us, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, Ha(t), o = n.contextType, a.context = typeof o == "object" && o ? na(o) : si, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (Hs(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && Us.enqueueReplaceState(a, a.state, null), Xa(t, r, a, i), Ya(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = Ks(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = si, typeof u == "object" && u && (o = na(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && Gs(t, a, r, o), Va = !1;
			var f = t.memoizedState;
			a.state = f, Xa(t, r, a, i), Ya(), l = t.memoizedState, s || f !== l || Va ? (typeof d == "function" && (Hs(t, n, d, r), l = t.memoizedState), (c = Va || Ws(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, Ua(e, t), o = t.memoizedProps, u = Ks(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = si, typeof l == "object" && l && (c = na(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && Gs(t, a, r, c), Va = !1, f = t.memoizedState, a.state = f, Xa(t, r, a, i), Ya();
			var p = t.memoizedState;
			o !== d || f !== p || Va || e !== null && e.dependencies !== null && ea(e.dependencies) ? (typeof s == "function" && (Hs(t, n, s, r), p = t.memoizedState), (u = Va || Ws(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && ea(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, pc(e, t), r = (t.flags & 128) != 0, a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = za(t, e.child, null, i), t.child = za(t, null, n, i)) : ic(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = G(e, t, i), e;
	}
	function _c(e, t, n, r) {
		return Ui(), t.flags |= 256, ic(e, t, n, r), t.child;
	}
	var vc = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function yc(e) {
		return {
			baseLanes: e,
			cachePool: Sa()
		};
	}
	function bc(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= Kl), e;
	}
	function xc(e, t, n) {
		var r = t.pendingProps, a = !1, o = (t.flags & 128) != 0, s;
		if ((s = o) || (s = e !== null && e.memoizedState === null ? !1 : (fo.current & 2) != 0), s && (a = !0, t.flags &= -129), s = (t.flags & 32) != 0, t.flags &= -33, e === null) {
			if (R) {
				if (a ? oo(t) : lo(t), (e = Fi) ? (e = rf(e, Li), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Ei === null ? null : {
						id: Di,
						overflow: Oi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = gi(e), n.return = t, t.child = n, Pi = t, Fi = null)) : e = null, e === null) throw zi(t);
				return of(e) ? t.lanes = 32 : t.lanes = 536870912, null;
			}
			var c = r.children;
			return r = r.fallback, a ? (lo(t), a = t.mode, c = Cc({
				mode: "hidden",
				children: c
			}, a), r = mi(r, a, n, null), c.return = t, r.return = t, c.sibling = r, t.child = c, r = t.child, r.memoizedState = yc(n), r.childLanes = bc(e, s, n), t.memoizedState = vc, lc(null, r)) : (oo(t), Sc(t, c));
		}
		var l = e.memoizedState;
		if (l !== null && (c = l.dehydrated, c !== null)) {
			if (o) t.flags & 256 ? (oo(t), t.flags &= -257, t = wc(e, t, n)) : t.memoizedState === null ? (lo(t), c = r.fallback, a = t.mode, r = Cc({
				mode: "visible",
				children: r.children
			}, a), c = mi(c, a, n, null), c.flags |= 2, r.return = t, c.return = t, r.sibling = c, t.child = r, za(t, e.child, null, n), r = t.child, r.memoizedState = yc(n), r.childLanes = bc(e, s, n), t.memoizedState = vc, t = lc(null, r)) : (lo(t), t.child = e.child, t.flags |= 128, t = null);
			else if (oo(t), of(c)) {
				if (s = c.nextSibling && c.nextSibling.dataset, s) var u = s.dgst;
				s = u, r = Error(i(419)), r.stack = "", r.digest = s, Gi({
					value: r,
					source: null,
					stack: null
				}), t = wc(e, t, n);
			} else if (rc || $i(e, t, n, !1), s = (n & e.childLanes) !== 0, rc || s) {
				if (s = Il, s !== null && (r = rt(s, n), r !== 0 && r !== l.retryLane)) throw l.retryLane = r, ii(e, r), pu(s, e, r), nc;
				af(c) || Tu(), t = wc(e, t, n);
			} else af(c) ? (t.flags |= 192, t.child = e.child, t = null) : (e = l.treeContext, Fi = cf(c.nextSibling), Pi = t, R = !0, Ii = null, Li = !1, e !== null && Ni(t, e), t = Sc(t, r.children), t.flags |= 4096);
			return t;
		}
		return a ? (lo(t), c = r.fallback, a = t.mode, l = e.child, u = l.sibling, r = di(l, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = l.subtreeFlags & 65011712, u === null ? (c = mi(c, a, n, null), c.flags |= 2) : c = di(u, c), c.return = t, r.return = t, r.sibling = c, t.child = r, lc(null, r), r = t.child, c = e.child.memoizedState, c === null ? c = yc(n) : (a = c.cachePool, a === null ? a = Sa() : (l = ca._currentValue, a = a.parent === l ? a : {
			parent: l,
			pool: l
		}), c = {
			baseLanes: c.baseLanes | n,
			cachePool: a
		}), r.memoizedState = c, r.childLanes = bc(e, s, n), t.memoizedState = vc, lc(e.child, r)) : (oo(t), n = e.child, e = n.sibling, n = di(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (s = t.deletions, s === null ? (t.deletions = [e], t.flags |= 16) : s.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function Sc(e, t) {
		return t = Cc({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function Cc(e, t) {
		return e = li(22, e, null, t), e.lanes = 0, e;
	}
	function wc(e, t, n) {
		return za(t, e.child, null, n), e = Sc(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function Tc(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), Zi(e.return, t, n);
	}
	function Ec(e, t, n, r, i, a) {
		var o = e.memoizedState;
		o === null ? e.memoizedState = {
			isBackwards: t,
			rendering: null,
			renderingStartTime: 0,
			last: r,
			tail: n,
			tailMode: i,
			treeForkCount: a
		} : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = i, o.treeForkCount = a);
	}
	function Dc(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = fo.current, s = (o & 2) != 0;
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, P(fo, o), ic(e, t, r, n), r = R ? Ci : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && Tc(e, n, t);
			else if (e.tag === 19) Tc(e, n, t);
			else if (e.child !== null) {
				e.child.return = e, e = e.child;
				continue;
			}
			if (e === t) break a;
			for (; e.sibling === null;) {
				if (e.return === null || e.return === t) break a;
				e = e.return;
			}
			e.sibling.return = e.return, e = e.sibling;
		}
		switch (i) {
			case "forwards":
				for (n = t.child, i = null; n !== null;) e = n.alternate, e !== null && po(e) === null && (i = n), n = n.sibling;
				n = i, n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), Ec(t, !1, i, n, a, r);
				break;
			case "backwards":
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && po(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				Ec(t, !0, n, null, a, r);
				break;
			case "together":
				Ec(t, !1, null, null, void 0, r);
				break;
			default: t.memoizedState = null;
		}
		return t.child;
	}
	function G(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), Ul |= t.lanes, (n & t.childLanes) === 0) if (e !== null) {
			if ($i(e, t, n, !1), (n & t.childLanes) === 0) return null;
		} else return null;
		if (e !== null && t.child !== e.child) throw Error(i(153));
		if (t.child !== null) {
			for (e = t.child, n = di(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = di(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function Oc(e, t) {
		return (e.lanes & t) === 0 ? (e = e.dependencies, !!(e !== null && ea(e))) : !0;
	}
	function kc(e, t, n) {
		switch (t.tag) {
			case 3:
				pe(t, t.stateNode.containerInfo), Yi(t, ca, e.memoizedState.cache), Ui();
				break;
			case 27:
			case 5:
				he(t);
				break;
			case 4:
				pe(t, t.stateNode.containerInfo);
				break;
			case 10:
				Yi(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, so(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) return r.dehydrated === null ? (n & t.child.childLanes) === 0 ? (oo(t), e = G(e, t, n), e === null ? null : e.sibling) : xc(e, t, n) : (oo(t), t.flags |= 128, null);
				oo(t);
				break;
			case 19:
				var i = (e.flags & 128) != 0;
				if (r = (n & t.childLanes) !== 0, r ||= ($i(e, t, n, !1), (n & t.childLanes) !== 0), i) {
					if (r) return Dc(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), P(fo, fo.current), r) break;
				return null;
			case 22: return t.lanes = 0, cc(e, t, n, t.pendingProps);
			case 24: Yi(t, ca, e.memoizedState.cache);
		}
		return G(e, t, n);
	}
	function Ac(e, t, n) {
		if (e !== null) if (e.memoizedProps !== t.pendingProps) rc = !0;
		else {
			if (!Oc(e, n) && !(t.flags & 128)) return rc = !1, kc(e, t, n);
			rc = !!(e.flags & 131072);
		}
		else rc = !1, R && t.flags & 1048576 && Ai(t, Ci, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = ka(t.elementType), t.type = e, typeof e == "function") ui(e) ? (r = Ks(e, r), t.tag = 1, t = gc(null, t, e, r, n)) : (t.tag = 0, t = mc(null, t, e, r, n));
					else {
						if (e != null) {
							var a = e.$$typeof;
							if (a === w) {
								t.tag = 11, t = ac(null, t, e, r, n);
								break a;
							} else if (a === D) {
								t.tag = 14, t = oc(null, t, e, r, n);
								break a;
							}
						}
						throw t = ie(e) || e, Error(i(306, t, ""));
					}
				}
				return t;
			case 0: return mc(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, a = Ks(r, t.pendingProps), gc(e, t, r, a, n);
			case 3:
				a: {
					if (pe(t, t.stateNode.containerInfo), e === null) throw Error(i(387));
					r = t.pendingProps;
					var o = t.memoizedState;
					a = o.element, Ua(e, t), Xa(t, r, null, n);
					var s = t.memoizedState;
					if (r = s.cache, Yi(t, ca, r), r !== o.cache && Qi(t, [ca], n, !0), Ya(), r = s.element, o.isDehydrated) if (o = {
						element: r,
						isDehydrated: !1,
						cache: s.cache
					}, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
						t = _c(e, t, r, n);
						break a;
					} else if (r !== a) {
						a = yi(Error(i(424)), t), Gi(a), t = _c(e, t, r, n);
						break a;
					} else {
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (Fi = cf(e.firstChild), Pi = t, R = !0, Ii = null, Li = !0, n = Ba(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 4096, n = n.sibling;
					}
					else {
						if (Ui(), r === a) {
							t = G(e, t, n);
							break a;
						}
						ic(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return pc(e, t), e === null ? (n = kf(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : R || (n = t.type, e = t.pendingProps, r = Bd(de.current).createElement(n), r[lt] = t, r[ut] = e, Pd(r, n, e), St(r), t.stateNode = r) : t.memoizedState = kf(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return he(t), e === null && R && (r = t.stateNode = ff(t.type, t.pendingProps, de.current), Pi = t, Li = !0, a = Fi, Zd(t.type) ? (lf = a, Fi = cf(r.firstChild)) : Fi = a), ic(e, t, t.pendingProps.children, n), pc(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && R && ((a = r = Fi) && (r = tf(r, t.type, t.pendingProps, Li), r === null ? a = !1 : (t.stateNode = r, Pi = t, Fi = cf(r.firstChild), Li = !1, a = !0)), a || zi(t)), he(t), a = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, Ud(a, o) ? r = null : s !== null && Ud(a, s) && (t.flags |= 32), t.memoizedState !== null && (a = To(e, t, Oo, null, null, n), Qf._currentValue = a), pc(e, t), ic(e, t, r, n), t.child;
			case 6: return e === null && R && ((e = n = Fi) && (n = nf(n, t.pendingProps, Li), n === null ? e = !1 : (t.stateNode = n, Pi = t, Fi = null, e = !0)), e || zi(t)), null;
			case 13: return xc(e, t, n);
			case 4: return pe(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = za(t, null, r, n) : ic(e, t, r, n), t.child;
			case 11: return ac(e, t, t.type, t.pendingProps, n);
			case 7: return ic(e, t, t.pendingProps, n), t.child;
			case 8: return ic(e, t, t.pendingProps.children, n), t.child;
			case 12: return ic(e, t, t.pendingProps.children, n), t.child;
			case 10: return r = t.pendingProps, Yi(t, t.type, r.value), ic(e, t, r.children, n), t.child;
			case 9: return a = t.type._context, r = t.pendingProps.children, ta(t), a = na(a), r = r(a), t.flags |= 1, ic(e, t, r, n), t.child;
			case 14: return oc(e, t, t.type, t.pendingProps, n);
			case 15: return sc(e, t, t.type, t.pendingProps, n);
			case 19: return Dc(e, t, n);
			case 31: return fc(e, t, n);
			case 22: return cc(e, t, n, t.pendingProps);
			case 24: return ta(t), r = na(ca), e === null ? (a = ba(), a === null && (a = Il, o = la(), a.pooledCache = o, o.refCount++, o !== null && (a.pooledCacheLanes |= n), a = o), t.memoizedState = {
				parent: r,
				cache: a
			}, Ha(t), Yi(t, ca, a)) : ((e.lanes & n) !== 0 && (Ua(e, t), Xa(t, null, null, n), Ya()), a = e.memoizedState, o = t.memoizedState, a.parent === r ? (r = o.cache, Yi(t, ca, r), r !== a.cache && Qi(t, [ca], n, !0)) : (a = {
				parent: r,
				cache: r
			}, t.memoizedState = a, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = a), Yi(t, ca, r))), ic(e, t, t.pendingProps.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(i(156, t.tag));
	}
	function jc(e) {
		e.flags |= 4;
	}
	function Mc(e, t, n, r, i) {
		if ((t = (e.mode & 32) != 0) && (t = !1), t) {
			if (e.flags |= 16777216, (i & 335544128) === i) if (e.stateNode.complete) e.flags |= 8192;
			else if (Su()) e.flags |= 8192;
			else throw Aa = Ea, wa;
		} else e.flags &= -16777217;
	}
	function Nc(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !Wf(t)) if (Su()) e.flags |= 8192;
		else throw Aa = Ea, wa;
	}
	function Pc(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : Ze(), e.lanes |= t, ql |= t);
	}
	function Fc(e, t) {
		if (!R) switch (e.tailMode) {
			case "hidden":
				t = e.tail;
				for (var n = null; t !== null;) t.alternate !== null && (n = t), t = t.sibling;
				n === null ? e.tail = null : n.sibling = null;
				break;
			case "collapsed":
				n = e.tail;
				for (var r = null; n !== null;) n.alternate !== null && (r = n), n = n.sibling;
				r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
		}
	}
	function Ic(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 65011712, r |= i.flags & 65011712, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function Lc(e, t, n) {
		var r = t.pendingProps;
		switch (Mi(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return Ic(t), null;
			case 1: return Ic(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), Xi(ca), me(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (Hi(t) ? jc(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, Wi())), Ic(t), null;
			case 26:
				var a = t.type, o = t.memoizedState;
				return e === null ? (jc(t), o === null ? (Ic(t), Mc(t, a, null, r, n)) : (Ic(t), Nc(t, o))) : o ? o === e.memoizedState ? (Ic(t), t.flags &= -16777217) : (jc(t), Ic(t), Nc(t, o)) : (e = e.memoizedProps, e !== r && jc(t), Ic(t), Mc(t, a, e, r, n)), null;
			case 27:
				if (ge(t), n = de.current, a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && jc(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return Ic(t), null;
					}
					e = le.current, Hi(t) ? Bi(t, e) : (e = ff(a, r, n), t.stateNode = e, jc(t));
				}
				return Ic(t), null;
			case 5:
				if (ge(t), a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && jc(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return Ic(t), null;
					}
					if (o = le.current, Hi(t)) Bi(t, o);
					else {
						var s = Bd(de.current);
						switch (o) {
							case 1:
								o = s.createElementNS("http://www.w3.org/2000/svg", a);
								break;
							case 2:
								o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
								break;
							default: switch (a) {
								case "svg":
									o = s.createElementNS("http://www.w3.org/2000/svg", a);
									break;
								case "math":
									o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
									break;
								case "script":
									o = s.createElement("div"), o.innerHTML = "<script><\/script>", o = o.removeChild(o.firstChild);
									break;
								case "select":
									o = typeof r.is == "string" ? s.createElement("select", { is: r.is }) : s.createElement("select"), r.multiple ? o.multiple = !0 : r.size && (o.size = r.size);
									break;
								default: o = typeof r.is == "string" ? s.createElement(a, { is: r.is }) : s.createElement(a);
							}
						}
						o[lt] = t, o[ut] = r;
						a: for (s = t.child; s !== null;) {
							if (s.tag === 5 || s.tag === 6) o.appendChild(s.stateNode);
							else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
								s.child.return = s, s = s.child;
								continue;
							}
							if (s === t) break a;
							for (; s.sibling === null;) {
								if (s.return === null || s.return === t) break a;
								s = s.return;
							}
							s.sibling.return = s.return, s = s.sibling;
						}
						t.stateNode = o;
						a: switch (Pd(o, a, r), a) {
							case "button":
							case "input":
							case "select":
							case "textarea":
								r = !!r.autoFocus;
								break a;
							case "img":
								r = !0;
								break a;
							default: r = !1;
						}
						r && jc(t);
					}
				}
				return Ic(t), Mc(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && jc(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(i(166));
					if (e = de.current, Hi(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, a = Pi, a !== null) switch (a.tag) {
							case 27:
							case 5: r = a.memoizedProps;
						}
						e[lt] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || jd(e.nodeValue, n)), e || zi(t, !0);
					} else e = Bd(e).createTextNode(r), e[lt] = t, t.stateNode = e;
				}
				return Ic(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = Hi(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(i(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(557));
							e[lt] = t;
						} else Ui(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						Ic(t), e = !1;
					} else n = Wi(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (uo(t), t) : (uo(t), null);
					if (t.flags & 128) throw Error(i(558));
				}
				return Ic(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (a = Hi(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!a) throw Error(i(318));
							if (a = t.memoizedState, a = a === null ? null : a.dehydrated, !a) throw Error(i(317));
							a[lt] = t;
						} else Ui(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						Ic(t), a = !1;
					} else a = Wi(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), a = !0;
					if (!a) return t.flags & 256 ? (uo(t), t) : (uo(t), null);
				}
				return uo(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, a = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (a = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== a && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), Pc(t, t.updateQueue), Ic(t), null);
			case 4: return me(), e === null && xd(t.stateNode.containerInfo), Ic(t), null;
			case 10: return Xi(t.type), Ic(t), null;
			case 19:
				if (N(fo), r = t.memoizedState, r === null) return Ic(t), null;
				if (a = (t.flags & 128) != 0, o = r.rendering, o === null) if (a) Fc(r, !1);
				else {
					if (Hl !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
						if (o = po(e), o !== null) {
							for (t.flags |= 128, Fc(r, !1), e = o.updateQueue, t.updateQueue = e, Pc(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) fi(n, e), n = n.sibling;
							return P(fo, fo.current & 1 | 2), R && ki(t, r.treeForkCount), t.child;
						}
						e = e.sibling;
					}
					r.tail !== null && ke() > $l && (t.flags |= 128, a = !0, Fc(r, !1), t.lanes = 4194304);
				}
				else {
					if (!a) if (e = po(o), e !== null) {
						if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, Pc(t, e), Fc(r, !0), r.tail === null && r.tailMode === "hidden" && !o.alternate && !R) return Ic(t), null;
					} else 2 * ke() - r.renderingStartTime > $l && n !== 536870912 && (t.flags |= 128, a = !0, Fc(r, !1), t.lanes = 4194304);
					r.isBackwards ? (o.sibling = t.child, t.child = o) : (e = r.last, e === null ? t.child = o : e.sibling = o, r.last = o);
				}
				return r.tail === null ? (Ic(t), null) : (e = r.tail, r.rendering = e, r.tail = e.sibling, r.renderingStartTime = ke(), e.sibling = null, n = fo.current, P(fo, a ? n & 1 | 2 : n & 1), R && ki(t, r.treeForkCount), e);
			case 22:
			case 23: return uo(t), ro(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (Ic(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Ic(t), n = t.updateQueue, n !== null && Pc(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && N(ya), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), Xi(ca), Ic(t), null;
			case 25: return null;
			case 30: return null;
		}
		throw Error(i(156, t.tag));
	}
	function Rc(e, t) {
		switch (Mi(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return Xi(ca), me(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return ge(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (uo(t), t.alternate === null) throw Error(i(340));
					Ui();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (uo(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(i(340));
					Ui();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return N(fo), null;
			case 4: return me(), null;
			case 10: return Xi(t.type), null;
			case 22:
			case 23: return uo(t), ro(), e !== null && N(ya), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return Xi(ca), null;
			case 25: return null;
			default: return null;
		}
	}
	function K(e, t) {
		switch (Mi(t), t.tag) {
			case 3:
				Xi(ca), me();
				break;
			case 26:
			case 27:
			case 5:
				ge(t);
				break;
			case 4:
				me();
				break;
			case 31:
				t.memoizedState !== null && uo(t);
				break;
			case 13:
				uo(t);
				break;
			case 19:
				N(fo);
				break;
			case 10:
				Xi(t.type);
				break;
			case 22:
			case 23:
				uo(t), ro(), e !== null && N(ya);
				break;
			case 24: Xi(ca);
		}
	}
	function zc(e, t) {
		try {
			var n = t.updateQueue, r = n === null ? null : n.lastEffect;
			if (r !== null) {
				var i = r.next;
				n = i;
				do {
					if ((n.tag & e) === e) {
						r = void 0;
						var a = n.create, o = n.inst;
						r = a(), o.destroy = r;
					}
					n = n.next;
				} while (n !== i);
			}
		} catch (e) {
			Uu(t, t.return, e);
		}
	}
	function Bc(e, t, n) {
		try {
			var r = t.updateQueue, i = r === null ? null : r.lastEffect;
			if (i !== null) {
				var a = i.next;
				r = a;
				do {
					if ((r.tag & e) === e) {
						var o = r.inst, s = o.destroy;
						if (s !== void 0) {
							o.destroy = void 0, i = t;
							var c = n, l = s;
							try {
								l();
							} catch (e) {
								Uu(i, c, e);
							}
						}
					}
					r = r.next;
				} while (r !== a);
			}
		} catch (e) {
			Uu(t, t.return, e);
		}
	}
	function Vc(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var n = e.stateNode;
			try {
				Qa(t, n);
			} catch (t) {
				Uu(e, e.return, t);
			}
		}
	}
	function Hc(e, t, n) {
		n.props = Ks(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			Uu(e, t, n);
		}
	}
	function Uc(e, t) {
		try {
			var n = e.ref;
			if (n !== null) {
				switch (e.tag) {
					case 26:
					case 27:
					case 5:
						var r = e.stateNode;
						break;
					case 30:
						r = e.stateNode;
						break;
					default: r = e.stateNode;
				}
				typeof n == "function" ? e.refCleanup = n(r) : n.current = r;
			}
		} catch (n) {
			Uu(e, t, n);
		}
	}
	function Wc(e, t) {
		var n = e.ref, r = e.refCleanup;
		if (n !== null) if (typeof r == "function") try {
			r();
		} catch (n) {
			Uu(e, t, n);
		} finally {
			e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
		}
		else if (typeof n == "function") try {
			n(null);
		} catch (n) {
			Uu(e, t, n);
		}
		else n.current = null;
	}
	function Gc(e) {
		var t = e.type, n = e.memoizedProps, r = e.stateNode;
		try {
			a: switch (t) {
				case "button":
				case "input":
				case "select":
				case "textarea":
					n.autoFocus && r.focus();
					break a;
				case "img": n.src ? r.src = n.src : n.srcSet && (r.srcset = n.srcSet);
			}
		} catch (t) {
			Uu(e, e.return, t);
		}
	}
	function Kc(e, t, n) {
		try {
			var r = e.stateNode;
			Fd(r, e.type, n, t), r[ut] = t;
		} catch (t) {
			Uu(e, e.return, t);
		}
	}
	function qc(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Zd(e.type) || e.tag === 4;
	}
	function Jc(e) {
		a: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || qc(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && Zd(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function Yc(e, t, n) {
		var r = e.tag;
		if (r === 5 || r === 6) e = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(e, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(e), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = en));
		else if (r !== 4 && (r === 27 && Zd(e.type) && (n = e.stateNode, t = null), e = e.child, e !== null)) for (Yc(e, t, n), e = e.sibling; e !== null;) Yc(e, t, n), e = e.sibling;
	}
	function Xc(e, t, n) {
		var r = e.tag;
		if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
		else if (r !== 4 && (r === 27 && Zd(e.type) && (n = e.stateNode), e = e.child, e !== null)) for (Xc(e, t, n), e = e.sibling; e !== null;) Xc(e, t, n), e = e.sibling;
	}
	function Zc(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			Pd(t, r, n), t[lt] = e, t[ut] = n;
		} catch (t) {
			Uu(e, e.return, t);
		}
	}
	var Qc = !1, $c = !1, el = !1, tl = typeof WeakSet == "function" ? WeakSet : Set, nl = null;
	function rl(e, t) {
		if (e = e.containerInfo, Rd = sp, e = Or(e), kr(e)) {
			if ("selectionStart" in e) var n = {
				start: e.selectionStart,
				end: e.selectionEnd
			};
			else a: {
				n = (n = e.ownerDocument) && n.defaultView || window;
				var r = n.getSelection && n.getSelection();
				if (r && r.rangeCount !== 0) {
					n = r.anchorNode;
					var a = r.anchorOffset, o = r.focusNode;
					r = r.focusOffset;
					try {
						n.nodeType, o.nodeType;
					} catch {
						n = null;
						break a;
					}
					var s = 0, c = -1, l = -1, u = 0, d = 0, f = e, p = null;
					b: for (;;) {
						for (var m; f !== n || a !== 0 && f.nodeType !== 3 || (c = s + a), f !== o || r !== 0 && f.nodeType !== 3 || (l = s + r), f.nodeType === 3 && (s += f.nodeValue.length), (m = f.firstChild) !== null;) p = f, f = m;
						for (;;) {
							if (f === e) break b;
							if (p === n && ++u === a && (c = s), p === o && ++d === r && (l = s), (m = f.nextSibling) !== null) break;
							f = p, p = f.parentNode;
						}
						f = m;
					}
					n = c === -1 || l === -1 ? null : {
						start: c,
						end: l
					};
				} else n = null;
			}
			n ||= {
				start: 0,
				end: 0
			};
		} else n = null;
		for (zd = {
			focusedElem: e,
			selectionRange: n
		}, sp = !1, nl = t; nl !== null;) if (t = nl, e = t.child, t.subtreeFlags & 1028 && e !== null) e.return = t, nl = e;
		else for (; nl !== null;) {
			switch (t = nl, o = t.alternate, e = t.flags, t.tag) {
				case 0:
					if (e & 4 && (e = t.updateQueue, e = e === null ? null : e.events, e !== null)) for (n = 0; n < e.length; n++) a = e[n], a.ref.impl = a.nextImpl;
					break;
				case 11:
				case 15: break;
				case 1:
					if (e & 1024 && o !== null) {
						e = void 0, n = t, a = o.memoizedProps, o = o.memoizedState, r = n.stateNode;
						try {
							var h = Ks(n.type, a);
							e = r.getSnapshotBeforeUpdate(h, o), r.__reactInternalSnapshotBeforeUpdate = e;
						} catch (e) {
							Uu(n, n.return, e);
						}
					}
					break;
				case 3:
					if (e & 1024) {
						if (e = t.stateNode.containerInfo, n = e.nodeType, n === 9) ef(e);
						else if (n === 1) switch (e.nodeName) {
							case "HEAD":
							case "HTML":
							case "BODY":
								ef(e);
								break;
							default: e.textContent = "";
						}
					}
					break;
				case 5:
				case 26:
				case 27:
				case 6:
				case 4:
				case 17: break;
				default: if (e & 1024) throw Error(i(163));
			}
			if (e = t.sibling, e !== null) {
				e.return = t.return, nl = e;
				break;
			}
			nl = t.return;
		}
	}
	function q(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				_l(e, n), r & 4 && zc(5, n);
				break;
			case 1:
				if (_l(e, n), r & 4) if (e = n.stateNode, t === null) try {
					e.componentDidMount();
				} catch (e) {
					Uu(n, n.return, e);
				}
				else {
					var i = Ks(n.type, t.memoizedProps);
					t = t.memoizedState;
					try {
						e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
					} catch (e) {
						Uu(n, n.return, e);
					}
				}
				r & 64 && Vc(n), r & 512 && Uc(n, n.return);
				break;
			case 3:
				if (_l(e, n), r & 64 && (e = n.updateQueue, e !== null)) {
					if (t = null, n.child !== null) switch (n.child.tag) {
						case 27:
						case 5:
							t = n.child.stateNode;
							break;
						case 1: t = n.child.stateNode;
					}
					try {
						Qa(e, t);
					} catch (e) {
						Uu(n, n.return, e);
					}
				}
				break;
			case 27: t === null && r & 4 && Zc(n);
			case 26:
			case 5:
				_l(e, n), t === null && r & 4 && Gc(n), r & 512 && Uc(n, n.return);
				break;
			case 12:
				_l(e, n);
				break;
			case 31:
				_l(e, n), r & 4 && ll(e, n);
				break;
			case 13:
				_l(e, n), r & 4 && ul(e, n), r & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = qu.bind(null, n), sf(e, n))));
				break;
			case 22:
				if (r = n.memoizedState !== null || Qc, !r) {
					t = t !== null && t.memoizedState !== null || $c, i = Qc;
					var a = $c;
					Qc = r, ($c = t) && !a ? yl(e, n, (n.subtreeFlags & 8772) != 0) : _l(e, n), Qc = i, $c = a;
				}
				break;
			case 30: break;
			default: _l(e, n);
		}
	}
	function il(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, il(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && _t(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var al = null, ol = !1;
	function sl(e, t, n) {
		for (n = n.child; n !== null;) cl(e, t, n), n = n.sibling;
	}
	function cl(e, t, n) {
		if (ze && typeof ze.onCommitFiberUnmount == "function") try {
			ze.onCommitFiberUnmount(Re, n);
		} catch {}
		switch (n.tag) {
			case 26:
				$c || Wc(n, t), sl(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				$c || Wc(n, t);
				var r = al, i = ol;
				Zd(n.type) && (al = n.stateNode, ol = !1), sl(e, t, n), pf(n.stateNode), al = r, ol = i;
				break;
			case 5: $c || Wc(n, t);
			case 6:
				if (r = al, i = ol, al = null, sl(e, t, n), al = r, ol = i, al !== null) if (ol) try {
					(al.nodeType === 9 ? al.body : al.nodeName === "HTML" ? al.ownerDocument.body : al).removeChild(n.stateNode);
				} catch (e) {
					Uu(n, t, e);
				}
				else try {
					al.removeChild(n.stateNode);
				} catch (e) {
					Uu(n, t, e);
				}
				break;
			case 18:
				al !== null && (ol ? (e = al, Qd(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Np(e)) : Qd(al, n.stateNode));
				break;
			case 4:
				r = al, i = ol, al = n.stateNode.containerInfo, ol = !0, sl(e, t, n), al = r, ol = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				Bc(2, n, t), $c || Bc(4, n, t), sl(e, t, n);
				break;
			case 1:
				$c || (Wc(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && Hc(n, t, r)), sl(e, t, n);
				break;
			case 21:
				sl(e, t, n);
				break;
			case 22:
				$c = (r = $c) || n.memoizedState !== null, sl(e, t, n), $c = r;
				break;
			default: sl(e, t, n);
		}
	}
	function ll(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
			e = e.dehydrated;
			try {
				Np(e);
			} catch (e) {
				Uu(t, t.return, e);
			}
		}
	}
	function ul(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
			Np(e);
		} catch (e) {
			Uu(t, t.return, e);
		}
	}
	function dl(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new tl()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new tl()), t;
			default: throw Error(i(435, e.tag));
		}
	}
	function fl(e, t) {
		var n = dl(e);
		t.forEach(function(t) {
			if (!n.has(t)) {
				n.add(t);
				var r = Ju.bind(null, e, t);
				t.then(r, r);
			}
		});
	}
	function pl(e, t) {
		var n = t.deletions;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var a = n[r], o = e, s = t, c = s;
			a: for (; c !== null;) {
				switch (c.tag) {
					case 27:
						if (Zd(c.type)) {
							al = c.stateNode, ol = !1;
							break a;
						}
						break;
					case 5:
						al = c.stateNode, ol = !1;
						break a;
					case 3:
					case 4:
						al = c.stateNode.containerInfo, ol = !0;
						break a;
				}
				c = c.return;
			}
			if (al === null) throw Error(i(160));
			cl(o, s, a), al = null, ol = !1, o = a.alternate, o !== null && (o.return = null), a.return = null;
		}
		if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) hl(t, e), t = t.sibling;
	}
	var ml = null;
	function hl(e, t) {
		var n = e.alternate, r = e.flags;
		switch (e.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				pl(t, e), J(e), r & 4 && (Bc(3, e, e.return), zc(3, e), Bc(5, e, e.return));
				break;
			case 1:
				pl(t, e), J(e), r & 512 && ($c || n === null || Wc(n, n.return)), r & 64 && Qc && (e = e.updateQueue, e !== null && (r = e.callbacks, r !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? r : n.concat(r))));
				break;
			case 26:
				var a = ml;
				if (pl(t, e), J(e), r & 512 && ($c || n === null || Wc(n, n.return)), r & 4) {
					var o = n === null ? null : n.memoizedState;
					if (r = e.memoizedState, n === null) if (r === null) if (e.stateNode === null) {
						a: {
							r = e.type, n = e.memoizedProps, a = a.ownerDocument || a;
							b: switch (r) {
								case "title":
									o = a.getElementsByTagName("title")[0], (!o || o[gt] || o[lt] || o.namespaceURI === "http://www.w3.org/2000/svg" || o.hasAttribute("itemprop")) && (o = a.createElement(r), a.head.insertBefore(o, a.querySelector("head > title"))), Pd(o, r, n), o[lt] = e, St(o), r = o;
									break a;
								case "link":
									var s = Vf("link", "href", a).get(r + (n.href || ""));
									if (s) {
										for (var c = 0; c < s.length; c++) if (o = s[c], o.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && o.getAttribute("rel") === (n.rel == null ? null : n.rel) && o.getAttribute("title") === (n.title == null ? null : n.title) && o.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
											s.splice(c, 1);
											break b;
										}
									}
									o = a.createElement(r), Pd(o, r, n), a.head.appendChild(o);
									break;
								case "meta":
									if (s = Vf("meta", "content", a).get(r + (n.content || ""))) {
										for (c = 0; c < s.length; c++) if (o = s[c], o.getAttribute("content") === (n.content == null ? null : "" + n.content) && o.getAttribute("name") === (n.name == null ? null : n.name) && o.getAttribute("property") === (n.property == null ? null : n.property) && o.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && o.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
											s.splice(c, 1);
											break b;
										}
									}
									o = a.createElement(r), Pd(o, r, n), a.head.appendChild(o);
									break;
								default: throw Error(i(468, r));
							}
							o[lt] = e, St(o), r = o;
						}
						e.stateNode = r;
					} else Hf(a, e.type, e.stateNode);
					else e.stateNode = If(a, r, e.memoizedProps);
					else o === r ? r === null && e.stateNode !== null && Kc(e, e.memoizedProps, n.memoizedProps) : (o === null ? n.stateNode !== null && (n = n.stateNode, n.parentNode.removeChild(n)) : o.count--, r === null ? Hf(a, e.type, e.stateNode) : If(a, r, e.memoizedProps));
				}
				break;
			case 27:
				pl(t, e), J(e), r & 512 && ($c || n === null || Wc(n, n.return)), n !== null && r & 4 && Kc(e, e.memoizedProps, n.memoizedProps);
				break;
			case 5:
				if (pl(t, e), J(e), r & 512 && ($c || n === null || Wc(n, n.return)), e.flags & 32) {
					a = e.stateNode;
					try {
						Kt(a, "");
					} catch (t) {
						Uu(e, e.return, t);
					}
				}
				r & 4 && e.stateNode != null && (a = e.memoizedProps, Kc(e, a, n === null ? a : n.memoizedProps)), r & 1024 && (el = !0);
				break;
			case 6:
				if (pl(t, e), J(e), r & 4) {
					if (e.stateNode === null) throw Error(i(162));
					r = e.memoizedProps, n = e.stateNode;
					try {
						n.nodeValue = r;
					} catch (t) {
						Uu(e, e.return, t);
					}
				}
				break;
			case 3:
				if (Bf = null, a = ml, ml = gf(t.containerInfo), pl(t, e), ml = a, J(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
					Np(t.containerInfo);
				} catch (t) {
					Uu(e, e.return, t);
				}
				el && (el = !1, gl(e));
				break;
			case 4:
				r = ml, ml = gf(e.stateNode.containerInfo), pl(t, e), J(e), ml = r;
				break;
			case 12:
				pl(t, e), J(e);
				break;
			case 31:
				pl(t, e), J(e), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, fl(e, r)));
				break;
			case 13:
				pl(t, e), J(e), e.child.flags & 8192 && e.memoizedState !== null != (n !== null && n.memoizedState !== null) && (Zl = ke()), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, fl(e, r)));
				break;
			case 22:
				a = e.memoizedState !== null;
				var l = n !== null && n.memoizedState !== null, u = Qc, d = $c;
				if (Qc = u || a, $c = d || l, pl(t, e), $c = d, Qc = u, J(e), r & 8192) a: for (t = e.stateNode, t._visibility = a ? t._visibility & -2 : t._visibility | 1, a && (n === null || l || Qc || $c || vl(e)), n = null, t = e;;) {
					if (t.tag === 5 || t.tag === 26) {
						if (n === null) {
							l = n = t;
							try {
								if (o = l.stateNode, a) s = o.style, typeof s.setProperty == "function" ? s.setProperty("display", "none", "important") : s.display = "none";
								else {
									c = l.stateNode;
									var f = l.memoizedProps.style, p = f != null && f.hasOwnProperty("display") ? f.display : null;
									c.style.display = p == null || typeof p == "boolean" ? "" : ("" + p).trim();
								}
							} catch (e) {
								Uu(l, l.return, e);
							}
						}
					} else if (t.tag === 6) {
						if (n === null) {
							l = t;
							try {
								l.stateNode.nodeValue = a ? "" : l.memoizedProps;
							} catch (e) {
								Uu(l, l.return, e);
							}
						}
					} else if (t.tag === 18) {
						if (n === null) {
							l = t;
							try {
								var m = l.stateNode;
								a ? $d(m, !0) : $d(l.stateNode, !1);
							} catch (e) {
								Uu(l, l.return, e);
							}
						}
					} else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === e) && t.child !== null) {
						t.child.return = t, t = t.child;
						continue;
					}
					if (t === e) break a;
					for (; t.sibling === null;) {
						if (t.return === null || t.return === e) break a;
						n === t && (n = null), t = t.return;
					}
					n === t && (n = null), t.sibling.return = t.return, t = t.sibling;
				}
				r & 4 && (r = e.updateQueue, r !== null && (n = r.retryQueue, n !== null && (r.retryQueue = null, fl(e, n))));
				break;
			case 19:
				pl(t, e), J(e), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, fl(e, r)));
				break;
			case 30: break;
			case 21: break;
			default: pl(t, e), J(e);
		}
	}
	function J(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var n, r = e.return; r !== null;) {
					if (qc(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				if (n == null) throw Error(i(160));
				switch (n.tag) {
					case 27:
						var a = n.stateNode;
						Xc(e, Jc(e), a);
						break;
					case 5:
						var o = n.stateNode;
						n.flags & 32 && (Kt(o, ""), n.flags &= -33), Xc(e, Jc(e), o);
						break;
					case 3:
					case 4:
						var s = n.stateNode.containerInfo;
						Yc(e, Jc(e), s);
						break;
					default: throw Error(i(161));
				}
			} catch (t) {
				Uu(e, e.return, t);
			}
			e.flags &= -3;
		}
		t & 4096 && (e.flags &= -4097);
	}
	function gl(e) {
		if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
			var t = e;
			gl(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
		}
	}
	function _l(e, t) {
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) q(e, t.alternate, t), t = t.sibling;
	}
	function vl(e) {
		for (e = e.child; e !== null;) {
			var t = e;
			switch (t.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					Bc(4, t, t.return), vl(t);
					break;
				case 1:
					Wc(t, t.return);
					var n = t.stateNode;
					typeof n.componentWillUnmount == "function" && Hc(t, t.return, n), vl(t);
					break;
				case 27: pf(t.stateNode);
				case 26:
				case 5:
					Wc(t, t.return), vl(t);
					break;
				case 22:
					t.memoizedState === null && vl(t);
					break;
				case 30:
					vl(t);
					break;
				default: vl(t);
			}
			e = e.sibling;
		}
	}
	function yl(e, t, n) {
		for (n &&= (t.subtreeFlags & 8772) != 0, t = t.child; t !== null;) {
			var r = t.alternate, i = e, a = t, o = a.flags;
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					yl(i, a, n), zc(4, a);
					break;
				case 1:
					if (yl(i, a, n), r = a, i = r.stateNode, typeof i.componentDidMount == "function") try {
						i.componentDidMount();
					} catch (e) {
						Uu(r, r.return, e);
					}
					if (r = a, i = r.updateQueue, i !== null) {
						var s = r.stateNode;
						try {
							var c = i.shared.hiddenCallbacks;
							if (c !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < c.length; i++) Za(c[i], s);
						} catch (e) {
							Uu(r, r.return, e);
						}
					}
					n && o & 64 && Vc(a), Uc(a, a.return);
					break;
				case 27: Zc(a);
				case 26:
				case 5:
					yl(i, a, n), n && r === null && o & 4 && Gc(a), Uc(a, a.return);
					break;
				case 12:
					yl(i, a, n);
					break;
				case 31:
					yl(i, a, n), n && o & 4 && ll(i, a);
					break;
				case 13:
					yl(i, a, n), n && o & 4 && ul(i, a);
					break;
				case 22:
					a.memoizedState === null && yl(i, a, n), Uc(a, a.return);
					break;
				case 30: break;
				default: yl(i, a, n);
			}
			t = t.sibling;
		}
	}
	function bl(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && ua(n));
	}
	function xl(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && ua(e));
	}
	function Sl(e, t, n, r) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) Cl(e, t, n, r), t = t.sibling;
	}
	function Cl(e, t, n, r) {
		var i = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				Sl(e, t, n, r), i & 2048 && zc(9, t);
				break;
			case 1:
				Sl(e, t, n, r);
				break;
			case 3:
				Sl(e, t, n, r), i & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && ua(e)));
				break;
			case 12:
				if (i & 2048) {
					Sl(e, t, n, r), e = t.stateNode;
					try {
						var a = t.memoizedProps, o = a.id, s = a.onPostCommit;
						typeof s == "function" && s(o, t.alternate === null ? "mount" : "update", e.passiveEffectDuration, -0);
					} catch (e) {
						Uu(t, t.return, e);
					}
				} else Sl(e, t, n, r);
				break;
			case 31:
				Sl(e, t, n, r);
				break;
			case 13:
				Sl(e, t, n, r);
				break;
			case 23: break;
			case 22:
				a = t.stateNode, o = t.alternate, t.memoizedState === null ? a._visibility & 2 ? Sl(e, t, n, r) : (a._visibility |= 2, wl(e, t, n, r, (t.subtreeFlags & 10256) != 0 || !1)) : a._visibility & 2 ? Sl(e, t, n, r) : Tl(e, t), i & 2048 && bl(o, t);
				break;
			case 24:
				Sl(e, t, n, r), i & 2048 && xl(t.alternate, t);
				break;
			default: Sl(e, t, n, r);
		}
	}
	function wl(e, t, n, r, i) {
		for (i &&= (t.subtreeFlags & 10256) != 0 || !1, t = t.child; t !== null;) {
			var a = e, o = t, s = n, c = r, l = o.flags;
			switch (o.tag) {
				case 0:
				case 11:
				case 15:
					wl(a, o, s, c, i), zc(8, o);
					break;
				case 23: break;
				case 22:
					var u = o.stateNode;
					o.memoizedState === null ? (u._visibility |= 2, wl(a, o, s, c, i)) : u._visibility & 2 ? wl(a, o, s, c, i) : Tl(a, o), i && l & 2048 && bl(o.alternate, o);
					break;
				case 24:
					wl(a, o, s, c, i), i && l & 2048 && xl(o.alternate, o);
					break;
				default: wl(a, o, s, c, i);
			}
			t = t.sibling;
		}
	}
	function Tl(e, t) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
			var n = e, r = t, i = r.flags;
			switch (r.tag) {
				case 22:
					Tl(n, r), i & 2048 && bl(r.alternate, r);
					break;
				case 24:
					Tl(n, r), i & 2048 && xl(r.alternate, r);
					break;
				default: Tl(n, r);
			}
			t = t.sibling;
		}
	}
	var El = 8192;
	function Dl(e, t, n) {
		if (e.subtreeFlags & El) for (e = e.child; e !== null;) Ol(e, t, n), e = e.sibling;
	}
	function Ol(e, t, n) {
		switch (e.tag) {
			case 26:
				Dl(e, t, n), e.flags & El && e.memoizedState !== null && Gf(n, ml, e.memoizedState, e.memoizedProps);
				break;
			case 5:
				Dl(e, t, n);
				break;
			case 3:
			case 4:
				var r = ml;
				ml = gf(e.stateNode.containerInfo), Dl(e, t, n), ml = r;
				break;
			case 22:
				e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = El, El = 16777216, Dl(e, t, n), El = r) : Dl(e, t, n));
				break;
			default: Dl(e, t, n);
		}
	}
	function kl(e) {
		var t = e.alternate;
		if (t !== null && (e = t.child, e !== null)) {
			t.child = null;
			do
				t = e.sibling, e.sibling = null, e = t;
			while (e !== null);
		}
	}
	function Al(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				nl = r, Nl(r, e);
			}
			kl(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) jl(e), e = e.sibling;
	}
	function jl(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				Al(e), e.flags & 2048 && Bc(9, e, e.return);
				break;
			case 3:
				Al(e);
				break;
			case 12:
				Al(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Ml(e)) : Al(e);
				break;
			default: Al(e);
		}
	}
	function Ml(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				nl = r, Nl(r, e);
			}
			kl(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					Bc(8, t, t.return), Ml(t);
					break;
				case 22:
					n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, Ml(t));
					break;
				default: Ml(t);
			}
			e = e.sibling;
		}
	}
	function Nl(e, t) {
		for (; nl !== null;) {
			var n = nl;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					Bc(8, n, t);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var r = n.memoizedState.cachePool.pool;
						r != null && r.refCount++;
					}
					break;
				case 24: ua(n.memoizedState.cache);
			}
			if (r = n.child, r !== null) r.return = n, nl = r;
			else a: for (n = e; nl !== null;) {
				r = nl;
				var i = r.sibling, a = r.return;
				if (il(r), r === n) {
					nl = null;
					break a;
				}
				if (i !== null) {
					i.return = a, nl = i;
					break a;
				}
				nl = a;
			}
		}
	}
	var Pl = {
		getCacheForType: function(e) {
			var t = na(ca), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return na(ca).controller.signal;
		}
	}, Fl = typeof WeakMap == "function" ? WeakMap : Map, Y = 0, Il = null, X = null, Z = 0, Q = 0, Ll = null, Rl = !1, zl = !1, Bl = !1, Vl = 0, Hl = 0, Ul = 0, Wl = 0, Gl = 0, Kl = 0, ql = 0, Jl = null, Yl = null, Xl = !1, Zl = 0, Ql = 0, $l = Infinity, eu = null, tu = null, nu = 0, ru = null, iu = null, au = 0, ou = 0, su = null, cu = null, lu = 0, uu = null;
	function du() {
		return Y & 2 && Z !== 0 ? Z & -Z : j.T === null ? ot() : ud();
	}
	function fu() {
		if (Kl === 0) if (!(Z & 536870912) || R) {
			var e = Ge;
			Ge <<= 1, !(Ge & 3932160) && (Ge = 262144), Kl = e;
		} else Kl = 536870912;
		return e = io.current, e !== null && (e.flags |= 32), Kl;
	}
	function pu(e, t, n) {
		(e === Il && (Q === 2 || Q === 9) || e.cancelPendingCommit !== null) && (bu(e, 0), _u(e, Z, Kl, !1)), $e(e, n), (!(Y & 2) || e !== Il) && (e === Il && (!(Y & 2) && (Wl |= n), Hl === 4 && _u(e, Z, Kl, !1)), nd(e));
	}
	function mu(e, t, n) {
		if (Y & 6) throw Error(i(327));
		var r = !n && (t & 127) == 0 && (t & e.expiredLanes) === 0 || Ye(e, t), a = r ? Ou(e, t) : Eu(e, t, !0), o = r;
		do {
			if (a === 0) {
				zl && !r && _u(e, t, 0, !1);
				break;
			} else {
				if (n = e.current.alternate, o && !gu(n)) {
					a = Eu(e, t, !1), o = !1;
					continue;
				}
				if (a === 2) {
					if (o = t, e.errorRecoveryDisabledLanes & o) var s = 0;
					else s = e.pendingLanes & -536870913, s = s === 0 ? s & 536870912 ? 536870912 : 0 : s;
					if (s !== 0) {
						t = s;
						a: {
							var c = e;
							a = Jl;
							var l = c.current.memoizedState.isDehydrated;
							if (l && (bu(c, s).flags |= 256), s = Eu(c, s, !1), s !== 2) {
								if (Bl && !l) {
									c.errorRecoveryDisabledLanes |= o, Wl |= o, a = 4;
									break a;
								}
								o = Yl, Yl = a, o !== null && (Yl === null ? Yl = o : Yl.push.apply(Yl, o));
							}
							a = s;
						}
						if (o = !1, a !== 2) continue;
					}
				}
				if (a === 1) {
					bu(e, 0), _u(e, t, 0, !0);
					break;
				}
				a: {
					switch (r = e, o = a, o) {
						case 0:
						case 1: throw Error(i(345));
						case 4: if ((t & 4194048) !== t) break;
						case 6:
							_u(r, t, Kl, !Rl);
							break a;
						case 2:
							Yl = null;
							break;
						case 3:
						case 5: break;
						default: throw Error(i(329));
					}
					if ((t & 62914560) === t && (a = Zl + 300 - ke(), 10 < a)) {
						if (_u(r, t, Kl, !Rl), Je(r, 0, !0) !== 0) break a;
						au = t, r.timeoutHandle = Kd(hu.bind(null, r, n, Yl, eu, Xl, t, Kl, Wl, ql, Rl, o, "Throttled", -0, 0), a);
						break a;
					}
					hu(r, n, Yl, eu, Xl, t, Kl, Wl, ql, Rl, o, null, -0, 0);
				}
			}
			break;
		} while (1);
		nd(e);
	}
	function hu(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
		if (e.timeoutHandle = -1, d = t.subtreeFlags, d & 8192 || (d & 16785408) == 16785408) {
			d = {
				stylesheets: null,
				count: 0,
				imgCount: 0,
				imgBytes: 0,
				suspenseyImages: [],
				waitingForImages: !0,
				waitingForViewTransition: !1,
				unsuspend: en
			}, Ol(t, a, d);
			var m = (a & 62914560) === a ? Zl - ke() : (a & 4194048) === a ? Ql - ke() : 0;
			if (m = qf(d, m), m !== null) {
				au = a, e.cancelPendingCommit = m(Fu.bind(null, e, t, a, n, r, i, o, s, c, u, d, null, f, p)), _u(e, a, o, !l);
				return;
			}
		}
		Fu(e, t, a, n, r, i, o, s, c);
	}
	function gu(e) {
		for (var t = e;;) {
			var n = t.tag;
			if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
				var i = n[r], a = i.getSnapshot;
				i = i.value;
				try {
					if (!Cr(a(), i)) return !1;
				} catch {
					return !1;
				}
			}
			if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
			else {
				if (t === e) break;
				for (; t.sibling === null;) {
					if (t.return === null || t.return === e) return !0;
					t = t.return;
				}
				t.sibling.return = t.return, t = t.sibling;
			}
		}
		return !0;
	}
	function _u(e, t, n, r) {
		t &= ~Gl, t &= ~Wl, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
		for (var i = t; 0 < i;) {
			var a = 31 - F(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && tt(e, n, t);
	}
	function vu() {
		return Y & 6 ? !0 : (rd(0, !1), !1);
	}
	function yu() {
		if (X !== null) {
			if (Q === 0) var e = X.return;
			else e = X, Ji = qi = null, jo(e), Na = null, Pa = 0, e = X;
			for (; e !== null;) K(e.alternate, e), e = e.return;
			X = null;
		}
	}
	function bu(e, t) {
		var n = e.timeoutHandle;
		n !== -1 && (e.timeoutHandle = -1, qd(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), au = 0, yu(), Il = e, X = n = di(e.current, null), Z = t, Q = 0, Ll = null, Rl = !1, zl = Ye(e, t), Bl = !1, ql = Kl = Gl = Wl = Ul = Hl = 0, Yl = Jl = null, Xl = !1, t & 8 && (t |= t & 32);
		var r = e.entangledLanes;
		if (r !== 0) for (e = e.entanglements, r &= t; 0 < r;) {
			var i = 31 - F(r), a = 1 << i;
			t |= e[i], r &= ~a;
		}
		return Vl = t, ti(), n;
	}
	function xu(e, t) {
		z = null, j.H = U, t === Ca || t === Ta ? (t = ja(), Q = 3) : t === wa ? (t = ja(), Q = 4) : Q = t === nc ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, Ll = t, X === null && (Hl = 1, Xs(e, yi(t, e.current)));
	}
	function Su() {
		var e = io.current;
		return e === null ? !0 : (Z & 4194048) === Z ? ao === null : (Z & 62914560) === Z || Z & 536870912 ? e === ao : !1;
	}
	function Cu() {
		var e = j.H;
		return j.H = U, e === null ? U : e;
	}
	function wu() {
		var e = j.A;
		return j.A = Pl, e;
	}
	function Tu() {
		Hl = 4, Rl || (Z & 4194048) !== Z && io.current !== null || (zl = !0), !(Ul & 134217727) && !(Wl & 134217727) || Il === null || _u(Il, Z, Kl, !1);
	}
	function Eu(e, t, n) {
		var r = Y;
		Y |= 2;
		var i = Cu(), a = wu();
		(Il !== e || Z !== t) && (eu = null, bu(e, t)), t = !1;
		var o = Hl;
		a: do
			try {
				if (Q !== 0 && X !== null) {
					var s = X, c = Ll;
					switch (Q) {
						case 8:
							yu(), o = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							io.current === null && (t = !0);
							var l = Q;
							if (Q = 0, Ll = null, Mu(e, s, c, l), n && zl) {
								o = 0;
								break a;
							}
							break;
						default: l = Q, Q = 0, Ll = null, Mu(e, s, c, l);
					}
				}
				Du(), o = Hl;
				break;
			} catch (t) {
				xu(e, t);
			}
		while (1);
		return t && e.shellSuspendCounter++, Ji = qi = null, Y = r, j.H = i, j.A = a, X === null && (Il = null, Z = 0, ti()), o;
	}
	function Du() {
		for (; X !== null;) Au(X);
	}
	function Ou(e, t) {
		var n = Y;
		Y |= 2;
		var r = Cu(), a = wu();
		Il !== e || Z !== t ? (eu = null, $l = ke() + 500, bu(e, t)) : zl = Ye(e, t);
		a: do
			try {
				if (Q !== 0 && X !== null) {
					t = X;
					var o = Ll;
					b: switch (Q) {
						case 1:
							Q = 0, Ll = null, Mu(e, t, o, 1);
							break;
						case 2:
						case 9:
							if (Da(o)) {
								Q = 0, Ll = null, ju(t);
								break;
							}
							t = function() {
								Q !== 2 && Q !== 9 || Il !== e || (Q = 7), nd(e);
							}, o.then(t, t);
							break a;
						case 3:
							Q = 7;
							break a;
						case 4:
							Q = 5;
							break a;
						case 7:
							Da(o) ? (Q = 0, Ll = null, ju(t)) : (Q = 0, Ll = null, Mu(e, t, o, 7));
							break;
						case 5:
							var s = null;
							switch (X.tag) {
								case 26: s = X.memoizedState;
								case 5:
								case 27:
									var c = X;
									if (s ? Wf(s) : c.stateNode.complete) {
										Q = 0, Ll = null;
										var l = c.sibling;
										if (l !== null) X = l;
										else {
											var u = c.return;
											u === null ? X = null : (X = u, Nu(u));
										}
										break b;
									}
							}
							Q = 0, Ll = null, Mu(e, t, o, 5);
							break;
						case 6:
							Q = 0, Ll = null, Mu(e, t, o, 6);
							break;
						case 8:
							yu(), Hl = 6;
							break a;
						default: throw Error(i(462));
					}
				}
				ku();
				break;
			} catch (t) {
				xu(e, t);
			}
		while (1);
		return Ji = qi = null, j.H = r, j.A = a, Y = n, X === null ? (Il = null, Z = 0, ti(), Hl) : 0;
	}
	function ku() {
		for (; X !== null && !De();) Au(X);
	}
	function Au(e) {
		var t = Ac(e.alternate, e, Vl);
		e.memoizedProps = e.pendingProps, t === null ? Nu(e) : X = t;
	}
	function ju(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = hc(n, t, t.pendingProps, t.type, void 0, Z);
				break;
			case 11:
				t = hc(n, t, t.pendingProps, t.type.render, t.ref, Z);
				break;
			case 5: jo(t);
			default: K(n, t), t = X = fi(t, Vl), t = Ac(n, t, Vl);
		}
		e.memoizedProps = e.pendingProps, t === null ? Nu(e) : X = t;
	}
	function Mu(e, t, n, r) {
		Ji = qi = null, jo(t), Na = null, Pa = 0;
		var i = t.return;
		try {
			if (tc(e, i, t, n, Z)) {
				Hl = 1, Xs(e, yi(n, e.current)), X = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw X = i, t;
			Hl = 1, Xs(e, yi(n, e.current)), X = null;
			return;
		}
		t.flags & 32768 ? (R || r === 1 ? e = !0 : zl || Z & 536870912 ? e = !1 : (Rl = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = io.current, r !== null && r.tag === 13 && (r.flags |= 16384))), Pu(t, e)) : Nu(t);
	}
	function Nu(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				Pu(t, Rl);
				return;
			}
			e = t.return;
			var n = Lc(t.alternate, t, Vl);
			if (n !== null) {
				X = n;
				return;
			}
			if (t = t.sibling, t !== null) {
				X = t;
				return;
			}
			X = t = e;
		} while (t !== null);
		Hl === 0 && (Hl = 5);
	}
	function Pu(e, t) {
		do {
			var n = Rc(e.alternate, e);
			if (n !== null) {
				n.flags &= 32767, X = n;
				return;
			}
			if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
				X = e;
				return;
			}
			X = e = n;
		} while (e !== null);
		Hl = 6, X = null;
	}
	function Fu(e, t, n, r, a, o, s, c, l) {
		e.cancelPendingCommit = null;
		do
			Bu();
		while (nu !== 0);
		if (Y & 6) throw Error(i(327));
		if (t !== null) {
			if (t === e.current) throw Error(i(177));
			if (o = t.lanes | t.childLanes, o |= ei, et(e, n, o, s, c, l), e === Il && (X = Il = null, Z = 0), iu = t, ru = e, au = n, ou = o, su = a, cu = r, t.subtreeFlags & 10256 || t.flags & 10256 ? (e.callbackNode = null, e.callbackPriority = 0, Yu(Ne, function() {
				return Vu(), null;
			})) : (e.callbackNode = null, e.callbackPriority = 0), r = (t.flags & 13878) != 0, t.subtreeFlags & 13878 || r) {
				r = j.T, j.T = null, a = M.p, M.p = 2, s = Y, Y |= 4;
				try {
					rl(e, t, n);
				} finally {
					Y = s, M.p = a, j.T = r;
				}
			}
			nu = 1, Iu(), Lu(), Ru();
		}
	}
	function Iu() {
		if (nu === 1) {
			nu = 0;
			var e = ru, t = iu, n = (t.flags & 13878) != 0;
			if (t.subtreeFlags & 13878 || n) {
				n = j.T, j.T = null;
				var r = M.p;
				M.p = 2;
				var i = Y;
				Y |= 4;
				try {
					hl(t, e);
					var a = zd, o = Or(e.containerInfo), s = a.focusedElem, c = a.selectionRange;
					if (o !== s && s && s.ownerDocument && Dr(s.ownerDocument.documentElement, s)) {
						if (c !== null && kr(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = Er(s, h), v = Er(s, g);
									if (_ && v && (p.rangeCount !== 1 || p.anchorNode !== _.node || p.anchorOffset !== _.offset || p.focusNode !== v.node || p.focusOffset !== v.offset)) {
										var y = d.createRange();
										y.setStart(_.node, _.offset), p.removeAllRanges(), h > g ? (p.addRange(y), p.extend(v.node, v.offset)) : (y.setEnd(v.node, v.offset), p.addRange(y));
									}
								}
							}
						}
						for (d = [], p = s; p = p.parentNode;) p.nodeType === 1 && d.push({
							element: p,
							left: p.scrollLeft,
							top: p.scrollTop
						});
						for (typeof s.focus == "function" && s.focus(), s = 0; s < d.length; s++) {
							var b = d[s];
							b.element.scrollLeft = b.left, b.element.scrollTop = b.top;
						}
					}
					sp = !!Rd, zd = Rd = null;
				} finally {
					Y = i, M.p = r, j.T = n;
				}
			}
			e.current = t, nu = 2;
		}
	}
	function Lu() {
		if (nu === 2) {
			nu = 0;
			var e = ru, t = iu, n = (t.flags & 8772) != 0;
			if (t.subtreeFlags & 8772 || n) {
				n = j.T, j.T = null;
				var r = M.p;
				M.p = 2;
				var i = Y;
				Y |= 4;
				try {
					q(e, t.alternate, t);
				} finally {
					Y = i, M.p = r, j.T = n;
				}
			}
			nu = 3;
		}
	}
	function Ru() {
		if (nu === 4 || nu === 3) {
			nu = 0, Oe();
			var e = ru, t = iu, n = au, r = cu;
			t.subtreeFlags & 10256 || t.flags & 10256 ? nu = 5 : (nu = 0, iu = ru = null, zu(e, e.pendingLanes));
			var i = e.pendingLanes;
			if (i === 0 && (tu = null), at(n), t = t.stateNode, ze && typeof ze.onCommitFiberRoot == "function") try {
				ze.onCommitFiberRoot(Re, t, void 0, (t.current.flags & 128) == 128);
			} catch {}
			if (r !== null) {
				t = j.T, i = M.p, M.p = 2, j.T = null;
				try {
					for (var a = e.onRecoverableError, o = 0; o < r.length; o++) {
						var s = r[o];
						a(s.value, { componentStack: s.stack });
					}
				} finally {
					j.T = t, M.p = i;
				}
			}
			au & 3 && Bu(), nd(e), i = e.pendingLanes, n & 261930 && i & 42 ? e === uu ? lu++ : (lu = 0, uu = e) : lu = 0, rd(0, !1);
		}
	}
	function zu(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, ua(t)));
	}
	function Bu() {
		return Iu(), Lu(), Ru(), Vu();
	}
	function Vu() {
		if (nu !== 5) return !1;
		var e = ru, t = ou;
		ou = 0;
		var n = at(au), r = j.T, a = M.p;
		try {
			M.p = 32 > n ? 32 : n, j.T = null, n = su, su = null;
			var o = ru, s = au;
			if (nu = 0, iu = ru = null, au = 0, Y & 6) throw Error(i(331));
			var c = Y;
			if (Y |= 4, jl(o.current), Cl(o, o.current, s, n), Y = c, rd(0, !1), ze && typeof ze.onPostCommitFiberRoot == "function") try {
				ze.onPostCommitFiberRoot(Re, o);
			} catch {}
			return !0;
		} finally {
			M.p = a, j.T = r, zu(e, t);
		}
	}
	function Hu(e, t, n) {
		t = yi(n, t), t = Qs(e.stateNode, t, 2), e = Ga(e, t, 2), e !== null && ($e(e, 2), nd(e));
	}
	function Uu(e, t, n) {
		if (e.tag === 3) Hu(e, e, n);
		else for (; t !== null;) {
			if (t.tag === 3) {
				Hu(t, e, n);
				break;
			} else if (t.tag === 1) {
				var r = t.stateNode;
				if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (tu === null || !tu.has(r))) {
					e = yi(n, e), n = $s(2), r = Ga(t, n, 2), r !== null && (ec(n, r, t, e), $e(r, 2), nd(r));
					break;
				}
			}
			t = t.return;
		}
	}
	function Wu(e, t, n) {
		var r = e.pingCache;
		if (r === null) {
			r = e.pingCache = new Fl();
			var i = /* @__PURE__ */ new Set();
			r.set(t, i);
		} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
		i.has(n) || (Bl = !0, i.add(n), e = Gu.bind(null, e, t, n), t.then(e, e));
	}
	function Gu(e, t, n) {
		var r = e.pingCache;
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, Il === e && (Z & n) === n && (Hl === 4 || Hl === 3 && (Z & 62914560) === Z && 300 > ke() - Zl ? !(Y & 2) && bu(e, 0) : Gl |= n, ql === Z && (ql = 0)), nd(e);
	}
	function Ku(e, t) {
		t === 0 && (t = Ze()), e = ii(e, t), e !== null && ($e(e, t), nd(e));
	}
	function qu(e) {
		var t = e.memoizedState, n = 0;
		t !== null && (n = t.retryLane), Ku(e, n);
	}
	function Ju(e, t) {
		var n = 0;
		switch (e.tag) {
			case 31:
			case 13:
				var r = e.stateNode, a = e.memoizedState;
				a !== null && (n = a.retryLane);
				break;
			case 19:
				r = e.stateNode;
				break;
			case 22:
				r = e.stateNode._retryCache;
				break;
			default: throw Error(i(314));
		}
		r !== null && r.delete(t), Ku(e, n);
	}
	function Yu(e, t) {
		return Te(e, t);
	}
	var Xu = null, Zu = null, Qu = !1, $u = !1, ed = !1, td = 0;
	function nd(e) {
		e !== Zu && e.next === null && (Zu === null ? Xu = Zu = e : Zu = Zu.next = e), $u = !0, Qu || (Qu = !0, ld());
	}
	function rd(e, t) {
		if (!ed && $u) {
			ed = !0;
			do
				for (var n = !1, r = Xu; r !== null;) {
					if (!t) if (e !== 0) {
						var i = r.pendingLanes;
						if (i === 0) var a = 0;
						else {
							var o = r.suspendedLanes, s = r.pingedLanes;
							a = (1 << 31 - F(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
						}
						a !== 0 && (n = !0, cd(r, a));
					} else a = Z, a = Je(r, r === Il ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || Ye(r, a) || (n = !0, cd(r, a));
					r = r.next;
				}
			while (n);
			ed = !1;
		}
	}
	function id() {
		ad();
	}
	function ad() {
		$u = Qu = !1;
		var e = 0;
		td !== 0 && Gd() && (e = td);
		for (var t = ke(), n = null, r = Xu; r !== null;) {
			var i = r.next, a = od(r, t);
			a === 0 ? (r.next = null, n === null ? Xu = i : n.next = i, i === null && (Zu = n)) : (n = r, (e !== 0 || a & 3) && ($u = !0)), r = i;
		}
		nu !== 0 && nu !== 5 || rd(e, !1), td !== 0 && (td = 0);
	}
	function od(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - F(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = Xe(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = Il, n = Z, n = Je(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (Q === 2 || Q === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && Ee(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || Ye(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && Ee(r), at(n)) {
				case 2:
				case 8:
					n = Me;
					break;
				case 32:
					n = Ne;
					break;
				case 268435456:
					n = Fe;
					break;
				default: n = Ne;
			}
			return r = sd.bind(null, e), n = Te(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && Ee(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function sd(e, t) {
		if (nu !== 0 && nu !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (Bu() && e.callbackNode !== n) return null;
		var r = Z;
		return r = Je(e, e === Il ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (mu(e, r, t), od(e, ke()), e.callbackNode != null && e.callbackNode === n ? sd.bind(null, e) : null);
	}
	function cd(e, t) {
		if (Bu()) return null;
		mu(e, t, !0);
	}
	function ld() {
		Yd(function() {
			Y & 6 ? Te(je, id) : ad();
		});
	}
	function ud() {
		if (td === 0) {
			var e = pa;
			e === 0 && (e = We, We <<= 1, !(We & 261888) && (We = 256)), td = e;
		}
		return td;
	}
	function dd(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : $t("" + e);
	}
	function fd(e, t) {
		var n = t.ownerDocument.createElement("input");
		return n.name = t.name, n.value = t.value, e.id && n.setAttribute("form", e.id), t.parentNode.insertBefore(n, t), e = new FormData(e), n.parentNode.removeChild(n), e;
	}
	function pd(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = dd((i[ut] || null).action), o = r.submitter;
			o && (t = (t = o[ut] || null) ? dd(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new Sn("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (td !== 0) {
								var e = o ? fd(i, o) : new FormData(i);
								Ts(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = o ? fd(i, o) : new FormData(i), Ts(n, {
							pending: !0,
							data: e,
							method: i.method,
							action: a
						}, a, e));
					},
					currentTarget: i
				}]
			});
		}
	}
	for (var md = 0; md < Yr.length; md++) {
		var hd = Yr[md];
		Xr(hd.toLowerCase(), "on" + (hd[0].toUpperCase() + hd.slice(1)));
	}
	Xr(Vr, "onAnimationEnd"), Xr(Hr, "onAnimationIteration"), Xr(Ur, "onAnimationStart"), Xr("dblclick", "onDoubleClick"), Xr("focusin", "onFocus"), Xr("focusout", "onBlur"), Xr(Wr, "onTransitionRun"), Xr(Gr, "onTransitionStart"), Xr(Kr, "onTransitionCancel"), Xr(qr, "onTransitionEnd"), Et("onMouseEnter", ["mouseout", "mouseover"]), Et("onMouseLeave", ["mouseout", "mouseover"]), Et("onPointerEnter", ["pointerout", "pointerover"]), Et("onPointerLeave", ["pointerout", "pointerover"]), Tt("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), Tt("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), Tt("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), Tt("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), Tt("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), Tt("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
	var gd = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), _d = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(gd));
	function vd(e, t) {
		t = (t & 4) != 0;
		for (var n = 0; n < e.length; n++) {
			var r = e[n], i = r.event;
			r = r.listeners;
			a: {
				var a = void 0;
				if (t) for (var o = r.length - 1; 0 <= o; o--) {
					var s = r[o], c = s.instance, l = s.currentTarget;
					if (s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						Zr(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						Zr(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function $(e, t) {
		var n = t[ft];
		n === void 0 && (n = t[ft] = /* @__PURE__ */ new Set());
		var r = e + "__bubble";
		n.has(r) || (Sd(t, e, 2, !1), n.add(r));
	}
	function yd(e, t, n) {
		var r = 0;
		t && (r |= 4), Sd(n, e, r, t);
	}
	var bd = "_reactListening" + Math.random().toString(36).slice(2);
	function xd(e) {
		if (!e[bd]) {
			e[bd] = !0, Ct.forEach(function(t) {
				t !== "selectionchange" && (_d.has(t) || yd(t, !1, e), yd(t, !0, e));
			});
			var t = e.nodeType === 9 ? e : e.ownerDocument;
			t === null || t[bd] || (t[bd] = !0, yd("selectionchange", !1, t));
		}
	}
	function Sd(e, t, n, r) {
		switch (mp(t)) {
			case 2:
				var i = cp;
				break;
			case 8:
				i = lp;
				break;
			default: i = up;
		}
		n = i.bind(null, t, n, e), i = void 0, !dn || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
			capture: !0,
			passive: i
		}) : i === void 0 ? e.addEventListener(t, n, !1) : e.addEventListener(t, n, { passive: i });
	}
	function Cd(e, t, n, r, i) {
		var a = r;
		if (!(t & 1) && !(t & 2) && r !== null) a: for (;;) {
			if (r === null) return;
			var s = r.tag;
			if (s === 3 || s === 4) {
				var c = r.stateNode.containerInfo;
				if (c === i) break;
				if (s === 4) for (s = r.return; s !== null;) {
					var l = s.tag;
					if ((l === 3 || l === 4) && s.stateNode.containerInfo === i) return;
					s = s.return;
				}
				for (; c !== null;) {
					if (s = vt(c), s === null) return;
					if (l = s.tag, l === 5 || l === 6 || l === 26 || l === 27) {
						r = a = s;
						continue a;
					}
					c = c.parentNode;
				}
			}
			r = r.return;
		}
		cn(function() {
			var r = a, i = nn(n), s = [];
			a: {
				var c = Jr.get(e);
				if (c !== void 0) {
					var l = Sn, u = e;
					switch (e) {
						case "keypress": if (_n(n) === 0) break a;
						case "keydown":
						case "keyup":
							l = Bn;
							break;
						case "focusin":
							u = "focus", l = jn;
							break;
						case "focusout":
							u = "blur", l = jn;
							break;
						case "beforeblur":
						case "afterblur":
							l = jn;
							break;
						case "click": if (n.button === 2) break a;
						case "auxclick":
						case "dblclick":
						case "mousedown":
						case "mousemove":
						case "mouseup":
						case "mouseout":
						case "mouseover":
						case "contextmenu":
							l = kn;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							l = An;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = Hn;
							break;
						case Vr:
						case Hr:
						case Ur:
							l = Mn;
							break;
						case qr:
							l = Un;
							break;
						case "scroll":
						case "scrollend":
							l = wn;
							break;
						case "wheel":
							l = Wn;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = Nn;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							l = Vn;
							break;
						case "toggle":
						case "beforetoggle": l = Gn;
					}
					var d = (t & 4) != 0, f = !d && (e === "scroll" || e === "scrollend"), p = d ? c === null ? null : c + "Capture" : c;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = ln(m, p), g != null && d.push(wd(m, g, h))), f) break;
						m = m.return;
					}
					0 < d.length && (c = new l(c, u, null, n, i), s.push({
						event: c,
						listeners: d
					}));
				}
			}
			if (!(t & 7)) {
				a: {
					if (c = e === "mouseover" || e === "pointerover", l = e === "mouseout" || e === "pointerout", c && n !== tn && (u = n.relatedTarget || n.fromElement) && (vt(u) || u[dt])) break a;
					if ((l || c) && (c = i.window === i ? i : (c = i.ownerDocument) ? c.defaultView || c.parentWindow : window, l ? (u = n.relatedTarget || n.toElement, l = r, u = u ? vt(u) : null, u !== null && (f = o(u), d = u.tag, u !== f || d !== 5 && d !== 27 && d !== 6) && (u = null)) : (l = null, u = r), l !== u)) {
						if (d = kn, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = Vn, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = l == null ? c : bt(l), h = u == null ? c : bt(u), c = new d(g, m + "leave", l, n, i), c.target = f, c.relatedTarget = h, g = null, vt(i) === r && (d = new d(p, m + "enter", u, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, l && u) b: {
							for (d = Ed, p = l, m = u, h = 0, g = p; g; g = d(g)) h++;
							g = 0;
							for (var _ = m; _; _ = d(_)) g++;
							for (; 0 < h - g;) p = d(p), h--;
							for (; 0 < g - h;) m = d(m), g--;
							for (; h--;) {
								if (p === m || m !== null && p === m.alternate) {
									d = p;
									break b;
								}
								p = d(p), m = d(m);
							}
							d = null;
						}
						else d = null;
						l !== null && Dd(s, c, l, d, !1), u !== null && f !== null && Dd(s, f, u, d, !0);
					}
				}
				a: {
					if (c = r ? bt(r) : window, l = c.nodeName && c.nodeName.toLowerCase(), l === "select" || l === "input" && c.type === "file") var v = dr;
					else if (ar(c)) if (fr) v = xr;
					else {
						v = yr;
						var y = vr;
					}
					else l = c.nodeName, !l || l.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? r && Xt(r.elementType) && (v = dr) : v = br;
					if (v &&= v(e, r)) {
						or(s, v, n, i);
						break a;
					}
					y && y(e, c, r), e === "focusout" && r && c.type === "number" && r.memoizedProps.value != null && L(c, "number", c.value);
				}
				switch (y = r ? bt(r) : window, e) {
					case "focusin":
						(ar(y) || y.contentEditable === "true") && (jr = y, Mr = r, Nr = null);
						break;
					case "focusout":
						Nr = Mr = jr = null;
						break;
					case "mousedown":
						Pr = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						Pr = !1, Fr(s, n, i);
						break;
					case "selectionchange": if (Ar) break;
					case "keydown":
					case "keyup": Fr(s, n, i);
				}
				var b;
				if (qn) b: {
					switch (e) {
						case "compositionstart":
							var x = "onCompositionStart";
							break b;
						case "compositionend":
							x = "onCompositionEnd";
							break b;
						case "compositionupdate":
							x = "onCompositionUpdate";
							break b;
					}
					x = void 0;
				}
				else tr ? $n(e, n) && (x = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (x = "onCompositionStart");
				x && (Xn && n.locale !== "ko" && (tr || x !== "onCompositionStart" ? x === "onCompositionEnd" && tr && (b = gn()) : (pn = i, mn = "value" in pn ? pn.value : pn.textContent, tr = !0)), y = Td(r, x), 0 < y.length && (x = new Pn(x, e, null, n, i), s.push({
					event: x,
					listeners: y
				}), b ? x.data = b : (b = er(n), b !== null && (x.data = b)))), (b = Yn ? nr(e, n) : rr(e, n)) && (x = Td(r, "onBeforeInput"), 0 < x.length && (y = new Pn("onBeforeInput", "beforeinput", null, n, i), s.push({
					event: y,
					listeners: x
				}), y.data = b)), pd(s, e, r, n, i);
			}
			vd(s, t);
		});
	}
	function wd(e, t, n) {
		return {
			instance: e,
			listener: t,
			currentTarget: n
		};
	}
	function Td(e, t) {
		for (var n = t + "Capture", r = []; e !== null;) {
			var i = e, a = i.stateNode;
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = ln(e, n), i != null && r.unshift(wd(e, i, a)), i = ln(e, t), i != null && r.push(wd(e, i, a))), e.tag === 3) return r;
			e = e.return;
		}
		return [];
	}
	function Ed(e) {
		if (e === null) return null;
		do
			e = e.return;
		while (e && e.tag !== 5 && e.tag !== 27);
		return e || null;
	}
	function Dd(e, t, n, r, i) {
		for (var a = t._reactName, o = []; n !== null && n !== r;) {
			var s = n, c = s.alternate, l = s.stateNode;
			if (s = s.tag, c !== null && c === r) break;
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = ln(n, a), l != null && o.unshift(wd(n, l, c))) : i || (l = ln(n, a), l != null && o.push(wd(n, l, c)))), n = n.return;
		}
		o.length !== 0 && e.push({
			event: t,
			listeners: o
		});
	}
	var Od = /\r\n?/g, kd = /\u0000|\uFFFD/g;
	function Ad(e) {
		return (typeof e == "string" ? e : "" + e).replace(Od, "\n").replace(kd, "");
	}
	function jd(e, t) {
		return t = Ad(t), Ad(e) === t;
	}
	function Md(e, t, n, r, a, o) {
		switch (n) {
			case "children":
				typeof r == "string" ? t === "body" || t === "textarea" && r === "" || Kt(e, r) : (typeof r == "number" || typeof r == "bigint") && t !== "body" && Kt(e, "" + r);
				break;
			case "className":
				Mt(e, "class", r);
				break;
			case "tabIndex":
				Mt(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				Mt(e, n, r);
				break;
			case "style":
				Yt(e, r, o);
				break;
			case "data": if (t !== "object") {
				Mt(e, "data", r);
				break;
			}
			case "src":
			case "href":
				if (r === "" && (t !== "a" || n !== "href")) {
					e.removeAttribute(n);
					break;
				}
				if (r == null || typeof r == "function" || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = $t("" + r), e.setAttribute(n, r);
				break;
			case "action":
			case "formAction":
				if (typeof r == "function") {
					e.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
					break;
				} else typeof o == "function" && (n === "formAction" ? (t !== "input" && Md(e, t, "name", a.name, a, null), Md(e, t, "formEncType", a.formEncType, a, null), Md(e, t, "formMethod", a.formMethod, a, null), Md(e, t, "formTarget", a.formTarget, a, null)) : (Md(e, t, "encType", a.encType, a, null), Md(e, t, "method", a.method, a, null), Md(e, t, "target", a.target, a, null)));
				if (r == null || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = $t("" + r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = en);
				break;
			case "onScroll":
				r != null && $("scroll", e);
				break;
			case "onScrollEnd":
				r != null && $("scrollend", e);
				break;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						e.innerHTML = n;
					}
				}
				break;
			case "multiple":
				e.multiple = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "muted":
				e.muted = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "ref": break;
			case "autoFocus": break;
			case "xlinkHref":
				if (r == null || typeof r == "function" || typeof r == "boolean" || typeof r == "symbol") {
					e.removeAttribute("xlink:href");
					break;
				}
				n = $t("" + r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
				break;
			case "contentEditable":
			case "spellCheck":
			case "draggable":
			case "value":
			case "autoReverse":
			case "externalResourcesRequired":
			case "focusable":
			case "preserveAlpha":
				r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, "" + r) : e.removeAttribute(n);
				break;
			case "inert":
			case "allowFullScreen":
			case "async":
			case "autoPlay":
			case "controls":
			case "default":
			case "defer":
			case "disabled":
			case "disablePictureInPicture":
			case "disableRemotePlayback":
			case "formNoValidate":
			case "hidden":
			case "loop":
			case "noModule":
			case "noValidate":
			case "open":
			case "playsInline":
			case "readOnly":
			case "required":
			case "reversed":
			case "scoped":
			case "seamless":
			case "itemScope":
				r && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
				break;
			case "capture":
			case "download":
				!0 === r ? e.setAttribute(n, "") : !1 !== r && r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "cols":
			case "rows":
			case "size":
			case "span":
				r != null && typeof r != "function" && typeof r != "symbol" && !isNaN(r) && 1 <= r ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "rowSpan":
			case "start":
				r == null || typeof r == "function" || typeof r == "symbol" || isNaN(r) ? e.removeAttribute(n) : e.setAttribute(n, r);
				break;
			case "popover":
				$("beforetoggle", e), $("toggle", e), jt(e, "popover", r);
				break;
			case "xlinkActuate":
				Nt(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				Nt(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				Nt(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				Nt(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				Nt(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				Nt(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				Nt(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				Nt(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				Nt(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				jt(e, "is", r);
				break;
			case "innerText":
			case "textContent": break;
			default: (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (n = Zt.get(n) || n, jt(e, n, r));
		}
	}
	function Nd(e, t, n, r, a, o) {
		switch (n) {
			case "style":
				Yt(e, r, o);
				break;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						e.innerHTML = n;
					}
				}
				break;
			case "children":
				typeof r == "string" ? Kt(e, r) : (typeof r == "number" || typeof r == "bigint") && Kt(e, "" + r);
				break;
			case "onScroll":
				r != null && $("scroll", e);
				break;
			case "onScrollEnd":
				r != null && $("scrollend", e);
				break;
			case "onClick":
				r != null && (e.onclick = en);
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": break;
			case "innerText":
			case "textContent": break;
			default: if (!wt.hasOwnProperty(n)) a: {
				if (n[0] === "o" && n[1] === "n" && (a = n.endsWith("Capture"), t = n.slice(2, a ? n.length - 7 : void 0), o = e[ut] || null, o = o == null ? null : o[n], typeof o == "function" && e.removeEventListener(t, o, a), typeof r == "function")) {
					typeof o != "function" && o !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(t, r, a);
					break a;
				}
				n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : jt(e, n, r);
			}
		}
	}
	function Pd(e, t, n) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "img":
				$("error", e), $("load", e);
				var r = !1, a = !1, o;
				for (o in n) if (n.hasOwnProperty(o)) {
					var s = n[o];
					if (s != null) switch (o) {
						case "src":
							r = !0;
							break;
						case "srcSet":
							a = !0;
							break;
						case "children":
						case "dangerouslySetInnerHTML": throw Error(i(137, t));
						default: Md(e, t, o, s, n, null);
					}
				}
				a && Md(e, t, "srcSet", n.srcSet, n, null), r && Md(e, t, "src", n.src, n, null);
				return;
			case "input":
				$("invalid", e);
				var c = o = s = a = null, l = null, u = null;
				for (r in n) if (n.hasOwnProperty(r)) {
					var d = n[r];
					if (d != null) switch (r) {
						case "name":
							a = d;
							break;
						case "type":
							s = d;
							break;
						case "checked":
							l = d;
							break;
						case "defaultChecked":
							u = d;
							break;
						case "value":
							o = d;
							break;
						case "defaultValue":
							c = d;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (d != null) throw Error(i(137, t));
							break;
						default: Md(e, t, r, d, n, null);
					}
				}
				Ht(e, o, c, l, u, s, a, !1);
				return;
			case "select":
				for (a in $("invalid", e), r = s = o = null, n) if (n.hasOwnProperty(a) && (c = n[a], c != null)) switch (a) {
					case "value":
						o = c;
						break;
					case "defaultValue":
						s = c;
						break;
					case "multiple": r = c;
					default: Md(e, t, a, c, n, null);
				}
				t = o, n = s, e.multiple = !!r, t == null ? n != null && Ut(e, !!r, n, !0) : Ut(e, !!r, t, !1);
				return;
			case "textarea":
				for (s in $("invalid", e), o = a = r = null, n) if (n.hasOwnProperty(s) && (c = n[s], c != null)) switch (s) {
					case "value":
						r = c;
						break;
					case "defaultValue":
						a = c;
						break;
					case "children":
						o = c;
						break;
					case "dangerouslySetInnerHTML":
						if (c != null) throw Error(i(91));
						break;
					default: Md(e, t, s, c, n, null);
				}
				Gt(e, r, a, o);
				return;
			case "option":
				for (l in n) if (n.hasOwnProperty(l) && (r = n[l], r != null)) switch (l) {
					case "selected":
						e.selected = r && typeof r != "function" && typeof r != "symbol";
						break;
					default: Md(e, t, l, r, n, null);
				}
				return;
			case "dialog":
				$("beforetoggle", e), $("toggle", e), $("cancel", e), $("close", e);
				break;
			case "iframe":
			case "object":
				$("load", e);
				break;
			case "video":
			case "audio":
				for (r = 0; r < gd.length; r++) $(gd[r], e);
				break;
			case "image":
				$("error", e), $("load", e);
				break;
			case "details":
				$("toggle", e);
				break;
			case "embed":
			case "source":
			case "link": $("error", e), $("load", e);
			case "area":
			case "base":
			case "br":
			case "col":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "track":
			case "wbr":
			case "menuitem":
				for (u in n) if (n.hasOwnProperty(u) && (r = n[u], r != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML": throw Error(i(137, t));
					default: Md(e, t, u, r, n, null);
				}
				return;
			default: if (Xt(t)) {
				for (d in n) n.hasOwnProperty(d) && (r = n[d], r !== void 0 && Nd(e, t, d, r, n, void 0));
				return;
			}
		}
		for (c in n) n.hasOwnProperty(c) && (r = n[c], r != null && Md(e, t, c, r, n, null));
	}
	function Fd(e, t, n, r) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "input":
				var a = null, o = null, s = null, c = null, l = null, u = null, d = null;
				for (m in n) {
					var f = n[m];
					if (n.hasOwnProperty(m) && f != null) switch (m) {
						case "checked": break;
						case "value": break;
						case "defaultValue": l = f;
						default: r.hasOwnProperty(m) || Md(e, t, m, null, r, f);
					}
				}
				for (var p in r) {
					var m = r[p];
					if (f = n[p], r.hasOwnProperty(p) && (m != null || f != null)) switch (p) {
						case "type":
							o = m;
							break;
						case "name":
							a = m;
							break;
						case "checked":
							u = m;
							break;
						case "defaultChecked":
							d = m;
							break;
						case "value":
							s = m;
							break;
						case "defaultValue":
							c = m;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (m != null) throw Error(i(137, t));
							break;
						default: m !== f && Md(e, t, p, m, r, f);
					}
				}
				Vt(e, s, c, l, u, d, o, a);
				return;
			case "select":
				for (o in m = s = c = p = null, n) if (l = n[o], n.hasOwnProperty(o) && l != null) switch (o) {
					case "value": break;
					case "multiple": m = l;
					default: r.hasOwnProperty(o) || Md(e, t, o, null, r, l);
				}
				for (a in r) if (o = r[a], l = n[a], r.hasOwnProperty(a) && (o != null || l != null)) switch (a) {
					case "value":
						p = o;
						break;
					case "defaultValue":
						c = o;
						break;
					case "multiple": s = o;
					default: o !== l && Md(e, t, a, o, r, l);
				}
				t = c, n = s, r = m, p == null ? !!r != !!n && (t == null ? Ut(e, !!n, n ? [] : "", !1) : Ut(e, !!n, t, !0)) : Ut(e, !!n, p, !1);
				return;
			case "textarea":
				for (c in m = p = null, n) if (a = n[c], n.hasOwnProperty(c) && a != null && !r.hasOwnProperty(c)) switch (c) {
					case "value": break;
					case "children": break;
					default: Md(e, t, c, null, r, a);
				}
				for (s in r) if (a = r[s], o = n[s], r.hasOwnProperty(s) && (a != null || o != null)) switch (s) {
					case "value":
						p = a;
						break;
					case "defaultValue":
						m = a;
						break;
					case "children": break;
					case "dangerouslySetInnerHTML":
						if (a != null) throw Error(i(91));
						break;
					default: a !== o && Md(e, t, s, a, r, o);
				}
				Wt(e, p, m);
				return;
			case "option":
				for (var h in n) if (p = n[h], n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h)) switch (h) {
					case "selected":
						e.selected = !1;
						break;
					default: Md(e, t, h, null, r, p);
				}
				for (l in r) if (p = r[l], m = n[l], r.hasOwnProperty(l) && p !== m && (p != null || m != null)) switch (l) {
					case "selected":
						e.selected = p && typeof p != "function" && typeof p != "symbol";
						break;
					default: Md(e, t, l, p, r, m);
				}
				return;
			case "img":
			case "link":
			case "area":
			case "base":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "source":
			case "track":
			case "wbr":
			case "menuitem":
				for (var g in n) p = n[g], n.hasOwnProperty(g) && p != null && !r.hasOwnProperty(g) && Md(e, t, g, null, r, p);
				for (u in r) if (p = r[u], m = n[u], r.hasOwnProperty(u) && p !== m && (p != null || m != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML":
						if (p != null) throw Error(i(137, t));
						break;
					default: Md(e, t, u, p, r, m);
				}
				return;
			default: if (Xt(t)) {
				for (var _ in n) p = n[_], n.hasOwnProperty(_) && p !== void 0 && !r.hasOwnProperty(_) && Nd(e, t, _, void 0, r, p);
				for (d in r) p = r[d], m = n[d], !r.hasOwnProperty(d) || p === m || p === void 0 && m === void 0 || Nd(e, t, d, p, r, m);
				return;
			}
		}
		for (var v in n) p = n[v], n.hasOwnProperty(v) && p != null && !r.hasOwnProperty(v) && Md(e, t, v, null, r, p);
		for (f in r) p = r[f], m = n[f], !r.hasOwnProperty(f) || p === m || p == null && m == null || Md(e, t, f, p, r, m);
	}
	function Id(e) {
		switch (e) {
			case "css":
			case "script":
			case "font":
			case "img":
			case "image":
			case "input":
			case "link": return !0;
			default: return !1;
		}
	}
	function Ld() {
		if (typeof performance.getEntriesByType == "function") {
			for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), r = 0; r < n.length; r++) {
				var i = n[r], a = i.transferSize, o = i.initiatorType, s = i.duration;
				if (a && s && Id(o)) {
					for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
						var c = n[r], l = c.startTime;
						if (l > s) break;
						var u = c.transferSize, d = c.initiatorType;
						u && Id(d) && (c = c.responseEnd, o += u * (c < s ? 1 : (s - l) / (c - l)));
					}
					if (--r, t += 8 * (a + o) / (i.duration / 1e3), e++, 10 < e) break;
				}
			}
			if (0 < e) return t / e / 1e6;
		}
		return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
	}
	var Rd = null, zd = null;
	function Bd(e) {
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	function Vd(e) {
		switch (e) {
			case "http://www.w3.org/2000/svg": return 1;
			case "http://www.w3.org/1998/Math/MathML": return 2;
			default: return 0;
		}
	}
	function Hd(e, t) {
		if (e === 0) switch (t) {
			case "svg": return 1;
			case "math": return 2;
			default: return 0;
		}
		return e === 1 && t === "foreignObject" ? 0 : e;
	}
	function Ud(e, t) {
		return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
	}
	var Wd = null;
	function Gd() {
		var e = window.event;
		return e && e.type === "popstate" ? e === Wd ? !1 : (Wd = e, !0) : (Wd = null, !1);
	}
	var Kd = typeof setTimeout == "function" ? setTimeout : void 0, qd = typeof clearTimeout == "function" ? clearTimeout : void 0, Jd = typeof Promise == "function" ? Promise : void 0, Yd = typeof queueMicrotask == "function" ? queueMicrotask : Jd === void 0 ? Kd : function(e) {
		return Jd.resolve(null).then(e).catch(Xd);
	};
	function Xd(e) {
		setTimeout(function() {
			throw e;
		});
	}
	function Zd(e) {
		return e === "head";
	}
	function Qd(e, t) {
		var n = t, r = 0;
		do {
			var i = n.nextSibling;
			if (e.removeChild(n), i && i.nodeType === 8) if (n = i.data, n === "/$" || n === "/&") {
				if (r === 0) {
					e.removeChild(i), Np(t);
					return;
				}
				r--;
			} else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&") r++;
			else if (n === "html") pf(e.ownerDocument.documentElement);
			else if (n === "head") {
				n = e.ownerDocument.head, pf(n);
				for (var a = n.firstChild; a;) {
					var o = a.nextSibling, s = a.nodeName;
					a[gt] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
				}
			} else n === "body" && pf(e.ownerDocument.body);
			n = i;
		} while (n);
		Np(t);
	}
	function $d(e, t) {
		var n = e;
		e = 0;
		do {
			var r = n.nextSibling;
			if (n.nodeType === 1 ? t ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (t ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), r && r.nodeType === 8) if (n = r.data, n === "/$") {
				if (e === 0) break;
				e--;
			} else n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || e++;
			n = r;
		} while (n);
	}
	function ef(e) {
		var t = e.firstChild;
		for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
			var n = t;
			switch (t = t.nextSibling, n.nodeName) {
				case "HTML":
				case "HEAD":
				case "BODY":
					ef(n), _t(n);
					continue;
				case "SCRIPT":
				case "STYLE": continue;
				case "LINK": if (n.rel.toLowerCase() === "stylesheet") continue;
			}
			e.removeChild(n);
		}
	}
	function tf(e, t, n, r) {
		for (; e.nodeType === 1;) {
			var i = n;
			if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
				if (!r && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
			} else if (!r) if (t === "input" && e.type === "hidden") {
				var a = i.name == null ? null : "" + i.name;
				if (i.type === "hidden" && e.getAttribute("name") === a) return e;
			} else return e;
			else if (!e[gt]) switch (t) {
				case "meta":
					if (!e.hasAttribute("itemprop")) break;
					return e;
				case "link":
					if (a = e.getAttribute("rel"), a === "stylesheet" && e.hasAttribute("data-precedence") || a !== i.rel || e.getAttribute("href") !== (i.href == null || i.href === "" ? null : i.href) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin) || e.getAttribute("title") !== (i.title == null ? null : i.title)) break;
					return e;
				case "style":
					if (e.hasAttribute("data-precedence")) break;
					return e;
				case "script":
					if (a = e.getAttribute("src"), (a !== (i.src == null ? null : i.src) || e.getAttribute("type") !== (i.type == null ? null : i.type) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin)) && a && e.hasAttribute("async") && !e.hasAttribute("itemprop")) break;
					return e;
				default: return e;
			}
			if (e = cf(e.nextSibling), e === null) break;
		}
		return null;
	}
	function nf(e, t, n) {
		if (t === "") return null;
		for (; e.nodeType !== 3;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = cf(e.nextSibling), e === null)) return null;
		return e;
	}
	function rf(e, t) {
		for (; e.nodeType !== 8;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = cf(e.nextSibling), e === null)) return null;
		return e;
	}
	function af(e) {
		return e.data === "$?" || e.data === "$~";
	}
	function of(e) {
		return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
	}
	function sf(e, t) {
		var n = e.ownerDocument;
		if (e.data === "$~") e._reactRetry = t;
		else if (e.data !== "$?" || n.readyState !== "loading") t();
		else {
			var r = function() {
				t(), n.removeEventListener("DOMContentLoaded", r);
			};
			n.addEventListener("DOMContentLoaded", r), e._reactRetry = r;
		}
	}
	function cf(e) {
		for (; e != null; e = e.nextSibling) {
			var t = e.nodeType;
			if (t === 1 || t === 3) break;
			if (t === 8) {
				if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F") break;
				if (t === "/$" || t === "/&") return null;
			}
		}
		return e;
	}
	var lf = null;
	function uf(e) {
		e = e.nextSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "/$" || n === "/&") {
					if (t === 0) return cf(e.nextSibling);
					t--;
				} else n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
			}
			e = e.nextSibling;
		}
		return null;
	}
	function df(e) {
		e = e.previousSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
					if (t === 0) return e;
					t--;
				} else n !== "/$" && n !== "/&" || t++;
			}
			e = e.previousSibling;
		}
		return null;
	}
	function ff(e, t, n) {
		switch (t = Bd(n), e) {
			case "html":
				if (e = t.documentElement, !e) throw Error(i(452));
				return e;
			case "head":
				if (e = t.head, !e) throw Error(i(453));
				return e;
			case "body":
				if (e = t.body, !e) throw Error(i(454));
				return e;
			default: throw Error(i(451));
		}
	}
	function pf(e) {
		for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
		_t(e);
	}
	var mf = /* @__PURE__ */ new Map(), hf = /* @__PURE__ */ new Set();
	function gf(e) {
		return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
	}
	var _f = M.d;
	M.d = {
		f: vf,
		r: yf,
		D: Sf,
		C: Cf,
		L: wf,
		m: Tf,
		X: Df,
		S: Ef,
		M: Of
	};
	function vf() {
		var e = _f.f(), t = vu();
		return e || t;
	}
	function yf(e) {
		var t = yt(e);
		t !== null && t.tag === 5 && t.type === "form" ? Ds(t) : _f.r(e);
	}
	var bf = typeof document > "u" ? null : document;
	function xf(e, t, n) {
		var r = bf;
		if (r && typeof t == "string" && t) {
			var i = Bt(t);
			i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), hf.has(i) || (hf.add(i), e = {
				rel: e,
				crossOrigin: n,
				href: t
			}, r.querySelector(i) === null && (t = r.createElement("link"), Pd(t, "link", e), St(t), r.head.appendChild(t)));
		}
	}
	function Sf(e) {
		_f.D(e), xf("dns-prefetch", e, null);
	}
	function Cf(e, t) {
		_f.C(e, t), xf("preconnect", e, t);
	}
	function wf(e, t, n) {
		_f.L(e, t, n);
		var r = bf;
		if (r && e && t) {
			var i = "link[rel=\"preload\"][as=\"" + Bt(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + Bt(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + Bt(n.imageSizes) + "\"]")) : i += "[href=\"" + Bt(e) + "\"]";
			var a = i;
			switch (t) {
				case "style":
					a = Af(e);
					break;
				case "script": a = Pf(e);
			}
			mf.has(a) || (e = h({
				rel: "preload",
				href: t === "image" && n && n.imageSrcSet ? void 0 : e,
				as: t
			}, n), mf.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(jf(a)) || t === "script" && r.querySelector(Ff(a)) || (t = r.createElement("link"), Pd(t, "link", e), St(t), r.head.appendChild(t)));
		}
	}
	function Tf(e, t) {
		_f.m(e, t);
		var n = bf;
		if (n && e) {
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + Bt(r) + "\"][href=\"" + Bt(e) + "\"]", a = i;
			switch (r) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script": a = Pf(e);
			}
			if (!mf.has(a) && (e = h({
				rel: "modulepreload",
				href: e
			}, t), mf.set(a, e), n.querySelector(i) === null)) {
				switch (r) {
					case "audioworklet":
					case "paintworklet":
					case "serviceworker":
					case "sharedworker":
					case "worker":
					case "script": if (n.querySelector(Ff(a))) return;
				}
				r = n.createElement("link"), Pd(r, "link", e), St(r), n.head.appendChild(r);
			}
		}
	}
	function Ef(e, t, n) {
		_f.S(e, t, n);
		var r = bf;
		if (r && e) {
			var i = xt(r).hoistableStyles, a = Af(e);
			t ||= "default";
			var o = i.get(a);
			if (!o) {
				var s = {
					loading: 0,
					preload: null
				};
				if (o = r.querySelector(jf(a))) s.loading = 5;
				else {
					e = h({
						rel: "stylesheet",
						href: e,
						"data-precedence": t
					}, n), (n = mf.get(a)) && Rf(e, n);
					var c = o = r.createElement("link");
					St(c), Pd(c, "link", e), c._p = new Promise(function(e, t) {
						c.onload = e, c.onerror = t;
					}), c.addEventListener("load", function() {
						s.loading |= 1;
					}), c.addEventListener("error", function() {
						s.loading |= 2;
					}), s.loading |= 4, Lf(o, t, r);
				}
				o = {
					type: "stylesheet",
					instance: o,
					count: 1,
					state: s
				}, i.set(a, o);
			}
		}
	}
	function Df(e, t) {
		_f.X(e, t);
		var n = bf;
		if (n && e) {
			var r = xt(n).hoistableScripts, i = Pf(e), a = r.get(i);
			a || (a = n.querySelector(Ff(i)), a || (e = h({
				src: e,
				async: !0
			}, t), (t = mf.get(i)) && zf(e, t), a = n.createElement("script"), St(a), Pd(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Of(e, t) {
		_f.M(e, t);
		var n = bf;
		if (n && e) {
			var r = xt(n).hoistableScripts, i = Pf(e), a = r.get(i);
			a || (a = n.querySelector(Ff(i)), a || (e = h({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = mf.get(i)) && zf(e, t), a = n.createElement("script"), St(a), Pd(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function kf(e, t, n, r) {
		var a = (a = de.current) ? gf(a) : null;
		if (!a) throw Error(i(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (t = Af(n.href), n = xt(a).hoistableStyles, r = n.get(t), r || (r = {
				type: "style",
				instance: null,
				count: 0,
				state: null
			}, n.set(t, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			case "link":
				if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
					e = Af(n.href);
					var o = xt(a).hoistableStyles, s = o.get(e);
					if (s || (a = a.ownerDocument || a, s = {
						type: "stylesheet",
						instance: null,
						count: 0,
						state: {
							loading: 0,
							preload: null
						}
					}, o.set(e, s), (o = a.querySelector(jf(e))) && !o._p && (s.instance = o, s.state.loading = 5), mf.has(e) || (n = {
						rel: "preload",
						as: "style",
						href: n.href,
						crossOrigin: n.crossOrigin,
						integrity: n.integrity,
						media: n.media,
						hrefLang: n.hrefLang,
						referrerPolicy: n.referrerPolicy
					}, mf.set(e, n), o || Nf(a, e, n, s.state))), t && r === null) throw Error(i(528, ""));
					return s;
				}
				if (t && r !== null) throw Error(i(529, ""));
				return null;
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Pf(n), n = xt(a).hoistableScripts, r = n.get(t), r || (r = {
				type: "script",
				instance: null,
				count: 0,
				state: null
			}, n.set(t, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			default: throw Error(i(444, e));
		}
	}
	function Af(e) {
		return "href=\"" + Bt(e) + "\"";
	}
	function jf(e) {
		return "link[rel=\"stylesheet\"][" + e + "]";
	}
	function Mf(e) {
		return h({}, e, {
			"data-precedence": e.precedence,
			precedence: null
		});
	}
	function Nf(e, t, n, r) {
		e.querySelector("link[rel=\"preload\"][as=\"style\"][" + t + "]") ? r.loading = 1 : (t = e.createElement("link"), r.preload = t, t.addEventListener("load", function() {
			return r.loading |= 1;
		}), t.addEventListener("error", function() {
			return r.loading |= 2;
		}), Pd(t, "link", n), St(t), e.head.appendChild(t));
	}
	function Pf(e) {
		return "[src=\"" + Bt(e) + "\"]";
	}
	function Ff(e) {
		return "script[async]" + e;
	}
	function If(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + Bt(n.href) + "\"]");
				if (r) return t.instance = r, St(r), r;
				var a = h({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), St(r), Pd(r, "style", a), Lf(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				a = Af(n.href);
				var o = e.querySelector(jf(a));
				if (o) return t.state.loading |= 4, t.instance = o, St(o), o;
				r = Mf(n), (a = mf.get(a)) && Rf(r, a), o = (e.ownerDocument || e).createElement("link"), St(o);
				var s = o;
				return s._p = new Promise(function(e, t) {
					s.onload = e, s.onerror = t;
				}), Pd(o, "link", r), t.state.loading |= 4, Lf(o, n.precedence, e), t.instance = o;
			case "script": return o = Pf(n.src), (a = e.querySelector(Ff(o))) ? (t.instance = a, St(a), a) : (r = n, (a = mf.get(o)) && (r = h({}, n), zf(r, a)), e = e.ownerDocument || e, a = e.createElement("script"), St(a), Pd(a, "link", r), e.head.appendChild(a), t.instance = a);
			case "void": return null;
			default: throw Error(i(443, t.type));
		}
		else t.type === "stylesheet" && !(t.state.loading & 4) && (r = t.instance, t.state.loading |= 4, Lf(r, n.precedence, e));
		return t.instance;
	}
	function Lf(e, t, n) {
		for (var r = n.querySelectorAll("link[rel=\"stylesheet\"][data-precedence],style[data-precedence]"), i = r.length ? r[r.length - 1] : null, a = i, o = 0; o < r.length; o++) {
			var s = r[o];
			if (s.dataset.precedence === t) a = s;
			else if (a !== i) break;
		}
		a ? a.parentNode.insertBefore(e, a.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
	}
	function Rf(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.title ??= t.title;
	}
	function zf(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.integrity ??= t.integrity;
	}
	var Bf = null;
	function Vf(e, t, n) {
		if (Bf === null) {
			var r = /* @__PURE__ */ new Map(), i = Bf = /* @__PURE__ */ new Map();
			i.set(n, r);
		} else i = Bf, r = i.get(n), r || (r = /* @__PURE__ */ new Map(), i.set(n, r));
		if (r.has(e)) return r;
		for (r.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
			var a = n[i];
			if (!(a[gt] || a[lt] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== "http://www.w3.org/2000/svg") {
				var o = a.getAttribute(t) || "";
				o = e + o;
				var s = r.get(o);
				s ? s.push(a) : r.set(o, [a]);
			}
		}
		return r;
	}
	function Hf(e, t, n) {
		e = e.ownerDocument || e, e.head.insertBefore(n, t === "title" ? e.querySelector("head > title") : null);
	}
	function Uf(e, t, n) {
		if (n === 1 || t.itemProp != null) return !1;
		switch (e) {
			case "meta":
			case "title": return !0;
			case "style":
				if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") break;
				return !0;
			case "link":
				if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError) break;
				switch (t.rel) {
					case "stylesheet": return e = t.disabled, typeof t.precedence == "string" && e == null;
					default: return !0;
				}
			case "script": if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string") return !0;
		}
		return !1;
	}
	function Wf(e) {
		return !(e.type === "stylesheet" && !(e.state.loading & 3));
	}
	function Gf(e, t, n, r) {
		if (n.type === "stylesheet" && (typeof r.media != "string" || !1 !== matchMedia(r.media).matches) && !(n.state.loading & 4)) {
			if (n.instance === null) {
				var i = Af(r.href), a = t.querySelector(jf(i));
				if (a) {
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = Jf.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, St(a);
					return;
				}
				a = t.ownerDocument || t, r = Mf(r), (i = mf.get(i)) && Rf(r, i), a = a.createElement("link"), St(a);
				var o = a;
				o._p = new Promise(function(e, t) {
					o.onload = e, o.onerror = t;
				}), Pd(a, "link", r), n.instance = a;
			}
			e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && !(n.state.loading & 3) && (e.count++, n = Jf.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
		}
	}
	var Kf = 0;
	function qf(e, t) {
		return e.stylesheets && e.count === 0 && Xf(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
			var r = setTimeout(function() {
				if (e.stylesheets && Xf(e, e.stylesheets), e.unsuspend) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, 6e4 + t);
			0 < e.imgBytes && Kf === 0 && (Kf = 62500 * Ld());
			var i = setTimeout(function() {
				if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && Xf(e, e.stylesheets), e.unsuspend)) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, (e.imgBytes > Kf ? 50 : 800) + t);
			return e.unsuspend = n, function() {
				e.unsuspend = null, clearTimeout(r), clearTimeout(i);
			};
		} : null;
	}
	function Jf() {
		if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
			if (this.stylesheets) Xf(this, this.stylesheets);
			else if (this.unsuspend) {
				var e = this.unsuspend;
				this.unsuspend = null, e();
			}
		}
	}
	var Yf = null;
	function Xf(e, t) {
		e.stylesheets = null, e.unsuspend !== null && (e.count++, Yf = /* @__PURE__ */ new Map(), t.forEach(Zf, e), Yf = null, Jf.call(e));
	}
	function Zf(e, t) {
		if (!(t.state.loading & 4)) {
			var n = Yf.get(e);
			if (n) var r = n.get(null);
			else {
				n = /* @__PURE__ */ new Map(), Yf.set(e, n);
				for (var i = e.querySelectorAll("link[data-precedence],style[data-precedence]"), a = 0; a < i.length; a++) {
					var o = i[a];
					(o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (n.set(o.dataset.precedence, o), r = o);
				}
				r && n.set(null, r);
			}
			i = t.instance, o = i.getAttribute("data-precedence"), a = n.get(o) || r, a === r && n.set(null, i), n.set(o, i), this.count++, r = Jf.bind(this), i.addEventListener("load", r), i.addEventListener("error", r), a ? a.parentNode.insertBefore(i, a.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= 4;
		}
	}
	var Qf = {
		$$typeof: C,
		Provider: null,
		Consumer: null,
		_currentValue: ae,
		_currentValue2: ae,
		_threadCount: 0
	};
	function $f(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = Qe(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Qe(0), this.hiddenUpdates = Qe(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function ep(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new $f(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = li(3, null, null, t), e.current = a, a.stateNode = e, t = la(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, Ha(a), e;
	}
	function tp(e) {
		return e ? (e = si, e) : si;
	}
	function np(e, t, n, r, i, a) {
		i = tp(i), r.context === null ? r.context = i : r.pendingContext = i, r = Wa(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = Ga(e, r, t), n !== null && (pu(n, e, t), Ka(n, e, t));
	}
	function rp(e, t) {
		if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
			var n = e.retryLane;
			e.retryLane = n !== 0 && n < t ? n : t;
		}
	}
	function ip(e, t) {
		rp(e, t), (e = e.alternate) && rp(e, t);
	}
	function ap(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = ii(e, 67108864);
			t !== null && pu(t, e, 67108864), ip(e, 67108864);
		}
	}
	function op(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = du();
			t = it(t);
			var n = ii(e, t);
			n !== null && pu(n, e, t), ip(e, t);
		}
	}
	var sp = !0;
	function cp(e, t, n, r) {
		var i = j.T;
		j.T = null;
		var a = M.p;
		try {
			M.p = 2, up(e, t, n, r);
		} finally {
			M.p = a, j.T = i;
		}
	}
	function lp(e, t, n, r) {
		var i = j.T;
		j.T = null;
		var a = M.p;
		try {
			M.p = 8, up(e, t, n, r);
		} finally {
			M.p = a, j.T = i;
		}
	}
	function up(e, t, n, r) {
		if (sp) {
			var i = dp(r);
			if (i === null) Cd(e, t, r, fp, n), Cp(e, r);
			else if (Tp(i, e, t, n, r)) r.stopPropagation();
			else if (Cp(e, r), t & 4 && -1 < Sp.indexOf(e)) {
				for (; i !== null;) {
					var a = yt(i);
					if (a !== null) switch (a.tag) {
						case 3:
							if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
								var o = qe(a.pendingLanes);
								if (o !== 0) {
									var s = a;
									for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
										var c = 1 << 31 - F(o);
										s.entanglements[1] |= c, o &= ~c;
									}
									nd(a), !(Y & 6) && ($l = ke() + 500, rd(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = ii(a, 2), s !== null && pu(s, a, 2), vu(), ip(a, 2);
					}
					if (a = dp(r), a === null && Cd(e, t, r, fp, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else Cd(e, t, r, null, n);
		}
	}
	function dp(e) {
		return e = nn(e), pp(e);
	}
	var fp = null;
	function pp(e) {
		if (fp = null, e = vt(e), e !== null) {
			var t = o(e);
			if (t === null) e = null;
			else {
				var n = t.tag;
				if (n === 13) {
					if (e = s(t), e !== null) return e;
					e = null;
				} else if (n === 31) {
					if (e = c(t), e !== null) return e;
					e = null;
				} else if (n === 3) {
					if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
					e = null;
				} else t !== e && (e = null);
			}
		}
		return fp = e, null;
	}
	function mp(e) {
		switch (e) {
			case "beforetoggle":
			case "cancel":
			case "click":
			case "close":
			case "contextmenu":
			case "copy":
			case "cut":
			case "auxclick":
			case "dblclick":
			case "dragend":
			case "dragstart":
			case "drop":
			case "focusin":
			case "focusout":
			case "input":
			case "invalid":
			case "keydown":
			case "keypress":
			case "keyup":
			case "mousedown":
			case "mouseup":
			case "paste":
			case "pause":
			case "play":
			case "pointercancel":
			case "pointerdown":
			case "pointerup":
			case "ratechange":
			case "reset":
			case "resize":
			case "seeked":
			case "submit":
			case "toggle":
			case "touchcancel":
			case "touchend":
			case "touchstart":
			case "volumechange":
			case "change":
			case "selectionchange":
			case "textInput":
			case "compositionstart":
			case "compositionend":
			case "compositionupdate":
			case "beforeblur":
			case "afterblur":
			case "beforeinput":
			case "blur":
			case "fullscreenchange":
			case "focus":
			case "hashchange":
			case "popstate":
			case "select":
			case "selectstart": return 2;
			case "drag":
			case "dragenter":
			case "dragexit":
			case "dragleave":
			case "dragover":
			case "mousemove":
			case "mouseout":
			case "mouseover":
			case "pointermove":
			case "pointerout":
			case "pointerover":
			case "scroll":
			case "touchmove":
			case "wheel":
			case "mouseenter":
			case "mouseleave":
			case "pointerenter":
			case "pointerleave": return 8;
			case "message": switch (Ae()) {
				case je: return 2;
				case Me: return 8;
				case Ne:
				case Pe: return 32;
				case Fe: return 268435456;
				default: return 32;
			}
			default: return 32;
		}
	}
	var hp = !1, gp = null, _p = null, vp = null, yp = /* @__PURE__ */ new Map(), bp = /* @__PURE__ */ new Map(), xp = [], Sp = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
	function Cp(e, t) {
		switch (e) {
			case "focusin":
			case "focusout":
				gp = null;
				break;
			case "dragenter":
			case "dragleave":
				_p = null;
				break;
			case "mouseover":
			case "mouseout":
				vp = null;
				break;
			case "pointerover":
			case "pointerout":
				yp.delete(t.pointerId);
				break;
			case "gotpointercapture":
			case "lostpointercapture": bp.delete(t.pointerId);
		}
	}
	function wp(e, t, n, r, i, a) {
		return e === null || e.nativeEvent !== a ? (e = {
			blockedOn: t,
			domEventName: n,
			eventSystemFlags: r,
			nativeEvent: a,
			targetContainers: [i]
		}, t !== null && (t = yt(t), t !== null && ap(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
	}
	function Tp(e, t, n, r, i) {
		switch (t) {
			case "focusin": return gp = wp(gp, e, t, n, r, i), !0;
			case "dragenter": return _p = wp(_p, e, t, n, r, i), !0;
			case "mouseover": return vp = wp(vp, e, t, n, r, i), !0;
			case "pointerover":
				var a = i.pointerId;
				return yp.set(a, wp(yp.get(a) || null, e, t, n, r, i)), !0;
			case "gotpointercapture": return a = i.pointerId, bp.set(a, wp(bp.get(a) || null, e, t, n, r, i)), !0;
		}
		return !1;
	}
	function Ep(e) {
		var t = vt(e.target);
		if (t !== null) {
			var n = o(t);
			if (n !== null) {
				if (t = n.tag, t === 13) {
					if (t = s(n), t !== null) {
						e.blockedOn = t, st(e.priority, function() {
							op(n);
						});
						return;
					}
				} else if (t === 31) {
					if (t = c(n), t !== null) {
						e.blockedOn = t, st(e.priority, function() {
							op(n);
						});
						return;
					}
				} else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
					e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
					return;
				}
			}
		}
		e.blockedOn = null;
	}
	function Dp(e) {
		if (e.blockedOn !== null) return !1;
		for (var t = e.targetContainers; 0 < t.length;) {
			var n = dp(e.nativeEvent);
			if (n === null) {
				n = e.nativeEvent;
				var r = new n.constructor(n.type, n);
				tn = r, n.target.dispatchEvent(r), tn = null;
			} else return t = yt(n), t !== null && ap(t), e.blockedOn = n, !1;
			t.shift();
		}
		return !0;
	}
	function Op(e, t, n) {
		Dp(e) && n.delete(t);
	}
	function kp() {
		hp = !1, gp !== null && Dp(gp) && (gp = null), _p !== null && Dp(_p) && (_p = null), vp !== null && Dp(vp) && (vp = null), yp.forEach(Op), bp.forEach(Op);
	}
	function Ap(e, n) {
		e.blockedOn === n && (e.blockedOn = null, hp || (hp = !0, t.unstable_scheduleCallback(t.unstable_NormalPriority, kp)));
	}
	var jp = null;
	function Mp(e) {
		jp !== e && (jp = e, t.unstable_scheduleCallback(t.unstable_NormalPriority, function() {
			jp === e && (jp = null);
			for (var t = 0; t < e.length; t += 3) {
				var n = e[t], r = e[t + 1], i = e[t + 2];
				if (typeof r != "function") {
					if (pp(r || n) === null) continue;
					break;
				}
				var a = yt(n);
				a !== null && (e.splice(t, 3), t -= 3, Ts(a, {
					pending: !0,
					data: i,
					method: n.method,
					action: r
				}, r, i));
			}
		}));
	}
	function Np(e) {
		function t(t) {
			return Ap(t, e);
		}
		gp !== null && Ap(gp, e), _p !== null && Ap(_p, e), vp !== null && Ap(vp, e), yp.forEach(t), bp.forEach(t);
		for (var n = 0; n < xp.length; n++) {
			var r = xp[n];
			r.blockedOn === e && (r.blockedOn = null);
		}
		for (; 0 < xp.length && (n = xp[0], n.blockedOn === null);) Ep(n), n.blockedOn === null && xp.shift();
		if (n = (e.ownerDocument || e).$$reactFormReplay, n != null) for (r = 0; r < n.length; r += 3) {
			var i = n[r], a = n[r + 1], o = i[ut] || null;
			if (typeof a == "function") o || Mp(n);
			else if (o) {
				var s = null;
				if (a && a.hasAttribute("formAction")) {
					if (i = a, o = a[ut] || null) s = o.formAction;
					else if (pp(i) !== null) continue;
				} else s = o.action;
				typeof s == "function" ? n[r + 1] = s : (n.splice(r, 3), r -= 3), Mp(n);
			}
		}
	}
	function Pp() {
		function e(e) {
			e.canIntercept && e.info === "react-transition" && e.intercept({
				handler: function() {
					return new Promise(function(e) {
						return i = e;
					});
				},
				focusReset: "manual",
				scroll: "manual"
			});
		}
		function t() {
			i !== null && (i(), i = null), r || setTimeout(n, 20);
		}
		function n() {
			if (!r && !navigation.transition) {
				var e = navigation.currentEntry;
				e && e.url != null && navigation.navigate(e.url, {
					state: e.getState(),
					info: "react-transition",
					history: "replace"
				});
			}
		}
		if (typeof navigation == "object") {
			var r = !1, i = null;
			return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(n, 100), function() {
				r = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), i !== null && (i(), i = null);
			};
		}
	}
	function Fp(e) {
		this._internalRoot = e;
	}
	Ip.prototype.render = Fp.prototype.render = function(e) {
		var t = this._internalRoot;
		if (t === null) throw Error(i(409));
		var n = t.current;
		np(n, du(), e, t, null, null);
	}, Ip.prototype.unmount = Fp.prototype.unmount = function() {
		var e = this._internalRoot;
		if (e !== null) {
			this._internalRoot = null;
			var t = e.containerInfo;
			np(e.current, 2, null, e, null, null), vu(), t[dt] = null;
		}
	};
	function Ip(e) {
		this._internalRoot = e;
	}
	Ip.prototype.unstable_scheduleHydration = function(e) {
		if (e) {
			var t = ot();
			e = {
				blockedOn: null,
				target: e,
				priority: t
			};
			for (var n = 0; n < xp.length && t !== 0 && t < xp[n].priority; n++);
			xp.splice(n, 0, e), n === 0 && Ep(e);
		}
	};
	var Lp = n.version;
	if (Lp !== "19.2.6") throw Error(i(527, Lp, "19.2.6"));
	M.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
		return e = d(t), e = e === null ? null : p(e), e = e === null ? null : e.stateNode, e;
	};
	var Rp = {
		bundleType: 0,
		version: "19.2.6",
		rendererPackageName: "react-dom",
		currentDispatcherRef: j,
		reconcilerVersion: "19.2.6"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var zp = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!zp.isDisabled && zp.supportsFiber) try {
			Re = zp.inject(Rp), ze = zp;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!a(e)) throw Error(i(299));
		var n = !1, r = "", o = qs, s = Js, c = Ys;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (o = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = ep(e, 1, !1, null, null, n, r, null, o, s, c, Pp), e[dt] = t.current, xd(e), new Fp(t);
	}, e.hydrateRoot = function(e, t, n) {
		if (!a(e)) throw Error(i(299));
		var r = !1, o = "", s = qs, c = Js, l = Ys, u = null;
		return n != null && (!0 === n.unstable_strictMode && (r = !0), n.identifierPrefix !== void 0 && (o = n.identifierPrefix), n.onUncaughtError !== void 0 && (s = n.onUncaughtError), n.onCaughtError !== void 0 && (c = n.onCaughtError), n.onRecoverableError !== void 0 && (l = n.onRecoverableError), n.formState !== void 0 && (u = n.formState)), t = ep(e, 1, !0, t, n ?? null, r, o, u, s, c, l, Pp), t.context = tp(null), n = t.current, r = du(), r = it(r), o = Wa(r), o.callback = null, Ga(n, o, r), n = r, t.current.lanes = n, $e(t, n), nd(t), e[dt] = t.current, xd(e), new Ip(t);
	}, e.version = "19.2.6";
})), g = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = h();
})), _ = /* @__PURE__ */ c(u()), v = /* @__PURE__ */ c(g());
//#endregion
//#region node_modules/d3-array/src/max.js
function y(e, t) {
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
function b(e, t) {
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
function x(e, t) {
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
var S = { value: () => {} };
function C() {
	for (var e = 0, t = arguments.length, n = {}, r; e < t; ++e) {
		if (!(r = arguments[e] + "") || r in n || /[\s.]/.test(r)) throw Error("illegal type: " + r);
		n[r] = [];
	}
	return new w(n);
}
function w(e) {
	this._ = e;
}
function T(e, t) {
	return e.trim().split(/^|\s+/).map(function(e) {
		var n = "", r = e.indexOf(".");
		if (r >= 0 && (n = e.slice(r + 1), e = e.slice(0, r)), e && !t.hasOwnProperty(e)) throw Error("unknown type: " + e);
		return {
			type: e,
			name: n
		};
	});
}
w.prototype = C.prototype = {
	constructor: w,
	on: function(e, t) {
		var n = this._, r = T(e + "", n), i, a = -1, o = r.length;
		if (arguments.length < 2) {
			for (; ++a < o;) if ((i = (e = r[a]).type) && (i = E(n[i], e.name))) return i;
			return;
		}
		if (t != null && typeof t != "function") throw Error("invalid callback: " + t);
		for (; ++a < o;) if (i = (e = r[a]).type) n[i] = D(n[i], e.name, t);
		else if (t == null) for (i in n) n[i] = D(n[i], e.name, null);
		return this;
	},
	copy: function() {
		var e = {}, t = this._;
		for (var n in t) e[n] = t[n].slice();
		return new w(e);
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
function E(e, t) {
	for (var n = 0, r = e.length, i; n < r; ++n) if ((i = e[n]).name === t) return i.value;
}
function D(e, t, n) {
	for (var r = 0, i = e.length; r < i; ++r) if (e[r].name === t) {
		e[r] = S, e = e.slice(0, r).concat(e.slice(r + 1));
		break;
	}
	return n != null && e.push({
		name: t,
		value: n
	}), e;
}
var O = {
	svg: "http://www.w3.org/2000/svg",
	xhtml: "http://www.w3.org/1999/xhtml",
	xlink: "http://www.w3.org/1999/xlink",
	xml: "http://www.w3.org/XML/1998/namespace",
	xmlns: "http://www.w3.org/2000/xmlns/"
};
//#endregion
//#region node_modules/d3-selection/src/namespace.js
function k(e) {
	var t = e += "", n = t.indexOf(":");
	return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), O.hasOwnProperty(t) ? {
		space: O[t],
		local: e
	} : e;
}
//#endregion
//#region node_modules/d3-selection/src/creator.js
function ee(e) {
	return function() {
		var t = this.ownerDocument, n = this.namespaceURI;
		return n === "http://www.w3.org/1999/xhtml" && t.documentElement.namespaceURI === "http://www.w3.org/1999/xhtml" ? t.createElement(e) : t.createElementNS(n, e);
	};
}
function te(e) {
	return function() {
		return this.ownerDocument.createElementNS(e.space, e.local);
	};
}
function ne(e) {
	var t = k(e);
	return (t.local ? te : ee)(t);
}
//#endregion
//#region node_modules/d3-selection/src/selector.js
function re() {}
function ie(e) {
	return e == null ? re : function() {
		return this.querySelector(e);
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/select.js
function A(e) {
	typeof e != "function" && (e = ie(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = Array(o), c, l, u = 0; u < o; ++u) (c = a[u]) && (l = e.call(c, c.__data__, u, a)) && ("__data__" in c && (l.__data__ = c.__data__), s[u] = l);
	return new Bt(r, this._parents);
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
function ae(e) {
	return e == null ? M : function() {
		return this.querySelectorAll(e);
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/selectAll.js
function oe(e) {
	return function() {
		return j(e.apply(this, arguments));
	};
}
function se(e) {
	e = typeof e == "function" ? oe(e) : ae(e);
	for (var t = this._groups, n = t.length, r = [], i = [], a = 0; a < n; ++a) for (var o = t[a], s = o.length, c, l = 0; l < s; ++l) (c = o[l]) && (r.push(e.call(c, c.__data__, l, o)), i.push(c));
	return new Bt(r, i);
}
//#endregion
//#region node_modules/d3-selection/src/matcher.js
function ce(e) {
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
var P = Array.prototype.find;
function le(e) {
	return function() {
		return P.call(this.children, e);
	};
}
function ue() {
	return this.firstElementChild;
}
function de(e) {
	return this.select(e == null ? ue : le(typeof e == "function" ? e : N(e)));
}
//#endregion
//#region node_modules/d3-selection/src/selection/selectChildren.js
var fe = Array.prototype.filter;
function pe() {
	return Array.from(this.children);
}
function me(e) {
	return function() {
		return fe.call(this.children, e);
	};
}
function he(e) {
	return this.selectAll(e == null ? pe : me(typeof e == "function" ? e : N(e)));
}
//#endregion
//#region node_modules/d3-selection/src/selection/filter.js
function ge(e) {
	typeof e != "function" && (e = ce(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = [], c, l = 0; l < o; ++l) (c = a[l]) && e.call(c, c.__data__, l, a) && s.push(c);
	return new Bt(r, this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/selection/sparse.js
function _e(e) {
	return Array(e.length);
}
//#endregion
//#region node_modules/d3-selection/src/selection/enter.js
function ve() {
	return new Bt(this._enter || this._groups.map(_e), this._parents);
}
function ye(e, t) {
	this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
ye.prototype = {
	constructor: ye,
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
function be(e) {
	return function() {
		return e;
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/data.js
function xe(e, t, n, r, i, a) {
	for (var o = 0, s, c = t.length, l = a.length; o < l; ++o) (s = t[o]) ? (s.__data__ = a[o], r[o] = s) : n[o] = new ye(e, a[o]);
	for (; o < c; ++o) (s = t[o]) && (i[o] = s);
}
function Se(e, t, n, r, i, a, o) {
	var s, c, l = /* @__PURE__ */ new Map(), u = t.length, d = a.length, f = Array(u), p;
	for (s = 0; s < u; ++s) (c = t[s]) && (f[s] = p = o.call(c, c.__data__, s, t) + "", l.has(p) ? i[s] = c : l.set(p, c));
	for (s = 0; s < d; ++s) p = o.call(e, a[s], s, a) + "", (c = l.get(p)) ? (r[s] = c, c.__data__ = a[s], l.delete(p)) : n[s] = new ye(e, a[s]);
	for (s = 0; s < u; ++s) (c = t[s]) && l.get(f[s]) === c && (i[s] = c);
}
function Ce(e) {
	return e.__data__;
}
function we(e, t) {
	if (!arguments.length) return Array.from(this, Ce);
	var n = t ? Se : xe, r = this._parents, i = this._groups;
	typeof e != "function" && (e = be(e));
	for (var a = i.length, o = Array(a), s = Array(a), c = Array(a), l = 0; l < a; ++l) {
		var u = r[l], d = i[l], f = d.length, p = Te(e.call(u, u && u.__data__, l, r)), m = p.length, h = s[l] = Array(m), g = o[l] = Array(m);
		n(u, d, h, g, c[l] = Array(f), p, t);
		for (var _ = 0, v = 0, y, b; _ < m; ++_) if (y = h[_]) {
			for (_ >= v && (v = _ + 1); !(b = g[v]) && ++v < m;);
			y._next = b || null;
		}
	}
	return o = new Bt(o, r), o._enter = s, o._exit = c, o;
}
function Te(e) {
	return typeof e == "object" && "length" in e ? e : Array.from(e);
}
//#endregion
//#region node_modules/d3-selection/src/selection/exit.js
function Ee() {
	return new Bt(this._exit || this._groups.map(_e), this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/selection/join.js
function De(e, t, n) {
	var r = this.enter(), i = this, a = this.exit();
	return typeof e == "function" ? (r = e(r), r &&= r.selection()) : r = r.append(e + ""), t != null && (i = t(i), i &&= i.selection()), n == null ? a.remove() : n(a), r && i ? r.merge(i).order() : i;
}
//#endregion
//#region node_modules/d3-selection/src/selection/merge.js
function Oe(e) {
	for (var t = e.selection ? e.selection() : e, n = this._groups, r = t._groups, i = n.length, a = r.length, o = Math.min(i, a), s = Array(i), c = 0; c < o; ++c) for (var l = n[c], u = r[c], d = l.length, f = s[c] = Array(d), p, m = 0; m < d; ++m) (p = l[m] || u[m]) && (f[m] = p);
	for (; c < i; ++c) s[c] = n[c];
	return new Bt(s, this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/selection/order.js
function ke() {
	for (var e = this._groups, t = -1, n = e.length; ++t < n;) for (var r = e[t], i = r.length - 1, a = r[i], o; --i >= 0;) (o = r[i]) && (a && o.compareDocumentPosition(a) ^ 4 && a.parentNode.insertBefore(o, a), a = o);
	return this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/sort.js
function Ae(e) {
	e ||= je;
	function t(t, n) {
		return t && n ? e(t.__data__, n.__data__) : !t - !n;
	}
	for (var n = this._groups, r = n.length, i = Array(r), a = 0; a < r; ++a) {
		for (var o = n[a], s = o.length, c = i[a] = Array(s), l, u = 0; u < s; ++u) (l = o[u]) && (c[u] = l);
		c.sort(t);
	}
	return new Bt(i, this._parents).order();
}
function je(e, t) {
	return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
//#endregion
//#region node_modules/d3-selection/src/selection/call.js
function Me() {
	var e = arguments[0];
	return arguments[0] = this, e.apply(null, arguments), this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/nodes.js
function Ne() {
	return Array.from(this);
}
//#endregion
//#region node_modules/d3-selection/src/selection/node.js
function Pe() {
	for (var e = this._groups, t = 0, n = e.length; t < n; ++t) for (var r = e[t], i = 0, a = r.length; i < a; ++i) {
		var o = r[i];
		if (o) return o;
	}
	return null;
}
//#endregion
//#region node_modules/d3-selection/src/selection/size.js
function Fe() {
	let e = 0;
	for (let t of this) ++e;
	return e;
}
//#endregion
//#region node_modules/d3-selection/src/selection/empty.js
function Ie() {
	return !this.node();
}
//#endregion
//#region node_modules/d3-selection/src/selection/each.js
function Le(e) {
	for (var t = this._groups, n = 0, r = t.length; n < r; ++n) for (var i = t[n], a = 0, o = i.length, s; a < o; ++a) (s = i[a]) && e.call(s, s.__data__, a, i);
	return this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/attr.js
function Re(e) {
	return function() {
		this.removeAttribute(e);
	};
}
function ze(e) {
	return function() {
		this.removeAttributeNS(e.space, e.local);
	};
}
function Be(e, t) {
	return function() {
		this.setAttribute(e, t);
	};
}
function F(e, t) {
	return function() {
		this.setAttributeNS(e.space, e.local, t);
	};
}
function Ve(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
	};
}
function He(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
	};
}
function Ue(e, t) {
	var n = k(e);
	if (arguments.length < 2) {
		var r = this.node();
		return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
	}
	return this.each((t == null ? n.local ? ze : Re : typeof t == "function" ? n.local ? He : Ve : n.local ? F : Be)(n, t));
}
//#endregion
//#region node_modules/d3-selection/src/window.js
function We(e) {
	return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
//#endregion
//#region node_modules/d3-selection/src/selection/style.js
function Ge(e) {
	return function() {
		this.style.removeProperty(e);
	};
}
function Ke(e, t, n) {
	return function() {
		this.style.setProperty(e, t, n);
	};
}
function qe(e, t, n) {
	return function() {
		var r = t.apply(this, arguments);
		r == null ? this.style.removeProperty(e) : this.style.setProperty(e, r, n);
	};
}
function Je(e, t, n) {
	return arguments.length > 1 ? this.each((t == null ? Ge : typeof t == "function" ? qe : Ke)(e, t, n ?? "")) : Ye(this.node(), e);
}
function Ye(e, t) {
	return e.style.getPropertyValue(t) || We(e).getComputedStyle(e, null).getPropertyValue(t);
}
//#endregion
//#region node_modules/d3-selection/src/selection/property.js
function Xe(e) {
	return function() {
		delete this[e];
	};
}
function Ze(e, t) {
	return function() {
		this[e] = t;
	};
}
function Qe(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? delete this[e] : this[e] = n;
	};
}
function $e(e, t) {
	return arguments.length > 1 ? this.each((t == null ? Xe : typeof t == "function" ? Qe : Ze)(e, t)) : this.node()[e];
}
//#endregion
//#region node_modules/d3-selection/src/selection/classed.js
function et(e) {
	return e.trim().split(/^|\s+/);
}
function tt(e) {
	return e.classList || new nt(e);
}
function nt(e) {
	this._node = e, this._names = et(e.getAttribute("class") || "");
}
nt.prototype = {
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
function rt(e, t) {
	for (var n = tt(e), r = -1, i = t.length; ++r < i;) n.add(t[r]);
}
function it(e, t) {
	for (var n = tt(e), r = -1, i = t.length; ++r < i;) n.remove(t[r]);
}
function at(e) {
	return function() {
		rt(this, e);
	};
}
function ot(e) {
	return function() {
		it(this, e);
	};
}
function st(e, t) {
	return function() {
		(t.apply(this, arguments) ? rt : it)(this, e);
	};
}
function ct(e, t) {
	var n = et(e + "");
	if (arguments.length < 2) {
		for (var r = tt(this.node()), i = -1, a = n.length; ++i < a;) if (!r.contains(n[i])) return !1;
		return !0;
	}
	return this.each((typeof t == "function" ? st : t ? at : ot)(n, t));
}
//#endregion
//#region node_modules/d3-selection/src/selection/text.js
function lt() {
	this.textContent = "";
}
function ut(e) {
	return function() {
		this.textContent = e;
	};
}
function dt(e) {
	return function() {
		var t = e.apply(this, arguments);
		this.textContent = t ?? "";
	};
}
function ft(e) {
	return arguments.length ? this.each(e == null ? lt : (typeof e == "function" ? dt : ut)(e)) : this.node().textContent;
}
//#endregion
//#region node_modules/d3-selection/src/selection/html.js
function pt() {
	this.innerHTML = "";
}
function mt(e) {
	return function() {
		this.innerHTML = e;
	};
}
function ht(e) {
	return function() {
		var t = e.apply(this, arguments);
		this.innerHTML = t ?? "";
	};
}
function gt(e) {
	return arguments.length ? this.each(e == null ? pt : (typeof e == "function" ? ht : mt)(e)) : this.node().innerHTML;
}
//#endregion
//#region node_modules/d3-selection/src/selection/raise.js
function _t() {
	this.nextSibling && this.parentNode.appendChild(this);
}
function vt() {
	return this.each(_t);
}
//#endregion
//#region node_modules/d3-selection/src/selection/lower.js
function yt() {
	this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function bt() {
	return this.each(yt);
}
//#endregion
//#region node_modules/d3-selection/src/selection/append.js
function xt(e) {
	var t = typeof e == "function" ? e : ne(e);
	return this.select(function() {
		return this.appendChild(t.apply(this, arguments));
	});
}
//#endregion
//#region node_modules/d3-selection/src/selection/insert.js
function St() {
	return null;
}
function Ct(e, t) {
	var n = typeof e == "function" ? e : ne(e), r = t == null ? St : typeof t == "function" ? t : ie(t);
	return this.select(function() {
		return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
	});
}
//#endregion
//#region node_modules/d3-selection/src/selection/remove.js
function wt() {
	var e = this.parentNode;
	e && e.removeChild(this);
}
function Tt() {
	return this.each(wt);
}
//#endregion
//#region node_modules/d3-selection/src/selection/clone.js
function Et() {
	var e = this.cloneNode(!1), t = this.parentNode;
	return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Dt() {
	var e = this.cloneNode(!0), t = this.parentNode;
	return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Ot(e) {
	return this.select(e ? Dt : Et);
}
//#endregion
//#region node_modules/d3-selection/src/selection/datum.js
function kt(e) {
	return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
//#endregion
//#region node_modules/d3-selection/src/selection/on.js
function At(e) {
	return function(t) {
		e.call(this, t, this.__data__);
	};
}
function jt(e) {
	return e.trim().split(/^|\s+/).map(function(e) {
		var t = "", n = e.indexOf(".");
		return n >= 0 && (t = e.slice(n + 1), e = e.slice(0, n)), {
			type: e,
			name: t
		};
	});
}
function Mt(e) {
	return function() {
		var t = this.__on;
		if (t) {
			for (var n = 0, r = -1, i = t.length, a; n < i; ++n) a = t[n], (!e.type || a.type === e.type) && a.name === e.name ? this.removeEventListener(a.type, a.listener, a.options) : t[++r] = a;
			++r ? t.length = r : delete this.__on;
		}
	};
}
function Nt(e, t, n) {
	return function() {
		var r = this.__on, i, a = At(t);
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
function Pt(e, t, n) {
	var r = jt(e + ""), i, a = r.length, o;
	if (arguments.length < 2) {
		var s = this.node().__on;
		if (s) {
			for (var c = 0, l = s.length, u; c < l; ++c) for (i = 0, u = s[c]; i < a; ++i) if ((o = r[i]).type === u.type && o.name === u.name) return u.value;
		}
		return;
	}
	for (s = t ? Nt : Mt, i = 0; i < a; ++i) this.each(s(r[i], t, n));
	return this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/dispatch.js
function I(e, t, n) {
	var r = We(e), i = r.CustomEvent;
	typeof i == "function" ? i = new i(t, n) : (i = r.document.createEvent("Event"), n ? (i.initEvent(t, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(t, !1, !1)), e.dispatchEvent(i);
}
function Ft(e, t) {
	return function() {
		return I(this, e, t);
	};
}
function It(e, t) {
	return function() {
		return I(this, e, t.apply(this, arguments));
	};
}
function Lt(e, t) {
	return this.each((typeof t == "function" ? It : Ft)(e, t));
}
//#endregion
//#region node_modules/d3-selection/src/selection/iterator.js
function* Rt() {
	for (var e = this._groups, t = 0, n = e.length; t < n; ++t) for (var r = e[t], i = 0, a = r.length, o; i < a; ++i) (o = r[i]) && (yield o);
}
//#endregion
//#region node_modules/d3-selection/src/selection/index.js
var zt = [null];
function Bt(e, t) {
	this._groups = e, this._parents = t;
}
function Vt() {
	return new Bt([[document.documentElement]], zt);
}
function Ht() {
	return this;
}
Bt.prototype = Vt.prototype = {
	constructor: Bt,
	select: A,
	selectAll: se,
	selectChild: de,
	selectChildren: he,
	filter: ge,
	data: we,
	enter: ve,
	exit: Ee,
	join: De,
	merge: Oe,
	selection: Ht,
	order: ke,
	sort: Ae,
	call: Me,
	nodes: Ne,
	node: Pe,
	size: Fe,
	empty: Ie,
	each: Le,
	attr: Ue,
	style: Je,
	property: $e,
	classed: ct,
	text: ft,
	html: gt,
	raise: vt,
	lower: bt,
	append: xt,
	insert: Ct,
	remove: Tt,
	clone: Ot,
	datum: kt,
	on: Pt,
	dispatch: Lt,
	[Symbol.iterator]: Rt
};
//#endregion
//#region node_modules/d3-selection/src/select.js
function L(e) {
	return typeof e == "string" ? new Bt([[document.querySelector(e)]], [document.documentElement]) : new Bt([[e]], zt);
}
//#endregion
//#region node_modules/d3-selection/src/sourceEvent.js
function Ut(e) {
	let t;
	for (; t = e.sourceEvent;) e = t;
	return e;
}
//#endregion
//#region node_modules/d3-selection/src/pointer.js
function Wt(e, t) {
	if (e = Ut(e), t === void 0 && (t = e.currentTarget), t) {
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
var Gt = { passive: !1 }, Kt = {
	capture: !0,
	passive: !1
};
function qt(e) {
	e.stopImmediatePropagation();
}
function Jt(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region node_modules/d3-drag/src/nodrag.js
function Yt(e) {
	var t = e.document.documentElement, n = L(e).on("dragstart.drag", Jt, Kt);
	"onselectstart" in t ? n.on("selectstart.drag", Jt, Kt) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function Xt(e, t) {
	var n = e.document.documentElement, r = L(e).on("dragstart.drag", null);
	t && (r.on("click.drag", Jt, Kt), setTimeout(function() {
		r.on("click.drag", null);
	}, 0)), "onselectstart" in n ? r.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
//#endregion
//#region node_modules/d3-drag/src/constant.js
var Zt = (e) => () => e;
//#endregion
//#region node_modules/d3-drag/src/event.js
function Qt(e, { sourceEvent: t, subject: n, target: r, identifier: i, active: a, x: o, y: s, dx: c, dy: l, dispatch: u }) {
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
Qt.prototype.on = function() {
	var e = this._.on.apply(this._, arguments);
	return e === this._ ? this : e;
};
//#endregion
//#region node_modules/d3-drag/src/drag.js
function $t(e) {
	return !e.ctrlKey && !e.button;
}
function en() {
	return this.parentNode;
}
function tn(e, t) {
	return t ?? {
		x: e.x,
		y: e.y
	};
}
function nn() {
	return navigator.maxTouchPoints || "ontouchstart" in this;
}
function rn() {
	var e = $t, t = en, n = tn, r = nn, i = {}, a = C("start", "drag", "end"), o = 0, s, c, l, u, d = 0;
	function f(e) {
		e.on("mousedown.drag", p).filter(r).on("touchstart.drag", g).on("touchmove.drag", _, Gt).on("touchend.drag touchcancel.drag", v).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	}
	function p(n, r) {
		if (!(u || !e.call(this, n, r))) {
			var i = y(this, t.call(this, n, r), n, r, "mouse");
			i && (L(n.view).on("mousemove.drag", m, Kt).on("mouseup.drag", h, Kt), Yt(n.view), qt(n), l = !1, s = n.clientX, c = n.clientY, i("start", n));
		}
	}
	function m(e) {
		if (Jt(e), !l) {
			var t = e.clientX - s, n = e.clientY - c;
			l = t * t + n * n > d;
		}
		i.mouse("drag", e);
	}
	function h(e) {
		L(e.view).on("mousemove.drag mouseup.drag", null), Xt(e.view, l), Jt(e), i.mouse("end", e);
	}
	function g(n, r) {
		if (e.call(this, n, r)) {
			var i = n.changedTouches, a = t.call(this, n, r), o = i.length, s, c;
			for (s = 0; s < o; ++s) (c = y(this, a, n, r, i[s].identifier, i[s])) && (qt(n), c("start", n, i[s]));
		}
	}
	function _(e) {
		var t = e.changedTouches, n = t.length, r, a;
		for (r = 0; r < n; ++r) (a = i[t[r].identifier]) && (Jt(e), a("drag", e, t[r]));
	}
	function v(e) {
		var t = e.changedTouches, n = t.length, r, a;
		for (u && clearTimeout(u), u = setTimeout(function() {
			u = null;
		}, 500), r = 0; r < n; ++r) (a = i[t[r].identifier]) && (qt(e), a("end", e, t[r]));
	}
	function y(e, t, r, s, c, l) {
		var u = a.copy(), d = Wt(l || r, t), p, m, h;
		if ((h = n.call(e, new Qt("beforestart", {
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
					d = Wt(l || a, t), _ = o;
					break;
			}
			u.call(r, e, new Qt(r, {
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
		return arguments.length ? (e = typeof t == "function" ? t : Zt(!!t), f) : e;
	}, f.container = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : Zt(e), f) : t;
	}, f.subject = function(e) {
		return arguments.length ? (n = typeof e == "function" ? e : Zt(e), f) : n;
	}, f.touchable = function(e) {
		return arguments.length ? (r = typeof e == "function" ? e : Zt(!!e), f) : r;
	}, f.on = function() {
		var e = a.on.apply(a, arguments);
		return e === a ? f : e;
	}, f.clickDistance = function(e) {
		return arguments.length ? (d = (e = +e) * e, f) : Math.sqrt(d);
	}, f;
}
//#endregion
//#region node_modules/d3-color/src/define.js
function an(e, t, n) {
	e.prototype = t.prototype = n, n.constructor = e;
}
function on(e, t) {
	var n = Object.create(e.prototype);
	for (var r in t) n[r] = t[r];
	return n;
}
//#endregion
//#region node_modules/d3-color/src/color.js
function sn() {}
var cn = .7, ln = 1 / cn, un = "\\s*([+-]?\\d+)\\s*", dn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", fn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", pn = /^#([0-9a-f]{3,8})$/, mn = RegExp(`^rgb\\(${un},${un},${un}\\)$`), hn = RegExp(`^rgb\\(${fn},${fn},${fn}\\)$`), gn = RegExp(`^rgba\\(${un},${un},${un},${dn}\\)$`), _n = RegExp(`^rgba\\(${fn},${fn},${fn},${dn}\\)$`), vn = RegExp(`^hsl\\(${dn},${fn},${fn}\\)$`), yn = RegExp(`^hsla\\(${dn},${fn},${fn},${dn}\\)$`), bn = {
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
an(sn, Tn, {
	copy(e) {
		return Object.assign(new this.constructor(), this, e);
	},
	displayable() {
		return this.rgb().displayable();
	},
	hex: xn,
	formatHex: xn,
	formatHex8: Sn,
	formatHsl: Cn,
	formatRgb: wn,
	toString: wn
});
function xn() {
	return this.rgb().formatHex();
}
function Sn() {
	return this.rgb().formatHex8();
}
function Cn() {
	return Rn(this).formatHsl();
}
function wn() {
	return this.rgb().formatRgb();
}
function Tn(e) {
	var t, n;
	return e = (e + "").trim().toLowerCase(), (t = pn.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? En(t) : n === 3 ? new An(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? Dn(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? Dn(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = mn.exec(e)) ? new An(t[1], t[2], t[3], 1) : (t = hn.exec(e)) ? new An(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = gn.exec(e)) ? Dn(t[1], t[2], t[3], t[4]) : (t = _n.exec(e)) ? Dn(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = vn.exec(e)) ? Ln(t[1], t[2] / 100, t[3] / 100, 1) : (t = yn.exec(e)) ? Ln(t[1], t[2] / 100, t[3] / 100, t[4]) : bn.hasOwnProperty(e) ? En(bn[e]) : e === "transparent" ? new An(NaN, NaN, NaN, 0) : null;
}
function En(e) {
	return new An(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function Dn(e, t, n, r) {
	return r <= 0 && (e = t = n = NaN), new An(e, t, n, r);
}
function On(e) {
	return e instanceof sn || (e = Tn(e)), e ? (e = e.rgb(), new An(e.r, e.g, e.b, e.opacity)) : new An();
}
function kn(e, t, n, r) {
	return arguments.length === 1 ? On(e) : new An(e, t, n, r ?? 1);
}
function An(e, t, n, r) {
	this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
an(An, kn, on(sn, {
	brighter(e) {
		return e = e == null ? ln : ln ** +e, new An(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? cn : cn ** +e, new An(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	rgb() {
		return this;
	},
	clamp() {
		return new An(Fn(this.r), Fn(this.g), Fn(this.b), Pn(this.opacity));
	},
	displayable() {
		return -.5 <= this.r && this.r < 255.5 && -.5 <= this.g && this.g < 255.5 && -.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
	},
	hex: jn,
	formatHex: jn,
	formatHex8: Mn,
	formatRgb: Nn,
	toString: Nn
}));
function jn() {
	return `#${In(this.r)}${In(this.g)}${In(this.b)}`;
}
function Mn() {
	return `#${In(this.r)}${In(this.g)}${In(this.b)}${In((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Nn() {
	let e = Pn(this.opacity);
	return `${e === 1 ? "rgb(" : "rgba("}${Fn(this.r)}, ${Fn(this.g)}, ${Fn(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function Pn(e) {
	return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function Fn(e) {
	return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function In(e) {
	return e = Fn(e), (e < 16 ? "0" : "") + e.toString(16);
}
function Ln(e, t, n, r) {
	return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new Bn(e, t, n, r);
}
function Rn(e) {
	if (e instanceof Bn) return new Bn(e.h, e.s, e.l, e.opacity);
	if (e instanceof sn || (e = Tn(e)), !e) return new Bn();
	if (e instanceof Bn) return e;
	e = e.rgb();
	var t = e.r / 255, n = e.g / 255, r = e.b / 255, i = Math.min(t, n, r), a = Math.max(t, n, r), o = NaN, s = a - i, c = (a + i) / 2;
	return s ? (o = t === a ? (n - r) / s + (n < r) * 6 : n === a ? (r - t) / s + 2 : (t - n) / s + 4, s /= c < .5 ? a + i : 2 - a - i, o *= 60) : s = c > 0 && c < 1 ? 0 : o, new Bn(o, s, c, e.opacity);
}
function zn(e, t, n, r) {
	return arguments.length === 1 ? Rn(e) : new Bn(e, t, n, r ?? 1);
}
function Bn(e, t, n, r) {
	this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
an(Bn, zn, on(sn, {
	brighter(e) {
		return e = e == null ? ln : ln ** +e, new Bn(this.h, this.s, this.l * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? cn : cn ** +e, new Bn(this.h, this.s, this.l * e, this.opacity);
	},
	rgb() {
		var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < .5 ? n : 1 - n) * t, i = 2 * n - r;
		return new An(Un(e >= 240 ? e - 240 : e + 120, i, r), Un(e, i, r), Un(e < 120 ? e + 240 : e - 120, i, r), this.opacity);
	},
	clamp() {
		return new Bn(Vn(this.h), Hn(this.s), Hn(this.l), Pn(this.opacity));
	},
	displayable() {
		return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
	},
	formatHsl() {
		let e = Pn(this.opacity);
		return `${e === 1 ? "hsl(" : "hsla("}${Vn(this.h)}, ${Hn(this.s) * 100}%, ${Hn(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
	}
}));
function Vn(e) {
	return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function Hn(e) {
	return Math.max(0, Math.min(1, e || 0));
}
function Un(e, t, n) {
	return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
//#endregion
//#region node_modules/d3-interpolate/src/constant.js
var Wn = (e) => () => e;
//#endregion
//#region node_modules/d3-interpolate/src/color.js
function Gn(e, t) {
	return function(n) {
		return e + n * t;
	};
}
function Kn(e, t, n) {
	return e **= +n, t = t ** +n - e, n = 1 / n, function(r) {
		return (e + r * t) ** +n;
	};
}
function qn(e) {
	return (e = +e) == 1 ? Jn : function(t, n) {
		return n - t ? Kn(t, n, e) : Wn(isNaN(t) ? n : t);
	};
}
function Jn(e, t) {
	var n = t - e;
	return n ? Gn(e, n) : Wn(isNaN(e) ? t : e);
}
//#endregion
//#region node_modules/d3-interpolate/src/rgb.js
var Yn = (function e(t) {
	var n = qn(t);
	function r(e, t) {
		var r = n((e = kn(e)).r, (t = kn(t)).r), i = n(e.g, t.g), a = n(e.b, t.b), o = Jn(e.opacity, t.opacity);
		return function(t) {
			return e.r = r(t), e.g = i(t), e.b = a(t), e.opacity = o(t), e + "";
		};
	}
	return r.gamma = e, r;
})(1);
//#endregion
//#region node_modules/d3-interpolate/src/number.js
function Xn(e, t) {
	return e = +e, t = +t, function(n) {
		return e * (1 - n) + t * n;
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/string.js
var Zn = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Qn = new RegExp(Zn.source, "g");
function $n(e) {
	return function() {
		return e;
	};
}
function er(e) {
	return function(t) {
		return e(t) + "";
	};
}
function tr(e, t) {
	var n = Zn.lastIndex = Qn.lastIndex = 0, r, i, a, o = -1, s = [], c = [];
	for (e += "", t += ""; (r = Zn.exec(e)) && (i = Qn.exec(t));) (a = i.index) > n && (a = t.slice(n, a), s[o] ? s[o] += a : s[++o] = a), (r = r[0]) === (i = i[0]) ? s[o] ? s[o] += i : s[++o] = i : (s[++o] = null, c.push({
		i: o,
		x: Xn(r, i)
	})), n = Qn.lastIndex;
	return n < t.length && (a = t.slice(n), s[o] ? s[o] += a : s[++o] = a), s.length < 2 ? c[0] ? er(c[0].x) : $n(t) : (t = c.length, function(e) {
		for (var n = 0, r; n < t; ++n) s[(r = c[n]).i] = r.x(e);
		return s.join("");
	});
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/decompose.js
var nr = 180 / Math.PI, rr = {
	translateX: 0,
	translateY: 0,
	rotate: 0,
	skewX: 0,
	scaleX: 1,
	scaleY: 1
};
function ir(e, t, n, r, i, a) {
	var o, s, c;
	return (o = Math.sqrt(e * e + t * t)) && (e /= o, t /= o), (c = e * n + t * r) && (n -= e * c, r -= t * c), (s = Math.sqrt(n * n + r * r)) && (n /= s, r /= s, c /= s), e * r < t * n && (e = -e, t = -t, c = -c, o = -o), {
		translateX: i,
		translateY: a,
		rotate: Math.atan2(t, e) * nr,
		skewX: Math.atan(c) * nr,
		scaleX: o,
		scaleY: s
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/parse.js
var ar;
function or(e) {
	let t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
	return t.isIdentity ? rr : ir(t.a, t.b, t.c, t.d, t.e, t.f);
}
function sr(e) {
	return e == null || (ar ||= document.createElementNS("http://www.w3.org/2000/svg", "g"), ar.setAttribute("transform", e), !(e = ar.transform.baseVal.consolidate())) ? rr : (e = e.matrix, ir(e.a, e.b, e.c, e.d, e.e, e.f));
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/index.js
function cr(e, t, n, r) {
	function i(e) {
		return e.length ? e.pop() + " " : "";
	}
	function a(e, r, i, a, o, s) {
		if (e !== i || r !== a) {
			var c = o.push("translate(", null, t, null, n);
			s.push({
				i: c - 4,
				x: Xn(e, i)
			}, {
				i: c - 2,
				x: Xn(r, a)
			});
		} else (i || a) && o.push("translate(" + i + t + a + n);
	}
	function o(e, t, n, a) {
		e === t ? t && n.push(i(n) + "rotate(" + t + r) : (e - t > 180 ? t += 360 : t - e > 180 && (e += 360), a.push({
			i: n.push(i(n) + "rotate(", null, r) - 2,
			x: Xn(e, t)
		}));
	}
	function s(e, t, n, a) {
		e === t ? t && n.push(i(n) + "skewX(" + t + r) : a.push({
			i: n.push(i(n) + "skewX(", null, r) - 2,
			x: Xn(e, t)
		});
	}
	function c(e, t, n, r, a, o) {
		if (e !== n || t !== r) {
			var s = a.push(i(a) + "scale(", null, ",", null, ")");
			o.push({
				i: s - 4,
				x: Xn(e, n)
			}, {
				i: s - 2,
				x: Xn(t, r)
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
var lr = cr(or, "px, ", "px)", "deg)"), ur = cr(sr, ", ", ")", ")"), dr = 1e-12;
function fr(e) {
	return ((e = Math.exp(e)) + 1 / e) / 2;
}
function pr(e) {
	return ((e = Math.exp(e)) - 1 / e) / 2;
}
function mr(e) {
	return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
var hr = (function e(t, n, r) {
	function i(e, i) {
		var a = e[0], o = e[1], s = e[2], c = i[0], l = i[1], u = i[2], d = c - a, f = l - o, p = d * d + f * f, m, h;
		if (p < dr) h = Math.log(u / s) / t, m = function(e) {
			return [
				a + e * d,
				o + e * f,
				s * Math.exp(t * e * h)
			];
		};
		else {
			var g = Math.sqrt(p), _ = (u * u - s * s + r * p) / (2 * s * n * g), v = (u * u - s * s - r * p) / (2 * u * n * g), y = Math.log(Math.sqrt(_ * _ + 1) - _);
			h = (Math.log(Math.sqrt(v * v + 1) - v) - y) / t, m = function(e) {
				var r = e * h, i = fr(y), c = s / (n * g) * (i * mr(t * r + y) - pr(y));
				return [
					a + c * d,
					o + c * f,
					s * i / fr(t * r + y)
				];
			};
		}
		return m.duration = h * 1e3 * t / Math.SQRT2, m;
	}
	return i.rho = function(t) {
		var n = Math.max(.001, +t), r = n * n;
		return e(n, r, r * r);
	}, i;
})(Math.SQRT2, 2, 4), gr = 0, _r = 0, vr = 0, yr = 1e3, br, xr, Sr = 0, Cr = 0, wr = 0, Tr = typeof performance == "object" && performance.now ? performance : Date, Er = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
	setTimeout(e, 17);
};
function Dr() {
	return Cr ||= (Er(Or), Tr.now() + wr);
}
function Or() {
	Cr = 0;
}
function kr() {
	this._call = this._time = this._next = null;
}
kr.prototype = Ar.prototype = {
	constructor: kr,
	restart: function(e, t, n) {
		if (typeof e != "function") throw TypeError("callback is not a function");
		n = (n == null ? Dr() : +n) + (t == null ? 0 : +t), !this._next && xr !== this && (xr ? xr._next = this : br = this, xr = this), this._call = e, this._time = n, Fr();
	},
	stop: function() {
		this._call && (this._call = null, this._time = Infinity, Fr());
	}
};
function Ar(e, t, n) {
	var r = new kr();
	return r.restart(e, t, n), r;
}
function jr() {
	Dr(), ++gr;
	for (var e = br, t; e;) (t = Cr - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
	--gr;
}
function Mr() {
	Cr = (Sr = Tr.now()) + wr, gr = _r = 0;
	try {
		jr();
	} finally {
		gr = 0, Pr(), Cr = 0;
	}
}
function Nr() {
	var e = Tr.now(), t = e - Sr;
	t > yr && (wr -= t, Sr = e);
}
function Pr() {
	for (var e, t = br, n, r = Infinity; t;) t._call ? (r > t._time && (r = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : br = n);
	xr = e, Fr(r);
}
function Fr(e) {
	gr || (_r &&= clearTimeout(_r), e - Cr > 24 ? (e < Infinity && (_r = setTimeout(Mr, e - Tr.now() - wr)), vr &&= clearInterval(vr)) : (vr ||= (Sr = Tr.now(), setInterval(Nr, yr)), gr = 1, Er(Mr)));
}
//#endregion
//#region node_modules/d3-timer/src/timeout.js
function Ir(e, t, n) {
	var r = new kr();
	return t = t == null ? 0 : +t, r.restart((n) => {
		r.stop(), e(n + t);
	}, t, n), r;
}
//#endregion
//#region node_modules/d3-transition/src/transition/schedule.js
var Lr = C("start", "end", "cancel", "interrupt"), Rr = [];
function zr(e, t, n, r, i, a) {
	var o = e.__transition;
	if (!o) e.__transition = {};
	else if (n in o) return;
	Ur(e, n, {
		name: t,
		index: r,
		group: i,
		on: Lr,
		tween: Rr,
		time: a.time,
		delay: a.delay,
		duration: a.duration,
		ease: a.ease,
		timer: null,
		state: 0
	});
}
function Br(e, t) {
	var n = Hr(e, t);
	if (n.state > 0) throw Error("too late; already scheduled");
	return n;
}
function Vr(e, t) {
	var n = Hr(e, t);
	if (n.state > 3) throw Error("too late; already running");
	return n;
}
function Hr(e, t) {
	var n = e.__transition;
	if (!n || !(n = n[t])) throw Error("transition not found");
	return n;
}
function Ur(e, t, n) {
	var r = e.__transition, i;
	r[t] = n, n.timer = Ar(a, 0, n.time);
	function a(e) {
		n.state = 1, n.timer.restart(o, n.delay, n.time), n.delay <= e && o(e - n.delay);
	}
	function o(a) {
		var l, u, d, f;
		if (n.state !== 1) return c();
		for (l in r) if (f = r[l], f.name === n.name) {
			if (f.state === 3) return Ir(o);
			f.state === 4 ? (f.state = 6, f.timer.stop(), f.on.call("interrupt", e, e.__data__, f.index, f.group), delete r[l]) : +l < t && (f.state = 6, f.timer.stop(), f.on.call("cancel", e, e.__data__, f.index, f.group), delete r[l]);
		}
		if (Ir(function() {
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
function Wr(e, t) {
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
function Gr(e) {
	return this.each(function() {
		Wr(this, e);
	});
}
//#endregion
//#region node_modules/d3-transition/src/transition/tween.js
function Kr(e, t) {
	var n, r;
	return function() {
		var i = Vr(this, e), a = i.tween;
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
function qr(e, t, n) {
	var r, i;
	if (typeof n != "function") throw Error();
	return function() {
		var a = Vr(this, e), o = a.tween;
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
function Jr(e, t) {
	var n = this._id;
	if (e += "", arguments.length < 2) {
		for (var r = Hr(this.node(), n).tween, i = 0, a = r.length, o; i < a; ++i) if ((o = r[i]).name === e) return o.value;
		return null;
	}
	return this.each((t == null ? Kr : qr)(n, e, t));
}
function Yr(e, t, n) {
	var r = e._id;
	return e.each(function() {
		var e = Vr(this, r);
		(e.value ||= {})[t] = n.apply(this, arguments);
	}), function(e) {
		return Hr(e, r).value[t];
	};
}
//#endregion
//#region node_modules/d3-transition/src/transition/interpolate.js
function Xr(e, t) {
	var n;
	return (typeof t == "number" ? Xn : t instanceof Tn ? Yn : (n = Tn(t)) ? (t = n, Yn) : tr)(e, t);
}
//#endregion
//#region node_modules/d3-transition/src/transition/attr.js
function Zr(e) {
	return function() {
		this.removeAttribute(e);
	};
}
function Qr(e) {
	return function() {
		this.removeAttributeNS(e.space, e.local);
	};
}
function $r(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = this.getAttribute(e);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function ei(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = this.getAttributeNS(e.space, e.local);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function ti(e, t, n) {
	var r, i, a;
	return function() {
		var o, s = n(this), c;
		return s == null ? void this.removeAttribute(e) : (o = this.getAttribute(e), c = s + "", o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s)));
	};
}
function ni(e, t, n) {
	var r, i, a;
	return function() {
		var o, s = n(this), c;
		return s == null ? void this.removeAttributeNS(e.space, e.local) : (o = this.getAttributeNS(e.space, e.local), c = s + "", o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s)));
	};
}
function ri(e, t) {
	var n = k(e), r = n === "transform" ? ur : Xr;
	return this.attrTween(e, typeof t == "function" ? (n.local ? ni : ti)(n, r, Yr(this, "attr." + e, t)) : t == null ? (n.local ? Qr : Zr)(n) : (n.local ? ei : $r)(n, r, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/attrTween.js
function ii(e, t) {
	return function(n) {
		this.setAttribute(e, t.call(this, n));
	};
}
function ai(e, t) {
	return function(n) {
		this.setAttributeNS(e.space, e.local, t.call(this, n));
	};
}
function oi(e, t) {
	var n, r;
	function i() {
		var i = t.apply(this, arguments);
		return i !== r && (n = (r = i) && ai(e, i)), n;
	}
	return i._value = t, i;
}
function si(e, t) {
	var n, r;
	function i() {
		var i = t.apply(this, arguments);
		return i !== r && (n = (r = i) && ii(e, i)), n;
	}
	return i._value = t, i;
}
function ci(e, t) {
	var n = "attr." + e;
	if (arguments.length < 2) return (n = this.tween(n)) && n._value;
	if (t == null) return this.tween(n, null);
	if (typeof t != "function") throw Error();
	var r = k(e);
	return this.tween(n, (r.local ? oi : si)(r, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/delay.js
function li(e, t) {
	return function() {
		Br(this, e).delay = +t.apply(this, arguments);
	};
}
function ui(e, t) {
	return t = +t, function() {
		Br(this, e).delay = t;
	};
}
function di(e) {
	var t = this._id;
	return arguments.length ? this.each((typeof e == "function" ? li : ui)(t, e)) : Hr(this.node(), t).delay;
}
//#endregion
//#region node_modules/d3-transition/src/transition/duration.js
function fi(e, t) {
	return function() {
		Vr(this, e).duration = +t.apply(this, arguments);
	};
}
function pi(e, t) {
	return t = +t, function() {
		Vr(this, e).duration = t;
	};
}
function mi(e) {
	var t = this._id;
	return arguments.length ? this.each((typeof e == "function" ? fi : pi)(t, e)) : Hr(this.node(), t).duration;
}
//#endregion
//#region node_modules/d3-transition/src/transition/ease.js
function hi(e, t) {
	if (typeof t != "function") throw Error();
	return function() {
		Vr(this, e).ease = t;
	};
}
function gi(e) {
	var t = this._id;
	return arguments.length ? this.each(hi(t, e)) : Hr(this.node(), t).ease;
}
//#endregion
//#region node_modules/d3-transition/src/transition/easeVarying.js
function _i(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		if (typeof n != "function") throw Error();
		Vr(this, e).ease = n;
	};
}
function vi(e) {
	if (typeof e != "function") throw Error();
	return this.each(_i(this._id, e));
}
//#endregion
//#region node_modules/d3-transition/src/transition/filter.js
function yi(e) {
	typeof e != "function" && (e = ce(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = [], c, l = 0; l < o; ++l) (c = a[l]) && e.call(c, c.__data__, l, a) && s.push(c);
	return new qi(r, this._parents, this._name, this._id);
}
//#endregion
//#region node_modules/d3-transition/src/transition/merge.js
function bi(e) {
	if (e._id !== this._id) throw Error();
	for (var t = this._groups, n = e._groups, r = t.length, i = n.length, a = Math.min(r, i), o = Array(r), s = 0; s < a; ++s) for (var c = t[s], l = n[s], u = c.length, d = o[s] = Array(u), f, p = 0; p < u; ++p) (f = c[p] || l[p]) && (d[p] = f);
	for (; s < r; ++s) o[s] = t[s];
	return new qi(o, this._parents, this._name, this._id);
}
//#endregion
//#region node_modules/d3-transition/src/transition/on.js
function xi(e) {
	return (e + "").trim().split(/^|\s+/).every(function(e) {
		var t = e.indexOf(".");
		return t >= 0 && (e = e.slice(0, t)), !e || e === "start";
	});
}
function Si(e, t, n) {
	var r, i, a = xi(t) ? Br : Vr;
	return function() {
		var o = a(this, e), s = o.on;
		s !== r && (i = (r = s).copy()).on(t, n), o.on = i;
	};
}
function Ci(e, t) {
	var n = this._id;
	return arguments.length < 2 ? Hr(this.node(), n).on.on(e) : this.each(Si(n, e, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/remove.js
function wi(e) {
	return function() {
		var t = this.parentNode;
		for (var n in this.__transition) if (+n !== e) return;
		t && t.removeChild(this);
	};
}
function Ti() {
	return this.on("end.remove", wi(this._id));
}
//#endregion
//#region node_modules/d3-transition/src/transition/select.js
function Ei(e) {
	var t = this._name, n = this._id;
	typeof e != "function" && (e = ie(e));
	for (var r = this._groups, i = r.length, a = Array(i), o = 0; o < i; ++o) for (var s = r[o], c = s.length, l = a[o] = Array(c), u, d, f = 0; f < c; ++f) (u = s[f]) && (d = e.call(u, u.__data__, f, s)) && ("__data__" in u && (d.__data__ = u.__data__), l[f] = d, zr(l[f], t, n, f, l, Hr(u, n)));
	return new qi(a, this._parents, t, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/selectAll.js
function Di(e) {
	var t = this._name, n = this._id;
	typeof e != "function" && (e = ae(e));
	for (var r = this._groups, i = r.length, a = [], o = [], s = 0; s < i; ++s) for (var c = r[s], l = c.length, u, d = 0; d < l; ++d) if (u = c[d]) {
		for (var f = e.call(u, u.__data__, d, c), p, m = Hr(u, n), h = 0, g = f.length; h < g; ++h) (p = f[h]) && zr(p, t, n, h, f, m);
		a.push(f), o.push(u);
	}
	return new qi(a, o, t, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/selection.js
var Oi = Vt.prototype.constructor;
function ki() {
	return new Oi(this._groups, this._parents);
}
//#endregion
//#region node_modules/d3-transition/src/transition/style.js
function Ai(e, t) {
	var n, r, i;
	return function() {
		var a = Ye(this, e), o = (this.style.removeProperty(e), Ye(this, e));
		return a === o ? null : a === n && o === r ? i : i = t(n = a, r = o);
	};
}
function ji(e) {
	return function() {
		this.style.removeProperty(e);
	};
}
function Mi(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = Ye(this, e);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function Ni(e, t, n) {
	var r, i, a;
	return function() {
		var o = Ye(this, e), s = n(this), c = s + "";
		return s ?? (c = s = (this.style.removeProperty(e), Ye(this, e))), o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s));
	};
}
function Pi(e, t) {
	var n, r, i, a = "style." + t, o = "end." + a, s;
	return function() {
		var c = Vr(this, e), l = c.on, u = c.value[a] == null ? s ||= ji(t) : void 0;
		(l !== n || i !== u) && (r = (n = l).copy()).on(o, i = u), c.on = r;
	};
}
function Fi(e, t, n) {
	var r = (e += "") == "transform" ? lr : Xr;
	return t == null ? this.styleTween(e, Ai(e, r)).on("end.style." + e, ji(e)) : typeof t == "function" ? this.styleTween(e, Ni(e, r, Yr(this, "style." + e, t))).each(Pi(this._id, e)) : this.styleTween(e, Mi(e, r, t), n).on("end.style." + e, null);
}
//#endregion
//#region node_modules/d3-transition/src/transition/styleTween.js
function R(e, t, n) {
	return function(r) {
		this.style.setProperty(e, t.call(this, r), n);
	};
}
function Ii(e, t, n) {
	var r, i;
	function a() {
		var a = t.apply(this, arguments);
		return a !== i && (r = (i = a) && R(e, a, n)), r;
	}
	return a._value = t, a;
}
function Li(e, t, n) {
	var r = "style." + (e += "");
	if (arguments.length < 2) return (r = this.tween(r)) && r._value;
	if (t == null) return this.tween(r, null);
	if (typeof t != "function") throw Error();
	return this.tween(r, Ii(e, t, n ?? ""));
}
//#endregion
//#region node_modules/d3-transition/src/transition/text.js
function Ri(e) {
	return function() {
		this.textContent = e;
	};
}
function zi(e) {
	return function() {
		var t = e(this);
		this.textContent = t ?? "";
	};
}
function Bi(e) {
	return this.tween("text", typeof e == "function" ? zi(Yr(this, "text", e)) : Ri(e == null ? "" : e + ""));
}
//#endregion
//#region node_modules/d3-transition/src/transition/textTween.js
function Vi(e) {
	return function(t) {
		this.textContent = e.call(this, t);
	};
}
function Hi(e) {
	var t, n;
	function r() {
		var r = e.apply(this, arguments);
		return r !== n && (t = (n = r) && Vi(r)), t;
	}
	return r._value = e, r;
}
function Ui(e) {
	var t = "text";
	if (arguments.length < 1) return (t = this.tween(t)) && t._value;
	if (e == null) return this.tween(t, null);
	if (typeof e != "function") throw Error();
	return this.tween(t, Hi(e));
}
//#endregion
//#region node_modules/d3-transition/src/transition/transition.js
function Wi() {
	for (var e = this._name, t = this._id, n = Yi(), r = this._groups, i = r.length, a = 0; a < i; ++a) for (var o = r[a], s = o.length, c, l = 0; l < s; ++l) if (c = o[l]) {
		var u = Hr(c, t);
		zr(c, e, n, l, o, {
			time: u.time + u.delay + u.duration,
			delay: 0,
			duration: u.duration,
			ease: u.ease
		});
	}
	return new qi(r, this._parents, e, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/end.js
function Gi() {
	var e, t, n = this, r = n._id, i = n.size();
	return new Promise(function(a, o) {
		var s = { value: o }, c = { value: function() {
			--i === 0 && a();
		} };
		n.each(function() {
			var n = Vr(this, r), i = n.on;
			i !== e && (t = (e = i).copy(), t._.cancel.push(s), t._.interrupt.push(s), t._.end.push(c)), n.on = t;
		}), i === 0 && a();
	});
}
//#endregion
//#region node_modules/d3-transition/src/transition/index.js
var Ki = 0;
function qi(e, t, n, r) {
	this._groups = e, this._parents = t, this._name = n, this._id = r;
}
function Ji(e) {
	return Vt().transition(e);
}
function Yi() {
	return ++Ki;
}
var Xi = Vt.prototype;
qi.prototype = Ji.prototype = {
	constructor: qi,
	select: Ei,
	selectAll: Di,
	selectChild: Xi.selectChild,
	selectChildren: Xi.selectChildren,
	filter: yi,
	merge: bi,
	selection: ki,
	transition: Wi,
	call: Xi.call,
	nodes: Xi.nodes,
	node: Xi.node,
	size: Xi.size,
	empty: Xi.empty,
	each: Xi.each,
	on: Ci,
	attr: ri,
	attrTween: ci,
	style: Fi,
	styleTween: Li,
	text: Bi,
	textTween: Ui,
	remove: Ti,
	tween: Jr,
	delay: di,
	duration: mi,
	ease: gi,
	easeVarying: vi,
	end: Gi,
	[Symbol.iterator]: Xi[Symbol.iterator]
};
//#endregion
//#region node_modules/d3-ease/src/cubic.js
function Zi(e) {
	return --e * e * e + 1;
}
function Qi(e) {
	return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
//#endregion
//#region node_modules/d3-transition/src/selection/transition.js
var $i = {
	time: null,
	delay: 0,
	duration: 250,
	ease: Qi
};
function ea(e, t) {
	for (var n; !(n = e.__transition) || !(n = n[t]);) if (!(e = e.parentNode)) throw Error(`transition ${t} not found`);
	return n;
}
function ta(e) {
	var t, n;
	e instanceof qi ? (t = e._id, e = e._name) : (t = Yi(), (n = $i).time = Dr(), e = e == null ? null : e + "");
	for (var r = this._groups, i = r.length, a = 0; a < i; ++a) for (var o = r[a], s = o.length, c, l = 0; l < s; ++l) (c = o[l]) && zr(c, e, t, l, o, n || ea(c, t));
	return new qi(r, this._parents, e, t);
}
Vt.prototype.interrupt = Gr, Vt.prototype.transition = ta;
//#endregion
//#region node_modules/d3-brush/src/brush.js
var { abs: na, max: ra, min: ia } = Math;
["w", "e"].map(aa), ["n", "s"].map(aa), [
	"n",
	"w",
	"e",
	"s",
	"nw",
	"ne",
	"sw",
	"se"
].map(aa);
function aa(e) {
	return { type: e };
}
//#endregion
//#region node_modules/d3-path/src/path.js
var oa = Math.PI, sa = 2 * oa, ca = 1e-6, la = sa - ca;
function ua(e) {
	this._ += e[0];
	for (let t = 1, n = e.length; t < n; ++t) this._ += arguments[t] + e[t];
}
function da(e) {
	let t = Math.floor(e);
	if (!(t >= 0)) throw Error(`invalid digits: ${e}`);
	if (t > 15) return ua;
	let n = 10 ** t;
	return function(e) {
		this._ += e[0];
		for (let t = 1, r = e.length; t < r; ++t) this._ += Math.round(arguments[t] * n) / n + e[t];
	};
}
var fa = class {
	constructor(e) {
		this._x0 = this._y0 = this._x1 = this._y1 = null, this._ = "", this._append = e == null ? ua : da(e);
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
		else if (d > ca) if (!(Math.abs(u * s - c * l) > ca) || !i) this._append`L${this._x1 = e},${this._y1 = t}`;
		else {
			let f = n - a, p = r - o, m = s * s + c * c, h = f * f + p * p, g = Math.sqrt(m), _ = Math.sqrt(d), v = i * Math.tan((oa - Math.acos((m + d - h) / (2 * g * _))) / 2), y = v / _, b = v / g;
			Math.abs(y - 1) > ca && this._append`L${e + y * l},${t + y * u}`, this._append`A${i},${i},0,0,${+(u * f > l * p)},${this._x1 = e + b * s},${this._y1 = t + b * c}`;
		}
	}
	arc(e, t, n, r, i, a) {
		if (e = +e, t = +t, n = +n, a = !!a, n < 0) throw Error(`negative radius: ${n}`);
		let o = n * Math.cos(r), s = n * Math.sin(r), c = e + o, l = t + s, u = 1 ^ a, d = a ? r - i : i - r;
		this._x1 === null ? this._append`M${c},${l}` : (Math.abs(this._x1 - c) > ca || Math.abs(this._y1 - l) > ca) && this._append`L${c},${l}`, n && (d < 0 && (d = d % sa + sa), d > la ? this._append`A${n},${n},0,1,${u},${e - o},${t - s}A${n},${n},0,1,${u},${this._x1 = c},${this._y1 = l}` : d > ca && this._append`A${n},${n},0,${+(d >= oa)},${u},${this._x1 = e + n * Math.cos(i)},${this._y1 = t + n * Math.sin(i)}`);
	}
	rect(e, t, n, r) {
		this._append`M${this._x0 = this._x1 = +e},${this._y0 = this._y1 = +t}h${n = +n}v${+r}h${-n}Z`;
	}
	toString() {
		return this._;
	}
};
function pa() {
	return new fa();
}
pa.prototype = fa.prototype;
//#endregion
//#region node_modules/d3-force/src/center.js
function ma(e, t) {
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
function ha(e) {
	let t = +this._x.call(null, e), n = +this._y.call(null, e);
	return ga(this.cover(t, n), t, n, e);
}
function ga(e, t, n, r) {
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
function _a(e) {
	var t, n, r = e.length, i, a, o = Array(r), s = Array(r), c = Infinity, l = Infinity, u = -Infinity, d = -Infinity;
	for (n = 0; n < r; ++n) isNaN(i = +this._x.call(null, t = e[n])) || isNaN(a = +this._y.call(null, t)) || (o[n] = i, s[n] = a, i < c && (c = i), i > u && (u = i), a < l && (l = a), a > d && (d = a));
	if (c > u || l > d) return this;
	for (this.cover(c, l).cover(u, d), n = 0; n < r; ++n) ga(this, o[n], s[n], e[n]);
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/cover.js
function va(e, t) {
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
function ya() {
	var e = [];
	return this.visit(function(t) {
		if (!t.length) do
			e.push(t.data);
		while (t = t.next);
	}), e;
}
//#endregion
//#region node_modules/d3-quadtree/src/extent.js
function ba(e) {
	return arguments.length ? this.cover(+e[0][0], +e[0][1]).cover(+e[1][0], +e[1][1]) : isNaN(this._x0) ? void 0 : [[this._x0, this._y0], [this._x1, this._y1]];
}
//#endregion
//#region node_modules/d3-quadtree/src/quad.js
function xa(e, t, n, r, i) {
	this.node = e, this.x0 = t, this.y0 = n, this.x1 = r, this.y1 = i;
}
//#endregion
//#region node_modules/d3-quadtree/src/find.js
function Sa(e, t, n) {
	var r, i = this._x0, a = this._y0, o, s, c, l, u = this._x1, d = this._y1, f = [], p = this._root, m, h;
	for (p && f.push(new xa(p, i, a, u, d)), n == null ? n = Infinity : (i = e - n, a = t - n, u = e + n, d = t + n, n *= n); m = f.pop();) if (!(!(p = m.node) || (o = m.x0) > u || (s = m.y0) > d || (c = m.x1) < i || (l = m.y1) < a)) if (p.length) {
		var g = (o + c) / 2, _ = (s + l) / 2;
		f.push(new xa(p[3], g, _, c, l), new xa(p[2], o, _, g, l), new xa(p[1], g, s, c, _), new xa(p[0], o, s, g, _)), (h = (t >= _) << 1 | e >= g) && (m = f[f.length - 1], f[f.length - 1] = f[f.length - 1 - h], f[f.length - 1 - h] = m);
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
function Ca(e) {
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
function wa(e) {
	for (var t = 0, n = e.length; t < n; ++t) this.remove(e[t]);
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/root.js
function Ta() {
	return this._root;
}
//#endregion
//#region node_modules/d3-quadtree/src/size.js
function Ea() {
	var e = 0;
	return this.visit(function(t) {
		if (!t.length) do
			++e;
		while (t = t.next);
	}), e;
}
//#endregion
//#region node_modules/d3-quadtree/src/visit.js
function Da(e) {
	var t = [], n, r = this._root, i, a, o, s, c;
	for (r && t.push(new xa(r, this._x0, this._y0, this._x1, this._y1)); n = t.pop();) if (!e(r = n.node, a = n.x0, o = n.y0, s = n.x1, c = n.y1) && r.length) {
		var l = (a + s) / 2, u = (o + c) / 2;
		(i = r[3]) && t.push(new xa(i, l, u, s, c)), (i = r[2]) && t.push(new xa(i, a, u, l, c)), (i = r[1]) && t.push(new xa(i, l, o, s, u)), (i = r[0]) && t.push(new xa(i, a, o, l, u));
	}
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/visitAfter.js
function Oa(e) {
	var t = [], n = [], r;
	for (this._root && t.push(new xa(this._root, this._x0, this._y0, this._x1, this._y1)); r = t.pop();) {
		var i = r.node;
		if (i.length) {
			var a, o = r.x0, s = r.y0, c = r.x1, l = r.y1, u = (o + c) / 2, d = (s + l) / 2;
			(a = i[0]) && t.push(new xa(a, o, s, u, d)), (a = i[1]) && t.push(new xa(a, u, s, c, d)), (a = i[2]) && t.push(new xa(a, o, d, u, l)), (a = i[3]) && t.push(new xa(a, u, d, c, l));
		}
		n.push(r);
	}
	for (; r = n.pop();) e(r.node, r.x0, r.y0, r.x1, r.y1);
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/x.js
function ka(e) {
	return e[0];
}
function Aa(e) {
	return arguments.length ? (this._x = e, this) : this._x;
}
//#endregion
//#region node_modules/d3-quadtree/src/y.js
function ja(e) {
	return e[1];
}
function Ma(e) {
	return arguments.length ? (this._y = e, this) : this._y;
}
//#endregion
//#region node_modules/d3-quadtree/src/quadtree.js
function Na(e, t, n) {
	var r = new Pa(t ?? ka, n ?? ja, NaN, NaN, NaN, NaN);
	return e == null ? r : r.addAll(e);
}
function Pa(e, t, n, r, i, a) {
	this._x = e, this._y = t, this._x0 = n, this._y0 = r, this._x1 = i, this._y1 = a, this._root = void 0;
}
function Fa(e) {
	for (var t = { data: e.data }, n = t; e = e.next;) n = n.next = { data: e.data };
	return t;
}
var Ia = Na.prototype = Pa.prototype;
Ia.copy = function() {
	var e = new Pa(this._x, this._y, this._x0, this._y0, this._x1, this._y1), t = this._root, n, r;
	if (!t) return e;
	if (!t.length) return e._root = Fa(t), e;
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
	}) : t.target[i] = Fa(r));
	return e;
}, Ia.add = ha, Ia.addAll = _a, Ia.cover = va, Ia.data = ya, Ia.extent = ba, Ia.find = Sa, Ia.remove = Ca, Ia.removeAll = wa, Ia.root = Ta, Ia.size = Ea, Ia.visit = Da, Ia.visitAfter = Oa, Ia.x = Aa, Ia.y = Ma;
//#endregion
//#region node_modules/d3-force/src/constant.js
function La(e) {
	return function() {
		return e;
	};
}
//#endregion
//#region node_modules/d3-force/src/jiggle.js
function Ra(e) {
	return (e() - .5) * 1e-6;
}
//#endregion
//#region node_modules/d3-force/src/collide.js
function za(e) {
	return e.x + e.vx;
}
function Ba(e) {
	return e.y + e.vy;
}
function Va(e) {
	var t, n, r, i = 1, a = 1;
	typeof e != "function" && (e = La(e == null ? 1 : +e));
	function o() {
		for (var e, o = t.length, c, l, u, d, f, p, m = 0; m < a; ++m) for (c = Na(t, za, Ba).visitAfter(s), e = 0; e < o; ++e) l = t[e], f = n[l.index], p = f * f, u = l.x + l.vx, d = l.y + l.vy, c.visit(h);
		function h(e, t, n, a, o) {
			var s = e.data, c = e.r, m = f + c;
			if (s) {
				if (s.index > l.index) {
					var h = u - s.x - s.vx, g = d - s.y - s.vy, _ = h * h + g * g;
					_ < m * m && (h === 0 && (h = Ra(r), _ += h * h), g === 0 && (g = Ra(r), _ += g * g), _ = (m - (_ = Math.sqrt(_))) / _ * i, l.vx += (h *= _) * (m = (c *= c) / (p + c)), l.vy += (g *= _) * m, s.vx -= h * (m = 1 - m), s.vy -= g * m);
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
		return arguments.length ? (e = typeof t == "function" ? t : La(+t), c(), o) : e;
	}, o;
}
//#endregion
//#region node_modules/d3-force/src/link.js
function Ha(e) {
	return e.index;
}
function Ua(e, t) {
	var n = e.get(t);
	if (!n) throw Error("node not found: " + t);
	return n;
}
function Wa(e) {
	var t = Ha, n = d, r, i = La(30), a, o, s, c, l, u = 1;
	e ??= [];
	function d(e) {
		return 1 / Math.min(s[e.source.index], s[e.target.index]);
	}
	function f(t) {
		for (var n = 0, i = e.length; n < u; ++n) for (var o = 0, s, d, f, p, m, h, g; o < i; ++o) s = e[o], d = s.source, f = s.target, p = f.x + f.vx - d.x - d.vx || Ra(l), m = f.y + f.vy - d.y - d.vy || Ra(l), h = Math.sqrt(p * p + m * m), h = (h - a[o]) / h * t * r[o], p *= h, m *= h, f.vx -= p * (g = c[o]), f.vy -= m * g, d.vx += p * (g = 1 - g), d.vy += m * g;
	}
	function p() {
		if (o) {
			var n, i = o.length, l = e.length, u = new Map(o.map((e, n) => [t(e, n, o), e])), d;
			for (n = 0, s = Array(i); n < l; ++n) d = e[n], d.index = n, typeof d.source != "object" && (d.source = Ua(u, d.source)), typeof d.target != "object" && (d.target = Ua(u, d.target)), s[d.source.index] = (s[d.source.index] || 0) + 1, s[d.target.index] = (s[d.target.index] || 0) + 1;
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
		return arguments.length ? (n = typeof e == "function" ? e : La(+e), m(), f) : n;
	}, f.distance = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : La(+e), h(), f) : i;
	}, f;
}
//#endregion
//#region node_modules/d3-force/src/lcg.js
var Ga = 1664525, Ka = 1013904223, qa = 4294967296;
function Ja() {
	let e = 1;
	return () => (e = (Ga * e + Ka) % qa) / qa;
}
//#endregion
//#region node_modules/d3-force/src/simulation.js
function Ya(e) {
	return e.x;
}
function Xa(e) {
	return e.y;
}
var Za = 10, Qa = Math.PI * (3 - Math.sqrt(5));
function $a(e) {
	var t, n = 1, r = .001, i = 1 - r ** (1 / 300), a = 0, o = .6, s = /* @__PURE__ */ new Map(), c = Ar(d), l = C("tick", "end"), u = Ja();
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
				var i = Za * Math.sqrt(.5 + t), a = t * Qa;
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
function eo() {
	var e, t, n, r, i = La(-30), a, o = 1, s = Infinity, c = .81;
	function l(n) {
		var i, a = e.length, o = Na(e, Ya, Xa).visitAfter(d);
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
		if (p * p / c < m) return m < s && (d === 0 && (d = Ra(n), m += d * d), f === 0 && (f = Ra(n), m += f * f), m < o && (m = Math.sqrt(o * m)), t.vx += d * e.value * r / m, t.vy += f * e.value * r / m), !0;
		if (!(e.length || m >= s)) {
			(e.data !== t || e.next) && (d === 0 && (d = Ra(n), m += d * d), f === 0 && (f = Ra(n), m += f * f), m < o && (m = Math.sqrt(o * m)));
			do
				e.data !== t && (p = a[e.data.index] * r / m, t.vx += d * p, t.vy += f * p);
			while (e = e.next);
		}
	}
	return l.initialize = function(t, r) {
		e = t, n = r, u();
	}, l.strength = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : La(+e), u(), l) : i;
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
function to(e) {
	for (var t = -1, n = e.length, r = 0, i = 0, a, o = e[n - 1], s, c = 0; ++t < n;) a = o, o = e[t], c += s = a[0] * o[1] - o[0] * a[1], r += (a[0] + o[0]) * s, i += (a[1] + o[1]) * s;
	return c *= 3, [r / c, i / c];
}
//#endregion
//#region node_modules/d3-polygon/src/cross.js
function no(e, t, n) {
	return (t[0] - e[0]) * (n[1] - e[1]) - (t[1] - e[1]) * (n[0] - e[0]);
}
//#endregion
//#region node_modules/d3-polygon/src/hull.js
function ro(e, t) {
	return e[0] - t[0] || e[1] - t[1];
}
function io(e) {
	let t = e.length, n = [0, 1], r = 2, i;
	for (i = 2; i < t; ++i) {
		for (; r > 1 && no(e[n[r - 2]], e[n[r - 1]], e[i]) <= 0;) --r;
		n[r++] = i;
	}
	return n.slice(0, r);
}
function ao(e) {
	if ((n = e.length) < 3) return null;
	var t, n, r = Array(n), i = Array(n);
	for (t = 0; t < n; ++t) r[t] = [
		+e[t][0],
		+e[t][1],
		t
	];
	for (r.sort(ro), t = 0; t < n; ++t) i[t] = [r[t][0], -r[t][1]];
	var a = io(r), o = io(i), s = o[0] === a[0], c = o[o.length - 1] === a[a.length - 1], l = [];
	for (t = a.length - 1; t >= 0; --t) l.push(e[r[a[t]][2]]);
	for (t = +s; t < o.length - c; ++t) l.push(e[r[o[t]][2]]);
	return l;
}
//#endregion
//#region node_modules/d3-shape/src/constant.js
function oo(e) {
	return function() {
		return e;
	};
}
var so = Math.PI;
so / 2, 2 * so;
//#endregion
//#region node_modules/d3-shape/src/path.js
function co(e) {
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
	}, () => new fa(t);
}
Array.prototype.slice;
function lo(e) {
	return typeof e == "object" && "length" in e ? e : Array.from(e);
}
//#endregion
//#region node_modules/d3-shape/src/curve/linear.js
function uo(e) {
	this._context = e;
}
uo.prototype = {
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
function fo(e) {
	return new uo(e);
}
//#endregion
//#region node_modules/d3-shape/src/point.js
function po(e) {
	return e[0];
}
function mo(e) {
	return e[1];
}
//#endregion
//#region node_modules/d3-shape/src/line.js
function z(e, t) {
	var n = oo(!0), r = null, i = fo, a = null, o = co(s);
	e = typeof e == "function" ? e : e === void 0 ? po : oo(e), t = typeof t == "function" ? t : t === void 0 ? mo : oo(t);
	function s(s) {
		var c, l = (s = lo(s)).length, u, d = !1, f;
		for (r ?? (a = i(f = o())), c = 0; c <= l; ++c) !(c < l && n(u = s[c], c, s)) === d && ((d = !d) ? a.lineStart() : a.lineEnd()), d && a.point(+e(u, c, s), +t(u, c, s));
		if (f) return a = null, f + "" || null;
	}
	return s.x = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : oo(+t), s) : e;
	}, s.y = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : oo(+e), s) : t;
	}, s.defined = function(e) {
		return arguments.length ? (n = typeof e == "function" ? e : oo(!!e), s) : n;
	}, s.curve = function(e) {
		return arguments.length ? (i = e, r != null && (a = i(r)), s) : i;
	}, s.context = function(e) {
		return arguments.length ? (e == null ? r = a = null : a = i(r = e), s) : r;
	}, s;
}
//#endregion
//#region node_modules/d3-shape/src/noop.js
function B() {}
//#endregion
//#region node_modules/d3-shape/src/curve/cardinal.js
function ho(e, t, n) {
	e._context.bezierCurveTo(e._x1 + e._k * (e._x2 - e._x0), e._y1 + e._k * (e._y2 - e._y0), e._x2 + e._k * (e._x1 - t), e._y2 + e._k * (e._y1 - n), e._x2, e._y2);
}
function go(e, t) {
	this._context = e, this._k = (1 - t) / 6;
}
go.prototype = {
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
				ho(this, this._x1, this._y1);
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
				ho(this, e, t);
				break;
		}
		this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
}, (function e(t) {
	function n(e) {
		return new go(e, t);
	}
	return n.tension = function(t) {
		return e(+t);
	}, n;
})(0);
//#endregion
//#region node_modules/d3-shape/src/curve/cardinalClosed.js
function _o(e, t) {
	this._context = e, this._k = (1 - t) / 6;
}
_o.prototype = {
	areaStart: B,
	areaEnd: B,
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
				ho(this, e, t);
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
//#region node_modules/d3-shape/src/curve/catmullRom.js
function vo(e, t, n) {
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
function yo(e, t) {
	this._context = e, this._alpha = t;
}
yo.prototype = {
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
				vo(this, e, t);
				break;
		}
		this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
}, (function e(t) {
	function n(e) {
		return t ? new yo(e, t) : new go(e, 0);
	}
	return n.alpha = function(t) {
		return e(+t);
	}, n;
})(.5);
//#endregion
//#region node_modules/d3-shape/src/curve/catmullRomClosed.js
function bo(e, t) {
	this._context = e, this._alpha = t;
}
bo.prototype = {
	areaStart: B,
	areaEnd: B,
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
				vo(this, e, t);
				break;
		}
		this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
};
var xo = (function e(t) {
	function n(e) {
		return t ? new bo(e, t) : new _o(e, 0);
	}
	return n.alpha = function(t) {
		return e(+t);
	}, n;
})(.5), So = (e) => () => e;
//#endregion
//#region node_modules/d3-zoom/src/event.js
function Co(e, { sourceEvent: t, target: n, transform: r, dispatch: i }) {
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
function wo(e, t, n) {
	this.k = e, this.x = t, this.y = n;
}
wo.prototype = {
	constructor: wo,
	scale: function(e) {
		return e === 1 ? this : new wo(this.k * e, this.x, this.y);
	},
	translate: function(e, t) {
		return e === 0 & t === 0 ? this : new wo(this.k, this.x + this.k * e, this.y + this.k * t);
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
var To = new wo(1, 0, 0);
Eo.prototype = wo.prototype;
function Eo(e) {
	for (; !e.__zoom;) if (!(e = e.parentNode)) return To;
	return e.__zoom;
}
//#endregion
//#region node_modules/d3-zoom/src/noevent.js
function Do(e) {
	e.stopImmediatePropagation();
}
function Oo(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region node_modules/d3-zoom/src/zoom.js
function ko(e) {
	return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function Ao() {
	var e = this;
	return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function jo() {
	return this.__zoom || To;
}
function Mo(e) {
	return -e.deltaY * (e.deltaMode === 1 ? .05 : e.deltaMode ? 1 : .002) * (e.ctrlKey ? 10 : 1);
}
function No() {
	return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Po(e, t, n) {
	var r = e.invertX(t[0][0]) - n[0][0], i = e.invertX(t[1][0]) - n[1][0], a = e.invertY(t[0][1]) - n[0][1], o = e.invertY(t[1][1]) - n[1][1];
	return e.translate(i > r ? (r + i) / 2 : Math.min(0, r) || Math.max(0, i), o > a ? (a + o) / 2 : Math.min(0, a) || Math.max(0, o));
}
function Fo() {
	var e = ko, t = Ao, n = Po, r = Mo, i = No, a = [0, Infinity], o = [[-Infinity, -Infinity], [Infinity, Infinity]], s = 250, c = hr, l = C("start", "zoom", "end"), u, d, f, p = 500, m = 150, h = 0, g = 10;
	function _(e) {
		e.property("__zoom", jo).on("wheel.zoom", T, { passive: !1 }).on("mousedown.zoom", E).on("dblclick.zoom", D).filter(i).on("touchstart.zoom", O).on("touchmove.zoom", k).on("touchend.zoom touchcancel.zoom", ee).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	}
	_.transform = function(e, t, n, r) {
		var i = e.selection ? e.selection() : e;
		i.property("__zoom", jo), e === i ? i.interrupt().each(function() {
			S(this, arguments).event(r).start().zoom(null, typeof t == "function" ? t.apply(this, arguments) : t).end();
		}) : x(e, t, n, r);
	}, _.scaleBy = function(e, t, n, r) {
		_.scaleTo(e, function() {
			return this.__zoom.k * (typeof t == "function" ? t.apply(this, arguments) : t);
		}, n, r);
	}, _.scaleTo = function(e, r, i, a) {
		_.transform(e, function() {
			var e = t.apply(this, arguments), a = this.__zoom, s = i == null ? b(e) : typeof i == "function" ? i.apply(this, arguments) : i, c = a.invert(s), l = typeof r == "function" ? r.apply(this, arguments) : r;
			return n(y(v(a, l), s, c), e, o);
		}, i, a);
	}, _.translateBy = function(e, r, i, a) {
		_.transform(e, function() {
			return n(this.__zoom.translate(typeof r == "function" ? r.apply(this, arguments) : r, typeof i == "function" ? i.apply(this, arguments) : i), t.apply(this, arguments), o);
		}, null, a);
	}, _.translateTo = function(e, r, i, a, s) {
		_.transform(e, function() {
			var e = t.apply(this, arguments), s = this.__zoom, c = a == null ? b(e) : typeof a == "function" ? a.apply(this, arguments) : a;
			return n(To.translate(c[0], c[1]).scale(s.k).translate(typeof r == "function" ? -r.apply(this, arguments) : -r, typeof i == "function" ? -i.apply(this, arguments) : -i), e, o);
		}, a, s);
	};
	function v(e, t) {
		return t = Math.max(a[0], Math.min(a[1], t)), t === e.k ? e : new wo(t, e.x, e.y);
	}
	function y(e, t, n) {
		var r = t[0] - n[0] * e.k, i = t[1] - n[1] * e.k;
		return r === e.x && i === e.y ? e : new wo(e.k, r, i);
	}
	function b(e) {
		return [(+e[0][0] + +e[1][0]) / 2, (+e[0][1] + +e[1][1]) / 2];
	}
	function x(e, n, r, i) {
		e.on("start.zoom", function() {
			S(this, arguments).event(i).start();
		}).on("interrupt.zoom end.zoom", function() {
			S(this, arguments).event(i).end();
		}).tween("zoom", function() {
			var e = this, a = arguments, o = S(e, a).event(i), s = t.apply(e, a), l = r == null ? b(s) : typeof r == "function" ? r.apply(e, a) : r, u = Math.max(s[1][0] - s[0][0], s[1][1] - s[0][1]), d = e.__zoom, f = typeof n == "function" ? n.apply(e, a) : n, p = c(d.invert(l).concat(u / d.k), f.invert(l).concat(u / f.k));
			return function(e) {
				if (e === 1) e = f;
				else {
					var t = p(e), n = u / t[2];
					e = new wo(n, l[0] - t[0] * n, l[1] - t[1] * n);
				}
				o.zoom(null, e);
			};
		});
	}
	function S(e, t, n) {
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
			var t = L(this.that).datum();
			l.call(e, this.that, new Co(e, {
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
		var s = S(this, i).event(t), c = this.__zoom, l = Math.max(a[0], Math.min(a[1], c.k * 2 ** r.apply(this, arguments))), u = Wt(t);
		if (s.wheel) (s.mouse[0][0] !== u[0] || s.mouse[0][1] !== u[1]) && (s.mouse[1] = c.invert(s.mouse[0] = u)), clearTimeout(s.wheel);
		else if (c.k === l) return;
		else s.mouse = [u, c.invert(u)], Wr(this), s.start();
		Oo(t), s.wheel = setTimeout(d, m), s.zoom("mouse", n(y(v(c, l), s.mouse[0], s.mouse[1]), s.extent, o));
		function d() {
			s.wheel = null, s.end();
		}
	}
	function E(t, ...r) {
		if (f || !e.apply(this, arguments)) return;
		var i = t.currentTarget, a = S(this, r, !0).event(t), s = L(t.view).on("mousemove.zoom", d, !0).on("mouseup.zoom", p, !0), c = Wt(t, i), l = t.clientX, u = t.clientY;
		Yt(t.view), Do(t), a.mouse = [c, this.__zoom.invert(c)], Wr(this), a.start();
		function d(e) {
			if (Oo(e), !a.moved) {
				var t = e.clientX - l, r = e.clientY - u;
				a.moved = t * t + r * r > h;
			}
			a.event(e).zoom("mouse", n(y(a.that.__zoom, a.mouse[0] = Wt(e, i), a.mouse[1]), a.extent, o));
		}
		function p(e) {
			s.on("mousemove.zoom mouseup.zoom", null), Xt(e.view, a.moved), Oo(e), a.event(e).end();
		}
	}
	function D(r, ...i) {
		if (e.apply(this, arguments)) {
			var a = this.__zoom, c = Wt(r.changedTouches ? r.changedTouches[0] : r, this), l = a.invert(c), u = a.k * (r.shiftKey ? .5 : 2), d = n(y(v(a, u), c, l), t.apply(this, i), o);
			Oo(r), s > 0 ? L(this).transition().duration(s).call(x, d, c, r) : L(this).call(_.transform, d, c, r);
		}
	}
	function O(t, ...n) {
		if (e.apply(this, arguments)) {
			var r = t.touches, i = r.length, a = S(this, n, t.changedTouches.length === i).event(t), o, s, c, l;
			for (Do(t), s = 0; s < i; ++s) c = r[s], l = Wt(c, this), l = [
				l,
				this.__zoom.invert(l),
				c.identifier
			], a.touch0 ? !a.touch1 && a.touch0[2] !== l[2] && (a.touch1 = l, a.taps = 0) : (a.touch0 = l, o = !0, a.taps = 1 + !!u);
			u &&= clearTimeout(u), o && (a.taps < 2 && (d = l[0], u = setTimeout(function() {
				u = null;
			}, p)), Wr(this), a.start());
		}
	}
	function k(e, ...t) {
		if (this.__zooming) {
			var r = S(this, t).event(e), i = e.changedTouches, a = i.length, s, c, l, u;
			for (Oo(e), s = 0; s < a; ++s) c = i[s], l = Wt(c, this), r.touch0 && r.touch0[2] === c.identifier ? r.touch0[0] = l : r.touch1 && r.touch1[2] === c.identifier && (r.touch1[0] = l);
			if (c = r.that.__zoom, r.touch1) {
				var d = r.touch0[0], f = r.touch0[1], p = r.touch1[0], m = r.touch1[1], h = (h = p[0] - d[0]) * h + (h = p[1] - d[1]) * h, g = (g = m[0] - f[0]) * g + (g = m[1] - f[1]) * g;
				c = v(c, Math.sqrt(h / g)), l = [(d[0] + p[0]) / 2, (d[1] + p[1]) / 2], u = [(f[0] + m[0]) / 2, (f[1] + m[1]) / 2];
			} else if (r.touch0) l = r.touch0[0], u = r.touch0[1];
			else return;
			r.zoom("touch", n(y(c, l, u), r.extent, o));
		}
	}
	function ee(e, ...t) {
		if (this.__zooming) {
			var n = S(this, t).event(e), r = e.changedTouches, i = r.length, a, o;
			for (Do(e), f && clearTimeout(f), f = setTimeout(function() {
				f = null;
			}, p), a = 0; a < i; ++a) o = r[a], n.touch0 && n.touch0[2] === o.identifier ? delete n.touch0 : n.touch1 && n.touch1[2] === o.identifier && delete n.touch1;
			if (n.touch1 && !n.touch0 && (n.touch0 = n.touch1, delete n.touch1), n.touch0) n.touch0[1] = this.__zoom.invert(n.touch0[0]);
			else if (n.end(), n.taps === 2 && (o = Wt(o, this), Math.hypot(d[0] - o[0], d[1] - o[1]) < g)) {
				var s = L(this).on("dblclick.zoom");
				s && s.apply(this, arguments);
			}
		}
	}
	return _.wheelDelta = function(e) {
		return arguments.length ? (r = typeof e == "function" ? e : So(+e), _) : r;
	}, _.filter = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : So(!!t), _) : e;
	}, _.touchable = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : So(!!e), _) : i;
	}, _.extent = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : So([[+e[0][0], +e[0][1]], [+e[1][0], +e[1][1]]]), _) : t;
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
var Io = {
	graphContainer: "_graphContainer_f264b_3",
	flowSingleDot: "_flowSingleDot_f264b_1"
}, Lo = /* @__PURE__ */ o(((e, t) => {
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
})), Ro = /* @__PURE__ */ o(((e, t) => {
	var { hashString: n, rng: r } = Lo(), i = (e) => (Math.round(e * 10) / 10).toString();
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
})), zo = /* @__PURE__ */ o(((e) => {
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
})), Bo = /* @__PURE__ */ o(((e, t) => {
	t.exports = zo();
})), Vo = Ro(), V = Bo(), H = {
	card: "_card_3sise_5",
	draft: "_draft_3sise_24",
	published: "_published_3sise_28",
	pinned: "_pinned_3sise_32",
	marker: "_marker_3sise_37",
	title: "_title_3sise_46",
	titleCentered: "_titleCentered_3sise_57",
	titleInline: "_titleInline_3sise_73",
	preview: "_preview_3sise_83",
	scroll: "_scroll_3sise_93",
	full: "_full_3sise_109",
	popout: "_popout_3sise_126",
	imageCard: "_imageCard_3sise_145",
	imageFrame: "_imageFrame_3sise_156",
	imageCaption: "_imageCaption_3sise_173",
	scrollFull: "_scrollFull_3sise_184",
	titleScrolling: "_titleScrolling_3sise_188",
	imageMark: "_imageMark_3sise_200",
	bookmarkMark: "_bookmarkMark_3sise_214",
	bookmarkCount: "_bookmarkCount_3sise_233",
	readersMark: "_readersMark_3sise_242",
	glow: "_glow_3sise_264",
	cardTitle: "_cardTitle_3sise_274",
	resizeGrip: "_resizeGrip_3sise_280",
	cardCenter: "_cardCenter_3sise_324",
	cardSubtitle: "_cardSubtitle_3sise_344",
	readBar: "_readBar_3sise_390",
	readFill: "_readFill_3sise_401",
	readMark: "_readMark_3sise_408",
	complete: "_complete_3sise_418",
	sketchBorder: "_sketchBorder_3sise_428",
	sketchMain: "_sketchMain_3sise_441",
	sketchGhost: "_sketchGhost_3sise_442"
}, Ho = {
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
}, Uo = 140, Wo = 80, Go = 700, Ko = 700;
function qo({ width: e, height: t, zoomScale: n = 1, onResize: r, onResizeEnd: i }) {
	let [a, o] = (0, _.useState)(!1), s = (0, _.useRef)(null), c = (a, c) => {
		c.stopPropagation(), c.preventDefault(), o(!0), s.current = {
			direction: a,
			startX: c.clientX,
			startY: c.clientY,
			startW: e,
			startH: t,
			scale: n > 0 ? n : 1
		};
		let l = (e) => {
			if (!s.current) return;
			let { direction: t, startX: n, startY: i, startW: a, startH: o, scale: c } = s.current, l = (e.clientX - n) / c, u = (e.clientY - i) / c, d = a, f = o;
			t.includes("e") && (d = a + l), t.includes("w") && (d = a - l), t.includes("s") && (f = o + u), t.includes("n") && (f = o - u), d = Math.max(Uo, Math.min(Go, Math.round(d))), f = Math.max(Wo, Math.min(Ko, Math.round(f))), r && r({
				width: d,
				height: f
			});
		}, u = (e) => {
			window.removeEventListener("pointermove", l), window.removeEventListener("pointerup", u), document.body.style.cursor = "", o(!1), s.current = null, i && i();
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
		document.body.style.cursor = d[a] || "nwse-resize", window.addEventListener("pointermove", l), window.addEventListener("pointerup", u);
	};
	return (0, _.useEffect)(() => () => {
		document.body.style.cursor = "";
	}, []), /* @__PURE__ */ (0, V.jsxs)("div", {
		className: a ? Ho.resizing : void 0,
		children: [
			/* @__PURE__ */ (0, V.jsx)("div", {
				className: `${Ho.handle} ${Ho.handleN}`,
				onPointerDown: (e) => c("n", e),
				title: "Drag to resize height"
			}),
			/* @__PURE__ */ (0, V.jsx)("div", {
				className: `${Ho.handle} ${Ho.handleS}`,
				onPointerDown: (e) => c("s", e),
				title: "Drag to resize height"
			}),
			/* @__PURE__ */ (0, V.jsx)("div", {
				className: `${Ho.handle} ${Ho.handleW}`,
				onPointerDown: (e) => c("w", e),
				title: "Drag to resize width"
			}),
			/* @__PURE__ */ (0, V.jsx)("div", {
				className: `${Ho.handle} ${Ho.handleE}`,
				onPointerDown: (e) => c("e", e),
				title: "Drag to resize width"
			}),
			/* @__PURE__ */ (0, V.jsx)("div", {
				className: `${Ho.handle} ${Ho.handleNW}`,
				onPointerDown: (e) => c("nw", e),
				title: "Drag to resize"
			}),
			/* @__PURE__ */ (0, V.jsx)("div", {
				className: `${Ho.handle} ${Ho.handleNE}`,
				onPointerDown: (e) => c("ne", e),
				title: "Drag to resize"
			}),
			/* @__PURE__ */ (0, V.jsx)("div", {
				className: `${Ho.handle} ${Ho.handleSW}`,
				onPointerDown: (e) => c("sw", e),
				title: "Drag to resize"
			}),
			/* @__PURE__ */ (0, V.jsx)("div", {
				className: `${Ho.handle} ${Ho.handleSE}`,
				onPointerDown: (e) => c("se", e),
				title: "Drag to resize"
			})
		]
	});
}
//#endregion
//#region src/components/NodeView/TextView/TextView.jsx
var Jo = (/* @__PURE__ */ o(((e, t) => {
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
})))(), Yo = /* @__PURE__ */ new Map();
function Xo(e, t, n, r) {
	let i = `${e}|${Math.round(t)}|${Math.round(n)}|${r}`, a = Yo.get(i);
	return a || (Yo.size > 400 && Yo.clear(), a = (0, Vo.roughRect)(t, n, r, e), Yo.set(i, a)), a;
}
function Zo({ article: e, width: t, height: n, viewState: r, fullContent: i, onResize: a, cardSettings: o }) {
	let { hovered: s = !1, pinned: c = !1, lod: l = "full", zoomScale: u = 1 } = r || {}, d = s || c, f = c && !!i, p = !(e._status === "published" || e._status === "bloomed" || e.syndication && e.syndication.canonical), m = e.containerColor || e.color || e._source && e._source.color, h = r?.contributionCount || 0, g = r?.bookmarkCount ?? (Array.isArray(r?.bookmarks) ? r.bookmarks.length : Array.isArray(e?.bookmarks) ? e.bookmarks.length : 0);
	if (e.kind === "image" && e.image) return /* @__PURE__ */ (0, V.jsx)(ts, {
		article: e,
		width: t,
		height: n,
		pinned: c,
		hovered: s,
		isDraft: p,
		zoomScale: u,
		bookmarkCount: g,
		onResize: a
	});
	let _ = (e._source && e._source.prominence || e.originalItem && e.originalItem._source && e.originalItem._source.prominence || "secondary") === "primary" ? p ? "#24304a" : "#1e3a5f" : "#23232f", v = !!e.image, y = r && r.progress, b = y ? Math.max(0, Math.min(1, y.max || 0)) : 0, x = !!(y && y.done), S = [
		H.card,
		x && H.complete,
		m && !c && H.glow,
		p ? H.draft : H.published,
		d && H.expanded,
		c && H.pinned,
		r.lod === "marker" && !d && H.marker
	].filter(Boolean).join(" "), C = r.lod !== "marker", w = o?.cornerRadius == null ? 10 : o.cornerRadius, T = r.lod === "marker" && !d || !t || !n ? null : Xo(e.id || e.title || "", t, n, w);
	return /* @__PURE__ */ (0, V.jsxs)("div", {
		className: S,
		"data-pp-card": !0,
		style: {
			width: t,
			height: n,
			background: _,
			...o?.cornerRadius != null && !(r.lod === "marker" && !d) ? { borderRadius: o.cornerRadius } : {},
			...m && !c ? { "--nv-src": m } : {}
		},
		children: [
			T && /* @__PURE__ */ (0, V.jsxs)("svg", {
				className: H.sketchBorder,
				viewBox: `0 0 ${t} ${n}`,
				preserveAspectRatio: "none",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ (0, V.jsx)("path", {
					className: H.sketchGhost,
					d: T.ghost
				}), /* @__PURE__ */ (0, V.jsx)("path", {
					className: H.sketchMain,
					d: T.main
				})]
			}),
			g > 0 && /* @__PURE__ */ (0, V.jsxs)("div", {
				className: H.bookmarkMark,
				title: g === 1 ? "1 bookmark" : `${g} bookmarks`,
				children: [/* @__PURE__ */ (0, V.jsx)("svg", {
					viewBox: "0 0 16 16",
					width: "12",
					height: "12",
					fill: "currentColor",
					children: /* @__PURE__ */ (0, V.jsx)("path", { d: "M3 2v12l5-3 5 3V2z" })
				}), g > 1 && /* @__PURE__ */ (0, V.jsx)("span", {
					className: H.bookmarkCount,
					children: g
				})]
			}),
			h > 0 && C && /* @__PURE__ */ (0, V.jsxs)("div", {
				className: H.readersMark,
				title: h === 1 ? "1 from readers" : `${h} from readers`,
				"aria-label": h === 1 ? "1 from readers" : `${h} from readers`,
				"data-contrib-count": h,
				children: [/* @__PURE__ */ (0, V.jsx)("svg", {
					viewBox: "0 0 16 16",
					width: "11",
					height: "11",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "1.6",
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, V.jsx)("path", {
						d: "M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2z",
						strokeLinejoin: "round"
					})
				}), /* @__PURE__ */ (0, V.jsx)("span", { children: h })]
			}),
			v && /* @__PURE__ */ (0, V.jsx)("div", {
				className: H.imageMark,
				style: {
					backgroundImage: `url('${e.image}')`,
					...o?.imageMarkSize ? {
						width: o.imageMarkSize,
						height: o.imageMarkSize
					} : {}
				},
				title: "has an image"
			}),
			/* @__PURE__ */ (0, V.jsx)(es, {
				article: e,
				width: t,
				height: n - 0,
				bandHeight: 0,
				viewState: r,
				expanded: d,
				useFullArticle: f,
				fullContent: i,
				cardSettings: o
			}),
			C && (b > 0 || x) && /* @__PURE__ */ (0, V.jsx)("div", {
				className: H.readBar,
				role: "progressbar",
				"aria-label": "Read",
				"aria-valuemin": 0,
				"aria-valuemax": 100,
				"aria-valuenow": Math.round((x ? 1 : b) * 100),
				"data-read-progress": x ? "done" : Math.round(b * 100),
				children: /* @__PURE__ */ (0, V.jsx)("div", {
					className: H.readFill,
					style: { width: `${(x ? 1 : b) * 100}%` }
				})
			}),
			C && x && /* @__PURE__ */ (0, V.jsx)("div", {
				className: H.readMark,
				title: "Read to the end",
				"aria-hidden": "true",
				children: "✓"
			}),
			c && /* @__PURE__ */ (0, V.jsx)(ns, {}),
			C && /* @__PURE__ */ (0, V.jsx)(qo, {
				width: t,
				height: n,
				zoomScale: u,
				onResize: a
			})
		]
	});
}
function Qo(e, t, n, r = {}) {
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
var $o = 260;
function es({ article: e, width: t, height: n, bandHeight: r = 0, viewState: i, expanded: a, useFullArticle: o, fullContent: s, cardSettings: c }) {
	if (a) {
		let t = o ? s : e.description || "", r = e.title || e.label;
		return n && n < $o ? /* @__PURE__ */ (0, V.jsxs)("div", {
			className: `${H.scroll} ${H.scrollFull} ${o ? H.full : ""} rp-scroll`,
			children: [/* @__PURE__ */ (0, V.jsx)("div", {
				className: H.titleScrolling,
				children: r
			}), t && /* @__PURE__ */ (0, V.jsx)("div", { dangerouslySetInnerHTML: { __html: t } })]
		}) : /* @__PURE__ */ (0, V.jsxs)(V.Fragment, { children: [/* @__PURE__ */ (0, V.jsx)("div", {
			className: H.title,
			children: r
		}), t && /* @__PURE__ */ (0, V.jsx)("div", {
			className: `${H.scroll} ${o ? H.full : ""} rp-scroll`,
			dangerouslySetInnerHTML: { __html: t }
		})] });
	}
	if (i.lod === "marker") return null;
	let l = c?.subtitle || typeof window < "u" && window.SETTINGS?.graph?.card?.subtitle, u = null;
	if (l && e.series_part != null && e.series_part !== "") {
		let t = e.series_part, n = (0, Jo.numberToLowercaseWords)(t);
		u = l.replace(/\{n\}/g, String(t)).replace(/\{n_words\}/g, n);
	}
	let d = i.lod === "slug" ? e.label || e.labelMedium || e.title || "" : e.title || e.label, f = Qo(d, t, u ? n - 30 : n, {
		min: c?.labelMinFontSize ?? 14,
		max: c?.labelMaxFontSize ?? 26,
		lineHeight: 1.05,
		pad: 8
	}), p = Math.max(11, Math.round(f * .62));
	return /* @__PURE__ */ (0, V.jsxs)("div", {
		className: H.cardCenter,
		children: [/* @__PURE__ */ (0, V.jsx)("div", {
			className: H.cardTitle,
			style: { fontSize: `${f}px` },
			children: d
		}), u && /* @__PURE__ */ (0, V.jsx)("div", {
			className: H.cardSubtitle,
			style: { fontSize: `${p}px` },
			children: u
		})]
	});
}
function ts({ article: e, width: t, height: n, pinned: r, hovered: i, isDraft: a, zoomScale: o, bookmarkCount: s = 0, onResize: c }) {
	let l = [
		H.imageCard,
		a ? H.draft : H.published,
		r && H.pinned
	].filter(Boolean).join(" "), u = n - 24;
	return /* @__PURE__ */ (0, V.jsxs)("div", {
		className: l,
		style: {
			width: t,
			height: n
		},
		children: [
			s > 0 && /* @__PURE__ */ (0, V.jsxs)("div", {
				className: H.bookmarkMark,
				title: s === 1 ? "1 bookmark" : `${s} bookmarks`,
				children: [/* @__PURE__ */ (0, V.jsx)("svg", {
					viewBox: "0 0 16 16",
					width: "12",
					height: "12",
					fill: "currentColor",
					children: /* @__PURE__ */ (0, V.jsx)("path", { d: "M3 2v12l5-3 5 3V2z" })
				}), s > 1 && /* @__PURE__ */ (0, V.jsx)("span", {
					className: H.bookmarkCount,
					children: s
				})]
			}),
			/* @__PURE__ */ (0, V.jsx)("div", {
				className: H.imageFrame,
				style: {
					width: t,
					height: u,
					backgroundImage: `url('${e.image}')`
				}
			}),
			/* @__PURE__ */ (0, V.jsx)("div", {
				className: H.imageCaption,
				children: e.short_title || e.title || e.label
			}),
			r && /* @__PURE__ */ (0, V.jsx)(ns, {}),
			/* @__PURE__ */ (0, V.jsx)(qo, {
				width: t,
				height: n,
				zoomScale: o,
				onResize: c
			})
		]
	});
}
function ns() {
	return /* @__PURE__ */ (0, V.jsx)("div", {
		"data-popout": "1",
		title: "Open in reader",
		className: H.popout,
		children: /* @__PURE__ */ (0, V.jsxs)("svg", {
			"data-popout": "1",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2.2",
			width: "13",
			height: "13",
			style: { pointerEvents: "none" },
			children: [
				/* @__PURE__ */ (0, V.jsx)("path", { d: "M14 3h7v7" }),
				/* @__PURE__ */ (0, V.jsx)("path", { d: "M21 3l-9 9" }),
				/* @__PURE__ */ (0, V.jsx)("path", { d: "M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" })
			]
		})
	});
}
//#endregion
//#region src/components/NodeView/registry.js
var rs = {
	text: Zo,
	essay: Zo,
	fragment: Zo,
	multi: Zo,
	image: Zo,
	"podcast-episode": Zo,
	video: Zo
};
function is(e, t = {}) {
	return {
		...rs,
		...t
	}[e] || Zo;
}
//#endregion
//#region src/components/GraphViewer/layouts.js
var as = /* @__PURE__ */ o(((e, t) => {
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
})), os = /* @__PURE__ */ o(((e, t) => {
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
			let O = m(e, u) * 1.25, k = E.length ? s([C, ...E]) : C, ee = {
				x0: k.x0 - O,
				y0: k.y0 - O,
				x1: k.x1 + O,
				y1: k.y1 + O
			};
			return T.set(e.id, {
				label: C,
				box: ee,
				center: {
					x: 0,
					y: 0
				},
				closed: !1,
				spiral: D
			}), {
				box: ee,
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
})), ss = /* @__PURE__ */ o(((e, t) => {
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
})), cs = /* @__PURE__ */ o(((e, t) => {
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
})), ls = /* @__PURE__ */ o(((e, t) => {
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
})), us = /* @__PURE__ */ o(((e, t) => {
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
})), ds = /* @__PURE__ */ o(((e, t) => {
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
})), fs = /* @__PURE__ */ o(((e, t) => {
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
})), ps = /* @__PURE__ */ o(((e, t) => {
	var { rootShape: n, rng: r, hashString: i } = Lo(), a = {
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
	function b(e, t, n, r) {
		if (!n || n.length < 3 || v(e, n)) return null;
		let i = y(e, t, n);
		if (!i) return null;
		let a = Math.hypot(i.x - e.x, i.y - e.y);
		if (a <= r + 2) return null;
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
	function x(e, t, n, r) {
		let i = [];
		for (let a of _(e, t.centre, e.length)) {
			if (i.length >= n) break;
			let o = b(e[a], t.centre, t.hull, r);
			o && i.push({
				tip: a,
				...o
			});
		}
		return i;
	}
	var S = (e) => 1 - (1 - c(e)) ** 3;
	function C(e, { ease: t = S, epsilon: n = .25 } = {}) {
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
	var w = (e) => (Math.round(e * 10) / 10).toString();
	function T(e) {
		if (!e.length) return "";
		let t = `M${w(e[0][0])} ${w(e[0][1])}`;
		for (let n = 1; n < e.length; n++) t += `L${w(e[n][0])} ${w(e[n][1])}`;
		return t;
	}
	function E(e) {
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
	function D(e, t, n, r) {
		let i = t.x - e.x, a = t.y - e.y, o = Math.hypot(i, a) || 1, s = -a / o, c = i / o, l = [];
		for (let t = 0; t <= r; t++) {
			let u = t / r, d = Math.sin(Math.PI * u), f = 0;
			for (let e of n.waves) f += e.amp * Math.sin(e.freq * Math.PI * 2 * u + e.phase);
			f = f * d * o * .8 + n.grain[t % n.grain.length] * Math.min(1.6, o * .005) * d, l.push([e.x + i * u + s * f, e.y + a * u + c * f]);
		}
		return l;
	}
	function O(e, t, n, r, i, a) {
		let o = [[e[0], e[1]]], s = t + n, c = e[0], l = e[1], u = r / a;
		for (let e = 1; e <= a; e++) s += i / a, c += Math.cos(s) * u, l += Math.sin(s) * u, o.push([c, l]);
		return o;
	}
	function k(e, t, n) {
		if (!e || !t || !Number.isFinite(e.x) || !Number.isFinite(t.x)) return {
			main: "",
			fine: ""
		};
		let r = Math.hypot(t.x - e.x, t.y - e.y);
		if (r < 4) return {
			main: "",
			fine: ""
		};
		let i = Math.max(8, Math.min(40, Math.round(r / 12))), a = D(e, t, n, i), o = Math.atan2(t.y - e.y, t.x - e.x), s = "";
		for (let e of n.forks) {
			let t = a[Math.round(e.t * i)], n = (1 - e.t) * r * .85, c = Math.cos(Math.abs(e.angle)) || 1, l = Math.max(0, Math.min(e.length * r, n / c, 160));
			if (l < 6) continue;
			let u = O(t, o, e.angle, l, e.bend * .5, 5);
			if (s += T(u), e.twig) {
				let t = u[Math.round(e.twig.t * (u.length - 1))], n = l * e.twig.length * (1 - e.twig.t);
				n >= 4 && (s += T(O(t, o + e.angle, e.twig.angle * .6, n, 0, 3)));
			}
		}
		return {
			main: T(a),
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
		reachFor: x,
		insidePolygon: v,
		rayHit: y,
		reachEnd: b,
		createLag: C,
		reachShape: E,
		reachPath: k
	};
})), ms = /* @__PURE__ */ o(((e, t) => {
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
})), hs = /* @__PURE__ */ o(((e, t) => {
	var { TIMES_OF_DAY: n, sceneMonth: r } = ms(), i = {
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
})), gs = /* @__PURE__ */ o(((e, t) => {
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
})), _s = as(), vs = os(), ys = ss(), bs = cs(), xs = ls(), Ss = us(), Cs = ds(), ws = Lo(), Ts = fs(), Es = ps(), Ds = hs(), Os = gs();
function ks(e, t = {}) {
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
function As(e, t, n) {
	let r = (e) => e && e.type === "article" && e._source && n.has(e._source.id), i = (e) => !!(e && (e._closedHidden || r(e)));
	e.selectAll(".node").style("display", (e) => i(e) ? "none" : null), t.selectAll(".node-card").style("display", (e) => i(e) ? "none" : null), e.selectAll(".link, .link-hit").style("display", (e) => {
		let t = typeof e.source == "object" ? e.source : null, n = typeof e.target == "object" ? e.target : null;
		return i(t) || i(n) ? "none" : null;
	});
}
function js(e, t, n) {
	if (!n) {
		t.selectAll(".node-card").classed("dimmed", !1), e.selectAll(".node").classed("dimmed", !1), e.selectAll(".link").classed("dimmed", !1);
		return;
	}
	t.selectAll(".node-card").classed("dimmed", (e) => !n.has(e.id)), e.selectAll(".node").classed("dimmed", (e) => e.type === "article" ? !n.has(e.id) : !1), e.selectAll(".link").classed("dimmed", (e) => {
		let t = typeof e.source == "object" ? e.source.id : e.source, r = typeof e.target == "object" ? e.target.id : e.target;
		return !n.has(t) && !n.has(r);
	});
}
function Ms(e) {
	let t = {};
	for (let n of e && e.containers || []) {
		let e = (0, Es.fraction)(n.anchor);
		e && (t[n.id] = e);
	}
	return t;
}
function Ns(e) {
	return e && (e.labelPosition === "top" || e.labelPosition === "hidden") ? e.labelPosition : "center";
}
var Ps = .35, Fs = .6;
function Is(e) {
	return e < Ps ? "marker" : e < Fs ? "title" : "full";
}
function Ls(e) {
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
function Rs({ feedData: e, onNodeSelect: t, hiddenSources: n, filteredArticleIds: r, viewState: i, layout: a = "force", timeAxis: o, graphSettings: s, colorOverrides: c, apiRef: l, onNodeFocus: u, contributions: d }) {
	let f = s || {}, p = {
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
		...f.card || {}
	}, m = {
		fontSize: 22,
		padding: 11,
		maxWidth: 150,
		maxLines: 3,
		cornerRadius: 9,
		opacity: .7,
		...f.tag || {}
	}, h = {
		dock: "left",
		inset: 54,
		endPadding: 70,
		connectorOpacity: .45,
		connectorWidth: 1.6,
		spineOpacity: .55,
		spineWidth: 3,
		tickFontSize: 13,
		...f.timeAxis || {}
	}, g = {
		linkDistance: 160,
		chargeStrength: -500,
		collidePadding: 10,
		velocityDecay: .7,
		alphaDecay: .028,
		...f.simulation || {}
	}, S = (0, _.useRef)(null), C = (0, _.useRef)(null), w = (0, _.useRef)(null), T = (0, _.useRef)(t);
	(0, _.useEffect)(() => {
		T.current = t;
	}, [t]);
	let E = (0, _.useRef)(u);
	(0, _.useEffect)(() => {
		E.current = u;
	}, [u]);
	let D = (0, _.useRef)(null), O = (e) => {
		D.current = e ? e.id : null, E.current && E.current(e ? e.originalItem || e : null);
	}, k = (0, _.useRef)(i);
	(0, _.useEffect)(() => {
		k.current = i;
	}, [i]);
	let ee = Ls(p);
	p.glowPadding;
	let te = (0, _.useRef)(null), ne = (0, _.useRef)(a), re = (0, _.useRef)(!1), ie = (0, _.useRef)(null), A = (0, _.useRef)(null), j = (0, _.useRef)(null), M = (0, _.useRef)(null), ae = (0, _.useRef)(d || []), oe = (0, _.useRef)(null), se = (e) => e.originalItem && e.originalItem.id || e.id, ce = (0, _.useRef)({
		settings: null,
		feed: null,
		keys: /* @__PURE__ */ new Map()
	}), N = (t) => {
		let n = ce.current;
		return (n.settings !== s || n.feed !== e) && (n.settings = s, n.feed = e, n.keys = /* @__PURE__ */ new Map()), n.keys.has(t) || n.keys.set(t, (0, Ts.layoutKey)(t, s, { anchors: Ms(e) }) + "::"), n.keys.get(t);
	}, P = (e) => N(ne.current) + se(e), le = (0, _.useRef)(/* @__PURE__ */ new Set()), ue = (0, _.useRef)(null), de = (0, _.useRef)(1), fe = (0, _.useRef)("full"), pe = (0, _.useRef)(/* @__PURE__ */ new Set());
	(0, _.useEffect)(() => {
		pe.current = n instanceof Set ? n : new Set(n || []), !(!C.current || !w.current) && As(C.current, L(w.current), pe.current);
	}, [n]), (0, _.useEffect)(() => {
		if (!(!S.current || !c)) for (let [e, t] of Object.entries(c)) t && S.current.style.setProperty(e, t);
	}, [c]), (0, _.useEffect)(() => {
		if (i) return i.subscribe(() => {
			j.current && j.current(), M.current && M.current(), oe.current && oe.current();
		});
	}, [i]), (0, _.useEffect)(() => {
		ae.current = d || [], j.current && j.current(), oe.current && oe.current({ rebuild: !0 });
	}, [d]), (0, _.useEffect)(() => {
		!C.current || !w.current || js(C.current, L(w.current), r);
	}, [r]), (0, _.useEffect)(() => {
		if (!e || !S.current) return;
		let t = S.current, n = t.clientWidth, r = t.clientHeight, i = getComputedStyle(t), a = ks(e, {
			tagColor: i.getPropertyValue("--gv-tag-color").trim() || "#f39c12",
			topologyColor: i.getPropertyValue("--gv-topology-color").trim() || "#9b59b6",
			placeholderColor: i.getPropertyValue("--gv-placeholder-color").trim() || "#7f8c8d",
			visibleLayers: Array.isArray(f.visibleLayers) ? f.visibleLayers : ["sequence"]
		});
		L(t).selectAll("svg").remove(), L(t).selectAll(".cards-layer").remove();
		let o = L(t).append("svg").attr("width", n).attr("height", r).style("position", "absolute").style("inset", "0").style("pointer-events", "all");
		C.current = o;
		let c = o.append("defs");
		c.append("marker").attr("id", "sequence-arrow").attr("viewBox", "0 0 10 10").attr("refX", 8).attr("refY", 5).attr("markerWidth", 7).attr("markerHeight", 7).attr("orient", "auto").append("path").attr("d", "M 0 1.5 L 8 5 L 0 8.5 z").attr("fill", "var(--gv-accent, #d4af37)");
		let u = L(t).append("div").attr("class", "cards-layer").style("position", "absolute").style("left", "0").style("top", "0").style("width", "100%").style("height", "100%").style("pointer-events", "none");
		w.current = u.node();
		let d = u.append("div").attr("class", "cards-transform").style("transform-origin", "0 0").style("position", "absolute").style("left", "0").style("top", "0").style("width", "0").style("height", "0").style("overflow", "visible"), h = o.append("g"), E = !1, re = !!f.initialFocus && f.initialFocus !== "all", ce = f.initialFocusMinScale == null ? .4 : f.initialFocusMinScale, me = 0, he = null, ge = 0, _e = !1, ve = null, ye = {
			x: 0,
			y: 0,
			k: 1
		}, be = () => me ? ` rotate(${-me})` : "", xe = (e) => (0, bs.rotatedView)(e, he, me);
		function Se(e) {
			ye = xe(e), h.attr("transform", `translate(${ye.x},${ye.y}) rotate(${me}) scale(${ye.k})`), d && d.style("transform", `translate3d(${ye.x}px, ${ye.y}px, 0px) rotate(${me}deg) scale(${ye.k})`), t && t.style.setProperty("--gv-unrot", `${-me}deg`), ge !== me && (ge = me, _e && fr());
		}
		let Ce = (e, t) => (0, bs.viewToScreen)(ye, me, e, t), we = Fo().on("zoom", (e) => {
			e.sourceEvent && (E = !0, re = !1), Se(e.transform);
			let t = e.transform.k;
			de.current = t, Ln && Bn(), A.current && A.current(), _e && $t();
			let n = Is(t);
			n !== fe.current && (fe.current = n, rr(), dr());
		});
		o.call(we).on("dblclick.zoom", null);
		let Te = (e) => {
			let t = e.touches[0], n = e.touches[1];
			return Math.atan2(n.clientY - t.clientY, n.clientX - t.clientX) * 180 / Math.PI;
		}, Ee = (e) => {
			let n = t.getBoundingClientRect(), r = e.touches[0], i = e.touches[1];
			return [(r.clientX + i.clientX) / 2 - n.left, (r.clientY + i.clientY) / 2 - n.top];
		}, De = (e) => {
			if (e.touches.length !== 2) return;
			let [t, n] = Ee(e);
			he = {
				theta0: me,
				a0: Te(e),
				mx: t,
				my: n,
				started: !1
			};
		}, Oe = (e) => {
			if (!he || e.touches.length !== 2) return;
			let [t, n] = Ee(e);
			he.mx = t, he.my = n;
			let r = (0, bs.angleDelta)(Te(e), he.a0);
			if (!he.started) {
				if (Math.abs(r) < 10) return;
				he.started = !0, he.a0 = Te(e);
				return;
			}
			me = (0, bs.normalizeAngle)(he.theta0 + r);
		}, ke = (e) => {
			if (!he || e.touches.length >= 2) return;
			let t = xe(Eo(o.node()));
			he = null, o.call(we.transform, To.translate(t.x, t.y).scale(t.k));
		};
		t.addEventListener("touchstart", De, {
			capture: !0,
			passive: !0
		}), t.addEventListener("touchmove", Oe, {
			capture: !0,
			passive: !0
		}), t.addEventListener("touchend", ke, {
			capture: !0,
			passive: !0
		}), t.addEventListener("touchcancel", ke, {
			capture: !0,
			passive: !0
		});
		function Ae({ repaint: e = !0 } = {}) {
			if (!me && !he) return;
			he = null;
			let t = Eo(o.node()), i = n / 2, a = r / 2, s = (0, bs.screenToView)(ye, me, i, a);
			me = 0, e && o.call(we.transform, To.translate(i - s[0] * t.k, a - s[1] * t.k).scale(t.k));
		}
		let je = (0, Ss.createTapGate)({
			ms: Number.isFinite(f.doubleTapMs) ? f.doubleTapMs : 250,
			px: 32
		});
		function Me(e) {
			let i = e && e.changedTouches && e.changedTouches.length ? e.changedTouches[0] : e, a = t.getBoundingClientRect();
			return !i || !Number.isFinite(i.clientX) ? [n / 2, r / 2] : [i.clientX - a.left, i.clientY - a.top];
		}
		function Ne(e, t, n) {
			E = !0, re = !1, o.transition("tap-zoom").duration(320).ease(Zi).call(we.scaleBy, n, [e, t]);
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
		t.addEventListener("touchstart", Le, {
			capture: !0,
			passive: !0
		}), t.addEventListener("touchmove", Re, {
			capture: !0,
			passive: !0
		}), t.addEventListener("touchend", ze, {
			capture: !0,
			passive: !0
		});
		let Be = !1;
		if (k.current && (Be = (0, _s.layoutIsDegenerate)(a.nodes.map((e) => k.current.nodeState(P(e))).filter((e) => e && Number.isFinite(e.x) && Number.isFinite(e.y)), ee({
			hovered: !1,
			pinned: !1
		}))), k.current && !Be) for (let e of a.nodes) {
			let t = k.current.nodeState(P(e)), n = k.current.nodeState(se(e));
			t && typeof t.x == "number" && typeof t.y == "number" && (e.x = t.x, e.y = t.y, t.auto || (e.fx = t.x, e.fy = t.y)), n && typeof n.w == "number" && typeof n.h == "number" && (e._size = {
				width: n.w,
				height: n.h
			});
		}
		if (le.current = /* @__PURE__ */ new Set(), k.current) for (let e of a.nodes) {
			let t = k.current.nodeState(se(e));
			e.type === "article" && t && t.pinned && le.current.add(e.id);
		}
		if (k.current && Be) for (let e of a.nodes) {
			let t = k.current.nodeState(se(e));
			t && typeof t.w == "number" && typeof t.h == "number" && (e._size = {
				width: t.w,
				height: t.h
			});
		}
		let F = $a().force("link", Wa().id((e) => e.id).distance(g.linkDistance)).force("charge", eo().strength(g.chargeStrength)).force("collide", Va().radius((e) => (e._r || (e.type === "article" ? Math.hypot(p.width, p.height) / 2 : e.size / 2)) + g.collidePadding).strength(1).iterations(3)).force("center", ma(n / 2, r / 2)).velocityDecay(g.velocityDecay).alphaDecay(g.alphaDecay), Ve = () => {
			ie.current && ie.current(), S.current && (n = S.current.clientWidth, r = S.current.clientHeight, o.attr("width", n).attr("height", r));
		};
		window.addEventListener("resize", Ve);
		let He = o.append("g").attr("class", "time-axis-layer"), Ue = h.append("g").attr("class", "roots-layer").attr("aria-hidden", "true").style("pointer-events", "none"), We = h.append("g").attr("class", "containers-layer"), Ge = /* @__PURE__ */ new Map(), Ke = /* @__PURE__ */ new Map();
		for (let e of a.containers || []) Ge.set(e.id, /* @__PURE__ */ new Set()), Ke.set(e.id, /* @__PURE__ */ new Set());
		for (let e of a.containmentEdges || []) Ge.has(e.source) && Ge.has(e.target) ? Ge.get(e.source).add(e.target) : Ke.has(e.source) && Ke.get(e.source).add(e.target);
		let qe = /* @__PURE__ */ new Map();
		function Je(e, t) {
			if (!t && qe.has(e)) return qe.get(e);
			let n = t || /* @__PURE__ */ new Set();
			if (n.has(e)) return [];
			n.add(e);
			let r = Array.from(Ke.get(e) || []), i = Array.from(Ge.get(e) || []).flatMap((e) => Je(e, n)), a = Array.from(new Set([...r, ...i]));
			return t || qe.set(e, a), a;
		}
		let Ye = [...a.containers || []].sort((e, t) => t.parent === e.id ? -1 : +(e.parent === t.id)), Xe = We.selectAll(".container-group").data(Ye, (e) => e.id).enter().append("g").attr("class", "container-group").attr("data-container-id", (e) => e.id);
		Xe.append("path").attr("class", "container-hull").attr("fill", (e) => e.fill || "rgba(212, 175, 55, 0.03)").attr("stroke", (e) => e.stroke || "rgba(212, 175, 55, 0.45)").attr("stroke-width", (e) => e.strokeWidth || 1.5).attr("stroke-dasharray", (e) => e.strokeDasharray || (e.parent ? null : "6 6")), Xe.append("path").attr("class", "container-hull-ghost").attr("stroke", (e) => e.stroke || "rgba(212, 175, 55, 0.45)");
		let Ze = typeof document < "u" && document.documentElement.getAttribute("data-pp-theme") === "sketchbook", Qe = () => f.initialCollapsed === "all" ? (e.containers || []).map((e) => e.id) : Array.isArray(f.initialCollapsed) ? f.initialCollapsed : [], $e = new Set(Qe()), et = /* @__PURE__ */ new Map(), tt = /* @__PURE__ */ new Map(), nt = 1.05, rt = (0, ys.showContainerCount)(f);
		function it(e) {
			let t = (e.label || e.id).split(/\s+/), n = [], r = "";
			for (let e of t) r ? r.length + 1 + e.length > 15 ? (n.push(r), r = e) : r += " " + e : r = e;
			return r && n.push(r), n;
		}
		let at = .42, ot = .2, st = (e) => e.status ? String(e.status) : "";
		function ct(e) {
			let t = it(e).length, n = st(e) ? ot + at * 1.3 : 0;
			return {
				n: t,
				statusH: n,
				total: t * nt + n
			};
		}
		function lt(e, t) {
			let n = it(t), { n: r, total: i } = ct(t), a = -i / 2;
			e.selectAll("*").remove(), n.forEach((t, n) => {
				e.append("tspan").attr("class", "label-line").attr("x", 0).attr("y", `${a + (n + .5) * nt}em`).text(t), rt && n === r - 1 && e.append("tspan").attr("class", "label-count").attr("font-weight", "500").attr("dx", "12px").attr("font-size", "0.5em").text("");
			});
			let o = st(t);
			if (o) {
				let t = a + r * nt + ot + at * 1.3 / 2;
				e.append("tspan").attr("class", "label-status").attr("x", 0).attr("font-size", `${at}em`).attr("font-weight", "500").attr("letter-spacing", "0.02em").attr("y", `${t / at}em`).text(o);
			}
		}
		let ut = typeof document < "u" ? document.createElement("canvas").getContext("2d") : null;
		function dt() {
			return typeof document > "u" ? "'Atkinson', sans-serif" : getComputedStyle(document.documentElement).getPropertyValue("--pp-title-font").trim() || "'Atkinson', sans-serif";
		}
		function ft(e, t, n) {
			let r = e.length * t * .05;
			return ut ? (ut.font = `${Ze ? 400 : n} ${t}px ${dt()}`, ut.measureText(e).width * 1.06 + r) : e.length * t * .6 + r;
		}
		function pt(e, t) {
			let n = it(e), r = rt ? ft(" 000", t * .5, 500) + 12 : 0, i = st(e), a = Math.max(...n.map((e, i) => ft(e, t, 700) + (i === n.length - 1 ? r : 0)), i ? ft(i, t * at, 500) : 0), o = ct(e).total * t + .3 * t;
			return {
				w: a + 24,
				h: o + 12
			};
		}
		function mt(e) {
			return e.badgeColor || e.color || e.stroke || "#d4af37";
		}
		let ht = Xe.append("g").attr("class", "container-badge").attr("data-container-top", (e) => e.parent ? null : "").style("touch-action", "manipulation");
		ht.append("rect").attr("class", "container-badge-hit").attr("fill", "transparent").attr("pointer-events", "all");
		let gt = ht.append("text").attr("class", "container-badge-text").attr("text-anchor", "middle").attr("dominant-baseline", "central").style("user-select", "none").attr("fill", (e) => mt(e)).attr("opacity", .55).attr("font-size", (e) => e.parent ? "52px" : "64px");
		gt.each(function(e) {
			lt(L(this), e);
		});
		function _t() {
			if (typeof document > "u") return;
			let e = typeof window < "u" ? window.SETTINGS : null, t = document.documentElement.getAttribute("data-pp-mode") || "dark", n = getComputedStyle(document.body).backgroundColor, r = !n || /rgba\([^)]*,\s*0\)$/.test(n) || n === "transparent", i = (0, Ds.allBackgrounds)((0, Ds.config)(e), t, r ? null : n);
			gt.each(function(e) {
				let t = (0, Ds.legibleOn)(mt(e), i, { opacity: .55 });
				L(this).attr("fill", t.color).attr("opacity", t.opacity);
			});
		}
		_t();
		function vt() {
			_t();
			let e = document.documentElement.getAttribute("data-pp-theme") === "sketchbook";
			if (e === Ze) return;
			Ze = e;
			let t = () => {
				_e && (bn(), fr());
			};
			document.fonts && document.fonts.load ? document.fonts.load(`48px ${dt()}`).then(t, t) : t();
		}
		let yt = typeof MutationObserver < "u" ? new MutationObserver(vt) : null;
		Ze && typeof document < "u" && document.fonts && document.fonts.load && document.fonts.load(`48px ${dt()}`).then(() => {
			!_e || !C.current || (bn(), fr());
		}, () => {}), yt && yt.observe(document.documentElement, {
			attributes: !0,
			attributeFilter: ["data-pp-mode", "data-pp-theme"]
		});
		let bt = Xe.append("g").attr("class", "container-macro-node").style("display", "none").style("touch-action", "manipulation");
		bt.append("path").attr("class", "container-macro-bg").style("fill", (e) => `color-mix(in srgb, ${mt(e)} 16%, var(--pp-macro-base, #151826))`).attr("stroke", (e) => mt(e)).attr("stroke-width", 2.2).style("filter", (e) => `drop-shadow(0 0 18px color-mix(in srgb, ${mt(e)} 45%, transparent))`);
		let xt = Math.round((p.labelMaxFontSize || 26) * 1.6), St = bt.append("text").attr("class", "container-macro-text").attr("text-anchor", "middle").attr("dominant-baseline", "central").attr("fill", (e) => mt(e)).attr("font-size", (e) => `${e.parent ? xt : Math.round(xt * 1.25)}px`).attr("font-family", "'Atkinson', sans-serif").attr("font-weight", "700").attr("letter-spacing", "-0.02em"), Ct = z().curve(xo.alpha(.5));
		function wt(e, t, n) {
			let r = 0;
			for (let t = 0; t < e.length; t++) r = r * 31 + e.charCodeAt(t) >>> 0;
			let i = () => (r = r * 1664525 + 1013904223 >>> 0, r / 4294967296), a = [];
			for (let e = 0; e < 14; e++) {
				let r = e / 14 * Math.PI * 2, o = Math.cos(r), s = Math.sin(r), c = 2 / 2.8, l = 1 + (i() - .5) * .08;
				a.push([Math.sign(o) * Math.abs(o) ** +c * t * l, Math.sign(s) * Math.abs(s) ** +c * n * l]);
			}
			return Ct(a);
		}
		St.each(function(e) {
			lt(L(this), e);
		});
		function Tt() {
			bt.each(function(e) {
				let t = L(this), n = parseFloat(t.select(".container-macro-text").attr("font-size")) || xt, r = pt(e, n), i = Math.max(p.width * 1.5, r.w + n * 1.4), a = Math.max(p.height * 1.5, r.h + n * 1.4);
				t.select(".container-macro-bg").attr("d", wt(e.id, i / 2, a / 2)), e._macroHalfW = i / 2, e._macroHalfH = a / 2;
			});
		}
		Tt();
		function Et({ isCollapsed: e }) {
			return rn().clickDistance(5).filter((e) => !(e.ctrlKey || e.button !== void 0 && e.button !== 0)).on("start", function(e, t) {
				e.sourceEvent && e.sourceEvent.stopPropagation();
				let n = e.x, r = e.y;
				L(this).datum()._dragState = {
					startX: n,
					startY: r,
					lastX: n,
					lastY: r,
					totalMove: 0
				};
			}).on("drag", function(e, t) {
				let n = L(this).datum()._dragState;
				if (!n) return;
				let r = e.x - n.lastX, i = e.y - n.lastY;
				n.lastX = e.x, n.lastY = e.y, n.totalMove += Math.hypot(r, i);
				let a = Je(t.id);
				for (let e of a) {
					let t = Ot.get(e);
					t && (t.x += r, t.y += i, t.fx = t.x, t.fy = t.y, k.current && k.current.setNodePosition(P(t), t.x, t.y, { transient: !0 }));
				}
				fr(), A.current && A.current();
			}).on("end", function(t, n) {
				let r = L(this).datum()._dragState;
				if (delete L(this).datum()._dragState, (r ? r.totalMove : 0) >= 4) {
					qt = !1;
					let e = Je(n.id), t = k.current;
					for (let n of e) {
						let e = Ot.get(n);
						e && (e.fx = e.x, e.fy = e.y, t && t.setNodePosition(P(e), e.x, e.y, { transient: !0 }));
					}
					t && t.commit(), fr();
				} else {
					let r = () => {
						e ? _n([n.id], !0) : _n([n.id], $e.has(n.id));
					};
					(s.collapseGesture || "tap") === "doubletap" ? Pe(t.sourceEvent, () => {}, r) : Pe(t.sourceEvent, r);
				}
			});
		}
		ht.call(Et({ isCollapsed: !1 })), bt.call(Et({ isCollapsed: !0 })), ht.on("click", (e) => e.stopPropagation()), bt.on("click", (e) => e.stopPropagation());
		let Dt = z().curve(xo.alpha(.5)), Ot = new Map(a.nodes.map((e) => [e.id, e])), kt = new Map((a.containers || []).map((e) => [e.id, e])), At = (e) => {
			let t = 0, n = e.parent;
			for (; n && kt.has(n) && t < 20;) t++, n = kt.get(n).parent;
			return t;
		}, jt = s.labelSize && s.labelSize.min || 32, Mt = s.labelSize && s.labelSize.max || 96, Nt = s.labelSize && s.labelSize.nestedScale || .75, Pt = () => {
			let e = /* @__PURE__ */ new Map();
			for (let t of a.containers || []) e.set(t.id, Array.from(Ke.get(t.id) || []).map((e) => Ot.get(e)).filter(Boolean).map((e) => ({
				id: e.id,
				w: e._size && e._size.width || (e.type === "article" ? p.width : e.size),
				h: e._size && e._size.height || (e.type === "article" ? p.height : e.size),
				order: Number.isFinite(e.series_part) ? e.series_part : null,
				date: e.date || ""
			})));
			return e;
		}, I = {
			roots: [],
			nodes: /* @__PURE__ */ new Map(),
			containers: /* @__PURE__ */ new Map()
		};
		function Ft() {
			if (!a.containers || a.containers.length === 0) return;
			let e = Pt(), t = () => (0, vs.containerLayout)({
				containers: a.containers,
				members: e,
				closed: $e,
				labelSize: (e) => pt(e, e._fs || jt),
				macroSize: (e) => ({
					w: (e._macroHalfW || 130) * 2,
					h: (e._macroHalfH || 45) * 2
				}),
				options: {
					spacing: s.spiral?.spacing ?? 20,
					mode: ne.current === "radial" ? "ring" : s.spiral?.mode || "path",
					startRadius: s.spiral?.startRadius,
					direction: s.spiral?.direction,
					gap: 28,
					padding: (e) => e.padding == null ? e.parent ? 42 : 75 : e.padding
				}
			});
			for (let e of a.containers) e._fs = jt;
			let n = t();
			for (let e of a.containers) {
				let t = n.containers.get(e.id), r = t ? t.box.x1 - t.box.x0 : 0, i = Mt * Nt ** +At(e);
				e._fs = Math.max(jt, Math.min(Math.max(jt, i), r / 8));
			}
			n = t(), I = n;
		}
		function It(e) {
			let t = 0, n = 0, r = 0;
			for (let [i, a] of I.nodes) {
				if (a.root !== e) continue;
				let o = Ot.get(i);
				!o || !Number.isFinite(o.x) || !Number.isFinite(o.y) || (t += o.x - a.x, n += o.y - a.y, r++);
			}
			return r ? {
				x: t / r,
				y: n / r
			} : null;
		}
		function Lt(e) {
			let t = 0, n = 0, r = 0;
			for (let i of Je(e)) {
				let e = I.nodes.get(i), a = Ot.get(i);
				!e || !a || !Number.isFinite(a.x) || !Number.isFinite(a.y) || (t += a.x - e.x, n += a.y - e.y, r++);
			}
			return r ? {
				x: t / r,
				y: n / r
			} : null;
		}
		let Rt = () => s.spiral?.enabled !== !1 && (ne.current === "force" || ne.current === "radial"), zt = new Map(Object.entries(Ms(e)).filter(([e]) => kt.has(e))), Bt = typeof window < "u" && window.PostPipeCoverFrame || null, Vt = () => zt.size > 0 && !!(Bt && Bt.art) && Rt() && ne.current === "force" && I.containers.size > 0, Ht = /* @__PURE__ */ new Map();
		for (let e of [...zt.keys()].sort((e, t) => At(kt.get(t)) - At(kt.get(e)))) for (let t of Je(e)) Ht.has(t) || Ht.set(t, e);
		function Ut(e) {
			let t = I.containers.get(e), n = t && Lt(e);
			return n ? {
				x: n.x + t.center.x,
				y: n.y + t.center.y
			} : null;
		}
		function Wt() {
			if (!S.current) return {
				x: 0,
				y: 0
			};
			let e = S.current.getBoundingClientRect(), t = typeof window < "u" && window.PostPipeCover && window.PostPipeCover.shift || 0;
			return {
				x: e.left,
				y: e.top - t
			};
		}
		function Gt() {
			let e = /* @__PURE__ */ new Map();
			if (!Vt()) return e;
			let t = (0, Es.homeView)(ce), n = Wt();
			for (let [r, i] of zt) e.set(r, (0, Es.anchorWorld)(i, Bt.art, t, n));
			return e;
		}
		let Kt = !1, qt = !1;
		if (zt.size) {
			let e = k.current, t = !1;
			if (e && !Be) for (let n of Ht.keys()) {
				let r = Ot.get(n), i = r && e.nodeState(P(r));
				i && Number.isFinite(i.x) && Number.isFinite(i.y) && (t = !0, r.fx = r.x, r.fy = r.y);
			}
			Kt = !t;
		}
		function Jt() {
			if (!Vt()) return !1;
			for (let [e, t] of Gt()) {
				let n = Ut(e);
				if (!n) continue;
				let r = t.x - n.x, i = t.y - n.y;
				for (let t of Je(e)) {
					let e = Ot.get(t);
					!e || !Number.isFinite(e.x) || !Number.isFinite(e.y) || (e.x += r, e.y += i, e.fx = e.x, e.fy = e.y, e.vx = 0, e.vy = 0);
				}
			}
			return Kt = !1, qt = !0, !0;
		}
		let Yt = () => zt.size ? [...zt.keys()] : (a.containers || []).filter((e) => e.parent && !kt.get(e.parent)?.parent).map((e) => e.id), Xt = /* @__PURE__ */ new WeakMap();
		function Zt(e) {
			let t = e.getAttribute("d") || "", n = Xt.get(e);
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
			return Xt.set(e, {
				d: t,
				pts: r
			}), r;
		}
		function Qt() {
			let e = [];
			if (!_e) return {
				containers: e,
				k: de.current,
				homeK: ve
			};
			for (let t of Yt()) {
				let n = Xe.filter((e) => e.id === t), r = n.node();
				if (!r || r.style.display === "none") continue;
				let i = $e.has(t), a = n.select(i ? ".container-macro-bg" : ".container-hull").node();
				if (!a || !i && a.style.display === "none") continue;
				let o = Zt(a), s = a.getScreenCTM();
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
				k: de.current,
				homeK: ve
			};
		}
		function $t() {
			typeof window > "u" || window.dispatchEvent(new CustomEvent("graph:world"));
		}
		typeof window < "u" && (window.PostPipeGraphWorld = { snapshot: Qt });
		function en() {
			function e(e) {
				if (!Rt() || ne.current !== "force") return;
				let t = s.spiral?.strength ?? .35, n = /* @__PURE__ */ new Map();
				if (Vt()) for (let e of zt.keys()) n.set(e, Lt(e));
				for (let r of I.roots) {
					let i = It(r);
					for (let [a, o] of I.nodes) {
						if (o.root !== r) continue;
						let s = Ot.get(a);
						if (!s || !Number.isFinite(s.x)) continue;
						let c = Ht.get(a), l = c && n.get(c) || i;
						l && (s.vx += (l.x + o.x - s.x) * t * e, s.vy += (l.y + o.y - s.y) * t * e);
					}
				}
			}
			return e.initialize = function() {}, e;
		}
		function tn() {
			let e = [], t = (e) => e.type === "article" ? Math.hypot(e._size?.width || p.width, e._size?.height || p.height) / 2 : e._r || (e.size || 60) / 2;
			function n(n) {
				if (!a.containers || a.containers.length === 0) return;
				let r = [];
				for (let e of I.roots) {
					let t = I.containers.get(e), n = It(e);
					if (!t || !n) continue;
					let i = Je(e).map((e) => Ot.get(e)).filter((e) => e && Number.isFinite(e.x));
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
				}, o = s.containerSpacing === void 0 ? -20 : s.containerSpacing;
				for (let e = 0; e < r.length; e++) for (let t = e + 1; t < r.length; t++) {
					let n = r[e], a = r[t], s = a.x - n.x, c = a.y - n.y;
					i(s, c, Math.hypot(s, c), n.r + a.r + o, (e, t) => {
						for (let r of n.members) r.vx -= e, r.vy -= t;
						for (let n of a.members) n.vx += e, n.vy += t;
					});
				}
				let c = new Set(I.nodes.keys()), l = (e.length ? e : a.nodes).filter((e) => !c.has(e.id) && Number.isFinite(e.x));
				for (let e of r) for (let n of l) {
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
		a.containers && a.containers.length > 0 && (Ft(), F.force("containerSeparation", tn()), F.force("containerLayout", en()));
		let nn = /* @__PURE__ */ new Set(), an = (e) => (I.nodes.get(e) || {}).root || null, on = (e) => typeof e == "object" ? e.id : e;
		function sn() {
			nn = /* @__PURE__ */ new Set();
			for (let e of $e) for (let t of Je(e)) nn.add(t);
			F.force("collide").radius((e) => nn.has(e.id) ? 0 : I.nodes.has(e.id) && e.type === "article" ? Math.min(e._size?.width || p.width, e._size?.height || p.height) / 2 : (e._r || (e.type === "article" ? Math.hypot(p.width, p.height) / 2 : e.size / 2)) + g.collidePadding), F.force("charge").strength((e) => nn.has(e.id) ? 0 : I.nodes.has(e.id) ? g.chargeStrength * .05 : g.chargeStrength);
		}
		if (I.nodes.size > 0) {
			sn();
			let e = F.force("link"), t = e.strength();
			e.strength((e) => {
				let n = an(on(e.source));
				return n && n === an(on(e.target)) ? 0 : t(e);
			});
		}
		function cn(e) {
			let t = n / 2;
			for (let i of I.roots) {
				let a = I.containers.get(i);
				if (!a) continue;
				let o = a.box.x1 - a.box.x0, s = t - (a.box.x0 + a.box.x1) / 2 + (t === n / 2 ? 0 : o / 2), c = r / 2 - (a.box.y0 + a.box.y1) / 2;
				for (let [t, n] of I.nodes) {
					if (n.root !== i) continue;
					let r = Ot.get(t);
					r && (e || !Number.isFinite(r.x) || !Number.isFinite(r.y)) && (r.x = s + n.x, r.y = c + n.y, r.vx = 0, r.vy = 0);
				}
				t += (t === n / 2 ? o / 2 : o) + 200;
			}
		}
		I.nodes.size > 0 && cn(Be);
		function ln() {
			if (!a.containers || a.containers.length === 0 || (Ft(), sn(), I.nodes.size === 0)) return null;
			let e = {}, t = 0;
			for (let n of I.roots) {
				let r = I.containers.get(n);
				if (!r) continue;
				let i = t - r.box.x0, a = -(r.box.y0 + r.box.y1) / 2;
				for (let [t, r] of I.nodes) r.root === n && (e[t] = {
					x: i + r.x,
					y: a + r.y
				});
				t += r.box.x1 - r.box.x0 + 200;
			}
			let n = a.nodes.filter((e) => !I.nodes.has(e.id));
			if (n.length) {
				let r = (0, _s.radialLayout)(n, {
					cardW: p.width,
					cardH: p.height
				}), i = Object.values(r).map((e) => e.x), a = i.length ? t + p.width - Math.min(...i) : t;
				for (let [t, n] of Object.entries(r)) e[t] = {
					x: n.x + a,
					y: n.y
				};
			}
			return e;
		}
		function un() {
			!a.containers || a.containers.length === 0 || (Ft(), sn());
		}
		function dn(e) {
			let t = e.parent, n = 0;
			for (; t && n++ < 20;) {
				if ($e.has(t)) return !0;
				t = kt.get(t)?.parent;
			}
			return !1;
		}
		function fn() {
			if (Ye.length === 0) return;
			$t();
			let e = Rt() && I.containers.size > 0, t = (t) => {
				let n = e ? I.containers.get(t.id) : null, r = n ? Lt(t.id) : null;
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
				let r = Je(e.id).map((e) => Ot.get(e)).filter((e) => e && Number.isFinite(e.x));
				return r.length ? {
					x: x(r, (e) => e.x),
					y: x(r, (e) => e.y)
				} : null;
			};
			Xe.each(function(e) {
				let r = L(this), i = Je(e.id).map((e) => Ot.get(e)).filter((e) => e && Number.isFinite(e.x) && Number.isFinite(e.y));
				if (i.length === 0 || dn(e)) {
					r.style("display", "none"), tt.delete(e.id);
					return;
				}
				let a = $e.has(e.id), o = e._fs || 52, s = t(e);
				if (a) {
					let t = n(e);
					et.set(e.id, t), tt.set(e.id, t), r.style("display", null), r.select(".container-hull").style("display", "none"), r.select(".container-hull-ghost").attr("d", ""), r.select(".container-badge").style("display", "none"), r.select(".container-macro-node").style("display", null).attr("transform", `translate(${t.x}, ${t.y})${be()}`).select(".label-count").text((0, ys.containerCountText)(f, i.length));
					return;
				}
				let c = x(i, (e) => e.x), l = x(i, (e) => e.y);
				et.set(e.id, {
					x: c,
					y: l
				}), r.style("display", null), r.select(".container-macro-node").style("display", "none"), r.select(".container-hull").style("display", null), r.select(".container-badge").style("display", null);
				let u = [], d = e.padding || (e.parent ? 42 : 75);
				for (let t of Ge.get(e.id) || []) {
					if (!$e.has(t)) continue;
					let e = kt.get(t), r = e && n(e);
					if (!r) continue;
					let i = (e._macroHalfW || 130) + d / 2, a = (e._macroHalfH || 45) + d / 2;
					u.push([r.x - i, r.y - a], [r.x + i, r.y - a], [r.x + i, r.y + a], [r.x - i, r.y + a]);
				}
				let m = i.filter((e) => {
					for (let t of $e) if (Je(t).includes(e.id)) return !1;
					return !0;
				});
				for (let e of m) {
					let t = e._size?.width || (e.type === "article" ? p.width : e.size), n = e._size?.height || (e.type === "article" ? p.height : e.size), r = t / 2 + d, i = n / 2 + d;
					u.push([e.x - r, e.y - i], [e.x + r, e.y - i], [e.x + r, e.y + i], [e.x - r, e.y + i]);
				}
				let h = Ns(e), g = null;
				if (s) {
					let n = d / 2, r = [], i = (e) => {
						for (let n of Ge.get(e) || []) {
							if ($e.has(n)) continue;
							let e = kt.get(n), a = e && t(e);
							a && Ns(e) !== "hidden" && r.push({
								L: a.info.label,
								off: a.off
							}), i(n);
						}
					};
					i(e.id);
					for (let { L: e, off: t } of r) u.push([t.x + e.x0 - n, t.y + e.y0 - n], [t.x + e.x1 + n, t.y + e.y0 - n], [t.x + e.x1 + n, t.y + e.y1 + n], [t.x + e.x0 - n, t.y + e.y1 + n]);
					let a = s.info.label;
					g = {
						x: s.off.x + (a.x0 + a.x1) / 2,
						y: s.off.y + (a.y0 + a.y1) / 2
					}, h === "center" && u.push([s.off.x + a.x0 - n, s.off.y + a.y0 - n], [s.off.x + a.x1 + n, s.off.y + a.y0 - n], [s.off.x + a.x1 + n, s.off.y + a.y1 + n], [s.off.x + a.x0 - n, s.off.y + a.y1 + n]);
				}
				if (u.length === 0) {
					r.select(".container-hull-ghost").attr("d", ""), r.select(".container-hull").style("display", "none"), r.select(".container-badge").style("display", "none");
					return;
				}
				let _ = ao(u);
				if (!_ || _.length < 3) return;
				r.select(".container-hull").attr("d", Dt(_)), r.select(".container-hull-ghost").attr("d", Ze ? Dt((0, Vo.jitterPoints)(_, e.id, 3.5)) : "");
				let v = r.select(".container-badge");
				v.attr("data-label-position", h), v.select(".label-count").text((0, ys.containerCountText)(f, i.length));
				let S = (t) => {
					let n = pt(e, t);
					v.select(".container-badge-hit").attr("x", -n.w / 2).attr("y", -n.h / 2).attr("width", n.w).attr("height", n.h);
				};
				if (h === "hidden") {
					v.style("display", "none"), tt.set(e.id, g || {
						x: x(_, (e) => e[0]),
						y: x(_, (e) => e[1])
					});
					return;
				}
				if (h === "top") {
					let t = g ? o : Math.max(jt, Math.min(Mt, (y(_, (e) => e[0]) - b(_, (e) => e[0])) / 8)), n = pt(e, t), r = b(_, (e) => e[1]), i = {
						x: (b(_, (e) => e[0]) + y(_, (e) => e[0])) / 2,
						y: r + d * .5 + n.h / 2
					};
					v.select(".container-badge-text").attr("font-size", `${t}px`), S(t), v.attr("transform", `translate(${i.x}, ${i.y})${be()}`), tt.set(e.id, i);
					return;
				}
				if (g) {
					v.select(".container-badge-text").attr("font-size", `${o}px`), S(o), v.attr("transform", `translate(${g.x}, ${g.y})${be()}`), tt.set(e.id, g);
					return;
				}
				let C = Math.min(..._.map((e) => e[1])), w = Math.max(..._.map((e) => e[1])), T = Math.min(..._.map((e) => e[0])), E = Math.max(..._.map((e) => e[0])), D = Math.max(jt, Math.min(Mt, (E - T) / 8));
				v.select(".container-badge-text").attr("font-size", `${D}px`), S(D);
				let O = to(_), k = Number.isFinite(O[0]) ? O[0] : x(_, (e) => e[0]);
				v.attr("transform", `translate(${k}, ${C + (w - C) / 3})${be()}`), tt.set(e.id, {
					x: k,
					y: C + (w - C) / 3
				});
			});
		}
		let pn = /* @__PURE__ */ new Set();
		function mn() {
			pn = (0, xs.closedMemberSet)($e, Je);
			for (let e of a.nodes) e._closedHidden = pn.has(e.id);
			Zn && Zn.style("display", (e) => pn.has(e.id) ? "none" : null), Un.style("display", (e) => pn.has(e.id) ? "none" : null);
			let e = (e) => (0, xs.edgeHidden)(e, pn) ? "none" : null;
			On.style("display", e), An.style("display", e), Dn.style("display", e), Nn.style("display", e), Ln && (0, xs.edgeHidden)(Ln, pn) && Hn();
		}
		function hn() {
			mn(), bn(), fn(), fr();
		}
		function gn() {
			return Object.fromEntries((a.containers || []).map((e) => [e.id, $e.has(e.id) ? "closed" : "open"]));
		}
		function _n(e, t) {
			let n = !1;
			for (let r of e) kt.has(r) && (t && $e.has(r) && ($e.delete(r), n = !0), !t && !$e.has(r) && ($e.add(r), n = !0));
			return n ? (hn(), typeof window < "u" && window.dispatchEvent(new CustomEvent("graph:containers-changed", { detail: gn() })), !0) : !1;
		}
		let vn = () => (a.containers || []).map((e) => e.id), yn = {
			openContainer: (e) => _n([e], !0),
			closeContainer: (e) => _n([e], !1),
			toggleContainer: (e) => _n([e], $e.has(e)),
			openAllContainers: () => _n(vn(), !0),
			closeAllContainers: () => _n(vn(), !1),
			getContainerState: gn
		};
		l && (l.current = yn);
		function bn() {
			if (!a.containers || a.containers.length === 0) return;
			let e = new Map(I.roots.map((e) => [e, It(e)])), t = /* @__PURE__ */ new Map();
			if (Vt()) for (let e of zt.keys()) {
				let n = Ut(e);
				n && t.set(e, n);
			}
			if (Tt(), Ft(), sn(), !Rt()) return;
			let n = [];
			for (let [e, r] of I.nodes) {
				let i = Ot.get(e), a = Ht.get(e);
				if (!i || !Number.isFinite(i.x) || !a || !t.has(a)) continue;
				let o = t.get(a), s = I.containers.get(a);
				n.push({
					n: i,
					x0: i.x,
					y0: i.y,
					x1: o.x - s.center.x + r.x,
					y1: o.y - s.center.y + r.y
				});
			}
			if (!Lr && !n.length) {
				F.alpha(Math.max(F.alpha(), .3)).restart();
				return;
			}
			for (let [r, i] of I.nodes) {
				let a = Ot.get(r), o = e.get(i.root), s = Ht.get(r);
				s && t.has(s) || !a || !o || !Number.isFinite(a.x) || n.push({
					n: a,
					x0: a.x,
					y0: a.y,
					x1: o.x + i.x,
					y1: o.y + i.y
				});
			}
			Ji("container-relayout").duration(600).ease(Qi).tween("container-relayout", () => (e) => {
				for (let t of n) t.n.x = t.x0 + (t.x1 - t.x0) * e, t.n.y = t.y0 + (t.y1 - t.y0) * e, t.n.fx = t.n.x, t.n.fy = t.n.y;
				fr(), A.current && A.current();
			}).on("end", () => {
				E || Fr({ animate: !0 });
			});
		}
		function xn(e) {
			let t = ue.current === e.id, n = le.current.has(e.id), r = Is(de.current);
			if (r === "marker" && !t && !n) return {
				w: 8,
				h: 8
			};
			let i = e._size || ee({
				hovered: t,
				pinned: n,
				lod: r
			});
			return {
				w: i.width / 2,
				h: i.height / 2
			};
		}
		function Sn(e) {
			let t = typeof e.source == "object" ? e.source.x : 0, n = typeof e.source == "object" ? e.source.y : 0, r = typeof e.target == "object" ? e.target.x : 0, i = typeof e.target == "object" ? e.target.y : 0, a = typeof e.source == "object" ? e.source.id : e.source, o = typeof e.target == "object" ? e.target.id : e.target;
			if ((0, xs.edgeHidden)(e, pn)) return {
				x1: 0,
				y1: 0,
				x2: 0,
				y2: 0,
				hidden: !0
			};
			let s = null, c = null;
			for (let e of $e) {
				let t = Je(e);
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
				let e = et.get(s);
				e && (t = e.x, n = e.y);
			}
			if (c) {
				let e = et.get(c);
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
			let f = l / d, p = u / d, m = xn(e.source), h = s ? 90 : m.w + 4, g = s ? 45 : m.h + 4, _ = Math.min(Math.abs(f) > 1e-4 ? h / Math.abs(f) : Infinity, Math.abs(p) > 1e-4 ? g / Math.abs(p) : Infinity), v = xn(e.target), y = c ? 90 : v.w + 4, b = c ? 45 : v.h + 4, x = Math.min(Math.abs(f) > 1e-4 ? y / Math.abs(f) : Infinity, Math.abs(p) > 1e-4 ? b / Math.abs(p) : Infinity);
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
		function Cn(e, t) {
			if (t.hidden) return "";
			if (e.layer !== "sequence") return `M ${t.x1} ${t.y1} L ${t.x2} ${t.y2}`;
			let n = t.x2 - t.x1, r = t.y2 - t.y1, i = Math.hypot(n, r);
			if (i < 2) return `M ${t.x1} ${t.y1} L ${t.x2} ${t.y2}`;
			let a = (t.x1 + t.x2) / 2, o = (t.y1 + t.y2) / 2, s = -r / i, c = n / i, l = Math.min(48, i * .12), u = a + s * l, d = o + c * l;
			return `M ${t.x1} ${t.y1} Q ${u} ${d} ${t.x2} ${t.y2}`;
		}
		let wn = /* @__PURE__ */ new Map();
		function Tn(e) {
			if (!wn.has(e)) {
				let t = "edge-arrow-" + wn.size;
				c.append("marker").attr("id", t).attr("viewBox", "0 0 10 10").attr("refX", 9).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 13).attr("markerHeight", 13).attr("orient", "auto").append("path").attr("d", "M 0 1 L 10 5 L 0 9 z").style("fill", e).style("fill-opacity", .75), wn.set(e, t);
			}
			return wn.get(e);
		}
		let En = (e) => {
			if (e.layer !== "sequence") return "#8a8f9c";
			let t = typeof e.source == "object" ? e.source.id : e.source;
			return Ot.get(t)?.containerColor || "var(--gv-accent, #d4af37)";
		}, Dn = h.insert("g", ".containers-layer").attr("class", "link-hits").selectAll(".link-hit").data(a.links).enter().append("path").attr("class", "link-hit").attr("fill", "none").style("stroke", "transparent").style("stroke-width", "16px").style("pointer-events", "stroke").style("cursor", "default"), On = h.selectAll(".link").data(a.links).enter().append("path").attr("class", (e) => [
			"link",
			e.layer ? `link-${e.layer}` : "",
			e.role ? `link-role-${e.role}` : ""
		].filter(Boolean).join(" ")).attr("fill", "none").attr("data-label", (e) => e.label).attr("marker-end", (e) => e.directed ? `url(#${Tn(En(e))})` : null).style("stroke", (e) => e.layer === "sequence" ? En(e) : null).style("stroke-opacity", (e) => e.layer === "sequence" ? .45 : null), kn = h.append("g").attr("class", "readers-layer").style("display", "none"), An = h.selectAll(".link-ghost").data(a.links).enter().insert("path", ".link-sequence-pulse").attr("class", "link-ghost").style("stroke", (e) => En(e)), jn = (e) => `${on(e.source)}>${on(e.target)}`;
		function Mn() {
			An.attr("d", (e) => Ze && e._path ? (0, Vo.ghostOf)(e._path, jn(e)) : "");
		}
		let Nn = h.selectAll(".link-sequence-pulse").data(a.links.filter((e) => e.layer === "sequence")).enter().append("path").attr("class", "link-sequence-pulse").attr("fill", "none").attr("pathLength", 100).style("stroke", (e) => {
			let t = typeof e.source == "object" ? e.source.id : e.source;
			return Ot.get(t)?.containerColor || "#ffe066";
		}).style("filter", (e) => {
			let t = typeof e.source == "object" ? e.source.id : e.source;
			return `drop-shadow(0 0 4px ${Ot.get(t)?.containerColor || "#ffd700"})`;
		}), Pn = h.append("g").attr("class", "edge-label").style("pointer-events", "none").style("display", "none"), Fn = Pn.append("rect").attr("fill", "rgba(15, 17, 26, 0.88)").attr("stroke-opacity", .6), In = Pn.append("text").attr("text-anchor", "middle").attr("dominant-baseline", "central").attr("font-family", "'Atkinson', sans-serif").attr("font-weight", 600).attr("letter-spacing", "0.04em"), Ln = null, Rn = null, zn = null;
		function Bn() {
			if (!Ln || !Rn) return;
			let e = Rn.getTotalLength ? Rn.getTotalLength() : 0;
			if (!e) {
				Pn.style("display", "none");
				return;
			}
			let t = Rn.getPointAtLength(e / 2), n = de.current || 1, r = 13 / n, i = En(Ln);
			In.attr("font-size", r).style("fill", i).text(Ln.label);
			let a = (Ln.label.length * .62 + 1.4) * r, o = r * 1.7;
			Fn.attr("x", -a / 2).attr("y", -o / 2).attr("width", a).attr("height", o).attr("rx", o / 2).style("stroke", i).attr("stroke-width", 1 / n), Pn.attr("transform", `translate(${t.x}, ${t.y})${be()}`).style("display", null);
		}
		function Vn(e, t) {
			clearTimeout(zn), zn = null, Ln = e, Rn = t, Bn();
		}
		function Hn() {
			clearTimeout(zn), zn = null, Ln = null, Rn = null, Pn.style("display", "none");
		}
		Dn.on("mouseenter", function(e, t) {
			Vn(t, this);
		}).on("mouseleave", () => {
			zn || Hn();
		}).on("click", function(e, t) {
			e.stopPropagation();
			let n = this;
			Pe(e, () => {
				Vn(t, n), zn = setTimeout(() => {
					zn = null, Hn();
				}, 2500);
			});
		});
		let Un = h.selectAll(".node").data(a.nodes).enter().append("g").attr("class", "node"), Wn = rn().clickDistance(5).container(() => h.node()).filter((e) => {
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
				let n = t._size || ee({
					hovered: ue.current === t.id,
					pinned: le.current.has(t.id)
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
					width: r(n.w + (e.x - n.x) * 2, p.minWidth, p.maxWidth),
					height: r(n.h + (e.y - n.y) * 2, p.minHeight, p.maxHeight)
				}, nr(t), k.current && k.current.setNodeSize(se(t), t._size.width, t._size.height, { transient: !0 }), fn();
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
			t.x = e.x, t.y = e.y, t.fx = e.x, t.fy = e.y, k.current && k.current.setNodePosition(se(t), e.x, e.y, { transient: !0 }), Un.filter((e) => e.id === t.id).attr("transform", "translate(" + e.x + "," + e.y + ")" + be()), Zn && Zn.filter((e) => e.id === t.id).style("transform", `translate3d(${e.x}px, ${e.y}px, 0px) rotate(var(--gv-unrot, 0deg))`), A.current && A.current(), On.each(function(e) {
				let n = typeof e.source == "object" ? e.source.id : e.source, r = typeof e.target == "object" ? e.target.id : e.target;
				(n === t.id || r === t.id) && (e._path = Cn(e, Sn(e)), L(this).attr("d", e._path));
			}), Dn.attr("d", (e) => e._path || ""), Mn(), Hn(), Nn.each(function(e) {
				let n = typeof e.source == "object" ? e.source.id : e.source, r = typeof e.target == "object" ? e.target.id : e.target;
				if (n === t.id || r === t.id) {
					let t = Sn(e);
					L(this).attr("d", Cn(e, t));
				}
			}), fn();
		}).on("end", (e, t) => {
			let n = k.current;
			if (t._resizing) {
				t._resizing = !1, n && n.commit(), fn();
				return;
			}
			t.fx = t.x, t.fy = t.y, t._dragMoved && (qt = !1, n && (n.setNodePosition(P(t), t.x, t.y, { transient: !0 }), n.commit()), fn());
		});
		Un.call(Wn);
		let Gn = o.append("text").style("font-family", "'Atkinson', sans-serif").style("visibility", "hidden"), Kn = typeof document < "u" ? document.createElement("canvas").getContext("2d") : null;
		function qn(e, t) {
			if (!Kn) return {
				width: e.length * t * .5,
				ascent: t * .7,
				descent: t * .2
			};
			Kn.font = "500 " + t + "px 'Atkinson', sans-serif";
			let n = Kn.measureText(e);
			return {
				width: n.actualBoundingBoxLeft + n.actualBoundingBoxRight,
				ascent: n.actualBoundingBoxAscent,
				descent: n.actualBoundingBoxDescent
			};
		}
		let Jn = [];
		function Yn(e) {
			let { d: t, textEl: n, rectEl: r, lines: i, fontSize: a, lineH: o } = e, s = i.map((e) => qn(e, a)), c = i.map((e, t) => t * o), l = Math.min(...c.map((e, t) => e - s[t].ascent)), u = Math.max(...c.map((e, t) => e + s[t].descent)), d = -(l + u) / 2, f = l + d, p = u + d, h = Math.max(...s.map((e) => e.width));
			n.selectAll("tspan").each(function(e, t) {
				L(this).attr("y", c[t] + d);
			}), r.attr("x", -h / 2 - m.padding).attr("y", f - m.padding).attr("width", h + m.padding * 2).attr("height", p - f + m.padding * 2), t._r = Math.hypot(h + m.padding * 2, p - f + m.padding * 2) / 2;
		}
		Un.each(function(e) {
			let t = L(this);
			if (e.type !== "article") {
				let n = m.fontSize, r = m.padding, i = m.maxWidth, a = m.maxLines;
				Gn.style("font-size", n + "px").style("font-weight", "500");
				let o = (e) => (Gn.text(e), Gn.node().getComputedTextLength()), s = e.label.split(/(?<=-)|\s+/).filter(Boolean), c = (e) => e.join("").replace(/\s+$/, "").trim(), l = [e.label];
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
					rectEl: t.insert("rect", "text").attr("rx", m.cornerRadius).attr("ry", m.cornerRadius).attr("fill", "var(--gv-" + (e.type === "tag" ? "tag-color" : e.type === "topology" ? "topology-color" : "placeholder-color") + ")").attr("opacity", m.opacity),
					lines: l,
					fontSize: n,
					lineH: u
				};
				Jn.push(f), Yn(f);
			} else {
				let t = ee({
					hovered: !1,
					pinned: !1
				});
				e._r = Math.hypot(t.width, t.height) / 2;
			}
		}), Gn.remove(), typeof document < "u" && document.fonts && document.fonts.ready && document.fonts.ready.then(() => {
			Jn.forEach(Yn);
		}).catch(() => {});
		let Xn = /* @__PURE__ */ new Map(), Zn = d.selectAll(".node-card").data(a.nodes.filter((e) => e.type === "article")), Qn = Zn.enter().append("div").attr("class", "node-card").style("position", "absolute").style("left", "0").style("top", "0").style("will-change", "transform").style("pointer-events", "auto").style("touch-action", "manipulation").call(Wn);
		Zn = Zn.merge(Qn), Qn.each(function(e) {
			let t = (0, v.createRoot)(this);
			Xn.set(e.id, {
				root: t,
				wrapper: this,
				cardSelection: L(this)
			});
		});
		let $n = null, er = /* @__PURE__ */ new Map();
		function tr() {
			return $n !== ae.current && ($n = ae.current, er = (0, Os.countsByChapter)($n)), er;
		}
		function nr(e) {
			if (e.type !== "article") return;
			let t = Xn.get(e.id);
			if (!t) return;
			let n = ue.current === e.id, r = le.current.has(e.id), i = Is(de.current), a = ee({
				hovered: n,
				pinned: r,
				lod: i
			}), o, s;
			if (i === "marker" && !n && !r) o = a.width, s = a.height;
			else {
				let t = e._size || (e._customWidth && e._customHeight ? {
					width: e._customWidth,
					height: e._customHeight
				} : null);
				o = t ? t.width : a.width, s = t ? t.height : a.height;
			}
			t.wrapper.style.width = o + "px", t.wrapper.style.height = s + "px", t.wrapper.style.marginLeft = -o / 2 + "px", t.wrapper.style.marginTop = -s / 2 + "px";
			let c = is(e.kind), l = k.current, u = l ? l.bookmarks(se(e)) : [], d = f.readingProgress !== !1 && l && l.readingProgress ? l.readingProgress(se(e)) : null, m = tr().get(e.id) || 0;
			t.root.render(_.createElement(c, {
				article: e,
				width: o,
				height: s,
				viewState: {
					hovered: n,
					pinned: r,
					lod: i,
					zoomScale: de.current,
					bookmarks: u,
					bookmarkCount: u.length,
					progress: d,
					contributionCount: m
				},
				fullContent: e._fullContent || null,
				cardSettings: p,
				onResize: ({ width: n, height: r }) => {
					e._customWidth = n, e._customHeight = r, e._size = {
						width: n,
						height: r
					}, t.wrapper.style.width = n + "px", t.wrapper.style.height = r + "px", t.wrapper.style.marginLeft = -n / 2 + "px", t.wrapper.style.marginTop = -r / 2 + "px", e._r = Math.max(n, r) / 2, nr(e);
				}
			}));
		}
		Zn.on("wheel", (e) => e.stopPropagation());
		function rr() {
			a.nodes.forEach((e) => {
				e.type === "article" && nr(e);
			});
		}
		j.current = rr;
		let ir = /* @__PURE__ */ new Map();
		function ar(e) {
			if ((e.originalItem && e.originalItem._posted) === "title") return e._fullContent = null, Promise.resolve();
			if (ir.has(e.id)) return e._fullContent = ir.get(e.id), Promise.resolve();
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
				ir.set(e.id, i), e._fullContent = i;
			}).catch(() => {
				ir.set(e.id, null), e._fullContent = null;
			});
		}
		rr(), le.current.forEach((e) => {
			let t = a.nodes.find((t) => t.id === e);
			t && (Zn.filter((t) => t.id === e).raise().style("z-index", 10), ar(t).then(() => {
				le.current.has(e) && nr(t);
			}));
		}), As(o, u, pe.current), Zn.on("mouseover", (e, t) => {
			ue.current !== t.id && (ue.current = t.id, nr(t), e.currentTarget.style.zIndex = 10);
		}).on("mouseout", (e, t) => {
			let n = e.relatedTarget;
			n && e.currentTarget.contains(n) || ue.current === t.id && (ue.current = null, nr(t), e.currentTarget.style.zIndex = "");
		}).on("dblclick", (e, t) => {
			if (e.stopPropagation(), e.preventDefault(), Date.now() - or < 300) return;
			let n = e.target;
			n && (n.dataset?.popout === "1" || n.closest?.("[data-popout=\"1\"]")) || (je.cancel(), sr(t));
		}).on("click", (e, t) => {
			let n = e.target;
			if (n && (n.dataset?.popout === "1" || n.closest?.("[data-popout=\"1\"]"))) {
				e.stopPropagation(), T.current && T.current(t.originalItem || t), le.current.has(t.id) && (le.current.delete(t.id), k.current && k.current.setNodePinned(se(t), !1), ue.current = null, nr(t), e.currentTarget.style.zIndex = "");
				return;
			}
			e.stopPropagation();
			let r = e.currentTarget;
			Pe(e, () => cr(t, r), () => sr(t));
		});
		let or = 0;
		function sr(e) {
			or = Date.now(), T.current && T.current(e.originalItem || e);
		}
		function cr(e, t) {
			le.current.has(e.id) ? (le.current.delete(e.id), k.current && k.current.setNodePinned(se(e), !1), nr(e), t.style.zIndex = "", D.current === e.id && O(null)) : (le.current.add(e.id), O(e), k.current && k.current.setNodePinned(se(e), !0), nr(e), Un.filter((t) => t.id === e.id).raise(), Zn.filter((t) => t.id === e.id).raise(), t.style.zIndex = 10, ar(e).then(() => {
				le.current.has(e.id) && nr(e);
			}));
		}
		let lr = null;
		Un.filter((e) => e.type !== "article").on("click", (e, t) => {
			e.stopPropagation(), Pe(e, () => ur(t));
		});
		function ur(e) {
			if (lr === e.id) lr = null, Un.classed("dimmed", !1).classed("tag-active", !1), Zn.classed("dimmed", !1), On.classed("highlighted", !1);
			else {
				lr = e.id;
				let t = new Set(a.links.filter((t) => {
					let n = typeof t.source == "object" ? t.source.id : t.source, r = typeof t.target == "object" ? t.target.id : t.target;
					return n === e.id || r === e.id;
				}).map((t) => {
					let n = typeof t.source == "object" ? t.source.id : t.source, r = typeof t.target == "object" ? t.target.id : t.target;
					return n === e.id ? r : n;
				}));
				t.add(e.id), Un.classed("dimmed", (e) => !t.has(e.id)), Un.classed("tag-active", (t) => t.id === e.id), Zn.classed("dimmed", (e) => !t.has(e.id)), On.classed("highlighted", (t) => {
					let n = typeof t.source == "object" ? t.source.id : t.source, r = typeof t.target == "object" ? t.target.id : t.target;
					return n === e.id || r === e.id;
				});
			}
		}
		o.on("click", (e) => Pe(e, () => {
			Hn(), lr && (lr = null, Un.classed("dimmed", !1).classed("tag-active", !1), Zn.classed("dimmed", !1), On.classed("highlighted", !1)), T.current && T.current(null);
		}));
		function dr() {
			On.each(function(e) {
				e._path = Cn(e, Sn(e)), L(this).attr("d", e._path);
			}), Dn.attr("d", (e) => e._path || ""), Nn.attr("d", (e) => e._path || ""), Mn(), Ln && Bn();
		}
		function fr() {
			dr(), Un.attr("transform", (e) => "translate(" + e.x + "," + e.y + ")" + be()), Zn && Zn.style("transform", (e) => `translate3d(${e.x}px, ${e.y}px, 0px) rotate(var(--gv-unrot, 0deg))`), fn(), M.current && M.current(), oe.current && oe.current();
		}
		function pr() {
			let e = k.current;
			return !!(e && e.preference && e.preference("readers") === !0);
		}
		let mr = [];
		function hr() {
			kn.selectAll("*").remove(), mr = (0, Os.connectionEdges)(ae.current).map((e) => {
				let t = Ot.get(e.source), n = Ot.get(e.target);
				if (!t || !n) return null;
				let r = kn.append("g").attr("class", "readers-edge").attr("data-readers-edge", e.id);
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
		function gr({ rebuild: e = !1 } = {}) {
			e && hr();
			let t = pr();
			if (kn.style("display", t && mr.length ? null : "none").attr("data-on", t ? "true" : "false"), t) for (let e of mr) {
				let t = Sn(e.l), n = t.hidden ? "" : `M ${t.x1} ${t.y1} L ${t.x2} ${t.y2}`;
				e.line.attr("d", n);
			}
		}
		oe.current = gr, hr();
		let _r = f.roots ? f.roots === !0 ? {} : f.roots : null, vr = [], yr = null, br = !1;
		if (_r) {
			let e = /* @__PURE__ */ new Map();
			for (let [t, n] of Ke) for (let r of n) e.set(r, t);
			let t = a.links.filter((e) => e.layer === "sequence").map((e) => ({
				source: on(e.source),
				target: on(e.target)
			})), n = (a.containers || []).find((e) => !e.parent), r = String(_r.seed || n && n.id || "roots");
			vr = (0, ws.rootSegments)({
				containers: a.containers || [],
				memberOf: e,
				sequence: t
			}).map((e) => {
				let t = Ue.append("g").attr("class", "root").attr("data-root", e.key).style("display", "none");
				return {
					...e,
					shape: (0, ws.rootShape)(r + "|" + e.key),
					el: t,
					main: t.append("path").attr("class", "root-main").attr("fill", "none").attr("vector-effect", "non-scaling-stroke"),
					fine: t.append("path").attr("class", "root-fine").attr("fill", "none").attr("vector-effect", "non-scaling-stroke"),
					state: "hidden"
				};
			});
		}
		function xr(e) {
			if (e.node) {
				let t = Ot.get(e.node);
				return !t || !Number.isFinite(t.x) || pn.has(t.id) || t._source && pe.current.has(t._source.id) ? null : {
					x: t.x,
					y: t.y
				};
			}
			return tt.get(e.container) || null;
		}
		function Sr(e) {
			let t = k.current;
			if (!t || !t.readingProgress) return "hidden";
			let n = (e) => {
				let n = Ot.get(e);
				return n ? t.readingProgress(se(n)) : {
					seen: !1,
					done: !1
				};
			};
			if (e.node) {
				let t = n(e.node);
				return t.done ? "done" : t.seen || t.max > 0 ? "seen" : "hidden";
			}
			let r = Je(e.container).map(n);
			return !r.length || !r.some((e) => e.seen || e.max > 0) ? "hidden" : r.every((e) => e.done) ? "done" : "seen";
		}
		function Cr() {
			if (yr = null, vr.length) {
				for (let e of vr) {
					let t = Sr(e.reach), n = xr(e.from), r = xr(e.to);
					if (t === "hidden" || !n || !r) {
						e.el.style("display", "none"), t === "hidden" && (e.state = "hidden");
						continue;
					}
					let i = (0, ws.rootPath)(n, r, e.shape);
					if (e.main.attr("d", i.main), e.fine.attr("d", i.fine), e.el.style("display", null).attr("data-state", t), e.state === "hidden" && br) {
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
				br = !0;
			}
		}
		function wr() {
			!vr.length || yr || (yr = typeof requestAnimationFrame < "u" ? requestAnimationFrame(Cr) : setTimeout(Cr, 16));
		}
		M.current = _r ? wr : null;
		let Tr = !1;
		te.current = {
			data: a,
			nodes: Un,
			articleNodes: Zn,
			links: On,
			applyPositions: fr,
			svg: o,
			zoom: we,
			fitToViewport: Fr,
			simulation: F,
			axisLayer: He,
			g: h,
			updateContainers: fn,
			ringTargets: ln,
			recomputeContainers: un,
			toScreen: Ce
		}, _e = !0;
		function Er() {
			Bt = typeof window < "u" && window.PostPipeCoverFrame || null, Vt() && ((Kt || qt && !E) && (Jt(), fr()), E || Pr(!1));
		}
		window.addEventListener("postpipe:cover-frame", Er), Er();
		let Dr = !1, Or = new Map(a.nodes.map((e) => [e.id, e]));
		function kr() {
			if (Dr || ne.current !== "force") return !1;
			let e = [];
			for (let t of a.nodes) {
				if (t.type !== "article" || !le.current.has(t.id) || t._closedHidden || !Number.isFinite(t.x) || !Number.isFinite(t.y)) continue;
				let n = t._size || ee({
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
			let t = (0, Cs.separateOpen)(e, { gap: 12 });
			for (let [e, n] of t) {
				let t = Or.get(e);
				t && (t.x = n.x, t.y = n.y, t.vx = 0, t.vy = 0, t.fx != null && (t.fx = n.x), t.fy != null && (t.fy = n.y));
			}
			return t.size > 0;
		}
		let Ar = 0;
		F.nodes(a.nodes).on("tick", () => {
			kr(), fr(), Tr ||= Fr({ initialZoomOut: !0 }), A.current && A.current(), ++Ar, ie.current && Ar % 25 == 0 && ie.current();
		}), F.force("link").links(a.links), kr(), Tr ||= Fr({ initialZoomOut: !0 }), fr();
		function jr() {
			if (!Rt() || I.roots.length === 0) return null;
			let e = [], t = Vt();
			if (t) for (let t of zt.keys()) {
				let n = I.containers.get(t), r = n && Lt(t);
				!r || dn(kt.get(t)) || e.push({
					x0: r.x + n.box.x0,
					y0: r.y + n.box.y0,
					x1: r.x + n.box.x1,
					y1: r.y + n.box.y1
				});
			}
			for (let n of I.roots) {
				let r = I.containers.get(n), i = It(n);
				!r || !i || t && Je(n).every((e) => Ht.has(e)) || Je(n).every((e) => pe.current.has(Ot.get(e)?._source?.id)) || e.push({
					x0: i.x + r.box.x0,
					y0: i.y + r.box.y0,
					x1: i.x + r.box.x1,
					y1: i.y + r.box.y1
				});
			}
			for (let t of a.nodes) {
				if (t.type !== "article" || I.nodes.has(t.id) || !Number.isFinite(t.x) || t._source && pe.current.has(t._source.id)) continue;
				let n = (t._size?.width || p.width) / 2, r = (t._size?.height || p.height) / 2;
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
		function Mr() {
			if (!re || !Rt()) return null;
			let e = f.initialFocus, t = I.containers.get(e), n = kt.get(e);
			if (!t || !n || $e.has(e) || dn(n)) return null;
			let r = Lt(e);
			if (!r) return null;
			let i = {
				x0: r.x + t.box.x0,
				y0: r.y + t.box.y0,
				x1: r.x + t.box.x1,
				y1: r.y + t.box.y1
			}, a = I.containers.get(t.root), o = a && It(t.root), s = o ? {
				x0: o.x + a.box.x0,
				y0: o.y + a.box.y0,
				x1: o.x + a.box.x1,
				y1: o.y + a.box.y1
			} : null, c = (e, t) => {
				if (!e) return e;
				let n = { ...e };
				for (let e of Je(t)) {
					let t = Ot.get(e);
					if (!t || t.type !== "article" || t._closedHidden || !Number.isFinite(t.x) || !Number.isFinite(t.y)) continue;
					let r = t._size || ee({
						hovered: !1,
						pinned: le.current.has(t.id)
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
		function Nr(e) {
			let t = {
				top: 0,
				bottom: 0
			};
			if (typeof document > "u" || !S.current) return t;
			let n = S.current.getBoundingClientRect(), r = 0, i = 0;
			for (let t of document.querySelectorAll("[data-feeds], [data-settings-gear], [data-rights], [data-toolbar]")) {
				let a = t.getBoundingClientRect();
				!a.width || !a.height || (a.top >= n.top + e / 2 ? i = Math.max(i, n.top + e - a.top) : a.bottom <= n.top + e / 2 && (r = Math.max(r, a.bottom - n.top)));
			}
			return {
				top: Math.max(0, Math.min(e / 4, r)),
				bottom: Math.max(0, Math.min(e / 3, i))
			};
		}
		function Pr(e) {
			let t = (0, Es.homeView)(ce), n = To.translate(t.x, t.y).scale(t.k);
			return ve = t.k, Ae({ repaint: !1 }), e ? o.transition().duration(750).call(we.transform, n) : o.call(we.transform, n), $t(), !0;
		}
		function Fr({ animate: e = !1, initialZoomOut: t = !1, focus: n = !0 } = {}) {
			if (n && Vt()) return Pr(e);
			let r = Ir({
				animate: e,
				initialZoomOut: t,
				focus: n
			});
			return r && n && (ve = r, $t()), !!r;
		}
		function Ir({ animate: e = !1, initialZoomOut: t = !1, focus: n = !0 } = {}) {
			let r = jr();
			if (r) {
				let t = S.current ? S.current.clientWidth : window.innerWidth, i = S.current ? S.current.clientHeight : window.innerHeight;
				if (t < 50 || i < 50) return !1;
				let a = Nr(i);
				i -= a.top + a.bottom;
				let s = (e) => Math.min((t - 48) / Math.max(e.x1 - e.x0, 1), (i - 48) / Math.max(e.y1 - e.y0, 1), 1), c = n ? Mr() : null, l = r, u = s(r), d = !1;
				c && (u = s(c.box), l = c.box, c.root && s(c.root) >= Math.min(u, ce) ? (l = c.root, u = s(c.root)) : u < ce && (u = ce, d = (c.box.y1 - c.box.y0) * u > i - 48)), u = Math.max(u, .04);
				let f = (l.x0 + l.x1) / 2, p = d ? Math.max(a.top + 24, 56) - l.y0 * u : a.top + i / 2 - (l.y0 + l.y1) / 2 * u, m = To.translate(t / 2 - f * u, p).scale(u);
				return Ae({ repaint: !1 }), e ? o.transition().duration(750).call(we.transform, m) : o.call(we.transform, m), m.k;
			}
			let i = a.nodes.filter((e) => e.type === "article");
			if (i.length < 2) return !1;
			let s = (e) => {
				let t = [...e].sort((e, t) => e - t), n = Math.floor(t.length / 2);
				return t.length % 2 ? t[n] : (t[n - 1] + t[n]) / 2;
			}, c = (e) => {
				let t = [...e].sort((e, t) => e - t);
				return [t[Math.floor(t.length * .1)], t[Math.ceil(t.length * .9) - 1]];
			}, l = i.map((e) => e.x), u = i.map((e) => e.y), [d, f] = c(l), [p, m] = c(u), h = d - 140, g = f + 140, _ = p - 140, v = m + 140, y = s(l), b = s(u), x = S.current ? S.current.clientWidth : window.innerWidth, C = S.current ? S.current.clientHeight : window.innerHeight;
			if (x < 50 && (x = window.innerWidth), C < 50 && (C = window.innerHeight), x < 50 || C < 50) return !1;
			let w = .2, T = Math.max(Math.min(x / Math.max(g - h, 1), C / Math.max(v - _, 1), 1), w);
			t && (Be ? T = w * .85 : T *= .85);
			let E = x / 2 - y * T, D = C / 2 - b * T, O = To.translate(E, D).scale(T);
			return Ae({ repaint: !1 }), e ? o.transition().duration(750).call(we.transform, O) : o.call(we.transform, O), O.k;
		}
		let Lr = !1;
		$e.size && (mn(), fn()), F.on("end", () => {
			if (Lr = !0, ne.current !== "force" || (kr() && fr(), Dr = !0, a.nodes.forEach((e) => {
				e.fx = e.x, e.fy = e.y, e._forcePos = {
					x: e.x,
					y: e.y
				};
			}), !E && jr() && Fr({ animate: !0 }), (0, _s.layoutIsDegenerate)(a.nodes, ee({
				hovered: !1,
				pinned: !1
			})))) return;
			let e = k.current;
			if (e) for (let t of a.nodes) !t.pinned && t._forcePos && e.setNodePosition(N("force") + se(t), t.x, t.y, { silent: !0 });
			ie.current && ie.current();
		});
		let Rr = () => {
			if (!document.hidden) {
				if (!Lr) {
					F.alpha(.8).restart();
					return;
				}
				Tr ||= Fr({ initialZoomOut: !0 });
			}
		};
		document.addEventListener("visibilitychange", Rr);
		let zr = () => {
			re = !1, Fr({
				animate: !0,
				focus: !1
			});
		}, Br = () => {
			a.nodes.forEach((e) => {
				e.fx = null, e.fy = null, delete e._forcePos;
			});
			let e = k.current;
			if (e) for (let t of a.nodes) {
				let n = P(t);
				e.nodeState(n) && e.setNodePosition(n, t.x, t.y, { silent: !0 });
			}
			F.alpha(.8).restart();
		}, Vr = () => {
			let e = ee({
				hovered: !1,
				pinned: !1
			});
			a.nodes.forEach((e) => {
				delete e._size;
			});
			let t = k.current;
			if (t) for (let n of a.nodes) t.setNodeSize(se(n), e.width, e.height, { silent: !0 });
			fr();
		}, Hr = () => {
			let e = k.current;
			e && e.resetLayout && e.resetLayout(), Ae({ repaint: !1 }), a.nodes.forEach((e) => {
				e.fx = null, e.fy = null, delete e._forcePos;
			}), Vt() && (Jt(), fr()), F.alpha(.8).restart(), Fr({ animate: !0 });
		}, Ur = () => {
			let e = k.current;
			e && e.resetLayout && e.resetLayout(), T.current && T.current(null), O(null), Hn(), lr = null, ue.current = null, Un.classed("dimmed", !1).classed("tag-active", !1), Zn.classed("dimmed", !1).style("z-index", null), On.classed("highlighted", !1), le.current.clear(), a.nodes.forEach((e) => {
				delete e._size, delete e._customWidth, delete e._customHeight, delete e._forcePos, e.fx = null, e.fy = null;
			}), $e.clear();
			for (let e of Qe()) $e.add(e);
			Ae({ repaint: !1 }), E = !1, re = !!f.initialFocus && f.initialFocus !== "all", rr(), mn(), typeof window < "u" && window.dispatchEvent(new CustomEvent("graph:containers-changed", { detail: gn() })), a.containers && a.containers.length && Rt() ? (Kt = zt.size > 0, Vt() && Jt(), bn(), fn(), fr(), Fr({ animate: !0 })) : (F.alpha(.8).restart(), Fr({ animate: !0 }));
		};
		window.addEventListener("graph:reset-all", Ur), window.addEventListener("graph:zoom-to-fit", zr), window.addEventListener("graph:unpin-all", Br), window.addEventListener("graph:reset-sizes", Vr), window.addEventListener("graph:reset-layout", Hr);
		let Wr = {
			"graph:open-container": (e) => yn.openContainer(e.detail && e.detail.id),
			"graph:close-container": (e) => yn.closeContainer(e.detail && e.detail.id),
			"graph:toggle-container": (e) => yn.toggleContainer(e.detail && e.detail.id),
			"graph:open-all-containers": () => yn.openAllContainers(),
			"graph:close-all-containers": () => yn.closeAllContainers()
		};
		for (let [e, t] of Object.entries(Wr)) window.addEventListener(e, t);
		return () => {
			j.current = null, M.current = null, oe.current = null, yr && typeof cancelAnimationFrame < "u" && cancelAnimationFrame(yr), yt && yt.disconnect(), F.stop(), document.removeEventListener("visibilitychange", Rr), window.removeEventListener("resize", Ve), t.removeEventListener("touchstart", De, { capture: !0 }), t.removeEventListener("touchmove", Oe, { capture: !0 }), t.removeEventListener("touchend", ke, { capture: !0 }), t.removeEventListener("touchcancel", ke, { capture: !0 }), t.removeEventListener("touchstart", Le, { capture: !0 }), t.removeEventListener("touchmove", Re, { capture: !0 }), t.removeEventListener("touchend", ze, { capture: !0 }), je.cancel(), window.removeEventListener("graph:reset-all", Ur), window.removeEventListener("postpipe:cover-frame", Er), window.PostPipeGraphWorld && window.PostPipeGraphWorld.snapshot === Qt && delete window.PostPipeGraphWorld, window.removeEventListener("graph:zoom-to-fit", zr), window.removeEventListener("graph:unpin-all", Br), window.removeEventListener("graph:reset-sizes", Vr), window.removeEventListener("graph:reset-layout", Hr);
			for (let [e, t] of Object.entries(Wr)) window.removeEventListener(e, t);
			l && l.current === yn && (l.current = null), Xn.forEach(({ root: e }) => {
				queueMicrotask(() => e.unmount());
			}), Xn.clear();
		};
	}, [e]), (0, _.useEffect)(() => {
		let e = te.current;
		if (!e || !e.axisLayer) return;
		let t = o || {}, n = () => me(e, t);
		ie.current = t.on ? n : null, n();
	}, [
		o,
		a,
		e
	]);
	function me(e, t) {
		if (e.axisLayer.selectAll("*").remove(), A.current = null, !t.on) {
			re.current = !1;
			return;
		}
		let n = S.current, r = n ? n.clientWidth : window.innerWidth, i = n ? n.clientHeight : window.innerHeight;
		if (r < 60 || i < 60) return;
		let a = t.dock || h.dock, o = a === "left" || a === "right", s = h.endPadding, c = Number.isFinite(t.offset) ? t.offset : h.inset, l = a === "right" ? r - c : a === "bottom" ? i - c : c, u = Math.max((o ? i : r) - s * 2, 120), d = o ? {
			x: l,
			y: s
		} : {
			x: s,
			y: l
		}, f = (0, _s.dimensionAxisGeometry)(e.data.nodes, {
			orientation: o ? "ttb" : "ltr",
			origin: d,
			length: u,
			dimension: t.dimension || "time",
			granularity: t.granularity || "auto"
		});
		if (!f) return;
		let p = e.axisLayer.append("g").attr("class", "time-axis"), m = p.append("g").attr("class", "time-connectors"), g = [];
		e.data.nodes.forEach((e) => {
			let t = f.anchors[e.id];
			!t || !t.length || t.forEach((t) => {
				let n = m.append("line").attr("class", "time-connector").attr("data-node", e.id).attr("x1", t.x).attr("y1", t.y).attr("stroke", e._source && e._source.color || "#7f8ea3").attr("stroke-width", h.connectorWidth).attr("stroke-opacity", h.connectorOpacity);
				g.push({
					node: e,
					anchor: t,
					line: n
				});
			});
		});
		function _() {
			let t = Eo(e.svg.node());
			g.forEach(({ node: n, anchor: r, line: i }) => {
				i.style("display", n._closedHidden ? "none" : null);
				let a = e.toScreen ? e.toScreen(n.x, n.y) : t.apply([n.x, n.y]);
				i.attr("x1", r.x).attr("y1", r.y).attr("x2", a[0]).attr("y2", a[1]);
			});
		}
		A.current = _, _();
		let v = p.append("g").attr("class", "time-spine").style("cursor", o ? "ew-resize" : "ns-resize");
		v.append("rect").attr("x", o ? l - 34 / 2 : 0).attr("y", o ? 0 : l - 34 / 2).attr("width", o ? 34 : r).attr("height", o ? i : 34).attr("fill", "rgba(18,20,28,0.82)"), v.append("line").attr("x1", f.from.x).attr("y1", f.from.y).attr("x2", f.to.x).attr("y2", f.to.y).attr("stroke", "rgba(255,255,255," + h.spineOpacity + ")").attr("stroke-width", h.spineWidth);
		let y = h.tickFontSize, b = f.ticks.length > 1 ? Math.hypot(f.ticks[1].x - f.ticks[0].x, f.ticks[1].y - f.ticks[0].y) : Infinity, x = o ? y * 1.7 : y * 4.2, C = Math.max(1, Math.ceil(x / Math.max(b, 1)));
		f.ticks.forEach((e, t) => {
			v.append("line").attr("x1", e.x).attr("y1", e.y).attr("x2", e.x + (o ? 9 : 0)).attr("y2", e.y + (o ? 0 : -9)).attr("stroke", "rgba(255,255,255,0.45)").attr("stroke-width", 1.5), t % C === 0 && v.append("text").attr("x", e.x + (o ? 13 : 0)).attr("y", e.y + (o ? 0 : -14)).attr("text-anchor", o ? "start" : "middle").attr("dominant-baseline", o ? "central" : "auto").style("font-family", "'Atkinson', sans-serif").style("font-size", y + "px").style("fill", "rgba(255,255,255,0.62)").style("pointer-events", "none").text(e.label);
		});
		let w = null, T = 0;
		v.call(rn().on("start", (e) => {
			w = o ? e.x : e.y, T = 0;
		}).on("drag", (e) => {
			w !== null && (T = (o ? e.x : e.y) - w, v.attr("transform", o ? "translate(" + T + ",0)" : "translate(0," + T + ")"), m.selectAll("line").attr(o ? "x1" : "y1", function() {
				return Number(L(this).attr(o ? "x1" : "y1"));
			}), g.forEach(({ anchor: e, line: t }) => {
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
	return (0, _.useEffect)(() => {
		ne.current = a;
		let e = te.current;
		if (!e) return;
		let t = k.current, n = ee({
			hovered: !1,
			pinned: !1
		});
		if (e.recomputeContainers && e.recomputeContainers(), a === "force" && e.data.nodes.filter((e) => {
			let n = t && t.nodeState(N("force") + se(e));
			return n && !n.auto || e._forcePos;
		}).length < e.data.nodes.length * .5) {
			e.data.nodes.forEach((e) => {
				let n = t && t.nodeState(N("force") + se(e));
				n && !n.auto ? (e.fx = n.x, e.fy = n.y) : (e.fx = null, e.fy = null);
			}), e.simulation.alpha(1).restart();
			return;
		}
		let r = a === "force" ? Object.fromEntries(e.data.nodes.map((e) => [e.id, e._forcePos || t && t.nodeState(N("force") + se(e)) || {
			x: e.x,
			y: e.y
		}])) : a === "radial" && e.ringTargets && e.ringTargets() || (0, _s.computeLayout)(a, e.data.nodes, {
			cardW: n.width,
			cardH: n.height
		});
		if (!r) return;
		let i = new Map(e.data.nodes.map((e) => [e.id, {
			x: e.x,
			y: e.y
		}]));
		e.data.nodes.forEach((e) => {
			let n = t && t.nodeState(N(a) + se(e)), i = n && typeof n.x == "number" && !n.auto ? {
				x: n.x,
				y: n.y
			} : r[e.id];
			i && (e.targetX = i.x, e.targetY = i.y, e.fx = i.x, e.fy = i.y, t && !(n && !n.auto) && t.setNodePosition(N(a) + se(e), i.x, i.y, { silent: !0 }));
		});
		let o = Qi;
		Ji().duration(760).ease(o).tween("layout-transition", () => {
			let t = e.data.nodes.map((e) => {
				let t = i.get(e.id) || {
					x: e.x,
					y: e.y
				}, n = typeof e.targetX == "number" ? e.targetX : e.x, r = typeof e.targetY == "number" ? e.targetY : e.y, a = Xn(t.x, n), o = Xn(t.y, r);
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
		let s = setTimeout(() => {
			ie.current && ie.current(), e.fitToViewport && e.fitToViewport();
		}, 800);
		return () => clearTimeout(s);
	}, [a]), /* @__PURE__ */ (0, V.jsx)("div", {
		ref: S,
		className: Io.graphContainer,
		"data-graph-root": !0
	});
}
var U = {
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
}, zs = {
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
}, Bs = /* @__PURE__ */ o(((e, t) => {
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
})), Vs = /* @__PURE__ */ o(((e, t) => {
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
})), Hs = /* @__PURE__ */ o(((e, t) => {
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
})), Us = Bs(), Ws = Vs(), Gs = Hs(), Ks = "p, li, blockquote, h1, h2, h3, h4, h5, h6, dd, dt, figcaption, td, th", qs = "pp-follow-sentence", Js = "pp-follow-word", Ys = "pp-follow-block", Xs = () => typeof CSS < "u" && CSS.highlights && typeof Highlight < "u";
function Zs(e, t) {
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
function Qs(e) {
	let t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT, { acceptNode(e) {
		let t = e.parentElement;
		return t && t.closest(".bookmarkRibbon, [aria-hidden=\"true\"]") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
	} }), r;
	for (; r = n.nextNode();) t.push(r);
	return t;
}
function $s(e, t, n, r) {
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
function ec(e) {
	Xs() && (CSS.highlights.delete(qs), CSS.highlights.delete(Js)), e && (e.querySelectorAll("." + Ys).forEach((e) => e.classList.remove(Ys)), delete e.dataset.followSentence, delete e.dataset.followWord);
}
function tc(e, t, n) {
	let r = Zs(t, n);
	if (!r || !e.contains(r.node)) return null;
	let i = r.node.nodeType === 3 ? r.node.parentElement : r.node, a = i && i.closest(Ks);
	if (!a || !e.contains(a)) return null;
	let o = Qs(a);
	if (!o.length) return null;
	let s = [], c = "", l = null;
	for (let e of o) s.push(c.length), e === r.node && (l = c.length + r.offset), c += e.nodeValue;
	if (l === null) return null;
	let u = (0, Gs.spanAt)(c, l);
	if (!u) return null;
	ec(e);
	let d = c.slice(u.sentence[0], u.sentence[1]), f = u.word ? c.slice(u.word[0], u.word[1]) : "";
	return Xs() ? (CSS.highlights.set(qs, new Highlight($s(o, s, u.sentence[0], u.sentence[1]))), u.word && CSS.highlights.set(Js, new Highlight($s(o, s, u.word[0], u.word[1])))) : a.classList.add(Ys), e.dataset.followSentence = d, e.dataset.followWord = f, {
		sentence: d,
		word: f
	};
}
function nc(e) {
	let t = !1, n = 0, r = null, i = () => {
		n = 0, r && tc(e, r.x, r.y);
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
		n && cancelAnimationFrame(n), e.removeEventListener("pointerdown", o), e.removeEventListener("pointermove", s), window.removeEventListener("pointerup", c), window.removeEventListener("pointercancel", c), ec(e);
	};
}
//#endregion
//#region src/components/ReaderPanel/boldStartHtml.js
var rc = (/* @__PURE__ */ o(((e, t) => {
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
})))(), ic = new Set([
	"SCRIPT",
	"STYLE",
	"CODE",
	"PRE",
	"KBD",
	"SAMP",
	"svg"
]);
function ac(e) {
	if (!e || typeof DOMParser > "u") return e;
	let t = new DOMParser().parseFromString(`<div id="pp-bs-root">${e}</div>`, "text/html"), n = t.getElementById("pp-bs-root"), r = t.createTreeWalker(n, NodeFilter.SHOW_TEXT, { acceptNode(e) {
		for (let t = e.parentElement; t && t !== n; t = t.parentElement) if (ic.has(t.tagName)) return NodeFilter.FILTER_REJECT;
		return /[\p{L}]/u.test(e.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
	} }), i = [], a;
	for (; a = r.nextNode();) i.push(a);
	for (let e of i) {
		let n = t.createDocumentFragment();
		for (let r of (0, rc.boldStartSegments)(e.nodeValue)) if (r.bold) {
			let e = t.createElement("b");
			e.className = "pp-bs", e.textContent = r.text, n.appendChild(e);
		} else n.appendChild(t.createTextNode(r.text));
		e.parentNode.replaceChild(n, e);
	}
	return n.innerHTML;
}
//#endregion
//#region src/lib/rights.js
var oc = /* @__PURE__ */ o(((e, t) => {
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
})), sc = /* @__PURE__ */ o(((e, t) => {
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
})), cc = oc(), lc = sc(), W = {
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
}, uc = "pp-contrib-passage", dc = () => typeof CSS < "u" && CSS.highlights && typeof Highlight < "u";
function fc(e) {
	if (!e) return "";
	let t = new Date(e.length === 10 ? `${e}T00:00:00` : e);
	return isNaN(t) ? "" : t.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	});
}
function pc(e, t) {
	let n = String(e || "").replace(/\s+/g, " ").trim();
	return n.length > t ? n.slice(0, t - 1).trimEnd() + "…" : n;
}
function mc(e, t, n) {
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
function hc({ article: e, contributions: t, config: n, feedData: r, textRef: i, textKey: a, onOpenChapter: o, children: s }) {
	let c = (0, Os.slugOf)(e), l = (0, _.useMemo)(() => (0, Os.forChapter)(t, c), [t, c]), [u, d] = (0, _.useState)(null), [f, p] = (0, _.useState)({}), m = (0, _.useMemo)(() => {
		let e = /* @__PURE__ */ new Map();
		for (let t of r && r.items || []) e.set((0, Os.slugOf)(t), t);
		return e;
	}, [r]);
	(0, _.useEffect)(() => {
		d(null);
		let e = setTimeout(() => {
			let e = i && i.current, t = e ? Array.from(e.querySelectorAll("p")) : [], n = t.map((e) => e.textContent), r = {};
			for (let e of l) e.quote && (r[e.id] = t.length ? (0, Os.resolveQuote)(n, e.quote) : null);
			p(r);
		}, 80);
		return () => clearTimeout(e);
	}, [
		l,
		e,
		a
	]), (0, _.useEffect)(() => () => {
		dc() && CSS.highlights.delete(uc);
	}, [e]);
	let h = (e) => {
		let t = f[e.id], n = i && i.current;
		if (!t || !n) return;
		let r = n.querySelectorAll("p")[t.para];
		if (!r) return;
		let a = n.closest("[data-tts-target]");
		if (a) {
			let e = r.getBoundingClientRect().top - a.getBoundingClientRect().top;
			a.scrollTop += e - 40;
		}
		let o = mc(r, t.offset, t.length);
		n.querySelectorAll("[data-contrib-passage]").forEach((e) => e.removeAttribute("data-contrib-passage")), r.setAttribute("data-contrib-passage", e.id), o && dc() && CSS.highlights.set(uc, new Highlight(o)), setTimeout(() => {
			r.getAttribute("data-contrib-passage") === e.id && r.removeAttribute("data-contrib-passage"), dc() && CSS.highlights.delete(uc);
		}, 4e3);
	};
	if (!l.length && !s && !(n && n.submit)) return null;
	let g = (e) => {
		if (!e.quote) return null;
		let t = f[e.id];
		return t ? /* @__PURE__ */ (0, V.jsxs)("div", {
			className: W.quote,
			"data-contrib-anchor": "found",
			children: [/* @__PURE__ */ (0, V.jsxs)("span", {
				className: W.quoteText,
				children: [
					"“",
					pc(e.quote.exact, 140),
					"”"
				]
			}), /* @__PURE__ */ (0, V.jsx)("button", {
				type: "button",
				className: W.linkBtn,
				onClick: () => h(e),
				"data-contrib-show": !0,
				children: "Show the passage"
			})]
		}) : t === null ? /* @__PURE__ */ (0, V.jsx)("div", {
			className: W.fallback,
			"data-contrib-anchor": "fallback",
			children: "This was about a passage that isn’t in the chapter as it reads now, so it stays with the chapter as a whole."
		}) : null;
	}, v = (e) => /* @__PURE__ */ (0, V.jsxs)("div", {
		className: W.byline,
		children: [
			/* @__PURE__ */ (0, V.jsx)("span", {
				className: W.author,
				children: e.author
			}),
			fc(e.created) && /* @__PURE__ */ (0, V.jsxs)("span", {
				className: W.date,
				children: [" · ", fc(e.created)]
			}),
			e.test && /* @__PURE__ */ (0, V.jsx)("span", {
				className: W.testTag,
				children: " · test"
			})
		]
	});
	return /* @__PURE__ */ (0, V.jsxs)("aside", {
		className: W.section,
		"aria-label": "From readers",
		"data-contributions": !0,
		"data-pp-not-text": !0,
		children: [
			/* @__PURE__ */ (0, V.jsxs)("div", {
				className: W.head,
				children: [/* @__PURE__ */ (0, V.jsx)("div", {
					className: W.title,
					children: "From readers"
				}), /* @__PURE__ */ (0, V.jsx)("div", {
					className: W.note,
					children: "Not part of the book. Written by readers, with their names."
				})]
			}),
			l.length === 0 && /* @__PURE__ */ (0, V.jsx)("div", {
				className: W.empty,
				children: "Nothing from readers on this chapter yet."
			}),
			/* @__PURE__ */ (0, V.jsx)("ul", {
				className: W.list,
				children: l.map((e) => /* @__PURE__ */ (0, V.jsxs)("li", {
					className: W.item,
					"data-contrib": e.id,
					"data-contrib-type": e.type,
					children: [
						/* @__PURE__ */ (0, V.jsx)("div", {
							className: W.kind,
							children: e.type === "essay" ? "Essay" : e.type === "art" ? "Art" : e.type === "connection" ? "Connection" : "Comment"
						}),
						e.title && /* @__PURE__ */ (0, V.jsx)("div", {
							className: W.itemTitle,
							children: e.title
						}),
						v(e),
						g(e),
						e.type === "comment" && (0, Os.paragraphsOf)(e.body).map((e, t) => /* @__PURE__ */ (0, V.jsx)("div", {
							className: W.para,
							children: e
						}, t)),
						e.type === "connection" && (() => {
							let t = e.chapter === c ? e.to : e.chapter, n = m.get(t);
							return /* @__PURE__ */ (0, V.jsxs)(V.Fragment, { children: [/* @__PURE__ */ (0, V.jsxs)("div", {
								className: W.para,
								children: [
									"Connects this chapter with",
									" ",
									n && o ? /* @__PURE__ */ (0, V.jsx)("button", {
										type: "button",
										className: W.linkBtn,
										onClick: () => o(n),
										"data-contrib-goto": t,
										children: n.title || t
									}) : n && n.title || t
								]
							}), (0, Os.paragraphsOf)(e.body).map((e, t) => /* @__PURE__ */ (0, V.jsx)("div", {
								className: W.para,
								children: e
							}, t))] });
						})(),
						e.type === "art" && /* @__PURE__ */ (0, V.jsxs)("figure", {
							className: W.art,
							children: [/* @__PURE__ */ (0, V.jsx)("img", {
								src: (0, Os.assetUrl)(e.asset, n),
								alt: e.alt || `Art by ${e.author}`,
								loading: "lazy"
							}), e.body && /* @__PURE__ */ (0, V.jsx)("figcaption", {
								className: W.para,
								children: e.body
							})]
						}),
						e.type === "essay" && (() => {
							let t = (0, Os.paragraphsOf)(e.body), n = u === e.id;
							return /* @__PURE__ */ (0, V.jsxs)("div", {
								className: W.essay,
								"data-contrib-essay": n ? "open" : "closed",
								children: [
									!n && /* @__PURE__ */ (0, V.jsx)("div", {
										className: W.para,
										children: pc(t[0] || "", 220)
									}),
									n && t.map((e, t) => /* @__PURE__ */ (0, V.jsx)("div", {
										className: W.para,
										children: e
									}, t)),
									/* @__PURE__ */ (0, V.jsx)("button", {
										type: "button",
										className: W.linkBtn,
										"aria-expanded": n,
										onClick: () => d(n ? null : e.id),
										"data-contrib-open": !0,
										children: n ? "Close the essay" : "Read the essay"
									})
								]
							});
						})()
					]
				}, e.id))
			}),
			n && n.submit && /* @__PURE__ */ (0, V.jsx)(_c, {
				article: e,
				chapter: c,
				config: n,
				feedData: r,
				textRef: i
			}),
			s
		]
	});
}
function gc(e) {
	let t = typeof window < "u" && window.getSelection ? window.getSelection() : null;
	if (!t || t.isCollapsed || !t.rangeCount || !e) return null;
	let n = t.getRangeAt(0);
	if (!e.contains(n.commonAncestorContainer)) return null;
	let r = n.startContainer.nodeType === 1 ? n.startContainer : n.startContainer.parentElement, i = r && r.closest("p");
	if (!i || !e.contains(i) || !i.contains(n.endContainer)) return { error: "Choose a passage within one paragraph." };
	let a = document.createRange();
	a.setStart(i, 0), a.setEnd(n.startContainer, n.startOffset);
	let o = a.toString().length;
	return (0, Os.quoteFromSelection)(i.textContent, o, o + n.toString().length);
}
function _c({ article: e, chapter: t, config: n, feedData: r, textRef: i }) {
	let [a, o] = (0, _.useState)(!1), [s, c] = (0, _.useState)(""), [l, u] = (0, _.useState)("comment"), [d, f] = (0, _.useState)(""), [p, m] = (0, _.useState)(""), [h, g] = (0, _.useState)(""), [v, y] = (0, _.useState)(null), [b, x] = (0, _.useState)(null), [S, C] = (0, _.useState)({
		sending: !1,
		errors: [],
		done: !1
	}), w = n.limits || {};
	(0, _.useEffect)(() => {
		y(null), x(null), C({
			sending: !1,
			errors: [],
			done: !1
		});
	}, [t]), (0, _.useEffect)(() => {
		if (!a) return;
		let e = () => {
			let e = gc(i && i.current);
			e && x(e);
		};
		return document.addEventListener("selectionchange", e), () => document.removeEventListener("selectionchange", e);
	}, [a, i]);
	let T = (r && r.items || []).filter((e) => (0, Os.slugOf)(e) !== t && e._posted !== "title").map((e) => ({
		id: (0, Os.slugOf)(e),
		title: e.title || (0, Os.slugOf)(e)
	})), E = () => ({
		author: s.trim(),
		type: l,
		...l === "essay" && d.trim() ? { title: d.trim() } : {},
		body: p,
		anchor: {
			chapter: t,
			...v && !v.error ? v : {}
		},
		...l === "connection" ? { to: h } : {}
	});
	return a ? /* @__PURE__ */ (0, V.jsxs)("form", {
		className: W.form,
		onSubmit: async (e) => {
			e.preventDefault();
			let t = E(), r = (0, Os.checkSubmission)(t, n);
			if (r.length) {
				C({
					sending: !1,
					errors: r,
					done: !1
				});
				return;
			}
			C({
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
					C({
						sending: !1,
						errors: r.errors || [r.error || "It could not be sent just now. Please try again later."],
						done: !1
					});
					return;
				}
				m(""), f(""), y(null), C({
					sending: !1,
					errors: [],
					done: !0
				});
			} catch {
				C({
					sending: !1,
					errors: ["It could not be sent just now. Please try again later."],
					done: !1
				});
			}
		},
		"data-contrib-form": !0,
		noValidate: !0,
		children: [
			/* @__PURE__ */ (0, V.jsx)("div", {
				className: W.formTitle,
				children: "Add yours"
			}),
			/* @__PURE__ */ (0, V.jsx)("div", {
				className: W.note,
				children: "It is read before it appears here. Only the name you give is kept with it; nothing else about you is asked for or stored."
			}),
			/* @__PURE__ */ (0, V.jsxs)("label", {
				className: W.field,
				children: [/* @__PURE__ */ (0, V.jsx)("span", { children: "Name to show" }), /* @__PURE__ */ (0, V.jsx)("input", {
					value: s,
					maxLength: w.name,
					onChange: (e) => c(e.target.value),
					autoComplete: "nickname",
					"data-contrib-field": "author"
				})]
			}),
			/* @__PURE__ */ (0, V.jsxs)("label", {
				className: W.field,
				children: [/* @__PURE__ */ (0, V.jsx)("span", { children: "What it is" }), /* @__PURE__ */ (0, V.jsxs)("select", {
					value: l,
					onChange: (e) => u(e.target.value),
					"data-contrib-field": "type",
					children: [
						/* @__PURE__ */ (0, V.jsx)("option", {
							value: "comment",
							children: "A comment"
						}),
						/* @__PURE__ */ (0, V.jsx)("option", {
							value: "essay",
							children: "An essay"
						}),
						/* @__PURE__ */ (0, V.jsx)("option", {
							value: "connection",
							children: "A connection to another chapter"
						})
					]
				})]
			}),
			l === "essay" && /* @__PURE__ */ (0, V.jsxs)("label", {
				className: W.field,
				children: [/* @__PURE__ */ (0, V.jsx)("span", { children: "Title (optional)" }), /* @__PURE__ */ (0, V.jsx)("input", {
					value: d,
					maxLength: 140,
					onChange: (e) => f(e.target.value),
					"data-contrib-field": "title"
				})]
			}),
			l === "connection" && /* @__PURE__ */ (0, V.jsxs)("label", {
				className: W.field,
				children: [/* @__PURE__ */ (0, V.jsx)("span", { children: "The other chapter" }), /* @__PURE__ */ (0, V.jsxs)("select", {
					value: h,
					onChange: (e) => g(e.target.value),
					"data-contrib-field": "to",
					children: [/* @__PURE__ */ (0, V.jsx)("option", {
						value: "",
						children: "Choose…"
					}), T.map((e) => /* @__PURE__ */ (0, V.jsx)("option", {
						value: e.id,
						children: e.title
					}, e.id))]
				})]
			}),
			/* @__PURE__ */ (0, V.jsxs)("label", {
				className: W.field,
				children: [/* @__PURE__ */ (0, V.jsx)("span", { children: l === "connection" ? "How they connect" : "Your words" }), /* @__PURE__ */ (0, V.jsx)("textarea", {
					value: p,
					maxLength: w.body,
					rows: l === "essay" ? 10 : 4,
					onChange: (e) => m(e.target.value),
					"data-contrib-field": "body"
				})]
			}),
			/* @__PURE__ */ (0, V.jsx)("div", {
				className: W.passage,
				children: v && !v.error ? /* @__PURE__ */ (0, V.jsxs)(V.Fragment, { children: [/* @__PURE__ */ (0, V.jsxs)("span", {
					className: W.quoteText,
					children: [
						"About: “",
						pc(v.exact, 120),
						"”"
					]
				}), /* @__PURE__ */ (0, V.jsx)("button", {
					type: "button",
					className: W.linkBtn,
					onClick: () => y(null),
					children: "Not about a passage"
				})] }) : /* @__PURE__ */ (0, V.jsxs)(V.Fragment, { children: [/* @__PURE__ */ (0, V.jsx)("span", {
					className: W.note,
					children: v && v.error ? v.error : "To write about a passage, select it in the chapter, then:"
				}), /* @__PURE__ */ (0, V.jsx)("button", {
					type: "button",
					className: W.linkBtn,
					onMouseDown: (e) => e.preventDefault(),
					onClick: () => y(gc(i && i.current) || b || { error: "Select a passage in the chapter first." }),
					"data-contrib-use-selection": !0,
					children: "Use the passage I selected"
				})] })
			}),
			S.errors.length > 0 && /* @__PURE__ */ (0, V.jsx)("ul", {
				className: W.errors,
				role: "alert",
				children: S.errors.map((e, t) => /* @__PURE__ */ (0, V.jsx)("li", { children: e }, t))
			}),
			S.done && /* @__PURE__ */ (0, V.jsx)("div", {
				className: W.thanks,
				role: "status",
				"data-contrib-sent": !0,
				children: "Thank you. It will appear here once it has been read and approved."
			}),
			/* @__PURE__ */ (0, V.jsxs)("div", {
				className: W.formActions,
				children: [/* @__PURE__ */ (0, V.jsx)("button", {
					type: "submit",
					className: W.addBtn,
					disabled: S.sending,
					"data-contrib-send": !0,
					children: S.sending ? "Sending…" : "Send"
				}), /* @__PURE__ */ (0, V.jsx)("button", {
					type: "button",
					className: W.linkBtn,
					onClick: () => o(!1),
					children: "Close"
				})]
			})
		]
	}) : /* @__PURE__ */ (0, V.jsx)("div", {
		className: W.addRow,
		children: /* @__PURE__ */ (0, V.jsx)("button", {
			type: "button",
			className: W.addBtn,
			onClick: () => o(!0),
			"data-contrib-add": !0,
			children: "Add yours"
		})
	});
}
//#endregion
//#region src/components/ReaderPanel/ReaderPanel.jsx
function vc({ article: e, onClose: t, settings: n, viewState: r, targetParagraph: i, feedData: a, onNavigate: o, contributions: s, contributionsConfig: c }) {
	let [l, u] = (0, _.useState)(!1), [d, f] = (0, _.useState)(!1), [p, m] = (0, _.useState)(null), [h, g] = (0, _.useState)(!1), [v, y] = (0, _.useState)(""), [b, x] = (0, _.useState)(0), [S, C] = (0, _.useState)(!1), [w, T] = (0, _.useState)(!1), E = (0, _.useRef)(null), D = (0, _.useRef)(null), O = (0, _.useRef)(!1), k = (0, _.useRef)({
		mouseX: 0,
		mouseY: 0,
		posX: 0,
		posY: 0
	}), [ee, te] = (0, _.useState)(null), [ne, re] = (0, _.useState)(null), ie = (0, _.useRef)([]);
	(0, _.useEffect)(() => {
		ue.current && (clearTimeout(ue.current), fe()), e ? (u(!0), f(!1), te(null), E.current && (E.current.scrollTop = 0), x(0), le(e)) : (u(!1), f(!1), y(""), x(0), g(!1));
	}, [e]);
	let A = (e) => e ? e.originalItem && e.originalItem.id || e.id || e.url : null, j = A(e), M = r && j ? r.bookmarks(j) : [], ae = !!(r && r.readerAid && r.readerAid("boldStart")), oe = (0, _.useMemo)(() => ae ? ac(v) : v, [v, ae]), se = (0, _.useMemo)(() => ({ __html: oe }), [oe]), ce = (e) => {
		e.target.closest("button") || e.target.closest("a") || e.target.closest("input") || (O.current = !0, k.current = {
			mouseX: e.clientX,
			mouseY: e.clientY,
			posX: p ? p.x : 0,
			posY: p ? p.y : 0
		}, window.addEventListener("mousemove", N), window.addEventListener("mouseup", P));
	}, N = (e) => {
		if (!O.current) return;
		let t = e.clientX - k.current.mouseX, n = e.clientY - k.current.mouseY;
		m({
			x: k.current.posX + t,
			y: k.current.posY + n
		});
	}, P = () => {
		O.current = !1, window.removeEventListener("mousemove", N), window.removeEventListener("mouseup", P);
	}, le = async (e) => {
		let t = e.kind || "essay";
		if (t === "placeholder" || e.substrate === "placeholder") {
			let t = e.series_part || e.title || "";
			y(`
        <div style="padding: 40px 24px; text-align: center; border: 1px dashed rgba(212, 175, 55, 0.35); border-radius: 12px; background: rgba(20, 24, 38, 0.6); margin-top: 24px;">
          <div style="font-size: 32px; margin-bottom: 12px; opacity: 0.9;">📖</div>
          <div style="font-size: 20px; font-weight: 600; color: var(--rp-accent, #d4af37); margin-bottom: 8px;">Chapter ${t}</div>
          <div style="font-size: 13px; color: var(--rp-text, #a8b2d1); opacity: 0.8; letter-spacing: 0.5px;">Act ${Number(t) >= 21 ? "3" : "2"} · In Progress</div>
        </div>
      `);
			return;
		}
		if (e._posted === "title") {
			let t = (0, lc.navStatus)(a, e) || "";
			y(`<div class="${U.notYet}" data-not-yet><div class="${U.notYetTitle}">${yc(e.title || "")}</div><div class="${U.notYetStatus}">${yc(t)}</div></div>`);
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
			a && a.remove(), i.querySelectorAll(".pp-rights").forEach((e) => e.remove()), y((i.querySelector("body") ? i.querySelector("body").innerHTML : r) + xc(e));
		} catch {
			y(bc(e, "Rendered article not yet published to GitHub Pages."));
		}
		else y(t === "image" ? (e.image ? `<img src="${e.image}" style="max-width:100%;height:auto;border-radius:4px;display:block;margin:0 auto;">` : "<p style=\"color:#666;\">No image resolved.</p>") + Sc(e) : bc(e) + Sc(e));
	}, ue = (0, _.useRef)(null), de = (0, _.useRef)(null), fe = () => {
		ue.current = null;
		let e = E.current, t = de.current;
		if (!e || !t || !r || !r.setReadingProgress) return;
		let n = e.scrollHeight - e.clientHeight;
		r.setReadingProgress(t, n > 0 ? e.scrollTop / n : 1);
	}, pe = () => {
		if (E.current) {
			let { scrollTop: e, scrollHeight: t, clientHeight: n } = E.current, r = t - n, i = r > 0 ? e / r * 100 : 100;
			x(Math.max(0, Math.min(i, 100))), de.current && (i >= 98 ? (clearTimeout(ue.current), fe()) : ue.current ||= setTimeout(fe, 350));
		}
	}, me = () => {
		if (!r || !e) return;
		let t = A(e), n = r.bookmarks(t);
		if (n.length) n.forEach((e) => r.removeBookmark(e.id));
		else {
			let n = he(), i = E.current ? E.current.querySelectorAll("p") : [], a = n !== null && i[n] ? i[n].innerText.trim().split(/\s+/).slice(0, 8).join(" ") : "";
			r.addBookmark({
				item: t,
				para: n === null ? void 0 : n,
				quote: a,
				version: e.version
			});
		}
	}, he = () => {
		if (!E.current) return null;
		let e = E.current.getBoundingClientRect(), t = E.current.querySelectorAll("p");
		for (let n = 0; n < t.length; n++) if (t[n].getBoundingClientRect().bottom > e.top + 10) return n;
		return null;
	}, ge = async () => {
		if (!e) return;
		let t = A(e), n = he(), r = window.location.href.split("#")[0] + "#read=" + encodeURIComponent(t);
		n !== null && (r += "&p=" + n);
		try {
			await navigator.clipboard.writeText(r), C(!0), setTimeout(() => C(!1), 2e3);
		} catch (e) {
			console.error("Copy link failed:", e);
		}
	}, _e = (e) => {
		if (!E.current || e == null) return;
		let t = E.current.querySelectorAll("p");
		if (t[e]) {
			let n = E.current.getBoundingClientRect(), r = t[e].getBoundingClientRect();
			E.current.scrollTop += r.top - n.top - 20;
		}
	}, ve = async () => {
		if (!e || !E.current) return;
		let t = `${(n?.export?.license_header || "").replace("{{canonical_url}}", e.canonical_url || e.url)}\n\n---\n\n${E.current.innerText}`;
		try {
			await navigator.clipboard.writeText(t), C(!0), setTimeout(() => C(!1), 2e3);
		} catch (e) {
			console.error("Copy failed:", e);
		}
	}, ye = () => {
		if (!e || !E.current || !(0, Ws.allowDownload)(n)) return;
		let t = `${(n?.export?.license_header || "").replace("{{canonical_url}}", e.canonical_url || e.url)}\n\n---\n\n${E.current.innerText}`, r = new Blob([t], { type: "text/markdown" }), i = document.createElement("a");
		i.href = URL.createObjectURL(r), i.download = `${(e.id || e.url).split("/").pop().replace(".html", "") || "article"}.md`, i.click(), URL.revokeObjectURL(i.href);
	}, be = async (t) => {
		if (t.preventDefault(), e) try {
			await navigator.clipboard.writeText(e.canonical_url || e.url), C(!0), setTimeout(() => C(!1), 2e3);
		} catch (e) {
			console.error("Copy URL failed:", e);
		}
	};
	(0, _.useEffect)(() => {
		if (clearTimeout(ue.current), ue.current = null, de.current = null, !v || !e || e._posted === "title" || !r || !r.readingProgress) return;
		let t = A(e), n = setTimeout(() => {
			let e = E.current;
			if (!e) return;
			let n = r.readingProgress(t), a = e.scrollHeight - e.clientHeight;
			i == null && n.at > .02 && n.at < .98 && a > 0 && (e.scrollTop = n.at * a), de.current = t, pe(), a <= 0 && fe();
		}, 60);
		return () => clearTimeout(n);
	}, [v]), (0, _.useEffect)(() => {
		v && i != null && E.current && setTimeout(() => {
			_e(i);
		}, 50);
	}, [v, i]);
	let xe = (e, t, n) => {
		let r = e.para === void 0 ? e.paragraph : e.para;
		if (r == null) return null;
		if (e.version && t.version && e.version !== t.version) {
			if (t.version_maps && t.version_maps[e.version]) {
				let n = t.version_maps[e.version][r];
				if (n !== void 0 && n !== -1) return n;
			}
			if (e.quote) {
				let t = Array.from(n).map((e) => e.innerText);
				return (0, Us.resolveParagraph)(r, e.quote, t);
			}
		}
		return r;
	};
	(0, _.useEffect)(() => {
		if (!r || !E.current) return;
		let t = e ? A(e) : null, n = r.bookmarks();
		if (E.current.querySelectorAll(".bookmarkRibbon").forEach((e) => e.remove()), t) {
			let r = n.find((e) => e.item === t);
			if (r) {
				let t = E.current.querySelectorAll("p"), n = xe(r, e, t);
				if (n !== null && t[n]) {
					let e = document.createElement("div");
					e.className = "bookmarkRibbon", e.setAttribute("aria-hidden", "true"), e.innerHTML = zs.bookmark, e.style.position = "absolute", e.style.left = "-30px", e.style.top = "0", e.style.color = "var(--rp-accent)", e.style.width = "20px", e.style.height = "20px", t[n].style.position = "relative", t[n].appendChild(e);
				}
			}
		}
	}, [
		oe,
		r ? r.bookmarks() : null,
		e
	]);
	let Se = !!(r && r.readerAid && r.readerAid("followAlong"));
	(0, _.useEffect)(() => {
		if (!(!Se || !E.current)) return nc(E.current);
	}, [
		Se,
		oe,
		e
	]);
	let Ce = (0, _.useMemo)(() => e && a ? (0, lc.neighbours)(a, e.id) : {
		prev: [],
		next: []
	}, [e, a]), we = () => typeof window < "u" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches, Te = (e, t) => {
		if (!(!e || !o || !(0, lc.isReadable)(e))) {
			if (ie.current.forEach(clearTimeout), ie.current = [], we()) {
				o(e);
				return;
			}
			te(t), ie.current.push(setTimeout(() => {
				re(t), o(e), ie.current.push(setTimeout(() => re(null), 520));
			}, 170));
		}
	}, Ee = (t) => {
		if (!e || !a) return;
		let n = (0, lc.step)(a, e.id, t);
		n && Te(n, t);
	}, De = (0, _.useRef)(Ee);
	De.current = Ee, (0, _.useEffect)(() => () => ie.current.forEach(clearTimeout), []);
	let Oe = !!e && l && !d;
	(0, _.useEffect)(() => {
		if (!Oe) return;
		let e = (e) => {
			if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
			let t = e.target;
			t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) || (e.key === "ArrowRight" && (e.preventDefault(), De.current("next")), e.key === "ArrowLeft" && (e.preventDefault(), De.current("prev")));
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [Oe]), (0, _.useEffect)(() => {
		let e = E.current;
		if (!Oe || !e) return;
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
			o && !o.isCollapsed && String(o).trim() || Se && n.onText || De.current(i < 0 ? "next" : "prev");
		}, i = () => {
			t = null;
		};
		return e.addEventListener("touchstart", n, { passive: !0 }), e.addEventListener("touchend", r, { passive: !0 }), e.addEventListener("touchcancel", i, { passive: !0 }), () => {
			e.removeEventListener("touchstart", n), e.removeEventListener("touchend", r), e.removeEventListener("touchcancel", i);
		};
	}, [Oe, Se]);
	let ke = (0, _.useRef)(null);
	if (ke.current = me, (0, _.useEffect)(() => {
		let e = () => {
			ke.current && ke.current();
		};
		return window.addEventListener("postpipe:reader-mark", e), () => window.removeEventListener("postpipe:reader-mark", e);
	}, []), !e) return null;
	let Ae = (e, t, n) => {
		let r = (0, lc.navStatus)(a, e), i = t === "next" ? "Next" : "Previous";
		return r ? /* @__PURE__ */ (0, V.jsxs)("div", {
			className: `${U.navItem} ${U.navLocked} ${n ? U.navBig : ""}`,
			"data-reader-nav": t,
			"data-nav-status": !0,
			children: [
				/* @__PURE__ */ (0, V.jsx)("span", {
					className: U.navDir,
					children: i
				}),
				/* @__PURE__ */ (0, V.jsx)("span", {
					className: U.navTitle,
					children: e.title
				}),
				/* @__PURE__ */ (0, V.jsx)("span", {
					className: U.navStatus,
					children: r
				})
			]
		}, e.id) : /* @__PURE__ */ (0, V.jsxs)("button", {
			className: `${U.navItem} ${n ? U.navBig : ""}`,
			"data-reader-nav": t,
			onClick: () => Te(e, t),
			title: `${i}: ${e.title}`,
			children: [/* @__PURE__ */ (0, V.jsxs)("span", {
				className: U.navDir,
				children: [
					t === "prev" ? "← " : "",
					i,
					t === "next" ? " →" : ""
				]
			}), /* @__PURE__ */ (0, V.jsx)("span", {
				className: U.navTitle,
				children: e.title
			})]
		}, e.id);
	}, je = [e.date ? (/* @__PURE__ */ new Date(`${e.date}T00:00:00`)).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	}) : "", e.reading_time].filter(Boolean), Me = (n?.author?.name || n?.author?.display || "harold young").toLowerCase(), Ne = n?.author?.url;
	e.authors && e.authors.length > 0 && e.authors[0].name ? (Me = e.authors.map((e) => e.name).join(", ").toLowerCase(), Ne = e.authors[0].url || e.canonical_url || e.url) : e.author && (Me = e.author.replace(/\s*\[humxn\]/i, "").trim().toLowerCase(), Ne = e.canonical_url || e.url);
	let Pe = (0, Jo.readerHeader)(n, e), Fe = (0, Ws.progressBarMode)(n), Ie = (0, Ws.allowDownload)(n), Le = (0, cc.rightsLine)(n && n.rights);
	return /* @__PURE__ */ (0, V.jsxs)(V.Fragment, { children: [
		/* @__PURE__ */ (0, V.jsx)("div", {
			className: `${U.overlay} ${l && !d ? U.open : ""}`,
			onClick: t
		}),
		/* @__PURE__ */ (0, V.jsxs)("div", {
			"data-reader-panel": !0,
			className: `${U.panel} ${l && !d ? U.open : ""} ${d ? U.minimized : ""} ${w ? U.wide : ""}`,
			style: p ? { transform: `translate3d(${p.x}px, ${p.y}px, 0px)` } : void 0,
			children: [
				Fe !== "none" && /* @__PURE__ */ (0, V.jsx)("div", {
					className: Fe === "side" ? U.progressSide : U.progress,
					role: "progressbar",
					"aria-label": "Reading progress",
					"aria-valuemin": 0,
					"aria-valuemax": 100,
					"aria-valuenow": Math.round(b),
					children: /* @__PURE__ */ (0, V.jsx)("div", {
						className: U.progressFill,
						style: Fe === "side" ? { height: `${b}%` } : { width: `${b}%` }
					})
				}),
				/* @__PURE__ */ (0, V.jsxs)("div", {
					className: U.toolbar,
					onMouseDown: ce,
					onDoubleClick: () => m(null),
					title: "Drag toolbar to move window · Double-click to reset",
					children: [
						/* @__PURE__ */ (0, V.jsx)("div", {
							className: U.dragGrip,
							title: "Drag to move reading window",
							children: "⋮⋮"
						}),
						/* @__PURE__ */ (0, V.jsx)("div", {
							id: "tts-mount-point",
							className: `${U.toolbarGroup} ${U.ttsMount}`
						}),
						/* @__PURE__ */ (0, V.jsx)("div", { className: U.toolbarSeparator }),
						/* @__PURE__ */ (0, V.jsx)("div", { className: U.toolbarSeparator }),
						/* @__PURE__ */ (0, V.jsxs)("div", {
							className: U.toolbarGroup,
							children: [/* @__PURE__ */ (0, V.jsx)("button", {
								className: `${U.tb} ${U.tbLabeled} ${M.length > 0 ? U.active : ""}`,
								onClick: me,
								"aria-pressed": M.length > 0,
								title: M.length > 0 ? "Remove the bookmark in this chapter" : "Save the paragraph at the top of the reader",
								"data-bookmark-toggle": !0,
								dangerouslySetInnerHTML: { __html: `${zs.bookmark}<span class="${U.tbText}">${M.length > 0 ? "Marked" : "Mark here"}</span>` }
							}), /* @__PURE__ */ (0, V.jsx)("button", {
								className: `${U.tb} ${U.tbLabeled}`,
								onClick: () => window.dispatchEvent(new CustomEvent("postpipe:toggle-settings", { detail: {
									section: "place",
									open: !0
								} })),
								title: "Every place you have bookmarked, in the settings panel under Your place",
								"data-bookmark-list": !0,
								dangerouslySetInnerHTML: { __html: `${zs.bookmarkList}<span class="${U.tbText}">Bookmarks</span>` }
							})]
						}),
						/* @__PURE__ */ (0, V.jsx)("div", { className: U.toolbarSeparator }),
						/* @__PURE__ */ (0, V.jsx)("div", {
							className: U.toolbarGroup,
							children: /* @__PURE__ */ (0, V.jsx)("button", {
								className: U.tb,
								onClick: ge,
								title: "Copy link to here",
								dangerouslySetInnerHTML: { __html: `${zs.copy}<span class="${U.tbTooltip}">Link here</span>` }
							})
						}),
						/* @__PURE__ */ (0, V.jsx)("div", { className: U.toolbarSeparator }),
						/* @__PURE__ */ (0, V.jsxs)("div", {
							className: U.toolbarGroup,
							children: [
								/* @__PURE__ */ (0, V.jsx)("button", {
									className: `${U.tb} ${h ? U.active : ""}`,
									onClick: () => g(!h),
									title: "Article details",
									dangerouslySetInnerHTML: { __html: `${zs.info}<span class="${U.tbTooltip}">Details</span>` }
								}),
								Ie && /* @__PURE__ */ (0, V.jsx)("button", {
									className: U.tb,
									onClick: ye,
									title: "Export markdown",
									"data-reader-download": !0,
									dangerouslySetInnerHTML: { __html: `${zs.download}<span class="${U.tbTooltip}">Export</span>` }
								}),
								/* @__PURE__ */ (0, V.jsx)("button", {
									className: U.tb,
									onClick: ve,
									title: "Copy to clipboard",
									dangerouslySetInnerHTML: { __html: `${zs.copy}<span class="${U.tbTooltip}">Copy</span>` }
								}),
								/* @__PURE__ */ (0, V.jsx)("button", {
									className: `${U.tb} ${w ? U.active : ""}`,
									onClick: () => T((e) => !e),
									title: w ? "Shrink reader" : "Widen reader",
									dangerouslySetInnerHTML: { __html: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">${w ? "<polyline points=\"15 3 21 3 21 9\"/><polyline points=\"9 21 3 21 3 15\"/><line x1=\"21\" y1=\"3\" x2=\"14\" y2=\"10\"/><line x1=\"3\" y1=\"21\" x2=\"10\" y2=\"14\"/>" : "<polyline points=\"3 9 3 3 9 3\"/><polyline points=\"21 15 21 21 15 21\"/><line x1=\"3\" y1=\"3\" x2=\"10\" y2=\"10\"/><line x1=\"21\" y1=\"21\" x2=\"14\" y2=\"14\"/>"}</svg><span class="${U.tbTooltip}">${w ? "Shrink" : "Widen"}</span>` }
								})
							]
						}),
						/* @__PURE__ */ (0, V.jsx)("div", { className: U.toolbarSeparator }),
						/* @__PURE__ */ (0, V.jsxs)("div", {
							className: U.toolbarGroup,
							children: [/* @__PURE__ */ (0, V.jsx)("button", {
								className: `${U.tb} ${U.syndLink} ${U.canonical}`,
								onClick: be,
								dangerouslySetInnerHTML: { __html: `${zs.link}<span class="${U.tbTooltip}">Copy URL</span>` }
							}), Object.entries(e.syndication || {}).map(([e, t]) => {
								if (!t) return null;
								let r = n?.toolbar?.syndication_icons?.[e];
								return r ? /* @__PURE__ */ (0, V.jsx)("a", {
									href: t,
									target: "_blank",
									rel: "noopener noreferrer",
									className: `${U.tb} ${U.syndLink}`,
									dangerouslySetInnerHTML: { __html: `${zs[r.icon] || zs.globe}<span class="${U.tbTooltip}">${r.label}</span>` }
								}, e) : null;
							})]
						}),
						/* @__PURE__ */ (0, V.jsx)("div", { className: U.toolbarSpacer }),
						/* @__PURE__ */ (0, V.jsxs)("div", {
							className: U.windowControls,
							children: [
								/* @__PURE__ */ (0, V.jsx)("button", {
									className: U.tb,
									onClick: () => window.dispatchEvent(new CustomEvent("postpipe:toggle-settings")),
									title: "Reading settings",
									"aria-label": "Reading settings",
									"data-reader-settings": !0,
									dangerouslySetInnerHTML: { __html: `${zs.settings}<span class="${U.tbTooltip}">Settings</span>` }
								}),
								/* @__PURE__ */ (0, V.jsx)("button", {
									className: `${U.tb} ${U.minimizeBtn}`,
									onClick: () => f(!0),
									title: "Minimize reading window (turn off)",
									dangerouslySetInnerHTML: { __html: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="5" y1="12" x2="19" y2="12"/></svg><span class="${U.tbTooltip}">Minimize</span>` }
								}),
								/* @__PURE__ */ (0, V.jsx)("button", {
									className: `${U.tb} ${U.closeBtn}`,
									onClick: t,
									title: "Close reading window",
									dangerouslySetInnerHTML: { __html: `${zs.close}<span class="${U.tbTooltip}">Close</span>` }
								})
							]
						})
					]
				}),
				h && /* @__PURE__ */ (0, V.jsx)(Cc, {
					article: e,
					settings: n
				}),
				/* @__PURE__ */ (0, V.jsxs)("div", {
					className: `${U.body} ${Se ? U.following : ""} ${ee ? U["turnOut_" + ee] : ""} ${ne ? U["turnIn_" + ne] : ""}`,
					"data-tts-target": !0,
					"data-follow-along": Se ? "on" : "off",
					ref: E,
					onScroll: pe,
					children: [
						Ce.prev.length > 0 && /* @__PURE__ */ (0, V.jsx)("nav", {
							className: U.navTop,
							"aria-label": "Previous chapter",
							children: Ce.prev.map((e) => Ae(e, "prev", !1))
						}),
						/* @__PURE__ */ (0, V.jsxs)("div", {
							className: U.articleHeader,
							children: [
								Pe.kicker && /* @__PURE__ */ (0, V.jsx)("div", {
									className: U.articleKicker,
									children: Pe.kicker
								}),
								/* @__PURE__ */ (0, V.jsx)("h1", {
									className: U.articleTitle,
									children: e.title || e.label
								}),
								Pe.byline && /* @__PURE__ */ (0, V.jsxs)("div", {
									className: U.articleByline,
									children: ["by ", Ne ? /* @__PURE__ */ (0, V.jsx)("a", {
										href: Ne,
										target: "_blank",
										rel: "noopener noreferrer",
										children: Me
									}) : Me]
								}),
								je.length > 0 && /* @__PURE__ */ (0, V.jsx)("div", {
									className: U.articleMeta,
									children: je.join(" · ")
								}),
								e.kind && e.kind !== "essay" && /* @__PURE__ */ (0, V.jsxs)("div", {
									className: U.articleMeta,
									style: {
										marginTop: 4,
										opacity: .7
									},
									children: ["substrate: ", e.kind]
								})
							]
						}),
						/* @__PURE__ */ (0, V.jsx)("div", {
							ref: D,
							"data-reader-text": !0,
							dangerouslySetInnerHTML: se
						}),
						v && (Ce.next.length > 0 || Ce.prev.length > 0) && /* @__PURE__ */ (0, V.jsxs)("nav", {
							className: U.navBottom,
							"aria-label": "Next chapter",
							"data-reader-nav-bottom": !0,
							children: [Ce.next.map((e) => Ae(e, "next", !0)), Ce.next.length === 0 && Ce.prev.map((e) => Ae(e, "prev", !1))]
						}),
						Le && v && /* @__PURE__ */ (0, V.jsx)("footer", {
							className: U.rightsLine,
							"data-reader-rights": !0,
							children: Le
						}),
						c && v && e._posted !== "title" && /* @__PURE__ */ (0, V.jsx)(hc, {
							article: e,
							contributions: s || [],
							config: c,
							feedData: a,
							textRef: D,
							textKey: oe,
							onOpenChapter: (e) => Te(e, "next")
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, V.jsx)("div", {
			className: `${U.copyToast} ${S ? U.show : ""}`,
			children: "Copied to clipboard"
		}),
		d && e && /* @__PURE__ */ (0, V.jsxs)("div", {
			className: U.restorePill,
			onClick: () => f(!1),
			title: "Bring reading window back",
			children: [
				/* @__PURE__ */ (0, V.jsx)("span", {
					className: U.pillIcon,
					children: "📖"
				}),
				/* @__PURE__ */ (0, V.jsxs)("span", {
					className: U.pillLabel,
					children: [/* @__PURE__ */ (0, V.jsx)("span", {
						className: U.pillTitle,
						children: e.title || e.label
					}), /* @__PURE__ */ (0, V.jsxs)("span", {
						className: U.pillAuthor,
						children: ["by ", Me]
					})]
				}),
				/* @__PURE__ */ (0, V.jsx)("span", {
					className: U.pillAction,
					children: "Restore ↗"
				})
			]
		})
	] });
}
function yc(e) {
	return String(e).replace(/[&<>"']/g, (e) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;"
	})[e]);
}
function bc(e, t) {
	let n = t || `This substrate ("${e.kind || "unknown"}") is not yet renderable in the viewer.`, r = "<div style=\"padding:24px;border:1px dashed var(--rp-border);border-radius:6px;background:rgba(17,24,39,0.4);\">";
	r += `<p style="color:var(--rp-accent);font-weight:600;margin-bottom:8px;">${n}</p>`, e.todos && e.todos.length && (r += `<p style="color:#f39c12;font-size:13px;">Pending: ${e.todos.join(", ")}</p>`);
	let i = (e.url || e.id || "").split("/").pop().replace(".html", ""), a = e._source?.path || `chapters/${i}`;
	return r += `<p style="color:#888;font-size:13px;margin-top:12px;">The bundle exists at <code>${a}</code>.</p>`, r += "</div>", r;
}
function xc(e) {
	let t = e.forms && e.forms.companions || [];
	if (!t.length) return "";
	let n = "<div style=\"margin-top:32px;padding-top:24px;border-top:1px solid var(--rp-border);\">";
	return n += "<div style=\"color:var(--rp-accent);font-size:11px;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;\">also exists as</div>", n += `<div style="color:var(--rp-text);font-size:14px;">${t.map((e) => `<span class="${U.fmTag}">${e}</span>`).join(" ")}</div>`, n += "</div>", n;
}
function Sc(e) {
	let t = [];
	if (e.seed && t.push(["seed", e.seed]), e.tldr && t.push(["tldr", e.tldr]), e.topology && e.topology.length && t.push(["topology", e.topology.join(" · ")]), e.energy && t.push(["energy", e.energy]), e.note && t.push(["note", e.note]), !t.length) return "";
	let n = "<div style=\"margin-top:32px;padding:20px;background:rgba(17,24,39,0.4);border-radius:6px;\">";
	for (let [e, r] of t) n += `<div class="${U.fmRow}"><span class="${U.fmLabel}">${e}</span><span class="${U.fmValue}">${r}</span></div>`;
	return n += "</div>", n;
}
function Cc({ article: e, settings: t }) {
	let n = t?.frontmatter_display || [], r = !1, i = n.map((t) => {
		let n = "";
		switch (t) {
			case "publish_date":
				e.date && (n = (/* @__PURE__ */ new Date(`${e.date}T00:00:00`)).toLocaleDateString("en-US", {
					year: "numeric",
					month: "long",
					day: "numeric"
				}));
				break;
			case "updated_date":
				e.updated_date && (n = e.updated_date);
				break;
			case "reading_time":
				n = e.reading_time || "";
				break;
			case "tags":
				e.tags && e.tags.length && (n = /* @__PURE__ */ (0, V.jsx)(V.Fragment, { children: e.tags.map((e) => /* @__PURE__ */ (0, V.jsx)("span", {
					className: U.fmTag,
					children: e
				}, e)) }));
				break;
			case "series":
				n = e.series || "";
				break;
			case "license":
				n = e.license || "";
				break;
			case "syndication":
				let t = e.syndication || {}, r = Object.entries(t).filter(([, e]) => e);
				r.length && (n = /* @__PURE__ */ (0, V.jsx)(V.Fragment, { children: r.map(([e, t], n) => /* @__PURE__ */ (0, V.jsxs)(_.Fragment, { children: [/* @__PURE__ */ (0, V.jsx)("a", {
					className: U.fmSyndLink,
					href: t,
					target: "_blank",
					rel: "noopener noreferrer",
					children: e
				}), n < r.length - 1 ? " · " : ""] }, e)) }));
				break;
			default: break;
		}
		return n ? (r = !0, /* @__PURE__ */ (0, V.jsxs)("div", {
			className: U.fmRow,
			children: [/* @__PURE__ */ (0, V.jsx)("span", {
				className: U.fmLabel,
				children: t.replace(/_/g, " ")
			}), /* @__PURE__ */ (0, V.jsx)("span", {
				className: U.fmValue,
				children: n
			})]
		}, t)) : null;
	});
	return /* @__PURE__ */ (0, V.jsx)("div", {
		className: `${U.frontmatterPanel} ${U.open}`,
		children: r ? i : /* @__PURE__ */ (0, V.jsx)("div", {
			className: U.fmRow,
			children: /* @__PURE__ */ (0, V.jsx)("span", {
				className: U.fmValue,
				style: { color: "#666" },
				children: "No metadata available."
			})
		})
	});
}
var wc = {
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
function Tc() {
	let [e, t] = (0, _.useState)(null), [n, r] = (0, _.useState)("stopped"), [i, a] = (0, _.useState)([]), [o, s] = (0, _.useState)(""), [c, l] = (0, _.useState)([]), [u, d] = (0, _.useState)(""), [f, p] = (0, _.useState)({}), [m, h] = (0, _.useState)({}), [g, v] = (0, _.useState)(0), [y, b] = (0, _.useState)(""), [x, S] = (0, _.useState)(null), [C, w] = (0, _.useState)(!1);
	return (0, _.useEffect)(() => {
		if (!window.TTS) return;
		let e = window.TTS;
		t(e);
		let n = (e) => {
			r(e), e !== "loading" && v(0), (e === "playing" || e === "stopped") && (C || S(null));
		}, i = (e) => v(e * 100), o = ({ engine: e, progress: t }) => {
			t && t.status === "progress" && t.progress !== void 0 ? S(`Loading ${e}: ${Math.round(t.progress * 100)}%`) : t && t.status && S(`Loading ${e}...`);
		}, c = (e) => {
			let t = e && (e.error || e.message || String(e)), n = e && e.engine;
			b(t || "TTS error"), w(!0), S(`${n || "TTS"} error: ${t || "Playback failed"}`), setTimeout(() => {
				b(""), S(null), w(!1);
			}, 5e3);
		}, u = () => {
			a(e.engines()), s(e.selected());
		}, f = () => {
			let t = e.voices();
			l(t);
			let n = e.capabilities();
			p(n);
			let r = {};
			for (let i of Object.keys(n)) if (i === "voice") {
				let r = e.get("voice");
				(!r || t.length && !t.some((e) => e.id === r)) && (r = n.voice.default || t[0] && t[0].id), r && (e.set("voice", r), d(r));
			} else r[i] = e.get(i) === void 0 ? n[i].default : e.get(i);
			h(r);
		};
		return e.on("state", n), e.on("capabilitiesChanged", f), e.on("engineProgress", i), e.on("loadingProgress", o), e.on("error", c), u(), f(), window.speechSynthesis && window.speechSynthesis.addEventListener("voiceschanged", f), () => {
			e.off && (e.off("state", n), e.off("capabilitiesChanged", f), e.off("engineProgress", i), e.off("loadingProgress", o), e.off("error", c)), window.speechSynthesis && window.speechSynthesis.removeEventListener("voiceschanged", f);
		};
	}, []), {
		T: e,
		state: n,
		engines: i,
		selectedEngine: o,
		voices: c,
		selectedVoice: u,
		capabilities: f,
		params: m,
		engineProgress: g,
		errorMsg: y,
		statusMessage: x,
		isError: C,
		setStatusMessage: S,
		setIsError: w,
		handleEngineChange: (t) => {
			if (!e) return;
			let n = t.target.value;
			e.select(n), s(n), S(null), w(!1), l(e.voices()), p(e.capabilities());
		},
		handleVoiceChange: (t) => {
			if (!e) return;
			let n = t.target.value;
			e.set("voice", n), d(n);
		},
		handleParamChange: (t, n) => {
			e && (e.set(t, n), h((e) => ({
				...e,
				[t]: n
			})));
		}
	};
}
function Ec({ targetRef: e }) {
	let { T: t, state: n, engineProgress: r, errorMsg: i, statusMessage: a, isError: o, setStatusMessage: s, setIsError: c } = Tc();
	return t ? /* @__PURE__ */ (0, V.jsxs)("div", {
		className: wc.ttsGroup,
		style: { position: "relative" },
		children: [
			n !== "playing" && /* @__PURE__ */ (0, V.jsx)("button", {
				className: wc.tb,
				onClick: () => {
					!t || !e.current || (s(null), c(!1), t.play(e.current, { scrollContainer: e.current }));
				},
				title: "Play",
				dangerouslySetInnerHTML: { __html: `${zs.play}<span class="${wc.tbTooltip}">Play</span>` }
			}),
			n === "playing" && /* @__PURE__ */ (0, V.jsx)("button", {
				className: wc.tb,
				onClick: () => {
					t && t.pause();
				},
				title: "Pause",
				dangerouslySetInnerHTML: { __html: `${zs.pause}<span class="${wc.tbTooltip}">Pause</span>` }
			}),
			(n === "playing" || n === "paused" || n === "loading") && /* @__PURE__ */ (0, V.jsx)("button", {
				className: wc.tb,
				onClick: () => {
					t && t.stop();
				},
				title: "Stop",
				dangerouslySetInnerHTML: { __html: `${zs.stop}<span class="${wc.tbTooltip}">Stop</span>` }
			}),
			n === "loading" && r > 0 && /* @__PURE__ */ (0, V.jsx)("div", {
				className: wc.loadingBarContainer,
				children: /* @__PURE__ */ (0, V.jsx)("div", {
					className: wc.loadingBarFill,
					style: { width: `${r}%` }
				})
			}),
			n === "playing" && /* @__PURE__ */ (0, V.jsxs)("div", {
				className: wc.visualizer,
				children: [
					/* @__PURE__ */ (0, V.jsx)("div", { className: wc.bar }),
					/* @__PURE__ */ (0, V.jsx)("div", { className: wc.bar }),
					/* @__PURE__ */ (0, V.jsx)("div", { className: wc.bar }),
					/* @__PURE__ */ (0, V.jsx)("div", { className: wc.bar })
				]
			}),
			/* @__PURE__ */ (0, V.jsx)("div", {
				className: `${wc.errorToast} ${i ? wc.show : ""}`,
				children: i
			}),
			a && /* @__PURE__ */ (0, V.jsx)("span", {
				className: `${wc.statusBadge} ${o ? wc.error : ""}`,
				children: a
			})
		]
	}) : null;
}
function Dc() {
	let { T: e, engines: t, selectedEngine: n, voices: r, selectedVoice: i, capabilities: a, params: o, handleEngineChange: s, handleVoiceChange: c, handleParamChange: l } = Tc();
	return e ? /* @__PURE__ */ (0, V.jsxs)("div", {
		className: wc.ttsSettings,
		"data-tts-settings": !0,
		children: [
			t.length > 1 && /* @__PURE__ */ (0, V.jsx)("select", {
				className: wc.select,
				style: { maxWidth: 110 },
				value: n,
				onChange: s,
				title: "TTS Engine",
				children: t.map((e) => /* @__PURE__ */ (0, V.jsx)("option", {
					value: e.id,
					children: e.label
				}, e.id))
			}),
			/* @__PURE__ */ (0, V.jsxs)("label", {
				className: wc.settingRow,
				children: [/* @__PURE__ */ (0, V.jsx)("span", { children: "Voice" }), /* @__PURE__ */ (0, V.jsx)("select", {
					className: wc.select,
					value: i,
					onChange: c,
					"data-tts-voice": !0,
					children: r.length ? r.map((e) => /* @__PURE__ */ (0, V.jsx)("option", {
						value: e.id,
						children: e.label
					}, e.id)) : /* @__PURE__ */ (0, V.jsx)("option", { children: "Loading..." })
				})]
			}),
			/* @__PURE__ */ (0, V.jsx)("div", {
				className: wc.params,
				children: Object.entries(a).map(([e, t]) => !t || e === "voice" || e === "pitch" || e === "volume" ? null : t.type === "range" ? /* @__PURE__ */ (0, V.jsxs)("label", {
					className: wc.settingRow,
					title: `${t.label}: ${o[e]}`,
					children: [/* @__PURE__ */ (0, V.jsxs)("span", { children: [
						t.label,
						" ",
						/* @__PURE__ */ (0, V.jsxs)("span", {
							className: wc.paramValue,
							children: [Number(o[e] ?? t.default).toFixed(1), "×"]
						})
					] }), /* @__PURE__ */ (0, V.jsx)("input", {
						"data-tts-param": e,
						type: "range",
						min: t.min,
						max: t.max,
						step: t.step || .1,
						value: o[e] ?? t.default,
						onChange: (t) => l(e, parseFloat(t.target.value))
					})]
				}, e) : t.type === "select" ? /* @__PURE__ */ (0, V.jsxs)("label", {
					className: wc.settingRow,
					children: [/* @__PURE__ */ (0, V.jsx)("span", { children: t.label }), /* @__PURE__ */ (0, V.jsx)("select", {
						value: o[e] ?? t.default,
						onChange: (t) => l(e, t.target.value),
						children: t.options.map((e) => /* @__PURE__ */ (0, V.jsx)("option", {
							value: e.value,
							children: e.label
						}, e.value))
					})]
				}, e) : null)
			})
		]
	}) : null;
}
var G = {
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
function Oc({ sources: e, hiddenSources: t, onToggleSource: n, viewState: r, showCount: i = !0 }) {
	if (!e || e.length === 0) return null;
	let a = t || /* @__PURE__ */ new Set();
	return /* @__PURE__ */ (0, V.jsxs)("div", {
		className: G.bar,
		"data-feeds": !0,
		children: [e.map((e) => /* @__PURE__ */ (0, V.jsx)(kc, {
			source: e,
			hidden: a.has(e.id),
			onToggle: () => n && n(e.id),
			viewState: r,
			showCount: i
		}, e.id)), /* @__PURE__ */ (0, V.jsx)(Nc, {})]
	});
}
function kc({ source: e, hidden: t, onToggle: n, viewState: r, showCount: i }) {
	let a = e.title || e.id, o = e.ok !== !1, s = r && r.sourceColor(e.id) || e.color;
	return /* @__PURE__ */ (0, V.jsxs)("div", {
		className: `${G.pill} ${t ? G.hidden : ""} ${o ? "" : G.failed}`,
		onClick: n,
		onKeyDown: (e) => {
			(e.key === "Enter" || e.key === " ") && (e.preventDefault(), n());
		},
		role: "button",
		tabIndex: 0,
		title: t ? `Show ${a}` : `Hide ${a}`,
		style: { "--pill-color": s },
		children: [
			/* @__PURE__ */ (0, V.jsx)(Mc, {
				color: s,
				sourceId: e.id,
				viewState: r
			}),
			/* @__PURE__ */ (0, V.jsx)("span", {
				className: G.title,
				children: a
			}),
			i && /* @__PURE__ */ (0, V.jsx)("span", {
				className: G.count,
				children: e.itemCount
			})
		]
	});
}
var Ac = [
	"#e74c3c",
	"#e67e22",
	"#f1c40f",
	"#2ecc71",
	"#1abc9c",
	"#3498db",
	"#9b59b6",
	"#e84393"
], jc = 650;
function Mc({ color: e, sourceId: t, viewState: n }) {
	let [r, i] = (0, _.useState)(!1), a = (0, _.useRef)(null);
	(0, _.useEffect)(() => () => {
		a.current && clearTimeout(a.current);
	}, []);
	let o = (e) => {
		e.stopPropagation(), i(!0);
	}, s = (e) => {
		e && e.stopPropagation(), i(!1);
	}, c = () => {
		a.current = setTimeout(() => i(!0), jc);
	}, l = () => {
		a.current &&= (clearTimeout(a.current), null);
	}, u = (e, r) => {
		r.stopPropagation(), n && n.setSourceColor(t, e), i(!1);
	}, d = Ac.length;
	return /* @__PURE__ */ (0, V.jsxs)("span", {
		className: G.dotWrap,
		onMouseEnter: c,
		onMouseLeave: l,
		onClick: o,
		onTouchEnd: o,
		children: [/* @__PURE__ */ (0, V.jsx)("span", {
			className: `${G.dot} ${r ? G.dotActive : ""}`,
			"aria-hidden": "true"
		}), r && /* @__PURE__ */ (0, V.jsxs)(V.Fragment, { children: [/* @__PURE__ */ (0, V.jsx)("span", {
			className: G.ringBackdrop,
			onClick: s,
			onTouchEnd: s
		}), /* @__PURE__ */ (0, V.jsx)("span", {
			className: G.ring,
			children: Ac.map((t, n) => {
				let r = (d === 1 ? 15 : 15 + n / (d - 1) * 150) * Math.PI / 180, i = 30 * Math.cos(r), a = 30 * Math.sin(r);
				return /* @__PURE__ */ (0, V.jsx)("button", {
					type: "button",
					className: `${G.swatch} ${t.toLowerCase() === String(e).toLowerCase() ? G.swatchCurrent : ""}`,
					style: {
						left: i - 8 + "px",
						top: a - 8 + "px",
						background: t
					},
					onClick: (e) => u(t, e),
					title: t
				}, t);
			})
		})] })]
	});
}
function Nc() {
	let [e, t] = (0, _.useState)(!1), [n, r] = (0, _.useState)(""), [i, a] = (0, _.useState)(null), o = (0, _.useRef)(null);
	(0, _.useEffect)(() => {
		e && o.current && o.current.focus();
	}, [e]);
	let s = Fc(n), c = (e) => {
		e && e.preventDefault(), s && (a(n.trim()), r(""), t(!1));
	}, l = () => {
		r(""), t(!1);
	};
	return /* @__PURE__ */ (0, V.jsxs)(V.Fragment, { children: [e ? /* @__PURE__ */ (0, V.jsxs)("form", {
		className: `${G.pill} ${G.addOpen}`,
		onSubmit: c,
		children: [
			/* @__PURE__ */ (0, V.jsx)("input", {
				ref: o,
				type: "url",
				placeholder: "paste a feed URL…",
				className: G.addInput,
				value: n,
				onChange: (e) => r(e.target.value),
				onKeyDown: (e) => {
					e.key === "Escape" && l();
				}
			}),
			/* @__PURE__ */ (0, V.jsx)("button", {
				type: "button",
				className: G.addClose,
				onClick: l,
				title: "Cancel",
				"aria-label": "Cancel",
				children: "×"
			}),
			/* @__PURE__ */ (0, V.jsx)("button", {
				type: "submit",
				className: `${G.addSubmit} ${s ? G.ready : ""}`,
				disabled: !s,
				title: s ? "Continue" : "Enter a URL first",
				"aria-label": "Add feed",
				children: "+"
			})
		]
	}) : /* @__PURE__ */ (0, V.jsx)("button", {
		className: `${G.pill} ${G.addPill}`,
		onClick: () => t(!0),
		title: "Add a feed",
		children: /* @__PURE__ */ (0, V.jsx)("span", {
			className: G.plus,
			children: "+"
		})
	}), i && /* @__PURE__ */ (0, V.jsx)(Pc, {
		url: i,
		onDismiss: () => a(null)
	})] });
}
function Pc({ url: e, onDismiss: t }) {
	let [n, r] = (0, _.useState)(""), i = Lc(e), a = `node add-feed.js ${Ic(e)}`, o = async (e, t) => {
		try {
			await navigator.clipboard.writeText(e), r(t), setTimeout(() => r((e) => e === t ? "" : e), 1500);
		} catch {}
	};
	return /* @__PURE__ */ (0, V.jsxs)("div", {
		className: G.resultPanel,
		children: [
			/* @__PURE__ */ (0, V.jsx)("button", {
				className: G.resultClose,
				onClick: t,
				title: "Dismiss",
				"aria-label": "Dismiss",
				children: "×"
			}),
			/* @__PURE__ */ (0, V.jsx)("div", {
				className: G.resultTitle,
				children: "Add this feed"
			}),
			/* @__PURE__ */ (0, V.jsx)("div", {
				className: G.resultUrl,
				title: e,
				children: e
			}),
			/* @__PURE__ */ (0, V.jsxs)("div", {
				className: G.resultSection,
				children: [
					/* @__PURE__ */ (0, V.jsx)("div", {
						className: G.resultLabel,
						children: "One-step (recommended)"
					}),
					/* @__PURE__ */ (0, V.jsxs)("div", {
						className: G.resultBox,
						children: [/* @__PURE__ */ (0, V.jsx)("code", {
							className: G.code,
							children: a
						}), /* @__PURE__ */ (0, V.jsx)("button", {
							className: `${G.copyBtn} ${n === "cli" ? G.copied : ""}`,
							onClick: () => o(a, "cli"),
							children: n === "cli" ? "Copied" : "Copy"
						})]
					}),
					/* @__PURE__ */ (0, V.jsx)("div", {
						className: G.resultHint,
						children: "Paste in your terminal — it appends to feeds.opml and rebuilds. Then refresh this page."
					})
				]
			}),
			/* @__PURE__ */ (0, V.jsxs)("div", {
				className: G.resultSection,
				children: [
					/* @__PURE__ */ (0, V.jsx)("div", {
						className: G.resultLabel,
						children: "Or add manually"
					}),
					/* @__PURE__ */ (0, V.jsxs)("div", {
						className: G.resultBox,
						children: [/* @__PURE__ */ (0, V.jsx)("code", {
							className: G.code,
							children: i
						}), /* @__PURE__ */ (0, V.jsx)("button", {
							className: `${G.copyBtn} ${n === "opml" ? G.copied : ""}`,
							onClick: () => o(i, "opml"),
							children: n === "opml" ? "Copied" : "Copy"
						})]
					}),
					/* @__PURE__ */ (0, V.jsxs)("div", {
						className: G.resultHint,
						children: [
							"Paste before ",
							/* @__PURE__ */ (0, V.jsx)("code", {
								className: G.codeInline,
								children: "</body>"
							}),
							" ",
							"in feeds.opml, then run ",
							/* @__PURE__ */ (0, V.jsx)("code", {
								className: G.codeInline,
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
function Fc(e) {
	let t = (e || "").trim();
	if (!t) return !1;
	try {
		let e = new URL(t);
		return e.protocol === "http:" || e.protocol === "https:";
	} catch {
		return !1;
	}
}
function Ic(e) {
	return `'${String(e).replace(/'/g, "'\\''")}'`;
}
function Lc(e) {
	let t = e.replace(/"/g, "&quot;");
	return `<outline text="${Rc(e)}" title="${Rc(e)}" xmlUrl="${t}"/>`;
}
function Rc(e) {
	try {
		return new URL(e).hostname.replace(/^www\./, "");
	} catch {
		return e;
	}
}
var K = {
	gearBtn: "_gearBtn_8s55w_17",
	backdrop: "_backdrop_8s55w_47",
	drawer: "_drawer_8s55w_54",
	ppSlideIn: "_ppSlideIn_8s55w_1",
	header: "_header_8s55w_82",
	title: "_title_8s55w_96",
	subject: "_subject_8s55w_101",
	closeBtn: "_closeBtn_8s55w_111",
	section: "_section_8s55w_125",
	sectionTitle: "_sectionTitle_8s55w_134",
	rowLabel: "_rowLabel_8s55w_143",
	choiceRow: "_choiceRow_8s55w_149",
	choices: "_choices_8s55w_157",
	choiceBtn: "_choiceBtn_8s55w_163",
	fontBtn: "_fontBtn_8s55w_164",
	resetBtn: "_resetBtn_8s55w_165",
	markActions: "_markActions_8s55w_166",
	presetBtn: "_presetBtn_8s55w_167",
	fontRow: "_fontRow_8s55w_180",
	aidOn: "_aidOn_8s55w_190",
	hint: "_hint_8s55w_195",
	hintLink: "_hintLink_8s55w_201",
	legend: "_legend_8s55w_205",
	aidList: "_aidList_8s55w_213",
	aidBtn: "_aidBtn_8s55w_219",
	aidLabel: "_aidLabel_8s55w_235",
	aidState: "_aidState_8s55w_243",
	aidHint: "_aidHint_8s55w_253",
	subjectBlock: "_subjectBlock_8s55w_260",
	subjectTitle: "_subjectTitle_8s55w_269",
	markItem: "_markItem_8s55w_274",
	markMain: "_markMain_8s55w_282",
	markTitle: "_markTitle_8s55w_287",
	markNote: "_markNote_8s55w_292",
	noteInput: "_noteInput_8s55w_304",
	noMarks: "_noMarks_8s55w_329",
	presetRow: "_presetRow_8s55w_335",
	presetActive: "_presetActive_8s55w_348",
	presetSwatches: "_presetSwatches_8s55w_353",
	miniSwatch: "_miniSwatch_8s55w_358",
	presetLabel: "_presetLabel_8s55w_365",
	fieldList: "_fieldList_8s55w_370",
	fieldRow: "_fieldRow_8s55w_376",
	fieldLabel: "_fieldLabel_8s55w_383",
	colorInput: "_colorInput_8s55w_388",
	hexLabel: "_hexLabel_8s55w_398",
	forgetBlock: "_forgetBlock_8s55w_412",
	forgetConfirm: "_forgetConfirm_8s55w_413"
}, zc = /* @__PURE__ */ o(((e, t) => {
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
})), Bc = /* @__PURE__ */ o(((e, t) => {
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
})), Vc = zc(), Hc = Bc(), Uc = {
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
	return /* @__PURE__ */ (0, V.jsxs)("button", {
		className: `${K.aidBtn} ${e ? K.aidOn : ""}`,
		role: "switch",
		"aria-checked": e,
		onClick: () => t(!e),
		...i,
		children: [/* @__PURE__ */ (0, V.jsxs)("span", {
			className: K.aidLabel,
			children: [n, /* @__PURE__ */ (0, V.jsx)("span", {
				className: K.aidState,
				children: e ? "on" : "off"
			})]
		}), r && /* @__PURE__ */ (0, V.jsx)("span", {
			className: K.aidHint,
			children: r
		})]
	});
}
function Zc({ viewState: e, aid: t, label: n, hint: r }) {
	return /* @__PURE__ */ (0, V.jsx)(Xc, {
		on: !!(e.readerAid && e.readerAid(t)),
		label: n,
		hint: r,
		"data-aid": t,
		onChange: (n) => e.setReaderAid && e.setReaderAid(t, n)
	});
}
function Qc({ label: e, options: t, value: n, onChange: r, name: i }) {
	return /* @__PURE__ */ (0, V.jsxs)("div", {
		className: K.choiceRow,
		role: "radiogroup",
		"aria-label": e,
		"data-choice": i,
		children: [/* @__PURE__ */ (0, V.jsx)("span", {
			className: K.rowLabel,
			children: e
		}), /* @__PURE__ */ (0, V.jsx)("span", {
			className: K.choices,
			children: t.map((e) => /* @__PURE__ */ (0, V.jsx)("button", {
				role: "radio",
				"aria-checked": n === e.id,
				title: e.title || e.label,
				"data-value": e.id,
				className: `${K.choiceBtn} ${n === e.id ? K.aidOn : ""}`,
				style: e.style,
				onClick: () => r(e.id),
				children: e.label
			}, e.id))
		})]
	});
}
function $c({ id: e, title: t, children: n }) {
	return /* @__PURE__ */ (0, V.jsxs)("section", {
		className: K.section,
		"data-section": e,
		"aria-labelledby": `pp-settings-${e}`,
		children: [/* @__PURE__ */ (0, V.jsx)("h2", {
			className: K.sectionTitle,
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
	let [r, i] = (0, _.useState)(!1), a = (0, Vc.placedParagraph)(e, t && Array.isArray(t.items) ? t.items.find((t) => t.id === e.item) : null);
	return /* @__PURE__ */ (0, V.jsxs)("div", {
		className: K.markItem,
		"data-bookmark-row": !0,
		children: [/* @__PURE__ */ (0, V.jsxs)("div", {
			className: K.markMain,
			children: [/* @__PURE__ */ (0, V.jsx)("div", {
				className: K.markTitle,
				children: (0, Vc.bookmarkLabel)(e, el(t, e.item))
			}), r ? /* @__PURE__ */ (0, V.jsx)("input", {
				type: "text",
				value: e.note || "",
				onChange: (t) => n.setBookmarkNote(e.id, t.target.value),
				onBlur: () => i(!1),
				onKeyDown: (e) => {
					e.key === "Enter" && i(!1);
				},
				className: K.noteInput,
				"aria-label": "Note",
				autoFocus: !0
			}) : /* @__PURE__ */ (0, V.jsx)("button", {
				className: K.markNote,
				onClick: () => i(!0),
				children: e.note || /* @__PURE__ */ (0, V.jsx)("em", { children: "Add a note" })
			})]
		}), /* @__PURE__ */ (0, V.jsxs)("div", {
			className: K.markActions,
			children: [
				/* @__PURE__ */ (0, V.jsx)("button", {
					onClick: () => {
						window.location.hash = tl(e.item, a);
					},
					title: "Go back to this place",
					children: "Jump"
				}),
				/* @__PURE__ */ (0, V.jsx)("button", {
					onClick: async () => {
						try {
							await navigator.clipboard.writeText(window.location.href.split("#")[0] + tl(e.item, a));
						} catch {}
					},
					title: "Copy a link to this place",
					children: "Copy link"
				}),
				/* @__PURE__ */ (0, V.jsx)("button", {
					onClick: () => n.removeBookmark(e.id),
					title: "Delete this bookmark",
					"aria-label": "Delete bookmark",
					children: "Delete"
				})
			]
		})]
	});
}
function rl({ viewState: e, feedData: t, subject: n, readerOpen: r }) {
	let [i, a] = (0, _.useState)(!1), [o, s] = (0, _.useState)(!1), [, c] = (0, _.useState)(0), l = (0, _.useRef)(null), u = (0, _.useRef)(null);
	if ((0, _.useEffect)(() => {
		if (e) return e.subscribe(() => c((e) => e + 1));
	}, [e]), (0, _.useEffect)(() => {
		if (typeof document > "u" || !e) return;
		let t = e.paragraphIndent ? e.paragraphIndent() : !1, n = e.paragraphSpace ? e.paragraphSpace() : !0, r = document.documentElement;
		r.setAttribute("data-pp-indent", t ? "on" : "off"), r.setAttribute("data-pp-space", n ? "on" : "off"), r.removeAttribute("data-pp-paragraph"), r.setAttribute("data-pp-font", e.readerAid ? e.readerAid("font") : "default"), r.setAttribute("data-pp-size", e.readerAid ? e.readerAid("size") : "m");
	}), (0, _.useEffect)(() => {
		let e = (e) => {
			let t = e && e.detail || {};
			u.current = t.section || null, a((e) => t.open ? !0 : !e);
		};
		return window.addEventListener("postpipe:toggle-settings", e), () => window.removeEventListener("postpipe:toggle-settings", e);
	}, []), (0, _.useEffect)(() => {
		if (!i) return;
		let e = (e) => {
			e.key === "Escape" && (e.stopImmediatePropagation(), a(!1));
		};
		if (window.addEventListener("keydown", e, !0), s(!1), u.current && l.current) {
			let e = l.current.querySelector(`[data-section="${u.current}"]`);
			e && (l.current.scrollTop = e.offsetTop - 8), u.current = null;
		}
		return () => window.removeEventListener("keydown", e, !0);
	}, [i]), !e) return null;
	let d = (0, Ws.readerFonts)(typeof window < "u" ? window.SETTINGS : null), f = e.readerAid ? e.readerAid("font") : "default", p = e.readerAid ? e.readerAid("size") : "m", m = {
		...Kc,
		...e.graphColors()
	}, h = e.colorProfileId(), g = Gc(t), v = g ? Jc.filter((e) => g.has(e.key)) : Jc, y = !!(t && Array.isArray(t.containers) && t.containers.length), b = typeof window < "u" && !!window.TTS, x = n ? n.id : null, S = e.bookmarks(), C = x ? e.bookmarks(x) : [], w = S.filter((e) => e.item !== x), T = n && n._posted !== "title", E = !!(n && r && r === x);
	return /* @__PURE__ */ (0, V.jsxs)(V.Fragment, { children: [/* @__PURE__ */ (0, V.jsx)("button", {
		className: K.gearBtn,
		onClick: () => a((e) => !e),
		title: "Settings",
		"aria-label": "Settings",
		"aria-expanded": i,
		"data-settings-gear": !0,
		children: "⚙"
	}), i && /* @__PURE__ */ (0, V.jsxs)(V.Fragment, { children: [/* @__PURE__ */ (0, V.jsx)("div", {
		className: K.backdrop,
		onClick: () => a(!1)
	}), /* @__PURE__ */ (0, V.jsxs)("aside", {
		className: K.drawer,
		role: "dialog",
		"aria-label": "Settings",
		ref: l,
		"data-settings-panel": !0,
		children: [
			/* @__PURE__ */ (0, V.jsxs)("div", {
				className: K.header,
				children: [
					/* @__PURE__ */ (0, V.jsx)("span", {
						className: K.title,
						children: "Settings"
					}),
					n && /* @__PURE__ */ (0, V.jsx)("span", {
						className: K.subject,
						"data-settings-subject": !0,
						children: n.title
					}),
					/* @__PURE__ */ (0, V.jsx)("button", {
						className: K.closeBtn,
						onClick: () => a(!1),
						"aria-label": "Close",
						children: "×"
					})
				]
			}),
			/* @__PURE__ */ (0, V.jsxs)($c, {
				id: "reading",
				title: "Reading",
				children: [
					/* @__PURE__ */ (0, V.jsx)("div", {
						className: K.fontRow,
						role: "radiogroup",
						"aria-label": "Font",
						children: d.map((t) => /* @__PURE__ */ (0, V.jsx)("button", {
							role: "radio",
							"aria-checked": f === t.id,
							"data-font": t.id,
							className: `${K.fontBtn} ${f === t.id ? K.aidOn : ""}`,
							style: { fontFamily: t.family },
							onClick: () => e.setReaderAid && e.setReaderAid("font", t.id),
							children: t.label
						}, t.id))
					}),
					d.filter((e) => e.license).map((e) => /* @__PURE__ */ (0, V.jsxs)("div", {
						className: K.hint,
						children: [
							e.label,
							" is under the ",
							/* @__PURE__ */ (0, V.jsx)("a", {
								className: K.hintLink,
								href: `./fonts/${e.license}`,
								target: "_blank",
								rel: "noopener",
								children: e.licenseName
							}),
							"."
						]
					}, e.id)),
					/* @__PURE__ */ (0, V.jsx)(Qc, {
						label: "Size",
						name: "size",
						options: Yc,
						value: p,
						onChange: (t) => e.setReaderAid("size", t)
					}),
					/* @__PURE__ */ (0, V.jsxs)("div", {
						className: K.choiceRow,
						children: [/* @__PURE__ */ (0, V.jsx)("span", {
							className: K.rowLabel,
							children: "Paragraphs"
						}), /* @__PURE__ */ (0, V.jsxs)("span", {
							className: K.choices,
							children: [/* @__PURE__ */ (0, V.jsx)("button", {
								className: `${K.choiceBtn} ${e.paragraphIndent() ? K.aidOn : ""}`,
								"aria-pressed": e.paragraphIndent(),
								onClick: () => e.setParagraphIndent(!e.paragraphIndent()),
								children: "Indent first line"
							}), /* @__PURE__ */ (0, V.jsx)("button", {
								className: `${K.choiceBtn} ${e.paragraphSpace() ? K.aidOn : ""}`,
								"aria-pressed": e.paragraphSpace(),
								onClick: () => e.setParagraphSpace(!e.paragraphSpace()),
								children: "Space between"
							})]
						})]
					}),
					/* @__PURE__ */ (0, V.jsxs)("div", {
						className: K.aidList,
						children: [/* @__PURE__ */ (0, V.jsx)(Zc, {
							viewState: e,
							aid: "followAlong",
							label: "Highlighter: follow along",
							hint: "Tap or drag through the text to mark the sentence and word you are on."
						}), /* @__PURE__ */ (0, V.jsx)(Zc, {
							viewState: e,
							aid: "boldStart",
							label: "Bold word beginnings",
							hint: "The first part of each word is bold, to lead the eye. The text itself is unchanged."
						})]
					})
				]
			}),
			b && /* @__PURE__ */ (0, V.jsxs)($c, {
				id: "listening",
				title: "Listening",
				children: [/* @__PURE__ */ (0, V.jsx)(Dc, {}), /* @__PURE__ */ (0, V.jsx)("div", {
					className: K.hint,
					children: "Play and pause are in the reader."
				})]
			}),
			/* @__PURE__ */ (0, V.jsxs)($c, {
				id: "place",
				title: "Your place",
				children: [
					/* @__PURE__ */ (0, V.jsxs)("div", {
						className: K.legend,
						"data-bookmark-legend": !0,
						children: [
							/* @__PURE__ */ (0, V.jsx)("strong", { children: "Mark here" }),
							", in the reader, saves the paragraph at the top of the reader; a ribbon in the margin shows it, and tapping it again removes it. Each saved place below has ",
							/* @__PURE__ */ (0, V.jsx)("em", { children: "Jump" }),
							" (go back to it), ",
							/* @__PURE__ */ (0, V.jsx)("em", { children: "Copy link" }),
							" and ",
							/* @__PURE__ */ (0, V.jsx)("em", { children: "Delete" }),
							". Tap a note to write one."
						]
					}),
					n ? /* @__PURE__ */ (0, V.jsxs)("div", {
						className: K.subjectBlock,
						"data-place-subject": !0,
						children: [
							/* @__PURE__ */ (0, V.jsx)("div", {
								className: K.subjectTitle,
								children: n.title
							}),
							T && e.readingProgress && (() => {
								let t = e.readingProgress(n.id), r = t.done ? "Read to the end" : t.max > 0 ? `Read ${Math.round(t.max * 100)}%` : t.seen ? "Opened" : "Not opened yet";
								return /* @__PURE__ */ (0, V.jsx)("div", {
									className: K.hint,
									"data-place-progress": !0,
									children: r
								});
							})(),
							/* @__PURE__ */ (0, V.jsxs)("div", {
								className: K.choices,
								children: [T && !E && /* @__PURE__ */ (0, V.jsx)("button", {
									className: K.choiceBtn,
									onClick: () => {
										a(!1), window.location.hash = tl(n.id, null);
									},
									children: "Read"
								}), E && /* @__PURE__ */ (0, V.jsx)("button", {
									className: `${K.choiceBtn} ${C.length ? K.aidOn : ""}`,
									"aria-pressed": C.length > 0,
									"data-place-mark": !0,
									onClick: () => window.dispatchEvent(new CustomEvent("postpipe:reader-mark")),
									children: C.length ? "Marked" : "Mark here"
								})]
							}),
							C.map((n) => /* @__PURE__ */ (0, V.jsx)(nl, {
								b: n,
								feedData: t,
								viewState: e
							}, n.id)),
							C.length === 0 && /* @__PURE__ */ (0, V.jsx)("div", {
								className: K.hint,
								children: "No bookmarks in this one yet."
							})
						]
					}) : /* @__PURE__ */ (0, V.jsx)("div", {
						className: K.hint,
						children: "Open a chapter, or tap one on the graph, to see your place in it."
					}),
					w.length > 0 && /* @__PURE__ */ (0, V.jsxs)(V.Fragment, { children: [/* @__PURE__ */ (0, V.jsx)("div", {
						className: K.rowLabel,
						children: n ? "Elsewhere" : "All bookmarks"
					}), w.map((n) => /* @__PURE__ */ (0, V.jsx)(nl, {
						b: n,
						feedData: t,
						viewState: e
					}, n.id))] }),
					S.length === 0 && !n && /* @__PURE__ */ (0, V.jsx)("div", {
						className: K.noMarks,
						children: "No bookmarks yet."
					})
				]
			}),
			/* @__PURE__ */ (0, V.jsxs)($c, {
				id: "view",
				title: "View",
				children: [
					(() => {
						let t = typeof window < "u" ? window.SETTINGS : null, n = (0, Hc.themeName)(t, e.preference("theme")), r = Hc.THEMES[n].modes, i = e.preference("mode");
						return /* @__PURE__ */ (0, V.jsxs)(V.Fragment, { children: [/* @__PURE__ */ (0, V.jsx)(Qc, {
							label: "Theme",
							name: "theme",
							options: Object.values(Hc.THEMES).map((e) => ({
								id: e.id,
								label: e.label
							})),
							value: n,
							onChange: (n) => e.setPreference("theme", n === (0, Hc.themeName)(t, null) ? null : n)
						}), r.length > 1 && /* @__PURE__ */ (0, V.jsx)(Qc, {
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
					(0, Ds.config)(typeof window < "u" ? window.SETTINGS : null) && /* @__PURE__ */ (0, V.jsx)(Xc, {
						on: e.preference("timeOfDay") !== !1,
						onChange: (t) => e.setPreference("timeOfDay", t ? null : !1),
						label: "Time of day background",
						hint: "The page behind the graph takes on the light of the chapter's time of day, tinted by its season.",
						"data-pref": "timeOfDay"
					}),
					y && /* @__PURE__ */ (0, V.jsxs)("div", {
						className: K.choiceRow,
						children: [/* @__PURE__ */ (0, V.jsx)("span", {
							className: K.rowLabel,
							children: "Containers"
						}), /* @__PURE__ */ (0, V.jsxs)("span", {
							className: K.choices,
							children: [/* @__PURE__ */ (0, V.jsx)("button", {
								className: K.choiceBtn,
								onClick: () => window.dispatchEvent(new CustomEvent("graph:open-all-containers")),
								children: "Open all"
							}), /* @__PURE__ */ (0, V.jsx)("button", {
								className: K.choiceBtn,
								onClick: () => window.dispatchEvent(new CustomEvent("graph:close-all-containers")),
								children: "Close all"
							})]
						})]
					}),
					v.length > 0 && /* @__PURE__ */ (0, V.jsxs)(V.Fragment, { children: [
						/* @__PURE__ */ (0, V.jsx)("div", {
							className: K.rowLabel,
							children: "Colors"
						}),
						/* @__PURE__ */ (0, V.jsx)("div", {
							className: K.presetRow,
							children: qc.map((t) => /* @__PURE__ */ (0, V.jsxs)("button", {
								className: `${K.presetBtn} ${h === t.id ? K.presetActive : ""}`,
								onClick: () => e.applyColorProfile(t.id, t.colors),
								title: t.label,
								children: [/* @__PURE__ */ (0, V.jsx)("span", {
									className: K.presetSwatches,
									children: v.map((e) => /* @__PURE__ */ (0, V.jsx)("span", {
										className: K.miniSwatch,
										style: { background: t.colors[e.key] }
									}, e.key))
								}), /* @__PURE__ */ (0, V.jsx)("span", {
									className: K.presetLabel,
									children: t.label
								})]
							}, t.id))
						}),
						/* @__PURE__ */ (0, V.jsx)("div", {
							className: K.fieldList,
							children: v.map((t) => /* @__PURE__ */ (0, V.jsxs)("label", {
								className: K.fieldRow,
								children: [
									/* @__PURE__ */ (0, V.jsx)("span", {
										className: K.fieldLabel,
										children: t.label
									}),
									/* @__PURE__ */ (0, V.jsx)("input", {
										type: "color",
										className: K.colorInput,
										value: m[t.key],
										onChange: (n) => e.setGraphColor(t.key, n.target.value)
									}),
									/* @__PURE__ */ (0, V.jsx)("span", {
										className: K.hexLabel,
										children: m[t.key]
									})
								]
							}, t.key))
						})
					] }),
					/* @__PURE__ */ (0, V.jsx)("button", {
						className: K.resetBtn,
						"data-settings-reset": !0,
						title: "Layout, zoom, rotation, open and closed containers, selection and colors, back to how the site starts",
						onClick: () => {
							a(!1), v.length && e.applyColorProfile("default", Kc), window.dispatchEvent(new CustomEvent("graph:reset-all"));
						},
						children: "Reset the view"
					}),
					/* @__PURE__ */ (0, V.jsxs)("div", {
						className: K.forgetBlock,
						"data-forget": !0,
						children: [/* @__PURE__ */ (0, V.jsx)("div", {
							className: K.hint,
							"data-forget-note": !0,
							children: "What you open, arrange, choose, mark and read here is kept on this device only. Reset the view keeps your notes and progress; Forget removes all of it."
						}), o ? /* @__PURE__ */ (0, V.jsxs)("div", {
							className: K.forgetConfirm,
							role: "group",
							"aria-label": "Confirm forgetting",
							"data-forget-confirm": !0,
							children: [/* @__PURE__ */ (0, V.jsx)("div", {
								className: K.hint,
								children: "Remove your bookmarks and notes, reading progress, open cards, positions, and every choice made here, from this device? This can't be undone."
							}), /* @__PURE__ */ (0, V.jsxs)("span", {
								className: K.choices,
								children: [/* @__PURE__ */ (0, V.jsx)("button", {
									className: K.resetBtn,
									"data-forget-yes": !0,
									onClick: async () => {
										s(!1), a(!1), e.forget && await e.forget(), window.dispatchEvent(new CustomEvent("postpipe:forgotten"));
									},
									children: "Forget"
								}), /* @__PURE__ */ (0, V.jsx)("button", {
									className: K.choiceBtn,
									"data-forget-no": !0,
									onClick: () => s(!1),
									children: "Keep it"
								})]
							})]
						}) : /* @__PURE__ */ (0, V.jsx)("button", {
							className: K.resetBtn,
							"data-forget-ask": !0,
							onClick: () => s(!0),
							children: "Forget my usage on this site"
						})]
					})
				]
			})
		]
	})] })] });
}
var q = {
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
function cl({ config: e, onUpdate: t, onReset: n, visible: r = !0 }) {
	let [i, a] = (0, _.useState)(!1), [o, s] = (0, _.useState)(null), [c, l] = (0, _.useState)(!1), u = (0, _.useRef)(null), d = (0, _.useRef)(null), f = (0, _.useRef)(null), p = (e) => {
		d.current = e.touches[0].clientY;
	}, m = (e) => {
		if (d.current === null) return;
		let t = e.touches[0].clientY - d.current;
		f.current && f.current.scrollTop > 0 || t > 80 && (a(!1), d.current = null);
	}, h = () => {
		d.current = null;
	};
	(0, _.useEffect)(() => {
		if (!i) return;
		let e = (e) => {
			e.key === "Escape" && a(!1);
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [i]);
	let g = {
		...il,
		...e.features || {}
	}, v = e.theme || {}, y = (0, _.useCallback)((e, n) => {
		t({ features: {
			...g,
			[e]: n
		} });
	}, [g, t]), b = (0, _.useCallback)((e, n) => {
		t({ theme: {
			...v,
			[e]: n
		} });
	}, [v, t]), x = (0, _.useCallback)((e) => {
		t({ persistence: e });
	}, [t]), S = (0, _.useCallback)((e) => {
		t({ feed: e || void 0 });
	}, [t]), C = (0, _.useCallback)(() => {
		let t = dl(e);
		navigator.clipboard.writeText(t).then(() => {
			s("Copied to clipboard"), setTimeout(() => s(null), 1800);
		}).catch(() => {
			l(!0);
		});
	}, [e]), w = (0, _.useCallback)(() => {
		u.current && u.current.click();
	}, []), T = (0, _.useCallback)((e) => {
		let n = e.target.files[0];
		if (!n) return;
		let r = new FileReader();
		r.onload = (e) => {
			try {
				t(JSON.parse(e.target.result)), s("Config imported"), setTimeout(() => s(null), 1800);
			} catch {
				s("Invalid JSON"), setTimeout(() => s(null), 2500);
			}
		}, r.readAsText(n), e.target.value = "";
	}, [t]);
	return r ? /* @__PURE__ */ (0, V.jsxs)(V.Fragment, { children: [
		/* @__PURE__ */ (0, V.jsx)("button", {
			className: `${q.triggerBtn} ${i ? q.open : ""}`,
			onClick: () => a((e) => !e),
			title: "Configure viewer",
			"aria-label": "Configure viewer",
			children: "⚡"
		}),
		i && /* @__PURE__ */ (0, V.jsxs)(V.Fragment, { children: [/* @__PURE__ */ (0, V.jsx)("div", {
			className: q.backdrop,
			onClick: () => a(!1)
		}), /* @__PURE__ */ (0, V.jsxs)("div", {
			className: q.panel,
			role: "dialog",
			"aria-label": "Viewer Configuration",
			ref: f,
			onTouchStart: p,
			onTouchMove: m,
			onTouchEnd: h,
			children: [
				/* @__PURE__ */ (0, V.jsxs)("div", {
					className: q.header,
					children: [/* @__PURE__ */ (0, V.jsx)("span", {
						className: q.panelTitle,
						children: "Viewer Configuration"
					}), /* @__PURE__ */ (0, V.jsx)("button", {
						className: q.closeBtn,
						onClick: () => a(!1),
						"aria-label": "Close",
						children: "×"
					})]
				}),
				/* @__PURE__ */ (0, V.jsxs)("div", {
					className: q.section,
					children: [/* @__PURE__ */ (0, V.jsx)("div", {
						className: q.sectionTitle,
						children: "Features"
					}), al.map((e) => /* @__PURE__ */ (0, V.jsx)(ll, {
						label: e.label,
						sub: e.sub,
						checked: g[e.key],
						onChange: (t) => y(e.key, t)
					}, e.key))]
				}),
				/* @__PURE__ */ (0, V.jsxs)("div", {
					className: q.section,
					children: [
						/* @__PURE__ */ (0, V.jsx)("div", {
							className: q.sectionTitle,
							children: "Data"
						}),
						/* @__PURE__ */ (0, V.jsx)("div", {
							className: q.textInputRow,
							children: /* @__PURE__ */ (0, V.jsx)("input", {
								type: "url",
								className: q.textInput,
								placeholder: "Feed URL (default: ./feed.json)",
								value: e.feed || "",
								onChange: (e) => S(e.target.value)
							})
						}),
						/* @__PURE__ */ (0, V.jsxs)("div", {
							className: q.selectRow,
							children: [/* @__PURE__ */ (0, V.jsx)("span", {
								className: q.toggleLabel,
								children: "Persistence"
							}), /* @__PURE__ */ (0, V.jsx)("select", {
								className: q.select,
								value: e.persistence || "localStorage",
								onChange: (e) => x(e.target.value),
								children: sl.map((e) => /* @__PURE__ */ (0, V.jsx)("option", {
									value: e.value,
									children: e.label
								}, e.value))
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, V.jsxs)("div", {
					className: q.section,
					children: [/* @__PURE__ */ (0, V.jsx)("div", {
						className: q.sectionTitle,
						children: "Theme"
					}), ol.map((e) => /* @__PURE__ */ (0, V.jsxs)("div", {
						className: q.colorRow,
						children: [
							/* @__PURE__ */ (0, V.jsx)("span", {
								className: q.colorLabel,
								children: e.label
							}),
							/* @__PURE__ */ (0, V.jsx)("input", {
								type: "color",
								className: q.colorInput,
								value: v[e.key] || ul(e.key),
								onChange: (t) => b(e.key, t.target.value)
							}),
							/* @__PURE__ */ (0, V.jsx)("span", {
								className: q.colorHex,
								children: v[e.key] || ul(e.key)
							})
						]
					}, e.key))]
				}),
				/* @__PURE__ */ (0, V.jsxs)("div", {
					className: q.section,
					children: [
						/* @__PURE__ */ (0, V.jsx)("div", {
							className: q.sectionTitle,
							children: "Actions"
						}),
						/* @__PURE__ */ (0, V.jsxs)("div", {
							className: q.actions,
							children: [
								/* @__PURE__ */ (0, V.jsx)("button", {
									className: q.actionBtnAccent,
									onClick: C,
									children: "Export Config"
								}),
								/* @__PURE__ */ (0, V.jsx)("button", {
									className: q.actionBtn,
									onClick: w,
									children: "Import Config"
								}),
								/* @__PURE__ */ (0, V.jsx)("button", {
									className: q.actionBtnDanger,
									onClick: n,
									children: "Reset All"
								})
							]
						}),
						/* @__PURE__ */ (0, V.jsx)("input", {
							ref: u,
							type: "file",
							accept: ".json",
							style: { display: "none" },
							onChange: T
						}),
						c && /* @__PURE__ */ (0, V.jsx)("div", {
							className: q.snippet,
							children: /* @__PURE__ */ (0, V.jsx)("code", {
								className: q.snippetCode,
								children: dl(e)
							})
						}),
						!c && /* @__PURE__ */ (0, V.jsx)("button", {
							className: q.actionBtn,
							onClick: () => l(!0),
							style: {
								marginTop: "6px",
								width: "100%"
							},
							children: "Show Embed Snippet"
						}),
						c && /* @__PURE__ */ (0, V.jsx)("button", {
							className: q.actionBtn,
							onClick: () => l(!1),
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
		o && /* @__PURE__ */ (0, V.jsx)("div", {
			className: q.toast,
			children: o
		})
	] }) : null;
}
function ll({ label: e, sub: t, checked: n, onChange: r }) {
	return /* @__PURE__ */ (0, V.jsxs)("div", {
		className: q.toggleRow,
		children: [/* @__PURE__ */ (0, V.jsxs)("span", {
			className: q.toggleLabel,
			children: [e, t && /* @__PURE__ */ (0, V.jsx)("span", {
				className: q.toggleSub,
				children: t
			})]
		}), /* @__PURE__ */ (0, V.jsxs)("label", {
			className: q.switch,
			children: [/* @__PURE__ */ (0, V.jsx)("input", {
				type: "checkbox",
				className: q.switchInput,
				checked: n,
				onChange: (e) => r(e.target.checked)
			}), /* @__PURE__ */ (0, V.jsx)("span", { className: q.switchTrack })]
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
var fl = {
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
}, pl = [
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
function ml(e) {
	return (e.url || e.id || "").split("/").pop().replace(".html", "");
}
function hl({ feedData: e, onFilterChange: t }) {
	let [n, r] = (0, _.useState)(null), i = (0, _.useMemo)(() => {
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
			let o = ml(e);
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
				monthName: pl[n],
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
	let a = (e) => {
		e.articleSlugs.length !== 0 && (n === e.key ? (r(null), t && t(null, null)) : (r(e.key), t && t(new Set(e.articleSlugs), `${e.monthName} ${e.year}`)));
	}, o = (e, i, a) => {
		e.stopPropagation(), i.articleSlugs.length !== 0 && (n === i.id ? (r(null), t && t(null, null)) : (r(i.id), t && t(new Set(i.articleSlugs), `${a.monthName} ${i.label}`)));
	};
	return /* @__PURE__ */ (0, V.jsxs)("div", {
		className: fl.timeOverlay,
		children: [/* @__PURE__ */ (0, V.jsxs)("div", {
			className: fl.header,
			children: [/* @__PURE__ */ (0, V.jsxs)("div", {
				className: fl.titleGroup,
				children: [/* @__PURE__ */ (0, V.jsx)("span", {
					className: fl.title,
					children: "Chronology"
				}), /* @__PURE__ */ (0, V.jsx)("span", {
					className: fl.rangeBadge,
					children: i.minYear === i.maxYear ? i.minYear : `${i.minYear}–${i.maxYear}`
				})]
			}), n && /* @__PURE__ */ (0, V.jsx)("button", {
				className: fl.clearBtn,
				onClick: () => {
					r(null), t && t(null, null);
				},
				title: "Show all posts",
				children: "Reset"
			})]
		}), /* @__PURE__ */ (0, V.jsx)("div", {
			className: fl.stackScroll,
			children: i.months.map((e, t) => {
				let r = n === e.key, s = e.articleSlugs.length === 0, c = i.months[t - 1], l = !c || c.year !== e.year;
				return /* @__PURE__ */ (0, V.jsxs)("div", {
					className: `${fl.monthBox} ${s ? fl.emptyMonth : ""} ${r ? fl.activeMonth : ""}`,
					children: [/* @__PURE__ */ (0, V.jsxs)("div", {
						className: fl.monthHeader,
						onClick: () => a(e),
						title: s ? "No articles published this month" : `Filter to ${e.monthName} ${e.year} (${e.articleSlugs.length})`,
						children: [/* @__PURE__ */ (0, V.jsxs)("div", {
							className: fl.monthName,
							children: [e.monthName, l && /* @__PURE__ */ (0, V.jsx)("span", {
								className: fl.yearTag,
								children: e.year
							})]
						}), /* @__PURE__ */ (0, V.jsx)("div", {
							className: `${fl.monthMeta} ${e.articleSlugs.length > 0 ? fl.hasItems : ""}`,
							children: e.articleSlugs.length > 0 ? `${e.articleSlugs.length} post${e.articleSlugs.length > 1 ? "s" : ""}` : "0 posts"
						})]
					}), /* @__PURE__ */ (0, V.jsxs)("div", {
						className: fl.branchArea,
						children: [/* @__PURE__ */ (0, V.jsx)("div", { className: fl.branchLine }), /* @__PURE__ */ (0, V.jsx)("div", {
							className: fl.weeksRow,
							children: e.weeks.map((t) => {
								let r = t.articleSlugs.length, i = n === t.id;
								return /* @__PURE__ */ (0, V.jsxs)("div", {
									className: `${fl.weekPill} ${r > 0 ? fl.hasContent : ""} ${i ? fl.activeWeek : ""}`,
									onClick: (n) => o(n, t, e),
									title: r > 0 ? `${t.label}: ${r} post${r > 1 ? "s" : ""}` : `${t.label}: empty`,
									children: [/* @__PURE__ */ (0, V.jsx)("span", { children: t.label }), r > 0 && /* @__PURE__ */ (0, V.jsx)("span", {
										className: fl.weekBadge,
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
var J = {
	bar: "_bar_1542n_4",
	group: "_group_1542n_17",
	spacer: "_spacer_1542n_31",
	label: "_label_1542n_36",
	seg: "_seg_1542n_44",
	icon: "_icon_1542n_45",
	action: "_action_1542n_46",
	on: "_on_1542n_75",
	moreMark: "_moreMark_1542n_89",
	backdrop: "_backdrop_1542n_96",
	sheet: "_sheet_1542n_103",
	sectionTitle: "_sectionTitle_1542n_124",
	wrapRow: "_wrapRow_1542n_132",
	narrowOnly: "_narrowOnly_1542n_146",
	wideOnly: "_wideOnly_1542n_151",
	moreText: "_moreText_1542n_170",
	more: "_more_1542n_89",
	layer: "_layer_1542n_191"
}, gl = (/* @__PURE__ */ o(((e, t) => {
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
	t.exports = {
		dimensionLabels: a,
		layerLabels: (e) => a(e, r),
		DIMENSIONS: n,
		LAYERS: r
	};
})))(), _l = [{
	id: "force",
	label: "cluster",
	title: "Cluster: each container its own path"
}, {
	id: "radial",
	label: "ring",
	title: "Ring: each container its own ring"
}], vl = [
	"auto",
	"day",
	"week",
	"month",
	"year"
], yl = [
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
], bl = (e) => window.dispatchEvent(new CustomEvent(e));
function xl({ viewState: e, show: t = {}, layouts: n = _l, settings: r, layers: i = [] }) {
	let a = r || (typeof window < "u" ? window.SETTINGS : null), o = (0, gl.dimensionLabels)(a), s = (0, gl.layerLabels)(a).filter((e) => i.includes(e.id)), [, c] = (0, _.useReducer)((e) => e + 1, 0), [l, u] = (0, _.useState)(!1);
	if ((0, _.useEffect)(() => e ? e.subscribe(c) : void 0, [e]), (0, _.useEffect)(() => {
		if (!l) return;
		let e = (e) => {
			e.key === "Escape" && u(!1);
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [l]), !e) return null;
	let d = t.history !== !1, f = t.layout !== !1, p = t.dimensions !== !1, m = e.state.layout, h = e.timeAxis(), g = h.dimension || "time", v = (t) => {
		h.on && g === t ? e.setTimeAxis({ on: !1 }) : e.setTimeAxis({
			on: !0,
			dimension: t
		});
	}, y = () => {
		let t = vl.indexOf(h.granularity || "auto");
		e.setTimeAxis({ granularity: vl[(t + 1) % vl.length] });
	}, b = h.on && (h.dimension === "chronology" || h.dimension === "commits"), x = /* @__PURE__ */ (0, V.jsxs)(V.Fragment, { children: [
		o.map((e) => {
			let t = h.on && g === e.id;
			return /* @__PURE__ */ (0, V.jsx)("button", {
				className: `${J.seg} ${t ? J.on : ""}`,
				"aria-pressed": t,
				title: e.title,
				onClick: () => v(e.id),
				children: e.label
			}, e.id);
		}),
		s.map((t) => {
			let n = e.preference(t.id) === !0;
			return /* @__PURE__ */ (0, V.jsx)("button", {
				className: `${J.seg} ${J.layer} ${n ? J.on : ""}`,
				"aria-pressed": n,
				title: t.title,
				"data-dimension": t.id,
				onClick: () => e.setPreference(t.id, n ? null : !0),
				children: t.label
			}, t.id);
		}),
		b && /* @__PURE__ */ (0, V.jsxs)("button", {
			className: J.seg,
			title: "Bucket size: auto, day, week, month, year",
			onClick: y,
			children: ["· ", h.granularity || "auto"]
		})
	] });
	return /* @__PURE__ */ (0, V.jsxs)(V.Fragment, { children: [/* @__PURE__ */ (0, V.jsxs)("div", {
		className: J.bar,
		role: "toolbar",
		"aria-label": "Graph controls",
		"data-toolbar": !0,
		children: [
			d && /* @__PURE__ */ (0, V.jsxs)("div", {
				className: J.group,
				"data-group": "history",
				children: [/* @__PURE__ */ (0, V.jsx)("button", {
					className: J.icon,
					title: "Undo (Cmd+Z)",
					"aria-label": "Undo",
					disabled: !e.canUndo,
					onClick: () => e.undo(),
					children: "↩"
				}), /* @__PURE__ */ (0, V.jsx)("button", {
					className: J.icon,
					title: "Redo (Cmd+Shift+Z)",
					"aria-label": "Redo",
					disabled: !e.canRedo,
					onClick: () => e.redo(),
					children: "↪"
				})]
			}),
			f && /* @__PURE__ */ (0, V.jsxs)("div", {
				className: J.group,
				"data-group": "layout",
				role: "radiogroup",
				"aria-label": "Layout",
				children: [/* @__PURE__ */ (0, V.jsx)("span", {
					className: J.label,
					children: "layout"
				}), n.map((t) => {
					let n = m === t.id;
					return /* @__PURE__ */ (0, V.jsx)("button", {
						className: `${J.seg} ${n ? J.on : ""}`,
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
			p && /* @__PURE__ */ (0, V.jsxs)("div", {
				className: `${J.group} ${J.wideOnly}`,
				"data-group": "dimensions",
				"aria-label": "Dimensions",
				children: [/* @__PURE__ */ (0, V.jsx)("span", {
					className: J.label,
					children: "dimensions"
				}), x]
			}),
			/* @__PURE__ */ (0, V.jsx)("div", { className: J.spacer }),
			/* @__PURE__ */ (0, V.jsxs)("div", {
				className: J.group,
				"data-group": "view",
				children: [/* @__PURE__ */ (0, V.jsx)("button", {
					className: J.seg,
					title: "Reset: layout, zoom, rotation, open and closed containers, and selection, back to how the site starts (Undo brings the arrangement back)",
					"data-toolbar-reset": !0,
					onClick: () => {
						u(!1), bl("graph:reset-all");
					},
					children: "Reset"
				}), /* @__PURE__ */ (0, V.jsxs)("button", {
					className: `${J.seg} ${J.more} ${l ? J.on : ""}`,
					"aria-expanded": l,
					"aria-controls": "pp-toolbar-more",
					title: "More: dimensions and view actions",
					"aria-label": "More",
					"data-toolbar-more": !0,
					onClick: () => u((e) => !e),
					children: [/* @__PURE__ */ (0, V.jsx)("span", {
						className: J.moreText,
						children: "More "
					}), /* @__PURE__ */ (0, V.jsx)("span", {
						"aria-hidden": "true",
						className: J.moreMark,
						children: l ? "▾" : "▴"
					})]
				})]
			})
		]
	}), l && /* @__PURE__ */ (0, V.jsxs)(V.Fragment, { children: [/* @__PURE__ */ (0, V.jsx)("div", {
		className: J.backdrop,
		onClick: () => u(!1)
	}), /* @__PURE__ */ (0, V.jsxs)("div", {
		className: J.sheet,
		id: "pp-toolbar-more",
		role: "dialog",
		"aria-label": "More graph controls",
		"data-toolbar-sheet": !0,
		children: [p && /* @__PURE__ */ (0, V.jsxs)("div", {
			className: `${J.section} ${J.narrowOnly}`,
			children: [/* @__PURE__ */ (0, V.jsx)("div", {
				className: J.sectionTitle,
				children: "Dimensions"
			}), /* @__PURE__ */ (0, V.jsx)("div", {
				className: J.wrapRow,
				children: x
			})]
		}), /* @__PURE__ */ (0, V.jsxs)("div", {
			className: J.section,
			children: [/* @__PURE__ */ (0, V.jsx)("div", {
				className: J.sectionTitle,
				children: "View"
			}), /* @__PURE__ */ (0, V.jsx)("div", {
				className: J.wrapRow,
				children: yl.map((e) => /* @__PURE__ */ (0, V.jsx)("button", {
					className: J.action,
					title: e.title,
					onClick: () => {
						bl(e.event), u(!1);
					},
					children: e.label
				}, e.event))
			})]
		})]
	})] })] });
}
//#endregion
//#region src/components/TimeOfDay/TimeOfDay.jsx
function Sl() {
	let e = () => typeof document < "u" && document.documentElement.getAttribute("data-pp-mode") || "dark", [t, n] = (0, _.useState)(e);
	return (0, _.useEffect)(() => {
		let t = new MutationObserver(() => n(e()));
		return t.observe(document.documentElement, {
			attributes: !0,
			attributeFilter: ["data-pp-mode"]
		}), () => t.disconnect();
	}, []), t;
}
var Cl = {
	position: "fixed",
	inset: 0,
	zIndex: -1,
	pointerEvents: "none"
};
function wl({ item: e, settings: t, viewState: n }) {
	let r = (0, Ds.config)(t), [, i] = (0, _.useState)(0);
	(0, _.useEffect)(() => n ? n.subscribe(() => i((e) => e + 1)) : void 0, [n]);
	let a = Sl(), o = !n || !n.preference || n.preference("timeOfDay") !== !1, s = r && o ? (0, Ds.ambienceFor)(e, r, a) : null, c = s ? `${s.top}|${s.bottom}` : "", [l, u] = (0, _.useState)([null, null]), [d, f] = (0, _.useState)(0), p = (0, _.useRef)("");
	if ((0, _.useEffect)(() => {
		if (c === p.current) return;
		p.current = c;
		let e = 1 - d;
		u((t) => {
			let n = t.slice();
			return n[e] = s, n;
		});
		let t = requestAnimationFrame(() => requestAnimationFrame(() => f(e)));
		return () => cancelAnimationFrame(t);
	}, [c]), (0, _.useEffect)(() => {
		let e = document.documentElement;
		s ? (e.setAttribute("data-pp-tod", s.time), s.season ? e.setAttribute("data-pp-season", s.season) : e.removeAttribute("data-pp-season")) : (e.removeAttribute("data-pp-tod"), e.removeAttribute("data-pp-season"));
	}, [c]), !r) return null;
	let m = r.transitionSeconds;
	return /* @__PURE__ */ (0, V.jsx)(V.Fragment, { children: l.map((e, t) => /* @__PURE__ */ (0, V.jsx)("div", {
		"aria-hidden": "true",
		"data-tod-layer": t === d && e ? "front" : "back",
		"data-tod-time": e ? e.time : "",
		style: {
			...Cl,
			background: e ? `linear-gradient(180deg, ${e.top} 0%, ${e.bottom} 100%)` : "transparent",
			opacity: t === d && e ? 1 : 0,
			transition: `opacity ${m}s ease-in-out`
		}
	}, t)) });
}
//#endregion
//#region src/components/Theme/Theme.jsx
var Tl = (/* @__PURE__ */ o(((e, t) => {
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
		graph: { artOffset: .33 },
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
			href: ""
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
				size: Math.max(0, p(e.size, .05)),
				rise: p(e.rise, 0)
			}));
			t.length && n.push({
				x: p(e.x, 0),
				y: p(e.y, 0),
				spans: t
			});
		}
		return { lines: n };
	}
	function s(e) {
		if (!e || typeof e != "object") return null;
		let t = o(e.art), n = o(e.graph);
		if (!t.lines.length && !n.lines.length) return null;
		let a = (t.lines.length ? t : n).lines.map((e) => e.spans.map((e) => e.text).join("")).join(" "), s = m(e.font).trim();
		return {
			text: m(e.text).trim() || a.replace(/\s+/g, " ").trim(),
			font: s,
			family: s ? `'${s.replace(/'/g, "")}', ${i}` : i,
			color: m(e.color).trim(),
			opacity: h(p(e.opacity, r.opacity)),
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
	var l = {
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
	}, { reachConfig: u, backdropConfig: d, backdropOpacity: f } = ps(), p = (e, t) => e !== "" && e != null && Number.isFinite(Number(e)) ? Number(e) : t, m = (e) => typeof e == "string" ? e : "", h = (e) => Math.max(0, Math.min(1, e)), g = (e, t, n) => e + (t - e) * n, _ = (e) => {
		let t = h(e);
		return t * t * (3 - 2 * t);
	};
	function v(e) {
		let t = e && e.opening;
		if (!t || t.enabled !== !0 || t.mode !== void 0 && t.mode !== "two-state") return null;
		let r = t.art && typeof t.art == "object" ? t.art : {}, i = m(r.artState), a = m(r.graphState), o = m(r.full);
		if (!(i && a)) {
			if (!o) return null;
			i = o, a = "";
		}
		let c = t.graph && typeof t.graph == "object" ? t.graph : {}, l = t.byline && typeof t.byline == "object" ? t.byline : {};
		return {
			enabled: !0,
			mode: "two-state",
			art: {
				artState: i,
				graphState: a,
				full: o
			},
			alt: m(t.alt),
			ground: t.ground === "paper" ? "paper" : "dark",
			graph: { artOffset: Math.max(0, Math.min(.95, p(c.artOffset, n.graph.artOffset))) },
			backdrop: d(t),
			reach: u(t),
			byline: {
				text: m(l.text),
				href: m(l.href)
			},
			startOn: [
				"remembered",
				"art",
				"graph"
			].includes(t.startOn) ? t.startOn : n.startOn,
			snapMs: Math.max(0, p(t.snapMs, n.snapMs)),
			title: s(t.title)
		};
	}
	function y(e, { stored: t, hash: n } = {}) {
		return !e || typeof n == "string" && n.startsWith("#read=") ? "graph" : e.startOn === "art" || e.startOn === "graph" ? e.startOn : a.includes(t) ? t : "art";
	}
	function b(e, { vw: t, vh: r, art: i, bottom: a = 0, zoom: o = null } = {}, s = 0) {
		let c = h(s), u = l, d = Math.max(1, i && i.w || 1), p = Math.max(1, i && i.h || 1), m = e && e.byline && e.byline.text ? u.bylineSpace : 0, v = Math.min(u.pad, r * .03), y = Math.max(v, a), b = Math.max(1, r - v - y - m), x = Math.max(.01, Math.min(b / p, (t - 2 * v) / d)), S = d * x, C = p * x, w = e && e.graph || n.graph, T = e && e.backdrop || n.backdrop, E = v + Math.max(0, (b - C) / 2), D = -w.artOffset * C, O = g(E, D, c), k = _((c - u.graphFrom) / (1 - u.graphFrom));
		return {
			p: c,
			vw: t,
			vh: r,
			art: {
				top: O,
				left: (t - S) / 2,
				width: S,
				height: C,
				scale: x,
				opacity: 1
			},
			roots: g(1, o ? f(T, o.k, o.homeK) : T.opacity, c),
			fade: {
				art: 1 - c,
				graph: c
			},
			artTop0: E,
			artTop1: D,
			travel: Math.max(1, E - D),
			graph: {
				opacity: k,
				shift: (1 - k) * u.rise * r
			},
			ground: 1 - c,
			byline: {
				x: t / 2,
				y: O + C + (m - u.bylineSize * 1.3) / 2,
				size: u.bylineSize,
				opacity: h(1 - c * 2.5)
			}
		};
	}
	var x = (e) => 1 - (1 - e) ** 3, S = (e) => e < .5 ? 4 * e * e * e : 1 - (-2 * e + 2) ** 3 / 2;
	function C(e, { start: t = "art", reducedMotion: r = !1, travel: i = 600, now: o = () => Date.now(), frame: s = (e) => setTimeout(() => e(), 16), cancelFrame: c = (e) => clearTimeout(e), setTimer: u = setTimeout, clearTimer: d = clearTimeout, onChange: f = () => {}, onRest: p = () => {} } = {}) {
		let m = e ? e.snapMs : n.snapMs, _ = +(t === "graph"), v = t === "graph" ? "graph" : "art", y = v, b = null, C = null, w = 0, T = 0, E = null, D = Math.max(120, i), O = (e) => +(e === "graph"), k = (e) => e === "graph" ? "art" : "graph";
		function ee(e, t) {
			let n = h(e);
			n === _ && !(t && t.swap) || (_ = n, f(_, t || {}));
		}
		function te() {
			b &&= (c(b.handle), null);
		}
		function ne(e) {
			te(), v = e, y = e, ee(O(e)), T = o() + l.quietMs, p(e);
		}
		function re(e, { ease: t = x } = {}) {
			te();
			let n = O(e);
			if (r) {
				ie(e);
				return;
			}
			let i = _, a = Math.abs(n - i);
			if (a < 1e-4 || m === 0) {
				ne(e);
				return;
			}
			let c = Math.max(l.minSnapMs, m * a), u = o();
			b = {
				target: e,
				handle: null
			};
			let d = () => {
				let r = Math.min(1, (o() - u) / c);
				if (ee(g(i, n, t(r))), r >= 1) {
					b = null, ne(e);
					return;
				}
				b.handle = s(d);
			};
			b.handle = s(d);
		}
		function ie(e) {
			te(), !(v === e && _ === O(e)) && (v = e, y = e, _ = O(e), f(_, {
				swap: !0,
				ms: l.reducedFadeMs
			}), T = o() + l.quietMs, p(e));
		}
		function A(e = 0) {
			let t = O(y), n = _ - t, r = y, i = t === 0 ? 1 : -1;
			n * i > l.onward && (r = k(y)), e * i > l.flickPxPerMs && (r = k(y)), e * i < -l.flickPxPerMs && (r = y), re(r);
		}
		function j(e) {
			b || (y = _ >= 1 ? "graph" : _ <= 0 ? "art" : y), te(), ee(_ + e);
		}
		function M(e, { instant: t = !1 } = {}) {
			return a.includes(e) ? t ? (ne(e), !0) : v === e && _ === O(e) && !b ? !1 : (re(e, { ease: S }), !0) : !1;
		}
		function ae(e, { deltaMode: t = 0, where: n = "stage" } = {}) {
			let i = e * (t === 1 ? l.lineHeightPx : t === 2 ? D : 1);
			if (!i) return !1;
			let a = !b && (_ === 0 || _ === 1);
			if ((n === "graph" || n === "edge") && a && _ === 1) {
				if (o() < T) return !0;
				if (!(n === "edge" && i < 0)) return !1;
			}
			if (r) {
				if (o() < T) return !0;
				if (w += i, Math.abs(w) >= l.reducedWheelPx) {
					let e = w > 0 ? "graph" : "art";
					w = 0, e !== v && ie(e);
				}
				return !0;
			}
			return a && (_ === 0 && i < 0 || _ === 1 && i > 0) ? !0 : (j(i / D), C && d(C), C = u(() => {
				C = null, _ > 0 && _ < 1 ? A(0) : ne(_ >= 1 ? "graph" : "art");
			}, l.wheelIdleMs), !0);
		}
		function oe(e, t = o()) {
			b && (y = b.target === "graph" ? "art" : "graph", te()), E = {
				y: e,
				p: _,
				lastY: e,
				lastT: t,
				v: 0,
				total: 0
			}, w = 0;
		}
		function se(e, t = o()) {
			if (!E) return !1;
			let n = E.lastY - e, i = Math.max(1, t - E.lastT);
			return E.v = n / i * .6 + .4 * E.v, E.lastY = e, E.lastT = t, E.total += n, r || ee(E.p + (E.y - e) / D), !0;
		}
		function ce(e = o()) {
			if (!E) return !1;
			let { v: t, total: n, lastT: i } = E;
			if (E = null, r) {
				if (Math.abs(n) >= l.reducedWheelPx) {
					let e = n > 0 ? "graph" : "art";
					e !== v && ie(e);
				}
				return !0;
			}
			let a = e - i > 120 ? 0 : t;
			return _ === 0 || _ === 1 ? (ne(_ === 1 ? "graph" : "art"), !0) : (A(a), !0);
		}
		function N(e) {
			return e === "down" ? M("graph") : e === "up" ? M("art") : !1;
		}
		return {
			get p() {
				return _;
			},
			get rest() {
				return v;
			},
			get moving() {
				return !!b || _ > 0 && _ < 1;
			},
			wheel: ae,
			touchStart: oe,
			touchMove: se,
			touchEnd: ce,
			key: N,
			tapArt: () => M("graph"),
			tapTop: () => M("art"),
			go: M,
			resize(e) {
				D = Math.max(120, e);
			},
			dispose() {
				te(), C &&= (d(C), null);
			}
		};
	}
	function w(e) {
		return !e || e.altKey || e.ctrlKey || e.metaKey ? null : e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " || e.key === "Spacebar") && !e.shiftKey ? "down" : e.key === "ArrowUp" || e.key === "PageUp" ? "up" : null;
	}
	t.exports = {
		DEFAULTS: n,
		TUNING: l,
		STATES: a,
		TITLE_DEFAULTS: r,
		TITLE_FALLBACK: i,
		openingConfig: v,
		titleConfig: s,
		titleLayout: c,
		startState: y,
		coverGeometry: b,
		createCover: C,
		pageKey: w
	};
})))();
function El({ settings: e, viewState: t }) {
	let [, n] = (0, _.useState)(0), r = typeof window < "u" && window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null, [i, a] = (0, _.useState)(r ? r.matches : !0);
	(0, _.useEffect)(() => t ? t.subscribe(() => n((e) => e + 1)) : void 0, [t]), (0, _.useEffect)(() => {
		if (!r) return;
		let e = (e) => a(e.matches);
		return r.addEventListener ? r.addEventListener("change", e) : r.addListener(e), () => {
			r.removeEventListener ? r.removeEventListener("change", e) : r.removeListener(e);
		};
	}, []);
	let o = (0, Hc.themeName)(e, t && t.preference ? t.preference("theme") : null), s = (0, Hc.themeMode)(o, t && t.preference ? t.preference("mode") : null, i), c = (0, Tl.openingConfig)(e), l = c && c.ground === "dark" ? "dark" : s;
	return (0, _.useEffect)(() => {
		let e = document.documentElement;
		e.getAttribute("data-pp-theme") !== o && e.setAttribute("data-pp-theme", o), e.getAttribute("data-pp-mode") !== l && e.setAttribute("data-pp-mode", l), e.getAttribute("data-pp-reader-mode") !== s && e.setAttribute("data-pp-reader-mode", s), e.style.colorScheme = l;
	}, [
		o,
		s,
		l
	]), null;
}
var Dl = {
	cover: "_cover_p6kb6_9",
	ground: "_ground_p6kb6_18",
	stage: "_stage_p6kb6_25",
	art: "_art_p6kb6_40",
	image: "_image_p6kb6_54",
	reach: "_reach_p6kb6_64",
	title: "_title_p6kb6_94",
	alt: "_alt_p6kb6_114",
	byline: "_byline_p6kb6_123",
	section: "_section_p6kb6_148",
	handle: "_handle_p6kb6_155",
	grip: "_grip_p6kb6_171"
}, Ol = () => typeof window < "u" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function kl(e) {
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
var Al = new Set([
	"radio",
	"slider",
	"listbox",
	"option",
	"menu",
	"menuitem",
	"tab",
	"spinbutton",
	"textbox",
	"combobox"
]);
function jl(e) {
	let t = e.target;
	return !!(t && t.nodeType === 1 && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || Al.has(t.getAttribute("role")) || t.closest("[data-reader-panel], [role=\"dialog\"], [data-settings-panel]") || (e.key === " " || e.key === "Spacebar") && t.closest("button, a[href], summary, [role=\"button\"]")) || typeof window < "u" && window.location.hash.startsWith("#read=") || typeof document < "u" && document.querySelector("[data-settings-panel]"));
}
function Ml(e) {
	let t = typeof document < "u" && document.querySelector("[data-rights]");
	if (!t) return 0;
	let n = t.getBoundingClientRect();
	return n.height > 0 ? Math.max(0, e - n.top + 8) : 0;
}
var Nl = 8, Pl = "http://www.w3.org/2000/svg";
function Fl(e, t, { reduced: n, seed: r }) {
	let i = /* @__PURE__ */ new Map(), a = n ? 0 : e.lagMs;
	function o(e, n, i) {
		let o = document.createElementNS(Pl, "g");
		o.setAttribute("data-reach", e), o.setAttribute("data-reach-container", n), o.setAttribute("data-reach-tip", String(i));
		let s = document.createElementNS(Pl, "path");
		s.setAttribute("class", "reach-main");
		let c = document.createElementNS(Pl, "path");
		return c.setAttribute("class", "reach-fine"), o.append(s, c), o.style.visibility = "hidden", t.appendChild(o), {
			key: e,
			g: o,
			main: s,
			fine: c,
			shape: (0, Es.reachShape)(`${r}|${e}`),
			lag: (0, Es.createLag)(a),
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
		let d = e.tips.map((e) => (0, Es.artPoint)(e, r)), f = /* @__PURE__ */ new Set(), p = !1;
		for (let t of u.containers) for (let r of (0, Es.reachFor)(d, t, e.perContainer, e.stopShort)) {
			let e = r.tip, c = `${t.id}|${e}`;
			f.add(c);
			let u = i.get(c);
			u || (u = o(c, t.id, e), i.set(c, u)), u.state === "new" || !l ? u.lag.jump(r.end) : u.lag.to(r.end, n);
			let m = u.lag.at(n);
			u.lag.settled(n) || (p = !0);
			let h = (0, Es.reachPath)(d[e], m, u.shape);
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
function Y({ layout: e, size: t, which: n, opacity: r }) {
	let i = (0, Tl.titleLayout)(e, {
		left: 0,
		top: 0,
		width: t.w,
		height: t.h
	}).lines;
	return i.length ? /* @__PURE__ */ (0, V.jsx)("g", {
		"data-cover-title": n,
		style: { opacity: r },
		children: i.map((e, t) => {
			let n = 0;
			return /* @__PURE__ */ (0, V.jsx)("text", {
				x: e.x,
				y: e.y,
				"data-cover-title-line": t,
				xmlSpace: "preserve",
				children: e.spans.map((e, t) => {
					let r = n - e.rise;
					return n = e.rise, /* @__PURE__ */ (0, V.jsx)("tspan", {
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
function Il(e, t) {
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
function X({ title: e, size: t, start: n, refs: r }) {
	return !e || !t ? null : /* @__PURE__ */ (0, V.jsxs)("svg", {
		className: Dl.title,
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
		children: [/* @__PURE__ */ (0, V.jsx)("g", {
			ref: r.art,
			children: /* @__PURE__ */ (0, V.jsx)(Y, {
				layout: e.art,
				size: t,
				which: "art",
				opacity: +(n === "art")
			})
		}), /* @__PURE__ */ (0, V.jsx)("g", {
			ref: r.graph,
			children: /* @__PURE__ */ (0, V.jsx)(Y, {
				layout: e.graph,
				size: t,
				which: "graph",
				opacity: n === "art" ? 0 : 1
			})
		})]
	});
}
function Z({ config: e, viewState: t, children: n }) {
	let r = (0, _.useRef)(null), i = (0, _.useRef)(null), a = (0, _.useRef)(null), o = (0, _.useRef)(null), s = (0, _.useRef)(null), c = (0, _.useRef)(null), l = (0, _.useRef)(null), u = (0, _.useRef)(null), d = (0, _.useRef)(null), f = (0, _.useRef)(null), p = (0, _.useRef)(null), m = (0, _.useRef)(0), h = (0, _.useRef)(null), g = (0, _.useRef)(null), v = (0, _.useRef)(null), y = (0, _.useRef)(null), b = (0, _.useRef)(null), x = (0, _.useRef)(null), S = (0, _.useRef)(null), C = (0, _.useRef)(null), w = (0, _.useRef)(() => !1), [T, E] = (0, _.useState)(null), D = (0, _.useMemo)(Ol, []), O = (0, _.useMemo)(() => (0, Tl.startState)(e, {
		stored: t && t.openingState ? t.openingState() : null,
		hash: typeof window < "u" ? window.location.hash : ""
	}), [e, t]);
	(0, _.useEffect)(() => {
		let t = !0;
		return kl(e.art.artState).then((e) => {
			t && E(e || {
				w: 1,
				h: 2
			});
		}), () => {
			t = !1;
		};
	}, [e]);
	let k = (t) => {
		let n = window.innerWidth, r = window.innerHeight;
		return (0, Tl.coverGeometry)(e, {
			vw: n,
			vh: r,
			art: C.current || {
				w: 1,
				h: 2
			},
			bottom: Ml(r),
			zoom: f.current
		}, t);
	}, ee = () => {
		h.current = null;
		let t = window.PostPipeGraphWorld ? window.PostPipeGraphWorld.snapshot() : null;
		t && t.k > 0 && t.homeK > 0 && (f.current = {
			k: t.k,
			homeK: t.homeK
		});
		let n = S.current;
		if (!n) return;
		let r = k(n.p);
		p.current = r, re(r);
		let i = d.current;
		if (!i || !C.current) return;
		let a = f.current ? (0, Es.backdropOpacity)(e.backdrop, f.current.k, f.current.homeK) : e.backdrop.opacity;
		i.draw(performance.now(), {
			box: r.art,
			world: t,
			opacity: r.graph.opacity * a,
			settledCover: n.p >= 1 && !n.moving
		}) && te();
	}, te = () => {
		h.current ||= requestAnimationFrame(() => ne.current());
	}, ne = (0, _.useRef)(ee);
	ne.current = ee;
	let re = (e) => {
		let t = c.current;
		t ? t.style.opacity = String(e.fade.graph * e.roots) : s.current && (s.current.style.opacity = String(e.roots)), l.current && (l.current.style.opacity = String(e.fade.graph));
	}, ie = () => {
		if (!C.current) return;
		let e = k(1);
		window.PostPipeCoverFrame = {
			art: {
				left: e.art.left,
				top: e.art.top,
				width: e.art.width,
				height: e.art.height
			},
			natural: { ...C.current }
		}, window.dispatchEvent(new CustomEvent("postpipe:cover-frame"));
	}, A = (0, _.useRef)(ie);
	A.current = ie;
	let j = (e) => {
		let t = k(e), n = S.current, r = n && n.moving ? "moving" : e >= 1 ? "graph" : e <= 0 ? "art" : "moving", l = document.documentElement;
		l.style.setProperty("--pp-cover-p", String(t.p)), l.setAttribute("data-pp-cover", r);
		let u = o.current;
		u && (u.style.width = `${t.art.width}px`, u.style.height = `${t.art.height}px`, u.style.transform = `translate3d(${t.art.left}px, ${t.art.top}px, 0)`, u.style.opacity = C.current ? String(t.art.opacity) : "0"), p.current = t, c.current && s.current && (s.current.style.opacity = String(t.fade.art)), re(t);
		let d = g.current && g.current.firstChild, f = v.current && v.current.firstChild;
		d && (d.style.opacity = String(t.fade.art)), f && (f.style.opacity = String(t.fade.graph)), i.current && (i.current.style.opacity = String(t.ground));
		let h = y.current;
		h && (h.style.left = `${t.byline.x}px`, h.style.top = `${t.byline.y}px`, h.style.fontSize = `${t.byline.size}px`, h.style.opacity = C.current ? String(t.byline.opacity) : "0", h.style.pointerEvents = t.byline.opacity > .5 ? "auto" : "none", h.tabIndex = r === "art" ? 0 : -1);
		let _ = a.current;
		_ && (_.setAttribute("data-cover-state", r), _.tabIndex = r === "art" ? 0 : -1);
		let w = b.current;
		if (w) {
			let e = r === "graph";
			m.current = e ? 0 : t.graph.shift, w.style.opacity = e ? "" : String(t.graph.opacity), w.style.transform = e ? "" : `translate3d(0, ${t.graph.shift}px, 0)`, w.style.pointerEvents = e ? "" : "none", w.inert = r === "art", r === "art" ? w.setAttribute("aria-hidden", "true") : w.removeAttribute("aria-hidden");
		}
		let T = x.current;
		T && (T.style.opacity = String(t.graph.opacity), T.style.pointerEvents = r === "graph" ? "auto" : "none", T.tabIndex = r === "graph" ? 0 : -1), te();
	}, M = (0, _.useRef)(j);
	M.current = j, (0, _.useEffect)(() => {
		if (!e.title || !e.title.hideGraphTitle) return;
		let t = document.documentElement;
		return t.setAttribute("data-pp-cover-title", ""), () => t.removeAttribute("data-pp-cover-title");
	}, [e]), (0, _.useLayoutEffect)(() => {
		if (!T) return;
		C.current = T;
		let e = S.current;
		e && (e.resize(k(0).travel), M.current(e.p)), A.current();
	}, [T]), (0, _.useEffect)(() => {
		e.reach && u.current && (d.current = Fl(e.reach, u.current, {
			reduced: D,
			seed: e.art.graphState || e.art.artState
		}));
		let t = () => te();
		return window.addEventListener("graph:world", t), te(), () => {
			window.removeEventListener("graph:world", t), h.current && cancelAnimationFrame(h.current), h.current = null, d.current && d.current.dispose(), d.current = null, window.PostPipeCoverFrame && delete window.PostPipeCoverFrame;
		};
	}, [e, D]), (0, _.useLayoutEffect)(() => {
		let n = null, i = (0, Tl.createCover)(e, {
			start: O,
			reducedMotion: D,
			travel: k(0).travel,
			frame: (e) => requestAnimationFrame(e),
			cancelFrame: (e) => cancelAnimationFrame(e),
			onChange(e, t) {
				if (t && t.swap) {
					let i = Math.round((t.ms || Tl.TUNING.reducedFadeMs) / 2), a = [r.current, b.current].filter(Boolean);
					for (let e of a) e.style.transition = `opacity ${i}ms linear`, e.style.opacity = "0";
					n && clearTimeout(n);
					let o = Date.now(), s = () => {
						let t = r.current;
						if ((t ? Number(getComputedStyle(t).opacity) : 0) > .02 && Date.now() - o < i * 4) {
							n = setTimeout(s, 16);
							return;
						}
						M.current(e), t && (t.style.opacity = "1"), n = setTimeout(() => {
							for (let e of a) e.style.transition = "";
							n = null;
						}, i + 20);
					};
					n = setTimeout(s, i);
					return;
				}
				M.current(e);
			},
			onRest(e) {
				n || M.current(i.p), t && t.setOpeningState && (t.setOpeningState(e), t.flush && t.flush()), window.dispatchEvent(new CustomEvent("postpipe:cover", { detail: { state: e } }));
			}
		});
		S.current = i, M.current(i.p), t && t.setOpeningState && t.setOpeningState(i.rest), window.PostPipeCover = {
			get state() {
				return i.moving ? "moving" : i.rest;
			},
			get p() {
				return i.p;
			},
			get shift() {
				return m.current;
			},
			go: (e, t) => i.go(e, t)
		};
		let o = () => {
			i.resize(k(0).travel), M.current(i.p), A.current();
		};
		window.addEventListener("resize", o);
		let s = b.current, c = a.current, l = x.current, u = (e) => {
			let t = e.target;
			return !t || !t.closest ? null : l && l.contains(t) ? "edge" : c && c.contains(t) ? "stage" : !s || !s.contains(t) ? null : i.moving || i.p < 1 ? "stage" : e.clientY <= Tl.TUNING.edgePx ? "edge" : "graph";
		}, d = (e) => {
			if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
			let t = u(e);
			t && (e.ctrlKey && t === "graph" || i.wheel(e.deltaY, {
				deltaMode: e.deltaMode,
				where: t
			}) && (e.preventDefault(), e.stopPropagation()));
		};
		window.addEventListener("wheel", d, {
			capture: !0,
			passive: !1
		});
		let f = (e) => {
			let t = (0, Tl.pageKey)(e);
			!t || e.defaultPrevented || jl(e) || i.key(t) && e.preventDefault();
		};
		window.addEventListener("keydown", f);
		let p = () => {
			window.location.hash.startsWith("#read=") && i.go("graph");
		};
		window.addEventListener("hashchange", p);
		let h = null, g = 0;
		w.current = () => Date.now() - g < 500;
		let _ = (e) => {
			e.touches.length === 1 && (e.target.closest && e.target.closest("[data-cover-byline]") || (h = {
				y: e.touches[0].clientY,
				moved: 0
			}, i.touchStart(e.touches[0].clientY, e.timeStamp || Date.now())));
		}, v = (e) => {
			h && (e.preventDefault(), h.moved = Math.max(h.moved, Math.abs(e.touches[0].clientY - h.y)), i.touchMove(e.touches[0].clientY, e.timeStamp || Date.now()));
		}, y = (e) => {
			h && (h.moved >= Nl && (g = Date.now()), h = null, i.touchEnd(e.timeStamp || Date.now()));
		}, C = [c, l].filter(Boolean);
		for (let e of C) e.addEventListener("touchstart", _, { passive: !0 }), e.addEventListener("touchmove", v, { passive: !1 }), e.addEventListener("touchend", y), e.addEventListener("touchcancel", y);
		return () => {
			i.dispose(), n && clearTimeout(n), window.removeEventListener("resize", o), window.removeEventListener("wheel", d, { capture: !0 }), window.removeEventListener("keydown", f), window.removeEventListener("hashchange", p);
			for (let e of C) e.removeEventListener("touchstart", _), e.removeEventListener("touchmove", v), e.removeEventListener("touchend", y), e.removeEventListener("touchcancel", y);
			document.documentElement.removeAttribute("data-pp-cover"), document.documentElement.style.removeProperty("--pp-cover-p"), window.PostPipeCover && window.PostPipeCover.go && delete window.PostPipeCover, S.current = null;
		};
	}, [
		e,
		D,
		O,
		t
	]);
	let ae = (e) => {
		let t = S.current;
		!t || w.current() || (e === "graph" ? t.tapArt() : t.tapTop());
	}, oe = O === "art";
	return /* @__PURE__ */ (0, V.jsxs)(V.Fragment, { children: [
		/* @__PURE__ */ (0, V.jsxs)("div", {
			ref: r,
			className: Dl.cover,
			"data-cover": !0,
			"data-ground": e.ground,
			children: [
				/* @__PURE__ */ (0, V.jsx)("div", {
					ref: i,
					className: Dl.ground,
					style: { opacity: +!!oe }
				}),
				/* @__PURE__ */ (0, V.jsxs)("div", {
					ref: a,
					className: Dl.stage,
					role: "button",
					tabIndex: oe ? 0 : -1,
					"aria-label": "Show the graph",
					"data-cover-stage": !0,
					"data-cover-state": O,
					onClick: (e) => {
						e.target.closest && e.target.closest("[data-cover-byline]") || S.current && S.current.p < .5 && ae("graph");
					},
					onKeyDown: (e) => {
						e.target === e.currentTarget && (e.key === "Enter" || e.key === " " || e.key === "Spacebar") && (e.preventDefault(), e.stopPropagation(), ae("graph"));
					},
					children: [
						/* @__PURE__ */ (0, V.jsxs)("div", {
							ref: o,
							className: Dl.art,
							"data-cover-art": !0,
							style: { opacity: 0 },
							children: [
								/* @__PURE__ */ (0, V.jsx)("img", {
									ref: s,
									className: Dl.image,
									src: e.art.artState,
									alt: "",
									draggable: "false",
									"data-cover-image": "art",
									style: e.art.graphState ? { opacity: +!!oe } : void 0
								}),
								e.art.graphState && /* @__PURE__ */ (0, V.jsx)("img", {
									ref: c,
									className: Dl.image,
									src: e.art.graphState,
									alt: "",
									draggable: "false",
									"data-cover-image": "graph",
									style: {
										opacity: oe ? 0 : e.backdrop.opacity,
										...Il(e.backdrop.keepAbove, "below")
									}
								}),
								e.art.graphState && e.backdrop.keepAbove > 0 && /* @__PURE__ */ (0, V.jsx)("img", {
									ref: l,
									className: Dl.image,
									src: e.art.graphState,
									alt: "",
									draggable: "false",
									"data-cover-image": "graph-keep",
									style: {
										opacity: +!oe,
										...Il(e.backdrop.keepAbove, "above")
									}
								}),
								/* @__PURE__ */ (0, V.jsx)(X, {
									title: e.title,
									size: T,
									start: O,
									refs: {
										art: g,
										graph: v
									}
								})
							]
						}),
						e.alt && /* @__PURE__ */ (0, V.jsx)("span", {
							className: Dl.alt,
							role: "img",
							"aria-label": e.alt,
							"data-cover-alt": !0
						}),
						e.byline.text && /* @__PURE__ */ (0, V.jsx)("a", {
							ref: y,
							className: Dl.byline,
							href: e.byline.href || void 0,
							"data-cover-byline": !0,
							style: { opacity: 0 },
							onClick: (e) => e.stopPropagation(),
							children: e.byline.text
						})
					]
				}),
				e.reach && /* @__PURE__ */ (0, V.jsx)("svg", {
					ref: u,
					className: Dl.reach,
					"aria-hidden": "true",
					"data-cover-reach": !0,
					style: { opacity: 0 }
				})
			]
		}),
		/* @__PURE__ */ (0, V.jsx)("div", {
			ref: b,
			className: Dl.section,
			"data-cover-section": !0,
			style: oe ? {
				opacity: 0,
				pointerEvents: "none"
			} : void 0,
			children: n
		}),
		/* @__PURE__ */ (0, V.jsx)("button", {
			ref: x,
			type: "button",
			className: Dl.handle,
			"aria-label": "Show the cover",
			title: "Show the cover",
			"data-cover-handle": !0,
			tabIndex: oe ? -1 : 0,
			style: {
				opacity: +!oe,
				pointerEvents: oe ? "none" : "auto"
			},
			onClick: () => ae("art"),
			children: /* @__PURE__ */ (0, V.jsx)("span", {
				className: Dl.grip,
				"aria-hidden": "true"
			})
		})
	] });
}
function Q({ settings: e, viewState: t, children: n }) {
	let r = (0, _.useMemo)(() => (0, Tl.openingConfig)(e), [e]);
	return r ? /* @__PURE__ */ (0, V.jsx)(Z, {
		config: r,
		viewState: t,
		children: n
	}) : /* @__PURE__ */ (0, V.jsx)(V.Fragment, { children: n });
}
//#endregion
//#region src/components/Contributions/useContributions.js
function Ll(e, t) {
	let n = JSON.stringify(e && e.contributions || null), r = (0, _.useMemo)(() => (0, Os.contributionsConfig)(e), [n]), [i, a] = (0, _.useState)(null);
	(0, _.useEffect)(() => {
		if (!r) return;
		let e = !0, t = r.src.includes("?") ? "&" : "?";
		return fetch(r.src + t + "v=" + Date.now()).then((e) => e.ok ? e.json() : null).then((t) => {
			e && a(t);
		}).catch(() => {
			e && a(null);
		}), () => {
			e = !1;
		};
	}, [r && r.src]);
	let o = (0, _.useMemo)(() => r && i ? (0, Os.visibleContributions)(i, {
		items: t && t.items || [],
		showTest: r.showTest
	}) : [], [
		n,
		i,
		t
	]);
	return {
		config: r,
		list: o,
		layers: (0, _.useMemo)(() => (0, Os.connectionEdges)(o).length ? ["readers"] : [], [o])
	};
}
//#endregion
export { cl as ConfigPanel, Oc as FeedZ, Rs as GraphViewer, Q as Opening, _ as React, v as ReactDOM, vc as ReaderPanel, rl as Settings, Ec as TTS, El as Theme, wl as TimeOfDay, hl as TimeOverlay, xl as Toolbar, Ll as useContributions };
