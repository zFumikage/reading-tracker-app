import { useState, useEffect } from "react";
import { Student } from "./types";
import StudentItem from "./components/StudentItem";
import StudentEditForm from "./components/StudentEditForm";

const API_BASE = "http://localhost:5000/api";

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/students`);
      if (!res.ok) throw new Error("Failed to load students");
      const data = await res.json();
      setStudents(data);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedData: Student) => {
    try {
      const res = await fetch(`${API_BASE}/students/${updatedData.studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Update failed");

      const savedStudent = await res.json();
      setStudents((prev) =>
        prev.map((s) => (s.studentId === savedStudent.studentId ? savedStudent : s))
      );
      setEditingStudent(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSoftDelete = async (studentId: number) => {
    const confirmed = window.confirm(
      "Are you sure? This will remove the student from active lists and anonymize their personal data."
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_BASE}/students/${studentId}/soft-delete`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Soft delete failed");

      setStudents((prev) => prev.filter((s) => s.studentId !== studentId));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "600px", margin: "20px auto" }}>
      <h2>Student Reading Tracker Directory</h2>
      <p>Live data managed via Neon PostgreSQL & Prisma</p>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {editingStudent && (
        <StudentEditForm
          student={editingStudent}
          onSave={handleUpdate}
          onCancel={() => setEditingStudent(null)}
        />
      )}

      {loading ? (
        <p>Loading active students...</p>
      ) : (
        <ul style={{ paddingLeft: 0 }}>
          {students.map((student) => (
            <StudentItem
              key={student.studentId}
              student={student}
              onEdit={setEditingStudent}
              onSoftDelete={handleSoftDelete}
            />
          ))}
          {students.length === 0 && <p>No active students found.</p>}
        </ul>
      )}
    </div>
  );
}