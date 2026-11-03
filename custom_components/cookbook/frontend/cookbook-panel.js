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
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: f, getOwnPropertySymbols: p, getPrototypeOf: m } = Object, h = globalThis, g = h.trustedTypes, _ = g ? g.emptyScript : "", ee = h.reactiveElementPolyfillSupport, v = (e, t) => e, te = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? _ : null;
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
}, y = (e, t) => !l(e, t), ne = {
	attribute: !0,
	type: String,
	converter: te,
	reflect: !1,
	useDefault: !1,
	hasChanged: y
};
Symbol.metadata ??= Symbol("metadata"), h.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var re = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = ne) {
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
		return this.elementProperties.get(e) ?? ne;
	}
	static _$Ei() {
		if (this.hasOwnProperty(v("elementProperties"))) return;
		let e = m(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(v("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(v("properties"))) {
			let e = this.properties, t = [...f(e), ...p(e)];
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
			let i = (n.converter?.toAttribute === void 0 ? te : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? te : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? y)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
re.elementStyles = [], re.shadowRootOptions = { mode: "open" }, re[v("elementProperties")] = /* @__PURE__ */ new Map(), re[v("finalized")] = /* @__PURE__ */ new Map(), ee?.({ ReactiveElement: re }), (h.reactiveElementVersions ??= []).push("2.1.2");
// node_modules/lit-html/lit-html.js
var ie = globalThis, ae = (e) => e, b = ie.trustedTypes, oe = b ? b.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, x = "$lit$", S = `lit$${Math.random().toFixed(9).slice(2)}$`, se = "?" + S, ce = `<${se}>`, C = document, le = () => C.createComment(""), ue = (e) => e === null || typeof e != "object" && typeof e != "function", de = Array.isArray, fe = (e) => de(e) || typeof e?.[Symbol.iterator] == "function", pe = "[ 	\n\f\r]", me = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, he = /-->/g, ge = />/g, _e = RegExp(`>|${pe}(?:([^\\s"'>=/]+)(${pe}*=${pe}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), ve = /'/g, ye = /"/g, be = /^(?:script|style|textarea|title)$/i, w = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), xe = Symbol.for("lit-noChange"), T = Symbol.for("lit-nothing"), Se = /* @__PURE__ */ new WeakMap(), Ce = C.createTreeWalker(C, 129);
function we(e, t) {
	if (!de(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return oe === void 0 ? t : oe.createHTML(t);
}
var Te = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = me;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === me ? c[1] === "!--" ? o = he : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = _e) : (be.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = _e) : o = ge : o === _e ? c[0] === ">" ? (o = i ?? me, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? _e : c[3] === "\"" ? ye : ve) : o === ye || o === ve ? o = _e : o === he || o === ge ? o = me : (o = _e, i = void 0);
		let d = o === _e && e[t + 1].startsWith("/>") ? " " : "";
		a += o === me ? n + ce : l >= 0 ? (r.push(s), n.slice(0, l) + x + n.slice(l) + S + d) : n + S + (l === -2 ? t : d);
	}
	return [we(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, Ee = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Te(t, n);
		if (this.el = e.createElement(l, r), Ce.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = Ce.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(x)) {
					let t = u[o++], n = i.getAttribute(e).split(S), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? je : r[1] === "?" ? Me : r[1] === "@" ? Ne : Ae
					}), i.removeAttribute(e);
				} else e.startsWith(S) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (be.test(i.tagName)) {
					let e = i.textContent.split(S), t = e.length - 1;
					if (t > 0) {
						i.textContent = b ? b.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], le()), Ce.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], le());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === se) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(S, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += S.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = C.createElement("template");
		return n.innerHTML = e, n;
	}
};
function De(e, t, n = e, r) {
	if (t === xe) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = ue(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = De(e, i._$AS(e, t.values), i, r)), t;
}
var Oe = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? C).importNode(t, !0);
		Ce.currentNode = r;
		let i = Ce.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new ke(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Pe(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = Ce.nextNode(), a++);
		}
		return Ce.currentNode = C, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, ke = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = T, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = De(this, e, t), ue(e) ? e === T || e == null || e === "" ? (this._$AH !== T && this._$AR(), this._$AH = T) : e !== this._$AH && e !== xe && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? fe(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== T && ue(this._$AH) ? this._$AA.nextSibling.data = e : this.T(C.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Ee.createElement(we(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Oe(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = Se.get(e.strings);
		return t === void 0 && Se.set(e.strings, t = new Ee(e)), t;
	}
	k(t) {
		de(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(le()), this.O(le()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = ae(e).nextSibling;
			ae(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, Ae = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = T, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = T;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = De(this, e, t, 0), a = !ue(e) || e !== this._$AH && e !== xe, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = De(this, r[n + o], t, o), s === xe && (s = this._$AH[o]), a ||= !ue(s) || s !== this._$AH[o], s === T ? e = T : e !== T && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === T ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, je = class extends Ae {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === T ? void 0 : e;
	}
}, Me = class extends Ae {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== T);
	}
}, Ne = class extends Ae {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = De(this, e, t, 0) ?? T) === xe) return;
		let n = this._$AH, r = e === T && n !== T || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== T && (n === T || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Pe = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		De(this, e);
	}
}, Fe = {
	M: x,
	P: S,
	A: se,
	C: 1,
	L: Te,
	R: Oe,
	D: fe,
	V: De,
	I: ke,
	H: Ae,
	N: Me,
	U: Ne,
	B: je,
	F: Pe
}, Ie = ie.litHtmlPolyfillSupport;
Ie?.(Ee, ke), (ie.litHtmlVersions ??= []).push("3.3.3");
var Le = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new ke(t.insertBefore(le(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, Re = globalThis, E = class extends re {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Le(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return xe;
	}
};
E._$litElement$ = !0, E.finalized = !0, Re.litElementHydrateSupport?.({ LitElement: E });
var ze = Re.litElementPolyfillSupport;
ze?.({ LitElement: E }), (Re.litElementVersions ??= []).push("4.2.2");
var Be = {
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
	duration_min: "{m} min",
	new_recipe: "New recipe",
	edit: "Edit",
	edit_recipe: "Edit recipe",
	save: "Save",
	saving: "Saving…",
	name: "Name",
	name_required: "The name is required.",
	description: "Description",
	categories: "Categories",
	category_placeholder: "Add a category",
	remove_category: "Remove {name}",
	times: "Times (minutes)",
	total_auto: "auto: {value}",
	servings_placeholder: "e.g. 4 people",
	ingredient_placeholder: "e.g. 200 g flour",
	step_placeholder: "Describe the step",
	section_placeholder: "Section name (e.g. Dough)",
	add_ingredient: "Add an ingredient",
	add_step: "Add a step",
	add_section: "Add a section",
	move_up: "Move up",
	move_down: "Move down",
	remove_line: "Remove line",
	drag: "Drag to reorder",
	editor_hint: "Enter adds a line; you can paste several lines at once.",
	source_url: "Source URL",
	source_url_invalid: "The URL must start with http:// or https://",
	minutes_invalid: "Enter a whole number of minutes.",
	conflict_text: "{name} modified this recipe in the meantime.",
	conflict_text_anonymous: "This recipe was modified in the meantime.",
	conflict_reload: "Load the saved version",
	conflict_overwrite: "Overwrite with my changes",
	leave_title: "Leave without saving?",
	leave_text: "Your changes will be lost.",
	leave_confirm: "Leave"
}, Ve = {
	en: Be,
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
		duration_min: "{m} min",
		new_recipe: "Nouvelle recette",
		edit: "Modifier",
		edit_recipe: "Modifier la recette",
		save: "Enregistrer",
		saving: "Enregistrement…",
		name: "Nom",
		name_required: "Le nom est obligatoire.",
		description: "Description",
		categories: "Catégories",
		category_placeholder: "Ajouter une catégorie",
		remove_category: "Retirer {name}",
		times: "Temps (minutes)",
		total_auto: "auto : {value}",
		servings_placeholder: "ex. 4 personnes",
		ingredient_placeholder: "ex. 200 g de farine",
		step_placeholder: "Décrivez l'étape",
		section_placeholder: "Nom de la section (ex. Pâte)",
		add_ingredient: "Ajouter un ingrédient",
		add_step: "Ajouter une étape",
		add_section: "Ajouter une section",
		move_up: "Monter",
		move_down: "Descendre",
		remove_line: "Supprimer la ligne",
		drag: "Glisser pour déplacer",
		editor_hint: "Entrée ajoute une ligne ; vous pouvez coller plusieurs lignes d'un coup.",
		source_url: "URL source",
		source_url_invalid: "L'URL doit commencer par http:// ou https://",
		minutes_invalid: "Indiquez un nombre entier de minutes.",
		conflict_text: "{name} a modifié cette recette entre-temps.",
		conflict_text_anonymous: "Cette recette a été modifiée entre-temps.",
		conflict_reload: "Charger la version enregistrée",
		conflict_overwrite: "Écraser avec mes modifications",
		leave_title: "Quitter sans enregistrer ?",
		leave_text: "Vos modifications seront perdues.",
		leave_confirm: "Quitter"
	}
};
function He(e) {
	let t = (e?.locale?.language ?? e?.language ?? "en").split("-")[0];
	return t in Ve ? t : "en";
}
function Ue(e) {
	let t = Ve[He(e)];
	return (e, n = {}) => Object.entries(n).reduce((e, [t, n]) => e.replaceAll(`{${t}}`, String(n)), t[e] ?? Be[e] ?? e);
}
// src/router.ts
var We = "/cookbook";
function Ge(e) {
	let t = e.split("/").filter(Boolean).map(decodeURIComponent);
	return t.length === 0 ? { name: "list" } : t.length === 1 && t[0] === "new" ? { name: "new" } : t.length === 2 && t[0] === "recipe" ? {
		name: "recipe",
		id: t[1]
	} : t.length === 2 && t[0] === "edit" ? {
		name: "edit",
		id: t[1]
	} : { name: "not-found" };
}
function Ke(e) {
	return `${We}/recipe/${encodeURIComponent(e)}`;
}
function qe(e) {
	return `${We}/edit/${encodeURIComponent(e)}`;
}
var Je = `${We}/new`;
function D(e, t = {}) {
	t.replace ? history.replaceState(history.state, "", e) : history.pushState(null, "", e), window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: t.replace ?? !1 } }));
}
var Ye = "";
function Xe(e) {
	Ye = e;
}
function Ze() {
	return `${We}${Ye}`;
}
// src/styles.ts
var Qe = o`
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
function $e(e) {
	return typeof e == "object" && !!e && "code" in e;
}
var et = class {
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
	create(e) {
		return this.hass.callWS({
			type: "cookbook/create",
			...e
		});
	}
	update(e, t, n) {
		return this.hass.callWS({
			type: "cookbook/update",
			recipe_id: e,
			...n ? { expected_updated_at: n } : {},
			...t
		});
	}
	async delete(e) {
		await this.hass.callWS({
			type: "cookbook/delete",
			recipe_id: e
		});
	}
}, tt = {
	œ: "oe",
	Œ: "oe",
	æ: "ae",
	Æ: "ae"
};
function nt(e) {
	return (tt[e] ?? e).normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase();
}
function rt(e) {
	return [...e].map(nt).join("");
}
function it(e, t) {
	let n = rt(t).split(/\s+/).filter(Boolean), r = [...e], i = "", a = [];
	r.forEach((e, t) => {
		let n = nt(e);
		i += n;
		for (let e = 0; e < n.length; e++) a.push(t);
	});
	let o = Array(r.length).fill(!1);
	for (let e of n) for (let t = i.indexOf(e); t !== -1; t = i.indexOf(e, t + e.length)) for (let n = t; n < t + e.length; n++) o[a[n]] = !0;
	let s = [];
	return r.forEach((e, t) => {
		let n = s.at(-1);
		n && n.match === o[t] ? n.text += e : s.push({
			text: e,
			match: o[t]
		});
	}), s;
}
// src/components/category-input.ts
var at = class extends E {
	constructor(...e) {
		super(...e), this.value = [], this.suggestions = [], this.placeholder = "", this.removeLabel = (e) => e;
	}
	static {
		this.properties = {
			value: { attribute: !1 },
			suggestions: { attribute: !1 },
			placeholder: {},
			removeLabel: { attribute: !1 }
		};
	}
	get input() {
		return this.renderRoot.querySelector("input");
	}
	emit(e) {
		this.value = e, this.dispatchEvent(new CustomEvent("value-changed", { detail: { value: e } }));
	}
	add(e) {
		let t = e.trim();
		if (!t || this.value.some((e) => rt(e) === rt(t))) return;
		let n = this.suggestions.find((e) => rt(e) === rt(t));
		this.emit([...this.value, n ?? t]);
	}
	removeAt(e) {
		this.emit(this.value.filter((t, n) => n !== e));
	}
	commit() {
		this.add(this.input.value), this.input.value = "";
	}
	onKeydown(e) {
		(e.key === "Enter" || e.key === ",") && !e.isComposing ? (e.preventDefault(), this.commit()) : e.key === "Backspace" && !this.input.value && this.value.length && this.removeAt(this.value.length - 1);
	}
	onInput(e) {
		let t = this.input.value;
		(e.inputType === void 0 || e.inputType === "insertReplacementText") && this.suggestions.includes(t) && this.commit();
	}
	render() {
		let e = this.suggestions.filter((e) => !this.value.some((t) => rt(t) === rt(e)));
		return w`
      <div class="field">
        ${this.value.map((e, t) => w`<span class="chip">
            ${e}
            <button aria-label=${this.removeLabel(e)} @click=${() => this.removeAt(t)}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </span>`)}
        <input
          list="suggestions"
          placeholder=${this.placeholder}
          aria-label=${this.placeholder}
          @keydown=${this.onKeydown}
          @input=${this.onInput}
          @blur=${this.commit}
        />
        <datalist id="suggestions">${e.map((e) => w`<option value=${e}></option>`)}</datalist>
      </div>
    `;
	}
	static {
		this.styles = [Qe, o`
      .field {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
        padding: 6px 8px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--card-background-color);
      }
      .field:focus-within {
        outline: 2px solid var(--primary-color);
        outline-offset: -1px;
      }
      .chip {
        gap: 2px;
        padding-right: 2px;
        font-size: 14px;
        color: var(--primary-text-color);
      }
      .chip button {
        display: inline-flex;
        padding: 2px;
        border: 0;
        border-radius: 50%;
        background: none;
        color: var(--secondary-text-color);
        cursor: pointer;
        --mdc-icon-size: 14px;
      }
      input {
        flex: 1;
        min-width: 120px;
        padding: 4px;
        border: 0;
        outline: 0;
        background: transparent;
        color: var(--primary-text-color);
        font: inherit;
        font-size: 15px;
      }
    `];
	}
};
customElements.get("cookbook-category-input") || customElements.define("cookbook-category-input", at);
// src/components/confirm-dialog.ts
var ot = class extends E {
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
		return this.open ? w`
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
    ` : w``;
	}
	static {
		this.styles = [Qe, o`
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
customElements.get("cookbook-confirm-dialog") || customElements.define("cookbook-confirm-dialog", ot);
// node_modules/lit-html/directive.js
var st = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, ct = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), lt = class {
	constructor(e) {}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AT(e, t, n) {
		this._$Ct = e, this._$AM = t, this._$Ci = n;
	}
	_$AS(e, t) {
		return this.update(e, t);
	}
	update(e, t) {
		return this.render(...t);
	}
}, { I: ut } = Fe, dt = (e) => e, ft = () => document.createComment(""), pt = (e, t, n) => {
	let r = e._$AA.parentNode, i = t === void 0 ? e._$AB : t._$AA;
	if (n === void 0) n = new ut(r.insertBefore(ft(), i), r.insertBefore(ft(), i), e, e.options);
	else {
		let t = n._$AB.nextSibling, a = n._$AM, o = a !== e;
		if (o) {
			let t;
			n._$AQ?.(e), n._$AM = e, n._$AP !== void 0 && (t = e._$AU) !== a._$AU && n._$AP(t);
		}
		if (t !== i || o) {
			let e = n._$AA;
			for (; e !== t;) {
				let t = dt(e).nextSibling;
				dt(r).insertBefore(e, i), e = t;
			}
		}
	}
	return n;
}, mt = (e, t, n = e) => (e._$AI(t, n), e), ht = {}, gt = (e, t = ht) => e._$AH = t, _t = (e) => e._$AH, vt = (e) => {
	e._$AR(), e._$AA.remove();
}, yt = (e, t, n) => {
	let r = /* @__PURE__ */ new Map();
	for (let i = t; i <= n; i++) r.set(e[i], i);
	return r;
}, bt = ct(class extends lt {
	constructor(e) {
		if (super(e), e.type !== st.CHILD) throw Error("repeat() can only be used in text expressions");
	}
	dt(e, t, n) {
		let r;
		n === void 0 ? n = t : t !== void 0 && (r = t);
		let i = [], a = [], o = 0;
		for (let t of e) i[o] = r ? r(t, o) : o, a[o] = n(t, o), o++;
		return {
			values: a,
			keys: i
		};
	}
	render(e, t, n) {
		return this.dt(e, t, n).values;
	}
	update(e, [t, n, r]) {
		let i = _t(e), { values: a, keys: o } = this.dt(t, n, r);
		if (!Array.isArray(i)) return this.ut = o, a;
		let s = this.ut ??= [], c = [], l, u, d = 0, f = i.length - 1, p = 0, m = a.length - 1;
		for (; d <= f && p <= m;) if (i[d] === null) d++;
		else if (i[f] === null) f--;
		else if (s[d] === o[p]) c[p] = mt(i[d], a[p]), d++, p++;
		else if (s[f] === o[m]) c[m] = mt(i[f], a[m]), f--, m--;
		else if (s[d] === o[m]) c[m] = mt(i[d], a[m]), pt(e, c[m + 1], i[d]), d++, m--;
		else if (s[f] === o[p]) c[p] = mt(i[f], a[p]), pt(e, i[d], i[f]), f--, p++;
		else if (l === void 0 && (l = yt(o, p, m), u = yt(s, d, f)), l.has(s[d])) {
			if (l.has(s[f])) {
				let t = u.get(o[p]), n = t === void 0 ? null : i[t];
				if (n === null) {
					let t = pt(e, i[d]);
					mt(t, a[p]), c[p] = t;
				} else c[p] = mt(n, a[p]), pt(e, i[d], n), i[t] = null;
				p++;
			} else vt(i[f]), f--;
		} else vt(i[d]), d++;
		for (; p <= m;) {
			let t = pt(e, c[m + 1]);
			mt(t, a[p]), c[p++] = t;
		}
		for (; d <= f;) {
			let e = i[d++];
			e !== null && vt(e);
		}
		return this.ut = o, gt(e, c), xe;
	}
});
// node_modules/sortablejs/modular/sortable.core.esm.js
function xt(e, t, n) {
	return (t = Et(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function O() {
	return O = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, O.apply(null, arguments);
}
function St(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function k(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? St(Object(n), !0).forEach(function(t) {
			xt(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : St(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Ct(e, t) {
	if (e == null) return {};
	var n, r, i = wt(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function wt(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function Tt(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function Et(e) {
	var t = Tt(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Dt(e) {
	"@babel/helpers - typeof";
	return Dt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
		return typeof e;
	} : function(e) {
		return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
	}, Dt(e);
}
var Ot = "1.15.7";
function A(e) {
	if (typeof window < "u" && window.navigator) return !!/*@__PURE__*/ navigator.userAgent.match(e);
}
var j = A(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), kt = A(/Edge/i), At = A(/firefox/i), jt = A(/safari/i) && !A(/chrome/i) && !A(/android/i), Mt = A(/iP(ad|od|hone)/i), Nt = A(/chrome/i) && A(/android/i), Pt = {
	capture: !1,
	passive: !1
};
function M(e, t, n) {
	e.addEventListener(t, n, !j && Pt);
}
function N(e, t, n) {
	e.removeEventListener(t, n, !j && Pt);
}
function Ft(e, t) {
	if (t) {
		if (t[0] === ">" && (t = t.substring(1)), e) try {
			if (e.matches) return e.matches(t);
			if (e.msMatchesSelector) return e.msMatchesSelector(t);
			if (e.webkitMatchesSelector) return e.webkitMatchesSelector(t);
		} catch {
			return !1;
		}
		return !1;
	}
}
function It(e) {
	return e.host && e !== document && e.host.nodeType && e.host !== e ? e.host : e.parentNode;
}
function P(e, t, n, r) {
	if (e) {
		n ||= document;
		do {
			if (t != null && (t[0] === ">" ? e.parentNode === n && Ft(e, t) : Ft(e, t)) || r && e === n) return e;
			if (e === n) break;
		} while (e = It(e));
	}
	return null;
}
var Lt = /\s+/g;
function F(e, t, n) {
	e && t && (e.classList ? e.classList[n ? "add" : "remove"](t) : e.className = ((" " + e.className + " ").replace(Lt, " ").replace(" " + t + " ", " ") + (n ? " " + t : "")).replace(Lt, " "));
}
function I(e, t, n) {
	var r = e && e.style;
	if (r) {
		if (n === void 0) return document.defaultView && document.defaultView.getComputedStyle ? n = document.defaultView.getComputedStyle(e, "") : e.currentStyle && (n = e.currentStyle), t === void 0 ? n : n[t];
		!(t in r) && t.indexOf("webkit") === -1 && (t = "-webkit-" + t), r[t] = n + (typeof n == "string" ? "" : "px");
	}
}
function Rt(e, t) {
	var n = "";
	if (typeof e == "string") n = e;
	else do {
		var r = I(e, "transform");
		r && r !== "none" && (n = r + " " + n);
	} while (!t && (e = e.parentNode));
	var i = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
	return i && new i(n);
}
function zt(e, t, n) {
	if (e) {
		var r = e.getElementsByTagName(t), i = 0, a = r.length;
		if (n) for (; i < a; i++) n(r[i], i);
		return r;
	}
	return [];
}
function L() {
	return document.scrollingElement || document.documentElement;
}
function R(e, t, n, r, i) {
	if (e.getBoundingClientRect || e === window) {
		var a, o, s, c, l, u, d;
		if (e !== window && e.parentNode && e !== L() ? (a = e.getBoundingClientRect(), o = a.top, s = a.left, c = a.bottom, l = a.right, u = a.height, d = a.width) : (o = 0, s = 0, c = window.innerHeight, l = window.innerWidth, u = window.innerHeight, d = window.innerWidth), (t || n) && e !== window && (i ||= e.parentNode, !j)) do
			if (i && i.getBoundingClientRect && (I(i, "transform") !== "none" || n && I(i, "position") !== "static")) {
				var f = i.getBoundingClientRect();
				o -= f.top + parseInt(I(i, "border-top-width")), s -= f.left + parseInt(I(i, "border-left-width")), c = o + a.height, l = s + a.width;
				break;
			}
		while (i = i.parentNode);
		if (r && e !== window) {
			var p = Rt(i || e), m = p && p.a, h = p && p.d;
			p && (o /= h, s /= m, d /= m, u /= h, c = o + u, l = s + d);
		}
		return {
			top: o,
			left: s,
			bottom: c,
			right: l,
			width: d,
			height: u
		};
	}
}
function Bt(e, t, n) {
	for (var r = Gt(e, !0), i = R(e)[t]; r;) {
		var a = R(r)[n], o = void 0;
		if (o = n === "top" || n === "left" ? i >= a : i <= a, !o) return r;
		if (r === L()) break;
		r = Gt(r, !1);
	}
	return !1;
}
function Vt(e, t, n, r) {
	for (var i = 0, a = 0, o = e.children; a < o.length;) {
		if (o[a].style.display !== "none" && o[a] !== Q.ghost && (r || o[a] !== Q.dragged) && P(o[a], n.draggable, e, !1)) {
			if (i === t) return o[a];
			i++;
		}
		a++;
	}
	return null;
}
function Ht(e, t) {
	for (var n = e.lastElementChild; n && (n === Q.ghost || I(n, "display") === "none" || t && !Ft(n, t));) n = n.previousElementSibling;
	return n || null;
}
function z(e, t) {
	var n = 0;
	if (!e || !e.parentNode) return -1;
	for (; e = e.previousElementSibling;) e.nodeName.toUpperCase() !== "TEMPLATE" && e !== Q.clone && (!t || Ft(e, t)) && n++;
	return n;
}
function Ut(e) {
	var t = 0, n = 0, r = L();
	if (e) do {
		var i = Rt(e), a = i.a, o = i.d;
		t += e.scrollLeft * a, n += e.scrollTop * o;
	} while (e !== r && (e = e.parentNode));
	return [t, n];
}
function Wt(e, t) {
	for (var n in e) if (e.hasOwnProperty(n)) {
		for (var r in t) if (t.hasOwnProperty(r) && t[r] === e[n][r]) return Number(n);
	}
	return -1;
}
function Gt(e, t) {
	if (!e || !e.getBoundingClientRect) return L();
	var n = e, r = !1;
	do
		if (n.clientWidth < n.scrollWidth || n.clientHeight < n.scrollHeight) {
			var i = I(n);
			if (n.clientWidth < n.scrollWidth && (i.overflowX == "auto" || i.overflowX == "scroll") || n.clientHeight < n.scrollHeight && (i.overflowY == "auto" || i.overflowY == "scroll")) {
				if (!n.getBoundingClientRect || n === document.body) return L();
				if (r || t) return n;
				r = !0;
			}
		}
	while (n = n.parentNode);
	return L();
}
function Kt(e, t) {
	if (e && t) for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
	return e;
}
function qt(e, t) {
	return Math.round(e.top) === Math.round(t.top) && Math.round(e.left) === Math.round(t.left) && Math.round(e.height) === Math.round(t.height) && Math.round(e.width) === Math.round(t.width);
}
var Jt;
function Yt(e, t) {
	return function() {
		if (!Jt) {
			var n = arguments, r = this;
			n.length === 1 ? e.call(r, n[0]) : e.apply(r, n), Jt = setTimeout(function() {
				Jt = void 0;
			}, t);
		}
	};
}
function Xt(e, t, n) {
	e.scrollLeft += t, e.scrollTop += n;
}
function Zt(e) {
	var t = window.Polymer, n = window.jQuery || window.Zepto;
	return t && t.dom ? t.dom(e).cloneNode(!0) : n ? n(e).clone(!0)[0] : e.cloneNode(!0);
}
function Qt(e, t, n) {
	var r = {};
	return Array.from(e.children).forEach(function(i) {
		if (P(i, t.draggable, e, !1) && !i.animated && i !== n) {
			var a = R(i);
			r.left = Math.min(r.left ?? Infinity, a.left), r.top = Math.min(r.top ?? Infinity, a.top), r.right = Math.max(r.right ?? -Infinity, a.right), r.bottom = Math.max(r.bottom ?? -Infinity, a.bottom);
		}
	}), r.width = r.right - r.left, r.height = r.bottom - r.top, r.x = r.left, r.y = r.top, r;
}
var B = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function $t() {
	var e = [], t;
	return {
		captureAnimationState: function() {
			e = [], this.options.animation && [].slice.call(this.el.children).forEach(function(t) {
				if (I(t, "display") !== "none" && t !== Q.ghost) {
					e.push({
						target: t,
						rect: R(t)
					});
					var n = k({}, e[e.length - 1].rect);
					if (t.thisAnimationDuration) {
						var r = Rt(t, !0);
						r && (n.top -= r.f, n.left -= r.e);
					}
					t.fromRect = n;
				}
			});
		},
		addAnimationState: function(t) {
			e.push(t);
		},
		removeAnimationState: function(t) {
			e.splice(Wt(e, { target: t }), 1);
		},
		animateAll: function(n) {
			var r = this;
			if (!this.options.animation) clearTimeout(t), typeof n == "function" && n();
			else {
				var i = !1, a = 0;
				e.forEach(function(e) {
					var t = 0, n = e.target, o = n.fromRect, s = R(n), c = n.prevFromRect, l = n.prevToRect, u = e.rect, d = Rt(n, !0);
					d && (s.top -= d.f, s.left -= d.e), n.toRect = s, n.thisAnimationDuration && qt(c, s) && !qt(o, s) && (u.top - s.top) / (u.left - s.left) === (o.top - s.top) / (o.left - s.left) && (t = tn(u, c, l, r.options)), qt(s, o) || (n.prevFromRect = o, n.prevToRect = s, t ||= r.options.animation, r.animate(n, u, s, t)), t && (i = !0, a = Math.max(a, t), clearTimeout(n.animationResetTimer), n.animationResetTimer = setTimeout(function() {
						n.animationTime = 0, n.prevFromRect = null, n.fromRect = null, n.prevToRect = null, n.thisAnimationDuration = null;
					}, t), n.thisAnimationDuration = t);
				}), clearTimeout(t), i ? t = setTimeout(function() {
					typeof n == "function" && n();
				}, a) : typeof n == "function" && n(), e = [];
			}
		},
		animate: function(e, t, n, r) {
			if (r) {
				I(e, "transition", ""), I(e, "transform", "");
				var i = Rt(this.el), a = i && i.a, o = i && i.d, s = (t.left - n.left) / (a || 1), c = (t.top - n.top) / (o || 1);
				e.animatingX = !!s, e.animatingY = !!c, I(e, "transform", "translate3d(" + s + "px," + c + "px,0)"), this.forRepaintDummy = en(e), I(e, "transition", "transform " + r + "ms" + (this.options.easing ? " " + this.options.easing : "")), I(e, "transform", "translate3d(0,0,0)"), typeof e.animated == "number" && clearTimeout(e.animated), e.animated = setTimeout(function() {
					I(e, "transition", ""), I(e, "transform", ""), e.animated = !1, e.animatingX = !1, e.animatingY = !1;
				}, r);
			}
		}
	};
}
function en(e) {
	return e.offsetWidth;
}
function tn(e, t, n, r) {
	return Math.sqrt((t.top - e.top) ** 2 + (t.left - e.left) ** 2) / Math.sqrt((t.top - n.top) ** 2 + (t.left - n.left) ** 2) * r.animation;
}
var nn = [], rn = { initializeByDefault: !0 }, an = {
	mount: function(e) {
		for (var t in rn) rn.hasOwnProperty(t) && !(t in e) && (e[t] = rn[t]);
		nn.forEach(function(t) {
			if (t.pluginName === e.pluginName) throw `Sortable: Cannot mount plugin ${e.pluginName} more than once`;
		}), nn.push(e);
	},
	pluginEvent: function(e, t, n) {
		var r = this;
		this.eventCanceled = !1, n.cancel = function() {
			r.eventCanceled = !0;
		};
		var i = e + "Global";
		nn.forEach(function(r) {
			t[r.pluginName] && (t[r.pluginName][i] && t[r.pluginName][i](k({ sortable: t }, n)), t.options[r.pluginName] && t[r.pluginName][e] && t[r.pluginName][e](k({ sortable: t }, n)));
		});
	},
	initializePlugins: function(e, t, n, r) {
		for (var i in nn.forEach(function(r) {
			var i = r.pluginName;
			if (e.options[i] || r.initializeByDefault) {
				var a = new r(e, t, e.options);
				a.sortable = e, a.options = e.options, e[i] = a, O(n, a.defaults);
			}
		}), e.options) if (e.options.hasOwnProperty(i)) {
			var a = this.modifyOption(e, i, e.options[i]);
			a !== void 0 && (e.options[i] = a);
		}
	},
	getEventProperties: function(e, t) {
		var n = {};
		return nn.forEach(function(r) {
			typeof r.eventProperties == "function" && O(n, r.eventProperties.call(t[r.pluginName], e));
		}), n;
	},
	modifyOption: function(e, t, n) {
		var r;
		return nn.forEach(function(i) {
			e[i.pluginName] && i.optionListeners && typeof i.optionListeners[t] == "function" && (r = i.optionListeners[t].call(e[i.pluginName], n));
		}), r;
	}
};
function on(e) {
	var t = e.sortable, n = e.rootEl, r = e.name, i = e.targetEl, a = e.cloneEl, o = e.toEl, s = e.fromEl, c = e.oldIndex, l = e.newIndex, u = e.oldDraggableIndex, d = e.newDraggableIndex, f = e.originalEvent, p = e.putSortable, m = e.extraEventProperties;
	if (t ||= n && n[B], t) {
		var h, g = t.options, _ = "on" + r.charAt(0).toUpperCase() + r.substr(1);
		window.CustomEvent && !j && !kt ? h = new CustomEvent(r, {
			bubbles: !0,
			cancelable: !0
		}) : (h = document.createEvent("Event"), h.initEvent(r, !0, !0)), h.to = o || n, h.from = s || n, h.item = i || n, h.clone = a, h.oldIndex = c, h.newIndex = l, h.oldDraggableIndex = u, h.newDraggableIndex = d, h.originalEvent = f, h.pullMode = p ? p.lastPutMode : void 0;
		var ee = k(k({}, m), an.getEventProperties(r, t));
		for (var v in ee) h[v] = ee[v];
		n && n.dispatchEvent(h), g[_] && g[_].call(t, h);
	}
}
var sn = ["evt"], V = function(e, t) {
	var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, r = n.evt, i = Ct(n, sn);
	an.pluginEvent.bind(Q)(e, t, k({
		dragEl: U,
		parentEl: W,
		ghostEl: G,
		rootEl: K,
		nextEl: cn,
		lastDownEl: ln,
		cloneEl: q,
		cloneHidden: un,
		dragStarted: Cn,
		putSortable: Y,
		activeSortable: Q.active,
		originalEvent: r,
		oldIndex: dn,
		oldDraggableIndex: fn,
		newIndex: J,
		newDraggableIndex: pn,
		hideGhostForTarget: Vn,
		unhideGhostForTarget: Hn,
		cloneNowHidden: function() {
			un = !0;
		},
		cloneNowShown: function() {
			un = !1;
		},
		dispatchSortableEvent: function(e) {
			H({
				sortable: t,
				name: e,
				originalEvent: r
			});
		}
	}, i));
};
function H(e) {
	on(k({
		putSortable: Y,
		cloneEl: q,
		targetEl: U,
		rootEl: K,
		oldIndex: dn,
		oldDraggableIndex: fn,
		newIndex: J,
		newDraggableIndex: pn
	}, e));
}
var U, W, G, K, cn, ln, q, un, dn, J, fn, pn, mn, Y, hn = !1, gn = !1, _n = [], vn, X, yn, bn, xn, Sn, Cn, wn, Tn, En = !1, Dn = !1, On, Z, kn = [], An = !1, jn = [], Mn = typeof document < "u", Nn = Mt, Pn = kt || j ? "cssFloat" : "float", Fn = Mn && !Nt && !Mt && "draggable" in document.createElement("div"), In = function() {
	if (Mn) {
		if (j) return !1;
		var e = document.createElement("x");
		return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
	}
}(), Ln = function(e, t) {
	var n = I(e), r = parseInt(n.width) - parseInt(n.paddingLeft) - parseInt(n.paddingRight) - parseInt(n.borderLeftWidth) - parseInt(n.borderRightWidth), i = Vt(e, 0, t), a = Vt(e, 1, t), o = i && I(i), s = a && I(a), c = o && parseInt(o.marginLeft) + parseInt(o.marginRight) + R(i).width, l = s && parseInt(s.marginLeft) + parseInt(s.marginRight) + R(a).width;
	if (n.display === "flex") return n.flexDirection === "column" || n.flexDirection === "column-reverse" ? "vertical" : "horizontal";
	if (n.display === "grid") return n.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
	if (i && o.float && o.float !== "none") {
		var u = o.float === "left" ? "left" : "right";
		return a && (s.clear === "both" || s.clear === u) ? "vertical" : "horizontal";
	}
	return i && (o.display === "block" || o.display === "flex" || o.display === "table" || o.display === "grid" || c >= r && n[Pn] === "none" || a && n[Pn] === "none" && c + l > r) ? "vertical" : "horizontal";
}, Rn = function(e, t, n) {
	var r = n ? e.left : e.top, i = n ? e.right : e.bottom, a = n ? e.width : e.height, o = n ? t.left : t.top, s = n ? t.right : t.bottom, c = n ? t.width : t.height;
	return r === o || i === s || r + a / 2 === o + c / 2;
}, zn = function(e, t) {
	var n;
	return _n.some(function(r) {
		var i = r[B].options.emptyInsertThreshold;
		if (i && !Ht(r)) {
			var a = R(r), o = e >= a.left - i && e <= a.right + i, s = t >= a.top - i && t <= a.bottom + i;
			if (o && s) return n = r;
		}
	}), n;
}, Bn = function(e) {
	function t(e, n) {
		return function(r, i, a, o) {
			var s = r.options.group.name && i.options.group.name && r.options.group.name === i.options.group.name;
			if (e == null && (n || s)) return !0;
			if (e == null || e === !1) return !1;
			if (n && e === "clone") return e;
			if (typeof e == "function") return t(e(r, i, a, o), n)(r, i, a, o);
			var c = (n ? r : i).options.group.name;
			return e === !0 || typeof e == "string" && e === c || e.join && e.indexOf(c) > -1;
		};
	}
	var n = {}, r = e.group;
	r && Dt(r) == "object" || (r = { name: r }), n.name = r.name, n.checkPull = t(r.pull, !0), n.checkPut = t(r.put), n.revertClone = r.revertClone, e.group = n;
}, Vn = function() {
	!In && G && I(G, "display", "none");
}, Hn = function() {
	!In && G && I(G, "display", "");
};
Mn && !Nt && document.addEventListener("click", function(e) {
	if (gn) return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), gn = !1, !1;
}, !0);
var Un = function(e) {
	if (U) {
		e = e.touches ? e.touches[0] : e;
		var t = zn(e.clientX, e.clientY);
		if (t) {
			var n = {};
			for (var r in e) e.hasOwnProperty(r) && (n[r] = e[r]);
			n.target = n.rootEl = t, n.preventDefault = void 0, n.stopPropagation = void 0, t[B]._onDragOver(n);
		}
	}
}, Wn = function(e) {
	U && U.parentNode[B]._isOutsideThisEl(e.target);
};
function Q(e, t) {
	if (!(e && e.nodeType && e.nodeType === 1)) throw `Sortable: \`el\` must be an HTMLElement, not ${{}.toString.call(e)}`;
	this.el = e, this.options = t = O({}, t), e[B] = this;
	var n = {
		group: null,
		sort: !0,
		disabled: !1,
		store: null,
		handle: null,
		draggable: /^[uo]l$/i.test(e.nodeName) ? ">li" : ">*",
		swapThreshold: 1,
		invertSwap: !1,
		invertedSwapThreshold: null,
		removeCloneOnHide: !0,
		direction: function() {
			return Ln(e, this.options);
		},
		ghostClass: "sortable-ghost",
		chosenClass: "sortable-chosen",
		dragClass: "sortable-drag",
		ignore: "a, img",
		filter: null,
		preventOnFilter: !0,
		animation: 0,
		easing: null,
		setData: function(e, t) {
			e.setData("Text", t.textContent);
		},
		dropBubble: !1,
		dragoverBubble: !1,
		dataIdAttr: "data-id",
		delay: 0,
		delayOnTouchOnly: !1,
		touchStartThreshold: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1,
		forceFallback: !1,
		fallbackClass: "sortable-fallback",
		fallbackOnBody: !1,
		fallbackTolerance: 0,
		fallbackOffset: {
			x: 0,
			y: 0
		},
		supportPointer: Q.supportPointer !== !1 && "PointerEvent" in window && (!jt || Mt),
		emptyInsertThreshold: 5
	};
	for (var r in an.initializePlugins(this, e, n), n) !(r in t) && (t[r] = n[r]);
	for (var i in Bn(t), this) i.charAt(0) === "_" && typeof this[i] == "function" && (this[i] = this[i].bind(this));
	this.nativeDraggable = !t.forceFallback && Fn, this.nativeDraggable && (this.options.touchStartThreshold = 1), t.supportPointer ? M(e, "pointerdown", this._onTapStart) : (M(e, "mousedown", this._onTapStart), M(e, "touchstart", this._onTapStart)), this.nativeDraggable && (M(e, "dragover", this), M(e, "dragenter", this)), _n.push(this.el), t.store && t.store.get && this.sort(t.store.get(this) || []), O(this, $t());
}
Q.prototype = {
	constructor: Q,
	_isOutsideThisEl: function(e) {
		!this.el.contains(e) && e !== this.el && (wn = null);
	},
	_getDirection: function(e, t) {
		return typeof this.options.direction == "function" ? this.options.direction.call(this, e, t, U) : this.options.direction;
	},
	_onTapStart: function(e) {
		if (e.cancelable) {
			var t = this, n = this.el, r = this.options, i = r.preventOnFilter, a = e.type, o = e.touches && e.touches[0] || e.pointerType && e.pointerType === "touch" && e, s = (o || e).target, c = e.target.shadowRoot && (e.path && e.path[0] || e.composedPath && e.composedPath()[0]) || s, l = r.filter;
			if (er(n), !U && !(/mousedown|pointerdown/.test(a) && e.button !== 0 || r.disabled) && !c.isContentEditable && !(!this.nativeDraggable && jt && s && s.tagName.toUpperCase() === "SELECT") && (s = P(s, r.draggable, n, !1), !(s && s.animated) && ln !== s)) {
				if (dn = z(s), fn = z(s, r.draggable), typeof l == "function") {
					if (l.call(this, e, s, this)) {
						H({
							sortable: t,
							rootEl: c,
							name: "filter",
							targetEl: s,
							toEl: n,
							fromEl: n
						}), V("filter", t, { evt: e }), i && e.preventDefault();
						return;
					}
				} else if (l && (l = l.split(",").some(function(r) {
					if (r = P(c, r.trim(), n, !1), r) return H({
						sortable: t,
						rootEl: r,
						name: "filter",
						targetEl: s,
						fromEl: n,
						toEl: n
					}), V("filter", t, { evt: e }), !0;
				}), l)) {
					i && e.preventDefault();
					return;
				}
				(!r.handle || P(c, r.handle, n, !1)) && this._prepareDragStart(e, o, s);
			}
		}
	},
	_prepareDragStart: function(e, t, n) {
		var r = this, i = r.el, a = r.options, o = i.ownerDocument, s;
		if (n && !U && n.parentNode === i) {
			var c = R(n);
			if (K = i, U = n, W = U.parentNode, cn = U.nextSibling, ln = n, mn = a.group, Q.dragged = U, vn = {
				target: U,
				clientX: (t || e).clientX,
				clientY: (t || e).clientY
			}, xn = vn.clientX - c.left, Sn = vn.clientY - c.top, this._lastX = (t || e).clientX, this._lastY = (t || e).clientY, U.style["will-change"] = "all", s = function() {
				V("delayEnded", r, { evt: e }), Q.eventCanceled ? r._onDrop() : (r._disableDelayedDragEvents(), !At && r.nativeDraggable && (U.draggable = !0), r._triggerDragStart(e, t), H({
					sortable: r,
					name: "choose",
					originalEvent: e
				}), F(U, a.chosenClass, !0));
			}, a.ignore.split(",").forEach(function(e) {
				zt(U, e.trim(), qn);
			}), M(o, "dragover", Un), M(o, "mousemove", Un), M(o, "touchmove", Un), a.supportPointer ? (M(o, "pointerup", r._onDrop), !this.nativeDraggable && M(o, "pointercancel", r._onDrop)) : (M(o, "mouseup", r._onDrop), M(o, "touchend", r._onDrop), M(o, "touchcancel", r._onDrop)), At && this.nativeDraggable && (this.options.touchStartThreshold = 4, U.draggable = !0), V("delayStart", this, { evt: e }), a.delay && (!a.delayOnTouchOnly || t) && (!this.nativeDraggable || !(kt || j))) {
				if (Q.eventCanceled) {
					this._onDrop();
					return;
				}
				a.supportPointer ? (M(o, "pointerup", r._disableDelayedDrag), M(o, "pointercancel", r._disableDelayedDrag)) : (M(o, "mouseup", r._disableDelayedDrag), M(o, "touchend", r._disableDelayedDrag), M(o, "touchcancel", r._disableDelayedDrag)), M(o, "mousemove", r._delayedDragTouchMoveHandler), M(o, "touchmove", r._delayedDragTouchMoveHandler), a.supportPointer && M(o, "pointermove", r._delayedDragTouchMoveHandler), r._dragStartTimer = setTimeout(s, a.delay);
			} else s();
		}
	},
	_delayedDragTouchMoveHandler: function(e) {
		var t = e.touches ? e.touches[0] : e;
		Math.max(Math.abs(t.clientX - this._lastX), Math.abs(t.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
	},
	_disableDelayedDrag: function() {
		U && qn(U), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
	},
	_disableDelayedDragEvents: function() {
		var e = this.el.ownerDocument;
		N(e, "mouseup", this._disableDelayedDrag), N(e, "touchend", this._disableDelayedDrag), N(e, "touchcancel", this._disableDelayedDrag), N(e, "pointerup", this._disableDelayedDrag), N(e, "pointercancel", this._disableDelayedDrag), N(e, "mousemove", this._delayedDragTouchMoveHandler), N(e, "touchmove", this._delayedDragTouchMoveHandler), N(e, "pointermove", this._delayedDragTouchMoveHandler);
	},
	_triggerDragStart: function(e, t) {
		t ||= e.pointerType == "touch" && e, !this.nativeDraggable || t ? this.options.supportPointer ? M(document, "pointermove", this._onTouchMove) : t ? M(document, "touchmove", this._onTouchMove) : M(document, "mousemove", this._onTouchMove) : (M(U, "dragend", this), M(K, "dragstart", this._onDragStart));
		try {
			document.selection ? tr(function() {
				document.selection.empty();
			}) : window.getSelection().removeAllRanges();
		} catch {}
	},
	_dragStarted: function(e, t) {
		if (hn = !1, K && U) {
			V("dragStarted", this, { evt: t }), this.nativeDraggable && M(document, "dragover", Wn);
			var n = this.options;
			!e && F(U, n.dragClass, !1), F(U, n.ghostClass, !0), Q.active = this, e && this._appendGhost(), H({
				sortable: this,
				name: "start",
				originalEvent: t
			});
		} else this._nulling();
	},
	_emulateDragOver: function() {
		if (X) {
			this._lastX = X.clientX, this._lastY = X.clientY, Vn();
			for (var e = document.elementFromPoint(X.clientX, X.clientY), t = e; e && e.shadowRoot && (e = e.shadowRoot.elementFromPoint(X.clientX, X.clientY), e !== t);) t = e;
			if (U.parentNode[B]._isOutsideThisEl(e), t) do {
				if (t[B]) {
					var n = void 0;
					if (n = t[B]._onDragOver({
						clientX: X.clientX,
						clientY: X.clientY,
						target: e,
						rootEl: t
					}), n && !this.options.dragoverBubble) break;
				}
				e = t;
			} while (t = It(t));
			Hn();
		}
	},
	_onTouchMove: function(e) {
		if (vn) {
			var t = this.options, n = t.fallbackTolerance, r = t.fallbackOffset, i = e.touches ? e.touches[0] : e, a = G && Rt(G, !0), o = G && a && a.a, s = G && a && a.d, c = Nn && Z && Ut(Z), l = (i.clientX - vn.clientX + r.x) / (o || 1) + (c ? c[0] - kn[0] : 0) / (o || 1), u = (i.clientY - vn.clientY + r.y) / (s || 1) + (c ? c[1] - kn[1] : 0) / (s || 1);
			if (!Q.active && !hn) {
				if (n && Math.max(Math.abs(i.clientX - this._lastX), Math.abs(i.clientY - this._lastY)) < n) return;
				this._onDragStart(e, !0);
			}
			if (G) {
				a ? (a.e += l - (yn || 0), a.f += u - (bn || 0)) : a = {
					a: 1,
					b: 0,
					c: 0,
					d: 1,
					e: l,
					f: u
				};
				var d = `matrix(${a.a},${a.b},${a.c},${a.d},${a.e},${a.f})`;
				I(G, "webkitTransform", d), I(G, "mozTransform", d), I(G, "msTransform", d), I(G, "transform", d), yn = l, bn = u, X = i;
			}
			e.cancelable && e.preventDefault();
		}
	},
	_appendGhost: function() {
		if (!G) {
			var e = this.options.fallbackOnBody ? document.body : K, t = R(U, !0, Nn, !0, e), n = this.options;
			if (Nn) {
				for (Z = e; I(Z, "position") === "static" && I(Z, "transform") === "none" && Z !== document;) Z = Z.parentNode;
				Z !== document.body && Z !== document.documentElement ? (Z === document && (Z = L()), t.top += Z.scrollTop, t.left += Z.scrollLeft) : Z = L(), kn = Ut(Z);
			}
			G = U.cloneNode(!0), F(G, n.ghostClass, !1), F(G, n.fallbackClass, !0), F(G, n.dragClass, !0), I(G, "transition", ""), I(G, "transform", ""), I(G, "box-sizing", "border-box"), I(G, "margin", 0), I(G, "top", t.top), I(G, "left", t.left), I(G, "width", t.width), I(G, "height", t.height), I(G, "opacity", "0.8"), I(G, "position", Nn ? "absolute" : "fixed"), I(G, "zIndex", "100000"), I(G, "pointerEvents", "none"), Q.ghost = G, e.appendChild(G), I(G, "transform-origin", xn / parseInt(G.style.width) * 100 + "% " + Sn / parseInt(G.style.height) * 100 + "%");
		}
	},
	_onDragStart: function(e, t) {
		var n = this, r = e.dataTransfer, i = n.options;
		V("dragStart", this, { evt: e }), Q.eventCanceled ? this._onDrop() : (V("setupClone", this), Q.eventCanceled || (q = Zt(U), q.removeAttribute("id"), q.draggable = !1, q.style["will-change"] = "", this._hideClone(), F(q, this.options.chosenClass, !1), Q.clone = q), n.cloneId = tr(function() {
			V("clone", n), Q.eventCanceled || (n.options.removeCloneOnHide || K.insertBefore(q, U), n._hideClone(), H({
				sortable: n,
				name: "clone"
			}));
		}), !t && F(U, i.dragClass, !0), t ? (gn = !0, n._loopId = setInterval(n._emulateDragOver, 50)) : (N(document, "mouseup", n._onDrop), N(document, "touchend", n._onDrop), N(document, "touchcancel", n._onDrop), r && (r.effectAllowed = "move", i.setData && i.setData.call(n, r, U)), M(document, "drop", n), I(U, "transform", "translateZ(0)")), hn = !0, n._dragStartId = tr(n._dragStarted.bind(n, t, e)), M(document, "selectstart", n), Cn = !0, window.getSelection().removeAllRanges(), jt && I(document.body, "user-select", "none"));
	},
	_onDragOver: function(e) {
		var t = this.el, n = e.target, r, i, a, o = this.options, s = o.group, c = Q.active, l = mn === s, u = o.sort, d = Y || c, f, p = this, m = !1;
		if (An) return;
		function h(o, s) {
			V(o, p, k({
				evt: e,
				isOwner: l,
				axis: f ? "vertical" : "horizontal",
				revert: a,
				dragRect: r,
				targetRect: i,
				canSort: u,
				fromSortable: d,
				target: n,
				completed: _,
				onMove: function(n, i) {
					return Kn(K, t, U, r, n, R(n), e, i);
				},
				changed: ee
			}, s));
		}
		function g() {
			h("dragOverAnimationCapture"), p.captureAnimationState(), p !== d && d.captureAnimationState();
		}
		function _(r) {
			return h("dragOverCompleted", { insertion: r }), r && (l ? c._hideClone() : c._showClone(p), p !== d && (F(U, Y ? Y.options.ghostClass : c.options.ghostClass, !1), F(U, o.ghostClass, !0)), Y !== p && p !== Q.active ? Y = p : p === Q.active && Y && (Y = null), d === p && (p._ignoreWhileAnimating = n), p.animateAll(function() {
				h("dragOverAnimationComplete"), p._ignoreWhileAnimating = null;
			}), p !== d && (d.animateAll(), d._ignoreWhileAnimating = null)), (n === U && !U.animated || n === t && !n.animated) && (wn = null), !o.dragoverBubble && !e.rootEl && n !== document && (U.parentNode[B]._isOutsideThisEl(e.target), !r && Un(e)), !o.dragoverBubble && e.stopPropagation && e.stopPropagation(), m = !0;
		}
		function ee() {
			J = z(U), pn = z(U, o.draggable), H({
				sortable: p,
				name: "change",
				toEl: t,
				newIndex: J,
				newDraggableIndex: pn,
				originalEvent: e
			});
		}
		if (e.preventDefault !== void 0 && e.cancelable && e.preventDefault(), n = P(n, o.draggable, t, !0), h("dragOver"), Q.eventCanceled) return m;
		if (U.contains(e.target) || n.animated && n.animatingX && n.animatingY || p._ignoreWhileAnimating === n) return _(!1);
		if (gn = !1, c && !o.disabled && (l ? u || (a = W !== K) : Y === this || (this.lastPutMode = mn.checkPull(this, c, U, e)) && s.checkPut(this, c, U, e))) {
			if (f = this._getDirection(e, n) === "vertical", r = R(U), h("dragOverValid"), Q.eventCanceled) return m;
			if (a) return W = K, g(), this._hideClone(), h("revert"), Q.eventCanceled || (cn ? K.insertBefore(U, cn) : K.appendChild(U)), _(!0);
			var v = Ht(t, o.draggable);
			if (!v || Xn(e, f, this) && !v.animated) {
				if (v === U) return _(!1);
				if (v && t === e.target && (n = v), n && (i = R(n)), Kn(K, t, U, r, n, i, e, !!n) !== !1) return g(), v && v.nextSibling ? t.insertBefore(U, v.nextSibling) : t.appendChild(U), W = t, ee(), _(!0);
			} else if (v && Yn(e, f, this)) {
				var te = Vt(t, 0, o, !0);
				if (te === U) return _(!1);
				if (n = te, i = R(n), Kn(K, t, U, r, n, i, e, !1) !== !1) return g(), t.insertBefore(U, te), W = t, ee(), _(!0);
			} else if (n.parentNode === t) {
				i = R(n);
				var y = 0, ne, re = U.parentNode !== t, ie = !Rn(U.animated && U.toRect || r, n.animated && n.toRect || i, f), ae = f ? "top" : "left", b = Bt(n, "top", "top") || Bt(U, "top", "top"), oe = b ? b.scrollTop : void 0;
				wn !== n && (ne = i[ae], En = !1, Dn = !ie && o.invertSwap || re), y = Zn(e, n, i, f, ie ? 1 : o.swapThreshold, o.invertedSwapThreshold == null ? o.swapThreshold : o.invertedSwapThreshold, Dn, wn === n);
				var x;
				if (y !== 0) {
					var S = z(U);
					do
						S -= y, x = W.children[S];
					while (x && (I(x, "display") === "none" || x === G));
				}
				if (y === 0 || x === n) return _(!1);
				wn = n, Tn = y;
				var se = n.nextElementSibling, ce = !1;
				ce = y === 1;
				var C = Kn(K, t, U, r, n, i, e, ce);
				if (C !== !1) return (C === 1 || C === -1) && (ce = C === 1), An = !0, setTimeout(Jn, 30), g(), ce && !se ? t.appendChild(U) : n.parentNode.insertBefore(U, ce ? se : n), b && Xt(b, 0, oe - b.scrollTop), W = U.parentNode, ne !== void 0 && !Dn && (On = Math.abs(ne - R(n)[ae])), ee(), _(!0);
			}
			if (t.contains(U)) return _(!1);
		}
		return !1;
	},
	_ignoreWhileAnimating: null,
	_offMoveEvents: function() {
		N(document, "mousemove", this._onTouchMove), N(document, "touchmove", this._onTouchMove), N(document, "pointermove", this._onTouchMove), N(document, "dragover", Un), N(document, "mousemove", Un), N(document, "touchmove", Un);
	},
	_offUpEvents: function() {
		var e = this.el.ownerDocument;
		N(e, "mouseup", this._onDrop), N(e, "touchend", this._onDrop), N(e, "pointerup", this._onDrop), N(e, "pointercancel", this._onDrop), N(e, "touchcancel", this._onDrop), N(document, "selectstart", this);
	},
	_onDrop: function(e) {
		var t = this.el, n = this.options;
		J = z(U), pn = z(U, n.draggable), V("drop", this, { evt: e }), W = U && U.parentNode, J = z(U), pn = z(U, n.draggable), Q.eventCanceled || (hn = !1, Dn = !1, En = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), nr(this.cloneId), nr(this._dragStartId), this.nativeDraggable && (N(document, "drop", this), N(t, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), jt && I(document.body, "user-select", ""), I(U, "transform", ""), e && (Cn && (e.cancelable && e.preventDefault(), !n.dropBubble && e.stopPropagation()), G && G.parentNode && G.parentNode.removeChild(G), (K === W || Y && Y.lastPutMode !== "clone") && q && q.parentNode && q.parentNode.removeChild(q), U && (this.nativeDraggable && N(U, "dragend", this), qn(U), U.style["will-change"] = "", Cn && !hn && F(U, Y ? Y.options.ghostClass : this.options.ghostClass, !1), F(U, this.options.chosenClass, !1), H({
			sortable: this,
			name: "unchoose",
			toEl: W,
			newIndex: null,
			newDraggableIndex: null,
			originalEvent: e
		}), K === W ? J !== dn && J >= 0 && (H({
			sortable: this,
			name: "update",
			toEl: W,
			originalEvent: e
		}), H({
			sortable: this,
			name: "sort",
			toEl: W,
			originalEvent: e
		})) : (J >= 0 && (H({
			rootEl: W,
			name: "add",
			toEl: W,
			fromEl: K,
			originalEvent: e
		}), H({
			sortable: this,
			name: "remove",
			toEl: W,
			originalEvent: e
		}), H({
			rootEl: W,
			name: "sort",
			toEl: W,
			fromEl: K,
			originalEvent: e
		}), H({
			sortable: this,
			name: "sort",
			toEl: W,
			originalEvent: e
		})), Y && Y.save()), Q.active && ((J == null || J === -1) && (J = dn, pn = fn), H({
			sortable: this,
			name: "end",
			toEl: W,
			originalEvent: e
		}), this.save())))), this._nulling();
	},
	_nulling: function() {
		V("nulling", this), K = U = W = G = cn = q = ln = un = vn = X = Cn = J = pn = dn = fn = wn = Tn = Y = mn = Q.dragged = Q.ghost = Q.clone = Q.active = null;
		var e = this.el;
		jn.forEach(function(t) {
			e.contains(t) && (t.checked = !0);
		}), jn.length = yn = bn = 0;
	},
	handleEvent: function(e) {
		switch (e.type) {
			case "drop":
			case "dragend":
				this._onDrop(e);
				break;
			case "dragenter":
			case "dragover":
				U && (this._onDragOver(e), Gn(e));
				break;
			case "selectstart": e.preventDefault();
		}
	},
	toArray: function() {
		for (var e = [], t, n = this.el.children, r = 0, i = n.length, a = this.options; r < i; r++) t = n[r], P(t, a.draggable, this.el, !1) && e.push(t.getAttribute(a.dataIdAttr) || $n(t));
		return e;
	},
	sort: function(e, t) {
		var n = {}, r = this.el;
		this.toArray().forEach(function(e, t) {
			var i = r.children[t];
			P(i, this.options.draggable, r, !1) && (n[e] = i);
		}, this), t && this.captureAnimationState(), e.forEach(function(e) {
			n[e] && (r.removeChild(n[e]), r.appendChild(n[e]));
		}), t && this.animateAll();
	},
	save: function() {
		var e = this.options.store;
		e && e.set && e.set(this);
	},
	closest: function(e, t) {
		return P(e, t || this.options.draggable, this.el, !1);
	},
	option: function(e, t) {
		var n = this.options;
		if (t === void 0) return n[e];
		var r = an.modifyOption(this, e, t);
		n[e] = r === void 0 ? t : r, e === "group" && Bn(n);
	},
	destroy: function() {
		V("destroy", this);
		var e = this.el;
		e[B] = null, N(e, "mousedown", this._onTapStart), N(e, "touchstart", this._onTapStart), N(e, "pointerdown", this._onTapStart), this.nativeDraggable && (N(e, "dragover", this), N(e, "dragenter", this)), Array.prototype.forEach.call(e.querySelectorAll("[draggable]"), function(e) {
			e.removeAttribute("draggable");
		}), this._onDrop(), this._disableDelayedDragEvents(), _n.splice(_n.indexOf(this.el), 1), this.el = e = null;
	},
	_hideClone: function() {
		if (!un) {
			if (V("hideClone", this), Q.eventCanceled) return;
			I(q, "display", "none"), this.options.removeCloneOnHide && q.parentNode && q.parentNode.removeChild(q), un = !0;
		}
	},
	_showClone: function(e) {
		if (e.lastPutMode !== "clone") this._hideClone();
		else if (un) {
			if (V("showClone", this), Q.eventCanceled) return;
			U.parentNode == K && !this.options.group.revertClone ? K.insertBefore(q, U) : cn ? K.insertBefore(q, cn) : K.appendChild(q), this.options.group.revertClone && this.animate(U, q), I(q, "display", ""), un = !1;
		}
	}
};
function Gn(e) {
	e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function Kn(e, t, n, r, i, a, o, s) {
	var c, l = e[B], u = l.options.onMove, d;
	return window.CustomEvent && !j && !kt ? c = new CustomEvent("move", {
		bubbles: !0,
		cancelable: !0
	}) : (c = document.createEvent("Event"), c.initEvent("move", !0, !0)), c.to = t, c.from = e, c.dragged = n, c.draggedRect = r, c.related = i || t, c.relatedRect = a || R(t), c.willInsertAfter = s, c.originalEvent = o, e.dispatchEvent(c), u && (d = u.call(l, c, o)), d;
}
function qn(e) {
	e.draggable = !1;
}
function Jn() {
	An = !1;
}
function Yn(e, t, n) {
	var r = R(Vt(n.el, 0, n.options, !0)), i = Qt(n.el, n.options, G), a = 10;
	return t ? e.clientX < i.left - a || e.clientY < r.top && e.clientX < r.right : e.clientY < i.top - a || e.clientY < r.bottom && e.clientX < r.left;
}
function Xn(e, t, n) {
	var r = R(Ht(n.el, n.options.draggable)), i = Qt(n.el, n.options, G), a = 10;
	return t ? e.clientX > i.right + a || e.clientY > r.bottom && e.clientX > r.left : e.clientY > i.bottom + a || e.clientX > r.right && e.clientY > r.top;
}
function Zn(e, t, n, r, i, a, o, s) {
	var c = r ? e.clientY : e.clientX, l = r ? n.height : n.width, u = r ? n.top : n.left, d = r ? n.bottom : n.right, f = !1;
	if (!o) {
		if (s && On < l * i) {
			if (!En && (Tn === 1 ? c > u + l * a / 2 : c < d - l * a / 2) && (En = !0), En) f = !0;
			else if (Tn === 1 ? c < u + On : c > d - On) return -Tn;
		} else if (c > u + l * (1 - i) / 2 && c < d - l * (1 - i) / 2) return Qn(t);
	}
	return f ||= o, f && (c < u + l * a / 2 || c > d - l * a / 2) ? c > u + l / 2 ? 1 : -1 : 0;
}
function Qn(e) {
	return z(U) < z(e) ? 1 : -1;
}
function $n(e) {
	for (var t = e.tagName + e.className + e.src + e.href + e.textContent, n = t.length, r = 0; n--;) r += t.charCodeAt(n);
	return r.toString(36);
}
function er(e) {
	jn.length = 0;
	for (var t = e.getElementsByTagName("input"), n = t.length; n--;) {
		var r = t[n];
		r.checked && jn.push(r);
	}
}
function tr(e) {
	return setTimeout(e, 0);
}
function nr(e) {
	return clearTimeout(e);
}
Mn && M(document, "touchmove", function(e) {
	(Q.active || hn) && e.cancelable && e.preventDefault();
}), Q.utils = {
	on: M,
	off: N,
	css: I,
	find: zt,
	is: function(e, t) {
		return !!P(e, t, e, !1);
	},
	extend: Kt,
	throttle: Yt,
	closest: P,
	toggleClass: F,
	clone: Zt,
	index: z,
	nextTick: tr,
	cancelNextTick: nr,
	detectDirection: Ln,
	getChild: Vt,
	expando: B
}, Q.get = function(e) {
	return e[B];
}, Q.mount = function() {
	var e = [...arguments];
	e[0].constructor === Array && (e = e[0]), e.forEach(function(e) {
		if (!e.prototype || !e.prototype.constructor) throw `Sortable: Mounted plugin must be a constructor function, not ${{}.toString.call(e)}`;
		e.utils && (Q.utils = k(k({}, Q.utils), e.utils)), an.mount(e);
	});
}, Q.create = function(e, t) {
	return new Q(e, t);
}, Q.version = Ot;
var rr = function(e) {
	var t = e.originalEvent, n = e.putSortable, r = e.dragEl, i = e.activeSortable, a = e.dispatchSortableEvent, o = e.hideGhostForTarget, s = e.unhideGhostForTarget;
	if (t) {
		var c = n || i;
		o();
		var l = t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : t, u = document.elementFromPoint(l.clientX, l.clientY);
		s(), c && !c.el.contains(u) && (a("spill"), this.onSpill({
			dragEl: r,
			putSortable: n
		}));
	}
};
function ir() {}
ir.prototype = {
	startIndex: null,
	dragStart: function(e) {
		var t = e.oldDraggableIndex;
		this.startIndex = t;
	},
	onSpill: function(e) {
		var t = e.dragEl, n = e.putSortable;
		this.sortable.captureAnimationState(), n && n.captureAnimationState();
		var r = Vt(this.sortable.el, this.startIndex, this.options);
		r ? this.sortable.el.insertBefore(t, r) : this.sortable.el.appendChild(t), this.sortable.animateAll(), n && n.animateAll();
	},
	drop: rr
}, O(ir, { pluginName: "revertOnSpill" });
function ar() {}
ar.prototype = {
	onSpill: function(e) {
		var t = e.dragEl, n = e.putSortable || this.sortable;
		n.captureAnimationState(), t.parentNode && t.parentNode.removeChild(t), n.animateAll();
	},
	drop: rr
}, O(ar, { pluginName: "removeOnSpill" });
// src/editor-rows.ts
var or = 1, sr = (e, t = "") => ({
	id: or++,
	kind: e,
	text: t
});
function cr(e) {
	let t = [], n = null;
	for (let r of e) r.section !== n && (t.push(sr("section", r.section ?? "")), n = r.section), t.push(sr("item", r.text));
	return t;
}
function lr(e) {
	let t = [], n = null;
	for (let r of e) {
		let e = r.text.trim();
		r.kind === "section" ? n = e || null : e && t.push({
			text: e,
			section: n
		});
	}
	return t;
}
function ur(e, t, n) {
	if (n < 0 || n >= e.length || t === n) return e;
	let r = [...e], [i] = r.splice(t, 1);
	return r.splice(n, 0, i), r;
}
var dr = /^\s*(?:[-*•·–]|\d+[.)])\s+/;
function fr(e) {
	return e.split(/\r?\n/).map((e) => e.replace(dr, "").trim()).filter(Boolean);
}
// src/components/item-list-editor.ts
var pr = class extends E {
	constructor(...e) {
		super(...e), this.items = [], this.multiline = !1, this.numbered = !1, this.rows = [sr("item")], this.dragAnchor = null;
	}
	static {
		this.properties = {
			items: { attribute: !1 },
			multiline: { type: Boolean },
			numbered: { type: Boolean },
			labels: { attribute: !1 },
			rows: { state: !0 }
		};
	}
	willUpdate(e) {
		if (e.has("items") && this.items !== this.lastEmitted) {
			let e = cr(this.items);
			this.rows = e.length ? e : [sr("item")];
		}
	}
	firstUpdated() {
		let e = this.renderRoot.querySelector("ol");
		this.sortable = Q.create(e, {
			handle: ".handle",
			animation: 150,
			onStart: ({ item: e }) => {
				this.dragAnchor = e.nextSibling;
			},
			onEnd: ({ oldIndex: e, newIndex: t, item: n, from: r }) => {
				let i = this.dragAnchor;
				this.dragAnchor = null, e != null && t != null && e !== t && (r.insertBefore(n, i), this.setRows(ur(this.rows, e, t)));
			}
		});
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.sortable?.destroy(), this.sortable = void 0;
	}
	updated() {
		if (!this.focusAfterRender) return;
		let { id: e, atEnd: t } = this.focusAfterRender;
		this.focusAfterRender = void 0;
		let n = this.renderRoot.querySelector(`[data-row="${e}"]`);
		if (!n) return;
		n.focus();
		let r = t ? n.value.length : 0;
		n.setSelectionRange(r, r);
	}
	setRows(e) {
		this.rows = e;
		let t = lr(e);
		this.lastEmitted = t, this.items = t, this.dispatchEvent(new CustomEvent("items-changed", { detail: { items: t } }));
	}
	insertAfter(e, t, n = t.at(-1)) {
		let r = [...this.rows];
		r.splice(e + 1, 0, ...t), this.focusAfterRender = {
			id: n.id,
			atEnd: !0
		}, this.setRows(r);
	}
	addRow(e) {
		this.insertAfter(this.rows.length - 1, [sr(e)]);
	}
	onInput(e, t) {
		let n = t.target, r = [...this.rows];
		r[e] = {
			...r[e],
			text: n.value
		}, this.setRows(r), n instanceof HTMLTextAreaElement && this.autoGrow(n);
	}
	onKeydown(e, t) {
		let n = this.rows[e];
		t.key === "Enter" && !t.shiftKey && !t.isComposing ? (t.preventDefault(), this.insertAfter(e, [sr("item")])) : t.key === "Backspace" && n.text === "" && this.rows.length > 1 && (t.preventDefault(), this.removeRow(e));
	}
	onPaste(e, t) {
		let n = fr(t.clipboardData?.getData("text/plain") ?? "");
		if (n.length < 2) return;
		t.preventDefault();
		let r = this.rows[e], i = [...this.rows];
		i[e] = {
			...r,
			text: r.text ? `${r.text} ${n[0]}` : n[0]
		};
		let a = n.slice(1).map((e) => sr("item", e));
		i.splice(e + 1, 0, ...a), this.focusAfterRender = {
			id: a.at(-1).id,
			atEnd: !0
		}, this.setRows(i);
	}
	removeRow(e) {
		let t = this.rows.filter((t, n) => n !== e), n = t[Math.max(0, e - 1)];
		n && (this.focusAfterRender = {
			id: n.id,
			atEnd: !0
		}), this.setRows(t.length ? t : [sr("item")]);
	}
	move(e, t) {
		let n = e + t;
		n < 0 || n >= this.rows.length || this.setRows(ur(this.rows, e, n));
	}
	autoGrow(e) {
		e.style.height = "auto", e.style.height = `${e.scrollHeight}px`;
	}
	render() {
		let e = 0;
		return w`
      <ol>
        ${bt(this.rows, (e) => e.id, (t, n) => {
			let r = t.kind === "section";
			r || e++;
			let i = { placeholder: r ? this.labels.sectionPlaceholder : this.labels.itemPlaceholder };
			return w`<li class=${t.kind}>
              <span class="handle" title=${this.labels.drag} aria-hidden="true">
                <ha-icon icon="mdi:drag"></ha-icon>
              </span>
              ${this.numbered && !r ? w`<span class="number">${e}</span>` : T}
              ${this.multiline && !r ? w`<textarea
                    rows="1"
                    data-row=${t.id}
                    .value=${t.text}
                    placeholder=${i.placeholder}
                    aria-label=${i.placeholder}
                    @input=${(e) => this.onInput(n, e)}
                    @keydown=${(e) => this.onKeydown(n, e)}
                    @paste=${(e) => this.onPaste(n, e)}
                  ></textarea>` : w`<input
                    data-row=${t.id}
                    .value=${t.text}
                    placeholder=${i.placeholder}
                    aria-label=${i.placeholder}
                    @input=${(e) => this.onInput(n, e)}
                    @keydown=${(e) => this.onKeydown(n, e)}
                    @paste=${(e) => this.onPaste(n, e)}
                  />`}
              <span class="row-actions">
                <button
                  class="icon up"
                  aria-label=${this.labels.moveUp}
                  ?disabled=${n === 0}
                  @click=${() => this.move(n, -1)}
                >
                  <ha-icon icon="mdi:chevron-up"></ha-icon>
                </button>
                <button
                  class="icon down"
                  aria-label=${this.labels.moveDown}
                  ?disabled=${n === this.rows.length - 1}
                  @click=${() => this.move(n, 1)}
                >
                  <ha-icon icon="mdi:chevron-down"></ha-icon>
                </button>
                <button class="icon remove" aria-label=${this.labels.remove} @click=${() => this.removeRow(n)}>
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>
              </span>
            </li>`;
		})}
      </ol>
      <div class="add">
        <button class="btn add-item" @click=${() => this.addRow("item")}>
          <ha-icon icon="mdi:plus"></ha-icon>${this.labels.addItem}
        </button>
        <button class="btn add-section" @click=${() => this.addRow("section")}>
          <ha-icon icon="mdi:format-header-pound"></ha-icon>${this.labels.addSection}
        </button>
      </div>
    `;
	}
	static {
		this.styles = [Qe, o`
      :host {
        display: block;
      }
      ol {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      li {
        display: flex;
        align-items: flex-start;
        gap: 4px;
        padding: 2px 0;
      }
      li.section {
        margin-top: 12px;
      }
      li.sortable-ghost {
        opacity: 0.4;
      }
      .handle {
        flex: none;
        display: flex;
        padding: 8px 2px;
        color: var(--secondary-text-color);
        cursor: grab;
        touch-action: none;
      }
      .number {
        flex: none;
        min-width: 1.6em;
        padding-top: 9px;
        font-weight: 500;
        color: var(--primary-color);
      }
      input,
      textarea {
        flex: 1;
        min-width: 0;
        box-sizing: border-box;
        padding: 8px 10px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font: inherit;
        font-size: 15px;
        line-height: 1.4;
      }
      textarea {
        resize: none;
        overflow: hidden;
      }
      input:focus,
      textarea:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: -1px;
      }
      li.section input {
        font-weight: 500;
        border-style: dashed;
      }
      .row-actions {
        flex: none;
        display: flex;
      }
      .icon {
        display: inline-flex;
        padding: 6px;
        border: 0;
        border-radius: 50%;
        background: none;
        color: var(--secondary-text-color);
        cursor: pointer;
        --mdc-icon-size: 20px;
      }
      .icon:hover:not([disabled]) {
        background: var(--secondary-background-color);
      }
      .icon[disabled] {
        opacity: 0.3;
        cursor: default;
      }
      .add {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;
      }
      @media (max-width: 600px) {
        .icon {
          padding: 4px;
        }
      }
    `];
	}
};
customElements.get("cookbook-item-list-editor") || customElements.define("cookbook-item-list-editor", pr);
// src/format.ts
function mr(e, t) {
	if (e == null) return "";
	let n = Math.floor(e / 60), r = e % 60;
	return n && r ? t("duration_h_min", {
		h: n,
		m: r
	}) : n ? t("duration_h", { h: n }) : t("duration_min", { m: r });
}
function hr(e) {
	return e.total_time == null ? e.prep_time == null && e.cook_time == null ? null : (e.prep_time ?? 0) + (e.cook_time ?? 0) : e.total_time;
}
function gr(e, t) {
	return new Intl.DateTimeFormat(t, { dateStyle: "long" }).format(new Date(e));
}
function _r(e) {
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
// src/views/recipe-editor.ts
var vr = [
	"prep_time",
	"cook_time",
	"total_time"
];
function yr(e) {
	let t = (e) => e == null ? "" : String(e);
	return {
		name: e?.name ?? "",
		description: e?.description ?? "",
		categories: [...e?.categories ?? []],
		prep_time: t(e?.prep_time),
		cook_time: t(e?.cook_time),
		total_time: t(e?.total_time),
		servings: e?.servings ?? "",
		notes: e?.notes ?? "",
		source_url: e?.source_url ?? ""
	};
}
function br(e) {
	let t = e.trim();
	return t ? /^\d{1,5}$/.test(t) ? Number(t) : void 0 : null;
}
function xr(e) {
	let t = {};
	e.name.trim() || (t.name = "name_required");
	for (let n of vr) br(e[n]) === void 0 && (t[n] = "minutes_invalid");
	let n = e.source_url.trim();
	return n && !/^https?:\/\//i.test(n) && (t.source_url = "source_url_invalid"), t;
}
function Sr(e, t, n) {
	let r = (e) => e.trim() || null;
	return {
		name: e.name.trim(),
		description: r(e.description),
		categories: e.categories,
		prep_time: br(e.prep_time) ?? null,
		cook_time: br(e.cook_time) ?? null,
		total_time: br(e.total_time) ?? null,
		servings: r(e.servings),
		ingredients: t,
		steps: n,
		notes: r(e.notes),
		source_url: r(e.source_url)
	};
}
var Cr = class extends E {
	constructor(...e) {
		super(...e), this.form = yr(), this.ingredients = [], this.steps = [], this.errors = {}, this.loading = !1, this.notFound = !1, this.error = null, this.saving = !1, this.conflict = null, this.leaveTarget = null, this.suggestions = [], this.original = null, this.snapshot = "", this.onBeforeUnload = (e) => {
			this.dirty && e.preventDefault();
		}, this.onShortcut = (e) => {
			(e.ctrlKey || e.metaKey) && e.key === "s" && (e.preventDefault(), this.save());
		};
	}
	static {
		this.properties = {
			hass: { attribute: !1 },
			recipeId: { attribute: "recipe-id" },
			form: { state: !0 },
			ingredients: { state: !0 },
			steps: { state: !0 },
			errors: { state: !0 },
			loading: { state: !0 },
			notFound: { state: !0 },
			error: { state: !0 },
			saving: { state: !0 },
			conflict: { state: !0 },
			leaveTarget: { state: !0 },
			suggestions: { state: !0 }
		};
	}
	connectedCallback() {
		super.connectedCallback(), window.addEventListener("beforeunload", this.onBeforeUnload), window.addEventListener("keydown", this.onShortcut), this.api.categories().then((e) => this.suggestions = e.map((e) => e.name)).catch(() => void 0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), window.removeEventListener("beforeunload", this.onBeforeUnload), window.removeEventListener("keydown", this.onShortcut);
	}
	willUpdate(e) {
		e.has("recipeId") && (this.recipeId ? this.load(this.recipeId) : this.reset(null));
	}
	get api() {
		return new et(this.hass);
	}
	get t() {
		return Ue(this.hass);
	}
	currentFields() {
		return Sr(this.form, this.ingredients, this.steps);
	}
	get dirty() {
		return JSON.stringify(this.currentFields()) !== this.snapshot;
	}
	requestLeave(e) {
		this.dirty ? this.leaveTarget = e : D(e);
	}
	get backUrl() {
		return this.recipeId ? Ke(this.recipeId) : Ze();
	}
	reset(e) {
		this.original = e, this.form = yr(e), this.ingredients = e ? e.ingredients.map((e) => ({ ...e })) : [], this.steps = e ? e.steps.map((e) => ({ ...e })) : [], this.errors = {}, this.conflict = null, this.snapshot = JSON.stringify(this.currentFields());
	}
	async load(e) {
		this.loading = !0, this.notFound = !1, this.error = null;
		try {
			let t = await this.api.get(e);
			e === this.recipeId && this.reset(t);
		} catch (t) {
			if (e !== this.recipeId) return;
			$e(t) && t.code === "not_found" ? this.notFound = !0 : this.showError(t);
		} finally {
			e === this.recipeId && (this.loading = !1);
		}
	}
	showError(e) {
		let t = $e(e) ? e.message : String(e);
		this.error = this.t("error", { message: t });
	}
	setField(e, t) {
		if (this.form = {
			...this.form,
			[e]: t
		}, this.errors[e]) {
			let t = { ...this.errors };
			delete t[e], this.errors = t;
		}
	}
	async save(e = {}) {
		if (this.saving) return;
		let t = xr(this.form);
		if (this.errors = t, Object.keys(t).length) {
			await this.updateComplete, this.renderRoot.querySelector("[aria-invalid='true']")?.focus();
			return;
		}
		this.saving = !0, this.error = null;
		let n = this.currentFields();
		try {
			let t = this.original ? await this.api.update(this.original.id, n, e.overwrite ? void 0 : this.original.updated_at) : await this.api.create(n);
			this.original = t, this.snapshot = JSON.stringify(n), this.conflict = null, D(Ke(t.id), { replace: !0 });
		} catch (e) {
			if ($e(e) && e.code === "conflict" && this.original) try {
				this.conflict = { latest: await this.api.get(this.original.id) };
			} catch (e) {
				this.showError(e);
			}
			else this.showError(e);
		} finally {
			this.saving = !1;
		}
	}
	get listLabels() {
		let e = this.t, t = {
			sectionPlaceholder: e("section_placeholder"),
			addSection: e("add_section"),
			moveUp: e("move_up"),
			moveDown: e("move_down"),
			remove: e("remove_line"),
			drag: e("drag")
		};
		return {
			ingredients: {
				...t,
				itemPlaceholder: e("ingredient_placeholder"),
				addItem: e("add_ingredient")
			},
			steps: {
				...t,
				itemPlaceholder: e("step_placeholder"),
				addItem: e("add_step")
			}
		};
	}
	render() {
		let e = this.t;
		if (this.notFound) return w`<div class="message">
        <p>${e("recipe_not_found")}</p>
        <button class="btn" @click=${() => D(Ze())}>${e("back_to_list")}</button>
      </div>`;
		if (this.loading) return w`<p class="message">${e("loading")}</p>`;
		let t = this.listLabels;
		return w`
      <h1>${this.recipeId ? e("edit_recipe") : e("new_recipe")}</h1>
      ${this.conflict ? this.renderConflict(e) : T}
      ${this.error ? w`<p class="banner error" role="alert">${this.error}</p>` : T}

      <section class="card">
        ${this.renderText("name", e("name"), {
			required: !0,
			autofocus: !this.recipeId
		})}
        ${this.renderText("description", e("description"), { multiline: !0 })}
        <label class="field">
          <span class="label">${e("categories")}</span>
          <cookbook-category-input
            .value=${this.form.categories}
            .suggestions=${this.suggestions}
            .placeholder=${e("category_placeholder")}
            .removeLabel=${(t) => e("remove_category", { name: t })}
            @value-changed=${(e) => this.setField("categories", e.detail.value)}
          ></cookbook-category-input>
        </label>
        <div class="times">
          ${vr.map((t) => this.renderTime(t, e))}
          ${this.renderText("servings", e("servings"), { placeholder: e("servings_placeholder") })}
        </div>
      </section>

      <section class="card">
        <h2>${e("ingredients")}</h2>
        <cookbook-item-list-editor
          class="ingredients"
          .items=${this.ingredients}
          .labels=${t.ingredients}
          @items-changed=${(e) => this.ingredients = e.detail.items}
        ></cookbook-item-list-editor>
        <p class="muted hint">${e("editor_hint")}</p>
      </section>

      <section class="card">
        <h2>${e("steps")}</h2>
        <cookbook-item-list-editor
          class="steps"
          multiline
          numbered
          .items=${this.steps}
          .labels=${t.steps}
          @items-changed=${(e) => this.steps = e.detail.items}
        ></cookbook-item-list-editor>
      </section>

      <section class="card">
        ${this.renderText("notes", e("notes"), { multiline: !0 })}
        ${this.renderText("source_url", e("source_url"), {
			type: "url",
			placeholder: "https://"
		})}
      </section>

      <div class="bar">
        <button class="btn cancel" @click=${() => this.requestLeave(this.backUrl)}>${e("cancel")}</button>
        <button class="btn primary save" ?disabled=${this.saving} @click=${() => this.save()}>
          <ha-icon icon="mdi:content-save-outline"></ha-icon>${this.saving ? e("saving") : e("save")}
        </button>
      </div>

      <cookbook-confirm-dialog
        .open=${this.leaveTarget !== null}
        .heading=${e("leave_title")}
        .text=${e("leave_text")}
        .confirmLabel=${e("leave_confirm")}
        .cancelLabel=${e("cancel")}
        @confirm=${this.confirmLeave}
        @cancel=${() => this.leaveTarget = null}
      ></cookbook-confirm-dialog>
    `;
	}
	confirmLeave() {
		let e = this.leaveTarget ?? Ze();
		this.leaveTarget = null, this.snapshot = JSON.stringify(this.currentFields()), D(e);
	}
	renderConflict(e) {
		let t = this.conflict.latest.updated_by_name;
		return w`<div class="banner conflict" role="alert">
      <p>${t ? e("conflict_text", { name: t }) : e("conflict_text_anonymous")}</p>
      <div class="banner-actions">
        <button class="btn reload" @click=${() => this.reset(this.conflict.latest)}>${e("conflict_reload")}</button>
        <button class="btn danger overwrite" @click=${() => this.save({ overwrite: !0 })}>
          ${e("conflict_overwrite")}
        </button>
      </div>
    </div>`;
	}
	renderText(e, t, n = {}) {
		let r = this.errors[e], i = (t) => this.setField(e, t.target.value);
		return w`<label class="field">
      <span class="label">${t}${n.required ? " *" : ""}</span>
      ${n.multiline ? w`<textarea
            name=${e}
            rows="3"
            .value=${this.form[e]}
            aria-invalid=${r ? "true" : "false"}
            @input=${i}
          ></textarea>` : w`<input
            name=${e}
            type=${n.type ?? "text"}
            .value=${this.form[e]}
            placeholder=${n.placeholder ?? ""}
            ?autofocus=${n.autofocus}
            aria-invalid=${r ? "true" : "false"}
            @input=${i}
          />`}
      ${r ? w`<span class="field-error">${this.t(r)}</span>` : T}
    </label>`;
	}
	renderTime(e, t) {
		let n = "";
		if (e === "total_time" && !this.form.total_time.trim()) {
			let e = br(this.form.prep_time), r = br(this.form.cook_time);
			(e != null || r != null) && (n = t("total_auto", { value: mr((e ?? 0) + (r ?? 0), t) }));
		}
		let r = this.errors[e];
		return w`<label class="field">
      <span class="label">${t(e)} (min)</span>
      <input
        name=${e}
        inputmode="numeric"
        .value=${this.form[e]}
        placeholder=${n}
        aria-invalid=${r ? "true" : "false"}
        @input=${(t) => this.setField(e, t.target.value)}
      />
      ${r ? w`<span class="field-error">${t(r)}</span>` : T}
    </label>`;
	}
	static {
		this.styles = [Qe, o`
      :host {
        display: block;
        padding: var(--cb-gap);
        max-width: 900px;
        margin: 0 auto;
        box-sizing: border-box;
      }
      h1 {
        margin: 0 0 var(--cb-gap);
        font-size: 24px;
        font-weight: 500;
      }
      h2 {
        margin: 0 0 8px;
        font-size: 18px;
        font-weight: 500;
      }
      section {
        padding: 16px;
        margin-bottom: var(--cb-gap);
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 12px;
      }
      .label {
        font-size: 13px;
        color: var(--secondary-text-color);
      }
      .field > input,
      .field > textarea {
        box-sizing: border-box;
        width: 100%;
        padding: 9px 10px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font: inherit;
        font-size: 15px;
      }
      .field > textarea {
        resize: vertical;
      }
      .field > input:focus,
      .field > textarea:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: -1px;
      }
      [aria-invalid="true"] {
        border-color: var(--error-color) !important;
      }
      .field-error {
        font-size: 13px;
        color: var(--error-color);
      }
      .times {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 0 12px;
      }
      .hint {
        margin: 8px 0 0;
        font-size: 13px;
      }
      .banner {
        padding: 12px 16px;
        margin: 0 0 var(--cb-gap);
        border-radius: var(--cb-radius);
        border: 1px solid var(--error-color);
      }
      .banner p {
        margin: 0;
      }
      .conflict {
        border-color: var(--warning-color, #ffa600);
      }
      .banner-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;
      }
      .bar {
        position: sticky;
        z-index: 3;
        bottom: 0;
        margin: 0 calc(-1 * var(--cb-gap));
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
        background: var(--card-background-color);
        border-top: 1px solid var(--divider-color);
      }
      .btn[disabled] {
        opacity: 0.6;
        cursor: default;
      }
    `];
	}
};
customElements.get("cookbook-recipe-editor") || customElements.define("cookbook-recipe-editor", Cr);
var wr = class extends E {
	constructor(...e) {
		super(...e), this.recipes = [], this.categories = [], this.query = "", this.category = null, this.loading = !0, this.error = null, this.resultsQuery = "", this.requestId = 0;
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
		return new et(this.hass);
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
			this.resultsQuery = t, this.recipes = r, this.error = null;
		} catch (t) {
			e === this.requestId && this.showError(t);
		} finally {
			e === this.requestId && (this.loading = !1);
		}
	}
	showError(e) {
		let t = $e(e) ? e.message : String(e);
		this.error = Ue(this.hass)("error", { message: t });
	}
	syncUrl() {
		let e = new URLSearchParams();
		this.query.trim() && e.set("q", this.query.trim()), this.category && e.set("category", this.category);
		let t = e.size ? `?${e}` : "";
		Xe(t), history.replaceState(history.state, "", `${location.pathname}${t}`);
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
		e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0 || (e.preventDefault(), D(Ke(t)));
	}
	render() {
		let e = Ue(this.hass);
		return w`
      <div class="top">
      <div class="search">
        <ha-icon icon="mdi:magnify"></ha-icon>
        <input
          type="search"
          .value=${this.query}
          placeholder=${e("search_placeholder")}
          aria-label=${e("search_placeholder")}
          @input=${this.onInput}
        />
        ${this.query ? w`<button class="clear" aria-label=${e("clear_search")} @click=${this.clearSearch}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>` : T}
      </div>
      <button class="btn primary new" @click=${() => D(Je)}>
        <ha-icon icon="mdi:plus"></ha-icon><span class="new-label">${e("new_recipe")}</span>
      </button>
      </div>
      ${this.categories.length ? w`<div class="filters" role="group">
            <button
              class="btn"
              aria-pressed=${String(this.category === null)}
              @click=${() => this.selectCategory(null)}
            >
              ${e("all_categories")}
            </button>
            ${this.categories.map((e) => w`<button
                class="btn"
                data-category=${e.name}
                aria-pressed=${String(this.category?.toLowerCase() === e.name.toLowerCase())}
                @click=${() => this.selectCategory(e.name)}
              >
                ${e.name} <span class="muted">${e.count}</span>
              </button>`)}
          </div>` : T}
      ${this.error ? w`<p class="message error">${this.error}</p>` : this.renderRecipes(e)}
    `;
	}
	renderRecipes(e) {
		return this.loading && !this.recipes.length ? w`<p class="message">${e("loading")}</p>` : this.recipes.length ? w`<div class="grid">
      ${this.recipes.map((t) => {
			let n = hr(t);
			return w`<a
          class="card recipe"
          href=${Ke(t.id)}
          @click=${(e) => this.open(e, t.id)}
        >
          <div class="picture"><ha-icon icon="mdi:silverware-fork-knife"></ha-icon></div>
          <div class="body">
            <h3>${t.name}</h3>
            ${n == null ? T : w`<div class="muted time">
                  <ha-icon icon="mdi:clock-outline"></ha-icon>${mr(n, e)}
                </div>`}
            ${t.matched_ingredients?.length ? w`<ul class="matches">
                  ${t.matched_ingredients.map((e) => w`<li>
                      ${it(e, this.resultsQuery).map((e) => e.match ? w`<mark>${e.text}</mark>` : e.text)}
                    </li>`)}
                </ul>` : T}
            <div class="chips">${t.categories.map((e) => w`<span class="chip">${e}</span>`)}</div>
          </div>
        </a>`;
		})}
    </div>` : this.query.trim() || this.category ? w`<p class="message">${e("no_results")}</p>` : w`<div class="message">
            <ha-icon class="big" icon="mdi:chef-hat"></ha-icon>
            <h2>${e("no_recipes")}</h2>
            <p>${e("no_recipes_hint")}</p>
            <button class="btn primary" @click=${() => D(Je)}>
              <ha-icon icon="mdi:plus"></ha-icon>${e("new_recipe")}
            </button>
          </div>`;
	}
	static {
		this.styles = [Qe, o`
      :host {
        display: block;
        padding: var(--cb-gap);
        max-width: 1200px;
        margin: 0 auto;
        box-sizing: border-box;
      }
      .top {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .top .new {
        flex: none;
        min-height: 44px;
        border-radius: 22px;
      }
      /* Visually hidden on small screens, but kept as the button's accessible name. */
      @media (max-width: 500px) {
        .new-label {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }
      }
      .search {
        flex: 1;
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
      .matches {
        margin: 8px 0 0;
        padding: 0 0 0 18px;
        font-size: 13px;
        color: var(--secondary-text-color);
      }
      .matches li {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      mark {
        padding: 0 1px;
        border-radius: 3px;
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.2);
        color: var(--primary-text-color);
        font-weight: 500;
      }
      .big {
        --mdc-icon-size: 64px;
        color: var(--primary-color);
      }
    `];
	}
};
customElements.get("cookbook-recipe-list") || customElements.define("cookbook-recipe-list", wr);
// src/print.ts
var $ = (e) => e.replace(/[&<>"']/g, (e) => `&#${e.charCodeAt(0)};`);
function Tr(e, t) {
	return _r(e).map((e) => `${e.section ? `<h3>${$(e.section)}</h3>` : ""}<${t}>${e.items.map((e) => `<li>${$(e.text)}</li>`).join("")}</${t}>`).join("");
}
function Er(e, t, n) {
	let r = [
		["prep_time", mr(e.prep_time, t)],
		["cook_time", mr(e.cook_time, t)],
		["total_time", mr(hr(e), t)],
		["servings", e.servings ?? ""]
	].filter(([, e]) => e).map(([e, n]) => `<span><strong>${$(t(e))}</strong> ${$(n)}</span>`).join(""), i = (e, t) => t ? `<section><h2>${$(e)}</h2>${t}</section>` : "", a = (e) => e ? `<p class="text">${$(e)}</p>` : "";
	return `<!doctype html>
<html lang="${$(n)}">
<head>
<meta charset="utf-8">
<title>${$(e.name)}</title>
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
<h1>${$(e.name)}</h1>
${e.categories.length ? `<div class="categories">${$(e.categories.join(" · "))}</div>` : ""}
${r ? `<div class="meta">${r}</div>` : ""}
${a(e.description)}
${i(t("ingredients"), e.ingredients.length ? Tr(e.ingredients, "ul") : "")}
${i(t("steps"), e.steps.length ? Tr(e.steps, "ol") : "")}
${i(t("notes"), a(e.notes))}
${e.source_url ? `<p class="source">${$(e.source_url)}</p>` : ""}
</body>
</html>`;
}
function Dr(e, t, n) {
	let r = document.createElement("iframe");
	r.style.cssText = "position:fixed;width:0;height:0;border:0;visibility:hidden", r.srcdoc = Er(e, t, n), r.addEventListener("load", () => {
		let e = r.contentWindow;
		e && (e.addEventListener("afterprint", () => r.remove()), setTimeout(() => r.remove(), 6e4), e.focus(), e.print());
	}), document.body.append(r);
}
// src/views/recipe-view.ts
var Or = "cookbook:large-text", kr = (e) => `cookbook:checks:${e}`;
function Ar(e) {
	try {
		return localStorage.getItem(e);
	} catch {
		return null;
	}
}
function jr(e, t) {
	try {
		t === null ? localStorage.removeItem(e) : localStorage.setItem(e, t);
	} catch {}
}
var Mr = class e extends E {
	constructor(...e) {
		super(...e), this.recipeId = "", this.recipe = null, this.error = null, this.notFound = !1, this.checked = /* @__PURE__ */ new Set(), this.largeText = Ar(Or) === "1", this.awake = !1, this.confirmDelete = !1, this.wakeLock = null, this.onVisibilityChange = () => {
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
		this.recipe = null, this.error = null, this.notFound = !1, this.checked = new Set(JSON.parse(Ar(kr(e)) ?? "[]"));
		try {
			let t = await new et(this.hass).get(e);
			e === this.recipeId && (this.recipe = t);
		} catch (t) {
			if (e !== this.recipeId) return;
			if ($e(t) && t.code === "not_found") this.notFound = !0;
			else {
				let e = $e(t) ? t.message : String(t);
				this.error = Ue(this.hass)("error", { message: e });
			}
		}
	}
	toggleCheck(e) {
		let t = new Set(this.checked);
		t.has(e) ? t.delete(e) : t.add(e), this.checked = t, jr(kr(this.recipeId), t.size ? JSON.stringify([...t]) : null);
	}
	resetChecks() {
		this.checked = /* @__PURE__ */ new Set(), jr(kr(this.recipeId), null);
	}
	toggleLargeText() {
		this.largeText = !this.largeText, jr(Or, this.largeText ? "1" : null);
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
			await new et(this.hass).delete(this.recipeId), jr(kr(this.recipeId), null), D(Ze(), { replace: !0 });
		} catch (e) {
			let t = $e(e) ? e.message : String(e);
			this.error = Ue(this.hass)("error", { message: t });
		}
	}
	render() {
		let e = Ue(this.hass);
		return this.notFound ? w`<div class="message">
        <p>${e("recipe_not_found")}</p>
        <button class="btn" @click=${() => D(Ze())}>${e("back_to_list")}</button>
      </div>` : this.error ? w`<p class="message error">${this.error}</p>` : this.recipe ? this.renderRecipe(this.recipe, e) : w`<p class="message">${e("loading")}</p>`;
	}
	renderRecipe(t, n) {
		let r = He(this.hass), i = [
			{
				key: "prep_time",
				icon: "mdi:knife",
				value: mr(t.prep_time, n)
			},
			{
				key: "cook_time",
				icon: "mdi:pot-steam-outline",
				value: mr(t.cook_time, n)
			},
			{
				key: "total_time",
				icon: "mdi:clock-outline",
				value: mr(hr(t), n)
			},
			{
				key: "servings",
				icon: "mdi:account-group-outline",
				value: t.servings ?? ""
			}
		], a = gr(t.updated_at, r);
		return w`
      <div class="actions">
        <button class="btn" aria-pressed=${String(this.largeText)} @click=${this.toggleLargeText}>
          <ha-icon icon="mdi:format-size"></ha-icon>${n("larger_text")}
        </button>
        ${e.wakeLockSupported ? w`<button class="btn awake" aria-pressed=${String(this.awake)} @click=${this.toggleAwake}>
              <ha-icon icon="mdi:cellphone-screenshot"></ha-icon>${n("keep_awake")}
            </button>` : T}
        ${this.checked.size ? w`<button class="btn reset" @click=${this.resetChecks}>
              <ha-icon icon="mdi:checkbox-blank-off-outline"></ha-icon>${n("reset_checks")}
            </button>` : T}
        <span class="spacer"></span>
        <button class="btn primary edit" @click=${() => D(qe(t.id))}>
          <ha-icon icon="mdi:pencil"></ha-icon>${n("edit")}
        </button>
        <button class="btn print" @click=${() => Dr(t, n, r)}>
          <ha-icon icon="mdi:printer"></ha-icon>${n("print")}
        </button>
        ${this.hass.user?.is_admin ? w`<button class="btn danger delete" @click=${() => this.confirmDelete = !0}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>${n("delete")}
            </button>` : T}
      </div>

      <article class="card">
        <h1>${t.name}</h1>
        ${t.categories.length ? w`<div class="chips">${t.categories.map((e) => w`<span class="chip">${e}</span>`)}</div>` : T}
        <div class="meta">
          ${i.filter((e) => e.value).map((e) => w`<div class="meta-item">
                <ha-icon icon=${e.icon}></ha-icon>
                <div><div class="muted label">${n(e.key)}</div><div>${e.value}</div></div>
              </div>`)}
        </div>
        ${t.description ? w`<p class="text description">${t.description}</p>` : T}

        <div class="columns">
          ${t.ingredients.length ? w`<section class="ingredients">
                <h2>${n("ingredients")}</h2>
                ${this.renderItems(t.ingredients, "i")}
              </section>` : T}
          ${t.steps.length ? w`<section class="steps">
                <h2>${n("steps")}</h2>
                ${this.renderItems(t.steps, "s")}
              </section>` : T}
        </div>

        ${t.notes ? w`<section class="notes"><h2>${n("notes")}</h2><p class="text">${t.notes}</p></section>` : T}

        <footer class="muted">
          ${t.source_url ? w`<a href=${t.source_url} target="_blank" rel="noopener noreferrer">
                <ha-icon icon="mdi:open-in-new"></ha-icon>${n("view_source")}
              </a>` : T}
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
		return _r(e).map((e) => w`
        ${e.section ? w`<h3>${e.section}</h3>` : T}
        <ul class=${t === "s" ? "numbered" : ""}>
          ${e.items.map((e) => {
			let r = `${t}${n++}`, i = this.checked.has(r);
			return w`<li>
              <label class=${i ? "done" : ""}>
                <input type="checkbox" .checked=${i} @change=${() => this.toggleCheck(r)} />
                ${t === "s" ? w`<span class="number">${n}</span>` : T}
                <span class="item-text">${e.text}</span>
              </label>
            </li>`;
		})}
        </ul>
      `);
	}
	static {
		this.styles = [Qe, o`
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
customElements.get("cookbook-recipe-view") || customElements.define("cookbook-recipe-view", Mr);
// src/cookbook-panel.ts
var Nr = class extends E {
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
	back(e) {
		let t = e.name === "edit" ? Ke(e.id) : Ze(), n = this.renderRoot.querySelector("cookbook-recipe-editor");
		n ? n.requestLeave(t) : D(t);
	}
	render() {
		if (!this.hass) return T;
		let e = Ue(this.hass), t = Ge(this.route?.path ?? "");
		return w`
      <header class="toolbar">
        ${this.narrow ? w`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : T}
        ${t.name === "list" ? T : w`<button class="icon-btn back" aria-label=${e("back")} @click=${() => this.back(t)}>
              <ha-icon icon="mdi:arrow-left"></ha-icon>
            </button>`}
        <div class="title">Cookbook</div>
      </header>
      <main>
        ${t.name === "list" ? w`<cookbook-recipe-list .hass=${this.hass}></cookbook-recipe-list>` : t.name === "recipe" ? w`<cookbook-recipe-view .hass=${this.hass} .recipeId=${t.id}></cookbook-recipe-view>` : t.name === "new" ? w`<cookbook-recipe-editor .hass=${this.hass}></cookbook-recipe-editor>` : t.name === "edit" ? w`<cookbook-recipe-editor .hass=${this.hass} .recipeId=${t.id}></cookbook-recipe-editor>` : w`<div class="message">
                <p>${e("page_not_found")}</p>
                <button class="btn" @click=${() => D(We)}>${e("back_to_list")}</button>
              </div>`}
      </main>
    `;
	}
	static {
		this.styles = [Qe, o`
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
customElements.get("cookbook-panel") || customElements.define("cookbook-panel", Nr);
