export async function onRequest(event) {
  const ps = event.env.BEBROID.prepare('SELECT * from qoca');
  

    const data = await ps.all();
    
return new Response(data);
    }
