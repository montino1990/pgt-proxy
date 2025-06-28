export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const { test, lng, lat } = req.query;
    
    const tests = {
      // Test MapBox Milano
      mapbox_milano: lng && lat ? 
        `https://api.mapbox.com/v4/mattiamonti.ajx7te5s/tilequery/${lng},${lat}.json?access_token=pk.eyJ1IjoibWF0dGlhbW9udGkiLCJhIjoiY21jZWh5MWh4MHNjczJqcXc5ZzgzNXl5diJ9.ibmn4ltoxdysemj1_X5l5A` : null,
      
      // Test coordinate Via Brera
      test_brera: `https://api.mapbox.com/v4/mattiamonti.ajx7te5s/tilequery/9.1905,45.4668.json?access_token=pk.eyJ1IjoibWF0dGlhbW9udGkiLCJhIjoiY21jZWh5MWh4MHNjczJqcXc5ZzgzNXl5diJ9.ibmn4ltoxdysemj1_X5l5A`,
      
      // Test altra zona Milano
      test_duomo: `https://api.mapbox.com/v4/mattiamonti.ajx7te5s/tilequery/9.1859,45.4654.json?access_token=pk.eyJ1IjoibWF0dGlhbW9udGkiLCJhIjoiY21jZWh5MWh4MHNjczJqcXc5ZzgzNXl5diJ9.ibmn4ltoxdysemj1_X5l5A`,
      
      // Test periferia Milano  
      test_periferia: `https://api.mapbox.com/v4/mattiamonti.ajx7te5s/tilequery/9.2704,45.5311.json?access_token=pk.eyJ1IjoibWF0dGlhbW9udGkiLCJhIjoiY21jZWh5MWh4MHNjczJqcXc5ZzgzNXl5diJ9.ibmn4ltoxdysemj1_X5l5A`
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
