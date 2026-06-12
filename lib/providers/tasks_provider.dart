import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/task.dart';
import '../services/supabase_service.dart';

class TasksProvider extends ChangeNotifier {
  List<FamilyTask> _tasks = [];
  String? _groupId;
  bool _isLoading = false;
  RealtimeChannel? _channel;

  List<FamilyTask> get tasks => _tasks;
  bool get isLoading => _isLoading;

  List<FamilyTask> get pending => _tasks.where((t) => !t.isDone).toList();
  List<FamilyTask> get done => _tasks.where((t) => t.isDone).toList();

  List<FamilyTask> tasksForMember(String memberId) =>
      _tasks.where((t) => t.assignedTo == memberId && !t.isDone).toList();

  Map<String, List<FamilyTask>> get groupedByPeriod {
    final Map<String, List<FamilyTask>> groups = {};
    const order = [
      'Просрочено',
      'Сегодня',
      'Завтра',
      'На этой неделе',
      'На след. неделе',
      'Следующий месяц',
      'Без срока',
    ];
    for (final period in order) {
      final list = pending.where((t) => t.duePeriod == period).toList();
      if (list.isNotEmpty) groups[period] = list;
    }
    return groups;
  }

  void setGroupId(String? groupId) {
    if (groupId == _groupId) return;
    _groupId = groupId;
    if (groupId != null) {
      load();
      _subscribeRealtime();
    }
  }

  Future<void> load() async {
    if (_groupId == null) return;
    _isLoading = true;
    notifyListeners();
    try {
      _tasks = await SupabaseService.getTasks(_groupId!);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void _subscribeRealtime() {
    _channel?.unsubscribe();
    if (_groupId == null) return;
    _channel = SupabaseService.subscribeToTasks(_groupId!, (_) => load());
  }

  Future<void> addTask(FamilyTask task) async {
    final created = await SupabaseService.createTask(task);
    _tasks.insert(0, created);
    notifyListeners();
  }

  Future<void> toggleDone(String taskId) async {
    final idx = _tasks.indexWhere((t) => t.id == taskId);
    if (idx == -1) return;
    final updated = _tasks[idx].copyWith(isDone: !_tasks[idx].isDone);
    _tasks[idx] = updated;
    notifyListeners();
    await SupabaseService.updateTask(taskId, {'is_done': updated.isDone});
  }

  Future<void> deleteTask(String taskId) async {
    _tasks.removeWhere((t) => t.id == taskId);
    notifyListeners();
    await SupabaseService.deleteTask(taskId);
  }

  @override
  void dispose() {
    _channel?.unsubscribe();
    super.dispose();
  }
}
