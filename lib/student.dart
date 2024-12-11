class Student {
  final int id;
  final String ad;
  final String soyad;
  final int bolumId;

  Student({required this.id, required this.ad, required this.soyad, required this.bolumId});

  factory Student.fromJson(Map<String, dynamic> json) {
    return Student(
      id: json['studentID'],
      ad: json['ad'],
      soyad: json['soyad'],
      bolumId: json['bolumId'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'studentID': id,
      'ad': ad,
      'soyad': soyad,
      'bolumId': bolumId,
    };
  }
}
