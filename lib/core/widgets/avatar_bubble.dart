import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AvatarBubble extends StatelessWidget {
  final String name;
  final Color color;
  final double size;

  const AvatarBubble({
    super.key,
    required this.name,
    required this.color,
    this.size = 40,
  });

  @override
  Widget build(BuildContext context) {
    final initials = name.isNotEmpty ? name[0].toUpperCase() : '?';
    return Container(
      width: size, height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: color.withOpacity(0.25),
        border: Border.all(color: color.withOpacity(0.5), width: 1.5),
      ),
      alignment: Alignment.center,
      child: Text(
        initials,
        style: GoogleFonts.inter(
          fontSize: size * 0.38,
          fontWeight: FontWeight.w700,
          color: color,
        ),
      ),
    );
  }
}
