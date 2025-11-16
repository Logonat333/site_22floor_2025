const PRODUCTS = [
  {
    id: 'bear',
    name: 'Свечка Мишка',
    desc: 'Очаровательная свеча в форме медвежонка',
    price: 1580,
    image: './foto/Свечка Мишка.jpeg'
  },
  {
    id: 'pinecone',
    name: 'Свечка шишка',
    desc: 'Асимметричная шишка с матовой текстурой',
    price: 1920,
    image: './foto/Свечка Шышка.jpeg'
  },
  {
    id: 'spotlight',
    name: 'Свечка прожектор',
    desc: 'Яркий свет и глубокие тени, как в театре',
    price: 2140,
    image: './foto/Свечка Прожектор.jpeg'
  },
  {
    id: 'horse-red',
    name: 'Свечка конь — красный',
    desc: 'Глянцевая поверхность и насыщенный цвет',
    price: 1760,
    image: './foto/Красная лошадка.jpeg'
  },
  {
    id: 'horse-white',
    name: 'Свечка конь — белый',
    desc: 'Кремовая свеча с изысканными линиями',
    price: 1760,
    image: './foto/Белая лошадка.jpeg'
  },
  {
    id: 'ball-gold',
    name: 'Шар золотой',
    desc: 'Металлический блеск и зеркальная гладь',
    price: 1980,
    image: './foto/Золотой шар.jpeg'
  },
  {
    id: 'ball-silver',
    name: 'Шар серебряный',
    desc: 'Серебристая пыль и яркое сияние',
    price: 1980,
    image: './foto/Серебренный шар.jpeg'
  },
  {
    id: 'ball-ribbed',
    name: 'Шар ребристый',
    desc: 'Объемная фактура с ручными вмятинами',
    price: 2160,
    image: './foto/Ребреистый шар .jpeg'
  },
  {
    id: 'set-classic',
    name: 'Набор свечей',
    desc: 'Готовая композиция для уютного вечера',
    price: 5200,
    image: './foto/Набор.jpeg'
  }
];

const cart = new Map();
const productListEl = document.getElementById('product-list');
const cartItemsEl = document.getElementById('cart-items');
const cartSummaryEl = document.getElementById('cart-summary');
const cartCheckoutBtn = document.getElementById('cart-checkout');
const cartSectionEl = document.getElementById('cart-section');
const floatingCartButton = document.getElementById('floating-cart');
const floatingCartCount = document.getElementById('floating-cart-count');
const heroCta = document.getElementById('hero-cta');
const catalogSection = document.getElementById('catalog');
const featuresTrack = document.getElementById('features-track');
const featureArrowButtons = document.querySelectorAll('[data-features-direction]');
const TELEGRAM_LINK = 'https://t.me/ksenia_timofeevaa';
const heroEmbers = document.getElementById('hero-embers');

function formatPrice(value) {
  return `${value.toLocaleString('ru-RU')} ₽`;
}

function renderProducts() {
  productListEl.innerHTML = PRODUCTS.map((product) => {
    return `
      <article class="card">
        <img class="card__media" src="${product.image}" alt="${product.name}" loading="lazy" />
        <div class="card__body">
          <h3 class="card__title">${product.name}</h3>
          <p class="card__description">${product.desc}</p>
          <div class="card__price-row">
            <span class="card__price">${formatPrice(product.price)}</span>
            <button type="button" data-add="${product.id}">В корзину</button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function updateCart() {
  const entries = Array.from(cart.values());

  if (!entries.length) {
    cartItemsEl.innerHTML = '<p class="cart__empty">Корзина пуста</p>';
    cartSummaryEl.textContent = 'Соберите набор';
    cartCheckoutBtn.disabled = true;
    cartCheckoutBtn.classList.remove('cart__checkout--active');
    updateFloatingCart(0);
    return;
  }

  cartCheckoutBtn.disabled = false;
  cartCheckoutBtn.classList.add('cart__checkout--active');

  let totalItems = 0;
  let totalPrice = 0;

  cartItemsEl.innerHTML = entries
    .map((item) => {
      totalItems += item.count;
      totalPrice += item.count * item.price;
      return `
        <div class="cart__item">
          <div>
            <div>${item.name}</div>
            <div class="cart__item-price">${formatPrice(item.price)} за шт.</div>
          </div>
          <div class="cart__controls">
            <button data-action="decrease" data-id="${item.id}">-</button>
            <span>${item.count}</span>
            <button data-action="increase" data-id="${item.id}">+</button>
          </div>
        </div>
      `;
    })
    .join('');

  cartSummaryEl.textContent = `${totalItems} товара · ${formatPrice(totalPrice)}`;
  updateFloatingCart(totalItems);
}

function changeItem(id, delta) {
  const product = PRODUCTS.find((item) => item.id === id);
  if (!product) return;

  const current = cart.get(id) ?? { ...product, count: 0 };
  const newCount = current.count + delta;

  if (newCount <= 0) {
    cart.delete(id);
  } else {
    cart.set(id, { ...product, count: newCount });
  }

  updateCart();
}

function buildTelegramMessage() {
  const lines = ['Приветствую!', 'Хочу заказать свечи:'];

  cart.forEach((item) => {
    const countLabel = item.count > 1 ? ` × ${item.count}` : '';
    lines.push(`- ${item.name}${countLabel}`);
  });

  return encodeURIComponent(lines.join('\n'));
}

function openTelegram() {
  if (!cart.size) return;
  const payload = buildTelegramMessage();
  window.open(`${TELEGRAM_LINK}?text=${payload}`, '_blank');
}

function scrollToCatalog() {
  catalogSection?.scrollIntoView({ behavior: 'smooth' });
}

function scrollToCart() {
  cartSectionEl?.scrollIntoView({ behavior: 'smooth' });
}

function updateFloatingCart(totalItems) {
  if (!floatingCartCount) return;
  floatingCartCount.textContent = totalItems;
  floatingCartCount.classList.toggle('is-visible', totalItems > 0);
}

function scrollFeatures(direction) {
  if (!featuresTrack) return;
  const featureCard = featuresTrack.querySelector('.feature');
  const gap = 16;
  const cardWidth = featureCard ? featureCard.offsetWidth : featuresTrack.clientWidth;
  const scrollAmount = cardWidth + gap;
  const offset = direction === 'next' ? scrollAmount : -scrollAmount;
  featuresTrack.scrollBy({ left: offset, behavior: 'smooth' });
}

productListEl.addEventListener('click', (event) => {
  const target = event.target;
  if (target.matches('[data-add]')) {
    changeItem(target.dataset.add, 1);
  }
});

cartItemsEl.addEventListener('click', (event) => {
  const target = event.target;
  if (!target.dataset.action) return;
  const delta = target.dataset.action === 'increase' ? 1 : -1;
  changeItem(target.dataset.id, delta);
});

cartCheckoutBtn.addEventListener('click', openTelegram);
heroCta?.addEventListener('click', scrollToCatalog);
floatingCartButton?.addEventListener('click', scrollToCart);
featureArrowButtons.forEach((button) => {
  button.addEventListener('click', () => {
    scrollFeatures(button.dataset.featuresDirection);
  });
});

renderProducts();
updateCart();
initHeroEmbers();

function initHeroEmbers() {
  if (!heroEmbers) return;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) return;

  const spawnEmber = () => {
    const ember = document.createElement('span');
    ember.classList.add('hero__ember');
    const size = 2 + Math.random() * 4;
    ember.style.width = `${size}px`;
    ember.style.height = `${size}px`;
    ember.style.left = `${Math.random() * 100}%`;
    ember.style.animationDuration = `${4 + Math.random() * 4}s`;
    ember.style.opacity = (0.3 + Math.random() * 0.5).toFixed(2);
    ember.style.setProperty('--ember-shift', `${(Math.random() - 0.5) * 40}px`);
    heroEmbers.appendChild(ember);
    setTimeout(() => ember.remove(), 9000);
  };

  for (let i = 0; i < 14; i += 1) {
    setTimeout(spawnEmber, i * 180);
  }

  setInterval(spawnEmber, 220);
}
