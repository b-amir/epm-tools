"use client";
import { useState, useEffect } from "react";
import { MdOutlineStart, MdOutlineFreeBreakfast } from "react-icons/md";
import { FaArrowRight, FaChevronDown } from "react-icons/fa";
import { BiReset as ResetIcon } from "react-icons/bi";
import { formatTime, numberToTime } from "../utils/timeUtils";
import { RiTimeLine } from "react-icons/ri";

function TimeDurationSection() {
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("17:00");
  const [breakTime, setBreakTime] = useState("00:45");
  const [duration, setDuration] = useState("");
  const [decimalDuration, setDecimalDuration] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);

  const calculateDuration = () => {
    if (startTime && endTime && breakTime.match(/^\d{2}:\d{2}$/)) {
      const startMinutes = formatTime(startTime);
      const endMinutes = formatTime(endTime);
      const breakMinutes = formatTime(breakTime);

      const totalMinutes = Math.abs(endMinutes - startMinutes) - breakMinutes;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      setDuration(`${hours}:${minutes.toString().padStart(2, "0")}`);

      const decimalHours = hours + minutes / 60;
      setDecimalDuration(decimalHours.toFixed(2));

      if (!breakTime) {
        const ninetyPercentOfTotalMinutes = Math.round(
          (totalMinutes * 0.9883) / 60
        );
        const formattedNinetyPercent = `${ninetyPercentOfTotalMinutes
          .toString()
          .padStart(2, "0")}:00`;
        setBreakTime(formattedNinetyPercent);
      }
    }
  };

  useEffect(() => {
    const calculateInitialBreakTime = () => {
      if (startTime && endTime) {
        const startMinutes = formatTime(startTime);
        const endMinutes = formatTime(endTime);
        const totalMinutes = endMinutes - startMinutes;

        if (totalMinutes <= 510) {
          const breakMinutes = Math.round(totalMinutes * 0.0883);
          setBreakTime(numberToTime(breakMinutes));
        } else {
          const breakMinutes = 45;
          setBreakTime(numberToTime(breakMinutes));
        }
      }
    };
    calculateInitialBreakTime();
  }, [startTime, endTime]);

  const handleReset = () => {
    setStartTime("08:00");
    setEndTime("17:00");
    setDuration("");
    setDecimalDuration("");
    setBreakTime("00:45");
  };

  const handleBreakChange = (e) => {
    let inputValue = e.target.value.replace(/[^0-9]/g, "");
    if (inputValue.length > 4) {
      inputValue = inputValue.substring(0, 4);
    }
    if (inputValue.length === 4 && !inputValue.includes(":")) {
      inputValue = inputValue.slice(0, 2) + ":" + inputValue.slice(2);
    }

    setBreakTime(inputValue);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="section">
      <h3 onClick={toggleExpand} className="collapsible-header">
        <RiTimeLine /> Time Duration{" "}
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
            <MdOutlineStart style={{ marginRight: "5px" }} /> Start Time:
          </span>
          <input
            type="time"
            value={startTime}
            defaultValue={"08:00"}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>
        <label className="row">
          <span>
            <MdOutlineStart
              style={{ marginRight: "5px", transform: "rotate(180deg)" }}
            />{" "}
            End Time:
          </span>
          <input
            type="time"
            value={endTime}
            defaultValue={"17:00"}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </label>
        <label className="row">
          <span>
            <MdOutlineFreeBreakfast style={{ marginRight: "5px" }} /> Break
            Time:
          </span>
          <input
            type="text"
            value={breakTime}
            onChange={handleBreakChange}
            placeholder="00:00"
          />
        </label>
        <span className="button-row">
          <button className="primary-button" onClick={calculateDuration}>
            Calculate Duration <FaArrowRight />
          </button>
          <button className="secondary-button" onClick={handleReset}>
            <ResetIcon className="reset-icon" /> Reset
          </button>
        </span>
        <div className={`result ${duration && "calculated"}`}>
          <p>
            Duration:{" "}
            <span
              className={"calculated-digits"}
              style={{
                width: duration ? "50px" : "0px",
                transition: "all 0.3s ease",
                display: "inline-block",
              }}
            >
              {duration}{" "}
            </span>
          </p>
          <p>
            Decimal Duration:{" "}
            <span
              className={"calculated-digits"}
              style={{
                width: decimalDuration ? "50px" : "0px",
                transition: "all 0.3s ease",
                display: "inline-block",
              }}
            >
              {decimalDuration}{" "}
            </span>{" "}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TimeDurationSection;
