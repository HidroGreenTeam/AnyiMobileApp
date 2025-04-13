class Crop {
  final int id;
  final String name;

  Crop({
    required this.id,
    required this.name,
  });

  factory Crop.fromJson(Map<String, dynamic> json) {
    return Crop(
      id: json['id'],
      name: json['name'],
    );
  }
}
