const referralCodeEl = document.getElementById('referral-code-value');
const referralCopyBtn = document.getElementById('referral-copy');
const referralShareBtn = document.getElementById('referral-share');
const referralCodeStatus = document.getElementById('referral-code-status');
const referralForm = document.getElementById('referral-form');
const referralInput = document.getElementById('referral-input');
const referralApplyStatus = document.getElementById('referral-apply-status');

const REF_BASE = '22FLOOR';

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

referralForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = referralInput.value.trim().toUpperCase();

  if (!value) {
    referralApplyStatus.textContent = 'Введите код, чтобы получить скидку.';
    referralApplyStatus.style.color = '#8a040f';
    return;
  }

  const isValid = value.startsWith(REF_BASE) && value.length >= 10;

  if (isValid) {
    referralApplyStatus.textContent = `Код ${value} активирован! Скидка 30% будет применена к заказу.`;
    referralApplyStatus.style.color = '#1a8a3b';
    referralInput.value = '';
  } else {
    referralApplyStatus.textContent = 'Пожалуйста, введите корректный код (например, 22FLOORABC123).';
    referralApplyStatus.style.color = '#8a040f';
  }
});
