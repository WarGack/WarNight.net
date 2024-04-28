export async function onRequest(event) {
  const ps = event.env.BEBROID.prepare('SELECT id, string FROM qoca');
  const data = await ps.all();

  // Формируем строку с данными в формате "id, string, id, string, id, string..."
  let formattedData = '';
  data.forEach((row, index) => {
    // Добавляем "id, string" для текущей записи
    formattedData += `${row.id}, ${row.string}`;
    
    // Добавляем запятую после каждой пары "id, string", кроме последней записи
    if (index < data.length - 1) {
      formattedData += ', ';
    }
  });

  // Возвращаем строку с данными как ответ
  return new Response(formattedData);
}
