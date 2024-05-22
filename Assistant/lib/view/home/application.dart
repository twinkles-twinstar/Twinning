import '/common.dart';
import '/setting.dart';
import '/view/home/main_page.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:dynamic_color/dynamic_color.dart';

// ----------------

class Application extends StatelessWidget {

  const Application({
    super.key,
    required this.setting,
    required this.navigator,
  });

  // ----------------

  final SettingProvider           setting;
  final GlobalKey<NavigatorState> navigator;

  // ----------------

  @override
  build(context) {
    return ChangeNotifierProvider.value(
      value: this.setting,
      child: Consumer<SettingProvider>(
        builder: (context, setting, _) => DynamicColorBuilder(
          builder: (lightColor, darkColor) => MaterialApp(
            navigatorKey: this.navigator,
            title: kApplicationName,
            theme: ThemeData(
              brightness: Brightness.light,
              colorScheme: setting.data.mThemeColorState ? null : lightColor,
              colorSchemeSeed: !setting.data.mThemeColorState ? null : setting.data.mThemeColorLight,
              scaffoldBackgroundColor: setting.data.mThemeColorState ? null : lightColor?.surface,
              fontFamily: '',
              fontFamilyFallback: [...setting.state.mThemeFontFamliy],
              materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
            ),
            darkTheme: ThemeData(
              brightness: Brightness.dark,
              colorScheme: setting.data.mThemeColorState ? null : darkColor,
              colorSchemeSeed: !setting.data.mThemeColorState ? null : setting.data.mThemeColorDark,
              scaffoldBackgroundColor: setting.data.mThemeColorState ? null : darkColor?.surface,
              fontFamily: '',
              fontFamilyFallback: [...setting.state.mThemeFontFamliy],
              materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
            ),
            themeMode: setting.data.mThemeMode,
            home: const MainPage(),
          ),
        ),
      ),
    );
  }

}
