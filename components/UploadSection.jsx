
import React, { useRef, useState } from 'react';
import { Camera, Loader2, RefreshCw, UploadCloud, Scan } from 'lucide-react';

/**
 * @param {Object} props
 * @param {(base64: string) => Promise<void>} props.onImageSelected
 * @param {boolean} props.isProcessing
 */
const UploadSection = ({ onImageSelected, isProcessing }) => {
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const processFile = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result;
            if (typeof base64 === 'string') {
                const base64Data = base64.split(',')[1];
                setPreview(base64);
                onImageSelected(base64Data);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            processFile(file);
        }
    };

    return (
        <div
            className={`relative overflow-hidden rounded-[32px] transition-all duration-300 group max-w-2xl mx-auto
        ${!preview
                    ? 'bg-gradient-to-br from-teal-500 to-emerald-600 shadow-xl shadow-teal-500/20'
                    : 'bg-white shadow-lg border border-slate-100'
                }
      `}
        >
            {!preview ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
            relative p-10 cursor-pointer text-center min-h-[320px] flex flex-col items-center justify-center
            ${isDragging ? 'scale-[0.99] opacity-90' : 'scale-100'}
          `}
                >
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-900 opacity-10 blur-3xl rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner border border-white/20 group-hover:scale-110 transition-transform duration-500">
                            <div className="relative">
                                <div className="absolute inset-0 bg-white rounded-full opacity-20 animate-ping"></div>
                                <Camera className="w-10 h-10 text-white relative z-10" />
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Add Prescription</h2>
                        <p className="text-teal-100 text-lg max-w-2xl mx-auto mb-8 font-medium">
                            Tap to take a photo or drag & drop to analyze instantly.
                        </p>

                        <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-colors">
                            <UploadCloud className="w-5 h-5" />
                            <span>Upload Image</span>
                        </div>
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
            ) : (
                <div className="relative w-full h-80 group">
                    <img src={preview} alt="Prescription" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

                    {isProcessing ? (
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md flex flex-col items-center justify-center text-white z-20">
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-teal-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                                <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 shadow-2xl relative z-10">
                                    <Loader2 className="w-10 h-10 text-teal-400 animate-spin" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold mb-2 tracking-tight">Analyzing...</p>
                            <p className="text-slate-300 font-medium bg-slate-800/50 px-4 py-1.5 rounded-full backdrop-blur-sm">
                                Extracting meds & vitals
                            </p>
                        </div>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex flex-col justify-end p-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-teal-500 rounded-full p-1.5 shadow-lg shadow-teal-500/30">
                                        <Scan className="w-4 h-4 text-white" />
                                    </div>
                                    <p className="text-white font-bold text-lg text-shadow-sm">Scan Complete</p>
                                </div>
                                <button
                                    onClick={() => { setPreview(null); }}
                                    className="bg-white/20 hover:bg-white/30 backdrop-blur-xl text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all border border-white/20 shadow-lg"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Retake
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UploadSection;
