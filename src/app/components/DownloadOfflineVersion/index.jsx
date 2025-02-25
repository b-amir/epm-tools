"use client";
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { FaDownload } from "react-icons/fa";
import "./index.css";
import { VERSION } from "../../constants/version";

const DownloadOfflineVersion = () => {
  const [isShortForm, setIsShortForm] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollHeight, clientHeight } = document.documentElement;
      const needsScrolling = scrollHeight > clientHeight;
      const scrolledPastThreshold = window.scrollY > 10;

      setIsShortForm(needsScrolling && scrolledPastThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`download-button ${isShortForm ? "short" : "long"}`}>
      <a href={`/EPM Tools - v${VERSION}.html`} download>
        <button aria-label="Download Offline Version">
          <span className="bg"></span>
          <span className="blob"></span>
          <FaDownload />
          <span className="caption">Download Offline Version</span>
        </button>
      </a>
    </div>
  );
};

export default DownloadOfflineVersion;
