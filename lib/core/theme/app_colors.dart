import 'package:flutter/material.dart';

class AppColors {
  // Backgrounds
  static const bg = Color(0xFF070B18);
  static const surface = Color(0xFF131C30);       // surface-container-low
  static const surfaceStrong = Color(0xFF1C2540); // surface-container — карточки
  static const surface2 = Color(0xFF232D4A);      // surface-container-high

  // Borders
  static const glassBorder = Color(0x14FFFFFF);   // rgba(255,255,255,0.08)
  static const glassBorderStrong = Color(0x28C7ADFF); // rgba(199,173,255,0.16)
  static const glassDivider = Color(0x0FFFFFFF);  // rgba(255,255,255,0.06)

  // Text
  static const textPrimary = Color(0xFFF2F0F8);
  static const textSecondary = Color(0xFFA8A2B8);
  static const textMuted = Color(0xFF77738A);

  // Accent purple
  static const accent = Color(0xFF8B35FF);
  static const accent2 = Color(0xFFE06CFF);
  static const accentLight = Color(0x2E8B35FF);   // rgba(139,53,255,0.18)

  // Pink
  static const pink = Color(0xFFF48DD2);
  static const pinkLight = Color(0x2EF48DD2);

  // Blue (tertiary / info)
  static const blue = Color(0xFF5B9DFF);
  static const blueLight = Color(0x2E5B9DFF);

  // Status
  static const green = Color(0xFF32D692);
  static const greenLight = Color(0x2032D692);
  static const yellow = Color(0xFFFFCC4A);
  static const yellowLight = Color(0x20FFCC4A);
  static const error = Color(0xFFFF6B6B);
  static const errorLight = Color(0x20FF6B6B);

  // Nav
  static const tabBar = Color(0xF5070B18);        // rgba(7,11,24,0.96)
  static const tabBarBorder = Color(0x14FFFFFF);
  static const tabBarActive = Colors.white;
  static const tabBarActiveContainer = Color(0xFF8B35FF);
  static const tabBarInactive = Color(0xFF77738A);

  // Gradients
  static const accentGradient = LinearGradient(
    colors: [Color(0xFF8B35FF), Color(0xFFE06CFF)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  static const completeBtnGradient = LinearGradient(
    colors: [Color(0xFFD2BBFF), Color(0xFFF48DD2)],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );

  // Tag colors for tasks
  static const tagShopping = Color(0xFF60A5FA);
  static const tagKids = Color(0xFF4ADE80);
  static const tagFinance = Color(0xFFFFBF24);
  static const tagHome = Color(0xFFC084FC);
  static const tagWork = Color(0xFFF87171);
  static const tagPets = Color(0xFF34D399);
}
