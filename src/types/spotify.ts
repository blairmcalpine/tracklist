export type SpotifyArtist = {
  followers: {
    href: string;
    total: number;
  };
  genres: string[];
  images: SpotifyImage[];
  popularity: number;
} & SpotifyReducedArtist;

export type SpotifyReducedArtist = {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
};

export type SpotifyListResponse<T> = {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
};

export type SpotifyTrack = {
  album: {
    album_type: string;
    total_tracks: number;
    available_markets: string[];
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    images: SpotifyImage[];
    name: string;
    release_date: string;
    release_date_precision: string;
    type: string;
    uri: string;
    artists: SpotifyReducedArtist[];
  };
  artists: SpotifyReducedArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: {
    isrc: string;
  };
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
};

export type SpotifyImage = {
  height: number;
  url: string;
  width: number;
};

export type SpotifySearchResult = {
  artists: SpotifyListResponse<SpotifyArtist>;
  tracks: SpotifyListResponse<SpotifyTrack>;
};
