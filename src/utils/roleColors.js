export const getRoleColors = (role) => {
  switch (role?.toLowerCase()) {
    case 'doctor':
      return {
        badgeBg: 'bg-blue-300',
        badgeText: 'text-blue-800',
        ringHover: 'hover:border-blue-400',
        ringBorder: 'border-blue-200',
        text: 'text-blue-600',
        borderTrail: 'bg-[conic-gradient(from_0deg,transparent_80%,transparent_95%,#3b82f6_100%)]',
        menuHover: 'hover:bg-blue-50 hover:text-blue-600'
      };
    case 'admin':
      return {
        badgeBg: 'bg-red-300',
        badgeText: 'text-red-800',
        ringHover: 'hover:border-red-400',
        ringBorder: 'border-red-200',
        text: 'text-red-600',
        borderTrail: 'bg-[conic-gradient(from_0deg,transparent_80%,transparent_95%,#ef4444_100%)]',
        menuHover: 'hover:bg-red-50 hover:text-red-600'
      };
    case 'patient':
    default:
      return {
        badgeBg: 'bg-[#0B8F87]/25',
        badgeText: 'text-[#0B8F87]',
        ringHover: 'hover:border-[#0B8F87]/50',
        ringBorder: 'border-[#0B8F87]/20',
        text: 'text-[#0B8F87]',
        borderTrail: 'bg-[conic-gradient(from_0deg,transparent_80%,transparent_95%,#0B8F87_100%)]',
        menuHover: 'hover:bg-[#0B8F87]/10 hover:text-[#0B8F87]'
      };
  }
};
