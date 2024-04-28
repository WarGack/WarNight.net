export default {
  async fetch(request, env, ctx) {
    // Create a prepared statement with the query
    const ps = env.BEBROID.prepare('SELECT * from qoca');
    
    try {
      // Execute the query and fetch data
      const data = await ps.all();
      
      // Convert the data to JSON string
      const jsonData = JSON.stringify(data);
      
      // Return the JSON response
      return new Response(jsonData, {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      // If there's an error, return an error response
      return new Response('Error fetching data from database', {
        status: 500,
      });
    }
  },
};
