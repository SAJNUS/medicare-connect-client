const fs = require('fs');

let head = require('child_process').execSync('git show HEAD:src/pages/Dashboard/Patient/MyAppointments.jsx').toString();
let current = fs.readFileSync('src/pages/Dashboard/Patient/MyAppointments.jsx', 'utf8');

// The script deleted from `toast.success("Appointment cancelled` down to `toast.success("Appointment rescheduled`.
// Let's replace the broken block in `current` with the original block from `head`.

const brokenBlockRegex = /toast\.success\("Appointment rescheduled"\);[\s\S]*?setAppointments\(appointments\.map\(a =>/;

const headMatch = head.match(/toast\.success\("Appointment cancelled successfully"\);[\s\S]*?toast\.success\("Appointment rescheduled successfully!"\);\n\s*setAppointments\(appointments\.map\(a =>/);

if (headMatch) {
  current = current.replace(brokenBlockRegex, headMatch[0]);
  fs.writeFileSync('src/pages/Dashboard/Patient/MyAppointments.jsx', current);
  console.log("Fixed MyAppointments.jsx");
} else {
  console.log("Could not find head block for MyAppointments");
}
