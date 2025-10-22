import React, { useState } from "react";

export default function ReviewEditor({ lang = "en", onSave }) {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!text.trim()) return;
    onSave?.(text);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="form-shell mt-4">
      <h3 className="text-lg font-semibold mb-2">
        {lang === "en" ? "Write your review" : "리뷰 작성"}
      </h3>
      <textarea
        className="border rounded-md p-3 w-full h-40 bg-white/10"
        placeholder={lang === "en" ? "Start writing..." : "리뷰를 작성하세요..."}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex items-center gap-3 mt-3">
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 rounded-md font-semibold bg-white/20"
        >
          {lang === "en" ? "Save" : "저장"}
        </button>
        {saved && (
          <span className="text-sm"> {lang === "en" ? "Saved!" : "저장되었습니다!"} </span>
        )}
      </div>
    </div>
  );
}
