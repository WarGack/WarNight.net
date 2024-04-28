export async function onRequest(event) {
  const ps = event.env.BEBROID.prepare('SELECT * from qoca');

  try {
    const data = await ps.all();

    // Проверяем, что data является массивом
    if (!Array.isArray(data)) {
      throw new Error('Data is not an array');
    }

    // Формируем строку с парами "id, string"
    let resultString = '';

    // Проходим по каждой записи данных
    for (let i = 0; i < data.length; i++) {
      const row = data[i];

      // Проверяем наличие поля "id" и "string" в каждой записи
      if (!row.hasOwnProperty('id') || !row.hasOwnProperty('string')) {
        throw new Error('Invalid data format: missing "id" or "string"');
      }

      // Добавляем "id, string" в строку
      resultString += `${row.id}, ${row.string}`;

      // Добавляем запятую и пробел, если это не последняя запись
      if (i < data.length - 1) {
        resultString += ', ';
      }
    }

    // Возвращаем строку как ответ
    return new Response(resultString, {
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error) {
    console.error('Error fetching or processing data:', error);

    // Возвращаем дополнительные детали ошибки в виде текста
    return new Response(`Error: ${error.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
