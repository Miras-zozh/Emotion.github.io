
document.addEventListener('DOMContentLoaded', () => {
  // !!! ВАЖНО: ЗАМЕНИТЕ ЭТИ ДАННЫЕ НА СВОИ !!!
  const ADMIN_PASSWORD='aaadddsss';
  const SUPABASE_URL = 'https://iajtzxdhjkcycgvbetax.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhanR6eGRoamtjeWNndmJldGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NzY0NjUsImV4cCI6MjA2NTE1MjQ2NX0.DShzKhj4VoLsCFVSbl07DgB7GdhiqVGAg6hgJl8pdXQ';
  
  const { createClient } = supabase;
  const supabaseClient=createClient(SUPABASE_URL, SUPABASE_KEY);

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
  // ... ваш предыдущий код до обработчика клика на карточку ...

  // 4.1 Переменные для работы с деталями
  const detailsModal = document.getElementById('detailsModal');
  const detailsForm = document.getElementById('detailsForm');
  const closeModalBtn = document.querySelector('.close-modal');
  let currentEmotionId = null;

  // 4.2 Модифицированная функция создания карточки
  function createEmotionCard(emotion) {
    const card = document.createElement('div');
    card.className = 'emotion-card';
    card.dataset.id = emotion.id; // Добавляем ID эмоции
    // ... остальной код создания карточки ...
    return card;
  }

  // 4.3 Обработчик клика на перевернутую карточку
  document.addEventListener('click', async (e) => {
    const card = e.target.closest('.emotion-card.flipped');
    if (!card) return;

    currentEmotionId = card.dataset.id;
    detailsModal.classList.add('active');
    await loadExistingDetails();
  });

  // 4.4 Загрузка существующих деталей
  async function loadExistingDetails() {
    const { data, error } = await supabase
      .from('emotion_details')
      .select('*')
      .eq('emotion_id', currentEmotionId)
      .single();

    if (!error && data) {
      document.getElementById('detailName').value = data.name || '';
      document.getElementById('comparisonObject').value = data.comparison_object || '';
      document.getElementById('submodel').value = data.submodel || '';
      document.getElementById('semanticRole').value = data.semantic_role || '';
      document.getElementById('features').value = data.features || '';
      document.getElementById('examples').value = data.examples || '';
      document.getElementById('verbs').value = data.verbs || '';
      document.getElementById('participants').value = data.participants || '';
      document.getElementById('notes').value = data.notes || '';
    }
  }

  // Обработчик отправки формы
  detailsForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const detailData = {
      emotion_id: currentEmotionId,
      name: document.getElementById('detailName').value,
      comparison_object: document.getElementById('comparisonObject').value,
      submodel: document.getElementById('submodel').value,
      semantic_role: document.getElementById('semanticRole').value,
      features: document.getElementById('features').value,
      examples: document.getElementById('examples').value,
      verbs: document.getElementById('verbs').value,
      participants: document.getElementById('participants').value,
      notes: document.getElementById('notes').value
    };

    const { error } = await supabase
      .from('emotion_details')
      .upsert([detailData], { onConflict: 'emotion_id' });

    if (!error) {
      detailsModal.classList.remove('active');
      alert('Данные успешно сохранены!');
    } else {
      alert('Ошибка сохранения: ' + error.message);
    }
  });

  // Закрытие модального окна
  closeModalBtn.addEventListener('click', () => {
    detailsModal.classList.remove('active');
  });

  // ... остальной ваш код ...

  // Создаем контейнер для эмоций
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

  // Отрисовка эмоций с переворотом
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
      const card = document.createElement('div');
      card.className = 'emotion-card';
      card.style.background = getRandomColor();

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

      emotionList.appendChild(card);
    });
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
      .select('*'); // Чтобы сразу получить добавленную запись

    if (error) {
      console.error('Ошибка добавления эмоции:', error);
      alert('Ошибка добавления эмоции: ' + error.message);
    } else {
      emotions.unshift(data[0]); // Добавляем в начало массива для обновления списка
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

  // Реалтайм подписка на изменения в Supabase
  supabaseClient
    .channel('public:emotions')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'emotions' }, payload => {
      console.log('Изменение в базе данных:', payload);
      loadEmotions().then(renderEmotions); // Перезагружаем и перерисовываем
    })
    .subscribe()

  // Инициализация
  updateActiveLangButton();
  renderCurrentSection('emotions');
});