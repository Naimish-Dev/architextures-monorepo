!(function () {
  const edge = navigator.userAgent.match(/Edge\/\d\d\.\d+$/);
  let baseUrl;
  function createBlob(source, type = "text/javascript") {
    return URL.createObjectURL(new Blob([source], { type: type }));
  }
  const noop = () => {},
    baseEl = document.querySelector("base[href]");
  if (
    (baseEl && (baseUrl = baseEl.href),
    !baseUrl && "undefined" != typeof location)
  ) {
    baseUrl = location.href.split("#")[0].split("?")[0];
    const lastSepIndex = baseUrl.lastIndexOf("/");
    -1 !== lastSepIndex && (baseUrl = baseUrl.slice(0, lastSepIndex + 1));
  }
  function isURL(url) {
    try {
      return new URL(url), !0;
    } catch (e) {
      return !1;
    }
  }
  const backslashRegEx = /\\/g;
  function resolveIfNotPlainOrUrl(relUrl, parentUrl) {
    if (
      ((parentUrl = parentUrl && parentUrl.split("#")[0].split("?")[0]),
      -1 !== relUrl.indexOf("\\") &&
        (relUrl = relUrl.replace(backslashRegEx, "/")),
      "/" === relUrl[0] && "/" === relUrl[1])
    )
      return parentUrl.slice(0, parentUrl.indexOf(":") + 1) + relUrl;
    if (
      ("." === relUrl[0] &&
        ("/" === relUrl[1] ||
          ("." === relUrl[1] &&
            ("/" === relUrl[2] || (2 === relUrl.length && (relUrl += "/")))) ||
          (1 === relUrl.length && (relUrl += "/")))) ||
      "/" === relUrl[0]
    ) {
      const parentProtocol = parentUrl.slice(0, parentUrl.indexOf(":") + 1);
      let pathname;
      if (
        ("/" === parentUrl[parentProtocol.length + 1]
          ? "file:" !== parentProtocol
            ? ((pathname = parentUrl.slice(parentProtocol.length + 2)),
              (pathname = pathname.slice(pathname.indexOf("/") + 1)))
            : (pathname = parentUrl.slice(8))
          : (pathname = parentUrl.slice(
              parentProtocol.length + ("/" === parentUrl[parentProtocol.length])
            )),
        "/" === relUrl[0])
      )
        return (
          parentUrl.slice(0, parentUrl.length - pathname.length - 1) + relUrl
        );
      const segmented =
          pathname.slice(0, pathname.lastIndexOf("/") + 1) + relUrl,
        output = [];
      let segmentIndex = -1;
      for (let i = 0; i < segmented.length; i++)
        -1 !== segmentIndex
          ? "/" === segmented[i] &&
            (output.push(segmented.slice(segmentIndex, i + 1)),
            (segmentIndex = -1))
          : "." === segmented[i]
          ? "." !== segmented[i + 1] ||
            ("/" !== segmented[i + 2] && i + 2 !== segmented.length)
            ? "/" === segmented[i + 1] || i + 1 === segmented.length
              ? (i += 1)
              : (segmentIndex = i)
            : (output.pop(), (i += 2))
          : (segmentIndex = i);
      return (
        -1 !== segmentIndex && output.push(segmented.slice(segmentIndex)),
        parentUrl.slice(0, parentUrl.length - pathname.length) + output.join("")
      );
    }
  }
  function resolveUrl(relUrl, parentUrl) {
    return (
      resolveIfNotPlainOrUrl(relUrl, parentUrl) ||
      (-1 !== relUrl.indexOf(":")
        ? relUrl
        : resolveIfNotPlainOrUrl("./" + relUrl, parentUrl))
    );
  }
  function resolveAndComposePackages(
    packages,
    outPackages,
    baseUrl,
    parentMap
  ) {
    for (let p in packages) {
      const resolvedLhs = resolveIfNotPlainOrUrl(p, baseUrl) || p;
      if (outPackages[resolvedLhs])
        throw new Error(
          `Dynamic import map rejected: Overrides entry "${resolvedLhs}" from ${outPackages[resolvedLhs]} to ${packages[resolvedLhs]}.`
        );
      let target = packages[p];
      if ("string" != typeof target) continue;
      const mapped = resolveImportMap(
        parentMap,
        resolveIfNotPlainOrUrl(target, baseUrl) || target,
        baseUrl
      );
      mapped
        ? (outPackages[resolvedLhs] = mapped)
        : targetWarning(p, packages[p], "bare specifier did not resolve");
    }
  }
  function resolveAndComposeImportMap(json, baseUrl, parentMap) {
    const outMap = {
      imports: Object.assign({}, parentMap.imports),
      scopes: Object.assign({}, parentMap.scopes),
    };
    if (
      (json.imports &&
        resolveAndComposePackages(
          json.imports,
          outMap.imports,
          baseUrl,
          parentMap
        ),
      json.scopes)
    )
      for (let s in json.scopes) {
        const resolvedScope = resolveUrl(s, baseUrl);
        resolveAndComposePackages(
          json.scopes[s],
          outMap.scopes[resolvedScope] || (outMap.scopes[resolvedScope] = {}),
          baseUrl,
          parentMap
        );
      }
    return outMap;
  }
  function getMatch(path, matchObj) {
    if (matchObj[path]) return path;
    let sepIndex = path.length;
    do {
      const segment = path.slice(0, sepIndex + 1);
      if (segment in matchObj) return segment;
    } while (-1 !== (sepIndex = path.lastIndexOf("/", sepIndex - 1)));
  }
  function applyPackages(id, packages) {
    const pkgName = getMatch(id, packages);
    if (pkgName) {
      const pkg = packages[pkgName];
      if (null === pkg) return;
      if (!(id.length > pkgName.length && "/" !== pkg[pkg.length - 1]))
        return pkg + id.slice(pkgName.length);
      targetWarning(pkgName, pkg, "should have a trailing '/'");
    }
  }
  function targetWarning(match, target, msg) {
    console.warn(
      "Package target " +
        msg +
        ", resolving target '" +
        target +
        "' for " +
        match
    );
  }
  function resolveImportMap(importMap, resolvedOrPlain, parentUrl) {
    let scopeUrl = parentUrl && getMatch(parentUrl, importMap.scopes);
    for (; scopeUrl; ) {
      const packageResolution = applyPackages(
        resolvedOrPlain,
        importMap.scopes[scopeUrl]
      );
      if (packageResolution) return packageResolution;
      scopeUrl = getMatch(
        scopeUrl.slice(0, scopeUrl.lastIndexOf("/")),
        importMap.scopes
      );
    }
    return (
      applyPackages(resolvedOrPlain, importMap.imports) ||
      (-1 !== resolvedOrPlain.indexOf(":") && resolvedOrPlain)
    );
  }
  const optionsScript = document.querySelector("script[type=esms-options]"),
    esmsInitOptions = optionsScript
      ? JSON.parse(optionsScript.innerHTML)
      : self.esmsInitOptions
      ? self.esmsInitOptions
      : {};
  let shimMode = !!esmsInitOptions.shimMode;
  const resolveHook = globalHook(shimMode && esmsInitOptions.resolve),
    skip = esmsInitOptions.skip ? new RegExp(esmsInitOptions.skip) : null;
  let nonce = esmsInitOptions.nonce;
  if (!nonce) {
    const nonceElement = document.querySelector("script[nonce]");
    nonceElement &&
      (nonce = nonceElement.nonce || nonceElement.getAttribute("nonce"));
  }
  const onerror = globalHook(esmsInitOptions.onerror || noop),
    onpolyfill = globalHook(esmsInitOptions.onpolyfill || noop),
    {
      revokeBlobURLs: revokeBlobURLs,
      noLoadEventRetriggers: noLoadEventRetriggers,
    } = esmsInitOptions,
    fetchHook = esmsInitOptions.fetch
      ? globalHook(esmsInitOptions.fetch)
      : fetch;
  function globalHook(name) {
    return "string" == typeof name ? self[name] : name;
  }
  const enable = Array.isArray(esmsInitOptions.polyfillEnable)
      ? esmsInitOptions.polyfillEnable
      : [],
    cssModulesEnabled = enable.includes("css-modules"),
    jsonModulesEnabled = enable.includes("json-modules");
  function setShimMode() {
    shimMode = !0;
  }
  let err;
  function dynamicImportScript(url, { errUrl: errUrl = url } = {}) {
    err = void 0;
    const src = createBlob(`import*as m from'${url}';self._esmsi=m`),
      s = Object.assign(document.createElement("script"), {
        type: "module",
        src: src,
      });
    s.setAttribute("nonce", nonce), s.setAttribute("noshim", "");
    const p = new Promise((resolve, reject) => {
      function cb(_err) {
        document.head.removeChild(s),
          self._esmsi
            ? (resolve(self._esmsi, baseUrl), (self._esmsi = void 0))
            : (reject(
                (!(_err instanceof Event) && _err) ||
                  (err && err.error) ||
                  new Error(
                    `Error loading or executing the graph of ${errUrl} (check the console for ${src}).`
                  )
              ),
              (err = void 0));
      }
      s.addEventListener("error", cb), s.addEventListener("load", cb);
    });
    return document.head.appendChild(s), p;
  }
  window.addEventListener("error", (_err) => (err = _err));
  let dynamicImport = dynamicImportScript;
  const supportsDynamicImportCheck = dynamicImportScript(
    createBlob("export default u=>import(u)")
  ).then(
    (_dynamicImport) => (
      _dynamicImport && (dynamicImport = _dynamicImport.default),
      !!_dynamicImport
    ),
    noop
  );
  let supportsJsonAssertions = !1,
    supportsCssAssertions = !1,
    supportsImportMeta = !1,
    supportsImportMaps = !1,
    supportsDynamicImport = !1;
  const featureDetectionPromise = Promise.resolve(
    supportsDynamicImportCheck
  ).then((_supportsDynamicImport) => {
    if (_supportsDynamicImport)
      return (
        (supportsDynamicImport = !0),
        Promise.all([
          dynamicImport(createBlob("import.meta")).then(
            () => (supportsImportMeta = !0),
            noop
          ),
          cssModulesEnabled &&
            dynamicImport(
              createBlob('import"data:text/css,{}"assert{type:"css"}')
            ).then(() => (supportsCssAssertions = !0), noop),
          jsonModulesEnabled &&
            dynamicImport(
              createBlob('import"data:text/json,{}"assert{type:"json"}')
            ).then(() => (supportsJsonAssertions = !0), noop),
          new Promise((resolve) => {
            self._$s = (v) => {
              document.head.removeChild(iframe),
                v && (supportsImportMaps = !0),
                delete self._$s,
                resolve();
            };
            const iframe = document.createElement("iframe");
            (iframe.style.display = "none"),
              document.head.appendChild(iframe),
              (iframe.src = createBlob(
                `<script type=importmap nonce="${nonce}">{"imports":{"x":"data:text/javascript,"}}<\/script><script nonce="${nonce}">import('x').then(()=>1,()=>0).then(v=>parent._$s(v))<\/script>`,
                "text/html"
              ));
          }),
        ])
      );
  });
  let e,
    r,
    a,
    i = 4194304;
  const s = 1 === new Uint8Array(new Uint16Array([1]).buffer)[0];
  let t, f, c$1;
  function parse(k, l = "@") {
    if (((t = k), (f = l), t.length > i || !e)) {
      for (; t.length > i; ) i *= 2;
      (r = new ArrayBuffer(4 * i)),
        (e = (function (e, r, a) {
          "use asm";
          var i = new e.Int8Array(a),
            s = new e.Int16Array(a),
            t = new e.Int32Array(a),
            f = new e.Uint8Array(a),
            c = new e.Uint16Array(a),
            n = 816;
          function b(e) {
            e = e | 0;
            var r = 0,
              a = 0,
              f = 0,
              b = 0,
              l = 0;
            l = n;
            n = (n + 14336) | 0;
            b = l;
            i[589] = 1;
            s[291] = 0;
            s[292] = 0;
            s[293] = -1;
            t[15] = t[2];
            i[590] = 0;
            t[14] = 0;
            i[588] = 0;
            t[16] = l + 10240;
            t[17] = l + 2048;
            i[591] = 0;
            e = ((t[3] | 0) + -2) | 0;
            t[18] = e;
            r = (e + (t[12] << 1)) | 0;
            t[19] = r;
            e: while (1) {
              a = (e + 2) | 0;
              t[18] = a;
              if (e >>> 0 >= r >>> 0) {
                f = 18;
                break;
              }
              r: do {
                switch (s[a >> 1] | 0) {
                  case 9:
                  case 10:
                  case 11:
                  case 12:
                  case 13:
                  case 32:
                    break;
                  case 101: {
                    if (
                      (
                        ((s[292] | 0) == 0 ? R(a) | 0 : 0)
                          ? B((e + 4) | 0, 120, 112, 111, 114, 116) | 0
                          : 0
                      )
                        ? (u(), (i[589] | 0) == 0)
                        : 0
                    ) {
                      f = 9;
                      break e;
                    } else f = 17;
                    break;
                  }
                  case 105: {
                    if (
                      R(a) | 0 ? B((e + 4) | 0, 109, 112, 111, 114, 116) | 0 : 0
                    ) {
                      k();
                      f = 17;
                    } else f = 17;
                    break;
                  }
                  case 59: {
                    f = 17;
                    break;
                  }
                  case 47:
                    switch (s[(e + 4) >> 1] | 0) {
                      case 47: {
                        G();
                        break r;
                      }
                      case 42: {
                        p(1);
                        break r;
                      }
                      default: {
                        f = 16;
                        break e;
                      }
                    }
                  default: {
                    f = 16;
                    break e;
                  }
                }
              } while (0);
              if ((f | 0) == 17) {
                f = 0;
                t[15] = t[18];
              }
              e = t[18] | 0;
              r = t[19] | 0;
            }
            if ((f | 0) == 9) {
              e = t[18] | 0;
              t[15] = e;
              f = 19;
            } else if ((f | 0) == 16) {
              i[589] = 0;
              t[18] = e;
              f = 19;
            } else if ((f | 0) == 18)
              if (!(i[588] | 0)) {
                e = a;
                f = 19;
              } else e = 0;
            do {
              if ((f | 0) == 19) {
                e: while (1) {
                  r = (e + 2) | 0;
                  t[18] = r;
                  a = r;
                  if (e >>> 0 >= (t[19] | 0) >>> 0) {
                    f = 75;
                    break;
                  }
                  r: do {
                    switch (s[r >> 1] | 0) {
                      case 9:
                      case 10:
                      case 11:
                      case 12:
                      case 13:
                      case 32:
                        break;
                      case 101: {
                        if (
                          ((s[292] | 0) == 0 ? R(r) | 0 : 0)
                            ? B((e + 4) | 0, 120, 112, 111, 114, 116) | 0
                            : 0
                        ) {
                          u();
                          f = 74;
                        } else f = 74;
                        break;
                      }
                      case 105: {
                        if (
                          R(r) | 0
                            ? B((e + 4) | 0, 109, 112, 111, 114, 116) | 0
                            : 0
                        ) {
                          k();
                          f = 74;
                        } else f = 74;
                        break;
                      }
                      case 99: {
                        if (
                          (R(r) | 0 ? z((e + 4) | 0, 108, 97, 115, 115) | 0 : 0)
                            ? Z(s[(e + 12) >> 1] | 0) | 0
                            : 0
                        ) {
                          i[591] = 1;
                          f = 74;
                        } else f = 74;
                        break;
                      }
                      case 40: {
                        r = t[15] | 0;
                        a = t[17] | 0;
                        f = s[292] | 0;
                        s[292] = ((f + 1) << 16) >> 16;
                        t[(a + ((f & 65535) << 2)) >> 2] = r;
                        f = 74;
                        break;
                      }
                      case 41: {
                        e = s[292] | 0;
                        if (!((e << 16) >> 16)) {
                          f = 36;
                          break e;
                        }
                        f = ((e + -1) << 16) >> 16;
                        s[292] = f;
                        e = t[11] | 0;
                        if (
                          (e | 0) != 0
                            ? (t[(e + 20) >> 2] | 0) ==
                              (t[((t[17] | 0) + ((f & 65535) << 2)) >> 2] | 0)
                            : 0
                        ) {
                          r = (e + 4) | 0;
                          if (!(t[r >> 2] | 0)) t[r >> 2] = a;
                          t[(e + 12) >> 2] = a;
                          t[11] = 0;
                          f = 74;
                        } else f = 74;
                        break;
                      }
                      case 123: {
                        f = t[15] | 0;
                        a = t[8] | 0;
                        e = f;
                        do {
                          if (
                            ((s[f >> 1] | 0) == 41) & ((a | 0) != 0)
                              ? (t[(a + 4) >> 2] | 0) == (f | 0)
                              : 0
                          ) {
                            r = t[9] | 0;
                            t[8] = r;
                            if (!r) {
                              t[4] = 0;
                              break;
                            } else {
                              t[(r + 28) >> 2] = 0;
                              break;
                            }
                          }
                        } while (0);
                        r = s[292] | 0;
                        f = r & 65535;
                        i[(b + f) >> 0] = i[591] | 0;
                        i[591] = 0;
                        a = t[17] | 0;
                        s[292] = ((r + 1) << 16) >> 16;
                        t[(a + (f << 2)) >> 2] = e;
                        f = 74;
                        break;
                      }
                      case 125: {
                        e = s[292] | 0;
                        if (!((e << 16) >> 16)) {
                          f = 49;
                          break e;
                        }
                        a = ((e + -1) << 16) >> 16;
                        s[292] = a;
                        r = s[293] | 0;
                        if ((e << 16) >> 16 != (r << 16) >> 16)
                          if (
                            ((r << 16) >> 16 != -1) &
                            ((a & 65535) < (r & 65535))
                          ) {
                            f = 53;
                            break e;
                          } else {
                            f = 74;
                            break r;
                          }
                        else {
                          a = t[16] | 0;
                          f = (((s[291] | 0) + -1) << 16) >> 16;
                          s[291] = f;
                          s[293] = s[(a + ((f & 65535) << 1)) >> 1] | 0;
                          h();
                          f = 74;
                          break r;
                        }
                      }
                      case 39: {
                        d(39);
                        f = 74;
                        break;
                      }
                      case 34: {
                        d(34);
                        f = 74;
                        break;
                      }
                      case 47:
                        switch (s[(e + 4) >> 1] | 0) {
                          case 47: {
                            G();
                            break r;
                          }
                          case 42: {
                            p(1);
                            break r;
                          }
                          default: {
                            r = t[15] | 0;
                            a = s[r >> 1] | 0;
                            a: do {
                              if (!(x(a) | 0)) {
                                switch ((a << 16) >> 16) {
                                  case 41:
                                    if (
                                      L(
                                        t[((t[17] | 0) + (c[292] << 2)) >> 2] |
                                          0
                                      ) | 0
                                    ) {
                                      f = 71;
                                      break a;
                                    } else {
                                      f = 68;
                                      break a;
                                    }
                                  case 125:
                                    break;
                                  default: {
                                    f = 68;
                                    break a;
                                  }
                                }
                                e = c[292] | 0;
                                if (
                                  !(y(t[((t[17] | 0) + (e << 2)) >> 2] | 0) | 0)
                                    ? (i[(b + e) >> 0] | 0) == 0
                                    : 0
                                )
                                  f = 68;
                                else f = 71;
                              } else
                                switch ((a << 16) >> 16) {
                                  case 46:
                                    if (
                                      (((s[(r + -2) >> 1] | 0) + -48) & 65535) <
                                      10
                                    ) {
                                      f = 68;
                                      break a;
                                    } else {
                                      f = 71;
                                      break a;
                                    }
                                  case 43:
                                    if ((s[(r + -2) >> 1] | 0) == 43) {
                                      f = 68;
                                      break a;
                                    } else {
                                      f = 71;
                                      break a;
                                    }
                                  case 45:
                                    if ((s[(r + -2) >> 1] | 0) == 45) {
                                      f = 68;
                                      break a;
                                    } else {
                                      f = 71;
                                      break a;
                                    }
                                  default: {
                                    f = 71;
                                    break a;
                                  }
                                }
                            } while (0);
                            a: do {
                              if ((f | 0) == 68) {
                                f = 0;
                                if (!(o(r) | 0)) {
                                  switch ((a << 16) >> 16) {
                                    case 0: {
                                      f = 71;
                                      break a;
                                    }
                                    case 47:
                                      break;
                                    default: {
                                      e = 1;
                                      break a;
                                    }
                                  }
                                  if (!(i[590] | 0)) e = 1;
                                  else f = 71;
                                } else f = 71;
                              }
                            } while (0);
                            if ((f | 0) == 71) {
                              I();
                              e = 0;
                            }
                            i[590] = e;
                            f = 74;
                            break r;
                          }
                        }
                      case 96: {
                        h();
                        f = 74;
                        break;
                      }
                      default:
                        f = 74;
                    }
                  } while (0);
                  if ((f | 0) == 74) {
                    f = 0;
                    t[15] = t[18];
                  }
                  e = t[18] | 0;
                }
                if ((f | 0) == 36) {
                  Y();
                  e = 0;
                  break;
                } else if ((f | 0) == 49) {
                  Y();
                  e = 0;
                  break;
                } else if ((f | 0) == 53) {
                  Y();
                  e = 0;
                  break;
                } else if ((f | 0) == 75) {
                  e =
                    ((s[293] | 0) == -1) &
                    ((s[292] | 0) == 0) &
                    ((i[588] | 0) == 0);
                  break;
                }
              }
            } while (0);
            n = l;
            return e | 0;
          }
          function u() {
            var e = 0,
              r = 0,
              a = 0,
              f = 0,
              c = 0,
              n = 0;
            c = t[18] | 0;
            n = (c + 12) | 0;
            t[18] = n;
            r = w(1) | 0;
            e = t[18] | 0;
            if (!((e | 0) == (n | 0) ? !(S(r) | 0) : 0)) f = 3;
            e: do {
              if ((f | 0) == 3) {
                r: do {
                  switch ((r << 16) >> 16) {
                    case 100: {
                      J(e, (e + 14) | 0);
                      break e;
                    }
                    case 97: {
                      t[18] = e + 10;
                      w(1) | 0;
                      e = t[18] | 0;
                      f = 6;
                      break;
                    }
                    case 102: {
                      f = 6;
                      break;
                    }
                    case 99: {
                      if (
                        z((e + 2) | 0, 108, 97, 115, 115) | 0
                          ? ((a = (e + 10) | 0), F(s[a >> 1] | 0) | 0)
                          : 0
                      ) {
                        t[18] = a;
                        c = w(1) | 0;
                        n = t[18] | 0;
                        H(c) | 0;
                        J(n, t[18] | 0);
                        t[18] = (t[18] | 0) + -2;
                        break e;
                      }
                      e = (e + 4) | 0;
                      t[18] = e;
                      f = 13;
                      break;
                    }
                    case 108:
                    case 118: {
                      f = 13;
                      break;
                    }
                    case 123: {
                      t[18] = e + 2;
                      e = w(1) | 0;
                      a = t[18] | 0;
                      while (1) {
                        if (_(e) | 0) {
                          d(e);
                          e = ((t[18] | 0) + 2) | 0;
                          t[18] = e;
                        } else {
                          H(e) | 0;
                          e = t[18] | 0;
                        }
                        w(1) | 0;
                        e = g(a, e) | 0;
                        if ((e << 16) >> 16 == 44) {
                          t[18] = (t[18] | 0) + 2;
                          e = w(1) | 0;
                        }
                        r = a;
                        a = t[18] | 0;
                        if ((e << 16) >> 16 == 125) {
                          f = 32;
                          break;
                        }
                        if ((a | 0) == (r | 0)) {
                          f = 29;
                          break;
                        }
                        if (a >>> 0 > (t[19] | 0) >>> 0) {
                          f = 31;
                          break;
                        }
                      }
                      if ((f | 0) == 29) {
                        Y();
                        break e;
                      } else if ((f | 0) == 31) {
                        Y();
                        break e;
                      } else if ((f | 0) == 32) {
                        t[18] = a + 2;
                        f = 34;
                        break r;
                      }
                      break;
                    }
                    case 42: {
                      t[18] = e + 2;
                      w(1) | 0;
                      f = t[18] | 0;
                      g(f, f) | 0;
                      f = 34;
                      break;
                    }
                    default: {
                    }
                  }
                } while (0);
                if ((f | 0) == 6) {
                  t[18] = e + 16;
                  e = w(1) | 0;
                  if ((e << 16) >> 16 == 42) {
                    t[18] = (t[18] | 0) + 2;
                    e = w(1) | 0;
                  }
                  n = t[18] | 0;
                  H(e) | 0;
                  J(n, t[18] | 0);
                  t[18] = (t[18] | 0) + -2;
                  break;
                } else if ((f | 0) == 13) {
                  e = (e + 4) | 0;
                  t[18] = e;
                  i[589] = 0;
                  r: while (1) {
                    t[18] = e + 2;
                    n = w(1) | 0;
                    e = t[18] | 0;
                    switch (((H(n) | 0) << 16) >> 16) {
                      case 91:
                      case 123: {
                        f = 15;
                        break r;
                      }
                      default: {
                      }
                    }
                    r = t[18] | 0;
                    if ((r | 0) == (e | 0)) break e;
                    J(e, r);
                    switch (((w(1) | 0) << 16) >> 16) {
                      case 61: {
                        f = 19;
                        break r;
                      }
                      case 44:
                        break;
                      default: {
                        f = 20;
                        break r;
                      }
                    }
                    e = t[18] | 0;
                  }
                  if ((f | 0) == 15) {
                    t[18] = (t[18] | 0) + -2;
                    break;
                  } else if ((f | 0) == 19) {
                    t[18] = (t[18] | 0) + -2;
                    break;
                  } else if ((f | 0) == 20) {
                    t[18] = (t[18] | 0) + -2;
                    break;
                  }
                } else if ((f | 0) == 34) r = w(1) | 0;
                e = t[18] | 0;
                if (
                  (r << 16) >> 16 == 102 ? K((e + 2) | 0, 114, 111, 109) | 0 : 0
                ) {
                  t[18] = e + 8;
                  l(c, w(1) | 0);
                  break;
                }
                t[18] = e + -2;
              }
            } while (0);
            return;
          }
          function k() {
            var e = 0,
              r = 0,
              a = 0,
              f = 0,
              c = 0;
            c = t[18] | 0;
            r = (c + 12) | 0;
            t[18] = r;
            e: do {
              switch (((w(1) | 0) << 16) >> 16) {
                case 40: {
                  r = t[17] | 0;
                  a = s[292] | 0;
                  s[292] = ((a + 1) << 16) >> 16;
                  t[(r + ((a & 65535) << 2)) >> 2] = c;
                  if ((s[t[15] >> 1] | 0) != 46) {
                    v(c, ((t[18] | 0) + 2) | 0, 0, c);
                    t[11] = t[8];
                    t[18] = (t[18] | 0) + 2;
                    switch (((w(1) | 0) << 16) >> 16) {
                      case 39: {
                        d(39);
                        break;
                      }
                      case 34: {
                        d(34);
                        break;
                      }
                      default: {
                        t[18] = (t[18] | 0) + -2;
                        break e;
                      }
                    }
                    t[18] = (t[18] | 0) + 2;
                    switch (((w(1) | 0) << 16) >> 16) {
                      case 44: {
                        c = t[18] | 0;
                        t[((t[8] | 0) + 4) >> 2] = c;
                        t[18] = c + 2;
                        w(1) | 0;
                        c = t[18] | 0;
                        a = t[8] | 0;
                        t[(a + 16) >> 2] = c;
                        i[(a + 24) >> 0] = 1;
                        t[18] = c + -2;
                        break e;
                      }
                      case 41: {
                        s[292] = (((s[292] | 0) + -1) << 16) >> 16;
                        a = t[18] | 0;
                        c = t[8] | 0;
                        t[(c + 4) >> 2] = a;
                        t[(c + 12) >> 2] = a;
                        i[(c + 24) >> 0] = 1;
                        break e;
                      }
                      default: {
                        t[18] = (t[18] | 0) + -2;
                        break e;
                      }
                    }
                  }
                  break;
                }
                case 46: {
                  t[18] = (t[18] | 0) + 2;
                  if (
                    (
                      ((w(1) | 0) << 16) >> 16 == 109
                        ? ((e = t[18] | 0), K((e + 2) | 0, 101, 116, 97) | 0)
                        : 0
                    )
                      ? (s[t[15] >> 1] | 0) != 46
                      : 0
                  )
                    v(c, c, (e + 8) | 0, 2);
                  break;
                }
                case 42:
                case 39:
                case 34: {
                  f = 16;
                  break;
                }
                case 123: {
                  e = t[18] | 0;
                  if (s[292] | 0) {
                    t[18] = e + -2;
                    break e;
                  }
                  while (1) {
                    if (e >>> 0 >= (t[19] | 0) >>> 0) break;
                    e = w(1) | 0;
                    if (!(_(e) | 0)) {
                      if ((e << 16) >> 16 == 125) {
                        f = 31;
                        break;
                      }
                    } else d(e);
                    e = ((t[18] | 0) + 2) | 0;
                    t[18] = e;
                  }
                  if ((f | 0) == 31) t[18] = (t[18] | 0) + 2;
                  w(1) | 0;
                  e = t[18] | 0;
                  if (!(z(e, 102, 114, 111, 109) | 0)) {
                    Y();
                    break e;
                  }
                  t[18] = e + 8;
                  e = w(1) | 0;
                  if (_(e) | 0) {
                    l(c, e);
                    break e;
                  } else {
                    Y();
                    break e;
                  }
                }
                default:
                  if ((t[18] | 0) != (r | 0)) f = 16;
              }
            } while (0);
            do {
              if ((f | 0) == 16) {
                if (s[292] | 0) {
                  t[18] = (t[18] | 0) + -2;
                  break;
                }
                e = t[19] | 0;
                r = t[18] | 0;
                while (1) {
                  if (r >>> 0 >= e >>> 0) {
                    f = 23;
                    break;
                  }
                  a = s[r >> 1] | 0;
                  if (_(a) | 0) {
                    f = 21;
                    break;
                  }
                  f = (r + 2) | 0;
                  t[18] = f;
                  r = f;
                }
                if ((f | 0) == 21) {
                  l(c, a);
                  break;
                } else if ((f | 0) == 23) {
                  Y();
                  break;
                }
              }
            } while (0);
            return;
          }
          function l(e, r) {
            e = e | 0;
            r = r | 0;
            var a = 0,
              i = 0;
            a = ((t[18] | 0) + 2) | 0;
            switch ((r << 16) >> 16) {
              case 39: {
                d(39);
                i = 5;
                break;
              }
              case 34: {
                d(34);
                i = 5;
                break;
              }
              default:
                Y();
            }
            do {
              if ((i | 0) == 5) {
                v(e, a, t[18] | 0, 1);
                t[18] = (t[18] | 0) + 2;
                i = ((w(0) | 0) << 16) >> 16 == 97;
                r = t[18] | 0;
                if (i ? B((r + 2) | 0, 115, 115, 101, 114, 116) | 0 : 0) {
                  t[18] = r + 12;
                  if (((w(1) | 0) << 16) >> 16 != 123) {
                    t[18] = r;
                    break;
                  }
                  e = t[18] | 0;
                  a = e;
                  e: while (1) {
                    t[18] = a + 2;
                    a = w(1) | 0;
                    switch ((a << 16) >> 16) {
                      case 39: {
                        d(39);
                        t[18] = (t[18] | 0) + 2;
                        a = w(1) | 0;
                        break;
                      }
                      case 34: {
                        d(34);
                        t[18] = (t[18] | 0) + 2;
                        a = w(1) | 0;
                        break;
                      }
                      default:
                        a = H(a) | 0;
                    }
                    if ((a << 16) >> 16 != 58) {
                      i = 16;
                      break;
                    }
                    t[18] = (t[18] | 0) + 2;
                    switch (((w(1) | 0) << 16) >> 16) {
                      case 39: {
                        d(39);
                        break;
                      }
                      case 34: {
                        d(34);
                        break;
                      }
                      default: {
                        i = 20;
                        break e;
                      }
                    }
                    t[18] = (t[18] | 0) + 2;
                    switch (((w(1) | 0) << 16) >> 16) {
                      case 125: {
                        i = 25;
                        break e;
                      }
                      case 44:
                        break;
                      default: {
                        i = 24;
                        break e;
                      }
                    }
                    t[18] = (t[18] | 0) + 2;
                    if (((w(1) | 0) << 16) >> 16 == 125) {
                      i = 25;
                      break;
                    }
                    a = t[18] | 0;
                  }
                  if ((i | 0) == 16) {
                    t[18] = r;
                    break;
                  } else if ((i | 0) == 20) {
                    t[18] = r;
                    break;
                  } else if ((i | 0) == 24) {
                    t[18] = r;
                    break;
                  } else if ((i | 0) == 25) {
                    i = t[8] | 0;
                    t[(i + 16) >> 2] = e;
                    t[(i + 12) >> 2] = (t[18] | 0) + 2;
                    break;
                  }
                }
                t[18] = r + -2;
              }
            } while (0);
            return;
          }
          function o(e) {
            e = e | 0;
            e: do {
              switch (s[e >> 1] | 0) {
                case 100:
                  switch (s[(e + -2) >> 1] | 0) {
                    case 105: {
                      e = q((e + -4) | 0, 118, 111) | 0;
                      break e;
                    }
                    case 108: {
                      e = P((e + -4) | 0, 121, 105, 101) | 0;
                      break e;
                    }
                    default: {
                      e = 0;
                      break e;
                    }
                  }
                case 101: {
                  switch (s[(e + -2) >> 1] | 0) {
                    case 115:
                      break;
                    case 116: {
                      e = E((e + -4) | 0, 100, 101, 108, 101) | 0;
                      break e;
                    }
                    default: {
                      e = 0;
                      break e;
                    }
                  }
                  switch (s[(e + -4) >> 1] | 0) {
                    case 108: {
                      e = D((e + -6) | 0, 101) | 0;
                      break e;
                    }
                    case 97: {
                      e = D((e + -6) | 0, 99) | 0;
                      break e;
                    }
                    default: {
                      e = 0;
                      break e;
                    }
                  }
                }
                case 102: {
                  if (
                    (s[(e + -2) >> 1] | 0) == 111
                      ? (s[(e + -4) >> 1] | 0) == 101
                      : 0
                  )
                    switch (s[(e + -6) >> 1] | 0) {
                      case 99: {
                        e = O((e + -8) | 0, 105, 110, 115, 116, 97, 110) | 0;
                        break e;
                      }
                      case 112: {
                        e = q((e + -8) | 0, 116, 121) | 0;
                        break e;
                      }
                      default: {
                        e = 0;
                        break e;
                      }
                    }
                  else e = 0;
                  break;
                }
                case 110: {
                  e = (e + -2) | 0;
                  if (D(e, 105) | 0) e = 1;
                  else e = $(e, 114, 101, 116, 117, 114) | 0;
                  break;
                }
                case 111: {
                  e = D((e + -2) | 0, 100) | 0;
                  break;
                }
                case 114: {
                  e = m((e + -2) | 0, 100, 101, 98, 117, 103, 103, 101) | 0;
                  break;
                }
                case 116: {
                  e = E((e + -2) | 0, 97, 119, 97, 105) | 0;
                  break;
                }
                case 119:
                  switch (s[(e + -2) >> 1] | 0) {
                    case 101: {
                      e = D((e + -4) | 0, 110) | 0;
                      break e;
                    }
                    case 111: {
                      e = P((e + -4) | 0, 116, 104, 114) | 0;
                      break e;
                    }
                    default: {
                      e = 0;
                      break e;
                    }
                  }
                default:
                  e = 0;
              }
            } while (0);
            return e | 0;
          }
          function h() {
            var e = 0,
              r = 0,
              a = 0;
            r = t[19] | 0;
            a = t[18] | 0;
            e: while (1) {
              e = (a + 2) | 0;
              if (a >>> 0 >= r >>> 0) {
                r = 8;
                break;
              }
              switch (s[e >> 1] | 0) {
                case 96: {
                  r = 9;
                  break e;
                }
                case 36: {
                  if ((s[(a + 4) >> 1] | 0) == 123) {
                    r = 6;
                    break e;
                  }
                  break;
                }
                case 92: {
                  e = (a + 4) | 0;
                  break;
                }
                default: {
                }
              }
              a = e;
            }
            if ((r | 0) == 6) {
              t[18] = a + 4;
              e = s[293] | 0;
              r = t[16] | 0;
              a = s[291] | 0;
              s[291] = ((a + 1) << 16) >> 16;
              s[(r + ((a & 65535) << 1)) >> 1] = e;
              a = (((s[292] | 0) + 1) << 16) >> 16;
              s[292] = a;
              s[293] = a;
            } else if ((r | 0) == 8) {
              t[18] = e;
              Y();
            } else if ((r | 0) == 9) t[18] = e;
            return;
          }
          function w(e) {
            e = e | 0;
            var r = 0,
              a = 0,
              i = 0;
            a = t[18] | 0;
            e: do {
              r = s[a >> 1] | 0;
              r: do {
                if ((r << 16) >> 16 != 47)
                  if (e)
                    if (Z(r) | 0) break;
                    else break e;
                  else if (Q(r) | 0) break;
                  else break e;
                else
                  switch (s[(a + 2) >> 1] | 0) {
                    case 47: {
                      G();
                      break r;
                    }
                    case 42: {
                      p(e);
                      break r;
                    }
                    default: {
                      r = 47;
                      break e;
                    }
                  }
              } while (0);
              i = t[18] | 0;
              a = (i + 2) | 0;
              t[18] = a;
            } while (i >>> 0 < (t[19] | 0) >>> 0);
            return r | 0;
          }
          function d(e) {
            e = e | 0;
            var r = 0,
              a = 0,
              i = 0,
              f = 0;
            f = t[19] | 0;
            r = t[18] | 0;
            while (1) {
              i = (r + 2) | 0;
              if (r >>> 0 >= f >>> 0) {
                r = 9;
                break;
              }
              a = s[i >> 1] | 0;
              if ((a << 16) >> 16 == (e << 16) >> 16) {
                r = 10;
                break;
              }
              if ((a << 16) >> 16 == 92) {
                a = (r + 4) | 0;
                if ((s[a >> 1] | 0) == 13) {
                  r = (r + 6) | 0;
                  r = (s[r >> 1] | 0) == 10 ? r : a;
                } else r = a;
              } else if (ae(a) | 0) {
                r = 9;
                break;
              } else r = i;
            }
            if ((r | 0) == 9) {
              t[18] = i;
              Y();
            } else if ((r | 0) == 10) t[18] = i;
            return;
          }
          function v(e, r, a, s) {
            e = e | 0;
            r = r | 0;
            a = a | 0;
            s = s | 0;
            var f = 0,
              c = 0;
            f = t[13] | 0;
            t[13] = f + 32;
            c = t[8] | 0;
            t[((c | 0) == 0 ? 16 : (c + 28) | 0) >> 2] = f;
            t[9] = c;
            t[8] = f;
            t[(f + 8) >> 2] = e;
            do {
              if (2 != (s | 0))
                if (1 == (s | 0)) {
                  t[(f + 12) >> 2] = a + 2;
                  break;
                } else {
                  t[(f + 12) >> 2] = t[3];
                  break;
                }
              else t[(f + 12) >> 2] = a;
            } while (0);
            t[f >> 2] = r;
            t[(f + 4) >> 2] = a;
            t[(f + 16) >> 2] = 0;
            t[(f + 20) >> 2] = s;
            i[(f + 24) >> 0] = (1 == (s | 0)) & 1;
            t[(f + 28) >> 2] = 0;
            return;
          }
          function A() {
            var e = 0,
              r = 0,
              a = 0;
            a = t[19] | 0;
            r = t[18] | 0;
            e: while (1) {
              e = (r + 2) | 0;
              if (r >>> 0 >= a >>> 0) {
                r = 6;
                break;
              }
              switch (s[e >> 1] | 0) {
                case 13:
                case 10: {
                  r = 6;
                  break e;
                }
                case 93: {
                  r = 7;
                  break e;
                }
                case 92: {
                  e = (r + 4) | 0;
                  break;
                }
                default: {
                }
              }
              r = e;
            }
            if ((r | 0) == 6) {
              t[18] = e;
              Y();
              e = 0;
            } else if ((r | 0) == 7) {
              t[18] = e;
              e = 93;
            }
            return e | 0;
          }
          function C(e, r, a, i, t, f, c, n) {
            e = e | 0;
            r = r | 0;
            a = a | 0;
            i = i | 0;
            t = t | 0;
            f = f | 0;
            c = c | 0;
            n = n | 0;
            if (
              (
                (
                  (
                    (
                      (s[(e + 12) >> 1] | 0) == (n << 16) >> 16
                        ? (s[(e + 10) >> 1] | 0) == (c << 16) >> 16
                        : 0
                    )
                      ? (s[(e + 8) >> 1] | 0) == (f << 16) >> 16
                      : 0
                  )
                    ? (s[(e + 6) >> 1] | 0) == (t << 16) >> 16
                    : 0
                )
                  ? (s[(e + 4) >> 1] | 0) == (i << 16) >> 16
                  : 0
              )
                ? (s[(e + 2) >> 1] | 0) == (a << 16) >> 16
                : 0
            )
              r = (s[e >> 1] | 0) == (r << 16) >> 16;
            else r = 0;
            return r | 0;
          }
          function y(e) {
            e = e | 0;
            switch (s[e >> 1] | 0) {
              case 62: {
                e = (s[(e + -2) >> 1] | 0) == 61;
                break;
              }
              case 41:
              case 59: {
                e = 1;
                break;
              }
              case 104: {
                e = E((e + -2) | 0, 99, 97, 116, 99) | 0;
                break;
              }
              case 121: {
                e = O((e + -2) | 0, 102, 105, 110, 97, 108, 108) | 0;
                break;
              }
              case 101: {
                e = P((e + -2) | 0, 101, 108, 115) | 0;
                break;
              }
              default:
                e = 0;
            }
            return e | 0;
          }
          function g(e, r) {
            e = e | 0;
            r = r | 0;
            var a = 0,
              i = 0;
            a = t[18] | 0;
            i = s[a >> 1] | 0;
            if ((i << 16) >> 16 == 97) {
              t[18] = a + 4;
              a = w(1) | 0;
              e = t[18] | 0;
              if (_(a) | 0) {
                d(a);
                r = ((t[18] | 0) + 2) | 0;
                t[18] = r;
              } else {
                H(a) | 0;
                r = t[18] | 0;
              }
              i = w(1) | 0;
              a = t[18] | 0;
            }
            if ((a | 0) != (e | 0)) J(e, r);
            return i | 0;
          }
          function I() {
            var e = 0,
              r = 0,
              a = 0;
            e: while (1) {
              e = t[18] | 0;
              r = (e + 2) | 0;
              t[18] = r;
              if (e >>> 0 >= (t[19] | 0) >>> 0) {
                a = 7;
                break;
              }
              switch (s[r >> 1] | 0) {
                case 13:
                case 10: {
                  a = 7;
                  break e;
                }
                case 47:
                  break e;
                case 91: {
                  A() | 0;
                  break;
                }
                case 92: {
                  t[18] = e + 4;
                  break;
                }
                default: {
                }
              }
            }
            if ((a | 0) == 7) Y();
            return;
          }
          function p(e) {
            e = e | 0;
            var r = 0,
              a = 0,
              i = 0,
              f = 0,
              c = 0;
            f = ((t[18] | 0) + 2) | 0;
            t[18] = f;
            a = t[19] | 0;
            while (1) {
              r = (f + 2) | 0;
              if (f >>> 0 >= a >>> 0) break;
              i = s[r >> 1] | 0;
              if (!e ? ae(i) | 0 : 0) break;
              if ((i << 16) >> 16 == 42 ? (s[(f + 4) >> 1] | 0) == 47 : 0) {
                c = 8;
                break;
              }
              f = r;
            }
            if ((c | 0) == 8) {
              t[18] = r;
              r = (f + 4) | 0;
            }
            t[18] = r;
            return;
          }
          function U(e, r, a, i, t, f, c) {
            e = e | 0;
            r = r | 0;
            a = a | 0;
            i = i | 0;
            t = t | 0;
            f = f | 0;
            c = c | 0;
            if (
              (
                (
                  (
                    (s[(e + 10) >> 1] | 0) == (c << 16) >> 16
                      ? (s[(e + 8) >> 1] | 0) == (f << 16) >> 16
                      : 0
                  )
                    ? (s[(e + 6) >> 1] | 0) == (t << 16) >> 16
                    : 0
                )
                  ? (s[(e + 4) >> 1] | 0) == (i << 16) >> 16
                  : 0
              )
                ? (s[(e + 2) >> 1] | 0) == (a << 16) >> 16
                : 0
            )
              r = (s[e >> 1] | 0) == (r << 16) >> 16;
            else r = 0;
            return r | 0;
          }
          function m(e, r, a, i, f, c, n, b) {
            e = e | 0;
            r = r | 0;
            a = a | 0;
            i = i | 0;
            f = f | 0;
            c = c | 0;
            n = n | 0;
            b = b | 0;
            var u = 0,
              k = 0;
            k = (e + -12) | 0;
            u = t[3] | 0;
            if (k >>> 0 >= u >>> 0 ? C(k, r, a, i, f, c, n, b) | 0 : 0)
              if ((k | 0) == (u | 0)) u = 1;
              else u = F(s[(e + -14) >> 1] | 0) | 0;
            else u = 0;
            return u | 0;
          }
          function S(e) {
            e = e | 0;
            e: do {
              switch ((e << 16) >> 16) {
                case 38:
                case 37:
                case 33: {
                  e = 1;
                  break;
                }
                default:
                  if (
                    (((e & -8) << 16) >> 16 == 40) |
                    (((e + -58) & 65535) < 6)
                  )
                    e = 1;
                  else {
                    switch ((e << 16) >> 16) {
                      case 91:
                      case 93:
                      case 94: {
                        e = 1;
                        break e;
                      }
                      default: {
                      }
                    }
                    e = ((e + -123) & 65535) < 4;
                  }
              }
            } while (0);
            return e | 0;
          }
          function x(e) {
            e = e | 0;
            e: do {
              switch ((e << 16) >> 16) {
                case 38:
                case 37:
                case 33:
                  break;
                default:
                  if (
                    !(
                      (((e + -58) & 65535) < 6) |
                      ((((e + -40) & 65535) < 7) & ((e << 16) >> 16 != 41))
                    )
                  ) {
                    switch ((e << 16) >> 16) {
                      case 91:
                      case 94:
                        break e;
                      default: {
                      }
                    }
                    return (
                      (((e << 16) >> 16 != 125) & (((e + -123) & 65535) < 4)) |
                      0
                    );
                  }
              }
            } while (0);
            return 1;
          }
          function O(e, r, a, i, f, c, n) {
            e = e | 0;
            r = r | 0;
            a = a | 0;
            i = i | 0;
            f = f | 0;
            c = c | 0;
            n = n | 0;
            var b = 0,
              u = 0;
            u = (e + -10) | 0;
            b = t[3] | 0;
            if (u >>> 0 >= b >>> 0 ? U(u, r, a, i, f, c, n) | 0 : 0)
              if ((u | 0) == (b | 0)) b = 1;
              else b = F(s[(e + -12) >> 1] | 0) | 0;
            else b = 0;
            return b | 0;
          }
          function $(e, r, a, i, f, c) {
            e = e | 0;
            r = r | 0;
            a = a | 0;
            i = i | 0;
            f = f | 0;
            c = c | 0;
            var n = 0,
              b = 0;
            b = (e + -8) | 0;
            n = t[3] | 0;
            if (b >>> 0 >= n >>> 0 ? B(b, r, a, i, f, c) | 0 : 0)
              if ((b | 0) == (n | 0)) n = 1;
              else n = F(s[(e + -10) >> 1] | 0) | 0;
            else n = 0;
            return n | 0;
          }
          function j(e) {
            e = e | 0;
            var r = 0,
              a = 0,
              i = 0,
              f = 0;
            a = n;
            n = (n + 16) | 0;
            i = a;
            t[i >> 2] = 0;
            t[12] = e;
            r = t[3] | 0;
            f = (r + (e << 1)) | 0;
            e = (f + 2) | 0;
            s[f >> 1] = 0;
            t[i >> 2] = e;
            t[13] = e;
            t[4] = 0;
            t[8] = 0;
            t[6] = 0;
            t[5] = 0;
            t[10] = 0;
            t[7] = 0;
            n = a;
            return r | 0;
          }
          function B(e, r, a, i, t, f) {
            e = e | 0;
            r = r | 0;
            a = a | 0;
            i = i | 0;
            t = t | 0;
            f = f | 0;
            if (
              (
                (
                  (s[(e + 8) >> 1] | 0) == (f << 16) >> 16
                    ? (s[(e + 6) >> 1] | 0) == (t << 16) >> 16
                    : 0
                )
                  ? (s[(e + 4) >> 1] | 0) == (i << 16) >> 16
                  : 0
              )
                ? (s[(e + 2) >> 1] | 0) == (a << 16) >> 16
                : 0
            )
              r = (s[e >> 1] | 0) == (r << 16) >> 16;
            else r = 0;
            return r | 0;
          }
          function E(e, r, a, i, f) {
            e = e | 0;
            r = r | 0;
            a = a | 0;
            i = i | 0;
            f = f | 0;
            var c = 0,
              n = 0;
            n = (e + -6) | 0;
            c = t[3] | 0;
            if (n >>> 0 >= c >>> 0 ? z(n, r, a, i, f) | 0 : 0)
              if ((n | 0) == (c | 0)) c = 1;
              else c = F(s[(e + -8) >> 1] | 0) | 0;
            else c = 0;
            return c | 0;
          }
          function P(e, r, a, i) {
            e = e | 0;
            r = r | 0;
            a = a | 0;
            i = i | 0;
            var f = 0,
              c = 0;
            c = (e + -4) | 0;
            f = t[3] | 0;
            if (c >>> 0 >= f >>> 0 ? K(c, r, a, i) | 0 : 0)
              if ((c | 0) == (f | 0)) f = 1;
              else f = F(s[(e + -6) >> 1] | 0) | 0;
            else f = 0;
            return f | 0;
          }
          function q(e, r, a) {
            e = e | 0;
            r = r | 0;
            a = a | 0;
            var i = 0,
              f = 0;
            f = (e + -2) | 0;
            i = t[3] | 0;
            if (f >>> 0 >= i >>> 0 ? N(f, r, a) | 0 : 0)
              if ((f | 0) == (i | 0)) i = 1;
              else i = F(s[(e + -4) >> 1] | 0) | 0;
            else i = 0;
            return i | 0;
          }
          function z(e, r, a, i, t) {
            e = e | 0;
            r = r | 0;
            a = a | 0;
            i = i | 0;
            t = t | 0;
            if (
              (
                (s[(e + 6) >> 1] | 0) == (t << 16) >> 16
                  ? (s[(e + 4) >> 1] | 0) == (i << 16) >> 16
                  : 0
              )
                ? (s[(e + 2) >> 1] | 0) == (a << 16) >> 16
                : 0
            )
              r = (s[e >> 1] | 0) == (r << 16) >> 16;
            else r = 0;
            return r | 0;
          }
          function D(e, r) {
            e = e | 0;
            r = r | 0;
            var a = 0;
            a = t[3] | 0;
            if (a >>> 0 <= e >>> 0 ? (s[e >> 1] | 0) == (r << 16) >> 16 : 0)
              if ((a | 0) == (e | 0)) a = 1;
              else a = F(s[(e + -2) >> 1] | 0) | 0;
            else a = 0;
            return a | 0;
          }
          function F(e) {
            e = e | 0;
            e: do {
              if (((e + -9) & 65535) < 5) e = 1;
              else {
                switch ((e << 16) >> 16) {
                  case 32:
                  case 160: {
                    e = 1;
                    break e;
                  }
                  default: {
                  }
                }
                e = ((e << 16) >> 16 != 46) & (S(e) | 0);
              }
            } while (0);
            return e | 0;
          }
          function G() {
            var e = 0,
              r = 0,
              a = 0;
            e = t[19] | 0;
            a = t[18] | 0;
            e: while (1) {
              r = (a + 2) | 0;
              if (a >>> 0 >= e >>> 0) break;
              switch (s[r >> 1] | 0) {
                case 13:
                case 10:
                  break e;
                default:
                  a = r;
              }
            }
            t[18] = r;
            return;
          }
          function H(e) {
            e = e | 0;
            while (1) {
              if (Z(e) | 0) break;
              if (S(e) | 0) break;
              e = ((t[18] | 0) + 2) | 0;
              t[18] = e;
              e = s[e >> 1] | 0;
              if (!((e << 16) >> 16)) {
                e = 0;
                break;
              }
            }
            return e | 0;
          }
          function J(e, r) {
            e = e | 0;
            r = r | 0;
            var a = 0,
              i = 0;
            a = t[13] | 0;
            t[13] = a + 12;
            i = t[10] | 0;
            t[((i | 0) == 0 ? 20 : (i + 8) | 0) >> 2] = a;
            t[10] = a;
            t[a >> 2] = e;
            t[(a + 4) >> 2] = r;
            t[(a + 8) >> 2] = 0;
            return;
          }
          function K(e, r, a, i) {
            e = e | 0;
            r = r | 0;
            a = a | 0;
            i = i | 0;
            if (
              (s[(e + 4) >> 1] | 0) == (i << 16) >> 16
                ? (s[(e + 2) >> 1] | 0) == (a << 16) >> 16
                : 0
            )
              r = (s[e >> 1] | 0) == (r << 16) >> 16;
            else r = 0;
            return r | 0;
          }
          function L(e) {
            e = e | 0;
            if (
              !($(e, 119, 104, 105, 108, 101) | 0)
                ? !(P(e, 102, 111, 114) | 0)
                : 0
            )
              e = q(e, 105, 102) | 0;
            else e = 1;
            return e | 0;
          }
          function M() {
            var e = 0;
            e = t[((t[6] | 0) + 20) >> 2] | 0;
            switch (e | 0) {
              case 1: {
                e = -1;
                break;
              }
              case 2: {
                e = -2;
                break;
              }
              default:
                e = (e - (t[3] | 0)) >> 1;
            }
            return e | 0;
          }
          function N(e, r, a) {
            e = e | 0;
            r = r | 0;
            a = a | 0;
            if ((s[(e + 2) >> 1] | 0) == (a << 16) >> 16)
              r = (s[e >> 1] | 0) == (r << 16) >> 16;
            else r = 0;
            return r | 0;
          }
          function Q(e) {
            e = e | 0;
            switch ((e << 16) >> 16) {
              case 160:
              case 32:
              case 12:
              case 11:
              case 9: {
                e = 1;
                break;
              }
              default:
                e = 0;
            }
            return e | 0;
          }
          function R(e) {
            e = e | 0;
            if ((t[3] | 0) == (e | 0)) e = 1;
            else e = F(s[(e + -2) >> 1] | 0) | 0;
            return e | 0;
          }
          function T() {
            var e = 0;
            e = t[((t[6] | 0) + 16) >> 2] | 0;
            if (!e) e = -1;
            else e = (e - (t[3] | 0)) >> 1;
            return e | 0;
          }
          function V() {
            var e = 0;
            e = t[6] | 0;
            e = t[((e | 0) == 0 ? 16 : (e + 28) | 0) >> 2] | 0;
            t[6] = e;
            return ((e | 0) != 0) | 0;
          }
          function W() {
            var e = 0;
            e = t[7] | 0;
            e = t[((e | 0) == 0 ? 20 : (e + 8) | 0) >> 2] | 0;
            t[7] = e;
            return ((e | 0) != 0) | 0;
          }
          function X(e) {
            e = e | 0;
            var r = 0;
            r = n;
            n = (n + e) | 0;
            n = (n + 15) & -16;
            return r | 0;
          }
          function Y() {
            i[588] = 1;
            t[14] = ((t[18] | 0) - (t[3] | 0)) >> 1;
            t[18] = (t[19] | 0) + 2;
            return;
          }
          function Z(e) {
            e = e | 0;
            return (
              (((e | 128) << 16) >> 16 == 160) | (((e + -9) & 65535) < 5) | 0
            );
          }
          function _(e) {
            e = e | 0;
            return ((e << 16) >> 16 == 39) | ((e << 16) >> 16 == 34) | 0;
          }
          function ee() {
            return (((t[((t[6] | 0) + 12) >> 2] | 0) - (t[3] | 0)) >> 1) | 0;
          }
          function re() {
            return (((t[((t[6] | 0) + 8) >> 2] | 0) - (t[3] | 0)) >> 1) | 0;
          }
          function ae(e) {
            e = e | 0;
            return ((e << 16) >> 16 == 13) | ((e << 16) >> 16 == 10) | 0;
          }
          function ie() {
            return (((t[((t[6] | 0) + 4) >> 2] | 0) - (t[3] | 0)) >> 1) | 0;
          }
          function se() {
            return (((t[((t[7] | 0) + 4) >> 2] | 0) - (t[3] | 0)) >> 1) | 0;
          }
          function te() {
            return (((t[t[6] >> 2] | 0) - (t[3] | 0)) >> 1) | 0;
          }
          function fe() {
            return (((t[t[7] >> 2] | 0) - (t[3] | 0)) >> 1) | 0;
          }
          function ce() {
            return f[((t[6] | 0) + 24) >> 0] | 0 | 0;
          }
          function ne(e) {
            e = e | 0;
            t[3] = e;
            return;
          }
          function be() {
            return ((i[589] | 0) != 0) | 0;
          }
          function ue() {
            return t[14] | 0;
          }
          return {
            ai: T,
            e: ue,
            ee: se,
            es: fe,
            f: be,
            id: M,
            ie: ie,
            ip: ce,
            is: te,
            p: b,
            re: W,
            ri: V,
            sa: j,
            se: ee,
            ses: ne,
            ss: re,
            sta: X,
          };
        })(
          {
            Int8Array: Int8Array,
            Int16Array: Int16Array,
            Int32Array: Int32Array,
            Uint8Array: Uint8Array,
            Uint16Array: Uint16Array,
          },
          {},
          r
        )),
        (a = e.sta(2 * i));
    }
    const o = t.length + 1;
    e.ses(a),
      e.sa(o - 1),
      (s ? b : n)(t, new Uint16Array(r, a, o)),
      e.p() || ((c$1 = e.e()), h());
    const w = [],
      d = [];
    for (; e.ri(); ) {
      const r = e.is(),
        a = e.ie(),
        i = e.ai(),
        s = e.id(),
        f = e.ss(),
        c = e.se();
      let n;
      e.ip() &&
        (n = u(-1 === s ? r : r + 1, t.charCodeAt(-1 === s ? r - 1 : r))),
        w.push({ n: n, s: r, e: a, ss: f, se: c, d: s, a: i });
    }
    for (; e.re(); ) {
      const r = e.es(),
        a = t.charCodeAt(r);
      d.push(34 === a || 39 === a ? u(r + 1, a) : t.slice(e.es(), e.ee()));
    }
    return [w, d, !!e.f()];
  }
  function n(e, r) {
    const a = e.length;
    let i = 0;
    for (; i < a; ) {
      const a = e.charCodeAt(i);
      r[i++] = ((255 & a) << 8) | (a >>> 8);
    }
  }
  function b(e, r) {
    const a = e.length;
    let i = 0;
    for (; i < a; ) r[i] = e.charCodeAt(i++);
  }
  function u(e, r) {
    c$1 = e;
    let a = "",
      i = c$1;
    for (;;) {
      c$1 >= t.length && h();
      const e = t.charCodeAt(c$1);
      if (e === r) break;
      92 === e
        ? ((a += t.slice(i, c$1)), (a += k()), (i = c$1))
        : (8232 === e || 8233 === e || (o(e) && h()), ++c$1);
    }
    return (a += t.slice(i, c$1++)), a;
  }
  function k() {
    let e = t.charCodeAt(++c$1);
    switch ((++c$1, e)) {
      case 110:
        return "\n";
      case 114:
        return "\r";
      case 120:
        return String.fromCharCode(l(2));
      case 117:
        return (function () {
          let e;
          return (
            123 === t.charCodeAt(c$1)
              ? (++c$1,
                (e = l(t.indexOf("}", c$1) - c$1)),
                ++c$1,
                e > 1114111 && h())
              : (e = l(4)),
            e <= 65535
              ? String.fromCharCode(e)
              : ((e -= 65536),
                String.fromCharCode(55296 + (e >> 10), 56320 + (1023 & e)))
          );
        })();
      case 116:
        return "\t";
      case 98:
        return "\b";
      case 118:
        return "\v";
      case 102:
        return "\f";
      case 13:
        10 === t.charCodeAt(c$1) && ++c$1;
      case 10:
        return "";
      case 56:
      case 57:
        h();
      default:
        if (e >= 48 && e <= 55) {
          let r = t.substr(c$1 - 1, 3).match(/^[0-7]+/)[0],
            a = parseInt(r, 8);
          return (
            a > 255 && ((r = r.slice(0, -1)), (a = parseInt(r, 8))),
            (c$1 += r.length - 1),
            (e = t.charCodeAt(c$1)),
            ("0" === r && 56 !== e && 57 !== e) || h(),
            String.fromCharCode(a)
          );
        }
        return o(e) ? "" : String.fromCharCode(e);
    }
  }
  function l(e) {
    const r = c$1;
    let a = 0,
      i = 0;
    for (let r = 0; r < e; ++r, ++c$1) {
      let e,
        s = t.charCodeAt(c$1);
      if (95 !== s) {
        if (s >= 97) e = s - 97 + 10;
        else if (s >= 65) e = s - 65 + 10;
        else {
          if (!(s >= 48 && s <= 57)) break;
          e = s - 48;
        }
        if (e >= 16) break;
        (i = s), (a = 16 * a + e);
      } else (95 !== i && 0 !== r) || h(), (i = s);
    }
    return (95 !== i && c$1 - r === e) || h(), a;
  }
  function o(e) {
    return 13 === e || 10 === e;
  }
  function h() {
    throw Object.assign(
      new Error(
        `Parse error ${f}:${t.slice(0, c$1).split("\n").length}:${
          c$1 - t.lastIndexOf("\n", c$1 - 1)
        }`
      ),
      { idx: c$1 }
    );
  }
  async function defaultResolve(id, parentUrl) {
    return resolveImportMap(
      importMap,
      resolveIfNotPlainOrUrl(id, parentUrl) || id,
      parentUrl
    );
  }
  async function _resolve(id, parentUrl) {
    const urlResolved = resolveIfNotPlainOrUrl(id, parentUrl);
    return {
      r: resolveImportMap(importMap, urlResolved || id, parentUrl),
      b: !urlResolved && !isURL(id),
    };
  }
  const resolve = resolveHook
    ? async (id, parentUrl) => ({
        r: await resolveHook(id, parentUrl, defaultResolve),
        b: !1,
      })
    : _resolve;
  let id = 0;
  const registry = {};
  async function loadAll(load, seen) {
    load.b ||
      seen[load.u] ||
      ((seen[load.u] = 1),
      await load.L,
      await Promise.all(load.d.map((dep) => loadAll(dep, seen))),
      load.n || (load.n = load.d.some((dep) => dep.n)));
  }
  let importMap = { imports: {}, scopes: {} },
    importMapSrcOrLazy = !1,
    baselinePassthrough;
  const initPromise = featureDetectionPromise.then(() => {
    if (!shimMode) {
      let seenScript = !1;
      for (const script of document.querySelectorAll(
        'script[type="module-shim"],script[type="importmap-shim"],script[type="module"],script[type="importmap"]'
      )) {
        if (
          (seenScript || "module" !== script.type || (seenScript = !0),
          script.type.endsWith("-shim"))
        ) {
          setShimMode();
          break;
        }
        if (seenScript && "importmap" === script.type) {
          importMapSrcOrLazy = !0;
          break;
        }
      }
    }
    if (
      ((baselinePassthrough =
        supportsDynamicImport &&
        supportsImportMeta &&
        supportsImportMaps &&
        (!jsonModulesEnabled || supportsJsonAssertions) &&
        (!cssModulesEnabled || supportsCssAssertions) &&
        !importMapSrcOrLazy &&
        !0),
      baselinePassthrough || onpolyfill(),
      shimMode || !baselinePassthrough)
    )
      return (
        new MutationObserver((mutations) => {
          for (const mutation of mutations)
            if ("childList" === mutation.type)
              for (const node of mutation.addedNodes)
                "SCRIPT" === node.tagName
                  ? (((!shimMode && "module" === node.type) ||
                      (shimMode && "module-shim" === node.type)) &&
                      processScript(node),
                    ((!shimMode && "importmap" === node.type) ||
                      (shimMode && "importmap-shim" === node.type)) &&
                      processImportMap(node))
                  : "LINK" === node.tagName &&
                    "modulepreload" === node.rel &&
                    processPreload(node);
        }).observe(document, { childList: !0, subtree: !0 }),
        processImportMaps(),
        void processScriptsAndPreloads()
      );
  });
  let importMapPromise = initPromise,
    acceptingImportMaps = !0;
  async function topLevelLoad(
    url,
    fetchOpts,
    source,
    nativelyLoaded,
    lastStaticLoadPromise
  ) {
    if (
      (shimMode || (acceptingImportMaps = !1),
      await importMapPromise,
      !shimMode && baselinePassthrough)
    )
      return nativelyLoaded
        ? null
        : (await lastStaticLoadPromise,
          dynamicImport(source ? createBlob(source) : url, {
            errUrl: url || source,
          }));
    const load = getOrCreateLoad(url, fetchOpts, source),
      seen = {};
    if (
      (await loadAll(load, seen),
      (lastLoad = void 0),
      resolveDeps(load, seen),
      await lastStaticLoadPromise,
      source && !shimMode && !load.n)
    ) {
      const module = await dynamicImport(createBlob(source), {
        errUrl: source,
      });
      return revokeBlobURLs && revokeObjectURLs(Object.keys(seen)), module;
    }
    const module = await dynamicImport(
      shimMode || load.n || !nativelyLoaded ? load.b : load.u,
      { errUrl: load.u }
    );
    return (
      load.s && (await dynamicImport(load.s)).u$_(module),
      revokeBlobURLs && revokeObjectURLs(Object.keys(seen)),
      module
    );
  }
  function revokeObjectURLs(registryKeys) {
    let batch = 0;
    const keysLength = registryKeys.length,
      schedule = self.requestIdleCallback
        ? self.requestIdleCallback
        : self.requestAnimationFrame;
    function cleanup() {
      const batchStartIndex = 100 * batch;
      if (!(batchStartIndex > keysLength)) {
        for (const key of registryKeys.slice(
          batchStartIndex,
          batchStartIndex + 100
        )) {
          const load = registry[key];
          load && URL.revokeObjectURL(load.b);
        }
        batch++, schedule(cleanup);
      }
    }
    schedule(cleanup);
  }
  async function importShim(id, parentUrl = baseUrl, _assertion) {
    return (
      await initPromise,
      (acceptingImportMaps || shimMode || !baselinePassthrough) &&
        (processImportMaps(), shimMode || (acceptingImportMaps = !1)),
      await importMapPromise,
      topLevelLoad(
        (await resolve(id, parentUrl)).r || throwUnresolved(id, parentUrl),
        { credentials: "same-origin" }
      )
    );
  }
  (self.importShim = importShim),
    shimMode &&
      (importShim.getImportMap = () => JSON.parse(JSON.stringify(importMap)));
  const meta = {};
  async function importMetaResolve(id, parentUrl = this.url) {
    return (
      (await resolve(id, `${parentUrl}`)).r || throwUnresolved(id, parentUrl)
    );
  }
  function urlJsString(url) {
    return `'${url.replace(/'/g, "\\'")}'`;
  }
  let lastLoad;
  function resolveDeps(load, seen) {
    if (load.b || !seen[load.u]) return;
    seen[load.u] = 0;
    for (const dep of load.d) resolveDeps(dep, seen);
    const [imports] = load.a,
      source = load.S;
    let resolvedSource = edge && lastLoad ? `import '${lastLoad}';` : "";
    if (imports.length) {
      let lastIndex = 0,
        depIndex = 0;
      for (const { s: start, se: end, d: dynamicImportIndex } of imports)
        if (-1 === dynamicImportIndex) {
          const depLoad = load.d[depIndex++];
          let blobUrl = depLoad.b;
          if (blobUrl) {
            if (depLoad.s) {
              (resolvedSource += `${source.slice(
                lastIndex,
                start - 1
              )}/*${source.slice(start - 1, end)}*/${urlJsString(
                blobUrl
              )};import*as m$_${depIndex} from'${
                depLoad.b
              }';import{u$_ as u$_${depIndex}}from'${
                depLoad.s
              }';u$_${depIndex}(m$_${depIndex})`),
                (lastIndex = end),
                (depLoad.s = void 0);
              continue;
            }
          } else
            (blobUrl = depLoad.s) ||
              (blobUrl = depLoad.s =
                createBlob(
                  `export function u$_(m){${depLoad.a[1]
                    .map((name) =>
                      "default" === name
                        ? "$_default=m.default"
                        : `${name}=m.${name}`
                    )
                    .join(",")}}${depLoad.a[1]
                    .map((name) =>
                      "default" === name
                        ? "let $_default;export{$_default as default}"
                        : `export let ${name}`
                    )
                    .join(";")}\n//# sourceURL=${depLoad.r}?cycle`
                ));
          (resolvedSource += `${source.slice(
            lastIndex,
            start - 1
          )}/*${source.slice(start - 1, end)}*/${urlJsString(blobUrl)}`),
            (lastIndex = end);
        } else
          -2 === dynamicImportIndex
            ? ((meta[load.r] = { url: load.r, resolve: importMetaResolve }),
              (resolvedSource += `${source.slice(
                lastIndex,
                start
              )}self._esmsm[${urlJsString(load.r)}]`),
              (lastIndex = end))
            : ((resolvedSource += `${source.slice(
                lastIndex,
                dynamicImportIndex + 6
              )}Shim(${source.slice(start, end)}, ${
                load.r && urlJsString(load.r)
              }`),
              (lastIndex = end));
      resolvedSource += source.slice(lastIndex);
    } else resolvedSource += source;
    let hasSourceURL = !1;
    (resolvedSource = resolvedSource.replace(
      sourceMapURLRegEx,
      (match, isMapping, url) => (
        (hasSourceURL = !isMapping),
        match.replace(url, () => new URL(url, load.r))
      )
    )),
      hasSourceURL || (resolvedSource += "\n//# sourceURL=" + load.r),
      (load.b = lastLoad = createBlob(resolvedSource)),
      (load.S = void 0);
  }
  self._esmsm = meta;
  const sourceMapURLRegEx =
      /\n\/\/# source(Mapping)?URL=([^\n]+)\s*((;|\/\/[^#][^\n]*)\s*)*$/,
    jsContentType = /^(text|application)\/(x-)?javascript(;|$)/,
    jsonContentType = /^(text|application)\/json(;|$)/,
    cssContentType = /^(text|application)\/css(;|$)/,
    wasmContentType = /^application\/wasm(;|$)/,
    cssUrlRegEx =
      /url\(\s*(?:(["'])((?:\\.|[^\n\\"'])+)\1|((?:\\.|[^\s,"'()\\])+))\s*\)/g;
  let p = [],
    c = 0;
  function pushFetchPool() {
    if (++c > 100) return new Promise((r) => p.push(r));
  }
  function popFetchPool() {
    c--, p.length && p.shift()();
  }
  async function doFetch(url, fetchOpts) {
    const poolQueue = pushFetchPool();
    poolQueue && (await poolQueue);
    try {
      var res = await fetchHook(url, fetchOpts);
    } finally {
      popFetchPool();
    }
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} ${res.url}`);
    const contentType = res.headers.get("content-type");
    if (jsContentType.test(contentType))
      return { r: res.url, s: await res.text(), t: "js" };
    if (jsonContentType.test(contentType))
      return { r: res.url, s: `export default ${await res.text()}`, t: "json" };
    if (cssContentType.test(contentType))
      return {
        r: res.url,
        s: `var s=new CSSStyleSheet();s.replaceSync(${JSON.stringify(
          (await res.text()).replace(
            cssUrlRegEx,
            (_match, quotes, relUrl1, relUrl2) =>
              `url(${quotes}${resolveUrl(relUrl1 || relUrl2, url)}${quotes})`
          )
        )});export default s;`,
        t: "css",
      };
    throw wasmContentType.test(contentType)
      ? new Error("WASM modules not supported")
      : new Error(`Unknown Content-Type "${contentType}"`);
  }
  function getOrCreateLoad(url, fetchOpts, source) {
    let load = registry[url];
    return (
      load ||
      ((load = registry[url] =
        {
          u: url,
          r: void 0,
          f: void 0,
          S: void 0,
          L: void 0,
          a: void 0,
          d: void 0,
          b: void 0,
          s: void 0,
          n: !1,
          t: null,
        }),
      (load.f = (async () => {
        if (!source) {
          let t;
          if (
            (({
              r: load.r,
              s: source,
              t: t,
            } = await (fetchCache[url] || doFetch(url, fetchOpts))),
            t && !shimMode)
          ) {
            if (
              ("css" === t && !cssModulesEnabled) ||
              ("json" === t && !jsonModulesEnabled)
            )
              throw new Error(
                `${t}-modules require <script type="esms-options">{ "polyfillEnable": ["${t}-modules"] }<\/script>`
              );
            (("css" === t && !supportsCssAssertions) ||
              ("json" === t && !supportsJsonAssertions)) &&
              (load.n = !0);
          }
        }
        try {
          load.a = parse(source, load.u);
        } catch (e) {
          console.warn(e), (load.a = [[], []]);
        }
        return (load.S = source), load;
      })()),
      (load.L = load.f.then(async () => {
        let childFetchOpts = fetchOpts;
        load.d = (
          await Promise.all(
            load.a[0].map(async ({ n: n, d: d }) => {
              if (
                (((d >= 0 && !supportsDynamicImport) ||
                  (2 === d && !supportsImportMeta)) &&
                  (load.n = !0),
                !n)
              )
                return;
              const { r: r, b: b } = await resolve(n, load.r || load.u);
              return (
                !b ||
                  (supportsImportMaps && !importMapSrcOrLazy) ||
                  (load.n = !0),
                -1 === d
                  ? (r || throwUnresolved(n, load.r || load.u),
                    skip && skip.test(r)
                      ? { b: r }
                      : (childFetchOpts.integrity &&
                          (childFetchOpts = Object.assign({}, childFetchOpts, {
                            integrity: void 0,
                          })),
                        getOrCreateLoad(r, childFetchOpts).f))
                  : void 0
              );
            })
          )
        ).filter((l) => l);
      })),
      load)
    );
  }
  function processScriptsAndPreloads() {
    for (const script of document.querySelectorAll(
      shimMode ? 'script[type="module-shim"]' : 'script[type="module"]'
    ))
      processScript(script);
    for (const link of document.querySelectorAll('link[rel="modulepreload"]'))
      processPreload(link);
  }
  function processImportMaps() {
    for (const script of document.querySelectorAll(
      shimMode ? 'script[type="importmap-shim"]' : 'script[type="importmap"]'
    ))
      processImportMap(script);
  }
  function getFetchOpts(script) {
    const fetchOpts = {};
    return (
      script.integrity && (fetchOpts.integrity = script.integrity),
      script.referrerpolicy &&
        (fetchOpts.referrerPolicy = script.referrerpolicy),
      "use-credentials" === script.crossorigin
        ? (fetchOpts.credentials = "include")
        : "anonymous" === script.crossorigin
        ? (fetchOpts.credentials = "omit")
        : (fetchOpts.credentials = "same-origin"),
      fetchOpts
    );
  }
  let lastStaticLoadPromise = Promise.resolve(),
    domContentLoadedCnt = 1;
  function domContentLoadedCheck() {
    0 != --domContentLoadedCnt ||
      noLoadEventRetriggers ||
      document.dispatchEvent(new Event("DOMContentLoaded"));
  }
  document.addEventListener("DOMContentLoaded", async () => {
    await initPromise,
      domContentLoadedCheck(),
      (!shimMode && baselinePassthrough) ||
        (processImportMaps(), processScriptsAndPreloads());
  });
  let readyStateCompleteCnt = 1;
  function readyStateCompleteCheck() {
    0 != --readyStateCompleteCnt ||
      noLoadEventRetriggers ||
      document.dispatchEvent(new Event("readystatechange"));
  }
  function processImportMap(script) {
    if (!script.ep && (script.src || script.innerHTML)) {
      if (((script.ep = !0), script.src)) {
        if (!shimMode) return;
        importMapSrcOrLazy = !0;
      }
      acceptingImportMaps &&
        ((importMapPromise = importMapPromise
          .then(async () => {
            importMap = resolveAndComposeImportMap(
              script.src
                ? await (await fetchHook(script.src)).json()
                : {
                    imports: {
                      three: "../three/build/three.module.js",
                    },
                  },
              script.src || baseUrl,
              importMap
            );
          })
          .catch((error) =>
            setTimeout(() => {
              throw error;
            })
          )),
        shimMode || (acceptingImportMaps = !1));
    }
  }
  function processScript(script) {
    if (script.ep) return;
    if (null !== script.getAttribute("noshim")) return;
    if (!script.src && !script.innerHTML) return;
    script.ep = !0;
    const isReadyScript = readyStateCompleteCnt > 0,
      isDomContentLoadedScript = domContentLoadedCnt > 0;
    isReadyScript && readyStateCompleteCnt++,
      isDomContentLoadedScript && domContentLoadedCnt++;
    const blocks = null === script.getAttribute("async") && isReadyScript,
      loadPromise = topLevelLoad(
        script.src || `${baseUrl}?${id++}`,
        getFetchOpts(script),
        !script.src && script.innerHTML,
        !shimMode,
        blocks && lastStaticLoadPromise
      ).catch((e) => {
        setTimeout(() => {
          throw e;
        }),
          onerror(e);
      });
    blocks &&
      (lastStaticLoadPromise = loadPromise.then(readyStateCompleteCheck)),
      isDomContentLoadedScript && loadPromise.then(domContentLoadedCheck);
  }
  "complete" === document.readyState
    ? readyStateCompleteCheck()
    : document.addEventListener("readystatechange", async () => {
        processImportMaps(), await initPromise, readyStateCompleteCheck();
      });
  const fetchCache = {};
  function processPreload(link) {
    link.ep ||
      ((link.ep = !0),
      fetchCache[link.href] ||
        (fetchCache[link.href] = doFetch(link.href, getFetchOpts(link))));
  }
  function throwUnresolved(id, parentUrl) {
    throw Error(
      "Unable to resolve specifier '" +
        id +
        (parentUrl ? "' from " + parentUrl : "'")
    );
  }
})();
