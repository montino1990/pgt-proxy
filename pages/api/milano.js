export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const { test, comune, limit = 5 } = req.query;
    
    const tests = {
      // 1. Struttura dataset Milano metropolitano
      milano_structure: 'https://www.dati.lombardia.it/resource/cnun-cyrz.json?$limit=3',
      
      // 2. Tutti i record per vedere denominazioni
      milano_all: `https://www.dati.lombardia.it/resource/cnun-cyrz.json?$limit=${limit}`,
      
      // 3. Test varianti nome Milano nei PGT
      milano_upper: 'https://www.dati.lombardia.it/resource/ijqk-ahfp.json?comune=MILANO',
      milano_lower: 'https://www.dati.lombardia.it/resource/ijqk-ahfp.json?comune=milano',
      milano_title: 'https://www.dati.lombardia.it/resource/ijqk-ahfp.json?comune=Milano',
      
      // 4. Test con contains per trovare Milano
      milano_search: 'https://www.dati.lombardia.it/resource/ijqk-ahfp.json?$where=contains(upper(comune),\'MILANO\')',
      
      // 5. Test tavole PGT Milano
      tavole_milano: 'https://www.dati.lombardia.it/resource/e4jf-ahvw.json?$where=contains(upper(comune),\'MILANO\')',
      tavole_structure: 'https://www.dati.lombardia.it/resource/e4jf-ahvw.json?$limit=3',
      
      // 6. Test generico per comune specifico
      test_comune: comune ? `https://www.dati.lombardia.it/resource/ijqk-ahfp.json?comune=${comune}` : null,
      
      // 7. Test metadata dataset per capire campi disponibili
      metadata_pgt: 'https://www.dati.lombardia.it/api/views/ijqk-ahfp.json',
      metadata_tavole: 'https://www.dati.lombardia.it/api/views/e4jf-ahvw.json',
      
      // 8. Test zona metropolitana Milano
      zone_milano: 'https://www.dati.lombardia.it/resource/cnun-cyrz.json?$where=contains(upper(nome),\'MILANO\')'
    };
    
    if (!test || !tests[test]) {
      return res.status(400).json({ 
        error: 'Specify test parameter',
        available: Object.keys(tests),
        examples: [
          '?test=milano_structure',
          '?test=milano_search', 
          '?test=tavole_milano',
          '?test=test_comune&comune=Como'
        ]
      });
    }
    
    const url = tests[test];
    if (!url) {
      return res.status(400).json({ 
        error: 'Missing comune parameter or invalid test',
        hint: 'Use test_comune with &comune=YourCity'
      });
    }
    
    console.log(`Testing Milano variants: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PGT-Proxy/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Analizza risultato
    let analysis = {};
    if (Array.isArray(data)) {
      analysis = {
        type: 'array',
        count: data.length,
        sample: data.slice(0, 2),
        fields: data.length > 0 ? Object.keys(data[0]) : []
      };
    } else if (data.columns) {
      // Metadata response
      analysis = {
        type: 'metadata',
        columns: data.columns.map(col => ({
          name: col.name,
          dataTypeName: col.dataTypeName,
          description: col.description
        }))
      };
    } else {
      analysis = {
        type: 'object',
        keys: Object.keys(data),
        sample: data
      };
    }
    
    return res.status(200).json({
      test: test,
      url: url,
      status: response.status,
      success: true,
      analysis: analysis,
      rawData: data
    });
    
  } catch (error) {
    console.error('SODA API Error:', error);
    return res.status(500).json({ 
      test: req.query.test,
      error: error.message,
      success: false,
      timestamp: new Date().toISOString()
    });
  }
}
