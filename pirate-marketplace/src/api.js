const rawApiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
const apiBaseUrl = rawApiBaseUrl.replace(/\/$/, '');

export async function loginUser(credentials) {
  const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  let payload = {};

  try {
    payload = await response.json();
  } catch (error) {
    payload = {};
  }

  if (!response.ok) {
    throw new Error(payload.detail || payload.message || 'Unable to log in.');
  }

  return payload;
}
