export function getCompanyAvatar(name) {
  const seed = encodeURIComponent(name);

  return `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}`;
}
