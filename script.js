
document.addEventListener('DOMContentLoaded', () => {
  // !!! ВАЖНО: ЗАМЕНИТЕ ЭТИ ДАННЫЕ НА СВОИ !!!
  const ADMIN_PASSWORD='aaadddsss';
  const SUPABASE_URL = 'YOUR_SUPABASE_URL';
  const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';

  const { createClient } = supabase;
  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

  let emotions = [];
  let currentLang = 'ru';

  const contentArea = document.getElementById('contentArea');
  const langButtons = document.querySelectorAll('.top-lang-selector button');
  const adminLoginBtn = document.getElementById('adminLoginBtn');
  const adminModal = document.getElementById('adminModal');
  const passwordSection = document.getElementById('passwordSection');
  const adminPasswordInput = document.getElementById('adminPasswordInput');
  const passwordSubmitBtn = document.getElementById('passwordSubmitBtn');
  const emotionForm = document.getElementById('emotionForm');
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const menuList = document.getElementById('menuList');
  const menuButtons = menuList.querySelectorAll('button');

  // Контейнер для карточек
  const emotionList = document.createElement('div');
  emotionList.id = 'emotionList';

  // Цвета для пазлов
  const colors = [
    '#fceabb', '#f8b500', '#ff9a9e', '#fad0c4', '#a18cd1',
    '#fbc2eb', '#a6c0fe', '#f093fb', '#f5576c', '#4facfe'
  ];
  function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Создание карточки с рандомной формой и позицией
  function createEmotionCard(emotion) {
    const card = document.createElement('div');

    // Выбираем случайную форму
    const shapes = ['rectangle', 'circle', 'triangle', 'star'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    card.classList.add('emotion-card', shape);

    // Рандомное позиционирование
    const containerWidth = emotionList.clientWidth || 900; // fallback ширина
    const containerHeight = emotionList.clientHeight || 800; // fallback высота

    const cardWidth = shape === 'triangle' ? 250 : 250;
    const cardHeight = shape === 'triangle' ? 180 : 180;

    const randomLeft = Math.random() * (containerWidth - cardWidth);
    const randomTop = Math.random() * (containerHeight - cardHeight);

    card.style.left = ${randomLeft}px;
    card.style.top = ${randomTop}px;

    // Для треугольника контент не отображаем (сложно)
    if (shape === 'triangle') {
      // Можно добавить подсказку или иконку, если нужно
      return card;
    }

    // Создаём внутренние элементы карточки (front и back)
    const inner = document.createElement('div');
    inner.className = 'card-inner';

    const front = document.createElement('div');
    front.className = 'card-front';
    front.textContent = emotion.names[currentLang] || '';

    const back = document.createElement('div');
    back.className = 'card-back';
    back.innerHTML = `
      <div><b>${
        {ru:'Описание', kz:'Сипаттамасы', de:'Beschreibung', en:'Description'}[currentLang]
      }:</b> ${emotion.descriptions[currentLang] || ''}</div>
      <div><b>${
        {ru:'Примеры', kz:'Мысалдар', de:'Beispiele', en:'Examples'}[currentLang]
      }:</b> ${(emotion.examples[currentLang] || []).join('; ')}</div>
      <div><b>${
        {ru:'Синонимы', kz:'Синонимдер', de:'Synonyme', en:'Synonyms'}[currentLang]
      }:</b> ${(emotion.synonyms[currentLang] || []).join(', ')}</div>
    `;

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });

    return card;
  }

  // Отрисовка эмоций
  async function renderEmotions() {
    emotionList.innerHTML = '';

    if (emotions.length === 0) {
      emotionList.innerHTML = '<p style="color:#fff; text-align:center; grid-column: 1 / -1;">' +
        ({
          ru: 'Список эмоций пуст. Добавьте эмоции через форму после входа.',
          kz: 'Эмоциялар тізімі бос. Кіруден кейін эмоцияларды қосыңыз.',
          de: 'Emotionsliste ist leer. Fügen Sie Emotionen nach dem Login hinzu.',
          en: 'Emotion list is empty. Add emotions after login.'
        })[currentLang] + '</p>';
      return;
    }

    emotions.forEach(emotion => {
      const card = createEmotionCard(emotion);
      emotionList.appendChild(card);
    });
  }

  // Загрузка эмоций из Supabase
  async function loadEmotions() {
    const { data, error } = await supabaseClient
      .from('emotions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Ошибка загрузки эмоций:', error);
      alert('Ошибка загрузки эмоций: ' + error.message);
    } else {
      emotions = data;
    }
  }

  // Обновление активной кнопки языка
  function updateActiveLangButton() {
    langButtons.forEach(btn => {
      if (btn.dataset.lang === currentLang) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }

  // Переключение языка
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentLang = btn.dataset.lang;
      updateActiveLangButton();
      renderCurrentSection();
    });
  });

  // Логика меню слева
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

  // Отрисовка текущего раздела
  async function renderCurrentSection(section) {
    if (!section) {
      const activeBtn = menuList.querySelector('button.active');
      section = activeBtn ? activeBtn.dataset.section : 'emotions';
    }
    contentArea.innerHTML = '';
    if (section === 'emotions') {
      contentArea.appendChild(emotionList);
      await loadEmotions();
      renderEmotions();
    } else if (section === 'about') {
      const aboutText = {
        ru: `<h2>Что такое эмоции?</h2>
             <p>Эмоции — это сложные психофизиологические реакции, которые выражают наши чувства и переживания.</p>`,
        kz: `<h2>Эмоциялар дегеніміз не?</h2>
             <p>Эмоциялар — біздің сезімдеріміз бен тәжірибелерімізді білдіретін күрделі психофизиологиялық реакциялар.</p>`,
        de: `<h2>Was sind Emotionen?</h2>
             <p>Emotionen sind komplexe psychophysiologische Reaktionen, die unsere Gefühle und Erfahrungen ausdrücken.</p>`,
        en: `<h2>What are emotions?</h2>
             <p>Emotions are complex psychophysiological reactions that express our feelings and experiences.</p>`
      };
      contentArea.innerHTML = aboutText[currentLang] || aboutText['ru'];
    }
  }

  // Открытие модального окна при клике на кнопку
  adminLoginBtn.addEventListener('click', () => {
    adminModal.classList.add('active');
    passwordSection.style.display = 'block';
    emotionForm.style.display = 'none';
    adminPasswordInput.value = '';
    adminPasswordInput.focus();
  });

  // Обработка ввода пароля
  passwordSubmitBtn.addEventListener('click', () => {
    const entered = adminPasswordInput.value.trim();
    if (entered === ADMIN_PASSWORD) {
      passwordSection.style.display = 'none';
      emotionForm.style.display = 'grid';
      emotionForm.scrollIntoView({behavior: 'smooth'});
    } else {
      alert({
        ru: 'Неверный пароль. Доступ запрещён.',
        kz: 'Қате құпия сөз. Қолжетім жоқ.',
        de: 'Falsches Passwort. Zugriff verweigert.',
        en: 'Wrong password. Access denied.'
      }[currentLang]);
      adminPasswordInput.value = '';
      adminPasswordInput.focus();
    }
  });

  // Закрытие модалки по клику вне контента или клавише Escape
  adminModal.addEventListener('click', (e) => {
    if (e.target === adminModal) {
      adminModal.classList.remove('active');
    }
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && adminModal.classList.contains('active')) {
      adminModal.classList.remove('active');
    }
  });

  // Обработка отправки формы добавления эмоции
  emotionForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newEmotion = {
      names: {
        ru: emotionForm['name-ru'].value.trim(),
        kz: emotionForm['name-kz'].value.trim(),
        de: emotionForm['name-de'].value.trim(),
        en: emotionForm['name-en'].value.trim(),
      },
      descriptions: {
        ru: emotionForm['desc-ru'].value.trim(),
        kz: emotionForm['desc-kz'].value.trim(),
        de: emotionForm['desc-de'].value.trim(),
        en: emotionForm['desc-en'].value.trim(),
      },
      examples: {
        ru: emotionForm['examples-ru'].value.split(',').map(s => s.trim()).filter(Boolean),
        kz: emotionForm['examples-kz'].value.split(',').map(s => s.trim()).filter(Boolean),
        de: emotionForm['examples-de'].value.split(',').map(s => s.trim()).filter(Boolean),
        en: emotionForm['examples-en'].value.split(',').map(s => s.trim()).filter(Boolean),
      },
      synonyms: {
        ru: emotionForm['synonyms-ru'].value.split(',').map(s => s.trim()).filter(Boolean),
        kz: emotionForm['synonyms-kz'].value.split(',').map(s => s.trim()).filter(Boolean),
        de: emotionForm['synonyms-de'].value.split(',').map(s => s.trim()).filter(Boolean),
        en: emotionForm['synonyms-en'].value.split(',').map(s => s.trim()).filter(Boolean),
      }
    };

    const { data, error } = await supabaseClient
      .from('emotions')
      .insert([newEmotion])
      .select('*');

    if (error) {
      console.error('Ошибка добавления эмоции:', error);
      alert('Ошибка добавления эмоции: ' + error.message);
    } else {
      emotions.unshift(data[0]);
      renderEmotions();
      emotionForm.reset();
      alert({
        ru: 'Эмоция добавлена!',
        kz: 'Эмоция қосылды!',
        de: 'Emotion hinzugefügt!',
        en: 'Emotion added!'
      }[currentLang]);
    }
  });

  // Реалтайм подписка на изменения
  supabaseClient
    .channel('public:emotions')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'emotions' }, payload => {
      console.log('Изменение в базе данных:', payload);
      loadEmotions().then(renderEmotions);
    })
    .subscribe();

  // Инициализация
  updateActiveLangButton();
  renderCurrentSection('emotions');
});
