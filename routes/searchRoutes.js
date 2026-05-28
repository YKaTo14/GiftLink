import { gifts } from "../data/items.js";

function json(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload, null, 2));
}

export async function handleSearchRoutes(req, res, requestUrl) {
  if (req.method !== "GET") {
    return json(res, 405, { error: "Method not allowed" });
  }

  const category = String(requestUrl.searchParams.get("category") || "").trim().toLowerCase();
  const query = String(requestUrl.searchParams.get("q") || "").trim().toLowerCase();

  const results = gifts.filter((gift) => {
    const matchesCategory = !category || gift.category.toLowerCase() === category;
    const matchesQuery = !query || gift.name.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  return json(res, 200, results);
}
