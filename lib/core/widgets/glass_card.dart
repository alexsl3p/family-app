import 'dart:ui';
import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class GlassCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final double borderRadius;
  final Color? backgroundColor;
  final bool applyBlur;

  const GlassCard({
    super.key,
    required this.child,
    this.padding,
    this.borderRadius = 18,
    this.backgroundColor,
    this.applyBlur = true,
  });

  @override
  Widget build(BuildContext context) {
    final bg = backgroundColor ?? AppColors.surfaceStrong;
    return ClipRRect(
      borderRadius: BorderRadius.circular(borderRadius),
      child: BackdropFilter(
        filter: applyBlur
            ? ImageFilter.blur(sigmaX: 16, sigmaY: 16)
            : ImageFilter.blur(sigmaX: 0, sigmaY: 0),
        child: Container(
          padding: padding ?? const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: bg,
            borderRadius: BorderRadius.circular(borderRadius),
            border: Border.all(color: const Color(0x28FFFFFF), width: 1),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.50),
                blurRadius: 32,
                offset: const Offset(0, 12),
              ),
              BoxShadow(
                color: const Color(0xFF8B35FF).withOpacity(0.06),
                blurRadius: 16,
                offset: const Offset(0, 0),
              ),
            ],
          ),
          child: child,
        ),
      ),
    );
  }
}
