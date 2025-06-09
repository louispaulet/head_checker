export default {
  async fetch(request, env, ctx) {
    const { pathname, searchParams } = new URL(request.url);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (pathname === "/batch" && request.method === "POST") {
      let body;
      try {
        body = await request.json();
      } catch (e) {
        return new Response(
          JSON.stringify({ error: "Invalid JSON", details: e.message }),
          {
            status: 400,
            headers: { "content-type": "application/json", ...corsHeaders },
          }
        );
      }

      const urls = body?.urls;
      if (!Array.isArray(urls)) {
        return new Response(
          JSON.stringify({ error: "Missing 'urls' parameter" }),
          {
            status: 400,
            headers: { "content-type": "application/json", ...corsHeaders },
          }
        );
      }

      const results = {};
      for (const url of urls) {
        try {
          const headResp = await fetch(url, {
            method: "HEAD",
            redirect: "manual",
          });
          results[url] = headResp.status;
        } catch (e) {
          results[url] = 0;
        }
      }

      return new Response(
        JSON.stringify({ results }),
        {
          headers: { "content-type": "application/json", ...corsHeaders },
        }
      );
    }

    const url = searchParams.get("url");
    if (!url) {
      return new Response(
        JSON.stringify({ error: "Missing 'url' parameter" }),
        {
          status: 400,
          headers: { "content-type": "application/json", ...corsHeaders },
        }
      );
    }

    try {
      const headResp = await fetch(url, { method: "HEAD", redirect: "manual" });
      return new Response(
        JSON.stringify({ status: headResp.status }),
        {
          headers: { "content-type": "application/json", ...corsHeaders },
        }
      );
    } catch (e) {
      return new Response(
        JSON.stringify({ error: "Fetch failed", details: e.message }),
        {
          status: 500,
          headers: { "content-type": "application/json", ...corsHeaders },
        }
      );
    }
  },
};
