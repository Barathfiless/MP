import { useState, useCallback } from "react";
import { motion } from "motion/react";
import {
  Play,
  Square,
  Upload,
  Mic,
  MicOff,
  FileText,
  Save,
  Loader2,
} from "lucide-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export default function LiveMeeting() {
  const [selectedPlatform, setSelectedPlatform] = useState("Google Meet");
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [transcriptionLoading, setTranscriptionLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  
  const queryClient = useQueryClient();

  const platforms = [
    { name: "Google Meet", color: "bg-green-500" },
    { name: "Zoom", color: "bg-blue-500" },
    { name: "Microsoft Teams", color: "bg-purple-500" },
    { name: "Skype", color: "bg-cyan-500" },
  ];

  // Mutation for transcription
  const transcribeMutation = useMutation({
    mutationFn: async (audioData) => {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioData }),
      });
      if (!response.ok) {
        throw new Error('Failed to transcribe audio');
      }
      return response.json();
    },
    onSuccess: (data) => {
      setTranscript(data.transcript);
      setTranscriptionLoading(false);
    },
    onError: () => {
      setTranscriptionLoading(false);
    },
  });

  // Mutation for summarization
  const summarizeMutation = useMutation({
    mutationFn: async (transcript) => {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });
      if (!response.ok) {
        throw new Error('Failed to summarize meeting');
      }
      return response.json();
    },
    onSuccess: (data) => {
      setSummary(data.summary);
      setSummaryLoading(false);
    },
    onError: () => {
      setSummaryLoading(false);
    },
  });

  // Mutation for saving meeting
  const saveMeetingMutation = useMutation({
    mutationFn: async (meetingData) => {
      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meetingData),
      });
      if (!response.ok) {
        throw new Error('Failed to save meeting');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      // Reset form
      setTranscript("");
      setSummary("");
      setMeetingTitle("");
      setAudioFile(null);
    },
  });

  const handleStartRecording = useCallback(() => {
    setIsRecording(true);
    setTranscript("");
    
    // Mock real-time transcription simulation
    const mockTranscriptChunks = [
      "Welcome everyone to today's meeting.",
      " Let's start by reviewing our progress from last week.",
      " John has completed the authentication system.",
      " Sarah has been working on the dashboard redesign.",
      " Mike has optimized our API response times by 40%.",
      " For this week, we need to focus on the user profile feature.",
      " Our deadline for the beta release is October 25th.",
      " Let's schedule our next check-in for Friday at 2 PM.",
    ];
    
    let chunkIndex = 0;
    const interval = setInterval(() => {
      if (chunkIndex < mockTranscriptChunks.length) {
        setTranscript(prev => prev + mockTranscriptChunks[chunkIndex]);
        chunkIndex++;
      } else {
        clearInterval(interval);
      }
    }, 2000);
    
    // Store interval for cleanup
    window.transcriptionInterval = interval;
  }, []);

  const handleStopRecording = useCallback(() => {
    setIsRecording(false);
    if (window.transcriptionInterval) {
      clearInterval(window.transcriptionInterval);
    }
  }, []);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setTranscriptionLoading(true);
      // Simulate file transcription
      setTimeout(() => {
        transcribeMutation.mutate("uploaded_audio_file");
      }, 1000);
    }
  }, [transcribeMutation]);

  const handleSummarize = useCallback(() => {
    if (transcript) {
      setSummaryLoading(true);
      summarizeMutation.mutate(transcript);
    }
  }, [transcript, summarizeMutation]);

  const handleSaveMeeting = useCallback(() => {
    if (meetingTitle && transcript) {
      saveMeetingMutation.mutate({
        title: meetingTitle,
        platform: selectedPlatform,
        transcript,
        summary,
        duration: 30, // Mock duration
      });
    }
  }, [meetingTitle, transcript, summary, selectedPlatform, saveMeetingMutation]);

  return (
    <div className="h-full overflow-y-auto bg-[#F3F3F3] dark:bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Platform Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-black dark:text-white mb-4 font-sora">
            Select Meeting Platform
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {platforms.map((platform) => (
              <motion.button
                key={platform.name}
                onClick={() => setSelectedPlatform(platform.name)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedPlatform === platform.name
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-8 h-8 ${platform.color} rounded-lg mb-2 mx-auto`} />
                <p className="text-sm font-medium text-black dark:text-white font-inter">
                  {platform.name}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recording Control */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6"
          >
            <h3 className="text-lg font-bold text-black dark:text-white mb-6 font-sora">
              Recording Control
            </h3>
            
            {/* Meeting Title Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-inter">
                Meeting Title
              </label>
              <input
                type="text"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                placeholder="Enter meeting title..."
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-[#262626] text-black dark:text-white font-inter"
              />
            </div>

            {/* Recording Buttons */}
            <div className="space-y-4">
              <motion.button
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-lg font-medium transition-all duration-200 ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isRecording ? (
                  <>
                    <Square size={20} />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Play size={20} />
                    Start Recording
                  </>
                )}
              </motion.button>

              <div className="relative">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="audio-upload"
                />
                <motion.label
                  htmlFor="audio-upload"
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-lg font-medium bg-gray-500 hover:bg-gray-600 text-white cursor-pointer transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Upload size={20} />
                  Upload Audio File
                </motion.label>
              </div>
            </div>

            {/* Recording Indicator */}
            {isRecording && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 flex items-center gap-3"
              >
                <motion.div
                  className="w-3 h-3 bg-red-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
                <span className="text-red-500 font-medium font-inter">
                  Recording in progress...
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Real-time Transcription */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-black dark:text-white font-sora">
                Live Transcription
              </h3>
              {transcriptionLoading && (
                <Loader2 size={20} className="animate-spin text-blue-500" />
              )}
            </div>
            
            <div className="h-64 border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-[#262626] overflow-y-auto">
              {transcript ? (
                <p className="text-black dark:text-white font-inter leading-relaxed">
                  {transcript}
                </p>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 font-inter italic">
                  Start recording or upload an audio file to see transcription...
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <motion.button
                onClick={handleSummarize}
                disabled={!transcript || summaryLoading}
                className="flex-1 flex items-center justify-center gap-3 py-3 px-6 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-all duration-200"
                whileHover={{ scale: summaryLoading ? 1 : 1.02 }}
                whileTap={{ scale: summaryLoading ? 1 : 0.98 }}
              >
                {summaryLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <FileText size={20} />
                )}
                {summaryLoading ? "Generating Summary..." : "Summarize Meeting"}
              </motion.button>

              <motion.button
                onClick={handleSaveMeeting}
                disabled={!meetingTitle || !transcript || saveMeetingMutation.isPending}
                className="flex-1 flex items-center justify-center gap-3 py-3 px-6 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-all duration-200"
                whileHover={{ scale: saveMeetingMutation.isPending ? 1 : 1.02 }}
                whileTap={{ scale: saveMeetingMutation.isPending ? 1 : 0.98 }}
              >
                {saveMeetingMutation.isPending ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Save size={20} />
                )}
                {saveMeetingMutation.isPending ? "Saving..." : "Save Meeting"}
              </motion.button>
            </div>

            {/* Summary Display */}
            {summary && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700"
              >
                <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-2 font-sora">
                  Meeting Summary:
                </h4>
                <p className="text-purple-700 dark:text-purple-200 font-inter whitespace-pre-line">
                  {summary}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}