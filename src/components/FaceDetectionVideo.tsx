
import { useState, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const FaceDetectionVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [detectionEnabled, setDetectionEnabled] = useState(true);
  const [modelLoading, setModelLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noFaceDetected, setNoFaceDetected] = useState(false);
  const faceDetectionInterval = useRef<number | null>(null);
  
  // Face detection counter to reduce flickering of warnings
  const noFaceCounter = useRef(0);
  const NO_FACE_THRESHOLD = 10; // Show warning after this many consecutive frames without a face

  useEffect(() => {
    // Load models from CDN instead of local files
    const loadModels = async () => {
      try {
        setModelLoading(true);
        
        // Use CDN URLs for the models
        const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
        
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]);
        
        setModelLoading(false);
        startVideo();
      } catch (err) {
        console.error('Error loading face detection models:', err);
        setModelLoading(false);
        setError('Failed to load face detection models. Please reload the page and try again.');
      }
    };

    loadModels();
    
    // Cleanup function
    return () => {
      if (faceDetectionInterval.current) {
        clearTimeout(faceDetectionInterval.current);
      }
      
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user' 
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please make sure you have granted camera permission.');
    }
  };

  const handleVideoPlay = () => {
    setIsVideoLoaded(true);
    
    if (!canvasRef.current || !videoRef.current) return;
    
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    
    detectFaces();
  };

  const detectFaces = async () => {
    if (!detectionEnabled || !videoRef.current || !canvasRef.current) return;
    
    const options = new faceapi.TinyFaceDetectorOptions({ 
      inputSize: 224, 
      scoreThreshold: 0.5 
    });
    
    try {
      const detections = await faceapi.detectAllFaces(
        videoRef.current, 
        options
      ).withFaceLandmarks();
      
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      
      // Check if a face is detected
      if (detections.length === 0) {
        noFaceCounter.current += 1;
        if (noFaceCounter.current >= NO_FACE_THRESHOLD) {
          setNoFaceDetected(true);
        }
      } else {
        noFaceCounter.current = 0;
        setNoFaceDetected(false);
        faceapi.draw.drawDetections(canvasRef.current, detections);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, detections);
      }
      
      // Continue detecting faces
      if (detectionEnabled) {
        faceDetectionInterval.current = window.setTimeout(() => detectFaces(), 100);
      }
    } catch (err) {
      console.error('Face detection error:', err);
    }
  };

  const toggleDetection = () => {
    if (!detectionEnabled) {
      setDetectionEnabled(true);
      detectFaces();
    } else {
      setDetectionEnabled(false);
      if (faceDetectionInterval.current) {
        clearTimeout(faceDetectionInterval.current);
      }
    }
  };

  return (
    <div className="face-detection-container relative mx-auto max-w-2xl">
      {noFaceDetected && (
        <Alert variant="destructive" className="mb-4 animate-pulse">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No face detected! Please make sure your face is visible in the camera.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="relative bg-gradient-to-r from-indigo-100/80 to-purple-100/80 p-1 rounded-2xl shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-md"></div>
        
        <div className="relative rounded-xl overflow-hidden">
          <video 
            ref={videoRef}
            autoPlay 
            muted
            playsInline
            onPlay={handleVideoPlay}
            className="w-full h-full object-cover rounded-xl"
          />
          
          <canvas 
            ref={canvasRef} 
            className="absolute top-0 left-0 w-full h-full"
          />
          
          {(modelLoading || !isVideoLoaded) && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
              <div className="text-center">
                <div className="animate-spin mb-2 mx-auto w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
                <p>{modelLoading ? 'Loading face detection models...' : 'Initializing camera...'}</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white p-4">
              <div className="text-center max-w-md">
                <p className="text-red-300 mb-2">⚠️ {error}</p>
                <button 
                  onClick={startVideo}
                  className="px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
          
          <button
            onClick={toggleDetection}
            className="absolute bottom-4 right-4 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition-colors"
          >
            {detectionEnabled ? 'Pause Detection' : 'Resume Detection'}
          </button>
        </div>
      </div>
      
      <p className="text-center text-gray-600 mt-2 text-sm">
        The system tracks your face during the interview process to ensure engagement
      </p>
    </div>
  );
};

export default FaceDetectionVideo;
