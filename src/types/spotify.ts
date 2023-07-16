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

export type SpotifyAlbum = {
  artists: SpotifyArtist[];
  tracks: SpotifyListResponse<SpotifyReducedTrack>;
} & SpotifyReducedAlbum;

export type SpotifyReducedAlbum = {
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
  restrictions: {
    reason: string;
  };
  type: string;
  uri: string;
  copyrights: {
    text: string;
    type: string;
  }[];
  external_ids: {
    upc: string;
    isrc: string;
    ean: string;
  };
  genres: string[];
  label: string;
  popularity: number;
  artists: SpotifyReducedArtist[];
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
  album: SpotifyReducedAlbum;
  external_ids: {
    isrc: string;
  };
  popularity: number;
} & SpotifyReducedTrack;

export type SpotifyReducedTrack = {
  artists: SpotifyReducedArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  is_playable: boolean;
  restrictions: {
    reason: string;
  };
  name: string;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
};

export type SpotifyImage = {
  height: number;
  url: string;
  width: number;
};

export type SpotifySearchResult = {
  artists: SpotifyListResponse<SpotifyArtist>;
};

export type SpotifyTracksResponse = {
  tracks: SpotifyTrack[];
};
