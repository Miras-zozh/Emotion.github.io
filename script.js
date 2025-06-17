
document.addEventListener('DOMContentLoaded', () => {
  // Инициализация клиента Supabase — ЗАМЕНИ СВОИМИ ДАННЫМИ!
// ==== Supabase config ====
const SUPABASE_URL = 'https://iajtzxdhjkcycgvbetax.supabase.co'; // Замените на свой
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhanR6eGRoamtjeWNndmJldGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NzY0NjUsImV4cCI6MjA2NTE1MjQ2NX0.DShzKhj4VoLsCFVSbl07DgB7GdhiqVGAg6hgJl8pdXQ'; // Замените на свой
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);



// ==== Admin password ====
const ADMIN_PASSWORD = '12344'; // Задайте свой пароль

let isAdmin = false;
  let currentEmotion = '';
  let allData = [];
  let currentLanguage = 'en'; // по умолчанию английский

  // ==== Переводы ====
  const translations = {
    en: {
      emotionName: "Emotion Name",
      metaphoricalModel: "Metaphorical Model",
      submodel: "Submodel",
      semanticRole: "Semantic Role",
      example: "Example",
      verbClass: "Thematic Verb Class",
      adjClass: "Thematic Adjective Class",
      addData: "Add Data",
      save: "Save",
      delete: "Delete"
    },
    ru: {
      emotionName: "Наименование эмоции",
      metaphoricalModel: "Метафорическая модель",
      submodel: "Субмодель",
      semanticRole: "Семантическая роль",
      example: "Пример",
      verbClass: "Тематический класс глаголов",
      adjClass: "Тематический класс прилагательных",
      addData: "Добавить данные",
      save: "Сохранить",
      delete: "Удалить"
    },
    de: {
      emotionName: "Name der Emotion",
      metaphoricalModel: "Metaphorisches Modell",
      submodel: "Submodell",
      semanticRole: "Semantische Rolle",
      example: "Beispiel",
      verbClass: "Thematische Verbklasse",
      adjClass: "Thematische Adjektivklasse",
      addData: "Daten hinzufügen",
      save: "Speichern",
      delete: "Löschen"
    },
    kk: {
      emotionName: "Эмоция атауы",
      metaphoricalModel: "Метафорикалық модель",
      submodel: "Субмодель",
      semanticRole: "Семантикалық рөл",
      example: "Мысал",
      verbClass: "Тақырыптық етістік класы",
      adjClass: "Тақырыптық сын есім класы",
      addData: "Дерек қосу",
      save: "Сақтау",
      delete: "Жою"
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

  // ==== Функция смены языка ====
  function updateLanguageUI() {
    // Обновить заголовки таблицы
    document.querySelectorAll('#emotion-table th[data-i18n]').forEach(th => {
      const key = th.getAttribute('data-i18n');
      th.textContent = translations[currentLanguage][key];
    });
    // Обновить плейсхолдеры формы
    document.querySelectorAll('#add-form input[data-i18n-placeholder]').forEach(input => {
      const key = input.getAttribute('data-i18n-placeholder');
      input.placeholder = translations[currentLanguage][key];
    });
    // Кнопки
    showFormBtn.textContent = translations[currentLanguage].addData;
    addForm.querySelector('.submit-btn').textContent = translations[currentLanguage].save;
    // Столбец удалить
    if (isAdmin) {
      deleteHeader.textContent = translations[currentLanguage].delete;
    }
  }

  // ==== Рендер таблицы ====
  function renderTable(data) {
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

    // Кнопки "Удалить"
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

  // ==== Открытие карточки эмоции ====
  document.querySelectorAll('.emotion-card').forEach(card => {
    card.addEventListener('click', async () => {
      currentEmotion = card.dataset.emotion;
      modalTitle.textContent = card.textContent;
      modal.classList.remove('hidden');
      showFormBtn.classList.toggle('hidden', !isAdmin);
      addForm.classList.add('hidden');
      // Загрузка данных из Supabase по эмоции и языку
      const { data, error } = await supabaseClient
        .from('emotions')
        .select('*')
        .eq('emotion', currentEmotion)
        .eq('language', currentLanguage);
      allData = data || [];
      renderTable(allData);
      updateLanguageUI();
    });
  });

  // ==== Закрытие модального окна ====
  closeModalBtn.onclick = () => modal.classList.add('hidden');

  // ==== Открытие формы добавления ====
  showFormBtn.onclick = () => {
    addForm.classList.remove('hidden');
    showFormBtn.classList.add('hidden');
  };

  // ==== Сохранение данных в Supabase ====
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
    const { data, error } = await supabaseClient.from('emotions').insert([newRow]);
    if (!error) {
      allData.push({ ...newRow, id: data[0]?.id });
      renderTable(allData);
      addForm.reset();
      addForm.classList.add('hidden');
      showFormBtn.classList.remove('hidden');
    } else {
      alert('Ошибка при добавлении данных');
    }
  };

  // ==== Переключатель языков ====
  langSwitcher.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON') {
      const lang = e.target.getAttribute('data-lang');
      if (lang && translations[lang]) {
        currentLanguage = lang;
        // Если открыта модалка — обновить данные и интерфейс
        if (!modal.classList.contains('hidden') && currentEmotion) {
          supabaseClient
            .from('emotions')
            .select('*')
            .eq('emotion', currentEmotion)
            .eq('language', currentLanguage)
            .then(({ data }) => {
              allData = data || [];
              renderTable(allData);
              updateLanguageUI();
            });
        } else {
          updateLanguageUI();
        }
      }
    }
  });

  // ==== Инициализация ====
  updateLanguageUI();

});
