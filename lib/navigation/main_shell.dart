import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'dart:ui';
import '../core/theme/app_colors.dart';
import 'package:google_fonts/google_fonts.dart';

class MainShell extends StatefulWidget {
  final Widget child;
  const MainShell({super.key, required this.child});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  bool _fabOpen = false;

  static const _tabs = [
    _Tab(icon: Icons.home_outlined, activeIcon: Icons.home, label: 'Главная', path: '/'),
    _Tab(icon: Icons.check_circle_outline, activeIcon: Icons.check_circle, label: 'Дела', path: '/tasks'),
    _Tab(icon: Icons.shopping_cart_outlined, activeIcon: Icons.shopping_cart, label: 'Покупки', path: '/shopping'),
    _Tab(icon: Icons.people_outline, activeIcon: Icons.people, label: 'Семья', path: '/family'),
  ];

  static const _fabActions = [
    _FabAction(icon: Icons.check_circle_outline, label: 'Добавить дело', path: '/tasks'),
    _FabAction(icon: Icons.add_shopping_cart, label: 'Добавить товар', path: '/shopping'),
    _FabAction(icon: Icons.list_alt, label: 'Создать список', path: '/shopping'),
  ];

  int _currentIndex(BuildContext context) {
    final location = GoRouterState.of(context).uri.toString();
    if (location.startsWith('/tasks')) return 1;
    if (location.startsWith('/shopping')) return 2;
    if (location.startsWith('/family')) return 3;
    return 0;
  }

  @override
  Widget build(BuildContext context) {
    final idx = _currentIndex(context);
    final bottomPad = MediaQuery.of(context).padding.bottom;

    return Scaffold(
      backgroundColor: AppColors.bg,
      extendBody: true,
      body: Stack(
        children: [
          widget.child,
          // FAB overlay
          if (_fabOpen)
            Positioned.fill(
              child: GestureDetector(
                onTap: () => setState(() => _fabOpen = false),
                child: Container(
                  color: Colors.black.withOpacity(0.6),
                  alignment: Alignment.bottomCenter,
                  padding: EdgeInsets.only(bottom: 90 + bottomPad),
                  child: _buildFabMenu(),
                ),
              ),
            ),
        ],
      ),
      bottomNavigationBar: _buildNavBar(context, idx, bottomPad),
    );
  }

  Widget _buildFabMenu() {
    return ClipRRect(
      borderRadius: BorderRadius.circular(20),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 20),
          decoration: BoxDecoration(
            color: const Color(0xFF1A213A).withOpacity(0.95),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: AppColors.glassBorder),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: _fabActions.asMap().entries.map((e) {
              final i = e.key;
              final a = e.value;
              return InkWell(
                onTap: () {
                  setState(() => _fabOpen = false);
                  context.go(a.path);
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: i < _fabActions.length - 1
                      ? const BoxDecoration(border: Border(bottom: BorderSide(color: Color(0x14FFFFFF))))
                      : null,
                  child: Row(
                    children: [
                      Container(
                        width: 38, height: 38,
                        decoration: BoxDecoration(
                          color: AppColors.accentLight,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Icon(a.icon, color: AppColors.accent, size: 18),
                      ),
                      const SizedBox(width: 12),
                      Text(a.label, style: GoogleFonts.inter(
                        fontSize: 15, fontWeight: FontWeight.w500, color: AppColors.textPrimary,
                      )),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
        ),
      ),
    );
  }

  Widget _buildNavBar(BuildContext context, int currentIdx, double bottomPad) {
    return ClipRRect(
      borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
        child: Container(
          padding: EdgeInsets.only(
            left: 8, right: 8, top: 8,
            bottom: bottomPad > 0 ? bottomPad : 12,
          ),
          decoration: const BoxDecoration(
            color: AppColors.tabBar,
            border: Border(top: BorderSide(color: AppColors.tabBarBorder)),
          ),
          child: Row(
            children: [
              ...[0, 1].map((i) => _buildTabItem(context, _tabs[i], i == currentIdx)),
              // FAB
              GestureDetector(
                onTap: () => setState(() => _fabOpen = !_fabOpen),
                child: Container(
                  width: 52, height: 52,
                  margin: const EdgeInsets.only(bottom: 2),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF7C3AED), Color(0xFF8B35FF)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.accent.withOpacity(0.45),
                        blurRadius: 16, offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Icon(
                    _fabOpen ? Icons.close : Icons.add,
                    color: Colors.white, size: 24,
                  ),
                ),
              ),
              ...[2, 3].map((i) => _buildTabItem(context, _tabs[i], i == currentIdx)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTabItem(BuildContext context, _Tab tab, bool isActive) {
    return Expanded(
      child: GestureDetector(
        onTap: () => context.go(tab.path),
        child: Center(
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
            decoration: BoxDecoration(
              color: isActive ? AppColors.tabBarActiveContainer : Colors.transparent,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  isActive ? tab.activeIcon : tab.icon,
                  color: isActive ? AppColors.tabBarActive : AppColors.tabBarInactive,
                  size: 22,
                ),
                const SizedBox(height: 3),
                Text(
                  tab.label,
                  style: GoogleFonts.inter(
                    fontSize: 10,
                    fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
                    color: isActive ? AppColors.tabBarActive : AppColors.tabBarInactive,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _Tab {
  final IconData icon, activeIcon;
  final String label, path;
  const _Tab({required this.icon, required this.activeIcon, required this.label, required this.path});
}

class _FabAction {
  final IconData icon;
  final String label, path;
  const _FabAction({required this.icon, required this.label, required this.path});
}
