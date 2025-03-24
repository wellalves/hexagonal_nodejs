
const express = require("express");
const InMemoryStudentRepository = require("../persistence/InMemoryStudentRepository");
const CreateStudent = require("../../application/use-cases/CreateStudent");

const router = express.Router();
const studentRepo = new InMemoryStudentRepository();
const createStudent = new CreateStudent(studentRepo);

router.post("/", async (req, res) => {
  const { name, schoolId } = req.body;
  await createStudent.execute(name, schoolId);
  res.status(201).send({ message: "Student created!" });
});

module.exports = router;
