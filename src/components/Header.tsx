import React, { useState } from "react";
import { Bell, X } from "lucide-react";
import img from "../assets/logo.webp";
import { useAuthStore } from "../store/auth";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

type HeaderType = {
  open: React.ReactNode;
};

const Header = ({ open }: HeaderType) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useAuthStore.getState()
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Message",
      message: "You have received a new message from John Doe",
      time: "5 min ago",
      read: false,
    },
    {
      id: 2,
      title: "Task Completed",
      message: "Your task 'Update Dashboard' has been completed",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title: "Meeting Reminder",
      message: "Team meeting starts in 30 minutes",
      time: "2 hours ago",
      read: true,
    },
    {
      id: 4,
      title: "New Comment",
      message: "Sarah commented on your post",
      time: "3 hours ago",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="bg-white w-full flex items-center border-0 h-full md:shadow-sm md:border-b md:border-gray-200">
      
      <div className="w-fit  px-3 flex ml-auto items-center  ">
        <div className="flex items-center justify-between ">
          {/* Right section: Notifications and User Profile */}
          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <div className="relative">
              {/* <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Bell size={24} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button> */}

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl md:border border-gray-200 z-50">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-700">
                      Notifications
                    </h3>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {unreadCount > 0 && (
                    <div className="px-4 py-2 border-b border-gray-200">
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Mark all as read
                      </button>
                    </div>
                  )}

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => markAsRead(notification.id)}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notification.read ? "bg-blue-50" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-gray-700">
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {notification.time}
                              </p>
                            </div>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full ml-2 mt-1"></span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              
              <div className="block">
                <p className="text-sm font-semibold text-gray-700">
                  {user?.display_name}
                </p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <img
                src={img}
                alt="User avatar"
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
