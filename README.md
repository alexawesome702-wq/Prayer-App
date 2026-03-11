# Prayer Thread

A zero-dependency installable web app that presents prayer like a familiar text thread.

## What it does

- Lets a user type prayers into a chat-style interface
- Stores the prayer history in `localStorage`
- Tracks a simple daily prayer streak
- Offers prayer starter prompts and mood-based reflections
- Works offline after first load with a service worker
- Can be installed as an app on Mac and iPhone

## Run it on your Mac

Start a local server from [/Users/alexminarich/Documents/Playground](/Users/alexminarich/Documents/Playground):

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

To install it as a Mac app:

1. Open the site in Chrome or Edge.
2. Use the install button in the app, or the browser install icon in the address bar.
3. It will appear as its own app window and can stay in your Dock.

## Open it on your iPhone

1. Keep your Mac and iPhone on the same Wi-Fi.
2. Start the local server on your Mac.
3. Find your Mac's local IP:

```bash
ipconfig getifaddr en0
```

4. On iPhone Safari, visit `http://YOUR-MAC-IP:8000`.
5. Tap Share, then tap Add to Home Screen.

## Files

- [/Users/alexminarich/Documents/Playground/index.html](/Users/alexminarich/Documents/Playground/index.html)
- [/Users/alexminarich/Documents/Playground/styles.css](/Users/alexminarich/Documents/Playground/styles.css)
- [/Users/alexminarich/Documents/Playground/app.js](/Users/alexminarich/Documents/Playground/app.js)
- [/Users/alexminarich/Documents/Playground/manifest.webmanifest](/Users/alexminarich/Documents/Playground/manifest.webmanifest)
- [/Users/alexminarich/Documents/Playground/sw.js](/Users/alexminarich/Documents/Playground/sw.js)
