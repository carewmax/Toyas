import SwiftUI

@main
struct ToyasApp: App {
    var body: some Scene {
        WindowGroup {
            ZStack {
                // Navy behind the status bar, matching the website header.
                Color(red: 12.0 / 255.0, green: 42.0 / 255.0, blue: 92.0 / 255.0)
                    .ignoresSafeArea()
                SiteView()
            }
            .preferredColorScheme(.dark)
        }
    }
}
