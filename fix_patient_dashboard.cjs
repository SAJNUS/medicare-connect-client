const fs = require('fs');

let head = require('child_process').execSync('git show HEAD:src/pages/Dashboard/PatientDashboard.jsx').toString();
let current = fs.readFileSync('src/pages/Dashboard/PatientDashboard.jsx', 'utf8');

const brokenBlockRegex = /toast\.success\("Appointment rescheduled"\);[\s\S]*?setAppointments\(appointments\.map\(a =>/;
const headMatch = head.match(/toast\.success\("Appointment rescheduled successfully!"\);\n\s*setAppointments\(appointments\.map\(a =>/);

if (headMatch) {
  current = current.replace(brokenBlockRegex, headMatch[0]);
  fs.writeFileSync('src/pages/Dashboard/PatientDashboard.jsx', current);
  console.log("Fixed PatientDashboard.jsx via regex 1");
} else {
  console.log("Could not find head block for PatientDashboard");
}
