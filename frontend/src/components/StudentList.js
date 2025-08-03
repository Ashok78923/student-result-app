// src/components/StudentList.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { checkAuthAndLogoutIfExpired, getToken } from '../utils/auth';

function StudentList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  // ... other states are correct

  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  const fetchStudents = async () => {
    checkAuthAndLogoutIfExpired(navigate);
    try {
      // --- FIX: Use the environment variable for consistency ---
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/students`, {
        headers: { Authorization: 'Bearer ' + getToken() }
      });
      // --------------------------------------------------------
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [navigate]); // Removed checkAuthAndLogoutIfExpired as it's called inside fetchStudents

  const confirmDelete = async () => {
    checkAuthAndLogoutIfExpired(navigate);
    try {
      // This part is already correct
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/students/${studentToDelete._id}`, {
        headers: { Authorization: 'Bearer ' + getToken() }
      });
      setStudents(students.filter((s) => s._id !== studentToDelete._id));
      setShowModal(false);
      setStudentToDelete(null);
    } catch (err) {
      console.error('Error deleting student:', err);
      alert('❌ Failed to delete student.');
    }
  };

  // ... The rest of your component code is correct and does not need to be changed.
  // ... (handleDeleteClick, filtering, sorting, JSX, etc.)
  
  // (Paste the rest of your component code here)
}

export default StudentList;