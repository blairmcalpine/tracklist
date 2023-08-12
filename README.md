![android-chrome-192x192](https://github.com/blairmcalpine/tracklist/assets/97198784/b9414034-39c9-42f0-b173-d17aebca6c54)

# TrackList

This is a [T3 Stack](https://create.t3.gg/) project that leverages the [Spotify Web API](https://developer.spotify.com/). TrackList aims to provide Spotify users enhanced information about their Spotify profile and various Spotify artists.


## Features

- View your top artists and tracks
- Search for artists
- View a list of all of an artist's songs
- Sort an artist's songs by popularity, name, or release date
- View an album's tracklist

## The Stack

TrackList uses the following technologies:

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Local Deployment

To deploy a version of TrackList for yourself, create a [Spotify application](https://developer.spotify.com/dashboard/create) and add the application client ID and client secret to a `.env` file. You will also need NEXTAUTH_URL AND NEXTAUTH_SECRET environment variables. Your `.env` file should look like this:

```bash
SPOTIFY_CLIENT_ID=your-client-id
SPOTIFY_CLIENT_SECRET=your-client-secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
```

Then, run the following commands:

```bash
npm install
npm run dev
```

Visiting [http://localhost:3000](http://localhost:3000) will show you the TrackList homepage.
