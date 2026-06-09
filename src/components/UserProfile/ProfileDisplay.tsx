import { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';

export default function ProfileDisplay() {
  const profiles = useAppSelector((state) => state.userProfile.profiles);
  const [newIndex, setNewIndex] = useState<number | null>(null);

  useEffect(() => {
    if (profiles.length === 0) return;
    const idx = profiles.length - 1;
    const tShow = setTimeout(() => setNewIndex(idx), 0);
    const tHide = setTimeout(() => setNewIndex(null), 3000);
    return () => {
      clearTimeout(tShow);
      clearTimeout(tHide);
    };
  }, [profiles.length]);

  if (profiles.length === 0) return null;

  return (
    <div>
      {profiles.map((profile, i) => (
        <div
          key={i}
          style={{
            border:
              newIndex === i ? '2px solid #4caf50' : '2px solid transparent',
            background: newIndex === i ? '#f0fff4' : 'transparent',
            transition: 'border 0.4s, background 0.4s',
            padding: '8px',
            marginBottom: '8px',
          }}
        >
          <img
            src={profile.profilePicture}
            alt={`${profile.username}'s profile`}
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
          <p>{profile.username}</p>
          <p>{profile.country}</p>
        </div>
      ))}
    </div>
  );
}
