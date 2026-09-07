import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className, ...props }) => {
  // Start with a transparent placeholder to prevent layout shifts
  const [imageSrc, setImageSrc] = useState('data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==');
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let observer: IntersectionObserver;
    const currentImageRef = imageRef.current;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Preload the image in memory
          const img = new Image();
          img.src = src;
          img.onload = () => {
            // Once the image is loaded, update the state to trigger a re-render
            setImageSrc(src);
            setIsLoaded(true);
          };
          img.onerror = () => {
            console.error(`Image failed to load: ${src}`);
            // Optionally, set a fallback image source here
          };

          // Stop observing the element once we've started loading
          if (currentImageRef) {
            observer.unobserve(currentImageRef);
          }
        }
      });
    };

    if (currentImageRef) {
      observer = new IntersectionObserver(handleIntersection, {
        threshold: 0.1, // Start loading when 10% of the image is visible
      });
      observer.observe(currentImageRef);
    }

    // Cleanup function to unobserve the element when the component unmounts
    return () => {
      if (observer && currentImageRef) {
        observer.unobserve(currentImageRef);
      }
    };
  }, [src]); // Re-run the effect if the image src changes

  // Apply CSS classes for a smooth fade-in effect
  const combinedClassName = `
    ${className}
    transition-opacity duration-500 ease-in-out
    ${isLoaded ? 'opacity-100' : 'opacity-0'}
  `;

  return <img ref={imageRef} src={imageSrc} alt={alt} className={combinedClassName} {...props} />;
};

export default LazyImage;
