// node_modules/@lit/reactive-element/css-tag.js
var e = globalThis, t = e.ShadowRoot && (e.ShadyCSS === void 0 || e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, n = Symbol(), r = /* @__PURE__ */ new WeakMap(), i = class {
	constructor(e, t, r) {
		if (this._$cssResult$ = !0, r !== n) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, n = this.t;
		if (t && e === void 0) {
			let t = n !== void 0 && n.length === 1;
			t && (e = r.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), t && r.set(n, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, a = (e) => new i(typeof e == "string" ? e : e + "", void 0, n), o = (e, ...t) => new i(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, n), s = (n, r) => {
	if (t) n.adoptedStyleSheets = r.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let t of r) {
		let r = document.createElement("style"), i = e.litNonce;
		i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, n.appendChild(r);
	}
}, c = t ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return a(t);
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: ee, getOwnPropertySymbols: te, getPrototypeOf: ne } = Object, f = globalThis, re = f.trustedTypes, ie = re ? re.emptyScript : "", ae = f.reactiveElementPolyfillSupport, p = (e, t) => e, m = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? ie : null;
				break;
			case Object:
			case Array: e = e == null ? e : JSON.stringify(e);
		}
		return e;
	},
	fromAttribute(e, t) {
		let n = e;
		switch (t) {
			case Boolean:
				n = e !== null;
				break;
			case Number:
				n = e === null ? null : Number(e);
				break;
			case Object:
			case Array: try {
				n = JSON.parse(e);
			} catch {
				n = null;
			}
		}
		return n;
	}
}, oe = (e, t) => !l(e, t), se = {
	attribute: !0,
	type: String,
	converter: m,
	reflect: !1,
	useDefault: !1,
	hasChanged: oe
};
Symbol.metadata ??= Symbol("metadata"), f.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var h = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = se) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && u(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = d(this.prototype, e) ?? {
			get() {
				return this[t];
			},
			set(e) {
				this[t] = e;
			}
		};
		return {
			get: r,
			set(t) {
				let a = r?.call(this);
				i?.call(this, t), this.requestUpdate(e, a, n);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(e) {
		return this.elementProperties.get(e) ?? se;
	}
	static _$Ei() {
		if (this.hasOwnProperty(p("elementProperties"))) return;
		let e = ne(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(p("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(p("properties"))) {
			let e = this.properties, t = [...ee(e), ...te(e)];
			for (let n of t) this.createProperty(n, e[n]);
		}
		let e = this[Symbol.metadata];
		if (e !== null) {
			let t = litPropertyMetadata.get(e);
			if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (let [e, t] of this.elementProperties) {
			let n = this._$Eu(e, t);
			n !== void 0 && this._$Eh.set(n, e);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(e) {
		let t = [];
		if (Array.isArray(e)) {
			let n = new Set(e.flat(1 / 0).reverse());
			for (let e of n) t.unshift(c(e));
		} else e !== void 0 && t.push(c(e));
		return t;
	}
	static _$Eu(e, t) {
		let n = t.attribute;
		return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
	}
	addController(e) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
	}
	removeController(e) {
		this._$EO?.delete(e);
	}
	_$E_() {
		let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
		for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
		e.size > 0 && (this._$Ep = e);
	}
	createRenderRoot() {
		let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return s(e, this.constructor.elementStyles), e;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
	}
	enableUpdating(e) {}
	disconnectedCallback() {
		this._$EO?.forEach((e) => e.hostDisconnected?.());
	}
	attributeChangedCallback(e, t, n) {
		this._$AK(e, n);
	}
	_$ET(e, t) {
		let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
		if (r !== void 0 && !0 === n.reflect) {
			let i = (n.converter?.toAttribute === void 0 ? m : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? m : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? oe)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
			this.C(e, t, n);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
		n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (e) {
			Promise.reject(e);
		}
		let e = this.scheduleUpdate();
		return e != null && await e, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (let [e, t] of this._$Ep) this[e] = t;
				this._$Ep = void 0;
			}
			let e = this.constructor.elementProperties;
			if (e.size > 0) for (let [t, n] of e) {
				let { wrapped: e } = n, r = this[t];
				!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
			}
		}
		let e = !1, t = this._$AL;
		try {
			e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
		} catch (t) {
			throw e = !1, this._$EM(), t;
		}
		e && this._$AE(t);
	}
	willUpdate(e) {}
	_$AE(e) {
		this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
	}
	_$EM() {
		this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this._$ES;
	}
	shouldUpdate(e) {
		return !0;
	}
	update(e) {
		this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
	}
	updated(e) {}
	firstUpdated(e) {}
};
h.elementStyles = [], h.shadowRootOptions = { mode: "open" }, h[p("elementProperties")] = /* @__PURE__ */ new Map(), h[p("finalized")] = /* @__PURE__ */ new Map(), ae?.({ ReactiveElement: h }), (f.reactiveElementVersions ??= []).push("2.1.2");
// node_modules/lit-html/lit-html.js
var g = globalThis, ce = (e) => e, _ = g.trustedTypes, v = _ ? _.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, y = "$lit$", b = `lit$${Math.random().toFixed(9).slice(2)}$`, le = "?" + b, ue = `<${le}>`, x = document, S = () => x.createComment(""), C = (e) => e === null || typeof e != "object" && typeof e != "function", w = Array.isArray, de = (e) => w(e) || typeof e?.[Symbol.iterator] == "function", T = "[ 	\n\f\r]", E = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, D = /-->/g, fe = />/g, O = RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), k = /'/g, A = /"/g, pe = /^(?:script|style|textarea|title)$/i, j = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), M = Symbol.for("lit-noChange"), N = Symbol.for("lit-nothing"), me = /* @__PURE__ */ new WeakMap(), P = x.createTreeWalker(x, 129);
function he(e, t) {
	if (!w(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return v === void 0 ? t : v.createHTML(t);
}
var ge = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = E;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === E ? c[1] === "!--" ? o = D : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = O) : (pe.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = O) : o = fe : o === O ? c[0] === ">" ? (o = i ?? E, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? O : c[3] === "\"" ? A : k) : o === A || o === k ? o = O : o === D || o === fe ? o = E : (o = O, i = void 0);
		let d = o === O && e[t + 1].startsWith("/>") ? " " : "";
		a += o === E ? n + ue : l >= 0 ? (r.push(s), n.slice(0, l) + y + n.slice(l) + b + d) : n + b + (l === -2 ? t : d);
	}
	return [he(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, F = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = ge(t, n);
		if (this.el = e.createElement(l, r), P.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = P.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(y)) {
					let t = u[o++], n = i.getAttribute(e).split(b), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? ve : r[1] === "?" ? ye : r[1] === "@" ? be : R
					}), i.removeAttribute(e);
				} else e.startsWith(b) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (pe.test(i.tagName)) {
					let e = i.textContent.split(b), t = e.length - 1;
					if (t > 0) {
						i.textContent = _ ? _.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], S()), P.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], S());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === le) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(b, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += b.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = x.createElement("template");
		return n.innerHTML = e, n;
	}
};
function I(e, t, n = e, r) {
	if (t === M) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = C(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = I(e, i._$AS(e, t.values), i, r)), t;
}
var _e = class {
	constructor(e, t) {
		this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(e) {
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? x).importNode(t, !0);
		P.currentNode = r;
		let i = P.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new L(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new xe(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = P.nextNode(), a++);
		}
		return P.currentNode = x, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, L = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = N, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
	}
	get parentNode() {
		let e = this._$AA.parentNode, t = this._$AM;
		return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(e, t = this) {
		e = I(this, e, t), C(e) ? e === N || e == null || e === "" ? (this._$AH !== N && this._$AR(), this._$AH = N) : e !== this._$AH && e !== M && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? de(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== N && C(this._$AH) ? this._$AA.nextSibling.data = e : this.T(x.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = F.createElement(he(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new _e(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = me.get(e.strings);
		return t === void 0 && me.set(e.strings, t = new F(e)), t;
	}
	k(t) {
		w(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(S()), this.O(S()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = ce(e).nextSibling;
			ce(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, R = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = N, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = N;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = I(this, e, t, 0), a = !C(e) || e !== this._$AH && e !== M, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = I(this, r[n + o], t, o), s === M && (s = this._$AH[o]), a ||= !C(s) || s !== this._$AH[o], s === N ? e = N : e !== N && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === N ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, ve = class extends R {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === N ? void 0 : e;
	}
}, ye = class extends R {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== N);
	}
}, be = class extends R {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = I(this, e, t, 0) ?? N) === M) return;
		let n = this._$AH, r = e === N && n !== N || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== N && (n === N || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, xe = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		I(this, e);
	}
}, Se = g.litHtmlPolyfillSupport;
Se?.(F, L), (g.litHtmlVersions ??= []).push("3.3.3");
var Ce = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new L(t.insertBefore(S(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, z = globalThis, B = class extends h {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ce(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return M;
	}
};
B._$litElement$ = !0, B.finalized = !0, z.litElementHydrateSupport?.({ LitElement: B });
var we = z.litElementPolyfillSupport;
we?.({ LitElement: B }), (z.litElementVersions ??= []).push("4.2.2");
var Te = {
	back: "Back",
	loading: "Loading…",
	search_placeholder: "Search a recipe or an ingredient",
	clear_search: "Clear search",
	all_categories: "All",
	no_recipes: "No recipes yet",
	no_recipes_hint: "Recipes you create will appear here.",
	no_results: "No recipe matches your search.",
	prep_time: "Prep",
	cook_time: "Cook",
	total_time: "Total",
	servings: "Servings",
	ingredients: "Ingredients",
	steps: "Steps",
	notes: "Notes",
	view_source: "View original recipe",
	updated_by: "Last edited by {name} on {date}",
	updated_on: "Last edited on {date}",
	print: "Print",
	delete: "Delete",
	cancel: "Cancel",
	delete_confirm_title: "Delete this recipe?",
	delete_confirm_text: "“{name}” will be permanently deleted.",
	larger_text: "Larger text",
	keep_awake: "Keep screen on",
	reset_checks: "Uncheck all",
	recipe_not_found: "This recipe does not exist or has been deleted.",
	page_not_found: "Page not found.",
	back_to_list: "Back to recipes",
	error: "Something went wrong: {message}",
	duration_h_min: "{h} h {m} min",
	duration_h: "{h} h",
	duration_min: "{m} min"
}, Ee = {
	en: Te,
	fr: {
		back: "Retour",
		loading: "Chargement…",
		search_placeholder: "Rechercher une recette ou un ingrédient",
		clear_search: "Effacer la recherche",
		all_categories: "Toutes",
		no_recipes: "Aucune recette pour l'instant",
		no_recipes_hint: "Les recettes que vous créerez apparaîtront ici.",
		no_results: "Aucune recette ne correspond à votre recherche.",
		prep_time: "Préparation",
		cook_time: "Cuisson",
		total_time: "Total",
		servings: "Parts",
		ingredients: "Ingrédients",
		steps: "Étapes",
		notes: "Notes",
		view_source: "Voir la recette d'origine",
		updated_by: "Modifiée par {name} le {date}",
		updated_on: "Modifiée le {date}",
		print: "Imprimer",
		delete: "Supprimer",
		cancel: "Annuler",
		delete_confirm_title: "Supprimer cette recette ?",
		delete_confirm_text: "« {name} » sera définitivement supprimée.",
		larger_text: "Texte agrandi",
		keep_awake: "Garder l'écran allumé",
		reset_checks: "Tout décocher",
		recipe_not_found: "Cette recette n'existe pas ou a été supprimée.",
		page_not_found: "Page introuvable.",
		back_to_list: "Retour aux recettes",
		error: "Une erreur est survenue : {message}",
		duration_h_min: "{h} h {m} min",
		duration_h: "{h} h",
		duration_min: "{m} min"
	}
};
function De(e) {
	let t = (e?.locale?.language ?? e?.language ?? "en").split("-")[0];
	return t in Ee ? t : "en";
}
function V(e) {
	let t = Ee[De(e)];
	return (e, n = {}) => Object.entries(n).reduce((e, [t, n]) => e.replaceAll(`{${t}}`, String(n)), t[e] ?? Te[e] ?? e);
}
// src/router.ts
var H = "/cookbook";
function Oe(e) {
	let t = e.split("/").filter(Boolean).map(decodeURIComponent);
	return t.length === 0 ? { name: "list" } : t.length === 2 && t[0] === "recipe" ? {
		name: "recipe",
		id: t[1]
	} : { name: "not-found" };
}
function ke(e) {
	return `${H}/recipe/${encodeURIComponent(e)}`;
}
function U(e, t = {}) {
	t.replace ? history.replaceState(history.state, "", e) : history.pushState(null, "", e), window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: t.replace ?? !1 } }));
}
var Ae = "";
function je(e) {
	Ae = e;
}
function W() {
	return `${H}${Ae}`;
}
// src/styles.ts
var G = o`
  :host {
    color: var(--primary-text-color);
    --cb-radius: var(--ha-card-border-radius, 12px);
    --cb-gap: 16px;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 36px;
    padding: 0 14px;
    border: 1px solid var(--divider-color);
    border-radius: 18px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    font: inherit;
    font-size: 14px;
    cursor: pointer;
  }
  .btn:hover {
    background: var(--secondary-background-color);
  }
  .btn.primary {
    border-color: var(--primary-color);
    background: var(--primary-color);
    color: var(--text-primary-color);
  }
  .btn.danger {
    border-color: var(--error-color);
    color: var(--error-color);
  }
  .btn.danger.primary {
    background: var(--error-color);
    color: var(--text-primary-color);
  }
  .btn ha-icon {
    --mdc-icon-size: 18px;
  }
  .btn[aria-pressed="true"] {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }
  .chip {
    display: inline-flex;
    align-items: center;
    padding: 2px 10px;
    border-radius: 12px;
    background: var(--secondary-background-color);
    color: var(--secondary-text-color);
    font-size: 12px;
  }
  .card {
    border-radius: var(--cb-radius);
    background: var(--card-background-color);
    box-shadow: var(--ha-card-box-shadow, none);
    border: 1px solid var(--ha-card-border-color, var(--divider-color));
  }
  .muted {
    color: var(--secondary-text-color);
  }
  .message {
    margin: 48px auto;
    max-width: 480px;
    text-align: center;
    color: var(--secondary-text-color);
  }
  .error {
    color: var(--error-color);
  }
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }
`;
// src/api.ts
function K(e) {
	return typeof e == "object" && !!e && "code" in e;
}
var q = class {
	constructor(e) {
		this.hass = e;
	}
	async list(e) {
		return (await this.hass.callWS({
			type: "cookbook/list",
			...e ? { category: e } : {}
		})).recipes;
	}
	async search(e, t) {
		return (await this.hass.callWS({
			type: "cookbook/search",
			query: e,
			...t ? { category: t } : {}
		})).recipes;
	}
	async categories() {
		return (await this.hass.callWS({ type: "cookbook/categories" })).categories;
	}
	get(e) {
		return this.hass.callWS({
			type: "cookbook/get",
			recipe_id: e
		});
	}
	async delete(e) {
		await this.hass.callWS({
			type: "cookbook/delete",
			recipe_id: e
		});
	}
};
// src/format.ts
function J(e, t) {
	if (e == null) return "";
	let n = Math.floor(e / 60), r = e % 60;
	return n && r ? t("duration_h_min", {
		h: n,
		m: r
	}) : n ? t("duration_h", { h: n }) : t("duration_min", { m: r });
}
function Y(e) {
	return e.total_time == null ? e.prep_time == null && e.cook_time == null ? null : (e.prep_time ?? 0) + (e.cook_time ?? 0) : e.total_time;
}
function Me(e, t) {
	return new Intl.DateTimeFormat(t, { dateStyle: "long" }).format(new Date(e));
}
function Ne(e) {
	let t = [];
	for (let n of e) {
		let e = t.at(-1);
		e && e.section === n.section ? e.items.push(n) : t.push({
			section: n.section,
			items: [n]
		});
	}
	return t;
}
var Pe = class extends B {
	constructor(...e) {
		super(...e), this.recipes = [], this.categories = [], this.query = "", this.category = null, this.loading = !0, this.error = null, this.requestId = 0;
	}
	static {
		this.properties = {
			hass: { attribute: !1 },
			recipes: { state: !0 },
			categories: { state: !0 },
			query: { state: !0 },
			category: { state: !0 },
			loading: { state: !0 },
			error: { state: !0 }
		};
	}
	connectedCallback() {
		super.connectedCallback();
		let e = new URLSearchParams(location.search);
		this.query = e.get("q") ?? "", this.category = e.get("category"), this.loadCategories(), this.loadRecipes();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), clearTimeout(this.debounce);
	}
	get api() {
		return new q(this.hass);
	}
	async loadCategories() {
		try {
			this.categories = await this.api.categories();
		} catch (e) {
			this.showError(e);
		}
	}
	async loadRecipes() {
		let e = ++this.requestId, t = this.query.trim(), n = this.category ?? void 0;
		this.loading = !0;
		try {
			let r = t ? await this.api.search(t, n) : await this.api.list(n);
			if (e !== this.requestId) return;
			this.recipes = r, this.error = null;
		} catch (t) {
			e === this.requestId && this.showError(t);
		} finally {
			e === this.requestId && (this.loading = !1);
		}
	}
	showError(e) {
		let t = K(e) ? e.message : String(e);
		this.error = V(this.hass)("error", { message: t });
	}
	syncUrl() {
		let e = new URLSearchParams();
		this.query.trim() && e.set("q", this.query.trim()), this.category && e.set("category", this.category);
		let t = e.size ? `?${e}` : "";
		je(t), history.replaceState(history.state, "", `${location.pathname}${t}`);
	}
	onInput(e) {
		this.query = e.target.value, clearTimeout(this.debounce), this.debounce = setTimeout(() => {
			this.syncUrl(), this.loadRecipes();
		}, 250);
	}
	clearSearch() {
		this.query = "", clearTimeout(this.debounce), this.syncUrl(), this.loadRecipes();
	}
	selectCategory(e) {
		this.category = e === this.category ? null : e, this.syncUrl(), this.loadRecipes();
	}
	open(e, t) {
		e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0 || (e.preventDefault(), U(ke(t)));
	}
	render() {
		let e = V(this.hass);
		return j`
      <div class="search">
        <ha-icon icon="mdi:magnify"></ha-icon>
        <input
          type="search"
          .value=${this.query}
          placeholder=${e("search_placeholder")}
          aria-label=${e("search_placeholder")}
          @input=${this.onInput}
        />
        ${this.query ? j`<button class="clear" aria-label=${e("clear_search")} @click=${this.clearSearch}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>` : N}
      </div>
      ${this.categories.length ? j`<div class="filters" role="group">
            <button
              class="btn"
              aria-pressed=${String(this.category === null)}
              @click=${() => this.selectCategory(null)}
            >
              ${e("all_categories")}
            </button>
            ${this.categories.map((e) => j`<button
                class="btn"
                data-category=${e.name}
                aria-pressed=${String(this.category?.toLowerCase() === e.name.toLowerCase())}
                @click=${() => this.selectCategory(e.name)}
              >
                ${e.name} <span class="muted">${e.count}</span>
              </button>`)}
          </div>` : N}
      ${this.error ? j`<p class="message error">${this.error}</p>` : this.renderRecipes(e)}
    `;
	}
	renderRecipes(e) {
		return this.loading && !this.recipes.length ? j`<p class="message">${e("loading")}</p>` : this.recipes.length ? j`<div class="grid">
      ${this.recipes.map((t) => {
			let n = Y(t);
			return j`<a
          class="card recipe"
          href=${ke(t.id)}
          @click=${(e) => this.open(e, t.id)}
        >
          <div class="picture"><ha-icon icon="mdi:silverware-fork-knife"></ha-icon></div>
          <div class="body">
            <h3>${t.name}</h3>
            ${n == null ? N : j`<div class="muted time">
                  <ha-icon icon="mdi:clock-outline"></ha-icon>${J(n, e)}
                </div>`}
            <div class="chips">${t.categories.map((e) => j`<span class="chip">${e}</span>`)}</div>
          </div>
        </a>`;
		})}
    </div>` : this.query.trim() || this.category ? j`<p class="message">${e("no_results")}</p>` : j`<div class="message">
            <ha-icon class="big" icon="mdi:chef-hat"></ha-icon>
            <h2>${e("no_recipes")}</h2>
            <p>${e("no_recipes_hint")}</p>
          </div>`;
	}
	static {
		this.styles = [G, o`
      :host {
        display: block;
        padding: var(--cb-gap);
        max-width: 1200px;
        margin: 0 auto;
        box-sizing: border-box;
      }
      .search {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0 12px;
        border-radius: 24px;
        background: var(--card-background-color);
        border: 1px solid var(--divider-color);
        color: var(--secondary-text-color);
      }
      .search input {
        flex: 1;
        min-width: 0;
        height: 44px;
        border: 0;
        outline: 0;
        background: transparent;
        color: var(--primary-text-color);
        font: inherit;
        font-size: 16px;
      }
      .search input::-webkit-search-cancel-button {
        display: none;
      }
      .clear {
        border: 0;
        background: none;
        color: inherit;
        cursor: pointer;
        padding: 4px;
      }
      .filters {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        padding: 12px 0 4px;
        scrollbar-width: none;
      }
      .filters .btn {
        flex: none;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: var(--cb-gap);
        margin-top: var(--cb-gap);
      }
      .recipe {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        color: inherit;
        text-decoration: none;
      }
      .recipe:hover {
        border-color: var(--primary-color);
      }
      .picture {
        display: flex;
        align-items: center;
        justify-content: center;
        aspect-ratio: 16 / 9;
        background: var(--secondary-background-color);
        color: var(--disabled-text-color, var(--secondary-text-color));
        --mdc-icon-size: 40px;
      }
      .body {
        padding: 12px;
      }
      h3 {
        margin: 0 0 6px;
        font-size: 16px;
        font-weight: 500;
      }
      .time {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        --mdc-icon-size: 16px;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-top: 8px;
      }
      .big {
        --mdc-icon-size: 64px;
        color: var(--primary-color);
      }
    `];
	}
};
customElements.get("cookbook-recipe-list") || customElements.define("cookbook-recipe-list", Pe);
// src/components/confirm-dialog.ts
var Fe = class extends B {
	constructor(...e) {
		super(...e), this.open = !1, this.heading = "", this.text = "", this.confirmLabel = "OK", this.cancelLabel = "Cancel", this.onKeydown = (e) => {
			this.open && e.key === "Escape" && this.fire("cancel");
		};
	}
	static {
		this.properties = {
			open: {
				type: Boolean,
				reflect: !0
			},
			heading: {},
			text: {},
			confirmLabel: { attribute: "confirm-label" },
			cancelLabel: { attribute: "cancel-label" }
		};
	}
	connectedCallback() {
		super.connectedCallback(), window.addEventListener("keydown", this.onKeydown);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), window.removeEventListener("keydown", this.onKeydown);
	}
	updated(e) {
		e.has("open") && this.open && this.renderRoot.querySelector(".cancel")?.focus();
	}
	fire(e) {
		this.dispatchEvent(new CustomEvent(e, {
			bubbles: !0,
			composed: !0
		}));
	}
	render() {
		return this.open ? j`
      <div class="backdrop" @click=${() => this.fire("cancel")}></div>
      <div class="dialog card" role="alertdialog" aria-modal="true" aria-labelledby="heading">
        <h2 id="heading">${this.heading}</h2>
        <p>${this.text}</p>
        <div class="actions">
          <button class="btn cancel" @click=${() => this.fire("cancel")}>${this.cancelLabel}</button>
          <button class="btn danger primary confirm" @click=${() => this.fire("confirm")}>
            ${this.confirmLabel}
          </button>
        </div>
      </div>
    ` : j``;
	}
	static {
		this.styles = [G, o`
      .backdrop {
        position: fixed;
        inset: 0;
        z-index: 10;
        background: rgba(0, 0, 0, 0.5);
      }
      .dialog {
        position: fixed;
        z-index: 11;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: min(420px, calc(100vw - 32px));
        padding: 24px;
      }
      h2 {
        margin: 0 0 8px;
        font-size: 20px;
        font-weight: 500;
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 24px;
      }
    `];
	}
};
customElements.get("cookbook-confirm-dialog") || customElements.define("cookbook-confirm-dialog", Fe);
// src/print.ts
var X = (e) => e.replace(/[&<>"']/g, (e) => `&#${e.charCodeAt(0)};`);
function Ie(e, t) {
	return Ne(e).map((e) => `${e.section ? `<h3>${X(e.section)}</h3>` : ""}<${t}>${e.items.map((e) => `<li>${X(e.text)}</li>`).join("")}</${t}>`).join("");
}
function Le(e, t, n) {
	let r = [
		["prep_time", J(e.prep_time, t)],
		["cook_time", J(e.cook_time, t)],
		["total_time", J(Y(e), t)],
		["servings", e.servings ?? ""]
	].filter(([, e]) => e).map(([e, n]) => `<span><strong>${X(t(e))}</strong> ${X(n)}</span>`).join(""), i = (e, t) => t ? `<section><h2>${X(e)}</h2>${t}</section>` : "", a = (e) => e ? `<p class="text">${X(e)}</p>` : "";
	return `<!doctype html>
<html lang="${X(n)}">
<head>
<meta charset="utf-8">
<title>${X(e.name)}</title>
<style>
  @page { margin: 15mm; }
  body { font-family: Georgia, "Times New Roman", serif; font-size: 11pt; line-height: 1.45; color: #000; }
  h1 { font-size: 22pt; margin: 0 0 4pt; }
  h2 { font-size: 14pt; margin: 14pt 0 6pt; border-bottom: 1px solid #999; }
  h3 { font-size: 11pt; margin: 8pt 0 4pt; font-style: italic; }
  .meta { display: flex; flex-wrap: wrap; gap: 4pt 16pt; margin: 6pt 0; }
  .categories { color: #555; }
  .text { white-space: pre-line; }
  ol li { margin-bottom: 5pt; }
  section, li { break-inside: avoid; }
  h2, h3 { break-after: avoid; }
  .source { font-size: 9pt; color: #555; word-break: break-all; }
</style>
</head>
<body>
<h1>${X(e.name)}</h1>
${e.categories.length ? `<div class="categories">${X(e.categories.join(" · "))}</div>` : ""}
${r ? `<div class="meta">${r}</div>` : ""}
${a(e.description)}
${i(t("ingredients"), e.ingredients.length ? Ie(e.ingredients, "ul") : "")}
${i(t("steps"), e.steps.length ? Ie(e.steps, "ol") : "")}
${i(t("notes"), a(e.notes))}
${e.source_url ? `<p class="source">${X(e.source_url)}</p>` : ""}
</body>
</html>`;
}
function Re(e, t, n) {
	let r = document.createElement("iframe");
	r.style.cssText = "position:fixed;width:0;height:0;border:0;visibility:hidden", r.srcdoc = Le(e, t, n), r.addEventListener("load", () => {
		let e = r.contentWindow;
		e && (e.addEventListener("afterprint", () => r.remove()), setTimeout(() => r.remove(), 6e4), e.focus(), e.print());
	}), document.body.append(r);
}
// src/views/recipe-view.ts
var ze = "cookbook:large-text", Z = (e) => `cookbook:checks:${e}`;
function Q(e) {
	try {
		return localStorage.getItem(e);
	} catch {
		return null;
	}
}
function $(e, t) {
	try {
		t === null ? localStorage.removeItem(e) : localStorage.setItem(e, t);
	} catch {}
}
var Be = class e extends B {
	constructor(...e) {
		super(...e), this.recipeId = "", this.recipe = null, this.error = null, this.notFound = !1, this.checked = /* @__PURE__ */ new Set(), this.largeText = Q(ze) === "1", this.awake = !1, this.confirmDelete = !1, this.wakeLock = null, this.onVisibilityChange = () => {
			this.awake && document.visibilityState === "visible" && this.requestWakeLock();
		};
	}
	static {
		this.properties = {
			hass: { attribute: !1 },
			recipeId: { attribute: "recipe-id" },
			recipe: { state: !0 },
			error: { state: !0 },
			notFound: { state: !0 },
			checked: { state: !0 },
			largeText: {
				type: Boolean,
				reflect: !0,
				attribute: "large-text"
			},
			awake: { state: !0 },
			confirmDelete: { state: !0 }
		};
	}
	connectedCallback() {
		super.connectedCallback(), document.addEventListener("visibilitychange", this.onVisibilityChange);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), document.removeEventListener("visibilitychange", this.onVisibilityChange), this.releaseWakeLock();
	}
	willUpdate(e) {
		e.has("recipeId") && this.recipeId && this.load();
	}
	async load() {
		let e = this.recipeId;
		this.recipe = null, this.error = null, this.notFound = !1, this.checked = new Set(JSON.parse(Q(Z(e)) ?? "[]"));
		try {
			let t = await new q(this.hass).get(e);
			e === this.recipeId && (this.recipe = t);
		} catch (t) {
			if (e !== this.recipeId) return;
			if (K(t) && t.code === "not_found") this.notFound = !0;
			else {
				let e = K(t) ? t.message : String(t);
				this.error = V(this.hass)("error", { message: e });
			}
		}
	}
	toggleCheck(e) {
		let t = new Set(this.checked);
		t.has(e) ? t.delete(e) : t.add(e), this.checked = t, $(Z(this.recipeId), t.size ? JSON.stringify([...t]) : null);
	}
	resetChecks() {
		this.checked = /* @__PURE__ */ new Set(), $(Z(this.recipeId), null);
	}
	toggleLargeText() {
		this.largeText = !this.largeText, $(ze, this.largeText ? "1" : null);
	}
	static get wakeLockSupported() {
		return window.isSecureContext && "wakeLock" in navigator;
	}
	async requestWakeLock() {
		try {
			this.wakeLock = await navigator.wakeLock.request("screen");
		} catch {
			this.awake = !1;
		}
	}
	async releaseWakeLock() {
		let e = this.wakeLock;
		this.wakeLock = null, await e?.release().catch(() => void 0);
	}
	async toggleAwake() {
		this.awake = !this.awake, this.awake ? await this.requestWakeLock() : await this.releaseWakeLock();
	}
	async deleteRecipe() {
		this.confirmDelete = !1;
		try {
			await new q(this.hass).delete(this.recipeId), $(Z(this.recipeId), null), U(W(), { replace: !0 });
		} catch (e) {
			let t = K(e) ? e.message : String(e);
			this.error = V(this.hass)("error", { message: t });
		}
	}
	render() {
		let e = V(this.hass);
		return this.notFound ? j`<div class="message">
        <p>${e("recipe_not_found")}</p>
        <button class="btn" @click=${() => U(W())}>${e("back_to_list")}</button>
      </div>` : this.error ? j`<p class="message error">${this.error}</p>` : this.recipe ? this.renderRecipe(this.recipe, e) : j`<p class="message">${e("loading")}</p>`;
	}
	renderRecipe(t, n) {
		let r = De(this.hass), i = [
			{
				key: "prep_time",
				icon: "mdi:knife",
				value: J(t.prep_time, n)
			},
			{
				key: "cook_time",
				icon: "mdi:pot-steam-outline",
				value: J(t.cook_time, n)
			},
			{
				key: "total_time",
				icon: "mdi:clock-outline",
				value: J(Y(t), n)
			},
			{
				key: "servings",
				icon: "mdi:account-group-outline",
				value: t.servings ?? ""
			}
		], a = Me(t.updated_at, r);
		return j`
      <div class="actions">
        <button class="btn" aria-pressed=${String(this.largeText)} @click=${this.toggleLargeText}>
          <ha-icon icon="mdi:format-size"></ha-icon>${n("larger_text")}
        </button>
        ${e.wakeLockSupported ? j`<button class="btn awake" aria-pressed=${String(this.awake)} @click=${this.toggleAwake}>
              <ha-icon icon="mdi:cellphone-screenshot"></ha-icon>${n("keep_awake")}
            </button>` : N}
        ${this.checked.size ? j`<button class="btn reset" @click=${this.resetChecks}>
              <ha-icon icon="mdi:checkbox-blank-off-outline"></ha-icon>${n("reset_checks")}
            </button>` : N}
        <span class="spacer"></span>
        <button class="btn print" @click=${() => Re(t, n, r)}>
          <ha-icon icon="mdi:printer"></ha-icon>${n("print")}
        </button>
        ${this.hass.user?.is_admin ? j`<button class="btn danger delete" @click=${() => this.confirmDelete = !0}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>${n("delete")}
            </button>` : N}
      </div>

      <article class="card">
        <h1>${t.name}</h1>
        ${t.categories.length ? j`<div class="chips">${t.categories.map((e) => j`<span class="chip">${e}</span>`)}</div>` : N}
        <div class="meta">
          ${i.filter((e) => e.value).map((e) => j`<div class="meta-item">
                <ha-icon icon=${e.icon}></ha-icon>
                <div><div class="muted label">${n(e.key)}</div><div>${e.value}</div></div>
              </div>`)}
        </div>
        ${t.description ? j`<p class="text description">${t.description}</p>` : N}

        <div class="columns">
          ${t.ingredients.length ? j`<section class="ingredients">
                <h2>${n("ingredients")}</h2>
                ${this.renderItems(t.ingredients, "i")}
              </section>` : N}
          ${t.steps.length ? j`<section class="steps">
                <h2>${n("steps")}</h2>
                ${this.renderItems(t.steps, "s")}
              </section>` : N}
        </div>

        ${t.notes ? j`<section class="notes"><h2>${n("notes")}</h2><p class="text">${t.notes}</p></section>` : N}

        <footer class="muted">
          ${t.source_url ? j`<a href=${t.source_url} target="_blank" rel="noopener noreferrer">
                <ha-icon icon="mdi:open-in-new"></ha-icon>${n("view_source")}
              </a>` : N}
          <span class="updated">
            ${t.updated_by_name ? n("updated_by", {
			name: t.updated_by_name,
			date: a
		}) : n("updated_on", { date: a })}
          </span>
        </footer>
      </article>

      <cookbook-confirm-dialog
        .open=${this.confirmDelete}
        .heading=${n("delete_confirm_title")}
        .text=${n("delete_confirm_text", { name: t.name })}
        .confirmLabel=${n("delete")}
        .cancelLabel=${n("cancel")}
        @confirm=${this.deleteRecipe}
        @cancel=${() => this.confirmDelete = !1}
      ></cookbook-confirm-dialog>
    `;
	}
	renderItems(e, t) {
		let n = 0;
		return Ne(e).map((e) => j`
        ${e.section ? j`<h3>${e.section}</h3>` : N}
        <ul class=${t === "s" ? "numbered" : ""}>
          ${e.items.map((e) => {
			let r = `${t}${n++}`, i = this.checked.has(r);
			return j`<li>
              <label class=${i ? "done" : ""}>
                <input type="checkbox" .checked=${i} @change=${() => this.toggleCheck(r)} />
                ${t === "s" ? j`<span class="number">${n}</span>` : N}
                <span class="item-text">${e.text}</span>
              </label>
            </li>`;
		})}
        </ul>
      `);
	}
	static {
		this.styles = [G, o`
      :host {
        display: block;
        padding: var(--cb-gap);
        max-width: 1000px;
        margin: 0 auto;
        box-sizing: border-box;
        --cb-text-size: 16px;
      }
      :host([large-text]) {
        --cb-text-size: 21px;
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: var(--cb-gap);
      }
      .spacer {
        flex: 1;
      }
      article {
        padding: 24px;
        font-size: var(--cb-text-size);
        line-height: 1.5;
      }
      h1 {
        margin: 0 0 8px;
        font-size: 1.75em;
        font-weight: 500;
        line-height: 1.2;
      }
      h2 {
        margin: 24px 0 8px;
        font-size: 1.2em;
        font-weight: 500;
      }
      h3 {
        margin: 12px 0 4px;
        font-size: 1em;
        font-weight: 500;
        color: var(--secondary-text-color);
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
      }
      .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 12px 32px;
        margin: 16px 0;
      }
      .meta-item {
        display: flex;
        align-items: center;
        gap: 8px;
        --mdc-icon-size: 22px;
      }
      .meta-item ha-icon {
        color: var(--primary-color);
      }
      .label {
        font-size: 0.75em;
      }
      .text {
        white-space: pre-line;
      }
      .columns {
        display: grid;
        grid-template-columns: minmax(220px, 1fr) 2fr;
        gap: 0 32px;
      }
      @media (max-width: 700px) {
        .columns {
          grid-template-columns: 1fr;
        }
        article {
          padding: 16px;
        }
      }
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      li {
        margin: 2px 0;
      }
      label {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 6px 4px;
        border-radius: 8px;
        cursor: pointer;
      }
      label:hover {
        background: var(--secondary-background-color);
      }
      input[type="checkbox"] {
        flex: none;
        width: 1.1em;
        height: 1.1em;
        margin-top: 0.2em;
        accent-color: var(--primary-color);
      }
      .number {
        flex: none;
        min-width: 1.6em;
        font-weight: 500;
        color: var(--primary-color);
      }
      .done .item-text,
      .done .number {
        color: var(--secondary-text-color);
        text-decoration: line-through;
      }
      footer {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 8px;
        margin-top: 24px;
        padding-top: 12px;
        border-top: 1px solid var(--divider-color);
        font-size: 14px;
      }
      footer a {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        color: var(--primary-color);
        --mdc-icon-size: 16px;
      }
    `];
	}
};
customElements.get("cookbook-recipe-view") || customElements.define("cookbook-recipe-view", Be);
// src/cookbook-panel.ts
var Ve = class extends B {
	constructor(...e) {
		super(...e), this.narrow = !1;
	}
	static {
		this.properties = {
			hass: { attribute: !1 },
			narrow: { type: Boolean },
			route: { attribute: !1 }
		};
	}
	render() {
		if (!this.hass) return N;
		let e = V(this.hass), t = Oe(this.route?.path ?? "");
		return j`
      <header class="toolbar">
        ${this.narrow ? j`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : N}
        ${t.name === "list" ? N : j`<button class="icon-btn back" aria-label=${e("back")} @click=${() => U(W())}>
              <ha-icon icon="mdi:arrow-left"></ha-icon>
            </button>`}
        <div class="title">Cookbook</div>
      </header>
      <main>
        ${t.name === "list" ? j`<cookbook-recipe-list .hass=${this.hass}></cookbook-recipe-list>` : t.name === "recipe" ? j`<cookbook-recipe-view .hass=${this.hass} .recipeId=${t.id}></cookbook-recipe-view>` : j`<div class="message">
                <p>${e("page_not_found")}</p>
                <button class="btn" @click=${() => U(H)}>${e("back_to_list")}</button>
              </div>`}
      </main>
    `;
	}
	static {
		this.styles = [G, o`
      :host {
        display: block;
        min-height: 100vh;
        background: var(--primary-background-color);
        font-family: var(--ha-font-family-body, var(--paper-font-body1_-_font-family, Roboto, sans-serif));
      }
      .toolbar {
        position: sticky;
        top: 0;
        z-index: 2;
        display: flex;
        align-items: center;
        gap: 4px;
        height: var(--header-height, 56px);
        padding: 0 12px;
        box-sizing: border-box;
        background: var(--app-header-background-color, var(--primary-color));
        color: var(--app-header-text-color, var(--text-primary-color));
        border-bottom: var(--app-header-border-bottom, none);
      }
      .title {
        margin-left: 8px;
        font-size: 20px;
      }
      .icon-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border: 0;
        border-radius: 50%;
        background: none;
        color: inherit;
        cursor: pointer;
      }
      .icon-btn:hover {
        background: rgba(127, 127, 127, 0.15);
      }
    `];
	}
};
customElements.get("cookbook-panel") || customElements.define("cookbook-panel", Ve);
