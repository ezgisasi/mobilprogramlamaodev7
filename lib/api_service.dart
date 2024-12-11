import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../odev7/lib/student.dart';

class ApiService {
  final String baseUrl = "http://localhost:3000";

  Future<List<Student>> fetchStudents() async {
    final response = await http.get(Uri.parse('$baseUrl/students'));

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.map((item) => Student.fromJson(item)).toList();
    } else {
      throw Exception('Failed to load students');
    }
  }

  Future<void> addStudent(Student student) async {
    final response = await http.post(
      Uri.parse('$baseUrl/students'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(student.toJson()),
    );

    if (response.statusCode != 201) {
      throw Exception('Failed to add student');
    }
  }

  Future<void> updateStudent(Student student) async {
    final response = await http.put(
      Uri.parse('$baseUrl/students/${student.id}'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(student.toJson()),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to update student');
    }
  }

  Future<void> deleteStudent(int id) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/students/$id'),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to delete student');
    }
  }
}
