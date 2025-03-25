# hexagonal_nodejs - ptBr

🏗️ Estrutura de Pastas
src/
│
├── application/               # Casos de uso (application services)
│   ├── use-cases/
│
├── domain/                    # Entidades e regras de negócio
│   ├── entities/
│   └── repositories/          # Interfaces (portas) para acesso ao domínio
│
├── infrastructure/           # Adapters: banco de dados, serviços externos etc
│   ├── persistence/
│   └── http/
│
├── config/                   # Configurações da aplicação
│
└── index.ts                  # Ponto de entrada da aplicação


post de exemplo
http://localhost:3000/students
body:
{
  "name": "Maria",
  "schoolId": "1234"
}



🧠 Conceito Central da Arquitetura Hexagonal
A ideia principal é separar o núcleo da aplicação (regras de negócio) das partes que mudam com mais frequência, como o banco de dados, a interface HTTP, serviços externos, UI, etc.

Essa separação é feita com Portas (Ports) e Adaptadores (Adapters).


🧩 Componentes da Arquitetura Hexagonal

Imagine a aplicação como um hexágono, onde:

Domínio:	Onde vivem as regras de negócio. Simples, pura, sem dependências externas.
Aplicação:	Orquestra os casos de uso. Usa interfaces do domínio.
Portas (Ports):	Interfaces que definem como o domínio se comunica com o exterior.
Adaptadores: 	Implementações concretas dessas portas: banco de dados, APIs, CLI, etc.


🏗️ Explicando o Projeto com Cadastro de Escolas
Vamos usar um exemplo real do seu projeto: cadastro de estudantes numa escola.

1. Entidade (Domínio)
📄 src/domain/entities/Student.ts

export class Student {
  constructor(
    public id: string,
    public name: string,
    public schoolId: string
  ) {}
}
Essa classe representa um aluno. Não sabe nada de banco, nem de API. Ela vive no mundo puro da lógica de negócio.

2. Porta (Interface do Repositório)
📄 src/domain/repositories/StudentRepository.ts
import { Student } from "../entities/Student";

export interface StudentRepository {
  save(student: Student): Promise<void>;
  findById(id: string): Promise<Student | null>;
  findAll(): Promise<Student[]>;
}
Essa interface define o contrato que qualquer repositório de estudantes precisa seguir.

3. Caso de Uso (Application Service)
📄 src/application/use-cases/CreateStudent.ts
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
Aqui mora a lógica de "cadastrar aluno": ele cria um aluno e salva no repositório. Só isso. Tudo desacoplado.

4. Adaptador de Saída (Implementação do Repositório)
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
📄 src/infrastructure/persistence/InMemoryStudentRepository.ts
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
Esse adaptador usa memória para armazenar alunos — mas ele poderia ser trocado por um MongoDB ou Postgres, sem mudar nada no caso de uso.

5. Adaptador de Entrada (API HTTP)
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

Esse é o adaptador que traduz requisições HTTP para chamadas ao caso de uso. Ele recebe o POST /students, extrai os dados, chama o CreateStudent, e responde com um 201.

6. Ponto de Entrada da Aplicação
📄 src/index.ts

import express from "express";
import studentRoutes from "./infrastructure/http/student.routes";

const app = express();
app.use(express.json());
app.use("/students", studentRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
Aqui é onde tudo começa. O Express carrega os adaptadores de entrada (rotas), que se conectam aos casos de uso, que por sua vez conversam com adaptadores de saída (repositórios) que implementam as portas.


🚀 Ciclo completo da requisição
Cliente envia POST /students

student.routes.ts chama o caso de uso

CreateStudent instancia o aluno

Usa studentRepo.save() (interface)

A implementação (InMemoryStudentRepository) salva

Tudo funciona sem o domínio saber de HTTP ou banco de dados

🧪 Vantagens Claras
Pode testar o caso de uso sem banco nem Express

Pode mudar o banco (Mongo, PostgreSQL, arquivo) sem tocar no domínio

Pode fazer REST, GraphQL, CLI, fila — todos chamam o mesmo core


# hexagonal_nodejs - en

Claro! Aqui está a tradução completa para o inglês:

---

🏗️ **Folder Structure**

```
src/
│
├── application/               # Use cases (application services)
│   ├── use-cases/
│
├── domain/                    # Entities and business rules
│   ├── entities/
│   └── repositories/          # Interfaces (ports) for domain access
│
├── infrastructure/           # Adapters: database, external services, etc.
│   ├── persistence/
│   └── http/
│
├── config/                   # Application configurations
│
└── index.ts                  # Application entry point
```

---

📦 **Example POST request**  
**URL:** `http://localhost:3000/students`  
**Body:**
```json
{
  "name": "Maria",
  "schoolId": "1234"
}
```

---

🧠 **Core Concept of Hexagonal Architecture**  
The main idea is to separate the core of the application (business rules) from the parts that change more frequently, such as the database, HTTP interface, external services, UI, etc.

This separation is achieved using **Ports** and **Adapters**.

---

🧩 **Components of Hexagonal Architecture**  

Imagine the application as a hexagon, where:

- **Domain**: Where business rules live. Simple, pure, with no external dependencies.  
- **Application**: Orchestrates the use cases. Uses domain interfaces.  
- **Ports**: Interfaces that define how the domain communicates with the outside world.  
- **Adapters**: Concrete implementations of those ports: database, APIs, CLI, etc.

---

🏗️ **Explaining the School Registration Project**  
Let’s use a real example from your project: registering students in a school.

---

**1. Entity (Domain)**  
📄 `src/domain/entities/Student.ts`
```ts
export class Student {
  constructor(
    public id: string,
    public name: string,
    public schoolId: string
  ) {}
}
```
This class represents a student. It knows nothing about the database or API. It lives in the pure world of business logic.

---

**2. Port (Repository Interface)**  
📄 `src/domain/repositories/StudentRepository.ts`
```ts
import { Student } from "../entities/Student";

export interface StudentRepository {
  save(student: Student): Promise<void>;
  findById(id: string): Promise<Student | null>;
  findAll(): Promise<Student[]>;
}
```
This interface defines the contract that any student repository must follow.

---

**3. Use Case (Application Service)**  
📄 `src/application/use-cases/CreateStudent.ts`
```ts
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
```
This is where the logic of "registering a student" lives: it creates a student and saves it in the repository. That’s it. Everything is decoupled.

---

**4. Output Adapter (Repository Implementation)**  
📄 `src/infrastructure/persistence/InMemoryStudentRepository.ts`
```ts
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
```
This adapter uses in-memory storage to store students — but it could be swapped for MongoDB or Postgres without changing anything in the use case.

---

**5. Input Adapter (HTTP API)**  
📄 `src/infrastructure/http/student.routes.ts`
```ts
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
```
This is the adapter that translates HTTP requests into use case calls. It receives `POST /students`, extracts the data, calls `CreateStudent`, and responds with a `201`.

---

**6. Application Entry Point**  
📄 `src/index.ts`
```ts
import express from "express";
import studentRoutes from "./infrastructure/http/student.routes";

const app = express();
app.use(express.json());
app.use("/students", studentRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```
This is where everything starts. Express loads the input adapters (routes), which connect to the use cases, which in turn interact with output adapters (repositories) that implement the ports.

---

🚀 **Full Request Cycle**

1. Client sends `POST /students`  
2. `student.routes.ts` calls the use case  
3. `CreateStudent` creates the student entity  
4. It uses `studentRepo.save()` (interface)  
5. The implementation (`InMemoryStudentRepository`) stores the data  

**Everything works without the domain knowing anything about HTTP or database.**

---

🧪 **Clear Advantages**

- You can test the use case without a database or Express  
- You can change the database (Mongo, PostgreSQL, file, etc.) without touching the domain  
- You can implement REST, GraphQL, CLI, queues — all calling the same core

