export default async function handler(req, res) {
  // Abilita CORS per tutte le origini
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Gestisci preflight OPTIONS
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

    // Costruisci URL per Milano API
    const milanoUrl = `https://geoportale.comune.milano.it/arcgis/rest/services/PGT/PGT_Milano2030_VIGENTE_R02/MapServer/identify?geometry=${lng},${lat}&geometryType=esriGeometryPoint&sr=4326&tolerance=5&mapExtent=9.0,45.3,9.4,45.6&imageDisplay=400,400,96&f=json`;

    // Chiamata a Milano (server-to-server, no CORS)
    const response = await fetch(milanoUrl);
    const data = await response.json();

    // Ritorna i dati a Bubble
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Proxy server error: ' + error.message 
    });
  }
}
