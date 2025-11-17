const PRODUCTS = [
  {
    id: 'bear',
    name: 'Свечка Мишка',
    desc: 'Очаровательная свеча в форме медвежонка',
    details: 'Матовое перламутровое покрытие отражает огонь мягким свечением. Каждая свечка отливается вручную, поэтому у каждого медведя свой характер.',
    price: 1580,
    image: './foto/Свечка Мишка.jpeg'
  },
  {
    id: 'pinecone',
    name: 'Свечка шишка',
    desc: 'Асимметричная шишка с матовой текстурой',
    details: 'Сложная форма и глубокие прожилки создают эффект свежесобранной лесной шишки. Запах лёгкий, без отдушек, чтобы не перебивать аромат дома.',
    price: 1920,
    image: './foto/Свечка Шышка.jpeg'
  },
  {
    id: 'spotlight',
    name: 'Свечка прожектор',
    desc: 'Яркий свет и глубокие тени, как в театре',
    details: 'Свеча быстро заполняет комнату тёплым светом и создаёт динамичную игру теней. Корпус выдержан в минималистичном стиле и подходит для современных интерьеров.',
    price: 2140,
    image: './foto/Свечка Прожектор.jpeg'
  },
  {
    id: 'horse-red',
    name: 'Свечка конь — красный',
    desc: 'Глянцевая поверхность и насыщенный цвет',
    details: 'Форма коня символизирует движение и удачу. Красный оттенок достигается безопасными красителями, а поверхность покрыта защитным восковым слоем.',
    price: 1760,
    image: './foto/Красная лошадка.jpeg'
  },
  {
    id: 'horse-white',
    name: 'Свечка конь — белый',
    desc: 'Кремовая свеча с изысканными линиями',
    details: 'Нежный молочный цвет подчёркивает фактуру гривы. Свеча хорошо смотрится в подарочных наборах и не оставляет следов при правильном использовании.',
    price: 1760,
    image: './foto/Белая лошадка.jpeg'
  },
  {
    id: 'ball-gold',
    name: 'Шар золотой',
    desc: 'Металлический блеск и зеркальная гладь',
    details: 'Шар обкатывается вручную, поэтому поверхность получается идеально гладкой. Шикарно отражает гирлянды и праздничный свет.',
    price: 1980,
    image: './foto/Золотой шар.jpeg'
  },
  {
    id: 'ball-silver',
    name: 'Шар серебряный',
    desc: 'Серебристая пыль и яркое сияние',
    details: 'Холодный металлический оттенок даёт аккуратный блеск даже без огня. Хорошо дружит с белыми и голубыми декорациями.',
    price: 1980,
    image: './foto/Серебренный шар.jpeg'
  },
  {
    id: 'ball-ribbed',
    name: 'Шар ребристый',
    desc: 'Объемная фактура с ручными вмятинами',
    details: 'Каждая вмятина создаётся мастером вручную, поэтому поверхность получается живой и уникальной. Отлично подчёркивает минималистичные композиции.',
    price: 2160,
    image: './foto/Ребреистый шар .jpeg'
  },
  {
    id: 'set-classic',
    name: 'Набор свечей',
    desc: 'Готовая композиция для уютного вечера',
    details: 'В набор входит несколько форм и цветов, подобранных так, чтобы их можно было комбинировать на столе. Удобный вариант для подарка или быстрого декора.',
    price: 5200,
    image: './foto/Набор.jpeg'
  }
];

const cart = new Map();
const CART_STORAGE_KEY = 'twentyTwoFloorCart';
const supportsStorage = typeof window !== 'undefined' && 'localStorage' in window;
const productListEl = document.getElementById('product-list');
const cartItemsEl = document.getElementById('cart-items');
const cartSummaryEl = document.getElementById('cart-summary');
const cartCheckoutBtn = document.getElementById('cart-checkout');
const cartSectionEl = document.getElementById('cart-section');
const floatingCartButton = document.getElementById('floating-cart');
const floatingCartCount = document.getElementById('floating-cart-count');
const productModalEl = document.getElementById('product-modal');
const productModalImage = document.getElementById('product-modal-image');
const productModalTitle = document.getElementById('product-modal-title');
const productModalDesc = document.getElementById('product-modal-desc');
const productModalDetails = document.getElementById('product-modal-details');
const productModalPrice = document.getElementById('product-modal-price');
const productModalAddBtn = document.getElementById('product-modal-add');
const heroCta = document.getElementById('hero-cta');
const catalogSection = document.getElementById('catalog');
const featuresTrack = document.getElementById('features-track');
const featureArrowButtons = document.querySelectorAll('[data-features-direction]');
const mobileCartButton = document.getElementById('mobile-cart-button');
const mobileCartCount = document.getElementById('mobile-cart-count');
const TELEGRAM_LINK = 'https://t.me/ksenia_timofeevaa';
const heroEmbers = document.getElementById('hero-embers');
let activeProductId = null;

function formatPrice(value) {
  return `${value.toLocaleString('ru-RU')} ₽`;
}

function renderProducts() {
  productListEl.innerHTML = PRODUCTS.map((product) => {
    return `
      <article class="card" data-product-card="${product.id}">
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
  persistCart();
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
  if (floatingCartCount) {
    floatingCartCount.textContent = totalItems;
    floatingCartCount.classList.toggle('is-visible', totalItems > 0);
  }
  if (mobileCartCount) {
    mobileCartCount.textContent = totalItems;
    mobileCartCount.classList.toggle('is-visible', totalItems > 0);
  }
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
  const addButton = event.target.closest('[data-add]');
  if (addButton) {
    changeItem(addButton.dataset.add, 1);
    return;
  }

  const card = event.target.closest('[data-product-card]');
  if (card) {
    openProductModal(card.dataset.productCard);
  }
});

cartItemsEl.addEventListener('click', (event) => {
  const target = event.target;
  if (!target.dataset.action) return;
  const delta = target.dataset.action === 'increase' ? 1 : -1;
  changeItem(target.dataset.id, delta);
});

function persistCart() {
  if (!supportsStorage) return;
  try {
    const payload = Array.from(cart.values()).map((item) => ({
      id: item.id,
      count: item.count
    }));
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn('Не удалось сохранить корзину', error);
  }
}

function restoreCart() {
  if (!supportsStorage) return;
  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return;
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return;
    parsed.forEach(({ id, count }) => {
      const product = PRODUCTS.find((item) => item.id === id);
      if (!product) return;
      const safeCount = Number(count);
      if (!Number.isFinite(safeCount) || safeCount <= 0) return;
      cart.set(id, { ...product, count: safeCount });
    });
  } catch (error) {
    console.warn('Не удалось восстановить корзину', error);
  }
}

cartCheckoutBtn.addEventListener('click', openTelegram);
heroCta?.addEventListener('click', scrollToCatalog);
floatingCartButton?.addEventListener('click', scrollToCart);
mobileCartButton?.addEventListener('click', scrollToCart);
featureArrowButtons.forEach((button) => {
  button.addEventListener('click', () => {
    scrollFeatures(button.dataset.featuresDirection);
  });
});

productModalEl?.querySelectorAll('[data-modal-close]').forEach((trigger) => {
  trigger.addEventListener('click', closeProductModal);
});

productModalAddBtn?.addEventListener('click', () => {
  if (!activeProductId) return;
  changeItem(activeProductId, 1);
  closeProductModal();
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeProductModal();
  }
});

renderProducts();
restoreCart();
updateCart();
initHeroEmbers();
syncModalWithStorage();

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

function openProductModal(productId) {
  if (!productModalEl) return;
  const product = PRODUCTS.find((item) => item.id === productId);
  if (!product) return;

  activeProductId = productId;
  if (productModalImage) {
    productModalImage.src = product.image;
    productModalImage.alt = product.name;
  }
  if (productModalTitle) productModalTitle.textContent = product.name;
  if (productModalDesc) productModalDesc.textContent = product.desc;
  if (productModalDetails) productModalDetails.textContent = product.details ?? '';
  if (productModalPrice) productModalPrice.textContent = formatPrice(product.price);

  productModalEl.classList.add('is-visible');
  document.body.classList.add('is-locked');
}

function closeProductModal() {
  if (!productModalEl) return;
  productModalEl.classList.remove('is-visible');
  document.body.classList.remove('is-locked');
  activeProductId = null;
}

function syncModalWithStorage() {
  // touch localStorage to ensure permissions before modal usage
  if (!supportsStorage) return;
  try {
    window.localStorage.getItem(CART_STORAGE_KEY);
  } catch (error) {
    console.warn('Не удалось обратиться к localStorage', error);
  }
}
