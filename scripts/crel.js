((e) => {
  const t = "function",
    n = "isNode",
    r = document,
    o = (e, t) => typeof e === t,
    i = (e, t) => {
      null !== t &&
        (Array.isArray(t)
          ? t.map((t) => i(e, t))
          : // i ve changed append with prepend so it ll be added at first
            (a[n](t) || (t = r.createTextNode(t)), e.prepend(t)));
    };
  function a(e, f) {
    let l,
      d,
      s = arguments,
      c = 1;
    if (
      ((e = a.isElement(e) ? e : r.createElement(e)),
      o(f, "object") && !a[n](f) && !Array.isArray(f))
    )
      for (l in (c++, f))
        (d = f[l]),
          (l = a.attrMap[l] || l),
          o(l, t) ? l(e, d) : o(d, t) ? (e[l] = d) : e.setAttribute(l, d);
    for (; c < s.length; c++) i(e, s[c]);
    return e;
  }
  (a.attrMap = {}),
    (a.isElement = (e) => e instanceof Element),
    (a[n] = (e) => e instanceof Node),
    (a.proxy = new Proxy(a, {
      get: (e, t) => (!(t in a) && (a[t] = a.bind(null, t)), a[t]),
    })),
    e(a, t);
})((e, t) => {
  "object" == typeof exports
    ? (module.exports = e)
    : typeof define === t && define.amd
    ? define(e)
    : (this.crel = e);
});
