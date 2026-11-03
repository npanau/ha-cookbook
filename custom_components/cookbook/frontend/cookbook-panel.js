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
	servings: "Serves",
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
	leave_confirm: "Leave",
	servings_unit: "Unit",
	servings_unit_default: "people",
	servings_unit_suggestions: "people,servings,pieces,portions,ramekins",
	servings_invalid: "Enter a whole number between 1 and 1000.",
	fewer_servings: "One less",
	more_servings: "One more",
	scaled_notice: "Quantities adapted for {count} {unit} (recipe for {original})",
	scaled_reset: "Back to {original}"
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
		servings: "Pour",
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
		leave_confirm: "Quitter",
		servings_unit: "Unité",
		servings_unit_default: "personnes",
		servings_unit_suggestions: "personnes,parts,pièces,portions,ramequins,verrines",
		servings_invalid: "Indiquez un nombre entier entre 1 et 1000.",
		fewer_servings: "Une de moins",
		more_servings: "Une de plus",
		scaled_notice: "Quantités adaptées pour {count} {unit} (recette pour {original})",
		scaled_reset: "Revenir à {original}"
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
function Bt() {
	return document.scrollingElement || document.documentElement;
}
function L(e, t, n, r, i) {
	if (e.getBoundingClientRect || e === window) {
		var a, o, s, c, l, u, d;
		if (e !== window && e.parentNode && e !== Bt() ? (a = e.getBoundingClientRect(), o = a.top, s = a.left, c = a.bottom, l = a.right, u = a.height, d = a.width) : (o = 0, s = 0, c = window.innerHeight, l = window.innerWidth, u = window.innerHeight, d = window.innerWidth), (t || n) && e !== window && (i ||= e.parentNode, !j)) do
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
function Vt(e, t, n) {
	for (var r = Kt(e, !0), i = L(e)[t]; r;) {
		var a = L(r)[n], o = void 0;
		if (o = n === "top" || n === "left" ? i >= a : i <= a, !o) return r;
		if (r === Bt()) break;
		r = Kt(r, !1);
	}
	return !1;
}
function Ht(e, t, n, r) {
	for (var i = 0, a = 0, o = e.children; a < o.length;) {
		if (o[a].style.display !== "none" && o[a] !== Z.ghost && (r || o[a] !== Z.dragged) && P(o[a], n.draggable, e, !1)) {
			if (i === t) return o[a];
			i++;
		}
		a++;
	}
	return null;
}
function Ut(e, t) {
	for (var n = e.lastElementChild; n && (n === Z.ghost || I(n, "display") === "none" || t && !Ft(n, t));) n = n.previousElementSibling;
	return n || null;
}
function R(e, t) {
	var n = 0;
	if (!e || !e.parentNode) return -1;
	for (; e = e.previousElementSibling;) e.nodeName.toUpperCase() !== "TEMPLATE" && e !== Z.clone && (!t || Ft(e, t)) && n++;
	return n;
}
function Wt(e) {
	var t = 0, n = 0, r = Bt();
	if (e) do {
		var i = Rt(e), a = i.a, o = i.d;
		t += e.scrollLeft * a, n += e.scrollTop * o;
	} while (e !== r && (e = e.parentNode));
	return [t, n];
}
function Gt(e, t) {
	for (var n in e) if (e.hasOwnProperty(n)) {
		for (var r in t) if (t.hasOwnProperty(r) && t[r] === e[n][r]) return Number(n);
	}
	return -1;
}
function Kt(e, t) {
	if (!e || !e.getBoundingClientRect) return Bt();
	var n = e, r = !1;
	do
		if (n.clientWidth < n.scrollWidth || n.clientHeight < n.scrollHeight) {
			var i = I(n);
			if (n.clientWidth < n.scrollWidth && (i.overflowX == "auto" || i.overflowX == "scroll") || n.clientHeight < n.scrollHeight && (i.overflowY == "auto" || i.overflowY == "scroll")) {
				if (!n.getBoundingClientRect || n === document.body) return Bt();
				if (r || t) return n;
				r = !0;
			}
		}
	while (n = n.parentNode);
	return Bt();
}
function qt(e, t) {
	if (e && t) for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
	return e;
}
function Jt(e, t) {
	return Math.round(e.top) === Math.round(t.top) && Math.round(e.left) === Math.round(t.left) && Math.round(e.height) === Math.round(t.height) && Math.round(e.width) === Math.round(t.width);
}
var Yt;
function Xt(e, t) {
	return function() {
		if (!Yt) {
			var n = arguments, r = this;
			n.length === 1 ? e.call(r, n[0]) : e.apply(r, n), Yt = setTimeout(function() {
				Yt = void 0;
			}, t);
		}
	};
}
function Zt(e, t, n) {
	e.scrollLeft += t, e.scrollTop += n;
}
function Qt(e) {
	var t = window.Polymer, n = window.jQuery || window.Zepto;
	return t && t.dom ? t.dom(e).cloneNode(!0) : n ? n(e).clone(!0)[0] : e.cloneNode(!0);
}
function $t(e, t, n) {
	var r = {};
	return Array.from(e.children).forEach(function(i) {
		if (P(i, t.draggable, e, !1) && !i.animated && i !== n) {
			var a = L(i);
			r.left = Math.min(r.left ?? Infinity, a.left), r.top = Math.min(r.top ?? Infinity, a.top), r.right = Math.max(r.right ?? -Infinity, a.right), r.bottom = Math.max(r.bottom ?? -Infinity, a.bottom);
		}
	}), r.width = r.right - r.left, r.height = r.bottom - r.top, r.x = r.left, r.y = r.top, r;
}
var z = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function en() {
	var e = [], t;
	return {
		captureAnimationState: function() {
			e = [], this.options.animation && [].slice.call(this.el.children).forEach(function(t) {
				if (I(t, "display") !== "none" && t !== Z.ghost) {
					e.push({
						target: t,
						rect: L(t)
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
			e.splice(Gt(e, { target: t }), 1);
		},
		animateAll: function(n) {
			var r = this;
			if (!this.options.animation) clearTimeout(t), typeof n == "function" && n();
			else {
				var i = !1, a = 0;
				e.forEach(function(e) {
					var t = 0, n = e.target, o = n.fromRect, s = L(n), c = n.prevFromRect, l = n.prevToRect, u = e.rect, d = Rt(n, !0);
					d && (s.top -= d.f, s.left -= d.e), n.toRect = s, n.thisAnimationDuration && Jt(c, s) && !Jt(o, s) && (u.top - s.top) / (u.left - s.left) === (o.top - s.top) / (o.left - s.left) && (t = nn(u, c, l, r.options)), Jt(s, o) || (n.prevFromRect = o, n.prevToRect = s, t ||= r.options.animation, r.animate(n, u, s, t)), t && (i = !0, a = Math.max(a, t), clearTimeout(n.animationResetTimer), n.animationResetTimer = setTimeout(function() {
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
				e.animatingX = !!s, e.animatingY = !!c, I(e, "transform", "translate3d(" + s + "px," + c + "px,0)"), this.forRepaintDummy = tn(e), I(e, "transition", "transform " + r + "ms" + (this.options.easing ? " " + this.options.easing : "")), I(e, "transform", "translate3d(0,0,0)"), typeof e.animated == "number" && clearTimeout(e.animated), e.animated = setTimeout(function() {
					I(e, "transition", ""), I(e, "transform", ""), e.animated = !1, e.animatingX = !1, e.animatingY = !1;
				}, r);
			}
		}
	};
}
function tn(e) {
	return e.offsetWidth;
}
function nn(e, t, n, r) {
	return Math.sqrt((t.top - e.top) ** 2 + (t.left - e.left) ** 2) / Math.sqrt((t.top - n.top) ** 2 + (t.left - n.left) ** 2) * r.animation;
}
var rn = [], an = { initializeByDefault: !0 }, on = {
	mount: function(e) {
		for (var t in an) an.hasOwnProperty(t) && !(t in e) && (e[t] = an[t]);
		rn.forEach(function(t) {
			if (t.pluginName === e.pluginName) throw `Sortable: Cannot mount plugin ${e.pluginName} more than once`;
		}), rn.push(e);
	},
	pluginEvent: function(e, t, n) {
		var r = this;
		this.eventCanceled = !1, n.cancel = function() {
			r.eventCanceled = !0;
		};
		var i = e + "Global";
		rn.forEach(function(r) {
			t[r.pluginName] && (t[r.pluginName][i] && t[r.pluginName][i](k({ sortable: t }, n)), t.options[r.pluginName] && t[r.pluginName][e] && t[r.pluginName][e](k({ sortable: t }, n)));
		});
	},
	initializePlugins: function(e, t, n, r) {
		for (var i in rn.forEach(function(r) {
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
		return rn.forEach(function(r) {
			typeof r.eventProperties == "function" && O(n, r.eventProperties.call(t[r.pluginName], e));
		}), n;
	},
	modifyOption: function(e, t, n) {
		var r;
		return rn.forEach(function(i) {
			e[i.pluginName] && i.optionListeners && typeof i.optionListeners[t] == "function" && (r = i.optionListeners[t].call(e[i.pluginName], n));
		}), r;
	}
};
function sn(e) {
	var t = e.sortable, n = e.rootEl, r = e.name, i = e.targetEl, a = e.cloneEl, o = e.toEl, s = e.fromEl, c = e.oldIndex, l = e.newIndex, u = e.oldDraggableIndex, d = e.newDraggableIndex, f = e.originalEvent, p = e.putSortable, m = e.extraEventProperties;
	if (t ||= n && n[z], t) {
		var h, g = t.options, _ = "on" + r.charAt(0).toUpperCase() + r.substr(1);
		window.CustomEvent && !j && !kt ? h = new CustomEvent(r, {
			bubbles: !0,
			cancelable: !0
		}) : (h = document.createEvent("Event"), h.initEvent(r, !0, !0)), h.to = o || n, h.from = s || n, h.item = i || n, h.clone = a, h.oldIndex = c, h.newIndex = l, h.oldDraggableIndex = u, h.newDraggableIndex = d, h.originalEvent = f, h.pullMode = p ? p.lastPutMode : void 0;
		var ee = k(k({}, m), on.getEventProperties(r, t));
		for (var v in ee) h[v] = ee[v];
		n && n.dispatchEvent(h), g[_] && g[_].call(t, h);
	}
}
var cn = ["evt"], B = function(e, t) {
	var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, r = n.evt, i = Ct(n, cn);
	on.pluginEvent.bind(Z)(e, t, k({
		dragEl: H,
		parentEl: U,
		ghostEl: W,
		rootEl: G,
		nextEl: ln,
		lastDownEl: un,
		cloneEl: K,
		cloneHidden: dn,
		dragStarted: wn,
		putSortable: J,
		activeSortable: Z.active,
		originalEvent: r,
		oldIndex: fn,
		oldDraggableIndex: pn,
		newIndex: q,
		newDraggableIndex: mn,
		hideGhostForTarget: Hn,
		unhideGhostForTarget: Un,
		cloneNowHidden: function() {
			dn = !0;
		},
		cloneNowShown: function() {
			dn = !1;
		},
		dispatchSortableEvent: function(e) {
			V({
				sortable: t,
				name: e,
				originalEvent: r
			});
		}
	}, i));
};
function V(e) {
	sn(k({
		putSortable: J,
		cloneEl: K,
		targetEl: H,
		rootEl: G,
		oldIndex: fn,
		oldDraggableIndex: pn,
		newIndex: q,
		newDraggableIndex: mn
	}, e));
}
var H, U, W, G, ln, un, K, dn, fn, q, pn, mn, hn, J, gn = !1, _n = !1, vn = [], yn, Y, bn, xn, Sn, Cn, wn, Tn, En, Dn = !1, On = !1, kn, X, An = [], jn = !1, Mn = [], Nn = typeof document < "u", Pn = Mt, Fn = kt || j ? "cssFloat" : "float", In = Nn && !Nt && !Mt && "draggable" in document.createElement("div"), Ln = function() {
	if (Nn) {
		if (j) return !1;
		var e = document.createElement("x");
		return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
	}
}(), Rn = function(e, t) {
	var n = I(e), r = parseInt(n.width) - parseInt(n.paddingLeft) - parseInt(n.paddingRight) - parseInt(n.borderLeftWidth) - parseInt(n.borderRightWidth), i = Ht(e, 0, t), a = Ht(e, 1, t), o = i && I(i), s = a && I(a), c = o && parseInt(o.marginLeft) + parseInt(o.marginRight) + L(i).width, l = s && parseInt(s.marginLeft) + parseInt(s.marginRight) + L(a).width;
	if (n.display === "flex") return n.flexDirection === "column" || n.flexDirection === "column-reverse" ? "vertical" : "horizontal";
	if (n.display === "grid") return n.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
	if (i && o.float && o.float !== "none") {
		var u = o.float === "left" ? "left" : "right";
		return a && (s.clear === "both" || s.clear === u) ? "vertical" : "horizontal";
	}
	return i && (o.display === "block" || o.display === "flex" || o.display === "table" || o.display === "grid" || c >= r && n[Fn] === "none" || a && n[Fn] === "none" && c + l > r) ? "vertical" : "horizontal";
}, zn = function(e, t, n) {
	var r = n ? e.left : e.top, i = n ? e.right : e.bottom, a = n ? e.width : e.height, o = n ? t.left : t.top, s = n ? t.right : t.bottom, c = n ? t.width : t.height;
	return r === o || i === s || r + a / 2 === o + c / 2;
}, Bn = function(e, t) {
	var n;
	return vn.some(function(r) {
		var i = r[z].options.emptyInsertThreshold;
		if (i && !Ut(r)) {
			var a = L(r), o = e >= a.left - i && e <= a.right + i, s = t >= a.top - i && t <= a.bottom + i;
			if (o && s) return n = r;
		}
	}), n;
}, Vn = function(e) {
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
}, Hn = function() {
	!Ln && W && I(W, "display", "none");
}, Un = function() {
	!Ln && W && I(W, "display", "");
};
Nn && !Nt && document.addEventListener("click", function(e) {
	if (_n) return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), _n = !1, !1;
}, !0);
var Wn = function(e) {
	if (H) {
		e = e.touches ? e.touches[0] : e;
		var t = Bn(e.clientX, e.clientY);
		if (t) {
			var n = {};
			for (var r in e) e.hasOwnProperty(r) && (n[r] = e[r]);
			n.target = n.rootEl = t, n.preventDefault = void 0, n.stopPropagation = void 0, t[z]._onDragOver(n);
		}
	}
}, Gn = function(e) {
	H && H.parentNode[z]._isOutsideThisEl(e.target);
};
function Z(e, t) {
	if (!(e && e.nodeType && e.nodeType === 1)) throw `Sortable: \`el\` must be an HTMLElement, not ${{}.toString.call(e)}`;
	this.el = e, this.options = t = O({}, t), e[z] = this;
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
			return Rn(e, this.options);
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
		supportPointer: Z.supportPointer !== !1 && "PointerEvent" in window && (!jt || Mt),
		emptyInsertThreshold: 5
	};
	for (var r in on.initializePlugins(this, e, n), n) !(r in t) && (t[r] = n[r]);
	for (var i in Vn(t), this) i.charAt(0) === "_" && typeof this[i] == "function" && (this[i] = this[i].bind(this));
	this.nativeDraggable = !t.forceFallback && In, this.nativeDraggable && (this.options.touchStartThreshold = 1), t.supportPointer ? M(e, "pointerdown", this._onTapStart) : (M(e, "mousedown", this._onTapStart), M(e, "touchstart", this._onTapStart)), this.nativeDraggable && (M(e, "dragover", this), M(e, "dragenter", this)), vn.push(this.el), t.store && t.store.get && this.sort(t.store.get(this) || []), O(this, en());
}
Z.prototype = {
	constructor: Z,
	_isOutsideThisEl: function(e) {
		!this.el.contains(e) && e !== this.el && (Tn = null);
	},
	_getDirection: function(e, t) {
		return typeof this.options.direction == "function" ? this.options.direction.call(this, e, t, H) : this.options.direction;
	},
	_onTapStart: function(e) {
		if (e.cancelable) {
			var t = this, n = this.el, r = this.options, i = r.preventOnFilter, a = e.type, o = e.touches && e.touches[0] || e.pointerType && e.pointerType === "touch" && e, s = (o || e).target, c = e.target.shadowRoot && (e.path && e.path[0] || e.composedPath && e.composedPath()[0]) || s, l = r.filter;
			if (tr(n), !H && !(/mousedown|pointerdown/.test(a) && e.button !== 0 || r.disabled) && !c.isContentEditable && !(!this.nativeDraggable && jt && s && s.tagName.toUpperCase() === "SELECT") && (s = P(s, r.draggable, n, !1), !(s && s.animated) && un !== s)) {
				if (fn = R(s), pn = R(s, r.draggable), typeof l == "function") {
					if (l.call(this, e, s, this)) {
						V({
							sortable: t,
							rootEl: c,
							name: "filter",
							targetEl: s,
							toEl: n,
							fromEl: n
						}), B("filter", t, { evt: e }), i && e.preventDefault();
						return;
					}
				} else if (l && (l = l.split(",").some(function(r) {
					if (r = P(c, r.trim(), n, !1), r) return V({
						sortable: t,
						rootEl: r,
						name: "filter",
						targetEl: s,
						fromEl: n,
						toEl: n
					}), B("filter", t, { evt: e }), !0;
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
		if (n && !H && n.parentNode === i) {
			var c = L(n);
			if (G = i, H = n, U = H.parentNode, ln = H.nextSibling, un = n, hn = a.group, Z.dragged = H, yn = {
				target: H,
				clientX: (t || e).clientX,
				clientY: (t || e).clientY
			}, Sn = yn.clientX - c.left, Cn = yn.clientY - c.top, this._lastX = (t || e).clientX, this._lastY = (t || e).clientY, H.style["will-change"] = "all", s = function() {
				B("delayEnded", r, { evt: e }), Z.eventCanceled ? r._onDrop() : (r._disableDelayedDragEvents(), !At && r.nativeDraggable && (H.draggable = !0), r._triggerDragStart(e, t), V({
					sortable: r,
					name: "choose",
					originalEvent: e
				}), F(H, a.chosenClass, !0));
			}, a.ignore.split(",").forEach(function(e) {
				zt(H, e.trim(), Jn);
			}), M(o, "dragover", Wn), M(o, "mousemove", Wn), M(o, "touchmove", Wn), a.supportPointer ? (M(o, "pointerup", r._onDrop), !this.nativeDraggable && M(o, "pointercancel", r._onDrop)) : (M(o, "mouseup", r._onDrop), M(o, "touchend", r._onDrop), M(o, "touchcancel", r._onDrop)), At && this.nativeDraggable && (this.options.touchStartThreshold = 4, H.draggable = !0), B("delayStart", this, { evt: e }), a.delay && (!a.delayOnTouchOnly || t) && (!this.nativeDraggable || !(kt || j))) {
				if (Z.eventCanceled) {
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
		H && Jn(H), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
	},
	_disableDelayedDragEvents: function() {
		var e = this.el.ownerDocument;
		N(e, "mouseup", this._disableDelayedDrag), N(e, "touchend", this._disableDelayedDrag), N(e, "touchcancel", this._disableDelayedDrag), N(e, "pointerup", this._disableDelayedDrag), N(e, "pointercancel", this._disableDelayedDrag), N(e, "mousemove", this._delayedDragTouchMoveHandler), N(e, "touchmove", this._delayedDragTouchMoveHandler), N(e, "pointermove", this._delayedDragTouchMoveHandler);
	},
	_triggerDragStart: function(e, t) {
		t ||= e.pointerType == "touch" && e, !this.nativeDraggable || t ? this.options.supportPointer ? M(document, "pointermove", this._onTouchMove) : t ? M(document, "touchmove", this._onTouchMove) : M(document, "mousemove", this._onTouchMove) : (M(H, "dragend", this), M(G, "dragstart", this._onDragStart));
		try {
			document.selection ? nr(function() {
				document.selection.empty();
			}) : window.getSelection().removeAllRanges();
		} catch {}
	},
	_dragStarted: function(e, t) {
		if (gn = !1, G && H) {
			B("dragStarted", this, { evt: t }), this.nativeDraggable && M(document, "dragover", Gn);
			var n = this.options;
			!e && F(H, n.dragClass, !1), F(H, n.ghostClass, !0), Z.active = this, e && this._appendGhost(), V({
				sortable: this,
				name: "start",
				originalEvent: t
			});
		} else this._nulling();
	},
	_emulateDragOver: function() {
		if (Y) {
			this._lastX = Y.clientX, this._lastY = Y.clientY, Hn();
			for (var e = document.elementFromPoint(Y.clientX, Y.clientY), t = e; e && e.shadowRoot && (e = e.shadowRoot.elementFromPoint(Y.clientX, Y.clientY), e !== t);) t = e;
			if (H.parentNode[z]._isOutsideThisEl(e), t) do {
				if (t[z]) {
					var n = void 0;
					if (n = t[z]._onDragOver({
						clientX: Y.clientX,
						clientY: Y.clientY,
						target: e,
						rootEl: t
					}), n && !this.options.dragoverBubble) break;
				}
				e = t;
			} while (t = It(t));
			Un();
		}
	},
	_onTouchMove: function(e) {
		if (yn) {
			var t = this.options, n = t.fallbackTolerance, r = t.fallbackOffset, i = e.touches ? e.touches[0] : e, a = W && Rt(W, !0), o = W && a && a.a, s = W && a && a.d, c = Pn && X && Wt(X), l = (i.clientX - yn.clientX + r.x) / (o || 1) + (c ? c[0] - An[0] : 0) / (o || 1), u = (i.clientY - yn.clientY + r.y) / (s || 1) + (c ? c[1] - An[1] : 0) / (s || 1);
			if (!Z.active && !gn) {
				if (n && Math.max(Math.abs(i.clientX - this._lastX), Math.abs(i.clientY - this._lastY)) < n) return;
				this._onDragStart(e, !0);
			}
			if (W) {
				a ? (a.e += l - (bn || 0), a.f += u - (xn || 0)) : a = {
					a: 1,
					b: 0,
					c: 0,
					d: 1,
					e: l,
					f: u
				};
				var d = `matrix(${a.a},${a.b},${a.c},${a.d},${a.e},${a.f})`;
				I(W, "webkitTransform", d), I(W, "mozTransform", d), I(W, "msTransform", d), I(W, "transform", d), bn = l, xn = u, Y = i;
			}
			e.cancelable && e.preventDefault();
		}
	},
	_appendGhost: function() {
		if (!W) {
			var e = this.options.fallbackOnBody ? document.body : G, t = L(H, !0, Pn, !0, e), n = this.options;
			if (Pn) {
				for (X = e; I(X, "position") === "static" && I(X, "transform") === "none" && X !== document;) X = X.parentNode;
				X !== document.body && X !== document.documentElement ? (X === document && (X = Bt()), t.top += X.scrollTop, t.left += X.scrollLeft) : X = Bt(), An = Wt(X);
			}
			W = H.cloneNode(!0), F(W, n.ghostClass, !1), F(W, n.fallbackClass, !0), F(W, n.dragClass, !0), I(W, "transition", ""), I(W, "transform", ""), I(W, "box-sizing", "border-box"), I(W, "margin", 0), I(W, "top", t.top), I(W, "left", t.left), I(W, "width", t.width), I(W, "height", t.height), I(W, "opacity", "0.8"), I(W, "position", Pn ? "absolute" : "fixed"), I(W, "zIndex", "100000"), I(W, "pointerEvents", "none"), Z.ghost = W, e.appendChild(W), I(W, "transform-origin", Sn / parseInt(W.style.width) * 100 + "% " + Cn / parseInt(W.style.height) * 100 + "%");
		}
	},
	_onDragStart: function(e, t) {
		var n = this, r = e.dataTransfer, i = n.options;
		B("dragStart", this, { evt: e }), Z.eventCanceled ? this._onDrop() : (B("setupClone", this), Z.eventCanceled || (K = Qt(H), K.removeAttribute("id"), K.draggable = !1, K.style["will-change"] = "", this._hideClone(), F(K, this.options.chosenClass, !1), Z.clone = K), n.cloneId = nr(function() {
			B("clone", n), Z.eventCanceled || (n.options.removeCloneOnHide || G.insertBefore(K, H), n._hideClone(), V({
				sortable: n,
				name: "clone"
			}));
		}), !t && F(H, i.dragClass, !0), t ? (_n = !0, n._loopId = setInterval(n._emulateDragOver, 50)) : (N(document, "mouseup", n._onDrop), N(document, "touchend", n._onDrop), N(document, "touchcancel", n._onDrop), r && (r.effectAllowed = "move", i.setData && i.setData.call(n, r, H)), M(document, "drop", n), I(H, "transform", "translateZ(0)")), gn = !0, n._dragStartId = nr(n._dragStarted.bind(n, t, e)), M(document, "selectstart", n), wn = !0, window.getSelection().removeAllRanges(), jt && I(document.body, "user-select", "none"));
	},
	_onDragOver: function(e) {
		var t = this.el, n = e.target, r, i, a, o = this.options, s = o.group, c = Z.active, l = hn === s, u = o.sort, d = J || c, f, p = this, m = !1;
		if (jn) return;
		function h(o, s) {
			B(o, p, k({
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
					return qn(G, t, H, r, n, L(n), e, i);
				},
				changed: ee
			}, s));
		}
		function g() {
			h("dragOverAnimationCapture"), p.captureAnimationState(), p !== d && d.captureAnimationState();
		}
		function _(r) {
			return h("dragOverCompleted", { insertion: r }), r && (l ? c._hideClone() : c._showClone(p), p !== d && (F(H, J ? J.options.ghostClass : c.options.ghostClass, !1), F(H, o.ghostClass, !0)), J !== p && p !== Z.active ? J = p : p === Z.active && J && (J = null), d === p && (p._ignoreWhileAnimating = n), p.animateAll(function() {
				h("dragOverAnimationComplete"), p._ignoreWhileAnimating = null;
			}), p !== d && (d.animateAll(), d._ignoreWhileAnimating = null)), (n === H && !H.animated || n === t && !n.animated) && (Tn = null), !o.dragoverBubble && !e.rootEl && n !== document && (H.parentNode[z]._isOutsideThisEl(e.target), !r && Wn(e)), !o.dragoverBubble && e.stopPropagation && e.stopPropagation(), m = !0;
		}
		function ee() {
			q = R(H), mn = R(H, o.draggable), V({
				sortable: p,
				name: "change",
				toEl: t,
				newIndex: q,
				newDraggableIndex: mn,
				originalEvent: e
			});
		}
		if (e.preventDefault !== void 0 && e.cancelable && e.preventDefault(), n = P(n, o.draggable, t, !0), h("dragOver"), Z.eventCanceled) return m;
		if (H.contains(e.target) || n.animated && n.animatingX && n.animatingY || p._ignoreWhileAnimating === n) return _(!1);
		if (_n = !1, c && !o.disabled && (l ? u || (a = U !== G) : J === this || (this.lastPutMode = hn.checkPull(this, c, H, e)) && s.checkPut(this, c, H, e))) {
			if (f = this._getDirection(e, n) === "vertical", r = L(H), h("dragOverValid"), Z.eventCanceled) return m;
			if (a) return U = G, g(), this._hideClone(), h("revert"), Z.eventCanceled || (ln ? G.insertBefore(H, ln) : G.appendChild(H)), _(!0);
			var v = Ut(t, o.draggable);
			if (!v || Zn(e, f, this) && !v.animated) {
				if (v === H) return _(!1);
				if (v && t === e.target && (n = v), n && (i = L(n)), qn(G, t, H, r, n, i, e, !!n) !== !1) return g(), v && v.nextSibling ? t.insertBefore(H, v.nextSibling) : t.appendChild(H), U = t, ee(), _(!0);
			} else if (v && Xn(e, f, this)) {
				var te = Ht(t, 0, o, !0);
				if (te === H) return _(!1);
				if (n = te, i = L(n), qn(G, t, H, r, n, i, e, !1) !== !1) return g(), t.insertBefore(H, te), U = t, ee(), _(!0);
			} else if (n.parentNode === t) {
				i = L(n);
				var y = 0, ne, re = H.parentNode !== t, ie = !zn(H.animated && H.toRect || r, n.animated && n.toRect || i, f), ae = f ? "top" : "left", b = Vt(n, "top", "top") || Vt(H, "top", "top"), oe = b ? b.scrollTop : void 0;
				Tn !== n && (ne = i[ae], Dn = !1, On = !ie && o.invertSwap || re), y = Qn(e, n, i, f, ie ? 1 : o.swapThreshold, o.invertedSwapThreshold == null ? o.swapThreshold : o.invertedSwapThreshold, On, Tn === n);
				var x;
				if (y !== 0) {
					var S = R(H);
					do
						S -= y, x = U.children[S];
					while (x && (I(x, "display") === "none" || x === W));
				}
				if (y === 0 || x === n) return _(!1);
				Tn = n, En = y;
				var se = n.nextElementSibling, ce = !1;
				ce = y === 1;
				var C = qn(G, t, H, r, n, i, e, ce);
				if (C !== !1) return (C === 1 || C === -1) && (ce = C === 1), jn = !0, setTimeout(Yn, 30), g(), ce && !se ? t.appendChild(H) : n.parentNode.insertBefore(H, ce ? se : n), b && Zt(b, 0, oe - b.scrollTop), U = H.parentNode, ne !== void 0 && !On && (kn = Math.abs(ne - L(n)[ae])), ee(), _(!0);
			}
			if (t.contains(H)) return _(!1);
		}
		return !1;
	},
	_ignoreWhileAnimating: null,
	_offMoveEvents: function() {
		N(document, "mousemove", this._onTouchMove), N(document, "touchmove", this._onTouchMove), N(document, "pointermove", this._onTouchMove), N(document, "dragover", Wn), N(document, "mousemove", Wn), N(document, "touchmove", Wn);
	},
	_offUpEvents: function() {
		var e = this.el.ownerDocument;
		N(e, "mouseup", this._onDrop), N(e, "touchend", this._onDrop), N(e, "pointerup", this._onDrop), N(e, "pointercancel", this._onDrop), N(e, "touchcancel", this._onDrop), N(document, "selectstart", this);
	},
	_onDrop: function(e) {
		var t = this.el, n = this.options;
		q = R(H), mn = R(H, n.draggable), B("drop", this, { evt: e }), U = H && H.parentNode, q = R(H), mn = R(H, n.draggable), Z.eventCanceled || (gn = !1, On = !1, Dn = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), rr(this.cloneId), rr(this._dragStartId), this.nativeDraggable && (N(document, "drop", this), N(t, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), jt && I(document.body, "user-select", ""), I(H, "transform", ""), e && (wn && (e.cancelable && e.preventDefault(), !n.dropBubble && e.stopPropagation()), W && W.parentNode && W.parentNode.removeChild(W), (G === U || J && J.lastPutMode !== "clone") && K && K.parentNode && K.parentNode.removeChild(K), H && (this.nativeDraggable && N(H, "dragend", this), Jn(H), H.style["will-change"] = "", wn && !gn && F(H, J ? J.options.ghostClass : this.options.ghostClass, !1), F(H, this.options.chosenClass, !1), V({
			sortable: this,
			name: "unchoose",
			toEl: U,
			newIndex: null,
			newDraggableIndex: null,
			originalEvent: e
		}), G === U ? q !== fn && q >= 0 && (V({
			sortable: this,
			name: "update",
			toEl: U,
			originalEvent: e
		}), V({
			sortable: this,
			name: "sort",
			toEl: U,
			originalEvent: e
		})) : (q >= 0 && (V({
			rootEl: U,
			name: "add",
			toEl: U,
			fromEl: G,
			originalEvent: e
		}), V({
			sortable: this,
			name: "remove",
			toEl: U,
			originalEvent: e
		}), V({
			rootEl: U,
			name: "sort",
			toEl: U,
			fromEl: G,
			originalEvent: e
		}), V({
			sortable: this,
			name: "sort",
			toEl: U,
			originalEvent: e
		})), J && J.save()), Z.active && ((q == null || q === -1) && (q = fn, mn = pn), V({
			sortable: this,
			name: "end",
			toEl: U,
			originalEvent: e
		}), this.save())))), this._nulling();
	},
	_nulling: function() {
		B("nulling", this), G = H = U = W = ln = K = un = dn = yn = Y = wn = q = mn = fn = pn = Tn = En = J = hn = Z.dragged = Z.ghost = Z.clone = Z.active = null;
		var e = this.el;
		Mn.forEach(function(t) {
			e.contains(t) && (t.checked = !0);
		}), Mn.length = bn = xn = 0;
	},
	handleEvent: function(e) {
		switch (e.type) {
			case "drop":
			case "dragend":
				this._onDrop(e);
				break;
			case "dragenter":
			case "dragover":
				H && (this._onDragOver(e), Kn(e));
				break;
			case "selectstart": e.preventDefault();
		}
	},
	toArray: function() {
		for (var e = [], t, n = this.el.children, r = 0, i = n.length, a = this.options; r < i; r++) t = n[r], P(t, a.draggable, this.el, !1) && e.push(t.getAttribute(a.dataIdAttr) || er(t));
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
		var r = on.modifyOption(this, e, t);
		n[e] = r === void 0 ? t : r, e === "group" && Vn(n);
	},
	destroy: function() {
		B("destroy", this);
		var e = this.el;
		e[z] = null, N(e, "mousedown", this._onTapStart), N(e, "touchstart", this._onTapStart), N(e, "pointerdown", this._onTapStart), this.nativeDraggable && (N(e, "dragover", this), N(e, "dragenter", this)), Array.prototype.forEach.call(e.querySelectorAll("[draggable]"), function(e) {
			e.removeAttribute("draggable");
		}), this._onDrop(), this._disableDelayedDragEvents(), vn.splice(vn.indexOf(this.el), 1), this.el = e = null;
	},
	_hideClone: function() {
		if (!dn) {
			if (B("hideClone", this), Z.eventCanceled) return;
			I(K, "display", "none"), this.options.removeCloneOnHide && K.parentNode && K.parentNode.removeChild(K), dn = !0;
		}
	},
	_showClone: function(e) {
		if (e.lastPutMode !== "clone") this._hideClone();
		else if (dn) {
			if (B("showClone", this), Z.eventCanceled) return;
			H.parentNode == G && !this.options.group.revertClone ? G.insertBefore(K, H) : ln ? G.insertBefore(K, ln) : G.appendChild(K), this.options.group.revertClone && this.animate(H, K), I(K, "display", ""), dn = !1;
		}
	}
};
function Kn(e) {
	e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function qn(e, t, n, r, i, a, o, s) {
	var c, l = e[z], u = l.options.onMove, d;
	return window.CustomEvent && !j && !kt ? c = new CustomEvent("move", {
		bubbles: !0,
		cancelable: !0
	}) : (c = document.createEvent("Event"), c.initEvent("move", !0, !0)), c.to = t, c.from = e, c.dragged = n, c.draggedRect = r, c.related = i || t, c.relatedRect = a || L(t), c.willInsertAfter = s, c.originalEvent = o, e.dispatchEvent(c), u && (d = u.call(l, c, o)), d;
}
function Jn(e) {
	e.draggable = !1;
}
function Yn() {
	jn = !1;
}
function Xn(e, t, n) {
	var r = L(Ht(n.el, 0, n.options, !0)), i = $t(n.el, n.options, W), a = 10;
	return t ? e.clientX < i.left - a || e.clientY < r.top && e.clientX < r.right : e.clientY < i.top - a || e.clientY < r.bottom && e.clientX < r.left;
}
function Zn(e, t, n) {
	var r = L(Ut(n.el, n.options.draggable)), i = $t(n.el, n.options, W), a = 10;
	return t ? e.clientX > i.right + a || e.clientY > r.bottom && e.clientX > r.left : e.clientY > i.bottom + a || e.clientX > r.right && e.clientY > r.top;
}
function Qn(e, t, n, r, i, a, o, s) {
	var c = r ? e.clientY : e.clientX, l = r ? n.height : n.width, u = r ? n.top : n.left, d = r ? n.bottom : n.right, f = !1;
	if (!o) {
		if (s && kn < l * i) {
			if (!Dn && (En === 1 ? c > u + l * a / 2 : c < d - l * a / 2) && (Dn = !0), Dn) f = !0;
			else if (En === 1 ? c < u + kn : c > d - kn) return -En;
		} else if (c > u + l * (1 - i) / 2 && c < d - l * (1 - i) / 2) return $n(t);
	}
	return f ||= o, f && (c < u + l * a / 2 || c > d - l * a / 2) ? c > u + l / 2 ? 1 : -1 : 0;
}
function $n(e) {
	return R(H) < R(e) ? 1 : -1;
}
function er(e) {
	for (var t = e.tagName + e.className + e.src + e.href + e.textContent, n = t.length, r = 0; n--;) r += t.charCodeAt(n);
	return r.toString(36);
}
function tr(e) {
	Mn.length = 0;
	for (var t = e.getElementsByTagName("input"), n = t.length; n--;) {
		var r = t[n];
		r.checked && Mn.push(r);
	}
}
function nr(e) {
	return setTimeout(e, 0);
}
function rr(e) {
	return clearTimeout(e);
}
Nn && M(document, "touchmove", function(e) {
	(Z.active || gn) && e.cancelable && e.preventDefault();
}), Z.utils = {
	on: M,
	off: N,
	css: I,
	find: zt,
	is: function(e, t) {
		return !!P(e, t, e, !1);
	},
	extend: qt,
	throttle: Xt,
	closest: P,
	toggleClass: F,
	clone: Qt,
	index: R,
	nextTick: nr,
	cancelNextTick: rr,
	detectDirection: Rn,
	getChild: Ht,
	expando: z
}, Z.get = function(e) {
	return e[z];
}, Z.mount = function() {
	var e = [...arguments];
	e[0].constructor === Array && (e = e[0]), e.forEach(function(e) {
		if (!e.prototype || !e.prototype.constructor) throw `Sortable: Mounted plugin must be a constructor function, not ${{}.toString.call(e)}`;
		e.utils && (Z.utils = k(k({}, Z.utils), e.utils)), on.mount(e);
	});
}, Z.create = function(e, t) {
	return new Z(e, t);
}, Z.version = Ot;
var ir = function(e) {
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
function ar() {}
ar.prototype = {
	startIndex: null,
	dragStart: function(e) {
		var t = e.oldDraggableIndex;
		this.startIndex = t;
	},
	onSpill: function(e) {
		var t = e.dragEl, n = e.putSortable;
		this.sortable.captureAnimationState(), n && n.captureAnimationState();
		var r = Ht(this.sortable.el, this.startIndex, this.options);
		r ? this.sortable.el.insertBefore(t, r) : this.sortable.el.appendChild(t), this.sortable.animateAll(), n && n.animateAll();
	},
	drop: ir
}, O(ar, { pluginName: "revertOnSpill" });
function or() {}
or.prototype = {
	onSpill: function(e) {
		var t = e.dragEl, n = e.putSortable || this.sortable;
		n.captureAnimationState(), t.parentNode && t.parentNode.removeChild(t), n.animateAll();
	},
	drop: ir
}, O(or, { pluginName: "removeOnSpill" });
// src/editor-rows.ts
var sr = 1, cr = (e, t = "") => ({
	id: sr++,
	kind: e,
	text: t
});
function lr(e) {
	let t = [], n = null;
	for (let r of e) r.section !== n && (t.push(cr("section", r.section ?? "")), n = r.section), t.push(cr("item", r.text));
	return t;
}
function ur(e) {
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
function dr(e, t, n) {
	if (n < 0 || n >= e.length || t === n) return e;
	let r = [...e], [i] = r.splice(t, 1);
	return r.splice(n, 0, i), r;
}
var fr = /^\s*(?:[-*•·–]|\d+[.)])\s+/;
function pr(e) {
	return e.split(/\r?\n/).map((e) => e.replace(fr, "").trim()).filter(Boolean);
}
// src/components/item-list-editor.ts
var mr = class extends E {
	constructor(...e) {
		super(...e), this.items = [], this.multiline = !1, this.numbered = !1, this.rows = [cr("item")], this.dragAnchor = null;
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
			let e = lr(this.items);
			this.rows = e.length ? e : [cr("item")];
		}
	}
	firstUpdated() {
		let e = this.renderRoot.querySelector("ol");
		this.sortable = Z.create(e, {
			handle: ".handle",
			animation: 150,
			onStart: ({ item: e }) => {
				this.dragAnchor = e.nextSibling;
			},
			onEnd: ({ oldIndex: e, newIndex: t, item: n, from: r }) => {
				let i = this.dragAnchor;
				this.dragAnchor = null, e != null && t != null && e !== t && (r.insertBefore(n, i), this.setRows(dr(this.rows, e, t)));
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
		let t = ur(e);
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
		this.insertAfter(this.rows.length - 1, [cr(e)]);
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
		t.key === "Enter" && !t.shiftKey && !t.isComposing ? (t.preventDefault(), this.insertAfter(e, [cr("item")])) : t.key === "Backspace" && n.text === "" && this.rows.length > 1 && (t.preventDefault(), this.removeRow(e));
	}
	onPaste(e, t) {
		let n = pr(t.clipboardData?.getData("text/plain") ?? "");
		if (n.length < 2) return;
		t.preventDefault();
		let r = this.rows[e], i = [...this.rows];
		i[e] = {
			...r,
			text: r.text ? `${r.text} ${n[0]}` : n[0]
		};
		let a = n.slice(1).map((e) => cr("item", e));
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
		}), this.setRows(t.length ? t : [cr("item")]);
	}
	move(e, t) {
		let n = e + t;
		n < 0 || n >= this.rows.length || this.setRows(dr(this.rows, e, n));
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
customElements.get("cookbook-item-list-editor") || customElements.define("cookbook-item-list-editor", mr);
// src/format.ts
function Q(e, t) {
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
function vr(e, t) {
	return [e, t].filter((e) => e !== null && e !== "").join(" ");
}
// src/views/recipe-editor.ts
var yr = [
	"prep_time",
	"cook_time",
	"total_time"
];
function br(e) {
	let t = (e) => e == null ? "" : String(e);
	return {
		name: e?.name ?? "",
		description: e?.description ?? "",
		categories: [...e?.categories ?? []],
		prep_time: t(e?.prep_time),
		cook_time: t(e?.cook_time),
		total_time: t(e?.total_time),
		servings: e?.servings == null ? "" : String(e.servings),
		servings_unit: e?.servings_unit ?? "",
		notes: e?.notes ?? "",
		source_url: e?.source_url ?? ""
	};
}
function xr(e) {
	let t = e.trim();
	return t ? /^\d{1,5}$/.test(t) ? Number(t) : void 0 : null;
}
function Sr(e) {
	let t = e.trim();
	if (!t) return null;
	let n = /^\d{1,4}$/.test(t) ? Number(t) : NaN;
	return n >= 1 && n <= 1e3 ? n : void 0;
}
function Cr(e) {
	let t = {};
	e.name.trim() || (t.name = "name_required"), Sr(e.servings) === void 0 && (t.servings = "servings_invalid");
	for (let n of yr) xr(e[n]) === void 0 && (t[n] = "minutes_invalid");
	let n = e.source_url.trim();
	return n && !/^https?:\/\//i.test(n) && (t.source_url = "source_url_invalid"), t;
}
function wr(e, t, n, r = null) {
	let i = (e) => e.trim() || null, a = Sr(e.servings) ?? null;
	return {
		name: e.name.trim(),
		description: i(e.description),
		categories: e.categories,
		prep_time: xr(e.prep_time) ?? null,
		cook_time: xr(e.cook_time) ?? null,
		total_time: xr(e.total_time) ?? null,
		servings: a,
		servings_unit: i(e.servings_unit) ?? (a ? r : null),
		ingredients: t,
		steps: n,
		notes: i(e.notes),
		source_url: i(e.source_url)
	};
}
var Tr = class extends E {
	constructor(...e) {
		super(...e), this.form = br(), this.ingredients = [], this.steps = [], this.errors = {}, this.loading = !1, this.notFound = !1, this.error = null, this.saving = !1, this.conflict = null, this.leaveTarget = null, this.suggestions = [], this.original = null, this.snapshot = "", this.onBeforeUnload = (e) => {
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
		return wr(this.form, this.ingredients, this.steps, this.t("servings_unit_default"));
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
		this.original = e, this.form = br(e), this.ingredients = e ? e.ingredients.map((e) => ({ ...e })) : [], this.steps = e ? e.steps.map((e) => ({ ...e })) : [], this.errors = {}, this.conflict = null, this.snapshot = JSON.stringify(this.currentFields());
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
		let t = Cr(this.form);
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
          ${yr.map((t) => this.renderTime(t, e))}
          ${this.renderServings(e)}
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
	renderServings(e) {
		let t = this.errors.servings, n = e("servings_unit_suggestions").split(",");
		return w`<div class="field servings">
      <span class="label">${e("servings")}</span>
      <div class="servings-inputs">
        <input
          name="servings"
          inputmode="numeric"
          aria-label=${e("servings")}
          .value=${this.form.servings}
          aria-invalid=${t ? "true" : "false"}
          @input=${(e) => this.setField("servings", e.target.value)}
        />
        <input
          name="servings_unit"
          list="servings-units"
          aria-label=${e("servings_unit")}
          placeholder=${e("servings_unit_default")}
          .value=${this.form.servings_unit}
          @input=${(e) => this.setField("servings_unit", e.target.value)}
        />
        <datalist id="servings-units">${n.map((e) => w`<option value=${e}></option>`)}</datalist>
      </div>
      ${t ? w`<span class="field-error">${e(t)}</span>` : T}
    </div>`;
	}
	renderTime(e, t) {
		let n = "";
		if (e === "total_time" && !this.form.total_time.trim()) {
			let e = xr(this.form.prep_time), r = xr(this.form.cook_time);
			(e != null || r != null) && (n = t("total_auto", { value: Q((e ?? 0) + (r ?? 0), t) }));
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
      .servings-inputs {
        display: flex;
        gap: 6px;
      }
      .servings-inputs input:first-child {
        width: 4.5em;
        flex: none;
      }
      .servings-inputs input:not(:first-child) {
        flex: 1;
        min-width: 0;
      }
      .field > input,
      .field > textarea,
      .servings-inputs input {
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
      .field > textarea:focus,
      .servings-inputs input:focus {
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
customElements.get("cookbook-recipe-editor") || customElements.define("cookbook-recipe-editor", Tr);
var Er = class extends E {
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
                  <ha-icon icon="mdi:clock-outline"></ha-icon>${Q(n, e)}
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
customElements.get("cookbook-recipe-list") || customElements.define("cookbook-recipe-list", Er);
// src/quantity.ts
var Dr = {
	"½": 1 / 2,
	"¼": 1 / 4,
	"¾": 3 / 4,
	"⅓": 1 / 3,
	"⅔": 2 / 3,
	"⅛": 1 / 8
}, Or = Object.keys(Dr).join(""), kr = `(?:\\d+\\s+\\d+/\\d+|\\d+/\\d+|\\d+(?:[.,]\\d+)?(?:\\s?[${Or}])?|[${Or}])`, Ar = RegExp(`^(\\s*)(${kr})(?:(\\s*(?:à|-|–|ou)\\s*)(${kr}))?`, "i"), jr = /^\s?(?:kg|g|gr|mg|ml|cl|dl|l|litres?|grammes?|kilos?|kilogrammes?|millilitres?|centilitres?)(?![\p{L}])/iu;
function Mr(e) {
	let t = e.trim(), n = /^(\d+)\s+(\d+)\/(\d+)$/.exec(t);
	if (n) return Number(n[1]) + Number(n[2]) / Number(n[3]);
	let r = /^(\d+)\/(\d+)$/.exec(t);
	if (r) return Number(r[1]) / Number(r[2]);
	let i = t.at(-1);
	if (i in Dr) {
		let e = t.slice(0, -1).trim();
		return (e ? Number(e) : 0) + Dr[i];
	}
	return Number(t.replace(",", "."));
}
function Nr(e) {
	let t = Ar.exec(e);
	if (!t) return null;
	let [n, r, i, a, o] = t, s = [Mr(i)];
	if (o !== void 0 && s.push(Mr(o)), s.some((e) => !Number.isFinite(e) || e <= 0)) return null;
	let c = e.slice(n.length);
	return {
		indent: r,
		values: s,
		separator: a ?? "",
		rest: c,
		metric: jr.test(c)
	};
}
var Pr = [
	[0, ""],
	[1 / 4, "¼"],
	[1 / 3, "⅓"],
	[1 / 2, "½"],
	[2 / 3, "⅔"],
	[3 / 4, "¾"],
	[1, ""]
];
function Fr(e) {
	if (e >= 10) return String(Math.round(e));
	let t = Math.floor(e), [n, r] = Pr.reduce((n, r) => Math.abs(e - t - r[0]) < Math.abs(e - t - n[0]) ? r : n);
	return n === 1 && (t += 1), t === 0 && !r ? "¼" : `${t || ""}${r}`;
}
function Ir(e, t) {
	let n, r = 0;
	if (e >= 100) n = Math.round(e / 5) * 5;
	else if (e >= 10) n = Math.round(e * 2) / 2, r = 1;
	else {
		let t = Math.round(e * 4) / 4;
		r = Math.abs(t - e) < .01 ? 2 : 1, n = r === 2 ? t : Math.round(e * 10) / 10;
	}
	return new Intl.NumberFormat(t, { maximumFractionDigits: r }).format(n);
}
function Lr(e, t, n) {
	let r = Nr(e);
	return r ? {
		indent: r.indent,
		quantity: r.values.map((e) => r.metric ? Ir(e * t, n) : Fr(e * t)).join(r.separator),
		rest: r.rest
	} : null;
}
function Rr(e, t, n) {
	if (t === 1) return e;
	let r = Lr(e, t, n);
	return r ? `${r.indent}${r.quantity}${r.rest}` : e;
}
// src/print.ts
var $ = (e) => e.replace(/[&<>"']/g, (e) => `&#${e.charCodeAt(0)};`);
function zr(e, t, n) {
	return _r(e).map((e) => `${e.section ? `<h3>${$(e.section)}</h3>` : ""}<${t}>${e.items.map((e) => `<li>${$(n(e))}</li>`).join("")}</${t}>`).join("");
}
function Br(e, t, n, r = e.servings) {
	let i = e.servings && r ? r / e.servings : 1, a = (e) => Rr(e.text, i, n), o = [
		["prep_time", Q(e.prep_time, t)],
		["cook_time", Q(e.cook_time, t)],
		["total_time", Q(hr(e), t)],
		["servings", vr(r, e.servings_unit)]
	].filter(([, e]) => e).map(([e, n]) => `<span><strong>${$(t(e))}</strong> ${$(n)}</span>`).join(""), s = (e, t) => t ? `<section><h2>${$(e)}</h2>${t}</section>` : "", c = (e) => e ? `<p class="text">${$(e)}</p>` : "";
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
${o ? `<div class="meta">${o}</div>` : ""}
${c(e.description)}
${s(t("ingredients"), e.ingredients.length ? zr(e.ingredients, "ul", a) : "")}
${s(t("steps"), e.steps.length ? zr(e.steps, "ol", (e) => e.text) : "")}
${s(t("notes"), c(e.notes))}
${e.source_url ? `<p class="source">${$(e.source_url)}</p>` : ""}
</body>
</html>`;
}
function Vr(e, t, n, r = e.servings) {
	let i = document.createElement("iframe");
	i.style.cssText = "position:fixed;width:0;height:0;border:0;visibility:hidden", i.srcdoc = Br(e, t, n, r), i.addEventListener("load", () => {
		let e = i.contentWindow;
		e && (e.addEventListener("afterprint", () => i.remove()), setTimeout(() => i.remove(), 6e4), e.focus(), e.print());
	}), document.body.append(i);
}
// src/views/recipe-view.ts
var Hr = "cookbook:large-text", Ur = 1e3, Wr = (e) => `cookbook:checks:${e}`;
function Gr(e) {
	try {
		return localStorage.getItem(e);
	} catch {
		return null;
	}
}
function Kr(e, t) {
	try {
		t === null ? localStorage.removeItem(e) : localStorage.setItem(e, t);
	} catch {}
}
var qr = class e extends E {
	constructor(...e) {
		super(...e), this.recipeId = "", this.recipe = null, this.servings = null, this.error = null, this.notFound = !1, this.checked = /* @__PURE__ */ new Set(), this.largeText = Gr(Hr) === "1", this.awake = !1, this.confirmDelete = !1, this.wakeLock = null, this.onVisibilityChange = () => {
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
			confirmDelete: { state: !0 },
			servings: { state: !0 }
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
		this.recipe = null, this.error = null, this.notFound = !1, this.checked = new Set(JSON.parse(Gr(Wr(e)) ?? "[]"));
		try {
			let t = await new et(this.hass).get(e);
			if (e !== this.recipeId) return;
			this.recipe = t;
			let n = Number(new URLSearchParams(location.search).get("parts"));
			this.servings = t.servings && Number.isInteger(n) && n >= 1 && n <= Ur ? n : t.servings;
		} catch (t) {
			if (e !== this.recipeId) return;
			if ($e(t) && t.code === "not_found") this.notFound = !0;
			else {
				let e = $e(t) ? t.message : String(t);
				this.error = Ue(this.hass)("error", { message: e });
			}
		}
	}
	get factor() {
		let e = this.recipe?.servings;
		return e && this.servings ? this.servings / e : 1;
	}
	setServings(e) {
		let t = this.recipe?.servings;
		if (!t) return;
		this.servings = Math.min(Ur, Math.max(1, e));
		let n = new URLSearchParams(location.search);
		this.servings === t ? n.delete("parts") : n.set("parts", String(this.servings));
		let r = n.size ? `?${n}` : "";
		history.replaceState(history.state, "", `${location.pathname}${r}`);
	}
	toggleCheck(e) {
		let t = new Set(this.checked);
		t.has(e) ? t.delete(e) : t.add(e), this.checked = t, Kr(Wr(this.recipeId), t.size ? JSON.stringify([...t]) : null);
	}
	resetChecks() {
		this.checked = /* @__PURE__ */ new Set(), Kr(Wr(this.recipeId), null);
	}
	toggleLargeText() {
		this.largeText = !this.largeText, Kr(Hr, this.largeText ? "1" : null);
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
			await new et(this.hass).delete(this.recipeId), Kr(Wr(this.recipeId), null), D(Ze(), { replace: !0 });
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
				value: Q(t.prep_time, n)
			},
			{
				key: "cook_time",
				icon: "mdi:pot-steam-outline",
				value: Q(t.cook_time, n)
			},
			{
				key: "total_time",
				icon: "mdi:clock-outline",
				value: Q(hr(t), n)
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
        <button class="btn print" @click=${() => Vr(t, n, r, this.servings)}>
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
          ${this.renderServings(t, n)}
        </div>
        ${t.description ? w`<p class="text description">${t.description}</p>` : T}

        <div class="columns">
          ${t.ingredients.length ? w`<section class="ingredients">
                <h2>${n("ingredients")}</h2>
                ${this.renderItems(t.ingredients, "i", r)}
              </section>` : T}
          ${t.steps.length ? w`<section class="steps">
                <h2>${n("steps")}</h2>
                ${this.renderItems(t.steps, "s", r)}
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
	renderServings(e, t) {
		if (!e.servings) return e.servings_unit ? w`<div class="meta-item">
            <ha-icon icon="mdi:account-group-outline"></ha-icon>
            <div><div class="muted label">${t("servings")}</div><div>${e.servings_unit}</div></div>
          </div>` : T;
		let n = this.servings ?? e.servings;
		return w`<div class="meta-item servings">
      <ha-icon icon="mdi:account-group-outline"></ha-icon>
      <div>
        <div class="muted label">${t("servings")}</div>
        <div class="stepper">
          <button
            class="step fewer"
            aria-label=${t("fewer_servings")}
            ?disabled=${n <= 1}
            @click=${() => this.setServings((this.servings ?? e.servings) - 1)}
          >
            <ha-icon icon="mdi:minus"></ha-icon>
          </button>
          <span class="count" aria-live="polite">${vr(n, e.servings_unit)}</span>
          <button class="step more" aria-label=${t("more_servings")} @click=${() => this.setServings((this.servings ?? e.servings) + 1)}>
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>
          ${n === e.servings ? T : w`<button
                  class="step reset-servings"
                  aria-label=${t("scaled_reset", { original: e.servings })}
                  title=${t("scaled_reset", { original: e.servings })}
                  @click=${() => this.setServings(e.servings)}
                >
                  <ha-icon icon="mdi:restore"></ha-icon>
                </button>
                <span class="visually-hidden" role="status">
                  ${t("scaled_notice", {
			count: n,
			unit: e.servings_unit ?? "",
			original: e.servings
		})}
                </span>`}
        </div>
      </div>
    </div>`;
	}
	renderIngredientText(e, t) {
		let n = this.factor === 1 ? null : Lr(e, this.factor, t);
		return n ? w`${n.indent}<strong class="scaled">${n.quantity}</strong>${n.rest}` : e;
	}
	renderItems(e, t, n) {
		let r = 0;
		return _r(e).map((e) => w`
        ${e.section ? w`<h3>${e.section}</h3>` : T}
        <ul class=${t === "s" ? "numbered" : ""}>
          ${e.items.map((e) => {
			let i = `${t}${r++}`, a = this.checked.has(i);
			return w`<li>
              <label class=${a ? "done" : ""}>
                <input type="checkbox" .checked=${a} @change=${() => this.toggleCheck(i)} />
                ${t === "s" ? w`<span class="number">${r}</span>` : T}
                <span class="item-text"
                  >${t === "i" ? this.renderIngredientText(e.text, n) : e.text}</span
                >
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
      .stepper {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .step {
        display: inline-flex;
        padding: 2px;
        border: 1px solid var(--divider-color);
        border-radius: 50%;
        background: var(--card-background-color);
        color: var(--primary-color);
        cursor: pointer;
        --mdc-icon-size: 18px;
      }
      .step[disabled] {
        opacity: 0.4;
        cursor: default;
      }
      .count {
        min-width: 6em;
        text-align: center;
      }
      .scaled {
        color: var(--primary-color);
        font-weight: 600;
      }
      .reset-servings {
        margin-left: 4px;
        border-color: transparent;
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
customElements.get("cookbook-recipe-view") || customElements.define("cookbook-recipe-view", qr);
// src/cookbook-panel.ts
var Jr = class extends E {
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
customElements.get("cookbook-panel") || customElements.define("cookbook-panel", Jr);
