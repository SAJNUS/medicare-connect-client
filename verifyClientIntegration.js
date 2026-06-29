async function verify() {
  console.log("=== Verifying Registration (POST /users) ===");
  const payload = {
    name: "Test Patient",
    email: "test.patient@example.com",
    photoURL: "https://example.com/avatar.jpg",
    role: "patient"
  };

  const res1 = await fetch('http://127.0.0.1:5001/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data1 = await res1.json();
  console.log(data1);

  console.log("\n=== Verifying User Fetching (GET /users/:email) ===");
  const res2 = await fetch('http://127.0.0.1:5001/users/test.patient@example.com');
  const data2 = await res2.json();
  console.log(data2);

  console.log("\n=== Verifying Role Update (PATCH /users/:email/role) ===");
  const res3 = await fetch('http://127.0.0.1:5001/users/test.patient@example.com/role', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'admin' })
  });
  const data3 = await res3.json();
  console.log(data3);
  
  console.log("\n=== Fetching Updated User ===");
  const res4 = await fetch('http://127.0.0.1:5001/users/test.patient@example.com');
  const data4 = await res4.json();
  console.log(data4.data.role);
}

verify();
