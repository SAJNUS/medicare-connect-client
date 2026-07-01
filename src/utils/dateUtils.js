export const formatToDDMMYYYY = (dateInput) => {
  if (!dateInput) return "";
  
  let dateStr = dateInput;
  
  // If it's a Date object or timestamp (number), convert to YYYY-MM-DD string first
  if (dateInput instanceof Date || typeof dateInput === 'number') {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return ""; // Invalid date
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${dd}-${mm}-${yyyy}`;
  }

  // Handle strings
  if (typeof dateStr !== 'string') {
    dateStr = String(dateStr);
  }

  const parts = dateStr.split("-");
  // If already DD-MM-YYYY or something that doesn't split to at least 3 parts
  if (parts.length < 3) return dateStr;
  
  if (parts[0].length === 2) return dateStr;
  // If YYYY-MM-DD
  if (parts[0].length === 4) return `${parts[2]}-${parts[1]}-${parts[0]}`;
  
  return dateStr;
};

// Generates time slots every 30 mins between 10:00 AM and 10:00 PM.
// Disables slots that have already passed if the selected date is today.
export const generateAvailableTimeSlots = (selectedDateStr, availableTimeSlots = null) => {
  if (!selectedDateStr) return [];
  
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const selectedDateObj = new Date(selectedDateStr);
  const dayName = daysOfWeek[selectedDateObj.getDay()];

  let allSlots = [];
  if (availableTimeSlots && availableTimeSlots[dayName]) {
    allSlots = availableTimeSlots[dayName];
  } else if (!availableTimeSlots) {
    // Fallback if no doctor is selected or passed
    const defaultTimeSlots = {
      Monday: ["10:00 AM", "12:00 PM"],
      Wednesday: ["04:00 PM", "06:00 PM"],
      Friday: ["10:00 AM", "04:00 PM"]
    };
    allSlots = defaultTimeSlots[dayName] || [];
  }

  const today = new Date();
  const selectedDate = new Date(selectedDateStr);

  // If selected date is strictly before today (ignoring time), return empty
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  if (selectedDate < today) return [];

  // If selected date is today, filter out past slots
  if (selectedDate.getTime() === today.getTime()) {
    const now = new Date(); // get current time
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    return allSlots.filter(slot => {
      // Parse slot like "01:30 PM"
      const [time, period] = slot.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;

      if (hours > currentHour) return true;
      if (hours === currentHour && minutes > currentMinute) return true;
      return false;
    });
  }

  // Future date, all slots available
  return allSlots;
};

// Parses "DD-MM-YYYY" and "hh:mm AM/PM" into a native Date object for reliable sorting
export const parseDateTimeForSort = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return 0;
  
  // Convert DD-MM-YYYY to YYYY-MM-DD
  const dateParts = dateStr.split("-");
  let normalizedDate = dateStr;
  if (dateParts[0].length === 2) {
    normalizedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  // Convert hh:mm AM/PM to HH:mm
  let [time, period] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  // Construct standard date object
  const dateObj = new Date(normalizedDate);
  dateObj.setHours(hours, minutes, 0, 0);
  
  return dateObj.getTime();
};
