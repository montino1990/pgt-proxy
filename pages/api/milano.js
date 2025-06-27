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

    const milanoUrl = `https://geoportale.comune.milano.it/arcgis/rest/services/PGT/PGT_Milano2030_VIGENTE_R02/MapServer/identify?geometry=${lng},${lat}&geometryType=esriGeometryPoint&sr=4326&tolerance=5&mapExtent=9.0,45.3,9.4,45.6&imageDisplay=400,400,96&f=json`;

    const response = await fetch(milanoUrl);
    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
