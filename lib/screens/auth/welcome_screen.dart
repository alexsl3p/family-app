import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../theme/app_theme.dart';
import '../../widgets/glass_card.dart';
import '../../providers/auth_provider.dart';
import '../../providers/family_provider.dart';
import '../../services/supabase_service.dart';

class WelcomeScreen extends StatefulWidget {
  const WelcomeScreen({super.key});

  @override
  State<WelcomeScreen> createState() => _WelcomeScreenState();
}

class _WelcomeScreenState extends State<WelcomeScreen>
    with TickerProviderStateMixin {
  late AnimationController _fadeCtrl;
  late AnimationController _floatCtrl;
  late Animation<double> _fade;
  late Animation<double> _float;

  @override
  void initState() {
    super.initState();
    _fadeCtrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 900));
    _floatCtrl = AnimationController(
        vsync: this, duration: const Duration(seconds: 3))
      ..repeat(reverse: true);
    _fade = CurvedAnimation(parent: _fadeCtrl, curve: Curves.easeOut);
    _float = Tween<double>(begin: 0, end: 10)
        .animate(CurvedAnimation(parent: _floatCtrl, curve: Curves.easeInOut));
    _fadeCtrl.forward();
  }

  @override
  void dispose() {
    _fadeCtrl.dispose();
    _floatCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: AppTheme.backgroundDecoration,
        child: SafeArea(
          child: FadeTransition(
            opacity: _fade,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 28),
              child: Column(
                children: [
                  const Spacer(flex: 2),
                  AnimatedBuilder(
                    animation: _float,
                    builder: (_, child) => Transform.translate(
                      offset: Offset(0, -_float.value),
                      child: child,
                    ),
                    child: GlassCard(
                      width: 120,
                      height: 120,
                      borderRadius: 36,
                      opacity: 0.3,
                      child: const Center(
                        child: Text('👨‍👩‍👧‍👦',
                            style: TextStyle(fontSize: 52)),
                      ),
                    ),
                  ),
                  const SizedBox(height: 32),
                  const Text(
                    'Family OS',
                    style: TextStyle(
                      fontSize: 36,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textPrimary,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Всё нужное для каждой семьи\nв одном месте',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 16,
                      color: AppColors.textSecondary,
                      height: 1.5,
                    ),
                  ),
                  const Spacer(flex: 3),
                  GlassButton(
                    label: 'Создать семью',
                    icon: Icons.add_rounded,
                    onTap: () => _showCreateDialog(context),
                  ),
                  const SizedBox(height: 12),
                  GlassButton(
                    label: 'Войти в семью',
                    icon: Icons.group_add_rounded,
                    isPrimary: false,
                    onTap: () => _showJoinDialog(context),
                  ),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  void _showCreateDialog(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _CreateFamilySheet(parent: context),
    );
  }

  void _showJoinDialog(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _JoinFamilySheet(parent: context),
    );
  }
}

class _CreateFamilySheet extends StatefulWidget {
  final BuildContext parent;
  const _CreateFamilySheet({required this.parent});

  @override
  State<_CreateFamilySheet> createState() => _CreateFamilySheetState();
}

class _CreateFamilySheetState extends State<_CreateFamilySheet> {
  final _familyCtrl = TextEditingController();
  final _nameCtrl = TextEditingController();
  String _emoji = '😊';
  String _color = '#6C63FF';
  bool _loading = false;

  final _emojis = ['😊', '👦', '👧', '👨', '👩', '👴', '👵', '🧑'];
  final _colors = [
    '#6C63FF', '#FF6584', '#43D9AD', '#FFB347', '#87CEEB', '#DDA0DD'
  ];

  @override
  void dispose() {
    _familyCtrl.dispose();
    _nameCtrl.dispose();
    super.dispose();
  }

  Future<void> _create() async {
    if (_familyCtrl.text.trim().isEmpty || _nameCtrl.text.trim().isEmpty) {
      return;
    }
    setState(() => _loading = true);
    try {
      final group =
          await SupabaseService.createGroup(_familyCtrl.text.trim());
      final member = await SupabaseService.createMember(
        groupId: group['id'] as String,
        name: _nameCtrl.text.trim(),
        avatarEmoji: _emoji,
        color: _color,
        role: 'admin',
      );
      final auth = widget.parent.read<AuthProvider>();
      final family = widget.parent.read<FamilyProvider>();
      await auth.saveSession(
        groupId: group['id'] as String,
        memberId: member.id,
        memberName: member.name,
      );
      await family.loadGroup(group['id'] as String);
      if (mounted) Navigator.pop(context);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return _BottomSheet(
      title: 'Создать семью',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _field('Название семьи', _familyCtrl, hint: 'Семья Ивановых'),
          const SizedBox(height: 16),
          _field('Ваше имя', _nameCtrl, hint: 'Папа / Мама / Имя'),
          const SizedBox(height: 20),
          const Text('Аватар',
              style: TextStyle(
                  fontWeight: FontWeight.w600,
                  color: AppColors.textSecondary,
                  fontSize: 13)),
          const SizedBox(height: 10),
          Row(
            children: _emojis.map((e) {
              final selected = e == _emoji;
              return GestureDetector(
                onTap: () => setState(() => _emoji = e),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  margin: const EdgeInsets.only(right: 8),
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: selected
                        ? AppColors.primary.withOpacity(0.15)
                        : Colors.white.withOpacity(0.3),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: selected
                          ? AppColors.primary
                          : Colors.white.withOpacity(0.4),
                      width: selected ? 2 : 1,
                    ),
                  ),
                  child: Center(
                      child: Text(e, style: const TextStyle(fontSize: 22))),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 20),
          const Text('Цвет',
              style: TextStyle(
                  fontWeight: FontWeight.w600,
                  color: AppColors.textSecondary,
                  fontSize: 13)),
          const SizedBox(height: 10),
          Row(
            children: _colors.map((c) {
              final selected = c == _color;
              final col = _hexColor(c);
              return GestureDetector(
                onTap: () => setState(() => _color = c),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  margin: const EdgeInsets.only(right: 10),
                  width: 32,
                  height: 32,
                  decoration: BoxDecoration(
                    color: col,
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: selected ? Colors.white : Colors.transparent,
                      width: 3,
                    ),
                    boxShadow: selected
                        ? [BoxShadow(color: col.withOpacity(0.5), blurRadius: 8)]
                        : [],
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 28),
          GlassButton(
              label: 'Создать', onTap: _create, isLoading: _loading),
        ],
      ),
    );
  }

  Color _hexColor(String hex) {
    return Color(int.parse(hex.replaceFirst('#', '0xFF')));
  }

  Widget _field(String label, TextEditingController ctrl, {String hint = ''}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label,
            style: const TextStyle(
                fontWeight: FontWeight.w600,
                color: AppColors.textSecondary,
                fontSize: 13)),
        const SizedBox(height: 8),
        ClipRRect(
          borderRadius: BorderRadius.circular(14),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 8, sigmaY: 8),
            child: TextField(
              controller: ctrl,
              style: const TextStyle(
                  color: AppColors.textPrimary, fontWeight: FontWeight.w500),
              decoration: InputDecoration(
                hintText: hint,
                hintStyle: const TextStyle(color: AppColors.textLight),
                filled: true,
                fillColor: Colors.white.withOpacity(0.25),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide:
                      BorderSide(color: Colors.white.withOpacity(0.3), width: 1),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide:
                      BorderSide(color: Colors.white.withOpacity(0.3), width: 1),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide:
                      BorderSide(color: AppColors.primary.withOpacity(0.5), width: 1.5),
                ),
                contentPadding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _JoinFamilySheet extends StatefulWidget {
  final BuildContext parent;
  const _JoinFamilySheet({required this.parent});

  @override
  State<_JoinFamilySheet> createState() => _JoinFamilySheetState();
}

class _JoinFamilySheetState extends State<_JoinFamilySheet> {
  final _codeCtrl = TextEditingController();
  final _nameCtrl = TextEditingController();
  String _emoji = '😊';
  bool _loading = false;
  String? _error;

  final _emojis = ['😊', '👦', '👧', '👨', '👩', '👴', '👵', '🧑'];

  @override
  void dispose() {
    _codeCtrl.dispose();
    _nameCtrl.dispose();
    super.dispose();
  }

  Future<void> _join() async {
    if (_codeCtrl.text.trim().isEmpty || _nameCtrl.text.trim().isEmpty) return;
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final group =
          await SupabaseService.getGroupByInviteCode(_codeCtrl.text.trim());
      if (group == null) {
        setState(() => _error = 'Семья не найдена. Проверьте код.');
        return;
      }
      final member = await SupabaseService.createMember(
        groupId: group['id'] as String,
        name: _nameCtrl.text.trim(),
        avatarEmoji: _emoji,
        color: '#6C63FF',
      );
      final auth = widget.parent.read<AuthProvider>();
      final family = widget.parent.read<FamilyProvider>();
      await auth.saveSession(
        groupId: group['id'] as String,
        memberId: member.id,
        memberName: member.name,
      );
      await family.loadGroup(group['id'] as String);
      if (mounted) Navigator.pop(context);
    } catch (e) {
      setState(() => _error = 'Ошибка подключения. Попробуйте ещё раз.');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return _BottomSheet(
      title: 'Войти в семью',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _field('Код приглашения', _codeCtrl, hint: 'ab12cd34'),
          const SizedBox(height: 16),
          _field('Ваше имя', _nameCtrl, hint: 'Папа / Мама / Имя'),
          const SizedBox(height: 20),
          const Text('Аватар',
              style: TextStyle(
                  fontWeight: FontWeight.w600,
                  color: AppColors.textSecondary,
                  fontSize: 13)),
          const SizedBox(height: 10),
          Row(
            children: _emojis.map((e) {
              final selected = e == _emoji;
              return GestureDetector(
                onTap: () => setState(() => _emoji = e),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  margin: const EdgeInsets.only(right: 8),
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: selected
                        ? AppColors.primary.withOpacity(0.15)
                        : Colors.white.withOpacity(0.3),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: selected
                          ? AppColors.primary
                          : Colors.white.withOpacity(0.4),
                      width: selected ? 2 : 1,
                    ),
                  ),
                  child: Center(
                      child: Text(e, style: const TextStyle(fontSize: 22))),
                ),
              );
            }).toList(),
          ),
          if (_error != null) ...[
            const SizedBox(height: 16),
            Text(_error!,
                style:
                    const TextStyle(color: AppColors.error, fontSize: 14)),
          ],
          const SizedBox(height: 28),
          GlassButton(label: 'Войти', onTap: _join, isLoading: _loading),
        ],
      ),
    );
  }

  Widget _field(String label, TextEditingController ctrl, {String hint = ''}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label,
            style: const TextStyle(
                fontWeight: FontWeight.w600,
                color: AppColors.textSecondary,
                fontSize: 13)),
        const SizedBox(height: 8),
        ClipRRect(
          borderRadius: BorderRadius.circular(14),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 8, sigmaY: 8),
            child: TextField(
              controller: ctrl,
              style: const TextStyle(
                  color: AppColors.textPrimary, fontWeight: FontWeight.w500),
              decoration: InputDecoration(
                hintText: hint,
                hintStyle: const TextStyle(color: AppColors.textLight),
                filled: true,
                fillColor: Colors.white.withOpacity(0.25),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide:
                      BorderSide(color: Colors.white.withOpacity(0.3), width: 1),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide:
                      BorderSide(color: Colors.white.withOpacity(0.3), width: 1),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: BorderSide(
                      color: AppColors.primary.withOpacity(0.5), width: 1.5),
                ),
                contentPadding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _BottomSheet extends StatelessWidget {
  final String title;
  final Widget child;

  const _BottomSheet({required this.title, required this.child});

  @override
  Widget build(BuildContext context) {
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
          Text(title,
              style: const TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary)),
          const SizedBox(height: 24),
          child,
        ],
      ),
    );
  }
}
