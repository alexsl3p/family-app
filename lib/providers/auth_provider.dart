import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthProvider extends ChangeNotifier {
  String? _groupId;
  String? _memberId;
  String? _memberName;
  bool _isLoading = true;

  String? get groupId => _groupId;
  String? get memberId => _memberId;
  String? get memberName => _memberName;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _groupId != null && _memberId != null;

  AuthProvider() {
    _loadFromPrefs();
  }

  Future<void> _loadFromPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    _groupId = prefs.getString('group_id');
    _memberId = prefs.getString('member_id');
    _memberName = prefs.getString('member_name');
    _isLoading = false;
    notifyListeners();
  }

  Future<void> saveSession({
    required String groupId,
    required String memberId,
    required String memberName,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('group_id', groupId);
    await prefs.setString('member_id', memberId);
    await prefs.setString('member_name', memberName);
    _groupId = groupId;
    _memberId = memberId;
    _memberName = memberName;
    notifyListeners();
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    _groupId = null;
    _memberId = null;
    _memberName = null;
    notifyListeners();
  }
}
