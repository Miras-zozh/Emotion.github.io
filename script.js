
document.addEventListener('DOMContentLoaded', () => {
  // !!! ВАЖНО: ЗАМЕНИТЕ ЭТИ ДАННЫЕ НА СВОИ !!!
  const ADMIN_PASSWORD='aaadddsss';
  const SUPABASE_URL = 'https://iajtzxdhjkcycgvbetax.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhanR6eGRoamtjeWNndmJldGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NzY0NjUsImV4cCI6MjA2NTE1MjQ2NX0.DShzKhj4VoLsCFVSbl07DgB7GdhiqVGAg6hgJl8pdXQ';
  
  const { createClient } = supabase;
  const supabaseClient=createClient(SUPABASE_URL, SUPABASE_KEY);

   // --- Переменные состояния ---
  let currentLang = 'ru';
  let emotions = [];
  let currentEmotion = null; // Текущая эмоция, детали которой просматриваются/добавляются

  // --- Элементы интерфейса ---
  const contentArea = document.getElementById('contentArea');
  const langButtons = document.querySelectorAll('.top-lang-selector button');
  const adminLoginBtn = document.getElementById('adminLoginBtn');
  const adminModal = document.getElementById('adminModal'); // Если используется
  const detailsModal = document.getElementById('detailsModal');
  const detailsForm = document.getElementById('detailsForm');
  const modalEmotionName = document.getElementById('modalEmotionName');
  const existingDetailsList = document.getElementById('existingDetailsList'); // Новый элемент
  const closeModalBtns = document.querySelectorAll('.close-modal, .close'); // Универсальный селектор для всех кнопок закрытия модалок

  // --- Языки ---
  const langNames = { ru: 'Рус', kz: 'Каз', de: 'Deu', en: 'Eng' };

  // --- Инициализация приложения ---
  (async () => {
    // Установим активный язык по умолчанию
    langButtons.forEach(btn => {
      if (btn.dataset.lang === currentLang) {
        btn.classList.add('active');
      }
    });

    await loadEmotions();
    renderEmotions();
  })();

  // --- Загрузка эмоций из Supabase ---
  async function loadEmotions() {
    const { data, error } = await supabaseClient
      .from('emotions')
      .select('*')
      .order('created_at', { ascending: true }); // Сортируем для стабильного порядка

    if (error) {
      console.error('Ошибка загрузки эмоций:', error.message);
    } else {
      emotions = data || [];
    }
  }

  // --- Рендер карточек эмоций ---
  function renderEmotions() {
    contentArea.innerHTML = ''; // Очищаем контейнер перед рендером
    if (emotions.length === 0) {
      contentArea.innerHTML = '<p style="color: white; text-align: center;">Эмоции пока не добавлены.</p>';
      return;
    }

    emotions.forEach(emotion => {
      const card = document.createElement('div');
      card.className = 'emotion-card';

      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front">
            ${emotion.names?.[currentLang] || 'Название не указано'}
          </div>
          <div class="card-back">
            ${emotion.descriptions?.[currentLang] || 'Описание не указано'}
          </div>
        </div>
      `;

      card.addEventListener('click', () => openDetailsModal(emotion));

      contentArea.appendChild(card);
    });
  }

  // --- Открытие модального окна деталей ---
  async function openDetailsModal(emotion) {
    currentEmotion = emotion;
    modalEmotionName.textContent = emotion.names?.[currentLang] || '';

    detailsForm.reset();

    // Загрузка и отображение существующих деталей
    const { data: existingDetails, error: fetchError } = await supabaseClient
      .from('emotion_details')
      .select('*')
      .eq('emotion_id', emotion.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Ошибка загрузки существующих деталей:', fetchError.message);
      existingDetailsList.innerHTML = '<p style="color: red;">Ошибка загрузки деталей.</p>';
    } else if (existingDetails && existingDetails.length > 0) {
      existingDetailsList.innerHTML = '';
      existingDetails.forEach(detail => {
        const detailItem = document.createElement('div');
        detailItem.className = 'detail-item';
        detailItem.innerHTML = `
          <strong>${detail.name || 'Без названия'}</strong>
          <span>Объект: ${detail.comparison_object || 'Нет'}</span>
          <span>Признаки: ${detail.features || 'Нет'}</span>
          <span>Примечание: ${detail.notes || 'Нет'}</span>
          <small>Добавлено: ${new Date(detail.created_at).toLocaleDateString()}</small>
        `;
        existingDetailsList.appendChild(detailItem);
      });
    } else {
      existingDetailsList.innerHTML = '<p>Пока нет добавленных деталей для этой эмоции. Добавьте первую!</p>';
    }

    detailsModal.classList.add('active');
  }

  // --- Обработчик отправки формы деталей ---
  detailsForm.addEventListener('submit', async e => {
    e.preventDefault();

    const newDetail = {
      emotion_id: currentEmotion.id,
      name: detailsForm.detailName.value,
      comparison_object: detailsForm.comparisonObject.value,
      submodel: detailsForm.submodel.value,
      semantic_role: detailsForm.semanticRole.value,
      features: detailsForm.features.value,
      examples: detailsForm.examples.value,
      verbs: detailsForm.verbs.value,
      participants: detailsForm.participants.value,
      notes: detailsForm.notes.value
    };

    const { error } = await supabaseClient.from('emotion_details').insert([newDetail]);

    if (!error) {
      alert('Новая деталь успешно добавлена!');
      detailsForm.reset();
      openDetailsModal(currentEmotion);
    } else {
      console.error('Ошибка добавления детали:', error.message);
      alert('Ошибка добавления детали: ' + error.message);
    }
  });

  // --- Закрытие модальных окон ---
  closeModalBtns.forEach(btn =>
    btn.addEventListener('click', () => {
      detailsModal.classList.remove('active');
      if (adminModal) adminModal.classList.remove('active');
    })
  );

  // --- Переключение языка ---
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentLang = btn.dataset.lang;
      langButtons.forEach(b => b.classList.toggle('active', b.dataset.lang === currentLang));
      renderEmotions();
    });
  });
});
