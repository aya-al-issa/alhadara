// components/Notifications.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { markAsRead, markAllAsRead } from '../store/notificationsSlice';

const Notifications = () => {
  const notifications = useSelector(state => state.notifications.list);
  const unreadCount = useSelector(state => state.notifications.unreadCount);
  const dispatch = useDispatch();

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  return (
    <div>
      <h4>الإشعارات ({unreadCount} غير مقروءة)</h4>
      <ul>
        {notifications.map((n) => (
          <li
            key={n.id}
            style={{ fontWeight: n.read ? 'normal' : 'bold' }}
            onClick={() => handleMarkAsRead(n.id)}
          >
            {n.message}
          </li>
        ))}
      </ul>
      <button onClick={() => dispatch(markAllAsRead())}>تحديد الكل كمقروء</button>
    </div>
  );
};

export default Notifications;
