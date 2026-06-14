import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

class AppTextStyles {
  static TextStyle get display => GoogleFonts.inter(
    fontSize: 34, fontWeight: FontWeight.w800,
    color: AppColors.textPrimary, letterSpacing: -0.8,
  );
  static TextStyle get h1 => GoogleFonts.inter(
    fontSize: 22, fontWeight: FontWeight.w700,
    color: AppColors.textPrimary, letterSpacing: -0.4,
  );
  static TextStyle get h2 => GoogleFonts.inter(
    fontSize: 18, fontWeight: FontWeight.w700,
    color: AppColors.textPrimary, letterSpacing: -0.3,
  );
  static TextStyle get h3 => GoogleFonts.inter(
    fontSize: 16, fontWeight: FontWeight.w600,
    color: AppColors.textPrimary,
  );
  static TextStyle get bodyLg => GoogleFonts.inter(
    fontSize: 15, fontWeight: FontWeight.w400,
    color: AppColors.textPrimary,
  );
  static TextStyle get body => GoogleFonts.inter(
    fontSize: 14, fontWeight: FontWeight.w400,
    color: AppColors.textPrimary,
  );
  static TextStyle get bodySm => GoogleFonts.inter(
    fontSize: 13, fontWeight: FontWeight.w400,
    color: AppColors.textSecondary,
  );
  static TextStyle get labelLg => GoogleFonts.inter(
    fontSize: 14, fontWeight: FontWeight.w500,
    color: AppColors.textPrimary,
  );
  static TextStyle get label => GoogleFonts.inter(
    fontSize: 12, fontWeight: FontWeight.w500,
    color: AppColors.textSecondary,
  );
  static TextStyle get labelSm => GoogleFonts.inter(
    fontSize: 11, fontWeight: FontWeight.w500,
    color: AppColors.textMuted,
  );
  static TextStyle get caption => GoogleFonts.inter(
    fontSize: 11, fontWeight: FontWeight.w400,
    color: AppColors.textMuted,
  );
}
