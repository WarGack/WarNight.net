export async function onRequest(event) {
    try {
        // Открываем подключение к базе данных
        const db = event.env.BEBROID;

        // Выполняем SQL-запрос для вставки данных
        const result = await db.run('INSERT INTO qoca (string) VALUES ("bebrochka_pisechka"));

        // Проверяем результат выполнения запроса
        if (result.changes > 0) {
            return new Response('Data added successfully!', { status: 200 });
        } else {
            return new Response('No data added to database.', { status: 500 });
        }
    } catch (error) {
        console.error('Error adding data to database:', error);
        return new Response('Failed to add data to database.', { status: 500 });
    }
}
