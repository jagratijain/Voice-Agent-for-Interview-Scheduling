const JobCard = ({ job }) => {
    return (
      <div className="border p-4 rounded-lg shadow-sm bg-white">
        <h3 className="text-lg font-semibold">{job.title}</h3>
        <p>Company: {job.company}</p>
        <p> Location: {job.location}</p>
        <p> Description: {job.description}</p>
        <p> Type: {job.job_type}</p>
      </div>
    );
  };
  
  export default JobCard;  