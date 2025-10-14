import { useEffect, useState } from "react";
import {
  Home,
  Video,
  History,
  LayoutDashboard,
  Menu,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Layout({ children, currentPage, onPageChange }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = window.localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      window.localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      window.localStorage.setItem('theme', 'light');
    }
  }, [isDark]);
  const [showProfile, setShowProfile] = useState(false);

  const navigationItems = [
    { name: "Home", icon: Home, id: "home" },
    { name: "Live Meeting", icon: Video, id: "live-meeting" },
    { name: "History", icon: History, id: "history" },
    { name: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  ];

  const handleItemClick = (itemId) => {
    onPageChange(itemId);
    // Close sidebar on mobile when item is clicked
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
    <div className="flex h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: sidebarOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed lg:static inset-y-0 left-0 z-50 lg:z-auto lg:translate-x-0 w-64 bg-white dark:bg-neutral-950 border-r border-gray-200 dark:border-neutral-800 flex-shrink-0 flex flex-col h-full"
      >
        {/* Brand Logo */}
        <div className="px-6 py-6 border-b border-gray-200 dark:border-neutral-800">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900 dark:text-neutral-100">MEETPILOT</h1>
              <p className="text-xs text-gray-500 dark:text-neutral-400">Smart Meeting Assistant</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <motion.button
                  key={item.name}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900"
                      : "text-gray-600 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-900"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon
                    size={20}
                    className={isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-neutral-400"}
                  />
                  <span
                    className={`ml-3 font-medium text-sm ${
                      isActive ? "text-blue-700 dark:text-blue-300" : "text-gray-600 dark:text-neutral-300"
                    }`}
                  >
                    {item.name}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-neutral-800">
          <motion.button
            className="w-full flex items-center px-4 py-3 rounded-lg text-gray-600 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-900 transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Settings size={20} className="text-gray-500" />
            <span className="ml-3 font-medium text-sm">Settings</span>
          </motion.button>

          <div className="mt-4 flex items-center px-4 py-3">
            <button type="button" onClick={() => setShowProfile(true)} className="rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500">
              <img
                src="/avatar.png"
                alt="User Avatar"
                className="w-8 h-8 rounded-full ring-2 ring-white"
              />
            </button>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-neutral-100">BARATH M</p>
              <p className="text-xs text-gray-500 dark:text-neutral-400">Barath.cb22@bitsathy.ac.in</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-neutral-950 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between px-6 flex-shrink-0">
          {/* Left side */}
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <motion.button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg transition-all duration-150 hover:bg-gray-100 dark:hover:bg-neutral-900"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu size={20} className="text-gray-600 dark:text-neutral-300" />
            </motion.button>

            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 capitalize">
                {currentPage === "live-meeting" ? "Live Meeting" : currentPage}
              </h1>
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                {currentPage === "home" &&
                  "Overview of your meetings and tasks"}
                {currentPage === "live-meeting" &&
                  "Record and transcribe meetings"}
                {currentPage === "history" && "View past meeting records"}
                {currentPage === "dashboard" &&
                  "Manage action items and insights"}
              </p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDark((v) => !v)}
              className="px-3 py-2 rounded-md text-sm border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-900"
            >
              {isDark ? 'Light' : 'Dark'}
            </button>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-neutral-100">BARATH M</p>
              <p className="text-xs text-gray-500 dark:text-neutral-400">Software Developer</p>
            </div>
            <button type="button" onClick={() => setShowProfile(true)} className="rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="View profile">
              <img
                src="/avatar.png"
                alt="User Avatar"
                className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm cursor-pointer hover:ring-gray-300 transition-all duration-150"
              />
            </button>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-hidden">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full text-gray-900 dark:text-neutral-100"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
    {showProfile && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={() => setShowProfile(false)}>
        <div className="bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-xl p-6 w-[90%] max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-4">
            <img src="/avatar.png" alt="User Avatar" className="w-16 h-16 rounded-full ring-2 ring-white" />
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-neutral-100">BARATH M</p>
              <p className="text-sm text-gray-600 dark:text-neutral-300">Software Developer</p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="button" onClick={() => setShowProfile(false)} className="px-4 py-2 rounded-md border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-900">Close</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
