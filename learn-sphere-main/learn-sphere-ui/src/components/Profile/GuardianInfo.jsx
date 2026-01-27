import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const GuardianInfo = () => {
  const [formData, setFormData] = useState({
    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
    guardianAddress: "",
  });

  useEffect(() => {
    const savedData = localStorage.getItem("guardian_draft");
    if (savedData) setFormData(JSON.parse(savedData));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem("guardian_draft", JSON.stringify(formData));
    toast.info("Draft saved to local storage");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.guardianName || !formData.guardianPhone) {
      toast.error("Please fill in Name and Phone before submitting.");
      return;
    }

    localStorage.setItem("guardian_submitted_data", JSON.stringify(formData));
    toast.success("Saved successfully!");
    console.log("Final Data Submitted:", formData);
  };

  const fieldClass =
    "w-full rounded-md px-3 py-2 mb-3 bg-[var(--card)] border border-[var(--border)] text-[var(--text)]";

  return (
    <section className="mb-8 max-w-3xl">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text)]">
              Guardian Information
            </h3>
            <p className="text-sm text-[var(--text)]/80">
              Save a draft or submit final details
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            name="guardianName"
            type="text"
            placeholder="Guardian Name"
            value={formData.guardianName}
            onChange={handleChange}
            className={fieldClass}
          />

          <input
            name="guardianPhone"
            type="text"
            placeholder="Guardian Phone"
            value={formData.guardianPhone}
            onChange={handleChange}
            className={fieldClass}
          />

          <input
            name="guardianEmail"
            type="email"
            placeholder="Guardian Email"
            value={formData.guardianEmail}
            onChange={handleChange}
            className={fieldClass}
          />

          <textarea
            name="guardianAddress"
            placeholder="Guardian Address"
            value={formData.guardianAddress}
            onChange={handleChange}
            className={fieldClass + " h-20 resize-none"}
          />

          <div className="flex gap-3 mt-3">
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 rounded-md px-4 py-2 font-semibold bg-[var(--card)] border border-[var(--border)] text-[var(--text)] hover:brightness-110"
            >
              Save Draft
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md px-4 py-2 font-semibold text-white bg-gradient-to-tr from-indigo-600 to-blue-500 hover:shadow-lg"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
