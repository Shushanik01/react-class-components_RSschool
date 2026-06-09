import { useAppSelector } from '../../store/hooks';

export default function ProfileDisplay() {
  const profiles = useAppSelector((state) => state.userProfile.profiles);
  if (profiles.length === 0) return null;

  return (
    <div>
      {profiles.map((profile, i) => (
        <div key={i}>
          <img
            src={profile.profilePicture}
            alt={`${profile.username}'s profile`}
            style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover' }}
          />
          <p>{profile.username}</p>
          <p>{profile.country}</p>
        </div>
      ))}
    </div>
  );
}
