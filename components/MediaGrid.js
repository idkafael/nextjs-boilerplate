import { useRef, useState } from 'react';

export default function MediaGrid() {
  const videoRefs = useRef({});
  const [playingVideos, setPlayingVideos] = useState({});
  
  const media = [
    { src: '/images/lateral-1.mp4', type: 'video' },
    { src: '/images/lateral-2.mp4', type: 'video' },
    { src: '/images/lateral-3.jpg', type: 'image' },
    { src: '/images/lateral-4.mp4', type: 'video' },
    { src: '/images/lateral-5.mp4', type: 'video' },
    { src: '/images/lateral-6.mp4', type: 'video' },
    { src: '/images/lateral-7.mp4', type: 'video' },
    { src: '/images/lateral-8.mp4', type: 'video' },
    { src: '/images/lateral-9.mp4', type: 'video' },
  ];

  const handleMouseEnter = (index) => {
    const video = videoRefs.current[`video-${index}`];
    if (video && video.paused) {
      video.play().then(() => {
        setPlayingVideos(prev => ({ ...prev, [index]: true }));
      }).catch(err => {
        console.log('Erro ao reproduzir vídeo:', err);
        setPlayingVideos(prev => ({ ...prev, [index]: false }));
      });
    }
  };

  const handleMouseLeave = (index) => {
    const video = videoRefs.current[`video-${index}`];
    if (video && !video.paused) {
      video.pause();
      video.currentTime = 0; // Resetar para o início
      setPlayingVideos(prev => ({ ...prev, [index]: false }));
    }
  };

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {media.map((item, index) => (
        <div 
          key={index} 
          className="aspect-square relative media-item" 
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={() => handleMouseLeave(index)}
        >
          {item.type === 'video' ? (
            <video 
              ref={(el) => (videoRefs.current[`video-${index}`] = el)}
              className="w-full h-full object-cover rounded-lg media-blur transition-all duration-300" 
              muted 
              loop
              playsInline
            >
              <source src={item.src} type="video/mp4" />
              Seu navegador não suporta vídeos HTML5.
            </video>
          ) : (
            <img src={item.src} alt={`Media ${index + 1}`} className="w-full h-full object-cover rounded-lg media-blur transition-all duration-300" />
          )}
          <div 
            className="absolute inset-0 media-overlay rounded-lg transition-opacity duration-300" 
            style={{ 
              opacity: item.type === 'video' && playingVideos[index] ? 0 : 1 
            }}
          ></div>
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none play-icon" 
            style={{ 
              opacity: item.type === 'video' && playingVideos[index] ? 0 : 0.7 
            }}
          >
            <svg className="w-8 h-8 text-white transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}

