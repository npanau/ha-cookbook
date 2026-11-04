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
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: f, getOwnPropertySymbols: p, getPrototypeOf: m } = Object, h = globalThis, ee = h.trustedTypes, g = ee ? ee.emptyScript : "", te = h.reactiveElementPolyfillSupport, _ = (e, t) => e, ne = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? g : null;
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
}, re = (e, t) => !l(e, t), ie = {
	attribute: !0,
	type: String,
	converter: ne,
	reflect: !1,
	useDefault: !1,
	hasChanged: re
};
Symbol.metadata ??= Symbol("metadata"), h.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var ae = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = ie) {
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
		return this.elementProperties.get(e) ?? ie;
	}
	static _$Ei() {
		if (this.hasOwnProperty(_("elementProperties"))) return;
		let e = m(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(_("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(_("properties"))) {
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
			let i = (n.converter?.toAttribute === void 0 ? ne : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? ne : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? re)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
ae.elementStyles = [], ae.shadowRootOptions = { mode: "open" }, ae[_("elementProperties")] = /* @__PURE__ */ new Map(), ae[_("finalized")] = /* @__PURE__ */ new Map(), te?.({ ReactiveElement: ae }), (h.reactiveElementVersions ??= []).push("2.1.2");
// node_modules/lit-html/lit-html.js
var oe = globalThis, se = (e) => e, v = oe.trustedTypes, ce = v ? v.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, le = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, ue = "?" + y, de = `<${ue}>`, b = document, fe = () => b.createComment(""), pe = (e) => e === null || typeof e != "object" && typeof e != "function", me = Array.isArray, he = (e) => me(e) || typeof e?.[Symbol.iterator] == "function", ge = "[ 	\n\f\r]", _e = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ve = /-->/g, ye = />/g, be = RegExp(`>|${ge}(?:([^\\s"'>=/]+)(${ge}*=${ge}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), xe = /'/g, Se = /"/g, Ce = /^(?:script|style|textarea|title)$/i, x = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), we = Symbol.for("lit-noChange"), S = Symbol.for("lit-nothing"), Te = /* @__PURE__ */ new WeakMap(), Ee = b.createTreeWalker(b, 129);
function De(e, t) {
	if (!me(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return ce === void 0 ? t : ce.createHTML(t);
}
var Oe = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = _e;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === _e ? c[1] === "!--" ? o = ve : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = be) : (Ce.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = be) : o = ye : o === be ? c[0] === ">" ? (o = i ?? _e, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? be : c[3] === "\"" ? Se : xe) : o === Se || o === xe ? o = be : o === ve || o === ye ? o = _e : (o = be, i = void 0);
		let d = o === be && e[t + 1].startsWith("/>") ? " " : "";
		a += o === _e ? n + de : l >= 0 ? (r.push(s), n.slice(0, l) + le + n.slice(l) + y + d) : n + y + (l === -2 ? t : d);
	}
	return [De(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, ke = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Oe(t, n);
		if (this.el = e.createElement(l, r), Ee.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = Ee.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(le)) {
					let t = u[o++], n = i.getAttribute(e).split(y), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Pe : r[1] === "?" ? Fe : r[1] === "@" ? Ie : Ne
					}), i.removeAttribute(e);
				} else e.startsWith(y) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (Ce.test(i.tagName)) {
					let e = i.textContent.split(y), t = e.length - 1;
					if (t > 0) {
						i.textContent = v ? v.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], fe()), Ee.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], fe());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === ue) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(y, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += y.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = b.createElement("template");
		return n.innerHTML = e, n;
	}
};
function Ae(e, t, n = e, r) {
	if (t === we) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = pe(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = Ae(e, i._$AS(e, t.values), i, r)), t;
}
var je = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? b).importNode(t, !0);
		Ee.currentNode = r;
		let i = Ee.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new Me(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Le(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = Ee.nextNode(), a++);
		}
		return Ee.currentNode = b, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, Me = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = S, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = Ae(this, e, t), pe(e) ? e === S || e == null || e === "" ? (this._$AH !== S && this._$AR(), this._$AH = S) : e !== this._$AH && e !== we && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? he(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== S && pe(this._$AH) ? this._$AA.nextSibling.data = e : this.T(b.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = ke.createElement(De(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new je(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = Te.get(e.strings);
		return t === void 0 && Te.set(e.strings, t = new ke(e)), t;
	}
	k(t) {
		me(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(fe()), this.O(fe()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = se(e).nextSibling;
			se(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, Ne = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = S, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = S;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = Ae(this, e, t, 0), a = !pe(e) || e !== this._$AH && e !== we, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = Ae(this, r[n + o], t, o), s === we && (s = this._$AH[o]), a ||= !pe(s) || s !== this._$AH[o], s === S ? e = S : e !== S && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === S ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Pe = class extends Ne {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === S ? void 0 : e;
	}
}, Fe = class extends Ne {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== S);
	}
}, Ie = class extends Ne {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = Ae(this, e, t, 0) ?? S) === we) return;
		let n = this._$AH, r = e === S && n !== S || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== S && (n === S || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Le = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		Ae(this, e);
	}
}, Re = {
	M: le,
	P: y,
	A: ue,
	C: 1,
	L: Oe,
	R: je,
	D: he,
	V: Ae,
	I: Me,
	H: Ne,
	N: Fe,
	U: Ie,
	B: Pe,
	F: Le
}, ze = oe.litHtmlPolyfillSupport;
ze?.(ke, Me), (oe.litHtmlVersions ??= []).push("3.3.3");
var Be = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new Me(t.insertBefore(fe(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, Ve = globalThis, C = class extends ae {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Be(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return we;
	}
};
C._$litElement$ = !0, C.finalized = !0, Ve.litElementHydrateSupport?.({ LitElement: C });
var He = Ve.litElementPolyfillSupport;
He?.({ LitElement: C }), (Ve.litElementVersions ??= []).push("4.2.2");
var Ue = {
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
	scaled_reset: "Back to {original}",
	import: "Import",
	import_recipe: "Import a recipe",
	import_hint: "Paste the address of a recipe page (Marmiton and most recipe sites).",
	import_url: "Recipe address",
	analyze: "Analyze",
	analyzing: "Analyzing…",
	imported_from: "Imported from {site}: check, then save.",
	duplicate_text: "This recipe is already in the cookbook: “{name}”.",
	duplicate_open: "Open the recipe",
	import_error_invalid_url: "The address must start with http:// or https://",
	import_error_blocked_url: "Addresses of the local network cannot be imported.",
	import_error_fetch_failed: "The site could not be reached ({message}).",
	import_error_not_a_recipe: "No recipe was found on this page.",
	import_error_too_large: "This page is too large to be imported.",
	import_another: "Import another address",
	duplicate_source_text: "Another recipe already has this source URL: “{name}”.",
	duplicate_source_field: "Already used by another recipe.",
	photo: "Photo",
	add_photo: "Add a photo",
	replace_photo: "Replace",
	remove_photo: "Remove",
	photo_drop_hint: "or drop an image here",
	photo_invalid: "Accepted formats: JPEG, PNG, WebP.",
	photo_too_large: "The photo exceeds 15 MB.",
	photo_failed: "The recipe is saved, but the photo could not be added ({message}). Save again to retry."
}, We = {
	en: Ue,
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
		scaled_reset: "Revenir à {original}",
		import: "Importer",
		import_recipe: "Importer une recette",
		import_hint: "Collez l'adresse d'une page de recette (Marmiton et la plupart des sites de cuisine).",
		import_url: "Adresse de la recette",
		analyze: "Analyser",
		analyzing: "Analyse…",
		imported_from: "Importée depuis {site} : vérifiez, puis enregistrez.",
		duplicate_text: "Cette recette est déjà dans le livre : « {name} ».",
		duplicate_open: "Voir la recette",
		import_error_invalid_url: "L'adresse doit commencer par http:// ou https://",
		import_error_blocked_url: "Les adresses du réseau local ne peuvent pas être importées.",
		import_error_fetch_failed: "Le site n'a pas pu être joint ({message}).",
		import_error_not_a_recipe: "Aucune recette n'a été trouvée sur cette page.",
		import_error_too_large: "Cette page est trop lourde pour être importée.",
		import_another: "Importer une autre adresse",
		duplicate_source_text: "Une autre recette a déjà cette URL source : « {name} ».",
		duplicate_source_field: "Déjà utilisée par une autre recette.",
		photo: "Photo",
		add_photo: "Ajouter une photo",
		replace_photo: "Remplacer",
		remove_photo: "Retirer",
		photo_drop_hint: "ou déposez une image ici",
		photo_invalid: "Formats acceptés : JPEG, PNG, WebP.",
		photo_too_large: "La photo dépasse 15 Mo.",
		photo_failed: "La recette est enregistrée, mais la photo n'a pas pu être ajoutée ({message}). Enregistrez à nouveau pour réessayer."
	}
};
function Ge(e) {
	let t = (e?.locale?.language ?? e?.language ?? "en").split("-")[0];
	return t in We ? t : "en";
}
function w(e) {
	let t = We[Ge(e)];
	return (e, n = {}) => Object.entries(n).reduce((e, [t, n]) => e.replaceAll(`{${t}}`, String(n)), t[e] ?? Ue[e] ?? e);
}
// src/router.ts
var Ke = "/cookbook";
function qe(e) {
	let t = e.split("/").filter(Boolean).map(decodeURIComponent);
	return t.length === 0 ? { name: "list" } : t.length === 1 && t[0] === "new" ? { name: "new" } : t.length === 1 && t[0] === "import" ? { name: "import" } : t.length === 2 && t[0] === "recipe" ? {
		name: "recipe",
		id: t[1]
	} : t.length === 2 && t[0] === "edit" ? {
		name: "edit",
		id: t[1]
	} : { name: "not-found" };
}
function Je(e) {
	return `${Ke}/recipe/${encodeURIComponent(e)}`;
}
function Ye(e) {
	return `${Ke}/edit/${encodeURIComponent(e)}`;
}
var Xe = `${Ke}/new`, Ze = `${Ke}/import`;
function T(e, t = {}) {
	t.replace ? history.replaceState(history.state, "", e) : history.pushState(null, "", e), window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: t.replace ?? !1 } }));
}
var Qe = "";
function $e(e) {
	Qe = e;
}
function et() {
	return `${Ke}${Qe}`;
}
// src/styles.ts
var E = o`
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
function D(e) {
	return typeof e == "object" && !!e && "code" in e;
}
var tt = class {
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
	scrape(e) {
		return this.hass.callWS({
			type: "cookbook/scrape",
			url: e
		});
	}
	async uploadImage(e, t) {
		let n = new FormData();
		return n.append("file", t), this.imageRequest(e, {
			method: "POST",
			body: n
		});
	}
	removeImage(e) {
		return this.imageRequest(e, { method: "DELETE" });
	}
	importImage(e, t) {
		return this.hass.callWS({
			type: "cookbook/import_image",
			recipe_id: e,
			url: t
		});
	}
	async imageRequest(e, t) {
		let n = await this.hass.fetchWithAuth(`/api/cookbook/recipes/${encodeURIComponent(e)}/image`, t), r = await n.json().catch(() => ({}));
		if (!n.ok) throw {
			code: r.code ?? `http_${n.status}`,
			message: r.message ?? n.statusText
		};
		return r;
	}
	async delete(e) {
		await this.hass.callWS({
			type: "cookbook/delete",
			recipe_id: e
		});
	}
}, nt = {
	œ: "oe",
	Œ: "oe",
	æ: "ae",
	Æ: "ae"
};
function rt(e) {
	return (nt[e] ?? e).normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase();
}
function it(e) {
	return [...e].map(rt).join("");
}
function at(e, t) {
	let n = it(t).split(/\s+/).filter(Boolean), r = [...e], i = "", a = [];
	r.forEach((e, t) => {
		let n = rt(e);
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
var ot = class extends C {
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
		if (!t || this.value.some((e) => it(e) === it(t))) return;
		let n = this.suggestions.find((e) => it(e) === it(t));
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
		let e = this.suggestions.filter((e) => !this.value.some((t) => it(t) === it(e)));
		return x`
      <div class="field">
        ${this.value.map((e, t) => x`<span class="chip">
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
        <datalist id="suggestions">${e.map((e) => x`<option value=${e}></option>`)}</datalist>
      </div>
    `;
	}
	static {
		this.styles = [E, o`
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
customElements.get("cookbook-category-input") || customElements.define("cookbook-category-input", ot);
// src/components/confirm-dialog.ts
var st = class extends C {
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
		return this.open ? x`
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
    ` : x``;
	}
	static {
		this.styles = [E, o`
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
customElements.get("cookbook-confirm-dialog") || customElements.define("cookbook-confirm-dialog", st);
// node_modules/lit-html/directive.js
var ct = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, lt = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), ut = class {
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
}, { I: dt } = Re, ft = (e) => e, pt = () => document.createComment(""), mt = (e, t, n) => {
	let r = e._$AA.parentNode, i = t === void 0 ? e._$AB : t._$AA;
	if (n === void 0) n = new dt(r.insertBefore(pt(), i), r.insertBefore(pt(), i), e, e.options);
	else {
		let t = n._$AB.nextSibling, a = n._$AM, o = a !== e;
		if (o) {
			let t;
			n._$AQ?.(e), n._$AM = e, n._$AP !== void 0 && (t = e._$AU) !== a._$AU && n._$AP(t);
		}
		if (t !== i || o) {
			let e = n._$AA;
			for (; e !== t;) {
				let t = ft(e).nextSibling;
				ft(r).insertBefore(e, i), e = t;
			}
		}
	}
	return n;
}, ht = (e, t, n = e) => (e._$AI(t, n), e), gt = {}, _t = (e, t = gt) => e._$AH = t, vt = (e) => e._$AH, yt = (e) => {
	e._$AR(), e._$AA.remove();
}, bt = (e, t, n) => {
	let r = /* @__PURE__ */ new Map();
	for (let i = t; i <= n; i++) r.set(e[i], i);
	return r;
}, xt = lt(class extends ut {
	constructor(e) {
		if (super(e), e.type !== ct.CHILD) throw Error("repeat() can only be used in text expressions");
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
		let i = vt(e), { values: a, keys: o } = this.dt(t, n, r);
		if (!Array.isArray(i)) return this.ut = o, a;
		let s = this.ut ??= [], c = [], l, u, d = 0, f = i.length - 1, p = 0, m = a.length - 1;
		for (; d <= f && p <= m;) if (i[d] === null) d++;
		else if (i[f] === null) f--;
		else if (s[d] === o[p]) c[p] = ht(i[d], a[p]), d++, p++;
		else if (s[f] === o[m]) c[m] = ht(i[f], a[m]), f--, m--;
		else if (s[d] === o[m]) c[m] = ht(i[d], a[m]), mt(e, c[m + 1], i[d]), d++, m--;
		else if (s[f] === o[p]) c[p] = ht(i[f], a[p]), mt(e, i[d], i[f]), f--, p++;
		else if (l === void 0 && (l = bt(o, p, m), u = bt(s, d, f)), l.has(s[d])) {
			if (l.has(s[f])) {
				let t = u.get(o[p]), n = t === void 0 ? null : i[t];
				if (n === null) {
					let t = mt(e, i[d]);
					ht(t, a[p]), c[p] = t;
				} else c[p] = ht(n, a[p]), mt(e, i[d], n), i[t] = null;
				p++;
			} else yt(i[f]), f--;
		} else yt(i[d]), d++;
		for (; p <= m;) {
			let t = mt(e, c[m + 1]);
			ht(t, a[p]), c[p++] = t;
		}
		for (; d <= f;) {
			let e = i[d++];
			e !== null && yt(e);
		}
		return this.ut = o, _t(e, c), we;
	}
});
// node_modules/sortablejs/modular/sortable.core.esm.js
function St(e, t, n) {
	return (t = Dt(t)) in e ? Object.defineProperty(e, t, {
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
function Ct(e, t) {
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
		t % 2 ? Ct(Object(n), !0).forEach(function(t) {
			St(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ct(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function wt(e, t) {
	if (e == null) return {};
	var n, r, i = Tt(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function Tt(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function Et(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function Dt(e) {
	var t = Et(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Ot(e) {
	"@babel/helpers - typeof";
	return Ot = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
		return typeof e;
	} : function(e) {
		return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
	}, Ot(e);
}
var kt = "1.15.7";
function A(e) {
	if (typeof window < "u" && window.navigator) return !!/*@__PURE__*/ navigator.userAgent.match(e);
}
var At = A(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), jt = A(/Edge/i), Mt = A(/firefox/i), Nt = A(/safari/i) && !A(/chrome/i) && !A(/android/i), Pt = A(/iP(ad|od|hone)/i), Ft = A(/chrome/i) && A(/android/i), It = {
	capture: !1,
	passive: !1
};
function j(e, t, n) {
	e.addEventListener(t, n, !At && It);
}
function M(e, t, n) {
	e.removeEventListener(t, n, !At && It);
}
function Lt(e, t) {
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
function Rt(e) {
	return e.host && e !== document && e.host.nodeType && e.host !== e ? e.host : e.parentNode;
}
function N(e, t, n, r) {
	if (e) {
		n ||= document;
		do {
			if (t != null && (t[0] === ">" ? e.parentNode === n && Lt(e, t) : Lt(e, t)) || r && e === n) return e;
			if (e === n) break;
		} while (e = Rt(e));
	}
	return null;
}
var zt = /\s+/g;
function P(e, t, n) {
	e && t && (e.classList ? e.classList[n ? "add" : "remove"](t) : e.className = ((" " + e.className + " ").replace(zt, " ").replace(" " + t + " ", " ") + (n ? " " + t : "")).replace(zt, " "));
}
function F(e, t, n) {
	var r = e && e.style;
	if (r) {
		if (n === void 0) return document.defaultView && document.defaultView.getComputedStyle ? n = document.defaultView.getComputedStyle(e, "") : e.currentStyle && (n = e.currentStyle), t === void 0 ? n : n[t];
		!(t in r) && t.indexOf("webkit") === -1 && (t = "-webkit-" + t), r[t] = n + (typeof n == "string" ? "" : "px");
	}
}
function Bt(e, t) {
	var n = "";
	if (typeof e == "string") n = e;
	else do {
		var r = F(e, "transform");
		r && r !== "none" && (n = r + " " + n);
	} while (!t && (e = e.parentNode));
	var i = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
	return i && new i(n);
}
function Vt(e, t, n) {
	if (e) {
		var r = e.getElementsByTagName(t), i = 0, a = r.length;
		if (n) for (; i < a; i++) n(r[i], i);
		return r;
	}
	return [];
}
function Ht() {
	return document.scrollingElement || document.documentElement;
}
function I(e, t, n, r, i) {
	if (e.getBoundingClientRect || e === window) {
		var a, o, s, c, l, u, d;
		if (e !== window && e.parentNode && e !== Ht() ? (a = e.getBoundingClientRect(), o = a.top, s = a.left, c = a.bottom, l = a.right, u = a.height, d = a.width) : (o = 0, s = 0, c = window.innerHeight, l = window.innerWidth, u = window.innerHeight, d = window.innerWidth), (t || n) && e !== window && (i ||= e.parentNode, !At)) do
			if (i && i.getBoundingClientRect && (F(i, "transform") !== "none" || n && F(i, "position") !== "static")) {
				var f = i.getBoundingClientRect();
				o -= f.top + parseInt(F(i, "border-top-width")), s -= f.left + parseInt(F(i, "border-left-width")), c = o + a.height, l = s + a.width;
				break;
			}
		while (i = i.parentNode);
		if (r && e !== window) {
			var p = Bt(i || e), m = p && p.a, h = p && p.d;
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
function Ut(e, t, n) {
	for (var r = Jt(e, !0), i = I(e)[t]; r;) {
		var a = I(r)[n], o = void 0;
		if (o = n === "top" || n === "left" ? i >= a : i <= a, !o) return r;
		if (r === Ht()) break;
		r = Jt(r, !1);
	}
	return !1;
}
function Wt(e, t, n, r) {
	for (var i = 0, a = 0, o = e.children; a < o.length;) {
		if (o[a].style.display !== "none" && o[a] !== X.ghost && (r || o[a] !== X.dragged) && N(o[a], n.draggable, e, !1)) {
			if (i === t) return o[a];
			i++;
		}
		a++;
	}
	return null;
}
function Gt(e, t) {
	for (var n = e.lastElementChild; n && (n === X.ghost || F(n, "display") === "none" || t && !Lt(n, t));) n = n.previousElementSibling;
	return n || null;
}
function L(e, t) {
	var n = 0;
	if (!e || !e.parentNode) return -1;
	for (; e = e.previousElementSibling;) e.nodeName.toUpperCase() !== "TEMPLATE" && e !== X.clone && (!t || Lt(e, t)) && n++;
	return n;
}
function Kt(e) {
	var t = 0, n = 0, r = Ht();
	if (e) do {
		var i = Bt(e), a = i.a, o = i.d;
		t += e.scrollLeft * a, n += e.scrollTop * o;
	} while (e !== r && (e = e.parentNode));
	return [t, n];
}
function qt(e, t) {
	for (var n in e) if (e.hasOwnProperty(n)) {
		for (var r in t) if (t.hasOwnProperty(r) && t[r] === e[n][r]) return Number(n);
	}
	return -1;
}
function Jt(e, t) {
	if (!e || !e.getBoundingClientRect) return Ht();
	var n = e, r = !1;
	do
		if (n.clientWidth < n.scrollWidth || n.clientHeight < n.scrollHeight) {
			var i = F(n);
			if (n.clientWidth < n.scrollWidth && (i.overflowX == "auto" || i.overflowX == "scroll") || n.clientHeight < n.scrollHeight && (i.overflowY == "auto" || i.overflowY == "scroll")) {
				if (!n.getBoundingClientRect || n === document.body) return Ht();
				if (r || t) return n;
				r = !0;
			}
		}
	while (n = n.parentNode);
	return Ht();
}
function Yt(e, t) {
	if (e && t) for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
	return e;
}
function Xt(e, t) {
	return Math.round(e.top) === Math.round(t.top) && Math.round(e.left) === Math.round(t.left) && Math.round(e.height) === Math.round(t.height) && Math.round(e.width) === Math.round(t.width);
}
var Zt;
function Qt(e, t) {
	return function() {
		if (!Zt) {
			var n = arguments, r = this;
			n.length === 1 ? e.call(r, n[0]) : e.apply(r, n), Zt = setTimeout(function() {
				Zt = void 0;
			}, t);
		}
	};
}
function $t(e, t, n) {
	e.scrollLeft += t, e.scrollTop += n;
}
function en(e) {
	var t = window.Polymer, n = window.jQuery || window.Zepto;
	return t && t.dom ? t.dom(e).cloneNode(!0) : n ? n(e).clone(!0)[0] : e.cloneNode(!0);
}
function tn(e, t, n) {
	var r = {};
	return Array.from(e.children).forEach(function(i) {
		if (N(i, t.draggable, e, !1) && !i.animated && i !== n) {
			var a = I(i);
			r.left = Math.min(r.left ?? Infinity, a.left), r.top = Math.min(r.top ?? Infinity, a.top), r.right = Math.max(r.right ?? -Infinity, a.right), r.bottom = Math.max(r.bottom ?? -Infinity, a.bottom);
		}
	}), r.width = r.right - r.left, r.height = r.bottom - r.top, r.x = r.left, r.y = r.top, r;
}
var R = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function nn() {
	var e = [], t;
	return {
		captureAnimationState: function() {
			e = [], this.options.animation && [].slice.call(this.el.children).forEach(function(t) {
				if (F(t, "display") !== "none" && t !== X.ghost) {
					e.push({
						target: t,
						rect: I(t)
					});
					var n = k({}, e[e.length - 1].rect);
					if (t.thisAnimationDuration) {
						var r = Bt(t, !0);
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
			e.splice(qt(e, { target: t }), 1);
		},
		animateAll: function(n) {
			var r = this;
			if (!this.options.animation) clearTimeout(t), typeof n == "function" && n();
			else {
				var i = !1, a = 0;
				e.forEach(function(e) {
					var t = 0, n = e.target, o = n.fromRect, s = I(n), c = n.prevFromRect, l = n.prevToRect, u = e.rect, d = Bt(n, !0);
					d && (s.top -= d.f, s.left -= d.e), n.toRect = s, n.thisAnimationDuration && Xt(c, s) && !Xt(o, s) && (u.top - s.top) / (u.left - s.left) === (o.top - s.top) / (o.left - s.left) && (t = an(u, c, l, r.options)), Xt(s, o) || (n.prevFromRect = o, n.prevToRect = s, t ||= r.options.animation, r.animate(n, u, s, t)), t && (i = !0, a = Math.max(a, t), clearTimeout(n.animationResetTimer), n.animationResetTimer = setTimeout(function() {
						n.animationTime = 0, n.prevFromRect = null, n.fromRect = null, n.prevToRect = null, n.thisAnimationDuration = null;
					}, t), n.thisAnimationDuration = t);
				}), clearTimeout(t), i ? t = setTimeout(function() {
					typeof n == "function" && n();
				}, a) : typeof n == "function" && n(), e = [];
			}
		},
		animate: function(e, t, n, r) {
			if (r) {
				F(e, "transition", ""), F(e, "transform", "");
				var i = Bt(this.el), a = i && i.a, o = i && i.d, s = (t.left - n.left) / (a || 1), c = (t.top - n.top) / (o || 1);
				e.animatingX = !!s, e.animatingY = !!c, F(e, "transform", "translate3d(" + s + "px," + c + "px,0)"), this.forRepaintDummy = rn(e), F(e, "transition", "transform " + r + "ms" + (this.options.easing ? " " + this.options.easing : "")), F(e, "transform", "translate3d(0,0,0)"), typeof e.animated == "number" && clearTimeout(e.animated), e.animated = setTimeout(function() {
					F(e, "transition", ""), F(e, "transform", ""), e.animated = !1, e.animatingX = !1, e.animatingY = !1;
				}, r);
			}
		}
	};
}
function rn(e) {
	return e.offsetWidth;
}
function an(e, t, n, r) {
	return Math.sqrt((t.top - e.top) ** 2 + (t.left - e.left) ** 2) / Math.sqrt((t.top - n.top) ** 2 + (t.left - n.left) ** 2) * r.animation;
}
var on = [], sn = { initializeByDefault: !0 }, cn = {
	mount: function(e) {
		for (var t in sn) sn.hasOwnProperty(t) && !(t in e) && (e[t] = sn[t]);
		on.forEach(function(t) {
			if (t.pluginName === e.pluginName) throw `Sortable: Cannot mount plugin ${e.pluginName} more than once`;
		}), on.push(e);
	},
	pluginEvent: function(e, t, n) {
		var r = this;
		this.eventCanceled = !1, n.cancel = function() {
			r.eventCanceled = !0;
		};
		var i = e + "Global";
		on.forEach(function(r) {
			t[r.pluginName] && (t[r.pluginName][i] && t[r.pluginName][i](k({ sortable: t }, n)), t.options[r.pluginName] && t[r.pluginName][e] && t[r.pluginName][e](k({ sortable: t }, n)));
		});
	},
	initializePlugins: function(e, t, n, r) {
		for (var i in on.forEach(function(r) {
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
		return on.forEach(function(r) {
			typeof r.eventProperties == "function" && O(n, r.eventProperties.call(t[r.pluginName], e));
		}), n;
	},
	modifyOption: function(e, t, n) {
		var r;
		return on.forEach(function(i) {
			e[i.pluginName] && i.optionListeners && typeof i.optionListeners[t] == "function" && (r = i.optionListeners[t].call(e[i.pluginName], n));
		}), r;
	}
};
function ln(e) {
	var t = e.sortable, n = e.rootEl, r = e.name, i = e.targetEl, a = e.cloneEl, o = e.toEl, s = e.fromEl, c = e.oldIndex, l = e.newIndex, u = e.oldDraggableIndex, d = e.newDraggableIndex, f = e.originalEvent, p = e.putSortable, m = e.extraEventProperties;
	if (t ||= n && n[R], t) {
		var h, ee = t.options, g = "on" + r.charAt(0).toUpperCase() + r.substr(1);
		window.CustomEvent && !At && !jt ? h = new CustomEvent(r, {
			bubbles: !0,
			cancelable: !0
		}) : (h = document.createEvent("Event"), h.initEvent(r, !0, !0)), h.to = o || n, h.from = s || n, h.item = i || n, h.clone = a, h.oldIndex = c, h.newIndex = l, h.oldDraggableIndex = u, h.newDraggableIndex = d, h.originalEvent = f, h.pullMode = p ? p.lastPutMode : void 0;
		var te = k(k({}, m), cn.getEventProperties(r, t));
		for (var _ in te) h[_] = te[_];
		n && n.dispatchEvent(h), ee[g] && ee[g].call(t, h);
	}
}
var un = ["evt"], z = function(e, t) {
	var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, r = n.evt, i = wt(n, un);
	cn.pluginEvent.bind(X)(e, t, k({
		dragEl: V,
		parentEl: H,
		ghostEl: U,
		rootEl: W,
		nextEl: dn,
		lastDownEl: fn,
		cloneEl: G,
		cloneHidden: pn,
		dragStarted: En,
		putSortable: q,
		activeSortable: X.active,
		originalEvent: r,
		oldIndex: mn,
		oldDraggableIndex: hn,
		newIndex: K,
		newDraggableIndex: gn,
		hideGhostForTarget: Wn,
		unhideGhostForTarget: Gn,
		cloneNowHidden: function() {
			pn = !0;
		},
		cloneNowShown: function() {
			pn = !1;
		},
		dispatchSortableEvent: function(e) {
			B({
				sortable: t,
				name: e,
				originalEvent: r
			});
		}
	}, i));
};
function B(e) {
	ln(k({
		putSortable: q,
		cloneEl: G,
		targetEl: V,
		rootEl: W,
		oldIndex: mn,
		oldDraggableIndex: hn,
		newIndex: K,
		newDraggableIndex: gn
	}, e));
}
var V, H, U, W, dn, fn, G, pn, mn, K, hn, gn, _n, q, vn = !1, yn = !1, bn = [], xn, J, Sn, Cn, wn, Tn, En, Dn, On, kn = !1, An = !1, jn, Y, Mn = [], Nn = !1, Pn = [], Fn = typeof document < "u", In = Pt, Ln = jt || At ? "cssFloat" : "float", Rn = Fn && !Ft && !Pt && "draggable" in document.createElement("div"), zn = function() {
	if (Fn) {
		if (At) return !1;
		var e = document.createElement("x");
		return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
	}
}(), Bn = function(e, t) {
	var n = F(e), r = parseInt(n.width) - parseInt(n.paddingLeft) - parseInt(n.paddingRight) - parseInt(n.borderLeftWidth) - parseInt(n.borderRightWidth), i = Wt(e, 0, t), a = Wt(e, 1, t), o = i && F(i), s = a && F(a), c = o && parseInt(o.marginLeft) + parseInt(o.marginRight) + I(i).width, l = s && parseInt(s.marginLeft) + parseInt(s.marginRight) + I(a).width;
	if (n.display === "flex") return n.flexDirection === "column" || n.flexDirection === "column-reverse" ? "vertical" : "horizontal";
	if (n.display === "grid") return n.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
	if (i && o.float && o.float !== "none") {
		var u = o.float === "left" ? "left" : "right";
		return a && (s.clear === "both" || s.clear === u) ? "vertical" : "horizontal";
	}
	return i && (o.display === "block" || o.display === "flex" || o.display === "table" || o.display === "grid" || c >= r && n[Ln] === "none" || a && n[Ln] === "none" && c + l > r) ? "vertical" : "horizontal";
}, Vn = function(e, t, n) {
	var r = n ? e.left : e.top, i = n ? e.right : e.bottom, a = n ? e.width : e.height, o = n ? t.left : t.top, s = n ? t.right : t.bottom, c = n ? t.width : t.height;
	return r === o || i === s || r + a / 2 === o + c / 2;
}, Hn = function(e, t) {
	var n;
	return bn.some(function(r) {
		var i = r[R].options.emptyInsertThreshold;
		if (i && !Gt(r)) {
			var a = I(r), o = e >= a.left - i && e <= a.right + i, s = t >= a.top - i && t <= a.bottom + i;
			if (o && s) return n = r;
		}
	}), n;
}, Un = function(e) {
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
	r && Ot(r) == "object" || (r = { name: r }), n.name = r.name, n.checkPull = t(r.pull, !0), n.checkPut = t(r.put), n.revertClone = r.revertClone, e.group = n;
}, Wn = function() {
	!zn && U && F(U, "display", "none");
}, Gn = function() {
	!zn && U && F(U, "display", "");
};
Fn && !Ft && document.addEventListener("click", function(e) {
	if (yn) return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), yn = !1, !1;
}, !0);
var Kn = function(e) {
	if (V) {
		e = e.touches ? e.touches[0] : e;
		var t = Hn(e.clientX, e.clientY);
		if (t) {
			var n = {};
			for (var r in e) e.hasOwnProperty(r) && (n[r] = e[r]);
			n.target = n.rootEl = t, n.preventDefault = void 0, n.stopPropagation = void 0, t[R]._onDragOver(n);
		}
	}
}, qn = function(e) {
	V && V.parentNode[R]._isOutsideThisEl(e.target);
};
function X(e, t) {
	if (!(e && e.nodeType && e.nodeType === 1)) throw `Sortable: \`el\` must be an HTMLElement, not ${{}.toString.call(e)}`;
	this.el = e, this.options = t = O({}, t), e[R] = this;
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
			return Bn(e, this.options);
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
		supportPointer: X.supportPointer !== !1 && "PointerEvent" in window && (!Nt || Pt),
		emptyInsertThreshold: 5
	};
	for (var r in cn.initializePlugins(this, e, n), n) !(r in t) && (t[r] = n[r]);
	for (var i in Un(t), this) i.charAt(0) === "_" && typeof this[i] == "function" && (this[i] = this[i].bind(this));
	this.nativeDraggable = !t.forceFallback && Rn, this.nativeDraggable && (this.options.touchStartThreshold = 1), t.supportPointer ? j(e, "pointerdown", this._onTapStart) : (j(e, "mousedown", this._onTapStart), j(e, "touchstart", this._onTapStart)), this.nativeDraggable && (j(e, "dragover", this), j(e, "dragenter", this)), bn.push(this.el), t.store && t.store.get && this.sort(t.store.get(this) || []), O(this, nn());
}
X.prototype = {
	constructor: X,
	_isOutsideThisEl: function(e) {
		!this.el.contains(e) && e !== this.el && (Dn = null);
	},
	_getDirection: function(e, t) {
		return typeof this.options.direction == "function" ? this.options.direction.call(this, e, t, V) : this.options.direction;
	},
	_onTapStart: function(e) {
		if (e.cancelable) {
			var t = this, n = this.el, r = this.options, i = r.preventOnFilter, a = e.type, o = e.touches && e.touches[0] || e.pointerType && e.pointerType === "touch" && e, s = (o || e).target, c = e.target.shadowRoot && (e.path && e.path[0] || e.composedPath && e.composedPath()[0]) || s, l = r.filter;
			if (rr(n), !V && !(/mousedown|pointerdown/.test(a) && e.button !== 0 || r.disabled) && !c.isContentEditable && !(!this.nativeDraggable && Nt && s && s.tagName.toUpperCase() === "SELECT") && (s = N(s, r.draggable, n, !1), !(s && s.animated) && fn !== s)) {
				if (mn = L(s), hn = L(s, r.draggable), typeof l == "function") {
					if (l.call(this, e, s, this)) {
						B({
							sortable: t,
							rootEl: c,
							name: "filter",
							targetEl: s,
							toEl: n,
							fromEl: n
						}), z("filter", t, { evt: e }), i && e.preventDefault();
						return;
					}
				} else if (l && (l = l.split(",").some(function(r) {
					if (r = N(c, r.trim(), n, !1), r) return B({
						sortable: t,
						rootEl: r,
						name: "filter",
						targetEl: s,
						fromEl: n,
						toEl: n
					}), z("filter", t, { evt: e }), !0;
				}), l)) {
					i && e.preventDefault();
					return;
				}
				(!r.handle || N(c, r.handle, n, !1)) && this._prepareDragStart(e, o, s);
			}
		}
	},
	_prepareDragStart: function(e, t, n) {
		var r = this, i = r.el, a = r.options, o = i.ownerDocument, s;
		if (n && !V && n.parentNode === i) {
			var c = I(n);
			if (W = i, V = n, H = V.parentNode, dn = V.nextSibling, fn = n, _n = a.group, X.dragged = V, xn = {
				target: V,
				clientX: (t || e).clientX,
				clientY: (t || e).clientY
			}, wn = xn.clientX - c.left, Tn = xn.clientY - c.top, this._lastX = (t || e).clientX, this._lastY = (t || e).clientY, V.style["will-change"] = "all", s = function() {
				z("delayEnded", r, { evt: e }), X.eventCanceled ? r._onDrop() : (r._disableDelayedDragEvents(), !Mt && r.nativeDraggable && (V.draggable = !0), r._triggerDragStart(e, t), B({
					sortable: r,
					name: "choose",
					originalEvent: e
				}), P(V, a.chosenClass, !0));
			}, a.ignore.split(",").forEach(function(e) {
				Vt(V, e.trim(), Xn);
			}), j(o, "dragover", Kn), j(o, "mousemove", Kn), j(o, "touchmove", Kn), a.supportPointer ? (j(o, "pointerup", r._onDrop), !this.nativeDraggable && j(o, "pointercancel", r._onDrop)) : (j(o, "mouseup", r._onDrop), j(o, "touchend", r._onDrop), j(o, "touchcancel", r._onDrop)), Mt && this.nativeDraggable && (this.options.touchStartThreshold = 4, V.draggable = !0), z("delayStart", this, { evt: e }), a.delay && (!a.delayOnTouchOnly || t) && (!this.nativeDraggable || !(jt || At))) {
				if (X.eventCanceled) {
					this._onDrop();
					return;
				}
				a.supportPointer ? (j(o, "pointerup", r._disableDelayedDrag), j(o, "pointercancel", r._disableDelayedDrag)) : (j(o, "mouseup", r._disableDelayedDrag), j(o, "touchend", r._disableDelayedDrag), j(o, "touchcancel", r._disableDelayedDrag)), j(o, "mousemove", r._delayedDragTouchMoveHandler), j(o, "touchmove", r._delayedDragTouchMoveHandler), a.supportPointer && j(o, "pointermove", r._delayedDragTouchMoveHandler), r._dragStartTimer = setTimeout(s, a.delay);
			} else s();
		}
	},
	_delayedDragTouchMoveHandler: function(e) {
		var t = e.touches ? e.touches[0] : e;
		Math.max(Math.abs(t.clientX - this._lastX), Math.abs(t.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
	},
	_disableDelayedDrag: function() {
		V && Xn(V), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
	},
	_disableDelayedDragEvents: function() {
		var e = this.el.ownerDocument;
		M(e, "mouseup", this._disableDelayedDrag), M(e, "touchend", this._disableDelayedDrag), M(e, "touchcancel", this._disableDelayedDrag), M(e, "pointerup", this._disableDelayedDrag), M(e, "pointercancel", this._disableDelayedDrag), M(e, "mousemove", this._delayedDragTouchMoveHandler), M(e, "touchmove", this._delayedDragTouchMoveHandler), M(e, "pointermove", this._delayedDragTouchMoveHandler);
	},
	_triggerDragStart: function(e, t) {
		t ||= e.pointerType == "touch" && e, !this.nativeDraggable || t ? this.options.supportPointer ? j(document, "pointermove", this._onTouchMove) : t ? j(document, "touchmove", this._onTouchMove) : j(document, "mousemove", this._onTouchMove) : (j(V, "dragend", this), j(W, "dragstart", this._onDragStart));
		try {
			document.selection ? ir(function() {
				document.selection.empty();
			}) : window.getSelection().removeAllRanges();
		} catch {}
	},
	_dragStarted: function(e, t) {
		if (vn = !1, W && V) {
			z("dragStarted", this, { evt: t }), this.nativeDraggable && j(document, "dragover", qn);
			var n = this.options;
			!e && P(V, n.dragClass, !1), P(V, n.ghostClass, !0), X.active = this, e && this._appendGhost(), B({
				sortable: this,
				name: "start",
				originalEvent: t
			});
		} else this._nulling();
	},
	_emulateDragOver: function() {
		if (J) {
			this._lastX = J.clientX, this._lastY = J.clientY, Wn();
			for (var e = document.elementFromPoint(J.clientX, J.clientY), t = e; e && e.shadowRoot && (e = e.shadowRoot.elementFromPoint(J.clientX, J.clientY), e !== t);) t = e;
			if (V.parentNode[R]._isOutsideThisEl(e), t) do {
				if (t[R]) {
					var n = void 0;
					if (n = t[R]._onDragOver({
						clientX: J.clientX,
						clientY: J.clientY,
						target: e,
						rootEl: t
					}), n && !this.options.dragoverBubble) break;
				}
				e = t;
			} while (t = Rt(t));
			Gn();
		}
	},
	_onTouchMove: function(e) {
		if (xn) {
			var t = this.options, n = t.fallbackTolerance, r = t.fallbackOffset, i = e.touches ? e.touches[0] : e, a = U && Bt(U, !0), o = U && a && a.a, s = U && a && a.d, c = In && Y && Kt(Y), l = (i.clientX - xn.clientX + r.x) / (o || 1) + (c ? c[0] - Mn[0] : 0) / (o || 1), u = (i.clientY - xn.clientY + r.y) / (s || 1) + (c ? c[1] - Mn[1] : 0) / (s || 1);
			if (!X.active && !vn) {
				if (n && Math.max(Math.abs(i.clientX - this._lastX), Math.abs(i.clientY - this._lastY)) < n) return;
				this._onDragStart(e, !0);
			}
			if (U) {
				a ? (a.e += l - (Sn || 0), a.f += u - (Cn || 0)) : a = {
					a: 1,
					b: 0,
					c: 0,
					d: 1,
					e: l,
					f: u
				};
				var d = `matrix(${a.a},${a.b},${a.c},${a.d},${a.e},${a.f})`;
				F(U, "webkitTransform", d), F(U, "mozTransform", d), F(U, "msTransform", d), F(U, "transform", d), Sn = l, Cn = u, J = i;
			}
			e.cancelable && e.preventDefault();
		}
	},
	_appendGhost: function() {
		if (!U) {
			var e = this.options.fallbackOnBody ? document.body : W, t = I(V, !0, In, !0, e), n = this.options;
			if (In) {
				for (Y = e; F(Y, "position") === "static" && F(Y, "transform") === "none" && Y !== document;) Y = Y.parentNode;
				Y !== document.body && Y !== document.documentElement ? (Y === document && (Y = Ht()), t.top += Y.scrollTop, t.left += Y.scrollLeft) : Y = Ht(), Mn = Kt(Y);
			}
			U = V.cloneNode(!0), P(U, n.ghostClass, !1), P(U, n.fallbackClass, !0), P(U, n.dragClass, !0), F(U, "transition", ""), F(U, "transform", ""), F(U, "box-sizing", "border-box"), F(U, "margin", 0), F(U, "top", t.top), F(U, "left", t.left), F(U, "width", t.width), F(U, "height", t.height), F(U, "opacity", "0.8"), F(U, "position", In ? "absolute" : "fixed"), F(U, "zIndex", "100000"), F(U, "pointerEvents", "none"), X.ghost = U, e.appendChild(U), F(U, "transform-origin", wn / parseInt(U.style.width) * 100 + "% " + Tn / parseInt(U.style.height) * 100 + "%");
		}
	},
	_onDragStart: function(e, t) {
		var n = this, r = e.dataTransfer, i = n.options;
		z("dragStart", this, { evt: e }), X.eventCanceled ? this._onDrop() : (z("setupClone", this), X.eventCanceled || (G = en(V), G.removeAttribute("id"), G.draggable = !1, G.style["will-change"] = "", this._hideClone(), P(G, this.options.chosenClass, !1), X.clone = G), n.cloneId = ir(function() {
			z("clone", n), X.eventCanceled || (n.options.removeCloneOnHide || W.insertBefore(G, V), n._hideClone(), B({
				sortable: n,
				name: "clone"
			}));
		}), !t && P(V, i.dragClass, !0), t ? (yn = !0, n._loopId = setInterval(n._emulateDragOver, 50)) : (M(document, "mouseup", n._onDrop), M(document, "touchend", n._onDrop), M(document, "touchcancel", n._onDrop), r && (r.effectAllowed = "move", i.setData && i.setData.call(n, r, V)), j(document, "drop", n), F(V, "transform", "translateZ(0)")), vn = !0, n._dragStartId = ir(n._dragStarted.bind(n, t, e)), j(document, "selectstart", n), En = !0, window.getSelection().removeAllRanges(), Nt && F(document.body, "user-select", "none"));
	},
	_onDragOver: function(e) {
		var t = this.el, n = e.target, r, i, a, o = this.options, s = o.group, c = X.active, l = _n === s, u = o.sort, d = q || c, f, p = this, m = !1;
		if (Nn) return;
		function h(o, s) {
			z(o, p, k({
				evt: e,
				isOwner: l,
				axis: f ? "vertical" : "horizontal",
				revert: a,
				dragRect: r,
				targetRect: i,
				canSort: u,
				fromSortable: d,
				target: n,
				completed: g,
				onMove: function(n, i) {
					return Yn(W, t, V, r, n, I(n), e, i);
				},
				changed: te
			}, s));
		}
		function ee() {
			h("dragOverAnimationCapture"), p.captureAnimationState(), p !== d && d.captureAnimationState();
		}
		function g(r) {
			return h("dragOverCompleted", { insertion: r }), r && (l ? c._hideClone() : c._showClone(p), p !== d && (P(V, q ? q.options.ghostClass : c.options.ghostClass, !1), P(V, o.ghostClass, !0)), q !== p && p !== X.active ? q = p : p === X.active && q && (q = null), d === p && (p._ignoreWhileAnimating = n), p.animateAll(function() {
				h("dragOverAnimationComplete"), p._ignoreWhileAnimating = null;
			}), p !== d && (d.animateAll(), d._ignoreWhileAnimating = null)), (n === V && !V.animated || n === t && !n.animated) && (Dn = null), !o.dragoverBubble && !e.rootEl && n !== document && (V.parentNode[R]._isOutsideThisEl(e.target), !r && Kn(e)), !o.dragoverBubble && e.stopPropagation && e.stopPropagation(), m = !0;
		}
		function te() {
			K = L(V), gn = L(V, o.draggable), B({
				sortable: p,
				name: "change",
				toEl: t,
				newIndex: K,
				newDraggableIndex: gn,
				originalEvent: e
			});
		}
		if (e.preventDefault !== void 0 && e.cancelable && e.preventDefault(), n = N(n, o.draggable, t, !0), h("dragOver"), X.eventCanceled) return m;
		if (V.contains(e.target) || n.animated && n.animatingX && n.animatingY || p._ignoreWhileAnimating === n) return g(!1);
		if (yn = !1, c && !o.disabled && (l ? u || (a = H !== W) : q === this || (this.lastPutMode = _n.checkPull(this, c, V, e)) && s.checkPut(this, c, V, e))) {
			if (f = this._getDirection(e, n) === "vertical", r = I(V), h("dragOverValid"), X.eventCanceled) return m;
			if (a) return H = W, ee(), this._hideClone(), h("revert"), X.eventCanceled || (dn ? W.insertBefore(V, dn) : W.appendChild(V)), g(!0);
			var _ = Gt(t, o.draggable);
			if (!_ || $n(e, f, this) && !_.animated) {
				if (_ === V) return g(!1);
				if (_ && t === e.target && (n = _), n && (i = I(n)), Yn(W, t, V, r, n, i, e, !!n) !== !1) return ee(), _ && _.nextSibling ? t.insertBefore(V, _.nextSibling) : t.appendChild(V), H = t, te(), g(!0);
			} else if (_ && Qn(e, f, this)) {
				var ne = Wt(t, 0, o, !0);
				if (ne === V) return g(!1);
				if (n = ne, i = I(n), Yn(W, t, V, r, n, i, e, !1) !== !1) return ee(), t.insertBefore(V, ne), H = t, te(), g(!0);
			} else if (n.parentNode === t) {
				i = I(n);
				var re = 0, ie, ae = V.parentNode !== t, oe = !Vn(V.animated && V.toRect || r, n.animated && n.toRect || i, f), se = f ? "top" : "left", v = Ut(n, "top", "top") || Ut(V, "top", "top"), ce = v ? v.scrollTop : void 0;
				Dn !== n && (ie = i[se], kn = !1, An = !oe && o.invertSwap || ae), re = er(e, n, i, f, oe ? 1 : o.swapThreshold, o.invertedSwapThreshold == null ? o.swapThreshold : o.invertedSwapThreshold, An, Dn === n);
				var le;
				if (re !== 0) {
					var y = L(V);
					do
						y -= re, le = H.children[y];
					while (le && (F(le, "display") === "none" || le === U));
				}
				if (re === 0 || le === n) return g(!1);
				Dn = n, On = re;
				var ue = n.nextElementSibling, de = !1;
				de = re === 1;
				var b = Yn(W, t, V, r, n, i, e, de);
				if (b !== !1) return (b === 1 || b === -1) && (de = b === 1), Nn = !0, setTimeout(Zn, 30), ee(), de && !ue ? t.appendChild(V) : n.parentNode.insertBefore(V, de ? ue : n), v && $t(v, 0, ce - v.scrollTop), H = V.parentNode, ie !== void 0 && !An && (jn = Math.abs(ie - I(n)[se])), te(), g(!0);
			}
			if (t.contains(V)) return g(!1);
		}
		return !1;
	},
	_ignoreWhileAnimating: null,
	_offMoveEvents: function() {
		M(document, "mousemove", this._onTouchMove), M(document, "touchmove", this._onTouchMove), M(document, "pointermove", this._onTouchMove), M(document, "dragover", Kn), M(document, "mousemove", Kn), M(document, "touchmove", Kn);
	},
	_offUpEvents: function() {
		var e = this.el.ownerDocument;
		M(e, "mouseup", this._onDrop), M(e, "touchend", this._onDrop), M(e, "pointerup", this._onDrop), M(e, "pointercancel", this._onDrop), M(e, "touchcancel", this._onDrop), M(document, "selectstart", this);
	},
	_onDrop: function(e) {
		var t = this.el, n = this.options;
		K = L(V), gn = L(V, n.draggable), z("drop", this, { evt: e }), H = V && V.parentNode, K = L(V), gn = L(V, n.draggable), X.eventCanceled || (vn = !1, An = !1, kn = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), ar(this.cloneId), ar(this._dragStartId), this.nativeDraggable && (M(document, "drop", this), M(t, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), Nt && F(document.body, "user-select", ""), F(V, "transform", ""), e && (En && (e.cancelable && e.preventDefault(), !n.dropBubble && e.stopPropagation()), U && U.parentNode && U.parentNode.removeChild(U), (W === H || q && q.lastPutMode !== "clone") && G && G.parentNode && G.parentNode.removeChild(G), V && (this.nativeDraggable && M(V, "dragend", this), Xn(V), V.style["will-change"] = "", En && !vn && P(V, q ? q.options.ghostClass : this.options.ghostClass, !1), P(V, this.options.chosenClass, !1), B({
			sortable: this,
			name: "unchoose",
			toEl: H,
			newIndex: null,
			newDraggableIndex: null,
			originalEvent: e
		}), W === H ? K !== mn && K >= 0 && (B({
			sortable: this,
			name: "update",
			toEl: H,
			originalEvent: e
		}), B({
			sortable: this,
			name: "sort",
			toEl: H,
			originalEvent: e
		})) : (K >= 0 && (B({
			rootEl: H,
			name: "add",
			toEl: H,
			fromEl: W,
			originalEvent: e
		}), B({
			sortable: this,
			name: "remove",
			toEl: H,
			originalEvent: e
		}), B({
			rootEl: H,
			name: "sort",
			toEl: H,
			fromEl: W,
			originalEvent: e
		}), B({
			sortable: this,
			name: "sort",
			toEl: H,
			originalEvent: e
		})), q && q.save()), X.active && ((K == null || K === -1) && (K = mn, gn = hn), B({
			sortable: this,
			name: "end",
			toEl: H,
			originalEvent: e
		}), this.save())))), this._nulling();
	},
	_nulling: function() {
		z("nulling", this), W = V = H = U = dn = G = fn = pn = xn = J = En = K = gn = mn = hn = Dn = On = q = _n = X.dragged = X.ghost = X.clone = X.active = null;
		var e = this.el;
		Pn.forEach(function(t) {
			e.contains(t) && (t.checked = !0);
		}), Pn.length = Sn = Cn = 0;
	},
	handleEvent: function(e) {
		switch (e.type) {
			case "drop":
			case "dragend":
				this._onDrop(e);
				break;
			case "dragenter":
			case "dragover":
				V && (this._onDragOver(e), Jn(e));
				break;
			case "selectstart": e.preventDefault();
		}
	},
	toArray: function() {
		for (var e = [], t, n = this.el.children, r = 0, i = n.length, a = this.options; r < i; r++) t = n[r], N(t, a.draggable, this.el, !1) && e.push(t.getAttribute(a.dataIdAttr) || nr(t));
		return e;
	},
	sort: function(e, t) {
		var n = {}, r = this.el;
		this.toArray().forEach(function(e, t) {
			var i = r.children[t];
			N(i, this.options.draggable, r, !1) && (n[e] = i);
		}, this), t && this.captureAnimationState(), e.forEach(function(e) {
			n[e] && (r.removeChild(n[e]), r.appendChild(n[e]));
		}), t && this.animateAll();
	},
	save: function() {
		var e = this.options.store;
		e && e.set && e.set(this);
	},
	closest: function(e, t) {
		return N(e, t || this.options.draggable, this.el, !1);
	},
	option: function(e, t) {
		var n = this.options;
		if (t === void 0) return n[e];
		var r = cn.modifyOption(this, e, t);
		n[e] = r === void 0 ? t : r, e === "group" && Un(n);
	},
	destroy: function() {
		z("destroy", this);
		var e = this.el;
		e[R] = null, M(e, "mousedown", this._onTapStart), M(e, "touchstart", this._onTapStart), M(e, "pointerdown", this._onTapStart), this.nativeDraggable && (M(e, "dragover", this), M(e, "dragenter", this)), Array.prototype.forEach.call(e.querySelectorAll("[draggable]"), function(e) {
			e.removeAttribute("draggable");
		}), this._onDrop(), this._disableDelayedDragEvents(), bn.splice(bn.indexOf(this.el), 1), this.el = e = null;
	},
	_hideClone: function() {
		if (!pn) {
			if (z("hideClone", this), X.eventCanceled) return;
			F(G, "display", "none"), this.options.removeCloneOnHide && G.parentNode && G.parentNode.removeChild(G), pn = !0;
		}
	},
	_showClone: function(e) {
		if (e.lastPutMode !== "clone") this._hideClone();
		else if (pn) {
			if (z("showClone", this), X.eventCanceled) return;
			V.parentNode == W && !this.options.group.revertClone ? W.insertBefore(G, V) : dn ? W.insertBefore(G, dn) : W.appendChild(G), this.options.group.revertClone && this.animate(V, G), F(G, "display", ""), pn = !1;
		}
	}
};
function Jn(e) {
	e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function Yn(e, t, n, r, i, a, o, s) {
	var c, l = e[R], u = l.options.onMove, d;
	return window.CustomEvent && !At && !jt ? c = new CustomEvent("move", {
		bubbles: !0,
		cancelable: !0
	}) : (c = document.createEvent("Event"), c.initEvent("move", !0, !0)), c.to = t, c.from = e, c.dragged = n, c.draggedRect = r, c.related = i || t, c.relatedRect = a || I(t), c.willInsertAfter = s, c.originalEvent = o, e.dispatchEvent(c), u && (d = u.call(l, c, o)), d;
}
function Xn(e) {
	e.draggable = !1;
}
function Zn() {
	Nn = !1;
}
function Qn(e, t, n) {
	var r = I(Wt(n.el, 0, n.options, !0)), i = tn(n.el, n.options, U), a = 10;
	return t ? e.clientX < i.left - a || e.clientY < r.top && e.clientX < r.right : e.clientY < i.top - a || e.clientY < r.bottom && e.clientX < r.left;
}
function $n(e, t, n) {
	var r = I(Gt(n.el, n.options.draggable)), i = tn(n.el, n.options, U), a = 10;
	return t ? e.clientX > i.right + a || e.clientY > r.bottom && e.clientX > r.left : e.clientY > i.bottom + a || e.clientX > r.right && e.clientY > r.top;
}
function er(e, t, n, r, i, a, o, s) {
	var c = r ? e.clientY : e.clientX, l = r ? n.height : n.width, u = r ? n.top : n.left, d = r ? n.bottom : n.right, f = !1;
	if (!o) {
		if (s && jn < l * i) {
			if (!kn && (On === 1 ? c > u + l * a / 2 : c < d - l * a / 2) && (kn = !0), kn) f = !0;
			else if (On === 1 ? c < u + jn : c > d - jn) return -On;
		} else if (c > u + l * (1 - i) / 2 && c < d - l * (1 - i) / 2) return tr(t);
	}
	return f ||= o, f && (c < u + l * a / 2 || c > d - l * a / 2) ? c > u + l / 2 ? 1 : -1 : 0;
}
function tr(e) {
	return L(V) < L(e) ? 1 : -1;
}
function nr(e) {
	for (var t = e.tagName + e.className + e.src + e.href + e.textContent, n = t.length, r = 0; n--;) r += t.charCodeAt(n);
	return r.toString(36);
}
function rr(e) {
	Pn.length = 0;
	for (var t = e.getElementsByTagName("input"), n = t.length; n--;) {
		var r = t[n];
		r.checked && Pn.push(r);
	}
}
function ir(e) {
	return setTimeout(e, 0);
}
function ar(e) {
	return clearTimeout(e);
}
Fn && j(document, "touchmove", function(e) {
	(X.active || vn) && e.cancelable && e.preventDefault();
}), X.utils = {
	on: j,
	off: M,
	css: F,
	find: Vt,
	is: function(e, t) {
		return !!N(e, t, e, !1);
	},
	extend: Yt,
	throttle: Qt,
	closest: N,
	toggleClass: P,
	clone: en,
	index: L,
	nextTick: ir,
	cancelNextTick: ar,
	detectDirection: Bn,
	getChild: Wt,
	expando: R
}, X.get = function(e) {
	return e[R];
}, X.mount = function() {
	var e = [...arguments];
	e[0].constructor === Array && (e = e[0]), e.forEach(function(e) {
		if (!e.prototype || !e.prototype.constructor) throw `Sortable: Mounted plugin must be a constructor function, not ${{}.toString.call(e)}`;
		e.utils && (X.utils = k(k({}, X.utils), e.utils)), cn.mount(e);
	});
}, X.create = function(e, t) {
	return new X(e, t);
}, X.version = kt;
var or = function(e) {
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
function sr() {}
sr.prototype = {
	startIndex: null,
	dragStart: function(e) {
		var t = e.oldDraggableIndex;
		this.startIndex = t;
	},
	onSpill: function(e) {
		var t = e.dragEl, n = e.putSortable;
		this.sortable.captureAnimationState(), n && n.captureAnimationState();
		var r = Wt(this.sortable.el, this.startIndex, this.options);
		r ? this.sortable.el.insertBefore(t, r) : this.sortable.el.appendChild(t), this.sortable.animateAll(), n && n.animateAll();
	},
	drop: or
}, O(sr, { pluginName: "revertOnSpill" });
function cr() {}
cr.prototype = {
	onSpill: function(e) {
		var t = e.dragEl, n = e.putSortable || this.sortable;
		n.captureAnimationState(), t.parentNode && t.parentNode.removeChild(t), n.animateAll();
	},
	drop: or
}, O(cr, { pluginName: "removeOnSpill" });
// src/editor-rows.ts
var lr = 1, Z = (e, t = "") => ({
	id: lr++,
	kind: e,
	text: t
});
function ur(e) {
	let t = [], n = null;
	for (let r of e) r.section !== n && (t.push(Z("section", r.section ?? "")), n = r.section), t.push(Z("item", r.text));
	return t;
}
function dr(e) {
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
function fr(e, t, n) {
	if (n < 0 || n >= e.length || t === n) return e;
	let r = [...e], [i] = r.splice(t, 1);
	return r.splice(n, 0, i), r;
}
var pr = /^\s*(?:[-*•·–]|\d+[.)])\s+/;
function mr(e) {
	return e.split(/\r?\n/).map((e) => e.replace(pr, "").trim()).filter(Boolean);
}
// src/components/item-list-editor.ts
var hr = class extends C {
	constructor(...e) {
		super(...e), this.items = [], this.multiline = !1, this.numbered = !1, this.rows = [Z("item")], this.dragAnchor = null;
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
			let e = ur(this.items);
			this.rows = e.length ? e : [Z("item")];
		}
	}
	firstUpdated() {
		let e = this.renderRoot.querySelector("ol");
		this.sortable = X.create(e, {
			handle: ".handle",
			animation: 150,
			onStart: ({ item: e }) => {
				this.dragAnchor = e.nextSibling;
			},
			onEnd: ({ oldIndex: e, newIndex: t, item: n, from: r }) => {
				let i = this.dragAnchor;
				this.dragAnchor = null, e != null && t != null && e !== t && (r.insertBefore(n, i), this.setRows(fr(this.rows, e, t)));
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
		let t = dr(e);
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
		this.insertAfter(this.rows.length - 1, [Z(e)]);
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
		t.key === "Enter" && !t.shiftKey && !t.isComposing ? (t.preventDefault(), this.insertAfter(e, [Z("item")])) : t.key === "Backspace" && n.text === "" && this.rows.length > 1 && (t.preventDefault(), this.removeRow(e));
	}
	onPaste(e, t) {
		let n = mr(t.clipboardData?.getData("text/plain") ?? "");
		if (n.length < 2) return;
		t.preventDefault();
		let r = this.rows[e], i = [...this.rows];
		i[e] = {
			...r,
			text: r.text ? `${r.text} ${n[0]}` : n[0]
		};
		let a = n.slice(1).map((e) => Z("item", e));
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
		}), this.setRows(t.length ? t : [Z("item")]);
	}
	move(e, t) {
		let n = e + t;
		n < 0 || n >= this.rows.length || this.setRows(fr(this.rows, e, n));
	}
	autoGrow(e) {
		e.style.height = "auto", e.style.height = `${e.scrollHeight}px`;
	}
	render() {
		let e = 0;
		return x`
      <ol>
        ${xt(this.rows, (e) => e.id, (t, n) => {
			let r = t.kind === "section";
			r || e++;
			let i = { placeholder: r ? this.labels.sectionPlaceholder : this.labels.itemPlaceholder };
			return x`<li class=${t.kind}>
              <span class="handle" title=${this.labels.drag} aria-hidden="true">
                <ha-icon icon="mdi:drag"></ha-icon>
              </span>
              ${this.numbered && !r ? x`<span class="number">${e}</span>` : S}
              ${this.multiline && !r ? x`<textarea
                    rows="1"
                    data-row=${t.id}
                    .value=${t.text}
                    placeholder=${i.placeholder}
                    aria-label=${i.placeholder}
                    @input=${(e) => this.onInput(n, e)}
                    @keydown=${(e) => this.onKeydown(n, e)}
                    @paste=${(e) => this.onPaste(n, e)}
                  ></textarea>` : x`<input
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
		this.styles = [E, o`
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
customElements.get("cookbook-item-list-editor") || customElements.define("cookbook-item-list-editor", hr);
// src/components/photo-input.ts
var gr = [
	"image/jpeg",
	"image/png",
	"image/webp"
], _r = class extends C {
	constructor(...e) {
		super(...e), this.src = null, this.error = null, this.dragging = !1;
	}
	static {
		this.properties = {
			src: {},
			labels: { attribute: !1 },
			error: { state: !0 },
			dragging: { state: !0 }
		};
	}
	pick() {
		this.renderRoot.querySelector("input[type=file]").click();
	}
	choose(e) {
		e && (gr.includes(e.type) ? e.size > 15728640 ? this.error = this.labels.tooLarge : (this.error = null, this.emit(e)) : this.error = this.labels.invalid);
	}
	emit(e) {
		this.dispatchEvent(new CustomEvent("photo-changed", { detail: { file: e } }));
	}
	onDrop(e) {
		e.preventDefault(), this.dragging = !1, this.choose(e.dataTransfer?.files?.[0]);
	}
	render() {
		return x`
      <div
        class="zone ${this.dragging ? "dragging" : ""} ${this.src ? "filled" : ""}"
        @dragover=${(e) => {
			e.preventDefault(), this.dragging = !0;
		}}
        @dragleave=${() => this.dragging = !1}
        @drop=${this.onDrop}
      >
        ${this.src ? x`<img class="preview" src=${this.src} alt="" />` : x`<button class="empty" type="button" @click=${this.pick}>
              <ha-icon icon="mdi:camera-plus-outline"></ha-icon>
              <span>${this.labels.add}</span>
              <span class="muted hint">${this.labels.dropHint}</span>
            </button>`}
      </div>
      ${this.src ? x`<div class="actions">
            <button class="btn replace" type="button" @click=${this.pick}>
              <ha-icon icon="mdi:camera-flip-outline"></ha-icon>${this.labels.replace}
            </button>
            <button class="btn remove" type="button" @click=${() => this.emit(null)}>
              <ha-icon icon="mdi:image-remove-outline"></ha-icon>${this.labels.remove}
            </button>
          </div>` : S}
      ${this.error ? x`<p class="error" role="alert">${this.error}</p>` : S}
      <input
        type="file"
        accept=${gr.join(",")}
        hidden
        @change=${(e) => {
			let t = e.target;
			this.choose(t.files?.[0]), t.value = "";
		}}
      />
    `;
	}
	static {
		this.styles = [E, o`
      :host {
        display: block;
      }
      .zone {
        overflow: hidden;
        border: 2px dashed var(--divider-color);
        border-radius: var(--cb-radius);
        aspect-ratio: 16 / 9;
        max-height: 320px;
        width: 100%;
        background: var(--secondary-background-color);
      }
      .zone.filled {
        border-style: solid;
      }
      .zone.dragging {
        border-color: var(--primary-color);
      }
      .preview {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        width: 100%;
        height: 100%;
        border: 0;
        background: none;
        color: var(--primary-color);
        font: inherit;
        cursor: pointer;
        --mdc-icon-size: 40px;
      }
      .hint {
        font-size: 13px;
      }
      .actions {
        display: flex;
        gap: 8px;
        margin-top: 8px;
      }
      .error {
        margin: 8px 0 0;
      }
    `];
	}
};
customElements.get("cookbook-photo-input") || customElements.define("cookbook-photo-input", _r);
// src/format.ts
function Q(e, t) {
	if (e == null) return "";
	let n = Math.floor(e / 60), r = e % 60;
	return n && r ? t("duration_h_min", {
		h: n,
		m: r
	}) : n ? t("duration_h", { h: n }) : t("duration_min", { m: r });
}
function vr(e) {
	return e.total_time == null ? e.prep_time == null && e.cook_time == null ? null : (e.prep_time ?? 0) + (e.cook_time ?? 0) : e.total_time;
}
function yr(e, t) {
	return new Intl.DateTimeFormat(t, { dateStyle: "long" }).format(new Date(e));
}
function br(e) {
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
function xr(e, t) {
	return [e, t].filter((e) => e !== null && e !== "").join(" ");
}
// src/views/recipe-editor.ts
var Sr = [
	"prep_time",
	"cook_time",
	"total_time"
];
function Cr(e) {
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
function wr(e) {
	let t = e.trim();
	return t ? /^\d{1,5}$/.test(t) ? Number(t) : void 0 : null;
}
function Tr(e) {
	let t = e.trim();
	if (!t) return null;
	let n = /^\d{1,4}$/.test(t) ? Number(t) : NaN;
	return n >= 1 && n <= 1e3 ? n : void 0;
}
function Er(e) {
	let t = {};
	e.name.trim() || (t.name = "name_required"), Tr(e.servings) === void 0 && (t.servings = "servings_invalid");
	for (let n of Sr) wr(e[n]) === void 0 && (t[n] = "minutes_invalid");
	let n = e.source_url.trim();
	return n && !/^https?:\/\//i.test(n) && (t.source_url = "source_url_invalid"), t;
}
function Dr(e, t, n, r = null) {
	let i = (e) => e.trim() || null, a = Tr(e.servings) ?? null;
	return {
		name: e.name.trim(),
		description: i(e.description),
		categories: e.categories,
		prep_time: wr(e.prep_time) ?? null,
		cook_time: wr(e.cook_time) ?? null,
		total_time: wr(e.total_time) ?? null,
		servings: a,
		servings_unit: i(e.servings_unit) ?? (a ? r : null),
		ingredients: t,
		steps: n,
		notes: i(e.notes),
		source_url: i(e.source_url)
	};
}
var Or = class extends C {
	constructor(...e) {
		super(...e), this.form = Cr(), this.ingredients = [], this.steps = [], this.errors = {}, this.loading = !1, this.notFound = !1, this.error = null, this.saving = !1, this.conflict = null, this.leaveTarget = null, this.duplicateOf = null, this.suggestions = [], this.photo = { kind: "keep" }, this.original = null, this.snapshot = "", this.onBeforeUnload = (e) => {
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
			duplicateOf: { state: !0 },
			suggestions: { state: !0 },
			draft: { attribute: !1 },
			draftImageUrl: { attribute: !1 },
			importedFrom: { attribute: !1 },
			photo: { state: !0 }
		};
	}
	connectedCallback() {
		super.connectedCallback(), window.addEventListener("beforeunload", this.onBeforeUnload), window.addEventListener("keydown", this.onShortcut), this.api.categories().then((e) => this.suggestions = e.map((e) => e.name)).catch(() => void 0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), window.removeEventListener("beforeunload", this.onBeforeUnload), window.removeEventListener("keydown", this.onShortcut), this.setPhoto({ kind: "keep" });
	}
	setPhoto(e) {
		this.photo.kind === "file" && URL.revokeObjectURL(this.photo.preview), this.photo = e;
	}
	get photoSrc() {
		switch (this.photo.kind) {
			case "file": return this.photo.preview;
			case "url": return this.photo.url;
			case "remove": return null;
			default: return this.original?.image_url ?? null;
		}
	}
	onPhotoChanged(e) {
		e ? this.setPhoto({
			kind: "file",
			file: e,
			preview: URL.createObjectURL(e)
		}) : this.original?.image ? this.setPhoto({ kind: "remove" }) : this.setPhoto({ kind: "keep" });
	}
	willUpdate(e) {
		(e.has("recipeId") || e.has("draft")) && (this.recipeId ? this.load(this.recipeId) : this.reset(null, this.draft));
	}
	get api() {
		return new tt(this.hass);
	}
	get t() {
		return w(this.hass);
	}
	currentFields() {
		return Dr(this.form, this.ingredients, this.steps, this.t("servings_unit_default"));
	}
	get dirty() {
		return this.photo.kind !== "keep" || JSON.stringify(this.currentFields()) !== this.snapshot;
	}
	requestLeave(e) {
		this.dirty ? this.leaveTarget = e : T(e);
	}
	get backUrl() {
		return this.recipeId ? Je(this.recipeId) : et();
	}
	reset(e, t) {
		this.original = e, this.form = Cr(e), this.ingredients = e ? e.ingredients.map((e) => ({ ...e })) : [], this.steps = e ? e.steps.map((e) => ({ ...e })) : [], this.errors = {}, this.conflict = null, this.setPhoto({ kind: "keep" }), this.snapshot = JSON.stringify(this.currentFields()), t && this.draftImageUrl && this.setPhoto({
			kind: "url",
			url: this.draftImageUrl
		}), t && (this.form = Cr(t), this.ingredients = t.ingredients.map((e) => ({ ...e })), this.steps = t.steps.map((e) => ({ ...e })));
	}
	async load(e) {
		this.loading = !0, this.notFound = !1, this.error = null;
		try {
			let t = await this.api.get(e);
			e === this.recipeId && this.reset(t);
		} catch (t) {
			if (e !== this.recipeId) return;
			D(t) && t.code === "not_found" ? this.notFound = !0 : this.showError(t);
		} finally {
			e === this.recipeId && (this.loading = !1);
		}
	}
	showError(e) {
		let t = D(e) ? e.message : String(e);
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
		let t = Er(this.form);
		if (this.errors = t, Object.keys(t).length) {
			await this.updateComplete, this.renderRoot.querySelector("[aria-invalid='true']")?.focus();
			return;
		}
		this.saving = !0, this.error = null, this.duplicateOf = null;
		let n = this.currentFields();
		try {
			let t = this.original ? await this.api.update(this.original.id, n, e.overwrite ? void 0 : this.original.updated_at) : await this.api.create(n);
			if (this.original = t, this.snapshot = JSON.stringify(n), this.conflict = null, !await this.applyPhoto(t.id)) return;
			T(Je(t.id), { replace: !0 });
		} catch (e) {
			let t = D(e) ? e.translation_placeholders : void 0;
			if (D(e) && e.code === "duplicate_source" && t) this.duplicateOf = {
				id: t.recipe_id,
				name: t.name
			}, this.errors = {
				...this.errors,
				source_url: "duplicate_source_field"
			};
			else if (D(e) && e.code === "conflict" && this.original) try {
				this.conflict = { latest: await this.api.get(this.original.id) };
			} catch (e) {
				this.showError(e);
			}
			else this.showError(e);
		} finally {
			this.saving = !1;
		}
	}
	async applyPhoto(e) {
		let t = this.photo;
		try {
			let n = null;
			return t.kind === "file" ? n = await this.api.uploadImage(e, t.file) : t.kind === "url" ? n = await this.api.importImage(e, t.url) : t.kind === "remove" && (n = await this.api.removeImage(e)), n && (this.original = n), this.setPhoto({ kind: "keep" }), !0;
		} catch (e) {
			let t = D(e) ? e.message : String(e);
			return this.error = this.t("photo_failed", { message: t }), !1;
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
		if (this.notFound) return x`<div class="message">
        <p>${e("recipe_not_found")}</p>
        <button class="btn" @click=${() => T(et())}>${e("back_to_list")}</button>
      </div>`;
		if (this.loading) return x`<p class="message">${e("loading")}</p>`;
		let t = this.listLabels;
		return x`
      <h1>${this.recipeId ? e("edit_recipe") : e("new_recipe")}</h1>
      ${this.importedFrom ? x`<p class="banner imported" role="status">
            <ha-icon icon="mdi:web-check"></ha-icon>${e("imported_from", { site: this.importedFrom })}
          </p>` : S}
      ${this.conflict ? this.renderConflict(e) : S}
      ${this.duplicateOf ? x`<div class="banner duplicate" role="alert">
            <p>${e("duplicate_source_text", { name: this.duplicateOf.name })}</p>
            <div class="banner-actions">
              <button class="btn open-duplicate" @click=${() => this.requestLeave(Je(this.duplicateOf.id))}>
                ${e("duplicate_open")}
              </button>
            </div>
          </div>` : S}
      ${this.error ? x`<p class="banner error" role="alert">${this.error}</p>` : S}

      <section class="card photo">
        <cookbook-photo-input
          .src=${this.photoSrc}
          .labels=${{
			add: e("add_photo"),
			replace: e("replace_photo"),
			remove: e("remove_photo"),
			dropHint: e("photo_drop_hint"),
			invalid: e("photo_invalid"),
			tooLarge: e("photo_too_large")
		}}
          @photo-changed=${(e) => this.onPhotoChanged(e.detail.file)}
        ></cookbook-photo-input>
      </section>

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
          ${Sr.map((t) => this.renderTime(t, e))}
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
		let e = this.leaveTarget ?? et();
		this.leaveTarget = null, this.snapshot = JSON.stringify(this.currentFields()), T(e);
	}
	renderConflict(e) {
		let t = this.conflict.latest.updated_by_name;
		return x`<div class="banner conflict" role="alert">
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
		return x`<label class="field">
      <span class="label">${t}${n.required ? " *" : ""}</span>
      ${n.multiline ? x`<textarea
            name=${e}
            rows="3"
            .value=${this.form[e]}
            aria-invalid=${r ? "true" : "false"}
            @input=${i}
          ></textarea>` : x`<input
            name=${e}
            type=${n.type ?? "text"}
            .value=${this.form[e]}
            placeholder=${n.placeholder ?? ""}
            ?autofocus=${n.autofocus}
            aria-invalid=${r ? "true" : "false"}
            @input=${i}
          />`}
      ${r ? x`<span class="field-error">${this.t(r)}</span>` : S}
    </label>`;
	}
	renderServings(e) {
		let t = this.errors.servings, n = e("servings_unit_suggestions").split(",");
		return x`<div class="field servings">
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
        <datalist id="servings-units">${n.map((e) => x`<option value=${e}></option>`)}</datalist>
      </div>
      ${t ? x`<span class="field-error">${e(t)}</span>` : S}
    </div>`;
	}
	renderTime(e, t) {
		let n = "";
		if (e === "total_time" && !this.form.total_time.trim()) {
			let e = wr(this.form.prep_time), r = wr(this.form.cook_time);
			(e != null || r != null) && (n = t("total_auto", { value: Q((e ?? 0) + (r ?? 0), t) }));
		}
		let r = this.errors[e];
		return x`<label class="field">
      <span class="label">${t(e)} (min)</span>
      <input
        name=${e}
        inputmode="numeric"
        .value=${this.form[e]}
        placeholder=${n}
        aria-invalid=${r ? "true" : "false"}
        @input=${(t) => this.setField(e, t.target.value)}
      />
      ${r ? x`<span class="field-error">${t(r)}</span>` : S}
    </label>`;
	}
	static {
		this.styles = [E, o`
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
      .imported {
        display: flex;
        align-items: center;
        gap: 8px;
        border-color: var(--primary-color);
        --mdc-icon-size: 20px;
      }
      .imported ha-icon {
        color: var(--primary-color);
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
customElements.get("cookbook-recipe-editor") || customElements.define("cookbook-recipe-editor", Or);
// src/views/recipe-import.ts
var kr = [
	"invalid_url",
	"blocked_url",
	"fetch_failed",
	"not_a_recipe",
	"too_large"
];
function Ar(e) {
	try {
		return new URL(e).hostname.replace(/^www\./, "");
	} catch {
		return e;
	}
}
var jr = class extends C {
	constructor(...e) {
		super(...e), this.url = "", this.loading = !1, this.error = null, this.draft = null, this.duplicate = null, this.imageUrl = null;
	}
	static {
		this.properties = {
			hass: { attribute: !1 },
			url: { state: !0 },
			loading: { state: !0 },
			error: { state: !0 },
			draft: { state: !0 },
			duplicate: { state: !0 },
			imageUrl: { state: !0 }
		};
	}
	connectedCallback() {
		super.connectedCallback();
		let e = new URLSearchParams(location.search).get("url");
		e && (this.url = e, this.analyze());
	}
	requestLeave(e) {
		let t = this.renderRoot.querySelector("cookbook-recipe-editor");
		t ? t.requestLeave(e) : T(e);
	}
	get t() {
		return w(this.hass);
	}
	async analyze() {
		let e = this.url.trim();
		if (e && !this.loading) {
			this.loading = !0, this.error = null, this.duplicate = null;
			try {
				let { recipe: t, image_url: n, duplicate: r } = await new tt(this.hass).scrape(e);
				this.imageUrl = n, r ? this.duplicate = r : this.draft = t;
			} catch (e) {
				this.error = this.describe(e);
			} finally {
				this.loading = !1;
			}
		}
	}
	describe(e) {
		if (D(e) && kr.includes(e.code)) return this.t(`import_error_${e.code}`, { message: e.message });
		let t = D(e) ? e.message : String(e);
		return this.t("error", { message: t });
	}
	restart() {
		this.draft = null, this.duplicate = null, this.error = null;
	}
	render() {
		let e = this.t;
		return this.draft ? x`
        <cookbook-recipe-editor
          .hass=${this.hass}
          .draftImageUrl=${this.imageUrl}
          .draft=${this.draft}
          .importedFrom=${Ar(this.draft.source_url ?? this.url)}
        ></cookbook-recipe-editor>
      ` : x`
      <section class="card">
        <h1>${e("import_recipe")}</h1>
        <p class="muted">${e("import_hint")}</p>
        <form
          @submit=${(e) => {
			e.preventDefault(), this.analyze();
		}}
        >
          <input
            name="url"
            type="url"
            inputmode="url"
            autocomplete="off"
            placeholder="https://www.marmiton.org/recettes/…"
            aria-label=${e("import_url")}
            .value=${this.url}
            ?disabled=${this.loading}
            @input=${(e) => this.url = e.target.value}
          />
          <button class="btn primary analyze" type="submit" ?disabled=${this.loading || !this.url.trim()}>
            <ha-icon icon=${this.loading ? "mdi:timer-sand" : "mdi:magnify"}></ha-icon>
            ${this.loading ? e("analyzing") : e("analyze")}
          </button>
        </form>
        ${this.error ? x`<p class="error" role="alert">${this.error}</p>` : S}
        ${this.duplicate ? this.renderDuplicate(this.duplicate, e) : S}
      </section>
    `;
	}
	renderDuplicate(e, t) {
		return x`<div class="duplicate" role="alert">
      <span>${t("duplicate_text", { name: e.name })}</span>
      <span class="duplicate-actions">
        <button class="btn open-duplicate" @click=${() => T(Je(e.id))}>
          ${t("duplicate_open")}
        </button>
        <button class="btn restart" @click=${this.restart}>${t("import_another")}</button>
      </span>
    </div>`;
	}
	static {
		this.styles = [E, o`
      :host {
        display: block;
      }
      section {
        max-width: 720px;
        margin: var(--cb-gap) auto;
        padding: 20px;
        box-sizing: border-box;
      }
      @media (max-width: 760px) {
        section {
          margin: var(--cb-gap);
        }
      }
      h1 {
        margin: 0 0 8px;
        font-size: 22px;
        font-weight: 500;
      }
      form {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 16px;
      }
      input {
        flex: 1 1 280px;
        min-width: 0;
        box-sizing: border-box;
        padding: 10px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font: inherit;
        font-size: 16px;
      }
      input:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: -1px;
      }
      .btn[disabled] {
        opacity: 0.6;
        cursor: default;
      }
      .error {
        margin: 12px 0 0;
      }
      .duplicate {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin: 16px 0 0;
        padding: 12px 16px;
        box-sizing: border-box;
        border: 1px solid var(--warning-color, #ffa600);
        border-radius: var(--cb-radius);
      }
      .duplicate-actions {
        display: flex;
        gap: 8px;
      }
    `];
	}
};
customElements.get("cookbook-recipe-import") || customElements.define("cookbook-recipe-import", jr);
var Mr = class extends C {
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
		return new tt(this.hass);
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
		let t = D(e) ? e.message : String(e);
		this.error = w(this.hass)("error", { message: t });
	}
	syncUrl() {
		let e = new URLSearchParams();
		this.query.trim() && e.set("q", this.query.trim()), this.category && e.set("category", this.category);
		let t = e.size ? `?${e}` : "";
		$e(t), history.replaceState(history.state, "", `${location.pathname}${t}`);
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
		e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0 || (e.preventDefault(), T(Je(t)));
	}
	render() {
		let e = w(this.hass);
		return x`
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
        ${this.query ? x`<button class="clear" aria-label=${e("clear_search")} @click=${this.clearSearch}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>` : S}
      </div>
      <button class="btn import" @click=${() => T(Ze)}>
        <ha-icon icon="mdi:web-plus"></ha-icon><span class="new-label">${e("import")}</span>
      </button>
      <button class="btn primary new" @click=${() => T(Xe)}>
        <ha-icon icon="mdi:plus"></ha-icon><span class="new-label">${e("new_recipe")}</span>
      </button>
      </div>
      ${this.categories.length ? x`<div class="filters" role="group">
            <button
              class="btn"
              aria-pressed=${String(this.category === null)}
              @click=${() => this.selectCategory(null)}
            >
              ${e("all_categories")}
            </button>
            ${this.categories.map((e) => x`<button
                class="btn"
                data-category=${e.name}
                aria-pressed=${String(this.category?.toLowerCase() === e.name.toLowerCase())}
                @click=${() => this.selectCategory(e.name)}
              >
                ${e.name} <span class="muted">${e.count}</span>
              </button>`)}
          </div>` : S}
      ${this.error ? x`<p class="message error">${this.error}</p>` : this.renderRecipes(e)}
    `;
	}
	renderRecipes(e) {
		return this.loading && !this.recipes.length ? x`<p class="message">${e("loading")}</p>` : this.recipes.length ? x`<div class="grid">
      ${this.recipes.map((t) => {
			let n = vr(t);
			return x`<a
          class="card recipe"
          href=${Je(t.id)}
          @click=${(e) => this.open(e, t.id)}
        >
          <div class="picture">
            ${t.thumbnail_url ? x`<img src=${t.thumbnail_url} alt="" loading="lazy" />` : x`<ha-icon icon="mdi:silverware-fork-knife"></ha-icon>`}
          </div>
          <div class="body">
            <h3>${t.name}</h3>
            ${n == null ? S : x`<div class="muted time">
                  <ha-icon icon="mdi:clock-outline"></ha-icon>${Q(n, e)}
                </div>`}
            ${t.matched_ingredients?.length ? x`<ul class="matches">
                  ${t.matched_ingredients.map((e) => x`<li>
                      ${at(e, this.resultsQuery).map((e) => e.match ? x`<mark>${e.text}</mark>` : e.text)}
                    </li>`)}
                </ul>` : S}
            <div class="chips">${t.categories.map((e) => x`<span class="chip">${e}</span>`)}</div>
          </div>
        </a>`;
		})}
    </div>` : this.query.trim() || this.category ? x`<p class="message">${e("no_results")}</p>` : x`<div class="message">
            <ha-icon class="big" icon="mdi:chef-hat"></ha-icon>
            <h2>${e("no_recipes")}</h2>
            <p>${e("no_recipes_hint")}</p>
            <button class="btn primary" @click=${() => T(Xe)}>
              <ha-icon icon="mdi:plus"></ha-icon>${e("new_recipe")}
            </button>
          </div>`;
	}
	static {
		this.styles = [E, o`
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
      .top .new,
      .top .import {
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
      .picture img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .picture {
        overflow: hidden;
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
customElements.get("cookbook-recipe-list") || customElements.define("cookbook-recipe-list", Mr);
// src/quantity.ts
var Nr = {
	"½": 1 / 2,
	"¼": 1 / 4,
	"¾": 3 / 4,
	"⅓": 1 / 3,
	"⅔": 2 / 3,
	"⅛": 1 / 8
}, Pr = Object.keys(Nr).join(""), Fr = `(?:\\d+\\s+\\d+/\\d+|\\d+/\\d+|\\d+(?:[.,]\\d+)?(?:\\s?[${Pr}])?|[${Pr}])`, Ir = RegExp(`^(\\s*)(${Fr})(?:(\\s*(?:à|-|–|ou)\\s*)(${Fr}))?`, "i"), Lr = /^\s?(?:kg|g|gr|mg|ml|cl|dl|l|litres?|grammes?|kilos?|kilogrammes?|millilitres?|centilitres?)(?![\p{L}])/iu;
function Rr(e) {
	let t = e.trim(), n = /^(\d+)\s+(\d+)\/(\d+)$/.exec(t);
	if (n) return Number(n[1]) + Number(n[2]) / Number(n[3]);
	let r = /^(\d+)\/(\d+)$/.exec(t);
	if (r) return Number(r[1]) / Number(r[2]);
	let i = t.at(-1);
	if (i in Nr) {
		let e = t.slice(0, -1).trim();
		return (e ? Number(e) : 0) + Nr[i];
	}
	return Number(t.replace(",", "."));
}
function zr(e) {
	let t = Ir.exec(e);
	if (!t) return null;
	let [n, r, i, a, o] = t, s = [Rr(i)];
	if (o !== void 0 && s.push(Rr(o)), s.some((e) => !Number.isFinite(e) || e <= 0)) return null;
	let c = e.slice(n.length);
	return {
		indent: r,
		values: s,
		separator: a ?? "",
		rest: c,
		metric: Lr.test(c)
	};
}
var Br = [
	[0, ""],
	[1 / 4, "¼"],
	[1 / 3, "⅓"],
	[1 / 2, "½"],
	[2 / 3, "⅔"],
	[3 / 4, "¾"],
	[1, ""]
];
function Vr(e) {
	if (e >= 10) return String(Math.round(e));
	let t = Math.floor(e), [n, r] = Br.reduce((n, r) => Math.abs(e - t - r[0]) < Math.abs(e - t - n[0]) ? r : n);
	return n === 1 && (t += 1), t === 0 && !r ? "¼" : `${t || ""}${r}`;
}
function Hr(e, t) {
	let n, r = 0;
	if (e >= 100) n = Math.round(e / 5) * 5;
	else if (e >= 10) n = Math.round(e * 2) / 2, r = 1;
	else {
		let t = Math.round(e * 4) / 4;
		r = Math.abs(t - e) < .01 ? 2 : 1, n = r === 2 ? t : Math.round(e * 10) / 10;
	}
	return new Intl.NumberFormat(t, { maximumFractionDigits: r }).format(n);
}
function Ur(e, t, n) {
	let r = zr(e);
	return r ? {
		indent: r.indent,
		quantity: r.values.map((e) => r.metric ? Hr(e * t, n) : Vr(e * t)).join(r.separator),
		rest: r.rest
	} : null;
}
function Wr(e, t, n) {
	if (t === 1) return e;
	let r = Ur(e, t, n);
	return r ? `${r.indent}${r.quantity}${r.rest}` : e;
}
// src/print.ts
var $ = (e) => e.replace(/[&<>"']/g, (e) => `&#${e.charCodeAt(0)};`);
function Gr(e, t, n) {
	return br(e).map((e) => `${e.section ? `<h3>${$(e.section)}</h3>` : ""}<${t}>${e.items.map((e) => `<li>${$(n(e))}</li>`).join("")}</${t}>`).join("");
}
function Kr(e, t, n, r = e.servings) {
	let i = e.servings && r ? r / e.servings : 1, a = (e) => Wr(e.text, i, n), o = [
		["prep_time", Q(e.prep_time, t)],
		["cook_time", Q(e.cook_time, t)],
		["total_time", Q(vr(e), t)],
		["servings", xr(r, e.servings_unit)]
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
  .photo { display: block; max-height: 6cm; max-width: 100%; margin: 0 0 10pt; border-radius: 4pt; object-fit: cover; }
</style>
</head>
<body>
${e.image_url ? `<img class="photo" src="${$(e.image_url)}" alt="">` : ""}
<h1>${$(e.name)}</h1>
${e.categories.length ? `<div class="categories">${$(e.categories.join(" · "))}</div>` : ""}
${o ? `<div class="meta">${o}</div>` : ""}
${c(e.description)}
${s(t("ingredients"), e.ingredients.length ? Gr(e.ingredients, "ul", a) : "")}
${s(t("steps"), e.steps.length ? Gr(e.steps, "ol", (e) => e.text) : "")}
${s(t("notes"), c(e.notes))}
${e.source_url ? `<p class="source">${$(e.source_url)}</p>` : ""}
</body>
</html>`;
}
function qr(e, t, n, r = e.servings) {
	let i = document.createElement("iframe");
	i.style.cssText = "position:fixed;width:0;height:0;border:0;visibility:hidden", i.srcdoc = Kr(e, t, n, r), i.addEventListener("load", () => {
		let e = i.contentWindow;
		e && (e.addEventListener("afterprint", () => i.remove()), setTimeout(() => i.remove(), 6e4), e.focus(), e.print());
	}), document.body.append(i);
}
// src/views/recipe-view.ts
var Jr = "cookbook:large-text", Yr = 1e3, Xr = (e) => `cookbook:checks:${e}`;
function Zr(e) {
	try {
		return localStorage.getItem(e);
	} catch {
		return null;
	}
}
function Qr(e, t) {
	try {
		t === null ? localStorage.removeItem(e) : localStorage.setItem(e, t);
	} catch {}
}
var $r = class e extends C {
	constructor(...e) {
		super(...e), this.recipeId = "", this.recipe = null, this.servings = null, this.error = null, this.notFound = !1, this.checked = /* @__PURE__ */ new Set(), this.largeText = Zr(Jr) === "1", this.awake = !1, this.confirmDelete = !1, this.wakeLock = null, this.onVisibilityChange = () => {
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
		this.recipe = null, this.error = null, this.notFound = !1, this.checked = new Set(JSON.parse(Zr(Xr(e)) ?? "[]"));
		try {
			let t = await new tt(this.hass).get(e);
			if (e !== this.recipeId) return;
			this.recipe = t;
			let n = Number(new URLSearchParams(location.search).get("parts"));
			this.servings = t.servings && Number.isInteger(n) && n >= 1 && n <= Yr ? n : t.servings;
		} catch (t) {
			if (e !== this.recipeId) return;
			if (D(t) && t.code === "not_found") this.notFound = !0;
			else {
				let e = D(t) ? t.message : String(t);
				this.error = w(this.hass)("error", { message: e });
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
		this.servings = Math.min(Yr, Math.max(1, e));
		let n = new URLSearchParams(location.search);
		this.servings === t ? n.delete("parts") : n.set("parts", String(this.servings));
		let r = n.size ? `?${n}` : "";
		history.replaceState(history.state, "", `${location.pathname}${r}`);
	}
	toggleCheck(e) {
		let t = new Set(this.checked);
		t.has(e) ? t.delete(e) : t.add(e), this.checked = t, Qr(Xr(this.recipeId), t.size ? JSON.stringify([...t]) : null);
	}
	resetChecks() {
		this.checked = /* @__PURE__ */ new Set(), Qr(Xr(this.recipeId), null);
	}
	toggleLargeText() {
		this.largeText = !this.largeText, Qr(Jr, this.largeText ? "1" : null);
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
			await new tt(this.hass).delete(this.recipeId), Qr(Xr(this.recipeId), null), T(et(), { replace: !0 });
		} catch (e) {
			let t = D(e) ? e.message : String(e);
			this.error = w(this.hass)("error", { message: t });
		}
	}
	render() {
		let e = w(this.hass);
		return this.notFound ? x`<div class="message">
        <p>${e("recipe_not_found")}</p>
        <button class="btn" @click=${() => T(et())}>${e("back_to_list")}</button>
      </div>` : this.error ? x`<p class="message error">${this.error}</p>` : this.recipe ? this.renderRecipe(this.recipe, e) : x`<p class="message">${e("loading")}</p>`;
	}
	renderRecipe(t, n) {
		let r = Ge(this.hass), i = [
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
				value: Q(vr(t), n)
			}
		], a = yr(t.updated_at, r);
		return x`
      <div class="actions">
        <button class="btn compact" title=${n("larger_text")} aria-pressed=${String(this.largeText)} @click=${this.toggleLargeText}>
          <ha-icon icon="mdi:format-size"></ha-icon><span class="label">${n("larger_text")}</span>
        </button>
        ${e.wakeLockSupported ? x`<button class="btn compact awake" title=${n("keep_awake")} aria-pressed=${String(this.awake)} @click=${this.toggleAwake}>
              <ha-icon icon="mdi:cellphone-screenshot"></ha-icon><span class="label">${n("keep_awake")}</span>
            </button>` : S}
        ${this.checked.size ? x`<button class="btn compact reset" title=${n("reset_checks")} @click=${this.resetChecks}>
              <ha-icon icon="mdi:checkbox-blank-off-outline"></ha-icon><span class="label">${n("reset_checks")}</span>
            </button>` : S}
        <span class="spacer"></span>
        <button class="btn primary edit" @click=${() => T(Ye(t.id))}>
          <ha-icon icon="mdi:pencil"></ha-icon>${n("edit")}
        </button>
        <button class="btn compact print" title=${n("print")} @click=${() => qr(t, n, r, this.servings)}>
          <ha-icon icon="mdi:printer"></ha-icon><span class="label">${n("print")}</span>
        </button>
        ${this.hass.user?.is_admin ? x`<button class="btn compact danger delete" title=${n("delete")} @click=${() => this.confirmDelete = !0}>
              <ha-icon icon="mdi:delete-outline"></ha-icon><span class="label">${n("delete")}</span>
            </button>` : S}
      </div>

      <article class="card">
        ${t.image_url ? x`<img class="hero" src=${t.image_url} alt=${t.name} />` : S}
        <h1>${t.name}</h1>
        ${t.categories.length ? x`<div class="chips">${t.categories.map((e) => x`<span class="chip">${e}</span>`)}</div>` : S}
        <div class="meta">
          ${i.filter((e) => e.value).map((e) => x`<div class="meta-item">
                <ha-icon icon=${e.icon}></ha-icon>
                <div><div class="muted label">${n(e.key)}</div><div>${e.value}</div></div>
              </div>`)}
          ${this.renderServings(t, n)}
        </div>
        ${t.description ? x`<p class="text description">${t.description}</p>` : S}

        <div class="columns">
          ${t.ingredients.length ? x`<section class="ingredients">
                <h2>${n("ingredients")}</h2>
                ${this.renderItems(t.ingredients, "i", r)}
              </section>` : S}
          ${t.steps.length ? x`<section class="steps">
                <h2>${n("steps")}</h2>
                ${this.renderItems(t.steps, "s", r)}
              </section>` : S}
        </div>

        ${t.notes ? x`<section class="notes"><h2>${n("notes")}</h2><p class="text">${t.notes}</p></section>` : S}

        <footer class="muted">
          ${t.source_url ? x`<a href=${t.source_url} target="_blank" rel="noopener noreferrer">
                <ha-icon icon="mdi:open-in-new"></ha-icon>${n("view_source")}
              </a>` : S}
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
		if (!e.servings) return e.servings_unit ? x`<div class="meta-item">
            <ha-icon icon="mdi:account-group-outline"></ha-icon>
            <div><div class="muted label">${t("servings")}</div><div>${e.servings_unit}</div></div>
          </div>` : S;
		let n = this.servings ?? e.servings;
		return x`<div class="meta-item servings">
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
          <span class="count" aria-live="polite">${xr(n, e.servings_unit)}</span>
          <button class="step more" aria-label=${t("more_servings")} @click=${() => this.setServings((this.servings ?? e.servings) + 1)}>
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>
          ${n === e.servings ? S : x`<button
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
		let n = this.factor === 1 ? null : Ur(e, this.factor, t);
		return n ? x`${n.indent}<strong class="scaled">${n.quantity}</strong>${n.rest}` : e;
	}
	renderItems(e, t, n) {
		let r = 0;
		return br(e).map((e) => x`
        ${e.section ? x`<h3>${e.section}</h3>` : S}
        <ul class=${t === "s" ? "numbered" : ""}>
          ${e.items.map((e) => {
			let i = `${t}${r++}`, a = this.checked.has(i);
			return x`<li>
              <label class=${a ? "done" : ""}>
                <input type="checkbox" .checked=${a} @change=${() => this.toggleCheck(i)} />
                ${t === "s" ? x`<span class="number">${r}</span>` : S}
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
		this.styles = [E, o`
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
      /* Touch screens (phones and tablets, whatever their width): icons only, the label
         stays as the accessible name and in the tooltip. */
      @media (pointer: coarse) {
        .btn.compact {
          justify-content: center;
          min-width: 44px;
          min-height: 44px;
          padding: 0;
        }
        .btn.compact .label {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }
      }
      .hero {
        display: block;
        width: calc(100% + 48px);
        max-height: 420px;
        margin: -24px -24px 20px;
        object-fit: cover;
        border-radius: var(--cb-radius) var(--cb-radius) 0 0;
      }
      article {
        overflow: hidden;
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
        .hero {
          width: calc(100% + 32px);
          max-height: 260px;
          margin: -16px -16px 16px;
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
customElements.get("cookbook-recipe-view") || customElements.define("cookbook-recipe-view", $r);
// src/cookbook-panel.ts
var ei = class extends C {
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
		let t = e.name === "edit" ? Je(e.id) : et(), n = this.renderRoot.querySelector("cookbook-recipe-editor, cookbook-recipe-import");
		n ? n.requestLeave(t) : T(t);
	}
	render() {
		if (!this.hass) return S;
		let e = w(this.hass), t = qe(this.route?.path ?? "");
		return x`
      <header class="toolbar">
        ${this.narrow ? x`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : S}
        ${t.name === "list" ? S : x`<button class="icon-btn back" aria-label=${e("back")} @click=${() => this.back(t)}>
              <ha-icon icon="mdi:arrow-left"></ha-icon>
            </button>`}
        <div class="title">Cookbook</div>
      </header>
      <main>
        ${t.name === "list" ? x`<cookbook-recipe-list .hass=${this.hass}></cookbook-recipe-list>` : t.name === "recipe" ? x`<cookbook-recipe-view .hass=${this.hass} .recipeId=${t.id}></cookbook-recipe-view>` : t.name === "new" ? x`<cookbook-recipe-editor .hass=${this.hass}></cookbook-recipe-editor>` : t.name === "import" ? x`<cookbook-recipe-import .hass=${this.hass}></cookbook-recipe-import>` : t.name === "edit" ? x`<cookbook-recipe-editor .hass=${this.hass} .recipeId=${t.id}></cookbook-recipe-editor>` : x`<div class="message">
                <p>${e("page_not_found")}</p>
                <button class="btn" @click=${() => T(Ke)}>${e("back_to_list")}</button>
              </div>`}
      </main>
    `;
	}
	static {
		this.styles = [E, o`
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
customElements.get("cookbook-panel") || customElements.define("cookbook-panel", ei);
