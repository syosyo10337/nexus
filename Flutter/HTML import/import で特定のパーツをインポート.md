 

# import で特定のパーツをインポート

show/hideキーワードを使う。

```Dart
import 'package:barcode/barcode.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_svg/svg.dart';
import 'package:zas_cityhall_square/model/coupon.dart';
import 'package:zas_cityhall_square/providers.dart'
    show interstitialAdProvider, couponProvider, CouponNotifier, InterstitialAdNotifier;
import 'package:zas_cityhall_square/util/app_colors.dart';
import 'package:zas_cityhall_square/util/date_util.dart';
import 'package:zas_cityhall_square/util/url_util.dart';
import 'package:zas_cityhall_square/widgets/commons/badge_label.dart';
import 'package:zas_cityhall_square/widgets/commons/error_image.dart';
import 'package:zas_cityhall_square/widgets/commons/error_text.dart';
import 'package:zas_cityhall_square/widgets/commons/headline.dart';
import 'package:zas_cityhall_square/widgets/commons/loader.dart';
import 'package:zas_cityhall_square/widgets/commons/page_wrapper.dart';
import 'package:zas_cityhall_square/widgets/commons/paragraph.dart';
import 'package:zas_cityhall_square/widgets/commons/space.dart';
import 'package:zas_cityhall_square/widgets/coupon/coupon_button.dart';
```