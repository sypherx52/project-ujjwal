# Add your own songs (same setup as the Janmashtami website)

1. Copy MP3/M4A/OGG/WAV files into `public/audio/`.
2. Open `src/audio.ts` in VS Code.
3. Add each track to `MUSIC_PLAYLIST`, e.g. `{ title: "Govind", artist: "My playlist", src: "/audio/govind.mp3" }`.
4. Make sure the filename matches exactly. Save and refresh the site.

The browser starts music only after the visitor clicks Play. Use audio files you have permission to use.
