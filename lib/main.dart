import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:provider/provider.dart';
import 'app.dart';
import 'providers/auth_provider.dart';
import 'providers/family_provider.dart';
import 'providers/tasks_provider.dart';
import 'providers/shopping_provider.dart';

const String supabaseUrl = 'https://eclrkusmwcrtnxqhzpky.supabase.co';
const String supabaseAnonKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjbHJrdXNtd2NydG54cWh6cGt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMDU3ODEsImV4cCI6MjA5MTU4MTc4MX0.FpTqRxDFBToOCyfjJCOj2NvOwTol__4qGDgLp6Q8JUg';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Supabase.initialize(url: supabaseUrl, anonKey: supabaseAnonKey);

  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    statusBarIconBrightness: Brightness.dark,
  ));
  SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => FamilyProvider()),
        ChangeNotifierProxyProvider<FamilyProvider, TasksProvider>(
          create: (_) => TasksProvider(),
          update: (_, family, tasks) => tasks!..setGroupId(family.currentGroupId),
        ),
        ChangeNotifierProxyProvider<FamilyProvider, ShoppingProvider>(
          create: (_) => ShoppingProvider(),
          update: (_, family, shopping) => shopping!..setGroupId(family.currentGroupId),
        ),
      ],
      child: const FamilyOsApp(),
    ),
  );
}
