
document.addEventListener('DOMContentLoaded', () => {
  // Инициализация клиента Supabase — ЗАМЕНИ СВОИМИ ДАННЫМИ!
// ==== Supabase config ====
const SUPABASE_URL = 'https://iajtzxdhjkcycgvbetax.supabase.co'; // Замените на свой
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhanR6eGRoamtjeWNndmJldGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NzY0NjUsImV4cCI6MjA2NTE1MjQ2NX0.DShzKhj4VoLsCFVSbl07DgB7GdhiqVGAg6hgJl8pdXQ'; // Замените на свой
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);



// ==== Admin password ====
const ADMIN_PASSWORD = '12344'; // Задайте свой пароль

let isAdmin = false;
let currentEmotion = '';
let allData = [];

// ==== UI Elements ====
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const closeModalBtn = document.getElementById('close-modal');
const tableBody = document.querySelector('#emotion-table tbody');
const showFormBtn = document.getElementById('show-form');
const addForm = document.getElementById('add-form');
const filterName = document.getElementById('filter-name');
const filterRole = document.getElementById('filter-role');
const resetFiltersBtn = document.getElementById('reset-filters');

const adminLoginBtn = document.getElementById('admin-login-btn');
const adminModal = document.getElementById('admin-modal');
const closeAdminModalBtn = document.getElementById('close-admin-modal');
const adminLoginForm = document.getElementById('admin-login-form');
const adminPasswordInput = document.getElementById('admin-password');
const adminError = document.getElementById('admin-error');

// ==== Helpers ====
function renderTable(data) {
  tableBody.innerHTML = '';
  data.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.name || ''}</td>
      <td>${row.object || ''}</td>
      <td>${row.submodel || ''}</td>
      <td>${row.role || ''}</td>
      <td>${row.features || ''}</td>
      <td>${row.examples || ''}</td>
      <td>${row.verbs || ''}</td>
      <td>${row.note || ''}</td>
    `;
    tableBody.appendChild(tr);
  });
}

function filterTable() {
  let filtered = allData;
  if (filterName.value) {
    filtered = filtered.filter(r => (r.name || '').toLowerCase().includes(filterName.value.toLowerCase()));
  }
  if (filterRole.value) {
    filtered = filtered.filter(r => (r.role || '').toLowerCase().includes(filterRole.value.toLowerCase()));
  }
  renderTable(filtered);
}

// ==== Event Listeners ====

// Открытие карточки эмоции
document.querySelectorAll('.emotion-card').forEach(card => {
  card.addEventListener('click', async () => {
    currentEmotion = card.dataset.emotion;
    modalTitle.textContent = card.textContent;
    modal.classList.remove('hidden');
    showFormBtn.classList.toggle('hidden', !isAdmin);
    addForm.classList.add('hidden');
    // Загрузка данных из Supabase
    const { data, error } = await supabase
      .from('emotions')
      .select('*')
      .eq('emotion', currentEmotion);
    allData = data || [];
    renderTable(allData);
  });
});

// Закрытие модального окна
closeModalBtn.onclick = () => modal.classList.add('hidden');

// Открытие формы добавления
showFormBtn.onclick = () => {
  addForm.classList.remove('hidden');
  showFormBtn.classList.add('hidden');
};

// Сброс фильтров
resetFiltersBtn.onclick = () => {
  filterName.value = '';
  filterRole.value = '';
  filterTable();
};

// Фильтрация таблицы
filterName.oninput = filterTable;
filterRole.oninput = filterTable;

// Сохранение данных в Supabase
addForm.onsubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(addForm);
  const newRow = {
    emotion: currentEmotion,
    name: formData.get('name'),
    object: formData.get('object'),
    submodel: formData.get('submodel'),
    role: formData.get('role'),
    features: formData.get('features'),
    examples: formData.get('examples'),
    verbs: formData.get('verbs'),
    note: formData.get('note'),
  };
  const { error } = await supabase.from('emotions').insert([newRow]);
  if (!error) {
    allData.push(newRow);
    renderTable(allData);
    addForm.reset();
    addForm.classList.add('hidden');
    showFormBtn.classList.remove('hidden');
  } else {
    alert('Ошибка при добавлении данных');
  }
};

window.onclick = function(event) {
  if (event.target === modal) modal.classList.add('hidden');
  if (event.target === adminModal) adminModal.classList.add('hidden');
};

// ==== Admin Auth ====

// Открыть окно входа
adminLoginBtn.onclick = () => {
  adminModal.classList.remove('hidden');
  adminError.style.display = 'none';
  adminPasswordInput.value = '';
};

// Закрыть окно входа
closeAdminModalBtn.onclick = () => adminModal.classList.add('hidden');

// Обработка входа
adminLoginForm.onsubmit = (e) => {
  e.preventDefault();
  if (adminPasswordInput.value === ADMIN_PASSWORD) {
    isAdmin = true;
    adminModal.classList.add('hidden');
    adminLoginBtn.textContent = 'Вы вошли как админ';
    adminLoginBtn.disabled = true;
    // Если модалка эмоции открыта — показать кнопку добавления
    if (!modal.classList.contains('hidden')) {
      showFormBtn.classList.remove('hidden');
    }
  } else {
    adminError.style.display = 'block';
  }
}
);

