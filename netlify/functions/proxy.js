// netlify/functions/proxy.js
// Netlify functions run in Node 18+ and support fetch.
// This function fetches an image and returns base64 encoded body so browser can display it.

exports.handler = async (event) => {
  const qs = event.queryStringParameters || {};
  const imageUrl = qs.url;

  if (!imageUrl) {
    return {
      statusCode: 400,
      body: "Missing 'url' query parameter",
    };
  }

  try {
    // fetch the remote image
    const resp = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible)",
        // add referer if needed: "Referer": "https://yourdomain.com"
      },
    });

    if (!resp.ok) {
      return {
        statusCode: resp.status,
        body: `Upstream fetch failed: ${resp.statusText}`,
      };
    }

    const contentType = resp.headers.get("content-type") || "application/octet-stream";
    const arrayBuffer = await resp.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return {
      statusCode: 200,
      isBase64Encoded: true,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600", // cache 1 hour (tweak as needed)
      },
      body: buffer.toString("base64"),
    };
  } catch (err) {
    console.error("Proxy error:", err);
    return {
      statusCode: 500,
      body: "Error fetching image",
    };
  }
};

