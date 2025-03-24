
import express from "express";
import { InMemoryStudentRepository } from "../persistence/InMemoryStudentRepository";
import { CreateStudent } from "../../application/use-cases/CreateStudent";

const router = express.Router();
const studentRepo = new InMemoryStudentRepository();
const createStudent = new CreateStudent(studentRepo);

router.post("/", async (req, res) => {
  const { name, schoolId } = req.body;
  await createStudent.execute(name, schoolId);
  res.status(201).send({ message: "Student created!" });
});

export default router;
