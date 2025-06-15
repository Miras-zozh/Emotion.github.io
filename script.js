
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
  let currentEmotion = null;

  // --- Элементы интерфейса ---
  const contentArea = document.getElementById('contentArea');
  const langButtons = document.querySelectorAll('.top-lang-selector button');
  const detailsModal = document.getElementById('detailsModal');
  const detailsForm = document.getElementById('detailsForm');
  const modalEmotionName = document.getElementById('modalEmotionName');
  const closeModalBtns = document.querySelectorAll('.close-modal, .close');

  // --- Языки ---
  const langNames = { ru: 'Рус', kz: 'Каз', de: 'Deu', en: 'Eng' };

  // --- Загрузка эмоций ---
  async function loadEmotions() {
    const { data, error } = await supabaseClient
      .from('emotions')
      .select('*')
      .order('created_at', { ascending: true });
    emotions = data || [];
  }

  // --- Рендер карточек ---
  function renderEmotions() {
    contentArea.innerHTML = '';
    emotions.forEach(emotion => {
      const card = document.createElement('div');
      card.className = 'emotion-card';
      card.innerHTML = `
        <div class="card-front">${emotion.names?.[currentLang] || ''}</div>
        <div class="card-back">${emotion.descriptions?.[currentLang] || ''}</div>
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

    // Загрузка существующих деталей (если есть)
    const { data } = await supabaseClient
      .from('emotion_details')
      .select('*')
      .eq('emotion_id', emotion.id)
      .single();

    if (data) {
      detailsForm.detailName.value = data.name || '';
      detailsForm.comparisonObject.value = data.comparison_object || '';
      detailsForm.submodel.value = data.submodel || '';
      detailsForm.semanticRole.value = data.semantic_role || '';
      detailsForm.features.value = data.features || '';
      detailsForm.examples.value = data.examples || '';
      detailsForm.verbs.value = data.verbs || '';
      detailsForm.participants.value = data.participants || '';
      detailsForm.notes.value = data.notes || '';
    }

    detailsModal.classList.add('active');
  }

  // --- Сохранение деталей ---
  detailsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const detailData = {
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
    const { error } = await supabaseClient
      .from('emotion_details')
      .upsert([detailData], { onConflict: 'emotion_id' });
    if (!error) {
      alert('Детали сохранены!');
      detailsModal.classList.remove('active');
    } else {
      alert('Ошибка: ' + error.message);
    }
  });

  // --- Закрытие модального окна ---
  closeModalBtns.forEach(btn => btn.addEventListener('click', () => {
    detailsModal.classList.remove('active');
  }));

  // --- Переключение языка ---
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentLang = btn.dataset.lang;
      langButtons.forEach(b => b.classList.toggle('active', b.dataset.lang === currentLang));
      renderEmotions();
    });
  });

  // --- Инициализация ---
  (async () => {
    await loadEmotions();
    renderEmotions();
  })();
});
