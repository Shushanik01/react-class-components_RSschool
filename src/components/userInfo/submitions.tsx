import { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';

const Submitions = () => {
  const submissions = useAppSelector((state) => state.userInfo);
  const [newIndex, setNewIndex] = useState<number | null>(null);

  useEffect(() => {
    if (submissions.length === 0) return;
    const idx = submissions.length - 1;
    const tShow = setTimeout(() => setNewIndex(idx), 0);
    const tHide = setTimeout(() => setNewIndex(null), 3000);
    return () => {
      clearTimeout(tShow);
      clearTimeout(tHide);
    };
  }, [submissions.length]);

  if (submissions.length === 0) return <p>No submissions yet.</p>;

  return (
    <>
      {submissions.map((entry, i) => (
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
          {entry.image && (
            <img
              src={entry.image as string}
              alt={entry.name}
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          )}
          <p>{entry.name}</p>
          <p>{entry.email}</p>
          <p>{entry.gender}</p>
          <p>{entry.age}</p>
          <p>{entry.country}</p>
          <p>{entry.termsAccepted ? 'Agreed' : 'Not agreed'}</p>
        </div>
      ))}
    </>
  );
};

export default Submitions;
