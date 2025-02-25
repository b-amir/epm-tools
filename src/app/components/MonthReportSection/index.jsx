"use client";
/* eslint-disable @next/next/no-img-element */
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { FaRegFileExcel } from "react-icons/fa6";
import { FaChevronDown, FaChevronUp, FaArrowRight } from "react-icons/fa";
import { BiReset as ResetIcon } from "react-icons/bi";
import { FaDownload } from "react-icons/fa";

import {
  calculateDuration,
  convertPersianToGregorian,
  convertTimeToDecimal,
} from "../../utils/timeUtils";
import moment from "moment-jalaali";
import { FaRegQuestionCircle } from "react-icons/fa";
import "./index.css";

function MonthReportSection() {
  const [, setFileData] = useState(null);
  const [fileName, setFileName] = useState("");
  const [dailyDurations, setDailyDurations] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const [reportDate, setReportDate] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHintExpanded, setIsHintExpanded] = useState(false);
  const [considerBreakTime, setConsiderBreakTime] = useState(true);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setFileName(file.name);
      readExcelFile(file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".xlsx",
  });

  const readExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        range: "A1:D32",
      });

      processData(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    // Re-process data whenever considerBreakTime changes
    if (dailyDurations.length > 0) {
      const updatedDurations = dailyDurations.map((entry) => {
        if (entry.duration && entry.duration !== "NaN:NaN") {
          let duration = calculateDuration(entry.startTime, entry.endTime);
          if (considerBreakTime) {
            duration = subtractBreakTime(duration);
          }
          return { ...entry, duration };
        }
        return entry;
      });
      setDailyDurations(updatedDurations);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [considerBreakTime]);

  const processData = (data) => {
    const durations = [];
    const today = moment().startOf("day");

    if (data.length > 1) {
      const firstDate = data[1][0];
      const dateMoment = moment(firstDate, "jYYYY/jMM/jDD");
      const monthAndYear = new Intl.DateTimeFormat("fa-IR-u-nu-latn", {
        month: "short",
        year: "numeric",
      }).format(dateMoment);
      setReportDate(monthAndYear);
    }

    data.forEach((row, index) => {
      if (index === 0) return;

      const persianDate = row[0];
      const dayOfWeek = row[1];
      const startTime = row[2];
      const endTime = row[3];

      const gregorianDate = convertPersianToGregorian(persianDate);
      const dateMoment = moment(gregorianDate, "YYYY-MM-DD");

      let duration = null;
      let status = "";

      if (dateMoment.isSame(today, "day")) {
        status = "امروز";
      } else if (dateMoment.isAfter(today, "day")) {
        status = "...";
      } else if (startTime === " " && endTime === " ") {
        status = " - ";
      } else if (startTime === " ") {
        status = "زمان ورود ثبت نشده";
      } else if (endTime === " ") {
        status = "زمان خروج ثبت نشده";
      } else {
        duration = calculateDuration(startTime, endTime);
        if (considerBreakTime) {
          duration = subtractBreakTime(duration);
        }
      }

      durations.push({
        date: persianDate,
        dayOfWeek,
        duration,
        status,
        startTime,
        endTime,
      });
    });
    setDailyDurations(durations);
  };

  const handleReset = () => {
    setFileData(null);
    setFileName("");
    setDailyDurations([]);
    setShowReport(false);
  };

  const handleShowReport = () => {
    setShowReport(true);
  };

  const calculateTotalDuration = () => {
    let totalMinutes = 0;
    dailyDurations.forEach((entry) => {
      if (entry.duration && entry.duration !== "NaN:NaN") {
        const [hours, minutes] = entry.duration?.split(":").map(Number) ?? "";
        totalMinutes += hours * 60 + minutes;
      }
    });

    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    return `${totalHours.toString().padStart(2, "0")}:${remainingMinutes
      .toString()
      .padStart(2, "0")}`;
  };

  const calculateWorkingDays = () => {
    return dailyDurations.filter(
      (entry) => entry.duration && entry.duration !== "NaN:NaN"
    ).length;
  };

  const calculateDifferenceFromNormal = () => {
    const normalDailyMinutes = considerBreakTime ? 7 * 60 + 45 : 8 * 60 + 30; // Adjust based on toggle
    const totalMinutesWorked = dailyDurations.reduce((total, entry) => {
      if (entry.duration && entry.duration !== "NaN:NaN") {
        const [hours, minutes] = entry.duration.split(":").map(Number);
        return total + (hours * 60 + minutes);
      }
      return total;
    }, 0);

    const totalNormalMinutes = calculateWorkingDays() * normalDailyMinutes;
    const differenceMinutes = totalMinutesWorked - totalNormalMinutes;
    const diffHours = Math.floor(Math.abs(differenceMinutes) / 60);
    const diffMinutes = Math.abs(differenceMinutes) % 60;
    const sign = differenceMinutes >= 0 ? "+" : "-";

    return `${sign}${diffHours.toString().padStart(2, "0")}:${diffMinutes
      .toString()
      .padStart(2, "0")}`;
  };

  const subtractBreakTime = (duration) => {
    const [hours, minutes] = duration?.split(":").map(Number) ?? "";
    let totalMinutes = hours * 60 + minutes;

    const breakMinutes =
      totalMinutes <= 510 ? Math.round(totalMinutes * 0.0883) : 45;
    totalMinutes -= breakMinutes;

    const realHours = Math.floor(totalMinutes / 60);
    const realMinutes = totalMinutes % 60;
    return `${realHours.toString().padStart(2, "0")}:${realMinutes
      .toString()
      .padStart(2, "0")}`;
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleHintExpand = () => {
    setIsHintExpanded(!isHintExpanded);
  };

  const handleExport = () => {
    const worksheetData = [
      ["تاریخ", "روز", "مدت", "مدت اعشاری"],
      ...dailyDurations.map((entry) => [
        entry.date,
        entry.dayOfWeek,
        entry.duration || entry.status,
        entry.duration ? convertTimeToDecimal(entry.duration) : "",
      ]),
      [
        "مجموع ماه",
        "",
        calculateTotalDuration(),
        convertTimeToDecimal(calculateTotalDuration()),
      ],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    XLSX.writeFile(workbook, `گزارش ${reportDate}.xlsx`);
  };

  return (
    <div className="section">
      <h3 onClick={toggleExpand} className="collapsible-header">
        <FaRegFileExcel /> Monthly Report{" "}
        <span className={`rotate-icon ${isExpanded ? "rotated" : ""}`}>
          <FaChevronDown />
        </span>
      </h3>
      <div
        className={`collapsible-content ${
          isExpanded ? "expanded" : "collapsed"
        }`}
      >
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here...</p>
          ) : (
            <p>Drop .xlsx report, or click to select</p>
          )}
          {fileName && <b>Selected file: {fileName}</b>}
        </div>
        <div className="hint-section">
          <h5
            onClick={toggleHintExpand}
            className="collapsible-header"
            style={{ fontSize: "0.9rem", opacity: "0.8" }}
          >
            <>
              <FaRegQuestionCircle /> Where to get the report?{" "}
            </>
            {isHintExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </h5>
          <div
            className={`collapsible-content ${
              isHintExpanded ? "expanded" : "collapsed"
            }`}
          >
            <div style={{ direction: "rtl", fontSize: "12px" }}>
              گزارش ماهانه را از پنل حضور و غیاب دریافت کنید.
            </div>
            <br />
            <img
              src="/export.png"
              alt="Export hint"
              className="export-hint-image"
            />
          </div>
        </div>
        <span className="button-row">
          <button
            className="primary-button"
            onClick={handleShowReport}
            disabled={!dailyDurations.length}
          >
            Generate Report <FaArrowRight />
          </button>
          <button className="secondary-button" onClick={handleReset}>
            <ResetIcon className="reset-icon" /> Reset
          </button>
        </span>
        {dailyDurations.length > 0 && (
          <div className={`result ${showReport ? "calculated" : ""}`}>
            <table>
              <caption>
                <b>گزارش عملکرد {reportDate}</b>
                <br />
                <div className="toggle-break-time">
                  <label>
                    <small> کل زمان حضور</small>
                    <input
                      type="checkbox"
                      checked={considerBreakTime}
                      onChange={() => setConsiderBreakTime(!considerBreakTime)}
                    />
                    <small> با کسر استراحت</small>
                  </label>
                </div>{" "}
              </caption>
              <thead>
                <tr>
                  <th>تاریخ</th>
                  <th>روز</th>
                  <th>مدت</th>
                  <th>مدت اعشاری</th>
                </tr>
              </thead>
              <tbody>
                {dailyDurations.map((entry, index) => {
                  const showStatus =
                    !entry.duration || entry.duration === "NaN:NaN";
                  return (
                    <tr key={index}>
                      <td>{entry.date}</td>
                      <td>{entry.dayOfWeek}</td>
                      {showStatus ? (
                        <td colSpan="2">{entry.status}</td>
                      ) : (
                        <>
                          <td className="duration-cell">
                            <span
                              className={
                                considerBreakTime ? "slide-exit" : "slide-enter"
                              }
                              key={entry.duration}
                            >
                              {entry.duration}
                            </span>
                          </td>
                          <td className="duration-cell">
                            <span
                              className={
                                considerBreakTime ? "slide-exit" : "slide-enter"
                              }
                              key={convertTimeToDecimal(entry.duration)}
                            >
                              <b>{convertTimeToDecimal(entry.duration)}</b>
                            </span>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan="2">
                    <b>مجموع ماه</b>
                  </td>
                  <td className="duration-cell">
                    <span key={calculateTotalDuration()}>
                      {calculateTotalDuration()}
                    </span>
                  </td>
                  <td className="duration-cell">
                    <span key={convertTimeToDecimal(calculateTotalDuration())}>
                      <b>{convertTimeToDecimal(calculateTotalDuration())}</b>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <span className="button-row">
              <button
                className="primary-button"
                onClick={handleExport}
                disabled={!dailyDurations.length}
              >
                دریافت گزارش <FaDownload />
              </button>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default MonthReportSection;
