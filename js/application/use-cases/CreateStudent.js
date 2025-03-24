
const Student = require("../../domain/entities/Student");

class CreateStudent {
  constructor(studentRepo) {
    this.studentRepo = studentRepo;
  }

  async execute(name, schoolId) {
    const student = new Student(
      Math.random().toString(36).substring(2, 9),
      name,
      schoolId
    );
    await this.studentRepo.save(student);
  }
}

module.exports = CreateStudent;
