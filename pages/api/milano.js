export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const { lng, lat } = req.query;
    if (!lng || !lat) {
      return res.status(400).json({ error: 'Missing lng or lat' });
    }

    const milanoUrl = `https://geoportale.comune.milano.it/arcgis/rest/services/PGT/PGT_Milano2030_VIGENTE_R02/MapServer/identify?geometry=${lng},${lat}&geometryType=esriGeometryPoint&sr=4326&tolerance=5&mapExtent=9.0,45.3,9.4,45.6&imageDisplay=400,400,96&f=json`;

    // Usa proxy publico europeo
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(milanoUrl)}`;
    
    const response = await fetch(proxyUrl);
    const result = await response.json();
    
    if (result.contents) {
      const data = JSON.parse(result.contents);
      return res.status(200).json(data);
    } else {
      throw new Error('Proxy failed');
    }
    
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
