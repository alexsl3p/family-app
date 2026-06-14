import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/widgets/screen_background.dart';

class _ShoppingList {
  final String id, name;
  final int checked, total;
  final List<String> items;
  const _ShoppingList({
    required this.id,
    required this.name,
    required this.checked,
    required this.total,
    required this.items,
  });
}

const _lists = [
  _ShoppingList(id: '1', name: 'Продукты', checked: 3, total: 8, items: ['Молоко 2л', 'Хлеб', 'Яблоки 1кг', 'Сыр твёрдый', 'Яйца']),
  _ShoppingList(id: '2', name: 'Аптека', checked: 0, total: 4, items: ['Аспирин', 'Витамин С', 'Пластырь']),
  _ShoppingList(id: '3', name: 'Хозтовары', checked: 1, total: 2, items: ['Лампочки', 'Губки']),
];

class ShoppingScreen extends StatelessWidget {
  const ShoppingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ScreenBackground(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 14),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Покупки', style: AppTextStyles.h1),
                    Text('${_lists.length} списка', style: AppTextStyles.label),
                  ],
                ),
                const Spacer(),
                Container(
                  width: 34, height: 34,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.10),
                    shape: BoxShape.circle,
                    border: Border.all(color: AppColors.glassBorder),
                  ),
                  child: const Icon(Icons.add, color: AppColors.textSecondary, size: 20),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 100),
              itemCount: _lists.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (_, i) => _ShoppingListCard(list: _lists[i]),
            ),
          ),
        ],
      ),
    );
  }
}

class _ShoppingListCard extends StatelessWidget {
  final _ShoppingList list;
  const _ShoppingListCard({required this.list});

  @override
  Widget build(BuildContext context) {
    final progress = list.total > 0 ? list.checked / list.total : 0.0;
    final preview = list.items.take(3).toList();
    final extra = list.items.length - 3;

    return GlassCard(
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 30, height: 30,
                decoration: BoxDecoration(
                  color: AppColors.accentLight,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(Icons.shopping_cart_outlined, color: AppColors.accent, size: 16),
              ),
              const SizedBox(width: 10),
              Text(list.name, style: AppTextStyles.h3),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: list.checked > 0 ? AppColors.accentLight : Colors.white.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(99),
                ),
                child: Text('${list.checked}/${list.total}', style: GoogleFonts.inter(
                  fontSize: 11, fontWeight: FontWeight.w600,
                  color: list.checked > 0 ? AppColors.accent : AppColors.textSecondary,
                )),
              ),
            ],
          ),
          const SizedBox(height: 10),
          // Progress bar
          ClipRRect(
            borderRadius: BorderRadius.circular(99),
            child: LinearProgressIndicator(
              value: progress,
              backgroundColor: Colors.white.withOpacity(0.08),
              valueColor: const AlwaysStoppedAnimation<Color>(AppColors.accent),
              minHeight: 3,
            ),
          ),
          const SizedBox(height: 10),
          ...preview.map((item) => Padding(
            padding: const EdgeInsets.only(bottom: 4),
            child: Row(
              children: [
                const Text('• ', style: TextStyle(color: AppColors.textMuted)),
                Text(item, style: AppTextStyles.body),
              ],
            ),
          )),
          if (extra > 0)
            Text('ещё $extra...', style: AppTextStyles.caption.copyWith(
              fontStyle: FontStyle.italic,
            )),
        ],
      ),
    );
  }
}
