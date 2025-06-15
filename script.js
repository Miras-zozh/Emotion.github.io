 const dataBtn = document.getElementById('dataBtn');
  const mainContent = document.getElementById('mainContent');

  const emotions = [
    { id: 'joy', name: 'Радость' },
    { id: 'fear', name: 'Страх' },
    { id: 'anger', name: 'Злость' },
    { id: 'envy', name: 'Зависть' },
    { id: 'happiness', name: 'Счастье' },
    { id: 'sadness', name: 'Грусть' },
  ];

  // Показываем список эмоций
  function showEmotionList() {
    mainContent.innerHTML = '';
    const ul = document.createElement('ul');
    ul.className = 'emotion-list';
    emotions.forEach(emotion => {
      const li = document.createElement('li');
      li.textContent = emotion.name;
      li.addEventListener('click', () => showEmotionData(emotion));
      ul.appendChild(li);
    });
    mainContent.appendChild(ul);
  }

  // Показываем данные для выбранной эмоции
  async function showEmotionData(emotion) {
    mainContent.innerHTML = '';

    // Кнопка назад
    const backBtn = document.createElement('div');
    backBtn.textContent = '← Назад к списку эмоций';
    backBtn.className = 'back-btn';
    backBtn.addEventListener('click', showEmotionList);
    mainContent.appendChild(backBtn);

    // Заголовок
    const h2 = document.createElement('h2');
    h2.textContent = Данные для эмоции: ${emotion.name};
    mainContent.appendChild(h2);

    // Таблица
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const columns = [
      'Наименование эмоции',
      'Объект сравнения (стимул)',
      'Субмодель',
      'Семантическая роль',
      'Признаки',
      'Примеры',
      'Глаголы',
      'Другие обязательные участники',
      'Примечание'
    ];
    columns.forEach(col => {
      const th = document.createElement('th');
      th.textContent = col;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    mainContent.appendChild(table);

    // Загрузка данных из Supabase
    const { data, error } = await supabase
      .from('emotion_details')
      .select('*')
      .eq('emotion_id', emotion.id)
      .order('created_at', { ascending: true });

    if (error) {
      tbody.innerHTML = <tr><td colspan="${columns.length}" style="color:red;">Ошибка загрузки данных: ${error.message}</td></tr>;
      return;
    }

    if (!data || data.length === 0) {
      tbody.innerHTML = <tr><td colspan="${columns.length}">Данные отсутствуют.</td></tr>;
      return;
    }

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
  }

  // Обработчик кнопки "Данные"
  dataBtn.addEventListener('click', showEmotionList);
});
