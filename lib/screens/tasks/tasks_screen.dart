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
        // Header
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Дела',
                style: TextStyle(
                  fontSize: 30,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textPrimary,
                  letterSpacing: -0.8,
                ),
              ),
              GestureDetector(
                onTap: () => _showAddTask(context),
                child: Container(
                  width: 42,
                  height: 42,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [AppColors.primary, AppColors.primaryLight],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(14),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.primary.withOpacity(0.35),
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

        // Tab bar
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: GlassCard(
            padding: const EdgeInsets.all(4),
            borderRadius: 18,
            opacity: 0.3,
            child: TabBar(
              controller: _tab,
              indicator: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppColors.primary, AppColors.primaryLight],
                ),
                borderRadius: BorderRadius.circular(14),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.primary.withOpacity(0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              indicatorSize: TabBarIndicatorSize.tab,
              labelColor: Colors.white,
              unselectedLabelColor: AppColors.textSecondary,
              labelStyle: const TextStyle(
                  fontWeight: FontWeight.w700, fontSize: 13),
              dividerColor: Colors.transparent,
              tabs: const [
                Tab(text: 'Все'),
                Tab(text: 'Назначено'),
                Tab(text: 'Мои'),
              ],
            ),
          ),
        ),

        // Member filter chips
        if (family.members.isNotEmpty) ...[
          const SizedBox(height: 12),
          SizedBox(
            height: 36,
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
                  onTap: () => setState(() =>
                      _filterMember = _filterMember == i - 1 ? -1 : i - 1),
                );
              },
            ),
          ),
        ],
        const SizedBox(height: 4),

        // Task lists
        Expanded(
          child: TabBarView(
            controller: _tab,
            children: [
              _TaskList(
                tasks: _applyFilter(tasks.pending, family, auth),
                family: family,
                auth: auth,
              ),
              _TaskList(
                tasks: _applyFilter(
                    tasks.pending.where((t) => t.assignedTo != null).toList(),
                    family,
                    auth),
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
      List<FamilyTask> tasks, FamilyProvider family, AuthProvider auth) {
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
          gradient: selected
              ? const LinearGradient(
                  colors: [AppColors.primary, AppColors.primaryLight])
              : null,
          color: selected ? null : Colors.white.withOpacity(0.35),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: selected ? Colors.transparent : Colors.white.withOpacity(0.6),
            width: 1.5,
          ),
          boxShadow: selected
              ? [
                  BoxShadow(
                    color: AppColors.primary.withOpacity(0.25),
                    blurRadius: 8,
                    offset: const Offset(0, 3),
                  )
                ]
              : [],
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
            Text('✅', style: TextStyle(fontSize: 56)),
            SizedBox(height: 16),
            Text('Всё сделано!',
                style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textSecondary)),
            SizedBox(height: 6),
            Text('Нет активных задач',
                style: TextStyle(color: AppColors.textLight)),
          ],
        ),
      );
    }

    final Map<String, List<FamilyTask>> grouped = {};
    const order = [
      'Просрочено',
      'Сегодня',
      'Завтра',
      'На этой неделе',
      'На след. неделе',
      'Следующий месяц',
      'Без срока'
    ];
    for (final period in order) {
      final list = tasks.where((t) => t.duePeriod == period).toList();
      if (list.isNotEmpty) grouped[period] = list;
    }

    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(20, 8, 20, 110),
      physics: const BouncingScrollPhysics(),
      itemCount: grouped.length,
      itemBuilder: (_, i) {
        final period = grouped.keys.elementAt(i);
        final periodTasks = grouped[period]!;
        final isOverdueSection = period == 'Просрочено';
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.only(top: 16, bottom: 8),
              child: Row(
                children: [
                  Container(
                    width: 6,
                    height: 6,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: isOverdueSection
                          ? AppColors.error
                          : AppColors.primary.withOpacity(0.5),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    period,
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: isOverdueSection
                          ? AppColors.error
                          : AppColors.textSecondary,
                      letterSpacing: 0.3,
                    ),
                  ),
                  const SizedBox(width: 6),
                  Text(
                    '${periodTasks.length}',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: isOverdueSection
                          ? AppColors.error.withOpacity(0.6)
                          : AppColors.textLight,
                    ),
                  ),
                ],
              ),
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
    final memberColor = assignee != null
        ? Color(int.parse(assignee.color.replaceFirst('#', '0xFF')))
        : AppColors.primary;

    return Dismissible(
      key: Key(task.id),
      direction: DismissDirection.endToStart,
      onDismissed: (_) => context.read<TasksProvider>().deleteTask(task.id),
      background: Container(
        margin: const EdgeInsets.only(bottom: 8),
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
        padding: const EdgeInsets.only(bottom: 8),
        child: GlassCard(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 13),
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
                          : AppColors.primary.withOpacity(0.55),
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
                    Text(
                      task.title,
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: isOverdue
                            ? AppColors.error
                            : AppColors.textPrimary,
                      ),
                    ),
                    if (task.dueDate != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 3),
                        child: Text(
                          DateFormat('d MMM', 'ru').format(task.dueDate!),
                          style: TextStyle(
                            fontSize: 12,
                            color: isOverdue
                                ? AppColors.error.withOpacity(0.7)
                                : AppColors.textLight,
                          ),
                        ),
                      ),
                  ],
                ),
              ),
              if (task.priority == 'high')
                Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 8, vertical: 3),
                  margin: const EdgeInsets.only(right: 8),
                  decoration: BoxDecoration(
                    color: AppColors.error.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Text(
                    '🔴',
                    style: TextStyle(fontSize: 11),
                  ),
                ),
              if (assignee != null)
                Container(
                  width: 30,
                  height: 30,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: memberColor.withOpacity(0.15),
                    border: Border.all(
                        color: memberColor.withOpacity(0.3), width: 1),
                  ),
                  child: Center(
                    child: Text(assignee.avatarEmoji,
                        style: const TextStyle(fontSize: 16)),
                  ),
                ),
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
          const Text(
            'Новое дело',
            style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.w800,
                color: AppColors.textPrimary),
          ),
          const SizedBox(height: 20),
          _glassField(_titleCtrl, 'Что нужно сделать?', autofocus: true),
          const SizedBox(height: 16),
          const Text('Назначить',
              style: TextStyle(
                  fontWeight: FontWeight.w600,
                  color: AppColors.textSecondary,
                  fontSize: 13)),
          const SizedBox(height: 10),
          SizedBox(
            height: 48,
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
                      lastDate:
                          DateTime.now().add(const Duration(days: 365)),
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
                      padding:
                          const EdgeInsets.symmetric(horizontal: 14),
                      items: const [
                        DropdownMenuItem(
                            value: 'low', child: Text('Низкий')),
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

  Widget _glassField(TextEditingController ctrl, String hint,
      {bool autofocus = false}) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(14),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: TextField(
          controller: ctrl,
          autofocus: autofocus,
          style: const TextStyle(
              color: AppColors.textPrimary, fontWeight: FontWeight.w500),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: const TextStyle(color: AppColors.textLight),
            filled: true,
            fillColor: Colors.white.withOpacity(0.35),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide:
                  BorderSide(color: Colors.white.withOpacity(0.5), width: 1.5),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide:
                  BorderSide(color: Colors.white.withOpacity(0.5), width: 1.5),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: BorderSide(
                  color: AppColors.primary.withOpacity(0.6), width: 2),
            ),
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          ),
        ),
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
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: selected
              ? AppColors.primary.withOpacity(0.15)
              : Colors.white.withOpacity(0.4),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: selected
                ? AppColors.primary
                : Colors.white.withOpacity(0.5),
            width: selected ? 2 : 1.5,
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
