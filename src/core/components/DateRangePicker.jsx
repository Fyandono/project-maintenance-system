import { format } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-date-range";

// ⭐️ IMPORT THE CSS MODULE
import styles from "./DateRangePicker.module.css";

const DateRangePicker = ({startDate, endDate, onRangeChange}) => {
    const PRIMARY_COLOR = "#2471b6";

    // State to manage the calendar popover visibility
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    // Convert string dates to Date objects for the component
    const selectionRange = [
        {
            startDate: startDate ? new Date(startDate) : new Date(),
            endDate: endDate ? new Date(endDate) : new Date(),
            key: "selection",
        },
    ];

    const handleSelect = (ranges) => {
        const {selection} = ranges;

        // Convert the Date objects back to 'YYYY/MM/DD' strings for Redux/API
        const fromDate = selection.startDate ? format(selection.startDate, "yyyy-MM-dd") : null;
        const toDate = selection.endDate ? format(selection.endDate, "yyyy-MM-dd") : null;

        // Call the prop function provided by PMPage
        onRangeChange([fromDate, toDate]);
    };

    // Display string for the input field
    const displayValue = startDate && endDate ? `${format(startDate, "dd MMM yyyy")} - ${format(endDate, "dd MMM yyyy")}` : startDate || endDate || "Select Date Range";

    // Helper to close calendar if user clicks outside (or just when dates are selected)
    const handleClose = () => {
        setIsCalendarOpen(false);
    };

    return (
        // ⭐️ Use styles.container
        <div className={styles.container}>
            {/* ⭐️ Use styles.button */}
            <button onClick={() => setIsCalendarOpen(!isCalendarOpen)} className={styles.button}>
                {displayValue}
            </button>

            {isCalendarOpen && (
                // ⭐️ Use styles.calendarPopup
                <div className={styles.calendarPopup}>
                    <DateRange
                        rangeColors={[[PRIMARY_COLOR]]}
                        ranges={selectionRange} // The current selected range(s)
                        onChange={handleSelect}
                        moveRangeOnFirstSelection={false} // Prevents unwanted range shifts
                        showSelectionPreview={true}
                        months={2} // Show two months side-by-side
                        direction="horizontal"
                        // Optional: Add a button to close the popover
                        footer={
                            // ⭐️ Use styles.footer
                            <div className={styles.footer}>
                                {/* ⭐️ Use styles.closeButton */}
                                <button onClick={handleClose} className={styles.closeButton}>
                                    Close
                                </button>
                            </div>
                        }
                    />
                </div>
            )}
        </div>
    );
};

export default DateRangePicker;