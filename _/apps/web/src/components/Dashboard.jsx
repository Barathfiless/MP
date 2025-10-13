import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  CheckCircle2,
  Circle,
  Plus,
  Calendar,
  User,
  Clock,
  BarChart3,
  TrendingUp,
  Filter,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function Dashboard() {
  const [newActionItem, setNewActionItem] = useState({
    task: "",
    assigned_to: "",
    deadline: "",
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const queryClient = useQueryClient();

  // Fetch action items
  const { data: actionItemsData = { actionItems: [] }, isLoading } = useQuery({
    queryKey: ['actionItems', statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.append('status', statusFilter);
      }
      
      const response = await fetch(`/api/action-items?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch action items');
      }
      return response.json();
    },
  });

  // Update action item mutation
  const updateActionItemMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      const response = await fetch(`/api/action-items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Failed to update action item');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actionItems'] });
    },
  });

  // Create action item mutation
  const createActionItemMutation = useMutation({
    mutationFn: async (actionItemData) => {
      const response = await fetch('/api/action-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actionItemData),
      });
      if (!response.ok) {
        throw new Error('Failed to create action item');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actionItems'] });
      setNewActionItem({ task: "", assigned_to: "", deadline: "" });
      setShowAddForm(false);
    },
  });

  const handleToggleStatus = (actionItem) => {
    const newStatus = actionItem.status === 'Completed' ? 'Pending' : 'Completed';
    updateActionItemMutation.mutate({
      id: actionItem.id,
      updates: { status: newStatus },
    });
  };

  const handleCreateActionItem = () => {
    if (newActionItem.task.trim()) {
      createActionItemMutation.mutate({
        ...newActionItem,
        deadline: newActionItem.deadline || null,
      });
    }
  };

  // Calculate stats
  const actionItems = actionItemsData.actionItems || [];
  const totalItems = actionItems.length;
  const completedItems = actionItems.filter(item => item.status === 'Completed').length;
  const pendingItems = totalItems - completedItems;
  const completionRate = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  // Sample flowchart component (using mermaid syntax)
  const FlowchartViewer = ({ flowchartCode }) => {
    useEffect(() => {
      if (typeof window !== 'undefined' && flowchartCode) {
        // In a real implementation, you would initialize Mermaid.js here
        console.log('Flowchart code:', flowchartCode);
      }
    }, [flowchartCode]);

    return (
      <div className="bg-gray-50 dark:bg-[#262626] rounded-lg p-6 text-center">
        <div className="text-gray-500 dark:text-gray-400 mb-4">
          <BarChart3 size={48} className="mx-auto" />
        </div>
        <p className="text-gray-600 dark:text-gray-300 font-inter">
          Flowchart visualization would appear here
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-inter mt-2">
          Using Mermaid.js for flowchart rendering
        </p>
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="h-full overflow-y-auto bg-[#F3F3F3] dark:bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-2 font-sora">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 font-inter">
            Track your action items and meeting insights
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 font-inter">
                Total Tasks
              </h3>
              <Circle size={20} className="text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-black dark:text-white font-sora">
              {totalItems}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 font-inter">
                Completed
              </h3>
              <CheckCircle2 size={20} className="text-green-500" />
            </div>
            <p className="text-2xl font-bold text-black dark:text-white font-sora">
              {completedItems}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 font-inter">
                Pending
              </h3>
              <Clock size={20} className="text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-black dark:text-white font-sora">
              {pendingItems}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 font-inter">
                Completion Rate
              </h3>
              <TrendingUp size={20} className="text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-black dark:text-white font-sora">
              {completionRate}%
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Action Items */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black dark:text-white font-sora">
                Action Items
              </h2>
              <div className="flex items-center gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-sm px-3 py-1 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-[#262626] text-black dark:text-white font-inter"
                >
                  <option value="all">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
                <motion.button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus size={16} />
                  Add Task
                </motion.button>
              </div>
            </div>

            {/* Add Task Form */}
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-gray-50 dark:bg-[#262626] rounded-lg"
              >
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Task description..."
                    value={newActionItem.task}
                    onChange={(e) => setNewActionItem(prev => ({ ...prev, task: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1E1E1E] text-black dark:text-white font-inter"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Assigned to..."
                      value={newActionItem.assigned_to}
                      onChange={(e) => setNewActionItem(prev => ({ ...prev, assigned_to: e.target.value }))}
                      className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1E1E1E] text-black dark:text-white font-inter"
                    />
                    <input
                      type="date"
                      value={newActionItem.deadline}
                      onChange={(e) => setNewActionItem(prev => ({ ...prev, deadline: e.target.value }))}
                      className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1E1E1E] text-black dark:text-white font-inter"
                    />
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      onClick={handleCreateActionItem}
                      disabled={!newActionItem.task.trim() || createActionItemMutation.isPending}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg font-medium text-sm transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {createActionItemMutation.isPending ? "Creating..." : "Create Task"}
                    </motion.button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Action Items List */}
            <div className="space-y-3">
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 dark:bg-gray-600 rounded-lg" />
                    </div>
                  ))}
                </div>
              ) : actionItems.length === 0 ? (
                <div className="text-center py-8">
                  <Circle size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 font-inter">
                    No action items found
                  </p>
                </div>
              ) : (
                actionItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-[#262626] rounded-lg hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-colors"
                  >
                    <motion.button
                      onClick={() => handleToggleStatus(item)}
                      className="mt-1"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {item.status === 'Completed' ? (
                        <CheckCircle2 size={20} className="text-green-500" />
                      ) : (
                        <Circle size={20} className="text-gray-400" />
                      )}
                    </motion.button>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium font-inter ${
                        item.status === 'Completed' 
                          ? 'text-gray-500 dark:text-gray-400 line-through' 
                          : 'text-black dark:text-white'
                      }`}>
                        {item.task}
                      </p>
                      
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400 font-inter">
                        {item.assigned_to && (
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            <span>{item.assigned_to}</span>
                          </div>
                        )}
                        {item.deadline && (
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{formatDate(item.deadline)}</span>
                          </div>
                        )}
                        {item.meeting_title && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded">
                              {item.meeting_title}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Flowchart Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6"
          >
            <h2 className="text-xl font-bold text-black dark:text-white mb-6 font-sora">
              Meeting Flow Visualization
            </h2>
            
            <FlowchartViewer flowchartCode="graph TD; A[Meeting Start] --> B[Discussion]; B --> C[Decision Points]; C --> D[Action Items]" />
            
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2 font-sora">
                Latest Meeting Flow:
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-200 font-inter">
                Team Sync → Progress Review → Task Assignment → Deadline Setting → Action Items
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}