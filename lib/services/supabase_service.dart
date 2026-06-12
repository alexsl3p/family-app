import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/family_member.dart';
import '../models/task.dart';
import '../models/shopping.dart';

class SupabaseService {
  static SupabaseClient get _client => Supabase.instance.client;

  // --- Family Groups ---
  static Future<Map<String, dynamic>> createGroup(String name) async {
    final res = await _client
        .from('family_groups')
        .insert({'name': name})
        .select()
        .single();
    return res;
  }

  static Future<Map<String, dynamic>?> getGroupByInviteCode(
      String code) async {
    final res = await _client
        .from('family_groups')
        .select()
        .eq('invite_code', code.toUpperCase())
        .maybeSingle();
    return res;
  }

  static Future<Map<String, dynamic>> getGroup(String groupId) async {
    final res = await _client
        .from('family_groups')
        .select()
        .eq('id', groupId)
        .single();
    return res;
  }

  // --- Members ---
  static Future<FamilyMember> createMember({
    required String groupId,
    required String name,
    required String avatarEmoji,
    required String color,
    String role = 'member',
    String? userId,
  }) async {
    final res = await _client
        .from('family_members')
        .insert({
          'group_id': groupId,
          'name': name,
          'avatar_emoji': avatarEmoji,
          'color': color,
          'role': role,
          'user_id': userId,
        })
        .select()
        .single();
    return FamilyMember.fromMap(res);
  }

  static Future<List<FamilyMember>> getMembers(String groupId) async {
    final res = await _client
        .from('family_members')
        .select()
        .eq('group_id', groupId)
        .order('created_at');
    return (res as List).map((m) => FamilyMember.fromMap(m)).toList();
  }

  // --- Tasks ---
  static Future<List<FamilyTask>> getTasks(String groupId) async {
    final res = await _client
        .from('family_tasks')
        .select()
        .eq('group_id', groupId)
        .order('created_at', ascending: false);
    return (res as List).map((t) => FamilyTask.fromMap(t)).toList();
  }

  static Future<FamilyTask> createTask(FamilyTask task) async {
    final res = await _client
        .from('family_tasks')
        .insert(task.toMap())
        .select()
        .single();
    return FamilyTask.fromMap(res);
  }

  static Future<void> updateTask(String id, Map<String, dynamic> data) async {
    await _client
        .from('family_tasks')
        .update({...data, 'updated_at': DateTime.now().toIso8601String()})
        .eq('id', id);
  }

  static Future<void> deleteTask(String id) async {
    await _client.from('family_tasks').delete().eq('id', id);
  }

  static RealtimeChannel subscribeToTasks(
      String groupId, void Function(dynamic) onEvent) {
    return _client
        .channel('family_tasks_$groupId')
        .on(
          RealtimeListenTypes.postgresChanges,
          ChannelFilter(
            event: '*',
            schema: 'public',
            table: 'family_tasks',
            filter: 'group_id=eq.$groupId',
          ),
          (payload, [ref]) => onEvent(payload),
        )
        .subscribe();
  }

  // --- Shopping Lists ---
  static Future<List<ShoppingList>> getShoppingLists(String groupId) async {
    final res = await _client
        .from('family_shopping_lists')
        .select()
        .eq('group_id', groupId)
        .eq('is_archived', false)
        .order('created_at', ascending: false);
    return (res as List).map((l) => ShoppingList.fromMap(l)).toList();
  }

  static Future<ShoppingList> createShoppingList({
    required String groupId,
    required String name,
    String? createdBy,
  }) async {
    final res = await _client
        .from('family_shopping_lists')
        .insert({'group_id': groupId, 'name': name, 'created_by': createdBy})
        .select()
        .single();
    return ShoppingList.fromMap(res);
  }

  static Future<void> deleteShoppingList(String id) async {
    await _client.from('family_shopping_lists').delete().eq('id', id);
  }

  // --- Shopping Items ---
  static Future<List<ShoppingItem>> getShoppingItems(String listId) async {
    final res = await _client
        .from('family_shopping_items')
        .select()
        .eq('list_id', listId)
        .order('created_at');
    return (res as List).map((i) => ShoppingItem.fromMap(i)).toList();
  }

  static Future<ShoppingItem> createShoppingItem(ShoppingItem item) async {
    final res = await _client
        .from('family_shopping_items')
        .insert(item.toMap())
        .select()
        .single();
    return ShoppingItem.fromMap(res);
  }

  static Future<void> toggleShoppingItem(
      String id, bool isBought, String? boughtBy) async {
    await _client.from('family_shopping_items').update({
      'is_bought': isBought,
      'bought_by': boughtBy,
    }).eq('id', id);
  }

  static Future<void> deleteShoppingItem(String id) async {
    await _client.from('family_shopping_items').delete().eq('id', id);
  }

  static RealtimeChannel subscribeToShoppingItems(
      String listId, void Function(dynamic) onEvent) {
    return _client
        .channel('shopping_items_$listId')
        .on(
          RealtimeListenTypes.postgresChanges,
          ChannelFilter(
            event: '*',
            schema: 'public',
            table: 'family_shopping_items',
            filter: 'list_id=eq.$listId',
          ),
          (payload, [ref]) => onEvent(payload),
        )
        .subscribe();
  }
}
