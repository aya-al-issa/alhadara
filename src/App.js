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
import SchedulePage from './Pages/Dashboard/SchedualCourse/SchedulePage';
import AddScheduleSlot from './Pages/Dashboard/SchedualCourse/AddScheduleSlot';
import CourseDetailsPage from './Pages/Dashboard/Courses/CourseDetailsPage';
import CreateGuestEnrollmentPage from './Pages/Dashboard/Enrollment/CreateGuestEnrollmentPage';
import EnrollmentList from './Pages/Dashboard/Enrollment/EnrollmentList';
import PrivateLessonsTable from './Pages/Dashboard/Lessons/PrivateLessonsTable';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import ShowComplaints from './Pages/Dashboard/Complaint/ShowComplaints';
import CreateExamForm from './Pages/Dashboard/EntranceExam/CreateExamForm';
import ExamPage from './Pages/Dashboard/EntranceExam/ExamPage';
import CreateQuestionBank from './Pages/Dashboard/EntranceExam/QuestionBanks/CreateQuestionBank';
import NotFound from './Components/Dashboard/PageError/404';

function ProtectedRoute({ children, allowedRoles }) {
  const token = Cookies.get('token');
  const userType = Cookies.get('user_type');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.map(r => r.toLowerCase()).includes(userType?.toLowerCase())
  ) {
    return <Navigate to="/dashboard/home" replace />;
  }

  return children;
}


function App() {
  const { logout } = useAuth();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  useEffect(() => {
    const handleLogout = () => {
      logout();
    };

    window.addEventListener('logout', handleLogout);

    return () => {
      window.removeEventListener('logout', handleLogout);
    };
  }, [logout]);


  useEffect(() => {
    document.body.dir = isRTL ? 'rtl' : 'ltr';
  }, [isRTL]);

  return (
    <div className="body">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="*" element={<NotFound />} />
            <Route path="home" element={<OverViewPage />} />

            {/* 🔒 فقط للمسؤولين Admin */}

            <Route
              path="halls"
              element={
                <ProtectedRoute allowedRoles={['admin', 'reception']}>
                  <ViewHalls />
                </ProtectedRoute>
              }
            />
            <Route
              path="create-hall"
              element={
                <ProtectedRoute allowedRoles={['admin', 'reception']}>
                  <CreateHall />
                </ProtectedRoute>
              }
            />
            <Route
              path="edit-hall/:id"
              element={
                <ProtectedRoute allowedRoles={['admin', 'reception']}>
                  <EditHall />
                </ProtectedRoute>
              }
            />
            <Route
              path="create-department"
              element={
                <ProtectedRoute allowedRoles={['admin', 'reception']}>
                  <CreateDepartment />
                </ProtectedRoute>
              }
            />
            <Route
              path="department"
              element={
                <ProtectedRoute allowedRoles={['admin', 'reception']}>
                  <ViewDepartments />
                </ProtectedRoute>
              }
            />
            <Route
              path="edit-department/:id"
              element={
                <ProtectedRoute allowedRoles={['admin', 'reception']}>
                  <EditDepartment />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ViewProfileAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="ewallet"
              element={
                <ProtectedRoute allowedRoles={['admin', 'reception']}>
                  <ViewEWallet />
                </ProtectedRoute>
              }
            />
            <Route
              path="deposit-request"
              element={
                <ProtectedRoute allowedRoles={['admin', 'reception']}>
                  <ViewDepositeRequest />
                </ProtectedRoute>
              }
            />
            <Route
              path="transactions"
              element={
                <ProtectedRoute allowedRoles={['admin', 'reception']}>
                  <ViewTransactions />
                </ProtectedRoute>
              }
            />

            {/* 🟢 متاح لـ admin و reception */}
            <Route
              path="courses"
              element={
                <ProtectedRoute allowedRoles={['admin', 'reception']}>
                  <CoursesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="courses/:id"
              element={
                <ProtectedRoute allowedRoles={['admin', 'reception']}>
                  <CourseDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="course-type"
              element={
                <ProtectedRoute allowedRoles={['admin', 'reception']}>
                  <CourseTypeList />
                </ProtectedRoute>
              }
            />
            <Route
              path="course-type/edit/:id"
              element={
                <ProtectedRoute allowedRoles={['admin', 'reception']}>
                  <EditCourseType />
                </ProtectedRoute>
              }
            />
            <Route
              path="course-type/create"
              element={
                <ProtectedRoute allowedRoles={['admin', 'reception']}>
                  <CreateCourseType />
                </ProtectedRoute>
              }
            />
            <Route
              path="courses/create-course"
              element={
                <ProtectedRoute allowedRoles={['admin', 'reception']}>
                  <CreateCoursePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="courses/schedual"
              element={
                <ProtectedRoute allowedRoles={['admin', 'reception']}>
                  <SchedulePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="courses/schedual/create"
              element={
                <ProtectedRoute allowedRoles={['admin', 'reception']}>
                  <AddScheduleSlot />
                </ProtectedRoute>
              }
            />
            <Route
              path="courses/schedual/guest-enrollment/:slotId"
              element={
                <ProtectedRoute allowedRoles={['admin', 'reception']}>
                  <CreateGuestEnrollmentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="courses/enrollments"
              element={
                <ProtectedRoute allowedRoles={['admin', 'reception']}>
                  <EnrollmentList />
                </ProtectedRoute>
              }
            />
            <Route
              path="privite-lesson"
              element={
                <ProtectedRoute allowedRoles={['admin', 'reception']}>
                  <PrivateLessonsTable />
                </ProtectedRoute>
              }
            />
            <Route
              path="complaint"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ShowComplaints />
                </ProtectedRoute>
              }
            />
            <Route
              path="EntranceExam/create"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <CreateExamForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="EntranceExam"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ExamPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="qb"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <CreateQuestionBank />
                </ProtectedRoute>
              }
            />
             
          </Route>

          {/* إعادة توجيه للمسارات غير المعروفة */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
