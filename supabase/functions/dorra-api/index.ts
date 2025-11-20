import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const DORRA_API_KEY = Deno.env.get("DORRA_API_KEY");
const DORRA_BASE_URL = "https://hackathon-api.aheadafrica.org";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { endpoint, method = "GET", data } = await req.json();

    if (!DORRA_API_KEY) {
      throw new Error("DORRA_API_KEY is not configured");
    }

    console.log(`Calling Dorra API: ${method} ${endpoint}`);

    const requestOptions: RequestInit = {
      method,
      headers: {
        "Authorization": `Token ${DORRA_API_KEY}`,
        "Content-Type": "application/json",
      },
    };

    if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
      requestOptions.body = JSON.stringify(data);
    }

    const response = await fetch(`${DORRA_BASE_URL}${endpoint}`, requestOptions);

    const responseText = await response.text();
    console.log(`Dorra API Response Status: ${response.status}`);

    if (!response.ok) {
      console.error(`Dorra API Error: ${responseText}`);
      
      if (response.status === 400) {
        return new Response(
          JSON.stringify({ error: "Invalid request", details: responseText }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      if (response.status === 404) {
        return new Response(
          JSON.stringify({ error: "Resource not found" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({ error: "Dorra EMR API error", details: responseText }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { raw: responseText };
    }

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in dorra-api function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
