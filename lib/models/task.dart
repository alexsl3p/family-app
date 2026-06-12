class FamilyTask {
  final String id;
  final String groupId;
  final String title;
  final String? description;
  final String? assignedTo;
  final String? createdBy;
  final DateTime? dueDate;
  final bool isDone;
  final String priority;
  final DateTime createdAt;
  final DateTime updatedAt;

  FamilyTask({
    required this.id,
    required this.groupId,
    required this.title,
    this.description,
    this.assignedTo,
    this.createdBy,
    this.dueDate,
    this.isDone = false,
    this.priority = 'normal',
    required this.createdAt,
    required this.updatedAt,
  });

  factory FamilyTask.fromMap(Map<String, dynamic> map) {
    return FamilyTask(
      id: map['id'] as String,
      groupId: map['group_id'] as String,
      title: map['title'] as String,
      description: map['description'] as String?,
      assignedTo: map['assigned_to'] as String?,
      createdBy: map['created_by'] as String?,
      dueDate: map['due_date'] != null
          ? DateTime.parse(map['due_date'] as String)
          : null,
      isDone: map['is_done'] as bool? ?? false,
      priority: map['priority'] as String? ?? 'normal',
      createdAt: DateTime.parse(map['created_at'] as String),
      updatedAt: DateTime.parse(map['updated_at'] as String),
    );
  }

  Map<String, dynamic> toMap() => {
        'group_id': groupId,
        'title': title,
        'description': description,
        'assigned_to': assignedTo,
        'created_by': createdBy,
        'due_date': dueDate?.toIso8601String().split('T').first,
        'is_done': isDone,
        'priority': priority,
      };

  FamilyTask copyWith({
    String? title,
    String? description,
    String? assignedTo,
    String? createdBy,
    DateTime? dueDate,
    bool? isDone,
    String? priority,
  }) =>
      FamilyTask(
        id: id,
        groupId: groupId,
        title: title ?? this.title,
        description: description ?? this.description,
        assignedTo: assignedTo ?? this.assignedTo,
        createdBy: createdBy ?? this.createdBy,
        dueDate: dueDate ?? this.dueDate,
        isDone: isDone ?? this.isDone,
        priority: priority ?? this.priority,
        createdAt: createdAt,
        updatedAt: DateTime.now(),
      );

  String get duePeriod {
    if (dueDate == null) return 'Без срока';
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final due = DateTime(dueDate!.year, dueDate!.month, dueDate!.day);
    final diff = due.difference(today).inDays;
    if (diff < 0) return 'Просрочено';
    if (diff == 0) return 'Сегодня';
    if (diff == 1) return 'Завтра';
    if (diff <= 7) return 'На этой неделе';
    if (diff <= 14) return 'На след. неделе';
    return 'Следующий месяц';
  }
}
