class ShoppingList {
  final String id;
  final String groupId;
  final String name;
  final String? createdBy;
  final bool isArchived;
  final DateTime createdAt;
  int itemCount;
  int boughtCount;

  ShoppingList({
    required this.id,
    required this.groupId,
    required this.name,
    this.createdBy,
    this.isArchived = false,
    required this.createdAt,
    this.itemCount = 0,
    this.boughtCount = 0,
  });

  factory ShoppingList.fromMap(Map<String, dynamic> map) {
    return ShoppingList(
      id: map['id'] as String,
      groupId: map['group_id'] as String,
      name: map['name'] as String,
      createdBy: map['created_by'] as String?,
      isArchived: map['is_archived'] as bool? ?? false,
      createdAt: DateTime.parse(map['created_at'] as String),
    );
  }

  Map<String, dynamic> toMap() => {
        'group_id': groupId,
        'name': name,
        'created_by': createdBy,
        'is_archived': isArchived,
      };
}

class ShoppingItem {
  final String id;
  final String listId;
  final String name;
  final String? quantity;
  final double? price;
  final bool isBought;
  final String? boughtBy;
  final String? category;
  final DateTime createdAt;

  ShoppingItem({
    required this.id,
    required this.listId,
    required this.name,
    this.quantity,
    this.price,
    this.isBought = false,
    this.boughtBy,
    this.category,
    required this.createdAt,
  });

  factory ShoppingItem.fromMap(Map<String, dynamic> map) {
    return ShoppingItem(
      id: map['id'] as String,
      listId: map['list_id'] as String,
      name: map['name'] as String,
      quantity: map['quantity'] as String?,
      price: map['price'] != null
          ? (map['price'] as num).toDouble()
          : null,
      isBought: map['is_bought'] as bool? ?? false,
      boughtBy: map['bought_by'] as String?,
      category: map['category'] as String?,
      createdAt: DateTime.parse(map['created_at'] as String),
    );
  }

  Map<String, dynamic> toMap() => {
        'list_id': listId,
        'name': name,
        'quantity': quantity,
        'price': price,
        'is_bought': isBought,
        'bought_by': boughtBy,
        'category': category,
      };

  ShoppingItem copyWith({bool? isBought, String? boughtBy}) => ShoppingItem(
        id: id,
        listId: listId,
        name: name,
        quantity: quantity,
        price: price,
        isBought: isBought ?? this.isBought,
        boughtBy: boughtBy ?? this.boughtBy,
        category: category,
        createdAt: createdAt,
      );
}
