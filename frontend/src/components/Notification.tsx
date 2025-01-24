

// // Notification.tsx
// import React, { useEffect } from 'react';

// interface NotificationProps {
//   message: string;
//   type: 'success' | 'error' | 'info';
//   isVisible: boolean;
//   onClose: () => void;
// }

// const Notification: React.FC<NotificationProps> = ({
//   message,
//   type,
//   isVisible,
//   onClose,
// }) => {
//   useEffect(() => {
//     if (isVisible) {
//       const timer = setTimeout(() => {
//         onClose();
//       }, 3000); // Auto hide after 3 seconds

//       return () => clearTimeout(timer);
//     }
//   }, [isVisible, onClose]);

//   if (!isVisible) return null;

//   let notificationClass = '';
//   switch (type) {
//     case 'success':
//       notificationClass = 'bg-green-500 text-white';
//       break;
//     case 'error':
//       notificationClass = 'bg-red-500 text-white';
//       break;
//     case 'info':
//       notificationClass = 'bg-blue-500 text-white';
//       break;
//     default:
//       notificationClass = 'bg-gray-500 text-white';
//   }

//   return (
//     <div
//       className={`fixed bottom-4 right-4 p-4 rounded-md shadow-md ${notificationClass} flex items-center gap-4`}
//     >
//       <span>{message}</span>
//       <button
//         onClick={onClose}
//         className="text-white font-bold hover:text-opacity-75"
//       >
//         X
//       </button>
//     </div>
//   );
// };

// export default Notification;

import React, { useEffect } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  isVisible,
  onClose,
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto hide after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  let notificationClass = '';
  switch (type) {
    case 'success':
      notificationClass = 'bg-green-500 text-white';
      break;
    case 'error':
      notificationClass = 'bg-red-500 text-white';
      break;
    case 'info':
      notificationClass = 'bg-blue-500 text-white';
      break;
    default:
      notificationClass = 'bg-gray-500 text-white';
  }

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-md shadow-md ${notificationClass} flex items-center gap-4`}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="text-white font-bold hover:text-opacity-75"
      >
        X
      </button>
    </div>
  );
};

export default Notification;

