
import { Student } from "../../../domain/entities/Student";
import { StudentRepository } from "../../../domain/repositories/StudentRepository";

export class InMemoryStudentRepository implements StudentRepository {
  private students: Student[] = [];

  async save(student: Student): Promise<void> {
    this.students.push(student);
  }

  async findById(id: string): Promise<Student | null> {
    return this.students.find(s => s.id === id) || null;
  }

  async findAll(): Promise<Student[]> {
    return this.students;
  }
}
