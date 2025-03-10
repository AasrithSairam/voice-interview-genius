
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
    <div className="relative w-64 h-64 mx-auto">
      <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl" />
      <video
        ref={videoRef}
        className="relative w-full h-full rounded-full object-cover"
        loop
        muted
        playsInline
      >
        <source src="/ai-avatar.mp4" type="video/mp4" />
      </video>
    </div>
  );
};

export default AIAvatar;
