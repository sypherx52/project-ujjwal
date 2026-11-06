/**
 * EDIT YOUR SONGS HERE — same simple setup as your Janmashtami website.
 * Put MP3/M4A/OGG/WAV files in public/audio/, then add each song below.
 * `src` must match the exact filename, e.g. /audio/govind.mp3
 */
export type PlaylistTrack = { title: string; artist: string; src: string };

export const MUSIC_PLAYLIST: PlaylistTrack[] = [
  // Add your own songs here. Examples:
  // { title: "Govind", artist: "My playlist", src: "/audio/govind.mp3" },
  // { title: "Murli", artist: "My playlist", src: "/audio/murli.mp3" },
];
