/* eslint-disable react/prop-types */
export const DayRepresentation = ({
  totalDuration,
  distributionPercentage,
}) => {
  const dailyWorkHours = 8; // Standard work hours per day
  const effectiveHoursPerDay = dailyWorkHours * (distributionPercentage / 100);
  const totalDays = Math.ceil(totalDuration / effectiveHoursPerDay);

  const squares = [];

  for (let i = 1; i <= totalDays; i++) {
    const isLastDay = i === totalDays;
    const dayHours = isLastDay
      ? totalDuration - (totalDays - 1) * effectiveHoursPerDay
      : effectiveHoursPerDay;
    const fillHeightPercentage = (dayHours / dailyWorkHours) * 100;

    squares.push(
      <div
        key={i}
        style={{
          width: "20px",
          height: "20px",
          border: "1px solid black",
          position: "relative",
          display: "inline-block",
          margin: "2px",
          borderRadius: "3px",
          overflow: "hidden",
          textAlign: "center",
          lineHeight: "20px",
          color: "white",
          textShadow: "0px 0px 5px black",
          fontSize: "10px",
          fontWeight: "bolder",
        }}
      >
        {/* Day number text */}
        <div
          style={{
            position: "absolute",
            zIndex: 2,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {i}
        </div>

        {/* Distribution percentage border */}
        <div
          style={{
            borderTop: distributionPercentage < 100 ? "1px solid #396881" : "",
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: `${distributionPercentage}%`,
            width: "100%",
            zIndex: 1,
          }}
        ></div>

        {/* Day fill */}
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.16)",
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: `${Math.min(
              fillHeightPercentage,
              distributionPercentage
            )}%`,
            width: "100%",
            zIndex: 1,
          }}
        ></div>
      </div>
    );
  }

  return <div>{squares}</div>;
};
