import 'package:flutter/material.dart';
import 'api_service.dart';
import 'student.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Student CRUD',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: StudentListScreen(),
    );
  }
}

class StudentListScreen extends StatefulWidget {
  @override
  _StudentListScreenState createState() => _StudentListScreenState();
}

class _StudentListScreenState extends State<StudentListScreen> {
  late ApiService apiService;
  late Future<List<Student>> students;

  @override
  void initState() {
    super.initState();
    apiService = ApiService();
    students = apiService.fetchStudents();
  }

  void _addStudent() {
    final newStudent = Student(id: 0, ad: "John", soyad: "Doe", bolumId: 1);
    apiService.addStudent(newStudent).then((_) {
      setState(() {
        students = apiService.fetchStudents();
      });
    });
  }

  void _updateStudent(Student student) {
    final updatedStudent = Student(id: student.id, ad: student.ad, soyad: student.soyad, bolumId: student.bolumId);
    apiService.updateStudent(updatedStudent).then((_) {
      setState(() {
        students = apiService.fetchStudents();
      });
    });
  }

  void _deleteStudent(int id) {
    apiService.deleteStudent(id).then((_) {
      setState(() {
        students = apiService.fetchStudents();
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Student CRUD Operations')),
      body: FutureBuilder<List<Student>>(
        future: students,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }

          final studentsList = snapshot.data ?? [];

          return ListView.builder(
            itemCount: studentsList.length,
            itemBuilder: (context, index) {
              final student = studentsList[index];
              return ListTile(
                title: Text('${student.ad} ${student.soyad}'),
                subtitle: Text('Bölüm ID: ${student.bolumId}'),
                trailing: IconButton(
                  icon: Icon(Icons.delete),
                  onPressed: () => _deleteStudent(student.id),
                ),
                onTap: () => _updateStudent(student),
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _addStudent,
        child: Icon(Icons.add),
      ),
    );
  }
}
