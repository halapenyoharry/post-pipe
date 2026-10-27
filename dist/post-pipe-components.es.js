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
	var A = /\/+/g;
	function j(e, t) {
		return typeof e == "object" && e && e.key != null ? k("" + e.key) : t.toString(36);
	}
	function ee(e) {
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
	function M(e, r, i, a, o) {
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
				case d: return c = e._init, M(c(e._payload), r, i, a, o);
			}
		}
		if (c) return o = o(e), c = a === "" ? "." + j(e, 0) : a, S(o) ? (i = "", c != null && (i = c.replace(A, "$&/") + "/"), M(o, r, i, "", function(e) {
			return e;
		})) : o != null && (O(o) && (o = D(o, i + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace(A, "$&/") + "/") + c)), r.push(o)), 1;
		c = 0;
		var l = a === "" ? "." : a + ":";
		if (S(e)) for (var u = 0; u < e.length; u++) a = e[u], s = l + j(a, u), c += M(a, r, i, s, o);
		else if (u = m(e), typeof u == "function") for (e = u.call(e), u = 0; !(a = e.next()).done;) a = a.value, s = l + j(a, u++), c += M(a, r, i, s, o);
		else if (s === "object") {
			if (typeof e.then == "function") return M(ee(e), r, i, a, o);
			throw r = String(e), Error("Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead.");
		}
		return c;
	}
	function N(e, t, n) {
		if (e == null) return e;
		var r = [], i = 0;
		return M(e, r, "", "", function(e) {
			return t.call(n, e, i++);
		}), r;
	}
	function P(e) {
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
	var F = typeof reportError == "function" ? reportError : function(e) {
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
	}, I = {
		map: N,
		forEach: function(e, t, n) {
			N(e, function() {
				t.apply(this, arguments);
			}, n);
		},
		count: function(e) {
			var t = 0;
			return N(e, function() {
				t++;
			}), t;
		},
		toArray: function(e) {
			return N(e, function(e) {
				return e;
			}) || [];
		},
		only: function(e) {
			if (!O(e)) throw Error("React.Children.only expected to receive a single React element child.");
			return e;
		}
	};
	e.Activity = f, e.Children = I, e.Component = v, e.Fragment = r, e.Profiler = a, e.PureComponent = b, e.StrictMode = i, e.Suspense = l, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = w, e.__COMPILER_RUNTIME = {
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
			_init: P
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
			i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && r.then(C, F);
		} catch (e) {
			F(e);
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
			t !== null && j(x, t.startTime - e);
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
								u !== null && j(x, u.startTime - t), i = !1;
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
		var k = new MessageChannel(), A = k.port2;
		k.port1.onmessage = D, O = function() {
			A.postMessage(null);
		};
	} else O = function() {
		_(D, 0);
	};
	function j(t, n) {
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
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(C), C = -1) : h = !0, j(x, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, S || (S = !0, O()))), r;
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
	var h = Object.assign, g = Symbol.for("react.element"), _ = Symbol.for("react.transitional.element"), v = Symbol.for("react.portal"), y = Symbol.for("react.fragment"), b = Symbol.for("react.strict_mode"), x = Symbol.for("react.profiler"), S = Symbol.for("react.consumer"), C = Symbol.for("react.context"), w = Symbol.for("react.forward_ref"), T = Symbol.for("react.suspense"), E = Symbol.for("react.suspense_list"), D = Symbol.for("react.memo"), O = Symbol.for("react.lazy"), k = Symbol.for("react.activity"), A = Symbol.for("react.memo_cache_sentinel"), j = Symbol.iterator;
	function ee(e) {
		return typeof e != "object" || !e ? null : (e = j && e[j] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var M = Symbol.for("react.client.reference");
	function N(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === M ? null : e.displayName || e.name || null;
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
			case D: return t = e.displayName || null, t === null ? N(e.type) || "Memo" : t;
			case O:
				t = e._payload, e = e._init;
				try {
					return N(e(t));
				} catch {}
		}
		return null;
	}
	var P = Array.isArray, F = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, I = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, L = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, te = [], ne = -1;
	function re(e) {
		return { current: e };
	}
	function ie(e) {
		0 > ne || (e.current = te[ne], te[ne] = null, ne--);
	}
	function R(e, t) {
		ne++, te[ne] = e.current, e.current = t;
	}
	var ae = re(null), oe = re(null), se = re(null), ce = re(null);
	function le(e, t) {
		switch (R(se, t), R(oe, e), R(ae, null), t.nodeType) {
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
		ie(ae), R(ae, e);
	}
	function ue() {
		ie(ae), ie(oe), ie(se);
	}
	function de(e) {
		e.memoizedState !== null && R(ce, e);
		var t = ae.current, n = Hd(t, e.type);
		t !== n && (R(oe, e), R(ae, n));
	}
	function fe(e) {
		oe.current === e && (ie(ae), ie(oe)), ce.current === e && (ie(ce), Qf._currentValue = L);
	}
	var pe, me;
	function he(e) {
		if (pe === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			pe = t && t[1] || "", me = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + pe + e + me;
	}
	var ge = !1;
	function _e(e, t) {
		if (!e || ge) return "";
		ge = !0;
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
			ge = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? he(n) : "";
	}
	function ve(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return he(e.type);
			case 16: return he("Lazy");
			case 13: return e.child !== t && t !== null ? he("Suspense Fallback") : he("Suspense");
			case 19: return he("SuspenseList");
			case 0:
			case 15: return _e(e.type, !1);
			case 11: return _e(e.type.render, !1);
			case 1: return _e(e.type, !0);
			case 31: return he("Activity");
			default: return "";
		}
	}
	function ye(e) {
		try {
			var t = "", n = null;
			do
				t += ve(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var be = Object.prototype.hasOwnProperty, xe = t.unstable_scheduleCallback, Se = t.unstable_cancelCallback, Ce = t.unstable_shouldYield, we = t.unstable_requestPaint, Te = t.unstable_now, Ee = t.unstable_getCurrentPriorityLevel, De = t.unstable_ImmediatePriority, Oe = t.unstable_UserBlockingPriority, ke = t.unstable_NormalPriority, Ae = t.unstable_LowPriority, je = t.unstable_IdlePriority, Me = t.log, Ne = t.unstable_setDisableYieldValue, Pe = null, Fe = null;
	function Ie(e) {
		if (typeof Me == "function" && Ne(e), Fe && typeof Fe.setStrictMode == "function") try {
			Fe.setStrictMode(Pe, e);
		} catch {}
	}
	var Le = Math.clz32 ? Math.clz32 : Be, Re = Math.log, ze = Math.LN2;
	function Be(e) {
		return e >>>= 0, e === 0 ? 32 : 31 - (Re(e) / ze | 0) | 0;
	}
	var Ve = 256, He = 262144, Ue = 4194304;
	function We(e) {
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
	function Ge(e, t, n) {
		var r = e.pendingLanes;
		if (r === 0) return 0;
		var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
		e = e.warmLanes;
		var s = r & 134217727;
		return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = We(n))) : i = We(o) : i = We(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = We(n))) : i = We(o)) : i = We(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
	}
	function Ke(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function qe(e, t) {
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
	function Je() {
		var e = Ue;
		return Ue <<= 1, !(Ue & 62914560) && (Ue = 4194304), e;
	}
	function Ye(e) {
		for (var t = [], n = 0; 31 > n; n++) t.push(e);
		return t;
	}
	function Xe(e, t) {
		e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
	}
	function Ze(e, t, n, r, i, a) {
		var o = e.pendingLanes;
		e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
		var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
		for (n = o & ~n; 0 < n;) {
			var u = 31 - Le(n), d = 1 << u;
			s[u] = 0, c[u] = -1;
			var f = l[u];
			if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
				var p = f[u];
				p !== null && (p.lane &= -536870913);
			}
			n &= ~d;
		}
		r !== 0 && Qe(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
	}
	function Qe(e, t, n) {
		e.pendingLanes |= t, e.suspendedLanes &= ~t;
		var r = 31 - Le(t);
		e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
	}
	function $e(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - Le(n), i = 1 << r;
			i & t | e[r] & t && (e[r] |= t), n &= ~i;
		}
	}
	function et(e, t) {
		var n = t & -t;
		return n = n & 42 ? 1 : tt(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
	}
	function tt(e) {
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
	function nt(e) {
		return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
	}
	function rt() {
		var e = I.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : mp(e.type)) : e;
	}
	function it(e, t) {
		var n = I.p;
		try {
			return I.p = e, t();
		} finally {
			I.p = n;
		}
	}
	var at = Math.random().toString(36).slice(2), ot = "__reactFiber$" + at, st = "__reactProps$" + at, ct = "__reactContainer$" + at, lt = "__reactEvents$" + at, ut = "__reactListeners$" + at, dt = "__reactHandles$" + at, ft = "__reactResources$" + at, pt = "__reactMarker$" + at;
	function mt(e) {
		delete e[ot], delete e[st], delete e[lt], delete e[ut], delete e[dt];
	}
	function ht(e) {
		var t = e[ot];
		if (t) return t;
		for (var n = e.parentNode; n;) {
			if (t = n[ct] || n[ot]) {
				if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = df(e); e !== null;) {
					if (n = e[ot]) return n;
					e = df(e);
				}
				return t;
			}
			e = n, n = e.parentNode;
		}
		return null;
	}
	function gt(e) {
		if (e = e[ot] || e[ct]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function _t(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(i(33));
	}
	function vt(e) {
		var t = e[ft];
		return t ||= e[ft] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}, t;
	}
	function yt(e) {
		e[pt] = !0;
	}
	var bt = /* @__PURE__ */ new Set(), xt = {};
	function St(e, t) {
		Ct(e, t), Ct(e + "Capture", t);
	}
	function Ct(e, t) {
		for (xt[e] = t, e = 0; e < t.length; e++) bt.add(t[e]);
	}
	var wt = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Tt = {}, Et = {};
	function Dt(e) {
		return be.call(Et, e) ? !0 : be.call(Tt, e) ? !1 : wt.test(e) ? Et[e] = !0 : (Tt[e] = !0, !1);
	}
	function Ot(e, t, n) {
		if (Dt(t)) if (n === null) e.removeAttribute(t);
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
	function kt(e, t, n) {
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
	function At(e, t, n, r) {
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
	function jt(e) {
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
	function Mt(e) {
		var t = e.type;
		return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
	}
	function Nt(e, t, n) {
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
	function Pt(e) {
		if (!e._valueTracker) {
			var t = Mt(e) ? "checked" : "value";
			e._valueTracker = Nt(e, t, "" + e[t]);
		}
	}
	function Ft(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = Mt(e) ? e.checked ? "true" : "false" : e.value), e = r, e === n ? !1 : (t.setValue(e), !0);
	}
	function It(e) {
		if (e ||= typeof document < "u" ? document : void 0, e === void 0) return null;
		try {
			return e.activeElement || e.body;
		} catch {
			return e.body;
		}
	}
	var Lt = /[\n"\\]/g;
	function Rt(e) {
		return e.replace(Lt, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function zt(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + jt(t)) : e.value !== "" + jt(t) && (e.value = "" + jt(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : Vt(e, o, jt(n)) : Vt(e, o, jt(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + jt(s) : e.removeAttribute("name");
	}
	function Bt(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				Pt(e);
				return;
			}
			n = n == null ? "" : "" + jt(n), t = t == null ? n : "" + jt(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r ??= i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), Pt(e);
	}
	function Vt(e, t, n) {
		t === "number" && It(e.ownerDocument) === e || e.defaultValue === "" + n || (e.defaultValue = "" + n);
	}
	function Ht(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + jt(n), t = null, i = 0; i < e.length; i++) {
				if (e[i].value === n) {
					e[i].selected = !0, r && (e[i].defaultSelected = !0);
					return;
				}
				t !== null || e[i].disabled || (t = e[i]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function Ut(e, t, n) {
		if (t != null && (t = "" + jt(t), t !== e.value && (e.value = t), n == null)) {
			e.defaultValue !== t && (e.defaultValue = t);
			return;
		}
		e.defaultValue = n == null ? "" : "" + jt(n);
	}
	function Wt(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(i(92));
				if (P(r)) {
					if (1 < r.length) throw Error(i(93));
					r = r[0];
				}
				n = r;
			}
			n ??= "", t = n;
		}
		n = jt(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), Pt(e);
	}
	function Gt(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var Kt = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function qt(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || Kt.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function Jt(e, t, n) {
		if (t != null && typeof t != "object") throw Error(i(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "");
			for (var a in t) r = t[a], t.hasOwnProperty(a) && n[a] !== r && qt(e, a, r);
		} else for (var o in t) t.hasOwnProperty(o) && qt(e, o, t[o]);
	}
	function Yt(e) {
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
	var Xt = new Map([
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
	]), Zt = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function Qt(e) {
		return Zt.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function $t() {}
	var en = null;
	function tn(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var nn = null, rn = null;
	function an(e) {
		var t = gt(e);
		if (t && (e = t.stateNode)) {
			var n = e[st] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (zt(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + Rt("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var a = r[st] || null;
								if (!a) throw Error(i(90));
								zt(r, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && Ft(r);
					}
					break a;
				case "textarea":
					Ut(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && Ht(e, !!n.multiple, t, !1);
			}
		}
	}
	var on = !1;
	function sn(e, t, n) {
		if (on) return e(t, n);
		on = !0;
		try {
			return e(t);
		} finally {
			if (on = !1, (nn !== null || rn !== null) && (bu(), nn && (t = nn, e = rn, rn = nn = null, an(t), e))) for (t = 0; t < e.length; t++) an(e[t]);
		}
	}
	function cn(e, t) {
		var n = e.stateNode;
		if (n === null) return null;
		var r = n[st] || null;
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
	var ln = !(typeof window > "u" || window.document === void 0 || window.document.createElement === void 0), un = !1;
	if (ln) try {
		var dn = {};
		Object.defineProperty(dn, "passive", { get: function() {
			un = !0;
		} }), window.addEventListener("test", dn, dn), window.removeEventListener("test", dn, dn);
	} catch {
		un = !1;
	}
	var fn = null, pn = null, mn = null;
	function hn() {
		if (mn) return mn;
		var e, t = pn, n = t.length, r, i = "value" in fn ? fn.value : fn.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return mn = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function gn(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function _n() {
		return !0;
	}
	function vn() {
		return !1;
	}
	function yn(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? _n : vn, this.isPropagationStopped = vn, this;
		}
		return h(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = _n);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = _n);
			},
			persist: function() {},
			isPersistent: _n
		}), t;
	}
	var bn = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, xn = yn(bn), Sn = h({}, bn, {
		view: 0,
		detail: 0
	}), Cn = yn(Sn), z, wn, Tn, En = h({}, Sn, {
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
		getModifierState: Ln,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== Tn && (Tn && e.type === "mousemove" ? (z = e.screenX - Tn.screenX, wn = e.screenY - Tn.screenY) : wn = z = 0, Tn = e), z);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : wn;
		}
	}), Dn = yn(En), On = yn(h({}, En, { dataTransfer: 0 })), kn = yn(h({}, Sn, { relatedTarget: 0 })), An = yn(h({}, bn, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), jn = yn(h({}, bn, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), Mn = yn(h({}, bn, { data: 0 })), Nn = {
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
	}, Pn = {
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
	}, Fn = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function In(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = Fn[e]) ? !!t[e] : !1;
	}
	function Ln() {
		return In;
	}
	var Rn = yn(h({}, Sn, {
		key: function(e) {
			if (e.key) {
				var t = Nn[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = gn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Pn[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: Ln,
		charCode: function(e) {
			return e.type === "keypress" ? gn(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? gn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), zn = yn(h({}, En, {
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
	})), Bn = yn(h({}, Sn, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: Ln
	})), Vn = yn(h({}, bn, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Hn = yn(h({}, En, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), Un = yn(h({}, bn, {
		newState: 0,
		oldState: 0
	})), Wn = [
		9,
		13,
		27,
		32
	], Gn = ln && "CompositionEvent" in window, Kn = null;
	ln && "documentMode" in document && (Kn = document.documentMode);
	var qn = ln && "TextEvent" in window && !Kn, Jn = ln && (!Gn || Kn && 8 < Kn && 11 >= Kn), Yn = " ", Xn = !1;
	function Zn(e, t) {
		switch (e) {
			case "keyup": return Wn.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function Qn(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var $n = !1;
	function er(e, t) {
		switch (e) {
			case "compositionend": return Qn(t);
			case "keypress": return t.which === 32 ? (Xn = !0, Yn) : null;
			case "textInput": return e = t.data, e === Yn && Xn ? null : e;
			default: return null;
		}
	}
	function tr(e, t) {
		if ($n) return e === "compositionend" || !Gn && Zn(e, t) ? (e = hn(), mn = pn = fn = null, $n = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return Jn && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var nr = {
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
	function rr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!nr[e.type] : t === "textarea";
	}
	function ir(e, t, n, r) {
		nn ? rn ? rn.push(r) : rn = [r] : nn = r, t = Td(t, "onChange"), 0 < t.length && (n = new xn("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var ar = null, or = null;
	function sr(e) {
		vd(e, 0);
	}
	function cr(e) {
		if (Ft(_t(e))) return e;
	}
	function lr(e, t) {
		if (e === "change") return t;
	}
	var ur = !1;
	if (ln) {
		var dr;
		if (ln) {
			var fr = "oninput" in document;
			if (!fr) {
				var pr = document.createElement("div");
				pr.setAttribute("oninput", "return;"), fr = typeof pr.oninput == "function";
			}
			dr = fr;
		} else dr = !1;
		ur = dr && (!document.documentMode || 9 < document.documentMode);
	}
	function mr() {
		ar && (ar.detachEvent("onpropertychange", hr), or = ar = null);
	}
	function hr(e) {
		if (e.propertyName === "value" && cr(or)) {
			var t = [];
			ir(t, or, e, tn(e)), sn(sr, t);
		}
	}
	function gr(e, t, n) {
		e === "focusin" ? (mr(), ar = t, or = n, ar.attachEvent("onpropertychange", hr)) : e === "focusout" && mr();
	}
	function _r(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return cr(or);
	}
	function vr(e, t) {
		if (e === "click") return cr(t);
	}
	function yr(e, t) {
		if (e === "input" || e === "change") return cr(t);
	}
	function br(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var xr = typeof Object.is == "function" ? Object.is : br;
	function Sr(e, t) {
		if (xr(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!be.call(t, i) || !xr(e[i], t[i])) return !1;
		}
		return !0;
	}
	function Cr(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function wr(e, t) {
		var n = Cr(e);
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
			n = Cr(n);
		}
	}
	function Tr(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Tr(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function Er(e) {
		e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
		for (var t = It(e.document); t instanceof e.HTMLIFrameElement;) {
			try {
				var n = typeof t.contentWindow.location.href == "string";
			} catch {
				n = !1;
			}
			if (n) e = t.contentWindow;
			else break;
			t = It(e.document);
		}
		return t;
	}
	function Dr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var Or = ln && "documentMode" in document && 11 >= document.documentMode, kr = null, Ar = null, jr = null, Mr = !1;
	function Nr(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		Mr || kr == null || kr !== It(r) || (r = kr, "selectionStart" in r && Dr(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), jr && Sr(jr, r) || (jr = r, r = Td(Ar, "onSelect"), 0 < r.length && (t = new xn("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = kr)));
	}
	function Pr(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var Fr = {
		animationend: Pr("Animation", "AnimationEnd"),
		animationiteration: Pr("Animation", "AnimationIteration"),
		animationstart: Pr("Animation", "AnimationStart"),
		transitionrun: Pr("Transition", "TransitionRun"),
		transitionstart: Pr("Transition", "TransitionStart"),
		transitioncancel: Pr("Transition", "TransitionCancel"),
		transitionend: Pr("Transition", "TransitionEnd")
	}, Ir = {}, Lr = {};
	ln && (Lr = document.createElement("div").style, "AnimationEvent" in window || (delete Fr.animationend.animation, delete Fr.animationiteration.animation, delete Fr.animationstart.animation), "TransitionEvent" in window || delete Fr.transitionend.transition);
	function Rr(e) {
		if (Ir[e]) return Ir[e];
		if (!Fr[e]) return e;
		var t = Fr[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in Lr) return Ir[e] = t[n];
		return e;
	}
	var zr = Rr("animationend"), Br = Rr("animationiteration"), Vr = Rr("animationstart"), Hr = Rr("transitionrun"), Ur = Rr("transitionstart"), Wr = Rr("transitioncancel"), Gr = Rr("transitionend"), Kr = /* @__PURE__ */ new Map(), qr = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	qr.push("scrollEnd");
	function Jr(e, t) {
		Kr.set(e, t), St(t, [e]);
	}
	var Yr = typeof reportError == "function" ? reportError : function(e) {
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
	}, Xr = [], Zr = 0, Qr = 0;
	function $r() {
		for (var e = Zr, t = Qr = Zr = 0; t < e;) {
			var n = Xr[t];
			Xr[t++] = null;
			var r = Xr[t];
			Xr[t++] = null;
			var i = Xr[t];
			Xr[t++] = null;
			var a = Xr[t];
			if (Xr[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && ri(n, i, a);
		}
	}
	function ei(e, t, n, r) {
		Xr[Zr++] = e, Xr[Zr++] = t, Xr[Zr++] = n, Xr[Zr++] = r, Qr |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function ti(e, t, n, r) {
		return ei(e, t, n, r), ii(e);
	}
	function ni(e, t) {
		return ei(e, null, null, t), ii(e);
	}
	function ri(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - Le(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function ii(e) {
		if (50 < du) throw du = 0, fu = null, Error(i(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var ai = {};
	function oi(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function si(e, t, n, r) {
		return new oi(e, t, n, r);
	}
	function ci(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function li(e, t) {
		var n = e.alternate;
		return n === null ? (n = si(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 65011712, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function ui(e, t) {
		e.flags &= 65011714;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function di(e, t, n, r, a, o) {
		var s = 0;
		if (r = e, typeof e == "function") ci(e) && (s = 1);
		else if (typeof e == "string") s = Uf(e, n, ae.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (e) {
			case k: return e = si(31, n, t, a), e.elementType = k, e.lanes = o, e;
			case y: return fi(n.children, a, o, t);
			case b:
				s = 8, a |= 24;
				break;
			case x: return e = si(12, n, t, a | 2), e.elementType = x, e.lanes = o, e;
			case T: return e = si(13, n, t, a), e.elementType = T, e.lanes = o, e;
			case E: return e = si(19, n, t, a), e.elementType = E, e.lanes = o, e;
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
		return t = si(s, n, t, a), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function fi(e, t, n, r) {
		return e = si(7, e, r, t), e.lanes = n, e;
	}
	function pi(e, t, n) {
		return e = si(6, e, null, t), e.lanes = n, e;
	}
	function mi(e) {
		var t = si(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function hi(e, t, n) {
		return t = si(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var gi = /* @__PURE__ */ new WeakMap();
	function _i(e, t) {
		if (typeof e == "object" && e) {
			var n = gi.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: ye(t)
			}, gi.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: ye(t)
		};
	}
	var vi = [], yi = 0, bi = null, xi = 0, Si = [], Ci = 0, wi = null, Ti = 1, Ei = "";
	function Di(e, t) {
		vi[yi++] = xi, vi[yi++] = bi, bi = e, xi = t;
	}
	function Oi(e, t, n) {
		Si[Ci++] = Ti, Si[Ci++] = Ei, Si[Ci++] = wi, wi = e;
		var r = Ti;
		e = Ei;
		var i = 32 - Le(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - Le(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, Ti = 1 << 32 - Le(t) + i | n << i | r, Ei = a + e;
		} else Ti = 1 << a | n << i | r, Ei = e;
	}
	function ki(e) {
		e.return !== null && (Di(e, 1), Oi(e, 1, 0));
	}
	function Ai(e) {
		for (; e === bi;) bi = vi[--yi], vi[yi] = null, xi = vi[--yi], vi[yi] = null;
		for (; e === wi;) wi = Si[--Ci], Si[Ci] = null, Ei = Si[--Ci], Si[Ci] = null, Ti = Si[--Ci], Si[Ci] = null;
	}
	function ji(e, t) {
		Si[Ci++] = Ti, Si[Ci++] = Ei, Si[Ci++] = wi, Ti = t.id, Ei = t.overflow, wi = e;
	}
	var Mi = null, Ni = null, B = !1, Pi = null, Fi = !1, Ii = Error(i(519));
	function Li(e) {
		throw Ui(_i(Error(i(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), Ii;
	}
	function Ri(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[ot] = e, t[st] = r, n) {
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
				$("invalid", t), Bt(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				$("invalid", t);
				break;
			case "textarea": $("invalid", t), Wt(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || jd(t.textContent, n) ? (r.popover != null && ($("beforetoggle", t), $("toggle", t)), r.onScroll != null && $("scroll", t), r.onScrollEnd != null && $("scrollend", t), r.onClick != null && (t.onclick = $t), t = !0) : t = !1, t || Li(e, !0);
	}
	function zi(e) {
		for (Mi = e.return; Mi;) switch (Mi.tag) {
			case 5:
			case 31:
			case 13:
				Fi = !1;
				return;
			case 27:
			case 3:
				Fi = !0;
				return;
			default: Mi = Mi.return;
		}
	}
	function Bi(e) {
		if (e !== Mi) return !1;
		if (!B) return zi(e), B = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = !(n !== "form" && n !== "button") || Ud(e.type, e.memoizedProps)), n = !n), n && Ni && Li(e), zi(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			Ni = uf(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			Ni = uf(e);
		} else t === 27 ? (t = Ni, Zd(e.type) ? (e = lf, lf = null, Ni = e) : Ni = t) : Ni = Mi ? cf(e.stateNode.nextSibling) : null;
		return !0;
	}
	function Vi() {
		Ni = Mi = null, B = !1;
	}
	function Hi() {
		var e = Pi;
		return e !== null && (X === null ? X = e : X.push.apply(X, e), Pi = null), e;
	}
	function Ui(e) {
		Pi === null ? Pi = [e] : Pi.push(e);
	}
	var Wi = re(null), Gi = null, Ki = null;
	function qi(e, t, n) {
		R(Wi, t._currentValue), t._currentValue = n;
	}
	function Ji(e) {
		e._currentValue = Wi.current, ie(Wi);
	}
	function Yi(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function Xi(e, t, n, r) {
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
						o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), Yi(o.return, n, e), r || (s = null);
						break a;
					}
					o = c.next;
				}
			} else if (a.tag === 18) {
				if (s = a.return, s === null) throw Error(i(341));
				s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), Yi(s, n, e), s = null;
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
	function Zi(e, t, n, r) {
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
					xr(a.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (a === ce.current) {
				if (s = a.alternate, s === null) throw Error(i(387));
				s.memoizedState.memoizedState !== a.memoizedState.memoizedState && (e === null ? e = [Qf] : e.push(Qf));
			}
			a = a.return;
		}
		e !== null && Xi(t, e, n, r), t.flags |= 262144;
	}
	function Qi(e) {
		for (e = e.firstContext; e !== null;) {
			if (!xr(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function $i(e) {
		Gi = e, Ki = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function ea(e) {
		return na(Gi, e);
	}
	function ta(e, t) {
		return Gi === null && $i(e), na(e, t);
	}
	function na(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, Ki === null) {
			if (e === null) throw Error(i(308));
			Ki = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else Ki = Ki.next = t;
		return n;
	}
	var ra = typeof AbortController < "u" ? AbortController : function() {
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
	}, ia = t.unstable_scheduleCallback, aa = t.unstable_NormalPriority, oa = {
		$$typeof: C,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function sa() {
		return {
			controller: new ra(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function ca(e) {
		e.refCount--, e.refCount === 0 && ia(aa, function() {
			e.controller.abort();
		});
	}
	var la = null, ua = 0, da = 0, fa = null;
	function pa(e, t) {
		if (la === null) {
			var n = la = [];
			ua = 0, da = ud(), fa = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return ua++, t.then(ma, ma), t;
	}
	function ma() {
		if (--ua === 0 && la !== null) {
			fa !== null && (fa.status = "fulfilled");
			var e = la;
			la = null, da = 0, fa = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function ha(e, t) {
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
	var ga = F.S;
	F.S = function(e, t) {
		eu = Te(), typeof t == "object" && t && typeof t.then == "function" && pa(e, t), ga !== null && ga(e, t);
	};
	var _a = re(null);
	function va() {
		var e = _a.current;
		return e === null ? q.pooledCache : e;
	}
	function ya(e, t) {
		t === null ? R(_a, _a.current) : R(_a, t.pool);
	}
	function ba() {
		var e = va();
		return e === null ? null : {
			parent: oa._currentValue,
			pool: e
		};
	}
	var xa = Error(i(460)), Sa = Error(i(474)), Ca = Error(i(542)), wa = { then: function() {} };
	function Ta(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function Ea(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then($t, $t), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, Aa(e), e;
			default:
				if (typeof t.status == "string") t.then($t, $t);
				else {
					if (e = q, e !== null && 100 < e.shellSuspendCounter) throw Error(i(482));
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
					case "rejected": throw e = t.reason, Aa(e), e;
				}
				throw Oa = t, xa;
		}
	}
	function Da(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (Oa = e, xa) : e;
		}
	}
	var Oa = null;
	function ka() {
		if (Oa === null) throw Error(i(459));
		var e = Oa;
		return Oa = null, e;
	}
	function Aa(e) {
		if (e === xa || e === Ca) throw Error(i(483));
	}
	var ja = null, Ma = 0;
	function Na(e) {
		var t = Ma;
		return Ma += 1, ja === null && (ja = []), Ea(ja, e, t);
	}
	function Pa(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function Fa(e, t) {
		throw t.$$typeof === g ? Error(i(525)) : (e = Object.prototype.toString.call(t), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function Ia(e) {
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
			return e = li(e, t), e.index = 0, e.sibling = null, e;
		}
		function o(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 67108866, n) : (r = r.index, r < n ? (t.flags |= 67108866, n) : r)) : (t.flags |= 1048576, n);
		}
		function s(t) {
			return e && t.alternate === null && (t.flags |= 67108866), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = pi(n, e.mode, r), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var i = n.type;
			return i === y ? d(e, t, n.props.children, r, n.key) : t !== null && (t.elementType === i || typeof i == "object" && i && i.$$typeof === O && Da(i) === t.type) ? (t = a(t, n.props), Pa(t, n), t.return = e, t) : (t = di(n.type, n.key, n.props, null, e.mode, r), Pa(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = hi(n, e.mode, r), t.return = e, t) : (t = a(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, i) {
			return t === null || t.tag !== 7 ? (t = fi(n, e.mode, r, i), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = pi("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case _: return n = di(t.type, t.key, t.props, null, e.mode, n), Pa(n, t), n.return = e, n;
					case v: return t = hi(t, e.mode, n), t.return = e, t;
					case O: return t = Da(t), f(e, t, n);
				}
				if (P(t) || ee(t)) return t = fi(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, Na(t), n);
				if (t.$$typeof === C) return f(e, ta(e, t), n);
				Fa(e, t);
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
					case O: return n = Da(n), p(e, t, n, r);
				}
				if (P(n) || ee(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, Na(n), r);
				if (n.$$typeof === C) return p(e, t, ta(e, n), r);
				Fa(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case _: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case v: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case O: return r = Da(r), m(e, t, n, r, i);
				}
				if (P(r) || ee(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, Na(r), i);
				if (r.$$typeof === C) return m(e, t, n, ta(t, r), i);
				Fa(t, r);
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
			if (h === s.length) return n(i, d), B && Di(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return B && Di(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && g.alternate !== null && d.delete(g.key === null ? h : g.key), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), B && Di(i, h), l;
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
			if (v.done) return n(a, h), B && Di(a, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(a, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return B && Di(a, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, a, g, v.value, l), v !== null && (e && v.alternate !== null && h.delete(v.key === null ? g : v.key), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(a, e);
			}), B && Di(a, g), u;
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
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === O && Da(l) === r.type) {
										n(e, r.sibling), c = a(r, o.props), Pa(c, o), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								} else t(e, r);
								r = r.sibling;
							}
							o.type === y ? (c = fi(o.props.children, e.mode, c, o.key), c.return = e, e = c) : (c = di(o.type, o.key, o.props, null, e.mode, c), Pa(c, o), c.return = e, e = c);
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
							c = hi(o, e.mode, c), c.return = e, e = c;
						}
						return s(e);
					case O: return o = Da(o), b(e, r, o, c);
				}
				if (P(o)) return h(e, r, o, c);
				if (ee(o)) {
					if (l = ee(o), typeof l != "function") throw Error(i(150));
					return o = l.call(o), g(e, r, o, c);
				}
				if (typeof o.then == "function") return b(e, r, Na(o), c);
				if (o.$$typeof === C) return b(e, r, ta(e, o), c);
				Fa(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = a(r, o), c.return = e, e = c) : (n(e, r), c = pi(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				Ma = 0;
				var i = b(e, t, n, r);
				return ja = null, i;
			} catch (t) {
				if (t === xa || t === Ca) throw t;
				var a = si(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var La = Ia(!0), Ra = Ia(!1), za = !1;
	function Ba(e) {
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
	function Va(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function Ha(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function Ua(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, K & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = ii(e), ri(e, null, n), t;
		}
		return ei(e, r, t, n), ii(e);
	}
	function Wa(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, $e(e, n);
		}
	}
	function Ga(e, t) {
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
	var Ka = !1;
	function qa() {
		if (Ka) {
			var e = fa;
			if (e !== null) throw e;
		}
	}
	function Ja(e, t, n, r) {
		Ka = !1;
		var i = e.updateQueue;
		za = !1;
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
				if (p ? (Y & f) === f : (r & f) === f) {
					f !== 0 && f === da && (Ka = !0), u !== null && (u = u.next = {
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
							case 2: za = !0;
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
			u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), Kl |= o, e.lanes = o, e.memoizedState = d;
		}
	}
	function Ya(e, t) {
		if (typeof e != "function") throw Error(i(191, e));
		e.call(t);
	}
	function Xa(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) Ya(n[e], t);
	}
	var Za = re(null), Qa = re(0);
	function $a(e, t) {
		e = Wl, R(Qa, e), R(Za, t), Wl = e | t.baseLanes;
	}
	function eo() {
		R(Qa, Wl), R(Za, Za.current);
	}
	function to() {
		Wl = Qa.current, ie(Za), ie(Qa);
	}
	var no = re(null), ro = null;
	function io(e) {
		var t = e.alternate;
		R(lo, lo.current & 1), R(no, e), ro === null && (t === null || Za.current !== null || t.memoizedState !== null) && (ro = e);
	}
	function ao(e) {
		R(lo, lo.current), R(no, e), ro === null && (ro = e);
	}
	function oo(e) {
		e.tag === 22 ? (R(lo, lo.current), R(no, e), ro === null && (ro = e)) : so(e);
	}
	function so() {
		R(lo, lo.current), R(no, no.current);
	}
	function co(e) {
		ie(no), ro === e && (ro = null), ie(lo);
	}
	var lo = re(0);
	function uo(e) {
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
	var fo = 0, V = null, po = null, mo = null, ho = !1, go = !1, _o = !1, vo = 0, yo = 0, bo = null, xo = 0;
	function So() {
		throw Error(i(321));
	}
	function Co(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!xr(e[n], t[n])) return !1;
		return !0;
	}
	function wo(e, t, n, r, i, a) {
		return fo = a, V = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, F.H = e === null || e.memoizedState === null ? zs : Bs, _o = !1, a = n(r, i), _o = !1, go && (a = Eo(t, n, r, i)), To(e), a;
	}
	function To(e) {
		F.H = Rs;
		var t = po !== null && po.next !== null;
		if (fo = 0, mo = po = V = null, ho = !1, yo = 0, bo = null, t) throw Error(i(300));
		e === null || rc || (e = e.dependencies, e !== null && Qi(e) && (rc = !0));
	}
	function Eo(e, t, n, r) {
		V = e;
		var a = 0;
		do {
			if (go && (bo = null), yo = 0, go = !1, 25 <= a) throw Error(i(301));
			if (a += 1, mo = po = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			F.H = Vs, o = t(n, r);
		} while (go);
		return o;
	}
	function Do() {
		var e = F.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? Po(t) : t, e = e.useState()[0], (po === null ? null : po.memoizedState) !== e && (V.flags |= 1024), t;
	}
	function Oo() {
		var e = vo !== 0;
		return vo = 0, e;
	}
	function ko(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function Ao(e) {
		if (ho) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			ho = !1;
		}
		fo = 0, mo = po = V = null, go = !1, yo = vo = 0, bo = null;
	}
	function jo() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return mo === null ? V.memoizedState = mo = e : mo = mo.next = e, mo;
	}
	function Mo() {
		if (po === null) {
			var e = V.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = po.next;
		var t = mo === null ? V.memoizedState : mo.next;
		if (t !== null) mo = t, po = e;
		else {
			if (e === null) throw V.alternate === null ? Error(i(467)) : Error(i(310));
			po = e, e = {
				memoizedState: po.memoizedState,
				baseState: po.baseState,
				baseQueue: po.baseQueue,
				queue: po.queue,
				next: null
			}, mo === null ? V.memoizedState = mo = e : mo = mo.next = e;
		}
		return mo;
	}
	function No() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function Po(e) {
		var t = yo;
		return yo += 1, bo === null && (bo = []), e = Ea(bo, e, t), t = V, (mo === null ? t.memoizedState : mo.next) === null && (t = t.alternate, F.H = t === null || t.memoizedState === null ? zs : Bs), e;
	}
	function Fo(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return Po(e);
			if (e.$$typeof === C) return ea(e);
		}
		throw Error(i(438, String(e)));
	}
	function Io(e) {
		var t = null, n = V.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = V.alternate;
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
		}, n === null && (n = No(), V.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = A;
		return t.index++, n;
	}
	function Lo(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function Ro(e) {
		return zo(Mo(), po, e);
	}
	function zo(e, t, n) {
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
				if (f === u.lane ? (fo & f) === f : (Y & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === da && (d = !0);
					else if ((fo & p) === p) {
						u = u.next, p === da && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, s = o) : l = l.next = f, V.lanes |= p, Kl |= p;
					f = u.action, _o && n(o, f), o = u.hasEagerState ? u.eagerState : n(o, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, s = o) : l = l.next = p, V.lanes |= f, Kl |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? s = o : l.next = c, !xr(o, e.memoizedState) && (rc = !0, d && (n = fa, n !== null))) throw n;
			e.memoizedState = o, e.baseState = s, e.baseQueue = l, r.lastRenderedState = o;
		}
		return a === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function Bo(e) {
		var t = Mo(), n = t.queue;
		if (n === null) throw Error(i(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, a = n.pending, o = t.memoizedState;
		if (a !== null) {
			n.pending = null;
			var s = a = a.next;
			do
				o = e(o, s.action), s = s.next;
			while (s !== a);
			xr(o, t.memoizedState) || (rc = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function Vo(e, t, n) {
		var r = V, a = Mo(), o = B;
		if (o) {
			if (n === void 0) throw Error(i(407));
			n = n();
		} else n = t();
		var s = !xr((po || a).memoizedState, n);
		if (s && (a.memoizedState = n, rc = !0), a = a.queue, us(Wo.bind(null, r, a, e), [e]), a.getSnapshot !== t || s || mo !== null && mo.memoizedState.tag & 1) {
			if (r.flags |= 2048, as(9, { destroy: void 0 }, Uo.bind(null, r, a, n, t), null), q === null) throw Error(i(349));
			o || fo & 127 || Ho(r, t, n);
		}
		return n;
	}
	function Ho(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = V.updateQueue, t === null ? (t = No(), V.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function Uo(e, t, n, r) {
		t.value = n, t.getSnapshot = r, Go(t) && Ko(e);
	}
	function Wo(e, t, n) {
		return n(function() {
			Go(t) && Ko(e);
		});
	}
	function Go(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !xr(e, n);
		} catch {
			return !0;
		}
	}
	function Ko(e) {
		var t = ni(e, 2);
		t !== null && hu(t, e, 2);
	}
	function qo(e) {
		var t = jo();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), _o) {
				Ie(!0);
				try {
					n();
				} finally {
					Ie(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: Lo,
			lastRenderedState: e
		}, t;
	}
	function Jo(e, t, n, r) {
		return e.baseState = n, zo(e, po, typeof r == "function" ? r : Lo);
	}
	function Yo(e, t, n, r, a) {
		if (Fs(e)) throw Error(i(485));
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
			F.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, Xo(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function Xo(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = F.T, o = {};
			F.T = o;
			try {
				var s = n(i, r), c = F.S;
				c !== null && c(o, s), Zo(e, t, s);
			} catch (n) {
				U(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), F.T = a;
			}
		} else try {
			a = n(i, r), Zo(e, t, a);
		} catch (n) {
			U(e, t, n);
		}
	}
	function Zo(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			H(e, t, n);
		}, function(n) {
			return U(e, t, n);
		}) : H(e, t, n);
	}
	function H(e, t, n) {
		t.status = "fulfilled", t.value = n, Qo(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, Xo(e, n)));
	}
	function U(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, Qo(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function Qo(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function $o(e, t) {
		return t;
	}
	function es(e, t) {
		if (B) {
			var n = q.formState;
			if (n !== null) {
				a: {
					var r = V;
					if (B) {
						if (Ni) {
							b: {
								for (var i = Ni, a = Fi; i.nodeType !== 8;) {
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
								Ni = cf(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						Li(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = jo(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: $o,
			lastRenderedState: t
		}, n.queue = r, n = Ms.bind(null, V, r), r.dispatch = n, r = qo(!1), a = Ps.bind(null, V, !1, r.queue), r = jo(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = Yo.bind(null, V, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function ts(e) {
		return ns(Mo(), po, e);
	}
	function ns(e, t, n) {
		if (t = zo(e, t, $o)[0], e = Ro(Lo)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = Po(t);
		} catch (e) {
			throw e === xa ? Ca : e;
		}
		else r = t;
		t = Mo();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (V.flags |= 2048, as(9, { destroy: void 0 }, rs.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function rs(e, t) {
		e.action = t;
	}
	function is(e) {
		var t = Mo(), n = po;
		if (n !== null) return ns(t, n, e);
		Mo(), t = t.memoizedState, n = Mo();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function as(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = V.updateQueue, t === null && (t = No(), V.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function os() {
		return Mo().memoizedState;
	}
	function ss(e, t, n, r) {
		var i = jo();
		V.flags |= e, i.memoizedState = as(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function cs(e, t, n, r) {
		var i = Mo();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		po !== null && r !== null && Co(r, po.memoizedState.deps) ? i.memoizedState = as(t, a, n, r) : (V.flags |= e, i.memoizedState = as(1 | t, a, n, r));
	}
	function ls(e, t) {
		ss(8390656, 8, e, t);
	}
	function us(e, t) {
		cs(2048, 8, e, t);
	}
	function ds(e) {
		V.flags |= 4;
		var t = V.updateQueue;
		if (t === null) t = No(), V.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function fs(e) {
		var t = Mo().memoizedState;
		return ds({
			ref: t,
			nextImpl: e
		}), function() {
			if (K & 2) throw Error(i(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function ps(e, t) {
		return cs(4, 2, e, t);
	}
	function ms(e, t) {
		return cs(4, 4, e, t);
	}
	function hs(e, t) {
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
	function gs(e, t, n) {
		n = n == null ? null : n.concat([e]), cs(4, 4, hs.bind(null, t, e), n);
	}
	function _s() {}
	function vs(e, t) {
		var n = Mo();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && Co(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function ys(e, t) {
		var n = Mo();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && Co(t, r[1])) return r[0];
		if (r = e(), _o) {
			Ie(!0);
			try {
				e();
			} finally {
				Ie(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function bs(e, t, n) {
		return n === void 0 || fo & 1073741824 && !(Y & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = mu(), V.lanes |= e, Kl |= e, n);
	}
	function xs(e, t, n, r) {
		return xr(n, t) ? n : Za.current === null ? !(fo & 42) || fo & 1073741824 && !(Y & 261930) ? (rc = !0, e.memoizedState = n) : (e = mu(), V.lanes |= e, Kl |= e, t) : (e = bs(e, n, r), xr(e, t) || (rc = !0), e);
	}
	function Ss(e, t, n, r, i) {
		var a = I.p;
		I.p = a !== 0 && 8 > a ? a : 8;
		var o = F.T, s = {};
		F.T = s, Ps(e, !1, t, n);
		try {
			var c = i(), l = F.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? Ns(e, t, ha(c, r), pu(e)) : Ns(e, t, r, pu(e));
		} catch (n) {
			Ns(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, pu());
		} finally {
			I.p = a, o !== null && s.types !== null && (o.types = s.types), F.T = o;
		}
	}
	function Cs() {}
	function ws(e, t, n, r) {
		if (e.tag !== 5) throw Error(i(476));
		var a = Ts(e).queue;
		Ss(e, a, t, L, n === null ? Cs : function() {
			return Es(e), n(r);
		});
	}
	function Ts(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: L,
			baseState: L,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: Lo,
				lastRenderedState: L
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
				lastRenderedReducer: Lo,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function Es(e) {
		var t = Ts(e);
		t.next === null && (t = e.alternate.memoizedState), Ns(e, t.next.queue, {}, pu());
	}
	function Ds() {
		return ea(Qf);
	}
	function Os() {
		return Mo().memoizedState;
	}
	function ks() {
		return Mo().memoizedState;
	}
	function As(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = pu();
					e = Ha(n);
					var r = Ua(t, e, n);
					r !== null && (hu(r, t, n), Wa(r, t, n)), t = { cache: sa() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function js(e, t, n) {
		var r = pu();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, Fs(e) ? Is(t, n) : (n = ti(e, t, n, r), n !== null && (hu(n, e, r), Ls(n, t, r)));
	}
	function Ms(e, t, n) {
		Ns(e, t, n, pu());
	}
	function Ns(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (Fs(e)) Is(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, xr(s, o)) return ei(e, t, i, 0), q === null && $r(), !1;
			} catch {}
			if (n = ti(e, t, i, r), n !== null) return hu(n, e, r), Ls(n, t, r), !0;
		}
		return !1;
	}
	function Ps(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: ud(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, Fs(e)) {
			if (t) throw Error(i(479));
		} else t = ti(e, n, r, 2), t !== null && hu(t, e, 2);
	}
	function Fs(e) {
		var t = e.alternate;
		return e === V || t !== null && t === V;
	}
	function Is(e, t) {
		go = ho = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function Ls(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, $e(e, n);
		}
	}
	var Rs = {
		readContext: ea,
		use: Fo,
		useCallback: So,
		useContext: So,
		useEffect: So,
		useImperativeHandle: So,
		useLayoutEffect: So,
		useInsertionEffect: So,
		useMemo: So,
		useReducer: So,
		useRef: So,
		useState: So,
		useDebugValue: So,
		useDeferredValue: So,
		useTransition: So,
		useSyncExternalStore: So,
		useId: So,
		useHostTransitionStatus: So,
		useFormState: So,
		useActionState: So,
		useOptimistic: So,
		useMemoCache: So,
		useCacheRefresh: So
	};
	Rs.useEffectEvent = So;
	var zs = {
		readContext: ea,
		use: Fo,
		useCallback: function(e, t) {
			return jo().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: ea,
		useEffect: ls,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), ss(4194308, 4, hs.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return ss(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			ss(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = jo();
			t = t === void 0 ? null : t;
			var r = e();
			if (_o) {
				Ie(!0);
				try {
					e();
				} finally {
					Ie(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = jo();
			if (n !== void 0) {
				var i = n(t);
				if (_o) {
					Ie(!0);
					try {
						n(t);
					} finally {
						Ie(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = js.bind(null, V, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = jo();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = qo(e);
			var t = e.queue, n = Ms.bind(null, V, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: _s,
		useDeferredValue: function(e, t) {
			return bs(jo(), e, t);
		},
		useTransition: function() {
			var e = qo(!1);
			return e = Ss.bind(null, V, e.queue, !0, !1), jo().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = V, a = jo();
			if (B) {
				if (n === void 0) throw Error(i(407));
				n = n();
			} else {
				if (n = t(), q === null) throw Error(i(349));
				Y & 127 || Ho(r, t, n);
			}
			a.memoizedState = n;
			var o = {
				value: n,
				getSnapshot: t
			};
			return a.queue = o, ls(Wo.bind(null, r, o, e), [e]), r.flags |= 2048, as(9, { destroy: void 0 }, Uo.bind(null, r, o, n, t), null), n;
		},
		useId: function() {
			var e = jo(), t = q.identifierPrefix;
			if (B) {
				var n = Ei, r = Ti;
				n = (r & ~(1 << 32 - Le(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = vo++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = xo++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: Ds,
		useFormState: es,
		useActionState: es,
		useOptimistic: function(e) {
			var t = jo();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = Ps.bind(null, V, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: Io,
		useCacheRefresh: function() {
			return jo().memoizedState = As.bind(null, V);
		},
		useEffectEvent: function(e) {
			var t = jo(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (K & 2) throw Error(i(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, Bs = {
		readContext: ea,
		use: Fo,
		useCallback: vs,
		useContext: ea,
		useEffect: us,
		useImperativeHandle: gs,
		useInsertionEffect: ps,
		useLayoutEffect: ms,
		useMemo: ys,
		useReducer: Ro,
		useRef: os,
		useState: function() {
			return Ro(Lo);
		},
		useDebugValue: _s,
		useDeferredValue: function(e, t) {
			return xs(Mo(), po.memoizedState, e, t);
		},
		useTransition: function() {
			var e = Ro(Lo)[0], t = Mo().memoizedState;
			return [typeof e == "boolean" ? e : Po(e), t];
		},
		useSyncExternalStore: Vo,
		useId: Os,
		useHostTransitionStatus: Ds,
		useFormState: ts,
		useActionState: ts,
		useOptimistic: function(e, t) {
			return Jo(Mo(), po, e, t);
		},
		useMemoCache: Io,
		useCacheRefresh: ks
	};
	Bs.useEffectEvent = fs;
	var Vs = {
		readContext: ea,
		use: Fo,
		useCallback: vs,
		useContext: ea,
		useEffect: us,
		useImperativeHandle: gs,
		useInsertionEffect: ps,
		useLayoutEffect: ms,
		useMemo: ys,
		useReducer: Bo,
		useRef: os,
		useState: function() {
			return Bo(Lo);
		},
		useDebugValue: _s,
		useDeferredValue: function(e, t) {
			var n = Mo();
			return po === null ? bs(n, e, t) : xs(n, po.memoizedState, e, t);
		},
		useTransition: function() {
			var e = Bo(Lo)[0], t = Mo().memoizedState;
			return [typeof e == "boolean" ? e : Po(e), t];
		},
		useSyncExternalStore: Vo,
		useId: Os,
		useHostTransitionStatus: Ds,
		useFormState: is,
		useActionState: is,
		useOptimistic: function(e, t) {
			var n = Mo();
			return po === null ? (n.baseState = e, [e, n.queue.dispatch]) : Jo(n, po, e, t);
		},
		useMemoCache: Io,
		useCacheRefresh: ks
	};
	Vs.useEffectEvent = fs;
	function Hs(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : h({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var Us = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = pu(), i = Ha(r);
			i.payload = t, n != null && (i.callback = n), t = Ua(e, i, r), t !== null && (hu(t, e, r), Wa(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = pu(), i = Ha(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = Ua(e, i, r), t !== null && (hu(t, e, r), Wa(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = pu(), r = Ha(n);
			r.tag = 2, t != null && (r.callback = t), t = Ua(e, r, n), t !== null && (hu(t, e, n), Wa(t, e, n));
		}
	};
	function Ws(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !Sr(n, r) || !Sr(i, a) : !0;
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
		Yr(e);
	}
	function Js(e) {
		console.error(e);
	}
	function Ys(e) {
		Yr(e);
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
		return n = Ha(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			Xs(e, t);
		}, n;
	}
	function $s(e) {
		return e = Ha(e), e.tag = 3, e;
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
			Zs(t, n, r), typeof i != "function" && (ru === null ? ru = new Set([this]) : ru.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function tc(e, t, n, r, a) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && Zi(t, n, a, !0), n = no.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13: return ro === null ? Eu() : n.alternate === null && Gl === 0 && (Gl = 3), n.flags &= -257, n.flags |= 65536, n.lanes = a, r === wa ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = new Set([r]) : t.add(r), Wu(e, r, a)), !1;
					case 22: return n.flags |= 65536, r === wa ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = new Set([r]) : n.add(r)), Wu(e, r, a)), !1;
				}
				throw Error(i(435, n.tag));
			}
			return Wu(e, r, a), Eu(), !1;
		}
		if (B) return t = no.current, t === null ? (r !== Ii && (t = Error(i(423), { cause: r }), Ui(_i(t, n))), e = e.current.alternate, e.flags |= 65536, a &= -a, e.lanes |= a, r = _i(r, n), a = Qs(e.stateNode, r, a), Ga(e, a), Gl !== 4 && (Gl = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = a, r !== Ii && (e = Error(i(422), { cause: r }), Ui(_i(e, n)))), !1;
		var o = Error(i(520), { cause: r });
		if (o = _i(o, n), Zl === null ? Zl = [o] : Zl.push(o), Gl !== 4 && (Gl = 2), t === null) return !0;
		r = _i(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = a & -a, n.lanes |= e, e = Qs(n.stateNode, r, e), Ga(n, e), !1;
				case 1: if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (ru === null || !ru.has(o)))) return n.flags |= 65536, a &= -a, n.lanes |= a, a = $s(a), ec(a, e, n, r), Ga(n, a), !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var nc = Error(i(461)), rc = !1;
	function ic(e, t, n, r) {
		t.child = e === null ? Ra(t, null, n, r) : La(t, e.child, n, r);
	}
	function ac(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return $i(t), r = wo(e, t, n, o, a, i), s = Oo(), e !== null && !rc ? (ko(e, t, i), kc(e, t, i)) : (B && s && ki(t), t.flags |= 1, ic(e, t, r, i), t.child);
	}
	function oc(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !ci(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, sc(e, t, a, r, i)) : (e = di(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !Ac(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? Sr : n, n(o, r) && e.ref === t.ref) return kc(e, t, i);
		}
		return t.flags |= 1, e = li(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function sc(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (Sr(a, r) && e.ref === t.ref) if (rc = !1, t.pendingProps = r = a, Ac(e, i)) e.flags & 131072 && (rc = !0);
			else return t.lanes = e.lanes, kc(e, t, i);
		}
		return hc(e, t, n, r, i);
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
				return uc(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && ya(t, a === null ? null : a.cachePool), a === null ? eo() : $a(t, a), oo(t);
			else return r = t.lanes = 536870912, uc(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && ya(t, null), eo(), so(t)) : (ya(t, a.cachePool), $a(t, a), so(t), t.memoizedState = null);
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
	function uc(e, t, n, r, i) {
		var a = va();
		return a = a === null ? null : {
			parent: oa._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && ya(t, null), eo(), oo(t), e !== null && Zi(e, t, r, !0), t.childLanes = i, null;
	}
	function dc(e, t) {
		return t = wc({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function fc(e, t, n) {
		return La(t, e.child, null, n), e = dc(t, t.pendingProps), e.flags |= 2, co(t), t.memoizedState = null, e;
	}
	function pc(e, t, n) {
		var r = t.pendingProps, a = (t.flags & 128) != 0;
		if (t.flags &= -129, e === null) {
			if (B) {
				if (r.mode === "hidden") return e = dc(t, r), t.lanes = 536870912, lc(null, e);
				if (ao(t), (e = Ni) ? (e = rf(e, Fi), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: wi === null ? null : {
						id: Ti,
						overflow: Ei
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = mi(e), n.return = t, t.child = n, Mi = t, Ni = null)) : e = null, e === null) throw Li(t);
				return t.lanes = 536870912, null;
			}
			return dc(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (ao(t), a) if (t.flags & 256) t.flags &= -257, t = fc(e, t, n);
			else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
			else throw Error(i(558));
			else if (rc || Zi(e, t, n, !1), a = (n & e.childLanes) !== 0, rc || a) {
				if (r = q, r !== null && (s = et(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, ni(e, s), hu(r, e, s), nc;
				Eu(), t = fc(e, t, n);
			} else e = o.treeContext, Ni = cf(s.nextSibling), Mi = t, B = !0, Pi = null, Fi = !1, e !== null && ji(t, e), t = dc(t, r), t.flags |= 4096;
			return t;
		}
		return e = li(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function mc(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(i(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function hc(e, t, n, r, i) {
		return $i(t), n = wo(e, t, n, r, void 0, i), r = Oo(), e !== null && !rc ? (ko(e, t, i), kc(e, t, i)) : (B && r && ki(t), t.flags |= 1, ic(e, t, n, i), t.child);
	}
	function gc(e, t, n, r, i, a) {
		return $i(t), t.updateQueue = null, n = Eo(t, r, n, i), To(e), r = Oo(), e !== null && !rc ? (ko(e, t, a), kc(e, t, a)) : (B && r && ki(t), t.flags |= 1, ic(e, t, n, a), t.child);
	}
	function _c(e, t, n, r, i) {
		if ($i(t), t.stateNode === null) {
			var a = ai, o = n.contextType;
			typeof o == "object" && o && (a = ea(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = Us, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, Ba(t), o = n.contextType, a.context = typeof o == "object" && o ? ea(o) : ai, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (Hs(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && Us.enqueueReplaceState(a, a.state, null), Ja(t, r, a, i), qa(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = Ks(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = ai, typeof u == "object" && u && (o = ea(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && Gs(t, a, r, o), za = !1;
			var f = t.memoizedState;
			a.state = f, Ja(t, r, a, i), qa(), l = t.memoizedState, s || f !== l || za ? (typeof d == "function" && (Hs(t, n, d, r), l = t.memoizedState), (c = za || Ws(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, Va(e, t), o = t.memoizedProps, u = Ks(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = ai, typeof l == "object" && l && (c = ea(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && Gs(t, a, r, c), za = !1, f = t.memoizedState, a.state = f, Ja(t, r, a, i), qa();
			var p = t.memoizedState;
			o !== d || f !== p || za || e !== null && e.dependencies !== null && Qi(e.dependencies) ? (typeof s == "function" && (Hs(t, n, s, r), p = t.memoizedState), (u = za || Ws(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && Qi(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, mc(e, t), r = (t.flags & 128) != 0, a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = La(t, e.child, null, i), t.child = La(t, null, n, i)) : ic(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = kc(e, t, i), e;
	}
	function vc(e, t, n, r) {
		return Vi(), t.flags |= 256, ic(e, t, n, r), t.child;
	}
	var yc = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function bc(e) {
		return {
			baseLanes: e,
			cachePool: ba()
		};
	}
	function xc(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= Yl), e;
	}
	function Sc(e, t, n) {
		var r = t.pendingProps, a = !1, o = (t.flags & 128) != 0, s;
		if ((s = o) || (s = e !== null && e.memoizedState === null ? !1 : (lo.current & 2) != 0), s && (a = !0, t.flags &= -129), s = (t.flags & 32) != 0, t.flags &= -33, e === null) {
			if (B) {
				if (a ? io(t) : so(t), (e = Ni) ? (e = rf(e, Fi), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: wi === null ? null : {
						id: Ti,
						overflow: Ei
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = mi(e), n.return = t, t.child = n, Mi = t, Ni = null)) : e = null, e === null) throw Li(t);
				return of(e) ? t.lanes = 32 : t.lanes = 536870912, null;
			}
			var c = r.children;
			return r = r.fallback, a ? (so(t), a = t.mode, c = wc({
				mode: "hidden",
				children: c
			}, a), r = fi(r, a, n, null), c.return = t, r.return = t, c.sibling = r, t.child = c, r = t.child, r.memoizedState = bc(n), r.childLanes = xc(e, s, n), t.memoizedState = yc, lc(null, r)) : (io(t), Cc(t, c));
		}
		var l = e.memoizedState;
		if (l !== null && (c = l.dehydrated, c !== null)) {
			if (o) t.flags & 256 ? (io(t), t.flags &= -257, t = Tc(e, t, n)) : t.memoizedState === null ? (so(t), c = r.fallback, a = t.mode, r = wc({
				mode: "visible",
				children: r.children
			}, a), c = fi(c, a, n, null), c.flags |= 2, r.return = t, c.return = t, r.sibling = c, t.child = r, La(t, e.child, null, n), r = t.child, r.memoizedState = bc(n), r.childLanes = xc(e, s, n), t.memoizedState = yc, t = lc(null, r)) : (so(t), t.child = e.child, t.flags |= 128, t = null);
			else if (io(t), of(c)) {
				if (s = c.nextSibling && c.nextSibling.dataset, s) var u = s.dgst;
				s = u, r = Error(i(419)), r.stack = "", r.digest = s, Ui({
					value: r,
					source: null,
					stack: null
				}), t = Tc(e, t, n);
			} else if (rc || Zi(e, t, n, !1), s = (n & e.childLanes) !== 0, rc || s) {
				if (s = q, s !== null && (r = et(s, n), r !== 0 && r !== l.retryLane)) throw l.retryLane = r, ni(e, r), hu(s, e, r), nc;
				af(c) || Eu(), t = Tc(e, t, n);
			} else af(c) ? (t.flags |= 192, t.child = e.child, t = null) : (e = l.treeContext, Ni = cf(c.nextSibling), Mi = t, B = !0, Pi = null, Fi = !1, e !== null && ji(t, e), t = Cc(t, r.children), t.flags |= 4096);
			return t;
		}
		return a ? (so(t), c = r.fallback, a = t.mode, l = e.child, u = l.sibling, r = li(l, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = l.subtreeFlags & 65011712, u === null ? (c = fi(c, a, n, null), c.flags |= 2) : c = li(u, c), c.return = t, r.return = t, r.sibling = c, t.child = r, lc(null, r), r = t.child, c = e.child.memoizedState, c === null ? c = bc(n) : (a = c.cachePool, a === null ? a = ba() : (l = oa._currentValue, a = a.parent === l ? a : {
			parent: l,
			pool: l
		}), c = {
			baseLanes: c.baseLanes | n,
			cachePool: a
		}), r.memoizedState = c, r.childLanes = xc(e, s, n), t.memoizedState = yc, lc(e.child, r)) : (io(t), n = e.child, e = n.sibling, n = li(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (s = t.deletions, s === null ? (t.deletions = [e], t.flags |= 16) : s.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function Cc(e, t) {
		return t = wc({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function wc(e, t) {
		return e = si(22, e, null, t), e.lanes = 0, e;
	}
	function Tc(e, t, n) {
		return La(t, e.child, null, n), e = Cc(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function Ec(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), Yi(e.return, t, n);
	}
	function Dc(e, t, n, r, i, a) {
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
	function Oc(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = lo.current, s = (o & 2) != 0;
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, R(lo, o), ic(e, t, r, n), r = B ? xi : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && Ec(e, n, t);
			else if (e.tag === 19) Ec(e, n, t);
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
				for (n = t.child, i = null; n !== null;) e = n.alternate, e !== null && uo(e) === null && (i = n), n = n.sibling;
				n = i, n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), Dc(t, !1, i, n, a, r);
				break;
			case "backwards":
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && uo(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				Dc(t, !0, n, null, a, r);
				break;
			case "together":
				Dc(t, !1, null, null, void 0, r);
				break;
			default: t.memoizedState = null;
		}
		return t.child;
	}
	function kc(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), Kl |= t.lanes, (n & t.childLanes) === 0) if (e !== null) {
			if (Zi(e, t, n, !1), (n & t.childLanes) === 0) return null;
		} else return null;
		if (e !== null && t.child !== e.child) throw Error(i(153));
		if (t.child !== null) {
			for (e = t.child, n = li(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = li(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function Ac(e, t) {
		return (e.lanes & t) === 0 ? (e = e.dependencies, !!(e !== null && Qi(e))) : !0;
	}
	function jc(e, t, n) {
		switch (t.tag) {
			case 3:
				le(t, t.stateNode.containerInfo), qi(t, oa, e.memoizedState.cache), Vi();
				break;
			case 27:
			case 5:
				de(t);
				break;
			case 4:
				le(t, t.stateNode.containerInfo);
				break;
			case 10:
				qi(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, ao(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) return r.dehydrated === null ? (n & t.child.childLanes) === 0 ? (io(t), e = kc(e, t, n), e === null ? null : e.sibling) : Sc(e, t, n) : (io(t), t.flags |= 128, null);
				io(t);
				break;
			case 19:
				var i = (e.flags & 128) != 0;
				if (r = (n & t.childLanes) !== 0, r ||= (Zi(e, t, n, !1), (n & t.childLanes) !== 0), i) {
					if (r) return Oc(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), R(lo, lo.current), r) break;
				return null;
			case 22: return t.lanes = 0, cc(e, t, n, t.pendingProps);
			case 24: qi(t, oa, e.memoizedState.cache);
		}
		return kc(e, t, n);
	}
	function Mc(e, t, n) {
		if (e !== null) if (e.memoizedProps !== t.pendingProps) rc = !0;
		else {
			if (!Ac(e, n) && !(t.flags & 128)) return rc = !1, jc(e, t, n);
			rc = !!(e.flags & 131072);
		}
		else rc = !1, B && t.flags & 1048576 && Oi(t, xi, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = Da(t.elementType), t.type = e, typeof e == "function") ci(e) ? (r = Ks(e, r), t.tag = 1, t = _c(null, t, e, r, n)) : (t.tag = 0, t = hc(null, t, e, r, n));
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
						throw t = N(e) || e, Error(i(306, t, ""));
					}
				}
				return t;
			case 0: return hc(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, a = Ks(r, t.pendingProps), _c(e, t, r, a, n);
			case 3:
				a: {
					if (le(t, t.stateNode.containerInfo), e === null) throw Error(i(387));
					r = t.pendingProps;
					var o = t.memoizedState;
					a = o.element, Va(e, t), Ja(t, r, null, n);
					var s = t.memoizedState;
					if (r = s.cache, qi(t, oa, r), r !== o.cache && Xi(t, [oa], n, !0), qa(), r = s.element, o.isDehydrated) if (o = {
						element: r,
						isDehydrated: !1,
						cache: s.cache
					}, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
						t = vc(e, t, r, n);
						break a;
					} else if (r !== a) {
						a = _i(Error(i(424)), t), Ui(a), t = vc(e, t, r, n);
						break a;
					} else {
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (Ni = cf(e.firstChild), Mi = t, B = !0, Pi = null, Fi = !0, n = Ra(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 4096, n = n.sibling;
					}
					else {
						if (Vi(), r === a) {
							t = kc(e, t, n);
							break a;
						}
						ic(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return mc(e, t), e === null ? (n = kf(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : B || (n = t.type, e = t.pendingProps, r = Bd(se.current).createElement(n), r[ot] = t, r[st] = e, Pd(r, n, e), yt(r), t.stateNode = r) : t.memoizedState = kf(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return de(t), e === null && B && (r = t.stateNode = ff(t.type, t.pendingProps, se.current), Mi = t, Fi = !0, a = Ni, Zd(t.type) ? (lf = a, Ni = cf(r.firstChild)) : Ni = a), ic(e, t, t.pendingProps.children, n), mc(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && B && ((a = r = Ni) && (r = tf(r, t.type, t.pendingProps, Fi), r === null ? a = !1 : (t.stateNode = r, Mi = t, Ni = cf(r.firstChild), Fi = !1, a = !0)), a || Li(t)), de(t), a = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, Ud(a, o) ? r = null : s !== null && Ud(a, s) && (t.flags |= 32), t.memoizedState !== null && (a = wo(e, t, Do, null, null, n), Qf._currentValue = a), mc(e, t), ic(e, t, r, n), t.child;
			case 6: return e === null && B && ((e = n = Ni) && (n = nf(n, t.pendingProps, Fi), n === null ? e = !1 : (t.stateNode = n, Mi = t, Ni = null, e = !0)), e || Li(t)), null;
			case 13: return Sc(e, t, n);
			case 4: return le(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = La(t, null, r, n) : ic(e, t, r, n), t.child;
			case 11: return ac(e, t, t.type, t.pendingProps, n);
			case 7: return ic(e, t, t.pendingProps, n), t.child;
			case 8: return ic(e, t, t.pendingProps.children, n), t.child;
			case 12: return ic(e, t, t.pendingProps.children, n), t.child;
			case 10: return r = t.pendingProps, qi(t, t.type, r.value), ic(e, t, r.children, n), t.child;
			case 9: return a = t.type._context, r = t.pendingProps.children, $i(t), a = ea(a), r = r(a), t.flags |= 1, ic(e, t, r, n), t.child;
			case 14: return oc(e, t, t.type, t.pendingProps, n);
			case 15: return sc(e, t, t.type, t.pendingProps, n);
			case 19: return Oc(e, t, n);
			case 31: return pc(e, t, n);
			case 22: return cc(e, t, n, t.pendingProps);
			case 24: return $i(t), r = ea(oa), e === null ? (a = va(), a === null && (a = q, o = sa(), a.pooledCache = o, o.refCount++, o !== null && (a.pooledCacheLanes |= n), a = o), t.memoizedState = {
				parent: r,
				cache: a
			}, Ba(t), qi(t, oa, a)) : ((e.lanes & n) !== 0 && (Va(e, t), Ja(t, null, null, n), qa()), a = e.memoizedState, o = t.memoizedState, a.parent === r ? (r = o.cache, qi(t, oa, r), r !== a.cache && Xi(t, [oa], n, !0)) : (a = {
				parent: r,
				cache: r
			}, t.memoizedState = a, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = a), qi(t, oa, r))), ic(e, t, t.pendingProps.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(i(156, t.tag));
	}
	function Nc(e) {
		e.flags |= 4;
	}
	function Pc(e, t, n, r, i) {
		if ((t = (e.mode & 32) != 0) && (t = !1), t) {
			if (e.flags |= 16777216, (i & 335544128) === i) if (e.stateNode.complete) e.flags |= 8192;
			else if (Cu()) e.flags |= 8192;
			else throw Oa = wa, Sa;
		} else e.flags &= -16777217;
	}
	function Fc(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !Wf(t)) if (Cu()) e.flags |= 8192;
		else throw Oa = wa, Sa;
	}
	function Ic(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : Je(), e.lanes |= t, Xl |= t);
	}
	function Lc(e, t) {
		if (!B) switch (e.tailMode) {
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
	function W(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 65011712, r |= i.flags & 65011712, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function Rc(e, t, n) {
		var r = t.pendingProps;
		switch (Ai(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return W(t), null;
			case 1: return W(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), Ji(oa), ue(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (Bi(t) ? Nc(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, Hi())), W(t), null;
			case 26:
				var a = t.type, o = t.memoizedState;
				return e === null ? (Nc(t), o === null ? (W(t), Pc(t, a, null, r, n)) : (W(t), Fc(t, o))) : o ? o === e.memoizedState ? (W(t), t.flags &= -16777217) : (Nc(t), W(t), Fc(t, o)) : (e = e.memoizedProps, e !== r && Nc(t), W(t), Pc(t, a, e, r, n)), null;
			case 27:
				if (fe(t), n = se.current, a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && Nc(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return W(t), null;
					}
					e = ae.current, Bi(t) ? Ri(t, e) : (e = ff(a, r, n), t.stateNode = e, Nc(t));
				}
				return W(t), null;
			case 5:
				if (fe(t), a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && Nc(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return W(t), null;
					}
					if (o = ae.current, Bi(t)) Ri(t, o);
					else {
						var s = Bd(se.current);
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
						o[ot] = t, o[st] = r;
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
						r && Nc(t);
					}
				}
				return W(t), Pc(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && Nc(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(i(166));
					if (e = se.current, Bi(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, a = Mi, a !== null) switch (a.tag) {
							case 27:
							case 5: r = a.memoizedProps;
						}
						e[ot] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || jd(e.nodeValue, n)), e || Li(t, !0);
					} else e = Bd(e).createTextNode(r), e[ot] = t, t.stateNode = e;
				}
				return W(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = Bi(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(i(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(557));
							e[ot] = t;
						} else Vi(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						W(t), e = !1;
					} else n = Hi(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (co(t), t) : (co(t), null);
					if (t.flags & 128) throw Error(i(558));
				}
				return W(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (a = Bi(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!a) throw Error(i(318));
							if (a = t.memoizedState, a = a === null ? null : a.dehydrated, !a) throw Error(i(317));
							a[ot] = t;
						} else Vi(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						W(t), a = !1;
					} else a = Hi(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), a = !0;
					if (!a) return t.flags & 256 ? (co(t), t) : (co(t), null);
				}
				return co(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, a = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (a = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== a && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), Ic(t, t.updateQueue), W(t), null);
			case 4: return ue(), e === null && xd(t.stateNode.containerInfo), W(t), null;
			case 10: return Ji(t.type), W(t), null;
			case 19:
				if (ie(lo), r = t.memoizedState, r === null) return W(t), null;
				if (a = (t.flags & 128) != 0, o = r.rendering, o === null) if (a) Lc(r, !1);
				else {
					if (Gl !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
						if (o = uo(e), o !== null) {
							for (t.flags |= 128, Lc(r, !1), e = o.updateQueue, t.updateQueue = e, Ic(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) ui(n, e), n = n.sibling;
							return R(lo, lo.current & 1 | 2), B && Di(t, r.treeForkCount), t.child;
						}
						e = e.sibling;
					}
					r.tail !== null && Te() > tu && (t.flags |= 128, a = !0, Lc(r, !1), t.lanes = 4194304);
				}
				else {
					if (!a) if (e = uo(o), e !== null) {
						if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, Ic(t, e), Lc(r, !0), r.tail === null && r.tailMode === "hidden" && !o.alternate && !B) return W(t), null;
					} else 2 * Te() - r.renderingStartTime > tu && n !== 536870912 && (t.flags |= 128, a = !0, Lc(r, !1), t.lanes = 4194304);
					r.isBackwards ? (o.sibling = t.child, t.child = o) : (e = r.last, e === null ? t.child = o : e.sibling = o, r.last = o);
				}
				return r.tail === null ? (W(t), null) : (e = r.tail, r.rendering = e, r.tail = e.sibling, r.renderingStartTime = Te(), e.sibling = null, n = lo.current, R(lo, a ? n & 1 | 2 : n & 1), B && Di(t, r.treeForkCount), e);
			case 22:
			case 23: return co(t), to(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (W(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : W(t), n = t.updateQueue, n !== null && Ic(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && ie(_a), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), Ji(oa), W(t), null;
			case 25: return null;
			case 30: return null;
		}
		throw Error(i(156, t.tag));
	}
	function zc(e, t) {
		switch (Ai(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return Ji(oa), ue(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return fe(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (co(t), t.alternate === null) throw Error(i(340));
					Vi();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (co(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(i(340));
					Vi();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return ie(lo), null;
			case 4: return ue(), null;
			case 10: return Ji(t.type), null;
			case 22:
			case 23: return co(t), to(), e !== null && ie(_a), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return Ji(oa), null;
			case 25: return null;
			default: return null;
		}
	}
	function Bc(e, t) {
		switch (Ai(t), t.tag) {
			case 3:
				Ji(oa), ue();
				break;
			case 26:
			case 27:
			case 5:
				fe(t);
				break;
			case 4:
				ue();
				break;
			case 31:
				t.memoizedState !== null && co(t);
				break;
			case 13:
				co(t);
				break;
			case 19:
				ie(lo);
				break;
			case 10:
				Ji(t.type);
				break;
			case 22:
			case 23:
				co(t), to(), e !== null && ie(_a);
				break;
			case 24: Ji(oa);
		}
	}
	function Vc(e, t) {
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
	function Hc(e, t, n) {
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
	function Uc(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var n = e.stateNode;
			try {
				Xa(t, n);
			} catch (t) {
				Uu(e, e.return, t);
			}
		}
	}
	function Wc(e, t, n) {
		n.props = Ks(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			Uu(e, t, n);
		}
	}
	function Gc(e, t) {
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
	function Kc(e, t) {
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
	function qc(e) {
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
	function Jc(e, t, n) {
		try {
			var r = e.stateNode;
			Fd(r, e.type, n, t), r[st] = t;
		} catch (t) {
			Uu(e, e.return, t);
		}
	}
	function Yc(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Zd(e.type) || e.tag === 4;
	}
	function Xc(e) {
		a: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || Yc(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && Zd(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function Zc(e, t, n) {
		var r = e.tag;
		if (r === 5 || r === 6) e = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(e, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(e), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = $t));
		else if (r !== 4 && (r === 27 && Zd(e.type) && (n = e.stateNode, t = null), e = e.child, e !== null)) for (Zc(e, t, n), e = e.sibling; e !== null;) Zc(e, t, n), e = e.sibling;
	}
	function Qc(e, t, n) {
		var r = e.tag;
		if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
		else if (r !== 4 && (r === 27 && Zd(e.type) && (n = e.stateNode), e = e.child, e !== null)) for (Qc(e, t, n), e = e.sibling; e !== null;) Qc(e, t, n), e = e.sibling;
	}
	function $c(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			Pd(t, r, n), t[ot] = e, t[st] = n;
		} catch (t) {
			Uu(e, e.return, t);
		}
	}
	var el = !1, tl = !1, nl = !1, rl = typeof WeakSet == "function" ? WeakSet : Set, il = null;
	function al(e, t) {
		if (e = e.containerInfo, Rd = sp, e = Er(e), Dr(e)) {
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
		}, sp = !1, il = t; il !== null;) if (t = il, e = t.child, t.subtreeFlags & 1028 && e !== null) e.return = t, il = e;
		else for (; il !== null;) {
			switch (t = il, o = t.alternate, e = t.flags, t.tag) {
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
				e.return = t.return, il = e;
				break;
			}
			il = t.return;
		}
	}
	function ol(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				bl(e, n), r & 4 && Vc(5, n);
				break;
			case 1:
				if (bl(e, n), r & 4) if (e = n.stateNode, t === null) try {
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
				r & 64 && Uc(n), r & 512 && Gc(n, n.return);
				break;
			case 3:
				if (bl(e, n), r & 64 && (e = n.updateQueue, e !== null)) {
					if (t = null, n.child !== null) switch (n.child.tag) {
						case 27:
						case 5:
							t = n.child.stateNode;
							break;
						case 1: t = n.child.stateNode;
					}
					try {
						Xa(e, t);
					} catch (e) {
						Uu(n, n.return, e);
					}
				}
				break;
			case 27: t === null && r & 4 && $c(n);
			case 26:
			case 5:
				bl(e, n), t === null && r & 4 && qc(n), r & 512 && Gc(n, n.return);
				break;
			case 12:
				bl(e, n);
				break;
			case 31:
				bl(e, n), r & 4 && fl(e, n);
				break;
			case 13:
				bl(e, n), r & 4 && pl(e, n), r & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = qu.bind(null, n), sf(e, n))));
				break;
			case 22:
				if (r = n.memoizedState !== null || el, !r) {
					t = t !== null && t.memoizedState !== null || tl, i = el;
					var a = tl;
					el = r, (tl = t) && !a ? Sl(e, n, (n.subtreeFlags & 8772) != 0) : bl(e, n), el = i, tl = a;
				}
				break;
			case 30: break;
			default: bl(e, n);
		}
	}
	function sl(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, sl(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && mt(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var cl = null, ll = !1;
	function ul(e, t, n) {
		for (n = n.child; n !== null;) dl(e, t, n), n = n.sibling;
	}
	function dl(e, t, n) {
		if (Fe && typeof Fe.onCommitFiberUnmount == "function") try {
			Fe.onCommitFiberUnmount(Pe, n);
		} catch {}
		switch (n.tag) {
			case 26:
				tl || Kc(n, t), ul(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				tl || Kc(n, t);
				var r = cl, i = ll;
				Zd(n.type) && (cl = n.stateNode, ll = !1), ul(e, t, n), pf(n.stateNode), cl = r, ll = i;
				break;
			case 5: tl || Kc(n, t);
			case 6:
				if (r = cl, i = ll, cl = null, ul(e, t, n), cl = r, ll = i, cl !== null) if (ll) try {
					(cl.nodeType === 9 ? cl.body : cl.nodeName === "HTML" ? cl.ownerDocument.body : cl).removeChild(n.stateNode);
				} catch (e) {
					Uu(n, t, e);
				}
				else try {
					cl.removeChild(n.stateNode);
				} catch (e) {
					Uu(n, t, e);
				}
				break;
			case 18:
				cl !== null && (ll ? (e = cl, Qd(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Np(e)) : Qd(cl, n.stateNode));
				break;
			case 4:
				r = cl, i = ll, cl = n.stateNode.containerInfo, ll = !0, ul(e, t, n), cl = r, ll = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				Hc(2, n, t), tl || Hc(4, n, t), ul(e, t, n);
				break;
			case 1:
				tl || (Kc(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && Wc(n, t, r)), ul(e, t, n);
				break;
			case 21:
				ul(e, t, n);
				break;
			case 22:
				tl = (r = tl) || n.memoizedState !== null, ul(e, t, n), tl = r;
				break;
			default: ul(e, t, n);
		}
	}
	function fl(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
			e = e.dehydrated;
			try {
				Np(e);
			} catch (e) {
				Uu(t, t.return, e);
			}
		}
	}
	function pl(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
			Np(e);
		} catch (e) {
			Uu(t, t.return, e);
		}
	}
	function ml(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new rl()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new rl()), t;
			default: throw Error(i(435, e.tag));
		}
	}
	function hl(e, t) {
		var n = ml(e);
		t.forEach(function(t) {
			if (!n.has(t)) {
				n.add(t);
				var r = Ju.bind(null, e, t);
				t.then(r, r);
			}
		});
	}
	function gl(e, t) {
		var n = t.deletions;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var a = n[r], o = e, s = t, c = s;
			a: for (; c !== null;) {
				switch (c.tag) {
					case 27:
						if (Zd(c.type)) {
							cl = c.stateNode, ll = !1;
							break a;
						}
						break;
					case 5:
						cl = c.stateNode, ll = !1;
						break a;
					case 3:
					case 4:
						cl = c.stateNode.containerInfo, ll = !0;
						break a;
				}
				c = c.return;
			}
			if (cl === null) throw Error(i(160));
			dl(o, s, a), cl = null, ll = !1, o = a.alternate, o !== null && (o.return = null), a.return = null;
		}
		if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) _l(t, e), t = t.sibling;
	}
	var G = null;
	function _l(e, t) {
		var n = e.alternate, r = e.flags;
		switch (e.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				gl(t, e), vl(e), r & 4 && (Hc(3, e, e.return), Vc(3, e), Hc(5, e, e.return));
				break;
			case 1:
				gl(t, e), vl(e), r & 512 && (tl || n === null || Kc(n, n.return)), r & 64 && el && (e = e.updateQueue, e !== null && (r = e.callbacks, r !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? r : n.concat(r))));
				break;
			case 26:
				var a = G;
				if (gl(t, e), vl(e), r & 512 && (tl || n === null || Kc(n, n.return)), r & 4) {
					var o = n === null ? null : n.memoizedState;
					if (r = e.memoizedState, n === null) if (r === null) if (e.stateNode === null) {
						a: {
							r = e.type, n = e.memoizedProps, a = a.ownerDocument || a;
							b: switch (r) {
								case "title":
									o = a.getElementsByTagName("title")[0], (!o || o[pt] || o[ot] || o.namespaceURI === "http://www.w3.org/2000/svg" || o.hasAttribute("itemprop")) && (o = a.createElement(r), a.head.insertBefore(o, a.querySelector("head > title"))), Pd(o, r, n), o[ot] = e, yt(o), r = o;
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
							o[ot] = e, yt(o), r = o;
						}
						e.stateNode = r;
					} else Hf(a, e.type, e.stateNode);
					else e.stateNode = If(a, r, e.memoizedProps);
					else o === r ? r === null && e.stateNode !== null && Jc(e, e.memoizedProps, n.memoizedProps) : (o === null ? n.stateNode !== null && (n = n.stateNode, n.parentNode.removeChild(n)) : o.count--, r === null ? Hf(a, e.type, e.stateNode) : If(a, r, e.memoizedProps));
				}
				break;
			case 27:
				gl(t, e), vl(e), r & 512 && (tl || n === null || Kc(n, n.return)), n !== null && r & 4 && Jc(e, e.memoizedProps, n.memoizedProps);
				break;
			case 5:
				if (gl(t, e), vl(e), r & 512 && (tl || n === null || Kc(n, n.return)), e.flags & 32) {
					a = e.stateNode;
					try {
						Gt(a, "");
					} catch (t) {
						Uu(e, e.return, t);
					}
				}
				r & 4 && e.stateNode != null && (a = e.memoizedProps, Jc(e, a, n === null ? a : n.memoizedProps)), r & 1024 && (nl = !0);
				break;
			case 6:
				if (gl(t, e), vl(e), r & 4) {
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
				if (Bf = null, a = G, G = gf(t.containerInfo), gl(t, e), G = a, vl(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
					Np(t.containerInfo);
				} catch (t) {
					Uu(e, e.return, t);
				}
				nl && (nl = !1, yl(e));
				break;
			case 4:
				r = G, G = gf(e.stateNode.containerInfo), gl(t, e), vl(e), G = r;
				break;
			case 12:
				gl(t, e), vl(e);
				break;
			case 31:
				gl(t, e), vl(e), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, hl(e, r)));
				break;
			case 13:
				gl(t, e), vl(e), e.child.flags & 8192 && e.memoizedState !== null != (n !== null && n.memoizedState !== null) && ($l = Te()), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, hl(e, r)));
				break;
			case 22:
				a = e.memoizedState !== null;
				var l = n !== null && n.memoizedState !== null, u = el, d = tl;
				if (el = u || a, tl = d || l, gl(t, e), tl = d, el = u, vl(e), r & 8192) a: for (t = e.stateNode, t._visibility = a ? t._visibility & -2 : t._visibility | 1, a && (n === null || l || el || tl || xl(e)), n = null, t = e;;) {
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
				r & 4 && (r = e.updateQueue, r !== null && (n = r.retryQueue, n !== null && (r.retryQueue = null, hl(e, n))));
				break;
			case 19:
				gl(t, e), vl(e), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, hl(e, r)));
				break;
			case 30: break;
			case 21: break;
			default: gl(t, e), vl(e);
		}
	}
	function vl(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var n, r = e.return; r !== null;) {
					if (Yc(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				if (n == null) throw Error(i(160));
				switch (n.tag) {
					case 27:
						var a = n.stateNode;
						Qc(e, Xc(e), a);
						break;
					case 5:
						var o = n.stateNode;
						n.flags & 32 && (Gt(o, ""), n.flags &= -33), Qc(e, Xc(e), o);
						break;
					case 3:
					case 4:
						var s = n.stateNode.containerInfo;
						Zc(e, Xc(e), s);
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
	function yl(e) {
		if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
			var t = e;
			yl(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
		}
	}
	function bl(e, t) {
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) ol(e, t.alternate, t), t = t.sibling;
	}
	function xl(e) {
		for (e = e.child; e !== null;) {
			var t = e;
			switch (t.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					Hc(4, t, t.return), xl(t);
					break;
				case 1:
					Kc(t, t.return);
					var n = t.stateNode;
					typeof n.componentWillUnmount == "function" && Wc(t, t.return, n), xl(t);
					break;
				case 27: pf(t.stateNode);
				case 26:
				case 5:
					Kc(t, t.return), xl(t);
					break;
				case 22:
					t.memoizedState === null && xl(t);
					break;
				case 30:
					xl(t);
					break;
				default: xl(t);
			}
			e = e.sibling;
		}
	}
	function Sl(e, t, n) {
		for (n &&= (t.subtreeFlags & 8772) != 0, t = t.child; t !== null;) {
			var r = t.alternate, i = e, a = t, o = a.flags;
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					Sl(i, a, n), Vc(4, a);
					break;
				case 1:
					if (Sl(i, a, n), r = a, i = r.stateNode, typeof i.componentDidMount == "function") try {
						i.componentDidMount();
					} catch (e) {
						Uu(r, r.return, e);
					}
					if (r = a, i = r.updateQueue, i !== null) {
						var s = r.stateNode;
						try {
							var c = i.shared.hiddenCallbacks;
							if (c !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < c.length; i++) Ya(c[i], s);
						} catch (e) {
							Uu(r, r.return, e);
						}
					}
					n && o & 64 && Uc(a), Gc(a, a.return);
					break;
				case 27: $c(a);
				case 26:
				case 5:
					Sl(i, a, n), n && r === null && o & 4 && qc(a), Gc(a, a.return);
					break;
				case 12:
					Sl(i, a, n);
					break;
				case 31:
					Sl(i, a, n), n && o & 4 && fl(i, a);
					break;
				case 13:
					Sl(i, a, n), n && o & 4 && pl(i, a);
					break;
				case 22:
					a.memoizedState === null && Sl(i, a, n), Gc(a, a.return);
					break;
				case 30: break;
				default: Sl(i, a, n);
			}
			t = t.sibling;
		}
	}
	function Cl(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && ca(n));
	}
	function wl(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && ca(e));
	}
	function Tl(e, t, n, r) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) El(e, t, n, r), t = t.sibling;
	}
	function El(e, t, n, r) {
		var i = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				Tl(e, t, n, r), i & 2048 && Vc(9, t);
				break;
			case 1:
				Tl(e, t, n, r);
				break;
			case 3:
				Tl(e, t, n, r), i & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && ca(e)));
				break;
			case 12:
				if (i & 2048) {
					Tl(e, t, n, r), e = t.stateNode;
					try {
						var a = t.memoizedProps, o = a.id, s = a.onPostCommit;
						typeof s == "function" && s(o, t.alternate === null ? "mount" : "update", e.passiveEffectDuration, -0);
					} catch (e) {
						Uu(t, t.return, e);
					}
				} else Tl(e, t, n, r);
				break;
			case 31:
				Tl(e, t, n, r);
				break;
			case 13:
				Tl(e, t, n, r);
				break;
			case 23: break;
			case 22:
				a = t.stateNode, o = t.alternate, t.memoizedState === null ? a._visibility & 2 ? Tl(e, t, n, r) : (a._visibility |= 2, Dl(e, t, n, r, (t.subtreeFlags & 10256) != 0 || !1)) : a._visibility & 2 ? Tl(e, t, n, r) : Ol(e, t), i & 2048 && Cl(o, t);
				break;
			case 24:
				Tl(e, t, n, r), i & 2048 && wl(t.alternate, t);
				break;
			default: Tl(e, t, n, r);
		}
	}
	function Dl(e, t, n, r, i) {
		for (i &&= (t.subtreeFlags & 10256) != 0 || !1, t = t.child; t !== null;) {
			var a = e, o = t, s = n, c = r, l = o.flags;
			switch (o.tag) {
				case 0:
				case 11:
				case 15:
					Dl(a, o, s, c, i), Vc(8, o);
					break;
				case 23: break;
				case 22:
					var u = o.stateNode;
					o.memoizedState === null ? (u._visibility |= 2, Dl(a, o, s, c, i)) : u._visibility & 2 ? Dl(a, o, s, c, i) : Ol(a, o), i && l & 2048 && Cl(o.alternate, o);
					break;
				case 24:
					Dl(a, o, s, c, i), i && l & 2048 && wl(o.alternate, o);
					break;
				default: Dl(a, o, s, c, i);
			}
			t = t.sibling;
		}
	}
	function Ol(e, t) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
			var n = e, r = t, i = r.flags;
			switch (r.tag) {
				case 22:
					Ol(n, r), i & 2048 && Cl(r.alternate, r);
					break;
				case 24:
					Ol(n, r), i & 2048 && wl(r.alternate, r);
					break;
				default: Ol(n, r);
			}
			t = t.sibling;
		}
	}
	var kl = 8192;
	function Al(e, t, n) {
		if (e.subtreeFlags & kl) for (e = e.child; e !== null;) jl(e, t, n), e = e.sibling;
	}
	function jl(e, t, n) {
		switch (e.tag) {
			case 26:
				Al(e, t, n), e.flags & kl && e.memoizedState !== null && Gf(n, G, e.memoizedState, e.memoizedProps);
				break;
			case 5:
				Al(e, t, n);
				break;
			case 3:
			case 4:
				var r = G;
				G = gf(e.stateNode.containerInfo), Al(e, t, n), G = r;
				break;
			case 22:
				e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = kl, kl = 16777216, Al(e, t, n), kl = r) : Al(e, t, n));
				break;
			default: Al(e, t, n);
		}
	}
	function Ml(e) {
		var t = e.alternate;
		if (t !== null && (e = t.child, e !== null)) {
			t.child = null;
			do
				t = e.sibling, e.sibling = null, e = t;
			while (e !== null);
		}
	}
	function Nl(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				il = r, Il(r, e);
			}
			Ml(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) Pl(e), e = e.sibling;
	}
	function Pl(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				Nl(e), e.flags & 2048 && Hc(9, e, e.return);
				break;
			case 3:
				Nl(e);
				break;
			case 12:
				Nl(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Fl(e)) : Nl(e);
				break;
			default: Nl(e);
		}
	}
	function Fl(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				il = r, Il(r, e);
			}
			Ml(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					Hc(8, t, t.return), Fl(t);
					break;
				case 22:
					n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, Fl(t));
					break;
				default: Fl(t);
			}
			e = e.sibling;
		}
	}
	function Il(e, t) {
		for (; il !== null;) {
			var n = il;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					Hc(8, n, t);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var r = n.memoizedState.cachePool.pool;
						r != null && r.refCount++;
					}
					break;
				case 24: ca(n.memoizedState.cache);
			}
			if (r = n.child, r !== null) r.return = n, il = r;
			else a: for (n = e; il !== null;) {
				r = il;
				var i = r.sibling, a = r.return;
				if (sl(r), r === n) {
					il = null;
					break a;
				}
				if (i !== null) {
					i.return = a, il = i;
					break a;
				}
				il = a;
			}
		}
	}
	var Ll = {
		getCacheForType: function(e) {
			var t = ea(oa), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return ea(oa).controller.signal;
		}
	}, Rl = typeof WeakMap == "function" ? WeakMap : Map, K = 0, q = null, J = null, Y = 0, zl = 0, Bl = null, Vl = !1, Hl = !1, Ul = !1, Wl = 0, Gl = 0, Kl = 0, ql = 0, Jl = 0, Yl = 0, Xl = 0, Zl = null, X = null, Ql = !1, $l = 0, eu = 0, tu = Infinity, nu = null, ru = null, iu = 0, au = null, ou = null, su = 0, cu = 0, lu = null, uu = null, du = 0, fu = null;
	function pu() {
		return K & 2 && Y !== 0 ? Y & -Y : F.T === null ? rt() : ud();
	}
	function mu() {
		if (Yl === 0) if (!(Y & 536870912) || B) {
			var e = He;
			He <<= 1, !(He & 3932160) && (He = 262144), Yl = e;
		} else Yl = 536870912;
		return e = no.current, e !== null && (e.flags |= 32), Yl;
	}
	function hu(e, t, n) {
		(e === q && (zl === 2 || zl === 9) || e.cancelPendingCommit !== null) && (Su(e, 0), yu(e, Y, Yl, !1)), Xe(e, n), (!(K & 2) || e !== q) && (e === q && (!(K & 2) && (ql |= n), Gl === 4 && yu(e, Y, Yl, !1)), nd(e));
	}
	function gu(e, t, n) {
		if (K & 6) throw Error(i(327));
		var r = !n && (t & 127) == 0 && (t & e.expiredLanes) === 0 || Ke(e, t), a = r ? ku(e, t) : Du(e, t, !0), o = r;
		do {
			if (a === 0) {
				Hl && !r && yu(e, t, 0, !1);
				break;
			} else {
				if (n = e.current.alternate, o && !vu(n)) {
					a = Du(e, t, !1), o = !1;
					continue;
				}
				if (a === 2) {
					if (o = t, e.errorRecoveryDisabledLanes & o) var s = 0;
					else s = e.pendingLanes & -536870913, s = s === 0 ? s & 536870912 ? 536870912 : 0 : s;
					if (s !== 0) {
						t = s;
						a: {
							var c = e;
							a = Zl;
							var l = c.current.memoizedState.isDehydrated;
							if (l && (Su(c, s).flags |= 256), s = Du(c, s, !1), s !== 2) {
								if (Ul && !l) {
									c.errorRecoveryDisabledLanes |= o, ql |= o, a = 4;
									break a;
								}
								o = X, X = a, o !== null && (X === null ? X = o : X.push.apply(X, o));
							}
							a = s;
						}
						if (o = !1, a !== 2) continue;
					}
				}
				if (a === 1) {
					Su(e, 0), yu(e, t, 0, !0);
					break;
				}
				a: {
					switch (r = e, o = a, o) {
						case 0:
						case 1: throw Error(i(345));
						case 4: if ((t & 4194048) !== t) break;
						case 6:
							yu(r, t, Yl, !Vl);
							break a;
						case 2:
							X = null;
							break;
						case 3:
						case 5: break;
						default: throw Error(i(329));
					}
					if ((t & 62914560) === t && (a = $l + 300 - Te(), 10 < a)) {
						if (yu(r, t, Yl, !Vl), Ge(r, 0, !0) !== 0) break a;
						su = t, r.timeoutHandle = Kd(_u.bind(null, r, n, X, nu, Ql, t, Yl, ql, Xl, Vl, o, "Throttled", -0, 0), a);
						break a;
					}
					_u(r, n, X, nu, Ql, t, Yl, ql, Xl, Vl, o, null, -0, 0);
				}
			}
			break;
		} while (1);
		nd(e);
	}
	function _u(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
		if (e.timeoutHandle = -1, d = t.subtreeFlags, d & 8192 || (d & 16785408) == 16785408) {
			d = {
				stylesheets: null,
				count: 0,
				imgCount: 0,
				imgBytes: 0,
				suspenseyImages: [],
				waitingForImages: !0,
				waitingForViewTransition: !1,
				unsuspend: $t
			}, jl(t, a, d);
			var m = (a & 62914560) === a ? $l - Te() : (a & 4194048) === a ? eu - Te() : 0;
			if (m = qf(d, m), m !== null) {
				su = a, e.cancelPendingCommit = m(Fu.bind(null, e, t, a, n, r, i, o, s, c, u, d, null, f, p)), yu(e, a, o, !l);
				return;
			}
		}
		Fu(e, t, a, n, r, i, o, s, c);
	}
	function vu(e) {
		for (var t = e;;) {
			var n = t.tag;
			if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
				var i = n[r], a = i.getSnapshot;
				i = i.value;
				try {
					if (!xr(a(), i)) return !1;
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
	function yu(e, t, n, r) {
		t &= ~Jl, t &= ~ql, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
		for (var i = t; 0 < i;) {
			var a = 31 - Le(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && Qe(e, n, t);
	}
	function bu() {
		return K & 6 ? !0 : (rd(0, !1), !1);
	}
	function xu() {
		if (J !== null) {
			if (zl === 0) var e = J.return;
			else e = J, Ki = Gi = null, Ao(e), ja = null, Ma = 0, e = J;
			for (; e !== null;) Bc(e.alternate, e), e = e.return;
			J = null;
		}
	}
	function Su(e, t) {
		var n = e.timeoutHandle;
		n !== -1 && (e.timeoutHandle = -1, qd(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), su = 0, xu(), q = e, J = n = li(e.current, null), Y = t, zl = 0, Bl = null, Vl = !1, Hl = Ke(e, t), Ul = !1, Xl = Yl = Jl = ql = Kl = Gl = 0, X = Zl = null, Ql = !1, t & 8 && (t |= t & 32);
		var r = e.entangledLanes;
		if (r !== 0) for (e = e.entanglements, r &= t; 0 < r;) {
			var i = 31 - Le(r), a = 1 << i;
			t |= e[i], r &= ~a;
		}
		return Wl = t, $r(), n;
	}
	function Z(e, t) {
		V = null, F.H = Rs, t === xa || t === Ca ? (t = ka(), zl = 3) : t === Sa ? (t = ka(), zl = 4) : zl = t === nc ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, Bl = t, J === null && (Gl = 1, Xs(e, _i(t, e.current)));
	}
	function Cu() {
		var e = no.current;
		return e === null ? !0 : (Y & 4194048) === Y ? ro === null : (Y & 62914560) === Y || Y & 536870912 ? e === ro : !1;
	}
	function wu() {
		var e = F.H;
		return F.H = Rs, e === null ? Rs : e;
	}
	function Tu() {
		var e = F.A;
		return F.A = Ll, e;
	}
	function Eu() {
		Gl = 4, Vl || (Y & 4194048) !== Y && no.current !== null || (Hl = !0), !(Kl & 134217727) && !(ql & 134217727) || q === null || yu(q, Y, Yl, !1);
	}
	function Du(e, t, n) {
		var r = K;
		K |= 2;
		var i = wu(), a = Tu();
		(q !== e || Y !== t) && (nu = null, Su(e, t)), t = !1;
		var o = Gl;
		a: do
			try {
				if (zl !== 0 && J !== null) {
					var s = J, c = Bl;
					switch (zl) {
						case 8:
							xu(), o = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							no.current === null && (t = !0);
							var l = zl;
							if (zl = 0, Bl = null, Nu(e, s, c, l), n && Hl) {
								o = 0;
								break a;
							}
							break;
						default: l = zl, zl = 0, Bl = null, Nu(e, s, c, l);
					}
				}
				Ou(), o = Gl;
				break;
			} catch (t) {
				Z(e, t);
			}
		while (1);
		return t && e.shellSuspendCounter++, Ki = Gi = null, K = r, F.H = i, F.A = a, J === null && (q = null, Y = 0, $r()), o;
	}
	function Ou() {
		for (; J !== null;) ju(J);
	}
	function ku(e, t) {
		var n = K;
		K |= 2;
		var r = wu(), a = Tu();
		q !== e || Y !== t ? (nu = null, tu = Te() + 500, Su(e, t)) : Hl = Ke(e, t);
		a: do
			try {
				if (zl !== 0 && J !== null) {
					t = J;
					var o = Bl;
					b: switch (zl) {
						case 1:
							zl = 0, Bl = null, Nu(e, t, o, 1);
							break;
						case 2:
						case 9:
							if (Ta(o)) {
								zl = 0, Bl = null, Mu(t);
								break;
							}
							t = function() {
								zl !== 2 && zl !== 9 || q !== e || (zl = 7), nd(e);
							}, o.then(t, t);
							break a;
						case 3:
							zl = 7;
							break a;
						case 4:
							zl = 5;
							break a;
						case 7:
							Ta(o) ? (zl = 0, Bl = null, Mu(t)) : (zl = 0, Bl = null, Nu(e, t, o, 7));
							break;
						case 5:
							var s = null;
							switch (J.tag) {
								case 26: s = J.memoizedState;
								case 5:
								case 27:
									var c = J;
									if (s ? Wf(s) : c.stateNode.complete) {
										zl = 0, Bl = null;
										var l = c.sibling;
										if (l !== null) J = l;
										else {
											var u = c.return;
											u === null ? J = null : (J = u, Pu(u));
										}
										break b;
									}
							}
							zl = 0, Bl = null, Nu(e, t, o, 5);
							break;
						case 6:
							zl = 0, Bl = null, Nu(e, t, o, 6);
							break;
						case 8:
							xu(), Gl = 6;
							break a;
						default: throw Error(i(462));
					}
				}
				Au();
				break;
			} catch (t) {
				Z(e, t);
			}
		while (1);
		return Ki = Gi = null, F.H = r, F.A = a, K = n, J === null ? (q = null, Y = 0, $r(), Gl) : 0;
	}
	function Au() {
		for (; J !== null && !Ce();) ju(J);
	}
	function ju(e) {
		var t = Mc(e.alternate, e, Wl);
		e.memoizedProps = e.pendingProps, t === null ? Pu(e) : J = t;
	}
	function Mu(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = gc(n, t, t.pendingProps, t.type, void 0, Y);
				break;
			case 11:
				t = gc(n, t, t.pendingProps, t.type.render, t.ref, Y);
				break;
			case 5: Ao(t);
			default: Bc(n, t), t = J = ui(t, Wl), t = Mc(n, t, Wl);
		}
		e.memoizedProps = e.pendingProps, t === null ? Pu(e) : J = t;
	}
	function Nu(e, t, n, r) {
		Ki = Gi = null, Ao(t), ja = null, Ma = 0;
		var i = t.return;
		try {
			if (tc(e, i, t, n, Y)) {
				Gl = 1, Xs(e, _i(n, e.current)), J = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw J = i, t;
			Gl = 1, Xs(e, _i(n, e.current)), J = null;
			return;
		}
		t.flags & 32768 ? (B || r === 1 ? e = !0 : Hl || Y & 536870912 ? e = !1 : (Vl = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = no.current, r !== null && r.tag === 13 && (r.flags |= 16384))), Q(t, e)) : Pu(t);
	}
	function Pu(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				Q(t, Vl);
				return;
			}
			e = t.return;
			var n = Rc(t.alternate, t, Wl);
			if (n !== null) {
				J = n;
				return;
			}
			if (t = t.sibling, t !== null) {
				J = t;
				return;
			}
			J = t = e;
		} while (t !== null);
		Gl === 0 && (Gl = 5);
	}
	function Q(e, t) {
		do {
			var n = zc(e.alternate, e);
			if (n !== null) {
				n.flags &= 32767, J = n;
				return;
			}
			if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
				J = e;
				return;
			}
			J = e = n;
		} while (e !== null);
		Gl = 6, J = null;
	}
	function Fu(e, t, n, r, a, o, s, c, l) {
		e.cancelPendingCommit = null;
		do
			Bu();
		while (iu !== 0);
		if (K & 6) throw Error(i(327));
		if (t !== null) {
			if (t === e.current) throw Error(i(177));
			if (o = t.lanes | t.childLanes, o |= Qr, Ze(e, n, o, s, c, l), e === q && (J = q = null, Y = 0), ou = t, au = e, su = n, cu = o, lu = a, uu = r, t.subtreeFlags & 10256 || t.flags & 10256 ? (e.callbackNode = null, e.callbackPriority = 0, Yu(ke, function() {
				return Vu(), null;
			})) : (e.callbackNode = null, e.callbackPriority = 0), r = (t.flags & 13878) != 0, t.subtreeFlags & 13878 || r) {
				r = F.T, F.T = null, a = I.p, I.p = 2, s = K, K |= 4;
				try {
					al(e, t, n);
				} finally {
					K = s, I.p = a, F.T = r;
				}
			}
			iu = 1, Iu(), Lu(), Ru();
		}
	}
	function Iu() {
		if (iu === 1) {
			iu = 0;
			var e = au, t = ou, n = (t.flags & 13878) != 0;
			if (t.subtreeFlags & 13878 || n) {
				n = F.T, F.T = null;
				var r = I.p;
				I.p = 2;
				var i = K;
				K |= 4;
				try {
					_l(t, e);
					var a = zd, o = Er(e.containerInfo), s = a.focusedElem, c = a.selectionRange;
					if (o !== s && s && s.ownerDocument && Tr(s.ownerDocument.documentElement, s)) {
						if (c !== null && Dr(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = wr(s, h), v = wr(s, g);
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
					K = i, I.p = r, F.T = n;
				}
			}
			e.current = t, iu = 2;
		}
	}
	function Lu() {
		if (iu === 2) {
			iu = 0;
			var e = au, t = ou, n = (t.flags & 8772) != 0;
			if (t.subtreeFlags & 8772 || n) {
				n = F.T, F.T = null;
				var r = I.p;
				I.p = 2;
				var i = K;
				K |= 4;
				try {
					ol(e, t.alternate, t);
				} finally {
					K = i, I.p = r, F.T = n;
				}
			}
			iu = 3;
		}
	}
	function Ru() {
		if (iu === 4 || iu === 3) {
			iu = 0, we();
			var e = au, t = ou, n = su, r = uu;
			t.subtreeFlags & 10256 || t.flags & 10256 ? iu = 5 : (iu = 0, ou = au = null, zu(e, e.pendingLanes));
			var i = e.pendingLanes;
			if (i === 0 && (ru = null), nt(n), t = t.stateNode, Fe && typeof Fe.onCommitFiberRoot == "function") try {
				Fe.onCommitFiberRoot(Pe, t, void 0, (t.current.flags & 128) == 128);
			} catch {}
			if (r !== null) {
				t = F.T, i = I.p, I.p = 2, F.T = null;
				try {
					for (var a = e.onRecoverableError, o = 0; o < r.length; o++) {
						var s = r[o];
						a(s.value, { componentStack: s.stack });
					}
				} finally {
					F.T = t, I.p = i;
				}
			}
			su & 3 && Bu(), nd(e), i = e.pendingLanes, n & 261930 && i & 42 ? e === fu ? du++ : (du = 0, fu = e) : du = 0, rd(0, !1);
		}
	}
	function zu(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, ca(t)));
	}
	function Bu() {
		return Iu(), Lu(), Ru(), Vu();
	}
	function Vu() {
		if (iu !== 5) return !1;
		var e = au, t = cu;
		cu = 0;
		var n = nt(su), r = F.T, a = I.p;
		try {
			I.p = 32 > n ? 32 : n, F.T = null, n = lu, lu = null;
			var o = au, s = su;
			if (iu = 0, ou = au = null, su = 0, K & 6) throw Error(i(331));
			var c = K;
			if (K |= 4, Pl(o.current), El(o, o.current, s, n), K = c, rd(0, !1), Fe && typeof Fe.onPostCommitFiberRoot == "function") try {
				Fe.onPostCommitFiberRoot(Pe, o);
			} catch {}
			return !0;
		} finally {
			I.p = a, F.T = r, zu(e, t);
		}
	}
	function Hu(e, t, n) {
		t = _i(n, t), t = Qs(e.stateNode, t, 2), e = Ua(e, t, 2), e !== null && (Xe(e, 2), nd(e));
	}
	function Uu(e, t, n) {
		if (e.tag === 3) Hu(e, e, n);
		else for (; t !== null;) {
			if (t.tag === 3) {
				Hu(t, e, n);
				break;
			} else if (t.tag === 1) {
				var r = t.stateNode;
				if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (ru === null || !ru.has(r))) {
					e = _i(n, e), n = $s(2), r = Ua(t, n, 2), r !== null && (ec(n, r, t, e), Xe(r, 2), nd(r));
					break;
				}
			}
			t = t.return;
		}
	}
	function Wu(e, t, n) {
		var r = e.pingCache;
		if (r === null) {
			r = e.pingCache = new Rl();
			var i = /* @__PURE__ */ new Set();
			r.set(t, i);
		} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
		i.has(n) || (Ul = !0, i.add(n), e = Gu.bind(null, e, t, n), t.then(e, e));
	}
	function Gu(e, t, n) {
		var r = e.pingCache;
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, q === e && (Y & n) === n && (Gl === 4 || Gl === 3 && (Y & 62914560) === Y && 300 > Te() - $l ? !(K & 2) && Su(e, 0) : Jl |= n, Xl === Y && (Xl = 0)), nd(e);
	}
	function Ku(e, t) {
		t === 0 && (t = Je()), e = ni(e, t), e !== null && (Xe(e, t), nd(e));
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
		return xe(e, t);
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
							a = (1 << 31 - Le(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
						}
						a !== 0 && (n = !0, cd(r, a));
					} else a = Y, a = Ge(r, r === q ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || Ke(r, a) || (n = !0, cd(r, a));
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
		for (var t = Te(), n = null, r = Xu; r !== null;) {
			var i = r.next, a = od(r, t);
			a === 0 ? (r.next = null, n === null ? Xu = i : n.next = i, i === null && (Zu = n)) : (n = r, (e !== 0 || a & 3) && ($u = !0)), r = i;
		}
		iu !== 0 && iu !== 5 || rd(e, !1), td !== 0 && (td = 0);
	}
	function od(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - Le(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = qe(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = q, n = Y, n = Ge(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (zl === 2 || zl === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && Se(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || Ke(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && Se(r), nt(n)) {
				case 2:
				case 8:
					n = Oe;
					break;
				case 32:
					n = ke;
					break;
				case 268435456:
					n = je;
					break;
				default: n = ke;
			}
			return r = sd.bind(null, e), n = xe(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && Se(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function sd(e, t) {
		if (iu !== 0 && iu !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (Bu() && e.callbackNode !== n) return null;
		var r = Y;
		return r = Ge(e, e === q ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (gu(e, r, t), od(e, Te()), e.callbackNode != null && e.callbackNode === n ? sd.bind(null, e) : null);
	}
	function cd(e, t) {
		if (Bu()) return null;
		gu(e, t, !0);
	}
	function ld() {
		Yd(function() {
			K & 6 ? xe(De, id) : ad();
		});
	}
	function ud() {
		if (td === 0) {
			var e = da;
			e === 0 && (e = Ve, Ve <<= 1, !(Ve & 261888) && (Ve = 256)), td = e;
		}
		return td;
	}
	function dd(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Qt("" + e);
	}
	function fd(e, t) {
		var n = t.ownerDocument.createElement("input");
		return n.name = t.name, n.value = t.value, e.id && n.setAttribute("form", e.id), t.parentNode.insertBefore(n, t), e = new FormData(e), n.parentNode.removeChild(n), e;
	}
	function pd(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = dd((i[st] || null).action), o = r.submitter;
			o && (t = (t = o[st] || null) ? dd(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new xn("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (td !== 0) {
								var e = o ? fd(i, o) : new FormData(i);
								ws(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = o ? fd(i, o) : new FormData(i), ws(n, {
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
	for (var md = 0; md < qr.length; md++) {
		var hd = qr[md];
		Jr(hd.toLowerCase(), "on" + (hd[0].toUpperCase() + hd.slice(1)));
	}
	Jr(zr, "onAnimationEnd"), Jr(Br, "onAnimationIteration"), Jr(Vr, "onAnimationStart"), Jr("dblclick", "onDoubleClick"), Jr("focusin", "onFocus"), Jr("focusout", "onBlur"), Jr(Hr, "onTransitionRun"), Jr(Ur, "onTransitionStart"), Jr(Wr, "onTransitionCancel"), Jr(Gr, "onTransitionEnd"), Ct("onMouseEnter", ["mouseout", "mouseover"]), Ct("onMouseLeave", ["mouseout", "mouseover"]), Ct("onPointerEnter", ["pointerout", "pointerover"]), Ct("onPointerLeave", ["pointerout", "pointerover"]), St("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), St("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), St("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), St("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), St("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), St("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
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
						Yr(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						Yr(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function $(e, t) {
		var n = t[lt];
		n === void 0 && (n = t[lt] = /* @__PURE__ */ new Set());
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
			e[bd] = !0, bt.forEach(function(t) {
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
		n = i.bind(null, t, n, e), i = void 0, !un || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
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
					if (s = ht(c), s === null) return;
					if (l = s.tag, l === 5 || l === 6 || l === 26 || l === 27) {
						r = a = s;
						continue a;
					}
					c = c.parentNode;
				}
			}
			r = r.return;
		}
		sn(function() {
			var r = a, i = tn(n), s = [];
			a: {
				var c = Kr.get(e);
				if (c !== void 0) {
					var l = xn, u = e;
					switch (e) {
						case "keypress": if (gn(n) === 0) break a;
						case "keydown":
						case "keyup":
							l = Rn;
							break;
						case "focusin":
							u = "focus", l = kn;
							break;
						case "focusout":
							u = "blur", l = kn;
							break;
						case "beforeblur":
						case "afterblur":
							l = kn;
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
							l = Dn;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							l = On;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = Bn;
							break;
						case zr:
						case Br:
						case Vr:
							l = An;
							break;
						case Gr:
							l = Vn;
							break;
						case "scroll":
						case "scrollend":
							l = Cn;
							break;
						case "wheel":
							l = Hn;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = jn;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							l = zn;
							break;
						case "toggle":
						case "beforetoggle": l = Un;
					}
					var d = (t & 4) != 0, f = !d && (e === "scroll" || e === "scrollend"), p = d ? c === null ? null : c + "Capture" : c;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = cn(m, p), g != null && d.push(wd(m, g, h))), f) break;
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
					if (c = e === "mouseover" || e === "pointerover", l = e === "mouseout" || e === "pointerout", c && n !== en && (u = n.relatedTarget || n.fromElement) && (ht(u) || u[ct])) break a;
					if ((l || c) && (c = i.window === i ? i : (c = i.ownerDocument) ? c.defaultView || c.parentWindow : window, l ? (u = n.relatedTarget || n.toElement, l = r, u = u ? ht(u) : null, u !== null && (f = o(u), d = u.tag, u !== f || d !== 5 && d !== 27 && d !== 6) && (u = null)) : (l = null, u = r), l !== u)) {
						if (d = Dn, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = zn, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = l == null ? c : _t(l), h = u == null ? c : _t(u), c = new d(g, m + "leave", l, n, i), c.target = f, c.relatedTarget = h, g = null, ht(i) === r && (d = new d(p, m + "enter", u, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, l && u) b: {
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
					if (c = r ? _t(r) : window, l = c.nodeName && c.nodeName.toLowerCase(), l === "select" || l === "input" && c.type === "file") var v = lr;
					else if (rr(c)) if (ur) v = yr;
					else {
						v = _r;
						var y = gr;
					}
					else l = c.nodeName, !l || l.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? r && Yt(r.elementType) && (v = lr) : v = vr;
					if (v &&= v(e, r)) {
						ir(s, v, n, i);
						break a;
					}
					y && y(e, c, r), e === "focusout" && r && c.type === "number" && r.memoizedProps.value != null && Vt(c, "number", c.value);
				}
				switch (y = r ? _t(r) : window, e) {
					case "focusin":
						(rr(y) || y.contentEditable === "true") && (kr = y, Ar = r, jr = null);
						break;
					case "focusout":
						jr = Ar = kr = null;
						break;
					case "mousedown":
						Mr = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						Mr = !1, Nr(s, n, i);
						break;
					case "selectionchange": if (Or) break;
					case "keydown":
					case "keyup": Nr(s, n, i);
				}
				var b;
				if (Gn) b: {
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
				else $n ? Zn(e, n) && (x = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (x = "onCompositionStart");
				x && (Jn && n.locale !== "ko" && ($n || x !== "onCompositionStart" ? x === "onCompositionEnd" && $n && (b = hn()) : (fn = i, pn = "value" in fn ? fn.value : fn.textContent, $n = !0)), y = Td(r, x), 0 < y.length && (x = new Mn(x, e, null, n, i), s.push({
					event: x,
					listeners: y
				}), b ? x.data = b : (b = Qn(n), b !== null && (x.data = b)))), (b = qn ? er(e, n) : tr(e, n)) && (x = Td(r, "onBeforeInput"), 0 < x.length && (y = new Mn("onBeforeInput", "beforeinput", null, n, i), s.push({
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
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = cn(e, n), i != null && r.unshift(wd(e, i, a)), i = cn(e, t), i != null && r.push(wd(e, i, a))), e.tag === 3) return r;
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
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = cn(n, a), l != null && o.unshift(wd(n, l, c))) : i || (l = cn(n, a), l != null && o.push(wd(n, l, c)))), n = n.return;
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
				typeof r == "string" ? t === "body" || t === "textarea" && r === "" || Gt(e, r) : (typeof r == "number" || typeof r == "bigint") && t !== "body" && Gt(e, "" + r);
				break;
			case "className":
				kt(e, "class", r);
				break;
			case "tabIndex":
				kt(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				kt(e, n, r);
				break;
			case "style":
				Jt(e, r, o);
				break;
			case "data": if (t !== "object") {
				kt(e, "data", r);
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
				r = Qt("" + r), e.setAttribute(n, r);
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
				r = Qt("" + r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = $t);
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
				n = Qt("" + r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
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
				$("beforetoggle", e), $("toggle", e), Ot(e, "popover", r);
				break;
			case "xlinkActuate":
				At(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				At(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				At(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				At(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				At(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				At(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				At(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				At(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				At(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				Ot(e, "is", r);
				break;
			case "innerText":
			case "textContent": break;
			default: (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (n = Xt.get(n) || n, Ot(e, n, r));
		}
	}
	function Nd(e, t, n, r, a, o) {
		switch (n) {
			case "style":
				Jt(e, r, o);
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
				typeof r == "string" ? Gt(e, r) : (typeof r == "number" || typeof r == "bigint") && Gt(e, "" + r);
				break;
			case "onScroll":
				r != null && $("scroll", e);
				break;
			case "onScrollEnd":
				r != null && $("scrollend", e);
				break;
			case "onClick":
				r != null && (e.onclick = $t);
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": break;
			case "innerText":
			case "textContent": break;
			default: if (!xt.hasOwnProperty(n)) a: {
				if (n[0] === "o" && n[1] === "n" && (a = n.endsWith("Capture"), t = n.slice(2, a ? n.length - 7 : void 0), o = e[st] || null, o = o == null ? null : o[n], typeof o == "function" && e.removeEventListener(t, o, a), typeof r == "function")) {
					typeof o != "function" && o !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(t, r, a);
					break a;
				}
				n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : Ot(e, n, r);
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
				Bt(e, o, c, l, u, s, a, !1);
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
				t = o, n = s, e.multiple = !!r, t == null ? n != null && Ht(e, !!r, n, !0) : Ht(e, !!r, t, !1);
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
				Wt(e, r, a, o);
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
			default: if (Yt(t)) {
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
				zt(e, s, c, l, u, d, o, a);
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
				t = c, n = s, r = m, p == null ? !!r != !!n && (t == null ? Ht(e, !!n, n ? [] : "", !1) : Ht(e, !!n, t, !0)) : Ht(e, !!n, p, !1);
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
				Ut(e, p, m);
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
			default: if (Yt(t)) {
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
					a[pt] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
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
					ef(n), mt(n);
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
			else if (!e[pt]) switch (t) {
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
		mt(e);
	}
	var mf = /* @__PURE__ */ new Map(), hf = /* @__PURE__ */ new Set();
	function gf(e) {
		return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
	}
	var _f = I.d;
	I.d = {
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
		var e = _f.f(), t = bu();
		return e || t;
	}
	function yf(e) {
		var t = gt(e);
		t !== null && t.tag === 5 && t.type === "form" ? Es(t) : _f.r(e);
	}
	var bf = typeof document > "u" ? null : document;
	function xf(e, t, n) {
		var r = bf;
		if (r && typeof t == "string" && t) {
			var i = Rt(t);
			i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), hf.has(i) || (hf.add(i), e = {
				rel: e,
				crossOrigin: n,
				href: t
			}, r.querySelector(i) === null && (t = r.createElement("link"), Pd(t, "link", e), yt(t), r.head.appendChild(t)));
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
			var i = "link[rel=\"preload\"][as=\"" + Rt(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + Rt(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + Rt(n.imageSizes) + "\"]")) : i += "[href=\"" + Rt(e) + "\"]";
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
			}, n), mf.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(jf(a)) || t === "script" && r.querySelector(Ff(a)) || (t = r.createElement("link"), Pd(t, "link", e), yt(t), r.head.appendChild(t)));
		}
	}
	function Tf(e, t) {
		_f.m(e, t);
		var n = bf;
		if (n && e) {
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + Rt(r) + "\"][href=\"" + Rt(e) + "\"]", a = i;
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
				r = n.createElement("link"), Pd(r, "link", e), yt(r), n.head.appendChild(r);
			}
		}
	}
	function Ef(e, t, n) {
		_f.S(e, t, n);
		var r = bf;
		if (r && e) {
			var i = vt(r).hoistableStyles, a = Af(e);
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
					yt(c), Pd(c, "link", e), c._p = new Promise(function(e, t) {
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
			var r = vt(n).hoistableScripts, i = Pf(e), a = r.get(i);
			a || (a = n.querySelector(Ff(i)), a || (e = h({
				src: e,
				async: !0
			}, t), (t = mf.get(i)) && zf(e, t), a = n.createElement("script"), yt(a), Pd(a, "link", e), n.head.appendChild(a)), a = {
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
			var r = vt(n).hoistableScripts, i = Pf(e), a = r.get(i);
			a || (a = n.querySelector(Ff(i)), a || (e = h({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = mf.get(i)) && zf(e, t), a = n.createElement("script"), yt(a), Pd(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function kf(e, t, n, r) {
		var a = (a = se.current) ? gf(a) : null;
		if (!a) throw Error(i(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (t = Af(n.href), n = vt(a).hoistableStyles, r = n.get(t), r || (r = {
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
					var o = vt(a).hoistableStyles, s = o.get(e);
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
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Pf(n), n = vt(a).hoistableScripts, r = n.get(t), r || (r = {
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
		return "href=\"" + Rt(e) + "\"";
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
		}), Pd(t, "link", n), yt(t), e.head.appendChild(t));
	}
	function Pf(e) {
		return "[src=\"" + Rt(e) + "\"]";
	}
	function Ff(e) {
		return "script[async]" + e;
	}
	function If(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + Rt(n.href) + "\"]");
				if (r) return t.instance = r, yt(r), r;
				var a = h({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), yt(r), Pd(r, "style", a), Lf(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				a = Af(n.href);
				var o = e.querySelector(jf(a));
				if (o) return t.state.loading |= 4, t.instance = o, yt(o), o;
				r = Mf(n), (a = mf.get(a)) && Rf(r, a), o = (e.ownerDocument || e).createElement("link"), yt(o);
				var s = o;
				return s._p = new Promise(function(e, t) {
					s.onload = e, s.onerror = t;
				}), Pd(o, "link", r), t.state.loading |= 4, Lf(o, n.precedence, e), t.instance = o;
			case "script": return o = Pf(n.src), (a = e.querySelector(Ff(o))) ? (t.instance = a, yt(a), a) : (r = n, (a = mf.get(o)) && (r = h({}, n), zf(r, a)), e = e.ownerDocument || e, a = e.createElement("script"), yt(a), Pd(a, "link", r), e.head.appendChild(a), t.instance = a);
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
			if (!(a[pt] || a[ot] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== "http://www.w3.org/2000/svg") {
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
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = Jf.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, yt(a);
					return;
				}
				a = t.ownerDocument || t, r = Mf(r), (i = mf.get(i)) && Rf(r, i), a = a.createElement("link"), yt(a);
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
		_currentValue: L,
		_currentValue2: L,
		_threadCount: 0
	};
	function $f(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = Ye(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Ye(0), this.hiddenUpdates = Ye(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function ep(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new $f(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = si(3, null, null, t), e.current = a, a.stateNode = e, t = sa(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, Ba(a), e;
	}
	function tp(e) {
		return e ? (e = ai, e) : ai;
	}
	function np(e, t, n, r, i, a) {
		i = tp(i), r.context === null ? r.context = i : r.pendingContext = i, r = Ha(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = Ua(e, r, t), n !== null && (hu(n, e, t), Wa(n, e, t));
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
			var t = ni(e, 67108864);
			t !== null && hu(t, e, 67108864), ip(e, 67108864);
		}
	}
	function op(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = pu();
			t = tt(t);
			var n = ni(e, t);
			n !== null && hu(n, e, t), ip(e, t);
		}
	}
	var sp = !0;
	function cp(e, t, n, r) {
		var i = F.T;
		F.T = null;
		var a = I.p;
		try {
			I.p = 2, up(e, t, n, r);
		} finally {
			I.p = a, F.T = i;
		}
	}
	function lp(e, t, n, r) {
		var i = F.T;
		F.T = null;
		var a = I.p;
		try {
			I.p = 8, up(e, t, n, r);
		} finally {
			I.p = a, F.T = i;
		}
	}
	function up(e, t, n, r) {
		if (sp) {
			var i = dp(r);
			if (i === null) Cd(e, t, r, fp, n), Cp(e, r);
			else if (Tp(i, e, t, n, r)) r.stopPropagation();
			else if (Cp(e, r), t & 4 && -1 < Sp.indexOf(e)) {
				for (; i !== null;) {
					var a = gt(i);
					if (a !== null) switch (a.tag) {
						case 3:
							if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
								var o = We(a.pendingLanes);
								if (o !== 0) {
									var s = a;
									for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
										var c = 1 << 31 - Le(o);
										s.entanglements[1] |= c, o &= ~c;
									}
									nd(a), !(K & 6) && (tu = Te() + 500, rd(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = ni(a, 2), s !== null && hu(s, a, 2), bu(), ip(a, 2);
					}
					if (a = dp(r), a === null && Cd(e, t, r, fp, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else Cd(e, t, r, null, n);
		}
	}
	function dp(e) {
		return e = tn(e), pp(e);
	}
	var fp = null;
	function pp(e) {
		if (fp = null, e = ht(e), e !== null) {
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
			case "message": switch (Ee()) {
				case De: return 2;
				case Oe: return 8;
				case ke:
				case Ae: return 32;
				case je: return 268435456;
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
		}, t !== null && (t = gt(t), t !== null && ap(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
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
		var t = ht(e.target);
		if (t !== null) {
			var n = o(t);
			if (n !== null) {
				if (t = n.tag, t === 13) {
					if (t = s(n), t !== null) {
						e.blockedOn = t, it(e.priority, function() {
							op(n);
						});
						return;
					}
				} else if (t === 31) {
					if (t = c(n), t !== null) {
						e.blockedOn = t, it(e.priority, function() {
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
				en = r, n.target.dispatchEvent(r), en = null;
			} else return t = gt(n), t !== null && ap(t), e.blockedOn = n, !1;
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
				var a = gt(n);
				a !== null && (e.splice(t, 3), t -= 3, ws(a, {
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
			var i = n[r], a = n[r + 1], o = i[st] || null;
			if (typeof a == "function") o || Mp(n);
			else if (o) {
				var s = null;
				if (a && a.hasAttribute("formAction")) {
					if (i = a, o = a[st] || null) s = o.formAction;
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
		np(n, pu(), e, t, null, null);
	}, Ip.prototype.unmount = Fp.prototype.unmount = function() {
		var e = this._internalRoot;
		if (e !== null) {
			this._internalRoot = null;
			var t = e.containerInfo;
			np(e.current, 2, null, e, null, null), bu(), t[ct] = null;
		}
	};
	function Ip(e) {
		this._internalRoot = e;
	}
	Ip.prototype.unstable_scheduleHydration = function(e) {
		if (e) {
			var t = rt();
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
	I.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
		return e = d(t), e = e === null ? null : p(e), e = e === null ? null : e.stateNode, e;
	};
	var Rp = {
		bundleType: 0,
		version: "19.2.6",
		rendererPackageName: "react-dom",
		currentDispatcherRef: F,
		reconcilerVersion: "19.2.6"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var zp = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!zp.isDisabled && zp.supportsFiber) try {
			Pe = zp.inject(Rp), Fe = zp;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!a(e)) throw Error(i(299));
		var n = !1, r = "", o = qs, s = Js, c = Ys;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (o = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = ep(e, 1, !1, null, null, n, r, null, o, s, c, Pp), e[ct] = t.current, xd(e), new Fp(t);
	}, e.hydrateRoot = function(e, t, n) {
		if (!a(e)) throw Error(i(299));
		var r = !1, o = "", s = qs, c = Js, l = Ys, u = null;
		return n != null && (!0 === n.unstable_strictMode && (r = !0), n.identifierPrefix !== void 0 && (o = n.identifierPrefix), n.onUncaughtError !== void 0 && (s = n.onUncaughtError), n.onCaughtError !== void 0 && (c = n.onCaughtError), n.onRecoverableError !== void 0 && (l = n.onRecoverableError), n.formState !== void 0 && (u = n.formState)), t = ep(e, 1, !0, t, n ?? null, r, o, u, s, c, l, Pp), t.context = tp(null), n = t.current, r = pu(), r = tt(r), o = Ha(r), o.callback = null, Ua(n, o, r), n = r, t.current.lanes = n, Xe(t, n), nd(t), e[ct] = t.current, xd(e), new Ip(t);
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
function A(e) {
	return function() {
		var t = this.ownerDocument, n = this.namespaceURI;
		return n === "http://www.w3.org/1999/xhtml" && t.documentElement.namespaceURI === "http://www.w3.org/1999/xhtml" ? t.createElement(e) : t.createElementNS(n, e);
	};
}
function j(e) {
	return function() {
		return this.ownerDocument.createElementNS(e.space, e.local);
	};
}
function ee(e) {
	var t = k(e);
	return (t.local ? j : A)(t);
}
//#endregion
//#region node_modules/d3-selection/src/selector.js
function M() {}
function N(e) {
	return e == null ? M : function() {
		return this.querySelector(e);
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/select.js
function P(e) {
	typeof e != "function" && (e = N(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = Array(o), c, l, u = 0; u < o; ++u) (c = a[u]) && (l = e.call(c, c.__data__, u, a)) && ("__data__" in c && (l.__data__ = c.__data__), s[u] = l);
	return new Rt(r, this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/array.js
function F(e) {
	return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
//#endregion
//#region node_modules/d3-selection/src/selectorAll.js
function I() {
	return [];
}
function L(e) {
	return e == null ? I : function() {
		return this.querySelectorAll(e);
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/selectAll.js
function te(e) {
	return function() {
		return F(e.apply(this, arguments));
	};
}
function ne(e) {
	e = typeof e == "function" ? te(e) : L(e);
	for (var t = this._groups, n = t.length, r = [], i = [], a = 0; a < n; ++a) for (var o = t[a], s = o.length, c, l = 0; l < s; ++l) (c = o[l]) && (r.push(e.call(c, c.__data__, l, o)), i.push(c));
	return new Rt(r, i);
}
//#endregion
//#region node_modules/d3-selection/src/matcher.js
function re(e) {
	return function() {
		return this.matches(e);
	};
}
function ie(e) {
	return function(t) {
		return t.matches(e);
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/selectChild.js
var R = Array.prototype.find;
function ae(e) {
	return function() {
		return R.call(this.children, e);
	};
}
function oe() {
	return this.firstElementChild;
}
function se(e) {
	return this.select(e == null ? oe : ae(typeof e == "function" ? e : ie(e)));
}
//#endregion
//#region node_modules/d3-selection/src/selection/selectChildren.js
var ce = Array.prototype.filter;
function le() {
	return Array.from(this.children);
}
function ue(e) {
	return function() {
		return ce.call(this.children, e);
	};
}
function de(e) {
	return this.selectAll(e == null ? le : ue(typeof e == "function" ? e : ie(e)));
}
//#endregion
//#region node_modules/d3-selection/src/selection/filter.js
function fe(e) {
	typeof e != "function" && (e = re(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = [], c, l = 0; l < o; ++l) (c = a[l]) && e.call(c, c.__data__, l, a) && s.push(c);
	return new Rt(r, this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/selection/sparse.js
function pe(e) {
	return Array(e.length);
}
//#endregion
//#region node_modules/d3-selection/src/selection/enter.js
function me() {
	return new Rt(this._enter || this._groups.map(pe), this._parents);
}
function he(e, t) {
	this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
he.prototype = {
	constructor: he,
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
function ge(e) {
	return function() {
		return e;
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/data.js
function _e(e, t, n, r, i, a) {
	for (var o = 0, s, c = t.length, l = a.length; o < l; ++o) (s = t[o]) ? (s.__data__ = a[o], r[o] = s) : n[o] = new he(e, a[o]);
	for (; o < c; ++o) (s = t[o]) && (i[o] = s);
}
function ve(e, t, n, r, i, a, o) {
	var s, c, l = /* @__PURE__ */ new Map(), u = t.length, d = a.length, f = Array(u), p;
	for (s = 0; s < u; ++s) (c = t[s]) && (f[s] = p = o.call(c, c.__data__, s, t) + "", l.has(p) ? i[s] = c : l.set(p, c));
	for (s = 0; s < d; ++s) p = o.call(e, a[s], s, a) + "", (c = l.get(p)) ? (r[s] = c, c.__data__ = a[s], l.delete(p)) : n[s] = new he(e, a[s]);
	for (s = 0; s < u; ++s) (c = t[s]) && l.get(f[s]) === c && (i[s] = c);
}
function ye(e) {
	return e.__data__;
}
function be(e, t) {
	if (!arguments.length) return Array.from(this, ye);
	var n = t ? ve : _e, r = this._parents, i = this._groups;
	typeof e != "function" && (e = ge(e));
	for (var a = i.length, o = Array(a), s = Array(a), c = Array(a), l = 0; l < a; ++l) {
		var u = r[l], d = i[l], f = d.length, p = xe(e.call(u, u && u.__data__, l, r)), m = p.length, h = s[l] = Array(m), g = o[l] = Array(m);
		n(u, d, h, g, c[l] = Array(f), p, t);
		for (var _ = 0, v = 0, y, b; _ < m; ++_) if (y = h[_]) {
			for (_ >= v && (v = _ + 1); !(b = g[v]) && ++v < m;);
			y._next = b || null;
		}
	}
	return o = new Rt(o, r), o._enter = s, o._exit = c, o;
}
function xe(e) {
	return typeof e == "object" && "length" in e ? e : Array.from(e);
}
//#endregion
//#region node_modules/d3-selection/src/selection/exit.js
function Se() {
	return new Rt(this._exit || this._groups.map(pe), this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/selection/join.js
function Ce(e, t, n) {
	var r = this.enter(), i = this, a = this.exit();
	return typeof e == "function" ? (r = e(r), r &&= r.selection()) : r = r.append(e + ""), t != null && (i = t(i), i &&= i.selection()), n == null ? a.remove() : n(a), r && i ? r.merge(i).order() : i;
}
//#endregion
//#region node_modules/d3-selection/src/selection/merge.js
function we(e) {
	for (var t = e.selection ? e.selection() : e, n = this._groups, r = t._groups, i = n.length, a = r.length, o = Math.min(i, a), s = Array(i), c = 0; c < o; ++c) for (var l = n[c], u = r[c], d = l.length, f = s[c] = Array(d), p, m = 0; m < d; ++m) (p = l[m] || u[m]) && (f[m] = p);
	for (; c < i; ++c) s[c] = n[c];
	return new Rt(s, this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/selection/order.js
function Te() {
	for (var e = this._groups, t = -1, n = e.length; ++t < n;) for (var r = e[t], i = r.length - 1, a = r[i], o; --i >= 0;) (o = r[i]) && (a && o.compareDocumentPosition(a) ^ 4 && a.parentNode.insertBefore(o, a), a = o);
	return this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/sort.js
function Ee(e) {
	e ||= De;
	function t(t, n) {
		return t && n ? e(t.__data__, n.__data__) : !t - !n;
	}
	for (var n = this._groups, r = n.length, i = Array(r), a = 0; a < r; ++a) {
		for (var o = n[a], s = o.length, c = i[a] = Array(s), l, u = 0; u < s; ++u) (l = o[u]) && (c[u] = l);
		c.sort(t);
	}
	return new Rt(i, this._parents).order();
}
function De(e, t) {
	return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
//#endregion
//#region node_modules/d3-selection/src/selection/call.js
function Oe() {
	var e = arguments[0];
	return arguments[0] = this, e.apply(null, arguments), this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/nodes.js
function ke() {
	return Array.from(this);
}
//#endregion
//#region node_modules/d3-selection/src/selection/node.js
function Ae() {
	for (var e = this._groups, t = 0, n = e.length; t < n; ++t) for (var r = e[t], i = 0, a = r.length; i < a; ++i) {
		var o = r[i];
		if (o) return o;
	}
	return null;
}
//#endregion
//#region node_modules/d3-selection/src/selection/size.js
function je() {
	let e = 0;
	for (let t of this) ++e;
	return e;
}
//#endregion
//#region node_modules/d3-selection/src/selection/empty.js
function Me() {
	return !this.node();
}
//#endregion
//#region node_modules/d3-selection/src/selection/each.js
function Ne(e) {
	for (var t = this._groups, n = 0, r = t.length; n < r; ++n) for (var i = t[n], a = 0, o = i.length, s; a < o; ++a) (s = i[a]) && e.call(s, s.__data__, a, i);
	return this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/attr.js
function Pe(e) {
	return function() {
		this.removeAttribute(e);
	};
}
function Fe(e) {
	return function() {
		this.removeAttributeNS(e.space, e.local);
	};
}
function Ie(e, t) {
	return function() {
		this.setAttribute(e, t);
	};
}
function Le(e, t) {
	return function() {
		this.setAttributeNS(e.space, e.local, t);
	};
}
function Re(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
	};
}
function ze(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
	};
}
function Be(e, t) {
	var n = k(e);
	if (arguments.length < 2) {
		var r = this.node();
		return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
	}
	return this.each((t == null ? n.local ? Fe : Pe : typeof t == "function" ? n.local ? ze : Re : n.local ? Le : Ie)(n, t));
}
//#endregion
//#region node_modules/d3-selection/src/window.js
function Ve(e) {
	return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
//#endregion
//#region node_modules/d3-selection/src/selection/style.js
function He(e) {
	return function() {
		this.style.removeProperty(e);
	};
}
function Ue(e, t, n) {
	return function() {
		this.style.setProperty(e, t, n);
	};
}
function We(e, t, n) {
	return function() {
		var r = t.apply(this, arguments);
		r == null ? this.style.removeProperty(e) : this.style.setProperty(e, r, n);
	};
}
function Ge(e, t, n) {
	return arguments.length > 1 ? this.each((t == null ? He : typeof t == "function" ? We : Ue)(e, t, n ?? "")) : Ke(this.node(), e);
}
function Ke(e, t) {
	return e.style.getPropertyValue(t) || Ve(e).getComputedStyle(e, null).getPropertyValue(t);
}
//#endregion
//#region node_modules/d3-selection/src/selection/property.js
function qe(e) {
	return function() {
		delete this[e];
	};
}
function Je(e, t) {
	return function() {
		this[e] = t;
	};
}
function Ye(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? delete this[e] : this[e] = n;
	};
}
function Xe(e, t) {
	return arguments.length > 1 ? this.each((t == null ? qe : typeof t == "function" ? Ye : Je)(e, t)) : this.node()[e];
}
//#endregion
//#region node_modules/d3-selection/src/selection/classed.js
function Ze(e) {
	return e.trim().split(/^|\s+/);
}
function Qe(e) {
	return e.classList || new $e(e);
}
function $e(e) {
	this._node = e, this._names = Ze(e.getAttribute("class") || "");
}
$e.prototype = {
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
function et(e, t) {
	for (var n = Qe(e), r = -1, i = t.length; ++r < i;) n.add(t[r]);
}
function tt(e, t) {
	for (var n = Qe(e), r = -1, i = t.length; ++r < i;) n.remove(t[r]);
}
function nt(e) {
	return function() {
		et(this, e);
	};
}
function rt(e) {
	return function() {
		tt(this, e);
	};
}
function it(e, t) {
	return function() {
		(t.apply(this, arguments) ? et : tt)(this, e);
	};
}
function at(e, t) {
	var n = Ze(e + "");
	if (arguments.length < 2) {
		for (var r = Qe(this.node()), i = -1, a = n.length; ++i < a;) if (!r.contains(n[i])) return !1;
		return !0;
	}
	return this.each((typeof t == "function" ? it : t ? nt : rt)(n, t));
}
//#endregion
//#region node_modules/d3-selection/src/selection/text.js
function ot() {
	this.textContent = "";
}
function st(e) {
	return function() {
		this.textContent = e;
	};
}
function ct(e) {
	return function() {
		var t = e.apply(this, arguments);
		this.textContent = t ?? "";
	};
}
function lt(e) {
	return arguments.length ? this.each(e == null ? ot : (typeof e == "function" ? ct : st)(e)) : this.node().textContent;
}
//#endregion
//#region node_modules/d3-selection/src/selection/html.js
function ut() {
	this.innerHTML = "";
}
function dt(e) {
	return function() {
		this.innerHTML = e;
	};
}
function ft(e) {
	return function() {
		var t = e.apply(this, arguments);
		this.innerHTML = t ?? "";
	};
}
function pt(e) {
	return arguments.length ? this.each(e == null ? ut : (typeof e == "function" ? ft : dt)(e)) : this.node().innerHTML;
}
//#endregion
//#region node_modules/d3-selection/src/selection/raise.js
function mt() {
	this.nextSibling && this.parentNode.appendChild(this);
}
function ht() {
	return this.each(mt);
}
//#endregion
//#region node_modules/d3-selection/src/selection/lower.js
function gt() {
	this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function _t() {
	return this.each(gt);
}
//#endregion
//#region node_modules/d3-selection/src/selection/append.js
function vt(e) {
	var t = typeof e == "function" ? e : ee(e);
	return this.select(function() {
		return this.appendChild(t.apply(this, arguments));
	});
}
//#endregion
//#region node_modules/d3-selection/src/selection/insert.js
function yt() {
	return null;
}
function bt(e, t) {
	var n = typeof e == "function" ? e : ee(e), r = t == null ? yt : typeof t == "function" ? t : N(t);
	return this.select(function() {
		return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
	});
}
//#endregion
//#region node_modules/d3-selection/src/selection/remove.js
function xt() {
	var e = this.parentNode;
	e && e.removeChild(this);
}
function St() {
	return this.each(xt);
}
//#endregion
//#region node_modules/d3-selection/src/selection/clone.js
function Ct() {
	var e = this.cloneNode(!1), t = this.parentNode;
	return t ? t.insertBefore(e, this.nextSibling) : e;
}
function wt() {
	var e = this.cloneNode(!0), t = this.parentNode;
	return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Tt(e) {
	return this.select(e ? wt : Ct);
}
//#endregion
//#region node_modules/d3-selection/src/selection/datum.js
function Et(e) {
	return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
//#endregion
//#region node_modules/d3-selection/src/selection/on.js
function Dt(e) {
	return function(t) {
		e.call(this, t, this.__data__);
	};
}
function Ot(e) {
	return e.trim().split(/^|\s+/).map(function(e) {
		var t = "", n = e.indexOf(".");
		return n >= 0 && (t = e.slice(n + 1), e = e.slice(0, n)), {
			type: e,
			name: t
		};
	});
}
function kt(e) {
	return function() {
		var t = this.__on;
		if (t) {
			for (var n = 0, r = -1, i = t.length, a; n < i; ++n) a = t[n], (!e.type || a.type === e.type) && a.name === e.name ? this.removeEventListener(a.type, a.listener, a.options) : t[++r] = a;
			++r ? t.length = r : delete this.__on;
		}
	};
}
function At(e, t, n) {
	return function() {
		var r = this.__on, i, a = Dt(t);
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
function jt(e, t, n) {
	var r = Ot(e + ""), i, a = r.length, o;
	if (arguments.length < 2) {
		var s = this.node().__on;
		if (s) {
			for (var c = 0, l = s.length, u; c < l; ++c) for (i = 0, u = s[c]; i < a; ++i) if ((o = r[i]).type === u.type && o.name === u.name) return u.value;
		}
		return;
	}
	for (s = t ? At : kt, i = 0; i < a; ++i) this.each(s(r[i], t, n));
	return this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/dispatch.js
function Mt(e, t, n) {
	var r = Ve(e), i = r.CustomEvent;
	typeof i == "function" ? i = new i(t, n) : (i = r.document.createEvent("Event"), n ? (i.initEvent(t, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(t, !1, !1)), e.dispatchEvent(i);
}
function Nt(e, t) {
	return function() {
		return Mt(this, e, t);
	};
}
function Pt(e, t) {
	return function() {
		return Mt(this, e, t.apply(this, arguments));
	};
}
function Ft(e, t) {
	return this.each((typeof t == "function" ? Pt : Nt)(e, t));
}
//#endregion
//#region node_modules/d3-selection/src/selection/iterator.js
function* It() {
	for (var e = this._groups, t = 0, n = e.length; t < n; ++t) for (var r = e[t], i = 0, a = r.length, o; i < a; ++i) (o = r[i]) && (yield o);
}
//#endregion
//#region node_modules/d3-selection/src/selection/index.js
var Lt = [null];
function Rt(e, t) {
	this._groups = e, this._parents = t;
}
function zt() {
	return new Rt([[document.documentElement]], Lt);
}
function Bt() {
	return this;
}
Rt.prototype = zt.prototype = {
	constructor: Rt,
	select: P,
	selectAll: ne,
	selectChild: se,
	selectChildren: de,
	filter: fe,
	data: be,
	enter: me,
	exit: Se,
	join: Ce,
	merge: we,
	selection: Bt,
	order: Te,
	sort: Ee,
	call: Oe,
	nodes: ke,
	node: Ae,
	size: je,
	empty: Me,
	each: Ne,
	attr: Be,
	style: Ge,
	property: Xe,
	classed: at,
	text: lt,
	html: pt,
	raise: ht,
	lower: _t,
	append: vt,
	insert: bt,
	remove: St,
	clone: Tt,
	datum: Et,
	on: jt,
	dispatch: Ft,
	[Symbol.iterator]: It
};
//#endregion
//#region node_modules/d3-selection/src/select.js
function Vt(e) {
	return typeof e == "string" ? new Rt([[document.querySelector(e)]], [document.documentElement]) : new Rt([[e]], Lt);
}
//#endregion
//#region node_modules/d3-selection/src/sourceEvent.js
function Ht(e) {
	let t;
	for (; t = e.sourceEvent;) e = t;
	return e;
}
//#endregion
//#region node_modules/d3-selection/src/pointer.js
function Ut(e, t) {
	if (e = Ht(e), t === void 0 && (t = e.currentTarget), t) {
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
var Wt = { passive: !1 }, Gt = {
	capture: !0,
	passive: !1
};
function Kt(e) {
	e.stopImmediatePropagation();
}
function qt(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region node_modules/d3-drag/src/nodrag.js
function Jt(e) {
	var t = e.document.documentElement, n = Vt(e).on("dragstart.drag", qt, Gt);
	"onselectstart" in t ? n.on("selectstart.drag", qt, Gt) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function Yt(e, t) {
	var n = e.document.documentElement, r = Vt(e).on("dragstart.drag", null);
	t && (r.on("click.drag", qt, Gt), setTimeout(function() {
		r.on("click.drag", null);
	}, 0)), "onselectstart" in n ? r.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
//#endregion
//#region node_modules/d3-drag/src/constant.js
var Xt = (e) => () => e;
//#endregion
//#region node_modules/d3-drag/src/event.js
function Zt(e, { sourceEvent: t, subject: n, target: r, identifier: i, active: a, x: o, y: s, dx: c, dy: l, dispatch: u }) {
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
Zt.prototype.on = function() {
	var e = this._.on.apply(this._, arguments);
	return e === this._ ? this : e;
};
//#endregion
//#region node_modules/d3-drag/src/drag.js
function Qt(e) {
	return !e.ctrlKey && !e.button;
}
function $t() {
	return this.parentNode;
}
function en(e, t) {
	return t ?? {
		x: e.x,
		y: e.y
	};
}
function tn() {
	return navigator.maxTouchPoints || "ontouchstart" in this;
}
function nn() {
	var e = Qt, t = $t, n = en, r = tn, i = {}, a = C("start", "drag", "end"), o = 0, s, c, l, u, d = 0;
	function f(e) {
		e.on("mousedown.drag", p).filter(r).on("touchstart.drag", g).on("touchmove.drag", _, Wt).on("touchend.drag touchcancel.drag", v).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	}
	function p(n, r) {
		if (!(u || !e.call(this, n, r))) {
			var i = y(this, t.call(this, n, r), n, r, "mouse");
			i && (Vt(n.view).on("mousemove.drag", m, Gt).on("mouseup.drag", h, Gt), Jt(n.view), Kt(n), l = !1, s = n.clientX, c = n.clientY, i("start", n));
		}
	}
	function m(e) {
		if (qt(e), !l) {
			var t = e.clientX - s, n = e.clientY - c;
			l = t * t + n * n > d;
		}
		i.mouse("drag", e);
	}
	function h(e) {
		Vt(e.view).on("mousemove.drag mouseup.drag", null), Yt(e.view, l), qt(e), i.mouse("end", e);
	}
	function g(n, r) {
		if (e.call(this, n, r)) {
			var i = n.changedTouches, a = t.call(this, n, r), o = i.length, s, c;
			for (s = 0; s < o; ++s) (c = y(this, a, n, r, i[s].identifier, i[s])) && (Kt(n), c("start", n, i[s]));
		}
	}
	function _(e) {
		var t = e.changedTouches, n = t.length, r, a;
		for (r = 0; r < n; ++r) (a = i[t[r].identifier]) && (qt(e), a("drag", e, t[r]));
	}
	function v(e) {
		var t = e.changedTouches, n = t.length, r, a;
		for (u && clearTimeout(u), u = setTimeout(function() {
			u = null;
		}, 500), r = 0; r < n; ++r) (a = i[t[r].identifier]) && (Kt(e), a("end", e, t[r]));
	}
	function y(e, t, r, s, c, l) {
		var u = a.copy(), d = Ut(l || r, t), p, m, h;
		if ((h = n.call(e, new Zt("beforestart", {
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
					d = Ut(l || a, t), _ = o;
					break;
			}
			u.call(r, e, new Zt(r, {
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
		return arguments.length ? (e = typeof t == "function" ? t : Xt(!!t), f) : e;
	}, f.container = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : Xt(e), f) : t;
	}, f.subject = function(e) {
		return arguments.length ? (n = typeof e == "function" ? e : Xt(e), f) : n;
	}, f.touchable = function(e) {
		return arguments.length ? (r = typeof e == "function" ? e : Xt(!!e), f) : r;
	}, f.on = function() {
		var e = a.on.apply(a, arguments);
		return e === a ? f : e;
	}, f.clickDistance = function(e) {
		return arguments.length ? (d = (e = +e) * e, f) : Math.sqrt(d);
	}, f;
}
//#endregion
//#region node_modules/d3-color/src/define.js
function rn(e, t, n) {
	e.prototype = t.prototype = n, n.constructor = e;
}
function an(e, t) {
	var n = Object.create(e.prototype);
	for (var r in t) n[r] = t[r];
	return n;
}
//#endregion
//#region node_modules/d3-color/src/color.js
function on() {}
var sn = .7, cn = 1 / sn, ln = "\\s*([+-]?\\d+)\\s*", un = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", dn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", fn = /^#([0-9a-f]{3,8})$/, pn = RegExp(`^rgb\\(${ln},${ln},${ln}\\)$`), mn = RegExp(`^rgb\\(${dn},${dn},${dn}\\)$`), hn = RegExp(`^rgba\\(${ln},${ln},${ln},${un}\\)$`), gn = RegExp(`^rgba\\(${dn},${dn},${dn},${un}\\)$`), _n = RegExp(`^hsl\\(${un},${dn},${dn}\\)$`), vn = RegExp(`^hsla\\(${un},${dn},${dn},${un}\\)$`), yn = {
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
rn(on, z, {
	copy(e) {
		return Object.assign(new this.constructor(), this, e);
	},
	displayable() {
		return this.rgb().displayable();
	},
	hex: bn,
	formatHex: bn,
	formatHex8: xn,
	formatHsl: Sn,
	formatRgb: Cn,
	toString: Cn
});
function bn() {
	return this.rgb().formatHex();
}
function xn() {
	return this.rgb().formatHex8();
}
function Sn() {
	return In(this).formatHsl();
}
function Cn() {
	return this.rgb().formatRgb();
}
function z(e) {
	var t, n;
	return e = (e + "").trim().toLowerCase(), (t = fn.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? wn(t) : n === 3 ? new On(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? Tn(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? Tn(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = pn.exec(e)) ? new On(t[1], t[2], t[3], 1) : (t = mn.exec(e)) ? new On(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = hn.exec(e)) ? Tn(t[1], t[2], t[3], t[4]) : (t = gn.exec(e)) ? Tn(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = _n.exec(e)) ? Fn(t[1], t[2] / 100, t[3] / 100, 1) : (t = vn.exec(e)) ? Fn(t[1], t[2] / 100, t[3] / 100, t[4]) : yn.hasOwnProperty(e) ? wn(yn[e]) : e === "transparent" ? new On(NaN, NaN, NaN, 0) : null;
}
function wn(e) {
	return new On(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function Tn(e, t, n, r) {
	return r <= 0 && (e = t = n = NaN), new On(e, t, n, r);
}
function En(e) {
	return e instanceof on || (e = z(e)), e ? (e = e.rgb(), new On(e.r, e.g, e.b, e.opacity)) : new On();
}
function Dn(e, t, n, r) {
	return arguments.length === 1 ? En(e) : new On(e, t, n, r ?? 1);
}
function On(e, t, n, r) {
	this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
rn(On, Dn, an(on, {
	brighter(e) {
		return e = e == null ? cn : cn ** +e, new On(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? sn : sn ** +e, new On(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	rgb() {
		return this;
	},
	clamp() {
		return new On(Nn(this.r), Nn(this.g), Nn(this.b), Mn(this.opacity));
	},
	displayable() {
		return -.5 <= this.r && this.r < 255.5 && -.5 <= this.g && this.g < 255.5 && -.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
	},
	hex: kn,
	formatHex: kn,
	formatHex8: An,
	formatRgb: jn,
	toString: jn
}));
function kn() {
	return `#${Pn(this.r)}${Pn(this.g)}${Pn(this.b)}`;
}
function An() {
	return `#${Pn(this.r)}${Pn(this.g)}${Pn(this.b)}${Pn((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function jn() {
	let e = Mn(this.opacity);
	return `${e === 1 ? "rgb(" : "rgba("}${Nn(this.r)}, ${Nn(this.g)}, ${Nn(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function Mn(e) {
	return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function Nn(e) {
	return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function Pn(e) {
	return e = Nn(e), (e < 16 ? "0" : "") + e.toString(16);
}
function Fn(e, t, n, r) {
	return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new Rn(e, t, n, r);
}
function In(e) {
	if (e instanceof Rn) return new Rn(e.h, e.s, e.l, e.opacity);
	if (e instanceof on || (e = z(e)), !e) return new Rn();
	if (e instanceof Rn) return e;
	e = e.rgb();
	var t = e.r / 255, n = e.g / 255, r = e.b / 255, i = Math.min(t, n, r), a = Math.max(t, n, r), o = NaN, s = a - i, c = (a + i) / 2;
	return s ? (o = t === a ? (n - r) / s + (n < r) * 6 : n === a ? (r - t) / s + 2 : (t - n) / s + 4, s /= c < .5 ? a + i : 2 - a - i, o *= 60) : s = c > 0 && c < 1 ? 0 : o, new Rn(o, s, c, e.opacity);
}
function Ln(e, t, n, r) {
	return arguments.length === 1 ? In(e) : new Rn(e, t, n, r ?? 1);
}
function Rn(e, t, n, r) {
	this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
rn(Rn, Ln, an(on, {
	brighter(e) {
		return e = e == null ? cn : cn ** +e, new Rn(this.h, this.s, this.l * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? sn : sn ** +e, new Rn(this.h, this.s, this.l * e, this.opacity);
	},
	rgb() {
		var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < .5 ? n : 1 - n) * t, i = 2 * n - r;
		return new On(Vn(e >= 240 ? e - 240 : e + 120, i, r), Vn(e, i, r), Vn(e < 120 ? e + 240 : e - 120, i, r), this.opacity);
	},
	clamp() {
		return new Rn(zn(this.h), Bn(this.s), Bn(this.l), Mn(this.opacity));
	},
	displayable() {
		return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
	},
	formatHsl() {
		let e = Mn(this.opacity);
		return `${e === 1 ? "hsl(" : "hsla("}${zn(this.h)}, ${Bn(this.s) * 100}%, ${Bn(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
	}
}));
function zn(e) {
	return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function Bn(e) {
	return Math.max(0, Math.min(1, e || 0));
}
function Vn(e, t, n) {
	return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
//#endregion
//#region node_modules/d3-interpolate/src/constant.js
var Hn = (e) => () => e;
//#endregion
//#region node_modules/d3-interpolate/src/color.js
function Un(e, t) {
	return function(n) {
		return e + n * t;
	};
}
function Wn(e, t, n) {
	return e **= +n, t = t ** +n - e, n = 1 / n, function(r) {
		return (e + r * t) ** +n;
	};
}
function Gn(e) {
	return (e = +e) == 1 ? Kn : function(t, n) {
		return n - t ? Wn(t, n, e) : Hn(isNaN(t) ? n : t);
	};
}
function Kn(e, t) {
	var n = t - e;
	return n ? Un(e, n) : Hn(isNaN(e) ? t : e);
}
//#endregion
//#region node_modules/d3-interpolate/src/rgb.js
var qn = (function e(t) {
	var n = Gn(t);
	function r(e, t) {
		var r = n((e = Dn(e)).r, (t = Dn(t)).r), i = n(e.g, t.g), a = n(e.b, t.b), o = Kn(e.opacity, t.opacity);
		return function(t) {
			return e.r = r(t), e.g = i(t), e.b = a(t), e.opacity = o(t), e + "";
		};
	}
	return r.gamma = e, r;
})(1);
//#endregion
//#region node_modules/d3-interpolate/src/numberArray.js
function Jn(e, t) {
	t ||= [];
	var n = e ? Math.min(t.length, e.length) : 0, r = t.slice(), i;
	return function(a) {
		for (i = 0; i < n; ++i) r[i] = e[i] * (1 - a) + t[i] * a;
		return r;
	};
}
function Yn(e) {
	return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
//#endregion
//#region node_modules/d3-interpolate/src/array.js
function Xn(e, t) {
	var n = t ? t.length : 0, r = e ? Math.min(n, e.length) : 0, i = Array(r), a = Array(n), o;
	for (o = 0; o < r; ++o) i[o] = ar(e[o], t[o]);
	for (; o < n; ++o) a[o] = t[o];
	return function(e) {
		for (o = 0; o < r; ++o) a[o] = i[o](e);
		return a;
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/date.js
function Zn(e, t) {
	var n = /* @__PURE__ */ new Date();
	return e = +e, t = +t, function(r) {
		return n.setTime(e * (1 - r) + t * r), n;
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/number.js
function Qn(e, t) {
	return e = +e, t = +t, function(n) {
		return e * (1 - n) + t * n;
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/object.js
function $n(e, t) {
	var n = {}, r = {}, i;
	for (i in (typeof e != "object" || !e) && (e = {}), (typeof t != "object" || !t) && (t = {}), t) i in e ? n[i] = ar(e[i], t[i]) : r[i] = t[i];
	return function(e) {
		for (i in n) r[i] = n[i](e);
		return r;
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/string.js
var er = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, tr = new RegExp(er.source, "g");
function nr(e) {
	return function() {
		return e;
	};
}
function rr(e) {
	return function(t) {
		return e(t) + "";
	};
}
function ir(e, t) {
	var n = er.lastIndex = tr.lastIndex = 0, r, i, a, o = -1, s = [], c = [];
	for (e += "", t += ""; (r = er.exec(e)) && (i = tr.exec(t));) (a = i.index) > n && (a = t.slice(n, a), s[o] ? s[o] += a : s[++o] = a), (r = r[0]) === (i = i[0]) ? s[o] ? s[o] += i : s[++o] = i : (s[++o] = null, c.push({
		i: o,
		x: Qn(r, i)
	})), n = tr.lastIndex;
	return n < t.length && (a = t.slice(n), s[o] ? s[o] += a : s[++o] = a), s.length < 2 ? c[0] ? rr(c[0].x) : nr(t) : (t = c.length, function(e) {
		for (var n = 0, r; n < t; ++n) s[(r = c[n]).i] = r.x(e);
		return s.join("");
	});
}
//#endregion
//#region node_modules/d3-interpolate/src/value.js
function ar(e, t) {
	var n = typeof t, r;
	return t == null || n === "boolean" ? Hn(t) : (n === "number" ? Qn : n === "string" ? (r = z(t)) ? (t = r, qn) : ir : t instanceof z ? qn : t instanceof Date ? Zn : Yn(t) ? Jn : Array.isArray(t) ? Xn : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? $n : Qn)(e, t);
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/decompose.js
var or = 180 / Math.PI, sr = {
	translateX: 0,
	translateY: 0,
	rotate: 0,
	skewX: 0,
	scaleX: 1,
	scaleY: 1
};
function cr(e, t, n, r, i, a) {
	var o, s, c;
	return (o = Math.sqrt(e * e + t * t)) && (e /= o, t /= o), (c = e * n + t * r) && (n -= e * c, r -= t * c), (s = Math.sqrt(n * n + r * r)) && (n /= s, r /= s, c /= s), e * r < t * n && (e = -e, t = -t, c = -c, o = -o), {
		translateX: i,
		translateY: a,
		rotate: Math.atan2(t, e) * or,
		skewX: Math.atan(c) * or,
		scaleX: o,
		scaleY: s
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/parse.js
var lr;
function ur(e) {
	let t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
	return t.isIdentity ? sr : cr(t.a, t.b, t.c, t.d, t.e, t.f);
}
function dr(e) {
	return e == null || (lr ||= document.createElementNS("http://www.w3.org/2000/svg", "g"), lr.setAttribute("transform", e), !(e = lr.transform.baseVal.consolidate())) ? sr : (e = e.matrix, cr(e.a, e.b, e.c, e.d, e.e, e.f));
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/index.js
function fr(e, t, n, r) {
	function i(e) {
		return e.length ? e.pop() + " " : "";
	}
	function a(e, r, i, a, o, s) {
		if (e !== i || r !== a) {
			var c = o.push("translate(", null, t, null, n);
			s.push({
				i: c - 4,
				x: Qn(e, i)
			}, {
				i: c - 2,
				x: Qn(r, a)
			});
		} else (i || a) && o.push("translate(" + i + t + a + n);
	}
	function o(e, t, n, a) {
		e === t ? t && n.push(i(n) + "rotate(" + t + r) : (e - t > 180 ? t += 360 : t - e > 180 && (e += 360), a.push({
			i: n.push(i(n) + "rotate(", null, r) - 2,
			x: Qn(e, t)
		}));
	}
	function s(e, t, n, a) {
		e === t ? t && n.push(i(n) + "skewX(" + t + r) : a.push({
			i: n.push(i(n) + "skewX(", null, r) - 2,
			x: Qn(e, t)
		});
	}
	function c(e, t, n, r, a, o) {
		if (e !== n || t !== r) {
			var s = a.push(i(a) + "scale(", null, ",", null, ")");
			o.push({
				i: s - 4,
				x: Qn(e, n)
			}, {
				i: s - 2,
				x: Qn(t, r)
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
var pr = fr(ur, "px, ", "px)", "deg)"), mr = fr(dr, ", ", ")", ")"), hr = 1e-12;
function gr(e) {
	return ((e = Math.exp(e)) + 1 / e) / 2;
}
function _r(e) {
	return ((e = Math.exp(e)) - 1 / e) / 2;
}
function vr(e) {
	return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
var yr = (function e(t, n, r) {
	function i(e, i) {
		var a = e[0], o = e[1], s = e[2], c = i[0], l = i[1], u = i[2], d = c - a, f = l - o, p = d * d + f * f, m, h;
		if (p < hr) h = Math.log(u / s) / t, m = function(e) {
			return [
				a + e * d,
				o + e * f,
				s * Math.exp(t * e * h)
			];
		};
		else {
			var g = Math.sqrt(p), _ = (u * u - s * s + r * p) / (2 * s * n * g), v = (u * u - s * s - r * p) / (2 * u * n * g), y = Math.log(Math.sqrt(_ * _ + 1) - _);
			h = (Math.log(Math.sqrt(v * v + 1) - v) - y) / t, m = function(e) {
				var r = e * h, i = gr(y), c = s / (n * g) * (i * vr(t * r + y) - _r(y));
				return [
					a + c * d,
					o + c * f,
					s * i / gr(t * r + y)
				];
			};
		}
		return m.duration = h * 1e3 * t / Math.SQRT2, m;
	}
	return i.rho = function(t) {
		var n = Math.max(.001, +t), r = n * n;
		return e(n, r, r * r);
	}, i;
})(Math.SQRT2, 2, 4), br = 0, xr = 0, Sr = 0, Cr = 1e3, wr, Tr, Er = 0, Dr = 0, Or = 0, kr = typeof performance == "object" && performance.now ? performance : Date, Ar = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
	setTimeout(e, 17);
};
function jr() {
	return Dr ||= (Ar(Mr), kr.now() + Or);
}
function Mr() {
	Dr = 0;
}
function Nr() {
	this._call = this._time = this._next = null;
}
Nr.prototype = Pr.prototype = {
	constructor: Nr,
	restart: function(e, t, n) {
		if (typeof e != "function") throw TypeError("callback is not a function");
		n = (n == null ? jr() : +n) + (t == null ? 0 : +t), !this._next && Tr !== this && (Tr ? Tr._next = this : wr = this, Tr = this), this._call = e, this._time = n, zr();
	},
	stop: function() {
		this._call && (this._call = null, this._time = Infinity, zr());
	}
};
function Pr(e, t, n) {
	var r = new Nr();
	return r.restart(e, t, n), r;
}
function Fr() {
	jr(), ++br;
	for (var e = wr, t; e;) (t = Dr - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
	--br;
}
function Ir() {
	Dr = (Er = kr.now()) + Or, br = xr = 0;
	try {
		Fr();
	} finally {
		br = 0, Rr(), Dr = 0;
	}
}
function Lr() {
	var e = kr.now(), t = e - Er;
	t > Cr && (Or -= t, Er = e);
}
function Rr() {
	for (var e, t = wr, n, r = Infinity; t;) t._call ? (r > t._time && (r = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : wr = n);
	Tr = e, zr(r);
}
function zr(e) {
	br || (xr &&= clearTimeout(xr), e - Dr > 24 ? (e < Infinity && (xr = setTimeout(Ir, e - kr.now() - Or)), Sr &&= clearInterval(Sr)) : (Sr ||= (Er = kr.now(), setInterval(Lr, Cr)), br = 1, Ar(Ir)));
}
//#endregion
//#region node_modules/d3-timer/src/timeout.js
function Br(e, t, n) {
	var r = new Nr();
	return t = t == null ? 0 : +t, r.restart((n) => {
		r.stop(), e(n + t);
	}, t, n), r;
}
//#endregion
//#region node_modules/d3-transition/src/transition/schedule.js
var Vr = m(), Hr = C("start", "end", "cancel", "interrupt"), Ur = [];
function Wr(e, t, n, r, i, a) {
	var o = e.__transition;
	if (!o) e.__transition = {};
	else if (n in o) return;
	Jr(e, n, {
		name: t,
		index: r,
		group: i,
		on: Hr,
		tween: Ur,
		time: a.time,
		delay: a.delay,
		duration: a.duration,
		ease: a.ease,
		timer: null,
		state: 0
	});
}
function Gr(e, t) {
	var n = qr(e, t);
	if (n.state > 0) throw Error("too late; already scheduled");
	return n;
}
function Kr(e, t) {
	var n = qr(e, t);
	if (n.state > 3) throw Error("too late; already running");
	return n;
}
function qr(e, t) {
	var n = e.__transition;
	if (!n || !(n = n[t])) throw Error("transition not found");
	return n;
}
function Jr(e, t, n) {
	var r = e.__transition, i;
	r[t] = n, n.timer = Pr(a, 0, n.time);
	function a(e) {
		n.state = 1, n.timer.restart(o, n.delay, n.time), n.delay <= e && o(e - n.delay);
	}
	function o(a) {
		var l, u, d, f;
		if (n.state !== 1) return c();
		for (l in r) if (f = r[l], f.name === n.name) {
			if (f.state === 3) return Br(o);
			f.state === 4 ? (f.state = 6, f.timer.stop(), f.on.call("interrupt", e, e.__data__, f.index, f.group), delete r[l]) : +l < t && (f.state = 6, f.timer.stop(), f.on.call("cancel", e, e.__data__, f.index, f.group), delete r[l]);
		}
		if (Br(function() {
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
function Yr(e, t) {
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
function Xr(e) {
	return this.each(function() {
		Yr(this, e);
	});
}
//#endregion
//#region node_modules/d3-transition/src/transition/tween.js
function Zr(e, t) {
	var n, r;
	return function() {
		var i = Kr(this, e), a = i.tween;
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
function Qr(e, t, n) {
	var r, i;
	if (typeof n != "function") throw Error();
	return function() {
		var a = Kr(this, e), o = a.tween;
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
function $r(e, t) {
	var n = this._id;
	if (e += "", arguments.length < 2) {
		for (var r = qr(this.node(), n).tween, i = 0, a = r.length, o; i < a; ++i) if ((o = r[i]).name === e) return o.value;
		return null;
	}
	return this.each((t == null ? Zr : Qr)(n, e, t));
}
function ei(e, t, n) {
	var r = e._id;
	return e.each(function() {
		var e = Kr(this, r);
		(e.value ||= {})[t] = n.apply(this, arguments);
	}), function(e) {
		return qr(e, r).value[t];
	};
}
//#endregion
//#region node_modules/d3-transition/src/transition/interpolate.js
function ti(e, t) {
	var n;
	return (typeof t == "number" ? Qn : t instanceof z ? qn : (n = z(t)) ? (t = n, qn) : ir)(e, t);
}
//#endregion
//#region node_modules/d3-transition/src/transition/attr.js
function ni(e) {
	return function() {
		this.removeAttribute(e);
	};
}
function ri(e) {
	return function() {
		this.removeAttributeNS(e.space, e.local);
	};
}
function ii(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = this.getAttribute(e);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function ai(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = this.getAttributeNS(e.space, e.local);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function oi(e, t, n) {
	var r, i, a;
	return function() {
		var o, s = n(this), c;
		return s == null ? void this.removeAttribute(e) : (o = this.getAttribute(e), c = s + "", o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s)));
	};
}
function si(e, t, n) {
	var r, i, a;
	return function() {
		var o, s = n(this), c;
		return s == null ? void this.removeAttributeNS(e.space, e.local) : (o = this.getAttributeNS(e.space, e.local), c = s + "", o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s)));
	};
}
function ci(e, t) {
	var n = k(e), r = n === "transform" ? mr : ti;
	return this.attrTween(e, typeof t == "function" ? (n.local ? si : oi)(n, r, ei(this, "attr." + e, t)) : t == null ? (n.local ? ri : ni)(n) : (n.local ? ai : ii)(n, r, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/attrTween.js
function li(e, t) {
	return function(n) {
		this.setAttribute(e, t.call(this, n));
	};
}
function ui(e, t) {
	return function(n) {
		this.setAttributeNS(e.space, e.local, t.call(this, n));
	};
}
function di(e, t) {
	var n, r;
	function i() {
		var i = t.apply(this, arguments);
		return i !== r && (n = (r = i) && ui(e, i)), n;
	}
	return i._value = t, i;
}
function fi(e, t) {
	var n, r;
	function i() {
		var i = t.apply(this, arguments);
		return i !== r && (n = (r = i) && li(e, i)), n;
	}
	return i._value = t, i;
}
function pi(e, t) {
	var n = "attr." + e;
	if (arguments.length < 2) return (n = this.tween(n)) && n._value;
	if (t == null) return this.tween(n, null);
	if (typeof t != "function") throw Error();
	var r = k(e);
	return this.tween(n, (r.local ? di : fi)(r, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/delay.js
function mi(e, t) {
	return function() {
		Gr(this, e).delay = +t.apply(this, arguments);
	};
}
function hi(e, t) {
	return t = +t, function() {
		Gr(this, e).delay = t;
	};
}
function gi(e) {
	var t = this._id;
	return arguments.length ? this.each((typeof e == "function" ? mi : hi)(t, e)) : qr(this.node(), t).delay;
}
//#endregion
//#region node_modules/d3-transition/src/transition/duration.js
function _i(e, t) {
	return function() {
		Kr(this, e).duration = +t.apply(this, arguments);
	};
}
function vi(e, t) {
	return t = +t, function() {
		Kr(this, e).duration = t;
	};
}
function yi(e) {
	var t = this._id;
	return arguments.length ? this.each((typeof e == "function" ? _i : vi)(t, e)) : qr(this.node(), t).duration;
}
//#endregion
//#region node_modules/d3-transition/src/transition/ease.js
function bi(e, t) {
	if (typeof t != "function") throw Error();
	return function() {
		Kr(this, e).ease = t;
	};
}
function xi(e) {
	var t = this._id;
	return arguments.length ? this.each(bi(t, e)) : qr(this.node(), t).ease;
}
//#endregion
//#region node_modules/d3-transition/src/transition/easeVarying.js
function Si(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		if (typeof n != "function") throw Error();
		Kr(this, e).ease = n;
	};
}
function Ci(e) {
	if (typeof e != "function") throw Error();
	return this.each(Si(this._id, e));
}
//#endregion
//#region node_modules/d3-transition/src/transition/filter.js
function wi(e) {
	typeof e != "function" && (e = re(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = [], c, l = 0; l < o; ++l) (c = a[l]) && e.call(c, c.__data__, l, a) && s.push(c);
	return new Qi(r, this._parents, this._name, this._id);
}
//#endregion
//#region node_modules/d3-transition/src/transition/merge.js
function Ti(e) {
	if (e._id !== this._id) throw Error();
	for (var t = this._groups, n = e._groups, r = t.length, i = n.length, a = Math.min(r, i), o = Array(r), s = 0; s < a; ++s) for (var c = t[s], l = n[s], u = c.length, d = o[s] = Array(u), f, p = 0; p < u; ++p) (f = c[p] || l[p]) && (d[p] = f);
	for (; s < r; ++s) o[s] = t[s];
	return new Qi(o, this._parents, this._name, this._id);
}
//#endregion
//#region node_modules/d3-transition/src/transition/on.js
function Ei(e) {
	return (e + "").trim().split(/^|\s+/).every(function(e) {
		var t = e.indexOf(".");
		return t >= 0 && (e = e.slice(0, t)), !e || e === "start";
	});
}
function Di(e, t, n) {
	var r, i, a = Ei(t) ? Gr : Kr;
	return function() {
		var o = a(this, e), s = o.on;
		s !== r && (i = (r = s).copy()).on(t, n), o.on = i;
	};
}
function Oi(e, t) {
	var n = this._id;
	return arguments.length < 2 ? qr(this.node(), n).on.on(e) : this.each(Di(n, e, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/remove.js
function ki(e) {
	return function() {
		var t = this.parentNode;
		for (var n in this.__transition) if (+n !== e) return;
		t && t.removeChild(this);
	};
}
function Ai() {
	return this.on("end.remove", ki(this._id));
}
//#endregion
//#region node_modules/d3-transition/src/transition/select.js
function ji(e) {
	var t = this._name, n = this._id;
	typeof e != "function" && (e = N(e));
	for (var r = this._groups, i = r.length, a = Array(i), o = 0; o < i; ++o) for (var s = r[o], c = s.length, l = a[o] = Array(c), u, d, f = 0; f < c; ++f) (u = s[f]) && (d = e.call(u, u.__data__, f, s)) && ("__data__" in u && (d.__data__ = u.__data__), l[f] = d, Wr(l[f], t, n, f, l, qr(u, n)));
	return new Qi(a, this._parents, t, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/selectAll.js
function Mi(e) {
	var t = this._name, n = this._id;
	typeof e != "function" && (e = L(e));
	for (var r = this._groups, i = r.length, a = [], o = [], s = 0; s < i; ++s) for (var c = r[s], l = c.length, u, d = 0; d < l; ++d) if (u = c[d]) {
		for (var f = e.call(u, u.__data__, d, c), p, m = qr(u, n), h = 0, g = f.length; h < g; ++h) (p = f[h]) && Wr(p, t, n, h, f, m);
		a.push(f), o.push(u);
	}
	return new Qi(a, o, t, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/selection.js
var Ni = zt.prototype.constructor;
function B() {
	return new Ni(this._groups, this._parents);
}
//#endregion
//#region node_modules/d3-transition/src/transition/style.js
function Pi(e, t) {
	var n, r, i;
	return function() {
		var a = Ke(this, e), o = (this.style.removeProperty(e), Ke(this, e));
		return a === o ? null : a === n && o === r ? i : i = t(n = a, r = o);
	};
}
function Fi(e) {
	return function() {
		this.style.removeProperty(e);
	};
}
function Ii(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = Ke(this, e);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function Li(e, t, n) {
	var r, i, a;
	return function() {
		var o = Ke(this, e), s = n(this), c = s + "";
		return s ?? (c = s = (this.style.removeProperty(e), Ke(this, e))), o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s));
	};
}
function Ri(e, t) {
	var n, r, i, a = "style." + t, o = "end." + a, s;
	return function() {
		var c = Kr(this, e), l = c.on, u = c.value[a] == null ? s ||= Fi(t) : void 0;
		(l !== n || i !== u) && (r = (n = l).copy()).on(o, i = u), c.on = r;
	};
}
function zi(e, t, n) {
	var r = (e += "") == "transform" ? pr : ti;
	return t == null ? this.styleTween(e, Pi(e, r)).on("end.style." + e, Fi(e)) : typeof t == "function" ? this.styleTween(e, Li(e, r, ei(this, "style." + e, t))).each(Ri(this._id, e)) : this.styleTween(e, Ii(e, r, t), n).on("end.style." + e, null);
}
//#endregion
//#region node_modules/d3-transition/src/transition/styleTween.js
function Bi(e, t, n) {
	return function(r) {
		this.style.setProperty(e, t.call(this, r), n);
	};
}
function Vi(e, t, n) {
	var r, i;
	function a() {
		var a = t.apply(this, arguments);
		return a !== i && (r = (i = a) && Bi(e, a, n)), r;
	}
	return a._value = t, a;
}
function Hi(e, t, n) {
	var r = "style." + (e += "");
	if (arguments.length < 2) return (r = this.tween(r)) && r._value;
	if (t == null) return this.tween(r, null);
	if (typeof t != "function") throw Error();
	return this.tween(r, Vi(e, t, n ?? ""));
}
//#endregion
//#region node_modules/d3-transition/src/transition/text.js
function Ui(e) {
	return function() {
		this.textContent = e;
	};
}
function Wi(e) {
	return function() {
		var t = e(this);
		this.textContent = t ?? "";
	};
}
function Gi(e) {
	return this.tween("text", typeof e == "function" ? Wi(ei(this, "text", e)) : Ui(e == null ? "" : e + ""));
}
//#endregion
//#region node_modules/d3-transition/src/transition/textTween.js
function Ki(e) {
	return function(t) {
		this.textContent = e.call(this, t);
	};
}
function qi(e) {
	var t, n;
	function r() {
		var r = e.apply(this, arguments);
		return r !== n && (t = (n = r) && Ki(r)), t;
	}
	return r._value = e, r;
}
function Ji(e) {
	var t = "text";
	if (arguments.length < 1) return (t = this.tween(t)) && t._value;
	if (e == null) return this.tween(t, null);
	if (typeof e != "function") throw Error();
	return this.tween(t, qi(e));
}
//#endregion
//#region node_modules/d3-transition/src/transition/transition.js
function Yi() {
	for (var e = this._name, t = this._id, n = ea(), r = this._groups, i = r.length, a = 0; a < i; ++a) for (var o = r[a], s = o.length, c, l = 0; l < s; ++l) if (c = o[l]) {
		var u = qr(c, t);
		Wr(c, e, n, l, o, {
			time: u.time + u.delay + u.duration,
			delay: 0,
			duration: u.duration,
			ease: u.ease
		});
	}
	return new Qi(r, this._parents, e, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/end.js
function Xi() {
	var e, t, n = this, r = n._id, i = n.size();
	return new Promise(function(a, o) {
		var s = { value: o }, c = { value: function() {
			--i === 0 && a();
		} };
		n.each(function() {
			var n = Kr(this, r), i = n.on;
			i !== e && (t = (e = i).copy(), t._.cancel.push(s), t._.interrupt.push(s), t._.end.push(c)), n.on = t;
		}), i === 0 && a();
	});
}
//#endregion
//#region node_modules/d3-transition/src/transition/index.js
var Zi = 0;
function Qi(e, t, n, r) {
	this._groups = e, this._parents = t, this._name = n, this._id = r;
}
function $i(e) {
	return zt().transition(e);
}
function ea() {
	return ++Zi;
}
var ta = zt.prototype;
Qi.prototype = $i.prototype = {
	constructor: Qi,
	select: ji,
	selectAll: Mi,
	selectChild: ta.selectChild,
	selectChildren: ta.selectChildren,
	filter: wi,
	merge: Ti,
	selection: B,
	transition: Yi,
	call: ta.call,
	nodes: ta.nodes,
	node: ta.node,
	size: ta.size,
	empty: ta.empty,
	each: ta.each,
	on: Oi,
	attr: ci,
	attrTween: pi,
	style: zi,
	styleTween: Hi,
	text: Gi,
	textTween: Ji,
	remove: Ai,
	tween: $r,
	delay: gi,
	duration: yi,
	ease: xi,
	easeVarying: Ci,
	end: Xi,
	[Symbol.iterator]: ta[Symbol.iterator]
};
//#endregion
//#region node_modules/d3-ease/src/cubic.js
function na(e) {
	return --e * e * e + 1;
}
function ra(e) {
	return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
//#endregion
//#region node_modules/d3-transition/src/selection/transition.js
var ia = {
	time: null,
	delay: 0,
	duration: 250,
	ease: ra
};
function aa(e, t) {
	for (var n; !(n = e.__transition) || !(n = n[t]);) if (!(e = e.parentNode)) throw Error(`transition ${t} not found`);
	return n;
}
function oa(e) {
	var t, n;
	e instanceof Qi ? (t = e._id, e = e._name) : (t = ea(), (n = ia).time = jr(), e = e == null ? null : e + "");
	for (var r = this._groups, i = r.length, a = 0; a < i; ++a) for (var o = r[a], s = o.length, c, l = 0; l < s; ++l) (c = o[l]) && Wr(c, e, t, l, o, n || aa(c, t));
	return new Qi(r, this._parents, e, t);
}
zt.prototype.interrupt = Xr, zt.prototype.transition = oa;
//#endregion
//#region node_modules/d3-brush/src/brush.js
var { abs: sa, max: ca, min: la } = Math;
["w", "e"].map(ua), ["n", "s"].map(ua), [
	"n",
	"w",
	"e",
	"s",
	"nw",
	"ne",
	"sw",
	"se"
].map(ua);
function ua(e) {
	return { type: e };
}
//#endregion
//#region node_modules/d3-path/src/path.js
var da = Math.PI, fa = 2 * da, pa = 1e-6, ma = fa - pa;
function ha(e) {
	this._ += e[0];
	for (let t = 1, n = e.length; t < n; ++t) this._ += arguments[t] + e[t];
}
function ga(e) {
	let t = Math.floor(e);
	if (!(t >= 0)) throw Error(`invalid digits: ${e}`);
	if (t > 15) return ha;
	let n = 10 ** t;
	return function(e) {
		this._ += e[0];
		for (let t = 1, r = e.length; t < r; ++t) this._ += Math.round(arguments[t] * n) / n + e[t];
	};
}
var _a = class {
	constructor(e) {
		this._x0 = this._y0 = this._x1 = this._y1 = null, this._ = "", this._append = e == null ? ha : ga(e);
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
		else if (d > pa) if (!(Math.abs(u * s - c * l) > pa) || !i) this._append`L${this._x1 = e},${this._y1 = t}`;
		else {
			let f = n - a, p = r - o, m = s * s + c * c, h = f * f + p * p, g = Math.sqrt(m), _ = Math.sqrt(d), v = i * Math.tan((da - Math.acos((m + d - h) / (2 * g * _))) / 2), y = v / _, b = v / g;
			Math.abs(y - 1) > pa && this._append`L${e + y * l},${t + y * u}`, this._append`A${i},${i},0,0,${+(u * f > l * p)},${this._x1 = e + b * s},${this._y1 = t + b * c}`;
		}
	}
	arc(e, t, n, r, i, a) {
		if (e = +e, t = +t, n = +n, a = !!a, n < 0) throw Error(`negative radius: ${n}`);
		let o = n * Math.cos(r), s = n * Math.sin(r), c = e + o, l = t + s, u = 1 ^ a, d = a ? r - i : i - r;
		this._x1 === null ? this._append`M${c},${l}` : (Math.abs(this._x1 - c) > pa || Math.abs(this._y1 - l) > pa) && this._append`L${c},${l}`, n && (d < 0 && (d = d % fa + fa), d > ma ? this._append`A${n},${n},0,1,${u},${e - o},${t - s}A${n},${n},0,1,${u},${this._x1 = c},${this._y1 = l}` : d > pa && this._append`A${n},${n},0,${+(d >= da)},${u},${this._x1 = e + n * Math.cos(i)},${this._y1 = t + n * Math.sin(i)}`);
	}
	rect(e, t, n, r) {
		this._append`M${this._x0 = this._x1 = +e},${this._y0 = this._y1 = +t}h${n = +n}v${+r}h${-n}Z`;
	}
	toString() {
		return this._;
	}
};
function va() {
	return new _a();
}
va.prototype = _a.prototype;
//#endregion
//#region node_modules/d3-force/src/center.js
function ya(e, t) {
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
function ba(e) {
	let t = +this._x.call(null, e), n = +this._y.call(null, e);
	return xa(this.cover(t, n), t, n, e);
}
function xa(e, t, n, r) {
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
function Sa(e) {
	var t, n, r = e.length, i, a, o = Array(r), s = Array(r), c = Infinity, l = Infinity, u = -Infinity, d = -Infinity;
	for (n = 0; n < r; ++n) isNaN(i = +this._x.call(null, t = e[n])) || isNaN(a = +this._y.call(null, t)) || (o[n] = i, s[n] = a, i < c && (c = i), i > u && (u = i), a < l && (l = a), a > d && (d = a));
	if (c > u || l > d) return this;
	for (this.cover(c, l).cover(u, d), n = 0; n < r; ++n) xa(this, o[n], s[n], e[n]);
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/cover.js
function Ca(e, t) {
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
function wa() {
	var e = [];
	return this.visit(function(t) {
		if (!t.length) do
			e.push(t.data);
		while (t = t.next);
	}), e;
}
//#endregion
//#region node_modules/d3-quadtree/src/extent.js
function Ta(e) {
	return arguments.length ? this.cover(+e[0][0], +e[0][1]).cover(+e[1][0], +e[1][1]) : isNaN(this._x0) ? void 0 : [[this._x0, this._y0], [this._x1, this._y1]];
}
//#endregion
//#region node_modules/d3-quadtree/src/quad.js
function Ea(e, t, n, r, i) {
	this.node = e, this.x0 = t, this.y0 = n, this.x1 = r, this.y1 = i;
}
//#endregion
//#region node_modules/d3-quadtree/src/find.js
function Da(e, t, n) {
	var r, i = this._x0, a = this._y0, o, s, c, l, u = this._x1, d = this._y1, f = [], p = this._root, m, h;
	for (p && f.push(new Ea(p, i, a, u, d)), n == null ? n = Infinity : (i = e - n, a = t - n, u = e + n, d = t + n, n *= n); m = f.pop();) if (!(!(p = m.node) || (o = m.x0) > u || (s = m.y0) > d || (c = m.x1) < i || (l = m.y1) < a)) if (p.length) {
		var g = (o + c) / 2, _ = (s + l) / 2;
		f.push(new Ea(p[3], g, _, c, l), new Ea(p[2], o, _, g, l), new Ea(p[1], g, s, c, _), new Ea(p[0], o, s, g, _)), (h = (t >= _) << 1 | e >= g) && (m = f[f.length - 1], f[f.length - 1] = f[f.length - 1 - h], f[f.length - 1 - h] = m);
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
function Oa(e) {
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
function ka(e) {
	for (var t = 0, n = e.length; t < n; ++t) this.remove(e[t]);
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/root.js
function Aa() {
	return this._root;
}
//#endregion
//#region node_modules/d3-quadtree/src/size.js
function ja() {
	var e = 0;
	return this.visit(function(t) {
		if (!t.length) do
			++e;
		while (t = t.next);
	}), e;
}
//#endregion
//#region node_modules/d3-quadtree/src/visit.js
function Ma(e) {
	var t = [], n, r = this._root, i, a, o, s, c;
	for (r && t.push(new Ea(r, this._x0, this._y0, this._x1, this._y1)); n = t.pop();) if (!e(r = n.node, a = n.x0, o = n.y0, s = n.x1, c = n.y1) && r.length) {
		var l = (a + s) / 2, u = (o + c) / 2;
		(i = r[3]) && t.push(new Ea(i, l, u, s, c)), (i = r[2]) && t.push(new Ea(i, a, u, l, c)), (i = r[1]) && t.push(new Ea(i, l, o, s, u)), (i = r[0]) && t.push(new Ea(i, a, o, l, u));
	}
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/visitAfter.js
function Na(e) {
	var t = [], n = [], r;
	for (this._root && t.push(new Ea(this._root, this._x0, this._y0, this._x1, this._y1)); r = t.pop();) {
		var i = r.node;
		if (i.length) {
			var a, o = r.x0, s = r.y0, c = r.x1, l = r.y1, u = (o + c) / 2, d = (s + l) / 2;
			(a = i[0]) && t.push(new Ea(a, o, s, u, d)), (a = i[1]) && t.push(new Ea(a, u, s, c, d)), (a = i[2]) && t.push(new Ea(a, o, d, u, l)), (a = i[3]) && t.push(new Ea(a, u, d, c, l));
		}
		n.push(r);
	}
	for (; r = n.pop();) e(r.node, r.x0, r.y0, r.x1, r.y1);
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/x.js
function Pa(e) {
	return e[0];
}
function Fa(e) {
	return arguments.length ? (this._x = e, this) : this._x;
}
//#endregion
//#region node_modules/d3-quadtree/src/y.js
function Ia(e) {
	return e[1];
}
function La(e) {
	return arguments.length ? (this._y = e, this) : this._y;
}
//#endregion
//#region node_modules/d3-quadtree/src/quadtree.js
function Ra(e, t, n) {
	var r = new za(t ?? Pa, n ?? Ia, NaN, NaN, NaN, NaN);
	return e == null ? r : r.addAll(e);
}
function za(e, t, n, r, i, a) {
	this._x = e, this._y = t, this._x0 = n, this._y0 = r, this._x1 = i, this._y1 = a, this._root = void 0;
}
function Ba(e) {
	for (var t = { data: e.data }, n = t; e = e.next;) n = n.next = { data: e.data };
	return t;
}
var Va = Ra.prototype = za.prototype;
Va.copy = function() {
	var e = new za(this._x, this._y, this._x0, this._y0, this._x1, this._y1), t = this._root, n, r;
	if (!t) return e;
	if (!t.length) return e._root = Ba(t), e;
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
	}) : t.target[i] = Ba(r));
	return e;
}, Va.add = ba, Va.addAll = Sa, Va.cover = Ca, Va.data = wa, Va.extent = Ta, Va.find = Da, Va.remove = Oa, Va.removeAll = ka, Va.root = Aa, Va.size = ja, Va.visit = Ma, Va.visitAfter = Na, Va.x = Fa, Va.y = La;
//#endregion
//#region node_modules/d3-force/src/constant.js
function Ha(e) {
	return function() {
		return e;
	};
}
//#endregion
//#region node_modules/d3-force/src/jiggle.js
function Ua(e) {
	return (e() - .5) * 1e-6;
}
//#endregion
//#region node_modules/d3-force/src/collide.js
function Wa(e) {
	return e.x + e.vx;
}
function Ga(e) {
	return e.y + e.vy;
}
function Ka(e) {
	var t, n, r, i = 1, a = 1;
	typeof e != "function" && (e = Ha(e == null ? 1 : +e));
	function o() {
		for (var e, o = t.length, c, l, u, d, f, p, m = 0; m < a; ++m) for (c = Ra(t, Wa, Ga).visitAfter(s), e = 0; e < o; ++e) l = t[e], f = n[l.index], p = f * f, u = l.x + l.vx, d = l.y + l.vy, c.visit(h);
		function h(e, t, n, a, o) {
			var s = e.data, c = e.r, m = f + c;
			if (s) {
				if (s.index > l.index) {
					var h = u - s.x - s.vx, g = d - s.y - s.vy, _ = h * h + g * g;
					_ < m * m && (h === 0 && (h = Ua(r), _ += h * h), g === 0 && (g = Ua(r), _ += g * g), _ = (m - (_ = Math.sqrt(_))) / _ * i, l.vx += (h *= _) * (m = (c *= c) / (p + c)), l.vy += (g *= _) * m, s.vx -= h * (m = 1 - m), s.vy -= g * m);
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
		return arguments.length ? (e = typeof t == "function" ? t : Ha(+t), c(), o) : e;
	}, o;
}
//#endregion
//#region node_modules/d3-force/src/link.js
function qa(e) {
	return e.index;
}
function Ja(e, t) {
	var n = e.get(t);
	if (!n) throw Error("node not found: " + t);
	return n;
}
function Ya(e) {
	var t = qa, n = d, r, i = Ha(30), a, o, s, c, l, u = 1;
	e ??= [];
	function d(e) {
		return 1 / Math.min(s[e.source.index], s[e.target.index]);
	}
	function f(t) {
		for (var n = 0, i = e.length; n < u; ++n) for (var o = 0, s, d, f, p, m, h, g; o < i; ++o) s = e[o], d = s.source, f = s.target, p = f.x + f.vx - d.x - d.vx || Ua(l), m = f.y + f.vy - d.y - d.vy || Ua(l), h = Math.sqrt(p * p + m * m), h = (h - a[o]) / h * t * r[o], p *= h, m *= h, f.vx -= p * (g = c[o]), f.vy -= m * g, d.vx += p * (g = 1 - g), d.vy += m * g;
	}
	function p() {
		if (o) {
			var n, i = o.length, l = e.length, u = new Map(o.map((e, n) => [t(e, n, o), e])), d;
			for (n = 0, s = Array(i); n < l; ++n) d = e[n], d.index = n, typeof d.source != "object" && (d.source = Ja(u, d.source)), typeof d.target != "object" && (d.target = Ja(u, d.target)), s[d.source.index] = (s[d.source.index] || 0) + 1, s[d.target.index] = (s[d.target.index] || 0) + 1;
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
		return arguments.length ? (n = typeof e == "function" ? e : Ha(+e), m(), f) : n;
	}, f.distance = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : Ha(+e), h(), f) : i;
	}, f;
}
//#endregion
//#region node_modules/d3-force/src/lcg.js
var Xa = 1664525, Za = 1013904223, Qa = 4294967296;
function $a() {
	let e = 1;
	return () => (e = (Xa * e + Za) % Qa) / Qa;
}
//#endregion
//#region node_modules/d3-force/src/simulation.js
function eo(e) {
	return e.x;
}
function to(e) {
	return e.y;
}
var no = 10, ro = Math.PI * (3 - Math.sqrt(5));
function io(e) {
	var t, n = 1, r = .001, i = 1 - r ** (1 / 300), a = 0, o = .6, s = /* @__PURE__ */ new Map(), c = Pr(d), l = C("tick", "end"), u = $a();
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
				var i = no * Math.sqrt(.5 + t), a = t * ro;
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
function ao() {
	var e, t, n, r, i = Ha(-30), a, o = 1, s = Infinity, c = .81;
	function l(n) {
		var i, a = e.length, o = Ra(e, eo, to).visitAfter(d);
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
		if (p * p / c < m) return m < s && (d === 0 && (d = Ua(n), m += d * d), f === 0 && (f = Ua(n), m += f * f), m < o && (m = Math.sqrt(o * m)), t.vx += d * e.value * r / m, t.vy += f * e.value * r / m), !0;
		if (!(e.length || m >= s)) {
			(e.data !== t || e.next) && (d === 0 && (d = Ua(n), m += d * d), f === 0 && (f = Ua(n), m += f * f), m < o && (m = Math.sqrt(o * m)));
			do
				e.data !== t && (p = a[e.data.index] * r / m, t.vx += d * p, t.vy += f * p);
			while (e = e.next);
		}
	}
	return l.initialize = function(t, r) {
		e = t, n = r, u();
	}, l.strength = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : Ha(+e), u(), l) : i;
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
function oo(e) {
	for (var t = -1, n = e.length, r = 0, i = 0, a, o = e[n - 1], s, c = 0; ++t < n;) a = o, o = e[t], c += s = a[0] * o[1] - o[0] * a[1], r += (a[0] + o[0]) * s, i += (a[1] + o[1]) * s;
	return c *= 3, [r / c, i / c];
}
//#endregion
//#region node_modules/d3-polygon/src/cross.js
function so(e, t, n) {
	return (t[0] - e[0]) * (n[1] - e[1]) - (t[1] - e[1]) * (n[0] - e[0]);
}
//#endregion
//#region node_modules/d3-polygon/src/hull.js
function co(e, t) {
	return e[0] - t[0] || e[1] - t[1];
}
function lo(e) {
	let t = e.length, n = [0, 1], r = 2, i;
	for (i = 2; i < t; ++i) {
		for (; r > 1 && so(e[n[r - 2]], e[n[r - 1]], e[i]) <= 0;) --r;
		n[r++] = i;
	}
	return n.slice(0, r);
}
function uo(e) {
	if ((n = e.length) < 3) return null;
	var t, n, r = Array(n), i = Array(n);
	for (t = 0; t < n; ++t) r[t] = [
		+e[t][0],
		+e[t][1],
		t
	];
	for (r.sort(co), t = 0; t < n; ++t) i[t] = [r[t][0], -r[t][1]];
	var a = lo(r), o = lo(i), s = o[0] === a[0], c = o[o.length - 1] === a[a.length - 1], l = [];
	for (t = a.length - 1; t >= 0; --t) l.push(e[r[a[t]][2]]);
	for (t = +s; t < o.length - c; ++t) l.push(e[r[o[t]][2]]);
	return l;
}
//#endregion
//#region node_modules/d3-shape/src/constant.js
function fo(e) {
	return function() {
		return e;
	};
}
var V = Math.PI;
V / 2, 2 * V;
//#endregion
//#region node_modules/d3-shape/src/path.js
function po(e) {
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
	}, () => new _a(t);
}
Array.prototype.slice;
function mo(e) {
	return typeof e == "object" && "length" in e ? e : Array.from(e);
}
//#endregion
//#region node_modules/d3-shape/src/curve/linear.js
function ho(e) {
	this._context = e;
}
ho.prototype = {
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
function go(e) {
	return new ho(e);
}
//#endregion
//#region node_modules/d3-shape/src/point.js
function _o(e) {
	return e[0];
}
function vo(e) {
	return e[1];
}
//#endregion
//#region node_modules/d3-shape/src/line.js
function yo(e, t) {
	var n = fo(!0), r = null, i = go, a = null, o = po(s);
	e = typeof e == "function" ? e : e === void 0 ? _o : fo(e), t = typeof t == "function" ? t : t === void 0 ? vo : fo(t);
	function s(s) {
		var c, l = (s = mo(s)).length, u, d = !1, f;
		for (r ?? (a = i(f = o())), c = 0; c <= l; ++c) !(c < l && n(u = s[c], c, s)) === d && ((d = !d) ? a.lineStart() : a.lineEnd()), d && a.point(+e(u, c, s), +t(u, c, s));
		if (f) return a = null, f + "" || null;
	}
	return s.x = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : fo(+t), s) : e;
	}, s.y = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : fo(+e), s) : t;
	}, s.defined = function(e) {
		return arguments.length ? (n = typeof e == "function" ? e : fo(!!e), s) : n;
	}, s.curve = function(e) {
		return arguments.length ? (i = e, r != null && (a = i(r)), s) : i;
	}, s.context = function(e) {
		return arguments.length ? (e == null ? r = a = null : a = i(r = e), s) : r;
	}, s;
}
//#endregion
//#region node_modules/d3-shape/src/noop.js
function bo() {}
//#endregion
//#region node_modules/d3-shape/src/curve/basis.js
function xo(e, t, n) {
	e._context.bezierCurveTo((2 * e._x0 + e._x1) / 3, (2 * e._y0 + e._y1) / 3, (e._x0 + 2 * e._x1) / 3, (e._y0 + 2 * e._y1) / 3, (e._x0 + 4 * e._x1 + t) / 6, (e._y0 + 4 * e._y1 + n) / 6);
}
function So(e) {
	this._context = e;
}
So.prototype = {
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
			case 3: xo(this, this._x1, this._y1);
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
				xo(this, e, t);
				break;
		}
		this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
	}
};
//#endregion
//#region node_modules/d3-shape/src/curve/basisClosed.js
function Co(e) {
	this._context = e;
}
Co.prototype = {
	areaStart: bo,
	areaEnd: bo,
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
				xo(this, e, t);
				break;
		}
		this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
	}
};
function wo(e) {
	return new Co(e);
}
//#endregion
//#region node_modules/d3-shape/src/curve/cardinal.js
function To(e, t, n) {
	e._context.bezierCurveTo(e._x1 + e._k * (e._x2 - e._x0), e._y1 + e._k * (e._y2 - e._y0), e._x2 + e._k * (e._x1 - t), e._y2 + e._k * (e._y1 - n), e._x2, e._y2);
}
function Eo(e, t) {
	this._context = e, this._k = (1 - t) / 6;
}
Eo.prototype = {
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
				To(this, this._x1, this._y1);
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
				To(this, e, t);
				break;
		}
		this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
}, (function e(t) {
	function n(e) {
		return new Eo(e, t);
	}
	return n.tension = function(t) {
		return e(+t);
	}, n;
})(0);
//#endregion
//#region node_modules/d3-shape/src/curve/cardinalClosed.js
function Do(e, t) {
	this._context = e, this._k = (1 - t) / 6;
}
Do.prototype = {
	areaStart: bo,
	areaEnd: bo,
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
				To(this, e, t);
				break;
		}
		this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
}, (function e(t) {
	function n(e) {
		return new Do(e, t);
	}
	return n.tension = function(t) {
		return e(+t);
	}, n;
})(0);
//#endregion
//#region node_modules/d3-shape/src/curve/catmullRom.js
function Oo(e, t, n) {
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
function ko(e, t) {
	this._context = e, this._alpha = t;
}
ko.prototype = {
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
				Oo(this, e, t);
				break;
		}
		this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
}, (function e(t) {
	function n(e) {
		return t ? new ko(e, t) : new Eo(e, 0);
	}
	return n.alpha = function(t) {
		return e(+t);
	}, n;
})(.5);
//#endregion
//#region node_modules/d3-shape/src/curve/catmullRomClosed.js
function Ao(e, t) {
	this._context = e, this._alpha = t;
}
Ao.prototype = {
	areaStart: bo,
	areaEnd: bo,
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
				Oo(this, e, t);
				break;
		}
		this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
	}
};
var jo = (function e(t) {
	function n(e) {
		return t ? new Ao(e, t) : new Do(e, 0);
	}
	return n.alpha = function(t) {
		return e(+t);
	}, n;
})(.5), Mo = (e) => () => e;
//#endregion
//#region node_modules/d3-zoom/src/event.js
function No(e, { sourceEvent: t, target: n, transform: r, dispatch: i }) {
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
function Po(e, t, n) {
	this.k = e, this.x = t, this.y = n;
}
Po.prototype = {
	constructor: Po,
	scale: function(e) {
		return e === 1 ? this : new Po(this.k * e, this.x, this.y);
	},
	translate: function(e, t) {
		return e === 0 & t === 0 ? this : new Po(this.k, this.x + this.k * e, this.y + this.k * t);
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
var Fo = new Po(1, 0, 0);
Io.prototype = Po.prototype;
function Io(e) {
	for (; !e.__zoom;) if (!(e = e.parentNode)) return Fo;
	return e.__zoom;
}
//#endregion
//#region node_modules/d3-zoom/src/noevent.js
function Lo(e) {
	e.stopImmediatePropagation();
}
function Ro(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region node_modules/d3-zoom/src/zoom.js
function zo(e) {
	return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function Bo() {
	var e = this;
	return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function Vo() {
	return this.__zoom || Fo;
}
function Ho(e) {
	return -e.deltaY * (e.deltaMode === 1 ? .05 : e.deltaMode ? 1 : .002) * (e.ctrlKey ? 10 : 1);
}
function Uo() {
	return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Wo(e, t, n) {
	var r = e.invertX(t[0][0]) - n[0][0], i = e.invertX(t[1][0]) - n[1][0], a = e.invertY(t[0][1]) - n[0][1], o = e.invertY(t[1][1]) - n[1][1];
	return e.translate(i > r ? (r + i) / 2 : Math.min(0, r) || Math.max(0, i), o > a ? (a + o) / 2 : Math.min(0, a) || Math.max(0, o));
}
function Go() {
	var e = zo, t = Bo, n = Wo, r = Ho, i = Uo, a = [0, Infinity], o = [[-Infinity, -Infinity], [Infinity, Infinity]], s = 250, c = yr, l = C("start", "zoom", "end"), u, d, f, p = 500, m = 150, h = 0, g = 10;
	function _(e) {
		e.property("__zoom", Vo).on("wheel.zoom", T, { passive: !1 }).on("mousedown.zoom", E).on("dblclick.zoom", D).filter(i).on("touchstart.zoom", O).on("touchmove.zoom", k).on("touchend.zoom touchcancel.zoom", A).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	}
	_.transform = function(e, t, n, r) {
		var i = e.selection ? e.selection() : e;
		i.property("__zoom", Vo), e === i ? i.interrupt().each(function() {
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
			return n(Fo.translate(c[0], c[1]).scale(s.k).translate(typeof r == "function" ? -r.apply(this, arguments) : -r, typeof i == "function" ? -i.apply(this, arguments) : -i), e, o);
		}, a, s);
	};
	function v(e, t) {
		return t = Math.max(a[0], Math.min(a[1], t)), t === e.k ? e : new Po(t, e.x, e.y);
	}
	function y(e, t, n) {
		var r = t[0] - n[0] * e.k, i = t[1] - n[1] * e.k;
		return r === e.x && i === e.y ? e : new Po(e.k, r, i);
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
					e = new Po(n, l[0] - t[0] * n, l[1] - t[1] * n);
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
			var t = Vt(this.that).datum();
			l.call(e, this.that, new No(e, {
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
		var s = S(this, i).event(t), c = this.__zoom, l = Math.max(a[0], Math.min(a[1], c.k * 2 ** r.apply(this, arguments))), u = Ut(t);
		if (s.wheel) (s.mouse[0][0] !== u[0] || s.mouse[0][1] !== u[1]) && (s.mouse[1] = c.invert(s.mouse[0] = u)), clearTimeout(s.wheel);
		else if (c.k === l) return;
		else s.mouse = [u, c.invert(u)], Yr(this), s.start();
		Ro(t), s.wheel = setTimeout(d, m), s.zoom("mouse", n(y(v(c, l), s.mouse[0], s.mouse[1]), s.extent, o));
		function d() {
			s.wheel = null, s.end();
		}
	}
	function E(t, ...r) {
		if (f || !e.apply(this, arguments)) return;
		var i = t.currentTarget, a = S(this, r, !0).event(t), s = Vt(t.view).on("mousemove.zoom", d, !0).on("mouseup.zoom", p, !0), c = Ut(t, i), l = t.clientX, u = t.clientY;
		Jt(t.view), Lo(t), a.mouse = [c, this.__zoom.invert(c)], Yr(this), a.start();
		function d(e) {
			if (Ro(e), !a.moved) {
				var t = e.clientX - l, r = e.clientY - u;
				a.moved = t * t + r * r > h;
			}
			a.event(e).zoom("mouse", n(y(a.that.__zoom, a.mouse[0] = Ut(e, i), a.mouse[1]), a.extent, o));
		}
		function p(e) {
			s.on("mousemove.zoom mouseup.zoom", null), Yt(e.view, a.moved), Ro(e), a.event(e).end();
		}
	}
	function D(r, ...i) {
		if (e.apply(this, arguments)) {
			var a = this.__zoom, c = Ut(r.changedTouches ? r.changedTouches[0] : r, this), l = a.invert(c), u = a.k * (r.shiftKey ? .5 : 2), d = n(y(v(a, u), c, l), t.apply(this, i), o);
			Ro(r), s > 0 ? Vt(this).transition().duration(s).call(x, d, c, r) : Vt(this).call(_.transform, d, c, r);
		}
	}
	function O(t, ...n) {
		if (e.apply(this, arguments)) {
			var r = t.touches, i = r.length, a = S(this, n, t.changedTouches.length === i).event(t), o, s, c, l;
			for (Lo(t), s = 0; s < i; ++s) c = r[s], l = Ut(c, this), l = [
				l,
				this.__zoom.invert(l),
				c.identifier
			], a.touch0 ? !a.touch1 && a.touch0[2] !== l[2] && (a.touch1 = l, a.taps = 0) : (a.touch0 = l, o = !0, a.taps = 1 + !!u);
			u &&= clearTimeout(u), o && (a.taps < 2 && (d = l[0], u = setTimeout(function() {
				u = null;
			}, p)), Yr(this), a.start());
		}
	}
	function k(e, ...t) {
		if (this.__zooming) {
			var r = S(this, t).event(e), i = e.changedTouches, a = i.length, s, c, l, u;
			for (Ro(e), s = 0; s < a; ++s) c = i[s], l = Ut(c, this), r.touch0 && r.touch0[2] === c.identifier ? r.touch0[0] = l : r.touch1 && r.touch1[2] === c.identifier && (r.touch1[0] = l);
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
			var n = S(this, t).event(e), r = e.changedTouches, i = r.length, a, o;
			for (Lo(e), f && clearTimeout(f), f = setTimeout(function() {
				f = null;
			}, p), a = 0; a < i; ++a) o = r[a], n.touch0 && n.touch0[2] === o.identifier ? delete n.touch0 : n.touch1 && n.touch1[2] === o.identifier && delete n.touch1;
			if (n.touch1 && !n.touch0 && (n.touch0 = n.touch1, delete n.touch1), n.touch0) n.touch0[1] = this.__zoom.invert(n.touch0[0]);
			else if (n.end(), n.taps === 2 && (o = Ut(o, this), Math.hypot(d[0] - o[0], d[1] - o[1]) < g)) {
				var s = Vt(this).on("dblclick.zoom");
				s && s.apply(this, arguments);
			}
		}
	}
	return _.wheelDelta = function(e) {
		return arguments.length ? (r = typeof e == "function" ? e : Mo(+e), _) : r;
	}, _.filter = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : Mo(!!t), _) : e;
	}, _.touchable = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : Mo(!!e), _) : i;
	}, _.extent = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : Mo([[+e[0][0], +e[0][1]], [+e[1][0], +e[1][1]]]), _) : t;
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
var Ko = {
	graphContainer: "_graphContainer_1852r_3",
	flowSingleDot: "_flowSingleDot_1852r_1"
}, qo = /* @__PURE__ */ o(((e, t) => {
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
})), Jo = /* @__PURE__ */ o(((e, t) => {
	var { hashString: n, rng: r } = qo(), i = (e) => (Math.round(e * 10) / 10).toString();
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
})), Yo = /* @__PURE__ */ o(((e) => {
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
})), Xo = /* @__PURE__ */ o(((e, t) => {
	t.exports = Yo();
})), Zo = Jo(), H = Xo(), U = {
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
}, Qo = {
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
}, $o = 140, es = 80, ts = 700, ns = 700;
function rs({ width: e, height: t, zoomScale: n = 1, onResize: r, onResizeEnd: i }) {
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
			t.includes("e") && (d = a + l), t.includes("w") && (d = a - l), t.includes("s") && (f = o + u), t.includes("n") && (f = o - u), d = Math.max($o, Math.min(ts, Math.round(d))), f = Math.max(es, Math.min(ns, Math.round(f))), r && r({
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
	}, []), /* @__PURE__ */ (0, H.jsxs)("div", {
		className: a ? Qo.resizing : void 0,
		children: [
			/* @__PURE__ */ (0, H.jsx)("div", {
				className: `${Qo.handle} ${Qo.handleN}`,
				onPointerDown: (e) => c("n", e),
				title: "Drag to resize height"
			}),
			/* @__PURE__ */ (0, H.jsx)("div", {
				className: `${Qo.handle} ${Qo.handleS}`,
				onPointerDown: (e) => c("s", e),
				title: "Drag to resize height"
			}),
			/* @__PURE__ */ (0, H.jsx)("div", {
				className: `${Qo.handle} ${Qo.handleW}`,
				onPointerDown: (e) => c("w", e),
				title: "Drag to resize width"
			}),
			/* @__PURE__ */ (0, H.jsx)("div", {
				className: `${Qo.handle} ${Qo.handleE}`,
				onPointerDown: (e) => c("e", e),
				title: "Drag to resize width"
			}),
			/* @__PURE__ */ (0, H.jsx)("div", {
				className: `${Qo.handle} ${Qo.handleNW}`,
				onPointerDown: (e) => c("nw", e),
				title: "Drag to resize"
			}),
			/* @__PURE__ */ (0, H.jsx)("div", {
				className: `${Qo.handle} ${Qo.handleNE}`,
				onPointerDown: (e) => c("ne", e),
				title: "Drag to resize"
			}),
			/* @__PURE__ */ (0, H.jsx)("div", {
				className: `${Qo.handle} ${Qo.handleSW}`,
				onPointerDown: (e) => c("sw", e),
				title: "Drag to resize"
			}),
			/* @__PURE__ */ (0, H.jsx)("div", {
				className: `${Qo.handle} ${Qo.handleSE}`,
				onPointerDown: (e) => c("se", e),
				title: "Drag to resize"
			})
		]
	});
}
//#endregion
//#region src/components/NodeView/TextView/TextView.jsx
var is = (/* @__PURE__ */ o(((e, t) => {
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
})))(), as = /* @__PURE__ */ new Map();
function os(e, t, n, r) {
	let i = `${e}|${Math.round(t)}|${Math.round(n)}|${r}`, a = as.get(i);
	return a || (as.size > 400 && as.clear(), a = (0, Zo.roughRect)(t, n, r, e), as.set(i, a)), a;
}
function ss({ article: e, width: t, height: n, viewState: r, fullContent: i, onResize: a, cardSettings: o, sourceColor: s }) {
	let { hovered: c = !1, pinned: l = !1, lod: u = "full", zoomScale: d = 1 } = r || {}, f = c || l, p = l && !!i, m = !(e._status === "published" || e._status === "bloomed" || e.syndication && e.syndication.canonical), h = e.containerColor || s || e._source && e._source.color || (m ? "var(--nv-draft)" : "var(--nv-published)"), g = r?.contributionCount || 0, _ = r?.bookmarkCount ?? (Array.isArray(r?.bookmarks) ? r.bookmarks.length : Array.isArray(e?.bookmarks) ? e.bookmarks.length : 0);
	if (e.kind === "image" && e.image) return /* @__PURE__ */ (0, H.jsx)(fs, {
		article: e,
		width: t,
		height: n,
		pinned: l,
		hovered: c,
		isDraft: m,
		zoomScale: d,
		bookmarkCount: _,
		onResize: a
	});
	let v = (e._source && e._source.prominence || e.originalItem && e.originalItem._source && e.originalItem._source.prominence || "secondary") === "primary" ? m ? "#24304a" : "#1e3a5f" : "#23232f";
	if (e.kind === "link" && e.link) return /* @__PURE__ */ (0, H.jsx)(ds, {
		article: e,
		width: t,
		height: n,
		viewState: r,
		cardSettings: o,
		sourceColor: h,
		isDraft: m,
		bgColor: v
	});
	let y = !!e.image, b = r && r.progress, x = b ? Math.max(0, Math.min(1, b.max || 0)) : 0, S = !!(b && b.done), C = [
		U.card,
		S && U.complete,
		h && !l && U.glow,
		m ? U.draft : U.published,
		f && U.expanded,
		l && U.pinned,
		r.lod === "marker" && !f && U.marker
	].filter(Boolean).join(" "), w = r.lod !== "marker", T = o?.cornerRadius == null ? 10 : o.cornerRadius, E = r.lod === "marker" && !f || !t || !n ? null : os(e.id || e.title || "", t, n, T);
	return /* @__PURE__ */ (0, H.jsxs)("div", {
		className: C,
		"data-pp-card": !0,
		style: {
			width: t,
			height: n,
			background: v,
			...o?.cornerRadius != null && !(r.lod === "marker" && !f) ? { borderRadius: o.cornerRadius } : {},
			...h && !l ? { "--nv-src": h } : {},
			...h && !l && e.containerColor ? { "--nv-outline": `var(--pp-node-color, ${h})` } : {}
		},
		children: [
			E && /* @__PURE__ */ (0, H.jsxs)("svg", {
				className: U.sketchBorder,
				viewBox: `0 0 ${t} ${n}`,
				preserveAspectRatio: "none",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ (0, H.jsx)("path", {
					className: U.sketchGhost,
					d: E.ghost
				}), /* @__PURE__ */ (0, H.jsx)("path", {
					className: U.sketchMain,
					d: E.main
				})]
			}),
			_ > 0 && /* @__PURE__ */ (0, H.jsxs)("div", {
				className: U.bookmarkMark,
				title: _ === 1 ? "1 bookmark" : `${_} bookmarks`,
				children: [/* @__PURE__ */ (0, H.jsx)("svg", {
					viewBox: "0 0 16 16",
					width: "12",
					height: "12",
					fill: "currentColor",
					children: /* @__PURE__ */ (0, H.jsx)("path", { d: "M3 2v12l5-3 5 3V2z" })
				}), _ > 1 && /* @__PURE__ */ (0, H.jsx)("span", {
					className: U.bookmarkCount,
					children: _
				})]
			}),
			g > 0 && w && /* @__PURE__ */ (0, H.jsxs)("div", {
				className: U.readersMark,
				title: g === 1 ? "1 from readers" : `${g} from readers`,
				"aria-label": g === 1 ? "1 from readers" : `${g} from readers`,
				"data-contrib-count": g,
				children: [/* @__PURE__ */ (0, H.jsx)("svg", {
					viewBox: "0 0 16 16",
					width: "11",
					height: "11",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "1.6",
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, H.jsx)("path", {
						d: "M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2z",
						strokeLinejoin: "round"
					})
				}), /* @__PURE__ */ (0, H.jsx)("span", { children: g })]
			}),
			y && /* @__PURE__ */ (0, H.jsx)("div", {
				className: U.imageMark,
				style: {
					backgroundImage: `url('${e.image}')`,
					...o?.imageMarkSize ? {
						width: o.imageMarkSize,
						height: o.imageMarkSize
					} : {}
				},
				title: "has an image"
			}),
			/* @__PURE__ */ (0, H.jsx)(us, {
				article: e,
				width: t,
				height: n - 0,
				bandHeight: 0,
				viewState: r,
				expanded: f,
				useFullArticle: p,
				fullContent: i,
				cardSettings: o
			}),
			w && (x > 0 || S) && /* @__PURE__ */ (0, H.jsx)("div", {
				className: U.readBar,
				role: "progressbar",
				"aria-label": "Read",
				"aria-valuemin": 0,
				"aria-valuemax": 100,
				"aria-valuenow": Math.round((S ? 1 : x) * 100),
				"data-read-progress": S ? "done" : Math.round(x * 100),
				children: /* @__PURE__ */ (0, H.jsx)("div", {
					className: U.readFill,
					style: { width: `${(S ? 1 : x) * 100}%` }
				})
			}),
			w && S && /* @__PURE__ */ (0, H.jsx)("div", {
				className: U.readMark,
				title: "Read to the end",
				"aria-hidden": "true",
				children: "✓"
			}),
			l && /* @__PURE__ */ (0, H.jsx)(ps, {}),
			w && a && /* @__PURE__ */ (0, H.jsx)(rs, {
				width: t,
				height: n,
				zoomScale: d,
				onResize: a
			})
		]
	});
}
function cs(e, t, n, r = {}) {
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
var ls = 260;
function us({ article: e, width: t, height: n, bandHeight: r = 0, viewState: i, expanded: a, useFullArticle: o, fullContent: s, cardSettings: c }) {
	if (a) {
		let t = o ? s : e.description || "", r = e.title || e.label;
		return n && n < ls ? /* @__PURE__ */ (0, H.jsxs)("div", {
			className: `${U.scroll} ${U.scrollFull} ${o ? U.full : ""} rp-scroll`,
			children: [/* @__PURE__ */ (0, H.jsx)("div", {
				className: U.titleScrolling,
				"data-card-title": !0,
				children: r
			}), t && /* @__PURE__ */ (0, H.jsx)("div", { dangerouslySetInnerHTML: { __html: t } })]
		}) : /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [/* @__PURE__ */ (0, H.jsx)("div", {
			className: U.title,
			"data-card-title": !0,
			children: r
		}), t && /* @__PURE__ */ (0, H.jsx)("div", {
			className: `${U.scroll} ${o ? U.full : ""} rp-scroll`,
			dangerouslySetInnerHTML: { __html: t }
		})] });
	}
	if (i.lod === "marker") return null;
	let l = c?.subtitle || typeof window < "u" && window.SETTINGS?.graph?.card?.subtitle, u = null;
	if (l && e.series_part != null && e.series_part !== "") {
		let t = e.series_part, n = (0, is.numberToLowercaseWords)(t);
		u = l.replace(/\{n\}/g, String(t)).replace(/\{n_words\}/g, n);
	}
	let d = i.lod === "slug" ? e.label || e.labelMedium || e.title || "" : e.title || e.label, f = cs(d, t, u ? n - 30 : n, {
		min: c?.labelMinFontSize ?? 14,
		max: c?.labelMaxFontSize ?? 26,
		lineHeight: 1.05,
		pad: 8
	}), p = Math.max(11, Math.round(f * .62));
	return /* @__PURE__ */ (0, H.jsxs)("div", {
		className: U.cardCenter,
		children: [/* @__PURE__ */ (0, H.jsx)("div", {
			className: U.cardTitle,
			style: { fontSize: `${f}px` },
			"data-card-title": !0,
			children: d
		}), u && /* @__PURE__ */ (0, H.jsx)("div", {
			className: U.cardSubtitle,
			style: { fontSize: `${p}px` },
			children: u
		})]
	});
}
function ds({ article: e, width: t, height: n, viewState: r, cardSettings: i, sourceColor: a, isDraft: o, bgColor: s }) {
	let c = r.lod === "marker" && !r.hovered && !r.pinned, l = i?.cornerRadius == null ? 10 : i.cornerRadius, u = c || !t || !n ? null : os(e.id || e.title || "", t, n, l), d = e.title || e.label || "", f = e.description || "", p = e.subtitle || "", m = cs(d, t, Math.max(30, (n || 0) * (f ? .42 : .8)), {
		min: Math.min(13, i?.labelMinFontSize ?? 13),
		max: Math.min(20, i?.labelMaxFontSize ?? 20),
		lineHeight: 1.1,
		pad: 8
	});
	return /* @__PURE__ */ (0, H.jsxs)("div", {
		className: [
			U.card,
			o ? U.draft : U.published,
			U.linkCard,
			a && U.glow,
			r.hovered && U.linkHover,
			c && U.marker
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
		children: [u && /* @__PURE__ */ (0, H.jsxs)("svg", {
			className: U.sketchBorder,
			viewBox: `0 0 ${t} ${n}`,
			preserveAspectRatio: "none",
			"aria-hidden": "true",
			children: [/* @__PURE__ */ (0, H.jsx)("path", {
				className: U.sketchGhost,
				d: u.ghost
			}), /* @__PURE__ */ (0, H.jsx)("path", {
				className: U.sketchMain,
				d: u.main
			})]
		}), !c && /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [
			/* @__PURE__ */ (0, H.jsx)("div", {
				className: U.linkTitle,
				style: { fontSize: `${m}px` },
				"data-link-title": !0,
				children: d
			}),
			p && /* @__PURE__ */ (0, H.jsx)("div", {
				className: U.linkSubtitle,
				"data-link-subtitle": !0,
				children: p
			}),
			f && /* @__PURE__ */ (0, H.jsx)("div", {
				className: U.linkBlurb,
				"data-link-blurb": !0,
				children: f
			}),
			/* @__PURE__ */ (0, H.jsx)("span", {
				className: U.linkOut,
				"data-link-out": !0,
				"aria-hidden": "true",
				children: "↗"
			})
		] })]
	});
}
function fs({ article: e, width: t, height: n, pinned: r, hovered: i, isDraft: a, zoomScale: o, bookmarkCount: s = 0, onResize: c }) {
	let l = [
		U.imageCard,
		a ? U.draft : U.published,
		r && U.pinned
	].filter(Boolean).join(" "), u = n - 24;
	return /* @__PURE__ */ (0, H.jsxs)("div", {
		className: l,
		style: {
			width: t,
			height: n
		},
		children: [
			s > 0 && /* @__PURE__ */ (0, H.jsxs)("div", {
				className: U.bookmarkMark,
				title: s === 1 ? "1 bookmark" : `${s} bookmarks`,
				children: [/* @__PURE__ */ (0, H.jsx)("svg", {
					viewBox: "0 0 16 16",
					width: "12",
					height: "12",
					fill: "currentColor",
					children: /* @__PURE__ */ (0, H.jsx)("path", { d: "M3 2v12l5-3 5 3V2z" })
				}), s > 1 && /* @__PURE__ */ (0, H.jsx)("span", {
					className: U.bookmarkCount,
					children: s
				})]
			}),
			/* @__PURE__ */ (0, H.jsx)("div", {
				className: U.imageFrame,
				style: {
					width: t,
					height: u,
					backgroundImage: `url('${e.image}')`
				}
			}),
			/* @__PURE__ */ (0, H.jsx)("div", {
				className: U.imageCaption,
				"data-card-title": !0,
				children: e.short_title || e.title || e.label
			}),
			r && /* @__PURE__ */ (0, H.jsx)(ps, {}),
			c && /* @__PURE__ */ (0, H.jsx)(rs, {
				width: t,
				height: n,
				zoomScale: o,
				onResize: c
			})
		]
	});
}
function ps() {
	return /* @__PURE__ */ (0, H.jsx)("div", {
		"data-popout": "1",
		title: "Open in reader",
		className: U.popout,
		children: /* @__PURE__ */ (0, H.jsxs)("svg", {
			"data-popout": "1",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2.2",
			width: "13",
			height: "13",
			style: { pointerEvents: "none" },
			children: [
				/* @__PURE__ */ (0, H.jsx)("path", { d: "M14 3h7v7" }),
				/* @__PURE__ */ (0, H.jsx)("path", { d: "M21 3l-9 9" }),
				/* @__PURE__ */ (0, H.jsx)("path", { d: "M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" })
			]
		})
	});
}
//#endregion
//#region src/components/NodeView/registry.js
var ms = {
	text: ss,
	essay: ss,
	fragment: ss,
	multi: ss,
	image: ss,
	"podcast-episode": ss,
	video: ss,
	link: ss
};
function hs(e, t = {}) {
	return {
		...ms,
		...t
	}[e] || ss;
}
//#endregion
//#region src/components/GraphViewer/layouts.js
var gs = /* @__PURE__ */ o(((e, t) => {
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
})), _s = /* @__PURE__ */ o(((e, t) => {
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
			let A = o(0, 0, k.w, k.h), j = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new Map(), M = [], N = null;
			if (E.length) {
				let t = E[0], r = k.h / 2 + g + t.h / 2, s = (e) => !a(e, A, g) && !M.some((t) => a(e, t, O)), c = E.some((e) => e.kind === "container"), l = E.some((e) => Number.isFinite(e.order)), m = c ? b === "scatter" ? "scatter" : "beside" : b === "ring" ? "ring" : b === "scatter" ? "scatter" : l ? "path" : "scatter", _ = [];
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
					}), S.rects.forEach((e) => M.push({
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
					}, N = {
						...S.sp,
						cx: S.sp.cx + w,
						cy: S.sp.cy + T
					}, y && (N = {
						...N,
						anchorEnd: "outer",
						openTowards: D.openTowards,
						drop: C
					});
				} else if (m === "ring") {
					let e = Math.max(...E.map((e) => Math.hypot(e.w, e.h))), t = E.length, n = Math.max(t > 1 ? t * (e + f) / (2 * Math.PI) : 0, Math.hypot(k.w, k.h) / 2 + e / 2 + g);
					for (let e = 0; e < 400; e++) {
						_.length = 0, M.length = 0;
						let e = !0;
						if (E.forEach((r, i) => {
							let a = -Math.PI / 2 + i / t * 2 * Math.PI, c = {
								x: n * Math.cos(a),
								y: 0 + n * Math.sin(a)
							}, l = o(c.x, c.y, r.w, r.h);
							s(l) || (e = !1), _.push(c), M.push(l);
						}), e) break;
						n += 8;
					}
				} else if (m === "beside") {
					_.push({
						x: 0,
						y: r
					}), M.push(o(0, r, t.w, t.h));
					let e = Math.max(A.x1, 0 + t.w / 2), n = Math.min(A.x0, 0 - t.w / 2), i = r + t.h / 2;
					E.slice(1).forEach((t, r) => {
						let a = -i / 2;
						a + t.h > i && (a = -t.h / 3);
						let s = a + t.h / 2, c;
						r % 2 == 0 ? (c = e + f * 2 + t.w / 2, e = c + t.w / 2) : (c = n - f * 2 - t.w / 2, n = c - t.w / 2), i = Math.max(i, a + t.h), _.push({
							x: c,
							y: s
						}), M.push(o(c, s, t.w, t.h));
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
						}), M.push(o(a, c, t.w, t.h));
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
							ee.set(n, {
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
			let P = v(e, u) * 1.25, F = M.length ? s([A, ...M]) : A, I = {
				x0: F.x0 - P,
				y0: F.y0 - P,
				x1: F.x1 + P,
				y1: F.y1 + P
			};
			return ee.set(e.id, {
				label: A,
				box: I,
				center: {
					x: 0,
					y: 0
				},
				closed: !1,
				spiral: N
			}), {
				box: I,
				nodes: j,
				containers: ee
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
})), vs = /* @__PURE__ */ o(((e, t) => {
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
})), ys = /* @__PURE__ */ o(((e, t) => {
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
})), bs = /* @__PURE__ */ o(((e, t) => {
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
})), xs = /* @__PURE__ */ o(((e, t) => {
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
})), Ss = /* @__PURE__ */ o(((e, t) => {
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
})), Cs = /* @__PURE__ */ o(((e, t) => {
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
})), ws = /* @__PURE__ */ o(((e, t) => {
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
})), Ts = /* @__PURE__ */ o(((e, t) => {
	var { zoomAbout: n, fitRatioAbout: r } = ws();
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
})), Es = /* @__PURE__ */ o(((e, t) => {
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
})), Ds = /* @__PURE__ */ o(((e, t) => {
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
})), Os = /* @__PURE__ */ o(((e, t) => {
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
})), ks = /* @__PURE__ */ o(((e, t) => {
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
})), As = /* @__PURE__ */ o(((e, t) => {
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
})), js = /* @__PURE__ */ o(((e, t) => {
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
})), Ms = /* @__PURE__ */ o(((e, t) => {
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
})), Ns = /* @__PURE__ */ o(((e, t) => {
	var { rootShape: n, rng: r, hashString: i } = qo(), a = {
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
})), Ps = /* @__PURE__ */ o(((e, t) => {
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
})), Fs = /* @__PURE__ */ o(((e, t) => {
	var { TIMES_OF_DAY: n, sceneMonth: r } = Ps(), i = {
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
})), Is = /* @__PURE__ */ o(((e, t) => {
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
})), Ls = /* @__PURE__ */ o(((e, t) => {
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
})), Rs = /* @__PURE__ */ o(((e, t) => {
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
})), zs = /* @__PURE__ */ o(((e, t) => {
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
		e && typeof e == "object" && !Array.isArray(e) ? e.concepts && typeof e.concepts == "object" ? c = e : e._stone && typeof e._stone == "object" ? (c = e._stone, l === void 0 && e.items && (l = e.items)) : l === void 0 && (l = e) : l === void 0 && e !== void 0 && (l = e);
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
			if (!a(l, n)) return null;
			let d = Array.isArray(t.rank) ? t.rank.map((e) => ({
				label: e.label,
				score: e.score,
				parts: e.parts ? { ...e.parts } : {}
			})) : [], f = {
				canonical: n,
				pinned: !!t.pinned,
				discovered: !!t.discovered,
				items: typeof t.items == "number" ? t.items : 0,
				forms: l,
				rank: d
			};
			if (typeof t.id == "string" && t.id && (f.id = t.id), Array.isArray(t.inScheme) && t.inScheme.length && (f.inScheme = [...t.inScheme]), t.prefLabel && typeof t.prefLabel == "object" && Object.keys(t.prefLabel).length && (f.prefLabel = { ...t.prefLabel }), t.altLabel && typeof t.altLabel == "object" && Object.keys(t.altLabel).length) {
				f.altLabel = {};
				for (let [e, n] of Object.entries(t.altLabel)) f.altLabel[e] = Array.isArray(n) ? [...n] : n;
			}
			return Array.isArray(t.broader) && t.broader.length && (f.broader = [...t.broader]), Array.isArray(t.mappings) && t.mappings.length && (f.mappings = t.mappings.map((e) => e && typeof e == "object" ? { ...e } : e)), f;
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
		if (!e || !Array.isArray(e.forms) || e.forms.length === 0) return [];
		let t = e.forms.map((e) => `${e.system} writes ${(e.spellings || []).map((e) => e.label).join(", ")}`), n = l(e.rank);
		return n && t.push(`named by ${n}`), t;
	}
	t.exports = {
		tagForms: c,
		winningPart: l,
		tagFormsLines: u
	};
})), Bs = /* @__PURE__ */ o(((e, t) => {
	var n = "site", r = "discovered", i = [
		"force",
		"radial",
		"timeline"
	], a = "tag:", o = "concept:";
	function s(e) {
		return !e || typeof e != "object" || Array.isArray(e) ? null : e._stone && typeof e._stone == "object" && !Array.isArray(e._stone) ? e._stone : Array.isArray(e.concepts) || Array.isArray(e.schemes) ? e : null;
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
})), Vs = /* @__PURE__ */ o(((e, t) => {
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
})), Hs = /* @__PURE__ */ o(((e, t) => {
	var n = .32;
	function r(e, t = n) {
		let r = e.deltaMode === 1 ? .05 : e.deltaMode ? 1 : .002, i = -e.deltaY * r * (e.ctrlKey ? 10 : 1);
		return Number.isFinite(i) ? Math.max(-t, Math.min(t, i)) : 0;
	}
	t.exports = {
		wheelDelta: r,
		WHEEL_STEP_MAX: n
	};
})), Us = /* @__PURE__ */ o(((e, t) => {
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
		pieceCountsFromFeed: c
	};
})), Ws = /* @__PURE__ */ o(((e, t) => {
	var n = [
		"broader",
		"broadMatch",
		"related",
		"relatedMatch",
		"closeMatch",
		"exactMatch"
	], r = new Set(n), i = new Set(["broader", "broadMatch"]), a = 5, o = (e) => typeof e == "string" && e.startsWith("tag:");
	function s(e) {
		return !!(e && r.has(e.layer) && o(e.source) && o(e.target) && e.source !== e.target);
	}
	var c = (e) => {
		let t = e && e.attrs ? Number(e.attrs.weight) : NaN;
		return Number.isFinite(t) ? t : null;
	};
	function l(e, t, { visible: n, limit: o = a } = {}) {
		let s = /* @__PURE__ */ new Map();
		if (!t) return {
			relatives: [],
			total: 0,
			more: 0
		};
		for (let a of e || []) {
			if (!a || !r.has(a.layer)) continue;
			let e = typeof a.source == "object" && a.source ? a.source.id : a.source, o = typeof a.target == "object" && a.target ? a.target.id : a.target;
			if (e === o) continue;
			let l = e === t ? o : o === t ? e : null;
			if (l == null || typeof n == "function" && !n(l)) continue;
			s.has(l) || s.set(l, {
				id: l,
				weight: null,
				relations: [],
				broader: null
			});
			let u = s.get(l);
			u.relations.push(a);
			let d = c(a);
			d !== null && (u.weight === null || d > u.weight) && (u.weight = d), u.broader === null && (a.directed || i.has(a.layer)) && (u.broader = o);
		}
		let l = [...s.values()].sort((e, t) => e.weight === t.weight ? e.id < t.id ? -1 : +(e.id > t.id) : e.weight === null ? 1 : t.weight === null ? -1 : t.weight - e.weight);
		for (let e of l) e.relations.sort((e, t) => {
			let n = c(e), r = c(t);
			return n === r ? 0 : n === null ? 1 : r === null ? -1 : r - n;
		});
		let u = Number.isFinite(o) ? Math.max(0, Math.floor(o)) : l.length, d = l.slice(0, u);
		return {
			relatives: d,
			total: l.length,
			more: l.length - d.length
		};
	}
	function u(e, t = 48) {
		let n = String(e || "").split(/\s+/).filter(Boolean), r = [], i = "";
		for (let e of n) i ? i.length + 1 + e.length <= t ? i += " " + e : (r.push(i), i = e) : i = e;
		return i && r.push(i), r;
	}
	function d(e, { width: t = 48 } = {}) {
		let n = [];
		for (let r of e || []) {
			if (!r) continue;
			let e = c(r);
			n.push(e === null ? String(r.layer) : `${r.layer} · weight ${e}`);
			let i = r.attrs && typeof r.attrs.why == "string" ? r.attrs.why : "";
			i && n.push(...u(i, t));
		}
		return n.join("\n");
	}
	t.exports = {
		RELATION_LAYERS: n,
		STRONGEST: a,
		isRelationEdge: s,
		relativesOf: l,
		relationLabel: d,
		wrapText: u
	};
})), Gs = gs(), Ks = _s(), qs = vs(), Js = ys(), Ys = bs(), Xs = xs(), Zs = Ss(), Qs = Cs(), $s = ws(), ec = Ts(), tc = Es(), nc = Ds(), rc = Os(), ic = ks(), ac = As(), oc = js(), sc = qo(), cc = Ms(), lc = Ns(), uc = Fs(), dc = Is(), fc = Ls(), pc = Rs(), mc = zs(), hc = Bs(), gc = Vs(), _c = Hs(), vc = Us(), yc = Ws(), bc = () => typeof window < "u" ? window.SETTINGS : null;
function xc(e, t = {}) {
	let n = [], r = [], i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map(), s = new Set(t.visibleLayers || ["sequence"]), c = t.tagColor || "#f39c12", l = t.topologyColor || "#9b59b6", u = t.placeholderColor || "#7f8c8d", d = /* @__PURE__ */ new Map(), f = e._stone && Array.isArray(e._stone.concepts) ? e._stone.concepts : [];
	for (let e of f) e && typeof e.id == "string" && e.ledger && typeof e.ledger.previousLabel == "string" && e.ledger.previousLabel && d.set(e.id, e.ledger.previousLabel);
	for (let r of e.items) {
		let i = r.url.split("/").pop().replace(".html", "");
		o.set(r.id, i), a.add(i);
		let s = null, c = e.containers || t.containment || [];
		for (let e of c) if (e.parent && e.tag && (r.tags || []).includes(e.tag)) {
			s = e.badgeColor || e.color || e.stroke;
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
			link: (0, fc.isLinkItem)(r) ? (0, fc.linkOf)(r) : "",
			subtitle: r.subtitle || "",
			_source: r._source || null,
			originalItem: r
		});
	}
	function p(e) {
		return e.startsWith("tag:") || e.startsWith("topology:") ? e : o.get(e) || e;
	}
	let m = [], h = [];
	for (let t of e.edges || []) {
		if (t.layer === "containment" || t.role === "contains") {
			m.push({
				source: t.source,
				target: p(t.target),
				attrs: t.attrs || {}
			});
			continue;
		}
		if ((0, yc.isRelationEdge)(t)) {
			h.push({
				source: t.source,
				target: t.target,
				directed: !!t.directed,
				layer: t.layer,
				attrs: t.attrs || {}
			});
			continue;
		}
		if (!s.has(t.layer)) continue;
		let e = p(t.source), n = p(t.target);
		if (t.layer === "tag" && !i.has(n)) {
			let e = t.attrs && typeof t.attrs.concept == "string" && t.attrs.concept ? t.attrs.concept : null, r = {
				id: n,
				label: n.slice(4),
				type: "tag",
				size: 30,
				color: c,
				concept: e,
				systems: []
			};
			e && d.has(e) && (r.previousLabel = d.get(e)), i.set(n, r);
		} else t.layer === "topology" && !i.has(n) ? i.set(n, {
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
	let g = new Map(n.map((e) => [e.id, e._source && e._source.id]));
	for (let e of r) {
		if (e.layer !== "tag") continue;
		let t = i.get(e.target);
		if (!t || t.type !== "tag") continue;
		let n = g.get(e.source);
		n && t.systems.push(n);
	}
	n.push(...i.values());
	let _ = new Set(n.map((e) => e.id));
	for (let e = r.length - 1; e >= 0; e--) (!_.has(r[e].source) || !_.has(r[e].target)) && r.splice(e, 1);
	let v = new Set(n.filter((e) => e.type === "tag").map((e) => e.id));
	for (let e = h.length - 1; e >= 0; e--) (!v.has(h[e].source) || !v.has(h[e].target)) && h.splice(e, 1);
	let y = e.containers || t.containment || [];
	if (y.length === 0 && m.length > 0) {
		let e = /* @__PURE__ */ new Map();
		for (let t of m) if (!a.has(t.source) && !e.has(t.source)) {
			let n = t.attrs?.label || t.source.replace(/^container:/, "").replace(/^tag:/, "").replace(/-/g, " ");
			e.set(t.source, {
				id: t.source,
				label: n.toUpperCase(),
				parent: t.attrs?.parent || null
			});
		}
		y = Array.from(e.values());
	}
	return {
		nodes: n,
		links: r,
		containmentEdges: m,
		containers: y,
		relations: h
	};
}
function Sc(e) {
	let t = 0, n = 0, r = 0;
	for (let i of e || []) !i || !Number.isFinite(i.x) || !Number.isFinite(i.y) || (t += 1, n += i.x, r += i.y);
	return t ? {
		x: n / t,
		y: r / t
	} : null;
}
function Cc(e, t) {
	let n = e && e._source;
	return n && (t && t(n.id) || n.color) || null;
}
function wc(e) {
	let t = /* @__PURE__ */ new Map();
	return e.selectAll(".node").each((e) => {
		e && t.set(e.id, e);
	}), t;
}
function Tc(e, t) {
	let n = /* @__PURE__ */ new Map();
	return e.selectAll(".link").each((e) => {
		if (!e || e.layer !== "tag" || e._dupByGroup) return;
		let r = typeof e.source == "object" ? e.source : t.get(e.source), i = typeof e.target == "object" ? e.target : t.get(e.target), a = i && i.type === "tag" ? i : r && r.type === "tag" ? r : null, o = a === i ? r : i;
		!a || !o || o.type !== "article" || (n.has(a.id) || n.set(a.id, []), n.get(a.id).push(o));
	}), n;
}
function Ec(e, t, n, r) {
	let i = e.selectAll(".node").filter((e) => !!(e && e.type === "tag" && !e._groupedInto));
	if (i.empty()) return;
	let a = null;
	typeof getComputedStyle == "function" && (a = getComputedStyle(e.node()).getPropertyValue("--gv-tag-color").trim() || null), i.select("rect").attr("fill", (e) => (0, gc.blendColors)((t.get(e.id) || []).filter((e) => !n(e)).map((e) => ({
		color: Cc(e, r),
		weight: 1
	})), a || e.color) || "var(--gv-tag-color)");
}
function Dc(e) {
	if (typeof window > "u") return;
	let t = [...e.values()].sort((e, t) => e - t), n = t.join(","), r = window.PostPipeGraphTags;
	r && r.sig === n || (window.PostPipeGraphTags = {
		sig: n,
		counts: t
	}, window.dispatchEvent(new CustomEvent("graph:tag-counts", { detail: { counts: t } })));
}
function Oc(e, t, n, r, i) {
	let a = (e) => !!(e && e.type === "article" && e._source && n.has(e._source.id)), o = wc(e), s = Tc(e, o), c = /* @__PURE__ */ new Set();
	for (let [e, t] of s) t.length && t.every(a) && c.add(e);
	let l = [];
	for (let e of o.values()) e.type === "tag" && !e._groupedInto && l.push(e.id);
	let u = (0, vc.pieceCounts)(s, l), d = 0;
	for (let e of u.values()) e > d && (d = e);
	for (let e of (0, vc.tagsBelow)(u, (0, vc.clampMinPieces)(i, d))) c.add(e);
	Dc(u);
	let f = (e) => !!(e && (e._closedHidden || e._groupedInto || a(e) || e.type === "tag" && c.has(e.id)));
	e.selectAll(".node").style("display", (e) => f(e) ? "none" : null), t.selectAll(".node-card").style("display", (e) => f(e) ? "none" : null), e.selectAll(".link, .link-hit").style("display", (e) => {
		let t = typeof e.source == "object" ? e.source : o.get(e.source), n = typeof e.target == "object" ? e.target : o.get(e.target);
		return e._dupByGroup || f(t) || f(n) ? "none" : null;
	}), Ec(e, s, a, r);
}
function kc(e, t, n) {
	if (!n) {
		t.selectAll(".node-card").classed("dimmed", !1), e.selectAll(".node").classed("dimmed", !1), e.selectAll(".link").classed("dimmed", !1);
		return;
	}
	t.selectAll(".node-card").classed("dimmed", (e) => !n.has(e.id));
	let r = Tc(e, wc(e));
	e.selectAll(".node").classed("dimmed", (e) => {
		if (e.type === "article") return !n.has(e.id);
		if (e.type === "tag") {
			if (e._groupedInto) return !1;
			let t = r.get(e.id);
			return !!(t && t.length) && !t.some((e) => n.has(e.id));
		}
		return !1;
	}), e.selectAll(".link").classed("dimmed", (e) => {
		let t = typeof e.source == "object" ? e.source.id : e.source, r = typeof e.target == "object" ? e.target.id : e.target;
		return !n.has(t) && !n.has(r);
	});
}
function Ac(e) {
	let t = {};
	for (let n of e && e.containers || []) {
		let e = (0, lc.fraction)(n.anchor);
		e && (t[n.id] = e);
	}
	return t;
}
function jc(e) {
	let t = {};
	for (let n of e && e.containers || []) {
		let e = {};
		n.layout && (e.layout = n.layout), n.hang && typeof n.hang == "object" && (e.hang = n.hang), n.spiral && typeof n.spiral == "object" && (e.spiral = n.spiral), (n.hull === !1 || n.hull && typeof n.hull == "object") && (e.hull = n.hull), Object.keys(e).length && (t[n.id] = e);
	}
	return t;
}
function Mc(e) {
	return e && (e.labelPosition === "top" || e.labelPosition === "hidden") ? e.labelPosition : "center";
}
var Nc = .35, Pc = .6;
function Fc(e) {
	return e < Nc ? "marker" : e < Pc ? "title" : "full";
}
function Ic(e) {
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
function Lc({ feedData: e, onNodeSelect: t, hiddenSources: n, filteredArticleIds: r, viewState: i, layout: a = "force", timeAxis: o, graphSettings: s, colorOverrides: c, apiRef: l, onNodeFocus: u, contributions: d }) {
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
	}, S = (e) => {
		let t = e && e.hull && typeof e.hull == "object" ? Number(e.hull.padding) : NaN;
		if (Number.isFinite(t)) return t;
		let n = f.hull && typeof f.hull == "object" ? Number(f.hull.padding) : NaN;
		return Number.isFinite(n) ? n : (0, Ks.containerLayoutOf)(e, f) === "hang" ? p.width / 2 : e && e.padding != null ? e.padding : e && e.parent ? 42 : 75;
	}, C = (0, _.useRef)(null), w = (0, _.useRef)(null), T = (0, _.useRef)(null), E = (0, _.useRef)(t);
	(0, _.useEffect)(() => {
		E.current = t;
	}, [t]);
	let D = (0, _.useRef)(u);
	(0, _.useEffect)(() => {
		D.current = u;
	}, [u]);
	let O = (0, _.useRef)(null), k = (e) => {
		O.current = e ? e.id : null, D.current && D.current(e ? e.originalItem || e : null);
	}, A = (0, _.useRef)(i);
	(0, _.useEffect)(() => {
		A.current = i;
	}, [i]);
	let j = (e) => {
		let t = A.current;
		return t && typeof t.sourceColor == "function" && t.sourceColor(e) || null;
	}, ee = () => {
		let e = A.current;
		return e && e.preference ? e.preference(vc.PREF) : null;
	}, M = Ic(p);
	p.glowPadding;
	let N = (0, _.useRef)(null), P = (0, _.useRef)(a), F = (0, _.useRef)(!1), I = (0, _.useRef)(null), L = (0, _.useRef)(null), te = (0, _.useRef)(null), ne = (0, _.useRef)(null), re = (0, _.useRef)(null), ie = (0, _.useRef)(null), R = (0, _.useRef)(null), ae = (0, _.useRef)(null), oe = (0, _.useRef)(d || []), se = (0, _.useRef)(null), ce = (0, _.useRef)(null), le = (e) => e._groupKey || (e.type === "tag" && e.concept ? "concept:" + e.concept : e.originalItem && e.originalItem.id || e.id), ue = (0, _.useRef)({
		settings: null,
		feed: null,
		keys: /* @__PURE__ */ new Map()
	}), de = (t) => {
		let n = ue.current;
		return (n.settings !== s || n.feed !== e) && (n.settings = s, n.feed = e, n.keys = /* @__PURE__ */ new Map()), n.keys.has(t) || n.keys.set(t, (0, cc.layoutKey)(t, s, {
			anchors: Ac(e),
			layouts: jc(e)
		}) + "::"), n.keys.get(t);
	}, fe = (e) => de(P.current) + le(e), pe = (0, _.useRef)(/* @__PURE__ */ new Set()), me = (0, _.useRef)(null), he = (0, _.useRef)(1), ge = (0, _.useRef)("full"), _e = (0, _.useRef)(/* @__PURE__ */ new Set());
	(0, _.useEffect)(() => {
		_e.current = n instanceof Set ? n : new Set(n || []), !(!w.current || !T.current) && (Oc(w.current, Vt(T.current), _e.current, j, ee()), ce.current && ce.current());
	}, [n]), (0, _.useEffect)(() => {
		if (!(!C.current || !c)) for (let [e, t] of Object.entries(c)) t && C.current.style.setProperty(e, t);
	}, [c]);
	let [ve, ye] = (0, _.useState)(0);
	(0, _.useEffect)(() => {
		if (!i) return;
		let e = i.historyVersion || 0;
		return i.subscribe(() => {
			let t = i.historyVersion || 0;
			t !== e && (e = t, ye(t));
		});
	}, [i]), (0, _.useEffect)(() => {
		if (i) return i.subscribe(() => {
			te.current && te.current(), ne.current && ne.current(), se.current && se.current(), ie.current && ie.current(), re.current && re.current(), ae.current && ae.current(), w.current && T.current && Oc(w.current, Vt(T.current), _e.current, j, ee()), ce.current && ce.current();
		});
	}, [i]), (0, _.useEffect)(() => {
		oe.current = d || [], te.current && te.current(), se.current && se.current({ rebuild: !0 });
	}, [d]), (0, _.useEffect)(() => {
		!w.current || !T.current || kc(w.current, Vt(T.current), r);
	}, [r]), (0, _.useEffect)(() => {
		if (!e || !C.current) return;
		let t = C.current, n = t.clientWidth, r = t.clientHeight, i = getComputedStyle(t), a = xc(e, {
			tagColor: i.getPropertyValue("--gv-tag-color").trim() || "#f39c12",
			topologyColor: i.getPropertyValue("--gv-topology-color").trim() || "#9b59b6",
			placeholderColor: i.getPropertyValue("--gv-placeholder-color").trim() || "#7f8c8d",
			visibleLayers: Array.isArray(f.visibleLayers) ? f.visibleLayers : ["sequence"]
		}), o = (0, ic.bindingsOf)(f), c = (e, t, n) => (0, ic.resolve)(o, e, t, n), u = (0, ic.isBound)(o, "node.resize");
		Vt(t).selectAll("svg").remove(), Vt(t).selectAll(".cards-layer").remove();
		let d = Vt(t).append("svg").attr("width", n).attr("height", r).style("position", "absolute").style("inset", "0").style("pointer-events", "all");
		w.current = d;
		let h = d.append("defs");
		h.append("marker").attr("id", "sequence-arrow").attr("viewBox", "0 0 10 10").attr("refX", 8).attr("refY", 5).attr("markerWidth", 7).attr("markerHeight", 7).attr("orient", "auto").append("path").attr("d", "M 0 1.5 L 8 5 L 0 8.5 z").attr("fill", "var(--gv-accent, #d4af37)"), h.append("marker").attr("id", "relation-arrow").attr("class", "relation-arrow").attr("viewBox", "0 0 10 10").attr("refX", 9).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11).attr("markerHeight", 11).attr("orient", "auto").append("path").attr("d", "M 0 1 L 10 5 L 0 9 z");
		let D = Vt(t).append("div").attr("class", "cards-layer").style("position", "absolute").style("left", "0").style("top", "0").style("width", "100%").style("height", "100%").style("pointer-events", "none");
		T.current = D.node();
		let F = D.append("div").attr("class", "cards-transform").style("transform-origin", "0 0").style("position", "absolute").style("left", "0").style("top", "0").style("width", "0").style("height", "0").style("overflow", "visible"), ue = d.append("g"), ve = !1, ye = !!f.initialFocus && f.initialFocus !== "all", be = f.initialFocusMinScale == null ? .4 : f.initialFocusMinScale, xe = (0, tc.minCardScale)(f.initialScale, p.width), Se = (0, tc.homeScale)(be, f.initialScale, p.width), Ce = 0, we = null, Te = 0, Ee = !1, De = !1, Oe = null, ke = {
			x: 0,
			y: 0,
			k: 1
		}, Ae = () => Ce ? ` rotate(${-Ce})` : "", je = (e) => (0, Qs.rotatedView)(e, we, Ce);
		function Me(e) {
			ke = je(e), ue.attr("transform", `translate(${ke.x},${ke.y}) rotate(${Ce}) scale(${ke.k})`), F && F.style("transform", `translate3d(${ke.x}px, ${ke.y}px, 0px) rotate(${Ce}deg) scale(${ke.k})`), t && t.style.setProperty("--gv-unrot", `${-Ce}deg`), Te !== Ce && (Te = Ce, Ee && Zi());
		}
		let Ne = (e, t) => (0, Qs.viewToScreen)(ke, Ce, e, t), Pe = Go().wheelDelta(_c.wheelDelta).on("zoom", (e) => {
			e.sourceEvent && (ve = !0, ye = !1), Me(e.transform);
			let t = e.transform.k;
			he.current = t, Ee && Ie && Bn() && Zi(), Ee && ta(), ri && oi(), ce.current && ce.current({ paintOnly: !0 }), L.current && L.current(), Ee && gr();
			let n = Fc(t);
			n !== ge.current && (ge.current = n, ji(), Xi());
		}), Fe = (0, $s.zoomPivotMode)(f) === "art", Ie = (0, ec.zoomModeOf)(f) === "grow-in-place", Le = () => {
			if (!Fe || typeof window > "u") return null;
			let e = window.PostPipeCoverFrame;
			if (!e || !e.art || !e.zoomPivot) return null;
			let t = (0, lc.artPoint)(e.zoomPivot, e.art), n = C.current ? C.current.getBoundingClientRect() : {
				left: 0,
				top: 0
			}, r = window.PostPipeCover && window.PostPipeCover.shift || 0;
			return [t.x - n.left, t.y - (n.top - r)];
		};
		if (Fe || Ie) {
			let e = Pe.constrain();
			Pe.constrain((t, n, r) => {
				let i = Io(d.node());
				if (Bn()) {
					let e = Hn(), n = (0, ec.growConstrain)(i, t, e[0], e[1], Yn());
					t = Fo.translate(n.x, n.y).scale(n.k);
				} else {
					let e = Le();
					if (e) {
						let n = (0, $s.repivot)(i, t, e[0], e[1]);
						t = Fo.translate(n.x, n.y).scale(n.k);
					}
				}
				return e(t, n, r);
			}), Pe.interpolate(ar);
		}
		if (c("space", "drag") !== "view.pan") {
			let e = Pe.constrain();
			Pe.constrain((t, n, r) => {
				let i = Io(d.node());
				return Math.abs(t.k - i.k) <= 1e-9 * i.k ? i : e(t, n, r);
			});
		}
		d.call(Pe).on("dblclick.zoom", null);
		let Re = (e) => {
			let t = e.touches[0], n = e.touches[1];
			return Math.atan2(n.clientY - t.clientY, n.clientX - t.clientX) * 180 / Math.PI;
		}, ze = (e) => {
			let n = t.getBoundingClientRect(), r = e.touches[0], i = e.touches[1];
			return [(r.clientX + i.clientX) / 2 - n.left, (r.clientY + i.clientY) / 2 - n.top];
		}, Be = (e) => {
			if (e.touches.length !== 2) return;
			let [t, n] = ze(e);
			we = {
				theta0: Ce,
				a0: Re(e),
				mx: t,
				my: n,
				started: !1
			};
		}, Ve = (e) => {
			if (!we || e.touches.length !== 2) return;
			let [t, n] = ze(e);
			we.mx = t, we.my = n;
			let r = (0, Qs.angleDelta)(Re(e), we.a0);
			if (!we.started) {
				if (Math.abs(r) < 10) return;
				we.started = !0, we.a0 = Re(e);
				return;
			}
			Ce = (0, Qs.normalizeAngle)(we.theta0 + r);
		}, He = (e) => {
			if (!we || e.touches.length >= 2) return;
			let t = je(Io(d.node()));
			we = null, d.call(Pe.transform, Fo.translate(t.x, t.y).scale(t.k));
		};
		t.addEventListener("touchstart", Be, {
			capture: !0,
			passive: !0
		}), t.addEventListener("touchmove", Ve, {
			capture: !0,
			passive: !0
		}), t.addEventListener("touchend", He, {
			capture: !0,
			passive: !0
		}), t.addEventListener("touchcancel", He, {
			capture: !0,
			passive: !0
		});
		function Ue({ repaint: e = !0 } = {}) {
			if (!Ce && !we) return;
			we = null;
			let t = Io(d.node()), i = n / 2, a = r / 2, o = (0, Qs.screenToView)(ke, Ce, i, a);
			Ce = 0, e && d.call(Pe.transform, Fo.translate(i - o[0] * t.k, a - o[1] * t.k).scale(t.k));
		}
		function We(e, t = {}) {
			switch (e) {
				case "container.toggle":
					t.c && pn(t.c, t.closedNode);
					return;
				case "view.zoomInStep":
					lo(ro);
					return;
				case "view.zoomAtPoint":
					Ye(t.x, t.y, t.shift ? .5 : 2);
					return;
				case "node.zoomToReadable":
					t.d && Bi(t.d, t.x, t.y);
					return;
				case "node.openReader":
					t.d && Vi(t.d);
					return;
				case "node.select":
					t.d && t.cardEl && Hi(t.d, t.cardEl);
					return;
				case "view.deselect":
					Yi();
					return;
				default:
			}
		}
		let Ge = Number.isFinite(f.doubleTapMs) ? f.doubleTapMs : 250, Ke = (0, rc.createTapGate)({
			ms: Ge,
			px: 32
		});
		function qe(e) {
			let i = e && e.changedTouches && e.changedTouches.length ? e.changedTouches[0] : e, a = t.getBoundingClientRect();
			return !i || !Number.isFinite(i.clientX) ? [n / 2, r / 2] : [i.clientX - a.left, i.clientY - a.top];
		}
		function Je(e) {
			let [t, n] = qe(e);
			return {
				x: t,
				y: n,
				shift: !!(e && e.shiftKey)
			};
		}
		function Ye(e, t, n) {
			ve = !0, ye = !1, d.transition("tap-zoom").duration(320).ease(na).call(Pe.scaleBy, n, [e, t]);
		}
		function Xe(e, t, n) {
			let r = Je(e), i = n || (() => We(c("space", "doubletap"), r));
			Ke.tap(r.x, r.y, t, () => {
				Qe(r), i();
			});
		}
		let Ze = null;
		function Qe(e) {
			Ze = {
				t: Date.now(),
				x: e.x,
				y: e.y
			};
		}
		let $e = (e) => {
			if (!Ze) return;
			if (Date.now() - Ze.t > 450) {
				Ze = null;
				return;
			}
			let [t, n] = qe(e);
			Math.hypot(t - Ze.x, n - Ze.y) > 32 || (e.type === "dblclick" && (Ze = null), e.stopPropagation(), e.preventDefault());
		};
		t.addEventListener("click", $e, !0), t.addEventListener("dblclick", $e, !0);
		let et = null, tt = null, nt = (e) => {
			if (e.touches.length === 2) {
				let [t, n] = ze(e);
				et = {
					t: Date.now(),
					x: t,
					y: n,
					moved: !1
				};
			} else e.touches.length > 2 && (et = null);
		}, rt = (e) => {
			if (!et || e.touches.length !== 2) return;
			let [t, n] = ze(e);
			Math.hypot(t - et.x, n - et.y) > 14 && (et.moved = !0);
		}, it = (e) => {
			if (!et || e.touches.length > 0) return;
			let t = et;
			et = null;
			let n = Date.now();
			t.moved || n - t.t > 350 || (tt && n - tt.t <= 450 && Math.hypot(t.x - tt.x, t.y - tt.y) <= 60 ? (tt = null, Ye(t.x, t.y, .5)) : tt = {
				t: n,
				x: t.x,
				y: t.y
			});
		};
		t.addEventListener("touchstart", nt, {
			capture: !0,
			passive: !0
		}), t.addEventListener("touchmove", rt, {
			capture: !0,
			passive: !0
		}), t.addEventListener("touchend", it, {
			capture: !0,
			passive: !0
		});
		let at = 0, ot = () => Date.now() - at < 800, st = (() => {
			if (!(0, ic.usesGesture)(o, "longpress")) return () => {};
			let e = Number.isFinite(f.longPressMs) ? f.longPressMs : 500, n = null, r = () => {
				n && clearTimeout(n.timer), n = null;
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
				} : e && e.closest && e.closest("svg") === d.node() ? {
					target: "space",
					ctx: {}
				} : null;
			}, a = (t) => {
				if (r(), t.isPrimary === !1 || t.button !== void 0 && t.button !== 0) return;
				let a = i(t.target);
				if (!a) return;
				let o = Je(t);
				n = {
					id: t.pointerId,
					cx: t.clientX,
					cy: t.clientY,
					timer: setTimeout(() => {
						n = null, at = Date.now(), Ke.cancel(), We(c(a.ctx.d ? Ri(a.ctx.d) : a.target, "longpress"), {
							...a.ctx,
							...o
						});
					}, e)
				};
			}, s = (e) => {
				n && e.pointerId === n.id && Math.hypot(e.clientX - n.cx, e.clientY - n.cy) > 8 && r();
			}, l = (e) => {
				n && e.pointerId === n.id && r();
			}, u = (e) => {
				ot() && (at = 0, e.stopPropagation(), e.preventDefault());
			};
			return t.addEventListener("pointerdown", a, !0), t.addEventListener("pointermove", s, !0), t.addEventListener("pointerup", l, !0), t.addEventListener("pointercancel", l, !0), t.addEventListener("click", u, !0), () => {
				r(), t.removeEventListener("pointerdown", a, !0), t.removeEventListener("pointermove", s, !0), t.removeEventListener("pointerup", l, !0), t.removeEventListener("pointercancel", l, !0), t.removeEventListener("click", u, !0);
			};
		})();
		if (A.current && typeof A.current.migrateNodeKeys == "function" && R.current !== e) {
			R.current = e;
			let t = (0, hc.migrationPairs)(a.nodes, de);
			t.length && A.current.migrateNodeKeys(t);
		}
		let ct = !1;
		if (A.current && (ct = (0, Gs.layoutIsDegenerate)(a.nodes.map((e) => A.current.nodeState(fe(e))).filter((e) => e && Number.isFinite(e.x) && Number.isFinite(e.y)), M({
			hovered: !1,
			pinned: !1
		}))), A.current && !ct) {
			for (let e of a.nodes) {
				let t = A.current.nodeState(fe(e)), n = A.current.nodeState(le(e));
				t && typeof t.x == "number" && typeof t.y == "number" && (e.x = t.x, e.y = t.y, t.auto || (e.fx = t.x, e.fy = t.y)), u && n && typeof n.w == "number" && typeof n.h == "number" && (e._size = {
					width: n.w,
					height: n.h
				});
			}
			if (P.current === "force" && a.nodes.some((e) => e.type === "tag" && e.concept)) {
				let e = new Map(a.nodes.map((e) => [e.id, e])), t = /* @__PURE__ */ new Map();
				for (let n of a.links) {
					if (n.layer !== "tag") continue;
					let r = typeof n.target == "object" ? n.target.id : n.target, i = e.get(typeof n.source == "object" ? n.source.id : n.source);
					!i || i.type !== "article" || (t.has(r) || t.set(r, []), t.get(r).push(i));
				}
				for (let e of a.nodes) {
					if (e.type !== "tag" || !e.concept) continue;
					let n = A.current.nodeState(fe(e));
					if (n && Number.isFinite(n.x) && Number.isFinite(n.y)) continue;
					let r = Sc((t.get(e.id) || []).map((e) => A.current.nodeState(fe(e))));
					r && (e.x = r.x, e.y = r.y);
				}
			}
		}
		if (pe.current = /* @__PURE__ */ new Set(), A.current) for (let e of a.nodes) {
			let t = A.current.nodeState(le(e));
			e.type === "article" && !e.link && t && t.pinned && pe.current.add(e.id);
		}
		if (A.current && ct) for (let e of a.nodes) {
			let t = A.current.nodeState(le(e));
			u && t && typeof t.w == "number" && typeof t.h == "number" && (e._size = {
				width: t.w,
				height: t.h
			});
		}
		let lt = () => {
			let e = A.current;
			return e && e.preference ? e.preference("tightness") : null;
		}, ut = (0, Ys.tightened)(g, lt(), p), dt = (e) => e._groupedInto ? 0 : Math.max(0, (e._r || (e.type === "article" ? Math.hypot(p.width, p.height) / 2 : e.size / 2)) + ut.collidePadding), ft = (e) => e._groupedInto ? 0 : ut.chargeStrength, pt = io().force("link", Ya().id((e) => e.id).distance(ut.linkDistance)).force("charge", ao().strength(ft)).force("collide", Ka().radius(dt).strength(1).iterations(3)).force("center", ya(n / 2, r / 2)).velocityDecay(g.velocityDecay).alphaDecay(g.alphaDecay), mt = () => {
			I.current && I.current(), C.current && (n = C.current.clientWidth, r = C.current.clientHeight, d.attr("width", n).attr("height", r));
		};
		window.addEventListener("resize", mt);
		let ht = d.append("g").attr("class", "time-axis-layer"), gt = ue.append("g").attr("class", "roots-layer").attr("aria-hidden", "true").style("pointer-events", "none"), _t = ue.append("g").attr("class", "containers-layer"), vt = /* @__PURE__ */ new Map(), yt = /* @__PURE__ */ new Map();
		for (let e of a.containers || []) vt.set(e.id, /* @__PURE__ */ new Set()), yt.set(e.id, /* @__PURE__ */ new Set());
		for (let e of a.containmentEdges || []) vt.has(e.source) && vt.has(e.target) ? vt.get(e.source).add(e.target) : yt.has(e.source) && yt.get(e.source).add(e.target);
		let bt = /* @__PURE__ */ new Map();
		function xt(e, t) {
			if (!t && bt.has(e)) return bt.get(e);
			let n = t || /* @__PURE__ */ new Set();
			if (n.has(e)) return [];
			n.add(e);
			let r = Array.from(yt.get(e) || []), i = Array.from(vt.get(e) || []).flatMap((e) => xt(e, n)), a = Array.from(new Set([...r, ...i]));
			return t || bt.set(e, a), a;
		}
		let St = [...a.containers || []].sort((e, t) => t.parent === e.id ? -1 : +(e.parent === t.id)), Ct = _t.selectAll(".container-group").data(St, (e) => e.id).enter().append("g").attr("class", "container-group").attr("data-container-id", (e) => e.id), wt = () => {
			let e = A.current;
			return e && e.preference ? e.preference("nodePalette") : null;
		}, Tt = (0, Js.nodePaletteFor)(f, wt()), Et = (e) => e && e._look || (0, qs.containerLook)(e, Tt);
		for (let e of a.containers || []) e._look = (0, qs.containerLook)(e, Tt);
		let Dt = () => {
			Tt && String(Tt.color).toLowerCase() !== "none" ? t.style.setProperty("--pp-node-color", Tt.color) : t.style.removeProperty("--pp-node-color");
		};
		Dt(), Ct.append("path").attr("class", "container-hull").attr("stroke-width", (e) => e.strokeWidth || 1.5).attr("stroke-dasharray", (e) => e.strokeDasharray || (e.parent ? null : "6 6")), Ct.append("path").attr("class", "container-hull-ghost");
		let Ot = typeof document < "u" && document.documentElement.getAttribute("data-pp-theme") === "sketchbook", kt = () => (0, nc.initiallyClosed)(e.containers || [], f), At = new Set(kt()), jt = /* @__PURE__ */ new Map(), Mt = /* @__PURE__ */ new Map(), Nt = 1.05, Pt = (0, Zs.showContainerCount)(f);
		function Ft(e) {
			let t = (e.label || e.id).split(/\s+/), n = [], r = "";
			for (let e of t) r ? r.length + 1 + e.length > 15 ? (n.push(r), r = e) : r += " " + e : r = e;
			return r && n.push(r), n;
		}
		let It = .42, Lt = .2, Rt = (e) => e.status ? String(e.status) : "";
		function zt(e, t = {}) {
			let n = Ft(e).length, r = Rt(e) && t.status !== !1 ? Lt + It * 1.3 : 0;
			return {
				n,
				statusH: r,
				total: n * Nt + r
			};
		}
		function Bt(e, t, n = {}) {
			let r = Ft(t), { n: i, total: a } = zt(t, n), o = -a / 2;
			e.selectAll("*").remove(), r.forEach((t, n) => {
				e.append("tspan").attr("class", "label-line").attr("x", 0).attr("y", `${o + (n + .5) * Nt}em`).text(t), Pt && n === i - 1 && e.append("tspan").attr("class", "label-count").attr("font-weight", "500").attr("dx", "12px").attr("font-size", "0.5em").text("");
			});
			let s = n.status === !1 ? "" : Rt(t);
			if (s) {
				let t = o + i * Nt + Lt + It * 1.3 / 2;
				e.append("tspan").attr("class", "label-status").attr("x", 0).attr("font-size", `${It}em`).attr("font-weight", "500").attr("letter-spacing", "0.02em").attr("y", `${t / It}em`).text(s);
			}
		}
		let Ht = typeof document < "u" ? document.createElement("canvas").getContext("2d") : null;
		function Ut() {
			return typeof document > "u" ? "'Atkinson', sans-serif" : getComputedStyle(document.documentElement).getPropertyValue("--pp-title-font").trim() || "'Atkinson', sans-serif";
		}
		function Wt(e, t, n, r) {
			let i = r ? 0 : e.length * t * .05;
			return Ht ? (Ht.font = r ? `400 ${t}px ${r}` : `${Ot ? 400 : n} ${t}px ${Ut()}`, Ht.measureText(e).width * 1.06 + i) : e.length * t * .6 + i;
		}
		function Gt(e, t, n = {}) {
			let r = Ft(e), i = Pt ? Wt(" 000", t * .5, 500, n.family) + 12 : 0, a = n.status === !1 ? "" : Rt(e), o = Math.max(...r.map((e, a) => Wt(e, t, 700, n.family) + (a === r.length - 1 ? i : 0)), a ? Wt(a, t * It, 500, n.family) : 0), s = zt(e, n).total * t + .3 * t;
			return {
				w: o + 24,
				h: s + 12
			};
		}
		function Kt(e) {
			return e.badgeColor || e.color || e.stroke || "#d4af37";
		}
		let qt = Ct.append("g").attr("class", "container-badge").attr("data-container-top", (e) => e.parent ? null : "").style("touch-action", "manipulation");
		qt.append("rect").attr("class", "container-badge-hit").attr("fill", "transparent").attr("pointer-events", "all");
		let Jt = qt.append("text").attr("class", "container-badge-text").attr("text-anchor", "middle").attr("dominant-baseline", "central").style("user-select", "none").attr("fill", (e) => Kt(e)).attr("opacity", .55).attr("font-size", (e) => e.parent ? "52px" : "64px");
		Jt.each(function(e) {
			Bt(Vt(this), e);
		});
		let Yt = (e) => Et(e).label.face;
		function Xt() {
			if (typeof document > "u") return;
			let e = typeof window < "u" ? window.SETTINGS : null, t = document.documentElement.getAttribute("data-pp-mode") || "dark", n = getComputedStyle(document.body).backgroundColor, r = !n || /rgba\([^)]*,\s*0\)$/.test(n) || n === "transparent", i = (0, uc.allBackgrounds)((0, uc.config)(e), t, r ? null : n);
			Jt.each(function(e) {
				let t = Et(e).label.color, n = t ? {
					color: t,
					opacity: 1
				} : (0, uc.legibleOn)(Kt(e), i, { opacity: .55 });
				Vt(this).attr("fill", n.color).attr("opacity", n.opacity);
			});
		}
		Xt();
		function Zt() {
			Xt();
			let e = document.documentElement.getAttribute("data-pp-theme") === "sketchbook";
			if (e === Ot) return;
			Ot = e;
			let t = () => {
				Ee && (Lr(), Zi());
			};
			document.fonts && document.fonts.load ? document.fonts.load(`48px ${Ut()}`).then(t, t) : t();
		}
		let Qt = typeof MutationObserver < "u" ? new MutationObserver(Zt) : null;
		Ot && typeof document < "u" && document.fonts && document.fonts.load && document.fonts.load(`48px ${Ut()}`).then(() => {
			!Ee || !w.current || (Lr(), Zi());
		}, () => {}), Qt && Qt.observe(document.documentElement, {
			attributes: !0,
			attributeFilter: ["data-pp-mode", "data-pp-theme"]
		});
		let $t = Ct.append("g").attr("class", "container-macro-node").style("display", "none").style("touch-action", "manipulation"), en = (0, Ks.closedPillOf)(f);
		$t.append("path").attr("class", "container-macro-bg").attr("stroke-width", 2.2);
		let tn = (0, Ks.closedPillScaleOf)(f), rn = en.labelSize || Math.round((p.labelMaxFontSize || 26) * 1.6), an = $t.append("text").attr("class", "container-macro-text").attr("text-anchor", "middle").attr("dominant-baseline", "central").attr("font-size", (e) => `${e.parent ? rn : Math.round(rn * 1.25)}px`).attr("font-family", "'Atkinson', sans-serif").attr("font-weight", "700").attr("letter-spacing", "-0.02em");
		function on() {
			Ct.select(".container-hull").style("fill", (e) => Et(e).open.fill).style("fill-opacity", (e) => Et(e).open.fillOpacity).style("stroke", (e) => Et(e).open.stroke), Ct.select(".container-hull-ghost").style("stroke", (e) => Et(e).open.stroke), Ct.select(".container-macro-bg").style("fill", (e) => Et(e).closed.fill).style("fill-opacity", (e) => Et(e).closed.fillOpacity).style("stroke", (e) => Et(e).closed.stroke).style("filter", (e) => Et(e).closed.glow ? `drop-shadow(0 0 18px color-mix(in srgb, ${Et(e).closed.glow} 45%, transparent))` : "none");
			for (let e of [an, Jt]) e.style("font-family", (e) => Yt(e)).style("font-weight", (e) => Yt(e) ? "400" : null).style("letter-spacing", (e) => Yt(e) ? "0" : null);
			an.attr("fill", (e) => Et(e).label.color || Kt(e)), Xt();
		}
		on(), re.current = () => {
			let e = (0, Js.nodePaletteFor)(f, wt());
			if ((e && e.id) !== (Tt && Tt.id)) {
				Tt = e;
				for (let e of a.containers || []) e._look = (0, qs.containerLook)(e, Tt);
				on(), Dt();
			}
		};
		let sn = yo().curve(jo.alpha(.5));
		function cn(e, t, n) {
			let r = 0;
			for (let t = 0; t < e.length; t++) r = r * 31 + e.charCodeAt(t) >>> 0;
			let i = () => (r = r * 1664525 + 1013904223 >>> 0, r / 4294967296);
			if (en.shape === "blob") return sn(ln(i, t, n));
			let a = [];
			for (let e = 0; e < 14; e++) {
				let r = e / 14 * Math.PI * 2, o = Math.cos(r), s = Math.sin(r), c = 2 / 2.8, l = 1 + (i() - .5) * .08;
				a.push([Math.sign(o) * Math.abs(o) ** +c * t * l, Math.sign(s) * Math.abs(s) ** +c * n * l]);
			}
			return sn(a);
		}
		function ln(e, t, n) {
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
		an.each(function(e) {
			Bt(Vt(this), e, {
				status: en.status,
				family: Yt(e)
			});
		});
		let un = [...new Set((a.containers || []).map(Yt).filter(Boolean))];
		un.length && typeof document < "u" && document.fonts && document.fonts.load && Promise.all(un.map((e) => document.fonts.load(`48px ${e}`))).then(() => {
			!Ee || !w.current || (Lr(), Zi());
		}, () => {});
		function dn() {
			$t.each(function(e) {
				let t = Vt(this), n = parseFloat(t.select(".container-macro-text").attr("font-size")) || rn, r = Gt(e, n, {
					status: en.status,
					family: Yt(e)
				}), i = Math.max(p.width * 1.5, r.w + n * 1.4), a = Math.max(p.height * 1.5, r.h + n * 1.4);
				t.select(".container-macro-bg").attr("d", cn(e.id, i / 2, a / 2)), e._macroHalfW = i / 2 * tn, e._macroHalfH = a / 2 * tn;
			});
		}
		dn();
		function fn({ isCollapsed: e }) {
			return nn().clickDistance(5).container(() => ue.node()).filter((e) => !(e.ctrlKey || e.button !== void 0 && e.button !== 0)).on("start", function(e, t) {
				e.sourceEvent && e.sourceEvent.stopPropagation();
				let n = e.x, r = e.y;
				Vt(this).datum()._dragState = {
					startX: n,
					startY: r,
					lastX: n,
					lastY: r,
					totalMove: 0,
					moves: c("container", "drag") === "node.move"
				};
			}).on("drag", function(e, t) {
				let n = Vt(this).datum()._dragState;
				if (!n) return;
				let r = e.x - n.lastX, i = e.y - n.lastY;
				if (n.lastX = e.x, n.lastY = e.y, n.totalMove += Math.hypot(r, i), !n.moves) return;
				let a = Bn() ? ke.k / Oe : 1, o = r * a, s = i * a, c = xt(t.id);
				if (!n.carried) {
					let e = new Set(c);
					n.carried = [...jn.keys()].filter((t) => {
						let n = xt(t);
						return n.length && n.every((t) => e.has(t));
					});
				}
				for (let e of n.carried) {
					let t = Un(e);
					t && Rn.set(e, {
						x: t.x + o,
						y: t.y + s
					});
				}
				for (let e of c) {
					let t = _n.get(e);
					t && (t.x += o, t.y += s, t.fx = t.x, t.fy = t.y, A.current && A.current.setNodePosition(fe(t), t.x, t.y, { transient: !0 }));
				}
				Zi(), L.current && L.current();
			}).on("end", function(t, n) {
				let r = Vt(this).datum()._dragState;
				if (delete Vt(this).datum()._dragState, (r ? r.totalMove : 0) >= 4) {
					if (!r.moves) return;
					Qn = !1;
					let e = xt(n.id);
					if (De) {
						let t = new Set(e);
						for (let e of jn.keys()) {
							let n = xt(e);
							n.length && n.every((e) => t.has(e)) && nr(e);
						}
					}
					let t = A.current;
					for (let n of e) {
						let e = _n.get(n);
						e && (e.fx = e.x, e.fy = e.y, t && t.setNodePosition(fe(e), e.x, e.y, { transient: !0 }));
					}
					t && t.commit(), Zi();
				} else {
					if (ot()) return;
					let r = {
						c: n,
						closedNode: e,
						...Je(t.sourceEvent)
					};
					Xe(t.sourceEvent, () => We(c("container", "tap"), r), () => We(c("container", "doubletap"), r));
				}
			});
		}
		function pn(e, t) {
			t ? Mr([e.id], !0) : Mr([e.id], At.has(e.id));
		}
		qt.call(fn({ isCollapsed: !1 })), $t.call(fn({ isCollapsed: !0 })), qt.on("click", (e) => e.stopPropagation()), $t.on("click", (e) => e.stopPropagation());
		let mn = yo().curve(jo.alpha(.5)), hn = yo().curve(wo);
		function gn(e, t) {
			let n = [], r = Math.max(8, t);
			for (let t = 0; t < e.length; t++) {
				let i = e[t], a = e[(t + 1) % e.length];
				n.push(i);
				let o = Math.hypot(a[0] - i[0], a[1] - i[1]), s = Math.floor(o / r);
				for (let e = 1; e < s; e++) n.push([i[0] + (a[0] - i[0]) * e / s, i[1] + (a[1] - i[1]) * e / s]);
			}
			return n;
		}
		let _n = new Map(a.nodes.map((e) => [e.id, e])), vn = new Map((a.containers || []).map((e) => [e.id, e])), yn = (e) => {
			let t = 0, n = e.parent;
			for (; n && vn.has(n) && t < 20;) t++, n = vn.get(n).parent;
			return t;
		}, bn = s.labelSize && s.labelSize.min || 32, xn = s.labelSize && s.labelSize.max || 96, Sn = s.labelSize && s.labelSize.nestedScale || .75, Cn = () => {
			let e = /* @__PURE__ */ new Map();
			for (let t of a.containers || []) e.set(t.id, Array.from(yt.get(t.id) || []).map((e) => _n.get(e)).filter(Boolean).map((e) => ({
				id: e.id,
				w: e._size && e._size.width || (e.type === "article" ? p.width : e.size),
				h: e._size && e._size.height || (e.type === "article" ? p.height : e.size),
				order: Number.isFinite(e.series_part) ? e.series_part : null,
				date: e.date || ""
			})));
			return e;
		}, z = {
			roots: [],
			nodes: /* @__PURE__ */ new Map(),
			containers: /* @__PURE__ */ new Map()
		};
		function wn() {
			if (!a.containers || a.containers.length === 0) return;
			let e = Cn(), t = () => (0, Ks.containerLayout)({
				containers: a.containers,
				members: e,
				closed: At,
				labelSize: (e) => Gt(e, e._fs || bn, { family: Yt(e) }),
				macroSize: (e) => ({
					w: (e._macroHalfW || 130) * 2,
					h: (e._macroHalfH || 45) * 2
				}),
				options: {
					spacing: s.spiral?.spacing ?? 20,
					mode: P.current === "radial" ? "ring" : s.spiral?.mode || "path",
					startRadius: s.spiral?.startRadius,
					direction: s.spiral?.direction,
					gap: 28,
					padding: S,
					layoutOf: (e) => P.current === "force" ? (0, Ks.containerLayoutOf)(e, f) : null,
					hangOf: (e) => ({
						...f.hang || {},
						...e.hang || {}
					}),
					spiralOf: Tn
				}
			});
			for (let e of a.containers) e._fs = bn;
			let n = t();
			for (let e of a.containers) {
				let t = n.containers.get(e.id), r = t ? t.box.x1 - t.box.x0 : 0, i = xn * Sn ** +yn(e);
				if (e._fs = Math.max(bn, Math.min(Math.max(bn, i), r / 8)), t && t.hang) {
					let n = p.width + t.hang.gap;
					for (let t = 0; t < 40 && e._fs > bn && Gt(e, e._fs, { family: Yt(e) }).w > n; t++) e._fs = Math.max(bn, e._fs * .92);
				}
			}
			n = t(), z = n;
			for (let e of a.nodes) {
				let t = z.nodes.get(e.id);
				e._cardScale = t && t.scale > 0 ? t.scale : 1;
			}
		}
		function Tn(e) {
			let t = {
				...f.spiral || {},
				...e && e.spiral || {}
			};
			return {
				...t,
				keepBelowY: En(e, t)
			};
		}
		function En(e, t) {
			if (t.keepBelow !== "crown" || !e || !jn.has(e.id) || !(Mn && Mn.art && Number.isFinite(Mn.crownY)) || P.current !== "force") return null;
			let n = (0, lc.homeView)(Se), r = In(), i = (0, lc.anchorWorld)(jn.get(e.id), Mn.art, n, r);
			return (0, lc.anchorWorld)({
				x: .5,
				y: Mn.crownY
			}, Mn.art, n, r).y - i.y;
		}
		let Dn = () => [f.spiral, ...(a.containers || []).map((e) => e.spiral)].some((e) => e && e.keepBelow === "crown");
		function On(e) {
			if (De && Nn()) {
				let t = 0, n = 0, r = 0;
				for (let i of jn.keys()) {
					let a = z.containers.get(i);
					if (!a || a.root !== e) continue;
					let o = kn(i);
					o && (t += o.x, n += o.y, r++);
				}
				if (r) return {
					x: t / r,
					y: n / r
				};
			}
			let t = 0, n = 0, r = 0;
			for (let [i, a] of z.nodes) {
				if (a.root !== e) continue;
				let o = _n.get(i);
				!o || !Number.isFinite(o.x) || !Number.isFinite(o.y) || (t += o.x - a.x, n += o.y - a.y, r++);
			}
			return r ? {
				x: t / r,
				y: n / r
			} : null;
		}
		function kn(e) {
			let t = 0, n = 0, r = 0;
			for (let i of xt(e)) {
				let e = z.nodes.get(i), a = _n.get(i);
				!e || !a || !Number.isFinite(a.x) || !Number.isFinite(a.y) || (t += a.x - e.x, n += a.y - e.y, r++);
			}
			return r ? {
				x: t / r,
				y: n / r
			} : null;
		}
		let An = () => s.spiral?.enabled !== !1 && (P.current === "force" || P.current === "radial"), jn = new Map(Object.entries(Ac(e)).filter(([e]) => vn.has(e))), Mn = typeof window < "u" && window.PostPipeCoverFrame || null, Nn = () => jn.size > 0 && !!(Mn && Mn.art) && An() && P.current === "force" && z.containers.size > 0, Pn = /* @__PURE__ */ new Map();
		for (let e of [...jn.keys()].sort((e, t) => yn(vn.get(t)) - yn(vn.get(e)))) for (let t of xt(e)) Pn.has(t) || Pn.set(t, e);
		De = !0;
		function Fn(e) {
			let t = z.containers.get(e), n = t && kn(e);
			return n ? {
				x: n.x + t.center.x,
				y: n.y + t.center.y
			} : null;
		}
		function In() {
			if (!C.current) return {
				x: 0,
				y: 0
			};
			let e = C.current.getBoundingClientRect(), t = typeof window < "u" && window.PostPipeCover && window.PostPipeCover.shift || 0;
			return {
				x: e.left,
				y: e.top - t
			};
		}
		function Ln() {
			let e = /* @__PURE__ */ new Map();
			if (!Nn()) return e;
			let t = (0, lc.homeView)(Se), n = In();
			for (let [r, i] of jn) e.set(r, (0, lc.anchorWorld)(i, Mn.art, t, n));
			return e;
		}
		let Rn = /* @__PURE__ */ new Map(), zn = /* @__PURE__ */ new Map();
		function Bn() {
			return Ie && Oe > 0 && Nn();
		}
		function Vn() {
			let e = Oe > 0 ? Oe : Se, t = Le() || [n / 2, r / 2], i = (0, lc.homeView)(e);
			return {
				x: (t[0] - i.x) / e,
				y: (t[1] - i.y) / e
			};
		}
		function Hn() {
			let e = Vn(), t = Io(d.node());
			return [t.x + t.k * e.x, t.y + t.k * e.y];
		}
		let Un = (e) => Rn.get(e) || Fn(e);
		function Wn() {
			if (zn = /* @__PURE__ */ new Map(), !Bn()) return;
			let e = ke.k / Oe;
			if (Math.abs(e - 1) < 1e-9) return;
			let t = Vn();
			for (let n of jn.keys()) {
				let r = Un(n);
				r && zn.set(n, (0, ec.growShift)(r, t, e));
			}
		}
		let Gn = {
			x: 0,
			y: 0
		}, Kn = (e) => zn.size && e && zn.get(Pn.get(e.id)) || Gn;
		function qn(e) {
			if (!zn.size || !e) return Gn;
			let t = e;
			for (let e = 0; t && e < 20; e++) {
				let e = zn.get(t.id);
				if (e) return e;
				t = t.parent ? vn.get(t.parent) : null;
			}
			return Gn;
		}
		let Jn = (e) => {
			let t = Kn(e);
			return t === Gn ? e : {
				x: e.x + t.x,
				y: e.y + t.y
			};
		};
		function Yn(e) {
			if (!Bn() || !(0, ec.growCapOn)(f)) return Infinity;
			let t = [];
			for (let n of jn.keys()) {
				let r = z.containers.get(n), i = vn.get(n);
				if (!r || !i || Er(i)) continue;
				let a = e && e.get(n) || Un(n);
				if (!a) continue;
				let o = a.x - r.center.x, s = a.y - r.center.y, c = At.has(n) ? 0 : .75 * sr;
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
			return Oe * (0, ec.growCap)(t, {
				gap: 16,
				homeK: Oe
			});
		}
		function Xn(e) {
			if (!Bn()) return;
			let t = Yn(e);
			ke.k > t + 1e-9 && lo(t / ke.k);
		}
		let Zn = /* @__PURE__ */ new Set(), Qn = !1, $n = (e) => de(P.current) + e, er = /* @__PURE__ */ new Set();
		function tr(e) {
			let t = A.current;
			if (!t) return er.has(e);
			let n = t.nodeState($n(e));
			return !!(n && !n.auto && Number.isFinite(n.x));
		}
		function nr(e) {
			let t = Fn(e), n = A.current;
			n && t ? n.setNodePosition($n(e), t.x, t.y, { transient: !0 }) : er.add(e);
		}
		let rr = /* @__PURE__ */ new Map();
		for (let e of jn.keys()) {
			let t = A.current;
			if (t && tr(e)) {
				let n = t.nodeState($n(e));
				for (let t of xt(e)) {
					if (Pn.get(t) !== e) continue;
					let n = _n.get(t);
					n && Number.isFinite(n.x) && Number.isFinite(n.y) && (n.fx = n.x, n.fy = n.y);
				}
				rr.set(e, {
					x: n.x,
					y: n.y
				});
			} else Zn.add(e);
		}
		function ir(e) {
			for (let [t, n] of e) {
				let e = Fn(t);
				if (!n || !e) continue;
				jn.has(t) && Rn.set(t, {
					x: n.x,
					y: n.y
				});
				let r = n.x - e.x, i = n.y - e.y;
				for (let e of xt(t)) {
					let t = _n.get(e);
					!t || !Number.isFinite(t.x) || !Number.isFinite(t.y) || (t.x += r, t.y += i, t.fx = t.x, t.fy = t.y, t.vx = 0, t.vy = 0);
				}
			}
		}
		function or(e) {
			let t = kn(e);
			if (t) for (let n of xt(e)) {
				if (Pn.get(n) !== e) continue;
				let r = z.nodes.get(n), i = _n.get(n);
				!r || !i || !Number.isFinite(i.x) || !Number.isFinite(i.y) || (i.x = t.x + r.x, i.y = t.y + r.y, i.vx = 0, i.vy = 0);
			}
		}
		let sr = Number.isFinite(Number(f.hull && f.hull.padding)) ? Number(f.hull.padding) : 24;
		function cr(e) {
			if (!Nn()) return e;
			let t = [];
			for (let n of jn.keys()) {
				let r = z.containers.get(n), i = e.get(n) || Fn(n);
				if (!r || !i) continue;
				let a = i.x - r.center.x, o = i.y - r.center.y, s = At.has(n) ? 0 : .75 * sr;
				t.push({
					id: n,
					box: {
						x0: r.box.x0 + a - s,
						y0: r.box.y0 + o - s,
						x1: r.box.x1 + a + s,
						y1: r.box.y1 + o + s
					},
					open: !At.has(n),
					fixed: tr(n),
					towards: Tn(vn.get(n)).openTowards
				});
			}
			let n = (0, Xs.actsApart)(t, { gap: 16 / Se });
			if (!n.size) return e;
			let r = new Map(e);
			for (let [e, t] of n) {
				let n = r.get(e) || Fn(e);
				n && r.set(e, {
					x: n.x + t.dx,
					y: n.y + t.dy
				});
			}
			return r;
		}
		function lr(e = [...jn.keys()]) {
			if (!Nn()) return !1;
			let t = cr(Ln());
			ir(e.map((e) => [e, t.get(e)]));
			for (let t of e) Zn.delete(t);
			return e.length, jn.size, !0;
		}
		function ur() {
			return rr.size ? (ir([...rr]), rr.clear(), !0) : !1;
		}
		let dr = () => jn.size ? [...jn.keys()] : (a.containers || []).filter((e) => e.parent && !vn.get(e.parent)?.parent).map((e) => e.id), fr = /* @__PURE__ */ new WeakMap();
		function pr(e) {
			let t = e.getAttribute("d") || "", n = fr.get(e);
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
			return fr.set(e, {
				d: t,
				pts: r
			}), r;
		}
		function mr(e, t, n) {
			if (!t) return Fn(e);
			let r = n.select(".container-macro-node").node(), i = n.node(), a = r && r.getScreenCTM ? r.getScreenCTM() : null, o = i && i.getScreenCTM ? i.getScreenCTM() : null;
			if (!a || !o) return Fn(e);
			let s = o.inverse();
			return {
				x: s.a * a.e + s.c * a.f + s.e,
				y: s.b * a.e + s.d * a.f + s.f
			};
		}
		function hr() {
			let e = [];
			if (!Ee) return {
				containers: e,
				k: he.current,
				homeK: Oe,
				moving: !1
			};
			let t = Nn() ? Ln() : null, n = !1;
			for (let r of dr()) {
				let i = Ct.filter((e) => e.id === r), a = i.node();
				if (!a || a.style.display === "none") continue;
				let o = At.has(r), s = i.select(o ? ".container-macro-bg" : ".container-hull").node();
				if (!s || !o && s.style.display === "none") continue;
				let c = pr(s), l = s.getScreenCTM();
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
					let e = t.get(r), a = mr(r, o, i);
					a && e && (p.drift = {
						x: a.x - e.x,
						y: a.y - e.y
					});
					let s = Fn(r);
					a && s && Math.hypot(a.x - s.x, a.y - s.y) > .25 && (n = !0);
				}
				e.push(p);
			}
			return {
				containers: e,
				k: he.current,
				homeK: Oe,
				moving: n
			};
		}
		function gr() {
			typeof window > "u" || window.dispatchEvent(new CustomEvent("graph:world"));
		}
		typeof window < "u" && (window.PostPipeGraphWorld = { snapshot: hr });
		function _r() {
			function e(e) {
				if (!An() || P.current !== "force") return;
				let t = s.spiral?.strength ?? .35, n = /* @__PURE__ */ new Map();
				if (Nn()) for (let e of jn.keys()) n.set(e, kn(e));
				for (let r of z.roots) {
					let i = On(r);
					for (let [a, o] of z.nodes) {
						if (o.root !== r) continue;
						let s = _n.get(a);
						if (!s || !Number.isFinite(s.x)) continue;
						let c = Pn.get(a), l = c && n.get(c) || i;
						l && (s.vx += (l.x + o.x - s.x) * t * e, s.vy += (l.y + o.y - s.y) * t * e);
					}
				}
			}
			return e.initialize = function() {}, e;
		}
		function vr() {
			let e = [], t = (e) => e.type === "article" ? Math.hypot(e._size?.width || p.width, e._size?.height || p.height) / 2 * (e._cardScale || 1) : e._r || (e.size || 60) / 2;
			function n(n) {
				if (!a.containers || a.containers.length === 0) return;
				let r = [];
				for (let e of z.roots) {
					let t = z.containers.get(e), n = On(e);
					if (!t || !n) continue;
					let i = xt(e).map((e) => _n.get(e)).filter((e) => e && Number.isFinite(e.x));
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
				let c = new Set(z.nodes.keys()), l = (e.length ? e : a.nodes).filter((e) => !c.has(e.id) && Number.isFinite(e.x));
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
		a.containers && a.containers.length > 0 && (wn(), pt.force("containerSeparation", vr()), pt.force("containerLayout", _r()));
		let yr = /* @__PURE__ */ new Set(), br = (e) => (z.nodes.get(e) || {}).root || null, xr = (e) => typeof e == "object" ? e.id : e;
		function Sr() {
			yr = /* @__PURE__ */ new Set();
			for (let e of At) for (let t of xt(e)) yr.add(t);
			pt.force("collide").radius((e) => yr.has(e.id) || e._groupedInto ? 0 : z.nodes.has(e.id) && e.type === "article" ? Math.min(e._size?.width || p.width, e._size?.height || p.height) / 2 * (e._cardScale || 1) : dt(e)), pt.force("charge").strength((e) => yr.has(e.id) || e._groupedInto ? 0 : z.nodes.has(e.id) ? ut.chargeStrength * .05 : ut.chargeStrength);
		}
		if (z.nodes.size > 0) {
			Sr();
			let e = pt.force("link"), t = e.strength();
			e.strength((e) => {
				let n = br(xr(e.source));
				return n && n === br(xr(e.target)) ? 0 : t(e);
			});
		}
		ae.current = () => {
			let e = (0, Ys.tightened)(g, lt(), p);
			e.linkDistance === ut.linkDistance && e.chargeStrength === ut.chargeStrength && e.collidePadding === ut.collidePadding || (ut = e, pt.force("link").distance(ut.linkDistance), z.nodes.size > 0 ? Sr() : (pt.force("charge").strength(ft), pt.force("collide").radius(dt)), P.current === "force" && pt.alpha(Math.max(pt.alpha(), .3)).restart());
		};
		function Cr(e) {
			let t = n / 2;
			for (let i of z.roots) {
				let a = z.containers.get(i);
				if (!a) continue;
				let o = a.box.x1 - a.box.x0, s = t - (a.box.x0 + a.box.x1) / 2 + (t === n / 2 ? 0 : o / 2), c = r / 2 - (a.box.y0 + a.box.y1) / 2;
				for (let [t, n] of z.nodes) {
					if (n.root !== i) continue;
					let r = _n.get(t);
					r && (e || !Number.isFinite(r.x) || !Number.isFinite(r.y)) && (r.x = s + n.x, r.y = c + n.y, r.vx = 0, r.vy = 0);
				}
				t += (t === n / 2 ? o / 2 : o) + 200;
			}
		}
		z.nodes.size > 0 && Cr(ct);
		function wr() {
			if (!a.containers || a.containers.length === 0 || (wn(), Sr(), z.nodes.size === 0)) return null;
			let e = {}, t = 0;
			for (let n of z.roots) {
				let r = z.containers.get(n);
				if (!r) continue;
				let i = t - r.box.x0, a = -(r.box.y0 + r.box.y1) / 2;
				for (let [t, r] of z.nodes) r.root === n && (e[t] = {
					x: i + r.x,
					y: a + r.y
				});
				t += r.box.x1 - r.box.x0 + 200;
			}
			let n = a.nodes.filter((e) => !z.nodes.has(e.id) && !e._groupedInto);
			if (n.length) {
				let r = (0, Gs.radialLayout)(n, {
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
		function Tr() {
			!a.containers || a.containers.length === 0 || (wn(), Sr());
		}
		function Er(e) {
			let t = e.parent, n = 0;
			for (; t && n++ < 20;) {
				if (At.has(t)) return !0;
				t = vn.get(t)?.parent;
			}
			return !1;
		}
		function Dr() {
			if (St.length === 0) return;
			Wn(), gr();
			let e = An() && z.containers.size > 0, t = (t) => {
				let n = e ? z.containers.get(t.id) : null, r = n ? kn(t.id) : null;
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
				let r = xt(e.id).map((e) => _n.get(e)).filter((e) => e && Number.isFinite(e.x));
				return r.length ? {
					x: x(r, (e) => e.x),
					y: x(r, (e) => e.y)
				} : null;
			};
			Ct.each(function(e) {
				let r = Vt(this), i = xt(e.id).map((e) => _n.get(e)).filter((e) => e && Number.isFinite(e.x) && Number.isFinite(e.y));
				if (i.length === 0 || Er(e)) {
					r.style("display", "none"), Mt.delete(e.id);
					return;
				}
				let a = At.has(e.id), o = e._fs || 52, s = t(e), c = qn(e);
				r.attr("transform", c.x || c.y ? `translate(${c.x}, ${c.y})` : null);
				let l = (e) => e && (c.x || c.y) ? {
					x: e.x + c.x,
					y: e.y + c.y
				} : e, u = (e) => {
					let t = Jn(e);
					return {
						x: t.x - c.x,
						y: t.y - c.y
					};
				};
				if (a) {
					let t = n(e);
					jt.set(e.id, l(t)), Mt.set(e.id, l(t)), r.style("display", null), r.select(".container-hull").style("display", "none"), r.select(".container-hull-ghost").attr("d", ""), r.select(".container-badge").style("display", "none"), r.select(".container-macro-node").style("display", null).attr("transform", `translate(${t.x}, ${t.y})${Ae()}${tn === 1 ? "" : ` scale(${tn})`}`).select(".label-count").text((0, Zs.containerCountText)(f, i.length));
					return;
				}
				let d = x(i, (e) => Jn(e).x), m = x(i, (e) => Jn(e).y);
				jt.set(e.id, {
					x: d,
					y: m
				}), r.style("display", null), r.select(".container-macro-node").style("display", "none"), r.select(".container-hull").style("display", null), r.select(".container-badge").style("display", null);
				let h = [], g = S(e);
				for (let t of vt.get(e.id) || []) {
					if (!At.has(t)) continue;
					let e = vn.get(t), r = e && n(e);
					if (!r) continue;
					let i = qn(e), a = {
						x: r.x + i.x - c.x,
						y: r.y + i.y - c.y
					}, o = (e._macroHalfW || 130) + g / 2, s = (e._macroHalfH || 45) + g / 2;
					h.push([a.x - o, a.y - s], [a.x + o, a.y - s], [a.x + o, a.y + s], [a.x - o, a.y + s]);
				}
				let _ = i.filter((e) => {
					for (let t of At) if (xt(t).includes(e.id)) return !1;
					return !0;
				});
				for (let e of _) {
					let t = e._cardScale || 1, n = (e._size?.width || (e.type === "article" ? p.width : e.size)) * t, r = (e._size?.height || (e.type === "article" ? p.height : e.size)) * t, i = n / 2 + g, a = r / 2 + g, o = u(e);
					h.push([o.x - i, o.y - a], [o.x + i, o.y - a], [o.x + i, o.y + a], [o.x - i, o.y + a]);
				}
				let v = Mc(e), C = null;
				if (s) {
					let n = g / 2, r = [], i = (e) => {
						for (let n of vt.get(e) || []) {
							if (At.has(n)) continue;
							let e = vn.get(n), a = e && t(e), o = e ? qn(e) : Gn;
							a && Mc(e) !== "hidden" && r.push({
								L: a.info.label,
								off: {
									x: a.off.x + o.x - c.x,
									y: a.off.y + o.y - c.y
								}
							}), i(n);
						}
					};
					i(e.id);
					for (let { L: e, off: t } of r) h.push([t.x + e.x0 - n, t.y + e.y0 - n], [t.x + e.x1 + n, t.y + e.y0 - n], [t.x + e.x1 + n, t.y + e.y1 + n], [t.x + e.x0 - n, t.y + e.y1 + n]);
					let a = s.info.label;
					C = {
						x: s.off.x + (a.x0 + a.x1) / 2,
						y: s.off.y + (a.y0 + a.y1) / 2
					}, v === "center" && h.push([s.off.x + a.x0 - n, s.off.y + a.y0 - n], [s.off.x + a.x1 + n, s.off.y + a.y0 - n], [s.off.x + a.x1 + n, s.off.y + a.y1 + n], [s.off.x + a.x0 - n, s.off.y + a.y1 + n]);
				}
				if (h.length === 0) {
					r.select(".container-hull-ghost").attr("d", ""), r.select(".container-hull").style("display", "none"), r.select(".container-badge").style("display", "none");
					return;
				}
				let w = uo(h);
				if (!w || w.length < 3) return;
				let T = !!(s && s.info.hang);
				T && (w = gn(w, g / 2));
				let E = T ? hn : mn;
				(0, Ks.hullDrawn)(e) ? (r.select(".container-hull").style("display", null).attr("d", E(w)), r.select(".container-hull-ghost").attr("d", Ot ? E((0, Zo.jitterPoints)(w, e.id, 3.5)) : "")) : (r.select(".container-hull").style("display", "none").attr("d", ""), r.select(".container-hull-ghost").attr("d", ""));
				let D = r.select(".container-badge");
				D.attr("data-label-position", v), D.select(".label-count").text((0, Zs.containerCountText)(f, i.length));
				let O = (t) => {
					let n = Gt(e, t, { family: Yt(e) });
					D.select(".container-badge-hit").attr("x", -n.w / 2).attr("y", -n.h / 2).attr("width", n.w).attr("height", n.h);
				};
				if (v === "hidden") {
					D.style("display", "none"), Mt.set(e.id, l(C || {
						x: x(w, (e) => e[0]),
						y: x(w, (e) => e[1])
					}));
					return;
				}
				if (v === "top") {
					let t = C ? o : Math.max(bn, Math.min(xn, (y(w, (e) => e[0]) - b(w, (e) => e[0])) / 8)), n = Gt(e, t, { family: Yt(e) }), r = b(w, (e) => e[1]), i = {
						x: (b(w, (e) => e[0]) + y(w, (e) => e[0])) / 2,
						y: r + g * .5 + n.h / 2
					};
					D.select(".container-badge-text").attr("font-size", `${t}px`), O(t), D.attr("transform", `translate(${i.x}, ${i.y})${Ae()}`), Mt.set(e.id, l(i));
					return;
				}
				if (C) {
					D.select(".container-badge-text").attr("font-size", `${o}px`), O(o), D.attr("transform", `translate(${C.x}, ${C.y})${Ae()}`), Mt.set(e.id, l(C));
					return;
				}
				let k = Math.min(...w.map((e) => e[1])), A = Math.max(...w.map((e) => e[1])), j = Math.min(...w.map((e) => e[0])), ee = Math.max(...w.map((e) => e[0])), M = Math.max(bn, Math.min(xn, (ee - j) / 8));
				D.select(".container-badge-text").attr("font-size", `${M}px`), O(M);
				let N = oo(w), P = Number.isFinite(N[0]) ? N[0] : x(w, (e) => e[0]);
				D.attr("transform", `translate(${P}, ${k + (A - k) / 3})${Ae()}`), Mt.set(e.id, l({
					x: P,
					y: k + (A - k) / 3
				}));
			});
		}
		let Or = /* @__PURE__ */ new Set();
		function kr() {
			Or = (0, nc.closedMemberSet)(At, xt);
			for (let e of a.nodes) e._closedHidden = Or.has(e.id);
			Ti && Ti.style("display", (e) => Or.has(e.id) ? "none" : null), di.style("display", (e) => Or.has(e.id) ? "none" : null);
			let e = (e) => (0, nc.edgeHidden)(e, Or) ? "none" : null;
			Kr.style("display", e), Xr.style("display", e), Gr.style("display", e), $r.style("display", e), ri && (0, nc.edgeHidden)(ri, Or) && ui();
		}
		function Ar() {
			kr(), Lr(), Dr(), Zi();
		}
		function jr() {
			return Object.fromEntries((a.containers || []).map((e) => [e.id, At.has(e.id) ? "closed" : "open"]));
		}
		function Mr(e, t) {
			return Nr(t ? { open: e } : { close: e });
		}
		function Nr({ open: e = [], close: t = [] }) {
			let n = !1;
			for (let t of e) vn.has(t) && At.has(t) && (At.delete(t), n = !0);
			for (let e of t) vn.has(e) && !At.has(e) && (At.add(e), n = !0);
			return n ? (Ar(), Xn(Ir), typeof window < "u" && window.dispatchEvent(new CustomEvent("graph:containers-changed", { detail: jr() })), !0) : !1;
		}
		let Pr = () => (a.containers || []).map((e) => e.id), Fr = {
			openContainer: (e) => Mr([e], !0),
			closeContainer: (e) => Mr([e], !1),
			toggleContainer: (e) => Mr([e], At.has(e)),
			openAllContainers: () => Mr(Pr(), !0),
			closeAllContainers: () => Nr((0, nc.closeAllPlan)(a.containers)),
			getContainerState: jr
		};
		l && (l.current = Fr);
		let Ir = null;
		function Lr() {
			if (!a.containers || a.containers.length === 0) return;
			let e = new Map(z.roots.map((e) => [e, On(e)])), t = /* @__PURE__ */ new Map();
			if (Nn()) {
				let e = Ln();
				for (let n of jn.keys()) {
					let r = tr(n) ? Fn(n) : e.get(n) || Fn(n);
					r && t.set(n, r);
				}
			}
			if (dn(), wn(), Sr(), Nn() && (t = cr(t)), !An()) return;
			let n = [];
			for (let [e, r] of t) {
				let t = Un(e);
				n.push({
					cId: e,
					x0: t ? t.x : r.x,
					y0: t ? t.y : r.y,
					x1: r.x,
					y1: r.y
				});
			}
			let r = (e) => {
				for (let t of n) Rn.set(t.cId, {
					x: t.x0 + (t.x1 - t.x0) * e,
					y: t.y0 + (t.y1 - t.y0) * e
				});
			};
			Ir = t;
			let i = [];
			for (let [e, n] of z.nodes) {
				let r = _n.get(e), a = Pn.get(e);
				if (!r || !Number.isFinite(r.x) || !a || !t.has(a)) continue;
				let o = t.get(a), s = z.containers.get(a);
				s && i.push({
					n: r,
					x0: r.x,
					y0: r.y,
					x1: o.x - s.center.x + n.x,
					y1: o.y - s.center.y + n.y
				});
			}
			if (!to && !i.length) {
				r(1), pt.alpha(Math.max(pt.alpha(), .3)).restart();
				return;
			}
			for (let [n, r] of z.nodes) {
				let a = _n.get(n), o = e.get(r.root), s = Pn.get(n);
				s && t.has(s) || !a || !o || !Number.isFinite(a.x) || i.push({
					n: a,
					x0: a.x,
					y0: a.y,
					x1: o.x + r.x,
					y1: o.y + r.y
				});
			}
			$i("container-relayout").duration(600).ease(ra).tween("container-relayout", () => (e) => {
				for (let t of i) t.n.x = t.x0 + (t.x1 - t.x0) * e, t.n.y = t.y0 + (t.y1 - t.y0) * e, t.n.fx = t.n.x, t.n.fy = t.n.y;
				r(e), Zi(), L.current && L.current();
			}).on("end", () => {
				ve || $a({ animate: !0 });
			});
		}
		function Rr(e) {
			let t = me.current === e.id, n = pe.current.has(e.id), r = Fc(he.current);
			if (r === "marker" && !t && !n) return {
				w: 8,
				h: 8
			};
			let i = e._size || M({
				hovered: t,
				pinned: n,
				lod: r
			}), a = e._cardScale || 1;
			return {
				w: i.width / 2 * a,
				h: i.height / 2 * a
			};
		}
		function zr(e) {
			let t = typeof e.source == "object" ? Jn(e.source) : null, n = typeof e.target == "object" ? Jn(e.target) : null, r = t ? t.x : 0, i = t ? t.y : 0, a = n ? n.x : 0, o = n ? n.y : 0, s = typeof e.source == "object" ? e.source.id : e.source, c = typeof e.target == "object" ? e.target.id : e.target;
			if ((0, nc.edgeHidden)(e, Or)) return {
				x1: 0,
				y1: 0,
				x2: 0,
				y2: 0,
				hidden: !0
			};
			let l = null, u = null;
			for (let e of At) {
				let t = xt(e);
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
				let e = jt.get(l);
				e && (r = e.x, i = e.y);
			}
			if (u) {
				let e = jt.get(u);
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
			let m = d / p, h = f / p, g = Rr(e.source), _ = l ? 90 : g.w + 4, v = l ? 45 : g.h + 4, y = Math.min(Math.abs(m) > 1e-4 ? _ / Math.abs(m) : Infinity, Math.abs(h) > 1e-4 ? v / Math.abs(h) : Infinity), b = Rr(e.target), x = u ? 90 : b.w + 4, S = u ? 45 : b.h + 4, C = Math.min(Math.abs(m) > 1e-4 ? x / Math.abs(m) : Infinity, Math.abs(h) > 1e-4 ? S / Math.abs(h) : Infinity);
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
		function Br(e, t) {
			if (t.hidden) return "";
			if (e.layer !== "sequence") return `M ${t.x1} ${t.y1} L ${t.x2} ${t.y2}`;
			let n = t.x2 - t.x1, r = t.y2 - t.y1, i = Math.hypot(n, r);
			if (i < 2) return `M ${t.x1} ${t.y1} L ${t.x2} ${t.y2}`;
			let a = (t.x1 + t.x2) / 2, o = (t.y1 + t.y2) / 2, s = -r / i, c = n / i, l = Math.min(48, i * .12), u = a + s * l, d = o + c * l;
			return `M ${t.x1} ${t.y1} Q ${u} ${d} ${t.x2} ${t.y2}`;
		}
		let Hr = /* @__PURE__ */ new Map();
		function Ur(e) {
			if (!Hr.has(e)) {
				let t = "edge-arrow-" + Hr.size;
				h.append("marker").attr("id", t).attr("viewBox", "0 0 10 10").attr("refX", 9).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 13).attr("markerHeight", 13).attr("orient", "auto").append("path").attr("d", "M 0 1 L 10 5 L 0 9 z").style("fill", e).style("fill-opacity", .75), Hr.set(e, t);
			}
			return Hr.get(e);
		}
		let Wr = (e) => {
			if (e.layer !== "sequence") return "#8a8f9c";
			let t = typeof e.source == "object" ? e.source.id : e.source;
			return _n.get(t)?.containerColor || "var(--gv-accent, #d4af37)";
		}, Gr = ue.insert("g", ".containers-layer").attr("class", "link-hits").selectAll(".link-hit").data(a.links).enter().append("path").attr("class", "link-hit").attr("fill", "none").style("stroke", "transparent").style("stroke-width", "16px").style("pointer-events", "stroke").style("cursor", "default"), Kr = ue.selectAll(".link").data(a.links).enter().append("path").attr("class", (e) => [
			"link",
			e.layer ? `link-${e.layer}` : "",
			e.role ? `link-role-${e.role}` : ""
		].filter(Boolean).join(" ")).attr("fill", "none").attr("data-label", (e) => e.label).attr("marker-end", (e) => e.directed ? `url(#${Ur(Wr(e))})` : null).style("stroke", (e) => e.layer === "sequence" ? Wr(e) : null).style("stroke-opacity", (e) => e.layer === "sequence" ? .45 : null), qr = ue.append("g").attr("class", "readers-layer").style("display", "none"), Jr = ue.append("g").attr("class", "relations-layer").style("display", "none"), Yr = ue.insert("g", ".containers-layer").attr("class", "relation-hits"), Xr = ue.selectAll(".link-ghost").data(a.links).enter().insert("path", ".link-sequence-pulse").attr("class", "link-ghost").style("stroke", (e) => Wr(e)), Zr = (e) => `${xr(e.source)}>${xr(e.target)}`;
		function Qr() {
			Xr.attr("d", (e) => Ot && e._path ? (0, Zo.ghostOf)(e._path, Zr(e)) : "");
		}
		let $r = ue.selectAll(".link-sequence-pulse").data(a.links.filter((e) => e.layer === "sequence")).enter().append("path").attr("class", "link-sequence-pulse").attr("fill", "none").attr("pathLength", 100).style("stroke", (e) => {
			let t = typeof e.source == "object" ? e.source.id : e.source;
			return _n.get(t)?.containerColor || "#ffe066";
		}).style("filter", (e) => {
			let t = typeof e.source == "object" ? e.source.id : e.source;
			return `drop-shadow(0 0 4px ${_n.get(t)?.containerColor || "#ffd700"})`;
		}), ei = ue.append("g").attr("class", "edge-label").style("pointer-events", "none").style("display", "none"), ti = ei.append("rect").attr("fill", "rgba(15, 17, 26, 0.88)").attr("stroke-opacity", .6), ni = ei.append("text").attr("text-anchor", "middle").attr("dominant-baseline", "central").attr("font-family", "'Atkinson', sans-serif").attr("font-weight", 600).attr("letter-spacing", "0.04em"), ri = null, ii = null, ai = null;
		function oi() {
			if (!ri || !ii) return;
			let e = ii.getTotalLength ? ii.getTotalLength() : 0;
			if (!e) {
				ei.style("display", "none");
				return;
			}
			let t = ii.getPointAtLength(e / 2), n = he.current || 1, r = 13 / n, i = Wr(ri), a = String(ri.label).split("\n");
			if (a.length > 1) {
				let e = r * 1.35;
				ni.attr("font-size", r).style("fill", i).text(null), a.forEach((t, n) => {
					ni.append("tspan").attr("x", 0).attr("y", (n - (a.length - 1) / 2) * e).text(t);
				});
				let o = (a.reduce((e, t) => Math.max(e, t.length), 0) * .62 + 1.4) * r, s = e * a.length + r * .7;
				ti.attr("x", -o / 2).attr("y", -s / 2).attr("width", o).attr("height", s).attr("rx", r * .6).style("stroke", i).attr("stroke-width", 1 / n), ei.attr("transform", `translate(${t.x}, ${t.y})${Ae()}`).style("display", null);
				return;
			}
			ni.attr("font-size", r).style("fill", i).text(ri.label);
			let o = (ri.label.length * .62 + 1.4) * r, s = r * 1.7;
			ti.attr("x", -o / 2).attr("y", -s / 2).attr("width", o).attr("height", s).attr("rx", s / 2).style("stroke", i).attr("stroke-width", 1 / n), ei.attr("transform", `translate(${t.x}, ${t.y})${Ae()}`).style("display", null);
		}
		let si = !1;
		function ci(e, t) {
			clearTimeout(ai), ai = null, ri = e, ii = t, e && e.layer === "relation" ? (ei.raise(), si = !0) : li(), oi();
		}
		function li() {
			if (!si) return;
			si = !1;
			let e = ue.node().querySelector(":scope > .node");
			e && ue.node().insertBefore(ei.node(), e);
		}
		function ui() {
			clearTimeout(ai), ai = null, ri = null, ii = null, ei.style("display", "none"), li();
		}
		Gr.on("mouseenter", function(e, t) {
			ci(t, this);
		}).on("mouseleave", () => {
			ai || ui();
		}).on("click", function(e, t) {
			e.stopPropagation();
			let n = this;
			Xe(e, () => {
				ci(t, n), ai = setTimeout(() => {
					ai = null, ui();
				}, 2500);
			});
		});
		let di = ue.selectAll(".node").data(a.nodes).enter().append("g").attr("class", "node"), fi = ue.append("g").attr("class", "relation-more").attr("role", "button").style("display", "none").style("cursor", "pointer");
		fi.append("rect").attr("class", "relation-more-bg"), fi.append("text").attr("class", "relation-more-text").attr("text-anchor", "middle").attr("dominant-baseline", "central");
		let pi = nn().clickDistance(5).container(() => ue.node()).filter((e) => {
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
			let n = e.sourceEvent && e.sourceEvent.target, r = !!(n && n.closest && n.closest("[data-resize=\"1\"]")), i = t.type === "article" ? c(Ri(t), "drag", { edge: r }) : "node.move";
			if (t._dragMoves = i === "node.move", t._resizing = i === "node.resize", t._resizing) {
				let n = t._size || M({
					hovered: me.current === t.id,
					pinned: pe.current.has(t.id)
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
				}, Ai(t), A.current && A.current.setNodeSize(le(t), t._size.width, t._size.height, { transient: !0 }), Dr();
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
			t.x = e.x, t.y = e.y, t.fx = e.x, t.fy = e.y, A.current && A.current.setNodePosition(le(t), e.x, e.y, { transient: !0 });
			let n = Jn(t);
			di.filter((e) => e.id === t.id).attr("transform", "translate(" + n.x + "," + n.y + ")" + Ae()), Ti && Ti.filter((e) => e.id === t.id).style("transform", `translate3d(${n.x}px, ${n.y}px, 0px) rotate(var(--gv-unrot, 0deg))${t._cardScale && t._cardScale !== 1 ? ` scale(${t._cardScale})` : ""}`), L.current && L.current(), Kr.each(function(e) {
				let n = typeof e.source == "object" ? e.source.id : e.source, r = typeof e.target == "object" ? e.target.id : e.target;
				(n === t.id || r === t.id) && (e._path = Br(e, zr(e)), Vt(this).attr("d", e._path));
			}), Gr.attr("d", (e) => e._path || ""), Qr(), ui(), $r.each(function(e) {
				let n = typeof e.source == "object" ? e.source.id : e.source, r = typeof e.target == "object" ? e.target.id : e.target;
				if (n === t.id || r === t.id) {
					let t = zr(e);
					Vt(this).attr("d", Br(e, t));
				}
			}), Dr();
		}).on("end", (e, t) => {
			let n = A.current;
			if (t._resizing) {
				t._resizing = !1, n && n.commit(), Dr();
				return;
			}
			t.fx = t.x, t.fy = t.y, t._dragMoved && (n && (n.setNodePosition(fe(t), t.x, t.y, { transient: !0 }), n.commit()), Dr());
		});
		di.call(pi);
		let mi = d.append("text").style("font-family", "'Atkinson', sans-serif").style("visibility", "hidden"), hi = "'Atkinson', sans-serif", gi = typeof document < "u" ? document.createElement("canvas").getContext("2d") : null;
		function _i(e, t) {
			if (!gi) return {
				width: e.length * t * .5,
				ascent: t * .7,
				descent: t * .2
			};
			gi.font = "500 " + t + "px 'Atkinson', sans-serif";
			let n = gi.measureText(e);
			return {
				width: n.actualBoundingBoxLeft + n.actualBoundingBoxRight,
				ascent: n.actualBoundingBoxAscent,
				descent: n.actualBoundingBoxDescent
			};
		}
		let vi = [];
		function yi(e) {
			let { d: t, textEl: n, rectEl: r, lines: i, fontSize: a, lineH: o } = e, s = i.map((e) => _i(e, a)), c = i.map((e, t) => t * o), l = Math.min(...c.map((e, t) => e - s[t].ascent)), u = Math.max(...c.map((e, t) => e + s[t].descent)), d = -(l + u) / 2, f = l + d, p = u + d, h = Math.max(...s.map((e) => e.width));
			if (n.selectAll("tspan").each(function(e, t) {
				Vt(this).attr("y", c[t] + d);
			}), r.attr("x", -h / 2 - m.padding).attr("y", f - m.padding).attr("width", h + m.padding * 2).attr("height", p - f + m.padding * 2), e.formsEl) {
				let t = h / 2 + m.padding + 8;
				e.formsEl.attr("x", t), e.formsEl.selectAll("tspan").attr("x", t);
			}
			t._r = Math.hypot(h + m.padding * 2, p - f + m.padding * 2) / 2;
		}
		function bi(e, t) {
			let n = m.padding, r = m.maxWidth, i = m.maxLines, a = e.split(/(?<=-)|\s+/).filter(Boolean), o = (e) => e.join("").replace(/\s+$/, "").trim(), s = [e];
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
		let xi = (e, t) => e.length > 1 ? t * 1 : t * 1.1;
		function Si() {
			let e = d.append("text").style("font-family", hi).style("visibility", "hidden").style("font-size", m.fontSize + "px").style("font-weight", "500");
			return {
				widthOf: (t) => (e.text(t), e.node().getComputedTextLength()),
				remove: () => e.remove()
			};
		}
		function Ci(t, n, r) {
			let i = n.type === "tag" ? (0, mc.tagFormsLines)((0, mc.tagForms)(e._stone, n.concept || n.label, e.items)) : [];
			if (!i.length) return null;
			let a = Math.round(r * .65), o = a * 1.25, s = t.append("text").attr("class", "tag-forms").attr("text-anchor", "start").attr("dominant-baseline", "central").style("font-family", hi).style("font-size", a + "px").style("font-weight", "500").style("fill", "var(--text, #ccc)").style("pointer-events", "none").style("display", "none");
			return i.forEach((e, t) => {
				s.append("tspan").attr("y", (t - (i.length - 1) / 2) * o).text(e);
			}), s;
		}
		di.each(function(e) {
			let t = Vt(this);
			if (e.type !== "article") {
				let n = m.fontSize;
				mi.style("font-size", n + "px").style("font-weight", "500");
				let r = bi(e.label, (e) => (mi.text(e), mi.node().getComputedTextLength())), i = xi(r, n), a = t.append("text").attr("text-anchor", "middle").attr("fill", "#1a1a2e").style("font-family", hi).style("font-size", n + "px").style("font-weight", "500").style("pointer-events", "none");
				r.forEach((e) => {
					a.append("tspan").attr("x", 0).text(e);
				});
				let o = {
					d: e,
					el: t,
					textEl: a,
					rectEl: t.insert("rect", "text").attr("rx", m.cornerRadius).attr("ry", m.cornerRadius).attr("fill", "var(--gv-" + (e.type === "tag" ? "tag-color" : e.type === "topology" ? "topology-color" : "placeholder-color") + ")").attr("opacity", m.opacity),
					formsEl: Ci(t, e, n),
					lines: r,
					fontSize: n,
					lineH: i
				};
				vi.push(o), yi(o);
			} else {
				let t = M({
					hovered: !1,
					pinned: !1
				});
				e._r = Math.hypot(t.width, t.height) / 2;
			}
		}), mi.remove(), typeof document < "u" && document.fonts && document.fonts.ready && document.fonts.ready.then(() => {
			vi.forEach(yi);
		}).catch(() => {});
		let wi = /* @__PURE__ */ new Map(), Ti = F.selectAll(".node-card").data(a.nodes.filter((e) => e.type === "article")), Ei = Ti.enter().append("div").attr("class", "node-card").style("position", "absolute").style("left", "0").style("top", "0").style("will-change", "transform").style("pointer-events", "auto").style("touch-action", "manipulation").call(pi);
		Ti = Ti.merge(Ei), Ei.filter((e) => !!e.link).attr("tabindex", 0).attr("role", "link").attr("data-link-node", "").attr("aria-label", (e) => [
			e.title,
			e.subtitle,
			e.description
		].filter(Boolean).join(". ")).on("keydown", (e, t) => {
			e.key === "Enter" && (e.preventDefault(), e.stopPropagation(), (0, fc.followLink)(t.originalItem || t, { settings: bc() }));
		}), Ei.each(function(e) {
			let t = (0, v.createRoot)(this);
			wi.set(e.id, {
				root: t,
				wrapper: this,
				cardSelection: Vt(this)
			});
		});
		let Di = null, Oi = /* @__PURE__ */ new Map();
		function ki() {
			return Di !== oe.current && (Di = oe.current, Oi = (0, dc.countsByChapter)(Di)), Oi;
		}
		function Ai(e) {
			if (e.type !== "article") return;
			let t = wi.get(e.id);
			if (!t) return;
			let n = me.current === e.id, r = pe.current.has(e.id), i = Fc(he.current), a = M({
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
			let c = hs(e.kind), l = A.current, d = l ? l.bookmarks(le(e)) : [], m = f.readingProgress !== !1 && l && l.readingProgress ? l.readingProgress(le(e)) : null, h = ki().get(e.id) || 0;
			t.root.render(_.createElement(c, {
				article: e,
				sourceColor: Cc(e, j),
				width: o,
				height: s,
				viewState: {
					hovered: n,
					pinned: r,
					lod: i,
					zoomScale: he.current,
					bookmarks: d,
					bookmarkCount: d.length,
					progress: m,
					contributionCount: h
				},
				fullContent: e._fullContent || null,
				cardSettings: p,
				onResize: u ? ({ width: n, height: r }) => {
					e._customWidth = n, e._customHeight = r, e._size = {
						width: n,
						height: r
					}, t.wrapper.style.width = n + "px", t.wrapper.style.height = r + "px", t.wrapper.style.marginLeft = -n / 2 + "px", t.wrapper.style.marginTop = -r / 2 + "px", e._r = Math.max(n, r) / 2, Ai(e);
				} : void 0
			}));
		}
		Ti.on("wheel", (e) => e.stopPropagation());
		function ji() {
			a.nodes.forEach((e) => {
				e.type === "article" && Ai(e);
			});
		}
		te.current = ji;
		let Mi = /* @__PURE__ */ new Map();
		function Ni(e) {
			if ((e.originalItem && e.originalItem._posted) === "title") return e._fullContent = null, Promise.resolve();
			if (Mi.has(e.id)) return e._fullContent = Mi.get(e.id), Promise.resolve();
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
				Mi.set(e.id, i), e._fullContent = i;
			}).catch(() => {
				Mi.set(e.id, null), e._fullContent = null;
			});
		}
		ji(), pe.current.forEach((e) => {
			let t = a.nodes.find((t) => t.id === e);
			t && (Ti.filter((t) => t.id === e).raise().style("z-index", 10), Ni(t).then(() => {
				pe.current.has(e) && Ai(t);
			}));
		}), Oc(d, D, _e.current, j, ee()), Ti.on("mouseover", (e, t) => {
			me.current !== t.id && (me.current = t.id, Ai(t), e.currentTarget.style.zIndex = 10);
		}).on("mouseout", (e, t) => {
			let n = e.relatedTarget;
			n && e.currentTarget.contains(n) || me.current === t.id && (me.current = null, Ai(t), e.currentTarget.style.zIndex = "");
		}).on("dblclick", (e, t) => {
			if (e.stopPropagation(), e.preventDefault(), t.link || Date.now() - B < 300) return;
			let n = e.target;
			n && (n.dataset?.popout === "1" || n.closest?.("[data-popout=\"1\"]")) || (Ke.cancel(), Pi(t, e.currentTarget, Je(e)));
		}).on("click", (e, t) => {
			if (t.link) {
				e.stopPropagation(), Ke.cancel(), (0, fc.followLink)(t.originalItem || t, { settings: bc() });
				return;
			}
			let n = e.target;
			if (n && (n.dataset?.popout === "1" || n.closest?.("[data-popout=\"1\"]"))) {
				e.stopPropagation(), E.current && E.current(t.originalItem || t), pe.current.has(t.id) && (pe.current.delete(t.id), A.current && A.current.setNodePinned(le(t), !1), me.current = null, Ai(t), e.currentTarget.style.zIndex = "");
				return;
			}
			e.stopPropagation();
			let r = e.currentTarget, i = Je(e);
			Xe(e, () => We(c(Ri(t), "tap"), {
				d: t,
				cardEl: r,
				...i
			}), () => Pi(t, r, i));
		});
		let B = 0;
		function Pi(e, t, n) {
			B = Date.now(), We(c(Ri(e), "doubletap"), {
				d: e,
				cardEl: t,
				...n
			});
		}
		let Fi = (0, ac.readablePxOf)(f);
		function Ii(e) {
			let t = wi.get(e.id);
			if (!t) return 0;
			try {
				(0, Vr.flushSync)(() => Ai(e));
			} catch {}
			let n = t.wrapper.querySelector("[data-card-title]");
			return n && parseFloat(getComputedStyle(n).fontSize) || 0;
		}
		let Li = (e) => (0, ac.titleScreenPx)(Ii(e), ke.k, e._cardScale || 1), Ri = (e) => Li(e) >= Fi ? "node.readable" : "node";
		function zi(e, t) {
			let n = {
				x: e.x,
				y: e.y
			}, r = Bn() ? Pn.get(e.id) : null, i = r && jn.has(r) ? Un(r) : null;
			if (i && Oe > 0) {
				let e = (0, ec.growShift)(i, Vn(), t.k / Oe);
				n = {
					x: n.x + e.x,
					y: n.y + e.y
				};
			}
			let a = (0, Qs.viewToScreen)(t, Ce, n.x, n.y);
			return {
				x: a[0],
				y: a[1]
			};
		}
		function Bi(e, t, i, a = 0) {
			let o = wi.get(e.id);
			if (!o || a > 2) return;
			let s = e._cardScale || 1, c = Ii(e) || (Number.isFinite(p.labelMinFontSize) ? p.labelMinFontSize : 14), l = Io(d.node()), u = (0, ac.readableZoom)(l.k, (0, ac.titleScreenPx)(c, l.k, s), Fi, so);
			if (Bn() && (u = Math.min(u, Math.max(l.k, Yn()))), !(u > l.k * 1.000000001)) return;
			let [f, m] = co(), h = (0, $s.zoomAbout)(l, u / l.k, f, m), g = parseFloat(o.wrapper.style.width) || p.width, _ = parseFloat(o.wrapper.style.height) || p.height, v = Za(r), y = (0, ac.keepUnderFinger)({
				finger: Number.isFinite(t) && Number.isFinite(i) ? {
					x: t,
					y: i
				} : null,
				before: zi(e, l),
				after: zi(e, h),
				ratio: u / l.k,
				half: {
					w: g / 2 * u * s,
					h: _ / 2 * u * s
				},
				area: {
					x0: 0,
					y0: v.top,
					x1: n,
					y1: r - v.bottom
				}
			}), b = Fo.translate(h.x + y.x, h.y + y.y).scale(h.k);
			ve = !0, ye = !1, d.transition("key-zoom").duration(320).ease(na).call(Pe.transform, b, [f, m]).on("end", () => setTimeout(() => {
				Li(e) < Fi && Bi(e, t, i, a + 1);
			}, 80));
		}
		function Vi(e) {
			B = Date.now(), E.current && E.current(e.originalItem || e);
		}
		function Hi(e, t) {
			pe.current.has(e.id) ? (pe.current.delete(e.id), A.current && A.current.setNodePinned(le(e), !1), Ai(e), t.style.zIndex = "", O.current === e.id && k(null)) : (pe.current.add(e.id), k(e), A.current && A.current.setNodePinned(le(e), !0), Ai(e), di.filter((t) => t.id === e.id).raise(), Ti.filter((t) => t.id === e.id).raise(), t.style.zIndex = 10, Ni(e).then(() => {
				pe.current.has(e.id) && Ai(e);
			}));
		}
		let Ui = null, Wi = null;
		function Gi() {
			di.select(".tag-forms").style("display", (e) => e && (e.id === Ui || e.id === Wi) ? null : "none");
		}
		di.filter((e) => e.type === "tag").on("mouseenter", (e, t) => {
			Wi = t.id, Gi();
		}).on("mouseleave", (e, t) => {
			Wi === t.id && (Wi = null, Gi());
		}), di.filter((e) => e.type !== "article").on("click", (e, t) => {
			e.stopPropagation(), Xe(e, () => Ki(t));
		});
		function Ki(e) {
			Ui = Ui === e.id ? null : e.id, ua = !1, va({ force: !0 }), Gi(), Ji();
		}
		function qi() {
			if (!Ui) {
				di.classed("dimmed", !1).classed("tag-active", !1), Ti.classed("dimmed", !1), Kr.classed("highlighted", !1);
				return;
			}
			let e = Ui, t = new Set(a.links.filter((t) => {
				let n = typeof t.source == "object" ? t.source.id : t.source, r = typeof t.target == "object" ? t.target.id : t.target;
				return n === e || r === e;
			}).map((t) => {
				let n = typeof t.source == "object" ? t.source.id : t.source, r = typeof t.target == "object" ? t.target.id : t.target;
				return n === e ? r : n;
			}));
			t.add(e);
			for (let e of da) t.add(e.id);
			di.classed("dimmed", (e) => !t.has(e.id)), di.classed("tag-active", (t) => t.id === e), Ti.classed("dimmed", (e) => !t.has(e.id)), Kr.classed("highlighted", (t) => {
				let n = typeof t.source == "object" ? t.source.id : t.source, r = typeof t.target == "object" ? t.target.id : t.target;
				return n === e || r === e;
			});
		}
		function Ji() {
			typeof window > "u" || window.dispatchEvent(new CustomEvent("graph:tag-changed", { detail: { id: Ui } }));
		}
		d.on("click", (e) => {
			let t = Je(e);
			Xe(e, () => We(c("space", "tap"), t));
		});
		function Yi() {
			ui(), Ui && (Ui = null, ua = !1, va({ force: !0 }), Gi(), Ji()), E.current && E.current(null);
		}
		function Xi() {
			Kr.each(function(e) {
				e._path = Br(e, zr(e)), Vt(this).attr("d", e._path);
			}), Gr.attr("d", (e) => e._path || ""), $r.attr("d", (e) => e._path || ""), Qr(), ri && oi();
		}
		function Zi() {
			Wn(), Xi(), di.attr("transform", (e) => {
				let t = Jn(e);
				return "translate(" + t.x + "," + t.y + ")" + Ae();
			}), Ti && Ti.style("transform", (e) => {
				let t = Jn(e);
				return `translate3d(${t.x}px, ${t.y}px, 0px) rotate(var(--gv-unrot, 0deg))${e._cardScale && e._cardScale !== 1 ? ` scale(${e._cardScale})` : ""}`;
			}), Dr(), ne.current && ne.current(), se.current && se.current(), ce.current && ce.current({ paintOnly: !0 }), ta();
		}
		let Qi = null;
		function ea() {
			if (Qi = null, typeof document > "u") return;
			let e = document.querySelector("[data-rights][data-rights-position=\"bottom-edge\"]");
			if (!e) return;
			let t = [];
			Ti && Ti.each(function(e) {
				e._closedHidden || this.style.display === "none" || t.push(this.getBoundingClientRect());
			});
			let n = (0, pc.rightsOverCards)(e.getBoundingClientRect(), t);
			n !== e.hasAttribute("data-rights-over") && e.toggleAttribute("data-rights-over", n);
		}
		function ta() {
			Qi || typeof requestAnimationFrame > "u" || (Qi = requestAnimationFrame(ea));
		}
		function ia() {
			let e = A.current;
			return !!(e && e.preference && e.preference("readers") === !0);
		}
		let aa = [];
		function oa() {
			qr.selectAll("*").remove(), aa = (0, dc.connectionEdges)(oe.current).map((e) => {
				let t = _n.get(e.source), n = _n.get(e.target);
				if (!t || !n) return null;
				let r = qr.append("g").attr("class", "readers-edge").attr("data-readers-edge", e.id);
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
		function sa({ rebuild: e = !1 } = {}) {
			e && oa();
			let t = ia();
			if (qr.style("display", t && aa.length ? null : "none").attr("data-on", t ? "true" : "false"), t) for (let e of aa) {
				let t = zr(e.l), n = t.hidden ? "" : `M ${t.x1} ${t.y1} L ${t.x2} ${t.y2}`;
				e.line.attr("d", n);
			}
		}
		se.current = sa, oa();
		let ca = /* @__PURE__ */ new Map();
		di.each(function(e) {
			ca.set(e.id, this);
		});
		let la = new Map(vi.map((e) => [e.d.id, e])), ua = !1, da = [], fa = "";
		function pa(e) {
			let t = _n.get(e);
			if (!t || t.type !== "tag" || t._groupedInto) return !1;
			let n = ca.get(e);
			return !!(n && n.style.display !== "none");
		}
		function ma() {
			return !Ui || !a.relations.length || !pa(Ui) ? null : (0, yc.relativesOf)(a.relations, Ui, {
				visible: pa,
				limit: ua ? Infinity : yc.STRONGEST
			});
		}
		function ha(e, t, n) {
			let r = la.get(e);
			if (!r) return 0;
			let i = (Number(r.rectEl.attr("width")) || 0) / 2 + 2, a = (Number(r.rectEl.attr("height")) || 0) / 2 + 2, o = Ce * Math.PI / 180, s = t * Math.cos(o) - n * Math.sin(o), c = t * Math.sin(o) + n * Math.cos(o);
			return Math.min(Math.abs(s) > 1e-4 ? i / Math.abs(s) : Infinity, Math.abs(c) > 1e-4 ? a / Math.abs(c) : Infinity);
		}
		function ga(e) {
			if (ri && ri.layer === "relation" && ui(), Jr.selectAll("*").remove(), Yr.selectAll("*").remove(), da = [], fi.style("display", "none"), !e || !e.relatives.length) {
				Jr.style("display", "none");
				return;
			}
			Jr.style("display", null);
			for (let t of e.relatives) {
				let e = t.broader === Ui ? t.id : Ui, n = e === Ui ? t.id : Ui, r = [...new Set(t.relations.map((e) => e.layer))], i = {
					source: _n.get(e),
					target: _n.get(n),
					layer: "relation",
					directed: t.broader !== null,
					label: (0, yc.relationLabel)(t.relations)
				}, a = Jr.append("path").attr("class", ["relation-line", ...r.map((e) => `relation-${e}`)].join(" ")).attr("fill", "none").attr("data-relation", t.id).attr("data-relation-types", r.join(" ")).attr("marker-end", i.directed ? "url(#relation-arrow)" : null), o = Yr.append("path").attr("class", "relation-hit").attr("fill", "none").attr("data-relation", t.id).style("stroke", "transparent").style("stroke-width", "16px").style("pointer-events", "stroke").style("cursor", "default").on("mouseenter", function() {
					ci(i, this);
				}).on("mouseleave", () => {
					ai || ui();
				}).on("click", function(e) {
					e.stopPropagation();
					let t = this;
					Xe(e, () => {
						ci(i, t), ai = setTimeout(() => {
							ai = null, ui();
						}, 2500);
					});
				});
				da.push({
					id: t.id,
					l: i,
					line: a,
					hit: o
				});
			}
			let t = ua ? Math.max(0, e.total - yc.STRONGEST) : e.more;
			t > 0 && (fi.attr("data-relation-more", ua ? "all" : "strongest").attr("aria-expanded", ua ? "true" : "false").attr("aria-label", ua ? `${yc.STRONGEST} related tags` : `${e.total} related tags`).style("display", null), fi.select("text").text(`${ua ? "−" : "+"}${t}`));
		}
		function _a() {
			if (!da.length) return;
			for (let e of da) {
				let t = e.l.source, n = e.l.target, r = "";
				if (t && n) {
					let e = Jn(t), i = Jn(n), a = i.x - e.x, o = i.y - e.y, s = Math.hypot(a, o);
					if (s > 1) {
						let c = a / s, l = o / s, u = ha(t.id, c, l), d = ha(n.id, c, l);
						s > u + d + 2 && (r = `M ${e.x + c * u} ${e.y + l * u} L ${i.x - c * d} ${i.y - l * d}`);
					}
				}
				e.line.attr("d", r), e.hit.attr("d", r);
			}
			let e = Ui ? _n.get(Ui) : null;
			if (e && fi.style("display") !== "none") {
				let t = he.current || 1, n = la.get(e.id), r = Math.max(m.fontSize * .6, 12 / t), i = (fi.select("text").text().length * .62 + 1.6) * r, a = r * 1.6, o = (n ? (Number(n.rectEl.attr("y")) || 0) + (Number(n.rectEl.attr("height")) || 0) : m.fontSize) + a / 2 + 4 / t;
				fi.select("rect").attr("x", -i / 2).attr("y", -a / 2).attr("width", i).attr("height", a).attr("rx", a / 2).attr("stroke-width", 1 / t), fi.select("text").attr("font-size", r);
				let s = Jn(e);
				fi.attr("transform", `translate(${s.x}, ${s.y})${Ae()} translate(0, ${o})`);
			}
			ri && ri.layer === "relation" && oi();
		}
		function va({ force: e = !1, paintOnly: t = !1 } = {}) {
			if (e || !t) {
				let t = ma(), n = t ? [
					Ui,
					ua ? "all" : "strongest",
					t.more,
					...t.relatives.map((e) => e.id)
				].join("\0") : "";
				(e || n !== fa) && (fa = n, ga(t), qi());
			}
			_a();
		}
		function ba(e) {
			e && (e.stopPropagation(), e.preventDefault()), ua = !ua, va({ force: !0 });
		}
		fi.attr("tabindex", 0).on("click", (e) => ba(e)).on("dblclick", (e) => {
			e.stopPropagation(), e.preventDefault();
		}).on("keydown", (e) => {
			(e.key === "Enter" || e.key === " ") && ba(e);
		}), ce.current = va;
		let xa = f.roots ? f.roots === !0 ? {} : f.roots : null, Sa = [], Ca = null, wa = !1;
		if (xa) {
			let e = /* @__PURE__ */ new Map();
			for (let [t, n] of yt) for (let r of n) e.set(r, t);
			let t = a.links.filter((e) => e.layer === "sequence").map((e) => ({
				source: xr(e.source),
				target: xr(e.target)
			})), n = (a.containers || []).find((e) => !e.parent), r = String(xa.seed || n && n.id || "roots");
			Sa = (0, sc.rootSegments)({
				containers: a.containers || [],
				memberOf: e,
				sequence: t
			}).map((e) => {
				let t = gt.append("g").attr("class", "root").attr("data-root", e.key).style("display", "none");
				return {
					...e,
					shape: (0, sc.rootShape)(r + "|" + e.key),
					el: t,
					main: t.append("path").attr("class", "root-main").attr("fill", "none").attr("vector-effect", "non-scaling-stroke"),
					fine: t.append("path").attr("class", "root-fine").attr("fill", "none").attr("vector-effect", "non-scaling-stroke"),
					state: "hidden"
				};
			});
		}
		function Ta(e) {
			if (e.node) {
				let t = _n.get(e.node);
				if (!t || !Number.isFinite(t.x) || Or.has(t.id) || t._source && _e.current.has(t._source.id)) return null;
				let n = Jn(t);
				return {
					x: n.x,
					y: n.y
				};
			}
			return Mt.get(e.container) || null;
		}
		function Ea(e) {
			let t = A.current;
			if (!t || !t.readingProgress) return "hidden";
			let n = (e) => {
				let n = _n.get(e);
				return n ? t.readingProgress(le(n)) : {
					seen: !1,
					done: !1
				};
			};
			if (e.node) {
				let t = n(e.node);
				return t.done ? "done" : t.seen || t.max > 0 ? "seen" : "hidden";
			}
			let r = xt(e.container).map(n);
			return !r.length || !r.some((e) => e.seen || e.max > 0) ? "hidden" : r.every((e) => e.done) ? "done" : "seen";
		}
		function Da() {
			if (Ca = null, Sa.length) {
				for (let e of Sa) {
					let t = Ea(e.reach), n = Ta(e.from), r = Ta(e.to);
					if (t === "hidden" || !n || !r) {
						e.el.style("display", "none"), t === "hidden" && (e.state = "hidden");
						continue;
					}
					let i = (0, sc.rootPath)(n, r, e.shape);
					if (e.main.attr("d", i.main), e.fine.attr("d", i.fine), e.el.style("display", null).attr("data-state", t), e.state === "hidden" && wa) {
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
				wa = !0;
			}
		}
		function Oa() {
			!Sa.length || Ca || (Ca = typeof requestAnimationFrame < "u" ? requestAnimationFrame(Da) : setTimeout(Da, 16));
		}
		ne.current = xa ? Oa : null;
		let ka = !1;
		N.current = {
			data: a,
			nodes: di,
			articleNodes: Ti,
			links: Kr,
			applyPositions: Zi,
			svg: d,
			zoom: Pe,
			fitToViewport: $a,
			simulation: pt,
			axisLayer: ht,
			g: ue,
			updateContainers: Dr,
			ringTargets: wr,
			recomputeContainers: Tr,
			toScreen: Ne,
			drawnAt: Jn
		}, Ee = !0;
		function Aa() {
			if (Mn = typeof window < "u" && window.PostPipeCoverFrame || null, !Nn()) return;
			pt.force("center", null);
			let e = [...jn.keys()].filter((e) => Zn.has(e) || !tr(e));
			if (Dn()) {
				wn(), Sr();
				for (let t of e) or(t);
			}
			let t = ur();
			e.length && lr(e), (e.length || t) && Zi(), ve || Qa(!1);
		}
		window.addEventListener("postpipe:cover-frame", Aa), Aa();
		let ja = () => ta();
		window.addEventListener("postpipe:cover", ja), window.addEventListener("resize", ja);
		let Ma = !1, Na = new Map(a.nodes.map((e) => [e.id, e]));
		function Pa() {
			if (Ma || P.current !== "force") return !1;
			let e = [];
			for (let t of a.nodes) {
				if (t.type !== "article" || !pe.current.has(t.id) || t._closedHidden || !Number.isFinite(t.x) || !Number.isFinite(t.y)) continue;
				let n = t._size || M({
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
			let t = (0, oc.separateOpen)(e, { gap: 12 });
			for (let [e, n] of t) {
				let t = Na.get(e);
				t && (t.x = n.x, t.y = n.y, t.vx = 0, t.vy = 0, t.fx != null && (t.fx = n.x), t.fy != null && (t.fy = n.y));
			}
			return t.size > 0;
		}
		let Fa = 0;
		pt.nodes(a.nodes).on("tick", () => {
			Pa(), Zi(), ka ||= $a({ initialZoomOut: !0 }), L.current && L.current(), ++Fa, I.current && Fa % 25 == 0 && I.current();
		}), pt.force("link").links(a.links);
		let Ia = e && e._stone, La = vi.filter((e) => e.d.type === "tag" && e.d.concept), Ra = a.links.filter((e) => e.layer === "tag"), za = {
			scheme: hc.SITE_SCHEME,
			depth: 0
		}, Ba = new Set((0, hc.schemesOf)(e).map((e) => e.id)), Va = () => {
			let e = A.current, t = e && e.preference ? e.preference("conceptScheme") : null, n = e && e.preference ? Number(e.preference("broaderDepth")) : 0;
			return {
				scheme: typeof t == "string" && t && Ba.has(t) ? t : hc.SITE_SCHEME,
				depth: Number.isFinite(n) ? Math.max(0, Math.min(2, Math.round(n))) : 0
			};
		}, Ha = (e) => Number.isFinite(e) && e > 0 ? e : 0;
		function Ua(e, t, n) {
			let { d: r, el: i, textEl: a, fontSize: o } = e, s = t || r.label;
			if (r._shownLabel === s && !!e.fallback == !!n) return;
			r._shownLabel = s, e.fallback = !!n;
			let c = Si(), l = bi(s, c.widthOf);
			c.remove(), a.selectAll("tspan").remove(), l.forEach((e) => {
				a.append("tspan").attr("x", 0).text(e);
			}), e.lines = l, e.lineH = xi(l, o), i.classed("tag-fallback", e.fallback), e.formsEl && e.formsEl.remove(), e.formsEl = Ci(i, r, o), yi(e);
		}
		let Wa = (e) => Ra.filter((t) => xr(t._origTarget || t.target) === e).length;
		function Ga() {
			let e = !1, t = P.current === "force", n = A.current;
			for (let e of Ra) e._origTarget !== void 0 && (e.target = e._origTarget, delete e._origTarget, delete e._dupByGroup);
			for (let r of a.nodes) {
				let i = !1;
				if (r._groupedInto && (e = !0, i = !0, delete r._groupedInto, r._groupSaved && (t && (r.fx = r._groupSaved.fx, r.fy = r._groupSaved.fy), delete r._groupSaved)), r._groupKey && (e = !0, i = !0, delete r._groupKey, r._preGroupPos)) {
					let e = r._preGroupPos;
					t && (r.x = e.x, r.y = e.y, r.fx = e.fx, r.fy = e.fy), delete r._preGroupPos;
				}
				if (i && !t && n && n.nodeState) {
					let e = n.nodeState(fe(r));
					e && Number.isFinite(e.x) && Number.isFinite(e.y) && (r.x = e.x, r.y = e.y, r.fx = e.x, r.fy = e.y);
				}
			}
			return e;
		}
		function qa({ scheme: e, depth: t }) {
			if (!La.length) return;
			let n = Ga(), r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
			for (let n of La) {
				let a = (0, hc.labelFor)(Ia, n.d.concept, {
					scheme: e,
					depth: t,
					systems: n.d.systems
				});
				r.set(n.d.id, a);
				let o = a.groupId || n.d.concept;
				i.has(o) || i.set(o, []), i.get(o).push(n.d);
			}
			let o = !1, s = A.current;
			for (let [e, n] of Ha(t) > 0 ? i : []) {
				if (n.length === 1 && n[0].concept === e) continue;
				o = !0;
				let t = n.filter((t) => t.concept === e), r = (t.length ? t : n).slice().sort((e, t) => Wa(t.id) - Wa(e.id) || (e.id < t.id ? -1 : +(e.id > t.id)))[0];
				r._preGroupPos = {
					x: r.x,
					y: r.y,
					fx: r.fx,
					fy: r.fy
				}, r._groupKey = "concept:" + e;
				let i = s && s.nodeState ? s.nodeState(de(P.current) + r._groupKey) : null;
				if (i && Number.isFinite(i.x) && Number.isFinite(i.y)) r.x = i.x, r.y = i.y, (!i.auto || r.fx != null) && (r.fx = i.x, r.fy = i.y);
				else {
					let e = Sc(n);
					e && (r.x = e.x, r.y = e.y, r.fx != null && (r.fx = e.x, r.fy = e.y));
				}
				let a = new Set(Ra.filter((e) => xr(e.target) === r.id).map((e) => xr(e.source)));
				for (let e of n) if (e !== r) {
					e._groupedInto = r.id, e._groupSaved = {
						fx: e.fx,
						fy: e.fy
					}, e.fx = e.x, e.fy = e.y;
					for (let t of Ra) {
						if (xr(t.target) !== e.id) continue;
						t._origTarget = t.target, t.target = r;
						let n = xr(t.source);
						a.has(n) ? t._dupByGroup = !0 : a.add(n);
					}
				}
			}
			for (let e of La) {
				if (e.d._groupedInto) continue;
				let t = r.get(e.d.id);
				Ua(e, t.label, t.fallback && t.label);
			}
			n || o ? (pt.force("link").links(a.links.filter((e) => !e._dupByGroup)), pt.force("charge").strength(pt.force("charge").strength()), pt.force("collide").radius(pt.force("collide").radius()), Oc(d, D, _e.current, j, ee()), Zi(), pt.alpha(Math.max(pt.alpha(), .3)).restart()) : (pt.force("collide").radius(pt.force("collide").radius()), Zi());
		}
		if (ie.current = () => {
			let e = Va();
			e.scheme === za.scheme && e.depth === za.depth || (za = e, qa(e));
		}, La.length) {
			let e = Va();
			(e.scheme !== hc.SITE_SCHEME || e.depth !== 0) && (za = e, qa(e));
		}
		Pa(), ka ||= $a({ initialZoomOut: !0 }), Zi();
		function Ja() {
			if (!An() || z.roots.length === 0) return null;
			let e = [], t = Nn();
			if (t) for (let t of jn.keys()) {
				let n = z.containers.get(t), r = n && kn(t);
				!r || Er(vn.get(t)) || e.push({
					x0: r.x + n.box.x0,
					y0: r.y + n.box.y0,
					x1: r.x + n.box.x1,
					y1: r.y + n.box.y1
				});
			}
			for (let n of z.roots) {
				let r = z.containers.get(n), i = On(n);
				!r || !i || t && xt(n).every((e) => Pn.has(e)) || xt(n).every((e) => _e.current.has(_n.get(e)?._source?.id)) || e.push({
					x0: i.x + r.box.x0,
					y0: i.y + r.box.y0,
					x1: i.x + r.box.x1,
					y1: i.y + r.box.y1
				});
			}
			for (let t of a.nodes) {
				if (t.type !== "article" || z.nodes.has(t.id) || !Number.isFinite(t.x) || t._source && _e.current.has(t._source.id)) continue;
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
		function Xa() {
			if (!ye || !An()) return null;
			let e = f.initialFocus, t = z.containers.get(e), n = vn.get(e);
			if (!t || !n || At.has(e) || Er(n)) return null;
			let r = kn(e);
			if (!r) return null;
			let i = {
				x0: r.x + t.box.x0,
				y0: r.y + t.box.y0,
				x1: r.x + t.box.x1,
				y1: r.y + t.box.y1
			}, a = z.containers.get(t.root), o = a && On(t.root), s = o ? {
				x0: o.x + a.box.x0,
				y0: o.y + a.box.y0,
				x1: o.x + a.box.x1,
				y1: o.y + a.box.y1
			} : null, c = (e, t) => {
				if (!e) return e;
				let n = { ...e };
				for (let e of xt(t)) {
					let t = _n.get(e);
					if (!t || t.type !== "article" || t._closedHidden || !Number.isFinite(t.x) || !Number.isFinite(t.y)) continue;
					let r = t._size || M({
						hovered: !1,
						pinned: pe.current.has(t.id)
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
		function Za(e) {
			let t = {
				top: 0,
				bottom: 0
			};
			if (typeof document > "u" || !C.current) return t;
			let n = C.current.getBoundingClientRect(), r = 0, i = 0;
			for (let t of document.querySelectorAll("[data-feeds], [data-settings-gear], [data-rights], [data-toolbar]")) {
				let a = t.getBoundingClientRect();
				!a.width || !a.height || (a.top >= n.top + e / 2 ? i = Math.max(i, n.top + e - a.top) : a.bottom <= n.top + e / 2 && (r = Math.max(r, a.bottom - n.top)));
			}
			return {
				top: Math.max(0, Math.min(e / 4, r)),
				bottom: Math.max(0, Math.min(e / 3, i))
			};
		}
		function Qa(e) {
			let t = (0, lc.homeView)(Se), n = Fo.translate(t.x, t.y).scale(t.k);
			Oe = t.k, Ue({ repaint: !1 });
			let r = Bn() ? Hn() : Le();
			return e ? d.transition().duration(750).call(Pe.transform, n, r || void 0) : d.call(Pe.transform, n), gr(), !0;
		}
		function $a({ animate: e = !1, initialZoomOut: t = !1, focus: n = !0 } = {}) {
			if (n && Nn()) return Qa(e);
			let r = eo({
				animate: e,
				initialZoomOut: t,
				focus: n
			});
			return r && n && (Oe = r, gr()), !!r;
		}
		function eo({ animate: e = !1, initialZoomOut: t = !1, focus: n = !0 } = {}) {
			let r = Ja();
			if (r) {
				let t = C.current ? C.current.clientWidth : window.innerWidth, i = C.current ? C.current.clientHeight : window.innerHeight;
				if (t < 50 || i < 50) return !1;
				let a = Za(i);
				i -= a.top + a.bottom;
				let o = (e) => Math.min((t - 48) / Math.max(e.x1 - e.x0, 1), (i - 48) / Math.max(e.y1 - e.y0, 1), 1), s = n ? Xa() : null, c = r, l = o(r), u = !1;
				s && (l = o(s.box), c = s.box, s.root && o(s.root) >= Math.min(l, be) ? (c = s.root, l = o(s.root)) : l < be && (l = be, u = (s.box.y1 - s.box.y0) * l > i - 48), l < xe && (l = xe, c = s.box, u = (s.box.y1 - s.box.y0) * l > i - 48)), l = Math.max(l, .04);
				let f = (c.x0 + c.x1) / 2, p = u ? Math.max(a.top + 24, 56) - c.y0 * l : a.top + i / 2 - (c.y0 + c.y1) / 2 * l, m = Fo.translate(t / 2 - f * l, p).scale(l);
				return Ue({ repaint: !1 }), e ? d.transition().duration(750).call(Pe.transform, m) : d.call(Pe.transform, m), m.k;
			}
			let i = a.nodes.filter((e) => e.type === "article");
			if (i.length < 2) return !1;
			let o = (e) => {
				let t = [...e].sort((e, t) => e - t), n = Math.floor(t.length / 2);
				return t.length % 2 ? t[n] : (t[n - 1] + t[n]) / 2;
			}, s = (e) => {
				let t = [...e].sort((e, t) => e - t);
				return [t[Math.floor(t.length * .1)], t[Math.ceil(t.length * .9) - 1]];
			}, c = i.map((e) => e.x), l = i.map((e) => e.y), [u, f] = s(c), [p, m] = s(l), h = u - 140, g = f + 140, _ = p - 140, v = m + 140, y = o(c), b = o(l), x = C.current ? C.current.clientWidth : window.innerWidth, S = C.current ? C.current.clientHeight : window.innerHeight;
			if (x < 50 && (x = window.innerWidth), S < 50 && (S = window.innerHeight), x < 50 || S < 50) return !1;
			let w = .2, T = Za(S), E = Math.max(50, S - T.top - T.bottom), D = Math.max(Math.min(x / Math.max(g - h, 1), E / Math.max(v - _, 1), 1), w);
			t && (ct ? D = w * .85 : D *= .85);
			let O = x / 2 - y * D, k = T.top + E / 2 - b * D, A = Fo.translate(O, k).scale(D);
			return Ue({ repaint: !1 }), e ? d.transition().duration(750).call(Pe.transform, A) : d.call(Pe.transform, A), A.k;
		}
		let to = !1;
		At.size && (kr(), Dr()), pt.on("end", () => {
			if (to = !0, P.current !== "force" || (Pa() && Zi(), Ma = !0, a.nodes.forEach((e) => {
				e.fx = e.x, e.fy = e.y, e._forcePos = {
					x: e.x,
					y: e.y
				};
			}), ve || $a({ animate: !0 }), (0, Gs.layoutIsDegenerate)(a.nodes, M({
				hovered: !1,
				pinned: !1
			})))) return;
			let e = A.current;
			if (e) for (let t of a.nodes) !t.pinned && t._forcePos && e.setNodePosition(de("force") + le(t), t.x, t.y, { silent: !0 });
			I.current && I.current();
		});
		let no = () => {
			if (!document.hidden) {
				if (!to) {
					pt.alpha(.8).restart();
					return;
				}
				ka ||= $a({ initialZoomOut: !0 });
			}
		};
		document.addEventListener("visibilitychange", no);
		let ro = 1.25, so = 8, co = () => Bn() ? Hn() : Le() || [n / 2, r / 2];
		function lo(e, t = !0) {
			if (!Number.isFinite(e) || e <= 0) return;
			let n = Io(d.node()), r = Math.max(.04, Math.min(8, n.k * e));
			if (r > n.k && Bn() && (r = Math.min(r, Math.max(n.k, Yn()))), Math.abs(r - n.k) <= 1e-9 * n.k) return;
			let [i, a] = co(), o = (0, $s.zoomAbout)(n, r / n.k, i, a), s = Fo.translate(o.x, o.y).scale(o.k);
			ve = !0, ye = !1, t ? d.transition("key-zoom").duration(260).ease(na).call(Pe.transform, s, [i, a]) : d.call(Pe.transform, s);
		}
		let fo = () => {
			ye = !1;
			let e = Ja() || V(), t = Za(r), i = {
				x0: 24,
				y0: t.top + 24,
				x1: n - 24,
				y1: r - t.bottom - 24
			};
			if (Bn()) {
				let e = C.current ? C.current.getBoundingClientRect() : {
					left: 0,
					top: 0
				}, t = [];
				for (let n of jn.keys()) {
					let r = vn.get(n);
					if (!r || Er(r)) continue;
					let i = Ct.filter((e) => e.id === n).select(At.has(n) ? ".container-macro-bg" : ".container-hull").node();
					if (!i || !(i.getAttribute("d") || "").length) continue;
					let a = i.getBoundingClientRect();
					if (!a.width || !a.height) continue;
					let o = Un(n);
					if (!o) continue;
					let s = qn(r);
					t.push({
						box: {
							x0: a.left - e.left,
							y0: a.top - e.top,
							x1: a.right - e.left,
							y1: a.bottom - e.top
						},
						at: (() => {
							let e = Ne(o.x + s.x, o.y + s.y);
							return {
								x: e[0],
								y: e[1]
							};
						})()
					});
				}
				let n = (0, ec.growFitRatio)(t, i);
				if (n && n > .02) {
					lo(n);
					return;
				}
				Qa(!0);
				return;
			}
			if (e) {
				let t = [
					[e.x0, e.y0],
					[e.x1, e.y0],
					[e.x0, e.y1],
					[e.x1, e.y1]
				].map(([e, t]) => Ne(e, t)), n = {
					x0: Math.min(...t.map((e) => e[0])),
					x1: Math.max(...t.map((e) => e[0])),
					y0: Math.min(...t.map((e) => e[1])),
					y1: Math.max(...t.map((e) => e[1]))
				}, [r, a] = co(), o = (0, $s.fitRatioAbout)(n, r, a, i);
				if (o && o > .02) {
					lo(o);
					return;
				}
			}
			$a({
				animate: !0,
				focus: !1
			});
		};
		function V() {
			let e = a.nodes.filter((e) => !e._closedHidden && Number.isFinite(e.x));
			return e.length ? {
				x0: b(e, (e) => e.x) - 40,
				y0: b(e, (e) => e.y) - 40,
				x1: y(e, (e) => e.x) + 40,
				y1: y(e, (e) => e.y) + 40
			} : null;
		}
		let po = (e) => {
			if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
			let t = e.target;
			if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) || typeof window < "u" && window.PostPipeCover && window.PostPipeCover.state && window.PostPipeCover.state !== "graph" || document.querySelector("[data-settings-panel]")) return;
			let n = e.key === "+" || e.key === "=", r = e.key === "-" || e.key === "_";
			!n && !r || (e.preventDefault(), lo(n ? ro : 1 / ro));
		};
		window.addEventListener("keydown", po);
		let mo = () => {
			a.nodes.forEach((e) => {
				if (e._groupedInto) {
					e._groupSaved &&= {
						fx: null,
						fy: null
					};
					return;
				}
				e.fx = null, e.fy = null, delete e._forcePos;
			});
			let e = A.current;
			if (e) for (let t of a.nodes) {
				let n = fe(t);
				e.nodeState(n) && e.setNodePosition(n, t.x, t.y, { silent: !0 });
			}
			pt.alpha(.8).restart();
		}, ho = () => {
			let e = M({
				hovered: !1,
				pinned: !1
			});
			a.nodes.forEach((e) => {
				delete e._size;
			});
			let t = A.current;
			if (t) for (let n of a.nodes) t.setNodeSize(le(n), e.width, e.height, { silent: !0 });
			Zi();
		}, go = () => {
			let e = A.current;
			e && e.resetLayout && e.resetLayout(), Ue({ repaint: !1 }), a.nodes.forEach((e) => {
				e.fx = null, e.fy = null, delete e._forcePos;
			}), Nn() && (lr(), Zi()), pt.alpha(.8).restart(), $a({ animate: !0 });
		}, _o = () => {
			let e = A.current;
			e && e.resetLayout && e.resetLayout(), E.current && E.current(null), k(null), ui(), Ui = null, ua = !1, va({ force: !0 }), Wi = null, me.current = null, di.classed("dimmed", !1).classed("tag-active", !1), Gi(), Ji(), Ti.classed("dimmed", !1).style("z-index", null), Kr.classed("highlighted", !1), pe.current.clear(), a.nodes.forEach((e) => {
				delete e._size, delete e._customWidth, delete e._customHeight, delete e._forcePos, e.fx = null, e.fy = null;
			}), At.clear();
			for (let e of kt()) At.add(e);
			er.clear(), Ue({ repaint: !1 }), ve = !1, ye = !!f.initialFocus && f.initialFocus !== "all", ji(), kr(), typeof window < "u" && window.dispatchEvent(new CustomEvent("graph:containers-changed", { detail: jr() })), a.containers && a.containers.length && An() ? (Nn() && lr(), Lr(), Dr(), Zi(), $a({ animate: !0 })) : (pt.alpha(.8).restart(), $a({ animate: !0 }));
		}, vo = (e) => {
			let t = e && e.detail ? e.detail.id : null, i = a.nodes.find((e) => e.type === "tag" && e.id === t);
			if (i && i._groupedInto && (i = a.nodes.find((e) => e.id === i._groupedInto) || i), !i || (Ki(i), Ui !== i.id || !Number.isFinite(i.x) || !Number.isFinite(i.y))) return;
			let o = Jn(i), [s, c] = Ne(o.x, o.y), l = Za(r);
			if (s >= 24 && s <= n - 24 && c >= l.top + 24 && c <= r - l.bottom - 24) return;
			let u = Io(d.node()), f = n / 2 - s, p = (l.top + (r - l.bottom)) / 2 - c;
			ve = !0, ye = !1, d.transition("key-zoom").duration(320).ease(na).call(Pe.transform, Fo.translate(u.x + f, u.y + p).scale(u.k));
		};
		window.addEventListener("graph:reset-all", _o), window.addEventListener("graph:select-tag", vo), window.addEventListener("graph:zoom-to-fit", fo), window.addEventListener("graph:unpin-all", mo), window.addEventListener("graph:reset-sizes", ho), window.addEventListener("graph:reset-layout", go);
		let bo = {
			"graph:open-container": (e) => Fr.openContainer(e.detail && e.detail.id),
			"graph:close-container": (e) => Fr.closeContainer(e.detail && e.detail.id),
			"graph:toggle-container": (e) => Fr.toggleContainer(e.detail && e.detail.id),
			"graph:open-all-containers": () => Fr.openAllContainers(),
			"graph:close-all-containers": () => Fr.closeAllContainers()
		};
		for (let [e, t] of Object.entries(bo)) window.addEventListener(e, t);
		return () => {
			te.current = null, ne.current = null, re.current = null, ie.current = null, ae.current = null, se.current = null, ce.current = null, typeof window < "u" && delete window.PostPipeGraphTags, Ca && typeof cancelAnimationFrame < "u" && cancelAnimationFrame(Ca), Qt && Qt.disconnect(), pt.stop(), document.removeEventListener("visibilitychange", no), window.removeEventListener("resize", mt), t.removeEventListener("touchstart", Be, { capture: !0 }), t.removeEventListener("touchmove", Ve, { capture: !0 }), t.removeEventListener("touchend", He, { capture: !0 }), t.removeEventListener("touchcancel", He, { capture: !0 }), t.removeEventListener("touchstart", nt, { capture: !0 }), t.removeEventListener("touchmove", rt, { capture: !0 }), t.removeEventListener("touchend", it, { capture: !0 }), st(), t.removeEventListener("click", $e, !0), t.removeEventListener("dblclick", $e, !0), Ke.cancel(), window.removeEventListener("graph:reset-all", _o), window.removeEventListener("graph:select-tag", vo), window.removeEventListener("postpipe:cover-frame", Aa), window.removeEventListener("postpipe:cover", ja), window.removeEventListener("resize", ja), Qi && typeof cancelAnimationFrame < "u" && cancelAnimationFrame(Qi), window.PostPipeGraphWorld && window.PostPipeGraphWorld.snapshot === hr && delete window.PostPipeGraphWorld, window.removeEventListener("graph:zoom-to-fit", fo), window.removeEventListener("keydown", po), window.removeEventListener("graph:unpin-all", mo), window.removeEventListener("graph:reset-sizes", ho), window.removeEventListener("graph:reset-layout", go);
			for (let [e, t] of Object.entries(bo)) window.removeEventListener(e, t);
			l && l.current === Fr && (l.current = null), wi.forEach(({ root: e }) => {
				queueMicrotask(() => e.unmount());
			}), wi.clear();
		};
	}, [e, ve]), (0, _.useEffect)(() => {
		let e = N.current;
		if (!e || !e.axisLayer) return;
		let t = o || {}, n = () => be(e, t);
		I.current = t.on ? n : null, n();
	}, [
		o,
		a,
		e,
		ve
	]);
	function be(e, t) {
		if (e.axisLayer.selectAll("*").remove(), L.current = null, !t.on) {
			F.current = !1;
			return;
		}
		let n = C.current, r = n ? n.clientWidth : window.innerWidth, i = n ? n.clientHeight : window.innerHeight;
		if (r < 60 || i < 60) return;
		let a = t.dock || h.dock, o = a === "left" || a === "right", s = h.endPadding, c = Number.isFinite(t.offset) ? t.offset : h.inset, l = a === "right" ? r - c : a === "bottom" ? i - c : c, u = Math.max((o ? i : r) - s * 2, 120), d = o ? {
			x: l,
			y: s
		} : {
			x: s,
			y: l
		}, f = (0, Gs.dimensionAxisGeometry)(e.data.nodes, {
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
			let t = Io(e.svg.node());
			g.forEach(({ node: n, anchor: r, line: i }) => {
				i.style("display", n._closedHidden ? "none" : null);
				let a = e.drawnAt ? e.drawnAt(n) : n, o = e.toScreen ? e.toScreen(a.x, a.y) : t.apply([a.x, a.y]);
				i.attr("x1", r.x).attr("y1", r.y).attr("x2", o[0]).attr("y2", o[1]);
			});
		}
		L.current = _, _();
		let v = p.append("g").attr("class", "time-spine").style("cursor", o ? "ew-resize" : "ns-resize");
		v.append("rect").attr("x", o ? l - 34 / 2 : 0).attr("y", o ? 0 : l - 34 / 2).attr("width", o ? 34 : r).attr("height", o ? i : 34).attr("fill", "rgba(18,20,28,0.82)"), v.append("line").attr("x1", f.from.x).attr("y1", f.from.y).attr("x2", f.to.x).attr("y2", f.to.y).attr("stroke", "rgba(255,255,255," + h.spineOpacity + ")").attr("stroke-width", h.spineWidth);
		let y = h.tickFontSize, b = f.ticks.length > 1 ? Math.hypot(f.ticks[1].x - f.ticks[0].x, f.ticks[1].y - f.ticks[0].y) : Infinity, x = o ? y * 1.7 : y * 4.2, S = Math.max(1, Math.ceil(x / Math.max(b, 1)));
		f.ticks.forEach((e, t) => {
			v.append("line").attr("x1", e.x).attr("y1", e.y).attr("x2", e.x + (o ? 9 : 0)).attr("y2", e.y + (o ? 0 : -9)).attr("stroke", "rgba(255,255,255,0.45)").attr("stroke-width", 1.5), t % S === 0 && v.append("text").attr("x", e.x + (o ? 13 : 0)).attr("y", e.y + (o ? 0 : -14)).attr("text-anchor", o ? "start" : "middle").attr("dominant-baseline", o ? "central" : "auto").style("font-family", "'Atkinson', sans-serif").style("font-size", y + "px").style("fill", "rgba(255,255,255,0.62)").style("pointer-events", "none").text(e.label);
		});
		let w = null, T = 0;
		v.call(nn().on("start", (e) => {
			w = o ? e.x : e.y, T = 0;
		}).on("drag", (e) => {
			w !== null && (T = (o ? e.x : e.y) - w, v.attr("transform", o ? "translate(" + T + ",0)" : "translate(0," + T + ")"), m.selectAll("line").attr(o ? "x1" : "y1", function() {
				return Number(Vt(this).attr(o ? "x1" : "y1"));
			}), g.forEach(({ anchor: e, line: t }) => {
				o ? t.attr("x1", e.x + T) : t.attr("y1", e.y + T);
			}));
		}).on("end", () => {
			if (w !== null && T && A.current) {
				let e = a === "right" || a === "bottom" ? c - T : c + T;
				A.current.setTimeAxis({
					offset: Math.max(20, e),
					moved: !0
				});
			}
			w = null;
		}));
	}
	return (0, _.useEffect)(() => {
		P.current = a;
		let e = N.current;
		if (!e) return;
		let t = A.current, n = M({
			hovered: !1,
			pinned: !1
		});
		if (e.recomputeContainers && e.recomputeContainers(), a === "force" && e.data.nodes.filter((e) => {
			let n = t && t.nodeState(de("force") + le(e));
			return n && !n.auto || e._forcePos;
		}).length < e.data.nodes.length * .5) {
			e.data.nodes.forEach((e) => {
				let n = t && t.nodeState(de("force") + le(e));
				n && !n.auto ? (e.fx = n.x, e.fy = n.y) : (e.fx = null, e.fy = null);
			}), e.simulation.alpha(1).restart();
			return;
		}
		let r = e.data.nodes.filter((e) => !e._groupedInto), i = a === "force" ? Object.fromEntries(r.map((e) => [e.id, e._forcePos || t && t.nodeState(de("force") + le(e)) || {
			x: e.x,
			y: e.y
		}])) : a === "radial" && e.ringTargets && e.ringTargets() || (0, Gs.computeLayout)(a, r, {
			cardW: n.width,
			cardH: n.height
		});
		if (!i) return;
		let o = new Map(e.data.nodes.map((e) => [e.id, {
			x: e.x,
			y: e.y
		}]));
		r.forEach((e) => {
			let n = t && t.nodeState(de(a) + le(e)), r = n && typeof n.x == "number" && !n.auto ? {
				x: n.x,
				y: n.y
			} : i[e.id];
			r && (e.targetX = r.x, e.targetY = r.y, e.fx = r.x, e.fy = r.y, t && !(n && !n.auto) && t.setNodePosition(de(a) + le(e), r.x, r.y, { silent: !0 }));
		});
		let s = ra;
		$i().duration(760).ease(s).tween("layout-transition", () => {
			let t = e.data.nodes.map((e) => {
				let t = o.get(e.id) || {
					x: e.x,
					y: e.y
				}, n = typeof e.targetX == "number" ? e.targetX : e.x, r = typeof e.targetY == "number" ? e.targetY : e.y, i = Qn(t.x, n), a = Qn(t.y, r);
				return (t) => {
					e.x = i(t), e.y = a(t);
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
		let c = setTimeout(() => {
			I.current && I.current(), e.fitToViewport && e.fitToViewport();
		}, 800);
		return () => clearTimeout(c);
	}, [a]), /* @__PURE__ */ (0, H.jsx)("div", {
		ref: C,
		className: Ko.graphContainer,
		"data-graph-root": !0
	});
}
var W = {
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
}, Rc = {
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
}, zc = /* @__PURE__ */ o(((e, t) => {
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
})), Bc = /* @__PURE__ */ o(((e, t) => {
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
})), Vc = /* @__PURE__ */ o(((e, t) => {
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
})), Hc = /* @__PURE__ */ o(((e, t) => {
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
})), Uc = zc(), Wc = Bc(), Gc = Vc(), Kc = Hc(), qc = (e, t) => {
	let n = e && Array.isArray(e.items) ? e.items.find((e) => e.id === t) : null;
	return n && n.title || "";
}, Jc = (e, t) => "#read=" + encodeURIComponent(e) + (t == null ? "" : "&p=" + t);
function Yc({ b: e, feedData: t, viewState: n }) {
	let [r, i] = (0, _.useState)(!1), a = (0, Kc.placedParagraph)(e, t && Array.isArray(t.items) ? t.items.find((t) => t.id === e.item) : null);
	return /* @__PURE__ */ (0, H.jsxs)("div", {
		className: W.bmRow,
		"data-bookmark-row": !0,
		children: [/* @__PURE__ */ (0, H.jsxs)("div", {
			className: W.bmMain,
			children: [/* @__PURE__ */ (0, H.jsx)("div", {
				className: W.bmTitle,
				children: (0, Kc.bookmarkLabel)(e, qc(t, e.item))
			}), r ? /* @__PURE__ */ (0, H.jsx)("input", {
				type: "text",
				value: e.note || "",
				onChange: (t) => n.setBookmarkNote(e.id, t.target.value),
				onBlur: () => i(!1),
				onKeyDown: (e) => {
					e.key === "Enter" && i(!1);
				},
				className: W.bmNoteInput,
				"aria-label": "Note",
				autoFocus: !0
			}) : /* @__PURE__ */ (0, H.jsx)("button", {
				className: W.bmNote,
				onClick: () => i(!0),
				children: e.note || /* @__PURE__ */ (0, H.jsx)("em", { children: "Add a note" })
			})]
		}), /* @__PURE__ */ (0, H.jsxs)("div", {
			className: W.bmActions,
			children: [
				/* @__PURE__ */ (0, H.jsx)("button", {
					onClick: () => {
						window.location.hash = Jc(e.item, a);
					},
					title: "Go back to this place",
					children: "Jump"
				}),
				/* @__PURE__ */ (0, H.jsx)("button", {
					onClick: async () => {
						try {
							await navigator.clipboard.writeText(window.location.href.split("#")[0] + Jc(e.item, a));
						} catch {}
					},
					title: "Copy a link to this place",
					children: "Copy link"
				}),
				/* @__PURE__ */ (0, H.jsx)("button", {
					onClick: () => n.removeBookmark(e.id),
					title: "Delete this bookmark",
					children: "Delete"
				})
			]
		})]
	});
}
function Xc({ viewState: e, feedData: t, itemId: n }) {
	if (!e) return null;
	let r = e.bookmarks(), i = r.filter((e) => e.item === n), a = r.filter((e) => e.item !== n);
	return /* @__PURE__ */ (0, H.jsxs)("div", {
		className: W.bmList,
		"data-bookmarks-list": !0,
		children: [[...i, ...a].map((n) => /* @__PURE__ */ (0, H.jsx)(Yc, {
			b: n,
			feedData: t,
			viewState: e
		}, n.id)), r.length === 0 && /* @__PURE__ */ (0, H.jsx)("div", {
			className: W.bmEmpty,
			children: "No bookmarks yet."
		})]
	});
}
//#endregion
//#region src/components/Icon/Icon.jsx
function Zc({ body: e, size: t = 16, className: n }) {
	return e ? /* @__PURE__ */ (0, H.jsx)("svg", {
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
var Qc = /* @__PURE__ */ o(((e, t) => {
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
})), $c = /* @__PURE__ */ o(((e, t) => {
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
})), el = Qc(), tl = $c(), nl = "p, li, blockquote, h1, h2, h3, h4, h5, h6, dd, dt, figcaption, td, th", rl = "pp-follow-sentence", il = "pp-follow-word", al = "pp-follow-block", ol = () => typeof CSS < "u" && CSS.highlights && typeof Highlight < "u";
function sl(e, t) {
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
function cl(e) {
	let t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT, { acceptNode(e) {
		let t = e.parentElement;
		return t && t.closest(".bookmarkRibbon, [aria-hidden=\"true\"]") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
	} }), r;
	for (; r = n.nextNode();) t.push(r);
	return t;
}
function ll(e, t, n, r) {
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
function ul(e) {
	ol() && (CSS.highlights.delete(rl), CSS.highlights.delete(il)), e && (e.querySelectorAll("." + al).forEach((e) => e.classList.remove(al)), delete e.dataset.followSentence, delete e.dataset.followWord);
}
function dl(e, t, n) {
	let r = sl(t, n);
	if (!r || !e.contains(r.node)) return null;
	let i = r.node.nodeType === 3 ? r.node.parentElement : r.node, a = i && i.closest(nl);
	if (!a || !e.contains(a)) return null;
	let o = cl(a);
	if (!o.length) return null;
	let s = [], c = "", l = null;
	for (let e of o) s.push(c.length), e === r.node && (l = c.length + r.offset), c += e.nodeValue;
	if (l === null) return null;
	let u = (0, tl.spanAt)(c, l);
	if (!u) return null;
	ul(e);
	let d = c.slice(u.sentence[0], u.sentence[1]), f = u.word ? c.slice(u.word[0], u.word[1]) : "";
	return ol() ? (CSS.highlights.set(rl, new Highlight(ll(o, s, u.sentence[0], u.sentence[1]))), u.word && CSS.highlights.set(il, new Highlight(ll(o, s, u.word[0], u.word[1])))) : a.classList.add(al), e.dataset.followSentence = d, e.dataset.followWord = f, {
		sentence: d,
		word: f
	};
}
function fl(e) {
	let t = !1, n = 0, r = null, i = () => {
		n = 0, r && dl(e, r.x, r.y);
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
		n && cancelAnimationFrame(n), e.removeEventListener("pointerdown", o), e.removeEventListener("pointermove", s), window.removeEventListener("pointerup", c), window.removeEventListener("pointercancel", c), ul(e);
	};
}
//#endregion
//#region src/components/ReaderPanel/boldStartHtml.js
var pl = (/* @__PURE__ */ o(((e, t) => {
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
})))(), ml = new Set([
	"SCRIPT",
	"STYLE",
	"CODE",
	"PRE",
	"KBD",
	"SAMP",
	"svg"
]);
function hl(e) {
	if (!e || typeof DOMParser > "u") return e;
	let t = new DOMParser().parseFromString(`<div id="pp-bs-root">${e}</div>`, "text/html"), n = t.getElementById("pp-bs-root"), r = t.createTreeWalker(n, NodeFilter.SHOW_TEXT, { acceptNode(e) {
		for (let t = e.parentElement; t && t !== n; t = t.parentElement) if (ml.has(t.tagName)) return NodeFilter.FILTER_REJECT;
		return /[\p{L}]/u.test(e.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
	} }), i = [], a;
	for (; a = r.nextNode();) i.push(a);
	for (let e of i) {
		let n = t.createDocumentFragment();
		for (let r of (0, pl.boldStartSegments)(e.nodeValue)) if (r.bold) {
			let e = t.createElement("b");
			e.className = "pp-bs", e.textContent = r.text, n.appendChild(e);
		} else n.appendChild(t.createTextNode(r.text));
		e.parentNode.replaceChild(n, e);
	}
	return n.innerHTML;
}
//#endregion
//#region src/components/ReaderPanel/Contributions.module.css
var gl = (/* @__PURE__ */ o(((e, t) => {
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
})))(), G = {
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
}, _l = "pp-contrib-passage", vl = () => typeof CSS < "u" && CSS.highlights && typeof Highlight < "u";
function yl(e) {
	if (!e) return "";
	let t = new Date(e.length === 10 ? `${e}T00:00:00` : e);
	return isNaN(t) ? "" : t.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	});
}
function bl(e, t) {
	let n = String(e || "").replace(/\s+/g, " ").trim();
	return n.length > t ? n.slice(0, t - 1).trimEnd() + "…" : n;
}
function xl(e, t, n) {
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
function Sl({ article: e, contributions: t, config: n, feedData: r, textRef: i, textKey: a, onOpenChapter: o, children: s }) {
	let c = (0, dc.slugOf)(e), l = (0, _.useMemo)(() => (0, dc.forChapter)(t, c), [t, c]), [u, d] = (0, _.useState)(null), [f, p] = (0, _.useState)({}), m = (0, _.useMemo)(() => {
		let e = /* @__PURE__ */ new Map();
		for (let t of r && r.items || []) e.set((0, dc.slugOf)(t), t);
		return e;
	}, [r]);
	(0, _.useEffect)(() => {
		d(null);
		let e = setTimeout(() => {
			let e = i && i.current, t = e ? Array.from(e.querySelectorAll("p")) : [], n = t.map((e) => e.textContent), r = {};
			for (let e of l) e.quote && (r[e.id] = t.length ? (0, dc.resolveQuote)(n, e.quote) : null);
			p(r);
		}, 80);
		return () => clearTimeout(e);
	}, [
		l,
		e,
		a
	]), (0, _.useEffect)(() => () => {
		vl() && CSS.highlights.delete(_l);
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
		let o = xl(r, t.offset, t.length);
		n.querySelectorAll("[data-contrib-passage]").forEach((e) => e.removeAttribute("data-contrib-passage")), r.setAttribute("data-contrib-passage", e.id), o && vl() && CSS.highlights.set(_l, new Highlight(o)), setTimeout(() => {
			r.getAttribute("data-contrib-passage") === e.id && r.removeAttribute("data-contrib-passage"), vl() && CSS.highlights.delete(_l);
		}, 4e3);
	};
	if (!l.length && !s && !(n && n.submit)) return null;
	let g = (e) => {
		if (!e.quote) return null;
		let t = f[e.id];
		return t ? /* @__PURE__ */ (0, H.jsxs)("div", {
			className: G.quote,
			"data-contrib-anchor": "found",
			children: [/* @__PURE__ */ (0, H.jsxs)("span", {
				className: G.quoteText,
				children: [
					"“",
					bl(e.quote.exact, 140),
					"”"
				]
			}), /* @__PURE__ */ (0, H.jsx)("button", {
				type: "button",
				className: G.linkBtn,
				onClick: () => h(e),
				"data-contrib-show": !0,
				children: "Show the passage"
			})]
		}) : t === null ? /* @__PURE__ */ (0, H.jsx)("div", {
			className: G.fallback,
			"data-contrib-anchor": "fallback",
			children: "This was about a passage that isn’t in the chapter as it reads now, so it stays with the chapter as a whole."
		}) : null;
	}, v = (e) => /* @__PURE__ */ (0, H.jsxs)("div", {
		className: G.byline,
		children: [
			/* @__PURE__ */ (0, H.jsx)("span", {
				className: G.author,
				children: e.author
			}),
			yl(e.created) && /* @__PURE__ */ (0, H.jsxs)("span", {
				className: G.date,
				children: [" · ", yl(e.created)]
			}),
			e.test && /* @__PURE__ */ (0, H.jsx)("span", {
				className: G.testTag,
				children: " · test"
			})
		]
	});
	return /* @__PURE__ */ (0, H.jsxs)("aside", {
		className: G.section,
		"aria-label": "From readers",
		"data-contributions": !0,
		"data-pp-not-text": !0,
		children: [
			/* @__PURE__ */ (0, H.jsxs)("div", {
				className: G.head,
				children: [/* @__PURE__ */ (0, H.jsx)("div", {
					className: G.title,
					children: "From readers"
				}), /* @__PURE__ */ (0, H.jsx)("div", {
					className: G.note,
					children: "Not part of the book. Written by readers, with their names."
				})]
			}),
			l.length === 0 && /* @__PURE__ */ (0, H.jsx)("div", {
				className: G.empty,
				children: "Nothing from readers on this chapter yet."
			}),
			/* @__PURE__ */ (0, H.jsx)("ul", {
				className: G.list,
				children: l.map((e) => /* @__PURE__ */ (0, H.jsxs)("li", {
					className: G.item,
					"data-contrib": e.id,
					"data-contrib-type": e.type,
					children: [
						/* @__PURE__ */ (0, H.jsx)("div", {
							className: G.kind,
							children: e.type === "essay" ? "Essay" : e.type === "art" ? "Art" : e.type === "connection" ? "Connection" : "Comment"
						}),
						e.title && /* @__PURE__ */ (0, H.jsx)("div", {
							className: G.itemTitle,
							children: e.title
						}),
						v(e),
						g(e),
						e.type === "comment" && (0, dc.paragraphsOf)(e.body).map((e, t) => /* @__PURE__ */ (0, H.jsx)("div", {
							className: G.para,
							children: e
						}, t)),
						e.type === "connection" && (() => {
							let t = e.chapter === c ? e.to : e.chapter, n = m.get(t);
							return /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [/* @__PURE__ */ (0, H.jsxs)("div", {
								className: G.para,
								children: [
									"Connects this chapter with",
									" ",
									n && o ? /* @__PURE__ */ (0, H.jsx)("button", {
										type: "button",
										className: G.linkBtn,
										onClick: () => o(n),
										"data-contrib-goto": t,
										children: n.title || t
									}) : n && n.title || t
								]
							}), (0, dc.paragraphsOf)(e.body).map((e, t) => /* @__PURE__ */ (0, H.jsx)("div", {
								className: G.para,
								children: e
							}, t))] });
						})(),
						e.type === "art" && /* @__PURE__ */ (0, H.jsxs)("figure", {
							className: G.art,
							children: [/* @__PURE__ */ (0, H.jsx)("img", {
								src: (0, dc.assetUrl)(e.asset, n),
								alt: e.alt || `Art by ${e.author}`,
								loading: "lazy"
							}), e.body && /* @__PURE__ */ (0, H.jsx)("figcaption", {
								className: G.para,
								children: e.body
							})]
						}),
						e.type === "essay" && (() => {
							let t = (0, dc.paragraphsOf)(e.body), n = u === e.id;
							return /* @__PURE__ */ (0, H.jsxs)("div", {
								className: G.essay,
								"data-contrib-essay": n ? "open" : "closed",
								children: [
									!n && /* @__PURE__ */ (0, H.jsx)("div", {
										className: G.para,
										children: bl(t[0] || "", 220)
									}),
									n && t.map((e, t) => /* @__PURE__ */ (0, H.jsx)("div", {
										className: G.para,
										children: e
									}, t)),
									/* @__PURE__ */ (0, H.jsx)("button", {
										type: "button",
										className: G.linkBtn,
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
			n && n.submit && /* @__PURE__ */ (0, H.jsx)(wl, {
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
function Cl(e) {
	let t = typeof window < "u" && window.getSelection ? window.getSelection() : null;
	if (!t || t.isCollapsed || !t.rangeCount || !e) return null;
	let n = t.getRangeAt(0);
	if (!e.contains(n.commonAncestorContainer)) return null;
	let r = n.startContainer.nodeType === 1 ? n.startContainer : n.startContainer.parentElement, i = r && r.closest("p");
	if (!i || !e.contains(i) || !i.contains(n.endContainer)) return { error: "Choose a passage within one paragraph." };
	let a = document.createRange();
	a.setStart(i, 0), a.setEnd(n.startContainer, n.startOffset);
	let o = a.toString().length;
	return (0, dc.quoteFromSelection)(i.textContent, o, o + n.toString().length);
}
function wl({ article: e, chapter: t, config: n, feedData: r, textRef: i }) {
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
			let e = Cl(i && i.current);
			e && x(e);
		};
		return document.addEventListener("selectionchange", e), () => document.removeEventListener("selectionchange", e);
	}, [a, i]);
	let T = (r && r.items || []).filter((e) => (0, dc.slugOf)(e) !== t && e._posted !== "title").map((e) => ({
		id: (0, dc.slugOf)(e),
		title: e.title || (0, dc.slugOf)(e)
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
	return a ? /* @__PURE__ */ (0, H.jsxs)("form", {
		className: G.form,
		onSubmit: async (e) => {
			e.preventDefault();
			let t = E(), r = (0, dc.checkSubmission)(t, n);
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
			/* @__PURE__ */ (0, H.jsx)("div", {
				className: G.formTitle,
				children: "Add yours"
			}),
			/* @__PURE__ */ (0, H.jsx)("div", {
				className: G.note,
				children: "It is read before it appears here. Only the name you give is kept with it; nothing else about you is asked for or stored."
			}),
			/* @__PURE__ */ (0, H.jsxs)("label", {
				className: G.field,
				children: [/* @__PURE__ */ (0, H.jsx)("span", { children: "Name to show" }), /* @__PURE__ */ (0, H.jsx)("input", {
					value: s,
					maxLength: w.name,
					onChange: (e) => c(e.target.value),
					autoComplete: "nickname",
					"data-contrib-field": "author"
				})]
			}),
			/* @__PURE__ */ (0, H.jsxs)("label", {
				className: G.field,
				children: [/* @__PURE__ */ (0, H.jsx)("span", { children: "What it is" }), /* @__PURE__ */ (0, H.jsxs)("select", {
					value: l,
					onChange: (e) => u(e.target.value),
					"data-contrib-field": "type",
					children: [
						/* @__PURE__ */ (0, H.jsx)("option", {
							value: "comment",
							children: "A comment"
						}),
						/* @__PURE__ */ (0, H.jsx)("option", {
							value: "essay",
							children: "An essay"
						}),
						/* @__PURE__ */ (0, H.jsx)("option", {
							value: "connection",
							children: "A connection to another chapter"
						})
					]
				})]
			}),
			l === "essay" && /* @__PURE__ */ (0, H.jsxs)("label", {
				className: G.field,
				children: [/* @__PURE__ */ (0, H.jsx)("span", { children: "Title (optional)" }), /* @__PURE__ */ (0, H.jsx)("input", {
					value: d,
					maxLength: 140,
					onChange: (e) => f(e.target.value),
					"data-contrib-field": "title"
				})]
			}),
			l === "connection" && /* @__PURE__ */ (0, H.jsxs)("label", {
				className: G.field,
				children: [/* @__PURE__ */ (0, H.jsx)("span", { children: "The other chapter" }), /* @__PURE__ */ (0, H.jsxs)("select", {
					value: h,
					onChange: (e) => g(e.target.value),
					"data-contrib-field": "to",
					children: [/* @__PURE__ */ (0, H.jsx)("option", {
						value: "",
						children: "Choose…"
					}), T.map((e) => /* @__PURE__ */ (0, H.jsx)("option", {
						value: e.id,
						children: e.title
					}, e.id))]
				})]
			}),
			/* @__PURE__ */ (0, H.jsxs)("label", {
				className: G.field,
				children: [/* @__PURE__ */ (0, H.jsx)("span", { children: l === "connection" ? "How they connect" : "Your words" }), /* @__PURE__ */ (0, H.jsx)("textarea", {
					value: p,
					maxLength: w.body,
					rows: l === "essay" ? 10 : 4,
					onChange: (e) => m(e.target.value),
					"data-contrib-field": "body"
				})]
			}),
			/* @__PURE__ */ (0, H.jsx)("div", {
				className: G.passage,
				children: v && !v.error ? /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [/* @__PURE__ */ (0, H.jsxs)("span", {
					className: G.quoteText,
					children: [
						"About: “",
						bl(v.exact, 120),
						"”"
					]
				}), /* @__PURE__ */ (0, H.jsx)("button", {
					type: "button",
					className: G.linkBtn,
					onClick: () => y(null),
					children: "Not about a passage"
				})] }) : /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [/* @__PURE__ */ (0, H.jsx)("span", {
					className: G.note,
					children: v && v.error ? v.error : "To write about a passage, select it in the chapter, then:"
				}), /* @__PURE__ */ (0, H.jsx)("button", {
					type: "button",
					className: G.linkBtn,
					onMouseDown: (e) => e.preventDefault(),
					onClick: () => y(Cl(i && i.current) || b || { error: "Select a passage in the chapter first." }),
					"data-contrib-use-selection": !0,
					children: "Use the passage I selected"
				})] })
			}),
			S.errors.length > 0 && /* @__PURE__ */ (0, H.jsx)("ul", {
				className: G.errors,
				role: "alert",
				children: S.errors.map((e, t) => /* @__PURE__ */ (0, H.jsx)("li", { children: e }, t))
			}),
			S.done && /* @__PURE__ */ (0, H.jsx)("div", {
				className: G.thanks,
				role: "status",
				"data-contrib-sent": !0,
				children: "Thank you. It will appear here once it has been read and approved."
			}),
			/* @__PURE__ */ (0, H.jsxs)("div", {
				className: G.formActions,
				children: [/* @__PURE__ */ (0, H.jsx)("button", {
					type: "submit",
					className: G.addBtn,
					disabled: S.sending,
					"data-contrib-send": !0,
					children: S.sending ? "Sending…" : "Send"
				}), /* @__PURE__ */ (0, H.jsx)("button", {
					type: "button",
					className: G.linkBtn,
					onClick: () => o(!1),
					children: "Close"
				})]
			})
		]
	}) : /* @__PURE__ */ (0, H.jsx)("div", {
		className: G.addRow,
		children: /* @__PURE__ */ (0, H.jsx)("button", {
			type: "button",
			className: G.addBtn,
			onClick: () => o(!0),
			"data-contrib-add": !0,
			children: "Add yours"
		})
	});
}
//#endregion
//#region src/components/ReaderPanel/ReaderPanel.jsx
function Tl({ article: e, onClose: t, settings: n, viewState: r, targetParagraph: i, feedData: a, onNavigate: o, contributions: s, contributionsConfig: c }) {
	let [l, u] = (0, _.useState)(!1), [d, f] = (0, _.useState)(!1), [p, m] = (0, _.useState)(null), [h, g] = (0, _.useState)(!1), [v, y] = (0, _.useState)(!1), [b, x] = (0, _.useState)(""), [S, C] = (0, _.useState)(0), [w, T] = (0, _.useState)(!1), [E, D] = (0, _.useState)(!1), [O, k] = (0, _.useState)(!1), A = (0, _.useRef)(null), j = (0, _.useRef)(null), ee = (0, _.useRef)(null), M = (0, _.useRef)(!1), N = (0, _.useRef)({
		mouseX: 0,
		mouseY: 0,
		posX: 0,
		posY: 0
	}), [P, F] = (0, _.useState)(null), [I, L] = (0, _.useState)(null), te = (0, _.useRef)([]);
	(0, _.useEffect)(() => {
		de.current && (clearTimeout(de.current), pe()), e ? (u(!0), f(!1), F(null), j.current && (j.current.scrollTop = 0), C(0), ue(e)) : (u(!1), f(!1), x(""), C(0), g(!1));
	}, [e]);
	let ne = (e) => e ? e.originalItem && e.originalItem.id || e.id || e.url : null, re = ne(e), ie = r && re ? r.bookmarks(re) : [], R = !!(r && r.readerAid && r.readerAid("boldStart")), ae = (0, _.useMemo)(() => R ? hl(b) : b, [b, R]), oe = (0, _.useMemo)(() => ({ __html: ae }), [ae]), se = (e) => {
		e.target.closest("button") || e.target.closest("a") || e.target.closest("input") || (M.current = !0, N.current = {
			mouseX: e.clientX,
			mouseY: e.clientY,
			posX: p ? p.x : 0,
			posY: p ? p.y : 0
		}, window.addEventListener("mousemove", ce), window.addEventListener("mouseup", le));
	}, ce = (e) => {
		if (!M.current) return;
		let t = e.clientX - N.current.mouseX, n = e.clientY - N.current.mouseY;
		m({
			x: N.current.posX + t,
			y: N.current.posY + n
		});
	}, le = () => {
		M.current = !1, window.removeEventListener("mousemove", ce), window.removeEventListener("mouseup", le);
	}, ue = async (e) => {
		let t = e.kind || "essay";
		if (t === "placeholder" || e.substrate === "placeholder") {
			let t = e.series_part || e.title || "";
			x(`
        <div style="padding: 40px 24px; text-align: center; border: 1px dashed rgba(212, 175, 55, 0.35); border-radius: 12px; background: rgba(20, 24, 38, 0.6); margin-top: 24px;">
          <div style="font-size: 20px; font-weight: 600; color: var(--rp-accent, #d4af37); margin-bottom: 8px;">Chapter ${t}</div>
          <div style="font-size: 13px; color: var(--rp-text, #a8b2d1); opacity: 0.8; letter-spacing: 0.5px;">Act ${Number(t) >= 21 ? "3" : "2"} · In Progress</div>
        </div>
      `);
			return;
		}
		if (e._posted === "title") {
			let t = (0, gl.navStatus)(a, e) || "";
			x(`<div class="${W.notYet}" data-not-yet><div class="${W.notYetTitle}">${El(e.title || "")}</div><div class="${W.notYetStatus}">${El(t)}</div></div>`);
			return;
		}
		if (Ol(e)) {
			x(Al(e));
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
			a && a.remove(), i.querySelectorAll(".pp-rights").forEach((e) => e.remove()), x((i.querySelector("body") ? i.querySelector("body").innerHTML : r) + Ml(e));
		} catch {
			x(jl(e, "Rendered article not yet published to GitHub Pages."));
		}
		else x(t === "image" ? (e.image ? `<img src="${e.image}" style="max-width:100%;height:auto;border-radius:4px;display:block;margin:0 auto;">` : "<p style=\"color:#666;\">No image resolved.</p>") + Nl(e) : jl(e) + Nl(e));
	}, de = (0, _.useRef)(null), fe = (0, _.useRef)(null), pe = () => {
		de.current = null;
		let e = j.current, t = fe.current;
		if (!e || !t || !r || !r.setReadingProgress) return;
		let n = e.scrollHeight - e.clientHeight;
		r.setReadingProgress(t, n > 0 ? e.scrollTop / n : 1);
	}, me = () => {
		if (j.current) {
			let { scrollTop: e, scrollHeight: t, clientHeight: n } = j.current, r = t - n, i = r > 0 ? e / r * 100 : 100;
			C(Math.max(0, Math.min(i, 100))), fe.current && (i >= 98 ? (clearTimeout(de.current), pe()) : de.current ||= setTimeout(pe, 350));
		}
	}, he = () => {
		if (!r || !e) return;
		let t = ne(e), n = r.bookmarks(t), i = ge(), a = (0, Kc.bookmarkTap)(n, i);
		if (n.forEach((e) => r.removeBookmark(e.id)), a === "set") {
			let n = j.current ? j.current.querySelectorAll("p") : [], a = i !== null && n[i] ? n[i].innerText.trim().split(/\s+/).slice(0, 8).join(" ") : "";
			r.addBookmark({
				item: t,
				para: i === null ? void 0 : i,
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
		let t = ne(e), n = ge(), r = window.location.href.split("#")[0] + "#read=" + encodeURIComponent(t);
		n !== null && (r += "&p=" + n);
		try {
			await navigator.clipboard.writeText(r);
		} catch (e) {
			console.error("Copy link failed:", e);
			return;
		}
		k(!0), clearTimeout(A.current), A.current = setTimeout(() => k(!1), 1e3);
	};
	(0, _.useEffect)(() => () => clearTimeout(A.current), []);
	let ve = (e) => {
		if (!j.current || e == null) return;
		let t = j.current.querySelectorAll("p");
		if (t[e]) {
			let n = j.current.getBoundingClientRect(), r = t[e].getBoundingClientRect();
			j.current.scrollTop += r.top - n.top - 20;
		}
	}, ye = () => {
		if (!e || !j.current || !(0, Gc.allowDownload)(n)) return;
		let t = `${(n?.export?.license_header || "").replace("{{canonical_url}}", e.canonical_url || e.url)}\n\n---\n\n${j.current.innerText}`, r = new Blob([t], { type: "text/markdown" }), i = document.createElement("a");
		i.href = URL.createObjectURL(r), i.download = `${(e.id || e.url).split("/").pop().replace(".html", "") || "article"}.md`, i.click(), URL.revokeObjectURL(i.href);
	};
	(0, _.useEffect)(() => {
		if (clearTimeout(de.current), de.current = null, fe.current = null, !b || !e || e._posted === "title" || !r || !r.readingProgress) return;
		let t = ne(e), n = setTimeout(() => {
			let e = j.current;
			if (!e) return;
			let n = r.readingProgress(t), a = e.scrollHeight - e.clientHeight;
			i == null && n.at > .02 && n.at < .98 && a > 0 && (e.scrollTop = n.at * a), fe.current = t, me(), a <= 0 && pe();
		}, 60);
		return () => clearTimeout(n);
	}, [b]), (0, _.useEffect)(() => {
		b && i != null && j.current && setTimeout(() => {
			ve(i);
		}, 50);
	}, [b, i]);
	let be = (e, t, n) => {
		let r = e.para === void 0 ? e.paragraph : e.para;
		if (r == null) return null;
		if (e.version && t.version && e.version !== t.version) {
			if (t.version_maps && t.version_maps[e.version]) {
				let n = t.version_maps[e.version][r];
				if (n !== void 0 && n !== -1) return n;
			}
			if (e.quote) {
				let t = Array.from(n).map((e) => e.innerText);
				return (0, Uc.resolveParagraph)(r, e.quote, t);
			}
		}
		return r;
	};
	(0, _.useEffect)(() => {
		if (!r || !j.current) return;
		let t = e ? ne(e) : null, n = r.bookmarks();
		if (j.current.querySelectorAll(".bookmarkRibbon").forEach((e) => e.remove()), t) {
			let r = n.find((e) => e.item === t);
			if (r) {
				let t = j.current.querySelectorAll("p"), n = be(r, e, t);
				if (n !== null && t[n]) {
					let e = document.createElement("div");
					e.className = "bookmarkRibbon", e.setAttribute("aria-hidden", "true"), e.innerHTML = Rc.bookmark, e.style.position = "absolute", e.style.left = "-30px", e.style.top = "0", e.style.color = "var(--rp-accent)", e.style.width = "20px", e.style.height = "20px", t[n].style.position = "relative", t[n].appendChild(e);
				}
			}
		}
	}, [
		ae,
		r ? r.bookmarks() : null,
		e
	]);
	let xe = !!(r && r.readerAid && r.readerAid("followAlong"));
	(0, _.useEffect)(() => {
		if (!(!xe || !j.current)) return fl(j.current);
	}, [
		xe,
		ae,
		e
	]);
	let Se = (0, _.useMemo)(() => e && a ? (0, gl.neighbours)(a, e.id) : {
		prev: [],
		next: []
	}, [e, a]), Ce = () => typeof window < "u" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches, we = (e, t) => {
		if (!(!e || !o || !(0, gl.isReadable)(e))) {
			if (te.current.forEach(clearTimeout), te.current = [], Ce()) {
				o(e);
				return;
			}
			F(t), te.current.push(setTimeout(() => {
				L(t), o(e), te.current.push(setTimeout(() => L(null), 520));
			}, 170));
		}
	}, Te = (t) => {
		if (!e || !a) return;
		let n = (0, gl.step)(a, e.id, t);
		n && we(n, t);
	}, Ee = (0, _.useRef)(Te);
	Ee.current = Te, (0, _.useEffect)(() => () => te.current.forEach(clearTimeout), []);
	let De = !!e && l && !d;
	(0, _.useEffect)(() => {
		if (!De) return;
		let e = (e) => {
			if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
			let t = e.target;
			t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) || (e.key === "ArrowRight" && (e.preventDefault(), Ee.current("next")), e.key === "ArrowLeft" && (e.preventDefault(), Ee.current("prev")));
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [De]), (0, _.useEffect)(() => {
		let e = j.current;
		if (!De || !e) return;
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
			o && !o.isCollapsed && String(o).trim() || xe && n.onText || Ee.current(i < 0 ? "next" : "prev");
		}, i = () => {
			t = null;
		};
		return e.addEventListener("touchstart", n, { passive: !0 }), e.addEventListener("touchend", r, { passive: !0 }), e.addEventListener("touchcancel", i, { passive: !0 }), () => {
			e.removeEventListener("touchstart", n), e.removeEventListener("touchend", r), e.removeEventListener("touchcancel", i);
		};
	}, [De, xe]);
	let Oe = (0, _.useRef)(null);
	if (Oe.current = he, (0, _.useEffect)(() => {
		let e = () => {
			Oe.current && Oe.current();
		};
		return window.addEventListener("postpipe:reader-mark", e), () => window.removeEventListener("postpipe:reader-mark", e);
	}, []), !e) return null;
	let ke = (e, t) => {
		let n = (0, gl.navStatus)(a, e), r = /* @__PURE__ */ (0, H.jsx)(Zc, {
			body: (0, el.iconBody)(t === "next" ? "arrow-right" : "arrow-left"),
			size: 16,
			className: W.navArrow
		}), i = t === "next" ? /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [/* @__PURE__ */ (0, H.jsx)("span", {
			className: W.navTitle,
			children: e.title
		}), r] }) : /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [r, /* @__PURE__ */ (0, H.jsx)("span", {
			className: W.navTitle,
			children: e.title
		})] });
		return n ? /* @__PURE__ */ (0, H.jsxs)("div", {
			className: `${W.navItem} ${W.navLocked} ${t === "next" ? W.navNext : ""}`,
			"data-reader-nav": t,
			"data-nav-status": !0,
			children: [/* @__PURE__ */ (0, H.jsx)("span", {
				className: W.navLine,
				children: i
			}), /* @__PURE__ */ (0, H.jsx)("span", {
				className: W.navStatus,
				children: n
			})]
		}, e.id) : /* @__PURE__ */ (0, H.jsx)("button", {
			className: `${W.navItem} ${t === "next" ? W.navNext : ""}`,
			"data-reader-nav": t,
			onClick: () => we(e, t),
			title: e.title,
			children: /* @__PURE__ */ (0, H.jsx)("span", {
				className: W.navLine,
				children: i
			})
		}, e.id);
	}, Ae = (e) => (Se.prev.length > 0 || Se.next.length > 0) && /* @__PURE__ */ (0, H.jsxs)("nav", {
		className: e === "top" ? W.navTop : W.navBottom,
		"aria-label": "Chapters either side",
		"data-reader-nav-row": e,
		...e === "bottom" ? { "data-reader-nav-bottom": "" } : {},
		children: [/* @__PURE__ */ (0, H.jsx)("span", {
			className: W.navSide,
			children: Se.prev.map((e) => ke(e, "prev"))
		}), /* @__PURE__ */ (0, H.jsx)("span", {
			className: `${W.navSide} ${W.navSideNext}`,
			children: Se.next.map((e) => ke(e, "next"))
		})]
	}), je = [e.date ? (/* @__PURE__ */ new Date(`${e.date}T00:00:00`)).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	}) : "", e.reading_time].filter(Boolean), Me = (0, Wc.byline)(n, e), Ne = Me ? Me.name : "", Pe = Me ? Me.url : null, Fe = (0, is.readerHeader)(n, e), Ie = (0, Gc.progressBarMode)(n), Le = (0, Gc.allowDownload)(n), Re = (0, pc.rightsLine)(n && n.rights);
	return /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [
		/* @__PURE__ */ (0, H.jsx)("div", {
			className: `${W.overlay} ${l && !d ? W.open : ""}`,
			onClick: t
		}),
		/* @__PURE__ */ (0, H.jsxs)("div", {
			"data-reader-panel": !0,
			className: `${W.panel} ${l && !d ? W.open : ""} ${d ? W.minimized : ""} ${w ? W.wide : ""} ${E ? W.full : ""}`,
			style: p ? { transform: `translate3d(${p.x}px, ${p.y}px, 0px)` } : void 0,
			children: [
				Ie !== "none" && /* @__PURE__ */ (0, H.jsx)("div", {
					className: Ie === "side" ? W.progressSide : W.progress,
					role: "progressbar",
					"aria-label": "Reading progress",
					"aria-valuemin": 0,
					"aria-valuemax": 100,
					"aria-valuenow": Math.round(S),
					children: /* @__PURE__ */ (0, H.jsx)("div", {
						className: W.progressFill,
						style: Ie === "side" ? { height: `${S}%` } : { width: `${S}%` }
					})
				}),
				/* @__PURE__ */ (0, H.jsxs)("div", {
					className: W.toolbar,
					onMouseDown: se,
					onDoubleClick: () => m(null),
					title: "Drag to move the reader · Double-click to put it back",
					"data-reader-header": !0,
					children: [
						/* @__PURE__ */ (0, H.jsx)("div", {
							className: W.dragGrip,
							"aria-hidden": "true",
							children: "⋮⋮"
						}),
						/* @__PURE__ */ (0, H.jsx)("div", {
							id: "tts-mount-point",
							className: `${W.toolbarGroup} ${W.ttsMount}`
						}),
						/* @__PURE__ */ (0, H.jsxs)("div", {
							className: W.toolbarGroup,
							children: [
								/* @__PURE__ */ (0, H.jsxs)("button", {
									className: `${W.tb} ${W.tbLabeled} ${ie.length > 0 ? W.active : ""}`,
									onClick: he,
									"aria-pressed": ie.length > 0,
									title: ie.length > 0 ? "Bookmark the paragraph at the top (it replaces this chapter's bookmark), or take it away where it is" : "Bookmark the paragraph at the top of the reader",
									"data-bookmark-toggle": !0,
									children: [/* @__PURE__ */ (0, H.jsx)(Zc, {
										body: (0, el.iconBody)("bookmark"),
										size: 17
									}), /* @__PURE__ */ (0, H.jsx)("span", {
										className: W.tbText,
										children: "Bookmark"
									})]
								}),
								(0, Gc.bookmarksList)(n) && /* @__PURE__ */ (0, H.jsx)("button", {
									className: `${W.tb} ${v ? W.active : ""}`,
									onClick: () => y((e) => !e),
									"aria-expanded": v,
									title: "Every place you have bookmarked",
									"aria-label": "Bookmarks",
									"data-bookmark-list": !0,
									children: /* @__PURE__ */ (0, H.jsx)(Zc, {
										body: (0, el.iconBody)("list"),
										size: 17
									})
								}),
								/* @__PURE__ */ (0, H.jsx)("button", {
									className: W.tb,
									onClick: _e,
									title: "Copy a link to here",
									"aria-label": "Copy a link to here",
									"data-reader-link": !0,
									children: /* @__PURE__ */ (0, H.jsx)(Zc, {
										body: (0, el.iconBody)("link"),
										size: 17
									})
								}),
								O && /* @__PURE__ */ (0, H.jsx)("span", {
									className: W.copied,
									role: "status",
									"data-reader-copied": !0,
									children: "copied"
								}),
								/* @__PURE__ */ (0, H.jsx)("button", {
									className: `${W.tb} ${h ? W.active : ""}`,
									onClick: () => g(!h),
									title: "Details",
									"aria-label": "Details",
									"aria-pressed": h,
									"data-reader-details": !0,
									children: /* @__PURE__ */ (0, H.jsx)(Zc, {
										body: (0, el.iconBody)("info"),
										size: 17
									})
								}),
								Le && /* @__PURE__ */ (0, H.jsx)("button", {
									className: W.tb,
									onClick: ye,
									title: "Download",
									"aria-label": "Download",
									"data-reader-download": !0,
									children: /* @__PURE__ */ (0, H.jsx)(Zc, {
										body: (0, el.iconBody)("download"),
										size: 17
									})
								}),
								Object.entries(e.syndication || {}).map(([e, t]) => {
									if (!t) return null;
									let r = n?.toolbar?.syndication_icons?.[e];
									return r ? /* @__PURE__ */ (0, H.jsx)("a", {
										href: t,
										target: "_blank",
										rel: "noopener noreferrer",
										className: `${W.tb} ${W.syndLink}`,
										title: r.label,
										"aria-label": r.label,
										dangerouslySetInnerHTML: { __html: Rc[r.icon] || Rc.globe }
									}, e) : null;
								})
							]
						}),
						/* @__PURE__ */ (0, H.jsx)("div", { className: W.toolbarSpacer }),
						/* @__PURE__ */ (0, H.jsxs)("div", {
							className: W.windowControls,
							"data-reader-window": !0,
							children: [
								/* @__PURE__ */ (0, H.jsx)("button", {
									className: W.tb,
									onClick: () => window.dispatchEvent(new CustomEvent("postpipe:toggle-settings", { detail: { where: "reader" } })),
									title: "Reading settings",
									"aria-label": "Reading settings",
									"data-reader-settings": !0,
									children: /* @__PURE__ */ (0, H.jsx)(Zc, {
										body: (0, el.iconBody)("sliders-horizontal"),
										size: 17
									})
								}),
								/* @__PURE__ */ (0, H.jsx)("button", {
									className: `${W.tb} ${W.growBtn} ${w ? W.active : ""}`,
									onClick: () => T((e) => !e),
									"aria-pressed": w,
									title: w ? "Narrower" : "Wider",
									"aria-label": w ? "Narrower" : "Wider",
									"data-reader-grow": !0,
									children: /* @__PURE__ */ (0, H.jsx)(Zc, {
										body: (0, el.iconBody)("move-horizontal"),
										size: 17
									})
								}),
								/* @__PURE__ */ (0, H.jsx)("button", {
									className: `${W.tb} ${E ? W.active : ""}`,
									onClick: () => {
										D((e) => !e), m(null);
									},
									"aria-pressed": E,
									title: E ? "Back to the side" : "Fill the window",
									"aria-label": E ? "Back to the side" : "Fill the window",
									"data-reader-expand": !0,
									children: /* @__PURE__ */ (0, H.jsx)(Zc, {
										body: (0, el.iconBody)(E ? "minimize-2" : "maximize-2"),
										size: 17
									})
								}),
								/* @__PURE__ */ (0, H.jsx)("button", {
									className: W.tb,
									onClick: () => f(!0),
									title: "Minimise the reader",
									"aria-label": "Minimise the reader",
									"data-reader-minimise": !0,
									children: /* @__PURE__ */ (0, H.jsx)(Zc, {
										body: (0, el.iconBody)("minus"),
										size: 17
									})
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, H.jsx)("button", {
					className: W.closeX,
					onClick: t,
					title: "Close the reader",
					"aria-label": "Close the reader",
					"data-reader-close": !0,
					children: /* @__PURE__ */ (0, H.jsx)(Zc, {
						body: (0, el.iconBody)("x"),
						size: 20
					})
				}),
				h && /* @__PURE__ */ (0, H.jsx)(Pl, {
					article: e,
					settings: n
				}),
				v && (0, Gc.bookmarksList)(n) && /* @__PURE__ */ (0, H.jsx)(Xc, {
					viewState: r,
					feedData: a,
					itemId: re
				}),
				/* @__PURE__ */ (0, H.jsxs)("div", {
					className: `${W.body} ${xe ? W.following : ""} ${P ? W["turnOut_" + P] : ""} ${I ? W["turnIn_" + I] : ""}`,
					"data-tts-target": !0,
					"data-follow-along": xe ? "on" : "off",
					ref: j,
					onScroll: me,
					children: [
						Ae("top"),
						/* @__PURE__ */ (0, H.jsxs)("div", {
							className: W.articleHeader,
							children: [
								Fe.kicker && /* @__PURE__ */ (0, H.jsx)("div", {
									className: W.articleKicker,
									children: Fe.kicker
								}),
								/* @__PURE__ */ (0, H.jsx)("h1", {
									className: W.articleTitle,
									children: e.title || e.label
								}),
								Fe.byline && Ne && /* @__PURE__ */ (0, H.jsxs)("div", {
									className: W.articleByline,
									children: ["by ", Pe ? /* @__PURE__ */ (0, H.jsx)("a", {
										href: Pe,
										target: "_blank",
										rel: "noopener noreferrer",
										children: Ne
									}) : Ne]
								}),
								je.length > 0 && /* @__PURE__ */ (0, H.jsx)("div", {
									className: W.articleMeta,
									children: je.join(" · ")
								})
							]
						}),
						/* @__PURE__ */ (0, H.jsx)("div", {
							ref: ee,
							"data-reader-text": !0,
							dangerouslySetInnerHTML: oe
						}),
						b && Ae("bottom"),
						Re && b && /* @__PURE__ */ (0, H.jsx)("footer", {
							className: W.rightsLine,
							"data-reader-rights": !0,
							children: Re
						}),
						c && b && e._posted !== "title" && /* @__PURE__ */ (0, H.jsx)(Sl, {
							article: e,
							contributions: s || [],
							config: c,
							feedData: a,
							textRef: ee,
							textKey: ae,
							onOpenChapter: (e) => we(e, "next")
						})
					]
				})
			]
		}),
		d && e && /* @__PURE__ */ (0, H.jsxs)("div", {
			className: W.restorePill,
			onClick: () => f(!1),
			title: "Bring reading window back",
			children: [
				/* @__PURE__ */ (0, H.jsx)("span", {
					className: W.pillIcon,
					children: /* @__PURE__ */ (0, H.jsx)(Zc, {
						body: (0, el.iconBody)("bookmark"),
						size: 18
					})
				}),
				/* @__PURE__ */ (0, H.jsxs)("span", {
					className: W.pillLabel,
					children: [/* @__PURE__ */ (0, H.jsx)("span", {
						className: W.pillTitle,
						children: e.title || e.label
					}), Ne && /* @__PURE__ */ (0, H.jsxs)("span", {
						className: W.pillAuthor,
						children: ["by ", Ne]
					})]
				}),
				/* @__PURE__ */ (0, H.jsx)("span", {
					className: W.pillAction,
					children: "Restore"
				})
			]
		})
	] });
}
function El(e) {
	return String(e).replace(/[&<>"']/g, (e) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;"
	})[e]);
}
function Dl(e) {
	return e._source || e.originalItem && e.originalItem._source || null;
}
function Ol(e) {
	let t = Dl(e);
	return t ? t.type !== "local" : (e.kind === "text" || e.kind === "link") && typeof e.content_html == "string";
}
function kl(e) {
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
function Al(e) {
	let t = "";
	if (typeof e.content_html == "string" && e.content_html.trim()) {
		let n = kl(e.content_html);
		t += /<(p|div|ul|ol|h[1-6]|blockquote|pre|table|figure|section|article)\b/i.test(n) ? n : `<p>${n}</p>`;
	} else (e.tldr || e.summary) && (t += `<p>${El(e.tldr || e.summary)}</p>`);
	let n = e.canonical_url || e.url || "";
	if (n) {
		let r = Dl(e), i = r && r.title || "";
		if (!i) try {
			i = new URL(n).hostname;
		} catch {
			i = "";
		}
		t += `<p data-reader-link-out><a href="${El(n)}" target="_blank" rel="noopener noreferrer">Read the whole piece${i ? " at " + El(i) : ""}</a></p>`;
	}
	return t;
}
function jl(e, t) {
	let n = t || `This substrate ("${e.kind || "unknown"}") is not yet renderable in the viewer.`, r = "<div style=\"padding:24px;border:1px dashed var(--rp-border);border-radius:6px;background:rgba(17,24,39,0.4);\">";
	r += `<p style="color:var(--rp-accent);font-weight:600;margin-bottom:8px;">${n}</p>`, e.todos && e.todos.length && (r += `<p style="color:#f39c12;font-size:13px;">Pending: ${e.todos.join(", ")}</p>`);
	let i = (e.url || e.id || "").split("/").pop().replace(".html", ""), a = e._source?.path || `chapters/${i}`;
	return r += `<p style="color:#888;font-size:13px;margin-top:12px;">The bundle exists at <code>${a}</code>.</p>`, r += "</div>", r;
}
function Ml(e) {
	let t = e.forms && e.forms.companions || [];
	if (!t.length) return "";
	let n = "<div style=\"margin-top:32px;padding-top:24px;border-top:1px solid var(--rp-border);\">";
	return n += "<div style=\"color:var(--rp-accent);font-size:11px;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;\">also exists as</div>", n += `<div style="color:var(--rp-text);font-size:14px;">${t.map((e) => `<span class="${W.fmTag}">${e}</span>`).join(" ")}</div>`, n += "</div>", n;
}
function Nl(e) {
	let t = [];
	if (e.seed && t.push(["seed", e.seed]), e.tldr && t.push(["tldr", e.tldr]), e.topology && e.topology.length && t.push(["topology", e.topology.join(" · ")]), e.energy && t.push(["energy", e.energy]), e.note && t.push(["note", e.note]), !t.length) return "";
	let n = "<div style=\"margin-top:32px;padding:20px;background:rgba(17,24,39,0.4);border-radius:6px;\">";
	for (let [e, r] of t) n += `<div class="${W.fmRow}"><span class="${W.fmLabel}">${e}</span><span class="${W.fmValue}">${r}</span></div>`;
	return n += "</div>", n;
}
function Pl({ article: e, settings: t }) {
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
				e.tags && e.tags.length && (n = /* @__PURE__ */ (0, H.jsx)(H.Fragment, { children: e.tags.map((e) => /* @__PURE__ */ (0, H.jsx)("span", {
					className: W.fmTag,
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
				r.length && (n = /* @__PURE__ */ (0, H.jsx)(H.Fragment, { children: r.map(([e, t], n) => /* @__PURE__ */ (0, H.jsxs)(_.Fragment, { children: [/* @__PURE__ */ (0, H.jsx)("a", {
					className: W.fmSyndLink,
					href: t,
					target: "_blank",
					rel: "noopener noreferrer",
					children: e
				}), n < r.length - 1 ? " · " : ""] }, e)) }));
				break;
			default: break;
		}
		return n ? (r = !0, /* @__PURE__ */ (0, H.jsxs)("div", {
			className: W.fmRow,
			children: [/* @__PURE__ */ (0, H.jsx)("span", {
				className: W.fmLabel,
				children: t.replace(/_/g, " ")
			}), /* @__PURE__ */ (0, H.jsx)("span", {
				className: W.fmValue,
				children: n
			})]
		}, t)) : null;
	});
	return /* @__PURE__ */ (0, H.jsx)("div", {
		className: `${W.frontmatterPanel} ${W.open}`,
		children: r ? i : /* @__PURE__ */ (0, H.jsx)("div", {
			className: W.fmRow,
			children: /* @__PURE__ */ (0, H.jsx)("span", {
				className: W.fmValue,
				style: { color: "#666" },
				children: "No metadata available."
			})
		})
	});
}
var Fl = {
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
function Il() {
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
function Ll({ targetRef: e }) {
	let { T: t, state: n, engineProgress: r, errorMsg: i, statusMessage: a, isError: o, setStatusMessage: s, setIsError: c } = Il();
	return t ? /* @__PURE__ */ (0, H.jsxs)("div", {
		className: Fl.ttsGroup,
		style: { position: "relative" },
		children: [
			n !== "playing" && /* @__PURE__ */ (0, H.jsx)("button", {
				className: Fl.tb,
				onClick: () => {
					!t || !e.current || (s(null), c(!1), t.play(e.current, { scrollContainer: e.current }));
				},
				title: "Play",
				dangerouslySetInnerHTML: { __html: `${Rc.play}<span class="${Fl.tbTooltip}">Play</span>` }
			}),
			n === "playing" && /* @__PURE__ */ (0, H.jsx)("button", {
				className: Fl.tb,
				onClick: () => {
					t && t.pause();
				},
				title: "Pause",
				dangerouslySetInnerHTML: { __html: `${Rc.pause}<span class="${Fl.tbTooltip}">Pause</span>` }
			}),
			(n === "playing" || n === "paused" || n === "loading") && /* @__PURE__ */ (0, H.jsx)("button", {
				className: Fl.tb,
				onClick: () => {
					t && t.stop();
				},
				title: "Stop",
				dangerouslySetInnerHTML: { __html: `${Rc.stop}<span class="${Fl.tbTooltip}">Stop</span>` }
			}),
			n === "loading" && r > 0 && /* @__PURE__ */ (0, H.jsx)("div", {
				className: Fl.loadingBarContainer,
				children: /* @__PURE__ */ (0, H.jsx)("div", {
					className: Fl.loadingBarFill,
					style: { width: `${r}%` }
				})
			}),
			n === "playing" && /* @__PURE__ */ (0, H.jsxs)("div", {
				className: Fl.visualizer,
				children: [
					/* @__PURE__ */ (0, H.jsx)("div", { className: Fl.bar }),
					/* @__PURE__ */ (0, H.jsx)("div", { className: Fl.bar }),
					/* @__PURE__ */ (0, H.jsx)("div", { className: Fl.bar }),
					/* @__PURE__ */ (0, H.jsx)("div", { className: Fl.bar })
				]
			}),
			/* @__PURE__ */ (0, H.jsx)("div", {
				className: `${Fl.errorToast} ${i ? Fl.show : ""}`,
				children: i
			}),
			a && /* @__PURE__ */ (0, H.jsx)("span", {
				className: `${Fl.statusBadge} ${o ? Fl.error : ""}`,
				children: a
			})
		]
	}) : null;
}
function Rl() {
	let { T: e, engines: t, selectedEngine: n, voices: r, selectedVoice: i, capabilities: a, params: o, handleEngineChange: s, handleVoiceChange: c, handleParamChange: l } = Il();
	if (!e) return null;
	let u = typeof window < "u" ? window.PPVoices : null, d = typeof window < "u" && window.TTS_CONFIG && window.TTS_CONFIG.lang || "en";
	return /* @__PURE__ */ (0, H.jsxs)("div", {
		className: Fl.ttsSettings,
		"data-tts-settings": !0,
		children: [
			t.length > 1 && /* @__PURE__ */ (0, H.jsx)("select", {
				className: Fl.select,
				style: { maxWidth: 110 },
				value: n,
				onChange: s,
				title: "TTS Engine",
				children: t.map((e) => /* @__PURE__ */ (0, H.jsx)("option", {
					value: e.id,
					children: e.label
				}, e.id))
			}),
			/* @__PURE__ */ (0, H.jsxs)("label", {
				className: Fl.settingRow,
				children: [/* @__PURE__ */ (0, H.jsx)("span", { children: "Voice" }), /* @__PURE__ */ (0, H.jsx)("select", {
					className: Fl.select,
					value: i,
					onChange: c,
					title: "Voices on this device",
					"data-tts-voice": !0,
					children: (() => {
						if (!r.length) return /* @__PURE__ */ (0, H.jsx)("option", { children: "Loading..." });
						let e = (e) => /* @__PURE__ */ (0, H.jsx)("option", {
							value: e.id,
							children: e.label
						}, e.id), t = u && u.voiceGroups ? u.voiceGroups(r, { lang: d }) : [];
						return t.length < 2 ? r.map(e) : t.map((t) => /* @__PURE__ */ (0, H.jsx)("optgroup", {
							label: t.label,
							children: t.voices.map(e)
						}, t.label));
					})()
				})]
			}),
			/* @__PURE__ */ (0, H.jsx)("div", {
				className: Fl.params,
				children: Object.entries(a).map(([e, t]) => !t || e === "voice" || e === "pitch" || e === "volume" ? null : t.type === "range" ? /* @__PURE__ */ (0, H.jsxs)("label", {
					className: Fl.settingRow,
					title: `${t.label}: ${o[e]}`,
					children: [/* @__PURE__ */ (0, H.jsxs)("span", { children: [
						t.label,
						" ",
						/* @__PURE__ */ (0, H.jsxs)("span", {
							className: Fl.paramValue,
							children: [Number(o[e] ?? t.default).toFixed(1), "×"]
						})
					] }), /* @__PURE__ */ (0, H.jsx)("input", {
						"data-tts-param": e,
						type: "range",
						min: t.min,
						max: t.max,
						step: t.step || .1,
						value: o[e] ?? t.default,
						onChange: (t) => l(e, parseFloat(t.target.value))
					})]
				}, e) : t.type === "select" ? /* @__PURE__ */ (0, H.jsxs)("label", {
					className: Fl.settingRow,
					children: [/* @__PURE__ */ (0, H.jsx)("span", { children: t.label }), /* @__PURE__ */ (0, H.jsx)("select", {
						value: o[e] ?? t.default,
						onChange: (t) => l(e, t.target.value),
						children: t.options.map((e) => /* @__PURE__ */ (0, H.jsx)("option", {
							value: e.value,
							children: e.label
						}, e.value))
					})]
				}, e) : null)
			})
		]
	});
}
var K = {
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
}, q = (/* @__PURE__ */ o(((e, t) => {
	var { siteIcon: n } = Qc(), { isLinkItem: r } = Ls(), i = (e) => typeof e == "string" ? e.trim() : "";
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
function J({ config: e }) {
	let [t, n] = (0, _.useState)(!1), [r, i] = (0, _.useState)(""), [a, o] = (0, _.useState)(!1), [s, c] = (0, _.useState)(null), l = (0, _.useRef)(null), u = (0, _.useRef)(null), d = (0, _.useRef)(null), f = (0, _.useRef)(null), p = (e) => {
		n(!1), e && u.current && u.current.focus();
	};
	return (0, _.useLayoutEffect)(() => {
		if (!t || !d.current) return;
		let e = u.current ? u.current.getBoundingClientRect().bottom : 36, n = document.querySelector("[data-settings-gear]");
		n && (e = Math.max(e, n.getBoundingClientRect().bottom)), d.current.style.top = `${Math.round(e + 8)}px`, f.current && f.current.focus({ preventScroll: !0 });
	}, [t]), (0, _.useEffect)(() => {
		if (!t) return;
		let e = (e) => {
			l.current && !l.current.contains(e.target) && n(!1);
		}, r = (e) => {
			e.key === "Escape" && (e.preventDefault(), e.stopImmediatePropagation(), p(!0));
		};
		return document.addEventListener("pointerdown", e, !0), window.addEventListener("keydown", r, !0), () => {
			document.removeEventListener("pointerdown", e, !0), window.removeEventListener("keydown", r, !0);
		};
	}, [t]), /* @__PURE__ */ (0, H.jsxs)("div", {
		ref: l,
		className: K.subscribe,
		"data-top-subscribe-wrap": !0,
		children: [/* @__PURE__ */ (0, H.jsx)("button", {
			ref: u,
			type: "button",
			className: `${K.pill} ${K.pagePill} ${e.icon ? K.iconOnly : ""} ${t ? K.pillOn : ""}`,
			"aria-label": e.label,
			title: e.label,
			"aria-haspopup": "dialog",
			"aria-expanded": t,
			"data-top-subscribe": !0,
			"data-has-icon": e.icon ? "" : void 0,
			onClick: () => {
				c(null), n((e) => !e);
			},
			children: e.icon ? /* @__PURE__ */ (0, H.jsx)(Zc, {
				body: e.icon,
				size: 15,
				className: K.pillIcon
			}) : /* @__PURE__ */ (0, H.jsx)("span", {
				className: K.title,
				children: e.label
			})
		}), t && /* @__PURE__ */ (0, H.jsxs)("div", {
			ref: d,
			className: K.subscribeSheet,
			role: "dialog",
			"aria-label": e.label,
			"data-top-subscribe-sheet": !0,
			children: [/* @__PURE__ */ (0, H.jsxs)("form", {
				className: K.subscribeForm,
				onSubmit: async (t) => {
					if (e.newTab || (t.preventDefault(), a)) return;
					o(!0), c(null);
					let n = await (0, q.subscribe)(e, r);
					o(!1), c(n), n.ok && i("");
				},
				...e.newTab ? {
					action: e.action,
					method: "post",
					target: "_blank",
					rel: "noopener"
				} : {},
				children: [/* @__PURE__ */ (0, H.jsx)("input", {
					ref: f,
					className: K.subscribeInput,
					type: "email",
					name: e.field,
					required: !0,
					autoComplete: "email",
					placeholder: e.placeholder,
					"aria-label": e.placeholder,
					value: r,
					onChange: (e) => i(e.target.value)
				}), /* @__PURE__ */ (0, H.jsx)("button", {
					type: "submit",
					className: K.subscribeSubmit,
					disabled: a,
					"data-top-subscribe-submit": !0,
					children: e.label
				})]
			}), /* @__PURE__ */ (0, H.jsx)("p", {
				className: `${K.subscribeMessage} ${s ? s.ok ? K.subscribeOk : K.subscribeError : ""}`,
				role: "status",
				"aria-live": "polite",
				"data-top-subscribe-message": !0,
				children: s ? s.message : ""
			})]
		})]
	});
}
//#endregion
//#region src/components/FeedZ/FeedZ.jsx
function Y({ sources: e, hiddenSources: t, onToggleSource: n, viewState: r, showCount: i = !0, pages: a = [], onOpenPage: o, links: s = [], subscribe: c = null, resume: l = null, onResume: u, order: d = null, showAddButton: f = !0, intro: p = "", controls: m = null, showSources: h = !0 }) {
	let g = (0, _.useRef)(null), v = Array.isArray(a) && a.length > 0, y = Array.isArray(s) && s.length > 0, b = !!m;
	if ((0, _.useLayoutEffect)(() => {
		b && g.current && Vl(g.current);
	}), (0, _.useEffect)(() => {
		if (!b) return;
		let e = () => {
			g.current && Vl(g.current);
		};
		return window.addEventListener("resize", e), typeof document < "u" && document.fonts && document.fonts.ready && document.fonts.ready.then(e), () => window.removeEventListener("resize", e);
	}, [b]), h === !1 && (e = []), (!e || e.length === 0) && !v && !y && !c && !l && !p && !m) return null;
	let x = t || /* @__PURE__ */ new Set(), S = Array.isArray(d) && d.length ? d : [
		...l ? ["resume"] : [],
		...v ? a.map((e) => `page:${e.id}`) : [],
		...y ? s.map((e) => `link:${e.id}`) : [],
		...c ? ["subscribe"] : []
	], C = (e) => /* @__PURE__ */ (0, H.jsxs)("button", {
		type: "button",
		className: `${K.pill} ${K.pagePill} ${e.icon && !e.showLabel ? K.iconOnly : ""}`,
		"data-top-pages": !0,
		"data-top-page": e.id,
		"data-has-icon": e.icon ? "" : void 0,
		"aria-label": e.icon ? e.label : void 0,
		title: e.item && e.item.title ? e.item.title : e.label,
		onClick: () => o && o(e.item),
		children: [e.icon && /* @__PURE__ */ (0, H.jsx)(Zc, {
			body: e.icon,
			size: 15,
			className: K.pillIcon
		}), e.showLabel !== !1 && /* @__PURE__ */ (0, H.jsx)("span", {
			className: `${K.title} ${K.pageLabel}`,
			children: e.label
		})]
	}, e.id), w = (e) => /* @__PURE__ */ (0, H.jsxs)("a", {
		href: e.href,
		className: `${K.pill} ${K.pagePill} ${K.linkPill} ${e.icon && !e.showLabel ? K.iconOnly : ""}`,
		"data-top-link": e.id,
		"data-has-icon": e.icon ? "" : void 0,
		"aria-label": e.label,
		title: e.label,
		...e.newTab ? {
			target: "_blank",
			rel: "noopener"
		} : {},
		children: [e.icon && /* @__PURE__ */ (0, H.jsx)(Zc, {
			body: e.icon,
			size: 15,
			className: K.pillIcon
		}), e.showLabel && /* @__PURE__ */ (0, H.jsx)("span", {
			className: `${K.title} ${K.pageLabel}`,
			children: e.label
		})]
	}, e.id), T = () => l ? /* @__PURE__ */ (0, H.jsxs)("button", {
		type: "button",
		className: `${K.pill} ${K.pagePill} ${l.icon && !l.showLabel ? K.iconOnly : ""}`,
		"data-top-resume": !0,
		"data-has-icon": l.icon ? "" : void 0,
		"aria-label": l.label,
		title: l.label,
		onClick: () => u && u(),
		children: [l.icon && /* @__PURE__ */ (0, H.jsx)(Zc, {
			body: l.icon,
			size: 15,
			className: K.pillIcon
		}), l.showLabel && /* @__PURE__ */ (0, H.jsx)("span", {
			className: `${K.title} ${K.pageLabel}`,
			children: l.label
		})]
	}, "resume") : null;
	return /* @__PURE__ */ (0, H.jsxs)("div", {
		ref: g,
		className: K.bar,
		"data-feeds": !0,
		children: [
			(e || []).map((e) => /* @__PURE__ */ (0, H.jsx)(Hl, {
				source: e,
				hidden: x.has(e.id),
				onToggle: () => n && n(e.id),
				viewState: r,
				showCount: i
			}, e.id)),
			S.map((e) => {
				if (e === "resume") return T();
				if (e === "subscribe") return c ? /* @__PURE__ */ (0, H.jsx)(J, { config: c }, "subscribe") : null;
				if (e.startsWith("page:")) {
					let t = a.find((t) => `page:${t.id}` === e);
					return t ? C(t) : null;
				}
				if (e.startsWith("link:")) {
					let t = s.find((t) => `link:${t.id}` === e);
					return t ? w(t) : null;
				}
				return null;
			}),
			f !== !1 && /* @__PURE__ */ (0, H.jsx)(Kl, {}),
			m,
			p && /* @__PURE__ */ (0, H.jsx)("div", {
				className: K.intro,
				"data-graph-intro": !0,
				dangerouslySetInnerHTML: { __html: p }
			})
		]
	});
}
function zl(e) {
	return [...e.children].filter((e) => {
		if (e.matches("[data-graph-intro]")) return !1;
		let t = getComputedStyle(e).position;
		return t !== "fixed" && t !== "absolute" && e.getBoundingClientRect().width > 0;
	});
}
function Bl(e) {
	let t = zl(e);
	if (t.length < 2) return !1;
	let n = t[0].getBoundingClientRect().top;
	return t.some((e) => Math.abs(e.getBoundingClientRect().top - n) > 2);
}
function Vl(e) {
	let t = ["data-fit-dots", "data-fit-icons"], n = e.querySelector("[data-source-pill]");
	for (let n of [...t, "data-fit-title"]) e.removeAttribute(n);
	n && (n.style.maxWidth = "");
	for (let n of t) {
		if (!Bl(e)) return;
		e.setAttribute(n, "");
	}
	if (!Bl(e) || !n) return;
	e.setAttribute("data-fit-title", "");
	let r = zl(e), i = parseFloat(getComputedStyle(e).columnGap) || 0, a = r.reduce((e, t) => e + t.getBoundingClientRect().width, 0) + i * (r.length - 1) - e.clientWidth, o = n.getBoundingClientRect().width;
	n.style.maxWidth = `${Math.max(34, Math.floor(o - a - 1))}px`;
}
function Hl({ source: e, hidden: t, onToggle: n, viewState: r, showCount: i }) {
	let a = e.title || e.id, o = e.ok !== !1, s = r && r.sourceColor(e.id) || e.color;
	return /* @__PURE__ */ (0, H.jsxs)("div", {
		className: `${K.pill} ${t ? K.hidden : ""} ${o ? "" : K.failed}`,
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
			/* @__PURE__ */ (0, H.jsx)(Gl, {
				color: s,
				sourceId: e.id,
				viewState: r
			}),
			/* @__PURE__ */ (0, H.jsx)("span", {
				className: K.title,
				children: a
			}),
			i && /* @__PURE__ */ (0, H.jsx)("span", {
				className: K.count,
				children: e.itemCount
			})
		]
	});
}
var Ul = [
	"#e74c3c",
	"#e67e22",
	"#f1c40f",
	"#2ecc71",
	"#1abc9c",
	"#3498db",
	"#9b59b6",
	"#e84393"
], Wl = 650;
function Gl({ color: e, sourceId: t, viewState: n }) {
	let [r, i] = (0, _.useState)(!1), a = (0, _.useRef)(null);
	(0, _.useEffect)(() => () => {
		a.current && clearTimeout(a.current);
	}, []);
	let o = (e) => {
		e.stopPropagation(), i(!0);
	}, s = (e) => {
		e && e.stopPropagation(), i(!1);
	}, c = () => {
		a.current = setTimeout(() => i(!0), Wl);
	}, l = () => {
		a.current &&= (clearTimeout(a.current), null);
	}, u = (e, r) => {
		r.stopPropagation(), n && n.setSourceColor(t, e), i(!1);
	}, d = Ul.length;
	return /* @__PURE__ */ (0, H.jsxs)("span", {
		className: K.dotWrap,
		onMouseEnter: c,
		onMouseLeave: l,
		onClick: o,
		onTouchEnd: o,
		children: [/* @__PURE__ */ (0, H.jsx)("span", {
			className: `${K.dot} ${r ? K.dotActive : ""}`,
			"aria-hidden": "true"
		}), r && /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [/* @__PURE__ */ (0, H.jsx)("span", {
			className: K.ringBackdrop,
			onClick: s,
			onTouchEnd: s
		}), /* @__PURE__ */ (0, H.jsx)("span", {
			className: K.ring,
			children: Ul.map((t, n) => {
				let r = (d === 1 ? 15 : 15 + n / (d - 1) * 150) * Math.PI / 180, i = 30 * Math.cos(r), a = 30 * Math.sin(r);
				return /* @__PURE__ */ (0, H.jsx)("button", {
					type: "button",
					className: `${K.swatch} ${t.toLowerCase() === String(e).toLowerCase() ? K.swatchCurrent : ""}`,
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
function Kl() {
	let [e, t] = (0, _.useState)(!1), [n, r] = (0, _.useState)(""), [i, a] = (0, _.useState)(null), o = (0, _.useRef)(null);
	(0, _.useEffect)(() => {
		e && o.current && o.current.focus();
	}, [e]);
	let s = Jl(n), c = (e) => {
		e && e.preventDefault(), s && (a(n.trim()), r(""), t(!1));
	}, l = () => {
		r(""), t(!1);
	};
	return /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [e ? /* @__PURE__ */ (0, H.jsxs)("form", {
		className: `${K.pill} ${K.addOpen}`,
		onSubmit: c,
		children: [
			/* @__PURE__ */ (0, H.jsx)("input", {
				ref: o,
				type: "url",
				placeholder: "paste a feed URL…",
				className: K.addInput,
				value: n,
				onChange: (e) => r(e.target.value),
				onKeyDown: (e) => {
					e.key === "Escape" && l();
				}
			}),
			/* @__PURE__ */ (0, H.jsx)("button", {
				type: "button",
				className: K.addClose,
				onClick: l,
				title: "Cancel",
				"aria-label": "Cancel",
				children: "×"
			}),
			/* @__PURE__ */ (0, H.jsx)("button", {
				type: "submit",
				className: `${K.addSubmit} ${s ? K.ready : ""}`,
				disabled: !s,
				title: s ? "Continue" : "Enter a URL first",
				"aria-label": "Add feed",
				children: "+"
			})
		]
	}) : /* @__PURE__ */ (0, H.jsx)("button", {
		className: `${K.pill} ${K.addPill}`,
		onClick: () => t(!0),
		title: "Add a feed",
		children: /* @__PURE__ */ (0, H.jsx)("span", {
			className: K.plus,
			children: "+"
		})
	}), i && /* @__PURE__ */ (0, H.jsx)(ql, {
		url: i,
		onDismiss: () => a(null)
	})] });
}
function ql({ url: e, onDismiss: t }) {
	let [n, r] = (0, _.useState)(""), i = Xl(e), a = `node add-feed.js ${Yl(e)}`, o = async (e, t) => {
		try {
			await navigator.clipboard.writeText(e), r(t), setTimeout(() => r((e) => e === t ? "" : e), 1500);
		} catch {}
	};
	return /* @__PURE__ */ (0, H.jsxs)("div", {
		className: K.resultPanel,
		children: [
			/* @__PURE__ */ (0, H.jsx)("button", {
				className: K.resultClose,
				onClick: t,
				title: "Dismiss",
				"aria-label": "Dismiss",
				children: "×"
			}),
			/* @__PURE__ */ (0, H.jsx)("div", {
				className: K.resultTitle,
				children: "Add this feed"
			}),
			/* @__PURE__ */ (0, H.jsx)("div", {
				className: K.resultUrl,
				title: e,
				children: e
			}),
			/* @__PURE__ */ (0, H.jsxs)("div", {
				className: K.resultSection,
				children: [
					/* @__PURE__ */ (0, H.jsx)("div", {
						className: K.resultLabel,
						children: "One-step (recommended)"
					}),
					/* @__PURE__ */ (0, H.jsxs)("div", {
						className: K.resultBox,
						children: [/* @__PURE__ */ (0, H.jsx)("code", {
							className: K.code,
							children: a
						}), /* @__PURE__ */ (0, H.jsx)("button", {
							className: `${K.copyBtn} ${n === "cli" ? K.copied : ""}`,
							onClick: () => o(a, "cli"),
							children: n === "cli" ? "Copied" : "Copy"
						})]
					}),
					/* @__PURE__ */ (0, H.jsx)("div", {
						className: K.resultHint,
						children: "Paste in your terminal — it appends to feeds.opml and rebuilds. Then refresh this page."
					})
				]
			}),
			/* @__PURE__ */ (0, H.jsxs)("div", {
				className: K.resultSection,
				children: [
					/* @__PURE__ */ (0, H.jsx)("div", {
						className: K.resultLabel,
						children: "Or add manually"
					}),
					/* @__PURE__ */ (0, H.jsxs)("div", {
						className: K.resultBox,
						children: [/* @__PURE__ */ (0, H.jsx)("code", {
							className: K.code,
							children: i
						}), /* @__PURE__ */ (0, H.jsx)("button", {
							className: `${K.copyBtn} ${n === "opml" ? K.copied : ""}`,
							onClick: () => o(i, "opml"),
							children: n === "opml" ? "Copied" : "Copy"
						})]
					}),
					/* @__PURE__ */ (0, H.jsxs)("div", {
						className: K.resultHint,
						children: [
							"Paste before ",
							/* @__PURE__ */ (0, H.jsx)("code", {
								className: K.codeInline,
								children: "</body>"
							}),
							" ",
							"in feeds.opml, then run ",
							/* @__PURE__ */ (0, H.jsx)("code", {
								className: K.codeInline,
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
function Jl(e) {
	let t = (e || "").trim();
	if (!t) return !1;
	try {
		let e = new URL(t);
		return e.protocol === "http:" || e.protocol === "https:";
	} catch {
		return !1;
	}
}
function Yl(e) {
	return `'${String(e).replace(/'/g, "'\\''")}'`;
}
function Xl(e) {
	let t = e.replace(/"/g, "&quot;");
	return `<outline text="${Zl(e)}" title="${Zl(e)}" xmlUrl="${t}"/>`;
}
function Zl(e) {
	try {
		return new URL(e).hostname.replace(/^www\./, "");
	} catch {
		return e;
	}
}
var X = {
	gearBtn: "_gearBtn_4wx2n_17",
	backdrop: "_backdrop_4wx2n_51",
	drawer: "_drawer_4wx2n_58",
	ppSlideIn: "_ppSlideIn_4wx2n_1",
	header: "_header_4wx2n_86",
	title: "_title_4wx2n_100",
	subject: "_subject_4wx2n_105",
	closeBtn: "_closeBtn_4wx2n_115",
	section: "_section_4wx2n_129",
	sectionTitle: "_sectionTitle_4wx2n_138",
	rowLabel: "_rowLabel_4wx2n_147",
	choiceRow: "_choiceRow_4wx2n_153",
	choices: "_choices_4wx2n_161",
	rangeRow: "_rangeRow_4wx2n_168",
	rangeEnd: "_rangeEnd_4wx2n_176",
	range: "_range_4wx2n_168",
	choiceBtn: "_choiceBtn_4wx2n_213",
	fontBtn: "_fontBtn_4wx2n_214",
	resetBtn: "_resetBtn_4wx2n_215",
	markActions: "_markActions_4wx2n_216",
	presetBtn: "_presetBtn_4wx2n_217",
	fontRow: "_fontRow_4wx2n_230",
	aidOn: "_aidOn_4wx2n_240",
	hint: "_hint_4wx2n_245",
	hintLink: "_hintLink_4wx2n_251",
	legend: "_legend_4wx2n_255",
	aidList: "_aidList_4wx2n_263",
	aidBtn: "_aidBtn_4wx2n_269",
	aidLabel: "_aidLabel_4wx2n_285",
	aidState: "_aidState_4wx2n_293",
	aidHint: "_aidHint_4wx2n_303",
	subjectBlock: "_subjectBlock_4wx2n_310",
	subjectTitle: "_subjectTitle_4wx2n_319",
	markItem: "_markItem_4wx2n_324",
	markMain: "_markMain_4wx2n_332",
	markTitle: "_markTitle_4wx2n_337",
	markNote: "_markNote_4wx2n_342",
	noteInput: "_noteInput_4wx2n_354",
	noMarks: "_noMarks_4wx2n_379",
	presetRow: "_presetRow_4wx2n_385",
	presetActive: "_presetActive_4wx2n_398",
	presetSwatches: "_presetSwatches_4wx2n_403",
	miniSwatch: "_miniSwatch_4wx2n_408",
	paletteSwatch: "_paletteSwatch_4wx2n_417",
	presetLabel: "_presetLabel_4wx2n_428",
	fieldList: "_fieldList_4wx2n_433",
	fieldRow: "_fieldRow_4wx2n_439",
	fieldLabel: "_fieldLabel_4wx2n_446",
	colorInput: "_colorInput_4wx2n_451",
	hexLabel: "_hexLabel_4wx2n_461",
	forgetBlock: "_forgetBlock_4wx2n_475",
	forgetConfirm: "_forgetConfirm_4wx2n_476"
}, Ql = /* @__PURE__ */ o(((e, t) => {
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
})), $l = /* @__PURE__ */ o(((e, t) => {
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
	}, { reachConfig: m, backdropConfig: h, backdropOpacity: g } = Ns(), _ = (e, t) => e !== "" && e != null && Number.isFinite(Number(e)) ? Number(e) : t, v = (e) => typeof e == "string" ? e : "", y = (e) => Math.max(0, Math.min(1, e)), b = (e) => typeof e == "string" && e.trim() && !/[;{}<>]/.test(e) ? e.trim() : "", x = (e, t, n) => n === 1 ? t : e + (t - e) * n, S = (e) => {
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
			acts: ee(e.containers),
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
			returnAbove: t.returnAbove === "crown" && P(t.crownY) !== null ? "crown" : null,
			topBarInArt: t.topBarInArt === !0,
			band: M(e.topBar && e.topBar.band),
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
			crownY: P(t.crownY),
			zoomPivot: N(t.zoomPivot)
		};
	}
	function ee(e) {
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
	function M(e) {
		let t = e && typeof e == "object" ? b(e.color) : "";
		return t ? { color: t } : null;
	}
	function N(e) {
		if (!e || typeof e != "object") return null;
		let t = _(e.x, NaN), n = _(e.y, NaN);
		return Number.isFinite(t) && Number.isFinite(n) ? {
			x: t,
			y: n
		} : null;
	}
	function P(e) {
		let t = _(e, NaN);
		return Number.isFinite(t) && t >= 0 && t <= 1 ? t : null;
	}
	function F(e, t) {
		return x(1, e && e.graph && Number.isFinite(e.graph.rootsBrightness) ? e.graph.rootsBrightness : 1, y(t));
	}
	var I = 300;
	function L(e, t, n) {
		return e ? t == null ? 0 : Math.max(0, Math.min(1, (n - t) / I)) : 1;
	}
	function te(e, { stored: t, hash: n } = {}) {
		return !e || typeof n == "string" && n.startsWith("#read=") ? "graph" : e.startOn === "art" || e.startOn === "graph" ? e.startOn : a.includes(t) ? t : "art";
	}
	function ne(e, { vw: t, vh: r, art: i, bottom: a = 0, zoom: o = null, controls: s = 0, ink: c = null, perPx: l = null } = {}, u = 0) {
		let d = y(u), f = p, m = Math.max(1, i && i.w || 1), h = Math.max(1, i && i.h || 1), v = e && e.byline && e.byline.text ? f.bylineSpace : 0, b = Math.min(f.pad, r * .03), C = Math.max(b, a), w = e && e.top || null, T = e && e.topBarInArt === !1 ? 0 : Math.max(0, s), E = y(_(c && c.art, 0)), D = c && Number.isFinite(c.graph) ? y(c.graph) : null, O = w && w.art !== null ? T + w.art : null, k = Math.max(1, r - (O === null ? b : O) - C - v), A = O === null ? h : h * Math.max(.05, 1 - E), j = e && e.graph || n.graph, ee = e && e.backdrop || n.backdrop, M = Math.max(.01, Math.min(k / A, (t - 2 * b) / m)), N = (t - m * M) / 2, P = e && Number.isFinite(e.crownY) ? e.crownY : 1;
		if (e && e.fit === "width") {
			let n = c && c.bush || {
				l: 0,
				r: 1
			}, i = (t - 2 * Math.min(_(e.sideMargin, 0), t * .25)) / (Math.max(.01, n.r - n.l) * m), a = O === null ? b : O, o = (r - C - a) / (Math.max(.05, P - E) * h);
			M = Math.max(.01, Math.min(i, o)), N = t / 2 - (n.l + n.r) / 2 * m * M;
		}
		let F = O === null ? b + Math.max(0, (k - h * M) / 2) : O - E * h * M, I = M, L = N;
		if (j.rootsFit === "width") {
			let e = c && c.roots || {
				l: 0,
				r: 1
			}, n = t / (Math.max(.01, e.r - e.l) * m), i = Math.max(0, s) + (w && w.graph !== null ? w.graph : 0), a = c && Number.isFinite(c.bottom) ? y(c.bottom) : 1, o = Math.max(0, _(j.footRoom, 0)), l = (r - C - o - i) / (Math.max(.05, a - (D === null ? 0 : D)) * h);
			I = Math.max(.01, Math.min(n, l)), L = t / 2 - (e.l + e.r) / 2 * m * I;
		}
		let te = w && w.graph !== null && D !== null ? Math.min(F - 1, Math.max(0, s) + w.graph - D * h * I) : -j.artOffset * (h * I), ne = x(M, I, d), ie = m * ne, R = h * ne, ae = x(F, te, d), oe = x(N, L, d), se = S((d - f.graphFrom) / (1 - f.graphFrom));
		return {
			p: d,
			vw: t,
			vh: r,
			art: {
				top: ae,
				left: oe,
				width: ie,
				height: R,
				scale: ne,
				opacity: 1
			},
			roots: x(1, o ? g(ee, o.k, o.homeK) : ee.opacity, d),
			fade: {
				art: 1 - d,
				graph: d
			},
			artTop0: F,
			artTop1: te,
			travel: Math.max(1, F - te),
			graph: {
				opacity: se,
				shift: (1 - se) * f.rise * r
			},
			layer: {
				opacity: x(_(j.artStateOpacity, n.graph.artStateOpacity), 1, d),
				follow: ae - te
			},
			ground: 1 - d,
			byline: re(e, {
				left: oe,
				top: ae,
				width: ie,
				height: R
			}, d, l, {
				x: t / 2,
				y: ae + R + (v - f.bylineSize * 1.3) / 2,
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
	var ie = (e) => 1 - (1 - e) ** 3, R = (e) => e < .5 ? 4 * e * e * e : 1 - (-2 * e + 2) ** 3 / 2;
	function ae(e, { start: t = "art", reducedMotion: r = !1, travel: i = 600, now: o = () => Date.now(), frame: s = (e) => setTimeout(() => e(), 16), cancelFrame: c = (e) => clearTimeout(e), setTimer: l = setTimeout, clearTimer: u = clearTimeout, onChange: d = () => {}, onRest: f = () => {} } = {}) {
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
				ee(e);
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
		function ee(e) {
			k(), !(g === e && h === E(e)) && (g = e, _ = e, h = E(e), d(h, {
				swap: !0,
				ms: p.reducedFadeMs
			}), C = o() + p.quietMs, f(e));
		}
		function M(e = 0) {
			let t = E(_), n = h - t, r = _, i = t === 0 ? 1 : -1;
			n * i > p.onward && (r = D(_)), e * i > p.flickPxPerMs && (r = D(_)), e * i < -p.flickPxPerMs && (r = _), j(r);
		}
		function N(e) {
			v || (_ = h >= 1 ? "graph" : h <= 0 ? "art" : _), k(), O(h + e);
		}
		function P(e, { instant: t = !1 } = {}) {
			return a.includes(e) ? t ? (A(e), !0) : g === e && h === E(e) && !v ? !1 : (j(e, { ease: R }), !0) : !1;
		}
		function F(e, { deltaMode: t = 0, where: n = "stage" } = {}) {
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
					S = 0, e !== g && ee(e);
				}
				return !0;
			}
			return a && (h === 0 && i < 0 || h === 1 && i > 0) ? !0 : (N(i / T), b && u(b), b = l(() => {
				b = null, h > 0 && h < 1 ? M(0) : A(h >= 1 ? "graph" : "art");
			}, p.wheelIdleMs), !0);
		}
		function I(e, t = o()) {
			v && (_ = v.target === "graph" ? "art" : "graph", k()), w = {
				y: e,
				p: h,
				lastY: e,
				lastT: t,
				v: 0,
				total: 0
			}, S = 0;
		}
		function L(e, t = o()) {
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
					e !== g && ee(e);
				}
				return !0;
			}
			let a = e - i > 120 ? 0 : t;
			return h === 0 || h === 1 ? (A(h === 1 ? "graph" : "art"), !0) : (M(a), !0);
		}
		function ne(e) {
			return e === "down" ? P("graph") : e === "up" ? P("art") : !1;
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
			wheel: F,
			touchStart: I,
			touchMove: L,
			touchEnd: te,
			key: ne,
			tapArt: () => P("graph"),
			tapTop: () => P("art"),
			go: P,
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
		REVEAL_MS: I,
		revealFactor: L,
		rootsBrightnessAt: F,
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
		createCover: ae,
		pageKey: oe
	};
})), eu = /* @__PURE__ */ o(((e, t) => {
	var { openingConfig: n } = $l(), r = [
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
})), tu = /* @__PURE__ */ o(((e, t) => {
	var { resizeOn: n } = ks(), r = [
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
})), nu = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		if (!e || !Array.isArray(e.items)) return null;
		let t = e.containers || [], n = (e) => t.some((t) => t.parent && t.tag && (e.tags || []).includes(t.tag)), r = /* @__PURE__ */ new Set(), i = new Set(e.items.map((e) => e.id));
		for (let t of e.items) n(t) || r.add(t._status === "published" ? "published" : "draft");
		for (let t of e.edges || []) t.layer === "tag" ? r.add("tag") : t.layer === "topology" ? r.add("topology") : t.layer === "authored" && !i.has(t.target) && r.add("placeholder");
		return r;
	}
	t.exports = { colorKeysInUse: n };
})), ru = /* @__PURE__ */ o(((e, t) => {
	var { blendColors: n } = Vs(), r = 20;
	function i(e, t) {
		return (t && Array.isArray(t.visibleLayers) ? t.visibleLayers : ["sequence"]).includes("tag") ? (e && Array.isArray(e.edges) ? e.edges : []).some((e) => e && e.layer === "tag") : !1;
	}
	function a(e, { hiddenSources: t, sourceColorOf: r, fallbackColor: i } = {}) {
		let a = e && Array.isArray(e.items) ? e.items : [], o = e && Array.isArray(e.edges) ? e.edges : [], s = e && Array.isArray(e._sources) ? e._sources : [], c = t instanceof Set ? t : new Set(t || []), l = new Map(a.map((e) => [e.id, e])), u = new Map(s.map((e) => [e.id, e])), d = /* @__PURE__ */ new Map();
		for (let e of o) {
			if (!e || e.layer !== "tag") continue;
			let t = (e) => typeof e == "string" && e.startsWith("tag:"), n = t(e.target) ? e.target : t(e.source) ? e.source : null, r = n === e.target ? e.source : e.target;
			!n || !l.has(r) || (d.has(n) || d.set(n, /* @__PURE__ */ new Set()), d.get(n).add(r));
		}
		let f = (e) => e && e._source && e._source.id || null, p = (e) => {
			let t = f(e);
			if (!t) return null;
			let n = typeof r == "function" ? r(t) : null, i = u.get(t) || e._source;
			return n || i && i.color || null;
		}, m = [];
		for (let [e, t] of d) {
			let r = [...t].map((e) => l.get(e)).filter((e) => !c.has(f(e)));
			if (!r.length) continue;
			let a = /* @__PURE__ */ new Map();
			for (let e of r) {
				let t = f(e), n = t || "";
				if (!a.has(n)) {
					let r = t ? u.get(t) || e._source : null;
					a.set(n, {
						sourceId: t,
						title: r && (r.title || r.id) || "",
						count: 0
					});
				}
				a.get(n).count += 1;
			}
			let o = [...a.values()].sort((e, t) => t.count - e.count || e.title.localeCompare(t.title));
			m.push({
				id: e,
				label: e.slice(4),
				count: r.length,
				color: n(r.map((e) => ({
					color: p(e),
					weight: 1
				})), i),
				contributors: o
			});
		}
		return m.sort((e, t) => e.label.localeCompare(t.label, void 0, { sensitivity: "base" }) || e.label.localeCompare(t.label)), m;
	}
	function o(e, t) {
		let n = String(t || "").trim().toLowerCase();
		return n ? e.filter((e) => e.label.toLowerCase().includes(n)) : e;
	}
	function s(e) {
		let t = [];
		e.color && t.push(e.color);
		let n = (e.contributors || []).filter((e) => e.title).map((e) => `${e.title} ${e.count}`);
		return n.length && t.push(n.join(", ")), t.join(" · ");
	}
	t.exports = {
		SEARCH_FROM: r,
		hasTagNodes: i,
		tagListModel: a,
		filterTagRows: o,
		tagRowTitle: s
	};
})), iu = Ql(), au = eu(), ou = tu(), su = nu(), cu = ru(), lu = {
	draft: "#555555",
	published: "#2ecc71",
	tag: "#f39c12",
	topology: "#9b59b6",
	placeholder: "#7f8c8d"
};
function uu() {
	let e = typeof window < "u" && window.SETTINGS && window.SETTINGS.theme || {};
	return {
		...lu,
		...e.node_draft ? { draft: e.node_draft } : {},
		...e.node_published ? { published: e.node_published } : {},
		...e.tag_color ? { tag: e.tag_color } : {}
	};
}
var du = uu(), fu = [
	{
		id: "default",
		label: "Default",
		colors: du
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
], pu = [
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
], mu = [
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
function hu({ on: e, onChange: t, label: n, hint: r, ...i }) {
	return /* @__PURE__ */ (0, H.jsxs)("button", {
		className: `${X.aidBtn} ${e ? X.aidOn : ""}`,
		role: "switch",
		"aria-checked": e,
		onClick: () => t(!e),
		...i,
		children: [/* @__PURE__ */ (0, H.jsxs)("span", {
			className: X.aidLabel,
			children: [n, /* @__PURE__ */ (0, H.jsx)("span", {
				className: X.aidState,
				children: e ? "on" : "off"
			})]
		}), r && /* @__PURE__ */ (0, H.jsx)("span", {
			className: X.aidHint,
			children: r
		})]
	});
}
function gu({ viewState: e, aid: t, label: n, hint: r }) {
	return /* @__PURE__ */ (0, H.jsx)(hu, {
		on: !!(e.readerAid && e.readerAid(t)),
		label: n,
		hint: r,
		"data-aid": t,
		onChange: (n) => e.setReaderAid && e.setReaderAid(t, n)
	});
}
function _u({ label: e, options: t, value: n, onChange: r, name: i }) {
	return /* @__PURE__ */ (0, H.jsxs)("div", {
		className: X.choiceRow,
		role: "radiogroup",
		"aria-label": e,
		"data-choice": i,
		children: [/* @__PURE__ */ (0, H.jsx)("span", {
			className: X.rowLabel,
			children: e
		}), /* @__PURE__ */ (0, H.jsx)("span", {
			className: X.choices,
			children: t.map((e) => /* @__PURE__ */ (0, H.jsx)("button", {
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
function vu({ id: e, title: t, children: n }) {
	return /* @__PURE__ */ (0, H.jsxs)("section", {
		className: X.section,
		"data-section": e,
		"aria-labelledby": `pp-settings-${e}`,
		children: [/* @__PURE__ */ (0, H.jsx)("h2", {
			className: X.sectionTitle,
			id: `pp-settings-${e}`,
			children: t
		}), n]
	});
}
var yu = (e) => window.dispatchEvent(new CustomEvent(e));
function bu(e) {
	return (e && e.graph && typeof e.graph.containersName == "string" ? e.graph.containersName.trim() : "") || "containers";
}
function xu({ className: e, size: t = 15, ...n }) {
	let [r, i] = (0, _.useState)(!1);
	return (0, _.useEffect)(() => {
		let e = (e) => i(!!(e.detail && e.detail.where === "graph" && e.detail.open));
		return window.addEventListener("postpipe:settings-state", e), () => window.removeEventListener("postpipe:settings-state", e);
	}, []), /* @__PURE__ */ (0, H.jsx)("button", {
		type: "button",
		className: e,
		onClick: () => window.dispatchEvent(new CustomEvent("postpipe:toggle-settings", { detail: { where: "graph" } })),
		title: "Things to change",
		"aria-label": "Things to change",
		"aria-expanded": r,
		...n,
		children: /* @__PURE__ */ (0, H.jsx)(Zc, {
			body: (0, el.iconBody)("sliders-horizontal"),
			size: t
		})
	});
}
function Su({ viewState: e, feedData: t, subject: n, readerOpen: r, where: i = "graph", ownButton: a, schemes: o }) {
	let s = (0, au.whereOf)(i), [c, l] = (0, _.useState)(!1), [u, d] = (0, _.useState)(!1), [, f] = (0, _.useState)(0), p = (0, _.useRef)(null), m = (0, _.useRef)(null), h = typeof window < "u" ? window.SETTINGS : null;
	(0, _.useEffect)(() => {
		if (e) return e.subscribe(() => f((e) => e + 1));
	}, [e]);
	let [g, v] = (0, _.useState)(() => typeof window < "u" && window.PostPipeGraphTags ? window.PostPipeGraphTags.counts : null);
	if ((0, _.useEffect)(() => {
		if (s !== "graph") return;
		window.PostPipeGraphTags && v(window.PostPipeGraphTags.counts);
		let e = (e) => v(e && e.detail && Array.isArray(e.detail.counts) ? e.detail.counts : null);
		return window.addEventListener("graph:tag-counts", e), () => window.removeEventListener("graph:tag-counts", e);
	}, [s]), (0, _.useEffect)(() => {
		if (typeof document > "u" || !e || s !== "reader") return;
		let t = e.paragraphIndent ? e.paragraphIndent() : !1, n = e.paragraphSpace ? e.paragraphSpace() : !0, r = document.documentElement;
		r.setAttribute("data-pp-indent", t ? "on" : "off"), r.setAttribute("data-pp-space", n ? "on" : "off"), r.removeAttribute("data-pp-paragraph"), r.setAttribute("data-pp-font", e.readerAid ? e.readerAid("font") : "default"), r.setAttribute("data-pp-size", e.readerAid ? e.readerAid("size") : "m");
	}), (0, _.useEffect)(() => {
		let e = (e) => {
			let t = e && e.detail || {};
			if ((0, au.whereOf)(t.where) !== s) {
				l(!1);
				return;
			}
			m.current = t.section || null, l((e) => t.open ? !0 : !e);
		};
		return window.addEventListener("postpipe:toggle-settings", e), () => window.removeEventListener("postpipe:toggle-settings", e);
	}, [s]), (0, _.useEffect)(() => {
		if (window.dispatchEvent(new CustomEvent("postpipe:settings-state", { detail: {
			where: s,
			open: c
		} })), !c) return;
		let e = (e) => {
			e.key === "Escape" && (e.stopImmediatePropagation(), l(!1));
		};
		if (window.addEventListener("keydown", e, !0), d(!1), m.current && p.current) {
			let e = p.current.querySelector(`[data-section="${m.current}"]`);
			e && (p.current.scrollTop = e.offsetTop - 8), m.current = null;
		}
		return () => window.removeEventListener("keydown", e, !0);
	}, [c]), !e) return null;
	let y = a === void 0 ? s === "graph" && (0, ou.toolbarConfig)(h).position !== "top" : a, b = (0, Gc.readerFonts)(h), x = e.readerAid ? e.readerAid("font") : "default", S = e.readerAid ? e.readerAid("size") : "m", C = {
		...du,
		...e.graphColors()
	}, w = e.colorProfileId(), T = (0, su.colorKeysInUse)((0, q.graphFeed)(t, (0, q.topBarConfig)(h))), E = T ? pu.filter((e) => T.has(e.key)) : pu, D = !!(t && Array.isArray(t.containers) && t.containers.length), O = typeof window < "u" && !!window.TTS, k = t && t.items || [], A = k.length === 0 || k.some((e) => !(0, fc.isLinkItem)(e)), j = (0, iu.themeName)(h, e.preference("theme")), ee = iu.THEMES[j].modes, M = e.preference("mode"), N = (0, au.panelGroups)(s, {
		settings: h,
		readable: A,
		voice: O,
		modes: ee.length
	}), P = (0, ou.toolbarConfig)(h), F = bu(h), I = (0, Js.nodePalettesOf)(h && h.graph), L = (I.find((t) => t.id === e.preference("nodePalette")) || I[0] || {}).id, te = Array.isArray(o) ? o : (0, hc.schemesOf)(t), ne = (te.find((e) => e.kind === "site") || { id: hc.SITE_SCHEME }).id, re = e.preference("conceptScheme"), ie = typeof re == "string" && te.some((e) => e.id === re) ? re : ne, R = Number(e.preference("broaderDepth")), ae = Number.isFinite(R) ? Math.max(0, Math.min(2, Math.round(R))) : 0, oe = (0, vc.minPiecesSummary)(s === "graph" ? g || ((0, cu.hasTagNodes)(t, h && h.graph) ? [...(0, vc.pieceCountsFromFeed)((0, q.graphFeed)(t, (0, q.topBarConfig)(h))).values()] : []) : [], e.preference(vc.PREF)), se = ee.length > 1 && /* @__PURE__ */ (0, H.jsx)(_u, {
		label: s === "reader" ? "Light or dark" : "Mode",
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
		value: M && ee.includes(M) ? M : "auto",
		onChange: (t) => e.setPreference("mode", t === "auto" ? null : t)
	}), ce = {
		look: () => /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [
			/* @__PURE__ */ (0, H.jsx)(_u, {
				label: "Theme",
				name: "theme",
				options: Object.values(iu.THEMES).map((e) => ({
					id: e.id,
					label: e.label
				})),
				value: j,
				onChange: (t) => e.setPreference("theme", t === (0, iu.themeName)(h, null) ? null : t)
			}),
			!(0, au.modeInReader)(h) && se,
			(0, uc.config)(h) && /* @__PURE__ */ (0, H.jsx)(hu, {
				on: e.preference("timeOfDay") !== !1,
				onChange: (t) => e.setPreference("timeOfDay", t ? null : !1),
				label: "narrative time of day background",
				"data-pref": "timeOfDay"
			}),
			I.length >= 2 && /* @__PURE__ */ (0, H.jsxs)("div", {
				className: X.choiceRow,
				role: "radiogroup",
				"aria-label": "node colour",
				"data-choice": "nodePalette",
				children: [/* @__PURE__ */ (0, H.jsx)("span", {
					className: X.rowLabel,
					children: "node colour"
				}), /* @__PURE__ */ (0, H.jsx)("span", {
					className: X.choices,
					children: I.map((t, n) => /* @__PURE__ */ (0, H.jsxs)("button", {
						role: "radio",
						"aria-checked": L === t.id,
						title: t.label,
						"data-value": t.id,
						className: `${X.choiceBtn} ${L === t.id ? X.aidOn : ""}`,
						onClick: () => e.setPreference("nodePalette", n === 0 ? null : t.id),
						children: [/* @__PURE__ */ (0, H.jsx)("span", {
							className: X.paletteSwatch,
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
			E.length > 0 && /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [
				/* @__PURE__ */ (0, H.jsx)("div", {
					className: X.rowLabel,
					children: "Colors"
				}),
				/* @__PURE__ */ (0, H.jsx)("div", {
					className: X.presetRow,
					children: fu.map((t) => /* @__PURE__ */ (0, H.jsxs)("button", {
						className: `${X.presetBtn} ${w === t.id ? X.presetActive : ""}`,
						onClick: () => e.applyColorProfile(t.id, t.colors),
						title: t.label,
						children: [/* @__PURE__ */ (0, H.jsx)("span", {
							className: X.presetSwatches,
							children: E.map((e) => /* @__PURE__ */ (0, H.jsx)("span", {
								className: X.miniSwatch,
								style: { background: t.colors[e.key] }
							}, e.key))
						}), /* @__PURE__ */ (0, H.jsx)("span", {
							className: X.presetLabel,
							children: t.label
						})]
					}, t.id))
				}),
				/* @__PURE__ */ (0, H.jsx)("div", {
					className: X.fieldList,
					children: E.map((t) => /* @__PURE__ */ (0, H.jsxs)("label", {
						className: X.fieldRow,
						children: [
							/* @__PURE__ */ (0, H.jsx)("span", {
								className: X.fieldLabel,
								children: t.label
							}),
							/* @__PURE__ */ (0, H.jsx)("input", {
								type: "color",
								className: X.colorInput,
								value: C[t.key],
								onChange: (n) => e.setGraphColor(t.key, n.target.value)
							}),
							/* @__PURE__ */ (0, H.jsx)("span", {
								className: X.hexLabel,
								children: C[t.key]
							})
						]
					}, t.key))
				})
			] })
		] }),
		view: () => /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [
			/* @__PURE__ */ (0, H.jsxs)("span", {
				className: X.choices,
				"data-view-actions": !0,
				children: [
					/* @__PURE__ */ (0, H.jsx)("button", {
						className: X.choiceBtn,
						"data-view-action": "graph:zoom-to-fit",
						title: "Every node on the screen, zoomed about its middle",
						onClick: () => yu("graph:zoom-to-fit"),
						children: "Zoom to fit"
					}),
					D && /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [/* @__PURE__ */ (0, H.jsxs)("button", {
						className: X.choiceBtn,
						"data-view-action": "graph:close-all-containers",
						onClick: () => yu("graph:close-all-containers"),
						children: ["Close all ", F]
					}), /* @__PURE__ */ (0, H.jsxs)("button", {
						className: X.choiceBtn,
						"data-view-action": "graph:open-all-containers",
						onClick: () => yu("graph:open-all-containers"),
						children: ["Open all ", F]
					})] }),
					(0, ou.viewActionsFor)(h).filter((e) => e.event !== "graph:zoom-to-fit").map((e) => /* @__PURE__ */ (0, H.jsx)("button", {
						className: X.choiceBtn,
						"data-view-action": e.event,
						title: e.title,
						onClick: () => yu(e.event),
						children: e.label
					}, e.event))
				]
			}),
			P.show.layout && /* @__PURE__ */ (0, H.jsx)(_u, {
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
			P.show.layout && /* @__PURE__ */ (0, H.jsxs)("label", {
				className: X.choiceRow,
				"data-pref": "tightness",
				title: "How close the cards sit in cluster. At the tight end they may overlap a little.",
				children: [/* @__PURE__ */ (0, H.jsx)("span", {
					className: X.rowLabel,
					children: "Tightness"
				}), /* @__PURE__ */ (0, H.jsxs)("span", {
					className: X.rangeRow,
					children: [
						/* @__PURE__ */ (0, H.jsx)("span", {
							className: X.rangeEnd,
							"aria-hidden": "true",
							children: "loose"
						}),
						/* @__PURE__ */ (0, H.jsx)("input", {
							type: "range",
							className: X.range,
							min: "0",
							max: "1",
							step: "0.05",
							"aria-label": "Tightness, from loose to tight",
							value: (0, Ys.clampTightness)(e.preference("tightness")),
							onChange: (t) => {
								let n = (0, Ys.clampTightness)(t.target.value);
								e.setPreference("tightness", n === .5 ? null : n);
							}
						}),
						/* @__PURE__ */ (0, H.jsx)("span", {
							className: X.rangeEnd,
							"aria-hidden": "true",
							children: "tight"
						})
					]
				})]
			}),
			oe.max > 1 && /* @__PURE__ */ (0, H.jsxs)("label", {
				className: X.choiceRow,
				"data-pref": vc.PREF,
				title: "Tags joining fewer pieces than this are hidden.",
				children: [
					/* @__PURE__ */ (0, H.jsx)("span", {
						className: X.rowLabel,
						children: "Pieces per tag"
					}),
					/* @__PURE__ */ (0, H.jsxs)("span", {
						className: X.rangeRow,
						children: [
							/* @__PURE__ */ (0, H.jsx)("span", {
								className: X.rangeEnd,
								"aria-hidden": "true",
								children: "1"
							}),
							/* @__PURE__ */ (0, H.jsx)("input", {
								type: "range",
								className: X.range,
								min: "1",
								max: oe.max,
								step: "1",
								"aria-label": `Pieces per tag, from 1 to ${oe.max}`,
								"aria-valuetext": `at least ${oe.min}: ${oe.shown} of ${oe.total} tags`,
								value: oe.min,
								onChange: (t) => {
									let n = Math.round(Number(t.target.value));
									e.setPreference(vc.PREF, Number.isFinite(n) && n > 1 ? n : null);
								}
							}),
							/* @__PURE__ */ (0, H.jsx)("span", {
								className: X.rangeEnd,
								"aria-hidden": "true",
								children: oe.max
							})
						]
					}),
					/* @__PURE__ */ (0, H.jsxs)("output", {
						className: X.rangeEnd,
						"data-tag-count": !0,
						"aria-live": "polite",
						children: [
							"at least ",
							oe.min,
							" · ",
							oe.shown,
							" of ",
							oe.total,
							" tags"
						]
					})
				]
			}),
			te.length > 1 && /* @__PURE__ */ (0, H.jsx)(_u, {
				label: "Scheme",
				name: "conceptScheme",
				options: te.map((e) => ({
					id: e.id,
					label: e.label || e.id,
					title: e.kind === "external" && e.license ? `${e.label || e.id} (${e.license})` : e.label || e.id
				})),
				value: ie,
				onChange: (t) => e.setPreference("conceptScheme", t === ne ? null : t)
			}),
			te.length > 1 && /* @__PURE__ */ (0, H.jsx)(_u, {
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
				value: String(ae),
				onChange: (t) => e.setPreference("broaderDepth", t === "0" ? null : Number(t))
			})
		] }),
		memory: () => /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [/* @__PURE__ */ (0, H.jsx)("button", {
			className: X.resetBtn,
			"data-settings-reset": !0,
			title: "Layout, zoom, rotation, open and closed containers, selection and colors, back to how the site starts",
			onClick: () => {
				l(!1), E.length && e.applyColorProfile("default", du), yu("graph:reset-all");
			},
			children: "Reset the view"
		}), /* @__PURE__ */ (0, H.jsxs)("div", {
			className: X.forgetBlock,
			"data-forget": !0,
			children: [/* @__PURE__ */ (0, H.jsx)("div", {
				className: X.hint,
				"data-forget-note": !0,
				children: "What you open, arrange, choose, mark and read here is kept on this device only. Reset the view keeps your bookmarks and progress; Forget removes all of it."
			}), u ? /* @__PURE__ */ (0, H.jsxs)("div", {
				className: X.forgetConfirm,
				role: "group",
				"aria-label": "Confirm forgetting",
				"data-forget-confirm": !0,
				children: [/* @__PURE__ */ (0, H.jsx)("div", {
					className: X.hint,
					children: "Remove your bookmarks and notes, reading progress, open cards, positions, and every choice made here, from this device? This can't be undone."
				}), /* @__PURE__ */ (0, H.jsxs)("span", {
					className: X.choices,
					children: [/* @__PURE__ */ (0, H.jsx)("button", {
						className: X.resetBtn,
						"data-forget-yes": !0,
						onClick: async () => {
							d(!1), l(!1), e.forget && await e.forget(), window.dispatchEvent(new CustomEvent("postpipe:forgotten"));
						},
						children: "Forget"
					}), /* @__PURE__ */ (0, H.jsx)("button", {
						className: X.choiceBtn,
						"data-forget-no": !0,
						onClick: () => d(!1),
						children: "Keep it"
					})]
				})]
			}) : /* @__PURE__ */ (0, H.jsx)("button", {
				className: X.resetBtn,
				"data-forget-ask": !0,
				onClick: () => d(!0),
				children: "Forget my usage on this site"
			})]
		})] }),
		reading: () => /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [
			/* @__PURE__ */ (0, H.jsx)("div", {
				className: X.fontRow,
				role: "radiogroup",
				"aria-label": "Font",
				children: b.map((t) => /* @__PURE__ */ (0, H.jsx)("button", {
					role: "radio",
					"aria-checked": x === t.id,
					"data-font": t.id,
					className: `${X.fontBtn} ${x === t.id ? X.aidOn : ""}`,
					style: { fontFamily: t.family },
					onClick: () => e.setReaderAid && e.setReaderAid("font", t.id),
					children: t.label
				}, t.id))
			}),
			b.filter((e) => e.license).map((e) => /* @__PURE__ */ (0, H.jsxs)("div", {
				className: X.hint,
				children: [
					e.label,
					" is under the ",
					/* @__PURE__ */ (0, H.jsx)("a", {
						className: X.hintLink,
						href: `./fonts/${e.license}`,
						target: "_blank",
						rel: "noopener",
						children: e.licenseName
					}),
					"."
				]
			}, e.id)),
			/* @__PURE__ */ (0, H.jsx)(_u, {
				label: "Size",
				name: "size",
				options: mu,
				value: S,
				onChange: (t) => e.setReaderAid("size", t)
			}),
			/* @__PURE__ */ (0, H.jsxs)("div", {
				className: X.choiceRow,
				children: [/* @__PURE__ */ (0, H.jsx)("span", {
					className: X.rowLabel,
					children: "Paragraphs"
				}), /* @__PURE__ */ (0, H.jsxs)("span", {
					className: X.choices,
					children: [/* @__PURE__ */ (0, H.jsx)("button", {
						className: `${X.choiceBtn} ${e.paragraphIndent() ? X.aidOn : ""}`,
						"aria-pressed": e.paragraphIndent(),
						onClick: () => e.setParagraphIndent(!e.paragraphIndent()),
						children: "Indent first line"
					}), /* @__PURE__ */ (0, H.jsx)("button", {
						className: `${X.choiceBtn} ${e.paragraphSpace() ? X.aidOn : ""}`,
						"aria-pressed": e.paragraphSpace(),
						onClick: () => e.setParagraphSpace(!e.paragraphSpace()),
						children: "Space between"
					})]
				})]
			}),
			/* @__PURE__ */ (0, H.jsxs)("div", {
				className: X.aidList,
				children: [/* @__PURE__ */ (0, H.jsx)(gu, {
					viewState: e,
					aid: "followAlong",
					label: "Highlighter: follow along",
					hint: "Tap or drag through the text to mark the sentence and word you are on."
				}), /* @__PURE__ */ (0, H.jsx)(gu, {
					viewState: e,
					aid: "boldStart",
					label: "Bold word beginnings",
					hint: "The first part of each word is bold, to lead the eye. The text itself is unchanged."
				})]
			})
		] }),
		paper: () => se,
		listening: () => /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [/* @__PURE__ */ (0, H.jsx)(Rl, {}), /* @__PURE__ */ (0, H.jsx)("div", {
			className: X.hint,
			children: "Play and pause are in the reader."
		})] })
	};
	return /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [y && /* @__PURE__ */ (0, H.jsx)(xu, {
		className: X.gearBtn,
		size: 18,
		"aria-expanded": c,
		"data-settings-gear": !0
	}), c && /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [/* @__PURE__ */ (0, H.jsx)("div", {
		className: X.backdrop,
		onClick: () => l(!1)
	}), /* @__PURE__ */ (0, H.jsxs)("aside", {
		className: X.drawer,
		role: "dialog",
		"aria-label": (0, au.panelTitle)(h, s),
		ref: p,
		"data-settings-panel": s,
		children: [/* @__PURE__ */ (0, H.jsxs)("div", {
			className: X.header,
			children: [
				/* @__PURE__ */ (0, H.jsx)("span", {
					className: X.title,
					children: (0, au.panelTitle)(h, s)
				}),
				s === "reader" && n && /* @__PURE__ */ (0, H.jsx)("span", {
					className: X.subject,
					"data-settings-subject": !0,
					children: n.title
				}),
				/* @__PURE__ */ (0, H.jsx)("button", {
					className: X.closeBtn,
					onClick: () => l(!1),
					"aria-label": "Close",
					children: /* @__PURE__ */ (0, H.jsx)(Zc, {
						body: (0, el.iconBody)("x"),
						size: 18
					})
				})
			]
		}), N.map((e) => /* @__PURE__ */ (0, H.jsx)(vu, {
			id: e.id,
			title: e.title,
			children: ce[e.id]()
		}, e.id))]
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
}, Cu = {
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
}, wu = [
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
], Tu = [
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
], Eu = [
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
function Du({ config: e, onUpdate: t, onReset: n, visible: r = !0 }) {
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
		...Cu,
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
		let t = Au(e);
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
	return r ? /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [
		/* @__PURE__ */ (0, H.jsx)("button", {
			className: `${Z.triggerBtn} ${i ? Z.open : ""}`,
			onClick: () => a((e) => !e),
			title: "Configure viewer",
			"aria-label": "Configure viewer",
			children: "⚡"
		}),
		i && /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [/* @__PURE__ */ (0, H.jsx)("div", {
			className: Z.backdrop,
			onClick: () => a(!1)
		}), /* @__PURE__ */ (0, H.jsxs)("div", {
			className: Z.panel,
			role: "dialog",
			"aria-label": "Viewer Configuration",
			ref: f,
			onTouchStart: p,
			onTouchMove: m,
			onTouchEnd: h,
			children: [
				/* @__PURE__ */ (0, H.jsxs)("div", {
					className: Z.header,
					children: [/* @__PURE__ */ (0, H.jsx)("span", {
						className: Z.panelTitle,
						children: "Viewer Configuration"
					}), /* @__PURE__ */ (0, H.jsx)("button", {
						className: Z.closeBtn,
						onClick: () => a(!1),
						"aria-label": "Close",
						children: "×"
					})]
				}),
				/* @__PURE__ */ (0, H.jsxs)("div", {
					className: Z.section,
					children: [/* @__PURE__ */ (0, H.jsx)("div", {
						className: Z.sectionTitle,
						children: "Features"
					}), wu.map((e) => /* @__PURE__ */ (0, H.jsx)(Ou, {
						label: e.label,
						sub: e.sub,
						checked: g[e.key],
						onChange: (t) => y(e.key, t)
					}, e.key))]
				}),
				/* @__PURE__ */ (0, H.jsxs)("div", {
					className: Z.section,
					children: [
						/* @__PURE__ */ (0, H.jsx)("div", {
							className: Z.sectionTitle,
							children: "Data"
						}),
						/* @__PURE__ */ (0, H.jsx)("div", {
							className: Z.textInputRow,
							children: /* @__PURE__ */ (0, H.jsx)("input", {
								type: "url",
								className: Z.textInput,
								placeholder: "Feed URL (default: ./feed.json)",
								value: e.feed || "",
								onChange: (e) => S(e.target.value)
							})
						}),
						/* @__PURE__ */ (0, H.jsxs)("div", {
							className: Z.selectRow,
							children: [/* @__PURE__ */ (0, H.jsx)("span", {
								className: Z.toggleLabel,
								children: "Persistence"
							}), /* @__PURE__ */ (0, H.jsx)("select", {
								className: Z.select,
								value: e.persistence || "localStorage",
								onChange: (e) => x(e.target.value),
								children: Eu.map((e) => /* @__PURE__ */ (0, H.jsx)("option", {
									value: e.value,
									children: e.label
								}, e.value))
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, H.jsxs)("div", {
					className: Z.section,
					children: [/* @__PURE__ */ (0, H.jsx)("div", {
						className: Z.sectionTitle,
						children: "Theme"
					}), Tu.map((e) => /* @__PURE__ */ (0, H.jsxs)("div", {
						className: Z.colorRow,
						children: [
							/* @__PURE__ */ (0, H.jsx)("span", {
								className: Z.colorLabel,
								children: e.label
							}),
							/* @__PURE__ */ (0, H.jsx)("input", {
								type: "color",
								className: Z.colorInput,
								value: v[e.key] || ku(e.key),
								onChange: (t) => b(e.key, t.target.value)
							}),
							/* @__PURE__ */ (0, H.jsx)("span", {
								className: Z.colorHex,
								children: v[e.key] || ku(e.key)
							})
						]
					}, e.key))]
				}),
				/* @__PURE__ */ (0, H.jsxs)("div", {
					className: Z.section,
					children: [
						/* @__PURE__ */ (0, H.jsx)("div", {
							className: Z.sectionTitle,
							children: "Actions"
						}),
						/* @__PURE__ */ (0, H.jsxs)("div", {
							className: Z.actions,
							children: [
								/* @__PURE__ */ (0, H.jsx)("button", {
									className: Z.actionBtnAccent,
									onClick: C,
									children: "Export Config"
								}),
								/* @__PURE__ */ (0, H.jsx)("button", {
									className: Z.actionBtn,
									onClick: w,
									children: "Import Config"
								}),
								/* @__PURE__ */ (0, H.jsx)("button", {
									className: Z.actionBtnDanger,
									onClick: n,
									children: "Reset All"
								})
							]
						}),
						/* @__PURE__ */ (0, H.jsx)("input", {
							ref: u,
							type: "file",
							accept: ".json",
							style: { display: "none" },
							onChange: T
						}),
						c && /* @__PURE__ */ (0, H.jsx)("div", {
							className: Z.snippet,
							children: /* @__PURE__ */ (0, H.jsx)("code", {
								className: Z.snippetCode,
								children: Au(e)
							})
						}),
						!c && /* @__PURE__ */ (0, H.jsx)("button", {
							className: Z.actionBtn,
							onClick: () => l(!0),
							style: {
								marginTop: "6px",
								width: "100%"
							},
							children: "Show Embed Snippet"
						}),
						c && /* @__PURE__ */ (0, H.jsx)("button", {
							className: Z.actionBtn,
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
		o && /* @__PURE__ */ (0, H.jsx)("div", {
			className: Z.toast,
			children: o
		})
	] }) : null;
}
function Ou({ label: e, sub: t, checked: n, onChange: r }) {
	return /* @__PURE__ */ (0, H.jsxs)("div", {
		className: Z.toggleRow,
		children: [/* @__PURE__ */ (0, H.jsxs)("span", {
			className: Z.toggleLabel,
			children: [e, t && /* @__PURE__ */ (0, H.jsx)("span", {
				className: Z.toggleSub,
				children: t
			})]
		}), /* @__PURE__ */ (0, H.jsxs)("label", {
			className: Z.switch,
			children: [/* @__PURE__ */ (0, H.jsx)("input", {
				type: "checkbox",
				className: Z.switchInput,
				checked: n,
				onChange: (e) => r(e.target.checked)
			}), /* @__PURE__ */ (0, H.jsx)("span", { className: Z.switchTrack })]
		})]
	});
}
function ku(e) {
	return {
		bg: "#1a1a2e",
		surface: "#0a0e1a",
		accent: "#64ffda",
		text: "#a8b2d1",
		text_bright: "#ccd6f6"
	}[e] || "#888888";
}
function Au(e) {
	let t = {};
	if (e.feed && e.feed !== "./feed.json" && (t.feed = e.feed), e.persistence && e.persistence !== "localStorage" && (t.persistence = e.persistence), e.features) {
		let n = {};
		for (let [t, r] of Object.entries(e.features)) r !== Cu[t] && (n[t] = r);
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
var ju = {
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
}, Mu = [
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
function Nu(e) {
	return (e.url || e.id || "").split("/").pop().replace(".html", "");
}
function Pu({ feedData: e, onFilterChange: t }) {
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
			let o = Nu(e);
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
				monthName: Mu[n],
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
	return /* @__PURE__ */ (0, H.jsxs)("div", {
		className: ju.timeOverlay,
		children: [/* @__PURE__ */ (0, H.jsxs)("div", {
			className: ju.header,
			children: [/* @__PURE__ */ (0, H.jsxs)("div", {
				className: ju.titleGroup,
				children: [/* @__PURE__ */ (0, H.jsx)("span", {
					className: ju.title,
					children: "Chronology"
				}), /* @__PURE__ */ (0, H.jsx)("span", {
					className: ju.rangeBadge,
					children: i.minYear === i.maxYear ? i.minYear : `${i.minYear}–${i.maxYear}`
				})]
			}), n && /* @__PURE__ */ (0, H.jsx)("button", {
				className: ju.clearBtn,
				onClick: () => {
					r(null), t && t(null, null);
				},
				title: "Show all posts",
				children: "Reset"
			})]
		}), /* @__PURE__ */ (0, H.jsx)("div", {
			className: ju.stackScroll,
			children: i.months.map((e, t) => {
				let r = n === e.key, s = e.articleSlugs.length === 0, c = i.months[t - 1], l = !c || c.year !== e.year;
				return /* @__PURE__ */ (0, H.jsxs)("div", {
					className: `${ju.monthBox} ${s ? ju.emptyMonth : ""} ${r ? ju.activeMonth : ""}`,
					children: [/* @__PURE__ */ (0, H.jsxs)("div", {
						className: ju.monthHeader,
						onClick: () => a(e),
						title: s ? "No articles published this month" : `Filter to ${e.monthName} ${e.year} (${e.articleSlugs.length})`,
						children: [/* @__PURE__ */ (0, H.jsxs)("div", {
							className: ju.monthName,
							children: [e.monthName, l && /* @__PURE__ */ (0, H.jsx)("span", {
								className: ju.yearTag,
								children: e.year
							})]
						}), /* @__PURE__ */ (0, H.jsx)("div", {
							className: `${ju.monthMeta} ${e.articleSlugs.length > 0 ? ju.hasItems : ""}`,
							children: e.articleSlugs.length > 0 ? `${e.articleSlugs.length} post${e.articleSlugs.length > 1 ? "s" : ""}` : "0 posts"
						})]
					}), /* @__PURE__ */ (0, H.jsxs)("div", {
						className: ju.branchArea,
						children: [/* @__PURE__ */ (0, H.jsx)("div", { className: ju.branchLine }), /* @__PURE__ */ (0, H.jsx)("div", {
							className: ju.weeksRow,
							children: e.weeks.map((t) => {
								let r = t.articleSlugs.length, i = n === t.id;
								return /* @__PURE__ */ (0, H.jsxs)("div", {
									className: `${ju.weekPill} ${r > 0 ? ju.hasContent : ""} ${i ? ju.activeWeek : ""}`,
									onClick: (n) => o(n, t, e),
									title: r > 0 ? `${t.label}: ${r} post${r > 1 ? "s" : ""}` : `${t.label}: empty`,
									children: [/* @__PURE__ */ (0, H.jsx)("span", { children: t.label }), r > 0 && /* @__PURE__ */ (0, H.jsx)("span", {
										className: ju.weekBadge,
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
var Q = {
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
}, Fu = (/* @__PURE__ */ o(((e, t) => {
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
})))(), Iu = [{
	id: "force",
	label: "cluster",
	title: "Cluster: each container its own path"
}, {
	id: "radial",
	label: "ring",
	title: "Ring: each container its own ring"
}], Lu = (e, t) => window.dispatchEvent(new CustomEvent(e, t === void 0 ? void 0 : { detail: t }));
function Ru({ viewState: e, show: t = {}, layouts: n = Iu, settings: r, layers: i = [], placement: a = "bottom", feedData: o = null, hiddenSources: s = null }) {
	return a === "top" ? /* @__PURE__ */ (0, H.jsx)(Bu, {
		viewState: e,
		show: t,
		layouts: n,
		settings: r,
		layers: i,
		feedData: o,
		hiddenSources: s
	}) : /* @__PURE__ */ (0, H.jsx)(zu, {
		viewState: e,
		show: t,
		layouts: n,
		settings: r,
		layers: i
	});
}
function zu({ viewState: e, show: t, layouts: n, settings: r, layers: i }) {
	let a = r || (typeof window < "u" ? window.SETTINGS : null), o = (0, Fu.dimensionLabels)(a), s = (0, Fu.dimensionGroupLabel)(a), c = s.charAt(0).toUpperCase() + s.slice(1), l = (0, Fu.layerLabels)(a).filter((e) => i.includes(e.id)), [, u] = (0, _.useReducer)((e) => e + 1, 0), [d, f] = (0, _.useState)(!1);
	if ((0, _.useEffect)(() => e ? e.subscribe(u) : void 0, [e]), (0, _.useEffect)(() => {
		if (!d) return;
		let e = (e) => {
			e.key === "Escape" && f(!1);
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [d]), !e) return null;
	let p = t.history !== !1, m = t.layout !== !1, h = t.dimensions !== !1, g = e.state.layout, v = e.timeAxis(), y = v.dimension || "time", b = (t) => e.setTimeAxis((0, ou.toggleDimension)(v, t)), x = () => e.setTimeAxis({ granularity: (0, ou.nextGranularity)(v.granularity) }), S = (0, ou.hasGranularity)(v), C = /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [
		o.map((e) => {
			let t = v.on && y === e.id;
			return /* @__PURE__ */ (0, H.jsx)("button", {
				className: `${Q.seg} ${t ? Q.on : ""}`,
				"aria-pressed": t,
				title: e.title,
				onClick: () => b(e.id),
				children: e.label
			}, e.id);
		}),
		l.map((t) => {
			let n = e.preference(t.id) === !0;
			return /* @__PURE__ */ (0, H.jsx)("button", {
				className: `${Q.seg} ${Q.layer} ${n ? Q.on : ""}`,
				"aria-pressed": n,
				title: t.title,
				"data-dimension": t.id,
				onClick: () => e.setPreference(t.id, n ? null : !0),
				children: t.label
			}, t.id);
		}),
		S && /* @__PURE__ */ (0, H.jsxs)("button", {
			className: Q.seg,
			title: "Bucket size: auto, day, week, month, year",
			onClick: x,
			children: ["· ", v.granularity || "auto"]
		})
	] });
	return /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [/* @__PURE__ */ (0, H.jsxs)("div", {
		className: Q.bar,
		role: "toolbar",
		"aria-label": "Graph controls",
		"data-toolbar": !0,
		children: [
			p && /* @__PURE__ */ (0, H.jsxs)("div", {
				className: Q.group,
				"data-group": "history",
				children: [/* @__PURE__ */ (0, H.jsx)("button", {
					className: Q.icon,
					title: "Undo (Cmd+Z)",
					"aria-label": "Undo",
					disabled: !e.canUndo,
					onClick: () => e.undo(),
					children: "↩"
				}), /* @__PURE__ */ (0, H.jsx)("button", {
					className: Q.icon,
					title: "Redo (Cmd+Shift+Z)",
					"aria-label": "Redo",
					disabled: !e.canRedo,
					onClick: () => e.redo(),
					children: "↪"
				})]
			}),
			m && /* @__PURE__ */ (0, H.jsxs)("div", {
				className: Q.group,
				"data-group": "layout",
				role: "radiogroup",
				"aria-label": "Layout",
				children: [/* @__PURE__ */ (0, H.jsx)("span", {
					className: Q.label,
					children: "layout"
				}), n.map((t) => {
					let n = g === t.id;
					return /* @__PURE__ */ (0, H.jsx)("button", {
						className: `${Q.seg} ${n ? Q.on : ""}`,
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
			h && /* @__PURE__ */ (0, H.jsxs)("div", {
				className: `${Q.group} ${Q.wideOnly}`,
				"data-group": "dimensions",
				"aria-label": c,
				children: [/* @__PURE__ */ (0, H.jsx)("span", {
					className: Q.label,
					"data-group-label": !0,
					children: s
				}), C]
			}),
			/* @__PURE__ */ (0, H.jsx)("div", { className: Q.spacer }),
			/* @__PURE__ */ (0, H.jsxs)("div", {
				className: Q.group,
				"data-group": "view",
				children: [/* @__PURE__ */ (0, H.jsx)("button", {
					className: Q.seg,
					title: ou.RESET_TITLE,
					"data-toolbar-reset": !0,
					onClick: () => {
						f(!1), Lu("graph:reset-all");
					},
					children: "Reset"
				}), /* @__PURE__ */ (0, H.jsxs)("button", {
					className: `${Q.seg} ${Q.more} ${d ? Q.on : ""}`,
					"aria-expanded": d,
					"aria-controls": "pp-toolbar-more",
					title: `More: ${s} and view actions`,
					"aria-label": "More",
					"data-toolbar-more": !0,
					onClick: () => f((e) => !e),
					children: [/* @__PURE__ */ (0, H.jsx)("span", {
						className: Q.moreText,
						children: "More "
					}), /* @__PURE__ */ (0, H.jsx)("span", {
						"aria-hidden": "true",
						className: Q.moreMark,
						children: d ? "▾" : "▴"
					})]
				})]
			})
		]
	}), d && /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [/* @__PURE__ */ (0, H.jsx)("div", {
		className: Q.backdrop,
		onClick: () => f(!1)
	}), /* @__PURE__ */ (0, H.jsxs)("div", {
		className: Q.sheet,
		id: "pp-toolbar-more",
		role: "dialog",
		"aria-label": "More graph controls",
		"data-toolbar-sheet": !0,
		children: [h && /* @__PURE__ */ (0, H.jsxs)("div", {
			className: `${Q.section} ${Q.narrowOnly}`,
			children: [/* @__PURE__ */ (0, H.jsx)("div", {
				className: Q.sectionTitle,
				"data-group-label": !0,
				children: c
			}), /* @__PURE__ */ (0, H.jsx)("div", {
				className: Q.wrapRow,
				children: C
			})]
		}), /* @__PURE__ */ (0, H.jsxs)("div", {
			className: Q.section,
			children: [/* @__PURE__ */ (0, H.jsx)("div", {
				className: Q.sectionTitle,
				children: "View"
			}), /* @__PURE__ */ (0, H.jsx)("div", {
				className: Q.wrapRow,
				children: (0, ou.viewActionsFor)(a).map((e) => /* @__PURE__ */ (0, H.jsx)("button", {
					className: Q.action,
					title: e.title,
					onClick: () => {
						Lu(e.event), f(!1);
					},
					children: e.label
				}, e.event))
			})]
		})]
	})] })] });
}
function Bu({ viewState: e, show: t, layouts: n, settings: r, layers: i, feedData: a, hiddenSources: o }) {
	let s = r || (typeof window < "u" ? window.SETTINGS : null), [, c] = (0, _.useReducer)((e) => e + 1, 0), [l, u] = (0, _.useState)(null), [d, f] = (0, _.useState)(""), [p, m] = (0, _.useState)(null), h = (0, _.useRef)(null), g = (0, _.useRef)(null), v = (0, _.useRef)(null), y = (0, _.useRef)(null);
	(0, _.useEffect)(() => e ? e.subscribe(c) : void 0, [e]), (0, _.useEffect)(() => {
		let e = (e) => m(e.detail && e.detail.id ? e.detail.id : null);
		return window.addEventListener("graph:tag-changed", e), () => window.removeEventListener("graph:tag-changed", e);
	}, []);
	let b = () => y.current ? [...y.current.querySelectorAll("[data-menu-item]")] : [], x = (e) => {
		let t = l === "tags" ? v.current : g.current;
		u(null), e && t && t.focus();
	};
	if ((0, _.useEffect)(() => {
		if (!l) return;
		let e = (y.current ? y.current.querySelector("[data-menu-search]") : null) || b()[0];
		e && e.focus({ preventScroll: !0 });
		let t = (e) => {
			h.current && !h.current.contains(e.target) && u(null);
		}, n = (e) => {
			e.key !== "Escape" || y.current && y.current.contains(e.target) || (e.preventDefault(), e.stopImmediatePropagation(), x(!0));
		};
		return document.addEventListener("pointerdown", t, !0), window.addEventListener("keydown", n, !0), () => {
			document.removeEventListener("pointerdown", t, !0), window.removeEventListener("keydown", n, !0);
		};
	}, [l]), !e) return null;
	let S = t.history !== !1, C = (0, Fu.dimensionGroupLabel)(s), w = (e) => e.charAt(0).toUpperCase() + e.slice(1), T = e.timeAxis(), E = (0, ou.menuModel)({
		dimensions: (0, Fu.dimensionLabels)(s),
		layers: (0, Fu.layerLabels)(s).filter((e) => i.includes(e.id)),
		axis: T,
		preferences: Object.fromEntries((0, Fu.layerLabels)(s).map((t) => [t.id, e.preference(t.id)])),
		show: t,
		group: C
	}), D = E.rows.length > 0, O = w(E.heading), k = (0, cu.hasTagNodes)(a, s && s.graph), A = [];
	if (k && l === "tags") {
		let t = typeof document < "u" ? document.querySelector("[data-graph-root]") || document.documentElement : null, n = t && typeof getComputedStyle == "function" && getComputedStyle(t).getPropertyValue("--gv-tag-color").trim() || null;
		A = (0, cu.tagListModel)(a, {
			hiddenSources: o || e.state && e.state.hiddenSources || [],
			sourceColorOf: (t) => typeof e.sourceColor == "function" ? e.sourceColor(t) : null,
			fallbackColor: n
		});
	}
	let j = (0, cu.filterTagRows)(A, d), ee = A.length > cu.SEARCH_FROM, M = () => {
		f(""), u((e) => e === "tags" ? null : "tags");
	}, N = (e) => {
		if (e.key === "Escape") {
			e.preventDefault(), e.stopPropagation(), x(!0);
			return;
		}
		if (e.key === "Tab") {
			u(null);
			return;
		}
		if (e.target && typeof e.target.matches == "function" && e.target.matches("[data-menu-search]") && e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
		let t = b(), n = (0, ou.menuMove)(t.indexOf(document.activeElement), e.key, t.length);
		n !== null && (e.preventDefault(), e.stopPropagation(), t[n].focus());
	};
	return /* @__PURE__ */ (0, H.jsxs)("div", {
		ref: h,
		className: Q.top,
		role: "group",
		"aria-label": "Graph controls",
		"data-top-graph-controls": !0,
		children: [
			S && /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [/* @__PURE__ */ (0, H.jsx)("button", {
				type: "button",
				className: Q.topIcon,
				title: "Undo (Cmd+Z)",
				"aria-label": "Undo",
				"data-top-undo": !0,
				disabled: !e.canUndo,
				onClick: () => e.undo(),
				children: /* @__PURE__ */ (0, H.jsx)(Zc, {
					body: (0, el.iconBody)("undo-2"),
					size: 15
				})
			}), /* @__PURE__ */ (0, H.jsx)("button", {
				type: "button",
				className: Q.topIcon,
				title: "Redo (Cmd+Shift+Z)",
				"aria-label": "Redo",
				"data-top-redo": !0,
				disabled: !e.canRedo,
				onClick: () => e.redo(),
				children: /* @__PURE__ */ (0, H.jsx)(Zc, {
					body: (0, el.iconBody)("redo-2"),
					size: 15
				})
			})] }),
			/* @__PURE__ */ (0, H.jsx)("button", {
				type: "button",
				className: Q.topIcon,
				title: ou.RESET_TITLE,
				"aria-label": "Reset",
				"data-toolbar-reset": !0,
				onClick: () => {
					u(null), Lu("graph:reset-all");
				},
				children: /* @__PURE__ */ (0, H.jsx)(Zc, {
					body: (0, el.iconBody)("rotate-ccw"),
					size: 15
				})
			}),
			D && /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [/* @__PURE__ */ (0, H.jsx)("button", {
				ref: g,
				type: "button",
				className: `${Q.topIcon} ${l === "dimensions" ? Q.on : ""}`,
				title: `${O}: which to show`,
				"aria-label": O,
				"aria-haspopup": "menu",
				"aria-expanded": l === "dimensions",
				"aria-controls": "pp-top-menu",
				"data-top-menu-button": !0,
				onClick: () => u((e) => e === "dimensions" ? null : "dimensions"),
				onKeyDown: (e) => {
					e.key === "ArrowDown" && l !== "dimensions" && (e.preventDefault(), u("dimensions"));
				},
				children: /* @__PURE__ */ (0, H.jsx)(Zc, {
					body: (0, el.iconBody)("hourglass"),
					size: 15
				})
			}), l === "dimensions" && /* @__PURE__ */ (0, H.jsxs)("div", {
				ref: y,
				id: "pp-top-menu",
				className: Q.menu,
				role: "menu",
				"aria-labelledby": "pp-top-menu-heading",
				"data-top-menu": !0,
				onKeyDown: N,
				children: [/* @__PURE__ */ (0, H.jsx)("div", {
					id: "pp-top-menu-heading",
					role: "presentation",
					className: Q.menuHeading,
					"data-group-label": !0,
					children: O
				}), E.rows.map((t, n) => {
					if (t.kind === "dimension" || t.kind === "layer") {
						let n = t.kind === "dimension" ? () => e.setTimeAxis((0, ou.toggleDimension)(T, t.id)) : () => e.setPreference(t.id, t.checked ? null : !0);
						return /* @__PURE__ */ (0, H.jsxs)("button", {
							type: "button",
							role: "menuitemcheckbox",
							"aria-checked": t.checked,
							title: t.title,
							className: `${Q.menuItem} ${t.kind === "layer" ? Q.layer : ""}`,
							"data-menu-item": !0,
							"data-dimension": t.id,
							onClick: n,
							children: [/* @__PURE__ */ (0, H.jsx)("span", {
								className: Q.menuCheck,
								"aria-hidden": "true",
								children: t.checked && /* @__PURE__ */ (0, H.jsx)(Zc, {
									body: (0, el.iconBody)("check"),
									size: 14
								})
							}), t.label]
						}, t.id);
					}
					return t.kind === "granularity" ? /* @__PURE__ */ (0, H.jsxs)("button", {
						type: "button",
						role: "menuitem",
						className: Q.menuItem,
						title: "Bucket size: auto, day, week, month, year",
						"data-menu-item": !0,
						"data-granularity": !0,
						onClick: () => e.setTimeAxis({ granularity: (0, ou.nextGranularity)(T.granularity) }),
						children: [
							/* @__PURE__ */ (0, H.jsx)("span", {
								className: Q.menuCheck,
								"aria-hidden": "true"
							}),
							"bucket size · ",
							t.value
						]
					}, "granularity") : null;
				})]
			})] }),
			k && /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [/* @__PURE__ */ (0, H.jsx)("button", {
				ref: v,
				type: "button",
				className: `${Q.topIcon} ${l === "tags" ? Q.on : ""}`,
				title: "Tags",
				"aria-label": "Tags",
				"aria-haspopup": "dialog",
				"aria-expanded": l === "tags",
				"aria-controls": "pp-top-tags",
				"data-top-tags-button": !0,
				onClick: M,
				onKeyDown: (e) => {
					e.key === "ArrowDown" && l !== "tags" && (e.preventDefault(), M());
				},
				children: /* @__PURE__ */ (0, H.jsx)(Zc, {
					body: (0, el.iconBody)("tag"),
					size: 15
				})
			}), l === "tags" && /* @__PURE__ */ (0, H.jsxs)("div", {
				ref: y,
				id: "pp-top-tags",
				className: `${Q.menu} ${Q.tagMenu}`,
				role: "dialog",
				"aria-label": "Tags",
				"data-top-tags": !0,
				onKeyDown: N,
				children: [
					/* @__PURE__ */ (0, H.jsx)("div", {
						role: "presentation",
						className: Q.menuHeading,
						children: "Tags"
					}),
					ee && /* @__PURE__ */ (0, H.jsx)("input", {
						type: "search",
						className: Q.menuSearch,
						placeholder: "find a tag",
						"aria-label": "Find a tag",
						value: d,
						onChange: (e) => f(e.target.value),
						"data-menu-search": !0
					}),
					/* @__PURE__ */ (0, H.jsx)("div", {
						role: "listbox",
						"aria-label": "Tags",
						className: Q.tagRows,
						children: j.map((e) => {
							let t = p === e.id;
							return /* @__PURE__ */ (0, H.jsxs)("button", {
								type: "button",
								role: "option",
								"aria-selected": t,
								title: (0, cu.tagRowTitle)(e),
								className: Q.menuItem,
								"data-menu-item": !0,
								"data-tag": e.id,
								onClick: () => Lu("graph:select-tag", { id: e.id }),
								children: [
									/* @__PURE__ */ (0, H.jsx)("span", {
										className: Q.menuCheck,
										"aria-hidden": "true",
										children: t && /* @__PURE__ */ (0, H.jsx)(Zc, {
											body: (0, el.iconBody)("check"),
											size: 14
										})
									}),
									/* @__PURE__ */ (0, H.jsx)("span", {
										className: Q.tagSwatch,
										"aria-hidden": "true",
										style: { background: e.color || "var(--gv-tag-color)" }
									}),
									/* @__PURE__ */ (0, H.jsx)("span", {
										className: Q.tagLabel,
										children: e.label
									}),
									/* @__PURE__ */ (0, H.jsx)("span", {
										className: Q.tagCount,
										children: e.count
									})
								]
							}, e.id);
						})
					}),
					!j.length && /* @__PURE__ */ (0, H.jsx)("div", {
						className: Q.menuEmpty,
						children: "none"
					})
				]
			})] }),
			/* @__PURE__ */ (0, H.jsx)(xu, {
				className: Q.topIcon,
				"data-settings-open": !0
			})
		]
	});
}
//#endregion
//#region src/components/TimeOfDay/TimeOfDay.jsx
function Vu() {
	let e = () => typeof document < "u" && document.documentElement.getAttribute("data-pp-mode") || "dark", [t, n] = (0, _.useState)(e);
	return (0, _.useEffect)(() => {
		let t = new MutationObserver(() => n(e()));
		return t.observe(document.documentElement, {
			attributes: !0,
			attributeFilter: ["data-pp-mode"]
		}), () => t.disconnect();
	}, []), t;
}
var Hu = {
	position: "fixed",
	inset: 0,
	zIndex: -1,
	pointerEvents: "none"
};
function Uu({ item: e, settings: t, viewState: n }) {
	let r = (0, uc.config)(t), [, i] = (0, _.useState)(0);
	(0, _.useEffect)(() => n ? n.subscribe(() => i((e) => e + 1)) : void 0, [n]);
	let a = Vu(), o = !n || !n.preference || n.preference("timeOfDay") !== !1, s = r && o ? (0, uc.ambienceFor)(e, r, a) : null, c = s ? `${s.top}|${s.bottom}` : "", [l, u] = (0, _.useState)([null, null]), [d, f] = (0, _.useState)(0), p = (0, _.useRef)("");
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
	return /* @__PURE__ */ (0, H.jsx)(H.Fragment, { children: l.map((e, t) => /* @__PURE__ */ (0, H.jsx)("div", {
		"aria-hidden": "true",
		"data-tod-layer": t === d && e ? "front" : "back",
		"data-tod-time": e ? e.time : "",
		style: {
			...Hu,
			background: e ? `linear-gradient(180deg, ${e.top} 0%, ${e.bottom} 100%)` : "transparent",
			opacity: t === d && e ? 1 : 0,
			transition: `opacity ${m}s ease-in-out`
		}
	}, t)) });
}
//#endregion
//#region src/components/Theme/Theme.jsx
var Wu = $l();
function Gu({ settings: e, viewState: t }) {
	let [, n] = (0, _.useState)(0), r = typeof window < "u" && window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null, [i, a] = (0, _.useState)(r ? r.matches : !0);
	(0, _.useEffect)(() => t ? t.subscribe(() => n((e) => e + 1)) : void 0, [t]), (0, _.useEffect)(() => {
		if (!r) return;
		let e = (e) => a(e.matches);
		return r.addEventListener ? r.addEventListener("change", e) : r.addListener(e), () => {
			r.removeEventListener ? r.removeEventListener("change", e) : r.removeListener(e);
		};
	}, []);
	let o = (0, iu.themeName)(e, t && t.preference ? t.preference("theme") : null), s = e && e.theme && e.theme.mode, c = (0, iu.themeMode)(o, t && t.preference ? t.preference("mode") : null, i, s), l = (0, Wu.openingConfig)(e), u = l && l.ground === "dark" ? "dark" : c;
	return (0, _.useEffect)(() => {
		let e = document.documentElement;
		e.getAttribute("data-pp-theme") !== o && e.setAttribute("data-pp-theme", o), e.getAttribute("data-pp-mode") !== u && e.setAttribute("data-pp-mode", u), e.getAttribute("data-pp-reader-mode") !== c && e.setAttribute("data-pp-reader-mode", c), e.style.colorScheme = u;
	}, [
		o,
		c,
		u
	]), null;
}
var Ku = {
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
}, qu = (/* @__PURE__ */ o(((e, t) => {
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
})))(), Ju = () => typeof window < "u" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function Yu(e) {
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
function Xu(e, t) {
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
					top: (0, Wu.firstInkRow)(s, e, i),
					bottom: (0, Wu.lastInkRow)(s, e, i),
					above: (0, Wu.inkSpan)(s, e, i, 0, c),
					below: c < 1 ? (0, Wu.widestInkRow)(s, e, i, c, 1) : null
				});
			} catch {
				n(null);
			}
		}, r.onerror = () => n(null), r.src = e;
	});
}
function Zu(e) {
	if (typeof document > "u") return 0;
	let t = 0;
	for (let n of document.querySelectorAll("[data-feeds] > *, [data-top-pages], [data-settings-gear]")) {
		let r = n.getBoundingClientRect();
		!r.width || !r.height || r.top > e * .2 || (t = Math.max(t, r.bottom));
	}
	return t;
}
function Qu(e) {
	if (typeof document > "u") return 0;
	let t = 0;
	for (let n of document.querySelectorAll("[data-feeds] > *:not([data-graph-intro]), [data-settings-gear]")) {
		let r = n.getBoundingClientRect();
		!r.width || !r.height || r.top > e * .2 || getComputedStyle(n).position === "fixed" && !n.matches("[data-settings-gear]") || (t = Math.max(t, r.bottom));
	}
	return t;
}
var $u = new Set([
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
function ed(e) {
	let t = e.target;
	return !!(t && t.nodeType === 1 && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || $u.has(t.getAttribute("role")) || t.closest("[data-reader-panel], [role=\"dialog\"], [role=\"menu\"], [data-settings-panel]") || (e.key === " " || e.key === "Spacebar") && t.closest("button, a[href], summary, [role=\"button\"]")) || typeof window < "u" && window.location.hash.startsWith("#read=") || typeof document < "u" && document.querySelector("[data-settings-panel]"));
}
function td(e) {
	let t = typeof document < "u" && document.querySelector("[data-rights]");
	if (!t || t.getAttribute("data-rights-position") === "bottom-edge") return 0;
	let n = t.getBoundingClientRect();
	return n.height > 0 ? Math.max(0, e - n.top + 8) : 0;
}
var nd = 8, rd = "http://www.w3.org/2000/svg";
function id(e, t, { reduced: n, seed: r, skip: i = () => null }) {
	let a = /* @__PURE__ */ new Map(), o = n ? 0 : e.lagMs;
	function s(e, n, i) {
		let a = document.createElementNS(rd, "g");
		a.setAttribute("data-reach", e), a.setAttribute("data-reach-container", n), a.setAttribute("data-reach-tip", String(i));
		let s = document.createElementNS(rd, "path");
		s.setAttribute("class", "reach-main");
		let c = document.createElementNS(rd, "path");
		return c.setAttribute("class", "reach-fine"), a.append(s, c), a.style.visibility = "hidden", t.appendChild(a), {
			key: e,
			g: a,
			main: s,
			fine: c,
			shape: (0, lc.reachShape)(`${r}|${e}`),
			lag: (0, lc.createLag)(o),
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
		let f = e.tips.map((e) => (0, lc.artPoint)(e, r)), p = /* @__PURE__ */ new Set(), m = !1, h = i();
		for (let t of d.containers) if (!(h && h.has(t.id))) for (let r of (0, lc.reachFor)(f, t, e.perContainer, e.stopShort)) {
			let e = r.tip, i = `${t.id}|${e}`;
			p.add(i);
			let l = a.get(i);
			l || (l = s(i, t.id, e), a.set(i, l)), l.state === "new" || !u ? l.lag.jump(r.end) : l.lag.to(r.end, n);
			let d = l.lag.at(n);
			l.lag.settled(n) || (m = !0);
			let h = (0, lc.reachPath)(f[e], d, l.shape);
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
function ad(e, t, n) {
	let r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
	for (let [e, r] of n) for (let n of r) for (let r of t.chains.get(n) || []) r.tip === n && i.set(r.e, e);
	let a = document.createDocumentFragment();
	for (let e of t.edges) {
		let t = e.parts.map((t, n) => {
			let r = document.createElementNS(rd, "path");
			return r.setAttribute("d", (0, qu.pathD)(t.pts)), r.setAttribute("stroke", t.stroke || "#e4e1db"), r.setAttribute("stroke-width", String(t.width)), r.setAttribute("data-e", String(e.e)), r.setAttribute("data-part", String(n)), e.tip && r.setAttribute("data-tip", e.tip), i.has(e.e) && r.setAttribute("data-act-root", i.get(e.e)), a.appendChild(r), r;
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
			let a = (0, qu.bentRoots)(t, n, e);
			for (let [e, t] of a) {
				let n = r.get(e);
				n && t.forEach((e, t) => {
					n[t] && n[t].setAttribute("d", (0, qu.pathD)(e));
				});
			}
		},
		dispose() {
			for (let e of r.values()) for (let t of e) t.remove();
			r.clear();
		}
	};
}
function od({ layout: e, size: t, which: n, opacity: r }) {
	let i = (0, Wu.titleLayout)(e, {
		left: 0,
		top: 0,
		width: t.w,
		height: t.h
	}).lines;
	return i.length ? /* @__PURE__ */ (0, H.jsx)("g", {
		"data-cover-title": n,
		style: { opacity: r },
		children: i.map((e, t) => {
			let n = 0;
			return /* @__PURE__ */ (0, H.jsx)("text", {
				x: e.x,
				y: e.y,
				"data-cover-title-line": t,
				xmlSpace: "preserve",
				children: e.spans.map((e, t) => {
					let r = n - e.rise;
					return n = e.rise, /* @__PURE__ */ (0, H.jsx)("tspan", {
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
function sd(e, t) {
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
function cd(e) {
	if (!e) return;
	let t = e.bottom || "var(--sk-paper, var(--bg, #2a2a2e))";
	return {
		backgroundColor: e.top,
		backgroundImage: `linear-gradient(to bottom, ${e.top} 0%, ${e.top} ${(e.colorFrom * 100).toFixed(1)}%, ${t} 100%)`
	};
}
function ld(e) {
	let t = `linear-gradient(to bottom, transparent 0%, transparent ${(e * 100).toFixed(1)}%, #000 100%)`;
	return {
		WebkitMaskImage: t,
		maskImage: t
	};
}
function ud({ title: e, size: t, start: n, refs: r }) {
	return !e || !t ? null : /* @__PURE__ */ (0, H.jsxs)("svg", {
		className: Ku.title,
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
		children: [/* @__PURE__ */ (0, H.jsx)("g", {
			ref: r.art,
			children: /* @__PURE__ */ (0, H.jsx)(od, {
				layout: e.art,
				size: t,
				which: "art",
				opacity: +(n === "art")
			})
		}), /* @__PURE__ */ (0, H.jsx)("g", {
			ref: r.graph,
			children: /* @__PURE__ */ (0, H.jsx)(od, {
				layout: e.graph,
				size: t,
				which: "graph",
				opacity: n === "art" ? 0 : 1
			})
		})]
	});
}
function dd({ config: e, viewState: t, children: n }) {
	let r = (0, _.useRef)(null), i = (0, _.useRef)(null), a = (0, _.useRef)(null), o = (0, _.useRef)(null), s = (0, _.useRef)(null), c = (0, _.useRef)(null), l = (0, _.useRef)(null), u = (0, _.useRef)(null), d = (0, _.useRef)(null), f = (0, _.useRef)(null), p = (0, _.useRef)(null), m = (0, _.useRef)(null), h = (0, _.useRef)(null), g = (0, _.useRef)(null), v = (0, _.useRef)(0), y = (0, _.useRef)(null), b = (0, _.useRef)(null), x = (0, _.useRef)(null), S = (0, _.useRef)(null), C = (0, _.useRef)(null), w = (0, _.useRef)(null), T = (0, _.useRef)(null), E = (0, _.useRef)(null), D = (0, _.useRef)(null), O = (0, _.useRef)(() => !1), [k, A] = (0, _.useState)(null), j = (0, _.useRef)(null), ee = (0, _.useRef)(0), M = (0, _.useMemo)(Ju, []), N = (0, _.useMemo)(() => (0, Wu.startState)(e, {
		stored: t && t.openingState ? t.openingState() : null,
		hash: typeof window < "u" ? window.location.hash : ""
	}), [e, t]), P = !!(e.graph && e.graph.hiddenUntilMove) && N === "art", F = (0, _.useRef)({ at: null }), I = () => (0, Wu.revealFactor)(P, F.current.at, performance.now()), L = () => {
		if (!P || F.current.at !== null) return;
		F.current.at = performance.now(), document.documentElement.setAttribute("data-pp-cover-acts", "shown");
		let e = () => {
			E.current && !te.current && ye.current(E.current.p), I() < 1 && requestAnimationFrame(e);
		};
		requestAnimationFrame(e);
	}, te = (0, _.useRef)(!1), ne = (0, _.useRef)(L);
	ne.current = L, (0, _.useEffect)(() => {
		let t = !0, n = e.top || e.fit === "width" || e.graph.rootsFit === "width" ? Promise.all([Xu(e.art.artState, e.crownY), Xu(e.art.graphState || e.art.artState, e.crownY)]) : Promise.resolve([null, null]);
		return Promise.all([Yu(e.art.artState), n]).then(([e, [n, r]]) => {
			t && (j.current = {
				art: n ? n.top : null,
				graph: r ? r.top : null,
				bottom: r ? r.bottom : null,
				bush: n && n.above,
				roots: r && r.below
			}, A(e || {
				w: 1,
				h: 2
			}));
		}), () => {
			t = !1;
		};
	}, [e]);
	let [re, ie] = (0, _.useState)(e.title), R = (0, _.useRef)(e.title);
	R.current = re;
	let ae = (0, _.useRef)(null), oe = (t) => {
		let n = window.innerWidth, r = window.innerHeight;
		return (0, Wu.coverGeometry)(R.current === e.title ? e : {
			...e,
			title: R.current
		}, {
			vw: n,
			vh: r,
			art: D.current || {
				w: 1,
				h: 2
			},
			bottom: td(r),
			zoom: h.current,
			controls: ee.current,
			ink: j.current,
			perPx: ae.current
		}, t);
	}, se = () => {
		y.current = null;
		let t = window.PostPipeGraphWorld ? window.PostPipeGraphWorld.snapshot() : null;
		t && t.k > 0 && t.homeK > 0 && (h.current = {
			k: t.k,
			homeK: t.homeK
		});
		let n = E.current;
		if (!n) return;
		let r = oe(n.p);
		g.current = r, ue(r);
		let i = p.current;
		if (i && t && t.homeK > 0 && D.current) {
			let n = oe(1), r = D.current.w / Math.max(1, n.art.width), a = /* @__PURE__ */ new Map();
			for (let e of t.containers) e.drift && i.acts.has(e.id) && a.set(e.id, {
				dx: e.drift.x * t.homeK * r,
				dy: e.drift.y * t.homeK * r
			});
			m.current ||= (0, qu.createFollow)(M ? 0 : e.art.rootsFollowMs);
			let o = m.current;
			i.draw.bend(o.step(a, performance.now())), (!o.settled() || t.moving) && ce();
		}
		let a = d.current;
		if (!a || !D.current) return;
		if (ge.current) {
			u.current && (u.current.style.opacity = "0");
			return;
		}
		let o = h.current ? (0, lc.backdropOpacity)(e.backdrop, h.current.k, h.current.homeK) : e.backdrop.opacity;
		a.draw(performance.now(), {
			box: r.art,
			world: t,
			opacity: r.layer.opacity * o * I(),
			settledCover: n.p >= 1 && !n.moving
		}) && ce();
	}, ce = () => {
		y.current ||= requestAnimationFrame(() => le.current());
	}, le = (0, _.useRef)(se);
	le.current = se;
	let ue = (t) => {
		let n = c.current, r = (0, Wu.rootsBrightnessAt)(e, t.p), i = r === 1 ? "" : `brightness(${r.toFixed(3)})`;
		f.current && f.current.style.filter !== i && (f.current.style.filter = i), n && n.style.filter !== i && (n.style.filter = i), p.current && f.current ? (f.current.style.opacity = String(t.fade.graph * t.roots), n && (n.style.opacity = "0")) : n ? n.style.opacity = String(t.fade.graph * t.roots) : s.current && (s.current.style.opacity = String(t.roots)), l.current && (l.current.style.opacity = String(t.fade.graph));
	}, de = () => {
		let t = Qu(window.innerHeight), n = T.current;
		n && (n.style.height = `calc(env(safe-area-inset-top, 0px) + ${Math.ceil(t + 8)}px)`);
		let r = w.current;
		if (!r) return;
		let i = `calc(env(safe-area-inset-top, 0px) + ${(0, Wu.gripHeight)(t, e.grip)}px)`;
		if (e.returnAbove === "crown" && D.current) {
			let t = oe(1), n = t.art.top + e.crownY * t.art.height;
			r.style.height = `max(${i}, ${Math.max(0, Math.round(n))}px)`, r.setAttribute("data-cover-handle-to", "crown");
		} else r.style.height = i;
	}, fe = (0, _.useRef)(de);
	fe.current = de;
	let pe = () => {
		let e = T.current, t = e ? e.getBoundingClientRect().bottom : 0;
		return Math.max(Zu(window.innerHeight), t);
	}, me = () => {
		if (!D.current) return;
		de();
		let t = oe(1);
		window.PostPipeCoverFrame = {
			art: {
				left: t.art.left,
				top: t.art.top,
				width: t.art.width,
				height: t.art.height
			},
			natural: { ...D.current },
			crownY: e.crownY,
			zoomPivot: e.zoomPivot
		}, window.dispatchEvent(new CustomEvent("postpipe:cover-frame"));
	}, he = (0, _.useRef)(me);
	he.current = me;
	let ge = (0, _.useRef)(!1), _e = (e, t, n) => {
		let r = t === "art" && n.layer.opacity === 0 && !!window.PostPipeGraphWorld;
		ge.current = r;
		for (let t of e.children) t.style.display = r ? "none" : "";
	}, ve = (t) => {
		let n = oe(t), r = E.current, l = r && r.moving ? "moving" : t >= 1 ? "graph" : t <= 0 ? "art" : "moving", u = document.documentElement;
		u.style.setProperty("--pp-cover-p", String(n.p)), u.setAttribute("data-pp-cover", l), e.topBarInArt || u.setAttribute("data-pp-cover-bar", l === "graph" ? "shown" : "hidden");
		let d = o.current;
		d && (d.style.width = `${n.art.width}px`, d.style.height = `${n.art.height}px`, d.style.transform = `translate3d(${n.art.left}px, ${n.art.top}px, 0)`, d.style.opacity = D.current ? String(n.art.opacity) : "0"), g.current = n, c.current && s.current && (s.current.style.opacity = String(n.fade.art)), ue(n);
		let f = b.current && b.current.firstChild, p = x.current && x.current.firstChild;
		f && (f.style.opacity = String(n.fade.art)), p && (p.style.opacity = String(n.fade.graph)), i.current && (i.current.style.opacity = String(n.ground));
		let m = S.current;
		if (m) {
			m.style.left = `${n.byline.x}px`, m.style.top = `${n.byline.y}px`, m.style.fontSize = `${n.byline.size}px`, m.style.opacity = D.current ? String(n.byline.opacity) : "0", m.setAttribute("data-cover-byline", n.byline.under);
			let e = n.byline.under === "title" ? l !== "moving" : n.byline.opacity > .5;
			m.style.pointerEvents = e ? "auto" : "none", m.tabIndex = n.byline.under === "title" ? e ? 0 : -1 : l === "art" ? 0 : -1;
		}
		let h = a.current;
		h && (h.setAttribute("data-cover-state", l), h.tabIndex = l === "art" ? 0 : -1);
		let _ = C.current;
		if (_) {
			let e = l === "graph";
			v.current = e ? 0 : n.layer.follow, _.style.pointerEvents = e ? "" : "none";
			for (let t of _.children) {
				if (t.matches("[data-feeds], [data-top-bar], [data-top-band], [data-cover-handle]")) continue;
				let r = t.matches("[data-graph-root]");
				r && _e(t, l, n);
				let i = r ? I() : 1;
				t.style.opacity = e && i >= 1 ? "" : String(e ? i : r ? n.layer.opacity * i : n.graph.opacity), t.style.transform = e ? "" : r ? `translate3d(0, ${n.layer.follow}px, 0)` : `translate3d(0, ${n.graph.shift}px, 0)`, t.inert = l === "art", l === "art" ? t.setAttribute("aria-hidden", "true") : t.removeAttribute("aria-hidden");
			}
			for (let t of _.querySelectorAll("[data-top-graph-controls]")) t.inert = !e;
		}
		let y = w.current;
		y && (y.style.opacity = String(n.graph.opacity), y.style.pointerEvents = l === "graph" ? "auto" : "none", y.tabIndex = l === "graph" ? 0 : -1), ce();
	}, ye = (0, _.useRef)(ve);
	ye.current = ve, (0, _.useEffect)(() => {
		if (!e.title || !e.title.hideGraphTitle) return;
		let t = document.documentElement;
		return t.setAttribute("data-pp-cover-title", ""), () => t.removeAttribute("data-pp-cover-title");
	}, [e]), (0, _.useEffect)(() => {
		if (!e.sky) return;
		let t = document.documentElement;
		return t.setAttribute("data-pp-cover-sky", ""), t.style.setProperty("--pp-sky-from", `${(e.sky.textureFrom * 100).toFixed(1)}%`), () => {
			t.removeAttribute("data-pp-cover-sky"), t.style.removeProperty("--pp-sky-from");
		};
	}, [e]), (0, _.useLayoutEffect)(() => {
		if (!k) return;
		D.current = k, de(), ee.current = e.top ? pe() : 0;
		let t = E.current;
		t && (t.resize(oe(0).travel), ye.current(t.p)), he.current();
		let n = !0;
		return e.top && document.fonts && document.fonts.ready && document.fonts.ready.then(() => {
			de();
			let e = pe();
			if (!n || Math.abs(e - ee.current) < .5) return;
			ee.current = e;
			let t = E.current;
			t && (t.resize(oe(0).travel), ye.current(t.p)), he.current();
		}), () => {
			n = !1;
		};
	}, [k]), (0, _.useEffect)(() => {
		if (!k || !e.title || e.title.fit !== "width") return;
		let t = !0, n = (e) => e.current ? [...e.current.querySelectorAll("[data-cover-title-line]")].map((e) => {
			try {
				return e.getComputedTextLength();
			} catch {
				return 0;
			}
		}) : [], r = () => {
			if (!t) return;
			ie((e) => (0, Wu.fitTitle)(e, {
				art: n(b),
				graph: n(x)
			}, k.w));
			let e = S.current;
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
				t.remove(), r > 0 && (ae.current = r / 100);
			}
		};
		return (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(r)), () => {
			t = !1;
		};
	}, [k, e]), (0, _.useLayoutEffect)(() => {
		if (re === e.title) return;
		let t = E.current;
		t && ye.current(t.p), he.current();
	}, [re]), (0, _.useEffect)(() => {
		let t = e.art.rootsVector;
		if (!t || !k || typeof fetch > "u") return;
		let n = !0, r = null;
		return fetch(t).then((e) => e.ok ? e.text() : "").then((t) => {
			let i = f.current, a = (0, qu.rootsModel)((0, qu.parseRoots)(t));
			if (!n || !i || !a) return;
			let o = (0, qu.actRoots)(a, e.acts);
			r = ad(i, a, o), p.current = {
				draw: r,
				acts: new Set(o.keys())
			}, i.setAttribute("data-roots-vector", "ready");
			let s = E.current;
			s && ye.current(s.p);
		}).catch(() => {}), () => {
			n = !1, r && r.dispose(), p.current = null;
		};
	}, [e, k]), (0, _.useEffect)(() => {
		e.reach && u.current && (d.current = id(e.reach, u.current, {
			reduced: M,
			seed: e.art.graphState || e.art.artState,
			skip: () => p.current ? p.current.acts : null
		}));
		let t = () => {
			let e = E.current;
			e && !e.moving && e.p === 0 && !ge.current && ye.current(e.p), ce();
		};
		return window.addEventListener("graph:world", t), ce(), () => {
			window.removeEventListener("graph:world", t), y.current && cancelAnimationFrame(y.current), y.current = null, d.current && d.current.dispose(), d.current = null, window.PostPipeCoverFrame && delete window.PostPipeCoverFrame;
		};
	}, [e, M]), (0, _.useLayoutEffect)(() => {
		let n = null, i = (0, Wu.createCover)(e, {
			start: N,
			reducedMotion: M,
			travel: oe(0).travel,
			frame: (e) => requestAnimationFrame(e),
			cancelFrame: (e) => cancelAnimationFrame(e),
			onChange(e, t) {
				if ((e > 0 || t && t.swap) && ne.current(), t && t.swap) {
					let i = Math.round((t.ms || Wu.TUNING.reducedFadeMs) / 2);
					te.current = !0;
					let a = [r.current, C.current].filter(Boolean);
					for (let e of a) e.style.transition = `opacity ${i}ms linear`, e.style.opacity = "0";
					n && clearTimeout(n);
					let o = Date.now(), s = () => {
						let t = r.current;
						if ((t ? Number(getComputedStyle(t).opacity) : 0) > .02 && Date.now() - o < i * 4) {
							n = setTimeout(s, 16);
							return;
						}
						te.current = !1, ye.current(e);
						for (let e of a) e.style.opacity = "1";
						n = setTimeout(() => {
							for (let e of a) e.style.transition = "";
							C.current && (C.current.style.opacity = ""), n = null;
						}, i + 20);
					};
					n = setTimeout(s, i);
					return;
				}
				ye.current(e);
			},
			onRest(e) {
				n || ye.current(i.p), t && t.setOpeningState && (t.setOpeningState(e), t.flush && t.flush()), window.dispatchEvent(new CustomEvent("postpipe:cover", { detail: { state: e } }));
			}
		});
		E.current = i, ye.current(i.p), t && t.setOpeningState && t.setOpeningState(i.rest), window.PostPipeCover = {
			get state() {
				return i.moving ? "moving" : i.rest;
			},
			get p() {
				return i.p;
			},
			get shift() {
				return v.current;
			},
			get acts() {
				return I();
			},
			go: (e, t) => i.go(e, t)
		};
		let o = () => fe.current();
		o();
		let s = requestAnimationFrame(o);
		document.fonts && document.fonts.ready && document.fonts.ready.then(o);
		let c = () => {
			o(), e.top && (ee.current = pe()), i.resize(oe(0).travel), ye.current(i.p), he.current();
		};
		window.addEventListener("resize", c);
		let l = C.current, u = a.current, d = w.current, f = (e) => {
			let t = e.target;
			return !t || !t.closest ? null : d && d.contains(t) ? "edge" : u && u.contains(t) ? "stage" : S.current && S.current.contains(t) ? i.p < 1 || i.moving ? "stage" : "graph" : !l || !l.contains(t) ? null : i.moving || i.p < 1 ? "stage" : e.clientY <= p() ? "edge" : "graph";
		}, p = () => {
			if (e.returnAbove !== "crown" || !D.current) return Wu.TUNING.edgePx;
			let t = oe(1);
			return Math.max(Wu.TUNING.edgePx, t.art.top + e.crownY * t.art.height);
		}, m = (e) => {
			if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
			let t = f(e);
			t && (e.ctrlKey && t !== "stage" || i.wheel(e.deltaY, {
				deltaMode: e.deltaMode,
				where: t
			}) && (e.preventDefault(), e.stopPropagation()));
		};
		window.addEventListener("wheel", m, {
			capture: !0,
			passive: !1
		});
		let h = (e) => !!(e && e.closest && e.closest("[data-feeds], [data-top-bar]") && e.closest("button, a, input, select, [role=\"button\"], [role=\"menu\"], [role=\"menuitem\"], [role=\"menuitemcheckbox\"]")), g = (e) => {
			e.deltaY > 0 && ne.current();
		}, _ = () => ne.current(), y = (e) => {
			h(e.target) || ne.current();
		};
		P && (window.addEventListener("wheel", g, {
			capture: !0,
			passive: !0
		}), window.addEventListener("touchmove", _, {
			capture: !0,
			passive: !0
		}), window.addEventListener("pointerdown", y, {
			capture: !0,
			passive: !0
		}), document.documentElement.setAttribute("data-pp-cover-acts", "hidden"));
		let b = (e) => {
			let t = (0, Wu.pageKey)(e);
			!t || e.defaultPrevented || ed(e) || i.key(t) && e.preventDefault();
		};
		window.addEventListener("keydown", b);
		let x = () => {
			window.location.hash.startsWith("#read=") && i.go("graph");
		};
		window.addEventListener("hashchange", x);
		let T = null, k = 0;
		O.current = () => Date.now() - k < 500;
		let A = (e) => {
			e.touches.length === 1 && (e.target.closest && e.target.closest("[data-cover-byline]") || (T = {
				y: e.touches[0].clientY,
				moved: 0
			}, i.touchStart(e.touches[0].clientY, e.timeStamp || Date.now())));
		}, j = (e) => {
			T && (e.preventDefault(), T.moved = Math.max(T.moved, Math.abs(e.touches[0].clientY - T.y)), i.touchMove(e.touches[0].clientY, e.timeStamp || Date.now()));
		}, F = (e) => {
			T && (T.moved >= nd && (k = Date.now()), T = null, i.touchEnd(e.timeStamp || Date.now()));
		}, L = null, re = (e) => {
			if (!(e.pointerType !== "mouse" || e.button !== 0)) {
				L = {
					y: e.clientY,
					moved: 0
				};
				try {
					d.setPointerCapture(e.pointerId);
				} catch {}
				i.touchStart(e.clientY, e.timeStamp || Date.now());
			}
		}, ie = (e) => {
			L && (L.moved = Math.max(L.moved, Math.abs(e.clientY - L.y)), L.moved >= nd && i.touchMove(e.clientY, e.timeStamp || Date.now()));
		}, R = (e) => {
			L && (L.moved >= nd && (k = Date.now()), L = null, i.touchEnd(e.timeStamp || Date.now()));
		};
		d && (d.addEventListener("pointerdown", re), d.addEventListener("pointermove", ie), d.addEventListener("pointerup", R), d.addEventListener("pointercancel", R));
		let ae = [u, d].filter(Boolean);
		for (let e of ae) e.addEventListener("touchstart", A, { passive: !0 }), e.addEventListener("touchmove", j, { passive: !1 }), e.addEventListener("touchend", F), e.addEventListener("touchcancel", F);
		return () => {
			i.dispose(), cancelAnimationFrame(s), d && (d.removeEventListener("pointerdown", re), d.removeEventListener("pointermove", ie), d.removeEventListener("pointerup", R), d.removeEventListener("pointercancel", R)), n && clearTimeout(n), window.removeEventListener("resize", c), window.removeEventListener("wheel", m, { capture: !0 }), window.removeEventListener("wheel", g, { capture: !0 }), window.removeEventListener("touchmove", _, { capture: !0 }), window.removeEventListener("pointerdown", y, { capture: !0 }), document.documentElement.removeAttribute("data-pp-cover-acts"), window.removeEventListener("keydown", b), window.removeEventListener("hashchange", x);
			for (let e of ae) e.removeEventListener("touchstart", A), e.removeEventListener("touchmove", j), e.removeEventListener("touchend", F), e.removeEventListener("touchcancel", F);
			document.documentElement.removeAttribute("data-pp-cover"), document.documentElement.style.removeProperty("--pp-cover-p"), window.PostPipeCover && window.PostPipeCover.go && delete window.PostPipeCover, E.current = null;
		};
	}, [
		e,
		M,
		N,
		t
	]);
	let be = (e) => {
		let t = E.current;
		!t || O.current() || (e === "graph" ? t.tapArt() : t.tapTop());
	}, xe = N === "art";
	return /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [
		/* @__PURE__ */ (0, H.jsxs)("div", {
			ref: r,
			className: Ku.cover,
			"data-cover": !0,
			"data-ground": e.ground,
			children: [
				/* @__PURE__ */ (0, H.jsx)("div", {
					ref: i,
					className: Ku.ground,
					"data-cover-ground": !0,
					"data-sky": e.sky ? "" : void 0,
					style: {
						opacity: +!!xe,
						...cd(e.sky)
					},
					children: e.sky && e.sky.texture > 0 && /* @__PURE__ */ (0, H.jsx)("div", {
						className: Ku.groundTexture,
						"data-cover-ground-texture": !0,
						style: {
							opacity: e.sky.texture,
							...ld(e.sky.textureFrom)
						}
					})
				}),
				/* @__PURE__ */ (0, H.jsxs)("div", {
					ref: a,
					className: Ku.stage,
					role: "button",
					tabIndex: xe ? 0 : -1,
					"aria-label": "Show the graph",
					"data-cover-stage": !0,
					"data-cover-state": N,
					onClick: (e) => {
						e.target.closest && e.target.closest("[data-cover-byline]") || E.current && E.current.p < .5 && be("graph");
					},
					onKeyDown: (e) => {
						e.target === e.currentTarget && (e.key === "Enter" || e.key === " " || e.key === "Spacebar") && (e.preventDefault(), e.stopPropagation(), be("graph"));
					},
					children: [/* @__PURE__ */ (0, H.jsxs)("div", {
						ref: o,
						className: Ku.art,
						"data-cover-art": !0,
						style: { opacity: 0 },
						children: [
							/* @__PURE__ */ (0, H.jsx)("img", {
								ref: s,
								className: Ku.image,
								src: e.art.artState,
								alt: "",
								draggable: "false",
								"data-cover-image": "art",
								style: e.art.graphState ? { opacity: +!!xe } : void 0
							}),
							e.art.graphState && /* @__PURE__ */ (0, H.jsx)("img", {
								ref: c,
								className: Ku.image,
								src: e.art.graphState,
								alt: "",
								draggable: "false",
								"data-cover-image": "graph",
								style: {
									opacity: xe ? 0 : e.backdrop.opacity,
									...sd(e.backdrop.keepAbove, "below")
								}
							}),
							e.art.graphState && e.backdrop.keepAbove > 0 && /* @__PURE__ */ (0, H.jsx)("img", {
								ref: l,
								className: Ku.image,
								src: e.art.graphState,
								alt: "",
								draggable: "false",
								"data-cover-image": "graph-keep",
								style: {
									opacity: +!xe,
									...sd(e.backdrop.keepAbove, "above")
								}
							}),
							e.art.rootsVector && /* @__PURE__ */ (0, H.jsx)("svg", {
								ref: f,
								className: Ku.roots,
								"aria-hidden": "true",
								"data-roots-vector": "loading",
								preserveAspectRatio: "none",
								viewBox: k ? `0 0 ${k.w} ${k.h}` : void 0,
								style: {
									opacity: 0,
									...sd(e.backdrop.keepAbove, "below")
								}
							}),
							/* @__PURE__ */ (0, H.jsx)(ud, {
								title: re,
								size: k,
								start: N,
								refs: {
									art: b,
									graph: x
								}
							})
						]
					}), e.alt && /* @__PURE__ */ (0, H.jsx)("span", {
						className: Ku.alt,
						role: "img",
						"aria-label": e.alt,
						"data-cover-alt": !0
					})]
				}),
				e.reach && /* @__PURE__ */ (0, H.jsx)("svg", {
					ref: u,
					className: Ku.reach,
					"aria-hidden": "true",
					"data-cover-reach": !0,
					style: { opacity: 0 }
				})
			]
		}),
		/* @__PURE__ */ (0, H.jsxs)("div", {
			ref: C,
			className: Ku.section,
			"data-cover-section": !0,
			style: xe ? { pointerEvents: "none" } : void 0,
			children: [
				n,
				e.band && /* @__PURE__ */ (0, H.jsx)("div", {
					ref: T,
					className: Ku.band,
					"data-top-band": !0,
					"aria-hidden": "true",
					style: { background: e.band.color }
				}),
				/* @__PURE__ */ (0, H.jsx)("button", {
					ref: w,
					type: "button",
					className: Ku.handle,
					"aria-label": "Show the cover",
					title: "Show the cover",
					"data-cover-handle": !0,
					tabIndex: xe ? -1 : 0,
					style: {
						opacity: +!xe,
						pointerEvents: xe ? "none" : "auto"
					},
					onClick: () => be("art"),
					children: /* @__PURE__ */ (0, H.jsx)("span", {
						className: Ku.grip,
						"aria-hidden": "true"
					})
				})
			]
		}),
		e.byline.text && /* @__PURE__ */ (0, H.jsx)("a", {
			ref: S,
			className: `${Ku.byline} ${e.title ? Ku.bylineTitle : ""}`,
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
			children: (0, Wu.bylineText)(e.byline)
		})
	] });
}
function fd({ settings: e, viewState: t, children: n }) {
	let r = (0, _.useMemo)(() => (0, Wu.openingConfig)(e), [e]);
	return r ? /* @__PURE__ */ (0, H.jsx)(dd, {
		config: r,
		viewState: t,
		children: n
	}) : /* @__PURE__ */ (0, H.jsx)(H.Fragment, { children: n });
}
//#endregion
//#region src/components/Contributions/useContributions.js
function pd(e, t) {
	let n = JSON.stringify(e && e.contributions || null), r = (0, _.useMemo)(() => (0, dc.contributionsConfig)(e), [n]), [i, a] = (0, _.useState)(null);
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
	let o = (0, _.useMemo)(() => r && i ? (0, dc.visibleContributions)(i, {
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
		layers: (0, _.useMemo)(() => (0, dc.connectionEdges)(o).length ? ["readers"] : [], [o])
	};
}
//#endregion
var md = fc.followLink, hd = q.graphFeed, gd = fc.isLinkItem, _d = fc.linkOf, vd = q.resolvePages, $ = q.resumeTarget, yd = ou.toolbarConfig, bd = q.topBarConfig, xd = q.topBarOrder;
export { Du as ConfigPanel, Y as FeedZ, Lc as GraphViewer, fd as Opening, _ as React, v as ReactDOM, Tl as ReaderPanel, Su as Settings, Ll as TTS, Gu as Theme, Uu as TimeOfDay, Pu as TimeOverlay, Ru as Toolbar, md as followLink, hd as graphFeed, gd as isLinkItem, _d as linkOf, vd as resolvePages, $ as resumeTarget, yd as toolbarConfig, bd as topBarConfig, xd as topBarOrder, pd as useContributions };
