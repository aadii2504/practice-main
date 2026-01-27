


import React from "react";
import { useParams } from "react-router-dom";

const NotEnrolledPage = () => {
  const { courseId, moduleId } = useParams();
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Course {courseId}</h2>
      <p className="text-lg">You cannot access Module {moduleId} because you are not enrolled.</p>
    </div>
  );
};

export default NotEnrolledPage;
