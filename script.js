
document.addEventListener('DOMContentLoaded', () => {
  // !!! ВАЖНО: ЗАМЕНИТЕ ЭТИ ДАННЫЕ НА СВОИ !!!
  const ADMIN_PASSWORD='aaadddsss';
  const SUPABASE_URL = 'https://iajtzxdhjkcycgvbetax.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhanR6eGRoamtjeWNndmJldGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NzY0NjUsImV4cCI6MjA2NTE1MjQ2NX0.DShzKhj4VoLsCFVSbl07DgB7GdhiqVGAg6hgJl8pdXQ';
  
  const { createClient } = supabase;
  const supabaseClient=createClient(SUPABASE_URL, SUPABASE_KEY);

  // --- Эмоции фиксированные ---
  const EMOTIONS = [
    { id: 'joy', names: { ru: 'Радость', kz: 'Қуаныш', de: 'Freude', en: 'Joy' }},
    { id: 'fear', names: { ru: 'Страх', kz: 'Қорқыныш', de: 'Angst', en: 'Fear' }},
    { id: 'anger', names: { ru: 'Злость', kz: 'Ашу', de: 'Wut', en: 'Anger' }},
    { id: 'envy', names: { ru: 'Зависть', kz: 'Қызғаныш', de: 'Neid', en: 'Envy' }},
    { id: 'happiness', names: { ru: 'Счастье', kz: 'Бақыт', de: 'Glück', en: 'Happiness' }},
    { id: 'sadness', names: { ru: 'Грусть', kz: 'Мұң', de: 'Traurigkeit', en: 'Sadness' }},
  ];

  let currentLang = 'ru';
  let currentEmotion = null;

  const contentArea = document.getElementById('contentArea');
  const langButtons = document.querySelectorAll('.top-lang-selector button');
  const detailsModal = document.getElementById('detailsModal');
  const detailsForm = document.getElementById('detailsForm');
  const modalEmotionName = document.getElementById('modalEmotionName');
  const existingDetailsList = document.getElementById('existingDetailsList');
  const closeModalBtn = document.querySelector('.close-modal');

  // --- Рендер карточек ---
  function renderEmotions() {
    contentArea.innerHTML = '';
    EMOTIONS.forEach(emotion => {
      const card = document.createElement('div');
      card.className = 'emotion-card';
      card.textContent = emotion.names[currentLang] || emotion.names.ru;
      card.addEventListener('click', () => openDetailsModal(emotion));
      contentArea.appendChild(card);
    });
  }

  // --- Открытие модального окна ---
  async function openDetailsModal(emotion) {
    currentEmotion = emotion;
    modalEmotionName.textContent = emotion.names[currentLang] || emotion.names.ru;
    detailsForm.reset();

    // Загрузка деталей только для выбранной эмоции
    existingDetailsList.innerHTML = '<p>Загрузка...</p>';
    const { data, error } = await supabaseClient
      .from('emotion_details')
      .select('*')
      .eq('emotion_id', emotion.id)
      .order('created_at', { ascending: false });

    if (error) {
      existingDetailsList.innerHTML = '<p style="color:red;">Ошибка загрузки</p>';
    } else if (data && data.length > 0) {
      existingDetailsList.innerHTML = '';
      data.forEach(detail => {
        const el = document.createElement('div');
        el.className = 'detail-item';
        el.innerHTML = `
          <strong>${detail.name || ''}</strong>
          <span>Объект: ${detail.comparison_object || ''}</span>
          <span>Субмодель: ${detail.submodel || ''}</span>
          <span>Семантическая роль: ${detail.semantic_role || ''}</span>
          <span>Признаки: ${detail.features || ''}</span>
          <span>Примеры: ${detail.examples || ''}</span>
          <span>Глаголы: ${detail.verbs || ''}</span>
          <span>Участники: ${detail.participants || ''}</span>
          <span>Примечание: ${detail.notes || ''}</span>
          <small>Добавлено: ${new Date(detail.created_at).toLocaleDateString()}</small>
        `;
        existingDetailsList.appendChild(el);
      });
    } else {
      existingDetailsList.innerHTML = '<p>Пока нет записей для этой эмоции.</p>';
    }

    detailsModal.classList.add('active');
  }

  // --- Добавление новой детали ---
  detailsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentEmotion) return;
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
      notes: detailsForm.notes.value,
      created_at: new Date().toISOString()
    };
    const { error } = await supabaseClient.from('emotion_details').insert([newDetail]);
    if (!error) {
      detailsForm.reset();
      openDetailsModal(currentEmotion);
    } else {
      alert('Ошибка добавления: ' + error.message);
    }
  });

  // --- Закрытие модального окна ---
  closeModalBtn.addEventListener('click', () => {
    detailsModal.classList.remove('active');
  });

  // --- Переключение языка ---
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentLang = btn.dataset.lang;
      langButtons.forEach(b => b.classList.toggle('active', b.dataset.lang === currentLang));
      renderEmotions();
    });
  });

  // --- Запуск ---
  renderEmotions();
});
