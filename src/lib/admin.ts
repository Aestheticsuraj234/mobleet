type AdminCapableUser = {
  email?: string | null;
  isAdmin?: boolean | null;
  role?: string | null;
};

export function isAdminUser(user: AdminCapableUser | null | undefined) {
  if (!user) return false;

  const adminEmails =
    process.env.EXPO_PUBLIC_ADMIN_EMAILS?.split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean) ?? [];

  return (
    user.isAdmin === true ||
    user.role === 'admin' ||
    (user.email ? adminEmails.includes(user.email.toLowerCase()) : false)
  );
}
