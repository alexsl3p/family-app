import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/widgets/screen_background.dart';

class _Item {
  final String title, meta;
  final bool checked;
  const _Item({required this.title, required this.meta, required this.checked});
  _Item copyWith({bool? checked}) => _Item(title: title, meta: meta, checked: checked ?? this.checked);
}

class ShoppingDetailScreen extends StatefulWidget {
  final String listId;
  const ShoppingDetailScreen({super.key, required this.listId});

  @override
  State<ShoppingDetailScreen> createState() => _ShoppingDetailScreenState();
}

class _ShoppingDetailScreenState extends State<ShoppingDetailScreen> {
  List<_Item> _items = const [
    _Item(title: 'Молоко 2л', meta: '2 шт · добавил(а) Мама', checked: false),
    _Item(title: 'Яблоки', meta: '1 кг · добавил(а) Мама', checked: false),
    _Item(title: 'Сыр твёрдый', meta: '300 г · добавил(а) Папа', checked: false),
    _Item(title: 'Хлеб белый', meta: '1 шт · купил(а) Мама', checked: true),
    _Item(title: 'Йогурт', meta: '4 шт · купил(а) Папа', checked: true),
  ];

  @override
  Widget build(BuildContext context) {
    final needed = _items.where((i) => !i.checked).toList();
    final bought = _items.where((i) => i.checked).toList();
    final progress = _items.isEmpty ? 0.0 : bought.length / _items.length;

    return ScreenBackground(
      child: Column(
        children: [
          // Header
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 10),
            child: Row(
              children: [
                GestureDetector(
                  onTap: () => Navigator.pop(context),
                  child: const Icon(Icons.arrow_back, color: AppColors.textPrimary),
                ),
                const Spacer(),
                Text('Продукты', style: AppTextStyles.h2),
                const Spacer(),
                Container(
                  width: 34, height: 34,
                  decoration: BoxDecoration(
                    color: AppColors.accentLight, shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.add, color: AppColors.accent, size: 20),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('${bought.length} из ${_items.length} куплено', style: AppTextStyles.bodySm),
                const SizedBox(height: 8),
                ClipRRect(
                  borderRadius: BorderRadius.circular(99),
                  child: LinearProgressIndicator(
                    value: progress,
                    backgroundColor: Colors.white.withOpacity(0.08),
                    valueColor: const AlwaysStoppedAnimation(AppColors.accent),
                    minHeight: 3,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 100),
              children: [
                Text('НУЖНО КУПИТЬ', style: AppTextStyles.labelSm.copyWith(letterSpacing: 0.8)),
                const SizedBox(height: 8),
                GlassCard(
                  padding: EdgeInsets.zero,
                  child: Column(
                    children: needed.asMap().entries.map((e) {
                      final i = e.key; final item = e.value;
                      return _ItemRow(
                        item: item,
                        showDivider: i < needed.length - 1,
                        onTap: () => setState(() {
                          final idx = _items.indexOf(item);
                          _items = List.of(_items)..[idx] = item.copyWith(checked: true);
                        }),
                      );
                    }).toList(),
                  ),
                ),
                if (bought.isNotEmpty) ...[
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Text('КУПЛЕНО', style: AppTextStyles.labelSm.copyWith(letterSpacing: 0.8)),
                      const Spacer(),
                      GestureDetector(
                        onTap: () {},
                        child: Row(
                          children: [
                            const Icon(Icons.delete_outline, size: 14, color: AppColors.error),
                            const SizedBox(width: 4),
                            Text('Очистить купленное', style: GoogleFonts.inter(
                              fontSize: 12, color: AppColors.error,
                            )),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  GlassCard(
                    padding: EdgeInsets.zero,
                    child: Column(
                      children: bought.asMap().entries.map((e) {
                        final i = e.key; final item = e.value;
                        return _ItemRow(item: item, showDivider: i < bought.length - 1);
                      }).toList(),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ItemRow extends StatelessWidget {
  final _Item item;
  final bool showDivider;
  final VoidCallback? onTap;

  const _ItemRow({required this.item, required this.showDivider, this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: showDivider
            ? const BoxDecoration(border: Border(bottom: BorderSide(color: Color(0x0FFFFFFF))))
            : null,
        child: Row(
          children: [
            Container(
              width: 26, height: 26,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: item.checked ? AppColors.greenLight : Colors.transparent,
                border: Border.all(
                  color: item.checked ? AppColors.green : Colors.white38,
                  width: 1.5,
                ),
              ),
              child: item.checked
                  ? const Icon(Icons.check, size: 14, color: AppColors.green)
                  : null,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.title,
                    style: GoogleFonts.inter(
                      fontSize: 15, fontWeight: FontWeight.w500,
                      color: item.checked ? AppColors.textMuted : AppColors.textPrimary,
                      decoration: item.checked ? TextDecoration.lineThrough : null,
                      decorationColor: AppColors.textMuted,
                    ),
                  ),
                  Text(item.meta, style: AppTextStyles.caption),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
