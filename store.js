/* Onno mock storefront — localStorage cart only. No payments. */
(function () {
  const KEY = "onno_mock_cart";
  const PRODUCT = {
    id: "onno-60g",
    name: "Onno",
    tagline: "fresh in a scoop",
    size: "60 g",
    price: 32,
    image: "hero.jpg",
  };

  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return { items: [] };
      const data = JSON.parse(raw);
      return data && Array.isArray(data.items) ? data : { items: [] };
    } catch {
      return { items: [] };
    }
  }

  function write(cart) {
    localStorage.setItem(KEY, JSON.stringify(cart));
    updateBadge();
    return cart;
  }

  function getQty() {
    const cart = read();
    return cart.items.reduce((n, i) => n + (i.qty || 0), 0);
  }

  function updateBadge() {
    const n = getQty();
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      el.textContent = String(n);
      el.hidden = n === 0;
    });
  }

  function add(qty) {
    qty = Math.max(1, parseInt(qty, 10) || 1);
    const cart = read();
    const existing = cart.items.find((i) => i.id === PRODUCT.id);
    if (existing) existing.qty += qty;
    else cart.items.push({ ...PRODUCT, qty });
    return write(cart);
  }

  function setQty(id, qty) {
    qty = parseInt(qty, 10) || 0;
    const cart = read();
    const item = cart.items.find((i) => i.id === id);
    if (!item) return cart;
    if (qty <= 0) cart.items = cart.items.filter((i) => i.id !== id);
    else item.qty = qty;
    return write(cart);
  }

  function clear() {
    return write({ items: [] });
  }

  function subtotal() {
    return read().items.reduce((s, i) => s + i.price * i.qty, 0);
  }

  function money(n) {
    return "$" + n.toFixed(2).replace(/\.00$/, "");
  }

  window.OnnoStore = {
    PRODUCT,
    read,
    add,
    setQty,
    clear,
    getQty,
    subtotal,
    money,
    updateBadge,
  };

  document.addEventListener("DOMContentLoaded", updateBadge);
})();
