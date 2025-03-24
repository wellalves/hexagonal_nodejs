
import express from "express";
import studentRoutes from "./infrastructure/http/student.routes";

const app = express();
app.use(express.json());

app.use("/students", studentRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
