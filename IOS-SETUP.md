# Toyas on iPhone: setup guide

The iPhone app lives in `ios/`. GitHub builds it on a cloud Mac, so you don't need a Mac yourself.

## Step A: free check (no Apple account needed)
Upload the `ios` folder and the workflow file `.github/workflows/ios.yml` to GitHub. The job called **check** (Actions tab → "iPhone app") builds the app for the iPhone simulator. A green tick means the iPhone app compiles. If it is red, open the run, copy the red error and send it to the developer.

## Step B: Apple account (after you pay and Apple approves you)
Enrol at https://developer.apple.com/programs/enroll/ . Approval can take from minutes to a few days.

1. **Bundle ID.** developer.apple.com → Account → Certificates, Identifiers & Profiles → Identifiers → **+** → App IDs → App → Description "Toyas", Bundle ID *Explicit* `com.toyas.app` → Continue → Register.
   If Apple says it is taken, choose another (for example `com.yourname.toyas`) and change it in `ios/project.yml` (PRODUCT_BUNDLE_IDENTIFIER).
2. **App record.** https://appstoreconnect.apple.com → Apps → **+** → New App → iOS, Name (if "Toyas" is taken, try "Toyas Drinks"), Primary language English, choose the bundle ID, SKU `toyas-001`.
3. **API key.** App Store Connect → Users and Access → Integrations → App Store Connect API → Team Keys → **+**, name "GitHub", access **Admin** → Generate. Download the `.p8` file (you can only download it once) and write down the **Key ID** and the **Issuer ID** shown at the top of the page.
4. **Team ID.** developer.apple.com → Account → Membership details → Team ID (10 characters).

## Step C: tell GitHub the secrets
Repository → Settings → Secrets and variables → Actions → New repository secret. Create four:

| Name | Value |
| --- | --- |
| `ASC_KEY_ID` | the Key ID |
| `ASC_ISSUER_ID` | the Issuer ID |
| `ASC_KEY_P8` | open the `.p8` file in Notepad and paste **everything**, including the BEGIN and END lines |
| `APPLE_TEAM_ID` | the Team ID |

## Step D: send it to TestFlight
Actions → **iPhone app** → **Run workflow** → Run. About 10 to 15 minutes later the build appears in App Store Connect → your app → **TestFlight** (Apple may process it for a few more minutes).
- To test on your own iPhone: install the **TestFlight** app, add yourself under TestFlight → Internal Testing, and accept the invite.
- Clients outside your team need an External Testing group, which Apple reviews once before the first build can be shared.

Every later run uploads a new build automatically (the build number goes up each time).

## Good to know
- The app is the Toyas website packaged in a native shell, same as the Android app. Apple's review team can reject apps that are only a website. For the public App Store you would likely need to add real app features first.
- Publishing a client's app from your account shows your legal name as the seller.
- Fonts load from Google Fonts, so the exact typefaces need internet.
