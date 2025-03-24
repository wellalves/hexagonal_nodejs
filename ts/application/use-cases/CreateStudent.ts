
import { Student } from "../../domain/entities/Student";
import { StudentRepository } from "../../domain/repositories/StudentRepository";

export class CreateStudent {
  constructor(private studentRepo: StudentRepository) {}

  async execute(name: string, schoolId: string): Promise<void> {
    const student = new Student(
      Math.random().toString(36).substring(2, 9),
      name,
      schoolId
    );
    await this.studentRepo.save(student);
  }
}
