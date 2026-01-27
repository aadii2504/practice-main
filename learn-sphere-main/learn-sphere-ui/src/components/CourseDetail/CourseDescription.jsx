
const CourseDescription = ({ description, objectives }) => {
  const sectionStyle = {
    marginBottom: '2rem',
    lineHeight: '1.6',
    color: '#444'
  };

  const headingStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.75rem',
    color: '#4f46e5'
  };

  const listStyle = {
    paddingLeft: '1.5rem',
    marginTop: '0.5rem'
  };

  return (
    <div style={sectionStyle}>
      {/* Course Overview */}
      <h2 style={headingStyle}>Course Overview</h2>
      <p>{description || "This course provides a comprehensive introduction to the subject."}</p>

      {/* Learning Objectives */}
      <h2 style={headingStyle}>Learning Objectives</h2>
      <ul style={listStyle}>
        {(objectives && objectives.length > 0) ? (
          objectives.map((obj, index) => <li key={index}>{obj}</li>)
        ) : (
          <>
            <li>Understand the fundamentals of the topic</li>
            <li>Apply concepts through practical exercises</li>
            <li>Prepare for advanced learning or certification</li>
          </>

          
        )}
      </ul>
    </div>
  );
};

export default CourseDescription;
