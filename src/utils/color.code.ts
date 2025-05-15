// Generate color from string for avatar
export function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

// Get initials from name
export function getInitials(name) {
  return name.split(' ').map(part => part[0]).join('').toUpperCase();
}