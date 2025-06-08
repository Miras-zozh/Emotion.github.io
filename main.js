const ADMIN_PASSWORD = 'dddfffaaa';
const LANGUAGES = ['ru', 'kz', 'de', 'en'];

let emotions = JSON.parse(localStorage.getItem('emotions')) || [];
let currentLang = 'ru';

// Language text templates
const TEXTS = {
  emptyList: {
    ru: 'Список эмоций пуст. Добавьте эмоции через форму после входа.',
    kz: 'Эмоциялар тізімі бос. Кіруден кейін эмоцияларды қосыңыз.',
    de: 'Emotionsliste ist leer. Fügen Sie Emotionen nach dem Login hinzu.',
    en: 'Emotion list is empty. Add emotions after login.',
  },
  description: {
    ru: 'Описание', kz: 'Сипаттамасы', de: 'Beschreibung', en: 'Description'
  },
  examples: {
    ru: 'Примеры', kz: 'Мысалдар', de: 'Beispiele', en: 'Examples'
  },
  synonyms: {
    ru: 'Синонимы', kz: 'Синонимдер', de: 'Synonyme', en: 'Synonyms'
  },
  passwordError: {
    ru: 'Неверный пароль. Доступ запрещён.',
    kz: 'Қате құпия сөз. Қолжетім жоқ.',
    de: 'Falsches Passwort. Zugriff verweigert.',
    en: 'Wrong password. Access denied.'
  },
  emotionAdded: {
    ru: 'Эмоция добавлена!',
    kz: 'Эмоция қосылды!',
    de: 'Emotion hinzugefügt!',
    en: 'Emotion added!'
  },
  about: {
    ru: `<h2>Что такое эмоции?</h2><p>Эмоции — это сложные психофизиологические реакции, которые выражают наши чувства и переживания.</p>`,
    kz: `<h2>Эмоциялар дегеніміз не?</h2><p>Эмоциялар — біздің сезімдеріміз бен тәжірибелерімізді білдіретін күрделі психофизиологиялық реакциялар.</p>`,
    de: `<h2>Was sind Emotionen?</h2><p>Emotionen sind komplexe psychophysiologische Reaktionen, die unsere Gefühle und Erfahrungen ausdrücken.</p>`,
    en: `<h2>What are emotions?</h2><p>Emotions are complex psychophysiological reactions that express our feelings and experiences.</p>`
  }
};

// DOM references
const $ = id => document.getElementById(id);
const contentArea = $('contentArea');
const langButtons = document.querySelectorAll('.top-lang-selector button');
const adminLoginBtn = $('adminLoginBtn');
const adminModal = $('adminModal');
const passwordSection = $('passwordSection');
const adminPasswordInput = $('adminPasswordInput');
const passwordSubmitBtn = $('passwordSubmitBtn');
const emotionForm = $('emotionForm');
const menuToggleBtn = $('menuToggleBtn');
const menuList = $('menuList');
const menuButtons = menuList.querySelectorAll('button');

// Emotion card container
const emotionList = document.createElement('div');
emotionList.id = 'emotionList';

// Random card colors
const colors = ['#fceabb', '#f8b500', '#ff9a9e', '#fad0c4', '#a18cd1', '#fbc2eb', '#a6c0fe', '#f093fb', '#f5576c', '#4facfe'];
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

// Render emotion cards
function renderEmotions() {
  emotionList.innerHTML = '';

  if (!emotions.length) {
    emotionList.innerHTML = `<p style="color:#fff; text-align:center; grid-column: 1 / -1;">${TEXTS.emptyList[currentLang]}</p>`;
    return;
  }

  emotions.forEach(emotion => {
    const card = document.createElement('div');
    card.className = 'emotion-card';
    card.style.background = getRandomColor();

    const inner = document.createElement('div');
    inner.className = 'card-inner';

    inner.innerHTML = `
      <div class="card-front">${emotion.names[currentLang] || ''}</div>
      <div class="card-back">
        <div><b>${TEXTS.description[currentLang]}:</b> ${emotion.descriptions[currentLang] || ''}</div>
        <div><b>${TEXTS.examples[currentLang]}:</b> ${(emotion.examples[currentLang] || []).join('; ')}</div>
        <div><b>${TEXTS.synonyms[currentLang]}:</b> ${(emotion.synonyms[currentLang] || []).join(', ')}</div>
      </div>`;

    card.appendChild(inner);
    card.addEventListener('click', () => card.classList.toggle('flipped'));

    emotionList.appendChild(card);
  });
}

// Set active language button
function updateActiveLangButton() {
  langButtons.forEach(btn => {
    const isActive = btn.dataset.lang === currentLang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive);
  });
}

// Change language
langButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    currentLang = btn.dataset.lang;
    updateActiveLangButton();
    renderCurrentSection();
  });
});

// Menu toggle logic
menuToggleBtn.addEventListener('click', () => {
  const expanded = menuToggleBtn.getAttribute('aria-expanded') === 'true';
  menuToggleBtn.setAttribute('aria-expanded', String(!expanded));
  menuList.style.display = expanded ? 'none' : 'flex';
});

menuButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    menuButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCurrentSection(btn.dataset.section);
    menuList.style.display = 'none';
    menuToggleBtn.setAttribute('aria-expanded', 'false');
  });
});

// Render section
function renderCurrentSection(section) {
  const target = section || menuList.querySelector('button.active')?.dataset.section || 'emotions';
  contentArea.innerHTML = '';

  if (target === 'emotions') {
    contentArea.appendChild(emotionList);
    renderEmotions();
  } else if (target === 'about') {
    contentArea.innerHTML = TEXTS.about[currentLang];
  }
}

// Admin login modal logic
adminLoginBtn.addEventListener('click', () => {
  adminModal.classList.add('active');
  passwordSection.style.display = 'block';
  emotionForm.style.display = 'none';
  adminPasswordInput.value = '';
  adminPasswordInput.focus();
});

passwordSubmitBtn.addEventListener('click', () => {
  const entered = adminPasswordInput.value.trim();
  if (entered === ADMIN_PASSWORD) {
    passwordSection.style.display = 'none';
    emotionForm.style.display = 'grid';
    emotionForm.scrollIntoView({ behavior: 'smooth' });
  } else {
    alert(TEXTS.passwordError[currentLang]);
    adminPasswordInput.value = '';
    adminPasswordInput.focus();
  }
});

// Modal close on overlay or ESC
adminModal.addEventListener('click', e => {
  if (e.target === adminModal) adminModal.classList.remove('active');
});
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') adminModal.classList.remove('active');
});

// Add new emotion form handler
emotionForm.addEventListener('submit', e => {
  e.preventDefault();

  const getLangValue = (prefix, lang) => emotionForm[`${prefix}-${lang}`].value.trim();
  const getLangList = (prefix, lang) => emotionForm[`${prefix}-${lang}`].value.split(',').map(s => s.trim()).filter(Boolean);

  const newEmotion = {
    names: Object.fromEntries(LANGUAGES.map(lang => [lang, getLangValue('name', lang)])),
    descriptions: Object.fromEntries(LANGUAGES.map(lang => [lang, getLangValue('desc', lang)])),
    examples: Object.fromEntries(LANGUAGES.map(lang => [lang, getLangList('examples', lang)])),
    synonyms: Object.fromEntries(LANGUAGES.map(lang => [lang, getLangList('synonyms', lang)])),
  };

  emotions.push(newEmotion);
  localStorage.setItem('emotions', JSON.stringify(emotions));
  emotionForm.reset();

  alert(TEXTS.emotionAdded[currentLang]);
  if (menuList.querySelector('button.active')?.dataset.section === 'emotions') {
    renderCurrentSection('emotions');
  }
});

// Initial setup
updateActiveLangButton();
renderCurrentSection('emotions');