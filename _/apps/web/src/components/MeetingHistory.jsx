import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar,
  Filter,
  Eye,
  Share,
  Trash2,
  MoreVertical,
  Clock,
  Users,
  Download,
  X,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function MeetingHistory() {
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const platforms = ["all", "Google Meet", "Zoom", "Microsoft Teams", "Skype"];

  // Fetch meetings
  const { data: meetingsData = { meetings: [] }, isLoading } = useQuery({
    queryKey: ['meetings', selectedPlatform],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedPlatform !== "all") {
        params.append('platform', selectedPlatform);
      }
      params.append('limit', '20');
      
      const response = await fetch(`/api/meetings?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch meetings');
      }
      return response.json();
    },
  });

  // Delete meeting mutation
  const deleteMeetingMutation = useMutation({
    mutationFn: async (meetingId) => {
      const response = await fetch(`/api/meetings/${meetingId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete meeting');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    },
  });

  const handleViewMeeting = (meeting) => {
    setSelectedMeeting(meeting);
    setShowModal(true);
  };

  const handleDeleteMeeting = (meetingId) => {
    if (confirm('Are you sure you want to delete this meeting?')) {
      deleteMeetingMutation.mutate(meetingId);
    }
  };

  const handleShareMeeting = (meeting) => {
    // Mock share functionality
    const shareUrl = `${window.location.origin}/shared/meeting/${meeting.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Meeting link copied to clipboard!');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPlatformColor = (platform) => {
    const colors = {
      'Google Meet': 'bg-green-500',
      'Zoom': 'bg-blue-500',
      'Microsoft Teams': 'bg-purple-500',
      'Skype': 'bg-cyan-500',
    };
    return colors[platform] || 'bg-gray-500';
  };

  return (
    <div className="h-full overflow-y-auto bg-[#F3F3F3] dark:bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-2 font-sora">
              Meeting History
            </h1>
            <p className="text-gray-600 dark:text-gray-300 font-inter">
              Manage and review your past meetings
            </p>
          </div>

          {/* Filter */}
          <div className="mt-4 md:mt-0">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-[#262626] text-black dark:text-white font-inter"
            >
              {platforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform === "all" ? "All Platforms" : platform}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Meetings Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : meetingsData.meetings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400 mb-2 font-sora">
              No meetings found
            </h3>
            <p className="text-gray-400 font-inter">
              Start recording meetings to see them here
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {meetingsData.meetings.map((meeting, index) => (
              <motion.div
                key={meeting.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6 hover:shadow-lg transition-all duration-200"
                whileHover={{ scale: 1.02 }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-black dark:text-white mb-2 font-sora line-clamp-2">
                      {meeting.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 ${getPlatformColor(meeting.platform)} rounded-full`} />
                      <span className="text-sm text-gray-600 dark:text-gray-300 font-inter">
                        {meeting.platform}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Meeting Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-inter">
                    <Calendar size={16} />
                    <span>{formatDate(meeting.date)} at {formatTime(meeting.date)}</span>
                  </div>
                  {meeting.duration && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-inter">
                      <Clock size={16} />
                      <span>{meeting.duration} minutes</span>
                    </div>
                  )}
                  {meeting.action_items && meeting.action_items.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-inter">
                      <Users size={16} />
                      <span>{meeting.action_items.length} action items</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => handleViewMeeting(meeting)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Eye size={16} />
                    View
                  </motion.button>
                  <motion.button
                    onClick={() => handleShareMeeting(meeting)}
                    className="flex items-center justify-center p-2 bg-gray-100 dark:bg-[#262626] hover:bg-gray-200 dark:hover:bg-[#2A2A2A] text-gray-600 dark:text-gray-300 rounded-lg transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Share size={16} />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDeleteMeeting(meeting.id)}
                    className="flex items-center justify-center p-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Meeting Detail Modal */}
        <AnimatePresence>
          {showModal && selectedMeeting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-[#1E1E1E] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
                  <div>
                    <h2 className="text-xl font-bold text-black dark:text-white font-sora">
                      {selectedMeeting.title}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 font-inter">
                      {selectedMeeting.platform} • {formatDate(selectedMeeting.date)}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-[#262626] rounded-lg transition-colors"
                  >
                    <X size={20} className="text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                  {/* Summary */}
                  {selectedMeeting.summary && (
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-black dark:text-white mb-3 font-sora">
                        Summary
                      </h3>
                      <div className="bg-gray-50 dark:bg-[#262626] rounded-lg p-4">
                        <p className="text-black dark:text-white font-inter leading-relaxed whitespace-pre-line">
                          {selectedMeeting.summary}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Items */}
                  {selectedMeeting.action_items && selectedMeeting.action_items.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-black dark:text-white mb-3 font-sora">
                        Action Items
                      </h3>
                      <div className="space-y-3">
                        {selectedMeeting.action_items.map((item) => (
                          <div
                            key={item.id}
                            className="bg-gray-50 dark:bg-[#262626] rounded-lg p-4 flex items-start gap-3"
                          >
                            <div className={`w-3 h-3 rounded-full mt-2 ${
                              item.status === 'Completed' ? 'bg-green-500' : 'bg-yellow-500'
                            }`} />
                            <div className="flex-1">
                              <p className="text-black dark:text-white font-inter mb-1">
                                {item.task}
                              </p>
                              {item.assigned_to && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-inter">
                                  Assigned to: {item.assigned_to}
                                </p>
                              )}
                              {item.deadline && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-inter">
                                  Deadline: {new Date(item.deadline).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === 'Completed'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Transcript */}
                  {selectedMeeting.transcript && (
                    <div>
                      <h3 className="text-lg font-bold text-black dark:text-white mb-3 font-sora">
                        Transcript
                      </h3>
                      <div className="bg-gray-50 dark:bg-[#262626] rounded-lg p-4 max-h-64 overflow-y-auto">
                        <p className="text-black dark:text-white font-inter leading-relaxed">
                          {selectedMeeting.transcript}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}