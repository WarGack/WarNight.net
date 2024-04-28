export async function onRequest(event) {
    if (event.request.method === 'POST' && event.request.url.endsWith('/addData')) {
        try {
            const formData = await event.request.formData(); // Получаем данные из POST-запроса

            const id = formData.get('id');
            const string = formData.get('string');

            // Записываем данные в базу данных (в вашем случае)
            const ps = event.env.BEBROID.prepare('INSERT INTO qoca (id, string) VALUES (?, ?)');
            const result = await ps.run(id, string);

            // Возвращаем успешный ответ
            return new Response('Data added successfully!', {
                status: 200,
                headers: { 'Content-Type': 'text/plain' }
            });
        } catch (error) {
            console.error('Error adding data to database:', error);
            return new Response('Failed to add data to database.', {
                status: 500,
                headers: { 'Content-Type': 'text/plain' }
            });
        }
    }

    // Возвращаем стандартный ответ для других запросов
    return new Response('Invalid request', {
        status: 400,
        headers: { 'Content-Type': 'text/plain' }
    });
}
