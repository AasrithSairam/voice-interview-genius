
import { useEffect, useRef } from 'react';

interface AIAvatarProps {
  isSpeaking: boolean;
}

const AIAvatar = ({ isSpeaking }: AIAvatarProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isSpeaking) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isSpeaking]);

  return (
    <div className="relative max-w-xs mx-auto">
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/30 to-purple-500/30 blur-xl transform -translate-y-2 scale-110 animate-pulse"></div>
      
      {/* Video container */}
      <div className="relative w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl transform transition-all duration-300 hover:scale-105">
        {/* Fallback gradient if video isn't available */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500"></div>
        
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          loop
          muted
          playsInline
        >
          <source src="/ai-avatar.mp4" type="video/mp4" />
        </video>
        
        {/* Status indicator */}
        <div className={`absolute bottom-4 right-4 w-4 h-4 rounded-full ${isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-indigo-200'}`}></div>
      </div>
      
      {/* Speaking indicator */}
      {isSpeaking && (
        <div className="mt-2 text-center">
          <span className="inline-block px-3 py-1 text-xs font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-pulse">
            Speaking...
          </span>
        </div>
      )}
    </div>
  );
};

export default AIAvatar;
