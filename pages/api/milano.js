export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { lng, lat } = req.query;
    
    if (!lng || !lat) {
      return res.status(400).json({ error: 'Missing lng or lat' });
    }

    // Prova API Milano più semplice prima
    const simpleUrl = `https://geoportale.comune.milano.it/arcgis/rest/services/PGT/AreeERS/MapServer?f=json`;
    
    console.log('Testing Milano connection...');
    const response = await fetch(simpleUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PGT-Proxy/1.0)',
        'Accept': 'application/json'
      }
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      return res.status(500).json({
        error: `Milano server responded with ${response.status}`,
        statusText: response.statusText
      });
    }

    const data = await response.json();
    
    return res.status(200).json({
      message: 'Milano API reachable!',
      status: response.status,
      dataKeys: Object.keys(data),
      receivedParams: { lng, lat }
    });
    
  } catch (error) {
    console.error('Milano connection error:', error);
    return res.status(500).json({ 
      error: error.message,
      type: error.constructor.name
    });
  }
}
