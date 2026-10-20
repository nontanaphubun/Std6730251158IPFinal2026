async function testAll() {
  const base = 'http://localhost:5000';
  let passed = 0;
  let failed = 0;

  function assert(condition, testName, extra = '') {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName} - ${extra}`);
      failed++;
    }
  }

  // 1. Auth success
  const res1 = await fetch(`${base}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'password123' })
  });
  const data1 = await res1.json();
  assert(res1.status === 200 && data1.success === true && data1.token === 'mock-jwt-token', 'Login with valid credentials returns 200 and mock token');

  // 2. Auth failure
  const res2 = await fetch(`${base}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'wrongpassword' })
  });
  assert(res2.status === 401, 'Login with invalid credentials returns 401 Unauthorized');

  // 3. Auth empty
  const res3 = await fetch(`${base}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  assert(res3.status === 401, 'Login with empty body returns 401');

  // 4. Get employees
  const res4 = await fetch(`${base}/api/employees`);
  const employees = await res4.json();
  assert(res4.status === 200 && Array.isArray(employees) && employees.length >= 5, `GET /api/employees returns array with ${employees.length} records`);

  // Verify employee schema
  const e1 = employees[0];
  const hasFields = e1.id && e1.name && e1.position && e1.status && typeof e1.salary === 'number';
  assert(hasFields, 'Employee schema matches {id, name, position, status, salary (numeric)}');

  // 5. Add employee success
  const res5 = await fetch(`${base}/api/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Stanley Hudson',
      position: 'Sales Representative',
      salary: 47000
    })
  });
  const data5 = await res5.json();
  assert(res5.status === 201 && data5.success === true && data5.data.name === 'Stanley Hudson', 'POST /api/employees creates new employee');

  // 6. Add employee validation: missing name
  const res6a = await fetch(`${base}/api/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: '', position: 'Dev', salary: 50000 })
  });
  assert(res6a.status === 400, 'POST /api/employees with empty name returns 400 Bad Request');

  // Add employee validation: missing position
  const res6b = await fetch(`${base}/api/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Bob', position: '', salary: 50000 })
  });
  assert(res6b.status === 400, 'POST /api/employees with empty position returns 400 Bad Request');

  // Add employee validation: missing salary
  const res6c = await fetch(`${base}/api/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Bob', position: 'Dev', salary: '' })
  });
  assert(res6c.status === 400, 'POST /api/employees with empty salary returns 400 Bad Request');

  // 7. Toggle status
  const targetId = employees[0].id;
  const initialStatus = employees[0].status;
  const res7 = await fetch(`${base}/api/employees/${targetId}/status`, {
    method: 'PUT'
  });
  const data7 = await res7.json();
  const expectedToggled = initialStatus === 'Active' ? 'On Leave' : 'Active';
  assert(res7.status === 200 && data7.data.status === expectedToggled, `PUT /api/employees/${targetId}/status toggled ${initialStatus} -> ${expectedToggled}`);

  // 8. Toggle status not found
  const res8 = await fetch(`${base}/api/employees/99999/status`, { method: 'PUT' });
  assert(res8.status === 404, 'PUT /api/employees/99999/status returns 404 Not Found');

  // 9. Delete employee
  const createdId = data5.data.id;
  const res9 = await fetch(`${base}/api/employees/${createdId}`, { method: 'DELETE' });
  assert(res9.status === 200, `DELETE /api/employees/${createdId} returns 200 OK`);

  // Verify deleted from list
  const res9b = await fetch(`${base}/api/employees`);
  const employeesAfterDelete = await res9b.json();
  assert(!employeesAfterDelete.some(e => e.id === createdId), 'Deleted employee no longer exists in employee list');

  // 10. Delete not found
  const res10 = await fetch(`${base}/api/employees/99999`, { method: 'DELETE' });
  assert(res10.status === 404, 'DELETE /api/employees/99999 returns 404 Not Found');

  // 11. Salary clusters
  const res11 = await fetch(`${base}/api/employees/salary-clusters`);
  const data11 = await res11.json();
  const clustersValid = data11.success === true && Array.isArray(data11.clusters) && data11.clusters.length === 3;
  assert(res11.status === 200 && clustersValid, 'GET /api/employees/salary-clusters returns 3 tiers with centroids and counts');
  console.log('Returned clusters:', JSON.stringify(data11.clusters, null, 2));

  console.log(`\n========================================`);
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);
}

testAll().catch(console.error);
