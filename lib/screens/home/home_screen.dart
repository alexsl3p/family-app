import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../theme/app_theme.dart';
import '../../widgets/glass_card.dart';
import '../../providers/auth_provider.dart';
import '../../providers/family_provider.dart';
import '../../providers/tasks_provider.dart';
import '../../providers/shopping_provider.dart';
import '../../models/family_member.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final family = context.watch<FamilyProvider>();
    final tasks = context.watch<TasksProvider>();
    final shopping = context.watch<ShoppingProvider>();

    final hour = DateTime.now().hour;
    final greeting = hour < 12
        ? 'Доброе утро'
        : hour < 17
            ? 'Добрый день'
            : 'Добрый вечер';

    return CustomScrollView(
      physics: const BouncingScrollPhysics(),
      slivers: [
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '$greeting! 👋',
                            style: const TextStyle(
                              fontSize: 26,
                              fontWeight: FontWeight.w800,
                              color: AppColors.textPrimary,
                              letterSpacing: -0.5,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            family.groupName ?? 'Загрузка...',
                            style: const TextStyle(
                              fontSize: 15,
                              color: AppColors.textSecondary,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    _InviteCodeChip(code: family.inviteCode ?? ''),
                  ],
                ),
                const SizedBox(height: 24),

                // Members horizontal row
                if (family.members.isNotEmpty) ...[
                  SizedBox(
                    height: 96,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: family.members.length,
                      separatorBuilder: (_, __) => const SizedBox(width: 10),
                      itemBuilder: (_, i) {
                        final m = family.members[i];
                        final myTasks = tasks.tasksForMember(m.id).length;
                        final isMe = m.id == auth.memberId;
                        return _MemberCard(
                            member: m, taskCount: myTasks, isMe: isMe);
                      },
                    ),
                  ),
                  const SizedBox(height: 24),
                ],

                // Stats row
                Row(
                  children: [
                    Expanded(
                      child: _StatCard(
                        icon: '📋',
                        label: 'Задач',
                        value: '${tasks.pending.length}',
                        gradientColors: const [Color(0xFF6E5FFF), Color(0xFF9B8FFF)],
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _StatCard(
                        icon: '🛒',
                        label: 'Списков',
                        value: '${shopping.lists.length}',
                        gradientColors: const [Color(0xFF3DCFCF), Color(0xFF5DB8FF)],
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _StatCard(
                        icon: '👥',
                        label: 'Членов',
                        value: '${family.members.length}',
                        gradientColors: const [Color(0xFFFF6B9D), Color(0xFFD87BFF)],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 28),

                // Today's tasks
                if (tasks.groupedByPeriod['Сегодня'] != null &&
                    tasks.groupedByPeriod['Сегодня']!.isNotEmpty) ...[
                  _SectionHeader(
                    title: 'Дела на сегодня',
                    count: tasks.groupedByPeriod['Сегодня']!.length,
                  ),
                  const SizedBox(height: 12),
                  ...tasks.groupedByPeriod['Сегодня']!.take(4).map((t) {
                    final assignee = t.assignedTo != null
                        ? family.memberById(t.assignedTo!)
                        : null;
                    final memberColor = assignee != null
                        ? Color(int.parse(
                            assignee.color.replaceFirst('#', '0xFF')))
                        : AppColors.primary;
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: GlassCard(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 13),
                        child: Row(
                          children: [
                            GestureDetector(
                              onTap: () => context
                                  .read<TasksProvider>()
                                  .toggleDone(t.id),
                              child: Container(
                                width: 22,
                                height: 22,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: AppColors.primary.withOpacity(0.6),
                                    width: 2,
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                t.title,
                                style: const TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w500,
                                  color: AppColors.textPrimary,
                                ),
                              ),
                            ),
                            if (assignee != null)
                              Container(
                                width: 30,
                                height: 30,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: memberColor.withOpacity(0.15),
                                ),
                                child: Center(
                                  child: Text(assignee.avatarEmoji,
                                      style:
                                          const TextStyle(fontSize: 16)),
                                ),
                              ),
                          ],
                        ),
                      ),
                    );
                  }),
                  const SizedBox(height: 8),
                ],

                // Shopping lists preview
                if (shopping.lists.isNotEmpty) ...[
                  _SectionHeader(
                    title: 'Покупки',
                    count: shopping.lists.length,
                  ),
                  const SizedBox(height: 12),
                  ...shopping.lists.take(2).map((list) {
                    final items = shopping.itemsFor(list.id);
                    final done = items.where((i) => i.isBought).length;
                    final total = shopping.totalFor(list.id);
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 10),
                      child: GlassCard(
                        padding: const EdgeInsets.all(16),
                        child: Row(
                          children: [
                            Container(
                              width: 48,
                              height: 48,
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  colors: [
                                    Color(0xFF3DCFCF),
                                    Color(0xFF5DB8FF)
                                  ],
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                ),
                                borderRadius: BorderRadius.circular(14),
                              ),
                              child: const Center(
                                  child: Text('🛒',
                                      style: TextStyle(fontSize: 22))),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(list.name,
                                      style: const TextStyle(
                                          fontWeight: FontWeight.w700,
                                          fontSize: 15,
                                          color: AppColors.textPrimary)),
                                  const SizedBox(height: 3),
                                  Text(
                                    '${list.itemCount} позиций · $done куплено',
                                    style: const TextStyle(
                                        fontSize: 12,
                                        color: AppColors.textSecondary),
                                  ),
                                  if (list.itemCount > 0) ...[
                                    const SizedBox(height: 6),
                                    _ProgressBar(
                                        progress: done / list.itemCount),
                                  ],
                                ],
                              ),
                            ),
                            if (total > 0) ...[
                              const SizedBox(width: 12),
                              Text(
                                '${total.toStringAsFixed(0)} ₽',
                                style: const TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w800,
                                  color: AppColors.accent,
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                    );
                  }),
                ],
                const SizedBox(height: 110),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _InviteCodeChip extends StatelessWidget {
  final String code;
  const _InviteCodeChip({required this.code});

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      borderRadius: 14,
      onTap: () {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Код: $code'),
            behavior: SnackBarBehavior.floating,
            backgroundColor: AppColors.primary,
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12)),
          ),
        );
      },
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.share_rounded, size: 14, color: AppColors.primary),
          const SizedBox(width: 5),
          Text(
            code.toUpperCase(),
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w800,
              color: AppColors.primary,
              letterSpacing: 1.2,
            ),
          ),
        ],
      ),
    );
  }
}

class _MemberCard extends StatelessWidget {
  final FamilyMember member;
  final int taskCount;
  final bool isMe;

  const _MemberCard(
      {required this.member, required this.taskCount, required this.isMe});

  @override
  Widget build(BuildContext context) {
    final color = Color(int.parse(member.color.replaceFirst('#', '0xFF')));
    return GlassCard(
      width: 76,
      borderRadius: 22,
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 6),
      color: isMe ? color : Colors.white,
      opacity: isMe ? 0.22 : 0.3,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Stack(
            clipBehavior: Clip.none,
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: color.withOpacity(0.15),
                  border: isMe ? Border.all(color: color, width: 2) : null,
                ),
                child: Center(
                  child: Text(member.avatarEmoji,
                      style: const TextStyle(fontSize: 22)),
                ),
              ),
              if (taskCount > 0)
                Positioned(
                  top: -4,
                  right: -6,
                  child: Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                    decoration: BoxDecoration(
                      color: color,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.white, width: 1.5),
                    ),
                    child: Text(
                      '$taskCount',
                      style: const TextStyle(
                          fontSize: 9,
                          fontWeight: FontWeight.w800,
                          color: Colors.white),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            member.name,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: isMe ? color : AppColors.textSecondary,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String icon;
  final String label;
  final String value;
  final List<Color> gradientColors;

  const _StatCard({
    required this.icon,
    required this.label,
    required this.value,
    required this.gradientColors,
  });

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: gradientColors,
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Center(
                child: Text(icon, style: const TextStyle(fontSize: 18))),
          ),
          const SizedBox(height: 10),
          Text(value,
              style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w800,
                  color: gradientColors[0])),
          Text(label,
              style: const TextStyle(
                  fontSize: 11,
                  color: AppColors.textSecondary,
                  fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  final int count;
  const _SectionHeader({required this.title, required this.count});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Text(title,
            style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: AppColors.textPrimary,
                letterSpacing: -0.3)),
        const SizedBox(width: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 3),
          decoration: BoxDecoration(
            color: AppColors.primary.withOpacity(0.12),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text('$count',
              style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  color: AppColors.primary)),
        ),
      ],
    );
  }
}

class _ProgressBar extends StatelessWidget {
  final double progress;
  const _ProgressBar({required this.progress});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(3),
      child: LinearProgressIndicator(
        value: progress.clamp(0.0, 1.0),
        backgroundColor: AppColors.accent.withOpacity(0.15),
        valueColor: const AlwaysStoppedAnimation<Color>(AppColors.accent),
        minHeight: 5,
      ),
    );
  }
}
