
const Student = require("../../domain/entities/Student");

class InMemoryStudentRepository {
  constructor() {
    this.students = [];
  }

  async save(student) {
    this.students.push(student);
  }

  async findById(id) {
    return this.students.find(s => s.id === id) || null;
  }

  async findAll() {
    return this.students;
  }
}

module.exports = InMemoryStudentRepository;
