export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { lng, lat } = req.query;
    
    if (!lng || !lat) {
      return res.status(400).json({ 
        error: 'Missing required parameters: lng and lat' 
      });
    }

    const milanoUrl = `https://geoportale.comune.milano.it/arcgis/rest/services/PGT/PGT_Milano2030_VIGENTE_R02/MapServer/identify?geometry=${lng},${lat}&geometryType=esriGeometryPoint&sr=4326&tolerance=5&mapExtent=9.0,45.3,9.4,45.6&imageDisplay=400,400,96&f=json`;

    // Aggiungi headers per sembrare un browser normale
    const response = await fetch(milanoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`Milano API responded with ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Detailed error:', error);
    return res.status(500).json({ 
      error: 'Proxy server error: ' + error.message,
      details: error.toString()
    });
  }
}
