function json(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload, null, 2));
}

function readBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

export async function handleAuthRoutes(req, res, requestUrl, users) {
  if (req.method === "POST" && requestUrl.pathname === "/api/auth/register") {
    const body = await readBody(req);
    const user = {
      id: users.length + 1,
      name: body.name || "Guest",
      email: body.email || "",
      password: body.password || "",
    };
    users.push(user);
    return json(res, 201, { message: "Registration successful", user: { id: user.id, name: user.name, email: user.email } });
  }

  if (req.method === "POST" && requestUrl.pathname === "/api/auth/login") {
    const body = await readBody(req);
    const collection = {
      async findOne(query) {
        return users.find((entry) => entry.email === query.email && entry.password === query.password) || null;
      },
    };
    const user = await collection.findOne({ email: body.email, password: body.password });
    if (!user) {
      return json(res, 401, { error: "Invalid credentials" });
    }
    return json(res, 200, { message: "Login successful", token: "demo-token", user: { id: user.id, name: user.name, email: user.email } });
  }

  if (req.method === "PATCH" && requestUrl.pathname === "/api/auth/user") {
    const body = await readBody(req);
    return json(res, 200, { message: "User updated", profile: body });
  }

  if (req.method === "GET" && requestUrl.pathname === "/api/auth/me") {
    const collection = {
      async findOne(query) {
        return users.find((entry) => entry.email === query.email) || null;
      },
    };
    const currentUser = await collection.findOne({ email: "demo@giftlink.test" });
    return json(res, 200, { user: currentUser || null });
  }

  return json(res, 404, { error: "Auth route not found" });
}
