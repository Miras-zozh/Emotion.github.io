document.addEventListener('DOMContentLoaded', () => {
  // ==== Supabase config ====
  const SUPABASE_URL = 'https://iajtzxdhjkcycgvbetax.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhanR6eGRoamtjeWNndmJldGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NzY0NjUsImV4cCI6MjA2NTE1MjQ2NX0.DShzKhj4VoLsCFVSbl07DgB7GdhiqVGAg6hgJl8pdXQ';
  const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  const ADMIN_PASSWORD = '12344';

  let isAdmin = false;
  let currentEmotion = '';
  let allData = [];
  let currentLanguage = 'en';

  // ==== Переводы ====
  const translations = {
    en: {
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
      about: "About"
    },
    ru: {
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
      about: "О нас"
    },
    de: {
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
      about: "Über uns"
    },
    kk: {
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
      about: "Біз туралы"
    }
  };

  // ==== UI Elements ====
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const closeModalBtn = document.getElementById('close-modal');
  const tableBody = document.querySelector('#emotion-table tbody');
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
  const sortField = document.getElementById('sort-field');
  const sortAscBtn = document.getElementById('sort-asc');
  const sortDescBtn = document.getElementById('sort-desc');

  let sortKey = 'name';
  let sortDir = 'asc';

  function updateLanguageUI() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[currentLanguage][key]) {
        if (el.tagName.toLowerCase() === 'title') {
          document.title = translations[currentLanguage][key];
        } else {
          el.innerHTML = translations[currentLanguage][key];
        }
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[currentLanguage][key]) {
        el.placeholder = translations[currentLanguage][key];
      }
    });
    sortField.querySelectorAll('option').forEach(opt => {
      const key = opt.value;
      if (translations[currentLanguage][key]) {
        opt.textContent = translations[currentLanguage][key];
      }
    });
    showFormBtn.textContent = translations[currentLanguage].addData;
    addForm.querySelector('.submit-btn').textContent = translations[currentLanguage].save;
    if (isAdmin) {
      deleteHeader.textContent = translations[currentLanguage].delete;
    }
  }

  function renderTable(data) {
    data = [...data].sort((a, b) => {
      let vA = a[sortKey] || '';
      let vB = b[sortKey] || '';
      if (vA < vB) return sortDir === 'asc' ? -1 : 1;
      if (vA > vB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    tableBody.innerHTML = '';
    data.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.name || ''}</td>
        <td>${row.metaphorical_model || ''}</td>
        <td>${row.submodel || ''}</td>
        <td>${row.semantic_role || ''}</td>
        <td>${row.example || ''}</td>
        <td>${row.verb_class || ''}</td>
        <td>${row.adj_class || ''}</td>
        ${isAdmin ? `<td><button class="delete-btn" data-id="${row.id}">${translations[currentLanguage].delete}</button></td>` : ''}
      `;
      tableBody.appendChild(tr);
    });

    if (isAdmin) {
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.onclick = async function() {
          const id = this.dataset.id;
          if (confirm('Удалить эту запись?')) {
            const { error } = await supabaseClient
              .from('emotions')
              .delete()
              .eq('id', id);
            if (!error) {
              allData = allData.filter(r => String(r.id) !== String(id));
              renderTable(allData);
            } else {
              alert('Ошибка при удалении');
            }
          }
        };
      });
    }
  }

  document.querySelectorAll('.emotion-card').forEach(card => {
    card.addEventListener('click', async () => {
      currentEmotion = card.dataset.emotion;
      modalTitle.textContent = card.querySelector('[data-i18n]')?.textContent || card.textContent;
      modal.classList.remove('hidden');
      showFormBtn.classList.toggle('hidden', !isAdmin);
      addForm.classList.add('hidden');
      const { data } = await supabaseClient
        .from('emotions')
        .select('*')
        .eq('emotion', currentEmotion);
      allData = data || [];
      renderTable(allData);
      updateLanguageUI();
    });
  });

  closeModalBtn.onclick = () => modal.classList.add('hidden');
  showFormBtn.onclick = () => {
    addForm.classList.remove('hidden');
    showFormBtn.classList.add('hidden');
  };

  addForm.onsubmit = async (e) => {
    e.preventDefault();
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
    const { data, error } = await supabaseClient
      .from('emotions')
      .insert([newRow])
      .select();
    if (!error && data && data.length > 0) {
      allData.push({ ...newRow, id: data[0].id });
      renderTable(allData);
      addForm.reset();
      addForm.classList.add('hidden');
      showFormBtn.classList.remove('hidden');
    } else {
      alert('Ошибка при добавлении данных: ' + (error ? error.message : 'Данные не получены'));
    }
  };

  langSwitcher.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const lang = e.target.getAttribute('data-lang');
      if (lang && translations[lang]) {
        currentLanguage = lang;
        updateLanguageUI();
      }
    }
  });

  adminLoginBtn.onclick = () => {
    adminModal.classList.remove('hidden');
    adminError.style.display = 'none';
    adminPasswordInput.value = '';
  };
  closeAdminModalBtn.onclick = () => adminModal.classList.add('hidden');
  adminLoginForm.onsubmit = (e) => {
    e.preventDefault();
    if (adminPasswordInput.value === ADMIN_PASSWORD) {
      isAdmin = true;
      adminModal.classList.add('hidden');
      adminLoginBtn.textContent = translations[currentLanguage].adminLogin + ' (admin)';
      adminLoginBtn.disabled = true;
      showFormBtn.classList.remove('hidden');
      if (!modal.classList.contains('hidden')) {
        renderTable(allData);
      }
      deleteHeader.style.display = '';
    } else {
      adminError.style.display = 'block';
    }
  };

  sortField.onchange = function() {
    sortKey = sortField.value;
    renderTable(allData);
  };
  sortAscBtn.onclick = function() {
    sortDir = 'asc';
    renderTable(allData);
  };
  sortDescBtn.onclick = function() {
    sortDir = 'desc';
    renderTable(allData);
  };

  updateLanguageUI();
});
