export async function onRequest(event) {
  const ps = event.env.BEBROID.prepare('SELECT * from qoca');
  

    const data = await ps.all();
    const jsonData = JSON.stringify(data);
    
    return new Response(jsonData, {
      headers: { 'Content-Type': 'application/json' },
    })
