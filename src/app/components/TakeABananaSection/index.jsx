"use client";

import { useState, useEffect } from "react";
import "./index.css";

const TakeABananaSection = () => {
  const [bananaCount, setBananaCount] = useState();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showSecondPopover, setShowSecondPopover] = useState(false);

  useEffect(() => {
    fetchBananaCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const secondPopoverShown = localStorage.getItem("secondPopoverShown");
    if (!secondPopoverShown) {
      const timer = setTimeout(() => {
        if (!isRevealed) {
          setShowSecondPopover(true);
        }
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [isRevealed]);

  const fetchBananaCount = async () => {
    try {
      const response = await fetch("/api/banana-count");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setBananaCount(data.count);
    } catch (error) {
      console.error("Error fetching banana count:", error);
      setBananaCount(fallbackBananaCount);
    }
  };

  const handleClick = async () => {
    setIsButtonDisabled(true);

    try {
      const response = await fetch("/api/increment-banana", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setBananaCount(data.count);
    } catch (error) {
      console.error("Error incrementing banana count:", error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const handleReveal = () => {
    setIsRevealed(true);
    setShowSecondPopover(false);
    localStorage.setItem("secondPopoverShown", "true");
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowSecondPopover(false);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className="banana-button-section">
      {!isRevealed ? (
        <div
          className="three-dots"
          onClick={handleReveal}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span className="dot">&#x2022;</span>
          <span className="dot">&#x2022;</span>
          <span className="dot">&#x2022;</span>
          {isHovered && (
            <div className="popover slide-up">
              You&apos;ve found the secret!
            </div>
          )}{" "}
          {showSecondPopover && (
            <div className="second-popover slide-up">
              ** pssssssst! ** Over here!
            </div>
          )}{" "}
        </div>
      ) : (
        <div className="reveal-animation">
          <button
            onClick={handleClick}
            className="banana-button"
            style={{ width: "200px" }}
            disabled={isButtonDisabled}
          >
            <span className="take-a-banana">Take a 🍌 </span>
          </button>
          <span
            className={`bananaCount ${
              bananaCount !== undefined ? "slide-down" : ""
            }`}
          >
            {bananaCount !== undefined ? (
              <>
                <b>{bananaCount}</b> <span>bananas have been taken </span>
              </>
            ) : (
              <span
                className="skeleton-loader"
                style={{ width: "200px", height: "20px" }}
              />
            )}
          </span>
        </div>
      )}
    </div>
  );
};

export default TakeABananaSection;
