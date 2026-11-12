import React, { useState } from "react";
import { Student } from "../types";

interface StudentEditFormProps {
  student: Student;
  onSave: (updated: Student) => void;
  onCancel: () => void;
}

export default function StudentEditForm({ student, onSave, onCancel }: StudentEditFormProps) {
  const [firstName, setFirstName] = useState(student.firstName);
  const [lastName, setLastName] = useState(student.lastName);
  const [email, setEmail] = useState(student.email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...student,
      firstName,
      lastName,
      email,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: "1px solid #ccc", padding: "15px", margin: "10px 0" }}>
      <h4>Edit Student #{student.studentId}</h4>
      <div style={{ marginBottom: "8px" }}>
        <label>First Name: </label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>

      <div style={{ marginBottom: "8px" }}>
        <label>Last Name: </label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label>Email: </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <button type="submit">Save Changes</button>
      <button type="button" onClick={onCancel} style={{ marginLeft: "8px" }}>Cancel</button>
    </form>
  );
}