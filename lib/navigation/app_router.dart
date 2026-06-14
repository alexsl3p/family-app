import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'main_shell.dart';
import '../features/home/home_screen.dart';
import '../features/tasks/tasks_screen.dart';
import '../features/shopping/shopping_screen.dart';
import '../features/shopping/shopping_detail_screen.dart';
import '../features/family/family_screen.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _shellNavigatorKey = GlobalKey<NavigatorState>();

final appRouter = GoRouter(
  navigatorKey: _rootNavigatorKey,
  initialLocation: '/',
  routes: [
    ShellRoute(
      navigatorKey: _shellNavigatorKey,
      builder: (context, state, child) => MainShell(child: child),
      routes: [
        GoRoute(path: '/', builder: (_, __) => const HomeScreen()),
        GoRoute(path: '/tasks', builder: (_, __) => const TasksScreen()),
        GoRoute(path: '/shopping', builder: (_, __) => const ShoppingScreen()),
        GoRoute(
          path: '/shopping/:id',
          builder: (_, state) => ShoppingDetailScreen(listId: state.pathParameters['id']!),
        ),
        GoRoute(path: '/family', builder: (_, __) => const FamilyScreen()),
      ],
    ),
  ],
);
