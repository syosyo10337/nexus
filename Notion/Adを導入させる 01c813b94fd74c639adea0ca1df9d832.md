 

# Adを導入させる

```Dart
import 'package:google_mobile_ads/google_mobile_ads.dart';

class AdManager {
  InterstitialAd? _interstitialAd;

  void loadInterstitialAd() {
    InterstitialAd.load(
      adUnitId: AdHelper.interstitialAdUnitId,
      request: AdRequest(),
      adLoadCallback: InterstitialAdLoadCallback(
        onAdLoaded: (ad) {
          _interstitialAd = ad;
        },
        onAdFailedToLoad: (err) {
          print('Failed to load an interstitial ad: ${err.message}');
        },
      ),
    );
  }

  void showInterstitialAd(Function onAdDismissed) {
    if (_interstitialAd != null) {
      _interstitialAd!.fullScreenContentCallback = FullScreenContentCallback(
        onAdDismissedFullScreenContent: (ad) {
          onAdDismissed();
        },
      );
      _interstitialAd!.show();
    } else {
      onAdDismissed();
    }
  }

  void disposeInterstitialAd() {
    _interstitialAd?.dispose();
  }
}
```

```Dart
import 'package:your_project/ad_manager.dart';

class _GameRouteState extends State<GameRoute> implements QuizEventListener {
  final AdManager _adManager = AdManager();

  ...

  @override
  void onNewLevel(int level, Drawing drawing, String clue) {
    ...

    if (level >= 3) {
      _adManager.loadInterstitialAd();
    }
  }

  @override
  void onGameOver(int correctAnswers) {
    showDialog(
      context: _scaffoldKey.currentContext,
      builder: (context) {
        return AlertDialog(
          title: Text('Game over!'),
          content: Text('Score: $correctAnswers/5'),
          actions: [
            FlatButton(
              child: Text('close'.toUpperCase()),
              onPressed: () {
                _adManager.showInterstitialAd(_moveToHome);
              },
            ),
          ],
        );
      },
    );
  }

  @override
  void dispose() {
    _adManager.disposeInterstitialAd();

    super.dispose();
  }
}
```