// Client-side utility for making secure Apple Music API requests through our proxy

export interface AppleMusicApiError {
  error: string;
  message: string;
  details?: string;
}

export interface AppleMusicApiResponse<T = any> {
  data: T;
  results?: Record<string, any>;
}

class AppleMusicApiClient {
  private baseUrl: string;

  constructor() {
    // Use our secure proxy endpoint
    this.baseUrl = "/api/music";
  }

  private async makeRequest<T>(
    path: string,
    options: {
      method?: string;
      userToken?: string;
      body?: any;
      params?: Record<string, string>;
    } = {}
  ): Promise<T> {
    const {
      method = "GET",
      userToken,
      body,
      params = {}
    } = options;

    // Build URL with query parameters
    const url = new URL(`${this.baseUrl}${path}`, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add user token if provided
    if (userToken) {
      headers["Music-User-Token"] = userToken;
    }

    const requestOptions: RequestInit = {
      method,
      headers,
    };

    if (body && method !== "GET") {
      requestOptions.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url.toString(), requestOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: "network_error",
          message: "Failed to parse error response"
        }));

        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Apple Music API request failed:", error);
      throw error;
    }
  }

  // Search for music
  async search(
    query: string,
    types: string[] = ["songs", "albums", "artists"],
    limit: number = 25,
    userToken?: string
  ) {
    return this.makeRequest("/catalog/us/search", {
      params: {
        term: query,
        types: types.join(","),
        limit: limit.toString(),
      },
      userToken,
    });
  }

  // Get user's library
  async getUserLibrary(
    type: "songs" | "albums" | "playlists",
    userToken: string,
    limit: number = 25
  ) {
    return this.makeRequest(`/me/library/${type}`, {
      params: {
        limit: limit.toString(),
      },
      userToken,
    });
  }

  // Get user's playlists
  async getUserPlaylists(userToken: string, limit: number = 25) {
    return this.makeRequest("/me/library/playlists", {
      params: {
        limit: limit.toString(),
      },
      userToken,
    });
  }

  // Get playlist details
  async getPlaylist(playlistId: string, userToken?: string) {
    return this.makeRequest(`/catalog/us/playlists/${playlistId}`, {
      userToken,
    });
  }

  // Get album details
  async getAlbum(albumId: string, userToken?: string) {
    return this.makeRequest(`/catalog/us/albums/${albumId}`, {
      userToken,
    });
  }

  // Get song details
  async getSong(songId: string, userToken?: string) {
    return this.makeRequest(`/catalog/us/songs/${songId}`, {
      userToken,
    });
  }

  // Get artist details
  async getArtist(artistId: string, userToken?: string) {
    return this.makeRequest(`/catalog/us/artists/${artistId}`, {
      userToken,
    });
  }

  // Get user's recently played
  async getRecentlyPlayed(userToken: string, limit: number = 25) {
    return this.makeRequest("/me/recent/played", {
      params: {
        limit: limit.toString(),
      },
      userToken,
    });
  }

  // Get user's recommendations
  async getRecommendations(userToken: string, limit: number = 25) {
    return this.makeRequest("/me/recommendations", {
      params: {
        limit: limit.toString(),
      },
      userToken,
    });
  }
}

// Export singleton instance
export const appleMusicApi = new AppleMusicApiClient();

// Export types for use in components
export type { AppleMusicApiError, AppleMusicApiResponse };
