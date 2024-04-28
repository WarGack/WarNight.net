export async function onRequest(event) {
  const ps = event.env.BEBROID.prepare('SELECT * from qoca');
  
  try {
    const data = await ps.all();
    const jsonData = JSON.stringify(data);
    
    return new Response(jsonData, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response('Error fetching data from database', {
      status: 500,
    });
  }
}
