import React from "react";
import { FaMagic } from "react-icons/fa";
import TimeDurationSection from "./components/TimeDurationSection";
import TimeToDecimalSection from "./components/TimeToDecimalSection";
import TaskDistributionSection from "./components/TaskDistributionSection";
import MonthReportSection from "./components/MonthReportSection";
import dynamic from "next/dynamic";
import { VERSION } from "./constants/version";

const isSingleHTMLBuild = process.env.SINGLE_HTML_BUILD === "true";

export default function Home() {
  const TakeABananaSection = dynamic(
    () => import("./components/TakeABananaSection"),
    { ssr: false }
  );
  const DownloadOfflineVersion = dynamic(
    () => import("./components/DownloadOfflineVersion"),
    { ssr: false }
  );

  return (
    <div id="root">
      <div className="header">
        <h1>
          <FaMagic className="animated-icon" />
          <span style={{ color: "#646464" }}>
            EPM Tools <small className="version-number">{VERSION}</small>
          </span>
        </h1>
      </div>
      <div>
        <TimeDurationSection />
        <MonthReportSection />
        <TimeToDecimalSection />
        <TaskDistributionSection />
      </div>
      {!isSingleHTMLBuild && (
        <>
          <TakeABananaSection />
          <DownloadOfflineVersion />
        </>
      )}
    </div>
  );
}
