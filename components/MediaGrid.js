export default function MediaGrid({ onClick }) {
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

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {media.map((item, index) => (
        <div key={index} className="aspect-square relative media-item cursor-pointer" onClick={onClick}>
          {item.type === 'video' ? (
            <video className="w-full h-full object-cover rounded-lg media-blur" muted loop>
              <source src={item.src} type="video/mp4" />
              Seu navegador não suporta vídeos HTML5.
            </video>
          ) : (
            <img src={item.src} alt={`Media ${index + 1}`} className="w-full h-full object-cover rounded-lg media-blur" />
          )}
          <div className="absolute inset-0 media-overlay rounded-lg"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-8 h-8 text-white opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}

