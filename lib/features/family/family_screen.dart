import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/widgets/avatar_bubble.dart';
import '../../core/widgets/status_chip.dart';
import '../../core/widgets/screen_background.dart';

class _Member {
  final String name, status;
  final Color color;
  final bool isCreator;
  const _Member({required this.name, required this.color, required this.status, required this.isCreator});
}

const _members = [
  _Member(name: 'Мама', color: Color(0xFFD2BBFF), status: 'Дома', isCreator: true),
  _Member(name: 'Папа', color: Color(0xFF7BD0FF), status: 'Дома', isCreator: false),
  _Member(name: 'Лёня', color: Color(0xFF34D399), status: 'В школе', isCreator: false),
  _Member(name: 'Маша', color: Color(0xFFF48DD2), status: 'Дома', isCreator: false),
];

Color _statusColor(String s) {
  if (s == 'На работе') return AppColors.green;
  if (s == 'В школе') return AppColors.yellow;
  if (s == 'Дома') return AppColors.textMuted;
  return AppColors.accent;
}

class FamilyScreen extends StatelessWidget {
  const FamilyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ScreenBackground(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 4),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Семья', style: AppTextStyles.h1),
                Text('Family OS', style: AppTextStyles.label),
              ],
            ),
          ),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(20, 12, 20, 100),
              children: [
                // Family hub card
                GlassCard(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  child: Row(
                    children: [
                      SizedBox(
                        width: 32.0 * _members.length - 10.0 * (_members.length - 1),
                        height: 32,
                        child: Stack(
                          children: _members.asMap().entries.map((e) {
                            return Positioned(
                              left: e.key * 22.0,
                              child: Container(
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  border: Border.all(color: const Color(0xFF12192D), width: 1.5),
                                ),
                                child: AvatarBubble(name: e.value.name, color: e.value.color, size: 32),
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Наша семья', style: GoogleFonts.inter(
                            fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.textPrimary,
                          )),
                          Text('${_members.length} участника', style: AppTextStyles.label),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                // Invite code
                GlassCard(
                  padding: const EdgeInsets.all(14),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('КОД ПРИГЛАШЕНИЯ', style: AppTextStyles.labelSm.copyWith(letterSpacing: 0.8)),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          Text('A7K9Q2PM', style: GoogleFonts.inter(
                            fontSize: 20, fontWeight: FontWeight.w700,
                            color: AppColors.accent, letterSpacing: 4,
                          )),
                          const Spacer(),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 6),
                            decoration: BoxDecoration(
                              color: AppColors.accentLight,
                              borderRadius: BorderRadius.circular(99),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.copy_outlined, size: 13, color: AppColors.accent),
                                const SizedBox(width: 5),
                                Text('Копировать', style: GoogleFonts.inter(
                                  fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.accent,
                                )),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text('Поделитесь кодом, чтобы пригласить в семью', style: AppTextStyles.caption),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                Text('Участники', style: AppTextStyles.h3),
                const SizedBox(height: 8),
                GlassCard(
                  padding: EdgeInsets.zero,
                  child: Column(
                    children: _members.asMap().entries.map((e) {
                      final i = e.key; final m = e.value;
                      return Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                        decoration: i < _members.length - 1
                            ? const BoxDecoration(border: Border(bottom: BorderSide(color: Color(0x0FFFFFFF))))
                            : null,
                        child: Row(
                          children: [
                            AvatarBubble(name: m.name, color: m.color, size: 38),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Text(m.name, style: GoogleFonts.inter(
                                        fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary,
                                      )),
                                      if (m.isCreator) ...[
                                        const SizedBox(width: 4),
                                        const Icon(Icons.star, size: 12, color: AppColors.yellow),
                                      ],
                                    ],
                                  ),
                                  const SizedBox(height: 3),
                                  StatusChip(label: m.status, color: _statusColor(m.status)),
                                ],
                              ),
                            ),
                            Container(
                              width: 30, height: 30,
                              decoration: BoxDecoration(
                                color: AppColors.accentLight, shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.calendar_today_outlined, size: 14, color: AppColors.accent),
                            ),
                            const SizedBox(width: 6),
                            const Icon(Icons.chevron_right, size: 16, color: AppColors.textMuted),
                          ],
                        ),
                      );
                    }).toList(),
                  ),
                ),
                const SizedBox(height: 20),
                GestureDetector(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.exit_to_app_outlined, size: 18, color: AppColors.error),
                      const SizedBox(width: 8),
                      Text('Выйти из семьи', style: GoogleFonts.inter(
                        fontSize: 15, color: AppColors.error, fontWeight: FontWeight.w500,
                      )),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
