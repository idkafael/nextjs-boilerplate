import { useRef, useState, useEffect } from 'react';

export default function MediaGrid() {
  const videoRefs = useRef({});
  const [playingVideos, setPlayingVideos] = useState({});
  const [loadedVideos, setLoadedVideos] = useState({});
  
  // Media com thumbnails/previews do Imgur
  // URLs do Imgur para otimização de performance
  const media = [
    { src: '/images/lateral-1.mp4', type: 'video', poster: 'https://i.imgur.com/GYyY5PV.jpg' },
    { src: '/images/lateral-2.mp4', type: 'video', poster: 'https://i.imgur.com/q7GscYv.jpg' },
    { src: 'https://i.imgur.com/nwTUHEw.jpg', type: 'image' },
    { src: '/images/lateral-4.mp4', type: 'video', poster: 'https://i.imgur.com/Urr2ZmU.jpg' },
    { src: '/images/lateral-5.mp4', type: 'video', poster: 'https://i.imgur.com/8YiUC2u.jpg' },
    { src: '/images/lateral-6.mp4', type: 'video', poster: 'https://i.imgur.com/E26zXLa.jpg' },
    { src: '/images/lateral-7.mp4', type: 'video', poster: 'https://i.imgur.com/DazJ1FY.jpg' },
    { src: '/images/lateral-8.mp4', type: 'video', poster: 'https://i.imgur.com/D4YmZku.jpg' },
    { src: '/images/lateral-9.mp4', type: 'video', poster: 'https://i.imgur.com/g55aWMb.jpg' },
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
    // No mobile, não pausar ao sair do hover (mobile não tem hover de verdade)
    // Deixar o vídeo continuar reproduzindo se foi iniciado por clique
    const video = videoRefs.current[`video-${index}`];
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Se for desktop e não estiver em modo "mantido" (por clique), pausar
    if (!isMobile && video && !video.paused && !video.dataset.keepPlaying) {
      video.pause();
      video.currentTime = 0; // Resetar para o início
      setPlayingVideos(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleClick = (index, itemType) => {
    const video = videoRefs.current[`video-${index}`];
    
    if (video && itemType === 'video') {
      // Toggle play/pause ao clicar
      if (video.paused) {
        // Carregar vídeo se ainda não foi carregado
        if (!loadedVideos[index] && video.readyState === 0) {
          video.load();
          setLoadedVideos(prev => ({ ...prev, [index]: true }));
        }
        
        // Iniciar reprodução
        video.play().then(() => {
          setPlayingVideos(prev => ({ ...prev, [index]: true }));
          video.dataset.keepPlaying = 'true'; // Marcar para manter reproduzindo
        }).catch(err => {
          console.log('Erro ao reproduzir vídeo:', err);
          setPlayingVideos(prev => ({ ...prev, [index]: false }));
        });
      } else {
        // Pausar se já está reproduzindo
        video.pause();
        video.currentTime = 0;
        setPlayingVideos(prev => ({ ...prev, [index]: false }));
        video.dataset.keepPlaying = 'false';
      }
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
            e.preventDefault();
            e.stopPropagation();
            // No mobile, permitir clique para togglear vídeo
            handleClick(index, item.type);
          }}
        >
          {item.type === 'video' ? (
            <>
              {/* Thumbnail/Preview - sempre visível com blur */}
              <img 
                src={item.poster || item.src.replace('.mp4', '.jpg')} 
                alt={`Preview ${index + 1}`}
                className={`w-full h-full object-cover rounded-lg media-blur transition-all duration-300 ${
                  playingVideos[index] ? 'opacity-0 absolute' : 'opacity-100'
                }`}
                loading="lazy"
                onError={(e) => {
                  // Se a imagem de preview não existir, tentar gerar do vídeo
                  e.target.style.display = 'none';
                }}
              />
              {/* Vídeo - só aparece quando reproduzindo, com blur reduzido */}
              <video 
                ref={(el) => {
                  if (el) {
                    videoRefs.current[`video-${index}`] = el;
                  }
                }}
                className={`w-full h-full object-cover rounded-lg transition-all duration-300 ${
                  playingVideos[index] 
                    ? 'opacity-100' 
                    : 'opacity-0 absolute top-0 left-0'
                } ${playingVideos[index] ? 'blur-0' : 'blur-5'}`}
                muted 
                loop
                playsInline
                preload="none" // Não carregar até necessário
                poster={item.poster || item.src.replace('.mp4', '.jpg')} // Fallback para poster
              >
                <source src={item.src} type="video/mp4" />
                Seu navegador não suporta vídeos HTML5.
              </video>
            </>
          ) : (
            <img 
              src={item.src} 
              alt={`Media ${index + 1}`} 
              className="w-full h-full object-cover rounded-lg media-blur transition-all duration-300" 
              loading="lazy" // Lazy loading para imagens também
            />
          )}
          {/* Overlay escuro - sempre visível, mas mais sutil quando reproduzindo */}
          <div 
            className="absolute inset-0 media-overlay rounded-lg transition-opacity duration-300 pointer-events-none" 
            style={{ 
              opacity: item.type === 'video' && playingVideos[index] ? 0.2 : 0.5 
            }}
          ></div>
          {/* Ícone de câmera - sempre visível quando é vídeo */}
          {item.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg className={`w-8 h-8 text-white transition-opacity duration-300 ${
                playingVideos[index] ? 'opacity-50' : 'opacity-70'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

