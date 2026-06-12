import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  static const Color bg1 = Color(0xFFDCE8FF);
  static const Color bg2 = Color(0xFFE8D9FF);
  static const Color bg3 = Color(0xFFD9EEFF);

  static const Color primary = Color(0xFF6E5FFF);
  static const Color primaryLight = Color(0xFF9B8FFF);
  static const Color accent = Color(0xFF3DCFCF);
  static const Color pink = Color(0xFFFF6B9D);

  static const Color glassWhite = Color(0xFFFFFFFF);
  static const Color glassBorder = Color(0xFFFFFFFF);

  static const Color textPrimary = Color(0xFF1C1C3A);
  static const Color textSecondary = Color(0xFF6B7A99);
  static const Color textLight = Color(0xFFA0AABB);

  static const Color success = Color(0xFF4CD97B);
  static const Color warning = Color(0xFFFFB347);
  static const Color error = Color(0xFFFF5C7A);

  static const List<Color> memberColors = [
    Color(0xFF6E5FFF),
    Color(0xFFFF6B9D),
    Color(0xFF3DCFCF),
    Color(0xFFFFB347),
    Color(0xFF5DB8FF),
    Color(0xFFD87BFF),
  ];
}

class AppTheme {
  static ThemeData get theme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.primary,
        brightness: Brightness.light,
      ),
      textTheme: GoogleFonts.interTextTheme(),
      scaffoldBackgroundColor: Colors.transparent,
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: GoogleFonts.inter(
          fontSize: 26,
          fontWeight: FontWeight.w800,
          color: AppColors.textPrimary,
        ),
        iconTheme: const IconThemeData(color: AppColors.textPrimary),
      ),
    );
  }

  static BoxDecoration get backgroundDecoration => const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [AppColors.bg1, AppColors.bg2, AppColors.bg3],
          stops: [0.0, 0.5, 1.0],
        ),
      );
}
