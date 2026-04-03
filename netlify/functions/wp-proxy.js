exports.handler = async function (event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, X-WP-Site-URL, X-WP-Username, X-WP-Password",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  try {
    const siteUrl = event.headers["x-wp-site-url"];
    const username = event.headers["x-wp-username"];
    const password = event.headers["x-wp-password"];

    if (!siteUrl || !username || !password) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing site credentials" }) };
    }

    // Extract the WP REST API path from the incoming request
    // e.g. /.netlify/functions/wp-proxy/posts?per_page=10
    const fnBase = "/.netlify/functions/wp-proxy";
    let wpPath = event.path.replace(fnBase, "") || "/";
    if (event.rawQuery) wpPath += "?" + event.rawQuery;

    const wpUrl = `${siteUrl.replace(/\/$/, "")}/wp-json/wp/v2${wpPath}`;

    const creds = Buffer.from(`${username}:${password}`).toString("base64");

    const fetchOptions = {
      method: event.httpMethod,
      headers: {
        Authorization: `Basic ${creds}`,
        "Content-Type": "application/json",
        "User-Agent": "WPCommander/1.0",
      },
    };

    if (event.body && ["POST", "PUT", "PATCH"].includes(event.httpMethod)) {
      fetchOptions.body = event.body;
    }

    const response = await fetch(wpUrl, fetchOptions);
    const responseBody = await response.text();

    // Forward important WP headers
    const forwardHeaders = { ...headers };
    const wpTotal = response.headers.get("X-WP-Total");
    const wpTotalPages = response.headers.get("X-WP-TotalPages");
    if (wpTotal) forwardHeaders["X-WP-Total"] = wpTotal;
    if (wpTotalPages) forwardHeaders["X-WP-TotalPages"] = wpTotalPages;

    return {
      statusCode: response.status,
      headers: forwardHeaders,
      body: responseBody,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
