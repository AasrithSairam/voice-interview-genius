
const VoiceVisualizer = ({ isListening }: { isListening: boolean }) => {
  return (
    <div className="flex items-center justify-center gap-1 h-8">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`w-1 bg-blue-500 rounded-full transition-all duration-200 ${
            isListening 
              ? 'animate-[bounce_1s_ease-in-out_infinite]' 
              : 'h-1'
          }`}
          style={{
            animationDelay: `${i * 0.1}s`,
            height: isListening ? '2rem' : '0.25rem'
          }}
        />
      ))}
    </div>
  );
};

export default VoiceVisualizer;
