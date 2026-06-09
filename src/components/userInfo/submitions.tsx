import { useAppSelector } from '../../store/hooks';

const Submitions = () => {
  const submissions = useAppSelector((state) => state.userInfo);

  if (submissions.length === 0) return <p>No submissions yet.</p>;

  return (
    <>
      {submissions.map((entry, i) => (
        <div key={i}>
          <p>{entry.name}</p>
          <p>{entry.email}</p>
          <p>{entry.gender}</p>
          <p>{entry.age}</p>
          <p>{entry.termsAccepted ? 'Agreed' : 'Not agreed'}</p>
        </div>
      ))}
    </>
  );
};

export default Submitions;
