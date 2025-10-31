    const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars setup
app.engine('hbs', exphbs.engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Demo dataset (replace with real search backend)
const docs = [
  { id: 1, title: "Node.js Basics", snippet: "Learn Node.js fundamentals, async I/O, and modules." },
  { id: 2, title: "Handlebars Templates", snippet: "Render HTML on the server using Handlebars (.hbs files)." },
  { id: 3, title: "Full Text Search with Elastic", snippet: "Intro to Elasticsearch and indexing documents." },
  { id: 4, title: "Express.js Guide", snippet: "Build web servers and APIs with Express." },
  { id: 5, title: "Web Performance", snippet: "Optimize front-end performance: caching, lazy load, bundles." }
];

// Helper: simple fuzzy-ish search (case-insensitive token match)
function searchDocs(query, page=1, perPage=10) {
  if (!query || !query.trim()) {
    return { total: 0, results: [] };
  }
  const q = query.trim().toLowerCase();
  const tokens = q.split(/\s+/);
  const scored = docs.map(d => {
    const hay = (d.title + ' ' + d.snippet).toLowerCase();
    let score = 0;
    tokens.forEach(t => {
      if (hay.includes(t)) score += 1 + (hay.indexOf(t) === 0 ? 0.5 : 0);
    });
    return { doc: d, score };
  }).filter(x => x.score > 0)
    .sort((a,b) => b.score - a.score);

  const total = scored.length;
  const start = (page-1) * perPage;
  const results = scored.slice(start, start + perPage).map(s => s.doc);
  return { total, results };
}

// Render the search page (server-side initial render)
app.get('/', (req, res) => {
  const q = req.query.q || '';
  const page = parseInt(req.query.page || '1', 10);
  const perPage = 10;
  const { total, results } = searchDocs(q, page, perPage);
  res.render('search', {
    q,
    results,
    total,
    page,
    hasResults: results.length > 0,
    perPage
  });
});

// JSON API endpoint for AJAX search
app.get('/api/search', (req, res) => {
  const q = req.query.q || '';
  const page = parseInt(req.query.page || '1', 10);
  const perPage = parseInt(req.query.perPage || '10', 10);
  const { total, results } = searchDocs(q, page, perPage);
  res.json({ q, total, results, page, perPage });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server running on http://localhost:${PORT}`));
