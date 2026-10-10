/* ==========================================================
   TOYAS — product & site data
   Edit this file to change drinks, prices, contact details.
   Prices keep the notation from the Toyas menu ("NL") until
   the business confirms the intended currency format.
   ========================================================== */

window.TOYAS = {
  brand: {
    name: "Toyas",
    phone: "+23272841726",
    phoneDisplay: "+23272841726",
    address: "109E Wilkinson Road",
    instagram: "@toyas.sl",
    instagramUrl: "https://www.instagram.com/toyas.sl/",
    email: "",   // not confirmed yet — leave empty to hide
    hours: ""    // not confirmed yet — leave empty to hide
  },

  currency: "NL",

  categories: [
    { id: "signature", label: "Signature Matcha" },
    { id: "seasonal",  label: "Seasonal Matcha" },
    { id: "hojicha",   label: "Hojicha" }
  ],

  /* image: path in /assets, or null -> branded "photo coming soon" tile.
     images: optional gallery list. description: only what is known. */
  products: [
    { id: "salted-caramel", name: "Toyas Signature Salted Caramel", price: 280, category: "signature",
      image: "assets/salted-caramel.jpg", images: ["assets/product-main.jpg", "assets/salted-caramel.jpg"],
      description: "Our signature matcha with a smooth salted caramel finish.",
      tags: ["salted caramel", "caramel", "signature", "matcha"], isNew: false, limited: false, featured: true },
    { id: "strawberry-blush", name: "Strawberry Blush", price: 280, category: "signature",
      image: "assets/strawberry-blush.jpg", images: ["assets/strawberry-blush.jpg"],
      description: "A strawberry matcha creation from our signature range.",
      tags: ["strawberry", "pink", "fruity", "matcha"], isNew: false, limited: false, featured: true },
    { id: "strawberry-shortcake", name: "Strawberry Shortcake", price: 350, category: "signature",
      image: "assets/strawberry-shortcake.jpg", images: ["assets/strawberry-shortcake.jpg"],
      description: "A strawberry shortcake matcha from our signature range.",
      tags: ["strawberry", "shortcake", "dessert", "matcha"], isNew: false, limited: false, featured: false },
    { id: "vanilla-classic", name: "Vanilla Classic", price: 280, category: "signature",
      image: "assets/vanilla-classic.jpg", images: ["assets/vanilla-classic.jpg"],
      description: "A classic vanilla matcha.",
      tags: ["vanilla", "classic", "matcha"], isNew: true, limited: false, featured: true },
    { id: "vanilla-cold-foam", name: "Vanilla Cold Foam", price: 325, category: "signature",
      image: "assets/vanilla-cold-foam.jpg", images: ["assets/vanilla-cold-foam.jpg"],
      description: "Vanilla matcha topped with cold foam.",
      tags: ["vanilla", "cold foam", "foam", "matcha"], isNew: true, limited: false, featured: false },
    { id: "blueberry-bombshell", name: "Blueberry Bombshell", price: 325, category: "signature",
      image: "assets/blueberry-bombshell.jpg", images: ["assets/blueberry-bombshell.jpg"],
      description: "A limited-edition blueberry matcha.",
      tags: ["blueberry", "berry", "limited", "matcha"], isNew: true, limited: true, featured: true },
    { id: "coconut-cloud", name: "Coconut Cloud", price: 280, category: "signature",
      image: "assets/coconut-cloud.jpg", images: ["assets/coconut-cloud.jpg"],
      description: "A coconut matcha from our signature range.",
      tags: ["coconut", "cloud", "matcha"], isNew: false, limited: false, featured: true },

    { id: "banana-bread", name: "Banana Bread", subtitle: "Dough Collab", price: 325, category: "seasonal",
      image: null, images: [], description: "Seasonal matcha, made in collaboration with Dough.",
      tags: ["banana", "banana bread", "dough", "collab", "seasonal"], isNew: false, limited: false, featured: false },
    { id: "sierra-gold", name: "Sierra Gold", price: 280, category: "seasonal",
      image: null, images: [], description: "A seasonal matcha creation.",
      tags: ["sierra", "gold", "seasonal"], isNew: false, limited: false, featured: false },
    { id: "mango-sticky-rice", name: "Mango Sticky Rice", price: 325, category: "seasonal",
      image: null, images: [], description: "A seasonal matcha inspired by mango sticky rice.",
      tags: ["mango", "sticky rice", "rice", "seasonal"], isNew: false, limited: false, featured: false },
    { id: "lemon-meringue", name: "Lemon Meringue", price: 325, category: "seasonal",
      image: null, images: [], description: "A seasonal matcha inspired by lemon meringue.",
      tags: ["lemon", "meringue", "citrus", "seasonal"], isNew: false, limited: false, featured: false },

    { id: "salted-caramel-hojicha", name: "Salted Caramel Hojicha", price: 250, category: "hojicha",
      image: null, images: [], description: "Roasted green tea (hojicha) with salted caramel.",
      tags: ["hojicha", "roasted", "green tea", "salted caramel", "tea"], isNew: false, limited: false, featured: false }
  ],

  addons: [
    { id: "pro",   name: "Go PRO", detail: "add protein powder", price: 80 },
    { id: "syrup", name: "Extra Pump of Syrup", detail: "", price: 30 }
  ],

  /* Customisation choices taken from the design mockup.
     No price differences are confirmed, so they cost 0 until Toyas confirms.
     Remove or edit anything Toyas does not actually offer. */
  options: {
    size:      ["Small", "Medium", "Large"],
    milk:      ["Whole Milk", "Oat Milk", "Almond Milk", "Soy Milk"],
    sweetness: ["Regular", "Less Sweet", "Extra Sweet"],
    ice:       ["Regular Ice", "Light Ice", "No Ice"]
  },

  /* Build-your-own: flavour -> price. Prices mirror the matching menu drinks. */
  build: {
    bases: [
      { id: "matcha",  label: "Matcha",  price: 280 },
      { id: "hojicha", label: "Hojicha", price: 250 }
    ],
    flavours: [
      { id: "vanilla",       label: "Vanilla",       price: 280, icon: "bean" },
      { id: "strawberry",    label: "Strawberry",    price: 280, icon: "berry" },
      { id: "salted-caramel",label: "Salted Caramel",price: 280, icon: "drop" },
      { id: "blueberry",     label: "Blueberry",     price: 325, icon: "berry" },
      { id: "coconut",       label: "Coconut",       price: 280, icon: "leaf" },
      { id: "mango",         label: "Mango",         price: 325, icon: "sun" }
    ]
  }
};

window.TOYAS.byId = function (id) {
  return window.TOYAS.products.find(function (p) { return p.id === id; });
};
window.TOYAS.catLabel = function (id) {
  var c = window.TOYAS.categories.find(function (c) { return c.id === id; });
  return c ? c.label : id;
};
window.TOYAS.fmt = function (n) { return n + " " + window.TOYAS.currency; };
