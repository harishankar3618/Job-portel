import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/jobs')
      .then(res => setJobs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="App">
      <h1>Job Listings</h1>
      <ul>
        {jobs.map(job => (
          <li key={job._id}>
            <h3>{job.title} @ {job.company}</h3>
            <p>{job.description}</p>
            <small>{job.location} | {job.salary}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
