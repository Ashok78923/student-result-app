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
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showModal, setShowModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  const fetchStudents = async () => {
    checkAuthAndLogoutIfExpired(navigate);
    try {
      // FIX: Added /api to the URL
      const res = await axios.get('https://student-result-app-1.onrender.com/api/students', {
        headers: { Authorization: 'Bearer ' + getToken() }
      });
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  useEffect(() => {
    checkAuthAndLogoutIfExpired(navigate);
    fetchStudents();
  }, [navigate]);

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    checkAuthAndLogoutIfExpired(navigate);
    try {
      // FIX: Added /api to the URL
      await axios.delete(`https://student-result-app.onrender.com/api/students/${studentToDelete._id}`, {
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

  // ... All other functions and JSX remain the same
  // (filtering, sorting, pagination, rendering table, etc.)
  const filteredStudents = students
    .filter((student) => student.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((student) => statusFilter === 'All' ? true : student.status === statusFilter);

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (!sortKey) return 0;
    let aVal = a[sortKey], bVal = b[sortKey];
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = sortedStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(sortedStudents.length / studentsPerPage);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Student List', 14, 15);
    const tableColumn = ['ID', 'Name', 'Marks', 'Status'];
    const tableRows = students.map((s) => [s._id, s.name, s.marks, s.status]);
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
    doc.save('students.pdf');
  };

  return (
    <div className="container">
      <h2 className="mb-4">Student List</h2>
      <Link to="/add-student" className="btn btn-primary mb-3">Add New Student</Link>

      {/* Search + Filter + Sort */}
      <div className="row mb-3">
        <div className="col-md-4 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by student name..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="col-md-3 mb-2">
          <select className="form-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
            <option value="All">All</option>
            <option value="Pass">Pass</option>
            <option value="Fail">Fail</option>
          </select>
        </div>
        <div className="col-md-3 mb-2">
          <select className="form-select" value={sortKey} onChange={(e) => { setSortKey(e.target.value); setCurrentPage(1); }}>
            <option value="">Sort By</option>
            <option value="name">Name</option>
            <option value="marks">Marks</option>
          </select>
        </div>
        <div className="col-md-2 mb-2">
          <select className="form-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
      </div>

      {students.length === 0 ? <p>No students found.</p> : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Marks</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((student) => (
              <tr key={student._id} className={student.status === 'Pass' ? 'table-success' : 'table-danger'}>
                <td>{student._id}</td>
                <td>{student.name}</td>
                <td>{student.marks}</td>
                <td>{student.status}</td>
                <td>
                  <Link to={`/edit/${student._id}`} className="btn btn-warning btn-sm me-2">Edit</Link>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(student)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <nav>
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage((p) => p - 1)}>Previous</button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage((p) => p + 1)}>Next</button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {students.length > 0 && (
        <>
          <CSVLink data={students} filename="students.csv" className="btn btn-success mt-3">Export CSV</CSVLink>
          <button className="btn btn-danger mt-3 ms-2" onClick={exportPDF}>Export PDF</button>
        </>
      )}

      {studentToDelete && (
        <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete <strong>{studentToDelete.name}</strong>?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                <button className="btn btn-danger" onClick={confirmDelete}>Yes, Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentList;