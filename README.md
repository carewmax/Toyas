# Toyas

Website + Android app for Toyas, the matcha, seasonal drinks and hojicha spot at 109E Wilkinson Road, Freetown.

```
docs/      the website (plain HTML, CSS, JS). This is the only place you edit content.
android/   the Android app. It wraps the website in docs/ and ships it as an APK.
.github/   builds the APK automatically on GitHub.
```

## 1. Put the website online (GitHub Pages)
1. Upload this folder to a new GitHub repository (branch `main`).
2. Repository **Settings → Pages → Build and deployment**: Source *Deploy from a branch*, Branch `main`, Folder `/docs`, Save.
3. After a minute the site is live at `https://YOUR-NAME.github.io/REPO-NAME/`.

(You can also drag the `docs` folder onto Netlify instead. The contact form only sends real messages on Netlify, see below.)

## 2. Get the APK
The APK is built for you by GitHub, nothing to install on your computer.
1. Push this repository to GitHub.
2. Open the **Actions** tab. The *Build Toyas Android app* run takes about 5 minutes.
3. When it finishes, open the repository's **Releases** page (right-hand side). **Toyas.apk** is attached to the release named *Toyas app (latest)*.
4. On an Android phone: download Toyas.apk, open it and allow "Install unknown apps" when asked.

Every push to `main` rebuilds the APK and replaces the one on Releases. You can also run it by hand from Actions → *Run workflow*.

### Notes about the app
- It is a real Android app (a native WebView app), not a browser shortcut. The whole website is inside the APK, so pages open instantly.
- Fonts load from Google Fonts, so the app needs internet for the exact typefaces. Offline it falls back to system fonts.
- The APK is signed with Android's debug key. That is fine for installing and showing clients. Publishing on Google Play needs a release key and a newer target SDK, which can be added later.
- Phone numbers, Instagram and other websites open outside the app.
- To build locally instead: open `android/` in Android Studio and press Run. (Or `cd android && ./gradlew assembleDebug`.)

## Editing the website
- Drinks, prices, add-ons, phone, address, Instagram: `docs/js/data.js`. Prices keep the "NL" notation from the menu.
- Photos: `docs/assets/`. The current photos were cropped from the design mockup, so they are small. Replace each file with the real photo using the same file name. Seasonal drinks and Hojicha show a "photo coming soon" tile until you add an `image:` for them in `data.js`.
- Logo: the header and footer use a text wordmark (`.logo` in `docs/css/style.css`). To use the official logo, put the file in `docs/assets/` and swap the text in `docs/js/app.js`.
- Email and opening hours: set `email` and `hours` in `data.js` once confirmed.
- App name/icon: `android/app/src/main/res/` (icon files are in the `mipmap-*` folders).

## What is real and what is a prototype
- Working: search, menu filters, product options, cart (saved on the device), build-your-own drink.
- Checkout is a prototype: no payment is taken and no order is sent. It shows the order summary with Call, Copy and Instagram buttons.
- Contact form uses Netlify Forms. It sends for real only when the site is hosted on Netlify. On GitHub Pages and inside the app it shows a message asking people to call or use Instagram.
- Reviews are saved only on the visitor's own device (labelled demo). The loyalty card is a visual demo and does not track purchases.
- Size, milk, sweetness and ice options come from the design and have no price change until Toyas confirms them.
