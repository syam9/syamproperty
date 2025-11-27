exports.handler = async (event) => {
  const qs = event.queryStringParameters || {};
  const imageUrl = qs.url;

  if (!imageUrl) return { statusCode: 400, body: "Missing 'url'" };

  try {
    const resp = await fetch(imageUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
    const arrayBuffer = await resp.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return {
      statusCode: 200,
      isBase64Encoded: true,
      headers: {
        "Content-Type": resp.headers.get("content-type") || "application/octet-stream",
        "Access-Control-Allow-Origin": "*",
      },
      body: buffer.toString("base64"),
    };
  } catch (err) {
    return { statusCode: 500, body: "Error fetching image" };
  }
};

