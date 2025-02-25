## Features

- **Time Duration Calculation**: Calculate work duration by specifying start/end times and break duration. Results are displayed in both `HH:MM` and decimal formats for flexibility.
- **Monthly Report Generation**: Generate performance reports or upload existing `.xlsx` files for analysis.
- **Performance Tracking**: View daily work hours in a table format with support for Persian calendar dates, multilingual labels, and rest time adjustments.
- **Task Distribution Analysis**: Visualize task allocation across days, including total hours, distribution percentages, and day-span highlights.

---

## Usage

### ⏱️ Time Duration Calculator
1. Set **Start Time** and **End Time** (e.g., `08:00 AM` to `05:00 PM`).
2. Add **Break Time** (e.g., `00:45` for 45 minutes).
3. Click **Calculate Duration** to see results like `8:15` (hours:minutes) and `8.25` (decimal).

### 📊 Monthly Reports
- Click **Generate Report** to create a new report.
- Drag and drop an Excel file (e.g., `Drop.xlsx`) into the designated area for analysis.
- Use **Reset** to clear inputs or uploaded files.

### 📅 Performance Reports (Persian Support)
- Displays entries in Persian calendar format (e.g., `1403/11/01` for Bahman 1403).
- Columns include:
  - **مدت**: Duration in `HH:MM`.
  - **مدت اعشاری**: Decimal duration (e.g., `9.17` hours).
- Dashes (`-`) indicate non-working or missing data.

### 📌 Task Distribution
1. Enter **Duration (Hours)** (e.g., `88`) and **Distribution (%)** (e.g., `57`).
2. Click **Get Distribution** to see task allocation across a **Span of Days** (e.g., `20` days).
3. Days are highlighted in brackets (e.g., `[2] [3] ... [20]`).

---

## Build Options

### Single HTML File Output:
```bash
npm run export:html
```
Generates a static `HTML` file in the `public` folder. Ideal for portable deployments.

### Dynamic Build:
```bash
npm run build
```
Creates a dynamic build for advanced features like database queries and HTML downloads.

---

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.