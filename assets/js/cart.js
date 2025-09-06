
document.addEventListener('DOMContentLoaded', () => {
  const CART_KEY = 'noartemarket:cart';
  const $count = document.getElementById('cart-count');
  const $items = document.getElementById('cart-items');
  const $subtotal = document.getElementById('cart-subtotal');
  const money = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

  // ------- Estado -------
  let cart = loadCart();
  function loadCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  }
  function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  // ------- UI -------
  function updateCount() {
    const count = cart.reduce((n, i) => n + i.qty, 0);
    if ($count) {
      $count.textContent = count;
      // ocultar si es 0
      $count.style.display = count > 0 ? '' : 'none';
    }
  }

  function renderCart() {
    if (!$items) return;
    $items.innerHTML = '';

    if (cart.length === 0) {
      const li = document.createElement('li');
      li.className = 'list-group-item text-center text-muted';
      li.textContent = 'Tu carrito está vacío.';
      $items.appendChild(li);
      if ($subtotal) $subtotal.textContent = money.format(0);
      updateCount();
      return;
    }

    let total = 0;
    for (const p of cart) {
      total += p.price * p.qty;

      const li = document.createElement('li');
      li.className = 'list-group-item d-flex align-items-center justify-content-between gap-2';
      li.innerHTML = `
        <div class="flex-grow-1">
          <div class="fw-medium">${p.name}</div>
          <div class="d-flex align-items-center gap-2 mt-1">
            <button class="btn btn-sm btn-outline-secondary qty-dec" data-id="${p.id}" aria-label="Restar cantidad">−</button>
            <span style="display:inline-block;width:2rem;text-align:center">${p.qty}</span>
            <button class="btn btn-sm btn-outline-secondary qty-inc" data-id="${p.id}" aria-label="Sumar cantidad">+</button>
          </div>
        </div>
        <div class="text-end">
          <div class="fw-semibold">${money.format(p.price * p.qty)}</div>
          <button class="btn btn-sm px-2 btn-outline-danger mt-1 remove-item" data-id="${p.id}">x</button>
        </div>
      `;
      $items.appendChild(li);
    }

    if ($subtotal) $subtotal.textContent = money.format(total);
    updateCount();
  }

  // ------- Acciones -------
  function addToCart({ id, name, price }) {
    const priceNum = Number(price);
    if (!id || !name || Number.isNaN(priceNum)) return;
    const found = cart.find(i => i.id === id);
    if (found) found.qty += 1;
    else cart.push({ id, name, price: priceNum, qty: 1 });
    saveCart();
    renderCart();
  }

  function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    renderCart();
  }

  function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) return removeFromCart(id);
    saveCart();
    renderCart();
  }

  // ------- Toast -------
  function showCartToast(msg = 'Producto agregado con éxito.') {
    const toastEl = document.getElementById('cartToast');
    if (!toastEl) return;
    const body = toastEl.querySelector('.toast-body');
    if (body) body.textContent = msg;
    bootstrap.Toast.getOrCreateInstance(toastEl).show();
  }

  // ------- Listeners -------
  document.addEventListener('click', (ev) => {
    // Agregar al carrito (desde cualquier botón con .add-to-cart)
    const addBtn = ev.target.closest('.add-to-cart');
    if (addBtn) {
      const payload = {
        id: addBtn.dataset.id,
        name: addBtn.dataset.name,
        price: addBtn.dataset.price
      };
      addToCart(payload);
      showCartToast(`“${payload.name}” agregado con éxito.`);

    }

    // Quitar item
    const removeBtn = ev.target.closest('.remove-item');
    if (removeBtn) removeFromCart(removeBtn.dataset.id);

    // Cantidades
    const inc = ev.target.closest('.qty-inc');
    if (inc) changeQty(inc.dataset.id, +1);
    const dec = ev.target.closest('.qty-dec');
    if (dec) changeQty(dec.dataset.id, -1);
  });

  // Render inicial y al abrir el offcanvas
  renderCart();
  const ocEl = document.getElementById('cartOffcanvas');
  if (ocEl) ocEl.addEventListener('show.bs.offcanvas', renderCart);
});