import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:url_launcher/url_launcher.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Sticky immersive system UI mode
  await SystemChrome.setEnabledSystemUIMode(
    SystemUiMode.edgeToEdge,
  );

  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Color(0xFF07070F),
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  runApp(const GipApp());
}

class GipApp extends StatelessWidget {
  const GipApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Incentive Gaming',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF07070F),
        primaryColor: const Color(0xFFA855F7),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFFA855F7),
          secondary: Color(0xFF06B6D4),
          surface: Color(0xFF0F0F1E),
        ),
      ),
      home: const GipWebViewScreen(),
    );
  }
}

class GipWebViewScreen extends StatefulWidget {
  const GipWebViewScreen({super.key});

  @override
  State<GipWebViewScreen> createState() => _GipWebViewScreenState();
}

class _GipWebViewScreenState extends State<GipWebViewScreen> {
  InAppWebViewController? _webViewController;
  double _progress = 0;
  bool _isLoading = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF07070F),
      body: SafeArea(
        child: Stack(
          children: [
            Column(
              children: [
                // WebView Container
                Expanded(
                  child: InAppWebView(
                    initialFile: "assets/index.html",
                    initialSettings: InAppWebViewSettings(
                      javaScriptEnabled: true,
                      mediaPlaybackRequiresUserGesture: false,
                      allowsInlineMediaPlayback: true,
                      iframeAllowFullscreen: true,
                      useHybridComposition: true,
                      allowsBackForwardNavigationGestures: true,
                      verticalScrollBarEnabled: true,
                      horizontalScrollBarEnabled: false,
                      minimumFontSize: 8,
                      useShouldOverrideUrlLoading: true,
                      userAgent: "Mozilla/5.0 (Linux; Android 13; Redmi Note 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
                    ),
                    onWebViewCreated: (controller) {
                      _webViewController = controller;
                    },
                    shouldOverrideUrlLoading: (controller, navigationAction) async {
                      var uri = navigationAction.request.url;
                      if (uri != null) {
                        String urlString = uri.toString();
                        
                        // If it's the main course website, allow it to load inside the WebView
                        if (urlString.contains("tgipbyhadi.vercel.app") || 
                            urlString.contains("localhost") ||
                            urlString.startsWith("file:///")) {
                          return NavigationActionPolicy.ALLOW;
                        }
                        
                        // Otherwise launch externally (shows system chooser prompt)
                        try {
                          final parsedUri = Uri.parse(urlString);
                          if (await canLaunchUrl(parsedUri)) {
                            await launchUrl(
                              parsedUri,
                              mode: LaunchMode.externalApplication,
                            );
                          } else {
                            await launchUrl(
                              parsedUri,
                              mode: LaunchMode.externalApplication,
                            );
                          }
                        } catch (e) {
                          debugPrint("Could not launch external url: $e");
                        }
                        return NavigationActionPolicy.CANCEL;
                      }
                      return NavigationActionPolicy.ALLOW;
                    },
                    onDownloadStartRequest: (controller, downloadStartRequest) async {
                      String urlString = downloadStartRequest.url.toString();
                      try {
                        final parsedUri = Uri.parse(urlString);
                        await launchUrl(
                          parsedUri,
                          mode: LaunchMode.externalApplication,
                        );
                      } catch (e) {
                        debugPrint("Could not launch download url: $e");
                      }
                    },
                    onProgressChanged: (controller, progress) {
                      setState(() {
                        _progress = progress / 100;
                        if (progress >= 100) {
                          _isLoading = false;
                        }
                      });
                    },
                    onLoadStart: (controller, url) {
                      setState(() {
                        _isLoading = true;
                      });
                    },
                    onLoadStop: (controller, url) {
                      setState(() {
                        _isLoading = false;
                      });
                    },
                  ),
                ),
              ],
            ),

            // Top Progress Bar
            if (_isLoading)
              Positioned(
                top: 0,
                left: 0,
                right: 0,
                child: LinearProgressIndicator(
                  value: _progress,
                  backgroundColor: Colors.transparent,
                  valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFFA855F7)),
                  minHeight: 3,
                ),
              ),
          ],
        ),
      ),
    );
  }
}
