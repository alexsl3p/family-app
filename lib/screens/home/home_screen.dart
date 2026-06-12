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
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '$greeting, семья! 👋',
                          style: const TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          family.groupName ?? 'Загрузка...',
                          style: const TextStyle(
                            fontSize: 14,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                    _InviteCodeChip(code: family.inviteCode ?? ''),
                  ],
                ),
                const SizedBox(height: 24),
                // Members
                SizedBox(
                  height: 90,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: family.members.length,
                    separatorBuilder: (_, __) => const SizedBox(width: 12),
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
                // Stats row
                Row(
                  children: [
                    Expanded(
                      child: _StatCard(
                        icon: Icons.check_circle_outline_rounded,
                        label: 'Задач',
                        value: '${tasks.pending.length}',
                        color: AppColors.primary,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _StatCard(
                        icon: Icons.shopping_cart_outlined,
                        label: 'Списков',
                        value: '${shopping.lists.length}',
                        color: AppColors.accent,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _StatCard(
                        icon: Icons.people_outline_rounded,
                        label: 'Членов',
                        value: '${family.members.length}',
                        color: AppColors.warning,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                // Today's tasks
                if (tasks.groupedByPeriod['Сегодня'] != null) ...[
                  _SectionTitle(
                      title: 'Дела на сегодня',
                      count: tasks.groupedByPeriod['Сегодня']!.length),
                  const SizedBox(height: 12),
                  ...tasks.groupedByPeriod['Сегодня']!.take(3).map((t) {
                    final assignee = t.assignedTo != null
                        ? family.memberById(t.assignedTo!)
                        : null;
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: GlassCard(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 12),
                        child: Row(
                          children: [
                            GestureDetector(
                              onTap: () =>
                                  context.read<TasksProvider>().toggleDone(t.id),
                              child: Container(
                                width: 22,
                                height: 22,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: AppColors.primary.withOpacity(0.5),
                                    width: 2,
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(t.title,
                                  style: const TextStyle(
                                      fontSize: 15,
                                      fontWeight: FontWeight.w500,
                                      color: AppColors.textPrimary)),
                            ),
                            if (assignee != null)
                              Text(assignee.avatarEmoji,
                                  style: const TextStyle(fontSize: 18)),
                          ],
                        ),
                      ),
                    );
                  }),
                  const SizedBox(height: 8),
                ],
                // Shopping preview
                if (shopping.lists.isNotEmpty) ...[
                  _SectionTitle(
                      title: 'Покупки', count: shopping.lists.length),
                  const SizedBox(height: 12),
                  ...shopping.lists.take(2).map((list) {
                    final items = shopping.itemsFor(list.id);
                    final done =
                        items.where((i) => i.isBought).length;
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: GlassCard(
                        padding: const EdgeInsets.all(16),
                        child: Row(
                          children: [
                            Container(
                              width: 42,
                              height: 42,
                              decoration: BoxDecoration(
                                color: AppColors.accent.withOpacity(0.15),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Center(
                                  child: Text('🛒',
                                      style: TextStyle(fontSize: 20))),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(list.name,
                                      style: const TextStyle(
                                          fontWeight: FontWeight.w600,
                                          fontSize: 15,
                                          color: AppColors.textPrimary)),
                                  Text(
                                    '${list.itemCount} позиций · $done куплено',
                                    style: const TextStyle(
                                        fontSize: 12,
                                        color: AppColors.textSecondary),
                                  ),
                                ],
                              ),
                            ),
                            if (list.itemCount > 0)
                              _ProgressRing(
                                progress: list.itemCount > 0
                                    ? done / list.itemCount
                                    : 0,
                              ),
                          ],
                        ),
                      ),
                    );
                  }),
                ],
                const SizedBox(height: 100),
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
      borderRadius: 12,
      onTap: () {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Код приглашения: $code'),
            behavior: SnackBarBehavior.floating,
            backgroundColor: AppColors.primary,
          ),
        );
      },
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.share_rounded,
              size: 14, color: AppColors.textSecondary),
          const SizedBox(width: 4),
          Text(
            code.toUpperCase(),
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w700,
              color: AppColors.textSecondary,
              letterSpacing: 1,
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
    final color =
        Color(int.parse(member.color.replaceFirst('#', '0xFF')));
    return GlassCard(
      width: 72,
      borderRadius: 20,
      padding: const EdgeInsets.symmetric(vertical: 10),
      color: isMe ? color : null,
      opacity: isMe ? 0.2 : 0.18,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(member.avatarEmoji, style: const TextStyle(fontSize: 26)),
          const SizedBox(height: 4),
          Text(
            member.name,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: isMe ? color : AppColors.textSecondary,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          if (taskCount > 0)
            Container(
              margin: const EdgeInsets.only(top: 3),
              padding:
                  const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
              decoration: BoxDecoration(
                color: color.withOpacity(0.2),
                borderRadius: BorderRadius.circular(6),
              ),
              child: Text(
                '$taskCount',
                style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    color: color),
              ),
            ),
        ],
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;

  const _StatCard(
      {required this.icon,
      required this.label,
      required this.value,
      required this.color});

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(height: 8),
          Text(value,
              style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                  color: color)),
          Text(label,
              style: const TextStyle(
                  fontSize: 11, color: AppColors.textSecondary)),
        ],
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final String title;
  final int count;
  const _SectionTitle({required this.title, required this.count});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Text(title,
            style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary)),
        const SizedBox(width: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
          decoration: BoxDecoration(
            color: AppColors.primary.withOpacity(0.12),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text('$count',
              style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: AppColors.primary)),
        ),
      ],
    );
  }
}

class _ProgressRing extends StatelessWidget {
  final double progress;
  const _ProgressRing({required this.progress});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 36,
      height: 36,
      child: Stack(
        alignment: Alignment.center,
        children: [
          CircularProgressIndicator(
            value: progress,
            strokeWidth: 3,
            backgroundColor: AppColors.accent.withOpacity(0.15),
            valueColor:
                const AlwaysStoppedAnimation<Color>(AppColors.accent),
          ),
          Text(
            '${(progress * 100).round()}%',
            style: const TextStyle(
                fontSize: 9,
                fontWeight: FontWeight.w700,
                color: AppColors.accent),
          ),
        ],
      ),
    );
  }
}
