export const formatDate = (dateString) => {
    if (!dateString) return "-";

    const fullMatch = dateString.match(
        /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?))?(?:([+-]\d{2}))?$/
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
    ] = fullMatch;

    const date = new Date(Date.UTC(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        Number(second)
    ));

    const dayPart = date.toLocaleDateString("en-US", { day: "numeric" });
    const monthPart = date.toLocaleDateString("en-US", { month: "long" });
    const yearPart = date.toLocaleDateString("en-US", { year: "numeric" });
    const datePart = `${dayPart} ${monthPart} ${yearPart}`;

    // Jika tidak ada waktu → hanya tanggal
    if (!fullMatch[4]) return datePart;

    // Format waktu HH.MM
    const timePart = date
        .toLocaleTimeString("id-ID", { // Use id-ID for HH.MM format
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        })
        .replace(":", ".");

    return `${datePart} - ${timePart}`;
};