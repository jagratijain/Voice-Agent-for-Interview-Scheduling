const CandidateCard = ({ candidate }) => {
    return (
      <div className="border p-4 rounded-lg shadow-sm bg-white">
        <h3 className="text-lg font-semibold">{candidate.name}</h3>
        <p> Phone: {candidate.phone}</p>
        <p> Current CTC: {candidate.current_ctc}</p>
        <p> Expected CTC: {candidate.expected_ctc}</p>
        <p> Notice Period: {candidate.notice_period}</p>
        <p> Experience: {candidate.experience}</p>
      </div>
    );
  };
  
  export default CandidateCard;
  