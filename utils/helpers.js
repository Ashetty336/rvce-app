export function calculateAttendancePercentage(attended, total) {
  if (!total) return 0;
  return Math.round((attended / total) * 100);
}

export function getCurrentDaySchedule(schedule) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  return schedule[today] || [];
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
} 