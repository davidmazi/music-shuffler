import { serve } from "bun";

// Types for Apple Music API responses
interface AppleMusicResponse {
  data: any[];
  results: Record<string, any>;
}

interface ErrorResponse {
  error: string;
  message: string;
}

// Apple Music API base URL
const APPLE_MUSIC_API_BASE = "https://api.music.apple.com/v1";

// Get developer token from environment (server-side only)
const getDeveloperToken = (): string => {
  const token = process.env.APPLE_MUSIC_DEVELOPER_TOKEN;
  if (!token) {
    throw new Error("Apple Music developer token not configured");
  }
  return token;
};

// Helper function to make authenticated requests to Apple Music API
async function makeAppleMusicRequest(
  path: string,
  userToken?: string,
  method: string = "GET",
  body?: any
): Promise<Response> {
  const developerToken = getDeveloperToken();
  
  const headers: Record<string, string> = {
    "Authorization": `Bearer ${developerToken}`,
    "Content-Type": "application/json",
  };

  // Add user token if provided (for user-specific requests)
  if (userToken) {
    headers["Music-User-Token"] = userToken;
  }

  const url = `${APPLE_MUSIC_API_BASE}${path}`;
  
  const requestOptions: RequestInit = {
    method,
    headers,
  };

  if (body && method !== "GET") {
    requestOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, requestOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Apple Music API error: ${response.status} ${errorText}`);
      
      return new Response(
        JSON.stringify({
          error: "apple_music_api_error",
          message: `Apple Music API returned ${response.status}`,
          details: errorText
        } as ErrorResponse),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error making Apple Music API request:", error);
    
    return new Response(
      JSON.stringify({
        error: "network_error",
        message: "Failed to connect to Apple Music API"
      } as ErrorResponse),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Music-User-Token",
};

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname.replace("/api/music/", "");
    
    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders
      });
    }

    try {
      // Extract user token from headers if present
      const userToken = request.headers.get("Music-User-Token");
      
      // Make the request to Apple Music API
      const response = await makeAppleMusicRequest(
        `/${path}${url.search}`,
        userToken || undefined,
        request.method,
        request.method !== "GET" ? await request.json() : undefined
      );

      // Add CORS headers to the response
      const responseHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        responseHeaders.set(key, value);
      });

      return new Response(response.body, {
        status: response.status,
        headers: responseHeaders
      });

    } catch (error) {
      console.error("Error in music API proxy:", error);
      
      return new Response(
        JSON.stringify({
          error: "internal_error",
          message: "Internal server error"
        } as ErrorResponse),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }
  }
};
