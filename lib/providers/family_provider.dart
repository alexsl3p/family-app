import 'package:flutter/material.dart';
import '../models/family_member.dart';
import '../services/supabase_service.dart';

class FamilyProvider extends ChangeNotifier {
  List<FamilyMember> _members = [];
  String? _groupId;
  String? _groupName;
  String? _inviteCode;
  bool _isLoading = false;

  List<FamilyMember> get members => _members;
  String? get currentGroupId => _groupId;
  String? get groupName => _groupName;
  String? get inviteCode => _inviteCode;
  bool get isLoading => _isLoading;

  FamilyMember? memberById(String id) {
    try {
      return _members.firstWhere((m) => m.id == id);
    } catch (_) {
      return null;
    }
  }

  Future<void> loadGroup(String groupId) async {
    if (_groupId == groupId && _members.isNotEmpty) return;
    _isLoading = true;
    notifyListeners();
    try {
      final groupData = await SupabaseService.getGroup(groupId);
      _groupId = groupId;
      _groupName = groupData['name'] as String;
      _inviteCode = groupData['invite_code'] as String;
      _members = await SupabaseService.getMembers(groupId);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> refreshMembers() async {
    if (_groupId == null) return;
    _members = await SupabaseService.getMembers(_groupId!);
    notifyListeners();
  }

  void clear() {
    _members = [];
    _groupId = null;
    _groupName = null;
    _inviteCode = null;
    notifyListeners();
  }
}
