
async function run() {
  try {
    const login = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'viswa@example.com', password: 'password123' })
    });
    const { token } = await login.json();
    console.log('Token:', token);

    const del = await fetch('http://localhost:3000/api/assets/1', {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const status = del.status;
    const body = await del.json().catch(() => null);
    console.log('Status:', status, 'Body:', body);
  } catch (err) {
    console.error(err);
  }
}

run();
