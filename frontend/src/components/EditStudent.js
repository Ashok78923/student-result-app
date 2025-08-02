// frontend/src/components/EditStudent.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { checkAuthAndLogoutIfExpired, getToken } from '../utils/auth';

function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() =>  {
    checkAuthAndLogoutIfExpired(navigate);
    // FIX 1: Added /api to the URL
    axios
      .get(`https://student-result-app-1.onrender.com/api/students/${id}`, {
        headers: { Authorization: 'Bearer ' + getToken() },
      })
      .then((res) => setStudent(res.data))
      .catch((err) => {
        console.error('Error fetching student:', err);
        alert('❌ Student not found');
        navigate('/students');
      });
  }, [id, navigate]);

  const validateForm = () => {
    let newErrors = {};

    if (!student.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (student.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (student.marks === '' || student.marks === null) {
      newErrors.marks = 'Marks are required';
    } else if (isNaN(student.marks) || student.marks < 0 || student.marks > 100) {
      newErrors.marks = 'Marks must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    checkAuthAndLogoutIfExpired(navigate);

    if (!validateForm()) return;

    try {
      const updatedStudent = {
        ...student,
        marks: Number(student.marks),
      };
      // FIX 1: Added /api to the URL
      await axios.put(`https://student-result-app-1.onrender.com/api/students/${id}`, updatedStudent, {
        headers: { Authorization: 'Bearer ' + getToken() }
      });
      alert('✅ Student updated successfully!');
      navigate('/students');
    } catch (err) {
      console.error('Error updating student:', err);
      alert('❌ Failed to update student');
    }
  };

  if (!student) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-2">Loading student details...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '500px' }}>
        <h4 className="card-title mb-4 text-center">Edit Student</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name:</label>
            <input
              type="text"
              name="name"
              value={student.name}
              onChange={handleChange}
              // FIX 2: Used backticks for className
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Marks:</label>
            <input
              type="number"
              name="marks"
              value={student.marks}
              onChange={handleChange}
              // FIX 2: Used backticks for className
              className={`form-control ${errors.marks ? 'is-invalid' : ''}`}
            />
            {errors.marks && <div className="invalid-feedback">{errors.marks}</div>}
          </div>
          <button className="btn btn-success w-100" type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default EditStudent;