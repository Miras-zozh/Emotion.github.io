document.addEventListener('DOMContentLoaded', () => {
  const SUPABASE_URL = 'https://iajtzxdhjkcycgvbetax.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhanR6eGRoamtjeWNndmJldGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NzY0NjUsImV4cCI6MjA2NTE1MjQ2NX0.DShzKhj4VoLsCFVSbl07DgB7GdhiqVGAg6hgJl8pdXQ';
  
  const { createClient } = supabase;
  const supabaseClient=createClient(SUPABASE_URL, SUPABASE_KEY);

  // Эмоции (id для связи с данными)
  const emotions = [
    { id: 'joy', name: 'Радость' },
    { id: 'fear', name: 'Страх' },
    { id: 'anger', name: 'Злость' },
    { id: 'envy', name: 'Зависть' },
    { id: 'happiness', name: 'Счастье' },
    { id: 'sadness', name: 'Грусть' },
  ];

  // Элементы
  const menuToggle = document.getElementById('menuToggle');
  const menuList = document.getElementById('menuList');
  const emotionItems = menuList.querySelectorAll('li[data-emotion]');
  const addDataBtn = document.getElementById('addDataBtn');
  const detailsModal = document.getElementById('detailsModal');
  const addModal = document.getElementById('addModal');
  const formModal = document.getElementById('formModal');

  const closeDetailsBtn = detailsModal.querySelector('.close-modal');
  const closeAddBtn = addModal.querySelector('.close-add-modal');
  const closeFormBtn = formModal.querySelector('.close-form-modal');

  const modalEmotionName = document.getElementById('modalEmotionName');
  const existingDetailsList = document.getElementById('existingDetailsList');

  const passwordForm = document.getElementById('passwordForm');
  const adminPasswordInput = document.getElementById('adminPassword');

  const detailsForm = document.getElementById('detailsForm');
  const emotionIdInput = document.getElementById('emotionId');

  let currentEmotionId = null;
  let adminLoggedIn = false;

  // Показать/скрыть меню
  menuToggle.addEventListener('click', () => {
    menuList.classList.toggle('visible');
  });

  // Выбор эмоции из меню
  emotionItems.forEach(item => {
    item.addEventListener('click', () => {
      currentEmotionId = item.dataset.emotion;
      openDetailsModal(currentEmotionId, item.textContent);
      menuList.classList.remove('visible');
    });
  });

  // Открыть модалку с данными эмоции
  async function openDetailsModal(emotionId, emotionName) {
    modalEmotionName.textContent = emotionName;
    existingDetailsList.innerHTML = '<p>Загрузка...</p>';
    detailsModal.classList.add('visible');

    const { data, error } = await supabase
      .from('emotion_details')
      .select('*')
      .eq('emotion_id', emotionId)
      .order('created_at', { ascending: true });

    if (error) {
      existingDetailsList.innerHTML = '<p style="color:red;">Ошибка: ${error.message}</p>';
      return;
    }

    if (!data || data.length === 0) {
      existingDetailsList.innerHTML = '<p>Данные отсутствуют.</p>';
      return;
    }

    // Создаем таблицу
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Наименование', 'Объект сравнения', 'Субмодель', 'Семантическая роль', 'Признаки', 'Примеры', 'Глаголы', 'Участники', 'Примечание'].forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    data.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.name || ''}</td>
        <td>${row.comparison_object || ''}</td>
        <td>${row.submodel || ''}</td>
        <td>${row.semantic_role || ''}</td>
        <td>${row.features || ''}</td>
        <td>${row.examples || ''}</td>
        <td>${row.verbs || ''}</td>
        <td>${row.participants || ''}</td>
        <td>${row.notes || ''}</td>
      `;
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    existingDetailsList.innerHTML = '';
    existingDetailsList.appendChild(table);
  }

  // Закрыть модалки
  closeDetailsBtn.addEventListener('click', () => detailsModal.classList.remove('visible'));
  closeAddBtn.addEventListener('click', () => addModal.classList.remove('visible'));
  closeFormBtn.addEventListener('click', () => formModal.classList.remove('visible'));

  // Кнопка "Добавить данные" — запрос пароля
  addDataBtn.addEventListener('click', () => {
    if (adminLoggedIn) {
      openFormModal();
    } else {
      addModal.classList.add('visible');
      adminPasswordInput.value = '';
      adminPasswordInput.focus();
    }
  });

  // Проверка пароля
  passwordForm.addEventListener('submit', e => {
    e.preventDefault();
    const password = adminPasswordInput.value.trim();
    // Здесь можно заменить на свой пароль
    if (password === '123456') {
      adminLoggedIn = true;
      addModal.classList.remove('visible');
      openFormModal();
    } else {
      alert('Неверный пароль!');
      adminPasswordInput.value = '';
      adminPasswordInput.focus();
    }
  });

  // Открыть форму добавления данных
  function openFormModal() {
    if (!currentEmotionId) {
      alert('Сначала выберите эмоцию слева!');
      return;
    }
    formModal.classList.add('visible');
    detailsForm.reset();
    document.getElementById('formModalTitle').textContent =  `Добавить запись для "${emotions.find(e => e.id === currentEmotionId).name}"`;
    emotionIdInput.value = currentEmotionId;
  }

  // Отправка формы добавления записи
  detailsForm.addEventListener('submit', async e => {
    e.preventDefault();
    const detailData = {
      emotion_id: emotionIdInput.value,
      name: detailsForm.detailName.value,
      comparison_object: detailsForm.comparisonObject.value,
      submodel: detailsForm.submodel.value,
      semantic_role: detailsForm.semanticRole.value,
      features: detailsForm.features.value,
      examples: detailsForm.examples.value,
      verbs: detailsForm.verbs.value,
      participants: detailsForm.participants.value,
      notes: detailsForm.notes.value,
      created_at: new Date().toISOString()
    };
    const { error } = await supabase.from('emotion_details').insert([detailData]);
    if (error) {
      alert('Ошибка при добавлении: ' + error.message);
    } else {
      alert('Запись успешно добавлена!');
      formModal.classList.remove('visible');
      // Обновить таблицу, если открыта для текущей эмоции
      if (detailsModal.classList.contains('visible') && currentEmotionId === detailData.emotion_id) {
        openDetailsModal(currentEmotionId, emotions.find(e => e.id === currentEmotionId).name);
      }
    }
  });

});
