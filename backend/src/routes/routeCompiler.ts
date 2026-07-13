import listEndpoints from 'express-list-endpoints';
import { Request, Response } from "express";
import router from "./routes";

interface ExpressEndpoint {
  path: string;
  methods: string[];
  middlewares: string[];
}

export const routes = async(req: Request, res: Response) => {
  // Automatically scans Express internal routing table (works in production build)
  const rawEndpoints = listEndpoints(router) as ExpressEndpoint[];

  // Filter out the dashboard endpoint itself so it stays clean
  const filteredEndpoints = rawEndpoints.filter(ep => ep.path !== '/api/routes');

  // Generate a modern, highly readable HTML page on the fly
  const htmlDashboard = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>API Route Directory</title>
      <style>
        :root {
          --bg-main: #0f172a;
          --bg-card: #1e293b;
          --text-main: #f8fafc;
          --text-muted: #94a3b8;
          --get-color: #10b981;
          --post-color: #3b82f6;
          --put-color: #f59e0b;
          --delete-color: #ef4444;
        }
        body {
          font-family: system-ui, -apple-system, sans-serif;
          background-color: var(--bg-main);
          color: var(--text-main);
          margin: 0;
          padding: 2rem;
        }
        .container {
          max-width: 900px;
          margin: 0 auto;
        }
        header {
          margin-bottom: 2rem;
          border-bottom: 1px solid #334155;
          padding-bottom: 1rem;
        }
        h1 { margin: 0; font-size: 1.75rem; color: #f1f5f9; }
        p { color: var(--text-muted); margin: 0.5rem 0 0 0; font-size: 0.95rem; }
        .badge-count {
          background: #334155;
          padding: 0.2rem 0.6rem;
          border-radius: 12px;
          font-size: 0.85rem;
        }
        .route-card {
          background-color: var(--bg-card);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border: 1px solid #334155;
          transition: transform 0.15s ease;
        }
        .route-card:hover {
          transform: translateX(4px);
          border-color: #475569;
        }
        .method-badge {
          font-family: monospace;
          font-weight: 700;
          font-size: 0.85rem;
          padding: 0.4rem 0.75rem;
          border-radius: 6px;
          min-width: 65px;
          text-align: center;
          text-transform: uppercase;
        }
        .GET { background: rgba(16, 185, 129, 0.15); color: var(--get-color); border: 1px solid rgba(16, 185, 129, 0.3); }
        .POST { background: rgba(59, 130, 246, 0.15); color: var(--post-color); border: 1px solid rgba(59, 130, 246, 0.3); }
        .PUT { background: rgba(245, 158, 11, 0.15); color: var(--put-color); border: 1px solid rgba(245, 158, 11, 0.3); }
        .DELETE { background: rgba(239, 68, 68, 0.15); color: var(--delete-color); border: 1px solid rgba(239, 68, 68, 0.3); }
        .path-text {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 1rem;
          color: #e2e8f0;
          flex-grow: 1;
        }
        .middleware-tag {
          font-size: 0.75rem;
          color: var(--text-muted);
          background: #334155;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <h1>Backend API Directory <span class="badge-count">${filteredEndpoints.length} total</span></h1>
          <p>Production environment active routes. Automatically mapped using application reflection.</p>
        </header>
        
        <main>
          ${filteredEndpoints.map(endpoint => 
            endpoint.methods.map(method => `
              <div class="route-card">
                <span class="method-badge ${method}">${method}</span>
                <span class="path-text">${endpoint.path}</span>
                ${endpoint.middlewares.length > 1 ? `<span class="middleware-tag">Has Middleware</span>` : ''}
              </div>
            `).join('')
          ).join('')}
        </main>
      </div>
    </body>
    </html>
  `;

  // Send down the visually complete web document
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(htmlDashboard);
}