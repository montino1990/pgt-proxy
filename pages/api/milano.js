export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const { test, lng, lat } = req.query;
    
    const tests = {
  // Test zone primarie (centro)
  test_primarie_brera: `https://api.mapbox.com/v4/mattiamonti.dcky6dnf/tilequery/9.1905,45.4668.json?access_token=${TOKEN}`,
  test_primarie_duomo: `https://api.mapbox.com/v4/mattiamonti.dcky6dnf/tilequery/9.1859,45.4654.json?access_token=${TOKEN}`,
  
  // Test zone speciali (funzionante!)
  test_speciali_gratosoglio: `https://api.mapbox.com/v4/mattiamonti.avbsjrwq/tilequery/9.158,45.4089.json?access_token=${TOKEN}`,
  
  // Test altre coordinate speciali
  test_speciali_figino: `https://api.mapbox.com/v4/mattiamonti.avbsjrwq/tilequery/9.1089,45.4653.json?access_token=${TOKEN}`,
  
  // Test servizi/vincoli/punti
  test_servizi_centro: `https://api.mapbox.com/v4/mattiamonti.bd2co0vn/tilequery/9.1905,45.4668.json?access_token=${TOKEN}`,
  test_vincoli_centro: `https://api.mapbox.com/v4/mattiamonti.aq5uemb4/tilequery/9.1905,45.4668.json?access_token=${TOKEN}`,
  test_punti_centro: `https://api.mapbox.com/v4/mattiamonti.00l8mca0/tilequery/9.1905,45.4668.json?access_token=${TOKEN}`,
  
  // Test coordinata custom  
  test_custom: lng && lat ? `https://api.mapbox.com/v4/mattiamonti.dcky6dnf/tilequery/${lng},${lat}.json?access_token=${TOKEN}` : null
};
    
    if (!test || !tests[test]) {
      return res.status(400).json({ 
        error: 'Specify test parameter',
        available: Object.keys(tests),
        examples: [
          '?test=test_brera',
          '?test=test_duomo', 
          '?test=mapbox_milano&lng=9.1905&lat=45.4668'
        ]
      });
    }
    
    const url = tests[test];
    if (!url) {
      return res.status(400).json({ 
        error: 'Missing coordinates for mapbox_milano test',
        hint: 'Use &lng=9.1905&lat=45.4668'
      });
    }
    
    console.log(`Testing MapBox: ${url}`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    return res.status(200).json({
      test: test,
      coordinates: test.includes('mapbox') ? {lng, lat} : 'fixed',
      status: response.status,
      success: true,
      features_found: data.features ? data.features.length : 0,
      sample_properties: data.features && data.features[0] ? 
        Object.keys(data.features[0].properties || {}) : [],
      data: data
    });
    
  } catch (error) {
    return res.status(500).json({ 
      test: req.query.test,
      error: error.message,
      success: false
    });
  }
}
