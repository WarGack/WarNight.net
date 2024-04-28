export async function onRequest(event) {
  const ps = event.env.BEBROID.prepare('SELECT * from qoca');
  
  try {
    const data = await ps.all();
    
    // Формируем HTML-код для таблицы
    let tableHtml = '<table><thead><tr><th>ID</th><th>String</th></tr></thead><tbody>';
    
    // Проверяем, что данные существуют и являются массивом
    if (Array.isArray(data)) {
      // Проходим по каждой записи данных и добавляем строки таблицы
      data.forEach(row => {
        tableHtml += `<tr><td>${row.id}</td><td>${row.string}</td></tr>`;
      });
    }
    
    tableHtml += '</tbody></table>';
    console.log(data); // Вывод данных в консоль для проверки
    // Возвращаем HTML-страницу с таблицей
    return new Response(tableHtml, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    return new Response('Error fetching data from database', {
      status: 500,
    });
  }
}
