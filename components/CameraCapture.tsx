
import React, { useRef, useState, useCallback, useEffect } from 'react';

interface CameraCaptureProps {
  onCapture: (base64: string) => void;
  onClear: () => void;
  currentImage?: string;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClear, currentImage }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Sync stream to video element whenever the element or stream becomes available
  useEffect(() => {
    if (isCameraActive && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraActive, stream]);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1024 }, height: { ideal: 1024 } } 
      });
      setStream(s);
      setIsCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions and ensure you are on HTTPS.");
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  }, [stream]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onCapture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Use actual video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Handle mirroring in the capture
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const data = canvas.toDataURL('image/jpeg', 0.85);
        onCapture(data);
        stopCamera();
      }
    }
  };

  if (currentImage) {
    return (
      <div className="relative group rounded-2xl overflow-hidden aspect-square w-full bg-black border border-white/10 shadow-2xl">
        <img src={currentImage} alt="Captured" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
           <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Target Locked</span>
        </div>
        <button 
          onClick={onClear}
          className="absolute top-3 right-3 p-2 bg-red-600 rounded-full text-white shadow-lg hover:bg-red-500 transition-all hover:rotate-90 z-10"
          title="Remove Image"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {!isCameraActive ? (
        <div className="grid grid-cols-2 gap-4 aspect-square">
          <button 
            onClick={startCamera}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 hover:border-orange-500/50 hover:bg-white/5 transition-all text-gray-600 hover:text-orange-500 group"
          >
            <svg className="w-10 h-10 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-bold text-[10px] uppercase tracking-widest px-2 text-center">Use Camera</span>
          </button>

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 hover:border-blue-500/50 hover:bg-white/5 transition-all text-gray-600 hover:text-blue-500 group"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileUpload}
            />
            <svg className="w-10 h-10 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span className="font-bold text-[10px] uppercase tracking-widest px-2 text-center">Upload File</span>
          </button>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden aspect-square w-full bg-black border border-orange-500/50 shadow-[0_0_25px_rgba(249,115,22,0.2)]">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="w-full h-full object-cover mirror" 
          />
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 px-4">
            <button 
              onClick={stopCamera}
              className="px-4 py-2 bg-black/80 rounded-xl text-[10px] font-bold uppercase border border-white/10 hover:bg-black transition-colors"
            >
              Abort
            </button>
            <button 
              onClick={capture}
              className="flex-1 py-3 bg-orange-600 rounded-xl text-white font-bangers tracking-widest text-lg hover:bg-orange-500 transition-all shadow-xl active:scale-95"
            >
              ENGAGE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
