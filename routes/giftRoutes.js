import { gifts } from "../data/items.js";
import { connectToDatabase } from "../db.js";

function json(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload, null, 2));
}

export async function handleGiftRoutes(req, res, requestUrl) {
  if (req.method === "GET" && requestUrl.pathname === "/api/gifts") {
    await connectToDatabase();
    return json(res, 200, gifts);
  }

  if (req.method === "GET" && requestUrl.pathname.startsWith("/api/gifts/")) {
    await connectToDatabase();
    const id = Number(requestUrl.pathname.split("/").pop());
    const item = gifts.find((gift) => gift.id === id);
    if (!item) {
      return json(res, 404, { error: "Gift not found" });
    }
    return json(res, 200, item);
  }

  return json(res, 405, { error: "Method not allowed" });
}
