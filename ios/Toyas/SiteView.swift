import SwiftUI
import UIKit
import WebKit

/// Shows the bundled Toyas website (the files in /docs) full screen.
/// Pages are served from a private "toyas://" address so the cart, saved
/// reviews and other browser storage work just like on the web.
struct SiteView: UIViewRepresentable {

    static let scheme = "toyas"
    static let startURL = URL(string: "toyas://app/index.html")!

    func makeCoordinator() -> Coordinator {
        Coordinator()
    }

    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        if let root = Bundle.main.url(forResource: "docs", withExtension: nil) {
            config.setURLSchemeHandler(AssetSchemeHandler(root: root), forURLScheme: SiteView.scheme)
        }

        let web = WKWebView(frame: .zero, configuration: config)
        web.navigationDelegate = context.coordinator
        web.uiDelegate = context.coordinator
        web.allowsBackForwardNavigationGestures = true

        let navy = UIColor(red: 12.0 / 255.0, green: 42.0 / 255.0, blue: 92.0 / 255.0, alpha: 1)
        web.isOpaque = false
        web.backgroundColor = navy
        web.scrollView.backgroundColor = navy

        web.load(URLRequest(url: SiteView.startURL))
        return web
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}

    final class Coordinator: NSObject, WKNavigationDelegate, WKUIDelegate {

        // Keep the app's own pages inside the app; open everything else
        // (phone numbers, Instagram, other websites) outside it.
        func webView(_ webView: WKWebView,
                     decidePolicyFor navigationAction: WKNavigationAction,
                     decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            guard let url = navigationAction.request.url else {
                decisionHandler(.cancel)
                return
            }
            if url.scheme == SiteView.scheme || url.scheme == "about" {
                decisionHandler(.allow)
            } else {
                UIApplication.shared.open(url, options: [:], completionHandler: nil)
                decisionHandler(.cancel)
            }
        }

        // Links that ask for a new tab/window (target="_blank").
        func webView(_ webView: WKWebView,
                     createWebViewWith configuration: WKWebViewConfiguration,
                     for navigationAction: WKNavigationAction,
                     windowFeatures: WKWindowFeatures) -> WKWebView? {
            if let url = navigationAction.request.url {
                if url.scheme == SiteView.scheme {
                    webView.load(navigationAction.request)
                } else {
                    UIApplication.shared.open(url, options: [:], completionHandler: nil)
                }
            }
            return nil
        }
    }
}
