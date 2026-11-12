import { Student } from "../types";

interface StudentItemProps {
  student: Student;
  onEdit: (student: Student) => void;
  onSoftDelete: (studentId: number) => void;
}

export default function StudentItem({ student, onEdit, onSoftDelete }: StudentItemProps) {
  return (
    <li style={{ marginBottom: "10px", listStyle: "none", borderBottom: "1px solid #eee", paddingBottom: "8px" }}>
      <div>
        <strong>{student.firstName} {student.lastName}</strong> ({student.email})
      </div>
      <div style={{ marginTop: "4px" }}>
        <button onClick={() => onEdit(student)}>Edit</button>
        <button
          onClick={() => onSoftDelete(student.studentId)}
          style={{ marginLeft: "8px", color: "red" }}
        >
          Soft Delete & Anonymize
        </button>
      </div>
    </li>
  );
}