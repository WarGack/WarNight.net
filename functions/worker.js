export async function onRequest(event) {
    if (event.request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const requestBody = await event.request.text();
        const formData = new URLSearchParams(requestBody);

        const string = formData.get('string'); // Получаем значение 'string' из формы

        if (!string) {
            throw new Error('String value is required');
        }

        const ps = event.env.BEBROID.prepare('INSERT INTO qoca (string) VALUES (?)');
        const result = await ps.run(string);

        return new Response('Data added successfully!', { status: 200 });
    } catch (error) {
        console.error('Error adding data to database:', error);
        return new Response('Failed to add data to database.', { status: 500 });
    }
}
