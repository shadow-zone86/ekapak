'use client';

import { useEffect, useState, useRef } from 'react';

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Анимация прогресса
    const spinnerProgress = progressRef.current;
    if (!spinnerProgress) return;

    let startTime: number | null = null;
    let e: boolean = false; // флаг загрузки страницы
    const duration = 5000; // 5 секунд
    const from = 0;
    const to = 75;

    const animate = (currentTime: number) => {
      if (!startTime) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const width = Math.floor(progress * (to - from) + from);

      spinnerProgress.style.width = width + '%';

      // Если страница загрузилась, сразу 100%
      if (e) {
        spinnerProgress.style.width = '100%';
        return;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);

    // Скрываем спиннер после загрузки страницы
    const handleLoad = (): void => {
      e = true;
      if (spinnerProgress) {
        spinnerProgress.style.width = '100%';
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    // Fallback: скрываем через 5 секунд максимум
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(timeout);
    };
  }, []);

  if (!isLoading) {
    return null;
  }

  return (
    <div
      id="spinner"
      className={`fixed inset-0 z-[100000] bg-white transition-opacity duration-[400ms] ease-out ${
        isLoading ? 'opacity-100' : 'opacity-0 invisible pointer-events-none'
      }`}
      style={{ transitionDelay: isLoading ? '800ms' : '0ms' }}
    >
      <div className="loading-logo absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Фоновый логотип (полупрозрачный, серый) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.svg"
          alt="Loading"
          width={153}
          height={19}
          style={{
            opacity: 0.2,
            filter: 'grayscale(100%)',
          }}
        />
        {/* Прогресс-бар с закрашиванием слева направо */}
        <div
          ref={progressRef}
          className="loading-logo__progress absolute top-0 left-0 h-full overflow-hidden transition-all duration-[400ms]"
          style={{ width: '0%' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="Loading"
            width={153}
            height={19}
            style={{ maxWidth: 'none', verticalAlign: 'middle' }}
          />
        </div>
      </div>
    </div>
  );
}
