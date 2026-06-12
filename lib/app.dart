import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'theme/app_theme.dart';
import 'providers/auth_provider.dart';
import 'providers/family_provider.dart';
import 'screens/auth/welcome_screen.dart';
import 'screens/home/home_screen.dart';
import 'screens/tasks/tasks_screen.dart';
import 'screens/shopping/shopping_screen.dart';

class FamilyOsApp extends StatelessWidget {
  const FamilyOsApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Family OS',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.theme,
      home: const _Root(),
    );
  }
}

class _Root extends StatefulWidget {
  const _Root();

  @override
  State<_Root> createState() => _RootState();
}

class _RootState extends State<_Root> {
  bool _initialized = false;

  @override
  void initState() {
    super.initState();
    _bootstrap();
  }

  Future<void> _bootstrap() async {
    final auth = context.read<AuthProvider>();
    while (auth.isLoading) {
      await Future.delayed(const Duration(milliseconds: 50));
    }
    if (auth.isAuthenticated) {
      await context.read<FamilyProvider>().loadGroup(auth.groupId!);
    }
    setState(() => _initialized = true);
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    if (!_initialized) {
      return _AppBackground(
        child: Scaffold(
          backgroundColor: Colors.transparent,
          body: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: const [
                Text('👨‍👩‍👧‍👦', style: TextStyle(fontSize: 64)),
                SizedBox(height: 16),
                Text(
                  'Family OS',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textPrimary,
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    if (!auth.isAuthenticated) {
      return _AppBackground(child: const WelcomeScreen());
    }

    return const _MainApp();
  }
}

class _AppBackground extends StatelessWidget {
  final Widget child;
  const _AppBackground({required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: AppTheme.backgroundDecoration,
      child: Stack(
        children: [
          // Decorative blobs that make glass effect visible
          Positioned(
            top: -100,
            left: -80,
            child: _Blob(
              size: 320,
              color: AppColors.primary.withOpacity(0.45),
            ),
          ),
          Positioned(
            top: 160,
            right: -100,
            child: _Blob(
              size: 280,
              color: const Color(0xFF44C4FF).withOpacity(0.35),
            ),
          ),
          Positioned(
            top: 420,
            left: 40,
            child: _Blob(
              size: 200,
              color: AppColors.pink.withOpacity(0.28),
            ),
          ),
          Positioned(
            bottom: 100,
            right: -60,
            child: _Blob(
              size: 260,
              color: AppColors.accent.withOpacity(0.3),
            ),
          ),
          Positioned(
            bottom: 300,
            left: -50,
            child: _Blob(
              size: 180,
              color: const Color(0xFFD87BFF).withOpacity(0.3),
            ),
          ),
          child,
        ],
      ),
    );
  }
}

class _Blob extends StatelessWidget {
  final double size;
  final Color color;
  const _Blob({required this.size, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: RadialGradient(
          colors: [color, Colors.transparent],
          stops: const [0.0, 1.0],
        ),
      ),
    );
  }
}

class _MainApp extends StatefulWidget {
  const _MainApp();

  @override
  State<_MainApp> createState() => _MainAppState();
}

class _MainAppState extends State<_MainApp> {
  int _currentIndex = 0;

  final _screens = const [
    HomeScreen(),
    TasksScreen(),
    ShoppingScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return _AppBackground(
      child: Scaffold(
        backgroundColor: Colors.transparent,
        body: SafeArea(
          bottom: false,
          child: IndexedStack(
            index: _currentIndex,
            children: _screens,
          ),
        ),
        bottomNavigationBar: _GlassNavBar(
          currentIndex: _currentIndex,
          onTap: (i) => setState(() => _currentIndex = i),
        ),
      ),
    );
  }
}

class _GlassNavBar extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;

  const _GlassNavBar({required this.currentIndex, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.fromLTRB(20, 0, 20, 20),
      child: SafeArea(
        top: false,
        child: ClipRRect(
          borderRadius: BorderRadius.circular(28),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 24, sigmaY: 24),
            child: Container(
              height: 68,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.3),
                borderRadius: BorderRadius.circular(28),
                border: Border.all(
                  color: Colors.white.withOpacity(0.6),
                  width: 1.5,
                ),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.primary.withOpacity(0.08),
                    blurRadius: 24,
                    offset: const Offset(0, 8),
                  ),
                  BoxShadow(
                    color: Colors.black.withOpacity(0.06),
                    blurRadius: 12,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _NavItem(
                    icon: Icons.home_rounded,
                    label: 'Главная',
                    selected: currentIndex == 0,
                    onTap: () => onTap(0),
                  ),
                  _NavItem(
                    icon: Icons.check_circle_outline_rounded,
                    label: 'Дела',
                    selected: currentIndex == 1,
                    onTap: () => onTap(1),
                  ),
                  _NavItem(
                    icon: Icons.shopping_basket_rounded,
                    label: 'Покупки',
                    selected: currentIndex == 2,
                    onTap: () => onTap(2),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _NavItem({
    required this.icon,
    required this.label,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 250),
        curve: Curves.easeOutCubic,
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        decoration: BoxDecoration(
          gradient: selected
              ? LinearGradient(
                  colors: [
                    AppColors.primary.withOpacity(0.18),
                    AppColors.primaryLight.withOpacity(0.1),
                  ],
                )
              : null,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            AnimatedScale(
              scale: selected ? 1.15 : 1.0,
              duration: const Duration(milliseconds: 200),
              child: Icon(
                icon,
                color: selected ? AppColors.primary : AppColors.textSecondary,
                size: 24,
              ),
            ),
            const SizedBox(height: 3),
            AnimatedDefaultTextStyle(
              duration: const Duration(milliseconds: 200),
              style: TextStyle(
                fontSize: 11,
                fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
                color: selected ? AppColors.primary : AppColors.textSecondary,
              ),
              child: Text(label),
            ),
          ],
        ),
      ),
    );
  }
}
