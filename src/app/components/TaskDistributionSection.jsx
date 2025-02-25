"use client";
import { useState, useEffect, useCallback } from "react";
import { FaRegClock, FaArrowRight, FaChevronDown } from "react-icons/fa";
import { RiDiscountPercentFill, RiSplitCellsHorizontal } from "react-icons/ri";
import { BiReset as ResetIcon } from "react-icons/bi";
import { calculateTaskDays } from "../utils/timeUtils";
import { DayRepresentation } from "./DayRepresentation";

function TaskDistributionSection() {
  const [taskDuration, setTaskDuration] = useState("");
  const [distributionPercentage, setDistributionPercentage] = useState(100);
  const [spanOfDays, setSpanOfDays] = useState("");
  const [showSpanOfDays, setShowSpanOfDays] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSpanOfDays = useCallback(() => {
    if (taskDuration && distributionPercentage) {
      const days = calculateTaskDays(
        parseFloat(taskDuration),
        parseFloat(distributionPercentage)
      );
      setShowSpanOfDays(true);
      setSpanOfDays(days);
    }
  }, [distributionPercentage, taskDuration]);

  useEffect(() => {
    if (distributionPercentage > 100) {
      setDistributionPercentage(100);
    }
    if (distributionPercentage < 0) {
      setDistributionPercentage(0);
    }
  }, [distributionPercentage]);

  useEffect(() => {
    if (taskDuration < 0) {
      setTaskDuration(0);
    }
  }, [taskDuration]);

  useEffect(() => {
    handleSpanOfDays();
    setShowSpanOfDays(showSpanOfDays);
  }, [taskDuration, distributionPercentage, handleSpanOfDays, showSpanOfDays]);

  const handleReset = () => {
    setSpanOfDays("");
    setDistributionPercentage(100);
    setTaskDuration("");
    setShowSpanOfDays(false);
  };

  const handleTaskDurationChange = (e) => {
    const newDuration = Math.max(0, parseFloat(e.target.value));
    setTaskDuration(newDuration);
  };

  const handleDistributionPercentageChange = (e) => {
    const newPercentage = Math.max(
      0,
      Math.min(100, parseFloat(e.target.value))
    );
    setDistributionPercentage(newPercentage);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="section">
      <h3 onClick={toggleExpand} className="collapsible-header">
        <RiSplitCellsHorizontal /> Task Distribution{" "}
        <span className={`rotate-icon ${isExpanded ? "rotated" : ""}`}>
          <FaChevronDown />
        </span>{" "}
      </h3>
      <div
        className={`collapsible-content ${
          isExpanded ? "expanded" : "collapsed"
        }`}
      >
        <label className="row">
          <span>
            <FaRegClock style={{ marginRight: "5px" }} />
            Duration (Hours):
          </span>
          <input
            type="number"
            value={taskDuration}
            onChange={handleTaskDurationChange}
            placeholder="00"
            defaultValue="0"
          />
        </label>
        <label className="row">
          <span>
            <RiDiscountPercentFill style={{ marginRight: "5px" }} />
            Distribution (%):
          </span>
          <input
            type="number"
            value={distributionPercentage}
            onChange={handleDistributionPercentageChange}
            placeholder="100"
            defaultValue="100"
          />
        </label>
        <span className="button-row">
          <button className="primary-button" onClick={handleSpanOfDays}>
            Get Distribution <FaArrowRight />
          </button>
          <button className="secondary-button" onClick={handleReset}>
            <ResetIcon className="reset-icon" /> Reset
          </button>
        </span>
        <div className={`result ${showSpanOfDays && "calculated"}`}>
          <p>
            Span of days:{" "}
            <span
              className={"calculated-digits"}
              style={{
                width: spanOfDays ? "50px" : "0px",
                transition: "all 0.3s ease",
                display: "inline-block",
              }}
            >
              {" "}
              {spanOfDays}{" "}
            </span>
          </p>
          {showSpanOfDays && (
            <DayRepresentation
              totalDuration={parseFloat(taskDuration)}
              distributionPercentage={parseFloat(distributionPercentage)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskDistributionSection;
