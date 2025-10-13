import { motion } from "motion/react";
import {
  Video,
  History,
  LayoutDashboard,
  Plus,
  ChevronRight,
  Clock,
  Users,
  FileText,
} from "lucide-react";

export default function HomePage({ onPageChange }) {
  const featureCards = [
    {
      id: "live-meeting",
      title: "Start New Meeting",
      description:
        "Begin recording and transcribing your meetings in real-time",
      icon: Video,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      action: "Start Recording",
    },
    {
      id: "history",
      title: "Meeting History",
      description: "View and manage all your past meeting recordings",
      icon: History,
      color: "bg-gradient-to-br from-green-500 to-green-600",
      action: "View History",
    },
    {
      id: "dashboard",
      title: "Action Items",
      description: "Track and manage action items from your meetings",
      icon: LayoutDashboard,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      action: "View Dashboard",
    },
  ];

  const quickStats = [
    {
      label: "Total Meetings",
      value: "24",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      label: "Active Action Items",
      value: "8",
      icon: Clock,
      color: "text-orange-600",
    },
    {
      label: "Team Members",
      value: "12",
      icon: Users,
      color: "text-green-600",
    },
  ];

  const recentMeetings = [
    {
      title: "Team Sync - Sprint Planning",
      platform: "Google Meet",
      time: "2 hours ago",
      duration: "45 min",
      participants: 6,
    },
    {
      title: "Design Review Session",
      platform: "Zoom",
      time: "1 day ago",
      duration: "30 min",
      participants: 4,
    },
    {
      title: "Client Onboarding Call",
      platform: "Microsoft Teams",
      time: "2 days ago",
      duration: "60 min",
      participants: 8,
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Good morning, Alex 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Ready to make your meetings more productive?
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                whileHover={{ y: -2 }}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                    <Icon size={24} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Action Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {featureCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.button
                key={card.id}
                onClick={() => onPageChange(card.id)}
                className="group bg-white rounded-xl border border-gray-200 p-6 text-left transition-all duration-200 hover:shadow-lg hover:border-gray-300"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.color} text-white`}>
                    <Icon size={24} />
                  </div>
                  <ChevronRight
                    size={20}
                    className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {card.description}
                </p>
                <div className="text-sm font-medium text-blue-600">
                  {card.action}
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Meetings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Meetings
              </h2>
              <motion.button
                onClick={() => onPageChange("history")}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                whileHover={{ x: 2 }}
              >
                View All
                <ChevronRight size={16} />
              </motion.button>
            </div>

            <div className="space-y-4">
              {recentMeetings.map((meeting, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {meeting.title}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{meeting.platform}</span>
                      <span>•</span>
                      <span>{meeting.time}</span>
                      <span>•</span>
                      <span>{meeting.duration}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {meeting.participants} participants
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Quick Actions
            </h2>

            <div className="space-y-3">
              <motion.button
                onClick={() => onPageChange("live-meeting")}
                className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500 text-white rounded-lg">
                    <Plus size={18} />
                  </div>
                  <span className="font-medium text-gray-900">
                    Start New Meeting
                  </span>
                </div>
                <ChevronRight
                  size={18}
                  className="text-gray-400 group-hover:text-gray-600"
                />
              </motion.button>

              <motion.button
                onClick={() => onPageChange("dashboard")}
                className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500 text-white rounded-lg">
                    <LayoutDashboard size={18} />
                  </div>
                  <span className="font-medium text-gray-900">
                    View Action Items
                  </span>
                </div>
                <ChevronRight
                  size={18}
                  className="text-gray-400 group-hover:text-gray-600"
                />
              </motion.button>

              <motion.button
                onClick={() => onPageChange("history")}
                className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500 text-white rounded-lg">
                    <History size={18} />
                  </div>
                  <span className="font-medium text-gray-900">
                    Browse History
                  </span>
                </div>
                <ChevronRight
                  size={18}
                  className="text-gray-400 group-hover:text-gray-600"
                />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
