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
	var ee = Array.isArray;
	function S() {}
	var C = {
		H: null,
		A: null,
		T: null,
		S: null
	}, te = Object.prototype.hasOwnProperty;
	function ne(e, n, r) {
		var i = r.ref;
		return {
			$$typeof: t,
			type: e,
			key: n,
			ref: i === void 0 ? null : i,
			props: r
		};
	}
	function re(e, t) {
		return ne(e.type, t, e.props);
	}
	function w(e) {
		return typeof e == "object" && !!e && e.$$typeof === t;
	}
	function ie(e) {
		var t = {
			"=": "=0",
			":": "=2"
		};
		return "$" + e.replace(/[=:]/g, function(e) {
			return t[e];
		});
	}
	var T = /\/+/g;
	function ae(e, t) {
		return typeof e == "object" && e && e.key != null ? ie("" + e.key) : t.toString(36);
	}
	function oe(e) {
		switch (e.status) {
			case "fulfilled": return e.value;
			case "rejected": throw e.reason;
			default: switch (typeof e.status == "string" ? e.then(S, S) : (e.status = "pending", e.then(function(t) {
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
	function E(e, r, i, a, o) {
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
				case d: return c = e._init, E(c(e._payload), r, i, a, o);
			}
		}
		if (c) return o = o(e), c = a === "" ? "." + ae(e, 0) : a, ee(o) ? (i = "", c != null && (i = c.replace(T, "$&/") + "/"), E(o, r, i, "", function(e) {
			return e;
		})) : o != null && (w(o) && (o = re(o, i + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace(T, "$&/") + "/") + c)), r.push(o)), 1;
		c = 0;
		var l = a === "" ? "." : a + ":";
		if (ee(e)) for (var u = 0; u < e.length; u++) a = e[u], s = l + ae(a, u), c += E(a, r, i, s, o);
		else if (u = m(e), typeof u == "function") for (e = u.call(e), u = 0; !(a = e.next()).done;) a = a.value, s = l + ae(a, u++), c += E(a, r, i, s, o);
		else if (s === "object") {
			if (typeof e.then == "function") return E(oe(e), r, i, a, o);
			throw r = String(e), Error("Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead.");
		}
		return c;
	}
	function se(e, t, n) {
		if (e == null) return e;
		var r = [], i = 0;
		return E(e, r, "", "", function(e) {
			return t.call(n, e, i++);
		}), r;
	}
	function ce(e) {
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
	var D = typeof reportError == "function" ? reportError : function(e) {
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
	}, O = {
		map: se,
		forEach: function(e, t, n) {
			se(e, function() {
				t.apply(this, arguments);
			}, n);
		},
		count: function(e) {
			var t = 0;
			return se(e, function() {
				t++;
			}), t;
		},
		toArray: function(e) {
			return se(e, function(e) {
				return e;
			}) || [];
		},
		only: function(e) {
			if (!w(e)) throw Error("React.Children.only expected to receive a single React element child.");
			return e;
		}
	};
	e.Activity = f, e.Children = O, e.Component = v, e.Fragment = r, e.Profiler = a, e.PureComponent = b, e.StrictMode = i, e.Suspense = l, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = C, e.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(e) {
			return C.H.useMemoCache(e);
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
		if (t != null) for (a in t.key !== void 0 && (i = "" + t.key), t) !te.call(t, a) || a === "key" || a === "__self" || a === "__source" || a === "ref" && t.ref === void 0 || (r[a] = t[a]);
		var a = arguments.length - 2;
		if (a === 1) r.children = n;
		else if (1 < a) {
			for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
			r.children = o;
		}
		return ne(e.type, i, r);
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
		if (t != null) for (r in t.key !== void 0 && (a = "" + t.key), t) te.call(t, r) && r !== "key" && r !== "__self" && r !== "__source" && (i[r] = t[r]);
		var o = arguments.length - 2;
		if (o === 1) i.children = n;
		else if (1 < o) {
			for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
			i.children = s;
		}
		if (e && e.defaultProps) for (r in o = e.defaultProps, o) i[r] === void 0 && (i[r] = o[r]);
		return ne(e, a, i);
	}, e.createRef = function() {
		return { current: null };
	}, e.forwardRef = function(e) {
		return {
			$$typeof: c,
			render: e
		};
	}, e.isValidElement = w, e.lazy = function(e) {
		return {
			$$typeof: d,
			_payload: {
				_status: -1,
				_result: e
			},
			_init: ce
		};
	}, e.memo = function(e, t) {
		return {
			$$typeof: u,
			type: e,
			compare: t === void 0 ? null : t
		};
	}, e.startTransition = function(e) {
		var t = C.T, n = {};
		C.T = n;
		try {
			var r = e(), i = C.S;
			i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && r.then(S, D);
		} catch (e) {
			D(e);
		} finally {
			t !== null && n.types !== null && (t.types = n.types), C.T = t;
		}
	}, e.unstable_useCacheRefresh = function() {
		return C.H.useCacheRefresh();
	}, e.use = function(e) {
		return C.H.use(e);
	}, e.useActionState = function(e, t, n) {
		return C.H.useActionState(e, t, n);
	}, e.useCallback = function(e, t) {
		return C.H.useCallback(e, t);
	}, e.useContext = function(e) {
		return C.H.useContext(e);
	}, e.useDebugValue = function() {}, e.useDeferredValue = function(e, t) {
		return C.H.useDeferredValue(e, t);
	}, e.useEffect = function(e, t) {
		return C.H.useEffect(e, t);
	}, e.useEffectEvent = function(e) {
		return C.H.useEffectEvent(e);
	}, e.useId = function() {
		return C.H.useId();
	}, e.useImperativeHandle = function(e, t, n) {
		return C.H.useImperativeHandle(e, t, n);
	}, e.useInsertionEffect = function(e, t) {
		return C.H.useInsertionEffect(e, t);
	}, e.useLayoutEffect = function(e, t) {
		return C.H.useLayoutEffect(e, t);
	}, e.useMemo = function(e, t) {
		return C.H.useMemo(e, t);
	}, e.useOptimistic = function(e, t) {
		return C.H.useOptimistic(e, t);
	}, e.useReducer = function(e, t, n) {
		return C.H.useReducer(e, t, n);
	}, e.useRef = function(e) {
		return C.H.useRef(e);
	}, e.useState = function(e) {
		return C.H.useState(e);
	}, e.useSyncExternalStore = function(e, t, n) {
		return C.H.useSyncExternalStore(e, t, n);
	}, e.useTransition = function() {
		return C.H.useTransition();
	}, e.version = "19.2.6";
})), u = /* @__PURE__ */ o(((e, t) => {
	process.env.NODE_ENV !== "production" && (function() {
		function n(e, t) {
			Object.defineProperty(a.prototype, e, { get: function() {
				console.warn("%s(...) is deprecated in plain JavaScript React classes. %s", t[0], t[1]);
			} });
		}
		function r(e) {
			return typeof e != "object" || !e ? null : (e = ye && e[ye] || e["@@iterator"], typeof e == "function" ? e : null);
		}
		function i(e, t) {
			e = (e = e.constructor) && (e.displayName || e.name) || "ReactClass";
			var n = e + "." + t;
			be[n] || (console.error("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", t, e), be[n] = !0);
		}
		function a(e, t, n) {
			this.props = e, this.context = t, this.refs = Se, this.updater = n || xe;
		}
		function o() {}
		function s(e, t, n) {
			this.props = e, this.context = t, this.refs = Se, this.updater = n || xe;
		}
		function c() {}
		function l(e) {
			return "" + e;
		}
		function u(e) {
			try {
				l(e);
				var t = !1;
			} catch {
				t = !0;
			}
			if (t) {
				t = console;
				var n = t.error, r = typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
				return n.call(t, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", r), l(e);
			}
		}
		function d(e) {
			if (e == null) return null;
			if (typeof e == "function") return e.$$typeof === Te ? null : e.displayName || e.name || null;
			if (typeof e == "string") return e;
			switch (e) {
				case O: return "Fragment";
				case ue: return "Profiler";
				case le: return "StrictMode";
				case me: return "Suspense";
				case he: return "SuspenseList";
				case ve: return "Activity";
			}
			if (typeof e == "object") switch (typeof e.tag == "number" && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), e.$$typeof) {
				case D: return "Portal";
				case fe: return e.displayName || "Context";
				case de: return (e._context.displayName || "Context") + ".Consumer";
				case pe:
					var t = e.render;
					return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
				case ge: return t = e.displayName || null, t === null ? d(e.type) || "Memo" : t;
				case _e:
					t = e._payload, e = e._init;
					try {
						return d(e(t));
					} catch {}
			}
			return null;
		}
		function f(e) {
			if (e === O) return "<>";
			if (typeof e == "object" && e && e.$$typeof === _e) return "<...>";
			try {
				var t = d(e);
				return t ? "<" + t + ">" : "<...>";
			} catch {
				return "<...>";
			}
		}
		function p() {
			var e = A.A;
			return e === null ? null : e.getOwner();
		}
		function m() {
			return Error("react-stack-top-frame");
		}
		function h(e) {
			if (Ee.call(e, "key")) {
				var t = Object.getOwnPropertyDescriptor(e, "key").get;
				if (t && t.isReactWarning) return !1;
			}
			return e.key !== void 0;
		}
		function g(e, t) {
			function n() {
				Oe || (Oe = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", t));
			}
			n.isReactWarning = !0, Object.defineProperty(e, "key", {
				get: n,
				configurable: !0
			});
		}
		function _() {
			var e = d(this.type);
			return Ae[e] || (Ae[e] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release.")), e = this.props.ref, e === void 0 ? null : e;
		}
		function v(e, t, n, r, i, a) {
			var o = n.ref;
			return e = {
				$$typeof: ce,
				type: e,
				key: t,
				props: n,
				_owner: r
			}, (o === void 0 ? null : o) === null ? Object.defineProperty(e, "ref", {
				enumerable: !1,
				value: null
			}) : Object.defineProperty(e, "ref", {
				enumerable: !1,
				get: _
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
		function y(e, t) {
			return t = v(e.type, t, e.props, e._owner, e._debugStack, e._debugTask), e._store && (t._store.validated = e._store.validated), t;
		}
		function b(e) {
			x(e) ? e._store && (e._store.validated = 1) : typeof e == "object" && e && e.$$typeof === _e && (e._payload.status === "fulfilled" ? x(e._payload.value) && e._payload.value._store && (e._payload.value._store.validated = 1) : e._store && (e._store.validated = 1));
		}
		function x(e) {
			return typeof e == "object" && !!e && e.$$typeof === ce;
		}
		function ee(e) {
			var t = {
				"=": "=0",
				":": "=2"
			};
			return "$" + e.replace(/[=:]/g, function(e) {
				return t[e];
			});
		}
		function S(e, t) {
			return typeof e == "object" && e && e.key != null ? (u(e.key), ee("" + e.key)) : t.toString(36);
		}
		function C(e) {
			switch (e.status) {
				case "fulfilled": return e.value;
				case "rejected": throw e.reason;
				default: switch (typeof e.status == "string" ? e.then(c, c) : (e.status = "pending", e.then(function(t) {
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
		function te(e, t, n, i, a) {
			var o = typeof e;
			(o === "undefined" || o === "boolean") && (e = null);
			var s = !1;
			if (e === null) s = !0;
			else switch (o) {
				case "bigint":
				case "string":
				case "number":
					s = !0;
					break;
				case "object": switch (e.$$typeof) {
					case ce:
					case D:
						s = !0;
						break;
					case _e: return s = e._init, te(s(e._payload), t, n, i, a);
				}
			}
			if (s) {
				s = e, a = a(s);
				var c = i === "" ? "." + S(s, 0) : i;
				return we(a) ? (n = "", c != null && (n = c.replace(Pe, "$&/") + "/"), te(a, t, n, "", function(e) {
					return e;
				})) : a != null && (x(a) && (a.key != null && (s && s.key === a.key || u(a.key)), n = y(a, n + (a.key == null || s && s.key === a.key ? "" : ("" + a.key).replace(Pe, "$&/") + "/") + c), i !== "" && s != null && x(s) && s.key == null && s._store && !s._store.validated && (n._store.validated = 2), a = n), t.push(a)), 1;
			}
			if (s = 0, c = i === "" ? "." : i + ":", we(e)) for (var l = 0; l < e.length; l++) i = e[l], o = c + S(i, l), s += te(i, t, n, o, a);
			else if (l = r(e), typeof l == "function") for (l === e.entries && (Ne || console.warn("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), Ne = !0), e = l.call(e), l = 0; !(i = e.next()).done;) i = i.value, o = c + S(i, l++), s += te(i, t, n, o, a);
			else if (o === "object") {
				if (typeof e.then == "function") return te(C(e), t, n, i, a);
				throw t = String(e), Error("Objects are not valid as a React child (found: " + (t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t) + "). If you meant to render a collection of children, use an array instead.");
			}
			return s;
		}
		function ne(e, t, n) {
			if (e == null) return e;
			var r = [], i = 0;
			return te(e, r, "", "", function(e) {
				return t.call(n, e, i++);
			}), r;
		}
		function re(e) {
			if (e._status === -1) {
				var t = e._ioInfo;
				t != null && (t.start = t.end = performance.now()), t = e._result;
				var n = t();
				if (n.then(function(t) {
					if (e._status === 0 || e._status === -1) {
						e._status = 1, e._result = t;
						var r = e._ioInfo;
						r != null && (r.end = performance.now()), n.status === void 0 && (n.status = "fulfilled", n.value = t);
					}
				}, function(t) {
					if (e._status === 0 || e._status === -1) {
						e._status = 2, e._result = t;
						var r = e._ioInfo;
						r != null && (r.end = performance.now()), n.status === void 0 && (n.status = "rejected", n.reason = t);
					}
				}), t = e._ioInfo, t != null) {
					t.value = n;
					var r = n.displayName;
					typeof r == "string" && (t.name = r);
				}
				e._status === -1 && (e._status = 0, e._result = n);
			}
			if (e._status === 1) return t = e._result, t === void 0 && console.error("lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?", t), "default" in t || console.error("lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))", t), t.default;
			throw e._result;
		}
		function w() {
			var e = A.H;
			return e === null && console.error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."), e;
		}
		function ie() {
			A.asyncTransitions--;
		}
		function T(e) {
			if (Le === null) try {
				var n = ("require" + Math.random()).slice(0, 7);
				Le = (t && t[n]).call(t, "timers").setImmediate;
			} catch {
				Le = function(e) {
					!1 === Ie && (Ie = !0, typeof MessageChannel > "u" && console.error("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
					var t = new MessageChannel();
					t.port1.onmessage = e, t.port2.postMessage(void 0);
				};
			}
			return Le(e);
		}
		function ae(e) {
			return 1 < e.length && typeof AggregateError == "function" ? AggregateError(e) : e[0];
		}
		function oe(e, t) {
			t !== Re - 1 && console.error("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "), Re = t;
		}
		function E(e, t, n) {
			var r = A.actQueue;
			if (r !== null) if (r.length !== 0) try {
				se(r), T(function() {
					return E(e, t, n);
				});
				return;
			} catch (e) {
				A.thrownErrors.push(e);
			}
			else A.actQueue = null;
			0 < A.thrownErrors.length ? (r = ae(A.thrownErrors), A.thrownErrors.length = 0, n(r)) : t(e);
		}
		function se(e) {
			if (!Be) {
				Be = !0;
				var t = 0;
				try {
					for (; t < e.length; t++) {
						var n = e[t];
						do {
							A.didUsePromise = !1;
							var r = n(!1);
							if (r !== null) {
								if (A.didUsePromise) {
									e[t] = n, e.splice(0, t);
									return;
								}
								n = r;
							} else break;
						} while (1);
					}
					e.length = 0;
				} catch (n) {
					e.splice(0, t + 1), A.thrownErrors.push(n);
				} finally {
					Be = !1;
				}
			}
		}
		typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
		var ce = Symbol.for("react.transitional.element"), D = Symbol.for("react.portal"), O = Symbol.for("react.fragment"), le = Symbol.for("react.strict_mode"), ue = Symbol.for("react.profiler"), de = Symbol.for("react.consumer"), fe = Symbol.for("react.context"), pe = Symbol.for("react.forward_ref"), me = Symbol.for("react.suspense"), he = Symbol.for("react.suspense_list"), ge = Symbol.for("react.memo"), _e = Symbol.for("react.lazy"), ve = Symbol.for("react.activity"), ye = Symbol.iterator, be = {}, xe = {
			isMounted: function() {
				return !1;
			},
			enqueueForceUpdate: function(e) {
				i(e, "forceUpdate");
			},
			enqueueReplaceState: function(e) {
				i(e, "replaceState");
			},
			enqueueSetState: function(e) {
				i(e, "setState");
			}
		}, k = Object.assign, Se = {};
		Object.freeze(Se), a.prototype.isReactComponent = {}, a.prototype.setState = function(e, t) {
			if (typeof e != "object" && typeof e != "function" && e != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
			this.updater.enqueueSetState(this, e, t, "setState");
		}, a.prototype.forceUpdate = function(e) {
			this.updater.enqueueForceUpdate(this, e, "forceUpdate");
		};
		var Ce = {
			isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
			replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
		};
		for (He in Ce) Ce.hasOwnProperty(He) && n(He, Ce[He]);
		o.prototype = a.prototype, Ce = s.prototype = new o(), Ce.constructor = s, k(Ce, a.prototype), Ce.isPureReactComponent = !0;
		var we = Array.isArray, Te = Symbol.for("react.client.reference"), A = {
			H: null,
			A: null,
			T: null,
			S: null,
			actQueue: null,
			asyncTransitions: 0,
			isBatchingLegacy: !1,
			didScheduleLegacyUpdate: !1,
			didUsePromise: !1,
			thrownErrors: [],
			getCurrentStack: null,
			recentlyCreatedOwnerStacks: 0
		}, Ee = Object.prototype.hasOwnProperty, De = console.createTask ? console.createTask : function() {
			return null;
		};
		Ce = { react_stack_bottom_frame: function(e) {
			return e();
		} };
		var Oe, ke, Ae = {}, je = Ce.react_stack_bottom_frame.bind(Ce, m)(), Me = De(f(m)), Ne = !1, Pe = /\/+/g, Fe = typeof reportError == "function" ? reportError : function(e) {
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
		}, Ie = !1, Le = null, Re = 0, ze = !1, Be = !1, Ve = typeof queueMicrotask == "function" ? function(e) {
			queueMicrotask(function() {
				return queueMicrotask(e);
			});
		} : T;
		Ce = Object.freeze({
			__proto__: null,
			c: function(e) {
				return w().useMemoCache(e);
			}
		});
		var He = {
			map: ne,
			forEach: function(e, t, n) {
				ne(e, function() {
					t.apply(this, arguments);
				}, n);
			},
			count: function(e) {
				var t = 0;
				return ne(e, function() {
					t++;
				}), t;
			},
			toArray: function(e) {
				return ne(e, function(e) {
					return e;
				}) || [];
			},
			only: function(e) {
				if (!x(e)) throw Error("React.Children.only expected to receive a single React element child.");
				return e;
			}
		};
		e.Activity = ve, e.Children = He, e.Component = a, e.Fragment = O, e.Profiler = ue, e.PureComponent = s, e.StrictMode = le, e.Suspense = me, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = A, e.__COMPILER_RUNTIME = Ce, e.act = function(e) {
			var t = A.actQueue, n = Re;
			Re++;
			var r = A.actQueue = t === null ? [] : t, i = !1;
			try {
				var a = e();
			} catch (e) {
				A.thrownErrors.push(e);
			}
			if (0 < A.thrownErrors.length) throw oe(t, n), e = ae(A.thrownErrors), A.thrownErrors.length = 0, e;
			if (typeof a == "object" && a && typeof a.then == "function") {
				var o = a;
				return Ve(function() {
					i || ze || (ze = !0, console.error("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
				}), { then: function(e, a) {
					i = !0, o.then(function(i) {
						if (oe(t, n), n === 0) {
							try {
								se(r), T(function() {
									return E(i, e, a);
								});
							} catch (e) {
								A.thrownErrors.push(e);
							}
							if (0 < A.thrownErrors.length) {
								var o = ae(A.thrownErrors);
								A.thrownErrors.length = 0, a(o);
							}
						} else e(i);
					}, function(e) {
						oe(t, n), 0 < A.thrownErrors.length ? (e = ae(A.thrownErrors), A.thrownErrors.length = 0, a(e)) : a(e);
					});
				} };
			}
			var s = a;
			if (oe(t, n), n === 0 && (se(r), r.length !== 0 && Ve(function() {
				i || ze || (ze = !0, console.error("A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"));
			}), A.actQueue = null), 0 < A.thrownErrors.length) throw e = ae(A.thrownErrors), A.thrownErrors.length = 0, e;
			return { then: function(e, t) {
				i = !0, n === 0 ? (A.actQueue = r, T(function() {
					return E(s, e, t);
				})) : e(s);
			} };
		}, e.cache = function(e) {
			return function() {
				return e.apply(null, arguments);
			};
		}, e.cacheSignal = function() {
			return null;
		}, e.captureOwnerStack = function() {
			var e = A.getCurrentStack;
			return e === null ? null : e();
		}, e.cloneElement = function(e, t, n) {
			if (e == null) throw Error("The argument must be a React element, but you passed " + e + ".");
			var r = k({}, e.props), i = e.key, a = e._owner;
			if (t != null) {
				var o;
				a: {
					if (Ee.call(t, "ref") && (o = Object.getOwnPropertyDescriptor(t, "ref").get) && o.isReactWarning) {
						o = !1;
						break a;
					}
					o = t.ref !== void 0;
				}
				for (s in o && (a = p()), h(t) && (u(t.key), i = "" + t.key), t) !Ee.call(t, s) || s === "key" || s === "__self" || s === "__source" || s === "ref" && t.ref === void 0 || (r[s] = t[s]);
			}
			var s = arguments.length - 2;
			if (s === 1) r.children = n;
			else if (1 < s) {
				o = Array(s);
				for (var c = 0; c < s; c++) o[c] = arguments[c + 2];
				r.children = o;
			}
			for (r = v(e.type, i, r, a, e._debugStack, e._debugTask), i = 2; i < arguments.length; i++) b(arguments[i]);
			return r;
		}, e.createContext = function(e) {
			return e = {
				$$typeof: fe,
				_currentValue: e,
				_currentValue2: e,
				_threadCount: 0,
				Provider: null,
				Consumer: null
			}, e.Provider = e, e.Consumer = {
				$$typeof: de,
				_context: e
			}, e._currentRenderer = null, e._currentRenderer2 = null, e;
		}, e.createElement = function(e, t, n) {
			for (var r = 2; r < arguments.length; r++) b(arguments[r]);
			r = {};
			var i = null;
			if (t != null) for (c in ke || !("__self" in t) || "key" in t || (ke = !0, console.warn("Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform")), h(t) && (u(t.key), i = "" + t.key), t) Ee.call(t, c) && c !== "key" && c !== "__self" && c !== "__source" && (r[c] = t[c]);
			var a = arguments.length - 2;
			if (a === 1) r.children = n;
			else if (1 < a) {
				for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
				Object.freeze && Object.freeze(o), r.children = o;
			}
			if (e && e.defaultProps) for (c in a = e.defaultProps, a) r[c] === void 0 && (r[c] = a[c]);
			i && g(r, typeof e == "function" ? e.displayName || e.name || "Unknown" : e);
			var c = 1e4 > A.recentlyCreatedOwnerStacks++;
			return v(e, i, r, p(), c ? Error("react-stack-top-frame") : je, c ? De(f(e)) : Me);
		}, e.createRef = function() {
			var e = { current: null };
			return Object.seal(e), e;
		}, e.forwardRef = function(e) {
			e != null && e.$$typeof === ge ? console.error("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof e == "function" ? e.length !== 0 && e.length !== 2 && console.error("forwardRef render functions accept exactly two parameters: props and ref. %s", e.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined.") : console.error("forwardRef requires a render function but was given %s.", e === null ? "null" : typeof e), e != null && e.defaultProps != null && console.error("forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?");
			var t = {
				$$typeof: pe,
				render: e
			}, n;
			return Object.defineProperty(t, "displayName", {
				enumerable: !1,
				configurable: !0,
				get: function() {
					return n;
				},
				set: function(t) {
					n = t, e.name || e.displayName || (Object.defineProperty(e, "name", { value: t }), e.displayName = t);
				}
			}), t;
		}, e.isValidElement = x, e.lazy = function(e) {
			e = {
				_status: -1,
				_result: e
			};
			var t = {
				$$typeof: _e,
				_payload: e,
				_init: re
			}, n = {
				name: "lazy",
				start: -1,
				end: -1,
				value: null,
				owner: null,
				debugStack: Error("react-stack-top-frame"),
				debugTask: console.createTask ? console.createTask("lazy()") : null
			};
			return e._ioInfo = n, t._debugInfo = [{ awaited: n }], t;
		}, e.memo = function(e, t) {
			e ?? console.error("memo: The first argument must be a component. Instead received: %s", e === null ? "null" : typeof e), t = {
				$$typeof: ge,
				type: e,
				compare: t === void 0 ? null : t
			};
			var n;
			return Object.defineProperty(t, "displayName", {
				enumerable: !1,
				configurable: !0,
				get: function() {
					return n;
				},
				set: function(t) {
					n = t, e.name || e.displayName || (Object.defineProperty(e, "name", { value: t }), e.displayName = t);
				}
			}), t;
		}, e.startTransition = function(e) {
			var t = A.T, n = {};
			n._updatedFibers = /* @__PURE__ */ new Set(), A.T = n;
			try {
				var r = e(), i = A.S;
				i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && (A.asyncTransitions++, r.then(ie, ie), r.then(c, Fe));
			} catch (e) {
				Fe(e);
			} finally {
				t === null && n._updatedFibers && (e = n._updatedFibers.size, n._updatedFibers.clear(), 10 < e && console.warn("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table.")), t !== null && n.types !== null && (t.types !== null && t.types !== n.types && console.error("We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."), t.types = n.types), A.T = t;
			}
		}, e.unstable_useCacheRefresh = function() {
			return w().useCacheRefresh();
		}, e.use = function(e) {
			return w().use(e);
		}, e.useActionState = function(e, t, n) {
			return w().useActionState(e, t, n);
		}, e.useCallback = function(e, t) {
			return w().useCallback(e, t);
		}, e.useContext = function(e) {
			var t = w();
			return e.$$typeof === de && console.error("Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"), t.useContext(e);
		}, e.useDebugValue = function(e, t) {
			return w().useDebugValue(e, t);
		}, e.useDeferredValue = function(e, t) {
			return w().useDeferredValue(e, t);
		}, e.useEffect = function(e, t) {
			return e ?? console.warn("React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?"), w().useEffect(e, t);
		}, e.useEffectEvent = function(e) {
			return w().useEffectEvent(e);
		}, e.useId = function() {
			return w().useId();
		}, e.useImperativeHandle = function(e, t, n) {
			return w().useImperativeHandle(e, t, n);
		}, e.useInsertionEffect = function(e, t) {
			return e ?? console.warn("React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?"), w().useInsertionEffect(e, t);
		}, e.useLayoutEffect = function(e, t) {
			return e ?? console.warn("React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?"), w().useLayoutEffect(e, t);
		}, e.useMemo = function(e, t) {
			return w().useMemo(e, t);
		}, e.useOptimistic = function(e, t) {
			return w().useOptimistic(e, t);
		}, e.useReducer = function(e, t, n) {
			return w().useReducer(e, t, n);
		}, e.useRef = function(e) {
			return w().useRef(e);
		}, e.useState = function(e) {
			return w().useState(e);
		}, e.useSyncExternalStore = function(e, t, n) {
			return w().useSyncExternalStore(e, t, n);
		}, e.useTransition = function() {
			return w().useTransition();
		}, e.version = "19.2.6", typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
	})();
})), d = /* @__PURE__ */ o(((e, t) => {
	process.env.NODE_ENV === "production" ? t.exports = l() : t.exports = u();
})), f = /* @__PURE__ */ o(((e) => {
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
		if (h = !1, b(e), !m) if (n(c) !== null) m = !0, ee || (ee = !0, w());
		else {
			var t = n(l);
			t !== null && ae(x, t.startTime - e);
		}
	}
	var ee = !1, S = -1, C = 5, te = -1;
	function ne() {
		return g ? !0 : !(e.unstable_now() - te < C);
	}
	function re() {
		if (g = !1, ee) {
			var t = e.unstable_now();
			te = t;
			var i = !0;
			try {
				a: {
					m = !1, h && (h = !1, v(S), S = -1), p = !0;
					var a = f;
					try {
						b: {
							for (b(t), d = n(c); d !== null && !(d.expirationTime > t && ne());) {
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
								u !== null && ae(x, u.startTime - t), i = !1;
							}
						}
						break a;
					} finally {
						d = null, f = a, p = !1;
					}
					i = void 0;
				}
			} finally {
				i ? w() : ee = !1;
			}
		}
	}
	var w;
	if (typeof y == "function") w = function() {
		y(re);
	};
	else if (typeof MessageChannel < "u") {
		var ie = new MessageChannel(), T = ie.port2;
		ie.port1.onmessage = re, w = function() {
			T.postMessage(null);
		};
	} else w = function() {
		_(re, 0);
	};
	function ae(t, n) {
		S = _(function() {
			t(e.unstable_now());
		}, n);
	}
	e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(e) {
		e.callback = null;
	}, e.unstable_forceFrameRate = function(e) {
		0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : C = 0 < e ? Math.floor(1e3 / e) : 5;
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
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(S), S = -1) : h = !0, ae(x, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, ee || (ee = !0, w()))), r;
	}, e.unstable_shouldYield = ne, e.unstable_wrapCallback = function(e) {
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
})), p = /* @__PURE__ */ o(((e) => {
	process.env.NODE_ENV !== "production" && (function() {
		function t() {
			if (x = !1, te) {
				var t = e.unstable_now();
				w = t;
				var n = !0;
				try {
					a: {
						y = !1, b && (b = !1, S(ne), ne = -1), v = !0;
						var a = _;
						try {
							b: {
								for (o(t), g = r(p); g !== null && !(g.expirationTime > t && c());) {
									var u = g.callback;
									if (typeof u == "function") {
										g.callback = null, _ = g.priorityLevel;
										var d = u(g.expirationTime <= t);
										if (t = e.unstable_now(), typeof d == "function") {
											g.callback = d, o(t), n = !0;
											break b;
										}
										g === r(p) && i(p), o(t);
									} else i(p);
									g = r(p);
								}
								if (g !== null) n = !0;
								else {
									var f = r(m);
									f !== null && l(s, f.startTime - t), n = !1;
								}
							}
							break a;
						} finally {
							g = null, _ = a, v = !1;
						}
						n = void 0;
					}
				} finally {
					n ? ie() : te = !1;
				}
			}
		}
		function n(e, t) {
			var n = e.length;
			e.push(t);
			a: for (; 0 < n;) {
				var r = n - 1 >>> 1, i = e[r];
				if (0 < a(i, t)) e[r] = t, e[n] = i, n = r;
				else break a;
			}
		}
		function r(e) {
			return e.length === 0 ? null : e[0];
		}
		function i(e) {
			if (e.length === 0) return null;
			var t = e[0], n = e.pop();
			if (n !== t) {
				e[0] = n;
				a: for (var r = 0, i = e.length, o = i >>> 1; r < o;) {
					var s = 2 * (r + 1) - 1, c = e[s], l = s + 1, u = e[l];
					if (0 > a(c, n)) l < i && 0 > a(u, c) ? (e[r] = u, e[l] = n, r = l) : (e[r] = c, e[s] = n, r = s);
					else if (l < i && 0 > a(u, n)) e[r] = u, e[l] = n, r = l;
					else break a;
				}
			}
			return t;
		}
		function a(e, t) {
			var n = e.sortIndex - t.sortIndex;
			return n === 0 ? e.id - t.id : n;
		}
		function o(e) {
			for (var t = r(m); t !== null;) {
				if (t.callback === null) i(m);
				else if (t.startTime <= e) i(m), t.sortIndex = t.expirationTime, n(p, t);
				else break;
				t = r(m);
			}
		}
		function s(e) {
			if (b = !1, o(e), !y) if (r(p) !== null) y = !0, te || (te = !0, ie());
			else {
				var t = r(m);
				t !== null && l(s, t.startTime - e);
			}
		}
		function c() {
			return x ? !0 : !(e.unstable_now() - w < re);
		}
		function l(t, n) {
			ne = ee(function() {
				t(e.unstable_now());
			}, n);
		}
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error()), e.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
			var u = performance;
			e.unstable_now = function() {
				return u.now();
			};
		} else {
			var d = Date, f = d.now();
			e.unstable_now = function() {
				return d.now() - f;
			};
		}
		var p = [], m = [], h = 1, g = null, _ = 3, v = !1, y = !1, b = !1, x = !1, ee = typeof setTimeout == "function" ? setTimeout : null, S = typeof clearTimeout == "function" ? clearTimeout : null, C = typeof setImmediate < "u" ? setImmediate : null, te = !1, ne = -1, re = 5, w = -1;
		if (typeof C == "function") var ie = function() {
			C(t);
		};
		else if (typeof MessageChannel < "u") {
			var T = new MessageChannel(), ae = T.port2;
			T.port1.onmessage = t, ie = function() {
				ae.postMessage(null);
			};
		} else ie = function() {
			ee(t, 0);
		};
		e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(e) {
			e.callback = null;
		}, e.unstable_forceFrameRate = function(e) {
			0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : re = 0 < e ? Math.floor(1e3 / e) : 5;
		}, e.unstable_getCurrentPriorityLevel = function() {
			return _;
		}, e.unstable_next = function(e) {
			switch (_) {
				case 1:
				case 2:
				case 3:
					var t = 3;
					break;
				default: t = _;
			}
			var n = _;
			_ = t;
			try {
				return e();
			} finally {
				_ = n;
			}
		}, e.unstable_requestPaint = function() {
			x = !0;
		}, e.unstable_runWithPriority = function(e, t) {
			switch (e) {
				case 1:
				case 2:
				case 3:
				case 4:
				case 5: break;
				default: e = 3;
			}
			var n = _;
			_ = e;
			try {
				return t();
			} finally {
				_ = n;
			}
		}, e.unstable_scheduleCallback = function(t, i, a) {
			var o = e.unstable_now();
			switch (typeof a == "object" && a ? (a = a.delay, a = typeof a == "number" && 0 < a ? o + a : o) : a = o, t) {
				case 1:
					var c = -1;
					break;
				case 2:
					c = 250;
					break;
				case 5:
					c = 1073741823;
					break;
				case 4:
					c = 1e4;
					break;
				default: c = 5e3;
			}
			return c = a + c, t = {
				id: h++,
				callback: i,
				priorityLevel: t,
				startTime: a,
				expirationTime: c,
				sortIndex: -1
			}, a > o ? (t.sortIndex = a, n(m, t), r(p) === null && t === r(m) && (b ? (S(ne), ne = -1) : b = !0, l(s, a - o))) : (t.sortIndex = c, n(p, t), y || v || (y = !0, te || (te = !0, ie()))), t;
		}, e.unstable_shouldYield = c, e.unstable_wrapCallback = function(e) {
			var t = _;
			return function() {
				var n = _;
				_ = t;
				try {
					return e.apply(this, arguments);
				} finally {
					_ = n;
				}
			};
		}, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
	})();
})), m = /* @__PURE__ */ o(((e, t) => {
	process.env.NODE_ENV === "production" ? t.exports = f() : t.exports = p();
})), h = /* @__PURE__ */ o(((e) => {
	var t = d();
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
})), g = /* @__PURE__ */ o(((e) => {
	process.env.NODE_ENV !== "production" && (function() {
		function t() {}
		function n(e) {
			return "" + e;
		}
		function r(e, t, r) {
			var i = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
			try {
				n(i);
				var a = !1;
			} catch {
				a = !0;
			}
			return a && (console.error("The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", typeof Symbol == "function" && Symbol.toStringTag && i[Symbol.toStringTag] || i.constructor.name || "Object"), n(i)), {
				$$typeof: u,
				key: i == null ? null : "" + i,
				children: e,
				containerInfo: t,
				implementation: r
			};
		}
		function i(e, t) {
			if (e === "font") return "";
			if (typeof t == "string") return t === "use-credentials" ? t : "";
		}
		function a(e) {
			return e === null ? "`null`" : e === void 0 ? "`undefined`" : e === "" ? "an empty string" : "something with type \"" + typeof e + "\"";
		}
		function o(e) {
			return e === null ? "`null`" : e === void 0 ? "`undefined`" : e === "" ? "an empty string" : typeof e == "string" ? JSON.stringify(e) : typeof e == "number" ? "`" + e + "`" : "something with type \"" + typeof e + "\"";
		}
		function s() {
			var e = f.H;
			return e === null && console.error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."), e;
		}
		typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
		var c = d(), l = {
			d: {
				f: t,
				r: function() {
					throw Error("Invalid form element. requestFormReset must be passed a form that was rendered by React.");
				},
				D: t,
				C: t,
				L: t,
				m: t,
				X: t,
				S: t,
				M: t
			},
			p: 0,
			findDOMNode: null
		}, u = Symbol.for("react.portal"), f = c.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
		typeof Map == "function" && Map.prototype != null && typeof Map.prototype.forEach == "function" && typeof Set == "function" && Set.prototype != null && typeof Set.prototype.clear == "function" && typeof Set.prototype.forEach == "function" || console.error("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = l, e.createPortal = function(e, t) {
			var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
			if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11) throw Error("Target container is not a DOM element.");
			return r(e, t, null, n);
		}, e.flushSync = function(e) {
			var t = f.T, n = l.p;
			try {
				if (f.T = null, l.p = 2, e) return e();
			} finally {
				f.T = t, l.p = n, l.d.f() && console.error("flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task.");
			}
		}, e.preconnect = function(e, t) {
			typeof e == "string" && e ? t != null && typeof t != "object" ? console.error("ReactDOM.preconnect(): Expected the `options` argument (second) to be an object but encountered %s instead. The only supported option at this time is `crossOrigin` which accepts a string.", o(t)) : t != null && typeof t.crossOrigin != "string" && console.error("ReactDOM.preconnect(): Expected the `crossOrigin` option (second argument) to be a string but encountered %s instead. Try removing this option or passing a string value instead.", a(t.crossOrigin)) : console.error("ReactDOM.preconnect(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.", a(e)), typeof e == "string" && (t ? (t = t.crossOrigin, t = typeof t == "string" ? t === "use-credentials" ? t : "" : void 0) : t = null, l.d.C(e, t));
		}, e.prefetchDNS = function(e) {
			if (typeof e != "string" || !e) console.error("ReactDOM.prefetchDNS(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.", a(e));
			else if (1 < arguments.length) {
				var t = arguments[1];
				typeof t == "object" && t.hasOwnProperty("crossOrigin") ? console.error("ReactDOM.prefetchDNS(): Expected only one argument, `href`, but encountered %s as a second argument instead. This argument is reserved for future options and is currently disallowed. It looks like the you are attempting to set a crossOrigin property for this DNS lookup hint. Browsers do not perform DNS queries using CORS and setting this attribute on the resource hint has no effect. Try calling ReactDOM.prefetchDNS() with just a single string argument, `href`.", o(t)) : console.error("ReactDOM.prefetchDNS(): Expected only one argument, `href`, but encountered %s as a second argument instead. This argument is reserved for future options and is currently disallowed. Try calling ReactDOM.prefetchDNS() with just a single string argument, `href`.", o(t));
			}
			typeof e == "string" && l.d.D(e);
		}, e.preinit = function(e, t) {
			if (typeof e == "string" && e ? typeof t != "object" || !t ? console.error("ReactDOM.preinit(): Expected the `options` argument (second) to be an object with an `as` property describing the type of resource to be preinitialized but encountered %s instead.", o(t)) : t.as !== "style" && t.as !== "script" && console.error("ReactDOM.preinit(): Expected the `as` property in the `options` argument (second) to contain a valid value describing the type of resource to be preinitialized but encountered %s instead. Valid values for `as` are \"style\" and \"script\".", o(t.as)) : console.error("ReactDOM.preinit(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.", a(e)), typeof e == "string" && t && typeof t.as == "string") {
				var n = t.as, r = i(n, t.crossOrigin), s = typeof t.integrity == "string" ? t.integrity : void 0, c = typeof t.fetchPriority == "string" ? t.fetchPriority : void 0;
				n === "style" ? l.d.S(e, typeof t.precedence == "string" ? t.precedence : void 0, {
					crossOrigin: r,
					integrity: s,
					fetchPriority: c
				}) : n === "script" && l.d.X(e, {
					crossOrigin: r,
					integrity: s,
					fetchPriority: c,
					nonce: typeof t.nonce == "string" ? t.nonce : void 0
				});
			}
		}, e.preinitModule = function(e, t) {
			var n = "";
			if (typeof e == "string" && e || (n += " The `href` argument encountered was " + a(e) + "."), t !== void 0 && typeof t != "object" ? n += " The `options` argument encountered was " + a(t) + "." : t && "as" in t && t.as !== "script" && (n += " The `as` option encountered was " + o(t.as) + "."), n) console.error("ReactDOM.preinitModule(): Expected up to two arguments, a non-empty `href` string and, optionally, an `options` object with a valid `as` property.%s", n);
			else switch (n = t && typeof t.as == "string" ? t.as : "script", n) {
				case "script": break;
				default: n = o(n), console.error("ReactDOM.preinitModule(): Currently the only supported \"as\" type for this function is \"script\" but received \"%s\" instead. This warning was generated for `href` \"%s\". In the future other module types will be supported, aligning with the import-attributes proposal. Learn more here: (https://github.com/tc39/proposal-import-attributes)", n, e);
			}
			typeof e == "string" && (typeof t == "object" && t ? (t.as == null || t.as === "script") && (n = i(t.as, t.crossOrigin), l.d.M(e, {
				crossOrigin: n,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0
			})) : t ?? l.d.M(e));
		}, e.preload = function(e, t) {
			var n = "";
			if (typeof e == "string" && e || (n += " The `href` argument encountered was " + a(e) + "."), typeof t != "object" || !t ? n += " The `options` argument encountered was " + a(t) + "." : typeof t.as == "string" && t.as || (n += " The `as` option encountered was " + a(t.as) + "."), n && console.error("ReactDOM.preload(): Expected two arguments, a non-empty `href` string and an `options` object with an `as` property valid for a `<link rel=\"preload\" as=\"...\" />` tag.%s", n), typeof e == "string" && typeof t == "object" && t && typeof t.as == "string") {
				n = t.as;
				var r = i(n, t.crossOrigin);
				l.d.L(e, n, {
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
			var n = "";
			typeof e == "string" && e || (n += " The `href` argument encountered was " + a(e) + "."), t !== void 0 && typeof t != "object" ? n += " The `options` argument encountered was " + a(t) + "." : t && "as" in t && typeof t.as != "string" && (n += " The `as` option encountered was " + a(t.as) + "."), n && console.error("ReactDOM.preloadModule(): Expected two arguments, a non-empty `href` string and, optionally, an `options` object with an `as` property valid for a `<link rel=\"modulepreload\" as=\"...\" />` tag.%s", n), typeof e == "string" && (t ? (n = i(t.as, t.crossOrigin), l.d.m(e, {
				as: typeof t.as == "string" && t.as !== "script" ? t.as : void 0,
				crossOrigin: n,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0
			})) : l.d.m(e));
		}, e.requestFormReset = function(e) {
			l.d.r(e);
		}, e.unstable_batchedUpdates = function(e, t) {
			return e(t);
		}, e.useFormState = function(e, t, n) {
			return s().useFormState(e, t, n);
		}, e.useFormStatus = function() {
			return s().useHostTransitionStatus();
		}, e.version = "19.2.6", typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
	})();
})), _ = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
			if (process.env.NODE_ENV !== "production") throw Error("^_^");
			try {
				__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
			} catch (e) {
				console.error(e);
			}
		}
	}
	process.env.NODE_ENV === "production" ? (n(), t.exports = h()) : t.exports = g();
})), v = /* @__PURE__ */ o(((e) => {
	var t = m(), n = d(), r = _();
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
	function u(e) {
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
	function f(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e;
		for (e = e.child; e !== null;) {
			if (t = f(e), t !== null) return t;
			e = e.sibling;
		}
		return null;
	}
	var p = Object.assign, h = Symbol.for("react.element"), g = Symbol.for("react.transitional.element"), v = Symbol.for("react.portal"), y = Symbol.for("react.fragment"), b = Symbol.for("react.strict_mode"), x = Symbol.for("react.profiler"), ee = Symbol.for("react.consumer"), S = Symbol.for("react.context"), C = Symbol.for("react.forward_ref"), te = Symbol.for("react.suspense"), ne = Symbol.for("react.suspense_list"), re = Symbol.for("react.memo"), w = Symbol.for("react.lazy"), ie = Symbol.for("react.activity"), T = Symbol.for("react.memo_cache_sentinel"), ae = Symbol.iterator;
	function oe(e) {
		return typeof e != "object" || !e ? null : (e = ae && e[ae] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var E = Symbol.for("react.client.reference");
	function se(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === E ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case y: return "Fragment";
			case x: return "Profiler";
			case b: return "StrictMode";
			case te: return "Suspense";
			case ne: return "SuspenseList";
			case ie: return "Activity";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case v: return "Portal";
			case S: return e.displayName || "Context";
			case ee: return (e._context.displayName || "Context") + ".Consumer";
			case C:
				var t = e.render;
				return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case re: return t = e.displayName || null, t === null ? se(e.type) || "Memo" : t;
			case w:
				t = e._payload, e = e._init;
				try {
					return se(e(t));
				} catch {}
		}
		return null;
	}
	var ce = Array.isArray, D = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, O = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, le = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, ue = [], de = -1;
	function fe(e) {
		return { current: e };
	}
	function pe(e) {
		0 > de || (e.current = ue[de], ue[de] = null, de--);
	}
	function me(e, t) {
		de++, ue[de] = e.current, e.current = t;
	}
	var he = fe(null), ge = fe(null), _e = fe(null), ve = fe(null);
	function ye(e, t) {
		switch (me(_e, t), me(ge, e), me(he, null), t.nodeType) {
			case 9:
			case 11:
				e = (e = t.documentElement) && (e = e.namespaceURI) ? tf(e) : 0;
				break;
			default: if (e = t.tagName, t = t.namespaceURI) t = tf(t), e = nf(t, e);
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
		pe(he), me(he, e);
	}
	function be() {
		pe(he), pe(ge), pe(_e);
	}
	function xe(e) {
		e.memoizedState !== null && me(ve, e);
		var t = he.current, n = nf(t, e.type);
		t !== n && (me(ge, e), me(he, n));
	}
	function k(e) {
		ge.current === e && (pe(he), pe(ge)), ve.current === e && (pe(ve), up._currentValue = le);
	}
	var Se, Ce;
	function we(e) {
		if (Se === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			Se = t && t[1] || "", Ce = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + Se + e + Ce;
	}
	var Te = !1;
	function A(e, t) {
		if (!e || Te) return "";
		Te = !0;
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
			Te = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? we(n) : "";
	}
	function Ee(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return we(e.type);
			case 16: return we("Lazy");
			case 13: return e.child !== t && t !== null ? we("Suspense Fallback") : we("Suspense");
			case 19: return we("SuspenseList");
			case 0:
			case 15: return A(e.type, !1);
			case 11: return A(e.type.render, !1);
			case 1: return A(e.type, !0);
			case 31: return we("Activity");
			default: return "";
		}
	}
	function De(e) {
		try {
			var t = "", n = null;
			do
				t += Ee(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var Oe = Object.prototype.hasOwnProperty, ke = t.unstable_scheduleCallback, Ae = t.unstable_cancelCallback, je = t.unstable_shouldYield, Me = t.unstable_requestPaint, Ne = t.unstable_now, Pe = t.unstable_getCurrentPriorityLevel, Fe = t.unstable_ImmediatePriority, Ie = t.unstable_UserBlockingPriority, Le = t.unstable_NormalPriority, Re = t.unstable_LowPriority, ze = t.unstable_IdlePriority, Be = t.log, Ve = t.unstable_setDisableYieldValue, He = null, Ue = null;
	function We(e) {
		if (typeof Be == "function" && Ve(e), Ue && typeof Ue.setStrictMode == "function") try {
			Ue.setStrictMode(He, e);
		} catch {}
	}
	var Ge = Math.clz32 ? Math.clz32 : Je, Ke = Math.log, qe = Math.LN2;
	function Je(e) {
		return e >>>= 0, e === 0 ? 32 : 31 - (Ke(e) / qe | 0) | 0;
	}
	var Ye = 256, Xe = 262144, Ze = 4194304;
	function Qe(e) {
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
	function $e(e, t, n) {
		var r = e.pendingLanes;
		if (r === 0) return 0;
		var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
		e = e.warmLanes;
		var s = r & 134217727;
		return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = Qe(n))) : i = Qe(o) : i = Qe(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = Qe(n))) : i = Qe(o)) : i = Qe(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
	}
	function et(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function tt(e, t) {
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
	function nt() {
		var e = Ze;
		return Ze <<= 1, !(Ze & 62914560) && (Ze = 4194304), e;
	}
	function rt(e) {
		for (var t = [], n = 0; 31 > n; n++) t.push(e);
		return t;
	}
	function it(e, t) {
		e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
	}
	function at(e, t, n, r, i, a) {
		var o = e.pendingLanes;
		e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
		var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
		for (n = o & ~n; 0 < n;) {
			var u = 31 - Ge(n), d = 1 << u;
			s[u] = 0, c[u] = -1;
			var f = l[u];
			if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
				var p = f[u];
				p !== null && (p.lane &= -536870913);
			}
			n &= ~d;
		}
		r !== 0 && ot(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
	}
	function ot(e, t, n) {
		e.pendingLanes |= t, e.suspendedLanes &= ~t;
		var r = 31 - Ge(t);
		e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
	}
	function st(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - Ge(n), i = 1 << r;
			i & t | e[r] & t && (e[r] |= t), n &= ~i;
		}
	}
	function ct(e, t) {
		var n = t & -t;
		return n = n & 42 ? 1 : lt(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
	}
	function lt(e) {
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
	function ut(e) {
		return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
	}
	function dt() {
		var e = O.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : Ep(e.type)) : e;
	}
	function ft(e, t) {
		var n = O.p;
		try {
			return O.p = e, t();
		} finally {
			O.p = n;
		}
	}
	var pt = Math.random().toString(36).slice(2), mt = "__reactFiber$" + pt, ht = "__reactProps$" + pt, gt = "__reactContainer$" + pt, _t = "__reactEvents$" + pt, vt = "__reactListeners$" + pt, yt = "__reactHandles$" + pt, bt = "__reactResources$" + pt, xt = "__reactMarker$" + pt;
	function St(e) {
		delete e[mt], delete e[ht], delete e[_t], delete e[vt], delete e[yt];
	}
	function Ct(e) {
		var t = e[mt];
		if (t) return t;
		for (var n = e.parentNode; n;) {
			if (t = n[gt] || n[mt]) {
				if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = Tf(e); e !== null;) {
					if (n = e[mt]) return n;
					e = Tf(e);
				}
				return t;
			}
			e = n, n = e.parentNode;
		}
		return null;
	}
	function wt(e) {
		if (e = e[mt] || e[gt]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function Tt(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(i(33));
	}
	function Et(e) {
		var t = e[bt];
		return t ||= e[bt] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}, t;
	}
	function Dt(e) {
		e[xt] = !0;
	}
	var Ot = /* @__PURE__ */ new Set(), kt = {};
	function At(e, t) {
		jt(e, t), jt(e + "Capture", t);
	}
	function jt(e, t) {
		for (kt[e] = t, e = 0; e < t.length; e++) Ot.add(t[e]);
	}
	var Mt = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Nt = {}, Pt = {};
	function Ft(e) {
		return Oe.call(Pt, e) ? !0 : Oe.call(Nt, e) ? !1 : Mt.test(e) ? Pt[e] = !0 : (Nt[e] = !0, !1);
	}
	function It(e, t, n) {
		if (Ft(t)) if (n === null) e.removeAttribute(t);
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
	function Lt(e, t, n) {
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
	function Rt(e, t, n, r) {
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
	function zt(e) {
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
	function Bt(e) {
		var t = e.type;
		return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
	}
	function Vt(e, t, n) {
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
	function Ht(e) {
		if (!e._valueTracker) {
			var t = Bt(e) ? "checked" : "value";
			e._valueTracker = Vt(e, t, "" + e[t]);
		}
	}
	function Ut(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = Bt(e) ? e.checked ? "true" : "false" : e.value), e = r, e === n ? !1 : (t.setValue(e), !0);
	}
	function Wt(e) {
		if (e ||= typeof document < "u" ? document : void 0, e === void 0) return null;
		try {
			return e.activeElement || e.body;
		} catch {
			return e.body;
		}
	}
	var Gt = /[\n"\\]/g;
	function Kt(e) {
		return e.replace(Gt, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function qt(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + zt(t)) : e.value !== "" + zt(t) && (e.value = "" + zt(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : Yt(e, o, zt(n)) : Yt(e, o, zt(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + zt(s) : e.removeAttribute("name");
	}
	function Jt(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				Ht(e);
				return;
			}
			n = n == null ? "" : "" + zt(n), t = t == null ? n : "" + zt(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r ??= i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), Ht(e);
	}
	function Yt(e, t, n) {
		t === "number" && Wt(e.ownerDocument) === e || e.defaultValue === "" + n || (e.defaultValue = "" + n);
	}
	function Xt(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + zt(n), t = null, i = 0; i < e.length; i++) {
				if (e[i].value === n) {
					e[i].selected = !0, r && (e[i].defaultSelected = !0);
					return;
				}
				t !== null || e[i].disabled || (t = e[i]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function Zt(e, t, n) {
		if (t != null && (t = "" + zt(t), t !== e.value && (e.value = t), n == null)) {
			e.defaultValue !== t && (e.defaultValue = t);
			return;
		}
		e.defaultValue = n == null ? "" : "" + zt(n);
	}
	function Qt(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(i(92));
				if (ce(r)) {
					if (1 < r.length) throw Error(i(93));
					r = r[0];
				}
				n = r;
			}
			n ??= "", t = n;
		}
		n = zt(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), Ht(e);
	}
	function $t(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var en = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function tn(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || en.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function nn(e, t, n) {
		if (t != null && typeof t != "object") throw Error(i(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "");
			for (var a in t) r = t[a], t.hasOwnProperty(a) && n[a] !== r && tn(e, a, r);
		} else for (var o in t) t.hasOwnProperty(o) && tn(e, o, t[o]);
	}
	function rn(e) {
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
	var an = new Map([
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
	]), on = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function sn(e) {
		return on.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function cn() {}
	var ln = null;
	function un(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var dn = null, fn = null;
	function pn(e) {
		var t = wt(e);
		if (t && (e = t.stateNode)) {
			var n = e[ht] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (qt(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + Kt("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var a = r[ht] || null;
								if (!a) throw Error(i(90));
								qt(r, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && Ut(r);
					}
					break a;
				case "textarea":
					Zt(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && Xt(e, !!n.multiple, t, !1);
			}
		}
	}
	var mn = !1;
	function hn(e, t, n) {
		if (mn) return e(t, n);
		mn = !0;
		try {
			return e(t);
		} finally {
			if (mn = !1, (dn !== null || fn !== null) && (Mu(), dn && (t = dn, e = fn, fn = dn = null, pn(t), e))) for (t = 0; t < e.length; t++) pn(e[t]);
		}
	}
	function gn(e, t) {
		var n = e.stateNode;
		if (n === null) return null;
		var r = n[ht] || null;
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
	var _n = !(typeof window > "u" || window.document === void 0 || window.document.createElement === void 0), vn = !1;
	if (_n) try {
		var yn = {};
		Object.defineProperty(yn, "passive", { get: function() {
			vn = !0;
		} }), window.addEventListener("test", yn, yn), window.removeEventListener("test", yn, yn);
	} catch {
		vn = !1;
	}
	var bn = null, xn = null, Sn = null;
	function Cn() {
		if (Sn) return Sn;
		var e, t = xn, n = t.length, r, i = "value" in bn ? bn.value : bn.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return Sn = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function wn(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function Tn() {
		return !0;
	}
	function En() {
		return !1;
	}
	function Dn(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? Tn : En, this.isPropagationStopped = En, this;
		}
		return p(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = Tn);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = Tn);
			},
			persist: function() {},
			isPersistent: Tn
		}), t;
	}
	var On = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, kn = Dn(On), An = p({}, On, {
		view: 0,
		detail: 0
	}), jn = Dn(An), Mn, Nn, Pn, Fn = p({}, An, {
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
		getModifierState: Kn,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== Pn && (Pn && e.type === "mousemove" ? (Mn = e.screenX - Pn.screenX, Nn = e.screenY - Pn.screenY) : Nn = Mn = 0, Pn = e), Mn);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : Nn;
		}
	}), In = Dn(Fn), Ln = Dn(p({}, Fn, { dataTransfer: 0 })), Rn = Dn(p({}, An, { relatedTarget: 0 })), zn = Dn(p({}, On, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Bn = Dn(p({}, On, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), Vn = Dn(p({}, On, { data: 0 })), Hn = {
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
	}, Un = {
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
	}, Wn = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function Gn(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = Wn[e]) ? !!t[e] : !1;
	}
	function Kn() {
		return Gn;
	}
	var qn = Dn(p({}, An, {
		key: function(e) {
			if (e.key) {
				var t = Hn[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = wn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Un[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: Kn,
		charCode: function(e) {
			return e.type === "keypress" ? wn(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? wn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), Jn = Dn(p({}, Fn, {
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
	})), Yn = Dn(p({}, An, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: Kn
	})), Xn = Dn(p({}, On, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Zn = Dn(p({}, Fn, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), Qn = Dn(p({}, On, {
		newState: 0,
		oldState: 0
	})), $n = [
		9,
		13,
		27,
		32
	], er = _n && "CompositionEvent" in window, tr = null;
	_n && "documentMode" in document && (tr = document.documentMode);
	var nr = _n && "TextEvent" in window && !tr, rr = _n && (!er || tr && 8 < tr && 11 >= tr), ir = " ", ar = !1;
	function or(e, t) {
		switch (e) {
			case "keyup": return $n.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function sr(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var cr = !1;
	function lr(e, t) {
		switch (e) {
			case "compositionend": return sr(t);
			case "keypress": return t.which === 32 ? (ar = !0, ir) : null;
			case "textInput": return e = t.data, e === ir && ar ? null : e;
			default: return null;
		}
	}
	function ur(e, t) {
		if (cr) return e === "compositionend" || !er && or(e, t) ? (e = Cn(), Sn = xn = bn = null, cr = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return rr && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var dr = {
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
	function fr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!dr[e.type] : t === "textarea";
	}
	function pr(e, t, n, r) {
		dn ? fn ? fn.push(r) : fn = [r] : dn = r, t = zd(t, "onChange"), 0 < t.length && (n = new kn("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var mr = null, hr = null;
	function gr(e) {
		Md(e, 0);
	}
	function _r(e) {
		if (Ut(Tt(e))) return e;
	}
	function vr(e, t) {
		if (e === "change") return t;
	}
	var yr = !1;
	if (_n) {
		var br;
		if (_n) {
			var xr = "oninput" in document;
			if (!xr) {
				var Sr = document.createElement("div");
				Sr.setAttribute("oninput", "return;"), xr = typeof Sr.oninput == "function";
			}
			br = xr;
		} else br = !1;
		yr = br && (!document.documentMode || 9 < document.documentMode);
	}
	function Cr() {
		mr && (mr.detachEvent("onpropertychange", wr), hr = mr = null);
	}
	function wr(e) {
		if (e.propertyName === "value" && _r(hr)) {
			var t = [];
			pr(t, hr, e, un(e)), hn(gr, t);
		}
	}
	function Tr(e, t, n) {
		e === "focusin" ? (Cr(), mr = t, hr = n, mr.attachEvent("onpropertychange", wr)) : e === "focusout" && Cr();
	}
	function Er(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return _r(hr);
	}
	function Dr(e, t) {
		if (e === "click") return _r(t);
	}
	function Or(e, t) {
		if (e === "input" || e === "change") return _r(t);
	}
	function kr(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var Ar = typeof Object.is == "function" ? Object.is : kr;
	function jr(e, t) {
		if (Ar(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!Oe.call(t, i) || !Ar(e[i], t[i])) return !1;
		}
		return !0;
	}
	function Mr(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function Nr(e, t) {
		var n = Mr(e);
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
			n = Mr(n);
		}
	}
	function Pr(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Pr(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function Fr(e) {
		e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
		for (var t = Wt(e.document); t instanceof e.HTMLIFrameElement;) {
			try {
				var n = typeof t.contentWindow.location.href == "string";
			} catch {
				n = !1;
			}
			if (n) e = t.contentWindow;
			else break;
			t = Wt(e.document);
		}
		return t;
	}
	function Ir(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var Lr = _n && "documentMode" in document && 11 >= document.documentMode, Rr = null, zr = null, Br = null, Vr = !1;
	function Hr(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		Vr || Rr == null || Rr !== Wt(r) || (r = Rr, "selectionStart" in r && Ir(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), Br && jr(Br, r) || (Br = r, r = zd(zr, "onSelect"), 0 < r.length && (t = new kn("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = Rr)));
	}
	function Ur(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var Wr = {
		animationend: Ur("Animation", "AnimationEnd"),
		animationiteration: Ur("Animation", "AnimationIteration"),
		animationstart: Ur("Animation", "AnimationStart"),
		transitionrun: Ur("Transition", "TransitionRun"),
		transitionstart: Ur("Transition", "TransitionStart"),
		transitioncancel: Ur("Transition", "TransitionCancel"),
		transitionend: Ur("Transition", "TransitionEnd")
	}, Gr = {}, Kr = {};
	_n && (Kr = document.createElement("div").style, "AnimationEvent" in window || (delete Wr.animationend.animation, delete Wr.animationiteration.animation, delete Wr.animationstart.animation), "TransitionEvent" in window || delete Wr.transitionend.transition);
	function qr(e) {
		if (Gr[e]) return Gr[e];
		if (!Wr[e]) return e;
		var t = Wr[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in Kr) return Gr[e] = t[n];
		return e;
	}
	var Jr = qr("animationend"), Yr = qr("animationiteration"), Xr = qr("animationstart"), Zr = qr("transitionrun"), Qr = qr("transitionstart"), $r = qr("transitioncancel"), ei = qr("transitionend"), ti = /* @__PURE__ */ new Map(), ni = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	ni.push("scrollEnd");
	function ri(e, t) {
		ti.set(e, t), At(t, [e]);
	}
	var ii = typeof reportError == "function" ? reportError : function(e) {
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
	}, ai = [], oi = 0, si = 0;
	function ci() {
		for (var e = oi, t = si = oi = 0; t < e;) {
			var n = ai[t];
			ai[t++] = null;
			var r = ai[t];
			ai[t++] = null;
			var i = ai[t];
			ai[t++] = null;
			var a = ai[t];
			if (ai[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && fi(n, i, a);
		}
	}
	function li(e, t, n, r) {
		ai[oi++] = e, ai[oi++] = t, ai[oi++] = n, ai[oi++] = r, si |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function ui(e, t, n, r) {
		return li(e, t, n, r), pi(e);
	}
	function di(e, t) {
		return li(e, null, null, t), pi(e);
	}
	function fi(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - Ge(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function pi(e) {
		if (50 < Cu) throw Cu = 0, wu = null, Error(i(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var mi = {};
	function hi(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function gi(e, t, n, r) {
		return new hi(e, t, n, r);
	}
	function _i(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function vi(e, t) {
		var n = e.alternate;
		return n === null ? (n = gi(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 65011712, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function yi(e, t) {
		e.flags &= 65011714;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function bi(e, t, n, r, a, o) {
		var s = 0;
		if (r = e, typeof e == "function") _i(e) && (s = 1);
		else if (typeof e == "string") s = tp(e, n, he.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (e) {
			case ie: return e = gi(31, n, t, a), e.elementType = ie, e.lanes = o, e;
			case y: return xi(n.children, a, o, t);
			case b:
				s = 8, a |= 24;
				break;
			case x: return e = gi(12, n, t, a | 2), e.elementType = x, e.lanes = o, e;
			case te: return e = gi(13, n, t, a), e.elementType = te, e.lanes = o, e;
			case ne: return e = gi(19, n, t, a), e.elementType = ne, e.lanes = o, e;
			default:
				if (typeof e == "object" && e) switch (e.$$typeof) {
					case S:
						s = 10;
						break a;
					case ee:
						s = 9;
						break a;
					case C:
						s = 11;
						break a;
					case re:
						s = 14;
						break a;
					case w:
						s = 16, r = null;
						break a;
				}
				s = 29, n = Error(i(130, e === null ? "null" : typeof e, "")), r = null;
		}
		return t = gi(s, n, t, a), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function xi(e, t, n, r) {
		return e = gi(7, e, r, t), e.lanes = n, e;
	}
	function Si(e, t, n) {
		return e = gi(6, e, null, t), e.lanes = n, e;
	}
	function Ci(e) {
		var t = gi(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function wi(e, t, n) {
		return t = gi(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var Ti = /* @__PURE__ */ new WeakMap();
	function Ei(e, t) {
		if (typeof e == "object" && e) {
			var n = Ti.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: De(t)
			}, Ti.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: De(t)
		};
	}
	var Di = [], Oi = 0, ki = null, Ai = 0, ji = [], Mi = 0, Ni = null, Pi = 1, Fi = "";
	function Ii(e, t) {
		Di[Oi++] = Ai, Di[Oi++] = ki, ki = e, Ai = t;
	}
	function Li(e, t, n) {
		ji[Mi++] = Pi, ji[Mi++] = Fi, ji[Mi++] = Ni, Ni = e;
		var r = Pi;
		e = Fi;
		var i = 32 - Ge(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - Ge(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, Pi = 1 << 32 - Ge(t) + i | n << i | r, Fi = a + e;
		} else Pi = 1 << a | n << i | r, Fi = e;
	}
	function Ri(e) {
		e.return !== null && (Ii(e, 1), Li(e, 1, 0));
	}
	function zi(e) {
		for (; e === ki;) ki = Di[--Oi], Di[Oi] = null, Ai = Di[--Oi], Di[Oi] = null;
		for (; e === Ni;) Ni = ji[--Mi], ji[Mi] = null, Fi = ji[--Mi], ji[Mi] = null, Pi = ji[--Mi], ji[Mi] = null;
	}
	function Bi(e, t) {
		ji[Mi++] = Pi, ji[Mi++] = Fi, ji[Mi++] = Ni, Pi = t.id, Fi = t.overflow, Ni = e;
	}
	var Vi = null, Hi = null, j = !1, Ui = null, Wi = !1, Gi = Error(i(519));
	function Ki(e) {
		throw Qi(Ei(Error(i(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), Gi;
	}
	function qi(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[mt] = e, t[ht] = r, n) {
			case "dialog":
				z("cancel", t), z("close", t);
				break;
			case "iframe":
			case "object":
			case "embed":
				z("load", t);
				break;
			case "video":
			case "audio":
				for (n = 0; n < Ad.length; n++) z(Ad[n], t);
				break;
			case "source":
				z("error", t);
				break;
			case "img":
			case "image":
			case "link":
				z("error", t), z("load", t);
				break;
			case "details":
				z("toggle", t);
				break;
			case "input":
				z("invalid", t), Jt(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				z("invalid", t);
				break;
			case "textarea": z("invalid", t), Qt(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || Gd(t.textContent, n) ? (r.popover != null && (z("beforetoggle", t), z("toggle", t)), r.onScroll != null && z("scroll", t), r.onScrollEnd != null && z("scrollend", t), r.onClick != null && (t.onclick = cn), t = !0) : t = !1, t || Ki(e, !0);
	}
	function Ji(e) {
		for (Vi = e.return; Vi;) switch (Vi.tag) {
			case 5:
			case 31:
			case 13:
				Wi = !1;
				return;
			case 27:
			case 3:
				Wi = !0;
				return;
			default: Vi = Vi.return;
		}
	}
	function Yi(e) {
		if (e !== Vi) return !1;
		if (!j) return Ji(e), j = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = !(n !== "form" && n !== "button") || rf(e.type, e.memoizedProps)), n = !n), n && Hi && Ki(e), Ji(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			Hi = wf(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			Hi = wf(e);
		} else t === 27 ? (t = Hi, ff(e.type) ? (e = Cf, Cf = null, Hi = e) : Hi = t) : Hi = Vi ? Sf(e.stateNode.nextSibling) : null;
		return !0;
	}
	function Xi() {
		Hi = Vi = null, j = !1;
	}
	function Zi() {
		var e = Ui;
		return e !== null && (lu === null ? lu = e : lu.push.apply(lu, e), Ui = null), e;
	}
	function Qi(e) {
		Ui === null ? Ui = [e] : Ui.push(e);
	}
	var $i = fe(null), ea = null, ta = null;
	function na(e, t, n) {
		me($i, t._currentValue), t._currentValue = n;
	}
	function ra(e) {
		e._currentValue = $i.current, pe($i);
	}
	function ia(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function aa(e, t, n, r) {
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
						o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), ia(o.return, n, e), r || (s = null);
						break a;
					}
					o = c.next;
				}
			} else if (a.tag === 18) {
				if (s = a.return, s === null) throw Error(i(341));
				s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), ia(s, n, e), s = null;
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
	function oa(e, t, n, r) {
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
					Ar(a.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (a === ve.current) {
				if (s = a.alternate, s === null) throw Error(i(387));
				s.memoizedState.memoizedState !== a.memoizedState.memoizedState && (e === null ? e = [up] : e.push(up));
			}
			a = a.return;
		}
		e !== null && aa(t, e, n, r), t.flags |= 262144;
	}
	function sa(e) {
		for (e = e.firstContext; e !== null;) {
			if (!Ar(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function ca(e) {
		ea = e, ta = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function la(e) {
		return da(ea, e);
	}
	function ua(e, t) {
		return ea === null && ca(e), da(e, t);
	}
	function da(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, ta === null) {
			if (e === null) throw Error(i(308));
			ta = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else ta = ta.next = t;
		return n;
	}
	var fa = typeof AbortController < "u" ? AbortController : function() {
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
	}, pa = t.unstable_scheduleCallback, ma = t.unstable_NormalPriority, ha = {
		$$typeof: S,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function ga() {
		return {
			controller: new fa(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function _a(e) {
		e.refCount--, e.refCount === 0 && pa(ma, function() {
			e.controller.abort();
		});
	}
	var va = null, M = 0, N = 0, ya = null;
	function ba(e, t) {
		if (va === null) {
			var n = va = [];
			M = 0, N = wd(), ya = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return M++, t.then(xa, xa), t;
	}
	function xa() {
		if (--M === 0 && va !== null) {
			ya !== null && (ya.status = "fulfilled");
			var e = va;
			va = null, N = 0, ya = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function Sa(e, t) {
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
	var Ca = D.S;
	D.S = function(e, t) {
		fu = Ne(), typeof t == "object" && t && typeof t.then == "function" && ba(e, t), Ca !== null && Ca(e, t);
	};
	var wa = fe(null);
	function Ta() {
		var e = wa.current;
		return e === null ? Yl.pooledCache : e;
	}
	function Ea(e, t) {
		t === null ? me(wa, wa.current) : me(wa, t.pool);
	}
	function Da() {
		var e = Ta();
		return e === null ? null : {
			parent: ha._currentValue,
			pool: e
		};
	}
	var Oa = Error(i(460)), ka = Error(i(474)), Aa = Error(i(542)), ja = { then: function() {} };
	function Ma(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function Na(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(cn, cn), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, La(e), e;
			default:
				if (typeof t.status == "string") t.then(cn, cn);
				else {
					if (e = Yl, e !== null && 100 < e.shellSuspendCounter) throw Error(i(482));
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
					case "rejected": throw e = t.reason, La(e), e;
				}
				throw Fa = t, Oa;
		}
	}
	function Pa(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (Fa = e, Oa) : e;
		}
	}
	var Fa = null;
	function Ia() {
		if (Fa === null) throw Error(i(459));
		var e = Fa;
		return Fa = null, e;
	}
	function La(e) {
		if (e === Oa || e === Aa) throw Error(i(483));
	}
	var Ra = null, za = 0;
	function Ba(e) {
		var t = za;
		return za += 1, Ra === null && (Ra = []), Na(Ra, e, t);
	}
	function Va(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function Ha(e, t) {
		throw t.$$typeof === h ? Error(i(525)) : (e = Object.prototype.toString.call(t), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function Ua(e) {
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
			return e = vi(e, t), e.index = 0, e.sibling = null, e;
		}
		function o(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 67108866, n) : (r = r.index, r < n ? (t.flags |= 67108866, n) : r)) : (t.flags |= 1048576, n);
		}
		function s(t) {
			return e && t.alternate === null && (t.flags |= 67108866), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = Si(n, e.mode, r), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var i = n.type;
			return i === y ? d(e, t, n.props.children, r, n.key) : t !== null && (t.elementType === i || typeof i == "object" && i && i.$$typeof === w && Pa(i) === t.type) ? (t = a(t, n.props), Va(t, n), t.return = e, t) : (t = bi(n.type, n.key, n.props, null, e.mode, r), Va(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = wi(n, e.mode, r), t.return = e, t) : (t = a(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, i) {
			return t === null || t.tag !== 7 ? (t = xi(n, e.mode, r, i), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = Si("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case g: return n = bi(t.type, t.key, t.props, null, e.mode, n), Va(n, t), n.return = e, n;
					case v: return t = wi(t, e.mode, n), t.return = e, t;
					case w: return t = Pa(t), f(e, t, n);
				}
				if (ce(t) || oe(t)) return t = xi(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, Ba(t), n);
				if (t.$$typeof === S) return f(e, ua(e, t), n);
				Ha(e, t);
			}
			return null;
		}
		function p(e, t, n, r) {
			var i = t === null ? null : t.key;
			if (typeof n == "string" && n !== "" || typeof n == "number" || typeof n == "bigint") return i === null ? c(e, t, "" + n, r) : null;
			if (typeof n == "object" && n) {
				switch (n.$$typeof) {
					case g: return n.key === i ? l(e, t, n, r) : null;
					case v: return n.key === i ? u(e, t, n, r) : null;
					case w: return n = Pa(n), p(e, t, n, r);
				}
				if (ce(n) || oe(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, Ba(n), r);
				if (n.$$typeof === S) return p(e, t, ua(e, n), r);
				Ha(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case g: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case v: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case w: return r = Pa(r), m(e, t, n, r, i);
				}
				if (ce(r) || oe(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, Ba(r), i);
				if (r.$$typeof === S) return m(e, t, n, ua(t, r), i);
				Ha(t, r);
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
			if (h === s.length) return n(i, d), j && Ii(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return j && Ii(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && g.alternate !== null && d.delete(g.key === null ? h : g.key), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), j && Ii(i, h), l;
		}
		function _(a, s, c, l) {
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
			if (v.done) return n(a, h), j && Ii(a, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(a, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return j && Ii(a, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, a, g, v.value, l), v !== null && (e && v.alternate !== null && h.delete(v.key === null ? g : v.key), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(a, e);
			}), j && Ii(a, g), u;
		}
		function b(e, r, o, c) {
			if (typeof o == "object" && o && o.type === y && o.key === null && (o = o.props.children), typeof o == "object" && o) {
				switch (o.$$typeof) {
					case g:
						a: {
							for (var l = o.key; r !== null;) {
								if (r.key === l) {
									if (l = o.type, l === y) {
										if (r.tag === 7) {
											n(e, r.sibling), c = a(r, o.props.children), c.return = e, e = c;
											break a;
										}
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === w && Pa(l) === r.type) {
										n(e, r.sibling), c = a(r, o.props), Va(c, o), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								} else t(e, r);
								r = r.sibling;
							}
							o.type === y ? (c = xi(o.props.children, e.mode, c, o.key), c.return = e, e = c) : (c = bi(o.type, o.key, o.props, null, e.mode, c), Va(c, o), c.return = e, e = c);
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
							c = wi(o, e.mode, c), c.return = e, e = c;
						}
						return s(e);
					case w: return o = Pa(o), b(e, r, o, c);
				}
				if (ce(o)) return h(e, r, o, c);
				if (oe(o)) {
					if (l = oe(o), typeof l != "function") throw Error(i(150));
					return o = l.call(o), _(e, r, o, c);
				}
				if (typeof o.then == "function") return b(e, r, Ba(o), c);
				if (o.$$typeof === S) return b(e, r, ua(e, o), c);
				Ha(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = a(r, o), c.return = e, e = c) : (n(e, r), c = Si(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				za = 0;
				var i = b(e, t, n, r);
				return Ra = null, i;
			} catch (t) {
				if (t === Oa || t === Aa) throw t;
				var a = gi(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var Wa = Ua(!0), Ga = Ua(!1), Ka = !1;
	function qa(e) {
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
	function Ja(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function Ya(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function Xa(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, Jl & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = pi(e), fi(e, null, n), t;
		}
		return li(e, r, t, n), pi(e);
	}
	function Za(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, st(e, n);
		}
	}
	function Qa(e, t) {
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
	var $a = !1;
	function eo() {
		if ($a) {
			var e = ya;
			if (e !== null) throw e;
		}
	}
	function to(e, t, n, r) {
		$a = !1;
		var i = e.updateQueue;
		Ka = !1;
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
				var f = s.lane & -536870913, m = f !== s.lane;
				if (m ? (Xl & f) === f : (r & f) === f) {
					f !== 0 && f === N && ($a = !0), u !== null && (u = u.next = {
						lane: 0,
						tag: s.tag,
						payload: s.payload,
						callback: null,
						next: null
					});
					a: {
						var h = e, g = s;
						f = t;
						var _ = n;
						switch (g.tag) {
							case 1:
								if (h = g.payload, typeof h == "function") {
									d = h.call(_, d, f);
									break a;
								}
								d = h;
								break a;
							case 3: h.flags = h.flags & -65537 | 128;
							case 0:
								if (h = g.payload, f = typeof h == "function" ? h.call(_, d, f) : h, f == null) break a;
								d = p({}, d, f);
								break a;
							case 2: Ka = !0;
						}
					}
					f = s.callback, f !== null && (e.flags |= 64, m && (e.flags |= 8192), m = i.callbacks, m === null ? i.callbacks = [f] : m.push(f));
				} else m = {
					lane: f,
					tag: s.tag,
					payload: s.payload,
					callback: s.callback,
					next: null
				}, u === null ? (l = u = m, c = d) : u = u.next = m, o |= f;
				if (s = s.next, s === null) {
					if (s = i.shared.pending, s === null) break;
					m = s, s = m.next, m.next = null, i.lastBaseUpdate = m, i.shared.pending = null;
				}
			} while (1);
			u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), iu |= o, e.lanes = o, e.memoizedState = d;
		}
	}
	function no(e, t) {
		if (typeof e != "function") throw Error(i(191, e));
		e.call(t);
	}
	function ro(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) no(n[e], t);
	}
	var io = fe(null), ao = fe(0);
	function oo(e, t) {
		e = nu, me(ao, e), me(io, t), nu = e | t.baseLanes;
	}
	function so() {
		me(ao, nu), me(io, io.current);
	}
	function co() {
		nu = ao.current, pe(io), pe(ao);
	}
	var lo = fe(null), uo = null;
	function fo(e) {
		var t = e.alternate;
		me(_o, _o.current & 1), me(lo, e), uo === null && (t === null || io.current !== null || t.memoizedState !== null) && (uo = e);
	}
	function po(e) {
		me(_o, _o.current), me(lo, e), uo === null && (uo = e);
	}
	function mo(e) {
		e.tag === 22 ? (me(_o, _o.current), me(lo, e), uo === null && (uo = e)) : ho(e);
	}
	function ho() {
		me(_o, _o.current), me(lo, lo.current);
	}
	function go(e) {
		pe(lo), uo === e && (uo = null), pe(_o);
	}
	var _o = fe(0);
	function P(e) {
		for (var t = e; t !== null;) {
			if (t.tag === 13) {
				var n = t.memoizedState;
				if (n !== null && (n = n.dehydrated, n === null || yf(n) || bf(n))) return t;
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
	var vo = 0, F = null, I = null, yo = null, bo = !1, xo = !1, So = !1, Co = 0, wo = 0, To = null, Eo = 0;
	function Do() {
		throw Error(i(321));
	}
	function Oo(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!Ar(e[n], t[n])) return !1;
		return !0;
	}
	function ko(e, t, n, r, i, a) {
		return vo = a, F = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, D.H = e === null || e.memoizedState === null ? Ks : qs, So = !1, a = n(r, i), So = !1, xo && (a = jo(t, n, r, i)), Ao(e), a;
	}
	function Ao(e) {
		D.H = Gs;
		var t = I !== null && I.next !== null;
		if (vo = 0, yo = I = F = null, bo = !1, wo = 0, To = null, t) throw Error(i(300));
		e === null || uc || (e = e.dependencies, e !== null && sa(e) && (uc = !0));
	}
	function jo(e, t, n, r) {
		F = e;
		var a = 0;
		do {
			if (xo && (To = null), wo = 0, xo = !1, 25 <= a) throw Error(i(301));
			if (a += 1, yo = I = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			D.H = Js, o = t(n, r);
		} while (xo);
		return o;
	}
	function Mo() {
		var e = D.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? zo(t) : t, e = e.useState()[0], (I === null ? null : I.memoizedState) !== e && (F.flags |= 1024), t;
	}
	function No() {
		var e = Co !== 0;
		return Co = 0, e;
	}
	function Po(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function Fo(e) {
		if (bo) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			bo = !1;
		}
		vo = 0, yo = I = F = null, xo = !1, wo = Co = 0, To = null;
	}
	function Io() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return yo === null ? F.memoizedState = yo = e : yo = yo.next = e, yo;
	}
	function Lo() {
		if (I === null) {
			var e = F.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = I.next;
		var t = yo === null ? F.memoizedState : yo.next;
		if (t !== null) yo = t, I = e;
		else {
			if (e === null) throw F.alternate === null ? Error(i(467)) : Error(i(310));
			I = e, e = {
				memoizedState: I.memoizedState,
				baseState: I.baseState,
				baseQueue: I.baseQueue,
				queue: I.queue,
				next: null
			}, yo === null ? F.memoizedState = yo = e : yo = yo.next = e;
		}
		return yo;
	}
	function Ro() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function zo(e) {
		var t = wo;
		return wo += 1, To === null && (To = []), e = Na(To, e, t), t = F, (yo === null ? t.memoizedState : yo.next) === null && (t = t.alternate, D.H = t === null || t.memoizedState === null ? Ks : qs), e;
	}
	function Bo(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return zo(e);
			if (e.$$typeof === S) return la(e);
		}
		throw Error(i(438, String(e)));
	}
	function Vo(e) {
		var t = null, n = F.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = F.alternate;
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
		}, n === null && (n = Ro(), F.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = T;
		return t.index++, n;
	}
	function Ho(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function Uo(e) {
		return Wo(Lo(), I, e);
	}
	function Wo(e, t, n) {
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
				if (f === u.lane ? (vo & f) === f : (Xl & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === N && (d = !0);
					else if ((vo & p) === p) {
						u = u.next, p === N && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, s = o) : l = l.next = f, F.lanes |= p, iu |= p;
					f = u.action, So && n(o, f), o = u.hasEagerState ? u.eagerState : n(o, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, s = o) : l = l.next = p, F.lanes |= f, iu |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? s = o : l.next = c, !Ar(o, e.memoizedState) && (uc = !0, d && (n = ya, n !== null))) throw n;
			e.memoizedState = o, e.baseState = s, e.baseQueue = l, r.lastRenderedState = o;
		}
		return a === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function Go(e) {
		var t = Lo(), n = t.queue;
		if (n === null) throw Error(i(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, a = n.pending, o = t.memoizedState;
		if (a !== null) {
			n.pending = null;
			var s = a = a.next;
			do
				o = e(o, s.action), s = s.next;
			while (s !== a);
			Ar(o, t.memoizedState) || (uc = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function Ko(e, t, n) {
		var r = F, a = Lo(), o = j;
		if (o) {
			if (n === void 0) throw Error(i(407));
			n = n();
		} else n = t();
		var s = !Ar((I || a).memoizedState, n);
		if (s && (a.memoizedState = n, uc = !0), a = a.queue, _s(Yo.bind(null, r, a, e), [e]), a.getSnapshot !== t || s || yo !== null && yo.memoizedState.tag & 1) {
			if (r.flags |= 2048, fs(9, { destroy: void 0 }, Jo.bind(null, r, a, n, t), null), Yl === null) throw Error(i(349));
			o || vo & 127 || qo(r, t, n);
		}
		return n;
	}
	function qo(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = F.updateQueue, t === null ? (t = Ro(), F.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function Jo(e, t, n, r) {
		t.value = n, t.getSnapshot = r, Xo(t) && Zo(e);
	}
	function Yo(e, t, n) {
		return n(function() {
			Xo(t) && Zo(e);
		});
	}
	function Xo(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !Ar(e, n);
		} catch {
			return !0;
		}
	}
	function Zo(e) {
		var t = di(e, 2);
		t !== null && Du(t, e, 2);
	}
	function Qo(e) {
		var t = Io();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), So) {
				We(!0);
				try {
					n();
				} finally {
					We(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: Ho,
			lastRenderedState: e
		}, t;
	}
	function $o(e, t, n, r) {
		return e.baseState = n, Wo(e, I, typeof r == "function" ? r : Ho);
	}
	function es(e, t, n, r, a) {
		if (Hs(e)) throw Error(i(485));
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
			D.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, ts(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function ts(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = D.T, o = {};
			D.T = o;
			try {
				var s = n(i, r), c = D.S;
				c !== null && c(o, s), ns(e, t, s);
			} catch (n) {
				is(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), D.T = a;
			}
		} else try {
			a = n(i, r), ns(e, t, a);
		} catch (n) {
			is(e, t, n);
		}
	}
	function ns(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			rs(e, t, n);
		}, function(n) {
			return is(e, t, n);
		}) : rs(e, t, n);
	}
	function rs(e, t, n) {
		t.status = "fulfilled", t.value = n, as(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, ts(e, n)));
	}
	function is(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, as(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function as(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function os(e, t) {
		return t;
	}
	function ss(e, t) {
		if (j) {
			var n = Yl.formState;
			if (n !== null) {
				a: {
					var r = F;
					if (j) {
						if (Hi) {
							b: {
								for (var i = Hi, a = Wi; i.nodeType !== 8;) {
									if (!a) {
										i = null;
										break b;
									}
									if (i = Sf(i.nextSibling), i === null) {
										i = null;
										break b;
									}
								}
								a = i.data, i = a === "F!" || a === "F" ? i : null;
							}
							if (i) {
								Hi = Sf(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						Ki(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = Io(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: os,
			lastRenderedState: t
		}, n.queue = r, n = zs.bind(null, F, r), r.dispatch = n, r = Qo(!1), a = Vs.bind(null, F, !1, r.queue), r = Io(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = es.bind(null, F, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function cs(e) {
		return ls(Lo(), I, e);
	}
	function ls(e, t, n) {
		if (t = Wo(e, t, os)[0], e = Uo(Ho)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = zo(t);
		} catch (e) {
			throw e === Oa ? Aa : e;
		}
		else r = t;
		t = Lo();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (F.flags |= 2048, fs(9, { destroy: void 0 }, us.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function us(e, t) {
		e.action = t;
	}
	function ds(e) {
		var t = Lo(), n = I;
		if (n !== null) return ls(t, n, e);
		Lo(), t = t.memoizedState, n = Lo();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function fs(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = F.updateQueue, t === null && (t = Ro(), F.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function ps() {
		return Lo().memoizedState;
	}
	function ms(e, t, n, r) {
		var i = Io();
		F.flags |= e, i.memoizedState = fs(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function hs(e, t, n, r) {
		var i = Lo();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		I !== null && r !== null && Oo(r, I.memoizedState.deps) ? i.memoizedState = fs(t, a, n, r) : (F.flags |= e, i.memoizedState = fs(1 | t, a, n, r));
	}
	function gs(e, t) {
		ms(8390656, 8, e, t);
	}
	function _s(e, t) {
		hs(2048, 8, e, t);
	}
	function vs(e) {
		F.flags |= 4;
		var t = F.updateQueue;
		if (t === null) t = Ro(), F.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function ys(e) {
		var t = Lo().memoizedState;
		return vs({
			ref: t,
			nextImpl: e
		}), function() {
			if (Jl & 2) throw Error(i(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function bs(e, t) {
		return hs(4, 2, e, t);
	}
	function xs(e, t) {
		return hs(4, 4, e, t);
	}
	function Ss(e, t) {
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
	function Cs(e, t, n) {
		n = n == null ? null : n.concat([e]), hs(4, 4, Ss.bind(null, t, e), n);
	}
	function ws() {}
	function Ts(e, t) {
		var n = Lo();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && Oo(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function Es(e, t) {
		var n = Lo();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && Oo(t, r[1])) return r[0];
		if (r = e(), So) {
			We(!0);
			try {
				e();
			} finally {
				We(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function Ds(e, t, n) {
		return n === void 0 || vo & 1073741824 && !(Xl & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = Eu(), F.lanes |= e, iu |= e, n);
	}
	function Os(e, t, n, r) {
		return Ar(n, t) ? n : io.current === null ? !(vo & 42) || vo & 1073741824 && !(Xl & 261930) ? (uc = !0, e.memoizedState = n) : (e = Eu(), F.lanes |= e, iu |= e, t) : (e = Ds(e, n, r), Ar(e, t) || (uc = !0), e);
	}
	function ks(e, t, n, r, i) {
		var a = O.p;
		O.p = a !== 0 && 8 > a ? a : 8;
		var o = D.T, s = {};
		D.T = s, Vs(e, !1, t, n);
		try {
			var c = i(), l = D.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? Bs(e, t, Sa(c, r), Tu(e)) : Bs(e, t, r, Tu(e));
		} catch (n) {
			Bs(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, Tu());
		} finally {
			O.p = a, o !== null && s.types !== null && (o.types = s.types), D.T = o;
		}
	}
	function As() {}
	function js(e, t, n, r) {
		if (e.tag !== 5) throw Error(i(476));
		var a = Ms(e).queue;
		ks(e, a, t, le, n === null ? As : function() {
			return Ns(e), n(r);
		});
	}
	function Ms(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: le,
			baseState: le,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: Ho,
				lastRenderedState: le
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
				lastRenderedReducer: Ho,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function Ns(e) {
		var t = Ms(e);
		t.next === null && (t = e.alternate.memoizedState), Bs(e, t.next.queue, {}, Tu());
	}
	function Ps() {
		return la(up);
	}
	function Fs() {
		return Lo().memoizedState;
	}
	function Is() {
		return Lo().memoizedState;
	}
	function Ls(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = Tu();
					e = Ya(n);
					var r = Xa(t, e, n);
					r !== null && (Du(r, t, n), Za(r, t, n)), t = { cache: ga() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function Rs(e, t, n) {
		var r = Tu();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, Hs(e) ? Us(t, n) : (n = ui(e, t, n, r), n !== null && (Du(n, e, r), Ws(n, t, r)));
	}
	function zs(e, t, n) {
		Bs(e, t, n, Tu());
	}
	function Bs(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (Hs(e)) Us(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, Ar(s, o)) return li(e, t, i, 0), Yl === null && ci(), !1;
			} catch {}
			if (n = ui(e, t, i, r), n !== null) return Du(n, e, r), Ws(n, t, r), !0;
		}
		return !1;
	}
	function Vs(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: wd(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, Hs(e)) {
			if (t) throw Error(i(479));
		} else t = ui(e, n, r, 2), t !== null && Du(t, e, 2);
	}
	function Hs(e) {
		var t = e.alternate;
		return e === F || t !== null && t === F;
	}
	function Us(e, t) {
		xo = bo = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function Ws(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, st(e, n);
		}
	}
	var Gs = {
		readContext: la,
		use: Bo,
		useCallback: Do,
		useContext: Do,
		useEffect: Do,
		useImperativeHandle: Do,
		useLayoutEffect: Do,
		useInsertionEffect: Do,
		useMemo: Do,
		useReducer: Do,
		useRef: Do,
		useState: Do,
		useDebugValue: Do,
		useDeferredValue: Do,
		useTransition: Do,
		useSyncExternalStore: Do,
		useId: Do,
		useHostTransitionStatus: Do,
		useFormState: Do,
		useActionState: Do,
		useOptimistic: Do,
		useMemoCache: Do,
		useCacheRefresh: Do
	};
	Gs.useEffectEvent = Do;
	var Ks = {
		readContext: la,
		use: Bo,
		useCallback: function(e, t) {
			return Io().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: la,
		useEffect: gs,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), ms(4194308, 4, Ss.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return ms(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			ms(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = Io();
			t = t === void 0 ? null : t;
			var r = e();
			if (So) {
				We(!0);
				try {
					e();
				} finally {
					We(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = Io();
			if (n !== void 0) {
				var i = n(t);
				if (So) {
					We(!0);
					try {
						n(t);
					} finally {
						We(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = Rs.bind(null, F, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = Io();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = Qo(e);
			var t = e.queue, n = zs.bind(null, F, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: ws,
		useDeferredValue: function(e, t) {
			return Ds(Io(), e, t);
		},
		useTransition: function() {
			var e = Qo(!1);
			return e = ks.bind(null, F, e.queue, !0, !1), Io().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = F, a = Io();
			if (j) {
				if (n === void 0) throw Error(i(407));
				n = n();
			} else {
				if (n = t(), Yl === null) throw Error(i(349));
				Xl & 127 || qo(r, t, n);
			}
			a.memoizedState = n;
			var o = {
				value: n,
				getSnapshot: t
			};
			return a.queue = o, gs(Yo.bind(null, r, o, e), [e]), r.flags |= 2048, fs(9, { destroy: void 0 }, Jo.bind(null, r, o, n, t), null), n;
		},
		useId: function() {
			var e = Io(), t = Yl.identifierPrefix;
			if (j) {
				var n = Fi, r = Pi;
				n = (r & ~(1 << 32 - Ge(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = Co++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = Eo++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: Ps,
		useFormState: ss,
		useActionState: ss,
		useOptimistic: function(e) {
			var t = Io();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = Vs.bind(null, F, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: Vo,
		useCacheRefresh: function() {
			return Io().memoizedState = Ls.bind(null, F);
		},
		useEffectEvent: function(e) {
			var t = Io(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (Jl & 2) throw Error(i(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, qs = {
		readContext: la,
		use: Bo,
		useCallback: Ts,
		useContext: la,
		useEffect: _s,
		useImperativeHandle: Cs,
		useInsertionEffect: bs,
		useLayoutEffect: xs,
		useMemo: Es,
		useReducer: Uo,
		useRef: ps,
		useState: function() {
			return Uo(Ho);
		},
		useDebugValue: ws,
		useDeferredValue: function(e, t) {
			return Os(Lo(), I.memoizedState, e, t);
		},
		useTransition: function() {
			var e = Uo(Ho)[0], t = Lo().memoizedState;
			return [typeof e == "boolean" ? e : zo(e), t];
		},
		useSyncExternalStore: Ko,
		useId: Fs,
		useHostTransitionStatus: Ps,
		useFormState: cs,
		useActionState: cs,
		useOptimistic: function(e, t) {
			return $o(Lo(), I, e, t);
		},
		useMemoCache: Vo,
		useCacheRefresh: Is
	};
	qs.useEffectEvent = ys;
	var Js = {
		readContext: la,
		use: Bo,
		useCallback: Ts,
		useContext: la,
		useEffect: _s,
		useImperativeHandle: Cs,
		useInsertionEffect: bs,
		useLayoutEffect: xs,
		useMemo: Es,
		useReducer: Go,
		useRef: ps,
		useState: function() {
			return Go(Ho);
		},
		useDebugValue: ws,
		useDeferredValue: function(e, t) {
			var n = Lo();
			return I === null ? Ds(n, e, t) : Os(n, I.memoizedState, e, t);
		},
		useTransition: function() {
			var e = Go(Ho)[0], t = Lo().memoizedState;
			return [typeof e == "boolean" ? e : zo(e), t];
		},
		useSyncExternalStore: Ko,
		useId: Fs,
		useHostTransitionStatus: Ps,
		useFormState: ds,
		useActionState: ds,
		useOptimistic: function(e, t) {
			var n = Lo();
			return I === null ? (n.baseState = e, [e, n.queue.dispatch]) : $o(n, I, e, t);
		},
		useMemoCache: Vo,
		useCacheRefresh: Is
	};
	Js.useEffectEvent = ys;
	function Ys(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : p({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var Xs = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = Tu(), i = Ya(r);
			i.payload = t, n != null && (i.callback = n), t = Xa(e, i, r), t !== null && (Du(t, e, r), Za(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = Tu(), i = Ya(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = Xa(e, i, r), t !== null && (Du(t, e, r), Za(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = Tu(), r = Ya(n);
			r.tag = 2, t != null && (r.callback = t), t = Xa(e, r, n), t !== null && (Du(t, e, n), Za(t, e, n));
		}
	};
	function Zs(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !jr(n, r) || !jr(i, a) : !0;
	}
	function Qs(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && Xs.enqueueReplaceState(t, t.state, null);
	}
	function $s(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = p({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function ec(e) {
		ii(e);
	}
	function tc(e) {
		console.error(e);
	}
	function nc(e) {
		ii(e);
	}
	function rc(e, t) {
		try {
			var n = e.onUncaughtError;
			n(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function ic(e, t, n) {
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
	function ac(e, t, n) {
		return n = Ya(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			rc(e, t);
		}, n;
	}
	function oc(e) {
		return e = Ya(e), e.tag = 3, e;
	}
	function sc(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				ic(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			ic(t, n, r), typeof i != "function" && (hu === null ? hu = new Set([this]) : hu.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function cc(e, t, n, r, a) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && oa(t, n, a, !0), n = lo.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13: return uo === null ? zu() : n.alternate === null && ru === 0 && (ru = 3), n.flags &= -257, n.flags |= 65536, n.lanes = a, r === ja ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = new Set([r]) : t.add(r), id(e, r, a)), !1;
					case 22: return n.flags |= 65536, r === ja ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = new Set([r]) : n.add(r)), id(e, r, a)), !1;
				}
				throw Error(i(435, n.tag));
			}
			return id(e, r, a), zu(), !1;
		}
		if (j) return t = lo.current, t === null ? (r !== Gi && (t = Error(i(423), { cause: r }), Qi(Ei(t, n))), e = e.current.alternate, e.flags |= 65536, a &= -a, e.lanes |= a, r = Ei(r, n), a = ac(e.stateNode, r, a), Qa(e, a), ru !== 4 && (ru = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = a, r !== Gi && (e = Error(i(422), { cause: r }), Qi(Ei(e, n)))), !1;
		var o = Error(i(520), { cause: r });
		if (o = Ei(o, n), R === null ? R = [o] : R.push(o), ru !== 4 && (ru = 2), t === null) return !0;
		r = Ei(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = a & -a, n.lanes |= e, e = ac(n.stateNode, r, e), Qa(n, e), !1;
				case 1: if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (hu === null || !hu.has(o)))) return n.flags |= 65536, a &= -a, n.lanes |= a, a = oc(a), sc(a, e, n, r), Qa(n, a), !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var lc = Error(i(461)), uc = !1;
	function dc(e, t, n, r) {
		t.child = e === null ? Ga(t, null, n, r) : Wa(t, e.child, n, r);
	}
	function fc(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return ca(t), r = ko(e, t, n, o, a, i), s = No(), e !== null && !uc ? (Po(e, t, i), Ic(e, t, i)) : (j && s && Ri(t), t.flags |= 1, dc(e, t, r, i), t.child);
	}
	function pc(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !_i(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, mc(e, t, a, r, i)) : (e = bi(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !Lc(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? jr : n, n(o, r) && e.ref === t.ref) return Ic(e, t, i);
		}
		return t.flags |= 1, e = vi(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function mc(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (jr(a, r) && e.ref === t.ref) if (uc = !1, t.pendingProps = r = a, Lc(e, i)) e.flags & 131072 && (uc = !0);
			else return t.lanes = e.lanes, Ic(e, t, i);
		}
		return Sc(e, t, n, r, i);
	}
	function hc(e, t, n, r) {
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
				return _c(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && Ea(t, a === null ? null : a.cachePool), a === null ? so() : oo(t, a), mo(t);
			else return r = t.lanes = 536870912, _c(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && Ea(t, null), so(), ho(t)) : (Ea(t, a.cachePool), oo(t, a), ho(t), t.memoizedState = null);
		return dc(e, t, i, n), t.child;
	}
	function gc(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function _c(e, t, n, r, i) {
		var a = Ta();
		return a = a === null ? null : {
			parent: ha._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && Ea(t, null), so(), mo(t), e !== null && oa(e, t, r, !0), t.childLanes = i, null;
	}
	function vc(e, t) {
		return t = jc({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function yc(e, t, n) {
		return Wa(t, e.child, null, n), e = vc(t, t.pendingProps), e.flags |= 2, go(t), t.memoizedState = null, e;
	}
	function bc(e, t, n) {
		var r = t.pendingProps, a = (t.flags & 128) != 0;
		if (t.flags &= -129, e === null) {
			if (j) {
				if (r.mode === "hidden") return e = vc(t, r), t.lanes = 536870912, gc(null, e);
				if (po(t), (e = Hi) ? (e = vf(e, Wi), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Ni === null ? null : {
						id: Pi,
						overflow: Fi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Ci(e), n.return = t, t.child = n, Vi = t, Hi = null)) : e = null, e === null) throw Ki(t);
				return t.lanes = 536870912, null;
			}
			return vc(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (po(t), a) if (t.flags & 256) t.flags &= -257, t = yc(e, t, n);
			else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
			else throw Error(i(558));
			else if (uc || oa(e, t, n, !1), a = (n & e.childLanes) !== 0, uc || a) {
				if (r = Yl, r !== null && (s = ct(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, di(e, s), Du(r, e, s), lc;
				zu(), t = yc(e, t, n);
			} else e = o.treeContext, Hi = Sf(s.nextSibling), Vi = t, j = !0, Ui = null, Wi = !1, e !== null && Bi(t, e), t = vc(t, r), t.flags |= 4096;
			return t;
		}
		return e = vi(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function xc(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(i(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function Sc(e, t, n, r, i) {
		return ca(t), n = ko(e, t, n, r, void 0, i), r = No(), e !== null && !uc ? (Po(e, t, i), Ic(e, t, i)) : (j && r && Ri(t), t.flags |= 1, dc(e, t, n, i), t.child);
	}
	function Cc(e, t, n, r, i, a) {
		return ca(t), t.updateQueue = null, n = jo(t, r, n, i), Ao(e), r = No(), e !== null && !uc ? (Po(e, t, a), Ic(e, t, a)) : (j && r && Ri(t), t.flags |= 1, dc(e, t, n, a), t.child);
	}
	function wc(e, t, n, r, i) {
		if (ca(t), t.stateNode === null) {
			var a = mi, o = n.contextType;
			typeof o == "object" && o && (a = la(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = Xs, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, qa(t), o = n.contextType, a.context = typeof o == "object" && o ? la(o) : mi, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (Ys(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && Xs.enqueueReplaceState(a, a.state, null), to(t, r, a, i), eo(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = $s(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = mi, typeof u == "object" && u && (o = la(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && Qs(t, a, r, o), Ka = !1;
			var f = t.memoizedState;
			a.state = f, to(t, r, a, i), eo(), l = t.memoizedState, s || f !== l || Ka ? (typeof d == "function" && (Ys(t, n, d, r), l = t.memoizedState), (c = Ka || Zs(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, Ja(e, t), o = t.memoizedProps, u = $s(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = mi, typeof l == "object" && l && (c = la(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && Qs(t, a, r, c), Ka = !1, f = t.memoizedState, a.state = f, to(t, r, a, i), eo();
			var p = t.memoizedState;
			o !== d || f !== p || Ka || e !== null && e.dependencies !== null && sa(e.dependencies) ? (typeof s == "function" && (Ys(t, n, s, r), p = t.memoizedState), (u = Ka || Zs(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && sa(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, xc(e, t), r = (t.flags & 128) != 0, a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = Wa(t, e.child, null, i), t.child = Wa(t, null, n, i)) : dc(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = Ic(e, t, i), e;
	}
	function Tc(e, t, n, r) {
		return Xi(), t.flags |= 256, dc(e, t, n, r), t.child;
	}
	var Ec = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function Dc(e) {
		return {
			baseLanes: e,
			cachePool: Da()
		};
	}
	function Oc(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= su), e;
	}
	function kc(e, t, n) {
		var r = t.pendingProps, a = !1, o = (t.flags & 128) != 0, s;
		if ((s = o) || (s = e !== null && e.memoizedState === null ? !1 : (_o.current & 2) != 0), s && (a = !0, t.flags &= -129), s = (t.flags & 32) != 0, t.flags &= -33, e === null) {
			if (j) {
				if (a ? fo(t) : ho(t), (e = Hi) ? (e = vf(e, Wi), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Ni === null ? null : {
						id: Pi,
						overflow: Fi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Ci(e), n.return = t, t.child = n, Vi = t, Hi = null)) : e = null, e === null) throw Ki(t);
				return bf(e) ? t.lanes = 32 : t.lanes = 536870912, null;
			}
			var c = r.children;
			return r = r.fallback, a ? (ho(t), a = t.mode, c = jc({
				mode: "hidden",
				children: c
			}, a), r = xi(r, a, n, null), c.return = t, r.return = t, c.sibling = r, t.child = c, r = t.child, r.memoizedState = Dc(n), r.childLanes = Oc(e, s, n), t.memoizedState = Ec, gc(null, r)) : (fo(t), Ac(t, c));
		}
		var l = e.memoizedState;
		if (l !== null && (c = l.dehydrated, c !== null)) {
			if (o) t.flags & 256 ? (fo(t), t.flags &= -257, t = Mc(e, t, n)) : t.memoizedState === null ? (ho(t), c = r.fallback, a = t.mode, r = jc({
				mode: "visible",
				children: r.children
			}, a), c = xi(c, a, n, null), c.flags |= 2, r.return = t, c.return = t, r.sibling = c, t.child = r, Wa(t, e.child, null, n), r = t.child, r.memoizedState = Dc(n), r.childLanes = Oc(e, s, n), t.memoizedState = Ec, t = gc(null, r)) : (ho(t), t.child = e.child, t.flags |= 128, t = null);
			else if (fo(t), bf(c)) {
				if (s = c.nextSibling && c.nextSibling.dataset, s) var u = s.dgst;
				s = u, r = Error(i(419)), r.stack = "", r.digest = s, Qi({
					value: r,
					source: null,
					stack: null
				}), t = Mc(e, t, n);
			} else if (uc || oa(e, t, n, !1), s = (n & e.childLanes) !== 0, uc || s) {
				if (s = Yl, s !== null && (r = ct(s, n), r !== 0 && r !== l.retryLane)) throw l.retryLane = r, di(e, r), Du(s, e, r), lc;
				yf(c) || zu(), t = Mc(e, t, n);
			} else yf(c) ? (t.flags |= 192, t.child = e.child, t = null) : (e = l.treeContext, Hi = Sf(c.nextSibling), Vi = t, j = !0, Ui = null, Wi = !1, e !== null && Bi(t, e), t = Ac(t, r.children), t.flags |= 4096);
			return t;
		}
		return a ? (ho(t), c = r.fallback, a = t.mode, l = e.child, u = l.sibling, r = vi(l, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = l.subtreeFlags & 65011712, u === null ? (c = xi(c, a, n, null), c.flags |= 2) : c = vi(u, c), c.return = t, r.return = t, r.sibling = c, t.child = r, gc(null, r), r = t.child, c = e.child.memoizedState, c === null ? c = Dc(n) : (a = c.cachePool, a === null ? a = Da() : (l = ha._currentValue, a = a.parent === l ? a : {
			parent: l,
			pool: l
		}), c = {
			baseLanes: c.baseLanes | n,
			cachePool: a
		}), r.memoizedState = c, r.childLanes = Oc(e, s, n), t.memoizedState = Ec, gc(e.child, r)) : (fo(t), n = e.child, e = n.sibling, n = vi(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (s = t.deletions, s === null ? (t.deletions = [e], t.flags |= 16) : s.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function Ac(e, t) {
		return t = jc({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function jc(e, t) {
		return e = gi(22, e, null, t), e.lanes = 0, e;
	}
	function Mc(e, t, n) {
		return Wa(t, e.child, null, n), e = Ac(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function Nc(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), ia(e.return, t, n);
	}
	function Pc(e, t, n, r, i, a) {
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
	function Fc(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = _o.current, s = (o & 2) != 0;
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, me(_o, o), dc(e, t, r, n), r = j ? Ai : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && Nc(e, n, t);
			else if (e.tag === 19) Nc(e, n, t);
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
				for (n = t.child, i = null; n !== null;) e = n.alternate, e !== null && P(e) === null && (i = n), n = n.sibling;
				n = i, n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), Pc(t, !1, i, n, a, r);
				break;
			case "backwards":
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && P(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				Pc(t, !0, n, null, a, r);
				break;
			case "together":
				Pc(t, !1, null, null, void 0, r);
				break;
			default: t.memoizedState = null;
		}
		return t.child;
	}
	function Ic(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), iu |= t.lanes, (n & t.childLanes) === 0) if (e !== null) {
			if (oa(e, t, n, !1), (n & t.childLanes) === 0) return null;
		} else return null;
		if (e !== null && t.child !== e.child) throw Error(i(153));
		if (t.child !== null) {
			for (e = t.child, n = vi(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = vi(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function Lc(e, t) {
		return (e.lanes & t) === 0 ? (e = e.dependencies, !!(e !== null && sa(e))) : !0;
	}
	function Rc(e, t, n) {
		switch (t.tag) {
			case 3:
				ye(t, t.stateNode.containerInfo), na(t, ha, e.memoizedState.cache), Xi();
				break;
			case 27:
			case 5:
				xe(t);
				break;
			case 4:
				ye(t, t.stateNode.containerInfo);
				break;
			case 10:
				na(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, po(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) return r.dehydrated === null ? (n & t.child.childLanes) === 0 ? (fo(t), e = Ic(e, t, n), e === null ? null : e.sibling) : kc(e, t, n) : (fo(t), t.flags |= 128, null);
				fo(t);
				break;
			case 19:
				var i = (e.flags & 128) != 0;
				if (r = (n & t.childLanes) !== 0, r ||= (oa(e, t, n, !1), (n & t.childLanes) !== 0), i) {
					if (r) return Fc(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), me(_o, _o.current), r) break;
				return null;
			case 22: return t.lanes = 0, hc(e, t, n, t.pendingProps);
			case 24: na(t, ha, e.memoizedState.cache);
		}
		return Ic(e, t, n);
	}
	function zc(e, t, n) {
		if (e !== null) if (e.memoizedProps !== t.pendingProps) uc = !0;
		else {
			if (!Lc(e, n) && !(t.flags & 128)) return uc = !1, Rc(e, t, n);
			uc = !!(e.flags & 131072);
		}
		else uc = !1, j && t.flags & 1048576 && Li(t, Ai, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = Pa(t.elementType), t.type = e, typeof e == "function") _i(e) ? (r = $s(e, r), t.tag = 1, t = wc(null, t, e, r, n)) : (t.tag = 0, t = Sc(null, t, e, r, n));
					else {
						if (e != null) {
							var a = e.$$typeof;
							if (a === C) {
								t.tag = 11, t = fc(null, t, e, r, n);
								break a;
							} else if (a === re) {
								t.tag = 14, t = pc(null, t, e, r, n);
								break a;
							}
						}
						throw t = se(e) || e, Error(i(306, t, ""));
					}
				}
				return t;
			case 0: return Sc(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, a = $s(r, t.pendingProps), wc(e, t, r, a, n);
			case 3:
				a: {
					if (ye(t, t.stateNode.containerInfo), e === null) throw Error(i(387));
					r = t.pendingProps;
					var o = t.memoizedState;
					a = o.element, Ja(e, t), to(t, r, null, n);
					var s = t.memoizedState;
					if (r = s.cache, na(t, ha, r), r !== o.cache && aa(t, [ha], n, !0), eo(), r = s.element, o.isDehydrated) if (o = {
						element: r,
						isDehydrated: !1,
						cache: s.cache
					}, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
						t = Tc(e, t, r, n);
						break a;
					} else if (r !== a) {
						a = Ei(Error(i(424)), t), Qi(a), t = Tc(e, t, r, n);
						break a;
					} else {
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (Hi = Sf(e.firstChild), Vi = t, j = !0, Ui = null, Wi = !0, n = Ga(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 4096, n = n.sibling;
					}
					else {
						if (Xi(), r === a) {
							t = Ic(e, t, n);
							break a;
						}
						dc(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return xc(e, t), e === null ? (n = Hf(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : j || (n = t.type, e = t.pendingProps, r = ef(_e.current).createElement(n), r[mt] = t, r[ht] = e, Jd(r, n, e), Dt(r), t.stateNode = r) : t.memoizedState = Hf(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return xe(t), e === null && j && (r = t.stateNode = Ef(t.type, t.pendingProps, _e.current), Vi = t, Wi = !0, a = Hi, ff(t.type) ? (Cf = a, Hi = Sf(r.firstChild)) : Hi = a), dc(e, t, t.pendingProps.children, n), xc(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && j && ((a = r = Hi) && (r = gf(r, t.type, t.pendingProps, Wi), r === null ? a = !1 : (t.stateNode = r, Vi = t, Hi = Sf(r.firstChild), Wi = !1, a = !0)), a || Ki(t)), xe(t), a = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, rf(a, o) ? r = null : s !== null && rf(a, s) && (t.flags |= 32), t.memoizedState !== null && (a = ko(e, t, Mo, null, null, n), up._currentValue = a), xc(e, t), dc(e, t, r, n), t.child;
			case 6: return e === null && j && ((e = n = Hi) && (n = _f(n, t.pendingProps, Wi), n === null ? e = !1 : (t.stateNode = n, Vi = t, Hi = null, e = !0)), e || Ki(t)), null;
			case 13: return kc(e, t, n);
			case 4: return ye(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Wa(t, null, r, n) : dc(e, t, r, n), t.child;
			case 11: return fc(e, t, t.type, t.pendingProps, n);
			case 7: return dc(e, t, t.pendingProps, n), t.child;
			case 8: return dc(e, t, t.pendingProps.children, n), t.child;
			case 12: return dc(e, t, t.pendingProps.children, n), t.child;
			case 10: return r = t.pendingProps, na(t, t.type, r.value), dc(e, t, r.children, n), t.child;
			case 9: return a = t.type._context, r = t.pendingProps.children, ca(t), a = la(a), r = r(a), t.flags |= 1, dc(e, t, r, n), t.child;
			case 14: return pc(e, t, t.type, t.pendingProps, n);
			case 15: return mc(e, t, t.type, t.pendingProps, n);
			case 19: return Fc(e, t, n);
			case 31: return bc(e, t, n);
			case 22: return hc(e, t, n, t.pendingProps);
			case 24: return ca(t), r = la(ha), e === null ? (a = Ta(), a === null && (a = Yl, o = ga(), a.pooledCache = o, o.refCount++, o !== null && (a.pooledCacheLanes |= n), a = o), t.memoizedState = {
				parent: r,
				cache: a
			}, qa(t), na(t, ha, a)) : ((e.lanes & n) !== 0 && (Ja(e, t), to(t, null, null, n), eo()), a = e.memoizedState, o = t.memoizedState, a.parent === r ? (r = o.cache, na(t, ha, r), r !== a.cache && aa(t, [ha], n, !0)) : (a = {
				parent: r,
				cache: r
			}, t.memoizedState = a, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = a), na(t, ha, r))), dc(e, t, t.pendingProps.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(i(156, t.tag));
	}
	function Bc(e) {
		e.flags |= 4;
	}
	function Vc(e, t, n, r, i) {
		if ((t = (e.mode & 32) != 0) && (t = !1), t) {
			if (e.flags |= 16777216, (i & 335544128) === i) if (e.stateNode.complete) e.flags |= 8192;
			else if (Iu()) e.flags |= 8192;
			else throw Fa = ja, ka;
		} else e.flags &= -16777217;
	}
	function Hc(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !np(t)) if (Iu()) e.flags |= 8192;
		else throw Fa = ja, ka;
	}
	function Uc(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : nt(), e.lanes |= t, cu |= t);
	}
	function Wc(e, t) {
		if (!j) switch (e.tailMode) {
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
	function Gc(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 65011712, r |= i.flags & 65011712, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function Kc(e, t, n) {
		var r = t.pendingProps;
		switch (zi(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return Gc(t), null;
			case 1: return Gc(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), ra(ha), be(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (Yi(t) ? Bc(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, Zi())), Gc(t), null;
			case 26:
				var a = t.type, o = t.memoizedState;
				return e === null ? (Bc(t), o === null ? (Gc(t), Vc(t, a, null, r, n)) : (Gc(t), Hc(t, o))) : o ? o === e.memoizedState ? (Gc(t), t.flags &= -16777217) : (Bc(t), Gc(t), Hc(t, o)) : (e = e.memoizedProps, e !== r && Bc(t), Gc(t), Vc(t, a, e, r, n)), null;
			case 27:
				if (k(t), n = _e.current, a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && Bc(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return Gc(t), null;
					}
					e = he.current, Yi(t) ? qi(t, e) : (e = Ef(a, r, n), t.stateNode = e, Bc(t));
				}
				return Gc(t), null;
			case 5:
				if (k(t), a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && Bc(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return Gc(t), null;
					}
					if (o = he.current, Yi(t)) qi(t, o);
					else {
						var s = ef(_e.current);
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
						o[mt] = t, o[ht] = r;
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
						a: switch (Jd(o, a, r), a) {
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
						r && Bc(t);
					}
				}
				return Gc(t), Vc(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && Bc(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(i(166));
					if (e = _e.current, Yi(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, a = Vi, a !== null) switch (a.tag) {
							case 27:
							case 5: r = a.memoizedProps;
						}
						e[mt] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || Gd(e.nodeValue, n)), e || Ki(t, !0);
					} else e = ef(e).createTextNode(r), e[mt] = t, t.stateNode = e;
				}
				return Gc(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = Yi(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(i(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(557));
							e[mt] = t;
						} else Xi(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						Gc(t), e = !1;
					} else n = Zi(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (go(t), t) : (go(t), null);
					if (t.flags & 128) throw Error(i(558));
				}
				return Gc(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (a = Yi(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!a) throw Error(i(318));
							if (a = t.memoizedState, a = a === null ? null : a.dehydrated, !a) throw Error(i(317));
							a[mt] = t;
						} else Xi(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						Gc(t), a = !1;
					} else a = Zi(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), a = !0;
					if (!a) return t.flags & 256 ? (go(t), t) : (go(t), null);
				}
				return go(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, a = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (a = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== a && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), Uc(t, t.updateQueue), Gc(t), null);
			case 4: return be(), e === null && Fd(t.stateNode.containerInfo), Gc(t), null;
			case 10: return ra(t.type), Gc(t), null;
			case 19:
				if (pe(_o), r = t.memoizedState, r === null) return Gc(t), null;
				if (a = (t.flags & 128) != 0, o = r.rendering, o === null) if (a) Wc(r, !1);
				else {
					if (ru !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
						if (o = P(e), o !== null) {
							for (t.flags |= 128, Wc(r, !1), e = o.updateQueue, t.updateQueue = e, Uc(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) yi(n, e), n = n.sibling;
							return me(_o, _o.current & 1 | 2), j && Ii(t, r.treeForkCount), t.child;
						}
						e = e.sibling;
					}
					r.tail !== null && Ne() > pu && (t.flags |= 128, a = !0, Wc(r, !1), t.lanes = 4194304);
				}
				else {
					if (!a) if (e = P(o), e !== null) {
						if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, Uc(t, e), Wc(r, !0), r.tail === null && r.tailMode === "hidden" && !o.alternate && !j) return Gc(t), null;
					} else 2 * Ne() - r.renderingStartTime > pu && n !== 536870912 && (t.flags |= 128, a = !0, Wc(r, !1), t.lanes = 4194304);
					r.isBackwards ? (o.sibling = t.child, t.child = o) : (e = r.last, e === null ? t.child = o : e.sibling = o, r.last = o);
				}
				return r.tail === null ? (Gc(t), null) : (e = r.tail, r.rendering = e, r.tail = e.sibling, r.renderingStartTime = Ne(), e.sibling = null, n = _o.current, me(_o, a ? n & 1 | 2 : n & 1), j && Ii(t, r.treeForkCount), e);
			case 22:
			case 23: return go(t), co(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (Gc(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Gc(t), n = t.updateQueue, n !== null && Uc(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && pe(wa), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), ra(ha), Gc(t), null;
			case 25: return null;
			case 30: return null;
		}
		throw Error(i(156, t.tag));
	}
	function qc(e, t) {
		switch (zi(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return ra(ha), be(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return k(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (go(t), t.alternate === null) throw Error(i(340));
					Xi();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (go(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(i(340));
					Xi();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return pe(_o), null;
			case 4: return be(), null;
			case 10: return ra(t.type), null;
			case 22:
			case 23: return go(t), co(), e !== null && pe(wa), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return ra(ha), null;
			case 25: return null;
			default: return null;
		}
	}
	function Jc(e, t) {
		switch (zi(t), t.tag) {
			case 3:
				ra(ha), be();
				break;
			case 26:
			case 27:
			case 5:
				k(t);
				break;
			case 4:
				be();
				break;
			case 31:
				t.memoizedState !== null && go(t);
				break;
			case 13:
				go(t);
				break;
			case 19:
				pe(_o);
				break;
			case 10:
				ra(t.type);
				break;
			case 22:
			case 23:
				go(t), co(), e !== null && pe(wa);
				break;
			case 24: ra(ha);
		}
	}
	function Yc(e, t) {
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
			rd(t, t.return, e);
		}
	}
	function Xc(e, t, n) {
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
								rd(i, c, e);
							}
						}
					}
					r = r.next;
				} while (r !== a);
			}
		} catch (e) {
			rd(t, t.return, e);
		}
	}
	function Zc(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var n = e.stateNode;
			try {
				ro(t, n);
			} catch (t) {
				rd(e, e.return, t);
			}
		}
	}
	function Qc(e, t, n) {
		n.props = $s(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			rd(e, t, n);
		}
	}
	function $c(e, t) {
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
			rd(e, t, n);
		}
	}
	function el(e, t) {
		var n = e.ref, r = e.refCleanup;
		if (n !== null) if (typeof r == "function") try {
			r();
		} catch (n) {
			rd(e, t, n);
		} finally {
			e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
		}
		else if (typeof n == "function") try {
			n(null);
		} catch (n) {
			rd(e, t, n);
		}
		else n.current = null;
	}
	function tl(e) {
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
			rd(e, e.return, t);
		}
	}
	function nl(e, t, n) {
		try {
			var r = e.stateNode;
			Yd(r, e.type, n, t), r[ht] = t;
		} catch (t) {
			rd(e, e.return, t);
		}
	}
	function rl(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && ff(e.type) || e.tag === 4;
	}
	function il(e) {
		a: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || rl(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && ff(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function al(e, t, n) {
		var r = e.tag;
		if (r === 5 || r === 6) e = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(e, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(e), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = cn));
		else if (r !== 4 && (r === 27 && ff(e.type) && (n = e.stateNode, t = null), e = e.child, e !== null)) for (al(e, t, n), e = e.sibling; e !== null;) al(e, t, n), e = e.sibling;
	}
	function ol(e, t, n) {
		var r = e.tag;
		if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
		else if (r !== 4 && (r === 27 && ff(e.type) && (n = e.stateNode), e = e.child, e !== null)) for (ol(e, t, n), e = e.sibling; e !== null;) ol(e, t, n), e = e.sibling;
	}
	function sl(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			Jd(t, r, n), t[mt] = e, t[ht] = n;
		} catch (t) {
			rd(e, e.return, t);
		}
	}
	var cl = !1, ll = !1, ul = !1, dl = typeof WeakSet == "function" ? WeakSet : Set, fl = null;
	function pl(e, t) {
		if (e = e.containerInfo, Qd = yp, e = Fr(e), Ir(e)) {
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
		for ($d = {
			focusedElem: e,
			selectionRange: n
		}, yp = !1, fl = t; fl !== null;) if (t = fl, e = t.child, t.subtreeFlags & 1028 && e !== null) e.return = t, fl = e;
		else for (; fl !== null;) {
			switch (t = fl, o = t.alternate, e = t.flags, t.tag) {
				case 0:
					if (e & 4 && (e = t.updateQueue, e = e === null ? null : e.events, e !== null)) for (n = 0; n < e.length; n++) a = e[n], a.ref.impl = a.nextImpl;
					break;
				case 11:
				case 15: break;
				case 1:
					if (e & 1024 && o !== null) {
						e = void 0, n = t, a = o.memoizedProps, o = o.memoizedState, r = n.stateNode;
						try {
							var h = $s(n.type, a);
							e = r.getSnapshotBeforeUpdate(h, o), r.__reactInternalSnapshotBeforeUpdate = e;
						} catch (e) {
							rd(n, n.return, e);
						}
					}
					break;
				case 3:
					if (e & 1024) {
						if (e = t.stateNode.containerInfo, n = e.nodeType, n === 9) hf(e);
						else if (n === 1) switch (e.nodeName) {
							case "HEAD":
							case "HTML":
							case "BODY":
								hf(e);
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
				e.return = t.return, fl = e;
				break;
			}
			fl = t.return;
		}
	}
	function ml(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				kl(e, n), r & 4 && Yc(5, n);
				break;
			case 1:
				if (kl(e, n), r & 4) if (e = n.stateNode, t === null) try {
					e.componentDidMount();
				} catch (e) {
					rd(n, n.return, e);
				}
				else {
					var i = $s(n.type, t.memoizedProps);
					t = t.memoizedState;
					try {
						e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
					} catch (e) {
						rd(n, n.return, e);
					}
				}
				r & 64 && Zc(n), r & 512 && $c(n, n.return);
				break;
			case 3:
				if (kl(e, n), r & 64 && (e = n.updateQueue, e !== null)) {
					if (t = null, n.child !== null) switch (n.child.tag) {
						case 27:
						case 5:
							t = n.child.stateNode;
							break;
						case 1: t = n.child.stateNode;
					}
					try {
						ro(e, t);
					} catch (e) {
						rd(n, n.return, e);
					}
				}
				break;
			case 27: t === null && r & 4 && sl(n);
			case 26:
			case 5:
				kl(e, n), t === null && r & 4 && tl(n), r & 512 && $c(n, n.return);
				break;
			case 12:
				kl(e, n);
				break;
			case 31:
				kl(e, n), r & 4 && bl(e, n);
				break;
			case 13:
				kl(e, n), r & 4 && xl(e, n), r & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = sd.bind(null, n), xf(e, n))));
				break;
			case 22:
				if (r = n.memoizedState !== null || cl, !r) {
					t = t !== null && t.memoizedState !== null || ll, i = cl;
					var a = ll;
					cl = r, (ll = t) && !a ? jl(e, n, (n.subtreeFlags & 8772) != 0) : kl(e, n), cl = i, ll = a;
				}
				break;
			case 30: break;
			default: kl(e, n);
		}
	}
	function hl(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, hl(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && St(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var gl = null, _l = !1;
	function vl(e, t, n) {
		for (n = n.child; n !== null;) yl(e, t, n), n = n.sibling;
	}
	function yl(e, t, n) {
		if (Ue && typeof Ue.onCommitFiberUnmount == "function") try {
			Ue.onCommitFiberUnmount(He, n);
		} catch {}
		switch (n.tag) {
			case 26:
				ll || el(n, t), vl(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				ll || el(n, t);
				var r = gl, i = _l;
				ff(n.type) && (gl = n.stateNode, _l = !1), vl(e, t, n), Df(n.stateNode), gl = r, _l = i;
				break;
			case 5: ll || el(n, t);
			case 6:
				if (r = gl, i = _l, gl = null, vl(e, t, n), gl = r, _l = i, gl !== null) if (_l) try {
					(gl.nodeType === 9 ? gl.body : gl.nodeName === "HTML" ? gl.ownerDocument.body : gl).removeChild(n.stateNode);
				} catch (e) {
					rd(n, t, e);
				}
				else try {
					gl.removeChild(n.stateNode);
				} catch (e) {
					rd(n, t, e);
				}
				break;
			case 18:
				gl !== null && (_l ? (e = gl, pf(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Gp(e)) : pf(gl, n.stateNode));
				break;
			case 4:
				r = gl, i = _l, gl = n.stateNode.containerInfo, _l = !0, vl(e, t, n), gl = r, _l = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				Xc(2, n, t), ll || Xc(4, n, t), vl(e, t, n);
				break;
			case 1:
				ll || (el(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && Qc(n, t, r)), vl(e, t, n);
				break;
			case 21:
				vl(e, t, n);
				break;
			case 22:
				ll = (r = ll) || n.memoizedState !== null, vl(e, t, n), ll = r;
				break;
			default: vl(e, t, n);
		}
	}
	function bl(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
			e = e.dehydrated;
			try {
				Gp(e);
			} catch (e) {
				rd(t, t.return, e);
			}
		}
	}
	function xl(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
			Gp(e);
		} catch (e) {
			rd(t, t.return, e);
		}
	}
	function Sl(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new dl()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new dl()), t;
			default: throw Error(i(435, e.tag));
		}
	}
	function Cl(e, t) {
		var n = Sl(e);
		t.forEach(function(t) {
			if (!n.has(t)) {
				n.add(t);
				var r = cd.bind(null, e, t);
				t.then(r, r);
			}
		});
	}
	function wl(e, t) {
		var n = t.deletions;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var a = n[r], o = e, s = t, c = s;
			a: for (; c !== null;) {
				switch (c.tag) {
					case 27:
						if (ff(c.type)) {
							gl = c.stateNode, _l = !1;
							break a;
						}
						break;
					case 5:
						gl = c.stateNode, _l = !1;
						break a;
					case 3:
					case 4:
						gl = c.stateNode.containerInfo, _l = !0;
						break a;
				}
				c = c.return;
			}
			if (gl === null) throw Error(i(160));
			yl(o, s, a), gl = null, _l = !1, o = a.alternate, o !== null && (o.return = null), a.return = null;
		}
		if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) El(t, e), t = t.sibling;
	}
	var Tl = null;
	function El(e, t) {
		var n = e.alternate, r = e.flags;
		switch (e.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				wl(t, e), Dl(e), r & 4 && (Xc(3, e, e.return), Yc(3, e), Xc(5, e, e.return));
				break;
			case 1:
				wl(t, e), Dl(e), r & 512 && (ll || n === null || el(n, n.return)), r & 64 && cl && (e = e.updateQueue, e !== null && (r = e.callbacks, r !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? r : n.concat(r))));
				break;
			case 26:
				var a = Tl;
				if (wl(t, e), Dl(e), r & 512 && (ll || n === null || el(n, n.return)), r & 4) {
					var o = n === null ? null : n.memoizedState;
					if (r = e.memoizedState, n === null) if (r === null) if (e.stateNode === null) {
						a: {
							r = e.type, n = e.memoizedProps, a = a.ownerDocument || a;
							b: switch (r) {
								case "title":
									o = a.getElementsByTagName("title")[0], (!o || o[xt] || o[mt] || o.namespaceURI === "http://www.w3.org/2000/svg" || o.hasAttribute("itemprop")) && (o = a.createElement(r), a.head.insertBefore(o, a.querySelector("head > title"))), Jd(o, r, n), o[mt] = e, Dt(o), r = o;
									break a;
								case "link":
									var s = $f("link", "href", a).get(r + (n.href || ""));
									if (s) {
										for (var c = 0; c < s.length; c++) if (o = s[c], o.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && o.getAttribute("rel") === (n.rel == null ? null : n.rel) && o.getAttribute("title") === (n.title == null ? null : n.title) && o.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
											s.splice(c, 1);
											break b;
										}
									}
									o = a.createElement(r), Jd(o, r, n), a.head.appendChild(o);
									break;
								case "meta":
									if (s = $f("meta", "content", a).get(r + (n.content || ""))) {
										for (c = 0; c < s.length; c++) if (o = s[c], o.getAttribute("content") === (n.content == null ? null : "" + n.content) && o.getAttribute("name") === (n.name == null ? null : n.name) && o.getAttribute("property") === (n.property == null ? null : n.property) && o.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && o.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
											s.splice(c, 1);
											break b;
										}
									}
									o = a.createElement(r), Jd(o, r, n), a.head.appendChild(o);
									break;
								default: throw Error(i(468, r));
							}
							o[mt] = e, Dt(o), r = o;
						}
						e.stateNode = r;
					} else ep(a, e.type, e.stateNode);
					else e.stateNode = Jf(a, r, e.memoizedProps);
					else o === r ? r === null && e.stateNode !== null && nl(e, e.memoizedProps, n.memoizedProps) : (o === null ? n.stateNode !== null && (n = n.stateNode, n.parentNode.removeChild(n)) : o.count--, r === null ? ep(a, e.type, e.stateNode) : Jf(a, r, e.memoizedProps));
				}
				break;
			case 27:
				wl(t, e), Dl(e), r & 512 && (ll || n === null || el(n, n.return)), n !== null && r & 4 && nl(e, e.memoizedProps, n.memoizedProps);
				break;
			case 5:
				if (wl(t, e), Dl(e), r & 512 && (ll || n === null || el(n, n.return)), e.flags & 32) {
					a = e.stateNode;
					try {
						$t(a, "");
					} catch (t) {
						rd(e, e.return, t);
					}
				}
				r & 4 && e.stateNode != null && (a = e.memoizedProps, nl(e, a, n === null ? a : n.memoizedProps)), r & 1024 && (ul = !0);
				break;
			case 6:
				if (wl(t, e), Dl(e), r & 4) {
					if (e.stateNode === null) throw Error(i(162));
					r = e.memoizedProps, n = e.stateNode;
					try {
						n.nodeValue = r;
					} catch (t) {
						rd(e, e.return, t);
					}
				}
				break;
			case 3:
				if (Qf = null, a = Tl, Tl = B(t.containerInfo), wl(t, e), Tl = a, Dl(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
					Gp(t.containerInfo);
				} catch (t) {
					rd(e, e.return, t);
				}
				ul && (ul = !1, Ol(e));
				break;
			case 4:
				r = Tl, Tl = B(e.stateNode.containerInfo), wl(t, e), Dl(e), Tl = r;
				break;
			case 12:
				wl(t, e), Dl(e);
				break;
			case 31:
				wl(t, e), Dl(e), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, Cl(e, r)));
				break;
			case 13:
				wl(t, e), Dl(e), e.child.flags & 8192 && e.memoizedState !== null != (n !== null && n.memoizedState !== null) && (du = Ne()), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, Cl(e, r)));
				break;
			case 22:
				a = e.memoizedState !== null;
				var l = n !== null && n.memoizedState !== null, u = cl, d = ll;
				if (cl = u || a, ll = d || l, wl(t, e), ll = d, cl = u, Dl(e), r & 8192) a: for (t = e.stateNode, t._visibility = a ? t._visibility & -2 : t._visibility | 1, a && (n === null || l || cl || ll || Al(e)), n = null, t = e;;) {
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
								rd(l, l.return, e);
							}
						}
					} else if (t.tag === 6) {
						if (n === null) {
							l = t;
							try {
								l.stateNode.nodeValue = a ? "" : l.memoizedProps;
							} catch (e) {
								rd(l, l.return, e);
							}
						}
					} else if (t.tag === 18) {
						if (n === null) {
							l = t;
							try {
								var m = l.stateNode;
								a ? mf(m, !0) : mf(l.stateNode, !1);
							} catch (e) {
								rd(l, l.return, e);
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
				r & 4 && (r = e.updateQueue, r !== null && (n = r.retryQueue, n !== null && (r.retryQueue = null, Cl(e, n))));
				break;
			case 19:
				wl(t, e), Dl(e), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, Cl(e, r)));
				break;
			case 30: break;
			case 21: break;
			default: wl(t, e), Dl(e);
		}
	}
	function Dl(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var n, r = e.return; r !== null;) {
					if (rl(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				if (n == null) throw Error(i(160));
				switch (n.tag) {
					case 27:
						var a = n.stateNode;
						ol(e, il(e), a);
						break;
					case 5:
						var o = n.stateNode;
						n.flags & 32 && ($t(o, ""), n.flags &= -33), ol(e, il(e), o);
						break;
					case 3:
					case 4:
						var s = n.stateNode.containerInfo;
						al(e, il(e), s);
						break;
					default: throw Error(i(161));
				}
			} catch (t) {
				rd(e, e.return, t);
			}
			e.flags &= -3;
		}
		t & 4096 && (e.flags &= -4097);
	}
	function Ol(e) {
		if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
			var t = e;
			Ol(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
		}
	}
	function kl(e, t) {
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) ml(e, t.alternate, t), t = t.sibling;
	}
	function Al(e) {
		for (e = e.child; e !== null;) {
			var t = e;
			switch (t.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					Xc(4, t, t.return), Al(t);
					break;
				case 1:
					el(t, t.return);
					var n = t.stateNode;
					typeof n.componentWillUnmount == "function" && Qc(t, t.return, n), Al(t);
					break;
				case 27: Df(t.stateNode);
				case 26:
				case 5:
					el(t, t.return), Al(t);
					break;
				case 22:
					t.memoizedState === null && Al(t);
					break;
				case 30:
					Al(t);
					break;
				default: Al(t);
			}
			e = e.sibling;
		}
	}
	function jl(e, t, n) {
		for (n &&= (t.subtreeFlags & 8772) != 0, t = t.child; t !== null;) {
			var r = t.alternate, i = e, a = t, o = a.flags;
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					jl(i, a, n), Yc(4, a);
					break;
				case 1:
					if (jl(i, a, n), r = a, i = r.stateNode, typeof i.componentDidMount == "function") try {
						i.componentDidMount();
					} catch (e) {
						rd(r, r.return, e);
					}
					if (r = a, i = r.updateQueue, i !== null) {
						var s = r.stateNode;
						try {
							var c = i.shared.hiddenCallbacks;
							if (c !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < c.length; i++) no(c[i], s);
						} catch (e) {
							rd(r, r.return, e);
						}
					}
					n && o & 64 && Zc(a), $c(a, a.return);
					break;
				case 27: sl(a);
				case 26:
				case 5:
					jl(i, a, n), n && r === null && o & 4 && tl(a), $c(a, a.return);
					break;
				case 12:
					jl(i, a, n);
					break;
				case 31:
					jl(i, a, n), n && o & 4 && bl(i, a);
					break;
				case 13:
					jl(i, a, n), n && o & 4 && xl(i, a);
					break;
				case 22:
					a.memoizedState === null && jl(i, a, n), $c(a, a.return);
					break;
				case 30: break;
				default: jl(i, a, n);
			}
			t = t.sibling;
		}
	}
	function Ml(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && _a(n));
	}
	function Nl(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && _a(e));
	}
	function Pl(e, t, n, r) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) Fl(e, t, n, r), t = t.sibling;
	}
	function Fl(e, t, n, r) {
		var i = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				Pl(e, t, n, r), i & 2048 && Yc(9, t);
				break;
			case 1:
				Pl(e, t, n, r);
				break;
			case 3:
				Pl(e, t, n, r), i & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && _a(e)));
				break;
			case 12:
				if (i & 2048) {
					Pl(e, t, n, r), e = t.stateNode;
					try {
						var a = t.memoizedProps, o = a.id, s = a.onPostCommit;
						typeof s == "function" && s(o, t.alternate === null ? "mount" : "update", e.passiveEffectDuration, -0);
					} catch (e) {
						rd(t, t.return, e);
					}
				} else Pl(e, t, n, r);
				break;
			case 31:
				Pl(e, t, n, r);
				break;
			case 13:
				Pl(e, t, n, r);
				break;
			case 23: break;
			case 22:
				a = t.stateNode, o = t.alternate, t.memoizedState === null ? a._visibility & 2 ? Pl(e, t, n, r) : (a._visibility |= 2, Il(e, t, n, r, (t.subtreeFlags & 10256) != 0 || !1)) : a._visibility & 2 ? Pl(e, t, n, r) : Ll(e, t), i & 2048 && Ml(o, t);
				break;
			case 24:
				Pl(e, t, n, r), i & 2048 && Nl(t.alternate, t);
				break;
			default: Pl(e, t, n, r);
		}
	}
	function Il(e, t, n, r, i) {
		for (i &&= (t.subtreeFlags & 10256) != 0 || !1, t = t.child; t !== null;) {
			var a = e, o = t, s = n, c = r, l = o.flags;
			switch (o.tag) {
				case 0:
				case 11:
				case 15:
					Il(a, o, s, c, i), Yc(8, o);
					break;
				case 23: break;
				case 22:
					var u = o.stateNode;
					o.memoizedState === null ? (u._visibility |= 2, Il(a, o, s, c, i)) : u._visibility & 2 ? Il(a, o, s, c, i) : Ll(a, o), i && l & 2048 && Ml(o.alternate, o);
					break;
				case 24:
					Il(a, o, s, c, i), i && l & 2048 && Nl(o.alternate, o);
					break;
				default: Il(a, o, s, c, i);
			}
			t = t.sibling;
		}
	}
	function Ll(e, t) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
			var n = e, r = t, i = r.flags;
			switch (r.tag) {
				case 22:
					Ll(n, r), i & 2048 && Ml(r.alternate, r);
					break;
				case 24:
					Ll(n, r), i & 2048 && Nl(r.alternate, r);
					break;
				default: Ll(n, r);
			}
			t = t.sibling;
		}
	}
	var Rl = 8192;
	function zl(e, t, n) {
		if (e.subtreeFlags & Rl) for (e = e.child; e !== null;) Bl(e, t, n), e = e.sibling;
	}
	function Bl(e, t, n) {
		switch (e.tag) {
			case 26:
				zl(e, t, n), e.flags & Rl && e.memoizedState !== null && rp(n, Tl, e.memoizedState, e.memoizedProps);
				break;
			case 5:
				zl(e, t, n);
				break;
			case 3:
			case 4:
				var r = Tl;
				Tl = B(e.stateNode.containerInfo), zl(e, t, n), Tl = r;
				break;
			case 22:
				e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = Rl, Rl = 16777216, zl(e, t, n), Rl = r) : zl(e, t, n));
				break;
			default: zl(e, t, n);
		}
	}
	function Vl(e) {
		var t = e.alternate;
		if (t !== null && (e = t.child, e !== null)) {
			t.child = null;
			do
				t = e.sibling, e.sibling = null, e = t;
			while (e !== null);
		}
	}
	function Hl(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				fl = r, Gl(r, e);
			}
			Vl(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) Ul(e), e = e.sibling;
	}
	function Ul(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				Hl(e), e.flags & 2048 && Xc(9, e, e.return);
				break;
			case 3:
				Hl(e);
				break;
			case 12:
				Hl(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Wl(e)) : Hl(e);
				break;
			default: Hl(e);
		}
	}
	function Wl(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				fl = r, Gl(r, e);
			}
			Vl(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					Xc(8, t, t.return), Wl(t);
					break;
				case 22:
					n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, Wl(t));
					break;
				default: Wl(t);
			}
			e = e.sibling;
		}
	}
	function Gl(e, t) {
		for (; fl !== null;) {
			var n = fl;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					Xc(8, n, t);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var r = n.memoizedState.cachePool.pool;
						r != null && r.refCount++;
					}
					break;
				case 24: _a(n.memoizedState.cache);
			}
			if (r = n.child, r !== null) r.return = n, fl = r;
			else a: for (n = e; fl !== null;) {
				r = fl;
				var i = r.sibling, a = r.return;
				if (hl(r), r === n) {
					fl = null;
					break a;
				}
				if (i !== null) {
					i.return = a, fl = i;
					break a;
				}
				fl = a;
			}
		}
	}
	var Kl = {
		getCacheForType: function(e) {
			var t = la(ha), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return la(ha).controller.signal;
		}
	}, ql = typeof WeakMap == "function" ? WeakMap : Map, Jl = 0, Yl = null, L = null, Xl = 0, Zl = 0, Ql = null, $l = !1, eu = !1, tu = !1, nu = 0, ru = 0, iu = 0, au = 0, ou = 0, su = 0, cu = 0, R = null, lu = null, uu = !1, du = 0, fu = 0, pu = Infinity, mu = null, hu = null, gu = 0, _u = null, vu = null, yu = 0, bu = 0, xu = null, Su = null, Cu = 0, wu = null;
	function Tu() {
		return Jl & 2 && Xl !== 0 ? Xl & -Xl : D.T === null ? dt() : wd();
	}
	function Eu() {
		if (su === 0) if (!(Xl & 536870912) || j) {
			var e = Xe;
			Xe <<= 1, !(Xe & 3932160) && (Xe = 262144), su = e;
		} else su = 536870912;
		return e = lo.current, e !== null && (e.flags |= 32), su;
	}
	function Du(e, t, n) {
		(e === Yl && (Zl === 2 || Zl === 9) || e.cancelPendingCommit !== null) && (Pu(e, 0), ju(e, Xl, su, !1)), it(e, n), (!(Jl & 2) || e !== Yl) && (e === Yl && (!(Jl & 2) && (au |= n), ru === 4 && ju(e, Xl, su, !1)), gd(e));
	}
	function Ou(e, t, n) {
		if (Jl & 6) throw Error(i(327));
		var r = !n && (t & 127) == 0 && (t & e.expiredLanes) === 0 || et(e, t), a = r ? Hu(e, t) : Bu(e, t, !0), o = r;
		do {
			if (a === 0) {
				eu && !r && ju(e, t, 0, !1);
				break;
			} else {
				if (n = e.current.alternate, o && !Au(n)) {
					a = Bu(e, t, !1), o = !1;
					continue;
				}
				if (a === 2) {
					if (o = t, e.errorRecoveryDisabledLanes & o) var s = 0;
					else s = e.pendingLanes & -536870913, s = s === 0 ? s & 536870912 ? 536870912 : 0 : s;
					if (s !== 0) {
						t = s;
						a: {
							var c = e;
							a = R;
							var l = c.current.memoizedState.isDehydrated;
							if (l && (Pu(c, s).flags |= 256), s = Bu(c, s, !1), s !== 2) {
								if (tu && !l) {
									c.errorRecoveryDisabledLanes |= o, au |= o, a = 4;
									break a;
								}
								o = lu, lu = a, o !== null && (lu === null ? lu = o : lu.push.apply(lu, o));
							}
							a = s;
						}
						if (o = !1, a !== 2) continue;
					}
				}
				if (a === 1) {
					Pu(e, 0), ju(e, t, 0, !0);
					break;
				}
				a: {
					switch (r = e, o = a, o) {
						case 0:
						case 1: throw Error(i(345));
						case 4: if ((t & 4194048) !== t) break;
						case 6:
							ju(r, t, su, !$l);
							break a;
						case 2:
							lu = null;
							break;
						case 3:
						case 5: break;
						default: throw Error(i(329));
					}
					if ((t & 62914560) === t && (a = du + 300 - Ne(), 10 < a)) {
						if (ju(r, t, su, !$l), $e(r, 0, !0) !== 0) break a;
						yu = t, r.timeoutHandle = sf(ku.bind(null, r, n, lu, mu, uu, t, su, au, cu, $l, o, "Throttled", -0, 0), a);
						break a;
					}
					ku(r, n, lu, mu, uu, t, su, au, cu, $l, o, null, -0, 0);
				}
			}
			break;
		} while (1);
		gd(e);
	}
	function ku(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
		if (e.timeoutHandle = -1, d = t.subtreeFlags, d & 8192 || (d & 16785408) == 16785408) {
			d = {
				stylesheets: null,
				count: 0,
				imgCount: 0,
				imgBytes: 0,
				suspenseyImages: [],
				waitingForImages: !0,
				waitingForViewTransition: !1,
				unsuspend: cn
			}, Bl(t, a, d);
			var m = (a & 62914560) === a ? du - Ne() : (a & 4194048) === a ? fu - Ne() : 0;
			if (m = ap(d, m), m !== null) {
				yu = a, e.cancelPendingCommit = m(Yu.bind(null, e, t, a, n, r, i, o, s, c, u, d, null, f, p)), ju(e, a, o, !l);
				return;
			}
		}
		Yu(e, t, a, n, r, i, o, s, c);
	}
	function Au(e) {
		for (var t = e;;) {
			var n = t.tag;
			if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
				var i = n[r], a = i.getSnapshot;
				i = i.value;
				try {
					if (!Ar(a(), i)) return !1;
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
	function ju(e, t, n, r) {
		t &= ~ou, t &= ~au, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
		for (var i = t; 0 < i;) {
			var a = 31 - Ge(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && ot(e, n, t);
	}
	function Mu() {
		return Jl & 6 ? !0 : (_d(0, !1), !1);
	}
	function Nu() {
		if (L !== null) {
			if (Zl === 0) var e = L.return;
			else e = L, ta = ea = null, Fo(e), Ra = null, za = 0, e = L;
			for (; e !== null;) Jc(e.alternate, e), e = e.return;
			L = null;
		}
	}
	function Pu(e, t) {
		var n = e.timeoutHandle;
		n !== -1 && (e.timeoutHandle = -1, cf(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), yu = 0, Nu(), Yl = e, L = n = vi(e.current, null), Xl = t, Zl = 0, Ql = null, $l = !1, eu = et(e, t), tu = !1, cu = su = ou = au = iu = ru = 0, lu = R = null, uu = !1, t & 8 && (t |= t & 32);
		var r = e.entangledLanes;
		if (r !== 0) for (e = e.entanglements, r &= t; 0 < r;) {
			var i = 31 - Ge(r), a = 1 << i;
			t |= e[i], r &= ~a;
		}
		return nu = t, ci(), n;
	}
	function Fu(e, t) {
		F = null, D.H = Gs, t === Oa || t === Aa ? (t = Ia(), Zl = 3) : t === ka ? (t = Ia(), Zl = 4) : Zl = t === lc ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, Ql = t, L === null && (ru = 1, rc(e, Ei(t, e.current)));
	}
	function Iu() {
		var e = lo.current;
		return e === null ? !0 : (Xl & 4194048) === Xl ? uo === null : (Xl & 62914560) === Xl || Xl & 536870912 ? e === uo : !1;
	}
	function Lu() {
		var e = D.H;
		return D.H = Gs, e === null ? Gs : e;
	}
	function Ru() {
		var e = D.A;
		return D.A = Kl, e;
	}
	function zu() {
		ru = 4, $l || (Xl & 4194048) !== Xl && lo.current !== null || (eu = !0), !(iu & 134217727) && !(au & 134217727) || Yl === null || ju(Yl, Xl, su, !1);
	}
	function Bu(e, t, n) {
		var r = Jl;
		Jl |= 2;
		var i = Lu(), a = Ru();
		(Yl !== e || Xl !== t) && (mu = null, Pu(e, t)), t = !1;
		var o = ru;
		a: do
			try {
				if (Zl !== 0 && L !== null) {
					var s = L, c = Ql;
					switch (Zl) {
						case 8:
							Nu(), o = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							lo.current === null && (t = !0);
							var l = Zl;
							if (Zl = 0, Ql = null, Ku(e, s, c, l), n && eu) {
								o = 0;
								break a;
							}
							break;
						default: l = Zl, Zl = 0, Ql = null, Ku(e, s, c, l);
					}
				}
				Vu(), o = ru;
				break;
			} catch (t) {
				Fu(e, t);
			}
		while (1);
		return t && e.shellSuspendCounter++, ta = ea = null, Jl = r, D.H = i, D.A = a, L === null && (Yl = null, Xl = 0, ci()), o;
	}
	function Vu() {
		for (; L !== null;) Wu(L);
	}
	function Hu(e, t) {
		var n = Jl;
		Jl |= 2;
		var r = Lu(), a = Ru();
		Yl !== e || Xl !== t ? (mu = null, pu = Ne() + 500, Pu(e, t)) : eu = et(e, t);
		a: do
			try {
				if (Zl !== 0 && L !== null) {
					t = L;
					var o = Ql;
					b: switch (Zl) {
						case 1:
							Zl = 0, Ql = null, Ku(e, t, o, 1);
							break;
						case 2:
						case 9:
							if (Ma(o)) {
								Zl = 0, Ql = null, Gu(t);
								break;
							}
							t = function() {
								Zl !== 2 && Zl !== 9 || Yl !== e || (Zl = 7), gd(e);
							}, o.then(t, t);
							break a;
						case 3:
							Zl = 7;
							break a;
						case 4:
							Zl = 5;
							break a;
						case 7:
							Ma(o) ? (Zl = 0, Ql = null, Gu(t)) : (Zl = 0, Ql = null, Ku(e, t, o, 7));
							break;
						case 5:
							var s = null;
							switch (L.tag) {
								case 26: s = L.memoizedState;
								case 5:
								case 27:
									var c = L;
									if (s ? np(s) : c.stateNode.complete) {
										Zl = 0, Ql = null;
										var l = c.sibling;
										if (l !== null) L = l;
										else {
											var u = c.return;
											u === null ? L = null : (L = u, qu(u));
										}
										break b;
									}
							}
							Zl = 0, Ql = null, Ku(e, t, o, 5);
							break;
						case 6:
							Zl = 0, Ql = null, Ku(e, t, o, 6);
							break;
						case 8:
							Nu(), ru = 6;
							break a;
						default: throw Error(i(462));
					}
				}
				Uu();
				break;
			} catch (t) {
				Fu(e, t);
			}
		while (1);
		return ta = ea = null, D.H = r, D.A = a, Jl = n, L === null ? (Yl = null, Xl = 0, ci(), ru) : 0;
	}
	function Uu() {
		for (; L !== null && !je();) Wu(L);
	}
	function Wu(e) {
		var t = zc(e.alternate, e, nu);
		e.memoizedProps = e.pendingProps, t === null ? qu(e) : L = t;
	}
	function Gu(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = Cc(n, t, t.pendingProps, t.type, void 0, Xl);
				break;
			case 11:
				t = Cc(n, t, t.pendingProps, t.type.render, t.ref, Xl);
				break;
			case 5: Fo(t);
			default: Jc(n, t), t = L = yi(t, nu), t = zc(n, t, nu);
		}
		e.memoizedProps = e.pendingProps, t === null ? qu(e) : L = t;
	}
	function Ku(e, t, n, r) {
		ta = ea = null, Fo(t), Ra = null, za = 0;
		var i = t.return;
		try {
			if (cc(e, i, t, n, Xl)) {
				ru = 1, rc(e, Ei(n, e.current)), L = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw L = i, t;
			ru = 1, rc(e, Ei(n, e.current)), L = null;
			return;
		}
		t.flags & 32768 ? (j || r === 1 ? e = !0 : eu || Xl & 536870912 ? e = !1 : ($l = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = lo.current, r !== null && r.tag === 13 && (r.flags |= 16384))), Ju(t, e)) : qu(t);
	}
	function qu(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				Ju(t, $l);
				return;
			}
			e = t.return;
			var n = Kc(t.alternate, t, nu);
			if (n !== null) {
				L = n;
				return;
			}
			if (t = t.sibling, t !== null) {
				L = t;
				return;
			}
			L = t = e;
		} while (t !== null);
		ru === 0 && (ru = 5);
	}
	function Ju(e, t) {
		do {
			var n = qc(e.alternate, e);
			if (n !== null) {
				n.flags &= 32767, L = n;
				return;
			}
			if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
				L = e;
				return;
			}
			L = e = n;
		} while (e !== null);
		ru = 6, L = null;
	}
	function Yu(e, t, n, r, a, o, s, c, l) {
		e.cancelPendingCommit = null;
		do
			ed();
		while (gu !== 0);
		if (Jl & 6) throw Error(i(327));
		if (t !== null) {
			if (t === e.current) throw Error(i(177));
			if (o = t.lanes | t.childLanes, o |= si, at(e, n, o, s, c, l), e === Yl && (L = Yl = null, Xl = 0), vu = t, _u = e, yu = n, bu = o, xu = a, Su = r, t.subtreeFlags & 10256 || t.flags & 10256 ? (e.callbackNode = null, e.callbackPriority = 0, ld(Le, function() {
				return td(), null;
			})) : (e.callbackNode = null, e.callbackPriority = 0), r = (t.flags & 13878) != 0, t.subtreeFlags & 13878 || r) {
				r = D.T, D.T = null, a = O.p, O.p = 2, s = Jl, Jl |= 4;
				try {
					pl(e, t, n);
				} finally {
					Jl = s, O.p = a, D.T = r;
				}
			}
			gu = 1, Xu(), Zu(), Qu();
		}
	}
	function Xu() {
		if (gu === 1) {
			gu = 0;
			var e = _u, t = vu, n = (t.flags & 13878) != 0;
			if (t.subtreeFlags & 13878 || n) {
				n = D.T, D.T = null;
				var r = O.p;
				O.p = 2;
				var i = Jl;
				Jl |= 4;
				try {
					El(t, e);
					var a = $d, o = Fr(e.containerInfo), s = a.focusedElem, c = a.selectionRange;
					if (o !== s && s && s.ownerDocument && Pr(s.ownerDocument.documentElement, s)) {
						if (c !== null && Ir(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = Nr(s, h), v = Nr(s, g);
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
					yp = !!Qd, $d = Qd = null;
				} finally {
					Jl = i, O.p = r, D.T = n;
				}
			}
			e.current = t, gu = 2;
		}
	}
	function Zu() {
		if (gu === 2) {
			gu = 0;
			var e = _u, t = vu, n = (t.flags & 8772) != 0;
			if (t.subtreeFlags & 8772 || n) {
				n = D.T, D.T = null;
				var r = O.p;
				O.p = 2;
				var i = Jl;
				Jl |= 4;
				try {
					ml(e, t.alternate, t);
				} finally {
					Jl = i, O.p = r, D.T = n;
				}
			}
			gu = 3;
		}
	}
	function Qu() {
		if (gu === 4 || gu === 3) {
			gu = 0, Me();
			var e = _u, t = vu, n = yu, r = Su;
			t.subtreeFlags & 10256 || t.flags & 10256 ? gu = 5 : (gu = 0, vu = _u = null, $u(e, e.pendingLanes));
			var i = e.pendingLanes;
			if (i === 0 && (hu = null), ut(n), t = t.stateNode, Ue && typeof Ue.onCommitFiberRoot == "function") try {
				Ue.onCommitFiberRoot(He, t, void 0, (t.current.flags & 128) == 128);
			} catch {}
			if (r !== null) {
				t = D.T, i = O.p, O.p = 2, D.T = null;
				try {
					for (var a = e.onRecoverableError, o = 0; o < r.length; o++) {
						var s = r[o];
						a(s.value, { componentStack: s.stack });
					}
				} finally {
					D.T = t, O.p = i;
				}
			}
			yu & 3 && ed(), gd(e), i = e.pendingLanes, n & 261930 && i & 42 ? e === wu ? Cu++ : (Cu = 0, wu = e) : Cu = 0, _d(0, !1);
		}
	}
	function $u(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, _a(t)));
	}
	function ed() {
		return Xu(), Zu(), Qu(), td();
	}
	function td() {
		if (gu !== 5) return !1;
		var e = _u, t = bu;
		bu = 0;
		var n = ut(yu), r = D.T, a = O.p;
		try {
			O.p = 32 > n ? 32 : n, D.T = null, n = xu, xu = null;
			var o = _u, s = yu;
			if (gu = 0, vu = _u = null, yu = 0, Jl & 6) throw Error(i(331));
			var c = Jl;
			if (Jl |= 4, Ul(o.current), Fl(o, o.current, s, n), Jl = c, _d(0, !1), Ue && typeof Ue.onPostCommitFiberRoot == "function") try {
				Ue.onPostCommitFiberRoot(He, o);
			} catch {}
			return !0;
		} finally {
			O.p = a, D.T = r, $u(e, t);
		}
	}
	function nd(e, t, n) {
		t = Ei(n, t), t = ac(e.stateNode, t, 2), e = Xa(e, t, 2), e !== null && (it(e, 2), gd(e));
	}
	function rd(e, t, n) {
		if (e.tag === 3) nd(e, e, n);
		else for (; t !== null;) {
			if (t.tag === 3) {
				nd(t, e, n);
				break;
			} else if (t.tag === 1) {
				var r = t.stateNode;
				if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (hu === null || !hu.has(r))) {
					e = Ei(n, e), n = oc(2), r = Xa(t, n, 2), r !== null && (sc(n, r, t, e), it(r, 2), gd(r));
					break;
				}
			}
			t = t.return;
		}
	}
	function id(e, t, n) {
		var r = e.pingCache;
		if (r === null) {
			r = e.pingCache = new ql();
			var i = /* @__PURE__ */ new Set();
			r.set(t, i);
		} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
		i.has(n) || (tu = !0, i.add(n), e = ad.bind(null, e, t, n), t.then(e, e));
	}
	function ad(e, t, n) {
		var r = e.pingCache;
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, Yl === e && (Xl & n) === n && (ru === 4 || ru === 3 && (Xl & 62914560) === Xl && 300 > Ne() - du ? !(Jl & 2) && Pu(e, 0) : ou |= n, cu === Xl && (cu = 0)), gd(e);
	}
	function od(e, t) {
		t === 0 && (t = nt()), e = di(e, t), e !== null && (it(e, t), gd(e));
	}
	function sd(e) {
		var t = e.memoizedState, n = 0;
		t !== null && (n = t.retryLane), od(e, n);
	}
	function cd(e, t) {
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
		r !== null && r.delete(t), od(e, n);
	}
	function ld(e, t) {
		return ke(e, t);
	}
	var ud = null, dd = null, fd = !1, pd = !1, md = !1, hd = 0;
	function gd(e) {
		e !== dd && e.next === null && (dd === null ? ud = dd = e : dd = dd.next = e), pd = !0, fd || (fd = !0, Cd());
	}
	function _d(e, t) {
		if (!md && pd) {
			md = !0;
			do
				for (var n = !1, r = ud; r !== null;) {
					if (!t) if (e !== 0) {
						var i = r.pendingLanes;
						if (i === 0) var a = 0;
						else {
							var o = r.suspendedLanes, s = r.pingedLanes;
							a = (1 << 31 - Ge(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
						}
						a !== 0 && (n = !0, Sd(r, a));
					} else a = Xl, a = $e(r, r === Yl ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || et(r, a) || (n = !0, Sd(r, a));
					r = r.next;
				}
			while (n);
			md = !1;
		}
	}
	function vd() {
		yd();
	}
	function yd() {
		pd = fd = !1;
		var e = 0;
		hd !== 0 && of() && (e = hd);
		for (var t = Ne(), n = null, r = ud; r !== null;) {
			var i = r.next, a = bd(r, t);
			a === 0 ? (r.next = null, n === null ? ud = i : n.next = i, i === null && (dd = n)) : (n = r, (e !== 0 || a & 3) && (pd = !0)), r = i;
		}
		gu !== 0 && gu !== 5 || _d(e, !1), hd !== 0 && (hd = 0);
	}
	function bd(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - Ge(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = tt(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = Yl, n = Xl, n = $e(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (Zl === 2 || Zl === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && Ae(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || et(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && Ae(r), ut(n)) {
				case 2:
				case 8:
					n = Ie;
					break;
				case 32:
					n = Le;
					break;
				case 268435456:
					n = ze;
					break;
				default: n = Le;
			}
			return r = xd.bind(null, e), n = ke(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && Ae(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function xd(e, t) {
		if (gu !== 0 && gu !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (ed() && e.callbackNode !== n) return null;
		var r = Xl;
		return r = $e(e, e === Yl ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (Ou(e, r, t), bd(e, Ne()), e.callbackNode != null && e.callbackNode === n ? xd.bind(null, e) : null);
	}
	function Sd(e, t) {
		if (ed()) return null;
		Ou(e, t, !0);
	}
	function Cd() {
		uf(function() {
			Jl & 6 ? ke(Fe, vd) : yd();
		});
	}
	function wd() {
		if (hd === 0) {
			var e = N;
			e === 0 && (e = Ye, Ye <<= 1, !(Ye & 261888) && (Ye = 256)), hd = e;
		}
		return hd;
	}
	function Td(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : sn("" + e);
	}
	function Ed(e, t) {
		var n = t.ownerDocument.createElement("input");
		return n.name = t.name, n.value = t.value, e.id && n.setAttribute("form", e.id), t.parentNode.insertBefore(n, t), e = new FormData(e), n.parentNode.removeChild(n), e;
	}
	function Dd(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = Td((i[ht] || null).action), o = r.submitter;
			o && (t = (t = o[ht] || null) ? Td(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new kn("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (hd !== 0) {
								var e = o ? Ed(i, o) : new FormData(i);
								js(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = o ? Ed(i, o) : new FormData(i), js(n, {
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
	for (var Od = 0; Od < ni.length; Od++) {
		var kd = ni[Od];
		ri(kd.toLowerCase(), "on" + (kd[0].toUpperCase() + kd.slice(1)));
	}
	ri(Jr, "onAnimationEnd"), ri(Yr, "onAnimationIteration"), ri(Xr, "onAnimationStart"), ri("dblclick", "onDoubleClick"), ri("focusin", "onFocus"), ri("focusout", "onBlur"), ri(Zr, "onTransitionRun"), ri(Qr, "onTransitionStart"), ri($r, "onTransitionCancel"), ri(ei, "onTransitionEnd"), jt("onMouseEnter", ["mouseout", "mouseover"]), jt("onMouseLeave", ["mouseout", "mouseover"]), jt("onPointerEnter", ["pointerout", "pointerover"]), jt("onPointerLeave", ["pointerout", "pointerover"]), At("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), At("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), At("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), At("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), At("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), At("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
	var Ad = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), jd = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Ad));
	function Md(e, t) {
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
						ii(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						ii(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function z(e, t) {
		var n = t[_t];
		n === void 0 && (n = t[_t] = /* @__PURE__ */ new Set());
		var r = e + "__bubble";
		n.has(r) || (Id(t, e, 2, !1), n.add(r));
	}
	function Nd(e, t, n) {
		var r = 0;
		t && (r |= 4), Id(n, e, r, t);
	}
	var Pd = "_reactListening" + Math.random().toString(36).slice(2);
	function Fd(e) {
		if (!e[Pd]) {
			e[Pd] = !0, Ot.forEach(function(t) {
				t !== "selectionchange" && (jd.has(t) || Nd(t, !1, e), Nd(t, !0, e));
			});
			var t = e.nodeType === 9 ? e : e.ownerDocument;
			t === null || t[Pd] || (t[Pd] = !0, Nd("selectionchange", !1, t));
		}
	}
	function Id(e, t, n, r) {
		switch (Ep(t)) {
			case 2:
				var i = bp;
				break;
			case 8:
				i = xp;
				break;
			default: i = Sp;
		}
		n = i.bind(null, t, n, e), i = void 0, !vn || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
			capture: !0,
			passive: i
		}) : i === void 0 ? e.addEventListener(t, n, !1) : e.addEventListener(t, n, { passive: i });
	}
	function Ld(e, t, n, r, i) {
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
					if (s = Ct(c), s === null) return;
					if (l = s.tag, l === 5 || l === 6 || l === 26 || l === 27) {
						r = a = s;
						continue a;
					}
					c = c.parentNode;
				}
			}
			r = r.return;
		}
		hn(function() {
			var r = a, i = un(n), s = [];
			a: {
				var c = ti.get(e);
				if (c !== void 0) {
					var l = kn, u = e;
					switch (e) {
						case "keypress": if (wn(n) === 0) break a;
						case "keydown":
						case "keyup":
							l = qn;
							break;
						case "focusin":
							u = "focus", l = Rn;
							break;
						case "focusout":
							u = "blur", l = Rn;
							break;
						case "beforeblur":
						case "afterblur":
							l = Rn;
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
							l = In;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							l = Ln;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = Yn;
							break;
						case Jr:
						case Yr:
						case Xr:
							l = zn;
							break;
						case ei:
							l = Xn;
							break;
						case "scroll":
						case "scrollend":
							l = jn;
							break;
						case "wheel":
							l = Zn;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = Bn;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							l = Jn;
							break;
						case "toggle":
						case "beforetoggle": l = Qn;
					}
					var d = (t & 4) != 0, f = !d && (e === "scroll" || e === "scrollend"), p = d ? c === null ? null : c + "Capture" : c;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = gn(m, p), g != null && d.push(Rd(m, g, h))), f) break;
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
					if (c = e === "mouseover" || e === "pointerover", l = e === "mouseout" || e === "pointerout", c && n !== ln && (u = n.relatedTarget || n.fromElement) && (Ct(u) || u[gt])) break a;
					if ((l || c) && (c = i.window === i ? i : (c = i.ownerDocument) ? c.defaultView || c.parentWindow : window, l ? (u = n.relatedTarget || n.toElement, l = r, u = u ? Ct(u) : null, u !== null && (f = o(u), d = u.tag, u !== f || d !== 5 && d !== 27 && d !== 6) && (u = null)) : (l = null, u = r), l !== u)) {
						if (d = In, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = Jn, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = l == null ? c : Tt(l), h = u == null ? c : Tt(u), c = new d(g, m + "leave", l, n, i), c.target = f, c.relatedTarget = h, g = null, Ct(i) === r && (d = new d(p, m + "enter", u, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, l && u) b: {
							for (d = Bd, p = l, m = u, h = 0, g = p; g; g = d(g)) h++;
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
						l !== null && Vd(s, c, l, d, !1), u !== null && f !== null && Vd(s, f, u, d, !0);
					}
				}
				a: {
					if (c = r ? Tt(r) : window, l = c.nodeName && c.nodeName.toLowerCase(), l === "select" || l === "input" && c.type === "file") var v = vr;
					else if (fr(c)) if (yr) v = Or;
					else {
						v = Er;
						var y = Tr;
					}
					else l = c.nodeName, !l || l.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? r && rn(r.elementType) && (v = vr) : v = Dr;
					if (v &&= v(e, r)) {
						pr(s, v, n, i);
						break a;
					}
					y && y(e, c, r), e === "focusout" && r && c.type === "number" && r.memoizedProps.value != null && Yt(c, "number", c.value);
				}
				switch (y = r ? Tt(r) : window, e) {
					case "focusin":
						(fr(y) || y.contentEditable === "true") && (Rr = y, zr = r, Br = null);
						break;
					case "focusout":
						Br = zr = Rr = null;
						break;
					case "mousedown":
						Vr = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						Vr = !1, Hr(s, n, i);
						break;
					case "selectionchange": if (Lr) break;
					case "keydown":
					case "keyup": Hr(s, n, i);
				}
				var b;
				if (er) b: {
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
				else cr ? or(e, n) && (x = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (x = "onCompositionStart");
				x && (rr && n.locale !== "ko" && (cr || x !== "onCompositionStart" ? x === "onCompositionEnd" && cr && (b = Cn()) : (bn = i, xn = "value" in bn ? bn.value : bn.textContent, cr = !0)), y = zd(r, x), 0 < y.length && (x = new Vn(x, e, null, n, i), s.push({
					event: x,
					listeners: y
				}), b ? x.data = b : (b = sr(n), b !== null && (x.data = b)))), (b = nr ? lr(e, n) : ur(e, n)) && (x = zd(r, "onBeforeInput"), 0 < x.length && (y = new Vn("onBeforeInput", "beforeinput", null, n, i), s.push({
					event: y,
					listeners: x
				}), y.data = b)), Dd(s, e, r, n, i);
			}
			Md(s, t);
		});
	}
	function Rd(e, t, n) {
		return {
			instance: e,
			listener: t,
			currentTarget: n
		};
	}
	function zd(e, t) {
		for (var n = t + "Capture", r = []; e !== null;) {
			var i = e, a = i.stateNode;
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = gn(e, n), i != null && r.unshift(Rd(e, i, a)), i = gn(e, t), i != null && r.push(Rd(e, i, a))), e.tag === 3) return r;
			e = e.return;
		}
		return [];
	}
	function Bd(e) {
		if (e === null) return null;
		do
			e = e.return;
		while (e && e.tag !== 5 && e.tag !== 27);
		return e || null;
	}
	function Vd(e, t, n, r, i) {
		for (var a = t._reactName, o = []; n !== null && n !== r;) {
			var s = n, c = s.alternate, l = s.stateNode;
			if (s = s.tag, c !== null && c === r) break;
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = gn(n, a), l != null && o.unshift(Rd(n, l, c))) : i || (l = gn(n, a), l != null && o.push(Rd(n, l, c)))), n = n.return;
		}
		o.length !== 0 && e.push({
			event: t,
			listeners: o
		});
	}
	var Hd = /\r\n?/g, Ud = /\u0000|\uFFFD/g;
	function Wd(e) {
		return (typeof e == "string" ? e : "" + e).replace(Hd, "\n").replace(Ud, "");
	}
	function Gd(e, t) {
		return t = Wd(t), Wd(e) === t;
	}
	function Kd(e, t, n, r, a, o) {
		switch (n) {
			case "children":
				typeof r == "string" ? t === "body" || t === "textarea" && r === "" || $t(e, r) : (typeof r == "number" || typeof r == "bigint") && t !== "body" && $t(e, "" + r);
				break;
			case "className":
				Lt(e, "class", r);
				break;
			case "tabIndex":
				Lt(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				Lt(e, n, r);
				break;
			case "style":
				nn(e, r, o);
				break;
			case "data": if (t !== "object") {
				Lt(e, "data", r);
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
				r = sn("" + r), e.setAttribute(n, r);
				break;
			case "action":
			case "formAction":
				if (typeof r == "function") {
					e.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
					break;
				} else typeof o == "function" && (n === "formAction" ? (t !== "input" && Kd(e, t, "name", a.name, a, null), Kd(e, t, "formEncType", a.formEncType, a, null), Kd(e, t, "formMethod", a.formMethod, a, null), Kd(e, t, "formTarget", a.formTarget, a, null)) : (Kd(e, t, "encType", a.encType, a, null), Kd(e, t, "method", a.method, a, null), Kd(e, t, "target", a.target, a, null)));
				if (r == null || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = sn("" + r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = cn);
				break;
			case "onScroll":
				r != null && z("scroll", e);
				break;
			case "onScrollEnd":
				r != null && z("scrollend", e);
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
				n = sn("" + r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
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
				z("beforetoggle", e), z("toggle", e), It(e, "popover", r);
				break;
			case "xlinkActuate":
				Rt(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				Rt(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				Rt(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				Rt(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				Rt(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				Rt(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				Rt(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				Rt(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				Rt(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				It(e, "is", r);
				break;
			case "innerText":
			case "textContent": break;
			default: (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (n = an.get(n) || n, It(e, n, r));
		}
	}
	function qd(e, t, n, r, a, o) {
		switch (n) {
			case "style":
				nn(e, r, o);
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
				typeof r == "string" ? $t(e, r) : (typeof r == "number" || typeof r == "bigint") && $t(e, "" + r);
				break;
			case "onScroll":
				r != null && z("scroll", e);
				break;
			case "onScrollEnd":
				r != null && z("scrollend", e);
				break;
			case "onClick":
				r != null && (e.onclick = cn);
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": break;
			case "innerText":
			case "textContent": break;
			default: if (!kt.hasOwnProperty(n)) a: {
				if (n[0] === "o" && n[1] === "n" && (a = n.endsWith("Capture"), t = n.slice(2, a ? n.length - 7 : void 0), o = e[ht] || null, o = o == null ? null : o[n], typeof o == "function" && e.removeEventListener(t, o, a), typeof r == "function")) {
					typeof o != "function" && o !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(t, r, a);
					break a;
				}
				n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : It(e, n, r);
			}
		}
	}
	function Jd(e, t, n) {
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
				z("error", e), z("load", e);
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
						default: Kd(e, t, o, s, n, null);
					}
				}
				a && Kd(e, t, "srcSet", n.srcSet, n, null), r && Kd(e, t, "src", n.src, n, null);
				return;
			case "input":
				z("invalid", e);
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
						default: Kd(e, t, r, d, n, null);
					}
				}
				Jt(e, o, c, l, u, s, a, !1);
				return;
			case "select":
				for (a in z("invalid", e), r = s = o = null, n) if (n.hasOwnProperty(a) && (c = n[a], c != null)) switch (a) {
					case "value":
						o = c;
						break;
					case "defaultValue":
						s = c;
						break;
					case "multiple": r = c;
					default: Kd(e, t, a, c, n, null);
				}
				t = o, n = s, e.multiple = !!r, t == null ? n != null && Xt(e, !!r, n, !0) : Xt(e, !!r, t, !1);
				return;
			case "textarea":
				for (s in z("invalid", e), o = a = r = null, n) if (n.hasOwnProperty(s) && (c = n[s], c != null)) switch (s) {
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
					default: Kd(e, t, s, c, n, null);
				}
				Qt(e, r, a, o);
				return;
			case "option":
				for (l in n) if (n.hasOwnProperty(l) && (r = n[l], r != null)) switch (l) {
					case "selected":
						e.selected = r && typeof r != "function" && typeof r != "symbol";
						break;
					default: Kd(e, t, l, r, n, null);
				}
				return;
			case "dialog":
				z("beforetoggle", e), z("toggle", e), z("cancel", e), z("close", e);
				break;
			case "iframe":
			case "object":
				z("load", e);
				break;
			case "video":
			case "audio":
				for (r = 0; r < Ad.length; r++) z(Ad[r], e);
				break;
			case "image":
				z("error", e), z("load", e);
				break;
			case "details":
				z("toggle", e);
				break;
			case "embed":
			case "source":
			case "link": z("error", e), z("load", e);
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
					default: Kd(e, t, u, r, n, null);
				}
				return;
			default: if (rn(t)) {
				for (d in n) n.hasOwnProperty(d) && (r = n[d], r !== void 0 && qd(e, t, d, r, n, void 0));
				return;
			}
		}
		for (c in n) n.hasOwnProperty(c) && (r = n[c], r != null && Kd(e, t, c, r, n, null));
	}
	function Yd(e, t, n, r) {
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
						default: r.hasOwnProperty(m) || Kd(e, t, m, null, r, f);
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
						default: m !== f && Kd(e, t, p, m, r, f);
					}
				}
				qt(e, s, c, l, u, d, o, a);
				return;
			case "select":
				for (o in m = s = c = p = null, n) if (l = n[o], n.hasOwnProperty(o) && l != null) switch (o) {
					case "value": break;
					case "multiple": m = l;
					default: r.hasOwnProperty(o) || Kd(e, t, o, null, r, l);
				}
				for (a in r) if (o = r[a], l = n[a], r.hasOwnProperty(a) && (o != null || l != null)) switch (a) {
					case "value":
						p = o;
						break;
					case "defaultValue":
						c = o;
						break;
					case "multiple": s = o;
					default: o !== l && Kd(e, t, a, o, r, l);
				}
				t = c, n = s, r = m, p == null ? !!r != !!n && (t == null ? Xt(e, !!n, n ? [] : "", !1) : Xt(e, !!n, t, !0)) : Xt(e, !!n, p, !1);
				return;
			case "textarea":
				for (c in m = p = null, n) if (a = n[c], n.hasOwnProperty(c) && a != null && !r.hasOwnProperty(c)) switch (c) {
					case "value": break;
					case "children": break;
					default: Kd(e, t, c, null, r, a);
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
					default: a !== o && Kd(e, t, s, a, r, o);
				}
				Zt(e, p, m);
				return;
			case "option":
				for (var h in n) if (p = n[h], n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h)) switch (h) {
					case "selected":
						e.selected = !1;
						break;
					default: Kd(e, t, h, null, r, p);
				}
				for (l in r) if (p = r[l], m = n[l], r.hasOwnProperty(l) && p !== m && (p != null || m != null)) switch (l) {
					case "selected":
						e.selected = p && typeof p != "function" && typeof p != "symbol";
						break;
					default: Kd(e, t, l, p, r, m);
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
				for (var g in n) p = n[g], n.hasOwnProperty(g) && p != null && !r.hasOwnProperty(g) && Kd(e, t, g, null, r, p);
				for (u in r) if (p = r[u], m = n[u], r.hasOwnProperty(u) && p !== m && (p != null || m != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML":
						if (p != null) throw Error(i(137, t));
						break;
					default: Kd(e, t, u, p, r, m);
				}
				return;
			default: if (rn(t)) {
				for (var _ in n) p = n[_], n.hasOwnProperty(_) && p !== void 0 && !r.hasOwnProperty(_) && qd(e, t, _, void 0, r, p);
				for (d in r) p = r[d], m = n[d], !r.hasOwnProperty(d) || p === m || p === void 0 && m === void 0 || qd(e, t, d, p, r, m);
				return;
			}
		}
		for (var v in n) p = n[v], n.hasOwnProperty(v) && p != null && !r.hasOwnProperty(v) && Kd(e, t, v, null, r, p);
		for (f in r) p = r[f], m = n[f], !r.hasOwnProperty(f) || p === m || p == null && m == null || Kd(e, t, f, p, r, m);
	}
	function Xd(e) {
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
	function Zd() {
		if (typeof performance.getEntriesByType == "function") {
			for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), r = 0; r < n.length; r++) {
				var i = n[r], a = i.transferSize, o = i.initiatorType, s = i.duration;
				if (a && s && Xd(o)) {
					for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
						var c = n[r], l = c.startTime;
						if (l > s) break;
						var u = c.transferSize, d = c.initiatorType;
						u && Xd(d) && (c = c.responseEnd, o += u * (c < s ? 1 : (s - l) / (c - l)));
					}
					if (--r, t += 8 * (a + o) / (i.duration / 1e3), e++, 10 < e) break;
				}
			}
			if (0 < e) return t / e / 1e6;
		}
		return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
	}
	var Qd = null, $d = null;
	function ef(e) {
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	function tf(e) {
		switch (e) {
			case "http://www.w3.org/2000/svg": return 1;
			case "http://www.w3.org/1998/Math/MathML": return 2;
			default: return 0;
		}
	}
	function nf(e, t) {
		if (e === 0) switch (t) {
			case "svg": return 1;
			case "math": return 2;
			default: return 0;
		}
		return e === 1 && t === "foreignObject" ? 0 : e;
	}
	function rf(e, t) {
		return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
	}
	var af = null;
	function of() {
		var e = window.event;
		return e && e.type === "popstate" ? e === af ? !1 : (af = e, !0) : (af = null, !1);
	}
	var sf = typeof setTimeout == "function" ? setTimeout : void 0, cf = typeof clearTimeout == "function" ? clearTimeout : void 0, lf = typeof Promise == "function" ? Promise : void 0, uf = typeof queueMicrotask == "function" ? queueMicrotask : lf === void 0 ? sf : function(e) {
		return lf.resolve(null).then(e).catch(df);
	};
	function df(e) {
		setTimeout(function() {
			throw e;
		});
	}
	function ff(e) {
		return e === "head";
	}
	function pf(e, t) {
		var n = t, r = 0;
		do {
			var i = n.nextSibling;
			if (e.removeChild(n), i && i.nodeType === 8) if (n = i.data, n === "/$" || n === "/&") {
				if (r === 0) {
					e.removeChild(i), Gp(t);
					return;
				}
				r--;
			} else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&") r++;
			else if (n === "html") Df(e.ownerDocument.documentElement);
			else if (n === "head") {
				n = e.ownerDocument.head, Df(n);
				for (var a = n.firstChild; a;) {
					var o = a.nextSibling, s = a.nodeName;
					a[xt] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
				}
			} else n === "body" && Df(e.ownerDocument.body);
			n = i;
		} while (n);
		Gp(t);
	}
	function mf(e, t) {
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
	function hf(e) {
		var t = e.firstChild;
		for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
			var n = t;
			switch (t = t.nextSibling, n.nodeName) {
				case "HTML":
				case "HEAD":
				case "BODY":
					hf(n), St(n);
					continue;
				case "SCRIPT":
				case "STYLE": continue;
				case "LINK": if (n.rel.toLowerCase() === "stylesheet") continue;
			}
			e.removeChild(n);
		}
	}
	function gf(e, t, n, r) {
		for (; e.nodeType === 1;) {
			var i = n;
			if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
				if (!r && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
			} else if (!r) if (t === "input" && e.type === "hidden") {
				var a = i.name == null ? null : "" + i.name;
				if (i.type === "hidden" && e.getAttribute("name") === a) return e;
			} else return e;
			else if (!e[xt]) switch (t) {
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
			if (e = Sf(e.nextSibling), e === null) break;
		}
		return null;
	}
	function _f(e, t, n) {
		if (t === "") return null;
		for (; e.nodeType !== 3;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = Sf(e.nextSibling), e === null)) return null;
		return e;
	}
	function vf(e, t) {
		for (; e.nodeType !== 8;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = Sf(e.nextSibling), e === null)) return null;
		return e;
	}
	function yf(e) {
		return e.data === "$?" || e.data === "$~";
	}
	function bf(e) {
		return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
	}
	function xf(e, t) {
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
	function Sf(e) {
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
	var Cf = null;
	function wf(e) {
		e = e.nextSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "/$" || n === "/&") {
					if (t === 0) return Sf(e.nextSibling);
					t--;
				} else n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
			}
			e = e.nextSibling;
		}
		return null;
	}
	function Tf(e) {
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
	function Ef(e, t, n) {
		switch (t = ef(n), e) {
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
	function Df(e) {
		for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
		St(e);
	}
	var Of = /* @__PURE__ */ new Map(), kf = /* @__PURE__ */ new Set();
	function B(e) {
		return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
	}
	var Af = O.d;
	O.d = {
		f: jf,
		r: Mf,
		D: Ff,
		C: If,
		L: Lf,
		m: Rf,
		X: Bf,
		S: zf,
		M: Vf
	};
	function jf() {
		var e = Af.f(), t = Mu();
		return e || t;
	}
	function Mf(e) {
		var t = wt(e);
		t !== null && t.tag === 5 && t.type === "form" ? Ns(t) : Af.r(e);
	}
	var Nf = typeof document > "u" ? null : document;
	function Pf(e, t, n) {
		var r = Nf;
		if (r && typeof t == "string" && t) {
			var i = Kt(t);
			i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), kf.has(i) || (kf.add(i), e = {
				rel: e,
				crossOrigin: n,
				href: t
			}, r.querySelector(i) === null && (t = r.createElement("link"), Jd(t, "link", e), Dt(t), r.head.appendChild(t)));
		}
	}
	function Ff(e) {
		Af.D(e), Pf("dns-prefetch", e, null);
	}
	function If(e, t) {
		Af.C(e, t), Pf("preconnect", e, t);
	}
	function Lf(e, t, n) {
		Af.L(e, t, n);
		var r = Nf;
		if (r && e && t) {
			var i = "link[rel=\"preload\"][as=\"" + Kt(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + Kt(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + Kt(n.imageSizes) + "\"]")) : i += "[href=\"" + Kt(e) + "\"]";
			var a = i;
			switch (t) {
				case "style":
					a = Uf(e);
					break;
				case "script": a = qf(e);
			}
			Of.has(a) || (e = p({
				rel: "preload",
				href: t === "image" && n && n.imageSrcSet ? void 0 : e,
				as: t
			}, n), Of.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(Wf(a)) || t === "script" && r.querySelector(V(a)) || (t = r.createElement("link"), Jd(t, "link", e), Dt(t), r.head.appendChild(t)));
		}
	}
	function Rf(e, t) {
		Af.m(e, t);
		var n = Nf;
		if (n && e) {
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + Kt(r) + "\"][href=\"" + Kt(e) + "\"]", a = i;
			switch (r) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script": a = qf(e);
			}
			if (!Of.has(a) && (e = p({
				rel: "modulepreload",
				href: e
			}, t), Of.set(a, e), n.querySelector(i) === null)) {
				switch (r) {
					case "audioworklet":
					case "paintworklet":
					case "serviceworker":
					case "sharedworker":
					case "worker":
					case "script": if (n.querySelector(V(a))) return;
				}
				r = n.createElement("link"), Jd(r, "link", e), Dt(r), n.head.appendChild(r);
			}
		}
	}
	function zf(e, t, n) {
		Af.S(e, t, n);
		var r = Nf;
		if (r && e) {
			var i = Et(r).hoistableStyles, a = Uf(e);
			t ||= "default";
			var o = i.get(a);
			if (!o) {
				var s = {
					loading: 0,
					preload: null
				};
				if (o = r.querySelector(Wf(a))) s.loading = 5;
				else {
					e = p({
						rel: "stylesheet",
						href: e,
						"data-precedence": t
					}, n), (n = Of.get(a)) && Xf(e, n);
					var c = o = r.createElement("link");
					Dt(c), Jd(c, "link", e), c._p = new Promise(function(e, t) {
						c.onload = e, c.onerror = t;
					}), c.addEventListener("load", function() {
						s.loading |= 1;
					}), c.addEventListener("error", function() {
						s.loading |= 2;
					}), s.loading |= 4, Yf(o, t, r);
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
	function Bf(e, t) {
		Af.X(e, t);
		var n = Nf;
		if (n && e) {
			var r = Et(n).hoistableScripts, i = qf(e), a = r.get(i);
			a || (a = n.querySelector(V(i)), a || (e = p({
				src: e,
				async: !0
			}, t), (t = Of.get(i)) && Zf(e, t), a = n.createElement("script"), Dt(a), Jd(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Vf(e, t) {
		Af.M(e, t);
		var n = Nf;
		if (n && e) {
			var r = Et(n).hoistableScripts, i = qf(e), a = r.get(i);
			a || (a = n.querySelector(V(i)), a || (e = p({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = Of.get(i)) && Zf(e, t), a = n.createElement("script"), Dt(a), Jd(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Hf(e, t, n, r) {
		var a = (a = _e.current) ? B(a) : null;
		if (!a) throw Error(i(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (t = Uf(n.href), n = Et(a).hoistableStyles, r = n.get(t), r || (r = {
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
					e = Uf(n.href);
					var o = Et(a).hoistableStyles, s = o.get(e);
					if (s || (a = a.ownerDocument || a, s = {
						type: "stylesheet",
						instance: null,
						count: 0,
						state: {
							loading: 0,
							preload: null
						}
					}, o.set(e, s), (o = a.querySelector(Wf(e))) && !o._p && (s.instance = o, s.state.loading = 5), Of.has(e) || (n = {
						rel: "preload",
						as: "style",
						href: n.href,
						crossOrigin: n.crossOrigin,
						integrity: n.integrity,
						media: n.media,
						hrefLang: n.hrefLang,
						referrerPolicy: n.referrerPolicy
					}, Of.set(e, n), o || Kf(a, e, n, s.state))), t && r === null) throw Error(i(528, ""));
					return s;
				}
				if (t && r !== null) throw Error(i(529, ""));
				return null;
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = qf(n), n = Et(a).hoistableScripts, r = n.get(t), r || (r = {
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
	function Uf(e) {
		return "href=\"" + Kt(e) + "\"";
	}
	function Wf(e) {
		return "link[rel=\"stylesheet\"][" + e + "]";
	}
	function Gf(e) {
		return p({}, e, {
			"data-precedence": e.precedence,
			precedence: null
		});
	}
	function Kf(e, t, n, r) {
		e.querySelector("link[rel=\"preload\"][as=\"style\"][" + t + "]") ? r.loading = 1 : (t = e.createElement("link"), r.preload = t, t.addEventListener("load", function() {
			return r.loading |= 1;
		}), t.addEventListener("error", function() {
			return r.loading |= 2;
		}), Jd(t, "link", n), Dt(t), e.head.appendChild(t));
	}
	function qf(e) {
		return "[src=\"" + Kt(e) + "\"]";
	}
	function V(e) {
		return "script[async]" + e;
	}
	function Jf(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + Kt(n.href) + "\"]");
				if (r) return t.instance = r, Dt(r), r;
				var a = p({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), Dt(r), Jd(r, "style", a), Yf(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				a = Uf(n.href);
				var o = e.querySelector(Wf(a));
				if (o) return t.state.loading |= 4, t.instance = o, Dt(o), o;
				r = Gf(n), (a = Of.get(a)) && Xf(r, a), o = (e.ownerDocument || e).createElement("link"), Dt(o);
				var s = o;
				return s._p = new Promise(function(e, t) {
					s.onload = e, s.onerror = t;
				}), Jd(o, "link", r), t.state.loading |= 4, Yf(o, n.precedence, e), t.instance = o;
			case "script": return o = qf(n.src), (a = e.querySelector(V(o))) ? (t.instance = a, Dt(a), a) : (r = n, (a = Of.get(o)) && (r = p({}, n), Zf(r, a)), e = e.ownerDocument || e, a = e.createElement("script"), Dt(a), Jd(a, "link", r), e.head.appendChild(a), t.instance = a);
			case "void": return null;
			default: throw Error(i(443, t.type));
		}
		else t.type === "stylesheet" && !(t.state.loading & 4) && (r = t.instance, t.state.loading |= 4, Yf(r, n.precedence, e));
		return t.instance;
	}
	function Yf(e, t, n) {
		for (var r = n.querySelectorAll("link[rel=\"stylesheet\"][data-precedence],style[data-precedence]"), i = r.length ? r[r.length - 1] : null, a = i, o = 0; o < r.length; o++) {
			var s = r[o];
			if (s.dataset.precedence === t) a = s;
			else if (a !== i) break;
		}
		a ? a.parentNode.insertBefore(e, a.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
	}
	function Xf(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.title ??= t.title;
	}
	function Zf(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.integrity ??= t.integrity;
	}
	var Qf = null;
	function $f(e, t, n) {
		if (Qf === null) {
			var r = /* @__PURE__ */ new Map(), i = Qf = /* @__PURE__ */ new Map();
			i.set(n, r);
		} else i = Qf, r = i.get(n), r || (r = /* @__PURE__ */ new Map(), i.set(n, r));
		if (r.has(e)) return r;
		for (r.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
			var a = n[i];
			if (!(a[xt] || a[mt] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== "http://www.w3.org/2000/svg") {
				var o = a.getAttribute(t) || "";
				o = e + o;
				var s = r.get(o);
				s ? s.push(a) : r.set(o, [a]);
			}
		}
		return r;
	}
	function ep(e, t, n) {
		e = e.ownerDocument || e, e.head.insertBefore(n, t === "title" ? e.querySelector("head > title") : null);
	}
	function tp(e, t, n) {
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
	function np(e) {
		return !(e.type === "stylesheet" && !(e.state.loading & 3));
	}
	function rp(e, t, n, r) {
		if (n.type === "stylesheet" && (typeof r.media != "string" || !1 !== matchMedia(r.media).matches) && !(n.state.loading & 4)) {
			if (n.instance === null) {
				var i = Uf(r.href), a = t.querySelector(Wf(i));
				if (a) {
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = op.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, Dt(a);
					return;
				}
				a = t.ownerDocument || t, r = Gf(r), (i = Of.get(i)) && Xf(r, i), a = a.createElement("link"), Dt(a);
				var o = a;
				o._p = new Promise(function(e, t) {
					o.onload = e, o.onerror = t;
				}), Jd(a, "link", r), n.instance = a;
			}
			e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && !(n.state.loading & 3) && (e.count++, n = op.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
		}
	}
	var ip = 0;
	function ap(e, t) {
		return e.stylesheets && e.count === 0 && cp(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
			var r = setTimeout(function() {
				if (e.stylesheets && cp(e, e.stylesheets), e.unsuspend) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, 6e4 + t);
			0 < e.imgBytes && ip === 0 && (ip = 62500 * Zd());
			var i = setTimeout(function() {
				if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && cp(e, e.stylesheets), e.unsuspend)) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, (e.imgBytes > ip ? 50 : 800) + t);
			return e.unsuspend = n, function() {
				e.unsuspend = null, clearTimeout(r), clearTimeout(i);
			};
		} : null;
	}
	function op() {
		if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
			if (this.stylesheets) cp(this, this.stylesheets);
			else if (this.unsuspend) {
				var e = this.unsuspend;
				this.unsuspend = null, e();
			}
		}
	}
	var sp = null;
	function cp(e, t) {
		e.stylesheets = null, e.unsuspend !== null && (e.count++, sp = /* @__PURE__ */ new Map(), t.forEach(lp, e), sp = null, op.call(e));
	}
	function lp(e, t) {
		if (!(t.state.loading & 4)) {
			var n = sp.get(e);
			if (n) var r = n.get(null);
			else {
				n = /* @__PURE__ */ new Map(), sp.set(e, n);
				for (var i = e.querySelectorAll("link[data-precedence],style[data-precedence]"), a = 0; a < i.length; a++) {
					var o = i[a];
					(o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (n.set(o.dataset.precedence, o), r = o);
				}
				r && n.set(null, r);
			}
			i = t.instance, o = i.getAttribute("data-precedence"), a = n.get(o) || r, a === r && n.set(null, i), n.set(o, i), this.count++, r = op.bind(this), i.addEventListener("load", r), i.addEventListener("error", r), a ? a.parentNode.insertBefore(i, a.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= 4;
		}
	}
	var up = {
		$$typeof: S,
		Provider: null,
		Consumer: null,
		_currentValue: le,
		_currentValue2: le,
		_threadCount: 0
	};
	function dp(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = rt(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = rt(0), this.hiddenUpdates = rt(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function fp(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new dp(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = gi(3, null, null, t), e.current = a, a.stateNode = e, t = ga(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, qa(a), e;
	}
	function pp(e) {
		return e ? (e = mi, e) : mi;
	}
	function mp(e, t, n, r, i, a) {
		i = pp(i), r.context === null ? r.context = i : r.pendingContext = i, r = Ya(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = Xa(e, r, t), n !== null && (Du(n, e, t), Za(n, e, t));
	}
	function hp(e, t) {
		if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
			var n = e.retryLane;
			e.retryLane = n !== 0 && n < t ? n : t;
		}
	}
	function gp(e, t) {
		hp(e, t), (e = e.alternate) && hp(e, t);
	}
	function _p(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = di(e, 67108864);
			t !== null && Du(t, e, 67108864), gp(e, 67108864);
		}
	}
	function vp(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = Tu();
			t = lt(t);
			var n = di(e, t);
			n !== null && Du(n, e, t), gp(e, t);
		}
	}
	var yp = !0;
	function bp(e, t, n, r) {
		var i = D.T;
		D.T = null;
		var a = O.p;
		try {
			O.p = 2, Sp(e, t, n, r);
		} finally {
			O.p = a, D.T = i;
		}
	}
	function xp(e, t, n, r) {
		var i = D.T;
		D.T = null;
		var a = O.p;
		try {
			O.p = 8, Sp(e, t, n, r);
		} finally {
			O.p = a, D.T = i;
		}
	}
	function Sp(e, t, n, r) {
		if (yp) {
			var i = Cp(r);
			if (i === null) Ld(e, t, r, wp, n), Fp(e, r);
			else if (Lp(i, e, t, n, r)) r.stopPropagation();
			else if (Fp(e, r), t & 4 && -1 < Pp.indexOf(e)) {
				for (; i !== null;) {
					var a = wt(i);
					if (a !== null) switch (a.tag) {
						case 3:
							if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
								var o = Qe(a.pendingLanes);
								if (o !== 0) {
									var s = a;
									for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
										var c = 1 << 31 - Ge(o);
										s.entanglements[1] |= c, o &= ~c;
									}
									gd(a), !(Jl & 6) && (pu = Ne() + 500, _d(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = di(a, 2), s !== null && Du(s, a, 2), Mu(), gp(a, 2);
					}
					if (a = Cp(r), a === null && Ld(e, t, r, wp, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else Ld(e, t, r, null, n);
		}
	}
	function Cp(e) {
		return e = un(e), Tp(e);
	}
	var wp = null;
	function Tp(e) {
		if (wp = null, e = Ct(e), e !== null) {
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
		return wp = e, null;
	}
	function Ep(e) {
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
			case "message": switch (Pe()) {
				case Fe: return 2;
				case Ie: return 8;
				case Le:
				case Re: return 32;
				case ze: return 268435456;
				default: return 32;
			}
			default: return 32;
		}
	}
	var Dp = !1, Op = null, kp = null, Ap = null, jp = /* @__PURE__ */ new Map(), Mp = /* @__PURE__ */ new Map(), Np = [], Pp = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
	function Fp(e, t) {
		switch (e) {
			case "focusin":
			case "focusout":
				Op = null;
				break;
			case "dragenter":
			case "dragleave":
				kp = null;
				break;
			case "mouseover":
			case "mouseout":
				Ap = null;
				break;
			case "pointerover":
			case "pointerout":
				jp.delete(t.pointerId);
				break;
			case "gotpointercapture":
			case "lostpointercapture": Mp.delete(t.pointerId);
		}
	}
	function Ip(e, t, n, r, i, a) {
		return e === null || e.nativeEvent !== a ? (e = {
			blockedOn: t,
			domEventName: n,
			eventSystemFlags: r,
			nativeEvent: a,
			targetContainers: [i]
		}, t !== null && (t = wt(t), t !== null && _p(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
	}
	function Lp(e, t, n, r, i) {
		switch (t) {
			case "focusin": return Op = Ip(Op, e, t, n, r, i), !0;
			case "dragenter": return kp = Ip(kp, e, t, n, r, i), !0;
			case "mouseover": return Ap = Ip(Ap, e, t, n, r, i), !0;
			case "pointerover":
				var a = i.pointerId;
				return jp.set(a, Ip(jp.get(a) || null, e, t, n, r, i)), !0;
			case "gotpointercapture": return a = i.pointerId, Mp.set(a, Ip(Mp.get(a) || null, e, t, n, r, i)), !0;
		}
		return !1;
	}
	function Rp(e) {
		var t = Ct(e.target);
		if (t !== null) {
			var n = o(t);
			if (n !== null) {
				if (t = n.tag, t === 13) {
					if (t = s(n), t !== null) {
						e.blockedOn = t, ft(e.priority, function() {
							vp(n);
						});
						return;
					}
				} else if (t === 31) {
					if (t = c(n), t !== null) {
						e.blockedOn = t, ft(e.priority, function() {
							vp(n);
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
	function zp(e) {
		if (e.blockedOn !== null) return !1;
		for (var t = e.targetContainers; 0 < t.length;) {
			var n = Cp(e.nativeEvent);
			if (n === null) {
				n = e.nativeEvent;
				var r = new n.constructor(n.type, n);
				ln = r, n.target.dispatchEvent(r), ln = null;
			} else return t = wt(n), t !== null && _p(t), e.blockedOn = n, !1;
			t.shift();
		}
		return !0;
	}
	function Bp(e, t, n) {
		zp(e) && n.delete(t);
	}
	function Vp() {
		Dp = !1, Op !== null && zp(Op) && (Op = null), kp !== null && zp(kp) && (kp = null), Ap !== null && zp(Ap) && (Ap = null), jp.forEach(Bp), Mp.forEach(Bp);
	}
	function Hp(e, n) {
		e.blockedOn === n && (e.blockedOn = null, Dp || (Dp = !0, t.unstable_scheduleCallback(t.unstable_NormalPriority, Vp)));
	}
	var Up = null;
	function Wp(e) {
		Up !== e && (Up = e, t.unstable_scheduleCallback(t.unstable_NormalPriority, function() {
			Up === e && (Up = null);
			for (var t = 0; t < e.length; t += 3) {
				var n = e[t], r = e[t + 1], i = e[t + 2];
				if (typeof r != "function") {
					if (Tp(r || n) === null) continue;
					break;
				}
				var a = wt(n);
				a !== null && (e.splice(t, 3), t -= 3, js(a, {
					pending: !0,
					data: i,
					method: n.method,
					action: r
				}, r, i));
			}
		}));
	}
	function Gp(e) {
		function t(t) {
			return Hp(t, e);
		}
		Op !== null && Hp(Op, e), kp !== null && Hp(kp, e), Ap !== null && Hp(Ap, e), jp.forEach(t), Mp.forEach(t);
		for (var n = 0; n < Np.length; n++) {
			var r = Np[n];
			r.blockedOn === e && (r.blockedOn = null);
		}
		for (; 0 < Np.length && (n = Np[0], n.blockedOn === null);) Rp(n), n.blockedOn === null && Np.shift();
		if (n = (e.ownerDocument || e).$$reactFormReplay, n != null) for (r = 0; r < n.length; r += 3) {
			var i = n[r], a = n[r + 1], o = i[ht] || null;
			if (typeof a == "function") o || Wp(n);
			else if (o) {
				var s = null;
				if (a && a.hasAttribute("formAction")) {
					if (i = a, o = a[ht] || null) s = o.formAction;
					else if (Tp(i) !== null) continue;
				} else s = o.action;
				typeof s == "function" ? n[r + 1] = s : (n.splice(r, 3), r -= 3), Wp(n);
			}
		}
	}
	function Kp() {
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
	function qp(e) {
		this._internalRoot = e;
	}
	Jp.prototype.render = qp.prototype.render = function(e) {
		var t = this._internalRoot;
		if (t === null) throw Error(i(409));
		var n = t.current;
		mp(n, Tu(), e, t, null, null);
	}, Jp.prototype.unmount = qp.prototype.unmount = function() {
		var e = this._internalRoot;
		if (e !== null) {
			this._internalRoot = null;
			var t = e.containerInfo;
			mp(e.current, 2, null, e, null, null), Mu(), t[gt] = null;
		}
	};
	function Jp(e) {
		this._internalRoot = e;
	}
	Jp.prototype.unstable_scheduleHydration = function(e) {
		if (e) {
			var t = dt();
			e = {
				blockedOn: null,
				target: e,
				priority: t
			};
			for (var n = 0; n < Np.length && t !== 0 && t < Np[n].priority; n++);
			Np.splice(n, 0, e), n === 0 && Rp(e);
		}
	};
	var Yp = n.version;
	if (Yp !== "19.2.6") throw Error(i(527, Yp, "19.2.6"));
	O.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
		return e = u(t), e = e === null ? null : f(e), e = e === null ? null : e.stateNode, e;
	};
	var Xp = {
		bundleType: 0,
		version: "19.2.6",
		rendererPackageName: "react-dom",
		currentDispatcherRef: D,
		reconcilerVersion: "19.2.6"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var Zp = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!Zp.isDisabled && Zp.supportsFiber) try {
			He = Zp.inject(Xp), Ue = Zp;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!a(e)) throw Error(i(299));
		var n = !1, r = "", o = ec, s = tc, c = nc;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (o = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = fp(e, 1, !1, null, null, n, r, null, o, s, c, Kp), e[gt] = t.current, Fd(e), new qp(t);
	}, e.hydrateRoot = function(e, t, n) {
		if (!a(e)) throw Error(i(299));
		var r = !1, o = "", s = ec, c = tc, l = nc, u = null;
		return n != null && (!0 === n.unstable_strictMode && (r = !0), n.identifierPrefix !== void 0 && (o = n.identifierPrefix), n.onUncaughtError !== void 0 && (s = n.onUncaughtError), n.onCaughtError !== void 0 && (c = n.onCaughtError), n.onRecoverableError !== void 0 && (l = n.onRecoverableError), n.formState !== void 0 && (u = n.formState)), t = fp(e, 1, !0, t, n ?? null, r, o, u, s, c, l, Kp), t.context = pp(null), n = t.current, r = Tu(), r = lt(r), o = Ya(r), o.callback = null, Xa(n, o, r), n = r, t.current.lanes = n, it(t, n), gd(t), e[gt] = t.current, Fd(e), new Jp(t);
	}, e.version = "19.2.6";
})), y = /* @__PURE__ */ o(((e) => {
	process.env.NODE_ENV !== "production" && (function() {
		function t(e, t) {
			for (e = e.memoizedState; e !== null && 0 < t;) e = e.next, t--;
			return e;
		}
		function n(e, t, r, i) {
			if (r >= t.length) return i;
			var a = t[r], o = qf(e) ? e.slice() : B({}, e);
			return o[a] = n(e[a], t, r + 1, i), o;
		}
		function r(e, t, n) {
			if (t.length !== n.length) console.warn("copyWithRename() expects paths of the same length");
			else {
				for (var r = 0; r < n.length - 1; r++) if (t[r] !== n[r]) {
					console.warn("copyWithRename() expects paths to be the same except for the deepest key");
					return;
				}
				return i(e, t, n, 0);
			}
		}
		function i(e, t, n, r) {
			var a = t[r], o = qf(e) ? e.slice() : B({}, e);
			return r + 1 === t.length ? (o[n[r]] = o[a], qf(o) ? o.splice(a, 1) : delete o[a]) : o[a] = i(e[a], t, n, r + 1), o;
		}
		function a(e, t, n) {
			var r = t[n], i = qf(e) ? e.slice() : B({}, e);
			return n + 1 === t.length ? (qf(i) ? i.splice(r, 1) : delete i[r], i) : (i[r] = a(e[r], t, n + 1), i);
		}
		function o() {
			return !1;
		}
		function s() {
			return null;
		}
		function c() {
			console.error("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://react.dev/link/rules-of-hooks");
		}
		function l() {
			console.error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
		}
		function u() {}
		function f() {}
		function p(e) {
			var t = [];
			return e.forEach(function(e) {
				t.push(e);
			}), t.sort().join(", ");
		}
		function h(e, t, n, r) {
			return new xr(e, t, n, r);
		}
		function g(e, t) {
			e.context === Pg && (ef(e.current, 2, t, e, null, null), sl());
		}
		function v(e, t) {
			if (Fg !== null) {
				var n = t.staleFamilies;
				t = t.updatedFamilies, Nl(), br(e.current, t, n), sl();
			}
		}
		function y(e) {
			Fg = e;
		}
		function b(e) {
			return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
		}
		function x(e) {
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
		function ee(e) {
			if (e.tag === 13) {
				var t = e.memoizedState;
				if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
			}
			return null;
		}
		function S(e) {
			if (e.tag === 31) {
				var t = e.memoizedState;
				if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
			}
			return null;
		}
		function C(e) {
			if (x(e) !== e) throw Error("Unable to find node on an unmounted component.");
		}
		function te(e) {
			var t = e.alternate;
			if (!t) {
				if (t = x(e), t === null) throw Error("Unable to find node on an unmounted component.");
				return t === e ? e : null;
			}
			for (var n = e, r = t;;) {
				var i = n.return;
				if (i === null) break;
				var a = i.alternate;
				if (a === null) {
					if (r = i.return, r !== null) {
						n = r;
						continue;
					}
					break;
				}
				if (i.child === a.child) {
					for (a = i.child; a;) {
						if (a === n) return C(i), e;
						if (a === r) return C(i), t;
						a = a.sibling;
					}
					throw Error("Unable to find node on an unmounted component.");
				}
				if (n.return !== r.return) n = i, r = a;
				else {
					for (var o = !1, s = i.child; s;) {
						if (s === n) {
							o = !0, n = i, r = a;
							break;
						}
						if (s === r) {
							o = !0, r = i, n = a;
							break;
						}
						s = s.sibling;
					}
					if (!o) {
						for (s = a.child; s;) {
							if (s === n) {
								o = !0, n = a, r = i;
								break;
							}
							if (s === r) {
								o = !0, r = a, n = i;
								break;
							}
							s = s.sibling;
						}
						if (!o) throw Error("Child was not found in either parent set. This indicates a bug in React related to the return pointer. Please file an issue.");
					}
				}
				if (n.alternate !== r) throw Error("Return fibers should always be each others' alternates. This error is likely caused by a bug in React. Please file an issue.");
			}
			if (n.tag !== 3) throw Error("Unable to find node on an unmounted component.");
			return n.stateNode.current === n ? e : t;
		}
		function ne(e) {
			var t = e.tag;
			if (t === 5 || t === 26 || t === 27 || t === 6) return e;
			for (e = e.child; e !== null;) {
				if (t = ne(e), t !== null) return t;
				e = e.sibling;
			}
			return null;
		}
		function re(e) {
			return typeof e != "object" || !e ? null : (e = Gf && e[Gf] || e["@@iterator"], typeof e == "function" ? e : null);
		}
		function w(e) {
			if (e == null) return null;
			if (typeof e == "function") return e.$$typeof === Kf ? null : e.displayName || e.name || null;
			if (typeof e == "string") return e;
			switch (e) {
				case Nf: return "Fragment";
				case Ff: return "Profiler";
				case Pf: return "StrictMode";
				case zf: return "Suspense";
				case Bf: return "SuspenseList";
				case Uf: return "Activity";
			}
			if (typeof e == "object") switch (typeof e.tag == "number" && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), e.$$typeof) {
				case Mf: return "Portal";
				case Lf: return e.displayName || "Context";
				case If: return (e._context.displayName || "Context") + ".Consumer";
				case Rf:
					var t = e.render;
					return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
				case Vf: return t = e.displayName || null, t === null ? w(e.type) || "Memo" : t;
				case Hf:
					t = e._payload, e = e._init;
					try {
						return w(e(t));
					} catch {}
			}
			return null;
		}
		function ie(e) {
			return typeof e.tag == "number" ? T(e) : typeof e.name == "string" ? e.name : null;
		}
		function T(e) {
			var t = e.type;
			switch (e.tag) {
				case 31: return "Activity";
				case 24: return "Cache";
				case 9: return (t._context.displayName || "Context") + ".Consumer";
				case 10: return t.displayName || "Context";
				case 18: return "DehydratedFragment";
				case 11: return e = t.render, e = e.displayName || e.name || "", t.displayName || (e === "" ? "ForwardRef" : "ForwardRef(" + e + ")");
				case 7: return "Fragment";
				case 26:
				case 27:
				case 5: return t;
				case 4: return "Portal";
				case 3: return "Root";
				case 6: return "Text";
				case 16: return w(t);
				case 8: return t === Pf ? "StrictMode" : "Mode";
				case 22: return "Offscreen";
				case 12: return "Profiler";
				case 21: return "Scope";
				case 13: return "Suspense";
				case 19: return "SuspenseList";
				case 25: return "TracingMarker";
				case 1:
				case 0:
				case 14:
				case 15:
					if (typeof t == "function") return t.displayName || t.name || null;
					if (typeof t == "string") return t;
					break;
				case 29:
					if (t = e._debugInfo, t != null) {
						for (var n = t.length - 1; 0 <= n; n--) if (typeof t[n].name == "string") return t[n].name;
					}
					if (e.return !== null) return T(e.return);
			}
			return null;
		}
		function ae(e) {
			return { current: e };
		}
		function oe(e, t) {
			0 > Qf ? console.error("Unexpected pop.") : (t !== Zf[Qf] && console.error("Unexpected Fiber popped."), e.current = Xf[Qf], Xf[Qf] = null, Zf[Qf] = null, Qf--);
		}
		function E(e, t, n) {
			Qf++, Xf[Qf] = e.current, Zf[Qf] = n, e.current = t;
		}
		function se(e) {
			return e === null && console.error("Expected host context to exist. This error is likely caused by a bug in React. Please file an issue."), e;
		}
		function ce(e, t) {
			E(tp, t, e), E(ep, e, e), E($f, null, e);
			var n = t.nodeType;
			switch (n) {
				case 9:
				case 11:
					n = n === 9 ? "#document" : "#fragment", t = (t = t.documentElement) && (t = t.namespaceURI) ? Vu(t) : WS;
					break;
				default: if (n = t.tagName, t = t.namespaceURI) t = Vu(t), t = Hu(t, n);
				else switch (n) {
					case "svg":
						t = GS;
						break;
					case "math":
						t = KS;
						break;
					default: t = WS;
				}
			}
			n = n.toLowerCase(), n = Ut(null, n), n = {
				context: t,
				ancestorInfo: n
			}, oe($f, e), E($f, n, e);
		}
		function D(e) {
			oe($f, e), oe(ep, e), oe(tp, e);
		}
		function O() {
			return se($f.current);
		}
		function le(e) {
			e.memoizedState !== null && E(np, e, e);
			var t = se($f.current), n = e.type, r = Hu(t.context, n);
			n = Ut(t.ancestorInfo, n), r = {
				context: r,
				ancestorInfo: n
			}, t !== r && (E(ep, e, e), E($f, r, e));
		}
		function ue(e) {
			ep.current === e && (oe($f, e), oe(ep, e)), np.current === e && (oe(np, e), xC._currentValue = bC);
		}
		function de() {}
		function fe() {
			if (rp === 0) {
				ip = console.log, ap = console.info, op = console.warn, sp = console.error, cp = console.group, lp = console.groupCollapsed, up = console.groupEnd;
				var e = {
					configurable: !0,
					enumerable: !0,
					value: de,
					writable: !0
				};
				Object.defineProperties(console, {
					info: e,
					log: e,
					warn: e,
					error: e,
					group: e,
					groupCollapsed: e,
					groupEnd: e
				});
			}
			rp++;
		}
		function pe() {
			if (rp--, rp === 0) {
				var e = {
					configurable: !0,
					enumerable: !0,
					writable: !0
				};
				Object.defineProperties(console, {
					log: B({}, e, { value: ip }),
					info: B({}, e, { value: ap }),
					warn: B({}, e, { value: op }),
					error: B({}, e, { value: sp }),
					group: B({}, e, { value: cp }),
					groupCollapsed: B({}, e, { value: lp }),
					groupEnd: B({}, e, { value: up })
				});
			}
			0 > rp && console.error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
		}
		function me(e) {
			var t = Error.prepareStackTrace;
			if (Error.prepareStackTrace = void 0, e = e.stack, Error.prepareStackTrace = t, e.startsWith("Error: react-stack-top-frame\n") && (e = e.slice(29)), t = e.indexOf("\n"), t !== -1 && (e = e.slice(t + 1)), t = e.indexOf("react_stack_bottom_frame"), t !== -1 && (t = e.lastIndexOf("\n", t)), t !== -1) e = e.slice(0, t);
			else return "";
			return e;
		}
		function he(e) {
			if (dp === void 0) try {
				throw Error();
			} catch (e) {
				var t = e.stack.trim().match(/\n( *(at )?)/);
				dp = t && t[1] || "", fp = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
			}
			return "\n" + dp + e + fp;
		}
		function ge(e, t) {
			if (!e || pp) return "";
			var n = mp.get(e);
			if (n !== void 0) return n;
			pp = !0, n = Error.prepareStackTrace, Error.prepareStackTrace = void 0;
			var r = null;
			r = V.H, V.H = null, fe();
			try {
				var i = { DetermineComponentFrameRoot: function() {
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
				i.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
				var a = Object.getOwnPropertyDescriptor(i.DetermineComponentFrameRoot, "name");
				a && a.configurable && Object.defineProperty(i.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
				var o = i.DetermineComponentFrameRoot(), s = o[0], c = o[1];
				if (s && c) {
					var l = s.split("\n"), u = c.split("\n");
					for (o = a = 0; a < l.length && !l[a].includes("DetermineComponentFrameRoot");) a++;
					for (; o < u.length && !u[o].includes("DetermineComponentFrameRoot");) o++;
					if (a === l.length || o === u.length) for (a = l.length - 1, o = u.length - 1; 1 <= a && 0 <= o && l[a] !== u[o];) o--;
					for (; 1 <= a && 0 <= o; a--, o--) if (l[a] !== u[o]) {
						if (a !== 1 || o !== 1) do
							if (a--, o--, 0 > o || l[a] !== u[o]) {
								var d = "\n" + l[a].replace(" at new ", " at ");
								return e.displayName && d.includes("<anonymous>") && (d = d.replace("<anonymous>", e.displayName)), typeof e == "function" && mp.set(e, d), d;
							}
						while (1 <= a && 0 <= o);
						break;
					}
				}
			} finally {
				pp = !1, V.H = r, pe(), Error.prepareStackTrace = n;
			}
			return l = (l = e ? e.displayName || e.name : "") ? he(l) : "", typeof e == "function" && mp.set(e, l), l;
		}
		function _e(e, t) {
			switch (e.tag) {
				case 26:
				case 27:
				case 5: return he(e.type);
				case 16: return he("Lazy");
				case 13: return e.child !== t && t !== null ? he("Suspense Fallback") : he("Suspense");
				case 19: return he("SuspenseList");
				case 0:
				case 15: return ge(e.type, !1);
				case 11: return ge(e.type.render, !1);
				case 1: return ge(e.type, !0);
				case 31: return he("Activity");
				default: return "";
			}
		}
		function ve(e) {
			try {
				var t = "", n = null;
				do {
					t += _e(e, n);
					var r = e._debugInfo;
					if (r) for (var i = r.length - 1; 0 <= i; i--) {
						var a = r[i];
						if (typeof a.name == "string") {
							var o = t;
							a: {
								var s = a.name, c = a.env, l = a.debugLocation;
								if (l != null) {
									var u = me(l), d = u.lastIndexOf("\n"), f = d === -1 ? u : u.slice(d + 1);
									if (f.indexOf(s) !== -1) {
										var p = "\n" + f;
										break a;
									}
								}
								p = he(s + (c ? " [" + c + "]" : ""));
							}
							t = o + p;
						}
					}
					n = e, e = e.return;
				} while (e);
				return t;
			} catch (e) {
				return "\nError generating stack: " + e.message + "\n" + e.stack;
			}
		}
		function ye(e) {
			return (e = e ? e.displayName || e.name : "") ? he(e) : "";
		}
		function be() {
			if (hp === null) return null;
			var e = hp._debugOwner;
			return e == null ? null : ie(e);
		}
		function xe() {
			if (hp === null) return "";
			var e = hp;
			try {
				var t = "";
				switch (e.tag === 6 && (e = e.return), e.tag) {
					case 26:
					case 27:
					case 5:
						t += he(e.type);
						break;
					case 13:
						t += he("Suspense");
						break;
					case 19:
						t += he("SuspenseList");
						break;
					case 31:
						t += he("Activity");
						break;
					case 30:
					case 0:
					case 15:
					case 1:
						e._debugOwner || t !== "" || (t += ye(e.type));
						break;
					case 11: e._debugOwner || t !== "" || (t += ye(e.type.render));
				}
				for (; e;) if (typeof e.tag == "number") {
					var n = e;
					e = n._debugOwner;
					var r = n._debugStack;
					if (e && r) {
						var i = me(r);
						i !== "" && (t += "\n" + i);
					}
				} else if (e.debugStack != null) {
					var a = e.debugStack;
					(e = e.owner) && a && (t += "\n" + me(a));
				} else break;
				var o = t;
			} catch (e) {
				o = "\nError generating stack: " + e.message + "\n" + e.stack;
			}
			return o;
		}
		function k(e, t, n, r, i, a, o) {
			var s = hp;
			Se(e);
			try {
				return e !== null && e._debugTask ? e._debugTask.run(t.bind(null, n, r, i, a, o)) : t(n, r, i, a, o);
			} finally {
				Se(s);
			}
			throw Error("runWithFiberInDEV should never be called in production. This is a bug in React.");
		}
		function Se(e) {
			V.getCurrentStack = e === null ? null : xe, gp = !1, hp = e;
		}
		function Ce(e) {
			return typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
		}
		function we(e) {
			try {
				return Te(e), !1;
			} catch {
				return !0;
			}
		}
		function Te(e) {
			return "" + e;
		}
		function A(e, t) {
			if (we(e)) return console.error("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before using it here.", t, Ce(e)), Te(e);
		}
		function Ee(e, t) {
			if (we(e)) return console.error("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before using it here.", t, Ce(e)), Te(e);
		}
		function De(e) {
			if (we(e)) return console.error("Form field values (value, checked, defaultValue, or defaultChecked props) must be strings, not %s. This value must be coerced to a string before using it here.", Ce(e)), Te(e);
		}
		function Oe(e) {
			if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u") return !1;
			var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
			if (t.isDisabled) return !0;
			if (!t.supportsFiber) return console.error("The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://react.dev/link/react-devtools"), !0;
			try {
				jp = t.inject(e), Mp = t;
			} catch (e) {
				console.error("React instrumentation encountered an error: %o.", e);
			}
			return !!t.checkDCE;
		}
		function ke(e) {
			if (typeof kp == "function" && Ap(e), Mp && typeof Mp.setStrictMode == "function") try {
				Mp.setStrictMode(jp, e);
			} catch (e) {
				Np || (Np = !0, console.error("React instrumentation encountered an error: %o", e));
			}
		}
		function Ae(e) {
			return e >>>= 0, e === 0 ? 32 : 31 - (Ip(e) / Lp | 0) | 0;
		}
		function je(e) {
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
				default: return console.error("Should have found matching lanes. This is a bug in React."), e;
			}
		}
		function Me(e, t, n) {
			var r = e.pendingLanes;
			if (r === 0) return 0;
			var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
			e = e.warmLanes;
			var s = r & 134217727;
			return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = je(n))) : i = je(o) : i = je(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = je(n))) : i = je(o)) : i = je(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
		}
		function Ne(e, t) {
			return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
		}
		function Pe(e, t) {
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
				default: return console.error("Should have found matching lanes. This is a bug in React."), -1;
			}
		}
		function Fe() {
			var e = Bp;
			return Bp <<= 1, !(Bp & 62914560) && (Bp = 4194304), e;
		}
		function Ie(e) {
			for (var t = [], n = 0; 31 > n; n++) t.push(e);
			return t;
		}
		function Le(e, t) {
			e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
		}
		function Re(e, t, n, r, i, a) {
			var o = e.pendingLanes;
			e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
			var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
			for (n = o & ~n; 0 < n;) {
				var u = 31 - Fp(n), d = 1 << u;
				s[u] = 0, c[u] = -1;
				var f = l[u];
				if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
					var p = f[u];
					p !== null && (p.lane &= -536870913);
				}
				n &= ~d;
			}
			r !== 0 && ze(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
		}
		function ze(e, t, n) {
			e.pendingLanes |= t, e.suspendedLanes &= ~t;
			var r = 31 - Fp(t);
			e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
		}
		function Be(e, t) {
			var n = e.entangledLanes |= t;
			for (e = e.entanglements; n;) {
				var r = 31 - Fp(n), i = 1 << r;
				i & t | e[r] & t && (e[r] |= t), n &= ~i;
			}
		}
		function Ve(e, t) {
			var n = t & -t;
			return n = n & 42 ? 1 : He(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
		}
		function He(e) {
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
		function Ue(e, t, n) {
			if (Pp) for (e = e.pendingUpdatersLaneMap; 0 < n;) {
				var r = 31 - Fp(n), i = 1 << r;
				e[r].add(t), n &= ~i;
			}
		}
		function We(e, t) {
			if (Pp) for (var n = e.pendingUpdatersLaneMap, r = e.memoizedUpdaters; 0 < t;) {
				var i = 31 - Fp(t);
				e = 1 << i, i = n[i], 0 < i.size && (i.forEach(function(e) {
					var t = e.alternate;
					t !== null && r.has(t) || r.add(e);
				}), i.clear()), t &= ~e;
			}
		}
		function Ge(e) {
			return e &= -e, Vp !== 0 && Vp < e ? Hp !== 0 && Hp < e ? e & 134217727 ? Up : Wp : Hp : Vp;
		}
		function Ke() {
			var e = Jf.p;
			return e === 0 ? (e = window.event, e === void 0 ? Up : ff(e.type)) : e;
		}
		function qe(e, t) {
			var n = Jf.p;
			try {
				return Jf.p = e, t();
			} finally {
				Jf.p = n;
			}
		}
		function Je(e) {
			delete e[Kp], delete e[qp], delete e[Yp], delete e[Xp], delete e[Zp];
		}
		function Ye(e) {
			var t = e[Kp];
			if (t) return t;
			for (var n = e.parentNode; n;) {
				if (t = n[Jp] || n[Kp]) {
					if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = Sd(e); e !== null;) {
						if (n = e[Kp]) return n;
						e = Sd(e);
					}
					return t;
				}
				e = n, n = e.parentNode;
			}
			return null;
		}
		function Xe(e) {
			if (e = e[Kp] || e[Jp]) {
				var t = e.tag;
				if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
			}
			return null;
		}
		function Ze(e) {
			var t = e.tag;
			if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
			throw Error("getNodeFromInstance: Invalid argument.");
		}
		function Qe(e) {
			var t = e[Qp];
			return t ||= e[Qp] = {
				hoistableStyles: /* @__PURE__ */ new Map(),
				hoistableScripts: /* @__PURE__ */ new Map()
			}, t;
		}
		function $e(e) {
			e[$p] = !0;
		}
		function et(e, t) {
			tt(e, t), tt(e + "Capture", t);
		}
		function tt(e, t) {
			tm[e] && console.error("EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.", e), tm[e] = t;
			var n = e.toLowerCase();
			for (nm[n] = e, e === "onDoubleClick" && (nm.ondblclick = e), e = 0; e < t.length; e++) em.add(t[e]);
		}
		function nt(e, t) {
			rm[t.type] || t.onChange || t.onInput || t.readOnly || t.disabled || t.value == null || console.error(e === "select" ? "You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set `onChange`." : "You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."), t.onChange || t.readOnly || t.disabled || t.checked == null || console.error("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
		}
		function rt(e) {
			return _p.call(om, e) ? !0 : _p.call(am, e) ? !1 : im.test(e) ? om[e] = !0 : (am[e] = !0, console.error("Invalid attribute name: `%s`", e), !1);
		}
		function it(e, t, n) {
			if (rt(t)) {
				if (!e.hasAttribute(t)) {
					switch (typeof n) {
						case "symbol":
						case "object": return n;
						case "function": return n;
						case "boolean": if (!1 === n) return n;
					}
					return n === void 0 ? void 0 : null;
				}
				return e = e.getAttribute(t), e === "" && !0 === n ? !0 : (A(n, t), e === "" + n ? n : e);
			}
		}
		function at(e, t, n) {
			if (rt(t)) if (n === null) e.removeAttribute(t);
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
				A(n, t), e.setAttribute(t, "" + n);
			}
		}
		function ot(e, t, n) {
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
				A(n, t), e.setAttribute(t, "" + n);
			}
		}
		function st(e, t, n, r) {
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
				A(r, n), e.setAttributeNS(t, n, "" + r);
			}
		}
		function ct(e) {
			switch (typeof e) {
				case "bigint":
				case "boolean":
				case "number":
				case "string":
				case "undefined": return e;
				case "object": return De(e), e;
				default: return "";
			}
		}
		function lt(e) {
			var t = e.type;
			return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
		}
		function ut(e, t, n) {
			var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
			if (!e.hasOwnProperty(t) && r !== void 0 && typeof r.get == "function" && typeof r.set == "function") {
				var i = r.get, a = r.set;
				return Object.defineProperty(e, t, {
					configurable: !0,
					get: function() {
						return i.call(this);
					},
					set: function(e) {
						De(e), n = "" + e, a.call(this, e);
					}
				}), Object.defineProperty(e, t, { enumerable: r.enumerable }), {
					getValue: function() {
						return n;
					},
					setValue: function(e) {
						De(e), n = "" + e;
					},
					stopTracking: function() {
						e._valueTracker = null, delete e[t];
					}
				};
			}
		}
		function dt(e) {
			if (!e._valueTracker) {
				var t = lt(e) ? "checked" : "value";
				e._valueTracker = ut(e, t, "" + e[t]);
			}
		}
		function ft(e) {
			if (!e) return !1;
			var t = e._valueTracker;
			if (!t) return !0;
			var n = t.getValue(), r = "";
			return e && (r = lt(e) ? e.checked ? "true" : "false" : e.value), e = r, e === n ? !1 : (t.setValue(e), !0);
		}
		function pt(e) {
			if (e ||= typeof document < "u" ? document : void 0, e === void 0) return null;
			try {
				return e.activeElement || e.body;
			} catch {
				return e.body;
			}
		}
		function mt(e) {
			return e.replace(sm, function(e) {
				return "\\" + e.charCodeAt(0).toString(16) + " ";
			});
		}
		function ht(e, t) {
			t.checked === void 0 || t.defaultChecked === void 0 || lm || (console.error("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://react.dev/link/controlled-components", be() || "A component", t.type), lm = !0), t.value === void 0 || t.defaultValue === void 0 || cm || (console.error("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://react.dev/link/controlled-components", be() || "A component", t.type), cm = !0);
		}
		function gt(e, t, n, r, i, a, o, s) {
			e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? (A(o, "type"), e.type = o) : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + ct(t)) : e.value !== "" + ct(t) && (e.value = "" + ct(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : vt(e, o, ct(n)) : vt(e, o, ct(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? (A(s, "name"), e.name = "" + ct(s)) : e.removeAttribute("name");
		}
		function _t(e, t, n, r, i, a, o, s) {
			if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (A(a, "type"), e.type = a), t != null || n != null) {
				if (!(a !== "submit" && a !== "reset" || t != null)) {
					dt(e);
					return;
				}
				n = n == null ? "" : "" + ct(n), t = t == null ? n : "" + ct(t), s || t === e.value || (e.value = t), e.defaultValue = t;
			}
			r ??= i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (A(o, "name"), e.name = o), dt(e);
		}
		function vt(e, t, n) {
			t === "number" && pt(e.ownerDocument) === e || e.defaultValue === "" + n || (e.defaultValue = "" + n);
		}
		function yt(e, t) {
			t.value ?? (typeof t.children == "object" && t.children !== null ? Of.Children.forEach(t.children, function(e) {
				e == null || typeof e == "string" || typeof e == "number" || typeof e == "bigint" || dm || (dm = !0, console.error("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>."));
			}) : t.dangerouslySetInnerHTML == null || fm || (fm = !0, console.error("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected."))), t.selected == null || um || (console.error("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."), um = !0);
		}
		function bt() {
			var e = be();
			return e ? "\n\nCheck the render method of `" + e + "`." : "";
		}
		function xt(e, t, n, r) {
			if (e = e.options, t) {
				t = {};
				for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
				for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
			} else {
				for (n = "" + ct(n), t = null, i = 0; i < e.length; i++) {
					if (e[i].value === n) {
						e[i].selected = !0, r && (e[i].defaultSelected = !0);
						return;
					}
					t !== null || e[i].disabled || (t = e[i]);
				}
				t !== null && (t.selected = !0);
			}
		}
		function St(e, t) {
			for (e = 0; e < mm.length; e++) {
				var n = mm[e];
				if (t[n] != null) {
					var r = qf(t[n]);
					t.multiple && !r ? console.error("The `%s` prop supplied to <select> must be an array if `multiple` is true.%s", n, bt()) : !t.multiple && r && console.error("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.%s", n, bt());
				}
			}
			t.value === void 0 || t.defaultValue === void 0 || pm || (console.error("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://react.dev/link/controlled-components"), pm = !0);
		}
		function Ct(e, t) {
			t.value === void 0 || t.defaultValue === void 0 || hm || (console.error("%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://react.dev/link/controlled-components", be() || "A component"), hm = !0), t.children != null && t.value == null && console.error("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
		}
		function wt(e, t, n) {
			if (t != null && (t = "" + ct(t), t !== e.value && (e.value = t), n == null)) {
				e.defaultValue !== t && (e.defaultValue = t);
				return;
			}
			e.defaultValue = n == null ? "" : "" + ct(n);
		}
		function Tt(e, t, n, r) {
			if (t == null) {
				if (r != null) {
					if (n != null) throw Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
					if (qf(r)) {
						if (1 < r.length) throw Error("<textarea> can only have at most one child.");
						r = r[0];
					}
					n = r;
				}
				n ??= "", t = n;
			}
			n = ct(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), dt(e);
		}
		function Et(e, t) {
			return e.serverProps === void 0 && e.serverTail.length === 0 && e.children.length === 1 && 3 < e.distanceFromLeaf && e.distanceFromLeaf > 15 - t ? Et(e.children[0], t) : e;
		}
		function Dt(e) {
			return "  " + "  ".repeat(e);
		}
		function Ot(e) {
			return "+ " + "  ".repeat(e);
		}
		function kt(e) {
			return "- " + "  ".repeat(e);
		}
		function At(e) {
			switch (e.tag) {
				case 26:
				case 27:
				case 5: return e.type;
				case 16: return "Lazy";
				case 31: return "Activity";
				case 13: return "Suspense";
				case 19: return "SuspenseList";
				case 0:
				case 15: return e = e.type, e.displayName || e.name || null;
				case 11: return e = e.type.render, e.displayName || e.name || null;
				case 1: return e = e.type, e.displayName || e.name || null;
				default: return null;
			}
		}
		function jt(e, t) {
			return gm.test(e) ? (e = JSON.stringify(e), e.length > t - 2 ? 8 > t ? "{\"...\"}" : "{" + e.slice(0, t - 7) + "...\"}" : "{" + e + "}") : e.length > t ? 5 > t ? "{\"...\"}" : e.slice(0, t - 3) + "..." : e;
		}
		function Mt(e, t, n) {
			var r = 120 - 2 * n;
			if (t === null) return Ot(n) + jt(e, r) + "\n";
			if (typeof t == "string") {
				for (var i = 0; i < t.length && i < e.length && t.charCodeAt(i) === e.charCodeAt(i); i++);
				return i > r - 8 && 10 < i && (e = "..." + e.slice(i - 8), t = "..." + t.slice(i - 8)), Ot(n) + jt(e, r) + "\n" + kt(n) + jt(t, r) + "\n";
			}
			return Dt(n) + jt(e, r) + "\n";
		}
		function Nt(e) {
			return Object.prototype.toString.call(e).replace(/^\[object (.*)\]$/, function(e, t) {
				return t;
			});
		}
		function Pt(e, t) {
			switch (typeof e) {
				case "string": return e = JSON.stringify(e), e.length > t ? 5 > t ? "\"...\"" : e.slice(0, t - 4) + "...\"" : e;
				case "object":
					if (e === null) return "null";
					if (qf(e)) return "[...]";
					if (e.$$typeof === jf) return (t = w(e.type)) ? "<" + t + ">" : "<...>";
					var n = Nt(e);
					if (n === "Object") {
						for (var r in n = "", t -= 2, e) if (e.hasOwnProperty(r)) {
							var i = JSON.stringify(r);
							if (i !== "\"" + r + "\"" && (r = i), t -= r.length - 2, i = Pt(e[r], 15 > t ? t : 15), t -= i.length, 0 > t) {
								n += n === "" ? "..." : ", ...";
								break;
							}
							n += (n === "" ? "" : ",") + r + ":" + i;
						}
						return "{" + n + "}";
					}
					return n;
				case "function": return (t = e.displayName || e.name) ? "function " + t : "function";
				default: return String(e);
			}
		}
		function Ft(e, t) {
			return typeof e != "string" || gm.test(e) ? "{" + Pt(e, t - 2) + "}" : e.length > t - 2 ? 5 > t ? "\"...\"" : "\"" + e.slice(0, t - 5) + "...\"" : "\"" + e + "\"";
		}
		function It(e, t, n) {
			var r = 120 - n.length - e.length, i = [], a;
			for (a in t) if (t.hasOwnProperty(a) && a !== "children") {
				var o = Ft(t[a], 120 - n.length - a.length - 1);
				r -= a.length + o.length + 2, i.push(a + "=" + o);
			}
			return i.length === 0 ? n + "<" + e + ">\n" : 0 < r ? n + "<" + e + " " + i.join(" ") + ">\n" : n + "<" + e + "\n" + n + "  " + i.join("\n" + n + "  ") + "\n" + n + ">\n";
		}
		function Lt(e, t, n) {
			var r = "", i = B({}, t), a;
			for (a in e) if (e.hasOwnProperty(a)) {
				delete i[a];
				var o = 120 - 2 * n - a.length - 2, s = Pt(e[a], o);
				t.hasOwnProperty(a) ? (o = Pt(t[a], o), r += Ot(n) + a + ": " + s + "\n", r += kt(n) + a + ": " + o + "\n") : r += Ot(n) + a + ": " + s + "\n";
			}
			for (var c in i) i.hasOwnProperty(c) && (e = Pt(i[c], 120 - 2 * n - c.length - 2), r += kt(n) + c + ": " + e + "\n");
			return r;
		}
		function Rt(e, t, n, r) {
			var i = "", a = /* @__PURE__ */ new Map();
			for (l in n) n.hasOwnProperty(l) && a.set(l.toLowerCase(), l);
			if (a.size === 1 && a.has("children")) i += It(e, t, Dt(r));
			else {
				for (var o in t) if (t.hasOwnProperty(o) && o !== "children") {
					var s = 120 - 2 * (r + 1) - o.length - 1, c = a.get(o.toLowerCase());
					if (c !== void 0) {
						a.delete(o.toLowerCase());
						var l = t[o];
						c = n[c];
						var u = Ft(l, s);
						s = Ft(c, s), typeof l == "object" && l && typeof c == "object" && c && Nt(l) === "Object" && Nt(c) === "Object" && (2 < Object.keys(l).length || 2 < Object.keys(c).length || -1 < u.indexOf("...") || -1 < s.indexOf("...")) ? i += Dt(r + 1) + o + "={{\n" + Lt(l, c, r + 2) + Dt(r + 1) + "}}\n" : (i += Ot(r + 1) + o + "=" + u + "\n", i += kt(r + 1) + o + "=" + s + "\n");
					} else i += Dt(r + 1) + o + "=" + Ft(t[o], s) + "\n";
				}
				a.forEach(function(e) {
					if (e !== "children") {
						var t = 120 - 2 * (r + 1) - e.length - 1;
						i += kt(r + 1) + e + "=" + Ft(n[e], t) + "\n";
					}
				}), i = i === "" ? Dt(r) + "<" + e + ">\n" : Dt(r) + "<" + e + "\n" + i + Dt(r) + ">\n";
			}
			return e = n.children, t = t.children, typeof e == "string" || typeof e == "number" || typeof e == "bigint" ? (a = "", (typeof t == "string" || typeof t == "number" || typeof t == "bigint") && (a = "" + t), i += Mt(a, "" + e, r + 1)) : (typeof t == "string" || typeof t == "number" || typeof t == "bigint") && (i = e == null ? i + Mt("" + t, null, r + 1) : i + Mt("" + t, void 0, r + 1)), i;
		}
		function zt(e, t) {
			var n = At(e);
			if (n === null) {
				for (n = "", e = e.child; e;) n += zt(e, t), e = e.sibling;
				return n;
			}
			return Dt(t) + "<" + n + ">\n";
		}
		function Bt(e, t) {
			var n = Et(e, t);
			if (n !== e && (e.children.length !== 1 || e.children[0] !== n)) return Dt(t) + "...\n" + Bt(n, t + 1);
			n = "";
			var r = e.fiber._debugInfo;
			if (r) for (var i = 0; i < r.length; i++) {
				var a = r[i].name;
				typeof a == "string" && (n += Dt(t) + "<" + a + ">\n", t++);
			}
			if (r = "", i = e.fiber.pendingProps, e.fiber.tag === 6) r = Mt(i, e.serverProps, t), t++;
			else if (a = At(e.fiber), a !== null) if (e.serverProps === void 0) {
				r = t;
				var o = 120 - 2 * r - a.length - 2, s = "";
				for (l in i) if (i.hasOwnProperty(l) && l !== "children") {
					var c = Ft(i[l], 15);
					if (o -= l.length + c.length + 2, 0 > o) {
						s += " ...";
						break;
					}
					s += " " + l + "=" + c;
				}
				r = Dt(r) + "<" + a + s + ">\n", t++;
			} else e.serverProps === null ? (r = It(a, i, Ot(t)), t++) : typeof e.serverProps == "string" ? console.error("Should not have matched a non HostText fiber to a Text node. This is a bug in React.") : (r = Rt(a, i, e.serverProps, t), t++);
			var l = "";
			for (i = e.fiber.child, a = 0; i && a < e.children.length;) o = e.children[a], o.fiber === i ? (l += Bt(o, t), a++) : l += zt(i, t), i = i.sibling;
			for (i && 0 < e.children.length && (l += Dt(t) + "...\n"), i = e.serverTail, e.serverProps === null && t--, e = 0; e < i.length; e++) a = i[e], l = typeof a == "string" ? l + (kt(t) + jt(a, 120 - 2 * t) + "\n") : l + It(a.type, a.props, kt(t));
			return n + r + l;
		}
		function Vt(e) {
			try {
				return "\n\n" + Bt(e, 0);
			} catch {
				return "";
			}
		}
		function Ht(e, t, n) {
			for (var r = t, i = null, a = 0; r;) r === e && (a = 0), i = {
				fiber: r,
				children: i === null ? [] : [i],
				serverProps: r === t ? n : r === e ? null : void 0,
				serverTail: [],
				distanceFromLeaf: a
			}, a++, r = r.return;
			return i === null ? "" : Vt(i).replaceAll(/^[+-]/gm, ">");
		}
		function Ut(e, t) {
			var n = B({}, e || xm), r = { tag: t };
			return vm.indexOf(t) !== -1 && (n.aTagInScope = null, n.buttonTagInScope = null, n.nobrTagInScope = null), ym.indexOf(t) !== -1 && (n.pTagInButtonScope = null), _m.indexOf(t) !== -1 && t !== "address" && t !== "div" && t !== "p" && (n.listItemTagAutoclosing = null, n.dlItemTagAutoclosing = null), n.current = r, t === "form" && (n.formTag = r), t === "a" && (n.aTagInScope = r), t === "button" && (n.buttonTagInScope = r), t === "nobr" && (n.nobrTagInScope = r), t === "p" && (n.pTagInButtonScope = r), t === "li" && (n.listItemTagAutoclosing = r), (t === "dd" || t === "dt") && (n.dlItemTagAutoclosing = r), t === "#document" || t === "html" ? n.containerTagInScope = null : n.containerTagInScope ||= r, e !== null || t !== "#document" && t !== "html" && t !== "body" ? !0 === n.implicitRootScope && (n.implicitRootScope = !1) : n.implicitRootScope = !0, n;
		}
		function Wt(e, t, n) {
			switch (t) {
				case "select": return e === "hr" || e === "option" || e === "optgroup" || e === "script" || e === "template" || e === "#text";
				case "optgroup": return e === "option" || e === "#text";
				case "option": return e === "#text";
				case "tr": return e === "th" || e === "td" || e === "style" || e === "script" || e === "template";
				case "tbody":
				case "thead":
				case "tfoot": return e === "tr" || e === "style" || e === "script" || e === "template";
				case "colgroup": return e === "col" || e === "template";
				case "table": return e === "caption" || e === "colgroup" || e === "tbody" || e === "tfoot" || e === "thead" || e === "style" || e === "script" || e === "template";
				case "head": return e === "base" || e === "basefont" || e === "bgsound" || e === "link" || e === "meta" || e === "title" || e === "noscript" || e === "noframes" || e === "style" || e === "script" || e === "template";
				case "html":
					if (n) break;
					return e === "head" || e === "body" || e === "frameset";
				case "frameset": return e === "frame";
				case "#document": if (!n) return e === "html";
			}
			switch (e) {
				case "h1":
				case "h2":
				case "h3":
				case "h4":
				case "h5":
				case "h6": return t !== "h1" && t !== "h2" && t !== "h3" && t !== "h4" && t !== "h5" && t !== "h6";
				case "rp":
				case "rt": return bm.indexOf(t) === -1;
				case "caption":
				case "col":
				case "colgroup":
				case "frameset":
				case "frame":
				case "tbody":
				case "td":
				case "tfoot":
				case "th":
				case "thead":
				case "tr": return t == null;
				case "head": return n || t === null;
				case "html": return n && t === "#document" || t === null;
				case "body": return n && (t === "#document" || t === "html") || t === null;
			}
			return !0;
		}
		function Gt(e, t) {
			switch (e) {
				case "address":
				case "article":
				case "aside":
				case "blockquote":
				case "center":
				case "details":
				case "dialog":
				case "dir":
				case "div":
				case "dl":
				case "fieldset":
				case "figcaption":
				case "figure":
				case "footer":
				case "header":
				case "hgroup":
				case "main":
				case "menu":
				case "nav":
				case "ol":
				case "p":
				case "section":
				case "summary":
				case "ul":
				case "pre":
				case "listing":
				case "table":
				case "hr":
				case "xmp":
				case "h1":
				case "h2":
				case "h3":
				case "h4":
				case "h5":
				case "h6": return t.pTagInButtonScope;
				case "form": return t.formTag || t.pTagInButtonScope;
				case "li": return t.listItemTagAutoclosing;
				case "dd":
				case "dt": return t.dlItemTagAutoclosing;
				case "button": return t.buttonTagInScope;
				case "a": return t.aTagInScope;
				case "nobr": return t.nobrTagInScope;
			}
			return null;
		}
		function Kt(e, t) {
			for (; e;) {
				switch (e.tag) {
					case 5:
					case 26:
					case 27: if (e.type === t) return e;
				}
				e = e.return;
			}
			return null;
		}
		function qt(e, t) {
			t ||= xm;
			var n = t.current;
			if (t = (n = Wt(e, n && n.tag, t.implicitRootScope) ? null : n) ? null : Gt(e, t), t = n || t, !t) return !0;
			var r = t.tag;
			if (t = String(!!n) + "|" + e + "|" + r, Sm[t]) return !1;
			Sm[t] = !0;
			var i = (t = hp) ? Kt(t.return, r) : null, a = t !== null && i !== null ? Ht(i, t, null) : "", o = "<" + e + ">";
			return n ? (n = "", r === "table" && e === "tr" && (n += " Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by the browser."), console.error("In HTML, %s cannot be a child of <%s>.%s\nThis will cause a hydration error.%s", o, r, n, a)) : console.error("In HTML, %s cannot be a descendant of <%s>.\nThis will cause a hydration error.%s", o, r, a), t && (e = t.return, i === null || e === null || i === e && e._debugOwner === t._debugOwner || k(i, function() {
				console.error("<%s> cannot contain a nested %s.\nSee this log for the ancestor stack trace.", r, o);
			})), !1;
		}
		function Jt(e, t, n) {
			if (n || Wt("#text", t, !1)) return !0;
			if (n = "#text|" + t, Sm[n]) return !1;
			Sm[n] = !0;
			var r = (n = hp) ? Kt(n, t) : null;
			return n = n !== null && r !== null ? Ht(r, n, n.tag === 6 ? null : { children: null }) : "", /\S/.test(e) ? console.error("In HTML, text nodes cannot be a child of <%s>.\nThis will cause a hydration error.%s", t, n) : console.error("In HTML, whitespace text nodes cannot be a child of <%s>. Make sure you don't have any extra whitespace between tags on each line of your source code.\nThis will cause a hydration error.%s", t, n), !1;
		}
		function Yt(e, t) {
			if (t) {
				var n = e.firstChild;
				if (n && n === e.lastChild && n.nodeType === 3) {
					n.nodeValue = t;
					return;
				}
			}
			e.textContent = t;
		}
		function Xt(e) {
			return e.replace(Om, function(e, t) {
				return t.toUpperCase();
			});
		}
		function Zt(e, t, n) {
			var r = t.indexOf("--") === 0;
			r || (-1 < t.indexOf("-") ? Am.hasOwnProperty(t) && Am[t] || (Am[t] = !0, console.error("Unsupported style property %s. Did you mean %s?", t, Xt(t.replace(Dm, "ms-")))) : Em.test(t) ? Am.hasOwnProperty(t) && Am[t] || (Am[t] = !0, console.error("Unsupported vendor-prefixed style property %s. Did you mean %s?", t, t.charAt(0).toUpperCase() + t.slice(1))) : !km.test(n) || jm.hasOwnProperty(n) && jm[n] || (jm[n] = !0, console.error("Style property values shouldn't contain a semicolon. Try \"%s: %s\" instead.", t, n.replace(km, ""))), typeof n == "number" && (isNaN(n) ? Mm || (Mm = !0, console.error("`NaN` is an invalid value for the `%s` css style property.", t)) : isFinite(n) || Nm || (Nm = !0, console.error("`Infinity` is an invalid value for the `%s` css style property.", t)))), n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || Pm.has(t) ? t === "float" ? e.cssFloat = n : (Ee(n, t), e[t] = ("" + n).trim()) : e[t] = n + "px";
		}
		function Qt(e, t, n) {
			if (t != null && typeof t != "object") throw Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
			if (t && Object.freeze(t), e = e.style, n != null) {
				if (t) {
					var r = {};
					if (n) {
						for (var i in n) if (n.hasOwnProperty(i) && !t.hasOwnProperty(i)) for (var a = Cm[i] || [i], o = 0; o < a.length; o++) r[a[o]] = i;
					}
					for (var s in t) if (t.hasOwnProperty(s) && (!n || n[s] !== t[s])) for (i = Cm[s] || [s], a = 0; a < i.length; a++) r[i[a]] = s;
					for (var c in s = {}, t) for (i = Cm[c] || [c], a = 0; a < i.length; a++) s[i[a]] = c;
					for (var l in c = {}, r) if (i = r[l], (a = s[l]) && i !== a && (o = i + "," + a, !c[o])) {
						c[o] = !0, o = console;
						var u = t[i];
						o.error.call(o, "%s a style property during rerender (%s) when a conflicting property is set (%s) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.", u == null || typeof u == "boolean" || u === "" ? "Removing" : "Updating", i, a);
					}
				}
				for (var d in n) !n.hasOwnProperty(d) || t != null && t.hasOwnProperty(d) || (d.indexOf("--") === 0 ? e.setProperty(d, "") : d === "float" ? e.cssFloat = "" : e[d] = "");
				for (var f in t) l = t[f], t.hasOwnProperty(f) && n[f] !== l && Zt(e, f, l);
			} else for (r in t) t.hasOwnProperty(r) && Zt(e, r, t[r]);
		}
		function $t(e) {
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
		function en(e) {
			return Lm.get(e) || e;
		}
		function tn(e, t) {
			if (_p.call(Bm, t) && Bm[t]) return !0;
			if (Hm.test(t)) {
				if (e = "aria-" + t.slice(4).toLowerCase(), e = zm.hasOwnProperty(e) ? e : null, e == null) return console.error("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", t), Bm[t] = !0;
				if (t !== e) return console.error("Invalid ARIA attribute `%s`. Did you mean `%s`?", t, e), Bm[t] = !0;
			}
			if (Vm.test(t)) {
				if (e = t.toLowerCase(), e = zm.hasOwnProperty(e) ? e : null, e == null) return Bm[t] = !0, !1;
				t !== e && (console.error("Unknown ARIA attribute `%s`. Did you mean `%s`?", t, e), Bm[t] = !0);
			}
			return !0;
		}
		function nn(e, t) {
			var n = [], r;
			for (r in t) tn(e, r) || n.push(r);
			t = n.map(function(e) {
				return "`" + e + "`";
			}).join(", "), n.length === 1 ? console.error("Invalid aria prop %s on <%s> tag. For details, see https://react.dev/link/invalid-aria-props", t, e) : 1 < n.length && console.error("Invalid aria props %s on <%s> tag. For details, see https://react.dev/link/invalid-aria-props", t, e);
		}
		function rn(e, t, n, r) {
			if (_p.call(Wm, t) && Wm[t]) return !0;
			var i = t.toLowerCase();
			if (i === "onfocusin" || i === "onfocusout") return console.error("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React."), Wm[t] = !0;
			if (typeof n == "function" && (e === "form" && t === "action" || e === "input" && t === "formAction" || e === "button" && t === "formAction")) return !0;
			if (r != null) {
				if (e = r.possibleRegistrationNames, r.registrationNameDependencies.hasOwnProperty(t)) return !0;
				if (r = e.hasOwnProperty(i) ? e[i] : null, r != null) return console.error("Invalid event handler property `%s`. Did you mean `%s`?", t, r), Wm[t] = !0;
				if (Gm.test(t)) return console.error("Unknown event handler property `%s`. It will be ignored.", t), Wm[t] = !0;
			} else if (Gm.test(t)) return Km.test(t) && console.error("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", t), Wm[t] = !0;
			if (qm.test(t) || Jm.test(t)) return !0;
			if (i === "innerhtml") return console.error("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."), Wm[t] = !0;
			if (i === "aria") return console.error("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead."), Wm[t] = !0;
			if (i === "is" && n != null && typeof n != "string") return console.error("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof n), Wm[t] = !0;
			if (typeof n == "number" && isNaN(n)) return console.error("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", t), Wm[t] = !0;
			if (Rm.hasOwnProperty(i)) {
				if (i = Rm[i], i !== t) return console.error("Invalid DOM property `%s`. Did you mean `%s`?", t, i), Wm[t] = !0;
			} else if (t !== i) return console.error("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", t, i), Wm[t] = !0;
			switch (t) {
				case "dangerouslySetInnerHTML":
				case "children":
				case "style":
				case "suppressContentEditableWarning":
				case "suppressHydrationWarning":
				case "defaultValue":
				case "defaultChecked":
				case "innerHTML":
				case "ref": return !0;
				case "innerText":
				case "textContent": return !0;
			}
			switch (typeof n) {
				case "boolean": switch (t) {
					case "autoFocus":
					case "checked":
					case "multiple":
					case "muted":
					case "selected":
					case "contentEditable":
					case "spellCheck":
					case "draggable":
					case "value":
					case "autoReverse":
					case "externalResourcesRequired":
					case "focusable":
					case "preserveAlpha":
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
					case "capture":
					case "download":
					case "inert": return !0;
					default: return i = t.toLowerCase().slice(0, 5), i === "data-" || i === "aria-" ? !0 : (n ? console.error("Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s=\"%s\" or %s={value.toString()}.", n, t, t, n, t) : console.error("Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s=\"%s\" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", n, t, t, n, t, t, t), Wm[t] = !0);
				}
				case "function":
				case "symbol": return Wm[t] = !0, !1;
				case "string": if (n === "false" || n === "true") {
					switch (t) {
						case "checked":
						case "selected":
						case "multiple":
						case "muted":
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
						case "inert": break;
						default: return !0;
					}
					console.error("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", n, t, n === "false" ? "The browser will interpret it as a truthy value." : "Although this works, it will not work as expected if you pass the string \"false\".", t, n), Wm[t] = !0;
				}
			}
			return !0;
		}
		function an(e, t, n) {
			var r = [], i;
			for (i in t) rn(e, i, t[i], n) || r.push(i);
			t = r.map(function(e) {
				return "`" + e + "`";
			}).join(", "), r.length === 1 ? console.error("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://react.dev/link/attribute-behavior ", t, e) : 1 < r.length && console.error("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://react.dev/link/attribute-behavior ", t, e);
		}
		function on(e) {
			return Ym.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
		}
		function sn() {}
		function cn(e) {
			return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
		}
		function ln(e) {
			var t = Xe(e);
			if (t && (e = t.stateNode)) {
				var n = e[qp] || null;
				a: switch (e = t.stateNode, t.type) {
					case "input":
						if (gt(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
							for (n = e; n.parentNode;) n = n.parentNode;
							for (A(t, "name"), n = n.querySelectorAll("input[name=\"" + mt("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
								var r = n[t];
								if (r !== e && r.form === e.form) {
									var i = r[qp] || null;
									if (!i) throw Error("ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.");
									gt(r, i.value, i.defaultValue, i.defaultValue, i.checked, i.defaultChecked, i.type, i.name);
								}
							}
							for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && ft(r);
						}
						break a;
					case "textarea":
						wt(e, n.value, n.defaultValue);
						break a;
					case "select": t = n.value, t != null && xt(e, !!n.multiple, t, !1);
				}
			}
		}
		function un(e, t, n) {
			if ($m) return e(t, n);
			$m = !0;
			try {
				return e(t);
			} finally {
				if ($m = !1, (Zm !== null || Qm !== null) && (sl(), Zm && (t = Zm, e = Qm, Qm = Zm = null, ln(t), e))) for (t = 0; t < e.length; t++) ln(e[t]);
			}
		}
		function dn(e, t) {
			var n = e.stateNode;
			if (n === null) return null;
			var r = n[qp] || null;
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
			if (n && typeof n != "function") throw Error("Expected `" + t + "` listener to be a function, instead got a value of `" + typeof n + "` type.");
			return n;
		}
		function fn() {
			if (ah) return ah;
			var e, t = ih, n = t.length, r, i = "value" in rh ? rh.value : rh.textContent, a = i.length;
			for (e = 0; e < n && t[e] === i[e]; e++);
			var o = n - e;
			for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
			return ah = i.slice(e, 1 < r ? 1 - r : void 0);
		}
		function pn(e) {
			var t = e.keyCode;
			return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
		}
		function mn() {
			return !0;
		}
		function hn() {
			return !1;
		}
		function gn(e) {
			function t(t, n, r, i, a) {
				for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
				return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? mn : hn, this.isPropagationStopped = hn, this;
			}
			return B(t.prototype, {
				preventDefault: function() {
					this.defaultPrevented = !0;
					var e = this.nativeEvent;
					e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = mn);
				},
				stopPropagation: function() {
					var e = this.nativeEvent;
					e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = mn);
				},
				persist: function() {},
				isPersistent: mn
			}), t;
		}
		function _n(e) {
			var t = this.nativeEvent;
			return t.getModifierState ? t.getModifierState(e) : (e = Ch[e]) ? !!t[e] : !1;
		}
		function vn() {
			return _n;
		}
		function yn(e, t) {
			switch (e) {
				case "keyup": return Ah.indexOf(t.keyCode) !== -1;
				case "keydown": return t.keyCode !== jh;
				case "keypress":
				case "mousedown":
				case "focusout": return !0;
				default: return !1;
			}
		}
		function bn(e) {
			return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
		}
		function xn(e, t) {
			switch (e) {
				case "compositionend": return bn(t);
				case "keypress": return t.which === Ih ? (Rh = !0, Lh) : null;
				case "textInput": return e = t.data, e === Lh && Rh ? null : e;
				default: return null;
			}
		}
		function Sn(e, t) {
			if (zh) return e === "compositionend" || !Mh && yn(e, t) ? (e = fn(), ah = ih = rh = null, zh = !1, e) : null;
			switch (e) {
				case "paste": return null;
				case "keypress":
					if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
						if (t.char && 1 < t.char.length) return t.char;
						if (t.which) return String.fromCharCode(t.which);
					}
					return null;
				case "compositionend": return Fh && t.locale !== "ko" ? null : t.data;
				default: return null;
			}
		}
		function Cn(e) {
			var t = e && e.nodeName && e.nodeName.toLowerCase();
			return t === "input" ? !!Bh[e.type] : t === "textarea";
		}
		function wn(e) {
			if (!eh) return !1;
			e = "on" + e;
			var t = e in document;
			return t ||= (t = document.createElement("div"), t.setAttribute(e, "return;"), typeof t[e] == "function"), t;
		}
		function Tn(e, t, n, r) {
			Zm ? Qm ? Qm.push(r) : Qm = [r] : Zm = r, t = mu(t, "onChange"), 0 < t.length && (n = new sh("onChange", "change", null, n, r), e.push({
				event: n,
				listeners: t
			}));
		}
		function En(e) {
			cu(e, 0);
		}
		function Dn(e) {
			if (ft(Ze(e))) return e;
		}
		function On(e, t) {
			if (e === "change") return t;
		}
		function kn() {
			Vh && (Vh.detachEvent("onpropertychange", An), Hh = Vh = null);
		}
		function An(e) {
			if (e.propertyName === "value" && Dn(Hh)) {
				var t = [];
				Tn(t, Hh, e, cn(e)), un(En, t);
			}
		}
		function jn(e, t, n) {
			e === "focusin" ? (kn(), Vh = t, Hh = n, Vh.attachEvent("onpropertychange", An)) : e === "focusout" && kn();
		}
		function Mn(e) {
			if (e === "selectionchange" || e === "keyup" || e === "keydown") return Dn(Hh);
		}
		function Nn(e, t) {
			if (e === "click") return Dn(t);
		}
		function Pn(e, t) {
			if (e === "input" || e === "change") return Dn(t);
		}
		function Fn(e, t) {
			return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
		}
		function In(e, t) {
			if (Wh(e, t)) return !0;
			if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
			var n = Object.keys(e), r = Object.keys(t);
			if (n.length !== r.length) return !1;
			for (r = 0; r < n.length; r++) {
				var i = n[r];
				if (!_p.call(t, i) || !Wh(e[i], t[i])) return !1;
			}
			return !0;
		}
		function Ln(e) {
			for (; e && e.firstChild;) e = e.firstChild;
			return e;
		}
		function Rn(e, t) {
			var n = Ln(e);
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
				n = Ln(n);
			}
		}
		function zn(e, t) {
			return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? zn(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
		}
		function Bn(e) {
			e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
			for (var t = pt(e.document); t instanceof e.HTMLIFrameElement;) {
				try {
					var n = typeof t.contentWindow.location.href == "string";
				} catch {
					n = !1;
				}
				if (n) e = t.contentWindow;
				else break;
				t = pt(e.document);
			}
			return t;
		}
		function Vn(e) {
			var t = e && e.nodeName && e.nodeName.toLowerCase();
			return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
		}
		function Hn(e, t, n) {
			var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
			Yh || Kh == null || Kh !== pt(r) || (r = Kh, "selectionStart" in r && Vn(r) ? r = {
				start: r.selectionStart,
				end: r.selectionEnd
			} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
				anchorNode: r.anchorNode,
				anchorOffset: r.anchorOffset,
				focusNode: r.focusNode,
				focusOffset: r.focusOffset
			}), Jh && In(Jh, r) || (Jh = r, r = mu(qh, "onSelect"), 0 < r.length && (t = new sh("onSelect", "select", null, t, n), e.push({
				event: t,
				listeners: r
			}), t.target = Kh)));
		}
		function Un(e, t) {
			var n = {};
			return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
		}
		function Wn(e) {
			if (Zh[e]) return Zh[e];
			if (!Xh[e]) return e;
			var t = Xh[e], n;
			for (n in t) if (t.hasOwnProperty(n) && n in Qh) return Zh[e] = t[n];
			return e;
		}
		function Gn(e, t) {
			og.set(e, t), et(t, [e]);
		}
		function Kn(e) {
			for (var t = mg, n = 0; n < e.length; n++) {
				var r = e[n];
				if (typeof r == "object" && r) if (qf(r) && r.length === 2 && typeof r[0] == "string") {
					if (t !== mg && t !== _g) return hg;
					t = _g;
				} else return hg;
				else {
					if (typeof r == "function" || typeof r == "string" && 50 < r.length || t !== mg && t !== gg) return hg;
					t = gg;
				}
			}
			return t;
		}
		function qn(e, t, n, r) {
			for (var i in e) _p.call(e, i) && i[0] !== "_" && Jn(i, e[i], t, n, r);
		}
		function Jn(e, t, n, r, i) {
			switch (typeof t) {
				case "object": if (t === null) {
					t = "null";
					break;
				} else {
					if (t.$$typeof === jf) {
						var a = w(t.type) || "…", o = t.key;
						t = t.props;
						var s = Object.keys(t), c = s.length;
						if (o == null && c === 0) {
							t = "<" + a + " />";
							break;
						}
						if (3 > r || c === 1 && s[0] === "children" && o == null) {
							t = "<" + a + " … />";
							break;
						}
						for (var l in n.push([i + "\xA0\xA0".repeat(r) + e, "<" + a]), o !== null && Jn("key", o, n, r + 1, i), e = !1, t) l === "children" ? t.children != null && (!qf(t.children) || 0 < t.children.length) && (e = !0) : _p.call(t, l) && l[0] !== "_" && Jn(l, t[l], n, r + 1, i);
						n.push(["", e ? ">…</" + a + ">" : "/>"]);
						return;
					}
					if (a = Object.prototype.toString.call(t), a = a.slice(8, a.length - 1), a === "Array") {
						if (l = Kn(t), l === gg || l === mg) {
							t = JSON.stringify(t);
							break;
						} else if (l === _g) {
							for (n.push([i + "\xA0\xA0".repeat(r) + e, ""]), e = 0; e < t.length; e++) a = t[e], Jn(a[0], a[1], n, r + 1, i);
							return;
						}
					}
					if (a === "Promise") {
						if (t.status === "fulfilled") {
							if (a = n.length, Jn(e, t.value, n, r, i), n.length > a) {
								n = n[a], n[1] = "Promise<" + (n[1] || "Object") + ">";
								return;
							}
						} else if (t.status === "rejected" && (a = n.length, Jn(e, t.reason, n, r, i), n.length > a)) {
							n = n[a], n[1] = "Rejected Promise<" + n[1] + ">";
							return;
						}
						n.push(["\xA0\xA0".repeat(r) + e, "Promise"]);
						return;
					}
					a === "Object" && (l = Object.getPrototypeOf(t)) && typeof l.constructor == "function" && (a = l.constructor.name), n.push([i + "\xA0\xA0".repeat(r) + e, a === "Object" ? 3 > r ? "" : "…" : a]), 3 > r && qn(t, n, r + 1, i);
					return;
				}
				case "function":
					t = t.name === "" ? "() => {}" : t.name + "() {}";
					break;
				case "string":
					t = t === pg ? "…" : JSON.stringify(t);
					break;
				case "undefined":
					t = "undefined";
					break;
				case "boolean":
					t = t ? "true" : "false";
					break;
				default: t = String(t);
			}
			n.push([i + "\xA0\xA0".repeat(r) + e, t]);
		}
		function Yn(e, t, n, r) {
			var i = !0;
			for (o in e) o in t || (n.push([vg + "\xA0\xA0".repeat(r) + o, "…"]), i = !1);
			for (var a in t) if (a in e) {
				var o = e[a], s = t[a];
				if (o !== s) {
					if (r === 0 && a === "children") i = "\xA0\xA0".repeat(r) + a, n.push([vg + i, "…"], [yg + i, "…"]);
					else {
						if (!(3 <= r)) {
							if (typeof o == "object" && typeof s == "object" && o !== null && s !== null && o.$$typeof === s.$$typeof) if (s.$$typeof === jf) {
								if (o.type === s.type && o.key === s.key) {
									o = w(s.type) || "…", i = "\xA0\xA0".repeat(r) + a, o = "<" + o + " … />", n.push([vg + i, o], [yg + i, o]), i = !1;
									continue;
								}
							} else {
								var c = Object.prototype.toString.call(o), l = Object.prototype.toString.call(s);
								if (c === l && (l === "[object Object]" || l === "[object Array]")) {
									c = [bg + "\xA0\xA0".repeat(r) + a, l === "[object Array]" ? "Array" : ""], n.push(c), l = n.length, Yn(o, s, n, r + 1) ? l === n.length && (c[1] = "Referentially unequal but deeply equal objects. Consider memoization.") : i = !1;
									continue;
								}
							}
							else if (typeof o == "function" && typeof s == "function" && o.name === s.name && o.length === s.length && (c = Function.prototype.toString.call(o), l = Function.prototype.toString.call(s), c === l)) {
								o = s.name === "" ? "() => {}" : s.name + "() {}", n.push([bg + "\xA0\xA0".repeat(r) + a, o + " Referentially unequal function closure. Consider memoization."]);
								continue;
							}
						}
						Jn(a, o, n, r, vg), Jn(a, s, n, r, yg);
					}
					i = !1;
				}
			} else n.push([yg + "\xA0\xA0".repeat(r) + a, "…"]), i = !1;
			return i;
		}
		function Xn(e) {
			U = e & 63 ? "Blocking" : e & 64 ? "Gesture" : e & 4194176 ? "Transition" : e & 62914560 ? "Suspense" : e & 2080374784 ? "Idle" : "Other";
		}
		function Zn(e, t, n, r) {
			xg && (Tg.start = t, Tg.end = n, wg.color = "warning", wg.tooltipText = r, wg.properties = null, (e = e._debugTask) ? e.run(performance.measure.bind(performance, r, Tg)) : performance.measure(r, Tg));
		}
		function Qn(e, t, n) {
			Zn(e, t, n, "Reconnect");
		}
		function $n(e, t, n, r, i) {
			var a = T(e);
			if (a !== null && xg) {
				var o = e.alternate, s = e.actualDuration;
				if (o === null || o.child !== e.child) for (var c = e.child; c !== null; c = c.sibling) s -= c.actualDuration;
				r = .5 > s ? r ? "tertiary-light" : "primary-light" : 10 > s ? r ? "tertiary" : "primary" : 100 > s ? r ? "tertiary-dark" : "primary-dark" : "error";
				var l = e.memoizedProps;
				s = e._debugTask, l !== null && o !== null && o.memoizedProps !== l ? (c = [Eg], l = Yn(o.memoizedProps, l, c, 0), 1 < c.length && (l && !Cg && (o.lanes & i) === 0 && 100 < e.actualDuration ? (Cg = !0, c[0] = Og, wg.color = "warning", wg.tooltipText = Dg) : (wg.color = r, wg.tooltipText = a), wg.properties = c, Tg.start = t, Tg.end = n, s == null ? performance.measure("​" + a, Tg) : s.run(performance.measure.bind(performance, "​" + a, Tg)))) : s == null ? console.timeStamp(a, t, n, Sg, void 0, r) : s.run(console.timeStamp.bind(console, a, t, n, Sg, void 0, r));
			}
		}
		function er(e, t, n, r) {
			if (xg) {
				var i = T(e);
				if (i !== null) {
					for (var a = null, o = [], s = 0; s < r.length; s++) {
						var c = r[s];
						a == null && c.source !== null && (a = c.source._debugTask), c = c.value, o.push(["Error", typeof c == "object" && c && typeof c.message == "string" ? String(c.message) : String(c)]);
					}
					e.key !== null && Jn("key", e.key, o, 0, ""), e.memoizedProps !== null && qn(e.memoizedProps, o, 0, ""), a ??= e._debugTask, e = {
						start: t,
						end: n,
						detail: { devtools: {
							color: "error",
							track: Sg,
							tooltipText: e.tag === 13 ? "Hydration failed" : "Error boundary caught an error",
							properties: o
						} }
					}, a ? a.run(performance.measure.bind(performance, "​" + i, e)) : performance.measure("​" + i, e);
				}
			}
		}
		function tr(e, t, n, r, i) {
			if (i !== null) {
				if (xg) {
					var a = T(e);
					if (a !== null) {
						r = [];
						for (var o = 0; o < i.length; o++) {
							var s = i[o].value;
							r.push(["Error", typeof s == "object" && s && typeof s.message == "string" ? String(s.message) : String(s)]);
						}
						e.key !== null && Jn("key", e.key, r, 0, ""), e.memoizedProps !== null && qn(e.memoizedProps, r, 0, ""), t = {
							start: t,
							end: n,
							detail: { devtools: {
								color: "error",
								track: Sg,
								tooltipText: "A lifecycle or effect errored",
								properties: r
							} }
						}, (e = e._debugTask) ? e.run(performance.measure.bind(performance, "​" + a, t)) : performance.measure("​" + a, t);
					}
				}
			} else a = T(e), a !== null && xg && (i = 1 > r ? "secondary-light" : 100 > r ? "secondary" : 500 > r ? "secondary-dark" : "error", (e = e._debugTask) ? e.run(console.timeStamp.bind(console, a, t, n, Sg, void 0, i)) : console.timeStamp(a, t, n, Sg, void 0, i));
		}
		function nr(e, t, n, r) {
			if (xg && !(t <= e)) {
				var i = (n & 738197653) === n ? "tertiary-dark" : "primary-dark";
				n = (n & 536870912) === n ? "Prepared" : (n & 201326741) === n ? "Hydrated" : "Render", r ? r.run(console.timeStamp.bind(console, n, e, t, U, H, i)) : console.timeStamp(n, e, t, U, H, i);
			}
		}
		function rr(e, t, n, r) {
			!xg || t <= e || (n = (n & 738197653) === n ? "tertiary-dark" : "primary-dark", r ? r.run(console.timeStamp.bind(console, "Prewarm", e, t, U, H, n)) : console.timeStamp("Prewarm", e, t, U, H, n));
		}
		function ir(e, t, n, r) {
			!xg || t <= e || (n = (n & 738197653) === n ? "tertiary-dark" : "primary-dark", r ? r.run(console.timeStamp.bind(console, "Suspended", e, t, U, H, n)) : console.timeStamp("Suspended", e, t, U, H, n));
		}
		function ar(e, t, n, r, i, a) {
			if (xg && !(t <= e)) {
				n = [];
				for (var o = 0; o < r.length; o++) {
					var s = r[o].value;
					n.push(["Recoverable Error", typeof s == "object" && s && typeof s.message == "string" ? String(s.message) : String(s)]);
				}
				e = {
					start: e,
					end: t,
					detail: { devtools: {
						color: "primary-dark",
						track: U,
						trackGroup: H,
						tooltipText: i ? "Hydration Failed" : "Recovered after Error",
						properties: n
					} }
				}, a ? a.run(performance.measure.bind(performance, "Recovered", e)) : performance.measure("Recovered", e);
			}
		}
		function or(e, t, n, r) {
			!xg || t <= e || (r ? r.run(console.timeStamp.bind(console, "Errored", e, t, U, H, "error")) : console.timeStamp("Errored", e, t, U, H, "error"));
		}
		function sr(e, t, n, r) {
			!xg || t <= e || (r ? r.run(console.timeStamp.bind(console, n, e, t, U, H, "secondary-light")) : console.timeStamp(n, e, t, U, H, "secondary-light"));
		}
		function cr(e, t, n, r, i) {
			if (xg && !(t <= e)) {
				for (var a = [], o = 0; o < n.length; o++) {
					var s = n[o].value;
					a.push(["Error", typeof s == "object" && s && typeof s.message == "string" ? String(s.message) : String(s)]);
				}
				e = {
					start: e,
					end: t,
					detail: { devtools: {
						color: "error",
						track: U,
						trackGroup: H,
						tooltipText: r ? "Remaining Effects Errored" : "Commit Errored",
						properties: a
					} }
				}, i ? i.run(performance.measure.bind(performance, "Errored", e)) : performance.measure("Errored", e);
			}
		}
		function lr(e, t, n) {
			!xg || t <= e || (n ? n.run(console.timeStamp.bind(console, "Animating", e, t, U, H, "secondary-dark")) : console.timeStamp("Animating", e, t, U, H, "secondary-dark"));
		}
		function ur() {
			for (var e = Mg, t = Ng = Mg = 0; t < e;) {
				var n = jg[t];
				jg[t++] = null;
				var r = jg[t];
				jg[t++] = null;
				var i = jg[t];
				jg[t++] = null;
				var a = jg[t];
				if (jg[t++] = null, r !== null && i !== null) {
					var o = r.pending;
					o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
				}
				a !== 0 && mr(n, i, a);
			}
		}
		function dr(e, t, n, r) {
			jg[Mg++] = e, jg[Mg++] = t, jg[Mg++] = n, jg[Mg++] = r, Ng |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
		}
		function fr(e, t, n, r) {
			return dr(e, t, n, r), hr(e);
		}
		function pr(e, t) {
			return dr(e, null, null, t), hr(e);
		}
		function mr(e, t, n) {
			e.lanes |= n;
			var r = e.alternate;
			r !== null && (r.lanes |= n);
			for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & kg || (i = !0)), e = a, a = a.return;
			return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - Fp(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
		}
		function hr(e) {
			if (qx > Kx) throw Qx = qx = 0, $x = Jx = null, Error("Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
			Qx > Zx && (Qx = 0, $x = null, console.error("Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.")), e.alternate === null && e.flags & 4098 && Gl(e);
			for (var t = e, n = t.return; n !== null;) t.alternate === null && t.flags & 4098 && Gl(e), t = n, n = t.return;
			return t.tag === 3 ? t.stateNode : null;
		}
		function gr(e) {
			if (Fg === null) return e;
			var t = Fg(e);
			return t === void 0 ? e : t.current;
		}
		function _r(e) {
			if (Fg === null) return e;
			var t = Fg(e);
			return t === void 0 ? e != null && typeof e.render == "function" && (t = gr(e.render), e.render !== t) ? (t = {
				$$typeof: Rf,
				render: t
			}, e.displayName !== void 0 && (t.displayName = e.displayName), t) : e : t.current;
		}
		function vr(e, t) {
			if (Fg === null) return !1;
			var n = e.elementType;
			t = t.type;
			var r = !1, i = typeof t == "object" && t ? t.$$typeof : null;
			switch (e.tag) {
				case 1:
					typeof t == "function" && (r = !0);
					break;
				case 0:
					(typeof t == "function" || i === Hf) && (r = !0);
					break;
				case 11:
					(i === Rf || i === Hf) && (r = !0);
					break;
				case 14:
				case 15:
					(i === Vf || i === Hf) && (r = !0);
					break;
				default: return !1;
			}
			return !!(r && (e = Fg(n), e !== void 0 && e === Fg(t)));
		}
		function yr(e) {
			Fg !== null && typeof WeakSet == "function" && (Ig === null && (Ig = /* @__PURE__ */ new WeakSet()), Ig.add(e));
		}
		function br(e, t, n) {
			do {
				var r = e, i = r.alternate, a = r.child, o = r.sibling, s = r.tag;
				r = r.type;
				var c = null;
				switch (s) {
					case 0:
					case 15:
					case 1:
						c = r;
						break;
					case 11: c = r.render;
				}
				if (Fg === null) throw Error("Expected resolveFamily to be set during hot reload.");
				var l = !1;
				if (r = !1, c !== null && (c = Fg(c), c !== void 0 && (n.has(c) ? r = !0 : t.has(c) && (s === 1 ? r = !0 : l = !0))), Ig !== null && (Ig.has(e) || i !== null && Ig.has(i)) && (r = !0), r && (e._debugNeedsRemount = !0), (r || l) && (i = pr(e, 2), i !== null && nl(i, e, 2)), a === null || r || br(a, t, n), o === null) break;
				e = o;
			} while (1);
		}
		function xr(e, t, n, r) {
			this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null, this.actualDuration = -0, this.actualStartTime = -1.1, this.treeBaseDuration = this.selfBaseDuration = -0, this._debugTask = this._debugStack = this._debugOwner = this._debugInfo = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, Vg || typeof Object.preventExtensions != "function" || Object.preventExtensions(this);
		}
		function Sr(e) {
			return e = e.prototype, !(!e || !e.isReactComponent);
		}
		function Cr(e, t) {
			var n = e.alternate;
			switch (n === null ? (n = h(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n._debugOwner = e._debugOwner, n._debugStack = e._debugStack, n._debugTask = e._debugTask, n._debugHookTypes = e._debugHookTypes, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null, n.actualDuration = -0, n.actualStartTime = -1.1), n.flags = e.flags & 65011712, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
				lanes: t.lanes,
				firstContext: t.firstContext,
				_debugThenableState: t._debugThenableState
			}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n.selfBaseDuration = e.selfBaseDuration, n.treeBaseDuration = e.treeBaseDuration, n._debugInfo = e._debugInfo, n._debugNeedsRemount = e._debugNeedsRemount, n.tag) {
				case 0:
				case 15:
					n.type = gr(e.type);
					break;
				case 1:
					n.type = gr(e.type);
					break;
				case 11: n.type = _r(e.type);
			}
			return n;
		}
		function wr(e, t) {
			e.flags &= 65011714;
			var n = e.alternate;
			return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null, e.selfBaseDuration = 0, e.treeBaseDuration = 0) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
				lanes: t.lanes,
				firstContext: t.firstContext,
				_debugThenableState: t._debugThenableState
			}, e.selfBaseDuration = n.selfBaseDuration, e.treeBaseDuration = n.treeBaseDuration), e;
		}
		function Tr(e, t, n, r, i, a) {
			var o = 0, s = e;
			if (typeof e == "function") Sr(e) && (o = 1), s = gr(s);
			else if (typeof e == "string") o = O(), o = Wd(e, n, o) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
			else a: switch (e) {
				case Uf: return t = h(31, n, t, i), t.elementType = Uf, t.lanes = a, t;
				case Nf: return Dr(n.children, i, a, t);
				case Pf:
					o = 8, i |= Rg, i |= zg;
					break;
				case Ff: return e = n, r = i, typeof e.id != "string" && console.error("Profiler must specify an \"id\" of type `string` as a prop. Received the type `%s` instead.", typeof e.id), t = h(12, e, t, r | G), t.elementType = Ff, t.lanes = a, t.stateNode = {
					effectDuration: 0,
					passiveEffectDuration: 0
				}, t;
				case zf: return t = h(13, n, t, i), t.elementType = zf, t.lanes = a, t;
				case Bf: return t = h(19, n, t, i), t.elementType = Bf, t.lanes = a, t;
				default:
					if (typeof e == "object" && e) switch (e.$$typeof) {
						case Lf:
							o = 10;
							break a;
						case If:
							o = 9;
							break a;
						case Rf:
							o = 11, s = _r(s);
							break a;
						case Vf:
							o = 14;
							break a;
						case Hf:
							o = 16, s = null;
							break a;
					}
					s = "", (e === void 0 || typeof e == "object" && e && Object.keys(e).length === 0) && (s += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports."), e === null ? n = "null" : qf(e) ? n = "array" : e !== void 0 && e.$$typeof === jf ? (n = "<" + (w(e.type) || "Unknown") + " />", s = " Did you accidentally export a JSX literal instead of a component?") : n = typeof e, (o = r ? ie(r) : null) && (s += "\n\nCheck the render method of `" + o + "`."), o = 29, n = Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: " + (n + "." + s)), s = null;
			}
			return t = h(o, n, t, i), t.elementType = e, t.type = s, t.lanes = a, t._debugOwner = r, t;
		}
		function Er(e, t, n) {
			return t = Tr(e.type, e.key, e.props, e._owner, t, n), t._debugOwner = e._owner, t._debugStack = e._debugStack, t._debugTask = e._debugTask, t;
		}
		function Dr(e, t, n, r) {
			return e = h(7, e, r, t), e.lanes = n, e;
		}
		function Or(e, t, n) {
			return e = h(6, e, null, t), e.lanes = n, e;
		}
		function kr(e) {
			var t = h(18, null, null, W);
			return t.stateNode = e, t;
		}
		function Ar(e, t, n) {
			return t = h(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
				containerInfo: e.containerInfo,
				pendingChildren: null,
				implementation: e.implementation
			}, t;
		}
		function jr(e, t) {
			if (typeof e == "object" && e) {
				var n = Ug.get(e);
				return n === void 0 ? (t = {
					value: e,
					source: t,
					stack: ve(t)
				}, Ug.set(e, t), t) : n;
			}
			return {
				value: e,
				source: t,
				stack: ve(t)
			};
		}
		function Mr(e, t) {
			Rr(), Wg[Gg++] = qg, Wg[Gg++] = Kg, Kg = e, qg = t;
		}
		function Nr(e, t, n) {
			Rr(), Jg[Yg++] = Zg, Jg[Yg++] = Qg, Jg[Yg++] = Xg, Xg = e;
			var r = Zg;
			e = Qg;
			var i = 32 - Fp(r) - 1;
			r &= ~(1 << i), n += 1;
			var a = 32 - Fp(t) + i;
			if (30 < a) {
				var o = i - i % 5;
				a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, Zg = 1 << 32 - Fp(t) + i | n << i | r, Qg = a + e;
			} else Zg = 1 << a | n << i | r, Qg = e;
		}
		function Pr(e) {
			Rr(), e.return !== null && (Mr(e, 1), Nr(e, 1, 0));
		}
		function Fr(e) {
			for (; e === Kg;) Kg = Wg[--Gg], Wg[Gg] = null, qg = Wg[--Gg], Wg[Gg] = null;
			for (; e === Xg;) Xg = Jg[--Yg], Jg[Yg] = null, Qg = Jg[--Yg], Jg[Yg] = null, Zg = Jg[--Yg], Jg[Yg] = null;
		}
		function Ir() {
			return Rr(), Xg === null ? null : {
				id: Zg,
				overflow: Qg
			};
		}
		function Lr(e, t) {
			Rr(), Jg[Yg++] = Zg, Jg[Yg++] = Qg, Jg[Yg++] = Xg, Zg = t.id, Qg = t.overflow, Xg = e;
		}
		function Rr() {
			K || console.error("Expected to be hydrating. This is a bug in React. Please file an issue.");
		}
		function zr(e, t) {
			if (e.return === null) {
				if (n_ === null) n_ = {
					fiber: e,
					children: [],
					serverProps: void 0,
					serverTail: [],
					distanceFromLeaf: t
				};
				else {
					if (n_.fiber !== e) throw Error("Saw multiple hydration diff roots in a pass. This is a bug in React.");
					n_.distanceFromLeaf > t && (n_.distanceFromLeaf = t);
				}
				return n_;
			}
			var n = zr(e.return, t + 1).children;
			return 0 < n.length && n[n.length - 1].fiber === e ? (n = n[n.length - 1], n.distanceFromLeaf > t && (n.distanceFromLeaf = t), n) : (t = {
				fiber: e,
				children: [],
				serverProps: void 0,
				serverTail: [],
				distanceFromLeaf: t
			}, n.push(t), t);
		}
		function Br() {
			K && console.error("We should not be hydrating here. This is a bug in React. Please file a bug.");
		}
		function Vr(e, t) {
			t_ || (e = zr(e, 0), e.serverProps = null, t !== null && (t = yd(t), e.serverTail.push(t)));
		}
		function Hr(e) {
			var t = 1 < arguments.length && arguments[1] !== void 0 ? arguments[1] : !1, n = "", r = n_;
			throw r !== null && (n_ = null, n = Vt(r)), Jr(jr(Error("Hydration failed because the server rendered " + (t ? "text" : "HTML") + " didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:\n\n- A server/client branch `if (typeof window !== 'undefined')`.\n- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.\n- Date formatting in a user's locale which doesn't match the server.\n- External changing data without sending a snapshot of it along with the HTML.\n- Invalid HTML tag nesting.\n\nIt can also happen if the client has a browser extension installed which messes with the HTML before React loaded.\n\nhttps://react.dev/link/hydration-mismatch" + n), e)), a_;
		}
		function Ur(e) {
			var t = e.stateNode, n = e.type, r = e.memoizedProps;
			switch (t[Kp] = e, t[qp] = r, _u(n, r), n) {
				case "dialog":
					R("cancel", t), R("close", t);
					break;
				case "iframe":
				case "object":
				case "embed":
					R("load", t);
					break;
				case "video":
				case "audio":
					for (n = 0; n < pS.length; n++) R(pS[n], t);
					break;
				case "source":
					R("error", t);
					break;
				case "img":
				case "image":
				case "link":
					R("error", t), R("load", t);
					break;
				case "details":
					R("toggle", t);
					break;
				case "input":
					nt("input", r), R("invalid", t), ht(t, r), _t(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
					break;
				case "option":
					yt(t, r);
					break;
				case "select":
					nt("select", r), R("invalid", t), St(t, r);
					break;
				case "textarea": nt("textarea", r), R("invalid", t), Ct(t, r), Tt(t, r.value, r.defaultValue, r.children);
			}
			n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || Cu(t.textContent, n) ? (r.popover != null && (R("beforetoggle", t), R("toggle", t)), r.onScroll != null && R("scroll", t), r.onScrollEnd != null && R("scrollend", t), r.onClick != null && (t.onclick = sn), t = !0) : t = !1, t || Hr(e, !0);
		}
		function Wr(e) {
			for ($g = e.return; $g;) switch ($g.tag) {
				case 5:
				case 31:
				case 13:
					i_ = !1;
					return;
				case 27:
				case 3:
					i_ = !0;
					return;
				default: $g = $g.return;
			}
		}
		function Gr(e) {
			if (e !== $g) return !1;
			if (!K) return Wr(e), K = !0, !1;
			var t = e.tag, n;
			if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = !(n !== "form" && n !== "button") || Uu(e.type, e.memoizedProps)), n = !n), n && e_) {
				for (n = e_; n;) {
					var r = zr(e, 0), i = yd(n);
					r.serverTail.push(i), n = i.type === "Suspense" ? xd(n) : vd(n.nextSibling);
				}
				Hr(e);
			}
			if (Wr(e), t === 13) {
				if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
				e_ = xd(e);
			} else if (t === 31) {
				if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
				e_ = xd(e);
			} else t === 27 ? (t = e_, ed(e.type) ? (e = rC, rC = null, e_ = e) : e_ = t) : e_ = $g ? vd(e.stateNode.nextSibling) : null;
			return !0;
		}
		function Kr() {
			e_ = $g = null, t_ = K = !1;
		}
		function qr() {
			var e = r_;
			return e !== null && (hx === null ? hx = e : hx.push.apply(hx, e), r_ = null), e;
		}
		function Jr(e) {
			r_ === null ? r_ = [e] : r_.push(e);
		}
		function Yr() {
			var e = n_;
			if (e !== null) {
				n_ = null;
				for (var t = Vt(e); 0 < e.children.length;) e = e.children[0];
				k(e.fiber, function() {
					console.error("A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:\n\n- A server/client branch `if (typeof window !== 'undefined')`.\n- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.\n- Date formatting in a user's locale which doesn't match the server.\n- External changing data without sending a snapshot of it along with the HTML.\n- Invalid HTML tag nesting.\n\nIt can also happen if the client has a browser extension installed which messes with the HTML before React loaded.\n\n%s%s", "https://react.dev/link/hydration-mismatch", t);
				});
			}
		}
		function Xr() {
			u_ = l_ = null, d_ = !1;
		}
		function Zr(e, t, n) {
			E(o_, t._currentValue, e), t._currentValue = n, E(s_, t._currentRenderer, e), t._currentRenderer !== void 0 && t._currentRenderer !== null && t._currentRenderer !== c_ && console.error("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), t._currentRenderer = c_;
		}
		function Qr(e, t) {
			e._currentValue = o_.current;
			var n = s_.current;
			oe(s_, t), e._currentRenderer = n, oe(o_, t);
		}
		function $r(e, t, n) {
			for (; e !== null;) {
				var r = e.alternate;
				if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
				e = e.return;
			}
			e !== n && console.error("Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue.");
		}
		function ei(e, t, n, r) {
			var i = e.child;
			for (i !== null && (i.return = e); i !== null;) {
				var a = i.dependencies;
				if (a !== null) {
					var o = i.child;
					a = a.firstContext;
					a: for (; a !== null;) {
						var s = a;
						a = i;
						for (var c = 0; c < t.length; c++) if (s.context === t[c]) {
							a.lanes |= n, s = a.alternate, s !== null && (s.lanes |= n), $r(a.return, n, e), r || (o = null);
							break a;
						}
						a = s.next;
					}
				} else if (i.tag === 18) {
					if (o = i.return, o === null) throw Error("We just came from a parent so we must have had a parent. This is a bug in React.");
					o.lanes |= n, a = o.alternate, a !== null && (a.lanes |= n), $r(o, n, e), o = null;
				} else o = i.child;
				if (o !== null) o.return = i;
				else for (o = i; o !== null;) {
					if (o === e) {
						o = null;
						break;
					}
					if (i = o.sibling, i !== null) {
						i.return = o.return, o = i;
						break;
					}
					o = o.return;
				}
				i = o;
			}
		}
		function ti(e, t, n, r) {
			e = null;
			for (var i = t, a = !1; i !== null;) {
				if (!a) {
					if (i.flags & 524288) a = !0;
					else if (i.flags & 262144) break;
				}
				if (i.tag === 10) {
					var o = i.alternate;
					if (o === null) throw Error("Should have a current fiber. This is a bug in React.");
					if (o = o.memoizedProps, o !== null) {
						var s = i.type;
						Wh(i.pendingProps.value, o.value) || (e === null ? e = [s] : e.push(s));
					}
				} else if (i === np.current) {
					if (o = i.alternate, o === null) throw Error("Should have a current fiber. This is a bug in React.");
					o.memoizedState.memoizedState !== i.memoizedState.memoizedState && (e === null ? e = [xC] : e.push(xC));
				}
				i = i.return;
			}
			e !== null && ei(t, e, n, r), t.flags |= 262144;
		}
		function ni(e) {
			for (e = e.firstContext; e !== null;) {
				if (!Wh(e.context._currentValue, e.memoizedValue)) return !0;
				e = e.next;
			}
			return !1;
		}
		function ri(e) {
			l_ = e, u_ = null, e = e.dependencies, e !== null && (e.firstContext = null);
		}
		function ii(e) {
			return d_ && console.error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo()."), oi(l_, e);
		}
		function ai(e, t) {
			return l_ === null && ri(e), oi(e, t);
		}
		function oi(e, t) {
			var n = t._currentValue;
			if (t = {
				context: t,
				memoizedValue: n,
				next: null
			}, u_ === null) {
				if (e === null) throw Error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
				u_ = t, e.dependencies = {
					lanes: 0,
					firstContext: t,
					_debugThenableState: null
				}, e.flags |= 524288;
			} else u_ = u_.next = t;
			return n;
		}
		function si() {
			return {
				controller: new f_(),
				data: /* @__PURE__ */ new Map(),
				refCount: 0
			};
		}
		function ci(e) {
			e.controller.signal.aborted && console.warn("A cache instance was retained after it was already freed. This likely indicates a bug in React."), e.refCount++;
		}
		function li(e) {
			e.refCount--, 0 > e.refCount && console.warn("A cache instance was released after it was already freed. This likely indicates a bug in React."), e.refCount === 0 && p_(m_, function() {
				e.controller.abort();
			});
		}
		function ui(e, t, n) {
			e & 127 ? 0 > A_ && (A_ = g_(), j_ = __(t), N_ = t, n != null && (P_ = T(n)), (Wb & (Fb | Ib)) !== Pb && (O_ = !0, M_ = v_), e = Ku(), t = Gu(), e !== L_ || t !== I_ ? L_ = -1.1 : t !== null && (M_ = v_), F_ = e, I_ = t) : e & 4194048 && 0 > V_ && (V_ = g_(), U_ = __(t), W_ = t, n != null && (G_ = T(n)), 0 > B_) && (e = Ku(), t = Gu(), (e !== J_ || t !== q_) && (J_ = -1.1), K_ = e, q_ = t);
		}
		function di(e) {
			if (0 > A_) {
				A_ = g_(), j_ = e._debugTask == null ? null : e._debugTask, (Wb & (Fb | Ib)) !== Pb && (M_ = v_);
				var t = Ku(), n = Gu();
				t !== L_ || n !== I_ ? L_ = -1.1 : n !== null && (M_ = v_), F_ = t, I_ = n;
			}
			0 > V_ && (V_ = g_(), U_ = e._debugTask == null ? null : e._debugTask, 0 > B_) && (e = Ku(), t = Gu(), (e !== J_ || t !== q_) && (J_ = -1.1), K_ = e, q_ = t);
		}
		function fi() {
			var e = T_;
			return T_ = 0, e;
		}
		function pi(e) {
			var t = T_;
			return T_ = e, t;
		}
		function mi(e) {
			var t = T_;
			return T_ += e, t;
		}
		function hi() {
			J = q = -1.1;
		}
		function gi() {
			var e = q;
			return q = -1.1, e;
		}
		function _i(e) {
			0 <= e && (q = e);
		}
		function vi() {
			var e = E_;
			return E_ = -0, e;
		}
		function yi(e) {
			0 <= e && (E_ = e);
		}
		function bi() {
			var e = D_;
			return D_ = null, e;
		}
		function xi() {
			var e = O_;
			return O_ = !1, e;
		}
		function Si(e) {
			w_ = g_(), 0 > e.actualStartTime && (e.actualStartTime = w_);
		}
		function Ci(e) {
			if (0 <= w_) {
				var t = g_() - w_;
				e.actualDuration += t, e.selfBaseDuration = t, w_ = -1;
			}
		}
		function wi(e) {
			if (0 <= w_) {
				var t = g_() - w_;
				e.actualDuration += t, w_ = -1;
			}
		}
		function Ti() {
			if (0 <= w_) {
				var e = g_(), t = e - w_;
				w_ = -1, T_ += t, E_ += t, J = e;
			}
		}
		function Ei(e) {
			D_ === null && (D_ = []), D_.push(e), C_ === null && (C_ = []), C_.push(e);
		}
		function Di() {
			w_ = g_(), 0 > q && (q = w_);
		}
		function Oi(e) {
			for (var t = e.child; t;) e.actualDuration += t.actualDuration, t = t.sibling;
		}
		function ki(e, t) {
			if (iv === null) {
				var n = iv = [];
				av = 0, ov = ru(), sv = {
					status: "pending",
					value: void 0,
					then: function(e) {
						n.push(e);
					}
				};
			}
			return av++, t.then(Ai, Ai), t;
		}
		function Ai() {
			if (--av === 0 && (-1 < V_ || (B_ = -1.1), iv !== null)) {
				sv !== null && (sv.status = "fulfilled");
				var e = iv;
				iv = null, ov = 0, sv = null;
				for (var t = 0; t < e.length; t++) (0, e[t])();
			}
		}
		function ji(e, t) {
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
		function Mi() {
			var e = lv.current;
			return e === null ? Gb.pooledCache : e;
		}
		function Ni(e, t) {
			t === null ? E(lv, lv.current, e) : E(lv, t.pool, e);
		}
		function Pi() {
			var e = Mi();
			return e === null ? null : {
				parent: h_._currentValue,
				pool: e
			};
		}
		function Fi() {
			return {
				didWarnAboutUncachedPromise: !1,
				thenables: []
			};
		}
		function Ii(e) {
			return e = e.status, e === "fulfilled" || e === "rejected";
		}
		function Li(e, t, n) {
			V.actQueue !== null && (V.didUsePromise = !0);
			var r = e.thenables;
			if (n = r[n], n === void 0 ? r.push(t) : n !== t && (e.didWarnAboutUncachedPromise || (e.didWarnAboutUncachedPromise = !0, console.error("A component was suspended by an uncached promise. Creating promises inside a Client Component or hook is not yet supported, except via a Suspense-compatible library or framework.")), t.then(sn, sn), t = n), t._debugInfo === void 0) {
				e = performance.now(), r = t.displayName;
				var i = {
					name: typeof r == "string" ? r : "Promise",
					start: e,
					end: e,
					value: t
				};
				t._debugInfo = [{ awaited: i }], t.status !== "fulfilled" && t.status !== "rejected" && (e = function() {
					i.end = performance.now();
				}, t.then(e, e));
			}
			switch (t.status) {
				case "fulfilled": return t.value;
				case "rejected": throw e = t.reason, Bi(e), e;
				default:
					if (typeof t.status == "string") t.then(sn, sn);
					else {
						if (e = Gb, e !== null && 100 < e.shellSuspendCounter) throw Error("An unknown Component is an async Client Component. Only Server Components can be async at the moment. This error is often caused by accidentally adding `'use client'` to a module that was originally written for the server.");
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
						case "rejected": throw e = t.reason, Bi(e), e;
					}
					throw Hv = t, Uv = !0, Rv;
			}
		}
		function Ri(e) {
			try {
				return Lv(e);
			} catch (e) {
				throw typeof e == "object" && e && typeof e.then == "function" ? (Hv = e, Uv = !0, Rv) : e;
			}
		}
		function zi() {
			if (Hv === null) throw Error("Expected a suspended thenable. This is a bug in React. Please file an issue.");
			var e = Hv;
			return Hv = null, Uv = !1, e;
		}
		function Bi(e) {
			if (e === Rv || e === Bv) throw Error("Hooks are not supported inside an async component. This error is often caused by accidentally adding `'use client'` to a module that was originally written for the server.");
		}
		function Vi(e) {
			var t = Y;
			return e != null && (Y = t === null ? e : t.concat(e)), t;
		}
		function Hi() {
			var e = Y;
			if (e != null) {
				for (var t = e.length - 1; 0 <= t; t--) if (e[t].name != null) {
					var n = e[t].debugTask;
					if (n != null) return n;
				}
			}
			return null;
		}
		function j(e, t, n) {
			for (var r = Object.keys(e.props), i = 0; i < r.length; i++) {
				var a = r[i];
				if (a !== "children" && a !== "key") {
					t === null && (t = Er(e, n.mode, 0), t._debugInfo = Y, t.return = n), k(t, function(e) {
						console.error("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", e);
					}, a);
					break;
				}
			}
		}
		function Ui(e) {
			var t = Gv;
			return Gv += 1, Wv === null && (Wv = Fi()), Li(Wv, e, t);
		}
		function Wi(e, t) {
			t = t.props.ref, e.ref = t === void 0 ? null : t;
		}
		function Gi(e, t) {
			throw t.$$typeof === Af ? Error("A React Element from an older version of React was rendered. This is not supported. It can happen if:\n- Multiple copies of the \"react\" package is used.\n- A library pre-bundled an old copy of \"react\" or \"react/jsx-runtime\".\n- A compiler tries to \"inline\" JSX instead of using the runtime.") : (e = Object.prototype.toString.call(t), Error("Objects are not valid as a React child (found: " + (e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e) + "). If you meant to render a collection of children, use an array instead."));
		}
		function Ki(e, t) {
			var n = Hi();
			n === null ? Gi(e, t) : n.run(Gi.bind(null, e, t));
		}
		function qi(e, t) {
			var n = T(e) || "Component";
			Yv[n] || (Yv[n] = !0, t = t.displayName || t.name || "Component", e.tag === 3 ? console.error("Functions are not valid as a React child. This may happen if you return %s instead of <%s /> from render. Or maybe you meant to call this function rather than return it.\n  root.render(%s)", t, t, t) : console.error("Functions are not valid as a React child. This may happen if you return %s instead of <%s /> from render. Or maybe you meant to call this function rather than return it.\n  <%s>{%s}</%s>", t, t, n, t, n));
		}
		function Ji(e, t) {
			var n = Hi();
			n === null ? qi(e, t) : n.run(qi.bind(null, e, t));
		}
		function Yi(e, t) {
			var n = T(e) || "Component";
			Xv[n] || (Xv[n] = !0, t = String(t), e.tag === 3 ? console.error("Symbols are not valid as a React child.\n  root.render(%s)", t) : console.error("Symbols are not valid as a React child.\n  <%s>%s</%s>", n, t, n));
		}
		function Xi(e, t) {
			var n = Hi();
			n === null ? Yi(e, t) : n.run(Yi.bind(null, e, t));
		}
		function Zi(e) {
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
			function i(e, t) {
				return e = Cr(e, t), e.index = 0, e.sibling = null, e;
			}
			function a(t, n, r) {
				return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 67108866, n) : (r = r.index, r < n ? (t.flags |= 67108866, n) : r)) : (t.flags |= 1048576, n);
			}
			function o(t) {
				return e && t.alternate === null && (t.flags |= 67108866), t;
			}
			function s(e, t, n, r) {
				return t === null || t.tag !== 6 ? (t = Or(n, e.mode, r), t.return = e, t._debugOwner = e, t._debugTask = e._debugTask, t._debugInfo = Y, t) : (t = i(t, n), t.return = e, t._debugInfo = Y, t);
			}
			function c(e, t, n, r) {
				var a = n.type;
				return a === Nf ? (t = u(e, t, n.props.children, r, n.key), j(n, t, e), t) : t !== null && (t.elementType === a || vr(t, n) || typeof a == "object" && a && a.$$typeof === Hf && Ri(a) === t.type) ? (t = i(t, n.props), Wi(t, n), t.return = e, t._debugOwner = n._owner, t._debugInfo = Y, t) : (t = Er(n, e.mode, r), Wi(t, n), t.return = e, t._debugInfo = Y, t);
			}
			function l(e, t, n, r) {
				return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = Ar(n, e.mode, r), t.return = e, t._debugInfo = Y, t) : (t = i(t, n.children || []), t.return = e, t._debugInfo = Y, t);
			}
			function u(e, t, n, r, a) {
				return t === null || t.tag !== 7 ? (t = Dr(n, e.mode, r, a), t.return = e, t._debugOwner = e, t._debugTask = e._debugTask, t._debugInfo = Y, t) : (t = i(t, n), t.return = e, t._debugInfo = Y, t);
			}
			function d(e, t, n) {
				if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = Or("" + t, e.mode, n), t.return = e, t._debugOwner = e, t._debugTask = e._debugTask, t._debugInfo = Y, t;
				if (typeof t == "object" && t) {
					switch (t.$$typeof) {
						case jf: return n = Er(t, e.mode, n), Wi(n, t), n.return = e, e = Vi(t._debugInfo), n._debugInfo = Y, Y = e, n;
						case Mf: return t = Ar(t, e.mode, n), t.return = e, t._debugInfo = Y, t;
						case Hf:
							var r = Vi(t._debugInfo);
							return t = Ri(t), e = d(e, t, n), Y = r, e;
					}
					if (qf(t) || re(t)) return n = Dr(t, e.mode, n, null), n.return = e, n._debugOwner = e, n._debugTask = e._debugTask, e = Vi(t._debugInfo), n._debugInfo = Y, Y = e, n;
					if (typeof t.then == "function") return r = Vi(t._debugInfo), e = d(e, Ui(t), n), Y = r, e;
					if (t.$$typeof === Lf) return d(e, ai(e, t), n);
					Ki(e, t);
				}
				return typeof t == "function" && Ji(e, t), typeof t == "symbol" && Xi(e, t), null;
			}
			function p(e, t, n, r) {
				var i = t === null ? null : t.key;
				if (typeof n == "string" && n !== "" || typeof n == "number" || typeof n == "bigint") return i === null ? s(e, t, "" + n, r) : null;
				if (typeof n == "object" && n) {
					switch (n.$$typeof) {
						case jf: return n.key === i ? (i = Vi(n._debugInfo), e = c(e, t, n, r), Y = i, e) : null;
						case Mf: return n.key === i ? l(e, t, n, r) : null;
						case Hf: return i = Vi(n._debugInfo), n = Ri(n), e = p(e, t, n, r), Y = i, e;
					}
					if (qf(n) || re(n)) return i === null ? (i = Vi(n._debugInfo), e = u(e, t, n, r, null), Y = i, e) : null;
					if (typeof n.then == "function") return i = Vi(n._debugInfo), e = p(e, t, Ui(n), r), Y = i, e;
					if (n.$$typeof === Lf) return p(e, t, ai(e, n), r);
					Ki(e, n);
				}
				return typeof n == "function" && Ji(e, n), typeof n == "symbol" && Xi(e, n), null;
			}
			function m(e, t, n, r, i) {
				if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, s(t, e, "" + r, i);
				if (typeof r == "object" && r) {
					switch (r.$$typeof) {
						case jf: return n = e.get(r.key === null ? n : r.key) || null, e = Vi(r._debugInfo), t = c(t, n, r, i), Y = e, t;
						case Mf: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
						case Hf:
							var a = Vi(r._debugInfo);
							return r = Ri(r), t = m(e, t, n, r, i), Y = a, t;
					}
					if (qf(r) || re(r)) return n = e.get(n) || null, e = Vi(r._debugInfo), t = u(t, n, r, i, null), Y = e, t;
					if (typeof r.then == "function") return a = Vi(r._debugInfo), t = m(e, t, n, Ui(r), i), Y = a, t;
					if (r.$$typeof === Lf) return m(e, t, n, ai(t, r), i);
					Ki(t, r);
				}
				return typeof r == "function" && Ji(t, r), typeof r == "symbol" && Xi(t, r), null;
			}
			function g(e, t, n, r) {
				if (typeof n != "object" || !n) return r;
				switch (n.$$typeof) {
					case jf:
					case Mf:
						f(e, t, n);
						var i = n.key;
						if (typeof i != "string") break;
						if (r === null) {
							r = /* @__PURE__ */ new Set(), r.add(i);
							break;
						}
						if (!r.has(i)) {
							r.add(i);
							break;
						}
						k(t, function() {
							console.error("Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.", i);
						});
						break;
					case Hf: n = Ri(n), g(e, t, n, r);
				}
				return r;
			}
			function _(i, o, s, c) {
				for (var l = null, u = null, f = null, h = o, _ = o = 0, v = null; h !== null && _ < s.length; _++) {
					h.index > _ ? (v = h, h = null) : v = h.sibling;
					var y = p(i, h, s[_], c);
					if (y === null) {
						h === null && (h = v);
						break;
					}
					l = g(i, y, s[_], l), e && h && y.alternate === null && t(i, h), o = a(y, o, _), f === null ? u = y : f.sibling = y, f = y, h = v;
				}
				if (_ === s.length) return n(i, h), K && Mr(i, _), u;
				if (h === null) {
					for (; _ < s.length; _++) h = d(i, s[_], c), h !== null && (l = g(i, h, s[_], l), o = a(h, o, _), f === null ? u = h : f.sibling = h, f = h);
					return K && Mr(i, _), u;
				}
				for (h = r(h); _ < s.length; _++) v = m(h, i, _, s[_], c), v !== null && (l = g(i, v, s[_], l), e && v.alternate !== null && h.delete(v.key === null ? _ : v.key), o = a(v, o, _), f === null ? u = v : f.sibling = v, f = v);
				return e && h.forEach(function(e) {
					return t(i, e);
				}), K && Mr(i, _), u;
			}
			function v(i, o, s, c) {
				if (s == null) throw Error("An iterable object provided no iterator.");
				for (var l = null, u = null, f = o, h = o = 0, _ = null, v = null, y = s.next(); f !== null && !y.done; h++, y = s.next()) {
					f.index > h ? (_ = f, f = null) : _ = f.sibling;
					var b = p(i, f, y.value, c);
					if (b === null) {
						f === null && (f = _);
						break;
					}
					v = g(i, b, y.value, v), e && f && b.alternate === null && t(i, f), o = a(b, o, h), u === null ? l = b : u.sibling = b, u = b, f = _;
				}
				if (y.done) return n(i, f), K && Mr(i, h), l;
				if (f === null) {
					for (; !y.done; h++, y = s.next()) f = d(i, y.value, c), f !== null && (v = g(i, f, y.value, v), o = a(f, o, h), u === null ? l = f : u.sibling = f, u = f);
					return K && Mr(i, h), l;
				}
				for (f = r(f); !y.done; h++, y = s.next()) _ = m(f, i, h, y.value, c), _ !== null && (v = g(i, _, y.value, v), e && _.alternate !== null && f.delete(_.key === null ? h : _.key), o = a(_, o, h), u === null ? l = _ : u.sibling = _, u = _);
				return e && f.forEach(function(e) {
					return t(i, e);
				}), K && Mr(i, h), l;
			}
			function y(e, r, a, s) {
				if (typeof a == "object" && a && a.type === Nf && a.key === null && (j(a, null, e), a = a.props.children), typeof a == "object" && a) {
					switch (a.$$typeof) {
						case jf:
							var c = Vi(a._debugInfo);
							a: {
								for (var l = a.key; r !== null;) {
									if (r.key === l) {
										if (l = a.type, l === Nf) {
											if (r.tag === 7) {
												n(e, r.sibling), s = i(r, a.props.children), s.return = e, s._debugOwner = a._owner, s._debugInfo = Y, j(a, s, e), e = s;
												break a;
											}
										} else if (r.elementType === l || vr(r, a) || typeof l == "object" && l && l.$$typeof === Hf && Ri(l) === r.type) {
											n(e, r.sibling), s = i(r, a.props), Wi(s, a), s.return = e, s._debugOwner = a._owner, s._debugInfo = Y, e = s;
											break a;
										}
										n(e, r);
										break;
									} else t(e, r);
									r = r.sibling;
								}
								a.type === Nf ? (s = Dr(a.props.children, e.mode, s, a.key), s.return = e, s._debugOwner = e, s._debugTask = e._debugTask, s._debugInfo = Y, j(a, s, e), e = s) : (s = Er(a, e.mode, s), Wi(s, a), s.return = e, s._debugInfo = Y, e = s);
							}
							return e = o(e), Y = c, e;
						case Mf:
							a: {
								for (c = a, a = c.key; r !== null;) {
									if (r.key === a) if (r.tag === 4 && r.stateNode.containerInfo === c.containerInfo && r.stateNode.implementation === c.implementation) {
										n(e, r.sibling), s = i(r, c.children || []), s.return = e, e = s;
										break a;
									} else {
										n(e, r);
										break;
									}
									else t(e, r);
									r = r.sibling;
								}
								s = Ar(c, e.mode, s), s.return = e, e = s;
							}
							return o(e);
						case Hf: return c = Vi(a._debugInfo), a = Ri(a), e = y(e, r, a, s), Y = c, e;
					}
					if (qf(a)) return c = Vi(a._debugInfo), e = _(e, r, a, s), Y = c, e;
					if (re(a)) {
						if (c = Vi(a._debugInfo), l = re(a), typeof l != "function") throw Error("An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.");
						var u = l.call(a);
						return u === a ? (e.tag !== 0 || Object.prototype.toString.call(e.type) !== "[object GeneratorFunction]" || Object.prototype.toString.call(u) !== "[object Generator]") && (qv || console.error("Using Iterators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. You can also use an Iterable that can iterate multiple times over the same items."), qv = !0) : a.entries !== l || Kv || (console.error("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), Kv = !0), e = v(e, r, u, s), Y = c, e;
					}
					if (typeof a.then == "function") return c = Vi(a._debugInfo), e = y(e, r, Ui(a), s), Y = c, e;
					if (a.$$typeof === Lf) return y(e, r, ai(e, a), s);
					Ki(e, a);
				}
				return typeof a == "string" && a !== "" || typeof a == "number" || typeof a == "bigint" ? (c = "" + a, r !== null && r.tag === 6 ? (n(e, r.sibling), s = i(r, c), s.return = e, e = s) : (n(e, r), s = Or(c, e.mode, s), s.return = e, s._debugOwner = e, s._debugTask = e._debugTask, s._debugInfo = Y, e = s), o(e)) : (typeof a == "function" && Ji(e, a), typeof a == "symbol" && Xi(e, a), n(e, r));
			}
			return function(e, t, n, r) {
				var i = Y;
				Y = null;
				try {
					Gv = 0;
					var a = y(e, t, n, r);
					return Wv = null, a;
				} catch (t) {
					if (t === Rv || t === Bv) throw t;
					var o = h(29, t, null, e.mode);
					o.lanes = r, o.return = e;
					var s = o._debugInfo = Y;
					if (o._debugOwner = e._debugOwner, o._debugTask = e._debugTask, s != null) {
						for (var c = s.length - 1; 0 <= c; c--) if (typeof s[c].stack == "string") {
							o._debugOwner = s[c], o._debugTask = s[c].debugTask;
							break;
						}
					}
					return o;
				} finally {
					Y = i;
				}
			};
		}
		function Qi(e, t) {
			var n = qf(e);
			return e = !n && typeof re(e) == "function", n || e ? (n = n ? "array" : "iterable", console.error("A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>", n, t, n), !1) : !0;
		}
		function $i(e) {
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
		function ea(e, t) {
			e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
				baseState: e.baseState,
				firstBaseUpdate: e.firstBaseUpdate,
				lastBaseUpdate: e.lastBaseUpdate,
				shared: e.shared,
				callbacks: null
			});
		}
		function ta(e) {
			return {
				lane: e,
				tag: $v,
				payload: null,
				callback: null,
				next: null
			};
		}
		function na(e, t, n) {
			var r = e.updateQueue;
			if (r === null) return null;
			if (r = r.shared, ay === r && !iy) {
				var i = T(e);
				console.error("An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback.\n\nPlease update the following component: %s", i), iy = !0;
			}
			return (Wb & Fb) === Pb ? (dr(e, r, t, n), hr(e)) : (i = r.pending, i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = hr(e), mr(e, null, n), t);
		}
		function ra(e, t, n) {
			if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
				var r = t.lanes;
				r &= e.pendingLanes, n |= r, t.lanes = n, Be(e, n);
			}
		}
		function ia(e, t) {
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
		function aa() {
			if (oy) {
				var e = sv;
				if (e !== null) throw e;
			}
		}
		function oa(e, t, n, r) {
			oy = !1;
			var i = e.updateQueue;
			ry = !1, ay = i.shared;
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
					if (p ? ($ & f) === f : (r & f) === f) {
						f !== 0 && f === ov && (oy = !0), u !== null && (u = u.next = {
							lane: 0,
							tag: s.tag,
							payload: s.payload,
							callback: null,
							next: null
						});
						a: {
							f = e;
							var m = s, h = t, g = n;
							switch (m.tag) {
								case ey:
									if (m = m.payload, typeof m == "function") {
										d_ = !0;
										var _ = m.call(g, d, h);
										if (f.mode & Rg) {
											ke(!0);
											try {
												m.call(g, d, h);
											} finally {
												ke(!1);
											}
										}
										d_ = !1, d = _;
										break a;
									}
									d = m;
									break a;
								case ny: f.flags = f.flags & -65537 | 128;
								case $v:
									if (_ = m.payload, typeof _ == "function") {
										if (d_ = !0, m = _.call(g, d, h), f.mode & Rg) {
											ke(!0);
											try {
												_.call(g, d, h);
											} finally {
												ke(!1);
											}
										}
										d_ = !1;
									} else m = _;
									if (m == null) break a;
									d = B({}, d, m);
									break a;
								case ty: ry = !0;
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
				u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), lx |= o, e.lanes = o, e.memoizedState = d;
			}
			ay = null;
		}
		function sa(e, t) {
			if (typeof e != "function") throw Error("Invalid argument passed as callback. Expected a function. Instead received: " + e);
			e.call(t);
		}
		function ca(e, t) {
			var n = e.shared.hiddenCallbacks;
			if (n !== null) for (e.shared.hiddenCallbacks = null, e = 0; e < n.length; e++) sa(n[e], t);
		}
		function la(e, t) {
			var n = e.callbacks;
			if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) sa(n[e], t);
		}
		function ua(e, t) {
			var n = sx;
			E(cy, n, e), E(sy, t, e), sx = n | t.baseLanes;
		}
		function da(e) {
			E(cy, sx, e), E(sy, sy.current, e);
		}
		function fa(e) {
			sx = cy.current, oe(sy, e), oe(cy, e);
		}
		function pa(e) {
			var t = e.alternate;
			E(py, py.current & dy, e), E(ly, e, e), uy === null && (t === null || sy.current !== null || t.memoizedState !== null) && (uy = e);
		}
		function ma(e) {
			E(py, py.current, e), E(ly, e, e), uy === null && (uy = e);
		}
		function ha(e) {
			e.tag === 22 ? (E(py, py.current, e), E(ly, e, e), uy === null && (uy = e)) : ga(e);
		}
		function ga(e) {
			E(py, py.current, e), E(ly, ly.current, e);
		}
		function _a(e) {
			oe(ly, e), uy === e && (uy = null), oe(py, e);
		}
		function va(e) {
			for (var t = e; t !== null;) {
				if (t.tag === 13) {
					var n = t.memoizedState;
					if (n !== null && (n = n.dehydrated, n === null || hd(n) || gd(n))) return t;
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
		function M() {
			var e = Z;
			Fy === null ? Fy = [e] : Fy.push(e);
		}
		function N() {
			var e = Z;
			if (Fy !== null && (Iy++, Fy[Iy] !== e)) {
				var t = T(X);
				if (!by.has(t) && (by.add(t), Fy !== null)) {
					for (var n = "", r = 0; r <= Iy; r++) {
						var i = Fy[r], a = r === Iy ? e : i;
						for (i = r + 1 + ". " + i; 30 > i.length;) i += " ";
						i += a + "\n", n += i;
					}
					console.error("React has detected a change in the order of Hooks called by %s. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://react.dev/link/rules-of-hooks\n\n   Previous render            Next render\n   ------------------------------------------------------\n%s   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n", t, n);
				}
			}
		}
		function ya(e) {
			e == null || qf(e) || console.error("%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.", Z, typeof e);
		}
		function ba() {
			var e = T(X);
			Cy.has(e) || (Cy.add(e), console.error("ReactDOM.useFormState has been renamed to React.useActionState. Please update %s to use React.useActionState.", e));
		}
		function xa() {
			throw Error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.");
		}
		function Sa(e, t) {
			if (Ly) return !1;
			if (t === null) return console.error("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", Z), !1;
			e.length !== t.length && console.error("The final argument passed to %s changed size between renders. The order and size of this array must remain constant.\n\nPrevious: %s\nIncoming: %s", Z, "[" + t.join(", ") + "]", "[" + e.join(", ") + "]");
			for (var n = 0; n < t.length && n < e.length; n++) if (!Wh(e[n], t[n])) return !1;
			return !0;
		}
		function Ca(e, t, n, r, i, a) {
			wy = a, X = t, Fy = e === null ? null : e._debugHookTypes, Iy = -1, Ly = e !== null && e.type !== t.type, (Object.prototype.toString.call(n) === "[object AsyncFunction]" || Object.prototype.toString.call(n) === "[object AsyncGeneratorFunction]") && (a = T(X), Sy.has(a) || (Sy.add(a), console.error("%s is an async Client Component. Only Server Components can be async at the moment. This error is often caused by accidentally adding `'use client'` to a module that was originally written for the server.", a === null ? "An unknown Component" : "<" + a + ">"))), t.memoizedState = null, t.updateQueue = null, t.lanes = 0, V.H = e !== null && e.memoizedState !== null ? Vy : Fy === null ? zy : By, ky = a = (t.mode & Rg) !== W;
			var o = xv(n, r, i);
			if (ky = !1, Oy && (o = Ta(t, n, r, i)), a) {
				ke(!0);
				try {
					o = Ta(t, n, r, i);
				} finally {
					ke(!1);
				}
			}
			return wa(e, t), o;
		}
		function wa(e, t) {
			t._debugHookTypes = Fy, t.dependencies === null ? My !== null && (t.dependencies = {
				lanes: 0,
				firstContext: null,
				_debugThenableState: My
			}) : t.dependencies._debugThenableState = My, V.H = Ry;
			var n = Ty !== null && Ty.next !== null;
			if (wy = 0, Fy = Z = Ey = Ty = X = null, Iy = -1, e !== null && (e.flags & 65011712) != (t.flags & 65011712) && console.error("Internal React error: Expected static flag was missing. Please notify the React team."), Dy = !1, jy = 0, My = null, n) throw Error("Rendered fewer hooks than expected. This may be caused by an accidental early return statement.");
			e === null || sb || (e = e.dependencies, e !== null && ni(e) && (sb = !0)), Uv ? (Uv = !1, e = !0) : e = !1, e && (t = T(t) || "Unknown", xy.has(t) || Sy.has(t) || (xy.add(t), console.error("`use` was called from inside a try/catch block. This is not allowed and can lead to unexpected behavior. To handle errors triggered by `use`, wrap your component in a error boundary.")));
		}
		function Ta(e, t, n, r) {
			X = e;
			var i = 0;
			do {
				if (Oy && (My = null), jy = 0, Oy = !1, i >= Py) throw Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
				if (i += 1, Ly = !1, Ey = Ty = null, e.updateQueue != null) {
					var a = e.updateQueue;
					a.lastEffect = null, a.events = null, a.stores = null, a.memoCache != null && (a.memoCache.index = 0);
				}
				Iy = -1, V.H = Hy, a = xv(t, n, r);
			} while (Oy);
			return a;
		}
		function Ea() {
			var e = V.H, t = e.useState()[0];
			return t = typeof t.then == "function" ? Na(t) : t, e = e.useState()[0], (Ty === null ? null : Ty.memoizedState) !== e && (X.flags |= 1024), t;
		}
		function Da() {
			var e = Ay !== 0;
			return Ay = 0, e;
		}
		function Oa(e, t, n) {
			t.updateQueue = e.updateQueue, t.flags = (t.mode & zg) === W ? t.flags & -2053 : t.flags & -402655237, e.lanes &= ~n;
		}
		function ka(e) {
			if (Dy) {
				for (e = e.memoizedState; e !== null;) {
					var t = e.queue;
					t !== null && (t.pending = null), e = e.next;
				}
				Dy = !1;
			}
			wy = 0, Fy = Ey = Ty = X = null, Iy = -1, Z = null, Oy = !1, jy = Ay = 0, My = null;
		}
		function Aa() {
			var e = {
				memoizedState: null,
				baseState: null,
				baseQueue: null,
				queue: null,
				next: null
			};
			return Ey === null ? X.memoizedState = Ey = e : Ey = Ey.next = e, Ey;
		}
		function ja() {
			if (Ty === null) {
				var e = X.alternate;
				e = e === null ? null : e.memoizedState;
			} else e = Ty.next;
			var t = Ey === null ? X.memoizedState : Ey.next;
			if (t !== null) Ey = t, Ty = e;
			else {
				if (e === null) throw X.alternate === null ? Error("Update hook called on initial render. This is likely a bug in React. Please file an issue.") : Error("Rendered more hooks than during the previous render.");
				Ty = e, e = {
					memoizedState: Ty.memoizedState,
					baseState: Ty.baseState,
					baseQueue: Ty.baseQueue,
					queue: Ty.queue,
					next: null
				}, Ey === null ? X.memoizedState = Ey = e : Ey = Ey.next = e;
			}
			return Ey;
		}
		function Ma() {
			return {
				lastEffect: null,
				events: null,
				stores: null,
				memoCache: null
			};
		}
		function Na(e) {
			var t = jy;
			return jy += 1, My === null && (My = Fi()), e = Li(My, e, t), t = X, (Ey === null ? t.memoizedState : Ey.next) === null && (t = t.alternate, V.H = t !== null && t.memoizedState !== null ? Vy : zy), e;
		}
		function Pa(e) {
			if (typeof e == "object" && e) {
				if (typeof e.then == "function") return Na(e);
				if (e.$$typeof === Lf) return ii(e);
			}
			throw Error("An unsupported type was passed to use(): " + String(e));
		}
		function Fa(e) {
			var t = null, n = X.updateQueue;
			if (n !== null && (t = n.memoCache), t == null) {
				var r = X.alternate;
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
			}, n === null && (n = Ma(), X.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0 || Ly) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = Wf;
			else n.length !== e && console.error("Expected a constant size argument for each invocation of useMemoCache. The previous cache was allocated with size %s but size %s was requested.", n.length, e);
			return t.index++, n;
		}
		function Ia(e, t) {
			return typeof t == "function" ? t(e) : t;
		}
		function La(e, t, n) {
			var r = Aa();
			if (n !== void 0) {
				var i = n(t);
				if (ky) {
					ke(!0);
					try {
						n(t);
					} finally {
						ke(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = Uo.bind(null, X, e), [r.memoizedState, e];
		}
		function Ra(e) {
			return za(ja(), Ty, e);
		}
		function za(e, t, n) {
			var r = e.queue;
			if (r === null) throw Error("Should have a queue. You are likely calling Hooks conditionally, which is not allowed. (https://react.dev/link/invalid-hook-call)");
			r.lastRenderedReducer = n;
			var i = e.baseQueue, a = r.pending;
			if (a !== null) {
				if (i !== null) {
					var o = i.next;
					i.next = a.next, a.next = o;
				}
				t.baseQueue !== i && console.error("Internal error: Expected work-in-progress queue to be a clone. This is a bug in React."), t.baseQueue = i = a, r.pending = null;
			}
			if (a = e.baseState, i === null) e.memoizedState = a;
			else {
				t = i.next;
				var s = o = null, c = null, l = t, u = !1;
				do {
					var d = l.lane & -536870913;
					if (d === l.lane ? (wy & d) === d : ($ & d) === d) {
						var f = l.revertLane;
						if (f === 0) c !== null && (c = c.next = {
							lane: 0,
							revertLane: 0,
							gesture: null,
							action: l.action,
							hasEagerState: l.hasEagerState,
							eagerState: l.eagerState,
							next: null
						}), d === ov && (u = !0);
						else if ((wy & f) === f) {
							l = l.next, f === ov && (u = !0);
							continue;
						} else d = {
							lane: 0,
							revertLane: l.revertLane,
							gesture: null,
							action: l.action,
							hasEagerState: l.hasEagerState,
							eagerState: l.eagerState,
							next: null
						}, c === null ? (s = c = d, o = a) : c = c.next = d, X.lanes |= f, lx |= f;
						d = l.action, ky && n(a, d), a = l.hasEagerState ? l.eagerState : n(a, d);
					} else f = {
						lane: d,
						revertLane: l.revertLane,
						gesture: l.gesture,
						action: l.action,
						hasEagerState: l.hasEagerState,
						eagerState: l.eagerState,
						next: null
					}, c === null ? (s = c = f, o = a) : c = c.next = f, X.lanes |= d, lx |= d;
					l = l.next;
				} while (l !== null && l !== t);
				if (c === null ? o = a : c.next = s, !Wh(a, e.memoizedState) && (sb = !0, u && (n = sv, n !== null))) throw n;
				e.memoizedState = a, e.baseState = o, e.baseQueue = c, r.lastRenderedState = a;
			}
			return i === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
		}
		function Ba(e) {
			var t = ja(), n = t.queue;
			if (n === null) throw Error("Should have a queue. You are likely calling Hooks conditionally, which is not allowed. (https://react.dev/link/invalid-hook-call)");
			n.lastRenderedReducer = e;
			var r = n.dispatch, i = n.pending, a = t.memoizedState;
			if (i !== null) {
				n.pending = null;
				var o = i = i.next;
				do
					a = e(a, o.action), o = o.next;
				while (o !== i);
				Wh(a, t.memoizedState) || (sb = !0), t.memoizedState = a, t.baseQueue === null && (t.baseState = a), n.lastRenderedState = a;
			}
			return [a, r];
		}
		function Va(e, t, n) {
			var r = X, i = Aa();
			if (K) {
				if (n === void 0) throw Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
				var a = n();
				yy || a === n() || (console.error("The result of getServerSnapshot should be cached to avoid an infinite loop"), yy = !0);
			} else {
				if (a = t(), yy || (n = t(), Wh(a, n) || (console.error("The result of getSnapshot should be cached to avoid an infinite loop"), yy = !0)), Gb === null) throw Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
				$ & 127 || Ua(r, t, a);
			}
			return i.memoizedState = a, n = {
				value: a,
				getSnapshot: t
			}, i.queue = n, _o(Ga.bind(null, r, n, e), [e]), r.flags |= 2048, po(hy | vy, { destroy: void 0 }, Wa.bind(null, r, n, a, t), null), a;
		}
		function Ha(e, t, n) {
			var r = X, i = ja(), a = K;
			if (a) {
				if (n === void 0) throw Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
				n = n();
			} else if (n = t(), !yy) {
				var o = t();
				Wh(n, o) || (console.error("The result of getSnapshot should be cached to avoid an infinite loop"), yy = !0);
			}
			if ((o = !Wh((Ty || i).memoizedState, n)) && (i.memoizedState = n, sb = !0), i = i.queue, go(2048, vy, Ga.bind(null, r, i, e), [e]), i.getSnapshot !== t || o || Ey !== null && Ey.memoizedState.tag & hy) {
				if (r.flags |= 2048, po(hy | vy, { destroy: void 0 }, Wa.bind(null, r, i, n, t), null), Gb === null) throw Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
				a || wy & 127 || Ua(r, t, n);
			}
			return n;
		}
		function Ua(e, t, n) {
			e.flags |= 16384, e = {
				getSnapshot: t,
				value: n
			}, t = X.updateQueue, t === null ? (t = Ma(), X.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
		}
		function Wa(e, t, n, r) {
			t.value = n, t.getSnapshot = r, Ka(t) && qa(e);
		}
		function Ga(e, t, n) {
			return n(function() {
				Ka(t) && (ui(2, "updateSyncExternalStore()", e), qa(e));
			});
		}
		function Ka(e) {
			var t = e.getSnapshot;
			e = e.value;
			try {
				var n = t();
				return !Wh(e, n);
			} catch {
				return !0;
			}
		}
		function qa(e) {
			var t = pr(e, 2);
			t !== null && nl(t, e, 2);
		}
		function Ja(e) {
			var t = Aa();
			if (typeof e == "function") {
				var n = e;
				if (e = n(), ky) {
					ke(!0);
					try {
						n();
					} finally {
						ke(!1);
					}
				}
			}
			return t.memoizedState = t.baseState = e, t.queue = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: Ia,
				lastRenderedState: e
			}, t;
		}
		function Ya(e) {
			e = Ja(e);
			var t = e.queue, n = Wo.bind(null, X, t);
			return t.dispatch = n, [e.memoizedState, n];
		}
		function Xa(e) {
			var t = Aa();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = Ko.bind(null, X, !0, n), n.dispatch = t, [e, t];
		}
		function Za(e, t) {
			return Qa(ja(), Ty, e, t);
		}
		function Qa(e, t, n, r) {
			return e.baseState = n, za(e, Ty, typeof r == "function" ? r : Ia);
		}
		function $a(e, t) {
			var n = ja();
			return Ty === null ? (n.baseState = e, [e, n.queue.dispatch]) : Qa(n, Ty, e, t);
		}
		function eo(e, t, n, r, i) {
			if (qo(e)) throw Error("Cannot update form state while rendering.");
			if (e = t.action, e !== null) {
				var a = {
					payload: i,
					action: e,
					next: null,
					isTransition: !0,
					status: "pending",
					value: null,
					reason: null,
					listeners: [],
					then: function(e) {
						a.listeners.push(e);
					}
				};
				V.T === null ? a.isTransition = !1 : n(!0), r(a), n = t.pending, n === null ? (a.next = t.pending = a, to(t, a)) : (a.next = n.next, t.pending = n.next = a);
			}
		}
		function to(e, t) {
			var n = t.action, r = t.payload, i = e.state;
			if (t.isTransition) {
				var a = V.T, o = {};
				o._updatedFibers = /* @__PURE__ */ new Set(), V.T = o;
				try {
					var s = n(i, r), c = V.S;
					c !== null && c(o, s), no(e, t, s);
				} catch (n) {
					io(e, t, n);
				} finally {
					a !== null && o.types !== null && (a.types !== null && a.types !== o.types && console.error("We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."), a.types = o.types), V.T = a, a === null && o._updatedFibers && (e = o._updatedFibers.size, o._updatedFibers.clear(), 10 < e && console.warn("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."));
				}
			} else try {
				o = n(i, r), no(e, t, o);
			} catch (n) {
				io(e, t, n);
			}
		}
		function no(e, t, n) {
			typeof n == "object" && n && typeof n.then == "function" ? (V.asyncTransitions++, n.then(jo, jo), n.then(function(n) {
				ro(e, t, n);
			}, function(n) {
				return io(e, t, n);
			}), t.isTransition || console.error("An async function with useActionState was called outside of a transition. This is likely not what you intended (for example, isPending will not update correctly). Either call the returned function inside startTransition, or pass it to an `action` or `formAction` prop.")) : ro(e, t, n);
		}
		function ro(e, t, n) {
			t.status = "fulfilled", t.value = n, ao(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, to(e, n)));
		}
		function io(e, t, n) {
			var r = e.pending;
			if (e.pending = null, r !== null) {
				r = r.next;
				do
					t.status = "rejected", t.reason = n, ao(t), t = t.next;
				while (t !== r);
			}
			e.action = null;
		}
		function ao(e) {
			e = e.listeners;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
		function oo(e, t) {
			return t;
		}
		function so(e, t) {
			if (K) {
				var n = Gb.formState;
				if (n !== null) {
					a: {
						var r = X;
						if (K) {
							if (e_) {
								b: {
									for (var i = e_, a = i_; i.nodeType !== 8;) {
										if (!a) {
											i = null;
											break b;
										}
										if (i = vd(i.nextSibling), i === null) {
											i = null;
											break b;
										}
									}
									a = i.data, i = a === BS || a === VS ? i : null;
								}
								if (i) {
									e_ = vd(i.nextSibling), r = i.data === BS;
									break a;
								}
							}
							Hr(r);
						}
						r = !1;
					}
					r && (t = n[0]);
				}
			}
			return n = Aa(), n.memoizedState = n.baseState = t, r = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: oo,
				lastRenderedState: t
			}, n.queue = r, n = Wo.bind(null, X, r), r.dispatch = n, r = Ja(!1), a = Ko.bind(null, X, !1, r.queue), r = Aa(), i = {
				state: t,
				dispatch: null,
				action: e,
				pending: null
			}, r.queue = i, n = eo.bind(null, X, i, a, n), i.dispatch = n, r.memoizedState = e, [
				t,
				n,
				!1
			];
		}
		function co(e) {
			return lo(ja(), Ty, e);
		}
		function lo(e, t, n) {
			if (t = za(e, t, oo)[0], e = Ra(Ia)[0], typeof t == "object" && t && typeof t.then == "function") try {
				var r = Na(t);
			} catch (e) {
				throw e === Rv ? Bv : e;
			}
			else r = t;
			t = ja();
			var i = t.queue, a = i.dispatch;
			return n !== t.memoizedState && (X.flags |= 2048, po(hy | vy, { destroy: void 0 }, uo.bind(null, i, n), null)), [
				r,
				a,
				e
			];
		}
		function uo(e, t) {
			e.action = t;
		}
		function fo(e) {
			var t = ja(), n = Ty;
			if (n !== null) return lo(t, n, e);
			ja(), t = t.memoizedState, n = ja();
			var r = n.queue.dispatch;
			return n.memoizedState = e, [
				t,
				r,
				!1
			];
		}
		function po(e, t, n, r) {
			return e = {
				tag: e,
				create: n,
				deps: r,
				inst: t,
				next: null
			}, t = X.updateQueue, t === null && (t = Ma(), X.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
		}
		function mo(e) {
			var t = Aa();
			return e = { current: e }, t.memoizedState = e;
		}
		function ho(e, t, n, r) {
			var i = Aa();
			X.flags |= e, i.memoizedState = po(hy | t, { destroy: void 0 }, n, r === void 0 ? null : r);
		}
		function go(e, t, n, r) {
			var i = ja();
			r = r === void 0 ? null : r;
			var a = i.memoizedState.inst;
			Ty !== null && r !== null && Sa(r, Ty.memoizedState.deps) ? i.memoizedState = po(t, a, n, r) : (X.flags |= e, i.memoizedState = po(hy | t, a, n, r));
		}
		function _o(e, t) {
			(X.mode & zg) === W ? ho(8390656, vy, e, t) : ho(276826112, vy, e, t);
		}
		function P(e) {
			X.flags |= 4;
			var t = X.updateQueue;
			if (t === null) t = Ma(), X.updateQueue = t, t.events = [e];
			else {
				var n = t.events;
				n === null ? t.events = [e] : n.push(e);
			}
		}
		function vo(e) {
			var t = Aa(), n = { impl: e };
			return t.memoizedState = n, function() {
				if ((Wb & Fb) !== Pb) throw Error("A function wrapped in useEffectEvent can't be called during rendering.");
				return n.impl.apply(void 0, arguments);
			};
		}
		function F(e) {
			var t = ja().memoizedState;
			return P({
				ref: t,
				nextImpl: e
			}), function() {
				if ((Wb & Fb) !== Pb) throw Error("A function wrapped in useEffectEvent can't be called during rendering.");
				return t.impl.apply(void 0, arguments);
			};
		}
		function I(e, t) {
			var n = 4194308;
			return (X.mode & zg) !== W && (n |= 134217728), ho(n, _y, e, t);
		}
		function yo(e, t) {
			if (typeof t == "function") {
				e = e();
				var n = t(e);
				return function() {
					typeof n == "function" ? n() : t(null);
				};
			}
			if (t != null) return t.hasOwnProperty("current") || console.error("Expected useImperativeHandle() first argument to either be a ref callback or React.createRef() object. Instead received: %s.", "an object with keys {" + Object.keys(t).join(", ") + "}"), e = e(), t.current = e, function() {
				t.current = null;
			};
		}
		function bo(e, t, n) {
			typeof t != "function" && console.error("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t === null ? "null" : typeof t), n = n == null ? null : n.concat([e]);
			var r = 4194308;
			(X.mode & zg) !== W && (r |= 134217728), ho(r, _y, yo.bind(null, t, e), n);
		}
		function xo(e, t, n) {
			typeof t != "function" && console.error("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t === null ? "null" : typeof t), n = n == null ? null : n.concat([e]), go(4, _y, yo.bind(null, t, e), n);
		}
		function So(e, t) {
			return Aa().memoizedState = [e, t === void 0 ? null : t], e;
		}
		function Co(e, t) {
			var n = ja();
			t = t === void 0 ? null : t;
			var r = n.memoizedState;
			return t !== null && Sa(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
		}
		function wo(e, t) {
			var n = Aa();
			t = t === void 0 ? null : t;
			var r = e();
			if (ky) {
				ke(!0);
				try {
					e();
				} finally {
					ke(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		}
		function To(e, t) {
			var n = ja();
			t = t === void 0 ? null : t;
			var r = n.memoizedState;
			if (t !== null && Sa(t, r[1])) return r[0];
			if (r = e(), ky) {
				ke(!0);
				try {
					e();
				} finally {
					ke(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		}
		function Eo(e, t) {
			return ko(Aa(), e, t);
		}
		function Do(e, t) {
			return Ao(ja(), Ty.memoizedState, e, t);
		}
		function Oo(e, t) {
			var n = ja();
			return Ty === null ? ko(n, e, t) : Ao(n, Ty.memoizedState, e, t);
		}
		function ko(e, t, n) {
			return n === void 0 || wy & 1073741824 && !($ & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = tl(), X.lanes |= e, lx |= e, n);
		}
		function Ao(e, t, n, r) {
			return Wh(n, t) ? n : sy.current === null ? !(wy & 42) || wy & 1073741824 && !($ & 261930) ? (sb = !0, e.memoizedState = n) : (e = tl(), X.lanes |= e, lx |= e, t) : (e = ko(e, n, r), Wh(e, t) || (sb = !0), e);
		}
		function jo() {
			V.asyncTransitions--;
		}
		function Mo(e, t, n, r, i) {
			var a = Jf.p;
			Jf.p = a !== 0 && a < Hp ? a : Hp;
			var o = V.T, s = {};
			s._updatedFibers = /* @__PURE__ */ new Set(), V.T = s, Ko(e, !1, t, n);
			try {
				var c = i(), l = V.S;
				if (l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function") {
					V.asyncTransitions++, c.then(jo, jo);
					var u = ji(c, r);
					Go(e, t, u, el(e));
				} else Go(e, t, r, el(e));
			} catch (n) {
				Go(e, t, {
					then: function() {},
					status: "rejected",
					reason: n
				}, el(e));
			} finally {
				Jf.p = a, o !== null && s.types !== null && (o.types !== null && o.types !== s.types && console.error("We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."), o.types = s.types), V.T = o, o === null && s._updatedFibers && (e = s._updatedFibers.size, s._updatedFibers.clear(), 10 < e && console.warn("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."));
			}
		}
		function No(e, t, n, r) {
			if (e.tag !== 5) throw Error("Expected the form instance to be a HostComponent. This is a bug in React.");
			var i = Po(e).queue;
			di(e), Mo(e, i, t, bC, n === null ? u : function() {
				return Fo(e), n(r);
			});
		}
		function Po(e) {
			var t = e.memoizedState;
			if (t !== null) return t;
			t = {
				memoizedState: bC,
				baseState: bC,
				baseQueue: null,
				queue: {
					pending: null,
					lanes: 0,
					dispatch: null,
					lastRenderedReducer: Ia,
					lastRenderedState: bC
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
					lastRenderedReducer: Ia,
					lastRenderedState: n
				},
				next: null
			}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
		}
		function Fo(e) {
			V.T === null && console.error("requestFormReset was called outside a transition or action. To fix, move to an action, or wrap with startTransition.");
			var t = Po(e);
			t.next === null && (t = e.alternate.memoizedState), Go(e, t.next.queue, {}, el(e));
		}
		function Io() {
			var e = Ja(!1);
			return e = Mo.bind(null, X, e.queue, !0, !1), Aa().memoizedState = e, [!1, e];
		}
		function Lo() {
			var e = Ra(Ia)[0], t = ja().memoizedState;
			return [typeof e == "boolean" ? e : Na(e), t];
		}
		function Ro() {
			var e = Ba(Ia)[0], t = ja().memoizedState;
			return [typeof e == "boolean" ? e : Na(e), t];
		}
		function zo() {
			return ii(xC);
		}
		function Bo() {
			var e = Aa(), t = Gb.identifierPrefix;
			if (K) {
				var n = Qg, r = Zg;
				n = (r & ~(1 << 32 - Fp(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = Ay++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = Ny++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		}
		function Vo() {
			return Aa().memoizedState = Ho.bind(null, X);
		}
		function Ho(e, t) {
			for (var n = e.return; n !== null;) {
				switch (n.tag) {
					case 24:
					case 3:
						var r = el(n), i = ta(r), a = na(n, i, r);
						a !== null && (ui(r, "refresh()", e), nl(a, n, r), ra(a, n, r)), e = si(), t != null && a !== null && console.error("The seed argument is not enabled outside experimental channels."), i.payload = { cache: e };
						return;
				}
				n = n.return;
			}
		}
		function Uo(e, t, n) {
			var r = arguments;
			typeof r[3] == "function" && console.error("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect()."), r = el(e);
			var i = {
				lane: r,
				revertLane: 0,
				gesture: null,
				action: n,
				hasEagerState: !1,
				eagerState: null,
				next: null
			};
			qo(e) ? Jo(t, i) : (i = fr(e, t, i, r), i !== null && (ui(r, "dispatch()", e), nl(i, e, r), Yo(i, t, r)));
		}
		function Wo(e, t, n) {
			var r = arguments;
			typeof r[3] == "function" && console.error("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect()."), r = el(e), Go(e, t, n, r) && ui(r, "setState()", e);
		}
		function Go(e, t, n, r) {
			var i = {
				lane: r,
				revertLane: 0,
				gesture: null,
				action: n,
				hasEagerState: !1,
				eagerState: null,
				next: null
			};
			if (qo(e)) Jo(t, i);
			else {
				var a = e.alternate;
				if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) {
					var o = V.H;
					V.H = Wy;
					try {
						var s = t.lastRenderedState, c = a(s, n);
						if (i.hasEagerState = !0, i.eagerState = c, Wh(c, s)) return dr(e, t, i, 0), Gb === null && ur(), !1;
					} catch {} finally {
						V.H = o;
					}
				}
				if (n = fr(e, t, i, r), n !== null) return nl(n, e, r), Yo(n, t, r), !0;
			}
			return !1;
		}
		function Ko(e, t, n, r) {
			if (V.T === null && ov === 0 && console.error("An optimistic state update occurred outside a transition or action. To fix, move the update to an action, or wrap with startTransition."), r = {
				lane: 2,
				revertLane: ru(),
				gesture: null,
				action: r,
				hasEagerState: !1,
				eagerState: null,
				next: null
			}, qo(e)) {
				if (t) throw Error("Cannot update optimistic state while rendering.");
				console.error("Cannot call startTransition while rendering.");
			} else t = fr(e, n, r, 2), t !== null && (ui(2, "setOptimistic()", e), nl(t, e, 2));
		}
		function qo(e) {
			var t = e.alternate;
			return e === X || t !== null && t === X;
		}
		function Jo(e, t) {
			Oy = Dy = !0;
			var n = e.pending;
			n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
		}
		function Yo(e, t, n) {
			if (n & 4194048) {
				var r = t.lanes;
				r &= e.pendingLanes, n |= r, t.lanes = n, Be(e, n);
			}
		}
		function Xo(e) {
			if (e !== null && typeof e != "function") {
				var t = String(e);
				nb.has(t) || (nb.add(t), console.error("Expected the last optional `callback` argument to be a function. Instead received: %s.", e));
			}
		}
		function Zo(e, t, n, r) {
			var i = e.memoizedState, a = n(r, i);
			if (e.mode & Rg) {
				ke(!0);
				try {
					a = n(r, i);
				} finally {
					ke(!1);
				}
			}
			a === void 0 && (t = w(t) || "Component", Qy.has(t) || (Qy.add(t), console.error("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", t))), i = a == null ? i : B({}, i, a), e.memoizedState = i, e.lanes === 0 && (e.updateQueue.baseState = i);
		}
		function Qo(e, t, n, r, i, a, o) {
			var s = e.stateNode;
			if (typeof s.shouldComponentUpdate == "function") {
				if (n = s.shouldComponentUpdate(r, a, o), e.mode & Rg) {
					ke(!0);
					try {
						n = s.shouldComponentUpdate(r, a, o);
					} finally {
						ke(!1);
					}
				}
				return n === void 0 && console.error("%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", w(t) || "Component"), n;
			}
			return t.prototype && t.prototype.isPureReactComponent ? !In(n, r) || !In(i, a) : !0;
		}
		function $o(e, t, n, r) {
			var i = t.state;
			typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== i && (e = T(e) || "Component", qy.has(e) || (qy.add(e), console.error("%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", e)), rb.enqueueReplaceState(t, t.state, null));
		}
		function es(e, t) {
			var n = t;
			if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
			if (e = e.defaultProps) for (var i in n === t && (n = B({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
			return n;
		}
		function ts(e) {
			fg(e), console.warn("%s\n\n%s\n", ib ? "An error occurred in the <" + ib + "> component." : "An error occurred in one of your React components.", "Consider adding an error boundary to your tree to customize error handling behavior.\nVisit https://react.dev/link/error-boundaries to learn more about error boundaries.");
		}
		function ns(e) {
			var t = ib ? "The above error occurred in the <" + ib + "> component." : "The above error occurred in one of your React components.", n = "React will try to recreate this component tree from scratch using the error boundary you provided, " + ((ab || "Anonymous") + ".");
			if (typeof e == "object" && e && typeof e.environmentName == "string") {
				var r = e.environmentName;
				e = [
					"%o\n\n%s\n\n%s\n",
					e,
					t,
					n
				].slice(0), typeof e[0] == "string" ? e.splice(0, 1, SC + " " + e[0], CC, TC + r + TC, wC) : e.splice(0, 0, SC, CC, TC + r + TC, wC), e.unshift(console), r = EC.apply(console.error, e), r();
			} else console.error("%o\n\n%s\n\n%s\n", e, t, n);
		}
		function rs(e) {
			fg(e);
		}
		function is(e, t) {
			try {
				ib = t.source ? T(t.source) : null, ab = null;
				var n = t.value;
				if (V.actQueue !== null) V.thrownErrors.push(n);
				else {
					var r = e.onUncaughtError;
					r(n, { componentStack: t.stack });
				}
			} catch (e) {
				setTimeout(function() {
					throw e;
				});
			}
		}
		function as(e, t, n) {
			try {
				ib = n.source ? T(n.source) : null, ab = T(t);
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
		function os(e, t, n) {
			return n = ta(n), n.tag = ny, n.payload = { element: null }, n.callback = function() {
				k(t.source, is, e, t);
			}, n;
		}
		function ss(e) {
			return e = ta(e), e.tag = ny, e;
		}
		function cs(e, t, n, r) {
			var i = n.type.getDerivedStateFromError;
			if (typeof i == "function") {
				var a = r.value;
				e.payload = function() {
					return i(a);
				}, e.callback = function() {
					yr(n), k(r.source, as, t, n, r);
				};
			}
			var o = n.stateNode;
			o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
				yr(n), k(r.source, as, t, n, r), typeof i != "function" && (wx === null ? wx = new Set([this]) : wx.add(this)), kv(this, r), typeof i == "function" || !(n.lanes & 2) && console.error("%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", T(n) || "Unknown");
			});
		}
		function ls(e, t, n, r, i) {
			if (n.flags |= 32768, Pp && Kl(e, i), typeof r == "object" && r && typeof r.then == "function") {
				if (t = n.alternate, t !== null && ti(t, n, i, !0), K && (t_ = !0), n = ly.current, n !== null) {
					switch (n.tag) {
						case 31:
						case 13: return uy === null ? gl() : n.alternate === null && cx === Lb && (cx = Bb), n.flags &= -257, n.flags |= 65536, n.lanes = i, r === Vv ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = new Set([r]) : t.add(r), Ll(e, r, i)), !1;
						case 22: return n.flags |= 65536, r === Vv ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
							transitions: null,
							markerInstances: null,
							retryQueue: new Set([r])
						}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = new Set([r]) : n.add(r)), Ll(e, r, i)), !1;
					}
					throw Error("Unexpected Suspense handler tag (" + n.tag + "). This is a bug in React.");
				}
				return Ll(e, r, i), gl(), !1;
			}
			if (K) return t_ = !0, t = ly.current, t === null ? (r !== a_ && Jr(jr(Error("There was an error while hydrating but React was able to recover by instead client rendering the entire root.", { cause: r }), n)), e = e.current.alternate, e.flags |= 65536, i &= -i, e.lanes |= i, r = jr(r, n), i = os(e.stateNode, r, i), ia(e, i), cx !== Vb && (cx = zb)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = i, r !== a_ && Jr(jr(Error("There was an error while hydrating but React was able to recover by instead client rendering from the nearest Suspense boundary.", { cause: r }), n))), !1;
			var a = jr(Error("There was an error during concurrent rendering but React was able to recover by instead synchronously rendering the entire root.", { cause: r }), n);
			if (mx === null ? mx = [a] : mx.push(a), cx !== Vb && (cx = zb), t === null) return !0;
			r = jr(r, n), n = t;
			do {
				switch (n.tag) {
					case 3: return n.flags |= 65536, e = i & -i, n.lanes |= e, e = os(n.stateNode, r, e), ia(n, e), !1;
					case 1: if (t = n.type, a = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || a !== null && typeof a.componentDidCatch == "function" && (wx === null || !wx.has(a)))) return n.flags |= 65536, i &= -i, n.lanes |= i, i = ss(i), cs(i, e, n, r), ia(n, i), !1;
				}
				n = n.return;
			} while (n !== null);
			return !1;
		}
		function us(e, t, n, r) {
			t.child = e === null ? Qv(t, null, n, r) : Zv(t, e.child, n, r);
		}
		function ds(e, t, n, r, i) {
			n = n.render;
			var a = t.ref;
			if ("ref" in r) {
				var o = {};
				for (var s in r) s !== "ref" && (o[s] = r[s]);
			} else o = r;
			return ri(t), r = Ca(e, t, n, o, a, i), s = Da(), e !== null && !sb ? (Oa(e, t, i), Fs(e, t, i)) : (K && s && Pr(t), t.flags |= 1, us(e, t, r, i), t.child);
		}
		function fs(e, t, n, r, i) {
			if (e === null) {
				var a = n.type;
				return typeof a == "function" && !Sr(a) && a.defaultProps === void 0 && n.compare === null ? (n = gr(a), t.tag = 15, t.type = n, Ts(t, a), ps(e, t, n, r, i)) : (e = Tr(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
			}
			if (a = e.child, !Is(e, i)) {
				var o = a.memoizedProps;
				if (n = n.compare, n = n === null ? In : n, n(o, r) && e.ref === t.ref) return Fs(e, t, i);
			}
			return t.flags |= 1, e = Cr(a, r), e.ref = t.ref, e.return = t, t.child = e;
		}
		function ps(e, t, n, r, i) {
			if (e !== null) {
				var a = e.memoizedProps;
				if (In(a, r) && e.ref === t.ref && t.type === e.type) if (sb = !1, t.pendingProps = r = a, Is(e, i)) e.flags & 131072 && (sb = !0);
				else return t.lanes = e.lanes, Fs(e, t, i);
			}
			return xs(e, t, n, r, i);
		}
		function ms(e, t, n, r) {
			var i = r.children, a = e === null ? null : e.memoizedState;
			if (e === null && t.stateNode === null && (t.stateNode = {
				_visibility: kg,
				_pendingMarkers: null,
				_retryCache: null,
				_transitions: null
			}), r.mode === "hidden") {
				if (t.flags & 128) {
					if (a = a === null ? n : a.baseLanes | n, e !== null) {
						for (r = t.child = e.child, i = 0; r !== null;) i = i | r.lanes | r.childLanes, r = r.sibling;
						r = i & ~a;
					} else r = 0, t.child = null;
					return gs(e, t, a, n, r);
				}
				if (n & 536870912) t.memoizedState = {
					baseLanes: 0,
					cachePool: null
				}, e !== null && Ni(t, a === null ? null : a.cachePool), a === null ? da(t) : ua(t, a), ha(t);
				else return r = t.lanes = 536870912, gs(e, t, a === null ? n : a.baseLanes | n, n, r);
			} else a === null ? (e !== null && Ni(t, null), da(t), ga(t)) : (Ni(t, a.cachePool), ua(t, a), ga(t), t.memoizedState = null);
			return us(e, t, i, n), t.child;
		}
		function hs(e, t) {
			return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
				_visibility: kg,
				_pendingMarkers: null,
				_retryCache: null,
				_transitions: null
			}), t.sibling;
		}
		function gs(e, t, n, r, i) {
			var a = Mi();
			return a = a === null ? null : {
				parent: h_._currentValue,
				pool: a
			}, t.memoizedState = {
				baseLanes: n,
				cachePool: a
			}, e !== null && Ni(t, null), da(t), ha(t), e !== null && ti(e, t, r, !0), t.childLanes = i, null;
		}
		function _s(e, t) {
			var n = t.hidden;
			return n !== void 0 && console.error("<Activity> doesn't accept a hidden prop. Use mode=\"hidden\" instead.\n- <Activity %s>\n+ <Activity %s>", !0 === n ? "hidden" : !1 === n ? "hidden={false}" : "hidden={...}", n ? "mode=\"hidden\"" : "mode=\"visible\""), t = As({
				mode: t.mode,
				children: t.children
			}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
		}
		function vs(e, t, n) {
			return Zv(t, e.child, null, n), e = _s(t, t.pendingProps), e.flags |= 2, _a(t), t.memoizedState = null, e;
		}
		function ys(e, t, n) {
			var r = t.pendingProps, i = (t.flags & 128) != 0;
			if (t.flags &= -129, e === null) {
				if (K) {
					if (r.mode === "hidden") return e = _s(t, r), t.lanes = 536870912, hs(null, e);
					if (ma(t), (e = e_) ? (n = md(e, i_), n = n !== null && n.data === AS ? n : null, n !== null && (r = {
						dehydrated: n,
						treeContext: Ir(),
						retryLane: 536870912,
						hydrationErrors: null
					}, t.memoizedState = r, r = kr(n), r.return = t, t.child = r, $g = t, e_ = null)) : n = null, n === null) throw Vr(t, e), Hr(t);
					return t.lanes = 536870912, null;
				}
				return _s(t, r);
			}
			var a = e.memoizedState;
			if (a !== null) {
				var o = a.dehydrated;
				if (ma(t), i) if (t.flags & 256) t.flags &= -257, t = vs(e, t, n);
				else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
				else throw Error("Client rendering an Activity suspended it again. This is a bug in React.");
				else if (Br(), n & 536870912 && hl(t), sb || ti(e, t, n, !1), i = (n & e.childLanes) !== 0, sb || i) {
					if (r = Gb, r !== null && (o = Ve(r, n), o !== 0 && o !== a.retryLane)) throw a.retryLane = o, pr(e, o), nl(r, e, o), ob;
					gl(), t = vs(e, t, n);
				} else e = a.treeContext, e_ = vd(o.nextSibling), $g = t, K = !0, r_ = null, t_ = !1, n_ = null, i_ = !1, e !== null && Lr(t, e), t = _s(t, r), t.flags |= 4096;
				return t;
			}
			return a = e.child, r = {
				mode: r.mode,
				children: r.children
			}, n & 536870912 && (n & e.lanes) !== 0 && hl(t), e = Cr(a, r), e.ref = t.ref, t.child = e, e.return = t, e;
		}
		function bs(e, t) {
			var n = t.ref;
			if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
			else {
				if (typeof n != "function" && typeof n != "object") throw Error("Expected ref to be a function, an object returned by React.createRef(), or undefined/null.");
				(e === null || e.ref !== n) && (t.flags |= 4194816);
			}
		}
		function xs(e, t, n, r, i) {
			if (n.prototype && typeof n.prototype.render == "function") {
				var a = w(n) || "Unknown";
				cb[a] || (console.error("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", a, a), cb[a] = !0);
			}
			return t.mode & Rg && uv.recordLegacyContextWarning(t, null), e === null && (Ts(t, t.type), n.contextTypes && (a = w(n) || "Unknown", ub[a] || (ub[a] = !0, console.error("%s uses the legacy contextTypes API which was removed in React 19. Use React.createContext() with React.useContext() instead. (https://react.dev/link/legacy-context)", a)))), ri(t), n = Ca(e, t, n, r, void 0, i), r = Da(), e !== null && !sb ? (Oa(e, t, i), Fs(e, t, i)) : (K && r && Pr(t), t.flags |= 1, us(e, t, n, i), t.child);
		}
		function Ss(e, t, n, r, i, a) {
			return ri(t), Iy = -1, Ly = e !== null && e.type !== t.type, t.updateQueue = null, n = Ta(t, r, n, i), wa(e, t), r = Da(), e !== null && !sb ? (Oa(e, t, a), Fs(e, t, a)) : (K && r && Pr(t), t.flags |= 1, us(e, t, n, a), t.child);
		}
		function Cs(e, t, n, r, i) {
			switch (s(t)) {
				case !1:
					var a = t.stateNode, o = new t.type(t.memoizedProps, a.context).state;
					a.updater.enqueueSetState(a, o, null);
					break;
				case !0:
					t.flags |= 128, t.flags |= 65536, a = Error("Simulated error coming from DevTools");
					var c = i & -i;
					if (t.lanes |= c, o = Gb, o === null) throw Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
					c = ss(c), cs(c, o, t, jr(a, t)), ia(t, c);
			}
			if (ri(t), t.stateNode === null) {
				if (o = Pg, a = n.contextType, "contextType" in n && a !== null && (a === void 0 || a.$$typeof !== Lf) && !tb.has(n) && (tb.add(n), c = a === void 0 ? " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof a == "object" ? a.$$typeof === If ? " Did you accidentally pass the Context.Consumer instead?" : " However, it is set to an object with keys {" + Object.keys(a).join(", ") + "}." : " However, it is set to a " + typeof a + ".", console.error("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", w(n) || "Component", c)), typeof a == "object" && a && (o = ii(a)), a = new n(r, o), t.mode & Rg) {
					ke(!0);
					try {
						a = new n(r, o);
					} finally {
						ke(!1);
					}
				}
				if (o = t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = rb, t.stateNode = a, a._reactInternals = t, a._reactInternalInstance = Ky, typeof n.getDerivedStateFromProps == "function" && o === null && (o = w(n) || "Component", Jy.has(o) || (Jy.add(o), console.error("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", o, a.state === null ? "null" : "undefined", o))), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function") {
					var l = c = o = null;
					if (typeof a.componentWillMount == "function" && !0 !== a.componentWillMount.__suppressDeprecationWarning ? o = "componentWillMount" : typeof a.UNSAFE_componentWillMount == "function" && (o = "UNSAFE_componentWillMount"), typeof a.componentWillReceiveProps == "function" && !0 !== a.componentWillReceiveProps.__suppressDeprecationWarning ? c = "componentWillReceiveProps" : typeof a.UNSAFE_componentWillReceiveProps == "function" && (c = "UNSAFE_componentWillReceiveProps"), typeof a.componentWillUpdate == "function" && !0 !== a.componentWillUpdate.__suppressDeprecationWarning ? l = "componentWillUpdate" : typeof a.UNSAFE_componentWillUpdate == "function" && (l = "UNSAFE_componentWillUpdate"), o !== null || c !== null || l !== null) {
						a = w(n) || "Component";
						var u = typeof n.getDerivedStateFromProps == "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
						Xy.has(a) || (Xy.add(a), console.error("Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n%s uses %s but also contains the following legacy lifecycles:%s%s%s\n\nThe above lifecycles should be removed. Learn more about this warning here:\nhttps://react.dev/link/unsafe-component-lifecycles", a, u, o === null ? "" : "\n  " + o, c === null ? "" : "\n  " + c, l === null ? "" : "\n  " + l));
					}
				}
				a = t.stateNode, o = w(n) || "Component", a.render || (n.prototype && typeof n.prototype.render == "function" ? console.error("No `render` method found on the %s instance: did you accidentally return an object from the constructor?", o) : console.error("No `render` method found on the %s instance: you may have forgotten to define `render`.", o)), !a.getInitialState || a.getInitialState.isReactClassApproved || a.state || console.error("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", o), a.getDefaultProps && !a.getDefaultProps.isReactClassApproved && console.error("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", o), a.contextType && console.error("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", o), n.childContextTypes && !eb.has(n) && (eb.add(n), console.error("%s uses the legacy childContextTypes API which was removed in React 19. Use React.createContext() instead. (https://react.dev/link/legacy-context)", o)), n.contextTypes && !$y.has(n) && ($y.add(n), console.error("%s uses the legacy contextTypes API which was removed in React 19. Use React.createContext() with static contextType instead. (https://react.dev/link/legacy-context)", o)), typeof a.componentShouldUpdate == "function" && console.error("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", o), n.prototype && n.prototype.isPureReactComponent && a.shouldComponentUpdate !== void 0 && console.error("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", w(n) || "A pure component"), typeof a.componentDidUnmount == "function" && console.error("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", o), typeof a.componentDidReceiveProps == "function" && console.error("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", o), typeof a.componentWillRecieveProps == "function" && console.error("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", o), typeof a.UNSAFE_componentWillRecieveProps == "function" && console.error("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", o), c = a.props !== r, a.props !== void 0 && c && console.error("When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", o), a.defaultProps && console.error("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", o, o), typeof a.getSnapshotBeforeUpdate != "function" || typeof a.componentDidUpdate == "function" || Yy.has(n) || (Yy.add(n), console.error("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", w(n))), typeof a.getDerivedStateFromProps == "function" && console.error("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", o), typeof a.getDerivedStateFromError == "function" && console.error("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", o), typeof n.getSnapshotBeforeUpdate == "function" && console.error("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", o), (c = a.state) && (typeof c != "object" || qf(c)) && console.error("%s.state: must be set to an object or null", o), typeof a.getChildContext == "function" && typeof n.childContextTypes != "object" && console.error("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", o), a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, $i(t), o = n.contextType, a.context = typeof o == "object" && o ? ii(o) : Pg, a.state === r && (o = w(n) || "Component", Zy.has(o) || (Zy.add(o), console.error("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", o))), t.mode & Rg && uv.recordLegacyContextWarning(t, a), uv.recordUnsafeLifecycleWarnings(t, a), a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (Zo(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && (console.error("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", T(t) || "Component"), rb.enqueueReplaceState(a, a.state, null)), oa(t, r, a, i), aa(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), (t.mode & zg) !== W && (t.flags |= 134217728), a = !0;
			} else if (e === null) {
				a = t.stateNode;
				var d = t.memoizedProps;
				c = es(n, d), a.props = c;
				var f = a.context;
				l = n.contextType, o = Pg, typeof l == "object" && l && (o = ii(l)), u = n.getDerivedStateFromProps, l = typeof u == "function" || typeof a.getSnapshotBeforeUpdate == "function", d = t.pendingProps !== d, l || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (d || f !== o) && $o(t, a, r, o), ry = !1;
				var p = t.memoizedState;
				a.state = p, oa(t, r, a, i), aa(), f = t.memoizedState, d || p !== f || ry ? (typeof u == "function" && (Zo(t, n, u, r), f = t.memoizedState), (c = ry || Qo(t, n, c, r, p, f, o)) ? (l || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308), (t.mode & zg) !== W && (t.flags |= 134217728)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), (t.mode & zg) !== W && (t.flags |= 134217728), t.memoizedProps = r, t.memoizedState = f), a.props = r, a.state = f, a.context = o, a = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), (t.mode & zg) !== W && (t.flags |= 134217728), a = !1);
			} else {
				a = t.stateNode, ea(e, t), o = t.memoizedProps, l = es(n, o), a.props = l, u = t.pendingProps, p = a.context, f = n.contextType, c = Pg, typeof f == "object" && f && (c = ii(f)), d = n.getDerivedStateFromProps, (f = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== u || p !== c) && $o(t, a, r, c), ry = !1, p = t.memoizedState, a.state = p, oa(t, r, a, i), aa();
				var m = t.memoizedState;
				o !== u || p !== m || ry || e !== null && e.dependencies !== null && ni(e.dependencies) ? (typeof d == "function" && (Zo(t, n, d, r), m = t.memoizedState), (l = ry || Qo(t, n, l, r, p, m, c) || e !== null && e.dependencies !== null && ni(e.dependencies)) ? (f || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, m, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, m, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && p === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && p === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = m), a.props = r, a.state = m, a.context = c, a = l) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && p === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && p === e.memoizedState || (t.flags |= 1024), a = !1);
			}
			if (c = a, bs(e, t), o = (t.flags & 128) != 0, c || o) {
				if (c = t.stateNode, Se(t), o && typeof n.getDerivedStateFromError != "function") n = null, w_ = -1;
				else if (n = Cv(c), t.mode & Rg) {
					ke(!0);
					try {
						Cv(c);
					} finally {
						ke(!1);
					}
				}
				t.flags |= 1, e !== null && o ? (t.child = Zv(t, e.child, null, i), t.child = Zv(t, null, n, i)) : us(e, t, n, i), t.memoizedState = c.state, e = t.child;
			} else e = Fs(e, t, i);
			return i = t.stateNode, a && i.props !== r && (fb || console.error("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", T(t) || "a component"), fb = !0), e;
		}
		function ws(e, t, n, r) {
			return Kr(), t.flags |= 256, us(e, t, n, r), t.child;
		}
		function Ts(e, t) {
			t && t.childContextTypes && console.error("childContextTypes cannot be defined on a function component.\n  %s.childContextTypes = ...", t.displayName || t.name || "Component"), typeof t.getDerivedStateFromProps == "function" && (e = w(t) || "Unknown", db[e] || (console.error("%s: Function components do not support getDerivedStateFromProps.", e), db[e] = !0)), typeof t.contextType == "object" && t.contextType !== null && (t = w(t) || "Unknown", lb[t] || (console.error("%s: Function components do not support contextType.", t), lb[t] = !0));
		}
		function Es(e) {
			return {
				baseLanes: e,
				cachePool: Pi()
			};
		}
		function Ds(e, t, n) {
			return e = e === null ? 0 : e.childLanes & ~n, t && (e |= fx), e;
		}
		function Os(e, t, n) {
			var r, i = t.pendingProps;
			o(t) && (t.flags |= 128);
			var a = !1, s = (t.flags & 128) != 0;
			if ((r = s) || (r = e !== null && e.memoizedState === null ? !1 : (py.current & fy) !== 0), r && (a = !0, t.flags &= -129), r = (t.flags & 32) != 0, t.flags &= -33, e === null) {
				if (K) {
					if (a ? pa(t) : ga(t), (e = e_) ? (n = md(e, i_), n = n !== null && n.data !== AS ? n : null, n !== null && (r = {
						dehydrated: n,
						treeContext: Ir(),
						retryLane: 536870912,
						hydrationErrors: null
					}, t.memoizedState = r, r = kr(n), r.return = t, t.child = r, $g = t, e_ = null)) : n = null, n === null) throw Vr(t, e), Hr(t);
					return gd(n) ? t.lanes = 32 : t.lanes = 536870912, null;
				}
				var c = i.children;
				if (i = i.fallback, a) {
					ga(t);
					var l = t.mode;
					return c = As({
						mode: "hidden",
						children: c
					}, l), i = Dr(i, l, n, null), c.return = t, i.return = t, c.sibling = i, t.child = c, i = t.child, i.memoizedState = Es(n), i.childLanes = Ds(e, r, n), t.memoizedState = hb, hs(null, i);
				}
				return pa(t), ks(t, c);
			}
			var u = e.memoizedState;
			if (u !== null) {
				var d = u.dehydrated;
				if (d !== null) {
					if (s) t.flags & 256 ? (pa(t), t.flags &= -257, t = js(e, t, n)) : t.memoizedState === null ? (ga(t), c = i.fallback, l = t.mode, i = As({
						mode: "visible",
						children: i.children
					}, l), c = Dr(c, l, n, null), c.flags |= 2, i.return = t, c.return = t, i.sibling = c, t.child = i, Zv(t, e.child, null, n), i = t.child, i.memoizedState = Es(n), i.childLanes = Ds(e, r, n), t.memoizedState = hb, t = hs(null, i)) : (ga(t), t.child = e.child, t.flags |= 128, t = null);
					else if (pa(t), Br(), n & 536870912 && hl(t), gd(d)) {
						if (r = d.nextSibling && d.nextSibling.dataset, r) {
							c = r.dgst;
							var f = r.msg;
							l = r.stck;
							var p = r.cstck;
						}
						a = f, r = c, i = l, d = p, c = a, l = d, c = Error(c || "The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering."), c.stack = i || "", c.digest = r, r = l === void 0 ? null : l, i = {
							value: c,
							source: null,
							stack: r
						}, typeof r == "string" && Ug.set(c, i), Jr(i), t = js(e, t, n);
					} else if (sb || ti(e, t, n, !1), r = (n & e.childLanes) !== 0, sb || r) {
						if (r = Gb, r !== null && (i = Ve(r, n), i !== 0 && i !== u.retryLane)) throw u.retryLane = i, pr(e, i), nl(r, e, i), ob;
						hd(d) || gl(), t = js(e, t, n);
					} else hd(d) ? (t.flags |= 192, t.child = e.child, t = null) : (e = u.treeContext, e_ = vd(d.nextSibling), $g = t, K = !0, r_ = null, t_ = !1, n_ = null, i_ = !1, e !== null && Lr(t, e), t = ks(t, i.children), t.flags |= 4096);
					return t;
				}
			}
			return a ? (ga(t), c = i.fallback, l = t.mode, p = e.child, d = p.sibling, i = Cr(p, {
				mode: "hidden",
				children: i.children
			}), i.subtreeFlags = p.subtreeFlags & 65011712, d === null ? (c = Dr(c, l, n, null), c.flags |= 2) : c = Cr(d, c), c.return = t, i.return = t, i.sibling = c, t.child = i, hs(null, i), i = t.child, c = e.child.memoizedState, c === null ? c = Es(n) : (l = c.cachePool, l === null ? l = Pi() : (p = h_._currentValue, l = l.parent === p ? l : {
				parent: p,
				pool: p
			}), c = {
				baseLanes: c.baseLanes | n,
				cachePool: l
			}), i.memoizedState = c, i.childLanes = Ds(e, r, n), t.memoizedState = hb, hs(e.child, i)) : (u !== null && (n & 62914560) === n && (n & e.lanes) !== 0 && hl(t), pa(t), n = e.child, e = n.sibling, n = Cr(n, {
				mode: "visible",
				children: i.children
			}), n.return = t, n.sibling = null, e !== null && (r = t.deletions, r === null ? (t.deletions = [e], t.flags |= 16) : r.push(e)), t.child = n, t.memoizedState = null, n);
		}
		function ks(e, t) {
			return t = As({
				mode: "visible",
				children: t
			}, e.mode), t.return = e, e.child = t;
		}
		function As(e, t) {
			return e = h(22, e, null, t), e.lanes = 0, e;
		}
		function js(e, t, n) {
			return Zv(t, e.child, null, n), e = ks(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
		}
		function Ms(e, t, n) {
			e.lanes |= t;
			var r = e.alternate;
			r !== null && (r.lanes |= t), $r(e.return, t, n);
		}
		function Ns(e, t, n, r, i, a) {
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
		function Ps(e, t, n) {
			var r = t.pendingProps, i = r.revealOrder, a = r.tail, o = r.children, s = py.current;
			if ((r = (s & fy) !== 0) ? (s = s & dy | fy, t.flags |= 128) : s &= dy, E(py, s, t), s = i ?? "null", i !== "forwards" && i !== "unstable_legacy-backwards" && i !== "together" && i !== "independent" && !pb[s]) if (pb[s] = !0, i == null) console.error("The default for the <SuspenseList revealOrder=\"...\"> prop is changing. To be future compatible you must explictly specify either \"independent\" (the current default), \"together\", \"forwards\" or \"legacy_unstable-backwards\".");
			else if (i === "backwards") console.error("The rendering order of <SuspenseList revealOrder=\"backwards\"> is changing. To be future compatible you must specify revealOrder=\"legacy_unstable-backwards\" instead.");
			else if (typeof i == "string") switch (i.toLowerCase()) {
				case "together":
				case "forwards":
				case "backwards":
				case "independent":
					console.error("\"%s\" is not a valid value for revealOrder on <SuspenseList />. Use lowercase \"%s\" instead.", i, i.toLowerCase());
					break;
				case "forward":
				case "backward":
					console.error("\"%s\" is not a valid value for revealOrder on <SuspenseList />. React uses the -s suffix in the spelling. Use \"%ss\" instead.", i, i.toLowerCase());
					break;
				default: console.error("\"%s\" is not a supported revealOrder on <SuspenseList />. Did you mean \"independent\", \"together\", \"forwards\" or \"backwards\"?", i);
			}
			else console.error("%s is not a supported value for revealOrder on <SuspenseList />. Did you mean \"independent\", \"together\", \"forwards\" or \"backwards\"?", i);
			s = a ?? "null", mb[s] || (a == null ? (i === "forwards" || i === "backwards" || i === "unstable_legacy-backwards") && (mb[s] = !0, console.error("The default for the <SuspenseList tail=\"...\"> prop is changing. To be future compatible you must explictly specify either \"visible\" (the current default), \"collapsed\" or \"hidden\".")) : a !== "visible" && a !== "collapsed" && a !== "hidden" ? (mb[s] = !0, console.error("\"%s\" is not a supported value for tail on <SuspenseList />. Did you mean \"visible\", \"collapsed\" or \"hidden\"?", a)) : i !== "forwards" && i !== "backwards" && i !== "unstable_legacy-backwards" && (mb[s] = !0, console.error("<SuspenseList tail=\"%s\" /> is only valid if revealOrder is \"forwards\" or \"backwards\". Did you mean to specify revealOrder=\"forwards\"?", a)));
			a: if ((i === "forwards" || i === "backwards" || i === "unstable_legacy-backwards") && o != null && !1 !== o) if (qf(o)) {
				for (s = 0; s < o.length; s++) if (!Qi(o[s], s)) break a;
			} else if (s = re(o), typeof s == "function") {
				if (s = s.call(o)) for (var c = s.next(), l = 0; !c.done; c = s.next()) {
					if (!Qi(c.value, l)) break a;
					l++;
				}
			} else console.error("A single row was passed to a <SuspenseList revealOrder=\"%s\" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?", i);
			if (us(e, t, o, n), K ? (Rr(), o = qg) : o = 0, !r && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
				if (e.tag === 13) e.memoizedState !== null && Ms(e, n, t);
				else if (e.tag === 19) Ms(e, n, t);
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
					for (n = t.child, i = null; n !== null;) e = n.alternate, e !== null && va(e) === null && (i = n), n = n.sibling;
					n = i, n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), Ns(t, !1, i, n, a, o);
					break;
				case "backwards":
				case "unstable_legacy-backwards":
					for (n = null, i = t.child, t.child = null; i !== null;) {
						if (e = i.alternate, e !== null && va(e) === null) {
							t.child = i;
							break;
						}
						e = i.sibling, i.sibling = n, n = i, i = e;
					}
					Ns(t, !0, n, null, a, o);
					break;
				case "together":
					Ns(t, !1, null, null, void 0, o);
					break;
				default: t.memoizedState = null;
			}
			return t.child;
		}
		function Fs(e, t, n) {
			if (e !== null && (t.dependencies = e.dependencies), w_ = -1, lx |= t.lanes, (n & t.childLanes) === 0) if (e !== null) {
				if (ti(e, t, n, !1), (n & t.childLanes) === 0) return null;
			} else return null;
			if (e !== null && t.child !== e.child) throw Error("Resuming work not yet implemented.");
			if (t.child !== null) {
				for (e = t.child, n = Cr(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = Cr(e, e.pendingProps), n.return = t;
				n.sibling = null;
			}
			return t.child;
		}
		function Is(e, t) {
			return (e.lanes & t) === 0 ? (e = e.dependencies, !!(e !== null && ni(e))) : !0;
		}
		function Ls(e, t, n) {
			switch (t.tag) {
				case 3:
					ce(t, t.stateNode.containerInfo), Zr(t, h_, e.memoizedState.cache), Kr();
					break;
				case 27:
				case 5:
					le(t);
					break;
				case 4:
					ce(t, t.stateNode.containerInfo);
					break;
				case 10:
					Zr(t, t.type, t.memoizedProps.value);
					break;
				case 12:
					(n & t.childLanes) !== 0 && (t.flags |= 4), t.flags |= 2048;
					var r = t.stateNode;
					r.effectDuration = -0, r.passiveEffectDuration = -0;
					break;
				case 31:
					if (t.memoizedState !== null) return t.flags |= 128, ma(t), null;
					break;
				case 13:
					if (r = t.memoizedState, r !== null) return r.dehydrated === null ? (n & t.child.childLanes) === 0 ? (pa(t), e = Fs(e, t, n), e === null ? null : e.sibling) : Os(e, t, n) : (pa(t), t.flags |= 128, null);
					pa(t);
					break;
				case 19:
					var i = (e.flags & 128) != 0;
					if (r = (n & t.childLanes) !== 0, r ||= (ti(e, t, n, !1), (n & t.childLanes) !== 0), i) {
						if (r) return Ps(e, t, n);
						t.flags |= 128;
					}
					if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), E(py, py.current, t), r) break;
					return null;
				case 22: return t.lanes = 0, ms(e, t, n, t.pendingProps);
				case 24: Zr(t, h_, e.memoizedState.cache);
			}
			return Fs(e, t, n);
		}
		function Rs(e, t, n) {
			if (t._debugNeedsRemount && e !== null) {
				n = Tr(t.type, t.key, t.pendingProps, t._debugOwner || null, t.mode, t.lanes), n._debugStack = t._debugStack, n._debugTask = t._debugTask;
				var r = t.return;
				if (r === null) throw Error("Cannot swap the root fiber.");
				if (e.alternate = null, t.alternate = null, n.index = t.index, n.sibling = t.sibling, n.return = t.return, n.ref = t.ref, n._debugInfo = t._debugInfo, t === r.child) r.child = n;
				else {
					var i = r.child;
					if (i === null) throw Error("Expected parent to have a child.");
					for (; i.sibling !== t;) if (i = i.sibling, i === null) throw Error("Expected to find the previous sibling.");
					i.sibling = n;
				}
				return t = r.deletions, t === null ? (r.deletions = [e], r.flags |= 16) : t.push(e), n.flags |= 2, n;
			}
			if (e !== null) if (e.memoizedProps !== t.pendingProps || t.type !== e.type) sb = !0;
			else {
				if (!Is(e, n) && !(t.flags & 128)) return sb = !1, Ls(e, t, n);
				sb = !!(e.flags & 131072);
			}
			else sb = !1, (r = K) && (Rr(), r = (t.flags & 1048576) != 0), r && (r = t.index, Rr(), Nr(t, qg, r));
			switch (t.lanes = 0, t.tag) {
				case 16:
					a: if (r = t.pendingProps, e = Ri(t.elementType), t.type = e, typeof e == "function") Sr(e) ? (r = es(e, r), t.tag = 1, t.type = e = gr(e), t = Cs(null, t, e, r, n)) : (t.tag = 0, Ts(t, e), t.type = e = gr(e), t = xs(null, t, e, r, n));
					else {
						if (e != null) {
							if (i = e.$$typeof, i === Rf) {
								t.tag = 11, t.type = e = _r(e), t = ds(null, t, e, r, n);
								break a;
							} else if (i === Vf) {
								t.tag = 14, t = fs(null, t, e, r, n);
								break a;
							}
						}
						throw t = "", typeof e == "object" && e && e.$$typeof === Hf && (t = " Did you wrap a component in React.lazy() more than once?"), n = w(e) || e, Error("Element type is invalid. Received a promise that resolves to: " + n + ". Lazy element type must resolve to a class or function." + t);
					}
					return t;
				case 0: return xs(e, t, t.type, t.pendingProps, n);
				case 1: return r = t.type, i = es(r, t.pendingProps), Cs(e, t, r, i, n);
				case 3:
					a: {
						if (ce(t, t.stateNode.containerInfo), e === null) throw Error("Should have a current fiber. This is a bug in React.");
						r = t.pendingProps;
						var a = t.memoizedState;
						i = a.element, ea(e, t), oa(t, r, null, n);
						var o = t.memoizedState;
						if (r = o.cache, Zr(t, h_, r), r !== a.cache && ei(t, [h_], n, !0), aa(), r = o.element, a.isDehydrated) if (a = {
							element: r,
							isDehydrated: !1,
							cache: o.cache
						}, t.updateQueue.baseState = a, t.memoizedState = a, t.flags & 256) {
							t = ws(e, t, r, n);
							break a;
						} else if (r !== i) {
							i = jr(Error("This root received an early update, before anything was able hydrate. Switched the entire root to client rendering."), t), Jr(i), t = ws(e, t, r, n);
							break a;
						} else {
							switch (e = t.stateNode.containerInfo, e.nodeType) {
								case 9:
									e = e.body;
									break;
								default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
							}
							for (e_ = vd(e.firstChild), $g = t, K = !0, r_ = null, t_ = !1, n_ = null, i_ = !0, n = Qv(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 4096, n = n.sibling;
						}
						else {
							if (Kr(), r === i) {
								t = Fs(e, t, n);
								break a;
							}
							us(e, t, r, n);
						}
						t = t.child;
					}
					return t;
				case 26: return bs(e, t), e === null ? (n = jd(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : K || (n = t.type, e = t.pendingProps, r = se(tp.current), r = Bu(r).createElement(n), r[Kp] = t, r[qp] = e, Eu(r, n, e), $e(r), t.stateNode = r) : t.memoizedState = jd(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
				case 27: return le(t), e === null && K && (r = se(tp.current), i = O(), r = t.stateNode = Ed(t.type, t.pendingProps, r, i, !1), t_ || (i = Iu(r, t.type, t.pendingProps, i), i !== null && (zr(t, 0).serverProps = i)), $g = t, i_ = !0, i = e_, ed(t.type) ? (rC = i, e_ = vd(r.firstChild)) : e_ = i), us(e, t, t.pendingProps.children, n), bs(e, t), e === null && (t.flags |= 4194304), t.child;
				case 5: return e === null && K && (a = O(), r = qt(t.type, a.ancestorInfo), i = e_, (o = !i) || (o = fd(i, t.type, t.pendingProps, i_), o === null ? a = !1 : (t.stateNode = o, t_ || (a = Iu(o, t.type, t.pendingProps, a), a !== null && (zr(t, 0).serverProps = a)), $g = t, e_ = vd(o.firstChild), i_ = !1, a = !0), o = !a), o && (r && Vr(t, i), Hr(t))), le(t), i = t.type, a = t.pendingProps, o = e === null ? null : e.memoizedProps, r = a.children, Uu(i, a) ? r = null : o !== null && Uu(i, o) && (t.flags |= 32), t.memoizedState !== null && (i = Ca(e, t, Ea, null, null, n), xC._currentValue = i), bs(e, t), us(e, t, r, n), t.child;
				case 6: return e === null && K && (n = t.pendingProps, e = O(), r = e.ancestorInfo.current, n = r == null ? !0 : Jt(n, r.tag, e.ancestorInfo.implicitRootScope), e = e_, (r = !e) || (r = pd(e, t.pendingProps, i_), r === null ? r = !1 : (t.stateNode = r, $g = t, e_ = null, r = !0), r = !r), r && (n && Vr(t, e), Hr(t))), null;
				case 13: return Os(e, t, n);
				case 4: return ce(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Zv(t, null, r, n) : us(e, t, r, n), t.child;
				case 11: return ds(e, t, t.type, t.pendingProps, n);
				case 7: return us(e, t, t.pendingProps, n), t.child;
				case 8: return us(e, t, t.pendingProps.children, n), t.child;
				case 12: return t.flags |= 4, t.flags |= 2048, r = t.stateNode, r.effectDuration = -0, r.passiveEffectDuration = -0, us(e, t, t.pendingProps.children, n), t.child;
				case 10: return r = t.type, i = t.pendingProps, a = i.value, "value" in i || gb || (gb = !0, console.error("The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?")), Zr(t, r, a), us(e, t, i.children, n), t.child;
				case 9: return i = t.type._context, r = t.pendingProps.children, typeof r != "function" && console.error("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."), ri(t), i = ii(i), r = xv(r, i, void 0), t.flags |= 1, us(e, t, r, n), t.child;
				case 14: return fs(e, t, t.type, t.pendingProps, n);
				case 15: return ps(e, t, t.type, t.pendingProps, n);
				case 19: return Ps(e, t, n);
				case 31: return ys(e, t, n);
				case 22: return ms(e, t, n, t.pendingProps);
				case 24: return ri(t), r = ii(h_), e === null ? (i = Mi(), i === null && (i = Gb, a = si(), i.pooledCache = a, ci(a), a !== null && (i.pooledCacheLanes |= n), i = a), t.memoizedState = {
					parent: r,
					cache: i
				}, $i(t), Zr(t, h_, i)) : ((e.lanes & n) !== 0 && (ea(e, t), oa(t, null, null, n), aa()), i = e.memoizedState, a = t.memoizedState, i.parent === r ? (r = a.cache, Zr(t, h_, r), r !== i.cache && ei(t, [h_], n, !0)) : (i = {
					parent: r,
					cache: r
				}, t.memoizedState = i, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = i), Zr(t, h_, r))), us(e, t, t.pendingProps.children, n), t.child;
				case 29: throw t.pendingProps;
			}
			throw Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
		}
		function zs(e) {
			e.flags |= 4;
		}
		function Bs(e, t, n, r, i) {
			if ((t = (e.mode & Bg) !== W) && (t = !1), t) {
				if (e.flags |= 16777216, (i & 335544128) === i) if (e.stateNode.complete) e.flags |= 8192;
				else if (fl()) e.flags |= 8192;
				else throw Hv = Vv, zv;
			} else e.flags &= -16777217;
		}
		function Vs(e, t) {
			if (t.type !== "stylesheet" || (t.state.loading & cC) !== iC) e.flags &= -16777217;
			else if (e.flags |= 16777216, !Gd(t)) if (fl()) e.flags |= 8192;
			else throw Hv = Vv, zv;
		}
		function Hs(e, t) {
			t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : Fe(), e.lanes |= t, px |= t);
		}
		function Us(e, t) {
			if (!K) switch (e.tailMode) {
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
		function Ws(e) {
			var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
			if (t) if ((e.mode & G) !== W) {
				for (var i = e.selfBaseDuration, a = e.child; a !== null;) n |= a.lanes | a.childLanes, r |= a.subtreeFlags & 65011712, r |= a.flags & 65011712, i += a.treeBaseDuration, a = a.sibling;
				e.treeBaseDuration = i;
			} else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 65011712, r |= i.flags & 65011712, i.return = e, i = i.sibling;
			else if ((e.mode & G) !== W) {
				i = e.actualDuration, a = e.selfBaseDuration;
				for (var o = e.child; o !== null;) n |= o.lanes | o.childLanes, r |= o.subtreeFlags, r |= o.flags, i += o.actualDuration, a += o.treeBaseDuration, o = o.sibling;
				e.actualDuration = i, e.treeBaseDuration = a;
			} else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
			return e.subtreeFlags |= r, e.childLanes = n, t;
		}
		function Gs(e, t, n) {
			var r = t.pendingProps;
			switch (Fr(t), t.tag) {
				case 16:
				case 15:
				case 0:
				case 11:
				case 7:
				case 8:
				case 12:
				case 9:
				case 14: return Ws(t), null;
				case 1: return Ws(t), null;
				case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), Qr(h_, t), D(t), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (Gr(t) ? (Yr(), zs(t)) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, qr())), Ws(t), null;
				case 26:
					var i = t.type, a = t.memoizedState;
					return e === null ? (zs(t), a === null ? (Ws(t), Bs(t, i, null, r, n)) : (Ws(t), Vs(t, a))) : a ? a === e.memoizedState ? (Ws(t), t.flags &= -16777217) : (zs(t), Ws(t), Vs(t, a)) : (e = e.memoizedProps, e !== r && zs(t), Ws(t), Bs(t, i, e, r, n)), null;
				case 27:
					if (ue(t), n = se(tp.current), i = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && zs(t);
					else {
						if (!r) {
							if (t.stateNode === null) throw Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
							return Ws(t), null;
						}
						e = O(), Gr(t) ? Ur(t, e) : (e = Ed(i, r, n, e, !0), t.stateNode = e, zs(t));
					}
					return Ws(t), null;
				case 5:
					if (ue(t), i = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && zs(t);
					else {
						if (!r) {
							if (t.stateNode === null) throw Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
							return Ws(t), null;
						}
						var o = O();
						if (Gr(t)) Ur(t, o);
						else {
							switch (a = se(tp.current), qt(i, o.ancestorInfo), o = o.context, a = Bu(a), o) {
								case GS:
									a = a.createElementNS(Im, i);
									break;
								case KS:
									a = a.createElementNS(Fm, i);
									break;
								default: switch (i) {
									case "svg":
										a = a.createElementNS(Im, i);
										break;
									case "math":
										a = a.createElementNS(Fm, i);
										break;
									case "script":
										a = a.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild);
										break;
									case "select":
										a = typeof r.is == "string" ? a.createElement("select", { is: r.is }) : a.createElement("select"), r.multiple ? a.multiple = !0 : r.size && (a.size = r.size);
										break;
									default: a = typeof r.is == "string" ? a.createElement(i, { is: r.is }) : a.createElement(i), i.indexOf("-") === -1 && (i !== i.toLowerCase() && console.error("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", i), Object.prototype.toString.call(a) !== "[object HTMLUnknownElement]" || _p.call(YS, i) || (YS[i] = !0, console.error("The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.", i)));
								}
							}
							a[Kp] = t, a[qp] = r;
							a: for (o = t.child; o !== null;) {
								if (o.tag === 5 || o.tag === 6) a.appendChild(o.stateNode);
								else if (o.tag !== 4 && o.tag !== 27 && o.child !== null) {
									o.child.return = o, o = o.child;
									continue;
								}
								if (o === t) break a;
								for (; o.sibling === null;) {
									if (o.return === null || o.return === t) break a;
									o = o.return;
								}
								o.sibling.return = o.return, o = o.sibling;
							}
							t.stateNode = a;
							a: switch (Eu(a, i, r), i) {
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
							r && zs(t);
						}
					}
					return Ws(t), Bs(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
				case 6:
					if (e && t.stateNode != null) e.memoizedProps !== r && zs(t);
					else {
						if (typeof r != "string" && t.stateNode === null) throw Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
						if (e = se(tp.current), n = O(), Gr(t)) {
							if (e = t.stateNode, n = t.memoizedProps, i = !t_, r = null, a = $g, a !== null) switch (a.tag) {
								case 3:
									i && (i = bd(e, n, r), i !== null && (zr(t, 0).serverProps = i));
									break;
								case 27:
								case 5: r = a.memoizedProps, i && (i = bd(e, n, r), i !== null && (zr(t, 0).serverProps = i));
							}
							e[Kp] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || Cu(e.nodeValue, n)), e || Hr(t, !0);
						} else i = n.ancestorInfo.current, i != null && Jt(r, i.tag, n.ancestorInfo.implicitRootScope), e = Bu(e).createTextNode(r), e[Kp] = t, t.stateNode = e;
					}
					return Ws(t), null;
				case 31:
					if (n = t.memoizedState, e === null || e.memoizedState !== null) {
						if (r = Gr(t), n !== null) {
							if (e === null) {
								if (!r) throw Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
								if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error("Expected to have a hydrated activity instance. This error is likely caused by a bug in React. Please file an issue.");
								e[Kp] = t, Ws(t), (t.mode & G) !== W && n !== null && (e = t.child, e !== null && (t.treeBaseDuration -= e.treeBaseDuration));
							} else Yr(), Kr(), !(t.flags & 128) && (n = t.memoizedState = null), t.flags |= 4, Ws(t), (t.mode & G) !== W && n !== null && (e = t.child, e !== null && (t.treeBaseDuration -= e.treeBaseDuration));
							e = !1;
						} else n = qr(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
						if (!e) return t.flags & 256 ? (_a(t), t) : (_a(t), null);
						if (t.flags & 128) throw Error("Client rendering an Activity suspended it again. This is a bug in React.");
					}
					return Ws(t), null;
				case 13:
					if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
						if (i = r, a = Gr(t), i !== null && i.dehydrated !== null) {
							if (e === null) {
								if (!a) throw Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
								if (a = t.memoizedState, a = a === null ? null : a.dehydrated, !a) throw Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
								a[Kp] = t, Ws(t), (t.mode & G) !== W && i !== null && (i = t.child, i !== null && (t.treeBaseDuration -= i.treeBaseDuration));
							} else Yr(), Kr(), !(t.flags & 128) && (i = t.memoizedState = null), t.flags |= 4, Ws(t), (t.mode & G) !== W && i !== null && (i = t.child, i !== null && (t.treeBaseDuration -= i.treeBaseDuration));
							i = !1;
						} else i = qr(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = i), i = !0;
						if (!i) return t.flags & 256 ? (_a(t), t) : (_a(t), null);
					}
					return _a(t), t.flags & 128 ? (t.lanes = n, (t.mode & G) !== W && Oi(t), t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, i = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (i = r.alternate.memoizedState.cachePool.pool), a = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (a = r.memoizedState.cachePool.pool), a !== i && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), Hs(t, t.updateQueue), Ws(t), (t.mode & G) !== W && n && (e = t.child, e !== null && (t.treeBaseDuration -= e.treeBaseDuration)), null);
				case 4: return D(t), e === null && uu(t.stateNode.containerInfo), Ws(t), null;
				case 10: return Qr(t.type, t), Ws(t), null;
				case 19:
					if (oe(py, t), r = t.memoizedState, r === null) return Ws(t), null;
					if (i = (t.flags & 128) != 0, a = r.rendering, a === null) if (i) Us(r, !1);
					else {
						if (cx !== Lb || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
							if (a = va(e), a !== null) {
								for (t.flags |= 128, Us(r, !1), e = a.updateQueue, t.updateQueue = e, Hs(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) wr(n, e), n = n.sibling;
								return E(py, py.current & dy | fy, t), K && Mr(t, r.treeForkCount), t.child;
							}
							e = e.sibling;
						}
						r.tail !== null && Sp() > bx && (t.flags |= 128, i = !0, Us(r, !1), t.lanes = 4194304);
					}
					else {
						if (!i) if (e = va(a), e !== null) {
							if (t.flags |= 128, i = !0, e = e.updateQueue, t.updateQueue = e, Hs(t, e), Us(r, !0), r.tail === null && r.tailMode === "hidden" && !a.alternate && !K) return Ws(t), null;
						} else 2 * Sp() - r.renderingStartTime > bx && n !== 536870912 && (t.flags |= 128, i = !0, Us(r, !1), t.lanes = 4194304);
						r.isBackwards ? (a.sibling = t.child, t.child = a) : (e = r.last, e === null ? t.child = a : e.sibling = a, r.last = a);
					}
					return r.tail === null ? (Ws(t), null) : (e = r.tail, r.rendering = e, r.tail = e.sibling, r.renderingStartTime = Sp(), e.sibling = null, n = py.current, n = i ? n & dy | fy : n & dy, E(py, n, t), K && Mr(t, r.treeForkCount), e);
				case 22:
				case 23: return _a(t), fa(t), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (Ws(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Ws(t), n = t.updateQueue, n !== null && Hs(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && oe(lv, t), null;
				case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), Qr(h_, t), Ws(t), null;
				case 25: return null;
				case 30: return null;
			}
			throw Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
		}
		function Ks(e, t) {
			switch (Fr(t), t.tag) {
				case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, (t.mode & G) !== W && Oi(t), t) : null;
				case 3: return Qr(h_, t), D(t), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
				case 26:
				case 27:
				case 5: return ue(t), null;
				case 31:
					if (t.memoizedState !== null) {
						if (_a(t), t.alternate === null) throw Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
						Kr();
					}
					return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, (t.mode & G) !== W && Oi(t), t) : null;
				case 13:
					if (_a(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
						if (t.alternate === null) throw Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
						Kr();
					}
					return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, (t.mode & G) !== W && Oi(t), t) : null;
				case 19: return oe(py, t), null;
				case 4: return D(t), null;
				case 10: return Qr(t.type, t), null;
				case 22:
				case 23: return _a(t), fa(t), e !== null && oe(lv, t), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, (t.mode & G) !== W && Oi(t), t) : null;
				case 24: return Qr(h_, t), null;
				case 25: return null;
				default: return null;
			}
		}
		function qs(e, t) {
			switch (Fr(t), t.tag) {
				case 3:
					Qr(h_, t), D(t);
					break;
				case 26:
				case 27:
				case 5:
					ue(t);
					break;
				case 4:
					D(t);
					break;
				case 31:
					t.memoizedState !== null && _a(t);
					break;
				case 13:
					_a(t);
					break;
				case 19:
					oe(py, t);
					break;
				case 10:
					Qr(t.type, t);
					break;
				case 22:
				case 23:
					_a(t), fa(t), e !== null && oe(lv, t);
					break;
				case 24: Qr(h_, t);
			}
		}
		function Js(e) {
			return (e.mode & G) !== W;
		}
		function Ys(e, t) {
			Js(e) ? (Di(), Zs(t, e), Ti()) : Zs(t, e);
		}
		function Xs(e, t, n) {
			Js(e) ? (Di(), Qs(n, e, t), Ti()) : Qs(n, e, t);
		}
		function Zs(e, t) {
			try {
				var n = t.updateQueue, r = n === null ? null : n.lastEffect;
				if (r !== null) {
					var i = r.next;
					n = i;
					do {
						if ((n.tag & e) === e && (r = void 0, (e & gy) !== my && (eS = !0), r = k(t, Nv, n), (e & gy) !== my && (eS = !1), r !== void 0 && typeof r != "function")) {
							var a = void 0;
							a = (n.tag & _y) === 0 ? (n.tag & gy) === 0 ? "useEffect" : "useInsertionEffect" : "useLayoutEffect";
							var o = void 0;
							o = r === null ? " You returned null. If your effect does not require clean up, return undefined (or nothing)." : typeof r.then == "function" ? "\n\nIt looks like you wrote " + a + "(async () => ...) or returned a Promise. Instead, write the async function inside your effect and call it immediately:\n\n" + a + "(() => {\n  async function fetchData() {\n    // You can await here\n    const response = await MyAPI.getData(someId);\n    // ...\n  }\n  fetchData();\n}, [someId]); // Or [] if effect doesn't need props or state\n\nLearn more about data fetching with Hooks: https://react.dev/link/hooks-data-fetching" : " You returned: " + r, k(t, function(e, t) {
								console.error("%s must not return anything besides a function, which is used for clean-up.%s", e, t);
							}, a, o);
						}
						n = n.next;
					} while (n !== i);
				}
			} catch (e) {
				Il(t, t.return, e);
			}
		}
		function Qs(e, t, n) {
			try {
				var r = t.updateQueue, i = r === null ? null : r.lastEffect;
				if (i !== null) {
					var a = i.next;
					r = a;
					do {
						if ((r.tag & e) === e) {
							var o = r.inst, s = o.destroy;
							s !== void 0 && (o.destroy = void 0, (e & gy) !== my && (eS = !0), i = t, k(i, Fv, i, n, s), (e & gy) !== my && (eS = !1));
						}
						r = r.next;
					} while (r !== a);
				}
			} catch (e) {
				Il(t, t.return, e);
			}
		}
		function $s(e, t) {
			Js(e) ? (Di(), Zs(t, e), Ti()) : Zs(t, e);
		}
		function ec(e, t, n) {
			Js(e) ? (Di(), Qs(n, e, t), Ti()) : Qs(n, e, t);
		}
		function tc(e) {
			var t = e.updateQueue;
			if (t !== null) {
				var n = e.stateNode;
				e.type.defaultProps || "ref" in e.memoizedProps || fb || (n.props !== e.memoizedProps && console.error("Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", T(e) || "instance"), n.state !== e.memoizedState && console.error("Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", T(e) || "instance"));
				try {
					k(e, la, t, n);
				} catch (t) {
					Il(e, e.return, t);
				}
			}
		}
		function nc(e, t, n) {
			return e.getSnapshotBeforeUpdate(t, n);
		}
		function rc(e, t) {
			var n = t.memoizedProps, r = t.memoizedState;
			t = e.stateNode, e.type.defaultProps || "ref" in e.memoizedProps || fb || (t.props !== e.memoizedProps && console.error("Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", T(e) || "instance"), t.state !== e.memoizedState && console.error("Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", T(e) || "instance"));
			try {
				var i = es(e.type, n), a = k(e, nc, t, i, r);
				n = _b, a !== void 0 || n.has(e.type) || (n.add(e.type), k(e, function() {
					console.error("%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", T(e));
				})), t.__reactInternalSnapshotBeforeUpdate = a;
			} catch (t) {
				Il(e, e.return, t);
			}
		}
		function ic(e, t, n) {
			n.props = es(e.type, e.memoizedProps), n.state = e.memoizedState, Js(e) ? (Di(), k(e, jv, e, t, n), Ti()) : k(e, jv, e, t, n);
		}
		function ac(e) {
			var t = e.ref;
			if (t !== null) {
				switch (e.tag) {
					case 26:
					case 27:
					case 5:
						var n = e.stateNode;
						break;
					case 30:
						n = e.stateNode;
						break;
					default: n = e.stateNode;
				}
				if (typeof t == "function") if (Js(e)) try {
					Di(), e.refCleanup = t(n);
				} finally {
					Ti();
				}
				else e.refCleanup = t(n);
				else typeof t == "string" ? console.error("String refs are no longer supported.") : t.hasOwnProperty("current") || console.error("Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().", T(e)), t.current = n;
			}
		}
		function oc(e, t) {
			try {
				k(e, ac, e);
			} catch (n) {
				Il(e, t, n);
			}
		}
		function sc(e, t) {
			var n = e.ref, r = e.refCleanup;
			if (n !== null) if (typeof r == "function") try {
				if (Js(e)) try {
					Di(), k(e, r);
				} finally {
					Ti(e);
				}
				else k(e, r);
			} catch (n) {
				Il(e, t, n);
			} finally {
				e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
			}
			else if (typeof n == "function") try {
				if (Js(e)) try {
					Di(), k(e, n, null);
				} finally {
					Ti(e);
				}
				else k(e, n, null);
			} catch (n) {
				Il(e, t, n);
			}
			else n.current = null;
		}
		function cc(e, t, n, r) {
			var i = e.memoizedProps, a = i.id, o = i.onCommit;
			i = i.onRender, t = t === null ? "mount" : "update", nv && (t = "nested-update"), typeof i == "function" && i(a, t, e.actualDuration, e.treeBaseDuration, e.actualStartTime, n), typeof o == "function" && o(a, t, r, n);
		}
		function lc(e, t, n, r) {
			var i = e.memoizedProps;
			e = i.id, i = i.onPostCommit, t = t === null ? "mount" : "update", nv && (t = "nested-update"), typeof i == "function" && i(e, t, r, n);
		}
		function uc(e) {
			var t = e.type, n = e.memoizedProps, r = e.stateNode;
			try {
				k(e, Ju, r, t, n, e);
			} catch (t) {
				Il(e, e.return, t);
			}
		}
		function dc(e, t, n) {
			try {
				k(e, Xu, e.stateNode, e.type, n, t, e);
			} catch (t) {
				Il(e, e.return, t);
			}
		}
		function fc(e) {
			return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && ed(e.type) || e.tag === 4;
		}
		function pc(e) {
			a: for (;;) {
				for (; e.sibling === null;) {
					if (e.return === null || fc(e.return)) return null;
					e = e.return;
				}
				for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
					if (e.tag === 27 && ed(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
					e.child.return = e, e = e.child;
				}
				if (!(e.flags & 2)) return e.stateNode;
			}
		}
		function mc(e, t, n) {
			var r = e.tag;
			if (r === 5 || r === 6) e = e.stateNode, t ? ($u(n), (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(e, t)) : ($u(n), t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(e), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = sn));
			else if (r !== 4 && (r === 27 && ed(e.type) && (n = e.stateNode, t = null), e = e.child, e !== null)) for (mc(e, t, n), e = e.sibling; e !== null;) mc(e, t, n), e = e.sibling;
		}
		function hc(e, t, n) {
			var r = e.tag;
			if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
			else if (r !== 4 && (r === 27 && ed(e.type) && (n = e.stateNode), e = e.child, e !== null)) for (hc(e, t, n), e = e.sibling; e !== null;) hc(e, t, n), e = e.sibling;
		}
		function gc(e) {
			for (var t, n = e.return; n !== null;) {
				if (fc(n)) {
					t = n;
					break;
				}
				n = n.return;
			}
			if (t == null) throw Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
			switch (t.tag) {
				case 27:
					t = t.stateNode, n = pc(e), hc(e, n, t);
					break;
				case 5:
					n = t.stateNode, t.flags & 32 && (Zu(n), t.flags &= -33), t = pc(e), hc(e, t, n);
					break;
				case 3:
				case 4:
					t = t.stateNode.containerInfo, n = pc(e), mc(e, n, t);
					break;
				default: throw Error("Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.");
			}
		}
		function _c(e) {
			var t = e.stateNode, n = e.memoizedProps;
			try {
				k(e, Dd, e.type, n, t, e);
			} catch (t) {
				Il(e, e.return, t);
			}
		}
		function vc(e, t) {
			return t.tag === 31 ? (t = t.memoizedState, e.memoizedState !== null && t === null) : t.tag === 13 ? (e = e.memoizedState, t = t.memoizedState, e !== null && e.dehydrated !== null && (t === null || t.dehydrated === null)) : t.tag === 3 ? e.memoizedState.isDehydrated && (t.flags & 256) == 0 : !1;
		}
		function yc(e, t) {
			if (e = e.containerInfo, qS = RC, e = Bn(e), Vn(e)) {
				if ("selectionStart" in e) var n = {
					start: e.selectionStart,
					end: e.selectionEnd
				};
				else a: {
					n = (n = e.ownerDocument) && n.defaultView || window;
					var r = n.getSelection && n.getSelection();
					if (r && r.rangeCount !== 0) {
						n = r.anchorNode;
						var i = r.anchorOffset, a = r.focusNode;
						r = r.focusOffset;
						try {
							n.nodeType, a.nodeType;
						} catch {
							n = null;
							break a;
						}
						var o = 0, s = -1, c = -1, l = 0, u = 0, d = e, f = null;
						b: for (;;) {
							for (var p; d !== n || i !== 0 && d.nodeType !== 3 || (s = o + i), d !== a || r !== 0 && d.nodeType !== 3 || (c = o + r), d.nodeType === 3 && (o += d.nodeValue.length), (p = d.firstChild) !== null;) f = d, d = p;
							for (;;) {
								if (d === e) break b;
								if (f === n && ++l === i && (s = o), f === a && ++u === r && (c = o), (p = d.nextSibling) !== null) break;
								d = f, f = d.parentNode;
							}
							d = p;
						}
						n = s === -1 || c === -1 ? null : {
							start: s,
							end: c
						};
					} else n = null;
				}
				n ||= {
					start: 0,
					end: 0
				};
			} else n = null;
			for (JS = {
				focusedElem: e,
				selectionRange: n
			}, RC = !1, Sb = t; Sb !== null;) if (t = Sb, e = t.child, t.subtreeFlags & 1028 && e !== null) e.return = t, Sb = e;
			else for (; Sb !== null;) {
				switch (e = t = Sb, n = e.alternate, i = e.flags, e.tag) {
					case 0:
						if (i & 4 && (e = e.updateQueue, e = e === null ? null : e.events, e !== null)) for (n = 0; n < e.length; n++) i = e[n], i.ref.impl = i.nextImpl;
						break;
					case 11:
					case 15: break;
					case 1:
						i & 1024 && n !== null && rc(e, n);
						break;
					case 3:
						if (i & 1024) {
							if (e = e.stateNode.containerInfo, n = e.nodeType, n === 9) dd(e);
							else if (n === 1) switch (e.nodeName) {
								case "HEAD":
								case "HTML":
								case "BODY":
									dd(e);
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
					default: if (i & 1024) throw Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
				}
				if (e = t.sibling, e !== null) {
					e.return = t.return, Sb = e;
					break;
				}
				Sb = t.return;
			}
		}
		function bc(e, t, n) {
			var r = gi(), i = vi(), a = bi(), o = xi(), s = n.flags;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					Mc(e, n), s & 4 && Ys(n, _y | hy);
					break;
				case 1:
					if (Mc(e, n), s & 4) if (e = n.stateNode, t === null) n.type.defaultProps || "ref" in n.memoizedProps || fb || (e.props !== n.memoizedProps && console.error("Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", T(n) || "instance"), e.state !== n.memoizedState && console.error("Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", T(n) || "instance")), Js(n) ? (Di(), k(n, Tv, n, e), Ti()) : k(n, Tv, n, e);
					else {
						var c = es(n.type, t.memoizedProps);
						t = t.memoizedState, n.type.defaultProps || "ref" in n.memoizedProps || fb || (e.props !== n.memoizedProps && console.error("Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", T(n) || "instance"), e.state !== n.memoizedState && console.error("Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", T(n) || "instance")), Js(n) ? (Di(), k(n, Dv, n, e, c, t, e.__reactInternalSnapshotBeforeUpdate), Ti()) : k(n, Dv, n, e, c, t, e.__reactInternalSnapshotBeforeUpdate);
					}
					s & 64 && tc(n), s & 512 && oc(n, n.return);
					break;
				case 3:
					if (t = fi(), Mc(e, n), s & 64 && (s = n.updateQueue, s !== null)) {
						if (c = null, n.child !== null) switch (n.child.tag) {
							case 27:
							case 5:
								c = n.child.stateNode;
								break;
							case 1: c = n.child.stateNode;
						}
						try {
							k(n, la, s, c);
						} catch (e) {
							Il(n, n.return, e);
						}
					}
					e.effectDuration += pi(t);
					break;
				case 27: t === null && s & 4 && _c(n);
				case 26:
				case 5:
					if (Mc(e, n), t === null) {
						if (s & 4) uc(n);
						else if (s & 64) {
							e = n.type, t = n.memoizedProps, c = n.stateNode;
							try {
								k(n, Yu, c, e, t, n);
							} catch (e) {
								Il(n, n.return, e);
							}
						}
					}
					s & 512 && oc(n, n.return);
					break;
				case 12:
					if (s & 4) {
						s = fi(), Mc(e, n), e = n.stateNode, e.effectDuration += mi(s);
						try {
							k(n, cc, n, t, x_, e.effectDuration);
						} catch (e) {
							Il(n, n.return, e);
						}
					} else Mc(e, n);
					break;
				case 31:
					Mc(e, n), s & 4 && wc(e, n);
					break;
				case 13:
					Mc(e, n), s & 4 && Tc(e, n), s & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (s = Bl.bind(null, n), _d(e, s))));
					break;
				case 22:
					if (s = n.memoizedState !== null || vb, !s) {
						t = t !== null && t.memoizedState !== null || yb, c = vb;
						var l = yb;
						vb = s, (yb = t) && !l ? (Ic(e, n, (n.subtreeFlags & 8772) != 0), (n.mode & G) !== W && 0 <= q && 0 <= J && .05 < J - q && Qn(n, q, J)) : Mc(e, n), vb = c, yb = l;
					}
					break;
				case 30: break;
				default: Mc(e, n);
			}
			(n.mode & G) !== W && 0 <= q && 0 <= J && ((O_ || .05 < E_) && tr(n, q, J, E_, D_), n.alternate === null && n.return !== null && n.return.alternate !== null && .05 < J - q && (vc(n.return.alternate, n.return) || Zn(n, q, J, "Mount"))), _i(r), yi(i), D_ = a, O_ = o;
		}
		function xc(e) {
			var t = e.alternate;
			t !== null && (e.alternate = null, xc(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && Je(t)), e.stateNode = null, e._debugOwner = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
		}
		function Sc(e, t, n) {
			for (n = n.child; n !== null;) Cc(e, t, n), n = n.sibling;
		}
		function Cc(e, t, n) {
			if (Mp && typeof Mp.onCommitFiberUnmount == "function") try {
				Mp.onCommitFiberUnmount(jp, n);
			} catch (e) {
				Np || (Np = !0, console.error("React instrumentation encountered an error: %o", e));
			}
			var r = gi(), i = vi(), a = bi(), o = xi();
			switch (n.tag) {
				case 26:
					yb || sc(n, t), Sc(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && (e = n.stateNode, e.parentNode.removeChild(e));
					break;
				case 27:
					yb || sc(n, t);
					var s = Tb, c = Eb;
					ed(n.type) && (Tb = n.stateNode, Eb = !1), Sc(e, t, n), k(n, Od, n.stateNode), Tb = s, Eb = c;
					break;
				case 5: yb || sc(n, t);
				case 6:
					if (s = Tb, c = Eb, Tb = null, Sc(e, t, n), Tb = s, Eb = c, Tb !== null) if (Eb) try {
						k(n, nd, Tb, n.stateNode);
					} catch (e) {
						Il(n, t, e);
					}
					else try {
						k(n, td, Tb, n.stateNode);
					} catch (e) {
						Il(n, t, e);
					}
					break;
				case 18:
					Tb !== null && (Eb ? (e = Tb, rd(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Sf(e)) : rd(Tb, n.stateNode));
					break;
				case 4:
					s = Tb, c = Eb, Tb = n.stateNode.containerInfo, Eb = !0, Sc(e, t, n), Tb = s, Eb = c;
					break;
				case 0:
				case 11:
				case 14:
				case 15:
					Qs(gy, n, t), yb || Xs(n, t, _y), Sc(e, t, n);
					break;
				case 1:
					yb || (sc(n, t), s = n.stateNode, typeof s.componentWillUnmount == "function" && ic(n, t, s)), Sc(e, t, n);
					break;
				case 21:
					Sc(e, t, n);
					break;
				case 22:
					yb = (s = yb) || n.memoizedState !== null, Sc(e, t, n), yb = s;
					break;
				default: Sc(e, t, n);
			}
			(n.mode & G) !== W && 0 <= q && 0 <= J && (O_ || .05 < E_) && tr(n, q, J, E_, D_), _i(r), yi(i), D_ = a, O_ = o;
		}
		function wc(e, t) {
			if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
				e = e.dehydrated;
				try {
					k(t, wd, e);
				} catch (e) {
					Il(t, t.return, e);
				}
			}
		}
		function Tc(e, t) {
			if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
				k(t, Td, e);
			} catch (e) {
				Il(t, t.return, e);
			}
		}
		function Ec(e) {
			switch (e.tag) {
				case 31:
				case 13:
				case 19:
					var t = e.stateNode;
					return t === null && (t = e.stateNode = new xb()), t;
				case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new xb()), t;
				default: throw Error("Unexpected Suspense handler tag (" + e.tag + "). This is a bug in React.");
			}
		}
		function Dc(e, t) {
			var n = Ec(e);
			t.forEach(function(t) {
				if (!n.has(t)) {
					if (n.add(t), Pp) if (Cb !== null && wb !== null) Kl(wb, Cb);
					else throw Error("Expected finished root and lanes to be set. This is a bug in React.");
					var r = Vl.bind(null, e, t);
					t.then(r, r);
				}
			});
		}
		function Oc(e, t) {
			var n = t.deletions;
			if (n !== null) for (var r = 0; r < n.length; r++) {
				var i = e, a = t, o = n[r], s = gi(), c = a;
				a: for (; c !== null;) {
					switch (c.tag) {
						case 27:
							if (ed(c.type)) {
								Tb = c.stateNode, Eb = !1;
								break a;
							}
							break;
						case 5:
							Tb = c.stateNode, Eb = !1;
							break a;
						case 3:
						case 4:
							Tb = c.stateNode.containerInfo, Eb = !0;
							break a;
					}
					c = c.return;
				}
				if (Tb === null) throw Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
				Cc(i, a, o), Tb = null, Eb = !1, (o.mode & G) !== W && 0 <= q && 0 <= J && .05 < J - q && Zn(o, q, J, "Unmount"), _i(s), i = o, a = i.alternate, a !== null && (a.return = null), i.return = null;
			}
			if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) kc(t, e), t = t.sibling;
		}
		function kc(e, t) {
			var n = gi(), r = vi(), i = bi(), a = xi(), o = e.alternate, s = e.flags;
			switch (e.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					Oc(t, e), Ac(e), s & 4 && (Qs(gy | hy, e, e.return), Zs(gy | hy, e), Xs(e, e.return, _y | hy));
					break;
				case 1:
					if (Oc(t, e), Ac(e), s & 512 && (yb || o === null || sc(o, o.return)), s & 64 && vb && (s = e.updateQueue, s !== null && (o = s.callbacks, o !== null))) {
						var c = s.shared.hiddenCallbacks;
						s.shared.hiddenCallbacks = c === null ? o : c.concat(o);
					}
					break;
				case 26:
					if (c = Db, Oc(t, e), Ac(e), s & 512 && (yb || o === null || sc(o, o.return)), s & 4) {
						var l = o === null ? null : o.memoizedState;
						if (s = e.memoizedState, o === null) if (s === null) if (e.stateNode === null) {
							a: {
								s = e.type, o = e.memoizedProps, c = c.ownerDocument || c;
								b: switch (s) {
									case "title":
										l = c.getElementsByTagName("title")[0], (!l || l[$p] || l[Kp] || l.namespaceURI === Im || l.hasAttribute("itemprop")) && (l = c.createElement(s), c.head.insertBefore(l, c.querySelector("head > title"))), Eu(l, s, o), l[Kp] = e, $e(l), s = l;
										break a;
									case "link":
										var u = Hd("link", "href", c).get(s + (o.href || ""));
										if (u) {
											for (var d = 0; d < u.length; d++) if (l = u[d], l.getAttribute("href") === (o.href == null || o.href === "" ? null : o.href) && l.getAttribute("rel") === (o.rel == null ? null : o.rel) && l.getAttribute("title") === (o.title == null ? null : o.title) && l.getAttribute("crossorigin") === (o.crossOrigin == null ? null : o.crossOrigin)) {
												u.splice(d, 1);
												break b;
											}
										}
										l = c.createElement(s), Eu(l, s, o), c.head.appendChild(l);
										break;
									case "meta":
										if (u = Hd("meta", "content", c).get(s + (o.content || ""))) {
											for (d = 0; d < u.length; d++) if (l = u[d], A(o.content, "content"), l.getAttribute("content") === (o.content == null ? null : "" + o.content) && l.getAttribute("name") === (o.name == null ? null : o.name) && l.getAttribute("property") === (o.property == null ? null : o.property) && l.getAttribute("http-equiv") === (o.httpEquiv == null ? null : o.httpEquiv) && l.getAttribute("charset") === (o.charSet == null ? null : o.charSet)) {
												u.splice(d, 1);
												break b;
											}
										}
										l = c.createElement(s), Eu(l, s, o), c.head.appendChild(l);
										break;
									default: throw Error("getNodesForType encountered a type it did not expect: \"" + s + "\". This is a bug in React.");
								}
								l[Kp] = e, $e(l), s = l;
							}
							e.stateNode = s;
						} else Ud(c, e.type, e.stateNode);
						else e.stateNode = Rd(c, s, e.memoizedProps);
						else l === s ? s === null && e.stateNode !== null && dc(e, e.memoizedProps, o.memoizedProps) : (l === null ? o.stateNode !== null && (o = o.stateNode, o.parentNode.removeChild(o)) : l.count--, s === null ? Ud(c, e.type, e.stateNode) : Rd(c, s, e.memoizedProps));
					}
					break;
				case 27:
					Oc(t, e), Ac(e), s & 512 && (yb || o === null || sc(o, o.return)), o !== null && s & 4 && dc(e, e.memoizedProps, o.memoizedProps);
					break;
				case 5:
					if (Oc(t, e), Ac(e), s & 512 && (yb || o === null || sc(o, o.return)), e.flags & 32) {
						c = e.stateNode;
						try {
							k(e, Zu, c);
						} catch (t) {
							Il(e, e.return, t);
						}
					}
					s & 4 && e.stateNode != null && (c = e.memoizedProps, dc(e, c, o === null ? c : o.memoizedProps)), s & 1024 && (bb = !0, e.type !== "form" && console.error("Unexpected host component type. Expected a form. This is a bug in React."));
					break;
				case 6:
					if (Oc(t, e), Ac(e), s & 4) {
						if (e.stateNode === null) throw Error("This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.");
						s = e.memoizedProps, o = o === null ? s : o.memoizedProps, c = e.stateNode;
						try {
							k(e, Qu, c, o, s);
						} catch (t) {
							Il(e, e.return, t);
						}
					}
					break;
				case 3:
					if (c = fi(), pC = null, l = Db, Db = kd(t.containerInfo), Oc(t, e), Db = l, Ac(e), s & 4 && o !== null && o.memoizedState.isDehydrated) try {
						k(e, Cd, t.containerInfo);
					} catch (t) {
						Il(e, e.return, t);
					}
					bb && (bb = !1, jc(e)), t.effectDuration += pi(c);
					break;
				case 4:
					s = Db, Db = kd(e.stateNode.containerInfo), Oc(t, e), Ac(e), Db = s;
					break;
				case 12:
					s = fi(), Oc(t, e), Ac(e), e.stateNode.effectDuration += mi(s);
					break;
				case 31:
					Oc(t, e), Ac(e), s & 4 && (s = e.updateQueue, s !== null && (e.updateQueue = null, Dc(e, s)));
					break;
				case 13:
					Oc(t, e), Ac(e), e.child.flags & 8192 && e.memoizedState !== null != (o !== null && o.memoizedState !== null) && (_x = Sp()), s & 4 && (s = e.updateQueue, s !== null && (e.updateQueue = null, Dc(e, s)));
					break;
				case 22:
					c = e.memoizedState !== null;
					var f = o !== null && o.memoizedState !== null, p = vb, m = yb;
					if (vb = p || c, yb = m || f, Oc(t, e), yb = m, vb = p, f && !c && !p && !m && (e.mode & G) !== W && 0 <= q && 0 <= J && .05 < J - q && Qn(e, q, J), Ac(e), s & 8192) a: for (t = e.stateNode, t._visibility = c ? t._visibility & ~kg : t._visibility | kg, !c || o === null || f || vb || yb || (Pc(e), (e.mode & G) !== W && 0 <= q && 0 <= J && .05 < J - q && Zn(e, q, J, "Disconnect")), o = null, t = e;;) {
						if (t.tag === 5 || t.tag === 26) {
							if (o === null) {
								f = o = t;
								try {
									l = f.stateNode, c ? k(f, od, l) : k(f, ld, f.stateNode, f.memoizedProps);
								} catch (e) {
									Il(f, f.return, e);
								}
							}
						} else if (t.tag === 6) {
							if (o === null) {
								f = t;
								try {
									u = f.stateNode, c ? k(f, sd, u) : k(f, ud, u, f.memoizedProps);
								} catch (e) {
									Il(f, f.return, e);
								}
							}
						} else if (t.tag === 18) {
							if (o === null) {
								f = t;
								try {
									d = f.stateNode, c ? k(f, ad, d) : k(f, cd, f.stateNode);
								} catch (e) {
									Il(f, f.return, e);
								}
							}
						} else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === e) && t.child !== null) {
							t.child.return = t, t = t.child;
							continue;
						}
						if (t === e) break a;
						for (; t.sibling === null;) {
							if (t.return === null || t.return === e) break a;
							o === t && (o = null), t = t.return;
						}
						o === t && (o = null), t.sibling.return = t.return, t = t.sibling;
					}
					s & 4 && (s = e.updateQueue, s !== null && (o = s.retryQueue, o !== null && (s.retryQueue = null, Dc(e, o))));
					break;
				case 19:
					Oc(t, e), Ac(e), s & 4 && (s = e.updateQueue, s !== null && (e.updateQueue = null, Dc(e, s)));
					break;
				case 30: break;
				case 21: break;
				default: Oc(t, e), Ac(e);
			}
			(e.mode & G) !== W && 0 <= q && 0 <= J && ((O_ || .05 < E_) && tr(e, q, J, E_, D_), e.alternate === null && e.return !== null && e.return.alternate !== null && .05 < J - q && (vc(e.return.alternate, e.return) || Zn(e, q, J, "Mount"))), _i(n), yi(r), D_ = i, O_ = a;
		}
		function Ac(e) {
			var t = e.flags;
			if (t & 2) {
				try {
					k(e, gc, e);
				} catch (t) {
					Il(e, e.return, t);
				}
				e.flags &= -3;
			}
			t & 4096 && (e.flags &= -4097);
		}
		function jc(e) {
			if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
				var t = e;
				jc(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
			}
		}
		function Mc(e, t) {
			if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) bc(e, t.alternate, t), t = t.sibling;
		}
		function Nc(e) {
			var t = gi(), n = vi(), r = bi(), i = xi();
			switch (e.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					Xs(e, e.return, _y), Pc(e);
					break;
				case 1:
					sc(e, e.return);
					var a = e.stateNode;
					typeof a.componentWillUnmount == "function" && ic(e, e.return, a), Pc(e);
					break;
				case 27: k(e, Od, e.stateNode);
				case 26:
				case 5:
					sc(e, e.return), Pc(e);
					break;
				case 22:
					e.memoizedState === null && Pc(e);
					break;
				case 30:
					Pc(e);
					break;
				default: Pc(e);
			}
			(e.mode & G) !== W && 0 <= q && 0 <= J && (O_ || .05 < E_) && tr(e, q, J, E_, D_), _i(t), yi(n), D_ = r, O_ = i;
		}
		function Pc(e) {
			for (e = e.child; e !== null;) Nc(e), e = e.sibling;
		}
		function Fc(e, t, n, r) {
			var i = gi(), a = vi(), o = bi(), s = xi(), c = n.flags;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					Ic(e, n, r), Ys(n, _y);
					break;
				case 1:
					if (Ic(e, n, r), t = n.stateNode, typeof t.componentDidMount == "function" && k(n, Tv, n, t), t = n.updateQueue, t !== null) {
						e = n.stateNode;
						try {
							k(n, ca, t, e);
						} catch (e) {
							Il(n, n.return, e);
						}
					}
					r && c & 64 && tc(n), oc(n, n.return);
					break;
				case 27: _c(n);
				case 26:
				case 5:
					Ic(e, n, r), r && t === null && c & 4 && uc(n), oc(n, n.return);
					break;
				case 12:
					if (r && c & 4) {
						c = fi(), Ic(e, n, r), r = n.stateNode, r.effectDuration += mi(c);
						try {
							k(n, cc, n, t, x_, r.effectDuration);
						} catch (e) {
							Il(n, n.return, e);
						}
					} else Ic(e, n, r);
					break;
				case 31:
					Ic(e, n, r), r && c & 4 && wc(e, n);
					break;
				case 13:
					Ic(e, n, r), r && c & 4 && Tc(e, n);
					break;
				case 22:
					n.memoizedState === null && Ic(e, n, r), oc(n, n.return);
					break;
				case 30: break;
				default: Ic(e, n, r);
			}
			(n.mode & G) !== W && 0 <= q && 0 <= J && (O_ || .05 < E_) && tr(n, q, J, E_, D_), _i(i), yi(a), D_ = o, O_ = s;
		}
		function Ic(e, t, n) {
			for (n &&= (t.subtreeFlags & 8772) != 0, t = t.child; t !== null;) Fc(e, t.alternate, t, n), t = t.sibling;
		}
		function Lc(e, t) {
			var n = null;
			e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && ci(e), n != null && li(n));
		}
		function Rc(e, t) {
			e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (ci(t), e != null && li(e));
		}
		function zc(e, t, n, r, i) {
			if (t.subtreeFlags & 10256 || t.actualDuration !== 0 && (t.alternate === null || t.alternate.child !== t.child)) for (t = t.child; t !== null;) {
				var a = t.sibling;
				Bc(e, t, n, r, a === null ? i : a.actualStartTime), t = a;
			}
		}
		function Bc(e, t, n, r, i) {
			var a = gi(), o = vi(), s = bi(), c = xi(), l = Cg, u = t.flags;
			switch (t.tag) {
				case 0:
				case 11:
				case 15:
					(t.mode & G) !== W && 0 < t.actualStartTime && t.flags & 1 && $n(t, t.actualStartTime, i, Ob, n), zc(e, t, n, r, i), u & 2048 && $s(t, vy | hy);
					break;
				case 1:
					(t.mode & G) !== W && 0 < t.actualStartTime && (t.flags & 128 ? er(t, t.actualStartTime, i, []) : t.flags & 1 && $n(t, t.actualStartTime, i, Ob, n)), zc(e, t, n, r, i);
					break;
				case 3:
					var d = fi(), f = Ob;
					Ob = t.alternate !== null && t.alternate.memoizedState.isDehydrated && (t.flags & 256) == 0, zc(e, t, n, r, i), Ob = f, u & 2048 && (n = null, t.alternate !== null && (n = t.alternate.memoizedState.cache), r = t.memoizedState.cache, r !== n && (ci(r), n != null && li(n))), e.passiveEffectDuration += pi(d);
					break;
				case 12:
					if (u & 2048) {
						u = fi(), zc(e, t, n, r, i), e = t.stateNode, e.passiveEffectDuration += mi(u);
						try {
							k(t, lc, t, t.alternate, x_, e.passiveEffectDuration);
						} catch (e) {
							Il(t, t.return, e);
						}
					} else zc(e, t, n, r, i);
					break;
				case 31:
					u = Ob, d = t.alternate === null ? null : t.alternate.memoizedState, f = t.memoizedState, d !== null && f === null ? (f = t.deletions, f !== null && 0 < f.length && f[0].tag === 18 ? (Ob = !1, d = d.hydrationErrors, d !== null && er(t, t.actualStartTime, i, d)) : Ob = !0) : Ob = !1, zc(e, t, n, r, i), Ob = u;
					break;
				case 13:
					u = Ob, d = t.alternate === null ? null : t.alternate.memoizedState, f = t.memoizedState, d === null || d.dehydrated === null || f !== null && f.dehydrated !== null ? Ob = !1 : (f = t.deletions, f !== null && 0 < f.length && f[0].tag === 18 ? (Ob = !1, d = d.hydrationErrors, d !== null && er(t, t.actualStartTime, i, d)) : Ob = !0), zc(e, t, n, r, i), Ob = u;
					break;
				case 23: break;
				case 22:
					f = t.stateNode, d = t.alternate, t.memoizedState === null ? f._visibility & Ag ? zc(e, t, n, r, i) : (f._visibility |= Ag, Vc(e, t, n, r, (t.subtreeFlags & 10256) != 0 || t.actualDuration !== 0 && (t.alternate === null || t.alternate.child !== t.child), i), (t.mode & G) === W || Ob || (e = t.actualStartTime, 0 <= e && .05 < i - e && Qn(t, e, i), 0 <= q && 0 <= J && .05 < J - q && Qn(t, q, J))) : f._visibility & Ag ? zc(e, t, n, r, i) : Uc(e, t, n, r, i), u & 2048 && Lc(d, t);
					break;
				case 24:
					zc(e, t, n, r, i), u & 2048 && Rc(t.alternate, t);
					break;
				default: zc(e, t, n, r, i);
			}
			(t.mode & G) !== W && ((e = !Ob && t.alternate === null && t.return !== null && t.return.alternate !== null) && (n = t.actualStartTime, 0 <= n && .05 < i - n && Zn(t, n, i, "Mount")), 0 <= q && 0 <= J && ((O_ || .05 < E_) && tr(t, q, J, E_, D_), e && .05 < J - q && Zn(t, q, J, "Mount"))), _i(a), yi(o), D_ = s, O_ = c, Cg = l;
		}
		function Vc(e, t, n, r, i, a) {
			for (i &&= (t.subtreeFlags & 10256) != 0 || t.actualDuration !== 0 && (t.alternate === null || t.alternate.child !== t.child), t = t.child; t !== null;) {
				var o = t.sibling;
				Hc(e, t, n, r, i, o === null ? a : o.actualStartTime), t = o;
			}
		}
		function Hc(e, t, n, r, i, a) {
			var o = gi(), s = vi(), c = bi(), l = xi(), u = Cg;
			i && (t.mode & G) !== W && 0 < t.actualStartTime && t.flags & 1 && $n(t, t.actualStartTime, a, Ob, n);
			var d = t.flags;
			switch (t.tag) {
				case 0:
				case 11:
				case 15:
					Vc(e, t, n, r, i, a), $s(t, vy);
					break;
				case 23: break;
				case 22:
					var f = t.stateNode;
					t.memoizedState === null ? (f._visibility |= Ag, Vc(e, t, n, r, i, a)) : f._visibility & Ag ? Vc(e, t, n, r, i, a) : Uc(e, t, n, r, a), i && d & 2048 && Lc(t.alternate, t);
					break;
				case 24:
					Vc(e, t, n, r, i, a), i && d & 2048 && Rc(t.alternate, t);
					break;
				default: Vc(e, t, n, r, i, a);
			}
			(t.mode & G) !== W && 0 <= q && 0 <= J && (O_ || .05 < E_) && tr(t, q, J, E_, D_), _i(o), yi(s), D_ = c, O_ = l, Cg = u;
		}
		function Uc(e, t, n, r, i) {
			if (t.subtreeFlags & 10256 || t.actualDuration !== 0 && (t.alternate === null || t.alternate.child !== t.child)) for (var a = t.child; a !== null;) {
				t = a.sibling;
				var o = e, s = n, c = r, l = t === null ? i : t.actualStartTime, u = Cg;
				(a.mode & G) !== W && 0 < a.actualStartTime && a.flags & 1 && $n(a, a.actualStartTime, l, Ob, s);
				var d = a.flags;
				switch (a.tag) {
					case 22:
						Uc(o, a, s, c, l), d & 2048 && Lc(a.alternate, a);
						break;
					case 24:
						Uc(o, a, s, c, l), d & 2048 && Rc(a.alternate, a);
						break;
					default: Uc(o, a, s, c, l);
				}
				Cg = u, a = t;
			}
		}
		function Wc(e, t, n) {
			if (e.subtreeFlags & kb) for (e = e.child; e !== null;) Gc(e, t, n), e = e.sibling;
		}
		function Gc(e, t, n) {
			switch (e.tag) {
				case 26:
					Wc(e, t, n), e.flags & kb && e.memoizedState !== null && Kd(n, Db, e.memoizedState, e.memoizedProps);
					break;
				case 5:
					Wc(e, t, n);
					break;
				case 3:
				case 4:
					var r = Db;
					Db = kd(e.stateNode.containerInfo), Wc(e, t, n), Db = r;
					break;
				case 22:
					e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = kb, kb = 16777216, Wc(e, t, n), kb = r) : Wc(e, t, n));
					break;
				default: Wc(e, t, n);
			}
		}
		function Kc(e) {
			var t = e.alternate;
			if (t !== null && (e = t.child, e !== null)) {
				t.child = null;
				do
					t = e.sibling, e.sibling = null, e = t;
				while (e !== null);
			}
		}
		function qc(e) {
			var t = e.deletions;
			if (e.flags & 16) {
				if (t !== null) for (var n = 0; n < t.length; n++) {
					var r = t[n], i = gi();
					Sb = r, Zc(r, e), (r.mode & G) !== W && 0 <= q && 0 <= J && .05 < J - q && Zn(r, q, J, "Unmount"), _i(i);
				}
				Kc(e);
			}
			if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) Jc(e), e = e.sibling;
		}
		function Jc(e) {
			var t = gi(), n = vi(), r = bi(), i = xi();
			switch (e.tag) {
				case 0:
				case 11:
				case 15:
					qc(e), e.flags & 2048 && ec(e, e.return, vy | hy);
					break;
				case 3:
					var a = fi();
					qc(e), e.stateNode.passiveEffectDuration += pi(a);
					break;
				case 12:
					a = fi(), qc(e), e.stateNode.passiveEffectDuration += mi(a);
					break;
				case 22:
					a = e.stateNode, e.memoizedState !== null && a._visibility & Ag && (e.return === null || e.return.tag !== 13) ? (a._visibility &= ~Ag, Yc(e), (e.mode & G) !== W && 0 <= q && 0 <= J && .05 < J - q && Zn(e, q, J, "Disconnect")) : qc(e);
					break;
				default: qc(e);
			}
			(e.mode & G) !== W && 0 <= q && 0 <= J && (O_ || .05 < E_) && tr(e, q, J, E_, D_), _i(t), yi(n), O_ = i, D_ = r;
		}
		function Yc(e) {
			var t = e.deletions;
			if (e.flags & 16) {
				if (t !== null) for (var n = 0; n < t.length; n++) {
					var r = t[n], i = gi();
					Sb = r, Zc(r, e), (r.mode & G) !== W && 0 <= q && 0 <= J && .05 < J - q && Zn(r, q, J, "Unmount"), _i(i);
				}
				Kc(e);
			}
			for (e = e.child; e !== null;) Xc(e), e = e.sibling;
		}
		function Xc(e) {
			var t = gi(), n = vi(), r = bi(), i = xi();
			switch (e.tag) {
				case 0:
				case 11:
				case 15:
					ec(e, e.return, vy), Yc(e);
					break;
				case 22:
					var a = e.stateNode;
					a._visibility & Ag && (a._visibility &= ~Ag, Yc(e));
					break;
				default: Yc(e);
			}
			(e.mode & G) !== W && 0 <= q && 0 <= J && (O_ || .05 < E_) && tr(e, q, J, E_, D_), _i(t), yi(n), O_ = i, D_ = r;
		}
		function Zc(e, t) {
			for (; Sb !== null;) {
				var n = Sb, r = n, i = t, a = gi(), o = vi(), s = bi(), c = xi();
				switch (r.tag) {
					case 0:
					case 11:
					case 15:
						ec(r, i, vy);
						break;
					case 23:
					case 22:
						r.memoizedState !== null && r.memoizedState.cachePool !== null && (i = r.memoizedState.cachePool.pool, i != null && ci(i));
						break;
					case 24: li(r.memoizedState.cache);
				}
				if ((r.mode & G) !== W && 0 <= q && 0 <= J && (O_ || .05 < E_) && tr(r, q, J, E_, D_), _i(a), yi(o), O_ = c, D_ = s, r = n.child, r !== null) r.return = n, Sb = r;
				else a: for (n = e; Sb !== null;) {
					if (r = Sb, a = r.sibling, o = r.return, xc(r), r === n) {
						Sb = null;
						break a;
					}
					if (a !== null) {
						a.return = o, Sb = a;
						break a;
					}
					Sb = o;
				}
			}
		}
		function Qc() {
			Mb.forEach(function(e) {
				return e();
			});
		}
		function $c() {
			var e = typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0;
			return e || V.actQueue === null || console.error("The current testing environment is not configured to support act(...)"), e;
		}
		function el(e) {
			if ((Wb & Fb) !== Pb && $ !== 0) return $ & -$;
			var t = V.T;
			return t === null ? Ke() : (t._updatedFibers ||= /* @__PURE__ */ new Set(), t._updatedFibers.add(e), ru());
		}
		function tl() {
			if (fx === 0) if (!($ & 536870912) || K) {
				var e = zp;
				zp <<= 1, !(zp & 3932160) && (zp = 262144), fx = e;
			} else fx = 536870912;
			return e = ly.current, e !== null && (e.flags |= 32), fx;
		}
		function nl(e, t, n) {
			if (eS && console.error("useInsertionEffect must not schedule updates."), Yx && (Xx = !0), (e === Gb && (nx === Jb || nx === tx) || e.cancelPendingCommit !== null) && (ul(e, 0), ol(e, $, fx, !1)), Le(e, n), (Wb & Fb) !== Pb && e === Gb) {
				if (gp) switch (t.tag) {
					case 0:
					case 11:
					case 15:
						e = Q && T(Q) || "Unknown", rS.has(e) || (rS.add(e), t = T(t) || "Unknown", console.error("Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://react.dev/link/setstate-in-render", t, e, e));
						break;
					case 1: nS ||= (console.error("Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."), !0);
				}
			} else Pp && Ue(e, t, n), Jl(t), e === Gb && ((Wb & Fb) === Pb && (ux |= n), cx === Vb && ol(e, $, fx, !1)), Yl(e);
		}
		function rl(e, t, n) {
			if ((Wb & (Fb | Ib)) !== Pb) throw Error("Should not already be working.");
			if ($ !== 0 && Q !== null) {
				var r = Q, i = Sp();
				switch (ev) {
					case Yb:
					case Jb:
						var a = tv;
						xg && ((r = r._debugTask) ? r.run(console.timeStamp.bind(console, "Suspended", a, i, Sg, void 0, "primary-light")) : console.timeStamp("Suspended", a, i, Sg, void 0, "primary-light"));
						break;
					case tx:
						a = tv, xg && ((r = r._debugTask) ? r.run(console.timeStamp.bind(console, "Action", a, i, Sg, void 0, "primary-light")) : console.timeStamp("Action", a, i, Sg, void 0, "primary-light"));
						break;
					default: xg && (r = i - tv, 3 > r || console.timeStamp("Blocked", tv, i, Sg, void 0, 5 > r ? "primary-light" : 10 > r ? "primary" : 100 > r ? "primary-dark" : "error"));
				}
			}
			a = (n = !n && (t & 127) == 0 && (t & e.expiredLanes) === 0 || Ne(e, t)) ? yl(e, t) : _l(e, t, !0);
			var o = n;
			do {
				if (a === Lb) {
					ax && !n && ol(e, t, 0, !1), t = nx, tv = g_(), ev = t;
					break;
				} else {
					if (r = Sp(), i = e.current.alternate, o && !al(i)) {
						Xn(t), i = b_, a = r, !xg || a <= i || (Cx ? Cx.run(console.timeStamp.bind(console, "Teared Render", i, a, U, H, "error")) : console.timeStamp("Teared Render", i, a, U, H, "error")), ll(t, r), a = _l(e, t, !1), o = !1;
						continue;
					}
					if (a === zb) {
						if (o = t, e.errorRecoveryDisabledLanes & o) var s = 0;
						else s = e.pendingLanes & -536870913, s = s === 0 ? s & 536870912 ? 536870912 : 0 : s;
						if (s !== 0) {
							Xn(t), or(b_, r, t, Cx), ll(t, r), t = s;
							a: {
								r = e, a = o, o = mx;
								var c = r.current.memoizedState.isDehydrated;
								if (c && (ul(r, s).flags |= 256), s = _l(r, s, !1), s !== zb) {
									if (ox && !c) {
										r.errorRecoveryDisabledLanes |= a, ux |= a, a = Vb;
										break a;
									}
									r = hx, hx = o, r !== null && (hx === null ? hx = r : hx.push.apply(hx, r));
								}
								a = s;
							}
							if (o = !1, a !== zb) continue;
							r = Sp();
						}
					}
					if (a === Rb) {
						Xn(t), or(b_, r, t, Cx), ll(t, r), ul(e, 0), ol(e, t, 0, !0);
						break;
					}
					a: {
						switch (n = e, a) {
							case Lb:
							case Rb: throw Error("Root did not complete. This is a bug in React.");
							case Vb: if ((t & 4194048) !== t) break;
							case Hb:
								Xn(t), rr(b_, r, t, Cx), ll(t, r), i = t, i & 127 ? R_ = r : i & 4194048 && (Y_ = r), ol(n, t, fx, !ix);
								break a;
							case zb:
								hx = null;
								break;
							case Bb:
							case Ub: break;
							default: throw Error("Unknown root exit status.");
						}
						if (V.actQueue !== null) Dl(n, i, t, hx, Sx, gx, fx, ux, px, a, null, null, b_, r);
						else {
							if ((t & 62914560) === t && (o = _x + yx - Sp(), 10 < o)) {
								if (ol(n, t, fx, !ix), Me(n, 0, !0) !== 0) break a;
								Rx = t, n.timeoutHandle = QS(il.bind(null, n, i, hx, Sx, gx, t, fx, ux, px, ix, a, "Throttled", b_, r), o);
								break a;
							}
							il(n, i, hx, Sx, gx, t, fx, ux, px, ix, a, null, b_, r);
						}
					}
				}
				break;
			} while (1);
			Yl(e);
		}
		function il(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
			e.timeoutHandle = eC;
			var m = t.subtreeFlags, h = null;
			if ((m & 8192 || (m & 16785408) == 16785408) && (h = {
				stylesheets: null,
				count: 0,
				imgCount: 0,
				imgBytes: 0,
				suspenseyImages: [],
				waitingForImages: !0,
				waitingForViewTransition: !1,
				unsuspend: sn
			}, Gc(t, a, h), m = (a & 62914560) === a ? _x - Sp() : (a & 4194048) === a ? vx - Sp() : 0, m = qd(h, m), m !== null)) {
				Rx = a, e.cancelPendingCommit = m(Dl.bind(null, e, t, a, n, r, i, o, s, c, u, h, h.waitingForViewTransition ? "Waiting for the previous Animation" : 0 < h.count ? 0 < h.imgCount ? "Suspended on CSS and Images" : "Suspended on CSS" : h.imgCount === 1 ? "Suspended on an Image" : 0 < h.imgCount ? "Suspended on Images" : null, f, p)), ol(e, a, o, !l);
				return;
			}
			Dl(e, t, a, n, r, i, o, s, c, u, h, d, f, p);
		}
		function al(e) {
			for (var t = e;;) {
				var n = t.tag;
				if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
					var i = n[r], a = i.getSnapshot;
					i = i.value;
					try {
						if (!Wh(a(), i)) return !1;
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
		function ol(e, t, n, r) {
			t &= ~dx, t &= ~ux, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
			for (var i = t; 0 < i;) {
				var a = 31 - Fp(i), o = 1 << a;
				r[a] = -1, i &= ~o;
			}
			n !== 0 && ze(e, n, t);
		}
		function sl() {
			return (Wb & (Fb | Ib)) === Pb ? (L(0, !1), !1) : !0;
		}
		function cl() {
			if (Q !== null) {
				if (nx === Kb) var e = Q.return;
				else e = Q, Xr(), ka(e), Wv = null, Gv = 0, e = Q;
				for (; e !== null;) qs(e.alternate, e), e = e.return;
				Q = null;
			}
		}
		function ll(e, t) {
			e & 127 && (k_ = t), e & 4194048 && (z_ = t), e & 62914560 && (X_ = t), e & 2080374784 && (Z_ = t);
		}
		function ul(e, t) {
			xg && (console.timeStamp("Blocking Track", .003, .003, "Blocking", H, "primary-light"), console.timeStamp("Transition Track", .003, .003, "Transition", H, "primary-light"), console.timeStamp("Suspense Track", .003, .003, "Suspense", H, "primary-light"), console.timeStamp("Idle Track", .003, .003, "Idle", H, "primary-light"));
			var n = b_;
			if (b_ = g_(), $ !== 0 && 0 < n) {
				if (Xn($), cx === Bb || cx === Vb) rr(n, b_, t, Cx);
				else {
					var r = b_, i = Cx;
					if (xg && !(r <= n)) {
						var a = (t & 738197653) === t ? "tertiary-dark" : "primary-dark", o = (t & 536870912) === t ? "Prewarm" : (t & 201326741) === t ? "Interrupted Hydration" : "Interrupted Render";
						i ? i.run(console.timeStamp.bind(console, o, n, r, U, H, a)) : console.timeStamp(o, n, r, U, H, a);
					}
				}
				ll($, b_);
			}
			if (n = Cx, Cx = null, t & 127) {
				Cx = j_, i = 0 <= A_ && A_ < k_ ? k_ : A_, r = 0 <= F_ && F_ < k_ ? k_ : F_, a = 0 <= r ? r : 0 <= i ? i : b_, 0 <= R_ ? (Xn(2), ir(R_, a, t, n)) : Q_ & 127 && (Xn(2), lr(k_, a, $_)), n = i;
				var s = r, c = I_, l = 0 < L_, u = M_ === v_, d = M_ === y_;
				if (i = b_, r = j_, a = N_, o = P_, xg) {
					if (U = "Blocking", 0 < n ? n > i && (n = i) : n = i, 0 < s ? s > n && (s = n) : s = n, c !== null && n > s) {
						var f = l ? "secondary-light" : "warning";
						r ? r.run(console.timeStamp.bind(console, l ? "Consecutive" : "Event: " + c, s, n, U, H, f)) : console.timeStamp(l ? "Consecutive" : "Event: " + c, s, n, U, H, f);
					}
					i > n && (s = u ? "error" : (t & 738197653) === t ? "tertiary-light" : "primary-light", u = d ? "Promise Resolved" : u ? "Cascading Update" : 5 < i - n ? "Update Blocked" : "Update", d = [], o != null && d.push(["Component name", o]), a != null && d.push(["Method name", a]), n = {
						start: n,
						end: i,
						detail: { devtools: {
							properties: d,
							track: U,
							trackGroup: H,
							color: s
						} }
					}, r ? r.run(performance.measure.bind(performance, u, n)) : performance.measure(u, n));
				}
				A_ = -1.1, M_ = 0, P_ = N_ = null, R_ = -1.1, L_ = F_, F_ = -1.1, k_ = g_();
			}
			if (t & 4194048 && (Cx = U_, i = 0 <= B_ && B_ < z_ ? z_ : B_, n = 0 <= V_ && V_ < z_ ? z_ : V_, r = 0 <= K_ && K_ < z_ ? z_ : K_, a = 0 <= r ? r : 0 <= n ? n : b_, 0 <= Y_ ? (Xn(256), ir(Y_, a, t, Cx)) : Q_ & 4194048 && (Xn(256), lr(z_, a, $_)), d = r, s = q_, c = 0 < J_, l = H_ === y_, a = b_, r = U_, o = W_, u = G_, xg && (U = "Transition", 0 < n ? n > a && (n = a) : n = a, 0 < i ? i > n && (i = n) : i = n, 0 < d ? d > i && (d = i) : d = i, i > d && s !== null && (f = c ? "secondary-light" : "warning", r ? r.run(console.timeStamp.bind(console, c ? "Consecutive" : "Event: " + s, d, i, U, H, f)) : console.timeStamp(c ? "Consecutive" : "Event: " + s, d, i, U, H, f)), n > i && (r ? r.run(console.timeStamp.bind(console, "Action", i, n, U, H, "primary-dark")) : console.timeStamp("Action", i, n, U, H, "primary-dark")), a > n && (i = l ? "Promise Resolved" : 5 < a - n ? "Update Blocked" : "Update", d = [], u != null && d.push(["Component name", u]), o != null && d.push(["Method name", o]), n = {
				start: n,
				end: a,
				detail: { devtools: {
					properties: d,
					track: U,
					trackGroup: H,
					color: "primary-light"
				} }
			}, r ? r.run(performance.measure.bind(performance, i, n)) : performance.measure(i, n))), V_ = B_ = -1.1, H_ = 0, Y_ = -1.1, J_ = K_, K_ = -1.1, z_ = g_()), t & 62914560 && Q_ & 62914560 && (Xn(4194304), lr(X_, b_, $_)), t & 2080374784 && Q_ & 2080374784 && (Xn(268435456), lr(Z_, b_, $_)), n = e.timeoutHandle, n !== eC && (e.timeoutHandle = eC, $S(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), Rx = 0, cl(), Gb = e, Q = n = Cr(e.current, null), $ = t, nx = Kb, rx = null, ix = !1, ax = Ne(e, t), ox = !1, cx = Lb, px = fx = dx = ux = lx = 0, hx = mx = null, gx = !1, t & 8 && (t |= t & 32), r = e.entangledLanes, r !== 0) for (e = e.entanglements, r &= t; 0 < r;) i = 31 - Fp(r), a = 1 << i, t |= e[i], r &= ~a;
			return sx = t, ur(), e = ug(), 1e3 < e - cg && (V.recentlyCreatedOwnerStacks = 0, cg = e), uv.discardPendingWarnings(), n;
		}
		function dl(e, t) {
			X = null, V.H = Ry, V.getCurrentStack = null, gp = !1, hp = null, t === Rv || t === Bv ? (t = zi(), nx = Yb) : t === zv ? (t = zi(), nx = Xb) : nx = t === ob ? ex : typeof t == "object" && t && typeof t.then == "function" ? Qb : qb, rx = t;
			var n = Q;
			n === null ? (cx = Rb, is(e, jr(t, e.current))) : n.mode & G && Ci(n);
		}
		function fl() {
			var e = ly.current;
			return e === null ? !0 : ($ & 4194048) === $ ? uy === null : ($ & 62914560) === $ || $ & 536870912 ? e === uy : !1;
		}
		function pl() {
			var e = V.H;
			return V.H = Ry, e === null ? Ry : e;
		}
		function ml() {
			var e = V.A;
			return V.A = Ab, e;
		}
		function hl(e) {
			Cx === null && (Cx = e._debugTask == null ? null : e._debugTask);
		}
		function gl() {
			cx = Vb, ix || ($ & 4194048) !== $ && ly.current !== null || (ax = !0), !(lx & 134217727) && !(ux & 134217727) || Gb === null || ol(Gb, $, fx, !1);
		}
		function _l(e, t, n) {
			var r = Wb;
			Wb |= Fb;
			var i = pl(), a = ml();
			if (Gb !== e || $ !== t) {
				if (Pp) {
					var o = e.memoizedUpdaters;
					0 < o.size && (Kl(e, $), o.clear()), We(e, t);
				}
				Sx = null, ul(e, t);
			}
			t = !1, o = cx;
			a: do
				try {
					if (nx !== Kb && Q !== null) {
						var s = Q, c = rx;
						switch (nx) {
							case ex:
								cl(), o = Hb;
								break a;
							case Yb:
							case Jb:
							case tx:
							case Qb:
								ly.current === null && (t = !0);
								var l = nx;
								if (nx = Kb, rx = null, wl(e, s, c, l), n && ax) {
									o = Lb;
									break a;
								}
								break;
							default: l = nx, nx = Kb, rx = null, wl(e, s, c, l);
						}
					}
					vl(), o = cx;
					break;
				} catch (t) {
					dl(e, t);
				}
			while (1);
			return t && e.shellSuspendCounter++, Xr(), Wb = r, V.H = i, V.A = a, Q === null && (Gb = null, $ = 0, ur()), o;
		}
		function vl() {
			for (; Q !== null;) xl(Q);
		}
		function yl(e, t) {
			var n = Wb;
			Wb |= Fb;
			var r = pl(), i = ml();
			if (Gb !== e || $ !== t) {
				if (Pp) {
					var a = e.memoizedUpdaters;
					0 < a.size && (Kl(e, $), a.clear()), We(e, t);
				}
				Sx = null, bx = Sp() + xx, ul(e, t);
			} else ax = Ne(e, t);
			a: do
				try {
					if (nx !== Kb && Q !== null) b: switch (t = Q, a = rx, nx) {
						case qb:
							nx = Kb, rx = null, wl(e, t, a, qb);
							break;
						case Jb:
						case tx:
							if (Ii(a)) {
								nx = Kb, rx = null, Sl(t);
								break;
							}
							t = function() {
								nx !== Jb && nx !== tx || Gb !== e || (nx = $b), Yl(e);
							}, a.then(t, t);
							break a;
						case Yb:
							nx = $b;
							break a;
						case Xb:
							nx = Zb;
							break a;
						case $b:
							Ii(a) ? (nx = Kb, rx = null, Sl(t)) : (nx = Kb, rx = null, wl(e, t, a, $b));
							break;
						case Zb:
							var o = null;
							switch (Q.tag) {
								case 26: o = Q.memoizedState;
								case 5:
								case 27:
									var s = Q;
									if (o ? Gd(o) : s.stateNode.complete) {
										nx = Kb, rx = null;
										var c = s.sibling;
										if (c !== null) Q = c;
										else {
											var l = s.return;
											l === null ? Q = null : (Q = l, Tl(l));
										}
										break b;
									}
									break;
								default: console.error("Unexpected type of fiber triggered a suspensey commit. This is a bug in React.");
							}
							nx = Kb, rx = null, wl(e, t, a, Zb);
							break;
						case Qb:
							nx = Kb, rx = null, wl(e, t, a, Qb);
							break;
						case ex:
							cl(), cx = Hb;
							break a;
						default: throw Error("Unexpected SuspendedReason. This is a bug in React.");
					}
					V.actQueue === null ? bl() : vl();
					break;
				} catch (t) {
					dl(e, t);
				}
			while (1);
			return Xr(), V.H = r, V.A = i, Wb = n, Q === null ? (Gb = null, $ = 0, ur(), cx) : Lb;
		}
		function bl() {
			for (; Q !== null && !bp();) xl(Q);
		}
		function xl(e) {
			var t = e.alternate;
			(e.mode & G) === W ? t = k(e, Rs, t, e, sx) : (Si(e), t = k(e, Rs, t, e, sx), Ci(e)), e.memoizedProps = e.pendingProps, t === null ? Tl(e) : Q = t;
		}
		function Sl(e) {
			var t = k(e, Cl, e);
			e.memoizedProps = e.pendingProps, t === null ? Tl(e) : Q = t;
		}
		function Cl(e) {
			var t = e.alternate, n = (e.mode & G) !== W;
			switch (n && Si(e), e.tag) {
				case 15:
				case 0:
					t = Ss(t, e, e.pendingProps, e.type, void 0, $);
					break;
				case 11:
					t = Ss(t, e, e.pendingProps, e.type.render, e.ref, $);
					break;
				case 5: ka(e);
				default: qs(t, e), e = Q = wr(e, sx), t = Rs(t, e, sx);
			}
			return n && Ci(e), t;
		}
		function wl(e, t, n, r) {
			Xr(), ka(t), Wv = null, Gv = 0;
			var i = t.return;
			try {
				if (ls(e, i, t, n, $)) {
					cx = Rb, is(e, jr(n, e.current)), Q = null;
					return;
				}
			} catch (t) {
				if (i !== null) throw Q = i, t;
				cx = Rb, is(e, jr(n, e.current)), Q = null;
				return;
			}
			t.flags & 32768 ? (K || r === qb ? e = !0 : ax || $ & 536870912 ? e = !1 : (ix = e = !0, (r === Jb || r === tx || r === Yb || r === Qb) && (r = ly.current, r !== null && r.tag === 13 && (r.flags |= 16384))), El(t, e)) : Tl(t);
		}
		function Tl(e) {
			var t = e;
			do {
				if (t.flags & 32768) {
					El(t, ix);
					return;
				}
				var n = t.alternate;
				if (e = t.return, Si(t), n = k(t, Gs, n, t, sx), (t.mode & G) !== W && wi(t), n !== null) {
					Q = n;
					return;
				}
				if (t = t.sibling, t !== null) {
					Q = t;
					return;
				}
				Q = t = e;
			} while (t !== null);
			cx === Lb && (cx = Ub);
		}
		function El(e, t) {
			do {
				var n = Ks(e.alternate, e);
				if (n !== null) {
					n.flags &= 32767, Q = n;
					return;
				}
				if ((e.mode & G) !== W) {
					wi(e), n = e.actualDuration;
					for (var r = e.child; r !== null;) n += r.actualDuration, r = r.sibling;
					e.actualDuration = n;
				}
				if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
					Q = e;
					return;
				}
				Q = e = n;
			} while (e !== null);
			cx = Hb, Q = null;
		}
		function Dl(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
			e.cancelPendingCommit = null;
			do
				Nl();
			while (Fx !== kx);
			if (uv.flushLegacyContextWarning(), uv.flushPendingUnsafeLifecycleWarnings(), (Wb & (Fb | Ib)) !== Pb) throw Error("Should not already be working.");
			if (Xn(n), l === zb ? or(f, p, n, Cx) : r === null ? nr(f, p, n, Cx) : ar(f, p, n, r, t !== null && t.alternate !== null && t.alternate.memoizedState.isDehydrated && (t.flags & 256) != 0, Cx), t !== null) {
				if (n === 0 && console.error("finishedLanes should not be empty during a commit. This is a bug in React."), t === e.current) throw Error("Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue.");
				if (a = t.lanes | t.childLanes, a |= Ng, Re(e, n, a, o, s, c), e === Gb && (Q = Gb = null, $ = 0), Lx = t, Ix = e, Rx = n, zx = a, Vx = i, Hx = r, Bx = p, Ux = d, Wx = Tx, Gx = null, t.actualDuration !== 0 || t.subtreeFlags & 10256 || t.flags & 10256 ? (e.callbackNode = null, e.callbackPriority = 0, ql(Ep, function() {
					return ZS = window.event, Wx === Tx && (Wx = Dx), Pl(), null;
				})) : (e.callbackNode = null, e.callbackPriority = 0), C_ = null, x_ = g_(), d !== null && sr(p, x_, d, Cx), r = (t.flags & 13878) != 0, t.subtreeFlags & 13878 || r) {
					r = V.T, V.T = null, i = Jf.p, Jf.p = Vp, o = Wb, Wb |= Ib;
					try {
						yc(e, t, n);
					} finally {
						Wb = o, Jf.p = i, V.T = r;
					}
				}
				Fx = Ax, Ol(), kl(), Al();
			}
		}
		function Ol() {
			if (Fx === Ax) {
				Fx = kx;
				var e = Ix, t = Lx, n = Rx, r = (t.flags & 13878) != 0;
				if (t.subtreeFlags & 13878 || r) {
					r = V.T, V.T = null;
					var i = Jf.p;
					Jf.p = Vp;
					var a = Wb;
					Wb |= Ib;
					try {
						Cb = n, wb = e, hi(), kc(t, e), wb = Cb = null, n = JS;
						var o = Bn(e.containerInfo), s = n.focusedElem, c = n.selectionRange;
						if (o !== s && s && s.ownerDocument && zn(s.ownerDocument.documentElement, s)) {
							if (c !== null && Vn(s)) {
								var l = c.start, u = c.end;
								if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
								else {
									var d = s.ownerDocument || document, f = d && d.defaultView || window;
									if (f.getSelection) {
										var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
										!p.extend && h > g && (o = g, g = h, h = o);
										var _ = Rn(s, h), v = Rn(s, g);
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
						RC = !!qS, JS = qS = null;
					} finally {
						Wb = a, Jf.p = i, V.T = r;
					}
				}
				e.current = t, Fx = jx;
			}
		}
		function kl() {
			if (Fx === jx) {
				Fx = kx;
				var e = Gx;
				if (e !== null) {
					x_ = g_();
					var t = S_, n = x_;
					!xg || n <= t || ($_ ? $_.run(console.timeStamp.bind(console, e, t, n, U, H, "secondary-light")) : console.timeStamp(e, t, n, U, H, "secondary-light"));
				}
				e = Ix, t = Lx, n = Rx;
				var r = (t.flags & 8772) != 0;
				if (t.subtreeFlags & 8772 || r) {
					r = V.T, V.T = null;
					var i = Jf.p;
					Jf.p = Vp;
					var a = Wb;
					Wb |= Ib;
					try {
						Cb = n, wb = e, hi(), bc(e, t.alternate, t), wb = Cb = null;
					} finally {
						Wb = a, Jf.p = i, V.T = r;
					}
				}
				e = Bx, t = Ux, S_ = g_(), e = t === null ? e : x_, t = S_, n = Wx === Ex, r = Cx, C_ === null ? !xg || t <= e || (r ? r.run(console.timeStamp.bind(console, n ? "Commit Interrupted View Transition" : "Commit", e, t, U, H, n ? "error" : "secondary-dark")) : console.timeStamp(n ? "Commit Interrupted View Transition" : "Commit", e, t, U, H, n ? "error" : "secondary-dark")) : cr(e, t, C_, !1, r), Fx = Mx;
			}
		}
		function Al() {
			if (Fx === Nx || Fx === Mx) {
				if (Fx === Nx) {
					var e = S_;
					S_ = g_();
					var t = S_, n = Wx === Ex;
					!xg || t <= e || ($_ ? $_.run(console.timeStamp.bind(console, n ? "Interrupted View Transition" : "Starting Animation", e, t, U, H, n ? "error" : "secondary-light")) : console.timeStamp(n ? "Interrupted View Transition" : "Starting Animation", e, t, U, H, n ? " error" : "secondary-light")), Wx !== Ex && (Wx = Ox);
				}
				Fx = kx, xp(), e = Ix;
				var r = Lx;
				t = Rx, n = Hx;
				var i = r.actualDuration !== 0 || (r.subtreeFlags & 10256) != 0 || (r.flags & 10256) != 0;
				i ? Fx = Px : (Fx = kx, Lx = Ix = null, Ml(e, e.pendingLanes), Qx = 0, $x = null);
				var a = e.pendingLanes;
				if (a === 0 && (wx = null), i || Wl(e), a = Ge(t), r = r.stateNode, Mp && typeof Mp.onCommitFiberRoot == "function") try {
					var o = (r.current.flags & 128) == 128;
					switch (a) {
						case Vp:
							var s = wp;
							break;
						case Hp:
							s = Tp;
							break;
						case Up:
							s = Ep;
							break;
						case Wp:
							s = Op;
							break;
						default: s = Ep;
					}
					Mp.onCommitFiberRoot(jp, r, s, o);
				} catch (e) {
					Np || (Np = !0, console.error("React instrumentation encountered an error: %o", e));
				}
				if (Pp && e.memoizedUpdaters.clear(), Qc(), n !== null) {
					o = V.T, s = Jf.p, Jf.p = Vp, V.T = null;
					try {
						var c = e.onRecoverableError;
						for (r = 0; r < n.length; r++) {
							var l = n[r], u = jl(l.stack);
							k(l.source, c, l.value, u);
						}
					} finally {
						V.T = o, Jf.p = s;
					}
				}
				Rx & 3 && Nl(), Yl(e), a = e.pendingLanes, t & 261930 && a & 42 ? (rv = !0, e === Jx ? qx++ : (qx = 0, Jx = e)) : qx = 0, i || ll(t, S_), L(0, !1);
			}
		}
		function jl(e) {
			return e = { componentStack: e }, Object.defineProperty(e, "digest", { get: function() {
				console.error("You are accessing \"digest\" from the errorInfo object passed to onRecoverableError. This property is no longer provided as part of errorInfo but can be accessed as a property of the Error instance itself.");
			} }), e;
		}
		function Ml(e, t) {
			(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, li(t)));
		}
		function Nl() {
			return Ol(), kl(), Al(), Pl();
		}
		function Pl() {
			if (Fx !== Px) return !1;
			var e = Ix, t = zx;
			zx = 0;
			var n = Ge(Rx), r = Up === 0 || Up > n ? Up : n;
			n = V.T;
			var i = Jf.p;
			try {
				Jf.p = r, V.T = null;
				var a = Vx;
				Vx = null, r = Ix;
				var o = Rx;
				if (Fx = kx, Lx = Ix = null, Rx = 0, (Wb & (Fb | Ib)) !== Pb) throw Error("Cannot flush passive effects while already rendering.");
				Xn(o), Yx = !0, Xx = !1;
				var s = 0;
				if (C_ = null, s = Sp(), Wx === Ox) lr(S_, s, $_);
				else {
					var c = S_, l = s, u = Wx === Dx;
					!xg || l <= c || (Cx ? Cx.run(console.timeStamp.bind(console, u ? "Waiting for Paint" : "Waiting", c, l, U, H, "secondary-light")) : console.timeStamp(u ? "Waiting for Paint" : "Waiting", c, l, U, H, "secondary-light"));
				}
				c = Wb, Wb |= Ib;
				var d = r.current;
				hi(), Jc(d);
				var f = r.current;
				d = Bx, hi(), Bc(r, f, o, a, d), Wl(r), Wb = c;
				var p = Sp();
				if (f = s, d = Cx, C_ === null ? !xg || p <= f || (d ? d.run(console.timeStamp.bind(console, "Remaining Effects", f, p, U, H, "secondary-dark")) : console.timeStamp("Remaining Effects", f, p, U, H, "secondary-dark")) : cr(f, p, C_, !0, d), ll(o, p), L(0, !1), Xx ? r === $x ? Qx++ : (Qx = 0, $x = r) : Qx = 0, Xx = Yx = !1, Mp && typeof Mp.onPostCommitFiberRoot == "function") try {
					Mp.onPostCommitFiberRoot(jp, r);
				} catch (e) {
					Np || (Np = !0, console.error("React instrumentation encountered an error: %o", e));
				}
				var m = r.current.stateNode;
				return m.effectDuration = 0, m.passiveEffectDuration = 0, !0;
			} finally {
				Jf.p = i, V.T = n, Ml(e, t);
			}
		}
		function Fl(e, t, n) {
			t = jr(n, t), Ei(t), t = os(e.stateNode, t, 2), e = na(e, t, 2), e !== null && (Le(e, 2), Yl(e));
		}
		function Il(e, t, n) {
			if (eS = !1, e.tag === 3) Fl(e, e, n);
			else {
				for (; t !== null;) {
					if (t.tag === 3) {
						Fl(t, e, n);
						return;
					}
					if (t.tag === 1) {
						var r = t.stateNode;
						if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (wx === null || !wx.has(r))) {
							e = jr(n, e), Ei(e), n = ss(2), r = na(t, n, 2), r !== null && (cs(n, r, t, e), Le(r, 2), Yl(r));
							return;
						}
					}
					t = t.return;
				}
				console.error("Internal React error: Attempted to capture a commit phase error inside a detached tree. This indicates a bug in React. Potential causes include deleting the same fiber more than once, committing an already-finished tree, or an inconsistent return pointer.\n\nError message:\n\n%s", n);
			}
		}
		function Ll(e, t, n) {
			var r = e.pingCache;
			if (r === null) {
				r = e.pingCache = new Nb();
				var i = /* @__PURE__ */ new Set();
				r.set(t, i);
			} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
			i.has(n) || (ox = !0, i.add(n), r = Rl.bind(null, e, t, n), Pp && Kl(e, n), t.then(r, r));
		}
		function Rl(e, t, n) {
			var r = e.pingCache;
			r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, n & 127 ? 0 > A_ && (k_ = A_ = g_(), j_ = __("Promise Resolved"), M_ = y_) : n & 4194048 && 0 > V_ && (z_ = V_ = g_(), U_ = __("Promise Resolved"), H_ = y_), $c() && V.actQueue === null && console.error("A suspended resource finished loading inside a test, but the event was not wrapped in act(...).\n\nWhen testing, code that resolves suspended data should be wrapped into act(...):\n\nact(() => {\n  /* finish loading suspended data */\n});\n/* assert on the output */\n\nThis ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act"), Gb === e && ($ & n) === n && (cx === Vb || cx === Bb && ($ & 62914560) === $ && Sp() - _x < yx ? (Wb & Fb) === Pb && ul(e, 0) : dx |= n, px === $ && (px = 0)), Yl(e);
		}
		function zl(e, t) {
			t === 0 && (t = Fe()), e = pr(e, t), e !== null && (Le(e, t), Yl(e));
		}
		function Bl(e) {
			var t = e.memoizedState, n = 0;
			t !== null && (n = t.retryLane), zl(e, n);
		}
		function Vl(e, t) {
			var n = 0;
			switch (e.tag) {
				case 31:
				case 13:
					var r = e.stateNode, i = e.memoizedState;
					i !== null && (n = i.retryLane);
					break;
				case 19:
					r = e.stateNode;
					break;
				case 22:
					r = e.stateNode._retryCache;
					break;
				default: throw Error("Pinged unknown suspense boundary type. This is probably a bug in React.");
			}
			r !== null && r.delete(t), zl(e, n);
		}
		function Hl(e, t, n) {
			if (t.subtreeFlags & 67117056) for (t = t.child; t !== null;) {
				var r = e, i = t, a = i.type === Pf;
				a = n || a, i.tag === 22 ? i.memoizedState === null && (a && i.flags & 8192 ? k(i, Ul, r, i) : i.subtreeFlags & 67108864 && k(i, Hl, r, i, a)) : i.flags & 67108864 ? a && k(i, Ul, r, i) : Hl(r, i, a), t = t.sibling;
			}
		}
		function Ul(e, t) {
			ke(!0);
			try {
				Nc(t), Xc(t), Fc(e, t.alternate, t, !1), Hc(e, t, 0, null, !1, 0);
			} finally {
				ke(!1);
			}
		}
		function Wl(e) {
			var t = !0;
			e.current.mode & (Rg | zg) || (t = !1), Hl(e, e.current, t);
		}
		function Gl(e) {
			if ((Wb & Fb) === Pb) {
				var t = e.tag;
				if (t === 3 || t === 1 || t === 0 || t === 11 || t === 14 || t === 15) {
					if (t = T(e) || "ReactComponent", tS !== null) {
						if (tS.has(t)) return;
						tS.add(t);
					} else tS = new Set([t]);
					k(e, function() {
						console.error("Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously tries to update the component. Move this work to useEffect instead.");
					});
				}
			}
		}
		function Kl(e, t) {
			Pp && e.memoizedUpdaters.forEach(function(n) {
				Ue(e, n, t);
			});
		}
		function ql(e, t) {
			var n = V.actQueue;
			return n === null ? vp(e, t) : (n.push(t), iS);
		}
		function Jl(e) {
			$c() && V.actQueue === null && k(e, function() {
				console.error("An update to %s inside a test was not wrapped in act(...).\n\nWhen testing, code that causes React state updates should be wrapped into act(...):\n\nact(() => {\n  /* fire events that update state */\n});\n/* assert on the output */\n\nThis ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act", T(e));
			});
		}
		function Yl(e) {
			e !== oS && e.next === null && (oS === null ? aS = oS = e : oS = oS.next = e), lS = !0, V.actQueue === null ? sS || (sS = !0, nu()) : cS || (cS = !0, nu());
		}
		function L(e, t) {
			if (!uS && lS) {
				uS = !0;
				do
					for (var n = !1, r = aS; r !== null;) {
						if (!t) if (e !== 0) {
							var i = r.pendingLanes;
							if (i === 0) var a = 0;
							else {
								var o = r.suspendedLanes, s = r.pingedLanes;
								a = (1 << 31 - Fp(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
							}
							a !== 0 && (n = !0, eu(r, a));
						} else a = $, a = Me(r, r === Gb ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== eC), !(a & 3) || Ne(r, a) || (n = !0, eu(r, a));
						r = r.next;
					}
				while (n);
				uS = !1;
			}
		}
		function Xl() {
			ZS = window.event, Zl();
		}
		function Zl() {
			lS = cS = sS = !1;
			var e = 0;
			dS !== 0 && Wu() && (e = dS);
			for (var t = Sp(), n = null, r = aS; r !== null;) {
				var i = r.next, a = Ql(r, t);
				a === 0 ? (r.next = null, n === null ? aS = i : n.next = i, i === null && (oS = n)) : (n = r, (e !== 0 || a & 3) && (lS = !0)), r = i;
			}
			Fx !== kx && Fx !== Px || L(e, !1), dS !== 0 && (dS = 0);
		}
		function Ql(e, t) {
			for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
				var o = 31 - Fp(a), s = 1 << o, c = i[o];
				c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = Pe(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
			}
			if (t = Gb, n = $, n = Me(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== eC), r = e.callbackNode, n === 0 || e === t && (nx === Jb || nx === tx) || e.cancelPendingCommit !== null) return r !== null && tu(r), e.callbackNode = null, e.callbackPriority = 0;
			if (!(n & 3) || Ne(e, n)) {
				if (t = n & -n, t !== e.callbackPriority || V.actQueue !== null && r !== fS) tu(r);
				else return t;
				switch (Ge(n)) {
					case Vp:
					case Hp:
						n = Tp;
						break;
					case Up:
						n = Ep;
						break;
					case Wp:
						n = Op;
						break;
					default: n = Ep;
				}
				return r = $l.bind(null, e), V.actQueue === null ? n = vp(n, r) : (V.actQueue.push(r), n = fS), e.callbackPriority = t, e.callbackNode = n, t;
			}
			return r !== null && tu(r), e.callbackPriority = 2, e.callbackNode = null, 2;
		}
		function $l(e, t) {
			if (rv = nv = !1, ZS = window.event, Fx !== kx && Fx !== Px) return e.callbackNode = null, e.callbackPriority = 0, null;
			var n = e.callbackNode;
			if (Wx === Tx && (Wx = Dx), Nl() && e.callbackNode !== n) return null;
			var r = $;
			return r = Me(e, e === Gb ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== eC), r === 0 ? null : (rl(e, r, t), Ql(e, Sp()), e.callbackNode != null && e.callbackNode === n ? $l.bind(null, e) : null);
		}
		function eu(e, t) {
			if (Nl()) return null;
			nv = rv, rv = !1, rl(e, t, !0);
		}
		function tu(e) {
			e !== fS && e !== null && yp(e);
		}
		function nu() {
			V.actQueue !== null && V.actQueue.push(function() {
				return Zl(), null;
			}), nC(function() {
				(Wb & (Fb | Ib)) === Pb ? Zl() : vp(wp, Xl);
			});
		}
		function ru() {
			if (dS === 0) {
				var e = ov;
				e === 0 && (e = Rp, Rp <<= 1, !(Rp & 261888) && (Rp = 256)), dS = e;
			}
			return dS;
		}
		function iu(e) {
			return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : (A(e, "action"), on("" + e));
		}
		function au(e, t) {
			var n = t.ownerDocument.createElement("input");
			return n.name = t.name, n.value = t.value, e.id && n.setAttribute("form", e.id), t.parentNode.insertBefore(n, t), e = new FormData(e), n.parentNode.removeChild(n), e;
		}
		function ou(e, t, n, r, i) {
			if (t === "submit" && n && n.stateNode === i) {
				var a = iu((i[qp] || null).action), o = r.submitter;
				o && (t = (t = o[qp] || null) ? iu(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
				var s = new sh("action", "action", null, r, i);
				e.push({
					event: s,
					listeners: [{
						instance: null,
						listener: function() {
							if (r.defaultPrevented) {
								if (dS !== 0) {
									var e = o ? au(i, o) : new FormData(i), t = {
										pending: !0,
										data: e,
										method: i.method,
										action: a
									};
									Object.freeze(t), No(n, t, null, e);
								}
							} else typeof a == "function" && (s.preventDefault(), e = o ? au(i, o) : new FormData(i), t = {
								pending: !0,
								data: e,
								method: i.method,
								action: a
							}, Object.freeze(t), No(n, t, a, e));
						},
						currentTarget: i
					}]
				});
			}
		}
		function su(e, t, n) {
			e.currentTarget = n;
			try {
				t(e);
			} catch (e) {
				fg(e);
			}
			e.currentTarget = null;
		}
		function cu(e, t) {
			t = (t & 4) != 0;
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				a: {
					var i = void 0, a = r.event;
					if (r = r.listeners, t) for (var o = r.length - 1; 0 <= o; o--) {
						var s = r[o], c = s.instance, l = s.currentTarget;
						if (s = s.listener, c !== i && a.isPropagationStopped()) break a;
						c === null ? su(a, s, l) : k(c, su, a, s, l), i = c;
					}
					else for (o = 0; o < r.length; o++) {
						if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== i && a.isPropagationStopped()) break a;
						c === null ? su(a, s, l) : k(c, su, a, s, l), i = c;
					}
				}
			}
		}
		function R(e, t) {
			mS.has(e) || console.error("Did not expect a listenToNonDelegatedEvent() call for \"%s\". This is a bug in React. Please file an issue.", e);
			var n = t[Yp];
			n === void 0 && (n = t[Yp] = /* @__PURE__ */ new Set());
			var r = e + "__bubble";
			n.has(r) || (du(t, e, 2, !1), n.add(r));
		}
		function lu(e, t, n) {
			mS.has(e) && !t && console.error("Did not expect a listenToNativeEvent() call for \"%s\" in the bubble phase. This is a bug in React. Please file an issue.", e);
			var r = 0;
			t && (r |= 4), du(n, e, r, t);
		}
		function uu(e) {
			if (!e[hS]) {
				e[hS] = !0, em.forEach(function(t) {
					t !== "selectionchange" && (mS.has(t) || lu(t, !1, e), lu(t, !0, e));
				});
				var t = e.nodeType === 9 ? e : e.ownerDocument;
				t === null || t[hS] || (t[hS] = !0, lu("selectionchange", !1, t));
			}
		}
		function du(e, t, n, r) {
			switch (ff(t)) {
				case Vp:
					var i = sf;
					break;
				case Hp:
					i = cf;
					break;
				default: i = lf;
			}
			n = i.bind(null, t, n, e), i = void 0, !th || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
				capture: !0,
				passive: i
			}) : i === void 0 ? e.addEventListener(t, n, !1) : e.addEventListener(t, n, { passive: i });
		}
		function fu(e, t, n, r, i) {
			var a = r;
			if (!(t & 1) && !(t & 2) && r !== null) a: for (;;) {
				if (r === null) return;
				var o = r.tag;
				if (o === 3 || o === 4) {
					var s = r.stateNode.containerInfo;
					if (s === i) break;
					if (o === 4) for (o = r.return; o !== null;) {
						var c = o.tag;
						if ((c === 3 || c === 4) && o.stateNode.containerInfo === i) return;
						o = o.return;
					}
					for (; s !== null;) {
						if (o = Ye(s), o === null) return;
						if (c = o.tag, c === 5 || c === 6 || c === 26 || c === 27) {
							r = a = o;
							continue a;
						}
						s = s.parentNode;
					}
				}
				r = r.return;
			}
			un(function() {
				var r = a, i = cn(n), o = [];
				a: {
					var s = og.get(e);
					if (s !== void 0) {
						var c = sh, l = e;
						switch (e) {
							case "keypress": if (pn(n) === 0) break a;
							case "keydown":
							case "keyup":
								c = wh;
								break;
							case "focusin":
								l = "focus", c = gh;
								break;
							case "focusout":
								l = "blur", c = gh;
								break;
							case "beforeblur":
							case "afterblur":
								c = gh;
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
								c = mh;
								break;
							case "drag":
							case "dragend":
							case "dragenter":
							case "dragexit":
							case "dragleave":
							case "dragover":
							case "dragstart":
							case "drop":
								c = hh;
								break;
							case "touchcancel":
							case "touchend":
							case "touchmove":
							case "touchstart":
								c = Eh;
								break;
							case $h:
							case eg:
							case tg:
								c = _h;
								break;
							case ag:
								c = Dh;
								break;
							case "scroll":
							case "scrollend":
								c = lh;
								break;
							case "wheel":
								c = Oh;
								break;
							case "copy":
							case "cut":
							case "paste":
								c = vh;
								break;
							case "gotpointercapture":
							case "lostpointercapture":
							case "pointercancel":
							case "pointerdown":
							case "pointermove":
							case "pointerout":
							case "pointerover":
							case "pointerup":
								c = Th;
								break;
							case "toggle":
							case "beforetoggle": c = kh;
						}
						var u = (t & 4) != 0, d = !u && (e === "scroll" || e === "scrollend"), f = u ? s === null ? null : s + "Capture" : s;
						u = [];
						for (var p = r, m; p !== null;) {
							var h = p;
							if (m = h.stateNode, h = h.tag, h !== 5 && h !== 26 && h !== 27 || m === null || f === null || (h = dn(p, f), h != null && u.push(pu(p, h, m))), d) break;
							p = p.return;
						}
						0 < u.length && (s = new c(s, l, null, n, i), o.push({
							event: s,
							listeners: u
						}));
					}
				}
				if (!(t & 7)) {
					a: {
						if (s = e === "mouseover" || e === "pointerover", c = e === "mouseout" || e === "pointerout", s && n !== Xm && (l = n.relatedTarget || n.fromElement) && (Ye(l) || l[Jp])) break a;
						if ((c || s) && (s = i.window === i ? i : (s = i.ownerDocument) ? s.defaultView || s.parentWindow : window, c ? (l = n.relatedTarget || n.toElement, c = r, l = l ? Ye(l) : null, l !== null && (d = x(l), u = l.tag, l !== d || u !== 5 && u !== 27 && u !== 6) && (l = null)) : (c = null, l = r), c !== l)) {
							if (u = mh, h = "onMouseLeave", f = "onMouseEnter", p = "mouse", (e === "pointerout" || e === "pointerover") && (u = Th, h = "onPointerLeave", f = "onPointerEnter", p = "pointer"), d = c == null ? s : Ze(c), m = l == null ? s : Ze(l), s = new u(h, p + "leave", c, n, i), s.target = d, s.relatedTarget = m, h = null, Ye(i) === r && (u = new u(f, p + "enter", l, n, i), u.target = m, u.relatedTarget = d, h = u), d = h, c && l) b: {
								for (u = hu, f = c, p = l, m = 0, h = f; h; h = u(h)) m++;
								h = 0;
								for (var g = p; g; g = u(g)) h++;
								for (; 0 < m - h;) f = u(f), m--;
								for (; 0 < h - m;) p = u(p), h--;
								for (; m--;) {
									if (f === p || p !== null && f === p.alternate) {
										u = f;
										break b;
									}
									f = u(f), p = u(p);
								}
								u = null;
							}
							else u = null;
							c !== null && gu(o, s, c, u, !1), l !== null && d !== null && gu(o, d, l, u, !0);
						}
					}
					a: {
						if (s = r ? Ze(r) : window, c = s.nodeName && s.nodeName.toLowerCase(), c === "select" || c === "input" && s.type === "file") var _ = On;
						else if (Cn(s)) if (Uh) _ = Pn;
						else {
							_ = Mn;
							var v = jn;
						}
						else c = s.nodeName, !c || c.toLowerCase() !== "input" || s.type !== "checkbox" && s.type !== "radio" ? r && $t(r.elementType) && (_ = On) : _ = Nn;
						if (_ &&= _(e, r)) {
							Tn(o, _, n, i);
							break a;
						}
						v && v(e, s, r), e === "focusout" && r && s.type === "number" && r.memoizedProps.value != null && vt(s, "number", s.value);
					}
					switch (v = r ? Ze(r) : window, e) {
						case "focusin":
							(Cn(v) || v.contentEditable === "true") && (Kh = v, qh = r, Jh = null);
							break;
						case "focusout":
							Jh = qh = Kh = null;
							break;
						case "mousedown":
							Yh = !0;
							break;
						case "contextmenu":
						case "mouseup":
						case "dragend":
							Yh = !1, Hn(o, n, i);
							break;
						case "selectionchange": if (Gh) break;
						case "keydown":
						case "keyup": Hn(o, n, i);
					}
					var y;
					if (Mh) b: {
						switch (e) {
							case "compositionstart":
								var b = "onCompositionStart";
								break b;
							case "compositionend":
								b = "onCompositionEnd";
								break b;
							case "compositionupdate":
								b = "onCompositionUpdate";
								break b;
						}
						b = void 0;
					}
					else zh ? yn(e, n) && (b = "onCompositionEnd") : e === "keydown" && n.keyCode === jh && (b = "onCompositionStart");
					b && (Fh && n.locale !== "ko" && (zh || b !== "onCompositionStart" ? b === "onCompositionEnd" && zh && (y = fn()) : (rh = i, ih = "value" in rh ? rh.value : rh.textContent, zh = !0)), v = mu(r, b), 0 < v.length && (b = new yh(b, e, null, n, i), o.push({
						event: b,
						listeners: v
					}), y ? b.data = y : (y = bn(n), y !== null && (b.data = y)))), (y = Ph ? xn(e, n) : Sn(e, n)) && (b = mu(r, "onBeforeInput"), 0 < b.length && (v = new bh("onBeforeInput", "beforeinput", null, n, i), o.push({
						event: v,
						listeners: b
					}), v.data = y)), ou(o, e, r, n, i);
				}
				cu(o, t);
			});
		}
		function pu(e, t, n) {
			return {
				instance: e,
				listener: t,
				currentTarget: n
			};
		}
		function mu(e, t) {
			for (var n = t + "Capture", r = []; e !== null;) {
				var i = e, a = i.stateNode;
				if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = dn(e, n), i != null && r.unshift(pu(e, i, a)), i = dn(e, t), i != null && r.push(pu(e, i, a))), e.tag === 3) return r;
				e = e.return;
			}
			return [];
		}
		function hu(e) {
			if (e === null) return null;
			do
				e = e.return;
			while (e && e.tag !== 5 && e.tag !== 27);
			return e || null;
		}
		function gu(e, t, n, r, i) {
			for (var a = t._reactName, o = []; n !== null && n !== r;) {
				var s = n, c = s.alternate, l = s.stateNode;
				if (s = s.tag, c !== null && c === r) break;
				s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = dn(n, a), l != null && o.unshift(pu(n, l, c))) : i || (l = dn(n, a), l != null && o.push(pu(n, l, c)))), n = n.return;
			}
			o.length !== 0 && e.push({
				event: t,
				listeners: o
			});
		}
		function _u(e, t) {
			nn(e, t), e !== "input" && e !== "textarea" && e !== "select" || t == null || t.value !== null || Um || (Um = !0, e === "select" && t.multiple ? console.error("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", e) : console.error("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", e));
			var n = {
				registrationNameDependencies: tm,
				possibleRegistrationNames: nm
			};
			$t(e) || typeof t.is == "string" || an(e, t, n), t.contentEditable && !t.suppressContentEditableWarning && t.children != null && console.error("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional.");
		}
		function vu(e, t, n, r) {
			t !== n && (n = Su(n), Su(t) !== n && (r[e] = t));
		}
		function yu(e, t, n) {
			t.forEach(function(t) {
				n[Ou(t)] = t === "style" ? ku(e) : e.getAttribute(t);
			});
		}
		function bu(e, t) {
			!1 === t ? console.error("Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", e, e, e) : console.error("Expected `%s` listener to be a function, instead got a value of `%s` type.", e, typeof t);
		}
		function xu(e, t) {
			return e = e.namespaceURI === Fm || e.namespaceURI === Im ? e.ownerDocument.createElementNS(e.namespaceURI, e.tagName) : e.ownerDocument.createElement(e.tagName), e.innerHTML = t, e.innerHTML;
		}
		function Su(e) {
			return we(e) && (console.error("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before using it here.", Ce(e)), Te(e)), (typeof e == "string" ? e : "" + e).replace(wS, "\n").replace(TS, "");
		}
		function Cu(e, t) {
			return t = Su(t), Su(e) === t;
		}
		function wu(e, t, n, r, i, a) {
			switch (n) {
				case "children":
					typeof r == "string" ? (Jt(r, t, !1), t === "body" || t === "textarea" && r === "" || Yt(e, r)) : (typeof r == "number" || typeof r == "bigint") && (Jt("" + r, t, !1), t !== "body" && Yt(e, "" + r));
					break;
				case "className":
					ot(e, "class", r);
					break;
				case "tabIndex":
					ot(e, "tabindex", r);
					break;
				case "dir":
				case "role":
				case "viewBox":
				case "width":
				case "height":
					ot(e, n, r);
					break;
				case "style":
					Qt(e, r, a);
					break;
				case "data": if (t !== "object") {
					ot(e, "data", r);
					break;
				}
				case "src":
				case "href":
					if (r === "" && (t !== "a" || n !== "href")) {
						console.error(n === "src" ? "An empty string (\"\") was passed to the %s attribute. This may cause the browser to download the whole page again over the network. To fix this, either do not render the element at all or pass null to %s instead of an empty string." : "An empty string (\"\") was passed to the %s attribute. To fix this, either do not render the element at all or pass null to %s instead of an empty string.", n, n), e.removeAttribute(n);
						break;
					}
					if (r == null || typeof r == "function" || typeof r == "symbol" || typeof r == "boolean") {
						e.removeAttribute(n);
						break;
					}
					A(r, n), r = on("" + r), e.setAttribute(n, r);
					break;
				case "action":
				case "formAction":
					if (r != null && (t === "form" ? n === "formAction" ? console.error("You can only pass the formAction prop to <input> or <button>. Use the action prop on <form>.") : typeof r == "function" && (i.encType == null && i.method == null || xS || (xS = !0, console.error("Cannot specify a encType or method for a form that specifies a function as the action. React provides those automatically. They will get overridden.")), i.target == null || bS || (bS = !0, console.error("Cannot specify a target for a form that specifies a function as the action. The function will always be executed in the same window."))) : t === "input" || t === "button" ? n === "action" ? console.error("You can only pass the action prop to <form>. Use the formAction prop on <input> or <button>.") : t !== "input" || i.type === "submit" || i.type === "image" || vS ? t !== "button" || i.type == null || i.type === "submit" || vS ? typeof r == "function" && (i.name == null || yS || (yS = !0, console.error("Cannot specify a \"name\" prop for a button that specifies a function as a formAction. React needs it to encode which action should be invoked. It will get overridden.")), i.formEncType == null && i.formMethod == null || xS || (xS = !0, console.error("Cannot specify a formEncType or formMethod for a button that specifies a function as a formAction. React provides those automatically. They will get overridden.")), i.formTarget == null || bS || (bS = !0, console.error("Cannot specify a formTarget for a button that specifies a function as a formAction. The function will always be executed in the same window."))) : (vS = !0, console.error("A button can only specify a formAction along with type=\"submit\" or no type.")) : (vS = !0, console.error("An input can only specify a formAction along with type=\"submit\" or type=\"image\".")) : console.error(n === "action" ? "You can only pass the action prop to <form>." : "You can only pass the formAction prop to <input> or <button>.")), typeof r == "function") {
						e.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
						break;
					} else typeof a == "function" && (n === "formAction" ? (t !== "input" && wu(e, t, "name", i.name, i, null), wu(e, t, "formEncType", i.formEncType, i, null), wu(e, t, "formMethod", i.formMethod, i, null), wu(e, t, "formTarget", i.formTarget, i, null)) : (wu(e, t, "encType", i.encType, i, null), wu(e, t, "method", i.method, i, null), wu(e, t, "target", i.target, i, null)));
					if (r == null || typeof r == "symbol" || typeof r == "boolean") {
						e.removeAttribute(n);
						break;
					}
					A(r, n), r = on("" + r), e.setAttribute(n, r);
					break;
				case "onClick":
					r != null && (typeof r != "function" && bu(n, r), e.onclick = sn);
					break;
				case "onScroll":
					r != null && (typeof r != "function" && bu(n, r), R("scroll", e));
					break;
				case "onScrollEnd":
					r != null && (typeof r != "function" && bu(n, r), R("scrollend", e));
					break;
				case "dangerouslySetInnerHTML":
					if (r != null) {
						if (typeof r != "object" || !("__html" in r)) throw Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://react.dev/link/dangerously-set-inner-html for more information.");
						if (n = r.__html, n != null) {
							if (i.children != null) throw Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
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
					A(r, n), n = on("" + r), e.setAttributeNS(ES, "xlink:href", n);
					break;
				case "contentEditable":
				case "spellCheck":
				case "draggable":
				case "value":
				case "autoReverse":
				case "externalResourcesRequired":
				case "focusable":
				case "preserveAlpha":
					r != null && typeof r != "function" && typeof r != "symbol" ? (A(r, n), e.setAttribute(n, "" + r)) : e.removeAttribute(n);
					break;
				case "inert": r !== "" || CS[n] || (CS[n] = !0, console.error("Received an empty string for a boolean attribute `%s`. This will treat the attribute as if it were false. Either pass `false` to silence this warning, or pass `true` if you used an empty string in earlier versions of React to indicate this attribute is true.", n));
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
					!0 === r ? e.setAttribute(n, "") : !1 !== r && r != null && typeof r != "function" && typeof r != "symbol" ? (A(r, n), e.setAttribute(n, r)) : e.removeAttribute(n);
					break;
				case "cols":
				case "rows":
				case "size":
				case "span":
					r != null && typeof r != "function" && typeof r != "symbol" && !isNaN(r) && 1 <= r ? (A(r, n), e.setAttribute(n, r)) : e.removeAttribute(n);
					break;
				case "rowSpan":
				case "start":
					r == null || typeof r == "function" || typeof r == "symbol" || isNaN(r) ? e.removeAttribute(n) : (A(r, n), e.setAttribute(n, r));
					break;
				case "popover":
					R("beforetoggle", e), R("toggle", e), at(e, "popover", r);
					break;
				case "xlinkActuate":
					st(e, ES, "xlink:actuate", r);
					break;
				case "xlinkArcrole":
					st(e, ES, "xlink:arcrole", r);
					break;
				case "xlinkRole":
					st(e, ES, "xlink:role", r);
					break;
				case "xlinkShow":
					st(e, ES, "xlink:show", r);
					break;
				case "xlinkTitle":
					st(e, ES, "xlink:title", r);
					break;
				case "xlinkType":
					st(e, ES, "xlink:type", r);
					break;
				case "xmlBase":
					st(e, DS, "xml:base", r);
					break;
				case "xmlLang":
					st(e, DS, "xml:lang", r);
					break;
				case "xmlSpace":
					st(e, DS, "xml:space", r);
					break;
				case "is":
					a != null && console.error("Cannot update the \"is\" prop after it has been initialized."), at(e, "is", r);
					break;
				case "innerText":
				case "textContent": break;
				case "popoverTarget": SS || typeof r != "object" || !r || (SS = !0, console.error("The `popoverTarget` prop expects the ID of an Element as a string. Received %s instead.", r));
				default: !(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N" ? (n = en(n), at(e, n, r)) : tm.hasOwnProperty(n) && r != null && typeof r != "function" && bu(n, r);
			}
		}
		function Tu(e, t, n, r, i, a) {
			switch (n) {
				case "style":
					Qt(e, r, a);
					break;
				case "dangerouslySetInnerHTML":
					if (r != null) {
						if (typeof r != "object" || !("__html" in r)) throw Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://react.dev/link/dangerously-set-inner-html for more information.");
						if (n = r.__html, n != null) {
							if (i.children != null) throw Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
							e.innerHTML = n;
						}
					}
					break;
				case "children":
					typeof r == "string" ? Yt(e, r) : (typeof r == "number" || typeof r == "bigint") && Yt(e, "" + r);
					break;
				case "onScroll":
					r != null && (typeof r != "function" && bu(n, r), R("scroll", e));
					break;
				case "onScrollEnd":
					r != null && (typeof r != "function" && bu(n, r), R("scrollend", e));
					break;
				case "onClick":
					r != null && (typeof r != "function" && bu(n, r), e.onclick = sn);
					break;
				case "suppressContentEditableWarning":
				case "suppressHydrationWarning":
				case "innerHTML":
				case "ref": break;
				case "innerText":
				case "textContent": break;
				default: if (tm.hasOwnProperty(n)) r != null && typeof r != "function" && bu(n, r);
				else a: {
					if (n[0] === "o" && n[1] === "n" && (i = n.endsWith("Capture"), t = n.slice(2, i ? n.length - 7 : void 0), a = e[qp] || null, a = a == null ? null : a[n], typeof a == "function" && e.removeEventListener(t, a, i), typeof r == "function")) {
						typeof a != "function" && a !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(t, r, i);
						break a;
					}
					n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : at(e, n, r);
				}
			}
		}
		function Eu(e, t, n) {
			switch (_u(t, n), t) {
				case "div":
				case "span":
				case "svg":
				case "path":
				case "a":
				case "g":
				case "p":
				case "li": break;
				case "img":
					R("error", e), R("load", e);
					var r = !1, i = !1, a;
					for (a in n) if (n.hasOwnProperty(a)) {
						var o = n[a];
						if (o != null) switch (a) {
							case "src":
								r = !0;
								break;
							case "srcSet":
								i = !0;
								break;
							case "children":
							case "dangerouslySetInnerHTML": throw Error(t + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
							default: wu(e, t, a, o, n, null);
						}
					}
					i && wu(e, t, "srcSet", n.srcSet, n, null), r && wu(e, t, "src", n.src, n, null);
					return;
				case "input":
					nt("input", n), R("invalid", e);
					var s = a = o = i = null, c = null, l = null;
					for (r in n) if (n.hasOwnProperty(r)) {
						var u = n[r];
						if (u != null) switch (r) {
							case "name":
								i = u;
								break;
							case "type":
								o = u;
								break;
							case "checked":
								c = u;
								break;
							case "defaultChecked":
								l = u;
								break;
							case "value":
								a = u;
								break;
							case "defaultValue":
								s = u;
								break;
							case "children":
							case "dangerouslySetInnerHTML":
								if (u != null) throw Error(t + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
								break;
							default: wu(e, t, r, u, n, null);
						}
					}
					ht(e, n), _t(e, a, s, c, l, o, i, !1);
					return;
				case "select":
					for (i in nt("select", n), R("invalid", e), r = o = a = null, n) if (n.hasOwnProperty(i) && (s = n[i], s != null)) switch (i) {
						case "value":
							a = s;
							break;
						case "defaultValue":
							o = s;
							break;
						case "multiple": r = s;
						default: wu(e, t, i, s, n, null);
					}
					St(e, n), t = a, n = o, e.multiple = !!r, t == null ? n != null && xt(e, !!r, n, !0) : xt(e, !!r, t, !1);
					return;
				case "textarea":
					for (o in nt("textarea", n), R("invalid", e), a = i = r = null, n) if (n.hasOwnProperty(o) && (s = n[o], s != null)) switch (o) {
						case "value":
							r = s;
							break;
						case "defaultValue":
							i = s;
							break;
						case "children":
							a = s;
							break;
						case "dangerouslySetInnerHTML":
							if (s != null) throw Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
							break;
						default: wu(e, t, o, s, n, null);
					}
					Ct(e, n), Tt(e, r, i, a);
					return;
				case "option":
					for (c in yt(e, n), n) if (n.hasOwnProperty(c) && (r = n[c], r != null)) switch (c) {
						case "selected":
							e.selected = r && typeof r != "function" && typeof r != "symbol";
							break;
						default: wu(e, t, c, r, n, null);
					}
					return;
				case "dialog":
					R("beforetoggle", e), R("toggle", e), R("cancel", e), R("close", e);
					break;
				case "iframe":
				case "object":
					R("load", e);
					break;
				case "video":
				case "audio":
					for (r = 0; r < pS.length; r++) R(pS[r], e);
					break;
				case "image":
					R("error", e), R("load", e);
					break;
				case "details":
					R("toggle", e);
					break;
				case "embed":
				case "source":
				case "link": R("error", e), R("load", e);
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
					for (l in n) if (n.hasOwnProperty(l) && (r = n[l], r != null)) switch (l) {
						case "children":
						case "dangerouslySetInnerHTML": throw Error(t + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
						default: wu(e, t, l, r, n, null);
					}
					return;
				default: if ($t(t)) {
					for (u in n) n.hasOwnProperty(u) && (r = n[u], r !== void 0 && Tu(e, t, u, r, n, void 0));
					return;
				}
			}
			for (s in n) n.hasOwnProperty(s) && (r = n[s], r != null && wu(e, t, s, r, n, null));
		}
		function Du(e, t, n, r) {
			switch (_u(t, r), t) {
				case "div":
				case "span":
				case "svg":
				case "path":
				case "a":
				case "g":
				case "p":
				case "li": break;
				case "input":
					var i = null, a = null, o = null, s = null, c = null, l = null, u = null;
					for (p in n) {
						var d = n[p];
						if (n.hasOwnProperty(p) && d != null) switch (p) {
							case "checked": break;
							case "value": break;
							case "defaultValue": c = d;
							default: r.hasOwnProperty(p) || wu(e, t, p, null, r, d);
						}
					}
					for (var f in r) {
						var p = r[f];
						if (d = n[f], r.hasOwnProperty(f) && (p != null || d != null)) switch (f) {
							case "type":
								a = p;
								break;
							case "name":
								i = p;
								break;
							case "checked":
								l = p;
								break;
							case "defaultChecked":
								u = p;
								break;
							case "value":
								o = p;
								break;
							case "defaultValue":
								s = p;
								break;
							case "children":
							case "dangerouslySetInnerHTML":
								if (p != null) throw Error(t + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
								break;
							default: p !== d && wu(e, t, f, p, r, d);
						}
					}
					t = n.type === "checkbox" || n.type === "radio" ? n.checked != null : n.value != null, r = r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null, t || !r || _S || (console.error("A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://react.dev/link/controlled-components"), _S = !0), !t || r || gS || (console.error("A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://react.dev/link/controlled-components"), gS = !0), gt(e, o, s, c, l, u, a, i);
					return;
				case "select":
					for (a in p = o = s = f = null, n) if (c = n[a], n.hasOwnProperty(a) && c != null) switch (a) {
						case "value": break;
						case "multiple": p = c;
						default: r.hasOwnProperty(a) || wu(e, t, a, null, r, c);
					}
					for (i in r) if (a = r[i], c = n[i], r.hasOwnProperty(i) && (a != null || c != null)) switch (i) {
						case "value":
							f = a;
							break;
						case "defaultValue":
							s = a;
							break;
						case "multiple": o = a;
						default: a !== c && wu(e, t, i, a, r, c);
					}
					r = s, t = o, n = p, f == null ? !!n != !!t && (r == null ? xt(e, !!t, t ? [] : "", !1) : xt(e, !!t, r, !0)) : xt(e, !!t, f, !1);
					return;
				case "textarea":
					for (s in p = f = null, n) if (i = n[s], n.hasOwnProperty(s) && i != null && !r.hasOwnProperty(s)) switch (s) {
						case "value": break;
						case "children": break;
						default: wu(e, t, s, null, r, i);
					}
					for (o in r) if (i = r[o], a = n[o], r.hasOwnProperty(o) && (i != null || a != null)) switch (o) {
						case "value":
							f = i;
							break;
						case "defaultValue":
							p = i;
							break;
						case "children": break;
						case "dangerouslySetInnerHTML":
							if (i != null) throw Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
							break;
						default: i !== a && wu(e, t, o, i, r, a);
					}
					wt(e, f, p);
					return;
				case "option":
					for (var m in n) if (f = n[m], n.hasOwnProperty(m) && f != null && !r.hasOwnProperty(m)) switch (m) {
						case "selected":
							e.selected = !1;
							break;
						default: wu(e, t, m, null, r, f);
					}
					for (c in r) if (f = r[c], p = n[c], r.hasOwnProperty(c) && f !== p && (f != null || p != null)) switch (c) {
						case "selected":
							e.selected = f && typeof f != "function" && typeof f != "symbol";
							break;
						default: wu(e, t, c, f, r, p);
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
					for (var h in n) f = n[h], n.hasOwnProperty(h) && f != null && !r.hasOwnProperty(h) && wu(e, t, h, null, r, f);
					for (l in r) if (f = r[l], p = n[l], r.hasOwnProperty(l) && f !== p && (f != null || p != null)) switch (l) {
						case "children":
						case "dangerouslySetInnerHTML":
							if (f != null) throw Error(t + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
							break;
						default: wu(e, t, l, f, r, p);
					}
					return;
				default: if ($t(t)) {
					for (var g in n) f = n[g], n.hasOwnProperty(g) && f !== void 0 && !r.hasOwnProperty(g) && Tu(e, t, g, void 0, r, f);
					for (u in r) f = r[u], p = n[u], !r.hasOwnProperty(u) || f === p || f === void 0 && p === void 0 || Tu(e, t, u, f, r, p);
					return;
				}
			}
			for (var _ in n) f = n[_], n.hasOwnProperty(_) && f != null && !r.hasOwnProperty(_) && wu(e, t, _, null, r, f);
			for (d in r) f = r[d], p = n[d], !r.hasOwnProperty(d) || f === p || f == null && p == null || wu(e, t, d, f, r, p);
		}
		function Ou(e) {
			switch (e) {
				case "class": return "className";
				case "for": return "htmlFor";
				default: return e;
			}
		}
		function ku(e) {
			var t = {};
			e = e.style;
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				t[r] = e.getPropertyValue(r);
			}
			return t;
		}
		function Au(e, t, n) {
			if (t != null && typeof t != "object") console.error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
			else {
				var r, i = r = "", a;
				for (a in t) if (t.hasOwnProperty(a)) {
					var o = t[a];
					o != null && typeof o != "boolean" && o !== "" && (a.indexOf("--") === 0 ? (Ee(o, a), r += i + a + ":" + ("" + o).trim()) : typeof o != "number" || o === 0 || Pm.has(a) ? (Ee(o, a), r += i + a.replace(wm, "-$1").toLowerCase().replace(Tm, "-ms-") + ":" + ("" + o).trim()) : r += i + a.replace(wm, "-$1").toLowerCase().replace(Tm, "-ms-") + ":" + o + "px", i = ";");
				}
				r ||= null, t = e.getAttribute("style"), t !== r && (r = Su(r), Su(t) !== r && (n.style = ku(e)));
			}
		}
		function ju(e, t, n, r, i, a) {
			if (i.delete(n), e = e.getAttribute(n), e === null) switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean": return;
			}
			else if (r != null) switch (typeof r) {
				case "function":
				case "symbol":
				case "boolean": break;
				default: if (A(r, t), e === "" + r) return;
			}
			vu(t, e, r, a);
		}
		function Mu(e, t, n, r, i, a) {
			if (i.delete(n), e = e.getAttribute(n), e === null) {
				switch (typeof r) {
					case "function":
					case "symbol": return;
				}
				if (!r) return;
			} else switch (typeof r) {
				case "function":
				case "symbol": break;
				default: if (r) return;
			}
			vu(t, e, r, a);
		}
		function Nu(e, t, n, r, i, a) {
			if (i.delete(n), e = e.getAttribute(n), e === null) switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol": return;
			}
			else if (r != null) switch (typeof r) {
				case "function":
				case "symbol": break;
				default: if (A(r, n), e === "" + r) return;
			}
			vu(t, e, r, a);
		}
		function Pu(e, t, n, r, i, a) {
			if (i.delete(n), e = e.getAttribute(n), e === null) switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean": return;
				default: if (isNaN(r)) return;
			}
			else if (r != null) switch (typeof r) {
				case "function":
				case "symbol":
				case "boolean": break;
				default: if (!isNaN(r) && (A(r, t), e === "" + r)) return;
			}
			vu(t, e, r, a);
		}
		function Fu(e, t, n, r, i, a) {
			if (i.delete(n), e = e.getAttribute(n), e === null) switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean": return;
			}
			else if (r != null) switch (typeof r) {
				case "function":
				case "symbol":
				case "boolean": break;
				default: if (A(r, t), n = on("" + r), e === n) return;
			}
			vu(t, e, r, a);
		}
		function Iu(e, t, n, r) {
			for (var i = {}, a = /* @__PURE__ */ new Set(), o = e.attributes, s = 0; s < o.length; s++) switch (o[s].name.toLowerCase()) {
				case "value": break;
				case "checked": break;
				case "selected": break;
				default: a.add(o[s].name);
			}
			if ($t(t)) {
				for (var c in n) if (n.hasOwnProperty(c)) {
					var l = n[c];
					if (l != null) {
						if (tm.hasOwnProperty(c)) typeof l != "function" && bu(c, l);
						else if (!0 !== n.suppressHydrationWarning) switch (c) {
							case "children":
								typeof l != "string" && typeof l != "number" || vu("children", e.textContent, l, i);
								continue;
							case "suppressContentEditableWarning":
							case "suppressHydrationWarning":
							case "defaultValue":
							case "defaultChecked":
							case "innerHTML":
							case "ref": continue;
							case "dangerouslySetInnerHTML":
								o = e.innerHTML, l = l ? l.__html : void 0, l != null && (l = xu(e, l), vu(c, o, l, i));
								continue;
							case "style":
								a.delete(c), Au(e, l, i);
								continue;
							case "offsetParent":
							case "offsetTop":
							case "offsetLeft":
							case "offsetWidth":
							case "offsetHeight":
							case "isContentEditable":
							case "outerText":
							case "outerHTML":
								a.delete(c.toLowerCase()), console.error("Assignment to read-only property will result in a no-op: `%s`", c);
								continue;
							case "className":
								a.delete("class"), o = it(e, "class", l), vu("className", o, l, i);
								continue;
							default: r.context === WS && t !== "svg" && t !== "math" ? a.delete(c.toLowerCase()) : a.delete(c), o = it(e, c, l), vu(c, o, l, i);
						}
					}
				}
			} else for (l in n) if (n.hasOwnProperty(l) && (c = n[l], c != null)) {
				if (tm.hasOwnProperty(l)) typeof c != "function" && bu(l, c);
				else if (!0 !== n.suppressHydrationWarning) switch (l) {
					case "children":
						typeof c != "string" && typeof c != "number" || vu("children", e.textContent, c, i);
						continue;
					case "suppressContentEditableWarning":
					case "suppressHydrationWarning":
					case "value":
					case "checked":
					case "selected":
					case "defaultValue":
					case "defaultChecked":
					case "innerHTML":
					case "ref": continue;
					case "dangerouslySetInnerHTML":
						o = e.innerHTML, c = c ? c.__html : void 0, c != null && (c = xu(e, c), o !== c && (i[l] = { __html: o }));
						continue;
					case "className":
						ju(e, l, "class", c, a, i);
						continue;
					case "tabIndex":
						ju(e, l, "tabindex", c, a, i);
						continue;
					case "style":
						a.delete(l), Au(e, c, i);
						continue;
					case "multiple":
						a.delete(l), vu(l, e.multiple, c, i);
						continue;
					case "muted":
						a.delete(l), vu(l, e.muted, c, i);
						continue;
					case "autoFocus":
						a.delete("autofocus"), vu(l, e.autofocus, c, i);
						continue;
					case "data": if (t !== "object") {
						a.delete(l), o = e.getAttribute("data"), vu(l, o, c, i);
						continue;
					}
					case "src":
					case "href":
						if (!(c !== "" || t === "a" && l === "href" || t === "object" && l === "data")) {
							console.error(l === "src" ? "An empty string (\"\") was passed to the %s attribute. This may cause the browser to download the whole page again over the network. To fix this, either do not render the element at all or pass null to %s instead of an empty string." : "An empty string (\"\") was passed to the %s attribute. To fix this, either do not render the element at all or pass null to %s instead of an empty string.", l, l);
							continue;
						}
						Fu(e, l, l, c, a, i);
						continue;
					case "action":
					case "formAction":
						if (o = e.getAttribute(l), typeof c == "function") {
							a.delete(l.toLowerCase()), l === "formAction" ? (a.delete("name"), a.delete("formenctype"), a.delete("formmethod"), a.delete("formtarget")) : (a.delete("enctype"), a.delete("method"), a.delete("target"));
							continue;
						} else if (o === OS) {
							a.delete(l.toLowerCase()), vu(l, "function", c, i);
							continue;
						}
						Fu(e, l, l.toLowerCase(), c, a, i);
						continue;
					case "xlinkHref":
						Fu(e, l, "xlink:href", c, a, i);
						continue;
					case "contentEditable":
						Nu(e, l, "contenteditable", c, a, i);
						continue;
					case "spellCheck":
						Nu(e, l, "spellcheck", c, a, i);
						continue;
					case "draggable":
					case "autoReverse":
					case "externalResourcesRequired":
					case "focusable":
					case "preserveAlpha":
						Nu(e, l, l, c, a, i);
						continue;
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
						Mu(e, l, l.toLowerCase(), c, a, i);
						continue;
					case "capture":
					case "download":
						a: {
							s = e;
							var u = o = l, d = i;
							if (a.delete(u), s = s.getAttribute(u), s === null) switch (typeof c) {
								case "undefined":
								case "function":
								case "symbol": break a;
								default: if (!1 === c) break a;
							}
							else if (c != null) switch (typeof c) {
								case "function":
								case "symbol": break;
								case "boolean":
									if (!0 === c && s === "") break a;
									break;
								default: if (A(c, o), s === "" + c) break a;
							}
							vu(o, s, c, d);
						}
						continue;
					case "cols":
					case "rows":
					case "size":
					case "span":
						a: {
							if (s = e, u = o = l, d = i, a.delete(u), s = s.getAttribute(u), s === null) switch (typeof c) {
								case "undefined":
								case "function":
								case "symbol":
								case "boolean": break a;
								default: if (isNaN(c) || 1 > c) break a;
							}
							else if (c != null) switch (typeof c) {
								case "function":
								case "symbol":
								case "boolean": break;
								default: if (!(isNaN(c) || 1 > c) && (A(c, o), s === "" + c)) break a;
							}
							vu(o, s, c, d);
						}
						continue;
					case "rowSpan":
						Pu(e, l, "rowspan", c, a, i);
						continue;
					case "start":
						Pu(e, l, l, c, a, i);
						continue;
					case "xHeight":
						ju(e, l, "x-height", c, a, i);
						continue;
					case "xlinkActuate":
						ju(e, l, "xlink:actuate", c, a, i);
						continue;
					case "xlinkArcrole":
						ju(e, l, "xlink:arcrole", c, a, i);
						continue;
					case "xlinkRole":
						ju(e, l, "xlink:role", c, a, i);
						continue;
					case "xlinkShow":
						ju(e, l, "xlink:show", c, a, i);
						continue;
					case "xlinkTitle":
						ju(e, l, "xlink:title", c, a, i);
						continue;
					case "xlinkType":
						ju(e, l, "xlink:type", c, a, i);
						continue;
					case "xmlBase":
						ju(e, l, "xml:base", c, a, i);
						continue;
					case "xmlLang":
						ju(e, l, "xml:lang", c, a, i);
						continue;
					case "xmlSpace":
						ju(e, l, "xml:space", c, a, i);
						continue;
					case "inert":
						c !== "" || CS[l] || (CS[l] = !0, console.error("Received an empty string for a boolean attribute `%s`. This will treat the attribute as if it were false. Either pass `false` to silence this warning, or pass `true` if you used an empty string in earlier versions of React to indicate this attribute is true.", l)), Mu(e, l, l, c, a, i);
						continue;
					default: if (!(2 < l.length) || l[0] !== "o" && l[0] !== "O" || l[1] !== "n" && l[1] !== "N") {
						s = en(l), o = !1, r.context === WS && t !== "svg" && t !== "math" ? a.delete(s.toLowerCase()) : (u = l.toLowerCase(), u = Rm.hasOwnProperty(u) && Rm[u] || null, u !== null && u !== l && (o = !0, a.delete(u)), a.delete(s));
						a: if (u = e, d = s, s = c, rt(d)) if (u.hasAttribute(d)) u = u.getAttribute(d), A(s, d), s = u === "" + s ? s : u;
						else {
							switch (typeof s) {
								case "function":
								case "symbol": break a;
								case "boolean": if (u = d.toLowerCase().slice(0, 5), u !== "data-" && u !== "aria-") break a;
							}
							s = s === void 0 ? void 0 : null;
						}
						else s = void 0;
						o || vu(l, s, c, i);
					}
				}
			}
			return 0 < a.size && !0 !== n.suppressHydrationWarning && yu(e, a, i), Object.keys(i).length === 0 ? null : i;
		}
		function Lu(e, t) {
			switch (e.length) {
				case 0: return "";
				case 1: return e[0];
				case 2: return e[0] + " " + t + " " + e[1];
				default: return e.slice(0, -1).join(", ") + ", " + t + " " + e[e.length - 1];
			}
		}
		function Ru(e) {
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
		function zu() {
			if (typeof performance.getEntriesByType == "function") {
				for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), r = 0; r < n.length; r++) {
					var i = n[r], a = i.transferSize, o = i.initiatorType, s = i.duration;
					if (a && s && Ru(o)) {
						for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
							var c = n[r], l = c.startTime;
							if (l > s) break;
							var u = c.transferSize, d = c.initiatorType;
							u && Ru(d) && (c = c.responseEnd, o += u * (c < s ? 1 : (s - l) / (c - l)));
						}
						if (--r, t += 8 * (a + o) / (i.duration / 1e3), e++, 10 < e) break;
					}
				}
				if (0 < e) return t / e / 1e6;
			}
			return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
		}
		function Bu(e) {
			return e.nodeType === 9 ? e : e.ownerDocument;
		}
		function Vu(e) {
			switch (e) {
				case Im: return GS;
				case Fm: return KS;
				default: return WS;
			}
		}
		function Hu(e, t) {
			if (e === WS) switch (t) {
				case "svg": return GS;
				case "math": return KS;
				default: return WS;
			}
			return e === GS && t === "foreignObject" ? WS : e;
		}
		function Uu(e, t) {
			return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
		}
		function Wu() {
			var e = window.event;
			return e && e.type === "popstate" ? e === XS ? !1 : (XS = e, !0) : (XS = null, !1);
		}
		function Gu() {
			var e = window.event;
			return e && e !== ZS ? e.type : null;
		}
		function Ku() {
			var e = window.event;
			return e && e !== ZS ? e.timeStamp : -1.1;
		}
		function qu(e) {
			setTimeout(function() {
				throw e;
			});
		}
		function Ju(e, t, n) {
			switch (t) {
				case "button":
				case "input":
				case "select":
				case "textarea":
					n.autoFocus && e.focus();
					break;
				case "img": n.src ? e.src = n.src : n.srcSet && (e.srcset = n.srcSet);
			}
		}
		function Yu() {}
		function Xu(e, t, n, r) {
			Du(e, t, n, r), e[qp] = r;
		}
		function Zu(e) {
			Yt(e, "");
		}
		function Qu(e, t, n) {
			e.nodeValue = n;
		}
		function $u(e) {
			if (!e.__reactWarnedAboutChildrenConflict) {
				var t = e[qp] || null;
				if (t !== null) {
					var n = Xe(e);
					n !== null && (typeof t.children == "string" || typeof t.children == "number" ? (e.__reactWarnedAboutChildrenConflict = !0, k(n, function() {
						console.error("Cannot use a ref on a React element as a container to `createRoot` or `createPortal` if that element also sets \"children\" text content using React. It should be a leaf with no children. Otherwise it's ambiguous which children should be used.");
					})) : t.dangerouslySetInnerHTML != null && (e.__reactWarnedAboutChildrenConflict = !0, k(n, function() {
						console.error("Cannot use a ref on a React element as a container to `createRoot` or `createPortal` if that element also sets \"dangerouslySetInnerHTML\" using React. It should be a leaf with no children. Otherwise it's ambiguous which children should be used.");
					})));
				}
			}
		}
		function ed(e) {
			return e === "head";
		}
		function td(e, t) {
			e.removeChild(t);
		}
		function nd(e, t) {
			(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e).removeChild(t);
		}
		function rd(e, t) {
			var n = t, r = 0;
			do {
				var i = n.nextSibling;
				if (e.removeChild(n), i && i.nodeType === 8) if (n = i.data, n === NS || n === jS) {
					if (r === 0) {
						e.removeChild(i), Sf(t);
						return;
					}
					r--;
				} else if (n === MS || n === PS || n === FS || n === IS || n === AS) r++;
				else if (n === LS) Od(e.ownerDocument.documentElement);
				else if (n === zS) {
					n = e.ownerDocument.head, Od(n);
					for (var a = n.firstChild; a;) {
						var o = a.nextSibling, s = a.nodeName;
						a[$p] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
					}
				} else n === RS && Od(e.ownerDocument.body);
				n = i;
			} while (n);
			Sf(t);
		}
		function id(e, t) {
			var n = e;
			e = 0;
			do {
				var r = n.nextSibling;
				if (n.nodeType === 1 ? t ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (t ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), r && r.nodeType === 8) if (n = r.data, n === NS) {
					if (e === 0) break;
					e--;
				} else n !== MS && n !== PS && n !== FS && n !== IS || e++;
				n = r;
			} while (n);
		}
		function ad(e) {
			id(e, !0);
		}
		function od(e) {
			e = e.style, typeof e.setProperty == "function" ? e.setProperty("display", "none", "important") : e.display = "none";
		}
		function sd(e) {
			e.nodeValue = "";
		}
		function cd(e) {
			id(e, !1);
		}
		function ld(e, t) {
			t = t[US], t = t != null && t.hasOwnProperty("display") ? t.display : null, e.style.display = t == null || typeof t == "boolean" ? "" : ("" + t).trim();
		}
		function ud(e, t) {
			e.nodeValue = t;
		}
		function dd(e) {
			var t = e.firstChild;
			for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
				var n = t;
				switch (t = t.nextSibling, n.nodeName) {
					case "HTML":
					case "HEAD":
					case "BODY":
						dd(n), Je(n);
						continue;
					case "SCRIPT":
					case "STYLE": continue;
					case "LINK": if (n.rel.toLowerCase() === "stylesheet") continue;
				}
				e.removeChild(n);
			}
		}
		function fd(e, t, n, r) {
			for (; e.nodeType === 1;) {
				var i = n;
				if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
					if (!r && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
				} else if (!r) if (t === "input" && e.type === "hidden") {
					A(i.name, "name");
					var a = i.name == null ? null : "" + i.name;
					if (i.type === "hidden" && e.getAttribute("name") === a) return e;
				} else return e;
				else if (!e[$p]) switch (t) {
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
				if (e = vd(e.nextSibling), e === null) break;
			}
			return null;
		}
		function pd(e, t, n) {
			if (t === "") return null;
			for (; e.nodeType !== 3;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = vd(e.nextSibling), e === null)) return null;
			return e;
		}
		function md(e, t) {
			for (; e.nodeType !== 8;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = vd(e.nextSibling), e === null)) return null;
			return e;
		}
		function hd(e) {
			return e.data === PS || e.data === FS;
		}
		function gd(e) {
			return e.data === IS || e.data === PS && e.ownerDocument.readyState !== HS;
		}
		function _d(e, t) {
			var n = e.ownerDocument;
			if (e.data === FS) e._reactRetry = t;
			else if (e.data !== PS || n.readyState !== HS) t();
			else {
				var r = function() {
					t(), n.removeEventListener("DOMContentLoaded", r);
				};
				n.addEventListener("DOMContentLoaded", r), e._reactRetry = r;
			}
		}
		function vd(e) {
			for (; e != null; e = e.nextSibling) {
				var t = e.nodeType;
				if (t === 1 || t === 3) break;
				if (t === 8) {
					if (t = e.data, t === MS || t === IS || t === PS || t === FS || t === AS || t === BS || t === VS) break;
					if (t === NS || t === jS) return null;
				}
			}
			return e;
		}
		function yd(e) {
			if (e.nodeType === 1) {
				for (var t = e.nodeName.toLowerCase(), n = {}, r = e.attributes, i = 0; i < r.length; i++) {
					var a = r[i];
					n[Ou(a.name)] = a.name.toLowerCase() === "style" ? ku(e) : a.value;
				}
				return {
					type: t,
					props: n
				};
			}
			return e.nodeType === 8 ? e.data === AS ? {
				type: "Activity",
				props: {}
			} : {
				type: "Suspense",
				props: {}
			} : e.nodeValue;
		}
		function bd(e, t, n) {
			return n === null || !0 !== n[kS] ? (e.nodeValue === t ? e = null : (t = Su(t), e = Su(e.nodeValue) === t ? null : e.nodeValue), e) : null;
		}
		function xd(e) {
			e = e.nextSibling;
			for (var t = 0; e;) {
				if (e.nodeType === 8) {
					var n = e.data;
					if (n === NS || n === jS) {
						if (t === 0) return vd(e.nextSibling);
						t--;
					} else n !== MS && n !== IS && n !== PS && n !== FS && n !== AS || t++;
				}
				e = e.nextSibling;
			}
			return null;
		}
		function Sd(e) {
			e = e.previousSibling;
			for (var t = 0; e;) {
				if (e.nodeType === 8) {
					var n = e.data;
					if (n === MS || n === IS || n === PS || n === FS || n === AS) {
						if (t === 0) return e;
						t--;
					} else n !== NS && n !== jS || t++;
				}
				e = e.previousSibling;
			}
			return null;
		}
		function Cd(e) {
			Sf(e);
		}
		function wd(e) {
			Sf(e);
		}
		function Td(e) {
			Sf(e);
		}
		function Ed(e, t, n, r, i) {
			switch (i && qt(e, r.ancestorInfo), t = Bu(n), e) {
				case "html":
					if (e = t.documentElement, !e) throw Error("React expected an <html> element (document.documentElement) to exist in the Document but one was not found. React never removes the documentElement for any Document it renders into so the cause is likely in some other script running on this page.");
					return e;
				case "head":
					if (e = t.head, !e) throw Error("React expected a <head> element (document.head) to exist in the Document but one was not found. React never removes the head for any Document it renders into so the cause is likely in some other script running on this page.");
					return e;
				case "body":
					if (e = t.body, !e) throw Error("React expected a <body> element (document.body) to exist in the Document but one was not found. React never removes the body for any Document it renders into so the cause is likely in some other script running on this page.");
					return e;
				default: throw Error("resolveSingletonInstance was called with an element type that is not supported. This is a bug in React.");
			}
		}
		function Dd(e, t, n, r) {
			if (!n[Jp] && Xe(n)) {
				var i = n.tagName.toLowerCase();
				console.error("You are mounting a new %s component when a previous one has not first unmounted. It is an error to render more than one %s component at a time and attributes and children of these components will likely fail in unpredictable ways. Please only render a single instance of <%s> and if you need to mount a new one, ensure any previous ones have unmounted first.", i, i, i);
			}
			switch (e) {
				case "html":
				case "head":
				case "body": break;
				default: console.error("acquireSingletonInstance was called with an element type that is not supported. This is a bug in React.");
			}
			for (i = n.attributes; i.length;) n.removeAttributeNode(i[0]);
			Eu(n, e, t), n[Kp] = r, n[qp] = t;
		}
		function Od(e) {
			for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
			Je(e);
		}
		function kd(e) {
			return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
		}
		function Ad(e, t, n) {
			var r = fC;
			if (r && typeof t == "string" && t) {
				var i = mt(t);
				i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), uC.has(i) || (uC.add(i), e = {
					rel: e,
					crossOrigin: n,
					href: t
				}, r.querySelector(i) === null && (t = r.createElement("link"), Eu(t, "link", e), $e(t), r.head.appendChild(t)));
			}
		}
		function jd(e, t, n, r) {
			var i = (i = tp.current) ? kd(i) : null;
			if (!i) throw Error("\"resourceRoot\" was expected to exist. This is a bug in React.");
			switch (e) {
				case "meta":
				case "title": return null;
				case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (n = z(n.href), t = Qe(i).hoistableStyles, r = t.get(n), r || (r = {
					type: "style",
					instance: null,
					count: 0,
					state: null
				}, t.set(n, r)), r) : {
					type: "void",
					instance: null,
					count: 0,
					state: null
				};
				case "link":
					if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
						e = z(n.href);
						var a = Qe(i).hoistableStyles, o = a.get(e);
						if (!o && (i = i.ownerDocument || i, o = {
							type: "stylesheet",
							instance: null,
							count: 0,
							state: {
								loading: iC,
								preload: null
							}
						}, a.set(e, o), (a = i.querySelector(Nd(e))) && !a._p && (o.instance = a, o.state.loading = aC | cC), !lC.has(e))) {
							var s = {
								rel: "preload",
								as: "style",
								href: n.href,
								crossOrigin: n.crossOrigin,
								integrity: n.integrity,
								media: n.media,
								hrefLang: n.hrefLang,
								referrerPolicy: n.referrerPolicy
							};
							lC.set(e, s), a || Fd(i, e, s, o.state);
						}
						if (t && r === null) throw n = "\n\n  - " + Md(t) + "\n  + " + Md(n), Error("Expected <link> not to update to be updated to a stylesheet with precedence. Check the `rel`, `href`, and `precedence` props of this component. Alternatively, check whether two different <link> components render in the same slot or share the same key." + n);
						return o;
					}
					if (t && r !== null) throw n = "\n\n  - " + Md(t) + "\n  + " + Md(n), Error("Expected stylesheet with precedence to not be updated to a different kind of <link>. Check the `rel`, `href`, and `precedence` props of this component. Alternatively, check whether two different <link> components render in the same slot or share the same key." + n);
					return null;
				case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (n = Id(n), t = Qe(i).hoistableScripts, r = t.get(n), r || (r = {
					type: "script",
					instance: null,
					count: 0,
					state: null
				}, t.set(n, r)), r) : {
					type: "void",
					instance: null,
					count: 0,
					state: null
				};
				default: throw Error("getResource encountered a type it did not expect: \"" + e + "\". this is a bug in React.");
			}
		}
		function Md(e) {
			var t = 0, n = "<link";
			return typeof e.rel == "string" ? (t++, n += " rel=\"" + e.rel + "\"") : _p.call(e, "rel") && (t++, n += " rel=\"" + (e.rel === null ? "null" : "invalid type " + typeof e.rel) + "\""), typeof e.href == "string" ? (t++, n += " href=\"" + e.href + "\"") : _p.call(e, "href") && (t++, n += " href=\"" + (e.href === null ? "null" : "invalid type " + typeof e.href) + "\""), typeof e.precedence == "string" ? (t++, n += " precedence=\"" + e.precedence + "\"") : _p.call(e, "precedence") && (t++, n += " precedence={" + (e.precedence === null ? "null" : "invalid type " + typeof e.precedence) + "}"), Object.getOwnPropertyNames(e).length > t && (n += " ..."), n + " />";
		}
		function z(e) {
			return "href=\"" + mt(e) + "\"";
		}
		function Nd(e) {
			return "link[rel=\"stylesheet\"][" + e + "]";
		}
		function Pd(e) {
			return B({}, e, {
				"data-precedence": e.precedence,
				precedence: null
			});
		}
		function Fd(e, t, n, r) {
			e.querySelector("link[rel=\"preload\"][as=\"style\"][" + t + "]") ? r.loading = aC : (t = e.createElement("link"), r.preload = t, t.addEventListener("load", function() {
				return r.loading |= aC;
			}), t.addEventListener("error", function() {
				return r.loading |= oC;
			}), Eu(t, "link", n), $e(t), e.head.appendChild(t));
		}
		function Id(e) {
			return "[src=\"" + mt(e) + "\"]";
		}
		function Ld(e) {
			return "script[async]" + e;
		}
		function Rd(e, t, n) {
			if (t.count++, t.instance === null) switch (t.type) {
				case "style":
					var r = e.querySelector("style[data-href~=\"" + mt(n.href) + "\"]");
					if (r) return t.instance = r, $e(r), r;
					var i = B({}, n, {
						"data-href": n.href,
						"data-precedence": n.precedence,
						href: null,
						precedence: null
					});
					return r = (e.ownerDocument || e).createElement("style"), $e(r), Eu(r, "style", i), zd(r, n.precedence, e), t.instance = r;
				case "stylesheet":
					i = z(n.href);
					var a = e.querySelector(Nd(i));
					if (a) return t.state.loading |= cC, t.instance = a, $e(a), a;
					r = Pd(n), (i = lC.get(i)) && Bd(r, i), a = (e.ownerDocument || e).createElement("link"), $e(a);
					var o = a;
					return o._p = new Promise(function(e, t) {
						o.onload = e, o.onerror = t;
					}), Eu(a, "link", r), t.state.loading |= cC, zd(a, n.precedence, e), t.instance = a;
				case "script": return a = Id(n.src), (i = e.querySelector(Ld(a))) ? (t.instance = i, $e(i), i) : (r = n, (i = lC.get(a)) && (r = B({}, n), Vd(r, i)), e = e.ownerDocument || e, i = e.createElement("script"), $e(i), Eu(i, "link", r), e.head.appendChild(i), t.instance = i);
				case "void": return null;
				default: throw Error("acquireResource encountered a resource type it did not expect: \"" + t.type + "\". this is a bug in React.");
			}
			else t.type === "stylesheet" && (t.state.loading & cC) === iC && (r = t.instance, t.state.loading |= cC, zd(r, n.precedence, e));
			return t.instance;
		}
		function zd(e, t, n) {
			for (var r = n.querySelectorAll("link[rel=\"stylesheet\"][data-precedence],style[data-precedence]"), i = r.length ? r[r.length - 1] : null, a = i, o = 0; o < r.length; o++) {
				var s = r[o];
				if (s.dataset.precedence === t) a = s;
				else if (a !== i) break;
			}
			a ? a.parentNode.insertBefore(e, a.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
		}
		function Bd(e, t) {
			e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.title ??= t.title;
		}
		function Vd(e, t) {
			e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.integrity ??= t.integrity;
		}
		function Hd(e, t, n) {
			if (pC === null) {
				var r = /* @__PURE__ */ new Map(), i = pC = /* @__PURE__ */ new Map();
				i.set(n, r);
			} else i = pC, r = i.get(n), r || (r = /* @__PURE__ */ new Map(), i.set(n, r));
			if (r.has(e)) return r;
			for (r.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
				var a = n[i];
				if (!(a[$p] || a[Kp] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== Im) {
					var o = a.getAttribute(t) || "";
					o = e + o;
					var s = r.get(o);
					s ? s.push(a) : r.set(o, [a]);
				}
			}
			return r;
		}
		function Ud(e, t, n) {
			e = e.ownerDocument || e, e.head.insertBefore(n, t === "title" ? e.querySelector("head > title") : null);
		}
		function Wd(e, t, n) {
			var r = !n.ancestorInfo.containerTagInScope;
			if (n.context === GS || t.itemProp != null) return !r || t.itemProp == null || e !== "meta" && e !== "title" && e !== "style" && e !== "link" && e !== "script" || console.error("Cannot render a <%s> outside the main document if it has an `itemProp` prop. `itemProp` suggests the tag belongs to an `itemScope` which can appear anywhere in the DOM. If you were intending for React to hoist this <%s> remove the `itemProp` prop. Otherwise, try moving this tag into the <head> or <body> of the Document.", e, e), !1;
			switch (e) {
				case "meta":
				case "title": return !0;
				case "style":
					if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") {
						r && console.error("Cannot render a <style> outside the main document without knowing its precedence and a unique href key. React can hoist and deduplicate <style> tags if you provide a `precedence` prop along with an `href` prop that does not conflict with the `href` values used in any other hoisted <style> or <link rel=\"stylesheet\" ...> tags.  Note that hoisting <style> tags is considered an advanced feature that most will not use directly. Consider moving the <style> tag to the <head> or consider adding a `precedence=\"default\"` and `href=\"some unique resource identifier\"`.");
						break;
					}
					return !0;
				case "link":
					if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError) {
						if (t.rel === "stylesheet" && typeof t.precedence == "string") {
							e = t.href;
							var i = t.onError, a = t.disabled;
							n = [], t.onLoad && n.push("`onLoad`"), i && n.push("`onError`"), a != null && n.push("`disabled`"), i = Lu(n, "and"), i += n.length === 1 ? " prop" : " props", a = n.length === 1 ? "an " + i : "the " + i, n.length && console.error("React encountered a <link rel=\"stylesheet\" href=\"%s\" ... /> with a `precedence` prop that also included %s. The presence of loading and error handlers indicates an intent to manage the stylesheet loading state from your from your Component code and React will not hoist or deduplicate this stylesheet. If your intent was to have React hoist and deduplciate this stylesheet using the `precedence` prop remove the %s, otherwise remove the `precedence` prop.", e, a, i);
						}
						r && (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" ? console.error("Cannot render a <link> outside the main document without a `rel` and `href` prop. Try adding a `rel` and/or `href` prop to this <link> or moving the link into the <head> tag") : (t.onError || t.onLoad) && console.error("Cannot render a <link> with onLoad or onError listeners outside the main document. Try removing onLoad={...} and onError={...} or moving it into the root <head> tag or somewhere in the <body>."));
						break;
					}
					switch (t.rel) {
						case "stylesheet": return e = t.precedence, t = t.disabled, typeof e != "string" && r && console.error("Cannot render a <link rel=\"stylesheet\" /> outside the main document without knowing its precedence. Consider adding precedence=\"default\" or moving it into the root <head> tag."), typeof e == "string" && t == null;
						default: return !0;
					}
				case "script":
					if (e = t.async && typeof t.async != "function" && typeof t.async != "symbol", !e || t.onLoad || t.onError || !t.src || typeof t.src != "string") {
						r && (e ? t.onLoad || t.onError ? console.error("Cannot render a <script> with onLoad or onError listeners outside the main document. Try removing onLoad={...} and onError={...} or moving it into the root <head> tag or somewhere in the <body>.") : console.error("Cannot render a <script> outside the main document without `async={true}` and a non-empty `src` prop. Ensure there is a valid `src` and either make the script async or move it into the root <head> tag or somewhere in the <body>.") : console.error("Cannot render a sync or defer <script> outside the main document without knowing its order. Try adding async=\"\" or moving it into the root <head> tag."));
						break;
					}
					return !0;
				case "noscript":
				case "template": r && console.error("Cannot render <%s> outside the main document. Try moving it into the root <head> tag.", e);
			}
			return !1;
		}
		function Gd(e) {
			return !(e.type === "stylesheet" && (e.state.loading & sC) === iC);
		}
		function Kd(e, t, n, r) {
			if (n.type === "stylesheet" && (typeof r.media != "string" || !1 !== matchMedia(r.media).matches) && (n.state.loading & cC) === iC) {
				if (n.instance === null) {
					var i = z(r.href), a = t.querySelector(Nd(i));
					if (a) {
						t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = Jd.bind(e), t.then(e, e)), n.state.loading |= cC, n.instance = a, $e(a);
						return;
					}
					a = t.ownerDocument || t, r = Pd(r), (i = lC.get(i)) && Bd(r, i), a = a.createElement("link"), $e(a);
					var o = a;
					o._p = new Promise(function(e, t) {
						o.onload = e, o.onerror = t;
					}), Eu(a, "link", r), n.instance = a;
				}
				e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && (n.state.loading & sC) === iC && (e.count++, n = Jd.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
			}
		}
		function qd(e, t) {
			return e.stylesheets && e.count === 0 && Yd(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
				var r = setTimeout(function() {
					if (e.stylesheets && Yd(e, e.stylesheets), e.unsuspend) {
						var t = e.unsuspend;
						e.unsuspend = null, t();
					}
				}, mC + t);
				0 < e.imgBytes && _C === 0 && (_C = 125 * zu() * gC);
				var i = setTimeout(function() {
					if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && Yd(e, e.stylesheets), e.unsuspend)) {
						var t = e.unsuspend;
						e.unsuspend = null, t();
					}
				}, (e.imgBytes > _C ? 50 : hC) + t);
				return e.unsuspend = n, function() {
					e.unsuspend = null, clearTimeout(r), clearTimeout(i);
				};
			} : null;
		}
		function Jd() {
			if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
				if (this.stylesheets) Yd(this, this.stylesheets);
				else if (this.unsuspend) {
					var e = this.unsuspend;
					this.unsuspend = null, e();
				}
			}
		}
		function Yd(e, t) {
			e.stylesheets = null, e.unsuspend !== null && (e.count++, yC = /* @__PURE__ */ new Map(), t.forEach(Xd, e), yC = null, Jd.call(e));
		}
		function Xd(e, t) {
			if (!(t.state.loading & cC)) {
				var n = yC.get(e);
				if (n) var r = n.get(vC);
				else {
					n = /* @__PURE__ */ new Map(), yC.set(e, n);
					for (var i = e.querySelectorAll("link[data-precedence],style[data-precedence]"), a = 0; a < i.length; a++) {
						var o = i[a];
						(o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (n.set(o.dataset.precedence, o), r = o);
					}
					r && n.set(vC, r);
				}
				i = t.instance, o = i.getAttribute("data-precedence"), a = n.get(o) || r, a === r && n.set(vC, i), n.set(o, i), this.count++, r = Jd.bind(this), i.addEventListener("load", r), i.addEventListener("error", r), a ? a.parentNode.insertBefore(i, a.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= cC;
			}
		}
		function Zd(e, t, n, r, i, a, o, s, c) {
			for (this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = eC, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = Ie(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Ie(0), this.hiddenUpdates = Ie(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.incompleteTransitions = /* @__PURE__ */ new Map(), this.passiveEffectDuration = this.effectDuration = -0, this.memoizedUpdaters = /* @__PURE__ */ new Set(), e = this.pendingUpdatersLaneMap = [], t = 0; 31 > t; t++) e.push(/* @__PURE__ */ new Set());
			this._debugRootType = n ? "hydrateRoot()" : "createRoot()";
		}
		function Qd(e, t, n, r, i, a, o, s, c, l, u, d) {
			return e = new Zd(e, t, n, o, c, l, u, d, s), t = Lg, !0 === a && (t |= Rg | zg), t |= G, a = h(3, null, null, t), e.current = a, a.stateNode = e, t = si(), ci(t), e.pooledCache = t, ci(t), a.memoizedState = {
				element: r,
				isDehydrated: n,
				cache: t
			}, $i(a), e;
		}
		function $d(e) {
			return e ? (e = Pg, e) : Pg;
		}
		function ef(e, t, n, r, i, a) {
			if (Mp && typeof Mp.onScheduleFiberRoot == "function") try {
				Mp.onScheduleFiberRoot(jp, r, n);
			} catch (e) {
				Np || (Np = !0, console.error("React instrumentation encountered an error: %o", e));
			}
			i = $d(i), r.context === null ? r.context = i : r.pendingContext = i, gp && hp !== null && !DC && (DC = !0, console.error("Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.\n\nCheck the render method of %s.", T(hp) || "Unknown")), r = ta(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (typeof a != "function" && console.error("Expected the last optional `callback` argument to be a function. Instead received: %s.", a), r.callback = a), n = na(e, r, t), n !== null && (ui(t, "root.render()", null), nl(n, e, t), ra(n, e, t));
		}
		function tf(e, t) {
			if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
				var n = e.retryLane;
				e.retryLane = n !== 0 && n < t ? n : t;
			}
		}
		function nf(e, t) {
			tf(e, t), (e = e.alternate) && tf(e, t);
		}
		function rf(e) {
			if (e.tag === 13 || e.tag === 31) {
				var t = pr(e, 67108864);
				t !== null && nl(t, e, 67108864), nf(e, 67108864);
			}
		}
		function af(e) {
			if (e.tag === 13 || e.tag === 31) {
				var t = el(e);
				t = He(t);
				var n = pr(e, t);
				n !== null && nl(n, e, t), nf(e, t);
			}
		}
		function of() {
			return hp;
		}
		function sf(e, t, n, r) {
			var i = V.T;
			V.T = null;
			var a = Jf.p;
			try {
				Jf.p = Vp, lf(e, t, n, r);
			} finally {
				Jf.p = a, V.T = i;
			}
		}
		function cf(e, t, n, r) {
			var i = V.T;
			V.T = null;
			var a = Jf.p;
			try {
				Jf.p = Hp, lf(e, t, n, r);
			} finally {
				Jf.p = a, V.T = i;
			}
		}
		function lf(e, t, n, r) {
			if (RC) {
				var i = uf(r);
				if (i === null) fu(e, t, r, zC, n), pf(e, r);
				else if (hf(i, e, t, n, r)) r.stopPropagation();
				else if (pf(e, r), t & 4 && -1 < qC.indexOf(e)) {
					for (; i !== null;) {
						var a = Xe(i);
						if (a !== null) switch (a.tag) {
							case 3:
								if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
									var o = je(a.pendingLanes);
									if (o !== 0) {
										var s = a;
										for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
											var c = 1 << 31 - Fp(o);
											s.entanglements[1] |= c, o &= ~c;
										}
										Yl(a), (Wb & (Fb | Ib)) === Pb && (bx = Sp() + xx, L(0, !1));
									}
								}
								break;
							case 31:
							case 13: s = pr(a, 2), s !== null && nl(s, a, 2), sl(), nf(a, 2);
						}
						if (a = uf(r), a === null && fu(e, t, r, zC, n), a === i) break;
						i = a;
					}
					i !== null && r.stopPropagation();
				} else fu(e, t, r, null, n);
			}
		}
		function uf(e) {
			return e = cn(e), df(e);
		}
		function df(e) {
			if (zC = null, e = Ye(e), e !== null) {
				var t = x(e);
				if (t === null) e = null;
				else {
					var n = t.tag;
					if (n === 13) {
						if (e = ee(t), e !== null) return e;
						e = null;
					} else if (n === 31) {
						if (e = S(t), e !== null) return e;
						e = null;
					} else if (n === 3) {
						if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
						e = null;
					} else t !== e && (e = null);
				}
			}
			return zC = e, null;
		}
		function ff(e) {
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
				case "selectstart": return Vp;
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
				case "pointerleave": return Hp;
				case "message": switch (Cp()) {
					case wp: return Vp;
					case Tp: return Hp;
					case Ep:
					case Dp: return Up;
					case Op: return Wp;
					default: return Up;
				}
				default: return Up;
			}
		}
		function pf(e, t) {
			switch (e) {
				case "focusin":
				case "focusout":
					VC = null;
					break;
				case "dragenter":
				case "dragleave":
					HC = null;
					break;
				case "mouseover":
				case "mouseout":
					UC = null;
					break;
				case "pointerover":
				case "pointerout":
					WC.delete(t.pointerId);
					break;
				case "gotpointercapture":
				case "lostpointercapture": GC.delete(t.pointerId);
			}
		}
		function mf(e, t, n, r, i, a) {
			return e === null || e.nativeEvent !== a ? (e = {
				blockedOn: t,
				domEventName: n,
				eventSystemFlags: r,
				nativeEvent: a,
				targetContainers: [i]
			}, t !== null && (t = Xe(t), t !== null && rf(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
		}
		function hf(e, t, n, r, i) {
			switch (t) {
				case "focusin": return VC = mf(VC, e, t, n, r, i), !0;
				case "dragenter": return HC = mf(HC, e, t, n, r, i), !0;
				case "mouseover": return UC = mf(UC, e, t, n, r, i), !0;
				case "pointerover":
					var a = i.pointerId;
					return WC.set(a, mf(WC.get(a) || null, e, t, n, r, i)), !0;
				case "gotpointercapture": return a = i.pointerId, GC.set(a, mf(GC.get(a) || null, e, t, n, r, i)), !0;
			}
			return !1;
		}
		function gf(e) {
			var t = Ye(e.target);
			if (t !== null) {
				var n = x(t);
				if (n !== null) {
					if (t = n.tag, t === 13) {
						if (t = ee(n), t !== null) {
							e.blockedOn = t, qe(e.priority, function() {
								af(n);
							});
							return;
						}
					} else if (t === 31) {
						if (t = S(n), t !== null) {
							e.blockedOn = t, qe(e.priority, function() {
								af(n);
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
		function _f(e) {
			if (e.blockedOn !== null) return !1;
			for (var t = e.targetContainers; 0 < t.length;) {
				var n = uf(e.nativeEvent);
				if (n === null) {
					n = e.nativeEvent;
					var r = new n.constructor(n.type, n), i = r;
					Xm !== null && console.error("Expected currently replaying event to be null. This error is likely caused by a bug in React. Please file an issue."), Xm = i, n.target.dispatchEvent(r), Xm === null && console.error("Expected currently replaying event to not be null. This error is likely caused by a bug in React. Please file an issue."), Xm = null;
				} else return t = Xe(n), t !== null && rf(t), e.blockedOn = n, !1;
				t.shift();
			}
			return !0;
		}
		function vf(e, t, n) {
			_f(e) && n.delete(t);
		}
		function yf() {
			BC = !1, VC !== null && _f(VC) && (VC = null), HC !== null && _f(HC) && (HC = null), UC !== null && _f(UC) && (UC = null), WC.forEach(vf), GC.forEach(vf);
		}
		function bf(e, t) {
			e.blockedOn === t && (e.blockedOn = null, BC || (BC = !0, Df.unstable_scheduleCallback(Df.unstable_NormalPriority, yf)));
		}
		function xf(e) {
			JC !== e && (JC = e, Df.unstable_scheduleCallback(Df.unstable_NormalPriority, function() {
				JC === e && (JC = null);
				for (var t = 0; t < e.length; t += 3) {
					var n = e[t], r = e[t + 1], i = e[t + 2];
					if (typeof r != "function") {
						if (df(r || n) === null) continue;
						break;
					}
					var a = Xe(n);
					a !== null && (e.splice(t, 3), t -= 3, n = {
						pending: !0,
						data: i,
						method: n.method,
						action: r
					}, Object.freeze(n), No(a, n, r, i));
				}
			}));
		}
		function Sf(e) {
			function t(t) {
				return bf(t, e);
			}
			VC !== null && bf(VC, e), HC !== null && bf(HC, e), UC !== null && bf(UC, e), WC.forEach(t), GC.forEach(t);
			for (var n = 0; n < KC.length; n++) {
				var r = KC[n];
				r.blockedOn === e && (r.blockedOn = null);
			}
			for (; 0 < KC.length && (n = KC[0], n.blockedOn === null);) gf(n), n.blockedOn === null && KC.shift();
			if (n = (e.ownerDocument || e).$$reactFormReplay, n != null) for (r = 0; r < n.length; r += 3) {
				var i = n[r], a = n[r + 1], o = i[qp] || null;
				if (typeof a == "function") o || xf(n);
				else if (o) {
					var s = null;
					if (a && a.hasAttribute("formAction")) {
						if (i = a, o = a[qp] || null) s = o.formAction;
						else if (df(i) !== null) continue;
					} else s = o.action;
					typeof s == "function" ? n[r + 1] = s : (n.splice(r, 3), r -= 3), xf(n);
				}
			}
		}
		function Cf() {
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
		function wf(e) {
			this._internalRoot = e;
		}
		function Tf(e) {
			this._internalRoot = e;
		}
		function Ef(e) {
			e[Jp] && (e._reactRootContainer ? console.error("You are calling ReactDOMClient.createRoot() on a container that was previously passed to ReactDOM.render(). This is not supported.") : console.error("You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it."));
		}
		typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
		var Df = m(), Of = d(), kf = _(), B = Object.assign, Af = Symbol.for("react.element"), jf = Symbol.for("react.transitional.element"), Mf = Symbol.for("react.portal"), Nf = Symbol.for("react.fragment"), Pf = Symbol.for("react.strict_mode"), Ff = Symbol.for("react.profiler"), If = Symbol.for("react.consumer"), Lf = Symbol.for("react.context"), Rf = Symbol.for("react.forward_ref"), zf = Symbol.for("react.suspense"), Bf = Symbol.for("react.suspense_list"), Vf = Symbol.for("react.memo"), Hf = Symbol.for("react.lazy"), Uf = Symbol.for("react.activity"), Wf = Symbol.for("react.memo_cache_sentinel"), Gf = Symbol.iterator, Kf = Symbol.for("react.client.reference"), qf = Array.isArray, V = Of.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Jf = kf.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Yf = Object.freeze({
			pending: !1,
			data: null,
			method: null,
			action: null
		}), Xf = [], Zf = [], Qf = -1, $f = ae(null), ep = ae(null), tp = ae(null), np = ae(null), rp = 0, ip, ap, op, sp, cp, lp, up;
		de.__reactDisabledLog = !0;
		var dp, fp, pp = !1, mp = new (typeof WeakMap == "function" ? WeakMap : Map)(), hp = null, gp = !1, _p = Object.prototype.hasOwnProperty, vp = Df.unstable_scheduleCallback, yp = Df.unstable_cancelCallback, bp = Df.unstable_shouldYield, xp = Df.unstable_requestPaint, Sp = Df.unstable_now, Cp = Df.unstable_getCurrentPriorityLevel, wp = Df.unstable_ImmediatePriority, Tp = Df.unstable_UserBlockingPriority, Ep = Df.unstable_NormalPriority, Dp = Df.unstable_LowPriority, Op = Df.unstable_IdlePriority, kp = Df.log, Ap = Df.unstable_setDisableYieldValue, jp = null, Mp = null, Np = !1, Pp = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u", Fp = Math.clz32 ? Math.clz32 : Ae, Ip = Math.log, Lp = Math.LN2, Rp = 256, zp = 262144, Bp = 4194304, Vp = 2, Hp = 8, Up = 32, Wp = 268435456, Gp = Math.random().toString(36).slice(2), Kp = "__reactFiber$" + Gp, qp = "__reactProps$" + Gp, Jp = "__reactContainer$" + Gp, Yp = "__reactEvents$" + Gp, Xp = "__reactListeners$" + Gp, Zp = "__reactHandles$" + Gp, Qp = "__reactResources$" + Gp, $p = "__reactMarker$" + Gp, em = /* @__PURE__ */ new Set(), tm = {}, nm = {}, rm = {
			button: !0,
			checkbox: !0,
			image: !0,
			hidden: !0,
			radio: !0,
			reset: !0,
			submit: !0
		}, im = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), am = {}, om = {}, sm = /[\n"\\]/g, cm = !1, lm = !1, um = !1, dm = !1, fm = !1, pm = !1, mm = ["value", "defaultValue"], hm = !1, gm = /["'&<>\n\t]|^\s|\s$/, _m = "address applet area article aside base basefont bgsound blockquote body br button caption center col colgroup dd details dir div dl dt embed fieldset figcaption figure footer form frame frameset h1 h2 h3 h4 h5 h6 head header hgroup hr html iframe img input isindex li link listing main marquee menu menuitem meta nav noembed noframes noscript object ol p param plaintext pre script section select source style summary table tbody td template textarea tfoot th thead title tr track ul wbr xmp".split(" "), vm = "applet caption html table td th marquee object template foreignObject desc title".split(" "), ym = vm.concat(["button"]), bm = "dd dt li option optgroup p rp rt".split(" "), xm = {
			current: null,
			formTag: null,
			aTagInScope: null,
			buttonTagInScope: null,
			nobrTagInScope: null,
			pTagInButtonScope: null,
			listItemTagAutoclosing: null,
			dlItemTagAutoclosing: null,
			containerTagInScope: null,
			implicitRootScope: !1
		}, Sm = {}, Cm = {
			animation: "animationDelay animationDirection animationDuration animationFillMode animationIterationCount animationName animationPlayState animationTimingFunction".split(" "),
			background: "backgroundAttachment backgroundClip backgroundColor backgroundImage backgroundOrigin backgroundPositionX backgroundPositionY backgroundRepeat backgroundSize".split(" "),
			backgroundPosition: ["backgroundPositionX", "backgroundPositionY"],
			border: "borderBottomColor borderBottomStyle borderBottomWidth borderImageOutset borderImageRepeat borderImageSlice borderImageSource borderImageWidth borderLeftColor borderLeftStyle borderLeftWidth borderRightColor borderRightStyle borderRightWidth borderTopColor borderTopStyle borderTopWidth".split(" "),
			borderBlockEnd: [
				"borderBlockEndColor",
				"borderBlockEndStyle",
				"borderBlockEndWidth"
			],
			borderBlockStart: [
				"borderBlockStartColor",
				"borderBlockStartStyle",
				"borderBlockStartWidth"
			],
			borderBottom: [
				"borderBottomColor",
				"borderBottomStyle",
				"borderBottomWidth"
			],
			borderColor: [
				"borderBottomColor",
				"borderLeftColor",
				"borderRightColor",
				"borderTopColor"
			],
			borderImage: [
				"borderImageOutset",
				"borderImageRepeat",
				"borderImageSlice",
				"borderImageSource",
				"borderImageWidth"
			],
			borderInlineEnd: [
				"borderInlineEndColor",
				"borderInlineEndStyle",
				"borderInlineEndWidth"
			],
			borderInlineStart: [
				"borderInlineStartColor",
				"borderInlineStartStyle",
				"borderInlineStartWidth"
			],
			borderLeft: [
				"borderLeftColor",
				"borderLeftStyle",
				"borderLeftWidth"
			],
			borderRadius: [
				"borderBottomLeftRadius",
				"borderBottomRightRadius",
				"borderTopLeftRadius",
				"borderTopRightRadius"
			],
			borderRight: [
				"borderRightColor",
				"borderRightStyle",
				"borderRightWidth"
			],
			borderStyle: [
				"borderBottomStyle",
				"borderLeftStyle",
				"borderRightStyle",
				"borderTopStyle"
			],
			borderTop: [
				"borderTopColor",
				"borderTopStyle",
				"borderTopWidth"
			],
			borderWidth: [
				"borderBottomWidth",
				"borderLeftWidth",
				"borderRightWidth",
				"borderTopWidth"
			],
			columnRule: [
				"columnRuleColor",
				"columnRuleStyle",
				"columnRuleWidth"
			],
			columns: ["columnCount", "columnWidth"],
			flex: [
				"flexBasis",
				"flexGrow",
				"flexShrink"
			],
			flexFlow: ["flexDirection", "flexWrap"],
			font: "fontFamily fontFeatureSettings fontKerning fontLanguageOverride fontSize fontSizeAdjust fontStretch fontStyle fontVariant fontVariantAlternates fontVariantCaps fontVariantEastAsian fontVariantLigatures fontVariantNumeric fontVariantPosition fontWeight lineHeight".split(" "),
			fontVariant: "fontVariantAlternates fontVariantCaps fontVariantEastAsian fontVariantLigatures fontVariantNumeric fontVariantPosition".split(" "),
			gap: ["columnGap", "rowGap"],
			grid: "gridAutoColumns gridAutoFlow gridAutoRows gridTemplateAreas gridTemplateColumns gridTemplateRows".split(" "),
			gridArea: [
				"gridColumnEnd",
				"gridColumnStart",
				"gridRowEnd",
				"gridRowStart"
			],
			gridColumn: ["gridColumnEnd", "gridColumnStart"],
			gridColumnGap: ["columnGap"],
			gridGap: ["columnGap", "rowGap"],
			gridRow: ["gridRowEnd", "gridRowStart"],
			gridRowGap: ["rowGap"],
			gridTemplate: [
				"gridTemplateAreas",
				"gridTemplateColumns",
				"gridTemplateRows"
			],
			listStyle: [
				"listStyleImage",
				"listStylePosition",
				"listStyleType"
			],
			margin: [
				"marginBottom",
				"marginLeft",
				"marginRight",
				"marginTop"
			],
			marker: [
				"markerEnd",
				"markerMid",
				"markerStart"
			],
			mask: "maskClip maskComposite maskImage maskMode maskOrigin maskPositionX maskPositionY maskRepeat maskSize".split(" "),
			maskPosition: ["maskPositionX", "maskPositionY"],
			outline: [
				"outlineColor",
				"outlineStyle",
				"outlineWidth"
			],
			overflow: ["overflowX", "overflowY"],
			padding: [
				"paddingBottom",
				"paddingLeft",
				"paddingRight",
				"paddingTop"
			],
			placeContent: ["alignContent", "justifyContent"],
			placeItems: ["alignItems", "justifyItems"],
			placeSelf: ["alignSelf", "justifySelf"],
			textDecoration: [
				"textDecorationColor",
				"textDecorationLine",
				"textDecorationStyle"
			],
			textEmphasis: ["textEmphasisColor", "textEmphasisStyle"],
			transition: [
				"transitionDelay",
				"transitionDuration",
				"transitionProperty",
				"transitionTimingFunction"
			],
			wordWrap: ["overflowWrap"]
		}, wm = /([A-Z])/g, Tm = /^ms-/, Em = /^(?:webkit|moz|o)[A-Z]/, Dm = /^-ms-/, Om = /-(.)/g, km = /;\s*$/, Am = {}, jm = {}, Mm = !1, Nm = !1, Pm = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" ")), Fm = "http://www.w3.org/1998/Math/MathML", Im = "http://www.w3.org/2000/svg", Lm = new Map([
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
		]), Rm = {
			accept: "accept",
			acceptcharset: "acceptCharset",
			"accept-charset": "acceptCharset",
			accesskey: "accessKey",
			action: "action",
			allowfullscreen: "allowFullScreen",
			alt: "alt",
			as: "as",
			async: "async",
			autocapitalize: "autoCapitalize",
			autocomplete: "autoComplete",
			autocorrect: "autoCorrect",
			autofocus: "autoFocus",
			autoplay: "autoPlay",
			autosave: "autoSave",
			capture: "capture",
			cellpadding: "cellPadding",
			cellspacing: "cellSpacing",
			challenge: "challenge",
			charset: "charSet",
			checked: "checked",
			children: "children",
			cite: "cite",
			class: "className",
			classid: "classID",
			classname: "className",
			cols: "cols",
			colspan: "colSpan",
			content: "content",
			contenteditable: "contentEditable",
			contextmenu: "contextMenu",
			controls: "controls",
			controlslist: "controlsList",
			coords: "coords",
			crossorigin: "crossOrigin",
			dangerouslysetinnerhtml: "dangerouslySetInnerHTML",
			data: "data",
			datetime: "dateTime",
			default: "default",
			defaultchecked: "defaultChecked",
			defaultvalue: "defaultValue",
			defer: "defer",
			dir: "dir",
			disabled: "disabled",
			disablepictureinpicture: "disablePictureInPicture",
			disableremoteplayback: "disableRemotePlayback",
			download: "download",
			draggable: "draggable",
			enctype: "encType",
			enterkeyhint: "enterKeyHint",
			fetchpriority: "fetchPriority",
			for: "htmlFor",
			form: "form",
			formmethod: "formMethod",
			formaction: "formAction",
			formenctype: "formEncType",
			formnovalidate: "formNoValidate",
			formtarget: "formTarget",
			frameborder: "frameBorder",
			headers: "headers",
			height: "height",
			hidden: "hidden",
			high: "high",
			href: "href",
			hreflang: "hrefLang",
			htmlfor: "htmlFor",
			httpequiv: "httpEquiv",
			"http-equiv": "httpEquiv",
			icon: "icon",
			id: "id",
			imagesizes: "imageSizes",
			imagesrcset: "imageSrcSet",
			inert: "inert",
			innerhtml: "innerHTML",
			inputmode: "inputMode",
			integrity: "integrity",
			is: "is",
			itemid: "itemID",
			itemprop: "itemProp",
			itemref: "itemRef",
			itemscope: "itemScope",
			itemtype: "itemType",
			keyparams: "keyParams",
			keytype: "keyType",
			kind: "kind",
			label: "label",
			lang: "lang",
			list: "list",
			loop: "loop",
			low: "low",
			manifest: "manifest",
			marginwidth: "marginWidth",
			marginheight: "marginHeight",
			max: "max",
			maxlength: "maxLength",
			media: "media",
			mediagroup: "mediaGroup",
			method: "method",
			min: "min",
			minlength: "minLength",
			multiple: "multiple",
			muted: "muted",
			name: "name",
			nomodule: "noModule",
			nonce: "nonce",
			novalidate: "noValidate",
			open: "open",
			optimum: "optimum",
			pattern: "pattern",
			placeholder: "placeholder",
			playsinline: "playsInline",
			poster: "poster",
			preload: "preload",
			profile: "profile",
			radiogroup: "radioGroup",
			readonly: "readOnly",
			referrerpolicy: "referrerPolicy",
			rel: "rel",
			required: "required",
			reversed: "reversed",
			role: "role",
			rows: "rows",
			rowspan: "rowSpan",
			sandbox: "sandbox",
			scope: "scope",
			scoped: "scoped",
			scrolling: "scrolling",
			seamless: "seamless",
			selected: "selected",
			shape: "shape",
			size: "size",
			sizes: "sizes",
			span: "span",
			spellcheck: "spellCheck",
			src: "src",
			srcdoc: "srcDoc",
			srclang: "srcLang",
			srcset: "srcSet",
			start: "start",
			step: "step",
			style: "style",
			summary: "summary",
			tabindex: "tabIndex",
			target: "target",
			title: "title",
			type: "type",
			usemap: "useMap",
			value: "value",
			width: "width",
			wmode: "wmode",
			wrap: "wrap",
			about: "about",
			accentheight: "accentHeight",
			"accent-height": "accentHeight",
			accumulate: "accumulate",
			additive: "additive",
			alignmentbaseline: "alignmentBaseline",
			"alignment-baseline": "alignmentBaseline",
			allowreorder: "allowReorder",
			alphabetic: "alphabetic",
			amplitude: "amplitude",
			arabicform: "arabicForm",
			"arabic-form": "arabicForm",
			ascent: "ascent",
			attributename: "attributeName",
			attributetype: "attributeType",
			autoreverse: "autoReverse",
			azimuth: "azimuth",
			basefrequency: "baseFrequency",
			baselineshift: "baselineShift",
			"baseline-shift": "baselineShift",
			baseprofile: "baseProfile",
			bbox: "bbox",
			begin: "begin",
			bias: "bias",
			by: "by",
			calcmode: "calcMode",
			capheight: "capHeight",
			"cap-height": "capHeight",
			clip: "clip",
			clippath: "clipPath",
			"clip-path": "clipPath",
			clippathunits: "clipPathUnits",
			cliprule: "clipRule",
			"clip-rule": "clipRule",
			color: "color",
			colorinterpolation: "colorInterpolation",
			"color-interpolation": "colorInterpolation",
			colorinterpolationfilters: "colorInterpolationFilters",
			"color-interpolation-filters": "colorInterpolationFilters",
			colorprofile: "colorProfile",
			"color-profile": "colorProfile",
			colorrendering: "colorRendering",
			"color-rendering": "colorRendering",
			contentscripttype: "contentScriptType",
			contentstyletype: "contentStyleType",
			cursor: "cursor",
			cx: "cx",
			cy: "cy",
			d: "d",
			datatype: "datatype",
			decelerate: "decelerate",
			descent: "descent",
			diffuseconstant: "diffuseConstant",
			direction: "direction",
			display: "display",
			divisor: "divisor",
			dominantbaseline: "dominantBaseline",
			"dominant-baseline": "dominantBaseline",
			dur: "dur",
			dx: "dx",
			dy: "dy",
			edgemode: "edgeMode",
			elevation: "elevation",
			enablebackground: "enableBackground",
			"enable-background": "enableBackground",
			end: "end",
			exponent: "exponent",
			externalresourcesrequired: "externalResourcesRequired",
			fill: "fill",
			fillopacity: "fillOpacity",
			"fill-opacity": "fillOpacity",
			fillrule: "fillRule",
			"fill-rule": "fillRule",
			filter: "filter",
			filterres: "filterRes",
			filterunits: "filterUnits",
			floodopacity: "floodOpacity",
			"flood-opacity": "floodOpacity",
			floodcolor: "floodColor",
			"flood-color": "floodColor",
			focusable: "focusable",
			fontfamily: "fontFamily",
			"font-family": "fontFamily",
			fontsize: "fontSize",
			"font-size": "fontSize",
			fontsizeadjust: "fontSizeAdjust",
			"font-size-adjust": "fontSizeAdjust",
			fontstretch: "fontStretch",
			"font-stretch": "fontStretch",
			fontstyle: "fontStyle",
			"font-style": "fontStyle",
			fontvariant: "fontVariant",
			"font-variant": "fontVariant",
			fontweight: "fontWeight",
			"font-weight": "fontWeight",
			format: "format",
			from: "from",
			fx: "fx",
			fy: "fy",
			g1: "g1",
			g2: "g2",
			glyphname: "glyphName",
			"glyph-name": "glyphName",
			glyphorientationhorizontal: "glyphOrientationHorizontal",
			"glyph-orientation-horizontal": "glyphOrientationHorizontal",
			glyphorientationvertical: "glyphOrientationVertical",
			"glyph-orientation-vertical": "glyphOrientationVertical",
			glyphref: "glyphRef",
			gradienttransform: "gradientTransform",
			gradientunits: "gradientUnits",
			hanging: "hanging",
			horizadvx: "horizAdvX",
			"horiz-adv-x": "horizAdvX",
			horizoriginx: "horizOriginX",
			"horiz-origin-x": "horizOriginX",
			ideographic: "ideographic",
			imagerendering: "imageRendering",
			"image-rendering": "imageRendering",
			in2: "in2",
			in: "in",
			inlist: "inlist",
			intercept: "intercept",
			k1: "k1",
			k2: "k2",
			k3: "k3",
			k4: "k4",
			k: "k",
			kernelmatrix: "kernelMatrix",
			kernelunitlength: "kernelUnitLength",
			kerning: "kerning",
			keypoints: "keyPoints",
			keysplines: "keySplines",
			keytimes: "keyTimes",
			lengthadjust: "lengthAdjust",
			letterspacing: "letterSpacing",
			"letter-spacing": "letterSpacing",
			lightingcolor: "lightingColor",
			"lighting-color": "lightingColor",
			limitingconeangle: "limitingConeAngle",
			local: "local",
			markerend: "markerEnd",
			"marker-end": "markerEnd",
			markerheight: "markerHeight",
			markermid: "markerMid",
			"marker-mid": "markerMid",
			markerstart: "markerStart",
			"marker-start": "markerStart",
			markerunits: "markerUnits",
			markerwidth: "markerWidth",
			mask: "mask",
			maskcontentunits: "maskContentUnits",
			maskunits: "maskUnits",
			mathematical: "mathematical",
			mode: "mode",
			numoctaves: "numOctaves",
			offset: "offset",
			opacity: "opacity",
			operator: "operator",
			order: "order",
			orient: "orient",
			orientation: "orientation",
			origin: "origin",
			overflow: "overflow",
			overlineposition: "overlinePosition",
			"overline-position": "overlinePosition",
			overlinethickness: "overlineThickness",
			"overline-thickness": "overlineThickness",
			paintorder: "paintOrder",
			"paint-order": "paintOrder",
			panose1: "panose1",
			"panose-1": "panose1",
			pathlength: "pathLength",
			patterncontentunits: "patternContentUnits",
			patterntransform: "patternTransform",
			patternunits: "patternUnits",
			pointerevents: "pointerEvents",
			"pointer-events": "pointerEvents",
			points: "points",
			pointsatx: "pointsAtX",
			pointsaty: "pointsAtY",
			pointsatz: "pointsAtZ",
			popover: "popover",
			popovertarget: "popoverTarget",
			popovertargetaction: "popoverTargetAction",
			prefix: "prefix",
			preservealpha: "preserveAlpha",
			preserveaspectratio: "preserveAspectRatio",
			primitiveunits: "primitiveUnits",
			property: "property",
			r: "r",
			radius: "radius",
			refx: "refX",
			refy: "refY",
			renderingintent: "renderingIntent",
			"rendering-intent": "renderingIntent",
			repeatcount: "repeatCount",
			repeatdur: "repeatDur",
			requiredextensions: "requiredExtensions",
			requiredfeatures: "requiredFeatures",
			resource: "resource",
			restart: "restart",
			result: "result",
			results: "results",
			rotate: "rotate",
			rx: "rx",
			ry: "ry",
			scale: "scale",
			security: "security",
			seed: "seed",
			shaperendering: "shapeRendering",
			"shape-rendering": "shapeRendering",
			slope: "slope",
			spacing: "spacing",
			specularconstant: "specularConstant",
			specularexponent: "specularExponent",
			speed: "speed",
			spreadmethod: "spreadMethod",
			startoffset: "startOffset",
			stddeviation: "stdDeviation",
			stemh: "stemh",
			stemv: "stemv",
			stitchtiles: "stitchTiles",
			stopcolor: "stopColor",
			"stop-color": "stopColor",
			stopopacity: "stopOpacity",
			"stop-opacity": "stopOpacity",
			strikethroughposition: "strikethroughPosition",
			"strikethrough-position": "strikethroughPosition",
			strikethroughthickness: "strikethroughThickness",
			"strikethrough-thickness": "strikethroughThickness",
			string: "string",
			stroke: "stroke",
			strokedasharray: "strokeDasharray",
			"stroke-dasharray": "strokeDasharray",
			strokedashoffset: "strokeDashoffset",
			"stroke-dashoffset": "strokeDashoffset",
			strokelinecap: "strokeLinecap",
			"stroke-linecap": "strokeLinecap",
			strokelinejoin: "strokeLinejoin",
			"stroke-linejoin": "strokeLinejoin",
			strokemiterlimit: "strokeMiterlimit",
			"stroke-miterlimit": "strokeMiterlimit",
			strokewidth: "strokeWidth",
			"stroke-width": "strokeWidth",
			strokeopacity: "strokeOpacity",
			"stroke-opacity": "strokeOpacity",
			suppresscontenteditablewarning: "suppressContentEditableWarning",
			suppresshydrationwarning: "suppressHydrationWarning",
			surfacescale: "surfaceScale",
			systemlanguage: "systemLanguage",
			tablevalues: "tableValues",
			targetx: "targetX",
			targety: "targetY",
			textanchor: "textAnchor",
			"text-anchor": "textAnchor",
			textdecoration: "textDecoration",
			"text-decoration": "textDecoration",
			textlength: "textLength",
			textrendering: "textRendering",
			"text-rendering": "textRendering",
			to: "to",
			transform: "transform",
			transformorigin: "transformOrigin",
			"transform-origin": "transformOrigin",
			typeof: "typeof",
			u1: "u1",
			u2: "u2",
			underlineposition: "underlinePosition",
			"underline-position": "underlinePosition",
			underlinethickness: "underlineThickness",
			"underline-thickness": "underlineThickness",
			unicode: "unicode",
			unicodebidi: "unicodeBidi",
			"unicode-bidi": "unicodeBidi",
			unicoderange: "unicodeRange",
			"unicode-range": "unicodeRange",
			unitsperem: "unitsPerEm",
			"units-per-em": "unitsPerEm",
			unselectable: "unselectable",
			valphabetic: "vAlphabetic",
			"v-alphabetic": "vAlphabetic",
			values: "values",
			vectoreffect: "vectorEffect",
			"vector-effect": "vectorEffect",
			version: "version",
			vertadvy: "vertAdvY",
			"vert-adv-y": "vertAdvY",
			vertoriginx: "vertOriginX",
			"vert-origin-x": "vertOriginX",
			vertoriginy: "vertOriginY",
			"vert-origin-y": "vertOriginY",
			vhanging: "vHanging",
			"v-hanging": "vHanging",
			videographic: "vIdeographic",
			"v-ideographic": "vIdeographic",
			viewbox: "viewBox",
			viewtarget: "viewTarget",
			visibility: "visibility",
			vmathematical: "vMathematical",
			"v-mathematical": "vMathematical",
			vocab: "vocab",
			widths: "widths",
			wordspacing: "wordSpacing",
			"word-spacing": "wordSpacing",
			writingmode: "writingMode",
			"writing-mode": "writingMode",
			x1: "x1",
			x2: "x2",
			x: "x",
			xchannelselector: "xChannelSelector",
			xheight: "xHeight",
			"x-height": "xHeight",
			xlinkactuate: "xlinkActuate",
			"xlink:actuate": "xlinkActuate",
			xlinkarcrole: "xlinkArcrole",
			"xlink:arcrole": "xlinkArcrole",
			xlinkhref: "xlinkHref",
			"xlink:href": "xlinkHref",
			xlinkrole: "xlinkRole",
			"xlink:role": "xlinkRole",
			xlinkshow: "xlinkShow",
			"xlink:show": "xlinkShow",
			xlinktitle: "xlinkTitle",
			"xlink:title": "xlinkTitle",
			xlinktype: "xlinkType",
			"xlink:type": "xlinkType",
			xmlbase: "xmlBase",
			"xml:base": "xmlBase",
			xmllang: "xmlLang",
			"xml:lang": "xmlLang",
			xmlns: "xmlns",
			"xml:space": "xmlSpace",
			xmlnsxlink: "xmlnsXlink",
			"xmlns:xlink": "xmlnsXlink",
			xmlspace: "xmlSpace",
			y1: "y1",
			y2: "y2",
			y: "y",
			ychannelselector: "yChannelSelector",
			z: "z",
			zoomandpan: "zoomAndPan"
		}, zm = {
			"aria-current": 0,
			"aria-description": 0,
			"aria-details": 0,
			"aria-disabled": 0,
			"aria-hidden": 0,
			"aria-invalid": 0,
			"aria-keyshortcuts": 0,
			"aria-label": 0,
			"aria-roledescription": 0,
			"aria-autocomplete": 0,
			"aria-checked": 0,
			"aria-expanded": 0,
			"aria-haspopup": 0,
			"aria-level": 0,
			"aria-modal": 0,
			"aria-multiline": 0,
			"aria-multiselectable": 0,
			"aria-orientation": 0,
			"aria-placeholder": 0,
			"aria-pressed": 0,
			"aria-readonly": 0,
			"aria-required": 0,
			"aria-selected": 0,
			"aria-sort": 0,
			"aria-valuemax": 0,
			"aria-valuemin": 0,
			"aria-valuenow": 0,
			"aria-valuetext": 0,
			"aria-atomic": 0,
			"aria-busy": 0,
			"aria-live": 0,
			"aria-relevant": 0,
			"aria-dropeffect": 0,
			"aria-grabbed": 0,
			"aria-activedescendant": 0,
			"aria-colcount": 0,
			"aria-colindex": 0,
			"aria-colspan": 0,
			"aria-controls": 0,
			"aria-describedby": 0,
			"aria-errormessage": 0,
			"aria-flowto": 0,
			"aria-labelledby": 0,
			"aria-owns": 0,
			"aria-posinset": 0,
			"aria-rowcount": 0,
			"aria-rowindex": 0,
			"aria-rowspan": 0,
			"aria-setsize": 0,
			"aria-braillelabel": 0,
			"aria-brailleroledescription": 0,
			"aria-colindextext": 0,
			"aria-rowindextext": 0
		}, Bm = {}, Vm = RegExp("^(aria)-[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Hm = RegExp("^(aria)[A-Z][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Um = !1, Wm = {}, Gm = /^on./, Km = /^on[^A-Z]/, qm = RegExp("^(aria)-[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Jm = RegExp("^(aria)[A-Z][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Ym = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i, Xm = null, Zm = null, Qm = null, $m = !1, eh = !(typeof window > "u" || window.document === void 0 || window.document.createElement === void 0), th = !1;
		if (eh) try {
			var nh = {};
			Object.defineProperty(nh, "passive", { get: function() {
				th = !0;
			} }), window.addEventListener("test", nh, nh), window.removeEventListener("test", nh, nh);
		} catch {
			th = !1;
		}
		var rh = null, ih = null, ah = null, oh = {
			eventPhase: 0,
			bubbles: 0,
			cancelable: 0,
			timeStamp: function(e) {
				return e.timeStamp || Date.now();
			},
			defaultPrevented: 0,
			isTrusted: 0
		}, sh = gn(oh), ch = B({}, oh, {
			view: 0,
			detail: 0
		}), lh = gn(ch), uh, dh, fh, ph = B({}, ch, {
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
			getModifierState: vn,
			button: 0,
			buttons: 0,
			relatedTarget: function(e) {
				return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
			},
			movementX: function(e) {
				return "movementX" in e ? e.movementX : (e !== fh && (fh && e.type === "mousemove" ? (uh = e.screenX - fh.screenX, dh = e.screenY - fh.screenY) : dh = uh = 0, fh = e), uh);
			},
			movementY: function(e) {
				return "movementY" in e ? e.movementY : dh;
			}
		}), mh = gn(ph), hh = gn(B({}, ph, { dataTransfer: 0 })), gh = gn(B({}, ch, { relatedTarget: 0 })), _h = gn(B({}, oh, {
			animationName: 0,
			elapsedTime: 0,
			pseudoElement: 0
		})), vh = gn(B({}, oh, { clipboardData: function(e) {
			return "clipboardData" in e ? e.clipboardData : window.clipboardData;
		} })), yh = gn(B({}, oh, { data: 0 })), bh = yh, xh = {
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
		}, Sh = {
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
		}, Ch = {
			Alt: "altKey",
			Control: "ctrlKey",
			Meta: "metaKey",
			Shift: "shiftKey"
		}, wh = gn(B({}, ch, {
			key: function(e) {
				if (e.key) {
					var t = xh[e.key] || e.key;
					if (t !== "Unidentified") return t;
				}
				return e.type === "keypress" ? (e = pn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Sh[e.keyCode] || "Unidentified" : "";
			},
			code: 0,
			location: 0,
			ctrlKey: 0,
			shiftKey: 0,
			altKey: 0,
			metaKey: 0,
			repeat: 0,
			locale: 0,
			getModifierState: vn,
			charCode: function(e) {
				return e.type === "keypress" ? pn(e) : 0;
			},
			keyCode: function(e) {
				return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
			},
			which: function(e) {
				return e.type === "keypress" ? pn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
			}
		})), Th = gn(B({}, ph, {
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
		})), Eh = gn(B({}, ch, {
			touches: 0,
			targetTouches: 0,
			changedTouches: 0,
			altKey: 0,
			metaKey: 0,
			ctrlKey: 0,
			shiftKey: 0,
			getModifierState: vn
		})), Dh = gn(B({}, oh, {
			propertyName: 0,
			elapsedTime: 0,
			pseudoElement: 0
		})), Oh = gn(B({}, ph, {
			deltaX: function(e) {
				return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
			},
			deltaY: function(e) {
				return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
			},
			deltaZ: 0,
			deltaMode: 0
		})), kh = gn(B({}, oh, {
			newState: 0,
			oldState: 0
		})), Ah = [
			9,
			13,
			27,
			32
		], jh = 229, Mh = eh && "CompositionEvent" in window, Nh = null;
		eh && "documentMode" in document && (Nh = document.documentMode);
		var Ph = eh && "TextEvent" in window && !Nh, Fh = eh && (!Mh || Nh && 8 < Nh && 11 >= Nh), Ih = 32, Lh = String.fromCharCode(Ih), Rh = !1, zh = !1, Bh = {
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
		}, Vh = null, Hh = null, Uh = !1;
		eh && (Uh = wn("input") && (!document.documentMode || 9 < document.documentMode));
		var Wh = typeof Object.is == "function" ? Object.is : Fn, Gh = eh && "documentMode" in document && 11 >= document.documentMode, Kh = null, qh = null, Jh = null, Yh = !1, Xh = {
			animationend: Un("Animation", "AnimationEnd"),
			animationiteration: Un("Animation", "AnimationIteration"),
			animationstart: Un("Animation", "AnimationStart"),
			transitionrun: Un("Transition", "TransitionRun"),
			transitionstart: Un("Transition", "TransitionStart"),
			transitioncancel: Un("Transition", "TransitionCancel"),
			transitionend: Un("Transition", "TransitionEnd")
		}, Zh = {}, Qh = {};
		eh && (Qh = document.createElement("div").style, "AnimationEvent" in window || (delete Xh.animationend.animation, delete Xh.animationiteration.animation, delete Xh.animationstart.animation), "TransitionEvent" in window || delete Xh.transitionend.transition);
		var $h = Wn("animationend"), eg = Wn("animationiteration"), tg = Wn("animationstart"), ng = Wn("transitionrun"), rg = Wn("transitionstart"), ig = Wn("transitioncancel"), ag = Wn("transitionend"), og = /* @__PURE__ */ new Map(), sg = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
		sg.push("scrollEnd");
		var cg = 0;
		if (typeof performance == "object" && typeof performance.now == "function") var lg = performance, ug = function() {
			return lg.now();
		};
		else {
			var dg = Date;
			ug = function() {
				return dg.now();
			};
		}
		var fg = typeof reportError == "function" ? reportError : function(e) {
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
		}, pg = "This object has been omitted by React in the console log to avoid sending too much data from the server. Try logging smaller or more specific objects.", mg = 0, hg = 1, gg = 2, _g = 3, vg = "–\xA0", yg = "+\xA0", bg = " \xA0", xg = typeof console < "u" && typeof console.timeStamp == "function" && typeof performance < "u" && typeof performance.measure == "function", Sg = "Components ⚛", H = "Scheduler ⚛", U = "Blocking", Cg = !1, wg = {
			color: "primary",
			properties: null,
			tooltipText: "",
			track: Sg
		}, Tg = {
			start: -0,
			end: -0,
			detail: { devtools: wg }
		}, Eg = ["Changed Props", ""], Dg = "This component received deeply equal props. It might benefit from useMemo or the React Compiler in its owner.", Og = ["Changed Props", Dg], kg = 1, Ag = 2, jg = [], Mg = 0, Ng = 0, Pg = {};
		Object.freeze(Pg);
		var Fg = null, Ig = null, W = 0, Lg = 1, G = 2, Rg = 8, zg = 16, Bg = 32, Vg = !1;
		try {
			var Hg = Object.preventExtensions({});
			new Map([[Hg, null]]), new Set([Hg]);
		} catch {
			Vg = !0;
		}
		var Ug = /* @__PURE__ */ new WeakMap(), Wg = [], Gg = 0, Kg = null, qg = 0, Jg = [], Yg = 0, Xg = null, Zg = 1, Qg = "", $g = null, e_ = null, K = !1, t_ = !1, n_ = null, r_ = null, i_ = !1, a_ = Error("Hydration Mismatch Exception: This is not a real error, and should not leak into userspace. If you're seeing this, it's likely a bug in React."), o_ = ae(null), s_ = ae(null), c_ = {}, l_ = null, u_ = null, d_ = !1, f_ = typeof AbortController < "u" ? AbortController : function() {
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
		}, p_ = Df.unstable_scheduleCallback, m_ = Df.unstable_NormalPriority, h_ = {
			$$typeof: Lf,
			Consumer: null,
			Provider: null,
			_currentValue: null,
			_currentValue2: null,
			_threadCount: 0,
			_currentRenderer: null,
			_currentRenderer2: null
		}, g_ = Df.unstable_now, __ = console.createTask ? console.createTask : function() {
			return null;
		}, v_ = 1, y_ = 2, b_ = -0, x_ = -0, S_ = -0, C_ = null, w_ = -1.1, T_ = -0, E_ = -0, q = -1.1, J = -1.1, D_ = null, O_ = !1, k_ = -0, A_ = -1.1, j_ = null, M_ = 0, N_ = null, P_ = null, F_ = -1.1, I_ = null, L_ = -1.1, R_ = -1.1, z_ = -0, B_ = -1.1, V_ = -1.1, H_ = 0, U_ = null, W_ = null, G_ = null, K_ = -1.1, q_ = null, J_ = -1.1, Y_ = -1.1, X_ = -0, Z_ = -0, Q_ = 0, $_ = null, ev = 0, tv = -1.1, nv = !1, rv = !1, iv = null, av = 0, ov = 0, sv = null, cv = V.S;
		V.S = function(e, t) {
			if (vx = Sp(), typeof t == "object" && t && typeof t.then == "function") {
				if (0 > B_ && 0 > V_) {
					B_ = g_();
					var n = Ku(), r = Gu();
					(n !== J_ || r !== q_) && (J_ = -1.1), K_ = n, q_ = r;
				}
				ki(e, t);
			}
			cv !== null && cv(e, t);
		};
		var lv = ae(null), uv = {
			recordUnsafeLifecycleWarnings: function() {},
			flushPendingUnsafeLifecycleWarnings: function() {},
			recordLegacyContextWarning: function() {},
			flushLegacyContextWarning: function() {},
			discardPendingWarnings: function() {}
		}, dv = [], fv = [], pv = [], mv = [], hv = [], gv = [], _v = /* @__PURE__ */ new Set();
		uv.recordUnsafeLifecycleWarnings = function(e, t) {
			_v.has(e.type) || (typeof t.componentWillMount == "function" && !0 !== t.componentWillMount.__suppressDeprecationWarning && dv.push(e), e.mode & Rg && typeof t.UNSAFE_componentWillMount == "function" && fv.push(e), typeof t.componentWillReceiveProps == "function" && !0 !== t.componentWillReceiveProps.__suppressDeprecationWarning && pv.push(e), e.mode & Rg && typeof t.UNSAFE_componentWillReceiveProps == "function" && mv.push(e), typeof t.componentWillUpdate == "function" && !0 !== t.componentWillUpdate.__suppressDeprecationWarning && hv.push(e), e.mode & Rg && typeof t.UNSAFE_componentWillUpdate == "function" && gv.push(e));
		}, uv.flushPendingUnsafeLifecycleWarnings = function() {
			var e = /* @__PURE__ */ new Set();
			0 < dv.length && (dv.forEach(function(t) {
				e.add(T(t) || "Component"), _v.add(t.type);
			}), dv = []);
			var t = /* @__PURE__ */ new Set();
			0 < fv.length && (fv.forEach(function(e) {
				t.add(T(e) || "Component"), _v.add(e.type);
			}), fv = []);
			var n = /* @__PURE__ */ new Set();
			0 < pv.length && (pv.forEach(function(e) {
				n.add(T(e) || "Component"), _v.add(e.type);
			}), pv = []);
			var r = /* @__PURE__ */ new Set();
			0 < mv.length && (mv.forEach(function(e) {
				r.add(T(e) || "Component"), _v.add(e.type);
			}), mv = []);
			var i = /* @__PURE__ */ new Set();
			0 < hv.length && (hv.forEach(function(e) {
				i.add(T(e) || "Component"), _v.add(e.type);
			}), hv = []);
			var a = /* @__PURE__ */ new Set();
			if (0 < gv.length && (gv.forEach(function(e) {
				a.add(T(e) || "Component"), _v.add(e.type);
			}), gv = []), 0 < t.size) {
				var o = p(t);
				console.error("Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://react.dev/link/unsafe-component-lifecycles for details.\n\n* Move code with side effects to componentDidMount, and set initial state in the constructor.\n\nPlease update the following components: %s", o);
			}
			0 < r.size && (o = p(r), console.error("Using UNSAFE_componentWillReceiveProps in strict mode is not recommended and may indicate bugs in your code. See https://react.dev/link/unsafe-component-lifecycles for details.\n\n* Move data fetching code or side effects to componentDidUpdate.\n* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://react.dev/link/derived-state\n\nPlease update the following components: %s", o)), 0 < a.size && (o = p(a), console.error("Using UNSAFE_componentWillUpdate in strict mode is not recommended and may indicate bugs in your code. See https://react.dev/link/unsafe-component-lifecycles for details.\n\n* Move data fetching code or side effects to componentDidUpdate.\n\nPlease update the following components: %s", o)), 0 < e.size && (o = p(e), console.warn("componentWillMount has been renamed, and is not recommended for use. See https://react.dev/link/unsafe-component-lifecycles for details.\n\n* Move code with side effects to componentDidMount, and set initial state in the constructor.\n* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run `npx react-codemod rename-unsafe-lifecycles` in your project source folder.\n\nPlease update the following components: %s", o)), 0 < n.size && (o = p(n), console.warn("componentWillReceiveProps has been renamed, and is not recommended for use. See https://react.dev/link/unsafe-component-lifecycles for details.\n\n* Move data fetching code or side effects to componentDidUpdate.\n* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://react.dev/link/derived-state\n* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run `npx react-codemod rename-unsafe-lifecycles` in your project source folder.\n\nPlease update the following components: %s", o)), 0 < i.size && (o = p(i), console.warn("componentWillUpdate has been renamed, and is not recommended for use. See https://react.dev/link/unsafe-component-lifecycles for details.\n\n* Move data fetching code or side effects to componentDidUpdate.\n* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run `npx react-codemod rename-unsafe-lifecycles` in your project source folder.\n\nPlease update the following components: %s", o));
		};
		var vv = /* @__PURE__ */ new Map(), yv = /* @__PURE__ */ new Set();
		uv.recordLegacyContextWarning = function(e, t) {
			for (var n = null, r = e; r !== null;) r.mode & Rg && (n = r), r = r.return;
			n === null ? console.error("Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.") : !yv.has(e.type) && (r = vv.get(n), e.type.contextTypes != null || e.type.childContextTypes != null || t !== null && typeof t.getChildContext == "function") && (r === void 0 && (r = [], vv.set(n, r)), r.push(e));
		}, uv.flushLegacyContextWarning = function() {
			vv.forEach(function(e) {
				if (e.length !== 0) {
					var t = e[0], n = /* @__PURE__ */ new Set();
					e.forEach(function(e) {
						n.add(T(e) || "Component"), yv.add(e.type);
					});
					var r = p(n);
					k(t, function() {
						console.error("Legacy context API has been detected within a strict-mode tree.\n\nThe old API will be supported in all 16.x releases, but applications using it should migrate to the new version.\n\nPlease update the following components: %s\n\nLearn more about this warning here: https://react.dev/link/legacy-context", r);
					});
				}
			});
		}, uv.discardPendingWarnings = function() {
			dv = [], fv = [], pv = [], mv = [], hv = [], gv = [], vv = /* @__PURE__ */ new Map();
		};
		var bv = { react_stack_bottom_frame: function(e, t, n) {
			var r = gp;
			gp = !0;
			try {
				return e(t, n);
			} finally {
				gp = r;
			}
		} }, xv = bv.react_stack_bottom_frame.bind(bv), Sv = { react_stack_bottom_frame: function(e) {
			var t = gp;
			gp = !0;
			try {
				return e.render();
			} finally {
				gp = t;
			}
		} }, Cv = Sv.react_stack_bottom_frame.bind(Sv), wv = { react_stack_bottom_frame: function(e, t) {
			try {
				t.componentDidMount();
			} catch (t) {
				Il(e, e.return, t);
			}
		} }, Tv = wv.react_stack_bottom_frame.bind(wv), Ev = { react_stack_bottom_frame: function(e, t, n, r, i) {
			try {
				t.componentDidUpdate(n, r, i);
			} catch (t) {
				Il(e, e.return, t);
			}
		} }, Dv = Ev.react_stack_bottom_frame.bind(Ev), Ov = { react_stack_bottom_frame: function(e, t) {
			var n = t.stack;
			e.componentDidCatch(t.value, { componentStack: n === null ? "" : n });
		} }, kv = Ov.react_stack_bottom_frame.bind(Ov), Av = { react_stack_bottom_frame: function(e, t, n) {
			try {
				n.componentWillUnmount();
			} catch (n) {
				Il(e, t, n);
			}
		} }, jv = Av.react_stack_bottom_frame.bind(Av), Mv = { react_stack_bottom_frame: function(e) {
			var t = e.create;
			return e = e.inst, t = t(), e.destroy = t;
		} }, Nv = Mv.react_stack_bottom_frame.bind(Mv), Pv = { react_stack_bottom_frame: function(e, t, n) {
			try {
				n();
			} catch (n) {
				Il(e, t, n);
			}
		} }, Fv = Pv.react_stack_bottom_frame.bind(Pv), Iv = { react_stack_bottom_frame: function(e) {
			var t = e._init;
			return t(e._payload);
		} }, Lv = Iv.react_stack_bottom_frame.bind(Iv), Rv = Error("Suspense Exception: This is not a real error! It's an implementation detail of `use` to interrupt the current render. You must either rethrow it immediately, or move the `use` call outside of the `try/catch` block. Capturing without rethrowing will lead to unexpected behavior.\n\nTo handle async errors, wrap your component in an error boundary, or call the promise's `.catch` method and pass the result to `use`."), zv = Error("Suspense Exception: This is not a real error, and should not leak into userspace. If you're seeing this, it's likely a bug in React."), Bv = Error("Suspense Exception: This is not a real error! It's an implementation detail of `useActionState` to interrupt the current render. You must either rethrow it immediately, or move the `useActionState` call outside of the `try/catch` block. Capturing without rethrowing will lead to unexpected behavior.\n\nTo handle async errors, wrap your component in an error boundary."), Vv = { then: function() {
			console.error("Internal React error: A listener was unexpectedly attached to a \"noop\" thenable. This is a bug in React. Please file an issue.");
		} }, Hv = null, Uv = !1, Wv = null, Gv = 0, Y = null, Kv, qv = Kv = !1, Jv = {}, Yv = {}, Xv = {};
		f = function(e, t, n) {
			if (typeof n == "object" && n && n._store && (!n._store.validated && n.key == null || n._store.validated === 2)) {
				if (typeof n._store != "object") throw Error("React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.");
				n._store.validated = 1;
				var r = T(e), i = r || "null";
				if (!Jv[i]) {
					Jv[i] = !0, n = n._owner, e = e._debugOwner;
					var a = "";
					e && typeof e.tag == "number" && (i = T(e)) && (a = "\n\nCheck the render method of `" + i + "`."), a || r && (a = "\n\nCheck the top-level render call using <" + r + ">.");
					var o = "";
					n != null && e !== n && (r = null, typeof n.tag == "number" ? r = T(n) : typeof n.name == "string" && (r = n.name), r && (o = " It was passed a child from " + r + ".")), k(t, function() {
						console.error("Each child in a list should have a unique \"key\" prop.%s%s See https://react.dev/link/warning-keys for more information.", a, o);
					});
				}
			}
		};
		var Zv = Zi(!0), Qv = Zi(!1), $v = 0, ey = 1, ty = 2, ny = 3, ry = !1, iy = !1, ay = null, oy = !1, sy = ae(null), cy = ae(0), ly = ae(null), uy = null, dy = 1, fy = 2, py = ae(0), my = 0, hy = 1, gy = 2, _y = 4, vy = 8, yy, by = /* @__PURE__ */ new Set(), xy = /* @__PURE__ */ new Set(), Sy = /* @__PURE__ */ new Set(), Cy = /* @__PURE__ */ new Set(), wy = 0, X = null, Ty = null, Ey = null, Dy = !1, Oy = !1, ky = !1, Ay = 0, jy = 0, My = null, Ny = 0, Py = 25, Z = null, Fy = null, Iy = -1, Ly = !1, Ry = {
			readContext: ii,
			use: Pa,
			useCallback: xa,
			useContext: xa,
			useEffect: xa,
			useImperativeHandle: xa,
			useLayoutEffect: xa,
			useInsertionEffect: xa,
			useMemo: xa,
			useReducer: xa,
			useRef: xa,
			useState: xa,
			useDebugValue: xa,
			useDeferredValue: xa,
			useTransition: xa,
			useSyncExternalStore: xa,
			useId: xa,
			useHostTransitionStatus: xa,
			useFormState: xa,
			useActionState: xa,
			useOptimistic: xa,
			useMemoCache: xa,
			useCacheRefresh: xa
		};
		Ry.useEffectEvent = xa;
		var zy = null, By = null, Vy = null, Hy = null, Uy = null, Wy = null, Gy = null;
		zy = {
			readContext: function(e) {
				return ii(e);
			},
			use: Pa,
			useCallback: function(e, t) {
				return Z = "useCallback", M(), ya(t), So(e, t);
			},
			useContext: function(e) {
				return Z = "useContext", M(), ii(e);
			},
			useEffect: function(e, t) {
				return Z = "useEffect", M(), ya(t), _o(e, t);
			},
			useImperativeHandle: function(e, t, n) {
				return Z = "useImperativeHandle", M(), ya(n), bo(e, t, n);
			},
			useInsertionEffect: function(e, t) {
				Z = "useInsertionEffect", M(), ya(t), ho(4, gy, e, t);
			},
			useLayoutEffect: function(e, t) {
				return Z = "useLayoutEffect", M(), ya(t), I(e, t);
			},
			useMemo: function(e, t) {
				Z = "useMemo", M(), ya(t);
				var n = V.H;
				V.H = Uy;
				try {
					return wo(e, t);
				} finally {
					V.H = n;
				}
			},
			useReducer: function(e, t, n) {
				Z = "useReducer", M();
				var r = V.H;
				V.H = Uy;
				try {
					return La(e, t, n);
				} finally {
					V.H = r;
				}
			},
			useRef: function(e) {
				return Z = "useRef", M(), mo(e);
			},
			useState: function(e) {
				Z = "useState", M();
				var t = V.H;
				V.H = Uy;
				try {
					return Ya(e);
				} finally {
					V.H = t;
				}
			},
			useDebugValue: function() {
				Z = "useDebugValue", M();
			},
			useDeferredValue: function(e, t) {
				return Z = "useDeferredValue", M(), Eo(e, t);
			},
			useTransition: function() {
				return Z = "useTransition", M(), Io();
			},
			useSyncExternalStore: function(e, t, n) {
				return Z = "useSyncExternalStore", M(), Va(e, t, n);
			},
			useId: function() {
				return Z = "useId", M(), Bo();
			},
			useFormState: function(e, t) {
				return Z = "useFormState", M(), ba(), so(e, t);
			},
			useActionState: function(e, t) {
				return Z = "useActionState", M(), so(e, t);
			},
			useOptimistic: function(e) {
				return Z = "useOptimistic", M(), Xa(e);
			},
			useHostTransitionStatus: zo,
			useMemoCache: Fa,
			useCacheRefresh: function() {
				return Z = "useCacheRefresh", M(), Vo();
			},
			useEffectEvent: function(e) {
				return Z = "useEffectEvent", M(), vo(e);
			}
		}, By = {
			readContext: function(e) {
				return ii(e);
			},
			use: Pa,
			useCallback: function(e, t) {
				return Z = "useCallback", N(), So(e, t);
			},
			useContext: function(e) {
				return Z = "useContext", N(), ii(e);
			},
			useEffect: function(e, t) {
				return Z = "useEffect", N(), _o(e, t);
			},
			useImperativeHandle: function(e, t, n) {
				return Z = "useImperativeHandle", N(), bo(e, t, n);
			},
			useInsertionEffect: function(e, t) {
				Z = "useInsertionEffect", N(), ho(4, gy, e, t);
			},
			useLayoutEffect: function(e, t) {
				return Z = "useLayoutEffect", N(), I(e, t);
			},
			useMemo: function(e, t) {
				Z = "useMemo", N();
				var n = V.H;
				V.H = Uy;
				try {
					return wo(e, t);
				} finally {
					V.H = n;
				}
			},
			useReducer: function(e, t, n) {
				Z = "useReducer", N();
				var r = V.H;
				V.H = Uy;
				try {
					return La(e, t, n);
				} finally {
					V.H = r;
				}
			},
			useRef: function(e) {
				return Z = "useRef", N(), mo(e);
			},
			useState: function(e) {
				Z = "useState", N();
				var t = V.H;
				V.H = Uy;
				try {
					return Ya(e);
				} finally {
					V.H = t;
				}
			},
			useDebugValue: function() {
				Z = "useDebugValue", N();
			},
			useDeferredValue: function(e, t) {
				return Z = "useDeferredValue", N(), Eo(e, t);
			},
			useTransition: function() {
				return Z = "useTransition", N(), Io();
			},
			useSyncExternalStore: function(e, t, n) {
				return Z = "useSyncExternalStore", N(), Va(e, t, n);
			},
			useId: function() {
				return Z = "useId", N(), Bo();
			},
			useActionState: function(e, t) {
				return Z = "useActionState", N(), so(e, t);
			},
			useFormState: function(e, t) {
				return Z = "useFormState", N(), ba(), so(e, t);
			},
			useOptimistic: function(e) {
				return Z = "useOptimistic", N(), Xa(e);
			},
			useHostTransitionStatus: zo,
			useMemoCache: Fa,
			useCacheRefresh: function() {
				return Z = "useCacheRefresh", N(), Vo();
			},
			useEffectEvent: function(e) {
				return Z = "useEffectEvent", N(), vo(e);
			}
		}, Vy = {
			readContext: function(e) {
				return ii(e);
			},
			use: Pa,
			useCallback: function(e, t) {
				return Z = "useCallback", N(), Co(e, t);
			},
			useContext: function(e) {
				return Z = "useContext", N(), ii(e);
			},
			useEffect: function(e, t) {
				Z = "useEffect", N(), go(2048, vy, e, t);
			},
			useImperativeHandle: function(e, t, n) {
				return Z = "useImperativeHandle", N(), xo(e, t, n);
			},
			useInsertionEffect: function(e, t) {
				return Z = "useInsertionEffect", N(), go(4, gy, e, t);
			},
			useLayoutEffect: function(e, t) {
				return Z = "useLayoutEffect", N(), go(4, _y, e, t);
			},
			useMemo: function(e, t) {
				Z = "useMemo", N();
				var n = V.H;
				V.H = Wy;
				try {
					return To(e, t);
				} finally {
					V.H = n;
				}
			},
			useReducer: function(e, t, n) {
				Z = "useReducer", N();
				var r = V.H;
				V.H = Wy;
				try {
					return Ra(e, t, n);
				} finally {
					V.H = r;
				}
			},
			useRef: function() {
				return Z = "useRef", N(), ja().memoizedState;
			},
			useState: function() {
				Z = "useState", N();
				var e = V.H;
				V.H = Wy;
				try {
					return Ra(Ia);
				} finally {
					V.H = e;
				}
			},
			useDebugValue: function() {
				Z = "useDebugValue", N();
			},
			useDeferredValue: function(e, t) {
				return Z = "useDeferredValue", N(), Do(e, t);
			},
			useTransition: function() {
				return Z = "useTransition", N(), Lo();
			},
			useSyncExternalStore: function(e, t, n) {
				return Z = "useSyncExternalStore", N(), Ha(e, t, n);
			},
			useId: function() {
				return Z = "useId", N(), ja().memoizedState;
			},
			useFormState: function(e) {
				return Z = "useFormState", N(), ba(), co(e);
			},
			useActionState: function(e) {
				return Z = "useActionState", N(), co(e);
			},
			useOptimistic: function(e, t) {
				return Z = "useOptimistic", N(), Za(e, t);
			},
			useHostTransitionStatus: zo,
			useMemoCache: Fa,
			useCacheRefresh: function() {
				return Z = "useCacheRefresh", N(), ja().memoizedState;
			},
			useEffectEvent: function(e) {
				return Z = "useEffectEvent", N(), F(e);
			}
		}, Hy = {
			readContext: function(e) {
				return ii(e);
			},
			use: Pa,
			useCallback: function(e, t) {
				return Z = "useCallback", N(), Co(e, t);
			},
			useContext: function(e) {
				return Z = "useContext", N(), ii(e);
			},
			useEffect: function(e, t) {
				Z = "useEffect", N(), go(2048, vy, e, t);
			},
			useImperativeHandle: function(e, t, n) {
				return Z = "useImperativeHandle", N(), xo(e, t, n);
			},
			useInsertionEffect: function(e, t) {
				return Z = "useInsertionEffect", N(), go(4, gy, e, t);
			},
			useLayoutEffect: function(e, t) {
				return Z = "useLayoutEffect", N(), go(4, _y, e, t);
			},
			useMemo: function(e, t) {
				Z = "useMemo", N();
				var n = V.H;
				V.H = Gy;
				try {
					return To(e, t);
				} finally {
					V.H = n;
				}
			},
			useReducer: function(e, t, n) {
				Z = "useReducer", N();
				var r = V.H;
				V.H = Gy;
				try {
					return Ba(e, t, n);
				} finally {
					V.H = r;
				}
			},
			useRef: function() {
				return Z = "useRef", N(), ja().memoizedState;
			},
			useState: function() {
				Z = "useState", N();
				var e = V.H;
				V.H = Gy;
				try {
					return Ba(Ia);
				} finally {
					V.H = e;
				}
			},
			useDebugValue: function() {
				Z = "useDebugValue", N();
			},
			useDeferredValue: function(e, t) {
				return Z = "useDeferredValue", N(), Oo(e, t);
			},
			useTransition: function() {
				return Z = "useTransition", N(), Ro();
			},
			useSyncExternalStore: function(e, t, n) {
				return Z = "useSyncExternalStore", N(), Ha(e, t, n);
			},
			useId: function() {
				return Z = "useId", N(), ja().memoizedState;
			},
			useFormState: function(e) {
				return Z = "useFormState", N(), ba(), fo(e);
			},
			useActionState: function(e) {
				return Z = "useActionState", N(), fo(e);
			},
			useOptimistic: function(e, t) {
				return Z = "useOptimistic", N(), $a(e, t);
			},
			useHostTransitionStatus: zo,
			useMemoCache: Fa,
			useCacheRefresh: function() {
				return Z = "useCacheRefresh", N(), ja().memoizedState;
			},
			useEffectEvent: function(e) {
				return Z = "useEffectEvent", N(), F(e);
			}
		}, Uy = {
			readContext: function(e) {
				return l(), ii(e);
			},
			use: function(e) {
				return c(), Pa(e);
			},
			useCallback: function(e, t) {
				return Z = "useCallback", c(), M(), So(e, t);
			},
			useContext: function(e) {
				return Z = "useContext", c(), M(), ii(e);
			},
			useEffect: function(e, t) {
				return Z = "useEffect", c(), M(), _o(e, t);
			},
			useImperativeHandle: function(e, t, n) {
				return Z = "useImperativeHandle", c(), M(), bo(e, t, n);
			},
			useInsertionEffect: function(e, t) {
				Z = "useInsertionEffect", c(), M(), ho(4, gy, e, t);
			},
			useLayoutEffect: function(e, t) {
				return Z = "useLayoutEffect", c(), M(), I(e, t);
			},
			useMemo: function(e, t) {
				Z = "useMemo", c(), M();
				var n = V.H;
				V.H = Uy;
				try {
					return wo(e, t);
				} finally {
					V.H = n;
				}
			},
			useReducer: function(e, t, n) {
				Z = "useReducer", c(), M();
				var r = V.H;
				V.H = Uy;
				try {
					return La(e, t, n);
				} finally {
					V.H = r;
				}
			},
			useRef: function(e) {
				return Z = "useRef", c(), M(), mo(e);
			},
			useState: function(e) {
				Z = "useState", c(), M();
				var t = V.H;
				V.H = Uy;
				try {
					return Ya(e);
				} finally {
					V.H = t;
				}
			},
			useDebugValue: function() {
				Z = "useDebugValue", c(), M();
			},
			useDeferredValue: function(e, t) {
				return Z = "useDeferredValue", c(), M(), Eo(e, t);
			},
			useTransition: function() {
				return Z = "useTransition", c(), M(), Io();
			},
			useSyncExternalStore: function(e, t, n) {
				return Z = "useSyncExternalStore", c(), M(), Va(e, t, n);
			},
			useId: function() {
				return Z = "useId", c(), M(), Bo();
			},
			useFormState: function(e, t) {
				return Z = "useFormState", c(), M(), so(e, t);
			},
			useActionState: function(e, t) {
				return Z = "useActionState", c(), M(), so(e, t);
			},
			useOptimistic: function(e) {
				return Z = "useOptimistic", c(), M(), Xa(e);
			},
			useMemoCache: function(e) {
				return c(), Fa(e);
			},
			useHostTransitionStatus: zo,
			useCacheRefresh: function() {
				return Z = "useCacheRefresh", M(), Vo();
			},
			useEffectEvent: function(e) {
				return Z = "useEffectEvent", c(), M(), vo(e);
			}
		}, Wy = {
			readContext: function(e) {
				return l(), ii(e);
			},
			use: function(e) {
				return c(), Pa(e);
			},
			useCallback: function(e, t) {
				return Z = "useCallback", c(), N(), Co(e, t);
			},
			useContext: function(e) {
				return Z = "useContext", c(), N(), ii(e);
			},
			useEffect: function(e, t) {
				Z = "useEffect", c(), N(), go(2048, vy, e, t);
			},
			useImperativeHandle: function(e, t, n) {
				return Z = "useImperativeHandle", c(), N(), xo(e, t, n);
			},
			useInsertionEffect: function(e, t) {
				return Z = "useInsertionEffect", c(), N(), go(4, gy, e, t);
			},
			useLayoutEffect: function(e, t) {
				return Z = "useLayoutEffect", c(), N(), go(4, _y, e, t);
			},
			useMemo: function(e, t) {
				Z = "useMemo", c(), N();
				var n = V.H;
				V.H = Wy;
				try {
					return To(e, t);
				} finally {
					V.H = n;
				}
			},
			useReducer: function(e, t, n) {
				Z = "useReducer", c(), N();
				var r = V.H;
				V.H = Wy;
				try {
					return Ra(e, t, n);
				} finally {
					V.H = r;
				}
			},
			useRef: function() {
				return Z = "useRef", c(), N(), ja().memoizedState;
			},
			useState: function() {
				Z = "useState", c(), N();
				var e = V.H;
				V.H = Wy;
				try {
					return Ra(Ia);
				} finally {
					V.H = e;
				}
			},
			useDebugValue: function() {
				Z = "useDebugValue", c(), N();
			},
			useDeferredValue: function(e, t) {
				return Z = "useDeferredValue", c(), N(), Do(e, t);
			},
			useTransition: function() {
				return Z = "useTransition", c(), N(), Lo();
			},
			useSyncExternalStore: function(e, t, n) {
				return Z = "useSyncExternalStore", c(), N(), Ha(e, t, n);
			},
			useId: function() {
				return Z = "useId", c(), N(), ja().memoizedState;
			},
			useFormState: function(e) {
				return Z = "useFormState", c(), N(), co(e);
			},
			useActionState: function(e) {
				return Z = "useActionState", c(), N(), co(e);
			},
			useOptimistic: function(e, t) {
				return Z = "useOptimistic", c(), N(), Za(e, t);
			},
			useMemoCache: function(e) {
				return c(), Fa(e);
			},
			useHostTransitionStatus: zo,
			useCacheRefresh: function() {
				return Z = "useCacheRefresh", N(), ja().memoizedState;
			},
			useEffectEvent: function(e) {
				return Z = "useEffectEvent", c(), N(), F(e);
			}
		}, Gy = {
			readContext: function(e) {
				return l(), ii(e);
			},
			use: function(e) {
				return c(), Pa(e);
			},
			useCallback: function(e, t) {
				return Z = "useCallback", c(), N(), Co(e, t);
			},
			useContext: function(e) {
				return Z = "useContext", c(), N(), ii(e);
			},
			useEffect: function(e, t) {
				Z = "useEffect", c(), N(), go(2048, vy, e, t);
			},
			useImperativeHandle: function(e, t, n) {
				return Z = "useImperativeHandle", c(), N(), xo(e, t, n);
			},
			useInsertionEffect: function(e, t) {
				return Z = "useInsertionEffect", c(), N(), go(4, gy, e, t);
			},
			useLayoutEffect: function(e, t) {
				return Z = "useLayoutEffect", c(), N(), go(4, _y, e, t);
			},
			useMemo: function(e, t) {
				Z = "useMemo", c(), N();
				var n = V.H;
				V.H = Wy;
				try {
					return To(e, t);
				} finally {
					V.H = n;
				}
			},
			useReducer: function(e, t, n) {
				Z = "useReducer", c(), N();
				var r = V.H;
				V.H = Wy;
				try {
					return Ba(e, t, n);
				} finally {
					V.H = r;
				}
			},
			useRef: function() {
				return Z = "useRef", c(), N(), ja().memoizedState;
			},
			useState: function() {
				Z = "useState", c(), N();
				var e = V.H;
				V.H = Wy;
				try {
					return Ba(Ia);
				} finally {
					V.H = e;
				}
			},
			useDebugValue: function() {
				Z = "useDebugValue", c(), N();
			},
			useDeferredValue: function(e, t) {
				return Z = "useDeferredValue", c(), N(), Oo(e, t);
			},
			useTransition: function() {
				return Z = "useTransition", c(), N(), Ro();
			},
			useSyncExternalStore: function(e, t, n) {
				return Z = "useSyncExternalStore", c(), N(), Ha(e, t, n);
			},
			useId: function() {
				return Z = "useId", c(), N(), ja().memoizedState;
			},
			useFormState: function(e) {
				return Z = "useFormState", c(), N(), fo(e);
			},
			useActionState: function(e) {
				return Z = "useActionState", c(), N(), fo(e);
			},
			useOptimistic: function(e, t) {
				return Z = "useOptimistic", c(), N(), $a(e, t);
			},
			useMemoCache: function(e) {
				return c(), Fa(e);
			},
			useHostTransitionStatus: zo,
			useCacheRefresh: function() {
				return Z = "useCacheRefresh", N(), ja().memoizedState;
			},
			useEffectEvent: function(e) {
				return Z = "useEffectEvent", c(), N(), F(e);
			}
		};
		var Ky = {}, qy = /* @__PURE__ */ new Set(), Jy = /* @__PURE__ */ new Set(), Yy = /* @__PURE__ */ new Set(), Xy = /* @__PURE__ */ new Set(), Zy = /* @__PURE__ */ new Set(), Qy = /* @__PURE__ */ new Set(), $y = /* @__PURE__ */ new Set(), eb = /* @__PURE__ */ new Set(), tb = /* @__PURE__ */ new Set(), nb = /* @__PURE__ */ new Set();
		Object.freeze(Ky);
		var rb = {
			enqueueSetState: function(e, t, n) {
				e = e._reactInternals;
				var r = el(e), i = ta(r);
				i.payload = t, n != null && (Xo(n), i.callback = n), t = na(e, i, r), t !== null && (ui(r, "this.setState()", e), nl(t, e, r), ra(t, e, r));
			},
			enqueueReplaceState: function(e, t, n) {
				e = e._reactInternals;
				var r = el(e), i = ta(r);
				i.tag = ey, i.payload = t, n != null && (Xo(n), i.callback = n), t = na(e, i, r), t !== null && (ui(r, "this.replaceState()", e), nl(t, e, r), ra(t, e, r));
			},
			enqueueForceUpdate: function(e, t) {
				e = e._reactInternals;
				var n = el(e), r = ta(n);
				r.tag = ty, t != null && (Xo(t), r.callback = t), t = na(e, r, n), t !== null && (ui(n, "this.forceUpdate()", e), nl(t, e, n), ra(t, e, n));
			}
		}, ib = null, ab = null, ob = Error("This is not a real error. It's an implementation detail of React's selective hydration feature. If this leaks into userspace, it's a bug in React. Please file an issue."), sb = !1, cb = {}, lb = {}, ub = {}, db = {}, fb = !1, pb = {}, mb = {}, hb = {
			dehydrated: null,
			treeContext: null,
			retryLane: 0,
			hydrationErrors: null
		}, gb = !1, _b = null;
		_b = /* @__PURE__ */ new Set();
		var vb = !1, yb = !1, bb = !1, xb = typeof WeakSet == "function" ? WeakSet : Set, Sb = null, Cb = null, wb = null, Tb = null, Eb = !1, Db = null, Ob = !1, kb = 8192, Ab = {
			getCacheForType: function(e) {
				var t = ii(h_), n = t.data.get(e);
				return n === void 0 && (n = e(), t.data.set(e, n)), n;
			},
			cacheSignal: function() {
				return ii(h_).controller.signal;
			},
			getOwner: function() {
				return hp;
			}
		};
		if (typeof Symbol == "function" && Symbol.for) {
			var jb = Symbol.for;
			jb("selector.component"), jb("selector.has_pseudo_class"), jb("selector.role"), jb("selector.test_id"), jb("selector.text");
		}
		var Mb = [], Nb = typeof WeakMap == "function" ? WeakMap : Map, Pb = 0, Fb = 2, Ib = 4, Lb = 0, Rb = 1, zb = 2, Bb = 3, Vb = 4, Hb = 6, Ub = 5, Wb = Pb, Gb = null, Q = null, $ = 0, Kb = 0, qb = 1, Jb = 2, Yb = 3, Xb = 4, Zb = 5, Qb = 6, $b = 7, ex = 8, tx = 9, nx = Kb, rx = null, ix = !1, ax = !1, ox = !1, sx = 0, cx = Lb, lx = 0, ux = 0, dx = 0, fx = 0, px = 0, mx = null, hx = null, gx = !1, _x = 0, vx = 0, yx = 300, bx = Infinity, xx = 500, Sx = null, Cx = null, wx = null, Tx = 0, Ex = 1, Dx = 2, Ox = 3, kx = 0, Ax = 1, jx = 2, Mx = 3, Nx = 4, Px = 5, Fx = 0, Ix = null, Lx = null, Rx = 0, zx = 0, Bx = -0, Vx = null, Hx = null, Ux = null, Wx = Tx, Gx = null, Kx = 50, qx = 0, Jx = null, Yx = !1, Xx = !1, Zx = 50, Qx = 0, $x = null, eS = !1, tS = null, nS = !1, rS = /* @__PURE__ */ new Set(), iS = {}, aS = null, oS = null, sS = !1, cS = !1, lS = !1, uS = !1, dS = 0, fS = {};
		(function() {
			for (var e = 0; e < sg.length; e++) {
				var t = sg[e], n = t.toLowerCase();
				t = t[0].toUpperCase() + t.slice(1), Gn(n, "on" + t);
			}
			Gn($h, "onAnimationEnd"), Gn(eg, "onAnimationIteration"), Gn(tg, "onAnimationStart"), Gn("dblclick", "onDoubleClick"), Gn("focusin", "onFocus"), Gn("focusout", "onBlur"), Gn(ng, "onTransitionRun"), Gn(rg, "onTransitionStart"), Gn(ig, "onTransitionCancel"), Gn(ag, "onTransitionEnd");
		})(), tt("onMouseEnter", ["mouseout", "mouseover"]), tt("onMouseLeave", ["mouseout", "mouseover"]), tt("onPointerEnter", ["pointerout", "pointerover"]), tt("onPointerLeave", ["pointerout", "pointerover"]), et("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), et("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), et("onBeforeInput", [
			"compositionend",
			"keypress",
			"textInput",
			"paste"
		]), et("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), et("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), et("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
		var pS = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mS = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(pS)), hS = "_reactListening" + Math.random().toString(36).slice(2), gS = !1, _S = !1, vS = !1, yS = !1, bS = !1, xS = !1, SS = !1, CS = {}, wS = /\r\n?/g, TS = /\u0000|\uFFFD/g, ES = "http://www.w3.org/1999/xlink", DS = "http://www.w3.org/XML/1998/namespace", OS = "javascript:throw new Error('React form unexpectedly submitted.')", kS = "suppressHydrationWarning", AS = "&", jS = "/&", MS = "$", NS = "/$", PS = "$?", FS = "$~", IS = "$!", LS = "html", RS = "body", zS = "head", BS = "F!", VS = "F", HS = "loading", US = "style", WS = 0, GS = 1, KS = 2, qS = null, JS = null, YS = {
			dialog: !0,
			webview: !0
		}, XS = null, ZS = void 0, QS = typeof setTimeout == "function" ? setTimeout : void 0, $S = typeof clearTimeout == "function" ? clearTimeout : void 0, eC = -1, tC = typeof Promise == "function" ? Promise : void 0, nC = typeof queueMicrotask == "function" ? queueMicrotask : tC === void 0 ? QS : function(e) {
			return tC.resolve(null).then(e).catch(qu);
		}, rC = null, iC = 0, aC = 1, oC = 2, sC = 3, cC = 4, lC = /* @__PURE__ */ new Map(), uC = /* @__PURE__ */ new Set(), dC = Jf.d;
		Jf.d = {
			f: function() {
				var e = dC.f(), t = sl();
				return e || t;
			},
			r: function(e) {
				var t = Xe(e);
				t !== null && t.tag === 5 && t.type === "form" ? Fo(t) : dC.r(e);
			},
			D: function(e) {
				dC.D(e), Ad("dns-prefetch", e, null);
			},
			C: function(e, t) {
				dC.C(e, t), Ad("preconnect", e, t);
			},
			L: function(e, t, n) {
				dC.L(e, t, n);
				var r = fC;
				if (r && e && t) {
					var i = "link[rel=\"preload\"][as=\"" + mt(t) + "\"]";
					t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + mt(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + mt(n.imageSizes) + "\"]")) : i += "[href=\"" + mt(e) + "\"]";
					var a = i;
					switch (t) {
						case "style":
							a = z(e);
							break;
						case "script": a = Id(e);
					}
					lC.has(a) || (e = B({
						rel: "preload",
						href: t === "image" && n && n.imageSrcSet ? void 0 : e,
						as: t
					}, n), lC.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(Nd(a)) || t === "script" && r.querySelector(Ld(a)) || (t = r.createElement("link"), Eu(t, "link", e), $e(t), r.head.appendChild(t)));
				}
			},
			m: function(e, t) {
				dC.m(e, t);
				var n = fC;
				if (n && e) {
					var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + mt(r) + "\"][href=\"" + mt(e) + "\"]", a = i;
					switch (r) {
						case "audioworklet":
						case "paintworklet":
						case "serviceworker":
						case "sharedworker":
						case "worker":
						case "script": a = Id(e);
					}
					if (!lC.has(a) && (e = B({
						rel: "modulepreload",
						href: e
					}, t), lC.set(a, e), n.querySelector(i) === null)) {
						switch (r) {
							case "audioworklet":
							case "paintworklet":
							case "serviceworker":
							case "sharedworker":
							case "worker":
							case "script": if (n.querySelector(Ld(a))) return;
						}
						r = n.createElement("link"), Eu(r, "link", e), $e(r), n.head.appendChild(r);
					}
				}
			},
			X: function(e, t) {
				dC.X(e, t);
				var n = fC;
				if (n && e) {
					var r = Qe(n).hoistableScripts, i = Id(e), a = r.get(i);
					a || (a = n.querySelector(Ld(i)), a || (e = B({
						src: e,
						async: !0
					}, t), (t = lC.get(i)) && Vd(e, t), a = n.createElement("script"), $e(a), Eu(a, "link", e), n.head.appendChild(a)), a = {
						type: "script",
						instance: a,
						count: 1,
						state: null
					}, r.set(i, a));
				}
			},
			S: function(e, t, n) {
				dC.S(e, t, n);
				var r = fC;
				if (r && e) {
					var i = Qe(r).hoistableStyles, a = z(e);
					t ||= "default";
					var o = i.get(a);
					if (!o) {
						var s = {
							loading: iC,
							preload: null
						};
						if (o = r.querySelector(Nd(a))) s.loading = aC | cC;
						else {
							e = B({
								rel: "stylesheet",
								href: e,
								"data-precedence": t
							}, n), (n = lC.get(a)) && Bd(e, n);
							var c = o = r.createElement("link");
							$e(c), Eu(c, "link", e), c._p = new Promise(function(e, t) {
								c.onload = e, c.onerror = t;
							}), c.addEventListener("load", function() {
								s.loading |= aC;
							}), c.addEventListener("error", function() {
								s.loading |= oC;
							}), s.loading |= cC, zd(o, t, r);
						}
						o = {
							type: "stylesheet",
							instance: o,
							count: 1,
							state: s
						}, i.set(a, o);
					}
				}
			},
			M: function(e, t) {
				dC.M(e, t);
				var n = fC;
				if (n && e) {
					var r = Qe(n).hoistableScripts, i = Id(e), a = r.get(i);
					a || (a = n.querySelector(Ld(i)), a || (e = B({
						src: e,
						async: !0,
						type: "module"
					}, t), (t = lC.get(i)) && Vd(e, t), a = n.createElement("script"), $e(a), Eu(a, "link", e), n.head.appendChild(a)), a = {
						type: "script",
						instance: a,
						count: 1,
						state: null
					}, r.set(i, a));
				}
			}
		};
		var fC = typeof document > "u" ? null : document, pC = null, mC = 6e4, hC = 800, gC = 500, _C = 0, vC = null, yC = null, bC = Yf, xC = {
			$$typeof: Lf,
			Provider: null,
			Consumer: null,
			_currentValue: bC,
			_currentValue2: bC,
			_threadCount: 0
		}, SC = "%c%s%c", CC = "background: #e6e6e6;background: light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.25));color: #000000;color: light-dark(#000000, #ffffff);border-radius: 2px", wC = "", TC = " ", EC = Function.prototype.bind, DC = !1, OC = null, kC = null, AC = null, jC = null, MC = null, NC = null, PC = null, FC = null, IC = null, LC = null;
		OC = function(e, r, i, a) {
			r = t(e, r), r !== null && (i = n(r.memoizedState, i, 0, a), r.memoizedState = i, r.baseState = i, e.memoizedProps = B({}, e.memoizedProps), i = pr(e, 2), i !== null && nl(i, e, 2));
		}, kC = function(e, n, r) {
			n = t(e, n), n !== null && (r = a(n.memoizedState, r, 0), n.memoizedState = r, n.baseState = r, e.memoizedProps = B({}, e.memoizedProps), r = pr(e, 2), r !== null && nl(r, e, 2));
		}, AC = function(e, n, i, a) {
			n = t(e, n), n !== null && (i = r(n.memoizedState, i, a), n.memoizedState = i, n.baseState = i, e.memoizedProps = B({}, e.memoizedProps), i = pr(e, 2), i !== null && nl(i, e, 2));
		}, jC = function(e, t, r) {
			e.pendingProps = n(e.memoizedProps, t, 0, r), e.alternate && (e.alternate.pendingProps = e.pendingProps), t = pr(e, 2), t !== null && nl(t, e, 2);
		}, MC = function(e, t) {
			e.pendingProps = a(e.memoizedProps, t, 0), e.alternate && (e.alternate.pendingProps = e.pendingProps), t = pr(e, 2), t !== null && nl(t, e, 2);
		}, NC = function(e, t, n) {
			e.pendingProps = r(e.memoizedProps, t, n), e.alternate && (e.alternate.pendingProps = e.pendingProps), t = pr(e, 2), t !== null && nl(t, e, 2);
		}, PC = function(e) {
			var t = pr(e, 2);
			t !== null && nl(t, e, 2);
		}, FC = function(e) {
			var t = Fe(), n = pr(e, t);
			n !== null && nl(n, e, t);
		}, IC = function(e) {
			s = e;
		}, LC = function(e) {
			o = e;
		};
		var RC = !0, zC = null, BC = !1, VC = null, HC = null, UC = null, WC = /* @__PURE__ */ new Map(), GC = /* @__PURE__ */ new Map(), KC = [], qC = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" "), JC = null;
		if (Tf.prototype.render = wf.prototype.render = function(e) {
			var t = this._internalRoot;
			if (t === null) throw Error("Cannot update an unmounted root.");
			var n = arguments;
			typeof n[1] == "function" ? console.error("does not support the second callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().") : b(n[1]) ? console.error("You passed a container to the second argument of root.render(...). You don't need to pass it again since you already passed it to create the root.") : n[1] !== void 0 && console.error("You passed a second argument to root.render(...) but it only accepts one argument."), n = e;
			var r = t.current;
			ef(r, el(r), n, t, null, null);
		}, Tf.prototype.unmount = wf.prototype.unmount = function() {
			var e = arguments;
			if (typeof e[0] == "function" && console.error("does not support a callback argument. To execute a side effect after rendering, declare it in a component body with useEffect()."), e = this._internalRoot, e !== null) {
				this._internalRoot = null;
				var t = e.containerInfo;
				(Wb & (Fb | Ib)) !== Pb && console.error("Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition."), ef(e.current, 2, null, e, null, null), sl(), t[Jp] = null;
			}
		}, Tf.prototype.unstable_scheduleHydration = function(e) {
			if (e) {
				var t = Ke();
				e = {
					blockedOn: null,
					target: e,
					priority: t
				};
				for (var n = 0; n < KC.length && t !== 0 && t < KC[n].priority; n++);
				KC.splice(n, 0, e), n === 0 && gf(e);
			}
		}, (function() {
			var e = Of.version;
			if (e !== "19.2.6") throw Error("Incompatible React versions: The \"react\" and \"react-dom\" packages must have the exact same version. Instead got:\n  - react:      " + (e + "\n  - react-dom:  19.2.6\nLearn more: https://react.dev/warnings/version-mismatch"));
		})(), typeof Map == "function" && Map.prototype != null && typeof Map.prototype.forEach == "function" && typeof Set == "function" && Set.prototype != null && typeof Set.prototype.clear == "function" && typeof Set.prototype.forEach == "function" || console.error("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://react.dev/link/react-polyfills"), Jf.findDOMNode = function(e) {
			var t = e._reactInternals;
			if (t === void 0) throw typeof e.render == "function" ? Error("Unable to find node on an unmounted component.") : (e = Object.keys(e).join(","), Error("Argument appears to not be a ReactComponent. Keys: " + e));
			return e = te(t), e = e === null ? null : ne(e), e = e === null ? null : e.stateNode, e;
		}, !(function() {
			var e = {
				bundleType: 1,
				version: "19.2.6",
				rendererPackageName: "react-dom",
				currentDispatcherRef: V,
				reconcilerVersion: "19.2.6"
			};
			return e.overrideHookState = OC, e.overrideHookStateDeletePath = kC, e.overrideHookStateRenamePath = AC, e.overrideProps = jC, e.overridePropsDeletePath = MC, e.overridePropsRenamePath = NC, e.scheduleUpdate = PC, e.scheduleRetry = FC, e.setErrorHandler = IC, e.setSuspenseHandler = LC, e.scheduleRefresh = v, e.scheduleRoot = g, e.setRefreshHandler = y, e.getCurrentFiber = of, Oe(e);
		})() && eh && window.top === window.self && (-1 < navigator.userAgent.indexOf("Chrome") && navigator.userAgent.indexOf("Edge") === -1 || -1 < navigator.userAgent.indexOf("Firefox"))) {
			var YC = window.location.protocol;
			/^(https?|file):$/.test(YC) && console.info("%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools" + (YC === "file:" ? "\nYou might need to use a local HTTP server (instead of file://): https://react.dev/link/react-devtools-faq" : ""), "font-weight:bold");
		}
		e.createRoot = function(e, t) {
			if (!b(e)) throw Error("Target container is not a DOM element.");
			Ef(e);
			var n = !1, r = "", i = ts, a = ns, o = rs;
			return t != null && (t.hydrate ? console.warn("hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.") : typeof t == "object" && t && t.$$typeof === jf && console.error("You passed a JSX element to createRoot. You probably meant to call root.render instead. Example usage:\n\n  let root = createRoot(domContainer);\n  root.render(<App />);"), !0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (i = t.onUncaughtError), t.onCaughtError !== void 0 && (a = t.onCaughtError), t.onRecoverableError !== void 0 && (o = t.onRecoverableError)), t = Qd(e, 1, !1, null, null, n, r, null, i, a, o, Cf), e[Jp] = t.current, uu(e), new wf(t);
		}, e.hydrateRoot = function(e, t, n) {
			if (!b(e)) throw Error("Target container is not a DOM element.");
			Ef(e), t === void 0 && console.error("Must provide initial children as second argument to hydrateRoot. Example usage: hydrateRoot(domContainer, <App />)");
			var r = !1, i = "", a = ts, o = ns, s = rs, c = null;
			return n != null && (!0 === n.unstable_strictMode && (r = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onUncaughtError !== void 0 && (a = n.onUncaughtError), n.onCaughtError !== void 0 && (o = n.onCaughtError), n.onRecoverableError !== void 0 && (s = n.onRecoverableError), n.formState !== void 0 && (c = n.formState)), t = Qd(e, 1, !0, t, n ?? null, r, i, c, a, o, s, Cf), t.context = $d(null), n = t.current, r = el(n), r = He(r), i = ta(r), i.callback = null, na(n, i, r), ui(r, "hydrateRoot()", null), n = r, t.current.lanes = n, Le(t, n), Yl(t), e[Jp] = t.current, uu(e), new Tf(t);
		}, e.version = "19.2.6", typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
	})();
})), b = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
			if (process.env.NODE_ENV !== "production") throw Error("^_^");
			try {
				__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
			} catch (e) {
				console.error(e);
			}
		}
	}
	process.env.NODE_ENV === "production" ? (n(), t.exports = v()) : t.exports = y();
})), x = { value: () => {} };
function ee() {
	for (var e = 0, t = arguments.length, n = {}, r; e < t; ++e) {
		if (!(r = arguments[e] + "") || r in n || /[\s.]/.test(r)) throw Error("illegal type: " + r);
		n[r] = [];
	}
	return new S(n);
}
function S(e) {
	this._ = e;
}
function C(e, t) {
	return e.trim().split(/^|\s+/).map(function(e) {
		var n = "", r = e.indexOf(".");
		if (r >= 0 && (n = e.slice(r + 1), e = e.slice(0, r)), e && !t.hasOwnProperty(e)) throw Error("unknown type: " + e);
		return {
			type: e,
			name: n
		};
	});
}
S.prototype = ee.prototype = {
	constructor: S,
	on: function(e, t) {
		var n = this._, r = C(e + "", n), i, a = -1, o = r.length;
		if (arguments.length < 2) {
			for (; ++a < o;) if ((i = (e = r[a]).type) && (i = te(n[i], e.name))) return i;
			return;
		}
		if (t != null && typeof t != "function") throw Error("invalid callback: " + t);
		for (; ++a < o;) if (i = (e = r[a]).type) n[i] = ne(n[i], e.name, t);
		else if (t == null) for (i in n) n[i] = ne(n[i], e.name, null);
		return this;
	},
	copy: function() {
		var e = {}, t = this._;
		for (var n in t) e[n] = t[n].slice();
		return new S(e);
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
function te(e, t) {
	for (var n = 0, r = e.length, i; n < r; ++n) if ((i = e[n]).name === t) return i.value;
}
function ne(e, t, n) {
	for (var r = 0, i = e.length; r < i; ++r) if (e[r].name === t) {
		e[r] = x, e = e.slice(0, r).concat(e.slice(r + 1));
		break;
	}
	return n != null && e.push({
		name: t,
		value: n
	}), e;
}
var re = {
	svg: "http://www.w3.org/2000/svg",
	xhtml: "http://www.w3.org/1999/xhtml",
	xlink: "http://www.w3.org/1999/xlink",
	xml: "http://www.w3.org/XML/1998/namespace",
	xmlns: "http://www.w3.org/2000/xmlns/"
};
//#endregion
//#region node_modules/d3-selection/src/namespace.js
function w(e) {
	var t = e += "", n = t.indexOf(":");
	return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), re.hasOwnProperty(t) ? {
		space: re[t],
		local: e
	} : e;
}
//#endregion
//#region node_modules/d3-selection/src/creator.js
function ie(e) {
	return function() {
		var t = this.ownerDocument, n = this.namespaceURI;
		return n === "http://www.w3.org/1999/xhtml" && t.documentElement.namespaceURI === "http://www.w3.org/1999/xhtml" ? t.createElement(e) : t.createElementNS(n, e);
	};
}
function T(e) {
	return function() {
		return this.ownerDocument.createElementNS(e.space, e.local);
	};
}
function ae(e) {
	var t = w(e);
	return (t.local ? T : ie)(t);
}
//#endregion
//#region node_modules/d3-selection/src/selector.js
function oe() {}
function E(e) {
	return e == null ? oe : function() {
		return this.querySelector(e);
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/select.js
function se(e) {
	typeof e != "function" && (e = E(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = Array(o), c, l, u = 0; u < o; ++u) (c = a[u]) && (l = e.call(c, c.__data__, u, a)) && ("__data__" in c && (l.__data__ = c.__data__), s[u] = l);
	return new Gt(r, this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/array.js
function ce(e) {
	return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
//#endregion
//#region node_modules/d3-selection/src/selectorAll.js
function D() {
	return [];
}
function O(e) {
	return e == null ? D : function() {
		return this.querySelectorAll(e);
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/selectAll.js
function le(e) {
	return function() {
		return ce(e.apply(this, arguments));
	};
}
function ue(e) {
	e = typeof e == "function" ? le(e) : O(e);
	for (var t = this._groups, n = t.length, r = [], i = [], a = 0; a < n; ++a) for (var o = t[a], s = o.length, c, l = 0; l < s; ++l) (c = o[l]) && (r.push(e.call(c, c.__data__, l, o)), i.push(c));
	return new Gt(r, i);
}
//#endregion
//#region node_modules/d3-selection/src/matcher.js
function de(e) {
	return function() {
		return this.matches(e);
	};
}
function fe(e) {
	return function(t) {
		return t.matches(e);
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/selectChild.js
var pe = Array.prototype.find;
function me(e) {
	return function() {
		return pe.call(this.children, e);
	};
}
function he() {
	return this.firstElementChild;
}
function ge(e) {
	return this.select(e == null ? he : me(typeof e == "function" ? e : fe(e)));
}
//#endregion
//#region node_modules/d3-selection/src/selection/selectChildren.js
var _e = Array.prototype.filter;
function ve() {
	return Array.from(this.children);
}
function ye(e) {
	return function() {
		return _e.call(this.children, e);
	};
}
function be(e) {
	return this.selectAll(e == null ? ve : ye(typeof e == "function" ? e : fe(e)));
}
//#endregion
//#region node_modules/d3-selection/src/selection/filter.js
function xe(e) {
	typeof e != "function" && (e = de(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = [], c, l = 0; l < o; ++l) (c = a[l]) && e.call(c, c.__data__, l, a) && s.push(c);
	return new Gt(r, this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/selection/sparse.js
function k(e) {
	return Array(e.length);
}
//#endregion
//#region node_modules/d3-selection/src/selection/enter.js
function Se() {
	return new Gt(this._enter || this._groups.map(k), this._parents);
}
function Ce(e, t) {
	this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
Ce.prototype = {
	constructor: Ce,
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
function we(e) {
	return function() {
		return e;
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/data.js
function Te(e, t, n, r, i, a) {
	for (var o = 0, s, c = t.length, l = a.length; o < l; ++o) (s = t[o]) ? (s.__data__ = a[o], r[o] = s) : n[o] = new Ce(e, a[o]);
	for (; o < c; ++o) (s = t[o]) && (i[o] = s);
}
function A(e, t, n, r, i, a, o) {
	var s, c, l = /* @__PURE__ */ new Map(), u = t.length, d = a.length, f = Array(u), p;
	for (s = 0; s < u; ++s) (c = t[s]) && (f[s] = p = o.call(c, c.__data__, s, t) + "", l.has(p) ? i[s] = c : l.set(p, c));
	for (s = 0; s < d; ++s) p = o.call(e, a[s], s, a) + "", (c = l.get(p)) ? (r[s] = c, c.__data__ = a[s], l.delete(p)) : n[s] = new Ce(e, a[s]);
	for (s = 0; s < u; ++s) (c = t[s]) && l.get(f[s]) === c && (i[s] = c);
}
function Ee(e) {
	return e.__data__;
}
function De(e, t) {
	if (!arguments.length) return Array.from(this, Ee);
	var n = t ? A : Te, r = this._parents, i = this._groups;
	typeof e != "function" && (e = we(e));
	for (var a = i.length, o = Array(a), s = Array(a), c = Array(a), l = 0; l < a; ++l) {
		var u = r[l], d = i[l], f = d.length, p = Oe(e.call(u, u && u.__data__, l, r)), m = p.length, h = s[l] = Array(m), g = o[l] = Array(m);
		n(u, d, h, g, c[l] = Array(f), p, t);
		for (var _ = 0, v = 0, y, b; _ < m; ++_) if (y = h[_]) {
			for (_ >= v && (v = _ + 1); !(b = g[v]) && ++v < m;);
			y._next = b || null;
		}
	}
	return o = new Gt(o, r), o._enter = s, o._exit = c, o;
}
function Oe(e) {
	return typeof e == "object" && "length" in e ? e : Array.from(e);
}
//#endregion
//#region node_modules/d3-selection/src/selection/exit.js
function ke() {
	return new Gt(this._exit || this._groups.map(k), this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/selection/join.js
function Ae(e, t, n) {
	var r = this.enter(), i = this, a = this.exit();
	return typeof e == "function" ? (r = e(r), r &&= r.selection()) : r = r.append(e + ""), t != null && (i = t(i), i &&= i.selection()), n == null ? a.remove() : n(a), r && i ? r.merge(i).order() : i;
}
//#endregion
//#region node_modules/d3-selection/src/selection/merge.js
function je(e) {
	for (var t = e.selection ? e.selection() : e, n = this._groups, r = t._groups, i = n.length, a = r.length, o = Math.min(i, a), s = Array(i), c = 0; c < o; ++c) for (var l = n[c], u = r[c], d = l.length, f = s[c] = Array(d), p, m = 0; m < d; ++m) (p = l[m] || u[m]) && (f[m] = p);
	for (; c < i; ++c) s[c] = n[c];
	return new Gt(s, this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/selection/order.js
function Me() {
	for (var e = this._groups, t = -1, n = e.length; ++t < n;) for (var r = e[t], i = r.length - 1, a = r[i], o; --i >= 0;) (o = r[i]) && (a && o.compareDocumentPosition(a) ^ 4 && a.parentNode.insertBefore(o, a), a = o);
	return this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/sort.js
function Ne(e) {
	e ||= Pe;
	function t(t, n) {
		return t && n ? e(t.__data__, n.__data__) : !t - !n;
	}
	for (var n = this._groups, r = n.length, i = Array(r), a = 0; a < r; ++a) {
		for (var o = n[a], s = o.length, c = i[a] = Array(s), l, u = 0; u < s; ++u) (l = o[u]) && (c[u] = l);
		c.sort(t);
	}
	return new Gt(i, this._parents).order();
}
function Pe(e, t) {
	return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
//#endregion
//#region node_modules/d3-selection/src/selection/call.js
function Fe() {
	var e = arguments[0];
	return arguments[0] = this, e.apply(null, arguments), this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/nodes.js
function Ie() {
	return Array.from(this);
}
//#endregion
//#region node_modules/d3-selection/src/selection/node.js
function Le() {
	for (var e = this._groups, t = 0, n = e.length; t < n; ++t) for (var r = e[t], i = 0, a = r.length; i < a; ++i) {
		var o = r[i];
		if (o) return o;
	}
	return null;
}
//#endregion
//#region node_modules/d3-selection/src/selection/size.js
function Re() {
	let e = 0;
	for (let t of this) ++e;
	return e;
}
//#endregion
//#region node_modules/d3-selection/src/selection/empty.js
function ze() {
	return !this.node();
}
//#endregion
//#region node_modules/d3-selection/src/selection/each.js
function Be(e) {
	for (var t = this._groups, n = 0, r = t.length; n < r; ++n) for (var i = t[n], a = 0, o = i.length, s; a < o; ++a) (s = i[a]) && e.call(s, s.__data__, a, i);
	return this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/attr.js
function Ve(e) {
	return function() {
		this.removeAttribute(e);
	};
}
function He(e) {
	return function() {
		this.removeAttributeNS(e.space, e.local);
	};
}
function Ue(e, t) {
	return function() {
		this.setAttribute(e, t);
	};
}
function We(e, t) {
	return function() {
		this.setAttributeNS(e.space, e.local, t);
	};
}
function Ge(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
	};
}
function Ke(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
	};
}
function qe(e, t) {
	var n = w(e);
	if (arguments.length < 2) {
		var r = this.node();
		return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
	}
	return this.each((t == null ? n.local ? He : Ve : typeof t == "function" ? n.local ? Ke : Ge : n.local ? We : Ue)(n, t));
}
//#endregion
//#region node_modules/d3-selection/src/window.js
function Je(e) {
	return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
//#endregion
//#region node_modules/d3-selection/src/selection/style.js
function Ye(e) {
	return function() {
		this.style.removeProperty(e);
	};
}
function Xe(e, t, n) {
	return function() {
		this.style.setProperty(e, t, n);
	};
}
function Ze(e, t, n) {
	return function() {
		var r = t.apply(this, arguments);
		r == null ? this.style.removeProperty(e) : this.style.setProperty(e, r, n);
	};
}
function Qe(e, t, n) {
	return arguments.length > 1 ? this.each((t == null ? Ye : typeof t == "function" ? Ze : Xe)(e, t, n ?? "")) : $e(this.node(), e);
}
function $e(e, t) {
	return e.style.getPropertyValue(t) || Je(e).getComputedStyle(e, null).getPropertyValue(t);
}
//#endregion
//#region node_modules/d3-selection/src/selection/property.js
function et(e) {
	return function() {
		delete this[e];
	};
}
function tt(e, t) {
	return function() {
		this[e] = t;
	};
}
function nt(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? delete this[e] : this[e] = n;
	};
}
function rt(e, t) {
	return arguments.length > 1 ? this.each((t == null ? et : typeof t == "function" ? nt : tt)(e, t)) : this.node()[e];
}
//#endregion
//#region node_modules/d3-selection/src/selection/classed.js
function it(e) {
	return e.trim().split(/^|\s+/);
}
function at(e) {
	return e.classList || new ot(e);
}
function ot(e) {
	this._node = e, this._names = it(e.getAttribute("class") || "");
}
ot.prototype = {
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
function st(e, t) {
	for (var n = at(e), r = -1, i = t.length; ++r < i;) n.add(t[r]);
}
function ct(e, t) {
	for (var n = at(e), r = -1, i = t.length; ++r < i;) n.remove(t[r]);
}
function lt(e) {
	return function() {
		st(this, e);
	};
}
function ut(e) {
	return function() {
		ct(this, e);
	};
}
function dt(e, t) {
	return function() {
		(t.apply(this, arguments) ? st : ct)(this, e);
	};
}
function ft(e, t) {
	var n = it(e + "");
	if (arguments.length < 2) {
		for (var r = at(this.node()), i = -1, a = n.length; ++i < a;) if (!r.contains(n[i])) return !1;
		return !0;
	}
	return this.each((typeof t == "function" ? dt : t ? lt : ut)(n, t));
}
//#endregion
//#region node_modules/d3-selection/src/selection/text.js
function pt() {
	this.textContent = "";
}
function mt(e) {
	return function() {
		this.textContent = e;
	};
}
function ht(e) {
	return function() {
		var t = e.apply(this, arguments);
		this.textContent = t ?? "";
	};
}
function gt(e) {
	return arguments.length ? this.each(e == null ? pt : (typeof e == "function" ? ht : mt)(e)) : this.node().textContent;
}
//#endregion
//#region node_modules/d3-selection/src/selection/html.js
function _t() {
	this.innerHTML = "";
}
function vt(e) {
	return function() {
		this.innerHTML = e;
	};
}
function yt(e) {
	return function() {
		var t = e.apply(this, arguments);
		this.innerHTML = t ?? "";
	};
}
function bt(e) {
	return arguments.length ? this.each(e == null ? _t : (typeof e == "function" ? yt : vt)(e)) : this.node().innerHTML;
}
//#endregion
//#region node_modules/d3-selection/src/selection/raise.js
function xt() {
	this.nextSibling && this.parentNode.appendChild(this);
}
function St() {
	return this.each(xt);
}
//#endregion
//#region node_modules/d3-selection/src/selection/lower.js
function Ct() {
	this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function wt() {
	return this.each(Ct);
}
//#endregion
//#region node_modules/d3-selection/src/selection/append.js
function Tt(e) {
	var t = typeof e == "function" ? e : ae(e);
	return this.select(function() {
		return this.appendChild(t.apply(this, arguments));
	});
}
//#endregion
//#region node_modules/d3-selection/src/selection/insert.js
function Et() {
	return null;
}
function Dt(e, t) {
	var n = typeof e == "function" ? e : ae(e), r = t == null ? Et : typeof t == "function" ? t : E(t);
	return this.select(function() {
		return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
	});
}
//#endregion
//#region node_modules/d3-selection/src/selection/remove.js
function Ot() {
	var e = this.parentNode;
	e && e.removeChild(this);
}
function kt() {
	return this.each(Ot);
}
//#endregion
//#region node_modules/d3-selection/src/selection/clone.js
function At() {
	var e = this.cloneNode(!1), t = this.parentNode;
	return t ? t.insertBefore(e, this.nextSibling) : e;
}
function jt() {
	var e = this.cloneNode(!0), t = this.parentNode;
	return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Mt(e) {
	return this.select(e ? jt : At);
}
//#endregion
//#region node_modules/d3-selection/src/selection/datum.js
function Nt(e) {
	return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
//#endregion
//#region node_modules/d3-selection/src/selection/on.js
function Pt(e) {
	return function(t) {
		e.call(this, t, this.__data__);
	};
}
function Ft(e) {
	return e.trim().split(/^|\s+/).map(function(e) {
		var t = "", n = e.indexOf(".");
		return n >= 0 && (t = e.slice(n + 1), e = e.slice(0, n)), {
			type: e,
			name: t
		};
	});
}
function It(e) {
	return function() {
		var t = this.__on;
		if (t) {
			for (var n = 0, r = -1, i = t.length, a; n < i; ++n) a = t[n], (!e.type || a.type === e.type) && a.name === e.name ? this.removeEventListener(a.type, a.listener, a.options) : t[++r] = a;
			++r ? t.length = r : delete this.__on;
		}
	};
}
function Lt(e, t, n) {
	return function() {
		var r = this.__on, i, a = Pt(t);
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
function Rt(e, t, n) {
	var r = Ft(e + ""), i, a = r.length, o;
	if (arguments.length < 2) {
		var s = this.node().__on;
		if (s) {
			for (var c = 0, l = s.length, u; c < l; ++c) for (i = 0, u = s[c]; i < a; ++i) if ((o = r[i]).type === u.type && o.name === u.name) return u.value;
		}
		return;
	}
	for (s = t ? Lt : It, i = 0; i < a; ++i) this.each(s(r[i], t, n));
	return this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/dispatch.js
function zt(e, t, n) {
	var r = Je(e), i = r.CustomEvent;
	typeof i == "function" ? i = new i(t, n) : (i = r.document.createEvent("Event"), n ? (i.initEvent(t, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(t, !1, !1)), e.dispatchEvent(i);
}
function Bt(e, t) {
	return function() {
		return zt(this, e, t);
	};
}
function Vt(e, t) {
	return function() {
		return zt(this, e, t.apply(this, arguments));
	};
}
function Ht(e, t) {
	return this.each((typeof t == "function" ? Vt : Bt)(e, t));
}
//#endregion
//#region node_modules/d3-selection/src/selection/iterator.js
function* Ut() {
	for (var e = this._groups, t = 0, n = e.length; t < n; ++t) for (var r = e[t], i = 0, a = r.length, o; i < a; ++i) (o = r[i]) && (yield o);
}
//#endregion
//#region node_modules/d3-selection/src/selection/index.js
var Wt = [null];
function Gt(e, t) {
	this._groups = e, this._parents = t;
}
function Kt() {
	return new Gt([[document.documentElement]], Wt);
}
function qt() {
	return this;
}
Gt.prototype = Kt.prototype = {
	constructor: Gt,
	select: se,
	selectAll: ue,
	selectChild: ge,
	selectChildren: be,
	filter: xe,
	data: De,
	enter: Se,
	exit: ke,
	join: Ae,
	merge: je,
	selection: qt,
	order: Me,
	sort: Ne,
	call: Fe,
	nodes: Ie,
	node: Le,
	size: Re,
	empty: ze,
	each: Be,
	attr: qe,
	style: Qe,
	property: rt,
	classed: ft,
	text: gt,
	html: bt,
	raise: St,
	lower: wt,
	append: Tt,
	insert: Dt,
	remove: kt,
	clone: Mt,
	datum: Nt,
	on: Rt,
	dispatch: Ht,
	[Symbol.iterator]: Ut
};
//#endregion
//#region node_modules/d3-selection/src/select.js
function Jt(e) {
	return typeof e == "string" ? new Gt([[document.querySelector(e)]], [document.documentElement]) : new Gt([[e]], Wt);
}
//#endregion
//#region node_modules/d3-selection/src/sourceEvent.js
function Yt(e) {
	let t;
	for (; t = e.sourceEvent;) e = t;
	return e;
}
//#endregion
//#region node_modules/d3-selection/src/pointer.js
function Xt(e, t) {
	if (e = Yt(e), t === void 0 && (t = e.currentTarget), t) {
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
var Zt = { passive: !1 }, Qt = {
	capture: !0,
	passive: !1
};
function $t(e) {
	e.stopImmediatePropagation();
}
function en(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region node_modules/d3-drag/src/nodrag.js
function tn(e) {
	var t = e.document.documentElement, n = Jt(e).on("dragstart.drag", en, Qt);
	"onselectstart" in t ? n.on("selectstart.drag", en, Qt) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function nn(e, t) {
	var n = e.document.documentElement, r = Jt(e).on("dragstart.drag", null);
	t && (r.on("click.drag", en, Qt), setTimeout(function() {
		r.on("click.drag", null);
	}, 0)), "onselectstart" in n ? r.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
//#endregion
//#region node_modules/d3-drag/src/constant.js
var rn = (e) => () => e;
//#endregion
//#region node_modules/d3-drag/src/event.js
function an(e, { sourceEvent: t, subject: n, target: r, identifier: i, active: a, x: o, y: s, dx: c, dy: l, dispatch: u }) {
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
an.prototype.on = function() {
	var e = this._.on.apply(this._, arguments);
	return e === this._ ? this : e;
};
//#endregion
//#region node_modules/d3-drag/src/drag.js
function on(e) {
	return !e.ctrlKey && !e.button;
}
function sn() {
	return this.parentNode;
}
function cn(e, t) {
	return t ?? {
		x: e.x,
		y: e.y
	};
}
function ln() {
	return navigator.maxTouchPoints || "ontouchstart" in this;
}
function un() {
	var e = on, t = sn, n = cn, r = ln, i = {}, a = ee("start", "drag", "end"), o = 0, s, c, l, u, d = 0;
	function f(e) {
		e.on("mousedown.drag", p).filter(r).on("touchstart.drag", g).on("touchmove.drag", _, Zt).on("touchend.drag touchcancel.drag", v).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	}
	function p(n, r) {
		if (!(u || !e.call(this, n, r))) {
			var i = y(this, t.call(this, n, r), n, r, "mouse");
			i && (Jt(n.view).on("mousemove.drag", m, Qt).on("mouseup.drag", h, Qt), tn(n.view), $t(n), l = !1, s = n.clientX, c = n.clientY, i("start", n));
		}
	}
	function m(e) {
		if (en(e), !l) {
			var t = e.clientX - s, n = e.clientY - c;
			l = t * t + n * n > d;
		}
		i.mouse("drag", e);
	}
	function h(e) {
		Jt(e.view).on("mousemove.drag mouseup.drag", null), nn(e.view, l), en(e), i.mouse("end", e);
	}
	function g(n, r) {
		if (e.call(this, n, r)) {
			var i = n.changedTouches, a = t.call(this, n, r), o = i.length, s, c;
			for (s = 0; s < o; ++s) (c = y(this, a, n, r, i[s].identifier, i[s])) && ($t(n), c("start", n, i[s]));
		}
	}
	function _(e) {
		var t = e.changedTouches, n = t.length, r, a;
		for (r = 0; r < n; ++r) (a = i[t[r].identifier]) && (en(e), a("drag", e, t[r]));
	}
	function v(e) {
		var t = e.changedTouches, n = t.length, r, a;
		for (u && clearTimeout(u), u = setTimeout(function() {
			u = null;
		}, 500), r = 0; r < n; ++r) (a = i[t[r].identifier]) && ($t(e), a("end", e, t[r]));
	}
	function y(e, t, r, s, c, l) {
		var u = a.copy(), d = Xt(l || r, t), p, m, h;
		if ((h = n.call(e, new an("beforestart", {
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
					d = Xt(l || a, t), _ = o;
					break;
			}
			u.call(r, e, new an(r, {
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
		return arguments.length ? (e = typeof t == "function" ? t : rn(!!t), f) : e;
	}, f.container = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : rn(e), f) : t;
	}, f.subject = function(e) {
		return arguments.length ? (n = typeof e == "function" ? e : rn(e), f) : n;
	}, f.touchable = function(e) {
		return arguments.length ? (r = typeof e == "function" ? e : rn(!!e), f) : r;
	}, f.on = function() {
		var e = a.on.apply(a, arguments);
		return e === a ? f : e;
	}, f.clickDistance = function(e) {
		return arguments.length ? (d = (e = +e) * e, f) : Math.sqrt(d);
	}, f;
}
//#endregion
//#region node_modules/d3-color/src/define.js
function dn(e, t, n) {
	e.prototype = t.prototype = n, n.constructor = e;
}
function fn(e, t) {
	var n = Object.create(e.prototype);
	for (var r in t) n[r] = t[r];
	return n;
}
//#endregion
//#region node_modules/d3-color/src/color.js
function pn() {}
var mn = .7, hn = 1 / mn, gn = "\\s*([+-]?\\d+)\\s*", _n = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", vn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", yn = /^#([0-9a-f]{3,8})$/, bn = RegExp(`^rgb\\(${gn},${gn},${gn}\\)$`), xn = RegExp(`^rgb\\(${vn},${vn},${vn}\\)$`), Sn = RegExp(`^rgba\\(${gn},${gn},${gn},${_n}\\)$`), Cn = RegExp(`^rgba\\(${vn},${vn},${vn},${_n}\\)$`), wn = RegExp(`^hsl\\(${_n},${vn},${vn}\\)$`), Tn = RegExp(`^hsla\\(${_n},${vn},${vn},${_n}\\)$`), En = {
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
dn(pn, jn, {
	copy(e) {
		return Object.assign(new this.constructor(), this, e);
	},
	displayable() {
		return this.rgb().displayable();
	},
	hex: Dn,
	formatHex: Dn,
	formatHex8: On,
	formatHsl: kn,
	formatRgb: An,
	toString: An
});
function Dn() {
	return this.rgb().formatHex();
}
function On() {
	return this.rgb().formatHex8();
}
function kn() {
	return Wn(this).formatHsl();
}
function An() {
	return this.rgb().formatRgb();
}
function jn(e) {
	var t, n;
	return e = (e + "").trim().toLowerCase(), (t = yn.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? Mn(t) : n === 3 ? new In(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? Nn(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? Nn(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = bn.exec(e)) ? new In(t[1], t[2], t[3], 1) : (t = xn.exec(e)) ? new In(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = Sn.exec(e)) ? Nn(t[1], t[2], t[3], t[4]) : (t = Cn.exec(e)) ? Nn(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = wn.exec(e)) ? Un(t[1], t[2] / 100, t[3] / 100, 1) : (t = Tn.exec(e)) ? Un(t[1], t[2] / 100, t[3] / 100, t[4]) : En.hasOwnProperty(e) ? Mn(En[e]) : e === "transparent" ? new In(NaN, NaN, NaN, 0) : null;
}
function Mn(e) {
	return new In(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function Nn(e, t, n, r) {
	return r <= 0 && (e = t = n = NaN), new In(e, t, n, r);
}
function Pn(e) {
	return e instanceof pn || (e = jn(e)), e ? (e = e.rgb(), new In(e.r, e.g, e.b, e.opacity)) : new In();
}
function Fn(e, t, n, r) {
	return arguments.length === 1 ? Pn(e) : new In(e, t, n, r ?? 1);
}
function In(e, t, n, r) {
	this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
dn(In, Fn, fn(pn, {
	brighter(e) {
		return e = e == null ? hn : hn ** +e, new In(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? mn : mn ** +e, new In(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	rgb() {
		return this;
	},
	clamp() {
		return new In(Vn(this.r), Vn(this.g), Vn(this.b), Bn(this.opacity));
	},
	displayable() {
		return -.5 <= this.r && this.r < 255.5 && -.5 <= this.g && this.g < 255.5 && -.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
	},
	hex: Ln,
	formatHex: Ln,
	formatHex8: Rn,
	formatRgb: zn,
	toString: zn
}));
function Ln() {
	return `#${Hn(this.r)}${Hn(this.g)}${Hn(this.b)}`;
}
function Rn() {
	return `#${Hn(this.r)}${Hn(this.g)}${Hn(this.b)}${Hn((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function zn() {
	let e = Bn(this.opacity);
	return `${e === 1 ? "rgb(" : "rgba("}${Vn(this.r)}, ${Vn(this.g)}, ${Vn(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function Bn(e) {
	return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function Vn(e) {
	return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function Hn(e) {
	return e = Vn(e), (e < 16 ? "0" : "") + e.toString(16);
}
function Un(e, t, n, r) {
	return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new Kn(e, t, n, r);
}
function Wn(e) {
	if (e instanceof Kn) return new Kn(e.h, e.s, e.l, e.opacity);
	if (e instanceof pn || (e = jn(e)), !e) return new Kn();
	if (e instanceof Kn) return e;
	e = e.rgb();
	var t = e.r / 255, n = e.g / 255, r = e.b / 255, i = Math.min(t, n, r), a = Math.max(t, n, r), o = NaN, s = a - i, c = (a + i) / 2;
	return s ? (o = t === a ? (n - r) / s + (n < r) * 6 : n === a ? (r - t) / s + 2 : (t - n) / s + 4, s /= c < .5 ? a + i : 2 - a - i, o *= 60) : s = c > 0 && c < 1 ? 0 : o, new Kn(o, s, c, e.opacity);
}
function Gn(e, t, n, r) {
	return arguments.length === 1 ? Wn(e) : new Kn(e, t, n, r ?? 1);
}
function Kn(e, t, n, r) {
	this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
dn(Kn, Gn, fn(pn, {
	brighter(e) {
		return e = e == null ? hn : hn ** +e, new Kn(this.h, this.s, this.l * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? mn : mn ** +e, new Kn(this.h, this.s, this.l * e, this.opacity);
	},
	rgb() {
		var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < .5 ? n : 1 - n) * t, i = 2 * n - r;
		return new In(Yn(e >= 240 ? e - 240 : e + 120, i, r), Yn(e, i, r), Yn(e < 120 ? e + 240 : e - 120, i, r), this.opacity);
	},
	clamp() {
		return new Kn(qn(this.h), Jn(this.s), Jn(this.l), Bn(this.opacity));
	},
	displayable() {
		return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
	},
	formatHsl() {
		let e = Bn(this.opacity);
		return `${e === 1 ? "hsl(" : "hsla("}${qn(this.h)}, ${Jn(this.s) * 100}%, ${Jn(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
	}
}));
function qn(e) {
	return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function Jn(e) {
	return Math.max(0, Math.min(1, e || 0));
}
function Yn(e, t, n) {
	return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
//#endregion
//#region node_modules/d3-interpolate/src/constant.js
var Xn = (e) => () => e;
//#endregion
//#region node_modules/d3-interpolate/src/color.js
function Zn(e, t) {
	return function(n) {
		return e + n * t;
	};
}
function Qn(e, t, n) {
	return e **= +n, t = t ** +n - e, n = 1 / n, function(r) {
		return (e + r * t) ** +n;
	};
}
function $n(e) {
	return (e = +e) == 1 ? er : function(t, n) {
		return n - t ? Qn(t, n, e) : Xn(isNaN(t) ? n : t);
	};
}
function er(e, t) {
	var n = t - e;
	return n ? Zn(e, n) : Xn(isNaN(e) ? t : e);
}
//#endregion
//#region node_modules/d3-interpolate/src/rgb.js
var tr = (function e(t) {
	var n = $n(t);
	function r(e, t) {
		var r = n((e = Fn(e)).r, (t = Fn(t)).r), i = n(e.g, t.g), a = n(e.b, t.b), o = er(e.opacity, t.opacity);
		return function(t) {
			return e.r = r(t), e.g = i(t), e.b = a(t), e.opacity = o(t), e + "";
		};
	}
	return r.gamma = e, r;
})(1);
//#endregion
//#region node_modules/d3-interpolate/src/number.js
function nr(e, t) {
	return e = +e, t = +t, function(n) {
		return e * (1 - n) + t * n;
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/string.js
var rr = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, ir = new RegExp(rr.source, "g");
function ar(e) {
	return function() {
		return e;
	};
}
function or(e) {
	return function(t) {
		return e(t) + "";
	};
}
function sr(e, t) {
	var n = rr.lastIndex = ir.lastIndex = 0, r, i, a, o = -1, s = [], c = [];
	for (e += "", t += ""; (r = rr.exec(e)) && (i = ir.exec(t));) (a = i.index) > n && (a = t.slice(n, a), s[o] ? s[o] += a : s[++o] = a), (r = r[0]) === (i = i[0]) ? s[o] ? s[o] += i : s[++o] = i : (s[++o] = null, c.push({
		i: o,
		x: nr(r, i)
	})), n = ir.lastIndex;
	return n < t.length && (a = t.slice(n), s[o] ? s[o] += a : s[++o] = a), s.length < 2 ? c[0] ? or(c[0].x) : ar(t) : (t = c.length, function(e) {
		for (var n = 0, r; n < t; ++n) s[(r = c[n]).i] = r.x(e);
		return s.join("");
	});
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/decompose.js
var cr = 180 / Math.PI, lr = {
	translateX: 0,
	translateY: 0,
	rotate: 0,
	skewX: 0,
	scaleX: 1,
	scaleY: 1
};
function ur(e, t, n, r, i, a) {
	var o, s, c;
	return (o = Math.sqrt(e * e + t * t)) && (e /= o, t /= o), (c = e * n + t * r) && (n -= e * c, r -= t * c), (s = Math.sqrt(n * n + r * r)) && (n /= s, r /= s, c /= s), e * r < t * n && (e = -e, t = -t, c = -c, o = -o), {
		translateX: i,
		translateY: a,
		rotate: Math.atan2(t, e) * cr,
		skewX: Math.atan(c) * cr,
		scaleX: o,
		scaleY: s
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/parse.js
var dr;
function fr(e) {
	let t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
	return t.isIdentity ? lr : ur(t.a, t.b, t.c, t.d, t.e, t.f);
}
function pr(e) {
	return e == null || (dr ||= document.createElementNS("http://www.w3.org/2000/svg", "g"), dr.setAttribute("transform", e), !(e = dr.transform.baseVal.consolidate())) ? lr : (e = e.matrix, ur(e.a, e.b, e.c, e.d, e.e, e.f));
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/index.js
function mr(e, t, n, r) {
	function i(e) {
		return e.length ? e.pop() + " " : "";
	}
	function a(e, r, i, a, o, s) {
		if (e !== i || r !== a) {
			var c = o.push("translate(", null, t, null, n);
			s.push({
				i: c - 4,
				x: nr(e, i)
			}, {
				i: c - 2,
				x: nr(r, a)
			});
		} else (i || a) && o.push("translate(" + i + t + a + n);
	}
	function o(e, t, n, a) {
		e === t ? t && n.push(i(n) + "rotate(" + t + r) : (e - t > 180 ? t += 360 : t - e > 180 && (e += 360), a.push({
			i: n.push(i(n) + "rotate(", null, r) - 2,
			x: nr(e, t)
		}));
	}
	function s(e, t, n, a) {
		e === t ? t && n.push(i(n) + "skewX(" + t + r) : a.push({
			i: n.push(i(n) + "skewX(", null, r) - 2,
			x: nr(e, t)
		});
	}
	function c(e, t, n, r, a, o) {
		if (e !== n || t !== r) {
			var s = a.push(i(a) + "scale(", null, ",", null, ")");
			o.push({
				i: s - 4,
				x: nr(e, n)
			}, {
				i: s - 2,
				x: nr(t, r)
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
var hr = mr(fr, "px, ", "px)", "deg)"), gr = mr(pr, ", ", ")", ")"), _r = 1e-12;
function vr(e) {
	return ((e = Math.exp(e)) + 1 / e) / 2;
}
function yr(e) {
	return ((e = Math.exp(e)) - 1 / e) / 2;
}
function br(e) {
	return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
var xr = (function e(t, n, r) {
	function i(e, i) {
		var a = e[0], o = e[1], s = e[2], c = i[0], l = i[1], u = i[2], d = c - a, f = l - o, p = d * d + f * f, m, h;
		if (p < _r) h = Math.log(u / s) / t, m = function(e) {
			return [
				a + e * d,
				o + e * f,
				s * Math.exp(t * e * h)
			];
		};
		else {
			var g = Math.sqrt(p), _ = (u * u - s * s + r * p) / (2 * s * n * g), v = (u * u - s * s - r * p) / (2 * u * n * g), y = Math.log(Math.sqrt(_ * _ + 1) - _);
			h = (Math.log(Math.sqrt(v * v + 1) - v) - y) / t, m = function(e) {
				var r = e * h, i = vr(y), c = s / (n * g) * (i * br(t * r + y) - yr(y));
				return [
					a + c * d,
					o + c * f,
					s * i / vr(t * r + y)
				];
			};
		}
		return m.duration = h * 1e3 * t / Math.SQRT2, m;
	}
	return i.rho = function(t) {
		var n = Math.max(.001, +t), r = n * n;
		return e(n, r, r * r);
	}, i;
})(Math.SQRT2, 2, 4), Sr = 0, Cr = 0, wr = 0, Tr = 1e3, Er, Dr, Or = 0, kr = 0, Ar = 0, jr = typeof performance == "object" && performance.now ? performance : Date, Mr = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
	setTimeout(e, 17);
};
function Nr() {
	return kr ||= (Mr(Pr), jr.now() + Ar);
}
function Pr() {
	kr = 0;
}
function Fr() {
	this._call = this._time = this._next = null;
}
Fr.prototype = Ir.prototype = {
	constructor: Fr,
	restart: function(e, t, n) {
		if (typeof e != "function") throw TypeError("callback is not a function");
		n = (n == null ? Nr() : +n) + (t == null ? 0 : +t), !this._next && Dr !== this && (Dr ? Dr._next = this : Er = this, Dr = this), this._call = e, this._time = n, Vr();
	},
	stop: function() {
		this._call && (this._call = null, this._time = Infinity, Vr());
	}
};
function Ir(e, t, n) {
	var r = new Fr();
	return r.restart(e, t, n), r;
}
function Lr() {
	Nr(), ++Sr;
	for (var e = Er, t; e;) (t = kr - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
	--Sr;
}
function Rr() {
	kr = (Or = jr.now()) + Ar, Sr = Cr = 0;
	try {
		Lr();
	} finally {
		Sr = 0, Br(), kr = 0;
	}
}
function zr() {
	var e = jr.now(), t = e - Or;
	t > Tr && (Ar -= t, Or = e);
}
function Br() {
	for (var e, t = Er, n, r = Infinity; t;) t._call ? (r > t._time && (r = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : Er = n);
	Dr = e, Vr(r);
}
function Vr(e) {
	Sr || (Cr &&= clearTimeout(Cr), e - kr > 24 ? (e < Infinity && (Cr = setTimeout(Rr, e - jr.now() - Ar)), wr &&= clearInterval(wr)) : (wr ||= (Or = jr.now(), setInterval(zr, Tr)), Sr = 1, Mr(Rr)));
}
//#endregion
//#region node_modules/d3-timer/src/timeout.js
function Hr(e, t, n) {
	var r = new Fr();
	return t = t == null ? 0 : +t, r.restart((n) => {
		r.stop(), e(n + t);
	}, t, n), r;
}
//#endregion
//#region node_modules/d3-transition/src/transition/schedule.js
var Ur = /* @__PURE__ */ c(d()), Wr = /* @__PURE__ */ c(b()), Gr = ee("start", "end", "cancel", "interrupt"), Kr = [];
function qr(e, t, n, r, i, a) {
	var o = e.__transition;
	if (!o) e.__transition = {};
	else if (n in o) return;
	Zr(e, n, {
		name: t,
		index: r,
		group: i,
		on: Gr,
		tween: Kr,
		time: a.time,
		delay: a.delay,
		duration: a.duration,
		ease: a.ease,
		timer: null,
		state: 0
	});
}
function Jr(e, t) {
	var n = Xr(e, t);
	if (n.state > 0) throw Error("too late; already scheduled");
	return n;
}
function Yr(e, t) {
	var n = Xr(e, t);
	if (n.state > 3) throw Error("too late; already running");
	return n;
}
function Xr(e, t) {
	var n = e.__transition;
	if (!n || !(n = n[t])) throw Error("transition not found");
	return n;
}
function Zr(e, t, n) {
	var r = e.__transition, i;
	r[t] = n, n.timer = Ir(a, 0, n.time);
	function a(e) {
		n.state = 1, n.timer.restart(o, n.delay, n.time), n.delay <= e && o(e - n.delay);
	}
	function o(a) {
		var l, u, d, f;
		if (n.state !== 1) return c();
		for (l in r) if (f = r[l], f.name === n.name) {
			if (f.state === 3) return Hr(o);
			f.state === 4 ? (f.state = 6, f.timer.stop(), f.on.call("interrupt", e, e.__data__, f.index, f.group), delete r[l]) : +l < t && (f.state = 6, f.timer.stop(), f.on.call("cancel", e, e.__data__, f.index, f.group), delete r[l]);
		}
		if (Hr(function() {
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
function Qr(e, t) {
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
function $r(e) {
	return this.each(function() {
		Qr(this, e);
	});
}
//#endregion
//#region node_modules/d3-transition/src/transition/tween.js
function ei(e, t) {
	var n, r;
	return function() {
		var i = Yr(this, e), a = i.tween;
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
function ti(e, t, n) {
	var r, i;
	if (typeof n != "function") throw Error();
	return function() {
		var a = Yr(this, e), o = a.tween;
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
function ni(e, t) {
	var n = this._id;
	if (e += "", arguments.length < 2) {
		for (var r = Xr(this.node(), n).tween, i = 0, a = r.length, o; i < a; ++i) if ((o = r[i]).name === e) return o.value;
		return null;
	}
	return this.each((t == null ? ei : ti)(n, e, t));
}
function ri(e, t, n) {
	var r = e._id;
	return e.each(function() {
		var e = Yr(this, r);
		(e.value ||= {})[t] = n.apply(this, arguments);
	}), function(e) {
		return Xr(e, r).value[t];
	};
}
//#endregion
//#region node_modules/d3-transition/src/transition/interpolate.js
function ii(e, t) {
	var n;
	return (typeof t == "number" ? nr : t instanceof jn ? tr : (n = jn(t)) ? (t = n, tr) : sr)(e, t);
}
//#endregion
//#region node_modules/d3-transition/src/transition/attr.js
function ai(e) {
	return function() {
		this.removeAttribute(e);
	};
}
function oi(e) {
	return function() {
		this.removeAttributeNS(e.space, e.local);
	};
}
function si(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = this.getAttribute(e);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function ci(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = this.getAttributeNS(e.space, e.local);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function li(e, t, n) {
	var r, i, a;
	return function() {
		var o, s = n(this), c;
		return s == null ? void this.removeAttribute(e) : (o = this.getAttribute(e), c = s + "", o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s)));
	};
}
function ui(e, t, n) {
	var r, i, a;
	return function() {
		var o, s = n(this), c;
		return s == null ? void this.removeAttributeNS(e.space, e.local) : (o = this.getAttributeNS(e.space, e.local), c = s + "", o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s)));
	};
}
function di(e, t) {
	var n = w(e), r = n === "transform" ? gr : ii;
	return this.attrTween(e, typeof t == "function" ? (n.local ? ui : li)(n, r, ri(this, "attr." + e, t)) : t == null ? (n.local ? oi : ai)(n) : (n.local ? ci : si)(n, r, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/attrTween.js
function fi(e, t) {
	return function(n) {
		this.setAttribute(e, t.call(this, n));
	};
}
function pi(e, t) {
	return function(n) {
		this.setAttributeNS(e.space, e.local, t.call(this, n));
	};
}
function mi(e, t) {
	var n, r;
	function i() {
		var i = t.apply(this, arguments);
		return i !== r && (n = (r = i) && pi(e, i)), n;
	}
	return i._value = t, i;
}
function hi(e, t) {
	var n, r;
	function i() {
		var i = t.apply(this, arguments);
		return i !== r && (n = (r = i) && fi(e, i)), n;
	}
	return i._value = t, i;
}
function gi(e, t) {
	var n = "attr." + e;
	if (arguments.length < 2) return (n = this.tween(n)) && n._value;
	if (t == null) return this.tween(n, null);
	if (typeof t != "function") throw Error();
	var r = w(e);
	return this.tween(n, (r.local ? mi : hi)(r, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/delay.js
function _i(e, t) {
	return function() {
		Jr(this, e).delay = +t.apply(this, arguments);
	};
}
function vi(e, t) {
	return t = +t, function() {
		Jr(this, e).delay = t;
	};
}
function yi(e) {
	var t = this._id;
	return arguments.length ? this.each((typeof e == "function" ? _i : vi)(t, e)) : Xr(this.node(), t).delay;
}
//#endregion
//#region node_modules/d3-transition/src/transition/duration.js
function bi(e, t) {
	return function() {
		Yr(this, e).duration = +t.apply(this, arguments);
	};
}
function xi(e, t) {
	return t = +t, function() {
		Yr(this, e).duration = t;
	};
}
function Si(e) {
	var t = this._id;
	return arguments.length ? this.each((typeof e == "function" ? bi : xi)(t, e)) : Xr(this.node(), t).duration;
}
//#endregion
//#region node_modules/d3-transition/src/transition/ease.js
function Ci(e, t) {
	if (typeof t != "function") throw Error();
	return function() {
		Yr(this, e).ease = t;
	};
}
function wi(e) {
	var t = this._id;
	return arguments.length ? this.each(Ci(t, e)) : Xr(this.node(), t).ease;
}
//#endregion
//#region node_modules/d3-transition/src/transition/easeVarying.js
function Ti(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		if (typeof n != "function") throw Error();
		Yr(this, e).ease = n;
	};
}
function Ei(e) {
	if (typeof e != "function") throw Error();
	return this.each(Ti(this._id, e));
}
//#endregion
//#region node_modules/d3-transition/src/transition/filter.js
function Di(e) {
	typeof e != "function" && (e = de(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = [], c, l = 0; l < o; ++l) (c = a[l]) && e.call(c, c.__data__, l, a) && s.push(c);
	return new ta(r, this._parents, this._name, this._id);
}
//#endregion
//#region node_modules/d3-transition/src/transition/merge.js
function Oi(e) {
	if (e._id !== this._id) throw Error();
	for (var t = this._groups, n = e._groups, r = t.length, i = n.length, a = Math.min(r, i), o = Array(r), s = 0; s < a; ++s) for (var c = t[s], l = n[s], u = c.length, d = o[s] = Array(u), f, p = 0; p < u; ++p) (f = c[p] || l[p]) && (d[p] = f);
	for (; s < r; ++s) o[s] = t[s];
	return new ta(o, this._parents, this._name, this._id);
}
//#endregion
//#region node_modules/d3-transition/src/transition/on.js
function ki(e) {
	return (e + "").trim().split(/^|\s+/).every(function(e) {
		var t = e.indexOf(".");
		return t >= 0 && (e = e.slice(0, t)), !e || e === "start";
	});
}
function Ai(e, t, n) {
	var r, i, a = ki(t) ? Jr : Yr;
	return function() {
		var o = a(this, e), s = o.on;
		s !== r && (i = (r = s).copy()).on(t, n), o.on = i;
	};
}
function ji(e, t) {
	var n = this._id;
	return arguments.length < 2 ? Xr(this.node(), n).on.on(e) : this.each(Ai(n, e, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/remove.js
function Mi(e) {
	return function() {
		var t = this.parentNode;
		for (var n in this.__transition) if (+n !== e) return;
		t && t.removeChild(this);
	};
}
function Ni() {
	return this.on("end.remove", Mi(this._id));
}
//#endregion
//#region node_modules/d3-transition/src/transition/select.js
function Pi(e) {
	var t = this._name, n = this._id;
	typeof e != "function" && (e = E(e));
	for (var r = this._groups, i = r.length, a = Array(i), o = 0; o < i; ++o) for (var s = r[o], c = s.length, l = a[o] = Array(c), u, d, f = 0; f < c; ++f) (u = s[f]) && (d = e.call(u, u.__data__, f, s)) && ("__data__" in u && (d.__data__ = u.__data__), l[f] = d, qr(l[f], t, n, f, l, Xr(u, n)));
	return new ta(a, this._parents, t, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/selectAll.js
function Fi(e) {
	var t = this._name, n = this._id;
	typeof e != "function" && (e = O(e));
	for (var r = this._groups, i = r.length, a = [], o = [], s = 0; s < i; ++s) for (var c = r[s], l = c.length, u, d = 0; d < l; ++d) if (u = c[d]) {
		for (var f = e.call(u, u.__data__, d, c), p, m = Xr(u, n), h = 0, g = f.length; h < g; ++h) (p = f[h]) && qr(p, t, n, h, f, m);
		a.push(f), o.push(u);
	}
	return new ta(a, o, t, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/selection.js
var Ii = Kt.prototype.constructor;
function Li() {
	return new Ii(this._groups, this._parents);
}
//#endregion
//#region node_modules/d3-transition/src/transition/style.js
function Ri(e, t) {
	var n, r, i;
	return function() {
		var a = $e(this, e), o = (this.style.removeProperty(e), $e(this, e));
		return a === o ? null : a === n && o === r ? i : i = t(n = a, r = o);
	};
}
function zi(e) {
	return function() {
		this.style.removeProperty(e);
	};
}
function Bi(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = $e(this, e);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function Vi(e, t, n) {
	var r, i, a;
	return function() {
		var o = $e(this, e), s = n(this), c = s + "";
		return s ?? (c = s = (this.style.removeProperty(e), $e(this, e))), o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s));
	};
}
function Hi(e, t) {
	var n, r, i, a = "style." + t, o = "end." + a, s;
	return function() {
		var c = Yr(this, e), l = c.on, u = c.value[a] == null ? s ||= zi(t) : void 0;
		(l !== n || i !== u) && (r = (n = l).copy()).on(o, i = u), c.on = r;
	};
}
function j(e, t, n) {
	var r = (e += "") == "transform" ? hr : ii;
	return t == null ? this.styleTween(e, Ri(e, r)).on("end.style." + e, zi(e)) : typeof t == "function" ? this.styleTween(e, Vi(e, r, ri(this, "style." + e, t))).each(Hi(this._id, e)) : this.styleTween(e, Bi(e, r, t), n).on("end.style." + e, null);
}
//#endregion
//#region node_modules/d3-transition/src/transition/styleTween.js
function Ui(e, t, n) {
	return function(r) {
		this.style.setProperty(e, t.call(this, r), n);
	};
}
function Wi(e, t, n) {
	var r, i;
	function a() {
		var a = t.apply(this, arguments);
		return a !== i && (r = (i = a) && Ui(e, a, n)), r;
	}
	return a._value = t, a;
}
function Gi(e, t, n) {
	var r = "style." + (e += "");
	if (arguments.length < 2) return (r = this.tween(r)) && r._value;
	if (t == null) return this.tween(r, null);
	if (typeof t != "function") throw Error();
	return this.tween(r, Wi(e, t, n ?? ""));
}
//#endregion
//#region node_modules/d3-transition/src/transition/text.js
function Ki(e) {
	return function() {
		this.textContent = e;
	};
}
function qi(e) {
	return function() {
		var t = e(this);
		this.textContent = t ?? "";
	};
}
function Ji(e) {
	return this.tween("text", typeof e == "function" ? qi(ri(this, "text", e)) : Ki(e == null ? "" : e + ""));
}
//#endregion
//#region node_modules/d3-transition/src/transition/textTween.js
function Yi(e) {
	return function(t) {
		this.textContent = e.call(this, t);
	};
}
function Xi(e) {
	var t, n;
	function r() {
		var r = e.apply(this, arguments);
		return r !== n && (t = (n = r) && Yi(r)), t;
	}
	return r._value = e, r;
}
function Zi(e) {
	var t = "text";
	if (arguments.length < 1) return (t = this.tween(t)) && t._value;
	if (e == null) return this.tween(t, null);
	if (typeof e != "function") throw Error();
	return this.tween(t, Xi(e));
}
//#endregion
//#region node_modules/d3-transition/src/transition/transition.js
function Qi() {
	for (var e = this._name, t = this._id, n = ra(), r = this._groups, i = r.length, a = 0; a < i; ++a) for (var o = r[a], s = o.length, c, l = 0; l < s; ++l) if (c = o[l]) {
		var u = Xr(c, t);
		qr(c, e, n, l, o, {
			time: u.time + u.delay + u.duration,
			delay: 0,
			duration: u.duration,
			ease: u.ease
		});
	}
	return new ta(r, this._parents, e, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/end.js
function $i() {
	var e, t, n = this, r = n._id, i = n.size();
	return new Promise(function(a, o) {
		var s = { value: o }, c = { value: function() {
			--i === 0 && a();
		} };
		n.each(function() {
			var n = Yr(this, r), i = n.on;
			i !== e && (t = (e = i).copy(), t._.cancel.push(s), t._.interrupt.push(s), t._.end.push(c)), n.on = t;
		}), i === 0 && a();
	});
}
//#endregion
//#region node_modules/d3-transition/src/transition/index.js
var ea = 0;
function ta(e, t, n, r) {
	this._groups = e, this._parents = t, this._name = n, this._id = r;
}
function na(e) {
	return Kt().transition(e);
}
function ra() {
	return ++ea;
}
var ia = Kt.prototype;
ta.prototype = na.prototype = {
	constructor: ta,
	select: Pi,
	selectAll: Fi,
	selectChild: ia.selectChild,
	selectChildren: ia.selectChildren,
	filter: Di,
	merge: Oi,
	selection: Li,
	transition: Qi,
	call: ia.call,
	nodes: ia.nodes,
	node: ia.node,
	size: ia.size,
	empty: ia.empty,
	each: ia.each,
	on: ji,
	attr: di,
	attrTween: gi,
	style: j,
	styleTween: Gi,
	text: Ji,
	textTween: Zi,
	remove: Ni,
	tween: ni,
	delay: yi,
	duration: Si,
	ease: wi,
	easeVarying: Ei,
	end: $i,
	[Symbol.iterator]: ia[Symbol.iterator]
};
//#endregion
//#region node_modules/d3-ease/src/cubic.js
function aa(e) {
	return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
//#endregion
//#region node_modules/d3-transition/src/selection/transition.js
var oa = {
	time: null,
	delay: 0,
	duration: 250,
	ease: aa
};
function sa(e, t) {
	for (var n; !(n = e.__transition) || !(n = n[t]);) if (!(e = e.parentNode)) throw Error(`transition ${t} not found`);
	return n;
}
function ca(e) {
	var t, n;
	e instanceof ta ? (t = e._id, e = e._name) : (t = ra(), (n = oa).time = Nr(), e = e == null ? null : e + "");
	for (var r = this._groups, i = r.length, a = 0; a < i; ++a) for (var o = r[a], s = o.length, c, l = 0; l < s; ++l) (c = o[l]) && qr(c, e, t, l, o, n || sa(c, t));
	return new ta(r, this._parents, e, t);
}
Kt.prototype.interrupt = $r, Kt.prototype.transition = ca;
//#endregion
//#region node_modules/d3-brush/src/brush.js
var { abs: la, max: ua, min: da } = Math;
["w", "e"].map(fa), ["n", "s"].map(fa), [
	"n",
	"w",
	"e",
	"s",
	"nw",
	"ne",
	"sw",
	"se"
].map(fa);
function fa(e) {
	return { type: e };
}
//#endregion
//#region node_modules/d3-force/src/center.js
function pa(e, t) {
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
function ma(e) {
	let t = +this._x.call(null, e), n = +this._y.call(null, e);
	return ha(this.cover(t, n), t, n, e);
}
function ha(e, t, n, r) {
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
function ga(e) {
	var t, n, r = e.length, i, a, o = Array(r), s = Array(r), c = Infinity, l = Infinity, u = -Infinity, d = -Infinity;
	for (n = 0; n < r; ++n) isNaN(i = +this._x.call(null, t = e[n])) || isNaN(a = +this._y.call(null, t)) || (o[n] = i, s[n] = a, i < c && (c = i), i > u && (u = i), a < l && (l = a), a > d && (d = a));
	if (c > u || l > d) return this;
	for (this.cover(c, l).cover(u, d), n = 0; n < r; ++n) ha(this, o[n], s[n], e[n]);
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/cover.js
function _a(e, t) {
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
function va() {
	var e = [];
	return this.visit(function(t) {
		if (!t.length) do
			e.push(t.data);
		while (t = t.next);
	}), e;
}
//#endregion
//#region node_modules/d3-quadtree/src/extent.js
function M(e) {
	return arguments.length ? this.cover(+e[0][0], +e[0][1]).cover(+e[1][0], +e[1][1]) : isNaN(this._x0) ? void 0 : [[this._x0, this._y0], [this._x1, this._y1]];
}
//#endregion
//#region node_modules/d3-quadtree/src/quad.js
function N(e, t, n, r, i) {
	this.node = e, this.x0 = t, this.y0 = n, this.x1 = r, this.y1 = i;
}
//#endregion
//#region node_modules/d3-quadtree/src/find.js
function ya(e, t, n) {
	var r, i = this._x0, a = this._y0, o, s, c, l, u = this._x1, d = this._y1, f = [], p = this._root, m, h;
	for (p && f.push(new N(p, i, a, u, d)), n == null ? n = Infinity : (i = e - n, a = t - n, u = e + n, d = t + n, n *= n); m = f.pop();) if (!(!(p = m.node) || (o = m.x0) > u || (s = m.y0) > d || (c = m.x1) < i || (l = m.y1) < a)) if (p.length) {
		var g = (o + c) / 2, _ = (s + l) / 2;
		f.push(new N(p[3], g, _, c, l), new N(p[2], o, _, g, l), new N(p[1], g, s, c, _), new N(p[0], o, s, g, _)), (h = (t >= _) << 1 | e >= g) && (m = f[f.length - 1], f[f.length - 1] = f[f.length - 1 - h], f[f.length - 1 - h] = m);
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
function ba(e) {
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
function xa(e) {
	for (var t = 0, n = e.length; t < n; ++t) this.remove(e[t]);
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/root.js
function Sa() {
	return this._root;
}
//#endregion
//#region node_modules/d3-quadtree/src/size.js
function Ca() {
	var e = 0;
	return this.visit(function(t) {
		if (!t.length) do
			++e;
		while (t = t.next);
	}), e;
}
//#endregion
//#region node_modules/d3-quadtree/src/visit.js
function wa(e) {
	var t = [], n, r = this._root, i, a, o, s, c;
	for (r && t.push(new N(r, this._x0, this._y0, this._x1, this._y1)); n = t.pop();) if (!e(r = n.node, a = n.x0, o = n.y0, s = n.x1, c = n.y1) && r.length) {
		var l = (a + s) / 2, u = (o + c) / 2;
		(i = r[3]) && t.push(new N(i, l, u, s, c)), (i = r[2]) && t.push(new N(i, a, u, l, c)), (i = r[1]) && t.push(new N(i, l, o, s, u)), (i = r[0]) && t.push(new N(i, a, o, l, u));
	}
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/visitAfter.js
function Ta(e) {
	var t = [], n = [], r;
	for (this._root && t.push(new N(this._root, this._x0, this._y0, this._x1, this._y1)); r = t.pop();) {
		var i = r.node;
		if (i.length) {
			var a, o = r.x0, s = r.y0, c = r.x1, l = r.y1, u = (o + c) / 2, d = (s + l) / 2;
			(a = i[0]) && t.push(new N(a, o, s, u, d)), (a = i[1]) && t.push(new N(a, u, s, c, d)), (a = i[2]) && t.push(new N(a, o, d, u, l)), (a = i[3]) && t.push(new N(a, u, d, c, l));
		}
		n.push(r);
	}
	for (; r = n.pop();) e(r.node, r.x0, r.y0, r.x1, r.y1);
	return this;
}
//#endregion
//#region node_modules/d3-quadtree/src/x.js
function Ea(e) {
	return e[0];
}
function Da(e) {
	return arguments.length ? (this._x = e, this) : this._x;
}
//#endregion
//#region node_modules/d3-quadtree/src/y.js
function Oa(e) {
	return e[1];
}
function ka(e) {
	return arguments.length ? (this._y = e, this) : this._y;
}
//#endregion
//#region node_modules/d3-quadtree/src/quadtree.js
function Aa(e, t, n) {
	var r = new ja(t ?? Ea, n ?? Oa, NaN, NaN, NaN, NaN);
	return e == null ? r : r.addAll(e);
}
function ja(e, t, n, r, i, a) {
	this._x = e, this._y = t, this._x0 = n, this._y0 = r, this._x1 = i, this._y1 = a, this._root = void 0;
}
function Ma(e) {
	for (var t = { data: e.data }, n = t; e = e.next;) n = n.next = { data: e.data };
	return t;
}
var Na = Aa.prototype = ja.prototype;
Na.copy = function() {
	var e = new ja(this._x, this._y, this._x0, this._y0, this._x1, this._y1), t = this._root, n, r;
	if (!t) return e;
	if (!t.length) return e._root = Ma(t), e;
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
	}) : t.target[i] = Ma(r));
	return e;
}, Na.add = ma, Na.addAll = ga, Na.cover = _a, Na.data = va, Na.extent = M, Na.find = ya, Na.remove = ba, Na.removeAll = xa, Na.root = Sa, Na.size = Ca, Na.visit = wa, Na.visitAfter = Ta, Na.x = Da, Na.y = ka;
//#endregion
//#region node_modules/d3-force/src/constant.js
function Pa(e) {
	return function() {
		return e;
	};
}
//#endregion
//#region node_modules/d3-force/src/jiggle.js
function Fa(e) {
	return (e() - .5) * 1e-6;
}
//#endregion
//#region node_modules/d3-force/src/collide.js
function Ia(e) {
	return e.x + e.vx;
}
function La(e) {
	return e.y + e.vy;
}
function Ra(e) {
	var t, n, r, i = 1, a = 1;
	typeof e != "function" && (e = Pa(e == null ? 1 : +e));
	function o() {
		for (var e, o = t.length, c, l, u, d, f, p, m = 0; m < a; ++m) for (c = Aa(t, Ia, La).visitAfter(s), e = 0; e < o; ++e) l = t[e], f = n[l.index], p = f * f, u = l.x + l.vx, d = l.y + l.vy, c.visit(h);
		function h(e, t, n, a, o) {
			var s = e.data, c = e.r, m = f + c;
			if (s) {
				if (s.index > l.index) {
					var h = u - s.x - s.vx, g = d - s.y - s.vy, _ = h * h + g * g;
					_ < m * m && (h === 0 && (h = Fa(r), _ += h * h), g === 0 && (g = Fa(r), _ += g * g), _ = (m - (_ = Math.sqrt(_))) / _ * i, l.vx += (h *= _) * (m = (c *= c) / (p + c)), l.vy += (g *= _) * m, s.vx -= h * (m = 1 - m), s.vy -= g * m);
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
		return arguments.length ? (e = typeof t == "function" ? t : Pa(+t), c(), o) : e;
	}, o;
}
//#endregion
//#region node_modules/d3-force/src/link.js
function za(e) {
	return e.index;
}
function Ba(e, t) {
	var n = e.get(t);
	if (!n) throw Error("node not found: " + t);
	return n;
}
function Va(e) {
	var t = za, n = d, r, i = Pa(30), a, o, s, c, l, u = 1;
	e ??= [];
	function d(e) {
		return 1 / Math.min(s[e.source.index], s[e.target.index]);
	}
	function f(t) {
		for (var n = 0, i = e.length; n < u; ++n) for (var o = 0, s, d, f, p, m, h, g; o < i; ++o) s = e[o], d = s.source, f = s.target, p = f.x + f.vx - d.x - d.vx || Fa(l), m = f.y + f.vy - d.y - d.vy || Fa(l), h = Math.sqrt(p * p + m * m), h = (h - a[o]) / h * t * r[o], p *= h, m *= h, f.vx -= p * (g = c[o]), f.vy -= m * g, d.vx += p * (g = 1 - g), d.vy += m * g;
	}
	function p() {
		if (o) {
			var n, i = o.length, l = e.length, u = new Map(o.map((e, n) => [t(e, n, o), e])), d;
			for (n = 0, s = Array(i); n < l; ++n) d = e[n], d.index = n, typeof d.source != "object" && (d.source = Ba(u, d.source)), typeof d.target != "object" && (d.target = Ba(u, d.target)), s[d.source.index] = (s[d.source.index] || 0) + 1, s[d.target.index] = (s[d.target.index] || 0) + 1;
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
		return arguments.length ? (n = typeof e == "function" ? e : Pa(+e), m(), f) : n;
	}, f.distance = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : Pa(+e), h(), f) : i;
	}, f;
}
//#endregion
//#region node_modules/d3-force/src/lcg.js
var Ha = 1664525, Ua = 1013904223, Wa = 4294967296;
function Ga() {
	let e = 1;
	return () => (e = (Ha * e + Ua) % Wa) / Wa;
}
//#endregion
//#region node_modules/d3-force/src/simulation.js
function Ka(e) {
	return e.x;
}
function qa(e) {
	return e.y;
}
var Ja = 10, Ya = Math.PI * (3 - Math.sqrt(5));
function Xa(e) {
	var t, n = 1, r = .001, i = 1 - r ** (1 / 300), a = 0, o = .6, s = /* @__PURE__ */ new Map(), c = Ir(d), l = ee("tick", "end"), u = Ga();
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
				var i = Ja * Math.sqrt(.5 + t), a = t * Ya;
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
function Za() {
	var e, t, n, r, i = Pa(-30), a, o = 1, s = Infinity, c = .81;
	function l(n) {
		var i, a = e.length, o = Aa(e, Ka, qa).visitAfter(d);
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
		if (p * p / c < m) return m < s && (d === 0 && (d = Fa(n), m += d * d), f === 0 && (f = Fa(n), m += f * f), m < o && (m = Math.sqrt(o * m)), t.vx += d * e.value * r / m, t.vy += f * e.value * r / m), !0;
		if (!(e.length || m >= s)) {
			(e.data !== t || e.next) && (d === 0 && (d = Fa(n), m += d * d), f === 0 && (f = Fa(n), m += f * f), m < o && (m = Math.sqrt(o * m)));
			do
				e.data !== t && (p = a[e.data.index] * r / m, t.vx += d * p, t.vy += f * p);
			while (e = e.next);
		}
	}
	return l.initialize = function(t, r) {
		e = t, n = r, u();
	}, l.strength = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : Pa(+e), u(), l) : i;
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
function Qa(e) {
	var t = Pa(.1), n, r, i;
	typeof e != "function" && (e = Pa(e == null ? 0 : +e));
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
		return arguments.length ? (t = typeof e == "function" ? e : Pa(+e), o(), a) : t;
	}, a.x = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : Pa(+t), o(), a) : e;
	}, a;
}
//#endregion
//#region node_modules/d3-force/src/y.js
function $a(e) {
	var t = Pa(.1), n, r, i;
	typeof e != "function" && (e = Pa(e == null ? 0 : +e));
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
		return arguments.length ? (t = typeof e == "function" ? e : Pa(+e), o(), a) : t;
	}, a.y = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : Pa(+t), o(), a) : e;
	}, a;
}
//#endregion
//#region node_modules/d3-zoom/src/constant.js
var eo = (e) => () => e;
//#endregion
//#region node_modules/d3-zoom/src/event.js
function to(e, { sourceEvent: t, target: n, transform: r, dispatch: i }) {
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
function no(e, t, n) {
	this.k = e, this.x = t, this.y = n;
}
no.prototype = {
	constructor: no,
	scale: function(e) {
		return e === 1 ? this : new no(this.k * e, this.x, this.y);
	},
	translate: function(e, t) {
		return e === 0 & t === 0 ? this : new no(this.k, this.x + this.k * e, this.y + this.k * t);
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
var ro = new no(1, 0, 0);
io.prototype = no.prototype;
function io(e) {
	for (; !e.__zoom;) if (!(e = e.parentNode)) return ro;
	return e.__zoom;
}
//#endregion
//#region node_modules/d3-zoom/src/noevent.js
function ao(e) {
	e.stopImmediatePropagation();
}
function oo(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region node_modules/d3-zoom/src/zoom.js
function so(e) {
	return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function co() {
	var e = this;
	return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function lo() {
	return this.__zoom || ro;
}
function uo(e) {
	return -e.deltaY * (e.deltaMode === 1 ? .05 : e.deltaMode ? 1 : .002) * (e.ctrlKey ? 10 : 1);
}
function fo() {
	return navigator.maxTouchPoints || "ontouchstart" in this;
}
function po(e, t, n) {
	var r = e.invertX(t[0][0]) - n[0][0], i = e.invertX(t[1][0]) - n[1][0], a = e.invertY(t[0][1]) - n[0][1], o = e.invertY(t[1][1]) - n[1][1];
	return e.translate(i > r ? (r + i) / 2 : Math.min(0, r) || Math.max(0, i), o > a ? (a + o) / 2 : Math.min(0, a) || Math.max(0, o));
}
function mo() {
	var e = so, t = co, n = po, r = uo, i = fo, a = [0, Infinity], o = [[-Infinity, -Infinity], [Infinity, Infinity]], s = 250, c = xr, l = ee("start", "zoom", "end"), u, d, f, p = 500, m = 150, h = 0, g = 10;
	function _(e) {
		e.property("__zoom", lo).on("wheel.zoom", te, { passive: !1 }).on("mousedown.zoom", ne).on("dblclick.zoom", re).filter(i).on("touchstart.zoom", w).on("touchmove.zoom", ie).on("touchend.zoom touchcancel.zoom", T).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	}
	_.transform = function(e, t, n, r) {
		var i = e.selection ? e.selection() : e;
		i.property("__zoom", lo), e === i ? i.interrupt().each(function() {
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
			return n(ro.translate(c[0], c[1]).scale(s.k).translate(typeof r == "function" ? -r.apply(this, arguments) : -r, typeof i == "function" ? -i.apply(this, arguments) : -i), e, o);
		}, a, s);
	};
	function v(e, t) {
		return t = Math.max(a[0], Math.min(a[1], t)), t === e.k ? e : new no(t, e.x, e.y);
	}
	function y(e, t, n) {
		var r = t[0] - n[0] * e.k, i = t[1] - n[1] * e.k;
		return r === e.x && i === e.y ? e : new no(e.k, r, i);
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
					e = new no(n, l[0] - t[0] * n, l[1] - t[1] * n);
				}
				o.zoom(null, e);
			};
		});
	}
	function S(e, t, n) {
		return !n && e.__zooming || new C(e, t);
	}
	function C(e, n) {
		this.that = e, this.args = n, this.active = 0, this.sourceEvent = null, this.extent = t.apply(e, n), this.taps = 0;
	}
	C.prototype = {
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
			var t = Jt(this.that).datum();
			l.call(e, this.that, new to(e, {
				sourceEvent: this.sourceEvent,
				target: _,
				type: e,
				transform: this.that.__zoom,
				dispatch: l
			}), t);
		}
	};
	function te(t, ...i) {
		if (!e.apply(this, arguments)) return;
		var s = S(this, i).event(t), c = this.__zoom, l = Math.max(a[0], Math.min(a[1], c.k * 2 ** r.apply(this, arguments))), u = Xt(t);
		if (s.wheel) (s.mouse[0][0] !== u[0] || s.mouse[0][1] !== u[1]) && (s.mouse[1] = c.invert(s.mouse[0] = u)), clearTimeout(s.wheel);
		else if (c.k === l) return;
		else s.mouse = [u, c.invert(u)], Qr(this), s.start();
		oo(t), s.wheel = setTimeout(d, m), s.zoom("mouse", n(y(v(c, l), s.mouse[0], s.mouse[1]), s.extent, o));
		function d() {
			s.wheel = null, s.end();
		}
	}
	function ne(t, ...r) {
		if (f || !e.apply(this, arguments)) return;
		var i = t.currentTarget, a = S(this, r, !0).event(t), s = Jt(t.view).on("mousemove.zoom", d, !0).on("mouseup.zoom", p, !0), c = Xt(t, i), l = t.clientX, u = t.clientY;
		tn(t.view), ao(t), a.mouse = [c, this.__zoom.invert(c)], Qr(this), a.start();
		function d(e) {
			if (oo(e), !a.moved) {
				var t = e.clientX - l, r = e.clientY - u;
				a.moved = t * t + r * r > h;
			}
			a.event(e).zoom("mouse", n(y(a.that.__zoom, a.mouse[0] = Xt(e, i), a.mouse[1]), a.extent, o));
		}
		function p(e) {
			s.on("mousemove.zoom mouseup.zoom", null), nn(e.view, a.moved), oo(e), a.event(e).end();
		}
	}
	function re(r, ...i) {
		if (e.apply(this, arguments)) {
			var a = this.__zoom, c = Xt(r.changedTouches ? r.changedTouches[0] : r, this), l = a.invert(c), u = a.k * (r.shiftKey ? .5 : 2), d = n(y(v(a, u), c, l), t.apply(this, i), o);
			oo(r), s > 0 ? Jt(this).transition().duration(s).call(x, d, c, r) : Jt(this).call(_.transform, d, c, r);
		}
	}
	function w(t, ...n) {
		if (e.apply(this, arguments)) {
			var r = t.touches, i = r.length, a = S(this, n, t.changedTouches.length === i).event(t), o, s, c, l;
			for (ao(t), s = 0; s < i; ++s) c = r[s], l = Xt(c, this), l = [
				l,
				this.__zoom.invert(l),
				c.identifier
			], a.touch0 ? !a.touch1 && a.touch0[2] !== l[2] && (a.touch1 = l, a.taps = 0) : (a.touch0 = l, o = !0, a.taps = 1 + !!u);
			u &&= clearTimeout(u), o && (a.taps < 2 && (d = l[0], u = setTimeout(function() {
				u = null;
			}, p)), Qr(this), a.start());
		}
	}
	function ie(e, ...t) {
		if (this.__zooming) {
			var r = S(this, t).event(e), i = e.changedTouches, a = i.length, s, c, l, u;
			for (oo(e), s = 0; s < a; ++s) c = i[s], l = Xt(c, this), r.touch0 && r.touch0[2] === c.identifier ? r.touch0[0] = l : r.touch1 && r.touch1[2] === c.identifier && (r.touch1[0] = l);
			if (c = r.that.__zoom, r.touch1) {
				var d = r.touch0[0], f = r.touch0[1], p = r.touch1[0], m = r.touch1[1], h = (h = p[0] - d[0]) * h + (h = p[1] - d[1]) * h, g = (g = m[0] - f[0]) * g + (g = m[1] - f[1]) * g;
				c = v(c, Math.sqrt(h / g)), l = [(d[0] + p[0]) / 2, (d[1] + p[1]) / 2], u = [(f[0] + m[0]) / 2, (f[1] + m[1]) / 2];
			} else if (r.touch0) l = r.touch0[0], u = r.touch0[1];
			else return;
			r.zoom("touch", n(y(c, l, u), r.extent, o));
		}
	}
	function T(e, ...t) {
		if (this.__zooming) {
			var n = S(this, t).event(e), r = e.changedTouches, i = r.length, a, o;
			for (ao(e), f && clearTimeout(f), f = setTimeout(function() {
				f = null;
			}, p), a = 0; a < i; ++a) o = r[a], n.touch0 && n.touch0[2] === o.identifier ? delete n.touch0 : n.touch1 && n.touch1[2] === o.identifier && delete n.touch1;
			if (n.touch1 && !n.touch0 && (n.touch0 = n.touch1, delete n.touch1), n.touch0) n.touch0[1] = this.__zoom.invert(n.touch0[0]);
			else if (n.end(), n.taps === 2 && (o = Xt(o, this), Math.hypot(d[0] - o[0], d[1] - o[1]) < g)) {
				var s = Jt(this).on("dblclick.zoom");
				s && s.apply(this, arguments);
			}
		}
	}
	return _.wheelDelta = function(e) {
		return arguments.length ? (r = typeof e == "function" ? e : eo(+e), _) : r;
	}, _.filter = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : eo(!!t), _) : e;
	}, _.touchable = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : eo(!!e), _) : i;
	}, _.extent = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : eo([[+e[0][0], +e[0][1]], [+e[1][0], +e[1][1]]]), _) : t;
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
var ho = {
	graphContainer: "_graphContainer_mky3l_1",
	tooltip: "_tooltip_mky3l_58",
	tooltipTitle: "_tooltipTitle_mky3l_72",
	tooltipDesc: "_tooltipDesc_mky3l_78",
	tooltipDate: "_tooltipDate_mky3l_83"
}, go = /* @__PURE__ */ o(((e) => {
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
})), _o = /* @__PURE__ */ o(((e) => {
	process.env.NODE_ENV !== "production" && (function() {
		function t(e) {
			if (e == null) return null;
			if (typeof e == "function") return e.$$typeof === ie ? null : e.displayName || e.name || null;
			if (typeof e == "string") return e;
			switch (e) {
				case v: return "Fragment";
				case b: return "Profiler";
				case y: return "StrictMode";
				case C: return "Suspense";
				case te: return "SuspenseList";
				case w: return "Activity";
			}
			if (typeof e == "object") switch (typeof e.tag == "number" && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), e.$$typeof) {
				case _: return "Portal";
				case ee: return e.displayName || "Context";
				case x: return (e._context.displayName || "Context") + ".Consumer";
				case S:
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
		function a() {
			var e = T.A;
			return e === null ? null : e.getOwner();
		}
		function o() {
			return Error("react-stack-top-frame");
		}
		function s(e) {
			if (ae.call(e, "key")) {
				var t = Object.getOwnPropertyDescriptor(e, "key").get;
				if (t && t.isReactWarning) return !1;
			}
			return e.key !== void 0;
		}
		function c(e, t) {
			function n() {
				se || (se = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", t));
			}
			n.isReactWarning = !0, Object.defineProperty(e, "key", {
				get: n,
				configurable: !0
			});
		}
		function l() {
			var e = t(this.type);
			return ce[e] || (ce[e] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release.")), e = this.props.ref, e === void 0 ? null : e;
		}
		function u(e, t, n, r, i, a) {
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
				get: l
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
		function f(e, n, i, o, l, d) {
			var f = n.children;
			if (f !== void 0) if (o) if (oe(f)) {
				for (o = 0; o < f.length; o++) p(f[o]);
				Object.freeze && Object.freeze(f);
			} else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
			else p(f);
			if (ae.call(n, "key")) {
				f = t(e);
				var m = Object.keys(n).filter(function(e) {
					return e !== "key";
				});
				o = 0 < m.length ? "{key: someKey, " + m.join(": ..., ") + ": ...}" : "{key: someKey}", le[f + o] || (m = 0 < m.length ? "{" + m.join(": ..., ") + ": ...}" : "{}", console.error("A props object containing a \"key\" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />", o, f, m, f), le[f + o] = !0);
			}
			if (f = null, i !== void 0 && (r(i), f = "" + i), s(n) && (r(n.key), f = "" + n.key), "key" in n) for (var h in i = {}, n) h !== "key" && (i[h] = n[h]);
			else i = n;
			return f && c(i, typeof e == "function" ? e.displayName || e.name || "Unknown" : e), u(e, f, i, a(), l, d);
		}
		function p(e) {
			m(e) ? e._store && (e._store.validated = 1) : typeof e == "object" && e && e.$$typeof === re && (e._payload.status === "fulfilled" ? m(e._payload.value) && e._payload.value._store && (e._payload.value._store.validated = 1) : e._store && (e._store.validated = 1));
		}
		function m(e) {
			return typeof e == "object" && !!e && e.$$typeof === g;
		}
		var h = d(), g = Symbol.for("react.transitional.element"), _ = Symbol.for("react.portal"), v = Symbol.for("react.fragment"), y = Symbol.for("react.strict_mode"), b = Symbol.for("react.profiler"), x = Symbol.for("react.consumer"), ee = Symbol.for("react.context"), S = Symbol.for("react.forward_ref"), C = Symbol.for("react.suspense"), te = Symbol.for("react.suspense_list"), ne = Symbol.for("react.memo"), re = Symbol.for("react.lazy"), w = Symbol.for("react.activity"), ie = Symbol.for("react.client.reference"), T = h.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ae = Object.prototype.hasOwnProperty, oe = Array.isArray, E = console.createTask ? console.createTask : function() {
			return null;
		};
		h = { react_stack_bottom_frame: function(e) {
			return e();
		} };
		var se, ce = {}, D = h.react_stack_bottom_frame.bind(h, o)(), O = E(i(o)), le = {};
		e.Fragment = v, e.jsx = function(e, t, n) {
			var r = 1e4 > T.recentlyCreatedOwnerStacks++;
			return f(e, t, n, !1, r ? Error("react-stack-top-frame") : D, r ? E(i(e)) : O);
		}, e.jsxs = function(e, t, n) {
			var r = 1e4 > T.recentlyCreatedOwnerStacks++;
			return f(e, t, n, !0, r ? Error("react-stack-top-frame") : D, r ? E(i(e)) : O);
		};
	})();
})), P = (/* @__PURE__ */ o(((e, t) => {
	process.env.NODE_ENV === "production" ? t.exports = go() : t.exports = _o();
})))();
function vo(e, t = {}) {
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
function F({ feedData: e, onNodeSelect: t }) {
	let n = (0, Ur.useRef)(null), r = (0, Ur.useRef)(null), i = (0, Ur.useRef)(null), a = (0, Ur.useRef)(null), o = (0, Ur.useRef)(null), [s, c] = (0, Ur.useState)({
		show: !1,
		x: 0,
		y: 0,
		title: "",
		desc: "",
		date: ""
	});
	return (0, Ur.useEffect)(() => {
		if (!e || !n.current) return;
		let r = n.current, s = r.clientWidth, l = r.clientHeight, u = getComputedStyle(r), d = {
			nodeDraftColor: u.getPropertyValue("--gv-node-draft").trim() || "#555",
			nodePublishedColor: u.getPropertyValue("--gv-node-published").trim() || "#2ecc71",
			tagColor: u.getPropertyValue("--gv-tag-color").trim() || "#f39c12"
		}, f = vo(e, d);
		Jt(r).selectAll("svg").remove();
		let p = Jt(r).append("svg").attr("width", s).attr("height", l).call(mo().on("zoom", (e) => {
			m.attr("transform", e.transform);
		})).on("dblclick.zoom", null);
		i.current = p;
		let m = p.append("g"), h = Xa().force("link", Va().id((e) => e.id).distance(160)).force("charge", Za().strength(-500)).force("collide", Ra().radius((e) => (e._r || e.size / 2) + 8).strength(.9)).force("center", pa(s / 2, l / 2)).velocityDecay(.85).alphaDecay(.05);
		a.current = h;
		let g = () => {
			n.current && (s = n.current.clientWidth, l = n.current.clientHeight, p.attr("width", s).attr("height", l), h.force("center", pa(s / 2, l / 2)), h.alpha(.1).restart());
		};
		window.addEventListener("resize", g), o.current = g;
		let _ = m.selectAll(".link").data(f.links).enter().append("line").attr("class", "link"), v = m.selectAll(".node").data(f.nodes).enter().append("g").attr("class", "node").call(un().on("start", (e, t) => {
			e.active || h.alphaTarget(.3).restart(), t.fx = t.x, t.fy = t.y;
		}).on("drag", (e, t) => {
			t.fx = e.x, t.fy = e.y;
		}).on("end", (e, t) => {
			e.active || h.alphaTarget(0), t.fx = null, t.fy = null;
		})), y = p.append("text").style("font-family", "'Atkinson', sans-serif").style("visibility", "hidden");
		v.each(function(e) {
			let t = Jt(this);
			if (e.type === "tag") {
				y.style("font-size", "14px").style("font-weight", "400"), y.text(e.label);
				let n = y.node().getComputedTextLength() + 28, r = 35.599999999999994;
				t.append("rect").attr("x", -n / 2).attr("y", -r / 2).attr("width", n).attr("height", r).attr("rx", r / 2).attr("ry", r / 2).attr("fill", e.color).attr("opacity", .7), t.append("text").attr("text-anchor", "middle").attr("dominant-baseline", "central").attr("fill", "#1a1a2e").style("font-size", "14px").style("font-weight", "400").style("pointer-events", "none").text(e.label), e._r = Math.max(n, r) / 2;
			} else {
				let n = e.color === d.nodeDraftColor, r = n ? "#555" : d.nodePublishedColor;
				if (e.kind === "image" && e.image) t.append("foreignObject").attr("width", 180).attr("height", 204).attr("x", -180 / 2).attr("y", -180 / 2).append("xhtml:div").attr("xmlns", "http://www.w3.org/1999/xhtml").style("width", "180px").style("font-family", "'Atkinson', sans-serif").style("cursor", "pointer").html("<div style=\"width:180px;height:180px;background:#000 url('" + e.image + "') center/cover no-repeat;border:1.5px solid " + r + ";border-radius:4px;\"></div><div style=\"font-size:11px;color:rgba(255,255,255,0.6);text-align:center;margin-top:4px;line-height:1.2;\">" + (e.short_title || e.title || e.label) + "</div>"), e._r = 102;
				else {
					let i = n ? "#2a2a3e" : "#1e3a5f", a = e.image ? "linear-gradient(" + (n ? "rgba(42,42,62,0.85),rgba(42,42,62,0.85)" : "rgba(30,58,95,0.85),rgba(30,58,95,0.85)") + "), url('" + e.image + "')" : i, o = e.description || "";
					t.append("foreignObject").attr("width", 180).attr("height", 140).attr("x", -180 / 2).attr("y", -140 / 2).append("xhtml:div").attr("xmlns", "http://www.w3.org/1999/xhtml").style("width", "180px").style("height", "140px").style("background", a).style("background-size", "cover").style("background-position", "center").style("border", "1.5px solid " + r).style("border-radius", "4px").style("padding", "10px 12px").style("box-sizing", "border-box").style("overflow", "hidden").style("font-family", "'Atkinson', sans-serif").style("cursor", "pointer").html((() => {
						let t = o.length > 120 ? o.slice(0, 117) + "..." : o;
						return "<span style=\"font-size:15px;font-weight:700;color:#fff;line-height:1.3;\">" + (e.title || e.label) + "</span>" + (t ? "<br><span style=\"zoom:0.65;font-size:15px;color:rgba(255,255,255,0.35);line-height:1.3;font-style:italic;\">" + t + "</span>" : "");
					})()), e._r = 180 / 2;
				}
			}
		}), y.remove(), v.filter((e) => e.type === "article").on("click", (e, n) => {
			t && t(n.originalItem || n);
		}).on("mouseover", (e, t) => {
			c({
				show: !0,
				x: e.clientX + 16,
				y: e.clientY + 16,
				title: t.title || t.label,
				desc: t.description || "",
				date: t.date || ""
			});
		}).on("mousemove", (e) => {
			c((t) => ({
				...t,
				x: e.clientX + 16,
				y: e.clientY + 16
			}));
		}).on("mouseout", () => {
			c((e) => ({
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
				let n = s / 2, r = l / 2;
				h.force("x", Qa((t) => e.has(t.id) ? n : t.x < n ? n - 500 : n + 500).strength((t) => e.has(t.id) ? .3 : .15)).force("y", $a(r).strength((t) => e.has(t.id) ? .3 : .1)), h.alpha(.6).restart();
			}
		}), p.on("click", () => {
			b && (b = null, v.classed("dimmed", !1).classed("tag-active", !1), _.classed("highlighted", !1), h.force("x", null).force("y", null), h.alpha(.4).restart());
		}), h.nodes(f.nodes).on("tick", () => {
			_.attr("x1", (e) => e.source.x).attr("y1", (e) => e.source.y).attr("x2", (e) => e.target.x).attr("y2", (e) => e.target.y), v.attr("transform", (e) => "translate(" + e.x + "," + e.y + ")");
		}), h.force("link").links(f.links), () => {
			h.stop(), o.current && window.removeEventListener("resize", o.current);
		};
	}, [e, t]), /* @__PURE__ */ (0, P.jsxs)(P.Fragment, { children: [/* @__PURE__ */ (0, P.jsx)("div", {
		ref: n,
		className: ho.graphContainer
	}), s.show && /* @__PURE__ */ (0, P.jsxs)("div", {
		ref: r,
		className: ho.tooltip,
		style: {
			display: "block",
			left: s.x,
			top: s.y
		},
		children: [
			/* @__PURE__ */ (0, P.jsx)("div", {
				className: ho.tooltipTitle,
				children: s.title
			}),
			/* @__PURE__ */ (0, P.jsx)("div", {
				className: ho.tooltipDesc,
				children: s.desc
			}),
			/* @__PURE__ */ (0, P.jsx)("div", {
				className: ho.tooltipDate,
				children: s.date
			})
		]
	})] });
}
var I = {
	overlay: "_overlay_1o6n0_1",
	open: "_open_1o6n0_13",
	panel: "_panel_1o6n0_17",
	toolbar: "_toolbar_1o6n0_52",
	toolbarGroup: "_toolbarGroup_1o6n0_63",
	toolbarSeparator: "_toolbarSeparator_1o6n0_69",
	toolbarSpacer: "_toolbarSpacer_1o6n0_76",
	tb: "_tb_1o6n0_80",
	active: "_active_1o6n0_102",
	closeBtn: "_closeBtn_1o6n0_107",
	tbTooltip: "_tbTooltip_1o6n0_122",
	syndLink: "_syndLink_1o6n0_142",
	canonical: "_canonical_1o6n0_160",
	progress: "_progress_1o6n0_176",
	progressFill: "_progressFill_1o6n0_182",
	frontmatterPanel: "_frontmatterPanel_1o6n0_189",
	fmRow: "_fmRow_1o6n0_203",
	fmLabel: "_fmLabel_1o6n0_210",
	fmValue: "_fmValue_1o6n0_219",
	fmTag: "_fmTag_1o6n0_223",
	fmSyndLink: "_fmSyndLink_1o6n0_233",
	body: "_body_1o6n0_243",
	articleHeader: "_articleHeader_1o6n0_290",
	articleTitle: "_articleTitle_1o6n0_294",
	articleByline: "_articleByline_1o6n0_302",
	articleMeta: "_articleMeta_1o6n0_317",
	copyToast: "_copyToast_1o6n0_322",
	show: "_show_1o6n0_338"
}, yo = {
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
function bo({ article: e, onClose: t, settings: n }) {
	let [r, i] = (0, Ur.useState)(!1), [a, o] = (0, Ur.useState)(!1), [s, c] = (0, Ur.useState)(""), [l, u] = (0, Ur.useState)(0), [d, f] = (0, Ur.useState)(!1), p = (0, Ur.useRef)(null);
	(0, Ur.useEffect)(() => {
		e ? (i(!0), m(e)) : (i(!1), c(""), u(0), o(!1));
	}, [e]);
	let m = async (e) => {
		let t = e.kind || "essay";
		if (t === "essay" || t === "multi") try {
			let t = await fetch(e.url);
			if (!t.ok) throw Error("HTTP " + t.status);
			let n = await t.text(), r = new DOMParser().parseFromString(n, "text/html"), i = r.querySelector("h1");
			i && i.remove(), c((r.querySelector("body") ? r.querySelector("body").innerHTML : n) + So(e));
		} catch {
			c(xo(e, "Rendered article not yet published to GitHub Pages."));
		}
		else c(t === "image" ? (e.image ? `<img src="${e.image}" style="max-width:100%;height:auto;border-radius:4px;display:block;margin:0 auto;">` : "<p style=\"color:#666;\">No image resolved.</p>") + Co(e) : xo(e) + Co(e));
	}, h = () => {
		if (p.current) {
			let { scrollTop: e, scrollHeight: t, clientHeight: n } = p.current, r = e / (t - n) * 100;
			u(Math.min(r, 100));
		}
	}, g = async () => {
		if (!e || !p.current) return;
		let t = `${(n?.export?.license_header || "").replace("{{canonical_url}}", e.canonical_url || e.url)}\n\n---\n\n${p.current.innerText}`;
		try {
			await navigator.clipboard.writeText(t), f(!0), setTimeout(() => f(!1), 2e3);
		} catch (e) {
			console.error("Copy failed:", e);
		}
	}, _ = () => {
		if (!e || !p.current) return;
		let t = `${(n?.export?.license_header || "").replace("{{canonical_url}}", e.canonical_url || e.url)}\n\n---\n\n${p.current.innerText}`, r = new Blob([t], { type: "text/markdown" }), i = document.createElement("a");
		i.href = URL.createObjectURL(r), i.download = `${(e.id || e.url).split("/").pop().replace(".html", "") || "article"}.md`, i.click(), URL.revokeObjectURL(i.href);
	}, v = async (t) => {
		if (t.preventDefault(), e) try {
			await navigator.clipboard.writeText(e.canonical_url || e.url), f(!0), setTimeout(() => f(!1), 2e3);
		} catch (e) {
			console.error("Copy URL failed:", e);
		}
	};
	if (!e) return null;
	let y = [e.date ? (/* @__PURE__ */ new Date(`${e.date}T00:00:00`)).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	}) : "", e.reading_time].filter(Boolean);
	return /* @__PURE__ */ (0, P.jsxs)(P.Fragment, { children: [
		/* @__PURE__ */ (0, P.jsx)("div", {
			className: `${I.overlay} ${r ? I.open : ""}`,
			onClick: t
		}),
		/* @__PURE__ */ (0, P.jsxs)("div", {
			className: `${I.panel} ${r ? I.open : ""}`,
			children: [
				/* @__PURE__ */ (0, P.jsxs)("div", {
					className: I.toolbar,
					children: [
						/* @__PURE__ */ (0, P.jsx)("div", {
							id: "tts-mount-point",
							className: I.toolbarGroup
						}),
						/* @__PURE__ */ (0, P.jsx)("div", { className: I.toolbarSeparator }),
						/* @__PURE__ */ (0, P.jsxs)("div", {
							className: I.toolbarGroup,
							children: [
								/* @__PURE__ */ (0, P.jsx)("button", {
									className: `${I.tb} ${a ? I.active : ""}`,
									onClick: () => o(!a),
									title: "Article details",
									dangerouslySetInnerHTML: { __html: `${yo.info}<span class="${I.tbTooltip}">Details</span>` }
								}),
								/* @__PURE__ */ (0, P.jsx)("button", {
									className: I.tb,
									onClick: _,
									title: "Export markdown",
									dangerouslySetInnerHTML: { __html: `${yo.download}<span class="${I.tbTooltip}">Export</span>` }
								}),
								/* @__PURE__ */ (0, P.jsx)("button", {
									className: I.tb,
									onClick: g,
									title: "Copy to clipboard",
									dangerouslySetInnerHTML: { __html: `${yo.copy}<span class="${I.tbTooltip}">Copy</span>` }
								})
							]
						}),
						/* @__PURE__ */ (0, P.jsx)("div", { className: I.toolbarSeparator }),
						/* @__PURE__ */ (0, P.jsxs)("div", {
							className: I.toolbarGroup,
							children: [/* @__PURE__ */ (0, P.jsx)("button", {
								className: `${I.tb} ${I.syndLink} ${I.canonical}`,
								onClick: v,
								dangerouslySetInnerHTML: { __html: `${yo.link}<span class="${I.tbTooltip}">Copy URL</span>` }
							}), Object.entries(e.syndication || {}).map(([e, t]) => {
								if (!t) return null;
								let r = n?.toolbar?.syndication_icons?.[e];
								return r ? /* @__PURE__ */ (0, P.jsx)("a", {
									href: t,
									target: "_blank",
									rel: "noopener noreferrer",
									className: `${I.tb} ${I.syndLink}`,
									dangerouslySetInnerHTML: { __html: `${yo[r.icon] || yo.globe}<span class="${I.tbTooltip}">${r.label}</span>` }
								}, e) : null;
							})]
						}),
						/* @__PURE__ */ (0, P.jsx)("div", { className: I.toolbarSpacer }),
						/* @__PURE__ */ (0, P.jsx)("button", {
							className: `${I.tb} ${I.closeBtn}`,
							onClick: t,
							title: "Close",
							dangerouslySetInnerHTML: { __html: `${yo.close}<span class="${I.tbTooltip}">Close</span>` }
						})
					]
				}),
				/* @__PURE__ */ (0, P.jsx)("div", {
					className: I.progress,
					children: /* @__PURE__ */ (0, P.jsx)("div", {
						className: I.progressFill,
						style: { width: `${l}%` }
					})
				}),
				a && /* @__PURE__ */ (0, P.jsx)(wo, {
					article: e,
					settings: n
				}),
				/* @__PURE__ */ (0, P.jsxs)("div", {
					className: I.body,
					ref: p,
					onScroll: h,
					children: [/* @__PURE__ */ (0, P.jsxs)("div", {
						className: I.articleHeader,
						children: [
							/* @__PURE__ */ (0, P.jsx)("div", {
								className: I.articleTitle,
								children: e.title || e.label
							}),
							/* @__PURE__ */ (0, P.jsxs)("div", {
								className: I.articleByline,
								children: ["by ", /* @__PURE__ */ (0, P.jsx)("a", {
									href: n?.author?.url,
									target: "_blank",
									rel: "noopener noreferrer",
									children: n?.author?.display
								})]
							}),
							y.length > 0 && /* @__PURE__ */ (0, P.jsx)("div", {
								className: I.articleMeta,
								children: y.join(" · ")
							}),
							e.kind && e.kind !== "essay" && /* @__PURE__ */ (0, P.jsxs)("div", {
								className: I.articleMeta,
								style: {
									marginTop: 4,
									opacity: .7
								},
								children: ["substrate: ", e.kind]
							})
						]
					}), /* @__PURE__ */ (0, P.jsx)("div", { dangerouslySetInnerHTML: { __html: s } })]
				})
			]
		}),
		/* @__PURE__ */ (0, P.jsx)("div", {
			className: `${I.copyToast} ${d ? I.show : ""}`,
			children: "Copied to clipboard"
		})
	] });
}
function xo(e, t) {
	let n = t || `This substrate ("${e.kind || "unknown"}") is not yet renderable in the viewer.`, r = "<div style=\"padding:24px;border:1px dashed var(--rp-border);border-radius:6px;background:rgba(17,24,39,0.4);\">";
	return r += `<p style="color:var(--rp-accent);font-weight:600;margin-bottom:8px;">${n}</p>`, e.todos && e.todos.length && (r += `<p style="color:#f39c12;font-size:13px;">Pending: ${e.todos.join(", ")}</p>`), r += `<p style="color:#888;font-size:13px;margin-top:12px;">The folder exists at <code>~/Posts/${e.id}/</code>.</p>`, r += "</div>", r;
}
function So(e) {
	let t = e.forms && e.forms.companions || [];
	if (!t.length) return "";
	let n = "<div style=\"margin-top:32px;padding-top:24px;border-top:1px solid var(--rp-border);\">";
	return n += "<div style=\"color:var(--rp-accent);font-size:11px;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;\">also exists as</div>", n += `<div style="color:var(--rp-text);font-size:14px;">${t.map((e) => `<span class="${I.fmTag}">${e}</span>`).join(" ")}</div>`, n += "</div>", n;
}
function Co(e) {
	let t = [];
	if (e.seed && t.push(["seed", e.seed]), e.tldr && t.push(["tldr", e.tldr]), e.topology && e.topology.length && t.push(["topology", e.topology.join(" · ")]), e.energy && t.push(["energy", e.energy]), e.note && t.push(["note", e.note]), !t.length) return "";
	let n = "<div style=\"margin-top:32px;padding:20px;background:rgba(17,24,39,0.4);border-radius:6px;\">";
	for (let [e, r] of t) n += `<div class="${I.fmRow}"><span class="${I.fmLabel}">${e}</span><span class="${I.fmValue}">${r}</span></div>`;
	return n += "</div>", n;
}
function wo({ article: e, settings: t }) {
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
				e.tags && e.tags.length && (n = /* @__PURE__ */ (0, P.jsx)(P.Fragment, { children: e.tags.map((e) => /* @__PURE__ */ (0, P.jsx)("span", {
					className: I.fmTag,
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
				r.length && (n = /* @__PURE__ */ (0, P.jsx)(P.Fragment, { children: r.map(([e, t], n) => /* @__PURE__ */ (0, P.jsxs)(Ur.Fragment, { children: [/* @__PURE__ */ (0, P.jsx)("a", {
					className: I.fmSyndLink,
					href: t,
					target: "_blank",
					rel: "noopener noreferrer",
					children: e
				}), n < r.length - 1 ? " · " : ""] }, e)) }));
				break;
			default: break;
		}
		return n ? (r = !0, /* @__PURE__ */ (0, P.jsxs)("div", {
			className: I.fmRow,
			children: [/* @__PURE__ */ (0, P.jsx)("span", {
				className: I.fmLabel,
				children: t.replace(/_/g, " ")
			}), /* @__PURE__ */ (0, P.jsx)("span", {
				className: I.fmValue,
				children: n
			})]
		}, t)) : null;
	});
	return /* @__PURE__ */ (0, P.jsx)("div", {
		className: `${I.frontmatterPanel} ${I.open}`,
		children: r ? i : /* @__PURE__ */ (0, P.jsx)("div", {
			className: I.fmRow,
			children: /* @__PURE__ */ (0, P.jsx)("span", {
				className: I.fmValue,
				style: { color: "#666" },
				children: "No metadata available."
			})
		})
	});
}
var To = {
	ttsGroup: "_ttsGroup_1svjf_1",
	tb: "_tb_1svjf_12",
	tbTooltip: "_tbTooltip_1svjf_39",
	select: "_select_1svjf_59",
	params: "_params_1svjf_76"
};
//#endregion
//#region src/components/TTS/TTS.jsx
function Eo({ targetRef: e }) {
	let [t, n] = (0, Ur.useState)(null), [r, i] = (0, Ur.useState)("stopped"), [a, o] = (0, Ur.useState)([]), [s, c] = (0, Ur.useState)(""), [l, u] = (0, Ur.useState)([]), [d, f] = (0, Ur.useState)(""), [p, m] = (0, Ur.useState)({}), [h, g] = (0, Ur.useState)({});
	(0, Ur.useEffect)(() => {
		if (!window.TTS) return;
		let e = window.TTS;
		n(e);
		let t = (e) => i(e), r = () => {
			o(e.engines()), c(e.selected());
		}, a = () => {
			u(e.voices()), m(e.capabilities());
			let t = {}, n = e.capabilities();
			for (let r of Object.keys(n)) r === "voice" ? f(e.get("voice") || n.voice.default) : t[r] = e.get(r) === void 0 ? n[r].default : e.get(r);
			g(t);
		};
		return e.on("state", t), e.on("capabilitiesChanged", a), r(), a(), window.speechSynthesis && window.speechSynthesis.addEventListener("voiceschanged", a), () => {
			window.speechSynthesis && window.speechSynthesis.removeEventListener("voiceschanged", a);
		};
	}, []);
	let _ = (e) => {
		if (!t) return;
		let n = e.target.value;
		t.select(n), c(n), u(t.voices()), m(t.capabilities());
	}, v = (e) => {
		if (!t) return;
		let n = e.target.value;
		t.set("voice", n), f(n);
	}, y = (e, n) => {
		t && (t.set(e, n), g((t) => ({
			...t,
			[e]: n
		})));
	};
	return t ? /* @__PURE__ */ (0, P.jsxs)("div", {
		className: To.ttsGroup,
		children: [
			r !== "playing" && /* @__PURE__ */ (0, P.jsx)("button", {
				className: To.tb,
				onClick: () => {
					!t || !e.current || t.play(e.current, { scrollContainer: e.current });
				},
				title: "Play",
				dangerouslySetInnerHTML: { __html: `${yo.play}<span class="${To.tbTooltip}">Play</span>` }
			}),
			r === "playing" && /* @__PURE__ */ (0, P.jsx)("button", {
				className: To.tb,
				onClick: () => {
					t && t.pause();
				},
				title: "Pause",
				dangerouslySetInnerHTML: { __html: `${yo.pause}<span class="${To.tbTooltip}">Pause</span>` }
			}),
			(r === "playing" || r === "paused" || r === "loading") && /* @__PURE__ */ (0, P.jsx)("button", {
				className: To.tb,
				onClick: () => {
					t && t.stop();
				},
				title: "Stop",
				dangerouslySetInnerHTML: { __html: `${yo.stop}<span class="${To.tbTooltip}">Stop</span>` }
			}),
			/* @__PURE__ */ (0, P.jsx)("select", {
				className: To.select,
				style: { maxWidth: 110 },
				value: s,
				onChange: _,
				title: "TTS Engine",
				children: a.map((e) => /* @__PURE__ */ (0, P.jsx)("option", {
					value: e.id,
					children: e.label
				}, e.id))
			}),
			/* @__PURE__ */ (0, P.jsx)("select", {
				className: To.select,
				value: d,
				onChange: v,
				title: "Voice",
				children: (() => {
					if (!l.length) return /* @__PURE__ */ (0, P.jsx)("option", { children: "Loading..." });
					if (l.some((e) => e.lang)) {
						let e = {};
						return l.forEach((t) => {
							let n = t.lang || "other";
							(e[n] = e[n] || []).push(t);
						}), Object.keys(e).sort().map((t) => /* @__PURE__ */ (0, P.jsx)("optgroup", {
							label: t,
							children: e[t].map((e) => /* @__PURE__ */ (0, P.jsx)("option", {
								value: e.id,
								children: e.label
							}, e.id))
						}, t));
					}
					return l.map((e) => /* @__PURE__ */ (0, P.jsx)("option", {
						value: e.id,
						children: e.label
					}, e.id));
				})()
			}),
			/* @__PURE__ */ (0, P.jsx)("div", {
				className: To.params,
				children: Object.entries(p).map(([e, t]) => !t || e === "voice" ? null : t.type === "range" ? /* @__PURE__ */ (0, P.jsxs)("label", {
					title: `${t.label}: ${h[e]}`,
					children: [t.label, /* @__PURE__ */ (0, P.jsx)("input", {
						type: "range",
						min: t.min,
						max: t.max,
						step: t.step || .1,
						value: h[e] ?? t.default,
						onChange: (t) => y(e, parseFloat(t.target.value))
					})]
				}, e) : t.type === "select" ? /* @__PURE__ */ (0, P.jsxs)("label", { children: [t.label, /* @__PURE__ */ (0, P.jsx)("select", {
					value: h[e] ?? t.default,
					onChange: (t) => y(e, t.target.value),
					children: t.options.map((e) => /* @__PURE__ */ (0, P.jsx)("option", {
						value: e.value,
						children: e.label
					}, e.value))
				})] }, e) : null)
			})
		]
	}) : null;
}
//#endregion
export { F as GraphViewer, Ur as React, Wr as ReactDOM, bo as ReaderPanel, Eo as TTS };
