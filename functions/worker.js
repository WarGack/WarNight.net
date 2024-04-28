export async function onRequest(event) {
const ps = event.env.BEBROID.prepare('INSERT INTO qoca (string) VALUES ("bebrochka_pisechka"');
const data = await ps.all();
const jsonData = JSON.stringify(data);
return new Response(jsonData);
}
