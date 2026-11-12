import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// 1. GET: Retrieve all active (non-deleted) students
app.get("/api/students", async (_req: Request, res: Response) => {
  try {
    const students = await prisma.student.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

// 2. PUT: Update student details from form
app.put("/api/students/:id", async (req: Request, res: Response) => {
  const studentId = parseInt(req.params.id, 10);
  const { firstName, lastName, email } = req.body;

  try {
    const updatedStudent = await prisma.student.update({
      where: { studentId },
      data: {
        firstName,
        lastName,
        email,
      },
    });
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ error: "Failed to update student" });
  }
});

// 3. POST: Soft delete & anonymize residual PII atomically
app.post("/api/students/:id/soft-delete", async (req: Request, res: Response) => {
  const studentId = parseInt(req.params.id, 10);

  try {
    // Atomic update: Mark deleted and scrub PII in a single operation
    const anonymizedStudent = await prisma.student.update({
      where: { studentId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        firstName: "Anonymized",
        lastName: "Student",
        // Replace unique email with non-identifiable collision-free placeholder
        email: `deleted_${studentId}_${Date.now()}@redacted.local`,
      },
    });

    res.json({ message: "Student anonymized and soft-deleted", student: anonymizedStudent });
  } catch (error) {
    res.status(400).json({ error: "Failed to soft delete student" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});