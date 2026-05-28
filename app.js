import http from "http";
import { URL } from "url";
import { gifts } from "./data/items.js";
import { handleGiftRoutes } from "./routes/giftRoutes.js";
import { handleSearchRoutes } from "./routes/searchRoutes.js";
import { handleAuthRoutes } from "./routes/authRoutes.js";

const port = process.env.PORT || 3000;
const users = [
  {
    id: 1,
    name: "Demo User",
    email: "demo@giftlink.test",
    password: "demo123",
  },
];

function json(res, statusCode, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(body);
}

function serveLandingPage(res) {
  const html = `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>GiftLink</title>
      <style>
        :root { color-scheme: light; --bg:#f7f2e8; --ink:#1f2937; --accent:#176b87; --accent-2:#ffb347; }
        * { box-sizing: border-box; }
        body { margin:0; font-family: Arial, Helvetica, sans-serif; color:var(--ink); background: radial-gradient(circle at top left, #fff7e8, var(--bg)); }
        .shell { max-width: 1100px; margin: 0 auto; padding: 32px 20px 56px; }
        header { display:flex; justify-content:space-between; align-items:center; gap:20px; margin-bottom: 48px; }
        .brand { display:flex; align-items:center; gap:12px; font-weight:700; font-size:1.1rem; }
        .mark { width:42px; height:42px; border-radius:14px; background: linear-gradient(135deg, var(--accent), #0f3d57); color:white; display:grid; place-items:center; box-shadow: 0 12px 30px rgba(23,107,135,.25); }
        .pill { display:inline-flex; align-items:center; gap:10px; border:1px solid rgba(31,41,55,.12); border-radius:999px; padding: 10px 16px; background: rgba(255,255,255,.7); }
        .hero { display:grid; grid-template-columns: 1.25fr .75fr; gap: 28px; align-items:center; }
        .kicker { text-transform: uppercase; letter-spacing: .18em; font-size: .78rem; color: var(--accent); font-weight: 700; }
        h1 { font-size: clamp(2.6rem, 6vw, 5.2rem); line-height: .96; margin: 12px 0 18px; }
        p { line-height: 1.6; font-size: 1.05rem; }
        .cta-row { display:flex; flex-wrap:wrap; gap: 14px; margin-top: 28px; }
        .button { border:0; border-radius: 999px; padding: 14px 22px; font-weight:700; text-decoration:none; }
        .button.primary { background: var(--accent); color: white; box-shadow: 0 16px 30px rgba(23,107,135,.24); }
        .button.secondary { background: white; color: var(--ink); border: 1px solid rgba(31,41,55,.12); }
        .panel { background: rgba(255,255,255,.82); border: 1px solid rgba(31,41,55,.08); border-radius: 28px; padding: 24px; box-shadow: 0 20px 60px rgba(31,41,55,.08); }
        .stats { display:grid; gap: 14px; margin-top: 16px; }
        .stat { display:flex; justify-content:space-between; align-items:center; padding: 16px 18px; border-radius: 18px; background: linear-gradient(135deg, rgba(23,107,135,.08), rgba(255,179,71,.18)); }
        .grid { display:grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 24px; }
        .card { background: white; border:1px solid rgba(31,41,55,.08); border-radius: 22px; padding: 18px; }
        .muted { color: rgba(31,41,55,.7); }
        @media (max-width: 900px) { .hero, .grid { grid-template-columns: 1fr; } header { flex-direction: column; align-items:flex-start; } }
      </style>
    </head>
    <body>
      <div class="shell">
        <header>
          <div class="brand"><div class="mark">G</div><div>GiftLink</div></div>
          <div class="pill">A marketplace for giving items a second life</div>
        </header>
        <section class="hero">
          <div>
            <div class="kicker">Project title and tagline</div>
            <h1>GiftLink</h1>
            <p>Connect people who want to give away household items with people who prefer to reuse, recycle, and find free items instead of purchasing new ones.</p>
            <div class="cta-row">
              <a class="button primary" href="#get-started">Get Started</a>
              <a class="button secondary" href="/api/gifts">View Gifts API</a>
            </div>
          </div>
          <div class="panel" id="get-started">
            <strong>What you can do</strong>
            <div class="stats">
              <div class="stat"><span>Browse gifts</span><strong>16 listed</strong></div>
              <div class="stat"><span>Search by category</span><strong>Furniture, Toys, Books</strong></div>
              <div class="stat"><span>Save time</span><strong>Quick pickup</strong></div>
            </div>
          </div>
        </section>
        <div class="grid">
          <div class="card"><strong>Reuse</strong><p class="muted">Find items people no longer need.</p></div>
          <div class="card"><strong>Donate</strong><p class="muted">Give away usable items quickly.</p></div>
          <div class="card"><strong>Search</strong><p class="muted">Filter by category and item name.</p></div>
        </div>
      </div>
    </body>
  </html>`;

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);

  if (requestUrl.pathname === "/" && req.method === "GET") {
    return serveLandingPage(res);
  }

  if (requestUrl.pathname === "/api/search" && req.method === "GET") {
    const category = String(requestUrl.searchParams.get("category") || "").trim().toLowerCase();
    const query = String(requestUrl.searchParams.get("q") || "").trim().toLowerCase();
    const results = gifts.filter((gift) => {
      const categoryMatches = !category || gift.category.toLowerCase() === category;
      const queryMatches = !query || gift.name.toLowerCase().includes(query);
      return categoryMatches && queryMatches;
    });
    return json(res, 200, results);
  }

  if (requestUrl.pathname === "/api/search") {
    return handleSearchRoutes(req, res, requestUrl);
  }

  if (requestUrl.pathname.startsWith("/api/gifts")) {
    return handleGiftRoutes(req, res, requestUrl);
  }

  if (requestUrl.pathname.startsWith("/api/auth")) {
    return handleAuthRoutes(req, res, requestUrl, users);
  }

  if (requestUrl.pathname === "/api/health") {
    return json(res, 200, { status: "ok" });
  }

  if (requestUrl.pathname === "/api/items") {
    return json(res, 200, { items: gifts });
  }

  res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify({ error: "Not found" }, null, 2));
});

server.listen(port, () => {
  console.log(`GiftLink is running at http://127.0.0.1:${port}`);
});
