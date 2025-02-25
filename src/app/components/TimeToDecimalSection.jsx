"use client";
import { useState } from "react";
import { FaRegClock, FaArrowRight, FaChevronDown } from "react-icons/fa";
import { BiReset as ResetIcon } from "react-icons/bi";
import { FaArrowRightArrowLeft } from "react-icons/fa6";

function TimeToDecimalSection() {
  const [inputTime, setInputTime] = useState("");
  const [decimalTime, setDecimalTime] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const convertTimeToDecimal = () => {
    if (inputTime.match(/^\d{2}:\d{2}$/)) {
      const [hours, minutes] = inputTime?.split(":").map(Number);
      const decimalValue = hours + minutes / 60;
      setDecimalTime(decimalValue.toFixed(2));
    }
  };

  const handleReset = () => {
    setInputTime("");
    setDecimalTime("");
  };

  const handleInputChange = (e) => {
    let inputValue = e.target.value.replace(/[^0-9]/g, "");
    if (inputValue.length > 4) {
      inputValue = inputValue.substring(0, 4);
    }
    if (inputValue.length === 4 && !inputValue.includes(":")) {
      inputValue = inputValue.slice(0, 2) + ":" + inputValue.slice(2);
    }
    setInputTime(inputValue);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="section">
      <h3 onClick={toggleExpand} className="collapsible-header">
        <FaArrowRightArrowLeft /> HH:mm to Decimal{" "}
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
            Input HH:mm
          </span>
          <input
            type="text"
            value={inputTime}
            onChange={handleInputChange}
            placeholder="00:00"
            defaultValue="00:00"
          />
        </label>
        <span className="button-row">
          <button className="primary-button" onClick={convertTimeToDecimal}>
            Convert to Decimal
            <FaArrowRight />
          </button>
          <button className="secondary-button" onClick={handleReset}>
            <ResetIcon className="reset-icon" /> Reset
          </button>
        </span>
        <div className={`result ${decimalTime && "calculated"}`}>
          <p>
            Decimal Time:{" "}
            <span
              className={"calculated-digits"}
              style={{
                width: decimalTime ? "50px" : "0px",
                transition: "all 0.3s ease",
                display: "inline-block",
              }}
            >
              {" "}
              {decimalTime}{" "}
            </span>
          </p>{" "}
        </div>
      </div>
    </div>
  );
}

export default TimeToDecimalSection;
