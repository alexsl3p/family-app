import 'package:flutter/material.dart';
import '../models/shopping.dart';
import '../services/supabase_service.dart';

class ShoppingProvider extends ChangeNotifier {
  List<ShoppingList> _lists = [];
  final Map<String, List<ShoppingItem>> _items = {};
  String? _groupId;
  bool _isLoading = false;

  List<ShoppingList> get lists => _lists;
  bool get isLoading => _isLoading;

  List<ShoppingItem> itemsFor(String listId) => _items[listId] ?? [];

  double totalFor(String listId) => itemsFor(listId)
      .where((i) => !i.isBought)
      .fold(0, (sum, i) => sum + (i.price ?? 0));

  void setGroupId(String? groupId) {
    if (groupId == _groupId) return;
    _groupId = groupId;
    if (groupId != null) loadLists();
  }

  Future<void> loadLists() async {
    if (_groupId == null) return;
    _isLoading = true;
    notifyListeners();
    try {
      _lists = await SupabaseService.getShoppingLists(_groupId!);
      for (final list in _lists) {
        await loadItems(list.id);
      }
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadItems(String listId) async {
    final items = await SupabaseService.getShoppingItems(listId);
    _items[listId] = items;
    final listIdx = _lists.indexWhere((l) => l.id == listId);
    if (listIdx != -1) {
      _lists[listIdx].itemCount = items.length;
      _lists[listIdx].boughtCount = items.where((i) => i.isBought).length;
    }
    notifyListeners();
  }

  Future<ShoppingList> createList(String name, {String? createdBy}) async {
    final list = await SupabaseService.createShoppingList(
      groupId: _groupId!,
      name: name,
      createdBy: createdBy,
    );
    _lists.insert(0, list);
    _items[list.id] = [];
    notifyListeners();
    return list;
  }

  Future<void> deleteList(String listId) async {
    _lists.removeWhere((l) => l.id == listId);
    _items.remove(listId);
    notifyListeners();
    await SupabaseService.deleteShoppingList(listId);
  }

  Future<void> addItem({
    required String listId,
    required String name,
    String? quantity,
    double? price,
    String? category,
  }) async {
    final item = await SupabaseService.createShoppingItem(
      ShoppingItem(
        id: '',
        listId: listId,
        name: name,
        quantity: quantity,
        price: price,
        category: category,
        createdAt: DateTime.now(),
      ),
    );
    _items[listId] = [...(_items[listId] ?? []), item];
    final listIdx = _lists.indexWhere((l) => l.id == listId);
    if (listIdx != -1) _lists[listIdx].itemCount++;
    notifyListeners();
  }

  Future<void> toggleItem(String listId, String itemId, String? memberId) async {
    final items = _items[listId];
    if (items == null) return;
    final idx = items.indexWhere((i) => i.id == itemId);
    if (idx == -1) return;
    final newBought = !items[idx].isBought;
    _items[listId]![idx] = items[idx].copyWith(
      isBought: newBought,
      boughtBy: newBought ? memberId : null,
    );
    final listIdx = _lists.indexWhere((l) => l.id == listId);
    if (listIdx != -1) {
      _lists[listIdx].boughtCount += newBought ? 1 : -1;
    }
    notifyListeners();
    await SupabaseService.toggleShoppingItem(
        itemId, newBought, newBought ? memberId : null);
  }

  Future<void> deleteItem(String listId, String itemId) async {
    _items[listId]?.removeWhere((i) => i.id == itemId);
    final listIdx = _lists.indexWhere((l) => l.id == listId);
    if (listIdx != -1) _lists[listIdx].itemCount--;
    notifyListeners();
    await SupabaseService.deleteShoppingItem(itemId);
  }
}
