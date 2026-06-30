export const formatToDDMMYYYY = (dateStr) => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  // If already DD-MM-YYYY
  if (parts[0].length === 2) return dateStr;
  // If YYYY-MM-DD
  if (parts[0].length === 4) return `${parts[2]}-${parts[1]}-${parts[0]}`;
  return dateStr;
};

// Generates time slots every 30 mins between 10:00 AM and 10:00 PM.
// Disables slots that have already passed if the selected date is today.
export const generateAvailableTimeSlots = (selectedDateStr) => {
  if (!selectedDateStr) return [];
  
  const allSlots = [
    "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
    "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM",
    "09:00 PM", "09:30 PM", "10:00 PM"
  ];

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
