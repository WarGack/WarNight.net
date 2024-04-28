export async function onRequest(event) {
  const ps = event.env.BEBROID.prepare('SELECT * from qoca');
  const data = await ps.all();

  // Формируем строку с парами "id, string"
  let resultString = '';

  // Проходим по каждой записи данных
  data.forEach((row, index) => {
    // Добавляем "id, string" в строку
    resultString += `${row.id}, ${row.string}`;

    // Добавляем запятую, если это не последняя запись
    if (index < data.length - 1) {
      resultString += ', ';
    }
  });

  // Возвращаем строку как ответ
  return new Response(resultString, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
