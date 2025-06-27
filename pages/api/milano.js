export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const { test } = req.query;
    
    // Test diversi servizi pubblici italiani
    const tests = {
      // Test 1: Altro comune lombardo
      bergamo: 'https://sit.comune.bergamo.it/arcgis/rest/services',
      
      // Test 2: Servizio regionale
      lombardia: 'https://www.cartografia.regione.lombardia.it/arcgis/rest/services',
      
      // Test 3: Servizio nazionale
      igm: 'https://www.igmi.org/arcgis/rest/services',
      
      // Test 4: ISTAT
      istat: 'https://geomap.istat.it/arcgis/rest/services',
      
      // Test 5: Milano servizio diverso (non PGT)
      milano_basic: 'https://geoportale.comune.milano.it/arcgis/rest/services'
    };
    
    if (!test || !tests[test]) {
      return res.status(400).json({ 
        error: 'Specify test parameter',
        available: Object.keys(tests)
      });
    }
    
    const url = tests[test];
    console.log(`Testing: ${url}`);
    
    const response = await fetch(`${url}?f=json`);
    const data = await response.json();
    
    return res.status(200).json({
      test: test,
      url: url,
      status: response.status,
      success: true,
      dataKeys: Object.keys(data),
      sample: data
    });
    
  } catch (error) {
    return res.status(500).json({ 
      test: req.query.test,
      error: error.message,
      success: false
    });
  }
}
