const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const fetch = require('node-fetch');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files (e.g., CRM.html)
app.use(express.static(path.join(__dirname)));

// Local mock CRM data (for offline use)
const crmData = {
  customers: [
    { id: 1, name: 'TechCorp Inc.', status: 'Hot', revenue: 150000, lastContact: '2024-01-15' },
    { id: 2, name: 'Global Solutions', status: 'Warm', revenue: 85000, lastContact: '2024-01-10' },
    { id: 3, name: 'DataSystems', status: 'Hot', revenue: 120000, lastContact: '2024-01-12' }
  ],
  sales: [
    { month: 'Jan', revenue: 45000, deals: 12 },
    { month: 'Feb', revenue: 52000, deals: 15 },
    { month: 'Mar', revenue: 48000, deals: 14 }
  ],
  pipeline: { leads: 45, qualified: 28, proposal: 15, closed: 12 }
};

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Azure backend base URL (optional)
const AZURE_BASE = 'https://operamadic-chatbox-bbgag9gudhegeeca.westeurope-01.azurewebsites.net/api';

// Helper function to safely fetch
async function tryFetch(url, body) {
  try {
    const resp = await fetch(url, { 
      method: 'POST', 
      headers: { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json' 
      },
      body: JSON.stringify(body)
    });
    console.log(resp.status, resp.statusText, 'CONSOLE_LOG');

    if (!resp.ok) throw new Error(`Status ${resp.status}`);
    
    const result = await resp.json(); // CHANGED: Parse as JSON instead of text
    return result;
  } catch (err) {
    console.warn(`⚠️ Backend unavailable for ${url}: ${err.message}`);
    return null;
  }
}

// CRM endpoints (use backend if available, else local)
app.get('/api/crm/customers', async (req, res) => {
  const backendData = await tryFetch(`${AZURE_BASE}/customers`);
  res.json(backendData || crmData.customers);
});

app.get('/api/crm/sales', async (req, res) => {
  const backendData = await tryFetch(`${AZURE_BASE}/sales`);
  res.json(backendData || crmData.sales);
});

app.get('/api/crm/pipeline', async (req, res) => {
  const backendData = await tryFetch(`${AZURE_BASE}/pipeline`);
  res.json(backendData || crmData.pipeline);
});

// Fallback logic for local CRM responses
function localCrmAnswer(message) {
  const m = (message || '').toLowerCase();
  if (m.includes('top customers')) {
    const sorted = [...crmData.customers].sort((a,b)=>b.revenue-a.revenue).slice(0,3);
    return `Top customers:\n` + sorted.map(c=>`${c.name} — $${c.revenue}`).join('\n');
  }
  if (m.includes('pipeline')) {
    const p = crmData.pipeline;
    return `Pipeline: Leads ${p.leads}, Qualified ${p.qualified}, Proposal ${p.proposal}, Closed ${p.closed}`;
  }
  if (m.includes('sales')) {
    return 'Recent sales: ' + crmData.sales.map(s=>`${s.month}: $${s.revenue}`).join(' | ');
  }
  return `I can answer CRM questions about customers, sales, and pipeline. Try: "Top customers" or "Show pipeline summary".`;
}

// AI endpoint - FIXED VERSION
app.post('/api/ai-assistant', async (req, res) => {
  try {
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error: 'Missing message in body' });

    console.log('=== AI ASSISTANT REQUEST ===');
    console.log('User message:', message);

    // Try to fetch from the C# backend first
    const backendResponse = await tryFetch(`${AZURE_BASE}/Chat/get-response`, {
      userMessage: message, 
      email: '-'
    });

    console.log('Backend response:', backendResponse);

    let responseText;
    let source = 'azure-backend';

    if (backendResponse) {
      // Extract response from backend - handle different possible formats
      responseText = backendResponse.response || backendResponse.message || backendResponse.answer || backendResponse.text;
      
      if (!responseText && typeof backendResponse === 'string') {
        responseText = backendResponse;
      }
      
      if (!responseText) {
        // If we can't extract text, use the whole response
        responseText = JSON.stringify(backendResponse);
      }
    } else {
      // Fallback to local CRM responses
      responseText = localCrmAnswer(message);
      source = 'local-fallback';
    }

    console.log('Sending response:', responseText);

    // Send properly formatted response
    res.json({ 
      response: responseText,
      meta: { source: source }
    });

  } catch (err) {
    console.error('AI API error:', err);
    const fallback = localCrmAnswer(req.body?.message || '');
    res.json({ 
      response: fallback, 
      meta: { source: 'error-fallback' }
    });
  }
});

// Serve CRM.html on root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'CRM.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Server running locally at: http://localhost:${PORT}`));