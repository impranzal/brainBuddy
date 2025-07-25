// Central API service for BrainBuddy frontend
// Handles all backend HTTP requests and JWT token management

const API_BASE = 'http://localhost:8000/api'; // Change this to your backend IP if different

// Helper to get JWT token from localStorage
function getToken() {
  return localStorage.getItem('brainbuddy_token');
}

// Helper for fetch with auth
async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || res.statusText);
  }
  return res.json();
}

// --- Auth ---
export async function login({ login, password }) {
  return apiFetch('/user/login', {
    method: 'POST',
    body: JSON.stringify({ login, password }),
  });
}

export async function signup({ username, name, email, password }) {
  // Only include username if provided
  const payload = { name, email, password };
  if (username) payload.username = username;
  return apiFetch('/user/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function logout() {
  return apiFetch('/user/logout', { method: 'POST' });
}

// --- User Profile ---
export async function getProfile() {
  return apiFetch('/user/profile');
}

export async function updateProfile(data) {
  return apiFetch('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// --- Dashboard, Gamification, Streak, XP ---
export async function getDashboard() {
  return apiFetch('/user/dashboard');
}
export async function getGamifyStats() {
  return apiFetch('/user/gamify');
}
export async function getStreak() {
  return apiFetch('/user/streak');
}
export async function getXP() {
  return apiFetch('/user/xp');
}

// --- Update XP, Level, Streak ---
export async function updateXP(data) {
  return apiFetch('/user/xp', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function updateStreak(data) {
  return apiFetch('/user/streak', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// --- AI Tutor & Student Mode ---
export async function aiTutor({ topic, mode }) {
  return apiFetch('/user/ai-tutor', {
    method: 'POST',
    body: JSON.stringify({ topic, mode }),
  });
}
export async function aiStudentMode({ topic, explanation }) {
  return apiFetch('/user/ai-student-mode', {
    method: 'POST',
    body: JSON.stringify({ topic, explanation }),
  });
}

// --- AI Tutor Flashcards ---
export async function getFlashcardsByTopic(topic) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/user/ai-tutor/flashcards?topic=${encodeURIComponent(topic)}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error('Failed to fetch flashcards');
  return res.json();
}

// --- Resources ---
export async function getResources() {
  return apiFetch('/user/resources');
}
export async function getResourceById(id) {
  return apiFetch(`/user/resource/${id}`);
}
export async function markResourceCompleted(resourceId) {
  return apiFetch(`/user/mark-completed/${resourceId}`, { method: 'POST' });
}

export async function getCompletedResources() {
  return apiFetch('/user/completed-resources');
}

// --- Honour Board ---
export async function getHonourBoard() {
  return apiFetch('/user/honour-board');
}

// --- Habit Stats ---
export async function getHabitStats() {
  return apiFetch('/user/habit');
}

// --- Quiz Progress ---
export async function getQuizProgress() {
  return apiFetch('/user/quiz-progress');
}
export async function updateQuizProgress(quizData) {
  return apiFetch('/user/quiz-progress', {
    method: 'PUT',
    body: JSON.stringify({ quizData }),
  });
}

// --- Pet State ---
export async function getPetState() {
  return apiFetch('/user/pet-state');
}
export async function updatePetState(petData) {
  return apiFetch('/user/pet-state', {
    method: 'PUT',
    body: JSON.stringify(petData),
  });
}

// --- Achievements ---
export async function getAchievements() {
  return apiFetch('/user/achievements');
}
export async function updateAchievements(achievements) {
  return apiFetch('/user/achievements', {
    method: 'PUT',
    body: JSON.stringify({ achievements }),
  });
}
// --- Badges ---
export async function getBadges() {
  return apiFetch('/user/badges');
}
export async function updateBadges(badges) {
  return apiFetch('/user/badges', {
    method: 'PUT',
    body: JSON.stringify({ badges }),
  });
}

// --- Admin Endpoints (examples) ---
export async function getAllUsers() {
  return apiFetch('/admin/users');
}
export async function getAdminProfile() {
  return apiFetch('/admin/profile');
}
export async function getAdminHonourBoard(search = '') {
  const token = getToken();
  const url = search
    ? `${API_BASE}/admin/honour-board?search=${encodeURIComponent(search)}`
    : `${API_BASE}/admin/honour-board`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error('Failed to fetch admin honour board');
  return res.json();
}
export async function getAllAdminResources() {
  return apiFetch('/admin/resources');
}
export async function uploadResource(data) {
  // data: { title, type, semester, subject, url }
  return apiFetch('/admin/resources', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
export async function deleteResource(id) {
  return apiFetch(`/admin/resources/${id}`, { method: 'DELETE' });
}
export async function getUserProgressReport(userId) {
  return apiFetch(`/admin/progress/${userId}`);
}

// --- Admin Resource Upload (multipart/form-data) ---
export async function uploadAdminResource({ file, title, type, semester, subject }) {
  const token = getToken();
  const formData = new FormData();
  if (file) formData.append('file', file);
  if (title) formData.append('title', title);
  if (type) formData.append('type', type);
  if (semester) formData.append('semester', semester);
  if (subject) formData.append('subject', subject);
  const res = await fetch(`${API_BASE}/admin/resources`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload resource');
  return res.json();
}

// --- Admin Logout ---
export async function adminLogout() {
  const token = getToken();
  const res = await fetch(`${API_BASE}/admin/logout`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error('Failed to logout admin');
  return res.json();
}

// --- User Profile Picture Upload (multipart/form-data) ---
export async function uploadUserProfilePicture(file) {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/user/profile-picture`, {
    method: 'PUT',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload profile picture');
  return res.json();
}

// --- User Profile Update (multipart/form-data) ---
export async function updateUserProfile({ username, email, oldPassword, newPassword, profilePicture }) {
  const token = getToken();
  const formData = new FormData();
  if (username) formData.append('username', username);
  if (email) formData.append('email', email);
  if (oldPassword) formData.append('oldPassword', oldPassword);
  if (newPassword) formData.append('newPassword', newPassword);
  if (profilePicture) formData.append('profilePicture', profilePicture);
  const res = await fetch(`${API_BASE}/user/profile`, {
    method: 'PUT',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}

// --- Admin Profile Picture Upload (multipart/form-data) ---
export async function uploadAdminProfilePicture(file) {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/admin/profile-picture`, {
    method: 'PUT',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload admin profile picture');
  return res.json();
}

// --- Admin Registration (temporary) ---
export async function registerAdmin({ name, email, password }) {
  const res = await fetch(`${API_BASE}/admin/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error('Failed to register admin');
  return res.json();
}

// --- Admin Login ---
export async function adminLogin({ email, password }) {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Failed to login as admin');
  return res.json();
}

// --- Admin Notice Upload ---
export async function uploadNotice({ title, description, category, priority, file }) {
  const token = getToken();
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('category', category || 'general');
  formData.append('priority', priority || 'medium');
  if (file) {
    formData.append('file', file);
  }
  
  const res = await fetch(`${API_BASE}/admin/upload-notice`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload notice');
  return res.json();
}

// --- Admin Notice Delete ---
export async function deleteNotice(id) {
  return apiFetch(`/admin/notices/${id}`, { method: 'DELETE' });
}

// --- Notices ---
export async function getNotices() {
  return apiFetch('/user/notices');
}

export async function getAllNotices() {
  return apiFetch('/user/notices');
}

export async function getAdminNotices() {
  return apiFetch('/admin/notices');
}

export async function getNoticeById(id) {
  return apiFetch(`/user/notices/${id}`);
}

// --- Admin Profile Update (if supported, similar to user) ---
// Add if your backend supports admin profile update with multipart/form-data 