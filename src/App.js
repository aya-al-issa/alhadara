import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './Components/Login';
import Dashboard from './Pages/Dashboard/HomePage/Dashboard';
import OverViewPage from './Components/Dashboard/HomePaage/OverViewPage';
import CreateDepartment from './Pages/Dashboard/Department/CreateDepartment';
import CoursesPage from './Pages/Dashboard/Courses/CoursesPage';
import CreateCoursePage from './Pages/Dashboard/Courses/CreateCoursePage';
import CreateHall from './Pages/Dashboard/Hall/CreateHall';
import { useAuth } from './Components/Context/AuthContext';
import ViewProfileAdmin from './Pages/Dashboard/Profile/ViewProfileAdmin';
import ViewDepositeRequest from './Pages/Dashboard/E-Wallet/ViewDepositeRequest';
import ViewEWallet from './Pages/Dashboard/E-Wallet/ViewEWallet';
import ViewTransactions from './Pages/Dashboard/E-Wallet/ViewTransactions';
import ViewDepartments from './Pages/Dashboard/Department/ViewDepartments';
import EditDepartment from './Pages/Dashboard/Department/EditDepartment';
import ViewHalls from './Pages/Dashboard/Hall/ViewHalls';
import EditHall from './Pages/Dashboard/Hall/EditHall';
import CourseTypeList from './Pages/Dashboard/Courses/Course Type/CourseTypeList';
import CreateCourseType from './Pages/Dashboard/Courses/Course Type/CreateCourseType';
import EditCourseType from './Pages/Dashboard/Courses/Course Type/EditCourseType';


function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-5">جار التحقق من الصلاحيات...</div>; // يمكنك استبداله بـ Loader أجمل
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.user_type)) {
    return <Navigate to="/dashboard/home" replace />;
  }

  return children;
}


function App() {
  const { logout } = useAuth();

  useEffect(() => {
    const handleLogout = () => {
      logout();
    };

    window.addEventListener('logout', handleLogout);

    return () => {
      window.removeEventListener('logout', handleLogout);
    };
  }, [logout]);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="home" element={<OverViewPage />} />

            {/* 🔒 فقط للمسؤولين Admin */}

            <Route
              path="halls"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'reception']}>
                  <ViewHalls/>
                </ProtectedRoute>
              }
            />
             <Route
              path="create-hall"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'reception']}>
                  <CreateHall />
                </ProtectedRoute>
              }
            />
             <Route
              path="edit-hall/:id"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'reception']}>
                  <EditHall/>
                </ProtectedRoute>
              }
            />
            <Route
              path="create-department"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'reception']}>
                  <CreateDepartment />
                </ProtectedRoute>
              }
            />
            <Route
              path="department"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'reception']}>
                  <ViewDepartments />
                </ProtectedRoute>
              }
            />
            <Route
              path="edit-department/:id"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'reception']}>
                  <EditDepartment />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <ViewProfileAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="ewallet"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'reception']}>
                  <ViewEWallet />
                </ProtectedRoute>
              }
            />
            <Route
              path="deposit-request"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'reception']}>
                  <ViewDepositeRequest />
                </ProtectedRoute>
              }
            />
            <Route
              path="transactions"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'reception']}>
                  <ViewTransactions />
                </ProtectedRoute>
              }
            />

            {/* 🟢 متاح لـ Admin و reception */}
            <Route
              path="courses"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'reception']}>
                  <CoursesPage />
                </ProtectedRoute>
              }
            />
             <Route
              path="course-type"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'reception']}>
                  <CourseTypeList />
                </ProtectedRoute>
              }
            />
             <Route
              path="course-type/edit/:id"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'reception']}>
                  <EditCourseType />
                </ProtectedRoute>
              }
            />
             <Route
              path="course-type/create"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'reception']}>
                  <CreateCourseType />
                </ProtectedRoute>
              }
            />
            <Route
              path="courses/create-course"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'reception']}>
                  <CreateCoursePage />
                </ProtectedRoute>
              }
            />
            
          </Route>

          {/* إعادة توجيه للمسارات غير المعروفة */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
