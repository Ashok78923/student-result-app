// frontend/src/components/AddStudent.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Using axios for consistency
import { checkAuthAndLogoutIfExpired, getToken } from '../utils/auth';

const AddStudent = () => {
  const [name, setName] = useState('');
  const [marks, setMarks] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndLogoutIfExpired(navigate);
  }, [navigate]);

  const validateForm = () => {
    let newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (marks === '') {
      newErrors.marks = 'Marks are required';
    } else if (isNaN(marks) || marks < 0 || marks > 100) {
      newErrors.marks = 'Marks must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    checkAuthAndLogoutIfExpired(navigate);

    if (!validateForm()) return;

    const status = marks >= 33 ? 'Pass' : 'Fail';
    const studentData = { name: name.trim(), marks: Number(marks), status };

    try {
      // FIX: Using axios instead of fetch for consistency
      await axios.post('https://student-result-app-1.onrender.com/api/students', studentData, {
        headers: { 'Authorization': 'Bearer ' + getToken() }
      });
      alert('✅ Student added successfully!');
      navigate('/students');
    } catch (error) {
      console.error('Error adding student:', error);
      alert('❌ Failed to add student.');
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '500px' }}>
        <h4 className="card-title mb-4 text-center">Add New Student</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name:</label>
            <input
              type="text"
              // FIX: Used backticks for className
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Marks:</label>
            <input
              type="number"
              // FIX: Used backticks for className
              className={`form-control ${errors.marks ? 'is-invalid' : ''}`}
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
            />
            {errors.marks && <div className="invalid-feedback">{errors.marks}</div>}
          </div>
          <button type="submit" className="btn btn-primary w-100">Add Student</button>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;