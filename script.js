
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
  let currentLanguage = 'en';

const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(tc => tc.classList.add('hidden'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.remove('hidden');
  });
});
  
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
  const adminLoginBtn = document.getElementById('admin-login-btn');
  const adminModal = document.getElementById('admin-modal');
  const closeAdminModalBtn = document.getElementById('close-admin-modal');
  const adminLoginForm = document.getElementById('admin-login-form');
  const adminPasswordInput = document.getElementById('admin-password');
  const adminError = document.getElementById('admin-error');
  const sortField = document.getElementById('sort-field');
  const sortAscBtn = document.getElementById('sort-asc');
  const sortDescBtn = document.getElementById('sort-desc');

  // Сортировка
  let sortKey = 'name';
  let sortDir = 'asc';

  function updateLanguageUI() {
  
    // Плейсхолдеры формы
    document.querySelectorAll('#add-form input[data-i18n-placeholder]').forEach(input => {
      const key = input.getAttribute('data-i18n-placeholder');
      input.placeholder = translations[currentLanguage][key];
    });
    // Кнопки
    showFormBtn.textContent = translations[currentLanguage].addData;
    addForm.querySelector('.submit-btn').textContent = translations[currentLanguage].save;
    if (isAdmin) {
      deleteHeader.textContent = translations[currentLanguage].delete;
    }
    // Сортировка
    sortField.querySelectorAll('option').forEach(opt => {
      const key = opt.value;
      if (translations[currentLanguage][key]) {
        opt.textContent = translations[currentLanguage][key];
      }
    });
  }
  

 function renderTable(data) {
  // сортировка
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
      <td>${row.example ? row.example : ''}</td>
      <td>${row.verb_class || ''}</td>
      <td>${row.adj_class || ''}</td>
      ${
        isAdmin
          ? `<td>
              <button class="edit-btn" data-id="${row.id}">Edit</button>
              <button class="delete-btn" data-id="${row.id}">${translations[currentLanguage].delete}</button>
            </td>`
          : ''
      }
    `;
    tableBody.appendChild(tr);
  });

  // --- обработчики кнопок Edit и Delete ---
  if (isAdmin) {
    // Delete
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.onclick = async function() {
        const id = this.dataset.id;
        if (confirm('Delete this row?')) {
          const { error } = await supabaseClient
            .from('emotions')
            .delete()
            .eq('id', id);
          if (!error) {
            allData = allData.filter(r => String(r.id) !== String(id));
            renderTable(allData);
          } else {
            alert('Error deleting');
          }
        }
      };
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.onclick = function() {
      const id = this.dataset.id;
      const row = allData.find(r => String(r.id) === String(id));
      if (!row) return;
      // Заполняем форму
      addForm.name.value = row.name || '';
      addForm.metaphorical_model.value = row.metaphorical_model || '';
      addForm.submodel.value = row.submodel || '';
      addForm.semantic_role.value = row.semantic_role || '';
      addForm.example.value = row.example || '';
      addForm.verb_class.value = row.verb_class || '';
      addForm.adj_class.value = row.adj_class || '';
      addForm.dataset.editId = id; // помечаем, что редактируем
      addForm.classList.remove('hidden');
      showFormBtn.classList.add('hidden');
    };
  });
}
  
}
window.insertTag = function(open, close) {
  const textarea = document.getElementById('example-field');
  if (!textarea) return;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  textarea.value = text.slice(0, start) + open + text.slice(start, end) + close + text.slice(end);
  textarea.focus();
  textarea.selectionStart = textarea.selectionEnd = end + open.length + close.length;
};

                          
  // Открытие карточки эмоции
  document.querySelectorAll('.emotion-card').forEach(card => {
    card.addEventListener('click', async () => {
      currentEmotion = card.dataset.emotion;
      modalTitle.textContent = card.textContent;
      modal.classList.remove('hidden');
      showFormBtn.classList.toggle('hidden', !isAdmin);
      addForm.classList.add('hidden');
      const { data } = await supabaseClient
        .from('emotions')
        .select('*')
        .eq('emotion', currentEmotion)
        .eq('language', currentLanguage);
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
  
    
const editId = addForm.dataset.editId;
if (editId) {
  const { data, error } = await supabaseClient
    .from('emotions')
    .update(newRow)
    .eq('id', editId)
    .select();
  if (!error && data && data[0]) {
    // обновление прошло успешно
    const idx = allData.findIndex(r => String(r.id) === String(editId));
    if (idx !== -1) allData[idx] = data[0];
    renderTable(allData);
    addForm.reset();
    addForm.classList.add('hidden');
    showFormBtn.classList.remove('hidden');
    delete addForm.dataset.editId;
  } else if (error) {
    alert('Ошибка при редактировании: ' + error.message);
    console.error(error);
  } else {
    alert('Ошибка: не удалось обновить запись');
  }
}




  langSwitcher.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON') {
      const lang = e.target.getAttribute('data-lang');
      if (lang && translations[lang]) {
        currentLanguage = lang;
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

  // ---- Админ ----
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
      adminLoginBtn.textContent = 'Вы вошли как админ';
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


  // ---- Сортировка ----
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

  // ---- Инициализация ----
  updateLanguageUI();
};
