import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/widgets/avatar_bubble.dart';
import '../../core/widgets/screen_background.dart';

const _tagColors = {
  'Покупки': Color(0xFF60A5FA),
  'Дети': Color(0xFF4ADE80),
  'Финансы': Color(0xFFFFBF24),
  'Дом': Color(0xFFC084FC),
  'Работа': Color(0xFFF87171),
  'Питомцы': Color(0xFF34D399),
};

const _assigneeColors = {
  'Мама': Color(0xFF4A90FF),
  'Папа': Color(0xFF60A5FA),
};

class _Task {
  final String id, title, due, assignee, tag;
  final bool done, priority;
  const _Task({
    required this.id,
    required this.title,
    required this.due,
    required this.assignee,
    required this.done,
    required this.tag,
    required this.priority,
  });
}

const _tasks = [
  _Task(id: '1', title: 'Купить продукты', due: 'Сегодня, 17:00', assignee: 'Мама', done: false, tag: 'Покупки', priority: true),
  _Task(id: '2', title: 'Забрать детей из школы', due: 'Сегодня, 15:00', assignee: 'Папа', done: false, tag: 'Дети', priority: false),
  _Task(id: '3', title: 'Оплатить коммунальные', due: 'Завтра', assignee: '', done: false, tag: 'Финансы', priority: false),
  _Task(id: '4', title: 'Убраться в гараже', due: 'Суббота', assignee: '', done: false, tag: 'Дом', priority: false),
  _Task(id: '5', title: 'Записать Машу к врачу', due: '13 июня', assignee: 'Мама', done: true, tag: 'Дети', priority: false),
];

class TasksScreen extends StatefulWidget {
  const TasksScreen({super.key});

  @override
  State<TasksScreen> createState() => _TasksScreenState();
}

class _TasksScreenState extends State<TasksScreen> {
  String _filter = 'Все';
  static const _filters = ['Все', 'Мои', 'Выполненные'];

  @override
  Widget build(BuildContext context) {
    final filtered = _tasks.where((t) {
      if (_filter == 'Мои') return t.assignee == 'Мама' && !t.done;
      if (_filter == 'Выполненные') return t.done;
      return !t.done;
    }).toList();

    return ScreenBackground(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 10),
            child: Row(
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Семейные дела', style: AppTextStyles.h1),
                    Text('${_tasks.where((t) => !t.done).length} на сегодня',
                        style: AppTextStyles.label),
                  ],
                ),
                const Spacer(),
                Container(
                  width: 34, height: 34,
                  decoration: BoxDecoration(color: AppColors.accent, shape: BoxShape.circle,
                    boxShadow: [BoxShadow(color: AppColors.accent.withOpacity(0.4), blurRadius: 10)],
                  ),
                  child: const Icon(Icons.add, color: Colors.white, size: 20),
                ),
              ],
            ),
          ),
          // Filter chips
          SizedBox(
            height: 36,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 0),
              children: _filters.map((f) {
                final active = _filter == f;
                return GestureDetector(
                  onTap: () => setState(() => _filter = f),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 180),
                    margin: const EdgeInsets.only(right: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                    decoration: BoxDecoration(
                      color: active ? AppColors.accent : Colors.white.withOpacity(0.08),
                      borderRadius: BorderRadius.circular(99),
                      border: Border.all(
                        color: active ? AppColors.accent : Colors.white.withOpacity(0.12),
                      ),
                    ),
                    child: Text(f, style: GoogleFonts.inter(
                      fontSize: 12, fontWeight: active ? FontWeight.w600 : FontWeight.w500,
                      color: active ? Colors.white : AppColors.textSecondary,
                    )),
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 12),
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 100),
              itemCount: filtered.isEmpty ? 1 : filtered.length,
              separatorBuilder: (_, __) => const SizedBox(height: 10),
              itemBuilder: (_, i) {
                if (filtered.isEmpty) {
                  return Center(child: Padding(
                    padding: const EdgeInsets.only(top: 40),
                    child: Text('Нет дел', style: AppTextStyles.bodySm),
                  ));
                }
                return _TaskCard(task: filtered[i]);
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _TaskCard extends StatelessWidget {
  final _Task task;
  const _TaskCard({required this.task});

  @override
  Widget build(BuildContext context) {
    final accent = _tagColors[task.tag] ?? AppColors.accent;
    return ClipRRect(
      borderRadius: BorderRadius.circular(18),
      child: Stack(
        children: [
          GlassCard(
            padding: const EdgeInsets.fromLTRB(18, 10, 12, 10),
            child: Column(
              children: [
                Row(
                  children: [
                    // Checkbox
                    Container(
                      width: 18, height: 18,
                      decoration: BoxDecoration(
                        color: task.done ? accent : Colors.transparent,
                        border: Border.all(
                          color: task.done ? accent : Colors.white38, width: 1.5,
                        ),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: task.done ? const Icon(Icons.check, size: 12, color: Colors.white) : null,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(task.title, style: GoogleFonts.inter(
                            fontSize: 14, fontWeight: FontWeight.w600,
                            color: task.done ? AppColors.textMuted : AppColors.textPrimary,
                            decoration: task.done ? TextDecoration.lineThrough : null,
                          )),
                          const SizedBox(height: 2),
                          Row(
                            children: [
                              const Icon(Icons.calendar_today_outlined, size: 11, color: AppColors.textMuted),
                              const SizedBox(width: 3),
                              Text(task.due, style: AppTextStyles.caption),
                            ],
                          ),
                        ],
                      ),
                    ),
                    if (task.assignee.isNotEmpty) ...[
                      const SizedBox(width: 8),
                      AvatarBubble(
                        name: task.assignee,
                        color: _assigneeColors[task.assignee] ?? AppColors.accent,
                        size: 28,
                      ),
                    ],
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    _tagPill(task.tag, accent),
                    if (task.priority) ...[
                      const SizedBox(width: 6),
                      _tagPill('★ Приоритет', AppColors.pink),
                    ],
                  ],
                ),
              ],
            ),
          ),
          // Left color rail
          Positioned(
            left: 0, top: 0, bottom: 0,
            child: Container(
              width: 3,
              decoration: BoxDecoration(
                color: accent,
                borderRadius: const BorderRadius.horizontal(left: Radius.circular(18)),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _tagPill(String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: color.withOpacity(0.15),
        borderRadius: BorderRadius.circular(99),
        border: Border.all(color: color.withOpacity(0.35)),
      ),
      child: Text(label, style: GoogleFonts.inter(
        fontSize: 10, fontWeight: FontWeight.w600, color: color,
      )),
    );
  }
}
