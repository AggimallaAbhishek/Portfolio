import { UploadCloud } from "lucide-react";
import { useState, type ChangeEvent } from "react";

import { api } from "../../api/client";

export function ImageUploader({
  token,
  onUploaded,
  label = "Upload image"
}: {
  token: string;
  onUploaded: (fileUrl: string) => void;
  label?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.uploadImage(token, file);
      onUploaded(response.file_url);
      event.target.value = "";
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-700 hover:border-cyan hover:text-cyan dark:text-slate-200">
        <UploadCloud size={16} />
        {loading ? "Uploading..." : label}
        <input type="file" accept="image/*" onChange={handleChange} className="hidden" />
      </label>
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}
    </div>
  );
}
