let quill;
document.addEventListener('DOMContentLoaded', () => {
  // ==== Supabase config ====
  const SUPABASE_URL = 'https://iajtzxdhjkcycgvbetax.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhanR6eGRoamtjeWNndmJldGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NzY0NjUsImV4cCI6MjA2NTE1MjQ2NX0.DShzKhj4VoLsCFVSbl07DgB7GdhiqVGAg6hgJl8pdXQ';
  const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  const ADMIN_PASSWORD = '12344';
  
  let allDataFull = [];   // полный набор из БД
  let currentLanguage = 'en';
  let currentEmotion = null; // 'joy','fear',...
  let isAdmin = false;

   const emotionAliases = {
    joy: {
      en: ['happiness', 'pleasure', 'delight', 'joy'],
      ru: ['радость', 'счастье', 'веселье','восторг'],
      kk: ['қуаныш', 'бақыт'],
      de: ['Glück', 'Freude']
    },
    sadness: {
      en: ['sadness', 'grief'],
      ru: ['грусть', 'печаль', 'тоска','горе'],
      kk: ['қайғы', 'мұң', 'уайым'],
      de: ['Traurigkeit']
    },
    fear: {
      en: ['fear', 'terror'],
      ru: ['страх', 'ужас'],
      kk: ['қорқыныш', 'үрей'],
      de: ['Angst', 'Furcht']
    },
    anger: {
      en: ['anger', 'angry', 'rage', 'fury'],
      ru: ['гнев', 'ярость'],
      kk: ['ашу', 'ыза', 'қаһар'],
      de: ['Zorn', 'Wut']
    },
    surprise: {
      en: ['amazement', 'surprise', 'bewilderment'],
      ru: ['удивление', 'сюрприз'],
      kk: ['таңданыс', 'таңғалу'],
      de: ['Erstaunen']
    },
    disgust: {
      en: ['disgust','loathing'],
      ru: ['отвращение','неприязнь','омерзение'],
      kk: ['жиіркену']
    }
  };
  const langMap = {
  kk: 'kk', 
  ru: 'ru',
  en: 'en',
  de: 'du'  
};

function detectEmotionCodeByAlias(word) {
  const low = (word || '').toLowerCase();
  for (const [code, aliases] of Object.entries(emotionAliases)) {
    if (aliases.map(a => a.toLowerCase()).includes(low)) {
      return code;
    }
  }
  return null;
}
  // ==== Переводы ====
  const translations = {
    en: {
      "edit": "Edit",
      dbTitle: "Multilingual database “Emotions in metaphorical representation”",
      pageTitle: "World of Emotions",
      mainTitle: "World of Emotions",
      welcomeText: "Emotions are the bright colors of our lives, accompanying us from childhood and making every day unique. Joy and sadness, fear and surprise, anger and disgust — all are important for our inner world...",
      welcomeQuote: "“Emotions are not a weakness, but a force that drives our lives.” <br>— Carl Gustav Jung",
      adminLogin: "🔑 Admin login",
      adminLoginTitle: "Admin Login",
      adminPassword: "Admin password",
      adminLoginBtn: "Login",
      adminWrongPass: "Wrong password",
      joy: "Joy",
      sadness: "Sadness",
      fear: "Fear",
      anger: "Anger",
      surprise: "Surprise",
      disgust: "Disgust",
      emotionName: "Emotion Name",
      metaphoricalModel: "Metaphorical Model",
      submodel: "Submodel",
      semanticRole: "Semantic Role",
      example: "Example",
      verbClass: "Thematic Verb Class",
      adjClass: "Thematic Adjective Class",
      addData: "Add Data",
      save: "Save",
      delete: "Delete",
      publications: "Publications",
      instructions: "Instructions",
      developer: "Developer",
      about: "About us",
      aboutText: "This research was carried out with the support of the Science Committee of the Ministry of Science and Higher Education of the Republic of Kazakhstan (Grant Nº AP19177908 Comparison of metaphorical models in Kazakh, Russian, English, and German (based on the representation of emotional states) within the priority area Research in the field of social and human sciences. <br><br> Assel Kozhakhmetova – Doctor of Philosophy (PhD), Postdoctoral Researcher, School of Arts and Social Sciences, Narxoz University (Almaty, Kazakhstan). E-mail: a.kozhakhmetova@narxoz.kz  <br><br> Aimgul Kazkenova – Candidate of Philological Sciences, Professor, School of Arts and Social Sciences, Narxoz University (Almaty, Kazakhstan). E-mail: aimgul.kazkenova@narxoz.kz<br> (2023-2025y.)"
},
      
    ru: {
      "edit": "Редактировать",
      dbTitle: "Мультиязычная база данных «Эмоции в метафорическом представлении»",
      pageTitle: "Мир эмоций",
      mainTitle: "Мир эмоций",
      welcomeText: "Эмоции — это яркие краски нашей жизни, сопровождающие нас с детства и делающие каждый день уникальным. Радость и грусть, страх и удивление, гнев и отвращение — все они важны для нашего внутреннего мира...",
      welcomeQuote: "«Эмоции — не слабость, а сила, которая движет нашей жизнью.» <br>— Карл Густав Юнг",
      adminLogin: "🔑 Вход для админа",
      adminLoginTitle: "Вход администратора",
      adminPassword: "Пароль администратора",
      adminLoginBtn: "Войти",
      adminWrongPass: "Неверный пароль",
      joy: "Радость",
      sadness: "Грусть",
      fear: "Страх",
      anger: "Гнев",
      surprise: "Удивление",
      disgust: "Отвращение",
      emotionName: "Наименование эмоции",
      metaphoricalModel: "Метафорическая модель",
      submodel: "Субмодель",
      semanticRole: "Семантическая роль",
      example: "Пример",
      verbClass: "Тематический класс глаголов",
      adjClass: "Тематический класс прилагательных",
      addData: "Добавить данные",
      save: "Сохранить",
      delete: "Удалить",
      publications: "Публикации",
      instructions: "Инструкции",
      developer: "Разработчик",
      about: "О нас",
      aboutText: "Исследование выполнено при поддержке Комитета науки Министерства науки и высшего образования Республики Казахстан (Грант Nº AP19177908 «Сопоставление метафорических моделей в казахском, русском, английском и немецком языках (на примере репрезентации эмоциональных состояний») по приоритету «Исследования в области социальных и гуманитарных наук». <br><br>Кожахметова Асель Сабырбековна – доктор философии (PhD), постдокторант Гуманитарной школы Университета Нархоз (Алматы, Казахстан). E-mail: a.kozhakhmetova@narxoz.kz <br><br> Казкенова Аимгуль Каирбековна – кандидат филологических наук, профессор Гуманитарной школы Университета Нархоз (Алматы, Казахстан). E-mail: aimgul.kazkenova@narxoz.kz<br> (2023-2025г.)"
    },
    de: {
      "edit": "Bearbeiten",
      dbTitle: "Mehrsprachige Datenbank „Emotionen in metaphorischer Darstellung“",
      pageTitle: "Welt der Emotionen",
      mainTitle: "Welt der Emotionen",
      welcomeText: "Emotionen sind die leuchtenden Farben unseres Lebens, begleiten uns seit der Kindheit und machen jeden Tag einzigartig. Freude und Trauer, Angst und Überraschung, Wut und Ekel – alle sind wichtig für unsere innere Welt...",
      welcomeQuote: "„Emotionen sind keine Schwäche, sondern eine Kraft, die unser Leben antreibt.“ <br>— Carl Gustav Jung",
      adminLogin: "🔑 Admin-Login",
      adminLoginTitle: "Admin Login",
      adminPassword: "Admin-Passwort",
      adminLoginBtn: "Anmelden",
      adminWrongPass: "Falsches Passwort",
      joy: "Freude",
      sadness: "Traurigkeit",
      fear: "Angst",
      anger: "Wut",
      surprise: "Überraschung",
      disgust: "Ekel",
      emotionName: "Name der Emotion",
      metaphoricalModel: "Metaphorisches Modell",
      submodel: "Submodell",
      semanticRole: "Semantische Rolle",
      example: "Beispiel",
      verbClass: "Thematische Verbklasse",
      adjClass: "Thematische Adjektivklasse",
      addData: "Daten hinzufügen",
      save: "Speichern",
      delete: "Löschen",
      publications: "Publikationen",
      instructions: "Anleitungen",
      developer: "Entwickler",
      about: "Über uns",
      aboutText: "Diese Forschung wurde mit Unterstützung des Wissenschaftskomitees des Ministeriums für Wissenschaft und Hochschulbildung der Republik Kasachstan durchgeführt (Grant-Nr. AP19177908 Vergleich metaphorischer Modelle im Kasachischen, Russischen, Englischen und Deutschen (am Beispiel der Repräsentation emotionaler Zustände)) im Rahmen der Priorität Forschung im Bereich der Sozial- und Geisteswissenschaften. <br><br> Assel Kozhakhmetova – Doktor der Philosophie (PhD), Postdoktorandin, Schule für Geistes- und Sozialwissenschaften, Narxoz Universität (Almaty, Kasachstan). E-Mail: a.kozhakhmetova@narxoz.kz <br><br> Aimgul Kazkenova – Kandidatin der philologischen Wissenschaften, Professorin, Schule für Geistes- und Sozialwissenschaften, Narxoz Universität (Almaty, Kasachstan). E-Mail: aimgul.kazkenova@narxoz.kz<br> (2023-2025y.)"
    },
    kk: {
      "edit": "Өзгерту",
      dbTitle: "Көптілді дерекқор “Метафора бейнедегі эмоциялар”",
      pageTitle: "Эмоциялар әлемі",
      mainTitle: "Эмоциялар әлемі",
      welcomeText: "Эмоциялар — біздің өміріміздің жарқын түстері, олар бізді балалық шақтан бастап ертіп, әр күнді ерекше етеді. Қуаныш пен қайғы, қорқыныш пен таңданыс, ашу мен жиіркену — бәрі де ішкі әлеміміз үшін маңызды...",
      welcomeQuote: "«Эмоциялар — әлсіздік емес, өмірімізді алға жетелейтін күш.» <br>— Карл Густав Юнг",
      adminLogin: "🔑 Әкімшіге кіру",
      adminLoginTitle: "Әкімшіге кіру",
      adminPassword: "Әкімші құпия сөзі",
      adminLoginBtn: "Кіру",
      adminWrongPass: "Қате құпия сөз",
      joy: "Қуаныш",
      sadness: "Қайғы",
      fear: "Қорқыныш",
      anger: "Ашу",
      surprise: "Таңданыс",
      disgust: "Жиіркену",
      emotionName: "Эмоция атауы",
      metaphoricalModel: "Метафорикалық модель",
      submodel: "Субмодель",
      semanticRole: "Семантикалық рөл",
      example: "Мысал",
      verbClass: "Тақырыптық етістік класы",
      adjClass: "Тақырыптық сын есім класы",
      addData: "Дерек қосу",
      save: "Сақтау",
      delete: "Жою",
      publications: "Жарияланымдар",
      instructions: "Нұсқаулықтар",
      developer: "Әзірлеуші",
      about: "Біз туралы",
      aboutText: "Бұл зерттеу Қазақстан Республикасы Ғылым және жоғары білім министрлігінің Ғылым комитетінің қолдауымен жүзеге асырылды (Грант № AP19177908 Қазақ, орыс, ағылшын және неміс тілдеріндегі метафоралық үлгілерді салыстыру (эмоциялық күйлердің репрезентациясы мысалында)) «Әлеуметтік және гуманитарлық ғылымдар саласындағы зерттеулер» басымдығы бойынша.  <br><br>Кожахметова Асель Сабырбековна – философия докторы (PhD), Нархоз университеті (Алматы, Қазақстан) Гуманитарлық мектебінің постдокторанты. E-mail: a.kozhakhmetova@narxoz.kz <br><br> Казкенова Аимгуль Каирбековна – филология ғылымдарының кандидаты, Нархоз университеті (Алматы, Қазақстан) Гуманитарлық мектебінің профессоры. E-mail: aimgul.kazkenova@narxoz.kz. (2023-2025ж.)<br>"
    }
  };

quill = new Quill('#example-editor', {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['clean']
      ]
    }
  });

  // ==== Элементы поиска ====
   // ==== Элементы поиска ====
const emotionSearchSelect = document.getElementById('emotion-search');
const semanticSearch = document.getElementById('semantic-search');
const metaphorSearch = document.getElementById('metaphor-search');
const submodelSearch = document.getElementById('submodel-search');
const verbSearch = document.getElementById('verb-search');
const adjSearch = document.getElementById('adj-search');
const searchBtn = document.getElementById('search-btn');

 function populateEmotionSelect() {
  if (!emotionSearchSelect) return;
  // подпись в первом option
  const placeholder = translations[currentLanguage]?.emotionName || 'Emotion';
  emotionSearchSelect.innerHTML = `<option value="">-- ${placeholder} --</option>`;

  // определяем набор слов для отображения
  if (currentEmotion && emotionAliases[currentEmotion]) {
    // если открыт конкретный модал (карточка) — показываем варианты только для нее
    const list = emotionAliases[currentEmotion][currentLanguage] || [];
    list.forEach(word => {
      const opt = document.createElement('option');
      opt.value = word.toLowerCase();
      opt.textContent = word;
      emotionSearchSelect.appendChild(opt);
    });
  } else {
    // иначе — показываем grouped варианты (по эмоциям) для текущего языка (fallback: все языки)
    for (const [code, langs] of Object.entries(emotionAliases)) {
      const group = document.createElement('optgroup');
      group.label = translations[currentLanguage] && translations[currentLanguage][code]
                     ? translations[currentLanguage][code]
                     : code.toUpperCase();
      const list = langs[currentLanguage] || Object.values(langs).flat();
      list.forEach(word => {
        const opt = document.createElement('option');
        opt.value = word.toLowerCase();
        opt.textContent = word;
        group.appendChild(opt);
      });
      emotionSearchSelect.appendChild(group);
    }
  }
}

  function detectEmotionCodeByAlias(valLower) {
    if (!valLower) return null;
    for (const [code, byLang] of Object.entries(emotionAliases)) {
      for (const langList of Object.values(byLang)) {
        if (langList.some(w => w.toLowerCase() === valLower)) return code;
      }
    }
    return null;
  }
// когда пользователь выбирает эмоцию
 if (emotionSearchSelect) {
    emotionSearchSelect.addEventListener('change', async () => {
      await unifiedSearch();
    });
  }


  // 🔥 Dropdown 

  // Если выбираем из dropdown — подставляем локализованное имя в input и запускаем поиск
 

  async function ensureAllDataFull() {
    if (allDataFull.length === 0) {
      const { data, error } = await supabaseClient.from('emotions').select('*');
      if (error) {
        console.error('Supabase load error', error);
        return;
      }
      allDataFull = data || [];
    }
  }

// ====== Поиск (работает в рамках выбранной карточки и языка) ======
async function unifiedSearch() {
  await ensureAllDataFull();

  const emotionVal = (emotionSearchSelect?.value || '').trim().toLowerCase();
  const semanticVal = (semanticSearch?.value || '').trim().toLowerCase();
  const metaphorVal = (metaphorSearch?.value || '').trim().toLowerCase();
  const submodelVal = (submodelSearch?.value || '').trim().toLowerCase();
  const verbVal = (verbSearch?.value || '').trim().toLowerCase();
  const adjVal = (adjSearch?.value || '').trim().toLowerCase();

  const lang = (currentLanguage || 'en').toLowerCase();

  let filtered = allDataFull.filter(row => {
    // Фильтр по языку
    if ((row.language || '').toLowerCase() !== lang) return false;

    // Фильтр по эмоции
    if (currentEmotion && (row.emotion || '').toLowerCase() !== currentEmotion) return false;

    return true;
  });
  
  if (emotionVal)
    filtered = filtered.filter(r => (r.name || '').toLowerCase().includes(emotionVal));
  if (semanticVal)
    filtered = filtered.filter(r => (r.semantic_role || '').toLowerCase().includes(semanticVal));
  if (metaphorVal)
    filtered = filtered.filter(r => (r.metaphorical_model || '').toLowerCase().includes(metaphorVal));
  if (submodelVal)
    filtered = filtered.filter(r => (r.submodel || '').toLowerCase().includes(submodelVal));

  // 🔥 Вот эти две строчки раньше не работали, теперь работают правильно:
  if (verbVal)
    filtered = filtered.filter(r => (r.verb_class || '').toLowerCase().includes(verbVal));
  if (adjVal)
    filtered = filtered.filter(r => (r.adj_class || '').toLowerCase().includes(adjVal));

  renderTable(filtered);
}


if (searchBtn) searchBtn.addEventListener('click', async () => await unifiedSearch());


  // === Таблица ===
  const tableBody = document.querySelector('#emotion-table tbody');
  
 function renderTable(data) {
  const tableBody = document.querySelector('#emotion-table tbody');
  if (!tableBody) return;

  // Сортировка (если нужно)
  data = [...data].sort((a, b) => {
    let vA = (a.name || '').toLowerCase();
    let vB = (b.name || '').toLowerCase();
    if (vA < vB) return -1;
    if (vA > vB) return 1;
    return 0;
  });

  tableBody.innerHTML = '';

  data.forEach(row => {
    const tr = document.createElement('tr');

    // Основные колонки
    tr.innerHTML = `
      <td>${row.name || ''}</td>
      <td>${row.metaphorical_model || ''}</td>
      <td>${row.submodel || ''}</td>
      <td>${row.semantic_role || ''}</td>
      <td>${row.example || ''}</td>
      <td>${row.verb_class || ''}</td>
      <td>${row.adj_class || ''}</td>
    `;

    // Если админ — добавляем кнопки редактирования и удаления
    if (isAdmin) {
      const editTd = document.createElement('td');
      const delTd = document.createElement('td');

      editTd.innerHTML = `<button class="edit-btn" data-id="${row.id}" style="padding:4px 8px;">✏️</button>`;
      delTd.innerHTML = `<button class="delete-btn" data-id="${row.id}" style="padding:4px 8px;">🗑️</button>`;

      tr.appendChild(editTd);
      tr.appendChild(delTd);
    }

    tableBody.appendChild(tr);
  });

  // Навешиваем обработчики только если админ
  if (isAdmin) {
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const row = allData.find(r => String(r.id) === String(id));
        if (!row) return;

        addForm.classList.remove('hidden');
        showFormBtn.classList.add('hidden');

        // Заполняем форму текущими значениями
        ['name', 'metaphorical_model', 'submodel', 'semantic_role', 'verb_class', 'adj_class'].forEach(key => {
          if (addForm.elements[key]) addForm.elements[key].value = row[key] || '';
        });
        quill.root.innerHTML = row.example || '';

        addForm.dataset.editId = id;
        addForm.querySelector('.submit-btn').textContent =
          translations[currentLanguage]?.edit || 'Edit';
      });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        if (confirm('Удалить эту запись?')) {
          const { error } = await supabaseClient.from('emotions').delete().eq('id', id);
          if (!error) {
            allDataFull = allDataFull.filter(r => String(r.id) !== String(id));
            allData = allData.filter(r => String(r.id) !== String(id));
            renderTable(allData);
          } else {
            alert('Ошибка при удалении: ' + error.message);
          }
        }
      });
    });
  }
}

  // ==== Publications handler (поддержка старой модалки и нового блока) ====
  const showPublicationsBtn = document.getElementById('show-publications');
  const pdfModal = document.getElementById('pdf-modal');
  const closePdfModalBtn = document.getElementById('close-pdf-modal');
  const publicationsSection = document.getElementById('publications-section');

  if (showPublicationsBtn) {
    if (pdfModal && closePdfModalBtn) {
      showPublicationsBtn.addEventListener('click', () => pdfModal.classList.remove('hidden'));
      closePdfModalBtn.addEventListener('click', () => pdfModal.classList.add('hidden'));
      pdfModal.addEventListener('click', (e) => { if (e.target === pdfModal) pdfModal.classList.add('hidden'); });
    } else if (publicationsSection) {
      showPublicationsBtn.addEventListener('click', () => {
        publicationsSection.classList.toggle('hidden');
        if (!publicationsSection.classList.contains('hidden')) publicationsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } else {
      console.warn('Публикации: не найден ни #pdf-modal, ни #publications-section в HTML.');
    }
  }

  // ==== About modal ====
  const aboutBtn = document.getElementById('about-btn');
  const aboutModal = document.getElementById('about-modal');
  const aboutClose = document.getElementById('about-close');
  const aboutContent = document.getElementById('about-content');
  function showAboutContent() {
    if (aboutContent) aboutContent.innerHTML = translations[currentLanguage].aboutText;
  }
  if (aboutBtn) {
    aboutBtn.addEventListener('click', () => { showAboutContent(); aboutModal.classList.remove('hidden'); });
    aboutClose.addEventListener('click', () => aboutModal.classList.add('hidden'));
    aboutModal.addEventListener('click', (e) => { if (e.target === aboutModal) aboutModal.classList.add('hidden'); });
  }

  // ==== UI Elements ====
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const closeModalBtn = document.getElementById('close-modal');
  const showFormBtn = document.getElementById('show-form');
  const addForm = document.getElementById('add-form');
  const langSwitcher = document.querySelector('.lang-switcher');
  const deleteHeader = document.getElementById('delete-header');
  const adminLoginBtn = document.getElementById('admin-login-btn');
  const adminModal = document.getElementById('admin-modal');
  const closeAdminModalBtn = document.getElementById('close-admin-modal');
  const adminLoginForm = document.getElementById('admin-login-form');
  const adminPasswordInput = document.getElementById('admin-password');
  const adminError = document.getElementById('admin-error');

  let sortKey = 'name';
  let sortDir = 'asc';

  function updateLanguageUI() {
    const pubTitle = document.getElementById('publications-title');
    if (pubTitle) pubTitle.textContent = translations[currentLanguage].publications;
    const dbTitleEl = document.getElementById('db-title');
    if (dbTitleEl && translations[currentLanguage] && translations[currentLanguage].dbTitle) dbTitleEl.textContent = translations[currentLanguage].dbTitle;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[currentLanguage][key]) {
        if (el.tagName.toLowerCase() === 'title') document.title = translations[currentLanguage][key];
        else el.innerHTML = translations[currentLanguage][key];
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[currentLanguage][key]) el.placeholder = translations[currentLanguage][key];
    });
    if (showFormBtn) showFormBtn.textContent = translations[currentLanguage].addData;
    if (addForm) addForm.querySelector('.submit-btn').textContent = translations[currentLanguage].save;
    if (isAdmin && deleteHeader) deleteHeader.textContent = translations[currentLanguage].delete;
  populateEmotionSelect();
  }


    

  

  // ==== Карточки эмоций ====
 document.querySelectorAll('.emotion-card').forEach(card => {
  card.addEventListener('click', async () => {
    currentEmotion = (card.dataset.emotion || '').toLowerCase();
    modalTitle.textContent = card.querySelector('[data-i18n]')?.textContent || card.textContent;
    modal.classList.remove('hidden');
    showFormBtn.classList.toggle('hidden', !isAdmin);
    addForm.classList.add('hidden');

    await ensureAllDataFull();

    // сопоставляем UI-код языка с кодом в БД
    const dbLang = (langMap[currentLanguage] || currentLanguage).toLowerCase();

    const filtered = allDataFull.filter(row =>
      (row.emotion || '').toLowerCase() === currentEmotion &&
      ((row.language || 'en').toLowerCase() === dbLang)
    );

    allData = filtered;
    renderTable(filtered);

    // обновляем список вариантов emotion name только для выбранной карточки и языка
    populateEmotionSelect();
    updateLanguageUI();
  });
});


  if (closeModalBtn) closeModalBtn.onclick = () => modal.classList.add('hidden');
  if (showFormBtn) showFormBtn.onclick = () => { addForm.classList.remove('hidden'); showFormBtn.classList.add('hidden'); };

  // ==== Submit формы ====
  if (addForm) {
    addForm.onsubmit = async (e) => {
      e.preventDefault();
      addForm.elements['example'].value = quill.root.innerHTML;
      const formData = new FormData(addForm);
      const newRow = {
        emotion: currentEmotion,
        name: formData.get('name'),
        metaphorical_model: formData.get('metaphorical_model'),
        submodel: formData.get('submodel'),
        semantic_role: formData.get('semantic_role'),
        example: formData.get('example'),
        verb_class: formData.get('verb_class'),
        adj_class: formData.get('adj_class'),
        language: currentLanguage
      };
      if (addForm.dataset.editId) {
        const editId = addForm.dataset.editId;
        const { error } = await supabaseClient.from('emotions').update(newRow).eq('id', editId);
        if (!error) {
          const idx = allData.findIndex(r => String(r.id) === String(editId));
          if (idx !== -1) allData[idx] = { ...allData[idx], ...newRow };
          // обновим кеш если есть
          if (Array.isArray(allDataFull)) {
            const idx2 = allDataFull.findIndex(r => String(r.id) === String(editId));
            if (idx2 !== -1) allDataFull[idx2] = { ...allDataFull[idx2], ...newRow };
          }
          renderTable(allData);
          addForm.reset();
          addForm.classList.add('hidden');
          showFormBtn.classList.remove('hidden');
          delete addForm.dataset.editId;
          addForm.querySelector('.submit-btn').textContent = translations[currentLanguage].save;
        } else alert('Ошибка при редактировании: ' + error.message);
      } else {
        const { data, error } = await supabaseClient.from('emotions').insert([newRow]).select();
        if (!error && data && data.length > 0) {
          allData.push({ ...newRow, id: data[0].id });
          // обновим кеш если есть
          if (Array.isArray(allDataFull)) allDataFull.push({ ...newRow, id: data[0].id });
          renderTable(allData);
          addForm.reset();
          addForm.classList.add('hidden');
          showFormBtn.classList.remove('hidden');
          addForm.querySelector('.submit-btn').textContent = translations[currentLanguage].save;
        } else alert('Ошибка при добавлении: ' + (error ? error.message : 'Данные не получены'));
      }
    };
  }

  // ==== Переключение языка ====
 if (langSwitcher) {
    langSwitcher.addEventListener('click', async (e) => {
      if (e.target.tagName === 'BUTTON') {
        const lang = e.target.getAttribute('data-lang');
        if (lang && translations[lang]) {
          currentLanguage = lang;
          updateLanguageUI();

          // если открыта карточка эмоции — обновим данные и селект
          if (!modal.classList.contains('hidden') && currentEmotion) {
            await ensureAllDataFull();
            const filtered = allDataFull.filter(row =>
              (row.emotion || '').toLowerCase() === currentEmotion &&
              (row.language || 'en').toLowerCase() === currentLanguage
            );
            allData = filtered;
            renderTable(filtered);
            populateEmotionSelect(); // сразу обновляем список вариантов
          }
        }
      }
    });
  }


  // ==== Логин админа ====
 if (adminLoginBtn) {
    adminLoginBtn.onclick = () => {
      adminModal.classList.remove('hidden');
      adminError.style.display = 'none';
      adminPasswordInput.value = '';
    };
  }

  if (closeAdminModalBtn)
    closeAdminModalBtn.onclick = () => adminModal.classList.add('hidden');

  if (adminLoginForm) {
    adminLoginForm.onsubmit = (e) => {
      e.preventDefault();
      if (adminPasswordInput.value === ADMIN_PASSWORD) {
        isAdmin = true;
        adminModal.classList.add('hidden');
        adminLoginBtn.textContent = translations[currentLanguage].adminLogin + ' (admin)';
        adminLoginBtn.disabled = true;

        // показываем форму добавления, если админ
        showFormBtn.classList.remove('hidden');
        if (deleteHeader) deleteHeader.style.display = '';

        // если таблица уже открыта — перерисуем её с кнопками
        if (!modal.classList.contains('hidden')) renderTable(allData);
      } else {
        adminError.style.display = 'block';
      }
    };
  }
    updateLanguageUI();
});
