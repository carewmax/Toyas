/* ==========================================================
   TOYAS — core: header, footer, search, cart, toasts, loader
   ========================================================== */
(function () {
  "use strict";
  var T = window.TOYAS;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var page = document.body.getAttribute("data-page") || "";

  /* ---------- icons ---------- */
  var ICONS = {
    search: '<path d="M11 19a8 8 0 1 1 5.3-14A8 8 0 0 1 11 19zm10 2-4.3-4.3"/>',
    bag: '<path d="M6 7h12l-1 13H7L6 7zM9 7V6a3 3 0 0 1 6 0v1"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    leaf: '<path d="M5 19c0-8 5-14 15-14 0 9-5 15-13 15M5 19c3-5 6-8 10-10"/>',
    heart: '<path d="M12 20s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 5.8-8 11-8 11z"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z"/>',
    cup: '<path d="M7 8h10l-1.2 12H8.2L7 8zM6 8h12M9 5l1-2h4l1 2M12 3V1"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.800 12 21 12 21zm0-8.500a2.500 2.500 0 1 0 0-5 2.500 2.500 0 0 0 0 5z"/>',
    insta: '<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.600"/><circle cx="17" cy="7" r=".6" fill="currentColor"/>',
    tiktok: '<path d="M14 4v10.500a3.500 3.500 0 1 1-3.500-3.500M14 4c.4 2.500 2 4 5 4.200"/>',
    check: '<path d="M5 12.500l4.500 4.500L19 7.500"/>',
    sparkle: '<path d="M12 3l1.800 5.200L19 10l-5.200 1.800L12 17l-1.800-5.200L5 10l5.200-1.800L12 3z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
    berry: '<path d="M12 8c4 0 7 3 7 7s-3 6-7 6-7-2-7-6 3-7 7-7zM12 8c0-2 1-4 3-5M9 12h.01M13 14h.01M10 16h.01"/>',
    drop: '<path d="M12 3s6 6.500 6 11a6 6 0 0 1-12 0c0-4.500 6-11 6-11z"/>',
    bean: '<path d="M7 5c5-2 12 2 11 9-1 6-8 7-11 3S3 7 7 5zM8 8c3 1 5 4 5 8"/>',
    protein: '<path d="M7 8h10l-1 12H8L7 8zM6 8h12M9 4h6v4H9zM10 13h4"/>',
    syrup: '<path d="M9 3h6v3l2 3v11H7V9l2-3V3zM7 13h10"/>',
    sad: '<circle cx="12" cy="12" r="9"/><path d="M8.500 15.500c1-1.200 2-1.800 3.500-1.800s2.500.6 3.500 1.800M9 10h.01M15 10h.01"/>',
    bagempty: '<path d="M6 7h12l-1 13H7L6 7zM9 7V6a3 3 0 0 1 6 0v1M9.500 13.500h5"/>'
  };
  function icon(name, extra) {
    var fill = (name === "star") ? ' fill="currentColor"' : ' fill="none"';
    return '<svg viewBox="0 0 24 24"' + fill + ' stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ' + (extra || "") + '>' + ICONS[name] + '</svg>';
  }
  function stars(n, total) {
    var out = '<span class="stars" aria-label="' + n + ' out of 5 stars">';
    for (var i = 1; i <= (total || 5); i++) out += '<span class="' + (i <= Math.round(n) ? "" : "off") + '">' + icon("star") + '</span>';
    return out + "</span>";
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); }

  /* cup stamp for loyalty card */
  function cupSvg() {
    return '<svg viewBox="0 0 40 52" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path class="fillable" d="M9 18h22l-2.600 28a3 3 0 0 1-3 2.700H14.600a3 3 0 0 1-3-2.700L9 18z"/>' +
      '<path d="M7 18h26M10 14c0-4 4-6 10-6s10 2 10 6M22 8l4-7M13 29h14M14 36h12"/></svg>';
  }

  window.ToyasUI = { icon: icon, stars: stars, esc: esc, cupSvg: cupSvg, $: $, $$: $$ };

  /* ---------- loader (once per session) ---------- */
  (function loader() {
    var seen = false;
    try { seen = sessionStorage.getItem("toyas_loaded") === "1"; } catch (e) {}
    if (seen || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
    var el = document.createElement("div");
    el.className = "loader"; el.setAttribute("aria-hidden", "true");
    el.innerHTML = '<div class="loader-inner"><span class="logo">Toyas</span><div class="loader-bar"></div></div>';
    document.body.appendChild(el);
    function hide() { el.classList.add("done"); setTimeout(function () { el.remove(); }, 600); try { sessionStorage.setItem("toyas_loaded", "1"); } catch (e) {} }
    window.addEventListener("load", function () { setTimeout(hide, 650); });
    setTimeout(hide, 2500);
  })();

  /* ---------- header / footer ---------- */
  var NAV = [
    ["home", "index.html", "Home"], ["menu", "menu.html", "Menu"], ["build", "build.html", "Build Your Own"],
    ["rewards", "rewards.html", "Rewards"], ["about", "about.html", "About"], ["contact", "contact.html", "Contact"]
  ];
  function navLinks(cls) {
    return NAV.map(function (n) {
      return '<a href="' + n[1] + '"' + (n[0] === page || (n[0] === "menu" && page === "product") ? ' class="active" aria-current="page"' : "") + '>' + n[2] + '</a>';
    }).join("");
  }
  function buildHeader() {
    var h = $("#site-header");
    if (!h) return;
    h.outerHTML =
      '<a class="skip" href="#main">Skip to content</a>' +
      '<header class="site-header"><div class="wrap">' +
      '<a href="index.html" class="logo" aria-label="Toyas — home">Toyas</a>' +
      '<nav class="nav" aria-label="Main">' + navLinks() + '</nav>' +
      '<div class="hdr-actions">' +
      '<button class="icon-btn" id="btn-search" aria-label="Search drinks">' + icon("search") + '</button>' +
      '<button class="icon-btn" id="btn-cart" aria-label="Open cart">' + icon("bag") + '<span class="badge" id="cart-badge" hidden>0</span></button>' +
      '<button class="icon-btn burger" id="btn-burger" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">' + icon("menu") + '</button>' +
      '</div></div></header>' +
      '<div class="mobile-menu" id="mobile-menu">' + navLinks() +
      '<div class="mm-foot">' + esc(T.brand.address) + ' · <a href="tel:' + T.brand.phone + '">' + esc(T.brand.phoneDisplay) + '</a></div></div>';
  }
  function buildFooter() {
    var f = $("#site-footer");
    if (!f) return;
    var b = T.brand;
    f.outerHTML =
      '<footer class="site-footer"><div class="wrap">' +
      '<div class="foot-grid">' +
      '<div><a href="index.html" class="logo big" aria-label="Toyas home">Toyas</a></div>' +
      '<div><h4>EXPLORE</h4><ul>' + NAV.map(function (n) { return '<li><a href="' + n[1] + '">' + n[2] + '</a></li>'; }).join("") + '</ul></div>' +
      '<div><h4>OUR DRINKS</h4><ul>' + T.categories.map(function (c) { return '<li><a href="menu.html?cat=' + c.id + '">' + c.label + '</a></li>'; }).join("") + '</ul></div>' +
      '<div><h4>CONTACT</h4><ul class="foot-contact">' +
      '<li>' + icon("phone") + '<a href="tel:' + b.phone + '">' + esc(b.phoneDisplay) + '</a></li>' +
      '<li>' + icon("pin") + '<span>' + esc(b.address) + '</span></li>' +
      '<li>' + icon("insta") + '<a href="' + b.instagramUrl + '" target="_blank" rel="noopener">' + esc(b.instagram) + '</a></li>' +
      (b.email ? '<li>' + icon("sparkle") + '<a href="mailto:' + esc(b.email) + '">' + esc(b.email) + '</a></li>' : "") +
      '</ul></div></div>' +
      '<div class="foot-bottom"><span>© ' + new Date().getFullYear() + ' Toyas. All rights reserved.</span>' +
      '<div class="socials"><a href="' + b.instagramUrl + '" target="_blank" rel="noopener" aria-label="Toyas on Instagram">' + icon("insta") + '</a></div></div>' +
      '</div></footer>';
  }
  buildHeader(); buildFooter();

  /* mobile menu */
  var burger = $("#btn-burger"), mm = $("#mobile-menu");
  function setMenu(open) {
    mm.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    burger.innerHTML = icon(open ? "close" : "menu");
    document.body.style.overflow = open ? "hidden" : "";
  }
  burger.addEventListener("click", function () { setMenu(!mm.classList.contains("open")); });
  $$("a", mm).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  window.addEventListener("resize", function () { if (innerWidth > 860) setMenu(false); });

  /* ---------- toast ---------- */
  var toastBox = document.createElement("div");
  toastBox.className = "toasts"; toastBox.setAttribute("role", "status"); toastBox.setAttribute("aria-live", "polite");
  document.body.appendChild(toastBox);
  function toast(msg, opts) {
    opts = opts || {};
    var t = document.createElement("div");
    t.className = "toast" + (opts.error ? " err" : "");
    t.innerHTML = icon(opts.error ? "close" : "check") + "<span>" + esc(msg) + "</span>" + (opts.action ? '<button type="button">' + esc(opts.action) + "</button>" : "");
    if (opts.action) $("button", t).addEventListener("click", function () { opts.onAction && opts.onAction(); t.remove(); });
    toastBox.appendChild(t);
    setTimeout(function () { t.style.transition = "opacity .3s"; t.style.opacity = 0; setTimeout(function () { t.remove(); }, 300); }, opts.ms || 3200);
  }

  /* ---------- modal helper ---------- */
  function openModal(html, cls) {
    var bg = document.createElement("div");
    bg.className = "modal-bg";
    bg.innerHTML = '<div class="modal ' + (cls || "") + '" role="dialog" aria-modal="true"><button class="x" aria-label="Close" type="button">&times;</button>' + html + "</div>";
    document.body.appendChild(bg);
    var prevFocus = document.activeElement;
    function close() { bg.classList.remove("open"); document.removeEventListener("keydown", onKey); setTimeout(function () { bg.remove(); }, 260); if (prevFocus && prevFocus.focus) prevFocus.focus(); }
    function onKey(e) { if (e.key === "Escape") close(); }
    $(".x", bg).addEventListener("click", close);
    bg.addEventListener("click", function (e) { if (e.target === bg) close(); });
    document.addEventListener("keydown", onKey);
    requestAnimationFrame(function () { bg.classList.add("open"); var f = $("button,a,input", $(".modal", bg)); f && f.focus(); });
    return { el: bg, close: close };
  }

  /* ---------- cart ---------- */
  var KEY = "toyas_cart_v1";
  var cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY) || "[]"); if (!Array.isArray(cart)) cart = []; } catch (e) { cart = []; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} }
  function count() { return cart.reduce(function (n, l) { return n + l.qty; }, 0); }
  function subtotal() { return cart.reduce(function (n, l) { return n + l.unit * l.qty; }, 0); }

  var scrim = document.createElement("div"); scrim.className = "scrim";
  var drawer = document.createElement("aside");
  drawer.className = "drawer"; drawer.setAttribute("aria-label", "Your cart"); drawer.setAttribute("aria-hidden", "true");
  document.body.appendChild(scrim); document.body.appendChild(drawer);

  function renderCart() {
    var badge = $("#cart-badge");
    var n = count();
    badge.textContent = n; badge.hidden = n === 0;
    var body;
    if (!cart.length) {
      body = '<div class="state">' + icon("bagempty") + '<h3>YOUR CART IS EMPTY</h3><p>Pick a drink and it will show up here.</p><a class="btn" href="menu.html">Browse the menu</a></div>';
    } else {
      body = cart.map(function (l, i) {
        return '<div class="cart-line"><div class="cl-img">' + (l.image ? '<img src="' + esc(l.image) + '" alt="">' : "") + '</div>' +
          '<div><h3>' + esc(l.name) + '</h3>' + (l.opts && l.opts.length ? '<div class="opts">' + l.opts.map(esc).join(" · ") + '</div>' : "") +
          '<div class="qty" role="group" aria-label="Quantity for ' + esc(l.name) + '"><button type="button" data-act="dec" data-i="' + i + '" aria-label="Decrease">−</button><output>' + l.qty + '</output><button type="button" data-act="inc" data-i="' + i + '" aria-label="Increase">+</button></div></div>' +
          '<div><div class="lp">' + T.fmt(l.unit * l.qty) + '</div><button type="button" class="rm" data-act="rm" data-i="' + i + '">Remove</button></div></div>';
      }).join("");
    }
    drawer.innerHTML =
      '<div class="drawer-head"><h2>Your Cart</h2><button class="icon-btn" type="button" id="cart-close" aria-label="Close cart">' + icon("close") + '</button></div>' +
      '<div class="drawer-body">' + body + '</div>' +
      (cart.length ? '<div class="drawer-foot"><div class="sub-row"><span>Subtotal</span><span>' + T.fmt(subtotal()) + '</span></div>' +
        '<p class="fine" style="margin-bottom:14px">Taxes or other charges, if any, are confirmed by Toyas.</p>' +
        '<button class="btn block" type="button" id="cart-checkout">Checkout ' + icon("arrow") + '</button>' +
        '<button class="rm" type="button" data-act="clear" style="margin:10px auto 0">Clear cart</button></div>' : "");
    $("#cart-close").addEventListener("click", closeCart);
    var co = $("#cart-checkout"); if (co) co.addEventListener("click", checkout);
  }
  drawer.addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]"); if (!b) return;
    var i = +b.getAttribute("data-i"), act = b.getAttribute("data-act");
    if (act === "inc") cart[i].qty = Math.min(99, cart[i].qty + 1);
    if (act === "dec") { cart[i].qty -= 1; if (cart[i].qty < 1) cart.splice(i, 1); }
    if (act === "rm") cart.splice(i, 1);
    if (act === "clear") cart = [];
    save(); renderCart();
  });
  function openCart() { renderCart(); drawer.classList.add("open"); scrim.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; var c = $("#cart-close"); c && c.focus(); }
  function closeCart() { drawer.classList.remove("open"); scrim.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }
  scrim.addEventListener("click", closeCart);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeCart(); closeSearch(); } });
  $("#btn-cart").addEventListener("click", openCart);

  function addToCart(item, qty) {
    qty = qty || 1;
    var key = item.id + "|" + (item.opts || []).join(",");
    var ex = cart.filter(function (l) { return l.key === key; })[0];
    if (ex) ex.qty = Math.min(99, ex.qty + qty);
    else cart.push({ key: key, id: item.id, name: item.name, unit: item.unit, qty: qty, opts: item.opts || [], image: item.image || "" });
    save(); renderCart();
    toast(qty + " × " + item.name + " added", { action: "View cart", onAction: openCart });
  }

  function orderText() {
    var lines = cart.map(function (l) { return l.qty + " × " + l.name + (l.opts.length ? " (" + l.opts.join(", ") + ")" : "") + " — " + T.fmt(l.unit * l.qty); });
    return "Toyas order\n" + lines.join("\n") + "\nSubtotal: " + T.fmt(subtotal());
  }
  function checkout() {
    closeCart();
    var rows = cart.map(function (l) { return "<div><span>" + l.qty + " × " + esc(l.name) + "</span><b>" + T.fmt(l.unit * l.qty) + "</b></div>"; }).join("");
    var m = openModal(
      '<span class="demo-flag">Prototype checkout</span><h2 style="margin-top:10px">Almost there</h2>' +
      '<p>Online payment isn\'t connected yet, so <b>no payment has been taken and your order has not been sent</b>. To place this order, call or message Toyas with the summary below.</p>' +
      '<div class="summary-list">' + rows + '<div style="border-top:1px solid var(--line);margin-top:6px;padding-top:6px"><span>Subtotal</span><b>' + T.fmt(subtotal()) + '</b></div></div>' +
      '<div class="actions"><a class="btn" href="tel:' + T.brand.phone + '">' + icon("phone") + ' Call ' + esc(T.brand.phoneDisplay) + '</a>' +
      '<button class="btn ghost" type="button" id="copy-order">Copy order summary</button>' +
      '<a class="btn ghost" href="' + T.brand.instagramUrl + '" target="_blank" rel="noopener">' + icon("insta") + ' ' + esc(T.brand.instagram) + '</a></div>');
    $("#copy-order", m.el).addEventListener("click", function () {
      var txt = orderText();
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(function () { toast("Order summary copied"); }, function () { toast("Couldn't copy — select the text manually", { error: true }); });
      else toast("Copy isn't supported in this browser", { error: true });
    });
  }

  /* ---------- search overlay ---------- */
  var sov = document.createElement("div");
  sov.className = "search-ov"; sov.setAttribute("aria-hidden", "true");
  sov.innerHTML = '<div class="search-box" role="dialog" aria-modal="true" aria-label="Search drinks"><div class="search-top">' + icon("search") +
    '<input id="q" type="search" placeholder="Search drinks — try “strawberry” or “hojicha”" autocomplete="off" aria-label="Search drinks"><button class="icon-btn" type="button" id="q-close" aria-label="Close search" style="color:var(--navy)">' + icon("close") + '</button></div>' +
    '<div class="search-results" id="q-results" aria-live="polite"></div></div>';
  document.body.appendChild(sov);
  function match(q) {
    q = q.trim().toLowerCase(); if (!q) return [];
    var words = q.split(/\s+/);
    return T.products.filter(function (p) {
      var hay = (p.name + " " + (p.subtitle || "") + " " + T.catLabel(p.category) + " " + p.category + " " + p.description + " " + p.tags.join(" ")).toLowerCase();
      return words.every(function (w) { return hay.indexOf(w) > -1; });
    });
  }
  window.ToyasUI.match = match;
  function resultItem(p) {
    return '<a class="sr-item" href="product.html?id=' + p.id + '"><span class="sr-img' + (p.image ? "" : " t") + '">' + (p.image ? '<img src="' + p.image + '" alt="">' : "T") + '</span>' +
      '<span><b>' + esc(p.name) + '</b><small>' + T.catLabel(p.category) + '</small></span><span class="sr-price">' + T.fmt(p.price) + '</span></a>';
  }
  function renderSearch() {
    var q = $("#q").value, box = $("#q-results");
    if (!q.trim()) { box.innerHTML = '<p class="search-hint">Search by drink name, flavour or category.</p>' + T.products.filter(function (p) { return p.featured; }).slice(0, 4).map(resultItem).join(""); return; }
    var r = match(q);
    box.innerHTML = r.length ? r.map(resultItem).join("") :
      '<div class="state" style="padding:30px 10px">' + icon("sad") + '<h3>NO DRINKS FOUND</h3><p>Nothing matches “' + esc(q) + '”.</p><button class="btn small" type="button" id="q-clear">Clear search</button> <a class="btn small ghost" href="menu.html">Browse full menu</a></div>';
    var c = $("#q-clear"); if (c) c.addEventListener("click", function () { $("#q").value = ""; renderSearch(); $("#q").focus(); });
  }
  function openSearch() { sov.classList.add("open"); sov.setAttribute("aria-hidden", "false"); renderSearch(); setTimeout(function () { $("#q").focus(); }, 60); }
  function closeSearch() { sov.classList.remove("open"); sov.setAttribute("aria-hidden", "true"); }
  $("#btn-search").addEventListener("click", openSearch);
  $("#q-close").addEventListener("click", closeSearch);
  $("#q").addEventListener("input", renderSearch);
  sov.addEventListener("click", function (e) { if (e.target === sov) closeSearch(); });
  document.addEventListener("keydown", function (e) { if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); } });

  /* ---------- product card ---------- */
  function photoOrTile(p) {
    if (p.image) return '<img src="' + p.image + '" alt="' + esc(p.name) + ' — Toyas drink" loading="lazy">';
    return '<div class="ph-soon ' + p.category + '"><span class="logo">Toyas</span><small>Photo coming soon</small></div>';
  }
  function card(p) {
    return '<article class="card reveal"><a class="card-link" href="product.html?id=' + p.id + '" aria-label="View ' + esc(p.name) + '"></a>' +
      '<div class="ph">' + ((p.isNew || p.limited) ? '<div class="tag">' + (p.limited ? '<span>Limited</span>' : "") + (p.isNew ? '<span>New</span>' : "") + '</div>' : "") + photoOrTile(p) + '</div>' +
      '<div class="card-body"><div><h3>' + esc(p.name) + (p.subtitle ? ' <span style="font-weight:500">(' + esc(p.subtitle) + ')</span>' : "") + '</h3><span class="price">' + T.fmt(p.price) + '</span></div>' +
      '<button class="add-circle" type="button" data-add="' + p.id + '" aria-label="Add ' + esc(p.name) + ' to cart">' + icon("plus") + '</button></div></article>';
  }
  window.ToyasUI.card = card;
  window.ToyasUI.photoOrTile = photoOrTile;
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-add]"); if (!b) return;
    e.preventDefault();
    var p = T.byId(b.getAttribute("data-add")); if (!p) return;
    addToCart({ id: p.id, name: p.name, unit: p.price, image: p.image, opts: [] }, 1);
  });

  /* ---------- loyalty card ---------- */
  function loyaltyCard(filled, interactive) {
    var out = '<div class="lcard"><h4>YOUR 10TH MATCHA IS ON US.</h4><div class="cups">';
    for (var i = 1; i <= 10; i++) {
      var cls = "stamp" + (i <= filled ? " on" : "") + (i === 10 ? " free" : "");
      out += interactive && i < 10
        ? '<button type="button" class="' + cls + '" data-stamp="' + i + '" aria-pressed="' + (i <= filled) + '" aria-label="Stamp ' + i + '">' + cupSvg() + '</button>'
        : '<div class="' + cls + '"' + (i === 10 ? ' aria-label="Stamp 10: free drink"' : "") + '>' + cupSvg() + '</div>';
    }
    return out + "</div></div>";
  }
  window.ToyasUI.loyaltyCard = loyaltyCard;

  /* ---------- reveal on scroll ---------- */
  var io = ("IntersectionObserver" in window) ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: .12 }) : null;
  function observe(root) {
    $$(".reveal:not(.in)", root).forEach(function (el) { io ? io.observe(el) : el.classList.add("in"); });
  }
  window.ToyasUI.observe = observe;

  /* expose */
  window.ToyasUI.addToCart = addToCart;
  window.ToyasUI.openCart = openCart;
  window.ToyasUI.toast = toast;
  window.ToyasUI.openModal = openModal;
  window.ToyasUI.setTitle = function (t) { document.title = t; };

  renderCart();
  document.addEventListener("DOMContentLoaded", function () { observe(document); });
  if (document.readyState !== "loading") observe(document);
})();
