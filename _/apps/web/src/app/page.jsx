"use client";

import { useState } from "react";
import Layout from "../components/Layout";
import HomePage from "../components/HomePage";
import LiveMeeting from "../components/LiveMeeting";
import MeetingHistory from "../components/MeetingHistory";
import Dashboard from "../components/Dashboard";

export default function MEETPILOT() {
  const [currentPage, setCurrentPage] = useState("home");

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onPageChange={setCurrentPage} />;
      case "live-meeting":
        return <LiveMeeting />;
      case "history":
        return <MeetingHistory />;
      case "dashboard":
        return <Dashboard />;
      default:
        return <HomePage onPageChange={setCurrentPage} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderCurrentPage()}
    </Layout>
  );
}
