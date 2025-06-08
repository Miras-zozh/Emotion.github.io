document.addEventListener('DOMContentLoaded', () => {
  const ADMIN_PASSWORD = 'dddfffaaa';
  const adminLoginBtn = document.getElementById('adminLoginBtn');
  const adminModal = document.getElementById('adminModal');
  const adminPasswordInput = document.getElementById('adminPasswordInput');
  const passwordSection = document.getElementById('passwordSection');
  const passwordSubmitBtn = document.getElementById('passwordSubmitBtn');
  const emotionForm = document.getElementById('emotionForm');
  const langButtons = document.querySelectorAll('.top-lang-selector button');
  let currentLang = 'ru';

  adminLoginBtn.addEventListener('click', () => {
    adminModal.classList.add('active');
    adminPasswordInput.focus();
  });

  passwordSubmitBtn.addEventListener('click', () => {
    const enteredPassword = adminPasswordInput.value.trim();
    if (enteredPassword === ADMIN_PASSWORD) {
      passwordSection.style.display = 'none';
      emotionForm.style.display = 'grid';
    } else {
      alert({
        ru: 'Неверный пароль. Попробуйте ещё раз.',
        kz: 'Қате құпиясөз. Қайтадан көріңіз.',
        de: 'Falsches Passwort. Bitte erneut versuchen.',
        en: 'Incorrect password. Please try again.'
      }[currentLang]);
      adminPasswordInput.value = '';
    }
  });

  adminModal.addEventListener('click', (e) => {
    if (e.target === adminModal) {
      adminModal.classList.remove('active');
      adminPasswordInput.value = '';
      passwordSection.style.display = 'block';
      emotionForm.style.display = 'none';
    }
  });
});