export async function onRequest(request) {
    if (request.method === 'POST') {
        try {
            const formData = await request.formData(); // Получаем данные из POST-запроса

            const id = formData.get('id');
            const string = formData.get('string');

            // Здесь необходимо выполнить код для добавления данных в вашу базу данных
            // Пример:
            // const result = await yourDatabaseDriver.insertData(id, string);

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

    return new Response('Invalid request', {
        status: 400,
        headers: { 'Content-Type': 'text/plain' }
    });
}
