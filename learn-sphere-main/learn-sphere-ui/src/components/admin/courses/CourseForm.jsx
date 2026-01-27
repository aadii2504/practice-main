// components/admin/courses/CourseForm.jsx
import React from "react";
import SearchableSelect from "./SearchableSelect";
import { normalizeSlug } from "./slug";

const MarkdownToolbar = ({ insertMarkdown }) => (
  <div className="flex gap-1 mb-2 p-2 rounded-md bg-black/20 border border-white/15 flex-wrap">
    <button
      type="button"
      onClick={() => insertMarkdown("**", "**")}
      title="Bold"
      className="px-2 py-1 rounded text-sm bg-white/10 hover:bg-white/20 font-bold"
    >
      B
    </button>
    <button
      type="button"
      onClick={() => insertMarkdown("*", "*")}
      title="Italic"
      className="px-2 py-1 rounded text-sm bg-white/10 hover:bg-white/20 italic"
    >
      I
    </button>
    <button
      type="button"
      onClick={() => insertMarkdown("~~", "~~")}
      title="Strikethrough"
      className="px-2 py-1 rounded text-sm bg-white/10 hover:bg-white/20 line-through"
    >
      S
    </button>
    <button
      type="button"
      onClick={() => insertMarkdown("# ")}
      title="Heading"
      className="px-2 py-1 rounded text-sm bg-white/10 hover:bg-white/20"
    >
      H1
    </button>
    <button
      type="button"
      onClick={() => insertMarkdown("## ")}
      title="Subheading"
      className="px-2 py-1 rounded text-sm bg-white/10 hover:bg-white/20"
    >
      H2
    </button>
    <button
      type="button"
      onClick={() => insertMarkdown("- ")}
      title="List"
      className="px-2 py-1 rounded text-sm bg-white/10 hover:bg-white/20"
    >
      • List
    </button>
    <button
      type="button"
      onClick={() => insertMarkdown("`", "`")}
      title="Code"
      className="px-2 py-1 rounded text-sm bg-white/10 hover:bg-white/20 font-mono text-xs"
    >
      &lt;Code&gt;
    </button>
    <button
      type="button"
      onClick={() => insertMarkdown("Link")}
      title="Link"
      className="px-2 py-1 rounded text-sm bg-white/10 hover:bg-white/20"
    >
      Link
    </button>
  </div>
);

export default function CourseForm({
  form,
  setForm,
  errors,
  editing,
  onSave,
  onCancel,
  categoryOptions,
  canSave,
  titleRef,
}) {
  const descRef = React.useRef(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "students" || name === "price") {
      setForm((p) => ({ ...p, [name]: Number(value) }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const insertMarkdown = (before, after = "") => {
    const textarea = descRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = form.description.substring(start, end);
    const newText =
      form.description.substring(0, start) +
      before +
      selected +
      after +
      form.description.substring(end);

    setForm((p) => ({ ...p, description: newText }));

    // Reset cursor position after state update
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + before.length;
      textarea.focus();
    }, 0);
  };

  return (
    <div className="mb-6 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
      <h2 className="text-lg font-semibold mb-4">
        {editing === "new" ? "New Course" : "Edit Course"}
      </h2>
      <div className="space-y-3 max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Title</label>
          <input
            ref={titleRef}
            name="title"
            value={form.title}
            onChange={onChange}
            className="w-full rounded-md px-3 py-2 bg-black/20 border border-white/15"
            placeholder="Course title"
          />
          {errors.title && (
            <small className="text-red-400 text-sm">{errors.title}</small>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">Slug</label>
          <div className="flex gap-2">
            <input
              name="slug"
              value={form.slug}
              onChange={onChange}
              className="flex-1 rounded-md px-3 py-2 bg-black/20 border border-white/15"
              placeholder="course-slug"
            />
            <button
              type="button"
              onClick={() => {
                if (form.title.trim()) {
                  setForm((p) => ({
                    ...p,
                    slug: normalizeSlug(form.title),
                  }));
                }
              }}
              className="px-3 py-2 rounded-md bg-blue-600/30 border border-blue-500/50 text-sm hover:bg-blue-600/50"
            >
              Generate
            </button>
          </div>
          {errors.slug && (
            <small className="text-red-400 text-sm">{errors.slug}</small>
          )}
          {form.slug && (
            <small className="block mt-1 text-[var(--text)]/60">
              Preview URL: /courses/{normalizeSlug(form.slug || form.title)}
            </small>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">Duration (e.g., 4 weeks)</label>
          <input
            name="duration"
            value={form.duration}
            onChange={onChange}
            className="w-full rounded-md px-3 py-2 bg-black/20 border border-white/15"
            placeholder="4 weeks"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Summary</label>
          <input
            name="summary"
            value={form.summary}
            onChange={onChange}
            className="w-full rounded-md px-3 py-2 bg-black/20 border border-white/15"
            placeholder="Brief one-line description"
          />
          {errors.summary && (
            <small className="text-red-400 text-sm">
              {errors.summary}
            </small>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Thumbnail Image URL</label>
          <div className="flex gap-2">
            <input
              name="thumbnail"
              value={form.thumbnail}
              onChange={onChange}
              className="flex-1 rounded-md px-3 py-2 bg-black/20 border border-white/15"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          {form.thumbnail && (
            <div className="mt-2 w-full max-w-sm rounded-md overflow-hidden border border-white/15">
              <img
                src={form.thumbnail}
                alt="Thumbnail preview"
                className="w-full h-32 object-cover"
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm mb-2">Description</label>
          <MarkdownToolbar insertMarkdown={insertMarkdown} />
          <textarea
            ref={descRef}
            name="description"
            value={form.description}
            onChange={onChange}
            className="w-full rounded-md px-3 py-2 bg-black/20 border border-white/15 h-32 font-mono text-sm"
            placeholder="Full course description (supports markdown)"
          />
          {errors.description && (
            <small className="text-yellow-300 text-sm">
              {errors.description}
            </small>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Categories</label>
          <SearchableSelect
            value={form.categories}
            onChange={(cats) => setForm((p) => ({ ...p, categories: cats }))}
            options={categoryOptions}
            placeholder="Select categories..."
          />

          {errors.categories && (
            <div className="mt-1 text-xs text-red-400">{errors.categories}</div>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">Level</label>
          <select
            name="level"
            value={form.level}
            onChange={onChange}
            className="w-full rounded-md px-3 py-2 bg-black/20 border border-white/15"
          >
            <option>beginner</option>
            <option>intermediate</option>
            <option>advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Price (0 or Free)</label>
          <div className="flex items-center gap-2">
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={onChange}
              className="flex-1 rounded-md px-3 py-2 bg-black/20 border border-white/15"
              disabled
            />
            <span className="text-sm text-[var(--text)]/70">Free</span>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={onChange}
            className="w-full rounded-md px-3 py-2 bg-black/20 border border-white/15"
          >
            <option>published</option>
            <option>draft</option>
            <option>archived</option>
          </select>
        </div>

        <div className="md:col-span-2 flex gap-2 pt-2">
          <button
            onClick={onSave}
            disabled={!canSave}
            className={`px-3 py-2 rounded-md text-white ${
              canSave ? "bg-indigo-600" : "bg-indigo-600/40 cursor-not-allowed"
            }`}
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="px-3 py-2 rounded-md border border-[var(--border)]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
