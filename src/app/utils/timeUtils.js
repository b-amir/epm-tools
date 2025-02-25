import moment from "moment-jalaali";

export const formatTime = (timeString) => {
  const [hours, minutes] = timeString?.split(":").map(Number);
  return hours * 60 + minutes;
};

export const numberToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMins = mins.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMins}`;
};

export const calculateTaskDays = (taskDuration, distributionPercentage) => {
  // Ensure distributionPercentage is within valid range
  distributionPercentage = Math.max(0, Math.min(100, distributionPercentage));

  const dailyWorkHours = 8; // Standard work hours per day
  const effectiveHoursPerDay = dailyWorkHours * (distributionPercentage / 100);
  const daysRequired = Math.ceil(taskDuration / effectiveHoursPerDay);
  return daysRequired;
};

export const calculateDuration = (startTime, endTime) => {
  if (startTime && endTime) {
    const startMinutes = formatTime(startTime);
    const endMinutes = formatTime(endTime);
    const durationInMinutes = endMinutes - startMinutes;
    const hours = Math.floor(durationInMinutes / 60);
    const mins = durationInMinutes % 60;
    return `${hours}:${mins.toString().padStart(2, "0")}`;
  } else {
    return;
  }
};

export const convertPersianToGregorian = (persianDate) => {
  return moment(persianDate, "jYYYY/jMM/jDD").format("YYYY-MM-DD");
};

export const convertTimeToDecimal = (time) => {
  if (time.match(/^\d{1,3}:\d{2}$/)) {
    const [hours, minutes] = time?.split(":").map(Number);
    const decimalValue = hours + minutes / 60;
    return Number(decimalValue.toFixed(2));
  }
};
