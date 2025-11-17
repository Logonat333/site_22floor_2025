if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

window.addEventListener('load', () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
});

const referralCodeEl = document.getElementById('referral-code-value');
const referralCopyBtn = document.getElementById('referral-copy');
const referralShareBtn = document.getElementById('referral-share');
const referralCodeStatus = document.getElementById('referral-code-status');
const floatingCartButton = document.getElementById('floating-cart');
const floatingCartCount = document.getElementById('floating-cart-count');
const mobileCartButton = document.getElementById('mobile-cart-button');
const mobileCartCount = document.getElementById('mobile-cart-count');

const REF_BASE = '22FLOOR';
const CART_STORAGE_KEY = 'twentyTwoFloorCart';

function generateReferralCode() {
  const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${REF_BASE}${suffix}`;
}

const referralCode = generateReferralCode();
if (referralCodeEl) {
  referralCodeEl.textContent = referralCode;
}

function setStatus(el, message, isError = false) {
  if (!el) return;
  el.textContent = message;
  el.style.color = isError ? '#ffe1e1' : '#ffeac1';
}

referralCopyBtn?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(referralCode);
    setStatus(referralCodeStatus, 'Код скопирован!');
  } catch (error) {
    setStatus(referralCodeStatus, 'Не удалось скопировать, попробуйте вручную.', true);
  }
});

referralShareBtn?.addEventListener('click', () => {
  const text = encodeURIComponent(`Вот мой реферальный код ${referralCode} для 22 Floor. Поделим скидку 30%!`);
  const url = encodeURIComponent('https://22floor.ru/');
  window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
});

function readCartFromStorage() {
  if (typeof window === 'undefined' || !('localStorage' in window)) return 0;
  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return 0;
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return 0;
    return parsed.reduce((sum, item) => {
      const count = Number(item?.count);
      return Number.isFinite(count) && count > 0 ? sum + count : sum;
    }, 0);
  } catch (error) {
    console.warn('Не удалось прочитать корзину', error);
    return 0;
  }
}

function updateCartBadges(totalItems) {
  if (floatingCartCount) {
    floatingCartCount.textContent = totalItems;
    floatingCartCount.classList.toggle('is-visible', totalItems > 0);
  }
  if (mobileCartCount) {
    mobileCartCount.textContent = totalItems;
    mobileCartCount.classList.toggle('is-visible', totalItems > 0);
  }
}

function syncCartCount() {
  const totalItems = readCartFromStorage();
  updateCartBadges(totalItems);
}

floatingCartButton?.addEventListener('click', () => {
  window.location.href = 'index.html#cart-section';
});

mobileCartButton?.addEventListener('click', () => {
  window.location.href = 'index.html#cart-section';
});

syncCartCount();
