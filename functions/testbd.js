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
    return new Response('Error fetching or processing data', {
      status: 500,
    });
  }
}
