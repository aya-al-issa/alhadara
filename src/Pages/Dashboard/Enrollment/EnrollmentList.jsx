// src/pages/EnrollmentList.jsx
import React from 'react';
import useEnrollments from '../../../Components/Hook/Enrollment/useEnrollments';

const EnrollmentList = () => {
  const { data: enrollments, isLoading, isError } = useEnrollments();

  if (isLoading) return <p>Loading enrollments...</p>;
  if (isError) return <p>Error loading enrollments</p>;

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Enrollment List</h3>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Phone</th>
              <th>Course</th>
              <th>Schedule</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Paid</th>
              <th>Remaining</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {enrollments?.map((enrollment, index) => (
              <tr key={enrollment.id}>
                <td>{index + 1}</td>
                <td>{enrollment.student_name}</td>
                <td>{enrollment.phone}</td>
                <td>{enrollment.course_title}</td>
                <td>
                  {enrollment.schedule_slot_display?.days_display} <br />
                  {enrollment.schedule_slot_display?.time_range?.display}
                </td>
                <td>{enrollment.status}</td>
                <td>{enrollment.payment_method_display}</td>
                <td>{enrollment.amount_paid} SYP</td>
                <td>{enrollment.remaining_balance} SYP</td>
                <td>{new Date(enrollment.enrollment_date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnrollmentList;
