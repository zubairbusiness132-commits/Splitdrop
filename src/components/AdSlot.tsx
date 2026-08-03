import React, { useEffect, useRef, useState } from 'react';

interface AdSlotProps {
  type: 'banner' | 'native';
  className?: string;
  label?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ type, className = '', label = 'Advertisement' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptFailed, setScriptFailed] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = ''; // Clear previous render
    setScriptFailed(false);

    try {
      if (type === 'banner') {
        const confScript = document.createElement('script');
        confScript.type = 'text/javascript';
        confScript.text = `
          try {
            atOptions = {
              'key' : '8eeeccf2072fcd48b06becc3956fc8d5',
              'format' : 'iframe',
              'height' : 50,
              'width' : 320,
              'params' : {}
            };
          } catch (e) {}
        `;
        container.appendChild(confScript);

        const invokeScript = document.createElement('script');
        invokeScript.type = 'text/javascript';
        invokeScript.src = 'https://www.highperformanceformat.com/8eeeccf2072fcd48b06becc3956fc8d5/invoke.js';
        invokeScript.async = true;
        invokeScript.onerror = () => {
          setScriptFailed(true);
        };
        container.appendChild(invokeScript);
      } else {
        const nativeDiv = document.createElement('div');
        nativeDiv.id = 'container-d81652f9a9bf28726b372385ee394877';
        container.appendChild(nativeDiv);

        const invokeScript = document.createElement('script');
        invokeScript.async = true;
        invokeScript.setAttribute('data-cfasync', 'false');
        invokeScript.src = 'https://pl30654407.effectivecpmnetwork.com/d81652f9a9bf28726b372385ee394877/invoke.js';
        invokeScript.onerror = () => {
          setScriptFailed(true);
        };
        container.appendChild(invokeScript);
      }
    } catch (err) {
      console.warn('Ad script load prevented:', err);
      setScriptFailed(true);
    }
  }, [type]);

  return (
    <div className={`my-6 flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-3 min-h-[70px] ${className}`}>
      <span className="text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-1">
        {label}
      </span>
      {scriptFailed ? (
        <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium py-2">
          Ad Space Reserved
        </div>
      ) : (
        <div ref={containerRef} className="w-full max-w-[320px] sm:max-w-md flex justify-center items-center" />
      )}
    </div>
  );
};
