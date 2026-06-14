import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/widgets/avatar_bubble.dart';
import '../../core/widgets/screen_background.dart';

class _FamilyMember {
  final String name;
  final Color color;
  final String status;
  const _FamilyMember(this.name, this.color, this.status);
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final hour = DateTime.now().hour;
    final greeting = hour < 12 ? 'Доброе утро' : hour < 17 ? 'Добрый день' : 'Добрый вечер';

    return ScreenBackground(
      child: Column(
        children: [
          _buildHeader(),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(20, 4, 20, 100),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('$greeting, семья!', style: AppTextStyles.h1),
                  const SizedBox(height: 4),
                  Text('Вот что происходит сегодня.', style: AppTextStyles.bodySm),
                  const SizedBox(height: 14),
                  _buildPriorityCard(),
                  const SizedBox(height: 12),
                  _buildWeatherCard(),
                  const SizedBox(height: 14),
                  _buildSectionHeader('Список покупок', Icons.add),
                  const SizedBox(height: 8),
                  _buildShoppingCard(),
                  const SizedBox(height: 14),
                  _buildSectionHeader('Семья', Icons.chevron_right),
                  const SizedBox(height: 8),
                  _buildFamilyCard(),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      child: Row(
        children: [
          Container(
            width: 30, height: 30,
            decoration: BoxDecoration(
              color: AppColors.accentLight,
              borderRadius: BorderRadius.circular(10),
            ),
            alignment: Alignment.center,
            child: Text('FO', style: GoogleFonts.inter(
              fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.accent,
            )),
          ),
          const SizedBox(width: 8),
          Expanded(child: Text('Family OS', style: GoogleFonts.inter(
            fontSize: 17, fontWeight: FontWeight.w700, color: AppColors.textPrimary,
          ))),
          Container(
            width: 34, height: 34,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.06),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.notifications_outlined, size: 18, color: AppColors.textSecondary),
          ),
        ],
      ),
    );
  }

  Widget _buildPriorityCard() {
    return GlassCard(
      padding: EdgeInsets.zero,
      child: Stack(
        children: [
          // Left accent rail
          Positioned(
            left: 0, top: 0, bottom: 0,
            child: Container(
              width: 3,
              decoration: const BoxDecoration(
                color: AppColors.pink,
                borderRadius: BorderRadius.horizontal(left: Radius.circular(18)),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(18, 14, 14, 14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    _chip('★ ПРИОРИТЕТ', AppColors.pink),
                    const Spacer(),
                    _chip('До 18:00', AppColors.pink),
                  ],
                ),
                const SizedBox(height: 8),
                Text('Купить продукты на ужин', style: GoogleFonts.inter(
                  fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary,
                )),
                const SizedBox(height: 4),
                Text('Молоко, яйца, хлеб и овощи для супа.', style: AppTextStyles.bodySm),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    gradient: AppColors.completeBtnGradient,
                    borderRadius: BorderRadius.circular(99),
                  ),
                  child: Text('Выполнено', style: GoogleFonts.inter(
                    fontSize: 13, fontWeight: FontWeight.w600,
                    color: const Color(0xFF0b1326),
                  )),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _chip(String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.18),
        borderRadius: BorderRadius.circular(99),
        border: Border.all(color: color.withOpacity(0.30)),
      ),
      child: Text(label, style: GoogleFonts.inter(
        fontSize: 11, fontWeight: FontWeight.w600, color: color,
      )),
    );
  }

  Widget _buildWeatherCard() {
    return GlassCard(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('17°C', style: GoogleFonts.inter(
                fontSize: 34, fontWeight: FontWeight.w700, color: AppColors.textPrimary, height: 1.1,
              )),
              Text('☁ Пасмурно', style: AppTextStyles.bodySm),
              Text('Москва', style: AppTextStyles.caption),
            ],
          ),
          const Spacer(),
          Row(
            children: [
              _statCol('3', 'Дел'),
              Container(width: 1, height: 28, color: Colors.white24, margin: const EdgeInsets.symmetric(horizontal: 14)),
              _statCol('1', 'Событие'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _statCol(String value, String label) {
    return Column(
      children: [
        Text(value, style: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.w700, color: AppColors.accent)),
        Text(label, style: AppTextStyles.caption),
      ],
    );
  }

  Widget _buildSectionHeader(String title, IconData icon) {
    return Row(
      children: [
        Text(title, style: AppTextStyles.h3),
        const Spacer(),
        Icon(icon, size: 20, color: AppColors.accent),
      ],
    );
  }

  Widget _buildShoppingCard() {
    const items = ['Молоко 2л', 'Хлеб', 'Яблоки 1кг', 'Сыр'];
    return GlassCard(
      padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
      child: Column(
        children: [
          ...items.map((item) => Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 7),
            child: Row(
              children: [
                Container(
                  width: 18, height: 18,
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.white38, width: 1.5),
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
                const SizedBox(width: 12),
                Text(item, style: AppTextStyles.body),
              ],
            ),
          )),
          const Divider(color: Color(0x14FFFFFF), height: 1),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 4),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('Показать все', style: GoogleFonts.inter(
                  fontSize: 13, color: AppColors.accent, fontWeight: FontWeight.w500,
                )),
                const SizedBox(width: 4),
                const Icon(Icons.arrow_forward, size: 14, color: AppColors.accent),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFamilyCard() {
    const members = [
      _FamilyMember('Мама', Color(0xFFD2BBFF), 'Дома'),
      _FamilyMember('Папа', Color(0xFF7BD0FF), 'Дома'),
      _FamilyMember('Лёня', Color(0xFF34D399), 'Дома'),
    ];
    return GlassCard(
      child: Row(
        children: members.map((m) => Expanded(
          child: Column(
            children: [
              AvatarBubble(name: m.name, color: m.color, size: 36),
              const SizedBox(height: 4),
              Text(m.name, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
              Text(m.status, style: AppTextStyles.caption),
            ],
          ),
        )).toList(),
      ),
    );
  }
}
