import 'dart:ui';
import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class GlassCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final double blur;
  final double opacity;
  final double borderRadius;
  final Color? color;
  final VoidCallback? onTap;
  final double? width;
  final double? height;

  const GlassCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(16),
    this.margin,
    this.blur = 16,
    this.opacity = 0.28,
    this.borderRadius = 20,
    this.color,
    this.onTap,
    this.width,
    this.height,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: width,
        height: height,
        margin: margin,
        child: ClipRRect(
          borderRadius: BorderRadius.circular(borderRadius),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: blur, sigmaY: blur),
            child: Container(
              decoration: BoxDecoration(
                color: (color ?? Colors.white).withOpacity(opacity),
                borderRadius: BorderRadius.circular(borderRadius),
                border: Border.all(
                  color: Colors.white.withOpacity(0.55),
                  width: 1.5,
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.06),
                    blurRadius: 20,
                    offset: const Offset(0, 6),
                  ),
                  BoxShadow(
                    color: Colors.white.withOpacity(0.5),
                    blurRadius: 1,
                    offset: const Offset(0, 1),
                  ),
                ],
              ),
              padding: padding,
              child: child,
            ),
          ),
        ),
      ),
    );
  }
}

class GlassButton extends StatelessWidget {
  final String label;
  final VoidCallback onTap;
  final IconData? icon;
  final bool isPrimary;
  final bool isLoading;
  final double? width;

  const GlassButton({
    super.key,
    required this.label,
    required this.onTap,
    this.icon,
    this.isPrimary = true,
    this.isLoading = false,
    this.width,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: isLoading ? null : onTap,
      child: Container(
        width: width ?? double.infinity,
        height: 56,
        decoration: BoxDecoration(
          gradient: isPrimary
              ? const LinearGradient(
                  colors: [Color(0xFF6E5FFF), Color(0xFF9B8FFF)],
                  begin: Alignment.centerLeft,
                  end: Alignment.centerRight,
                )
              : null,
          color: isPrimary ? null : Colors.white.withOpacity(0.35),
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: isPrimary
                ? Colors.transparent
                : Colors.white.withOpacity(0.6),
            width: 1.5,
          ),
          boxShadow: isPrimary
              ? [
                  BoxShadow(
                    color: AppColors.primary.withOpacity(0.35),
                    blurRadius: 20,
                    offset: const Offset(0, 8),
                  ),
                ]
              : [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
        ),
        child: Center(
          child: isLoading
              ? const SizedBox(
                  width: 22,
                  height: 22,
                  child: CircularProgressIndicator(
                    color: Colors.white,
                    strokeWidth: 2.5,
                  ),
                )
              : Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (icon != null) ...[
                      Icon(
                        icon,
                        color:
                            isPrimary ? Colors.white : AppColors.textPrimary,
                        size: 20,
                      ),
                      const SizedBox(width: 8),
                    ],
                    Text(
                      label,
                      style: TextStyle(
                        color: isPrimary ? Colors.white : AppColors.textPrimary,
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 0.2,
                      ),
                    ),
                  ],
                ),
        ),
      ),
    );
  }
}
