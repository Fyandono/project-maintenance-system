export const formatDate = (dateString) => {
    if (!dateString) return "-";
    
    const fullMatch = dateString.match(
        /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})[^ ]*$/ 
    );

    if (!fullMatch) return "-";

    const [
        ,
        year,
        month,
        day,
        hour = "00",
        minute = "00",
        second = "00",
        // Note: Timezone offset is no longer captured/needed for Date.UTC
    ] = fullMatch;

    // --- Critical Step: Constructing Date using captured UTC parts ---
    // Date.UTC treats these parts as being in the UTC timezone.
    const date = new Date(Date.UTC(
        Number(year),
        Number(month) - 1, // Month is 0-indexed in JS
        Number(day),
        Number(hour),
        Number(minute),
        Number(second)
    ));

    // --- Custom Date Part Formatting ---
    const dayPart = date.toLocaleDateString("en-US", { day: "numeric" });
    const monthPart = date.toLocaleDateString("en-US", { month: "long" });
    const yearPart = date.toLocaleDateString("en-US", { year: "numeric" });
    const datePart = `${dayPart} ${monthPart} ${yearPart}`;

    // The current regex ensures time is present, so the original time check is simplified.
    // We assume if the regex matched the time parts (hour, minute, second), we return time.

    // Format waktu HH.MM (This will display the time in the user's local timezone, WIB)
    const timePart = date
        .toLocaleTimeString("id-ID", { 
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        })
        .replace(":", ".");

    return `${datePart} - ${timePart}`;
};