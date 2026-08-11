import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

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
      title: 'CheatsByHadi GIP Program',
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
  bool _showTopBar = true;

  void _scrollToSection(String sectionId) {
    _webViewController?.evaluateJavascript(source: '''
      (function() {
        var el = document.getElementById('$sectionId');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      })();
    ''');
  }

  void _showQuickNavigationSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF0F0F1E),
      barrierColor: Colors.black54,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: const Color(0xFF0F0F1E),
            borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
            border: Border.all(color: const Color(0xFFA855F7).withOpacity(0.3)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.white24,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                children: const [
                  Icon(Icons.bolt_rounded, color: Color(0xFFA855F7)),
                  SizedBox(width: 8),
                  Text(
                    'Quick Course Shortcuts',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Flexible(
                child: ListView(
                  shrinkWrap: true,
                  children: [
                    _buildNavItem(Icons.build_circle_outlined, 'Setup & Plugins', 'setup-plugins'),
                    _buildNavItem(Icons.person_add_alt_1_outlined, 'Account Creation', 'account-creation'),
                    _buildNavItem(Icons.local_fire_department_outlined, '4-Day Warm Up Plan', 'warmup-roadmap'),
                    _buildNavItem(Icons.group_add_outlined, '1k Followers Roadmap', 'followers-roadmap'),
                    _buildNavItem(Icons.campaign_outlined, 'GIP CPA Campaigns', 'cpa-campaigns'),
                    _buildNavItem(Icons.monetization_on_outlined, 'Payouts & Tax Info', 'payouts-tax'),
                    _buildNavItem(Icons.lightbulb_outline, 'Views & Easy Content Tricks', 'views-tricks'),
                    _buildNavItem(Icons.contact_mail_outlined, 'Contact & Services', 'contact'),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildNavItem(IconData icon, String title, String sectionId) {
    return ListTile(
      leading: Icon(icon, color: const Color(0xFF06B6D4), size: 22),
      title: Text(
        title,
        style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w600),
      ),
      trailing: const Icon(Icons.chevron_right_rounded, color: Colors.white38),
      onTap: () {
        Navigator.pop(context);
        _scrollToSection(sectionId);
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF07070F),
      body: SafeArea(
        child: Stack(
          children: [
            Column(
              children: [
                // Top Custom Header Bar
                if (_showTopBar)
                  Container(
                    height: 56,
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0F0F1E),
                      border: Border(
                        bottom: BorderSide(
                          color: const Color(0xFFA855F7).withOpacity(0.2),
                        ),
                      ),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFFA855F7), Color(0xFF06B6D4)],
                            ),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: const Text(
                            'CBA',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w900,
                              color: Colors.black,
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        const Text(
                          'CheatsByHadi',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                            letterSpacing: -0.5,
                          ),
                        ),
                        const Spacer(),
                        IconButton(
                          icon: const Icon(Icons.refresh_rounded, color: Colors.white70, size: 20),
                          tooltip: 'Refresh Page',
                          onPressed: () {
                            _webViewController?.reload();
                          },
                        ),
                        IconButton(
                          icon: const Icon(Icons.navigation_rounded, color: Color(0xFFA855F7), size: 20),
                          tooltip: 'Quick Menu',
                          onPressed: _showQuickNavigationSheet,
                        ),
                      ],
                    ),
                  ),

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
                      userAgent: "Mozilla/5.0 (Linux; Android 13; Redmi Note 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
                    ),
                    onWebViewCreated: (controller) {
                      _webViewController = controller;
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
                top: _showTopBar ? 56 : 0,
                left: 0,
                right: 0,
                child: LinearProgressIndicator(
                  value: _progress,
                  backgroundColor: Colors.transparent,
                  valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFFA855F7)),
                  minHeight: 3,
                ),
              ),

            // Floating Navigation Pill
            Positioned(
              bottom: 20,
              right: 16,
              child: FloatingActionButton.extended(
                elevation: 6,
                backgroundColor: const Color(0xFF0F0F1E),
                foregroundColor: const Color(0xFFA855F7),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(30),
                  side: BorderSide(color: const Color(0xFFA855F7).withOpacity(0.4)),
                ),
                icon: const Icon(Icons.bolt_rounded, size: 20),
                label: const Text(
                  'Modules',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                ),
                onPressed: _showQuickNavigationSheet,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
