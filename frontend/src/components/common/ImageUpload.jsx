"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadToImgbb } from "@/lib/imgbb";
import { UploadCloud, Loader2, X, Image as ImageIcon } from "lucide-react";

const ImageUpload = ({ value, onChange, label = "Thumbnail Image" }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        //upload up to 5MB image
        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("Image size must be under 5MB.");
            return;
        }

        setError("");
        setUploading(true);

        try {
            const result = await uploadToImgbb(file);
            onChange(result.url);
        } catch (err) {
            console.error("ImgBB Upload failed:", err);
            setError(err.message || "Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {label}
            </label>

            {value ? (
                <div className="relative aspect-video max-w-sm rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 group">
                    <Image src={value} alt="Uploaded preview" fill className="object-cover" />
                    <button
                        type="button"
                        onClick={() => onChange("")}
                        className="absolute top-2 right-2 p-1.5 rounded-xl bg-slate-900/80 hover:bg-red-600 text-white transition"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-400 bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-6 cursor-pointer transition">
                    <div className="flex flex-col items-center justify-center text-center">
                        {uploading ? (
                            <Loader2 className="w-8 h-8 animate-spin text-teal-600 dark:text-teal-400 mb-2" />
                        ) : (
                            <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                        )}

                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {uploading ? "Uploading to ImgBB..." : "Click to select or drag & drop"}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WEBP up to 5MB</p>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        disabled={uploading}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>
            )}

            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        </div>
    );
}

export default ImageUpload;