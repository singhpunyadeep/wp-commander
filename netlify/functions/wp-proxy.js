const https = require("https");
const http = require("http");

exports.handler = async function (event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, X-WP-Site-URL, X-WP-Username, X-WP-Password",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers, body: "" };

  try {
    const siteUrl = event.headers["x-wp-site-url"];
    const username = event.headers["x-wp-username"];
    const password = event.headers["x-wp-password"];

    if (!siteUrl || !username || !password) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing site credentials" }) };
    }

    const fnBase = "/.netlify/functions/wp-proxy";
    let wpPath = event.path.replace(fnBase, "") || "/";
    if (event.rawQuery) wpPath += "?" + event.rawQuery;

    const wpUrl = `${siteUrl.replace(/\/$/, "")}/wp-json/wp/v2${wpPath}`;
    const creds = Buffer.from(`${username}:${password}`).toString("base64");
    const parsedUrl = new URL(wpUrl);
    const isHttps = parsedUrl.protocol === "https:";
    const lib = isHttps ? https : http;
    const payload = (event.body && ["POST","PUT","PATCH"].includes(event.httpMethod)) ? event.body : null;

    const data = await new Promise((resolve, reject) => {
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (isHttps ? 443 : 80),
        path: parsedUrl.pathname + parsedUrl.search,
        method: event.httpMethod,
        headers: {
          "Authorization": `Basic ${creds}`,
          "Content-Type": "application/json",
          "User-Agent": "WPCommander/1.0",
          ...(payload ? { "Content-Length": Buffer.byteLength(payload) } : {}),
        },
      };
      const req = lib.request(options, (res) => {
        let raw = "";
        res.on("data", chunk => raw += chunk);
        res.on("end", () => resolve({
          status: res.statusCode,
          body: raw,
          total: res.headers["x-wp-total"] || "",
          totalPages: res.headers["x-wp-totalpages"] || "",
        }));
      });
      req.on("error", reject);
      if (payload) req.write(payload);
      req.end();
    });

    const fwdHeaders = { ...headers };
    if (data.total) fwdHeaders["X-WP-Total"] = data.total;
    if (data.totalPages) fwdHeaders["X-WP-TotalPages"] = data.totalPages;

    return { statusCode: data.status, headers: fwdHeaders, body: data.body };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
