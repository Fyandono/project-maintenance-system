export const formatDate = (dateString) => {
    if (!dateString) return "-";
    
    // Check if it's date-only (yyyy-mm-dd = 10 characters)
    const isDateOnly = dateString.length === 10 && dateString.match(/^\d{4}-\d{2}-\d{2}$/);
    
    let date;
    
    if (isDateOnly) {
        // Parse date-only string
        const [year, month, day] = dateString.split('-').map(Number);
        date = new Date(Date.UTC(year, month - 1, day));
    } else {
        // Parse datetime string
        const fullMatch = dateString.match(
            /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/
        );
        
        if (!fullMatch) return "-";
        
        const [, year, month, day, hour, minute, second] = fullMatch.map(Number);
        date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
    }
    
    // Format date part
    const dayPart = date.toLocaleDateString("en-US", { day: "numeric" });
    const monthPart = date.toLocaleDateString("en-US", { month: "long" });
    const yearPart = date.toLocaleDateString("en-US", { year: "numeric" });
    
    if (isDateOnly) {
        return `${dayPart} ${monthPart} ${yearPart}`;
    }
    
    // Format time part
    const timePart = date
        .toLocaleTimeString("id-ID", { 
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        })
        .replace(":", ".");
    
    return `${dayPart} ${monthPart} ${yearPart} - ${timePart}`;
};