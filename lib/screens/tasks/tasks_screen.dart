import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../theme/app_theme.dart';
import '../../widgets/glass_card.dart';
import '../../providers/auth_provider.dart';
import '../../providers/family_provider.dart';
import '../../providers/tasks_provider.dart';
import '../../models/task.dart';

class TasksScreen extends StatefulWidget {
  const TasksScreen({super.key});

  @override
  State<TasksScreen> createState() => _TasksScreenState();
}

class _TasksScreenState extends State<TasksScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tab;
  int _filterMember = -1;

  @override
  void initState() {
    super.initState();
    _tab = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tab.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final tasks = context.watch<TasksProvider>();
    final family = context.watch<FamilyProvider>();
    final auth = context.watch<AuthProvider>();

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Дела',
                  style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textPrimary)),
              GestureDetector(
                onTap: () => _showAddTask(context),
                child: Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [AppColors.primary, AppColors.primaryLight],
                    ),
                    borderRadius: BorderRadius.circular(14),
                    boxShadow: [
                      BoxShadow(
                          color: AppColors.primary.withOpacity(0.3),
                          blurRadius: 10,
                          offset: const Offset(0, 4))
                    ],
                  ),
                  child: const Icon(Icons.add_rounded,
                      color: Colors.white, size: 22),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),
        // Tab bar
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: GlassCard(
            padding: const EdgeInsets.all(4),
            borderRadius: 16,
            child: TabBar(
              controller: _tab,
              indicator: BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.circular(12),
              ),
              indicatorSize: TabBarIndicatorSize.tab,
              labelColor: Colors.white,
              unselectedLabelColor: AppColors.textSecondary,
              labelStyle: const TextStyle(
                  fontWeight: FontWeight.w600, fontSize: 13),
              dividerColor: Colors.transparent,
              tabs: const [
                Tab(text: 'Все'),
                Tab(text: 'Назначено'),
                Tab(text: 'Мои'),
              ],
            ),
          ),
        ),
        // Member filter
        if (family.members.isNotEmpty) ...[
          const SizedBox(height: 12),
          SizedBox(
            height: 38,
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              scrollDirection: Axis.horizontal,
              itemCount: family.members.length + 1,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (_, i) {
                if (i == 0) {
                  return _FilterChip(
                    label: 'Все',
                    selected: _filterMember == -1,
                    onTap: () => setState(() => _filterMember = -1),
                  );
                }
                final m = family.members[i - 1];
                return _FilterChip(
                  label: '${m.avatarEmoji} ${m.name}',
                  selected: _filterMember == i - 1,
                  onTap: () => setState(
                      () => _filterMember = _filterMember == i - 1 ? -1 : i - 1),
                );
              },
            ),
          ),
        ],
        const SizedBox(height: 12),
        Expanded(
          child: TabBarView(
            controller: _tab,
            children: [
              _TaskList(
                tasks: _applyFilter(tasks.pending, family, auth, 'all'),
                family: family,
                auth: auth,
              ),
              _TaskList(
                tasks: _applyFilter(
                    tasks.pending.where((t) => t.assignedTo != null).toList(),
                    family,
                    auth,
                    'all'),
                family: family,
                auth: auth,
              ),
              _TaskList(
                tasks: tasks.pending
                    .where((t) => t.assignedTo == auth.memberId)
                    .toList(),
                family: family,
                auth: auth,
              ),
            ],
          ),
        ),
      ],
    );
  }

  List<FamilyTask> _applyFilter(
      List<FamilyTask> tasks, FamilyProvider family, AuthProvider auth, String _) {
    if (_filterMember == -1) return tasks;
    final memberId = family.members[_filterMember].id;
    return tasks.where((t) => t.assignedTo == memberId).toList();
  }

  void _showAddTask(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _AddTaskSheet(parentContext: context),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _FilterChip(
      {required this.label, required this.selected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
        decoration: BoxDecoration(
          color: selected
              ? AppColors.primary
              : Colors.white.withOpacity(0.3),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: selected
                ? Colors.transparent
                : Colors.white.withOpacity(0.4),
            width: 1,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: selected ? Colors.white : AppColors.textSecondary,
          ),
        ),
      ),
    );
  }
}

class _TaskList extends StatelessWidget {
  final List<FamilyTask> tasks;
  final FamilyProvider family;
  final AuthProvider auth;

  const _TaskList(
      {required this.tasks, required this.family, required this.auth});

  @override
  Widget build(BuildContext context) {
    if (tasks.isEmpty) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('✅', style: TextStyle(fontSize: 48)),
            SizedBox(height: 12),
            Text('Всё сделано!',
                style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textSecondary)),
          ],
        ),
      );
    }

    // Group by period
    final Map<String, List<FamilyTask>> grouped = {};
    const order = [
      'Просрочено', 'Сегодня', 'Завтра', 'На этой неделе',
      'На след. неделе', 'Следующий месяц', 'Без срока'
    ];
    for (final period in order) {
      final list = tasks.where((t) => t.duePeriod == period).toList();
      if (list.isNotEmpty) grouped[period] = list;
    }

    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 100),
      physics: const BouncingScrollPhysics(),
      itemCount: grouped.length,
      itemBuilder: (_, i) {
        final period = grouped.keys.elementAt(i);
        final periodTasks = grouped[period]!;
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.only(top: 16, bottom: 8),
              child: Text(period,
                  style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textSecondary,
                      letterSpacing: 0.5)),
            ),
            ...periodTasks.map((t) => _TaskTile(task: t, family: family)),
          ],
        );
      },
    );
  }
}

class _TaskTile extends StatelessWidget {
  final FamilyTask task;
  final FamilyProvider family;

  const _TaskTile({required this.task, required this.family});

  @override
  Widget build(BuildContext context) {
    final assignee =
        task.assignedTo != null ? family.memberById(task.assignedTo!) : null;
    final isOverdue = task.duePeriod == 'Просрочено';

    return Dismissible(
      key: Key(task.id),
      direction: DismissDirection.endToStart,
      onDismissed: (_) =>
          context.read<TasksProvider>().deleteTask(task.id),
      background: Container(
        margin: const EdgeInsets.only(bottom: 8),
        decoration: BoxDecoration(
          color: AppColors.error.withOpacity(0.8),
          borderRadius: BorderRadius.circular(20),
        ),
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        child: const Icon(Icons.delete_rounded, color: Colors.white),
      ),
      child: Padding(
        padding: const EdgeInsets.only(bottom: 8),
        child: GlassCard(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          child: Row(
            children: [
              GestureDetector(
                onTap: () =>
                    context.read<TasksProvider>().toggleDone(task.id),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  width: 24,
                  height: 24,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: isOverdue
                          ? AppColors.error
                          : AppColors.primary.withOpacity(0.5),
                      width: 2,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(task.title,
                        style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w500,
                            color: isOverdue
                                ? AppColors.error
                                : AppColors.textPrimary)),
                    if (task.dueDate != null)
                      Text(
                        DateFormat('d MMM', 'ru').format(task.dueDate!),
                        style: TextStyle(
                            fontSize: 12,
                            color: isOverdue
                                ? AppColors.error.withOpacity(0.7)
                                : AppColors.textLight),
                      ),
                  ],
                ),
              ),
              if (task.priority == 'high')
                Container(
                  width: 6,
                  height: 6,
                  margin: const EdgeInsets.only(right: 8),
                  decoration: const BoxDecoration(
                    color: AppColors.error,
                    shape: BoxShape.circle,
                  ),
                ),
              if (assignee != null)
                Text(assignee.avatarEmoji,
                    style: const TextStyle(fontSize: 18)),
            ],
          ),
        ),
      ),
    );
  }
}

class _AddTaskSheet extends StatefulWidget {
  final BuildContext parentContext;
  const _AddTaskSheet({required this.parentContext});

  @override
  State<_AddTaskSheet> createState() => _AddTaskSheetState();
}

class _AddTaskSheetState extends State<_AddTaskSheet> {
  final _titleCtrl = TextEditingController();
  String? _assignedTo;
  DateTime? _dueDate;
  String _priority = 'normal';
  bool _loading = false;

  @override
  void dispose() {
    _titleCtrl.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (_titleCtrl.text.trim().isEmpty) return;
    setState(() => _loading = true);
    final auth = widget.parentContext.read<AuthProvider>();
    final tasks = widget.parentContext.read<TasksProvider>();
    final family = widget.parentContext.read<FamilyProvider>();
    try {
      await tasks.addTask(FamilyTask(
        id: '',
        groupId: family.currentGroupId!,
        title: _titleCtrl.text.trim(),
        assignedTo: _assignedTo,
        createdBy: auth.memberId,
        dueDate: _dueDate,
        priority: _priority,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      ));
      if (mounted) Navigator.pop(context);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final family = widget.parentContext.watch<FamilyProvider>();

    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFDDE8F8), Color(0xFFEDE8F8)],
        ),
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      padding: EdgeInsets.only(
        left: 24,
        right: 24,
        top: 16,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.black.withOpacity(0.12),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 20),
          const Text('Новое дело',
              style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary)),
          const SizedBox(height: 20),
          ClipRRect(
            borderRadius: BorderRadius.circular(14),
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 8, sigmaY: 8),
              child: TextField(
                controller: _titleCtrl,
                autofocus: true,
                style: const TextStyle(
                    color: AppColors.textPrimary, fontWeight: FontWeight.w500),
                decoration: InputDecoration(
                  hintText: 'Что нужно сделать?',
                  hintStyle: const TextStyle(color: AppColors.textLight),
                  filled: true,
                  fillColor: Colors.white.withOpacity(0.25),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: BorderSide(
                        color: Colors.white.withOpacity(0.3), width: 1),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: BorderSide(
                        color: Colors.white.withOpacity(0.3), width: 1),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: BorderSide(
                        color: AppColors.primary.withOpacity(0.5),
                        width: 1.5),
                  ),
                  contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16, vertical: 14),
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          // Assign to
          const Text('Назначить',
              style: TextStyle(
                  fontWeight: FontWeight.w600,
                  color: AppColors.textSecondary,
                  fontSize: 13)),
          const SizedBox(height: 10),
          SizedBox(
            height: 50,
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: [
                _AssignChip(
                  label: 'Никому',
                  emoji: '—',
                  selected: _assignedTo == null,
                  onTap: () => setState(() => _assignedTo = null),
                ),
                ...family.members.map((m) => _AssignChip(
                      label: m.name,
                      emoji: m.avatarEmoji,
                      selected: _assignedTo == m.id,
                      onTap: () => setState(() => _assignedTo = m.id),
                    )),
              ],
            ),
          ),
          const SizedBox(height: 16),
          // Date + priority row
          Row(
            children: [
              Expanded(
                child: GlassButton(
                  label: _dueDate == null
                      ? 'Дата'
                      : DateFormat('d MMM', 'ru').format(_dueDate!),
                  icon: Icons.calendar_today_rounded,
                  isPrimary: false,
                  onTap: () async {
                    final d = await showDatePicker(
                      context: context,
                      initialDate: DateTime.now(),
                      firstDate: DateTime.now(),
                      lastDate: DateTime.now().add(const Duration(days: 365)),
                    );
                    if (d != null) setState(() => _dueDate = d);
                  },
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: GlassCard(
                  padding: EdgeInsets.zero,
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: _priority,
                      isExpanded: true,
                      icon: const Icon(Icons.expand_more_rounded,
                          color: AppColors.textSecondary),
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                      items: const [
                        DropdownMenuItem(value: 'low', child: Text('Низкий')),
                        DropdownMenuItem(
                            value: 'normal', child: Text('Обычный')),
                        DropdownMenuItem(
                            value: 'high', child: Text('Срочно 🔴')),
                      ],
                      onChanged: (v) =>
                          setState(() => _priority = v ?? 'normal'),
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          GlassButton(
              label: 'Добавить', onTap: _save, isLoading: _loading),
        ],
      ),
    );
  }
}

class _AssignChip extends StatelessWidget {
  final String label;
  final String emoji;
  final bool selected;
  final VoidCallback onTap;

  const _AssignChip(
      {required this.label,
      required this.emoji,
      required this.selected,
      required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        margin: const EdgeInsets.only(right: 8),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: selected
              ? AppColors.primary.withOpacity(0.15)
              : Colors.white.withOpacity(0.3),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: selected
                ? AppColors.primary
                : Colors.white.withOpacity(0.4),
            width: selected ? 2 : 1,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(emoji, style: const TextStyle(fontSize: 16)),
            const SizedBox(width: 4),
            Text(label,
                style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: selected
                        ? AppColors.primary
                        : AppColors.textSecondary)),
          ],
        ),
      ),
    );
  }
}
