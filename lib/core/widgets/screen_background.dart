import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class ScreenBackground extends StatelessWidget {
  final Widget child;
  const ScreenBackground({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Base background
        Container(color: AppColors.bg),
        // Purple glow — top left
        Positioned(
          top: -80, left: -60,
          child: Container(
            width: 300, height: 300,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(
                colors: [
                  const Color(0xFF8B35FF).withOpacity(0.18),
                  Colors.transparent,
                ],
              ),
            ),
          ),
        ),
        // Blue glow — bottom right
        Positioned(
          bottom: 60, right: -50,
          child: Container(
            width: 220, height: 220,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(
                colors: [
                  const Color(0xFF5B9DFF).withOpacity(0.12),
                  Colors.transparent,
                ],
              ),
            ),
          ),
        ),
        // Content
        SafeArea(child: child),
      ],
    );
  }
}
