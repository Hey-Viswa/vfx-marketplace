import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import fetch from 'node-fetch'; // assuming node-fetch is installed, or node 18+ has built-in fetch

async function runTest() {
  const baseUrl = 'http://localhost:8000/api';
  console.log('1. Registering test user...');
  const user = { email: 'deletetester@vfx.com', password: 'password123' };
  
  // Try register first
  await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });

  console.log('2. Logging in to get token...');
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  const loginData = await loginRes.json();
  const token = loginData.token;
  
  if (!token) {
    console.error('Failed to get token:', loginData);
    return;
  }
  console.log('Token acquired!');

  console.log('3. Creating a dummy asset...');
  const dummyFilePath = path.join(process.cwd(), 'dummy.txt');
  fs.writeFileSync(dummyFilePath, 'dummy asset content');

  const formData = new FormData();
  formData.append('title', 'Test Asset to Delete');
  formData.append('price', '9.99');
  formData.append('file', fs.createReadStream(dummyFilePath));

  const createRes = await fetch(`${baseUrl}/assets`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  const assetData = await createRes.json();
  
  if (!assetData.id) {
    console.error('Failed to create asset:', assetData);
    return;
  }
  console.log(`Asset created! ID: ${assetData.id}`);

  console.log(`4. Attempting to soft delete Asset ${assetData.id}...`);
  const deleteRes = await fetch(`${baseUrl}/assets/${assetData.id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  console.log('DELETE Status Code:', deleteRes.status);
  
  try {
    const deleteData = await deleteRes.json();
    console.log('DELETE Response Body:', deleteData);
  } catch(e) {
    console.log('No JSON body returned or error parsing.');
  }

  // Verify in DB
  console.log('5. Verifying database state...');
  const verifyRes = await fetch(`${baseUrl}/assets`);
  const allAssets = await verifyRes.json();
  const found = allAssets.find(a => a.id === assetData.id);
  console.log('Is asset still returned in GET /assets? (Should we filter isActive:true ?)');
  console.log('Asset state in response:', found);
}

runTest().catch(console.error);
