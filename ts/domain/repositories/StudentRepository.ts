
import { Student } from "../entities/Student";

export interface StudentRepository {
  save(student: Student): Promise<void>;
  findById(id: string): Promise<Student | null>;
  findAll(): Promise<Student[]>;
}
