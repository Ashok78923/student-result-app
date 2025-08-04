import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import AddStudent from './components/AddStudent';
import EditStudent from "./components/EditStudent";
import StudentList from "./components/StudentList";
import NotFound from "./components/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Private Routes */}
          <Route
            path="/students"
            element={
              <PrivateRoute>
                <StudentList />
              </PrivateRoute>
            }
          />

          {/* === FIX: The path has been changed from "/add" to "/add-student" === */}
          <Route
            path="/add-student" 
            element={
              <PrivateRoute>
                <AddStudent />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/edit/:id"
            element={
              <PrivateRoute>
                <EditStudent />
              </PrivateRoute>
            }
          />

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;