import { useRef, useState, useEffect } from 'react';

export default function MediaGrid() {
  const videoRefs = useRef({});
  const [playingVideos, setPlayingVideos] = useState({});
  const [loadedVideos, setLoadedVideos] = useState({});
  
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

  // Lazy load vídeos apenas quando entrarem na viewport
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.dataset.index);
          setLoadedVideos(prev => ({ ...prev, [index]: true }));
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px' // Carregar 50px antes de entrar na viewport
    });

    // Observar apenas vídeos
    media.forEach((item, index) => {
      if (item.type === 'video') {
        const element = document.querySelector(`[data-media-index="${index}"]`);
        if (element) {
          observer.observe(element);
        }
      }
    });

    return () => observer.disconnect();
  }, []);

  const handleMouseEnter = (index) => {
    const video = videoRefs.current[`video-${index}`];
    if (video) {
      // Só carregar o vídeo quando hover (mobile não tem hover, então precisa de outra abordagem)
      if (!loadedVideos[index] && video.readyState === 0) {
        video.load();
        setLoadedVideos(prev => ({ ...prev, [index]: true }));
      }
      
      if (video.paused) {
        video.play().then(() => {
          setPlayingVideos(prev => ({ ...prev, [index]: true }));
        }).catch(err => {
          console.log('Erro ao reproduzir vídeo:', err);
          setPlayingVideos(prev => ({ ...prev, [index]: false }));
        });
      }
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
          data-media-index={index}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={() => handleMouseLeave(index)}
          onClick={(e) => {
            // Prevenir qualquer ação ao clicar nas mídias
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {item.type === 'video' ? (
            <video 
              ref={(el) => {
                if (el) {
                  videoRefs.current[`video-${index}`] = el;
                }
              }}
              className="w-full h-full object-cover rounded-lg media-blur transition-all duration-300" 
              muted 
              loop
              playsInline
              preload="none" // Não carregar até necessário
              loading="lazy" // Lazy loading nativo
            >
              <source src={item.src} type="video/mp4" />
              Seu navegador não suporta vídeos HTML5.
            </video>
          ) : (
            <img 
              src={item.src} 
              alt={`Media ${index + 1}`} 
              className="w-full h-full object-cover rounded-lg media-blur transition-all duration-300" 
              loading="lazy" // Lazy loading para imagens também
            />
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

