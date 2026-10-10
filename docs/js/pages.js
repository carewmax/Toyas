/* ==========================================================
   TOYAS — page-specific behaviour
   ========================================================== */
(function () {
  "use strict";
  var T = window.TOYAS, U = window.ToyasUI;
  var $ = U.$, $$ = U.$$, icon = U.icon, esc = U.esc;
  var page = document.body.getAttribute("data-page");
  var params = new URLSearchParams(location.search);

  /* ---------- HOME ---------- */
  if (page === "home") {
    var fg = $("#feat-grid");
    var feat = ["salted-caramel", "strawberry-blush", "vanilla-classic", "blueberry-bombshell", "coconut-cloud"].map(T.byId).filter(Boolean);
    fg.innerHTML = feat.map(U.card).join("");
    $("#home-loyalty").innerHTML = U.loyaltyCard(0, false);
    // gentle pointer parallax on hero art (skipped for reduced motion)
    var art = $("#hero-art");
    if (art && !(matchMedia("(prefers-reduced-motion: reduce)").matches) && matchMedia("(pointer:fine)").matches) {
      $(".hero").addEventListener("mousemove", function (e) {
        var r = this.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        art.style.transform = "translate(" + (x * -14) + "px," + (y * -10) + "px)";
      });
    }
  }

  /* ---------- MENU ---------- */
  if (page === "menu") {
    var activeCat = params.get("cat") || "all";
    if (!T.categories.some(function (c) { return c.id === activeCat; })) activeCat = "all";
    var query = params.get("q") || "";
    var pills = $("#pills"), listEl = $("#menu-list"), qIn = $("#menu-q");
    qIn.value = query;
    function drawPills() {
      var all = [{ id: "all", label: "All" }].concat(T.categories);
      pills.innerHTML = all.map(function (c) {
        return '<button type="button" class="pill' + (c.id === activeCat ? " active" : "") + '" data-cat="' + c.id + '" aria-pressed="' + (c.id === activeCat) + '">' + c.label.replace(" Matcha", "") + (c.id !== "all" && c.id !== "hojicha" ? "" : "") + '</button>';
      }).join("");
    }
    function drawMenu() {
      var items = T.products.filter(function (p) { return activeCat === "all" || p.category === activeCat; });
      if (query.trim()) { var m = U.match(query).map(function (p) { return p.id; }); items = items.filter(function (p) { return m.indexOf(p.id) > -1; }); }
      if (!items.length) {
        listEl.innerHTML = '<div class="state">' + icon("sad") + '<h3>' + (query.trim() ? "NO DRINKS FOUND" : "NOTHING HERE YET") + '</h3><p>' +
          (query.trim() ? "Nothing matches “" + esc(query) + "”." : "There are no drinks in this category right now.") + '</p><button class="btn" type="button" id="clear-filters">Clear search &amp; show full menu</button></div>';
        $("#clear-filters").addEventListener("click", function () { query = ""; activeCat = "all"; qIn.value = ""; sync(); });
        $("#addons").hidden = true;
        return;
      }
      var html = "";
      T.categories.forEach(function (c) {
        var group = items.filter(function (p) { return p.category === c.id; });
        if (!group.length) return;
        var note = c.id === "hojicha" ? "Roasted green tea" : "";
        html += '<section class="menu-cat" aria-labelledby="h-' + c.id + '"><h2 id="h-' + c.id + '">' + c.label + (note ? ' <small>— ' + note + '</small>' : "") + '</h2>' +
          '<div class="menu-grid' + (c.id === "signature" ? "" : " compact") + '">' + group.map(U.card).join("") + '</div></section>';
      });
      listEl.innerHTML = html;
      $("#addons").hidden = !(activeCat === "all" && !query.trim());
      U.observe(listEl);
    }
    function sync() {
      drawPills(); drawMenu();
      var u = new URL(location.href);
      activeCat === "all" ? u.searchParams.delete("cat") : u.searchParams.set("cat", activeCat);
      query.trim() ? u.searchParams.set("q", query) : u.searchParams.delete("q");
      history.replaceState(null, "", u);
    }
    pills.addEventListener("click", function (e) { var b = e.target.closest("[data-cat]"); if (!b) return; activeCat = b.getAttribute("data-cat"); sync(); });
    qIn.addEventListener("input", function () { query = qIn.value; sync(); });
    // add-ons list
    $("#addon-list").innerHTML = T.addons.map(function (a) {
      return '<div class="addon"><span class="ai">' + icon(a.id === "pro" ? "protein" : "syrup") + '</span><div class="grow"><b>' + esc(a.name) + '</b><span>' + (a.detail ? "(" + esc(a.detail) + ")" : "&nbsp;") + '</span></div><b>' + T.fmt(a.price) + '</b></div>';
    }).join("");
    sync();
  }

  /* ---------- PRODUCT ---------- */
  if (page === "product") {
    var p = T.byId(params.get("id"));
    var root = $("#pd-root");
    if (!p) {
      root.innerHTML = '<div class="state wrap">' + icon("sad") + '<h3>DRINK NOT FOUND</h3><p>We couldn\'t find that drink — it may have been removed from the menu.</p><a class="btn" href="menu.html">Back to the menu</a></div>';
    } else {
      document.title = p.name + " — Toyas";
      var md = document.querySelector('meta[name="description"]'); if (md) md.content = p.name + " (" + T.fmt(p.price) + ") — " + p.description;
      var imgs = (p.images && p.images.length) ? p.images : [];
      var cur = 0;
      var REVKEY = "toyas_reviews_" + p.id;
      var reviews = []; try { reviews = JSON.parse(localStorage.getItem(REVKEY) || "[]"); } catch (e) { reviews = []; }
      var optSel = function (id, label, list) {
        return '<div class="field"><label for="' + id + '">' + label + '</label><select id="' + id + '">' + list.map(function (o, i) { return '<option' + (i === (id === "o-size" ? 1 : 0) ? " selected" : "") + '>' + o + '</option>'; }).join("") + '</select></div>';
      };
      root.innerHTML =
        '<div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> / <a href="menu.html">Menu</a> / <a href="menu.html?cat=' + p.category + '">' + T.catLabel(p.category) + '</a> / ' + esc(p.name) + '</nav>' +
        '<div class="pd"><div class="gallery"><div class="main" id="g-main" tabindex="0" role="button" aria-label="Enlarge photo">' + '</div><div class="thumbs" id="g-thumbs"></div></div>' +
        '<div class="pd-info"><span class="pd-cat">' + T.catLabel(p.category) + ((p.isNew || p.limited) ? " · " + (p.limited ? "Limited " : "") + (p.isNew ? "New" : "") : "") + '</span>' +
        '<h1>' + esc(p.name) + (p.subtitle ? ' <small style="font-size:.5em;font-weight:500">(' + esc(p.subtitle) + ')</small>' : "") + '</h1>' +
        '<div class="pd-price" id="pd-price">' + T.fmt(p.price) + '</div><div id="pd-rating"></div><p>' + esc(p.description) + '</p>' +
        '<div class="opt-title">Customise your drink</div><div class="opt-grid">' +
        optSel("o-size", "Size", T.options.size) + optSel("o-milk", "Milk", T.options.milk) + optSel("o-sweet", "Sweetness", T.options.sweetness) + optSel("o-ice", "Ice", T.options.ice) + '</div>' +
        '<p class="fine" style="margin-top:8px">Options come from the design and have no extra charge. Toyas confirms what\'s available.</p>' +
        '<div class="opt-title">Add-ons</div>' + T.addons.map(function (a) {
          return '<label class="addon-check"><input type="checkbox" data-addon="' + a.id + '"><span><b>' + esc(a.name) + '</b>' + (a.detail ? ' <small>(' + esc(a.detail) + ')</small>' : "") + '</span><span>+' + T.fmt(a.price) + '</span></label>';
        }).join("") +
        '<div class="buy-row"><div class="qty" role="group" aria-label="Quantity"><button type="button" id="q-dec" aria-label="Decrease quantity">−</button><output id="q-out">1</output><button type="button" id="q-inc" aria-label="Increase quantity">+</button></div>' +
        '<button class="btn" type="button" id="pd-add">Add to Cart · <span id="pd-total"></span></button></div></div></div>' +
        '<div class="tabs" role="tablist"><button class="tab on" role="tab" id="t-rev" aria-selected="true" aria-controls="p-rev">Reviews</button><button class="tab" role="tab" id="t-rel" aria-selected="false" aria-controls="p-rel">Related Drinks</button></div>' +
        '<div class="tabpanel" id="p-rev" role="tabpanel" aria-labelledby="t-rev"></div>' +
        '<div class="tabpanel" id="p-rel" role="tabpanel" aria-labelledby="t-rel" hidden><div class="related" id="rel-grid"></div></div></div>';

      /* gallery */
      var main = $("#g-main"), thumbs = $("#g-thumbs");
      function drawGallery() {
        if (!imgs.length) { main.innerHTML = U.photoOrTile(p); main.style.cursor = "default"; thumbs.innerHTML = ""; return; }
        main.innerHTML = '<img src="' + imgs[cur] + '" alt="' + esc(p.name) + ' — photo ' + (cur + 1) + ' of ' + imgs.length + '">';
        thumbs.innerHTML = imgs.length > 1 ? imgs.map(function (s, i) { return '<button type="button" class="' + (i === cur ? "on" : "") + '" data-i="' + i + '" aria-label="Show photo ' + (i + 1) + '"><img src="' + s + '" alt=""></button>'; }).join("") : "";
      }
      thumbs.addEventListener("click", function (e) { var b = e.target.closest("[data-i]"); if (b) { cur = +b.getAttribute("data-i"); drawGallery(); } });
      function zoom() { if (!imgs.length) return; U.openModal('<img src="' + imgs[cur] + '" alt="' + esc(p.name) + ' enlarged">', "lightbox"); }
      main.addEventListener("click", zoom);
      main.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); zoom(); } });
      // swipe
      var sx = null;
      main.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
      main.addEventListener("touchend", function (e) {
        if (sx === null || imgs.length < 2) return;
        var dx = e.changedTouches[0].clientX - sx;
        if (Math.abs(dx) > 40) { cur = (cur + (dx < 0 ? 1 : -1) + imgs.length) % imgs.length; drawGallery(); }
        sx = null;
      });
      drawGallery();

      /* price + qty */
      var qty = 1;
      function addonsChosen() { return T.addons.filter(function (a) { return $('[data-addon="' + a.id + '"]').checked; }); }
      function unit() { return p.price + addonsChosen().reduce(function (n, a) { return n + a.price; }, 0); }
      function refresh() { $("#pd-total").textContent = T.fmt(unit() * qty); $("#q-out").textContent = qty; }
      $("#q-dec").addEventListener("click", function () { qty = Math.max(1, qty - 1); refresh(); });
      $("#q-inc").addEventListener("click", function () { qty = Math.min(99, qty + 1); refresh(); });
      $$("[data-addon]").forEach(function (c) { c.addEventListener("change", refresh); });
      $("#pd-add").addEventListener("click", function () {
        var opts = [$("#o-size").value + " size", $("#o-milk").value, $("#o-sweet").value + " sweetness", $("#o-ice").value].concat(addonsChosen().map(function (a) { return a.name; }));
        U.addToCart({ id: p.id, name: p.name, unit: unit(), image: p.image, opts: opts }, qty);
      });
      refresh();

      /* tabs */
      function tab(which) {
        var rev = which === "rev";
        $("#t-rev").classList.toggle("on", rev); $("#t-rel").classList.toggle("on", !rev);
        $("#t-rev").setAttribute("aria-selected", rev); $("#t-rel").setAttribute("aria-selected", !rev);
        $("#p-rev").hidden = !rev; $("#p-rel").hidden = rev;
      }
      $("#t-rev").addEventListener("click", function () { tab("rev"); });
      $("#t-rel").addEventListener("click", function () { tab("rel"); });

      /* related */
      var rel = T.products.filter(function (x) { return x.id !== p.id && x.category === p.category; });
      if (rel.length < 4) rel = rel.concat(T.products.filter(function (x) { return x.id !== p.id && x.category !== p.category && x.image; }));
      $("#rel-grid").innerHTML = rel.slice(0, 4).map(U.card).join("");
      U.observe($("#rel-grid"));

      /* reviews (local demo only — no backend) */
      var rating = 0;
      function drawReviews() {
        var n = reviews.length, avg = n ? reviews.reduce(function (s, r) { return s + r.rating; }, 0) / n : 0;
        $("#pd-rating").innerHTML = n ? '<span style="display:inline-flex;gap:8px;align-items:center">' + U.stars(avg) + '<b>' + avg.toFixed(1) + '</b><span class="fine">(' + n + " review" + (n > 1 ? "s" : "") + ', saved on this device)</span></span>' : '<span class="fine">No reviews yet</span>';
        var bars = [5, 4, 3, 2, 1].map(function (s) {
          var c = reviews.filter(function (r) { return r.rating === s; }).length;
          return '<div class="bar-row"><span>' + s + ' ★</span><div class="bar"><i style="width:' + (n ? Math.round(c / n * 100) : 0) + '%"></i></div><span>' + (n ? Math.round(c / n * 100) : 0) + '%</span></div>';
        }).join("");
        var list = n ? reviews.map(function (r) {
          return '<div class="review">' + U.stars(r.rating) + '<h4>' + esc(r.title) + '</h4><p>' + esc(r.text) + '</p><div class="meta">' + esc(r.name) + ' · ' + esc(r.date) + ' · <span class="demo-flag">Demo — this device only</span></div></div>';
        }).join("") : '<div class="state" style="padding:30px 10px">' + icon("star") + '<h3>NO REVIEWS YET</h3><p>Be the first to share what you think of ' + esc(p.name) + '.</p></div>';
        $("#p-rev").innerHTML = '<div class="rev-grid"><div><div class="rating-box"><div class="big">' + (n ? avg.toFixed(1) : "–") + '</div><div class="fine" style="margin-bottom:8px">' + (n ? "out of 5" : "no ratings yet") + '</div>' + bars + '</div></div>' +
          '<div>' + list + '<button class="btn ghost small" type="button" id="show-form">Write a Review</button>' +
          '<form class="rev-form" id="rev-form" hidden novalidate><p class="form-msg info" style="display:block">Demo only: reviews are saved in this browser and are not published to other customers.</p>' +
          '<div class="field"><label id="rl">Your rating *</label><div class="star-input" role="radiogroup" aria-labelledby="rl">' + [1, 2, 3, 4, 5].map(function (i) { return '<button type="button" role="radio" aria-checked="false" data-star="' + i + '" aria-label="' + i + ' star' + (i > 1 ? "s" : "") + '">' + icon("star") + '</button>'; }).join("") + '</div><div class="err">Please choose a rating.</div></div>' +
          '<div class="field"><label for="r-name">Your name *</label><input id="r-name" maxlength="40" autocomplete="given-name"><div class="err">Please enter your name.</div></div>' +
          '<div class="field"><label for="r-title">Review title *</label><input id="r-title" maxlength="80"><div class="err">Please add a title.</div></div>' +
          '<div class="field"><label for="r-text">Your review *</label><textarea id="r-text" maxlength="600"></textarea><div class="err">Please write a few words.</div></div>' +
          '<button class="btn" type="submit">Submit review</button></form></div></div>';
        $("#show-form").addEventListener("click", function () { $("#rev-form").hidden = false; this.hidden = true; $("#r-name").focus(); });
        $$("[data-star]").forEach(function (b) {
          b.addEventListener("click", function () {
            rating = +b.getAttribute("data-star");
            $$("[data-star]").forEach(function (x) { var on = +x.getAttribute("data-star") <= rating; x.classList.toggle("on", on); x.setAttribute("aria-checked", +x.getAttribute("data-star") === rating); });
            b.closest(".field").classList.remove("invalid");
          });
        });
        $("#rev-form").addEventListener("submit", function (e) {
          e.preventDefault();
          var ok = true;
          function chk(el, bad) { var f = el.closest(".field"); f.classList.toggle("invalid", bad); if (bad) ok = false; }
          chk($("[data-star]"), !rating);
          chk($("#r-name"), !$("#r-name").value.trim()); chk($("#r-title"), !$("#r-title").value.trim()); chk($("#r-text"), !$("#r-text").value.trim());
          if (!ok) { U.toast("Please complete the highlighted fields", { error: true }); return; }
          reviews.unshift({ rating: rating, name: $("#r-name").value.trim(), title: $("#r-title").value.trim(), text: $("#r-text").value.trim(), date: new Date().toLocaleDateString() });
          try { localStorage.setItem(REVKEY, JSON.stringify(reviews)); } catch (err) { U.toast("Couldn't save the review in this browser", { error: true }); return; }
          rating = 0; drawReviews(); U.toast("Review saved on this device (demo)");
        });
      }
      drawReviews();
    }
  }

  /* ---------- BUILD YOUR OWN ---------- */
  if (page === "build") {
    var B = T.build;
    var STEPS = ["Base", "Flavour", "Milk", "Customise", "Size", "Name", "Preview"];
    var st = { base: "matcha", flavour: null, milk: T.options.milk[0], sweet: "Regular", ice: "Regular Ice", size: "Medium", pro: false, syrup: false, name: "" };
    var step = 0;
    var base = function () { return B.bases.filter(function (b) { return b.id === st.base; })[0]; };
    var flav = function () { return B.flavours.filter(function (f) { return f.id === st.flavour; })[0]; };
    function price() { var n = flav() ? flav().price : base().price; if (st.pro) n += 80; if (st.syrup) n += 30; return n; }
    function choiceBtn(attr, val, label, sel, ico, sub) {
      return '<button type="button" class="choice' + (sel ? " sel" : "") + '" data-' + attr + '="' + val + '" aria-pressed="' + sel + '">' + (ico ? icon(ico) : "") + '<span>' + label + (sub ? '<small>' + sub + '</small>' : "") + '</span></button>';
    }
    function drawSteps() {
      $("#stepper").innerHTML = STEPS.map(function (s, i) {
        return '<button type="button" class="step' + (i === step ? " cur" : i < step ? " done" : "") + '" data-step="' + i + '" ' + (i === step ? 'aria-current="step"' : "") + '><i>' + (i < step ? "✓" : i + 1) + '</i><span>' + s + '</span></button>';
      }).join("");
    }
    function drawPanel() {
      var h = "";
      if (step === 0) h = '<h3>1. Choose Your Base</h3><div class="choices">' + B.bases.map(function (b) { return choiceBtn("base", b.id, b.label, st.base === b.id, b.id === "matcha" ? "leaf" : "cup"); }).join("") + '</div>';
      if (step === 1) h = '<h3>2. Choose Your Flavour</h3><div class="choices">' + B.flavours.map(function (f) { return choiceBtn("flavour", f.id, f.label, st.flavour === f.id, f.icon, T.fmt(f.price)); }).join("") + '</div><p class="fine" style="margin-top:12px">Flavour is optional. Prices follow the matching drinks on the menu.</p>';
      if (step === 2) h = '<h3>3. Choose Your Milk</h3><div class="choices">' + T.options.milk.map(function (m) { return choiceBtn("milk", m, m, st.milk === m, "drop"); }).join("") + '</div>';
      if (step === 3) h = '<h3>4. Customise</h3><div class="choices">' + T.options.sweetness.map(function (m) { return choiceBtn("sweet", m, m, st.sweet === m, "sparkle"); }).join("") + '</div>' +
        '<h3 style="margin-top:20px">Ice</h3><div class="choices">' + T.options.ice.map(function (m) { return choiceBtn("ice", m, m, st.ice === m, "drop"); }).join("") + '</div>' +
        '<h3 style="margin-top:20px">Add-ons</h3><div class="choices">' + choiceBtn("addon", "pro", "Go PRO", st.pro, "protein", "protein powder +" + T.fmt(80)) + choiceBtn("addon", "syrup", "Extra Pump of Syrup", st.syrup, "syrup", "+" + T.fmt(30)) + '</div>';
      if (step === 4) h = '<h3>5. Choose Your Size</h3><div class="choices">' + T.options.size.map(function (m) { return choiceBtn("size", m, m, st.size === m, "cup"); }).join("") + '</div><p class="fine" style="margin-top:12px">Sizes have no extra charge in this prototype. Toyas confirms what is available.</p>';
      if (step === 5) h = '<h3>6. Name Your Drink <span class="fine">(optional)</span></h3><label class="sr-only" for="dn">Drink name</label><input id="dn" class="name-input" maxlength="30" placeholder="e.g. Sierra Sunrise" value="' + esc(st.name) + '">';
      if (step === 6) h = '<h3>7. Preview</h3><ul class="clist" style="font-size:.95rem">' + summaryRows().map(function (r) { return '<li><span>' + r[0] + '</span><span>' + esc(r[1]) + '</span></li>'; }).join("") + '</ul><p class="fine">This is a custom request. Toyas confirms the final recipe and price when you order.</p>';
      $("#panel").innerHTML = h;
      $("#back").hidden = step === 0;
      var next = $("#next");
      next.innerHTML = step === 6 ? "Add to Cart " + icon("plus") : "Next Step " + icon("arrow");
    }
    function summaryRows() {
      var r = [["Base", base().label]];
      r.push(["Flavour", flav() ? flav().label : "None (plain)"]);
      r.push(["Milk", st.milk], ["Sweetness", st.sweet], ["Ice", st.ice], ["Size", st.size]);
      if (st.pro) r.push(["Add-on", "Go PRO (protein powder)"]);
      if (st.syrup) r.push(["Add-on", "Extra Pump of Syrup"]);
      if (st.name.trim()) r.push(["Name", st.name.trim()]);
      return r;
    }
    function drawCreation() {
      $("#cimg").innerHTML = '<img src="assets/build-cup.jpg" alt="Your Toyas creation">';
      $("#clist").innerHTML = summaryRows().map(function (r) { return '<li><span>' + r[0] + '</span><span>' + esc(r[1]) + '</span></li>'; }).join("");
      $("#est").textContent = T.fmt(price());
    }
    function render() { drawSteps(); drawPanel(); drawCreation(); }
    $("#panel").addEventListener("click", function (e) {
      var b = e.target.closest(".choice"); if (!b) return;
      var d = b.dataset;
      if (d.base) st.base = d.base;
      if (d.flavour) st.flavour = st.flavour === d.flavour ? null : d.flavour;
      if (d.milk) st.milk = d.milk; if (d.sweet) st.sweet = d.sweet; if (d.ice) st.ice = d.ice; if (d.size) st.size = d.size;
      if (d.addon === "pro") st.pro = !st.pro; if (d.addon === "syrup") st.syrup = !st.syrup;
      drawPanel(); drawCreation();
    });
    $("#panel").addEventListener("input", function (e) { if (e.target.id === "dn") { st.name = e.target.value; drawCreation(); } });
    $("#stepper").addEventListener("click", function (e) { var b = e.target.closest("[data-step]"); if (b) { step = +b.getAttribute("data-step"); render(); } });
    $("#back").addEventListener("click", function () { step = Math.max(0, step - 1); render(); window.scrollTo({ top: 0, behavior: "smooth" }); });
    $("#next").addEventListener("click", function () {
      if (step < 6) { step++; render(); return; }
      var title = (st.name.trim() || "Custom " + base().label) + (flav() ? " (" + flav().label + ")" : "");
      U.addToCart({ id: "custom", name: title, unit: price(), image: "assets/build-cup.jpg", opts: summaryRows().slice(2).map(function (r) { return r[1]; }) }, 1);
    });
    render();
  }

  /* ---------- REWARDS / ABOUT: loyalty demo ---------- */
  var demo = $("#loyalty-demo");
  if (demo) {
    var filled = 0;
    function drawDemo() {
      demo.innerHTML = U.loyaltyCard(filled, true);
      $("#demo-count").textContent = filled >= 9 ? "Your 10th matcha is on us!" : filled + " of 9 stamps · " + (9 - filled) + " to go until the 10th is free";
    }
    demo.addEventListener("click", function (e) {
      var b = e.target.closest("[data-stamp]"); if (!b) return;
      var n = +b.getAttribute("data-stamp"); filled = (filled === n) ? n - 1 : n; drawDemo();
    });
    $("#demo-reset").addEventListener("click", function () { filled = 0; drawDemo(); });
    drawDemo();
  }

  /* ---------- CONTACT ---------- */
  var form = $("#contact-form");
  if (form) {
    var msg = $("#form-msg");
    if (location.protocol === "file:") { msg.className = "form-msg info"; msg.textContent = "Preview mode: messages are only sent once the site is live on Netlify."; }
    function setMsg(cls, text) { msg.className = "form-msg " + cls; msg.textContent = text; msg.focus && msg.setAttribute("tabindex", "-1"); }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      function chk(id, bad) { var f = $("#" + id).closest(".field"); f.classList.toggle("invalid", bad); if (bad) ok = false; }
      chk("c-name", !$("#c-name").value.trim());
      chk("c-email", !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("#c-email").value.trim()));
      chk("c-subject", !$("#c-subject").value);
      chk("c-message", $("#c-message").value.trim().length < 5);
      if (!ok) { setMsg("bad", "Please fix the highlighted fields and try again."); return; }
      var btn = $("#c-send"); btn.disabled = true; btn.firstChild.textContent = "Sending… ";
      var body = new URLSearchParams(new FormData(form)).toString();
      fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body })
        .then(function (r) {
          if (!r.ok) throw new Error("status " + r.status);
          form.reset(); setMsg("ok", "Thank you! Your message has been sent to Toyas.");
        })
        .catch(function () {
          setMsg("bad", "We couldn't send your message from here. Please call " + T.brand.phoneDisplay + " or message " + T.brand.instagram + " on Instagram.");
        })
        .then(function () { btn.disabled = false; btn.firstChild.textContent = "Send Message "; });
    });
    $$("#contact-form input, #contact-form select, #contact-form textarea").forEach(function (el) {
      el.addEventListener("input", function () { el.closest(".field") && el.closest(".field").classList.remove("invalid"); });
    });
  }
})();
