export const getRoleColors = (role) => {
  switch (role?.toLowerCase()) {
    case 'doctor':
      return {
        badgeBg: 'bg-blue-50',
        badgeText: 'text-blue-700',
        ringHover: 'hover:border-blue-400',
        ringBorder: 'border-blue-200',
        text: 'text-blue-600'
      };
    case 'admin':
      return {
        badgeBg: 'bg-red-50',
        badgeText: 'text-red-700',
        ringHover: 'hover:border-red-400',
        ringBorder: 'border-red-200',
        text: 'text-red-600'
      };
    case 'patient':
    default:
      return {
        badgeBg: 'bg-[#e6f4f1]',
        badgeText: 'text-[#0b6e66]',
        ringHover: 'hover:border-primary/50',
        ringBorder: 'border-primary/20',
        text: 'text-primary'
      };
  }
};
