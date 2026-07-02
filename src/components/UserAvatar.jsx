import React from 'react';

const UserAvatar = ({ user, className = "w-10 h-10 rounded-full", altText = "User Avatar" }) => {
  if (!user) return null;

  // Determine if it's a Google Auth user
  const isGoogleSignIn = user?.providerData?.some(p => p.providerId === 'google.com') || false;

  let avatarSrc = null;

  if (isGoogleSignIn) {
    // 1. Google User: always use photoURL
    avatarSrc = user.photoURL || user.avatar || user.image;
  } else {
    // 2. Email/Password User: uploaded profile image -> fallback
    avatarSrc = user.profileImage || user.photoURL || user.avatar || user.image;
    
    // Ignore ui-avatars or unsplash placeholders if they were saved in the DB previously
    if (avatarSrc && (avatarSrc.includes('ui-avatars.com') || avatarSrc.includes('unsplash.com'))) {
      avatarSrc = null;
    }
  }

  // 3. Fallback: First letter avatar
  if (!avatarSrc) {
    const name = user.firstName || user.name || user.displayName || user.email || "?";
    avatarSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0b6e66&color=fff&bold=true`;
  }

  return (
    <img 
      src={avatarSrc} 
      alt={user.name || altText} 
      className={`object-cover shadow-sm ${className}`}
      onError={(e) => {
        // Fallback on image load error
        const name = user.firstName || user.name || user.displayName || user.email || "?";
        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0b6e66&color=fff&bold=true`;
      }}
    />
  );
};

export default UserAvatar;
