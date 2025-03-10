
const VoiceVisualizer = ({ isListening }: { isListening: boolean }) => {
  const bars = [5, 7, 5, 8, 6, 4, 7, 5]; // Different heights for more natural look

  return (
    <div className="flex items-center justify-center gap-1 h-12 my-4">
      {bars.map((height, i) => (
        <div
          key={i}
          className={`w-1.5 rounded-full transition-all duration-300 ${
            isListening 
              ? 'animate-[bounce_1s_ease-in-out_infinite] bg-gradient-to-t from-purple-500 to-indigo-600' 
              : 'bg-purple-300/50'
          }`}
          style={{
            animationDelay: `${i * 0.1}s`,
            height: isListening ? `${height / 10 * 3}rem` : '0.25rem',
            transform: isListening ? 'scaleY(1)' : 'scaleY(0.5)',
            transformOrigin: 'bottom'
          }}
        />
      ))}
    </div>
  );
};

export default VoiceVisualizer;
