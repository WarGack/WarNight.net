export async function onRequest(event) {
  const ps = event.env.BEBROID.prepare('SELECT id, string FROM qoca');
  const data = await ps.all();
  
  try {
    const jsonData = JSON.parse(JSON.stringify(data));

    // Формируем HTML-код для таблицы
    let tableHtml = '<table><thead><tr><th>ID</th><th>String</th></tr></thead><tbody>';

    // Итерируемся по каждой записи данных и добавляем строки таблицы
    jsonData.results.forEach(row => {
      tableHtml += `<tr><td>${row.id}</td><td>${row.string}</td></tr>`;
    });

    tableHtml += '</tbody></table>';

    // Возвращаем HTML-страницу с таблицей
    return new Response(tableHtml, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    return new Response('Error processing data', {
      status: 500,
    });
  }
}
