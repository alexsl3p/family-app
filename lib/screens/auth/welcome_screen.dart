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
  late AnimationController _scaleCtrl;
  late Animation<double> _fade;
  late Animation<double> _float;
  late Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _fadeCtrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 1000));
    _floatCtrl = AnimationController(
        vsync: this, duration: const Duration(seconds: 3))
      ..repeat(reverse: true);
    _scaleCtrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 800));
    _fade = CurvedAnimation(parent: _fadeCtrl, curve: Curves.easeOut);
    _float = Tween<double>(begin: 0, end: 12)
        .animate(CurvedAnimation(parent: _floatCtrl, curve: Curves.easeInOut));
    _scale = Tween<double>(begin: 0.8, end: 1.0)
        .animate(CurvedAnimation(parent: _scaleCtrl, curve: Curves.elasticOut));
    _fadeCtrl.forward();
    _scaleCtrl.forward();
  }

  @override
  void dispose() {
    _fadeCtrl.dispose();
    _floatCtrl.dispose();
    _scaleCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: SafeArea(
        child: FadeTransition(
          opacity: _fade,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 28),
            child: Column(
              children: [
                const Spacer(flex: 2),
                // Logo
                AnimatedBuilder(
                  animation: Listenable.merge([_float, _scale]),
                  builder: (_, child) => Transform.translate(
                    offset: Offset(0, -_float.value),
                    child: Transform.scale(
                      scale: _scale.value,
                      child: child,
                    ),
                  ),
                  child: GlassCard(
                    width: 130,
                    height: 130,
                    borderRadius: 38,
                    opacity: 0.35,
                    child: const Center(
                      child: Text('👨‍👩‍👧‍👦', style: TextStyle(fontSize: 56)),
                    ),
                  ),
                ),
                const SizedBox(height: 36),
                const Text(
                  'Family OS',
                  style: TextStyle(
                    fontSize: 40,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textPrimary,
                    letterSpacing: -1.0,
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  'Всё для семьи — в одном месте',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 16,
                    color: AppColors.textSecondary,
                    height: 1.5,
                    letterSpacing: 0.1,
                  ),
                ),
                const Spacer(flex: 3),
                GlassButton(
                  label: 'Создать семью',
                  icon: Icons.add_rounded,
                  onTap: () => _showCreateDialog(context),
                ),
                const SizedBox(height: 14),
                GlassButton(
                  label: 'Войти в семью',
                  icon: Icons.group_add_rounded,
                  isPrimary: false,
                  onTap: () => _showJoinDialog(context),
                ),
                const SizedBox(height: 48),
              ],
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
  String _color = '#6E5FFF';
  bool _loading = false;

  final _emojis = ['😊', '👦', '👧', '👨', '👩', '👴', '👵', '🧑'];
  final _colors = [
    '#6E5FFF', '#FF6B9D', '#3DCFCF', '#FFB347', '#5DB8FF', '#D87BFF'
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
      final group = await SupabaseService.createGroup(_familyCtrl.text.trim());
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
          _glassField('Название семьи', _familyCtrl, hint: 'Семья Ивановых'),
          const SizedBox(height: 16),
          _glassField('Ваше имя', _nameCtrl, hint: 'Папа / Мама / Имя'),
          const SizedBox(height: 20),
          _label('Аватар'),
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
                        : Colors.white.withOpacity(0.4),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: selected ? AppColors.primary : Colors.white.withOpacity(0.5),
                      width: selected ? 2 : 1,
                    ),
                  ),
                  child: Center(child: Text(e, style: const TextStyle(fontSize: 22))),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 20),
          _label('Цвет'),
          const SizedBox(height: 10),
          Row(
            children: _colors.map((c) {
              final selected = c == _color;
              final col = Color(int.parse(c.replaceFirst('#', '0xFF')));
              return GestureDetector(
                onTap: () => setState(() => _color = c),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  margin: const EdgeInsets.only(right: 10),
                  width: 34,
                  height: 34,
                  decoration: BoxDecoration(
                    color: col,
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: selected ? Colors.white : Colors.transparent,
                      width: 3,
                    ),
                    boxShadow: selected
                        ? [BoxShadow(color: col.withOpacity(0.5), blurRadius: 10)]
                        : [],
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 28),
          GlassButton(label: 'Создать', onTap: _create, isLoading: _loading),
        ],
      ),
    );
  }

  Widget _label(String text) => Text(
        text,
        style: const TextStyle(
          fontWeight: FontWeight.w600,
          color: AppColors.textSecondary,
          fontSize: 13,
        ),
      );

  Widget _glassField(String label, TextEditingController ctrl,
      {String hint = ''}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _label(label),
        const SizedBox(height: 8),
        ClipRRect(
          borderRadius: BorderRadius.circular(14),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
            child: TextField(
              controller: ctrl,
              style: const TextStyle(
                  color: AppColors.textPrimary, fontWeight: FontWeight.w500),
              decoration: InputDecoration(
                hintText: hint,
                hintStyle: const TextStyle(color: AppColors.textLight),
                filled: true,
                fillColor: Colors.white.withOpacity(0.35),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: BorderSide(color: Colors.white.withOpacity(0.5), width: 1.5),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: BorderSide(color: Colors.white.withOpacity(0.5), width: 1.5),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: BorderSide(color: AppColors.primary.withOpacity(0.6), width: 2),
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
        color: '#6E5FFF',
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
      setState(() => _error = 'Ошибка. Попробуйте ещё раз.');
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
          _glassField('Код приглашения', _codeCtrl, hint: 'AB12CD34'),
          const SizedBox(height: 16),
          _glassField('Ваше имя', _nameCtrl, hint: 'Папа / Мама / Имя'),
          const SizedBox(height: 20),
          _label('Аватар'),
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
                        : Colors.white.withOpacity(0.4),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: selected ? AppColors.primary : Colors.white.withOpacity(0.5),
                      width: selected ? 2 : 1,
                    ),
                  ),
                  child: Center(child: Text(e, style: const TextStyle(fontSize: 22))),
                ),
              );
            }).toList(),
          ),
          if (_error != null) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.error.withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: AppColors.error.withOpacity(0.3)),
              ),
              child: Text(_error!,
                  style: const TextStyle(color: AppColors.error, fontSize: 14)),
            ),
          ],
          const SizedBox(height: 28),
          GlassButton(label: 'Войти', onTap: _join, isLoading: _loading),
        ],
      ),
    );
  }

  Widget _label(String text) => Text(
        text,
        style: const TextStyle(
          fontWeight: FontWeight.w600,
          color: AppColors.textSecondary,
          fontSize: 13,
        ),
      );

  Widget _glassField(String label, TextEditingController ctrl,
      {String hint = ''}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _label(label),
        const SizedBox(height: 8),
        ClipRRect(
          borderRadius: BorderRadius.circular(14),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
            child: TextField(
              controller: ctrl,
              style: const TextStyle(
                  color: AppColors.textPrimary, fontWeight: FontWeight.w500),
              decoration: InputDecoration(
                hintText: hint,
                hintStyle: const TextStyle(color: AppColors.textLight),
                filled: true,
                fillColor: Colors.white.withOpacity(0.35),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: BorderSide(color: Colors.white.withOpacity(0.5), width: 1.5),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: BorderSide(color: Colors.white.withOpacity(0.5), width: 1.5),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: BorderSide(color: AppColors.primary.withOpacity(0.6), width: 2),
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
          Text(title,
              style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textPrimary)),
          const SizedBox(height: 24),
          child,
        ],
      ),
    );
  }
}
