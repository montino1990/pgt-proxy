export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { lng, lat } = req.query;
    
    if (!lng || !lat) {
      return res.status(400).json({ 
        error: 'Missing lng or lat parameters' 
      });
    }

    // Test con API più semplice prima
    const testUrl = `https://httpbin.org/json`;
    
    console.log('Testing basic fetch...');
    const testResponse = await fetch(testUrl);
    const testData = await testResponse.json();
    
    return res.status(200).json({
      message: 'Fetch works!',
      testData: testData,
      receivedParams: { lng, lat }
    });
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: error.message,
      stack: error.stack
    });
  }
}
