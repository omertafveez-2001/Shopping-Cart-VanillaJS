const products = [
  { id: 1, name: 'Coffee Beans', price: 12 },
  { id: 2, name: 'Notebook', price: 5 },
  { id: 3, name: 'Wireless Mouse', price: 18 },
  { id: 4, name: 'Reusable Bottle', price: 14 },
];

const cart = [];

const productList = document.getElementById('product-list');
const cartList = document.getElementById('cart-items');
const cartEmpty = document.getElementById('cart-empty');
const itemCountEl = document.getElementById('item-count');
const subtotalEl = document.getElementById('subtotal');
const clearBtn = document.getElementById('clear-cart');
const buyBtn = document.getElementById('buy-cart');
const purchaseMessage = document.getElementById('purchase-message');

const formatCurrency = (value) => `$${value.toFixed(2)}`;

function renderProducts() {
  productList.innerHTML = '';
  products.forEach((product) => {
    const card = document.createElement('div');
    card.className = 'product';

    const name = document.createElement('strong');
    name.textContent = product.name;

    const price = document.createElement('p');
    price.className = 'muted';
    price.textContent = formatCurrency(product.price);

    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Add to cart';
    button.addEventListener('click', () => addToCart(product.id));

    card.append(name, price, button);
    productList.appendChild(card);
  });
}

function addToCart(productId) {
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    const product = products.find((p) => p.id === productId);
    cart.push({ ...product, qty: 1 });
  }
  renderCart();
}

function changeQty(productId, delta) {
  const item = cart.find((p) => p.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
  }
  renderCart();
}

function removeFromCart(productId) {
  const index = cart.findIndex((p) => p.id === productId);
  if (index !== -1) {
    cart.splice(index, 1);
  }
}

function clearCart(skipMessageClear = false) {
  cart.length = 0;
  renderCart();
  if (!skipMessageClear) {
    purchaseMessage.textContent = '';
  }
}

function renderCart() {
  cartList.innerHTML = '';

  if (cart.length === 0) {
    cartEmpty.style.display = 'block';
  } else {
    cartEmpty.style.display = 'none';
  }

  cart.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'cart-item';

    const meta = document.createElement('div');
    meta.className = 'meta';
    const name = document.createElement('strong');
    name.textContent = item.name;
    const price = document.createElement('span');
    price.className = 'muted';
    price.textContent = formatCurrency(item.price * item.qty);
    meta.append(name, price);

    const controls = document.createElement('div');
    controls.className = 'quantity-controls';
    const minus = document.createElement('button');
    minus.type = 'button';
    minus.textContent = '-';
    minus.addEventListener('click', () => changeQty(item.id, -1));

    const qty = document.createElement('span');
    qty.textContent = item.qty;

    const plus = document.createElement('button');
    plus.type = 'button';
    plus.textContent = '+';
    plus.addEventListener('click', () => changeQty(item.id, 1));

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'remove-btn';
    remove.textContent = 'Remove';
    remove.addEventListener('click', () => {
      removeFromCart(item.id);
      renderCart();
    });

    controls.append(minus, qty, plus, remove);
    li.append(meta, controls);
    cartList.appendChild(li);
  });

  const totals = cart.reduce(
    (acc, item) => {
      acc.count += item.qty;
      acc.subtotal += item.price * item.qty;
      return acc;
    },
    { count: 0, subtotal: 0 }
  );

  itemCountEl.textContent = totals.count;
  subtotalEl.textContent = formatCurrency(totals.subtotal);

  buyBtn.disabled = cart.length === 0;
}

clearBtn.addEventListener('click', clearCart);

buyBtn.addEventListener('click', () => {
  if (cart.length === 0) return;
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  clearCart(true);
  purchaseMessage.textContent = `Purchased items for ${formatCurrency(total)}.`;
});

renderProducts();
renderCart();
