import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class ScreenBackground extends StatelessWidget {
  final Widget child;
  const ScreenBackground({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Stack(
      fit: StackFit.expand,
      children: [
        // Base background
        Container(color: AppColors.bg),
        // Purple orb — top left
        Positioned(
          top: -100, left: -80,
          child: Container(
            width: 380, height: 380,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(
                colors: [
                  const Color(0xFF8B35FF).withOpacity(0.28),
                  Colors.transparent,
                ],
              ),
            ),
          ),
        ),
        // Pink orb — top right
        Positioned(
          top: 60, right: -60,
          child: Container(
            width: 200, height: 200,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(
                colors: [
                  const Color(0xFFF48DD2).withOpacity(0.14),
                  Colors.transparent,
                ],
              ),
            ),
          ),
        ),
        // Blue orb — bottom right
        Positioned(
          bottom: 80, right: -40,
          child: Container(
            width: 260, height: 260,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(
                colors: [
                  const Color(0xFF5B9DFF).withOpacity(0.18),
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
