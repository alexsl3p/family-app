import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../theme/app_theme.dart';
import '../../widgets/glass_card.dart';
import '../../providers/auth_provider.dart';
import '../../providers/shopping_provider.dart';
import '../../models/shopping.dart';

class ShoppingScreen extends StatefulWidget {
  const ShoppingScreen({super.key});

  @override
  State<ShoppingScreen> createState() => _ShoppingScreenState();
}

class _ShoppingScreenState extends State<ShoppingScreen> {
  String? _activeListId;

  @override
  Widget build(BuildContext context) {
    final shopping = context.watch<ShoppingProvider>();

    if (_activeListId != null &&
        !shopping.lists.any((l) => l.id == _activeListId)) {
      _activeListId = null;
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Header
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Покупки',
                style: TextStyle(
                  fontSize: 30,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textPrimary,
                  letterSpacing: -0.8,
                ),
              ),
              GestureDetector(
                onTap: () => _showCreateList(context),
                child: Container(
                  width: 42,
                  height: 42,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF3DCFCF), Color(0xFF5DB8FF)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(14),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.accent.withOpacity(0.35),
                        blurRadius: 14,
                        offset: const Offset(0, 5),
                      ),
                    ],
                  ),
                  child: const Icon(Icons.add_rounded,
                      color: Colors.white, size: 24),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // List selector chips
        if (shopping.lists.isNotEmpty) ...[
          SizedBox(
            height: 42,
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              scrollDirection: Axis.horizontal,
              itemCount: shopping.lists.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (_, i) {
                final list = shopping.lists[i];
                final selected = _activeListId == list.id ||
                    (_activeListId == null && i == 0);
                return GestureDetector(
                  onTap: () => setState(() => _activeListId = list.id),
                  onLongPress: () => _confirmDeleteList(context, list),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      gradient: selected
                          ? const LinearGradient(
                              colors: [Color(0xFF3DCFCF), Color(0xFF5DB8FF)],
                            )
                          : null,
                      color: selected ? null : Colors.white.withOpacity(0.35),
                      borderRadius: BorderRadius.circular(22),
                      border: Border.all(
                        color: selected
                            ? Colors.transparent
                            : Colors.white.withOpacity(0.6),
                        width: 1.5,
                      ),
                      boxShadow: selected
                          ? [
                              BoxShadow(
                                color: AppColors.accent.withOpacity(0.3),
                                blurRadius: 10,
                                offset: const Offset(0, 4),
                              )
                            ]
                          : [],
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text('🛒',
                            style: TextStyle(
                                fontSize: selected ? 14 : 13)),
                        const SizedBox(width: 6),
                        Text(
                          list.name,
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: selected
                                ? Colors.white
                                : AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 8),
        ],

        Expanded(
          child: shopping.lists.isEmpty
              ? _EmptyState(onAdd: () => _showCreateList(context))
              : _ShoppingListView(
                  list: shopping.lists.firstWhere(
                    (l) =>
                        l.id == _activeListId ||
                        (_activeListId == null &&
                            l.id == shopping.lists.first.id),
                    orElse: () => shopping.lists.first,
                  ),
                ),
        ),
      ],
    );
  }

  void _showCreateList(BuildContext context) {
    final ctrl = TextEditingController();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              AppColors.bg1.withOpacity(0.98),
              AppColors.bg2.withOpacity(0.98),
            ],
          ),
          borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
          border: const Border(
            top: BorderSide(color: Colors.white, width: 1.5),
            left: BorderSide(color: Colors.white, width: 1.5),
            right: BorderSide(color: Colors.white, width: 1.5),
          ),
        ),
        padding: EdgeInsets.only(
          left: 24,
          right: 24,
          top: 16,
          bottom: MediaQuery.of(context).viewInsets.bottom + 28,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 44,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.textLight.withOpacity(0.4),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 22),
            const Text('Новый список',
                style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textPrimary)),
            const SizedBox(height: 20),
            ClipRRect(
              borderRadius: BorderRadius.circular(14),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                child: TextField(
                  controller: ctrl,
                  autofocus: true,
                  style: const TextStyle(
                      color: AppColors.textPrimary,
                      fontWeight: FontWeight.w500),
                  decoration: InputDecoration(
                    hintText: 'Название списка',
                    hintStyle: const TextStyle(color: AppColors.textLight),
                    filled: true,
                    fillColor: Colors.white.withOpacity(0.35),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: BorderSide(
                          color: Colors.white.withOpacity(0.5), width: 1.5),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: BorderSide(
                          color: Colors.white.withOpacity(0.5), width: 1.5),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: BorderSide(
                          color: AppColors.accent.withOpacity(0.6),
                          width: 2),
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 14),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),
            GlassButton(
              label: 'Создать',
              onTap: () async {
                if (ctrl.text.trim().isEmpty) return;
                final auth = context.read<AuthProvider>();
                final newList = await context
                    .read<ShoppingProvider>()
                    .createList(ctrl.text.trim(), createdBy: auth.memberId);
                setState(() => _activeListId = newList.id);
                if (mounted) Navigator.pop(context);
              },
            ),
          ],
        ),
      ),
    );
  }

  void _confirmDeleteList(BuildContext context, ShoppingList list) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Удалить список?'),
        content: Text('«${list.name}» будет удалён со всеми товарами.'),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Отмена')),
          TextButton(
            onPressed: () {
              context.read<ShoppingProvider>().deleteList(list.id);
              Navigator.pop(context);
            },
            child: const Text('Удалить',
                style: TextStyle(color: AppColors.error)),
          ),
        ],
      ),
    );
  }
}

class _ShoppingListView extends StatelessWidget {
  final ShoppingList list;
  const _ShoppingListView({required this.list});

  @override
  Widget build(BuildContext context) {
    final shopping = context.watch<ShoppingProvider>();
    final auth = context.watch<AuthProvider>();
    final items = shopping.itemsFor(list.id);
    final pending = items.where((i) => !i.isBought).toList();
    final bought = items.where((i) => i.isBought).toList();
    final total = shopping.totalFor(list.id);

    return CustomScrollView(
      physics: const BouncingScrollPhysics(),
      slivers: [
        // Total + Add button
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(20, 4, 20, 8),
            child: Row(
              children: [
                if (total > 0) ...[
                  Expanded(
                    child: GlassCard(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 13),
                      color: AppColors.accent,
                      opacity: 0.14,
                      child: Row(
                        children: [
                          Container(
                            width: 32,
                            height: 32,
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(
                                colors: [
                                  Color(0xFF3DCFCF),
                                  Color(0xFF5DB8FF)
                                ],
                              ),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: const Center(
                                child: Text('💰',
                                    style: TextStyle(fontSize: 16))),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Итого',
                                  style: TextStyle(
                                      color: AppColors.textSecondary,
                                      fontSize: 11,
                                      fontWeight: FontWeight.w500),
                                ),
                                Text(
                                  '${total.toStringAsFixed(0)} ₽',
                                  style: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w800,
                                    color: AppColors.accent,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                ],
                GestureDetector(
                  onTap: () =>
                      _showAddItem(context, list.id, auth.memberId),
                  child: Container(
                    width: total > 0 ? 52 : double.infinity,
                    height: 56,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF6E5FFF), Color(0xFF9B8FFF)],
                      ),
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.primary.withOpacity(0.3),
                          blurRadius: 12,
                          offset: const Offset(0, 5),
                        ),
                      ],
                    ),
                    child: total > 0
                        ? const Icon(Icons.add_rounded,
                            color: Colors.white, size: 26)
                        : Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: const [
                              Icon(Icons.add_rounded,
                                  color: Colors.white, size: 22),
                              SizedBox(width: 6),
                              Text(
                                'Добавить товар',
                                style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600),
                              ),
                            ],
                          ),
                  ),
                ),
              ],
            ),
          ),
        ),

        if (pending.isEmpty && bought.isEmpty)
          const SliverFillRemaining(
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text('🛒', style: TextStyle(fontSize: 56)),
                  SizedBox(height: 12),
                  Text('Список пустой',
                      style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textSecondary)),
                  SizedBox(height: 6),
                  Text('Нажмите + чтобы добавить товар',
                      style: TextStyle(color: AppColors.textLight)),
                ],
              ),
            ),
          ),

        if (pending.isNotEmpty)
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (_, i) => _ItemTile(
                  item: pending[i],
                  listId: list.id,
                  memberId: auth.memberId),
              childCount: pending.length,
            ),
          ),

        if (bought.isNotEmpty) ...[
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
              child: Row(
                children: [
                  const Icon(Icons.check_circle_rounded,
                      size: 14, color: AppColors.success),
                  const SizedBox(width: 6),
                  Text(
                    'Куплено (${bought.length})',
                    style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: AppColors.success),
                  ),
                ],
              ),
            ),
          ),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (_, i) => _ItemTile(
                  item: bought[i],
                  listId: list.id,
                  memberId: auth.memberId),
              childCount: bought.length,
            ),
          ),
        ],
        const SliverToBoxAdapter(child: SizedBox(height: 110)),
      ],
    );
  }

  void _showAddItem(
      BuildContext context, String listId, String? memberId) {
    final nameCtrl = TextEditingController();
    final qtyCtrl = TextEditingController();
    final priceCtrl = TextEditingController();
    String? category;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => StatefulBuilder(builder: (ctx, setModalState) {
        return Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                AppColors.bg1.withOpacity(0.98),
                AppColors.bg2.withOpacity(0.98),
              ],
            ),
            borderRadius:
                const BorderRadius.vertical(top: Radius.circular(32)),
            border: const Border(
              top: BorderSide(color: Colors.white, width: 1.5),
              left: BorderSide(color: Colors.white, width: 1.5),
              right: BorderSide(color: Colors.white, width: 1.5),
            ),
          ),
          padding: EdgeInsets.only(
            left: 24,
            right: 24,
            top: 16,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 28,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 44,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppColors.textLight.withOpacity(0.4),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 22),
              const Text('Добавить товар',
                  style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textPrimary)),
              const SizedBox(height: 16),
              _glassField(nameCtrl, 'Название товара', autofocus: true),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(child: _glassField(qtyCtrl, 'Кол-во')),
                  const SizedBox(width: 10),
                  Expanded(
                      child: _glassField(priceCtrl, 'Цена ₽',
                          keyboard: TextInputType.number)),
                ],
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  'Продукты',
                  'Напитки',
                  'Бытовое',
                  'Аптека',
                  'Другое'
                ].map((c) {
                  final sel = category == c;
                  return GestureDetector(
                    onTap: () =>
                        setModalState(() => category = sel ? null : c),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      padding: const EdgeInsets.symmetric(
                          horizontal: 14, vertical: 7),
                      decoration: BoxDecoration(
                        color: sel
                            ? AppColors.accent.withOpacity(0.18)
                            : Colors.white.withOpacity(0.4),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: sel
                              ? AppColors.accent
                              : Colors.white.withOpacity(0.5),
                          width: sel ? 2 : 1.5,
                        ),
                      ),
                      child: Text(c,
                          style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: sel
                                  ? AppColors.accent
                                  : AppColors.textSecondary)),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 24),
              GlassButton(
                label: 'Добавить',
                onTap: () async {
                  if (nameCtrl.text.trim().isEmpty) return;
                  await context.read<ShoppingProvider>().addItem(
                        listId: listId,
                        name: nameCtrl.text.trim(),
                        quantity: qtyCtrl.text.trim().isEmpty
                            ? null
                            : qtyCtrl.text.trim(),
                        price: priceCtrl.text.trim().isEmpty
                            ? null
                            : double.tryParse(priceCtrl.text.trim()),
                        category: category,
                      );
                  if (ctx.mounted) Navigator.pop(ctx);
                },
              ),
            ],
          ),
        );
      }),
    );
  }

  Widget _glassField(TextEditingController ctrl, String hint,
      {bool autofocus = false, TextInputType? keyboard}) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(14),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: TextField(
          controller: ctrl,
          autofocus: autofocus,
          keyboardType: keyboard,
          style: const TextStyle(
              color: AppColors.textPrimary, fontWeight: FontWeight.w500),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: const TextStyle(color: AppColors.textLight),
            filled: true,
            fillColor: Colors.white.withOpacity(0.35),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: BorderSide(
                  color: Colors.white.withOpacity(0.5), width: 1.5),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: BorderSide(
                  color: Colors.white.withOpacity(0.5), width: 1.5),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: BorderSide(
                  color: AppColors.accent.withOpacity(0.6), width: 2),
            ),
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          ),
        ),
      ),
    );
  }
}

class _ItemTile extends StatelessWidget {
  final ShoppingItem item;
  final String listId;
  final String? memberId;

  const _ItemTile(
      {required this.item, required this.listId, required this.memberId});

  @override
  Widget build(BuildContext context) {
    return Dismissible(
      key: Key(item.id),
      direction: DismissDirection.endToStart,
      onDismissed: (_) =>
          context.read<ShoppingProvider>().deleteItem(listId, item.id),
      background: Container(
        margin: const EdgeInsets.fromLTRB(20, 0, 20, 8),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              AppColors.error.withOpacity(0.6),
              AppColors.error,
            ],
          ),
          borderRadius: BorderRadius.circular(20),
        ),
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        child: const Icon(Icons.delete_rounded, color: Colors.white),
      ),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(20, 0, 20, 8),
        child: GlassCard(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 13),
          opacity: item.isBought ? 0.12 : 0.28,
          child: Row(
            children: [
              GestureDetector(
                onTap: () => context
                    .read<ShoppingProvider>()
                    .toggleItem(listId, item.id, memberId),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 250),
                  width: 26,
                  height: 26,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: item.isBought
                        ? const LinearGradient(
                            colors: [
                              Color(0xFF3DCFCF),
                              Color(0xFF5DB8FF)
                            ],
                          )
                        : null,
                    border: item.isBought
                        ? null
                        : Border.all(
                            color: AppColors.accent.withOpacity(0.5),
                            width: 2,
                          ),
                  ),
                  child: item.isBought
                      ? const Icon(Icons.check_rounded,
                          color: Colors.white, size: 15)
                      : null,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item.name,
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: item.isBought
                            ? AppColors.textLight
                            : AppColors.textPrimary,
                        decoration: item.isBought
                            ? TextDecoration.lineThrough
                            : null,
                        decorationColor: AppColors.textLight,
                      ),
                    ),
                    if (item.quantity != null || item.category != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 2),
                        child: Text(
                          [item.quantity, item.category]
                              .where((e) => e != null)
                              .join(' · '),
                          style: const TextStyle(
                              fontSize: 12, color: AppColors.textLight),
                        ),
                      ),
                  ],
                ),
              ),
              if (item.price != null) ...[
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: item.isBought
                        ? AppColors.textLight.withOpacity(0.1)
                        : AppColors.accent.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    '${item.price!.toStringAsFixed(0)} ₽',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: item.isBought
                          ? AppColors.textLight
                          : AppColors.accent,
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  final VoidCallback onAdd;
  const _EmptyState({required this.onAdd});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 96,
            height: 96,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF3DCFCF), Color(0xFF5DB8FF)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(28),
              boxShadow: [
                BoxShadow(
                  color: AppColors.accent.withOpacity(0.3),
                  blurRadius: 20,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child:
                const Center(child: Text('🛒', style: TextStyle(fontSize: 46))),
          ),
          const SizedBox(height: 20),
          const Text('Нет списков покупок',
              style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textPrimary,
                  letterSpacing: -0.3)),
          const SizedBox(height: 8),
          const Text('Создайте первый список\nдля вашей семьи',
              textAlign: TextAlign.center,
              style: TextStyle(
                  fontSize: 15,
                  color: AppColors.textSecondary,
                  height: 1.5)),
          const SizedBox(height: 32),
          GlassButton(
            label: 'Создать список',
            icon: Icons.add_rounded,
            width: 200,
            onTap: onAdd,
          ),
        ],
      ),
    );
  }
}
