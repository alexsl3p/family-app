class FamilyMember {
  final String id;
  final String groupId;
  final String? userId;
  final String name;
  final String avatarEmoji;
  final String color;
  final String role;
  final DateTime createdAt;

  FamilyMember({
    required this.id,
    required this.groupId,
    this.userId,
    required this.name,
    this.avatarEmoji = '👤',
    this.color = '#6C63FF',
    this.role = 'member',
    required this.createdAt,
  });

  factory FamilyMember.fromMap(Map<String, dynamic> map) {
    return FamilyMember(
      id: map['id'] as String,
      groupId: map['group_id'] as String,
      userId: map['user_id'] as String?,
      name: map['name'] as String,
      avatarEmoji: map['avatar_emoji'] as String? ?? '👤',
      color: map['color'] as String? ?? '#6C63FF',
      role: map['role'] as String? ?? 'member',
      createdAt: DateTime.parse(map['created_at'] as String),
    );
  }

  Map<String, dynamic> toMap() => {
        'group_id': groupId,
        'user_id': userId,
        'name': name,
        'avatar_emoji': avatarEmoji,
        'color': color,
        'role': role,
      };

  FamilyMember copyWith({
    String? name,
    String? avatarEmoji,
    String? color,
    String? role,
  }) =>
      FamilyMember(
        id: id,
        groupId: groupId,
        userId: userId,
        name: name ?? this.name,
        avatarEmoji: avatarEmoji ?? this.avatarEmoji,
        color: color ?? this.color,
        role: role ?? this.role,
        createdAt: createdAt,
      );
}
