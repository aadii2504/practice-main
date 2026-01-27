

const CourseHeader = ({ title, instructor, duration, level }) => {
  const headerStyle = {
    borderBottom: '2px solid #4f46e5',
    paddingBottom: '1rem',
    marginBottom: '1.5rem'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333'
  };

  const metaStyle = {
    color: '#555',
    marginTop: '0.5rem'
  };

  return (
    <div style={headerStyle}>
      <h1 style={titleStyle}>{title || "Course Title"}</h1>

      {/* Instructor, Duration, Level */}
      <p style={metaStyle}>
        <strong>Instructor:</strong> {instructor || "John Doe"} <br />
        <strong>Duration:</strong> {duration || "6 weeks"} <br />
        <strong>Level:</strong> {level || "Beginner"}
      </p>
    </div>
  );
};

export default CourseHeader;
